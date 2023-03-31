/**
 * bind buffer, send attributes and indices data
 * @param {WebGLRenderingContext} gl 
 * @param {*} data data of the models
 */
function initBuffers(gl, program, data) {
    // all attributes are gl.FLOAT type. Code to be expanded
    let attributeNames = ["vertPosition", "vertColor", "vertNormal"];
    let attributeDims = [Model.pointDim, Model.colorDim, Model.vecDim];
    let dimSum = attributeDims.reduce((partialSum, a) => partialSum + a, 0); // Sum of dims. For stride calculation
    //data.attributes: position3+ color4+normal3
    let arrayB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.attributes), gl.STATIC_DRAW);

    let attributeLocations = attributeNames.map(name => gl.getAttribLocation(program, name));
    attributeLocations.map(loc => gl.enableVertexAttribArray(loc));
    for(let i = 0 ; i < attributeNames.length; i++) {
        let offset = 0;
        gl.vertexAttribPointer(attributeLocations[i], attributeDims[i], gl.FLOAT, false, dimSum * Float32Array.BYTES_PER_ELEMENT, offset * Float32Array.BYTES_PER_ELEMENT);
        offset += attributeDims[i];
    }

    let arrayE = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_BUFFER, arrayE);
    gl.bufferData(gl.ELEMENT_BUFFER, new Uint16Array(data.elements));

    
    
}
// Draw the elements using gl.drawElements()
// The first argument specifies the type of primitive to draw
// The second argument specifies the number of indices to draw
// The third argument specifies the type of the indices (e.g. gl.UNSIGNED_SHORT)
// The fourth argument specifies the offset into the index buffer to start drawing from
//gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0);
export {initBuffers};