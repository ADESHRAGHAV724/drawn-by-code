// Cinematic-facts · lab props for the «field notebook» look, painted in code with light from
// the top left: a yellow Geiger counter (an analogue meter whose needle you drive, a coiled
// cord, a round probe), a wooden artist's mannequin (ball joints, wood grain), red radiation
// squiggles that draw themselves across the page, and a glass micro-needle.
// Global: Props. Static bodies are cached sprites; only needles and lines draw per frame.
const Props = (() => {
    const TAU = Math.PI * 2;

    function rrect(c, x, y, w, h, r) {
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }

    // soft shadow drawn once into a sprite (blur is fine there)
    function softShadow(c, env, draw, blur, alpha) {
        c.save();
        c.filter = `blur(${blur * env.k}px)`;
        c.fillStyle = `rgba(40,25,8,${alpha})`;
        draw();
        c.fill();
        c.restore();
    }

    // ---- Geiger counter -------------------------------------------------------------
    // origin at the body's centre; the body is 300 × 460; the meter's pivot is at (0, -62)
    const GW = 300, GH = 460, PIV = [0, -62];
    function geigerBody(env) {
        return Motion.sprite('props:geiger', { x: -200, y: -260, w: 400, h: 540 }, env.k * 1.5, (c) => {
            softShadow(c, env, () => rrect(c, -GW / 2 + 14, -GH / 2 + 22, GW, GH, 44), 14, 0.55);
            // the yellow shell: a vertical-ish gradient, a lit bevel, a dark lower rim
            rrect(c, -GW / 2, -GH / 2, GW, GH, 44);
            const gr = c.createLinearGradient(-GW / 2, -GH / 2, GW / 2, GH / 2);
            gr.addColorStop(0, '#ffdc5a');
            gr.addColorStop(0.45, '#f4c22c');
            gr.addColorStop(1, '#c99212');
            c.fillStyle = gr;
            c.fill();
            c.save();
            rrect(c, -GW / 2, -GH / 2, GW, GH, 44);
            c.clip();
            // plastic sheen: a broad soft highlight on the upper left
            c.filter = `blur(${18 * env.k}px)`;
            c.fillStyle = 'rgba(255,250,215,0.45)';
            c.beginPath();
            c.ellipse(-70, -150, 70, 150, -0.2, 0, TAU);
            c.fill();
            c.filter = 'none';
            // the rim: dark on the right and bottom edges
            c.lineWidth = 14;
            c.strokeStyle = 'rgba(150,95,5,0.35)';
            rrect(c, -GW / 2 + 4, -GH / 2 + 6, GW, GH, 44);
            c.stroke();
            c.restore();
            c.lineWidth = 2.5;
            c.strokeStyle = 'rgba(255,240,170,0.8)';
            rrect(c, -GW / 2 + 2, -GH / 2 + 2, GW - 4, GH - 4, 42);
            c.stroke();
            // the meter window: a black bezel, a cream dial
            rrect(c, -122, -200, 244, 180, 16);
            c.fillStyle = '#1d1b19';
            c.fill();
            c.lineWidth = 3;
            c.strokeStyle = 'rgba(255,255,255,0.12)';
            c.stroke();
            rrect(c, -106, -186, 212, 150, 8);
            const dg = c.createRadialGradient(-20, -140, 10, 0, -110, 170);
            dg.addColorStop(0, '#f6efdc');
            dg.addColorStop(1, '#d9ccad');
            c.fillStyle = dg;
            c.fill();
            // the scale: an arc of ticks, a red zone at the top end, numbers
            c.save();
            c.translate(PIV[0], PIV[1]);
            const A0 = -Math.PI * 0.82, A1 = -Math.PI * 0.18, R = 98;
            c.lineWidth = 2;
            c.strokeStyle = '#2b2620';
            c.beginPath();
            c.arc(0, 0, R, A0, A1);
            c.stroke();
            c.lineWidth = 7;
            c.strokeStyle = '#c4321f';
            c.beginPath();
            c.arc(0, 0, R + 4, A0 + (A1 - A0) * 0.75, A1);
            c.stroke();
            for (let i = 0; i <= 40; i++) {
                const a = A0 + ((A1 - A0) * i) / 40, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 11 : 6;
                c.lineWidth = i % 10 === 0 ? 2 : 1.2;
                c.strokeStyle = i > 30 ? '#a52a18' : '#2b2620';
                c.beginPath();
                c.moveTo(Math.cos(a) * R, Math.sin(a) * R);
                c.lineTo(Math.cos(a) * (R - L), Math.sin(a) * (R - L));
                c.stroke();
            }
            c.font = '13px "Space Mono"';
            c.fillStyle = '#2b2620';
            c.textAlign = 'center';
            ['0', '1', '10', '100', '1K'].forEach((s, i) => {
                const a = A0 + ((A1 - A0) * i) / 4;
                c.fillText(s, Math.cos(a) * (R - 30), Math.sin(a) * (R - 30) + 4);
            });
            c.font = '11px "Space Mono"';
            c.fillText('mSv/h', 0, -30);
            c.restore();
            // two knobs and a switch
            for (const [x, r] of [[-70, 30], [70, 30]]) {
                softShadow(c, env, () => {
                    c.beginPath();
                    c.arc(x + 4, 52, r, 0, TAU);
                }, 4, 0.5);
                const kg = c.createRadialGradient(x - 10, 34, 2, x, 46, r);
                kg.addColorStop(0, '#5a5650');
                kg.addColorStop(1, '#141210');
                c.fillStyle = kg;
                c.beginPath();
                c.arc(x, 46, r, 0, TAU);
                c.fill();
                c.strokeStyle = 'rgba(255,255,255,0.18)';
                c.lineWidth = 1.5;
                for (let k = 0; k < 24; k++) {
                    const a = (k / 24) * TAU;
                    c.beginPath();
                    c.moveTo(x + Math.cos(a) * (r - 4), 46 + Math.sin(a) * (r - 4));
                    c.lineTo(x + Math.cos(a) * r, 46 + Math.sin(a) * r);
                    c.stroke();
                }
                c.fillStyle = '#eee';
                c.fillRect(x - 1.5, 46 - r + 5, 3, 12);
            }
            // a label plate and the speaker grille
            rrect(c, -95, 100, 190, 30, 4);
            c.fillStyle = '#1d1b19';
            c.fill();
            c.font = '15px "Space Mono"';
            c.fillStyle = '#f4c22c';
            c.textAlign = 'center';
            c.fillText('R A D I A T I O N', 0, 121);
            for (let y = 0; y < 4; y++)
                for (let x = 0; x < 9; x++) {
                    c.fillStyle = '#2a1f0a';
                    c.beginPath();
                    c.arc(-80 + x * 20, 160 + y * 16, 4, 0, TAU);
                    c.fill();
                    c.fillStyle = 'rgba(255,240,170,0.5)';
                    c.beginPath();
                    c.arc(-80 + x * 20 + 1, 160 + y * 16 + 2, 4, 0.2, 1.4);
                    c.fill();
                }
            // the socket for the cord
            c.fillStyle = '#1b1a18';
            c.beginPath();
            c.arc(110, 222, 16, 0, TAU);
            c.fill();
        });
    }
    // the glass over the dial (drawn over the needle)
    function glass(g) {
        g.save();
        rrect(g, -106, -186, 212, 150, 8);
        g.clip();
        const gl = g.createLinearGradient(-106, -186, 40, -40);
        gl.addColorStop(0, 'rgba(255,255,255,0.32)');
        gl.addColorStop(0.35, 'rgba(255,255,255,0.05)');
        gl.addColorStop(0.36, 'rgba(255,255,255,0)');
        g.fillStyle = gl;
        g.fillRect(-106, -186, 212, 150);
        // the bezel's shadow on the dial
        g.strokeStyle = 'rgba(0,0,0,0.25)';
        g.lineWidth = 8;
        rrect(g, -106, -186, 212, 150, 8);
        g.stroke();
        g.restore();
    }

    // the probe: a yellow handle and a round head with a metal ring and a grille
    function probeSprite(env) {
        return Motion.sprite('props:probe', { x: -80, y: -80, w: 160, h: 330 }, env.k * 1.5, (c) => {
            softShadow(c, env, () => rrect(c, -18, 50, 44, 190, 18), 10, 0.5);
            softShadow(c, env, () => {
                c.beginPath();
                c.arc(10, 12, 62, 0, TAU);
            }, 12, 0.5);
            const hg = c.createLinearGradient(-22, 0, 22, 0);
            hg.addColorStop(0, '#ffde60');
            hg.addColorStop(0.4, '#f4c22c');
            hg.addColorStop(1, '#b8840e');
            c.fillStyle = hg;
            rrect(c, -22, 40, 44, 190, 18);
            c.fill();
            const mg = c.createLinearGradient(-60, -60, 60, 60);
            mg.addColorStop(0, '#f3f3f0');
            mg.addColorStop(0.5, '#a9a9a6');
            mg.addColorStop(1, '#5d5d5a');
            c.fillStyle = mg;
            c.beginPath();
            c.arc(0, 0, 60, 0, TAU);
            c.fill();
            const fg = c.createRadialGradient(-12, -14, 4, 0, 0, 48);
            fg.addColorStop(0, '#d8d6d0');
            fg.addColorStop(1, '#7c7a75');
            c.fillStyle = fg;
            c.beginPath();
            c.arc(0, 0, 47, 0, TAU);
            c.fill();
            c.save();
            c.beginPath();
            c.arc(0, 0, 47, 0, TAU);
            c.clip();
            c.strokeStyle = 'rgba(40,40,38,0.45)';
            c.lineWidth = 1.3;
            for (let k = -50; k <= 50; k += 6) {
                c.beginPath();
                c.moveTo(k, -50);
                c.lineTo(k, 50);
                c.stroke();
                c.beginPath();
                c.moveTo(-50, k);
                c.lineTo(50, k);
                c.stroke();
            }
            c.restore();
            c.strokeStyle = 'rgba(255,255,255,0.6)';
            c.lineWidth = 3;
            c.beginPath();
            c.arc(0, 0, 57, Math.PI * 1.05, Math.PI * 1.55);
            c.stroke();
        });
    }

    // a coiled cord from a to b (loops along the way), drawn per frame (cheap strokes)
    function cord(g, a, b, o = {}) {
        const { loops = 14, r = 13, sag = 120 } = o;
        const n = loops * 14;
        const P = (u) => {
            const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * sag;
            return [x, y];
        };
        for (const [w, col] of [[9, '#0d0c0b'], [3, 'rgba(255,255,255,0.22)']]) {
            g.lineWidth = w;
            g.strokeStyle = col;
            g.lineCap = 'round';
            g.beginPath();
            for (let i = 0; i <= n; i++) {
                const u = i / n, [x, y] = P(u), [x2, y2] = P(Math.min(1, u + 0.01));
                const tx = x2 - x, ty = y2 - y, L = Math.hypot(tx, ty) || 1, nx = -ty / L, ny = tx / L;
                const th = u * loops * TAU, e = Math.min(1, u * 8, (1 - u) * 8);
                const px = x + (nx * Math.cos(th) * r + (tx / L) * Math.sin(th) * r * 0.5) * e - (w === 3 ? nx * 2 : 0);
                const py = y + (ny * Math.cos(th) * r + (ty / L) * Math.sin(th) * r * 0.5) * e - (w === 3 ? ny * 2 : 0);
                if (i) g.lineTo(px, py);
                else g.moveTo(px, py);
            }
            g.stroke();
        }
    }

    /**
     * The Geiger counter at (x, y), scale s. `level` 0–1 drives the needle (it jitters near
     * the top); `probe` = [x, y, angle] in the same units places the probe (null: none).
     */
    function geiger(g, env, t, x, y, s, level, o = {}) {
        g.save();
        g.translate(x, y);
        g.scale(s, s);
        if (o.probe) {
            const [px, py, pa] = o.probe;
            cord(g, [110, 222], [px - Math.sin(pa) * 228, py + Math.cos(pa) * 228], { sag: o.sag ?? 140 });
            g.save();
            g.translate(px, py);
            g.rotate(pa);
            probeSprite(env).draw(g);
            g.restore();
        }
        geigerBody(env).draw(g);
        // the needle
        const jit = level > 0.6 ? (Motion.noise1('gj', t * 9) * 0.06 + Math.sin(t * 37) * 0.015) * level : 0;
        const A0 = -Math.PI * 0.82, A1 = -Math.PI * 0.18, a = A0 + (A1 - A0) * Math.min(1, Math.max(0, level + jit));
        g.save();
        g.translate(PIV[0], PIV[1]);
        g.strokeStyle = 'rgba(0,0,0,0.25)';
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(3, 4);
        g.lineTo(Math.cos(a) * 92 + 3, Math.sin(a) * 92 + 4);
        g.stroke();
        g.strokeStyle = '#151311';
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(Math.cos(a) * 92, Math.sin(a) * 92);
        g.stroke();
        g.fillStyle = '#151311';
        g.beginPath();
        g.arc(0, 0, 8, 0, TAU);
        g.fill();
        g.restore();
        glass(g);
        // a red lamp that blinks when the level is high
        const on = level > 0.7 && Math.sin(t * 18) > 0;
        g.fillStyle = on ? '#ff3b22' : '#5a1a10';
        g.beginPath();
        g.arc(0, 82, 9, 0, TAU);
        g.fill();
        if (on) {
            g.fillStyle = 'rgba(255,80,40,0.35)';
            g.beginPath();
            g.arc(0, 82, 18, 0, TAU);
            g.fill();
        }
        g.restore();
    }

    // ---- a wooden artist's mannequin (front view, feet at the origin, ~260 tall) ------
    const WOOD = ['#f0d09e', '#d6ab76', '#a87a48'];
    function capsule(c, p, q, r) {
        const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        c.save();
        c.translate(p[0], p[1]);
        c.rotate(a);
        const gr = c.createLinearGradient(0, -r, 0, r);
        gr.addColorStop(0, WOOD[0]);
        gr.addColorStop(0.45, WOOD[1]);
        gr.addColorStop(1, WOOD[2]);
        c.fillStyle = gr;
        rrect(c, -r * 0.2, -r, L + r * 0.4, 2 * r, r);
        c.fill();
        c.strokeStyle = 'rgba(120,80,40,0.22)';
        c.lineWidth = 0.8;
        for (let k = -1; k <= 1; k++) {
            c.beginPath();
            c.moveTo(r * 0.5, k * r * 0.45);
            c.quadraticCurveTo(L / 2, k * r * 0.45 + r * 0.2, L - r * 0.5, k * r * 0.45);
            c.stroke();
        }
        c.restore();
    }
    function ball(c, x, y, r) {
        const gr = c.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
        gr.addColorStop(0, WOOD[0]);
        gr.addColorStop(0.6, WOOD[1]);
        gr.addColorStop(1, WOOD[2]);
        c.fillStyle = gr;
        c.beginPath();
        c.arc(x, y, r, 0, TAU);
        c.fill();
    }
    function blob(c, x, y, rx, ry) {
        const gr = c.createRadialGradient(x - rx * 0.35, y - ry * 0.4, 2, x, y, Math.max(rx, ry) * 1.05);
        gr.addColorStop(0, WOOD[0]);
        gr.addColorStop(0.55, WOOD[1]);
        gr.addColorStop(1, WOOD[2]);
        c.fillStyle = gr;
        c.beginPath();
        c.ellipse(x, y, rx, ry, 0, 0, TAU);
        c.fill();
        c.strokeStyle = 'rgba(120,80,40,0.2)';
        c.lineWidth = 0.9;
        for (let k = 1; k <= 3; k++) {
            c.beginPath();
            c.ellipse(x + rx * 0.1, y, rx * (0.25 * k), ry * (0.28 * k), 0.1, -1.2, 1.2);
            c.stroke();
        }
    }
    function mannequinSprite(env) {
        return Motion.sprite('props:mannequin', { x: -90, y: -275, w: 180, h: 295 }, env.k * 1.5, (c) => {
            c.save();
            c.filter = `blur(${5 * env.k}px)`;
            c.fillStyle = 'rgba(40,25,8,0.45)';
            c.beginPath();
            c.ellipse(6, 2, 60, 9, 0, 0, TAU);
            c.fill();
            c.restore();
            for (const sg of [-1, 1]) {
                // legs
                capsule(c, [sg * 17, -100], [sg * 19, -54], 12);
                capsule(c, [sg * 19, -54], [sg * 20, -12], 10);
                ball(c, sg * 19, -54, 10);
                blob(c, sg * 22, -6, 15, 7);
                // arms
                capsule(c, [sg * 41, -194], [sg * 48, -146], 9);
                capsule(c, [sg * 48, -146], [sg * 51, -100], 8);
                ball(c, sg * 48, -146, 8);
                ball(c, sg * 41, -194, 10);
                blob(c, sg * 52, -86, 8, 13);
            }
            blob(c, 0, -104, 32, 20);
            ball(c, 0, -126, 13);
            blob(c, 0, -168, 37, 40);
            capsule(c, [0, -212], [0, -200], 8);
            blob(c, 0, -236, 21, 27);
        });
    }
    /** A mannequin standing at (x, y), scale s, tilted `rot` about its feet, tinted grey by `grey` (0–1). */
    function mannequin(g, env, x, y, s, rot = 0, grey = 0) {
        const sp = mannequinSprite(env);
        g.save();
        g.translate(x, y);
        g.rotate(rot);
        g.scale(s, s);
        sp.draw(g);
        if (grey > 0) {
            g.globalAlpha *= grey;
            greySprite(env, 'props:mannequin', sp).draw(g);
        }
        g.restore();
    }

    /** A grey, darker copy of a sprite (made once). */
    function greySprite(env, key, sp) {
        return Motion.sprite(key + ':grey', sp.box, sp.canvas.width / sp.box.w, (c) => {
            c.filter = 'grayscale(1) brightness(0.72) contrast(0.9)';
            c.drawImage(sp.canvas, sp.box.x, sp.box.y, sp.box.w, sp.box.h);
        });
    }

    // ---- radiation squiggles: wavy red lines growing down the page ------------------
    function squiggles(g, t, a, o = {}) {
        if (t < a) return;
        const { n = 9, seed = 'sq', x0 = 0, x1 = 900, y0 = -40, y1 = 1640, speed = 2400, color = '#b0301e', lw = 4 } = o;
        const r = Motion.rng(seed);
        g.save();
        g.strokeStyle = color;
        g.lineWidth = lw;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        for (let i = 0; i < n; i++) {
            const x = x0 + r() * (x1 - x0), delay = r() * 0.5, amp = 14 + r() * 22, wl = 50 + r() * 50, ph = r() * TAU, tilt = (r() - 0.5) * 0.5;
            const len = Math.min(y1 - y0, Math.max(0, (t - a - delay) * speed));
            if (len <= 0) continue;
            g.beginPath();
            for (let y = 0; y <= len; y += 6) {
                const px = x + tilt * y + Math.sin(y / wl + ph + t * 3) * amp, py = y0 + y;
                if (y) g.lineTo(px, py);
                else g.moveTo(px, py);
            }
            g.stroke();
        }
        g.restore();
    }

    // ---- a glass micro-needle, its tip at (x, y), coming from angle `ang` -------------
    function needle(g, x, y, ang, len = 520) {
        g.save();
        g.translate(x, y);
        g.rotate(ang);
        const gr = g.createLinearGradient(0, -16, 0, 16);
        gr.addColorStop(0, 'rgba(255,255,255,0.55)');
        gr.addColorStop(0.5, 'rgba(220,235,240,0.18)');
        gr.addColorStop(1, 'rgba(255,255,255,0.45)');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(len, -16);
        g.lineTo(len, 16);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(40,50,55,0.55)';
        g.lineWidth = 1.5;
        g.stroke();
        g.strokeStyle = 'rgba(255,255,255,0.8)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(20, -1);
        g.lineTo(len, -10);
        g.stroke();
        g.restore();
    }

    return { greySprite, geiger, mannequin, squiggles, needle, cord };
})();
