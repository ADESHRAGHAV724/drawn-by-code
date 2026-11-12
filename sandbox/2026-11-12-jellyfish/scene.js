// jellyfish: a 10 s «cinematic facts» Short (9:16): a glowing moon jelly pulsing up through
// a deep, dark sea — light shafts from the surface, drifting marine snow with depth of field,
// two far jellies out of focus — and bold condensed captions top-left, two lines each (a
// small white one, a big coloured one), as in the documentary-explainer Shorts the user
// showed. All of it painted in code; a slow push-in, a warm-to-cold grade, grain, vignette.
Motion.scene({
    fps: 24,
    duration: 10,
    logical: [900, 1600],
    fonts: [{ family: 'Anton', src: 'fonts/Anton-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [[0, 3.3, 'No brain'], [3.3, 6.6, '95% water'], [6.6, 10, '500 million years']],

    draw(g, t, env) {
        const E = Ease, TAU = Math.PI * 2;
        const W = 900, H = 1600;
        const rng = Motion.rng;

        // --- the sea: a deep gradient, light from the surface ---------------------------------
        const sea = g.createLinearGradient(0, 0, 0, H);
        sea.addColorStop(0, '#0f4a66');
        sea.addColorStop(0.35, '#082c43');
        sea.addColorStop(1, '#020b14');
        g.fillStyle = sea;
        g.fillRect(0, 0, W, H);
        // a bright patch where the surface is
        const sun = g.createRadialGradient(560, -120, 20, 560, -120, 700);
        sun.addColorStop(0, 'rgba(150,230,255,0.45)');
        sun.addColorStop(1, 'rgba(150,230,255,0)');
        g.fillStyle = sun;
        g.fillRect(0, 0, W, H);

        // a slow push-in for the whole shot (Ken Burns)
        const z = 1 + 0.1 * E.inOut(t / 10);
        g.save();
        g.translate(450, 760);
        g.scale(z, z);
        g.translate(-450 - 10 * Math.sin(t * 0.3), -760);

        // light shafts swaying from the surface
        g.save();
        g.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 7; i++) {
            const r = rng('ray' + i);
            const x = 120 + i * 120 + Math.sin(t * 0.5 + i * 1.7) * 40, w = 40 + r() * 70, a = -0.18 + r() * 0.12;
            const gr = g.createLinearGradient(0, -100, 0, 1200);
            gr.addColorStop(0, `rgba(160,235,255,${0.10 + 0.05 * Math.sin(t * 0.8 + i)})`);
            gr.addColorStop(1, 'rgba(160,235,255,0)');
            g.fillStyle = gr;
            g.beginPath();
            g.moveTo(x - w * 0.3, -100);
            g.lineTo(x + w * 0.3, -100);
            g.lineTo(x + w + Math.sin(a) * 1300, 1200);
            g.lineTo(x - w + Math.sin(a) * 1300, 1200);
            g.closePath();
            g.fill();
        }
        g.restore();

        // marine snow: three depths, the far ones small and sharp-ish, the near ones big, soft
        const snow = (n, size, blur, alpha, speed, seed) => {
            g.save();
            if (blur) g.filter = `blur(${blur}px)`;
            g.fillStyle = `rgba(200,240,255,${alpha})`;
            const r = rng(seed);
            for (let i = 0; i < n; i++) {
                const x0 = r() * W, y0 = r() * H, s = size * (0.5 + r()), ph = r() * TAU;
                const x = (x0 + Math.sin(t * 0.4 + ph) * 18 + t * 4) % W, y = (((y0 - t * speed) % H) + H) % H;
                g.beginPath();
                g.arc(x, y, s, 0, TAU);
                g.fill();
            }
            g.restore();
        };
        snow(90, 1.4, 0, 0.35, 6, 'snowFar');
        snow(40, 2.6, 1.5, 0.3, 12, 'snowMid');

        // --- jellyfish ------------------------------------------------------------------------
        // pulse: a quick contraction then a slow relax, every 1.7 s; it rises on each beat
        const jelly = (cx, cy0, s, t0, hue, seed, glow = 1) => {
            const P = 1.7, ph = (((t + t0) % P) + P) % P / P;
            const c = ph < 0.3 ? Math.sin((ph / 0.3) * Math.PI / 2) : Math.cos(((ph - 0.3) / 0.7) * Math.PI / 2);
            const beats = Math.floor((t + t0) / P) + E.out(Math.min(1, ph / 0.45));
            const cy = cy0 - beats * 22 * s;
            const bw = 150 * s * (1 - 0.13 * c), bh = 135 * s * (1 + 0.1 * c);
            const col = (a, l = 70) => `hsla(${hue},85%,${l}%,${a})`;
            g.save();
            g.translate(cx + Math.sin(t * 0.6 + t0) * 12 * s, cy);
            g.rotate(Math.sin(t * 0.5 + t0) * 0.06);
            g.globalCompositeOperation = 'lighter';
            // tentacles: thin threads trailing down, a wave running along them
            const n = 18;
            for (let i = 0; i < n; i++) {
                const u = i / (n - 1), x0 = (u - 0.5) * 2 * bw * 0.95, len = (520 + rng(seed + i)() * 260) * s;
                g.strokeStyle = col(0.22 * glow, 75);
                g.lineWidth = 1.6 * s;
                g.beginPath();
                g.moveTo(x0, 4 * s);
                for (let k = 1; k <= 24; k++) {
                    const v = k / 24, yy = 4 * s + v * len;
                    const xx = x0 * (1 - v * 0.35) + Math.sin(v * 7 - (t + t0) * 3 + i) * 18 * s * v + Math.sin(v * 3 + (t + t0) * 0.7) * 30 * s * v * v;
                    g.lineTo(xx, yy);
                }
                g.stroke();
            }
            // oral arms: four ruffled ribbons from the middle
            for (let i = 0; i < 4; i++) {
                const x0 = (i - 1.5) * 26 * s, len = 300 * s;
                g.fillStyle = col(0.08 * glow, 80);
                g.strokeStyle = col(0.25 * glow, 82);
                g.lineWidth = 1.2 * s;
                g.beginPath();
                const L = [], Rr = [];
                for (let k = 0; k <= 20; k++) {
                    const v = k / 20, yy = 10 * s + v * len, sw = Math.sin(v * 5 - (t + t0) * 2.2 + i * 1.3) * 22 * s * v;
                    const wdt = (14 + Math.sin(v * 24 + i) * 6) * s * (1 - v * 0.6);
                    L.push([x0 + sw - wdt, yy]);
                    Rr.push([x0 + sw + wdt, yy]);
                }
                [...L, ...Rr.reverse()].forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));
                g.closePath();
                g.fill();
                g.stroke();
            }
            // the bell: a translucent dome with a scalloped rim, glowing at the edge
            const bell = new Path2D();
            const rimN = 16;
            bell.moveTo(-bw, 0);
            for (let k = 0; k <= 40; k++) {
                // a fuller dome than a half ellipse (a superellipse), the rim curling in a little
                const a = Math.PI + (k / 40) * Math.PI, sy = Math.sin(a);
                bell.lineTo(Math.cos(a) * bw * (1 - 0.06 * (1 + sy)), -Math.pow(Math.abs(sy), 0.7) * bh);
            }
            for (let k = 0; k <= rimN; k++) {
                const x = bw - (k / rimN) * 2 * bw;
                bell.quadraticCurveTo(x + bw / rimN, 14 * s * (1 + 0.5 * c), x, 2 * s);
            }
            bell.closePath();
            const fill = g.createRadialGradient(0, -bh * 0.55, 10 * s, 0, -bh * 0.2, bw * 1.1);
            fill.addColorStop(0, col(0.55 * glow, 85));
            fill.addColorStop(0.5, col(0.22 * glow, 65));
            fill.addColorStop(1, col(0.06 * glow, 55));
            g.fillStyle = fill;
            g.fill(bell);
            g.strokeStyle = col(0.7 * glow, 85);
            g.lineWidth = 2.5 * s;
            g.shadowColor = col(0.9, 70);
            g.shadowBlur = 30 * s;
            g.stroke(bell);
            g.shadowBlur = 0;
            // radial canals and the four horseshoe gonads of a moon jelly
            g.strokeStyle = col(0.18 * glow, 85);
            g.lineWidth = 1.2 * s;
            for (let k = 0; k < 12; k++) {
                const a = Math.PI + ((k + 0.5) / 12) * Math.PI;
                g.beginPath();
                g.moveTo(0, -bh * 0.3);
                g.lineTo(Math.cos(a) * bw * 0.95, Math.sin(a) * bh * 0.95);
                g.stroke();
            }
            for (let k = 0; k < 4; k++) {
                const a = -Math.PI / 2 + (k - 1.5) * 0.55;
                g.strokeStyle = col(0.5 * glow, 80);
                g.lineWidth = 7 * s;
                g.beginPath();
                g.arc(Math.cos(a) * bw * 0.32, -bh * 0.38 + Math.sin(a) * bh * 0.12, 18 * s, 0.3 + a, 0.3 + a + Math.PI * 1.3);
                g.stroke();
            }
            g.restore();
        };
        // two far jellies, out of focus, then the hero
        g.save();
        g.filter = 'blur(5px)';
        jelly(170, 1250, 0.38, 0.9, 200, 'far1', 0.6);
        jelly(760, 1500, 0.3, 0.4, 280, 'far2', 0.6);
        g.restore();
        jelly(460, 1000, 1.3, 0, 300, 'hero');

        // near marine snow, big and soft, in front
        snow(10, 9, 6, 0.18, 30, 'snowNear');
        g.restore();

        // --- grade: a vignette ------------------------------------------------------------------
        const vg = g.createRadialGradient(450, 780, 300, 450, 820, 1050);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(0,0,0,0.7)');
        g.fillStyle = vg;
        g.fillRect(0, 0, W, H);

        // --- captions: two lines, white then coloured, glowing, top-left -----------------------
        const caption = (a, b, top, bottom, col) => {
            if (t < a || t >= b) return;
            const inU = E.out(E.seg(t, a, a + 0.25)), outU = E.seg(t, b - 0.2, b);
            const alpha = inU * (1 - outU);
            g.save();
            g.globalAlpha = alpha;
            g.translate(60 - (1 - inU) * 30, 0);
            g.textAlign = 'left';
            g.shadowColor = 'rgba(0,0,0,0.6)';
            g.shadowBlur = 18;
            g.shadowOffsetY = 4;
            g.font = '78px "Anton"';
            g.fillStyle = '#f5f2ea';
            g.fillText(top, 0, 300);
            g.font = '138px "Anton"';
            g.shadowColor = col;
            g.shadowBlur = 26;
            g.shadowOffsetY = 0;
            g.fillStyle = col;
            g.fillText(bottom, 0, 430);
            g.restore();
        };
        caption(0.2, 3.3, 'NO BRAIN.', 'NO HEART.', '#5ee6ff');
        caption(3.4, 6.6, 'MADE OF', '95% WATER', '#ffc93d');
        caption(6.7, 10.0, '500 MILLION', 'YEARS OLD', '#ff6b3d');
    },

    post(ctx, t, env) {
        // film grain: one of four cached noise tiles per frame (deterministic)
        const [w, h] = env.px;
        const tiles = (globalThis.__jellyGrain ??= Array.from({ length: 4 }, (_, k) => {
            const c = document.createElement('canvas');
            c.width = 256;
            c.height = 256;
            const x = c.getContext('2d'), img = x.createImageData(256, 256), r = Motion.rng('grain' + k);
            for (let i = 0; i < img.data.length; i += 4) {
                const v = r() * 255;
                img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
                img.data[i + 3] = 22;
            }
            x.putImageData(img, 0, 0);
            return c;
        }));
        const tile = tiles[Math.floor(t * 24) % 4];
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = ctx.createPattern(tile, 'repeat');
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    },
});
