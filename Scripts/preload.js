function preload() {
    //game.load.spritesheet('player', '/Assets/Games/Karnage/Images/playerSpritesheet.png', 178, 118);
    game.load.image('player', 'assets/Images/player.png');
    game.load.image('enemyDrone', 'assets/Images/enemyDrone.png');
    game.load.spritesheet('explosion', 'assets/Images/explosionSprite.png', 64, 64, 25);
    game.load.image('smoke', 'assets/Images/smoke.png')
    game.load.image('laser', 'assets/Images/laser.png');
    game.load.image('bullet', 'assets/Images/bullet.png');
    game.load.image('missile', 'assets/Images/missile.png');
    game.load.image('star', 'assets/Images/star.png');
    game.load.audio('bgmusic', ['assets/Music/bgmusic.mp3', 'assets/Music/bgmusic.ogg']);

    game.load.image('mainMenuLogo', 'assets/Images/mainMenuLogo.png');
    game.load.image('mainMenuPlay', 'assets/Images/mainMenuPlay.png');
    game.load.image('mainMenuInstructions', 'assets/Images/mainMenuInstructions.png');
}