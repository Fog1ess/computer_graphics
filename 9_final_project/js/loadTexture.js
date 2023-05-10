/**
 * @function loadTexture loads a texture from the given url into the given WebGLRenderingContext
 * @param {WebGL2RenderingContext} gl 
 * @param {String[]} urls  image file names
 * @param {Object} textureMap  Return value. map from texture name to texture object
 * @returns {WebGLTexture[]}
 *  */

async function loadTextures(gl, urls, textureMap) {
  let textures = [];

  async function loadImage(url) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = "texture/" + url;
    }).catch(error => {
      console.error(error);
      return null;
    });
  }

  for (let i = 0; i < urls.length; i++) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the parameters for the texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Load the texture image asynchronously
    let image = await loadImage(urls[i]);
    if(image == null) {
      continue;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    textures.push(texture);
  }

  for(let i = 0; i < urls.length; i++) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]); 
    textureMap[urls[i]] = i;
  }
}
  export { loadTextures };