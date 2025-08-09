import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { Ball } from "./types.ts";
import { getMinMaxDimensions } from "./latticeHelpers.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 800;

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
  controls.minDistance = near;
  controls.maxDistance = far;
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

const sphereGeometries: Record<string, THREE.SphereGeometry> = {};

function getSphereGeometry(ball: Ball) {
  if (!sphereGeometries[ball.radius]) {
    sphereGeometries[ball.radius] = new THREE.SphereGeometry(ball.radius);
  }

  return sphereGeometries[ball.radius];
}

const meshPhongMaterials: Record<string, THREE.MeshPhongMaterial> = {};

function getMeshPhongMaterial(ball: Ball) {
  if (!meshPhongMaterials[ball.color]) {
    meshPhongMaterials[ball.color] = new THREE.MeshPhongMaterial({
      color: ball.color || "red",
    });
  }
  return meshPhongMaterials[ball.color];
}

export function getMolecule(balls: Ball[]) {
  const molecule = new THREE.Group();
  balls.forEach((ball) => {
    const ballMesh = new THREE.Mesh(
      getSphereGeometry(ball),
      getMeshPhongMaterial(ball),
    );
    ballMesh.position.copy(ball.position);
    molecule.add(ballMesh);
  });

  molecule.add(getDimensions(balls));

  return molecule;
}

function getDimensions(balls: Ball[]) {
  const { min, max } = getMinMaxDimensions(
    balls.map((b) => b.position),
  );

  const dimensions = (new THREE.Vector3()).copy(min).multiplyScalar(-1).add(
    max,
  );

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
