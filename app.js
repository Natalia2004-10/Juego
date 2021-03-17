'use strict'
import {GAME} from './initialize.js'

class Cuadrado {
    constructor(x, y, h, b)
    {
        this.x = x; 
        this.y = y;
        this.h = h;
        this.b = b;
    }

    dibujarse(){
        
        GAME.ctx.beginPath();
        GAME.ctx.fillStyle = "#ffff00"
        GAME.ctx.fillRect(this.x,this.y, this.b, this.h);
        GAME.ctx.stroke();
        GAME.ctx.fill()

    }
    moverse(){
        this.x = this.x - 4;
    }
}

class triangulo {
    constructor(x1, x2, x3, y1, y2)
    {
        this.x1 = x1; 
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
    }

    dibujarse(){
        
        GAME.ctx.fillStyle = "#00f9d7"
        GAME.ctx.beginPath();
        GAME.ctx.moveTo(this.x1, this.y1);
        GAME.ctx.lineTo(this.x2, this.y2);
        GAME.ctx.lineTo(this.x3, this.y1);
        GAME.ctx.lineTo(this.x1, this.y1);
        GAME.ctx.stroke();
        GAME.ctx.fill();
    }
    moverse(){
        this.x1 = this.x1 - 4;
        this.x2 = this.x2 - 4;
        this.x3 = this.x3 - 4;
    }
}

class Piedra {
    constructor(x, y, vX, vY, r, angle, w)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vX = vX;
        this.vY = vY;
        this.angle = angle;
        this.w = w;//angular velocity
        this.imagen = GAME.images.piedra;
    }

    dibujarse(){
        
        GAME.drawRotatedImage(this.imagen, this.x, this.y,this.angle, 2*this.r, 2*this.r);
    }
    moverse(){
        this.x = this.x + this.vX * GAME.dT/1000;
        this.y = this.y + this.vY * GAME.dT/1000;
        this.angle = this.angle + this.w * GAME.dT/1000;
    }
}

class Nave{
    constructor(x, y, width, height, angle)
    {
        this.x = x;
        this.y = y;
        this.vY = 4;
        this.angle = angle;
        this.width = width;
        this.height = height;
        this.imagen = GAME.images.spaceShip;
        this.enMovimiento = false;
        this.enReversa = false;

    }

    dibujarse(){
        
        GAME.drawRotatedImage(this.imagen, this.x, this.y,this.angle+90, this.width, this.height);
    }
    moverse(){
        if (this.enMovimiento)
        {
            if(this.enReversa){
                this.y -= this.vY;
            }
            else{
                this.y += this.vY ;
            }
        }
    }
}

class Proyectil {
    constructor(x, y, vX, vY, r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vX = vX;
        this.vY = vY;
        // this.angle = angle;
        this.imagen = GAME.images.proyectil;
    }

    dibujarse(){
        
        GAME.drawRotatedImage(this.imagen, this.x, this.y,0, 2*this.r, 2*this.r);
    }
    moverse(){
        this.x = this.x + (this.vX * GAME.dT/1000);
        this.y = this.y + (this.vY * GAME.dT/1000);
    }
}

GAME.setup = function(){
    GAME.objects ={Cuadrados:[], triangulos: [],piedras:[], proyectiles: [] , player:new Nave(200, 250, 30, 30,50,0)}
    crearTriangulo();
    crearCuadrado();
    GAME.score = 0;
    GAME.choco = false;
    GAME.totalTime = 20000;// 20 seconds
    GAME.initialTime = window.performance.now();
}

function mostrarPuntaje(){
    GAME.ctx.font = "30px Arial";
    GAME.ctx.fillStyle = "white"
    GAME.ctx.fillText(`Puntaje: ${GAME.score}`, 10, 50);
}

