var welcomeScene = new Phaser.Class
({
    Extends: Phaser.Scene,
    initialize: function welcomeScene()
    {
        Phaser.Scene.call(this, {key: "welcomeScene"});
    },

    preload: function()
    {
        this.load.image("loadingScreen", "assets/LoadingScreen.png");
    },

    create: function()
    {
        this.add.sprite(400, 300, "loadingScreen");
        this.scene.launch("loadScene");
    }
});