class SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        this.sprite = sprite;
        this.spriteOverhead = spriteOverhead;
        this.spriteOverhead.setVisible(false);
        this.scene = scene;

        this.isVisible = true; //whether the sprite is visible or not
        this.isEnabled = true; //whether the physics is enabled or not (includes collisions)
        this.isRunning = true; //whether the update function is called or not
    }

    changePerspective()
    {
        if (this.sprite.visible == true) //switching from side view to top down view
        {
            if (this.isEnabled)
            {
                this.sprite.body.setEnable(false);
                this.spriteOverhead.body.setEnable(true);
            }
            if (this.isVisible)
            {
                this.sprite.setVisible(false);
                this.spriteOverhead.setVisible(true);
            }
            
            this.spriteOverhead.setPosition(this.sprite.x, this.spriteOverhead.y);
        }
        else //switching from top down view to side view
        {
            if (this.isEnabled)
            {
                this.spriteOverhead.body.setEnable(false);
                this.sprite.body.setEnable(true);
            }
            if (this.isVisible)
            {
                this.sprite.setVisible(true);
                this.spriteOverhead.setVisible(false);    
            }

            this.sprite.setPosition(this.spriteOverhead.x, this.sprite.y);
        }
    }

    getX()
    {
        return this.sprite.x; //or this.spriteOverhead.y
    }
    getY()
    {
        return this.spriteOverhead.y;
    }
    getZ()
    {
        return this.sprite.y;
    }

    setVelocityX(num)
    {
        this.sprite.body.setVelocityX(num);
    }

    destroy()
    {
        this.sprite.destroy();
        this.spriteOverhead.destroy();
        this.scene = null;
    }

    update(time, delta)
    {

    }

    updateOverhead(time, delta)
    {

    }

    createColliders(otherObjects, indexToIgnore) //for performance any object which doesn't need collision can override this with an empty function
    {
        for (var i = 0; i < otherObjects.length; i++)
        {
            if (i == indexToIgnore) i++;
            this.createCollider(otherObjects[i]);
        }
    }

    overlapTest()
    {

    }

    createCollider(object) //should be overriden by every object which wants to have collision
    {

    }

    setInvisible()
    {
        this.isVisible = false;
        this.sprite.setVisible(false);
        this.spriteOverhead.setVisible(false);
    }

    disable()
    {
        this.isEnabled = false;
        this.sprite.body.setEnable(false);
        this.spriteOverhead.body.setEnable(false);
    }

    stopRunning()
    {
        this.isRunning = false;
    }

    die(animation, overheadAnimation, time)
    {
        if (animation != null && overheadAnimation != null)
        {
            this.sprite.anims.play(animation);
            this.spriteOverhead.anims.play(overheadAnimation);
        }

        if (time != null)
        {
            this.scene.time.addEvent({"delay": time, "callback": this.terminate, "callbackScope": this});
        }
        else
        {
            this.terminate();
        }
    }

    terminate()
    {

    }
}

