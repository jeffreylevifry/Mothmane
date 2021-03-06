ig.module(
        'game.entities.heal'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityHeal = ig.Entity.extend({
            size: {
                x: 13,
                y: 13
            },
            offset: {
                x: -2,
                y: -2
            },
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.NEVER,

            animSheet: new ig.AnimationSheet('media/heart-full.png', 9, 9),


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
                    if (other.health <= (other.maxHealth - 1)) {
                        other.health = other.health + 1;
                        this.kill();
                    }

                }
            }
        });

    });
