"use strict";

var config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var player1; //sprite for player 1
var player2; //sprite for player 2
var middleMan; //sprite for the man in the middle

var player1Score;
var player2Score;
var player1ScoreText;
var player2ScoreText;
var player1TurnText;
var player2TurnText;

var playState; //0 for player 1's turn, 1 for player 1's farting, 2 for player 2's turn, 2 for player 2's farting, 3 for game over
var middleManAnger; //the value for the middle man's anger

var keyWasDown;

var keyDownTime;
var keyUpTime;

var currentVolume; //volume the game starts with for a fart; each round, this gets louder
var fartTimes; //array of the durations (milliseconds) of a player's fart
var currentFartIndex; //index of the current fart in fartTimes
var isUnloading; //bool representing whether a playing is currently playing the fart sound effects

var fartSounds; //array of the fart sound objects

var player1WinText;
var player2WinText;

var openingText;

var currentMultiplier;


function preload ()
{
    this.load.image('bathroom', 'assets/Bathroom.png');

    //this.load.audio('titlemusic', 'assets/IntroTheme.wav');
    //this.load.audio('levelmusic', 'assets/LevelTheme.wav');

    this.load.spritesheet('player1SpriteSheet', 'assets/Player1.png', {frameWidth: 140, frameHeight: 340});
    this.load.spritesheet('player2SpriteSheet', 'assets/Player2.png', {frameWidth: 140, frameHeight: 340});
    this.load.spritesheet('middleManSpriteSheet', 'assets/MiddleMan.png', {frameWidth: 140, frameHeight: 340});
    this.load.audio('music', 'assets/5763-night-in-venice-by-kevin-macleod.mp3');

    for (var i = 1; i <= 12; i++)
    {
        this.load.audio('fart' + i, 'assets/farts/Fart' + i + ".wav");
    }
}


function updateText(text, playerNum, score)
{
    text.setText('Player ' + playerNum + ": " + score + "pts");
}

function create()
{
    this.add.image(400, 300, "bathroom");
    player1 = this.add.sprite(122, 340, "player1SpriteSheet");
    player2 = this.add.sprite(665, 340, "player2SpriteSheet");
    middleMan = this.add.sprite(396, 340, "middleManSpriteSheet");

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys("F, P, Enter");

    //titleScreenMusic = this.sound.add('titlemusic');
    //levelMusic = this.sound.add('levelmusic');

    fartSounds = [];
    for (var i = 1; i <= 12; i++)
    {
        fartSounds.push(this.sound.add('fart' + i));
    }

    createPlayerAnimations(this.anims, 'player1');
    createPlayerAnimations(this.anims, 'player2')
    createMiddleManAnimations(this.anims);

    this.sound.add('music').play({volume: 0.3, loop: true});

    middleMan.anims.play("middleManIdle", true);

    player1ScoreText = this.add.text(5, 540, 'Player 1: 0pts', {fontSize: '32px', fill: '#000'});
    player2ScoreText = this.add.text(500, 540, 'Player 2: 0pts', {fontSize: '32px', fill: '#000'});
    player1TurnText = this.add.text(5, 570, 'Load farts using \'F\'', {fontSize: '32px', fill: '#000'});
    player2TurnText = this.add.text(420, 570, 'Load farts using \'P\'', {fontSize: '32px', fill: '#000'})
    openingText = this.add.text(5, 570, 'Press Enter to start!', {fontSize: '32px', fill: '#000'});

    player1TurnText.visible = false;
    player2TurnText.visible = false;

    player1WinText = this.add.text(0, 570, 'Player 1 Wins, Refresh Page to Play Again!', {fontSize: '32px', fill: '#000'});
    player2WinText = this.add.text(0, 570, 'Player 2 Wins, Refresh Page to Play Again!', {fontSize: '32px', fill: '#000'});
    player1WinText.visible = false;
    player2WinText.visible = false;

    player1Score = 0;
    player2Score = 0;
    playState = -1;
    middleManAnger = 0;
    keyWasDown = false;

    keyDownTime = 0;
    keyUpTime = 0;
    currentFartIndex = 0;

    isUnloading = false;

    currentVolume = 0.4;
    currentMultiplier = 0.4;

    fartTimes = [];

    player1.anims.play('player1Idle');
    player2.anims.play('player2Idle');
}

