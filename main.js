import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import GUI from 'lil-gui'; 
import gsap from 'gsap';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const aspectRatio = sizes.width / sizes.height

let renderer, scene, camera, canvas;
let loader, environment, pmremGenerator;
let duck, propeller, sword, computer, books, reset;
const gui = new GUI();


experience();
model();
events();
animate();

function experience() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
  camera.position.set(-2.8, 1, 1.5);
  camera.rotation.set(0, -1, 0)
  scene.add(camera);

  gui.add(camera.position, 'x').min(-100).max(100).step(0.001).name('camera position X')
  gui.add(camera.position, 'y').min(-100).max(100).step(0.001).name('camera position Y')
  gui.add(camera.position, 'z').min(-100).max(100).step(0.001).name('camera position Z')
  gui.add(camera.rotation, 'x').min(-100).max(100).step(0.001).name('camera rotation X')
  gui.add(camera.rotation, 'y').min(-100).max(100).step(0.001).name('camera rotation Y')
  gui.add(camera.rotation, 'z').min(-100).max(100).step(0.001).name('camera rotation Z')

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

  }, undefined, function ( error ) {

    console.error( error );

  } );

}

function events() {
  duck = document.getElementById('duck')
  duck.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: 1.9, y: 1.5, z: -1.4, ease: "power1.inOut" })
    gsap.to(camera.rotation, { duration: 2, x: 0, y: 0, z: 0, ease: "power1.inOut" })
  })

  propeller = document.getElementById('propeller')
  propeller.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: -1.6, y: 1.2, z: -0.7, ease: "power1.inOut" })
    gsap.to(camera.rotation, { duration: 2, x: 0, y: -0.5, z: 0, ease: "power1.inOut" })
  })

  sword = document.getElementById('sword')
  sword.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: 1.6, y: 1.9, z: 0, ease: "power1.inOut" })
    gsap.to(camera.rotation, { duration: 2, z: 0, y: -1.6, z: 0, ease: "power1.inOut" })
  })

  computer = document.getElementById('computer')
  computer.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: 1.2, y: 1, z: 0.8, ease: "power1.inOut" })
    gsap.to(camera.rotation, { duration: 2, x: 0, y: -1, z: 0, ease: "power1.inOut" })
  })

  books = document.getElementById('books')
  books.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: -0.9, y: 1.1, z: 2.2, ease: "power1.inOut", });
    gsap.to(camera.rotation, { duration: 2, x: -0.5, y: -0.6, z: -0.3, ease: "power1.inOut" })
  })

  reset = document.getElementById('reset')
  reset.addEventListener('click', () => {
    gsap.to(camera.position, { duration: 2, x: -2.8, y: 1, z: 1.5, ease: "power1.inOut", });
    gsap.to(camera.rotation, { duration: 2, x: 0, y: -1, z: 0, ease: "power1.inOut" })
  })
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
