var endscene = new Phaser.Class(
    {
        Extends: Phaser.Scene,
        initialize: function endscene()
        {
            Phaser.Scene.call(this, {key: 'endscene'});
        },
    
        preload: function()
        {
            this.load.image('endscreen', 'assets/Endscreen.png');
            this.load.audio('endmusic', 'assets/Pamgaea.mp3');
        },
    
        create: function()
        {
            this.sound.stopAll();
            this.add.sprite(400, 300, 'endscreen');
            this.sound.add('endmusic').play();
        },
    
        update: function()
        {
    
        }
    });