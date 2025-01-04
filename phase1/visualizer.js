class Visualizer{
    static drawNetwork(ctx,network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;

        // Visualizer.drawLevel(ctx,network.levels[0],
        //     left,top,
        //     width,height
        // );

        const levelHeight=height/network.levels.length;
        for(let i=network.levels.length-1;i>=0;i--){
            const levelTop=top+
                lerp(
                    height-levelHeight,
                    0,
                    network.levels.length==1
                    ?0.5
                    :i/(network.levels.length-1)
                );
            ctx.setLineDash([7,3])
            Visualizer.drawLevel(ctx,network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i==network.levels.length-1
                    ?["F","L","R","B"]
                    :[]
            )
        }

        // ⇦ 8678 21E6
        // ⇧ 8679 21E7
        // ⇨ 8680 21E8
        // ⇩ 8681 21E9



    }

    static drawLevel(ctx,level,left,top,width,height,outputLabels){
        const right=left+width;
        const bottom=top+height;

        // unpacking some of the attributes of object for easy access
        const {inputs,outputs,weights,biases}=level;

        // drawing weights, edges between nodes
        for (let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs,i,left,right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs,j,left,right),
                    top
                );
                ctx.lineWidth=2;
                ctx.strokeStyle=getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius=18;
        // drawing the input nodes
        for(let i=0;i<inputs.length;i++){
            // lerp for x coor spacing of the nodes
            const x=Visualizer.#getNodeX(inputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius,0,2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, 0.6*nodeRadius,0,2*Math.PI);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
        }
        // drawing the output nodes
        for(let i=0;i<outputs.length;i++){
            // lerp for x coor spacing of the nodes
            const x=Visualizer.#getNodeX(outputs,i,left,right)
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius,0,2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, 0.6*nodeRadius,0,2*Math.PI);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();

            // draw rings for biases 
            ctx.beginPath();
            ctx.lineWidth=3;
            ctx.arc(x,top,0.8*nodeRadius,0,2*Math.PI);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // output node labels
            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="white";
                ctx.strokeStyle="black";
                ctx.font=(nodeRadius*1.5)+"px Arial;";
                ctx.fillText(outputLabels[i],x,top);
                ctx.lineWidth=1;
                ctx.strokeText(outputLabels[i],x,top);
            }
        }
    }

    // lerp function extracted for readablity
    static #getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1?0.5:index/(nodes.length-1)
        );
    }


}