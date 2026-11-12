// planaria · 15 s DEMO (no voice yet) in the «field notebook» look: six shots — the head is
// cut and grows back, a day counter, the microscope with the neoblasts, three pieces become
// three worms, «age limit? none», follow. Hard cuts with a short punch-in, a slow push on
// every shot, sound effects only.
// planaria · the full Short (~60 s) on the user's ElevenLabs voice (the short script), in the
// «field notebook» look with under-water shots. Objects tell the story; text only where a
// picture can't carry it (the hook, the name, 1/279, «age limit? none», «not immortal»).
// Voice lines (film time, after 0.4 s of air) are in brief.md.
const SH = [
    [0, 2.1, 'hook'],
    [2.1, 6.3, 'regrow'],
    [6.3, 9.4, 'intro'],
    [9.4, 12.0, 'size'],
    [12.0, 14.3, 'scope'],
    [14.3, 17.6, 'stem'],
    [17.6, 21.7, 'pieces'],
    [21.7, 24.3, 'tiny'],
    [24.3, 28.7, 'twohead'],
    [28.7, 31.8, 'wound'],
    [31.8, 34.6, 'grind'],
    [34.6, 35.9, 'geiger'],
    [35.9, 39.9, 'rescue'],
    [39.9, 44.3, 'age'],
    [44.3, 47.2, 'never'],
    [47.2, 50.6, 'younger'],
    [50.6, 56.0, 'mortal'],
    [56.0, 59.6, 'subscribe'],
];

// [header label, small line at, small line, big line at, big line] (null: no caption)
const HEAD = {
    hook: ['The hook', 0.1, 'CUT OFF ITS HEAD', 1.25, 'IT GROWS BACK'],
    regrow: ['Regeneration', 0, null, 0, null],
    intro: ['Meet', 0.25, 'MEET THE', 0.75, 'PLANARIAN'],
    size: ['Size', 0, null, 0, null],
    scope: ['Microscope', 0, null, 0, null],
    stem: ['Stem cells', 0, null, 0, null],
    pieces: ['Cut it up', 0, null, 0, null],
    tiny: ['Cut it up', 0.25, 'EVEN A', 0.6, '1/279 PIECE'],
    twohead: ['Split head', 0, null, 0, null],
    wound: ['Injury', 0, null, 0, null],
    grind: ['Ground up', 0, null, 0, null],
    geiger: ['Radiation', 0, null, 0, null],
    rescue: ['Rescue', 0, null, 0, null],
    age: ['Lifespan', 0.1, 'AGE LIMIT?', 1.2, 'NONE'],
    never: ['Regrowth', 0, null, 0, null],
    younger: ['Regrowth', 0, null, 0, null],
    mortal: ['But', 0.1, 'BUT NOT', 0.4, 'IMMORTAL'],
    subscribe: ['Next', 0, null, 0, null],
};

// a new head growing out of a cut: the head range of a worm scaled by `gr`, its neck on the
// cut at spine point `p` (heading p[2]); new tissue is white and darkens with `pale`
function bud(g, env, p, len, gr, pale) {
    if (gr <= 0.02) return;
    const L2 = len * gr, a = p[2];
    const hx = p[0] + Math.cos(a) * 0.17 * L2, hy = p[1] + Math.sin(a) * 0.17 * L2;
    const pts = Plan.spine(hx, hy, a, L2, 0, 0);
    Plan.draw(g, env, 0, 0, 0, L2, { pts, s0: 0, s1: 0.175, pale, shadow: false });
}

// a hand-written label with a thin line to what it names; appears at `a`
function handLabel(g, u, a, text, to, at, color) {
    if (u < a) return;
    const k = Ease.seg(u, a, a + 0.25);
    g.save();
    g.globalAlpha *= k;
    g.strokeStyle = color;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(at[0], at[1] + (at[1] < to[1] ? 10 : -40));
    g.lineTo(at[0] + (to[0] - at[0]) * k, at[1] + (at[1] < to[1] ? 10 : -40) + (to[1] - at[1] - (at[1] < to[1] ? 10 : -40)) * k);
    g.stroke();
    g.font = '52px "Patrick Hand"';
    g.fillStyle = color;
    g.textAlign = 'center';
    g.fillText(text, at[0], at[1]);
    g.restore();
}

