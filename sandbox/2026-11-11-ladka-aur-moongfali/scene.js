// ladka-aur-moongfali: «The boy and the vendor», a 9:16 YouTube Short printed as a risograph
// (four inks, flat and screened plates, paper knockouts, navy line art), cut to the user's
// ElevenLabs voice-over (private/voice.wav, re-timed by make-voice.sh; line timings in
// brief.md). The speaking character's mouth follows the voice's loudness (mouth.js).
// Everything is computed from tt (held on twos), so the print is memoised per drawing.
const DIR = 'sandbox/2026-11-11-ladka-aur-moongfali/';

// voice lines in film time: [start, end, speaker, subtitle]
const LINES = [
    [0.5, 6.36, 'n', 'एक गाँव में एक चालाक मूँगफली वाला रहता था। वह गरम-गरम भुनी मूँगफली बेचता था।'],
    [6.94, 14.8, 'n', 'बच्चों को उसकी मूँगफली बहुत पसंद थी। पर वह अक्सर कम मूँगफली देता, और मीठी-मीठी बातों से बच्चों को बहला देता।'],
    [15.43, 18.01, 'n', 'एक दिन, एक लड़का मूँगफली खरीदने आया।'],
    [18.33, 21.86, 'v', 'लो बेटा, गरम-गरम मूँगफली!'],
    [22.28, 24.44, 'b', 'चाचा जी, आपने तो मुझे कम मूँगफली दी है!'],
    [24.73, 28.57, 'v', 'अरे बेटा, कम मूँगफली उठाने में आसानी रहेगी!'],
    [28.88, 34.96, 'n', 'लड़का कुछ नहीं बोला। उसने जेब से कुछ सिक्के निकाले, और मूँगफली वाले की हथेली पर रख दिए।'],
    [35.69, 39.06, 'n', 'मूँगफली वाले ने पैसे गिने... तो पैसे कम निकले।'],
    [39.4, 42.01, 'v', 'अरे बेटा! तुमने तो पैसे कम दिए हैं!'],
    [42.31, 47.62, 'b', 'हाँ चाचा जी, मुझे पता है। कम पैसे गिनने में आपको आसानी रहेगी!'],
    [47.99, 56.72, 'n', 'मूँगफली वाले का मुँह खुला का खुला रह गया। सच ही है... ज़रूरत से ज़्यादा चालाक बनने वाले, अक्सर खुद ही मात खा जाते हैं।'],
];