class Player extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        this.isDying = false;
        this.isStuck = false;
        this.touchingLadder = false;
        this.scene.physics.add.collider(this.sprite, this.scene.spikeLayer, this.touchedEnemy, null, this);
        this.scene.physics.add.collider(this.spriteOverhead, this.scene.overheadSpikeLayer, this.touchedEnemy, null, this);
    }
    
    update(time, delta)
    {
        if (this.isStuck == false)
        {
            if (this.scene.cursors.left.isDown || this.scene.keys.A.isDown)
            {
                this.setVelocityX(-160);
                this.sprite.setFlipX(true);
        
                this.sprite.anims.play('playerMove', true);
            }
        
            else if (this.scene.cursors.right.isDown || this.scene.keys.D.isDown)
            {
                this.setVelocityX(160);
                this.sprite.setFlipX(false);
        
                this.sprite.anims.play('playerMove', true);
            }
        
            else
            {
                this.setVelocityX(0);
                
                this.sprite.anims.play('playerIdle', true);
            }
    
            if (this.touchingLadder) //behavior if touching a ladder
            {
                if (this.scene.cursors.up.isDown || this.scene.keys.W.isDown || this.scene.keys.SPACE.isDown) //up
                {
                    this.sprite.body.setVelocityY(-50);
                    this.sprite.anims.play('playerClimb', true);
                }
                else if (this.scene.cursors.down.isDown || this.scene.keys.S.isDown) //down
                {
                    this.sprite.body.setVelocityY(50);
                    this.sprite.anims.play('playerClimb', true);
                }
                else if (this.scene.keys.SPACE.isDown) //space
                {
                    this.sprite.body.setVelocityY(-300);
                    this.sprite.anims.play('playerJump', true);
                }
                else
                {
                    this.sprite.body.setVelocityY(0);
                }
            }
    
            else if ((this.scene.cursors.up.isDown || this.scene.keys.W.isDown || this.scene.keys.SPACE.isDown) && this.sprite.body.onFloor()) //behavior if not touching a ladder, and is on ground
            {
                this.sprite.body.setVelocityY(-300);
                this.sprite.anims.play('playerJump', true);
                this.scene.jumpSound.play();
            }
    
            this.touchingLadder = false;
        }

    }

    updateOverhead(time, delta)
    {
        if (this.isStuck == false)
        {
            if (this.scene.cursors.left.isDown || this.scene.keys.A.isDown)
            {
                this.spriteOverhead.body.setVelocityX(-160);
                //this.spriteOverhead.setFlipX(true);
                this.spriteOverhead.setAngle(180);
        
                this.spriteOverhead.anims.play('playerOverheadMove', true);
            }
        
            else if (this.scene.cursors.right.isDown || this.scene.keys.D.isDown)
            {
                this.spriteOverhead.body.setVelocityX(160);
                //this.spriteOverhead.setFlipX(false);
                this.spriteOverhead.setAngle(0);
        
                this.spriteOverhead.anims.play('playerOverheadMove', true);
            }
            else
            {
                this.spriteOverhead.body.setVelocityX(0);
            }
    
            if (this.scene.cursors.up.isDown || this.scene.keys.W.isDown)
            {
                this.spriteOverhead.body.setVelocityY(-160);
                this.spriteOverhead.setAngle(270);
    
                this.spriteOverhead.anims.play('playerOverheadMove', true);
            }
    
            else if (this.scene.cursors.down.isDown || this.scene.keys.S.isDown)
            {
                this.spriteOverhead.body.setVelocityY(160);
                this.spriteOverhead.setAngle(90);
        
                this.spriteOverhead.anims.play('playerOverheadMove', true);
            }
            else
            {
                this.spriteOverhead.body.setVelocityY(0);
            }
        }
       
    }

    createCollider(object)
    {
        if (object instanceof Enemy1 || object instanceof Enemy2)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedEnemy, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedEnemy, null, this);
        }
        else if (object instanceof Goal)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedGoal, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedGoal, null, this);
        }
        else if (object instanceof Ladder)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedLadder, null, this);
        }
        else if (object instanceof Keyhole)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, null, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, null, null, this);
        }
    }

    overlapTest()
    {
        this.isStuck = false;
        this.sprite.body.allowGravity = true;
        if (!this.scene.isOverhead) //currently sideways, switching to overhead
        {
            var overlapSpike = this.scene.overheadSpikeLayer.getTileAtWorldXY(this.spriteOverhead.x, this.spriteOverhead.y) != null;
            var overlapGround = this.scene.overheadPitLayer.getTileAtWorldXY(this.spriteOverhead.x, this.spriteOverhead.y) != null;
            var overlappingKeyhole = false;

            for (var i = 0; i < this.scene.objects.length; i++)
            {
                var obj = this.scene.objects[i];
                if (obj instanceof Keyhole && obj.isEnabled == true)
                {
                    overlappingKeyhole = (Math.abs(this.spriteOverhead.x - obj.spriteOverhead.x) <= 28 && Math.abs(this.spriteOverhead.y - obj.spriteOverhead.y) <= 28);
                    if (overlappingKeyhole) break;
                }
            }

            if (overlapSpike)
            {
                this.touchedEnemy();
            }
            else if (overlapGround || overlappingKeyhole)
            {
                this.isStuck = true;
            }
        }
        else //currently overhead, switching to sideways
        {
            var overlapGround = this.scene.groundLayer.getTileAtWorldXY(this.sprite.x, this.sprite.y) != null;
            var overlapSpike = this.scene.spikeLayer.getTileAtWorldXY(this.sprite.x, this.sprite.y) != null;
            var overlappingKeyhole = false;

            for (var i = 0; i < this.scene.objects.length; i++)
            {
                var obj = this.scene.objects[i];
                if (obj instanceof Keyhole && obj.isEnabled == true)
                {
                    overlappingKeyhole = (Math.abs(this.sprite.x - obj.sprite.x) <= 28 && Math.abs(this.sprite.y - obj.sprite.y) <= 28);
                    if (overlappingKeyhole) break;
                }
            }

            if (overlapSpike)
            {
                this.touchedEnemy();
            }
            else if (overlapGround || overlappingKeyhole)
            {
                this.isStuck = true;
                this.sprite.body.allowGravity = false;
                this.sprite.body.setVelocity(0, 0);
            }
        }
    }

    spawnProjectile()
    {

    }

    spawnProjectileOverhead()
    {
        
    }

    touchedEnemy()
    {
        if (this.isDying == false)
        {
            this.scene.keys.E.off("up");
            this.stopRunning();
            this.disable();
            this.die("playerDeath", "playerOverheadDeath", 1000);
            this.scene.playerDeathSound.play();
        }
        this.isDying = true;
    }

    terminate()
    {
        this.scene.changeLevel(this.scene.level)
    }

    touchedGoal()
    {
        //this.scene.changeLevel("level" + (this.scene.level[this.scene.level.length - 1] + 1));
    }

    touchedLadder()
    {
        this.touchingLadder = true;
        this.sprite.body.setGravityY(0);
    }
}

