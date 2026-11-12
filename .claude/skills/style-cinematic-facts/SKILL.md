---
name: style-cinematic-facts
description: Cinematic-facts style, in testing: the documentary-explainer look of fact Shorts — a deep, graded scene (a sea by default), light shafts, particles drifting in depth of field, bold condensed two-line captions top-left (a small white line over a big glowing coloured one, Anton), slow push-ins, vignette and film grain; subjects painted in code (or photo cutouts kept private). Use it for animal or science fact Shorts, «did you know» videos, explainer reels, or when working with styles/cinematic-facts/.
---

# Style · Cinematic facts

In testing. Films: `sandbox/2026-11-12-jellyfish/` (10 s, the first test, before the kit) and
`sandbox/2026-11-12-immortal-jellyfish/` (49 s, Turritopsis dohrnii, with the user's voice),
`sandbox/2026-11-12-octopus/` (57 s, 22 fast cuts, x-ray insides, a molecule split screen).

## Code

`styles/cinematic-facts/cinema.js` → `Cine`:

| Call | What it does |
|---|---|
| `sea(g, env, { top, mid, bottom, sun, key })` | the backdrop: a vertical grade and a bright patch at the surface (cached) |
| `rays(g, t, { n, alpha })` | light shafts swaying from the surface (additive) |
| `particles(g, env, t, { n, size, blur, alpha, speed, seed, color })` | drifting specks at one depth; blurred dots are made once and reused |
| `blurred(key, canvas, px)` | an out-of-focus copy of a canvas, made once per key |
| `cutout(env, key, img, { w, h, poly })` | a photo cut along a traced outline on a torn white edge (cached sprite, centred) |
| `caption(g, t, a, b, top, bottom, color, { x, y, size, maxW })` | the two-line caption, sliding in, shrinking to fit |
| `vignette(g, env, amount)` · `grain(ctx, env, t)` | the grade (cached) and film grain (four cached tiles) |
| `load(src)` | an image for setup(); a missing file returns null |

## Workflow: a facts Short from script to MP4

The user makes animal-facts Shorts for a Hindi-speaking YouTube channel (talks in Hinglish).
What worked, in order:

1. **Script first, facts checked.** 7–11 short Hindi lines (Devanagari, one fact per line),
   a hook in line 1, a subscribe line last; English captions on screen. Correct popular
   myths before they reach the script and say so (e.g. «1 ml kills 20,000 people» → «1 mg
   ≈ 10 people / 20,000 mice»; «research to make humans immortal» → «to understand ageing»;
   «9 brains» → «1 brain + a nerve centre in every arm», captioned as a question). Give the
   lines as separate ```text blocks so they paste into ElevenLabs; the user records them in
   one file (voice «Jeet – Charming Social Media Voice» for facts).
2. **Experiment:** `node engine/new.mjs <name> --style cinematic-facts --aspect 9:16
   --duration <s>`; the voice goes to `private/voice-elevenlabs.mp3` (never committed).
3. **Measure the voice:** `ffmpeg -i voice.mp3 -af silencedetect=noise=-35dB:d=0.15 -f null -`,
   then map the pauses to the script lines by their length (short pauses fall inside a line
   at commas and «...»). Write the table into brief.md.
4. **Re-time:** a `make-voice.sh` that adds ~0.4 s of air and pads to the film length
   (`adelay=400:all=1,apad=whole_dur=<s>`) → `private/voice.wav`; `audio.json` with
   `"music": "private/voice.wav"` plus a few effects from `assets/sfx/` (whoosh on cuts,
   glow_swell on reveals, button_click on subscribe). `node engine/mix.mjs`.
5. **Scene:** one shot list `[start, camera, subject options, extra]`, captions per line,
   `shots` declared. The subject is painted in code (photos only as reference: the user's
   images are usually downloaded from the web — keep them in `private/` and don't show them
   unless the user owns the rights; a code-made subject has no copyright problem).
6. **Look before render:** stills at 360–540 width at every shot, tile them, read them; fix;
   then `review.mjs` (no warnings, no still stretches), then the 1080 render (~2 s per second
   of film), `-crf 26` copy in `render/`, strip, GIF under 5 MB, docs, INDEX row, commit, push.

Cast written so far, to reuse: `sandbox/2026-11-12-immortal-jellyfish/turri.js` (a jellyfish,
side and top views), `sandbox/2026-11-12-octopus/octo.js` (an octopus with x-ray hearts,
vessels, nerves, beak, a `cute` face; fish schools; a seabed with kelp, coral and shells; a
ball-and-stick molecule), `sandbox/2026-11-12-jellyfish/scene.js` (a moon jelly).

## Style rules

- **One idea per caption**, two lines: a short white set-up (≤ 2 words), then the punch in
  colour (≤ 3 words). A new caption every 3–6 s, on the voice. Colours per fact, saturated
  and glowing: cyan, pink, yellow, orange, green, red.
- **Hook in the first 3–5 s:** a snap zoom (ease-back) onto the subject and the boldest claim.
- **Depth:** far particles small and sharp, mid ones slightly soft, a few near ones big and
  blurred in front of everything.
- **Motion:** smooth (not on twos); a slow push-in or drift on every shot.
- **Keep it fast:** never a live `filter: blur()` per frame — pre-blur (`particles`,
  `blurred`, glow sprites). A 49 s Short renders in ~100 s at 1080 without a GPU.
- **Facts are checked** before they go on screen, and hedged in the voice when sources differ.

## Lessons

- 2026-11-12 · jellyfish · Live canvas blur on two far jellies and near particles cost ~4 s a frame at 1080 (15 min for 10 s). Pre-blurred sprites took the immortal-jellyfish Short (49 s, more going on) to ~2 s of render per second of film.
- 2026-11-12 · immortal-jellyfish · Photo cutouts with a torn white edge read as collage, not cinema, in this style; the user preferred the subject painted in code after the photos (`turri.js`): a clear dome lit at its edges, a beaded bright rim, the red cross of the stomach glowing, a halo of curling tentacles.
- 2026-11-12 · octopus · Fast cutting (a shot every 1.5–3 s) reads as energetic when each cut has a short white flash (~0.12 s) and a zoom punch that settles; declare every shot in `shots`, or review.mjs reports the cuts as jumps. Coloured lines over glows must be drawn opaque: additive blue on a glow sums to white.
