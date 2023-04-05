import { vertexShaderSrc, fragmentShaderSrc } from "./src/shaderSrc.js";
import { initBuffers } from "./src/initBuffers.js";
import { createAndUseProgram } from "../General/src/initShader.js";
import { initModels } from "./src/initModels.js";
import { animate, animateId } from "./src/animation.js";
import { cameraKeydownEventListener } from "../General/src/cameraControl.js";
import  "../General/lib/gl-matrix.js";
const { mat4 , vec3 } = glMatrix;
let time = 0.0;
let deltaTime = 0.1;
var cameraPosition = vec3.fromValues(0, 0, 10);
var cameraTarget = vec3.fromValues(0, 1, 0);
var cameraUp = vec3.fromValues(0, 1, 0);
var cameraSpeed = 0.05;

function getViewingParams(){
    return [cameraPosition, cameraTarget, cameraUp];
}

document.addEventListener('keydown', (event) => {
    cameraKeydownEventListener(event, cameraPosition, cameraTarget, cameraUp, cameraSpeed);
});

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
    let counts = modelInfo.counts;
    let matrices = modelInfo.matrices;

    // create, bind buffers, send data to the buffers, point the attributes
    initBuffers(gl, program, modelInfo);

    // dealing with uniform variables
    // uniform mat4 projMatrix;
    // uniform mat4 modelToWorldMatrix;
    // uniform mat4 viewMatrix;  

    // uniform vec3 ambientLightColor;

    // uniform vec3 lightDirection;
    // uniform vec3 diffuseLightColor;

    {// Projection Matrix
        let projectionMatrix = mat4.create();
        let fieldOfView = (45 * Math.PI) / 180; // in radians
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 0.1;
        let zFar = 100.0;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        linkMat4(projectionMatrix, "projMatrix");
    }

    //model to world matrix
    animate(matrices, 0);// get initial transformation matrices of the models (t = 0)
    let modelToWorldMatrixLoc = gl.getUniformLocation(program, "modelToWorldMatrix");


    // View Matrix TODO
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
    let viewMatrixLoc = gl.getUniformLocation(program,"viewMatrix");

    let sunID = animateId["sun"];

    let lightColor = vec3.fromValues(models[sunID].colors[0], models[sunID].colors[1], models[sunID].colors[2]);
    linkVec3(lightColor, "ambientLightColor");
    linkVec3(lightColor, "diffuseLightColor");

    function linkMat4(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniformMatrix4fv(loc, false, param);
        return loc;
    }
    
    function linkVec3(param, name) {
        let loc = gl.getUniformLocation(program, name);
        gl.uniform3fv(loc, param);
        return loc;
    }


    requestAnimationFrame(render);

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        animate(matrices, time);
        // update viewing
        let [cameraPosition, cameraTarget, cameraUp] = getViewingParams();
        mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
        // update light source location
        let lightLocation = vec3.fromValues(0,0,0);
        vec3.transformMat4(lightLocation, lightLocation, matrices[animateId["sun"]]);
        linkVec3(lightLocation, "lightLocation");
        for(let i = 0; i < models.length; i++) {
            gl.uniformMatrix4fv(modelToWorldMatrixLoc, false, matrices[i]);
            gl.drawElements(gl.TRIANGLES, counts[i+1]-counts[i], gl.UNSIGNED_SHORT, counts[i]*2);
        }
        time+=deltaTime;
        requestAnimationFrame(render);
    }
}