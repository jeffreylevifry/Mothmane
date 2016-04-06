ig.module(
        'game.entities.bouncyblock'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBouncyblock = ig.Entity.extend({
            size: {
                x: 20,
                y: 20
            },
            offset: {
                x: 2,
                y: 0
            },

            gravityFactor: 0,
            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.FIXED,


            animSheet: new ig.AnimationSheet('media/bouncyblock.png', 20, 20),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('crawl', 0.2, [0]);


            },

            check: function (other) {}

        });

    });