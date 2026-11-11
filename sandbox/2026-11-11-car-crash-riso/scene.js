// car-crash-riso: meri-video's story (a car speeds down the village road and hits the big
// tree) printed as a risograph: four inks (yellow, pink, blue, navy), flat and halftone
// plates, overprints for every other colour, whites as knockouts, the press slightly out of
// register. Same beats as sandbox/2026-11-11-meri-video. Drawings change on twos.
const DIR = 'sandbox/2026-11-11-car-crash-riso/';

Motion.scene({
    fps: 24,
    duration: 10,
    logical: [1600, 900],
    uses: ['styles/risograph/riso.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    shots: [[0, 1.4, 'Village'], [1.4, 5.0, 'The car'], [5.0, 6.0, 'Crash'], [6.0, 8.5, 'After'], [8.5, 10, 'Lesson']],
    setup(env) {
        return { press: Riso.press(env) };
    },

    draw(g, t, env) {
        const { press } = env.state, R = Riso, T = R.tone, E = Ease;
        const d = Math.floor(t * 12 + 1e-6), tt = d / 12;
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp;
        const GY = 760, TREE = 1250, S = 380, HIT = 5.0;
        press.begin(d);
        const Y = press.plate('yellow'), Ys = press.plate('yellow', 'screen');
        const P = press.plate('pink'), Ps = press.plate('pink', 'screen');
        const B = press.plate('blue'), Bs = press.plate('blue', 'screen');
        const N = press.plate('navy'), Ns = press.plate('navy', 'screen');

        // --- path helpers (one Path2D, filled on as many plates as the colour needs) --------
        const poly = (pts) => {
            const p = new Path2D();
            pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
            p.closePath();
            return p;
        };
        const circ = (x, y, r, ry = r, rot = 0) => {
            const p = new Path2D();
            p.ellipse(x, y, r, ry, rot, 0, Math.PI * 2);
            return p;
        };
        const ink = (path, ...pl) => {
            for (const [g2, v] of pl) {
                g2.fillStyle = T(v);
                g2.fill(path);
            }
        };
        const paper = (path) => press.knockout((g2) => g2.fill(path));
        const stroke = (g2, pts, w, seed, v = 1) => R.line(g2, pts, w, seed, { color: T(v) });

        // --- sky, sun, ground ---------------------------------------------------------------
        Ps.fillStyle = R.ramp(Ps, 0, 0, 0, GY, 0.04, 0.42);
        Ps.fillRect(0, 0, 1600, GY);
        Ys.fillStyle = R.ramp(Ys, 0, 200, 0, GY, 0.0, 0.5);
        Ys.fillRect(0, 0, 1600, GY);
        const sunR = 80 * E.out(seg(0.1, 0.7));
        if (sunR > 1) {
            const sun = circ(820, 190, sunR);
            paper(sun);
            ink(sun, [Y, 1], [Ps, 0.3]);
        }
        // far hills (blue screen) and the field (green: yellow + blue), the road (paper + navy screen)
        const hills = poly([[0, GY], [0, 610], [220, 560], [430, 600], [640, 540], [900, 590], [1130, 545], [1380, 585], [1600, 550], [1600, GY]]);
        paper(hills);
        ink(hills, [Bs, 0.42], [Ys, 0.25]);
        const field = poly([[0, GY - 18], [1600, GY - 18], [1600, 900], [0, 900]]);
        paper(field);
        ink(field, [Y, 1], [Bs, 0.62]);
        const road = poly([[0, GY - 10], [1600, GY - 10], [1600, GY + 40], [0, GY + 40]]);
        paper(road);
        ink(road, [Ns, 0.22], [Ys, 0.15]);
        for (let x = 40; x < 1600; x += 120) ink(poly([[x, GY + 13], [x + 56, GY + 13], [x + 56, GY + 19], [x, GY + 19]]), [Y, 1]);

        // the crash shakes the whole print (every plate)
        const shake = tt >= HIT ? 12 * Math.exp(-(tt - HIT) * 5) : 0;
        press.save();
        if (shake) press.each((g2) => g2.translate(Math.sin(tt * 97) * shake, Math.cos(tt * 83) * shake));

        // --- the hut ----------------------------------------------------------------------------
        if (tt > 0.4) {
            const u = E.out(seg(0.4, 1.0)), hx = 230, hw = 200, top = GY - 130 * u;
            const walls = poly([[hx - hw / 2, GY - 10], [hx - hw / 2, top], [hx + hw / 2, top], [hx + hw / 2, GY - 10]]);
            paper(walls);
            ink(walls, [Ys, 0.4], [Ps, 0.12]);
            const roof = poly([[hx - hw / 2 - 30, top + 6], [hx, top - 100 * u], [hx + hw / 2 + 30, top + 6]]);
            paper(roof);
            ink(roof, [P, 1], [Y, 1]);
            for (let i = 1; i < 6; i++) stroke(N, [[hx - hw / 2 - 30 + i * 22, top + 4], [hx - 6 + i * 4, top - 92 * u + i * 12]], 3, 'th' + i, 0.6);
            if (u > 0.8) ink(poly([[hx - 26, GY - 10], [hx - 26, GY - 80], [hx + 26, GY - 80], [hx + 26, GY - 10]]), [N, 1]);
            ink(poly([[hx + 50, top + 26], [hx + 86, top + 26], [hx + 86, top + 58], [hx + 50, top + 58]]), [Bs, 0.5]);
        }

        // --- the tree, swaying after the hit -------------------------------------------------------
        const sway = tt < HIT ? 0 : 0.08 * Math.exp(-(tt - HIT) * 2.2) * Math.sin((tt - HIT) * 11);
        const grow = E.out(seg(0.3, 1.3));
        if (grow > 0) {
            press.save();
            press.each((g2) => { g2.translate(TREE, GY); g2.rotate(sway); g2.translate(-TREE, -GY); });
            const trunk = poly([[TREE - 20, GY], [TREE - 12, GY - 250 * grow], [TREE - 60, GY - 330 * grow], [TREE - 44, GY - 338 * grow], [TREE, GY - 270 * grow], [TREE + 44, GY - 345 * grow], [TREE + 60, GY - 336 * grow], [TREE + 12, GY - 250 * grow], [TREE + 20, GY]]);
            paper(trunk);
            ink(trunk, [Ns, 0.55], [P, 0.75], [Y, 1]);
            const blobs = [[0, -420, 105], [-110, -370, 80], [110, -372, 84], [-60, -470, 70], [70, -478, 74], [0, -330, 70]];
            for (const [bx, by, br] of blobs) {
                const c = circ(TREE + bx, GY + by * grow, br * grow);
                paper(c);
            }
            for (const [bx, by, br] of blobs) ink(circ(TREE + bx, GY + by * grow, br * grow), [Y, 1], [B, 0.85]);
            for (const [bx, by, br] of blobs) ink(circ(TREE + bx + br * 0.25, GY + by * grow + br * 0.3, br * 0.7 * grow), [Ns, 0.35]);
            // fruit: pink dots
            const fr = Motion.rng('fruit');
            if (grow > 0.9) for (let i = 0; i < 9; i++) {
                const f = circ(TREE + (fr() - 0.5) * 260, GY - 330 - fr() * 180, 9);
                paper(f); // light on dark: clear the green first, or pink prints brown
                ink(f, [P, 1], [Ys, 0.25]);
            }
            press.restore();
        }

        // birds: perched on the crown, off to the upper left at the hit
        [[1180, 300], [1290, 270], [1350, 330]].forEach(([bx, by], i) => {
            if (tt < 1.2) return;
            const dd = tt - (HIT + 0.05 + i * 0.08);
            const x = dd > 0 ? bx - 330 * dd : bx, y = dd > 0 ? by - 230 * dd + Math.sin(dd * 5 + i) * 12 : by;
            const up = dd > 0 ? (Math.floor(tt * 12 + i) % 2 ? 1 : 0.3) : 0.2;
            const body = poly([[x + 18, y - 3], [x - 14, y - 4], [x - 24, y - 12], [x - 20, y + 2], [x - 12, y + 5]]);
            paper(body);
            ink(body, [N, 1]);
            ink(poly([[x + 4, y - 3], [x - 4, y - 3 - 26 * up], [x - 16, y - 34 * up], [x - 8, y - 3]]), [N, 1]);
            ink(circ(x + 18, y - 5, 5), [N, 1]);
            ink(poly([[x + 22, y - 6], [x + 32, y - 4], [x + 22, y - 2]]), [Y, 1], [P, 0.6]);
        });

        // falling leaves (closed form each), resting on the field once they land
        const lr = Motion.rng('leaves');
        for (let i = 0; i < 16; i++) {
            const x0 = TREE + (lr() - 0.5) * 300, y0 = GY - 300 - lr() * 150, t0 = HIT + lr() * 1.4, ph = lr() * 6;
            const dd = tt - t0;
            if (dd <= 0) continue;
            let y = y0 + 60 * dd + 18 * dd * dd, x = x0 + 22 * Math.sin(dd * 3 + ph) + 14 * dd, a = ph + dd * 2.5;
            if (y >= GY + 30) (y = GY + 30), (a = 0.15 * (i % 2 ? 1 : -1));
            const leaf = poly([[0, 0], [8, -5], [18, 0], [8, 5]].map(([lx, ly]) => [x + lx * Math.cos(a) - ly * Math.sin(a), y + lx * Math.sin(a) + ly * Math.cos(a)]));
            paper(leaf);
            ink(leaf, [Y, 1], [B, 0.9]);
        }

        // --- people ---------------------------------------------------------------------------------
        // a riso figure: a navy head and limbs, a shirt printed in one or two inks
        const person = (x, H, arms, legs, facing, shirt, seed, extra = {}) => {
            const f = facing, hip = [x, GY - H * 0.42], sh = [x + f * (extra.lean ?? 0) * H, GY - H * 0.78];
            const legLen = H * 0.21;
            legs.forEach(([a, b], i) => {
                const k = [hip[0] + Math.cos(a) * legLen * f, hip[1] + Math.sin(a) * legLen], ft = [k[0] + Math.cos(b) * legLen * f, k[1] + Math.sin(b) * legLen];
                stroke(N, [hip, k, ft], H * 0.06, seed + 'l' + i);
            });
            const torso = poly([[sh[0] - H * 0.13, sh[1]], [sh[0] + H * 0.13, sh[1]], [hip[0] + H * 0.11, hip[1]], [hip[0] - H * 0.11, hip[1]]]);
            paper(torso);
            ink(torso, ...shirt);
            const hands = [];
            arms.forEach(([a, b], i) => {
                const s0 = [sh[0] + (i ? 1 : -1) * H * 0.12, sh[1] + H * 0.03];
                const el = [s0[0] + Math.cos(a) * H * 0.16 * f, s0[1] + Math.sin(a) * H * 0.16], hd = [el[0] + Math.cos(b) * H * 0.15 * f, el[1] + Math.sin(b) * H * 0.15];
                stroke(N, [s0, el, hd], H * 0.055, seed + 'a' + i);
                hands.push(hd);
            });
            const head = [sh[0] + f * (extra.lean ?? 0) * H * 0.4, sh[1] - H * 0.13];
            const hc = circ(head[0], head[1], H * 0.1);
            paper(hc);
            ink(hc, [Ys, 0.45], [Ps, 0.35]);
            ink(circ(head[0] - f * H * 0.02, head[1] - H * 0.06, H * 0.09, H * 0.05), [N, 1]);
            ink(circ(head[0] + f * H * 0.04, head[1] - H * 0.005, H * 0.012), [N, 1]);
            if (extra.pot) ink(circ(head[0], head[1] - H * 0.16, H * 0.07, H * 0.06), [P, 1], [Y, 1]);
            return { head, hands };
        };
        const walk = (ph) => {
            const s = Math.sin(ph * Math.PI * 2) * 0.45;
            return { legs: [[1.57 - s, 1.57 - s * 0.6], [1.57 + s, 1.57 + s * 0.6]], arms: [[1.57 + s, 1.3 + s], [1.57 - s, 1.3 - s]] };
        };

        // the car's path: in from the left, faster and faster, the hit, the bounce
        const xHit = TREE - 26 - S * 0.5;
        const carX = tt < HIT ? lerp(-130, xHit, Math.pow(seg(1.4, HIT), 1.3)) : xHit - 42 * E.out(seg(HIT, HIT + 0.35));
        const crush = E.out(seg(HIT, HIT + 0.17));
        const driverOut = tt >= 6.1;

        // the driver staggers out from behind the car, stars round his head
        if (driverOut) {
            const u = seg(6.1, 7.6), w = walk(tt * 2.2);
            const st = u < 1 ? w : { legs: [[1.5, 1.6], [1.65, 1.55]], arms: [[1.8, 1.6], [1.3, 1.5]] };
            const p = person(carX - 40 - 240 * E.out(u), 175, st.arms, st.legs, u < 1 ? -1 : 1, [[B, 1]], 'driver', { lean: 0.08 * Math.sin(tt * 4.2) });
            for (let k = 0; k < 3; k++) {
                const a = tt * 4 + (k / 3) * Math.PI * 2, cx = p.head[0] + Math.cos(a) * 32, cy = p.head[1] - 34 + Math.sin(a) * 9;
                const star = poly(Array.from({ length: 8 }, (_, i) => { const r = i % 2 ? 3 : 9, b = (i / 8) * Math.PI * 2 - Math.PI / 2; return [cx + Math.cos(b) * r, cy + Math.sin(b) * r]; }));
                paper(star);
                ink(star, [Y, 1]);
            }
        }

        // --- the car: fluorescent pink, paper windows, navy wheels ----------------------------------
        if (tt > 1.4) {
            const cx = carX, s = S;
            const fold = (px, py) => (px > 0.2 ? [px - crush * 0.09 * (px - 0.2) / 0.3, py - crush * 0.07 * (px - 0.2) / 0.3] : [px, py]);
            const Q = (px, py) => { const [a, b] = fold(px, py); return [cx + a * s, GY + 8 + b * s]; };
            const body = poly([Q(-0.5, -0.13), Q(0.5, -0.13), Q(0.5, -0.29), Q(0.22, -0.33), Q(0.12, -0.55), Q(-0.3, -0.55), Q(-0.42, -0.33), Q(-0.5, -0.31)]);
            paper(body);
            ink(body, [P, 1], [Ns, 0.12]);
            // shadow under the body: a navy screen
            ink(poly([Q(-0.5, -0.13), Q(0.5, -0.13), Q(0.5, -0.19), Q(-0.5, -0.19)]), [Ns, 0.45]);
            const w1 = poly([Q(-0.27, -0.36), Q(-0.09, -0.36), Q(-0.09, -0.51), Q(-0.25, -0.51)]);
            const w2 = poly([Q(-0.05, -0.36), Q(0.17, -0.36), Q(0.1, -0.51), Q(-0.05, -0.51)]);
            for (const w of [w1, w2]) { paper(w); ink(w, [Bs, 0.35]); }
            if (!driverOut) {
                const [hx, hy] = Q(0.04, -0.455);
                ink(circ(hx, hy, s * 0.032), [N, 1]);
                ink(poly([Q(-0.02, -0.4), Q(0.1, -0.4), Q(0.04, -0.36)]), [B, 1]);
            }
            stroke(N, [Q(-0.07, -0.16), Q(-0.07, -0.34)], 3, 'door', 0.8);
            const lamp = circ(...Q(0.46, -0.25), s * 0.024);
            paper(lamp);
            ink(lamp, [Y, 1]);
            if (crush > 0.05) stroke(N, [0, 1, 2, 3, 4].map((i) => Q(0.3 + (i % 2) * 0.05, -0.15 - i * 0.04)), 4, 'zig');
            for (const wx of [-0.3, 0.3]) {
                const c = Q(wx, -0.11), spin = carX / (s * 0.095);
                const tyre = circ(c[0], c[1], s * 0.1);
                paper(tyre);
                ink(tyre, [N, 1], [Y, 0.6]);
                const hub = circ(c[0], c[1], s * 0.05);
                paper(hub);
                ink(hub, [Ns, 0.3]);
                for (let k = 0; k < 4; k++) {
                    const a = spin + (k / 4) * Math.PI * 2;
                    stroke(N, [c, [c[0] + Math.cos(a) * s * 0.05, c[1] + Math.sin(a) * s * 0.05]], 3, 'sp' + wx + k);
                }
            }
            // exhaust puffs while driving, steam from the bonnet after
            if (tt < HIT)
                for (let k = 0; k < 3; k++) {
                    const age = (tt * 2.5 + k / 3) % 1, [ex, ey] = Q(-0.52, -0.17);
                    const puff = circ(ex - age * 70, ey - age * 26, 6 + age * 12);
                    paper(puff);
                    ink(puff, [Ns, 0.25]);
                }
            if (tt > HIT + 0.3)
                for (let k = 0; k < 4; k++) {
                    if (tt < HIT + 0.3 + k * 0.25) continue;
                    const age = (tt * 0.7 + k / 4) % 1, [bx, by] = Q(0.32, -0.33);
                    const puff = circ(bx + Math.sin(age * 7 + k) * 10, by - 14 - age * 160, 10 + age * 18);
                    paper(puff);
                    ink(puff, [Bs, 0.18]);
                }
            // the crash burst: yellow rays knocked out of everything, a pink core
            const bu = seg(HIT, HIT + 0.7);
            if (bu > 0 && bu < 1) {
                const [nx, ny] = Q(0.5, -0.22), grow2 = E.out(E.seg(bu, 0, 0.35)), fade = 1 - E.in(E.seg(bu, 0.55, 1));
                const r = Motion.rng('burst'), pts = [];
                for (let i = 0; i < 22; i++) {
                    const a = (i / 22) * Math.PI * 2, rad = (i % 2 ? 0.45 : 0.9 + r() * 0.4) * 150 * grow2 * fade;
                    pts.push([nx + 10 + Math.cos(a) * rad, ny + Math.sin(a) * rad]);
                }
                const star = poly(pts);
                paper(star);
                ink(star, [Y, 1]);
                ink(circ(nx + 10, ny, 40 * grow2 * fade), [P, 1]);
            }
        }

        // the villagers run in from the hut, stop, and raise their arms
        [[380, 590, 0, [[P, 1], [Y, 1]], false], [350, 480, 0.25, [[P, 1], [B, 0.5]], true]].forEach(([x0, x1, delay, shirt, pot], i) => {
            const t0 = 6.4 + delay, t1 = 8.4;
            if (tt < t0) return;
            const u = seg(t0, t1), x = lerp(x0, x1, u);
            const hop = u >= 1 ? Math.abs(Math.sin((tt - t1) * 7)) * 10 : 0;
            const pose = u < 1 ? walk(tt * 2.6 + i * 0.5) : { legs: [[1.4, 1.6], [1.75, 1.55]], arms: [[-0.9, -1.4], [-2.2, -1.7]] };
            press.save();
            press.each((g2) => g2.translate(0, -hop));
            person(x, 170, pose.arms, pose.legs, 1, shirt, 'vil' + i, { pot });
            press.restore();
        });

        press.restore();

        // the lesson, printed in navy
        if (tt >= 8.6) {
            const a = seg(8.6, 9.2);
            N.save();
            N.beginPath();
            N.rect(100, 60, 900 * a, 160);
            N.clip();
            N.fillStyle = T(1);
            N.font = '84px Kalam';
            N.fillText('ध्यान से चलाओ!', 120, 170);
            N.restore();
        }

        press.print(g, { key: d });
    },
});
