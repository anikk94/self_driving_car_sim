class Car{
    constructor(x, y, width, height,controlType,maxSpeed=3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        // maxReverseSpeed = maxSpeed/2
        this.friction = 0.05;
        this.angle = 0;
        this.damaged=false;

        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    draw(ctx,colour){
        // old method of drawing car by rotating and translating the context
        // -----------------------------------------------------------------
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle);

        // ctx.beginPath();
        // ctx.rect(
        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height,
        // );
        // ctx.fill();

        // // car front back marker
        // // ---------------------
        // // {
        // //     ctx.beginPath();
        // //     ctx.arc(0, -60, 6, 0, Math.PI*2);
        // //     ctx.fillStyle = "green";
        // //     ctx.fill()
        // //     ctx.beginPath();
        // //     ctx.arc(0, 60, 6, 0, Math.PI*2);
        // //     ctx.fillStyle = "orange";
        // //     ctx.fill();
        // // }

        // ctx.restore();

        // new method of drawing car as polygon
        // ------------------------------------
        if(this.polygon){
            if(this.damaged){
                ctx.fillStyle="gray";
            } else {
                // ctx.fillStyle="black";
                ctx.fillStyle=colour;
            }

            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
            for(let i=1;i<this.polygon.length;i++){
                ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
            }
            ctx.fill();
        }

        if(this.sensor){
            this.sensor.draw(ctx);

        }
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if (this.sensor){
            this.sensor.update(roadBorders,traffic);

        }
    }
    
    #assessDamage(roadBorders,traffic){
        // check collisions with road borders
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        // check collisions with traffic
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    // # -> means private method
    #createPolygon(){
       const points=[]; 
       const rad=Math.hypot(this.width,this.height)/2;
       const alpha=Math.atan2(this.width,this.height);
       points.push({
        x:this.x-Math.sin(this.angle-alpha)*rad,
        y:this.y-Math.cos(this.angle-alpha)*rad,
       });
       points.push({
        x:this.x-Math.sin(this.angle+alpha)*rad,
        y:this.y-Math.cos(this.angle+alpha)*rad,
       });
       points.push({
        x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
        y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
       });
       points.push({
        x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
        y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
       });
       return points;
    }

    #move(){
        if (this.controls.forward){
            this.speed = this.speed + this.acceleration;
        }
        if (this.controls.reverse){
            this.speed = this.speed - this.acceleration;
        }
        
        if (this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        
        if (this.speed > 0){
            this.speed = this.speed - this.friction;
        }
        if (this.speed < 0){
            this.speed = this.speed + this.friction;
        }
        if (Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }
        
        
        if (this.speed != 0){
            // ternary operator expansion
            // let flip = 0
            // if (this.speed > 0){
            //     flip = 1;
            // } else {
            //     flip = -1
            // }
            const flip = this.speed > 0 ? 1 : -1;
    
            if (this.controls.left){
                this.angle = this.angle + 0.03 * flip;
            }
            if (this.controls.right){
                this.angle = this.angle - 0.03 * flip;
            }
            // console.log("car angle: " + this.angle);
    
        }
    
    
        
        // rotated unit circle for heading/angle
        // that is why sin->x and cos-> y
        // this.y = this.y - this.speed;
        this.x = this.x - Math.sin(this.angle) * this.speed;
        this.y = this.y - Math.cos(this.angle) * this.speed;

    }
}


//
// collision detection:s
//
// look at box2d, three.j