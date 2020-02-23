
var keys;
var cursors;
var textoptions;
var currentTextIndex;
var jsonOptions;

function changeSelectedOption(increment)
{
    textoptions[currentTextIndex].setStyle({color: "#ffffff"});
    if (currentTextIndex + increment == -1)
    {
        currentTextIndex = jsonOptions["options"].length - 1;
    }
    else
    {
        currentTextIndex = (currentTextIndex + increment) % jsonOptions["options"].length;
    }
    
    textoptions[currentTextIndex].setStyle({color: "#888888"});
}

var selectscene = new Phaser.Class(
{
    Extends: Phaser.Scene,

    onEnter: function()
    {
        keys.W.removeAllListeners();
        keys.S.removeAllListeners();
        cursors.up.removeAllListeners();
        cursors.down.removeAllListeners();
        this.scene.start("selectscene", jsonOptions["options"][currentTextIndex]["goto"]);
        return;
    },

    initialize: function selectscene()
    {
        Phaser.Scene.call(this, {key: 'selectscene'});
    },

    preload: function()
    {
        this.load.json("options", "assets/options.json");
    },

    create: function(optionKey)
    {
        if (optionKey.includes("_"))
        {
            var separatorIndex = optionKey.indexOf("_");
            var str1 = optionKey.substring(0, separatorIndex);
            var str2 = optionKey.substring(separatorIndex + 1, optionKey.length);
            var isAccusation = (str2 == "accusation");
            this.scene.start("dialoguescene", {"folder": str1, "isAccusation": isAccusation});
            return;
        }

        jsonOptions = this.cache.json.get("options")["options"][optionKey];

        this.add.text(0, 0, jsonOptions["question"]);
        this.add.text(0, 550, "W/S or Up/Down arrows to choose, 'Enter' to select");

        keys = this.input.keyboard.addKeys("W, A, S, D, Enter");
        cursors = this.input.keyboard.createCursorKeys();

        currentTextIndex = 0;
        textoptions = [];

        for (var i = 0; i < jsonOptions["options"].length; i++)
        {
            textoptions.push(this.add.text(0, (i+1) * 70, jsonOptions["options"][i]["option"]));
        }

        keys.W.on("up", function(event){changeSelectedOption(-1)});
        keys.S.on("up", function(event){changeSelectedOption(1)});
        cursors.up.on("up", function(event){changeSelectedOption(-1)});
        cursors.down.on("up", function(event){changeSelectedOption(1)});

        keys.Enter.once("up", this.onEnter, this);

        changeSelectedOption(0);
    },

    update: function()
    {

    }
});