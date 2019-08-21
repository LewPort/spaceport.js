import {NPC, Player, npcList} from './characters.js';
import {Text, Title, InfoPanel} from './text.js';
import {ImgAttribute} from './attributes.js';
import {WinConditions} from './rules.js';

// HELLO FRIEND! WELCOME TO SPACEPORT. BELOW WE SHALL BE SETTING OUT THE CLASSES FOR THE PLAYER AND NPCS ETC

//GENERAL GAME BEHAVIOUR TO DO WITH WINDOW BOUNDARIES AND WHAT HAPPENS WHEN YOU GO OFF THE EDGE OF THE SCREEN

class GuideLine{
    constructor(origin, target){
        this.guideOpacity = 0;
        this.guideMaxDistance = 1000;
        this.origin = origin;
        this.target = target;
    }
    draw(){
        this.guideOpacity += (calculateDistance(this.origin.xCentre, this.origin.yCentre, this.target.xCentre, this.target.yCentre)/10) / this.guideMaxDistance/30;
        if (this.guideOpacity >= (calculateDistance(this.origin.xCentre, this.origin.yCentre, this.target.xCentre, this.target.yCentre)/10) / this.guideMaxDistance){
            this.guideOpacity = 0;
        }
        context.beginPath();
        context.moveTo(this.origin.xCentre, this.origin.yCentre);
        context.lineTo(this.target.xCentre, this.target.yCentre);
        context.strokeStyle = 'rgba(0,255,150,' + this.guideOpacity + ')';
        context.stroke();
    }
}  

class TheUniverse {
    constructor(){
        this.frameShiftX = 0;
        this.frameShiftY = 0;
    }
    
    boundaryRules(){
        // ------>
        //left side of ship meeting right side of screen
        if (player.pos.x >= canvas.width){
            player.pos.x = 0;
            this.frameShiftX += 1;
            this.frameShiftUpdate();
        }

        // <-------
        //right side of ship meeting left side of screen
        else if (player.rightSide <= 0){
            player.pos.x = canvas.width - player.size.x;
            this.frameShiftX -= 1;
            this.frameShiftUpdate();
        }
        // vvvvvvvvv
        //top side of ship meeting bottom
        if (player.pos.y >= canvas.height){
            player.pos.y = 0;
            this.frameShiftY += 1;
            this.frameShiftUpdate();
        }
        // ^^^^^^^^^
        //bottom of ship meeting top
        else if (player.bottom <= 0){
            player.pos.y = canvas.height - player.size.y;
            this.frameShiftY -= 1;
            this.frameShiftUpdate();
        }
    }
    
    frameShiftUpdate(){
        for (var i in npcList){
            npcList[i].pos.x -= canvas.width * this.frameShiftX;
            npcList[i].pos.y -= canvas.height * this.frameShiftY;
        }
        this.frameShiftX = 0;
        this.frameShiftY = 0;
    }
    
    
    processTheUniverse(){
        this.boundaryRules();
        this.frameShiftUpdate();
    }
}

//PUSH IMAGES TO AN ARRAY WHEN CREATED, AND SET THEIR '.ONLOAD' BEHAVIOUR



export function calculateDistance(x1, y1, x2, y2){

    return Math.hypot(x2-x1, y2-y1);
}

function handleKeyInputs(event){
        var key = event.keyCode;
        keysdown[key] = true;
    }

function handleKeyRelease(event){
    var key = event.keyCode;
    keysdown[key] = false;
    var thrustKeys = [37,38,39,40];
    var thrustersEngaged = false;
    for (var i in thrustKeys){
        if (keysdown[thrustKeys[i]]){
            thrustersEngaged = true;
        }
    }
    
    if (thrustersEngaged == false){
        player.thrusting = false;
    }
}

function touchStarts(event){  
    var touchevents = event.changedTouches; 
    for (var i in touchevents){
        var x = event.changedTouches[i].clientX;
        var y = event.changedTouches[i].clientY;

        if (x < canvas.width * 0.2){
            if (! touches.left){
                keysdown[37] = true;
            }
        }

        else if (x > canvas.width * 0.8){
            if (! touches.right){
                keysdown[39] = true;
            }
        }
        if (y < canvas.height * 0.2){
            if (! touches.up){
                keysdown[38] = true;
            }
        }

        else if (y > canvas.height * 0.8){
            if (! touches.down){
                keysdown[40] = true;
            }
        }
    }
    console.log(touches)
}

