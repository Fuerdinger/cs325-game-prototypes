var files = 
[
    {"dst": "sprites/Tilemap.png", "name": "tilemap", "ext": "img"},
    {"dst": "sprites/Tilemap.png", "name": "tilemapSpriteSheet", "ext": "sheet"},
    {"dst": "sprites/animations.json", "name": "animations", "ext": "anim"},
    {"dst": "options.json", "name": "options", "ext": "json"},
    {"dst": "cutscenes.json", "name": "cutscenes", "ext": "json"},
    {"dst": "sprites/endScreen.png", "name": "endScreen", "ext": "img"},
    {"dst": "cutscenes/Intro.png", "name": "introScreen", "ext": "img"},
    {"dst": "cutscenes/textbox.png", "name": "textBox", "ext": "img"},
    {"dst": "audio/Background.wav", "name": "endTheme", "ext": "sound"},
    {"dst": "audio/Background2.wav", "name": "introTheme", "ext": "sound"},
    {"dst": "audio/Death.wav", "name": "enemyDeathSound", "ext": "sound"},
    {"dst": "audio/Goal.wav", "name": "goalSound", "ext": "sound"},
    {"dst": "audio/Impact.wav", "name": "impactSound", "ext": "sound"},
    {"dst": "audio/Jump.wav", "name": "jumpSound", "ext": "sound"},
    {"dst": "audio/PlayerDeath.wav", "name": "playerDeathSound", "ext": "sound"},
    {"dst": "audio/Shift.wav", "name": "shiftSound", "ext": "sound"},
    {"dst": "audio/Shoot.wav", "name": "shootSound", "ext": "sound"},
];

//var keys;
//var cursors;

var soundEffectConfig = {"volume": 0.5};
var musicConfig = {"volume": 0.2, "loop": true};

var resetKeys = function(keyboard)
{
    if (keyboard != null)
    {
        for (var i = 0; i < keyboard.keys.length; i++)
        {
            if (keyboard.keys[i] != null)
            {
                keyboard.removeKey(keyboard.keys[i], true);
            }
        }
    }
}