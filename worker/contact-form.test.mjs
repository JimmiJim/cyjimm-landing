import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import worker from './contact-form.mjs';
import { EMAIL_LOGO_BASE64 } from './email-logo.mjs';
import { CYJIMM_EMAIL_LOGO_BASE64 } from './cyjimm-email-logo.mjs';

const env = { TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 're_test_secret' };

function request(body, origin = 'https://cyjimm.com') {
  return new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body)
  });
}

function mockSuccessfulDelivery() {
  globalThis.fetch = async (url) => {
    if (String(url).includes('/siteverify')) {
      return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    }
    return Response.json({ id: 'email_123' });
  };
}

const validBody = {
  service: 'General Inquiry',
  name: 'Test User',
  company: '',
  email: 'test@example.com',
  phone: '',
  message: 'Please contact me.',
  privacy: 'accepted',
  website: '',
  'cf-turnstile-response': 'valid-token'
};

test('contact Worker validates Turnstile before forwarding a sanitized submission', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/siteverify')) {
      return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    }
    return Response.json({ id: 'email_123' });
  };

  const response = await worker.fetch(request(validBody), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(calls.length, 3);

  assert.equal(calls[1].url, 'https://api.resend.com/emails');
  assert.equal(calls[1].options.headers.Authorization, 'Bearer re_test_secret');
  const forwarded = JSON.parse(calls[1].options.body);
  assert.equal(forwarded.from, 'CyJimm Contact <contact@send.cyjimm.com>');
  assert.deepEqual(forwarded.to, ['madara@cyjimm.com']);
  assert.equal(forwarded.reply_to, validBody.email);
  assert.match(forwarded.subject, /General Inquiry/);
  assert.match(forwarded.text, /Please contact me\./);

  assert.equal(calls[2].url, 'https://api.resend.com/emails');
  const acknowledgement = JSON.parse(calls[2].options.body);
  assert.equal(acknowledgement.from, 'CyJimm Contact <contact@send.cyjimm.com>');
  assert.deepEqual(acknowledgement.to, [validBody.email]);
  assert.equal(acknowledgement.reply_to, 'hello@cyjimm.com');
  assert.match(acknowledgement.subject, /קיבלנו את פנייתך/);
  assert.match(acknowledgement.text, /היי Test User,/);
  assert.match(acknowledgement.text, /General Inquiry/);
  assert.match(acknowledgement.html, /dir="rtl"/);
  assert.doesNotMatch(acknowledgement.html, /cid:cyjimm-logo|Jimmi/);
  assert.match(acknowledgement.html, /cid:cyjimm-brand-logo/);
  assert.match(acknowledgement.html, /צוות CyJimm/);
  assert.match(acknowledgement.html, /cyjimm\.com/);
  assert.match(acknowledgement.html, /mailto:hello@cyjimm\.com/);
  assert.doesNotMatch(acknowledgement.html, /madara@cyjimm\.com/);
  assert.equal(acknowledgement.attachments[0].content, CYJIMM_EMAIL_LOGO_BASE64);
  assert.equal(acknowledgement.attachments[0].content_id, 'cyjimm-brand-logo');
});

test('contact Worker accepts the inquiry when only the acknowledgement is rejected', async () => {
  let emailCall = 0;
  globalThis.fetch = async (url) => {
    if (String(url).includes('/siteverify')) {
      return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    }
    emailCall += 1;
    if (emailCall === 1) return Response.json({ id: 'email_forwarded' });
    return Response.json({ name: 'rate_limit_exceeded' }, { status: 429 });
  };

  const response = await worker.fetch(request(validBody), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(emailCall, 2);
});

test('contact Worker rejects missing verification tokens', async () => {
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called');
  };
  const body = { ...validBody };
  delete body['cf-turnstile-response'];

  const response = await worker.fetch(request(body), env);
  assert.equal(response.status, 400);
});

test('contact Worker rejects failed Turnstile verification', async () => {
  globalThis.fetch = async () => Response.json({ success: false });
  const response = await worker.fetch(request(validBody), env);
  assert.equal(response.status, 403);
});

