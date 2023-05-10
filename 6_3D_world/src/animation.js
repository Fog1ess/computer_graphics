import "../../General/lib/gl-matrix.js";
const {mat4} = glMatrix;
let animateId = {
    "floor": 0,
    "train": 1,
    "trunk": 2,
    "rope": 3,
    "ball": 4,
    "ball2": 5,
    "sun": 6
}


/**
 * Set the motion mode of the object and calculate the transformation matrix based on time.
 * @param {mat4[]} matrices transformation matrices of the models (according to the animateId)
 * @param {*} time the time parameter
 */
function animate(matrices, time) {
    matrices.map(x=>mat4.identity(x));  

    let floorID = animateId["floor"];
    let floorMat = matrices[floorID];
    mat4.scale(floorMat, floorMat, [1, 1, 0.001]); // compress the huge cube to a slice floor
    

    // A train keep running
    let trainID = animateId["train"];
    let trainMat = matrices[trainID];
    let period = 10;
    mat4.translate(trainMat, trainMat, [-5.0 + 1.0 * (time % period), -2, 0.15]);

    
    // A cylinder moving up and down
    let trunkID = animateId["trunk"];
    let trunkMat = matrices[trunkID];
    period = 5;
    mat4.translate(trunkMat, trunkMat, [1, 1, Math.sin(time/period) + 2]);


    // A moving dumbbell (by one stick and two bells)
    let ropeID = animateId["rope"];
    let ropeMat = matrices[ropeID];
    period = 15;
    let angle1 = (time / period) * Math.PI * 2;
    let angle2 = Math.asin(0.25 * Math.sin(angle1));
    mat4.translate(ropeMat, ropeMat, [Math.sin(time/period) * 3, 0, 1.5]);
    mat4.rotateX(ropeMat, ropeMat, angle2);
    mat4.rotateZ(ropeMat, ropeMat, angle1);

    let ballID = animateId["ball"];
    let ballMat = matrices[ballID];
    mat4.fromTranslation(ballMat, [0.0, 0.0, -1.0]);
    mat4.multiply(ballMat, ropeMat, ballMat);

    let ball2ID = animateId["ball2"];
    let ball2Mat = matrices[ball2ID];
    mat4.fromTranslation(ball2Mat, [0.0, 0.0, 1.0]);
    mat4.multiply(ball2Mat, ropeMat, ball2Mat);

    let sunID = animateId["sun"];
    let sunMat = matrices[sunID];
    period = 50;
    let sunAngle = ((time / period) % 1) * Math.PI;
    let sunOrbitRadius = 6.0;
    mat4.rotateY(sunMat, sunMat, sunAngle);
    mat4.translate(sunMat, sunMat, [-1*sunOrbitRadius, 0, 0]);

}

export {animate, animateId};
