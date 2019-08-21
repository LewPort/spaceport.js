export class ImgAttribute extends Image {
    constructor(){
        super();
        imagesToLoad++;
        this.onload = function(){
            imagesLoaded ++;
            console.log(this.src + ' has loaded');
            console.log(imagesLoaded + '/' + imagesToLoad);
            if (imagesLoaded == imagesToLoad){ //when all images are loaed, start the game
                console.log('All images loaded.')
            }
        }
    }
}

var imagesToLoad = 0;
var imagesLoaded = 0;