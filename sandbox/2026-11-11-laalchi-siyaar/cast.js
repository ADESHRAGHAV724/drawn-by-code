// laalchi-siyaar · the cast as etchings: a jackal, a wild boar, a hunter, his bow and arrow.
// Each piece is an Etch.form (paper, hatching, contour); limbs are tapered Etch.limb pairs.
// Every drawing function works in the creature's own frame (facing right, feet on y = 0)
// and returns the world positions the scene needs (mouth, tusk, hands, belly…).
// Global: Cast. Depends on Etch.
const Cast = (() => {
    const E = () => Etch;
    const rotP = ([x, y], a, [cx, cy] = [0, 0]) => {
        const c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy;
        return [cx + dx * c - dy * s, cy + dx * s + dy * c];
    };
    const polar = ([x, y], a, l) => [x + Math.cos(a) * l, y + Math.sin(a) * l];
    // positions in the caller's coordinates: remember the transform on entry, then map a
    // local point through (entry⁻¹ · current)
    const framer = (g) => {
        const base = g.getTransform().inverse();
        return (p) => {
            const m = base.multiply(g.getTransform());
            return [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
        };
    };

    function ik(s, t, l1, l2, bend) {
        let dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy);
        const mx = l1 + l2 - 0.5;
        if (d > mx) (t = [s[0] + (dx / d) * mx, s[1] + (dy / d) * mx]), (dx = t[0] - s[0]), (dy = t[1] - s[1]), (d = mx);
        const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d || 1))));
        const b = Math.atan2(dy, dx) + bend * a;
        return [[s[0] + Math.cos(b) * l1, s[1] + Math.sin(b) * l1], t];
    }

    // a leg from the hip: thigh at angle a1, shin at a2 (radians, π/2 = straight down)
    function leg(g, hip, a1, l1, a2, l2, w, tone, seed, paw = 1) {
        const knee = polar(hip, a1, l1), foot = polar(knee, a2, l2);
        E().limb(g, hip, knee, w, w * 0.62, { tone, shade: 0.4, lw: 1.8, seed: seed + 'u' });
        E().limb(g, knee, foot, w * 0.6, w * 0.42, { tone, shade: 0.3, lw: 1.6, seed: seed + 'l' });
        if (paw) E().form(g, [[foot[0] - w * 0.25, foot[1] - w * 0.25], [foot[0] + w * 0.55 * paw, foot[1] - w * 0.15], [foot[0] + w * 0.6 * paw, foot[1] + 1], [foot[0] - w * 0.3, foot[1] + 1]], { tone: tone + 0.2, shade: 0, lw: 1.6, seed: seed + 'p' });
        return foot;
    }

    /**
     * The jackal. o: facing, ph (gait phase), walking, run, head (pitch, + = down), jaw
     * (0..1), tail (0..1 raised), lift, rot (whole-body tilt), lying, eyesClosed, sly.
     * Returns { mouth, head, nose } in world units.
     */
    function jackal(g, x, y, s, o = {}) {
        const world = framer(g);
        const { facing = 1, ph = 0, walking = false, run = false, head = 0, jaw = 0, tail = 0.3, lift = 0, rot = 0, lying = false, eyesClosed = false, sly = false, seed = 'jackal' } = o;
        g.save();
        g.translate(x, y - lift);
        g.scale(facing * s, s);
        if (lying) {
            g.translate(0, 36);
            g.rotate(-0.08);
        }
        if (rot) {
            g.translate(0, -80);
            g.rotate(rot);
            g.translate(0, 80);
        }
        const sw = (off) => (walking || run ? Math.sin(ph * Math.PI * 2 + off) * (run ? 0.7 : 0.4) : 0);
        const out = {};
        // legs: lying = splayed forward and back
        const legsFar = lying ? [[[-55, -78], 2.6, 2.9], [[55, -78], 0.5, 0.25]] : [[[-55, -80], Math.PI / 2 + sw(Math.PI), Math.PI / 2 + sw(Math.PI) * 0.4 + 0.15], [[55, -80], Math.PI / 2 - sw(0), Math.PI / 2 - sw(0) * 0.4 - 0.05]];
        legsFar.forEach(([hip, a1, a2], i) => leg(g, hip, a1, 42, a2, 44, 15, 0.55, seed + 'lf' + i));
        // tail: bushy, raised by `tail`
        const tu = tail * 0.6;
        E().form(g, [[-72, -100], ...[[-105, -98 - tu * 40], [-140, -80 - tu * 70], [-160, -50 - tu * 80]].map((p) => p), [-150, -36 - tu * 70], [-125, -58 - tu * 50], [-84, -78]], { tone: 0.45, shade: 0.6, angle: -0.4, seed: seed + 'tail', lw: 2 });
        E().form(g, [[-152, -54 - tu * 78], [-163, -48 - tu * 80], [-152, -36 - tu * 70], [-140, -42 - tu * 72]], { tone: 0.9, shade: 0, seed: seed + 'tip', lw: 1.6 });
        // body
        E().form(g, [[-82, -96], [-52, -116], [10, -112], [58, -114], [86, -98], [82, -72], [40, -62], [-20, -60], [-72, -68]], { tone: 0.32, shade: 0.7, angle: -0.6, seed: seed + 'body' });
        for (let i = 0; i < 6; i++) E().stroke(g, [[-50 + i * 18, -112], [-44 + i * 18, -104]], 1.4); // fur along the back
        // near legs
        const legsNear = lying ? [[[-48, -74], 2.8, 3.0], [[62, -74], 0.35, 0.1]] : [[[-48, -76], Math.PI / 2 + sw(0), Math.PI / 2 + sw(0) * 0.4 + 0.15], [[62, -76], Math.PI / 2 - sw(Math.PI), Math.PI / 2 - sw(Math.PI) * 0.4 - 0.05]];
        legsNear.forEach(([hip, a1, a2], i) => leg(g, hip, a1, 42, a2, 46, 17, 0.4, seed + 'ln' + i));
        // neck and head, pitched by `head` about the neck
        const pivot = [72, -104];
        g.save();
        g.translate(pivot[0], pivot[1]);
        g.rotate(head);
        g.translate(-pivot[0], -pivot[1]);
        E().form(g, [[58, -112], [82, -140], [100, -132], [96, -104], [80, -90]], { tone: 0.35, shade: 0.5, seed: seed + 'neck', lw: 2 });
        // lower jaw, opened about its hinge
        g.save();
        g.translate(116, -120);
        g.rotate(jaw * 0.5);
        g.translate(-116, 120);
        E().form(g, [[112, -122], [158, -124], [154, -114], [118, -110]], { tone: 0.35, shade: 0.3, seed: seed + 'jaw', lw: 1.8 });
        out.jawTip = world([156, -119]);
        g.restore();
        if (jaw > 0.15) E().form(g, [[124, -122], [150, -124], [148, -118], [126, -116]], { tone: 0.95, shade: 0, seed: seed + 'mouthIn', lw: 0, raw: true });
        // skull and snout
        E().form(g, [[84, -150], [102, -160], [124, -150], [160, -134], [168, -126], [150, -122], [116, -118], [92, -122]], { tone: 0.3, shade: 0.55, angle: -0.5, seed: seed + 'skull' });
        // ears, pointed
        E().form(g, [[94, -152], [92, -188], [110, -158]], { tone: 0.55, shade: 0, seed: seed + 'ear1', lw: 1.8, raw: true });
        E().form(g, [[106, -156], [112, -190], [122, -154]], { tone: 0.4, shade: 0, seed: seed + 'ear2', lw: 1.8, raw: true });
        E().dot(g, 166, -128, 4); // nose
        if (eyesClosed) E().stroke(g, [[114, -142], [120, -139], [127, -142]], 2, { raw: true });
        else if (sly) {
            E().stroke(g, [[113, -142], [128, -143]], 2.4, { raw: true });
            E().dot(g, 122, -141.5, 2.2);
        } else {
            E().dot(g, 121, -142, 3.6);
            E().dot(g, 120, -143, 1, E().PAPER);
        }
        // a grin line when not talking
        if (jaw <= 0.15) E().stroke(g, [[128, -122], [142, -120], [152, -123]], 1.8, { raw: true });
        out.mouth = world([150, -121]);
        out.head = world([118, -150]);
        out.nose = world([166, -128]);
        g.restore();
        g.restore();
        return out;
    }

    /**
     * The wild boar. o: facing, ph, run, head (pitch), mouth (0..1 open, a squeal), lift, rot,
     * lying, arrow (true: the arrow stands in its belly), eyesClosed.
     * Returns { tusk, belly, snout }.
     */
    function boar(g, x, y, s, o = {}) {
        const world = framer(g);
        const { facing = 1, ph = 0, run = false, head = 0, mouth = 0, lift = 0, rot = 0, lying = false, arrow = false, eyesClosed = false, seed = 'boar' } = o;
        g.save();
        g.translate(x, y - lift);
        g.scale(facing * s, s);
        if (lying) {
            g.translate(0, 34);
            g.rotate(0.05);
        }
        if (rot) {
            g.translate(-40, 0);
            g.rotate(rot);
            g.translate(40, 0);
        }
        const sw = (off) => (run ? Math.sin(ph * Math.PI * 2 + off) * 0.6 : 0);
        const out = {};
        const legsFar = lying ? [[[-80, -60], 2.7, 2.9], [[60, -60], 0.4, 0.2]] : [[[-80, -62], Math.PI / 2 + sw(Math.PI), Math.PI / 2 + 0.1], [[62, -62], Math.PI / 2 - sw(0), Math.PI / 2 - 0.05]];
        legsFar.forEach(([hip, a1, a2], i) => leg(g, hip, a1, 30, a2, 30, 20, 0.75, seed + 'lf' + i, 0.6));
        // little curled tail
        E().stroke(g, [[-118, -100], [-132, -110], [-136, -96], [-128, -92]], 3);
        // body: heavy, dark, bristly
        E().form(g, [[-122, -72], [-104, -124], [-40, -152], [40, -150], [92, -126], [106, -92], [96, -58], [40, -48], [-60, -46], [-112, -54]], { tone: 0.62, shade: 0.9, angle: -0.5, seed: seed + 'body', lw: 2.8 });
        // the bristle crest along the spine
        for (let i = 0; i < 16; i++) {
            const u = i / 15, bx = -90 + u * 170, by = -132 - Math.sin(u * Math.PI) * 22;
            E().stroke(g, [[bx, by + 6], [bx - 6, by - 10 - (i % 3) * 3]], 2.2, { raw: true });
        }
        out.belly = world([0, -56]);
        if (arrow) {
            // the arrow stands in the belly, its shaft out toward where it came from
            const tip = [6, -60], tail = [-58, -4];
            arrowAt(g, tail, tip, seed + 'arw');
        }
        const legsNear = lying ? [[[-72, -56], 2.9, 3.0], [[70, -56], 0.3, 0.1]] : [[[-72, -58], Math.PI / 2 + sw(0), Math.PI / 2 + 0.1], [[70, -58], Math.PI / 2 - sw(Math.PI), Math.PI / 2 - 0.05]];
        legsNear.forEach(([hip, a1, a2], i) => leg(g, hip, a1, 30, a2, 32, 22, 0.6, seed + 'ln' + i, 0.6));
        // head, pitched about the neck
        const pv = [88, -110];
        g.save();
        g.translate(pv[0], pv[1]);
        g.rotate(head);
        g.translate(-pv[0], -pv[1]);
        if (mouth > 0.1) {
            g.save();
            g.translate(150, -70);
            g.rotate(mouth * 0.45);
            g.translate(-150, 70);
            E().form(g, [[132, -70], [176, -66], [170, -56], [136, -58]], { tone: 0.6, shade: 0.3, seed: seed + 'jaw', lw: 2 });
            g.restore();
        }
        E().form(g, [[84, -136], [118, -128], [162, -96], [186, -86], [192, -72], [172, -64], [132, -62], [96, -78]], { tone: 0.55, shade: 0.75, angle: -0.4, seed: seed + 'head', lw: 2.6 });
        E().form(g, [[184, -88], [194, -84], [196, -70], [186, -66]], { tone: 0.75, shade: 0, seed: seed + 'snout', lw: 2 });
        E().dot(g, 190, -78, 1.8, E().PAPER);
        // tusk: a pale curved blade
        E().form(g, [[166, -70], [176, -78], [186, -100], [182, -102], [170, -82], [162, -74]], { tone: 0.05, shade: 0, seed: seed + 'tusk', lw: 2, raw: true });
        out.tusk = world([186, -100]);
        out.snout = world([194, -78]);
        // ear
        E().form(g, [[104, -134], [96, -166], [122, -138]], { tone: 0.7, shade: 0, seed: seed + 'ear', lw: 2, raw: true });
        if (eyesClosed) E().stroke(g, [[134, -104], [146, -102]], 2.2, { raw: true });
        else {
            E().dot(g, 140, -104, 3.4);
            E().dot(g, 139, -105, 1, E().PAPER);
        }
        g.restore();
        g.restore();
        return out;
    }

    /** An arrow from tail to tip (local coords of g): shaft, iron head, two feathers. */
    function arrowAt(g, tail, tip, seed = 'arrow') {
        const a = Math.atan2(tip[1] - tail[1], tip[0] - tail[0]);
        E().stroke(g, [tail, tip], 3.2, { raw: true, taper: false });
        const hd = polar(tip, a, 10);
        E().form(g, [hd, polar(tip, a + 2.6, 8), polar(tip, a - 2.6, 8)], { tone: 0.9, shade: 0, lw: 1.4, seed: seed + 'h', raw: true });
        for (const side of [1, -1]) {
            const b0 = polar(tail, a, 4), b1 = polar(tail, a, 20);
            E().form(g, [b0, b1, polar(b1, a + side * 2.5, 10), polar(b0, a + side * 2.4, 11)], { tone: 0.3, shade: 0, lw: 1.3, seed: seed + 'f' + side, raw: true });
        }
    }

    /**
     * A bow from tip a to tip b (curved limbs bulging away from the string), its string to
     * `nock` when drawn, straight when not, or snapped (two curled ends) when `snapped`;
     * `fray` (0..1) thins the string where it is being chewed.
     */
    function bow(g, a, b, o = {}) {
        const { bend = 0.22, nock = null, snapped = 0, fray = 0, seed = 'bow' } = o;
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
        const ctrl = [mid[0] + nx * L * bend, mid[1] + ny * L * bend];
        const limb = Array.from({ length: 13 }, (_, i) => {
            const u = i / 12;
            return [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * ctrl[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * ctrl[1] + u * u * b[1]];
        });
        // the stave: thick at the grip, thin at the tips, a pale line along it
        E().stroke(g, limb, 9, { raw: true });
        E().stroke(g, limb, 3, { raw: true, color: '#b89b6a' });
        E().form(g, [polar(limb[6], 0, 7), polar(limb[6], Math.PI / 2, 7), polar(limb[6], Math.PI, 7), polar(limb[6], -Math.PI / 2, 7)], { tone: 0.8, shade: 0, lw: 1.5, seed: seed + 'grip', raw: true });
        // the string
        g.save();
        g.strokeStyle = Etch.INK;
        g.lineCap = 'round';
        if (snapped > 0) {
            // two curled ends recoiling toward the tips
            for (const [tip, dir] of [[a, 1], [b, -1]]) {
                const k = 1 - snapped * 0.6, end = [tip[0] + (mid[0] - tip[0]) * 0.45 * k, tip[1] + (mid[1] - tip[1]) * 0.45 * k];
                E().stroke(g, [tip, end, polar(end, Math.atan2(end[1] - tip[1], end[0] - tip[0]) + dir * 2, 10)], 1.8);
            }
        } else {
            const via = nock ?? mid;
            g.lineWidth = 1.8;
            g.beginPath();
            g.moveTo(a[0], a[1]);
            if (fray > 0 && !nock) {
                const fa = [via[0] - (b[0] - a[0]) * 0.04, via[1] - (b[1] - a[1]) * 0.04], fb = [via[0] + (b[0] - a[0]) * 0.04, via[1] + (b[1] - a[1]) * 0.04];
                g.lineTo(fa[0], fa[1]);
                g.stroke();
                g.lineWidth = 1.8 * (1 - fray * 0.8);
                g.beginPath();
                g.moveTo(fa[0], fa[1]);
                g.lineTo(fb[0], fb[1]);
                g.stroke();
                g.lineWidth = 1.8;
                g.beginPath();
                g.moveTo(fb[0], fb[1]);
                for (let i = 0; i < 4; i++) E().stroke(g, [via, polar(via, i * 1.6 + 0.4, 5 + fray * 6)], 1, { raw: true });
            } else g.lineTo(via[0], via[1]);
            g.lineTo(b[0], b[1]);
            g.stroke();
        }
        g.restore();
        return { grip: limb[6] };
    }

    /**
     * The hunter, H tall, standing on (x, y). o: facing, legs [[a1, a2], [a1, a2]] (far, near),
     * hands [far, near] targets in LOCAL coords (or null: hanging), lean (upper body), rot
     * (whole body about the feet, for the fall), lying, eyesClosed, bowAim (draw the bow
     * between his hands), quiver. Returns { hands (world), nock (world) }.
     */
    function hunter(g, x, y, H, o = {}) {
        const world = framer(g);
        const { facing = 1, legs = [[Math.PI / 2 + 0.08, Math.PI / 2], [Math.PI / 2 - 0.08, Math.PI / 2]], hands = null, lean = 0, rot = 0, lying = false, eyesClosed = false, bowAim = 0, mouthOpen = 0, seed = 'hunter' } = o;
        const k = H / 300;
        g.save();
        g.translate(x, y);
        g.scale(facing * k, k);
        let r = rot;
        if (lying) r = -Math.PI / 2 + 0.06;
        if (r) {
            g.rotate(r);
            if (lying) g.translate(-28, 0);
        }
        const hip = [0, -140], up = (p) => rotP(p, lean, hip);
        const out = {};
        // far leg, far arm, quiver behind
        const legL = 72;
        const footF = leg(g, [-8, -140], legs[0][0], legL, legs[0][1], legL, 22, 0.55, seed + 'lf', 1.2);
        const shF = up([-12, -230]), shN = up([12, -230]);
        const handTargets = hands ?? [up([-26, -125]), up([26, -125])];
        const [eF, hF] = ik(shF, handTargets[0], 58, 56, 1);
        E().limb(g, shF, eF, 20, 15, { tone: 0.35, shade: 0.5, lw: 1.8, seed: seed + 'af1' });
        E().limb(g, eF, hF, 15, 11, { tone: 0.12, shade: 0.3, lw: 1.6, seed: seed + 'af2' });
        E().form(g, Array.from({ length: 8 }, (_, i) => polar(hF, (i / 8) * Math.PI * 2, 8)), { tone: 0.12, shade: 0, lw: 1.6, seed: seed + 'hf', raw: true });
        const q0 = up([-34, -238]), q1 = up([-22, -158]);
        E().limb(g, q0, q1, 22, 18, { tone: 0.65, shade: 0.4, lw: 2, seed: seed + 'quiver' });
        for (let i = 0; i < 3; i++) arrowAt(g, up([-30 + i * 5, -222]), up([-44 + i * 6, -262 + i * 3]), seed + 'q' + i);
        // tunic over the body, belt
        E().form(g, [up([-32, -244]), up([30, -244]), up([38, -160]), [46, -104], [-42, -104], up([-36, -160])], { tone: 0.3, shade: 0.65, angle: -0.9, seed: seed + 'tunic', lw: 2.4 });
        E().form(g, [up([-36, -164]), up([38, -164]), up([38, -152]), up([-36, -152])], { tone: 0.85, shade: 0, seed: seed + 'belt', lw: 1.6, raw: true });
        // near leg
        const footN = leg(g, [8, -140], legs[1][0], legL, legs[1][1], legL, 24, 0.45, seed + 'ln', 1.2);
        // head: face, beard, turban
        const hc = up([8, -272]);
        E().form(g, [polar(hc, -2.3, 26), polar(hc, -1.2, 27), [hc[0] + 26, hc[1] - 4], [hc[0] + 31, hc[1] + 6], [hc[0] + 24, hc[1] + 12], polar(hc, 0.9, 27), polar(hc, 2, 26), polar(hc, 3, 26)], { tone: 0.1, shade: 0.4, angle: -0.6, seed: seed + 'face', lw: 2 });
        E().form(g, [[hc[0] - 22, hc[1] + 4], [hc[0] + 24, hc[1] + 10], [hc[0] + 18, hc[1] + 30], [hc[0] - 4, hc[1] + 38], [hc[0] - 22, hc[1] + 22]], { tone: 0.8, shade: 0.3, seed: seed + 'beard', lw: 1.8 });
        if (mouthOpen > 0.1) E().form(g, [[hc[0] + 10, hc[1] + 14], [hc[0] + 20, hc[1] + 14], [hc[0] + 18, hc[1] + 14 + mouthOpen * 10], [hc[0] + 11, hc[1] + 14 + mouthOpen * 10]], { tone: 1, shade: 0, lw: 1.2, seed: seed + 'mo', raw: true });
        E().form(g, [[hc[0] - 30, hc[1] - 6], [hc[0] - 26, hc[1] - 30], [hc[0], hc[1] - 40], [hc[0] + 24, hc[1] - 30], [hc[0] + 28, hc[1] - 10], [hc[0], hc[1] - 16]], { tone: 0.5, shade: 0.5, angle: 0.3, seed: seed + 'turban', lw: 2 });
        for (let i = 0; i < 3; i++) E().stroke(g, [[hc[0] - 26, hc[1] - 12 - i * 9], [hc[0] + 24, hc[1] - 18 - i * 8]], 1.6, { raw: true });
        if (eyesClosed) E().stroke(g, [[hc[0] + 8, hc[1] - 4], [hc[0] + 16, hc[1] - 3]], 2, { raw: true });
        else E().dot(g, hc[0] + 13, hc[1] - 4, 3);
        // near arm
        const [eN, hN] = ik(shN, handTargets[1], 58, 56, bowAim ? 1 : -1);
        E().limb(g, shN, eN, 21, 16, { tone: 0.3, shade: 0.5, lw: 1.9, seed: seed + 'an1' });
        E().limb(g, eN, hN, 16, 12, { tone: 0.12, shade: 0.3, lw: 1.7, seed: seed + 'an2' });
        E().form(g, Array.from({ length: 8 }, (_, i) => polar(hN, (i / 8) * Math.PI * 2, 9)), { tone: 0.12, shade: 0, lw: 1.6, seed: seed + 'hn', raw: true });
        out.hands = [world(hF), world(hN)];
        out.handsLocal = [hF, hN];
        out.head = world(hc);
        g.restore();
        return out;
    }

    return { jackal, boar, hunter, bow, arrowAt, ik, rotP, polar };
})();
