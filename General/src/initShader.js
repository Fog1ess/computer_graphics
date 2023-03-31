/**
 * Compile shaders
 * @param {WebGLRenderingContext} gl webGL context
 * @param {*} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {String} source source code
 * @returns 
 */
// 
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * link shaders into a program
 * @param {WebGLRenderingContext} gl webGL context
 * @param {String} vertexShaderSrc source code of vertex shader
 * @param {String} fragmentShaderSrc source code of fragment shader
 * @returns {WebGLProgram}
 */
function createAndUseProgram(gl, vertexShaderSrc, fragmentShaderSrc){
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        gl.useProgram(program);
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
}


export {createAndUseProgram};