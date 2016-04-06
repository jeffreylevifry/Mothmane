ig.module(
        'game.entities.bugshooting'
    )
    .requires(
        'impact.entity',
        'game.entities.spit'
    )
    .defines(function () {
        EntityBugshooting = ig.Entity.extend({
            _wmIgnore: false,
            size: {
                x: 19,
                y: 19
            },
            offset: {
                x: 0,
                y: 0
            },
            health: 3,
            gravityFactor: 0,
            spitActive: false,
            attackDamage: 1,
            attackTimer: null,
            speed: 46,
            type: ig.Entity.TYPE.B, // Evil enemy group
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            animSheet: new ig.AnimationSheet('media/bugshoot.png', 20, 20),
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('attack', .5, [4]);
                this.addAnim('idle', .1, [0, 1, 2, 3]);
                this.addAnim('walk', .1, [0, 1, 2, 3]);
                this.addAnim('pain', .3, [5, 6, 7, 8]);
                this.attackTimer = new ig.Timer();

            },

            check: function (other) {
                this.parent(other);
            },
            update: function () {
                this.parent();

                var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if (player) {

                    if (this.touches(player)) {
                        player.receiveDamage(1, this);
                    }

                    if (this.attackTimer.delta() < 2) {
                        //waiting
                        this.vel.x = 0;
                        this.currentAnim = this.anims.idle;
                    } else if (this.attackTimer.delta() < 5 && this.attackTimer.delta() > 2) {
                        //trying to attack
                        if (this.distanceTo(player) < 400 && this.distanceTo(player) > 60) {
                            this.currentAnim = this.anims.walk;
                            if (this.pos.x > player.pos.x) {
                                this.vel.x = -50;
                                this.flip = false;
                            }
                            if (this.pos.x < player.pos.x) {
                                this.vel.x = 50;
                                this.flip = true;
                            }

                        } else if (this.distanceTo(player) < 100) {
                            if (this.pos.x > player.pos.x) {
                                this.flip = false;
                            }
                            if (this.pos.x < player.pos.x) {
                                this.flip = true;
                            }
                            this.vel.x = 0;
                            this.currentAnim = this.anims.attack;
                            if (this.spawnChild != this.currentAnim.frame) {
                                var spot = this.flip ? this.pos.x + 10 : this.pos.x - 10;
                                ig.game.spawnEntity(EntitySpit, spot, this.pos.y, {
                                    flip: !this.flip
                                });
                                this.spawnChild = this.currentAnim.frame;

                            }
                            if (this.currentAnim.frame != 4) {
                                this.spawnChild = this.currentAnim.frame;
                            }
                        } else {
                            this.currentAnim = this.anims.idle;
                            this.vel.x = 0;

                        }
                    } else {
                        // reset cycle
                        this.attackTimer.reset();
                        this.spawnChild = null;
                    }
                }
            },
            handleMovementTrace: function (res) {
                this.parent(res);

                // Collision with a wall? return!
                if (res.collision.x) {
                    this.flip = !this.flip;
                    this.offset.x = this.flip ? 0 : 0;
                }
            },
            receiveDamage: function (value) {
                this.parent(value);


                if (this.health > 0) {
                    if (Math.random() * 5 > 4) {
                        ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, {
                            gravityFactor: 1

                        });
                    }
                }
                ig.game.spawnEntity(EntityShootingBugDeathExplosion, this.pos.x, this.pos.y, {
                    particles: 5,
                    colorOffset: 4
                });
            },

            check: function (other) {
                other.receiveDamage(1, this);
            },
            kill: function () {
                this.parent();
                ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, {
                    gravityFactor: 1
                });
                ig.game.spawnEntity(EntityShootingBugDeathExplosion, this.pos.x, this.pos.y, {


                });
            }



        })
        EntityShootingBugDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 35,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityShootingBugDeathExplosionParticle, x, y, {
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

        EntityShootingBugDeathExplosionParticle = ig.Entity.extend({
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
            colorOffset: 5,
            totalColors: 12,
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