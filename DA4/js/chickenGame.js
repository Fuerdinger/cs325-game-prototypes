var chickenGameScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    eggTimer: null,
    eggs: [],
    bag: null,
    redX: null,
    eggSound : null,
    basketSound : null,

    initialize: function chickenGameScene()
    {
        Phaser.Scene.call(this, {key: "chickenGameScene"});
    },

    onEggTimer: function()
    {
        var egg = this.physics.add.sprite(178, 154, "egg");
        //this.eggs[eggs.length - 1].on("pointerdown", onEggTouch, this);
        egg.setCollideWorldBounds(true);
        egg.setInteractive({useHandCursor: true});
        //egg.once("pointerover", this.onEggTouch, this);
        egg.setData("followingMouse", false);
        egg.body.onWorldBounds = true;
        
        this.physics.add.overlap(egg, this.bag, this.onEggTouchBag, null, this);

        this.eggs.push(egg);

    },

    onMouse: function(pointer, gameObject, event)
    {
        if (gameObject == this.redX)
        {
            this.scene.get("homePageScene").changeScene();
        }
        else
        {
            if (gameObject.getData("followingMouse") == false)
            {
                this.eggSound.play(soundEffectConfig);
            }
            gameObject.setData("followingMouse", true);
        } 
    },

    onEggTouchGround: function(egg)
    {
        var deadEgg = this.eggs.splice(this.eggs.indexOf(egg), 1);
        deadEgg[0].destroy();
    },

    onEggTouchBag: function(egg, bag)
    {
        this.basketSound.play(soundEffectConfig);
        var deadEgg = this.eggs.splice(this.eggs.indexOf(egg), 1);
        deadEgg[0].destroy();
        grabbedEggs++;
    },

    preload: function()
    {

    },

    create: function()
    {
        this.eggTimer = this.time.addEvent({delay: eggSpawnRate, callback: this.onEggTimer, callbackScope: this, loop: true});
        this.physics.world.on("worldbounds", this.onEggTouchGround, this);

        this.input.on("gameobjectdown", this.onMouse, this);
        this.input.setPollAlways();

        this.eggSound = this.sound.add("eggSound");
        this.basketSound = this.sound.add("basketSound");

        this.add.sprite(400, 300, "chickenGame");
        this.add.sprite(400, 300, "window");
        this.bag = this.physics.add.sprite(588, 516, "bag");

        this.add.text(0, 0, "prepare-payload.chkn").setColor("black");
        
        this.redX = this.add.sprite(765, 16, "X");
        this.redX.setInteractive({useHandCursor: true});

        this.scene.get("homePageScene").changeScene();
    },

    changeScene: function()
    {
        this.scene.setVisible(false, "homePageScene");
        this.scene.get("homePageScene").input.enabled = false;
        
        this.scene.setVisible(false, "stompGameScene");
        this.scene.get("stompGameScene").input.enabled = false;

        this.scene.setVisible(true);
        this.input.enabled = true;
    },

    update: function()
    {
        for (var i = 0; i < this.eggs.length; i++)
        {
            if (this.eggs[i].getData("followingMouse") == false)
            {
                this.eggs[i].setVelocity(0, 400);
            }
            else
            {
                this.physics.moveToObject(this.eggs[i], this.input.mousePointer, 500);
            }
        }
    }
});