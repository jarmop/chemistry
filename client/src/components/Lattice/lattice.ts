import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { UnitCell, unitCells } from "./structures.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 600;
const posMultiplier = 100;
const scaleMultiplier = 100;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  unitCell: UnitCell = "FCC",
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(FOV, width / height, near, far);
  camera.position.z = zoom;

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls = new ArcballControls(camera, renderer.domElement);
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 2000;
  controls.rotateSpeed = 5;

  const scene = new THREE.Scene();

  // const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.IcosahedronGeometry(1, 3);

  const material = new THREE.MeshNormalMaterial();

  const ballPositions = unitCells[unitCell];

  ballPositions.forEach((pos) => {
    const ball = new THREE.Mesh(geometry, material);
    ball.position.copy(pos);
    ball.position.multiplyScalar(posMultiplier);
    ball.scale.multiplyScalar(scaleMultiplier);
    scene.add(ball);
  });

  renderer.setSize(width, height);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  container.appendChild(renderer.domElement);
}
