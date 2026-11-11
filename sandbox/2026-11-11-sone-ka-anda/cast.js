// sone-ka-anda cast, in the Warli grammar: the hen and the rooster, the golden egg (gold is
// the film's only colour besides paste: it is what the story is about), the basket, the
// nest, the cow, the market stall, the sickle, the thought bubble and the rich house.
// Global: Cast. Depends on styles/warli/warli.js.
const Cast = (() => {
    const W = Warli;
    const GOLD = '#f2b632', GOLD_DEEP = '#d48a1c';

    /**
     * A hen standing on (x, y), s tall. state: 'stand' | 'sit' (laying, legs hidden, eyes
     * closed when asleep) | 'lie' (on her side, still, eyes shut). peck 0..1 dips the head.
     */
    function hen(g, x, y, s, o = {}) {
        const { state = 'stand', facing = 1, peck = 0, asleep = false, seed = 'hen', rooster = false, crow = 0 } = o;
        const lw = Math.max(1.5, s * 0.035);
        g.save();
        g.translate(x, y);
        if (state === 'lie') {
            // tipped over onto her back and side, feet out: rotate about the body's centre,
            // set that centre one body-radius above the ground, and clip what sinks below it
            g.beginPath();
            g.rect(-s * 2, -s * 2, s * 4, s * 2 + 2);
            g.clip();
            g.translate(0, -s * 0.24);
            g.rotate(-facing * 1.3);
            g.translate(0, s * 0.5 - s * 0.2);
        }
        if (facing < 0) g.scale(-1, 1);
        const lift = state === 'sit' ? s * 0.2 : 0;
        g.translate(0, lift);
        // legs with three toes
        if (state !== 'sit') {
            for (const lx of [-0.04, 0.1]) {
                const top = [lx * s, -0.32 * s], foot = [lx * s - 0.02 * s, 0];
                W.stroke(g, [top, foot], { w: lw, seed: seed + 'leg' + lx, dry: 0 });
                for (const a of [-0.5, 0, 0.5]) W.stroke(g, [foot, W.polar(foot, a, 0.08 * s)], { w: lw * 0.7, seed: seed + 'toe' + lx + a, dry: 0 });
            }
        }
        // tail: a fan of feathers up and back (tall arcs on the rooster)
        const tailN = rooster ? 4 : 3;
        for (let i = 0; i < tailN; i++) {
            const a = -2.2 - i * 0.25, L = (rooster ? 0.62 : 0.4) * s * (1 - i * 0.08);
            const r0 = [-0.3 * s, -0.5 * s], tip = W.polar(r0, a, L), mid = W.polar(r0, a + (rooster ? 0.5 : 0.3), L * 0.6);
            if (rooster) W.stroke(g, [r0, mid, tip], { w: lw * 1.5, seed: seed + 'tl' + i, dry: 0.3 });
            else W.fill(g, [r0, W.polar(r0, a - 0.18, L * 0.7), tip, W.polar(r0, a + 0.22, L * 0.6)], { seed: seed + 'tl' + i, wob: 0.4, holes: 0 });
        }
        // body: a round chest running back into the tail
        const body = W.circle(0, -0.5 * s, 0.34 * s, 30).map(([bx, by]) => [bx, -0.5 * s + (by + 0.5 * s) * 0.78]);
        W.fill(g, body, { seed: seed + 'body', wob: 0.6 });
        // wing: an arc and three feather lines in wall colour
        W.stroke(g, W.circle(-0.04 * s, -0.5 * s, 0.17 * s, 12, 0.2, Math.PI - 0.2), { w: lw * 0.8, color: W.WALL, seed: seed + 'wing', dry: 0 });
        for (let i = 0; i < 3; i++) W.stroke(g, [[(-0.16 + i * 0.07) * s, -0.4 * s], [(-0.12 + i * 0.07) * s, -0.47 * s]], { w: lw * 0.6, color: W.WALL, seed: seed + 'f' + i, dry: 0 });
        // neck and head (the head dips when pecking, lifts when crowing)
        const dip = peck * 0.35 * s, up = crow * 0.1 * s;
        const head = [0.33 * s + peck * 0.08 * s, -0.86 * s + dip - up];
        W.fill(g, [[0.12 * s, -0.66 * s], [0.3 * s, -0.62 * s], [head[0] + 0.06 * s, head[1] + 0.04 * s], [head[0] - 0.08 * s, head[1]]], { seed: seed + 'neck', wob: 0.4, holes: 0 });
        W.dot(g, head[0], head[1], 0.11 * s, { seed: seed + 'head', holes: 0 });
        // comb (bigger on the rooster), beak, wattle, eye
        const combN = rooster ? 4 : 3;
        for (let i = 0; i < combN; i++) W.dot(g, head[0] - 0.08 * s + i * 0.055 * s, head[1] - 0.12 * s - (i % 2) * 0.02 * s, (rooster ? 0.05 : 0.035) * s, { seed: seed + 'comb' + i, holes: 0 });
        const bx = head[0] + 0.1 * s, by = head[1];
        if (crow > 0.3) {
            W.stroke(g, [[bx, by - 0.01 * s], [bx + 0.12 * s, by - 0.06 * s]], { w: lw, seed: seed + 'bk1', dry: 0 });
            W.stroke(g, [[bx, by + 0.02 * s], [bx + 0.11 * s, by + 0.06 * s]], { w: lw, seed: seed + 'bk2', dry: 0 });
        } else W.fill(g, [[bx - 0.02 * s, by - 0.035 * s], [bx + 0.11 * s, by + 0.01 * s], [bx - 0.02 * s, by + 0.04 * s]], { seed: seed + 'beak', wob: 0.2, holes: 0 });
        W.dot(g, head[0] + 0.05 * s, head[1] + 0.12 * s, (rooster ? 0.045 : 0.03) * s, { seed: seed + 'wat', holes: 0 });
        if (asleep || state === 'lie') W.stroke(g, [[head[0] - 0.01 * s, head[1] - 0.01 * s], [head[0] + 0.06 * s, head[1] - 0.01 * s]], { w: lw * 0.6, color: W.WALL, seed: seed + 'eyeS', dry: 0 });
        else W.dot(g, head[0] + 0.03 * s, head[1] - 0.02 * s, 0.022 * s, { color: W.WALL, holes: 0, seed: seed + 'eye' });
        g.restore();
    }

    /** The golden egg standing on (x, y), r wide; glow 0..1 puts gold rays round it. */
    function egg(g, x, y, r, o = {}) {
        const { glow = 0, seed = 'egg', spin = 0 } = o;
        const pts = Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * W.TAU, top = Math.sin(a) < 0 ? 1.3 : 1.05;
            return [x + Math.cos(a) * r * (Math.sin(a) < 0 ? 0.88 : 1), y - r * 1.15 + Math.sin(a) * r * top];
        });
        if (glow > 0) {
            const c = [x, y - r * 1.1];
            for (let i = 0; i < 12; i++) {
                const a = spin + (i / 12) * W.TAU, R0 = r * 1.7, R1 = r * (1.7 + 1.3 * glow);
                W.fill(g, [W.polar(c, a - 0.09, R0), W.polar(c, a + 0.09, R0), W.polar(c, a, R1)], { color: GOLD, seed: seed + 'ray' + i, wob: 0.3, holes: 0 });
            }
        }
        W.fill(g, pts, { color: GOLD, seed: seed + 'shell', wob: 0.4, holes: 0.25 });
        W.stroke(g, W.circle(x, y - r * 1.1, r * 0.75, 10, 3.6, 4.6), { w: Math.max(1.5, r * 0.18), color: '#fbe7a8', seed: seed + 'hi', dry: 0.3 });
    }

    /** A gold coin (a flat disc with a paste ring). */
    function coin(g, x, y, r, seed = 'coin') {
        W.dot(g, x, y, r, { color: GOLD, seed, holes: 0 });
        W.ring(g, x, y, r * 0.65, { w: Math.max(1, r * 0.18), color: GOLD_DEEP, seed: seed + 'r' });
    }

    /** A woven basket standing on (x, y), w wide, with n golden eggs heaped in it. */
    function basket(g, x, y, w, n = 0, o = {}) {
        const { seed = 'basket' } = o;
        const h = w * 0.55, lw = Math.max(2, w * 0.03);
        // eggs heaped above the rim, back row first
        const spots = [[0, 0], [-0.22, 0.02], [0.22, 0.02], [-0.11, -0.16], [0.11, -0.16], [0, -0.3], [-0.3, 0.04], [0.3, 0.04]];
        for (let i = Math.min(n, spots.length) - 1; i >= 0; i--) egg(g, x + spots[i][0] * w, y - h + 6 + spots[i][1] * w, w * 0.1, { seed: seed + 'e' + i });
        const body = [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.36, y], [x - w * 0.36, y]];
        W.fill(g, body, { seed: seed + 'b', wob: 0.6 });
        for (let i = 1; i < 6; i++) {
            const f = i / 6;
            W.stroke(g, [[x - w / 2 + w * f, y - h + 3], [x - w * 0.36 + w * 0.72 * f, y - 3]], { w: lw * 0.6, color: W.WALL, seed: seed + 'v' + i, dry: 0 });
        }
        for (let j = 1; j < 3; j++) {
            const f = j / 3, yy = y - h + h * f, half = w / 2 - (w / 2 - w * 0.36) * f;
            W.stroke(g, [[x - half + 3, yy], [x + half - 3, yy]], { w: lw * 0.6, color: W.WALL, seed: seed + 'hz' + j, dry: 0 });
        }
        W.stroke(g, [[x - w / 2 - 4, y - h], [x + w / 2 + 4, y - h]], { w: lw * 1.3, seed: seed + 'rim', dry: 0 });
    }

    /** A straw nest on the ground: a low paste bowl crossed with straw, stalks poking out. */
    function nest(g, x, y, w, seed = 'nest') {
        const r = Motion.rng(seed), h = w * 0.26;
        W.fill(g, [...W.circle(x, y - h, w * 0.5, 20, 0, Math.PI)], { seed: seed + 'bowl', wob: 0.8 });
        for (let i = 0; i < 9; i++) {
            const x0 = x - w * 0.42 + r() * w * 0.3, x1 = x0 + w * (0.35 + r() * 0.25);
            const yy = y - h + 4 + r() * h * 0.6;
            W.stroke(g, [[x0, yy + (r() - 0.5) * 6], [Math.min(x1, x + w * 0.42), yy + (r() - 0.5) * 6]], { w: 1.6, color: W.WALL, seed: seed + 'st' + i, dry: 0.3 });
        }
        for (let i = 0; i < 10; i++) {
            const bx = x - w * 0.48 + r() * w * 0.96, a = -Math.PI / 2 + (r() - 0.5) * 1.6;
            W.stroke(g, [[bx, y - h + 2], W.polar([bx, y - h + 2], a, 8 + r() * 10)], { w: 1.8, seed: seed + 'sk' + i, dry: 0.5 });
        }
    }

    /**
     * A cow walking: a long paste body with a hump over the shoulders, a head hanging forward
     * with curved horns, stick legs that step with ph, a tufted tail. prog paints it on.
     */
    function cow(g, x, y, s, o = {}) {
        const { ph = 0, facing = 1, seed = 'cow', prog = 1 } = o;
        if (prog <= 0) return;
        const lw = Math.max(1.6, s * 0.035);
        g.save();
        g.translate(x, y);
        if (facing < 0) g.scale(-1, 1);
        const P = (px, py) => [px * s, py * s];
        const k = Math.sin(ph * W.TAU) * 0.2;
        if (prog > 0.3)
            [[0.3, k], [0.2, -k], [-0.33, -k], [-0.23, k]].forEach(([fx, a], i) => {
                const top = P(fx, -0.4), knee = W.polar(top, Math.PI / 2 + a, 0.19 * s), hoof = W.polar(knee, Math.PI / 2, 0.2 * s);
                W.stroke(g, [top, knee, hoof], { w: lw * 1.2, seed: seed + 'lg' + i, dry: 0 });
            });
        W.fill(g, [P(-0.44, -0.68), P(0.14, -0.7), P(0.2, -0.8), P(0.34, -0.74), P(0.4, -0.58), P(0.38, -0.38), P(-0.4, -0.36), P(-0.48, -0.5)], { seed: seed + 'body', wob: 0.6 });
        if (prog > 0.6) {
            W.fill(g, [P(0.32, -0.72), P(0.5, -0.7), P(0.66, -0.46), P(0.6, -0.4), P(0.52, -0.42), P(0.38, -0.56)], { seed: seed + 'head', wob: 0.5, holes: 0 });
            W.stroke(g, [P(0.46, -0.7), P(0.4, -0.84), P(0.48, -0.92)], { w: lw * 1.1, seed: seed + 'hn1', dry: 0 });
            W.stroke(g, [P(0.52, -0.7), P(0.6, -0.83), P(0.7, -0.86)], { w: lw * 1.1, seed: seed + 'hn2', dry: 0 });
            W.fill(g, [P(0.38, -0.68), P(0.3, -0.66), P(0.36, -0.62)], { seed: seed + 'ear', wob: 0.2, holes: 0 });
            W.dot(g, ...P(0.53, -0.6), 0.02 * s, { color: W.WALL, holes: 0, seed: seed + 'eye' });
        }
        const t0 = P(-0.46, -0.64), t1 = [-0.56 * s, -0.36 * s + k * 0.05 * s];
        W.stroke(g, [t0, [-0.53 * s, -0.55 * s], t1], { w: lw * 0.8, seed: seed + 'tl' });
        W.dot(g, t1[0], t1[1] + 0.03 * s, 0.035 * s, { seed: seed + 'tuft', holes: 0 });
        g.restore();
    }

    /** A market stall: two poles, a hatched triangle awning, a table of pots. */
    function stall(g, x, y, w, seed = 'stall') {
        const h = w * 0.85, lw = Math.max(2, w * 0.02);
        W.stroke(g, [[x - w / 2, y], [x - w / 2, y - h]], { w: lw, seed: seed + 'p1' });
        W.stroke(g, [[x + w / 2, y], [x + w / 2, y - h]], { w: lw, seed: seed + 'p2' });
        const peak = [x, y - h - w * 0.35], eL = [x - w * 0.62, y - h + 6], eR = [x + w * 0.62, y - h + 6];
        W.stroke(g, [eL, peak, eR, eL], { w: lw, seed: seed + 'roof' });
        for (let i = 1; i < 6; i++) W.stroke(g, [Ease.lerpPt(eL, peak, i / 6), Ease.lerpPt(eR, peak, i / 6)], { w: lw * 0.7, seed: seed + 'th' + i, dry: 0.3 });
        for (let i = 0; i < 8; i++) {
            const tx = x - w * 0.62 + (i + 0.5) * (w * 1.24 / 8);
            W.fill(g, [[tx - 8, y - h + 6], [tx + 8, y - h + 6], [tx, y - h + 22]], { seed: seed + 'fl' + i, wob: 0.3, holes: 0 });
        }
        W.stroke(g, [[x - w * 0.42, y - h * 0.42], [x + w * 0.42, y - h * 0.42]], { w: lw * 1.3, seed: seed + 'tbl', dry: 0 });
        [[-0.3, 1], [-0.12, 0.8], [0.08, 1.1], [0.27, 0.9]].forEach(([px, sz], i) => {
            const cx = x + px * w, cy = y - h * 0.42;
            W.fill(g, [...W.circle(cx, cy - 16 * sz, 15 * sz, 16, 0, Math.PI), [cx - 7 * sz, cy - 30 * sz], [cx + 7 * sz, cy - 30 * sz]], { seed: seed + 'pot' + i, wob: 0.5 });
        });
    }

    /** A sickle held at (x, y) (the hand), blade pointing along angle a. */
    function sickle(g, x, y, a, s, seed = 'sickle') {
        const end = W.polar([x, y], a, s * 0.45);
        W.stroke(g, [[x, y], end], { w: Math.max(2, s * 0.05), seed: seed + 'h', dry: 0 });
        const pts = Array.from({ length: 12 }, (_, i) => {
            const u = i / 11, ang = a - 1.4 + u * 2.6;
            return W.polar([end[0] + Math.cos(a) * s * 0.25, end[1] + Math.sin(a) * s * 0.25], ang + Math.PI, s * 0.28 * (0.5 + 0.5 * Math.sin(u * Math.PI)));
        });
        W.stroke(g, pts, { w: Math.max(2, s * 0.06), seed: seed + 'b', dry: 0.2 });
    }

    /**
     * A thought bubble from a head at (hx, hy) to a cloud of paste dots centred on (cx, cy),
     * radius R; prog 0..1 blows it up. fill(g) paints what is thought, inside.
     */
    function bubble(g, hx, hy, cx, cy, R, prog, fill, seed = 'bubble') {
        if (prog <= 0) return;
        for (let i = 0; i < 3; i++) {
            const u = (i + 1) / 4;
            if (prog < u * 0.5) break;
            W.dot(g, Ease.lerp(hx, cx, u * 0.8), Ease.lerp(hy, cy + R * 0.7, u * 0.8), 4 + i * 2.5, { seed: seed + 'c' + i, holes: 0 });
        }
        const k = Ease.out(Ease.seg(prog, 0.4, 1));
        if (k <= 0) return;
        const n = 26;
        for (let i = 0; i < n; i++) {
            if (i / n > k) break;
            const a = -Math.PI / 2 + (i / n) * W.TAU;
            W.dot(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.78, 5.5, { seed: seed + 'd' + i, holes: 0 });
        }
        if (k >= 1 && fill) fill(g);
    }

    /**
     * The rich house: the hut grown wide with a second roof, a toran of triangles over the
     * door and a flag on the peak. prog 0..1 paints it on.
     */
    function house(g, x, y, W0, prog = 1, seed = 'house') {
        if (prog <= 0) return;
        W.hut(g, x, y, W0, { seed: seed + 'main', prog: Ease.seg(prog, 0, 0.7) });
        W.hut(g, x - W0 * 0.74, y, W0 * 0.55, { seed: seed + 'side', prog: Ease.seg(prog, 0.3, 0.9) });
        const k = Ease.seg(prog, 0.7, 1);
        if (k <= 0) return;
        const top = y - W0 * 0.5 + 8, n = 7;
        for (let i = 0; i < n; i++) {
            if ((i + 1) / n > k) break;
            const tx = x - W0 * 0.3 + (i * W0 * 0.6) / (n - 1);
            W.fill(g, [[tx - 9, top + 22], [tx + 9, top + 22], [tx, top + 40]], { seed: seed + 'tor' + i, wob: 0.3, holes: 0 });
        }
        const peak = [x, y - W0 * 0.5 - W0 * 0.48];
        W.stroke(g, [peak, [peak[0], peak[1] - 50]], { w: 3, seed: seed + 'pole' });
        W.fill(g, [[peak[0], peak[1] - 50], [peak[0] + 34, peak[1] - 42], [peak[0], peak[1] - 33]], { seed: seed + 'flag', wob: 0.3, holes: 0 });
    }

    return { GOLD, hen, egg, coin, basket, nest, cow, stall, sickle, bubble, house };
})();
