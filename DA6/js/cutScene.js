var cutScene = new Phaser.Class(
{
    Extends: Phaser.Scene,

    keys: null,
    textBoxName: null,
    textBox: null,
    textBoxText: null,
    frames: null,
    frameIndex: null,
    
    textIndex: null,
    textSpeed: null,
    currentMessage: null,
    sprites: null,
    goto: null,

    advanceSound: null,

    initialize: function cutScene()
    {
        Phaser.Scene.call(this, {key: 'cutScene'});
    },

    updateSpeech : function()
    {
        if (this.textIndex > this.currentMessage.length)
        {
            this.textIndex = this.currentMessage.length;
        }

        this.textBoxText.setText(this.currentMessage.substring(0, Math.round(this.textIndex)));
    },

    advanceDialogue: function ()
    {    
        this.advanceSound.play();
        if (this.frameIndex >= 0)
        {
            var oldFrame = this.frames[this.frameIndex];
            var oldImage = this.sprites[oldFrame["image"]];
            if (oldImage)
            {
                oldImage.visible = false;
            }
        }
    
        if (this.frameIndex + 1 >= this.frames.length)
        {
            this.endCutscene();            
            return;
        }
    
        var currentFrame = this.frames[++this.frameIndex];
        
        var imageName = currentFrame["image"];
        if (imageName)
        {
            this.sprites[imageName].visible = true;
        }
    
        this.textIndex = 0;
        this.currentMessage = currentFrame["text"];
        this.textBoxText.setText("");
        this.textBoxName.setText(currentFrame["name"]);
    },

    endCutscene: function()
    {
        this.keys.Enter.off(this.advanceDialogue);
        this.keys.E.off(this.advanceDialogue);

        if (this.goto != null)
        {
            this.scene.start("levelScene", this.goto);
        }
        else
        {
            this.scene.stop();
            this.scene.wake("levelScene");
        }
    },

    create: function(cutscene)
    {
        //this.sound.stopAll();

        this.advanceSound = this.sound.add("impactSound");

        this.keys = this.input.keyboard.addKeys("E, Enter");
        this.keys.Enter.on("up", this.advanceDialogue, this);
        this.keys.E.on("up", this.advanceDialogue, this);

        this.sprites = {};
        this.frames = this.cache.json.get("cutscenes")["cutscenes"][cutscene]["frames"];
        this.goto = this.cache.json.get("cutscenes")["cutscenes"][cutscene]["goto"];

        for (var i = 0; i < this.frames.length; i++)
        {
            var imageName = this.frames[i]["image"];
            if (!this.sprites[imageName])
            {
                this.sprites[imageName] = this.add.image(400, 320, imageName);
                this.sprites[imageName].visible = false;
            }
        }

        this.textBox = this.add.image(400, 320, "textBox");
        this.textBoxName = this.add.text(78, 471, "Name");
        this.textBoxText = this.add.text(64, 505, "Test");
        this.textBoxText.setWordWrapWidth(700, true);

        //music = this.sound.add(folder + "music");
        //music.play();
        
        this.textSpeed = 15;
        this.frameIndex = -1;
        this.textIndex = 0;
        this.currentMessage = "";

        this.advanceDialogue();
    },

    update: function(time, delta)
    {
        this.textIndex += delta / 1000.0 * this.textSpeed;
        this.updateSpeech();
    }
});