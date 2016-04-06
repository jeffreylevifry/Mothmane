ig.module(
        'game.entities.bugupdown'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBugupdown = ig.Entity.extend({
            size: {
                x: 16,
                y: 16
            },
            offset: {
                x: 2,
                y: 2
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
            gravityFactor: 0,

            health: 2,

            timer: null,
            speed: 76,
            flip: false,

            animSheet: new ig.AnimationSheet('media/bug.png', 20, 20),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('flying', 0.1, [0, 1]);
                this.addAnim('dead', 1, [0]);
                this.timer = new ig.Timer();
                this.attackTimer = new ig.Timer();
                projectileOne = 0;

            },


            update: function () {
                this.currentAnim = this.anims.flying;

                if (this.timer.delta() > 1.4) {
                    this.flip = !this.flip;

                    // We have to move the offset.x around a bit when going
                    // in reverse direction, otherwise the blob's hitbox will
                    // be at the tail end.
                    //      this.offset.x = this.flip ? 0 : 0;

                    this.timer = new ig.Timer();
                }

                var ydir = this.flip ? -1 : 1;
                this.vel.y = this.speed * ydir;


                if (this.attackTimer.delta() > 1.7) {
                    var spot = this.pos.x + 10;

                    ig.game.spawnEntity(EntitySpit, spot, this.pos.y, {
                        flip: this.flip


                    });

                    this.attackTimer = new ig.Timer();

                }


                this.parent();
            },


            receiveDamage: function (value) {
                this.parent(value);
                if (this.health > 0)
                    ig.game.spawnEntity(EntityBugDeathExplosion, this.pos.x, this.pos.y, {
                        particles: 3,
                        colorOffset: 2
                    });
            },


            handleMovementTrace: function (res) {
                this.parent(res);


            },

            check: function (other) {
                other.receiveDamage(1, this);
            },
            kill: function () {
                this.parent();

                if (Math.random() * 2 > 1) {
                    ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, {
                        gravityFactor: 1
                    });
                }

                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                    colorOffset: 0
                });
            }



        })
        EntityDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 25,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {
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

        EntityDeathExplosionParticle = ig.Entity.extend({
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
            colorOffset: 0,
            totalColors: 7,
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