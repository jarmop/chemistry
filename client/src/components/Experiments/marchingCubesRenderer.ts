import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

let scene: THREE.Scene;

// === Scene & camera ===
export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  // --- Three basics ---
  renderer.setPixelRatio(Math.min(2, globalThis.devicePixelRatio));
  renderer.setSize(width, height);
  renderer.setClearColor(0x0b0f14, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.01,
    200,
  );
  // camera.position.set(2.2, 1.6, 3.0);
  camera.position.set(5, 5, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.8);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(3, 3, 4);
  scene.add(dir);

  const axes = new THREE.AxesHelper(2.0);
  axes.material.transparent = true;
  axes.material.opacity = 0.25;
  scene.add(axes);

  // const ballMesh = new THREE.Mesh(
  //   new THREE.SphereGeometry(1),
  //   new THREE.MeshPhongMaterial({
  //     color: "red",
  //   }),
  // );

  // const cube = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  // );
  // cube.position.set(0.5, 0.5, 0.5);

  // scene.add(cube);

  rebuild();

  // --- Render loop ---
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

// --- Rebuild scene ---
function rebuild() {
  const res = 5;
  const enableUvs = true;
  const enableColors = true;
  const extent = 28;
  const maxPolyCount = 8;

  const mc = new MarchingCubes(
    res,
    new THREE.MeshStandardMaterial({
      color: 0x7aa6ff,
      metalness: 0.05,
      roughness: 0.45,
      side: THREE.DoubleSide,
    }),
    enableUvs,
    enableColors,
    maxPolyCount,
  );
  mc.position.set(0, 0, 0);
  const scl = 1;
  mc.scale.set(scl, scl, scl);
  scene.add(mc);
  // const fieldPsi = buildField();

  console.log(res, extent);
  const N = res * res * res;
  const fieldPsi = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    fieldPsi[i] = 0;
  }

  fieldPsi[61] = 1;

  console.log(fieldPsi);

  mc.reset();
  let maxDen = 0;
  fieldPsi.forEach((v, i) => {
    // const d = v * v;
    const d = v;
    // field[i] = d;
    mc.field[i] = d;
    if (d > maxDen) maxDen = d;
  });
  console.log(maxDen);
  // mc.isolation = params.isoFrac * maxDen;
  console.log("maxDen", maxDen);
  mc.isolation = 0.001 * maxDen;
  mc.update();
}
