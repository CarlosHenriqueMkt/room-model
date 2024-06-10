import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const aspectRatio = sizes.width / sizes.height

let renderer, scene, camera, canvas, controls;
let loader, environment, pmremGenerator;

/* const clock = new THREE.Clock() */

experience();
model();
animate();

function experience() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
  camera.position.set(-5,2.5,3.5)
  scene.add(camera);

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
  });


  canvas = document.getElementById('app');
  renderer = new THREE.WebGLRenderer(
    { 
      antialias: true, 
      alpha: true 
    }
  );
  renderer.shadowMap = true
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvas.appendChild(renderer.domElement);

  controls = new OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true


  renderer.render(scene, camera);
}

function model() {

  environment = new RoomEnvironment( renderer );
  pmremGenerator = new THREE.PMREMGenerator( renderer );

  scene.background = new THREE.Color( 0x000000 );
  scene.environment = pmremGenerator.fromScene( environment ).texture;

  loader = new GLTFLoader();

  loader.load( '/model/room/scene.gltf', function ( gltf ) {
    
    const model = gltf.scene
    scene.add( model );
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = boundingBox.getCenter(new THREE.Vector3());
    camera.lookAt(center);

  }, undefined, function ( error ) {

    console.error( error );

  } );

}

function animate() {

  /* const elapsedTime = clock.getElapsedTime() */
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
