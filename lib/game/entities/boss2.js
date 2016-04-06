ig.module(
        'game.entities.boss2'
    )
    .requires(
        'impact.entity',
        'game.entities.spit'
    )
    .defines(function () {
        EntityBoss2 = ig.Entity.extend({
            _wmIgnore: false,
            size: {
                x: 29,
                y: 29
            },
            offset: {
                x: 0,
                y: 0
            },
            health: 20,
            gravityFactor: 0,
            spitActive: false,
            attackDamage: 1,
            attackTimer: null,
            speed: 56,
            type: ig.Entity.TYPE.B, // Evil enemy group
            checkAgainst: ig.Entity.TYPE.A, // Check against friendly
            animSheet: new ig.AnimationSheet('media/boss2.png', 40, 40),
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('attack', .15, [4]);
                this.addAnim('idle', .2, [0, 1, 2, 3]);
                this.addAnim('walk', .15, [0, 1, 2, 3]);
                this.addAnim('pain', .3, [5, 6, 7, 8]);
                this.attackTimer = new ig.Timer();
                this.currentAnim.flip.x = false;

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

                    if (this.attackTimer.delta() < 1.5) {
                        //waiting
                        this.vel.x = 0;
                        this.currentAnim = this.anims.idle;
                    } else if (this.attackTimer.delta() < 2.5 && this.attackTimer.delta() > 1) {
                        //trying to attack
                        if (this.distanceTo(player) < 300 && this.distanceTo(player) > 60) {
                            this.currentAnim = this.anims.walk;
                            if (this.pos.x > player.pos.x) {
                                this.vel.x = -50;
                                this.currentAnim.flip.x = false;
                            }
                            if (this.pos.x < player.pos.x) {
                                this.vel.x = 50;
                                this.currentAnim.flip.x = true;
                            }

                        } else if (this.distanceTo(player) < 60) {
                            if (this.pos.x > player.pos.x) {
                                this.currentAnim = this.anims.idle;
                                this.currentAnim.flip.x = false;
                            }
                            if (this.pos.x < player.pos.x) {
                                this.currentAnim = this.anims.idle;
                                this.currentAnim.flip.x = true;
                            }
                            this.vel.x = 0;
                            this.currentAnim = this.anims.attack;
                            if (this.pos.x > player.pos.x) {
                                this.currentAnim.flip.x = false;
                            }
                            if (this.pos.x < player.pos.x) {
                                this.currentAnim.flip.x = true;
                            }
                            if (this.spawnChild != this.currentAnim.frame) {
                                var spot = this.currentAnim.flip.x ? this.pos.x + 10 : this.pos.x - 10;
                                ig.game.spawnEntity(EntityBug, spot, this.pos.y, {
                                    flip: !this.currentAnim.flip.x
                                });
                                ig.game.spawnEntity(EntitySpit, spot, this.pos.y, {
                                    flip: !this.currentAnim.flip.x
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
                ig.game.spawnEntity(EntityBossExplosion, this.pos.x, this.pos.y, {
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
                ig.game.spawnEntity(EntityBossExplosion, this.pos.x, this.pos.y, {


                });
            }



        })
        EntityBossExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 85,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityBossExplosionParticle, x, y, {
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

        EntityBossExplosionParticle = ig.Entity.extend({
            size: {
                x: 4,
                y: 4
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