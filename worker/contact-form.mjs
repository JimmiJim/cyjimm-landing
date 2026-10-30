const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const CONTACT_RECIPIENT = 'madara@cyjimm.com';
const CONTACT_SENDER = 'CyJimm Contact <contact@send.cyjimm.com>';
const ALLOWED_ORIGINS = new Set(['https://cyjimm.com', 'https://www.cyjimm.com']);
const ALLOWED_HOSTNAMES = new Set(['cyjimm.com', 'www.cyjimm.com']);
const MAX_BODY_BYTES = 24_000;

const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff'
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: RESPONSE_HEADERS });
}

function text(value, maxLength, required = false) {
  if (typeof value !== 'string') return required ? null : '';
  const normalized = value.trim();
  if ((required && !normalized) || normalized.length > maxLength) return null;
  return normalized;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

async function readPayload(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error('payload-too-large');

  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) return request.json();
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    return Object.fromEntries(await request.formData());
  }
  throw new Error('unsupported-content-type');
}

async function verifyTurnstile(token, request, secret) {
  const verificationBody = new URLSearchParams({
    secret,
    response: token
  });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) verificationBody.set('remoteip', remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: verificationBody,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  if (!response.ok) return false;

  const result = await response.json();
  return result.success === true &&
    ALLOWED_HOSTNAMES.has(result.hostname) &&
    result.action === 'contact';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatText(payload) {
  return [
    `Service: ${payload.service}`,
    `Name: ${payload.name}`,
    `Company: ${payload.company || 'Not provided'}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || 'Not provided'}`,
    '',
    'Message:',
    payload.message
  ].join('\n');
}

function formatHtml(payload) {
  const rows = [
    ['Service', payload.service],
    ['Name', payload.name],
    ['Company', payload.company || 'Not provided'],
    ['Email', payload.email],
    ['Phone', payload.phone || 'Not provided']
  ].map(([label, value]) =>
    `<tr><th align="left" style="padding:8px;border:1px solid #ddd">${label}</th>` +
    `<td style="padding:8px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`
  ).join('');

  return `<h2>New CyJimm contact request</h2>` +
    `<table style="border-collapse:collapse">${rows}</table>` +
    `<h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`;
}

async function forwardSubmission(payload, apiKey) {
  const response = await fetch(RESEND_EMAIL_URL, {
    method: 'POST',
    body: JSON.stringify({
      from: CONTACT_SENDER,
      to: [CONTACT_RECIPIENT],
      reply_to: payload.email,
      subject: `CyJimm Contact: ${payload.service}`,
      text: formatText(payload),
      html: formatHtml(payload)
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cyjimm-contact-form/1.0'
    }
  });

  let result;
  try {
    result = await response.json();
  } catch (_) {
    console.error('Resend returned a non-JSON response.', { status: response.status });
    return false;
  }

  const delivered = response.ok && typeof result.id === 'string' && result.id.length > 0;
  if (!delivered) {
    console.error('Resend rejected the submission.', {
      status: response.status,
      error: result && typeof result.name === 'string' ? result.name : 'Unknown provider error',
      // Provider explanation, with any email address masked so visitor details stay out of logs.
      message: result && typeof result.message === 'string'
        ? result.message.replace(/[^\s@<>"']+@[^\s@<>"']+/g, '<email>').slice(0, 300)
        : 'No provider message'
    });
  }
  return delivered;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact') return json({ success: false, message: 'Not found.' }, 404);
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), {
        status: 405,
        headers: { ...RESPONSE_HEADERS, Allow: 'POST' }
      });
    }

    const origin = request.headers.get('Origin');
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return json({ success: false, message: 'Request origin was not accepted.' }, 403);
    }
    if (!env.TURNSTILE_SECRET_KEY) {
      return json({ success: false, message: 'Verification service is not configured.' }, 503);
    }
    if (!env.RESEND_API_KEY) {
      return json({ success: false, message: 'Delivery service is not configured.' }, 503);
    }

    let body;
    try {
      body = await readPayload(request);
    } catch (error) {
      const status = error.message === 'payload-too-large' ? 413 : 400;
      return json({ success: false, message: 'Invalid request.' }, status);
    }

    // Silently accept honeypot submissions so automated senders receive no useful signal.
    if (typeof body.website === 'string' && body.website.trim()) return json({ success: true });

    const service = text(body.service, 120, true);
    const name = text(body.name, 120, true);
    const company = text(body.company, 160);
    const email = text(body.email, 254, true);
    const phone = text(body.phone, 60);
    const message = text(body.message, 5_000, true);
    const token = text(body['cf-turnstile-response'], 2_048, true);

    if (!service || !name || !email || !validEmail(email) || company === null || phone === null || !message || !token || body.privacy !== 'accepted') {
      return json({ success: false, message: 'Please check the required fields.' }, 400);
    }

    let verified = false;
    try {
      verified = await verifyTurnstile(token, request, env.TURNSTILE_SECRET_KEY);
    } catch (_) {
      return json({ success: false, message: 'Verification service is temporarily unavailable.' }, 502);
    }
    if (!verified) return json({ success: false, message: 'Human verification failed. Please try again.' }, 403);

    const formPayload = {
      service,
      name,
      company,
      email,
      phone,
      message
    };

    try {
      const delivered = await forwardSubmission(formPayload, env.RESEND_API_KEY);
      if (!delivered) return json({ success: false, message: 'Delivery could not be confirmed.' }, 502);
      return json({ success: true });
    } catch (_) {
      return json({ success: false, message: 'Delivery service is temporarily unavailable.' }, 502);
    }
  }
};
