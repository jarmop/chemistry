import * as THREE from "three";
import GUI from "lil-gui";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { UnitCell, unitCells } from "./structures.ts";
import { centerGroup } from "./threeHelpers.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 600;
const posMultiplier = 100;
const scaleMultiplier = 100;

type HelperLight = THREE.HemisphereLight;

// class ColorGUIHelper {
//   object: HelperLight;
//   prop: "color" | "groundColor";

//   constructor(object: HelperLight, prop: typeof this.prop) {
//     this.object = object;
//     this.prop = prop;
//   }
//   get value() {
//     return `#${this.object[this.prop].getHexString()}`;
//   }
//   set value(hexString) {
//     this.object[this.prop].set(hexString);
//   }
// }

let pointerDown = false;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  unitCell: UnitCell = "FCC",
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(FOV, width / height, near, far);
  camera.position.z = zoom;
  // camera.position.x = 1600;
  // camera.position.y = 1600;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls = new ArcballControls(camera, renderer.domElement);
  const transformControls = new TransformControls(camera, renderer.domElement);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  controls.rotateSpeed = 5;
  controls.noPan = true;
  controls.noRotate = true;

  const scene = new THREE.Scene();

  //   const skyColor = 0xB1E1FF; // light blue
  //   const groundColor = 0xB97A20;
  //   const light = new THREE.HemisphereLight(skyColor, groundColor, 1);

  //   const gui = new GUI();
  //   gui.addColor(new ColorGUIHelper(light, "color"), "value").name("skyColor");
  //   gui.addColor(new ColorGUIHelper(light, "groundColor"), "value").name(
  //     "groundColor",
  //   );
  //   scene.add(light);

  const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(-1, -1, 1);
  scene.add(light2);

  // const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.IcosahedronGeometry(1, 3);

  //   const material = new THREE.MeshNormalMaterial();
  const material = new THREE.MeshPhongMaterial({
    color: "red",
  });

  const ballPositions = unitCells[unitCell];

  const molecule = new THREE.Group();
  ballPositions.forEach((pos) => {
    const ball = new THREE.Mesh(geometry, material);
    ball.position.copy(pos);
    ball.position.multiplyScalar(posMultiplier);
    ball.scale.multiplyScalar(scaleMultiplier);
    molecule.add(ball);
  });

  // console.log(molecule2.children.map((c) => {
  //   const v = new THREE.Vector3();
  //   c.getWorldPosition(v);
  //   return v;
  // }));

  // centerGroup(molecule2);

  // const molecule = new THREE.Group();
  // molecule2.children.forEach((c) => {
  //   const v = new THREE.Vector3();
  //   c.localToWorld(c.position);
  //   // c.worldToLocal(v);
  //   // console.log()
  //   // c.position.set(v.x)
  // });
  // const children = molecule2.children;
  // molecule.add(...children);

  // const boundingBox = new THREE.Box3();
  // boundingBox.setFromObject(molecule);
  // const sizeOfMolecule = new THREE.Vector3();
  // boundingBox.getSize(sizeOfMolecule);

  // console.log(sizeOfMolecule);
  // const centerOfMolecule = new THREE.Vector3();
  // centerOfMolecule.copy(sizeOfMolecule);

  // // centerOfMolecule.multiplyScalar(-1 / 4);
  // centerOfMolecule.multiplyScalar(-1 / 2);
  // const sizeOfFirstChild = new THREE.Vector3();
  // const firstChild = molecule.children[0];
  // boundingBox.setFromObject(firstChild);
  // boundingBox.getSize(sizeOfFirstChild);
  // // centerOfMolecule.add(sizeOfFirstChild);
  // centerOfMolecule.add(
  //   new THREE.Vector3(
  //     sizeOfFirstChild.x,
  //     sizeOfFirstChild.y,
  //     sizeOfFirstChild.z,
  //   ).multiplyScalar(1 / 2),
  // );

  // console.log(centerOfMolecule);
  // console.log(molecule.position);
  // // camera.lookAt(centerOfMolecule);

  // molecule.position.set(
  //   centerOfMolecule.x,
  //   centerOfMolecule.y,
  //   centerOfMolecule.z,
  // );

  // console.log(molecule.position);

  // molecule.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.17);
  // molecule.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  // const dragControls = new DragControls(
  //   [molecule],
  //   camera,
  //   renderer.domElement,
  // );
  // dragControls.addEventListener("drag", function (e) {
  //   console.log("tyj");
  // });
  // dragControls.transformGroup = true;
  // dragControls.rotateSpeed = 2;

  scene.add(molecule);

  transformControls.attach(molecule);
  transformControls.setMode("rotate");
  transformControls.setSize(2);
  const gizmo = transformControls.getHelper();
  gizmo.visible = false;
  transformControls.enabled = false;
  scene.add(gizmo);

  // controls.attach(molecule);

  // controls.showX = true;
  // controls.showY = true;
  // controls.showZ = true;
  // gizmo.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 4);
  // gizmo.rotateOnAxis(new THREE.Vector3(1, 1, 0), Math.PI / 6);
  // gizmo.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
  // gizmo.rotation.set(Math.PI / 2, 0, 0);
  // gizmo.visible = false;
  // gizmo.position.set(width / 2, height / 2, 0);

  // controls.addEventListener("dragging-changed", function (event) {
  //   console.log(event);
  // });

  renderer.setSize(width, height);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  controls.addEventListener("change", () => {
    // controls.update();
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