test('contact Worker rejects cross-origin submissions', async () => {
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called');
  };
  const response = await worker.fetch(request(validBody, 'https://example.net'), env);
  assert.equal(response.status, 403);
});

test('contact Worker reports provider rejection without exposing provider details', async () => {
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('/siteverify')) {
      return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    }
    return Response.json({ name: 'validation_error', message: 'Rejected' }, { status: 422 });
  };

  const response = await worker.fetch(request(validBody), env);
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { success: false, message: 'Delivery could not be confirmed.' });
});

test('contact Worker requires a Resend API key', async () => {
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called');
  };
  const response = await worker.fetch(request(validBody), { TURNSTILE_SECRET_KEY: 'test-secret' });
  assert.equal(response.status, 503);
});

test('contact Worker rejects an oversized body without Content-Length', async () => {
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called');
  };
  const oversizedRequest = new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://cyjimm.com' },
    body: JSON.stringify({ ...validBody, message: 'x'.repeat(24_000) })
  });
  assert.equal(oversizedRequest.headers.get('Content-Length'), null);

  const response = await worker.fetch(oversizedRequest, env);
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { success: false, message: 'Invalid request.' });
});

test('contact Worker rejects an oversized body with understated Content-Length', async () => {
  globalThis.fetch = async () => {
    throw new Error('fetch should not be called');
  };
  const oversizedRequest = new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '1',
      Origin: 'https://cyjimm.com'
    },
    body: JSON.stringify({ ...validBody, message: 'x'.repeat(24_000) })
  });

  const response = await worker.fetch(oversizedRequest, env);
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { success: false, message: 'Invalid request.' });
});

test('contact Worker accepts a legitimate URL-encoded submission', async () => {
  mockSuccessfulDelivery();
  const response = await worker.fetch(new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://cyjimm.com'
    },
    body: new URLSearchParams(validBody)
  }), env);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
});

test('contact Worker accepts a legitimate multipart submission', async () => {
  mockSuccessfulDelivery();
  const form = new FormData();
  for (const [key, value] of Object.entries(validBody)) form.set(key, value);
  const response = await worker.fetch(new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: { Origin: 'https://cyjimm.com' },
    body: form
  }), env);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
});

// Regression: a failed internal delivery must never acknowledge receipt to a visitor.
test('does not acknowledge an inquiry when forwarding fails', async () => {
  const messages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('/siteverify')) return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    messages.push(JSON.parse(options.body));
    return Response.json({ name: 'validation_error' }, { status: 422 });
  };
  const response = await worker.fetch(request(validBody), env);
  assert.equal(response.status, 502);
  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0].to, ['madara@cyjimm.com']);
});

test('escapes visitor content in both HTML messages', async () => {
  const messages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('/siteverify')) return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
    messages.push(JSON.parse(options.body));
    return Response.json({ id: 'email_test' });
  };
  const response = await worker.fetch(request({ ...validBody, name: '<script>alert(1)</script>', service: '<img src=x>' }), env);
  assert.equal(response.status, 200);
  assert.equal(messages.length, 2);
  for (const message of messages) {
    assert.doesNotMatch(message.html, /<script>|<img src=x>/);
    assert.match(message.html, /&lt;script&gt;/);
    assert.match(message.html, /&lt;img src=x&gt;/);
  }
});

test('honeypot submissions send no messages', async () => {
  globalThis.fetch = async () => { throw new Error('fetch must not be called'); };
  const response = await worker.fetch(request({ ...validBody, website: 'spam' }), env);
  assert.equal(response.status, 200);
});


