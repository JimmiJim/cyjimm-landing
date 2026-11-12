# Contact Worker deployment

Production uses the Cloudflare GitHub integration on `main`. Always commit the Worker, its email-logo module and tests together before deployment. A dashboard/Wrangler-only patch will be overwritten by the next GitHub build.

Run `node --test worker/contact-form.test.mjs` from the repository root. Wrangler also runs these offline tests through its `[build]` hook before bundling/deploying.

The Worker forwards an accepted inquiry to the internal contact inbox, then sends the previously approved branded acknowledgement to the visitor. If forwarding fails, it must not acknowledge receipt. If only acknowledgement fails, it logs the failure but does not invite duplicate inquiry submission.

Keep `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` in Cloudflare secrets, never in source. A successful provider API response means accepted for sending; Resend delivery events confirm recipient-server acceptance, not Inbox placement.

After deployment verify the active Cloudflare commit/version and do not claim end-to-end mailbox delivery until an authorized real submission is checked.
