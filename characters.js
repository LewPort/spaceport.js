import {ImgAttribute} from './attributes.js';
import {context} from './main.js';

export class Vec
        {
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
    }
}

export class Rect
{
    constructor(x, y, w, h)
    {
        this.pos = new Vec(x, y);
        this.size = new Vec(w, h);
    }
}

export class NPC extends Rect
{
    constructor(src, x, y, z=1, w, h, velX, velY, rot=0, loop=false)
    {
        super(x, y, w, h);
        this.src = src;
        this.img = new ImgAttribute();
        this.img.src = this.src;
        this.zDistance = z;
        this.vel = new Vec(velX,velY);
        this.rotateRate = rot; //degrees per frame
        this.rotateAmount = 0;
        this.power = 0.5;
        this.xCentre = this.pos.x + this.size.x /2;
        this.yCentre = this.pos.y + this.size.y /2;
        this.rightSide = this.pos.x + this.size.x;
        this.bottom = this.pos.y + this.size.y;
        if (this.constructor.name == 'NPC'){
            npcList.push(this);
        }
    }
    
    draw(){
        context.save();
        context.translate(this.xCentre, this.yCentre);
        context.rotate(this.rotateAmount * Math.PI / 180);
        context.translate(-this.xCentre, -this.yCentre);
        context.drawImage(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
        context.restore();
    }
     
    update(dt){
        this.pos.x += (this.vel.x / this.zDistance) * dt;
        this.pos.y += (this.vel.y / this.zDistance) * dt;
        this.rotateAmount += this.rotateRate;
        this.xCentre = this.pos.x + this.size.x /2;
        this.yCentre = this.pos.y + this.size.y /2;
        this.rightSide = this.pos.x + this.size.x;
        this.bottom = this.pos.y + this.size.y;
    }
}

export class Player extends NPC
{
    constructor(img, x, y, z=1, w, h, velX, velY)
    {
        super(img, x, y, z, w, h, velX, velY);
        this.power = 0.1;
        this.rcs_noise = new Audio('audio/rcs.mp3');
        this.rcs_noise.volume = 0.2;
        this.rcs_noise.loop = true;
        this.thrusting = false;
        this.rcsLength = 5;
        this.rcsWidth = 1;
        this.rcsSpacing = 5;
        this.topRCS = [this.xCentre - (this.rcsWidth/2), this.pos.y - this.rcsSpacing, this.rcsWidth, -this.rcsLength];
        this.rightRCS = [this.rightSide +this.rcsSpacing, this.yCentre, this.rcsLength, this.rcsWidth];
        this.bottomRCS = [this.xCentre - (this.rcsWidth/2), this.bottom +this.rcsSpacing, this.rcsWidth, this.rcsLength];
        this.leftRCS = [this.pos.x -this.rcsSpacing, this.yCentre, -this.rcsLength, this.rcsWidth];
        this.cwRCS1 = [this.pos.x, this.pos.y, -this.rcsLength, this.rcsWidth];
        this.cwRCS2 = [this.size.x, this.size.y, this.rcsLength, this.rcsWidth];
        this.RCSEngagedList = []
        this.thrust = {
            down   : function(){
                this.thrusting = true;
                this.vel.y += this.power;
                this.RCSEngagedList.push(this.topRCS);
            },
            up     : function(){
                this.thrusting = true;
                this.vel.y -= this.power;
                this.RCSEngagedList.push(this.bottomRCS);
            },
            left    : function(){
                this.thrusting = true;
                this.vel.x -= this.power;
                this.RCSEngagedList.push(this.rightRCS);
            },
            right   : function(){
                this.thrusting = true;
                this.vel.x += this.power;
                this.RCSEngagedList.push(this.leftRCS);
            },
            clockwise: function(){
                this.thrusting = true;
                this.rotateRate += this.power/2;
                this.RCSEngagedList.push(this.cwRCS1, this.cwRCS2);
            },
            noThrust: function(){
                this.thrusting = false;
            }
        }
    }
    

     
    update(dt){
        super.update(dt);
        this.topRCS = [this.xCentre - (this.rcsWidth/2), this.pos.y - this.rcsSpacing, this.rcsWidth, -this.rcsLength];
        this.rightRCS = [this.rightSide +this.rcsSpacing, this.yCentre, this.rcsLength, this.rcsWidth];
        this.bottomRCS = [this.xCentre - (this.rcsWidth/2), this.bottom +this.rcsSpacing, this.rcsWidth, this.rcsLength];
        this.leftRCS = [this.pos.x -this.rcsSpacing, this.yCentre, -this.rcsLength, this.rcsWidth];
        this.cwRCS1 = [this.pos.x, this.pos.y, -this.rcsLength, this.rcsWidth];
        this.cwRCS2 = [this.pos.x + this.size.x, this.pos.y + this.size.y, this.rcsLength, this.rcsWidth];
        context.fillStyle = "white";
        for (var i in this.RCSEngagedList){
            var rcs = this.RCSEngagedList[i];
            context.fillRect(rcs[0], rcs[1], rcs[2], rcs[3]);
        }
        if (this.thrusting == true){
            this.rcs_noise.play();
        }
        else {
            this.rcs_noise.pause();
        }
        this.RCSEngagedList = [];
    }  
}

export var npcList = [];