/**
 * Created by Matt on 12/6/2014.
 */
function MainMenu(){
    this.initiate = function(){
        // Create Main Menu
        this.Logo = engine.game.add.sprite(engine.game.world.centerX, engine.game.world.centerY /2 - 40, 'mainMenuLogo');
        this.Logo.width = engine.game.width * .75;
        this.Logo.height = engine.game.width * .25;
        this.Logo.anchor.setTo(0.5, 0.5);

        this.Instructions = engine.game.add.sprite(engine.game.world.centerX, engine.game.world.centerY /2 - 40, 'mainMenuInstructions');
        this.Instructions.width = engine.game.width * .50;
        this.Instructions.height = engine.game.width * .25;
        this.Instructions.anchor.setTo(0.5, 0.5);
        this.Instructions.visible = false;

        this.PlayButton = engine.game.add.sprite(engine.game.world.centerX, engine.game.world.centerY + 40, 'mainMenuPlayButton');
        this.PlayButton.anchor.setTo(0.5, 0.5);

        this.InstructionsButton = engine.game.add.sprite(engine.game.world.centerX, engine.game.world.centerY + 150, 'mainMenuInstructionsButton');
        this.InstructionsButton.anchor.setTo(0.5, 0.5);

        engine.player.PhaserObj.y = this.PlayButton.y;
    }

    this.update = function(){
        // Update the stars background
        engine.stars.update(engine.player);

        // Handle Input
        //////////////////////

        // Select Play
        if (engine.arrowKeys.up.isDown) {
            var tween = engine.game.add.tween(engine.player.PhaserObj);
            tween.to({y:  engine.mainMenu.PlayButton.y}, 200, Phaser.Easing.Circular.InOut);
            tween.start();
            this.Logo.visible = true;
            this.Instructions.visible = false;
        }
        // Select Instructions
        if (engine.arrowKeys.down.isDown) {
            var tween = engine.game.add.tween(engine.player.PhaserObj);
            tween.to({y:  engine.mainMenu.InstructionsButton.y}, 200, Phaser.Easing.Circular.InOut);
            tween.start();
            this.Instructions.visible = true;
            this.Logo.visible = false;
        }
        // Choose and option
        if (engine.fireButton.isDown) {
            engine.mainMenu.destroy();
            engine.gameMode = 2;
            engine.stage = 1;
        }

        // Update the afterburner on the player
        updateJetPuffs(engine.player);



    }

    this.destroy = function(){
        this.Logo.destroy();
        this.PlayButton.destroy();
        this.InstructionsButton.destroy();
    }
}