console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
// pull the camera back a little so the heart fills more of the background
camera.position.z = 700;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
// let the page handle pointer events — heart background shouldn't block UI
renderer.domElement.style.pointerEvents = 'none';
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.domElement.style.zIndex = '0';
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);
// disable controls — the heart should be a static background element
controlsWebGL.enabled = false;

/* PARTICLES */
// Create a global gsap timeline that contains all tweens
const tl = gsap.timeline({ repeat: -1, yoyo: true });

// pick a random base hue per page load so the heart starts with a different tint
const baseHue = Math.random();

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];
for (let i = 0; i < length; i += 0.1) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
  // Create a tween for that vector
  tl.from(vector, {
      x: 600 / 2, // Center X of the heart
      y: -552 / 2, // Center Y of the heart
      z: 0, // Center of the scene
      ease: "sine.inOut",
      duration: "random(2, 5)", // Random duration
      // small outward pulse on each particle
      onUpdate: function() {
        vector.multiplyScalar(1 + 0.0001);
      }
    },
    i * 0.002 // Delay calculated from the distance along the path
  );
}
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
const material = new THREE.PointsMaterial({ color: 0xee5282, blending: THREE.AdditiveBlending, size: 4 });
const particles = new THREE.Points(geometry, material);
// Offset the particles in the scene based on the viewbox values and scale up so the heart fills the bg
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
particles.scale.set(2.0, 2.0, 2.0);
scene.add(particles);

// remove scene rotation; we want the heart fixed and acting as a background wallpaper

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  // Update the geometry from the animated vertices
  geometry.setFromPoints(vertices);
  // hue cycle the particle color over time
  const t = performance.now() * 0.00006 + baseHue;
  // convert hue [0,1) to rgb via HSL
  const h = (t % 1 + 1) % 1;
  const color = new THREE.Color();
  color.setHSL(h, 0.85, 0.6);
  material.color.copy(color);
  renderer.render(scene, camera);
}

/* EVENTS */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

requestAnimationFrame(render);