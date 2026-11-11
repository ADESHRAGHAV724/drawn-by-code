# sone-ka-anda

- **Style:** warli
- **Format:** 16:9 · 54 s · 24 fps · Hindi voice-over
- **Purpose / audience:** a children's fable (the goose / hen that laid golden eggs) told as
  a Warli wall painting, for a Hindi-speaking audience. The first Warli film with a voice.
- **One-line idea:** a poor farmer's hen lays a golden egg every morning; greed makes him cut
  her open for all the gold at once, he finds nothing, and the eggs never come again.
- **References:** the user's script (in chat), the Warli style skill.
- **On-screen text (literal):** «सोने का अंडा» (title, 0.3–4.2 s) · «लालच बुरी बला है» (49.5 s to the end).
- **Voice:** the user's ElevenLabs file (voice «Neel – Expressive Storyteller», one voice for
  every part, 48.7 s), kept in `private/` (not committed). `make-voice.sh` re-times it:
  +0.6 s of air at the start, a 2.6 s silence for the cut after line 11, 2 s at the end →
  `private/voice.wav`, mixed with the effects by `audio.json`.
- **Must NOT happen:** no blood or wound: the cut is one paste slash, a few feathers, the hen
  tipped over with her eyes shut. Gold is the only colour besides paste, and only for the
  gold (eggs, coin, rays).

## Voice lines (measured with silencedetect on the original file, then on the re-timed one)

| # | Speaker | Line | Film time |
|---|---|---|---|
| 1 | narrator | एक छोटे से गाँव में, रामू नाम का एक गरीब किसान रहता था। | 0.6–4.8 |
| 2 | trader | ले जा भाई, अच्छी मुर्गी है! | 5.0–7.3 |
| 3 | narrator | अपने आखिरी सिक्के से, वह एक मुर्गी ले आया। | 7.5–10.5 |
| 4 | Ramu | अरे! यह तो... सोने का अंडा है! | 10.7–13.2 |
| 5 | Sita | भगवान ने हमारी सुन ली! | 13.5–15.3 |
| 6 | narrator | पूरे गाँव में खुशियाँ नाच उठीं। | 15.5–17.5 |
| 7 | narrator | हर सुबह, एक सोने का अंडा। दिन बदले, घर बदला... और रामू भी बदलने लगा। | 18.1–24.8 |
| 8 | Ramu | सिर्फ एक रोज़? इसके पेट में तो सोना ही सोना भरा होगा... | 25.1–29.1 |
| 9 | Sita | नहीं जी! जो मिल रहा है, उसी में सुख है। | 29.3–32.5 |
| 10 | Ramu | चुप रहो! | 32.7–33.1 |
| 11 | narrator | उस रात, लालच ने रामू की आँखों पर पर्दा डाल दिया। | 33.4–37.1 |
| – | (silence: the cut) | | 37.1–40.0 |
| 12 | Ramu | कुछ... कुछ भी नहीं? यह मैंने क्या कर दिया! | 40.0–43.4 |
| 13 | narrator | अगली सुबह कोई अंडा नहीं आया। ना कभी फिर आया। | 43.7–47.3 |
| 14 | narrator | इसलिए बच्चों, याद रखना... लालच बुरी बला है। | 48.0–51.6 |

## Shot list

One long mural (the market on the left, Ramu's yard on the right) inside the chowk border;
the camera pans along it.

| Time | Shot | What happens |
|---|---|---|
| 0–4.7 | Poor village | The wall paints itself; Ramu and Sita sit by the hut sharing one roti; the title is written |
| 4.7–10.2 | Market | Ramu walks to the market (the camera follows); the trader holds out a hen; the gold coin passes hand to hand; Ramu carries the hen home |
| 10.2–15.3 | First egg | The hen rises off the nest: a golden egg with rays; Ramu jumps back, kneels, holds it high; Sita runs out and raises her arms |
| 15.3–18 | Joy | Ramu and Sita dance with the egg; a tarpa ring of villagers joins above them |
| 18–25 | Getting rich | Four quick days and nights: each dawn an egg arcs into the basket; the eggs fly into the hut, which is repainted as a rich house with a flag; a cow is painted in; Ramu stands with arms akimbo |
| 25–29.3 | Greed | «Sirf ek roz?» — a finger raised; a thought bubble of a heap of gold and a palace |
| 29.3–33.4 | Warning | Sita takes his arm; «chup raho!» — he turns and pushes her away |
| 33.4–38 | Night | The wall darkens, the moon; Ramu creeps to the sleeping hen with a sickle raised |
| 38–40 | The cut | One paste slash, the painting shakes, the hen tips over, feathers drift; silence |
| 40–43.4 | Nothing | Ramu kneels and searches; an empty thought bubble; he sits with his head in his hands |
| 43.4–48 | Morning | A pale sun, the rooster crows, the nest is empty; the rooster turns its back |
| 48–54 | Lesson | Ramu grieves, Sita bows her head; «लालच बुरी बला है» is written on the wall |