function touchStops(event){
    var touchevents = event.changedTouches;   
    for (var i in touchevents){
        var x = event.changedTouches[i].clientX;
        var y = event.changedTouches[i].clientY;

        if (x < canvas.width * 0.2){
            keysdown[37] = false;
        }

        else if (x > canvas.width * 0.8){
            keysdown[39] = false;
        }
        if (y < canvas.height * 0.2){
            keysdown[38] = false;
        }

        else if (y > canvas.height * 0.8){
            keysdown[40] = false;
        }
    }
    console.log(touches)
}


function handleTouches(){
    for (var i in touches){

        if (touches.left){
            keyCommands[37].bind(player)();
        }

        else if (touches.right){
            keyCommands[39].bind(player)();
        }
        if (touches.up){
            keyCommands[38].bind(player)();
        }

        else if (touches.down){
            keyCommands[40].bind(player)();
        }
    }
}

let lastTime;
function callback(millis, event){
    if(lastTime)
        {
            update((millis - lastTime) / 1000, event);
        }
    lastTime = millis;
    requestAnimationFrame(callback);
}    

function update(dt, event){
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;
    context.drawImage(space_bg, 0,0,canvas.width,canvas.height);
    universe.processTheUniverse.bind(universe)();

    for (var i in keysdown){
        if (keysdown[i] && i in keyCommands){
            keyCommands[i].bind(player)();
        }
    }

//    handleTouches()

    for (var npc in npcList){
        npcList[npc].update(dt);
        npcList[npc].draw();
    }

    player.update(dt);
    guide.draw();
    player.draw();

    winConditions.checkWinCondition();

    panel.draw();
    title.draw();
    if (winConditions.docked){
        var timerStart = + new Date();
        while (+ new Date() < timerStart + 5000){
            bwom.play();
            winMsg.draw();
        }
        winConditions.docked = false;
        return
    }
}

class Level
{
    constructor(player, SS, planets, suns){
        
    }
}

//
// O K  L E T ' S  LOAD IMAGES AND SET UP OUR GAME
//

export const canvas = document.getElementById("mycanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.width = 800;
//canvas.height = 600;
export const context = canvas.getContext("2d");

var _STARTTIME = 0;
var docked = false;


const space_bg = new ImgAttribute();
space_bg.src = 'img/starfield.png';

const music = new Audio('audio/space_music_2_lofi.mp3')
music.preload = true;
const bwom = new Audio('audio/BWOM2.mp3')
bwom.preload = true;

const universe = new TheUniverse();
const sun = new NPC('img/SunRed.png',
                    0,
                    0,
                    10000,
                    1600,
                    1600,
                    -1000, -1000,
                   -0.01);
const planet1 = new NPC('img/planet1.png', 0,
                         0,
                         500,
                         500,
                         500,
                         1000, 1000,
                       0.02);
const SS1 = new NPC('img/SS1.png', 
                    canvas.width/4,
                     canvas.height/4,
                     1,
                     1024,
                     1024,
                     25, 25,
                     0.1);
const player = new Player('img/spaceship.png',
                        canvas.width/2,
                        canvas.height/2,
                        1,
                        30,
                        30,
                        5, 5);

export const winConditions = new WinConditions(player, SS1, 4);

var title = new Title(5, 'S P A C E P O R T   I I', '255,255,255');
var winMsg = new Title(5, 'D O C K E D', '0,255,155')
export var startTime = + new Date();
var panel = new InfoPanel(player, SS1);
var guide = new GuideLine(player, SS1);

var keyCommands = {
    37: player.thrust.left,
    38: player.thrust.up,
    39: player.thrust.right,
    40: player.thrust.down,
    65: player.thrust.left,
    87: player.thrust.up,
    68: player.thrust.right,
    83: player.thrust.down
};

var keysdown = {} //create bool for each key in keyCommands
for (var i in keyCommands){
    keysdown[i] = false;
}

var touches = {up: false, right: false, down: false, left: false};

var playMusic = true;
music.volume = 0.4;
music.loop = true;
music.loop = true;


document.addEventListener("keydown", handleKeyInputs);
document.addEventListener("keyup", handleKeyRelease);
document.addEventListener("touchstart", touchStarts);
document.addEventListener("touchend", touchStops);

canvas.onclick = function startGame(){
    if (_STARTTIME == 0){
        _STARTTIME = + new Date()
        if (playMusic){
            music.play();
        }
        bwom.play();
        callback();
    }
}