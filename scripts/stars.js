/**
 * Created by Matt on 12/6/2014.
 */
function Stars() {

    // Number of stars to display
    this.numberOfStars = 30;
    // Max range on star size
    this.maxStarSize = 3;
    // Base speed of all stars
    this.speed = 200;
    // Object that is the focus of the game
    this.focus = {};
    // Amount to speed up or slow down based on focus' speed
    this.speedDistortion = 6;


    // Initiate the star background
    this.initiate = function(numberOfStars, focus) {
        // If a specific number of stars was passed in use it, otherwise use set default
        this.numberOfStars = numberOfStars || this.numberOfStars;
        // If a focus was passed in assign it
        this.focus = focus;
        // Create x stars
        for (var x = 0; x < this.numberOfStars; x++) {
            // Create the phaser sprite with a random starting location
            engine.stars[x] = engine.game.add.sprite((Math.random() * engine.game.width), (Math.random() * engine.game.height), 'star');
            // Enable physics on the star
            engine.game.physics.enable(engine.stars[x], Phaser.Physics.ARCADE);
            // Set the width and height to a random number
            engine.stars[x].width = engine.stars[x].height = Math.random() * this.maxStarSize;
            // Set the velocity of the star and relate speed to size
            engine.stars[x].body.velocity.y = this.speed * (engine.stars[x].width / 2);
        }
    }

    // Update the stars
    this.update = function(){
        // For each star
        for (var x = 0; x < this.numberOfStars; x++) {

            // If there is a focus
            if (this.focus) {
                // If the focus is moving up faster than 200
                if (this.focus.PhaserObj.body.velocity.y < -200)
                    engine.stars[x].body.velocity.y = this.speed * (engine.stars[x].width / 2) - (this.focus.PhaserObj.body.velocity.y / this.speedDistortion);
                if (this.focus.PhaserObj.body.velocity.y > 200)
                    engine.stars[x].body.velocity.y = this.speed * (engine.stars[x].width / 2) + (this.focus.PhaserObj.body.velocity.y / this.speedDistortion);
            }

            // If the star is off the screen
            if (engine.stars[x].body.y > engine.game.height) {
                // Give it a random location
                engine.stars[x].body.x = Math.random() * engine.game.width;
                engine.stars[x].body.y = 0;
                // Set a random size and related speed
                engine.stars[x].width = engine.stars[x].height = Math.random() * 2;
                engine.stars[x].body.velocity.y = this.speed * (engine.stars[x].width / 2);
            }
        }
    }
}
