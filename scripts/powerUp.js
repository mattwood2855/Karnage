/**
 * Created by Matt on 12/7/2014.
 */
function PowerUp(){

    this.initiated = false;

    this.initiate = function(x, y, direction, speed, target, life){
        this.direction = direction || 90;
        this.speed = speed || 2;
        this.target = target || engine.player;
        this.life = life || 5000;

        // Create the sprite at the given coordinates
        this.PhaserObj = engine.game.add.sprite(300, 300, 'powerUp');
        // Enable collision detection on the drone
        engine.game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
        this.PhaserObj.anchor.setTo(0.5, 0.5);
        this.PhaserObj.animations.add('shift');
        this.PhaserObj.animations.play('shift', 20, true);
        setTimeout(function(){
            if(this.PhaserObj)
                this.PhaserObj.destroy();
        }, life);
        this.initiated = true;
    }

    this.update = function(){
        if(!this.initiated)return;
        // Test the powerup against the target (Player)
        engine.game.physics.arcade.overlap(this.PhaserObj, this.target.PhaserObj, this.hit, null, this);

        this.PhaserObj.x = this.PhaserObj.x + Math.cos(this.direction * Math.PI / 180) * this.speed;
        this.PhaserObj.y = this.PhaserObj.y + Math.sin(this.direction * Math.PI / 180) * this.speed;

        if(this.PhaserObj.x < 5 || this.PhaserObj.x > engine.game.width - 5 ){
            this.direction = 180 - this.direction;
        }
        if(this.PhaserObj.y < 0 || this.PhaserObj.y > engine.game.height - 5 ){
            this.direction = 360 - this.direction;
        }
    }

    this.getCurrentPowerUp = function(){
        console.log(this.PhaserObj.animations.currentAnim.frame);
        if(this.PhaserObj.animations.currentAnim.frame <= 30){
            return 0;
        } else if( this.PhaserObj.animations.currentAnim.frame > 30 && this.PhaserObj.animations.currentAnim.frame <= 60){
            return 1;
        }else{
            return 2;
        }
    }

    this.hit = function(powerup, target){
        this.target.powerUp(this.getCurrentPowerUp());
        powerup.kill();
    };
}