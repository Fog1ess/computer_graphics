import  "./lib/gl-matrix.js";
import { Cube } from "./src/cube.js"
import { Figure } from "./src/figure.js";

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

let figures=[];

main();


// compile shaders
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// link shaders into a program
function createProgram(gl, vertexShader, fragmentShader){
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// append position and color data (one by one) to the data[]
function cubeData(cube, data) {
  let dim = 4;
  let num = Cube.numPositions;
  for(let i = 0; i < num; i++) {
    for(let j = 0; j < dim; j++) {
      data.push(cube.vertices[Cube.indices[i]][j]);
      
    }
    for(let j = 0; j < 4; j++) {
      data.push(cube.faceColors[~~(i / 6)][j]);
    }
  }
}



function flatten(a) {
  if(a.length && !a[0].length) {//a is a vector
    let result = new Float32Array(a.length);
    for(let i = 0; i < a.length; i++) 
      result[i] = a[i];
    return result;
  }
  
  if(a.length && a[0].length) {//a is a matrix
    let result = new Float32Array(a.length * a[0].length);
    for(let i = 0; i < a.length; i++) {
      for(let j = 0; j < a[0].length; j++) {
        result[i*a[0].length + j] = a[i][j];
      }
    }
    return result;
  }
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
    let torso = new Figure('torso', null, null);
    let head = new Figure('head', null, null);
    let upperLeftArm = new Figure('upperLeftArm', null, null);
    let lowerLeftArm = new Figure('lowerLeftArm', null, null);
    let upperRightArm = new Figure('upperRightArm', null, null);
    let lowerRightArm = new Figure('lowerRightArm', null, null);

    torso.child = head;
    head.sibling = upperLeftArm;
    upperLeftArm.sibling = upperRightArm;
    upperLeftArm.child = lowerLeftArm;
    lowerLeftArm.sibling = lowerRightArm;
    upperRightArm.child = lowerRightArm;

    figures = [torso, head, upperLeftArm, upperRightArm, lowerLeftArm, lowerRightArm];

    let data = [];
    for(let i = 0; i < figures.length; i++) {
      cubeData(figures[i].figure, data);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // tell program how to use data
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_Position');
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(positionAttributeLocation, Cube.positionDim, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 4 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    //Figure.traverse(torso);//update transformation matrices
    //gl.drawArrays(gl.TRIANGLES, 0, 1800);

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glMatrix.mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

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
      let torsoTranslationParams = [document.getElementById("torso-x").value, document.getElementById("torso-y").value, document.getElementById("torso-z").value];
      let torsoRotateParamsYZ = [document.getElementById("torso-rotate-y").value, document.getElementById("torso-rotate-z").value];
      let headRotateParamsXYZ = [document.getElementById("head-rotate-x").value,document.getElementById("head-rotate-y").value,document.getElementById("head-rotate-z").value];
      let upperLeftArmRotateParamsYZ = [document.getElementById("upper-left-arm-rotate-y").value,document.getElementById("upper-left-arm-rotate-z").value];
      let lowerLeftArmRotateParamZ = document.getElementById("lower-left-arm-rotate-z").value;
      let upperRightArmRotateParamsYZ = [document.getElementById("upper-right-arm-rotate-y").value,document.getElementById("upper-right-arm-rotate-z").value];
      let lowerRightArmRotateParamZ = document.getElementById("lower-right-arm-rotate-z").value;
    
      let modelViewMatrixLoc = gl.getUniformLocation(program, "transformMatrix");

      // draw torso
      glMatrix.mat4.rotateY(torso.rotation, glMatrix.mat4.create(), torsoRotateParamsYZ[0] * Math.PI / 180);
      glMatrix.mat4.rotateZ(torso.rotation, torso.rotation, torsoRotateParamsYZ[1] * Math.PI / 180);
      glMatrix.mat4.translate(torso.temp, torso.translateBase, torsoTranslationParams);
      glMatrix.mat4.multiply(torso.temp, torso.temp, torso.rotation);
      draw(0, modelViewMatrixLoc);

      // draw head
      // rotate first
      glMatrix.mat4.rotateX(head.rotation, glMatrix.mat4.create(), headRotateParamsXYZ[0] * Math.PI / 180);
      glMatrix.mat4.rotateY(head.rotation, head.rotation, headRotateParamsXYZ[1] * Math.PI / 180);
      glMatrix.mat4.rotateZ(head.rotation, head.rotation, headRotateParamsXYZ[2] * Math.PI / 180);
      glMatrix.mat4.multiply(head.temp, torso.temp, head.translateBase);
      glMatrix.mat4.multiply(head.temp, head.temp, head.rotation);
      draw(1, modelViewMatrixLoc);

      // draw upper arms
      glMatrix.mat4.rotateY(upperLeftArm.rotation, glMatrix.mat4.create(), upperLeftArmRotateParamsYZ[0] * Math.PI / 180);
      glMatrix.mat4.rotateZ(upperLeftArm.rotation, upperLeftArm.rotation, upperLeftArmRotateParamsYZ[1] * Math.PI / 180);
      glMatrix.mat4.multiply(upperLeftArm.temp, torso.temp, upperLeftArm.translateBase);
      glMatrix.mat4.multiply(upperLeftArm.temp, upperLeftArm.temp, upperLeftArm.rotation);
      draw(2, modelViewMatrixLoc);

      glMatrix.mat4.rotateY(upperRightArm.rotation, glMatrix.mat4.create(), upperRightArmRotateParamsYZ[0] * Math.PI / 180);
      glMatrix.mat4.rotateZ(upperRightArm.rotation, upperRightArm.rotation, upperRightArmRotateParamsYZ[1] * Math.PI / 180);
      glMatrix.mat4.multiply(upperRightArm.temp, torso.temp, upperRightArm.translateBase);
      glMatrix.mat4.multiply(upperRightArm.temp, upperRightArm.temp, upperRightArm.rotation);
      draw(3, modelViewMatrixLoc);

      // draw lower arms  
      glMatrix.mat4.rotateZ(lowerLeftArm.rotation, glMatrix.mat4.create(), lowerLeftArmRotateParamZ * Math.PI / 180);
      glMatrix.mat4.multiply(lowerLeftArm.temp, upperLeftArm.temp, lowerLeftArm.translateBase);
      glMatrix.mat4.multiply(lowerLeftArm.temp, lowerLeftArm.temp, lowerLeftArm.rotation);
      
      draw(4, modelViewMatrixLoc);

      glMatrix.mat4.rotateZ(lowerRightArm.rotation, glMatrix.mat4.create(), lowerRightArmRotateParamZ * Math.PI / 180);
      glMatrix.mat4.multiply(lowerRightArm.temp, upperRightArm.temp, lowerRightArm.translateBase);
      glMatrix.mat4.multiply(lowerRightArm.temp, lowerRightArm.temp, lowerRightArm.rotation);
      
      draw(5, modelViewMatrixLoc);

      

      //update transform matrix

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
