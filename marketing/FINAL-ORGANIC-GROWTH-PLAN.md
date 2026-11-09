# CyJimm — Final Organic Growth Plan

## Confirmed decisions (2026-11-07)

- G1/G4: Matan approved the first site link, CTA, title, and topic-cluster fixes.
- G2: Instagram Business account `autvjdn` is confirmed as the intended account.
- G4: `/team/` is the canonical profile page and the campaign destination for founder/authority content.
- G6: Jimmi's Hub serves SMBs and private users with computer repair, networking, and IT support. No geographic service-area claim will be made until one is explicitly supplied.
- G3 remains per publication: exact text, media, account, audience, URL, and timing must be approved before posting.
- Visual gate: every future post requires suitable platform-specific graphics. Text-only publishing is blocked unless Matan explicitly makes a one-post exception.

Date: 2026-11-07 · Owner: Matan (approver) · Status: **ACTIVE — the first approved LinkedIn post was published; every subsequent item remains gated.**

Sources: `marketing/AI-MARKETING-ORCHESTRATION.md`, `marketing/agent-reports/claude-seo.md`, `marketing/agent-reports/codex-growth.md`, `marketing/CONTENT-CALENDAR.md`, `marketing/SOCIAL-DRAFTS.md`. I spot-checked some claims against the working-tree HTML (read-only), listed in §2.

Legend: **[Fact]** = seen in the repo or a source file · **[Rec]** = recommendation · **[Gate]** = Matan must approve explicitly before anyone acts.

---

## 1. Summary

The site is crawlable and technically sound (Codex: 29/29 pages have title, description, canonical, OG, one H1; sitemap and hreflang are consistent). Three things stand in the way of organic growth:

1. **Campaign pages are hard to reach.** `/phishing-awareness/` and `/about/` are orphan pages: the only link to each comes from its own language twin (Claude SEO §1).
2. **There is no measurement.** The repo has no analytics beacon, no conversion event, and no UTM capture. The contact flow keeps only `service` (Codex §4). A campaign run today cannot be tied to inquiries.
3. **The drafts and calendar have factual mismatches** (§4). Publishing them as written would break the "no invented claims" rule.

**Order of work:** decisions and gates → small site fixes for linking and CTAs → minimal measurement → a 2-week social run using the revised calendar → review → new content, only after query data has been checked.

---

## 2. Evidence I checked, and conflicts between the reports

| Claim | Source | Verified 2026-11-07 (read-only) | Result |
|---|---|---|---|
| Hebrew home meta description is 216 chars | Codex §1 | `index.html:9` = **133 chars** | Codex figure is **outdated**. Claude SEO is correct. Codex line numbers for the Hebrew pages may also be off. |
| HE `/websites/` 220, HE `/jimmis-hub/` 270 chars | Codex §1 | 124 and **163** | Outdated. HE Jimmi's Hub is still slightly long (~155 is the target). |
| EN `/websites/` 223, EN `/jimmis-hub/` 199 chars | both | 223 and 199 | Confirmed. These still need trimming. |
| Both phishing pages are titled `CyJimm \| Phishing Awareness` | both | Confirmed | Still needs fixing. |
| `/team/` title has no role terms | Claude SEO | `CyJimm - מתן ג'מיל` | Confirmed. |
| `/phishing-awareness/` has no contextual next step | both | The page's links are nav, footer, and `/contact/` in the nav only | Confirmed. |
| `/phishing-awareness/` is an **interactive exercise** | LinkedIn draft | 0 `data-phishing` hooks on that page; the interactive game is `/guides/it-lab/` | **The draft claim is wrong** (see §4). |

Not verified by anyone: live rendering, index coverage, Search Console queries, keyword volume, Core Web Vitals, backlinks, production response headers, and whether Cloudflare Web Analytics is actually running.

---

## 3. Account constraints