function colisionConCuadrado()
{
    for (let cuadrado of GAME.objects.Cuadrados){
        let cx = cuadrado.x + cuadrado.b * 0.5;
        let rcy = cuadrado.y + cuadrado.h * 0.5; 
        let distanciax = Math.abs(cx - GAME.objects.player.x);
        let distanciay = Math.abs(rcy - GAME.objects.player.y);
        if (distanciax <= cuadrado.b* 0.5 + GAME.objects.player.width/4 && distanciay <= cuadrado.h * 0.5 + GAME.objects.player.width/4) { 
            GAME.choco = true; 
        }
    }
}
//Funcion que determina si un punto está dentro de un triángulo. 
function ptInTriangle(p, p0, p1, p2) {
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sign = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

function colisionConTriangulo()
{
    for(let trian of GAME.objects.triangulos){
        let p = {x:GAME.objects.player.x, y:GAME.objects.player.y}
        let p1 = {x:trian.x1, y:trian.y1}
        let p2 = {x:trian.x2, y:trian.y2}
        let p3 = {x:trian.x3, y:trian.y1}
        
        if(ptInTriangle(p,p1,p2,p3) == true)
        GAME.choco = true;
 }

}

function colisionConPiedra(Piedra, Proyectil){
    let dx = Math.abs(Piedra.x - Proyectil.x);
    let dy = Math.abs(Piedra.y - Proyectil.y);
    let dist = Math.sqrt(Math.pow(dx,2)+ Math.pow(dy,2));
    if (dist <= Piedra.r + Proyectil.r) return true
    else return false 
}

 function buscarColisiones()
 {
     let colisiones = []
     for (let i=0; i < GAME.objects.piedras.length; i++){
         for(let j = 0; j < GAME.objects.proyectiles.length; j++){
            if(colisionConPiedra(GAME.objects.piedras[i],GAME.objects.proyectiles[j] )) { 
                if(!colisiones.includes(i, 0))
                colisiones.push(i);
        } 
         }
     }
     return colisiones;
}

 function quitarPiedras(colisiones) {
     for(let pos of colisiones){
         // splice quita elementos de un array.
         GAME.objects.piedras.splice(pos, 1);
     }
    }
    
    GAME.draw =  function(){
        GAME.ctx.clearRect(0,0,1200,500);
        // console.log("Iniciando draw");
        // console.log(GAME.objects)
        colisionConCuadrado();
        colisionConTriangulo();
        if (GAME.score >= 10 && GAME.choco == false || GAME.choco.nuevoCuadrado47){
            console.log(GAME.choco)
            // detener el juego
            GAME.pause();
            // muestre el mensaje de que ganó
            GAME.ctx.font = "50px Arial";
            GAME.ctx.fillStyle = "green";
            GAME.ctx.fillText(`GANASTE`, 80, 180);
        }
        if (GAME.choco == true){
            // detener el juego
            GAME.pause();
            // muestrar el mensaje de que perdio
            GAME.ctx.font = "50px Arial";
            GAME.ctx.fillStyle = "red";
            GAME.ctx.fillText(`PERDISTE`, 80, 180);
        }
    
    for (let trian of GAME.objects.triangulos){ 
        trian.dibujarse();
        trian.moverse();
    }
    for (let cuadrado of GAME.objects.Cuadrados){
        cuadrado.dibujarse();
        cuadrado.moverse();
    }
    
    GAME.objects.player.dibujarse();
    GAME.objects.player.moverse();
    
    for (let piedra of GAME.objects.piedras){
        piedra.dibujarse();
        piedra.moverse();
    }
    for (let proyectil of GAME.objects.proyectiles){
        proyectil.dibujarse();
        proyectil.moverse();
    }
    mostrarPuntaje(); 
    // buscar colisiones devuelve una lista con los índices de los balónes con los cuales la nave chocó
    let colisiones = buscarColisiones();
    // Se quitan los balones de la lista de balones cuando la nave los toca
    quitarPiedras(colisiones);
    // Se suman los puntos correspondientes
    GAME.score += colisiones.length;
}

GAME.start();

function crearTriangulo(){
    let nuevoTriang = new triangulo(700, 750, 800, 0, 150);
    let nuevoTriang1 = new triangulo(1200, 1250, 1300, 500, 50);
    let nuevoTriang2 = new triangulo(1375, 1425, 1475, 0, 150);
    let nuevoTriang3 = new triangulo(1500, 1525, 1550, 0, 50);
    let nuevoTriang4 = new triangulo(1550, 1575, 1600, 0, 50);
    let nuevoTriang5 = new triangulo(1600, 1625, 1650, 0, 50);
    let nuevoTriang6 = new triangulo(1650, 1675, 1700, 0, 50);
    let nuevoTriang7 = new triangulo(1700, 1725, 1750, 0, 50);
    let nuevoTriang8 = new triangulo(1750, 1775, 1800, 0, 50);
    let nuevoTriang9 = new triangulo(1800, 1825, 1850, 0, 50);
    let nuevoTriang10 = new triangulo(1850, 1875, 1900, 0, 50);
    let nuevoTriang11 = new triangulo(1900, 1925, 1950, 0, 50);
    let nuevoTriang12 = new triangulo(1950, 1975, 2000, 0, 50);
    let nuevoTriang13 = new triangulo(2000, 2025, 2050, 0, 200);
    let nuevoTriang14 = new triangulo(2700, 2725, 2750, 500, 250);
    let nuevoTriang15 = new triangulo(2750, 2775, 2800, 500, 250);
    let nuevoTriang16 = new triangulo(2800, 2825, 2850, 500, 250);
    let nuevoTriang17 = new triangulo(2850, 2875, 2900, 500, 250);
    let nuevoTriang18 = new triangulo(2900, 2925, 2950, 500, 250);
    let nuevoTriang19 = new triangulo(2950, 2975, 3000, 500, 250);
    let nuevoTriang20 = new triangulo(3000, 3025, 3050, 500, 250);
    let nuevoTriang21 = new triangulo(3050, 3075, 3100, 500, 250);
    let nuevoTriang22 = new triangulo(3800, 3825, 3850, 0, 300);
    let nuevoTriang23 = new triangulo(3850, 3875, 3900, 0, 300);
    let nuevoTriang24 = new triangulo(3900, 3925, 3950, 0, 300);
    let nuevoTriang25 = new triangulo(3950, 3975, 4000, 0, 300);
    let nuevoTriang26 = new triangulo(5100, 5150, 5200, 0, 300);
    let nuevoTriang27 = new triangulo(5100, 5150, 5200, 500, 350);
    let nuevoTriang28 = new triangulo(5200, 5250, 5300, 0, 300);
    let nuevoTriang29 = new triangulo(5200, 5250, 5300, 500, 350);
    let nuevoTriang30 = new triangulo(5300, 5350, 5400, 0, 300);
    let nuevoTriang31 = new triangulo(5300, 5350, 5400, 500, 350);
    let nuevoTriang32 = new triangulo(5400, 5450, 5500, 0, 300);
    let nuevoTriang33 = new triangulo(5400, 5450, 5500, 500, 350);
    let nuevoTriang34 = new triangulo(5500, 5550, 5600, 0, 300);
    let nuevoTriang35 = new triangulo(5500, 5550, 5600, 500, 350);
    let nuevoTriang36 = new triangulo(5600, 5650, 5700, 0, 300);
    let nuevoTriang37 = new triangulo(5600, 5650, 5700, 500, 350);
    let nuevoTriang38 = new triangulo(5700, 5750, 5800, 0, 300);
    let nuevoTriang39 = new triangulo(5700, 5750, 5800, 500, 350);
    let nuevoTriang40 = new triangulo(5800, 5850, 5900, 0, 300);
    let nuevoTriang41 = new triangulo(5800, 5850, 5900, 500, 350);

    GAME.objects.triangulos.push(nuevoTriang);
    GAME.objects.triangulos.push(nuevoTriang1);
    GAME.objects.triangulos.push(nuevoTriang2);
    GAME.objects.triangulos.push(nuevoTriang3);
    GAME.objects.triangulos.push(nuevoTriang4);
    GAME.objects.triangulos.push(nuevoTriang5);
    GAME.objects.triangulos.push(nuevoTriang6);
    GAME.objects.triangulos.push(nuevoTriang7);
    GAME.objects.triangulos.push(nuevoTriang8);
    GAME.objects.triangulos.push(nuevoTriang9);
    GAME.objects.triangulos.push(nuevoTriang10);
    GAME.objects.triangulos.push(nuevoTriang11);
    GAME.objects.triangulos.push(nuevoTriang12);
    GAME.objects.triangulos.push(nuevoTriang13);
    GAME.objects.triangulos.push(nuevoTriang14);
    GAME.objects.triangulos.push(nuevoTriang15);
    GAME.objects.triangulos.push(nuevoTriang16);
    GAME.objects.triangulos.push(nuevoTriang17);
    GAME.objects.triangulos.push(nuevoTriang18);
    GAME.objects.triangulos.push(nuevoTriang19);
    GAME.objects.triangulos.push(nuevoTriang20);
    GAME.objects.triangulos.push(nuevoTriang21);
    GAME.objects.triangulos.push(nuevoTriang22);
    GAME.objects.triangulos.push(nuevoTriang23);
    GAME.objects.triangulos.push(nuevoTriang24);
    GAME.objects.triangulos.push(nuevoTriang25);
    GAME.objects.triangulos.push(nuevoTriang26);
    GAME.objects.triangulos.push(nuevoTriang27);
    GAME.objects.triangulos.push(nuevoTriang28);
    GAME.objects.triangulos.push(nuevoTriang29);
    GAME.objects.triangulos.push(nuevoTriang30);
    GAME.objects.triangulos.push(nuevoTriang31);
    GAME.objects.triangulos.push(nuevoTriang32);
    GAME.objects.triangulos.push(nuevoTriang33);
    GAME.objects.triangulos.push(nuevoTriang34);
    GAME.objects.triangulos.push(nuevoTriang35);
    GAME.objects.triangulos.push(nuevoTriang36);
    GAME.objects.triangulos.push(nuevoTriang37);
    GAME.objects.triangulos.push(nuevoTriang38);
    GAME.objects.triangulos.push(nuevoTriang39);
    GAME.objects.triangulos.push(nuevoTriang40);
    GAME.objects.triangulos.push(nuevoTriang41);
}

function crearCuadrado(){
    let nuevoCuadrado = new Cuadrado(500, 0, 100, 100);
    let nuevoCuadrado2 = new Cuadrado(550, 200, 300, 100);
    let nuevoCuadrado3 = new Cuadrado(850, 0, 300, 100);
    let nuevoCuadrado4 = new Cuadrado(1500, 200, 300, 50);
    let nuevoCuadrado5 = new Cuadrado(1500, 0, 150, 50);
    let nuevoCuadrado6 = new Cuadrado(1600, 150, 350, 200);
    let nuevoCuadrado7 = new Cuadrado(2100, 200, 300, 75);
    let nuevoCuadrado8 = new Cuadrado(2200, 0, 150, 400);
    let nuevoCuadrado9 = new Cuadrado(2200, 250, 250, 400);
    let nuevoCuadrado10 = new Cuadrado(2700, 0, 200, 400);
    let nuevoCuadrado11 = new Cuadrado(3200, 150, 350, 50);
    let nuevoCuadrado12 = new Cuadrado(3500, 0, 350, 50);
    let nuevoCuadrado13 = new Cuadrado(3500, 450, 50, 50);
    let nuevoCuadrado14 = new Cuadrado(3800, 400, 100, 200);
    let nuevoCuadrado15 = new Cuadrado(4100, 0, 350, 50);
    let nuevoCuadrado16 = new Cuadrado(4100, 450, 50, 50);
    let nuevoCuadrado17 = new Cuadrado(4150, 0, 300, 50);
    let nuevoCuadrado18 = new Cuadrado(4150, 400, 100, 50);
    let nuevoCuadrado19 = new Cuadrado(4200, 0, 250, 50);
    let nuevoCuadrado20 = new Cuadrado(4200, 350, 150, 50);
    let nuevoCuadrado21 = new Cuadrado(4250, 0, 200, 50);
    let nuevoCuadrado22 = new Cuadrado(4250, 300, 200, 50);
    let nuevoCuadrado23 = new Cuadrado(4300, 0, 150, 50);
    let nuevoCuadrado24 = new Cuadrado(4300, 250, 250, 50);
    let nuevoCuadrado25 = new Cuadrado(4350, 0, 100, 50);
    let nuevoCuadrado26 = new Cuadrado(4350, 200, 300, 50);
    let nuevoCuadrado27 = new Cuadrado(4400, 0, 50, 50);
    let nuevoCuadrado28 = new Cuadrado(4400, 150, 350, 50);
    let nuevoCuadrado29 = new Cuadrado(4450, 0, 0, 250);
    let nuevoCuadrado30 = new Cuadrado(4450, 100, 400, 250);
    let nuevoCuadrado31 = new Cuadrado(4700, 0, 50, 50);
    let nuevoCuadrado32 = new Cuadrado(4700, 150, 350, 50);
    let nuevoCuadrado33 = new Cuadrado(4750, 0, 100, 50);
    let nuevoCuadrado34 = new Cuadrado(4750, 200, 300, 50);
    let nuevoCuadrado35 = new Cuadrado(4800, 0, 150, 50);
    let nuevoCuadrado36 = new Cuadrado(4800, 250, 250, 50);
    let nuevoCuadrado37 = new Cuadrado(4850, 0, 200, 50);
    let nuevoCuadrado38 = new Cuadrado(4850, 300, 200, 50);
    let nuevoCuadrado39 = new Cuadrado(4900, 0, 250, 50);
    let nuevoCuadrado40 = new Cuadrado(4900, 350, 150, 50);
    let nuevoCuadrado41 = new Cuadrado(4950, 0, 300, 50);
    let nuevoCuadrado42 = new Cuadrado(4950, 400, 100, 50);
    let nuevoCuadrado43 = new Cuadrado(5000, 0, 350, 50);
    let nuevoCuadrado44 = new Cuadrado(5000, 450, 50, 50);
    let nuevoCuadrado45 = new Cuadrado(6000, 0, 150, 200);
    let nuevoCuadrado46 = new Cuadrado(6000, 100, 300, 200);
    let nuevoCuadrado47 = new Cuadrado(6400, 0, 500, 1000);

    GAME.objects.Cuadrados.push(nuevoCuadrado);
    GAME.objects.Cuadrados.push(nuevoCuadrado2);
    GAME.objects.Cuadrados.push(nuevoCuadrado3);
    GAME.objects.Cuadrados.push(nuevoCuadrado4);
    GAME.objects.Cuadrados.push(nuevoCuadrado5);
    GAME.objects.Cuadrados.push(nuevoCuadrado6);
    GAME.objects.Cuadrados.push(nuevoCuadrado7);
    GAME.objects.Cuadrados.push(nuevoCuadrado8);
    GAME.objects.Cuadrados.push(nuevoCuadrado9);
    GAME.objects.Cuadrados.push(nuevoCuadrado10);
    GAME.objects.Cuadrados.push(nuevoCuadrado11);
    GAME.objects.Cuadrados.push(nuevoCuadrado12);
    GAME.objects.Cuadrados.push(nuevoCuadrado13);
    GAME.objects.Cuadrados.push(nuevoCuadrado14);
    GAME.objects.Cuadrados.push(nuevoCuadrado15);
    GAME.objects.Cuadrados.push(nuevoCuadrado16);
    GAME.objects.Cuadrados.push(nuevoCuadrado17);
    GAME.objects.Cuadrados.push(nuevoCuadrado18);
    GAME.objects.Cuadrados.push(nuevoCuadrado19);
    GAME.objects.Cuadrados.push(nuevoCuadrado20);
    GAME.objects.Cuadrados.push(nuevoCuadrado21);
    GAME.objects.Cuadrados.push(nuevoCuadrado22);
    GAME.objects.Cuadrados.push(nuevoCuadrado23);
    GAME.objects.Cuadrados.push(nuevoCuadrado24);
    GAME.objects.Cuadrados.push(nuevoCuadrado25);
    GAME.objects.Cuadrados.push(nuevoCuadrado26);
    GAME.objects.Cuadrados.push(nuevoCuadrado27);
    GAME.objects.Cuadrados.push(nuevoCuadrado28);
    GAME.objects.Cuadrados.push(nuevoCuadrado29);
    GAME.objects.Cuadrados.push(nuevoCuadrado30);
    GAME.objects.Cuadrados.push(nuevoCuadrado31);
    GAME.objects.Cuadrados.push(nuevoCuadrado32);
    GAME.objects.Cuadrados.push(nuevoCuadrado33);
    GAME.objects.Cuadrados.push(nuevoCuadrado34);
    GAME.objects.Cuadrados.push(nuevoCuadrado35);
    GAME.objects.Cuadrados.push(nuevoCuadrado36);
    GAME.objects.Cuadrados.push(nuevoCuadrado37);
    GAME.objects.Cuadrados.push(nuevoCuadrado38);
    GAME.objects.Cuadrados.push(nuevoCuadrado39);
    GAME.objects.Cuadrados.push(nuevoCuadrado40);
    GAME.objects.Cuadrados.push(nuevoCuadrado41);
    GAME.objects.Cuadrados.push(nuevoCuadrado42);
    GAME.objects.Cuadrados.push(nuevoCuadrado43);
    GAME.objects.Cuadrados.push(nuevoCuadrado44);
    GAME.objects.Cuadrados.push(nuevoCuadrado45);
    GAME.objects.Cuadrados.push(nuevoCuadrado46);
    GAME.objects.Cuadrados.push(nuevoCuadrado47);
}



function crearParticula(m){

    let newX = GAME.objects.player.x;
    let newY = GAME.objects.player.y;
    let ipo = Math.sqrt(Math.pow((m.offsetX - GAME.objects.player.x),2) + Math.pow((m.offsetY - GAME.objects.player.y),2))
    let vX = (Math.sqrt(Math.pow(ipo,2)-Math.pow((m.offsetY - GAME.objects.player.y),2))* ipo)*100;
    let vY = (Math.sqrt(Math.pow(ipo,2)-Math.pow((m.offsetX - GAME.objects.player.x),2))* ipo)*100;
    console.log(m.offsetY)
    if(m.offsetX > GAME.objects.player.x){
        let angu = Math.atan((m.offsetY - GAME.objects.player.y)/(m.offsetX - GAME.objects.player.x))
        let vX = Math.cos(angu)*100;
        let vY = Math.sin(angu)*100;
        let nuevoProyec = new Proyectil(newX, newY,vX,vY, 10);
        GAME.objects.proyectiles.push(nuevoProyec);
    }else{
        let angu = Math.atan((m.offsetY - GAME.objects.player.y)/(m.offsetX - GAME.objects.player.x)) + Math.PI;
        let vX = Math.cos(angu)*100;
        let vY = Math.sin(angu)*100;
        let nuevoProyec = new Proyectil(newX, newY,vX,vY, 10);
        GAME.objects.proyectiles.push(nuevoProyec);
    }

}
document.onmousemove = crearParticula;

// Al hacer click se va a ejecutar la función crear partícula
GAME.canvas.onclick = crearParticula

function crearPiedra(){
    let ang = 2 * Math.PI * Math.random();
    let nX = 50 + 300 *Math.random();
    let nY = 50 + 300 *Math.random();
    let nuevoPidra = new Piedra(nX, nY,10 * Math.cos(ang), 10 * Math.sin(ang), 15, 0, 360);
    // añado el nuevo balón al array de balones
    GAME.objects.piedras.push(nuevoPidra);
}

function teclaPresionada(e){
    console.log(e.code)
    if (e.code =='Space')
    {
        console.log(e.shiftKey)
        if(e.shiftKey) GAME.reset();
        else{
            if (GAME.running) GAME.pause();
            else GAME.play();
        }

    }
    if (e.code == 'KeyS')
    {
        GAME.objects.player.enMovimiento = true
        // console.log('arrancar')
    }
    if (e.code == 'KeyW')
    {
        GAME.objects.player.enMovimiento = true;
        GAME.objects.player.enReversa = true;
        // console.log('moverse hacia atras')
    }
    // console.log(e.code)
}
function teclaLevantada(e)
{
    if (e.code == 'KeyS')
    {
        GAME.objects.player.enMovimiento = false;
        // console.log('detenerse')
    }
    if (e.code == 'KeyW')
    {
        GAME.objects.player.enMovimiento = false;
        GAME.objects.player.enReversa = false;
        // console.log('detener el movimiento hacia atrás')
    }
}
document.onkeydown = teclaPresionada;
document.onkeyup = teclaLevantada;

function mouseMovido(e){
    let newAng = Math.atan((e.offsetY - GAME.objects.player.y)/(e.offsetX - GAME.objects.player.x))* 180/Math.PI;
    if (e.offsetX < GAME.objects.player.x) newAng += 180
    GAME.objects.player.angle = newAng;
}
document.onmousemove = mouseMovido;

window.setInterval(crearPiedra, 3000);