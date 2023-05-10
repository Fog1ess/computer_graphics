import { Model } from "./model.js";
import { Mesh } from "./mesh.js";
import { vertexShaderInfo } from "./shaderSrc.js";
/**
 * bind buffer, send attributes and indices data
 * @param {WebGLRenderingContext} gl
 * @param {shaderInfo} shaderInfo information of the shader program. See shaderSrc.js
 * @param {Model[]} models data array of the models
 * @param {Object[]} textures the function will output texture objects(Image[])
 * @param {mat4[]} matrices the function will output pointers to the matrices of meshes(mat4[])
 */

function initBuffers(gl, models) {

    let program = gl.getParameter(gl.CURRENT_PROGRAM);
    let shaderInfo = vertexShaderInfo;
    let attributeNames = shaderInfo.attributeNames;
    let attributeDims = shaderInfo.attributeDims;
    let dataFieldNames = shaderInfo.dataFieldNames;
    let attributeSizes = shaderInfo.attributeSizes;

    let integratedData = integrateData(dataFieldNames, attributeDims, models);
    let attributeData = integratedData.attributeData;
    let elementData = integratedData.elementData;


    
    // calculate stride
    let stride = 0;
    for(let i = 0; i < attributeDims.length; i++) {
        stride += attributeDims[i] * attributeSizes[i];
    }

    let arrayB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attributeData), gl.STATIC_DRAW); 

    let attributeLocations = attributeNames.map(name => gl.getAttribLocation(program, name));
    let offset = 0;
    for(let i = 0 ; i < attributeNames.length; i++) {
        gl.enableVertexAttribArray(attributeLocations[i]);
        gl.vertexAttribPointer(attributeLocations[i], attributeDims[i], gl.FLOAT, false, stride, offset);
        offset += attributeDims[i] * Float32Array.BYTES_PER_ELEMENT;// or attributeSizes[i];
    }

    let eleArrayB = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleArrayB);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementData), gl.STATIC_DRAW);

    // return values
    return {
        textures: integratedData.textures,
        colors: integratedData.colors,
        matrices: integratedData.matrices,
        counts: integratedData.counts
    }
}

/**
 * Integrate data, where attributes of each vertex are together and according to their order in shaderInfo
 *  - atttributes
 * @param {string[]} dataFieldNames
 * @param {number[]} attributeDims
 * @param {Model[]} models array of the models. Model is array of meshes
 */
function integrateData(dataFieldNames, attributeDims, models, indicesFieldName = "indices") {
    let attributeData = [];
    let elementData = [];
    let textures = [];
    let colors = [];
    let matrices = [];

    let offset = 0; // the index offset. For calculating indices
    let count = 0; // how many points have there been. For drawing 
    let counts = [0]; // suffix sum of counts. For drawing

    for(let model of models) {
        for(let mesh of model.meshes) {
            let pointNum = mesh[dataFieldNames[0]].length / attributeDims[0]; // number of vertices
            // integrate attribute data of the mesh
            for(let i = 0; i < pointNum; i++){
                for(let j = 0; j < dataFieldNames.length; j++) {
                    let dataField = dataFieldNames[j];
                    let attributeDim = attributeDims[j];
                    for(let k = 0; k < attributeDim; k++) {
                        attributeData.push(mesh[dataField][attributeDim*i+k]);
                    }
                }
            }
            // integrate element data of the mesh, update offset and count
            elementData.push(...mesh[indicesFieldName].map(a => a + offset));
            offset += pointNum;
            counts.push(count += mesh[indicesFieldName].length);
            textures.push(model.textures[mesh.materialIndex]);
            colors.push(mesh.colors);
            matrices.push(mesh.transformMatrix);

        }
    }
    return {
        // suffix sum
        counts: counts, // indicating starting index of each mesh. The last element indicates the total amount of points
        // Integrated 1D arrays
        attributeData: attributeData,
        elementData: elementData,
        textures: textures,
        colors: colors,
        matrices: matrices
    }
}

export {initBuffers};