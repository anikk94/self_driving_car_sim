// network made of fully connected network layers
class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        // calculate output of the first level using inputs
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        // calculate of each layer outputs starting with
        // output of first layer
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]
            );
        }
        // actions are the outputs
        return outputs
    }
}

// fully connected network layerneuronCount
class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        // radu calls the threshold for each output neuron a bias
        this.biases=new Array(outputCount);
        
        this.weights=[];
        // one array for each input with weights/edges to every output
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        };

        Level.#randomize(this);
    };

    // done this way for serialization later. methods don't serialize
    // radu said something about object serialize and how methods dont serialize
    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        // set the inputs side of the layer to the sensor inputs or the previous layer outputs
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        // adding and multiplying inputs and weights to get output values
        for(let i=0;i<level.outputs.length;i++){
            let sum=0;
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.weights[j][i]*level.inputs[j];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            } else {
                level.outputs[i]=0;
            }
        }
        return level.outputs;
    }
}