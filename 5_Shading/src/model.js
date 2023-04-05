class Model {
    static pointDim = 3; // how many number to represent a point
    static colorDim = 3;
    static vecDim = 3;
    positions = [];
    colors = [0.8, 0.2, 0.2]; // default colors
    indices = [];
    normalVectors = [];
    points = 0; // number of vertices
    //counts = this.indices.length;

    sibling = null;
    parent = null;
    relativeMatrix = null; // position relative to parent model.

    /**
     * 
     * @param {SimpleObject} model Described by IFS representation
     * @param {Float32Array} colors Can be colors of all the vertices, or a single color for all vertices
     */
    constructor(model, colors) {
        this.points = model.vertexPositions.length / 3;
        this.positions = model.vertexPositions;
        this.indices = model.indices;
        this.normalVectors = model.vertexNormals;
        
        if(colors.length == this.points * Model.colorDim) {
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
    }
}

export {Model}

