// octopus: a 9:16 cinematic-facts Short (57 s) cut to the user's ElevenLabs voice-over
// (private/voice.wav; timings in brief.md). Fast: a new shot every 1.5–3 s (22 shots), each
// cut with a white flash and a zoom punch. All painted in code: the octopus and its x-ray
// insides, the reef (fish schools, kelp, sea grass, coral, shells), a hemocyanin copper site
// beside the blue blood (octo.js), on the cinematic-facts kit.
const DIR = 'sandbox/2026-11-12-octopus/';

Motion.scene({
    fps: 24,
    duration: 57,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/cinema.js', DIR + 'octo.js'],
    fonts: [{ family: 'Anton', src: 'fonts/Anton-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [[0, 1.4, 'Eye'], [1.4, 2.8, 'Hearts'], [2.8, 4.2, 'Blue blood'], [4.2, 5.6, 'Nerves'], [5.6, 8.8, 'Reef'], [8.8, 11.0, 'Vessels'], [11.0, 12.9, 'Copper'], [12.9, 15.2, 'Brain'], [15.2, 18.6, 'Mini brains'], [18.6, 22.2, 'Arm neurons'], [22.2, 25.0, 'Colour'], [25.0, 27.0, 'Texture'], [27.0, 29.6, 'Gone'], [29.6, 31.2, 'Predator'], [31.2, 33.7, 'Ink'], [33.7, 36.6, 'Beak'], [36.6, 40.7, 'Squeeze'], [40.7, 44.7, 'Jar'], [44.7, 46.9, 'Puzzle'], [46.9, 49.2, 'Stump'], [49.2, 51.8, 'Regrow'], [51.8, 57, 'Subscribe']],

    draw(g, t, env) {
        const E = Ease, TAU = Math.PI * 2, seg = (a, b) => E.seg(t, a, b), lerp = E.lerp;
        const OX = 450, OY = 900, OS = 320; // where the octopus usually is
        const at = (px, py) => [OX + px * OS, OY + py * OS];

        // --- the shots: [start, camera {x, y, z}, octopus options, extra drawing] -------------------
        const X = (o) => ({ xray: 1, ...o });
        // where arm 6 ends once cut: the camera frames it in the last two arm shots
        const stumpL = Octo.armLine(6, t, { cut: 0.45 }), stump = at(...stumpL[stumpL.length - 1]);
        const SHOTS = [
            [0.0, { x: at(0.24, 0)[0], y: at(0, -0.02)[1], z: 3.2 }, { look: [Math.sin(t * 2), 0] }],
            [1.4, { x: OX, y: at(0, -0.36)[1], z: 2.0 }, X({ show: { hearts: 1 } })],
            [2.8, { x: OX, y: 1000, z: 1.1 }, X({ show: { vessels: 1, hearts: 1 } })],
            [4.2, { x: OX, y: 1000, z: 1.0 }, X({ show: { brain: 1, nerves: 1 } })],
            [5.6, { x: OX, y: 900, z: 0.9 }, { xray: 0.55, show: { hearts: 1 }, swim: 0.3 * Math.sin(t * 2) }],
            [8.8, { x: at(-0.3, 0)[0], y: at(0, 0.45)[1], z: 2.2 }, X({ show: { vessels: 1 } })],
            [11.0, { x: at(-0.3, 0)[0] + 140, y: at(0, 0.45)[1], z: 2.2 }, X({ show: { vessels: 1 } }), 'copper'],
            [12.9, { x: OX, y: at(0, -0.05)[1], z: 2.6 }, X({ show: { brain: 1 } })],
            [15.2, { x: OX, y: 1010, z: 1.0 }, X({ show: { brain: 1, nerves: 1 } })],
            [18.6, { x: at(0.45, 0)[0], y: at(0, 0.75)[1], z: 2.3 }, { xray: 0.75, show: { nerves: 1 } }],
            [22.2, { x: OX, y: at(0, -0.5)[1], z: 1.8 }, { pattern: 1, hue: 14 + 30 * Math.sin(t * 2.4) }],
            [25.0, { x: OX, y: 960, z: 1.3 }, { camo: 0.55, pattern: 0.8 }, 'rock'],
            [27.0, { x: OX, y: 960, z: 1.0 }, { camo: E.out(seg(27.2, 28.6)), alpha: 1 - 0.85 * seg(28.0, 29.2) }, 'rock'],
            [29.6, { x: OX, y: 940, z: 0.95 }, { look: [1, 0] }, 'predator'],
            [31.2, { x: OX, y: 900, z: 0.95 }, { swim: 1 }, 'ink'],
            [33.7, { x: OX, y: at(0, 0.1)[1], z: 1.5 }, X({ show: { beak: 1 } })],
            [36.6, { x: OX, y: 960, z: 1.0 }, null, 'squeeze'],
            [40.7, { x: OX, y: 930, z: 1.45 }, null, 'jar'],
            [44.7, { x: OX, y: 960, z: 1.0 }, null, 'puzzle'],
            [46.9, { x: stump[0] - 80, y: stump[1] - 80, z: 1.6 }, { cut: { 6: 0.45 } }, 'stump'],
            [49.2, { x: stump[0] - 20, y: stump[1] - 40, z: 1.25 }, { cut: { 6: lerp(0.45, 1, E.out(seg(49.4, 51.4))) } }, 'regrow'],
            [51.8, { x: OX, y: 900, z: 0.9 }, {}, 'subscribe'],
        ];
        let k = 0;
        while (k + 1 < SHOTS.length && t >= SHOTS[k + 1][0]) k++;
        const [s0, cam, oo, extra] = SHOTS[k];
        const s1 = k + 1 < SHOTS.length ? SHOTS[k + 1][0] : 57;
        const local = t - s0;

        // --- the camera: a punch-in on each cut, then a slow push ---------------------------------
        const z = cam.z * (1 + 0.1 * Math.exp(-local * 9)) * (1 + 0.04 * (local / (s1 - s0)));
        Cine.sea(g, env, { key: 'reef' });
        g.save();
        g.translate(450, 800);
        g.scale(z, z);
        g.translate(-cam.x, -cam.y);
        Cine.rays(g, t);
        Cine.particles(g, env, t, { n: 70, size: 1.4, alpha: 0.35, speed: 6, seed: 'far' });
        Octo.school(g, t, { n: 10, y: 560, speed: 70, dir: 1, size: 13, seed: 'sA' });
        Octo.school(g, t + 20, { n: 8, y: 760, speed: 55, dir: -1, size: 11, color: '#7fe0ff', stripe: '#ff8a3d', seed: 'sB' });
        Octo.seabed(g, env, t, { y: 1290 });

        // an x-ray darkens the water so the insides glow
        const xr = oo && oo.xray ? oo.xray : 0;
        if (xr > 0) {
            g.fillStyle = `rgba(0,8,24,${0.5 * xr})`;
            g.fillRect(-500, -500, 1900, 2600);
        }

        // the rock wall the octopus hides against (camouflage shots)
        const rockWall = () => {
            const gr = g.createLinearGradient(0, 600, 0, 1300);
            gr.addColorStop(0, '#5d5a4c');
            gr.addColorStop(1, '#3a382f');
            g.fillStyle = gr;
            g.beginPath();
            g.ellipse(OX, 1150, 520, 560, 0, Math.PI, TAU);
            g.fill();
            const r = Motion.rng('rockTex');
            for (let i = 0; i < 120; i++) {
                g.fillStyle = `rgba(${40 + r() * 60},${38 + r() * 50},${30 + r() * 40},0.5)`;
                g.beginPath();
                g.ellipse(OX + (r() - 0.5) * 900, 650 + r() * 600, 6 + r() * 22, 4 + r() * 14, r() * 3, 0, TAU);
                g.fill();
            }
        };
        if (extra === 'rock') rockWall();

        // --- the octopus ---------------------------------------------------------------------------
        let ox = OX, oy = OY, os = OS, orot = 0;
        if (extra === 'ink') {
            const u = E.in(seg(32.0, 33.6));
            (ox = lerp(OX, -200, u)), (oy = lerp(OY, 300, u)), (orot = -0.9 * u);
        }
        if (extra === 'predator') ox = OX - 120 * seg(29.6, 31.2);
        if (oo) Octo.draw(g, env, ox, oy, os, { t, ...oo, rot: orot });

        // --- extras ----------------------------------------------------------------------------------
        if (extra === 'predator' || extra === 'ink') {
            // a big grouper sliding in from the right
            const u = extra === 'predator' ? E.out(seg(29.6, 31.0)) : 1 - E.in(seg(31.6, 32.4));
            const fx = lerp(1300, 760, u), fy = 980;
            g.save();
            g.translate(fx, fy);
            g.fillStyle = '#28323a';
            g.beginPath();
            g.ellipse(0, 0, 300, 130, 0, 0, TAU);
            g.fill();
            g.beginPath();
            g.moveTo(260, 0);
            g.lineTo(420, -120 + Math.sin(t * 10) * 20);
            g.lineTo(420, 120 + Math.sin(t * 10) * 20);
            g.closePath();
            g.fill();
            g.fillStyle = '#d8e2e8';
            g.beginPath();
            g.arc(-190, -30, 18, 0, TAU);
            g.fill();
            g.fillStyle = '#0a0a0a';
            g.beginPath();
            g.arc(-194, -30, 9, 0, TAU);
            g.fill();
            g.strokeStyle = '#141a1f';
            g.lineWidth = 6;
            g.beginPath();
            g.moveTo(-300, 30);
            g.quadraticCurveTo(-250, 50 + Math.sin(t * 6) * 10, -200, 40);
            g.stroke();
            g.restore();
        }
        if (extra === 'ink') {
            // the ink: soft dark puffs swelling out of where it was
            const u = seg(31.25, 32.6);
            const r = Motion.rng('ink');
            for (let i = 0; i < 14; i++) {
                const a = r() * TAU, d = r() * 260 * u, rad = (60 + r() * 120) * (0.3 + u);
                const sp = Cine.dotSprite(env, 40, 22, 'rgba(8,8,14,0.92)');
                const px = OX + Math.cos(a) * d, py = OY + 100 + Math.sin(a) * d * 0.8 - u * 60;
                g.drawImage(sp.canvas, px - rad, py - rad, rad * 2, rad * 2);
            }
        }
        if (extra === 'squeeze') {
            // a rock wall with a small hole; the octopus squeezes through it
            const u = E.inOut(seg(37.0, 40.3)), hx = 450, hy = 1000, holeR = 46;
            const px = lerp(140, 760, u), squash = 1 - 0.75 * Math.exp(-((px - hx) ** 2) / 9000);
            const drawO = () => {
                g.save();
                g.translate(px, hy);
                g.scale(squash, 1);
                Octo.draw(g, env, 0, -40, 150, { t, swim: 1, rot: Math.PI / 2 });
                g.restore();
            };
            drawO();
            const wall = new Path2D();
            wall.rect(hx - 60, 300, 120, 1100);
            wall.arc(hx, hy, holeR, 0, TAU);
            const gr = g.createLinearGradient(hx - 60, 0, hx + 60, 0);
            gr.addColorStop(0, '#2e3a40');
            gr.addColorStop(1, '#4a5a60');
            g.fillStyle = gr;
            g.fill(wall, 'evenodd');
            g.strokeStyle = 'rgba(255,220,120,0.9)';
            g.lineWidth = 4;
            g.beginPath();
            g.arc(hx, hy, holeR, 0, TAU);
            g.stroke();
            if (px > hx + 60) drawO();
            // the beak, the only hard part, sized against the hole
            g.font = '44px "Anton"';
            g.fillStyle = '#ffd36b';
            g.textAlign = 'center';
            g.fillText('HOLE ≈ BEAK', hx, hy + 110);
        }
        if (extra === 'jar') {
            // the octopus INSIDE a glass jar opens the lid from within: it looks up, its arms
            // reach up and twist the lid, the lid pops off spinning, and it peeks out happily
            const jx = 450, jy = 1010, JW = 300, JH = 420;
            const twist = seg(41.3, 43.6), pop = E.out(seg(43.6, 44.1)), peek = E.back(seg(44.0, 44.6));
            const top = jy - JH / 2;
            // the back of the glass
            g.fillStyle = 'rgba(160,210,255,0.10)';
            g.beginPath();
            g.roundRect(jx - JW / 2, top, JW, JH, 40);
            g.fill();
            // the octopus, sitting on the bottom, then rising to peek out
            const oy = lerp(jy + 80, top - 10, peek), wob = Math.sin(t * 9) * 0.04 * (twist > 0 && twist < 1 ? 1 : 0);
            // it stays inside the glass: clip to the jar, and to the open mouth above it
            g.save();
            g.beginPath();
            g.roundRect(jx - JW / 2 + 6, top - 700, JW - 12, JH + 694, 34);
            g.clip();
            // arms reaching up to the underside of the lid, gripping it (until it pops); drawn first, behind the body
            if (pop < 1) {
                for (const [sx, ph] of [[-1, 0], [1, 1.3], [-0.4, 2.2]]) {
                    const reach = E.out(seg(40.9, 41.5));
                    const end = [jx + sx * 95 + Math.sin(twist * 12 + ph) * 18, lerp(oy, top + 14, reach)];
                    const ribbon = new Path2D(), from = [jx + sx * 30, oy + 30];
                    const mid = [jx + sx * 120, (from[1] + end[1]) / 2];
                    g.strokeStyle = 'hsl(14,70%,50%)';
                    g.lineWidth = 20;
                    g.lineCap = 'round';
                    g.beginPath();
                    g.moveTo(from[0], from[1]);
                    g.quadraticCurveTo(mid[0], mid[1], end[0], end[1]);
                    g.stroke();
                    g.fillStyle = 'hsla(14,70%,82%,0.95)';
                    for (let k = 1; k < 6; k++) {
                        const u = k / 6, px = (1 - u) ** 2 * from[0] + 2 * (1 - u) * u * mid[0] + u * u * end[0], py = (1 - u) ** 2 * from[1] + 2 * (1 - u) * u * mid[1] + u * u * end[1];
                        g.beginPath();
                        g.arc(px - sx * 6, py, 4.5, 0, TAU);
                        g.fill();
                    }
                    void ribbon;
                }
            }
            // the body in front of its reaching arms, so the face stays clear
            Octo.draw(g, env, jx, oy, 150, { t, cute: true, look: [0, twist < 1 ? -1 : 0.2], spread: 0.75, curl: 1.4, rot: wob });
            g.restore();
            // the front of the glass: rim, highlights
            g.strokeStyle = 'rgba(220,240,255,0.75)';
            g.lineWidth = 5;
            g.beginPath();
            g.roundRect(jx - JW / 2, top, JW, JH, 40);
            g.stroke();
            g.fillStyle = 'rgba(255,255,255,0.18)';
            g.beginPath();
            g.roundRect(jx - JW / 2 + 22, top + 40, 22, JH - 90, 11);
            g.fill();
            g.fillStyle = 'rgba(200,230,255,0.08)';
            g.beginPath();
            g.roundRect(jx - JW / 2, top, JW, JH, 40);
            g.fill();
            // the lid: turning (its ridges slide, it wobbles), then popping off and spinning away
            g.save();
            g.translate(jx + pop * 180, top - 14 - pop * 380 + pop * pop * 120);
            g.rotate(pop * 2.6 + Math.sin(twist * 30) * 0.03 * (pop > 0 ? 0 : 1));
            g.fillStyle = '#c9ccd2';
            g.beginPath();
            g.roundRect(-JW / 2 - 12, -24, JW + 24, 48, 10);
            g.fill();
            g.strokeStyle = '#7d828b';
            g.lineWidth = 3;
            for (let i = 0; i < 14; i++) {
                const xx = -JW / 2 + ((i * 24 + twist * 400) % (JW + 10));
                g.beginPath();
                g.moveTo(xx, -24);
                g.lineTo(xx, 24);
                g.stroke();
            }
            g.restore();
            // little twist arrows while it works, a burst of bubbles when the lid pops
            if (twist > 0 && twist < 1) {
                g.strokeStyle = 'rgba(255,220,120,0.9)';
                g.lineWidth = 6;
                g.beginPath();
                g.arc(jx, top - 14, JW * 0.62, Math.PI * 1.15 + twist * 2, Math.PI * 1.45 + twist * 2);
                g.stroke();
            }
            if (pop > 0 && pop < 1)
                for (let i = 0; i < 12; i++) {
                    const a = -Math.PI / 2 + (i / 11 - 0.5) * 2.2, d = pop * 160;
                    g.strokeStyle = `rgba(220,240,255,${1 - pop})`;
                    g.lineWidth = 3;
                    g.beginPath();
                    g.arc(jx + Math.cos(a) * d, top + Math.sin(a) * d, 8 + i % 3 * 4, 0, TAU);
                    g.stroke();
                }
        }
        if (extra === 'puzzle') {
            // a latched box: the arm slides the bolt, the lid opens, a shell inside
            const bx = 560, by = 1060, slide = E.inOut(seg(45.0, 45.9)), open = E.out(seg(45.9, 46.6));
            Octo.draw(g, env, 230, 880, 190, { t, look: [1, 0.4] });
            g.fillStyle = '#8a5a34';
            g.fillRect(bx - 130, by - 90, 260, 180);
            g.save();
            g.translate(bx - 130, by - 90);
            g.rotate(-open * 1.2);
            g.fillStyle = '#a06a3e';
            g.fillRect(0, -30, 260, 30);
            g.restore();
            g.fillStyle = '#d8b04a';
            g.fillRect(bx - 40 - slide * 70, by - 100, 80, 20);
            if (open > 0.3) {
                g.fillStyle = '#f3c6a3';
                g.beginPath();
                g.arc(bx, by - 70, 34 * open, Math.PI, TAU);
                g.fill();
            }
            g.strokeStyle = 'hsl(14,72%,45%)';
            g.lineWidth = 20;
            g.lineCap = 'round';
            g.beginPath();
            g.moveTo(270, 980);
            g.quadraticCurveTo(380, 960, bx - 40 - slide * 70, by - 90);
            g.stroke();
        }
        if (extra === 'stump') {
            // where the arm ends now: a pulsing ring (no wound shown)
            const tip = Octo.armLine(6, t, { cut: 0.45 }), p = tip[tip.length - 1];
            g.strokeStyle = `rgba(255,220,120,${0.6 + 0.4 * Math.sin(t * 8)})`;
            g.lineWidth = 6;
            g.beginPath();
            g.arc(OX + p[0] * OS, OY + p[1] * OS, 40 + 6 * Math.sin(t * 8), 0, TAU);
            g.stroke();
        }
        if (extra === 'regrow') {
            const tip = Octo.armLine(6, t, { cut: lerp(0.45, 1, E.out(seg(49.4, 51.4))) });
            const p = tip[tip.length - 1];
            Octo.glow(g, env, '140,255,190', OX + p[0] * OS, OY + p[1] * OS, 60, 0.8);
        }
        if (extra === 'copper') {
            // split screen: the blue blood on the left, its copper site on the right
            g.restore();
            g.save();
            const u = E.out(seg(11.0, 11.3));
            g.fillStyle = 'rgba(4,10,22,0.92)';
            g.fillRect(lerp(900, 450, u), 0, 450, 1600);
            g.strokeStyle = 'rgba(255,170,100,0.9)';
            g.lineWidth = 4;
            g.beginPath();
            g.moveTo(lerp(900, 450, u), 0);
            g.lineTo(lerp(900, 450, u), 1600);
            g.stroke();
            g.save();
            g.beginPath();
            g.rect(lerp(900, 450, u) + 4, 0, 450, 1600);
            g.clip();
            Octo.copperSite(g, env, lerp(1125, 675, u), 820, 62, t);
            g.restore();
            g.font = '46px "Anton"';
            g.textAlign = 'center';
            g.fillStyle = '#ffb27a';
            g.fillText('HEMOCYANIN', lerp(1125, 675, u), 1130);
            g.font = '30px "Anton"';
            g.fillStyle = '#cfd8e0';
            g.fillText('copper + oxygen = blue', lerp(1125, 675, u), 1175);
        }
        Cine.particles(g, env, t, { n: 8, size: 9, blur: 6, alpha: 0.15, speed: 30, seed: 'near' });
        g.restore();

        if (extra === 'subscribe') {
            const b = E.back(seg(52.4, 52.8)), click = t >= 53.6 && t < 53.9 ? 0.92 : 1;
            if (b > 0) {
                g.save();
                g.translate(450, 1240);
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

        Cine.vignette(g, env, 0.65);
        // the flash on every cut
        const flash = Math.max(0, 1 - local / 0.12) * (k > 0 ? 0.45 : 0);
        if (flash > 0) {
            g.fillStyle = `rgba(255,255,255,${flash})`;
            g.fillRect(0, 0, 900, 1600);
        }

        // --- captions ------------------------------------------------------------------------------
        const C = (a, b, top, bottom, col) => Cine.caption(g, t, a, b, top, bottom, col);
        C(0.4, 2.4, 'IT HAS', '3 HEARTS', '#ff4d5e');
        C(2.4, 3.9, 'AND', 'BLUE BLOOD', '#4da3ff');
        C(3.9, 5.6, 'AND', '9 BRAINS?', '#c08bff');
        C(6.1, 8.9, 'THREE', 'HEARTS', '#ff4d5e');
        C(8.9, 11.0, 'BLUE', 'BLOOD', '#4da3ff');
        Cine.caption(g, t, 11.0, 12.9, 'BECAUSE OF', 'COPPER', '#ff9a4d', { x: 30, maxW: 390 });
        C(12.9, 15.2, '1 MAIN', 'BRAIN', '#c08bff');
        C(15.2, 18.6, '+8 MINI', 'BRAINS', '#ffd34d');
        C(18.6, 22.2, '2/3 OF NEURONS', 'IN ITS ARMS', '#ffd34d');
        C(22.2, 27.0, 'CHANGES COLOR', 'IN A FLASH', '#ff7ad9');
        C(27.0, 29.6, 'NOW YOU SEE IT...', 'GONE!', '#8be36a');
        C(29.6, 33.7, 'DANGER?', 'INK BOMB!', '#e8e8e8');
        C(33.7, 36.6, 'ZERO', 'BONES', '#f5f2ea');
        C(36.6, 40.7, 'FITS THROUGH', 'TINY GAPS', '#5ee6ff');
        C(40.7, 44.7, 'OPENS', 'JARS', '#ffc93d');
        C(44.7, 46.9, 'SOLVES', 'PUZZLES', '#ffc93d');
        C(46.9, 49.2, 'LOST AN ARM?', 'NO PROBLEM', '#ff9a4d');
        C(49.2, 51.8, 'IT GROWS', 'BACK!', '#6dff9a');
        C(51.9, 57.0, 'FOLLOW FOR', 'MORE FACTS', '#ffc93d');
    },

    post(ctx, t, env) {
        Cine.grain(ctx, env, t);
    },
});
