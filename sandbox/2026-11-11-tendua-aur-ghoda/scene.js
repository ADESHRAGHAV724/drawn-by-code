// tendua-aur-ghoda: «The leopard and the horse», a 9:16 YouTube Short painted in sumi-e,
// cut to the user's ElevenLabs voice-over (private/voice.wav, re-timed by make-voice.sh;
// line timings in brief.md). No subtitles (the user's choice): only the title and the moral,
// brush-written with a vermilion seal. Vermilion is kept for the leopard's greedy eyes and
// the seals. One long painting: the meadow on the left, the stable on the right; the camera
// travels along it. Figures move on twos (tt); the speaking animal's jaw follows mouth.js.
const DIR = 'sandbox/2026-11-11-tendua-aur-ghoda/';

// voice lines in film time: [start, end, speaker]  (n narrator, h horse, l leopard)
const LINES = [
    [0.5, 6.49, 'n'], [7.13, 15.4, 'n'], [15.93, 21.72, 'h'], [22.2, 23.95, 'l'], [24.15, 32.18, 'h'],
    [33.25, 41.56, 'h'], [41.98, 44.74, 'l'], [45.25, 48.68, 'n'], [49.27, 54.11, 'n'], [54.67, 60.54, 'n'], [61.42, 66.0, 'n'],
];

