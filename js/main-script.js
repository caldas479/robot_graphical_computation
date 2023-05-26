//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer,clock;

var currentCamera, nextCamera;
var cameraFrontal, cameraLateral, cameraTop;
var cameraIsometricOrtogonal, cameraIsometricPerspective;

var material, mesh, geometry;

var feetRotation = 0, legsRotation = 0, headRotation = 0;
var leftFootPivot, rightFootPivot, leftLegPivot, rightLegPivot, headPivot;

var armMedialMov = 0, armLateralMov = 0;

var qkey = 0, wkey = 0, ekey = 0, rkey = 0, akey = 0, skey = 0, dkey = 0, fkey = 0;
var upkey = 0, downkey = 0, leftkey = 0, rightkey = 0;

var truckColision = 0;
var trailerAnimation = 0;

var truckBBMin, truckBBMax, trailerBBMin,trailerBBMax;

const animationDuration = 1000; // 1 second
const numFrames = 60; // 60 frames per second

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
    geometry = new THREE.CylinderGeometry(radTop, radBottom, height,32);
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

    // Boundary Box initial points
    truckBBMin = new THREE.Vector3(-3.5, 6, -3);
    truckBBMax = new THREE.Vector3(3.5, 13.5, 1.5);

    addBody(robot);                                   //body
    addWholeHead(robot);                              //head
    addLeg(robot,-1);                                 //leftLeg
    addLeg(robot, 1);                                 //rightLeg
    addWholeArm(robot,-1);                            //leftArm
    addWholeArm(robot, 1);                            //rightArm

    scene.add(robot);
}

function addCouplingGear(group) {
    'use strict';
    var couplingGear = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    addCubicPart(couplingGear, 1/2, 1/2, 1/2, 8, 1.75, 10);     //couplingGear

    group.add(couplingGear);
}

function addBox(group) {
    'use strict';
    var box = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addCubicPart(box, 7, 6, 20, 8, 5, 0);                //box
    addCouplingGear(box);                                //couplingGear
    addWheel(box, 5, 1, -4.5);                           //frontLeftWheel
    addWheel(box, 5, 1, -6.5);                           //backLeftWheel
    addWheel(box, 11, 1, -4.5);                          //frontRightWheel
    addWheel(box, 11, 1, -6.5);                          //backRightWheel

    group.add(box);
}

function createTrailer() {
    'use strict';
    var trailer = new THREE.Group();
    material = new THREE.MeshBasicMaterial({ color: 0xafafaf, wireframe: true });

    addBox(trailer);                                           //box

    // Boundary Box initial points
    trailerBBMin = new THREE.Vector3(-3.5, 6, -30);
    trailerBBMax = new THREE.Vector3(3.5, 13.5, -9.75);
    
    trailer.name = "trailer";
    trailer.position.set(-8,6,-20);

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
    
    headRotation += direction*(Math.PI/50); // Update the head rotation angle
  
    headPivot.rotation.x = headRotation;  // Apply rotation to the head object
}

function transladeArms(direction) {
    'use strict';
    var leftArm = scene.getObjectByName("leftArm");
    var rightArm = scene.getObjectByName("rightArm");

    if (direction == 1) {
        if (armMedialMov < 2) {
            armMedialMov += 0.2
            leftArm.position.z -= 0.2;
            rightArm.position.z -= 0.2;
        }
        else if (armLateralMov < 1) {
            armLateralMov += 0.1
            leftArm.position.x += 0.1;
            rightArm.position.x -= 0.1;
        }
    } 
    else {

        if (armLateralMov > 0) {
            armLateralMov -= 0.1
            leftArm.position.x -= 0.1;
            rightArm.position.x += 0.1;
        }
        else if (armMedialMov > 0) {
            armMedialMov -= 0.2
            leftArm.position.z += 0.2;
            rightArm.position.z += 0.2;
        }
    } 
}

