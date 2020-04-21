var levelScene = new Phaser.Class
({
    Extends: Phaser.Scene,

    map: null,
    backgroundLayer: null,
    groundLayer: null,
    overheadLayer: null,
    overheadPitLayer: null,
    spikeLayer: null,
    overheadSpikeLayer: null,

    level: null,
    isOverhead: false,
    isPaused: false,

    numKeys: null,

    enemyDeathSound: null,
    goalSound: null,
    impactSound: null,
    jumpSound: null,
    playerDeathSound: null,
    shiftSound: null,
    shootSound: null,

    objects: [],

    initialize: function loadScene()
    {
        Phaser.Scene.call(this, {key: "levelScene"});
    },

    enableSprite: function(sprite)
    {
        this.physics.world.enable(sprite, 0);
        sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(sprite, this.groundLayer);
    },
    
    enableOverheadSprite: function(sprite)
    {
        this.physics.world.enable(sprite, 0);
        sprite.body.setCollideWorldBounds(true);
        sprite.body.allowGravity = false;
        this.physics.add.collider(sprite, this.overheadPitLayer);
    },

    createObjects: function(objectName)
    {
        var objs = this.map.createFromObjects("Objects", objectName, {key: "tilemapSpriteSheet", frame: objectProperties[objectName]["frame"]});
        var objsOverhead = this.map.createFromObjects("ObjectsOverhead", objectName, {key: "tilemapSpriteSheet", frame: objectProperties[objectName]["frameOverhead"]});

        var dict = {};
        
        for (var i = 0; i < objs.length; i++)
        {
            this.enableSprite(objs[i]);
            var currentSet = dict[objs[i].x];
            if (currentSet == null) dict[objs[i].x] = [ [], [] ]; //0 for side sprites, 1 for overhead sprites
            dict[objs[i].x][0].push(objs[i]);
        }

        for (var i = 0; i < objsOverhead.length; i++)
        {
            this.enableOverheadSprite(objsOverhead[i]);
            dict[objsOverhead[i].x][1].push(objsOverhead[i]); //this might be dangerous, but it assumes that all overhead tiles match with a side tile
        }

        for (var key in dict)
        {
            var obj = dict[key];
            for (var i = 0; i < obj[0].length || i < obj[1].length; i++)
            {
                if (i >= obj[0].length) //there are more overhead objects than side objects
                {
                    var newSideSprite = this.physics.add.sprite(obj[0][0].x, obj[0][0].y, "tilemapSpriteSheet", objectProperties[objectName]["frame"]); //obj[0][0];
                    this.enableSprite(newSideSprite);

                    var myObj = new objectProperties[objectName]["class"](newSideSprite, obj[1][i], this);
                    this.objects.push(myObj);

                }
                else if (i >= obj[1].length) //there are more side objects than overhead objects
                {
                    var newOverheadSprite = this.physics.add.sprite(obj[1][0].x, obj[1][0].y, "tilemapSpriteSheet", objectProperties[objectName]["frameOverhead"]); //obj[1][0];
                    this.enableOverheadSprite(newOverheadSprite);

                    var myObj = new objectProperties[objectName]["class"](obj[0][i], newOverheadSprite, this);
                    this.objects.push(myObj);
                }
                else //objects are in equilibrium (note that you might see buggy behavior if you try to create a 2x2x2 object)
                {
                    var myObj = new objectProperties[objectName]["class"](obj[0][i], obj[1][i], this);
                    this.objects.push(myObj);
                }
            }
        }
    },

    createColliders: function()
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].createColliders(this.objects, i);
        }
    },

    changeLevel: function(levelName)
    {
        /*
        this.map.destroy();
        this.backgroundLayer.destroy();
        this.groundLayer.destroy();
        this.overheadLayer.destroy();
        this.overheadPitLayer.destroy();
        this.spikeLayer.destroy();
        this.overheadSpikeLayer.destroy();
        this.level = null;*/
        
        keys.E.off("up");
        //keys.Q.off("up");

        /*
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].destroy();
        }

        this.objects = [];
        this.isOverhead = false;
        this.isPaused = false;
        */
        this.scene.start("levelScene", levelName, false);
    },

    create: function(level, playCutscene)
    {
        this.level = null;
        this.objects = [];
        this.isOverhead = false;
        this.isPaused = false;
        this.numKeys = 0;

        this.enemyDeathSound = this.sound.add("enemyDeathSound");
        this.goalSound = this.sound.add("goalSound");
        this.impactSound = this.sound.add("impactSound");
        this.jumpSound = this.sound.add("jumpSound");
        this.playerDeathSound = this.sound.add("playerDeathSound");
        this.shiftSound = this.sound.add("shiftSound");
        this.shootSound = this.sound.add("shootSound");

        if (level == "endScene")
        {
            this.scene.start("endScene");
            return;
        }
        var hasCutscene = this.cache.json.get("cutscenes")["cutscenes"][level];
        if (hasCutscene && playCutscene)
        {
            this.scene.launch("cutScene", level);
            this.scene.sleep();
        }

        this.level = level;
        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys("W, A, S, D, E, Q, SPACE");

        keys.E.on("up", this.changePerspective, this);
        //keys.Q.on("up", this.pause, this);

        this.map = this.add.tilemap(level);
        var tileset = this.map.addTilesetImage("ShiftTilemap", "tilemap");

        this.backgroundLayer = this.map.createStaticLayer("Background", tileset);
        this.groundLayer = this.map.createStaticLayer("Static", tileset);
        this.groundLayer.setCollisionByExclusion(-1, true);

        this.overheadLayer = this.map.createStaticLayer("Overhead", tileset);
        this.overheadPitLayer = this.map.createStaticLayer("OverheadPits", tileset);
        this.overheadPitLayer.setCollisionByExclusion(-1, true);

        this.overheadLayer.setVisible(false);
        this.overheadPitLayer.setVisible(false);

        this.spikeLayer = this.map.createStaticLayer("Spikes", tileset);
        this.spikeLayer.setCollisionByExclusion(-1, true);
        this.overheadSpikeLayer = this.map.createStaticLayer("SpikesOverhead", tileset);
        this.overheadSpikeLayer.setCollisionByExclusion(-1, true);
        
        this.overheadSpikeLayer.setVisible(false);

        for (var key in objectProperties)
        {
            this.createObjects(key);
        }

        this.createColliders();
        
    },

    update: function(time, delta)
    {
        if (!this.isPaused)
        {
            for (var i = 0; i < this.objects.length; i++)
            {
                if (this.objects[i].isRunning)
                {
                    if (this.isOverhead)
                    {
                        this.objects[i].updateOverhead(time, delta);
                    }
                    else
                    {
                        this.objects[i].update(time, delta);
                    }
                }                
            }
        }
    },

    changePerspective: function()
    {
        this.shiftSound.play();
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].changePerspective();
        }

        if (this.isOverhead == true)
        {
            this.isOverhead = false;
            this.groundLayer.setVisible(true);
            this.backgroundLayer.setVisible(true);
            this.spikeLayer.setVisible(true);
            this.overheadLayer.setVisible(false);
            this.overheadPitLayer.setVisible(false);
            this.overheadSpikeLayer.setVisible(false);
            
        }
        else
        {
            this.isOverhead = true;
            this.groundLayer.setVisible(false);
            this.backgroundLayer.setVisible(false);
            this.spikeLayer.setVisible(false);
            this.overheadLayer.setVisible(true);
            this.overheadPitLayer.setVisible(true);
            this.overheadSpikeLayer.setVisible(true);
        } 
    },

    pause: function()
    {
        if (this.isPaused == true) this.isPaused = false;
        else this.isPaused = true;
    }
    
});