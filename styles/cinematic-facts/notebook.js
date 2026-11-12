// Cinematic-facts · the «field notebook» look (after a facts Short the user showed: a
// tardigrade explainer). A manila notebook page — ruled lines, a fold crease, binder holes,
// faint white pencil sprigs, mottled and darker at the edges — with a mono section label
// and «FIG. n» over a thin rule, a two-line caption (a small dark line, then a big red one
// slammed in on the voice), and lab props drawn on it: a microscope field with cells in the
// background and a scale bar, red hand-drawn circled numbers, a magnifier callout, kraft
// cards, a torn paper label. Dark pages (#1a120b) for the microscope, teal for the sea.
// Global: Note. Fonts: Anton (captions), Space Mono (labels), Patrick Hand (hand numbers).
// Measured on the reference (900×1600 units): label y 200, rule y 222, caption small line
// baseline ~300, big line baseline ~455, left margin 40; paper #c4aa80, red #b0301e, ink
// #2a1c12; microscope field #c8bd84 → #9c8f58, page #17100a.
const Note = (() => {
    const TAU = Math.PI * 2;
    const RED = '#b0301e', INK = '#2a1c12', CREAM = '#eadfc8';
    const PAGES = {
        paper: { base: '#cdb288', hi: '#dac39a', lo: '#b39870', rule: 'rgba(110,84,52,0.14)', sketch: 'rgba(250,240,220,0.32)', edge: 'rgba(80,52,22,0.30)' },
        dark: { base: '#1b130c', hi: '#271c12', lo: '#0f0a06', rule: 'rgba(200,170,120,0.05)', sketch: 'rgba(230,210,170,0.05)', edge: 'rgba(0,0,0,0.7)' },
        teal: { base: '#2c5a58', hi: '#3a6b67', lo: '#1d4241', rule: 'rgba(220,240,230,0.05)', sketch: 'rgba(230,250,240,0.08)', edge: 'rgba(5,20,20,0.6)' },
        sky: { base: '#a9c3c6', hi: '#bcd2d2', lo: '#90adb2', rule: 'rgba(60,80,90,0.10)', sketch: 'rgba(255,255,255,0.25)', edge: 'rgba(40,60,70,0.45)' },
    };

    // a white pencil sprig: a curving stem with leaf strokes in pairs
    function sprig(c, r, x, y, ang, len) {
        c.beginPath();
        let px = x, py = y, a = ang;
        const pts = [];
        for (let k = 0; k < 12; k++) {
            a += (r() - 0.5) * 0.25;
            px += Math.cos(a) * (len / 12);
            py += Math.sin(a) * (len / 12);
            pts.push([px, py, a]);
        }
        c.moveTo(x, y);
        pts.forEach(([u, v]) => c.lineTo(u, v));
        c.stroke();
        pts.forEach(([u, v, b], k) => {
            if (k < 2) return;
            const L = len * (0.16 - k * 0.008);
            for (const s of [-1, 1]) {
                const d = b + s * (0.7 + r() * 0.3);
                c.beginPath();
                c.moveTo(u, v);
                c.quadraticCurveTo(u + Math.cos(d - s * 0.3) * L * 0.6, v + Math.sin(d - s * 0.3) * L * 0.6, u + Math.cos(d) * L, v + Math.sin(d) * L);
                c.stroke();
            }
        });
    }

    /** The page: kind 'paper' (manila), 'dark' (microscope), 'teal' (sea) or 'sky'. Cached. */
    function page(g, env, kind = 'paper', o = {}) {
        const P = PAGES[kind], { crease = 0.66, holes = kind === 'paper', sprigs = kind === 'paper' ? 7 : 3, key = kind } = o;
        const W = env.W, H = env.H;
        Motion.sprite('note:page:' + key + W + 'x' + H, { x: 0, y: 0, w: W, h: H }, env.k, (c) => {
            const r = Motion.rng('page' + key);
            c.fillStyle = P.base;
            c.fillRect(0, 0, W, H);
            // mottling: big soft blotches, lighter and darker
            for (let i = 0; i < 70; i++) {
                const x = r() * W, y = r() * H, R = 120 + r() * 320, light = r() < 0.5;
                const gr = c.createRadialGradient(x, y, 0, x, y, R);
                const col = light ? P.hi : P.lo;
                gr.addColorStop(0, col);
                gr.addColorStop(1, col + '00'); // fade to the same colour, not to black
                c.globalAlpha = 0.07 + r() * 0.08;
                c.fillStyle = gr;
                c.fillRect(x - R, y - R, 2 * R, 2 * R);
            }
            // fibres and specks
            c.globalAlpha = 1;
            for (let i = 0; i < 2600; i++) {
                const x = r() * W, y = r() * H, d = r();
                c.fillStyle = d < 0.5 ? 'rgba(80,55,25,0.10)' : 'rgba(255,245,225,0.10)';
                if (r() < 0.3) {
                    c.save();
                    c.translate(x, y);
                    c.rotate(r() * TAU);
                    c.fillRect(0, 0, 4 + r() * 10, 0.7);
                    c.restore();
                } else c.fillRect(x, y, 1.2, 1.2);
            }
            // ruled lines
            c.fillStyle = P.rule;
            for (let y = 262; y < H; y += 38) c.fillRect(0, y, W, 1.3);
            // white pencil sprigs near the edges
            c.strokeStyle = P.sketch;
            c.lineWidth = 1.3;
            c.lineCap = 'round';
            for (let i = 0; i < sprigs; i++) {
                const left = i % 2 === 0, y = 120 + r() * (H - 240);
                sprig(c, r, left ? -10 : W + 10, y, left ? -0.4 + r() * 0.8 : Math.PI - 0.4 + r() * 0.8, 140 + r() * 140);
            }
            // the fold crease: a lit ridge with a soft shadow on its left
            const cx = W * crease;
            const sh = c.createLinearGradient(cx - 40, 0, cx, 0);
            sh.addColorStop(0, 'rgba(0,0,0,0)');
            sh.addColorStop(1, 'rgba(60,40,15,0.16)');
            c.fillStyle = sh;
            c.fillRect(cx - 40, 0, 40, H);
            c.fillStyle = 'rgba(255,248,230,0.16)';
            c.fillRect(cx, 0, 2.2, H);
            // binder holes along the left edge
            if (holes)
                for (let y = 180; y < H; y += 150) {
                    c.fillStyle = 'rgba(40,25,10,0.55)';
                    c.beginPath();
                    c.arc(4, y, 6, 0, TAU);
                    c.fill();
                }
            // edges darker (aged)
            const vg = c.createRadialGradient(W / 2, H * 0.48, W * 0.35, W / 2, H * 0.5, H * 0.72);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, P.edge);
            c.fillStyle = vg;
            c.fillRect(0, 0, W, H);
        }).draw(g);
    }

    /** The section label (mono, left) and «FIG. n» (right) over a thin rule. */
    function header(g, env, label, fig, o = {}) {
        const { dark = false, y = 200, x = 40, alpha = 1 } = o;
        g.save();
        g.globalAlpha *= alpha;
        g.font = '19px "Space Mono"';
        g.fillStyle = dark ? 'rgba(220,200,160,0.55)' : 'rgba(70,50,28,0.62)';
        g.textAlign = 'left';
        g.fillText(spaced(label), x, y);
        g.textAlign = 'right';
        g.fillText(spaced('FIG. ' + fig), env.W - x, y);
        g.fillStyle = dark ? 'rgba(220,200,160,0.35)' : 'rgba(55,38,20,0.65)';
        g.fillRect(x, y + 20, env.W - 2 * x, 1.8);
        g.restore();
    }
    const spaced = (s) => s.toUpperCase().split('').join(' ');

    /**
     * The caption: a small line (ink, or cream on dark pages) popping in at `a`, and a big
     * red line slamming in at `a2` (scaled down from 1.25 with a quick settle). Both shrink
     * to fit `maxW`. Ends at `b`.
     */
    function caption(g, t, a, a2, b, top, bottom, o = {}) {
        if (t < a || t >= b) return;
        const { x = 40, y = 300, topSize = 92, size = 205, maxW = 800, dark = false, color = RED } = o;
        const out = 1 - Ease.seg(t, b - 0.15, b);
        g.save();
        g.globalAlpha *= out;
        g.textAlign = 'left';
        g.textBaseline = 'alphabetic';
        const fit = (txt, s) => {
            g.font = `${s}px "Anton"`;
            const w = g.measureText(txt).width;
            return w > maxW ? (s * maxW) / w : s;
        };
        const s1 = top ? fit(top, topSize) : 0, s2 = bottom ? fit(bottom, size) : 0;
        if (top) {
            const u = Ease.seg(t, a, a + 0.12);
            g.globalAlpha = out * u;
            g.font = `${s1}px "Anton"`;
            g.fillStyle = dark ? CREAM : INK;
            g.fillText(top, x, y + (1 - u) * 10);
        }
        if (bottom && t >= a2) {
            const u = Ease.seg(t, a2, a2 + 0.16), z = 1 + 0.22 * (1 - Ease.out(u));
            g.globalAlpha = out * Math.min(1, u * 2.5);
            g.font = `${s2}px "Anton"`;
            // the big line's caps start just under the small line's baseline
            const by = y + 4 + g.measureText(bottom).actualBoundingBoxAscent;
            g.translate(x, by);
            g.scale(z, z);
            g.font = `${s2}px "Anton"`;
            g.fillStyle = color;
            g.fillText(bottom, 0, 0);
        }
        g.restore();
    }

    // soft round shadow sprite (blurred once)
    const shadowSprite = (env) =>
        Motion.sprite('note:shadow', { x: -110, y: -110, w: 220, h: 220 }, env.k, (c) => {
            const gr = c.createRadialGradient(0, 0, 0, 0, 0, 100);
            gr.addColorStop(0, 'rgba(30,18,6,0.55)');
            gr.addColorStop(0.55, 'rgba(30,18,6,0.25)');
            gr.addColorStop(1, 'rgba(30,18,6,0)');
            c.fillStyle = gr;
            c.fillRect(-110, -110, 220, 220);
        });
    /** A soft contact shadow, an ellipse rx × ry at (x, y). */
    function shadow(g, env, x, y, rx, ry, a = 1) {
        const s = shadowSprite(env);
        g.save();
        g.globalAlpha *= a;
        g.drawImage(s.canvas, x - rx * 1.1, y - ry * 1.1, rx * 2.2, ry * 2.2);
        g.restore();
    }

    // the field's background: rows of faint oval cells with dark specks (cached)
    function cellsSprite(env, R) {
        return Motion.sprite('note:cells:' + R, { x: -R, y: -R, w: 2 * R, h: 2 * R }, env.k, (c) => {
            const r = Motion.rng('cells');
            const gr = c.createRadialGradient(-R * 0.1, -R * 0.15, R * 0.1, 0, 0, R);
            gr.addColorStop(0, '#d2c890');
            gr.addColorStop(0.7, '#bdb178');
            gr.addColorStop(1, '#8e8150');
            c.fillStyle = gr;
            c.fillRect(-R, -R, 2 * R, 2 * R);
            const cw = 46, ch = 58;
            for (let row = -R / ch - 1; row < R / ch + 1; row++)
                for (let col = -R / cw - 1; col < R / cw + 1; col++) {
                    const x = col * cw + (row % 2 ? cw / 2 : 0) + (r() - 0.5) * 6, y = row * ch * 0.86 + (r() - 0.5) * 6;
                    const d = Math.hypot(x, y) / R;
                    const a = 0.22 * Math.max(0, 1 - Math.pow(Math.max(0, (d - 0.15) / 0.75), 1.5)) + 0.06;
                    c.strokeStyle = `rgba(110,98,48,${a})`;
                    c.fillStyle = `rgba(150,140,80,${a * 0.6})`;
                    c.lineWidth = 2;
                    c.beginPath();
                    c.ellipse(x, y, cw * 0.42, ch * 0.4, (r() - 0.5) * 0.4, 0, TAU);
                    c.fill();
                    c.stroke();
                    c.fillStyle = `rgba(90,78,36,${a * 1.2})`;
                    for (let k = 0; k < 4; k++) c.fillRect(x + (r() - 0.5) * cw * 0.45, y + (r() - 0.5) * ch * 0.4, 2.2, 2.2);
                }
            // faint crosshair
            c.fillStyle = 'rgba(80,70,35,0.18)';
            c.fillRect(-R, -0.8, 2 * R, 1.6);
            c.fillRect(-0.8, -R, 1.6, 2 * R);
        });
    }

    /**
     * A microscope field of radius R at (cx, cy): the cell background, then `inside(g)`
     * clipped to the circle, then the inner shadow, the black rim and an optional scale bar.
     */
    function scope(g, env, cx, cy, R, inside, o = {}) {
        const { scale = '0.1 MM', alpha = 1 } = o;
        g.save();
        g.globalAlpha *= alpha;
        g.translate(cx, cy);
        // rim shadow on the page
        shadow(g, env, 0, 14, R * 1.08, R * 1.08, 0.9);
        g.save();
        g.beginPath();
        g.arc(0, 0, R, 0, TAU);
        g.clip();
        cellsSprite(env, Math.round(R)).draw(g);
        if (inside) inside(g);
        // inner shadow: dark toward the rim
        const ig = g.createRadialGradient(0, 0, R * 0.72, 0, 0, R);
        ig.addColorStop(0, 'rgba(40,30,10,0)');
        ig.addColorStop(1, 'rgba(40,30,10,0.55)');
        g.fillStyle = ig;
        g.fillRect(-R, -R, 2 * R, 2 * R);
        g.restore();
        // the rim: black metal with a thin lit edge
        g.lineWidth = 9;
        g.strokeStyle = '#0c0804';
        g.beginPath();
        g.arc(0, 0, R + 3, 0, TAU);
        g.stroke();
        g.lineWidth = 1.5;
        g.strokeStyle = 'rgba(200,180,130,0.35)';
        g.beginPath();
        g.arc(0, 0, R + 8, Math.PI * 1.1, Math.PI * 1.7);
        g.stroke();
        if (scale) {
            g.font = '20px "Space Mono"';
            g.fillStyle = 'rgba(30,24,10,0.85)';
            g.textAlign = 'center';
            const sx = R * 0.42, sy = R * 0.52;
            g.fillText(scale, sx, sy - 12);
            g.fillRect(sx - 75, sy, 150, 4);
        }
        g.restore();
    }

    /** A red hand-drawn circle drawn on from `a` (0.35 s), with a hand-written number. */
    function circleNum(g, t, a, x, y, label, o = {}) {
        if (t < a) return;
        const { r = 26, color = RED, seed = String(label), lw = 3.2 } = o;
        const u = Ease.out(Ease.seg(t, a, a + 0.35));
        const rr = Motion.rng('cn' + seed);
        const a0 = -Math.PI * 0.6 + rr() * 0.6, sweep = TAU * 1.12 * u;
        g.save();
        g.strokeStyle = color;
        g.lineWidth = lw;
        g.lineCap = 'round';
        g.beginPath();
        const n = 40;
        for (let k = 0; k <= n; k++) {
            const ang = a0 + (sweep * k) / n, wob = 1 + 0.06 * Math.sin(ang * 3 + rr() * 2) + 0.08 * (k / n);
            const px = x + Math.cos(ang) * r * wob * 1.08, py = y + Math.sin(ang) * r * wob * 0.95;
            if (k) g.lineTo(px, py);
            else g.moveTo(px, py);
        }
        g.stroke();
        if (u > 0.5) {
            g.globalAlpha *= Ease.seg(u, 0.5, 1);
            g.fillStyle = color;
            g.font = `${r * 1.3}px "Patrick Hand"`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(String(label), x, y + 2);
        }
        g.restore();
    }

    /** A red hand-drawn line from p to q, drawn on over [a, a+d]. */
    function redLine(g, t, a, d, p, q, o = {}) {
        if (t < a) return;
        const u = Ease.out(Ease.seg(t, a, a + d));
        g.save();
        g.strokeStyle = o.color || RED;
        g.lineWidth = o.lw || 3;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(p[0], p[1]);
        g.lineTo(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u);
        g.stroke();
        g.restore();
    }

    /**
     * A magnifier callout: a red ring at (x, y) of radius R over cream, `inside(g)` clipped
     * in it, and two red leader lines to a small red ring at `from`. Pops in at `a`.
     */
    function callout(g, env, t, a, x, y, R, from, inside, o = {}) {
        if (t < a) return;
        const u = Ease.back(Ease.seg(t, a + 0.25, a + 0.6));
        // leader: the small ring, then two tangent lines
        circleRing(g, from[0], from[1], o.fromR || 22, Ease.seg(t, a, a + 0.2));
        if (u <= 0) return;
        g.save();
        const dx = x - from[0], dy = y - from[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
        g.strokeStyle = RED;
        g.lineWidth = 2.5;
        for (const s of [-1, 1]) {
            g.beginPath();
            g.moveTo(from[0] + nx * s * (o.fromR || 22), from[1] + ny * s * (o.fromR || 22));
            g.lineTo(from[0] + (x + nx * s * R * u - from[0]), from[1] + (y + ny * s * R * u - from[1]));
            g.stroke();
        }
        g.translate(x, y);
        g.scale(u, u);
        shadow(g, env, 0, 12, R * 1.05, R * 1.05, 0.7);
        g.save();
        g.beginPath();
        g.arc(0, 0, R, 0, TAU);
        g.clip();
        g.fillStyle = '#efe4cc';
        g.fillRect(-R, -R, 2 * R, 2 * R);
        if (inside) inside(g);
        g.restore();
        g.lineWidth = 6;
        g.strokeStyle = RED;
        g.beginPath();
        g.arc(0, 0, R, 0, TAU);
        g.stroke();
        g.restore();
    }
    function circleRing(g, x, y, r, u) {
        if (u <= 0) return;
        g.save();
        g.strokeStyle = RED;
        g.lineWidth = 3;
        g.beginPath();
        g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * u);
        g.stroke();
        g.restore();
    }

    /** A kraft card (w × h, tilted `rot`) with an inner ruled border; `inside(g)` on it. */
    function card(g, env, x, y, w, h, rot, inside, o = {}) {
        g.save();
        g.translate(x, y);
        g.rotate(rot);
        shadow(g, env, 6, 14, w * 0.58, h * 0.58, 0.6);
        const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
        gr.addColorStop(0, '#c09a68');
        gr.addColorStop(1, '#a98456');
        g.fillStyle = gr;
        g.fillRect(-w / 2, -h / 2, w, h);
        g.strokeStyle = 'rgba(70,45,20,0.55)';
        g.lineWidth = 1.6;
        g.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
        if (inside) inside(g);
        if (o.label) {
            g.font = '17px "Space Mono"';
            g.fillStyle = 'rgba(50,32,15,0.8)';
            g.textAlign = 'center';
            g.fillText(spaced(o.label), 0, h / 2 - 30);
        }
        g.restore();
    }

    /** A torn kraft label behind a caption: x, y top-left, w × h. */
    function tornLabel(g, env, x, y, w, h, o = {}) {
        const key = o.key || 'tl';
        g.save();
        g.translate(x, y);
        shadow(g, env, w / 2, h / 2 + 10, w * 0.55, h * 0.6, 0.6);
        g.beginPath();
        const pts = [];
        const n = 40;
        for (let k = 0; k <= n; k++) pts.push([(w * k) / n, Motion.noise1(key + 't', k * 0.9) * 7]);
        for (let k = 0; k <= 10; k++) pts.push([w + Motion.noise1(key + 'r', k) * 6, (h * k) / 10]);
        for (let k = n; k >= 0; k--) pts.push([(w * k) / n, h + Motion.noise1(key + 'b', k * 0.9) * 7]);
        for (let k = 10; k >= 0; k--) pts.push([Motion.noise1(key + 'l', k) * 6, (h * k) / 10]);
        pts.forEach(([u, v], i) => (i ? g.lineTo(u, v) : g.moveTo(u, v)));
        g.closePath();
        g.fillStyle = '#d9c39a';
        g.fill();
        g.strokeStyle = 'rgba(255,248,230,0.6)';
        g.lineWidth = 2;
        g.stroke();
        g.restore();
    }

    return { TAU, RED, INK, CREAM, page, header, caption, shadow, scope, circleNum, redLine, callout, card, tornLabel };
})();
