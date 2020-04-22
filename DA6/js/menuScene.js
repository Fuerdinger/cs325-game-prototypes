var menuScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    textoptions: null,
    jsonOptions: null,
    currentTextIndex: null,
    optionKey: null,
    keys: null,
    cursors: null,

    cameFromLevel: null,
    
    changeOptionSound: null,
    selectSound: null,

    initialize: function menuScene()
    {
        Phaser.Scene.call(this, {key: "menuScene"});
    },

    changeSelectedOption: function(increment, firstTime)
    {
        if (firstTime == false)
        {
            this.changeOptionSound.play();
        }
        
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
        this.selectSound.play();
        var goto = this.jsonOptions["options"][this.currentTextIndex]["goto"];

        if (goto == "start")
        {
            this.scene.start("levelScene", {"level": this.jsonOptions["options"][this.currentTextIndex]["level"], "playCutscene": true});
            return;
        }
        else if (goto == "wake")
        {
            this.scene.wake("levelScene");
            this.scene.stop();
            return;
        }
        else if (goto == "retry")
        {
            this.scene.stop("levelScene");
            this.scene.start("levelScene", {"level": this.cameFromLevel, "playCutscene": false});
            this.scene.stop();
            return;
        }
        else if (this.optionKey == "pause")
        {
            this.scene.stop("levelScene");
        }

        this.scene.start("menuScene", {"optionKey": goto, "cameFromLevel": this.cameFromLevel});

    },

    create: function(obj)
    {
        var optionKey = obj["optionKey"];
        var cameFromLevel = obj["cameFromLevel"];

        this.cameFromLevel = cameFromLevel;

        resetKeys(this.input.keyboard);
        this.optionKey = optionKey;
        this.keys = this.input.keyboard.addKeys("W, A, S, D, E, Enter");
        this.cursors = this.input.keyboard.createCursorKeys();


        this.changeOptionSound = this.sound.add("impactSound");
        this.selectSound = this.sound.add("shootSound");

        this.currentTextIndex = 0;
        this.textoptions = [];
        this.jsonOptions = this.cache.json.get("options")["options"][optionKey];

        this.add.text(0, 0, this.jsonOptions["question"]);
        this.add.text(0, 550, "W/S or Up/Down arrows to choose, E / 'Enter' to select");

        var numOptions = this.jsonOptions["options"].length;

        for (var i = 0; i < numOptions; i++)
        {
            this.textoptions.push(this.add.text((Math.floor(i / 7) * 400), (i%7 + 1) * 70, this.jsonOptions["options"][i]["option"]));
        }

        this.keys.W.on("up", function(event){this.changeSelectedOption(-1, false)}, this);
        this.keys.S.on("up", function(event){this.changeSelectedOption(1, false)}, this);
        this.cursors.up.on("up", function(event){this.changeSelectedOption(-1, false)}, this);
        this.cursors.down.on("up", function(event){this.changeSelectedOption(1, false)}, this);
        this.keys.Enter.once("up", this.onEnter, this);
        this.keys.E.once("up", this.onEnter, this);

        this.changeSelectedOption(0, true);
    }
});