// a neoblast: a thin cell around a big nucleus (radius R), cached
function stemCell(g, env, R) {
    Motion.sprite('stemcell:' + R, { x: -R - 10, y: -R - 10, w: 2 * R + 20, h: 2 * R + 20 }, env.k * 1.5, (c) => {
        const r = Motion.rng('stem');
        const m = c.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.1, 0, 0, R);
        m.addColorStop(0, 'rgba(250,215,205,0.95)');
        m.addColorStop(0.8, 'rgba(232,170,160,0.9)');
        m.addColorStop(1, 'rgba(200,120,110,0.95)');
        c.fillStyle = m;
        c.beginPath();
        for (let i = 0; i <= 60; i++) {
            const a = (i / 60) * Math.PI * 2, rr = R * (1 + 0.025 * Math.sin(a * 5) + 0.02 * Math.sin(a * 3 + 1));
            c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr);
        }
        c.closePath();
        c.fill();
        c.strokeStyle = 'rgba(150,60,55,0.7)';
        c.lineWidth = 4;
        c.stroke();
        c.strokeStyle = 'rgba(255,240,235,0.6)';
        c.lineWidth = 2;
        c.beginPath();
        c.arc(0, 0, R - 7, Math.PI * 1.1, Math.PI * 1.6);
        c.stroke();
        for (let i = 0; i < 90; i++) {
            const a = r() * Math.PI * 2, d = R * (0.78 + r() * 0.16);
            c.fillStyle = 'rgba(160,70,70,0.45)';
            c.beginPath();
            c.arc(Math.cos(a) * d, Math.sin(a) * d, 1.5 + r() * 2.5, 0, Math.PI * 2);
            c.fill();
        }
        // the big nucleus, chromatin, a nucleolus
        const n = c.createRadialGradient(-R * 0.2, -R * 0.25, 4, 0, 0, R * 0.74);
        n.addColorStop(0, '#9a7cc4');
        n.addColorStop(1, '#4e3a7e');
        c.fillStyle = n;
        c.beginPath();
        c.ellipse(4, 2, R * 0.72, R * 0.66, 0.2, 0, Math.PI * 2);
        c.fill();
        for (let i = 0; i < 160; i++) {
            const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * 0.62;
            c.fillStyle = r() < 0.5 ? 'rgba(40,25,70,0.4)' : 'rgba(200,180,240,0.3)';
            c.beginPath();
            c.arc(Math.cos(a) * d, Math.sin(a) * d, 1.5 + r() * 3, 0, Math.PI * 2);
            c.fill();
        }
        c.fillStyle = '#2e1f55';
        c.beginPath();
        c.arc(R * 0.18, -R * 0.1, R * 0.14, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = 'rgba(255,255,255,0.35)';
        c.beginPath();
        c.ellipse(-R * 0.3, -R * 0.32, R * 0.18, R * 0.08, -0.6, 0, Math.PI * 2);
        c.fill();
    }).draw(g);
}

// small drawings in the badges: what a neoblast can become
function organ(g, env, kind, u) {
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    if (kind === 'eye') {
        g.fillStyle = '#f5ecdc';
        g.strokeStyle = 'rgba(80,60,40,0.6)';
        g.lineWidth = 2;
        g.beginPath();
        g.ellipse(0, 0, 58, 40, 0, 0, Math.PI * 2);
        g.fill();
        g.stroke();
        g.fillStyle = '#16100c';
        g.beginPath();
        g.arc(-6, 0, 30, Math.PI * 0.35, Math.PI * 1.65);
        g.quadraticCurveTo(14, 0, -6 + Math.cos(Math.PI * 0.35) * 30, Math.sin(Math.PI * 0.35) * 30);
        g.fill();
        g.strokeStyle = 'rgba(176,48,30,0.8)';
        g.lineWidth = 3;
        for (let i = -2; i <= 2; i++) {
            g.beginPath();
            g.moveTo(10, i * 10);
            g.lineTo(44, i * 14);
            g.stroke();
        }
    } else if (kind === 'brain') {
        g.fillStyle = '#f2e6cf';
        g.strokeStyle = 'rgba(120,80,50,0.8)';
        g.lineWidth = 3;
        for (const sg of [-1, 1]) {
            g.beginPath();
            g.ellipse(sg * 22, -18, 26, 34, sg * 0.3, 0, Math.PI * 2);
            g.fill();
            g.stroke();
            g.beginPath();
            g.moveTo(sg * 18, 12);
            g.quadraticCurveTo(sg * 30, 40, sg * 22, 70);
            g.stroke();
        }
        g.beginPath();
        g.moveTo(-14, -12);
        g.lineTo(14, -12);
        g.stroke();
    } else if (kind === 'gut') {
        g.strokeStyle = '#6f7a3a';
        g.lineWidth = 9;
        g.beginPath();
        g.moveTo(0, -60);
        g.lineTo(0, 0);
        g.moveTo(0, 0);
        g.quadraticCurveTo(-30, 30, -24, 62);
        g.moveTo(0, 0);
        g.quadraticCurveTo(30, 30, 24, 62);
        for (let i = 0; i < 4; i++) {
            const y = -50 + i * 16;
            g.moveTo(0, y);
            g.lineTo(-26, y - 6);
            g.moveTo(0, y);
            g.lineTo(26, y - 6);
        }
        for (let i = 0; i < 3; i++) {
            const y = 20 + i * 16;
            g.moveTo(-14 - i * 4, y);
            g.lineTo(-44, y - 4);
            g.moveTo(14 + i * 4, y);
            g.lineTo(44, y - 4);
        }
        g.stroke();
    } else {
        for (let i = -1; i <= 1; i++) {
            g.save();
            g.translate(i * 26, 0);
            g.rotate(0.12 * i);
            const gr = g.createLinearGradient(-12, 0, 12, 0);
            gr.addColorStop(0, '#e48b80');
            gr.addColorStop(0.5, '#c9493c');
            gr.addColorStop(1, '#8e2a22');
            g.fillStyle = gr;
            g.beginPath();
            g.ellipse(0, 0, 13, 62, 0, 0, Math.PI * 2);
            g.fill();
            g.strokeStyle = 'rgba(255,220,210,0.55)';
            g.lineWidth = 1.5;
            for (let y = -50; y <= 50; y += 9) {
                g.beginPath();
                g.moveTo(-10, y);
                g.lineTo(10, y);
                g.stroke();
            }
            g.restore();
        }
    }
    g.restore();
}

