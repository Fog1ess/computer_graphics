import { vertexShaderInfo, fragmentShaderInfo } from "./shaderSrc.js";
import { createAndUseProgram } from "../../General/src/initShader.js";
import { initBuffers } from "./initBuffers.js";
import { loadTextures } from "./loadTexture.js";
import { Camera } from "./camera.js";
import { configuration } from "./configuration.js";
import { flatten, getParamsXYZ } from "./utils.js";
import { Model } from "./model.js";
import { animate } from "./animation.js";
import "../../General/lib/gl-matrix.js";
import { initWebGL } from "./initWebGL.js";
const { mat4, vec3, vec4 } = glMatrix;

let models = []; // global variable for models
let counts = []; // for drawing. counts[i] is the starting index of the i-th mesh
let textureNames = []; // global variable for textures
let textures = {}; 
let colors = []; // global variable for colors
let matrices = []; // global variable for matrices
let time = 0.0; // global variable for animation
let camera = new Camera();
let gl;                    
document.addEventListener('keydown', (event) => {
    camera.eventListener(event);
});

main();


async function main() {
    // get WebGL context
    gl = initWebGL();
    // load 3D model
    for(let i = 0; i < configuration.modelURLs.length; i++) {
        const url = configuration.modelDir + configuration.modelURLs[i];
        console.log("Loading " + url);
        const name = configuration.modelURLs[i].split(".")[0];
        let model = await loadJson(url, gl, name);
        models.push(model);
    }
    setUpWebGL();
}

/**
 * 
 * @param {string} url relative path of the .json file (to the html file)
 * @param {WebGL2RenderingContext} gl 
 * @param {strnig} name 
 * @returns 
 */
async function loadJson(url, gl, modelName) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not get ${url}`);
    }
    const modelInJson = await response.json();
    let model = new Model(modelInJson, gl, modelName);
    return model;
}

/**
 * 
 * @returns {WebGL2RenderingContext} gl
 */
async function setUpWebGL() {

        // setup attribute buffers
        // integrate all meshes (data, indices, textures, materials, matrices)

        let dataInfo = initBuffers(gl, models);
        counts = dataInfo.counts;
        textureNames = dataInfo.textures; // mesh[i] needs textureNames[i]
        colors = dataInfo.colors;
        matrices = dataInfo.matrices;

        // load textures
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        let textureMap = {};
        loadTextures(gl, configuration.textureNames, textureMap);


        // set uniform variables
        // vertex shader uniforms: projMatrix, modelToWorldMatrix, viewMatrix
        // fragment shader uniforms: ambientLightColor, lightDirection, diffuseLightColor, textureImage
        let uniformNames = vertexShaderInfo.uniformNames.concat(fragmentShaderInfo.uniformNames);
        let uniformLocs = {};
        let program = gl.getParameter(gl.CURRENT_PROGRAM);
        for( let name of uniformNames) {
            uniformLocs[name]=gl.getUniformLocation(program, name);
        }


        {// Projection Matrix
            let projectionMatrix = mat4.create();
            let fieldOfView = (45 * Math.PI) / 180; // in radians
            let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let zNear = 0.1;
            let zFar = 100.0;
            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
            gl.uniformMatrix4fv(uniformLocs["projMatrix"], false, projectionMatrix);
        }
    
        // Model Matrix, texture image will be linked seperately for each mesh

        // View Matrix
        let viewMatrix = camera.getViewMatrix();

        // Light Color
        gl.uniform4fv(uniformLocs["ambientLightColor"], vec4.fromValues(0.4, 0.4, 0.4, 1));
        gl.uniform4fv(uniformLocs["diffuseLightColor"], vec4.fromValues(1, 1, 1, 1));

        
     
        requestAnimationFrame(render);

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // get light direction
            let lightDirection = getParamsXYZ("light");
            gl.uniform3fv(uniformLocs["lightDirection"], lightDirection);

            // update viewing matrix
            let [cameraPosition, cameraTarget, cameraUp] = camera.parameters();
            mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
            gl.uniformMatrix4fv(uniformLocs["viewMatrix"], false, viewMatrix);


            // for every mesh
            for(let i = 0; i < counts.length - 1; i++) {
                // get transformation matrix
                gl.uniformMatrix4fv(uniformLocs["modelToWorldMatrix"], false, matrices[i]);
                // bind texture
                gl.uniform1i(uniformLocs["textureImage"], textureMap[textureNames[i]]);
                // draw
                gl.drawElements(gl.TRIANGLES, counts[i+1] - counts[i], gl.UNSIGNED_SHORT, counts[i] * 2);
            }

            animate(time, models, matrices);

            time += 10;
            
            requestAnimationFrame(render);
        }
        
}



// function createModelAttributeArray(obj2) {
//     // obj.mesh[x] is an array of attributes
//     // vertices, normals, texture coord, indices

//     // get number of meshes
//     let numMeshIndexs = obj2.meshes.length;
//     console.log("Number of Meshes: " + numMeshIndexs + "\n");
//     for (let idx = 0; idx < numMeshIndexs; idx++) {
//         let modelObj = {};

//         modelObj.vertices = new Float32Array(obj2.meshes[idx].vertices);
//         modelObj.normals = new Float32Array(obj2.meshes[idx].normals);
//         modelObj.texturecoords = new Float32Array(obj2.meshes[idx].texturecoords[0]);
//         modelObj.indices = new Uint16Array(flatten(obj2.meshes[idx].faces));

//         ModelAttributeArray.push(modelObj);
//     }
// }