Motion.scene({
    fps: 24,
    duration: 68.5,
    logical: [900, 1600],
    uses: ['styles/sumi-e/sumi.js', 'sandbox/2026-11-04-red-thread/cast.js', DIR + 'beasts.js', DIR + 'mouth.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 7.1, 'The meadow'], [7.1, 15.6, 'Face to face'], [15.6, 24.1, 'A request'], [24.1, 32.6, 'The wife'],
        [32.6, 41.8, 'Eat us both'], [41.8, 45.2, 'Vaah!'], [45.2, 49.3, 'To the stable'], [49.3, 54.6, 'The master'],
        [54.6, 61.2, 'The stick'], [61.2, 68.5, 'Moral'],
    ],

    draw(g, t, env) {
        const Sm = Sumi, B = Beasts, E = Ease;
        const d = Math.floor(t * 12 + 1e-6), tt = d / 12;
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp;
        const between = (a, b) => tt >= a && tt < b;
        const bump = (a, b) => Math.sin(seg(a, b) * Math.PI);
        const GY = 1150;
        const HIT = 58.6;
        const amp = MOUTH[Math.min(MOUTH.length - 1, d)] ?? 0;
        const speaking = (who) => LINES.some(([a, b, w]) => w === who && tt >= a && tt < b);

        // --- camera along the painting ---------------------------------------------------------
        const cam = Motion.keys([
            [0, [450, 860, 1.15]], [6.6, [450, 909, 1.4]], [15.6, [450, 909, 1.45]], [24.4, [450, 790, 1.1]],
            [32.4, [450, 790, 1.1]], [33.2, [450, 909, 1.45]], [44.8, [450, 909, 1.45]], [49.4, [1450, 909, 1.2]],
            [58.4, [1440, 909, 1.25]], [58.75, [1420, 909, 1.36]], [59.6, [1420, 900, 1.2]], [62.0, [1560, 860, 1.05]],
        ], tt);
        g.save();
        g.translate(450, 800);
        g.scale(cam[2], cam[2]);
        g.translate(-cam[0], -cam[1]);
        if (tt >= HIT && tt < HIT + 0.5) g.translate(Math.sin(tt * 97) * 10 * (1 - seg(HIT, HIT + 0.5)), 0);

        // --- the painting: paper, far range, hills, ground, tree, rock --------------------------
        Sm.paper(g, env, { x: -400, y: -200, w: 2900, h: 2000 });
        Sm.sun(g, env, 700, 420, 95, { color: '#a59f97', alpha: 0.6 });
        Sm.mountains(g, env, 'far', { x0: -400, x1: 2500, y: 1000, h: 540, ink: 0.16, peaks: 6 });
        Sm.mountains(g, env, 'mid', { x0: 600, x1: 2300, y: 1060, h: 200, ink: 0.3, peaks: 3 });
        Motion.sprite('tg:hill', { x: -420, y: 760, w: 1300, h: 460 }, env.k, (c) => Sm.hill(c, { x0: -400, x1: 860, base: 1110, h: 230, peaks: 2, ink: 0.6, seed: 'leftHill' })).draw(g);
        // a plum tree at the meadow's edge (cached)
        Motion.sprite('tg:tree', { x: -250, y: 450, w: 650, h: 760 }, env.k, (c) => Sm.tree(c, { base: [60, GY], ang: -Math.PI / 2 + 0.12, len: 560, w: 30, depth: 4, seed: 'plum', ink: 0.9 })).draw(g);
        // the ground: dry grass strokes along the meadow and the path
        Motion.sprite('tg:ground', { x: -420, y: GY - 80, w: 2900, h: 260 }, env.k, (c) => {
            Sm.stroke(c, [[-400, GY + 4], [400, GY - 2], [1100, GY + 6], [2450, GY]], { w: 7, ink: 0.55, dry: 0.75, seed: 'groundLine', taper: [0.02, 0.02], core: false });
            const r = Motion.rng('grass');
            for (let i = 0; i < 260; i++) {
                const x = -400 + r() * 2850, h = 16 + r() * 34, lean = (r() - 0.5) * 0.7;
                Sm.stroke(c, [[x, GY + 4 + r() * 30], [x + lean * h, GY - h + r() * 30]], { w: 3 + r() * 2, ink: 0.35 + r() * 0.4, dry: 0.6, seed: 'gr' + i, taper: [0, 0.7], core: false });
            }
            for (let i = 0; i < 6; i++) Sm.reed(c, 640 + i * 50 + r() * 20, GY + 6, 70 + r() * 50, { seed: 'reed' + i, ink: 0.7 });
        }).draw(g);
        // birds: two cranes crossing the sky once, and again at the end
        for (const [a, b, y0] of [[1, 12, 330], [24.5, 34, 360], [60.6, 68.5, 610]]) {
            if (!between(a, b)) continue;
            const u = seg(a, b);
            for (let i = 0; i < 2; i++) Sm.crane(g, lerp(cam[0] - 600, cam[0] + 600, u) - i * 90, y0 + i * 40, 46, (d + i * 3) % 6 / 6, { dir: 1 });
        }

        // mist drifting across the middle ground (continuous, pale washes)
        for (let i = 0; i < 4; i++) {
            const x = ((i * 700 + t * 14) % 2800) - 400;
            Sm.dab(g, x, GY - 70 - (i % 2) * 40, 260, 34, { seed: 'mist' + i, ink: 0.07, rough: 0.25 });
        }

        // --- the leopard -------------------------------------------------------------------------
        const leo = (() => {
            let x = 800, facing = -1, gait = 'prowl', crouch = 1, ph = tt * 1.0, greedy = 0, hop = 0, tilt = 0, lick = 0, lash = 0.3, shown = true;
            if (tt < 4.0) shown = false; // hidden behind the rock (the peek below)
            else if (tt < 6.5) (x = lerp(800, 660, seg(4.0, 6.5))), (greedy = 1);
            else if (tt < 15.6) (x = lerp(660, 640, seg(8.6, 11.7))), (gait = between(8.6, 11.7) ? 'prowl' : 'stand'), (greedy = 1), (lash = 0.8);
            else if (tt < 19.4) (x = 640), (gait = 'stand'), (crouch = 1 - seg(16.5, 18.0)), (greedy = 0.4);
            else if (tt < 41.9) {
                (x = 630), (gait = 'sit'), (crouch = 0);
                greedy = tt > 27.4 ? 1 : 0.4;
                if (between(35.5, 41.8) && d % 18 < 10) lick = 0.5 + 0.5 * Math.sin(tt * 9); // licking his lips, again and again
            } else if (tt < 45.2) {
                (x = 630), (gait = 'stand'), (crouch = 0), (greedy = 1), (hop = bump(42.0, 42.8) * 60);
                if (tt > 42.8) (gait = 'prowl'), (ph = tt * 2.4); // treading on the spot, eager
                if (tt > 44.2) facing = 1;
            } else if (tt < 48.7) (x = lerp(630, 1240, seg(45.2, 48.7))), (gait = 'bound'), (facing = 1), (ph = tt * 2.2), (hop = Math.abs(Math.sin(tt * 2.2 * Math.PI)) * 14), (crouch = 0), (greedy = 1);
            else if (tt < 56.0) (x = lerp(1240, 1330, seg(48.7, 55.8))), (gait = 'prowl'), (facing = 1), (crouch = 0.3), (ph = tt * 1.1), (greedy = 1);
            else if (tt < HIT) (x = 1330), (gait = 'stand'), (facing = 1), (crouch = 0.2), (greedy = 1);
            else if (tt < HIT + 0.5) (x = 1322), (gait = 'stand'), (facing = 1), (hop = bump(HIT, HIT + 0.5) * 70), (tilt = -0.35), (crouch = 0);
            else if (tt < 60.8) (x = lerp(1310, 760, seg(HIT + 0.5, 60.8))), (gait = 'flee'), (facing = -1), (ph = tt * 3), (crouch = 0);
            else shown = false;
            if (gait === 'sit') lash = 0.9;
            return { x, facing, gait, crouch, ph, greedy, hop, tilt, lick, lash, shown, jaw: speaking('l') ? amp : 0 };
        })();
        if (leo.shown) B.leopard(g, leo.x, GY, 0.8, leo);
        // the rock he hides behind (over him while he waits)
        {
            const rx = 790;
            Sm.dab(g, rx, GY - 46, 92, 56, { seed: 'rock', ink: 0.62, rough: 0.2 });
            Sm.stroke(g, [[rx - 86, GY - 40], [rx - 40, GY - 100], [rx + 30, GY - 104], [rx + 90, GY - 52]], { w: 12, ink: 0.95, dry: 0.65, seed: 'rockTop', taper: [0.1, 0.3] });
            Sm.stroke(g, [[rx - 20, GY - 96], [rx - 34, GY - 40]], { w: 8, ink: 0.8, dry: 0.8, seed: 'rockCrack', taper: [0, 0.5], core: false });
            // before he comes out: only his eyes over the rock, then his head
            if (tt < 4.0 && tt > 1.2) {
                const peek = seg(1.2, 2.4);
                B.leopard(g, 812, GY + 40 - peek * 40, 0.8, { facing: -1, gait: 'stand', crouch: 1, greedy: tt > 2.4 ? 1 : 0, seed: 'peek' });
                Sm.dab(g, rx, GY - 30, 96, 40, { seed: 'rockFront', ink: 0.62, rough: 0.18 });
            }
        }

        // --- the horse ---------------------------------------------------------------------------
        const hs = (() => {
            let x = 250, facing = 1, walking = false, ph = tt * 1.2, rear = 0, ears = 0, head = 0, tremble = 0;
            if (tt < 6.0) (x = lerp(-180, 250, seg(0.5, 6.0))), (walking = tt < 6.0);
            else if (tt < 15.6) {
                rear = bump(7.1, 8.4) * 0.9;
                ears = 1 - seg(12.3, 13.4);
                tremble = between(8.4, 12.3) ? 1.5 : 0;
                head = between(12.3, 15.6) ? 0.12 * bump(12.3, 15.4) : 0;
            } else if (tt < 45.2) {
                head = 0.08;
                if (between(28.5, 32.2)) head = 0.28; // alone in this world
                if (between(33.3, 34.6)) head = -0.18 * bump(33.3, 34.6); // «come with me»
                if (between(37.4, 41.6)) head = 0.3; // nobody left to cry
            } else if (tt < 49.2) (x = lerp(250, 1040, seg(45.2, 49.2))), (walking = true);
            else if (tt < 61.4) (x = 1040), (rear = bump(HIT, HIT + 0.9) * 0.4), (ears = bump(HIT, HIT + 1.2));
            else if (tt < 64.4) (x = lerp(1040, 1640, seg(61.4, 64.4))), (walking = true);
            else (x = 1640), (head = 0.15);
            ears = Math.max(ears, d % 37 < 3 ? 0.5 : 0); // an ear flicks now and then
            if (!walking) head += Math.sin(tt * 2.4) * 0.04; // breathing
            if (speaking('h')) head += amp * 0.07; // the head moves with the words
            return { x, facing, walking, ph, rear, ears, head, tremble, jaw: speaking('h') ? amp : 0 };
        })();
        const hp = B.horse(g, hs.x, GY, 0.78, hs);
        // the calming breath: two soft puffs of mist from the muzzle
        for (const t0 of [13.3, 14.4]) {
            const u = seg(t0, t0 + 0.9);
            if (u > 0 && u < 1) Sm.dab(g, hp.muzzle[0] + 20 + u * 40, hp.muzzle[1] + 6 - u * 10, 10 + u * 22, 6 + u * 12, { seed: 'breath' + t0, ink: 0.18 * (1 - u) });
        }

        // --- the ensō: his mare waiting at home (a thought painted in a circle) --------------------
        {
            const on = seg(24.3, 25.3), off = seg(31.7, 32.3);
            if (on > 0 && off < 1) {
                const cx = 450, cy = 520, r = 170;
                B.enso(g, cx, cy, r, on * (1 - off), 'enso');
                if (on > 0.6 && off <= 0) {
                    g.save();
                    g.translate(cx, cy + 110);
                    g.scale(0.36, 0.36);
                    g.translate(-1800, -GY);
                    B.stable(g, env, 1800, GY, 420);
                    B.horse(g, 1700, GY, 0.85, { facing: 1, ink: 0.5, mane: 1.5, head: 0.2, seed: 'mare' });
                    g.restore();
                }
            }
        }

        // --- the stable, the mare, the master and his stick -------------------------------------
        B.stable(g, env, 1950, GY, 420);
        if (tt > 45) B.horse(g, 1790, GY, 0.7, { facing: -1, ink: 0.5, mane: 1.5, head: tt > 64.2 ? 0.15 : 0.05, seed: 'mare' });
        {
            const MX = 1500;
            let face = 1, hands = null, stickTip = null, lean = 0;
            const grip = (a, b) => [a, b];
            if (tt < 50.2) (face = 1), (hands = null);
            else if (tt < 51.8) (face = -1), (hands = null);
            else if (tt < 52.6) (face = -1), (hands = [[1540, GY - 150], [1540, GY - 160]]);
            else if (tt < 56.8) (face = -1), (hands = [[1470, GY - 160], [1485, GY - 150]]), (stickTip = [1440, GY - 360]);
            else if (tt < HIT) {
                const u = E.inOut(seg(56.8, 58.3));
                hands = [[lerp(1470, 1500, u), lerp(GY - 160, GY - 300, u)], [lerp(1485, 1515, u), lerp(GY - 150, GY - 290, u)]];
                (face = -1), (stickTip = [lerp(1440, 1590, u), lerp(GY - 360, GY - 420, u)]), (lean = -0.08 * u);
            } else if (tt < 60.0) (face = -1), (hands = [[1430, GY - 170], [1445, GY - 165]]), (stickTip = [1340, GY - 70]), (lean = 0.18);
            else (face = -1), (hands = [[1470, GY - 180], [1475, GY - 170]]), (stickTip = [1460, GY - 2]);
            // the stick leans on the post until he takes it
            if (tt < 52.6) Sm.stroke(g, [[1552, GY - 4], [1538, GY - 230]], { w: 9, ink: 0.95, dry: 0.3, seed: 'stickRest', taper: [0, 0.1] });
            Cast.figure(g, { x: MX, y: GY, h: 270, face, kind: 'man', id: 'master', hands, lean });
            if (stickTip && hands) {
                const h0 = hands[0], dir = [stickTip[0] - h0[0], stickTip[1] - h0[1]], L = Math.hypot(...dir);
                const butt = [h0[0] - (dir[0] / L) * 40, h0[1] - (dir[1] / L) * 40];
                Sm.stroke(g, [butt, stickTip], { w: 9, ink: 0.95, dry: 0.3, seed: 'stick', taper: [0, 0.1] });
            }
            // the blow: one fast dry arc, then flicks of ink at the contact
            if (between(HIT - 0.15, HIT + 0.45)) {
                const u = seg(HIT - 0.15, HIT + 0.05);
                Sm.stroke(g, [[1600, GY - 430], [1540, GY - 330], [1440, GY - 200], [1340, GY - 90]], { w: 30, ink: 0.55, dry: 0.9, seed: 'swing', prog: u, taper: [0.2, 0.5], core: false });
                if (tt >= HIT) {
                    const r = Motion.rng('flicks');
                    for (let i = 0; i < 7; i++) {
                        const a = -Math.PI * 0.9 + r() * Math.PI * 0.8, l = 30 + r() * 40;
                        Sm.stroke(g, [[1335, GY - 90], [1335 + Math.cos(a) * l, GY - 90 + Math.sin(a) * l]], { w: 5, ink: 0.9, dry: 0.5, seed: 'fl' + i, taper: [0, 0.8], core: false });
                    }
                }
            }
            // the leopard's flight: streaks behind him
            if (between(HIT + 0.5, 60.8)) for (let i = 0; i < 3; i++) Sm.stroke(g, [[leo.x + 60, GY - 50 - i * 22], [leo.x + 170 + i * 30, GY - 50 - i * 22]], { w: 5, ink: 0.4, dry: 0.85, seed: 'run' + i, taper: [0.1, 0.9], core: false });
        }

        // grass in front, swaying in the wind
        for (let i = 0; i < 40; i++) {
            const x = -300 + i * 70 + (i % 3) * 13, h = 26 + (i % 4) * 9, sway = Math.sin(t * 1.8 + i * 0.7) * 7;
            Sm.stroke(g, [[x, GY + 14], [x + sway * 0.4, GY + 14 - h * 0.5], [x + sway, GY + 14 - h]], { w: 4, ink: 0.7, dry: 0.5, seed: 'fg' + i, taper: [0, 0.7], core: false });
        }

        g.restore();

        // --- words: the title and the moral, brush-written with a vermilion seal -------------------
        const seal = (x, y, s, ch, seed) => {
            Sm.fillPoly(g, Sm.blobPts(x, y, s, s, 0, seed, 0.06, 4).map((p, i) => p), Sm.RED);
            g.save();
            g.font = `${s * 1.3}px Kalam`;
            g.textAlign = 'center';
            g.fillStyle = Sm.PAPER;
            g.fillText(ch, x, y + s * 0.42);
            g.restore();
        };
        const write = (str, x, y, size, a, b, out = 1e9) => {
            const u = seg(a, b) * (1 - seg(out, out + 0.6));
            if (u <= 0) return;
            g.save();
            g.font = `${size}px Kalam`;
            const w = g.measureText(str).width;
            g.beginPath();
            g.rect(x - w / 2 - 10, y - size * 1.3, (w + 20) * u, size * 2);
            g.clip();
            g.textAlign = 'center';
            g.fillStyle = 'rgba(23,19,15,0.92)';
            g.fillText(str, x, y);
            g.restore();
        };
        write('तेंदुआ और घोड़ा', 450, 230, 76, 0.3, 1.4, 5.8);
        if (between(1.4, 6.4)) seal(450, 300, 26, 'घ', 'titleSeal');
        write('मुसीबत में कभी भी', 450, 250, 62, 62.4, 63.4);
        write('हिम्मत और समझदारी मत खोना', 450, 335, 62, 63.6, 64.8);
        if (tt >= 65.0) seal(450, 410, 28, 'सी', 'moralSeal');
    },

    post(ctx, t, env) {
        Sumi.grain(ctx, env, { amount: 0.5 });
    },
});
