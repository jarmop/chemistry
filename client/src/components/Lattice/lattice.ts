import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { UnitCell, unitCells } from "./structures.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 800;
const posMultiplier = 100;
const scaleMultiplier = 100;

let pointerDown = false;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  unitCellId: keyof UnitCell = "FCC",
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

  const icosahedron = new THREE.IcosahedronGeometry(1, 3);

  const unitCell = unitCells[unitCellId];

  const molecule = new THREE.Group();
  unitCell.forEach((ball) => {
    const ballMesh = new THREE.Mesh(
      icosahedron,
      new THREE.MeshPhongMaterial({
        color: ball.color || "red",
      }),
    );
    ballMesh.position.copy(ball.position);
    ballMesh.position.multiplyScalar(posMultiplier);
    ballMesh.scale.multiplyScalar(scaleMultiplier);
    molecule.add(ballMesh);
  });

  scene.add(molecule);

  const transformControls = new TransformControls(camera, renderer.domElement);

  transformControls.attach(molecule);
  transformControls.setMode("rotate");
  transformControls.setSize(2);
  const gizmo = transformControls.getHelper();
  gizmo.visible = false;
  transformControls.enabled = false;
  scene.add(gizmo);

  renderer.setSize(width, height);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  container.addEventListener("pointerdown", () => {
    pointerDown = true;
  });

  container.addEventListener("pointerup", () => {
    pointerDown = false;
  });

  renderer.domElement.addEventListener(
    "pointermove",
    (e) => {
      if (pointerDown && !transformControls.enabled) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        const rotateSpeed = Math.PI * 0.002;
        molecule.rotateOnWorldAxis(
          new THREE.Vector3(1, 0, 0),
          deltaY * rotateSpeed,
        );
        molecule.rotateOnWorldAxis(
          new THREE.Vector3(0, 1, 0),
          deltaX * rotateSpeed,
        );
      }
    },
  );

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
}
