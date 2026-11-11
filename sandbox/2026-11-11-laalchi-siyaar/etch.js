// laalchi-siyaar · an etching kit: an old book plate drawn with a burin — every form an inked
// contour filled with parallel hatching (cross-hatching in the shadows), on yellowed, foxed
// paper inside a plate mark. 2D canvas. Global: Etch. Deterministic: seeds name the pieces.
//
// The engraver's grammar: tone is line density, never grey fill; light comes from the upper
// left, so the lower right of every form gets a second (cross) layer; the paper shows through
// everywhere; contours are a little heavier on the shadow side.
const Etch = (() => {
    const INK = '#2a1e14', PAPER = '#ebdec2', PAPER_DARK = '#d9c8a3';
    const TAU = Math.PI * 2;

    // closed Catmull-Rom through pts → a smooth outline
    function smooth(pts, closed = true, seg = 6) {
        const n = pts.length, out = [];
        const P = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
        const last = closed ? n : n - 1;
        for (let i = 0; i < last; i++) {
            const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
            for (let k = 0; k < seg; k++) {
                const t = k / seg, t2 = t * t, t3 = t2 * t;
                out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
            }
        }
        if (!closed) out.push(pts[n - 1]);
        return out;
    }
    const pathOf = (pts, closed = true) => {
        const p = new Path2D();
        pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
        if (closed) p.closePath();
        return p;
    };
    const bbox = (pts) => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const [x, y] of pts) (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
        return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
    };

    /**
     * Parallel engraved lines at `angle` across box b, clipped by the current clip. spacing in
     * units; each line wavers a little (seeded) and swells in the middle like a burin cut.
     */
    function lines(g, b, angle, spacing, lw, seed, alpha = 0.9) {
        const dx = Math.cos(angle), dy = Math.sin(angle), nx = -dy, ny = dx;
        const corners = [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]];
        const pr = corners.map(([x, y]) => x * nx + y * ny), along = corners.map(([x, y]) => x * dx + y * dy);
        const n0 = Math.min(...pr), n1 = Math.max(...pr), a0 = Math.min(...along) - 4, a1 = Math.max(...along) + 4;
        const path = new Path2D();
        let k = 0;
        for (let o = n0 + spacing * 0.5; o < n1; o += spacing, k++) {
            const steps = Math.max(2, Math.ceil((a1 - a0) / 40));
            for (let s = 0; s <= steps; s++) {
                const a = a0 + ((a1 - a0) * s) / steps;
                const wv = Motion.noise1(seed + k, s * 0.7) * spacing * 0.12;
                const x = dx * a + nx * (o + wv), y = dy * a + ny * (o + wv);
                if (s === 0) path.moveTo(x, y);
                else path.lineTo(x, y);
            }
        }
        g.save();
        g.strokeStyle = INK;
        g.globalAlpha = alpha;
        g.lineWidth = lw;
        g.lineCap = 'round';
        g.stroke(path);
        g.restore();
    }

    /**
     * An engraved form: knocked out to paper, hatched to `tone` (0 bare paper … 1 near black)
     * at `angle`, a cross layer in its shadow side (the lower right), then its contour.
     * o: tone, angle, spacing, shade (extra tone in the shadow), lw (contour width), seed,
     * raw (pts already smooth), paper (fill colour), noFill.
     */
    function form(g, pts, o = {}) {
        const P = o.raw ? pts : smooth(pts, true, 5);
        const path = pathOf(P);
        const b = bbox(P);
        const tone = o.tone ?? 0.4, angle = o.angle ?? -0.75, sp = o.spacing ?? 5.5, seed = o.seed ?? 'f';
        if (!o.noFill) {
            g.fillStyle = o.paper ?? PAPER;
            g.fill(path);
        }
        g.save();
        g.clip(path);
        const lw = o.hatchW ?? 1.05;
        if (tone > 0.05) lines(g, b, angle, sp / Math.max(0.35, tone), lw, seed + 'a');
        if (tone > 0.55) lines(g, b, angle + 1.15, (sp * 1.3) / Math.max(0.35, tone - 0.3), lw, seed + 'b');
        if (tone > 0.85) lines(g, b, angle - 0.5, sp * 1.1, lw, seed + 'c');
        // the shadow side: a cross layer in the lower-right part of the form
        const sh = o.shade ?? 0.5;
        if (sh > 0) {
            const cut = new Path2D();
            const k = 0.15;
            cut.moveTo(b.x0 + b.w * (0.2 - k), b.y1 + 20);
            cut.lineTo(b.x1 + 20, b.y0 + b.h * (0.25 - k));
            cut.lineTo(b.x1 + 40, b.y1 + 40);
            cut.closePath();
            g.clip(cut);
            lines(g, b, angle + 1.2, sp / Math.max(0.3, sh), lw, seed + 's');
        }
        g.restore();
        if ((o.lw ?? 2.4) > 0) {
            g.save();
            g.strokeStyle = INK;
            g.lineWidth = o.lw ?? 2.4;
            g.lineJoin = 'round';
            g.stroke(path);
            g.restore();
        }
        return path;
    }

    /** An engraved stroke (open line), slightly swelling in the middle. */
    function stroke(g, pts, w = 2, o = {}) {
        const P = o.raw ? pts : smooth(pts, false, 6);
        g.save();
        g.strokeStyle = o.color ?? INK;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        for (let i = 1; i < P.length; i++) {
            const u = i / P.length;
            g.lineWidth = w * (o.taper === false ? 1 : 0.55 + 0.9 * Math.sin(u * Math.PI));
            g.beginPath();
            g.moveTo(P[i - 1][0], P[i - 1][1]);
            g.lineTo(P[i][0], P[i][1]);
            g.stroke();
        }
        g.restore();
    }

    /** A tapered limb from a to b (widths wa, wb), engraved like a form. */
    function limb(g, a, b, wa, wb, o = {}) {
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
        const pts = [
            [a[0] + nx * wa / 2, a[1] + ny * wa / 2], [b[0] + nx * wb / 2, b[1] + ny * wb / 2],
            [b[0] + dx / l * wb * 0.4, b[1] + dy / l * wb * 0.4],
            [b[0] - nx * wb / 2, b[1] - ny * wb / 2], [a[0] - nx * wa / 2, a[1] - ny * wa / 2],
            [a[0] - dx / l * wa * 0.4, a[1] - dy / l * wa * 0.4],
        ];
        return form(g, pts, { angle: Math.atan2(dy, dx) + Math.PI / 2 - 0.3, ...o });
    }

    function dot(g, x, y, r, color = INK) {
        g.save();
        g.fillStyle = color;
        g.beginPath();
        g.arc(x, y, r, 0, TAU);
        g.fill();
        g.restore();
    }

    /** Aged paper with foxing and a plate mark (cached), covering the whole frame. */
    function paper(g, env, plate) {
        Motion.sprite('etch:paper' + env.W + 'x' + env.H, { x: 0, y: 0, w: env.W, h: env.H }, env.k, (c) => {
            c.fillStyle = PAPER;
            c.fillRect(0, 0, env.W, env.H);
            const r = Motion.rng('paper');
            for (let i = 0; i < 26; i++) {
                const x = r() * env.W, y = r() * env.H, rad = 120 + r() * 300;
                const gr = c.createRadialGradient(x, y, 0, x, y, rad);
                gr.addColorStop(0, `rgba(150,110,60,${0.03 + r() * 0.04})`);
                gr.addColorStop(1, 'rgba(150,110,60,0)');
                c.fillStyle = gr;
                c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
            }
            // foxing: small rust spots
            for (let i = 0; i < 70; i++) {
                c.fillStyle = `rgba(140,85,40,${0.08 + r() * 0.18})`;
                c.beginPath();
                c.arc(r() * env.W, r() * env.H, 0.6 + r() * r() * 4, 0, TAU);
                c.fill();
            }
            // edges browned
            const e = c.createLinearGradient(0, 0, env.W, 0);
            e.addColorStop(0, 'rgba(120,85,40,0.16)');
            e.addColorStop(0.08, 'rgba(120,85,40,0)');
            e.addColorStop(0.92, 'rgba(120,85,40,0)');
            e.addColorStop(1, 'rgba(120,85,40,0.16)');
            c.fillStyle = e;
            c.fillRect(0, 0, env.W, env.H);
            // the plate mark: a pressed rectangle, a shade darker inside
            c.fillStyle = 'rgba(160,125,70,0.08)';
            c.fillRect(plate.x - 22, plate.y - 22, plate.w + 44, plate.h + 44);
            c.strokeStyle = 'rgba(110,80,40,0.35)';
            c.lineWidth = 2;
            c.strokeRect(plate.x - 22, plate.y - 22, plate.w + 44, plate.h + 44);
        }).draw(g);
    }

    /** The neat lines round the image: a heavy rule and a thin one outside it. */
    function neat(g, plate) {
        g.save();
        g.strokeStyle = INK;
        g.lineWidth = 3;
        g.strokeRect(plate.x, plate.y, plate.w, plate.h);
        g.lineWidth = 1;
        g.strokeRect(plate.x - 8, plate.y - 8, plate.w + 16, plate.h + 16);
        g.restore();
    }

    /** Impact: short engraved rays out of (x, y); u 0..1 grows then fades them. */
    function impact(g, x, y, r, u, seed = 'imp') {
        if (u <= 0 || u >= 1) return;
        const rr = Motion.rng(seed), grow = Ease.out(Ease.seg(u, 0, 0.3)), fade = 1 - Ease.seg(u, 0.5, 1);
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * TAU + rr() * 0.3, r0 = r * 0.35 * grow, r1 = r * (0.7 + rr() * 0.6) * grow;
            g.save();
            g.globalAlpha = fade;
            stroke(g, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], 3, { raw: true });
            g.restore();
        }
    }

    /** A dust cloud of engraved scallops rising from (x, y); u 0..1. */
    function dust(g, x, y, w, u, seed = 'dust') {
        if (u <= 0 || u >= 1) return;
        const r = Motion.rng(seed);
        for (let i = 0; i < 6; i++) {
            const cx = x + (r() - 0.5) * w * (0.6 + u), cy = y - 10 - u * 40 * r(), rad = (12 + r() * 16) * (0.5 + u);
            g.save();
            g.globalAlpha = 1 - u;
            form(g, Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * TAU; return [cx + Math.cos(a) * rad * (1 + 0.15 * Math.sin(a * 3 + i)), cy + Math.sin(a) * rad * 0.6]; }), { tone: 0.2, shade: 0, lw: 1.4, seed: seed + i, raw: false });
            g.restore();
        }
    }

    /** A five-pointed engraved star (the daze). */
    function star(g, x, y, r, seed) {
        const pts = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU - Math.PI / 2; const rr = i % 2 ? r * 0.42 : r; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
        form(g, pts, { tone: 0.25, shade: 0, lw: 1.6, seed, raw: true });
    }

    /** Paper grain over everything, from post(): fine specks (cached). */
    let grainC = null;
    function grain(ctx, env, amount = 0.5) {
        const [w, h] = env.px;
        if (!grainC || grainC.width !== w) {
            grainC = document.createElement('canvas');
            grainC.width = w;
            grainC.height = h;
            const c = grainC.getContext('2d'), r = Motion.rng('grain');
            for (let i = 0; i < (w * h) / 300; i++) {
                c.fillStyle = r() < 0.5 ? 'rgba(90,60,30,0.18)' : 'rgba(255,245,220,0.25)';
                c.fillRect(r() * w, r() * h, 1 + r(), 1 + r());
            }
        }
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = amount;
        ctx.drawImage(grainC, 0, 0);
        ctx.restore();
    }

    return { INK, PAPER, PAPER_DARK, TAU, smooth, pathOf, bbox, lines, form, stroke, limb, dot, paper, neat, impact, dust, star, grain };
})();
