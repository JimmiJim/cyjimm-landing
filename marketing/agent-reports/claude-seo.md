# Claude SEO report — search intent, content gaps, internal linking, editorial priorities

Date: 2026-11-07 · Scope: repository HTML at the working-tree root (Hebrew `/` + English `/en/`), `sitemap.xml`, `robots.txt`. Worktrees under `.claude/`, `worker/node_modules`, and `asfir-bootstrap/` excluded.
Method: static parse of every page (title, meta description, canonical, hreflang, H1/H2, word count inside `<main>`, `<main>` links) and a sitewide inbound-link count. **No live crawl, Search Console, rank, or keyword-volume data was used** — volume/difficulty claims below are not made; intent mapping is qualitative and must be validated with real query data.

Legend: **[Fact]** = observed in repo. **[Rec]** = recommendation.

---

## 1. Top findings (ranked by impact on the campaign themes)

1. **[Fact] Two campaign destinations are orphan pages.** `/phishing-awareness/` and `/about/` each have exactly **1 inbound link sitewide**, and that link is the language switcher from their own English twin (`/en/phishing-awareness/`, `/en/about/`). Same for the English versions. Not in header nav, footer, home page, guides hub, or any guide. Header nav = `/`, `/websites/`, `/jimmis-hub/`, `/guides/`, `/team/`, `/contact/`, `/en/`; footer = `/`, `/accessibility.html`, `/privacy.html`, `/terms.html`, `/en/`.
   Campaign themes 1 and 3 in `AI-MARKETING-ORCHESTRATION.md` send social traffic to these pages, but search engines and visitors cannot reach them from the rest of the site.
2. **[Fact] `/guides/it-lab/` is weakly linked and mostly JS-rendered.** 1 inbound link (`/guides/index.html`). Its game content is injected by `assets/js/it-lab.js` (`data-phishing-*` placeholders); only ~243 words of static text in `<main>`. No English version, and it is missing from `/en/guides/` and from the English half of `sitemap.xml` (correct, since none exists — but hreflang lists only `he` + `x-default`).
3. **[Fact] Guides are dead ends.** Each guide's `<main>` links only to `/contact/` and `/guides/`. No guide links to a sibling guide, to `/jimmis-hub/` (the service that actually fixes these problems), or to `/phishing-awareness/`.
4. **[Fact] `/team/` and `/about/` target the same entity query.** Both are Matan Jamil profile pages (`/team/` H1 `מתן ג'מיל`; `/about/` H1 `מתן ג'מיל System Administrator & Security Engineer`). Nav points to `/team/` (439 words); the richer page `/about/` (1,194 words, CV PDF) is orphaned. Risk of the weaker page ranking for name/brand queries.
5. **[Fact] No location signal anywhere.** Zero matches for Israel/city/region terms on `/`, `/jimmis-hub/`, `/contact/`; no `areaServed` in the home JSON-LD; no phone. Home/small-business computer help (`/jimmis-hub/`) is a strongly local intent ("טכנאי מחשבים ב…", "תיקון מחשבים ב…"), so the page cannot match it.
6. **[Fact] Phishing page title has no Hebrew keyword.** `/phishing-awareness/` title is `CyJimm | Phishing Awareness` (brand-first, English) on a Hebrew page whose H1 is `איך לזהות פישינג לפני שלוחצים`. Same brand-first title on `/en/phishing-awareness/`.
7. **[Fact] Thin hub/conversion pages.** `/guides/` 193 words, `/en/guides/` 174, `/contact/` 115, `/en/contact/` 140. `/team/` title `CyJimm - מתן ג'מיל` carries no role/service terms.

---

## 2. Search-intent map (current pages)

