var canvas1, canvas2, ctx1, ctx2, canvasW, canvasH, ane, fruit, mom, baby, mouseX, mouseY;
var data, wave, halo, dust;
var img = new Image();
var deltaTime = 30;
window.onload = function () {
    canvas1 = document.getElementById('canvas1');
    canvas2 = document.getElementById('canvas2');
    canvasW = canvas1.width;
    canvasH = canvas1.height;
    ctx1 = canvas1.getContext('2d');  //绘制fish,dust,circle
    ctx2 = canvas2.getContext('2d');  //绘制bg,ane,fruit

    canvas1.addEventListener('mousemove', onMouseMove, false);

    mouseX = canvasW / 2;
    mouseY = canvasH / 2;

    ane = new AneObj();
    ane.init();

    fruit = new FruitObj();
    fruit.init();

    mom = new MomObj();
    mom.init();

    baby = new BabyObj();
    baby.init();

    data = new DataObj();

    wave = new WaveObj();
    wave.init();

    halo = new HaloObj();
    halo.init();

    dust = new DustObj();
    dust.init();

    ctx1.font = 'bold 30px verdana';
    ctx1.textAlign = 'center';
    gameLoop();

};
function gameLoop() {
    ctx1.clearRect(0, 0, canvasW, canvasH);
    drawBg();
    mom.draw();
    if (data.gameOver == false) {
        momFruitCollision();
        momBabyCollision();
    }
    baby.draw();
    data.draw();
    wave.draw();
    halo.draw();
    dust.draw();
    window.requestAnimFrame(gameLoop);
}
function onMouseMove(e) {
    if (data.gameOver == false) {
        if (e.offsetX || e.layerX) {
            mouseX = e.offsetX || e.layerX;
            mouseY = e.offsetY || e.layerY;
            //console.log(mouseX,mouseY)
        }
    }
}
function drawBg() {
    ctx2.clearRect(0, 0, canvasW, canvasH);
    //大海背景
    img.src = 'images/background.jpg';
    ctx2.drawImage(img, 0, 0, canvasW, canvasH);
    //海葵和果实
    ane.draw();
    fruitMonitor();
    fruit.draw();
}
//海葵
function AneObj() {
    this.rootx = [];
    this.headx = [];
    this.heady = [];
    this.angle = 0;
    this.amp = [];
}
AneObj.prototype.num = 50;
AneObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.rootx[i] = i * 16 + Math.random() * 20;
        this.headx[i] = this.rootx[i];
        this.heady[i] = canvasH - 250 + Math.random() * 50;
        this.amp[i] = Math.random() * 30 + 40;
    }
};
AneObj.prototype.draw = function () {
    this.angle += deltaTime * 0.0008;
    var sinY = Math.sin(this.angle);//[-1,1]
    ctx2.lineCap = 'round';
    ctx2.lineWidth = 20;
    ctx2.strokeStyle = '#3b145e';
    ctx2.save();
    ctx2.globalAlpha = 0.6;
    for (var i = 0; i < this.num; i++) {
        this.headx[i] = this.rootx[i] + sinY * this.amp[i];
        ctx2.beginPath();
        ctx2.moveTo(this.rootx[i], canvasH);
        ctx2.quadraticCurveTo(this.rootx[i], canvasH - 100, this.headx[i], this.heady[i]);
        ctx2.stroke();
    }
    ctx2.restore();
};
//果实
function FruitObj() {
    this.alive = [];//boolean
    this.x = [];
    this.y = [];
    this.aneNo = [];
    this.l = [];//控制果实大小
    this.speed = [];//控制果实长大和漂浮的速度
    this.fruitType = [];//控制果实颜色，出生时调用
    this.orange = new Image();
    this.blue = new Image();
}
FruitObj.prototype.num = 30;
FruitObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = false;
        this.x[i] = 0;
        this.y[i] = 0;
        this.aneNo[i] = 0;
        this.speed[i] = Math.random() * 0.1 + 0.005;
        this.fruitType[i] = '';
        this.born(i);
    }
    this.orange.src = 'images/fruit.png';
    this.blue.src = 'images/blue.png';
};
FruitObj.prototype.draw = function () {
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i] == true) {
            if (this.fruitType[i] == 'orange') {
                var fruitPic = this.orange
            } else {
                fruitPic = this.blue
            }
            if (this.l[i] <= 14) {
                var No = this.aneNo[i];
                this.x[i] = ane.headx[No];
                this.y[i] = ane.heady[No];
                this.l[i] += this.speed[i] * deltaTime;
            } else {
                this.y[i] -= this.speed[i] * deltaTime;
            }
            ctx2.drawImage(fruitPic, this.x[i] - this.l[i] / 2, this.y[i] - this.l[i] / 2, this.l[i], this.l[i]);
            if (this.y[i] < 4) {
                this.alive[i] = false;
            }
        }
    }
};
//随机确定一个海葵的位置，用来产生果实
FruitObj.prototype.born = function (i) {
    this.aneNo[i] = Math.floor(Math.random() * ane.num);
    this.l[i] = 0;
    this.alive[i] = true;
    var ran = Math.random();
    if (ran < 0.2) {
        this.fruitType[i] = 'blue';

    } else {
        this.fruitType[i] = 'orange';
    }
};
FruitObj.prototype.eaten = function (i) {
    this.alive[i] = false;
};
//果实状态监测
function fruitMonitor() {
    var num = 0;
    for (var i = 0; i < fruit.num; i++) {
        if (fruit.alive[i] == true) num++;
    }
    if (num < 15) {
        //born fruit
        bornFruit();
        //return
    }
}
function bornFruit() {
    for (var i = 0; i < fruit.num; i++) {
        if (fruit.alive[i] == false) {
            fruit.alive[i] = true;
            fruit.born(i);
            return
        }
    }
}
//绘制果实结束
//绘制大鱼开始
function MomObj() {
    this.x;
    this.y;
    this.angle;//鱼与坐标位置形成的角度

    this.bigTail = [];
    this.bigTailTimer = 0;
    this.bigTailCount = 0;

    this.bigBodyOrange = [];
    this.bigBodyBlue = [];
    this.bigBodyCount = 0;

    this.bigEye = [];
    this.bigEyeTimer = 0;
    this.bigEyeCount = 0;
    this.bigEyeInterval = 1500;
}
MomObj.prototype.init = function () {
    this.x = canvasW / 2;
    this.y = canvasH / 2;
    this.angle = 0;
    for (var i = 0; i < 8; i++) {
        this.bigTail[i] = new Image();
        this.bigTail[i].src = 'images/bigTail' + i + '.png';
    }
    for (var i = 0; i < 8; i++) {
        this.bigBodyOrange[i] = new Image();
        this.bigBodyBlue[i] = new Image();
        this.bigBodyOrange[i].src = 'images/bigSwim' + i + '.png';
        this.bigBodyBlue[i].src = 'images/bigSwimBlue' + i + '.png';
    }
    for (var i = 0; i < 2; i++) {
        this.bigEye[i] = new Image();
        this.bigEye[i].src = 'images/bigEye' + i + '.png';
    }
};
MomObj.prototype.draw = function () {
    ctx1.save();

    this.x = lerpDistance(mouseX, this.x, 0.96);
    this.y = lerpDistance(mouseY, this.y, 0.96);

    //deltaAngle   Math.atan(y,x)
    var deltaAngle = Math.atan2(mouseY - this.y, mouseX - this.x) + Math.PI;

    this.angle = lerpAngle(deltaAngle, this.angle, 0.6);
    //tail wag
    this.bigTailTimer += deltaTime;
    if (this.bigTailTimer > 60) {
        this.bigTailCount = (this.bigTailCount + 1) % 8;
        this.bigTailTimer %= 60;
    }
    //eye twinkle
    this.bigEyeTimer += deltaTime;
    if (this.bigEyeTimer > this.bigEyeInterval) {
        this.bigEyeCount = (this.bigEyeCount + 1) % 2;
        this.bigEyeTimer = 0;
        if (this.bigEyeCount == 1) {
            this.bigEyeInterval = 200;
        } else {
            this.bigEyeInterval = Math.random() * 1500 + 2000;
        }
    }
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);
    ctx1.drawImage(this.bigTail[this.bigTailCount], -this.bigTail[this.bigTailCount].width / 2 + 30, -this.bigTail[this.bigTailCount].height / 2);
    if (data.double == 1) {
        ctx1.drawImage(this.bigBodyOrange[this.bigBodyCount], -this.bigBodyOrange[this.bigBodyCount].width / 2, -this.bigBodyOrange[this.bigBodyCount].height / 2);
    } else {
        ctx1.drawImage(this.bigBodyBlue[this.bigBodyCount], -this.bigBodyBlue[this.bigBodyCount].width / 2, -this.bigBodyBlue[this.bigBodyCount].height / 2);
    }
    ctx1.drawImage(this.bigEye[this.bigEyeCount], -this.bigEye[this.bigEyeCount].width / 2, -this.bigEye[this.bigEyeCount].height / 2);

    ctx1.restore();
};
//绘制大鱼结束
//绘制小鱼开始
function BabyObj() {
    this.x;
    this.y;
    this.angle;

    this.babyTail = [];
    this.babyTailTimer = 0;
    this.babyTailCount = 0;

    this.babyBody = [];
    this.babyBodyTimer = 0;
    this.babyBodycount = 0;

    this.babyEye = [];
    this.babyEyeTimer = 0;
    this.babyEyeCount = 0;
    this.babyEyeInterval = 1000;
}
BabyObj.prototype.init = function () {
    this.x = canvasW / 2 - 50;
    this.y = canvasH / 2 + 50;
    this.angle = 0;
    for (var i = 0; i < 8; i++) {
        this.babyTail[i] = new Image();
        this.babyTail[i].src = 'images/babyTail' + i + '.png';
    }
    for (var i = 0; i < 20; i++) {
        this.babyBody[i] = new Image();
        this.babyBody[i].src = 'images/babyFade' + i + '.png';
    }
    for (var i = 0; i < 2; i++) {
        this.babyEye[i] = new Image();
        this.babyEye[i].src = 'images/babyEye' + i + '.png';
    }
};
BabyObj.prototype.draw = function () {
    ctx1.save();
    this.x = lerpDistance(mom.x + 30, this.x, 0.98);
    this.y = lerpDistance(mom.y + 20, this.y, 0.98);
    var deltaAngle = Math.atan2(mom.y - this.y, mom.x - this.x) + Math.PI;
    this.angle = lerpAngle(deltaAngle, this.angle, 0.92);
    //tail wag
    this.babyTailTimer += deltaTime;
    if (this.babyTailTimer > 50) {
        this.babyTailCount = (this.babyTailCount + 1) % 8;
        this.babyTailTimer %= 50;
    }
    //body white
    this.babyBodyTimer += deltaTime;
    if (this.babyBodyTimer > 300) {
        this.babyBodycount = this.babyBodycount + 1;
        if (this.babyBodycount > 19) {
            this.babyBodycount = 19;
            //game over
            data.gameOver = true;
        }
        this.babyBodyTimer %= 300;
    }
    //eye twinkle
    this.babyEyeTimer += deltaTime;
    if (this.babyEyeTimer > this.babyEyeInterval) {
        this.babyEyeCount = (this.babyEyeCount + 1) % 2;
        this.babyEyeTimer = 0;
        if (this.babyEyeCount == 1) {
            this.babyEyeInterval = 200;
        } else {
            this.babyEyeInterval = Math.random() * 1500 + 2000;
        }
    }
    var s = parseInt(Math.round(Math.random()));

    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);
    ctx1.drawImage(this.babyTail[this.babyTailCount], -this.babyTail[this.babyTailCount].width / 2 + 26, -this.babyTail[this.babyTailCount].height / 2);
    ctx1.drawImage(this.babyBody[this.babyBodycount], -this.babyBody[this.babyBodycount].width / 2, -this.babyBody[this.babyBodycount].height / 2);
    ctx1.drawImage(this.babyEye[this.babyEyeCount], -this.babyEye[this.babyEyeCount].width / 2, -this.babyEye[this.babyEyeCount].height / 2);
    ctx1.restore();
};
//绘制小鱼结束
//wave
function WaveObj() {
    this.x = [];
    this.y = [];
    this.r = [];
    this.alive = [];
}
WaveObj.prototype.num = 10;
WaveObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = false;
        this.r[i] = 0;
    }
};
WaveObj.prototype.draw = function () {
    ctx1.save();
    ctx1.lineWidth = 2;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = '#fff';
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i] == true) {
            this.r[i] += deltaTime * 0.04;
            if (this.r[i] > 40) {
                this.alive[i] = false;
                break
            }
            var alpha = 1 - this.r[i] / 40;
            ctx1.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, 2 * Math.PI);
            ctx1.closePath();
            ctx1.stroke();
        }
    }
    ctx1.restore();
};
WaveObj.prototype.born = function (x, y) {
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i] == false) {
            //born
            this.alive[i] = true;
            this.r[i] = 10;
            this.x[i] = x;
            this.y[i] = y;
            return
        }
    }
};
//halo
function HaloObj() {
    this.x = [];
    this.y = [];
    this.alive = [];
    this.r = [];
}
HaloObj.prototype.num = 6;
HaloObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = false;
        this.r[i] = 0;
    }
};
HaloObj.prototype.draw = function () {
    ctx1.save();
    ctx1.lineWidth = 2;
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = 'rgb(220,120,80)';
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i] == true) {
            this.r[i] += deltaTime * 0.04;
            if (this.r[i] > 60) {
                this.alive[i] = false;
                break
            }
            var alpha = 1 - this.r[i] / 60;
            ctx1.strokeStyle = 'rgba(220,120,80,' + alpha + ')';
            ctx1.beginPath();
            ctx1.arc(this.x[i], this.y[i], this.r[i], 0, 2 * Math.PI);
            ctx1.closePath();
            ctx1.stroke();
        }
    }
    ctx1.restore();
};
HaloObj.prototype.born = function (x, y) {
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = true;
        this.x[i] = x;
        this.y[i] = y;
        this.r[i] = 10;
    }
};
//dust 漂浮物
function DustObj() {
    this.x = [];
    this.y = [];
    this.angle = 0;
    this.amp = [];
    this.No = [];
    this.dustPic = [];
}
DustObj.prototype.num = 30;
DustObj.prototype.init = function () {
    for (var i = 0; i < this.num; i++) {
        this.x[i] = Math.random() * canvasW;
        this.y[i] = Math.random() * canvasH;
        this.amp[i] = Math.random() * 30 + 40;
        this.No[i] = Math.floor(Math.random() * 7);
        this.dustPic[i] = new Image();
        this.dustPic[i].src = 'images/dust' + this.No[i] + '.png';
    }
};
DustObj.prototype.draw = function () {
    for (var i = 0; i < this.num; i++) {
        //this.angle += deltaTime * 0.0008;
        this.angle += 0.001;
        var sinX = Math.sin(this.angle);
        ctx1.drawImage(this.dustPic[this.No[i]], this.x[i] + sinX * this.amp[i], this.y[i]);
        //console.log(this.y[i])
    }
};