import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import GUI from "lil-gui";

type PSI = (x: number, y: number, z: number) => number;

// === Scene & camera ===
export function init(
  app: HTMLDivElement,
) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2, globalThis.devicePixelRatio));
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  renderer.setClearColor(0x0b0f14, 1);
  app.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    globalThis.innerWidth / globalThis.innerHeight,
    0.01,
    200,
  );
  camera.position.set(1.5, 1.2, 22.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.6);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 3, 3);
  scene.add(dir);

  const ballMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshPhongMaterial({
      color: "red",
      side: THREE.DoubleSide,
    }),
  );
  ballMesh.position.copy(new THREE.Vector3(5, 0, 0));

  scene.add(ballMesh);

  // === Orbitals ===
  const vecLen = (x: number, y: number, z: number) => Math.hypot(x, y, z);

  function psi_1s(x: number, y: number, z: number) {
    const r = vecLen(x, y, z);
    return Math.exp(-r);
  }
  function psi_2s(x: number, y: number, z: number) {
    const r = vecLen(x, y, z);
    return (2 - r) * Math.exp(-r / 2);
  }

  function psi_2p_z(x: number, y: number, z: number) {
    const r = vecLen(x, y, z);
    const theta = Math.acos(r === 0 ? 1 : z / r);
    const radial = r * Math.exp(-r / 2);
    const angular = Math.cos(theta); // ∝ Y_10
    return radial * angular; // signed
  }

  // function psi_2p_z(x: number, y: number, z: number) {
  //   const r = vecLen(x, y, z);
  //   const theta = Math.acos(r === 0 ? 1 : z / r);
  //   return r * Math.exp(-r / 2) * Math.cos(theta);
  // }

  function psi_3d_z2(x: number, y: number, z: number) {
    const r = vecLen(x, y, z);
    const theta = Math.acos(r === 0 ? 1 : z / r);
    return (r * r) * Math.exp(-r / 3) *
      (3 * Math.cos(theta) * Math.cos(theta) - 1);
  }

  const orbitals: Record<string, PSI> = {
    "1s": psi_1s,
    "2s": psi_2s,
    "2p_z": psi_2p_z,
    "3d_z2": psi_3d_z2,
  };

  // === Marching Cubes setup ===
  const resolution = 50;
  const material = new THREE.MeshStandardMaterial({
    color: 0x5588ff,
    roughness: 0.3,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const mc = new MarchingCubes(resolution, material, true, true, 200000);
  mc.isolation = 0.02; // isosurface level
  mc.position.set(0, 0, 0);
  mc.scale.set(2, 2, 2);
  scene.add(mc);

  function updateField(psi: PSI) {
    mc.reset();
    for (let k = 0; k < resolution; k++) {
      for (let j = 0; j < resolution; j++) {
        for (let i = 0; i < resolution; i++) {
          const x = (i / resolution - 0.5) * 6; // scale to [-3,3]
          const y = (j / resolution - 0.5) * 6;
          const z = (k / resolution - 0.5) * 6;
          const val = psi(x, y, z);
          mc.setCell(i, j, k, val * val); // probability density
        }
      }
    }
    mc.update();
  }

  const params = {
    orbital: "2p_z",
    // orbital: "1s",
    iso: 0.02,
    resample: () => rebuild(),
  };
  const gui = new GUI();
  gui.add(params, "orbital", Object.keys(orbitals)).onChange(() => rebuild());
  gui.add(params, "iso", 0.001, 0.2, 0.001).onChange((v: number) => {
    mc.isolation = v;
    rebuild();
  });
  gui.add(params, "resample");

  function rebuild() {
    console.log("rebuild");
    updateField(orbitals[params.orbital]);
  }
  rebuild();

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  globalThis.addEventListener("resize", () => {
    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  });
}
