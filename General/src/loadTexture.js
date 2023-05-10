/**
 * @function loadTexture loads a texture from the given url into the given WebGLRenderingContext
 * @param {WebGL2RenderingContext} gl 
 * @param {String} imageUrl relative path of the image file
 * @returns {WebGLTexture}
 */
function loadTexture(gl, imageUrl) {

    // Bind the texture
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set the texture image to the texture object
    let level = 0;
    let internalFormat = gl.RGBA;
    let srcFormat = gl.RGBA;
    let srcType = gl.UNSIGNED_BYTE;

    // Load the texture image
    let textureImage = new Image();
    textureImage.src = imageUrl;  
    textureImage.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        textureImage
      );
    };
  
    return texture;
  }

  export { loadTexture };