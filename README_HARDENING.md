# CyJimm - Hardening Notes (GitHub Pages + Cloudflare)

This site is static and served via GitHub Pages behind Cloudflare. For **professional-grade security & privacy**, set the following **HTTP Security Headers** in Cloudflare (Rules > Transform Rules > Modify Response Header):

1) `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
2) `Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com; connect-src 'self' https://formsubmit.co https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; form-action 'self' https://formsubmit.co; upgrade-insecure-requests;`
3) `X-Content-Type-Options: nosniff`
4) `Referrer-Policy: no-referrer`
5) `Permissions-Policy: geolocation=(), microphone=(), camera=(), usb=(), fullscreen=(*);`
6) `Cross-Origin-Opener-Policy: same-origin`
7) `Cross-Origin-Resource-Policy: same-origin`
8) `X-Frame-Options: DENY` (redundant with CSP frame-ancestors, but fine)

Notes:
- Prefer headers via Cloudflare; the `<meta http-equiv="Content-Security-Policy">` in HTML is a **fallback only**.
- If you add third-party scripts (analytics, etc.), you must update CSP directives accordingly.
- The contact form posts to the same-origin `/api/contact` Worker route. The Worker validates Cloudflare Turnstile server-side before forwarding a sanitized payload to FormSubmit.
- Store `TURNSTILE_SECRET_KEY` as a Cloudflare Worker secret. Never commit it to the repository.

**Privacy**
- No tracking cookies or advertising trackers. The site uses the existing privacy-friendly Cloudflare Web Analytics integration described in the privacy policy. Update `privacy.html` if you change data flows.

**SEO**
- `robots.txt` and `sitemap.xml` are included. Submit the sitemap in Google Search Console once the domain is live.

**Bug Bounty / Disclosure**
- `.well-known/security.txt` is provided. Update contact emails.

