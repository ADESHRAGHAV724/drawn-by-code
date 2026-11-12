# planaria

- **Style:** cinematic-facts, «field notebook» look (`styles/cinematic-facts/notebook.js`),
  measured on a facts Short the user showed (a tardigrade explainer, not committed): a manila
  notebook page (#c4aa80 measured) with ruled lines, a fold crease, binder holes and white pencil
  sprigs; a mono section label and «FIG. n» over a rule; a small ink line (#2a1c12) over a big
  red one (#b0301e) slammed in on the voice; dark pages with a microscope field (cells, scale
  bar, red hand-drawn circled numbers); a magnifier callout; kraft cards; a torn label.
- **Subject:** a planarian painted in code (`planaria.js`): painted once straight, drawn along a
  bending spine in strips; an x-ray look (gut, nerve cords, brain, neoblasts); pieces after a
  cut; new tissue unpigmented white (a blastema) fading into the old.
- **Format:** 9:16 · 1080×1920 · ~56 s · Hindi voice-over (the user's ElevenLabs file, pending).
- **Script:** the 11 checked lines given in chat (hook: head cut → regrows in a week; size;
  neoblasts; pieces, Morgan's 1/279; two heads; injury heals; ground up → no; one neoblast
  rescues an irradiated worm; no fixed lifespan; regrowth never stops with age, a study saw
  rejuvenation; not immortal: hunger, heat, predators; subscribe).

## Round 0 · look test (before the voice)

Four shots (hook, microscope, pieces, size) to approve the look: `look-test.jpg`.

## Round 1 · 15 s demo (no voice)

| Time | Shot | Caption |
|---|---|---|
| 0–2.6 | the worm glides, a dashed red line on the neck, snip, the head slides off | CUT OFF ITS HEAD / IT GROWS BACK |
| 2.6–5.2 | the headless body grows a white head that darkens; a DAY 01→07 counter | A NEW HEAD IN / JUST 7 DAYS |
| 5.2–8.0 | microscope (dark page): x-ray worm, neoblasts light up, red circled 1-2-3 | THE SECRET / NEOBLASTS |
| 8.0–10.6 | two cuts, three pieces drift apart, the headless ones grow heads | EVERY PIECE / A NEW WORM |
| 10.6–12.9 | four kraft cards with red «?», then a worm on each | AGE LIMIT? / NONE |
| 12.9–15 | the worm glides | FOLLOW FOR / MORE FACTS |

Sound: effects only (`audio.json`): page turns on cuts, pencil circles, snips, ticks on the counter, stamps.

## Round 2 · 20 s demo

hook (paper, caption) → regrow (under water, day counter) → pieces (paper) → scope (dark, hand-written
«neoblasts») → geiger (paper) → dose (12 mannequins, caption «THAT'S 12X / A DEADLY DOSE») → rescue
(dark: one cell) → follow (under water, caption). Props in `styles/cinematic-facts/props.js`.

## Round 3 · the full Short on the voice (59.6 s)

The user recorded the SHORT script (asked, not guessed: the pauses fit both). Lines mapped by
silencedetect (-35 dB, 0.15 s), film time = voice + 0.4 s (`make-voice.sh`):

| # | Line | Film time | Shots |
|---|---|---|---|
| 1 | सिर काट दो… नया सिर, दिमाग़, आँखें | 0.4–6.0 | hook (snip, caption) · regrow under water (DAY counter, «brain», «eyes») |
| 2 | ये है प्लेनेरिया… दो सेंटीमीटर | 6.6–11.6 | intro under water («MEET THE PLANARIAN») · size (ruler, 2 CM callout) |
| 3 | नियोब्लास्ट… स्टेम सेल्स… कोई भी अंग | 12.1–17.3 | scope (lit neoblasts) · stem (a cell → eye, brain, gut, muscle) |
| 4 | टुकड़ों में काटो… 279वाँ हिस्सा | 17.9–23.9 | pieces (five, each grows a head) · tiny («EVEN A 1/279 PIECE», magnified sliver grows) |
| 5 | सिर बीच से चीर दो… दो सिर | 24.5–28.4 | twohead under water |
| 6 | चोट… मिनटों में घाव बंद | 29.0–31.5 | wound closing, stopwatch |
| 7 | पीस दो… एक नियोब्लास्ट… बचा लिया | 32.1–39.5 | grind (mortar, red X) · geiger (why it is dying) · rescue (one cell) |
| 8 | उम्र? कोई तय उम्र नहीं | 39.9–44.0 | age («AGE LIMIT? NONE», calendar 1990→2025, «same worm») |
| 9 | रीग्रो कभी बंद नहीं… जवान | 44.5–50.3 | never (cut ×3, ∞) · younger (old → «young!») |
| 10 | अमर नहीं… भूख, गर्मी, शिकारी | 50.8–55.6 | mortal («BUT NOT IMMORTAL», dish, thermometer, fish on the words) |
| 11 | सब्सक्राइब | 56.1–58.3 | subscribe under water (a button pressed) |
