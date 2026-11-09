# RTL / mixed Hebrew-English text rules for posts (added 2026-11-09 after Matan's report)

**Problem (reported by Matan):** in LinkedIn (and sometimes Instagram) posts, a line that starts with a Latin word, or a Hebrew sentence with English words and punctuation, renders with the wrong reading order (e.g. my Day 13 title `IT מנוהל לעסק: מה זה כולל?` showed as `מנוהל לעסק: מה זה כולל IT?`, and the Day 8 bullets `- Quality Updates (...)` put the dash and brackets in odd places). The platform picks the paragraph direction from the first strong character, so an English first word makes the line LTR; and the editor gives no direction control.

## Rules for every future post and caption
1. **Start every line (title, paragraph, bullet) with a Hebrew word.** Never with `IT`, `M365`, `CyJimm`, a URL, `-`, a digit or an emoji. Reword the title instead (e.g. `ניהול IT לעסק: מה זה כולל?`).
2. If a line must start with something neutral or Latin, put an invisible RLM (U+200F) first.
3. Put an RLM (U+200F) **after** a Latin run that is followed by punctuation (`, . : ? ) ("`), so the punctuation stays on the Hebrew side: `Windows‏:` `M365‏,` `GPOs‏.`
4. Avoid hyphen bullets (`- `). Use a Hebrew word, a number with a Hebrew word, or `•` after an RLM.
5. Keep URLs and hashtag lines on their own line; start the hashtag line with a Hebrew hashtag or an RLM.
6. Preview the final text in the platform's editor and read it before scheduling; fix before pressing Schedule.
7. Images: Latin runs are already wrapped in `<bdi dir="ltr">` in the HTML sources, which renders correctly (verified in the PNGs).

## Status 2026-11-09
Matan approved the fix. Applied in LinkedIn and verified in "Scheduled (3)" (still Nov 10, 12, 18 at 09:00): Day 5, Day 8, Day 13. Details in each G3 package.
Learned: the LinkedIn editor shows every line RTL, so a lone `#IT` still looks like `IT#` there; the invisible LRM before `#IT` did not help. Kept `#IT` on its own line. Check the published post and adjust the hashtag order if it still looks wrong.
Day 8 hashtags added 2026-11-09 at Matan's request.
Instagram captions checked 2026-11-09: only posts 8 (vendor tools) and 9 (Restart signs) opened with a Latin word, and the Instagram editor showed them LTR. After consulting Codex (`agent-reports/codex-rtl-answer.md`: reword is safer than a leading RLM), Matan approved rewording the first word: post 8 now starts `עדכוני Windows Update נותנים...`, post 9 `אם Outlook תקוע, ..., לפעמים Restart...` (the `?` became a comma). Saved in Instagram; times unchanged (Tue 11-10 19:00, Wed 11-11 09:00); the editor now shows both RTL.
