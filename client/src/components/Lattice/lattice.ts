import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;

// Initialization of renderer needs to be outside of the init function because
// React calls it multiple times
const renderer = new THREE.WebGLRenderer({ antialias: true });

let controls: TrackballControls;
// let controls: ArcballControls;
// let controls: OrbitControls;

export function init(
  container: HTMLDivElement,
) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const near = 1;
  const far = 5000;
  const posMultiplier = 100;
  const scaleMultiplier = 100;
  camera = new THREE.PerspectiveCamera(70, width / height, near, far);
  camera.position.z = 1000;

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls = new ArcballControls(camera, renderer.domElement);
  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 2000;
  controls.rotateSpeed = 5;

  scene = new THREE.Scene();

  // const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.IcosahedronGeometry(1, 3);

  // const color = new THREE.Color();
  // color.r = 100;
  // color.g = 100;
  // color.b = 100;
  // const material = new THREE.MeshPhongMaterial({ color: color });
  const material = new THREE.MeshNormalMaterial();

  const ballPositions = FCC;
  //   const ballPositions = PC;
  //   const ballPositions = BCC;
  ballPositions.forEach((pos) => {
    const ball = new THREE.Mesh(geometry, material);
    ball.position.copy(pos);
    ball.position.multiplyScalar(posMultiplier);
    ball.scale.multiplyScalar(scaleMultiplier);
    scene.add(ball);
  });

  renderer.setSize(width, height);
  renderer.setAnimationLoop(animate);

  container.appendChild(renderer.domElement);
}

function animate() {
  controls.update();

  renderer.render(scene, camera);
}

function getPositions(ballMap: number[][][], size: number) {
  const positions: THREE.Vector3[] = [];

  function getStartValue(length: number) {
    return -(length - 1) / 2;
  }
  let y = getStartValue(ballMap.length);
  ballMap.forEach((layer) => {
    let z = getStartValue(layer.length);
    layer.forEach((row) => {
      let x = getStartValue(row.length);
      row.forEach((hasBall) => {
        if (hasBall) {
          const position = new THREE.Vector3(x, y, z);
          position.multiplyScalar(size);
          positions.push(position);
        }
        x++;
      });
      z++;
    });
    y++;
  });

  return positions;
}

const A = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
];
const B = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0],
];
const fccBallMap = [A, B, A];
const FCC = getPositions(fccBallMap, Math.SQRT2);

const pcBallsA = [
  [1, 1],
  [1, 1],
];
const pcBallMap = [
  pcBallsA,
  pcBallsA,
];
const PC = getPositions(
  pcBallMap,
  2,
);

const bccBallsA = [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
];
const bccBallsB = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
const bccBallMap = [bccBallsA, bccBallsB, bccBallsA];
const BCC = getPositions(bccBallMap, 2 / Math.sqrt(3));