| Path | Primary intent it can serve | Title/H1 match | Notes |
|---|---|---|---|
| `/` | Commercial: "תשתיות IT לעסקים", "אבטחת מידע לעסקים", Microsoft 365 for business | Good (title 37 chars, H1 slogan-only) | H1 `תשתיות ואבטחת מידע שעובדות ביום-יום` OK. Does not link to `/jimmis-hub/`, `/about/`, `/phishing-awareness/` in `<main>`. |
| `/websites/` | Commercial: "בניית אתרים לעסקים קטנים" | Strong title | 1,106 words; `<main>` links only `/` and `/contact/`. EN meta description 223 chars (truncation). |
| `/jimmis-hub/` | Local/transactional: home & SMB computer repair | Title OK, **H1 is brand only** (`Jimmi's Hub`) | 8 services as H3 (תיקון ואבחון, שדרוגי חומרה, ניקוי וירוסים, גיבוי…) each a separate search intent with no dedicated page. No location. |
| `/guides/windows-update/` | Informational how-to: "איך לעדכן Windows", optional updates | Good | 374 words; competitive generic topic — differentiate with screenshots/SMB angle. |
| `/guides/vendor-updates/` | Informational: "עדכון BIOS / דרייברים HP Lenovo Dell" | Good | 321 words. Could split per vendor later if data supports. |
| `/guides/scheduled-restart/` | Informational: "ריסטרט מתוזמן Windows", Task Scheduler | Good | 289 words; niche, low competition likely. |
| `/phishing-awareness/` | Informational: "איך לזהות פישינג", smishing, "לחצתי על קישור" | **Title mismatch** | Strongest content asset (589 HE / 723 EN words, 9 signs, examples, "what if I clicked"). Orphaned. |
| `/guides/it-lab/` | Engagement/linkbait, not a search target | n/a | Value is social sharing + links, not ranking. |
| `/about/`, `/team/` | Navigational/entity: "מתן ג'מיל", hiring managers | Duplicate intent | Hiring-manager audience from the orchestration objective lands here. |
| `/contact/` | Navigational | fine | Thin by design. |

---

## 3. Content gaps (high-intent topics with no page)

Prioritised by fit with stated audiences (Israeli SMBs, IT decision makers, home users) and by what the existing pages already half-cover. **All are [Rec]; validate demand with Search Console / keyword tool before writing.**

1. **"לחצתי על קישור חשוד – מה עושים?"** — incident-first page (Hebrew). Already exists as an H2 inside `/phishing-awareness/`; a standalone, step-by-step page matches an urgent, high-intent query and can hand off to `/contact/`. Lowest effort, highest intent.
2. **Microsoft 365 security basics for small businesses** (MFA, admin accounts, mailbox forwarding rules, external sharing). `/` claims Microsoft 365 in title/description but no supporting content page exists.
3. **Backup for small business / home** (3-2-1, what to back up, restore test). Listed as a service on `/jimmis-hub/` with no supporting guide.
4. **"Computer is slow" diagnostic guide** — common home/SMB query that naturally leads to `/jimmis-hub/` and reuses the restart/update guides.
5. **SMB IT checklist / "what a small business needs from an IT provider"** — already planned as content-calendar Day 13 (`marketing/CONTENT-CALENDAR.md`) but points to `/`, which has no such content. A real page gives that post a matching destination.
6. **English version of IT Lab** (`/en/guides/it-lab/`) — only if English audience is a priority; otherwise leave Hebrew-only.

Do not create: per-city doorway pages, or pages for services not actually offered (Red/PT, DevSecOps appear on `/` as "זמינים לפי היקף פרויקט" — confirm with Matan before expanding).

---

## 4. Internal-linking plan (no new pages required)

All [Rec]; mirror each on the `/en/` twin.

