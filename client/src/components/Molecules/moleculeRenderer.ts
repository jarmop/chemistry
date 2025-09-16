import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Element, elementMap } from "../../data/elements.ts";
import { growMolecule } from "./growMolecule.ts";
import { AtomData } from "../AtomData.tsx";
import { getMolecule } from "./getMolecule.ts";

// const BOHR_RADIUS = 5.29177210903e-11; // meters

let scene: THREE.Scene;

const size = 280;

let molecule: THREE.Group;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  name: string,
  useRealRadius: boolean,
) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(240,240,240)");
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    size / 100,
    size * 10,
  );
  camera.position.set(0, 0, size * 2);

  const controls = new OrbitControls(camera, renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 1.8);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 2.7);
  dir.position.set(3, 3, 4);
  scene.add(dir);

  //   const axes = new THREE.AxesHelper(size / 2);
  //   axes.material.transparent = true;
  //   //   axes.material.opacity = 0.25;
  //   scene.add(axes);

  molecule = growMolecule(name, useRealRadius);

  scene.add(molecule);

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  return {
    rebuild: (name: string, useRealRadius: boolean) => {
      disposeMesh(molecule);
      molecule = getMoleculeMesh(name, useRealRadius);
      scene.add(molecule);
    },
  };
}

function disposeMesh<
  T extends {
    removeFromParent: () => void;
    // material: THREE.Material | THREE.Material[];
    // geometry: THREE.BufferGeometry;
  },
>(obj: T | undefined) {
  if (!obj) return;
  obj.removeFromParent();
  // if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  //   if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
  //   if (obj.geometry) obj.geometry.dispose?.();
}

function createBall(radius: number, color: THREE.ColorRepresentation) {
  const segments = 128;
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    new THREE.MeshPhongMaterial({
      color,
    }),
  );
}

const stickMaterial = new THREE.MeshPhongMaterial({
  color: "grey",
});

function createStick(
  radius: number,
  start: THREE.Vector3,
  end: THREE.Vector3,
) {
  const distance = start.distanceTo(end);
  const cylinderGeometry = new THREE.CylinderGeometry(
    radius,
    radius,
    distance,
    32,
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

const atoms = [
  {
    id: "H",
    color: "lightgrey",
  },
  {
    id: "C",
    color: "rgb(40,40,40)",
  },
  {
    id: "N",
    color: "blue",
  },
  {
    id: "O",
    color: "red",
  },
] as const;

type Atoms = typeof atoms;
type AtomData = Atoms[number];
type AtomMap = Record<string, AtomData & Element & { radius: number }>;

let realRadiusMin = 1000;
let realRadiusMax = 0;

const extendedAtoms = atoms.map((atom) => {
  const element = elementMap[atom.id];
  const radius = element.atomicRadius || 0;
  if (radius < realRadiusMin) {
    realRadiusMin = radius;
  } else if (radius > realRadiusMax) {
    realRadiusMax = radius;
  }
  return {
    ...atom,
    ...element,
    radius,
  };
});
const realRadiusRange = realRadiusMax - realRadiusMin;

const reducedRadiusMin = 15;
const reducedRadiusMax = Math.min(50, realRadiusMax);
const reducedRadiusRange = reducedRadiusMax - reducedRadiusMin;

function getReducedRadius(radius: number) {
  const relativeRadius = (radius - realRadiusMin) / realRadiusRange;
  return reducedRadiusMin + relativeRadius * reducedRadiusRange;
}

const atomMap = extendedAtoms.reduce((acc, atom) => {
  //   const reducedRadius = getReducedRadius(atom.radius);
  const reducedRadius = atom.atomicRadius || 0;
  acc[atom.id] = { ...atom, radius: reducedRadius };

  return acc;
}, {} as AtomMap);

function getMoleculeMesh(name: string, useRealRadius: boolean) {
  function getRadius(radius: number) {
    return useRealRadius ? radius : getReducedRadius(radius);
  }

  const moleculeData = getMolecule(name);

  const moleculeMesh = new THREE.Group();

  moleculeData.atoms.forEach((atom) => {
    const atomData = atomMap[atom.symbol];
    const atomMesh = createBall(
      getRadius(atomData.radius),
      atomData.color,
    );
    atomMesh.position.set(...atom.position);
    moleculeMesh.add(atomMesh);
  });

  function getPosition(id: number) {
    return moleculeData.atoms.find((a) => a.id === id)?.position || [0, 0, 0];
  }

  const stickRadius = 5;

  moleculeData.bonds.forEach((bond) => {
    const start = getPosition(bond.start);
    const end = getPosition(bond.end);

    const stick = createStick(
      stickRadius,
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    );
    moleculeMesh.add(stick);
  });

  return moleculeMesh;
}
