"use strict";

var config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'game',
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity:
            {
                y: 300
            },
            debug: false
        }
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game( config );

var player;
var stars;
var platforms;
var cursors;
var keyboard;
var movingPlatform;
var score = 0;
var scoreText;
var keys;

function collectStar (player, star)
{
    star.disableBody(true, true); //this would destroy the star
    score += 10;
    scoreText.setText('score: ' + score);
    
}

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });


    this.load.tilemapTiledJSON('tilemap', 'assets/Level1.json');
    this.load.image('tiles', 'assets/Tilemap.png');

    this.load.spritesheet('playerSpriteSheet', 'assets/TilemapPlayer.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy1SpriteSheet', 'assets/TilemapEnemy1.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy2SpriteSheet', 'assets/TilemapEnemy2.png', {frameWidth: 32, frameHeight: 32});
}

var map;
var backgroundLayer;
var groundLayer;
var players;
var enemies;
var enemy;
var playerBody;

function create()
{
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'}); //adds text at 16, 16 being "score: 0", and giving some font info
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys("W, A, S, D");

    this.add.image(0, 0, 'sky');

    map = this.add.tilemap('tilemap');
    var tileset = map.addTilesetImage('DA1', 'tiles');

    backgroundLayer = map.createStaticLayer('Tile Layer 1', tileset);
    groundLayer = map.createStaticLayer('Tile Layer 2', tileset);
    groundLayer.setCollisionByExclusion(-1, true);

    players = map.createFromObjects('Object Layer 1', 1, {key: 'playerSpriteSheet'});
    enemies = map.createFromObjects('Object Layer 1', 37, {key: 'enemy1SpriteSheet'});

    player = players[0];
    this.physics.world.enable(player, 0); //0 for dynamic body, 1 for static body
    playerBody = player.body;
    playerBody.setCollideWorldBounds(true);
    this.physics.add.collider(player, groundLayer);

    enemy = enemies[0];
    this.physics.world.enable(enemy, 0); //0 for dynamic body, 1 for static body

    this.anims.create({
        key: 'enemyIdle',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyMove',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [1, 2]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyDeath',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [3, 4, 5, 6, 7]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'playerIdle',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'playerMove',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [2, 3, 4, 5]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'playerDeath',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [7, 8, 9, 10, 11]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'playerShoot',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [12]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'playerShootRun',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [14, 15, 16, 17]}),
        frameRate: 10,
        repeat: -1
    });

    //createPlayerAnimation();
    //createEnemyAnimation();

}

function createEnemyAnimation()
{
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [1, 2]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [3, 4, 5, 6, 7]}),
        frameRate: 10,
        repeat: -1
    });
}

function createPlayerAnimation()
{
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [2, 3, 4, 5]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [7, 8, 9, 10, 11]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'shoot',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [12]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'shootRun',
        frames: this.anims.generateFrameNumbers('playerSpriteSheet', {frames: [14, 15, 16, 17]}),
        frameRate: 10,
        repeat: -1
    });
}

/*
function create ()
{
    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'}); //adds text at 16, 16 being "score: 0", and giving some font info

    platforms = this.physics.add.staticGroup(); //platforms now can hold static physics objects that don't move
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //static object at coord 400, 568 using the 'ground' sprite added; because it is scaled, it has to call refreshBody to work with physics

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    movingPlatform = this.physics.add.image(400, 400, 'ground'); //moving platform is a dynamic physics object, not a member of any group

    movingPlatform.setImmovable(true); //moving platform must be dynamic (see above) because we want it to move; however we still don't want it to be affected by other objects
    movingPlatform.body.allowGravity = false; //disables gravity on moving platform
    movingPlatform.setVelocityX(50);

    player = this.physics.add.sprite(100, 450, 'dude'); //I think it is a sprite instead of an image because it has the ability to change
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys("W, A, S, D");

    stars = this.physics.add.group({ //if you want a group of dynamic objects you do it this way; groups take config dictionaries
        key: 'star', //image to use
        repeat: 11, //number to make
        setXY: { x: 12, y: 0, stepX: 70 } //12, 0 is the starting position for the first object, each subsequent object is incremented by 70
    });

    stars.children.iterate(function (child) { //iterates over each star in the group
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(player, platforms); //add.collider takes two different groups and allows them to collide with each other
    this.physics.add.collider(player, movingPlatform);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, movingPlatform);

    this.physics.add.overlap(player, stars, collectStar, null, this);
}*/

function update ()
{
    if (cursors.left.isDown || keys.A.isDown)
    {
        playerBody.setVelocityX(-160);

        player.anims.play('playerMove', true);
    }

    else if (cursors.right.isDown || keys.D.isDown)
    {
        playerBody.setVelocityX(160);

        player.anims.play('playerMove', true);
    }

    else
    {
        playerBody.setVelocityX(0);
        
        player.anims.play('playerIdle', true);
    }

    if ((cursors.up.isDown || keys.W.isDown) && player.body.touching.down)
    {
        playerBody.setVelocityY(-330);
    }
}

/*
window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    
    game.state.add( "main", make_main_game_state( game ) );
    game.state.start( "main" );
};
*/