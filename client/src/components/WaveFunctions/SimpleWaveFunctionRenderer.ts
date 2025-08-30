import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
// import { MarchingCubes } from "../../library/SimpleMarchingCubes/SimpleMarchingCubes.ts";
import GUI from "lil-gui";
import {
  createWaveFunctions,
  // psi_1s,
  // psi_2p_z,
  // psi_2s,
} from "./WaveFunctionHelpers.ts";

let scene: THREE.Scene;

const waveFunctions = createWaveFunctions();

const samplers = {
  // allNegative,
  // psi_1s,
  // psi_2s,
  // psi_2p_z,
  ...waveFunctions,
} as const;

type Params = {
  rebuild: () => void;
  mcSize: number;
  resolution: number;
  isolation: number;
  renderMode: "surface" | "points";
  sampler: keyof typeof samplers;
};

const params: Params = {
  rebuild: () => {},
  mcSize: 24,
  //   mcSize: 10,
  resolution: 64,
  isolation: 0.01,
  //   isolation: 0.05,
  renderMode: "surface",
  //   sampler: "psi_2p_z",
  sampler: "2p_x",
  //   sampler: "3s",
  //   sampler: "3p_x",
  // sampler: "3d_xy",
};

const sampleAreaMin = 2;
// If the isosurface exceeds this area it will get clipped
const enableUvs = false;
const enableColors = false;
const maxPolyCount = 300000;
const showFullPoints = false;

let mcPos: MarchingCubes;
let mcNeg: MarchingCubes;
let sampleAreaOutline: THREE.LineSegments | undefined;
let mcOutline: THREE.LineSegments | undefined;
let points: THREE.Points;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
) {
  //   plot(mc, pointGeometry, isWithinSampleArea);
  const rebuild = () => plot(scene, pointGeometry);
  //   const rebuild = () => plot(scene, pointGeometry, allNegative);
  //   plot(mc, pointGeometry, () => 1);

  const guiContainer = document.createElement("div");
  guiContainer.style.position = "absolute";
  container.appendChild(guiContainer);

  params.rebuild = rebuild;
  const gui = new GUI({ title: "Settings", container: guiContainer });
  gui.add(params, "mcSize", 2, 100, 2).name("Marching cube size").onChange(
    rebuild,
  );
  gui.add(params, "resolution", 6, 96, 2).name("Resolution").onChange(
    rebuild,
  );
  gui.add(params, "isolation", 0.01, 0.1, 0.01).name("Isolation").onChange(
    rebuild,
  );
  gui.add(params, "renderMode", ["surface", "points"]).name("Render mode")
    .onChange(
      rebuild,
    );
  gui.add(params, "sampler", Object.keys(samplers)).name("Sampler")
    .onChange(
      rebuild,
    );
  //   gui.add(params, "rebuild").name("Rebuild");

  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.01,
    200,
  );
  camera.position.set(0, 0, params.mcSize * 2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.8);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(3, 3, 4);
  scene.add(dir);

  const axes = new THREE.AxesHelper(params.mcSize / 2);
  axes.material.transparent = true;
  //   axes.material.opacity = 0.25;
  scene.add(axes);

  const pointGeometry = new THREE.BufferGeometry();
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    depthWrite: false,
  });
  points = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(points);

  rebuild();

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

function disposeMesh<
  T extends {
    removeFromParent: () => void;
    material: THREE.Material | THREE.Material[];
    geometry: THREE.BufferGeometry;
  },
>(obj: T | undefined) {
  if (!obj) return;
  obj.removeFromParent();
  // if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  if (obj.geometry) obj.geometry.dispose?.();
}

function createMarchingCubesObjects(color: THREE.ColorRepresentation) {
  const mc = new MarchingCubes(
    params.resolution,
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.05,
      roughness: 0.45,
      side: THREE.DoubleSide,
    }),
    enableUvs,
    enableColors,
    maxPolyCount,
  );
  mc.isolation = params.isolation;
  const scl = params.mcSize / 2;
  mc.scale.set(scl, scl, scl);

  return mc;
  //   mc.reset();
}

type PlotFunction = (x: number, y: number, z: number) => number;

