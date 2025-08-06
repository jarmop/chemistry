import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { Ball } from "./structures.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 800;
const posMultiplier = 100;
const scaleMultiplier = 100;

export type RenderingContext = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  molecule: THREE.Group;
  transformControls: TransformControls;
};

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  balls: Ball[],
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(FOV, width / height, near, far);
  camera.position.z = zoom;

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  controls.rotateSpeed = 5;
  controls.noPan = true;
  controls.noRotate = true;

  const scene = new THREE.Scene();

  const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(-1, -1, 1);
  scene.add(light2);

  const molecule = getMolecule(balls);

  scene.add(molecule);

  const transformControls = new TransformControls(camera, renderer.domElement);

  transformControls.attach(molecule);
  transformControls.setMode("rotate");
  transformControls.setSize(2);
  transformControls.enabled = false;

  const gizmo = transformControls.getHelper();
  gizmo.visible = false;
  scene.add(gizmo);

  renderer.setSize(width, height);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  globalThis.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "r") {
        gizmo.visible = true;
        transformControls.enabled = true;
      }
    },
  );

  globalThis.addEventListener(
    "keyup",
    (e) => {
      if (e.key === "r") {
        gizmo.visible = false;
        transformControls.enabled = false;
      }
    },
  );

  container.appendChild(renderer.domElement);

  return { scene, camera, molecule, transformControls };
}

const sphereGeometry = new THREE.SphereGeometry();

const colors: Record<string, THREE.MeshPhongMaterial> = {};

function getMeshPhongMaterial(ball: Ball) {
  if (!colors[ball.color]) {
    colors[ball.color] = new THREE.MeshPhongMaterial({
      color: ball.color || "red",
    });
  }
  return colors[ball.color];
}

export function getMolecule(balls: Ball[]) {
  const molecule = new THREE.Group();
  balls.forEach((ball) => {
    const ballMesh = new THREE.Mesh(
      sphereGeometry,
      getMeshPhongMaterial(ball),
    );
    ballMesh.position.copy(ball.position);
    ballMesh.position.multiplyScalar(posMultiplier);
    ballMesh.scale.multiplyScalar(scaleMultiplier);
    molecule.add(ballMesh);
  });

  return molecule;
}
