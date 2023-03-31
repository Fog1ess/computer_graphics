import '../../General/lib/gl-matrix.js';
import { Cube } from './cube.js'
// default settings of different parts

class Figure{
    //deafult size
    static headSize = [0.2, 0.2, 0.2];
    static torsoSize = [0.3, 0.5, 0.15];
    static upperArmSize = [0.25, 0.05, 0.05];
    static lowerArmSize = [0.20, 0.03, 0.03];
    static upperLegSize = [0.1, 0.3, 0.1];
    static lowerLegSize = [0.08, 0.2, 0.08];

    constructor(figureName, child, sibling) {
        // tranform: initial position
        this.translateBase = glMatrix.mat4.create();
        this.rotation = glMatrix.mat4.create();
        this.temp = glMatrix.mat4.create();
        switch(figureName) {
            case 'head':
                this.figure = new Cube(Figure.headSize, [0, Figure.headSize[1] * 0.5, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    glMatrix.mat4.create(),
                    [
                        0, 
                        Figure.torsoSize[1]*0.5,
                        0
                    ]
                );
                break;
            case 'torso':
                this.figure = new Cube(Figure.torsoSize, [0, 0, 0]);
                break;
            case 'upperLeftArm':
                this.figure = new Cube(Figure.upperArmSize, [Figure.upperArmSize[0]*0.5, 0, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    this.translateBase,
                    [
                        Figure.torsoSize[0]*0.5, 
                        Figure.torsoSize[1]*0.4,
                        0
                    ]
                );
                break;
            case 'lowerLeftArm':
                this.figure = new Cube(Figure.lowerArmSize, [Figure.lowerArmSize[0]*0.5, 0, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    this.translateBase,
                    [Figure.upperArmSize[0], 0, 0]
                );
                break;
            case 'upperRightArm':
                this.figure = new Cube(Figure.upperArmSize, [Figure.upperArmSize[0]*-0.5, 0, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    this.translateBase,
                    [
                        (Figure.torsoSize[0]*(-0.5)), 
                        Figure.torsoSize[1]*0.4,
                        0
                    ]
                );
                break;
            case 'lowerRightArm':
                this.figure = new Cube(Figure.lowerArmSize, [Figure.lowerArmSize[0]*-0.5, 0, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    this.translateBase,
                    [-1 * Figure.upperArmSize[0], 0, 0]
                );
                break; 

            case 'upperLeftLeg':
                this.figure = new Cube(Figure.upperLegSize, [0, Figure.upperLegSize[1]*-0.5, 0]);
                this.translateBase = glMatrix.mat4.translate(
                    this.translateBase, 
                    this.translateBase,
                    [
                    Figure.torsoSize[0]*0.2, 
                    Figure.torsoSize[1]*-0.5,
                    0
                    ]
                );
                break;
            case 'lowerLeftLeg':
            this.figure = new Cube(Figure.lowerLegSize, [0, Figure.lowerLegSize[1]*-0.5, 0]);
            this.translateBase = glMatrix.mat4.translate(
                this.translateBase, 
                this.translateBase,
                [0, -Figure.upperLegSize[1], 0]
            );
            break;
            case 'upperRightLeg':
            this.figure = new Cube(Figure.upperLegSize, [0, Figure.upperLegSize[1]*-0.5, 0]);
            this.translateBase = glMatrix.mat4.translate(
                this.translateBase, 
                this.translateBase,
                [
                Figure.torsoSize[0]*-0.2, 
                Figure.torsoSize[1]*-0.5,
                0
                ]
            );
            break;
            case 'lowerRightLeg':
            this.figure = new Cube(Figure.lowerLegSize, [0, Figure.lowerLegSize[1]*-0.5, 0]);
            this.translateBase = glMatrix.mat4.translate(
                this.translateBase, 
                this.translateBase,
                [0, -Figure.upperLegSize[1], 0]
            );
            break;
                        
        }
        this.child = child;
        this.sibling = sibling;
    }


    /**
     * traverse the subtree, store the result in this.temp
     * @param {glMatrix.mat4} parentMatrix 
     */
    traverse(parentMatrix) {
        if(!parentMatrix) {parentMatrix = glMatrix.mat4.create();}
        let p = glMatrix.mat4.create();
        glMatrix.mat4.copy(p, parentMatrix);
        
        glMatrix.mat4.multiply(this.temp, p, this.translateBase);
        glMatrix.mat4.multiply(this.temp, this.temp, this.rotation); 
        if(this.sibling) {
            this.sibling.traverse(p);
        }
        if(this.child) {
            this.child.traverse(this.temp);
        }
      
    }
}

export { Figure };
