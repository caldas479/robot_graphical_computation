//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;

var cameraFrontal, cameraLateral, cameraTop;
var cameraIsometricOrtogonal, cameraIsometricPerspective;

var material, mesh, geometry;

var feetRotation = 0;

/////////////////////
/*  */
/////////////////////
function addCubicPart(obj, dimX, dimY, dimZ, posX, posY, posZ) {
    'use strict';
    geometry = new THREE.CubeGeometry(dimX, dimY, dimZ);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(posX, posY, posZ);
    obj.add(mesh);
}

function addConicPart(obj, rad, height, posX, posY, posZ) {
    'use strict';
    geometry = new THREE.ConeGeometry(rad, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(posX, posY, posZ);
    obj.add(mesh);
}

function addCylindricalPart(obj, radTop, radBottom, height, posX, posY, posZ) {
    'use strict';
    geometry = new THREE.CylinderGeometry(radTop, radBottom, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(posX, posY, posZ);
    mesh.rotateZ(Math.PI / 2);
    obj.add(mesh);
}

function addEye(obj, side) {
    'use strict';
    var eye = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(eye, 1/2, 1/2, 1/8, side*1/3, 13.25, 1/2);    //eye

    obj.add(eye);
}

function addHead(obj) {
    'use strict';
    var head = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(head, 2, 2, 1, 0, 13, 0);                //head
    addConicPart(head, 1/4, 1/2, -3/4, 14.25, 0);         //leftAntenna
    addConicPart(head, 1/4, 1/2, 3/4, 14.25, 0);          //rightAntenna
    addEye(head, -1);                                     //leftEye
    addEye(head, 1);                                      //rightEye

    obj.add(head);
}

function addForearm(obj, side) {
    'use strict';
    var forearm = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(forearm, 1, 2, 1, side*3.5, 7, 0);             //forearm

    obj.add(forearm);
}

function addArm(obj, side) {
    'use strict';
    var arm = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(arm, 1, 4, 1, side*3.5, 10, 0);             //arm

    obj.add(arm);
}

function addExhaust(obj, side) {
    'use strict';
    var exhaust = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(exhaust, 1/2, 3, 1/2, side*4.25, 12.5, -1/2);  //exhaust

    obj.add(exhaust);
}

function addWholeArm(obj, side) {
    'use strict';
    var wholeArm = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addArm(wholeArm, side);                                      //arm
    addExhaust(wholeArm, side);                                  //exhaust
    addForearm(wholeArm, side);                                  //forearm

    obj.add(wholeArm);
}

function addThigh(obj, side) {
    'use strict';
    var thigh = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(thigh, 1, 3, 1, side*1.5, 5.5, 0);       //thigh

    obj.add(thigh);
}

function addLowLeg(obj, side) {
    'use strict';
    var lowLeg = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(lowLeg, 2, 4, 2, side*1.5, 2, 0);       //lowerLeg

    obj.add(lowLeg);
}

function addWheel(obj, x, y, z) {
    'use strict';
    var wheel = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    addCylindricalPart(wheel, 1, 1, 1, x, y, z);       //wheel

    obj.add(wheel);
}

function addFoot(obj, side) {
    'use strict';
    var foot = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(foot, 3, 1, 1, side*2, 1/2, 1.5);       //foot
    foot.name = side > 0 ? 'rightFoot' : 'leftFoot';

    obj.add(foot);
}

function addLeg(obj, side) {
    'use strict';
    var leg = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addThigh(leg, side);                                //thigh
    addLowLeg(leg, side);                               //lowerLeg
    addWheel(leg, side*3, 3, 0);                        //topWheel
    addWheel(leg, side*3, 1, 0);                        //bottomWheel
    addFoot(leg, side);                                 //foot

    obj.add(leg);
}

function addTorso(obj) {
    'use strict';
    var torso = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(torso, 6, 2, 3, 0, 11, 0);            //torso

    obj.add(torso);
}

function addAbdomen(obj) {
    'use strict';
    var abdomen = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(abdomen, 4, 1, 3, 0, 9.5, 0);            //abdomen

    obj.add(abdomen);
}

function addWaist(obj) {
    'use strict';
    var waist = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(waist, 4, 2, 3, 0, 8, 0);            //waist

    obj.add(waist);
}

function createBody() {
    'use strict';
    var body = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addTorso(body);                                  //torso
    addAbdomen(body);                                //abdomen
    addWaist(body);                                  //waist
    addWheel(body, -2.5, 8, 0.5);                    //leftWheel
    addWheel(body, 2.5, 8, 0.5);                     //rightWheel
    addHead(body);                                   //head
    addLeg(body,-1);                                 //leftLeg
    addLeg(body, 1);                                 //rightLeg
    addWholeArm(body,-1);                            //leftArm
    addWholeArm(body, 1);                            //rightArm

    scene.add(body);
}

function addBox(obj) {
    'use strict';
    var box = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(box, 6, 5, 11, 8+10, 4.5, 0);             //box

    obj.add(box);
}

function addCouplingGear(obj) {
    'use strict';
    var couplingGear = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    addCubicPart(couplingGear, 1/2, 1/2, 1/2, 8+10, 1.75, 4.5);     //couplingGear

    obj.add(couplingGear);
}

function createTrailer() {
    'use strict';
    var trailer = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addBox(trailer);                                           //box
    addCouplingGear(trailer);                                  //couplingGear
    addWheel(trailer, 5.5+10, 1, -2.5);                        //frontLeftWheel
    addWheel(trailer, 5.5+10, 1, -4.5);                        //backLeftWheel
    addWheel(trailer, 10.5+10, 1, -2.5);                       //frontRightWheel
    addWheel(trailer, 10.5+10, 1, -4.5);                       //backRightWheel

    scene.add(trailer);
}



function rotateFeet(angle) {
    'use strict';
  
    feetRotation += angle; // Update the feet rotation angle
  
    var leftFoot = scene.getObjectByName('leftFoot'); // Get the left foot object by name
    var rightFoot = scene.getObjectByName('rightFoot'); // Get the right foot object by name
  
    if (leftFoot && rightFoot) {
      leftFoot.rotation.x = feetRotation;  // Apply rotation to the left foot object
      rightFoot.rotation.x = feetRotation; // Apply rotation to the right foot object
    }
  }



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xffffff);
    // x is red, y is green and z is blue
    scene.add(new THREE.AxisHelper(10));

    createBody();
    createTrailer();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    const aspectRatio = window.innerWidth/ window.innerHeight;

    cameraFrontal = new THREE.OrthographicCamera(-window.innerWidth / 32, window.innerWidth / 32, 
                                                window.innerHeight / 32, -window.innerHeight / 32, 
                                                1, 1000);
    cameraFrontal.position.z = 900;
    cameraFrontal.lookAt(scene.position);


    cameraLateral = new THREE.OrthographicCamera(-window.innerWidth / 32, window.innerWidth / 32, 
                                                window.innerHeight / 32, -window.innerHeight / 32, 
                                                1, 1000);
    cameraLateral.position.x = 900;
    cameraLateral.lookAt(scene.position);


    cameraTop = new THREE.OrthographicCamera(-window.innerWidth / 32, window.innerWidth / 32,
                                            -window.innerHeight / 32, window.innerHeight/32, 
                                            1, 1000);
    cameraTop.position.y = 900;
    cameraTop.lookAt(scene.position);


    cameraIsometricOrtogonal = new THREE.OrthographicCamera(-window.innerWidth / 32, window.innerWidth / 32,
                                                            -window.innerHeight / 32, window.innerHeight/32, 
                                                            1, 1000);
    cameraIsometricOrtogonal.position.x = 50;
    cameraIsometricOrtogonal.position.y = 50;
    cameraIsometricOrtogonal.position.z = 50;
    cameraIsometricOrtogonal.lookAt(scene.position);
        
    
    cameraIsometricPerspective = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    cameraIsometricPerspective.position.x = 50;
    cameraIsometricPerspective.position.y = 50;
    cameraIsometricPerspective.position.z = 50;
    cameraIsometricPerspective.lookAt(scene.position);

}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, cameraIsometricPerspective);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    createScene();
    createCameras();

    render();
    window.addEventListener("keydown", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameraFrontal.aspect = window.innerWidth / window.innerHeight;
        cameraFrontal.updateProjectionMatrix();

        cameraLateral.aspect = window.innerWidth / window.innerHeight;
        cameraLateral.updateProjectionMatrix();

        cameraTop.aspect = window.innerWidth / window.innerHeight;
        cameraTop.updateProjectionMatrix();

        cameraIsometricOrtogonal.aspect = window.innerWidth / window.innerHeight;
        cameraIsometricOrtogonal.updateProjectionMatrix();

        cameraIsometricPerspective.aspect = window.innerWidth / window.innerHeight;
        cameraIsometricPerspective.updateProjectionMatrix();
    }

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 49:
        renderer.render(scene, cameraFrontal);
        break;
    case 50:
        renderer.render(scene, cameraLateral);
        break;
    case 51:
        renderer.render(scene, cameraTop);
        break;
    case 52: 
        renderer.render(scene, cameraIsometricOrtogonal);
        break;
    case 53: 
        renderer.render(scene, cameraIsometricPerspective);
        break;

    case 54:
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;

    case 81: // Q key
        rotateFeet(-Math.PI / 2); // Rotate feet in the negative direction by 90 degrees
        break;
    case 65: // A key
        rotateFeet(Math.PI / 2); // Rotate feet in the positive direction by 90 degrees
        break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}