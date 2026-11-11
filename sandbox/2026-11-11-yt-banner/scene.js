// yt-banner: a YouTube channel banner in the comic style — an original cast on a green hill
// in front of a sunset city: a smiling house with window eyes, a man waving, his dog, a duck
// with a bow tie, and a little spider let down on a silk line. No existing characters.
// A still: render it with --at 0.5.
//
// YouTube shows the whole 16:9 image only on TVs; on a desktop it crops to the middle band
// (1546×423 of 2560×1440 = x 203–821, y 203–373 of this 1024×576 frame). The whole cast
// stands inside it; the sky, the clouds and the city around it are decoration.
Motion.scene({
    fps: 24,
    duration: 1,
    logical: [1024, 576],
    uses: ['styles/comic/comic.js'],
    fonts: [
        { family: 'Bangers', src: 'fonts/Bangers-Regular.ttf' },
        { family: 'Comic Neue', src: 'fonts/ComicNeue-Bold.ttf', descriptors: { weight: '700' } },
    ],

    draw(g, t, env) {
        const C = Comic, K = C.COL, W = env.W, H = env.H;
        const SAFE = { x: 203, y: 203, w: 618, h: 170 };
        const box = { x: 0, y: 0, w: W, h: H };
        const all = C.pathOf(C.rect(0, 0, W, H));

        // sky: flat blue, a sunset of orange and pink dots rising from the horizon
        g.fillStyle = K.sky;
        g.fillRect(0, 0, W, H);
        C.halftone(g, all, { color: K.orange, spacing: 11, r0: 0, r1: 4.6, dir: [0, 1], box: { x: 0, y: 200, w: W, h: 330 } });
        C.halftone(g, all, { color: K.pink, spacing: 11, r0: 0, r1: 3.2, dir: [0, 1], box: { x: 0, y: 330, w: W, h: 200 }, ease: (x) => x * x });

        // the sun behind the hero, and focus lines bursting out of it
        const hx = 530, hy = 285;
        C.shape(g, C.ellipse(hx + 10, hy - 6, 150, 150, 72), {
            fill: K.yellow, w: 0, seed: 'sun',
            shade: (gg, p) => C.halftone(gg, p, { color: K.orange, spacing: 9, r0: 0, r1: 3.6, dir: [0.4, 1], box: { x: hx - 160, y: hy - 160, w: 320, h: 320 } }),
        });
        C.speedLines(g, hx, hy, { r0: 175, r1: 760, n: 54, w: 6, color: K.white, seed: 'rays' });

        // clouds in the top corners
        const cloud = (cx, cy, s, seed) =>
            C.shape(g, C.lobes([[cx - 40 * s, cy, 30 * s], [cx, cy - 18 * s, 40 * s], [cx + 42 * s, cy - 2 * s, 32 * s], [cx + 10 * s, cy + 12 * s, 34 * s]], cx, cy), { fill: K.white, w: 4, seed });
        cloud(120, 90, 1.1, 'cl1');
        cloud(905, 70, 1.25, 'cl2');
        cloud(800, 160, 0.6, 'cl3');

        // the city: a far row of pale towers, a near row with lit windows (both outside the band
        // mostly, peeking into it at the sides)
        const tower = (x, top, w, fill, seed, windows) => {
            C.shape(g, C.rect(x, top, w, H + 20 - top), { fill, w: 4, smooth: false, seed });
            if (!windows) return;
            const r = Motion.rng(seed + 'win');
            g.fillStyle = K.yellow;
            for (let wy = top + 16; wy < H; wy += 26)
                for (let wx = x + 10; wx < x + w - 14; wx += 20) if (r() < 0.55) g.fillRect(wx, wy, 9, 12);
        };
        [[10, 300, 70], [85, 340, 60], [150, 280, 55], [810, 290, 60], [875, 330, 75], [955, 270, 65], [300, 400, 80], [640, 410, 90]].forEach(([x, top, w], i) =>
            tower(x, top, w, '#a9c3dd', 'far' + i, false));
        [[-10, 360, 95, K.blue], [90, 400, 70, '#3c4f86'], [165, 345, 80, K.blue], [255, 430, 70, '#3c4f86'], [700, 440, 80, '#3c4f86'], [785, 370, 75, K.blue], [865, 410, 70, '#3c4f86'], [940, 350, 95, K.blue]].forEach(([x, top, w, fill], i) =>
            tower(x, top, w, fill, 'near' + i, true));
        // --- the cast, on a green hill in the middle band: a smiling house, a man waving, his
        // dog, a duck, and a little spider letting itself down on a silk line -------------------
        const GY = 368, SKIN = '#f2c18d', HAIR = '#3a2a22', TAN = '#c98a4b', BROWN = '#7a4a2a';
        const BILL = '#f28a2e', PURPLE = '#7a4bb3';
        const tube = (pts, w, color, seed) => {
            C.ink(g, pts, { w: w + 5, taper: [0, 0], wobble: 0.05, seed: seed + 'o' });
            C.ink(g, pts, { w, taper: [0, 0], wobble: 0, seed: seed + 'c', color });
        };
        const eye = (x, y, r, look = [-0.3, 0.2], seed) => {
            C.shape(g, C.ellipse(x, y, r, r * 1.15, 20), { fill: K.white, w: 2.5, seed });
            g.fillStyle = K.ink;
            g.beginPath();
            g.arc(x + look[0] * r, y + look[1] * r, r * 0.5, 0, Math.PI * 2);
            g.fill();
            g.fillStyle = K.white;
            g.beginPath();
            g.arc(x + look[0] * r - r * 0.18, y + look[1] * r - r * 0.2, r * 0.16, 0, Math.PI * 2);
            g.fill();
        };

        // the cast is drawn a little smaller and lower, so all of it fits the desktop band
        g.save();
        g.translate(530, 294);
        g.scale(0.94, 0.94);
        g.translate(-530, -288);

        // the hill
        C.shape(g, [[150, 640], [175, 430], [240, 382], [380, 364], [530, 358], [680, 363], [820, 380], [885, 430], [905, 640]], {
            fill: K.green, w: 5, seed: 'hill',
            shade: (gg, p) => C.halftone(gg, p, { color: '#357a48', spacing: 9, r0: 0, r1: 3.4, dir: [0.3, 1], box: { x: 120, y: 330, w: 820, h: 280 } }),
        });
        for (const [x, k] of [[260, 1], [470, 0.8], [600, 1.1], [790, 0.9]])
            C.ink(g, [[x, GY + 4], [x + 6 * k, GY - 12 * k], [x + 12 * k, GY + 2]], { w: 3, taper: [0.2, 0.2], seed: 'grass' + x });

        // the house: windows for eyes, rosy cheeks, a smile, a round-topped door
        const HX = 530;
        C.shape(g, C.rect(HX + 30, 196, 24, 50), { fill: K.red, w: 4, smooth: false, seed: 'chimney' });
        C.shape(g, C.rect(HX - 78, 268, 156, GY - 268), {
            fill: '#f6e3c3', w: 5.5, smooth: false, seed: 'walls',
            shade: (gg, p) => C.dots(gg, p, { color: '#e6c99a', spacing: 9, r: 2 }),
        });
        C.shape(g, [[HX - 96, 276], [HX, 192], [HX + 96, 276]], {
            fill: K.red, w: 5.5, smooth: false, seed: 'roof',
            shade: (gg, p) => C.halftone(gg, p, { color: '#a82a20', spacing: 8, r0: 0, r1: 3, dir: [0.4, 1], box: { x: HX - 100, y: 190, w: 200, h: 90 } }),
        });
        for (const [wx, k] of [[HX - 40, 'l'], [HX + 40, 'r']]) {
            C.shape(g, C.rect(wx - 20, 284, 40, 34), { fill: K.sky, w: 4, smooth: false, seed: 'win' + k });
            eye(wx + 2, 302, 10, [-0.35, 0.3], 'weye' + k);
            C.ink(g, [[wx - 20, 286], [wx + 20, 286]], { w: 6, taper: [0, 0], seed: 'lid' + k, color: '#a82a20' });
            C.shape(g, C.ellipse(wx + (k === 'l' ? -8 : 8), 324, 8, 5, 16), { fill: K.pink, w: 0, seed: 'cheek' + k });
        }
        C.ink(g, [[HX - 16, 318], [HX, 326], [HX + 16, 318]], { w: 4, taper: [0.2, 0.2], seed: 'hsmile' });
        C.shape(g, [[HX - 16, GY], [HX - 16, 346], ...Array.from({ length: 9 }, (_, i) => [HX - 16 * Math.cos((i / 8) * Math.PI), 346 - 14 * Math.sin((i / 8) * Math.PI)]), [HX + 16, 346], [HX + 16, GY]], { fill: BROWN, w: 4, smooth: false, seed: 'door' });
        g.fillStyle = K.yellow;
        g.beginPath();
        g.arc(HX + 9, 358, 2.6, 0, Math.PI * 2);
        g.fill();

        // the man, waving, in front of the house's left corner
        const MX = 410;
        tube([[MX - 10, 322], [MX - 14, GY - 8]], 13, '#3c4f86', 'legL');
        tube([[MX + 10, 322], [MX + 16, GY - 8]], 13, '#3c4f86', 'legR');
        for (const [fx, k] of [[MX - 22, 'l'], [MX + 22, 'r']]) C.shape(g, C.ellipse(fx, GY - 4, 15, 7, 20), { fill: BROWN, w: 3.5, seed: 'shoe' + k });
        tube([[MX - 24, 278], [MX - 36, 302], [MX - 30, 326]], 11, K.orange, 'armDown');
        C.shape(g, C.ellipse(MX - 30, 330, 7, 8, 16), { fill: SKIN, w: 3, seed: 'fistL' });
        C.shape(g, [[MX - 28, 270], [MX + 28, 270], [MX + 26, 326], [MX - 26, 326]], {
            fill: K.orange, w: 5.5, seed: 'kurta',
            shade: (gg, p) => C.dots(gg, p, { color: '#d06e1c', spacing: 8, r: 1.8 }),
        });
        tube([[MX + 24, 278], [MX + 48, 262], [MX + 56, 236]], 11, K.orange, 'armUp');
        g.save();
        g.translate(MX + 57, 232);
        g.rotate(0.25);
        C.hand(g, 'open', 17, { side: 'left', fill: SKIN, w: 3.5, seed: 'wave' });
        g.restore();
        C.ink(g, [[MX + 72, 214], [MX + 80, 206]], { w: 3, taper: [0.1, 0.6], seed: 'wv1' });
        C.ink(g, [[MX + 78, 228], [MX + 90, 224]], { w: 3, taper: [0.1, 0.6], seed: 'wv2' });
        C.shape(g, C.rect(MX - 6, 258, 12, 14), { fill: SKIN, w: 3, smooth: false, seed: 'neck' });
        C.shape(g, C.ellipse(MX - 30, 238, 7, 9, 16), { fill: SKIN, w: 3, seed: 'ear' });
        C.shape(g, C.ellipse(MX, 234, 30, 30, 40), { fill: SKIN, w: 5, seed: 'face' });
        C.shape(g, C.lobes([[MX - 18, 212, 14], [MX, 206, 16], [MX + 18, 212, 13], [MX - 26, 224, 9]], MX, 214), { fill: HAIR, w: 4, seed: 'hair' });
        eye(MX - 10, 234, 6, [0.2, 0.1], 'meyeL');
        eye(MX + 10, 234, 6, [0.2, 0.1], 'meyeR');
        C.ink(g, [[MX - 16, 225], [MX - 5, 223]], { w: 2.5, taper: [0.2, 0.2], seed: 'browL' });
        C.ink(g, [[MX + 5, 223], [MX + 16, 225]], { w: 2.5, taper: [0.2, 0.2], seed: 'browR' });
        C.ink(g, [[MX + 3, 238], [MX + 6, 246], [MX + 1, 247]], { w: 2.5, taper: [0.1, 0.3], seed: 'nose' });
        C.shape(g, [[MX - 12, 251], [MX + 12, 251], [MX + 6, 259], [MX - 6, 259]], { fill: '#b33a3a', w: 3, seed: 'mouth' });

        // the dog, sitting, tongue out, tail wagging
        const DX = 300;
        C.ink(g, [[DX + 24, GY - 22], [DX + 44, GY - 44], [DX + 48, GY - 62]], { w: 9, taper: [0, 0.5], seed: 'tailI' });
        C.ink(g, [[DX + 24, GY - 22], [DX + 44, GY - 44], [DX + 48, GY - 62]], { w: 5, taper: [0, 0.6], seed: 'tailC', color: TAN });
        C.ink(g, [[DX + 58, GY - 66], [DX + 64, GY - 74]], { w: 2.5, taper: [0.1, 0.6], seed: 'wag1' });
        C.ink(g, [[DX + 60, GY - 52], [DX + 70, GY - 54]], { w: 2.5, taper: [0.1, 0.6], seed: 'wag2' });
        C.shape(g, C.lobes([[DX + 6, GY - 22, 26], [DX - 6, GY - 36, 20]], DX, GY - 26), { fill: TAN, w: 5, seed: 'dbody' });
        C.shape(g, C.ellipse(DX - 8, GY - 34, 11, 16, 20), { fill: K.white, w: 3, seed: 'chest' });
        for (const [lx, k] of [[DX - 16, 'a'], [DX - 2, 'b']]) {
            C.shape(g, C.rect(lx - 5, GY - 26, 10, 24), { fill: TAN, w: 3.5, smooth: true, seed: 'dleg' + k });
            C.shape(g, C.ellipse(lx - 1, GY - 3, 8, 5, 14), { fill: K.white, w: 3, seed: 'paw' + k });
        }
        C.ink(g, [[DX - 20, GY - 50], [DX - 4, GY - 52]], { w: 6, taper: [0, 0], seed: 'collar', color: K.red });
        C.shape(g, C.ellipse(DX - 12, GY - 45, 4, 4, 12), { fill: '#f2b632', w: 2, seed: 'tag' });
        C.shape(g, C.ellipse(DX - 12, GY - 72, 24, 21, 30), { fill: TAN, w: 5, seed: 'dhead' });
        C.shape(g, [[DX - 30, GY - 86], [DX - 42, GY - 74], [DX - 40, GY - 52], [DX - 30, GY - 62]], { fill: BROWN, w: 3.5, seed: 'earL' });
        C.shape(g, [[DX + 4, GY - 88], [DX + 18, GY - 78], [DX + 16, GY - 56], [DX + 6, GY - 66]], { fill: BROWN, w: 3.5, seed: 'earR' });
        C.shape(g, C.ellipse(DX - 24, GY - 62, 14, 10, 20), { fill: K.white, w: 3, seed: 'snout' });
        C.shape(g, C.ellipse(DX - 32, GY - 67, 5, 4, 14), { fill: K.ink, w: 0, seed: 'dnose' });
        C.shape(g, [[DX - 26, GY - 56], [DX - 18, GY - 56], [DX - 19, GY - 46], [DX - 25, GY - 46]], { fill: K.pink, w: 2.5, seed: 'tongue' });
        eye(DX - 20, GY - 78, 5, [-0.2, 0.2], 'deyeL');
        eye(DX - 4, GY - 78, 5, [-0.2, 0.2], 'deyeR');

        // the duck, waddling in from the right with a wave of its wing
        const QX = 680;
        for (const [lx, k] of [[QX - 6, 'a'], [QX + 10, 'b']]) {
            C.ink(g, [[lx, GY - 22], [lx, GY - 6]], { w: 5, taper: [0, 0], seed: 'qleg' + k, color: BILL });
            C.shape(g, [[lx - 12, GY - 6], [lx + 6, GY - 8], [lx + 4, GY], [lx - 12, GY]], { fill: BILL, w: 3, smooth: false, seed: 'qfoot' + k });
        }
        C.shape(g, C.lobes([[QX + 2, GY - 38, 26], [QX + 22, GY - 46, 14], [QX - 14, GY - 34, 16]], QX, GY - 38), {
            fill: K.yellow, w: 5, seed: 'qbody',
            shade: (gg, p) => C.halftone(gg, p, { color: K.orange, spacing: 7, r0: 0, r1: 2.4, dir: [0.4, 1], box: { x: QX - 40, y: GY - 70, w: 80, h: 70 } }),
        });
        C.shape(g, [[QX + 6, GY - 48], [QX + 26, GY - 70], [QX + 36, GY - 66], [QX + 22, GY - 44]], { fill: K.yellow, w: 4, seed: 'qwing' });
        C.shape(g, C.ellipse(QX - 12, GY - 78, 20, 19, 28), { fill: K.yellow, w: 5, seed: 'qhead' });
        C.shape(g, [[QX - 28, GY - 78], [QX - 50, GY - 74], [QX - 52, GY - 68], [QX - 28, GY - 68]], { fill: BILL, w: 3.5, seed: 'qbill' });
        eye(QX - 16, GY - 84, 5, [-0.4, 0.1], 'qeye');
        C.shape(g, [[QX - 16, GY - 60], [QX - 6, GY - 64], [QX - 6, GY - 54]], { fill: PURPLE, w: 2.5, smooth: false, seed: 'bowL' });
        C.shape(g, [[QX - 4, GY - 59], [QX + 6, GY - 64], [QX + 6, GY - 54]], { fill: PURPLE, w: 2.5, smooth: false, seed: 'bowR' });

        // the spider, let down on a silk line from the top of the frame, waving one leg
        const SX = 772, SY = 246;
        C.ink(g, [[SX, -80], [SX, SY - 12]], { w: 2.6, taper: [0, 0], wobble: 0, seed: 'silk' });
        for (let i = 0; i < 4; i++)
            for (const side of [-1, 1]) {
                const wave = side === 1 && i === 0;
                const a = side === 1 ? -0.6 + i * 0.45 : Math.PI + 0.6 - i * 0.45;
                const knee = [SX + Math.cos(a) * 15, SY + Math.sin(a) * 15 - 8];
                const foot = wave ? [SX + 26, SY - 30] : [SX + Math.cos(a) * 24, SY + Math.sin(a) * 18 + 8];
                C.ink(g, [[SX, SY], knee, foot], { w: 3, taper: [0, 0.4], seed: 'sl' + i + side, smooth: false });
            }
        C.shape(g, C.ellipse(SX, SY, 15, 13, 28), { fill: PURPLE, w: 4, seed: 'spBody' });
        eye(SX - 5, SY - 2, 4.5, [-0.3, 0.3], 'spEyeL');
        eye(SX + 5, SY - 2, 4.5, [-0.3, 0.3], 'spEyeR');
        C.ink(g, [[SX - 5, SY + 6], [SX, SY + 8], [SX + 5, SY + 6]], { w: 1.8, taper: [0.2, 0.2], seed: 'spSmile' });

        g.restore();

        // sparkles
        [[232, 226, 10], [840, 300, 12], [630, 214, 8], [350, 214, 9], [720, 226, 7]].forEach(([x, y, r], i) =>
            C.shape(g, C.starPts(x, y, r, r, 4, 0.35, 'spk' + i), { fill: K.white, w: 2.5, smooth: false, seed: 'spk' + i }));

        if (env.showSafe) {
            g.strokeStyle = 'rgba(255,0,0,0.8)';
            g.lineWidth = 2;
            g.strokeRect(SAFE.x, SAFE.y, SAFE.w, SAFE.h);
        }
    },

    post(ctx, t, env) {
        Comic.grainPost(ctx, env, 0.05);
    },
});
