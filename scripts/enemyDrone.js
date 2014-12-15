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
    this.bullets = engine.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(10, 'enemyBullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    // Explosions
    this.explosions = [];

    //</editor-fold>

    //<editor-fold desc="Initiate">
    // Initiate the drone
    this.initiate = function(data){  //x, y, target, lEdge, rEdge, hSpeed, hAccel, vSpeed, movingRight, bulletSpeed, reloadSpeed){
        // Drone default settings (if parameter is undefined, default is used)
        this.x = data.x || 0;
        this.y = data.y || -32;
        this.target                 = data.target;
        this.leftEdge               = data.lEdge       || engine.game.width * .2;
        this.rightEdge              = data.rEdge       || engine.game.width * .8;
        this.horizontalMaxSpeed     = data.hSpeed      || 300;
        this.horizontalAcceleration = data.hAccel      || 5;
        this.verticalSpeed          = data.vSpeed      || 30;
        this.movingRight            = data.movingRight || true;
        this.bulletSpeed            = data.bulletSpeed || 300;
        this.reloadSpeed            = data.reloadSpeed || 750;

        // Create the sprite at the given coordinates
        this.PhaserObj = engine.game.add.sprite(this.x, this.y, 'enemyDrone');
        this.PhaserObj.rotation = 90*Math.PI/180;
        // Enable collision detection on the drone
        engine.game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
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
        engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.PhaserObj, this.hit, null, this);
        // Test the drone against the players weapons
        engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.lasers, this.hit, null, this);
        engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.bullets, this.hit, null, this);
        engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.missiles, this.hit, null, this);
        // Test my bullets against my target
        engine.game.physics.arcade.overlap(this.bullets, engine.player.PhaserObj, this.bulletHit, null, this);

        // If I'm passed the bottom of the screen
        if (this.PhaserObj.body.y > engine.game.height) {
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
        if(Math.abs(this.PhaserObj.x - engine.player.PhaserObj.x) < 15 && this.PhaserObj.y < engine.player.PhaserObj.y){
            //  If I am ready to fire
            if (engine.game.time.now > this.bulletTime) {
                // Grab the first bullet in the pool
                this.bullet = this.bullets.getFirstExists(false);
                // If a bullet was available
                if (this.bullet) {
                    //  Fire it
                    this.bullet.reset(this.PhaserObj.x, this.PhaserObj.y + 28);
                    this.bullet.body.velocity.y = this.bulletSpeed;
                }
                // Set timeout on ability to fire
                this.bulletTime = engine.game.time.now + this.reloadSpeed;
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
        this.explosions[0] = engine.game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
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
            engine.level.strayWeapons.add(bullet, true);
        })

        // Kill the drone and whatever I collided with
        obj.kill();
        drone.kill();
    }
    //</editor-fold>

}
