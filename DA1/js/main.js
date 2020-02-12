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


var cursors; //will hold input state of the arrow keys
var keys; //will hold input state of select keys

var map; //will hold the tilemap the game is currently using
var backgroundLayer; //will hold the non-physical background layer from the tilemap
var groundLayer; //will hold the physical layer of the tilemap
var player; //will hold reference to sprite (found in Tiled object layer); use player.body to mess with physics
var enemies; //will hold an array of enemy sprites (found in Tiled object layer)
var goal; //will hold reference to the goal object sprite

var titleScreenMusic;
var levelMusic;

var isDead;
var hasTouchedGoal;
var isGrounded;

var currentLevel;

function preload ()
{
    this.load.tilemapTiledJSON('Level1', 'assets/Level1.json');
    this.load.tilemapTiledJSON('Level2', 'assets/Level2.json');
    this.load.tilemapTiledJSON('Level3', 'assets/Level3.json');
    this.load.tilemapTiledJSON('Level4', 'assets/Level4.json');
    this.load.tilemapTiledJSON('Level5', 'assets/Level5.json');

    this.load.image('tiles', 'assets/Tilemap.png');

    this.load.audio('titlemusic', 'assets/IntroTheme.wav');
    this.load.audio('levelmusic', 'assets/LevelTheme.wav');

    this.load.spritesheet('goalSheet', 'assets/Goal.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('playerSpriteSheet', 'assets/TilemapPlayer.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy1SpriteSheet', 'assets/TilemapEnemy1.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy2SpriteSheet', 'assets/TilemapEnemy2.png', {frameWidth: 32, frameHeight: 32});
}




function create()
{
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys("W, A, S, D, SPACE");

    titleScreenMusic = this.sound.add('titlemusic');
    levelMusic = this.sound.add('levelmusic');

    createPlayerAnimations(this.anims);
    createEnemyAnimations(this.anims);

    currentLevel = 1;
    loadLevel(this.add, this.physics, currentLevel, titleScreenMusic, false);
}

function loadLevel(add, physics, level, music, loopMusic)
{
    music.play({loop: loopMusic});
    map = add.tilemap("Level" + currentLevel);
    var tileset = map.addTilesetImage('DA1', 'tiles');

    backgroundLayer = map.createStaticLayer('Tile Layer 1', tileset);
    groundLayer = map.createStaticLayer('Tile Layer 2', tileset);
    groundLayer.setCollisionByExclusion(-1, true);

    player = getPlayer(physics);
    enemies = getEnemies(physics);
    goal = getGoal(physics);
}

function changeLevel(add, physics, level, music, loopMusic)
{
    player.destroy();
    map.destroy();
    backgroundLayer.destroy();
    groundLayer.destroy();
    goal.destroy();
    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].destroy();
    }

    loadLevel(add, physics, level, music, loopMusic);
}


function createPlayerAnimations(anims)
{
    anims.create({
        key: 'playerIdle',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'playerJump',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [2, 3, 4]}),
        frameRate: 10
    });

    anims.create({
        key: 'playerMove',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [2, 3, 4, 5]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'playerDeath',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [7, 8, 9, 10, 11]}),
        frameRate: 10,
    });

    anims.create({
        key: 'playerShoot',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [12]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'playerShootRun',
        frames: anims.generateFrameNumbers('playerSpriteSheet', {frames: [14, 15, 16, 17]}),
        frameRate: 10,
        repeat: -1
    });
}

function createEnemyAnimations(anims)
{
    anims.create({
        key: 'enemyIdle',
        frames: anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [0]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'enemyMove',
        frames: anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [1, 2, 0]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'enemyDeath',
        frames: anims.generateFrameNumbers('enemy1SpriteSheet', {frames: [3, 4, 5, 6, 7]}),
        frameRate: 10,
        repeat: -1
    });
}

function getPlayer(physics)
{
    var players = map.createFromObjects('Object Layer 1', 'Player', {key: 'playerSpriteSheet'});
    var player = players[0];

    physics.world.enable(player, 0); //0 for dynamic body, 1 for static body
    player.body.setCollideWorldBounds(true);
    physics.add.collider(player, groundLayer);

    isDead = false;
    hasTouchedGoal = false;
    isGrounded = false;

    return player;
}

function getEnemies(physics)
{
    var enemies = map.createFromObjects('Object Layer 1', 'Enemy', {key: 'enemy1SpriteSheet'});

    for (var i = 0; i < enemies.length; i++)
    {
        physics.world.enable(enemies[i], 0); //0 for dynamic body, 1 for static body
        enemies[i].body.setCollideWorldBounds(true);
        physics.add.collider(enemies[i], groundLayer);
        physics.add.overlap(player, enemies[i], touchedEnemy);
    }

    return enemies;
}

function getGoal(physics) //must be called after player is called
{
    var goals = map.createFromObjects('Object Layer 1', 'Goal', {key: 'goalSheet'});
    var goal = goals[0];

    physics.world.enable(goal, 1);
    physics.add.overlap(player, goal, touchedGoal);

    return goal;
}

function touchedEnemy()
{
    isDead = true;
}

function touchedGoal()
{
    hasTouchedGoal = true;
}

function update ()
{
    if (hasTouchedGoal)
    {
        currentLevel = currentLevel + 1;
        changeLevel(this.add, this.physics, currentLevel, levelMusic, true);
    }

    else if (isDead)
    {
        player.body.setVelocityX(0);

        if (player.anims.getProgress() == 1.0)
        {
            changeLevel(this.add, this.physics, currentLevel, levelMusic, true);
        }
        else
        {
            player.anims.play('playerDeath', true);
        }
        
        
    }

    else
    {
        if (cursors.left.isDown || keys.A.isDown)
        {
            player.body.setVelocityX(-160);
            player.setFlipX(true);
    
            player.anims.play('playerMove', true);
        }
    
        else if (cursors.right.isDown || keys.D.isDown)
        {
            player.body.setVelocityX(160);
            player.setFlipX(false);
    
            player.anims.play('playerMove', true);
        }
    
        else
        {
            player.body.setVelocityX(0);
            
            player.anims.play('playerIdle', true);
        }
    
        if ((cursors.up.isDown || keys.W.isDown || keys.SPACE.isDown) && player.body.onFloor())//&& isGrounded)
        {
            player.body.setVelocityY(-300);
            isGrounded = false;
    
            player.anims.play('playerJump', true);
        }
    }

    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].body.setVelocityX(-60);
        enemies[i].setFlipX(true);
        enemies[i].anims.play('enemyMove', true);
    }


}