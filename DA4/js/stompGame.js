var stompGameScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    redX : null,
    virusTimer: null,
    foot: null,
    viruses: [],
    isStomping: false,
    stompSound : null,
    virusKillSound : null,
    virusOverloadSound : null,

    initialize: function stompGameScene()
    {
        Phaser.Scene.call(this, {key: "stompGameScene"});
    },

    onVirusTimer: function()
    {
        currentViruses++;
        var virus = this.physics.add.sprite(Phaser.Math.Between(100, 700), 550, "virus");
        virus.setCollideWorldBounds(true);
        this.physics.add.overlap(virus, this.foot, this.onFootStomp, null, this);
        virus.setData("move", virusSpeed);
        this.viruses.push(virus);
    },

    onFootStomp: function(virus, foot)
    {
        this.virusKillSound.play(soundEffectConfig);
        currentViruses--;
        this.add.sprite(virus.x, virus.y, "deadVirus");
        var deadVirus = this.viruses.splice(this.viruses.indexOf(virus), 1);
        deadVirus[0].destroy();
        killedViruses++;
    },

    preload: function()
    {

    },
    
    onMouse: function(pointer, gameObject, event)
    {
        if (gameObject == this.redX)
        {
            this.scene.get("homePageScene").changeScene();
        }
    },

    create: function()
    {
        this.virusTimer = this.time.addEvent({delay: virusSpawnRate, callback: this.onVirusTimer, callbackScope: this, loop: true});

        this.virusKillSound = this.sound.add("virusKillSound");
        this.stompSound = this.sound.add("stompSound");
        this.virusOverloadSound = this.sound.add("virusOverloadSound");

        this.input.on("gameobjectdown", this.onMouse, this);
        this.input.setPollAlways();

        this.add.sprite(400, 300, "whiteBackground");

        this.foot = this.physics.add.sprite(400, 10, "foot");

        this.add.sprite(400, 300, "window");
        this.add.text(0, 0, "virus-crusher.chkn").setColor("black");
        
        this.redX = this.add.sprite(765, 16, "X");
        this.redX.setInteractive({useHandCursor: true});

        this.scene.get("homePageScene").changeScene();
    },

    changeScene: function()
    {
        this.scene.setVisible(false, "homePageScene");
        this.scene.get("homePageScene").input.enabled = false;
        
        this.scene.setVisible(false, "chickenGameScene");
        this.scene.get("chickenGameScene").input.enabled = false;

        this.scene.setVisible(true);
        this.input.enabled = true;
    },

    update: function()
    {
        if (currentViruses >= maxViruses - 5 && this.virusOverloadSound.isPlaying == false)
        {
            this.virusOverloadSound.play(soundEffectConfig);
        }

        for (var i = 0; i < this.viruses.length; i++)
        {
            var currentVirus = this.viruses[i];
            if (Math.abs(currentVirus.x - 800) <= 120)
            {
                currentVirus.setData("move", -1 * virusSpeed);
            }
            else if (Math.abs(currentVirus.x - 0) <= 120)
            {
                currentVirus.setData("move", virusSpeed);
            }

            currentVirus.setVelocity(currentVirus.getData("move"), 0);

        }

        if (this.foot.x > 772 || this.foot.x < 28)
        {
            this.foot.setPosition(400, this.foot.y);
        }

        var goToX = this.input.mousePointer.x;

        if (goToX < 30)
        {
            goToX = 30;
        }
        else if (goToX > 770)
        {
            goToX = 770;
        }

        this.physics.moveTo(this.foot, goToX, this.foot.y, 500);

        if (this.input.enabled == true && this.input.mousePointer.leftButtonDown() && this.isStomping == false && Math.abs(this.foot.y) <= 20)
        {
            this.isStomping = true;
            if (this.stompSound.isPlaying == false)
            {
                this.stompSound.play(soundEffectConfig);
            }
        }

        if (this.isStomping == true)
        {
            this.physics.moveTo(this.foot, this.foot.x, 300, 500);
            if (Math.abs(this.foot.y - 300) <= 10)
            {
                this.isStomping = false;
            }
        }

        else
        {
            if (Math.abs(this.foot.y) >= 10)
            {
                this.physics.moveTo(this.foot, this.foot.x, 10, 500);
            }
        }
    }
});