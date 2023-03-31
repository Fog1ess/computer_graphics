import { Model } from "./model.js"
import { cube, uvTorus, uvCylinder, uvSphere } from "../../General/lib/simpleObjectLibrary.js"

/**
 * Create the models
 * @returns Information of models
 * {Model[]} models: array of models
 * {mat4[]} matrices: transformation matrix of models
 */
function initModels() {
    let floor = new Model(cube(10, 0.01, 10), [0.0, 1.0, 0.0, 1.0]); //green floor
    let train = new Model(cube(0.2, 0.8, 0.2), [0.2, 0.8, 0.8, 1.0]); // train
    let sun = new Model(uvSphere(1), [1.0, 0.0, 0.0, 1.0]);
    let trunk = new Model(uvCylinder(0.2, 0.3), [0.5, 0.4, 0.3, 1.0]);// trunk on the ground
    let rope = new Model(uvCylinder(0.01, 0.5), [0.8, 0.7, 0.6, 1.0], trunk, null, [0.1, 0, 0]); // brown rope
    let ball = new Model(uvSphere(0.1), [1.0, 0.0, 0.0, 1.0], rope, null, [0, 0, 0.25]); // 

    let models = [floor, train, sun, trunk, rope, ball];
    let matrices = figrues.map(x => mat4.create());

    let dataInfo = mergeAllModelData(models);
    let dataToBuffer = integrateData(dataInfo);
    return {
        models: models,
        matrices: matrices,
        data: dataToBuffer
    };
}



/**
 * Merge data of the models. Still need integration to send to VBOs.
 * @param {Model[]} models arrays of all the models in the world
 */
function mergeAllModelData(models) {
    let positions = [];
    let colors = [];
    let indices = [];
    let normalVectors = [];

    let count = 0; // how many points have there been 
    let counts = [0];
    for(let model of models) {
        positions.push(...model.positions);
        colors.push(...model.colors);
        indices.push(...model.indices.map(a => a+count));
        normalVectors.push(...model.normalVectors);
        count += model.positions.length / 3;
        counts.push(count);
    }
    return {
        models: models,
        counts: counts, // indicating starting index of each model. The last element indicates the total amount of points
        positions : positions,
        colors : colors,
        indices : indices,
        normalVectors : normalVectors
    }
}


/**
 * Integrate merged data to buffers of weGL
 * @param {*} bufferInfo Information of webGL buffers
 * @param {*} dataInfo Information of merged data
 * @returns 
 */
function integrateData(dataInfo) {
    let attributeData = [];//position, color, normal

    for(let i = 0; i < dataInfo.positions.length; i++) {
        attributeData.push(dataInfo.positions[i]);
        attributeData.push(dataInfo.colors[i]);
        attributeData.push(dataInfo.normalVectors[i]);
    }

    return {
        attributes: attributeData, 
        elements: dataInfo.indices,
        counts: dataInfo.counts
    }
}

export {initModels};