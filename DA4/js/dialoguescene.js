
var textboxname;
var textbox;
var textboxtext;
var dialogue =
[
    "Welcome to Chicken OS. My name is Cluckhead and I'll be your virtual guide for this tutorial. Click anywhere to advance the screen.",
    "Your goal is to get rid of some nasty viruses that are clucking around the operating system. This is the desktop homepage.",
    "Click on this icon to load prepare-payload.chkn.",
    "Here you will move my delicious eggs into the basket. This is your top priority. You will win if enough eggs make it in.",
    "Click an egg and it will follow your cursor. It should be obvious where to put them.",
    "To return to the homepage, click on the red X.",
    "Over time, small viruses will accumulate in the system kernel. Click this icon to launch virus-crusher.chkn.",
    "Here, you get to stomp the cluck out of the viruses with this giant foot I programmed. Note that if too many viruses accumulate here, the game will end.",
    "Click anywhere to launch the stomping algorithm.",
    "Click the red X to return to the homepage.",
    "You'll notice that pop up ads accumulate on the homepage over time. Don't trust them, for cluck's sake. Once you're ready, click to start the game!"
];
var dialogueIndex;
var images;
var sounds;
var textIndex;

var textSpeed;

var currentMessage;

var dialogueScene = new Phaser.Class(
{
    Extends: Phaser.Scene,
    initialize: function dialogueScene()
    {
        Phaser.Scene.call(this, {key: 'dialogueScene'});
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
        if (dialogueIndex >= 0) //if not, then this is the first time this is being run
        {
            var oldDialogue = dialogue[dialogueIndex];
            var oldImage = images[dialogueIndex];
            var oldSound = sounds[dialogueIndex];
            if (oldImage)
            {
                oldImage.visible = false;
            }
            if (oldSound.isPlaying)
            {
                oldSound.pause();
            }
        }
    
        if (dialogueIndex + 1 >= dialogue.length) //if this is the last image
        {
            finishedLoading = false;
            this.scene.start("homePageScene");
            return;
        }
    
        var currentDialogue = dialogue[++dialogueIndex];
        
        var currentImage = images[dialogueIndex];
        if (currentImage)
        {
            currentImage.visible = true;
        }
    
        textIndex = 0;
        currentMessage = currentDialogue;
        textboxtext.setText("");
        sounds[dialogueIndex].play();
    },

    preload: function()
    {

    },

    create: function()
    {
        images = [];
        sounds = [];
        for (var i = 0; i <= 10; i++)
        {
            images.push(this.add.image(400, 300, "Tutorial"+i));
            sounds.push(this.sound.add("Tutorial" + i + "sound"));
            images[images.length - 1].visible = false;
        }

        textbox = this.add.image(400, 300, "textBox");
        textboxname = this.add.text(78, 451, "Cluckhead");
        textboxtext = this.add.text(64, 485, "Test");
        textboxtext.setWordWrapWidth(700, true);

        
        music = this.sound.add("vegasGlitz");
        music.play(musicConfig);
        
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

            if (this.input.mousePointer.leftButtonDown() && textIndex >= 6)
            {
                this.advanceDialogue();
            }
        }
    }
});