class Enemy1 extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        this.isDying = false;
        this.scene.physics.add.collider(this.sprite, this.scene.spikeLayer, this.touchedEnemy, null, this);
        this.scene.physics.add.collider(this.spriteOverhead, this.scene.overheadSpikeLayer, this.touchedEnemy, null, this);
    }

    createCollider(object)
    {
        if (object instanceof Pellet)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedEnemy, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedEnemy, null, this);
        }

        if (object instanceof Enemy1 || object instanceof Enemy2)
        {
            this.scene.physics.add.collider(this.sprite, object.sprite, null, null, this);
            this.scene.physics.add.collider(this.spriteOverhead, object.spriteOverhead, null, null, this);
        }
    }

    overlapTest()
    {
        var overlapNormal = this.scene.spikeLayer.getTileAtWorldXY(this.sprite.x, this.sprite.y) != null;
        var overlapOverhead = this.scene.overheadSpikeLayer.getTileAtWorldXY(this.spriteOverhead.x, this.spriteOverhead.y) != null;
        
        if (overlapNormal || overlapOverhead)
        {
            this.touchedEnemy();
        }
    }


    touchedEnemy()
    {
        if (this.isDying == false)
        {
            this.stopRunning();
            this.disable();
            this.die("enemy1Death", "enemy1OverheadDeath", 1000);
            this.scene.enemyDeathSound.play();
        }
        this.isDying = true;
    }
    
    update(time, delta)
    {
        this.sprite.body.setVelocityX(-50);
        this.sprite.anims.play('enemy1Move', true);
        this.sprite.setFlipX(true);
    }

    updateOverhead(time, delta)
    {
        this.spriteOverhead.body.setVelocityX(-50);
        this.spriteOverhead.anims.play('enemy1OverheadMove', true);
        this.spriteOverhead.setFlipX(true);
    }
}

