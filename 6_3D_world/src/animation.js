
let id = {
    "floor": 0,
    "train": 1,
    "sun": 2,
    "trunk": 3,
    "rope": 4,
    "ball": 5
}

function animate(matrices, time) {
    let trainID = id["train"];
    let trainMat = matrices[trainID];
    let period = 10;
    mat4.identity(trainMat);
    mat4.translate(trainMat, trainMat, [-5.0 + 1.0 * (time % period), 0.0, 0.1]);

    let sunID = id["sun"];
    let sunMat = matrices[sunID];
    period = 30;
    let angle = (time / period) * Math.PI * 2;
    mat4.identity(sunMat);
    mat4.translate(sunMat, sunMat, [0.0, 2.0, -5.0]);
    mat4.rotateY(sunMat, sunMat, angle);
    mat4.translate(sunMat, sunMat, [0.0, 0.0, 10.0]);
    mat4.rotateY(sunMat, sunMat, angle);

    let trunkID = id["trunk"];
    let trunkMat = matrices[trunkID];
    period = 15;
    angle = (time / period) * Math.PI * 2;
    mat4.rotateY(trunkMat, trunkMat, angle);

    let ropeID = id["rope"];
    let ropeMat = matrices[ropeID];
    period = 5;
    let angle1 = (time / period) * Math.PI * 2;
    let angle2 = Math.asin(0.25 * Math.sin(angle1));
    mat4.rotateX(ropeMatrix, ropeMatrix, -Math.PI / 2);
    mat4.fromTranslation(ropeMat, [0.0, 1, 0.0]);
    mat4.rotateX(ropeMat, ropeMat, angle2);
    mat4.rotateZ(ropeMat, ropeMat, angle1);

    let ballID = id["ball"];
    let ballMat = matrices[ballID];
    mat4.fromTranslation(ballMat, [0.0, 0.75, 0.0]);
    mat4.multipliy(ballMat, ballMat, ropeMat);


}

export {animate};