| From | Add link to | Anchor idea (HE) | Why |
|---|---|---|---|
| Header nav or footer (all pages) | `/phishing-awareness/` | מודעות לפישינג | Fix orphan #1 |
| `/team/` | `/about/` (or consolidate, see §5) | הפורטפוליו המלא | Fix orphan #2 |
| `/` services/guides section | `/phishing-awareness/`, `/jimmis-hub/`, `/guides/it-lab/` | איך לזהות פישינג · שירותי מחשוב לבית ולעסק קטן | Home passes most equity |
| `/guides/` hub | `/phishing-awareness/` as a guide card | | It is a guide in all but URL |
| Each guide (windows-update ↔ vendor-updates ↔ scheduled-restart) | the other two | "השלב הבא: עדכוני יצרן" | Topic cluster |
| Each guide's closing CTA | `/jimmis-hub/` alongside `/contact/` | "לא בא לכם לעשות את זה לבד?" | Informational → service path |
| `/jimmis-hub/` service cards | matching guide (Windows → windows-update; שדרוגים → vendor-updates; אבטחה → phishing-awareness) | | Proof of expertise on a commercial page |
| `/phishing-awareness/` | `/guides/it-lab/` and `/contact/` | "תרגלו במשחק" | Currently links only to `/` |
| `/guides/it-lab/` end screen | `/phishing-awareness/` | | Close the loop |
| `/websites/` | `/about/` | | Trust for a buying decision |

---

## 5. On-page fixes (titles/H1/meta) — [Rec], text for Matan to approve

- `/phishing-awareness/` title → `איך לזהות פישינג ו-SMS מתחזה | CyJimm` (≈35 chars). EN → `How to Spot Phishing Emails and SMS | CyJimm`.
- `/jimmis-hub/` H1 → keep brand, add descriptor: `Jimmi's Hub – שירותי מחשוב לבית ולעסק קטן`. Add the real service area (Matan to state it; do not guess).
- `/team/` title → include role, e.g. `מתן ג'מיל – תשתיות IT ואבטחת מידע | CyJimm`; or decide one canonical profile page (`/about/` is stronger) and make `/team/` a short team page linking to it.
- `/guides/` and `/en/guides/` → add a short intro (2–3 paragraphs) on who the guides are for; they are currently near-empty hubs.
- `/en/websites/` meta description 223 chars and `/en/jimmis-hub/` 199 chars → trim to ~155. (Hebrew home description noted in `.claude/SEO_HANDOFF.md` is now 133 chars — resolved.)
- Legal pages: meta descriptions are 19–24 chars; low priority, but cheap to fix.
- Structured data (Article/HowTo/Breadcrumb on guides, `areaServed`) → hand to Codex Growth; only the home page has JSON-LD today (`Person`, `ProfessionalService`, `WebSite`).

---

## 6. Editorial priorities (next 4 weeks)

| # | Action | Type | Effort | Supports theme |
|---|---|---|---|---|
| 1 | Link `/phishing-awareness/` and `/about/` from nav/footer/home/guides hub (§4) | Linking | XS | 1, 3 |
| 2 | Fix phishing title; Jimmi's Hub H1; team/about decision (§5) | On-page | S | 1, 3, 5 |
| 3 | Guide ↔ guide ↔ Jimmi's Hub cross-links | Linking | S | 2, 5 |
| 4 | New page: "לחצתי על קישור חשוד – מה עושים?" | New content | M | 1 |
| 5 | New page: SMB IT checklist (gives calendar Day 13 a real destination) | New content | M | 3 |
| 6 | New guide: Microsoft 365 security basics for SMBs | New content | M | 3 |
| 7 | New guide: backup basics, then "slow computer" | New content | M | 5 |

Gate before #4–7: pull Search Console queries for `/phishing-awareness/` and `/guides/*` to confirm wording users actually search (Hebrew vs. English terms such as "פישינג" vs. "פישינג SMS" vs. "סמישינג").

## 7. Notes for other agents

- Social posts in the calendar to `/phishing-awareness/` and `/about/` will land on pages with no onward path except the header; do priority #1 before the campaign starts or the visits will not flow to services.
- Calendar Day 13 (`/`) promises "what a small business needs from an IT provider" — the home page does not answer that; route to a new page (#5) or reword the post.
- Not verified: live rendering, indexing status, Core Web Vitals, backlinks, real query/volume data, analytics configuration.
