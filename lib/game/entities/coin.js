ig.module(
        'game.entities.coin'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityCoin = ig.Entity.extend({
            size: {
                x: 10,
                y: 14
            },
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.NEVER,

            animSheet: new ig.AnimationSheet('media/coin.png', 10, 14),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 0.09, [0, 1, 2, 3]);
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
                    if (other.coins < 100) {
                        other.coins = ((other.coins * 1) + 1);
                        localStorage.setItem('coins', other.coins);
                        this.kill();
                    } else if (other.coins > 99) {
                        other.coins = 0;
                        other.maxHealth = ((other.maxHealth * 1) + 1);
                        other.health = other.maxHealth;
                        localStorage.setItem('maxHealth', other.maxHealth);
                        localStorage.setItem('health', other.health);
                        localStorage.setItem('coins', 0);
                    }

                }
            }
        });

    });
