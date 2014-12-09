function update() {

    //<editor-fold desc="Load Main Menu">
    // If Loading Main Menu
    if (gameMode == 0) {
        stars = new Stars();
        stars.initiate();
        player = new Player();
        player.initiate();
        mainMenu = new MainMenu();
        mainMenu.initiate();
        gameMode = 1;
    }
    //</editor-fold>

    //<editor-fold desc="Main Menu">
    // If Main Menu
    if (gameMode == 1) {

        stars.update(player);

        // Handle Input
        if (arrowKeys.up.isDown) {
            player.PhaserObj.body.y = mainMenu.PlayButton.y - 32;
        }
        if (arrowKeys.down.isDown) {
            player.PhaserObj.body.y = mainMenu.InstructionsButton.y - 32;
        }

        player.update();


        if (fireButton.isDown) {
            mainMenu.destroy();
            gameMode = 2;
            stage = 1;
        }

    }
    //</editor-fold>

    //<editor-fold desc="Load Level">
    // If Loading Level
    if (gameMode == 2) {
        // If this is our first run through this function
        if (!stageLoading) {
            // Mark the level as loading
            stageLoading = true;
            // Move the player to the home position
            player.returnToHome();
            // Display the title of the level we're moving to
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "Level " + stage, {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);

            // Create a new level object
            level = new Level();
            // Initiate it and pass the player and level to load
            level.initiate(player, stage);
            // Display the level title for three seconds and then
            setTimeout(function () {
                // Remove the text from the screen
                stageText.destroy();
                // Start the level
                level.start(0);
                // Display the players lives on the bottom left of the screen
                livesText = game.add.text(10, game.world.height - 20, "Lives: " + player.lives, {
                    font: "14px Arial",
                    fill: "#ff0044",
                    align: "center"
                });
                stageText.anchor.setTo(0.5, 0.5);
                // Change to Playing game update loop
                gameMode = 3;
                // Reset stage loading flag
                stageLoading = false;
            }, 3000);
        }
        player.update();
    }
    //</editor-fold>

    //<editor-fold desc="Game Mode">
    // IF PLAYING GAME
    if(gameMode == 3){
        if(player.lives < 0){
            livesText.destroy();
            level.destroy();
            gameMode = 5;
        }else {
            livesText.text = "Lives:" + player.lives;
        }

        stars.update(player);
        player.update();
        // Handle Input
        if (arrowKeys.up.isDown) {
            player.moveUp();
        }
        if (arrowKeys.left.isDown) {
            player.moveLeft();
        }
        if (arrowKeys.down.isDown) {
            player.moveDown();
        }
        if (arrowKeys.right.isDown) {
            player.moveRight();
        }

        level.update();



        if (weaponSwitch0.isDown) playerWeapon = 0;
        if (weaponSwitch1.isDown) playerWeapon = 1;
        if (weaponSwitch2.isDown) playerWeapon = 2;
        if (levelSwitch0.isDown) playerPowerUpLevel = 0;
        if (levelSwitch1.isDown) playerPowerUpLevel = 1;
        if (levelSwitch2.isDown) playerPowerUpLevel = 2;//player.animations.play('explode');


        if (fireButton.isDown) {
            player.fire();
        }

        if (firedMissiles.length > 0)
            for (m in firedMissiles) {
                if (firedMissiles[m].body.y < 0) {
                    firedMissiles.splice(m, 1);
                }
                else {
                    firedMissiles[m].body.velocity.x += (Math.random() - .5) * (Math.random() * 200);
                }
            }




    }
    //</editor-fold>

    //<editor-fold desc="Level Complete">
    if(gameMode == 4){
        player.update();
        if (!stageLoading) {
            stageLoading = true;
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "Level " + stage + " Complete", {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);
            setTimeout(function () {
                stageText.destroy();
                stageLoading = false;
                if(stage<numberOfStages) {
                    stage++
                    gameMode = 2;
                }
                else{
                    gameMode = 6;
                }
            }, 2000);
        }
    }
//</editor-fold>

    //<editor-fold desc="Game Over">
    if(gameMode == 5){
        if (!stageLoading) {
            level.destroy();
            stageLoading = true;
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "Game Over", {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);
            setTimeout(function () {
                stageText.destroy();
                stageLoading = false;
                gameMode = 0;
            }, 2000);
        }
    }
    //</editor-fold>

    //<editor-fold desc="Win">
    if(gameMode == 6){
        if (!stageLoading) {
            stageLoading = true;
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "You Win! Enjoy your cake. - GlaDoze", {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);
            setTimeout(function () {
                stageText.destroy();
                player.hit();
                player.PhaserObj.kill();
                stageLoading = false;
                gameMode = 0;
            }, 3000);
        }
    }
    //</editor-fold>
}