import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

export function init(
  app: HTMLDivElement,
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    200,
  );
  camera.position.set(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  app.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // A simple light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Create marching cubes object
  const resolution = 28; // higher = more detailed
  const mc = new MarchingCubes(
    resolution,
    new THREE.MeshPhongMaterial({ color: 0x00ffcc }),
    true,
    true,
  );
  mc.position.set(0, 0, 0);
  mc.scale.set(1, 1, 1);
  scene.add(mc);

  //   const ballMesh = new THREE.Mesh(
  //     new THREE.SphereGeometry(1),
  //     new THREE.MeshPhongMaterial({
  //       color: "red",
  //     }),
  //   );

  console.log(globalThis.innerWidth, globalThis.innerHeight);

  //   scene.add(ballMesh);

  // Put a single "metaball" in the field
  function updateCubes() {
    mc.reset();
    // metaball(x, y, z, strength, subtract)
    mc.addBall(0.5, 0.5, 0.5, 0.5, 0.1); // simple sphere
    mc.update();
  }

  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    updateCubes();
    renderer.render(scene, camera);
  }

  animate();
}