| Channel | Status (orchestration file, 2026-11-07) | What it means for this plan |
|---|---|---|
| LinkedIn | Active. Verified **personal** profile, Matan-Jimmi Jamil | The primary channel. Posts appear as Matan personally, not as a company page. Write in first person and avoid "we" claims about a team or clients. |
| Instagram | Business account `autvjdn` is active and confirmed by Matan | Posting and bio changes still require G3 approval of the exact content and destination. |
| Facebook | User connection exists. **No managed Page** is available through the API | Out of scope. The Facebook draft stays withheld. Creating a Page is a separate decision. |
| X / Twitter | Not connected | Out of scope. |
| TikTok | Not connected | Out of scope. |
| Agents | Antigravity is pending workspace trust. Gemini is unavailable | Neither may act. This plan doesn't depend on them. |

Standing rules (from the orchestration file, apply to everything below): no agent publishes, sends, comments, follows, likes, or modifies any external account without Matan's approval of the **exact text, media, account, and audience**. No invented claims, clients, certifications, metrics, or testimonials. No internal or client information. Each public post has one idea, one destination URL, and one measurable CTA.

---

## 4. Problems in the current drafts and calendar (fix before approval)

1. **The LinkedIn draft makes a false claim.** It says "בניתי ב‑CyJimm תרגול אינטראקטיבי קצר" but links to `/phishing-awareness/`, which is a written guide with 9 signs and "what if I clicked". The interactive game is `/guides/it-lab/`.
   - [Rec] Keep `/phishing-awareness/` as the destination (Calendar Day 1, the strongest content asset) and replace that sentence with something accurate, for example: `ריכזתי ב‑CyJimm מדריך קצר: 9 סימנים לזיהוי פישינג ו‑SMS מתחזה, ומה עושים אם כבר לחצתם.` → **G3**
2. **The Instagram caption has no measurable destination.** It relies on "link in bio", which requires changing the account (**G2**). The bio URL should carry a UTM (§7).
3. **No draft has a UTM yet**, although the calendar requires one before publication.
4. **Day 13 promises content that doesn't exist.** "What a small business actually needs from an IT provider" points to `/`, which doesn't answer that question (Claude SEO §7).
   - [Rec] Reword it to match what `/` actually offers (infrastructure, Microsoft 365, security, with a service-specific CTA once P1-3 is live), or postpone it until the SMB checklist page (P3-2) exists.
5. **Day 1 and Day 5 send traffic to orphan pages** with no next step. Do P1-1 and P1-2 first, or those visits go nowhere.
6. **Day 10 has a "local service awareness" goal, but the site has no location signal** (`/jimmis-hub/`, `/contact/`, home JSON-LD). Matan has to state the real service area (**G6**). Don't guess one.

---

## 5. Prioritized execution plan

Priority is ordered by (campaign blocking × impact) ÷ effort. Effort: XS < 1 h, S ≈ half a day, M ≈ 1–2 days.

### P0 — Decisions and gates (Matan; no work starts until these are done)

| # | Decision | Gate |
|---|---|---|
| P0-1 | Approve this plan and its order | G1 |
| P0-2 | Confirm whether Instagram `autvjdn` is the intended CyJimm account. **Confirmed.** | G2 |
| P0-3 | State the real service area for Jimmi's Hub, or explicitly choose "no location claim". **No location claim for this run.** | G6 |
| P0-4 | Pick one canonical profile page. **`/team/` selected.** | G4 |
| P0-5 | Confirm whether Cloudflare Web Analytics is live in production (check the Cloudflare dashboard) and whether it reports campaign/query data | G7 |
| P0-6 | Confirm which services to promote. Red team / pentest and DevSecOps are listed as "זמינים לפי היקף פרויקט"; don't expand on them without confirmation | G4 |

### P1 — Site changes before the campaign (repository work; each change needs **G4** approval of the exact copy/diff)

