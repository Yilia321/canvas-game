//mom & fruit
function momFruitCollision(){
    for (var i=0;i<fruit.num;i++){
        if(fruit.alive[i]){
            var l=calLength2(fruit.x[i],fruit.y[i],mom.x,mom.y);
            if(l<900){
                //fruit was eaten
                fruit.eaten(i);
                mom.bigBodyCount++;
                if(mom.bigBodyCount>7){
                    mom.bigBodyCount=7;
                }
                data.fruitNum++;
                if(fruit.fruitType[i]=='blue'){
                    data.double=2;
                }else {
                    data.double=1;
                }
                wave.born(fruit.x[i],fruit.y[i]);
            }
        }
    }
}

//mom & baby
function momBabyCollision(){
    var dis=calLength2(mom.x,mom.y,baby.x,baby.y);
    if(dis<900 && data.fruitNum>0){
        //baby recover
        baby.babyBodycount=0;
        data.addScore();
        mom.bigBodyCount=0;
        halo.born(baby.x,baby.y);
    }
}