import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { Ball, Stick } from "./types.ts";
import { getMinMaxDimensions } from "./latticeHelpers.ts";

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 800;

export type RenderingContext = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  structure: THREE.Group;
  outline: THREE.LineSegments;
  transformControls: TransformControls;
};

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  balls: Ball[],
  sticks: Stick[],
  showOutline: boolean,
  showBallAndStick: boolean,
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

  const structure = getStructure(balls, sticks, showBallAndStick);
  const outline = getOutline(balls);

  if (showOutline) {
    structure.add(outline);
  }

  scene.add(structure);

  const transformControls = new TransformControls(camera, renderer.domElement);

  transformControls.attach(structure);
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

  return { scene, camera, structure, outline, transformControls };
}

const sphereGeometries: Record<string, THREE.SphereGeometry> = {};

function getSphereGeometry(radius: number) {
  if (!sphereGeometries[radius]) {
    sphereGeometries[radius] = new THREE.SphereGeometry(radius);
  }

  return sphereGeometries[radius];
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

const stickMaterial = new THREE.MeshPhongMaterial({
  color: "gray",
});

function createStick(
  start: THREE.Vector3,
  end: THREE.Vector3,
) {
  const radius = 10;

  const distance = start.distanceTo(end);
  const cylinderGeometry = new THREE.CylinderGeometry(
    radius,
    radius,
    distance,
    16,
  );
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, stickMaterial);

  cylinderMesh.position.copy(start);
  cylinderMesh.lookAt(end);
  // Rotate the cylinder by 90 degrees around the X-axis to align it with the z-axis.
  cylinderMesh.rotateX(Math.PI * 0.5);
  // Translate the cylinder up by half its height to center it on the line between points A and B.
  cylinderMesh.translateY(distance * 0.5);
  return cylinderMesh;
}

export function getStructure(
  balls: Ball[],
  sticks: Stick[],
  showBallAndStick: boolean,
) {
  const structure = new THREE.Group();
  balls.forEach((ball) => {
    const visibleRadius = showBallAndStick ? ball.radius / 2 : ball.radius;
    const ballMesh = new THREE.Mesh(
      getSphereGeometry(visibleRadius),
      getMeshPhongMaterial(ball),
    );
    ballMesh.position.copy(ball.position);
    structure.add(ballMesh);
  });

  if (showBallAndStick) {
    sticks.forEach(({ start, end }) => {
      structure.add(createStick(start, end));
    });
  }

  return structure;
}

export function getOutline(balls: Ball[]) {
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
