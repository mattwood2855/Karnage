function create() {

    //  Enable phaser's arcade physics and collision detection
    game.physics.startSystem(Phaser.Physics.ARCADE);

    music = game.add.audio('bgmusic');
    music.volume = .2;
    //music.play();


    // Smoke effects
    smokes = game.add.group();
    smokes.enableBody = true;
    smokes.physicsBodyType = Phaser.ARCADE;
    smokes.createMultiple(30, 'smoke');
    smokes.setAll('anchor.x', 0.5);
    smokes.setAll('anchor.y', 1);
    smokes.setAll('outOfBoundsKill', true);
    smokes.setAll('checkWorldBounds', true);



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