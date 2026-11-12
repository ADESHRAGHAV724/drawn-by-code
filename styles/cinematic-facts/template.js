// Cinematic-facts template: a deep sea with light shafts and drifting particles, a slow
// push-in, and a two-line caption (white over colour). engine/new.mjs copies it.
Motion.scene({
    fps: 24,
    duration: 4,
    logical: [900, 1600],
    uses: ['styles/cinematic-facts/cinema.js'],
    fonts: [{ family: 'Anton', src: 'fonts/Anton-Regular.ttf' }],
    shots: [[0, 4, 'Template']],

    draw(g, t, env) {
        Cine.sea(g, env);
        const z = 1 + 0.05 * Ease.inOut(t / 4);
        g.save();
        g.translate(450, 800);
        g.scale(z, z);
        g.translate(-450, -800);
        Cine.rays(g, t);
        Cine.particles(g, env, t, { n: 90, size: 1.4, alpha: 0.35, speed: 6, seed: 'far' });
        Cine.particles(g, env, t, { n: 40, size: 2.6, blur: 1.5, alpha: 0.3, speed: 12, seed: 'mid' });
        Cine.particles(g, env, t, { n: 10, size: 9, blur: 6, alpha: 0.16, speed: 30, seed: 'near' });
        g.restore();
        Cine.vignette(g, env);
        Cine.caption(g, t, 0.3, 4, 'DID YOU', 'KNOW?', '#5ee6ff');
    },

    post(ctx, t, env) {
        Cine.grain(ctx, env, t);
    },
});
