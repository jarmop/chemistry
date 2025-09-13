import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  degreeToRadius,
  getPointOnSphereSurface,
  radiusToDegree,
} from "../Structure3D/common/latticeHelpers.ts";
import { Element, elementMap } from "../../data/elements.ts";

// const BOHR_RADIUS = 5.29177210903e-11; // meters

let scene: THREE.Scene;

const size = 280;

let molecule: THREE.Group;

export function init(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  name: Molecule["name"],
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
    size * 4,
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

  molecule = getMolecule(name, useRealRadius);

  scene.add(molecule);

  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  return {
    rebuild: (name: Molecule["name"], useRealRadius: boolean) => {
      disposeMesh(molecule);
      molecule = getMolecule(name, useRealRadius);
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
type Atom = Atoms[number];
type AtomMap = Record<Atom["id"], Atom & Element & { radius: number }>;

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

const methane = {
  formula: "CH4",
  name: "Methane",
  center: atomMap["C"],
  connections: [
    {
      polarAngle: 180,
      azimuthalAngle: 0,
      atom: atomMap["H"],
      bondLength: 108.7,
      connections: [],
    },
    ...[0, 120, 240].map((azimuthalAngle) => (
      {
        polarAngle: 180 - 109.5,
        azimuthalAngle: azimuthalAngle + 90,
        atom: atomMap["H"],
        bondLength: 108.7,
        connections: [],
      }
    )),
  ],
};

const ammoniaPolarAngle = 180 -
  radiusToDegree(Math.acos(Math.cos(degreeToRadius(107.8))));

const molecules = [
  {
    formula: "H2O",
    name: "Water",
    center: atomMap["O"],
    connections: [0, 180].map((azimuthalAngle) => (
      {
        polarAngle: 106.7 / 2,
        azimuthalAngle: azimuthalAngle,
        atom: atomMap["H"],
        bondLength: 95.84,
        connections: [],
      }
    )),
  },
  {
    formula: "NH3",
    name: "Ammonia",
    center: atomMap["N"],
    connections: [0, 120, 240].map((azimuthalAngle) => (
      {
        polarAngle: ammoniaPolarAngle,
        azimuthalAngle: azimuthalAngle + 90,
        atom: atomMap["H"],
        bondLength: 95.84,
        connections: [],
      }
    )),
  },
  {
    formula: "HCOOH",
    name: "Formic acid (Carboxylic acid)",
    center: atomMap["C"],
    connections: [
      {
        polarAngle: 180,
        azimuthalAngle: 0,
        atom: atomMap["O"],
        bondLength: 121,
        connections: [],
      },
      {
        polarAngle: 180 - 124,
        azimuthalAngle: 0,
        atom: atomMap["O"],
        bondLength: 136,
        connections: [{
          polarAngle: 180 - 108 / 2,
          azimuthalAngle: 0,
          atom: atomMap["H"],
          bondLength: 96,
        }],
      },
      {
        polarAngle: 180 - 113,
        azimuthalAngle: 180,
        atom: atomMap["H"],
        bondLength: 110,
        connections: [],
      },
    ],
  },
  methane,
  {
    formula: "C3H7NO2",
    name: "Alanine",
    center: atomMap["C"],
    connections: [
      {
        polarAngle: 180,
        azimuthalAngle: 0,
        atom: atomMap["O"],
        bondLength: 121,
        connections: [],
      },
      {
        polarAngle: 180 - 124,
        azimuthalAngle: 0,
        atom: atomMap["O"],
        bondLength: 136,
        connections: [{
          polarAngle: 180 - 108 / 2,
          azimuthalAngle: 0,
          atom: atomMap["H"],
          bondLength: 96,
        }],
      },
      {
        polarAngle: 180 - 113,
        azimuthalAngle: 180,
        atom: atomMap["C"],
        bondLength: 110,
        connections: [{
          polarAngle: 106.7 / 2,
          azimuthalAngle: 0,
          atom: atomMap["H"],
          bondLength: 96,
        }],
      },
    ],
  },
] as const;

type Molecules = typeof molecules;
export type Molecule = Molecules[number];
type MoleculeMap = Record<Molecule["name"], Molecule>;

export const moleculeNames = molecules.map((m) => m.name);

const moleculeMap = molecules.reduce((acc, curr) => {
  acc[curr.name] = curr;
  return acc;
}, {} as MoleculeMap);

function getMolecule(name: Molecule["name"], useRealRadius: boolean) {
  function getRadius(radius: number) {
    return useRealRadius ? radius : getReducedRadius(radius);
  }

  const moleculeData = moleculeMap[name];
  //   const moleculeData = moleculeMap["NH3"];
  //   const moleculeData = moleculeMap["HCOOH"];
  const molecule = new THREE.Group();
  const center = createBall(
    getRadius(moleculeData.center.radius),
    moleculeData.center.color,
  );
  molecule.add(center);

  const stickRadius = 5;

  moleculeData.connections.forEach((connection) => {
    const atom = createBall(
      getRadius(connection.atom.radius),
      connection.atom.color,
    );
    atom.position.copy(
      getPointOnSphereSurface(
        center.position,
        connection.bondLength,
        connection.polarAngle,
        connection.azimuthalAngle,
      ),
    );
    const stick = createStick(
      stickRadius,
      center.position,
      atom.position,
    );
    molecule.add(atom);
    molecule.add(stick);

    // const additionalConnections = connection.connections;

    const parentAtom = atom;

    connection.connections.forEach((connection) => {
      const atom = createBall(
        getRadius(connection.atom.radius),
        connection.atom.color,
      );
      atom.position.copy(
        getPointOnSphereSurface(
          parentAtom.position,
          connection.bondLength,
          connection.polarAngle,
          connection.azimuthalAngle,
        ),
      );
      const stick = createStick(
        stickRadius,
        parentAtom.position,
        atom.position,
      );
      molecule.add(atom);
      molecule.add(stick);
    });
  });

  return molecule;
}
