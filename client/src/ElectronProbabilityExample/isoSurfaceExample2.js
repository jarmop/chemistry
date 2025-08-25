import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import GUI from "lil-gui";

// === Scene & camera ===
export function init(
  app,
) {
  // --- Three basics ---
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2, globalThis.devicePixelRatio));
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  renderer.setClearColor(0x0b0f14, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  app.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    globalThis.innerWidth / globalThis.innerHeight,
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

  // --- Orbitals (unnormalized, atomic units a0=1, Z=1) ---
  const len = (x, y, z) => Math.hypot(x, y, z);
  function psi_1s(x, y, z) {
    const r = len(x, y, z);
    return Math.exp(-r);
  }
  function psi_2s(x, y, z) {
    const r = len(x, y, z);
    return (2 - r) * Math.exp(-r / 2);
  }
  function psi_2p_z(x, y, z) {
    const r = len(x, y, z);
    const theta = Math.acos(r === 0 ? 1 : z / r);
    return r * Math.exp(-r / 2) * Math.cos(theta);
  }
  function psi_3d_z2(x, y, z) {
    const r = len(x, y, z);
    const theta = Math.acos(r === 0 ? 1 : z / r);
    return (r * r) * Math.exp(-r / 3) *
      (3 * Math.cos(theta) * Math.cos(theta) - 1);
  }

  const ORBITALS = {
    "1s": psi_1s,
    "2s": psi_2s,
    "2p_z": psi_2p_z,
    "3d_z2": psi_3d_z2,
  };

  // --- MarchingCubes instances ---
  let mcPos = null, mcNeg = null, mcDen = null; // ψ>0, ψ<0, |ψ|^2

  function disposeMC(obj) {
    if (!obj) return;
    obj.removeFromParent();
    if (obj.material) obj.material.dispose();
    if (obj.geometry) obj.geometry.dispose?.();
  }

  // --- Parameters & GUI ---
  const params = {
    orbital: "2p_z",
    mode: "psi (± iso)", // or 'density |psi|^2'
    res: 64, // grid resolution per axis
    extent: 8.0, // half-size of cube in a0 units -> [-extent, +extent]
    isoFrac: 0.18, // iso as fraction of max |psi| or max density
    maxTris: 300000, // max triangles per MC mesh
    rebuild: () => rebuild(true),
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
  gui.add(params, "extent", 4, 14, 0.5).name("extent (a0)").onChange(() =>
    rebuild(true)
  );
  gui.add(params, "isoFrac", 0.02, 0.6, 0.01).name("iso fraction").onChange(
    () => rebuild(false),
  );
  gui.add(params, "maxTris", 50000, 600000, 10000).name("max tris").onChange(
    () => rebuild(true),
  );
  gui.add(params, "rebuild").name("re-sample");

  // --- Field building ---
  function buildField(psi, res, extent) {
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

  // --- Rebuild scene ---
  function rebuild(recreate) {
    const psi = ORBITALS[params.orbital];

    if (recreate) {
      disposeMC(mcPos);
      disposeMC(mcNeg);
      disposeMC(mcDen);
      mcPos = mcNeg = mcDen = null;
    }

    // Build / reuse MC meshes depending on mode
    if (params.mode === "psi (± iso)") {
      if (!mcPos) {
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
          mc.scale.set(1, 1, 1);
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
      for (let i = 0; i < fieldP.length; i++) {
        const v = fieldPsi[i];
        fieldP[i] = v;
        fieldN[i] = -v;
      }
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
      for (let i = 0; i < field.length; i++) {
        const d = fieldPsi[i] * fieldPsi[i];
        field[i] = d;
        if (d > maxDen) maxDen = d;
      }
      mcDen.isolation = params.isoFrac * maxDen;
      mcDen.update();
    }
  }

  rebuild(true);

  // --- Render loop ---
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // --- Resize ---
  globalThis.addEventListener("resize", () => {
    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  });
}