function moveTrailer(direction) {
    'use strict';
    var trailer = scene.getObjectByName("trailer");

    if (direction == '+x') {
        trailer.position.x += 0.2;
        trailerBBMax.add(new THREE.Vector3(0.2,0,0));
        trailerBBMin.add(new THREE.Vector3(0.2,0,0));
    }
    if (direction == '-x') {
        trailer.position.x += -0.2;
        trailerBBMax.add(new THREE.Vector3(-0.2,0,0));
        trailerBBMin.add(new THREE.Vector3(-0.2,0,0));
    }
    if (direction == '+z') {
        trailer.position.z += 0.2;
        trailerBBMax.add(new THREE.Vector3(0,0,0.2));
        trailerBBMin.add(new THREE.Vector3(0,0,0.2));
    }
    if (direction == '-z') {
        trailer.position.z += -0.2;
        trailerBBMax.add(new THREE.Vector3(0,0,-0.2));
        trailerBBMin.add(new THREE.Vector3(0,0,-0.2));
    }
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xeeeeff);

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
    nextCamera = cameraIsometricPerspective;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    // Check if robot is in truck mode
    if(feetRotation >= Math.PI/2 && legsRotation >= Math.PI/2 && 
        headRotation <= -Math.PI && armLateralMov >= 1){
            if(truckBBMax.getComponent(0) > trailerBBMin.getComponent(0) && 
                truckBBMin.getComponent(0) < trailerBBMax.getComponent(0)&&
                truckBBMax.getComponent(1) > trailerBBMin.getComponent(1) && 
                truckBBMin.getComponent(1) < trailerBBMax.getComponent(1)&&
                truckBBMax.getComponent(2) > trailerBBMin.getComponent(2) && 
                truckBBMin.getComponent(2) < trailerBBMax.getComponent(2)){
                truckColision = 1;
            }
            else {
                truckColision = 0;
            }
    }

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

    if(truckColision) {
        var trailer = scene.getObjectByName("trailer");
        const currentPosition = trailer.position;
        const targetPosition = new THREE.Vector3(-8,6,-14);
        const stepSize = targetPosition.clone().sub(currentPosition).divideScalar(numFrames);

        let frameCount = 0;

        function animateTrailer() {
            trailerAnimation = 1;
            trailer.position.add(stepSize);

            render();

            frameCount++;
            
            if (frameCount < numFrames) {
                requestAnimationFrame(animateTrailer);
            }          
        }

        animateTrailer();
        
        // Boundary Box initial points
        trailerBBMin = new THREE.Vector3(-3.5, 6, -24);
        trailerBBMax = new THREE.Vector3(3.5, 13.5, -3.75);
    }
    trailerAnimation = 0;

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    if(qkey && feetRotation < Math.PI/2) {
        rotateFeet(1);  // Rotate feet in the positive direction
    }
    if(akey && feetRotation > 0) {
        rotateFeet(-1);  // Rotate feet in the negative direction
    }
    if (wkey && legsRotation < Math.PI/2) {
        rotateLegs(1);  // Rotate legs in the positive direction
    }
    if (skey && legsRotation > 0) {
        rotateLegs(-1); // Rotate legs in the negative direction
    }
    if (ekey) {
        transladeArms(1);  // Translade arms to the closed position
    }
    if (dkey) {
        transladeArms(-1); // Translade arms to the opened position
    }
    if (rkey && headRotation > -Math.PI) {
        rotateHead(-1);  // Rotate head in the negative direction
    }
    if (fkey && headRotation < 0) {
        rotateHead(1); // Rotate head in the positive direction
    }
    
    if (!trailerAnimation) {
        currentCamera = nextCamera;
        if (leftkey) {
            moveTrailer('-x'); // Move trailer in negative x
        }
        if (rightkey) {
            moveTrailer('+x'); // Move trailer in positive x
        }
        if (upkey) {
            moveTrailer('+z'); // Move trailer in positive z
        }
        if (downkey) {
            moveTrailer('-z'); // Move trailer in negative z
        }
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
    
    checkCollisions();
    handleCollisions();
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
    case 49: // 1 key
        if (!trailerAnimation) {
            nextCamera = cameraFrontal;
        }
        break;
    case 50: // 2 key
        if (!trailerAnimation) {
            nextCamera = cameraLateral;
        }
        break;
    case 51: // 3 key
        if (!trailerAnimation) {
            nextCamera = cameraTop;
        }
        break;
    case 52: // 4 key
        if (!trailerAnimation) {
            nextCamera = cameraIsometricOrtogonal;
        }
        break;
    case 53: // 5 key
        if (!trailerAnimation) {
            nextCamera = cameraIsometricPerspective;
        }
        break;

    case 54: // 6 key
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;

    case 81:  // Q key
    case 113: // q key
        qkey = 1;
        break;
    case 65:  // A key
    case 97:  // a key
        akey = 1;
        break;

    case 87:  // W key
    case 119: // w key
        wkey = 1;
        break;
    case 83:  // S key
    case 115: // s key
        skey = 1;
        break;

    case 69:  // E key
    case 101: // e key
        ekey = 1;
        break;
    case 68:  // D key
    case 100: // d key
        dkey = 1;
        break;

    case 82:  // R key
    case 114: // r key
        rkey = 1;
        break;
    case 70:  // F key
    case 102: // f key
        fkey = 1;
        break;

    case 38:  // ArrowUp key
        upkey = 1;
        break;
    case 40:  // ArrowDown key
        downkey = 1;
        break;
    case 37:  // ArrowLeft key
        leftkey = 1;
        break;
    case 39:  // ArrowRight key
        rightkey = 1;
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
        qkey = 0;
        break;
    case 65:
    case 97:
        akey = 0;
        break;

    case 87:
    case 119:
        wkey = 0;
        break;
    case 83:
    case 115:
        skey = 0;
        break;

    case 69:
    case 101:
        ekey = 0;
        break;
    case 68:
    case 100:
        dkey = 0;
        break;

    case 82:
    case 114:
        rkey = 0;
        break;
    case 70:
    case 102:
        fkey = 0;
        break;

    case 38:
        upkey = 0;
        break;
    case 40:
        downkey = 0;
        break;
    case 37:
        leftkey = 0;
        break;
    case 39:
        rightkey = 0;
        break;
    }
}