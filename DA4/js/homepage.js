var homePageScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    popUpTimer: null,
    chickenIcon : null,
    virusIcon : null,
    popUps : [],
    popUpSound : null,
    downloadSound : null,
    ignoreSound : null,
    mainMusic : null,


    initialize: function homePageScene()
    {
        Phaser.Scene.call(this, {key: "homePageScene"});
    },

    onMouse: function(pointer, gameObject, event)
    {
        if (gameObject == this.chickenIcon)
        {
            this.scene.get("chickenGameScene").changeScene();
        }
        else if (gameObject == this.virusIcon)
        {
            this.scene.get("stompGameScene").changeScene();
        }

        else
        {
            for (var i = 0; i < this.popUps.length; i++)
            {
                var currentPopUp = this.popUps[i];
                if (currentPopUp["download"] == gameObject)
                {
                    currentPopUp["background"].destroy();
                    currentPopUp["download"].destroy();
                    currentPopUp["ignore"].destroy();
                    this.popUps.splice(i, 1);
                    currentPopUps--;
                    downloads++;
                    this.onPopUp();
                    this.onPopUp();
                    this.downloadSound.play(soundEffectConfig);
                }
                else if (currentPopUp["ignore"] == gameObject)
                {
                    currentPopUp["background"].destroy();
                    currentPopUp["download"].destroy();
                    currentPopUp["ignore"].destroy();
                    this.popUps.splice(i, 1);
                    currentPopUps--;
                    ignores++;
                    this.ignoreSound.play(soundEffectConfig);
                }
            }
        }
    },

    onPopUp: function()
    {
        this.popUpSound.play(soundEffectConfig);
        currentPopUps++;
        var rand = this.setRandPos();
        var popUp = this.add.sprite(rand[0], rand[1], "popUp");
        var ignoreButton;
        var downloadButton;

        var leftButtonCoordX = popUp.x - 56;
        var leftButtonCoordY = popUp.y + 55;
        var rightButtonCoordX = popUp.x + 55;
        var rightButtonCoordY = popUp.y + 47;

        var rand2 = Phaser.Math.Between(0, 1);
        var rand3 = Phaser.Math.Between(1, 2);
        var rand4 = Phaser.Math.Between(1, 2);
        
        var ignoreButtonName = "ignoreButton";
        var downloadButtonName = "downloadButton";

        ignoreButtonName += "" + rand3;
        downloadButtonName += "" + rand4;

        var ignoreButton, downloadButton;

        if (rand2 == 0)
        {
            ignoreButton = this.add.sprite(leftButtonCoordX, leftButtonCoordY, ignoreButtonName);
            downloadButton = this.add.sprite(rightButtonCoordX, rightButtonCoordY, downloadButtonName);
        }
        else
        {
            ignoreButton = this.add.sprite(rightButtonCoordX, rightButtonCoordY, ignoreButtonName);
            downloadButton = this.add.sprite(leftButtonCoordX, leftButtonCoordY, downloadButtonName);
        }

        ignoreButton.setInteractive({useHandCursor: true});
        downloadButton.setInteractive({useHandCursor: true});

        this.popUps.push({"background": popUp, "ignore": ignoreButton, "download": downloadButton});
    },

    preload: function()
    {

    },

    setRandPos: function()
    {
        return [Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500)];
    },

    create: function()
    {
        this.sound.stopAll();
        this.mainMusic = this.sound.add("beautyFlow");
        this.mainMusic.play(musicConfig);

        this.scene.launch("chickenGameScene");
        this.scene.launch("stompGameScene");
        this.add.sprite(400, 300, "homepage");

        this.input.on("gameobjectdown", this.onMouse, this);
        this.input.setPollAlways();

        this.popUpSound = this.sound.add("popUpSound");
        this.ignoreSound = this.sound.add("ignoreSound");
        this.downloadSound = this.sound.add("downloadSound");

        var rand1 = this.setRandPos();
        var rand2 = this.setRandPos();

        this.chickenIcon = this.add.sprite(rand1[0], rand1[1], "chickenIcon");
        this.virusIcon = this.add.sprite(rand2[0], rand2[1], "virusIcon");
        this.chickenIcon.setInteractive({useHandCursor: true});
        this.virusIcon.setInteractive({useHandCursor: true});


        this.popUpTimer = this.time.addEvent({delay: popUpSpawnRate, callback: this.onPopUp, callbackScope: this, loop: true});
    },

    changeScene: function()
    {
        this.scene.setVisible(false, "chickenGameScene");
        this.scene.get("chickenGameScene").input.enabled = false;

        this.scene.setVisible(false, "stompGameScene");
        this.scene.get("stompGameScene").input.enabled = false;

        this.scene.setVisible(true);
        this.input.enabled = true;

        var rand1 = this.setRandPos();
        var rand2 = this.setRandPos();

        this.chickenIcon.setPosition(rand1[0], rand1[1]);
        this.virusIcon.setPosition(rand2[0], rand2[1]);
    },

    update: function(time, delta)
    {
        if (startTime == null)
        {
            startTime = time;
        }

        endTime = time;
        if (currentViruses > maxViruses)
        {
            this.scene.stop("chickenGameScene");
            this.scene.stop("stompGameScene");
            this.scene.start("endScene", false);
        }

        else if (grabbedEggs > neededEggs)
        {
            this.scene.stop("chickenGameScene");
            this.scene.stop("stompGameScene");
            this.scene.start("endScene", true);
        }
    }
});