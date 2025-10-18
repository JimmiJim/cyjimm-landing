# CHANGES – Hardened build (GitHub Pages)

- Inline CSS moved to `./assets/site.css` and inline JS to `./assets/app.js`.
- Added strict Content-Security-Policy via `<meta http-equiv>` (works on GH Pages).
- Added `referrer` policy meta.
- Clean single-brand header (logo + name), RTL aligned.
- Prepared for Cloudflare headers via `security_headers_template.txt` (optional if proxying).
