/**
 * Created by Matt on 12/6/2014.
 *
 * The drone is a simple enemy that sweeps left to right while moving down the screen.
 * The drone will fire whenever the player crosses its path
 */

function EnemyDrone(){

    //<editor-fold desc="Variables">
    // Holds the sprite/physics objects created by Phaser.
    this.PhaserObj = {};
    // Bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(10, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    // Explosions
    this.explosions = [];

    //</editor-fold>

    //<editor-fold desc="Initiate">
    // Initiate the drone
    this.initiate = function(x, y, target, lEdge, rEdge, hSpeed, hAccel, vSpeed, movingRight, bulletSpeed, reloadSpeed){
        // Drone default settings (if parameter is undefined, default is used)
        x                           = typeof x           !== 'undefined' ? x           : 0;
        y                           = typeof y           !== 'undefined' ? y           : -32;
        this.target                 = target;
        this.leftEdge               = typeof lEdge       !== 'undefined' ? lEdge       : game.width * .2;
        this.rightEdge              = typeof rEdge       !== 'undefined' ? rEdge       : game.width * .8;
        this.horizontalMaxSpeed     = typeof hSpeed      !== 'undefined' ? hSpeed      : 300;
        this.horizontalAcceleration = typeof hAccel      !== 'undefined' ? hAccel      : 5;
        this.verticalSpeed          = typeof vSpeed      !== 'undefined' ? vSpeed      : 30;
        this.movingRight            = typeof movingRight !== 'undefined' ? movingRight : true;
        this.bulletSpeed            = typeof bulletSpeed !== 'undefined' ? bulletSpeed : 300;
        this.reloadSpeed            = typeof reloadSpeed !== 'undefined' ? reloadSpeed : 750;

        // Create the sprite at the given coordinates
        this.PhaserObj = game.add.sprite(x, y, 'enemyDrone');
        // Enable collision detection on the drone
        game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
        // Add on kill event
        //this.PhaserObj.events.onKilled.add(this.hit, this);
        // Set the drones vertical speed
        this.PhaserObj.body.velocity.y = this.verticalSpeed;
        // Set bullet time
        this.bulletTime = 0;
        this.initiated = true;
    }
    //</editor-fold>

    //<editor-fold desc="Movement">
    // Accelarte the drone right (+) or left (-)
    this.moveSideways = function(amount){
        this.PhaserObj.body.velocity.x += amount;
    }
    //</editor-fold">

    //<editor-fold desc="Update">
    // UPDATE LOOP FOR AN ENEMY DRONE
    this.update = function() {
        if(!this.initiated) return;
        // Test the drone against the target (Player)
        game.physics.arcade.overlap(this.PhaserObj, player.PhaserObj, this.hit, null, this);
        // Test the drone against the players weapons
        game.physics.arcade.overlap(this.PhaserObj,player.lasers, this.hit, null, this);
        game.physics.arcade.overlap(this.PhaserObj, player.bullets, this.hit, null, this);
        game.physics.arcade.overlap(this.PhaserObj, player.missiles, this.hit, null, this);
        // Test my bullets against my target
        game.physics.arcade.overlap(this.bullets, player.PhaserObj, this.bulletHit, null, this);

        // If I'm passed the bottom of the screen
        if (this.PhaserObj.body.y > game.height) {
            // Kill myself
            this.PhaserObj.exists = false;
        }

        // If im moving right
        if (this.movingRight) {
            // Accelerate right if im not at max speed
            if(this.PhaserObj.body.velocity.x < this.horizontalMaxSpeed) this.moveSideways(this.horizontalAcceleration);
        }else{ // If im moving left
            // Accelerate left if im not at max speed
            if(this.PhaserObj.body.velocity.x > -this.horizontalMaxSpeed) this.moveSideways(-this.horizontalAcceleration);
        }

        // If im at my right boundary
        if (this.PhaserObj.body.x > this.rightEdge) {
            // Start moving left
            this.movingRight = false;
        }
        // If im at my left boundary start moving right{
        if(this.PhaserObj.body.x < this.leftEdge){
            // Start moving right
            this.movingRight = true;
        }

        // If the target is in front of me
        if(Math.abs(this.PhaserObj.x - player.PhaserObj.x) < 15 && this.PhaserObj.y < player.PhaserObj.y){
            //  If I am ready to fire
            if (game.time.now > this.bulletTime) {
                // Grab the first bullet in the pool
                this.bullet = this.bullets.getFirstExists(false);
                // If a bullet was available
                if (this.bullet) {
                    //  Fire it
                    this.bullet.reset(this.PhaserObj.x, this.PhaserObj.y + 28);
                    this.bullet.body.velocity.y = this.bulletSpeed;
                }
                // Set timeout on ability to fire
                this.bulletTime = game.time.now + this.reloadSpeed;
            }
        }
    }
    //</editor-fold>

    //<editor-fold desc="Bullet Hit">
    // If my bullet hits my target
    this.bulletHit = function(target, bullet){
        // Destroy the target and destroy the bullet.
        target.kill();
        bullet.kill();
    }
    //</editor-fold>

    //<editor-fold desc="Hit">
    // If I collide with the target or the target's weapons
    this.hit = function(drone, obj){

        // Show an explosion immediately
        this.explosions[0] = game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
        this.explosions[0].anchor.setTo(0.5, 0.5);
        this.explosions[0].animations.add('explode');
        this.explosions[0].animations.play('explode', 20, false).killOnComplete = true;

        // Create an array to hold my bullets that are still active
        var remainingBullets = [];
        // For each bullet in the group that is alive
        this.bullets.forEachAlive(function(bullet){
            // Add it to the array
            remainingBullets.push(bullet);
        }, this, null);
        // For each of the alive bullets
        remainingBullets.forEach( function(bullet){
            // Push the bullet into the levels bullet handler to be handled after my death
            level.strayWeapons.add(bullet, true);
        })

        // Kill the drone and whatever I collided with
        obj.kill();
        drone.kill();
    }
    //</editor-fold>

}
