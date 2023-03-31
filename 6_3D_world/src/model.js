class Model {
    static pointDim = 3; // how many number to represent a point
    static colorDim = 4;
    static vecDim = 3;
    positions = [];
    colors = [0.8, 0.2, 0.2, 1.0]; // default colors
    indices = [];
    normalVectors = [];
    points = 0;

    sibling = null;
    parent = null;
    relativeMatrix = null; // position relative to parent model.

    /**
     * 
     * @param {*} model 
     * @param {Float32Array} colors Can be colors of all the vertices, or a single color for all vertices
     */
    constructor(model, colors, parent, sibling, relativePosition) {
        this.points = model.vertexPositions,length / 3;
        this.positions = model.vertexPositions;
        this.indices = model.indices;
        this.normalVectors = model.vertexNormals;
        
        if(colors.length == points * Model.colorDim) {
            this.colors = colors;
        } else {
            if(colors.length == Model.colorDim) {
                this.colors = colors;
            }
            let colorTemp = [];
            for(let i = 0 ; i < this.points; i++) {
                colorTemp.push(...this.colors);
            }
            this.colors = colorTemp;
        }
        this.parent = parent;
        this.sibling = sibling;
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, relativePosition);
        this.relativeMatrix = matrix;
    }
}

