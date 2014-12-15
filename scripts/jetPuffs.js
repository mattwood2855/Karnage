/**
 * Created by Matt on 12/6/2014.
 */


var updateJetPuffs = function (ship) {
    //  Grab the first smoke we can from the pool
    var temp = engine.smokes.getFirstExists(false);
    if (temp) {
        engine.smokePuffs.push(temp);
        if (engine.game.time.now > engine.puffTime) {
            //  And fire it
            temp.reset(ship.PhaserObj.x, ship.PhaserObj.y + 38);
            temp.body.velocity.y = 100;
            temp.body.velocity.x = (50 - ship.PhaserObj.body.velocity.y) * (Math.random() - 0.5);
            temp.lifespan = engine.puffLifespan + (100 * Math.random());
            if(ship.PhaserObj.body.velocity.y < -200) {
                temp.tint = 0x00FFFF;
            }else {
                temp.tint = 0xFF0000;
            }
        }
        engine.puffTime = engine.game.time.now + engine.puffTiming;
    }
    engine.smokePuffs.forEach(function (e, i) {
        e.scale.x = e.scale.y = 1 + Math.abs(ship.PhaserObj.body.velocity.y / 500);

        if (e.lifespan < (engine.puffLifespan * .99)) {
            e.tint = 0xFF0000;
        }
        if (e.lifespan < (engine.puffLifespan * (.98 + (ship.PhaserObj.body.velocity.y / 1000)))) {
            e.tint = 0xFFFF00;

        }
        if (e.lifespan < (engine.puffLifespan * (.4 + (ship.PhaserObj.body.velocity.y / 200)))) {
            e.tint = 0xFFFFFF;

        }

        if(e.body.velocity.y > 0) e.body.velocity.y -= .25;
        if (!e.alive)
            engine.smokePuffs.splice(i, 1);
    });
}
