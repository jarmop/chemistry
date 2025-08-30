import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/addons/renderers/CSS2DRenderer.js";
// import { MarchingCubes } from "../../library/SimpleMarchingCubes/SimpleMarchingCubes.ts";
import GUI from "lil-gui";
import {
  createWaveFunctions,
  // psi_1s,
  // psi_2p_z,
  // psi_2s,
} from "./WaveFunctionHelpers.ts";

// const BOHR_RADIUS = 5.29177210903e-11; // meters

let scene: THREE.Scene;

// const waveFunctions = createWaveFunctions();

let samplers = {
  ...createWaveFunctions(),
};

type Params = {
  rebuild: () => void;
  mcSize: number;
  resolution: number;
  isolation: number;
  a0: number;
  renderMode: "surface" | "points";
  sampler: keyof typeof samplers;
  samplerMode: "waveFunction" | "probabilityDensity";
};

const params: Params = {
  rebuild: () => {},
  mcSize: 2800,
  //   mcSize: 10,
  resolution: 64,
  isolation: 0.2,
  a0: 53,
  //   isolation: 0.05,
  renderMode: "surface",
  //   sampler: "psi_2p_z",
  // sampler: "2p_x",
  // sampler: "1s",
  sampler: "3p_x",
  // sampler: "3d_xy",
  samplerMode: "waveFunction",
};

const coordMultiplier = 1e-3;
const bohrMultiplier = 1e-3;
const isoMultiplier = 1;

// const coordMultiplier = 1;
// const bohrMultiplier = 1;
// const isoMultiplier = 1e4;

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
let labels: CSS2DObject[] = [];

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
  gui.add(params, "mcSize", 2, 6000, 2).name("Marching cube size").onChange(
    rebuild,
  );
  gui.add(params, "resolution", 6, 96, 2).name("Resolution").onChange(rebuild);
  gui.add(params, "isolation", 0.01, 0.5, 0.01).name("Isolation")
    .onChange(rebuild);
  gui.add(params, "a0", 1, 100, 1).name("a0").onChange(rebuild);
  gui.add(params, "renderMode", ["surface", "points"]).name("Render mode")
    .onChange(rebuild);
  gui.add(params, "samplerMode", ["waveFunction", "probabilityDensity"])
    .name("Sampler mode")
    .onChange(rebuild);
  gui.add(params, "sampler", Object.keys(samplers)).name("Sampler")
    .onChange(rebuild);
  //   gui.add(params, "rebuild").name("Rebuild");

  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.01,
    20000,
  );
  camera.position.set(0, 0, params.mcSize * 2);

  const controls = new OrbitControls(camera, renderer.domElement);

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
    size: 10,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    depthWrite: false,
  });
  points = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(points);

  rebuild();

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
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

type PlotFunction = (x: number, y: number, z: number) => [number, number];

function plot(
  scene: THREE.Scene,
  pointGeometry: THREE.BufferGeometry,
) {
  disposeMesh(mcPos);
  disposeMesh(mcNeg);
  disposeMesh(mcOutline);
  disposeMesh(sampleAreaOutline);
  labels.forEach((label) => {
    label.removeFromParent();
  });
  labels = [];

  const halfSize = params.mcSize / 2;
  ([
    [new THREE.Vector3(halfSize, -halfSize - 1.5, halfSize), `${halfSize} pm`],
    [
      new THREE.Vector3(-halfSize, -halfSize - 1.5, halfSize),
      `-${halfSize} pm`,
    ],
  ] as const).forEach(([pos, textContent]) => {
    const text = document.createElement("div");
    text.className = "label";
    text.style.color = "rgb(255,0,0)";
    text.style.fontSize = "18px";
    text.textContent = textContent;
    const label = new CSS2DObject(text);
    label.position.copy(pos);
    scene.add(label);
    labels.push(label);
  });

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
    // return ((c - params.resolution / 2) * step + step / 2);
    return ((c - params.resolution / 2) * step + step / 2) * coordMultiplier;
  }

  samplers = { ...createWaveFunctions(params.a0 * bohrMultiplier) };
  const func: PlotFunction = (x: number, y: number, z: number) => {
    const v = samplers[params.sampler](x, y, z) * isoMultiplier;
    return [params.samplerMode === "waveFunction" ? v : v * v, v];
  };
  let i = 0;
  const startI = 0;

  const foo = params.resolution / 2;
  // const foo = 0;

  // [foo, foo, foo].forEach((c) => {console.log(adjustCoord(c)));
  // console.log(adjustCoord(3));

  const dx = adjustCoord(foo);
  const dy = adjustCoord(foo);
  const dz = adjustCoord(foo);
  const v = func(dx, dy, dz);

  // console.log(step);
  // console.log("x", foo);
  // console.log("dx", dx);
  // console.log("v", v);
  // console.log("adjustCoord", adjustCoord(31));

  let minV: number | undefined;
  let minVector = [0, 0, 0];
  let maxV: number | undefined;
  let maxVector = [0, 0, 0];

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

        const [v, origV] = func(dx, dy, dz);

        if (x === 300) {
          console.log("wtf");
        }

        if (!minV || v < minV) {
          minV = v;
          minVector = [x, y, z];
        } else if (!maxV || v > maxV) {
          maxV = v;
          maxVector = [x, y, v];
        }
        // minV = v < minV ? v : minV;
        // maxV = v > maxV ? v : maxV;

        // console.log(dx, dy, dz);
        // console.log(v);

        if (params.renderMode === "surface") {
          if (params.samplerMode === "waveFunction") {
            mcPos.field[i] = v;
            mcNeg.field[i] = -v;
          } else {
            if (origV > 0) {
              mcPos.field[i] = v;
            } else {
              mcNeg.field[i] = v;
            }
          }
          // if (vt > 0) {
          //   mcPos.field[i] = v;
          // } else {
          //   mcNeg.field[i] = Math.abs(v);
          // }
          // // mcPos.field[i] = v * v;
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

  console.log("minV", minV, minVector);
  console.log("maxV", maxV, maxVector);

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

  // const foor = mcPos.positionArray.filter((v) => v !== 0);
  // console.log(Math.min(...foor) * params.mcSize / 2);
  // console.log(Math.max(...foor) * params.mcSize / 2);
  // console.log(mcPos.position);
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

// function allNegative(x: number, y: number, z: number): number {
//   return x < 0 && y < 0 && z < 0 ? 1 : 0;
// }
