// sone-ka-anda: the golden egg, as a Warli wall painting (54 s), cut to the user's
// ElevenLabs voice-over (private/voice.wav, re-timed by make-voice.sh). The line timings in
// the comments are measured on that track (see brief.md). One long mural: the market on the
// left, Ramu's yard on the right; the camera pans along it. Everything moves on twos (tt).
const DIR = 'sandbox/2026-11-11-sone-ka-anda/';

Motion.scene({
    fps: 24,
    duration: 54,
    logical: [1600, 900],
    uses: ['styles/warli/warli.js', DIR + 'cast.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 4.7, 'Poor village'], [4.7, 10.2, 'Market'], [10.2, 15.3, 'First egg'], [15.3, 18.0, 'Joy'],
        [18.0, 25.0, 'Getting rich'], [25.0, 29.3, 'Greed'], [29.3, 33.4, 'Warning'], [33.4, 37.98, 'Night'],
        [37.98, 40.0, 'The cut'], [40.0, 43.4, 'Nothing'], [43.4, 47.9, 'Morning'], [47.9, 54, 'Lesson'],
    ],

    draw(g, t, env) {
        const W = Warli, C = Cast, E = Ease, tt = W.twos(t);
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp;
        const GY = 790;
        // the yard
        const HOUSE = 300, BASKET = 500, NEST = 900, POST = 1080, COW = 1240, TREE = 1400;
        // the market, left of the yard on the same wall
        const STALL = -560, TRADER = -440, BUYER = -260;

        // --- clocks ---------------------------------------------------------------------
        const camX = Motion.keys([[0, 0], [4.4, 0], [5.6, -900], [8.4, -900], [10.2, 0]], tt);
        // nights: four quick days while the eggs pile up, then the long night of the cut
        let night = 0;
        if (tt > 18.1 && tt < 21.3) night = 0.5 - 0.5 * Math.cos((W.TAU * (tt - 18.1)) / 0.8);
        if (tt > 33.3) night = Math.max(night, E.inOut(seg(33.3, 34.2)) * (1 - E.inOut(seg(43.3, 44.1))));
        // the eggs: launched from the farmer's hands (the first) or from the nest, landing
        // in the basket 0.35 s later; at 21.55 they all fly into the hut, which turns rich
        const launches = [18.0, 18.9, 19.7, 20.5, 23.3, 24.2];
        const toHouse = 21.55;
        let inBasket = 0;
        launches.forEach((l, i) => {
            if (tt >= l + 0.35 && (i >= 4 || tt < toHouse)) inBasket++;
        });

        // --- the wall, the night ------------------------------------------------------------
        g.save();
        g.translate(-camX - 1100, 0);
        W.wall(g, { W: 2900, H: env.H, k: env.k }, { key: 'mural' });
        g.restore();
        // the wall as it looks now (for the rims that knock figures out of other paste)
        const dk = 0.55 * night, wallNow = `rgb(${[123, 59, 34].map((v, i) => Math.round(v + ([16, 4, 1][i] - v) * dk)).join(',')})`;
        if (night > 0) {
            g.fillStyle = `rgba(16,4,1,${0.55 * night})`;
            g.fillRect(-10, -10, env.W + 20, env.H + 20);
        }

        // sky (screen space): the sun by day, the moon by night
        if (night > 0.35) W.moon(g, 1150, 170, 52, { seed: 'moon' });
        else if (tt > 0.2) {
            const pale = tt > 43.4 ? 0.8 : 1;
            W.sun(g, 1150, 170, 70 * pale, { spin: tt * 0.2, grow: E.back(seg(0.2, 0.7)), seed: tt > 43.4 ? 'sun2' : 'sun' });
        }

        // flocks crossing the sky in the quiet stretches (screen space, right to left)
        [[1.0, 5.2, 290], [26.4, 32.4, 110], [45.0, 54.0, 330]].forEach(([a, b, y0], f) => {
            if (tt <= a || tt >= b) return;
            const u = (tt - a) / (b - a);
            for (let i = 0; i < 4; i++) {
                const x = lerp(1560, 40, u) + i * 55 - (i % 2) * 20, y = y0 + (i % 2) * 30 + Math.sin(tt * 4 + i) * 5;
                if (x > 70 && x < 1530) W.bird(g, x, y, 36, tt * 2.6 + i * 0.3, { seed: 'fl' + f + i, facing: -1 });
            }
        });

        // --- the mural, inside the border ----------------------------------------------------
        g.save();
        g.beginPath();
        g.rect(54, 54, env.W - 108, env.H - 108);
        g.clip();
        if (tt >= 37.98) {
            const amp = 14 * Math.exp(-(tt - 37.98) * 6);
            g.translate(Math.sin(tt * 97) * amp, Math.cos(tt * 83) * amp);
        }
        g.translate(-camX, 0);

        W.ground(g, -1000, 1560, GY, { prog: E.inOut(seg(0.3, 1.1)) });

        // market: the stall, two hens pecking, the trader
        C.stall(g, STALL, GY, 170, 'stall');
        C.hen(g, -800, GY, 62, { peck: (Math.floor(tt * 3) % 2) * 0.8, seed: 'mh1' });
        C.hen(g, -730, GY, 58, { peck: (Math.floor(tt * 3 + 1) % 2) * 0.8, facing: -1, seed: 'mh2' });
        const handsHen = tt >= 5.1 && tt < 8.1; // the trader holds the hen out
        const tr = W.human(g, TRADER, GY, 150, handsHen ? W.pose('reach') : tt >= 7.6 && tt < 8.3 ? W.pose('reach') : W.pose('stand'), { seed: 'trader' });
        if (handsHen) C.hen(g, tr.handR[0] + 6, tr.handR[1] + 20, 54, { seed: 'hen', facing: 1 });

        // the yard: the house, the basket, the nest, the post with the rooster, the tree, the cow
        const hutGone = E.seg(tt, 21.8, 22.05);
        if (hutGone < 1) W.hut(g, HOUSE, GY, 220, { seed: 'hut', prog: E.seg(tt, 0.4, 1.3) * (1 - hutGone) });
        C.house(g, HOUSE, GY, 240, seg(22.0, 22.9), 'house');
        if (tt > 0.9) C.basket(g, BASKET, GY, 110, inBasket);
        if (tt > 1.0) C.nest(g, NEST, GY, 90);
        if (tt > 1.0) {
            W.stroke(g, [[POST, GY], [POST, GY - 128]], { w: 6, seed: 'post' });
            W.stroke(g, [[POST - 16, GY - 128], [POST + 16, GY - 128]], { w: 5, seed: 'postcap' });
            const crow = tt > 43.7 && tt < 44.5 ? 1 : tt > 10.0 && tt < 10.4 ? 1 : 0;
            C.hen(g, POST, GY - 130, 76, { rooster: true, crow, facing: tt > 46.3 ? 1 : -1, seed: 'rooster' });
        }
        W.tree(g, TREE, GY, 430, { seed: 'peepal', prog: seg(0.5, 1.5) });
        C.cow(g, COW, GY, 170, { facing: -1, prog: seg(22.3, 23.0), ph: 0 });

        // the hen of the story
        if (tt >= 10.15 && tt < 43.4) {
            if (tt < 10.5) C.hen(g, NEST, GY - 12, 64, { state: 'sit', seed: 'hen' });
            else if (tt < 18.0) C.hen(g, 980, GY, 64, { peck: (Math.floor(tt * 2.5) % 3 === 0) * 0.8, seed: 'hen' });
            else if (tt < 37.98) C.hen(g, NEST, GY - 12, 64, { state: 'sit', asleep: night > 0.5 && tt > 33.5, seed: 'hen' });
            else if (tt >= 38.15) C.hen(g, NEST, GY, 64, { state: 'lie', seed: 'hen' });
            else C.hen(g, NEST, GY - 6, 64, { state: 'sit', asleep: true, seed: 'hen' });
        }
        // the first egg, on the nest until Ramu picks it up
        if (tt >= 10.5 && tt < 12.3) C.egg(g, NEST, GY - 14, 15, { glow: E.out(seg(10.5, 10.8)) * (tt < 11.6 ? 1 : 0.5), spin: tt * 0.4, seed: 'egg0' });
        // eggs in flight
        const arc = (p, q, u, h) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * h];
        launches.forEach((l, i) => {
            const u = seg(l, l + 0.35);
            if (u <= 0 || u >= 1) return;
            const from = i === 0 ? [760, GY - 175] : [NEST, GY - 20];
            const [x, y] = arc(from, [BASKET, GY - 60], u, 120);
            C.egg(g, x, y, 14, { seed: 'fly' + i });
        });
        {
            const u = seg(toHouse, toHouse + 0.35);
            if (u > 0 && u < 1) for (let i = 0; i < 4; i++) C.egg(g, ...arc([BASKET + (i - 1.5) * 18, GY - 66], [HOUSE, GY - 120], u, 90 + i * 20), 12, { seed: 'th' + i });
        }

        // --- Sita ------------------------------------------------------------------------------
        {
            let x = 620, pose = W.pose('sit'), facing = 1, plant = true, lean = 0;
            pose = { ...pose, armR: [0.1 - (Math.floor(tt * 3 + 1) % 3 === 0 ? 0.5 : 0), 0.0] };
            if (tt >= 12.6) {
                plant = false;
                if (tt < 13.4) (x = lerp(620, 690, seg(12.6, 13.4))), (pose = W.pose('walk', tt * 2.5));
                else if (tt < 15.3) (x = 690), (pose = W.pose('raise'));
                else if (tt < 18.0) (x = 680), (pose = W.pose('dance', tt * 1.4 + 0.5));
                else if (tt < 18.6) (x = lerp(680, 610, seg(18.0, 18.6))), (pose = W.pose('walk', tt * 2.5)), (facing = -1);
                else if (tt < 29.0) (x = 610), (pose = W.pose('stand'));
                else if (tt < 29.6) (x = lerp(610, 690, seg(29.0, 29.6))), (pose = W.pose('walk', tt * 2.5));
                else if (tt < 32.8) (x = 690), (pose = W.pose('reach'));
                else if (tt < 33.3) (x = lerp(690, 640, E.out(seg(32.8, 33.2)))), (pose = W.pose('stand')), (lean = -0.12);
                else if (tt < 34.2) (x = lerp(640, 610, seg(33.4, 34.2))), (pose = W.pose('walk', tt * 2)), (facing = -1);
                else (x = 610), (pose = W.pose('stand')), (lean = 0.22 + 0.03 * Math.sin(tt * 3)); // head bowed
            }
            if (tt > 1.1) W.human(g, x, GY, 140, { ...pose, lean: (pose.lean || 0) + lean }, { sex: 'f', seed: 'sita', facing, plant, rim: true, rimColor: wallNow });
        }

        // --- Ramu ------------------------------------------------------------------------------
        {
            const carry = W.pose('carry');
            const akimbo = { ...W.pose('stand'), armR: [0.6, 2.4], armL: [Math.PI - 0.6, Math.PI - 2.4] };
            const bite = Math.floor(tt * 3) % 3 === 0 ? 0.5 : 0; // tearing the roti, on twos
            let x = 720, pose = { ...W.pose('sit'), armR: [0.1 - bite, -bite * 2] }, facing = -1, plant = true, held = null, sickle = false;
            if (tt >= 3.9) plant = false;
            if (tt >= 3.9 && tt < 5.5) (x = lerp(720, BUYER, seg(3.9, 5.5))), (pose = W.pose('walk', tt * 2.6));
            else if (tt >= 5.5 && tt < 7.5) (x = BUYER), (pose = W.pose('stand'));
            else if (tt >= 7.5 && tt < 8.1) (x = BUYER), (pose = W.pose('reach')), (held = 'coin');
            else if (tt >= 8.1 && tt < 8.3) (x = BUYER), (pose = carry), (held = 'hen');
            else if (tt >= 8.3 && tt < 10.15) (x = lerp(BUYER, 820, seg(8.3, 10.15))), (pose = { ...W.pose('walk', tt * 2.8), armR: carry.armR, armL: carry.armL }), (facing = 1), (held = 'hen');
            else if (tt >= 10.15 && tt < 10.75) (x = 820), (pose = W.pose('stand')), (facing = 1);
            else if (tt >= 10.75 && tt < 11.3) (x = lerp(820, 770, E.out(seg(10.75, 11.0)))), (pose = W.pose('raise')), (facing = 1);
            else if (tt >= 11.3 && tt < 11.8) (x = 770), (pose = W.pose('stand')), (facing = 1);
            else if (tt >= 11.8 && tt < 12.4) (x = lerp(770, 840, seg(11.8, 12.0))), (pose = W.pose('kneel', tt)), (facing = 1), (plant = true);
            else if (tt >= 12.4 && tt < 15.3) (x = lerp(840, 760, seg(12.4, 13.0))), (pose = W.pose('hold')), (facing = 1), (held = 'egg');
            else if (tt >= 15.3 && tt < 18.0) (x = 760), (pose = W.pose('dance', tt * 1.4)), (facing = 1), (held = 'egg');
            else if (tt >= 18.0 && tt < 23.4) (x = 760), (pose = W.pose('stand')), (facing = 1);
            else if (tt >= 23.4 && tt < 25.07) (x = 760), (pose = akimbo), (facing = 1);
            else if (tt >= 25.07 && tt < 26.2) (x = 760), (pose = { ...akimbo, armR: [-1.3, -1.6 + 0.3 * (Math.floor(tt * 6) % 2)] }), (facing = 1); // «sirf ek roz?»
            else if (tt >= 26.2 && tt < 32.72) (x = 760), (pose = akimbo), (facing = 1);
            else if (tt >= 32.72 && tt < 33.3) (x = 760), (pose = W.pose('reach')), (facing = -1); // «chup raho!»
            else if (tt >= 33.3 && tt < 34.6) (x = 760), (pose = W.pose('stand')), (facing = 1);
            else if (tt >= 34.6 && tt < 37.98) (x = lerp(760, 830, seg(34.6, 36.8))), (pose = W.pose('creep', tt < 36.8 ? tt * 1.5 : 0.05 + 0.05 * Math.sin(tt * 37))), (facing = 1), (sickle = true);
            else if (tt >= 37.98 && tt < 38.7) (x = 830), (pose = W.pose('strike')), (facing = 1), (sickle = true);
            else if (tt >= 38.7 && tt < 42.0) (x = 812), (pose = W.pose('kneel', tt * 4)), (facing = 1), (plant = true);
            else if (tt >= 42.0) (x = 790), (pose = W.pose('grieve', tt * 2)), (facing = 1), (plant = true);
            if (tt >= 1.1) {
            const parts = W.human(g, x, GY, 150, pose, { seed: 'ramu', facing, plant, rim: true, rimColor: wallNow });
            const mid = [(parts.handL[0] + parts.handR[0]) / 2, (parts.handL[1] + parts.handR[1]) / 2];
            if (tt < 3.9) W.dot(g, 670, parts.handR[1] + 4, 14, { seed: 'roti' }); // the one roti, shared
            if (held === 'hen') {
                W.dot(g, mid[0] + facing * 4, mid[1] - 8, 30, { color: wallNow, holes: 0, seed: 'henrim' });
                C.hen(g, mid[0] + facing * 4, mid[1] + 18, 54, { seed: 'hen', facing });
            }
            if (held === 'coin') {
                const u = seg(7.6, 8.0);
                C.coin(g, lerp(parts.handR[0], tr.handR[0], u), lerp(parts.handR[1], tr.handR[1], u) - Math.sin(u * Math.PI) * 30, 9);
            }
            if (held === 'egg') C.egg(g, mid[0], Math.min(parts.handL[1], parts.handR[1]) + 6, 16, { glow: 0.6, spin: tt * 0.4, seed: 'egg0' });
            if (sickle) C.sickle(g, parts.handR[0], parts.handR[1], tt < 37.98 ? -2.5 : 1.0, 80);
            if (tt >= 38.7) C.sickle(g, 760, GY - 4, 0.1, 70, 'dropped');

            // thought bubbles: the gold he dreams of, then the nothing he finds
            const [hx, hy] = parts.head;
            const dream = seg(26.2, 26.8) * (1 - seg(29.3, 29.5));
            C.bubble(g, hx + 20, hy - 30, 930, 360, 150, dream, (gg) => {
                [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [-0.5, -1], [0.5, -1], [-1.5, -1], [1.5, -1], [0, -2], [-1, -2], [1, -2], [0.5, -3], [-0.5, -3]].forEach(([i, j], n) =>
                    C.egg(gg, 870 + i * 26, 450 + j * 30, 12, { seed: 'dream' + n, glow: (Math.floor(tt * 6) + n) % 5 === 0 ? 0.25 : 0, spin: n }));
                gg.save();
                gg.translate(1010, 445);
                gg.scale(0.33, 0.33);
                C.house(gg, 0, 0, 240, 1, 'palace');
                gg.restore();
            }, 'dream');
            const none = seg(40.4, 41.9) * (1 - seg(42.0, 42.2));
            C.bubble(g, hx + 20, hy - 30, 960, 420, 100, none, null, 'empty');
            }
        }

        // feathers drifting down after the cut
        if (tt > 38.05 && tt < 43.4) {
            const r = Motion.rng('feathers');
            for (let i = 0; i < 7; i++) {
                const x0 = NEST + (r() - 0.5) * 60, y0 = GY - 60 - r() * 40, ph = r() * 6, d = tt - 38.05;
                const x = x0 + Math.sin(d * 3 + ph) * 26 + d * 20 * (r() - 0.5), y = Math.min(GY - 4, y0 - 50 * Math.exp(-d * 4) + 24 * d);
                W.fill(g, [[x - 7, y], [x, y - 3], [x + 7, y], [x, y + 3]].map((p) => W.rot(p, ph + d, [x, y])), { seed: 'fe' + i, wob: 0.2, holes: 0 });
            }
        }
        // the cut: one slash of paste across the frame, gone a moment later
        if (tt >= 37.98 && tt < 38.6) W.stroke(g, [[NEST - 120, GY - 230], [NEST + 10, GY - 110], [NEST + 110, GY - 10]], { w: 9, seed: 'slash', prog: seg(37.98, 38.06), dry: 0.5 });

        // the village dances (a tarpa ring on the wall above the yard)
        const ring = seg(15.3, 15.9) * (1 - seg(17.8, 18.2));
        if (ring > 0) W.tarpaRing(g, 760, 330, 105, { H: 60, t: tt, spin: tt * 0.3, appear: ring, seed: 'gaon' });

        g.restore();

        // --- frame and words (screen space) ---------------------------------------------------
        W.border(g, env, { prog: E.inOut(seg(0, 1.0)) });
        const write = (text, x, y, size, a, b, out = 1e9) => {
            const u = seg(a, b) * (1 - seg(out, out + 0.5));
            if (u <= 0) return;
            g.save();
            g.font = `${size}px Kalam`;
            const w = g.measureText(text).width;
            g.beginPath();
            g.rect(x - 10, y - size * 1.4, (w + 20) * u, size * 2.2);
            g.clip();
            g.fillStyle = W.PASTE;
            g.fillText(text, x, y);
            g.restore();
        };
        write('सोने का अंडा', 110, 180, 72, 0.3, 1.2, 4.2);
        write('लालच बुरी बला है', 110, 190, 84, 49.5, 50.9);
    },

    post(ctx, t, env) {
        Warli.grain(ctx, env, { amount: 0.6 });
    },
});
