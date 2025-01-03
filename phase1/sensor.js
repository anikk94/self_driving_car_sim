class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReadings(this.rays[i], roadBorders)
            );
        };

        // console.log("length of readings: " + this.readings.length);
        // let msg = "readings: ";
        // for (let i=0;i<this.readings.length;i++){
        //     if (this.readings[i] != null)
        //         msg += "[" + i + "]: " + this.readings[i].x + "," + this.readings[i].y + ", ";
        // }
        // console.log(msg);

    }

    #getReadings(ray, roadBorders) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            // a ray can intersect with a border multiple times
            // each intersection is a touch
            if (touch) {
                touches.push(touch);
            }     
        }

        // if there is at least one touch, return the closest one
        if (touches.length == 0) {
            return null;
        } else {
            // get the offset member of each touch object and make a new array called offsets out of them
            const offsets = touches.map(e => e.offset);
            // the min function doesn't work with arrays, so we use the spread operator to pass the elements of the array as arguments
            const minOffset = Math.min(...offsets);
            // find the touch object that has the offset equal to minOffset
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays() {
        // console.log("sensor.castRays()");
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        if (this.rays.length > 0) {
            for (let i = 0; i < this.rayCount; i++) {
                let end = this.rays[i][1];
                if (this.readings[i]) {
                    end = this.readings[i];
                }

                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "yellow";
                ctx.moveTo(
                    this.rays[i][0].x,
                    this.rays[i][0].y,
                );
                ctx.lineTo(
                    end.x,
                    end.y
                );
                ctx.stroke();

                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
                ctx.moveTo(
                    end.x,
                    end.y,
                );
                ctx.lineTo(
                    this.rays[i][1].x,
                    this.rays[i][1].y
                );
                ctx.stroke();
            }
        }
        // else {
        //     console.log("sensor.draw(error)")
        // }
    }
}