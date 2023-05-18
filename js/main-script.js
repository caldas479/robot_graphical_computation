//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;

var cameraFrontal, cameraLateral, cameraTop;
var cameraIsometricOrtogonal, cameraIsometricPerspective;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();


    // x is red, y is green and z is blue
    scene.add(new THREE.AxisHelper(10));

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    const aspectRatio = window.innerWidth/ window.innerHeight;

    cameraFrontal = new THREE.OrthographicCamera(-window.innerWidth / 64, window.innerWidth / 64, 
                                                window.innerHeight / 64, -window.innerHeight / 64, 
                                                1, 1000);
    cameraFrontal.position.z = 900;
    cameraFrontal.lookAt(scene.position);


    cameraLateral = new THREE.OrthographicCamera(-window.innerWidth / 64, window.innerWidth / 64, 
                                                window.innerHeight / 64, -window.innerHeight / 64, 
                                                1, 1000);
    cameraLateral.position.x = 900;
    cameraLateral.lookAt(scene.position);


    cameraTop = new THREE.OrthographicCamera(-window.innerWidth / 64, window.innerWidth / 64,
                                            -window.innerHeight / 64, window.innerHeight/64, 
                                            1, 1000);
    cameraTop.position.y = 900;
    cameraTop.lookAt(scene.position);


    cameraIsometricOrtogonal = new THREE.OrthographicCamera(-window.innerWidth / 64, window.innerWidth / 64,
                                                            -window.innerHeight / 64, window.innerHeight/64, 
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
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}