import "../lib/gl-matrix.js";
const {vec3 , mat4, quat} = glMatrix;

let animateID =  {
    "puzzle": 0,
    "flag": 1,
    "knight": 2,

}
let matrix = mat4.create();

function animate(time, models) {
    // animation for the puzzle. Using keyframe animation
    let puzzle = models[animateID.puzzle];
    if(puzzle){
        let puzzleAnimation = puzzle.animation;
        let puzzleAnimationDictionary = getAnimationDictionary(puzzleAnimation, time);
        
        puzzle.traverse(puzzleAnimationDictionary);
    }

    let flag = models[animateID.flag];
    if(flag){
        // no channels for the flag animation.
        
        let adjustment = mat4.create();
        // mat4.translate(adjustment, adjustment, [Math.sin(time*0.001)*0.1, 2, -2])
        mat4.rotateX(adjustment, adjustment, Math.PI/2);
        mat4.scale(adjustment, adjustment, [0.1, 0.1, 0.1]);
        
        flag.transformMatrix = mat4.clone(adjustment);
        flag.traverse();//?
    }
    
    let knight = models[animateID.knight];
    if(knight){
        let adjustment = mat4.create();
        mat4.rotateX(adjustment, adjustment, Math.PI/2);
        //mat4.scale(adjustment, adjustment, [0.4, 0.4, 0.]);
        boxaqua.traverse(getAnimationDictionary(knight, time), boxaqua.treeRoot, adjustment);
    }

    
}

function getAnimationDictionary(animation, time) {
    let timeInTicks = time * animation.tickspersecond / 1000;
    let animationDictionary = {};
    // interpolate the keyframe
    let tick = timeInTicks % animation.duration;
    for(let channel of animation.channels) {
        let positionKey = interpolateKeyframe(channel.positionkeys, tick);
        let rotationKey = interpolateKeyframe(channel.rotationkeys, tick);
        let scalingKey = interpolateKeyframe(channel.scalingkeys, tick);
        let matrix = mat4.create();
        matrix = mat4.fromRotationTranslationScale([], [rotationKey[1], rotationKey[2], rotationKey[3], rotationKey[0]], positionKey, scalingKey);
        animationDictionary[channel.name] = matrix;
    }
    return animationDictionary;
}

/**
 * Interpolate the keyframe
 * @param {key[]} keyframes 
 * @param {Number} index 
 * @returns 
 */
function interpolateKeyframe(keyframes, tick) {
    if(keyframes.length === 1) return keyframes[0][1];

    let frameInterval = keyframes[1][0] - keyframes[0][0];
    let index = 1.0 * tick / frameInterval;

    let key1 = keyframes[Math.floor(index) % keyframes.length][1];
    let key2 = keyframes[Math.ceil(index) % keyframes.length][1];
    let ratio = index - Math.floor(index);

    let value = [];
    if(key1.length === 3) {//translation or scaling
        return vec3.lerp(value, key1, key2, ratio);
    } else {//rotation
        return quat.slerp(value, key1, key2, ratio);
    }

}

export { animate }