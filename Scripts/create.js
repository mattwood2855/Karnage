function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    music = game.add.audio('bgmusic');
    music.play();

    // Create stars
    for (var x = 0; x < numberOfStars; x++) {
        stars[x] = game.add.sprite((Math.random() * game.width), (Math.random() * game.width), 'star');
        stars[x].width = stars[x].height = Math.random() * 2;
        game.physics.enable(stars[x], Phaser.Physics.ARCADE);
        stars[x].body.velocity.y = 200 * (stars[x].width / 2);
    }

    // Create Main Menu
    mainMenuLogo = game.add.sprite(game.world.centerX, game.world.centerY /2, 'mainMenuLogo');
    mainMenuLogo.anchor.setTo(0.5, 0.5);
    mainMenuPlay = game.add.sprite(game.world.centerX, game.world.centerY, 'mainMenuPlay');
    mainMenuPlay.anchor.setTo(0.5, 0.5);
    mainMenuInstructions = game.add.sprite(game.world.centerX, game.world.centerY + 120, 'mainMenuInstructions');
    mainMenuInstructions.anchor.setTo(0.5, 0.5);
    

    // Create Player
    player = game.add.sprite(game.world.centerX-350, game.world.centerY, 'player');
    player.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 14, false);
    player.width = 64;
    player.height = 64;
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // Smoke effects
    smokes = game.add.group();
    smokes.enableBody = true;
    smokes.physicsBodyType = Phaser.ARCADE;
    smokes.createMultiple(30, 'smoke');
    smokes.setAll('anchor.x', 0.5);
    smokes.setAll('anchor.y', 1);
    smokes.setAll('outOfBoundsKill', true);
    smokes.setAll('checkWorldBounds', true);

    //  Weapons
    // Laser
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;
    lasers.createMultiple(30, 'laser');
    lasers.setAll('anchor.x', 0.5);
    lasers.setAll('anchor.y', 1);
    lasers.setAll('outOfBoundsKill', true);
    lasers.setAll('checkWorldBounds', true);
    // Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    // Homing missiles
    missiles = game.add.group();
    missiles.enableBody = true;
    missiles.physicsBodyType = Phaser.Physics.ARCADE;
    missiles.createMultiple(30, 'missile');
    missiles.setAll('anchor.x', 0.5);
    missiles.setAll('anchor.y', 1);
    missiles.setAll('outOfBoundsKill', true);
    missiles.setAll('checkWorldBounds', true);

    // Set arrow keys
    arrowKeys = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    weaponSwitch0 = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    levelSwitch0 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    weaponSwitch1 = game.input.keyboard.addKey(Phaser.Keyboard.W);
    levelSwitch1 = game.input.keyboard.addKey(Phaser.Keyboard.S);
    weaponSwitch2 = game.input.keyboard.addKey(Phaser.Keyboard.E);
    levelSwitch2 = game.input.keyboard.addKey(Phaser.Keyboard.D);
}