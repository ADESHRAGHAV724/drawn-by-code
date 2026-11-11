// tendua-aur-ghoda · the animals in sumi-e: a horse (and his mare) and a leopard, each a few
// brush strokes — a loaded stroke for the body mass, tapered strokes for neck, legs and
// tail, dry flicks for mane and fur, dabs for hooves, eyes and the leopard's rosettes.
// Global: Beasts. Depends on Sumi. All shapes are seeded; poses come from the scene.
const Beasts = (() => {
    const S = () => Sumi;
    const TAU = Math.PI * 2;
    const rot = ([x, y], a, [cx, cy] = [0, 0]) => {
        const c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy;
        return [cx + dx * c - dy * s, cy + dx * s + dy * c];
    };

    // a leg as two tapered strokes (upper and lower), a dab for the hoof or paw
    function leg(g, top, a1, l1, a2, l2, w, ink, seed, foot) {
        const knee = [top[0] + Math.cos(a1) * l1, top[1] + Math.sin(a1) * l1];
        const end = [knee[0] + Math.cos(a2) * l2, knee[1] + Math.sin(a2) * l2];
        S().stroke(g, [top, knee], { w: w * 1.5, ink, dry: 0.3, seed: seed + 'u', taper: [0, 0.1], blunt: 1, press: (u) => 1 - 0.5 * u });
        S().dab(g, knee[0], knee[1], w * 0.38, w * 0.4, { seed: seed + 'k', ink });
        S().stroke(g, [knee, end], { w: w * 0.55, ink, dry: 0.35, seed: seed + 'l', taper: [0, 0.1], blunt: 1, press: (u) => 1 - 0.25 * u });
        if (foot) S().dab(g, end[0] + foot[0], end[1] - foot[1] * 0.5, foot[0] ? Math.abs(foot[0]) + w * 0.35 : w * 0.45, w * 0.32, { seed: seed + 'f', ink: Math.min(1, ink + 0.25) });
        return end;
    }

    /**
     * A horse standing on the ground at (x, y), s scale (1 ≈ 300 units long), facing ±1.
     * o: ph (walk phase, 0 = standing), head (rad, + = lowered), rear (0..1, up on the hind
     * legs in fright), ears (0..1 laid back), jaw (0..1 open), ink (0..1, the mare is paler),
     * mane (length), tremble, seed. Returns { head, muzzle }.
     */
    function horse(g, x, y, s, o = {}) {
        const { facing = 1, ph = 0, walking = false, head = 0, rear = 0, ears = 0, jaw = 0, ink = 0.8, mane = 1, tremble = 0, seed = 'horse' } = o;
        g.save();
        g.translate(x, y);
        if (facing < 0) g.scale(-1, 1);
        g.scale(s, s);
        if (tremble) g.translate(Math.sin(ph * 97) * tremble, 0);
        // rearing pivots on the hind hooves
        if (rear) {
            g.translate(-90, 0);
            g.rotate(-rear * 0.32);
            g.translate(90, 0);
        }
        const sw = (off) => (walking ? Math.sin(ph * TAU + off) * 0.38 : 0);
        // far legs first, paler
        leg(g, [70, -118], Math.PI / 2 - sw(Math.PI), 62, Math.PI / 2 - sw(Math.PI) * 0.4 + (walking ? 0.25 * Math.max(0, Math.cos(ph * TAU + Math.PI)) : 0), 62, 16, ink * 0.55, seed + 'lf2', [6, 6]);
        leg(g, [-92, -118], Math.PI / 2 - sw(0) + rear * 0.3, 60, Math.PI / 2 + 0.15 - sw(0) * 0.5 + rear * 0.3, 66, 18, ink * 0.55, seed + 'lh2', [6, 6]);
        // tail: dry strokes sweeping down and back
        for (let i = 0; i < 4; i++) {
            const sway = Math.sin(ph * TAU * 0.5 + i) * 16;
            S().stroke(g, [[-118, -140], [-142 - i * 4, -110 + i * 3], [-150 - i * 6 + sway, -60 + i * 6], [-146 - i * 8 + sway * 1.4, -24 + i * 8]], { w: 13 - i * 2, ink: ink * 0.95, dry: 0.85, seed: seed + 'tail' + i, taper: [0.05, 0.6], core: i < 2 });
        }
        // body: one loaded stroke from rump to chest, a darker belly line
        S().stroke(g, [[-124, -124], [-104, -156], [-50, -166], [20, -162], [78, -152], [100, -124]], { w: 72, ink: ink * 0.6, dry: 0.4, seed: seed + 'body', taper: [0.18, 0.22], blunt: 0.7, press: (u) => 0.85 + 0.3 * Math.sin(u * Math.PI) });
        S().dab(g, -92, -132, 40, 38, { seed: seed + 'haunch', ink: ink * 0.45, rough: 0.1 });
        S().dab(g, 70, -128, 30, 34, { seed: seed + 'chest', ink: ink * 0.45, rough: 0.1 });
        S().stroke(g, [[-96, -104], [-20, -96], [62, -108]], { w: 14, ink, dry: 0.6, seed: seed + 'belly', taper: [0.2, 0.4] });
        S().stroke(g, [[-120, -150], [-60, -170], [20, -168]], { w: 10, ink, dry: 0.7, seed: seed + 'back', taper: [0.1, 0.6] });
        // neck and head
        const poll = rot([128, -246], head * 0.6, [86, -152]);
        S().stroke(g, [[72, -150], [104, -200], poll], { w: 52, ink: ink * 0.7, dry: 0.35, seed: seed + 'neck', taper: [0.05, 0.35], blunt: 1 });
        const ha = 0.62 + head;
        const muzzle = [poll[0] + Math.cos(ha) * 72, poll[1] + Math.sin(ha) * 72];
        S().stroke(g, [poll, muzzle], { w: 30, ink: ink * 0.82, dry: 0.3, seed: seed + 'head', taper: [0, 0.15], blunt: 1 });
        S().dab(g, muzzle[0] - 2, muzzle[1] + 2, 15, 12, { seed: seed + 'muz', ink: Math.min(1, ink + 0.15), rot: ha });
        if (jaw > 0.05) {
            const ja = ha + 0.25 + jaw * 0.35;
            S().stroke(g, [[poll[0] + Math.cos(ha) * 40, poll[1] + Math.sin(ha) * 40 + 8], [poll[0] + Math.cos(ja) * 70, poll[1] + Math.sin(ja) * 70 + 10]], { w: 9, ink, dry: 0.3, seed: seed + 'jaw', taper: [0, 0.3] });
        }
        S().dab(g, poll[0] + Math.cos(ha) * 22 + 4, poll[1] + Math.sin(ha) * 22 - 6, 4, 3.5, { seed: seed + 'eye', ink: 1 });
        const ea = -1.9 - ears * 0.9;
        S().stroke(g, [poll, [poll[0] + Math.cos(ea) * 28, poll[1] + Math.sin(ea) * 28]], { w: 10, ink, dry: 0.3, seed: seed + 'ear', taper: [0, 0.6], blunt: 1 });
        // mane: dry flicks along the crest
        for (let i = 0; i < 6; i++) {
            const u = i / 5, p = [72 + (poll[0] - 72) * u, -150 + (poll[1] + 150) * u - 18];
            const fl = Math.sin(ph * TAU + i) * 4;
            S().stroke(g, [p, [p[0] - 16 * mane + fl, p[1] + 26 * mane]], { w: 9, ink, dry: 0.9, seed: seed + 'mane' + i, taper: [0.05, 0.7], core: false });
        }
        // near legs
        leg(g, [62, -118], Math.PI / 2 + sw(Math.PI) * 0.9 - rear * 0.9, 62, Math.PI / 2 + sw(Math.PI) * 0.35 + (walking ? 0.3 * Math.max(0, Math.sin(ph * TAU)) : 0) - rear * 1.6, 62, 20, ink * 0.95, seed + 'lf1', [7, 7]);
        leg(g, [-86, -118], Math.PI / 2 + sw(0) + rear * 0.3, 60, Math.PI / 2 + 0.15 + sw(0) * 0.5 + rear * 0.3, 66, 22, ink * 0.95, seed + 'lh1', [7, 7]);
        g.restore();
        const toW = ([px, py]) => [x + facing * px * s, y + py * s];
        return { head: toW(poll), muzzle: toW(muzzle) };
    }

    /**
     * A leopard on the ground at (x, y), s scale, facing ±1. o: ph (gait phase), gait
     * ('stand' | 'prowl' | 'sit' | 'bound' | 'flee'), crouch (0..1), jaw, lick (0..1),
     * greedy (red eyes, 0..1), lash (tail), hop (lift), seed.
     */
    function leopard(g, x, y, s, o = {}) {
        const { facing = 1, ph = 0, gait = 'stand', crouch = 0, jaw = 0, lick = 0, greedy = 0, hop = 0, tilt = 0, seed = 'leo' } = o;
        const ink = 0.5;
        g.save();
        g.translate(x, y - hop);
        if (facing < 0) g.scale(-1, 1);
        g.scale(s, s);
        const sit = gait === 'sit';
        const run = gait === 'bound' || gait === 'flee';
        const stretch = gait === 'flee' ? 1.25 : 1;
        if (tilt) g.rotate(tilt);
        const by = -84 + crouch * 26; // the back's height
        const sw = (off, amp = 0.45) => (gait === 'stand' || sit ? 0 : Math.sin(ph * TAU + off) * amp * (run ? 1.6 : 1));
        // far legs
        if (sit) {
            leg(g, [-60, by + 26], Math.PI / 2 + 0.9, 40, Math.PI, 30, 14, ink * 0.55, seed + 'lh2', [8, 4]);
        } else {
            leg(g, [-70 * stretch, by + 20], Math.PI / 2 + sw(0) - crouch * 0.4, 42, Math.PI / 2 + 0.2 + sw(0) * 0.4 + crouch * 0.7, 42 - crouch * 8, 14, ink * 0.55, seed + 'lh2', [8, 4]);
        }
        leg(g, [62 * stretch, by + 20], Math.PI / 2 + sw(Math.PI) + crouch * 0.4, 40, Math.PI / 2 - 0.05 - sw(Math.PI) * 0.3 - crouch * 0.5, 40 - crouch * 8, 13, ink * 0.55, seed + 'lf2', [8, 4]);
        // tail: one long curling stroke, a dark tip
        const lash = Math.sin(ph * TAU * 0.7) * (o.lash ?? 0.3);
        const tail = [[-90 * stretch, by + 6], [-130 * stretch, by + 10 + lash * 20], [-168 * stretch, by - 6 + lash * 40], [-186 * stretch, by - 40 + lash * 50]];
        if (sit) tail.splice(1, 3, [-100, -10], [-40, -6 + lash * 6], [10 + lash * 10, -12 - Math.abs(lash) * 24]);
        S().stroke(g, tail, { w: 13, ink: ink * 0.85, dry: 0.4, seed: seed + 'tail', taper: [0.05, 0.25] });
        S().dab(g, tail[tail.length - 1][0], tail[tail.length - 1][1], 8, 6, { seed: seed + 'tip', ink: 1 });
        // body: low and long (upright when sitting)
        const body = sit ? [[-62, -26], [-50, -66], [-10, -98], [30, -112]] : [[-98 * stretch, by + 12], [-62 * stretch, by - 2], [-10, by + 6], [44 * stretch, by - 10], [86 * stretch, by + 6]];
        S().stroke(g, body, { w: 50, ink: ink * 0.6, dry: 0.35, seed: seed + 'body' + (sit ? 's' : ''), taper: [0.15, 0.2], blunt: 0.85 });
        S().stroke(g, sit ? [[-50, -20], [-20, -50], [10, -84]] : [[-80 * stretch, by + 30], [0, by + 34], [70 * stretch, by + 30]], { w: 10, ink: ink * 0.8, dry: 0.6, seed: seed + 'belly' + (sit ? 's' : ''), taper: [0.2, 0.4] });
        // rosettes: clusters of three or four small dabs along the body
        const r = Motion.rng(seed + 'spots');
        for (let i = 0; i < 18; i++) {
            const u = r(), v = r() - 0.5;
            const p = sit ? [Ease.lerp(-55, 25, u) + v * 30, Ease.lerp(-30, -104, u) + v * 10] : [Ease.lerp(-86, 72, u) * stretch, by + 4 + v * 32];
            const k = 3 + Math.floor(r() * 2), rr = 6 + r() * 3, a0 = r() * TAU;
            for (let j = 0; j < k; j++) {
                const a = a0 + (j / (k + 1)) * TAU; // an open ring: a gap where the last dab would be
                S().dab(g, p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr, 3.4, 2.4, { seed: seed + 'sp' + i + j, ink: 0.95, rot: a + Math.PI / 2 });
            }
        }
        // head
        const hd = sit ? [48, -132] : [100 * stretch, by - 16 + crouch * 10];
        S().dab(g, hd[0] - 4, hd[1], 27, 23, { seed: seed + 'head', ink: ink * 0.62, rough: 0.1 });
        S().dab(g, hd[0] + 20, hd[1] + 8, 15, 12, { seed: seed + 'muzzle', ink: ink * 0.5, rough: 0.1 });
        for (const ex of [-22, -6]) S().dab(g, hd[0] + ex, hd[1] - 22, 7, 6, { seed: seed + 'ear' + ex, ink: 0.9 });
        for (const [sx, sy] of [[-18, -8], [-10, -14], [-20, 6], [-4, -12]]) S().dab(g, hd[0] + sx, hd[1] + sy, 2.2, 2, { seed: seed + 'hs' + sx + sy, ink: 0.95 });
        S().stroke(g, [[hd[0] + 4, hd[1] - 2], [hd[0] + 12, hd[1] + 14]], { w: 2.5, ink: 0.9, dry: 0.3, seed: seed + 'tear', taper: [0, 0.5], core: false });
        // eyes: vermilion when greedy
        for (const ex of [6, 20]) {
            const red = greedy > 0.5;
            S().dab(g, hd[0] + ex, hd[1] - 6, red ? 4.5 + greedy * 1.5 : 3.6, red ? 3.2 + greedy : 2.6, { seed: seed + 'eye' + ex, ink: 1, color: red ? S().RED : undefined });
            S().dab(g, hd[0] + ex + 1, hd[1] - 6, 1.4, 1.6, { seed: seed + 'pupil' + ex, ink: 1 });
        }
        S().dab(g, hd[0] + 28, hd[1] + 4, 5, 4, { seed: seed + 'nose', ink: 1 });
        // mouth: a line, open with the voice, a tongue licking the lips
        const mo = Math.max(jaw, 0);
        S().stroke(g, [[hd[0] + 26, hd[1] + 10], [hd[0] + 16, hd[1] + 14 + mo * 10], [hd[0] + 6, hd[1] + 12]], { w: 3.5, ink: 1, dry: 0.2, seed: seed + 'mouth', taper: [0.2, 0.3], core: false });
        if (mo > 0.15) S().dab(g, hd[0] + 16, hd[1] + 16 + mo * 4, 8, 3 + mo * 6, { seed: seed + 'open', ink: 0.85 });
        if (lick > 0) S().dab(g, hd[0] + 22 + lick * 6, hd[1] + 14, 5, 3.5, { seed: seed + 'tongue', ink: 0.6 });
        for (const [dy, a] of [[2, -0.15], [8, 0.05], [14, 0.25]]) S().stroke(g, [[hd[0] + 22, hd[1] + dy], [hd[0] + 52, hd[1] + dy + a * 30]], { w: 1.4, ink: 0.85, dry: 0.4, seed: seed + 'wh' + dy, taper: [0, 0.6], core: false });
        // near legs
        if (sit) {
            leg(g, [-46, -40], Math.PI / 2 + 0.6, 38, Math.PI, 30, 16, ink * 0.95, seed + 'lh1', [9, 4]);
            leg(g, [30, -86], Math.PI / 2 - 0.05, 46, Math.PI / 2, 40, 15, ink * 0.95, seed + 'lf1', [9, 4]);
        } else {
            leg(g, [-64 * stretch, by + 22], Math.PI / 2 - sw(Math.PI * 0.5) - crouch * 0.4, 42, Math.PI / 2 + 0.2 - sw(Math.PI * 0.5) * 0.4 + crouch * 0.7, 42 - crouch * 8, 19, ink * 0.95, seed + 'lh1', [11, 5]);
            leg(g, [70 * stretch, by + 22], Math.PI / 2 - sw(Math.PI * 1.5) + crouch * 0.4, 40, Math.PI / 2 - 0.05 + sw(Math.PI * 1.5) * 0.3 - crouch * 0.5, 40 - crouch * 8, 18, ink * 0.95, seed + 'lf1', [11, 5]);
        }
        g.restore();
        return { head: [x + facing * hd[0] * s, y - hop + hd[1] * s] };
    }

    /** An ensō: the Zen circle in one stroke, open at the bottom; prog draws it on. */
    function enso(g, cx, cy, r, prog, seed = 'enso') {
        const pts = Array.from({ length: 49 }, (_, i) => {
            const a = Math.PI * 0.62 + (i / 48) * TAU * 0.9;
            return [cx + Math.cos(a) * r * (1 + 0.03 * Math.sin(a * 3)), cy + Math.sin(a) * r];
        });
        S().stroke(g, pts, { w: r * 0.13, ink: 0.85, dry: 0.55, seed, taper: [0.05, 0.4], blunt: 1, prog });
    }

    /**
     * The stable: two posts, a plank wall in dry strokes, a dark doorway, a roof with
     * up-swept eaves, hay at the foot. (x = the middle, y = the ground, w = width.)
     */
    function stable(g, env, x, y, w) {
        const h = w * 0.62, S_ = S();
        S_.wash('stable-door' + x, { x: x - w * 0.2, y: y - h * 0.86, w: w * 0.4, h: h * 0.9 }, env.k, (c) => c.rect(x - w * 0.16, y - h * 0.8, w * 0.32, h * 0.8), { ink: 0.75, blur: 2 }).draw(g);
        for (let i = 0; i < 7; i++) {
            const yy = y - h * 0.08 - i * h * 0.12;
            S_.stroke(g, [[x - w * 0.46, yy], [x - w * 0.17, yy + 2]], { w: 9, ink: 0.6, dry: 0.75, seed: 'pl' + x + i, taper: [0.05, 0.3], core: false });
            S_.stroke(g, [[x + w * 0.17, yy + 1], [x + w * 0.46, yy - 1]], { w: 9, ink: 0.6, dry: 0.75, seed: 'pr' + x + i, taper: [0.05, 0.3], core: false });
        }
        for (const px of [-0.47, -0.17, 0.17, 0.47]) S_.stroke(g, [[x + px * w, y], [x + px * w, y - h * 0.86]], { w: 14, ink: 0.9, dry: 0.4, seed: 'post' + x + px, taper: [0, 0.1], blunt: 1 });
        S_.roof(g, x, y - h * 0.86, w * 0.58, h * 0.3, { ink: 0.8, lift: 0.35, seed: 'stableRoof' + x });
        const r = Motion.rng('hay' + x);
        for (let i = 0; i < 14; i++) {
            const hx = x + w * 0.5 + r() * w * 0.18, hy = y - r() * 30;
            S_.stroke(g, [[hx, y], [hx + (r() - 0.5) * 30, hy - 20]], { w: 4, ink: 0.55, dry: 0.7, seed: 'hay' + x + i, taper: [0, 0.6], core: false });
        }
    }

    return { horse, leopard, enso, stable };
})();
