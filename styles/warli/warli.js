// Warli style kit: white rice-paste painting on a red-brown mud wall, the tribal art of the
// Warli people of the Sahyadri hills (Maharashtra, India). Global: Warli.
// Depends on engine/core.js (Motion, Ease).
//
// The grammar is geometric: a person is two triangles joined at the waist, a circle head and
// stick limbs; the sun is a disc in a ring of rays; a hut is a square under a hatched
// triangle; the tarpa dance is a ring of people holding hands around a horn player. Every
// line is a bamboo twig dipped in paste: never ruler-straight, a little thicker where it
// lands, thinner and broken where the paste runs out. All jitter is seeded, never per frame
// (pass `t` only when a shape should boil on twos).
const Warli = (() => {
    const WALL = '#7b3b22', WALL_DARK = '#5a2815', WALL_LIGHT = '#98522f', PASTE = '#f2eadb';
    const PORE = 'rgba(112,50,26,0.55)';
    const TAU = Math.PI * 2;

    // Drawing number on twos (12 drawings a second) and the time it stands for.
    const drawing = (t, fps = 12) => Math.floor(t * fps + 1e-6);
    const twos = (t, fps = 12) => drawing(t, fps) / fps;

    const rot = ([x, y], a, [cx, cy] = [0, 0]) => {
        const c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy;
        return [cx + dx * c - dy * s, cy + dx * s + dy * c];
    };
    const polar = ([x, y], a, len) => [x + Math.cos(a) * len, y + Math.sin(a) * len];
    const circle = (cx, cy, r, n = 40, a0 = 0, a1 = TAU) =>
        Array.from({ length: n + 1 }, (_, i) => {
            const a = a0 + ((a1 - a0) * i) / n;
            return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
        });

    function resample(pts, step) {
        const out = [pts[0]];
        for (let i = 1; i < pts.length; i++) {
            const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
            const m = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step));
            for (let k = 1; k <= m; k++) out.push([ax + ((bx - ax) * k) / m, ay + ((by - ay) * k) / m]);
        }
        return out;
    }

    // The hand is not a ruler: shift every point along the line's normal with slow noise.
    function wobble(pts, amp, seed) {
        if (amp <= 0) return pts;
        return pts.map((p, i) => {
            const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
            const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
            const d = Motion.noise1(seed, i * 0.13) * amp;
            return [p[0] - (ty / l) * d, p[1] + (tx / l) * d];
        });
    }

    const seedOf = (seed, t) => (t == null ? seed : seed + ':' + drawing(t));

    /**
     * A rice-paste line. pts: polyline (polygon with closed). w: width in units.
     * prog 0..1 paints it on. dry 0..1: how much of the end runs out of paste (thinner,
     * broken). wob: wobble as a fraction of w. t: pass it to make the line boil on twos.
     */
    function stroke(g, pts, o = {}) {
        const { w = 4, seed = 's', color = PASTE, closed = false, prog = 1, dry = 0.25, wob = 0.5, t = null } = o;
        if (prog <= 0 || pts.length < 2) return;
        const sd = seedOf(seed, t);
        const p = wobble(resample(closed ? [...pts, pts[0]] : pts, Math.max(1.5, w * 0.7)), w * wob, sd);
        const n = Math.max(2, Math.ceil(p.length * Math.min(1, prog)));
        g.save();
        g.strokeStyle = color;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        for (let i = 1; i < n; i++) {
            const f = i / (p.length - 1);
            const run = dry > 0 ? Math.max(0, (f - (1 - dry)) / dry) : 0; // 0 → 1 over the dry tail
            if (run > 0 && Motion.noise1(sd + 'gap', i * 0.55) > 1 - run * 1.3) continue;
            // the twig lands loaded: a little fatter over the first stretch
            const land = 1 + 0.35 * Math.max(0, 1 - f * 6);
            g.lineWidth = w * land * (0.85 + 0.22 * Motion.noise1(sd + 'w', i * 0.21)) * (1 - 0.45 * run);
            g.beginPath();
            g.moveTo(p[i - 1][0], p[i - 1][1]);
            g.lineTo(p[i][0], p[i][1]);
            g.stroke();
        }
        g.restore();
    }

    /**
     * A filled paste shape (a torso triangle, a head, a sun). The edge wobbles and the
     * paste is thin in places: tiny pores of wall show through (holes 0..1).
     */
    function fill(g, pts, o = {}) {
        const { seed = 'f', color = PASTE, wob = 1, holes = 0.5, t = null } = o;
        const sd = seedOf(seed, t);
        const p = wobble(resample([...pts, pts[0]], 2.5), wob, sd);
        g.save();
        g.fillStyle = color;
        g.beginPath();
        p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.closePath();
        g.fill();
        if (holes > 0) {
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            for (const [x, y] of p) (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
            const n = Math.min(70, Math.round(((x1 - x0) * (y1 - y0) * holes) / 260));
            if (n > 0) {
                g.clip();
                g.fillStyle = PORE;
                const r = Motion.rng(sd + 'pores');
                for (let i = 0; i < n; i++) {
                    const s = 0.4 + r() * r() * 1.6;
                    g.beginPath();
                    g.ellipse(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), s * 1.4, s, r() * Math.PI, 0, TAU);
                    g.fill();
                }
            }
        }
        g.restore();
    }

    const dot = (g, x, y, r, o = {}) => fill(g, circle(x, y, r, Math.max(10, Math.round(r * 3))), { wob: Math.min(r * 0.12, 1.6), holes: 0.3, ...o });
    const ring = (g, x, y, r, o = {}) => stroke(g, circle(x, y, r, Math.max(16, Math.round(r))), { closed: false, dry: 0.08, ...o });

    // --- people ------------------------------------------------------------------------

    // Mirror an arm/leg pair of angles across the vertical axis.
    const mir = ([a, b]) => [Math.PI - a, Math.PI - b];

    /**
     * Poses: angles (radians, 0 = right, +π/2 = down) for [shoulder→elbow, elbow→hand] and
     * [hip→knee, knee→foot]. ph 0..1 is the phase of the move; feed it on twos.
     */
    function pose(name, ph = 0) {
        const s = Math.sin(ph * TAU), c = Math.cos(ph * TAU);
        switch (name) {
            case 'dance': {
                // arms up in a V with bent elbows, one knee lifted, swapping each half cycle
                const armR = [-0.45 - 0.25 * s, -1.25 - 0.3 * s];
                const legR = s > 0 ? [0.55, 1.65] : [1.2, 1.45];
                const legL = s > 0 ? mir([1.2, 1.45]) : mir([0.55, 1.65]);
                return { armR, armL: mir([-0.45 + 0.25 * s, -1.25 + 0.3 * s]), legR, legL, lean: 0.06 * s };
            }
            case 'link': {
                // the tarpa ring: arms out sideways to the neighbours, knees bouncing
                const b = 0.12 * s;
                return { armR: [-0.12 + b, 0.05 + b], armL: mir([-0.12 - b, 0.05 - b]), legR: [1.15 + 0.12 * c, 1.5], legL: mir([1.15 - 0.12 * c, 1.5]), lean: 0 };
            }
            case 'walk': {
                const k = 0.38 * s;
                return { armR: [1.57 - k, 1.4 - k], armL: [1.57 + k, 1.75 + k], legR: [1.57 - k, 1.57 - k + 0.25 * Math.max(0, -s)], legL: [1.57 + k, 1.57 + k - 0.25 * Math.max(0, s)], lean: -0.05 };
            }
            case 'raise':
                return { armR: [-0.8, -1.3], armL: mir([-0.8, -1.3]), legR: [1.3, 1.5], legL: mir([1.3, 1.5]), lean: 0 };
            case 'play': // both hands at the mouth (tarpa, flute)
                return { armR: [0.2, -2.3], armL: [-0.15, -2.6], legR: [1.25, 1.55], legL: mir([1.25, 1.55]), lean: -0.04 + 0.03 * s };
            // the following poses face the way the figure faces: both arms or both legs
            // reach forward, so they are not mirrored
            case 'sit': // on the ground, legs forward, hands on the knees
                return { armR: [1.0, 0.25], armL: [1.2, 0.35], legR: [0.05, 1.5], legL: [0.15, 1.55], lean: 0.05 };
            case 'grieve': // sitting, head in the hands, bent forward
                return { armR: [-1.0, -2.9], armL: [-2.1, -0.25], legR: [-0.25, 1.75], legL: [-0.15, 1.8], lean: 0.3 + 0.07 * s };
            case 'kneel': // on the knees, shins flat behind, hands searching in front
                return { armR: [0.7 + 0.25 * s, 0.9], armL: [0.9 - 0.25 * s, 1.1], legR: [1.45, Math.PI - 0.05], legL: [1.6, Math.PI - 0.05], lean: 0.3 };
            case 'hold': // both hands up in front, holding something high
                return { armR: [-0.7, -1.5], armL: [-0.95, -1.35], legR: [1.3, 1.5], legL: mir([1.3, 1.5]), lean: -0.05 };
            case 'carry': // both hands at the chest, holding something against it
                return { armR: [1.15, -0.45], armL: [1.35, -0.3], legR: [1.3, 1.5], legL: mir([1.3, 1.5]), lean: 0 };
            case 'reach': // one arm straight out in front (giving, grabbing, pushing)
                return { armR: [0.1, 0.0], armL: mir([1.2, 1.45]), legR: [1.3, 1.5], legL: mir([1.3, 1.5]), lean: 0.05 };
            case 'creep': // bent forward on bent knees, the right arm raised behind the head
                return { armR: [-1.9, -2.4 + 0.15 * s], armL: [0.5, 0.9], legR: [0.9 + 0.3 * s, 1.9], legL: [2.0 - 0.3 * s, 1.5], lean: 0.25 };
            case 'strike': // the raised arm brought down in front
                return { armR: [0.55, 1.0], armL: [1.5, 1.6], legR: [0.85, 1.7], legL: [2.0, 1.55], lean: 0.3 };
            default: // stand
                return { armR: [1.2, 1.45], armL: mir([1.2, 1.45]), legR: [1.3, 1.5], legL: mir([1.3, 1.5]), lean: 0 };
        }
    }

    /**
     * A Warli person standing on (x, y), H tall. Two filled triangles meeting at the waist
     * (a woman's lower triangle is a wider skirt, and she wears a bun), a round head, stick
     * limbs. pose: from pose() or your own angles. plant drops a sitting or kneeling figure
     * onto y; rim draws it on a rim of wall colour (rimColor: the wall as it looks, e.g. at
     * night) so it reads in front of other paste.
     * Returns the world positions of the head, hands and feet in the current coordinates
     * (before any transform you applied).
     */
    function human(g, x, y, H, p = pose('stand'), o = {}) {
        const { sex = 'm', seed = 'h', t = null, facing = 1, pot = false, plant = false, rim = false } = o;
        const lw = Math.max(1.4, H * 0.028);
        // rim: first the same figure, fatter, in wall colour, so it reads in front of
        // another paste motif (paste on paste merges into one shape)
        if (rim) human(g, x, y, H, p, { ...o, rim: false, ink: o.rimColor ?? WALL, widen: lw * 3 });
        const ink = o.ink ?? PASTE, widen = o.widen ?? 0;
        const S = (gg, pts, oo) => stroke(gg, pts, { ...oo, color: ink, w: oo.w + widen, dry: widen ? 0 : oo.dry });
        const F = (gg, pts, oo) => {
            fill(gg, pts, { ...oo, color: ink, holes: widen ? 0 : oo.holes });
            if (widen) stroke(gg, pts, { w: widen, color: ink, closed: true, dry: 0, seed: oo.seed + 'rim' });
        };
        const D = (gg, px, py, r, oo) => dot(gg, px, py, r + widen / 2, { ...oo, color: ink, holes: widen ? 0 : oo.holes });
        const shY = -0.74 * H, waistY = -0.5 * H, waist = [0, waistY];
        const sw = 0.155 * H;
        const hw = sex === 'f' ? 0.21 * H : 0.13 * H, hipY = sex === 'f' ? -0.22 * H : -0.31 * H;
        const lean = p.lean || 0;
        const up = (q) => rot(q, lean * facing, waist);
        const sd = seedOf(seed, t);
        const out = {};
        // plant: drop the figure so the lowest knee or foot touches y (sitting, kneeling)
        const legLen0 = (-(sex === 'f' ? -0.22 * H : -0.31 * H) - 0.03 * H) / 2 + 0.01 * H;
        let low = -Infinity;
        if (plant) {
            const hy = sex === 'f' ? -0.22 * H : -0.31 * H;
            for (const [a, b] of [p.legL, p.legR]) {
                const ky = hy + Math.sin(a) * legLen0;
                low = Math.max(low, ky, ky + Math.sin(b) * legLen0);
            }
            y -= low;
        }
        g.save();
        g.translate(x, y);
        if (facing < 0) g.scale(-1, 1);

        // legs from the base of the lower triangle (a skirt: from under it)
        const roots = sex === 'f' ? [[-0.06 * H, hipY], [0.06 * H, hipY]] : [[-hw * 0.8, hipY], [hw * 0.8, hipY]];
        const legLen = (-hipY - 0.03 * H) / 2 + 0.01 * H;
        [['L', p.legL, roots[0], -1], ['R', p.legR, roots[1], 1]].forEach(([k, [a, b], r0, side]) => {
            const knee = polar(r0, a, legLen), foot = polar(knee, b, legLen);
            S(g, [r0, knee, foot], { w: lw, seed: sd + 'leg' + k, dry: 0.15 });
            S(g, [foot, [foot[0] + side * 0.05 * H, foot[1] + 0.004 * H]], { w: lw * 0.9, seed: sd + 'ft' + k, dry: 0.4 });
            out['foot' + k] = foot;
        });

        // body
        F(g, [waist, [hw, hipY], [-hw, hipY]], { seed: sd + 'lo', wob: lw * 0.35 });
        F(g, [up([-sw, shY]), up([sw, shY]), waist], { seed: sd + 'up', wob: lw * 0.35 });

        // arms from the shoulder corners
        const armLen = 0.155 * H;
        [['L', p.armL, -1], ['R', p.armR, 1]].forEach(([k, [a, b], side]) => {
            const s0 = up([side * sw * 0.94, shY + 0.012 * H]);
            const el = polar(s0, a + lean, armLen), hand = polar(el, b + lean, armLen * 0.95);
            S(g, [s0, el, hand], { w: lw, seed: sd + 'arm' + k, dry: 0.15 });
            D(g, hand[0], hand[1], lw * 0.75, { seed: sd + 'hd' + k, holes: 0 });
            out['hand' + k] = hand;
        });

        // neck, head, bun, pot
        const neck = up([0, shY]), head = up([0, -0.865 * H]), hr = 0.075 * H;
        S(g, [neck, up([0, -0.8 * H])], { w: lw, seed: sd + 'nk', dry: 0 });
        D(g, head[0], head[1], hr, { seed: sd + 'hd' });
        if (sex === 'f') {
            const bun = up([-0.07 * H, -0.85 * H]);
            D(g, bun[0], bun[1], hr * 0.5, { seed: sd + 'bun', holes: 0 });
        }
        if (pot) {
            const pc = up([0, -1.0 * H]);
            F(g, [...circle(pc[0], pc[1], 0.06 * H, 18, 0, Math.PI), [pc[0] - 0.03 * H, pc[1] - 0.075 * H], [pc[0] + 0.03 * H, pc[1] - 0.075 * H]], { seed: sd + 'pot', wob: 0.6 });
        }
        out.head = head;
        g.restore();

        const toWorld = ([px, py]) => [x + px * facing, y + py];
        for (const k of Object.keys(out)) out[k] = toWorld(out[k]);
        return out;
    }

    /**
     * The tarpa player: a man blowing a long gourd horn that curls out to one side and
     * flares into a bell. The horn sways with ph.
     */
    function tarpaPlayer(g, x, y, H, o = {}) {
        const { ph = 0, seed = 'tarpa', facing = 1 } = o;
        const p = pose('play', ph);
        const parts = human(g, x, y, H, p, { seed, facing });
        const [hx, hy] = parts.head;
        const sway = Math.sin(ph * TAU) * 0.05 * H;
        const m = [hx + facing * 0.07 * H, hy + 0.03 * H];
        const horn = [m, [m[0] + facing * 0.22 * H, m[1] - 0.05 * H + sway], [m[0] + facing * 0.42 * H, m[1] + 0.06 * H + sway], [m[0] + facing * 0.55 * H, m[1] + 0.22 * H + sway]];
        stroke(g, horn, { w: Math.max(1.6, H * 0.034), seed: seed + 'horn', dry: 0 });
        const e = horn[3];
        fill(g, [[e[0] - facing * 0.04 * H, e[1] - 0.02 * H], [e[0] + facing * 0.11 * H, e[1] + 0.02 * H], [e[0] + facing * 0.02 * H, e[1] + 0.14 * H]], { seed: seed + 'bell', wob: 0.8 });
        return parts;
    }

    /**
     * A ring of the tarpa dance around (cx, cy): people with their feet on the circle of
     * radius R, heads out, holding hands. The count is chosen so the hands meet. spin turns
     * the ring (radians); appear 0..1 lets the dancers join one by one; t drives the dance
     * on twos.
     */
    function tarpaRing(g, cx, cy, R, o = {}) {
        const { H = 70, t = 0, spin = 0, appear = 1, seed = 'ring', count, women = 'alternate' } = o;
        const n = count ?? Math.max(5, Math.round((TAU * (R + 0.66 * H)) / (0.95 * H)));
        const tt = twos(t);
        const show = Math.ceil(n * Ease.clamp(appear));
        for (let i = 0; i < show; i++) {
            const a = spin + (i / n) * TAU;
            const sex = women === 'all' ? 'f' : women === 'none' ? 'm' : i % 2 ? 'f' : 'm';
            g.save();
            g.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
            g.rotate(a + Math.PI / 2);
            human(g, 0, 0, H, pose('link', tt * 1.2 + (i % 2) * 0.5), { sex, seed: seed + i });
            g.restore();
        }
        return n;
    }

    // --- nature and village --------------------------------------------------------------

    /** The sun: a disc, a ring and a crown of triangular rays that turns slowly. */
    function sun(g, x, y, r, o = {}) {
        const { spin = 0, rays = 18, seed = 'sun', grow = 1 } = o;
        if (grow <= 0) return;
        const R = r * grow;
        dot(g, x, y, R * 0.52, { seed: seed + 'disc' });
        ring(g, x, y, R * 0.7, { w: Math.max(2, R * 0.06), seed: seed + 'ring' });
        for (let i = 0; i < rays; i++) {
            const a = spin + (i / rays) * TAU, da = (TAU / rays) * 0.28;
            fill(g, [polar([x, y], a - da, R * 0.84), polar([x, y], a + da, R * 0.84), polar([x, y], a, R * 1.18)], { seed: seed + 'ray' + i, wob: R * 0.015, holes: 0.2 });
        }
    }

    /** A crescent moon. */
    function moon(g, x, y, r, o = {}) {
        const { seed = 'moon' } = o;
        const outer = circle(x, y, r, 36, -2.2, 2.2), inner = circle(x + r * 0.45, y, r * 0.75, 30, 1.95, -1.95);
        fill(g, [...outer, ...inner], { seed, wob: r * 0.03 });
    }

    /**
     * A tree grown from its seed: a trunk that forks into branches, leaves as paste
     * teardrops along the last twigs. prog 0..1 grows it (trunk first, leaves last).
     */
    function tree(g, x, y, H, o = {}) {
        const { seed = 'tree', prog = 1, depth = 4, lean = 0, leaf = 1 } = o;
        if (prog <= 0) return;
        const r = Motion.rng(seed);
        const segs = [];
        const grow = (p, a, len, d) => {
            const mid = polar(p, a + (r() - 0.5) * 0.25, len * 0.5);
            const end = polar(mid, a + (r() - 0.5) * 0.25, len * 0.5);
            segs.push({ pts: [p, mid, end], d, w: H * 0.045 * Math.pow(0.68, depth - d), end, a });
            if (d <= 1) return;
            const k = 2 + (r() < 0.35 ? 1 : 0);
            // forks leave from the top of the limb (never past it: a stub reads as a stump)
            for (let i = 0; i < k; i++) {
                const spread = 0.95 * (i / (k - 1) - 0.5) * 2;
                const from = i === 0 || r() < 0.5 ? end : Ease.lerpPt(mid, end, 0.5 + r() * 0.4);
                grow(from, a + spread * (0.5 + r() * 0.2), len * (0.62 + r() * 0.12), d - 1);
            }
        };
        grow([x, y], -Math.PI / 2 + lean, H * 0.42, depth);
        const tBranch = Ease.seg(prog, 0, 0.75), tLeaf = Ease.seg(prog, 0.6, 1);
        for (const s of segs) {
            const u = Ease.seg(tBranch, (depth - s.d) / depth, (depth - s.d + 1) / depth);
            stroke(g, s.pts, { w: Math.max(1.5, s.w), seed: seed + s.pts[0].join(','), prog: u, dry: 0.2 });
        }
        if (tLeaf <= 0 || !leaf) return;
        const lr = Motion.rng(seed + 'leaves');
        const tips = segs.filter((s) => s.d === 1);
        tips.forEach((s, i) => {
            const k = Ease.seg(tLeaf, i / tips.length * 0.6, i / tips.length * 0.6 + 0.4);
            if (k <= 0) return;
            for (let j = 0; j < 5; j++) {
                const f = 0.3 + j * 0.17, side = j % 2 ? 1 : -1;
                const base = Ease.lerpPt(s.pts[1], s.end, f);
                const la = s.a + side * (0.7 + lr() * 0.3), L = H * (0.05 + lr() * 0.02) * k;
                const tip = polar(base, la, L), mid = polar(base, la, L * 0.5);
                const nx = -Math.sin(la) * L * 0.28, ny = Math.cos(la) * L * 0.28;
                fill(g, [base, [mid[0] + nx, mid[1] + ny], tip, [mid[0] - nx, mid[1] - ny]], { seed: seed + 'lf' + i + j, wob: 0.4, holes: 0 });
            }
            dot(g, s.end[0], s.end[1], H * 0.012 * k, { seed: seed + 'tip' + i, holes: 0 });
        });
    }

    /**
     * A hut standing on (x, y), W wide: mud walls as an outline, a triangle roof hatched with
     * thatch lines, a door, a row of dots under the eaves. prog 0..1 builds it.
     */
    function hut(g, x, y, W, o = {}) {
        const { seed = 'hut', prog = 1 } = o;
        if (prog <= 0) return;
        const lw = Math.max(2, W * 0.025), h = W * 0.5, top = y - h;
        const u = (a, b) => Ease.seg(prog, a, b);
        stroke(g, [[x - W / 2, top], [x - W / 2, y], [x + W / 2, y], [x + W / 2, top]], { w: lw, seed: seed + 'walls', prog: u(0, 0.3) });
        const peak = [x, top - W * 0.48], eL = [x - W * 0.66, top + W * 0.04], eR = [x + W * 0.66, top + W * 0.04];
        stroke(g, [eL, peak, eR, eL], { w: lw, seed: seed + 'roof', prog: u(0.2, 0.5) });
        const lines = 9, k = u(0.45, 0.8);
        for (let i = 1; i < lines; i++) {
            if (i / lines > k) break;
            const f = i / lines;
            const a = Ease.lerpPt(eL, peak, f), b = Ease.lerpPt(eR, peak, f);
            stroke(g, [a, b], { w: lw * 0.7, seed: seed + 'th' + i, dry: 0.3 });
        }
        const dw = W * 0.2, dh = h * 0.68;
        stroke(g, [[x - dw / 2, y], [x - dw / 2, y - dh * 0.7], ...circle(x, y - dh * 0.7, dw / 2, 12, Math.PI, TAU).slice(1), [x + dw / 2, y]], { w: lw * 0.8, seed: seed + 'door', prog: u(0.7, 0.9) });
        const dots = 7, kd = u(0.85, 1);
        for (let i = 0; i < dots; i++) if ((i + 1) / dots <= kd + 1e-6) dot(g, x - W * 0.42 + (i * W * 0.84) / (dots - 1), top + h * 0.18, lw * 0.75, { seed: seed + 'd' + i, holes: 0 });
    }

    /**
     * A bird in flight: a paste body (a long triangle with a tail fork) and two wings, each
     * a filled bent triangle that flaps between up and down; flap 0..1 (feed it on twos).
     */
    function bird(g, x, y, s, flap = 0, o = {}) {
        const { seed = 'bird', facing = 1 } = o;
        const f = facing, lift = Math.sin(flap * TAU); // +1 wings up, -1 down
        fill(g, [[x + f * s * 0.5, y - s * 0.04], [x - f * s * 0.3, y - s * 0.06], [x - f * s * 0.48, y - s * 0.16], [x - f * s * 0.42, y], [x - f * s * 0.48, y + s * 0.12], [x - f * s * 0.3, y + s * 0.05]], { seed: seed + 'b', wob: 0.3, holes: 0 });
        dot(g, x + f * s * 0.5, y - s * 0.06, s * 0.07, { seed: seed + 'hd', holes: 0 });
        stroke(g, [[x + f * s * 0.56, y - s * 0.07], [x + f * s * 0.68, y - s * 0.04]], { w: Math.max(1.2, s * 0.04), seed: seed + 'bk', dry: 0 });
        // the wings never go flat (a flat wing reads as a plane): they beat between half and
        // fully raised, the far wing a little smaller and ahead of the near one
        const up = 0.45 + 0.55 * (0.5 + 0.5 * lift);
        [[0.1, 0.8, 'far'], [0, 1, 'near']].forEach(([dx, k, name]) => {
            const root = [x + f * s * (0.14 + dx), y - s * 0.04], back = [x - f * s * (0.1 - dx), y - s * 0.04];
            const el = [x + f * s * (0.06 + dx), y - s * (0.08 + 0.32 * up) * k], tip = [x - f * s * (0.22 - dx), y - s * (0.1 + 0.5 * up) * k];
            fill(g, [root, el, tip, [(el[0] + back[0]) / 2, (el[1] + back[1]) / 2 + s * 0.04], back], { seed: seed + name, wob: 0.3, holes: 0 });
        });
    }

    /**
     * A deer or goat in profile, walking: a body of two triangles meeting in the middle
     * (the same grammar as people), stick legs that trot with ph, antlers when horns.
     */
    function deer(g, x, y, s, o = {}) {
        const { ph = 0, seed = 'deer', facing = 1, horns = true } = o;
        const lw = Math.max(1.4, s * 0.035);
        g.save();
        g.translate(x, y);
        if (facing < 0) g.scale(-1, 1);
        const bodyY = -0.5 * s, mid = [0, bodyY];
        fill(g, [mid, [0.34 * s, bodyY - 0.16 * s], [0.34 * s, bodyY + 0.14 * s]], { seed: seed + 'f', wob: lw * 0.3 });
        fill(g, [mid, [-0.34 * s, bodyY - 0.15 * s], [-0.34 * s, bodyY + 0.12 * s]], { seed: seed + 'r', wob: lw * 0.3 });
        const k = Math.sin(ph * TAU) * 0.3;
        [[0.27, k], [0.2, -k], [-0.27, -k], [-0.2, k]].forEach(([fx, a], i) => {
            const top = [fx * s, bodyY + 0.08 * s];
            const knee = polar(top, Math.PI / 2 + a, 0.21 * s), hoof = polar(knee, Math.PI / 2 + a * 0.3, 0.21 * s);
            stroke(g, [top, knee, hoof], { w: lw, seed: seed + 'lg' + i, dry: 0.1 });
        });
        const neck0 = [0.3 * s, bodyY - 0.08 * s], head = [0.47 * s, bodyY - 0.33 * s];
        stroke(g, [neck0, head], { w: lw * 1.6, seed: seed + 'nk', dry: 0 });
        fill(g, [[head[0] - 0.06 * s, head[1] - 0.05 * s], [head[0] + 0.2 * s, head[1] + 0.06 * s], [head[0] - 0.03 * s, head[1] + 0.08 * s]], { seed: seed + 'hd', wob: 0.4, holes: 0 });
        stroke(g, [[-0.32 * s, bodyY - 0.08 * s], [-0.4 * s, bodyY - 0.16 * s]], { w: lw, seed: seed + 'tl' });
        if (horns) {
            for (const side of [0, 1]) {
                const b = [head[0] - 0.02 * s + side * 0.03 * s, head[1] - 0.04 * s];
                const m = [b[0] - 0.06 * s, b[1] - 0.16 * s], tip = [b[0] - 0.02 * s, b[1] - 0.28 * s];
                stroke(g, [b, m, tip], { w: lw * 0.8, seed: seed + 'h' + side });
                stroke(g, [m, [m[0] + 0.07 * s, m[1] - 0.06 * s]], { w: lw * 0.7, seed: seed + 'hb' + side });
            }
        }
        g.restore();
    }

    /** The ground: a wobbling paste line with tufts of grass (small V strokes). */
    function ground(g, x0, x1, y, o = {}) {
        const { seed = 'ground', w = 3, tufts = 0.6, prog = 1 } = o;
        const pts = resample([[x0, y], [x1, y]], 30).map(([x, yy], i) => [x, yy + Motion.noise1(seed, i * 0.4) * 4]);
        stroke(g, pts, { w, seed, prog, dry: 0.1 });
        const r = Motion.rng(seed + 'tufts');
        const n = Math.round(((x1 - x0) / 60) * tufts);
        for (let i = 0; i < n; i++) {
            const gx = x0 + r() * (x1 - x0), h = 10 + r() * 10;
            if ((gx - x0) / (x1 - x0) > prog) continue;
            for (const a of [-0.45, 0, 0.45]) stroke(g, [[gx, y], [gx + Math.sin(a) * h, y - Math.cos(a) * h]], { w: w * 0.6, seed: seed + i + a, dry: 0.5 });
        }
    }

    /**
     * The chowk border: two lines around the frame with a band of paste triangles between
     * them, like the frame painted round a wedding chowk. prog 0..1 paints it round.
     */
    function border(g, env, o = {}) {
        const { inset = 26, band = 26, seed = 'border', prog = 1 } = o;
        if (prog <= 0) return;
        const W = env.W, H = env.H;
        const rect = (m) => [[m, m], [W - m, m], [W - m, H - m], [m, H - m], [m, m]];
        stroke(g, rect(inset), { w: 3, seed: seed + 'o', prog, dry: 0 });
        stroke(g, rect(inset + band), { w: 3, seed: seed + 'i', prog, dry: 0 });
        const m = inset + band / 2, sides = [[[m, m], [W - m, m]], [[W - m, m], [W - m, H - m]], [[W - m, H - m], [m, H - m]], [[m, H - m], [m, m]]];
        const per = sides.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
        const total = per.reduce((a, b) => a + b, 0);
        let run = 0;
        sides.forEach(([a, b], si) => {
            const n = Math.round(per[si] / (band * 1.2));
            const dx = (b[0] - a[0]) / n, dy = (b[1] - a[1]) / n, l = Math.hypot(dx, dy);
            const nx = -dy / l, ny = dx / l, hb = band * 0.32;
            for (let i = 0; i < n; i++) {
                if ((run + (i + 1) * l) / total > prog) return;
                const c = [a[0] + dx * (i + 0.5), a[1] + dy * (i + 0.5)];
                const flip = i % 2 ? 1 : -1;
                fill(g, [[c[0] - dx * 0.4 - nx * hb * flip, c[1] - dy * 0.4 - ny * hb * flip], [c[0] + dx * 0.4 - nx * hb * flip, c[1] + dy * 0.4 - ny * hb * flip], [c[0] + nx * hb * flip, c[1] + ny * hb * flip]], { seed: seed + si + '_' + i, wob: 0.5, holes: 0.2 });
            }
            run += per[si];
        });
    }

    // --- the wall ---------------------------------------------------------------------------

    /**
     * The mud wall: red-brown geru over cow-dung plaster, mottled where it dried unevenly,
     * with the arcs of the hand that smeared it, straw fibres and pits. Cached.
     */
    function wall(g, env, o = {}) {
        const { key = 'wall', color = WALL } = o;
        const pad = 200, box = { x: -pad, y: -pad, w: env.W + pad * 2, h: env.H + pad * 2 };
        Motion.sprite('warli:' + key + color, box, env.k, (c) => {
            const r = Motion.rng(key);
            c.fillStyle = color;
            c.fillRect(box.x, box.y, box.w, box.h);
            // uneven drying: large soft blotches, lighter and darker
            for (let i = 0; i < 70; i++) {
                const x = box.x + r() * box.w, y = box.y + r() * box.h, rad = 80 + r() * 260;
                const gr = c.createRadialGradient(x, y, 0, x, y, rad);
                const tone = r() < 0.5 ? '255,210,170' : '40,12,4';
                gr.addColorStop(0, `rgba(${tone},${0.04 + r() * 0.05})`);
                gr.addColorStop(1, `rgba(${tone},0)`);
                c.fillStyle = gr;
                c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
            }
            // the smearing hand: wide soft arcs
            c.lineCap = 'round';
            for (let i = 0; i < 90; i++) {
                const x = box.x + r() * box.w, y = box.y + r() * box.h, rad = 40 + r() * 90, a = r() * TAU;
                c.strokeStyle = r() < 0.5 ? 'rgba(255,200,160,0.014)' : 'rgba(30,8,2,0.02)';
                c.lineWidth = 10 + r() * 22;
                c.beginPath();
                c.arc(x, y, rad, a, a + 1 + r() * 1.6);
                c.stroke();
            }
            // straw fibres and pits
            for (let i = 0; i < 1400; i++) {
                const x = box.x + r() * box.w, y = box.y + r() * box.h, a = r() * Math.PI, l = 3 + r() * 9;
                c.strokeStyle = r() < 0.6 ? 'rgba(35,12,4,0.16)' : 'rgba(230,180,120,0.12)';
                c.lineWidth = 0.6 + r() * 0.6;
                c.beginPath();
                c.moveTo(x, y);
                c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
                c.stroke();
            }
            for (let i = 0; i < 900; i++) {
                c.fillStyle = r() < 0.7 ? 'rgba(30,8,2,0.22)' : 'rgba(255,220,180,0.10)';
                c.beginPath();
                c.arc(box.x + r() * box.w, box.y + r() * box.h, 0.5 + r() * 1.6, 0, TAU);
                c.fill();
            }
            // a couple of hairline cracks
            for (let i = 0; i < 6; i++) {
                let x = box.x + r() * box.w, y = box.y + r() * box.h, a = r() * TAU;
                c.strokeStyle = 'rgba(25,6,2,0.25)';
                c.lineWidth = 0.8;
                c.beginPath();
                c.moveTo(x, y);
                for (let k = 0; k < 14; k++) {
                    a += (r() - 0.5) * 1.1;
                    x += Math.cos(a) * 9;
                    y += Math.sin(a) * 9;
                    c.lineTo(x, y);
                }
                c.stroke();
            }
        }).draw(g);
    }

    /**
     * Grain over everything, from post() in pixels: specks of dust and dried paste that sit
     * on top of the paint, so white areas get dark flecks and the wall light ones. Cached.
     */
    const grainCache = new Map();
    function grain(ctx, env, o = {}) {
        const { amount = 0.6, key = 'grain' } = o;
        const [w, h] = env.px;
        const k = key + w + 'x' + h;
        if (!grainCache.has(k)) {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const g = c.getContext('2d');
            const r = Motion.rng(key);
            const n = Math.round((w * h) / 260);
            for (let i = 0; i < n; i++) {
                const light = r() < 0.4;
                g.fillStyle = light ? 'rgba(255,235,210,0.18)' : 'rgba(40,12,4,0.22)';
                const s = (0.6 + r() * 1.4) * Math.max(1, w / 1600);
                g.fillRect(r() * w, r() * h, s, s);
            }
            grainCache.set(k, c);
        }
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = amount;
        ctx.drawImage(grainCache.get(k), 0, 0);
        ctx.restore();
    }

    return {
        WALL, WALL_DARK, WALL_LIGHT, PASTE, TAU,
        drawing, twos, rot, polar, circle, resample, wobble,
        stroke, fill, dot, ring,
        pose, human, tarpaPlayer, tarpaRing,
        sun, moon, tree, hut, bird, deer, ground, border,
        wall, grain,
    };
})();
