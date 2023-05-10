import { Dice } from "../lib/dice";
import "../../General/lib/gl-matrix.js";
import { vertexShaderInfo } from "./shaderSrc";
const {mat4} = glMatrix;

let modelId = {
    "bigD": 0,
    "midD" : 1,
    "smallD": 2
}

let sizes = {
    "big": 0.4,
    "midium": 0.2,
    "small": 0.1
};

function initModels() {
    
    let dice1 = new Dice(sizes["big"]);
    let dice2 = new Dice(sizes["medium"]);
    let dice3 = new Dice(sizes["small"]);
    
    let models = [dice1, dice2, dice3];
    let matrices = models.map(()=>mat4.create());

    let dataInfo = integrateData(models);
    return {

    }
}

function integrateData(models) {
    let attributeData = [];
    let elementData = [];
    
}
function integrateData(models) {

    let attributeData = [];
    let elementData = [];

    let pointDim = Model.pointDim; // 3
    let colorDim = Model.colorDim; // 3
    let normalVectorDim = Model.vecDim; // 3

    let count = 0; // how many indices have their been. For drawing 
    let offset = 0; // the index offset. For calculating indices
    let counts = [0]; // suffix sum of count
    let offsets = [0];// suffix sum of offset
    for(let model of models) {
        for(let i = 0; i < model.points; i++){
            for(let j = 0; j < pointDim; j++) {
                attributeData.push(model.positions[pointDim*i+j]);
            }
            for(let j =0; j < colorDim; j++) {
                attributeData.push(model.colors[colorDim*i+j]);
            }
            for(let j = 0; j < normalVectorDim; j++) {
                attributeData.push(model.normalVectors[normalVectorDim*i+j]);
            }
        }
        elementData.push(...model.indices.map(a => a+offset));

        offset += model.points;
        offsets.push(offset);
        count += model.indices.length;
        counts.push(count);
    }
    return {
        // suffix sum
        counts: counts, // indicating starting index of each model. The last element indicates the total amount of points
        offsets: offsets,
        // Integrated 1D arrays
        attributes: attributeData,
        elements: elementData
    }
}

export {initModels};