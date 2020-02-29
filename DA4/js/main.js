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
                y: 0
            },
            debug: false
        }
    },

    scene: [welcomeScene, loadScene, dialogueScene, homePageScene, chickenGameScene, stompGameScene, endScene]
};

var game = new Phaser.Game(config);