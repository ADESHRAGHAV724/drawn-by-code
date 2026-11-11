// laalchi-siyaar: «The greedy jackal», a 9:16 YouTube Short drawn as an old book etching
// (cross-hatched ink on aged paper, a plate mark and neat lines), cut to the user's
// ElevenLabs voice-over (private/voice.wav, re-timed by make-voice.sh; timings in brief.md).
// No subtitles: the title and the moral are printed in the plate's top margin. No blood:
// the arrow stands in the boar's belly, the blows are engraved impact rays and dust.
const DIR = 'sandbox/2026-11-11-laalchi-siyaar/';

const LINES = [
    [0.5, 4.48, 'n'], [5.08, 9.41, 'n'], [10.02, 14.38, 'n'], [14.88, 20.71, 'n'], [21.28, 26.98, 'n'], [27.52, 34.34, 'n'],
    [34.59, 38.9, 'j'], [39.17, 44.3, 'n'], [44.58, 49.69, 'j'], [49.93, 57.7, 'n'], [58.13, 60.8, 'n'], [61.38, 65.06, 'n'],
];

Motion.scene({
    fps: 24,
    duration: 67.5,
    logical: [900, 1600],
    uses: [DIR + 'etch.js', DIR + 'cast.js', DIR + 'mouth.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 5.0, 'The jackal'], [5.0, 10.0, 'The chase'], [10.0, 14.8, 'The arrow'], [14.8, 21.2, 'The tusk'],
        [21.2, 27.4, 'Both fall'], [27.4, 34.5, 'Happy'], [34.5, 39.1, 'So much food'], [39.1, 44.5, 'The bow'],
        [44.5, 49.8, 'Save it'], [49.8, 54.6, 'Chewing'], [54.6, 61.2, 'Snap'], [61.2, 67.5, 'Moral'],
    ],

    draw(g, t, env) {
        const X = Etch, C = Cast, E = Ease;
        const d = Math.floor(t * 12 + 1e-6), tt = d / 12;
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp, lerpPt = E.lerpPt;
        const between = (a, b) => tt >= a && tt < b;
        const bump = (a, b) => Math.sin(seg(a, b) * Math.PI);
        const GY = 1180, PI = Math.PI;
        const PLATE = { x: 40, y: 210, w: 820, h: 1180 };
        const amp = MOUTH[Math.min(MOUTH.length - 1, d)] ?? 0;
        const speaking = (who) => LINES.some(([a, b, w]) => w === who && tt >= a && tt < b);
        const SNAP = 54.6, HIT_A = 12.3, TUSK = 19.6, FALL = 24.3;

        X.paper(g, env, PLATE);

        // --- camera inside the plate ---------------------------------------------------------
        const cam = Motion.keys([
            [0, [200, 1030, 1.45]], [4.8, [220, 1030, 1.45]], [8.4, [1150, 1000, 1.05]], [11.8, [1150, 1000, 1.05]],
            [12.2, [1380, 1060, 1.45]], [14.6, [1380, 1060, 1.45]], [16.6, [1250, 1020, 1.2]], [21.0, [1120, 1020, 1.2]],
            [26.8, [1080, 1030, 1.15]], [28.4, [760, 990, 0.95]], [34.4, [700, 990, 0.95]], [35.0, [470, 1060, 1.45]],
            [39.0, [470, 1060, 1.45]], [41.0, [520, 1090, 1.6]], [54.5, [520, 1090, 1.6]], [55.4, [440, 1080, 1.4]],
            [57.0, [380, 1100, 1.6]], [60.6, [380, 1100, 1.6]], [62.2, [720, 1000, 0.95]],
        ], tt);
        g.save();
        g.beginPath();
        g.rect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
        g.clip();
        g.translate(450, 800);
        g.scale(cam[2], cam[2]);
        g.translate(-cam[0], -cam[1]);
        const shake = tt >= SNAP + 0.1 && tt < SNAP + 0.6 ? 8 * (1 - seg(SNAP + 0.1, SNAP + 0.6)) : tt >= TUSK && tt < TUSK + 0.4 ? 6 * (1 - seg(TUSK, TUSK + 0.4)) : 0;
        if (shake) g.translate(Math.sin(tt * 97) * shake, Math.cos(tt * 83) * shake);

        // --- the landscape (one cached etching) ------------------------------------------------
        const BG = { x: -500, y: 300, w: 2500, h: 1250 };
        Motion.sprite('siyaar:bg', BG, env.k * 1.7, (c) => {
            // sky: horizontal ruled lines, closer at the top
            for (let y = BG.y, i = 0; y < 960; i++) {
                c.strokeStyle = X.INK;
                c.globalAlpha = 0.55;
                c.lineWidth = 0.8;
                c.beginPath();
                c.moveTo(BG.x, y);
                c.lineTo(BG.x + BG.w, y);
                c.stroke();
                y += 5 + (y - BG.y) * 0.025;
            }
            c.globalAlpha = 1;
            // clouds
            for (const [cx, cy, s] of [[60, 560, 1.2], [900, 470, 1.4], [1500, 600, 1]]) {
                const pts = Array.from({ length: 22 }, (_, i) => {
                    const a = (i / 22) * PI * 2, rr = 1 + 0.18 * Math.sin(a * 5 + cx);
                    return [cx + Math.cos(a) * 150 * s * rr, cy + Math.sin(a) * 55 * s * rr];
                });
                X.form(c, pts, { tone: 0.12, shade: 0.35, angle: 0, seed: 'cloud' + cx, lw: 1.6, raw: true });
            }
            // far hills
            X.form(c, [[BG.x, 1010], [BG.x, 930], [-200, 880], [100, 930], [380, 860], [700, 920], [1000, 850], [1300, 910], [1600, 870], [1900, 930], [2000, 920], [2000, 1010]], { tone: 0.35, shade: 0.4, angle: 0.15, seed: 'hills', lw: 1.6 });
            // background trees and bushes
            const tree = (x, h, s, seed) => {
                X.form(c, [[x - 18 * s, GY - 40], [x - 12 * s, GY - h * 0.55], [x + 12 * s, GY - h * 0.55], [x + 20 * s, GY - 40]], { tone: 0.55, shade: 0.7, angle: 1.4, seed: seed + 't', lw: 2 });
                const r = Motion.rng(seed);
                const blobs = Array.from({ length: 7 }, () => [x + (r() - 0.5) * 160 * s, GY - h * (0.62 + r() * 0.3), (50 + r() * 40) * s]);
                for (const [bx, by, br] of blobs) X.form(c, Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * PI * 2; return [bx + Math.cos(a) * br * (1 + 0.12 * Math.sin(a * 6)), by + Math.sin(a) * br * 0.8]; }), { tone: 0.45, shade: 0.8, angle: -0.8, seed: seed + bx.toFixed(0), lw: 1.8, raw: true });
            };
            tree(-300, 560, 1.2, 'bt1');
            tree(1560, 520, 1.1, 'bt2');
            tree(1830, 600, 1.3, 'bt3');
            for (const [bx, s] of [[-80, 1], [880, 0.8], [1420, 1.1], [1700, 0.9]]) X.form(c, Array.from({ length: 18 }, (_, i) => { const a = PI + (i / 17) * PI; return [bx + Math.cos(a) * 90 * s * (1 + 0.1 * Math.sin(a * 7)), GY - 4 + Math.sin(a) * 60 * s]; }), { tone: 0.5, shade: 0.8, angle: -0.6, seed: 'bush' + bx, lw: 1.8, raw: true });
            // the ground: ruled earth, a worn path, tufts and pebbles
            X.form(c, [[BG.x, GY - 6], [BG.x + BG.w, GY - 6], [BG.x + BG.w, BG.y + BG.h], [BG.x, BG.y + BG.h]], { tone: 0.22, shade: 0.25, angle: 0.05, seed: 'earth', lw: 2, raw: true });
            const r = Motion.rng('tufts');
            for (let i = 0; i < 120; i++) {
                const x = BG.x + r() * BG.w, y = GY + r() * 260, h = 10 + r() * 18;
                for (const a of [-0.5, 0, 0.45]) X.stroke(c, [[x, y], [x + Math.sin(a) * h, y - Math.cos(a) * h]], 1.4, { raw: true });
            }
            for (let i = 0; i < 40; i++) {
                const x = BG.x + r() * BG.w, y = GY + 10 + r() * 250, w = 6 + r() * 10;
                X.form(c, [[x - w, y], [x - w * 0.5, y - w * 0.6], [x + w * 0.6, y - w * 0.5], [x + w, y]], { tone: 0.4, shade: 0, lw: 1.2, seed: 'peb' + i, raw: true });
            }
        }).draw(g);

        // --- the cast ------------------------------------------------------------------------
        const run = (ph, amp = 0.5) => {
            const s = Math.sin(ph * PI * 2);
            return [[PI / 2 + amp * s, PI / 2 + amp * s + 0.5 * Math.max(0, -s)], [PI / 2 - amp * s, PI / 2 - amp * s + 0.5 * Math.max(0, s)]];
        };

        // the boar
        const bo = (() => {
            let x = 760, facing = 1, ph = tt * 2.2, runN = false, head = 0, mouth = 0, lift = 0, rot = 0, lying = false, arrow = tt >= HIT_A, eyesClosed = false;
            if (tt < 5.1) x = -400;
            else if (tt < 11.0) (x = lerp(760, 1430, E.out(seg(5.1, 11.0)))), (runN = true);
            else if (tt < 14.9) {
                x = 1430;
                head = 0.15;
                if (between(HIT_A, HIT_A + 0.5)) (lift = bump(HIT_A, HIT_A + 0.5) * 22), (rot = -0.12 * bump(HIT_A, HIT_A + 0.5));
                eyesClosed = between(HIT_A, 14.0);
                if (between(HIT_A + 0.5, 14.9)) (lift = Math.abs(Math.sin(tt * 7)) * 5), (head = 0.15 + (d % 3 === 0 ? 0.08 : 0)); // panting, wincing
            } else if (tt < 16.9) (x = 1430), (head = -0.45), (mouth = d % 2 ? 1 : 0.7);
            else if (tt < TUSK) (facing = -1), (x = lerp(1430, 1250, seg(17.2, TUSK))), (runN = tt > 17.2), (ph = tt * 3), (head = 0.25);
            else if (tt < 25.0) {
                (facing = -1), (x = lerp(1250, 1225, seg(TUSK, 22.4))), (head = between(22.2, 22.7) ? -0.35 : 0.15);
            } else if (tt < 26.2) (facing = -1), (x = 1230), (rot = 0.3 * seg(25.0, 26.2)), (head = 0.3);
            else (facing = -1), (x = 1240), (lying = true), (eyesClosed = true);
            return { x, facing, ph, run: runN, head, mouth, lift, rot, lying, arrow, eyesClosed };
        })();
        const bp = bo.x > -300 ? C.boar(g, bo.x, GY, 0.9, bo) : null;

        // the hunter
        const hu = (() => {
            let x = 560, facing = 1, legs, hands = null, lean = 0, rot = 0, lying = false, eyesClosed = false, bowAim = 0, mouthOpen = 0, holdBow = true, nockHand = false;
            const stand = [[PI / 2 + 0.12, PI / 2], [PI / 2 - 0.12, PI / 2]];
            legs = stand;
            if (tt < 5.1) x = -400;
            else if (tt < 9.6) (x = lerp(560, 1060, seg(5.1, 9.6))), (legs = run(tt * 2.2)), (hands = [[-30 + Math.sin(tt * 14) * 20, -150], [30 - Math.sin(tt * 14) * 20, -150]]);
            else if (tt < 12.0) {
                x = 1060;
                legs = [[PI / 2 + 0.3, PI / 2 + 0.1], [PI / 2 - 0.25, PI / 2 - 0.05]];
                const u = E.out(seg(10.2, 11.2));
                hands = [[lerp(20, -6, u), lerp(-170, -240, u)], [lerp(40, 66, u), lerp(-170, -232, u)]];
                (bowAim = 1), (nockHand = true);
            } else if (tt < 17.2) (x = 1060), (legs = [[PI / 2 + 0.3, PI / 2 + 0.1], [PI / 2 - 0.25, PI / 2 - 0.05]]), (hands = [[-20, -200], [66, -232]]), (bowAim = 1);
            else if (tt < TUSK) (x = 1060), (hands = [[-40, -260], [60, -250]]), (lean = -0.1), (mouthOpen = 1), (bowAim = 1);
            else if (tt < FALL) (x = lerp(1060, 1040, seg(TUSK, 21))), (lean = -0.25 - 0.08 * bump(22.4, 23.0)), (hands = [[-60, -300], [40, -300]]), (mouthOpen = 1), (legs = [[PI / 2 + 0.35, PI / 2 + 0.2], [PI / 2 - 0.2, PI / 2 + 0.25]]);
            else if (tt < FALL + 0.6) (x = 1040), (rot = -seg(FALL, FALL + 0.6) * (PI / 2 - 0.06)), (hands = [[-60, -300], [40, -300]]), (holdBow = false);
            else (x = 1040), (lying = true), (eyesClosed = true), (holdBow = false);
            return { x, facing, legs, hands, lean, rot, lying, eyesClosed, bowAim, mouthOpen, holdBow, nockHand };
        })();
        let hp = null;
        if (hu.x > -300) hp = C.hunter(g, hu.x, GY, 300, hu);

        // the bow: in his hand, then flung beside him, leaning on a stone
        const ROCK = [650, GY];
        // a cut stump (the bow leans on it)
        X.form(g, [[ROCK[0] - 40, GY + 4], [ROCK[0] - 30, GY - 118], [ROCK[0] + 30, GY - 118], [ROCK[0] + 40, GY + 4]], { tone: 0.5, shade: 0.8, angle: 1.45, seed: 'stump', lw: 2.4, raw: true });
        X.form(g, Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * PI * 2; return [ROCK[0] + Math.cos(a) * 30, GY - 118 + Math.sin(a) * 9]; }), { tone: 0.05, shade: 0, seed: 'stumpTop', lw: 2, raw: true });
        for (const r of [8, 16, 24]) X.stroke(g, Array.from({ length: 17 }, (_, i) => { const a = (i / 16) * PI * 2; return [ROCK[0] + Math.cos(a) * r, GY - 118 + Math.sin(a) * r * 0.3]; }), 1, { raw: true });
        const restA = [480, GY - 4], restB = [622, GY - 122];
        let bowA, bowB, bend = 0.22, nock = null, snapped = 0, fray = 0;
        if (hp && hu.holdBow) {
            const grip = hp.hands[1];
            const vert = hu.bowAim ? 0 : 0.9; // carried slanting, aimed upright
            bowA = [grip[0] - Math.sin(vert) * 110, grip[1] - Math.cos(vert) * 110];
            bowB = [grip[0] + Math.sin(vert) * 110, grip[1] + Math.cos(vert) * 110];
            bend = hu.bowAim ? -0.18 : -0.15;
            if (hu.nockHand) nock = hp.hands[0];
        } else if (tt >= FALL && tt < FALL + 0.5) {
            const u = E.out(seg(FALL, FALL + 0.5)), g0 = [1100, GY - 300];
            bowA = lerpPt([g0[0] - 20, g0[1] - 110], restA, u);
            bowB = lerpPt([g0[0] + 20, g0[1] + 110], restB, u);
            bowB[1] -= Math.sin(u * PI) * 120;
        } else if (tt >= FALL) {
            (bowA = restA), (bowB = restB);
            if (tt >= 49.9) fray = seg(49.9, SNAP);
            if (tt >= SNAP) {
                // the string parts and the stave springs back: it swings up about its foot
                // through the jackal's face, then drops flat
                snapped = seg(SNAP, SNAP + 0.3);
                const sw = tt < SNAP + 0.12 ? -0.95 * seg(SNAP, SNAP + 0.12) : -0.95 * (1 - E.out(seg(SNAP + 0.12, SNAP + 0.9))) + 0.75 * E.out(seg(SNAP + 0.12, SNAP + 0.9));
                bowB = C.rotP(restB, sw, restA);
                bend = lerp(0.22, 0.04, seg(SNAP, SNAP + 0.2));
            }
        }
        if (bowA) C.bow(g, bowA, bowB, { bend, nock, snapped, fray, seed: 'bow' });
        const stringMid = bowA ? [(bowA[0] + bowB[0]) / 2, (bowA[1] + bowB[1]) / 2] : null;

        // the arrow in flight
        if (between(12.0, HIT_A) && hp && bp) {
            const u = seg(12.0, HIT_A);
            const from = hp.hands[1], to = bp.belly;
            const tip = lerpPt(from, to, u), tail = lerpPt(from, to, Math.max(0, u - 0.18));
            C.arrowAt(g, [tail[0] - 60, tail[1] - 6], tip, 'flying');
        }
        // the boar's cry, the hits
        if (bp && between(14.9, 16.9)) X.impact(g, bp.snout[0] + 30, bp.snout[1] - 10, 70, ((tt - 14.9) % 0.5) / 0.5, 'cry' + Math.floor((tt - 14.9) / 0.5));
        if (bp) X.impact(g, bp.belly[0] - 10, bp.belly[1], 60, seg(HIT_A, HIT_A + 0.5), 'arrowHit');
        X.impact(g, 1080, GY - 130, 90, seg(TUSK, TUSK + 0.5), 'tusk1');
        X.impact(g, 1060, GY - 170, 80, seg(22.4, 22.9), 'tusk2');
        X.dust(g, 960, GY, 220, seg(FALL + 0.5, FALL + 1.6), 'fallDust');
        X.dust(g, 1240, GY, 200, seg(26.0, 27.2), 'boarDust');

        // the jackal
        const ja = (() => {
            let x = -60, facing = 1, ph = tt * 1.6, walking = false, head = 0, jaw = 0, tail = 0.3, lift = 0, rot = 0, lying = false, eyesClosed = false, sly = false;
            if (tt < 4.6) (x = lerp(-60, 180, seg(0.5, 4.5))), (walking = tt < 4.5), (head = 0.3 + Math.sin(tt * 5) * 0.08);
            else if (tt < 30.5) {
                x = 180;
                head = d % 40 < 4 ? -0.08 : 0;
                tail = 0.2 + 0.1 * Math.sin(tt * 2);
                if (between(26.5, 30.5)) jaw = d % 24 < 6 ? 0.3 : 0; // licking his lips
            } else if (tt < 32.0) (x = lerp(180, 330, seg(30.5, 32.0))), (walking = true);
            else if (tt < 41.5) {
                x = 330;
                tail = 0.8 + 0.2 * Math.sin(tt * 12);
                lift = bump(32.4, 33.0) * 40 + bump(33.2, 33.8) * 30 + (between(34.6, 35.1) ? bump(34.6, 35.1) * 30 : 0);
                if (tt > 39.2) head = 0.3 * seg(39.6, 40.4);
            } else if (tt < 42.6) (x = lerp(330, 424, seg(41.5, 42.5))), (walking = true), (head = 0.3);
            else if (tt < 49.9) (x = 424), (head = 0.35 + (tt < 44.5 ? 0.12 * Math.sin(tt * 11) : 0)), (sly = tt > 44.5), (tail = 0.5 + 0.3 * Math.sin(tt * 3)); // sniffing the string
            else if (tt < SNAP + 0.1) (x = 424), (head = 0.6), (jaw = d % 2 ? 0.7 : 0.2), (tail = 0.6);
            else if (tt < SNAP + 1.0) {
                const u = seg(SNAP + 0.1, SNAP + 1.0);
                (x = lerp(424, 300, u)), (lift = Math.sin(u * PI) * 110), (rot = -1.4 * E.inOut(u)), (head = -0.4);
            } else (x = 300), (lying = true), (eyesClosed = true);
            if (speaking('j')) (jaw = amp), (head += amp * 0.14), (lift += amp * 8), (tail = 0.6 + 0.4 * Math.sin(tt * 9));
            if (between(49.9, SNAP)) (x += [0, -10, 4, -6][d % 4]), (head += [0.12, -0.08, 0.06, -0.04][d % 4]), (tail = 0.4 + 0.4 * (d % 2)); // tugging at the string
            if (lying) tail = 0.2 + 0.3 * Math.max(0, Math.sin(tt * 4)); // a feeble twitch
            return { x, facing, ph, walking, head, jaw, tail, lift, rot, lying, eyesClosed, sly };
        })();
        const jp = C.jackal(g, ja.x, GY, 0.9, ja);
        // the blow on the muzzle, the landing, the daze
        X.impact(g, 556, GY - 72, 90, seg(SNAP + 0.06, SNAP + 0.6), 'snap');
        X.dust(g, 300, GY, 260, seg(SNAP + 1.0, SNAP + 2.2), 'landDust');

        // vultures circling over the two who lie there (from the fall on)
        if (tt > 25.5) for (let i = 0; i < 3; i++) {
            const a = tt * 0.7 + (i / 3) * PI * 2, bx = 900 + Math.cos(a) * 260, by = 640 + Math.sin(a) * 70 - i * 20;
            const up = (d + i) % 4 < 2 ? 1 : 0.4, f = Math.sin(a) > 0 ? -1 : 1;
            X.form(g, [[bx - 14 * f, by], [bx + 16 * f, by - 3], [bx + 22 * f, by + 1], [bx - 12 * f, by + 4]], { tone: 0.9, shade: 0, lw: 1.4, seed: 'vb' + i, raw: true });
            X.stroke(g, [[bx - 4, by], [bx - 24, by - 16 * up], [bx - 46, by - 6 * up]], 3, { raw: true });
            X.stroke(g, [[bx + 4, by], [bx + 24, by - 16 * up], [bx + 46, by - 6 * up]], 3, { raw: true });
        }
        // leaves drifting down from the tree, each on its own loop
        for (let i = 0; i < 6; i++) {
            const per = 6 + i, u = ((tt + i * 2.3) % per) / per, x0 = 160 + i * 45;
            const lx = x0 + Math.sin(u * 9 + i) * 30 + u * 60, ly = GY - 700 + u * 700, la = Math.sin(u * 7 + i) * 1.2;
            X.form(g, [[0, 0], [7, -4], [16, 0], [7, 4]].map(([px, py]) => [lx + px * Math.cos(la) - py * Math.sin(la), ly + px * Math.sin(la) + py * Math.cos(la)]), { tone: 0.4, shade: 0, lw: 1.1, seed: 'leaf' + i, raw: true });
        }

        // the tree he hides behind, in front of everything there
        {
            const TX = 250;
            X.form(g, [[TX - 44, GY + 6], [TX - 34, GY - 300], [TX - 52, GY - 520], [TX - 30, GY - 760], [TX + 26, GY - 760], [TX + 36, GY - 520], [TX + 30, GY - 300], [TX + 46, GY + 6]], { tone: 0.55, shade: 0.85, angle: 1.45, seed: 'trunk', lw: 2.6 });
            for (let i = 0; i < 9; i++) X.stroke(g, [[TX - 20 + (i % 3) * 14, GY - 60 - i * 70], [TX - 14 + (i % 3) * 14, GY - 110 - i * 70]], 1.6, { raw: true });
            X.form(g, [[TX + 30, GY - 470], [TX + 120, GY - 560], [TX + 128, GY - 548], [TX + 36, GY - 452]], { tone: 0.5, shade: 0.6, seed: 'branch', lw: 2 });
            const r = Motion.rng('crown');
            for (let i = 0; i < 9; i++) {
                const bx = TX - 160 + r() * 360, by = GY - 760 - r() * 160, br = 70 + r() * 50;
                X.form(g, Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * PI * 2; return [bx + Math.cos(a) * br * (1 + 0.12 * Math.sin(a * 6 + i)), by + Math.sin(a) * br * 0.8]; }), { tone: 0.5, shade: 0.85, angle: -0.8, seed: 'crown' + i, lw: 1.8, raw: true });
            }
        }
        // after the blow he lands in front of the tree's foot: draw him again on top
        if (ja.lying || tt >= SNAP + 0.1) {
            const jp2 = C.jackal(g, ja.x, GY, 0.9, ja);
            if (between(SNAP + 1.2, 60.4)) for (let i = 0; i < 3; i++) {
                const a = tt * 3.5 + (i / 3) * PI * 2;
                X.star(g, jp2.head[0] + Math.cos(a) * 40, jp2.head[1] - 40 + Math.sin(a) * 12, 10, 'star' + i);
            }
        }

        g.restore();
        X.neat(g, PLATE);

        // --- the plate's top margin: the title, then the moral ---------------------------------
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
            g.fillStyle = X.INK;
            g.fillText(str, x, y);
            g.restore();
        };
        write('लालची सियार', 450, 160, 66, 0.3, 1.3, 5.4);
        write('लालच का अंत, अक्सर बुरा ही होता है', 450, 160, 46, 61.9, 63.6);
    },

    post(ctx, t, env) {
        Etch.grain(ctx, env, 0.5);
    },
});
