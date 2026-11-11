# tendua-aur-ghoda

- **Style:** sumi-e (ink on washi; vermilion only for the leopard's greedy eyes and the seals)
- **Format:** 9:16 · 1080×1920 · 68.5 s · 24 fps · a YouTube Short, Hindi voice-over
- **Story:** «The leopard and the horse»: a hungry leopard meets a horse; the horse keeps his
  head, asks to be eaten at home together with his wife so neither is left to grieve; the
  greedy leopard follows him to the stable, where the master drives it off with a stick.
  Moral: «मुसीबत में कभी भी हिम्मत और समझदारी मत खोना».
- **Text:** no subtitles (the user's choice): only the title and the moral, brush-written
  in Kalam with a vermilion seal.
- **Voice:** the user's ElevenLabs file (65.8 s, one voice for all parts), kept in
  `private/`; `make-voice.sh` adds 0.5 s before it, pads to 68.5 s and writes `mouth.js`
  (loudness per drawing → the speaking animal's jaw). Line 10 was softened in the script:
  the master drives the leopard away («मार भगाया»), it does not die on screen.
- **Cast:** `beasts.js` (horse, mare, leopard, ensō, stable, all brush strokes); the master
  is red-thread's `Cast.figure` (kind 'man') holding a stick.

## Voice lines (silencedetect; film time = file time + 0.5 s)

| # | Speaker | Film time |
|---|---|---|
| 1 | narrator — एक दिन, एक घोड़े का सामना एक भूखे तेंदुए से हो गया… | 0.5–6.5 |
| 2 | narrator — घोड़ा डर गया… उसने अपना धीरज नहीं खोया। | 7.1–15.4 |
| 3 | horse — मैं जानता हूँ कि तुम मुझे अभी मार डालोगे। पर मेरी एक विनती है! | 15.9–21.7 |
| 4 | leopard — बोलो, क्या विनती है? | 22.2–24.0 |
| 5 | horse — मेरी पत्नी घर पर अकेली… बिल्कुल अकेली रह जाएगी। | 24.2–32.2 |
| 6 | horse — मेरे साथ मेरे घर चलो, और हम दोनों को खा लो… | 33.3–41.6 |
| 7 | leopard — वाह! एक की जगह दो! चलो! | 42.0–44.7 |
| 8 | narrator — तेंदुआ खुशी-खुशी घोड़े के साथ उसके अस्तबल तक चल पड़ा। | 45.3–48.7 |
| 9 | narrator — घोड़े के मालिक ने… एक मज़बूत लाठी उठा ली। | 49.3–54.1 |
| 10 | narrator — जैसे ही तेंदुआ वहाँ पहुँचा… और उसे मार भगाया। | 54.7–60.5 |
| 11 | narrator — सीख: मुसीबत में कभी भी हिम्मत और समझदारी मत खोना। | 61.4–66.0 |

## Shot list (one long painting: the meadow, then the stable; the camera travels)

| Time | Shot | What happens |
|---|---|---|
| 0–7.1 | The meadow | Mist, far peaks, a grey sun, a plum tree; the horse walks in; red eyes over a rock, then the leopard slinks out; the title |
| 7.1–15.6 | Face to face | The horse rears, ears back, trembles; the leopard creeps, tail lashing; the horse calms, two breaths of mist |
| 15.6–24.1 | A request | The horse speaks; the leopard rises, sits, answers |
| 24.1–32.6 | The wife | An ensō paints itself in the sky: the mare waiting at the stable |
| 32.6–41.8 | Eat us both | The horse nods toward home, bows his head; the leopard licks his lips, eyes red |
| 41.8–45.2 | Vaah! | The leopard leaps, treads on the spot, turns for the stable |
| 45.2–49.3 | To the stable | Both travel right along the painting |
| 49.3–54.6 | The master | The master sees them, takes his stick from the post |
| 54.6–61.2 | The stick | The leopard arrives; the stick goes up and comes down in one dry stroke; the leopard flees |
| 61.2–68.5 | Moral | The horse walks home to the mare; cranes; the moral is written with a seal |
