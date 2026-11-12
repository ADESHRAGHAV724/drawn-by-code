// immortal-jellyfish · Turritopsis dohrnii painted in code, after the user's reference photos:
// a clear, bluish dome whose edges catch the light, a bright white rim beaded with tentacle
// bulbs, a red-orange cross-shaped stomach glowing inside, and a halo of fine white
// tentacles curling out all around. Two views: 'side' (the dome from the side, the rim as an
// ellipse below it) and 'top' (from above: a disc, the red cross at its heart).
// Global: Turri. Glows are pre-blurred sprites (cheap at any size).
const Turri = (() => {
    const TAU = Math.PI * 2;

    // a soft round glow, blurred once and reused
    const glow = (env, rgb) =>
        Motion.sprite('turri:glow:' + rgb, { x: -60, y: -60, w: 120, h: 120 }, env.k, (c) => {
            const gr = c.createRadialGradient(0, 0, 0, 0, 0, 58);
            gr.addColorStop(0, `rgba(${rgb},0.9)`);
            gr.addColorStop(0.4, `rgba(${rgb},0.35)`);
            gr.addColorStop(1, `rgba(${rgb},0)`);
            c.fillStyle = gr;
            c.fillRect(-60, -60, 120, 120);
        });
    const putGlow = (g, sp, x, y, r, a = 1) => {
        g.save();
        g.globalAlpha *= a;
        g.drawImage(sp.canvas, x - r, y - r, r * 2, r * 2);
        g.restore();
    };

    /**
     * The jellyfish, centred on its bell at (x, y), `size` ≈ the bell's width in units.
     * o: view ('side' | 'top'), t (time: tentacles curl, the bell pulses), alpha, tilt, seed.
     */
    function draw(g, env, x, y, size, o = {}) {
        const { view = 'side', t = 0, alpha = 1, tilt = 0, seed = 'turri', nTent = 70 } = o;
        if (alpha <= 0) return;
        const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
        const bw = size * 0.5 * (1 - 0.06 * pulse), bh = size * 0.55 * (1 + 0.04 * pulse);
        const r = Motion.rng(seed);
        const W = glow(env, '200,235,255'), R = glow(env, '255,70,50');
        g.save();
        g.globalAlpha = alpha;
        g.translate(x, y);
        g.rotate(tilt);
        g.globalCompositeOperation = 'lighter';
        putGlow(g, W, 0, 0, size * 1.1, 0.25);

        // rim ring: an ellipse (side) or a circle (top)
        const ring = (a) => (view === 'top' ? [Math.cos(a) * bw, Math.sin(a) * bw] : [Math.cos(a) * bw, bh * 0.45 + Math.sin(a) * bw * 0.32]);

        // tentacles: from the rim outward, curling, with a pale bulb at the tip
        g.lineCap = 'round';
        for (let i = 0; i < nTent; i++) {
            const a = (i / nTent) * TAU + r() * 0.05, len = size * (0.55 + r() * 0.65), curl = (r() - 0.5) * 3, ph = r() * TAU;
            const p0 = ring(a);
            const dir = view === 'top' ? a : Math.atan2(Math.sin(a) * 0.5 + 0.55, Math.cos(a));
            g.strokeStyle = `rgba(225,240,255,${0.28 + r() * 0.2})`;
            g.lineWidth = Math.max(0.7, size * 0.004);
            g.beginPath();
            g.moveTo(p0[0], p0[1]);
            let px = p0[0], py = p0[1], d = dir;
            const n = 14;
            for (let k = 1; k <= n; k++) {
                const v = k / n;
                d += (curl * 0.09 + Math.sin(t * 1.6 + ph + v * 5) * 0.06) * (0.4 + v);
                px += Math.cos(d) * (len / n);
                py += Math.sin(d) * (len / n);
                g.lineTo(px, py);
            }
            g.stroke();
            if (i % 2 === 0) {
                g.fillStyle = 'rgba(235,245,255,0.6)';
                g.beginPath();
                g.arc(px, py, Math.max(1, size * 0.007), 0, TAU);
                g.fill();
            }
        }

        // the bell
        g.globalCompositeOperation = 'source-over';
        const bell = new Path2D();
        if (view === 'top') bell.arc(0, 0, bw, 0, TAU);
        else {
            bell.moveTo(-bw, bh * 0.45);
            bell.bezierCurveTo(-bw * 1.05, -bh * 0.45, -bw * 0.55, -bh * 0.95, 0, -bh * 0.95);
            bell.bezierCurveTo(bw * 0.55, -bh * 0.95, bw * 1.05, -bh * 0.45, bw, bh * 0.45);
            bell.ellipse(0, bh * 0.45, bw, bw * 0.32, 0, 0, Math.PI);
            bell.closePath();
        }
        const fill = g.createRadialGradient(0, -bh * 0.1, bw * 0.2, 0, 0, bw * 1.15);
        fill.addColorStop(0, 'rgba(170,205,235,0.10)');
        fill.addColorStop(0.75, 'rgba(180,215,245,0.20)');
        fill.addColorStop(1, 'rgba(225,240,255,0.42)');
        g.fillStyle = fill;
        g.fill(bell);
        g.globalCompositeOperation = 'lighter';
        g.strokeStyle = 'rgba(230,242,255,0.55)';
        g.lineWidth = Math.max(1, size * 0.012);
        g.stroke(bell);
        // a highlight along the upper left of the dome
        g.strokeStyle = 'rgba(255,255,255,0.35)';
        g.lineWidth = Math.max(1, size * 0.02);
        g.beginPath();
        if (view === 'top') g.arc(0, 0, bw * 0.8, Math.PI * 1.05, Math.PI * 1.45);
        else g.ellipse(0, -bh * 0.1, bw * 0.75, bh * 0.75, 0, Math.PI * 1.1, Math.PI * 1.4);
        g.stroke();

        // the stomach: a red-orange cross (four lobes) with a glow, a tube down to the rim
        const sc = view === 'top' ? [0, 0] : [0, -bh * 0.25];
        putGlow(g, R, sc[0], sc[1], size * 0.42, 0.55);
        g.fillStyle = 'rgba(255,75,55,0.85)';
        for (let k = 0; k < 4; k++) {
            const a = (k / 4) * TAU + Math.PI / 4 + (view === 'top' ? 0 : 0.2);
            const lx = sc[0] + Math.cos(a) * size * 0.08, ly = sc[1] + Math.sin(a) * size * (view === 'top' ? 0.08 : 0.05);
            g.beginPath();
            g.ellipse(lx, ly, size * 0.085, size * 0.055, a, 0, TAU);
            g.fill();
        }
        g.fillStyle = 'rgba(255,170,140,0.7)';
        g.beginPath();
        g.ellipse(sc[0], sc[1], size * 0.05, size * 0.05, 0, 0, TAU);
        g.fill();
        if (view !== 'top') {
            g.strokeStyle = 'rgba(255,190,170,0.55)';
            g.lineWidth = Math.max(1, size * 0.03);
            g.beginPath();
            g.moveTo(0, sc[1] + size * 0.05);
            g.quadraticCurveTo(size * 0.02 * Math.sin(t * 2), bh * 0.2, 0, bh * 0.4);
            g.stroke();
        }

        // the bright rim, beaded with tentacle bulbs
        g.strokeStyle = 'rgba(240,248,255,0.85)';
        g.lineWidth = Math.max(1.5, size * 0.022);
        g.beginPath();
        for (let k = 0; k <= 60; k++) {
            const p = ring((k / 60) * TAU);
            if (k) g.lineTo(p[0], p[1]);
            else g.moveTo(p[0], p[1]);
        }
        g.stroke();
        for (let k = 0; k < 48; k++) {
            const p = ring((k / 48) * TAU);
            putGlow(g, W, p[0], p[1], size * 0.03, 0.8);
        }
        g.restore();
    }

    return { draw };
})();
