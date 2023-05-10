import { flatten } from "./utils.js";
import "../lib/gl-matrix.js";
const { mat4 } = glMatrix;
import { vertexShaderInfo } from "./shaderSrc.js";
class Mesh {
    name = "";
    materialIndex = 0;
    texture = null; // string. name of the texture image

    vertices = [];
    normals = [];
    texturecoords = [];
    indices = [];

    initialTransformMatrix = mat4.create();
    transformMatrix = mat4.create();

    constructor(meshObj, gl, texture) {
        this.name = new String(meshObj.name);
        if(meshObj.materialindex != null) {
            this.materialIndex = meshObj.materialindex;
        }
        this.texture = texture;
        
        this.vertices = new Float32Array(meshObj.vertices);
        this.normals = new Float32Array(meshObj.normals);
        this.texturecoords = new Float32Array(meshObj.texturecoords[0]);
        this.indices = new Uint16Array(flatten(meshObj.faces));

        this.vao = this.bindBuffer(gl);
    }

    /**
     * Binding VAO buffer to the mesh
     * @param {WebGL2RenderingContext} gl 
     * @return {WebGLVertexArrayObject }
     */
    bindBuffer(gl) {

        let program = gl.getParameter(gl.CURRENT_PROGRAM);
        let shaderInfo = vertexShaderInfo;
        let attributeNames = shaderInfo.attributeNames;
        let attributeDims = shaderInfo.attributeDims;
        let dataFieldNames = shaderInfo.dataFieldNames;

        let vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        let attributeLocations = attributeNames.map(name => gl.getAttribLocation(program, name));

        for(let i = 0; i < attributeNames.length; i++) {
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this[dataFieldNames[i]], gl.STATIC_DRAW);
            gl.enableVertexAttribArray(attributeLocations[i]);
            gl.vertexAttribPointer(attributeLocations[i], attributeDims[i], gl.FLOAT, false, 0, 0);
        }

        // indices
        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }

}

export { Mesh };