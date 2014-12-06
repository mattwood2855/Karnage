function update() {
    // If Main Menu
    if (gameMode == 0) {
        // Update Stars
        for (var x = 0; x < numberOfStars; x++) {
            if (stars[x].body.y > game.height)
                stars[x].body.y = -stars[x].height;
        }

        // Handle Input
        if (arrowKeys.up.isDown) {
            player.body.y = mainMenuPlay.y - 32;
        }
        if (arrowKeys.down.isDown) {
            player.body.y = mainMenuInstructions.y - 32;
        }

        //  Grab the first smoke we can from the pool
        var temp = smokes.getFirstExists(false);
        if (temp) {
            smokePuffs.push(temp);
            if (game.time.now > puffTime) {
                //  And fire it
                temp.reset(player.x, player.y + 32);
                temp.body.velocity.y = 100;
                temp.body.velocity.x = 100 * (Math.random() - 0.5);
                temp.lifespan = puffLifespan + (100* Math.random());
                temp.tint = 0x00FFFF;
            }
            puffTime = game.time.now + puffTiming;
        }
        smokePuffs.forEach(function (e, i) {
            if (e.lifespan < 440)
                e.tint = 0xFF0000;
            if (e.lifespan < 300)
                e.tint = 0xFFFF00;
            if (e.lifespan < 150)
                e.tint = 0xFFFFFF;
            e.body.velocity.y -= .25;
            if (e.body.velocity < 0)e.body.velocity = 0;
            if (!e.alive)
                smokePuffs.splice(i, 1);
        });


        if (fireButton.isDown) {
            gameMode = 1;
            level = 1;
        }

        if (mainMenuFadeOut) {
            mainMenuLogo.alpha -= .01;
        }


    } // If Loading Level
    else if (gameMode == 1) {

    }
    else if(gameMode == 2){


        // Update Stars
        for (var x = 0; x < numberOfStars; x++) {
            if (stars[x].body.y > game.height)
                stars[x].body.y = -stars[x].height;
        }

        // Handle Input
        if (arrowKeys.up.isDown) {
            player.body.velocity.y += -playerSpeed;
        }
        if (arrowKeys.left.isDown) {
            player.body.velocity.x += -playerSpeed;
        }
        if (arrowKeys.down.isDown) {
            player.body.velocity.y += playerSpeed;
        }
        if (arrowKeys.right.isDown) {
            player.body.velocity.x += playerSpeed;
        }

        if (weaponSwitch0.isDown) playerWeapon = 0;
        if (weaponSwitch1.isDown) playerWeapon = 1;
        if (weaponSwitch2.isDown) playerWeapon = 2;
        if (levelSwitch0.isDown) playerPowerUpLevel = 0;
        if (levelSwitch1.isDown) playerPowerUpLevel = 1;
        if (levelSwitch2.isDown) playerPowerUpLevel = 2;//player.animations.play('explode');


        if (fireButton.isDown) {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTime) {
                if (playerWeapon == 0) {
                    //  Grab the first laser we can from the pool
                    laser = lasers.getFirstExists(false);
                    if (laser) {
                        //  And fire it
                        laser.reset(player.x, player.y - 16);
                        laser.body.velocity.y = -350;
                        // Set the next bullet to be fired in 300 milliseconds
                        if (playerPowerUpLevel == 0) bulletTime = game.time.now + 400;
                        if (playerPowerUpLevel == 1) bulletTime = game.time.now + 175;
                        if (playerPowerUpLevel == 2) bulletTime = game.time.now + 75;
                    }
                }
                if (playerWeapon == 1) {
                    //  Grab the first bullet we can from the pool
                    bulletBlast = [];
                    var count = (.5 * (playerPowerUpLevel * playerPowerUpLevel)) + (.5 * playerPowerUpLevel) + 2;
                    for (var x = 0; x < count; x++) {
                        bulletBlast[x] = bullets.getFirstExists(false);
                        if (bulletBlast[x]) {
                            //  And fire it
                            bulletBlast[x].reset(player.x, player.y - 16);
                            bulletBlast[x].body.velocity.y = -450;
                            if (x == 0) bulletBlast[x].body.velocity.x = -40;
                            if (x == 1) bulletBlast[x].body.velocity.x = 40;
                            if (x == 3) bulletBlast[x].body.velocity.x = -100;
                            if (x == 4) bulletBlast[x].body.velocity.x = 100;

                        }
                    }
                    // Set the next bullet to be fired in 300 milliseconds
                    bulletTime = game.time.now + 200;
                }
                if (playerWeapon == 2) {
                    //  Grab the first missile we can from the pool
                    missile = missiles.getFirstExists(false);
                    if (missile) {
                        firedMissiles.push(missile);
                        //  And fire it
                        missile.reset(player.x, player.y - 16);
                        missile.body.velocity.y = -350;
                        // Set the next bullet to be fired in 300 milliseconds
                        if (playerPowerUpLevel == 0) bulletTime = game.time.now + 350;
                        if (playerPowerUpLevel == 1) bulletTime = game.time.now + 225;
                        if (playerPowerUpLevel == 2) bulletTime = game.time.now + 125;
                    }
                }

            }
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

        // Update Player velocity
        player.body.velocity.x *= gravity;
        player.body.velocity.y *= gravity;

        // Limit player to edges of screen
        if (player.body.x < -32) {
            player.body.x = -32;
        }

        if (player.body.x > (game.world.width - 32)) {
            player.body.x = (game.world.width - 32);
        }

        if (player.body.y < -32) {
            player.body.y = -32;
        }

        if (player.body.y > (game.world.height - 32)) {
            player.body.y = (game.world.height - 32);
        }
    }
}