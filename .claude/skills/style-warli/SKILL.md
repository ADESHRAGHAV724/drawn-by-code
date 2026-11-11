---
name: style-warli
description: Warli style, in testing: the tribal wall painting of Maharashtra, India — white rice paste on a red-brown mud wall, people built from two triangles and a circle, the tarpa dance ring, a sun of rays, huts, trees, animals, a chowk border of triangles. Use it for Indian, folk, tribal, village, harvest, festival, wedding or «Warli» looks, or when working with styles/warli/.
---

# Style · Warli

In testing. Reference so far: `styles/warli/template.js` (4 s). No style test in `sandbox/`
yet: make one (`node engine/new.mjs <name> --style warli`) before calling the style approved.

## Code

`styles/warli/warli.js` → `Warli`:

| Call | What it paints |
|---|---|
| `stroke(g, pts, { w, prog, dry, wob, seed, t })` | a rice-paste line from a bamboo twig: fatter where it lands, wobbling along its normal, thinner and broken over the `dry` tail. `prog` paints it on; `t` makes it boil on twos |
| `fill(g, pts, { wob, holes, seed })` · `dot` · `ring` | a filled paste shape with a wobbling edge and tiny pores of wall where the paste is thin |
| `human(g, x, y, H, pose, { sex, facing, pot, seed })` | a person standing on (x, y): two triangles meeting at the waist (a woman: a wider skirt and a bun), round head, stick limbs, a pot on the head. Returns `{ head, handL, handR, footL, footR }` in world coordinates |
| `pose(name, ph)` | `stand`, `dance`, `link` (tarpa ring), `walk`, `raise`, `play`; `ph` 0..1 is the phase of the move |
| `tarpaRing(g, cx, cy, R, { H, t, spin, appear, count, women })` | the dance ring: feet on the circle, heads out, the number of dancers chosen so the hands meet; `appear` makes them join one by one |
| `tarpaPlayer(g, x, y, H, { ph })` | the man at the centre blowing the gourd horn |
| `sun(g, x, y, r, { spin, grow })` · `moon` | disc, ring and a crown of triangle rays · crescent |
| `tree(g, x, y, H, { seed, prog, depth })` | a forking tree grown from its seed, leaves as paste teardrops at the twigs |
| `hut(g, x, y, W, { prog })` | mud walls, a hatched thatch roof, an arched door, dots under the eaves |
| `bird(g, x, y, s, flap)` · `deer(g, x, y, s, { ph, horns })` | a bird with two beating wings · a deer whose body is two triangles, trotting |
| `ground(g, x0, x1, y, { prog })` · `border(g, env, { prog })` | a wobbling ground line with grass tufts · the chowk frame: two lines with a band of triangles |
| `wall(g, env)` · `grain(ctx, env, { amount })` | the cached mud wall (geru red-brown, uneven drying, straw fibres, pits, hairline cracks) · specks over everything, from `post` |
| `twos(t)`, `drawing`, `polar`, `rot`, `circle`, `resample`, `wobble`, `WALL`, `PASTE` | helpers |

## Style rules

- **Two colours.** Rice-paste white (`PASTE` #f2eadb) on a mud wall (`WALL` #7b3b22, or a
  darker `WALL_DARK` for night). No shading, no gradients on the figures, no third colour.
  The wall carries all the texture; the paint is flat with a few pores.
- **Geometry is the grammar.** Circle (sun, moon, head), triangle (mountains, trees, the
  two halves of a body), square (the chowk, a hut). A person is always two triangles that
  touch at the waist, never a filled body or a stick torso.
- **Everything is a twig line.** Nothing ruler-straight or perfectly round: every line goes
  through `stroke`/`fill`, which add the wobble and the dry ends. Never draw with raw
  `g.lineTo` in paste colour.
- **Flat, no perspective.** Figures stand on a ground line or on a circle, in profile or
  frontal. Distance is shown by size and by height on the wall, never by overlap or by
  foreshortening.
- **Life in rings and rows.** People repeat: a dance ring, a line of harvesters, a row of
  women with pots. One figure alone reads as a symbol; a crowd tells the story.
- **Motion on twos.** Poses, wings, legs and the ring's turn change every 1/12 s (`twos(t)`).
  Elements arrive by being *painted on* (`prog`) or by joining the ring (`appear`), not by
  fading or sliding in.
- **Space on the wall.** Leave wall between motifs; the border frames the whole scene.

## Style checklist

- [ ] Only paste white on the wall; no third colour, no gradient on a figure.
- [ ] Every person has two triangles meeting at the waist; women read by skirt and bun.
- [ ] In a ring, the neighbours' hands meet (let `tarpaRing` choose the count).
- [ ] No motif crosses the border; trees and birds stay inside the frame.
- [ ] Birds never fly with level wings (they read as planes): they beat from half to fully raised.
- [ ] Tree forks leave from the top of their limb: no stub sticking out past a fork.
- [ ] Moves on twos; nothing slides on a smooth curve except the slow turn of the sun or ring.
- [ ] Cropped at full resolution: dry ends and pores visible, wall texture behind.

## Lessons

- A big `dot` with a wobble proportional to its radius turns the sun into a potato: the
  wobble is capped at about 1.6 units.
- Smear arcs on the wall above ~2 % alpha read as stains on top of the painting, not as
  plaster underneath.
