// immortal-jellyfish: a 9:16 cinematic-facts Short about Turritopsis dohrnii, cut to the user's
// ElevenLabs voice-over (private/voice.wav; timings in brief.md). Everything is painted in
// code: the jellyfish (turri.js, drawn after the user's reference photos), the sea, the life
// cycle, the polyps, the DNA, the fish — with the cinematic-facts kit
// (styles/cinematic-facts/cinema.js). A first cut used the photos as cutouts; the user asked
// for the code-made jellyfish instead.
const DIR = 'sandbox/2026-11-12-immortal-jellyfish/';

Motion.scene({
    fps: 24,
    duration: 49,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/cinema.js', DIR + 'turri.js'],
    fonts: [{ family: 'Anton', src: 'fonts/Anton-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 6.6, 'Hook'], [6.6, 11.6, 'Meet'], [11.6, 16.9, 'Size'], [16.9, 24.4, 'Back to baby'],
        [24.4, 28.5, 'Again'], [28.5, 37.1, 'DNA'], [37.1, 44.2, 'Not immortal'], [44.2, 49, 'Follow'],
    ],

    draw(g, t, env) {
        const E = Ease, TAU = Math.PI * 2;
        const seg = (a, b) => E.seg(t, a, b), lerp = E.lerp, between = (a, b) => t >= a && t < b;
        const W = 900, H = 1600;

        // the jellyfish: 'top' seen from above, 'front' and 'side' from the side ('side' tipped
        // over, as in the third reference photo); `s` = its whole width with the tentacles
        const jelly = (key, x, y, s, rot = 0, alpha = 1) => {
            const view = key === 'top' ? 'top' : 'side', tilt = key === 'side' ? rot - 1.25 : rot;
            Turri.draw(g, env, x, y, s * 0.38, { view, t, alpha, tilt, seed: 'turri:' + key });
        };
        // a tiny code-made medusa: bell, red core, a fringe of tentacles (for the life cycle)
        const mini = (x, y, s, a = 1, ph = 0) => {
            g.save();
            g.translate(x, y);
            g.globalAlpha = a;
            g.globalCompositeOperation = 'lighter';
            const c = 0.5 + 0.5 * Math.sin(t * 4 + ph);
            g.strokeStyle = 'rgba(200,235,255,0.5)';
            g.lineWidth = 1;
            for (let i = 0; i < 10; i++) {
                const xx = (i / 9 - 0.5) * s * 1.6;
                g.beginPath();
                g.moveTo(xx, 0);
                g.quadraticCurveTo(xx * 1.4 + Math.sin(t * 3 + i) * 3, s * 0.8, xx * 1.6, s * 1.4);
                g.stroke();
            }
            g.fillStyle = 'rgba(190,230,255,0.28)';
            g.beginPath();
            g.ellipse(0, 0, s * (0.8 - 0.08 * c), s * 0.75, 0, Math.PI, TAU);
            g.fill();
            g.fillStyle = 'rgba(255,70,60,0.85)';
            g.beginPath();
            g.ellipse(0, -s * 0.3, s * 0.28, s * 0.22, 0, 0, TAU);
            g.fill();
            g.restore();
        };

        // --- the sea ----------------------------------------------------------------------------
        Cine.sea(g, env, { key: 'deep' });
        const z = 1 + 0.06 * Math.sin(t * 0.15);
        g.save();
        g.translate(450, 780);
        g.scale(z, z);
        g.translate(-450 - 8 * Math.sin(t * 0.3), -780);
        Cine.rays(g, t);
        Cine.particles(g, env, t, { n: 90, size: 1.4, alpha: 0.35, speed: 6, seed: 'far' });
        Cine.particles(g, env, t, { n: 40, size: 2.6, blur: 1.5, alpha: 0.3, speed: 12, seed: 'mid' });

        // --- 1 · hook: a glint far away, then a snap zoom onto it ---------------------------------
        if (t < 6.7) {
            const snap = E.back(seg(0.45, 1.05)), drift = seg(1.05, 6.6);
            const s = lerp(90, 640, snap) + drift * 60;
            jelly('top', 450 + Math.sin(t * 0.7) * 10, lerp(820, 860, drift), s, Math.sin(t * 0.5) * 0.05);
        }
        // --- 2 · meet: the front view, big ------------------------------------------------------------
        if (between(6.6, 11.7)) {
            const u = E.out(seg(6.6, 7.1)), out = seg(11.3, 11.7);
            jelly('front', 450, 860 - u * 20 + Math.sin(t * 0.8) * 8, lerp(700, 820, seg(6.6, 11.6)), Math.sin(t * 0.6) * 0.03, u * (1 - out));
        }
        // --- 3 · size: the side view small, a glowing scale bar of 4.5 mm ---------------------------------
        if (between(11.6, 17.0)) {
            const u = E.out(seg(11.6, 12.1)), out = seg(16.6, 16.95);
            jelly('side', 450, 820, lerp(620, 300, E.inOut(seg(12.3, 13.4))), 0, u * (1 - out));
            const bar = E.out(seg(13.2, 14.0)) * (1 - out);
            if (bar > 0) {
                g.save();
                g.globalAlpha = bar;
                g.translate(300, 1040);
                g.strokeStyle = '#ffc93d';
                g.shadowColor = '#ffc93d';
                g.shadowBlur = 16;
                g.lineWidth = 6;
                g.beginPath();
                g.moveTo(0, 0);
                g.lineTo(300 * bar, 0);
                g.stroke();
                for (let i = 0; i <= 10; i++) {
                    if (i / 10 > bar) break;
                    g.lineWidth = i % 5 ? 2 : 4;
                    g.beginPath();
                    g.moveTo(i * 30, 0);
                    g.lineTo(i * 30, i % 5 ? 14 : 26);
                    g.stroke();
                }
                g.font = '54px "Anton"';
                g.fillStyle = '#ffc93d';
                g.textAlign = 'center';
                g.fillText('≈ 4.5 mm', 150, 90);
                g.restore();
            }
        }
        // --- 4 · back to baby stage: shrink to a blob, sink, grow into a polyp colony --------------------
        // --- 5 · again and again: new medusae bud off and rise; a loop arrow ------------------------------
        if (between(16.9, 28.6)) {
            const base = [450, 1200];
            const shrink = E.inOut(seg(17.4, 19.6));
            if (t < 19.8) jelly('side', lerp(450, base[0], shrink), lerp(760, base[1] - 60, shrink), lerp(560, 150, shrink), shrink * 1.2, 1 - seg(19.4, 19.8));
            // the blob (cyst) that it turns into
            const blob = seg(19.2, 19.7) * (1 - seg(21.0, 21.6));
            if (blob > 0) {
                g.save();
                g.globalCompositeOperation = 'lighter';
                g.globalAlpha = blob;
                g.fillStyle = 'rgba(190,230,255,0.35)';
                g.beginPath();
                g.ellipse(base[0], base[1] - 40, 70, 58, 0, 0, TAU);
                g.fill();
                g.fillStyle = 'rgba(255,80,60,0.8)';
                g.beginPath();
                g.ellipse(base[0], base[1] - 40, 32, 26, 0, 0, TAU);
                g.fill();
                g.restore();
            }
            // the rock it settles on
            g.save();
            g.fillStyle = '#0b2533';
            g.beginPath();
            g.ellipse(base[0], base[1] + 90, 380, 110, 0, Math.PI, TAU);
            g.fill();
            g.restore();
            // the polyp colony grows: branching stalks, each tip a polyp with a crown of tentacles
            const grow = E.out(seg(20.8, 23.6));
            if (grow > 0) {
                g.save();
                g.globalCompositeOperation = 'lighter';
                const r = Motion.rng('polyps');
                const stalks = Array.from({ length: 7 }, (_, i) => ({ x: base[0] - 270 + i * 90 + (r() - 0.5) * 30, h: 300 + r() * 260, lean: (r() - 0.5) * 0.5 }));
                stalks.forEach((st, i) => {
                    const h = st.h * grow, top = [st.x + Math.sin(st.lean) * h + Math.sin(t * 1.2 + i) * 6, base[1] - h];
                    g.strokeStyle = 'rgba(210,235,255,0.55)';
                    g.lineWidth = 5;
                    g.beginPath();
                    g.moveTo(st.x, base[1]);
                    g.quadraticCurveTo(st.x + Math.sin(st.lean) * h * 0.4, base[1] - h * 0.6, top[0], top[1]);
                    g.stroke();
                    if (grow > 0.5) {
                        const k = (grow - 0.5) * 2;
                        g.fillStyle = 'rgba(255,90,70,0.8)';
                        g.beginPath();
                        g.ellipse(top[0], top[1] - 14 * k, 15 * k, 22 * k, 0, 0, TAU);
                        g.fill();
                        g.strokeStyle = 'rgba(220,240,255,0.6)';
                        g.lineWidth = 2.5;
                        for (let j = 0; j < 9; j++) {
                            const a = -Math.PI / 2 + (j / 8 - 0.5) * 2.6 + Math.sin(t * 2 + j + i) * 0.1;
                            g.beginPath();
                            g.moveTo(top[0], top[1] - 26 * k);
                            g.lineTo(top[0] + Math.cos(a) * 48 * k, top[1] - 26 * k + Math.sin(a) * 48 * k);
                            g.stroke();
                        }
                    }
                    // new medusae bud off and drift up (again and again)
                    for (let m = 0; m < 2; m++) {
                        const t0 = 24.4 + i * 0.35 + m * 1.6, u = seg(t0, t0 + 3.5);
                        if (u > 0 && u < 1) mini(top[0] + Math.sin(u * 6 + i) * 20, top[1] - 50 - u * 520, 26 + u * 14, Math.min(1, u * 4) * (1 - seg(t0 + 3, t0 + 3.5)), i + m);
                    }
                });
                g.restore();
            }
            // the loop arrow: the life cycle starts over
            const loop = seg(24.6, 25.8) * (1 - seg(28.1, 28.5));
            if (loop > 0) {
                g.save();
                g.translate(450, 760);
                g.rotate(t * 1.2);
                g.strokeStyle = '#ff9a3d';
                g.shadowColor = '#ff9a3d';
                g.shadowBlur = 20;
                g.lineWidth = 9;
                g.lineCap = 'round';
                g.beginPath();
                g.arc(0, 0, 200, 0, TAU * 0.82 * loop);
                g.stroke();
                const a = TAU * 0.82 * loop;
                g.fillStyle = '#ff9a3d';
                g.beginPath();
                g.moveTo(Math.cos(a) * 200 + Math.cos(a + Math.PI / 2) * 30, Math.sin(a) * 200 + Math.sin(a + Math.PI / 2) * 30);
                g.lineTo(Math.cos(a) * 170, Math.sin(a) * 170);
                g.lineTo(Math.cos(a) * 230, Math.sin(a) * 230);
                g.closePath();
                g.fill();
                g.restore();
            }
        }
        // --- 6 · DNA: a turning double helix beside the jelly -------------------------------------------
        if (between(28.5, 37.2)) {
            const u = E.out(seg(28.5, 29.0)), out = seg(36.8, 37.15);
            jelly('front', 300, 860, 520, Math.sin(t * 0.6) * 0.04, u * (1 - out));
            g.save();
            g.globalAlpha = u * (1 - out);
            g.globalCompositeOperation = 'lighter';
            const hx = 690, top = 560, len = 760, n = 26;
            for (let i = 0; i < n; i++) {
                const v = i / (n - 1), y = top + v * len, a = v * Math.PI * 4 + t * 1.8;
                const x1 = hx + Math.sin(a) * 90, x2 = hx + Math.sin(a + Math.PI) * 90;
                const front = Math.cos(a) > 0;
                g.strokeStyle = 'rgba(180,240,255,0.35)';
                g.lineWidth = 3;
                g.beginPath();
                g.moveTo(x1, y);
                g.lineTo(x2, y);
                g.stroke();
                g.fillStyle = front ? '#6dff9a' : 'rgba(109,255,154,0.45)';
                g.beginPath();
                g.arc(x1, y, front ? 9 : 6, 0, TAU);
                g.fill();
                g.fillStyle = !front ? '#ff5a7a' : 'rgba(255,90,122,0.45)';
                g.beginPath();
                g.arc(x2, y, !front ? 9 : 6, 0, TAU);
                g.fill();
            }
            g.restore();
        }
        // --- 7 · not immortal: a fish sweeps past and the jelly is gone; another one fades ----------------
        if (between(37.1, 44.3)) {
            const u = E.out(seg(37.1, 37.6));
            const eaten = t >= 40.75;
            if (!eaten) jelly('side', 450, 800, 520, Math.sin(t * 0.6) * 0.04, u);
            // a second jelly, sick: it dims and sinks
            const sick = seg(41.4, 43.6);
            if (t > 40.9) jelly('top', 470, lerp(860, 1000, sick), 420, 0, (1 - sick * 0.85) * seg(40.9, 41.3));
            // the fish: a dark silhouette sweeping right to left
            const fu = seg(39.6, 41.4);
            if (fu > 0 && fu < 1) {
                const fx = lerp(1150, -350, fu), fy = 790 + Math.sin(fu * 6) * 20, wag = Math.sin(t * 18) * 0.25;
                g.save();
                g.translate(fx, fy);
                g.fillStyle = '#04121a';
                g.beginPath();
                g.ellipse(0, 0, 240, 95, 0, 0, TAU);
                g.fill();
                g.save();
                g.translate(220, 0);
                g.rotate(wag);
                g.beginPath();
                g.moveTo(0, 0);
                g.lineTo(130, -90);
                g.lineTo(110, 0);
                g.lineTo(130, 90);
                g.closePath();
                g.fill();
                g.restore();
                g.beginPath();
                g.moveTo(-40, -85);
                g.lineTo(40, -150);
                g.lineTo(80, -80);
                g.fill();
                g.fillStyle = 'rgba(180,220,240,0.6)';
                g.beginPath();
                g.arc(-170, -20, 9, 0, TAU);
                g.fill();
                g.restore();
            }
        }
        // --- 8 · follow: the top view again, a button --------------------------------------------------
        if (t >= 44.2) {
            const u = E.out(seg(44.2, 44.7));
            jelly('top', 450, 820, 600, Math.sin(t * 0.5) * 0.04, u);
            const b = E.back(seg(45.2, 45.6)), click = between(46.4, 46.7) ? 0.92 : 1;
            if (b > 0) {
                g.save();
                g.translate(450, 1230);
                g.scale(b * click, b * click);
                g.fillStyle = '#e8322b';
                g.shadowColor = 'rgba(232,50,43,0.8)';
                g.shadowBlur = 24;
                g.beginPath();
                g.roundRect(-210, -55, 420, 110, 55);
                g.fill();
                g.shadowBlur = 0;
                g.font = '64px "Anton"';
                g.textAlign = 'center';
                g.fillStyle = '#fff';
                g.fillText('SUBSCRIBE', 0, 24);
                g.restore();
            }
        }

        // near particles, big and soft, in front of everything
        Cine.particles(g, env, t, { n: 10, size: 9, blur: 6, alpha: 0.16, speed: 30, seed: 'near' });
        g.restore();

        Cine.vignette(g, env, 0.7);

        // --- captions --------------------------------------------------------------------------------
        Cine.caption(g, t, 0.5, 6.4, 'IT NEVER', 'DIES OF OLD AGE', '#5ee6ff');
        Cine.caption(g, t, 6.9, 11.5, 'TURRITOPSIS', 'DOHRNII', '#ff5a7a');
        Cine.caption(g, t, 11.8, 16.8, 'ONLY', '4.5 MM', '#ffc93d');
        Cine.caption(g, t, 17.1, 24.4, 'BACK TO', 'BABY STAGE', '#5ee6ff');
        Cine.caption(g, t, 24.6, 28.4, 'AGAIN', 'AND AGAIN', '#ff9a3d');
        Cine.caption(g, t, 28.8, 32.4, 'SCIENTISTS', 'STUDY ITS DNA', '#6dff9a');
        Cine.caption(g, t, 32.4, 37.0, 'TO UNDERSTAND', 'HUMAN AGING', '#6dff9a');
        Cine.caption(g, t, 37.4, 44.0, 'NOT TRULY', 'IMMORTAL', '#ff4d4d');
        Cine.caption(g, t, 44.5, 49.0, 'FOLLOW FOR', 'MORE FACTS', '#ffc93d');
    },

    post(ctx, t, env) {
        Cine.grain(ctx, env, t);
    },
});
