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

    scene: [welcomeScene, loadScene, menuScene, cutScene, levelScene, endScene],
    render:
    {
        roundPixels: true,
        antialias: false,
        antialiasGL: false
    },
    fps:
    {
        min: 30,
        target: 60,
        smoothstep: false
    }
};

var game = new Phaser.Game(config);