// octopus · the cast for the octopus facts Short, painted in code: the octopus (skin with
// living chromatophores, eight tapering arms with suckers, bulging eyes with slit pupils) and
// its insides seen as an x-ray (three hearts, blue vessels with blood flowing, the brain ring,
// a nerve cord down every arm with its ganglia, the beak); the reef around it (fish schools,
// kelp, sea grass, rocks, shells, coral); and a hemocyanin copper site in ball-and-stick.
// Global: Octo. Glows are pre-made sprites.
const Octo = (() => {
    const TAU = Math.PI * 2;
    const glowSprite = (env, rgb) =>
        Motion.sprite('octo:glow:' + rgb, { x: -50, y: -50, w: 100, h: 100 }, env.k, (c) => {
            const gr = c.createRadialGradient(0, 0, 0, 0, 0, 48);
            gr.addColorStop(0, `rgba(${rgb},1)`);
            gr.addColorStop(0.35, `rgba(${rgb},0.4)`);
            gr.addColorStop(1, `rgba(${rgb},0)`);
            c.fillStyle = gr;
            c.fillRect(-50, -50, 100, 100);
        });
    const glow = (g, env, rgb, x, y, r, a = 1) => {
        const s = glowSprite(env, rgb);
        g.save();
        g.globalAlpha *= a;
        g.globalCompositeOperation = 'lighter';
        g.drawImage(s.canvas, x - r, y - r, 2 * r, 2 * r);
        g.restore();
    };

    // the centreline of arm i (0..7) in body units (head at the origin, s = 1)
    function armLine(i, t, o = {}) {
        const { spread = 1, curl = 1, reach = 1, swim = 0, cut = 1 } = o;
        const side = i < 4 ? -1 : 1, k = i < 4 ? i : 7 - i; // 0 = outermost … 3 = middle
        const base = [side * (0.08 + k * 0.05), 0.32];
        let a = Math.PI / 2 + side * (1.25 - k * 0.32) * spread - swim * side * 0.5;
        const pts = [base];
        let [x, y] = base;
        const n = 22, len = (1.45 - k * 0.08) * reach;
        for (let j = 1; j <= n; j++) {
            const v = j / n;
            if (v > cut) break;
            a += side * (0.035 + 0.08 * v) * curl + Math.sin(t * 1.7 + i * 0.9 - v * 4) * 0.07 * (0.3 + v);
            x += Math.cos(a) * (len / n);
            y += Math.sin(a) * (len / n);
            pts.push([x, y]);
        }
        return pts;
    }

    /**
     * The octopus at (x, y) = the middle of its head, `s` ≈ height of the head in units.
     * o: t, hue, pattern (0..1 chromatophore waves), camo (0..1 → rock colours), xray (0..1),
     * show { hearts, vessels, brain, nerves, beak }, spread, curl, reach, swim, cut (per arm
     * map {i: 0..1}), look [dx, dy], alpha, rot.
     */
    function draw(g, env, x, y, s, o = {}) {
        const { t = 0, hue = 14, pattern = 0.3, camo = 0, xray = 0, show = {}, look = [0, 0], alpha = 1, rot = 0, cut = {} } = o;
        const skin = (l, a = 1) => {
            const h = Ease.lerp(hue, 32, camo), sat = Ease.lerp(72, 18, camo);
            return `hsla(${h},${sat}%,${l}%,${a * (1 - xray * 0.75)})`;
        };
        g.save();
        g.globalAlpha = alpha;
        g.translate(x, y);
        g.rotate(rot);
        g.scale(s, s);
        const arms = Array.from({ length: 8 }, (_, i) => armLine(i, t, { ...o, cut: cut[i] ?? 1 }));
        // an arm as a tapering ribbon
        const ribbon = (pts, w0, w1) => {
            const L = [], R = [];
            pts.forEach((p, j) => {
                const a = pts[Math.max(0, j - 1)], b = pts[Math.min(pts.length - 1, j + 1)];
                const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
                const w = Ease.lerp(w0, w1, j / (pts.length - 1)) / 2;
                L.push([p[0] - (dy / l) * w, p[1] + (dx / l) * w]);
                R.push([p[0] + (dy / l) * w, p[1] - (dx / l) * w]);
            });
            const path = new Path2D();
            [...L, ...R.reverse()].forEach(([px, py], j) => (j ? path.lineTo(px, py) : path.moveTo(px, py)));
            path.closePath();
            return path;
        };
        // back arms (the inner four), darker
        const order = [3, 4, 2, 5, 1, 6, 0, 7];
        order.forEach((i, n) => {
            const path = ribbon(arms[i], 0.2, 0.025);
            g.fillStyle = skin(n < 2 ? 32 : 42);
            g.fill(path);
            g.strokeStyle = skin(22, 0.6);
            g.lineWidth = 0.008;
            g.stroke(path);
            // suckers along the underside of the outer arms
            if (n >= 2 && xray < 0.5) {
                g.fillStyle = skin(78, 0.9);
                for (let j = 2; j < arms[i].length - 2; j += 2) {
                    const p = arms[i][j], r = 0.028 * (1 - j / arms[i].length) + 0.008;
                    g.beginPath();
                    g.arc(p[0], p[1] + r * 0.6, r, 0, TAU);
                    g.fill();
                }
            }
        });
        // mantle (the sac above the head) and head
        const mantle = new Path2D();
        mantle.moveTo(-0.34, 0.05);
        mantle.bezierCurveTo(-0.5, -0.45, -0.38, -1.05, 0.02, -1.08);
        mantle.bezierCurveTo(0.42, -1.05, 0.52, -0.45, 0.34, 0.05);
        mantle.closePath();
        const head = new Path2D();
        head.ellipse(0, 0.08, 0.42, 0.3, 0, 0, TAU);
        for (const p of [mantle, head]) {
            const gr = g.createLinearGradient(-0.4, -1, 0.4, 0.4);
            gr.addColorStop(0, skin(58));
            gr.addColorStop(1, skin(36));
            g.fillStyle = gr;
            g.fill(p);
        }
        // chromatophores: spots that swell and fade in travelling waves
        if (xray < 0.5) {
            g.save();
            g.clip(mantle);
            const r = Motion.rng('chromato');
            for (let i = 0; i < 70; i++) {
                const px = (r() - 0.5) * 0.9, py = -1.05 + r() * 1.1;
                const wave = 0.5 + 0.5 * Math.sin(t * 6 - py * 9 + px * 3);
                const rad = (0.012 + r() * 0.02) * (0.5 + pattern * wave * 1.5);
                g.fillStyle = `hsla(${Ease.lerp(hue - 6, 28, camo)},${Ease.lerp(80, 20, camo)}%,${Ease.lerp(26, 30, camo)}%,${0.55 * (1 - xray)})`;
                g.beginPath();
                g.arc(px, py, rad, 0, TAU);
                g.fill();
            }
            g.restore();
        }
        // cute: big round eyes with two glints, pink cheeks, a little smile
        if (o.cute) {
            for (const sx of [-1, 1]) {
                const ex = sx * 0.2, ey = -0.04;
                g.fillStyle = '#ffffff';
                g.beginPath();
                g.ellipse(ex, ey, 0.13, 0.14, 0, 0, TAU);
                g.fill();
                g.fillStyle = '#1a1220';
                g.beginPath();
                g.ellipse(ex + look[0] * 0.035, ey + look[1] * 0.035, 0.085, 0.095, 0, 0, TAU);
                g.fill();
                g.fillStyle = '#ffffff';
                g.beginPath();
                g.arc(ex + look[0] * 0.035 - 0.03, ey + look[1] * 0.035 - 0.035, 0.03, 0, TAU);
                g.fill();
                g.beginPath();
                g.arc(ex + look[0] * 0.035 + 0.025, ey + look[1] * 0.035 + 0.03, 0.013, 0, TAU);
                g.fill();
                g.fillStyle = 'rgba(255,120,150,0.55)';
                g.beginPath();
                g.ellipse(sx * 0.3, 0.13, 0.065, 0.035, 0, 0, TAU);
                g.fill();
            }
            g.strokeStyle = '#5a1a1a';
            g.lineWidth = 0.022;
            g.lineCap = 'round';
            g.beginPath();
            g.arc(0, 0.12, 0.06, 0.15 * Math.PI, 0.85 * Math.PI);
            g.stroke();
        }
        // eyes: bulging, a slit pupil, a glint
        if (!o.cute)
        for (const sx of [-1, 1]) {
            const ex = sx * 0.24, ey = -0.02;
            g.fillStyle = skin(66);
            g.beginPath();
            g.ellipse(ex, ey, 0.12, 0.1, 0, 0, TAU);
            g.fill();
            g.fillStyle = `rgba(245,220,140,${1 - xray * 0.7})`;
            g.beginPath();
            g.ellipse(ex + look[0] * 0.02, ey + look[1] * 0.02, 0.085, 0.07, 0, 0, TAU);
            g.fill();
            g.fillStyle = `rgba(15,10,10,${1 - xray * 0.6})`;
            g.beginPath();
            g.ellipse(ex + look[0] * 0.03, ey + look[1] * 0.02, 0.06, 0.016, 0, 0, TAU);
            g.fill();
            g.fillStyle = 'rgba(255,255,255,0.8)';
            g.beginPath();
            g.arc(ex - 0.03, ey - 0.03, 0.012, 0, TAU);
            g.fill();
        }

        // --- the x-ray: organs, vessels, nerves -----------------------------------------------
        if (xray > 0) {
            g.save();
            g.globalAlpha = alpha * xray;
            g.globalCompositeOperation = 'lighter';
            const beat = 0.5 + 0.5 * Math.sin(t * 7);
            const hearts = [[0, -0.42, 0.075], [-0.2, -0.3, 0.05], [0.2, -0.3, 0.05]];
            if (show.vessels) {
                // vessels: from the hearts round the mantle and down every arm, blood flowing
                const vessel = (pts, w, seed) => {
                    // drawn opaque (not additive), or the blue adds up to white
                    g.save();
                    g.globalCompositeOperation = 'source-over';
                    g.strokeStyle = 'rgba(30,90,230,0.95)';
                    g.lineWidth = w;
                    g.lineCap = 'round';
                    g.beginPath();
                    pts.forEach(([px, py], j) => (j ? g.lineTo(px, py) : g.moveTo(px, py)));
                    g.stroke();
                    g.strokeStyle = 'rgba(110,170,255,0.8)';
                    g.lineWidth = w * 0.35;
                    g.stroke();
                    g.restore();
                    // flowing blood cells
                    const n = pts.length;
                    for (let k = 0; k < 4; k++) {
                        const u = ((t * 0.6 + k / 4 + seed * 0.13) % 1) * (n - 1), j = Math.floor(u), f = u - j;
                        if (j + 1 >= n) continue;
                        const px = Ease.lerp(pts[j][0], pts[j + 1][0], f), py = Ease.lerp(pts[j][1], pts[j + 1][1], f);
                        glow(g, env, '60,130,255', px, py, w * 2.4, 0.9);
                    }
                };
                arms.forEach((pts, i) => vessel([[0, -0.42], [pts[0][0] * 0.6, 0.15], ...pts.slice(0, -3)], 0.022, i));
                // the mantle network: branches off the hearts
                const r = Motion.rng('mantleVessels');
                for (let i = 0; i < 9; i++) {
                    const a = -Math.PI / 2 + (i / 8 - 0.5) * 2.4, l = 0.35 + r() * 0.3;
                    const p1 = [Math.cos(a) * l * 0.5, -0.42 + Math.sin(a) * l * 0.5], p2 = [Math.cos(a + 0.2) * l, -0.42 + Math.sin(a + 0.2) * l];
                    vessel([[0, -0.42], p1, p2], 0.012, 20 + i);
                    vessel([p1, [p1[0] + (r() - 0.5) * 0.2, p1[1] - 0.12]], 0.007, 40 + i);
                }
            }
            if (show.nerves) {
                // a nerve cord down every arm, its ganglia lighting one after another
                arms.forEach((pts, i) => {
                    g.strokeStyle = 'rgba(255,230,120,0.75)';
                    g.lineWidth = 0.014;
                    g.beginPath();
                    pts.forEach(([px, py], j) => (j ? g.lineTo(px + 0.012, py) : g.moveTo(0, 0.15)));
                    g.stroke();
                    for (let j = 2; j < pts.length; j += 2) {
                        const on = 0.5 + 0.5 * Math.sin(t * 5 - j * 0.6 + i);
                        glow(g, env, '255,220,110', pts[j][0] + 0.012, pts[j][1], 0.035 + on * 0.03, 0.5 + on * 0.5);
                        // side branches
                        g.strokeStyle = 'rgba(255,230,140,0.35)';
                        g.lineWidth = 0.005;
                        g.beginPath();
                        g.moveTo(pts[j][0], pts[j][1]);
                        g.lineTo(pts[j][0] + 0.06 * Math.sin(j + i), pts[j][1] + 0.05);
                        g.stroke();
                    }
                    // the ganglion at the arm's base: a mini-brain
                    glow(g, env, '255,200,90', pts[1][0], pts[1][1], 0.09, 0.9);
                });
            }
            if (show.brain) {
                // the brain: a ring round the gullet between the eyes
                g.strokeStyle = 'rgba(210,140,255,0.9)';
                g.lineWidth = 0.05;
                g.beginPath();
                g.ellipse(0, -0.05, 0.13, 0.08, 0, 0, TAU);
                g.stroke();
                glow(g, env, '200,120,255', 0, -0.05, 0.35, 0.7 + 0.3 * beat);
            }
            if (show.hearts)
                hearts.forEach(([hx, hy, r], i) => {
                    const b = 1 + 0.25 * Math.max(0, Math.sin(t * 7 + i * 0.5));
                    g.fillStyle = 'rgba(255,60,70,0.9)';
                    g.beginPath();
                    g.ellipse(hx, hy, r * b, r * 0.85 * b, 0, 0, TAU);
                    g.fill();
                    glow(g, env, '255,60,70', hx, hy, r * 4 * b, 0.9);
                });
            if (show.beak) {
                g.fillStyle = 'rgba(255,255,255,0.95)';
                g.beginPath();
                g.moveTo(-0.05, 0.28);
                g.quadraticCurveTo(0, 0.2, 0.05, 0.28);
                g.lineTo(0, 0.36);
                g.closePath();
                g.fill();
                glow(g, env, '255,255,255', 0, 0.29, 0.2, 0.9);
            }
            g.restore();
        }
        g.restore();
        return { arms: arms.map((pts) => pts.map(([px, py]) => [x + (px * Math.cos(rot) - py * Math.sin(rot)) * s, y + (px * Math.sin(rot) + py * Math.cos(rot)) * s])) };
    }

    // --- the reef ------------------------------------------------------------------------------
    /** A school of little fish swimming across: closed-form paths, tails flicking. */
    function school(g, t, o = {}) {
        const { n = 12, y = 600, speed = 60, dir = 1, size = 14, color = '#ffd34d', stripe = '#2b6cff', seed = 'school', W = 900 } = o;
        const r = Motion.rng(seed);
        for (let i = 0; i < n; i++) {
            const ox = r() * 300, oy = (r() - 0.5) * 140, ph = r() * TAU, sz = size * (0.8 + r() * 0.4);
            const span = W + 600;
            const x = dir > 0 ? ((((t * speed + ox) % span) + span) % span) - 300 : W + 300 - ((((t * speed + ox) % span) + span) % span);
            const yy = y + oy + Math.sin(t * 1.5 + ph) * 18;
            g.save();
            g.translate(x, yy);
            g.scale(dir, 1);
            const wag = Math.sin(t * 14 + ph) * 0.35;
            g.fillStyle = color;
            g.beginPath();
            g.ellipse(0, 0, sz, sz * 0.45, 0, 0, TAU);
            g.fill();
            g.save();
            g.translate(-sz * 0.9, 0);
            g.rotate(wag);
            g.beginPath();
            g.moveTo(0, 0);
            g.lineTo(-sz * 0.7, -sz * 0.45);
            g.lineTo(-sz * 0.7, sz * 0.45);
            g.closePath();
            g.fill();
            g.restore();
            g.fillStyle = stripe;
            g.fillRect(-sz * 0.2, -sz * 0.42, sz * 0.18, sz * 0.84);
            g.fillStyle = '#111';
            g.beginPath();
            g.arc(sz * 0.55, -sz * 0.08, sz * 0.09, 0, TAU);
            g.fill();
            g.restore();
        }
    }

    /** The sea floor: sand, rocks, coral, shells (cached) and kelp + sea grass swaying (live). */
    function seabed(g, env, t, o = {}) {
        const { y = 1290, key = 'bed' } = o;
        Motion.sprite('octo:bed:' + key + y, { x: -100, y: y - 260, w: 1100, h: 700 }, env.k, (c) => {
            // rocks behind
            [[120, 70, 150], [760, 90, 170], [470, 40, 110]].forEach(([x, h, w], i) => {
                const gr = c.createLinearGradient(0, y - h - 40, 0, y + 20);
                gr.addColorStop(0, '#2c3d44');
                gr.addColorStop(1, '#141d22');
                c.fillStyle = gr;
                c.beginPath();
                c.ellipse(x, y, w, h + 40, 0, Math.PI, TAU);
                c.fill();
            });
            // coral: branching fans
            const coral = (x, h, col, seed) => {
                const r = Motion.rng(seed);
                c.strokeStyle = col;
                c.lineCap = 'round';
                const branch = (px, py, a, l, w, d) => {
                    const qx = px + Math.cos(a) * l, qy = py + Math.sin(a) * l;
                    c.lineWidth = w;
                    c.beginPath();
                    c.moveTo(px, py);
                    c.lineTo(qx, qy);
                    c.stroke();
                    if (d > 0) for (const s2 of [-1, 1]) branch(qx, qy, a + s2 * (0.35 + r() * 0.3), l * 0.72, w * 0.7, d - 1);
                };
                branch(x, y, -Math.PI / 2, h, 9, 4);
            };
            coral(230, 90, '#e8607a', 'c1');
            coral(640, 110, '#f08a4b', 'c2');
            coral(840, 80, '#c45ad6', 'c3');
            // sand
            const sand = c.createLinearGradient(0, y - 10, 0, y + 440);
            sand.addColorStop(0, '#b9a37a');
            sand.addColorStop(1, '#4a3f2e');
            c.fillStyle = sand;
            c.beginPath();
            c.moveTo(-100, y + 10);
            for (let x = -100; x <= 1000; x += 50) c.lineTo(x, y + Math.sin(x * 0.012) * 14);
            c.lineTo(1000, y + 440);
            c.lineTo(-100, y + 440);
            c.closePath();
            c.fill();
            // shells: a scallop, a conch, a starfish, small pebbles
            const scallop = (x, yy, r, col) => {
                c.fillStyle = col;
                c.beginPath();
                c.moveTo(x, yy);
                c.arc(x, yy, r, Math.PI * 1.1, Math.PI * 1.9);
                c.closePath();
                c.fill();
                c.strokeStyle = 'rgba(80,40,20,0.5)';
                c.lineWidth = 1.5;
                for (let k = 0; k < 7; k++) {
                    const a = Math.PI * 1.1 + ((k + 0.5) / 7) * Math.PI * 0.8;
                    c.beginPath();
                    c.moveTo(x, yy);
                    c.lineTo(x + Math.cos(a) * r, yy + Math.sin(a) * r);
                    c.stroke();
                }
            };
            scallop(330, y + 40, 26, '#f3c6a3');
            scallop(700, y + 70, 22, '#f7e0c8');
            const conch = (x, yy, s2) => {
                c.fillStyle = '#efd2b0';
                c.beginPath();
                c.ellipse(x, yy, 30 * s2, 16 * s2, -0.4, 0, TAU);
                c.fill();
                c.strokeStyle = 'rgba(120,70,40,0.6)';
                c.lineWidth = 2;
                c.beginPath();
                for (let k = 0; k < 30; k++) {
                    const a = k * 0.4, rr = 2 + k * 0.5 * s2;
                    c.lineTo(x - 14 * s2 + Math.cos(a) * rr, yy + Math.sin(a) * rr * 0.6);
                }
                c.stroke();
            };
            conch(520, y + 55, 1);
            conch(120, y + 90, 0.8);
            c.fillStyle = '#ff7a4d';
            c.beginPath();
            for (let k = 0; k < 10; k++) {
                const a = -Math.PI / 2 + (k / 10) * TAU, rr = k % 2 ? 9 : 26;
                c.lineTo(820 + Math.cos(a) * rr, y + 110 + Math.sin(a) * rr);
            }
            c.closePath();
            c.fill();
            const r = Motion.rng('pebbles');
            for (let i = 0; i < 40; i++) {
                c.fillStyle = `rgba(${90 + r() * 60},${80 + r() * 50},${60 + r() * 40},0.8)`;
                c.beginPath();
                c.ellipse(r() * 900, y + 20 + r() * 300, 3 + r() * 6, 2 + r() * 4, 0, 0, TAU);
                c.fill();
            }
        }).draw(g);
        // kelp ribbons and sea grass, swaying
        g.save();
        g.lineCap = 'round';
        [[40, 520, '#2f7a3d'], [180, 380, '#3b8a44'], [610, 460, '#2f7a3d'], [880, 560, '#3b8a44']].forEach(([x, h, col], i) => {
            g.strokeStyle = col;
            g.lineWidth = 16;
            g.beginPath();
            g.moveTo(x, y + 20);
            for (let k = 1; k <= 12; k++) {
                const v = k / 12;
                g.lineTo(x + Math.sin(t * 0.9 + i + v * 3) * 30 * v, y + 20 - v * h);
            }
            g.stroke();
            g.fillStyle = col;
            for (let k = 2; k < 12; k += 2) {
                const v = k / 12, px = x + Math.sin(t * 0.9 + i + v * 3) * 30 * v, py = y + 20 - v * h, s2 = k % 4 ? 1 : -1;
                g.beginPath();
                g.ellipse(px + s2 * 22, py, 26, 9, s2 * 0.5 + Math.sin(t + k) * 0.2, 0, TAU);
                g.fill();
            }
        });
        for (let i = 0; i < 30; i++) {
            const x = i * 31 + 5, h = 40 + (i % 5) * 14;
            g.strokeStyle = i % 2 ? '#5aa35a' : '#4a8f4f';
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(x, y + 30);
            g.quadraticCurveTo(x + Math.sin(t * 1.4 + i) * 10, y + 30 - h * 0.6, x + Math.sin(t * 1.4 + i) * 18, y + 30 - h);
            g.stroke();
        }
        g.restore();
    }

    /**
     * The copper site of hemocyanin in ball-and-stick: two copper atoms bridged by an O₂ held
     * side-on, each copper held by three histidines (their imidazole rings). Turns about the
     * vertical axis. (cx, cy) centre, s scale.
     */
    function copperSite(g, env, cx, cy, s, t) {
        const atoms = [], bonds = [];
        const add = (p, el) => (atoms.push({ p, el }), atoms.length - 1);
        const cu1 = add([-1.8, 0, 0], 'Cu'), cu2 = add([1.8, 0, 0], 'Cu');
        const o1 = add([0, 0.7, 0], 'O'), o2 = add([0, -0.7, 0], 'O');
        bonds.push([o1, o2], [cu1, o1], [cu1, o2], [cu2, o1], [cu2, o2]);
        [[cu1, -1], [cu2, 1]].forEach(([cu, sx]) => {
            const c = atoms[cu].p;
            [[0.2, 1.6, 0.9], [0.4, -1.4, 1.1], [1.0, 0.1, -1.6]].forEach(([dx, dy, dz], k) => {
                const n = add([c[0] + sx * dx * 1.6, c[1] + dy, c[2] + dz], 'N');
                bonds.push([cu, n]);
                // the imidazole ring hanging off that nitrogen: a pentagon pointing outwards
                const dir = [sx * 0.9, dy * 0.35, dz * 0.35], ring = [];
                for (let j = 0; j < 4; j++) {
                    const a = (j + 1) * (TAU / 5);
                    ring.push(add([atoms[n].p[0] + dir[0] * (1 - Math.cos(a)) * 0.9, atoms[n].p[1] + Math.sin(a) * 0.95 + dir[1], atoms[n].p[2] + dir[2] * (1 - Math.cos(a)) * 0.9], j === 1 ? 'N' : 'C'));
                }
                bonds.push([n, ring[0]], [ring[0], ring[1]], [ring[1], ring[2]], [ring[2], ring[3]], [ring[3], n]);
            });
        });
        // turn and project
        const ay = t * 0.8, ax = 0.35;
        const P = atoms.map(({ p }) => {
            let [x, y, z] = p;
            [x, z] = [x * Math.cos(ay) + z * Math.sin(ay), -x * Math.sin(ay) + z * Math.cos(ay)];
            [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
            const f = 9 / (9 + z);
            return [cx + x * s * f, cy + y * s * f, z, f];
        });
        const COL = { Cu: ['#e08a4a', '#7a3e16'], O: ['#ff5a5a', '#8a1a1a'], N: ['#5a8cff', '#1a2f8a'], C: ['#9aa3ad', '#3a4148'] };
        const RAD = { Cu: 0.55, O: 0.38, N: 0.32, C: 0.28 };
        g.save();
        g.lineCap = 'round';
        bonds.forEach(([a, b]) => {
            g.strokeStyle = atoms[a].el === 'O' && atoms[b].el === 'O' ? 'rgba(255,150,150,0.9)' : 'rgba(220,230,240,0.7)';
            g.lineWidth = s * 0.14 * (P[a][3] + P[b][3]) / 2;
            g.beginPath();
            g.moveTo(P[a][0], P[a][1]);
            g.lineTo(P[b][0], P[b][1]);
            g.stroke();
        });
        atoms.map((a, i) => i).sort((i, j) => P[j][2] - P[i][2]).forEach((i) => {
            const [x, y, , f] = P[i], el = atoms[i].el, r = RAD[el] * s * f;
            const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(0.25, COL[el][0]);
            gr.addColorStop(1, COL[el][1]);
            g.fillStyle = gr;
            g.beginPath();
            g.arc(x, y, r, 0, TAU);
            g.fill();
            if (el === 'Cu') glow(g, env, '255,150,80', x, y, r * 2.4, 0.5);
        });
        // labels on the coppers and the oxygen pair
        g.font = `${Math.round(s * 0.55)}px "Anton"`;
        g.textAlign = 'center';
        g.fillStyle = '#ffe2c8';
        g.fillText('Cu', P[cu1][0], P[cu1][1] - s * 0.8);
        g.fillText('Cu', P[cu2][0], P[cu2][1] - s * 0.8);
        g.fillStyle = '#ffb0b0';
        g.fillText('O₂', (P[o1][0] + P[o2][0]) / 2, (P[o1][1] + P[o2][1]) / 2 + s * 1.5);
        g.restore();
    }

    return { draw, armLine, school, seabed, copperSite, glow };
})();
