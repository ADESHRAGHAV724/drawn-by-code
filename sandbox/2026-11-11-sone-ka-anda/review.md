# Reviews · sone-ka-anda

Each round: what was seen (automatic and by eye), what was changed and what lesson comes out.
Lessons that apply to other videos go up to the matching skill (see review/SKILL.md).

## Round 1

**Before the film:** a cast check sheet (`dev/cast-lab.js`, every motif and pose side by side).
Fixed there: the hen lying down sank below the ground (now rotated about her body's centre
and clipped at the ground); the cow read as two triangles with a stray `>` (now a long body
with a hump and a hanging head); the nest was a flat line (now a paste bowl with straw); the
«grieve» hands did not reach the head.

**Auto (review.mjs):** no warnings; ~24 ms/frame warm. Still stretches flagged at first all
over the dialogue holds; fixed with motion on twos (flocks crossing the sky, the roti being
torn, the sickle hand trembling, searching hands, sobbing shoulders, the bowed head swaying,
the dream eggs twinkling, feathers drifting slower). Still flagged and **intended**: the held
breath before the strike (36.8–37.8), the silence after the cut (38.8–41), the first moment
of grief (42.2–43.3) and the morning hush (44.2–45.2).

**By eye (stills at 1920 + contact sheets):**
- Walking home with the hen, Ramu crossed the hut and both merged into one white shape.
  → `Warli.human` got a `rim` option (the same figure, fatter, in wall colour, drawn first);
  the carried hen sits on a disc of wall.
- At night the rim was the daytime wall colour: a brown halo round every figure. → `rimColor`,
  the wall colour mixed with the night tint.
- The moral was never written: `seg(Infinity, Infinity + 0.5)` is NaN, and NaN is not ≤ 0.
  → the default «never» is 1e9.
- Kneeling, Ramu hid the fallen hen. → he kneels beside her.
- Flocks crossed the title and the moral (paste over paste). → flocks fly lower.

**Audio:** the voice peaks at −4 dB; the swoosh of the cut was too soft (−33 dB mean) → −1 dB;
the last two seconds were digital silence → a low wind under the moral.

**Lessons (to style-warli):** anything that passes in front of other paste gets a rim of the
wall *as it looks at that moment*; gold is allowed as the one accent colour when the story is
about gold, and only on gold things.
