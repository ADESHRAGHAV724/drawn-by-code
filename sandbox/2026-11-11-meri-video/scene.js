// meri-video: a car speeds down the village road and hits the big tree (Warli, 10 s).
// See brief.md for the shot list. Everything moves on twos (tt), except the wall.
const DIR = 'sandbox/2026-11-11-meri-video/';

Motion.scene({
    fps: 24,
    duration: 10,
    logical: [1600, 900],
    uses: ['styles/warli/warli.js', DIR + 'cast.js'],
    fonts: [{ family: 'Hand', src: 'fonts/PatrickHand-Regular.ttf' }],
    shots: [[0, 1.4, 'Village'], [1.4, 5.0, 'The car'], [5.0, 6.0, 'Crash'], [6.0, 8.5, 'After'], [8.5, 10, 'Lesson']],

    draw(g, t, env) {
        const W = Warli, E = Ease, C = Cast, tt = W.twos(t);
        const GY = 800, TREE = 1250, S = 380, HIT = 5.0;
        W.wall(g, env);

        // the crash shakes the painting (not the wall it is painted on)
        if (tt >= HIT) {
            const amp = 12 * Math.exp(-(tt - HIT) * 5);
            g.translate(Math.sin(tt * 97) * amp, Math.cos(tt * 83) * amp);
        }

        W.border(g, env, { prog: E.inOut(E.seg(t, 0, 1.0)) });
        W.sun(g, 800, 175, 78, { spin: tt * 0.2, grow: E.back(E.seg(t, 0.2, 0.7)) });
        W.ground(g, 90, 1510, GY, { prog: E.inOut(E.seg(t, 0.3, 1.1)) });
        W.hut(g, 250, GY, 230, { prog: E.seg(t, 0.5, 1.4) });

        // the tree sways after the hit, pivoting on its foot
        const sway = tt < HIT ? 0 : 0.09 * Math.exp(-(tt - HIT) * 2.2) * Math.sin((tt - HIT) * 11);
        g.save();
        g.translate(TREE, GY);
        g.rotate(sway);
        g.translate(-TREE, -GY);
        W.tree(g, TREE, GY, 440, { seed: 'neem', prog: E.seg(t, 0.4, 1.4) });
        g.restore();

        // birds: perched until the hit, then they burst out to the upper left
        const perch = [[1150, 330, 1], [1262, 292, -1], [1372, 335, -1]];
        perch.forEach(([bx, by, f], i) => {
            if (t < 1.2) return;
            const d = tt - (HIT + 0.05 + i * 0.08);
            if (d <= 0) W.bird(g, bx, by, 52, 0.75, { seed: 'bird' + i, facing: f });
            else W.bird(g, bx - 330 * d, by - 230 * d + Math.sin(d * 5 + i) * 12, 52, tt * 3 + i * 0.3, { seed: 'bird' + i, facing: -1 });
        });

        // falling leaves (closed form per leaf), resting on the ground once they land
        const lr = Motion.rng('leaves');
        for (let i = 0; i < 16; i++) {
            const x0 = TREE + (lr() - 0.5) * 300, y0 = GY - 280 - lr() * 130, t0 = HIT + lr() * 1.4, ph = lr() * 6;
            const d = tt - t0;
            if (d <= 0) continue;
            let y = y0 + 60 * d + 18 * d * d, x = x0 + 22 * Math.sin(d * 3 + ph) + 14 * d, a = ph + d * 2.5;
            if (y >= GY - 3) (y = GY - 3), (a = 0.15 * (i % 2 ? 1 : -1)), (x = x0 + 14 * ((GY - 3 - y0) / 80));
            C.leaf(g, x, y, 18, a, 'leaf' + i);
        }

        // the car: in from the left, speeding up, then the hit and the bounce back
        const xHit = TREE - 8 - S * 0.5;
        const carX = tt < HIT ? Ease.lerp(-220, xHit, Math.pow(E.seg(tt, 1.4, HIT), 1.5)) : xHit - 42 * E.out(E.seg(tt, HIT, HIT + 0.35));
        const crush = E.out(E.seg(tt, HIT, HIT + 0.17));
        const driverOut = tt >= 6.1;

        // the driver staggers out from behind the car (drawn first, so the car hides him)
        if (driverOut) {
            const u = E.seg(tt, 6.1, 7.6);
            const dx = carX - 40 - 230 * E.out(u);
            const walking = u < 1;
            const pose = walking ? W.pose('walk', tt * 2.2) : W.pose('stand');
            pose.lean = 0.14 * Math.sin(tt * 4.2); // dizzy
            const parts = W.human(g, dx, GY, 150, pose, { seed: 'driver', facing: walking ? -1 : 1 });
            const [hx, hy] = parts.head;
            for (let k = 0; k < 3; k++) {
                const a = tt * 4 + (k / 3) * W.TAU;
                C.star(g, hx + Math.cos(a) * 30, hy - 30 + Math.sin(a) * 9, 8, 'star' + k);
            }
        }

        if (t > 1.4) {
            const parts = C.car(g, carX, GY, S, { spin: carX / (S * 0.11 * 0.86), crush, driver: !driverOut });
            // exhaust while driving
            if (tt < HIT) {
                for (let k = 0; k < 3; k++) {
                    const age = (tt * 2.5 + k / 3) % 1;
                    const [ex, ey] = parts.exhaust;
                    W.ring(g, ex - age * 70, ey - age * 26, 4 + age * 9, { w: 2.5, seed: 'puff' + k });
                }
            }
            // steam from the crumpled bonnet
            if (tt > HIT + 0.3) {
                for (let k = 0; k < 4; k++) {
                    if (tt < HIT + 0.3 + k * 0.25) continue;
                    const age = (tt * 0.7 + k / 4) % 1;
                    const [bx, by] = parts.bonnet;
                    W.ring(g, bx + Math.sin(age * 7 + k) * 10, by - 10 - age * 150, 6 + age * 15, { w: 2.5, seed: 'steam' + k });
                }
            }
            C.burst(g, parts.nose[0] + 6, parts.nose[1], 150, E.seg(tt, HIT, HIT + 0.7));
        }

        // the villagers run from the hut, then stop and raise their arms
        [['m', 380, 590, 0], ['f', 350, 480, 0.25]].forEach(([sex, x0, x1, delay], i) => {
            const t0 = 6.4 + delay, t1 = 8.4;
            if (tt < t0) return;
            const u = E.seg(tt, t0, t1);
            const x = Ease.lerp(x0, x1, u);
            const pose = u < 1 ? W.pose('walk', tt * 2.6 + i * 0.5) : W.pose('raise');
            const hop = u >= 1 ? Math.abs(Math.sin((tt - t1) * 7)) * 10 : 0;
            W.human(g, x, GY - hop, 145, pose, { sex, pot: sex === 'f', seed: 'villager' + i });
        });

        // the lesson, written on the wall
        const a = E.seg(t, 8.6, 9.2);
        if (a > 0) {
            g.save();
            g.globalAlpha = a;
            g.fillStyle = W.PASTE;
            g.font = '68px Hand';
            g.fillText('Dhyan se chalao!', 120, 160);
            g.restore();
        }
    },

    post(ctx, t, env) {
        Warli.grain(ctx, env, { amount: 0.6 });
    },
});
