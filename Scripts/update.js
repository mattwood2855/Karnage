


function update() {


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


    // If Loading Level
    if (gameMode == 2) {
        if (!stageLoading) {
            stageLoading = true;
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "Level " + stage, {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);
            level = new Level();
            level.initiate();
            player.returnToHome();
            setTimeout(function () {
                stageLoading = false;
                stageText.destroy();
                level.start(0);
                gameMode = 3;
            }, 2000);
        }
    }



    // IF PLAYING GAME
    if(gameMode == 3){
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

    if(gameMode == 4){
        if (!stageLoading) {
            stageLoading = true;
            stageText = game.add.text(game.world.centerX, game.world.centerY - 50, "Level " + stage + " Complete", {
                font: "65px Arial",
                fill: "#ff0044",
                align: "center"
            });
            stageText.anchor.setTo(0.5, 0.5);
            player.returnToHome();
            setTimeout(function () {
                stageText.destroy();
                stageLoading = false;
                gameMode = 2;
            }, 2000);
        }
    }
}