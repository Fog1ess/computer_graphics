class Dice {
    length = 0;
    coords = new Float32Array();
    normals = new Float32Array();
    texCoords = new Float32Array();
    indices = new Uint16Array();

    static diceCoor = [
        0.0, 0.25,  0, 0.5,  0.25, 0.5,  0.25, 0.25,  // 1
        0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 0.25,  // 2
        0.5, 0.25, 0.5, 0.5, 0.75, 0.5, 0.75, 0.25,  // 3
        0.75, 0.25, 0.75, 0.5, 1, 0.5, 1, 0.25,  // 4
        0.5, 0, 0.5, 0.25, 0.75, 0.25, 0.75, 0,  // 5
        0.5, 0.5, 0.5, 0.75, 0.75, 0.75, 0.75, 0.5  // 6
    ];

    constructor(length) {
        this.length = (length || 1) / 2;
        function face(xyz, nrm, diceNumber) {
            let start = coords.length/3;
            for (let i = 0; i < 12; i++) {
               this.coords.push(xyz[i]);
            }
            for (let i = 0; i < 4; i++) {
               this.normals.push(nrm[0],nrm[1],nrm[2]);
            }
            for (let i = 0; i < 8; i++) {
               this.texCoords.push(Dice.diceCoor[diceNumber-1][i]);
            }
            this.indices.push(start,start+1,start+2,start,start+2,start+3);
         }
         face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1], 1 );
         face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1], 6 );
         face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0], 2 );
         face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0], 5 );
         face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0], 3 );
         face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0], 4 );
    } 
}

export { Dice };