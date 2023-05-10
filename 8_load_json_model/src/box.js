import { vertexShaderInfo, fragmentShaderInfo } from "./shaderSrc.js";
import { createAndUseProgram } from "../../General/src/initShader.js";
import { initBuffers } from "./initBuffers.js";
import { loadTexture } from "../../General/src/loadTexture.js";

import { Camera } from "../../General/src/camera.js";
import "../../General/lib/gl-matrix.js";
const { mat4, vec3, vec4} = glMatrix;
let obj; // used for debugging in web-browser console

let ModelMaterialsArray = []; // an array of materials
let ModelAttributeArray = []; // vertices, normals, textcoords, uv
let camera = new Camera();

document.addEventListener('keydown', (event) => {
    camera.eventListener(event);
});

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

/**
 * Entry Point for HTML <body onload() >
 * Uses Asynchronous HTTP request to load 3D Mesh Model in JSON format
 * 
 */

function main() {

    /**
    *   Load external model. The model is stored in
        two Arrays
            * ModelMaterialsArray[]
                each index has set material of uniforms for a draw call
                {ambient, diffuse, specular, ...}

            * ModelAttributeArray[]
                each index contains set of attributes for a draw call
                {vertices, normals, texture coords, indices and materialindex number}

                the materialindex number specifies which index in the ModelMaterialsArray[]
                has the illumination uniforms for this draw call

    */

    // uri is relative to directory containing HTML page
    loadExternalJSON('./model/crate.json');
    
    console.log("The length of the model material array is: " + ModelMaterialsArray.length);
}

/**
 * 
 * @returns {WebGL2RenderingContext} gl
 */
function setUpWebGL() {

        // get webGL context
        let gl = document.getElementById('canvas').getContext('webgl2');
        if(!gl) {
            alert('WebGL 2 not supported');
            return;
        }
        // Configure WebGL 
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things


        // create shader program
        let vertexShaderSrc = vertexShaderInfo.source;
        let fragmentShaderSrc = fragmentShaderInfo.source;
        createAndUseProgram(gl, vertexShaderSrc, fragmentShaderSrc);

        // setup attribute buffers
        initBuffers(gl, ModelAttributeArray);


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
    
        // Model Matrix will be linked later in render loop
        let modelToWorldMatrix = mat4.create();

        // View Matrix
        let viewMatrix = camera.getViewMatrix();

        // Light Color
        gl.uniform4fv(uniformLocs["ambientLightColor"], vec4.fromValues(0.6, 0.6, 0.6, 1));
        gl.uniform4fv(uniformLocs["diffuseLightColor"], vec4.fromValues(1, 1, 1, 1));

        // texture
        let texture = loadTexture(gl, "texture/simple_crate_tex.jpg");

        function getParamsXYZ(name, type = "") {
            let [nameX, nameY, nameZ] = [name+type+'-x', name+type+'-y', name+type+'-z'];
            let result = new Float32Array([nameX, nameY, nameZ]
            .map(elemName => {
                let elem = document.getElementById(elemName);
                return (elem != null ? elem.value : 0.0);
            }));
            return result;
        }

        function getRotateMatrix(rotateParam, matrix = mat4.create()) {
            let result = matrix;
            glMatrix.mat4.rotateX(result, result, rotateParam[0]* Math.PI / 180 );
            glMatrix.mat4.rotateY(result, result, rotateParam[1]* Math.PI / 180 );
            glMatrix.mat4.rotateZ(result, result, rotateParam[2]* Math.PI / 180 );
            return result;
        }
    
    
        requestAnimationFrame(render);

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // get ambient light direction
            let ambientLightDirection = getParamsXYZ("light");
            gl.uniform3fv(uniformLocs["lightDirection"], ambientLightDirection);

            // update viewing matrix
            let [cameraPosition, cameraTarget, cameraUp] = camera.parameters();
            mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
            gl.uniformMatrix4fv(uniformLocs["viewMatrix"], false, viewMatrix);

            // transform model
            let translateParam = getParamsXYZ("box");
            let rotateParam = getParamsXYZ("box", "-rotate");
            modelToWorldMatrix = mat4.create();
            mat4.translate(modelToWorldMatrix, modelToWorldMatrix, translateParam);
            modelToWorldMatrix = getRotateMatrix(rotateParam, modelToWorldMatrix);
            mat4.translate(modelToWorldMatrix, modelToWorldMatrix, vec3.fromValues(0.0, 0.0, 0.6));
            gl.uniformMatrix4fv(uniformLocs["modelToWorldMatrix"], false, modelToWorldMatrix);

            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(render);
        }
        
}

