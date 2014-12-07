/**
 * Created by Matt on 12/6/2014.
 */
function Stars() {

    this.initiate = function() {
        for (var x = 0; x < numberOfStars; x++) {
            stars[x] = game.add.sprite((Math.random() * game.width), (Math.random() * game.width), 'star');
            game.physics.enable(stars[x], Phaser.Physics.ARCADE);
            stars[x].width = stars[x].height = Math.random() * 3;
            stars[x].body.velocity.y = 200 * (stars[x].width / 2);
        }
    }

    this.update = function(focus){
        for (var x = 0; x < numberOfStars; x++) {
            if(focus.PhaserObj.body.velocity.y  < 200)
            stars[x].body.velocity.y = 200 * (stars[x].width / 2) - (focus.PhaserObj.body.velocity.y / 2);
            //if( stars[x].body.velocity.y < (100 * (stars[x].width / 2)) ) stars[x].body.velocity.y = 100 * (stars[x].width / 2);
            if (stars[x].body.y > game.height) {
                stars[x].body.x = Math.random() * game.width;
                stars[x].body.y = 0;
                stars[x].width = stars[x].height = Math.random() * 2;
                stars[x].body.velocity.y = 200 * (stars[x].width / 2);
            }
        }
    }
}
