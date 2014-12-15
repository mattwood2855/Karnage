/**
 * Created by Matt on 12/14/2014.
 */

// Create global reference to the engine
var engine = new Karnage();

function Karnage() {
    this.game;
    this.gameMode = 0;

    this.music;

    this.arrowKeys;
    this.fireButton;
    this.stars;
    this.player;

    this.smokes;
    this.smokePuffs = [];

    this.puffTiming = 0;
    this.puffTime = 0;
    this.puffLifespan = 200;

    this.gravity = .91;

    this.stars = [];
    this.firedMissiles = [];


    this.level;
    this.stage;
    this.numberOfStages = 1;
    this.stageLoading = false;
    this.stageText = "";
    this.livesText;

    this.debug = true;

    this.start = function(){
        if(this.debug) console.log("Game Engine Start");

        var width = $('#canvas').width();
        var height = width * 3 / 4;

        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'canvas', {
            preload: this.preload(this),
            create: this.create(this),
            update: this.update(this)
        });
    };

    this.preload = function(engine) {
         return function () {

             if (engine.debug) console.log("Preload Phase Entered");

             engine.game.load.image('player', 'assets/Images/player.png');
             engine.game.load.image('enemyDrone', 'assets/Images/enemyDrone.png');
             engine.game.load.image('enemyStinger', 'assets/Images/enemyStinger.png');
             engine.game.load.spritesheet('explosion', 'assets/Images/explosionSprite.png', 64, 64, 25);
             engine.game.load.image('smoke', 'assets/Images/smoke.png')
             engine.game.load.image('laser', 'assets/Images/laser.png');
             engine.game.load.image('bullet', 'assets/Images/weapons/bullet.png');
             engine.game.load.image('enemyBullet', 'assets/Images/weapons/bullet.png');
             engine.game.load.image('missile', 'assets/Images/weapons/missile.png');
             engine.game.load.image('star', 'assets/Images/star.png');
             engine.game.load.spritesheet('powerUp', 'assets/Images/powerUpSprite.png', 42, 42, 90);
             engine.game.load.audio('bgmusic', ['assets/Music/bgmusic.mp3', 'assets/Music/bgmusic.ogg']);

             engine.game.load.image('mainMenuLogo', 'assets/Images/mainMenu/mainMenuLogo.png');
             engine.game.load.image('mainMenuPlayButton', 'assets/Images/mainMenu/mainMenuPlayButton.png');
             engine.game.load.image('mainMenuInstructionsButton', 'assets/Images/mainMenu/mainMenuInstructionsButton.png');
             engine.game.load.image('mainMenuInstructions', 'assets/Images/mainMenu/mainMenuInstructions.png');

             if (engine.debug) console.log("Preload Phase Finished");
         };
     }

    this.create = function(engine) {
         return function () {
             if (engine.debug) console.log("Create Phase Entered");
             //  Enable phaser's arcade physics and collision detection
             engine.game.physics.startSystem(Phaser.Physics.ARCADE);

             engine.music = this.add.audio('bgmusic');
             engine.music.volume = .2;
             //engine.music.play();


             // Smoke effects
             engine.smokes = engine.game.add.group();
             engine.smokes.enableBody = true;
             engine.smokes.physicsBodyType = Phaser.ARCADE;
             engine.smokes.createMultiple(30, 'smoke');
             engine.smokes.setAll('anchor.x', 0.5);
             engine.smokes.setAll('anchor.y', 1);
             engine.smokes.setAll('outOfBoundsKill', true);
             engine.smokes.setAll('checkWorldBounds', true);


             // Set arrow keys
             engine.arrowKeys = engine.game.input.keyboard.createCursorKeys();
             engine.fireButton = engine.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
             engine.weaponSwitch0 = engine.game.input.keyboard.addKey(Phaser.Keyboard.Q);
             engine.levelSwitch0 = engine.game.input.keyboard.addKey(Phaser.Keyboard.A);
             engine.weaponSwitch1 = engine.game.input.keyboard.addKey(Phaser.Keyboard.W);
             engine.levelSwitch1 = engine.game.input.keyboard.addKey(Phaser.Keyboard.S);
             engine.weaponSwitch2 = engine.game.input.keyboard.addKey(Phaser.Keyboard.E);
             engine.levelSwitch2 = engine.game.input.keyboard.addKey(Phaser.Keyboard.D);

             if (engine.debug) console.log("Create Phase Finished");
         }
     }

    this.update = function(engine) {
         return function () {
             //<editor-fold desc="Load Main Menu">
             if (engine.gameMode == 0) {

                 if (engine.debug) console.log("Loading Main Menu");

                 engine.player = new Player();
                 engine.player.initiate();

                 engine.stars = new Stars();
                 engine.stars.initiate(50, engine.player);

                 engine.mainMenu = new MainMenu();
                 engine.mainMenu.initiate();
                 engine.gameMode = 1;
             }
             //</editor-fold>

             //<editor-fold desc="Main Menu">
             // If Main Menu
             if (engine.gameMode == 1) {
                 engine.mainMenu.update();
             }
             //</editor-fold>

             //<editor-fold desc="Load Level">
             // If Loading Level
             if (engine.gameMode == 2) {
                 engine.stars.update(engine.player);
                 // If this is our first run through this function
                 if (!engine.stageLoading) {
                     // Mark the level as loading
                     engine.stageLoading = true;
                     // Move the player to the home position
                     engine.player.returnToHome();
                     // Display the title of the level we're moving to
                     engine.stageText = engine.game.add.text(engine.game.world.centerX, engine.game.world.centerY - 50, "Level " + engine.stage, {
                         font: "65px Arial",
                         fill: "#ff0044",
                         align: "center"
                     });
                     engine.stageText.anchor.setTo(0.5, 0.5);

                     // Create a new level object
                     engine.level = new Level();
                     // Initiate it and pass the player and level to load
                     engine.level.initiate(engine.player, engine.stage);
                     // Display the level title for three seconds and then
                     setTimeout(function () {
                         // Remove the text from the screen
                         engine.stageText.destroy();
                         // Start the level
                         engine.level.start(0);
                         // Display the players lives on the bottom left of the screen
                         engine.livesText = engine.game.add.text(10, engine.game.world.height - 20, "Lives: " + engine.player.lives, {
                             font: "14px Arial",
                             fill: "#ff0044",
                             align: "center"
                         });
                         engine.stageText.anchor.setTo(0.5, 0.5);
                         // Change to Playing game update loop
                         engine.gameMode = 3;
                         // Reset stage loading flag
                         engine.stageLoading = false;
                     }, 3000);
                 }
                 engine.player.update();
             }
             //</editor-fold>

             //<editor-fold desc="Game Mode">
             // IF PLAYING GAME
             if (engine.gameMode == 3) {
                 if (engine.player.lives < 0) {
                     engine.livesText.destroy();
                     engine.level.destroy();
                     engine.gameMode = 5;
                 } else {
                     engine.livesText.text = "Lives:" + engine.player.lives;
                 }

                 engine.stars.update(engine.player);
                 engine.player.update();
                 // Handle Input
                 if (engine.arrowKeys.up.isDown) {
                     engine.player.moveUp();
                 }
                 if (engine.arrowKeys.left.isDown) {
                     engine.player.moveLeft();
                 }
                 if (engine.arrowKeys.down.isDown) {
                     engine.player.moveDown();
                 }
                 if (engine.arrowKeys.right.isDown) {
                     engine.player.moveRight();
                 }

                 engine.level.update();


                 if (engine.weaponSwitch0.isDown) playerWeapon = 0;
                 if (engine.weaponSwitch1.isDown) playerWeapon = 1;
                 if (engine.weaponSwitch2.isDown) playerWeapon = 2;
                 if (engine.levelSwitch0.isDown) playerPowerUpLevel = 0;
                 if (engine.levelSwitch1.isDown) playerPowerUpLevel = 1;
                 if (engine.levelSwitch2.isDown) playerPowerUpLevel = 2;//player.animations.play('explode');


                 if (engine.fireButton.isDown) {
                     engine.player.fire();
                 }

                 if (engine.firedMissiles.length > 0)
                     for (m in engine.firedMissiles) {
                         if (engine.firedMissiles[m].body.y < 0) {
                             engine.firedMissiles.splice(m, 1);
                         }
                         else {
                             engine.firedMissiles[m].body.velocity.x += (Math.random() - .5) * (Math.random() * 200);
                         }
                     }


             }
             //</editor-fold>

             //<editor-fold desc="Level Complete">
             if (engine.gameMode == 4) {
                 engine.player.update();
                 if (!engine.stageLoading) {
                     engine.stageLoading = true;
                     engine.stageText = game.add.text(engine.game.world.centerX, engine.game.world.centerY - 50, "Level " + engine.stage + " Complete", {
                         font: "65px Arial",
                         fill: "#ff0044",
                         align: "center"
                     });
                     engine.stageText.anchor.setTo(0.5, 0.5);
                     setTimeout(function () {
                         engine.stageText.destroy();
                         engine.stageLoading = false;
                         if (engine.stage < engine.numberOfStages) {
                             engine.stage++
                             engine.gameMode = 2;
                         }
                         else {
                             engine.gameMode = 6;
                         }
                     }, 2000);
                 }
             }
             //</editor-fold>

             //<editor-fold desc="Game Over">
             if (engine.gameMode == 5) {
                 if (!engine.stageLoading) {
                     engine.level.destroy();
                     engine.stageLoading = true;
                     engine.stageText = game.add.text(engine.game.world.centerX, engine.game.world.centerY - 50, "Game Over", {
                         font: "65px Arial",
                         fill: "#ff0044",
                         align: "center"
                     });
                     engine.stageText.anchor.setTo(0.5, 0.5);
                     setTimeout(function () {
                         engine.stageText.destroy();
                         engine.stageLoading = false;
                         engine.gameMode = 0;
                     }, 2000);
                 }
             }
             //</editor-fold>

             //<editor-fold desc="Win">
             if (engine.gameMode == 6) {
                 if (!engine.stageLoading) {
                     engine.stageLoading = true;
                     engine.stageText = game.add.text(engine.game.world.centerX, engine.game.world.centerY - 50, "You Win! Enjoy your cake. - GlaDoze", {
                         font: "65px Arial",
                         fill: "#ff0044",
                         align: "center"
                     });
                     engine.stageText.anchor.setTo(0.5, 0.5);
                     setTimeout(function () {
                         engine.stageText.destroy();
                         engine.player.lives = 0;
                         engine.player.PhaserObj.kill();
                         engine.stageLoading = false;
                         engine.gameMode = 0;
                     }, 3000);
                 }
             }
             //</editor-fold>
         }
     }

    this.resizeGame = function() {
        if (this.game == null)
            return;

        var width = this.game.width = $('#canvas').width();
        var height = this.game.height = width * 3 / 4;

        this.world.setBounds(0, 0, width, height);
        //this.game.stage.bounds.width = width;
        //this.game.stage.bounds.height = height;

        this.game.camera.setSize(width, height);
        this.game.camera.setBoundsToWorld();

        if (this.game.renderType === Phaser.WEBGL) {
            this.game.renderer.resize(width, height);
        }
    }
};


