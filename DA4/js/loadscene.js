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
                default:
                    break;                
            }
        }

        for (var i = 0; i <= 10; i++)
        {
            this.load.image("Tutorial" + i, "assets/tutorial/Tutorial" + i + ".png");
            this.load.audio("Tutorial" + i + "sound", "assets/tutorial/Tutorial" + i + ".wav");
        }
    },

    create: function()
    {
        this.scene.stop("welcomeScene");
        this.scene.start("dialogueScene");
    },

    update: function()
    {

    }
    
});