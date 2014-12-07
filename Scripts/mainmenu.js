/**
 * Created by Matt on 12/6/2014.
 */
function MainMenu(){
    this.initiate = function(){
        // Create Main Menu
        this.Logo = game.add.sprite(game.world.centerX, game.world.centerY /2, 'mainMenuLogo');
        this.Logo.anchor.setTo(0.5, 0.5);
        this.PlayButton = game.add.sprite(game.world.centerX, game.world.centerY, 'mainMenuPlay');
        this.PlayButton.anchor.setTo(0.5, 0.5);
        this.InstructionsButton = game.add.sprite(game.world.centerX, game.world.centerY + 120, 'mainMenuInstructions');
        this.InstructionsButton.anchor.setTo(0.5, 0.5);
    }

    this.destroy = function(){
        this.Logo.destroy();
        this.PlayButton.destroy();
        this.InstructionsButton.destroy();
    }
}