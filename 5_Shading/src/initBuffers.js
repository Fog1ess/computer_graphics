import { Model } from "../../General/src/model.js";
/**
 * bind buffer, send attributes and indices data
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program
 * @param {*} data data of the models
 */
function initBuffers(gl, program, data) {
    // all attributes are gl.FLOAT type. Code to be expanded
    let attributeNames = ["vertPosition", "vertColor", "vertNormal"];
    let attributeDims = [Model.pointDim, Model.colorDim, Model.vecDim];

    let dimSum = attributeDims.reduce((partialSum, a) => partialSum + a, 0); // Sum of dims. For stride calculation

    //data.attributes: position3+ color3+normal3
    let arrayB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.attributes), gl.STATIC_DRAW);

    let attributeLocations = attributeNames.map(name => gl.getAttribLocation(program, name));
    let offset = 0;
    for(let i = 0 ; i < attributeNames.length; i++) {
        gl.enableVertexAttribArray(attributeLocations[i]);
        gl.vertexAttribPointer(attributeLocations[i], attributeDims[i], gl.FLOAT, false, dimSum * Float32Array.BYTES_PER_ELEMENT, offset * Float32Array.BYTES_PER_ELEMENT);
        offset += attributeDims[i];
    }

    let eleArrayB = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleArrayB);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.elements), gl.STATIC_DRAW);

}
export {initBuffers};