Motion.scene({
    fps: 24,
    duration: 59,
    logical: [900, 1600],
    uses: ['styles/risograph/riso.js', DIR + 'mouth.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    audio: { mix: 'mix.wav' },
    shots: [
        [0, 6.9, 'The vendor'], [6.9, 15.4, 'Short weight'], [15.4, 18.3, 'The boy'], [18.3, 22.2, 'Lo beta'],
        [22.2, 24.6, 'Kam di hai'], [24.6, 28.8, 'Aasani rahegi'], [28.8, 35.6, 'The coins'], [35.6, 39.3, 'Counting'],
        [39.3, 42.2, 'Kam diye'], [42.2, 47.9, 'The answer'], [47.9, 51.2, 'Outsmarted'], [51.2, 59, 'Moral'],
    ],
    setup(env) {
        return { press: Riso.press(env) };
    },

    draw(g, t, env) {
        const { press } = env.state, R = Riso, T = R.tone, E = Ease;
        const d = Math.floor(t * 12 + 1e-6), tt = d / 12;
        const seg = (a, b) => E.seg(tt, a, b), lerp = E.lerp, lerpPt = E.lerpPt;
        const between = (a, b) => tt >= a && tt < b;
        const GY = 1080;
        press.begin(d);
        const Y = press.plate('yellow'), Ys = press.plate('yellow', 'screen');
        const P = press.plate('pink'), Ps = press.plate('pink', 'screen');
        const B = press.plate('blue'), Bs = press.plate('blue', 'screen');
        const N = press.plate('navy'), Ns = press.plate('navy', 'screen');

        // --- ink helpers -------------------------------------------------------------------------
        const poly = (pts, close = true) => {
            const p = new Path2D();
            pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
            if (close) p.closePath();
            return p;
        };
        const circ = (x, y, r, ry = r, rot = 0, a0 = 0, a1 = Math.PI * 2) => {
            const p = new Path2D();
            p.ellipse(x, y, r, ry, rot, a0, a1);
            if (a1 - a0 < Math.PI * 2) p.closePath();
            return p;
        };
        const ink = (path, ...pl) => {
            for (const [g2, v] of pl) {
                g2.fillStyle = T(v);
                g2.fill(path);
            }
        };
        const paper = (path) => press.knockout((g2) => g2.fill(path));
        const outline = (path, w = 3.5) => {
            N.save();
            N.lineWidth = w;
            N.lineJoin = 'round';
            N.strokeStyle = T(1);
            N.stroke(path);
            N.restore();
        };
        // a filled shape: knocked out, printed in its inks, outlined in navy
        const shp = (path, fills, ow = 3.5) => {
            paper(path);
            ink(path, ...fills);
            if (ow) outline(path, ow);
        };
        // a limb or rod: a navy-outlined tube of width w
        const tube = (pts, w, fills, ow = 3.5) => {
            const path = poly(pts, false);
            const strokeAll = (gs, width, v) => {
                for (const g2 of gs) {
                    g2.save();
                    g2.lineWidth = width;
                    g2.lineCap = 'round';
                    g2.lineJoin = 'round';
                    g2.strokeStyle = T(v);
                    g2.stroke(path);
                    g2.restore();
                }
            };
            press.knockout((g2) => { g2.lineWidth = w + ow * 2; g2.lineCap = 'round'; g2.lineJoin = 'round'; g2.stroke(path); });
            strokeAll([N], w + ow * 2, 1);
            press.knockout((g2) => { g2.lineWidth = w; g2.lineCap = 'round'; g2.lineJoin = 'round'; g2.stroke(path); });
            for (const [g2, v] of fills) strokeAll([g2], w, v);
        };
        const line = (pts, w, v = 1, plate = N) => {
            plate.save();
            plate.lineWidth = w;
            plate.lineCap = 'round';
            plate.lineJoin = 'round';
            plate.strokeStyle = T(v);
            plate.stroke(poly(pts, false));
            plate.restore();
        };
        const ik = (s, tg, l1, l2, bend) => {
            let dx = tg[0] - s[0], dy = tg[1] - s[1], dd = Math.hypot(dx, dy);
            const mx = l1 + l2 - 0.5;
            if (dd > mx) (tg = [s[0] + (dx / dd) * mx, s[1] + (dy / dd) * mx]), (dx = tg[0] - s[0]), (dy = tg[1] - s[1]), (dd = mx);
            const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd || 1))));
            const b = Math.atan2(dy, dx) + bend * a;
            return [[s[0] + Math.cos(b) * l1, s[1] + Math.sin(b) * l1], tg];
        };
        const text = (str, x, y, size, plate = N, v = 1, align = 'center') => {
            plate.save();
            plate.font = `${size}px Kalam`;
            plate.textAlign = align;
            plate.fillStyle = T(v);
            plate.fillText(str, x, y);
            plate.restore();
        };

        // colours as separations
        const SKIN = [[Ys, 0.5], [Ps, 0.3]], HAIR = [[N, 1], [Y, 0.35]], WOOD = [[Ns, 0.45], [P, 0.55], [Y, 0.9]];
        const NUT = [[Y, 0.8], [Ps, 0.35], [Ns, 0.1]], GOLD = [[Y, 1], [Ps, 0.15]];

        // who is talking, and how loud the voice is on this drawing
        const amp = MOUTH[Math.min(MOUTH.length - 1, d)] ?? 0;
        const speaking = (who) => LINES.some(([a, b, w]) => w === who && tt >= a && tt < b);
        const mouthOf = (who) => (speaking(who) ? amp : 0);
        const blink = (seed) => (d + seed * 17) % 41 === 0 || (d + seed * 17) % 41 === 1;

        // --- props --------------------------------------------------------------------------------
        const peanut = (x, y, s, rot, seed) => {
            const c = Math.cos(rot), sn = Math.sin(rot);
            const p = new Path2D();
            p.ellipse(x - c * 5 * s, y - sn * 5 * s, 6 * s, 5 * s, rot, 0, Math.PI * 2);
            p.moveTo(x + c * 5 * s + 6 * s, y + sn * 5 * s);
            p.ellipse(x + c * 5 * s, y + sn * 5 * s, 6.5 * s, 5.5 * s, rot, 0, Math.PI * 2);
            ink(p, ...NUT);
            outline(p, 1.6);
        };
        const cone = (x, y, s, nuts, seed = 'cone') => {
            // (x, y) = the middle of the open top; the tip points down
            for (let i = 0; i < nuts; i++) {
                const r = Motion.rng(seed + i);
                peanut(x + (r() - 0.5) * 40 * s, y - 4 - r() * 12 * s, s * 0.9, r() * 3, seed + i);
            }
            const body = poly([[x - 34 * s, y], [x + 34 * s, y], [x + 3 * s, y + 92 * s], [x - 3 * s, y + 92 * s]]);
            shp(body, [[Ys, 0.12]], 3);
            for (let k = 0; k < 4; k++) line([[x - 24 * s + k * 3 * s, y + 14 * s + k * 14 * s], [x + 18 * s - k * 6 * s, y + 14 * s + k * 14 * s]], 1.6, 0.8);
        };
        const coin = (x, y, r = 13) => {
            shp(circ(x, y, r), GOLD, 2.5);
            outline(circ(x, y, r * 0.6), 1.5);
        };

        // --- camera ---------------------------------------------------------------------------------
        const cam = Motion.keys([
            [0, [450, 800, 1.0]], [6.9, [450, 820, 1.06]], [18.0, [440, 830, 1.08]],
            [22.0, [290, 830, 1.38]], [24.4, [290, 830, 1.38]], [25.0, [590, 720, 1.42]], [28.5, [590, 720, 1.42]],
            [29.2, [430, 840, 1.15]], [35.3, [430, 840, 1.15]], [35.9, [440, 760, 1.5]], [39.1, [440, 760, 1.5]],
            [39.6, [590, 720, 1.42]], [42.0, [590, 720, 1.42]], [42.6, [300, 830, 1.32]], [47.5, [300, 830, 1.32]],
            [48.2, [540, 740, 1.35]], [50.8, [540, 740, 1.35]], [51.8, [450, 820, 1.0]],
        ], tt);
        press.save();
        press.each((g2) => { g2.translate(450, 800); g2.scale(cam[2], cam[2]); g2.translate(-cam[0], -cam[1]); });

        // --- the street ----------------------------------------------------------------------------
        Ps.fillStyle = R.ramp(Ps, 0, -200, 0, 1000, 0.05, 0.4);
        Ps.fillRect(-300, -300, 1500, 1350);
        Ys.fillStyle = R.ramp(Ys, 0, 200, 0, 1000, 0.0, 0.45);
        Ys.fillRect(-300, -300, 1500, 1350);
        shp(circ(730, 250, 70), [[Y, 1], [Ps, 0.3]], 0);
        // birds crossing
        for (let i = 0; i < 3; i++) {
            const x = ((tt * 40 + i * 260) % 1300) - 200, y = 170 + i * 40 + Math.sin(tt * 3 + i) * 6, up = (d + i) % 2;
            line([[x - 14, y - 6 - up * 6], [x, y], [x + 14, y - 6 - up * 6]], 3.5);
        }
        // houses
        const house = (x0, x1, top, wall, seed) => {
            shp(poly([[x0, GY], [x0, top], [x1, top], [x1, GY]]), wall, 4);
            shp(poly([[x0 - 14, top], [x1 + 14, top], [x1 + 14, top - 24], [x0 - 14, top - 24]]), [[Ns, 0.4], [Ps, 0.2]], 4);
            const r = Motion.rng(seed);
            for (let wy = top + 50; wy < GY - 170; wy += 150)
                for (let wx = x0 + 30; wx < x1 - 70; wx += 110) {
                    shp(poly([[wx, wy], [wx + 60, wy], [wx + 60, wy + 80], [wx, wy + 80]]), [[Bs, 0.5], [Ys, 0.1]], 3.5);
                    line([[wx + 30, wy], [wx + 30, wy + 80]], 3);
                    if (r() < 0.6) shp(poly([[wx - 6, wy + 80], [wx + 66, wy + 80], [wx + 66, wy + 90], [wx - 6, wy + 90]]), [[P, 0.8], [Y, 1]], 2.5);
                }
        };
        house(-40, 270, 560, [[Bs, 0.28], [Ys, 0.22]], 'h1');
        house(640, 960, 620, [[Ps, 0.3], [Ys, 0.4]], 'h2');
        // a cat on the left house's parapet, blinking, its tail swishing
        {
            const cx = 200, cy = 536;
            shp(poly([[cx - 22, cy], [cx - 18, cy - 34], [cx - 10, cy - 50], [cx - 14, cy - 66], [cx - 4, cy - 58], [cx + 6, cy - 58], [cx + 14, cy - 66], [cx + 12, cy - 48], [cx + 20, cy - 32], [cx + 24, cy]]), HAIR, 0);
            const sw = Math.sin(tt * 2.2) * 14;
            line([[cx + 22, cy - 4], [cx + 40, cy + 10], [cx + 46 + sw, cy + 34]], 6, 1);
            line([[cx + 22, cy - 4], [cx + 40, cy + 10], [cx + 46 + sw, cy + 34]], 6, 0.35, Y);
            if (!blink(3)) for (const ex of [-6, 6]) { paper(circ(cx + ex, cy - 44, 3.5)); ink(circ(cx + ex, cy - 44, 3.5), [Y, 1]); }
        }
        // an electricity pole and its wire, bunting across the street
        tube([[90, GY], [90, 330]], 12, [[Ns, 0.5], [Y, 0.4]], 3);
        line([[60, 350], [120, 350]], 6);
        line([[90, 352], [500, 420], [960, 380]], 2.5);
        const bunt = (x, y0, y1) => y0 + (y1 - y0) * (x / 900) + Math.sin((x / 900) * Math.PI) * 60;
        line(Array.from({ length: 19 }, (_, i) => [i * 50, bunt(i * 50, 330, 310)]), 2.5);
        for (let i = 0; i < 18; i++) {
            const x = 25 + i * 50, y = bunt(x, 330, 310), sw = Math.sin(tt * 3 + i) * 3;
            const fill = [[[P, 1]], [[Y, 1]], [[B, 1]], [[P, 1], [Y, 1]]][i % 4];
            shp(poly([[x - 18, y], [x + 18, y], [x + sw, y + 38]]), fill, 2.5);
        }
        // footpath and road
        shp(poly([[-300, GY - 30], [1200, GY - 30], [1200, GY + 40], [-300, GY + 40]]), [[Ns, 0.18], [Ys, 0.25]], 3);
        for (let x = -280; x < 1200; x += 90) line([[x, GY - 30], [x - 10, GY + 40]], 2, 0.5);
        shp(poly([[-300, GY + 40], [1200, GY + 40], [1200, 1900], [-300, 1900]]), [[Ns, 0.4], [Bs, 0.25]], 0);
        for (let x = -260; x < 1200; x += 160) shp(poly([[x, GY + 190], [x + 80, GY + 190], [x + 80, GY + 204], [x, GY + 204]]), [[Y, 1]], 0);

        // --- the vendor (behind his cart) --------------------------------------------------------------
        const VX = 540, CT = 830; // vendor's x, the cart top
        const vend = (() => {
            // poses by time: hand targets for the front (left) and back (right) arms
            const heap = [665, 805], hand = [360, 795];
            let front = [470, 770], back = [640, 760], wink = false, brows = 0, look = -0.4, jaw = 0, laugh = 0, shock = false, scratch = false, palm = false, count = -1;
            const stir = [470 + Math.cos(tt * 5) * 18, 790 + Math.sin(tt * 5) * 6];
            if (tt < 6.9) (front = stir), (back = [650, 740]);
            else if (tt < 15.4) {
                // two children: scoop, (cheat), hand over the cone
                const k = tt < 11.2 ? 0 : 1, t0 = k ? 11.2 : 7.4;
                const u = tt - t0;
                back = u < 0.8 ? heap : u < 1.4 ? lerpPt(heap, [700, 760], Math.sin(seg(t0 + 0.8, t0 + 1.4) * Math.PI)) : [650, 760];
                front = u < 1.6 ? [520, 790] : u < 2.6 ? lerpPt([520, 790], hand, seg(t0 + 1.6, t0 + 2.2)) : [500, 790];
                if (u > 0.8 && u < 1.4) look = 0.6; // a sideways glance while the handful goes back
                if (between(12.8, 14.8)) laugh = 0.4; // the glib talk
            } else if (tt < 18.3) (front = stir), (back = [650, 740]);
            else if (tt < 22.2) {
                back = tt < 19.0 ? heap : tt < 19.7 ? lerpPt(heap, [700, 760], Math.sin(seg(19.0, 19.7) * Math.PI)) : [650, 760];
                if (between(19.0, 19.7)) look = 0.6;
                front = tt < 19.8 ? [520, 790] : lerpPt([520, 790], hand, seg(19.8, 20.6));
                if (tt > 21.2) front = [500, 790];
            } else if (tt < 24.6) (front = [500, 790]), (back = [650, 760]);
            else if (tt < 28.8) (wink = between(25.0, 26.4)), (laugh = 1), (front = [540, 790]), (back = [650, 790]);
            else if (tt < 35.6) (front = tt < 32.4 ? [500, 790] : hand), (back = [650, 760]), (palm = tt >= 32.4);
            else if (tt < 39.3) {
                front = hand;
                palm = true;
                count = Math.floor((tt - 36.2) / 0.5);
                const tap = (d % 2) * 8;
                back = [hand[0] + 24, hand[1] - 28 + tap];
                if (tt > 38.0) (brows = 0.6), (back = [650, 760]);
            } else if (tt < 42.2) (shock = true), (brows = 1), (palm = true), (front = hand), (back = [hand[0] + 40, hand[1] - 50]);
            else if (tt < 47.9) (palm = true), (front = hand), (back = [650, 760]), (brows = 0.4);
            else if (tt < 51.2) (jaw = 1), (brows = 1), (palm = true), (front = hand), (back = [710, 690]); // the coins stay on the palm
            else (scratch = true), (front = [500, 790]), (brows = 0.5);
            if (scratch) back = [VX + 36, 525 + (d % 2) * 6];
            if (shock) front = hand;
            return { front, back, wink, brows, look, jaw, laugh, shock, palm, count };
        })();
        {
            const v = vend, sh = [[VX - 64, 660], [VX + 64, 660]];
            const bob = v.laugh ? Math.abs(Math.sin(tt * 9)) * 6 * v.laugh : 0;
            // back arm first (behind the body)
            const [be, bh] = ik(sh[1], v.back, 95, 88, 1);
            tube([sh[1], be, bh], 30, [[Ys, 0.1]]);
            shp(circ(bh[0], bh[1], 15), SKIN, 3);
            // body: white kurta, blue vest
            const torso = poly([[VX - 72, 655 + bob], [VX + 72, 655 + bob], [VX + 82, CT + 30], [VX - 82, CT + 30]]);
            shp(torso, [[Ys, 0.1]], 4);
            shp(poly([[VX - 70, 662 + bob], [VX - 18, 662 + bob], [VX - 10, CT + 30], [VX - 78, CT + 30]]), [[B, 1]], 3.5);
            shp(poly([[VX + 70, 662 + bob], [VX + 18, 662 + bob], [VX + 10, CT + 30], [VX + 78, CT + 30]]), [[B, 1]], 3.5);
            for (let i = 0; i < 3; i++) shp(circ(VX - 22, 700 + i * 36 + bob, 5), GOLD, 1.8);
            // head
            const hx = VX - 6, hy = 575 + bob;
            shp(circ(hx, hy + 52, 22, 14), SKIN, 3); // neck
            shp(circ(hx + 52, hy + 4, 12, 17), SKIN, 3); // ear
            shp(circ(hx, hy, 60, 64), SKIN, 4);
            shp(circ(hx + 18, hy + 30, 14, 9), [[Ps, 0.45]], 0); // cheek
            shp(circ(hx - 44, hy + 22, 13, 9), [[Ps, 0.45]], 0);
            // turban with a knot and folds
            shp(poly([[hx - 66, hy - 8], [hx - 70, hy - 44], [hx - 40, hy - 78], [hx + 10, hy - 88], [hx + 58, hy - 70], [hx + 70, hy - 30], [hx + 64, hy - 4], [hx + 20, hy - 26], [hx - 30, hy - 22]]), [[P, 0.8], [Y, 1]], 4);
            for (let i = 0; i < 3; i++) line([[hx - 60 + i * 8, hy - 18 - i * 18], [hx + 60 - i * 6, hy - 26 - i * 18]], 2.5);
            shp(circ(hx + 66, hy - 46, 16, 20), [[P, 0.8], [Y, 1]], 3.5);
            // eyes and brows (he faces left, a little toward us)
            const by = -v.brows * 12;
            for (const [ex, k] of [[hx - 34, 0], [hx - 2, 1]]) {
                if ((v.wink && k === 1) || blink(1)) line([[ex - 10, hy - 2], [ex, hy + 3], [ex + 10, hy - 2]], 3.5);
                else {
                    const er = v.shock || v.jaw ? 13 : 10;
                    shp(circ(ex, hy - 4, er, er + 2), [[Ys, 0.04]], 3);
                    ink(circ(ex + v.look * 5, hy - 2, v.shock || v.jaw ? 4.5 : 5.5), [N, 1], [Y, 0.3]);
                }
                line([[ex - 13, hy - 22 + by - (k ? 0 : 2)], [ex + 12, hy - 24 + by + (k ? 2 : 0)]], 6, 1);
            }
            // nose
            shp(poly([[hx - 20, hy + 2], [hx - 36, hy + 22], [hx - 30, hy + 30], [hx - 14, hy + 26]]), SKIN, 3);
            // mouth: open with the voice, a grin when laughing, a big O when outsmarted
            const mo = v.jaw ? 1 : mouthOf('v');
            if (v.jaw) shp(circ(hx - 18, hy + 52, 16, 22), [[P, 1], [N, 0.7]], 3);
            else if (mo > 0.08 || v.laugh) shp(circ(hx - 18, hy + 46, 16, 4 + 12 * Math.max(mo, v.laugh * 0.6), 0, 0, Math.PI), [[P, 1], [N, 0.7]], 3);
            else line([[hx - 32, hy + 44], [hx - 18, hy + 50], [hx - 4, hy + 44]], 3.5);
            // the moustache, curled up at both ends
            shp(poly([[hx - 18, hy + 34], [hx - 40, hy + 30], [hx - 58, hy + 34], [hx - 66, hy + 20], [hx - 56, hy + 26], [hx - 36, hy + 22], [hx - 18, hy + 28], [hx + 2, hy + 22], [hx + 22, hy + 26], [hx + 30, hy + 14], [hx + 30, hy + 30], [hx + 4, hy + 34]]), HAIR, 0);
            // front arm, over the body
            const [fe, fh] = ik(sh[0], v.front, 95, 88, -1);
            tube([sh[0], fe, fh], 30, [[Ys, 0.1]]);
            if (v.palm) {
                shp(circ(fh[0], fh[1], 24, 14), SKIN, 3);
                shp(circ(fh[0] + 22, fh[1] - 6, 7, 10, -0.5), SKIN, 2.5); // thumb
            } else shp(circ(fh[0], fh[1], 16), SKIN, 3);
            vend.hand = fh;
            vend.head = [hx, hy];
        }

        // --- the cart -------------------------------------------------------------------------------------
        {
            // umbrella: pole and striped canopy
            tube([[760, 1000], [760, 455]], 10, [[Ns, 0.6]], 3);
            for (let i = 0; i < 6; i++) {
                const a0 = Math.PI + (i / 6) * Math.PI, a1 = Math.PI + ((i + 1) / 6) * Math.PI;
                const pts = [[650, 470], ...Array.from({ length: 7 }, (_, k) => { const a = a0 + ((a1 - a0) * k) / 6; return [650 + Math.cos(a) * 280, 470 + Math.sin(a) * 110]; })];
                shp(poly(pts), i % 2 ? [[Ys, 0.15]] : [[P, 1], [Y, 0.5]], 3.5);
            }
            for (let i = 0; i <= 12; i++) {
                const x = 370 + i * (560 / 12);
                shp(poly([[x - 23, 470], [x + 23, 470], [x, 492]]), i % 2 ? [[P, 1], [Y, 0.5]] : [[Ys, 0.15]], 2.5);
            }
            // stove with a flickering fire, the kadhai, roasting nuts, smoke
            shp(poly([[412, CT], [532, CT], [526, CT - 34], [418, CT - 34]]), HAIR, 3);
            const fl = (d % 3) * 4;
            for (let i = 0; i < 4; i++) {
                const fx = 432 + i * 26, fh2 = 22 + ((i + d) % 3) * 8;
                shp(poly([[fx - 10, CT - 34], [fx + 10, CT - 34], [fx + 2 + fl * 0.3, CT - 34 - fh2]]), [[Y, 1], [P, 0.6]], 2);
            }
            shp(circ(472, CT - 42, 78, 34, 0, 0, Math.PI), HAIR, 4);
            line([[390, CT - 44], [554, CT - 44]], 5);
            for (let i = 0; i < 9; i++) peanut(420 + i * 13, CT - 50 - (i % 3) * 5, 1.2, i + d * 0.5, 'k' + i);
            for (let k = 0; k < 4; k++) {
                const age = (tt * 0.45 + k / 4) % 1;
                const p = circ(460 + Math.sin(age * 6 + k) * 22, CT - 70 - age * 260, 6 + age * 13);
                paper(p);
                ink(p, [Bs, 0.16 * (1 - age)], [Ys, 0.1]);
            }
            // the heap of roasted nuts on a tray, paper cones
            shp(circ(665, CT - 8, 72, 40, 0, Math.PI, Math.PI * 2), NUT, 3.5);
            const hr = Motion.rng('heap');
            for (let i = 0; i < 26; i++) {
                const a = Math.PI + hr() * Math.PI, rr = Math.sqrt(hr()) * 0.85;
                peanut(665 + Math.cos(a) * 66 * rr, CT - 10 + Math.sin(a) * 36 * rr, 1.1, hr() * 3, 'h' + i);
            }
            line([[585, CT - 6], [745, CT - 6]], 5);
            for (let i = 0; i < 3; i++) shp(poly([[730 + i * 8, CT - 70], [770 + i * 8, CT - 70], [752 + i * 8, CT - 6]]), [[Ys, 0.12]], 2.5);
            // body, sign board, wheels, handles
            shp(poly([[330, CT], [790, CT], [780, 960], [340, 960]]), WOOD, 4.5);
            for (let y = CT + 26; y < 960; y += 26) line([[338, y], [784, y]], 2, 0.7);
            shp(poly([[395, 858], [705, 858], [705, 938], [395, 938]]), [[Y, 1]], 4);
            text('मूँगफली', 550, 918, 58);
            shp(circ(735, 898, 24), [[P, 1]], 3);
            text('₹5', 735, 908, 26, N, 1);
            for (const wx of [420, 700]) {
                shp(circ(wx, 1010, 68), HAIR, 4);
                shp(circ(wx, 1010, 50), [[Ns, 0.25], [Ys, 0.2]], 3);
                for (let k = 0; k < 6; k++) {
                    const a = (k / 6) * Math.PI + 0.3;
                    line([[wx + Math.cos(a) * 48, 1010 + Math.sin(a) * 48], [wx - Math.cos(a) * 48, 1010 - Math.sin(a) * 48]], 4);
                }
                shp(circ(wx, 1010, 10), GOLD, 3);
            }
            tube([[788, 930], [880, 905]], 12, WOOD, 3);
        }

        // --- children ---------------------------------------------------------------------------------------
        // a child standing on the footpath at x, s scale, facing +1 (right) or -1
        const child = (x, s, o = {}) => {
            const { facing = 1, shirt = [[Y, 1]], bag = false, girl = false, walk = 0, arm = 'down', hold = null, talk = 0, look = 0.4, smile = 1, eyesDown = 0, seed = 'c' } = o;
            press.save();
            if (facing < 0) press.each((g2) => { g2.translate(x, 0); g2.scale(-1, 1); g2.translate(-x, 0); });
            const sw = Math.sin(walk * Math.PI * 2);
            const hip = [x, GY - 132 * s], top = GY - 262 * s;
            // legs and shoes
            for (const [k, side] of [[0, -1], [1, 1]]) {
                const ph = side * sw * 0.5, knee = [hip[0] + side * 12 * s + Math.sin(ph) * 30 * s, GY - 66 * s], foot = [hip[0] + side * 12 * s + Math.sin(ph) * 48 * s, GY - 10 * s];
                tube([[hip[0] + side * 14 * s, hip[1] + 10 * s], knee, foot], 15 * s, SKIN, 3);
                shp(circ(foot[0] + 8 * s, foot[1] + 2 * s, 17 * s, 9 * s), HAIR, 2.5);
            }
            // back arm
            const shB = [x - 40 * s, top + 16 * s], shF = [x + 40 * s, top + 16 * s];
            const [be, bh] = ik(shB, [x - 46 * s - sw * 20 * s, top + 130 * s], 58 * s, 55 * s, 1);
            tube([shB, be, bh], 14 * s, SKIN, 3);
            shp(circ(bh[0], bh[1], 10 * s), SKIN, 2.5);
            // bag
            if (bag) {
                shp(poly([[x - 74 * s, top + 10 * s], [x - 30 * s, top + 4 * s], [x - 26 * s, top + 110 * s], [x - 70 * s, top + 116 * s]]), [[B, 1], [P, 0.25]], 3.5);
                line([[x - 64 * s, top + 60 * s], [x - 34 * s, top + 58 * s]], 3);
            }
            // shorts / skirt, shirt
            if (girl) shp(poly([[x - 40 * s, top + 100 * s], [x + 40 * s, top + 100 * s], [x + 58 * s, hip[1] + 26 * s], [x - 58 * s, hip[1] + 26 * s]]), [[P, 1], [B, 0.35]], 3.5);
            else shp(poly([[x - 38 * s, top + 104 * s], [x + 38 * s, top + 104 * s], [x + 42 * s, hip[1] + 18 * s], [x + 4 * s, hip[1] + 18 * s], [x, hip[1] - 4 * s], [x - 4 * s, hip[1] + 18 * s], [x - 42 * s, hip[1] + 18 * s]]), [[B, 1], [Ns, 0.35]], 3.5);
            shp(poly([[x - 44 * s, top], [x + 44 * s, top], [x + 40 * s, top + 108 * s], [x - 40 * s, top + 108 * s]]), shirt, 4);
            line([[x - 12 * s, top + 2 * s], [x, top + 18 * s], [x + 12 * s, top + 2 * s]], 3);
            if (bag) line([[x - 34 * s, top + 4 * s], [x + 30 * s, top + 100 * s]], 6 * s, 1, B);
            // head
            const hx = x + 6 * s, hy = top - 50 * s;
            shp(circ(hx - 44 * s, hy + 4 * s, 9 * s, 13 * s), SKIN, 2.5);
            shp(circ(hx, hy, 50 * s, 52 * s), SKIN, 4);
            shp(circ(hx + 24 * s, hy + 22 * s, 10 * s, 6 * s), [[Ps, 0.45]], 0);
            // hair (a girl: two pigtails)
            shp(poly([[hx - 52 * s, hy + 4 * s], [hx - 50 * s, hy - 34 * s], [hx - 20 * s, hy - 58 * s], [hx + 20 * s, hy - 56 * s], [hx + 50 * s, hy - 26 * s], [hx + 48 * s, hy - 12 * s], [hx + 30 * s, hy - 24 * s], [hx + 22 * s, hy - 12 * s], [hx + 10 * s, hy - 26 * s], [hx - 10 * s, hy - 18 * s], [hx - 30 * s, hy - 22 * s], [hx - 40 * s, hy - 4 * s]]), HAIR, 0);
            if (girl) for (const py of [-14, 10]) shp(circ(hx - 58 * s, hy + py * s, 13 * s, 16 * s), HAIR, 0);
            // eyes, brows, mouth
            for (const ex of [hx + 4 * s, hx + 28 * s]) {
                if (blink(seed.length)) line([[ex - 6 * s, hy - 2 * s], [ex + 6 * s, hy - 2 * s]], 3);
                else ink(circ(ex + look * 4 * s, hy - 4 * s + eyesDown * 5 * s, 5.5 * s), [N, 1], [Y, 0.3]);
                line([[ex - 8 * s, hy - 20 * s], [ex + 8 * s, hy - 22 * s]], 3.5);
            }
            const mx = hx + 20 * s, my = hy + 26 * s;
            if (talk > 0.08) shp(circ(mx, my, 10 * s, 3 * s + 9 * s * talk, 0, 0, Math.PI), [[P, 1], [N, 0.6]], 2.5);
            else if (smile > 0) line([[mx - 10 * s, my - 2 * s], [mx, my + 4 * s * smile], [mx + 10 * s, my - 2 * s]], 3.2);
            else line([[mx - 8 * s, my + 2 * s], [mx + 8 * s, my + 2 * s]], 3.2);
            // front arm: down, holding a cone, giving / receiving, eating, in the pocket
            const targets = { down: [x + 46 * s - sw * 20 * s, top + 130 * s], pocket: [x + 30 * s, top + 120 * s], eat: [hx + 30 * s, hy + 40 * s] };
            const tg = typeof arm === 'string' ? targets[arm] ?? targets.down : arm;
            const [fe, fh] = ik(shF, tg, 58 * s, 55 * s, typeof arm === 'string' && arm === 'down' ? -1 : 1);
            if (hold === 'cone') cone(fh[0], fh[1] - 14 * s, s * 0.85, o.nuts ?? 6, seed + 'cone');
            tube([shF, fe, fh], 14 * s, SKIN, 3);
            shp(circ(fh[0], fh[1], 10 * s), SKIN, 2.5);
            if (hold === 'coins') for (let i = 0; i < 3; i++) coin(fh[0] - 6 + i * 7, fh[1] - 10 - i * 4, 9);
            press.restore();
            return { hand: facing > 0 ? fh : [2 * x - fh[0], fh[1]], head: [facing > 0 ? hx : 2 * x - hx, hy] };
        };

        // the two children of the short-weight montage
        const HAND = [360, 795];
        [[7.0, 11.0, 'k1', [[P, 0.8], [Y, 1]], true], [10.6, 14.9, 'k2', [[B, 0.8], [Y, 0.5]], false]].forEach(([t0, t1, seed, shirt, girl]) => {
            if (!between(t0, t1 + 1.6)) return;
            const arrive = seg(t0, t0 + 0.9), leave = seg(t1, t1 + 1.5);
            const x = leave > 0 ? lerp(285, -120, leave) : lerp(-120, 285, arrive);
            const walking = arrive < 1 || leave > 0;
            const got = tt > t0 + 2.4;
            const reach = !got && tt > t0 + 1.8;
            child(x, 0.82, {
                facing: leave > 0 ? -1 : 1, shirt, girl, walk: walking ? tt * 2 : 0, seed,
                arm: reach ? HAND : got ? (leave > 0 ? 'eat' : [x + 50, GY - 200]) : 'down', hold: got ? 'cone' : null, nuts: 4,
                smile: 1, look: 0.4,
            });
        });
        if (between(7.0, 15.4)) {
            // the cone in the vendor's hand on its way to a child
            for (const t0 of [7.0, 10.6]) if (between(t0 + 1.6, t0 + 2.4)) cone(vend.hand[0], vend.hand[1] - 16, 0.75, 4, 'vc' + t0);
        }

        // Raju
        {
            let x = 255, o = { bag: true, shirt: [[Y, 1], [Ps, 0.12]], seed: 'raju', look: 0.5 };
            if (tt < 15.4) x = -200;
            else if (tt < 17.6) (x = lerp(-120, 255, seg(15.4, 17.4))), (o.walk = tt * 2);
            else if (tt < 20.0) o.arm = 'down';
            else if (tt < 20.9) o.arm = HAND;
            else if (tt < 22.2) (o.arm = [x + 56, GY - 205]), (o.hold = 'cone'), (o.nuts = 3);
            else if (tt < 24.6) (o.arm = [x + 62, GY - 212]), (o.hold = 'cone'), (o.nuts = 3), (o.eyesDown = tt < 23.0 ? 1 : 0), (o.smile = 0);
            else if (tt < 28.8) (o.arm = [x + 56, GY - 205]), (o.hold = 'cone'), (o.nuts = 3), (o.smile = 0);
            else if (tt < 30.6) (o.arm = 'down'), (o.smile = 0);
            else if (tt < 31.8) o.arm = 'pocket';
            else if (tt < 32.8) (o.arm = [x + 60, GY - 230]), (o.hold = 'coins');
            else if (tt < 34.4) (o.arm = lerpPt([x + 60, GY - 230], HAND, seg(32.8, 33.8))), (o.hold = tt < 34.0 ? 'coins' : null);
            else if (tt < 42.2) (o.arm = 'down'), (o.smile = 0.6);
            else if (tt < 46.2) (o.arm = 'down'), (o.smile = 1.2);
            else if (tt < 47.4) (o.arm = HAND), (o.smile = 1.2);
            else {
                const u = seg(47.6, 50.8);
                (x = lerp(255, -140, u)), (o.facing = -1), (o.walk = u < 1 ? tt * 2 : 0), (o.arm = 'eat'), (o.hold = 'cone'), (o.nuts = 3), (o.smile = 1.2);
            }
            if (tt < 47.4 && tt > 20.9) o.nuts = o.nuts ?? 3;
            if (tt >= 46.2 && tt < 47.4) (o.hold = 'cone'), (o.nuts = 3);
            o.talk = mouthOf('b');
            if (x > -180) child(x, 1, o);
        }

        // coins: on the vendor's palm once given
        if (tt >= 34.0) for (let i = 0; i < 3; i++) coin(vend.hand[0] - 12 + i * 12, vend.hand[1] - 6 - (i % 2) * 4, 10);
        // counting: १ २ ३ pop over the palm, then the question mark
        for (let i = 0; i < 3; i++) {
            const t0 = 36.2 + i * 0.5;
            if (between(t0, 38.0)) {
                const pop = E.back(seg(t0, t0 + 0.25));
                text(['१', '२', '३'][i], vend.hand[0] - 40 + i * 40, vend.hand[1] - 70 - pop * 10, 46 * Math.max(0.2, pop), N, 1);
            }
        }
        if (between(38.0, 42.2)) text('?', vend.head[0] + 70, vend.head[1] - 100 + (d % 2) * 4, 90, N, 1);
        if (between(48.0, 51.2)) for (const [dx, a] of [[-90, -0.4], [80, 0.4]]) {
            const bx = vend.head[0] + dx, by = vend.head[1] - 110;
            line([[bx, by], [bx + Math.sin(a) * 30, by - 40]], 7);
        }
        // sweat drop when he is outsmarted
        if (tt > 39.4 && tt < 51.2) shp(poly([[vend.head[0] + 50, vend.head[1] - 50], [vend.head[0] + 58, vend.head[1] - 28], [vend.head[0] + 50, vend.head[1] - 20], [vend.head[0] + 42, vend.head[1] - 28]]), [[Bs, 0.6]], 2.5);

        press.restore();

        // --- words on the screen (not moved by the camera) ------------------------------------------
        // title at the start
        if (tt < 6.6) {
            const u = seg(0.3, 1.2) * (1 - seg(6.0, 6.5));
            if (u > 0) {
                const bx = poly([[90, 250], [810, 250], [810, 360], [90, 360]]);
                press.save();
                press.clip((g2) => g2.rect(90, 240, 720 * u, 140));
                shp(bx, [[Ys, 0.2]], 4);
                text('लड़का और मूँगफली वाला', 450, 328, 62);
                press.restore();
            }
        }
        // subtitles of the voice, wrapped in a paper box (inside the Shorts safe area)
        const cur = LINES.find(([a, b]) => tt >= a && tt < b + 0.25);
        if (cur) {
            N.save();
            N.font = '42px Kalam';
            const words = cur[3].split(' '), lines = [];
            let ln = '';
            for (const w of words) {
                const tryLn = ln ? ln + ' ' + w : w;
                if (N.measureText(tryLn).width > 660 && ln) (lines.push(ln), (ln = w));
                else ln = tryLn;
            }
            lines.push(ln);
            N.restore();
            // long lines: show two text lines at a time, paged by time
            const pages = Math.ceil(lines.length / 2), pg = Math.min(pages - 1, Math.floor(((tt - cur[0]) / (cur[1] - cur[0])) * pages));
            const show = lines.slice(pg * 2, pg * 2 + 2);
            const y0 = 1180, hBox = 30 + show.length * 54;
            const tint = cur[2] === 'v' ? [[Ps, 0.25], [Ys, 0.2]] : cur[2] === 'b' ? [[Ys, 0.4]] : [[Bs, 0.15]];
            shp(poly([[60, y0], [780, y0], [780, y0 + hBox], [60, y0 + hBox]]), tint, 3.5);
            show.forEach((s, i) => text(s, 420, y0 + 58 + i * 54, 42));
        }
        // the moral, written at the top and held to the end
        if (tt >= 52.3) {
            const u1 = seg(52.3, 53.4), u2 = seg(54.8, 55.9);
            press.save();
            press.clip((g2) => { g2.rect(60, 200, 760 * u1, 90); g2.rect(60, 290, 760 * u2, 90); });
            shp(poly([[60, 205], [840, 205], [840, 375], [60, 375]]), [[P, 0.9], [Y, 0.25]], 4);
            press.restore();
            press.save();
            press.clip((g2) => { g2.rect(60, 200, 760 * u1, 90); g2.rect(60, 290, 760 * u2, 90); });
            press.knockout((g2) => {
                g2.font = '46px Kalam';
                g2.textAlign = 'center';
                g2.fillText('ज़रूरत से ज़्यादा चालाक बनने वाले,', 450, 272);
                g2.fillText('अक्सर खुद ही मात खा जाते हैं', 450, 350);
            });
            press.restore();
        }

        press.print(g, { key: d });
    },
});
