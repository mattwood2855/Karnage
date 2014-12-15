/**
 * Created by Matt on 12/14/2014.
 */
function EnemyStinger() {

    //<editor-fold desc="Variables">

    // Bullets
    this.bullets = engine.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(4, 'enemyBullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bulletTime = 0;
    this.bulletSpeed = 200;

    // Explosions
    this.explosions = [];

    // Afterburner smoke
    this.emitter = engine.game.add.emitter(-36, 0, 50);
    this.emitter.makeParticles('smoke');
    this.emitter.lifespan = 200;
    this.emitter.minParticleSpeed = new Phaser.Point(-200, -50);
    this.emitter.maxParticleSpeed = new Phaser.Point(-100, 50);


    //</editor-fold>

    //<editor-fold desc="Initiate">
    this.initiate = function (data) {

        // Drone default settings (if parameter is undefined, default is used)
        this.x = data.x || 0;
        this.y = data.y || -32;
        this.target = data.target;
        this.speed = data.speed || 50;
        this.burstSpeed = data.burstSpeed || 300;
        this.burstDelay = data.burstDelay || 2000;

        // Create the sprite at the given coordinates
        this.PhaserObj = engine.game.add.sprite(this.x, this.y, 'enemyStinger');
        this.PhaserObj.width = 54;
        this.PhaserObj.height = 54;
        this.PhaserObj.anchor.setTo(0.5, 0.5);
        this.PhaserObj.addChild(this.emitter);
        // Rotate the stinger to face the bottom of the screen
        this.PhaserObj.rotation = 90 * Math.PI / 180;
        // Enable collision detection on the drone
        engine.game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);

        // Set the drones vertical speed
        this.PhaserObj.body.velocity.y = this.speed;

        // This function allows you to see God.
        this.initiateStingerTimeoutHandler = function(self){
            // By returning a function with the parameters in the scope of this function we allow ourselves to set this function in a time out and keep its original reference
            return function () {
                self.PhaserObj.body.velocity.y = self.burstSpeed;
                self.emitter.lifespan = 600;
                self.initiated = true;
            }
        }

        // Float in then hit the afterburners
        setTimeout(this.initiateStingerTimeoutHandler(this), this.burstDelay );
    }
    //</editor-fold>

    //<editor-fold desc="Update">
    this.update = function() {

        // Emit a smoke puff
        this.emitter.emitParticle();

        // If the enemy has entered burst mode
        if(this.initiated) {

            // Test the stinger against the target (Player)
            engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.PhaserObj, this.hit, null, this);
            // Test the drone against the players weapons
            engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.lasers, this.hit, null, this);
            engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.bullets, this.hit, null, this);
            engine.game.physics.arcade.overlap(this.PhaserObj, engine.player.missiles, this.hit, null, this);
            // Test my bullets against my target
            engine.game.physics.arcade.overlap(this.bullets, engine.player.PhaserObj, this.bulletHit, null, this);

            // If I'm passed the bottom of the screen
            if (this.PhaserObj.body.y > engine.game.height) {
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
                // Kill myself
                this.PhaserObj.kill();
            }

            // If the target is to the side of me
            if (Math.abs(this.PhaserObj.y - engine.player.PhaserObj.y) < 15) {
                //  If I am ready to fire
                if (engine.game.time.now > this.bulletTime) {
                    this.bulletBlast = [];
                    // Create 4 bullets (two on each side)
                    for (var x = 0; x < 4; x++) {
                        // Grab the first bullet in the pool
                        this.bulletBlast[x] = this.bullets.getFirstExists(false);
                        //  And fire it
                        if (this.bulletBlast[x]) {
                            // Determine its position and direction
                            if (x == 0){
                                this.bulletBlast[x].reset(this.PhaserObj.x + 27, this.PhaserObj.y);
                                this.bulletBlast[x].body.velocity.x = this.bulletSpeed;
                            }
                            if (x == 1){
                                this.bulletBlast[x].reset(this.PhaserObj.x + 27, this.PhaserObj.y + 10);
                                this.bulletBlast[x].body.velocity.x = this.bulletSpeed;
                            }
                            if (x == 2){
                                this.bulletBlast[x].reset(this.PhaserObj.x - 27, this.PhaserObj.y);
                                this.bulletBlast[x].body.velocity.x = -this.bulletSpeed;
                            }
                            if (x == 3){
                                this.bulletBlast[x].reset(this.PhaserObj.x - 27, this.PhaserObj.y + 10);
                                this.bulletBlast[x].body.velocity.x = -this.bulletSpeed;
                            }
                        }
                    }
                    // Set timeout on ability to fire
                    this.bulletTime = engine.game.time.now + this.reloadSpeed;
                }
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
    this.hit = function(stinger, obj){

        // Show an explosion immediately
        this.explosions[0] = engine.game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
        this.explosions[0].anchor.setTo(0.5, 0.5);
        this.explosions[0].animations.add('explode');
        this.explosions[0].animations.play('explode', 20, false).killOnComplete = true;

        /*/ Show an explosion immediately
        setTimeout(function(){
            this.explosions[1] = game.add.sprite(this.PhaserObj.body.x + this.PhaserObj.width / 2, this.PhaserObj.body.y + this.PhaserObj.height / 2, 'explosion');
            this.explosions[1].anchor.setTo(0.5, 0.5);
            this.explosions[1].animations.add('explode');
            this.explosions[1].animations.play('explode', 20, false).killOnComplete = true;
            }, 1000);*/

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
        stinger.kill();
    }
    //</editor-fold>
}