function preload() {
    //game.load.spritesheet('player', '/Assets/Games/Karnage/Images/playerSpritesheet.png', 178, 118);
    game.load.image('player', '/Assets/Games/Karnage/Images/player.png');
    game.load.image('smoke', '/Assets/Games/Karnage/Images/smoke.png')
    game.load.image('laser', '/Assets/Games/Karnage/Images/laser.png');
    game.load.image('bullet', '/Assets/Games/Karnage/Images/bullet.png');
    game.load.image('missile', '/Assets/Games/Karnage/Images/missile.png');
    game.load.image('star', '/Assets/Games/Karnage/Images/star.png');
    game.load.audio('bgmusic', ['/Assets/Games/Karnage/Music/bgmusic.mp3', '/Assets/Games/Karnage/Music/bgmusic.ogg']);

    game.load.image('mainMenuLogo', '/Assets/Games/Karnage/Images/mainMenuLogo.png');
    game.load.image('mainMenuPlay', '/Assets/Games/Karnage/Images/mainMenuPlay.png');
    game.load.image('mainMenuInstructions', '/Assets/Games/Karnage/Images/mainMenuInstructions.png');
}