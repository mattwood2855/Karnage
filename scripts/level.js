/**
 * Created by Matt on 12/6/2014.
 */
function Level(){
    this.enemyList = [];
    this.currentPhase = [];
    this.currentPhaseNumber = 0;

    // Bullets
    this.strayWeapons = game.add.group();
    this.strayWeapons.enableBody = true;
    this.strayWeapons.physicsBodyType = Phaser.Physics.ARCADE;
    this.strayWeapons.setAll('anchor.x', 0.5);
    this.strayWeapons.setAll('anchor.y', 0.5);
    this.strayWeapons.setAll('outOfBoundsKill', true);
    this.strayWeapons.setAll('checkWorldBounds', true);

    this.initiate = function(){
        this.enemyList.push({ phase: 0, type: new EnemyDrone(), x: 0, y: -32, target: player });
        this.enemyList.push({ phase: 1, type: new EnemyDrone(), x: 0, y: -32, target: player });
        this.enemyList.push({ phase: 2, type: new EnemyDrone(), x: 0, y: -32, target: player });
        this.enemyList.push({ phase: 3, type: new EnemyDrone(), x: 0, y: -32, target: player });
        this.enemyList.push({ phase: 4, type: new EnemyDrone(), x: 0, y: -32, target: player });
    }

    this.start = function(phase){
        this.loadEnemyPhase(phase);
    }

    this.destroy = function(){
        this.currentPhase.forEach(function(enemy){
            enemy.type.PhaserObj.destroy();
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
        // Activate all enemies from this phase
        for(var x = 0; x < this.currentPhase.length; x++){
            // Activate the enemy
            this.currentPhase[x].type.initiate(this.currentPhase[x].x, this.currentPhase[x].y, this.currentPhase[x].target);
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

        game.physics.arcade.overlap(this.strayWeapons, player.PhaserObj, this.strayWeaponsHit, null, this);

    }

    this.strayWeaponsHit = function(weapon, player){
        // Test my bullets against my target
        weapon.kill();
        player.kill();
    };

}