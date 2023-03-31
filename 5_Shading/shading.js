import { uvTorus, cube } from "../General/lib/simpleObjectLibrary.js"
import { vertexShaderSrc, fragmentShaderSrc } from "./shaderSrc.js";
import { createAndUseProgram } from "../General/src/initShader.js";

const { mat4 } = glMatrix;

const pointDim = 3;
const colorDim = 4;
main();

function createModels() {
    let cubeModel = cube(1.0);
    let torusModel = uvTorus(0.5, 0.3);
    return [cubeModel, torusModel];
}

/**
 * Get values from sliders on the webpage
 * @param {String} name name of the attribute used on slider
 * @returns {Number[]} 3D parameters
 */
function getParam(name, type = "") {
    let [nameX, nameY, nameZ] = [name+type+'-x', name+type+'-y', name+type+'-z'];
    let param = new Float32Array([nameX, nameY, nameZ]
      .map(elemName => {
        let elem = document.getElementById(elemName);
        return (elem != null ? elem.value : 0.0);
      })); 
    return param;
}

function getModelsData(modelArray) {
    let result = [];
    for (let model of modelArray) {
        
    }

}
function main() {

    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    // Configure WebGL 
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things


    // create a shader program, tell the GPU to use it 
    let program = createAndUseProgram(gl, vertexShaderSrc, fragmentShaderSrc);

    // create and bind a buffer
    let bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // dealing with data
    let models = createModels();
    let data = getModelsData(models);
    gl.bufferData

    function linkMat4(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniformMatrix4fv(loc, false, param);
    }
    
    function linkVec3(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniform3fv(loc, false, param);
    }

    {// Projection Matrix
        let projectionMatrix = mat4.create();
        let fieldOfView = (45 * Math.PI) / 180; // in radians
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 0.1;
        let zFar = 100.0;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        linkMat4(projectionMatrix, "projMatrix");
    }

    let modelToWorldMatrix = mat4.create();

    {
        let viewMatrix = mat4.create();
        mat4.translate(viewMatrix, viewMatrix, [0, 0, -6.0]);
        linkMat4(viewMatrix, "viewMatrix");
    }
    
    linkMat4(modelToWorldMatrix, "modelToWorldMatrix");
    

    let ambientLightDirection = getParam("light");
    linkVec3(ambientLightDirection, "lightDirection");

}
