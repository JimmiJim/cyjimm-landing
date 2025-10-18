# CyJimm — Hardening Notes (GitHub Pages + Cloudflare)

This site is static and served via GitHub Pages behind Cloudflare. For **professional-grade security & privacy**, set the following **HTTP Security Headers** in Cloudflare (Rules > Transform Rules > Modify Response Header):

1) `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
2) `Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://formspree.io; form-action https://formspree.io; frame-ancestors 'none'; upgrade-insecure-requests;`
3) `X-Content-Type-Options: nosniff`
4) `Referrer-Policy: no-referrer`
5) `Permissions-Policy: geolocation=(), microphone=(), camera=(), usb=(), fullscreen=(*);`
6) `Cross-Origin-Opener-Policy: same-origin`
7) `Cross-Origin-Resource-Policy: same-origin`
8) `X-Frame-Options: DENY` (redundant with CSP frame-ancestors, but fine)

Notes:
- Prefer headers via Cloudflare; the `<meta http-equiv="Content-Security-Policy">` in HTML is a **fallback only**.
- If you add third-party scripts (analytics, etc.), you must update CSP directives accordingly.
- Replace the Formspree endpoint in the contact form with your own endpoint (and enable spam protection/honeypot).

**Privacy**
- No cookies, no trackers. Make sure any added tool respects this. Update `privacy.html` if you change data flows.

**SEO**
- `robots.txt` and `sitemap.xml` are included. Submit the sitemap in Google Search Console once the domain is live.

**Bug Bounty / Disclosure**
- `.well-known/security.txt` is provided. Update contact emails.

