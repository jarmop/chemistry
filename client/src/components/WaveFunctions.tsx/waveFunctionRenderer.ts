import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import GUI from "lil-gui";
import {
  createWaveFunctionGetter,
  psi_1s,
  psi_2p_z,
  psi_2s,
  psi_3d_z2,
} from "./WaveFunctionHelpers.ts";

type PSI = (x: number, y: number, z: number) => number;

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
  camera.position.set(2.2, 1.6, 3.0);

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

  rebuild(true);

  // --- Render loop ---
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // --- Resize ---
  // globalThis.addEventListener("resize", () => {
  //   camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  // });
}

function disposeMC(obj: MarchingCubes) {
  if (!obj) return;
  obj.removeFromParent();
  // if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  if (obj.geometry) obj.geometry.dispose?.();
}

// --- Field building ---
function buildField(psi: PSI, res: number, extent: number) {
  const N = res * res * res;
  const fieldPsi = new Float32Array(N);
  let maxAbs = 0;
  let idx = 0;
  for (let k = 0; k < res; k++) {
    const z = ((k / (res - 1)) - 0.5) * 2 * extent;
    for (let j = 0; j < res; j++) {
      const y = ((j / (res - 1)) - 0.5) * 2 * extent;
      for (let i = 0; i < res; i++) {
        const x = ((i / (res - 1)) - 0.5) * 2 * extent;
        const v = psi(x, y, z);
        fieldPsi[idx++] = v;
        const a = Math.abs(v);
        if (a > maxAbs) maxAbs = a;
      }
    }
  }
  return { fieldPsi, maxAbs };
}

// --- MarchingCubes instances ---
let mcPos: MarchingCubes | null = null, // ψ>0
  mcNeg: MarchingCubes | null = null, // ψ<0
  mcDen: MarchingCubes | null = null; // |ψ|^2

// --- Parameters & GUI ---
const params = {
  // orbital: "2p_z",
  orbital: "3d_z2",
  mode: "psi (± iso)", // or 'density |psi|^2'
  res: 96, // grid resolution per axis
  extent: 28, // half-size of cube in a0 units -> [-extent, +extent]
  isoFrac: 0.05, // iso as fraction of max |psi| or max density
  maxTris: 300000, // max triangles per MC mesh
  rebuild: () => rebuild(true),
};

const waveFunctions = createWaveFunctionGetter();
console.log(waveFunctions);

const ORBITALS: Record<string, PSI> = {
  "1s_old": psi_1s,
  "1s": waveFunctions["1s"],
  "2s": psi_2s,
  "2p_z_old": psi_2p_z,
  "2p_z": waveFunctions["2p_z"],
  "3d_z2": psi_3d_z2,
};

const gui = new GUI({ title: "Orbital Controls" });
gui.add(params, "orbital", Object.keys(ORBITALS)).name("nℓm").onChange(() =>
  rebuild(true)
);
gui.add(params, "mode", ["psi (± iso)", "density |psi|^2"]).onChange(() =>
  rebuild(false)
);
gui.add(params, "res", [48, 64, 80, 96]).name("resolution").onChange(() =>
  rebuild(true)
);
gui.add(params, "extent", 4, 40, 0.5).name("extent (a0)").onChange(() =>
  rebuild(true)
);
gui.add(params, "isoFrac", 0.02, 0.6, 0.01).name("iso fraction").onChange(
  () => rebuild(false),
);
gui.add(params, "maxTris", 50000, 600000, 10000).name("max tris").onChange(
  () => rebuild(true),
);
gui.add(params, "rebuild").name("re-sample");

// --- Rebuild scene ---
function rebuild(recreate: boolean) {
  const psi = ORBITALS[params.orbital];

  if (recreate) {
    mcPos && disposeMC(mcPos);
    mcNeg && disposeMC(mcNeg);
    mcDen && disposeMC(mcDen);
    mcPos = mcNeg = mcDen = null;
  }

  // Build / reuse MC meshes depending on mode
  if (params.mode === "psi (± iso)") {
    if (!mcPos || !mcNeg) {
      mcPos = new MarchingCubes(
        params.res,
        new THREE.MeshStandardMaterial({
          color: 0x4ea1ff,
          metalness: 0.1,
          roughness: 0.35,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        }),
        true,
        true,
        params.maxTris,
      );
      mcNeg = new MarchingCubes(
        params.res,
        new THREE.MeshStandardMaterial({
          color: 0xff5a5a,
          metalness: 0.1,
          roughness: 0.35,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        }),
        true,
        true,
        params.maxTris,
      );
      [mcPos, mcNeg].forEach((mc) => {
        mc.position.set(0, 0, 0);
        const scl = 1;
        mc.scale.set(scl, scl, scl);
        mc.enableUvs = false;
        mc.enableColors = false;
        scene.add(mc);
      });
    }
    // rebuild fields
    const { fieldPsi, maxAbs } = buildField(psi, params.res, params.extent);
    const iso = params.isoFrac * maxAbs; // auto-scaled iso
    mcPos.isolation = iso;
    mcNeg.isolation = iso;
    // fill internal fields
    // ensure correct length if res changed
    mcPos.reset();
    mcNeg.reset();
    const fieldP = mcPos.field, fieldN = mcNeg.field; // Float32Array
    fieldPsi.forEach((v, i) => {
      fieldP[i] = v;
      fieldN[i] = -v;
    });
    mcPos.update();
    mcNeg.update();
  } else {
    if (!mcDen) {
      mcDen = new MarchingCubes(
        params.res,
        new THREE.MeshStandardMaterial({
          color: 0x7aa6ff,
          metalness: 0.05,
          roughness: 0.45,
          side: THREE.DoubleSide,
        }),
        true,
        true,
        params.maxTris,
      );
      mcDen.position.set(0, 0, 0);
      mcDen.scale.set(1, 1, 1);
      scene.add(mcDen);
    }
    const { fieldPsi, maxAbs } = buildField(psi, params.res, params.extent);
    // Convert to density once
    const field = mcDen.field;
    mcDen.reset();
    let maxDen = 0;
    fieldPsi.forEach((v, i) => {
      const d = v * v;
      field[i] = d;
      if (d > maxDen) maxDen = d;
    });
    mcDen.isolation = params.isoFrac * maxDen;
    mcDen.update();
  }
}
