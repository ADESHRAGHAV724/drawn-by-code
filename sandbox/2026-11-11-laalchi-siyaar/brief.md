# laalchi-siyaar

- **Style:** etching — 2D, made for this film (`etch.js`): every form an inked contour filled
  with parallel hatching, cross-hatched on its shadow side, on yellowed, foxed paper inside
  a plate mark and neat lines. The user asked for «engraving»; the repo's engraving style is
  3D (charcoal plates of stone and architecture) and would have made the animals look like
  figurines, so the user chose this hand-drawn etching look instead.
- **Format:** 9:16 · 1080×1920 · 67.5 s · 24 fps · a YouTube Short, Hindi voice-over
- **Story:** «The greedy jackal»: a hunter shoots a boar, the boar gores the hunter, both lie
  wounded; the jackal, planning to make the food last, chews the bow's string first — the
  bow springs back into his face. Moral: «लालच का अंत, अक्सर बुरा ही होता है».
- **The user's asks:** no subtitles (title and moral only, in the plate's top margin); show
  the arrow in the boar's belly and the bow striking the jackal's mouth; no blood (blows are
  engraved impact rays and dust).
- **Voice:** the user's ElevenLabs file (64.8 s), kept in `private/`; `make-voice.sh` adds
  0.5 s before it, pads to 67.5 s and writes `mouth.js` (loudness → the jackal's jaw).

## Voice lines (silencedetect; film time = file time + 0.5 s)

| # | Speaker | Film time |
|---|---|---|
| 1 | narrator — एक बार, एक भूखा सियार खाने की तलाश में भटक रहा था। | 0.5–4.5 |
| 2 | narrator — तभी उसने देखा कि एक शिकारी, एक जंगली सूअर का पीछा कर रहा है। | 5.1–9.4 |
| 3 | narrator — शिकारी ने निशाना साधा, और तीर चला दिया। तीर सूअर को जा लगा। | 10.0–14.4 |
| 4 | narrator — घायल सूअर दर्द से चीखा… शिकारी पर टूट पड़ा। | 14.9–20.7 |
| 5 | narrator — शिकारी इस अचानक हमले के लिए तैयार नहीं था… घायल हो गया। | 21.3–27.0 |
| 6 | narrator — अब शिकारी और सूअर… यह देखकर सियार बहुत खुश हुआ। | 27.5–34.3 |
| 7 | jackal — वाह! इतना सारा खाना! यह तो मेरे कई दिनों तक चलेगा! | 34.6–38.9 |
| 8 | narrator — तभी उसकी नज़र शिकारी के पास पड़े धनुष पर गई… | 39.2–44.3 |
| 9 | jackal — आज का दिन इस डोरी को खाकर निकाल लेता हूँ… | 44.6–49.7 |
| 10 | narrator — लालची सियार ने डोरी चबानी शुरू की… सियार के मुँह पर जा लगा। | 49.9–57.7 |
| 11 | narrator — (the jackal falls) | 58.1–60.8 |
| 12 | narrator — सीख: लालच का अंत, अक्सर बुरा ही होता है। | 61.4–65.1 |

## Shot list

| Time | Shot | What happens |
|---|---|---|
| 0–5 | The jackal | He sniffs his way in and hides behind a tree; the title |
| 5–10 | The chase | The hunter runs after the boar across the clearing |
| 10–14.8 | The arrow | He draws, looses; the arrow stands in the boar's belly |
| 14.8–21.2 | The tusk | The boar squeals, turns, charges, tusks him; he staggers |
| 21.2–27.4 | Both fall | A second blow, the hunter falls, the bow flies onto a stump, the boar collapses |
| 27.4–34.5 | Happy | Vultures circle; the jackal steps out, hops for joy |
| 34.5–39.1 | So much food | He speaks, tail wagging |
| 39.1–44.5 | The bow | He sees the bow leaning on the stump and sniffs the string |
| 44.5–49.8 | Save it | A sly look: «today the string, tomorrow the rest» |
| 49.8–54.6 | Chewing | He tugs and chews; the string frays |
| 54.6–61.2 | Snap | The string parts, the stave springs up into his muzzle; he flies back and lands dazed under the tree |
| 61.2–67.5 | Moral | Wide: the three of them, the vultures; the moral printed in the top margin |
