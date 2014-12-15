/**
 * Created by Matt on 12/13/2014.
 */
function Missile(PhaserObj, targets, targetSpeed, delay){

    this.PhaserObj = PhaserObj;
    this.PhaserObj.body.drag.setTo(200,200);
    this.targets = targets || [];
    this.speed = 0;
    this.targetSpeed = targetSpeed || 300;
    this.delay = delay || 500;
    this.initiated = false;

    this.emitter = engine.game.add.emitter(-10, -3, 50);
    this.emitter.makeParticles('smoke');
    this.emitter.lifespan = 200;
    this.emitter.minParticleSpeed = new Phaser.Point(-200, -50);
    this.emitter.maxParticleSpeed = new Phaser.Point(-100, 50);
    this.PhaserObj.addChild(this.emitter);

    // This function allows you to see God.
    this.initiateMissileTimeoutHandler = function(self){
        // By returning a function with the parameters in the scope of this function we allow ourselves to set this function in a time out and keep its original reference
        return function () {
            self.PhaserObj.body.velocity.setTo(0,0);
            self.initiated = true;
        }
    }

    // Ignite the rocket after the delay amount
    setTimeout(this.initiateMissileTimeoutHandler(this), delay);

    this.update = function(){
        // If there are enemies in the targets array
        if (this.targets.length > 0) {
            // Set the closest enemy as the first target
            var closestTarget = this.targets[0];
            // Compare to find the closest target
            for (var x = 1; x < this.targets.length; x++) {
                // If an enemy is closer than the current marked target
                if(engine.game.physics.arcade.distanceBetween(this.PhaserObj, this.targets[x].type.PhaserObj) < engine.game.physics.arcade.distanceBetween(this.PhaserObj, closestTarget.type.PhaserObj)){
                    // Set the new closest target
                    closestTarget = this.targets[x];
                }
            }
            // Turn towards the nearest enemy
            if(engine.game.physics.arcade.angleBetween(this.PhaserObj, closestTarget.type.PhaserObj) > this.PhaserObj.rotation)
                this.PhaserObj.rotation +=.02;
            else
                this.PhaserObj.rotation -=.02;
        }

        // If the rocket has started firing
        if(this.initiated) {
            // Accelerate
            engine.game.physics.arcade.accelerationFromRotation(this.PhaserObj.rotation, this.speed, this.PhaserObj.body.acceleration);
            // Emit a smoke puff
            this.emitter.emitParticle();
            // Increase our acceleration speed if we haven't met the target
            if(this.speed < this.targetSpeed) this.speed+=10;
            // If the rocket is off the top of the screen
            if(this.PhaserObj.y < 0)
                // Kill it
                this.PhaserObj.kill();
        }
    }
}