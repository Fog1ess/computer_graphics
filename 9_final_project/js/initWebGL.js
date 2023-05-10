import { vertexShaderInfo, fragmentShaderInfo} from "./shaderSrc.js";

let programInfo = {};
/**
 * @function createShader Compile shaders
 * @param {WebGLRenderingContext} gl webGL context
 * @param {*} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {String} source source code
 * @returns {Shader} return shader if compie succeed
 */
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
 * @returns {Boolean} True if program is created and used successfully
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
        return true;
    }
    console.log(gl.getProgramInfoLog(program));
    return false;
}

/**
 * Initialize WebGL
 * 
 */
function initWebGL(){
    const canvas = document.getElementById('canvas');
    let gl = canvas.getContext('webgl2');
    if(!gl){
        alert('WebGL 2 not supported');
        return;
    }
    // Configure WebGL
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // set background color
    gl.enable(gl.DEPTH_TEST); // enable depth test
    gl.depthFunc(gl.LEQUAL); // near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear color and depth buffer

    // create shader program
    let vertexShaderSrc = vertexShaderInfo.source;
    let fragmentShaderSrc = fragmentShaderInfo.source;
    createAndUseProgram(gl, vertexShaderSrc, fragmentShaderSrc);

    return gl;
}

export {initWebGL};