const SHOTS = {
    // the worm glides; a red line marks the neck, snip, the head slides away
    hook(g, env, u) {
        const len = 560, hx = 640 + u * 18, hy = 980;
        const pts = Plan.spine(hx, hy, -0.12, len, u * 1.5, 0.12);
        const cut = Ease.out(Ease.seg(u, 1.1, 1.6));
        if (u < 1.1) Plan.draw(g, env, 0, 0, 0, len, { pts, t: u });
        else {
            const head = pts.map(([x, y, a]) => [x + cut * 70, y - cut * 40, a - cut * 0.25]);
            const body = pts.map(([x, y, a]) => [x - cut * 20, y + cut * 10, a]);
            Plan.draw(g, env, 0, 0, 0, len, { pts: body, s0: 0.16, s1: 1, headless: true });
            Plan.draw(g, env, 0, 0, 0, len, { pts: head, s0: 0, s1: 0.16 });
        }
        // the dashed red cut line across the neck
        const p = Plan.at(pts, 0.16), nx = -Math.sin(p[2]), ny = Math.cos(p[2]);
        const d = 120, k = Ease.out(Ease.seg(u, 0.4, 0.85)) * (1 - Ease.seg(u, 1.4, 1.8));
        if (k > 0) {
            g.save();
            g.strokeStyle = Note.RED;
            g.lineWidth = 5;
            g.setLineDash([16, 10]);
            g.lineCap = 'round';
            g.beginPath();
            g.moveTo(p[0] - nx * d, p[1] - ny * d);
            g.lineTo(p[0] - nx * d + nx * 2 * d * k, p[1] - ny * d + ny * 2 * d * k);
            g.stroke();
            g.restore();
        }
    },

    // the headless body grows a new head: white new tissue that darkens; a day counter
    regrow(g, env, u) {
        const len = 600, gr = Ease.inOut(Ease.seg(u, 0.3, 2.3));
        const pts = Plan.spine(760, 860, 0, len, u, 0.06);
        Plan.draw(g, env, 0, 0, 0, len, { pts, t: u, s0: 0.16, s1: 1, headless: true });
        bud(g, env, Plan.at(pts, 0.16), len, gr, 1 - Ease.seg(u, 2.4, 3.6));
        // hand-written labels on the new head, on the words «new brain», «new eyes»
        const H = Plan.at(pts, 0);
        handLabel(g, u, 1.9, 'brain', [H[0] - 60, H[1] + 4], [H[0] - 160, H[1] + 150], Note.CREAM);
        handLabel(g, u, 2.8, 'eyes', [H[0] - 40, H[1] - 20], [H[0] - 130, H[1] - 150], Note.CREAM);
        // the counter: DAY n in a dark box with a flap line
        const day = Math.min(7, 1 + Math.floor(Ease.seg(u, 0.3, 2.3) * 6.999));
        g.save();
        g.translate(450, 1240);
        Note.shadow(g, env, 0, 18, 170, 70, 0.6);
        g.fillStyle = '#2a1d12';
        g.fillRect(-150, -80, 300, 160);
        g.fillStyle = 'rgba(255,240,210,0.08)';
        g.fillRect(-150, -80, 300, 80);
        g.fillStyle = 'rgba(0,0,0,0.6)';
        g.fillRect(-150, -1, 300, 2);
        g.font = '22px "Space Mono"';
        g.fillStyle = 'rgba(234,223,200,0.7)';
        g.textAlign = 'center';
        g.fillText('D A Y', 0, -40);
        g.font = '120px "Anton"';
        g.fillStyle = day === 7 ? Note.RED : Note.CREAM;
        g.fillText(String(day).padStart(2, '0'), 0, 70);
        g.restore();
    },

    // the microscope: the worm in x-ray, the neoblasts light up, numbered
    scope(g, env, u) {
        Note.scope(g, env, 450, 960, 400, (c) => {
            const pts = Plan.draw(c, env, 0, -330, -Math.PI / 2 + 0.03 * Math.sin(u * 1.3), 660, { t: u * 0.5, bend: 0.05, look: 'xray', neo: Ease.seg(u, 0.9, 1.4), shadow: false });
            const P = (s) => Plan.at(pts, s);
            Note.circleNum(c, u, 1.3, P(0.25)[0] - 150, P(0.25)[1], 1);
            Note.circleNum(c, u, 1.6, P(0.5)[0] + 150, P(0.5)[1], 2);
            Note.circleNum(c, u, 1.9, P(0.78)[0] - 140, P(0.78)[1], 3);
            Note.redLine(c, u, 1.4, 0.2, [P(0.25)[0] - 122, P(0.25)[1]], [P(0.25)[0] - 40, P(0.25)[1] + 6], { lw: 2.5 });
            Note.redLine(c, u, 1.7, 0.2, [P(0.5)[0] + 122, P(0.5)[1]], [P(0.5)[0] + 45, P(0.5)[1] - 8], { lw: 2.5 });
            Note.redLine(c, u, 2.0, 0.2, [P(0.78)[0] - 112, P(0.78)[1]], [P(0.78)[0] - 30, P(0.78)[1] + 4], { lw: 2.5 });
            // the one word this shot needs, hand-written
            if (u > 1.0) {
                c.save();
                c.globalAlpha = Ease.seg(u, 1.0, 1.25);
                c.font = '46px "Patrick Hand"';
                c.fillStyle = Note.RED;
                c.textAlign = 'center';
                c.fillText('neoblasts', P(0.25)[0] - 175, P(0.25)[1] - 52);
                c.restore();
            }
        });
    },

    // two cuts, three pieces drift apart, each becomes a small whole worm
    pieces(g, env, u) {
        const len = 700, pts = Plan.spine(760, 960, 0, len, 0, 0);
        const sp = Ease.out(Ease.seg(u, 1.0, 1.5));
        const grow = Ease.inOut(Ease.seg(u, 1.7, 3.2));
        const cuts = [0.22, 0.42, 0.62, 0.81];
        [0, ...cuts].forEach((a, i) => {
            const b = i < cuts.length ? cuts[i] : 1;
            const dy = (i - 2) * 175 * sp, dx = (i % 2 ? 30 : -30) * sp + (i - 2) * 25 * sp + 90 * sp;
            const piece = pts.map(([x, y, an]) => [x + dx, y + dy, an]);
            Plan.draw(g, env, 0, 0, 0, len, { pts: piece, s0: a, s1: b, headless: i > 0 });
            // the pieces without a head grow one (white, then darkening)
            if (i > 0) bud(g, env, Plan.at(piece, a), len * 0.6, grow, 1 - Ease.seg(u, 3.2, 4.0));
        });
        cuts.forEach((s, k) => {
            const p = Plan.at(pts, s), kk = Ease.out(Ease.seg(u, 0.25 + k * 0.15, 0.5 + k * 0.15)) * (1 - Ease.seg(u, 0.95, 1.1));
            if (kk <= 0) return;
            g.save();
            g.strokeStyle = Note.RED;
            g.lineWidth = 5;
            g.setLineDash([16, 10]);
            g.beginPath();
            g.moveTo(p[0], p[1] - 110);
            g.lineTo(p[0], p[1] - 110 + 220 * kk);
            g.stroke();
            g.restore();
        });
    },

    // the Geiger counter: its probe over the worm, the needle climbs into the red, squiggles
    geiger(g, env, u, t) {
        Plan.draw(g, env, 840, 1395, 0.04, 360, { t: u, bend: 0.1 });
        const lv = 0.08 + 0.87 * Ease.inOut(Ease.seg(u, 0.1, 0.7));
        Props.geiger(g, env, t, 290, 900, 1, lv, { probe: [380, 360, -2.61], sag: 60 });
        Props.squiggles(g, u, 0.2, { n: 5, seed: 'g1', y0: 520, speed: 1600, lw: 3.2 });
    },

    // the microscope: an ashen worm, a glass needle puts in ONE cell, the cells spread, colour returns
    rescue(g, env, u) {
        Note.scope(g, env, 450, 960, 400, (c) => {
            const head = [0, -330], ang = -Math.PI / 2, len = 660;
            const pts = Plan.spine(head[0], head[1], ang, len, u * 0.5, 0.04);
            const back = Ease.seg(u, 2.0, 3.4);
            Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray-grey', shadow: false });
            if (back > 0) Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray', alpha: back, shadow: false });
            const sp = Ease.seg(u, 1.0, 2.6);
            if (sp > 0) Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray', alpha: 0, neo: 1, neoFrom: 0.5, neoSpread: sp, shadow: false, neoOnly: true });
            const p = Plan.at(pts, 0.5);
            // the needle comes in, leaves the cell, goes out
            const inn = Ease.out(Ease.seg(u, 0.1, 0.45)) - Ease.inOut(Ease.seg(u, 0.75, 1.05));
            if (inn > 0.001) Props.needle(c, p[0] + 30 + (1 - inn) * 420, p[1] - 10 - (1 - inn) * 260, -0.55);
            if (u > 0.45) {
                const pop = Ease.back(Ease.seg(u, 0.45, 0.65));
                c.fillStyle = 'rgba(220,40,25,0.95)';
                c.beginPath();
                c.arc(p[0] + 30, p[1] - 10, 9 * pop, 0, Math.PI * 2);
                c.fill();
                Note.circleNum(c, u, 0.55, p[0] + 30, p[1] - 10, '', { r: 30, seed: 'one' });
                if (u > 0.7 && u < 2.2) {
                    c.globalAlpha = Ease.seg(u, 0.7, 0.9) * (1 - Ease.seg(u, 2.0, 2.2));
                    c.font = '40px "Patrick Hand"';
                    c.fillStyle = Note.RED;
                    c.fillText('1 cell', p[0] + 70, p[1] - 40);
                    c.globalAlpha = 1;
                }
            }
        }, { scale: '0.5 MM' });
    },

    // under water: the worm glides past, big
    intro(g, env, u) {
        Plan.draw(g, env, 900 - u * 90, 1030, Math.PI * 0.02, 680, { t: u * 1.3, bend: 0.14 });
    },

    // on a ruler: 2 cm (1 tick = 1 mm = 20 units), and a magnifier callout
    size(g, env, u) {
        g.save();
        g.translate(0, 1250);
        Note.shadow(g, env, 450, 70, 520, 60, 0.5);
        const rg = g.createLinearGradient(0, 0, 0, 130);
        rg.addColorStop(0, '#ece6d8');
        rg.addColorStop(1, '#cfc7b4');
        g.fillStyle = rg;
        g.fillRect(-10, 0, 920, 130);
        g.fillStyle = 'rgba(40,30,20,0.85)';
        for (let i = 0; i < 46; i++) g.fillRect(50 + i * 20, 0, 2, i % 10 ? (i % 5 ? 22 : 36) : 52);
        g.font = '28px "Space Mono"';
        g.textAlign = 'center';
        for (let k = 0; k < 5; k++) g.fillText(String(k), 51 + k * 200, 92);
        g.restore();
        Plan.draw(g, env, 650, 1215, 0, 400, { t: u, bend: 0.04 });
        Note.callout(g, env, u, 0.5, 450, 760, 250, [470, 1215], (c) => {
            Plan.draw(c, env, 150, 30, 0, 300, { t: u, bend: 0.06 });
            c.strokeStyle = Note.RED;
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(-150, -90);
            c.lineTo(150, -90);
            c.moveTo(-150, -104);
            c.lineTo(-150, -76);
            c.moveTo(150, -104);
            c.lineTo(150, -76);
            c.stroke();
            c.font = '40px "Space Mono"';
            c.fillStyle = Note.RED;
            c.textAlign = 'center';
            c.fillText('2 CM', 0, -120);
        }, { fromR: 30 });
    },

    // a neoblast: one big cell (a large nucleus in a thin cell), arrows to what it can become
    stem(g, env, u) {
        const k = Ease.back(Ease.seg(u, 0.05, 0.4)), cx = 450, cy = 720, R = 165;
        g.save();
        g.translate(cx, cy);
        g.scale(k, k);
        const pul = 1 + 0.02 * Math.sin(u * 4);
        g.scale(pul, pul);
        Note.shadow(g, env, 8, 20, R * 1.05, R * 1.05, 0.5);
        stemCell(g, env, R);
        g.restore();
        handLabel(g, u, 0.5, 'neoblast', [cx + 120, cy - 120], [cx + 230, cy - 250], Note.RED);
        const B = [[160, 1180, 'EYE', 'eye'], [345, 1340, 'BRAIN', 'brain'], [555, 1340, 'GUT', 'gut'], [740, 1180, 'MUSCLE', 'muscle']];
        B.forEach(([x, y, lab, kind], i) => {
            const a = 1.2 + i * 0.35;
            const from = [cx + (x - cx) * 0.36, cy + (y - cy) * 0.33];
            const to = [x + (cx - x) * 0.14, y - 105];
            Note.redLine(g, u, a, 0.25, from, to, { lw: 4 });
            if (u > a + 0.2) {
                const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
                g.save();
                g.strokeStyle = Note.RED;
                g.lineWidth = 4;
                g.lineCap = 'round';
                g.beginPath();
                g.moveTo(to[0] - Math.cos(ang - 0.5) * 22, to[1] - Math.sin(ang - 0.5) * 22);
                g.lineTo(to[0], to[1]);
                g.lineTo(to[0] - Math.cos(ang + 0.5) * 22, to[1] - Math.sin(ang + 0.5) * 22);
                g.stroke();
                g.restore();
            }
            const p = Ease.back(Ease.seg(u, a + 0.2, a + 0.5));
            if (p <= 0) return;
            g.save();
            g.translate(x, y);
            g.scale(p, p);
            Note.shadow(g, env, 5, 12, 100, 100, 0.5);
            g.fillStyle = '#efe4cc';
            g.beginPath();
            g.arc(0, 0, 92, 0, Math.PI * 2);
            g.fill();
            g.strokeStyle = Note.RED;
            g.lineWidth = 5;
            g.stroke();
            organ(g, env, kind, u);
            g.font = '20px "Space Mono"';
            g.fillStyle = Note.INK;
            g.textAlign = 'center';
            g.fillText(lab.split('').join(' '), 0, 128);
            g.restore();
        });
    },

    // the tail tip: a sliver 1/279 of the worm, ringed, magnified, growing into a worm
    tiny(g, env, u) {
        const len = 640, pts = Plan.spine(770, 1260, 0, len, 0, 0.02);
        const off = Ease.out(Ease.seg(u, 0.3, 0.7)) * 26;
        Plan.draw(g, env, 0, 0, 0, len, { pts, s0: 0, s1: 0.985 });
        Plan.draw(g, env, 0, 0, 0, len, { pts: pts.map(([x, y, a]) => [x - off, y, a]), s0: 0.985, s1: 1, shadow: false, headless: true });
        const tip = Plan.at(pts, 0.99);
        Note.callout(g, env, u, 0.3, 450, 780, 260, [tip[0] - off - 4, tip[1]], (c) => {
            const k = Ease.inOut(Ease.seg(u, 0.9, 2.4));
            if (k < 0.08) {
                c.fillStyle = '#6e4a2c';
                c.beginPath();
                c.ellipse(0, 0, 26, 18, 0, 0, Math.PI * 2);
                c.fill();
            } else Plan.draw(c, env, 190 * k + 14, 0, 0, 40 + 340 * k, { t: u, bend: 0.06, pale: 1 - Ease.seg(u, 1.6, 2.5) * 0.7 });
        }, { fromR: 20 });
    },

    // the head split down the middle grows into two heads
    twohead(g, env, u) {
        const len = 620, H = [780, 960], ang = 0;
        const pts = Plan.spine(H[0], H[1], ang, len, u * 0.8, 0.05);
        const F = Plan.at(pts, 0.24);
        const k = Ease.inOut(Ease.seg(u, 1.5, 3.0));
        Plan.draw(g, env, 0, 0, 0, len, { pts, s0: 0.22, s1: 1, t: u });
        for (const sg of [-1, 1]) {
            const a = F[2] + sg * 0.5 * k, d = sg * 0.03 * len * k;
            const nx = -Math.sin(F[2]), ny = Math.cos(F[2]);
            const base = [F[0] + nx * d, F[1] + ny * d];
            const L2 = len * (1 - 0.15 * k);
            const tip = [base[0] + Math.cos(a) * 0.24 * L2, base[1] + Math.sin(a) * 0.24 * L2];
            const hp = Plan.spine(tip[0], tip[1], a, L2, 0, 0);
            Plan.draw(g, env, 0, 0, 0, L2, { pts: hp, s0: 0, s1: 0.3, shadow: false, pale: 0.6 * k * (1 - Ease.seg(u, 3.2, 4.2)) });
        }
        // the dashed red line down the middle of the head
        const kk = Ease.out(Ease.seg(u, 0.25, 1.1)) * (1 - Ease.seg(u, 1.4, 1.6));
        if (kk > 0) {
            const P0 = Plan.at(pts, -0.02), P1 = Plan.at(pts, 0.26);
            g.save();
            g.strokeStyle = Note.RED;
            g.lineWidth = 5;
            g.setLineDash([16, 10]);
            g.beginPath();
            g.moveTo(P0[0] + 40, P0[1]);
            g.lineTo(P0[0] + 40 + (P1[0] - P0[0] - 40) * kk, P0[1] + (P1[1] - P0[1]) * kk);
            g.stroke();
            g.restore();
        }
    },

    // close-up: a wound in the side closes in minutes (a stopwatch spins)
    wound(g, env, u) {
        const len = 1500, pts = Plan.spine(1180, 860, 0.02, len, u * 0.6, 0.04);
        Plan.draw(g, env, 0, 0, 0, len, { pts, t: u });
        const p = Plan.at(pts, 0.42), w = Plan.hw(0.42) * len, nx = -Math.sin(p[2]), ny = Math.cos(p[2]);
        const open = Ease.out(Ease.seg(u, 0.25, 0.5)) * (1 - Ease.inOut(Ease.seg(u, 1.1, 2.6)));
        const cx = p[0] - nx * w * 0.55, cy = p[1] - ny * w * 0.55;
        if (open > 0.01) {
            g.save();
            g.translate(cx, cy);
            g.rotate(p[2] + 0.5);
            g.fillStyle = 'rgba(245,215,200,0.9)';
            g.beginPath();
            g.ellipse(0, 0, 80, 22 * open + 4, 0, 0, Math.PI * 2);
            g.fill();
            g.fillStyle = '#5a2418';
            g.beginPath();
            g.ellipse(0, 0, 70, 15 * open + 1, 0, 0, Math.PI * 2);
            g.fill();
            g.restore();
        } else if (u > 2.6) {
            g.save();
            g.translate(cx, cy);
            g.rotate(p[2] + 0.5);
            g.strokeStyle = `rgba(235,215,190,${0.6 * (1 - Ease.seg(u, 2.6, 3.1))})`;
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(-60, 0);
            g.lineTo(60, 0);
            g.stroke();
            g.restore();
        }
        Note.circleNum(g, u, 0.3, cx, cy, '', { r: 100, seed: 'wound' });
        Props.stopwatch(g, env, 450, 1330, 0.95, Ease.inOut(Ease.seg(u, 0.9, 2.7)) * 3);
    },

    // into the mortar, ground up: a red cross — it does not come back
    grind(g, env, u, t) {
        const drop = Ease.in(Ease.seg(u, 0.05, 0.35));
        Props.mortar(g, env, t, 450, 1080, 1.35, { grind: Ease.seg(u, 0.35, 0.5) * (1 - Ease.seg(u, 1.4, 1.6)), paste: Ease.seg(u, 0.45, 1.3) });
        if (drop < 1) {
            g.save();
            g.globalAlpha = 1 - Ease.seg(drop, 0.75, 1);
            Plan.draw(g, env, 560, 640 + drop * 420, 0.1 + drop * 0.6, 260, { t: u, bend: 0.25 });
            g.restore();
        }
        Note.redLine(g, u, 1.35, 0.2, [220, 760], [680, 1340], { lw: 12 });
        Note.redLine(g, u, 1.5, 0.2, [680, 760], [220, 1340], { lw: 12 });
    },

    // a tear-off calendar: decades fly by; the worm beside it stays the same
    age(g, env, u) {
        const q = Ease.seg(u, 1.2, 3.9) * 35;
        const year = 1990 + Math.min(35, Math.floor(q));
        Props.calendar(g, env, u, 300, 880, 1.15, String(year), q < 35 ? q % 1 : 0);
        Plan.draw(g, env, 840, 1350, 0.03, 360, { t: u, bend: 0.12 });
        handLabel(g, u, 2.2, 'same worm', [700, 1300], [640, 1170], Note.RED);
    },

    // cut, regrow, cut, regrow, cut, regrow … then a hand-drawn ∞
    never(g, env, u) {
        const len = 560, pts = Plan.spine(740, 900, 0, len, u, 0.05);
        const cyc = 0.65, n = Math.min(3, Math.floor(Math.max(0, u - 0.1) / cyc));
        const c = Math.max(0, u - 0.1 - n * cyc) / cyc;
        if (u < 0.1 || n >= 3) Plan.draw(g, env, 0, 0, 0, len, { pts, t: u });
        else {
            Plan.draw(g, env, 0, 0, 0, len, { pts, s0: 0.16, s1: 1, headless: true });
            bud(g, env, Plan.at(pts, 0.16), len, Ease.inOut(Ease.seg(c, 0.15, 0.95)), 0.6);
            const p = Plan.at(pts, 0.16), fl = 1 - Ease.seg(c, 0, 0.25);
            if (fl > 0) {
                g.save();
                g.globalAlpha = fl;
                g.strokeStyle = Note.RED;
                g.lineWidth = 6;
                g.beginPath();
                g.moveTo(p[0], p[1] - 110);
                g.lineTo(p[0], p[1] + 110);
                g.stroke();
                g.restore();
            }
            g.save();
            g.font = '64px "Patrick Hand"';
            g.fillStyle = Note.RED;
            g.textAlign = 'center';
            g.fillText('×' + (n + 1), 450, 1180);
            g.restore();
        }
        // the infinity sign, drawn on
        const k = Ease.inOut(Ease.seg(u, 2.05, 2.75));
        if (k > 0) {
            g.save();
            g.strokeStyle = Note.RED;
            g.lineWidth = 12;
            g.lineCap = 'round';
            g.beginPath();
            for (let i = 0; i <= 80 * k; i++) {
                const a = (i / 80) * Math.PI * 2, d = 1 + Math.sin(a) * Math.sin(a);
                const x = 450 + (200 * Math.cos(a)) / d, y = 1250 + (200 * Math.sin(a) * Math.cos(a)) / d;
                if (i) g.lineTo(x, y);
                else g.moveTo(x, y);
            }
            g.stroke();
            g.restore();
        }
    },

    // an old (ashen) worm is cut; it regrows and comes back young
    younger(g, env, u) {
        const len = 580, pts = Plan.spine(760, 920, 0, len, u, 0.06);
        const cut = u > 0.7;
        const young = Ease.inOut(Ease.seg(u, 1.7, 2.8));
        if (!cut) Plan.draw(g, env, 0, 0, 0, len, { pts, t: u, look: 'normal-grey', bend: 0.03 });
        else {
            Plan.draw(g, env, 0, 0, 0, len, { pts, s0: 0.16, s1: 1, headless: true, look: young < 1 ? 'normal-grey' : 'normal' });
            if (young > 0 && young < 1) Plan.draw(g, env, 0, 0, 0, len, { pts, s0: 0.16, s1: 1, headless: true, alpha: young, shadow: false });
            bud(g, env, Plan.at(pts, 0.16), len, Ease.inOut(Ease.seg(u, 0.8, 1.8)), 1 - young);
        }
        const p = Plan.at(pts, 0.16);
        Note.redLine(g, u, 0.45, 0.2, [p[0], p[1] - 110], [p[0], p[1] + 110], { lw: 5 });
        if (u > 0.2) {
            g.save();
            g.globalAlpha = Ease.seg(u, 0.2, 0.4);
            g.font = '70px "Patrick Hand"';
            g.fillStyle = Note.INK;
            g.textAlign = 'center';
            g.fillText('old', 330, 1140);
            g.restore();
            Note.redLine(g, u, 1.6, 0.2, [270, 1120], [395, 1112], { lw: 6 });
        }
        if (u > 2.0) {
            g.save();
            const k = Ease.back(Ease.seg(u, 2.0, 2.3));
            g.translate(560, 1150);
            g.scale(k, k);
            g.rotate(-0.08);
            g.font = '96px "Patrick Hand"';
            g.fillStyle = Note.RED;
            g.textAlign = 'center';
            g.fillText('young!', 0, 0);
            g.restore();
        }
    },

    // not immortal: hunger (an empty dish), heat (a thermometer), predators (a fish)
    mortal(g, env, u, t) {
        Plan.draw(g, env, 640, 760, 0, 360, { t: u, bend: 0.12 });
        const C = [[170, 1180, -0.05, 'HUNGER', 1.75], [450, 1210, 0.03, 'HEAT', 2.45], [730, 1180, 0.06, 'PREDATORS', 3.25]];
        C.forEach(([x, y, r, lab, a], i) => {
            const k = Ease.back(Ease.seg(u, a, a + 0.3));
            if (k <= 0) return;
            g.save();
            g.translate(x, y);
            g.scale(k, k);
            Note.card(g, env, 0, 0, 250, 310, r, (c) => {
                if (i === 0) Props.dish(c, 0, -10, 0.95);
                if (i === 1) Props.thermometer(c, 0, -20, 0.75, 0.2 + 0.75 * Ease.inOut(Ease.seg(u, a + 0.2, a + 1.4)));
                if (i === 2) Props.fish(c, 0, -20, 0.8, t);
            }, { label: lab });
            g.restore();
        });
    },

    // the end: the worm glides; a subscribe button pops and is pressed
    subscribe(g, env, u) {
        Plan.draw(g, env, 820 - u * 60, 1230, 0.03, 600, { t: u * 1.3, bend: 0.14 });
        const k = Ease.back(Ease.seg(u, 0.15, 0.5));
        if (k > 0) Props.subscribe(g, 450, 700, k, Ease.seg(u, 1.0, 1.25), u > 1.15);
    },
};

