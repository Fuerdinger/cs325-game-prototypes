function assert(bool)
{
    if (bool == false)
    {
        print("Failure!");
    }
}

var loadScene = new Phaser.Class
({
    Extends: Phaser.Scene,
    initialize: function loadScene()
    {
        Phaser.Scene.call(this, {key: "loadScene"});
    },

    preload: function()
    {
        for (var i = 0; i < files.length; i++)
        {
            switch (files[i]["ext"])
            {
                case "img":
                    assert(this.load.image(files[i]["name"], "assets/" + files[i]["dst"]));
                    break;
                case "json":
                    assert(this.load.json(files[i]["name"], "assets/" + files[i]["dst"]));
                    break;
                case "sound":
                    assert(this.load.audio(files[i]["name"], "assets/" + files[i]["dst"]));
                    break;
                case "sheet":
                    assert(this.load.spritesheet(files[i]["name"], "assets/" + files[i]["dst"], {frameWidth: 32, frameHeight: 32}));
                    break;
                case "anim":
                    assert(this.load.animation(files[i]["name"], "assets/" + files[i]["dst"]));
                    break;
                default:
                    break;                
            }
        }

        for (var i = 0; i <= 9; i++)
        {
            this.load.tilemapTiledJSON("level" + i, "assets/levels/level" + i + ".json");
        }
    },

    create: function()
    {
        this.scene.stop("welcomeScene");
        this.scene.start("menuScene", "0");

        this.sound.add("introTheme").play({loop: true});
    }
    
});