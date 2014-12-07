/**
 * Created by Matt on 12/6/2014.
 */
function Player(){

    this.lives = 0;
    this.playerSpeed = 45;
    this.playerPowerUpLevel = 0;
    //  Weapons
    // Laser
    this.lasers = game.add.group();
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(30, 'laser');
    this.lasers.setAll('anchor.x', 0.5);
    this.lasers.setAll('anchor.y', 1);
    this.lasers.setAll('outOfBoundsKill', true);
    this.lasers.setAll('checkWorldBounds', true);
    // Bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    // Homing missiles
    this.missiles = game.add.group();
    this.missiles.enableBody = true;
    this.missiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.missiles.createMultiple(30, 'missile');
    this.missiles.setAll('anchor.x', 0.5);
    this.missiles.setAll('anchor.y', 1);
    this.missiles.setAll('outOfBoundsKill', true);
    this.missiles.setAll('checkWorldBounds', true);

    this.initiate = function(){
        // Create Player
        this.PhaserObj = game.add.sprite(game.world.centerX-350, game.world.centerY, 'player');
        this.PhaserObj.width = 64;
        this.PhaserObj.height = 64;
        this.PhaserObj.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);

        this.PhaserObj.events.onKilled.add(this.hit, this);

        this.bulletTime = 0;
        this.playerWeapon = 0;
    }

    this.update = function(){

        // Update Player velocity
        this.PhaserObj.body.velocity.x *= gravity;
        this.PhaserObj.body.velocity.y *= gravity;

        updateJetPuffs(this);

        // Limit player to edges of screen
        if (this.PhaserObj.body.x < -(this.PhaserObj.width /2)) {
            this.PhaserObj.body.x = -(this.PhaserObj.width /2);
        }
        if (this.PhaserObj.body.x > (game.world.width - (this.PhaserObj.width /2))) {
            this.PhaserObj.body.x = (game.world.width - (this.PhaserObj.width /2));
        }
        if (this.PhaserObj.body.y < -(this.PhaserObj.height /2)) {
            this.PhaserObj.body.y = -(this.PhaserObj.height /2);
        }
        if (this.PhaserObj.body.y > (game.world.height - (this.PhaserObj.height /2))) {
            this.PhaserObj.body.y = (game.world.height - (this.PhaserObj.height /2));
        }
    }

    this.hit = function(){
        this.explosion = game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
        this.explosion.anchor.setTo(0.5,0.5);
        this.explosion.animations.add('explode').killOnComplete = true;
        this.explosion.animations.play('explode',20,false);

        this.lives--;

        if(this.lives < 0) return;
        this.PhaserObj.reset(game.world.width / 2, game.world.height + this.PhaserObj.height, 1);
        this.returnToHome();
    }

    this.fire = function(){
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > this.bulletTime) {
            if (this.playerWeapon == 0) {
                //  Grab the first laser we can from the pool
                this.laser = this.lasers.getFirstExists(false);
                if (this.laser) {
                    //  And fire it
                    this.laser.reset(this.PhaserObj.x, this.PhaserObj.y - 28);
                    this.laser.body.velocity.y = -350;
                    // Set the next bullet to be fired in 300 milliseconds
                    if (this.playerPowerUpLevel == 0) this.bulletTime = game.time.now + 400;
                    if (this.playerPowerUpLevel == 1) this.bulletTime = game.time.now + 175;
                    if (this.playerPowerUpLevel == 2) this.bulletTime = game.time.now + 75;
                }
            }
            if (this.playerWeapon == 1) {
                //  Grab the first bullet we can from the pool
                this.bulletBlast = [];
                var count = (.5 * (this.playerPowerUpLevel * this.playerPowerUpLevel)) + (.5 * this.playerPowerUpLevel) + 2;
                for (var x = 0; x < count; x++) {
                    this.bulletBlast[x] = this.bullets.getFirstExists(false);
                    if (this.bulletBlast[x]) {
                        //  And fire it
                        this.bulletBlast[x].reset(player.x, player.y - 16);
                        this.bulletBlast[x].body.velocity.y = -450;
                        if (x == 0) this.bulletBlast[x].body.velocity.x = -40;
                        if (x == 1) this.bulletBlast[x].body.velocity.x = 40;
                        if (x == 3) this.bulletBlast[x].body.velocity.x = -100;
                        if (x == 4) this.bulletBlast[x].body.velocity.x = 100;

                    }
                }
                // Set the next bullet to be fired in 300 milliseconds
                this.bulletTime = game.time.now + 200;
            }
            if (this.playerWeapon == 2) {
                //  Grab the first missile we can from the pool
                this.missile = this.missiles.getFirstExists(false);
                if (this.missile) {
                    this.firedMissiles.push(this.missile);
                    //  And fire it
                    this.missile.reset(player.x, player.y - 16);
                    this.missile.body.velocity.y = -350;
                    // Set the next bullet to be fired in 300 milliseconds
                    if (this.playerPowerUpLevel == 0) this.bulletTime = game.time.now + 350;
                    if (this.playerPowerUpLevel == 1) this.bulletTime = game.time.now + 225;
                    if (this.playerPowerUpLevel == 2) this.bulletTime = game.time.now + 125;
                }
            }

        }
    }

    this.returnToHome = function(){
        var tween = game.add.tween(this.PhaserObj);
        tween.to({x: game.width/2, y: game.height * .80}, 1000);
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

}