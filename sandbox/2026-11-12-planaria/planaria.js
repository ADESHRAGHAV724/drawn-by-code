// planaria · a freshwater flatworm (Schmidtea / Dugesia) painted in code, top view, for the
// «field notebook» look: a soft brown body, mottled and darker along the middle, a pale
// translucent margin, an arrow-shaped head with pointed auricles, two eyespots (pale patches
// with black pigment cups facing in: the cross-eyed look), the pharynx showing as a paler
// tube in the middle, a wet sheen. An x-ray variant shows the gut (one branch forward, two
// back, each with side pockets), the two nerve cords with the brain, and the neoblasts.
//
// How it bends: the worm is painted ONCE straight into a sprite (head at x = 0, tail at
// x = L), then drawn along a curved spine in thin strips, each rotated to the spine. Pieces
// (after a cut) draw only a range of the strips. New tissue (a blastema) is unpigmented
// white: an overlay sprite faded in over the head range.
// Global: Plan.
const Plan = (() => {
    const TAU = Math.PI * 2;
    const L = 600; // sprite length in units
    const HW = 80; // sprite half-height

    // half-width along the body (s = 0 head tip … 1 tail tip), in units of L
    function hw(s) {
        const k = [
            [0, 0.012], [0.025, 0.05], [0.055, 0.078], [0.08, 0.098], [0.1, 0.09], [0.13, 0.072], [0.17, 0.078],
            [0.3, 0.098], [0.48, 0.108], [0.66, 0.1], [0.8, 0.078], [0.9, 0.05], [0.97, 0.02], [1, 0],
        ];
        if (s <= 0) return k[0][1];
        if (s >= 1) return 0;
        let i = 0;
        while (k[i + 1][0] < s) i++;
        const [s0, w0] = k[i], [s1, w1] = k[i + 1], u = (s - s0) / (s1 - s0);
        let w = w0 + (w1 - w0) * (0.5 - 0.5 * Math.cos(Math.PI * u));
        // the auricles: a sharp lobe on each side of the head
        w += 0.02 * Math.exp(-Math.pow((s - 0.088) / 0.02, 2));
        return w;
    }

    // the outline of the straight body (head at x = 0), ragged a little at the margin
    function outline(c, inset = 0, wob = 0) {
        const n = 140;
        c.beginPath();
        for (let i = 0; i <= n; i++) {
            const s = i / n, w = Math.max(0, hw(s) * L - inset + wob * Math.sin(s * 60));
            c[i ? 'lineTo' : 'moveTo'](s * L, -w);
        }
        for (let i = n; i >= 0; i--) {
            const s = i / n, w = Math.max(0, hw(s) * L - inset + wob * Math.sin(s * 57 + 1));
            c.lineTo(s * L, w);
        }
        c.closePath();
    }

    const EYE_S = 0.072, EYE_Y = 0.03;
    // gut: [points] in body coordinates, used by both looks
    function gutPaths() {
        const P = [];
        const side = (x0, x1, y0, dir, n) => {
            for (let i = 0; i < n; i++) {
                const x = x0 + ((x1 - x0) * (i + 0.5)) / n, w = hw(x / L) * L * 0.86;
                P.push([[x, y0], [x + dir * 6, y0 * 0.3 + Math.sign(y0 || 1) * w * 0.55], [x + dir * 4, Math.sign(y0 || 1) * w * 0.92]]);
            }
        };
        // anterior branch along the midline to the head, with side pockets both ways
        P.push([[0.38 * L, 0], [0.12 * L, 0]]);
        for (let i = 0; i < 6; i++) {
            const x = 0.13 * L + i * 0.042 * L;
            for (const sg of [-1, 1]) P.push([[x, 0], [x - 4, sg * hw(x / L) * L * 0.5], [x - 8, sg * hw(x / L) * L * 0.85]]);
        }
        // two posterior branches, either side of the pharynx, to the tail
        for (const sg of [-1, 1]) {
            P.push([[0.38 * L, 0], [0.45 * L, sg * 18], [0.7 * L, sg * 20], [0.92 * L, sg * 5]]);
            side(0.44 * L, 0.9 * L, sg * 19, 1, 10);
        }
        return P;
    }

    function spline(c, pts) {
        c.moveTo(pts[0][0], pts[0][1]);
        if (pts.length === 2) c.lineTo(pts[1][0], pts[1][1]);
        for (let i = 1; i < pts.length - 1; i++) {
            const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
            c.quadraticCurveTo(pts[i][0], pts[i][1], i === pts.length - 2 ? pts[i + 1][0] : mx, i === pts.length - 2 ? pts[i + 1][1] : my);
        }
    }

    // the eyes: a pale oval patch with a black pigment cup facing in and forward
    function eyes(c, k = 1) {
        for (const sg of [-1, 1]) {
            const x = EYE_S * L, y = sg * EYE_Y * L;
            c.fillStyle = `rgba(242,234,220,${0.95 * k})`;
            c.beginPath();
            c.ellipse(x, y, 7.5, 5.5, sg * 0.35, 0, TAU);
            c.fill();
            c.fillStyle = `rgba(14,10,8,${k})`;
            c.beginPath();
            c.ellipse(x - 1, y - sg * 1.8, 3.8, 2.8, sg * 0.35, 0, TAU);
            c.fill();
            c.fillStyle = `rgba(255,255,255,${0.7 * k})`;
            c.beginPath();
            c.arc(x - 2.2, y - sg * 2.4, 0.8, 0, TAU);
            c.fill();
        }
    }

    // the painted body (straight), cached per look
    function bodySprite(env, look) {
        return Motion.sprite('plan:body:' + look, { x: -10, y: -HW, w: L + 20, h: 2 * HW }, env.k * 1.5, (c) => {
            const r = Motion.rng('plan' + look);
            const xray = look === 'xray', pale = look === 'pale';
            // margin: pale and translucent
            outline(c);
            c.fillStyle = xray ? 'rgba(214,196,160,0.92)' : pale ? '#ece3d2' : '#a88865';
            c.fill();
            c.save();
            outline(c);
            c.clip();
            // thickness: darker toward the middle (stacked insets)
            const core = xray ? 'rgba(150,120,80,0.10)' : pale ? 'rgba(200,185,160,0.18)' : 'rgba(62,36,16,0.38)';
            c.filter = `blur(${7 * env.k * 1.5}px)`;
            for (let k = 1; k <= 3; k++) {
                outline(c, k * 9);
                c.fillStyle = core;
                c.fill();
            }
            c.filter = 'none';
            if (!pale) {
                // mottling: dark pigment blotches, denser along the middle, and light flecks
                c.filter = `blur(${1.2 * env.k * 1.5}px)`;
                for (let i = 0; i < (xray ? 260 : 1500); i++) {
                    const s = 0.05 + r() * 0.93, w = hw(s) * L, y = (r() - 0.5) * 2 * w * Math.sqrt(r());
                    const d = Math.abs(y) / (w || 1);
                    c.fillStyle = xray ? `rgba(120,85,50,${0.12 * (1 - d)})` : `rgba(48,28,12,${0.26 * (1 - d * 0.8)})`;
                    c.beginPath();
                    c.ellipse(s * L, y, 1.5 + r() * 4.5, 1 + r() * 2.6, r() * TAU, 0, TAU);
                    c.fill();
                }
                c.filter = 'none';
                for (let i = 0; i < (xray ? 0 : 500); i++) {
                    const s = r(), w = hw(s) * L, y = (r() - 0.5) * 2 * w;
                    c.fillStyle = 'rgba(225,200,160,0.20)';
                    c.fillRect(s * L, y, 1.6, 1.6);
                }
            }
            // gut (faint, or clear in x-ray)
            c.lineCap = 'round';
            c.lineJoin = 'round';
            c.strokeStyle = xray ? 'rgba(92,110,52,0.75)' : pale ? 'rgba(0,0,0,0)' : 'rgba(35,20,8,0.10)';
            c.lineWidth = xray ? 6.5 : 9;
            if (!xray) c.filter = `blur(${4 * env.k * 1.5}px)`;
            for (const p of gutPaths()) {
                c.beginPath();
                spline(c, p);
                c.stroke();
            }
            c.filter = 'none';
            if (xray) {
                // nerve cords: two lines with rungs, the brain as two lobes behind the eyes
                c.strokeStyle = 'rgba(245,238,220,0.85)';
                c.lineWidth = 3;
                for (const sg of [-1, 1]) {
                    c.beginPath();
                    c.moveTo(0.06 * L, sg * 10);
                    c.bezierCurveTo(0.2 * L, sg * 26, 0.6 * L, sg * 30, 0.95 * L, sg * 4);
                    c.stroke();
                    c.fillStyle = 'rgba(250,240,220,0.9)';
                    c.beginPath();
                    c.ellipse(0.1 * L, sg * 12, 20, 9, sg * 0.2, 0, TAU);
                    c.fill();
                }
                c.lineWidth = 1.4;
                for (let x = 0.16 * L; x < 0.92 * L; x += 22) {
                    const y = 26 * Math.sin(Math.min(1, (x / L - 0.05) * 3)) * (1 - Math.pow(x / L, 6));
                    c.beginPath();
                    c.moveTo(x, -y);
                    c.lineTo(x, y);
                    c.stroke();
                }
            }
            // pharynx: a paler tube in the middle, its mouth facing back
            c.fillStyle = xray ? 'rgba(240,215,190,0.85)' : pale ? 'rgba(0,0,0,0)' : 'rgba(215,190,150,0.20)';
            c.strokeStyle = xray ? 'rgba(160,90,60,0.8)' : pale ? 'rgba(0,0,0,0)' : 'rgba(225,200,160,0.18)';
            c.lineWidth = 2;
            if (!xray) c.filter = `blur(${2.5 * env.k * 1.5}px)`;
            c.beginPath();
            c.ellipse(0.53 * L, 0, 0.1 * L, 11, 0, 0, TAU);
            c.fill();
            c.stroke();
            c.filter = 'none';
            // the head: less pigment between and around the eyes
            if (!pale && !xray) {
                const hg = c.createRadialGradient(EYE_S * L, 0, 4, EYE_S * L, 0, 46);
                hg.addColorStop(0, 'rgba(200,175,140,0.35)');
                hg.addColorStop(1, 'rgba(200,175,140,0)');
                c.fillStyle = hg;
                c.fillRect(0, -50, 100, 100);
            }
            // wet sheen: a soft streak along the upper side and a few glints
            const sh = c.createLinearGradient(0, -40, 0, 10);
            sh.addColorStop(0, 'rgba(255,248,235,0)');
            sh.addColorStop(0.55, 'rgba(255,248,235,0.20)');
            sh.addColorStop(1, 'rgba(255,248,235,0)');
            c.fillStyle = 'rgba(255,246,230,0.16)';
            c.filter = `blur(${6 * env.k * 1.5}px)`;
            c.beginPath();
            c.ellipse(0.47 * L, -0.012 * L, 0.36 * L, 0.022 * L, 0, 0, TAU);
            c.fill();
            c.filter = 'none';
            for (let i = 0; i < 12; i++) {
                const s = 0.1 + r() * 0.8;
                c.fillStyle = 'rgba(255,250,240,0.35)';
                c.beginPath();
                c.ellipse(s * L, -hw(s) * L * (0.2 + r() * 0.4), 2 + r() * 3, 0.8, 0, 0, TAU);
                c.fill();
            }
            c.restore();
            // margin line: a thin light rim
            outline(c, 1.2);
            c.strokeStyle = pale ? 'rgba(255,252,245,0.8)' : 'rgba(235,218,190,0.55)';
            c.lineWidth = 1.6;
            c.stroke();
            if (look !== 'headless') eyes(c, pale ? 0.5 : 1);
            if (pale) {
                // new tissue fades into the old: opaque to s 0.13, gone by 0.26
                c.globalCompositeOperation = 'destination-in';
                const fg = c.createLinearGradient(0.13 * L, 0, 0.26 * L, 0);
                fg.addColorStop(0, 'rgba(0,0,0,1)');
                fg.addColorStop(1, 'rgba(0,0,0,0)');
                c.fillStyle = fg;
                c.fillRect(-10, -HW, L + 20, 2 * HW);
            }
        });
    }

    // neoblasts: small cells scattered through the body (outside the pharynx and eyes)
    function neoblasts(n = 160) {
        const r = Motion.rng('neo'), out = [];
        while (out.length < n) {
            const s = 0.12 + r() * 0.84, w = hw(s) * L * 0.8, y = (r() - 0.5) * 2 * w;
            if (Math.abs(s - 0.53) < 0.1 && Math.abs(y) < 13) continue;
            out.push([s, y / L, r()]);
        }
        return out;
    }
    const NEO = neoblasts();

    /**
     * The spine: a function s → [x, y, angle] for a worm with its head at (x, y), heading
     * `ang`, length `len`, bending with amplitude `bend` and a wave travelling along it.
     */
    function spine(x, y, ang, len, t = 0, bend = 0.25, freq = 1.3) {
        const n = 60, pts = [];
        let px = x, py = y;
        for (let i = 0; i <= n; i++) {
            const s = i / n;
            const a = ang + bend * Math.sin(TAU * s * 0.7 - t * freq) * (0.35 + s * 0.65) + bend * 0.6 * Math.sin(t * 0.7) * (1 - s);
            pts.push([px, py, a]);
            px -= Math.cos(a) * (len / n);
            py -= Math.sin(a) * (len / n);
        }
        return pts;
    }

    // draw a straight sprite along the spine, for s in [s0, s1]
    function strips(g, sp, pts, len, s0 = 0, s1 = 1, alpha = 1) {
        const n = pts.length - 1, px = sp.canvas.width / sp.box.w, sc = len / L;
        g.save();
        g.globalAlpha *= alpha;
        for (let i = 0; i < n; i++) {
            const a = i / n, b = (i + 1) / n;
            if (b <= s0 || a >= s1) continue;
            const aa = Math.max(a, s0), bb = Math.min(b, s1);
            const [x, y, ang] = pts[i];
            const fx = aa - a;
            g.save();
            g.translate(x - Math.cos(ang) * fx * len, y - Math.sin(ang) * fx * len);
            g.rotate(ang + Math.PI);
            const sx = (aa * L - sp.box.x) * px, sw = (bb - aa) * L * px;
            const ext = i < n - 1 && bb === b ? 1.2 : 0; // overlap neighbours to hide seams
            g.drawImage(sp.canvas, sx, 0, sw + ext * px, sp.canvas.height, 0, -HW * sc, (bb - aa) * len + ext * sc, 2 * HW * sc);
            g.restore();
        }
        g.restore();
    }

    /**
     * The worm. (x, y) = head tip, `ang` = heading (0 = facing right), `len` in units.
     * o: t, look ('normal' | 'xray'), bend, freq, s0/s1 (a piece), pale (0–1, unpigmented
     * head up to paleTo), headless, neo (0–1 neoblasts lit), neoColor, shadow, alpha.
     */
    function draw(g, env, x, y, ang, len, o = {}) {
        const { t = 0, look = 'normal', bend = 0.18, freq = 1.3, s0 = 0, s1 = 1, pale = 0, neo = 0, alpha = 1, shadow = true } = o;
        if (alpha <= 0) return;
        const pts = o.pts || spine(x, y, ang, len, t, bend, freq);
        g.save();
        g.globalAlpha *= alpha;
        if (shadow && typeof Note !== 'undefined') {
            const m = pts[Math.round(((s0 + s1) / 2) * (pts.length - 1))];
            Note.shadow(g, env, m[0] + 6, m[1] + 12, len * (s1 - s0) * 0.55, len * 0.09, 0.55);
        }
        const body = bodySprite(env, o.headless ? 'headless' : look);
        strips(g, body, pts, len, s0, s1);
        if (pale > 0) strips(g, bodySprite(env, 'pale'), pts, len, s0, Math.min(s1, 0.3), pale);
        if (neo > 0) {
            const sc = len / L;
            for (const [s, yy, ph] of NEO) {
                if (s < s0 || s > s1) continue;
                const p = pts[Math.min(pts.length - 1, Math.round(s * (pts.length - 1)))];
                const nx = -Math.sin(p[2]), ny = Math.cos(p[2]);
                const tw = 0.6 + 0.4 * Math.sin(t * 4 + ph * TAU);
                g.fillStyle = o.neoColor || `rgba(200,40,25,${0.9 * neo * tw})`;
                g.beginPath();
                g.arc(p[0] + nx * yy * len, p[1] + ny * yy * len, Math.max(1.4, 4.2 * sc), 0, TAU);
                g.fill();
            }
        }
        g.restore();
        return pts;
    }

    /** Spine point at s (for placing labels, cut lines). */
    const at = (pts, s) => pts[Math.min(pts.length - 1, Math.max(0, Math.round(s * (pts.length - 1))))];

    return { L, hw, spine, draw, at };
})();
