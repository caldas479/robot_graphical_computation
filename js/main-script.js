//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer,clock;

var currentCamera;
var cameraFrontal, cameraLateral, cameraTop;
var cameraIsometricOrtogonal, cameraIsometricPerspective;

var material, mesh, geometry;

var feetRotation = 0, legsRotation = 0, headRotation = 0;
var leftFootPivot, rightFootPivot, leftLegPivot, rightLegPivot, headPivot;

var armMedialMov = 0, armLateralMov = 0;

var q = 0, w = 0, e = 0, r = 0, a = 0, s = 0, d = 0, f = 0;

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
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

function addEye(group, side) {
    'use strict';
    var eye = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(eye, 1/2, 1/2, 1/8, side*1/3, 13.25, 1/2);    //eye

    group.add(eye);
}

function addAntenna(group, side) {
    'use strict';
    var antenna = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addConicPart(antenna, 1/4, 1/2, side*3/4, 14.25, 0);        //antenna

    group.add(antenna);
}

function addHead(group) {
    'use strict';
    var head = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(head, 2, 2, 1, 0, 13, 0);           //head
    addAntenna(head, -1);                            //leftAntenna
    addAntenna(head, 1);                             //rightAntenna
    addEye(head, -1);                                //leftEye
    addEye(head, 1);                                 //rightEye

    group.add(head);
}

function addWholeHead(group) {
    'use strict';
    var wholeHead = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addHead(wholeHead);                        //head

    headPivot = new THREE.Group();
    headPivot.add(wholeHead);
    scene.add(headPivot);
    wholeHead.position.set(0,12,0);       
    headPivot.position.set(0, 12, 0);
    group.add(headPivot);
    wholeHead.position.set(0,-12,0);
}

function addForearm(group, side) {
    'use strict';
    var forearm = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(forearm, 1, 1, 3, side*3.5, 8.5, 2);             //forearm

    group.add(forearm);
}

function addExhaust(group, side) {
    'use strict';
    var exhaust = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(exhaust, 1/2, 3, 1/2, side*4.25, 12.5, -1/2);  //exhaust

    group.add(exhaust);
}

function addArm(group, side) {
    'use strict';
    var arm = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(arm, 1, 4, 1, side*3.5, 10, 0);             //arm
    addExhaust(arm, side);                                   //exhaust
    addForearm(arm, side);                                   //forearm

    group.add(arm);
}

function addWholeArm(group, side) {
    'use strict';
    var wholeArm = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addArm(wholeArm, side);                                      //arm
    wholeArm.name = side > 0 ? "rightArm" : "leftArm";

    group.add(wholeArm);
}

function addWheel(group, x, y, z) {
    'use strict';
    var wheel = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    addCylindricalPart(wheel, 1, 1, 1, x, y, z);       //wheel

    group.add(wheel);
}

function addFoot(group, side) {
    'use strict';
    var foot = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }); 

    addCubicPart(foot, 3, 1, 1, 0, 0, 0);  //foot
    
    if(side > 0){
        leftFootPivot = new THREE.Group();
        leftFootPivot.add(foot);
        scene.add(leftFootPivot);
        foot.position.set(0,0,-1);       
        leftFootPivot.position.set(2, 1/2, 0.5);
        group.add(leftFootPivot);
        foot.position.set(0,0,1);
    }
    else{
        rightFootPivot = new THREE.Group();
        rightFootPivot.add(foot);
        scene.add(rightFootPivot);
        foot.position.set(0,0,-1);    
        rightFootPivot.position.set(-2, 1/2, 0.5);
        group.add(rightFootPivot);
        foot.position.set(0,0,1);
    }
}

function addLowLeg(group, side) {
    'use strict';
    var lowLeg = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(lowLeg, 2, 4, 2, side*1.5, 2, 0);       //lowerLeg
    addWheel(lowLeg, side*3, 3, 0.5);                      //topWheel
    addWheel(lowLeg, side*3, 1, 0.5);                      //bottomWheel
    addFoot(lowLeg, side);                               //foot

    group.add(lowLeg);
}

function addThigh(group, side) {
    'use strict';
    var thigh = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addCubicPart(thigh, 1, 3, 1, side*1.5, 5.5, 0);             //thigh
    addLowLeg(thigh, side);                                     //lowerLeg

    group.add(thigh);
}

function addLeg(group, side) {
    'use strict';
    var leg = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    addThigh(leg, side);                                //thigh

    if(side > 0){
        leftLegPivot = new THREE.Group();
        leftLegPivot.add(leg);
        scene.add(leftLegPivot);
        leg.position.set(1.5,8,-0.5);       
        leftLegPivot.position.set(1.5, 8, -0.5);
        group.add(leftLegPivot);
        leg.position.set(-1.5,-8,0.5);
    }
    else{
        rightLegPivot = new THREE.Group();
        rightLegPivot.add(leg);
        scene.add(rightLegPivot);
        leg.position.set(1.5,8,-0.5);    
        rightLegPivot.position.set(-1.5, 8, -0.5);
        group.add(rightLegPivot);
        leg.position.set(1.5,-8,0.5);
    }
}

function addWaist(group) {
    'use strict';
    var waist = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(waist, 4, 2, 3, 0, 8, 0);            //waist
    addWheel(waist, -2.5, 7, 0.5);                    //leftWheel
    addWheel(waist, 2.5, 7, 0.5);                     //rightWheel

    group.add(waist);
}

function addAbdomen(group) {
    'use strict';
    var abdomen = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(abdomen, 4, 1, 3, 0, 9.5, 0);            //abdomen
    addWaist(abdomen);                                    //waist

    group.add(abdomen);
}

function addTorso(group) {
    'use strict';
    var torso = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addCubicPart(torso, 6, 2, 3, 0, 11, 0);            //torso
    addAbdomen(torso);                                //abdomen

    group.add(torso);
}