class Enemy2 extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        this.isDying = false;
        this.scene.physics.add.collider(this.sprite, this.scene.spikeLayer, this.touchedEnemy, null, this);
        this.scene.physics.add.collider(this.spriteOverhead, this.scene.overheadSpikeLayer, this.touchedEnemy, null, this);
    }

    createCollider(object)
    {
        if (object instanceof Pellet)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedEnemy, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedEnemy, null, this);
        }
    }

    overlapTest()
    {
        var overlapNormal = this.scene.spikeLayer.getTileAtWorldXY(this.sprite.x, this.sprite.y) != null;
        var overlapOverhead = this.scene.overheadSpikeLayer.getTileAtWorldXY(this.spriteOverhead.x, this.spriteOverhead.y) != null;
        
        if (overlapNormal || overlapOverhead)
        {
            this.touchedEnemy();
        }
    }


    touchedEnemy()
    {
        if (this.isDying == false)
        {
            this.stopRunning();
            this.disable();
            this.die("enemy2Death", "enemy2OverheadDeath", 1000);
            this.scene.enemyDeathSound.play();
        }
        this.isDying = true;
    }

    update(time, delta)
    {
        this.sprite.body.setVelocityX(50);
        this.sprite.anims.play('enemy2Move', true);
    }

    updateOverhead(time, delta)
    {
        this.spriteOverhead.body.setVelocityX(50);
        this.spriteOverhead.anims.play('enemy1OverheadMove', true);
    }
}

class Goal extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);
        this.isOpen = true;
        this.buttonArr = [];

        this.sprite.body.setImmovable(true);
        this.spriteOverhead.body.setImmovable(true);
    }

    createCollider(object)
    {
        if (object instanceof Player)
        {
            this.scene.physics.add.collider(this.sprite, object.sprite, this.touchedPlayer, null, this);
            this.scene.physics.add.collider(this.spriteOverhead, object.spriteOverhead, this.touchedPlayerOverhead, null, this);
        } 
        if (object instanceof Button)
        {
            this.buttonArr.push(object);
        }
    }

    touchedPlayer()
    {
        if (this.isOpen == true)
        {
            this.scene.goalSound.play();
            var goto = this.sprite.getData(0)["value"];
            this.scene.changeLevel(goto);
        }
    }

    checkButtons()
    {
        this.isOpen = true;
        for (var i = 0; i < this.buttonArr.length; i++)
        {
            if (this.buttonArr[i].isPushed == false)
            {
                this.isOpen = false;
            }
        }
        if (this.isOpen == true)
        {
            this.sprite.anims.play("goal");
            this.spriteOverhead.anims.play("goalOverhead");
        }
    }

    touchedPlayerOverhead()
    {
        if (this.isOpen == true)
        {
            this.scene.goalSound.play();
            var goto = this.spriteOverhead.getData(0)["value"];
            this.scene.changeLevel(goto);
        }
    }

    update(time, delta)
    {
        if (this.isOpen == false)
        {
            this.sprite.anims.play("goalClosed");
            this.spriteOverhead.anims.play("goalOverheadClosed");
        }
        else
        {
            this.sprite.anims.play("goal");
            this.spriteOverhead.anims.play("goalOverhead");
        }        
    }

    updateOverhead(time, delta)
    {
        if (this.isOpen == false)
        {
            this.sprite.anims.play("goalClosed");
            this.spriteOverhead.anims.play("goalOverheadClosed");
        }

        if (this.buttonArr.length != 0)
        {
            this.isOpen = false;
        }
        else
        {
            this.sprite.anims.play("goal");
            this.spriteOverhead.anims.play("goalOverhead");
        }
    }
}

class Block extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        //this.sprite.body.setFriction(0);
        //this.spriteOverhead.body.setFriction(0);
    }

    createCollider(object)
    {
        if (object instanceof Player || object instanceof Enemy1 || object instanceof Enemy2 || object instanceof Keyhole || object instanceof Block)
        {
            this.scene.physics.add.collider(this.sprite, object.sprite, null, null, this);
            this.scene.physics.add.collider(this.spriteOverhead, object.spriteOverhead, null, null, this);
        } 
    }

    update(time, delta)
    {
        this.sprite.body.setVelocityX(0);
    }

    updateOverhead(time, delta)
    {
        this.spriteOverhead.body.setVelocity(0, 0);
    }
}

