const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9, 3)
const car = new Car(road.getLaneCenter(1), 100, 30, 50,"KEYS");
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
]

car.draw(ctx);

animate();

function animate(){
    for (let i=0;i<traffic.length;i++){
        // passing blank array so that traffic does not interact with itself
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    
    // this just so happens to clear the canvas
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y+canvas.height*0.7);

    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,"red");
    }
    car.draw(ctx,"blue");

    ctx.restore();
    requestAnimationFrame(animate);
}