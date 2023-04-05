import { initModels } from "./src/initModels.js";
import { initBuffers } from "./src/initBuffers.js";
import { vertexShaderSrc, fragmentShaderSrc } from "./src/shaderSrc.js";
import { createAndUseProgram } from "../General/src/initShader.js";

const { vec3, mat4 } = glMatrix;



main();


/**
 * Get values from sliders on the webpage
 * @param {String} name name of the attribute used on slider
 * @param {String} type type of parameters (translate, rotate, direction...). Empty by default
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

    let modelInfo = initModels();
    let models = modelInfo.models;
    let counts = modelInfo.counts;
    let matrices = modelInfo.matrices;

    initBuffers(gl, program, modelInfo);

    
    // Uniform Variables

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
        let cameraPosition = vec3.fromValues(0, 0, 5);
        let cameraTarget = vec3.fromValues(0, 1, 0);
        let cameraUp = vec3.fromValues(0, 1, 0);
        mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
        linkMat4(viewMatrix, "viewMatrix");
    }

    // Model to World Matrix
    let modelToWorldMatrixLoc = gl.getUniformLocation(program, "modelToWorldMatrix");
    
    // Light Direction
    let ambientLightDirection = getParam("light");
    linkVec3(ambientLightDirection, "lightDirection");

    let lightColor = [1.0, 1.0, 1.0];
    linkVec3(lightColor, "ambientLightColor");
    linkVec3(lightColor, "diffuseLightColor");


    requestAnimationFrame(render);
    
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

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        let ambientLightDirection = getParam("light");
        linkVec3(ambientLightDirection, "lightDirection"); 
        for(let i = 0; i < models.length; i++) {
            gl.uniformMatrix4fv(modelToWorldMatrixLoc, false, matrices[i]);
            gl.drawElements(gl.TRIANGLES, counts[i+1]-counts[i], gl.UNSIGNED_SHORT, counts[i]*2); // 2 = bytes of unit16, type of indices
        }
        requestAnimationFrame(render);
    }
}
