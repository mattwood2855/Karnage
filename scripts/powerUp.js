/**
 * Created by Matt on 12/7/2014.
 */
function PowerUp(){

    this.initiate = function(x, y, direction, speed, target){

        this.direction = direction || 90;
        this.speed = speed || 2;
        this.target = target || player;


        // Create the sprite at the given coordinates
        this.PhaserObj = game.add.sprite(300, 300, 'powerUp');
        // Enable collision detection on the drone
        game.physics.enable(this.PhaserObj, Phaser.Physics.ARCADE);
        this.PhaserObj.anchor.setTo(0.5, 0.5);
        this.PhaserObj.animations.add('shift');
        this.PhaserObj.animations.play('shift', 20, true);
        this.initiated = true;
    }

    this.update = function(){
        if(!this.initiated)return;
        // Test the powerup against the target (Player)
        game.physics.arcade.overlap(this.PhaserObj, this.target.PhaserObj, this.hit, null, this);

        this.PhaserObj.x = this.PhaserObj.x + Math.cos(this.direction * Math.PI / 180) * this.speed;
        this.PhaserObj.y = this.PhaserObj.y + Math.sin(this.direction * Math.PI / 180) * this.speed;

        if(this.PhaserObj.x < 5 || this.PhaserObj.x > game.width - 5 ){
            this.direction = 180 - this.direction;
        }
        if(this.PhaserObj.y < 0 || this.PhaserObj.y > game.height - 5 ){
            this.direction = 360 - this.direction;
        }
    }

    this.hit = function(powerup, target){
        powerup.kill();
        this.target.powerUp(0);
    };
}