| # | Change | Targets | Effort | Why it comes first | Source |
|---|---|---|---|---|---|
| P1-1 | Link `/phishing-awareness/` from nav or footer, the home services section, and the `/guides/` hub. Mirror on `/en/` | nav/footer partials, `index.html`, `guides/index.html`, EN twins | XS | Fixes orphan #1, the Day 1 destination | SEO §4, §6#1 |
| P1-2 | Link `/about/` from `/team/` (or apply the G4 consolidation) and from `/websites/` | `team/`, `websites/`, EN twins | XS | Fixes orphan #2, the Day 5 destination | SEO §4 |
| P1-3 | Add a contextual end-of-page CTA on the phishing pages (`/contact/?service=security`) and one CTA per home service card (`managed-it`, `security`, `automation`) | `phishing-awareness/`, `index.html`, EN twins | S | Turns awareness traffic into a qualified path | Codex §2, P1 backlog |
| P1-4 | Fix titles: phishing HE `איך לזהות פישינג ו-SMS מתחזה \| CyJimm`, EN `How to Spot Phishing Emails and SMS \| CyJimm`. Jimmi's Hub H1 descriptor. `/team/` title with role | listed pages | XS | Removes the duplicate title and the intent mismatch | both |
| P1-5 | Cross-link the three maintenance guides to each other and to `/jimmis-hub/`. Link `/phishing-awareness/` ↔ `/guides/it-lab/` | `guides/*`, `phishing-awareness/`, IT Lab end screen | S | Topic cluster plus a path from information to service | SEO §4 |

### P2 — Minimal measurement (repository and Worker; **G4** for the code, **G7** for anything that touches privacy or CSP)

| # | Change | Effort | Acceptance |
|---|---|---|---|
| P2-1 | Carry normalized `service_id` (fixed enum), `locale`, `landing_path`, and first-touch UTM fields (length-limited, session only) through the form and Worker. Validate server-side | M | Unknown or oversized values rejected. HE and EN aggregate to the same IDs. Worker tests extended and passing |
| P2-2 | Vendor-neutral DOM events: `cta_click`, `contact_start`, `contact_verify_result`, `contact_submit_result` (success fires only after the Worker returns `success: true`) | S | Each event fires once with the documented fields and no personal data |
| P2-3 | Structured Worker counters (accepted/rejected × service_id × locale × result class + correlation ID). **Never** log payload, name, email, phone, message, IP, or token | S | A log sample contains no personal data |
| P2-4 | Reconcile `privacy.html` / `en/privacy.html` and `security_headers_template.txt` with what actually runs. Remove the retired `formsubmit.co` allowance if unused | S | Policy, CSP, and production requests agree |

**If P2 isn't done before launch:** posts can still go out, but results are limited to native platform metrics (impressions, link clicks, saves, shares) and manually tagged inquiries. Note this limit in the review (§8).

### P3 — The campaign itself (§6), after P1-1…P1-3 at minimum and G3 for each post

### P4 — New content (only after **G5**: Search Console query data has been checked)

Ordered by intent × effort (Claude SEO §3, §6). All are [Rec]. Validate the wording users actually search for ("פישינג" vs "פישינג SMS" vs "סמישינג") before writing.

| # | Page | Effort | Supports |
|---|---|---|---|
| P4-1 | "לחצתי על קישור חשוד – מה עושים?" (standalone incident page → `/contact/?service=security`) | M | Theme 1 |
| P4-2 | SMB IT checklist ("what a small business needs from an IT provider"), which gives the reworded Day 13 a real destination later | M | Theme 3 |
| P4-3 | Microsoft 365 security basics for SMBs (MFA, admin accounts, forwarding rules, external sharing) | M | Theme 3 |
| P4-4 | Backup basics, then a "slow computer" diagnostic guide, both linking to `/jimmis-hub/` | M each | Theme 5 |

Don't build: per-city doorway pages, pages for services that aren't confirmed, or an English IT Lab unless the English audience becomes a stated priority.

### P5 — Lower-priority hygiene (any time, **G4**)

- Trim EN `/websites/` (223) and EN `/jimmis-hub/` (199) meta descriptions to about 155. HE Jimmi's Hub (163) is optional.
- Add intro copy to `/guides/` and `/en/guides/` (193 and 174 words).
- Add JSON-LD: `WebPage`, `Service`, and `BreadcrumbList`, using only facts already on the page. No invented dates, ratings, address, or phone (Codex §3).
- Compress `about/assets/chief-avatar.png` (1.14 MB) and add intrinsic dimensions to images.
- Add a static SEO and link check script. Generate sitemap `lastmod` from real content dates.

---

## 6. Revised two-week calendar

