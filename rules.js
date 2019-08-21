

export class WinConditions{
    constructor(player, target, dockTime=4.5){
        this.player = player;
        this.target = target;
        this.timeLimit = 3 * 1000 * 60;
        this.dockTolerance = 2; //amount of pixels that a ship can be mis-aligned with the centre of the target and still trigger a win
        this.dockTime = dockTime * 1000; //amount of seconds you must stay within win-zone to trigger a win
        this.docking = false;
        this.docked = false;
        this.dockStartTime = null;
    }
    
    xDockAlign(){
        return (this.player.xCentre > this.target.xCentre -this.dockTolerance && this.player.xCentre < this.target.xCentre + this.dockTolerance);
    }
    yDockAlign(){
        return (this.player.yCentre > this.target.yCentre -this.dockTolerance && this.player.yCentre < this.target.yCentre + this.dockTolerance);
    }
    checkWinCondition(){
        if (this.xDockAlign() && this.yDockAlign()){
            if (this.docking == false){
                this.docking = true;
                this.dockStartTime = + new Date();
                dockingSound.play();
                console.log('Docking procedure started.')
            }
            else if (this.docking && + new Date() > (this.dockStartTime + this.dockTime)){
                console.log('DOCKED!!!!')
                this.docking = false;
                this.dockStartTime = + new Date();
                this.docked = true;
            }
        }
        else if (this.docking){
            this.docking = false;
            console.log('Docking aborted.')
            dockingSound.pause();
            dockingSound.currentTime = 0;
            this.dockStartTime = 0;
        }
    }
}

const dockingSound = new Audio('audio/dockingSound.mp3')
dockingSound.preload = true;
