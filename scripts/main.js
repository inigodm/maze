/// <reference path="babylon.js" />
"use strict";
// Size of a cube/block
var BLOCK_SIZE = 8;
// Are we inside the maze or looking at the QR Code in bird view?
var QRCodeView = false;
var freeCamera, canvas, engine, lovescene;
var camPositionInLabyrinth, camRotationInLabyrinth;
var mCount;
var scene;

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
    mainCube.checkCollisions = false;
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
    createBorder();
    var x = BLOCK_SIZE / 2 + (7 - (mCount / 2)) * BLOCK_SIZE;
    var y = BLOCK_SIZE / 2 + (1 - (mCount / 2)) * BLOCK_SIZE;
    freeCamera.position = new BABYLON.Vector3(x, 5, y);
}

function createBorder(){
    var plane = BABYLON.MeshBuilder.CreatePlane("plane_0", {width:(mCount+BLOCK_SIZE)*BLOCK_SIZE,height: 200, sideOrientation:BABYLON.Mesh.FRONTSIDE}, scene);
    plane.position = new BABYLON.Vector3(0, BLOCK_SIZE/2, 1/2 * (BLOCK_SIZE + mCount * BLOCK_SIZE));
    plane.checkCollisions = true;
    var plane1 = plane.clone("ClonedPlane1");//BABYLON.MeshBuilder.CreatePlane("plane_1", {width:(mCount+BLOCK_SIZE)*BLOCK_SIZE,height: 200, sideOrientation:BABYLON.Mesh.FRONTSIDE}, scene);
    plane1.position = new BABYLON.Vector3(0 , -BLOCK_SIZE/2, -1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE));
    plane1.rotation.y=Math.PI;
    plane1.checkCollisions = true;
    var plane2 = plane.clone("ClonedPlane2");//BABYLON.MeshBuilder.CreatePlane("plane_1", {width:(mCount+BLOCK_SIZE)*BLOCK_SIZE,height: 200, sideOrientation:BABYLON.Mesh.FRONTSIDE}, scene);
    plane2.position = new BABYLON.Vector3(-1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE), BLOCK_SIZE/2, 0);
    plane2.rotation.y=-Math.PI/2;
    plane2.checkCollisions = true;
    var plane3 = plane.clone("ClonedPlane3");//BABYLON.MeshBuilder.CreatePlane("plane_1", {width:(mCount+BLOCK_SIZE)*BLOCK_SIZE,height: 200, sideOrientation:BABYLON.Mesh.FRONTSIDE}, scene);
    plane3.position = new BABYLON.Vector3(1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE), BLOCK_SIZE/2, 0);
    plane3.rotation.y=Math.PI/2;
    plane3.checkCollisions = true;
}

 function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';
            var numberOfLines = 0;
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                    numberOfLines++;
                }
                else {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
            return numberOfLines;
        }

var debug = function (text)
        {
            /*// Make a dynamic texture
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
            dynamicTexture.hasAlpha = true;
            var textureContext = dynamicTexture.getContext();
            textureContext.save();
            textureContext.textAlign = "center";
            textureContext.font = "58px Calibri";
            // Some magic numbers
            var lineHeight = 70;
            var lineWidth = 500;
            var fontHeight = 53;
            var offset = 10; // space between top/bottom borders and actual text
            var text = "BLABLA hehe blabla"; // Text to display
            var numberOfLines = 1; // I usually calculate that but for this exmaple let's just say it's 1
            var textHeight = fontHeight + offset;
            var labelHeight = numberOfLines * lineHeight + (2 * offset);
            // Background
            textureContext.fillStyle = "white";
            textureContext.fillRect(0, 0, dynamicTexture.getSize().width, labelHeight);
        	textureContext.fillStyle = "blue";
            textureContext.fillRect(0, labelHeight, dynamicTexture.getSize().width, dynamicTexture.getSize().height);
            // text
            textureContext.fillStyle = "black";
            wrapText(textureContext, text, dynamicTexture.getSize().width / 2, textHeight, lineWidth, lineHeight);
            textureContext.restore();
            dynamicTexture.update(false);
            // Create the sprite
            var spriteManager = new BABYLON.SpriteManager("sm", "", 2, 512, scene);
            spriteManager._spriteTexture = dynamicTexture;
            spriteManager._spriteTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            spriteManager._spriteTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            var sprite = new BABYLON.Sprite("textSprite", spriteManager);
            var result = {
                object: sprite,
                height: labelHeight
            };
            return result;*/
        };


function createQRCodeMaze(secret) {
    //number of modules count or cube in width/height
    scene = new BABYLON.Scene(engine);
    var qrcode = new QRCode(document.createElement("div"), { width: 400, height: 400 });
    qrcode.makeCode(secret);
    mCount = qrcode._oQRCode.moduleCount;
    scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;
    buildCamera(scene, mCount);
    var ground = buildGround(scene, mCount);
    var skybox = buildSky(scene, mCount);
    putLigths(scene);
    createMaze(scene,qrcode, mCount);
    debug();
    return scene;
};

window.addEventListener("keydown", function (event) {
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
        lovescene = createQRCodeMaze("Puto Natxo :)");
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        lovescene.activeCamera.attachControl(canvas);
        engine.runRenderLoop(function () {
            lovescene.render();
            debug();
        });
     }
};