function flatten(twoDimensionalArray) {
    let result = [];
    for (let i = 0; i < twoDimensionalArray.length; i++) {
        for (let j = 0; j < twoDimensionalArray[i].length; j++) {
            result.push(twoDimensionalArray[i][j]);
        }
    }
    return result;
}
/**
 * @function createModelAttributeArray - Extracts the Attributes from JSON and stores them in ModelAttribute Array
 * attributes include {vertices, normals, indices, and texture coordinates}
 * 
 * @param {JSON} obj2 3D Model in JSON Format
 */
function createModelAttributeArray(obj2) {
    // obj.mesh[x] is an array of attributes
    // vertices, normals, texture coord, indices

    // get number of meshes
    let numMeshIndexs = obj2.meshes.length;
    console.log("Number of Meshes: " + numMeshIndexs + "\n");
    for (let idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        modelObj.vertices = new Float32Array(obj2.meshes[idx].vertices);
        modelObj.normals = new Float32Array(obj2.meshes[idx].normals);
        modelObj.texturecoords = new Float32Array(obj2.meshes[idx].texturecoords[0]);
        modelObj.indices = new Uint16Array(flatten(obj2.meshes[idx].faces));

        ModelAttributeArray.push(modelObj);
    }
}
/**
 * @function createMaterialsArray - Extracts the Materials from JSON and stores them in ModelAttribute Array
 * attributes include {ambient, diffuse, shininess, specular and possible textures}
 * @param {JSON} obj2 3D Model in JSON Format
 * 
 */
function createMaterialsArray(obj2){
    console.log('In createMaterialsArray...');
    console.log(obj2.meshes.length);
    // length of the materials array
    // loop through array extracting material properties 
    // needed for rendering
    let itr = obj2.materials.length;
    let idx = 0;

    // each iteration extracts a group of materials from JSON 
    for (idx = 0; idx < itr; idx++) {
        let met = {};
        // shading 
        met.shadingm = obj2.materials[idx].properties[1].value;
        /**
         * similar for
         * ambient
         * diffuse
         * specular
         * shininess
         */


        // object containing all the illumination comp needed to 
        // illuminate faces using material properties for index idx
        ModelMaterialsArray.push(met);
    }
}


// load an external object using 
// newer fetch() and promises
// input is url for requested object
// 

/**
 * loadExternalJson - Loads a 3D Model (in JSON Format)
 *  1. request json file from server
 *  2. call createMaterialsArray 
 *     Populates JavaScript array with Model Materials {ambient, diffuse, shiniess, and textures}
 * 
 *  3. call crateModelAttributeArray
 *     Populates JavaScript array with Model Attributes {vertices, normals, textCoords, }
 * 
 *  4. call setUpWebGL
 *     create WebGL context
 *     Creates and binds buffers
 *     rendering loop
 * 
 * @param {uri} url -- the uri for the 3D Model to load. File should be a JSON format
 */
function loadExternalJSON(url) {
    fetch(url)
        .then((resp) => {
            // if the fetch does not result in an network error
            if (resp.ok)
                return resp.json(); // return response as JSON
            throw new Error(`Could not get ${url}`);
        })
        .then(function (ModelInJson) {
            // get a reference to JSON mesh model for debug or other purposes 
            obj = ModelInJson;
            createMaterialsArray(ModelInJson);
            createModelAttributeArray(ModelInJson);
            setUpWebGL();
        })
        .catch(function (error) {
            // error retrieving resource put up alerts...
            alert(error);
            console.log(error);
        });
}