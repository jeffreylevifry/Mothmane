ig.module(
        'game.entities.bug'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBug = ig.Entity.extend({
            size: {
                x: 20,
                y: 20
            },
            offset: {
                x: 0,
                y: 0
            },
            maxVel: {
                x: 100,
                y: 100
            },
            friction: {
                x: 150,
                y: 0
            },

            type: ig.Entity.TYPE.B, // Evil enemy group
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            collides: ig.Entity.COLLIDES.PASSIVE,

            health: 3,


            speed: 46,
            flip: false,

            animSheet: new ig.AnimationSheet('media/excitoblob.png', 20, 20),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('walking', 0.08, [0, 0, 0, 0, 1, 2, 2, 2, 2, 3]);
                this.addAnim('dead', 1, [0]);
            },


            update: function () {
                this.currentAnim = this.anims.walking;
                // Near an edge? return!
                if (!ig.game.collisionMap.getTile(
                        this.pos.x + (this.flip ? +4 : this.size.x - 4),
                        this.pos.y + this.size.y + 1
                    )) {
                    this.flip = !this.flip;

                    // We have to move the offset.x around a bit when going
                    // in reverse direction, otherwise the blob's hitbox will
                    // be at the tail end.
                    this.offset.x = this.flip ? 0 : 0;
                }

                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = !this.flip;

                this.parent();
            },


            handleMovementTrace: function (res) {
                this.parent(res);

                // Collision with a wall? return!
                if (res.collision.x) {
                    this.flip = !this.flip;
                    this.offset.x = this.flip ? 0 : 0;
                }
            },

            check: function (other) {
                other.receiveDamage(1, this);
            },

            receiveDamage: function (value) {
                this.parent(value);
                if (this.health > 0) {
                    ig.game.spawnEntity(EntityBugDeathExplosion, this.pos.x, this.pos.y, {
                        particles: 3,
                        colorOffset: 2

                    });
                }
            },
            kill: function () {
                this.parent();
                if (Math.random() * 2 > 1) {
                    ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, {
                        gravityFactor: 1
                    });
                }
                ig.game.spawnEntity(EntityBugDeathExplosion, this.pos.x, this.pos.y, {
                    colorOffset: 2
                });
            }



        })
        EntityBugDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 35,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityBugDeathExplosionParticle, x, y, {
                        colorOffset: settings.colorOffset ? settings.colorOffset : 0
                    });
                this.idleTimer = new ig.Timer();
            },
            update: function () {
                if (this.idleTimer.delta() > this.lifetime) {
                    this.kill();
                    if (this.callBack)
                        this.callBack();
                    return;
                }
            }
        });

        EntityBugDeathExplosionParticle = ig.Entity.extend({
            size: {
                x: 2,
                y: 2
            },
            maxVel: {
                x: 160,
                y: 200
            },
            lifetime: 2,
            fadetime: 1,
            bounciness: 0,
            vel: {
                x: 100,
                y: 30
            },
            friction: {
                x: 100,
                y: 0
            },
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 10,
            totalColors: 10,
            animSheet: new ig.AnimationSheet('media/bloodpixels.png', 2, 2),
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                var frameID = Math.round(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));
                this.addAnim('idle', 0.2, [frameID]);
                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
                this.idleTimer = new ig.Timer();
            },
            update: function () {
                if (this.idleTimer.delta() > this.lifetime) {
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.lifetime - this.fadetime, this.lifetime,
                    1, 0
                );
                this.parent();
            }
        });
    })