function addBody(group) {
    'use strict';
    var body = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addTorso(body);                                  //torso

    group.add(body);
}

function createRobot() {
    'use strict';
    var robot = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addBody(robot);                                   //body
    addWholeHead(robot);                              //head
    addLeg(robot,-1);                                 //leftLeg
    addLeg(robot, 1);                                 //rightLeg
    addWholeArm(robot,-1);                            //leftArm
    addWholeArm(robot, 1);                            //rightArm

    scene.add(robot);
}

function addBox(group) {
    'use strict';
    var box = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(box, 6, 5, 20, 8, 4.5, 0);             //box

    group.add(box);
}

function addCouplingGear(group) {
    'use strict';
    var couplingGear = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    addCubicPart(couplingGear, 1/2, 1/2, 1/2, 8, 1.75, 10);     //couplingGear

    group.add(couplingGear);
}

function createTrailer() {
    'use strict';
    var trailer = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addBox(trailer);                                           //box
    addCouplingGear(trailer);                                  //couplingGear
    addWheel(trailer, 5.5, 1, -4.5);                           //frontLeftWheel
    addWheel(trailer, 5.5, 1, -6.5);                           //backLeftWheel
    addWheel(trailer, 10.5, 1, -4.5);                          //frontRightWheel
    addWheel(trailer, 10.5, 1, -6.5);                          //backRightWheel

    trailer.position.set(0,6,-12);

    scene.add(trailer);
}

function rotateFeet(direction) {
    'use strict';
    
    feetRotation += direction*(Math.PI/100); // Update the feet rotation angle
  
    leftFootPivot.rotation.x = feetRotation;  // Apply rotation to the left foot object
    rightFootPivot.rotation.x = feetRotation; // Apply rotation to the right foot object
}

function rotateLegs(direction) {
    'use strict';
    
    legsRotation += direction*(Math.PI/100); // Update the legs rotation angle
  
    leftLegPivot.rotation.x = legsRotation;  // Apply rotation to the left leg object
    rightLegPivot.rotation.x = legsRotation; // Apply rotation to the right leg object
}

function rotateHead(direction) {
    'use strict';
    
    headRotation += direction*(Math.PI/100); // Update the head rotation angle
  
    headPivot.rotation.x = headRotation;  // Apply rotation to the head object
}

function transladeArms(obj1, obj2, direction) {
    'use strict';
    if (direction == 1) {
        if (armMedialMov < 2) {
            armMedialMov += 0.4
            obj1.position.z -= 0.4;
            obj2.position.z -= 0.4;
        }
        else if (armLateralMov < 1) {
            armLateralMov += 0.2
            obj1.position.x += 0.2;
            obj2.position.x -= 0.2;
        }
    } 
    else {

        if (armLateralMov > 0) {
            armLateralMov -= 0.2
            obj1.position.x -= 0.2;
            obj2.position.x += 0.2;
        }
        else if (armMedialMov > 0) {
            armMedialMov -= 0.4
            obj1.position.z += 0.4;
            obj2.position.z += 0.4;
        }
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

    createRobot();
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
                                                            window.innerHeight / 32, -window.innerHeight/32, 
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

    currentCamera = cameraIsometricPerspective;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


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
    if(q && feetRotation < Math.PI/2) {
        rotateFeet(1);  // Rotate feet in the positive direction
    }
    if(a && feetRotation > 0) {
        rotateFeet(-1);  // Rotate feet in the negative direction
    }
    if (w && legsRotation < Math.PI/2) {
        rotateLegs(1);  // Rotate legs in the positive direction
    }
    if (s && legsRotation > 0) {
        rotateLegs(-1); // Rotate legs in the negative direction
    }
    if (r && headRotation > -Math.PI) {
        rotateHead(-1);  // Rotate head in the negative direction
    }
    if (f && headRotation < 0) {
        rotateHead(1); // Rotate head in the positive direction
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    clock = new THREE.Clock(true);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    createScene();
    createCameras();

    render();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    animate();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    if(clock.getDelta() >= 1/90){
        update();
    }
    render();
    requestAnimationFrame(animate);
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
        currentCamera = cameraFrontal;
        break;
    case 50:
        currentCamera = cameraLateral;
        break;
    case 51:
        currentCamera = cameraTop;
        break;
    case 52: 
        currentCamera = cameraIsometricOrtogonal;
        break;
    case 53: 
        currentCamera = cameraIsometricPerspective;
        break;

    case 54:
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;

    case 81:  // Q key
    case 113: // q key
        q = 1;
        break;
    case 65:  // A key
    case 97:  // a key
        a = 1;
        break;

    case 87:  // W key
    case 119: // w key
        w = 1;
        break;
    case 83:  // S key
    case 115: // s key
        s = 1;
        break;

    case 69:  // E key
    case 101: // e key
        transladeArms(scene.getObjectByName("leftArm"), scene.getObjectByName("rightArm"), 1);
        break;
    case 68:  // D key
    case 100: // d key
        transladeArms(scene.getObjectByName("leftArm"), scene.getObjectByName("rightArm"), -1);
        break;

    case 82:  // R key
    case 114: // r key
        r = 1;
        break;
    case 70:  // F key
    case 102: // f key
        f = 1;
        break;
}
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
    case 81:
    case 113:
        q = 0;
        break;
    case 65:
    case 97:
        a = 0;
        break;

    case 87:
    case 119:
        w = 0;
        break;
    case 83:
    case 115:
        s = 0;
        break;

    case 69:
    case 101:
        break;
    case 68:
    case 100:
        break;

    case 82:
    case 114:
        r = 0;
        break;
    case 70:
    case 102:
        f = 0;
        break;
    }
}