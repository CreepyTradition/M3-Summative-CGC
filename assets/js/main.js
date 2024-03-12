import * as THREE from './three.module.js';
import { FlyControls } from './FlyControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let controls = new FlyControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);
let stars, starGeo;

controls.movementSpeed = 1.0;
controls.rollSpeed = 0.005;
controls.autoForward = false;
controls.dragToLook = true;

particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  
  setInterval(changeColor, 3000);
}

function changeColor() {
  let randomColor = Math.random() * 0xffffff;
  stars.material.color.setHex(randomColor);
}

function animateParticles() {
    starGeo.verticesNeedUpdate = true;
    stars.position.z -= 1;

    if(stars.position.z < -300) {
      stars.position.z = 100;
    }
  }

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create a point light
const floorLight = new THREE.PointLight(0xffffff, 0.1, 10);
floorLight.position.set(0, 1.6, 0); 
scene.add(floorLight);

// Sphere light geometry
const sphereLightGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Adjust radius and segments as needed
const sphereLightMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 }); // Adjust material properties as needed
const sphereLightMesh = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
sphereLightMesh.position.set(0, 1.3, -4); // Position the sphere light
scene.add(sphereLightMesh);

// Light for the sphere light
const sphereLight = new THREE.PointLight(0xffff00, 1, 5);
sphereLight.position.copy(sphereLightMesh.position); // Position the point light at the same position as the sphere light mesh
scene.add(sphereLight);

// Surfaces
const sidewallGeometry = new THREE.BoxGeometry(0.2, 34, 24);
const floorGeometry = new THREE.BoxGeometry(44, 10, 24);

// Load texture image
const textureLoader = new THREE.TextureLoader();
const floortexture = textureLoader.load('./assets/textures/floor.jpg');
const sidewalltexture = textureLoader.load('./assets/textures/sidewall.jpg');
const rampCTTexture = textureLoader.load('./assets/textures/dust2CT.jpg');
const aLongTexture = textureLoader.load('./assets/textures/dust2Ramp.jpg');
const aSiteFloor = textureLoader.load('./assets/textures/dust2ASite.jpg');
const dust2Wall = textureLoader.load('./assets/textures/dust2Wall.jpg');

// Create materials for surfaces
const sidewallMaterial = new THREE.MeshStandardMaterial({ map: sidewalltexture });
const floorMaterial = new THREE.MeshToonMaterial({ map: floortexture });

// Create mesh for each surface
const sidewallMesh = new THREE.Mesh(sidewallGeometry, sidewallMaterial);
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

// Position surfaces
sidewallMesh.position.set(22.1, 6, -24);
floorMesh.position.set(0, -16.5, -24);

// Add surfaces to scene
scene.add(sidewallMesh);
scene.add(floorMesh);

// Ramp to CT Spawn
const rampCTGeo = new THREE.BoxGeometry( 15, 5, 25 ); 
const rampCTMat = new THREE.MeshBasicMaterial( {map: rampCTTexture} ); 
const rampCTCube = new THREE.Mesh( rampCTGeo, rampCTMat ); 
scene.add( rampCTCube );

// A long
const aLongGeo = new THREE.BoxGeometry( 20, 5, 10); 
const aLongMat = new THREE.MeshBasicMaterial( {map: aLongTexture} ); 
const aLongCube = new THREE.Mesh( aLongGeo, aLongMat ); 
scene.add( aLongCube );

// A Ramp
const aRampGeo = new THREE.BoxGeometry( 20, 8, 10); 
const aRampMat = new THREE.MeshBasicMaterial( {map: aLongTexture} ); 
const aRampCube = new THREE.Mesh( aRampGeo, aRampMat ); 
scene.add( aRampCube );

// A Ramp to Goose
const aRampGooseGeo = new THREE.BoxGeometry( 8, 10, 10); 
const aRampGooseMat = new THREE.MeshBasicMaterial( {map: aLongTexture} ); 
const aRampGooseCube = new THREE.Mesh( aRampGooseGeo, aRampGooseMat ); 
scene.add( aRampGooseCube );

// Goose
const gooseGeo = new THREE.BoxGeometry( 32, 10, 5); 
const gooseMat = new THREE.MeshBasicMaterial( {map: aSiteFloor} ); 
const gooseCube = new THREE.Mesh( gooseGeo, gooseMat ); 
scene.add( gooseCube );

// A Site
const aSiteGeo = new THREE.BoxGeometry( 30, 10, 19.5); 
const aSiteMat = new THREE.MeshBasicMaterial( {map: aSiteFloor} ); 
const aSiteCube = new THREE.Mesh( aSiteGeo, aSiteMat ); 
scene.add( aSiteCube );

// Dust 2 site lower walls
const lowerWallGeo = new THREE.BoxGeometry( 0.5, 13, 19); // Inline CT Spawn
const lowerWallMat = new THREE.MeshBasicMaterial( {map: dust2Wall} ); 
const lowerWallCube = new THREE.Mesh( lowerWallGeo, lowerWallMat ); 
const lowerWallGeo1 = new THREE.BoxGeometry( 2, 13, 0.5); // Facing CT Spawn
const lowerWallMat1 = new THREE.MeshBasicMaterial( {map: dust2Wall} ); 
const lowerWallCube1 = new THREE.Mesh( lowerWallGeo1, lowerWallMat1 ); 
const lowerWallGeo2 = new THREE.BoxGeometry( 0.5, 13, 6.5); // Facing A Long
const lowerWallMat2 = new THREE.MeshBasicMaterial( {map: dust2Wall} ); 
const lowerWallCube2 = new THREE.Mesh( lowerWallGeo2, lowerWallMat2 ); 
const lowerWallGeo3 = new THREE.BoxGeometry( 26, 13, 0.5); //Facing A Ramp
const lowerWallMat3 = new THREE.MeshBasicMaterial( {map: dust2Wall} ); 
const lowerWallCube3 = new THREE.Mesh( lowerWallGeo3, lowerWallMat3 ); 
scene.add( lowerWallCube );
scene.add( lowerWallCube1 );
scene.add( lowerWallCube2 );
scene.add( lowerWallCube3 );

// Position and Rotation for Ramps and other passageways
rampCTCube.position.set(-14.5, -13, -33.5);
rampCTCube.rotation.set(-0.2, 0, 0);
aLongCube.position.set(-12, -10.5, -17);
aRampCube.position.set(5, -10, -17);
aRampCube.rotation.set(0, 0, 0.2);
aRampGooseCube.position.set(18, -9, -17);
gooseCube.position.set(6, -9, -24.5);
lowerWallCube.position.set(-8, -9.6, -37);
lowerWallCube1.position.set(-9, -9.6, -27.3);
lowerWallCube2.position.set(-10.2, -9.6, -24.3);
lowerWallCube3.position.set(3, -9.6, -21.3);
aSiteCube.position.set(7, -9, -36.5);

function animate() {

  animateParticles();
  requestAnimationFrame(animate);
  controls.update(0.5);

  renderer.render(scene, camera);
}

animate();
