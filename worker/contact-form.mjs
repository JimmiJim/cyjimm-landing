import { EMAIL_LOGO_BASE64 } from './email-logo.mjs';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const CONTACT_RECIPIENT = 'madara@cyjimm.com';
const PUBLIC_CONTACT_EMAIL = 'hello@cyjimm.com';
const CONTACT_SENDER = 'CyJimm Contact <contact@send.cyjimm.com>';
const BRAND_LOGO_CID = 'cyjimm-logo';
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

  // Content-Length can be omitted or understated, so enforce the limit against
  // the bytes that actually arrived before asking a parser to consume them.
  const rawBody = await request.clone().arrayBuffer();
  if (rawBody.byteLength > MAX_BODY_BYTES) throw new Error('payload-too-large');

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

function formatAcknowledgementText(payload) {
  return [
    `היי ${payload.name},`,
    '',
    `קיבלנו את פנייתך בנושא "${payload.service}".`,
    'תודה שפנית אלינו. נעבור על הפרטים ונחזור אליך בהקדם.',
    '',
    'בברכה,',
    'צוות CyJimm'
  ].join('\n');
}

function formatAcknowledgementHtml(payload) {
  const name = escapeHtml(payload.name);
  const service = escapeHtml(payload.service);

  return `<!doctype html>` +
    `<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>קיבלנו את פנייתך</title></head>` +
    `<body dir="rtl" style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,'Segoe UI',sans-serif;color:#172033;">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">קיבלנו את פנייתך ונחזור אליך בהקדם.</div>` +
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:#f3f4f6;">` +
    `<tr><td align="center" style="padding:32px 12px;">` +
    `<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(15,23,42,0.08);">` +
    `<tr><td align="center" bgcolor="#0b0b10" style="padding:22px 24px;background-color:#0b0b10;border-bottom:4px solid #e11d48;">` +
    `<img src="cid:${BRAND_LOGO_CID}" width="140" height="140" alt="Jimmi's Hub" style="display:block;width:140px;height:140px;margin:0 auto;border:0;">` +
    `</td></tr>` +
    `<tr><td align="right" style="padding:32px 36px 12px;text-align:right;direction:rtl;">` +
    `<div style="font-size:20px;line-height:30px;font-weight:700;color:#172033;">היי ${name},</div>` +
    `<p style="margin:16px 0 0;font-size:16px;line-height:28px;color:#334155;">קיבלנו את פנייתך בנושא:</p>` +
    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right" style="margin-top:10px;"><tr>` +
    `<td bgcolor="#fff1f2" style="padding:8px 14px;background-color:#fff1f2;border:1px solid #fecdd3;border-radius:999px;font-size:15px;line-height:22px;font-weight:700;color:#be123c;">${service}</td>` +
    `</tr></table>` +
    `</td></tr>` +
    `<tr><td align="right" style="padding:14px 36px 30px;text-align:right;direction:rtl;">` +
    `<p style="margin:0;font-size:16px;line-height:28px;color:#334155;">תודה שפנית אלינו. נעבור על הפרטים ונחזור אליך בהקדם.</p>` +
    `</td></tr>` +
    `<tr><td style="padding:0 36px;"><div style="height:1px;line-height:1px;background-color:#e5e7eb;">&nbsp;</div></td></tr>` +
    `<tr><td align="right" style="padding:24px 36px 28px;text-align:right;direction:rtl;">` +
    `<div style="font-size:14px;line-height:23px;color:#64748b;">בברכה,</div>` +
    `<div style="font-size:18px;line-height:27px;font-weight:700;color:#172033;">צוות CyJimm</div>` +
    `<div dir="ltr" style="padding-top:7px;text-align:right;font-size:13px;line-height:21px;color:#64748b;">` +
    `<a href="https://cyjimm.com" style="color:#be123c;text-decoration:none;">cyjimm.com</a>` +
    `<span style="color:#cbd5e1;"> &nbsp;|&nbsp; </span>` +
    `<a href="mailto:${PUBLIC_CONTACT_EMAIL}" style="color:#be123c;text-decoration:none;">${PUBLIC_CONTACT_EMAIL}</a>` +
    `</div>` +
    `</td></tr>` +
    `</table>` +
    `<div style="padding-top:14px;font-size:11px;line-height:18px;color:#94a3b8;text-align:center;direction:rtl;">הודעה זו נשלחה אוטומטית לאחר קבלת פנייתך באתר CyJimm.</div>` +
    `</td></tr></table></body></html>`;
}

async function sendEmail(message, apiKey, logContext) {
  const response = await fetch(RESEND_EMAIL_URL, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  let result;
  try {
    result = await response.json();
  } catch (_) {
    console.error('Resend returned a non-JSON response.', { context: logContext, status: response.status });
    return false;
  }

  const delivered = response.ok && typeof result.id === 'string' && result.id.length > 0;
  if (!delivered) {
    console.error('Resend rejected the email.', {
      context: logContext,
      status: response.status,
      error: result && typeof result.name === 'string' ? result.name : 'Unknown provider error'
    });
  }
  return delivered;
}

async function forwardSubmission(payload, apiKey) {
  return sendEmail({
      from: CONTACT_SENDER,
      to: [CONTACT_RECIPIENT],
      reply_to: payload.email,
      subject: `CyJimm Contact — ${payload.service}`,
      text: formatText(payload),
      html: formatHtml(payload)
    }, apiKey, 'contact-forward');
}

async function sendAcknowledgement(payload, apiKey) {
  return sendEmail({
    from: CONTACT_SENDER,
    to: [payload.email],
    reply_to: PUBLIC_CONTACT_EMAIL,
    subject: 'קיבלנו את פנייתך – CyJimm',
    text: formatAcknowledgementText(payload),
    html: formatAcknowledgementHtml(payload),
    attachments: [{
      content: EMAIL_LOGO_BASE64,
      filename: 'cyjimm-logo.png',
      content_type: 'image/png',
      content_id: BRAND_LOGO_CID
    }]
  }, apiKey, 'contact-acknowledgement');
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

      // The inquiry is already safely delivered. A temporary acknowledgement failure
      // must not invite the visitor to resubmit and create a duplicate inquiry.
      try {
        await sendAcknowledgement(formPayload, env.RESEND_API_KEY);
      } catch (error) {
        console.error('Could not send contact acknowledgement.', {
          error: error instanceof Error ? error.message : 'Unknown delivery error'
        });
      }
      return json({ success: true });
    } catch (_) {
      return json({ success: false, message: 'Delivery service is temporarily unavailable.' }, 502);
    }
  }
};
