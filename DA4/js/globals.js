var files = 
[
    {"dst": "Ad.png", "name": "popUp", "ext": "img"}, 
    {"dst": "Chickenexe.png", "name": "chickenIcon", "ext": "img"},
    {"dst": "ChickenFace.png", "name": "chickenFace", "ext": "img"},
    {"dst": "ChickenSadFace.png", "name": "chickenSadFace", "ext": "img"},
    {"dst": "ChickenScene.png", "name": "chickenGame", "ext": "img"},
    {"dst": "DeadVirus.png", "name": "deadVirus", "ext": "img"},
    {"dst": "Download.png", "name": "downloadButton1", "ext": "img"},
    {"dst": "Download2.png", "name": "downloadButton2", "ext": "img"},
    {"dst": "Egg.png", "name": "egg", "ext": "img"},
    {"dst": "Foot.png", "name": "foot", "ext": "img"},
    {"dst": "Homepage.png", "name": "homepage", "ext": "img"},
    {"dst": "Ignore.png", "name": "ignoreButton1", "ext": "img"},
    {"dst": "Ignore2.png", "name": "ignoreButton2", "ext": "img"},
    {"dst": "textbox.png", "name": "textBox", "ext": "img"},
    {"dst": "Virus.png", "name": "virus", "ext": "img"},
    {"dst": "Virusexe.png", "name": "virusIcon", "ext": "img"},
    {"dst": "Window.png", "name": "window", "ext": "img"},
    {"dst": "VegasGlitz.mp3", "name": "vegasGlitz", "ext": "sound"},
    {"dst": "BeautyFlow.mp3", "name": "beautyFlow", "ext": "sound"},
    {"dst": "Bag.png", "name": "bag", "ext": "img"},
    {"dst": "RedX.png", "name": "X", "ext": "img"},
    {"dst": "White.png", "name": "whiteBackground", "ext": "img"},
    {"dst": "Download.wav", "name": "downloadSound", "ext": "sound"},
    {"dst": "Egg.wav", "name": "eggSound", "ext": "sound"},
    {"dst": "Ok.wav", "name": "ignoreSound", "ext": "sound"},
    {"dst": "Ouch.wav", "name": "virusKillSound", "ext": "sound"},
    {"dst": "Stomp.wav", "name": "stompSound", "ext": "sound"},
    {"dst": "ThatsTheStuff.wav", "name": "basketSound", "ext": "sound"},
    {"dst": "VirusAlert.wav", "name": "popUpSound", "ext": "sound"},
    {"dst": "VirusOverload.wav", "name": "virusOverloadSound", "ext": "sound"},
    {"dst": "VictorySound.wav", "name": "victorySound", "ext": "sound"},
    {"dst": "FailureSound.wav", "name": "failureSound", "ext": "sound"}
];

var virusSpawnRate = 750;
var eggSpawnRate = 1000;
var popUpSpawnRate = 3000;
var grabbedEggs = 0;
var neededEggs = 25;
var killedViruses = 0;
var virusSpeed = 100;
var downloads = 0;
var ignores = 0;
var currentPopUps = 0;
var currentViruses = 0;
var maxViruses = 20;
var soundEffectConfig = {"volume": 0.5};
var musicConfig = {"volume": 0.2, "loop": true};

var endTime = null;
var startTime = null;