class Cube {
    static defaultSize = 0.5;
    static numPositions = 36;
    static positionDim = 4;
    static indices = [// Surface of the cube consist of these 12 triangles
        1, 0, 3,  3, 2, 1,
        2, 3, 7,  7, 6, 2,
        3, 0, 4,  4, 7, 3,
        6, 5, 1,  1, 2, 6,
        4, 5, 6,  6, 7, 4,
        5, 4, 0,  0, 1, 5
    ];
    static defaultFaceColors = [
        [1.0, 0.0, 0.0, 1.0], // red
        [1.0, 1.0, 0.0, 1.0], // yellow
        [0.0, 1.0, 0.0, 1.0], // green
        [0.0, 0.0, 1.0, 1.0], // blue
        [1.0, 0.0, 1.0, 1.0], // magenta
        [0.0, 1.0, 1.0, 1.0], // cyan
    ];


    faceColors = Cube.defaultFaceColors;

    vertices = [];
    triangleVertices = [];

    // takes an array of (3) side lengths
    // rotation will be based on the origin 
    constructor(size, offset = [0, 0, 0]) {
        this.size = size;
        let [sizeX, sizeY, sizeZ] = size.map(a => (a / 2.0));
        this.vertices = [// 8 vertices of the cube
        [-sizeX, -sizeY,  sizeZ, 1.0],
        [-sizeX,  sizeY,  sizeZ, 1.0],
        [ sizeX,  sizeY,  sizeZ, 1.0],
        [ sizeX, -sizeY,  sizeZ, 1.0],
        [-sizeX, -sizeY, -sizeZ, 1.0],
        [-sizeX,  sizeY, -sizeZ, 1.0],
        [ sizeX,  sizeY, -sizeZ, 1.0],
        [ sizeX, -sizeY, -sizeZ, 1.0]
        ];

        for(let i = 0; i < 8; i++)
            for(let j = 0; j < 3; j++)
                this.vertices[i][j] += offset[j];
    }
}


export { Cube };