// ---- under water (the jellyfish look, in a pond): seen from above through the water — a
// pebbly bed, a net of caustic light sliding over it, light shafts, silt drifting at three
// depths, a teal-green grade. Static layers are cached; caustics are two cached nets sliding.
const WATER = { regrow: true, intro: true, twohead: true, subscribe: true };
function pondBed(g, env) {
    Motion.sprite('pond:bed', { x: -60, y: -60, w: 1020, h: 1720 }, env.k * 0.75, (c) => {
        const gr = c.createLinearGradient(0, 0, 0, 1600);
        gr.addColorStop(0, '#1c3329');
        gr.addColorStop(0.5, '#24402f');
        gr.addColorStop(1, '#0f1d17');
        c.fillStyle = gr;
        c.fillRect(-60, -60, 1020, 1720);
        const r = Motion.rng('bed');
        // pebbles, out of focus (the worm is sharp, the bed sits deeper)
        c.filter = `blur(${7 * env.k * 0.75}px)`;
        for (let i = 0; i < 160; i++) {
            const x = r() * 1000 - 50, y = r() * 1700 - 50, rx = 18 + r() * 55, ry = rx * (0.55 + r() * 0.35), a = r() * Math.PI;
            const tone = 40 + r() * 40;
            const pg = c.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 2, x, y, rx);
            pg.addColorStop(0, `rgb(${tone + 40},${tone + 45},${tone + 20})`);
            pg.addColorStop(1, `rgb(${tone - 25},${tone - 10},${tone - 25})`);
            c.fillStyle = pg;
            c.beginPath();
            c.ellipse(x, y, rx, ry, a, 0, Math.PI * 2);
            c.fill();
        }
        // algae: soft green patches
        for (let i = 0; i < 40; i++) {
            const x = r() * 900, y = r() * 1600, R = 60 + r() * 140;
            const ag = c.createRadialGradient(x, y, 0, x, y, R);
            ag.addColorStop(0, 'rgba(80,130,55,0.25)');
            ag.addColorStop(1, 'rgba(90,140,60,0)');
            c.fillStyle = ag;
            c.fillRect(x - R, y - R, 2 * R, 2 * R);
        }
        c.filter = 'none';
    }).draw(g);
}
function causticNet(env, key) {
    return Motion.sprite('pond:caustic:' + key, { x: 0, y: 0, w: 600, h: 600 }, env.k * 0.75, (c) => {
        const r = Motion.rng('caustic' + key);
        c.filter = `blur(${5 * env.k * 0.75}px)`;
        c.strokeStyle = 'rgba(220,255,210,0.55)';
        c.lineWidth = 5;
        c.lineJoin = 'round';
        for (let i = 0; i < 26; i++) {
            const x = r() * 600, y = r() * 600, R = 45 + r() * 50;
            for (const [dx, dy] of [[0, 0], [600, 0], [-600, 0], [0, 600], [0, -600]]) {
                c.beginPath();
                for (let k = 0; k <= 28; k++) {
                    const a = (k / 28) * Math.PI * 2, rr = R * (0.8 + 0.2 * Math.sin(a * 3 + i) + 0.1 * Math.sin(a * 5 + i * 2));
                    c[k ? 'lineTo' : 'moveTo'](x + dx + Math.cos(a) * rr, y + dy + Math.sin(a) * rr);
                }
                c.stroke();
            }
        }
    });
}
function pondBack(g, env, t) {
    pondBed(g, env);
    g.save();
    const lp = g.createRadialGradient(560, 900, 40, 560, 900, 520);
    lp.addColorStop(0, 'rgba(200,230,160,0.28)');
    lp.addColorStop(1, 'rgba(200,230,160,0)');
    g.fillStyle = lp;
    g.globalCompositeOperation = 'lighter';
    g.fillRect(0, 300, 900, 1200);
    g.globalCompositeOperation = 'lighter';
    [['a', 18, 9, 0.22], ['b', -14, 12, 0.15]].forEach(([k, vx, vy, a]) => {
        const net = causticNet(env, k);
        g.globalAlpha = a;
        const ox = ((t * vx) % 600 + 600) % 600 - 600, oy = ((t * vy) % 600 + 600) % 600 - 600;
        for (let x = ox; x < 900; x += 600) for (let y = oy; y < 1600; y += 600) g.drawImage(net.canvas, x, y, 600, 600);
    });
    g.restore();
}
function pondFront(g, env, t) {
    Cine.rays(g, t, { n: 6, alpha: 0.11, x0: 80, step: 150 });
    Cine.particles(g, env, t, { n: 80, size: 1.3, alpha: 0.35, speed: 5, seed: 'silt-far', color: '220,240,200' });
    Cine.particles(g, env, t, { n: 30, size: 2.4, blur: 1.5, alpha: 0.3, speed: 10, seed: 'silt-mid', color: '220,240,200' });
    Cine.particles(g, env, t, { n: 8, size: 9, blur: 6, alpha: 0.18, speed: 24, seed: 'silt-near', color: '220,240,200' });
}

