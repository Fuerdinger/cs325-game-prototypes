var menuScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    textoptions: null,
    jsonOptions: null,
    currentTextIndex: null,

    initialize: function menuScene()
    {
        Phaser.Scene.call(this, {key: "menuScene"});
    },

    changeSelectedOption: function(increment)
    {
        this.textoptions[this.currentTextIndex].setStyle({color: "#ffffff"});
        if (this.currentTextIndex + increment == -1)
        {
            this.currentTextIndex = this.jsonOptions["options"].length - 1;
        }
        else
        {
            this.currentTextIndex = (this.currentTextIndex + increment) % this.jsonOptions["options"].length;
        }
        
        this.textoptions[this.currentTextIndex].setStyle({color: "#888888"});
    },

    onEnter: function()
    {
        keys.W.removeAllListeners();
        keys.S.removeAllListeners();
        cursors.up.removeAllListeners();
        cursors.down.removeAllListeners();
        keys.Enter.removeAllListeners();
        keys.E.removeAllListeners();

        var goto = this.jsonOptions["options"][this.currentTextIndex]["goto"];

        if (goto == "start")
        {
            this.scene.start("levelScene", this.jsonOptions["options"][this.currentTextIndex]["level"], true);
            return;
        }

        this.scene.start("menuScene", goto);

    },

    create: function(optionKey)
    {
        keys = this.input.keyboard.addKeys("W, A, S, D, E, Enter");
        cursors = this.input.keyboard.createCursorKeys();

        this.currentTextIndex = 0;
        this.textoptions = [];
        this.jsonOptions = this.cache.json.get("options")["options"][optionKey];

        this.add.text(0, 0, this.jsonOptions["question"]);
        this.add.text(0, 550, "W/S or Up/Down arrows to choose, E / 'Enter' to select");

        var numOptions = this.jsonOptions["options"].length;

        for (var i = 0; i < numOptions; i++)
        {
            this.textoptions.push(this.add.text((Math.floor(i / 7) * 120), (i%7 + 1) * 70, this.jsonOptions["options"][i]["option"]));
        }

        keys.W.on("up", function(event){this.changeSelectedOption(-1)}, this);
        keys.S.on("up", function(event){this.changeSelectedOption(1)}, this);
        cursors.up.on("up", function(event){this.changeSelectedOption(-1)}, this);
        cursors.down.on("up", function(event){this.changeSelectedOption(1)}, this);
        keys.Enter.once("up", this.onEnter, this);
        keys.E.once("up", this.onEnter, this);

        this.changeSelectedOption(0);
    }
});