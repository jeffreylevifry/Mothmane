ig.module(
        'game.entities.player'
    )
    .requires(
        'impact.entity',
        'game.entities.projectile',
        'game.entities.projectilespread',
        'game.entities.projectilebig',
        'game.entities.projectilestream',
        'game.entities.projectilecrazy'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: {
                x: 16,
                y: 18
            },
            offset: {
                x: 4,
                y: 2
            },
            maxVel: {
                x: 200,
                y: 400
            },
            friction: {
                x: 800,
                y: 0
            },





            type: ig.Entity.TYPE.A, // Player friendly group
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,






            animSheet: new ig.AnimationSheet('media/mothman.png', 20, 20),

            // These are our own properties. They are not defined in the base
            // ig.Entity class. We just use them internally for the Player
            flip: false,
            accelGround: 500,
            accelAir: 400,
            jump: 500,
            //   health: 3,
            //    maxHealth: 3,
            //   powerup: 0,
            //   coins: 0,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 0.14, [0, 1, 2, 3, 2, 1]);
                this.addAnim('jump', 1, [8]);
                this.addAnim('run', .14, [4, 5, 6, 7, 6, 5, 4]);
                this.addAnim('fall', 1, [8]);
                this.addAnim('pain', 1, [8]);
                // set current animation here
                deathTimer = 0;
                painTimer = new ig.Timer();
                ig.game.player = this;

                //set health and coins
                this.coins = localStorage.getItem('coins');
                this.health = localStorage.getItem('health');
                this.maxHealth = localStorage.getItem('maxHealth');
                this.powerup = localStorage.getItem('powerup');

            },

            update: function () {




                //mobile movement
                /*
                if (ig.ua.mobile) {
                    pX = this.pos.x;
                    pY = this.pos.y;
                    var accel = this.standing ? this.accelGround : this.accelAir;
                    nY = (ig.input.mouse.y + ig.game.screen.y);
                    nX = (ig.input.mouse.x + ig.game.screen.x);

                    if (ig.input.pressed("CanvasTouch")) {


                        if (nX > pX + 20) {
                            this.accel.x = accel;
                            console.log(accel);
                            this.flip = false;

                        } else if (nX < pX - 20) {
                            this.accel.x = -accel;
                            console.log(accel);
                            this.flip = true;

                        } else {
                            this.accel.x = 0;
                        }
                        if (nY < pY - 10 && this.standing) {

                            this.vel.y = -this.jump;

                        }


                    }

                    if (ig.input.state("CanvasTouch") == false) {
                        console.log("false");
                        this.accel.x = 0;
                    }
                }
                */
                ///////////////////////////////////////////////////////
                ////////////////


                if (deathTimer != 0) {
                    if (deathTimer.delta() > 1) {
                        ig.game.loadLevel(LevelLevel1);
                        deathTimer = 0;
                    }
                }


                if (typeof gravityTimer === 'undefined') {
                    this.gravityFactor = 1;
                } else if (gravityTimer.delta() >= 1) {
                    this.gravityFactor = 1;
                }

                // Handle user input; move left or right
                //               if (!ig.ua.mobile) {
                var accel = this.standing ? this.accelGround : this.accelAir;
                if (ig.input.state('left')) {

                    this.accel.x = -accel;
                    this.flip = true;

                } else if (ig.input.state('right')) {

                    this.accel.x = accel;
                    this.flip = false;

                } else {

                    this.accel.x = 0;

                }


                // jump
                if (this.standing && ig.input.pressed('jump')) {

                    this.vel.y = -this.jump;

                    //                 }

                }

                // shoot
                if (ig.input.pressed('shoot')) {
                    powerup = localStorage.getItem('powerup');
                    if (powerup == 1) {
                        ig.game.spawnEntity(EntityProjectilespread, this.pos.x + 7, this.pos.y, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilespread, this.pos.x + 7, this.pos.y - 25, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilespread, this.pos.x + 7, this.pos.y - 15, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 2 && this.flip == false) {
                        ig.game.spawnEntity(EntityProjectilebig, this.pos.x + 7, this.pos.y - 17, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 2 && this.flip == true) {
                        ig.game.spawnEntity(EntityProjectilebig, this.pos.x - 14, this.pos.y - 17, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 3 && this.flip == false) {
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 6, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 15, this.pos.y - 2, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 24, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 33, this.pos.y, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 42, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 51, this.pos.y, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 60, this.pos.y - 2, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x + 69, this.pos.y - 1, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 3 && this.flip == true) {
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 6, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 15, this.pos.y - 2, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 24, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 33, this.pos.y, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 42, this.pos.y - 1, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 51, this.pos.y, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 60, this.pos.y - 2, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilestream, this.pos.x - 69, this.pos.y - 1, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 4 && this.flip == false) {
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x + 7, this.pos.y - 12, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x + 17, this.pos.y - 12, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x - 7, this.pos.y - 12, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 4 && this.flip == true) {
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x - 7, this.pos.y - 12, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x - 17, this.pos.y - 12, {
                            flip: this.flip
                        })
                        ig.game.spawnEntity(EntityProjectilecrazy, this.pos.x + 7, this.pos.y - 12, {
                            flip: this.flip
                        })
                    }
                    if (powerup == 0) {
                        ig.game.spawnEntity(EntityProjectile, this.pos.x + 7, this.pos.y, {
                            flip: this.flip
                        })
                    };
                }



                // If we're dead, fade out
                if (this.health <= 0) {

                    this.kill();
                    localStorage.setItem('powerup', 0);
                    ig.game.spawnEntity(EntityPlayerDeathExplosion, this.pos.x, this.pos.y, {

                    });

                    var tempArray = [];
                    if (tempArray.length <= 0) {
                        var self = this; // Cache the current scope's `this`
                        setTimeout(function () {
                            ig.game.reloadLevel();
                            localStorage.setItem('maxHealth', 3);
                            localStorage.setItem('health', localStorage.getItem('maxHealth'));
                        }, 3000);
                    }




                } else if (this.vel.y < 0) {
                    this.currentAnim = this.anims.jump;
                } else
                if (this.vel.y > 0) {
                    if (this.currentAnim != this.anims.fall) {
                        this.currentAnim = this.anims.fall.rewind();
                    }
                } else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.run;
                } else {
                    this.currentAnim = this.anims.idle;
                }

                this.currentAnim.flip.x = this.flip;
                this.parent();
            },



            collideWith: function (other, axis) {

                if (other instanceof EntityBouncyblock) {
                    if (axis == 'y') {

                        this.vel.y = -900;
                        this.gravityFactor = 0.5;
                        gravityTimer = new ig.Timer();

                    }
                }
            },





            receiveDamage: function (amount, from) {
                if (amount > 99) {
                    this.health -= amount;
                }
                if (painTimer.delta() < 1.5 && painTimer.delta() > 0) {
                    return;
                }
                if (painTimer.delta() > 1.5) {



                    // We don't call the parent implementation here, because it 
                    // would call this.kill() as soon as the health is zero. 
                    // We want to play our death (pain) animation first.
                    this.health -= amount;
                    localStorage.setItem('health', this.health);
                    this.currentAnim = this.anims.pain.rewind();

                    painTimer = new ig.Timer();
                    // Knockback
                    if (amount < 100) {
                        this.vel.x = (from.pos.x > this.pos.x) ? -200 : 180;
                        this.vel.y = -150;
                    } else {
                        this.vel.x = 0;
                        this.vel.y = 0;
                    }
                }

                // Sound
                // this.sfxHurt.play();
            },




        });

        EntityPlayerDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 155,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityPlayerDeathExplosionParticle, x, y, {
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

        EntityPlayerDeathExplosionParticle = ig.Entity.extend({
            size: {
                x: 2,
                y: 2
            },
            maxVel: {
                x: 260,
                y: 200
            },
            lifetime: 5,
            fadetime: 2,
            bounciness: 0,
            vel: {
                x: 300,
                y: 200
            },
            friction: {
                x: 100,
                y: 0
            },
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 0,
            totalColors: 111,
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