// Cinematic-facts kit: the documentary-explainer look of fact Shorts — a deep graded scene,
// light shafts, drifting particles in depth of field, bold two-line captions (a small white
// line over a big coloured one, top-left), photo cutouts with a torn white edge, a vignette
// and film grain. Global: Cine. Depends on engine/core.js.
//
// Speed: everything soft is blurred ONCE and reused. Live canvas `filter: blur()` costs
// seconds a frame at 1080 on a machine without a GPU; here particles are pre-blurred dot
// sprites, out-of-focus pieces come from `blurred()`, and the sea, the vignette and the grain
// are cached. Captions use Anton (fonts/Anton-Regular.ttf, OFL): declare it in the scene.
const Cine = (() => {
    const TAU = Math.PI * 2;

    /** The sea (or any deep backdrop): a vertical grade and a bright patch at the surface. */
    function sea(g, env, o = {}) {
        const { top = '#0f4a66', mid = '#082c43', bottom = '#020b14', sun = [560, -120], key = 'sea' } = o;
        Motion.sprite('cine:sea:' + key + env.W + 'x' + env.H, { x: 0, y: 0, w: env.W, h: env.H }, env.k, (c) => {
            const gr = c.createLinearGradient(0, 0, 0, env.H);
            gr.addColorStop(0, top);
            gr.addColorStop(0.35, mid);
            gr.addColorStop(1, bottom);
            c.fillStyle = gr;
            c.fillRect(0, 0, env.W, env.H);
            const s = c.createRadialGradient(sun[0], sun[1], 20, sun[0], sun[1], env.W * 0.8);
            s.addColorStop(0, 'rgba(150,230,255,0.45)');
            s.addColorStop(1, 'rgba(150,230,255,0)');
            c.fillStyle = s;
            c.fillRect(0, 0, env.W, env.H);
        }).draw(g);
    }

    /** Light shafts from the surface, swaying (additive). */
    function rays(g, t, o = {}) {
        const { n = 7, x0 = 120, step = 120, len = 1300, alpha = 0.1, seed = 'ray' } = o;
        g.save();
        g.globalCompositeOperation = 'lighter';
        for (let i = 0; i < n; i++) {
            const r = Motion.rng(seed + i);
            const x = x0 + i * step + Math.sin(t * 0.5 + i * 1.7) * 40, w = 40 + r() * 70, a = -0.18 + r() * 0.12;
            const gr = g.createLinearGradient(0, -100, 0, len);
            gr.addColorStop(0, `rgba(160,235,255,${alpha + 0.05 * Math.sin(t * 0.8 + i)})`);
            gr.addColorStop(1, 'rgba(160,235,255,0)');
            g.fillStyle = gr;
            g.beginPath();
            g.moveTo(x - w * 0.3, -100);
            g.lineTo(x + w * 0.3, -100);
            g.lineTo(x + w + Math.sin(a) * len, len);
            g.lineTo(x - w + Math.sin(a) * len, len);
            g.closePath();
            g.fill();
        }
        g.restore();
    }

    // a soft dot, blurred once at output resolution and reused by every particle of its size
    function dotSprite(env, r, blur, color) {
        const R = r + blur * 2 + 2;
        return Motion.sprite('cine:dot:' + r + ':' + blur + ':' + color, { x: -R, y: -R, w: 2 * R, h: 2 * R }, env.k, (c) => {
            if (blur > 0) c.filter = `blur(${blur * env.k}px)`;
            c.fillStyle = color;
            c.beginPath();
            c.arc(0, 0, r, 0, TAU);
            c.fill();
        });
    }

    /**
     * Drifting particles (marine snow, dust, embers): n of them, radius ~size, blurred by
     * `blur` (depth of field), rising at `speed` (negative = sinking). Cheap at any blur.
     */
    function particles(g, env, t, o = {}) {
        const { n = 60, size = 2, blur = 0, alpha = 0.3, speed = 8, seed = 'snow', color = '200,240,255' } = o;
        const sizes = [0.6, 1, 1.5].map((k) => Math.max(0.5, Math.round(size * k * 2) / 2));
        const sp = sizes.map((s) => dotSprite(env, s, blur, `rgba(${color},${alpha})`));
        const r = Motion.rng(seed);
        for (let i = 0; i < n; i++) {
            const x0 = r() * env.W, y0 = r() * env.H, k = Math.floor(r() * 3), ph = r() * TAU;
            const x = (((x0 + Math.sin(t * 0.4 + ph) * 18 + t * 4) % env.W) + env.W) % env.W;
            const y = (((y0 - t * speed) % env.H) + env.H) % env.H;
            const s = sp[k];
            g.drawImage(s.canvas, x + s.box.x, y + s.box.y, s.box.w, s.box.h);
        }
    }

    /** A blurred copy of a canvas (an out-of-focus layer), made once per key. */
    const blurCache = new Map();
    function blurred(key, src, blurPx) {
        if (!blurCache.has(key)) {
            const c = document.createElement('canvas');
            const pad = Math.ceil(blurPx * 3);
            c.width = src.width + pad * 2;
            c.height = src.height + pad * 2;
            const x = c.getContext('2d');
            x.filter = `blur(${blurPx}px)`;
            x.drawImage(src, pad, pad);
            blurCache.set(key, { canvas: c, pad });
        }
        return blurCache.get(key);
    }

    /**
     * A photo cut out along a traced outline (photo pixels) and glued on a torn white paper
     * edge with a soft shadow: a collage piece. Cached; returns the sprite, drawn centred on
     * (0, 0) in photo units — scale it with the context.
     */
    function cutout(env, key, img, f, o = {}) {
        const { edge = 9, res = 1.4 } = o;
        const box = { x: -f.w / 2 - 40, y: -f.h / 2 - 40, w: f.w + 80, h: f.h + 80 };
        return Motion.sprite('cine:cut:' + key + (img ? '' : ':none'), box, env.k * res, (c) => {
            c.translate(-f.w / 2, -f.h / 2);
            const P = f.poly, n = P.length;
            const cx = P.reduce((s, p) => s + p[0], 0) / n, cy = P.reduce((s, p) => s + p[1], 0) / n;
            // the torn edge: the outline resampled, pushed out by `edge` with a ragged wobble
            const torn = [];
            for (let i = 0; i < n; i++) {
                const a = P[i], b = P[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.round(L / 5));
                for (let k = 0; k < m; k++) {
                    const u = k / m, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
                    const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1;
                    const e = edge + Motion.noise1(key + 'edge', torn.length * 0.35) * edge * 0.45 + Motion.noise1(key + 'fine', torn.length * 2.1) * 1.4;
                    torn.push([x + (dx / l) * e, y + (dy / l) * e]);
                }
            }
            const trace = (pts) => {
                c.beginPath();
                pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
                c.closePath();
            };
            c.save();
            c.translate(4, 7);
            c.filter = `blur(${6 * env.k * res}px)`;
            c.fillStyle = 'rgba(0,0,0,0.55)';
            trace(torn);
            c.fill();
            c.restore();
            c.fillStyle = '#f7f3ea';
            trace(torn);
            c.fill();
            c.save();
            trace(P);
            c.clip();
            if (img) c.drawImage(img, 0, 0, f.w, f.h);
            else {
                c.fillStyle = '#10161c';
                c.fillRect(0, 0, f.w, f.h);
            }
            c.restore();
        });
    }

    /** A vignette over the whole frame (cached). */
    function vignette(g, env, amount = 0.7) {
        Motion.sprite('cine:vig:' + amount + env.W + 'x' + env.H, { x: 0, y: 0, w: env.W, h: env.H }, env.k * 0.5, (c) => {
            const vg = c.createRadialGradient(env.W / 2, env.H * 0.49, env.W * 0.33, env.W / 2, env.H * 0.51, env.H * 0.66);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, `rgba(0,0,0,${amount})`);
            c.fillStyle = vg;
            c.fillRect(0, 0, env.W, env.H);
        }).draw(g);
    }

    /**
     * A caption: a small white line over a big coloured one, top-left, glowing, sliding in.
     * Both lines shrink to fit `maxW`.
     */
    function caption(g, t, a, b, top, bottom, color, o = {}) {
        if (t < a || t >= b) return;
        const { x = 60, y = 300, topSize = 78, size = 138, maxW = 780, font = 'Anton' } = o;
        const inU = Ease.out(Ease.seg(t, a, a + 0.25)), outU = Ease.seg(t, b - 0.2, b);
        g.save();
        g.globalAlpha = inU * (1 - outU);
        g.translate(x - (1 - inU) * 30, 0);
        g.textAlign = 'left';
        const fit = (txt, s) => {
            g.font = `${s}px "${font}"`;
            const w = g.measureText(txt).width;
            return w > maxW ? (s * maxW) / w : s;
        };
        const s1 = fit(top, topSize), s2 = fit(bottom, size);
        g.shadowColor = 'rgba(0,0,0,0.6)';
        g.shadowBlur = 18;
        g.shadowOffsetY = 4;
        g.font = `${s1}px "${font}"`;
        g.fillStyle = '#f5f2ea';
        g.fillText(top, 0, y);
        g.font = `${s2}px "${font}"`;
        g.shadowColor = color;
        g.shadowBlur = 26;
        g.shadowOffsetY = 0;
        g.fillStyle = color;
        g.fillText(bottom, 0, y + s2 * 0.94);
        g.restore();
    }

    /** Film grain from post(): one of four cached noise tiles per frame. */
    let tiles = null;
    function grain(ctx, env, t, fps = 24, alpha = 22) {
        if (!tiles)
            tiles = Array.from({ length: 4 }, (_, k) => {
                const c = document.createElement('canvas');
                c.width = c.height = 256;
                const x = c.getContext('2d'), img = x.createImageData(256, 256), r = Motion.rng('grain' + k);
                for (let i = 0; i < img.data.length; i += 4) {
                    const v = r() * 255;
                    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
                    img.data[i + 3] = alpha;
                }
                x.putImageData(img, 0, 0);
                return c;
            });
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = ctx.createPattern(tiles[Math.floor(t * fps) % 4], 'repeat');
        ctx.fillRect(0, 0, env.px[0], env.px[1]);
        ctx.restore();
    }

    /** Load images in setup() (missing files come back as null: draw a fallback). */
    const load = (src) =>
        new Promise((res) => {
            const im = new Image();
            im.onload = () => res(im);
            im.onerror = () => res(null);
            im.src = '/' + src;
        });

    return { TAU, sea, rays, particles, dotSprite, blurred, cutout, vignette, caption, grain, load };
})();
