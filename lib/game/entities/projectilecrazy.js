ig.module(
        'game.entities.projectilecrazy'
    )
    .requires(
        'impact.entity',
        'impact.entity-pool'
    )
    .defines(function () {

        EntityProjectilecrazy = ig.Entity.extend({

            _wmIgnore: true, // This entity will no be available in Weltmeister


            size: {
                x: 9,
                y: 9
            },
            offset: {
                x: 0,
                y: 0
            },
            maxVel: {
                x: 220,
                y: 500
            },

            // The fraction of force with which this entity bounces back in collisions
            bounciness: 11,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
            collides: ig.Entity.COLLIDES.PASSIVE,
            gravityFactor: 1.75,
            animSheet: new ig.AnimationSheet('media/projectilewhite.png', 10, 10),


            bounceCounter: 0,


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -450;
                this.addAnim('idle', 1, [0]);


            },

            reset: function (x, y, settings) {
                // This function is called when an instance of this class is resurrected
                // from the entity pool. (Pooling is enabled at the bottom of this file).
                this.parent(x, y, settings);

                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -405;


                // Remember, this a used entity, so we have to reset our bounceCounter
                // as well
                this.bounceCounter = 0;
            },

            update: function () {
                this.parent();

                this.currentAnim.angle += ig.system.tick * 5;
            },

            handleMovementTrace: function (res) {
                this.parent(res);

                // Kill this fireball if it bounced more than 3 times
                if (res.collision.x || res.collision.y || res.collision.slope) {
                    this.bounceCounter++;
                    if (this.bounceCounter > 2) {
                        this.kill();
                    }
                }
            },

            // This function is called when this entity overlaps anonther entity of the
            // checkAgainst group. I.e. for this entity, all entities in the B group.
            check: function (other) {
                other.receiveDamage(.5, this);
                this.kill();
            }
        });


        // If you have an Entity Class that instanced and removed rapidly, such as this 
        // Fireball class, it makes sense to enable pooling for it. This will reduce
        // strain on the GarbageCollector and make your game a bit more fluid.

        // With pooling enabled, instances that are removed from the game world are not 
        // completely erased, but rather put in a pool and resurrected when needed.

        ig.EntityPool.enableFor(EntityProjectilecrazy);


    });