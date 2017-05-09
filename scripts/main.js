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
var checkCollision = true;
var cubeMaterial = null;
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
    var multi = new BABYLON.MultiMaterial("natxo", scene);
    addMaterialToMultiMaterial(scene, multi, "textures/natxo1.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/natxo2.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/natxo6.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/natxo5.jpg");
    return multi;
}

function getMaterialKuadri(scene){
    var multi = new BABYLON.MultiMaterial("kuadri", scene);
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri0.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri1.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri2.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri3.jpg");
    return multi;
}

function getMaterialKuadri2(scene){
    var multi = new BABYLON.MultiMaterial("kuadri", scene);
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri8.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri5.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri6.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri7.jpg");
    return multi;
}

function getMaterialMix(scene){
    var multi = new BABYLON.MultiMaterial("kuadri", scene);
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri4.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/natxo3.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/natxo4.jpg");
    addMaterialToMultiMaterial(scene, multi, "textures/kuadri9.jpg");
    return multi;
}


function addMaterialToMultiMaterial(scene, multi, photo){
    var mat = getMaterialFromPhoto(scene,photo);
    multi.subMaterials.push(mat);
    return multi;
}

function getMaterialFromPhoto(scene, photo){
    var mat = new BABYLON.StandardMaterial("mat1", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
    var texture = new BABYLON.Texture(photo, scene);
    //mat.diffuseTexture = texture;
    mat.emissiveTexture = texture;
    //mat.bumpTexture = texture;
    //mat.specularTexture = texture;
    return mat;
}

function cloneOrCreateCube(scene, cube, row, col){
    if (cube == null){
         cube = buildCube(scene);
    }else{
alert(cube);
alert(cube.createInstance);
         cube = cube.createInstance('newBox'+row+col);
    }
    return cube;
}

function buildCube(scene, material){
    var cubeWallMaterial = material;
    //var mainCube = BABYLON.MeshBuilder.CreateBox("box", {height: BLOCK_SIZE, width:BLOCK_SIZE, depth:BLOCK_SIZE, updatable:true, sideOrientation:}, scene);
    var mainCube = BABYLON.Mesh.CreateBox("mainCube" + material.name, BLOCK_SIZE, scene, true);
    mainCube.subMeshes=[];
    var verticesCount=mainCube.getTotalVertices();
    mainCube.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, mainCube));
    mainCube.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, mainCube));
    mainCube.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, mainCube));
    mainCube.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, mainCube));
    mainCube.material = material;
    mainCube.checkCollisions = checkCollision;
    //mainCube.checkCollisions = false;
    return mainCube;
}

function setCubePosition(cube, mCount, row, col){
        cube.position = new BABYLON.Vector3(BLOCK_SIZE / 2 + (row - (mCount / 2)) * BLOCK_SIZE, BLOCK_SIZE / 2,
                                         BLOCK_SIZE / 2 + (col - (mCount / 2)) * BLOCK_SIZE);

}

var cubes = [];

function createMaze(scene, qrcode, mCount){
    var trueCubes = [];
    trueCubes.push(buildCube(scene, getMaterial(scene)));
    trueCubes.push(buildCube(scene, getMaterialKuadri(scene)));
    trueCubes.push(buildCube(scene, getMaterialKuadri2(scene)));    
    trueCubes.push(buildCube(scene, getMaterialMix(scene)));    
    for (var row = 0; row < mCount; row++) {
        for (var col = 0; col < mCount; col++) {
            if (qrcode._oQRCode.isDark(row, col)) {
                var instance = getRandomCube(trueCubes).createInstance('newBox'+row+col);//cloneOrCreateCube(scene, cube, row, col);
		console.log(instance)
                setCubePosition(instance, mCount, row, col);
                rotateCubeRamdonly(instance);
                cubes.push(instance);
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
    //var maze = BABYLON.Mesh.MergeMeshes(cubes);//mergeMeshes("maze", cubes, scene);
    //maze.checkCollisions = checkCollision;
    //maze.material = cubeMaterial;
    
    createBorder();
    var x = BLOCK_SIZE / 2 + (7 - (mCount / 2)) * BLOCK_SIZE;
    var y = BLOCK_SIZE / 2 + (1 - (mCount / 2)) * BLOCK_SIZE;
    freeCamera.position = new BABYLON.Vector3(x, 5, y);
}

function getRandomCube(cubes){
        var r = Math.floor((Math.random() * cubes.length));
console.log(r + ": " + cubes[r])
        return cubes[r];
}

function rotateCubeRamdonly(instance){
	var y = Math.floor((Math.random() * 4) + 1);
	instance.rotation.y = y*Math.PI / 2
}

function createBorder(){
	  var wall_h = 2 * BLOCK_SIZE;
    var plane = BABYLON.MeshBuilder.CreatePlane("plane_0", {width:(mCount+BLOCK_SIZE)*BLOCK_SIZE,height: wall_h, sideOrientation:BABYLON.Mesh.FRONTSIDE}, scene);
    plane.position = new BABYLON.Vector3(0, wall_h / 2, 1/2 * (BLOCK_SIZE + mCount * BLOCK_SIZE));
    plane.checkCollisions = true;
    var plane1 = plane.clone("ClonedPlane1");
    plane1.position = new BABYLON.Vector3(0 , wall_h / 2, -1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE));
    plane1.rotation.y=Math.PI;
    plane1.checkCollisions = true;
    var plane2 = plane.clone("ClonedPlane2");
    plane2.position = new BABYLON.Vector3(-1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE), wall_h / 2, 0);
    plane2.rotation.y=-Math.PI/2;
    plane2.checkCollisions = true;
    var plane3 = plane.clone("ClonedPlane3");
    plane3.position = new BABYLON.Vector3(1/2* (BLOCK_SIZE + mCount * BLOCK_SIZE), wall_h / 2, 0);
    plane3.rotation.y=Math.PI/2;
    plane3.checkCollisions = true;
}

function createQRCodeMaze(secret) {
    //number of modules count or cube in width/height
    scene = new BABYLON.Scene(engine);
    //cubeMaterial = getMaterial(scene);
    var qrcode = new QRCode(document.createElement("div"), { width: 400, height: 400 });
    qrcode.makeCode(secret);
    mCount = qrcode._oQRCode.moduleCount;
    scene.gravity = new BABYLON.Vector3(0, -1, 0);
    scene.collisionsEnabled = true;
    buildCamera(scene, mCount);
    var ground = buildGround(scene, mCount);
    var skybox = buildSky(scene, mCount);
    putLigths(scene);
    createMaze(scene,qrcode, mCount);
    return scene;
};

function changeCollisionChecking(){
	  checkCollision = !checkCollision;
		for (var i = 0; i < cubes.length; i++){
			cubes[i].checkCollisions = checkCollision;
		}
		alert("El wallhack esta " + (!checkCollision ? "activado" : "desactivado"));
}

window.addEventListener("keydown", function (event) {
	// la Q cambia el estado del wallhack
	if (event.keyCode == 81){
		changeCollisionChecking();
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
        lovescene = createQRCodeMaze("Puto Natxo");
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        lovescene.activeCamera.attachControl(canvas);
        engine.runRenderLoop(function () {
            lovescene.render();
        });
     }
};

