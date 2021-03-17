'use strict'
let GAME = {
  draw:function(){},
  setup:function(){},
  objects:{},
  canvas: document.querySelector("#miCanvas"),
  sources: {
    proyectil:
      "https://pngimg.com/uploads/flame/flame_PNG13246.png",
    yoda: "http://www.html5canvastutorials.com/demos/assets/yoda.jpg",
    piedra:
      "https://pngimg.com/uploads/stone/stone_PNG13590.png",
    spaceShip:
    "https://images.vexels.com/media/users/3/157795/isolated/preview/3b2b23922ab44dae1ced628d82d3179a-ufo-spacecraft-by-vexels.png"
  },
  images:{},
  mainInterval:undefined,
  dT : 30,
  running  : false,
  initialSetUpDone : false,
  assetsLoaded : false,

  loadImages: async function() {
    return new Promise((resolve, reject)=>{
      let loadedImages = 0;
      let numImages = Object.keys(this.sources).length;
      for (let name in this.sources) {
        this.images[name] = new Image();
        // console.log('loading images', name, loadedImages,numImages)
        this.images[name].onload = function () {
          loadedImages++;
          // console.log(loadedImages)
          if (loadedImages >= numImages) {
            this.assetsLoaded = true;
            resolve()
          }
        };
        this.images[name].src = this.sources[name];
      }
    })
  },
  getCtx:function() {
    this.ctx = this.canvas.getContext("2d");
    // console.log('get ctx')
  },
  loadAssets:async function(){
    await this.loadImages();
  },
  start: async function(){
    this.getCtx()
    await this.loadAssets();
    // while(!this.assetsLoaded)console.log('loading')
    this.setup();// function defined by the user
    this.play();
    
  },
  play: function(){
    if (this.running == false)
    {
      // draw is a function implemented by the user
      this.mainInterval = window.setInterval(this.draw, this.dT);
      this.running = true;
    }
  },
  pause: function(){
    if (this.running == true)
    {
      window.clearInterval(this.mainInterval);
      this.running = false;
    }
  },

  reset:function()
  {
    this.pause();
    this.objects = [];
    this.setup();// function defined by the user
    this.play();
  },
  drawRotatedImage(image, x, y, angle, w, h)
  {
    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.rotate(angle * Math.PI/180);

    this.ctx.drawImage(image, -w/2, -h/2, w, h);
    this.ctx.restore();
  }
}

export {GAME}