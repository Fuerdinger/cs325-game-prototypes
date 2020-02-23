"use strict";

var config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',

    scene: [titlescene, selectscene, dialoguescene, endscene]
};

var game = new Phaser.Game(config);