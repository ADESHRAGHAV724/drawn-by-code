// Cast check sheet: every motif and pose of sone-ka-anda side by side, before the film.
Motion.scene({
    fps: 24, duration: 1, logical: [1600, 900],
    uses: ['styles/warli/warli.js', 'sandbox/2026-11-11-sone-ka-anda/cast.js'],
    fonts: [{ family: 'Kalam', src: 'fonts/Kalam-Regular.ttf' }],
    draw(g, t, env) {
        const W = Warli, C = Cast;
        W.wall(g, env);
        const G1 = 400, G2 = 800;
        W.ground(g, 60, 1540, G1, { tufts: 0 });
        W.ground(g, 60, 1540, G2, { tufts: 0 });
        C.hen(g, 120, G1, 90, {});
        C.hen(g, 260, G1, 90, { state: 'sit', asleep: true });
        C.hen(g, 420, G1, 90, { state: 'lie' });
        C.hen(g, 560, G1, 110, { rooster: true, crow: 1 });
        C.egg(g, 700, G1, 26, { glow: 1 });
        C.basket(g, 840, G1, 130, 5);
        C.nest(g, 990, G1, 110);
        C.cow(g, 1150, G1, 170, {});
        C.stall(g, 1400, G1, 170);
        const poses = ['stand', 'sit', 'grieve', 'kneel', 'hold', 'carry', 'reach', 'creep', 'strike', 'walk'];
        poses.forEach((p, i) => {
            const x = 110 + i * 145;
            const parts = W.human(g, x, G2, 150, W.pose(p, 0.2), { plant: true, sex: i % 3 === 2 ? 'f' : 'm', seed: 'p' + i });
            if (p === 'creep') C.sickle(g, parts.handR[0], parts.handR[1], -2.4, 90);
            if (p === 'hold') C.egg(g, (parts.handL[0] + parts.handR[0]) / 2, Math.min(parts.handL[1], parts.handR[1]) + 4, 18, {});
            g.fillStyle = W.PASTE; g.font = '22px Kalam'; g.fillText(p, x - 30, G2 + 40);
        });
        g.fillStyle = Cast.GOLD; g.font = '64px Kalam';
        g.fillText('लालच बुरी बला है', 760, 120);
    },
});
