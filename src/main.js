import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ 
  color: 0xff6347,
  emissive: 0xff3000,
  emissiveIntensity: 0.5,
  roughness: 0.4,
  metalness: 0.6
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

// Add a light specifically for the torus
const torusLight = new THREE.PointLight(0xff6347, 1.5, 30); // Reduced intensity
torusLight.position.set(0, 0, 0);

// Create a sun-like light source that illuminates the moon
const sunLight = new THREE.DirectionalLight(0xffffee, 2.5); // Increased intensity from 1.5 to 2.5
sunLight.position.set(50, 30, -30);
sunLight.castShadow = true;

const pointLight = new THREE.PointLight(0xffffff, 1.2); // Reduced intensity
pointLight.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased ambient for softer overall lighting
ambientLight.position.set(10, 10, 10);
scene.add(torusLight, sunLight, pointLight, ambientLight);

// Helpers

// Uncomment to see the sun light direction
// const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 10);
// scene.add(sunLightHelper);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Changed to MeshBasicMaterial to be brighter
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg'); 
spaceTexture.colorSpace = THREE.SRGBColorSpace;
// Add a slight brightness adjustment to the space texture
const textureAdjustment = new THREE.Color(1.2, 1.2, 1.3); // Slightly brighter with blue boost
spaceTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('utkarsh.png');
// Make the avatar texture lighter
jeffTexture.colorSpace = THREE.SRGBColorSpace;

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), 
  new THREE.MeshBasicMaterial({ 
    map: jeffTexture,
    transparent: true,
    opacity: 0.9 // Slightly transparent to appear lighter
  })
);

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

// Make textures lighter
moonTexture.colorSpace = THREE.SRGBColorSpace;
normalTexture.colorSpace = THREE.SRGBColorSpace;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.5, 0.5), // Reduce normal map intensity
    emissive: 0x777777, // Increased emissive from 0x555555 to 0x777777
    emissiveIntensity: 0.3, // Increased from 0.2 to 0.3
    roughness: 0.5, // Slightly reduced for more shine
    metalness: 0.3  // Slightly increased for better reflections
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Add a spotlight specifically for the moon - brighter light
const moonSpotlight = new THREE.SpotLight(0xffffff, 2.5, 100, Math.PI / 5, 0.7); // Increased intensity from 1.5 to 2.5
moonSpotlight.position.set(-20, 10, 0);
moonSpotlight.target = moon;
scene.add(moonSpotlight);

// Add a second spotlight from another angle for more brightness
const moonSpotlight2 = new THREE.SpotLight(0xffffee, 1.8, 100, Math.PI / 6, 0.5);
moonSpotlight2.position.set(10, 5, 20);
moonSpotlight2.target = moon;
scene.add(moonSpotlight2);

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  
  // Make the torus light pulse slightly for a more dynamic effect
  const time = Date.now() * 0.001;
  const pulseIntensity = 1.2 + Math.sin(time * 2) * 0.3; // Gentler pulse between 0.9 and 1.5
  torusLight.intensity = pulseIntensity;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();