//import  "../General/lib/gl-matrix.js";
import { Cube } from "./src/cube.js"
import { Figure } from "./src/figure.js";
import { createShader, createProgram } from "./src/initShader.js";

let vertexShaderSrc = 
`#version 300 es
precision highp float;
in vec4 a_Position;
in vec4 a_color;
out vec4 v_color;
//uniform mat4 projectMatrix;
uniform mat4 transformMatrix;

void main(){
    gl_Position = transformMatrix * a_Position;
    v_color = a_color;
}
`;

let fragmentShaderSrc = 
`#version 300 es
precision highp float;
in vec4 v_color;
out vec4 f_color;

void main(){
    f_color = v_color;
}
`;
let pointDim = Cube.pointDim; // 4
let colorDim = 4;
main();


/**
 * append position and color data (one by one) to the data[]
 * @param {Cube} cube 
 * @param {Float32Array} data 
 */
function cubeData(cube, data) {
  let num = Cube.numPositions;
  for(let i = 0; i < num; i++) {
    for(let j = 0; j < pointDim; j++) {
      data.push(cube.vertices[Cube.indices[i]][j]);
      
    }
    for(let j = 0; j < colorDim; j++) {
      data.push(cube.faceColors[~~(i / cube.faceColors.length)][j]);
    }
  }
}

/**
 * 
 * @param {string[]} nameArray 
 * @param {string} type
 * @returns vec3[]
 */
function getParams(nameArray, type) {
  //TODO: regular formula
  let result = [];
  for(let name of nameArray) {
    let [nameX, nameY, nameZ] = [name+type+'-x', name+type+'-y', name+type+'-z'];
    let rotateParam = new Float32Array([nameX, nameY, nameZ]
      .map(elemName => {
        let elem = document.getElementById(elemName);
        return (elem != null ? elem.value : 0.0);
      })); 
    result.push(rotateParam);
  }
  return result;
}

/**
 * 
 * @param {string[]} nameArray 
 * @returns Figure[]
 */
function createFigures(nameArray) {
  return nameArray.map(a =>
    new Figure(a, null, null));
}

/**
 * 
 * @param {vec3} rotateParam - vec3() in degrees, get rotation matrix (by axes)
 */
function getRotateMatrix(rotateParam) {
  let result = glMatrix.mat4.create();
  glMatrix.mat4.rotateX(result, result, rotateParam[0]* Math.PI / 180 );
  glMatrix.mat4.rotateY(result, result, rotateParam[1]* Math.PI / 180 );
  glMatrix.mat4.rotateZ(result, result, rotateParam[2]* Math.PI / 180 );
  return result;
}

function main(){
    let canvas = document.getElementById("canvas");

    let gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    // create a shader program, tell the GPU to use it 
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    let program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Configure WebGL 
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // create and bind a buffer
    let bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    //
    
    let modelViewMatrix = glMatrix.mat4.create();
    let transformMatrixLocation = gl.getUniformLocation(program, "transformMatrix");
    gl.uniformMatrix4fv(transformMatrixLocation, false, modelViewMatrix);
    
    
    // Initialize figures
    let figureNames=['torso', 'head', 'upperLeftArm', 'lowerLeftArm', 'upperRightArm', 'lowerRightArm', 'upperLeftLeg', 'lowerLeftLeg', 'upperRightLeg', 'lowerRightLeg'];
    let figures = createFigures(figureNames);
    let [torso, head, upperLeftArm, lowerLeftArm, upperRightArm, lowerRightArm, upperLeftLeg, lowerLeftLeg, upperRightLeg, lowerRightLeg] = figures;

    // Describe tree structure
    torso.child = head;
    head.sibling = upperLeftArm;
    upperLeftArm.sibling = upperRightArm;
    upperRightArm.sibling = upperLeftLeg;
    upperLeftLeg.sibling = upperRightLeg;
    upperLeftArm.child = lowerLeftArm;
    upperRightArm.child = lowerRightArm;
    upperLeftLeg.child = lowerLeftLeg;
    upperRightLeg.child = lowerRightLeg;

    // bind figures data to buffer 
    let data = [];
    for(let i = 0; i < figures.length; i++) {
      cubeData(figures[i].figure, data);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // tell program how to use data
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_Position');
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(positionAttributeLocation, pointDim, gl.FLOAT, false, (pointDim + colorDim) * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(colorAttributeLocation, colorDim, gl.FLOAT, false, (pointDim + colorDim) * Float32Array.BYTES_PER_ELEMENT, pointDim * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    //Figure.traverse(torso);//update transformation matrices
    //gl.drawArrays(gl.TRIANGLES, 0, 1800);
    let modelViewMatrixLoc = gl.getUniformLocation(program, "transformMatrix");

    function draw(id, loc) { // use temp to draw
      let figure = figures[id];
      let matrix = figure.temp;
      gl.uniformMatrix4fv(loc, false, matrix);
      gl.drawArrays(gl.TRIANGLES, 36*id, 36);
    
    }
    //TODO: render figuresArray
    function render(){
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
      // get data from sliders
      let rotateParams = getParams(figureNames, "-rotate");
      let rotateMatrices = rotateParams.map(a => getRotateMatrix(a));

      let translateParams = getParams(figureNames, "");
      let translateMatrix = glMatrix.mat4.create();
      glMatrix.mat4.translate(translateMatrix, translateMatrix, translateParams[0]);

      for(let i = 0; i < figures.length; i++) {
        figures[i].rotation = rotateMatrices[i];
      }

      torso.traverse(translateMatrix); //update temp matrices of all nodes
      for(let i = 0; i < figures.length; i++) {
        draw(i, modelViewMatrixLoc);
      }
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
