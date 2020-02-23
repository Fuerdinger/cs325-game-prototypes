var keys;

var titlescene = new Phaser.Class(
{
    Extends: Phaser.Scene,
    initialize: function titlescene()
    {
        Phaser.Scene.call(this, {key: 'titlescene'});
    },

    preload: function()
    {
        this.load.image('screen', 'assets/Titlescreen.png');
        this.load.audio('music', 'assets/I Can Feel It Coming.mp3');
    },

    create: function()
    {
        this.add.sprite(400, 300, 'screen');
        this.sound.add('music').play();
        keys = this.input.keyboard.addKeys("Enter");
    },

    update: function()
    {
        if (keys.Enter.isDown)
        {
            this.scene.start('dialoguescene', {"folder": "intro", "isAccusation": false});
        }
    }
});