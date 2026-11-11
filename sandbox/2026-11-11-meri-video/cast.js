// meri-video cast: the car, the crash burst, falling leaves and a dizzy star, drawn in the
// Warli grammar (paste fills and twig lines on the mud wall). Global: Cast.
// Depends on styles/warli/warli.js.
const Cast = (() => {
    const W = Warli;

    /**
     * A car standing on (x, y), s long, facing right. A paste body with wall-coloured
     * windows (the driver's head and shoulders in the front one), wheels as rings with
     * spokes. spin: wheel angle; crush 0..1 folds the bonnet back and up; driver: show him.
     */
    function car(g, x, y, s, o = {}) {
        const { spin = 0, crush = 0, driver = true, seed = 'car' } = o;
        const lw = Math.max(2, s * 0.012);
        const P = (px, py) => [x + px * s, y + py * s];
        const fold = (px, py) => (px > 0.2 ? [px - crush * 0.09 * (px - 0.2) / 0.3, py - crush * 0.07 * (px - 0.2) / 0.3] : [px, py]);
        const Q = (px, py) => P(...fold(px, py));
        const r = 0.11;

        // a rim of wall round the whole car, so it reads in front of a hut or a tree
        // (paste on paste merges into one shape)
        const body = [Q(-0.5, -0.13), Q(0.5, -0.13), Q(0.5, -0.29), Q(0.22, -0.33), Q(0.12, -0.55), Q(-0.3, -0.55), Q(-0.42, -0.33), Q(-0.5, -0.31)];
        g.save();
        g.strokeStyle = W.WALL;
        g.fillStyle = W.WALL;
        g.lineWidth = lw * 5;
        g.lineJoin = 'round';
        g.beginPath();
        body.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
        g.closePath();
        g.stroke();
        g.fill();
        for (const wx of [-0.3, 0.3]) {
            g.beginPath();
            g.arc(...P(wx, -r), r * s * 0.86 + lw * 3, 0, W.TAU);
            g.fill();
        }
        g.restore();
        // the wall shows through the wheel arches
        for (const wx of [-0.3, 0.3]) W.fill(g, W.circle(...P(wx, -r), r * s * 1.22, 24), { color: W.WALL, holes: 0, wob: 0.6, seed: seed + 'arch' + wx });
        // body
        W.fill(g, body, { seed: seed + 'body', wob: lw * 0.4 });
        for (const wx of [-0.3, 0.3]) W.fill(g, W.circle(...P(wx, -r), r * s * 1.14, 24), { color: W.WALL, holes: 0, wob: 0.5, seed: seed + 'well' + wx });
        // windows, pillar between them
        W.fill(g, [P(-0.27, -0.36), P(-0.09, -0.36), P(-0.09, -0.51), P(-0.25, -0.51)], { color: W.WALL, holes: 0, wob: 0.5, seed: seed + 'w1' });
        W.fill(g, [P(-0.05, -0.36), Q(0.17, -0.36), Q(0.1, -0.51), P(-0.05, -0.51)], { color: W.WALL, holes: 0, wob: 0.5, seed: seed + 'w2' });
        if (driver) {
            const [hx, hy] = P(0.04, -0.455);
            W.dot(g, hx, hy, s * 0.032, { seed: seed + 'drvh', holes: 0 });
            W.fill(g, [P(-0.02, -0.4), P(0.1, -0.4), P(0.04, -0.36)], { seed: seed + 'drvb', holes: 0, wob: 0.4 });
            W.stroke(g, [P(0.08, -0.395), P(0.135, -0.38)], { w: lw * 0.8, seed: seed + 'drva' });
        }
        // door, handle, bumper, headlight, tail light
        W.stroke(g, [P(-0.07, -0.16), P(-0.07, -0.34)], { w: lw * 0.7, color: W.WALL, seed: seed + 'door', dry: 0 });
        W.stroke(g, [P(-0.03, -0.27), P(0.03, -0.27)], { w: lw * 0.7, color: W.WALL, seed: seed + 'hdl', dry: 0 });
        W.dot(g, ...Q(0.46, -0.25), s * 0.022, { color: W.WALL, holes: 0, seed: seed + 'lamp' });
        W.dot(g, ...P(-0.47, -0.25), s * 0.016, { color: W.WALL, holes: 0, seed: seed + 'tail' });
        // the crumple: a zigzag of wall across the folded bonnet
        if (crush > 0.05) {
            const zig = [0, 1, 2, 3, 4].map((i) => Q(0.3 + (i % 2) * 0.05, -0.15 - i * 0.04));
            W.stroke(g, zig, { w: lw * 0.8, color: W.WALL, seed: seed + 'zig', dry: 0 });
        }
        // wheels
        for (const wx of [-0.3, 0.3]) {
            const c = P(wx, -r);
            W.ring(g, c[0], c[1], r * s * 0.86, { w: lw * 1.3, seed: seed + 'tyre' + wx });
            for (let k = 0; k < 6; k++) {
                const a = spin + (k / 6) * W.TAU;
                W.stroke(g, [c, W.polar(c, a, r * s * 0.8)], { w: lw * 0.8, seed: seed + 'sp' + k, dry: 0 });
            }
            W.dot(g, c[0], c[1], r * s * 0.2, { seed: seed + 'hub' + wx, holes: 0 });
        }
        return { nose: Q(0.5, -0.22), bonnet: Q(0.32, -0.33), exhaust: P(-0.5, -0.17) };
    }

    /** The crash: paste rays bursting from (x, y); u 0..1 grows then shrinks them. */
    function burst(g, x, y, R, u, seed = 'burst') {
        if (u <= 0 || u >= 1) return;
        const grow = Ease.out(Ease.seg(u, 0, 0.35)), fade = 1 - Ease.in(Ease.seg(u, 0.55, 1));
        const n = 11, r = Motion.rng(seed);
        for (let i = 0; i < n; i++) {
            const a = (i / n) * W.TAU + r() * 0.3, L = R * (0.6 + r() * 0.6) * grow * fade, w = 0.16;
            if (L < 2) continue;
            const r0 = R * 0.18 * grow;
            W.fill(g, [W.polar([x, y], a - w, r0), W.polar([x, y], a + w, r0), W.polar([x, y], a, r0 + L)], { seed: seed + i, wob: 0.5, holes: 0 });
        }
    }

    /** A leaf: a paste teardrop of length L at (x, y), pointing at angle a. */
    function leaf(g, x, y, L, a, seed) {
        const tip = W.polar([x, y], a, L), mid = W.polar([x, y], a, L * 0.5);
        const nx = -Math.sin(a) * L * 0.3, ny = Math.cos(a) * L * 0.3;
        W.fill(g, [[x, y], [mid[0] + nx, mid[1] + ny], tip, [mid[0] - nx, mid[1] - ny]], { seed, wob: 0.3, holes: 0 });
    }

    /** A small four-pointed star (the daze round the driver's head). */
    function star(g, x, y, r, seed) {
        const pts = [];
        for (let i = 0; i < 8; i++) pts.push(W.polar([x, y], (i / 8) * W.TAU - Math.PI / 2, i % 2 ? r * 0.35 : r));
        W.fill(g, pts, { seed, wob: 0.2, holes: 0 });
    }

    return { car, burst, leaf, star };
})();