Motion.scene({
    fps: 24,
    duration: 59.6,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/notebook.js', 'styles/cinematic-facts/props.js', 'styles/cinematic-facts/cinema.js', 'sandbox/2026-11-12-planaria/planaria.js'],
    fonts: [
        { family: 'Anton', src: 'fonts/Anton-Regular.ttf' },
        { family: 'Space Mono', src: 'fonts/SpaceMono-Regular.ttf' },
        { family: 'Patrick Hand', src: 'fonts/PatrickHand-Regular.ttf' },
    ],
    audio: { mix: 'mix.wav' },
    shots: SH,

    draw(g, t, env) {
        const s = SH.find(([a, b]) => t >= a && t < b) || SH[SH.length - 1];
        const i = SH.indexOf(s), u = t - s[0], D = s[1] - s[0];
        // the camera: a punch-in that settles at each cut, then a slow push
        const z = 1 + 0.07 * (1 - Ease.out(Ease.seg(u, 0, 0.3))) + 0.035 * Ease.inOut(u / D);
        const water = WATER[s[2]];
        const dark = water || s[2] === 'scope' || s[2] === 'rescue';
        if (!water) Note.page(g, env, dark ? 'dark' : 'paper', { key: dark ? 'dark' : 'paper' + (i % 2) });
        g.save();
        g.translate(450, 900);
        g.scale(z, z);
        g.translate(-450, -900);
        if (water) pondBack(g, env, t);
        SHOTS[s[2]](g, env, u, t);
        if (water) pondFront(g, env, t);
        g.restore();
        if (water) {
            Cine.vignette(g, env, 0.75);
            // a darker band behind the caption keeps it readable over the water
            const bg = g.createLinearGradient(0, 0, 0, 620);
            bg.addColorStop(0, 'rgba(8,20,16,0.7)');
            bg.addColorStop(1, 'rgba(8,20,16,0)');
            g.fillStyle = bg;
            g.fillRect(0, 0, env.W, 620);
        }
        // the header and caption sit on the page, outside the push
        const H = HEAD[s[2]];
        Note.header(g, env, H[0], i + 1, { dark });
        Note.caption(g, u, H[1], H[3], D + 0.01, H[2], H[4], { dark });
        // a short paper flash on each cut
        const f = 1 - Ease.seg(u, 0, 0.12);
        if (i > 0 && f > 0) {
            g.fillStyle = `rgba(245,236,215,${0.55 * f})`;
            g.fillRect(0, 0, env.W, env.H);
        }
    },

    post(ctx, t, env) {
        Cine.grain(ctx, env, t);
    },
});