class Keyhole extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        this.sprite.body.setImmovable(true);
        this.spriteOverhead.body.setImmovable(true);
    }

    createCollider(object)
    {
        if (object instanceof Player)
        {
            this.scene.physics.add.collider(this.sprite, object.sprite, this.touchedPlayer, null, this);
            this.scene.physics.add.collider(this.spriteOverhead, object.spriteOverhead, this.touchedPlayerOverhead, null, this);
        }
        else if (object instanceof Enemy1 || object instanceof Enemy2 || object instanceof Block)
        {
            this.scene.physics.add.collider(this.sprite, object.sprite, null, null, this);
            this.scene.physics.add.collider(this.spriteOverhead, object.spriteOverhead, null, null, this);
        }
    }

    touchedPlayer()
    {
        if (this.scene.numKeys >= 1)
        {
            this.scene.numKeys--;
            this.disable();
            this.stopRunning();
            this.setInvisible();
            this.scene.shootSound.play();
        }
    }

    touchedPlayerOverhead()
    {
        if (this.scene.numKeys >= 1)
        {
            this.scene.numKeys--;
            this.disable();
            this.stopRunning();
            this.setInvisible();
            this.scene.shootSound.play();
        }
    }
}

class Button extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);

        this.isPushed = false;
        this.goalRef = null;
    }

    createCollider(object)
    {
        if (object instanceof Enemy1 || object instanceof Enemy2 || object instanceof Player || object instanceof Block)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedObject, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedObject, null, this);
        }
        if (object instanceof Goal)
        {
            this.goalRef = object;
            this.goalRef.checkButtons();
        }
    }

    touchedObject()
    {
        this.isPushed = true;
        this.sprite.anims.play("buttonPushed");
        this.spriteOverhead.anims.play("buttonOverheadPushed");
        this.goalRef.checkButtons();
    }

    update(time, delta)
    {
        if (this.isPushed == false)
        {
            this.sprite.anims.play("buttonIdle");
            this.goalRef.checkButtons();
            this.spriteOverhead.anims.play("buttonOverheadIdle");
        }
        this.isPushed = false;
    }

    updateOverhead(time, delta)
    {
        if (this.isPushed == false)
        {
            this.sprite.anims.play("buttonIdle");
            this.spriteOverhead.anims.play("buttonOverheadIdle");
        }
        this.isPushed = false;
    }
}

class Key extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);
    }

    createCollider(object)
    {
        if (object instanceof Player)
        {
            this.scene.physics.add.overlap(this.sprite, object.sprite, this.touchedPlayer, null, this);
            this.scene.physics.add.overlap(this.spriteOverhead, object.spriteOverhead, this.touchedPlayer, null, this);
        }
    }

    touchedPlayer()
    {
        this.scene.numKeys++;
        this.disable();
        this.stopRunning();
        this.setInvisible();
        this.scene.impactSound.play();
    }
}

class Pellet extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);
    }
}

class Ladder extends SpriteUpdater
{
    constructor(sprite, spriteOverhead, scene)
    {
        super(sprite, spriteOverhead, scene);
        this.sprite.body.allowGravity = false
    }

    createCollider(object)
    {
        if (object instanceof Ladder)
        {
            //this.scene.physics.add.collider(this.sprite, object.sprite, this.pushEvent, null, this);
        } 
    }

    pushEvent()
    {

    }
}

var objectProperties =
{
    "player": {"frame": 0, "frameOverhead": 84, "class": Player},
    "enemy1": {"frame": 24, "frameOverhead": 108, "class": Enemy1},
    "enemy2": {"frame": 36, "frameOverhead": 120, "class": Enemy2},
    "goal": {"frame": 62, "frameOverhead": 146, "class": Goal},
    "block": {"frame": 67, "frameOverhead": 150, "class": Block},
    "keyhole": {"frame": 68, "frameOverhead": 151, "class": Keyhole},
    "button": {"frame": 72, "frameOverhead": 156, "class": Button},
    "key": {"frame": 74, "frameOverhead": 158, "class": Key},
    "pellet": {"frame": 75, "frameOverhead": 160, "class": Pellet},
    "ladder": {"frame": 64, "frameOverhead": 148, "class": Ladder}
}

var zIndices =
{

}