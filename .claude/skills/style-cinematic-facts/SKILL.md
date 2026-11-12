---
name: style-cinematic-facts
description: Cinematic-facts style, in testing: the documentary-explainer look of fact Shorts — a deep, graded scene (a sea by default), light shafts, particles drifting in depth of field, bold condensed two-line captions top-left (a small white line over a big glowing coloured one, Anton), slow push-ins, vignette and film grain; subjects painted in code (or photo cutouts kept private). Use it for animal or science fact Shorts, «did you know» videos, explainer reels, or when working with styles/cinematic-facts/.
---

# Style · Cinematic facts

In testing. Films: `sandbox/2026-11-12-jellyfish/` (10 s, the first test, before the kit) and
`sandbox/2026-11-12-immortal-jellyfish/` (49 s, Turritopsis dohrnii, with the user's voice).

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
