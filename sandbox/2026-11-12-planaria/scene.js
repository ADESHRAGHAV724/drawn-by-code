// planaria · 15 s DEMO (no voice yet) in the «field notebook» look: six shots — the head is
// cut and grows back, a day counter, the microscope with the neoblasts, three pieces become
// three worms, «age limit? none», follow. Hard cuts with a short punch-in, a slow push on
// every shot, sound effects only.
const SH = [
    [0, 2.6, 'hook'],
    [2.6, 5.2, 'regrow'],
    [5.2, 8.0, 'scope'],
    [8.0, 10.6, 'pieces'],
    [10.6, 12.9, 'age'],
    [12.9, 15, 'follow'],
];

// [label, small line at, small line, big line at, big line]
const HEAD = {
    hook: ['The hook', 0.1, 'CUT OFF ITS HEAD', 1.45, 'IT GROWS BACK'],
    regrow: ['Regeneration', 0.1, 'A NEW HEAD IN', 1.7, 'JUST 7 DAYS'],
    scope: ['Microscope', 0.1, 'THE SECRET', 1.0, 'NEOBLASTS'],
    pieces: ['Cut it up', 0.1, 'EVERY PIECE', 1.75, 'A NEW WORM'],
    age: ['Lifespan', 0.1, 'AGE LIMIT?', 1.2, 'NONE'],
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

Motion.scene({
    fps: 24,
    duration: 15,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/notebook.js', 'styles/cinematic-facts/cinema.js', 'sandbox/2026-11-12-planaria/planaria.js'],
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
        const dark = s[2] === 'scope';
        Note.page(g, env, dark ? 'dark' : 'paper', { key: dark ? 'dark' : 'paper' + (i % 2) });
        g.save();
        g.translate(450, 900);
        g.scale(z, z);
        g.translate(-450, -900);
        SHOTS[s[2]](g, env, u, t);
        g.restore();
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
