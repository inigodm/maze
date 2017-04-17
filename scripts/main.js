/// <reference path="babylon.js" />
"use strict";
// Size of a cube/block
var BLOCK_SIZE = 8;
// Are we inside the maze or looking at the QR Code in bird view?
var QRCodeView = false;
var freeCamera, canvas, engine, lovescene;
var camPositionInLabyrinth, camRotationInLabyrinth;

function buildGround(scene, mCount){
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    groundMaterial.emissiveTexture.uScale = mCount;
    groundMaterial.emissiveTexture.vScale = mCount;
    groundMaterial.bumpTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_b010.jpg", scene);
    groundMaterial.bumpTexture.uScale = mCount;
    groundMaterial.bumpTexture.vScale = mCount;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_s100-g100-r100.jpg", scene);
    groundMaterial.specularTexture.uScale = mCount;
    groundMaterial.specularTexture.vScale = mCount;
    var ground = BABYLON.Mesh.CreateGround("ground", (mCount + 2) * BLOCK_SIZE,
                                                     (mCount + 2) * BLOCK_SIZE,
                                                      1, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    return ground;
}

function buildSky(scene, mCount){
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return skybox;
}

function buildCamera(scene, mCount){
    freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 5, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);    
}

function putLigths(scene){
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.5;
    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.5;
}

function getMaterial(scene){
    var mat = new BABYLON.StandardMaterial("mat1", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
    var texture = new BABYLON.Texture("textures/indice.jpeg", scene);
    mat.diffuseTexture = texture;
    mat.emissiveTexture = texture;
    mat.bumpTexture = texture;
    mat.specularTexture = texture;
    return mat;
}

function cloneOrCreateCube(scene, cube, row, col){
    if (cube == null){
         cube = buildCube(scene);
    }else{
         cube = cube.clone("ClonedCube"+row+col);
    }
    return cube;
}

function buildCube(scene){
    var cubeWallMaterial = getMaterial(scene);
    var mainCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
    mainCube.material = cubeWallMaterial;
    mainCube.checkCollisions = true;
    return mainCube;
}

function setCubePosition(cube, mCount, row, col){
        cube.position = new BABYLON.Vector3(BLOCK_SIZE / 2 + (row - (mCount / 2)) * BLOCK_SIZE, BLOCK_SIZE / 2,
                                         BLOCK_SIZE / 2 + (col - (mCount / 2)) * BLOCK_SIZE);

}

function createMaze(scene, qrcode, mCount){
    var cube = null;
    for (var row = 0; row < mCount; row++) {
        for (var col = 0; col < mCount; col++) {
            if (qrcode._oQRCode.isDark(row, col)) {
                cube = cloneOrCreateCube(scene, cube, row, col);
                setCubePosition(cube, mCount, row, col);
                /*var soloCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCube.subMeshes = [];
                soloCube.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCube));
                soloCube.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, soloCube));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCube.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCube.material = cubeMultiMat;
                soloCube.checkCollisions = true;
                soloCube.position = new BABYLON.Vector3(BLOCK_SIZE / 2 + (row - (mCount / 2)) * BLOCK_SIZE,
                                                    BLOCK_SIZE / 2,
                                                    BLOCK_SIZE / 2 + (col - (mCount / 2)) * BLOCK_SIZE);
            */}    
         }
    }

    var x = BLOCK_SIZE / 2 + (7 - (mCount / 2)) * BLOCK_SIZE;
    var y = BLOCK_SIZE / 2 + (1 - (mCount / 2)) * BLOCK_SIZE;
    freeCamera.position = new BABYLON.Vector3(x, 5, y);
}

function createQRCodeMaze(secret) {
    //number of modules count or cube in width/height
    var scene = new BABYLON.Scene(engine);
    var qrcode = new QRCode(document.createElement("div"), { width: 400, height: 400 });
    qrcode.makeCode(secret);
    var mCount = qrcode._oQRCode.moduleCount;
    scene.gravity = new BABYLON.Vector3(0, -0, 0);
    scene.collisionsEnabled = true;
    buildCamera(scene, mCount);
    var ground = buildGround(scene, mCount);
    var skybox = buildSky(scene, mCount);
    putLigths(scene);
    createMaze(scene,qrcode, mCount);
    alert(mCount);
    return scene;
};

var animateCameraPositionAndRotation = function (freeCamera, fromPosition, toPosition,
                                                 fromRotation, toRotation) {

    var animCamPosition = new BABYLON.Animation("animCam", "position", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysPosition = [];
    keysPosition.push({
        frame: 0,
        value: fromPosition
    });
    keysPosition.push({
        frame: 100,
        value: toPosition
    });

    animCamPosition.setKeys(keysPosition);

    var animCamRotation = new BABYLON.Animation("animCam", "rotation", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysRotation = [];
    keysRotation.push({
        frame: 0,
        value: fromRotation
    });
    keysRotation.push({
        frame: 100,
        value: toRotation
    });

    animCamRotation.setKeys(keysRotation);
    freeCamera.animations.push(animCamPosition);
    freeCamera.animations.push(animCamRotation);

    scene.beginAnimation(freeCamera, 0, 100, false);
};

window.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) {
        if (!QRCodeView) {
            QRCodeView = true;
            // Saving current position & rotation in the maze
            camPositionInLabyrinth = freeCamera.position;
            camRotationInLabyrinth = freeCamera.rotation;
            animateCameraPositionAndRotation(freeCamera, freeCamera.position,
                new BABYLON.Vector3(16, 400, 15),
                freeCamera.rotation,
                new BABYLON.Vector3(1.4912565104551518, -1.5709696842019767,freeCamera.rotation.z));
        }
        else {
            QRCodeView = false;
            animateCameraPositionAndRotation(freeCamera, freeCamera.position,
                camPositionInLabyrinth, freeCamera.rotation, camRotationInLabyrinth);
        }
        freeCamera.applyGravity = !QRCodeView;
    }
}, false);


window.onload = function () {
    canvas = document.getElementById("canvas");
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);
        window.addEventListener("resize", function () {
            engine.resize();
        });
        lovescene = createQRCodeMaze("Jane Doe___________________________________________________________________________________________________________");
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        lovescene.activeCamera.attachControl(canvas);
        engine.runRenderLoop(function () {
            lovescene.render();
        });
     }
};
