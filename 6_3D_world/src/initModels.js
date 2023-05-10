import { Model } from "../../General/src/model.js";
import { cube, uvTorus, uvCylinder, uvSphere } from "../../General/lib/simpleObjectLibrary.js";
import "../../General/lib/gl-matrix.js";
const {mat4} = glMatrix;

/**
 * Create the models
 * @returns Information of models
 * {Model[]} models: array of models
 * {mat4[]} matrices: transformation matrix of models
 */
function initModels() {
    let floor = new Model(cube(100), [0.0, 0.5, 0.0]);
    let train = new Model(cube(0.2), [0.8, 0.8, 0.2]);
    let trunk = new Model(uvCylinder(0.3, 2), [0.5, 0.4, 0.3]);
    let rope = new Model(uvCylinder(0.02, 2), [0.8, 0.7, 0.6]);
    let ball = new Model(uvSphere(0.1), [0.7, 0.0, 0.0]);
    let ball2 = new Model(uvSphere(0.1), [0.0, 0.0, 0.7]);
    let sun = new Model(uvSphere(0.1), [1.0, 1.0, 0.8]); // Light source

    let models = [floor, train, trunk, rope, ball, ball2, sun];
    let matrices = models.map(x => mat4.create());

    let dataInfo = integrateData(models);
    return {
        models: models,
        matrices: matrices,
        counts: dataInfo.counts,
        offsets: dataInfo.offsets,
        attributes: dataInfo.attributes,
        elements: dataInfo.elements
    };
}



/**
 * Merge data of the models. Still need integration to send to VBOs.
 * @param {Model[]} models arrays of all the models in the world
 * @returns {ModelDataInformation} Five arrays containing information of all the models.
 */
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