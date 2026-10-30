import assert from 'node:assert/strict';
import test from 'node:test';
import worker from './contact-form.mjs';

const env = { TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 're_test_secret' };

function request(body, origin = 'https://cyjimm.com') {
  return new Request('https://cyjimm.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body)
  });
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
  assert.equal(calls.length, 2);

  assert.equal(calls[1].url, 'https://api.resend.com/emails');
  assert.equal(calls[1].options.headers.Authorization, 'Bearer re_test_secret');
  const forwarded = JSON.parse(calls[1].options.body);
  assert.equal(forwarded.from, 'CyJimm Contact <contact@send.cyjimm.com>');
  assert.deepEqual(forwarded.to, ['madara@cyjimm.com']);
  assert.equal(forwarded.reply_to, validBody.email);
  assert.match(forwarded.subject, /General Inquiry/);
  assert.match(forwarded.text, /Please contact me\./);
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
