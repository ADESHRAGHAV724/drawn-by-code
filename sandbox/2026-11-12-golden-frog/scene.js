// golden-frog: a facts Short about the golden poison frog (9:16), in paper cutout, cut to the
// user's ElevenLabs voice-over (private/voice.wav; timings in brief.md). The frog itself is
// the user's three photos, cut out along a traced outline and glued on like a collage, with a
// torn white paper edge and a pasted shadow. The photos live in private/ (not committed);
// without them each frog falls back to a paper frog made in code.
const DIR = 'sandbox/2026-11-12-golden-frog/';

// traced outlines of the frog in each photo (photo pixels)
const FROGS = {
    face: { src: DIR + 'private/frog-face.jpg', w: 486, h: 411, poly: [[80, 100], [95, 60], [130, 50], [170, 62], [240, 75], [310, 60], [360, 58], [395, 80], [408, 125], [400, 180], [415, 235], [486, 240], [486, 320], [420, 325], [400, 411], [70, 411], [55, 350], [0, 345], [0, 280], [50, 250], [75, 210], [80, 165]] },
    leaves: { src: DIR + 'private/frog-leaves.jpg', w: 548, h: 364, poly: [[292, 113], [314, 119], [330, 140], [334, 160], [325, 172], [300, 190], [280, 205], [250, 222], [240, 234], [260, 245], [280, 250], [300, 240], [308, 245], [295, 260], [280, 270], [260, 278], [240, 280], [210, 278], [195, 270], [180, 260], [165, 250], [150, 280], [140, 295], [120, 302], [100, 295], [88, 270], [80, 235], [82, 210], [100, 190], [115, 175], [135, 145], [165, 125], [200, 120], [240, 120], [270, 116]] },
    side: { src: DIR + 'private/frog-side.jpg', w: 596, h: 335, poly: [[340, 15], [380, 17], [430, 25], [439, 48], [435, 90], [420, 125], [395, 150], [375, 170], [370, 190], [385, 225], [400, 250], [435, 250], [470, 277], [455, 285], [430, 287], [400, 287], [385, 280], [352, 290], [340, 300], [335, 320], [310, 335], [200, 335], [165, 300], [150, 260], [120, 240], [112, 225], [125, 195], [145, 165], [175, 150], [200, 140], [235, 110], [270, 75], [300, 40], [320, 22]] },
};

const LINES = [
    [0.4, 3.3], [3.9, 8.1], [8.6, 12.9], [13.7, 18.4], [19.0, 21.9], [22.5, 28.5], [29.0, 31.8],
];

