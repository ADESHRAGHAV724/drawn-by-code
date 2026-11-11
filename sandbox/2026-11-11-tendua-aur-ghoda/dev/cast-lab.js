// Cast check sheet for tendua-aur-ghoda: every pose of the horse, the mare and the leopard,
// the ensō, the stable and the master, before the film.
Motion.scene({
    fps: 24, duration: 1, logical: [1600, 1600],
    uses: ['styles/sumi-e/sumi.js', 'sandbox/2026-11-04-red-thread/cast.js', 'sandbox/2026-11-11-tendua-aur-ghoda/beasts.js'],
    draw(g, t, env) {
        const B = Beasts, Sm = Sumi;
        Sm.paper(g, env, { x: -50, y: -50, w: 1700, h: 1700 });
        const G1 = 480, G2 = 980, G3 = 1500;
        B.horse(g, 200, G1, 0.9, {});
        B.horse(g, 560, G1, 0.9, { walking: true, ph: 0.3, seed: 'h2' });
        B.horse(g, 930, G1, 0.9, { rear: 0.8, ears: 1, seed: 'h3' });
        B.horse(g, 1330, G1, 0.8, { facing: -1, ink: 0.5, mane: 1.5, seed: 'mare' });
        B.leopard(g, 200, G2, 1, { greedy: 1 });
        B.leopard(g, 520, G2, 1, { gait: 'prowl', crouch: 1, ph: 0.2, seed: 'l2' });
        B.leopard(g, 800, G2, 1, { gait: 'sit', jaw: 0.7, seed: 'l3' });
        B.leopard(g, 1080, G2, 1, { gait: 'bound', ph: 0.25, hop: 30, seed: 'l4' });
        B.leopard(g, 1400, G2, 1, { gait: 'flee', ph: 0.6, facing: -1, seed: 'l5' });
        B.enso(g, 250, 1260, 160, 1);
        B.stable(g, env, 800, G3, 420);
        Cast.figure(g, { x: 1250, y: G3, h: 260, face: -1, kind: 'man', id: 'master', hands: [[1180, G3 - 250], [1205, G3 - 240]] });
        Sm.stroke(g, [[1150, G3 - 330], [1260, G3 - 130]], { w: 10, ink: 0.95, dry: 0.3, seed: 'stick' });
    },
});
