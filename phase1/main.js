const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 3)
// const car = new Car(road.getLaneCenter(1), 100, 30, 50,"KEYS");
const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI");
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
]

car.draw(carCtx);

animate();

function animate(time){
    for (let i=0;i<traffic.length;i++){
        // passing blank array so that traffic does not interact with itself
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    
    // this just so happens to clear the canvas
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    car.draw(carCtx,"blue");

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,car.brain);

    // sends time automatically
    requestAnimationFrame(animate);
}