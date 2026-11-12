// planaria · LOOK TEST (before the voice): four shots in the «field notebook» look.
Motion.scene({
    fps: 24,
    duration: 12,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/notebook.js', 'styles/cinematic-facts/cinema.js', 'sandbox/2026-11-12-planaria/planaria.js'],
    fonts: [
        { family: 'Anton', src: 'fonts/Anton-Regular.ttf' },
        { family: 'Space Mono', src: 'fonts/SpaceMono-Regular.ttf' },
        { family: 'Patrick Hand', src: 'fonts/PatrickHand-Regular.ttf' },
    ],
    shots: [
        [0, 3, 'hook'],
        [3, 6, 'scope'],
        [6, 9, 'pieces'],
        [9, 12, 'size'],
    ],

    draw(g, t, env) {
        if (t < 3) {
            const u = t;
            Note.page(g, env, 'paper');
            Note.header(g, env, 'The hook', 1);
            Note.caption(g, u, 0.1, 0.7, 3, 'CUT ITS HEAD', 'IT GROWS BACK');
            Plan.draw(g, env, 700 - u * 20, 900, -0.25, 560, { t: u });
            Note.redLine(g, u, 1.2, 0.3, [560, 760], [680, 1000], { lw: 5 });
        } else if (t < 6) {
            const u = t - 3;
            Note.page(g, env, 'dark');
            Note.header(g, env, 'Microscope', 2, { dark: true });
            Note.caption(g, u, 0.1, 0.8, 3, 'INSIDE', 'A PLANARIAN', { dark: true });
            Note.scope(g, env, 450, 980, 390, (c) => {
                const pts = Plan.draw(c, env, 0, -300, -Math.PI / 2 + 0.02 * Math.sin(u), 620, { t: u * 0.5, bend: 0.06, look: 'xray', neo: Ease.seg(u, 1, 1.6), shadow: false });
                const P = (s) => Plan.at(pts, s);
                Note.circleNum(c, u, 0.6, P(0.1)[0] - 120, P(0.1)[1], 1);
                Note.circleNum(c, u, 0.9, P(0.53)[0] + 120, P(0.53)[1], 2);
                Note.circleNum(c, u, 1.2, P(0.75)[0] - 120, P(0.75)[1], 3);
            });
        } else if (t < 9) {
            const u = t - 6;
            Note.page(g, env, 'paper', { key: 'paper2' });
            Note.header(g, env, 'Regeneration', 3);
            Note.caption(g, u, 0.1, 0.5, 3, 'EVERY PIECE', 'A NEW WORM');
            const sp = Ease.out(Ease.seg(u, 0.3, 1.2));
            const pale = Ease.seg(u, 1.2, 2.5);
            [[0, 0.34], [0.34, 0.67], [0.67, 1]].forEach(([a, b], i) => {
                const pts = Plan.spine(780, 1000, 0, 600, 0, 0);
                if (sp < 1) Plan.draw(g, env, 780 - i * sp * 40, 1000 + (i - 1) * sp * 60, 0, 600, { pts: pts.map(([x, y, a2]) => [x - i * sp * 40, y + (i - 1) * sp * 200, a2]), s0: a, s1: b });
                else Plan.draw(g, env, 650 - i * 40, 760 + i * 230, 0.05 * (i - 1), 360, { t: u, s0: 0, s1: 1, pale: 1 - Ease.seg(u, 2.5, 3) });
            });
        } else {
            const u = t - 9;
            Note.page(g, env, 'paper', { key: 'paper3' });
            Note.header(g, env, 'Size', 4);
            Note.caption(g, u, 0.1, 0.6, 3, 'JUST', '1–2 CM');
            // a ruler
            g.save();
            g.translate(0, 1260);
            g.fillStyle = '#d8d2c4';
            g.fillRect(-10, 0, 920, 120);
            g.fillStyle = 'rgba(40,30,20,0.85)';
            for (let i = 0; i < 46; i++) g.fillRect(20 + i * 20, 0, 2, i % 5 ? 26 : 50);
            g.restore();
            Plan.draw(g, env, 480, 1225, 0, 260, { t: u, bend: 0.1 });
            Note.callout(g, env, u, 0.6, 450, 760, 230, [400, 1222], (c) => {
                Plan.draw(c, env, 160, 40, 0, 320, { t: u, bend: 0.1 });
                c.font = '30px "Space Mono"';
                c.fillStyle = Note.RED;
                c.textAlign = 'center';
                c.fillText('2 CM', 0, -110);
            });
        }
    },

    post(ctx, t, env) {
        Cine.grain(ctx, env, t);
    },
});
