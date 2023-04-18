// event listener, keydown to move camera or change camera position
//
// Path: computer_graphics\General\src\cameraControl.js 
// Compare this snippet from computer_graphics\6_3D_world\world.js:

const { mat4 , vec3 } = glMatrix;

/**
 * an event listener for keydown
 * @param {Event} event 
 * @param {vec3} cameraPosition 
 * @param {vec3} cameraTarget 
 * @param {vec3} cameraUp 
 * @param {Number} cameraSpeed 
 */
function cameraKeydownEventListener(event, cameraPosition, cameraTarget, cameraUp, cameraSpeed = 0.5){

    let [position, target, up, speed] = [cameraPosition, cameraTarget, cameraUp, cameraSpeed];
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
    let theta = speed / 180 * 10; // the degree to rotate (in radians)
    // Panning right
    if(event.key === 'l'){
        theta = -theta;
    }
    let mat = mat4.create();
    mat4.rotate(mat, mat, theta, up);
    vec3.subtract(delta, target, position);
    vec3.transformMat4(delta, delta, mat);
    vec3.add(target, position, delta);
  }
  return [position, target, up];
}
export {cameraKeydownEventListener};