Motion.scene({
    fps: 24,
    duration: 34,
    logical: [900, 1600],
    uses: ['styles/paper-cutout/paper.js', 'styles/paper-cutout/kit.js', 'styles/paper-cutout/detail.js'],
    fonts: [{ family: 'Hand', src: 'fonts/PatrickHand-Regular.ttf' }, { family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 3.7, 'Hook'], [3.7, 8.4, 'Meet the frog'], [8.4, 13.4, '10 people'], [13.4, 18.7, 'Darts'],
        [18.7, 22.2, 'Colombia'], [22.2, 28.8, 'Poison from food'], [28.8, 34, 'Subscribe'],
    ],

    async setup(env) {
        const load = (src) => new Promise((res) => {
            const im = new Image();
            im.onload = () => res(im);
            im.onerror = () => res(null);
            im.src = '/' + src;
        });
        const imgs = {};
        for (const [k, f] of Object.entries(FROGS)) imgs[k] = await load(f.src);
        return { kit: PaperKit.make(env, { font: 'Hand' }), hi: PaperKit.make(env, { font: 'Kalam' }), imgs };
    },

    draw(g, t, env) {
        const { kit, hi, imgs } = env.state, P = Paper, D = PaperDetail, E = Ease, C = kit.COL;
        const d = Math.floor(t * 12 + 1e-6), tt = d / 12;
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp;
        const between = (a, b) => tt >= a && tt < b;
        const W = 900, H = 1600;
        const ellR = (cx, cy, rx, ry, a) => P.ellipse(0, 0, rx, ry).map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
        const GREEN = '#2f5d3a', GREEN_D = '#244a2e', LEAF = '#5fa35b', LEAF_D = '#3f7f45', LEAF_L = '#8cc56b', GOLD = '#f2b632';

        // --- the forest: dark green ground, trunks, big leaves, vines, grass (cached) -------
        kit.paperBg(g, 'forest', GREEN);
        kit.sprite('forest-back', { x: -40, y: -40, w: W + 80, h: H + 80 }, (c) => {
            // distant trees: muted trunks with round leafy crowns, in two depths
            const tree = (x, top, w, trunkCol, crownCol, seed, crownR) => {
                P.cutout(c, [[x - w / 2, top + 40], [x + w / 2, top + 40], [x + w / 2 + 14, 1320], [x - w / 2 - 14, 1320]], trunkCol, seed + 't', { border: 2, shadow: 0.18 });
                for (const s2 of [-1, 1]) P.cutout(c, P.noodle([[x, top + 260], [x + s2 * 60, top + 180], [x + s2 * 110, top + 120]], w * 0.32, w * 0.12), trunkCol, seed + 'br' + s2, { border: 0, shadow: 0.1 });
                const r = Motion.rng(seed);
                const blobs = Array.from({ length: 7 }, () => [x + (r() - 0.5) * crownR * 2.2, top + (r() - 0.5) * crownR * 0.9, crownR * (0.45 + r() * 0.3)]);
                P.cutout(c, P.circleUnion(blobs), crownCol, seed + 'c', { border: 2.5, shadow: 0.2 });
            };
            tree(330, 160, 46, '#4a3a2c', '#3f7a4a', 'far1', 170);
            tree(620, 120, 50, '#4a3a2c', '#44824f', 'far2', 180);
            tree(80, 220, 70, '#5a4330', '#357042', 'mid1', 210);
            tree(830, 180, 74, '#5a4330', '#357042', 'mid2', 220);
            // a glow of light between the trees
            c.fillStyle = 'rgba(200,230,150,0.10)';
            c.beginPath();
            c.ellipse(450, 620, 360, 520, 0, 0, Math.PI * 2);
            c.fill();
        }).draw(g);
        // a big tropical leaf: a blade with a midrib and veins
        const leaf = (key, x, y, len, wid, rot, col, sway = 0) => {
            g.save();
            g.translate(x, y);
            g.rotate(rot + Math.sin(t * 1.3 + x * 0.01) * sway);
            kit.sprite('leaf:' + key + col, { x: -wid - 10, y: -len - 10, w: wid * 2 + 20, h: len + 30 }, (c) => {
                const pts = [];
                for (let i = 0; i <= 20; i++) {
                    const u = i / 20, w = Math.sin(u * Math.PI) * wid * (u < 0.5 ? 1 : 0.92);
                    pts.push([w, -u * len]);
                }
                for (let i = 20; i >= 0; i--) {
                    const u = i / 20, w = Math.sin(u * Math.PI) * wid;
                    pts.push([-w, -u * len]);
                }
                P.cutout(c, pts, col, key, { border: 3, shadow: 0.2 });
                c.strokeStyle = 'rgba(255,255,230,0.35)';
                c.lineWidth = 3;
                c.beginPath();
                c.moveTo(0, -4);
                c.lineTo(0, -len * 0.95);
                c.stroke();
                c.lineWidth = 1.6;
                for (let i = 1; i < 7; i++) {
                    const yy = -len * i / 7.5;
                    for (const s of [-1, 1]) {
                        c.beginPath();
                        c.moveTo(0, yy);
                        c.quadraticCurveTo(s * wid * 0.4, yy - len * 0.04, s * wid * 0.8, yy - len * 0.1);
                        c.stroke();
                    }
                }
            }).draw(g);
            g.restore();
        };
        // back layer leaves around the frame
        leaf('b1', -30, 520, 360, 90, 0.9, LEAF_D, 0.02);
        leaf('b2', 930, 600, 380, 95, -0.95, LEAF_D, 0.02);
        leaf('b3', 120, 1350, 300, 80, 0.35, LEAF_D, 0.02);
        leaf('b4', 800, 1380, 320, 85, -0.4, LEAF_D, 0.02);
        // vines from the top
        kit.sprite('vines', { x: -20, y: -20, w: W + 40, h: 520 }, (c) => {
            [[150, 380], [420, 250], [700, 430]].forEach(([x, len], i) => {
                P.cutout(c, P.noodle([[x, -20], [x + 20, len * 0.4], [x - 10, len * 0.7], [x + 8, len]], 9), LEAF_D, 'vine' + i, { border: 2, shadow: 0.15 });
                for (let k = 1; k < 6; k++) {
                    const ly = (len * k) / 6, s = k % 2 ? 1 : -1;
                    P.cutout(c, ellR(x + s * 22 + (k % 3) * 4, ly, 22, 11, s * 0.5), LEAF, 'vl' + i + k, { border: 2, shadow: 0.15 });
                }
            });
        }).draw(g);
        // the forest floor: fallen leaves and grass along the bottom
        kit.sprite('floor', { x: -40, y: 1180, w: W + 80, h: 460 }, (c) => {
            P.cutout(c, [[-40, 1300], [200, 1270], [450, 1290], [700, 1265], [940, 1290], [940, 1640], [-40, 1640]], '#3b2a1c', 'soil', { border: 0, shadow: 0 });
            const r = Motion.rng('fallen');
            for (let i = 0; i < 16; i++) {
                const x = r() * W, y = 1300 + r() * 280, a = r() * 6;
                P.cutout(c, ellR(x, y, 34 + r() * 20, 14 + r() * 6, a), ['#8a5a2b', '#a8743a', '#6f4a24'][i % 3], 'fl' + i, { border: 2, shadow: 0.2 });
            }
        }).draw(g);
        // plants on the forest floor: ferns, bushes and flowers at the sides (cached)
        kit.sprite('plants', { x: -60, y: 1000, w: W + 120, h: 400 }, (c) => {
            const fern = (x, y, len, ang, seed) => {
                const tip = [x + Math.cos(ang) * len, y + Math.sin(ang) * len], mid = [x + Math.cos(ang) * len * 0.5 + 10, y + Math.sin(ang) * len * 0.5 - 10];
                P.cutout(c, P.noodle([[x, y], mid, tip], 5, 2), LEAF_D, seed + 's', { border: 2, shadow: 0.15 });
                for (let k = 1; k < 9; k++) {
                    const u = k / 9, px = x + (tip[0] - x) * u, py = y + (tip[1] - y) * u, l = 34 * (1 - u * 0.7);
                    for (const s2 of [-1, 1]) {
                        const a2 = ang + s2 * 1.1;
                        const cx = px + Math.cos(a2) * l * 0.5, cy = py + Math.sin(a2) * l * 0.5;
                        P.cutout(c, ellR(cx, cy, l * 0.55, l * 0.18, a2), k % 2 ? LEAF : LEAF_L, seed + k + s2, { border: 1.5, shadow: 0.1 });
                    }
                }
            };
            const bush = (x, y, r, col, seed) => P.cutout(c, P.circleUnion([[x - r * 0.7, y, r * 0.7], [x, y - r * 0.4, r * 0.85], [x + r * 0.7, y, r * 0.7]]), col, seed, { border: 3, shadow: 0.2 });
            const flower = (x, y, col, seed) => {
                P.cutout(c, P.noodle([[x, y + 70], [x + 6, y + 30], [x, y]], 4), LEAF_D, seed + 'st', { border: 1.5, shadow: 0.1 });
                for (let k = 0; k < 5; k++) {
                    const a2 = (k / 5) * Math.PI * 2;
                    P.cutout(c, ellR(x + Math.cos(a2) * 13, y + Math.sin(a2) * 13, 12, 7, a2), col, seed + 'p' + k, { border: 1.5, shadow: 0.12 });
                }
                P.cutout(c, P.ellipse(x, y, 7, 7), '#f2c94c', seed + 'c', { border: 1.5, shadow: 0.1 });
            };
            bush(60, 1260, 120, LEAF_D, 'bushL');
            bush(840, 1250, 130, LEAF_D, 'bushR');
            fern(20, 1290, 220, -1.1, 'fernL1');
            fern(150, 1300, 200, -1.6, 'fernL2');
            fern(880, 1290, 220, -2.0, 'fernR1');
            fern(760, 1300, 190, -1.5, 'fernR2');
            flower(200, 1200, '#ee6b9b', 'fl1');
            flower(250, 1230, '#e7473c', 'fl2');
            flower(690, 1210, '#ee6b9b', 'fl3');
            flower(640, 1240, '#f2643c', 'fl4');
            bush(450, 1300, 90, '#356b3f', 'bushC');
        }).draw(g);

        // grass blades in front, swaying
        for (let i = 0; i < 22; i++) {
            const x = -20 + i * 44, h = 90 + (i % 4) * 30, sw = Math.sin(t * 1.6 + i) * 6;
            g.save();
            g.translate(x, 1330 + (i % 3) * 20);
            g.rotate(((i % 5) - 2) * 0.08 + sw * 0.01);
            kit.sprite('grass' + (i % 6), { x: -14, y: -h - 10, w: 28, h: h + 20 }, (c) => P.cutout(c, [[-9, 0], [0, -h], [9, 0]], [LEAF, LEAF_L, LEAF_D][i % 3], 'gr' + (i % 6), { border: 2, shadow: 0.15 })).draw(g);
            g.restore();
        }

        // --- the frog cutouts ----------------------------------------------------------------
        const frog = (key, x, y, s, rot = 0, o = {}) => {
            const f = FROGS[key], im = imgs[key];
            g.save();
            g.translate(x, y);
            g.rotate(rot);
            g.scale(s, s);
            g.translate(-f.w / 2, -f.h / 2);
            kit.sprite('frog:' + key + (im ? '' : ':paper'), { x: -20, y: -20, w: f.w + 40, h: f.h + 40 }, (c) => {
                // a torn white paper backing just outside the scissor cut, then the photo
                const grow = f.poly.map(([px, py], i, a) => {
                    const cx = a.reduce((s2, p) => s2 + p[0], 0) / a.length, cy = a.reduce((s2, p) => s2 + p[1], 0) / a.length;
                    const dx = px - cx, dy = py - cy, l = Math.hypot(dx, dy) || 1;
                    return [px + (dx / l) * 7, py + (dy / l) * 7];
                });
                P.cutout(c, grow, '#fbf6ea', 'frogEdge' + key, { border: 4, shadow: 0.28, tex: false });
                c.save();
                c.beginPath();
                f.poly.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py)));
                c.closePath();
                c.clip();
                if (im) c.drawImage(im, 0, 0, f.w, f.h);
                else {
                    // no photo: a paper frog (gold body, black eyes)
                    c.fillStyle = GOLD;
                    c.fillRect(0, 0, f.w, f.h);
                    c.fillStyle = '#1a1214';
                    c.beginPath();
                    c.arc(f.w * 0.62, f.h * 0.3, f.w * 0.06, 0, Math.PI * 2);
                    c.fill();
                }
                c.restore();
            }, 1.6).draw(g);
            g.restore();
        };
        // pop-in with overshoot, then a gentle breathing scale
        const pop = (a, dur = 0.4) => E.back(seg(a, a + dur));
        const breath = 1 + Math.sin(t * 2.4) * 0.01;

        // the words: whole strings (Devanagari needs its conjuncts and matras shaped together,
        // so never letter by letter) on a torn strip of paper glued on, revealed by a wipe,
        // underlined in orange marker
        const word = (k, str, x, y, size, col, a, under = C.orange, b = 1e9) => {
            if (tt < a || tt > b) return;
            const font = k === hi ? 'Kalam' : 'Hand';
            g.save();
            g.font = `${size}px "${font}"`;
            const w = g.measureText(str).width;
            g.restore();
            const pop2 = E.back(seg(a, a + 0.3)), wipe = seg(a + 0.1, a + 0.5);
            g.save();
            g.translate(x, y - size * 0.32);
            g.rotate(((str.length % 5) - 2) * 0.012);
            g.scale(pop2, pop2);
            kit.sprite('strip:' + str + size, { x: -w / 2 - 40, y: -size * 0.85, w: w + 80, h: size * 1.7 }, (c) => {
                P.cutout(c, P.roundRect(-w / 2 - 26, -size * 0.62, w + 52, size * 1.24, 6), '#f4ecda', 'strip' + str, { border: 3, shadow: 0.3, tex: false });
            }).draw(g);
            g.beginPath();
            g.rect(-w / 2 - 10, -size, (w + 20) * wipe, size * 2);
            g.clip();
            g.font = `${size}px "${font}"`;
            g.textAlign = 'center';
            g.fillStyle = '#2a1826';
            g.fillText(str, 0, size * 0.32);
            g.restore();
            const ul = seg(a + 0.45, a + 0.75);
            if (ul > 0) P.markerStroke(g, [[x - w / 2, y + size * 0.42], [x - w / 2 + w * ul, y + size * 0.38]], under, size * 0.09, 'ul' + str);
        };

        // --- 1 · hook: the face drops in, a hand reaches, the warning ---------------------------
        if (tt < 3.75) {
            const u = pop(0.3, 0.5);
            frog('face', 430, lerp(-300, 760, u), 1.35 * breath, -0.03);
            // a paper hand reaches in from the right … and is warned off
            const reach = E.inOut(seg(1.2, 2.0)) * (1 - E.inOut(seg(2.4, 2.9)));
            D.hand(g, lerp(1040, 760, reach), 980, 120, -Math.PI / 2 - 0.2, 'open', { side: 'left' });
            const warn = pop(2.0, 0.35);
            if (warn > 0) {
                g.save();
                g.translate(450, 330);
                g.scale(warn, warn);
                g.rotate(Math.sin(t * 18) * 0.04 * (tt < 3 ? 1 : 0));
                kit.sprite('warn', { x: -150, y: -140, w: 300, h: 270 }, (c) => {
                    P.cutout(c, [[0, -120], [130, 105], [-130, 105]], '#e8b52c', 'warnTri', { border: 5 });
                    P.cutout(c, P.roundRect(-14, -60, 28, 100, 12), '#1f1414', 'warnBar', { border: 0, shadow: 0 });
                    P.cutout(c, P.ellipse(0, 70, 16, 16), '#1f1414', 'warnDot', { border: 0, shadow: 0 });
                }).draw(g);
                g.restore();
            }
            word(kit, 'Touching it can kill!', 450, 1240, 70, C.cream, 0.9);
        }

        // --- 2 · meet the frog: side cutout, the name, a ruler: 5 cm --------------------------
        if (between(3.7, 8.45)) {
            const u = pop(3.8, 0.45), out = E.in(seg(8.15, 8.45));
            frog('side', lerp(-400, 450, u) - out * 1300, 760, 1.15 * breath, 0.02);
            word(kit, 'Golden Poison Frog', 450, 330, 74, C.cream, 4.3);
            const ru = E.out(seg(6.2, 6.8));
            if (ru > 0) {
                g.save();
                g.translate(450 - out * 1300, 1110);
                kit.sprite('ruler', { x: -260, y: -50, w: 520, h: 110 }, (c) => {
                    P.cutout(c, P.roundRect(-240, -32, 480, 70, 6), '#f1d48a', 'ruler', { border: 3 });
                    c.strokeStyle = '#3a2a1a';
                    c.lineWidth = 2.5;
                    for (let i = 0; i <= 12; i++) {
                        const x = -220 + i * 36.6;
                        c.beginPath();
                        c.moveTo(x, -32);
                        c.lineTo(x, -32 + (i % 2 ? 14 : 26));
                        c.stroke();
                    }
                }).draw(g);
                // the frog's length marked on the ruler, growing
                g.fillStyle = C.red;
                g.fillRect(-220, 18, 440 * ru, 10);
                g.restore();
                word(kit, 'Only 5 cm long', 450, 1250, 64, C.cream, 6.5);
            }
        }

        // --- 3 · 1 mg = 10 people: a drop, ten paper people who topple ----------------------
        if (between(8.4, 13.4)) {
            const u = pop(8.6, 0.4);
            // the drop of poison
            if (u > 0) {
                g.save();
                g.translate(450, 470 - (1 - u) * 300);
                kit.sprite('drop', { x: -80, y: -120, w: 160, h: 200 }, (c) => {
                    const pts = [];
                    for (let i = 0; i <= 30; i++) {
                        const a = (i / 30) * Math.PI * 2, r = 55;
                        const y = Math.sin(a) * r, x = Math.cos(a) * r * (y < 0 ? 1 + y / r * 0.9 : 1);
                        pts.push([x, y < 0 ? y * 1.8 : y]);
                    }
                    P.cutout(c, pts, '#7fd36b', 'drop', { border: 4 });
                }).draw(g);
                g.restore();
                word(kit, '1 mg', 450, 640, 70, C.cream, 8.8);
            }
            // ten people in two rows; at «jaan ja sakti hai» they topple one after another
            const cols = [C.orange, C.mint, C.lilac, C.yellow, '#e58a78', '#7fb3e0', C.orange, C.mint, '#e58a78', C.lilac];
            for (let i = 0; i < 10; i++) {
                const row = Math.floor(i / 5), col = i % 5;
                const x = 170 + col * 140, y = 960 + row * 230;
                const app = pop(9.6 + i * 0.12, 0.3);
                if (app <= 0) continue;
                const fall = E.in(seg(11.0 + i * 0.13, 11.35 + i * 0.13));
                g.save();
                g.translate(x, y);
                g.rotate(fall * 1.45);
                g.scale(app, app);
                kit.sprite('person' + (i % 5) + cols[i], { x: -50, y: -190, w: 100, h: 200 }, (c) => {
                    P.cutout(c, P.roundRect(-34, -110, 68, 110, 26), cols[i], 'pb' + i, { border: 3 });
                    P.cutout(c, P.ellipse(0, -140, 30, 30), '#edc4a7', 'ph' + i, { border: 3 });
                    c.fillStyle = '#2a1826';
                    c.beginPath();
                    c.arc(-9, -142, 3.5, 0, Math.PI * 2);
                    c.arc(9, -142, 3.5, 0, Math.PI * 2);
                    c.fill();
                }).draw(g);
                g.restore();
            }
            word(kit, '= 10 people!', 450, 1290, 78, '#ffd36b', 10.2, C.red);
        }

        // --- 4 · darts: the leaves cutout, a dart rubbed along its back, then shot -------------
        if (between(13.4, 18.75)) {
            const u = pop(13.6, 0.45), out = E.in(seg(18.4, 18.7));
            frog('leaves', 450 + out * -1200, 820, 1.35 * breath, 0);
            word(kit, "Colombia's tribes", 450, 330, 66, C.cream, 13.9);
            // the dart: rubbed back and forth over the back (15.2–17.2), then it flies
            const rub = between(15.2, 17.3) ? Math.sin((tt - 15.2) * 9) * 60 : 0;
            const fly = E.in(seg(17.4, 18.0));
            if (tt > 14.6) {
                g.save();
                g.translate(lerp(560, 1300, fly) + rub, lerp(690, 520, fly));
                g.rotate(-0.25);
                kit.sprite('dart', { x: -240, y: -24, w: 300, h: 48 }, (c) => {
                    P.cutout(c, P.roundRect(-220, -5, 220, 10, 4), '#c9a46a', 'dartShaft', { border: 2 });
                    P.cutout(c, [[0, -9], [40, 0], [0, 9]], '#7d8a8f', 'dartTip', { border: 2 });
                    P.cutout(c, [[-230, -16], [-190, -4], [-190, 4], [-230, 16]], '#e9e2cf', 'dartTuft', { border: 2 });
                }).draw(g);
                // poison sparkles on the tip after the rubbing
                if (tt > 16.0) for (let i = 0; i < 4; i++) {
                    const a = t * 6 + i * 1.6;
                    g.fillStyle = '#9be37a';
                    g.beginPath();
                    g.arc(46 + Math.cos(a) * 12, Math.sin(a) * 12, 4, 0, Math.PI * 2);
                    g.fill();
                }
                g.restore();
            }
            word(kit, 'Poison darts', 450, 1250, 72, '#9be37a', 16.0);
        }

        // --- 5 · Colombia: a paper map of South America, a pin drops ---------------------------
        if (between(18.7, 22.25)) {
            const u = pop(18.9, 0.45);
            g.save();
            g.translate(450, 800);
            g.scale(u, u);
            kit.sprite('map', { x: -320, y: -460, w: 640, h: 920 }, (c) => {
                const sa = [[-150, -410], [-80, -430], [10, -415], [90, -395], [160, -350], [230, -300], [320, -240], [345, -190], [330, -130], [290, -70], [250, 0], [200, 70], [140, 140], [100, 200], [70, 250], [30, 290], [10, 350], [-20, 400], [-50, 450], [-80, 450], [-95, 400], [-100, 320], [-110, 230], [-130, 130], [-160, 40], [-200, -40], [-240, -120], [-245, -190], [-225, -260], [-200, -330]];
                P.cutout(c, sa, '#d9c58f', 'southAmerica', { border: 5 });
                P.cutout(c, [[-150, -400], [-60, -420], [-20, -380], [-40, -300], [-120, -260], [-200, -250], [-220, -320]], GOLD, 'colombia', { border: 3 });
            }).draw(g);
            g.restore();
            const pin = E.out(seg(19.6, 20.0));
            if (pin > 0) {
                g.save();
                g.translate(450 - 150, 800 - 330 - (1 - pin) * 300);
                kit.sprite('pin', { x: -40, y: -110, w: 80, h: 120 }, (c) => {
                    P.cutout(c, [[-6, -40], [6, -40], [0, 0]], '#d9412f', 'pinNeedle', { border: 2 });
                    P.cutout(c, P.ellipse(0, -64, 28, 28), '#d9412f', 'pinHead', { border: 3 });
                }).draw(g);
                g.restore();
            }
            if (u > 0.9) {
                g.save();
                g.font = '46px "Hand"';
                g.textAlign = 'center';
                g.fillStyle = 'rgba(42,24,38,0.75)';
                g.fillText('South', 470, 880);
                g.fillText('America', 470, 930);
                g.restore();
            }
            word(kit, 'Colombia', 450, 330, 80, C.cream, 19.4);
            word(kit, 'Dense rainforests', 450, 1300, 64, C.cream, 20.4);
        }

        // --- 6 · the poison comes from its food; in a zoo it is harmless -------------------------
        if (between(22.2, 28.85)) {
            const u = pop(22.4, 0.45);
            frog('side', 450, 780, 1.15 * breath, 0.02);
            // insects crawling toward it, gobbled up one by one
            for (let i = 0; i < 4; i++) {
                const t0 = 23.4 + i * 0.5, k = seg(t0, t0 + 0.6);
                if (k >= 1) continue;
                const x = lerp(880, 700, k), y = 1000 - i * 14;
                g.save();
                g.translate(x, y);
                g.scale(2, 2);
                kit.sprite('bug' + (i % 2), { x: -24, y: -18, w: 48, h: 36 }, (c) => {
                    P.cutout(c, P.ellipse(0, 0, 18, 11), i % 2 ? '#2a1826' : '#6b2f2a', 'bug' + (i % 2), { border: 2 });
                    c.strokeStyle = '#2a1826';
                    c.lineWidth = 2;
                    for (const s of [-1, 1]) for (const dx of [-8, 0, 8]) {
                        c.beginPath();
                        c.moveTo(dx, 0);
                        c.lineTo(dx + 4, s * 16);
                        c.stroke();
                    }
                }).draw(g);
                g.restore();
            }
            word(kit, 'Poison = food!', 450, 330, 80, '#9be37a', 24.0);
            // the zoo: bars drop over the frog, and the poison is crossed out
            const bars = E.out(seg(26.3, 26.8));
            if (bars > 0) {
                for (let i = 0; i < 6; i++) {
                    const x = 160 + i * 116;
                    g.save();
                    g.translate(x, lerp(-200, 780, bars));
                    kit.sprite('bar', { x: -12, y: -330, w: 24, h: 660 }, (c) => P.cutout(c, P.roundRect(-8, -320, 16, 640, 6), '#8a8f96', 'bar', { border: 2 })).draw(g);
                    g.restore();
                }
                word(kit, 'In a zoo: no poison', 450, 1250, 62, C.cream, 26.8);
            }
            void u;
        }

        // --- 7 · subscribe -----------------------------------------------------------------------
        if (tt >= 28.8) {
            frog('face', 450, 640, 0.9 * breath, -0.04);
            const b = pop(29.2, 0.4), click = between(31.0, 31.3) ? 0.92 : 1;
            if (b > 0) {
                g.save();
                g.translate(450, 1040);
                g.scale(b * click, b * click);
                kit.sprite('subscribe', { x: -230, y: -70, w: 460, h: 140 }, (c) => P.cutout(c, P.roundRect(-210, -52, 420, 104, 30), '#d9412f', 'subBtn', { border: 4 })).draw(g);
                g.font = '58px "Hand"';
                g.textAlign = 'center';
                g.fillStyle = '#fff6ea';
                g.fillText('SUBSCRIBE', 0, 20);
                g.restore();
                // the hand that clicks it
                const press = E.inOut(seg(30.4, 31.0)) * (1 - E.inOut(seg(31.4, 31.9)));
                if (press > 0) D.hand(g, lerp(760, 560, press), lerp(1300, 1090, press), 110, -Math.PI * 0.75, 'open', { side: 'left' });
            }
            word(kit, 'More amazing facts!', 450, 300, 64, C.cream, 29.0);
        }
    },

    post(ctx, t, env) {
        env.state.kit.grainPost(ctx);
    },
});
