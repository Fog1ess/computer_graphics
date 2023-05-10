/**
 *
 * @param {WebGLRenderingContext} gl 
 * @param {String} imageName the relative or absolute file path of the textrue image. If relative, it would be relative to the caller.
 */
function loadTexture(gl, imageUrl){
    // Step 1: Load the texture image
    let textureImage = new Image();
    textureImage.src = imageUrl;
    textureImage.onload = function() {
        // Step 2: Bind the texture
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Step 3: Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D. gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Step 4: Set the texture image to the texture object
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
    }
}