for (const service of ['שירותי מחשוב לבית ולעסק קטן', 'Home and Small Business IT Services']) {
  test(`Hub acknowledgement for exact private-it option: ${service}`, async () => {
    const messages = [];
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('/siteverify')) return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
      assert.equal(String(url), 'https://api.resend.com/emails');
      messages.push(JSON.parse(options.body));
      return Response.json({ id: 'mock_only' });
    };
    assert.equal((await worker.fetch(request({ ...validBody, service }), env)).status, 200);
    const [forwarded, ack] = messages;
    assert.equal(forwarded.from, 'CyJimm Contact <contact@send.cyjimm.com>');
    assert.deepEqual(forwarded.to, ['madara@cyjimm.com']);
    assert.equal(ack.from, "Jimmi's Hub Contact <contact@send.cyjimm.com>");
    assert.equal(ack.subject, "קיבלנו את פנייתך – Jimmi's Hub");
    assert.match(ack.text, /צוות Jimmi's Hub/);
    assert.doesNotMatch(ack.html, /From Chaos to Code/);
    assert.match(ack.html, /צוות Jimmi&#39;s Hub/);
    assert.match(ack.html, /cid:cyjimm-logo/);
    assert.equal(ack.attachments.length, 1);
    assert.equal(ack.attachments[0].content_id, 'cyjimm-logo');
    assert.equal(ack.attachments[0].content, EMAIL_LOGO_BASE64);
    assert.notEqual(ack.attachments[0].content, CYJIMM_EMAIL_LOGO_BASE64);
    assert.doesNotMatch(ack.html, /cid:cyjimm-brand-logo/);
    assert.deepEqual(ack.to, [validBody.email]);
    assert.equal(ack.reply_to, 'hello@cyjimm.com');
  });
}

for (const service of ['פנייה כללית', 'General Inquiry', 'פנייה בנושא בניית אתרים', 'Website Development Inquiry', 'IT מנוהל ותשתיות', 'Managed IT and Infrastructure', 'אבטחת מידע ובדיקות', 'Cybersecurity and Assessments', 'אוטומציה ו־DevSecOps', 'Automation and DevSecOps', 'unknown', "Jimmi's Hub", 'private-it']) {
  test(`Non-Hub/default branding: ${service}`, async () => {
    const messages = [];
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('/siteverify')) return Response.json({ success: true, hostname: 'cyjimm.com', action: 'contact' });
      assert.equal(String(url), 'https://api.resend.com/emails');
      messages.push(JSON.parse(options.body));
      return Response.json({ id: 'mock_only' });
    };
    assert.equal((await worker.fetch(request({ ...validBody, service, message: "Jimmi's Hub", source: 'private-it', brand: "Jimmi's Hub" }), env)).status, 200);
    assert.deepEqual(messages[0].to, ['madara@cyjimm.com']);
    assert.equal(messages[0].reply_to, validBody.email);
    const ack = messages[1];
    assert.equal(ack.from, 'CyJimm Contact <contact@send.cyjimm.com>');
    assert.equal(ack.subject, 'קיבלנו את פנייתך – CyJimm');
    assert.match(ack.text, /צוות CyJimm/);
    assert.match(ack.text, /From Chaos to Code/);
    assert.match(ack.html, /dir="ltr"[^>]*>From Chaos to Code<\/div>/);
    assert.equal(ack.html.split('From Chaos to Code').length - 1, 1);
    assert.match(ack.html, /צוות CyJimm/);
    assert.match(ack.html, /cid:cyjimm-brand-logo/);
    assert.doesNotMatch(ack.html, /cid:cyjimm-logo/);
    assert.equal(ack.attachments.length, 1);
    assert.equal(ack.attachments[0].content, CYJIMM_EMAIL_LOGO_BASE64);
    assert.notEqual(ack.attachments[0].content, EMAIL_LOGO_BASE64);
    assert.equal(ack.attachments[0].content_type, 'image/png');
    assert.equal(ack.attachments[0].content_id, 'cyjimm-brand-logo');
  });
}

// Lock the visually verified owner artwork, not merely a distinct CID.
test('general logo is the reviewed 420px CyJimm PNG derivative', () => {
  const png = Buffer.from(CYJIMM_EMAIL_LOGO_BASE64, 'base64');
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 420);
  assert.equal(png.readUInt32BE(20), 420);
  assert.equal(createHash('sha256').update(png).digest('hex'), 'f4e030b2f752668396e5775423491db5c369e35f4d84a01ca91119e4d2371ef8');
});
