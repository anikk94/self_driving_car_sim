class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        // maxReverseSpeed = maxSpeed/2
        this.friction = 0.05;

        this.angle = 0;


        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height,
        );
        ctx.fill();

        // car front back marker
        // ---------------------
        // {
        //     ctx.beginPath();
        //     ctx.arc(0, -60, 6, 0, Math.PI*2);
        //     ctx.fillStyle = "green";
        //     ctx.fill()
        //     ctx.beginPath();
        //     ctx.arc(0, 60, 6, 0, Math.PI*2);
        //     ctx.fillStyle = "orange";
        //     ctx.fill();
        // }

        ctx.restore();

        this.sensor.draw(ctx);
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }
    
    // #createPolygon()

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