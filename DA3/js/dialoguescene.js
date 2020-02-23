var fileMap = 
{
    "intro":
    [
        "crazed", "neutral", "sad", "smoking", "staring"
    ],

    "trump":
    [
        "laughing", "mad", "neutral", "sad"
    ],

    "vladimir":
    [
        "fishing", "horse", "intimidating", "scared"
    ],

    "xi":
    [
        "happy", "mad", "sad", "tank"
    ],

    "bezos":
    [
        "neutral", "sad", "scary", "smiling"
    ]
}

var keys;
var textboxname;
var textbox;
var textboxtext;
var dialogue;
var folder;
var music;
var expressions;
var dialogueIndex;

var textIndex;

var textSpeed;

var currentMessage;
var finishedLoading;
var isAccusation;

var dialoguescene = new Phaser.Class(
{
    Extends: Phaser.Scene,
    initialize: function dialoguescene()
    {
        Phaser.Scene.call(this, {key: 'dialoguescene'});
    },

    updateSpeech : function()
    {
        if (textIndex > currentMessage.length)
        {
            textIndex = currentMessage.length;
        }

        textboxtext.setText(currentMessage.substring(0, Math.round(textIndex)));
    },

    advanceDialogue: function ()
    {    
        if (dialogueIndex >= 0)
        {
            var oldDialogue = dialogue[dialogueIndex];
            var oldExpression = expressions[oldDialogue["image"]];
            if (oldExpression)
            {
                oldExpression.visible = false;
            }
        }
    
        if (dialogueIndex + 1 >= dialogue.length)
        {
            keys.Enter.removeAllListeners();
            finishedLoading = false;

            if (isAccusation == true)
            {
                this.scene.start("endscene");
            }
            else
            {
                this.scene.start("selectscene", "0");
            }
            
            return;
        }
    
        var currentDialogue = dialogue[++dialogueIndex];
        
        var expression = expressions[currentDialogue["image"]];
        if (expression)
        {
            expression.visible = true;
        }
    
        textIndex = 0;
        currentMessage = currentDialogue["text"];
        textboxtext.setText("");
        textboxname.setText(currentDialogue["name"]);
    },

    preload: function()
    {
        var folders = ["trump", "vladimir", "xi", "bezos", "intro"];
        for (var i = 0; i < folders.length; i++)
        {
            var currentFolder = folders[i];

            for (var j = 0; j < fileMap[currentFolder].length; j++)
            {
                var asset = fileMap[currentFolder][j];
    
                this.load.image(currentFolder + asset, "assets/" + currentFolder + "/" + asset + ".png");
            }
    
            
            this.load.audio(currentFolder + "music", "assets/" + currentFolder + "/music.mp3");
            this.load.json(currentFolder + "dialogue", "assets/" + currentFolder + "/dialogue.json");
        }

        this.load.image("textbox", "assets/textbox.png");
    },

    create: function(obj)
    {
        this.sound.stopAll();

        keys = this.input.keyboard.addKeys("Enter");
        keys.Enter.on("up", this.advanceDialogue, this);

        folder = obj["folder"];
        expressions = {};
        for (var i = 0; i < fileMap[folder].length; i++)
        {
            var asset = fileMap[folder][i];
            expressions[asset] = this.add.image(400, 300, folder + asset);
            expressions[asset].visible = false;
        }

        textboxname = this.add.text(78, 451, "Name");
        textboxtext = this.add.text(64, 478, "Test");
        textboxtext.setWordWrapWidth(700, true);

        textbox = this.add.image(400, 300, "textbox");
        music = this.sound.add(folder + "music");
        music.play();
        if (obj["isAccusation"] == true)
        {
            isAccusation = true;
            dialogue = this.cache.json.get(folder + "dialogue")["accusation"];
        }
        else
        {
            isAccusation = false;
            dialogue = this.cache.json.get(folder + "dialogue")["dialogue"];
        }
        
        textSpeed = 15;
        dialogueIndex = -1;
        textIndex = 0;
        this.advanceDialogue();

        finishedLoading = true;
    },

    update: function(time, delta)
    {
        if (finishedLoading == true)
        {
            textIndex += delta / 1000.0 * textSpeed;
            this.updateSpeech();
        }
    }
});