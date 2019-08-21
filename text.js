import {canvas, startTime, winConditions, calculateDistance, context} from './main.js';
import {WinConditions} from './rules.js';
import {Vec} from './characters.js';

// DRAW SOME TEXT N THAT

export class Text{
    constructor(x, y, colour, align='left', font, stroketext=false, thickness=1, text){
        this.pos = new Vec(x,y);
        this.colour = colour;
        this.align = align;
        this.font = font;
        this.thickness = thickness
        this.text = text;
        this.strokeText = stroketext;
    }
    
    draw(){
        context.textAlign = this.align;
        context.font = this.font;
        if (this.strokeText){
            context.lineWidth = this.thickness;
            context.strokeStyle = this.colour;
            context.strokeText(this.text, this.pos.x, this.pos.y, canvas.width);
        }
        else{
            context.fillStyle = this.colour;
            context.fillText(this.text, this.pos.x, this.pos.y, canvas.width);
        }
    }
}

export class Title{
    constructor(seconds, text, colour){
        this.seconds = seconds;
        this.message = text;
        this.colour = 'rgba(' + colour +', 1)';
        this.text = new Text(canvas.width/2, canvas.height/2, this.colour, 'center', '10vw Arial', true, 1, this.message);
    }
    
    startTimer(time){
        this.timerSet = true;
        this.timerStart = time;
    }

    draw(){
        if (! this.timerSet){
            this.startTimer(+ new Date());
        }
        if (+ new Date() < this.timerStart + (this.seconds*1000)){
            this.text.draw();
        }
    }
}

export class InfoPanel{
    constructor(player, target){
        this.player = player;
        this.target = target;
        this.update();
    }
    
    update(){
        this.time = ((startTime + winConditions.timeLimit - + new Date()) /1000);
        this.minutes = Math.floor(this.time / 60);
        this.seconds = (this.time % 60).toFixed(2);
        this.humanTime = this.minutes+":"+this.seconds; 
        this.speed = Math.abs(this.player.vel.x + this.player.vel.y /10).toFixed(2);
        this.distanceToSS = ((calculateDistance(this.player.xCentre, this.player.yCentre, this.target.xCentre, this.target.yCentre))/10);
        this.textContent = ('Time: ' + this.humanTime + '\nSpeed: ' + this.speed + "\nDist: " + this.distanceToSS)
        this.timeText = new Text(this.player.pos.x - 90, this.player.pos.y - 80, 'rgb(0,255,150)', 'left', '11px Monospace', false, 1, 'Time: '+this.humanTime);
        this.speedText = new Text(this.player.pos.x - 90, this.player.pos.y - 40, 'rgb(0,255,150)', 'left', '11px Monospace', false, 1, 'Speed: '+this.speed+' m/s');
        this.distText = new Text(this.player.pos.x - 90, this.player.pos.y - 60, 'rgb(0,255,150)', 'left', '11px Monospace', false, 1, 'Dist: '+this.distanceToSS.toFixed(1)+'m');
    }
    
    drawBGBox(){
        context.rect(this.player.pos.x - 100, this.player.pos.y - 100, 120,70);
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fill();
    }
    
    draw(){
        this.update();
        this.drawBGBox();
        this.timeText.draw();
        this.speedText.draw();
        this.distText.draw();
    }
}