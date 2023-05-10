import { vertexShaderInfo } from "./shaderSrc.js";
/**
 * bind buffer, send attributes and indices data
 * @param {WebGLRenderingContext} gl
 * @param {shaderInfo} shaderInfo information of the shader program. See ./exampleShaderSrc.js
 * @param {modelObj[]} data data array of the models
 * @param {boolean} aligned whether the data is aligned. Default is true
 */

function initBuffers(gl, data, aligned = true) {

    let program = gl.getParameter(gl.CURRENT_PROGRAM);
    let shaderInfo = vertexShaderInfo;
    let attributeNames = shaderInfo.attributeNames;
    let attributeDims = shaderInfo.attributeDims;
    let dataFieldNames = shaderInfo.dataFieldNames;
    let attributeSizes = shaderInfo.attributeSizes;

    let integratedData = integrateData(dataFieldNames, attributeDims, data, aligned);
    let attributeData = integratedData.attributeData;
    let elementData = integratedData.elementData;
    
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
        offset += attributeDims[i] * attributeSizes[i];
    }

    let eleArrayB = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleArrayB);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementData), gl.STATIC_DRAW);

}

/**
 * Integrate data, where attributes of each vertex are together and according to their order in shaderInfo
 *  - atttributes
 * @param {string[]} dataFieldNames
 * @param {number[]} attributeDims
 * @param {modelObj[]} data data array of the models. Data of every model is an object (key-value pairs), in which key is from dataFieldNames.
 * @param {Boolean} aligned 
 */
function integrateData(dataFieldNames, attributeDims, data, aligned = true, indicesFieldName = "indices") {
    let attributeData = [];
    let elementData = [];

    let count = 0; // how many points have there been. For drawing 
    let offset = 0; // the index offset. For calculating indices
    let counts = [0]; // suffix sum of count
    let offsets = [0];// suffix sum of offset

    for(let modelObj of data) {
        let pointNum = modelObj[dataFieldNames[0]].length / attributeDims[0]; // number of vertices
        for(let i = 0; i < pointNum; i++){
            for(let j = 0; j < dataFieldNames.length; j++) {
                let dataField = dataFieldNames[j];
                let attributeDim = attributeDims[j];
                for(let k = 0; k < attributeDim; k++) {
                    attributeData.push(modelObj[dataField][attributeDim*i+k]);
                }
            }
        }
        elementData.push(...modelObj[indicesFieldName].map(a => a+offset));

        offset += pointNum;
        offsets.push(offset);
        count += modelObj[indicesFieldName].length;
        counts.push(count);
    }
    return {
        // suffix sum
        counts: counts, // indicating starting index of each model. The last element indicates the total amount of points
        offsets: offsets,
        // Integrated 1D arrays
        attributeData: attributeData,
        elementData: elementData
    }
}

export {initBuffers};