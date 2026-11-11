// Cast check sheet for laalchi-siyaar: the jackal, the boar, the hunter, bow and arrow.
Motion.scene({
    fps: 24, duration: 1, logical: [1600, 1300],
    uses: ['sandbox/2026-11-11-laalchi-siyaar/etch.js', 'sandbox/2026-11-11-laalchi-siyaar/cast.js'],
    draw(g, t, env) {
        const C = Cast, X = Etch;
        X.paper(g, env, { x: 30, y: 30, w: 1540, h: 1240 });
        const G1 = 330, G2 = 760, G3 = 1220;
        C.jackal(g, 150, G1, 1, {});
        C.jackal(g, 420, G1, 1, { walking: true, ph: 0.25, head: 0.35, seed: 'j2' });
        C.jackal(g, 700, G1, 1, { jaw: 0.8, tail: 1, lift: 30, seed: 'j3' });
        C.jackal(g, 980, G1, 1, { sly: true, head: 0.5, jaw: 0.4, seed: 'j4' });
        C.jackal(g, 1280, G1, 1, { lying: true, eyesClosed: true, seed: 'j5' });
        C.boar(g, 200, G2, 0.9, { run: true, ph: 0.3 });
        C.boar(g, 600, G2, 0.9, { arrow: true, head: -0.4, mouth: 1, seed: 'b2' });
        C.boar(g, 1000, G2, 0.9, { facing: -1, head: 0.3, run: true, ph: 0.7, seed: 'b3' });
        C.boar(g, 1300, G2, 0.9, { lying: true, arrow: true, eyesClosed: true, seed: 'b4' });
        const h1 = C.hunter(g, 150, G3, 300, { hands: [[60, -232], [-10, -238]], bowAim: 1 });
        C.bow(g, [h1.hands[0][0] - 8, h1.hands[0][1] - 110], [h1.hands[0][0] - 8, h1.hands[0][1] + 110], { bend: -0.2, nock: h1.hands[1] });
        C.hunter(g, 450, G3, 300, { legs: [[2.0, 1.4], [1.1, 1.8]], hands: [[-50, -280], [50, -290]], lean: -0.2, mouthOpen: 1, seed: 'h2' });
        C.hunter(g, 800, G3, 300, { lying: true, eyesClosed: true, seed: 'h3' });
        C.bow(g, [1050, G3 - 5], [1270, G3 - 80], { bend: 0.22, fray: 0.7 });
        C.bow(g, [1330, G3 - 5], [1540, G3 - 30], { bend: 0.05, snapped: 0.6, seed: 'b2' });
        C.arrowAt(g, [1100, G3 - 260], [1300, G3 - 300]);
    },
});
