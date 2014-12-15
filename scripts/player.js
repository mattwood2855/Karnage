/**
 * Created by Matt on 12/6/2014.
 */
function Player(){

    this.lives = 1;
    this.playerSpeed = 45;
    this.powerUpLevel = 0;
    this.firedMissiles = [];
    this.fireMissileLeft = true;
    this.PhaserObj = {};

    //  Weapons
    // Laser
    this.lasers = engine.game.add.group();
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(30, 'laser');
    this.lasers.setAll('anchor.x', 0.5);
    this.lasers.setAll('anchor.y', 1);
    this.lasers.setAll('outOfBoundsKill', true);
    this.lasers.setAll('checkWorldBounds', true);
    // Bullets
    this.bullets = engine.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    // Homing missiles
    this.missiles = engine.game.add.group();
    this.missiles.enableBody = true;
    this.missiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.missiles.createMultiple(10, 'missile');
    this.missiles.setAll('anchor.x', 0.5);
    this.missiles.setAll('anchor.y', 1);
    this.missiles.setAll('checkWorldBounds', true);

    this.initiate = function(){
        // Create Player
        this.PhaserObj = engine.game.add.sprite(engine.game.world.centerX-350, engine.game.world.centerY, 'player');
        //this.PhaserObj.rotation = -90 * Math.PI / 180;
        this.PhaserObj.width = 64;
        this.PhaserObj.height = 64;
        this.PhaserObj.anchor.setTo(0.5, 0.5);
        engine.game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
        // Rotate the player 90 degrees to face up
        this.PhaserObj.rotation = -90*Math.PI/180;
        this.PhaserObj.events.onKilled.add(this.takeDamage, this);

        this.bulletTime = 0;
        this.playerWeapon = 2;
    }

    this.updateMissiles = function(){

    }

    this.update = function(){

        // Update Player velocity
        this.PhaserObj.body.velocity.x *= engine.gravity;
        this.PhaserObj.body.velocity.y *= engine.gravity;

        updateJetPuffs(this);
        if(this.firedMissiles.length > 0) {
            for( var x = 0; x < this.firedMissiles.length; x++) {
                if(this.firedMissiles[x].PhaserObj.alive)
                    this.firedMissiles[x].update();
                else
                    this.firedMissiles.splice(x,1);
            }
        };

        // Limit player to edges of screen
        if (this.PhaserObj.body.x < -(this.PhaserObj.width /2)) {
            this.PhaserObj.body.x = -(this.PhaserObj.width /2);
        }
        if (this.PhaserObj.body.x > (engine.game.world.width - (this.PhaserObj.width /2))) {
            this.PhaserObj.body.x = (engine.game.world.width - (this.PhaserObj.width /2));
        }
        if (this.PhaserObj.body.y < -(this.PhaserObj.height /2)) {
            this.PhaserObj.body.y = -(this.PhaserObj.height /2);
        }
        if (this.PhaserObj.body.y > (engine.game.world.height - (this.PhaserObj.height /2))) {
            this.PhaserObj.body.y = (engine.game.world.height - (this.PhaserObj.height /2));
        }
    }

    this.takeDamage = function(){
        this.explosion = engine.game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
        this.explosion.anchor.setTo(0.5,0.5);
        this.explosion.animations.add('explode').killOnComplete = true;
        this.explosion.animations.play('explode',20,false);

        this.lives--;

        if(this.lives < 0) {
            return;
        }
        this.PhaserObj.reset(engine.game.world.width / 2, engine.game.world.height + this.PhaserObj.height, 1);
        this.returnToHome();
    }

    this.fire = function(){
        //  To avoid them being allowed to fire too fast we set a time limit
        if (engine.game.time.now > this.bulletTime) {
            if (this.playerWeapon == 0) {
                //  Grab the first laser we can from the pool
                this.laser = this.lasers.getFirstExists(false);
                if (this.laser) {
                    //  And fire it
                    this.laser.reset(this.PhaserObj.x, this.PhaserObj.y - 28);
                    this.laser.body.velocity.y = -350;
                    // Set the next bullet to be fired in 300 milliseconds
                    if (this.powerUpLevel == 0) this.bulletTime = engine.game.time.now + 400;
                    if (this.powerUpLevel == 1) this.bulletTime = engine.game.time.now + 200;
                    if (this.powerUpLevel == 2) this.bulletTime = engine.game.time.now + 100;
                }
            }
            if (this.playerWeapon == 1) {
                //  Grab the first bullet we can from the pool
                this.bulletBlast = [];
                var count = (.5 * (this.powerUpLevel * this.powerUpLevel)) + (.5 * this.powerUpLevel) + 2;
                for (var x = 0; x < count; x++) {
                    this.bulletBlast[x] = this.bullets.getFirstExists(false);
                    if (this.bulletBlast[x]) {
                        //  And fire it
                        this.bulletBlast[x].reset(this.PhaserObj.x, this.PhaserObj.y - 16);
                        this.bulletBlast[x].body.velocity.y = -450;
                        if (x == 0) this.bulletBlast[x].body.velocity.x = -40;
                        if (x == 1) this.bulletBlast[x].body.velocity.x = 40;
                        if (x == 3) this.bulletBlast[x].body.velocity.x = -100;
                        if (x == 4) this.bulletBlast[x].body.velocity.x = 100;

                    }
                }
                // Set the next bullet to be fired in 300 milliseconds
                this.bulletTime = engine.game.time.now + 200;
            }
            if (this.playerWeapon == 2) {
                //  Grab the first laser we can from the pool
                this.missile = this.missiles.getFirstExists(false);
                // If a missile is available
                if (this.missile) {

                    // Launch it from a missile port
                    if(this.fireMissileLeft){
                        //  Reset the missile
                        this.missile.reset(this.PhaserObj.x-24, this.PhaserObj.y);
                        this.missile.body.velocity.x = -100;

                    }else{
                        //  Reset the missile
                        this.missile.reset(this.PhaserObj.x+24, this.PhaserObj.y);
                        this.missile.body.velocity.x = 100;
                    }
                    // Make the bullet going the same way as the player
                    this.missile.rotation = this.PhaserObj.rotation;
                    this.missile.body.velocity.y = 100;
                    this.fireMissileLeft = !this.fireMissileLeft;
                    this.firedMissiles.push(new Missile(this.missile, engine.level.currentPhase, 600, 500));

                    // Set the next bullet to be fired
                    if (this.powerUpLevel == 0) this.bulletTime = engine.game.time.now + 500;
                    if (this.powerUpLevel == 1) this.bulletTime = engine.game.time.now + 350;
                    if (this.powerUpLevel == 2) this.bulletTime = engine.game.time.now + 200;
                }
            }
        }
    }

    this.returnToHome = function(){
        var tween = engine.game.add.tween(this.PhaserObj);
        tween.to({x: engine.game.width/2, y: engine.game.height * .80}, 1000);
        tween.start();
    }

    this.moveUp = function(){
        this.PhaserObj.body.velocity.y += -this.playerSpeed;
    }
    this.moveDown = function(){
        this.PhaserObj.body.velocity.y += this.playerSpeed;
    }
    this.moveLeft = function(){
        this.PhaserObj.body.velocity.x += -this.playerSpeed;
    }
    this.moveRight = function(){
        this.PhaserObj.body.velocity.x += this.playerSpeed;
    }

    this.powerUp = function(pUp){
        if(this.playerWeapon == pUp) {
            if (this.powerUpLevel < 2)
                this.powerUpLevel++;
        }
        else{
            this.powerUpLevel = 0;
            this.playerWeapon = pUp;
        }
    }
}