function createPlayerAnimations(anims, name)
{
    anims.create({
        key: name + 'Idle',
        frames: anims.generateFrameNumbers(name + 'SpriteSheet', {frames: [0, 1, 2]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: name + 'Charging',
        frames: anims.generateFrameNumbers(name + 'SpriteSheet', {frames: [2, 3]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: name + 'Fart',
        frames: anims.generateFrameNumbers(name + 'SpriteSheet', {frames: [4, 5]}),
        frameRate: 10
    });

    anims.create({
        key: name + 'Win',
        frames: anims.generateFrameNumbers(name + 'SpriteSheet', {frames: [3]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: name + 'Lose',
        frames: anims.generateFrameNumbers(name + 'SpriteSheet', {frames: [6, 7, 8]}),
        frameRate: 10,
        repeat: -1
    });
}

function createMiddleManAnimations(anims)
{
    anims.create({
        key: 'middleManIdle',
        frames: anims.generateFrameNumbers('middleManSpriteSheet', {frames: [0, 1, 2]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'middleManMad',
        frames: anims.generateFrameNumbers('middleManSpriteSheet', {frames: [3, 4]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'middleManReallyMad',
        frames: anims.generateFrameNumbers('middleManSpriteSheet', {frames: [5, 6]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'middleManFurious',
        frames: anims.generateFrameNumbers('middleManSpriteSheet', {frames: [7, 8]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'middleManGameOver',
        frames: anims.generateFrameNumbers('middleManSpriteSheet', {frames: [9, 10]}),
        frameRate: 10,
        repeat: -1
    });
}


function turnUpdate(time, key, currentPlayer, playerNum)
{
    if (key.isDown) //player is currently holding the key down
    {
        if (keyWasDown == false) //if this is a press event
        {
            keyDownTime = time;
            currentPlayer.anims.play('player' + playerNum + 'Charging');
        }
        keyWasDown = true;
    }
    else if (keyWasDown == true) //player was holding the key down but has just released it
    {
        currentPlayer.anims.play('player' + playerNum + 'Idle');

        fartTimes.push(time - keyDownTime);

        keyUpTime = time;

        keyWasDown = false;
    }
    else //not a key press event, or a key up event
    {
        currentPlayer.anims.play('player' + playerNum + 'Idle');

        if (time - keyUpTime > 3000 && fartTimes.length != 0) //if the player has gone 3 seconds without pressing a key and has farted at least once
        {
            if (playerNum == '1') //end turn
            {
                playState = 1;
            }
            else
            {
                playState = 3;
            }
        }
    }
}

function playFart(volume, lengthOfFart)
{
    var RNG = Phaser.Math.Between(1, 12);
    var selectedFart = fartSounds[RNG - 1];

    var fartConfig = 
    {
        volume : volume,
        rate: selectedFart.duration / lengthOfFart,
        duration: lengthOfFart
    };

    selectedFart.play(fartConfig);
}

function onFartFinish()
{
    isUnloading = false;
    currentFartIndex++;
}

function unloadFarts(currentTime, time, scene, currentPlayer, playerNum, currentScoreRef, currentScoreText)
{
    isUnloading = true;

    if (currentFartIndex >= fartTimes.length) //in this case, the round needs to be passed on to the other player and a bunch of variables need resetting
    {
        currentPlayer.anims.play('player' + playerNum + 'Idle');

        isUnloading = false;

        var middleManAccruedAnger = 0;

        for (var i = 0; i < fartTimes.length; i++)
        {
            var addition = Math.round((fartTimes[i] / 100) * (currentMultiplier * 10));

            if (fartTimes[i] > 0 && addition > 0 && addition != null)
            {
                middleManAccruedAnger += addition;
            }
        }
       

        if (middleManAccruedAnger + middleManAnger >= 500) //if so, game over!
        {
            player1TurnText.visible = false;
            player2TurnText.visible = false;
            middleMan.anims.play('middleManGameOver');
            if (playerNum == '1')
            {
                middleMan.setFlipX(true);
            }
            currentScoreRef[0] = Math.round(currentScoreRef[0] / 2); //as a punishment the current player's score is halved
            updateText(currentScoreText, playerNum, currentScoreRef[0]);
            playState = 4;
            return;
        }
        else if (middleManAccruedAnger + middleManAnger >= 400)
        {  
            middleMan.anims.play('middleManFurious');
        }
        else if (middleManAccruedAnger + middleManAnger >= 200)
        {
            middleMan.anims.play('middleManReallyMad');
        }

        else if (middleManAccruedAnger + middleManAnger >= 100)
        {
            middleMan.anims.play('middleManMad');
        }

        currentScoreRef[0] += middleManAccruedAnger;
        middleManAnger += 0.75 * middleManAccruedAnger;

        if (playerNum == '2')
        {
            currentMultiplier += 0.2;
            currentVolume += 0.2;
        }
        
        if (currentVolume > 1.0)
        {
            currentVolume = 1.0;
        }

        fartTimes = [];

        updateText(currentScoreText, playerNum, currentScoreRef[0]);

        if (playState == 1)
        {
            playState = 2;
        }
        else
        {
            playState = 0;
        }

        currentFartIndex = 0;

        keyUpTime = currentTime;
    }
    else
    {
        var lengthOfFart = fartTimes[currentFartIndex];

        time.addEvent({delay: lengthOfFart, callback: onFartFinish});
    
        currentPlayer.anims.play('player' + playerNum + 'Charging');
        time.addEvent({delay: 50, callback: playFartAnimation, args: [currentPlayer, playerNum]});

        playFart(currentVolume, lengthOfFart / 1000.0);
    }

}

function playFartAnimation(currentPlayer, playerNum)
{
    currentPlayer.anims.play('player' + playerNum + 'Fart');
}

function setPlayer1Text()
{
    player2TurnText.visible = false;
    player1TurnText.visible = true;
}

function setPlayer2Text()
{
    player2TurnText.visible = true;
    player1TurnText.visible = false;
}

function update (time, delta)
{
    switch(playState)
    {
        case -1: //initial game startup
            keyUpTime = time;

            if (keys.Enter.isDown)
            {
                playState = 0;
                openingText.visible = false;
            }
           
            break;
        case 0: //player 1 inputs their farts
            setPlayer1Text();
            turnUpdate(time, keys.F, player1, '1');
            break;
        case 1: //player 1's farts are unleashed
            if (isUnloading == false)
            {
                var player1ScoreRef = [];
                player1ScoreRef.push(player1Score);
                unloadFarts(time, this.time, this.scene, player1, '1', player1ScoreRef, player1ScoreText);
                player1Score = player1ScoreRef[0];
            }
            
            break;
        case 2: //player 2 inputs their farts
            setPlayer2Text();
            turnUpdate(time, keys.P, player2, '2');
            break;
        case 3: //player 2's farts are unleashed
            if (isUnloading == false)
            {
                var player2ScoreRef = [];
                player2ScoreRef.push(player2Score);
                unloadFarts(time, this.time, this.scene, player2, '2', player2ScoreRef, player2ScoreText);
                player2Score = player2ScoreRef[0];
            }
            
            break;
        case 4: //game over
            player1TurnText.visible = false;
            player2TurnText.visible = false;

            if (player1Score < player2Score)
            {
                player1.anims.play('player1Lose', true);
                player2.anims.play('player2Win', true);
                player2WinText.visible = true;
            }
            else
            {
                player1.anims.play('player1Win', true);
                player2.anims.play('player2Lose', true);
                player1WinText.visible = true;
            }
            break;
        default:
            break;
    }
}