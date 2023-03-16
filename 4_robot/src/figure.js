import { Cube } from './cube.js'
// default settings of different parts

class Figure{
    //deafult size
    static headSize = [0.2, 0.2, 0.2];
    static torsoSize = [0.3, 0.5, 0.15];
    static upperArmSize = [0.25, 0.05, 0.05];
    static lowerArmSize = [0.20, 0.03, 0.03];

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
        }
        this.child = child;
        this.sibling = sibling;
    }




    // traverse the tree from root
    // static traverse(root) {
    //     let stack = [root];
    
    //     while(stack.length > 0) {
    //         let node = stack.pop();
    //         //let translateBase = node.translate;
    //         node = node.child;
    //         while(node != null) {
    //             glMatrix.mat4.multiply(node.temp, node.translateBase, node.rotation);
    //             stack.push(node);
    //             node = node.sibling;
    //         }
    //     }
      
    // }
}

export { Figure };
