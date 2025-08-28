import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { DoubleSide } from "three";

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
  const resolution = 96; // grid size
  const material = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    shininess: 10,
    side: DoubleSide,
  });
  const mc = new MarchingCubes(resolution, material, true, true, 300000);
  mc.isolation = 0.9; // threshold value
  const scl = 1;
  mc.scale.set(scl, scl, scl);
  // const pos = scl / 2
  const pos = 1;
  mc.position.set(pos, pos, pos);
  scene.add(mc);

  const axes = new THREE.AxesHelper(2.0);
  axes.material.transparent = true;
  axes.material.opacity = 0.25;
  scene.add(axes);

  const pointGeometry = new THREE.BufferGeometry();
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointGeometry, pointMaterial);
  // points.position.set(0, 0, 0);
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
    const { field, resolution } = mc;
    const cx = resolution / 2;
    const cy = resolution / 2;
    const cz = resolution / 2;
    const radius = resolution / 3;
    const r2 = radius * radius;

    console.log(radius);

    const min = 0;
    const max = resolution / 2;
    function isValid(c: number) {
      return c >= min && c <= max;
    }

    let i = 0;
    for (let z = 0; z < resolution; z++) {
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++, i++) {
          // const dx = x - cx;
          // const dy = y - cy;
          // const dz = z - cz;
          const dx = x;
          const dy = y;
          const dz = z;
          const dist2 = dx * dx + dy * dy + dz * dz;

          // inside sphere → higher values
          // const v = dist2 < r2 ? 1 : 0;
          // const v = x < radius && y < radius && z < radius ? 1 : 0;
          const v = [x, y, z].every(isValid) ? 1 : 0;
          field[i] = v;

          const idx = i * 3;
          // positions[idx] = x / resolution;
          // positions[idx + 1] = y / resolution;
          // positions[idx + 2] = z / resolution;

          // if (v) {
          //   positions[idx] = dx / resolution * 2;
          //   positions[idx + 1] = dy / resolution * 2;
          //   positions[idx + 2] = dz / resolution * 2;

          //   colors[idx] = 255; // R
          //   colors[idx + 1] = 0; // G
          //   colors[idx + 2] = 0; // B
          // }

          positions[idx] = dx / resolution * 2;
          positions[idx + 1] = dy / resolution * 2;
          positions[idx + 2] = dz / resolution * 2;

          if (v) {
            colors[idx] = 255; // R
            colors[idx + 1] = 0; // G
          } else {
            colors[idx] = 0; // R
            colors[idx + 1] = 255; // G
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

    console.log(field.length);

    mc.update();
  }

  fillField();

  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
