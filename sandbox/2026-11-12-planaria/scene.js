// planaria · 15 s DEMO (no voice yet) in the «field notebook» look: six shots — the head is
// cut and grows back, a day counter, the microscope with the neoblasts, three pieces become
// three worms, «age limit? none», follow. Hard cuts with a short punch-in, a slow push on
// every shot, sound effects only.
const SH = [
    [0, 2.4, 'hook'],
    [2.4, 4.8, 'regrow'],
    [4.8, 7.2, 'pieces'],
    [7.2, 9.6, 'scope'],
    [9.6, 12.2, 'geiger'],
    [12.2, 14.6, 'dose'],
    [14.6, 17.8, 'rescue'],
    [17.8, 20, 'follow'],
];

// [label, small line at, small line, big line at, big line]
const HEAD = {
    hook: ['The hook', 0.1, 'CUT OFF ITS HEAD', 1.45, 'IT GROWS BACK'],
    regrow: ['Regeneration', 0, null, 0, null],
    pieces: ['Cut it up', 0, null, 0, null],
    scope: ['Microscope', 0, null, 0, null],
    geiger: ['Radiation', 0, null, 0, null],
    dose: ['Radiation', 0.1, "THAT'S 12X", 1.0, 'A DEADLY DOSE'],
    rescue: ['Rescue', 0, null, 0, null],
    follow: ['Next', 0.1, 'FOLLOW FOR', 0.6, 'MORE FACTS'],
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

const SHOTS = {
    // the worm glides; a red line marks the neck, snip, the head slides away
    hook(g, env, u) {
        const len = 560, hx = 640 + u * 18, hy = 980;
        const pts = Plan.spine(hx, hy, -0.12, len, u * 1.5, 0.12);
        const cut = Ease.out(Ease.seg(u, 1.35, 1.9));
        if (u < 1.35) Plan.draw(g, env, 0, 0, 0, len, { pts, t: u });
        else {
            const head = pts.map(([x, y, a]) => [x + cut * 70, y - cut * 40, a - cut * 0.25]);
            const body = pts.map(([x, y, a]) => [x - cut * 20, y + cut * 10, a]);
            Plan.draw(g, env, 0, 0, 0, len, { pts: body, s0: 0.16, s1: 1, headless: true });
            Plan.draw(g, env, 0, 0, 0, len, { pts: head, s0: 0, s1: 0.16 });
        }
        // the dashed red cut line across the neck
        const p = Plan.at(pts, 0.16), nx = -Math.sin(p[2]), ny = Math.cos(p[2]);
        const d = 120, k = Ease.out(Ease.seg(u, 0.7, 1.15)) * (1 - Ease.seg(u, 1.7, 2.0));
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
        const len = 600, gr = Ease.inOut(Ease.seg(u, 0.2, 1.7));
        const pts = Plan.spine(760, 860, 0, len, u, 0.06);
        Plan.draw(g, env, 0, 0, 0, len, { pts, t: u, s0: 0.16, s1: 1, headless: true });
        bud(g, env, Plan.at(pts, 0.16), len, gr, 1 - Ease.seg(u, 1.7, 2.5));
        // the counter: DAY n in a dark box with a flap line
        const day = Math.min(7, 1 + Math.floor(Ease.seg(u, 0.2, 1.7) * 6.999));
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
        const len = 640, pts = Plan.spine(770, 960, 0, len, 0, 0);
        const sp = Ease.out(Ease.seg(u, 0.75, 1.2));
        const grow = Ease.inOut(Ease.seg(u, 1.1, 1.9));
        [[0, 0.36], [0.36, 0.68], [0.68, 1]].forEach(([a, b], i) => {
            const dy = (i - 1) * 250 * sp, dx = (1 - i) * 60 * sp;
            const piece = pts.map(([x, y, an]) => [x + dx, y + dy, an]);
            Plan.draw(g, env, 0, 0, 0, len, { pts: piece, s0: a, s1: b, headless: i > 0 });
            // the pieces without a head grow one (white, then darkening)
            if (i > 0) bud(g, env, Plan.at(piece, a), len * 0.75, grow, 1 - Ease.seg(u, 2.0, 2.6));
        });
        [0.36, 0.68].forEach((s, k) => {
            const p = Plan.at(pts, s), kk = Ease.out(Ease.seg(u, 0.2 + k * 0.2, 0.5 + k * 0.2)) * (1 - Ease.seg(u, 0.8, 1.0));
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
        const lv = 0.08 + 0.87 * Ease.inOut(Ease.seg(u, 0.35, 1.3));
        Props.geiger(g, env, t, 290, 900, 1, lv, { probe: [380, 360, -2.61], sag: 60 });
        Props.squiggles(g, u, 0.6, { n: 5, seed: 'g1', y0: 520, speed: 1600, lw: 3.2 });
    },

    // twelve wooden mannequins: twelve deadly doses; they turn ashen one by one
    dose(g, env, u) {
        for (let i = 0; i < 12; i++) {
            const col = i % 4, row = Math.floor(i / 4);
            const x = 145 + col * 205 + (row % 2) * 18, y = 860 + row * 285;
            const k = Ease.back(Ease.seg(u, 0.05 + i * 0.05, 0.3 + i * 0.05));
            if (k <= 0) continue;
            const grey = Ease.seg(u, 1.0 + i * 0.06, 1.3 + i * 0.06);
            Props.mannequin(g, env, x, y, 0.95 * k, -0.04 * grey * (i % 2 ? 1 : -1), grey);
        }
        Props.squiggles(g, u, 0.9, { n: 7, seed: 'd1', y0: 480, speed: 1800, lw: 3.2 });
    },

    // the microscope: an ashen worm, a glass needle puts in ONE cell, the cells spread, colour returns
    rescue(g, env, u) {
        Note.scope(g, env, 450, 960, 400, (c) => {
            const head = [0, -330], ang = -Math.PI / 2, len = 660;
            const pts = Plan.spine(head[0], head[1], ang, len, u * 0.5, 0.04);
            const back = Ease.seg(u, 1.7, 2.8);
            Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray-grey', shadow: false });
            if (back > 0) Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray', alpha: back, shadow: false });
            const sp = Ease.seg(u, 1.3, 2.6);
            if (sp > 0) Plan.draw(c, env, 0, 0, 0, len, { pts, look: 'xray', alpha: 0, neo: 1, neoFrom: 0.5, neoSpread: sp, shadow: false, neoOnly: true });
            const p = Plan.at(pts, 0.5);
            // the needle comes in, leaves the cell, goes out
            const inn = Ease.out(Ease.seg(u, 0.35, 0.8)) - Ease.inOut(Ease.seg(u, 1.05, 1.4));
            if (inn > 0.001) Props.needle(c, p[0] + 30 + (1 - inn) * 420, p[1] - 10 - (1 - inn) * 260, -0.55);
            if (u > 0.8) {
                const pop = Ease.back(Ease.seg(u, 0.8, 1.0));
                c.fillStyle = 'rgba(220,40,25,0.95)';
                c.beginPath();
                c.arc(p[0] + 30, p[1] - 10, 9 * pop, 0, Math.PI * 2);
                c.fill();
                Note.circleNum(c, u, 0.95, p[0] + 30, p[1] - 10, '', { r: 30, seed: 'one' });
                if (u > 1.1 && u < 2.0) {
                    c.globalAlpha = Ease.seg(u, 1.1, 1.3) * (1 - Ease.seg(u, 1.8, 2.0));
                    c.font = '26px "Patrick Hand"';
                    c.fillStyle = Note.RED;
                    c.fillText('1 cell', p[0] + 70, p[1] - 40);
                    c.globalAlpha = 1;
                }
            }
        }, { scale: '0.5 MM' });
    },

    // four kraft cards with red question marks; then a worm on each
    age(g, env, u) {
        const pos = [[250, 760, -0.06], [650, 780, 0.05], [250, 1180, 0.04], [650, 1170, -0.05]];
        pos.forEach(([x, y, r], i) => {
            const k = Ease.back(Ease.seg(u, 0.15 + i * 0.12, 0.45 + i * 0.12));
            if (k <= 0) return;
            g.save();
            g.translate(x, y);
            g.scale(k, k);
            Note.card(g, env, 0, 0, 340, 360, r, (c) => {
                const q = 1 - Ease.seg(u, 1.1, 1.3);
                if (q > 0) {
                    c.globalAlpha = q;
                    c.font = '190px "Patrick Hand"';
                    c.fillStyle = Note.RED;
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText('?', 0, 0);
                    c.globalAlpha = 1;
                }
                if (u > 1.1) {
                    const k2 = Ease.back(Ease.seg(u, 1.1, 1.4));
                    c.save();
                    c.scale(k2, k2);
                    Plan.draw(c, env, 110, 0, -0.1 + i * 0.07, 230, { t: u + i, bend: 0.12 });
                    c.restore();
                }
            }, { label: ['10 YEARS', '50 YEARS', '100 YEARS', 'FOREVER?'][i] });
            g.restore();
        });
    },

    // the worm glides across the page
    follow(g, env, u) {
        Plan.draw(g, env, 560 + u * 110, 1000, 0.05, 560, { t: u * 1.4, bend: 0.16 });
    },
};

// ---- under water (the jellyfish look, in a pond): seen from above through the water — a
// pebbly bed, a net of caustic light sliding over it, light shafts, silt drifting at three
// depths, a teal-green grade. Static layers are cached; caustics are two cached nets sliding.
const WATER = { regrow: true, follow: true };
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
    duration: 20,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/notebook.js', 'styles/cinematic-facts/props.js', 'styles/cinematic-facts/cinema.js', 'sandbox/2026-11-12-planaria/planaria.js'],
    fonts: [
        { family: 'Anton', src: 'fonts/Anton-Regular.ttf' },
        { family: 'Space Mono', src: 'fonts/SpaceMono-Regular.ttf' },
        { family: 'Patrick Hand', src: 'fonts/PatrickHand-Regular.ttf' },
    ],
    audio: { mix: 'sandbox/2026-11-12-planaria/mix.wav' },
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
