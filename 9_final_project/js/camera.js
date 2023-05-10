// event listener, keydown to move camera or change camera position
//
// Path: computer_graphics\General\src\cameraControl.js 
// Compare this snippet from computer_graphics\6_3D_world\world.js:
import "../lib/gl-matrix.js";
const { mat4 , vec3 } = glMatrix;

const defaultHeight = 0;
const defaultDistance = 0.6;
const defaultCameraPositionArray = [0, -1 * defaultDistance, defaultHeight];
const defaultCameraTargetArray = [0, 0, defaultHeight];
const defaultCameraUpArray = [0, 0, 1];
const defaultCameraSpeed = 0.1;

class Camera{

  constructor(positionArray = defaultCameraPositionArray, targetArray = defaultCameraTargetArray, upArray = defaultCameraUpArray, speed = defaultCameraSpeed){
    this.position = vec3.fromValues(positionArray[0], positionArray[1], positionArray[2]);
    this.target = vec3.fromValues(targetArray[0], targetArray[1], targetArray[2]);
    this.up = vec3.fromValues(upArray[0], upArray[1], upArray[2]);
    this.speed = speed;
  }

  /**
   * @function parameters get the position, target, up parameters of the camera
   * @returns {Number[]} an array of length 3. Contains necessary parameters for 
   */
  parameters() {
    return [this.position, this.target, this.up];
  }

  /**
   * @function eventListener a keydown event listener for the camera
   * @param {Event} event 
   */
  eventListener(event) {
    let position = this.position;
    let target = this.target;
    let up = this.up;

    let forward = vec3.create();
    vec3.subtract(forward, target, position);
    vec3.normalize(forward, forward);
    
    let right = vec3.create();
    vec3.cross(right, forward, up);
    vec3.normalize(right, right);
    
    let speed = this.speed;

    let delta = vec3.create(); // a buffer vec3

    if (event.key === 'w') { // Dolly forward
      vec3.scale(delta, forward, 1 * speed);
      vec3.add(position, position, delta);
    } else if (event.key === 's') {// Dolly Back
      vec3.scale(delta, forward, -1 * speed);
      vec3.add(position, position, delta);
    } else if (event.key === 'a') {// Strafe left
      vec3.scale(delta, right, -1 * speed);
      vec3.add(target, target, delta);
      vec3.add(position, position, delta);
    } else if (event.key === 'd') {// Strafe right
      vec3.scale(delta, right, 1 * speed);
      vec3.add(target, target, delta);
      vec3.add(position, position, delta);
    } else if (event.key === 'i' ) {// Up
      vec3.scale(delta, up, 1 * speed);
      vec3.add(target, target, delta);
      vec3.add(position, position, delta);
    } else if (event.key === 'k' ) {// Down
      vec3.scale(delta, up, -1 * speed);
      vec3.add(target, target, delta);
      vec3.add(position, position, delta);
    } else if (event.key === 'j' || event.key === 'l') {
      // Panning left
      let theta = speed / 180 * 180; // the degree to rotate (in radians)
      // Panning right
      if(event.key === 'l'){
        theta = -theta;
      }
      let mat = mat4.create();
      mat4.rotate(mat, mat, theta, up); // mat is the rotation matrix for panning left or right
      vec3.sub(delta, target, position); // delta is the distance vector pointing from camera to target
      vec3.transformMat4(delta, delta, mat);
      vec3.add(target, position, delta);
    }
  }

  /**
   * @return {mat4} view matrix of the camera
   */
  getViewMatrix() {
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, this.position, this.target, this.up);
    return viewMatrix;
  }
}


/**
 * an event listener for keydown. Older version(deprecated)
 * @param {Event} event 
 * @param {vec3} cameraPosition 
 * @param {vec3} cameraTarget 
 * @param {vec3} cameraUp 
 * @param {Number} cameraSpeed 
 */
function cameraKeydownEventListener(event, position, target, up, speed = defaultCameraSpeed){

    let forward = vec3.create();
    vec3.subtract(forward, target, position);
    vec3.normalize(forward, forward);

    let right = vec3.create();
    vec3.cross(right, forward, up);
    vec3.normalize(right, right);
    

    let delta = vec3.create();


  if (event.key === 'w') { // Dolly forward
    vec3.scale(delta, forward, 1 * speed);
    vec3.add(position, position, delta);
  } else if (event.key === 's') {// Dolly Back
    vec3.scale(delta, forward, -1 * speed);
    vec3.add(position, position, delta);
  } else if (event.key === 'a') {// strafe left
    vec3.scale(delta, right, -1 * speed);
    vec3.add(target, target, delta);
    vec3.add(position, position, delta);
  } else if (event.key === 'd') {// strafe right
    vec3.scale(delta, right, 1 * speed);
    vec3.add(target, target, delta);
    vec3.add(position, position, delta);
  } else if (event.key === 'i' ) {
    vec3.scale(delta, up, 1 * speed);
    vec3.add(target, target, delta);
  } else if (event.key === 'k' ) {
    vec3.scale(delta, up, -1 * speed);
    vec3.add(target, target, delta);
  } else if (event.key === 'j' || event.key === 'l') {
    // Panning left
    let theta = speed / 18 * 10; // the degree to rotate (in radians)
    // Panning right
    if(event.key === 'l'){
      theta = -theta;
    }
    let mat = mat4.create();
    mat4.rotate(mat, mat, theta, up); // mat is the rotation matrix
    vec3.sub(delta, target, position); // delta is the distance vector pointing from camera to target
    vec3.transformMat4(delta, delta, mat);
    vec3.add(target, position, delta);
  }
  return [position, target, up];
}
export {Camera, cameraKeydownEventListener};