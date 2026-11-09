# Question for Codex: Hebrew Instagram captions starting with a Latin word

Instagram captions (Hebrew, RTL). Two scheduled captions start with a Latin word:
1. `Windows Update נותן בסיס טוב, אבל מחשבים עסקיים צריכים לפעמים גם עדכוני BIOS, Firmware ודרייברים דרך כלי היצרן: HP Support Assistant, Lenovo Vantage או Dell Command Update.`
2. `Outlook תקוע, Teams לא נפתח, VPN לא מתחבר, מדפסת נעלמה או עדכון ממתין? לפעמים Restart הוא כל התיקון.`

Proposed fix: prepend U+200F (RLM) as the first character, text otherwise unchanged. Alternative: reword so the first word is Hebrew.

Answer briefly:
1. Per the Unicode Bidi Algorithm (UAX #9) and how Instagram picks paragraph direction (dir=auto = first strong character), does a leading RLM make the paragraph RTL? Is RLM a strong character for that purpose?
2. Any known issue with RLM at the very start of an Instagram caption (stripped, shown as a gap, breaks hashtags/search, accessibility/screen readers)?
3. Is rewording safer than RLM? Which do you recommend?
4. Anything else wrong with the mid-sentence Latin runs and punctuation in these two captions?
Do not edit files. Reply in under 200 words.
