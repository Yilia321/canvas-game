var DataObj=function(){
    this.fruitNum=0;
    this.double=1;
    this.score=0;
    this.gameOver=false;
    this.alpha=0;
};
DataObj.prototype.draw=function(){
    //ctx1.fillText('num:'+this.fruitNum,canvasW/2,canvasH-50);
    //ctx1.fillText('double:'+this.double,canvasW/2,canvasH-80);
    ctx1.save();
    ctx1.fillStyle='#fff';
    ctx1.shadowBlur=20;
    //ctx1.shadowColor='#333';
    ctx1.shadowColor='#fff';
    ctx1.fillText('Score '+this.score,canvasW/2,50);
    if(this.gameOver==true){
        this.alpha+=0.001*deltaTime;
        if (this.alpha>=1){
            this.alpha=1;
        }
        ctx1.fillStyle='rgba(255,255,255,'+this.alpha+')';
        ctx1.fillText('GAME OVER!',canvasW/2,canvasH/2);
    }
    ctx1.restore();
};
DataObj.prototype.addScore=function(){
    this.score+=this.fruitNum*100*this.double;
    //reset
    this.fruitNum=0;
    this.double=1;
};