ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.level1',
        'game.levels.level2',
        'game.levels.level3',
        'game.entities.player',
        'game.entities.bug',
        'game.entities.bugflying',
        'game.entities.bugshooting',
        'game.entities.bouncyblock',
        'game.entities.levelchange',
        'plugins.camera',
        'plugins.touch-button',
        'plugins.gamepad'
    )
    .defines(function () {


        MyGame = ig.Game.extend({

            gravity: 1500,


            // Load a font
            font: new ig.Font('media/04b03.font.png'),

            //hearts
            heartFull: new ig.Image('media/heart-full.png'),
            heartEmpty: new ig.Image('media/heart-empty.png'),
            coinIcon: new ig.Image('media/coin.png'),

            init: function () {

                //clear previous settings
                localStorage.clear();

                //set health and coins and powerups
                this.coins = localStorage.getItem('coins');
                if (this.coins == null) {
                    localStorage.setItem('coins', 0);
                    console.log("Setting coins");
                }

                if (localStorage.getItem('health') == null) {
                    localStorage.setItem('health', 3);

                }


                if (localStorage.getItem('maxHealth') == null) {
                    localStorage.setItem('maxHealth', 3);
                }
                if (localStorage.getItem('powerup') == null) {
                    localStorage.setItem('powerup', 0);
                }


                if (!ig.ua.mobile) {
                    //key bindings
                    ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                    ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                    ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                    ig.input.bind(ig.KEY.SPACE, 'shoot');




                }


                //mobile\
                if (ig.ua.mobile) {



                    ig.input.bind(ig.GAMEPAD.PAD_LEFT, 'left');
                    ig.input.bind(ig.GAMEPAD.PAD_RIGHT, 'right');
                    ig.input.bind(ig.GAMEPAD.FACE_1, 'jump');
                    ig.input.bind(ig.GAMEPAD.FACE_2, 'shoot');

                    // go full-screen



                    if (window.myTouchButtons) {
                        window.myTouchButtons.align();


                    }
                }

                //loadlevel
                this.loadLevel(LevelLevel1);

            },


            loadLevel: function (data) {


                // Remember the currently loaded level, so we can reload when
                // the player dies.
                this.currentLevel = data;

                // Call the parent implemenation; this creates the background
                // maps and entities.
                this.parent(data);
                //          this.setupCamera();


            },
            setupCamera: function () {
                // Set up the camera. The camera's center is at a third of the screen
                // size, i.e. somewhat shift left and up. Damping is set to 3px.		
                this.camera = new ig.Camera(ig.system.width / 3, ig.system.height / 3, 3);

                // The camera's trap (the deadzone in which the player can move with the
                // camera staying fixed) is set to according to the screen size as well.
                this.camera.trap.size.x = ig.system.width / 10;
                this.camera.trap.size.y = ig.system.height / 3;

                // The lookahead always shifts the camera in walking position; you can 
                // set it to 0 to disable.
                this.camera.lookAhead.x = ig.system.width / 6;

                // Set camera's screen bounds and reposition the trap on the player
                this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
                this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
                this.camera.set(this.player);
            },
            reloadLevel: function () {
                this.loadLevelDeferred(this.currentLevel);
            },

            update: function () {

                //scroll following

                var player = this.getEntitiesByType(EntityPlayer)[0];
                if (player && !ig.ua.mobile) {
                    this.screen.x = player.pos.x - ig.system.width / 2;
                    this.screen.y = player.pos.y - ig.system.height / 2.2;
                } else if (player && ig.ua.mobile) {
                    {
                        this.screen.x = player.pos.x - ig.system.width / 2;
                        this.screen.y = player.pos.y - ig.system.height / 2.5;
                    }
                }

                //           this.camera.follow(this.player);
                // Update all entities and backgroundMaps
                this.parent();

            },


            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();

                if (this.player) {
                    var x = 6,
                        y = 6;

                    for (var i = 0; i < this.player.maxHealth; i++) {
                        // Full or empty heart?
                        if (this.player.health > i) {
                            this.heartFull.draw(x, y);
                        } else {
                            this.heartEmpty.draw(x, y);
                        }

                        x += this.heartEmpty.width + 2;
                    }

                    // We only want to draw the 0th tile of coin sprite-sheet
                    x = 180;
                    this.coinIcon.drawTile(x, y - 2 + 0, 0, 10, 14);


                    x += 14;
                    this.font.draw('x ' + this.player.coins, x, y + 2)
                }
                if (ig.ua.mobile) {
                    // Draw touch buttons, if we have any
                    if (window.myTouchButtons) {
                        window.myTouchButtons.draw();
                    }
                }

            },

        });

        // Start the Game with 50fps, a resolution of 320x240, scaled
        // up by a factor of 4
        //ig.main('#canvas', MyGame, 50, 220, 140, 4);

        //  });


        if (ig.ua.mobile) {
            // Use the TouchButton Plugin to create a TouchButtonCollection that we
            // can draw in our game classes.

            // Touch buttons are anchored to either the left or right and top or bottom
            // screen edge.
            var buttonImage = new ig.Image('media/touch-buttons.png');
            myTouchButtons = new ig.TouchButtonCollection([
		new ig.TouchButton('left', {
                    left: 5,
                    bottom: 5
                }, 32, 32, buttonImage, 0),
		new ig.TouchButton('right', {
                    left: 34,
                    bottom: 5
                }, 32, 32, buttonImage, 1),
		new ig.TouchButton('shoot', {
                    right: 32,
                    bottom: 5
                }, 32, 32, buttonImage, 2),
		new ig.TouchButton('jump', {
                    right: 5,
                    bottom: 24
                }, 32, 32, buttonImage, 3)
	]);
        }
        if (ig.ua.mobile) {
                // If our screen is smaller than 640px in width (that's CSS pixels), we scale the 
                // internal resolution of the canvas by 2. This gives us a larger viewport and
                // also essentially enables retina resolution on the iPhone and other devices 
                // with small screens.

                var scale = (window.innerWidth < 640) ? 1 : 1;


                // We want to run the game in "fullscreen", so let's use the window's size
                // directly as the canvas' style size.
                var canvas = document.getElementById('canvas');
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';


                // Listen to the window's 'resize' event and set the canvas' size each time
                // it changes.

                window.addEventListener('resize', function () {
                    // If the game hasn't started yet, there's nothing to do here
                    if (!ig.system) {
                        return;
                    }

                    // Resize the canvas style and tell Impact to resize the canvas itself;
                    canvas.style.width = window.innerWidth + 'px';
                    canvas.style.height = window.innerHeight + 'px';
                    ig.system.resize(window.innerWidth * scale, (window.innerHeight * scale));

                    // Re-center the camera - it's dependend on the screen size.
                    if (ig.game && ig.game.setupCamera) {
                        ig.game.setupCamera();
                    }

                    // Also repositon the touch buttons, if we have any
                    if (window.myTouchButtons) {
                        window.myTouchButtons.align();
                    }
                }, false);


                // Finally, start the game into MyTitle and use the ImpactSplashLoader plugin 
                // as our loading screen
                var width = window.innerWidth,
                    height = window.innerHeight;
            //    ig.main('#canvas', MyGame, 50, width, height, 4);
      

        
           // ig.main('#canvas', MyGame, 50, width, height, 3);
				  	ig.main('#canvas', MyGame, 60, 220, 120, 4);
        } else {
            ig.main('#canvas', MyGame, 60, 220, 140, 4);
        }
    });