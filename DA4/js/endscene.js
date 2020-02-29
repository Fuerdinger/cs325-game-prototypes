var endScene = new Phaser.Class
({
    Extends: Phaser.Scene,
    initialize: function endScene()
    {
        Phaser.Scene.call(this, {key: "endScene"});
    },

    preload: function()
    {
        
    },

    create: function(victory)
    {
        this.sound.stopAll();
        if (victory == true)
        {
            this.add.sprite(400, 300, "Tutorial0");
            this.add.text(10, 0, "You won! Good clucking job!").setColor("red");
            this.sound.add("victorySound").play(soundEffectConfig);
        }
        else
        {
            this.add.sprite(400, 300, "chickenSadFace");
            this.add.text(10, 0, "You really clucked up this time. Failure!").setColor("red");;
            this.sound.add("failureSound").play(soundEffectConfig);
        }

        var gameOverText = 
        ["Results:", 
        "Ignored Pop Ups: " + ignores, 
        "Downloaded Pop Ups: " + downloads, 
        "Killed Viruses: " + killedViruses, 
        "Viruses Left: " + (maxViruses - currentViruses + 1), 
        "Grabbed Eggs: " + grabbedEggs, 
        "Eggs left: " + (neededEggs - grabbedEggs + 1), 
        "Time: " + (Math.round((endTime - startTime)/1000) + " seconds"),
        "Press F5 to play again!"];
        
        for (var i = 0; i < gameOverText.length; i++)
        {
            this.add.text(10, (i + 1) * 40, gameOverText[i]).setColor("red");;
        }
    }
});