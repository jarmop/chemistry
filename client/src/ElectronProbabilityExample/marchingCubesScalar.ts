import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { MarchingCubes } from "../library/SimpleMarchingCubes/SimpleMarchingCubes.ts";

export function init(
  app: HTMLDivElement,
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  app.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0x404040));

  // Marching cubes object
  const resolution = 6; // grid size
  const min = 2;
  const max = resolution - 3;
  function isValid(x: number, y: number, z: number) {
    return [x, y, z].every((c) => c >= min && c <= max);
    // return true;
  }
  const material = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    // shininess: 10,
    // side: DoubleSide,
  });
  const mc = new MarchingCubes(
    resolution,
    material,
    //  true,
    //  true,
    //  300000
  );
  mc.isolation = 0.9; // threshold value
  const scl = 1;
  mc.scale.set(scl, scl, scl);
  const mcSize = scl * 2;
  const pos = mcSize / resolution / 2;
  mc.position.set(pos, pos, pos);
  scene.add(mc);

  const axes = new THREE.AxesHelper(2.0);
  axes.material.transparent = true;
  axes.material.opacity = 0.25;
  scene.add(axes);

  const pointGeometry = new THREE.BufferGeometry();
  // pointGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1);
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointGeometry, pointMaterial);
  points.position.set(pos, pos, pos);
  scene.add(points);

  const boxSize = 2;
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(boxSize, boxSize, boxSize),
    // new THREE.MeshBasicMaterial({ color: "red" }),
    material,
  );
  cube.position.set(3, 0, 0);
  scene.add(cube);

  const posN = Math.pow(resolution, 3) * 3;
  const positions = new Float32Array(posN);
  const colors = new Float32Array(posN);

  // Fill the field with values representing a sphere
  function fillField() {
    const { field } = mc;

    // const maxAbsC = resolution - 3;
    const maxAbsC = resolution;

    const cx = maxAbsC / 2;
    const cy = maxAbsC / 2;
    const cz = maxAbsC / 2;
    const radius = maxAbsC / 3;
    const r2 = radius * radius;

    // console.log(radius);

    const testCubes = [
      // res 6
      [43, 44, 49, 50, 79, 80, 85, 86],
      [44, 45, 50, 51, 80, 81, 86, 87],
      [45, 46, 51, 52, 81, 82, 87, 88],
      [49, 50, 55, 56, 85, 86, 91, 92],
      // // res 10
      // [111, 112, 121, 122, 211, 212, 221, 222],
      // [112, 113, 122, 123, 212, 213, 222, 223],
      // res 20
      // [421, 422, 441, 442, 821, 822, 841, 842],
      // [422, 423, 442, 443, 822, 823, 842, 843],
    ];
    const testCubes1D = testCubes.flat();

    function shouldColorI(i: number) {
      return testCubes1D.includes(i);
    }

    let i = 0;
    for (let z = 0; z < maxAbsC; z++) {
      for (let y = 0; y < maxAbsC; y++) {
        for (let x = 0; x < maxAbsC; x++, i++) {
          const dx = x - cx;
          const dy = y - cy;
          const dz = z - cz;
          // const dx = x;
          // const dy = y;
          // const dz = z;
          const dist2 = dx * dx + dy * dy + dz * dz;

          // inside sphere → higher values
          // const v = dist2 < r2 ? 1 : 0;
          // const v = x < radius && y < radius && z < radius ? 1 : 0;
          const v = isValid(x, y, z) ? 1 : 0;
          field[i] = v;

          const idx = i * 3;
          // positions[idx] = x / resolution;
          // positions[idx + 1] = y / resolution;
          // positions[idx + 2] = z / resolution;

          // if (v) {
          // if (shouldColorI(i)) {
          //   positions[idx] = dx / maxAbsC * 2;
          //   positions[idx + 1] = dy / maxAbsC * 2;
          //   positions[idx + 2] = dz / maxAbsC * 2;

          //   colors[idx] = 255; // R
          //   colors[idx + 1] = 0; // G
          //   colors[idx + 2] = 0; // B
          // }

          positions[idx] = dx / maxAbsC * 2;
          positions[idx + 1] = dy / maxAbsC * 2;
          positions[idx + 2] = dz / maxAbsC * 2;

          // // if (v) {
          if (shouldColorI(i)) {
            colors[idx] = 1; // R
            colors[idx + 1] = 0; // G
          } else {
            colors[idx] = 0; // R
            colors[idx + 1] = 0.05; // G
          }
          colors[idx + 2] = 0; // B
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

    // console.log(field.length);

    // console.log("wtf");

    mc.update();
    // console.log("wtf 2");

    const le = Math.pow(maxAbsC, 3);

    // console.log(mc.positionArray);
    // console.log(mc.positionArray[0]);
    // console.log(mc.positionArray[mc.positionArray.length - 1]);
    // console.log(mc.positionArray[le - 1]);
    // console.log(mc.positionArray[le]);
    // console.log(mc.positionArray.length);

    const foo = mc.positionArray.filter((v) => v !== 0);

    console.log("resolution * 3", le);
    console.log("764 * 9", 764 * 9);

    // console.log("foo.length", foo.length);
    // console.log("mc.positionArray.length", mc.positionArray.length);

    // console.log(foo[foo.length - 1]);
    // console.log("---");

    console.log(Math.min(...foo));
    console.log(Math.max(...foo));
  }

  fillField();

  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

// export function getOutline(mc: MarchingCubes) {
//   const foo = mc.positionArray.filter((v) => v !== 0);
//   const min = Math.min(...foo);
//   const max = Math.max(...foo);

//   const dimensions = (new THREE.Vector3()).copy(min).multiplyScalar(-1).add(
//     max,
//   );

//   const geometry = new THREE.BoxGeometry(
//     ...dimensions,
//   );
//   const edges = new THREE.EdgesGeometry(geometry);
//   const outline = new THREE.LineSegments(
//     edges,
//     new THREE.LineBasicMaterial({ color: 0xffffff }),
//   );

//   return outline;
// }
