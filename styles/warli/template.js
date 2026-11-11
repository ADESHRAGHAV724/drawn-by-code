// Warli style template: a village wall paints itself in rice paste — the chowk border, the
// sun, a hut and a tree — and the tarpa dance gathers round the horn player.
Motion.scene({
    fps: 24,
    duration: 4,
    logical: [1600, 900],
    uses: ['styles/warli/warli.js'],
    fonts: [{ family: 'Hand', src: 'fonts/PatrickHand-Regular.ttf' }],
    bpm: 120,
    shots: [[0, 4, 'Template']],

    draw(g, t, env) {
        const W = Warli, E = Ease, tt = W.twos(t);
        W.wall(g, env);
        W.border(g, env, { prog: E.inOut(E.seg(t, 0, 0.9)) });

        // sky: the sun turning on twos, birds crossing
        W.sun(g, 1330, 200, 82, { spin: tt * 0.25, grow: E.back(E.seg(t, 0.3, 0.8)) });
        for (let i = 0; i < 3; i++) {
            const x = 330 + i * 95 + tt * 110, y = 200 + (i % 2) * 40 + Math.sin(tt * 3 + i) * 6;
            if (t > 0.6) W.bird(g, x, y, 60, tt * 2.5 + i * 0.33, { seed: 'bird' + i });
        }

        // the village on its ground line
        W.ground(g, 90, 1510, 790, { prog: E.inOut(E.seg(t, 0.4, 1.2)) });
        W.hut(g, 250, 790, 190, { prog: E.seg(t, 0.7, 1.8) });
        W.tree(g, 1340, 790, 300, { seed: 'peepal', prog: E.seg(t, 0.9, 2.4) });
        if (t > 1.6) W.deer(g, 1040 + tt * 40, 790, 120, { ph: tt * 1.6, seed: 'deer' });

        // the tarpa dance: the player in the middle, the ring joins one by one and turns
        const cx = 760, cy = 470;
        if (t > 0.9) W.tarpaPlayer(g, cx, cy + 40, 92, { ph: tt * 1.2 });
        W.tarpaRing(g, cx, cy, 120, { H: 70, t, spin: tt * 0.22, appear: E.seg(t, 1.0, 2.6), seed: 'ring' });

        // the title, written in paste
        const a = E.seg(t, 2.6, 3.1);
        if (a > 0) {
            g.save();
            g.globalAlpha = a;
            g.fillStyle = W.PASTE;
            g.font = '64px Hand';
            g.textAlign = 'left';
            g.fillText('Warli', 120, 150);
            g.restore();
        }
    },

    post(ctx, t, env) {
        Warli.grain(ctx, env, { amount: 0.6 });
    },
});
