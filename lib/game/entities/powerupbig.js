ig.module(
        'game.entities.powerupbig'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPowerupbig = ig.Entity.extend({
            size: {
                x: 20,
                y: 20
            },

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.NEVER,

            animSheet: new ig.AnimationSheet('media/powerupB.png', 20, 20),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.1, [0]);
            },


            update: function () {
                // Do nothing in this update function; don't even call this.parent().
                // The coin just sits there, isn't affected by gravity and doesn't move.

                // We still have to update the animation, though. This is normally done
                // in the .parent() update:
                this.currentAnim.update();
            },


            check: function (other) {
                // The instanceof should always be true, since the player is
                // the only entity with TYPE.A - and we only check against A.
                if (other instanceof EntityPlayer) {
                    localStorage.setItem('powerup', 2);
                    this.kill();
                }
            }
        });

    });