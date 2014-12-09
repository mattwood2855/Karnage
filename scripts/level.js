/**
 * Created by Matt on 12/6/2014.
 */
function Level(){
    this.enemyList = [];
    this.currentPhase = [];
    this.currentPowerUps = [];
    this.currentPhaseNumber = 0;
    this.powerUps = [];
    this.player = {};
    this.initiated = false;

    // Level controlled bullets
    this.strayWeapons = game.add.group();
    this.strayWeapons.enableBody = true;
    this.strayWeapons.physicsBodyType = Phaser.Physics.ARCADE;
    this.strayWeapons.setAll('anchor.x', 0.5);
    this.strayWeapons.setAll('anchor.y', 0.5);
    this.strayWeapons.setAll('outOfBoundsKill', true);
    this.strayWeapons.setAll('checkWorldBounds', true);


    // Initiate the Level object
    this.initiate = function(player, level) {
        console.log('level.initiate()');
        // Create a level scope reference to the player
        this.player = player;
        // Create a reference in scope of the AJAX call so that the promise (success) can access
        var levelRef = this;
        // Perform a GET to grab the level we are on
        $.ajax({
            url: "levels/level" + level + ".json",
            dataType: 'json',
            success: function (data) {


                if(data.enemies) {
                    // For each item in the enemies list
                    data.enemies.forEach(function (e) {
                        var enemyType = {};
                        // If the enemy type is 0 then it's a Drone
                        if (e.type == 0) {
                            enemyType = new EnemyDrone();
                        }
                        // Push the enemy into the level's enemyList
                        levelRef.enemyList.push({
                            phase: e.phase,
                            type: enemyType,
                            x: e.x,
                            y: e.y,
                            target: levelRef.player,
                            delay: e.delay
                        });
                    });
                }


                // For each power up
                if(data.powerUps) {
                    data.powerUps.forEach(function (e) {
                        // Push the powerup into the level's powerUp list
                        levelRef.powerUps.push({
                            phase: e.phase,
                            type: new PowerUp(),
                            x: e.x,
                            y: e.y,
                            direction: e.direction,
                            speed: e.speed,
                            target: levelRef.player,
                            delay: e.delay
                        });
                    })
                }

                this.initiated = true;
                console.log('level.initiate() Complete');
                console.log('->Enemies', levelRef.enemyList);
                console.log('->PowerUps', levelRef.powerUps);
            },
            error: function(jqxhr, error, message){
                console.log(error, message);
            }
        })
    };

    this.start = function(phase){
        console.log('level.start() Loading Phase: ' + phase);
        this.loadEnemyPhase(phase);
    }

    this.destroy = function(){
        this.currentPhase.forEach(function(enemy){
            //enemy.type.PhaserObj.kill();
        });
    }

    // This function allows you to bend space time.
    this.createEnemyTimeoutHandler = function(enemyToLoad){
        // By returning a function with the parameters in the scope of this function we allow ourselves to set this function in a time out and keep its original reference
        return function () {
            console.log("Initiate enemy ", enemyToLoad)
            enemyToLoad.type.initiate(enemyToLoad.x, enemyToLoad.y, enemyToLoad.target);
        }
    }

    // This function allows you to see God.
    this.createPowerUpTimeoutHandler = function(powerUpToLoad){
        // By returning a function with the parameters in the scope of this function we allow ourselves to set this function in a time out and keep its original reference
        return function () {
            powerUpToLoad.type.initiate(powerUpToLoad.x, powerUpToLoad.y, powerUpToLoad.direction, powerUpToLoad.speed, powerUpToLoad.target);
        }
    }


    // LOAD THE NEXT WAVE OF BAD GUYS
    //////////////////////////////////
    this.loadEnemyPhase = function(phaseNumber) {

        // Go through the enemy list
        for (var x = 0; x < this.enemyList.length; x++) {
            // If the enemy is in this phase
            if (this.enemyList[x].phase == phaseNumber) {
                // Add it to the currentPhase array
                this.currentPhase.push(this.enemyList[x]);
            }
        }
        console.log("loaded " + this.currentPhase.length + " from phase " + phaseNumber, this.currentPhase );

        // Activate all entities from this phase
        for (var x = 0; x < this.currentPhase.length; x++) {
            // Activate the enemy
            setTimeout( this.createEnemyTimeoutHandler(this.currentPhase[x]), this.currentPhase[x].delay);
        }

        // Go through the powerup list
        for (var x = 0; x < this.powerUps.length; x++) {
            // If the power up is in this phase
            if (this.powerUps[x].phase == phaseNumber) {
                // Add it to the current powerups array
                this.currentPowerUps.push(this.powerUps[x]);
            }
        }

        // Activate all powerups in this phase
        for (var x = 0; x < this.currentPowerUps.length; x++) {
            // Activate the powerup
            if(this.currentPowerUps[x].phase == phaseNumber)
            setTimeout( this.createPowerUpTimeoutHandler( this.currentPowerUps[x]), this.currentPowerUps[x].delay);
        }
    }


    // UPDATE LOOP
    ///////////////
    this.update = function(){

        var enemiesAllDead = true;
        // Go through each enemy in the current phase
        for(var x = 0; x < this.currentPhase.length; x++) {

            // If the sprite is still alive
            if(this.currentPhase[x].type.PhaserObj.alive){
                // Update the enemy
                this.currentPhase[x].type.update();
                // Mark that at least one enemy in this phase is alive
                enemiesAllDead = false;
            }
        }

        for(var x = 0; x < this.currentPowerUps.length; x++){
            if(this.currentPowerUps[x].type.PhaserObj.alive){
                this.currentPowerUps[x].type.update();
            }
        }

        if(enemiesAllDead){
            this.currentPhase = [];
            this.currentPhaseNumber++;
            this.loadEnemyPhase(this.currentPhaseNumber);
            if(this.currentPhase.length == 0){
                gameMode = 4;
            }
        }

        game.physics.arcade.overlap(this.strayWeapons, player.PhaserObj, this.strayWeaponsHit, null, this);

    }

    this.strayWeaponsHit = function(weapon, player){
        // Test my bullets against my target
        weapon.kill();
        player.kill();
    };

}