Day 1 = the first weekday after G1, G3 (Day 1 post), and P1-1…P1-3 are all live. Instagram rows run only if G2 passes.

| Day | Channel | Topic | Destination (with UTM, §7) | Goal / metric | Change vs. original |
|---|---|---|---|---|---|
| 1 | LinkedIn | Three phishing signals people still miss | `/phishing-awareness/` | Link clicks, saves | Draft corrected (§4.1) |
| 3 | Instagram* | Five-slide phishing checklist | `/guides/it-lab/` via bio link | Shares, profile → bio clicks | Needs G2 + bio change; carousel media needs G3 |
| 5 | LinkedIn | Why documentation is part of infrastructure security | `/team/` | Profile visits, link clicks | Canonical profile selected |
| 8 | LinkedIn | Optional Windows updates: when to install, when to wait | `/guides/windows-update/` | Link clicks | Needs P1-5 so readers have a next step |
| 10 | Instagram* | PC maintenance: myth vs. reality | `/jimmis-hub/` | Bio clicks | Address SMBs and private users; make no location claim |
| 13 | LinkedIn | Reworded to what `/` covers (IT infrastructure, M365, security for small businesses) | `/` service card → `/contact/?service=managed-it` | Qualified inquiries | Original promise not supported (§4.4) |

*Instagram is confirmed; every individual publication remains conditional on G3.

New copy for Days 3–13 still has to be written into `marketing/SOCIAL-DRAFTS.md` and approved one post at a time (G3).

---

## 7. UTM convention

`?utm_source={linkedin|instagram}&utm_medium=social&utm_campaign=organic-2026-11&utm_content=d{day}-{slug}`

Example: `https://cyjimm.com/phishing-awareness/?utm_source=linkedin&utm_medium=social&utm_campaign=organic-2026-11&utm_content=d1-phishing-signals`

Lowercase, hyphens only, no personal data. Until P2-1 ships, UTMs survive only as far as whatever the production analytics shows (unconfirmed, G7). They are **not** carried into the contact form.

---

## 8. Measurement and review

Record each post in a log (a new file such as `marketing/CAMPAIGN-LOG.md` is fine): publication URL, date, impressions, profile visits, link clicks, saves, shares, inquiries (manually tagged by service and source if P2 isn't live).

- **Day 7 review:** which posts got link clicks and saves, and whether any visitors reached `/contact/`.
- **Day 14 review:** continue only themes with meaningful clicks or inquiries. Decide whether to start P4 content (needs G5).
- Success is judged on qualified inquiries and link clicks, not on impressions. No targets are set, because there is no baseline yet. Don't invent any.

---

## 9. Approval gates (nothing proceeds past a gate without Matan's explicit "yes")

| Gate | What Matan approves | Blocks |
|---|---|---|
| **G1** | This plan and its priority order | Everything |
| **G2** | Instagram `autvjdn` is the right account, plus the exact bio/link-in-bio text and URL | All Instagram activity, including bio edits |
| **G3** | Per post: exact text, exact graphic/media, alt text, crop/aspect-ratio preview, account, audience, destination URL with UTM, and posting time | Each publication. Text approval alone is not publication approval, and a G3 for one post never covers another |
| **G4** | Exact copy and diff for each site or repository change (P1, P2, P5), and the profile/services decisions | Any edit to website files or the Worker |
| **G5** | Search Console query data reviewed and topics/wording confirmed | P4 new pages |
| **G6** | The real service area, or "no location claim" | Day 10 local framing, `areaServed`, local copy |
| **G7** | Analytics source, privacy policy wording, and CSP changes | Turning on any analytics, P2-4 |
| **G8** | Any outreach, comment, DM, follow, like, collaboration, or backlink request | All contact with third parties (none is planned) |

---

## 10. Open questions for Matan

1. Is Instagram `autvjdn` the CyJimm account? (G2)
2. Where does Jimmi's Hub actually serve customers? (G6)
3. Should `/about/` or `/team/` be the canonical profile page?
4. Is Cloudflare Web Analytics running in production? (G7)
5. Are Red team / pentest and DevSecOps services you want promoted, or should they stay low-key?
6. Is the English audience a priority for this run, or is it Hebrew-first?
