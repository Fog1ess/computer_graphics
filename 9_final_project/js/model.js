import { Mesh } from "./mesh.js";
import { lastPiece } from "./utils.js";
import "../../General/lib/gl-matrix.js";
const {mat4} = glMatrix;   

class Model {

    name = "";
    meshes = []; // array of Mesh
    meshMap = {}; // map<Number, Number> from origin index in .json file to modified index (because of blocked meshes)

    treeRoot = null; // root of the tree

    useTexture = true; // boolean. Use mesh.color if false
    textures = []; // String[] (name of texture images)

    blockSet = new Set(); // set of strings (name of blocked meshes)
    transformMatrix = mat4.create(); // 

    animation = null; // animation data

    /**
     * select all the non-blocked meshes, integrate the data, save the starting index of each mesh.
     * @param {JSON} modelInJson 
     * @param {WebGL2RenderingContext} gl
     * @param {Set(String)} blockSet 
     */
    constructor(modelInJson, gl, modelName, blockSet = new Set()) {

        this.name = modelName;
        this.blockSet = blockSet;

        // create texture array (textures[mesh.materialIndex] is the texture of the mesh)
        this.useTexture = (modelInJson.useTexture) ? true : false;
        if(this.useTexture) {
            for(let material of modelInJson.materials) {
                let fileField = material.properties.find(x => x.key === '$tex.file');
                const originalUrl = fileField ? fileField.value : "";
                this.textures.push(lastPiece(originalUrl)); // the file name of the texture image 
            }
        }


        // load meshes
        for(let i = 0; i < modelInJson.meshes.length; i++) {

            const meshObj = modelInJson.meshes[i];

            if(blockSet.has(meshObj.name)) continue; // skip blocked meshes

            let mesh = new Mesh(meshObj, gl, this.useTexture ? this.textures[meshObj.materialindex] : null);
            this.meshes.push(mesh);
            this.meshMap[i] = this.meshes.length - 1;
        }

        // traverse the tree and update the transformMatrix of each mesh
        this.treeRoot = modelInJson.rootnode;
        this.traverse();

        

        // animation
        if(modelInJson.animations)
            this.animation = modelInJson.animations[0];
    }


    /**
     * Traverse the tree and update the transformMatrix of each mesh.
     * @param {Object} dictionary
     * @param {Object} node 
     * @param {mat4} basicMatrix 
     * @returns 
     */

    traverse(dictionary = {}, node = this.treeRoot, basicMatrix = this.transformMatrix) {
        let animationMatrix = (dictionary[node.name])? dictionary[node.name] : mat4.create();
        let matrix = mat4.create();
        let current = mat4.fromValues(...node.transformation);
        mat4.transpose(current, current);
        if(node.meshes) {
            for(let meshIndex of node.meshes) {
                const currentIndex = this.meshMap[meshIndex];
                if(currentIndex === null) continue;
                const mesh = this.meshes[currentIndex];
                mat4.mul(mesh.transformMatrix, basicMatrix, animationMatrix);
                mat4.mul(mesh.transformMatrix, mesh.transformMatrix, current);
                // TODO draw(mesh)
            }
            return;
        }
        mat4.mul(matrix, basicMatrix, animationMatrix);
        mat4.mul(matrix, matrix, current);
        if(node.children) {
            for(let child of node.children) {
                this.traverse(dictionary, child, matrix);
            }
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     */
    draw(mesh) {
        // TODO Information needed: uniformLocs, textureMap
        gl.uniformMatrix4fv(uniformLocs["modelToWorldMatrix"], false, mesh.transformMatrix);
        if(mesh.texture != null) {
            gl.uniform1i(uniformLocs["textureImage"], textureMap[mesh.texture]);
        }
        gl.bindVertexArray(mesh.vao);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}

export {Model};