function plot(
  scene: THREE.Scene,
  pointGeometry: THREE.BufferGeometry,
) {
  disposeMesh(mcPos);
  disposeMesh(mcNeg);
  disposeMesh(mcOutline);
  disposeMesh(sampleAreaOutline);

  const step = params.mcSize / params.resolution;
  const sampleAreaMax = params.resolution - 3;
  const sampleAreaSize = (sampleAreaMax - (sampleAreaMin - 1)) * step;

  mcOutline = getOutline(params.mcSize);
  sampleAreaOutline = getOutline(sampleAreaSize);
  scene.add(mcOutline);
  scene.add(sampleAreaOutline);

  //   mcPos = createMarchingCubesObjects(0x7aa6ff);
  mcPos = createMarchingCubesObjects(0x4ea1ff);
  mcNeg = createMarchingCubesObjects(0xff5a5a);
  scene.add(mcPos);
  scene.add(mcNeg);

  // Bump the mc half a step forward along all axes to center the shape.
  mcPos.position.addScalar(step / 2);
  mcNeg.position.addScalar(step / 2);

  const posN = Math.pow(params.resolution, 3) * 3;
  const positions = new Float32Array(posN);
  const colors = new Float32Array(posN);

  function isWithinSampleArea(x: number, y: number, z: number) {
    return [x, y, z].every((c) => c >= sampleAreaMin && c <= sampleAreaMax);
    // return true;
  }

  function adjustCoord(c: number) {
    // return c * step - (params.mcSize / 2);
    // return (c - params.resolution / 2) * step;
    return (c - params.resolution / 2) * step + step / 2;
  }

  const func: PlotFunction = samplers[params.sampler];
  let i = 0;
  const startI = 0;
  for (let z = startI; z < params.resolution; z++) {
    for (let y = startI; y < params.resolution; y++) {
      for (let x = startI; x < params.resolution; x++, i++) {
        // mc.field[i] = func(x, y, z) ? 1 : 0;
        if (showFullPoints) {
          const idx = i * 3;
          positions[idx] = x * step;
          positions[idx + 1] = y * step;
          positions[idx + 2] = z * step;

          colors[idx] = 0; // R
          colors[idx + 1] = 1; // G
          colors[idx + 2] = 0; // B
        }

        if (!isWithinSampleArea(x, y, z)) {
          continue;
        }

        const dx = adjustCoord(x);
        const dy = adjustCoord(y);
        const dz = adjustCoord(z);

        // const v = func(x, y, z);
        const v = func(dx, dy, dz);

        // console.log(dx, dy, dz);
        // console.log(v);

        if (params.renderMode === "surface") {
          mcPos.field[i] = v;
          mcNeg.field[i] = -v;
        }

        if (params.renderMode === "points" && Math.abs(v) > params.isolation) {
          const idx = i * 3;
          positions[idx] = x * step;
          positions[idx + 1] = y * step;
          positions[idx + 2] = z * step;

          colors[idx] = v < 0 ? 1 : 0; // R
          colors[idx + 1] = 0; // G
          colors[idx + 2] = v > 0 ? 1 : 0; // B
        }
      }
    }
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  pointGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );
  pointGeometry.computeBoundingSphere();

  mcPos.update();
  mcNeg.update();

  // Center points
  points.position.set(0, 0, 0).addScalar(-params.mcSize / 2 + step / 2);

  //   const foo = mc.positionArray.filter((v) => v !== 0);
  //   console.log(Math.min(...foo));
  //   console.log(Math.max(...foo));
  //   console.log(mc.position);
}

function getOutline(size: number) {
  const dimensions = new THREE.Vector3(size, size, size);

  const geometry = new THREE.BoxGeometry(
    ...dimensions,
  );
  const edges = new THREE.EdgesGeometry(geometry);
  const outline = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff }),
  );

  return outline;
}

// function psi_1s(x: number, y: number, z: number) {
//   const r = Math.hypot(x, y, z);
//   return Math.exp(-r);
//   //   return Math.pow(3, -r);
// }

function allNegative(x: number, y: number, z: number): number {
  return x < 0 && y < 0 && z < 0 ? 1 : 0;
}
