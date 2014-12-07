/**
 * Created by Matt on 12/6/2014.
 */
function EnemyDrone(){

    // Holds the sprite/physics objects created by Phaser.
    this.PhaserObj = {};

    // Initiate the drone
    this.initiate = function(x, y, target, lEdge, rEdge, hSpeed, hAccel, vSpeed, movingRight){
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

        // Create the sprite at the given coordinates
        this.PhaserObj = game.add.sprite(x, y, 'enemyDrone');
        // Enable collision detection on the drone
        game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
        // Set the drones vertical speed
        this.PhaserObj.body.velocity.y = this.verticalSpeed;
    }

    // Accelarte the drone right (+) or left (-)
    this.moveSideways = function(amount){
        this.PhaserObj.body.velocity.x += amount;
    }

    // UPDATE LOOP FOR AN ENEMY DRONE
    this.update = function() {
        game.physics.arcade.overlap(this.PhaserObj, this.target.PhaserObj, this.hit, null, this);
        game.physics.arcade.overlap(this.PhaserObj, this.target.lasers, this.hit, null, this);
        game.physics.arcade.overlap(this.PhaserObj, this.target.bullets, this.hit, null, this);
        game.physics.arcade.overlap(this.PhaserObj, this.target.missiles, this.hit, null, this);
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
    }

    this.hit = function(drone, obj){
        this.explosion = game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
        this.explosion.anchor.setTo(0.5,0.5);
        this.explosion.animations.add('explode');
        this.explosion.animations.play('explode',20,false);
        this.explosion.killOnComplete = true;
        obj.kill();
        drone.kill();
    }
}
