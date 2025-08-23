import {
  Camera,
  DirectionalLight,
  LatheGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
// import { TransformControls } from "three/addons/controls/TransformControls.js";
import { Ball } from "../Structure3D/common/types.ts";
import { Group } from "three";
import { DoubleSide } from "three";

export type RenderingContext = {
  scene: Scene;
  camera: Camera;
  group: Group;
  //   outline: LineSegments;
  //   transformControls: TransformControls;
};

const near = 1;
const far = 5000;
const FOV = 70;
const zoom = 1200;

const sphereGeometries: Record<string, SphereGeometry> = {};

function getSphereGeometry(radius: number) {
  if (!sphereGeometries[radius]) {
    sphereGeometries[radius] = new SphereGeometry(radius);
  }
  return sphereGeometries[radius];
}

const meshPhongMaterials: Record<string, MeshPhongMaterial> = {};

function getMeshPhongMaterial(color: string | number) {
  if (!meshPhongMaterials[color]) {
    meshPhongMaterials[color] = new MeshPhongMaterial({
      color: color || "red",
      side: DoubleSide,
    });
  }
  return meshPhongMaterials[color];
}

function getBallMesh(ball: Ball) {
  const ballMesh = new Mesh(
    getSphereGeometry(ball.radius),
    getMeshPhongMaterial(ball.color),
  );
  ballMesh.position.copy(ball.position);
  return ballMesh;
}

export function init(
  container: HTMLDivElement,
  renderer: WebGLRenderer,
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new PerspectiveCamera(FOV, width / height, near, far);
  camera.position.z = zoom;

  const trackBallControls = new TrackballControls(camera, renderer.domElement);
  trackBallControls.minDistance = near;
  trackBallControls.maxDistance = far;
  trackBallControls.rotateSpeed = 5;
  trackBallControls.noPan = true;
  trackBallControls.noRotate = true;

  const scene = new Scene();

  const light1 = new DirectionalLight(0xffffff, 2.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new DirectionalLight(0xffffff, 1.5);
  light2.position.set(-1, -1, 1);
  scene.add(light2);

  const group = new Group();

  const waveFunctionPoints = [
    new Vector2(0, -300),
    new Vector2(50, -290),
    new Vector2(110, -250),
    new Vector2(130, -170),
    new Vector2(90, -75),
    new Vector2(0, 0),
    new Vector2(90, 75),
    new Vector2(130, 170),
    new Vector2(110, 250),
    new Vector2(50, 290),
    new Vector2(0, 300),
  ];

  //   let str = "";
  //   waveFunctionPoints.toReversed().forEach((v) => {
  //     v.multiply(new Vector2(1, -1));
  //     str += `new Vector2(${v.x}, ${v.y}),`;
  //   });
  //   console.log(str);

  const foo = new Mesh(
    new LatheGeometry(waveFunctionPoints),
    // getMeshPhongMaterial(0x8B0000),
    getMeshPhongMaterial("red"),
  );

  group.add(foo);

  scene.add(group);

  renderer.setSize(width, height);
  renderer.setAnimationLoop(() => {
    trackBallControls.update();
    renderer.render(scene, camera);
  });

  container.appendChild(renderer.domElement);

  return { scene, camera, group };
}
