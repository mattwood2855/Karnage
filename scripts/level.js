/**
 * Created by Matt on 12/6/2014.
 */
function Level(){
    this.enemyList = [];
    this.currentPhase = [];
    this.currentPhaseNumber = 0;
    this.powerUps = [];

    // Level controlled bullets
    this.strayWeapons = game.add.group();
    this.strayWeapons.enableBody = true;
    this.strayWeapons.physicsBodyType = Phaser.Physics.ARCADE;
    this.strayWeapons.setAll('anchor.x', 0.5);
    this.strayWeapons.setAll('anchor.y', 0.5);
    this.strayWeapons.setAll('outOfBoundsKill', true);
    this.strayWeapons.setAll('checkWorldBounds', true);

    /*/ Powerups
    this.powerUps = game.add.group();
    this.strayWeapons.enableBody = true;
    this.strayWeapons.physicsBodyType = Phaser.Physics.ARCADE;
    this.strayWeapons.setAll('anchor.x', 0.5);
    this.strayWeapons.setAll('anchor.y', 0.5);
    */

    this.initiate = function(player, level) {
        // Create a reference in scope of the AJAX call so that the promise (success) has reference
        this.player = player;
        var levelRef = this;
        // Perform a GET to grab the level we are on
        $.ajax({
            url: "levels/level" + level + ".json",
            dataType: 'json',
            success: function (data) {
                // For each item in the enemies list
                data.enemies.forEach(function (e) {

                    var enemyType = {};

                    // If the enemy type is 0 then it's a Drone
                    if(e.type == 0){
                        enemyType = new EnemyDrone();
                    }

                    // If the enemy type is 420 then it's a PowerUp
                    if(e.type == 420) {
                        // Push the powerup into the level's powerup
                        levelRef.powerUps.push({
                            phase: e.phase,
                            type: new PowerUp(),
                            x: e.x,
                            y: e.y,
                            direction: e.direction,
                            speed: e.speed,
                            target: levelRef.player
                        });
                    }else{
                    // Push the enemy into the level's enemyList
                    levelRef.enemyList.push({phase: e.phase,type: enemyType,x: e.x,y: e.y,target: levelRef.player});
                    }
                })
            },
            error: function(jqxhr, error, message){
                console.log(error, message);
            }
        })
    };

    this.start = function(phase){
        this.loadEnemyPhase(phase);
    }

    this.destroy = function(){
        this.currentPhase.forEach(function(enemy){
            enemy.type.PhaserObj.kill();
        });
    }

    // LOAD THE NEXT WAVE OF BAD GUYS
    //////////////////////////////////
    this.loadEnemyPhase = function(phaseNumber){

        // Go through the enemy list
        for(var x = 0; x < this.enemyList.length; x++) {
            // If the enemy is in this phase
            if(this.enemyList[x].phase == phaseNumber) {
                // Add it to the currentPhase array
                this.currentPhase.push(this.enemyList[x]);
                // Splice it from the enemy list to free up resources
                this.enemyList.splice(x, 1);
            }
        }

        // Go through the powerup list
        for(var x = 0; x < this.powerUps.length; x++) {
            // If the enemy is in this phase
            if(this.powerUps[x].phase == phaseNumber) {
                // Add it to the currentPhase array
                this.currentPhase.push(this.powerUps[x]);
                // Splice it from the enemy list to free up resources
                this.powerUps.splice(x, 1);
            }
        }

        // Activate all entities from this phase
        for(var x = 0; x < this.currentPhase.length; x++) {
            var temp = this.currentPhase[x].type.__proto__.constructor.name;
            if (this.currentPhase[x].type.__proto__.constructor.name == "PowerUp") {
                this.currentPhase[x].type.initiate(this.currentPhase[x].x, this.currentPhase[x].y, this.currentPhase[x].direction, this.currentPhase[x].speed, this.currentPhase[x].target);
            }
            else {
                // Activate the enemy
                this.currentPhase[x].type.initiate(this.currentPhase[x].x, this.currentPhase[x].y, this.currentPhase[x].target);
            }
        }
    }

    // UPDATE LOOP
    ///////////////
    this.update = function(){

        var enemiesAllDead = true;
        // Go through each enemy in the current phase
        for(var x = 0; x < this.currentPhase.length; x++) {
            // If the sprite is still alive
            if(this.currentPhase[x].type.PhaserObj.exists){
                // Update the enemy
                this.currentPhase[x].type.update();
                // Mark that at least one enemy in this phase is alive
                enemiesAllDead = false;
            }
            else{ // If the bad guy died
                // remove him from the current phase of enemies
                this.currentPhase.splice(x, 1);
            }
        }

        if(enemiesAllDead){
            this.currentPhaseNumber++;
            this.loadEnemyPhase(this.currentPhaseNumber);
            if(this.currentPhase.length == 0){
                gameMode = 4;
            }
        }
        // Update any power ups on the screen
        this.powerUps.forEach(function(powerUp){
            powerUp.type.update();
        });
        
        game.physics.arcade.overlap(this.strayWeapons, player.PhaserObj, this.strayWeaponsHit, null, this);

    }

    this.strayWeaponsHit = function(weapon, player){
        // Test my bullets against my target
        weapon.kill();
        player.kill();
    };

}