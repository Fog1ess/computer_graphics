import { uvTorus, cube } from "../General/lib/simpleObjectLibrary.js"
import { vertexShaderSrc, fragmentShaderSrc } from "./src/shaderSrc.js";
import { initBuffers } from "./src/initBuffers.js";
import { createAndUseProgram } from "../General/src/initShader.js";
import { initModels } from "./src/initModels.js";

const { mat4 } = glMatrix;

let time = 0.0;
let deltaTime = 0.1;

main();


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

    // create models
    let modelInfo = initModels();
    let models = modelInfo.models;
    let matrices = modelInfo.matrices;

    // create, bind buffers, send data to the buffers, point the attributes
    initBuffers(gl, program, modelInfo.data);

    // dealing with uniform variables
    animate(matrices, 0);// get initial transformation matrices of the models (t = 0)
    {// Projection Matrix
        let projectionMatrix = mat4.create();
        let fieldOfView = (45 * Math.PI) / 180; // in radians
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 0.1;
        let zFar = 100.0;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        linkMat4(projectionMatrix, "projMatrix");
    }
    
    {// View Matrix
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, [0.0, 5.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
        linkMat4(viewMatrix, "viewMatrix");
    }


    function linkMat4(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniformMatrix4fv(loc, false, param);
    }
    
    function linkVec3(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniform3fv(loc, false, param);
    }


    let modelToWorldMatrix = mat4.create();

    
    linkMat4(modelToWorldMatrix, "modelToWorldMatrix");
    

    let ambientLightDirection = getParam("light");
    linkVec3(ambientLightDirection, "lightDirection");

}
