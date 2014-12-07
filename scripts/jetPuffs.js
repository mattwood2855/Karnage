/**
 * Created by Matt on 12/6/2014.
 */


var updateJetPuffs = function (ship) {
    //  Grab the first smoke we can from the pool
    var temp = smokes.getFirstExists(false);
    if (temp) {
        smokePuffs.push(temp);
        if (game.time.now > puffTime) {
            //  And fire it
            temp.reset(ship.PhaserObj.x, ship.PhaserObj.y + 38);
            temp.body.velocity.y = 100;
            temp.body.velocity.x = (50 - ship.PhaserObj.body.velocity.y) * (Math.random() - 0.5);
            temp.lifespan = puffLifespan + (100 * Math.random());
            if(ship.PhaserObj.body.velocity.y < -200) {
                temp.tint = 0x00FFFF;
            }else {
                temp.tint = 0xFF0000;
            }
        }
        puffTime = game.time.now + puffTiming;
    }
    smokePuffs.forEach(function (e, i) {
        e.scale.x = e.scale.y = 1 + Math.abs(ship.PhaserObj.body.velocity.y / 500);

        if (e.lifespan < (puffLifespan * .99)) {
            e.tint = 0xFF0000;
        }
        if (e.lifespan < (puffLifespan * (.98 + (ship.PhaserObj.body.velocity.y / 1000)))) {
            e.tint = 0xFFFF00;

        }
        if (e.lifespan < (puffLifespan * (.4 + (ship.PhaserObj.body.velocity.y / 200)))) {
            e.tint = 0xFFFFFF;

        }

        if(e.body.velocity.y > 0) e.body.velocity.y -= .25;
        if (!e.alive)
            smokePuffs.splice(i, 1);
    });
}
