# Brief for Codex: Day 5 LinkedIn graphic + fact check

Work only inside `D:\Cyjimm.com - DC\marketing\`. Do NOT edit website files, `worker/`, or any other marketing file. Do NOT publish, send, or contact anything external. Do not use git.

Read first: `marketing/AI-MARKETING-ORCHESTRATION.md` (rules), `marketing/SOCIAL-DRAFTS.md` (section "LinkedIn - Day 5"), `team/index.html` (what the site really claims), and `marketing/assets/instagram-d3/d3-source.html` (the existing visual style and how it is rendered).

## Task A: one graphic

Create `marketing/assets/linkedin-d5/d5-documentation-v1.png`, exactly 1200x627 px, plus its HTML source `marketing/assets/linkedin-d5/d5-source.html`.

- Hebrew, RTL. Dark navy background like the Instagram slides (#0b1730 to #15305a), teal accent #2dd4bf, one warning accent #ff4664. Font: Arial. Text must be large and legible at LinkedIn feed size. Safe margin 60 px.
- Concept: a simple workflow/diagram showing that documentation is part of infrastructure security. Headline: `תיעוד הוא חלק מאבטחת התשתית`. Three connected nodes, left to right in RTL reading order, each one a question a current document should answer:
  1. `מה קיים ומי אחראי?`
  2. `איך מקבלים ומבטלים גישה?`
  3. `מה עושים כשמשהו קורס?`
- Footer: the text `CyJimm` and `cyjimm.com`. No logo image (the repo logo is the Jimmi's Hub logo, not CyJimm).
- No photos, no client names, no metrics, no certification badges, no invented tools or product names.
- Render with headless Chrome: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,627 --screenshot=<out.png> file:///<path>`. Verify the PNG size is 1200x627 and look at it. Fix wrapping, overlap or clipped text before finishing.

## Task B: fact check of the post draft

Write `marketing/agent-reports/codex-day5-factcheck.md`. For every sentence in the Day 5 LinkedIn draft, mark it SUPPORTED (cite the line in `team/index.html`), GENERIC ADVICE (no claim about CyJimm), or UNSUPPORTED (an implied claim the site does not back). Propose a minimal rewrite for anything UNSUPPORTED. Also flag anything that implies a team or clients (the profile is a personal one, first person only).

## Output

Reply with: the two file paths, the verified PNG size, and anything you were unsure about. Keep it short.
