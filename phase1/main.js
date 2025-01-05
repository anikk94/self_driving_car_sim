const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 3);

// const car = new Car(road.getLaneCenter(1), 100, 30, 50,"KEYS");
// const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI");

// searching for the best candidate car 100 in parallel
const N=0;
const cars=generateCars(N);
let bestCar=cars[0];
const mutation = true;

if(mutation){
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            // keep the previous bestBrain un-mutated for comparison
            if(i!=0){
                // TODO
                // 1. implement crossover genetic algorithm
                // 2. NEAT (evolving nn throught augmenting topologies paper)
                NeuralNetwork.mutate(cars[i].brain,0.1);
            }
        }
    }
} else {
    if(localStorage.getItem("bestBrain")){
        bestCar.brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
    }
}


const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
]

// car.draw(carCtx);

animate();

// function to save the weights/car brain which 
// performs well with random intialization
function save(){
    // the reason that network is filled with static
    // methods is so that stringify can be used? serialization?
    // => serializing the brain into local storage
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars; 
}

function animate(time){
    for (let i=0;i<traffic.length;i++){
        // passing blank array so that traffic does not interact with itself
        traffic[i].update(road.borders,[]);
    }

    // car.update(road.borders,traffic);
    for(let i=0;i<cars.length;i++){
            cars[i].update(road.borders,traffic);
    }
    
    // find the best car
    // bestCar is the car with the smallest y-value
    // this is the fitness function that is chosen to qualify the 'best car'
    bestCar=cars.find(
        // find the min value amongst the values generated using the code
        // argument
        c=>c.y==Math.min(
            // this makes a new array of only the y-values of the cars
            // ... opens the array (spreading) into a collection of individual values
            // which is distinctly different from a javascript Array
            ...cars.map(c=>c.y)
        )
    );
    // TODO
    // implement the following fitness functions
    // 1. car that moves forward but is penalized for swirving from lane to lane
    // 2. car that moves forward but is penalized for straddling a lane
    // 3. car that moves forward along a curved path, not just up to reducing y values


    // this just so happens to clear the canvas
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    // carCtx.translate(0,-car.y+carCanvas.height*0.7); 

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    // draw cars
    carCtx.globalAlpha=0.2; // set transparency
    // car.draw(carCtx,"blue");
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1; // reset transparency

    // draw the best car without transparency, full colour
    // and with sensor (lines) visible
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    // Visualizer.drawNetwork(networkCtx,car.brain);

    // sends time automatically
    requestAnimationFrame(animate);
}