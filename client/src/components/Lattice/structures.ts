import { start } from "node:repl";
import * as THREE from "three";

const R = 1;

function getCubicPositions(ballMap: number[][][], size: number) {
  const positions: THREE.Vector3[] = [];

  function getStartValue(length: number) {
    return -(length - 1) / 2;
    // return 0;
  }
  let y = getStartValue(ballMap.length);
  ballMap.forEach((layer) => {
    let z = getStartValue(layer.length);
    layer.forEach((row) => {
      let x = getStartValue(row.length);
      row.forEach((hasBall) => {
        if (hasBall) {
          const position = new THREE.Vector3(x, y, z);
          position.multiplyScalar(size);
          positions.push(position);
        }
        x++;
      });
      z++;
    });
    y++;
  });

  return positions;
}

const pcBallsA = [
  [1, 1],
  [1, 1],
];
const pcBallMap = [
  pcBallsA,
  pcBallsA,
];
const PC = getCubicPositions(
  pcBallMap,
  2,
);

const bccBallsA = [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
];
const bccBallsB = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
const bccBallMap = [bccBallsA, bccBallsB, bccBallsA];
const BCC = getCubicPositions(bccBallMap, 2 / Math.sqrt(3));

const A = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
];
const B = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0],
];
const fccBallMap = [A, B, A];
const FCC = getCubicPositions(fccBallMap, Math.SQRT2);

function getHexagonalPositions(
  ballMap: number[][][],
  sizeX: number,
  sizeY: number,
  sizeZ: number,
) {
  const offsetXB = -0.34;
  const positions: THREE.Vector3[] = [];

  function getStartValue(length: number) {
    return -(length - 1) / 2;
  }
  let y = getStartValue(ballMap.length);
  ballMap.forEach((layer, i) => {
    let z = getStartValue(layer.length);
    layer.forEach((row) => {
      const offsetX = i === 1 ? offsetXB : 0;
      let x = getStartValue(row.length) + offsetX;
      row.forEach((hasBall) => {
        if (hasBall) {
          const position = new THREE.Vector3(sizeX * x, sizeY * y, sizeZ * z);
          // position.multiplyScalar(sizeX);
          positions.push(position);
        }
        x++;
      });
      z++;
    });
    y++;
  });

  return positions;
}

// const hcpLayerA = [
//   [0, 0, 1, 0, 0],
//   [1, 0, 0, 0, 1],
//   [0, 0, 1, 0, 0],
//   [1, 0, 0, 0, 1],
//   [0, 0, 1, 0, 0],
// ];

const hcpLayerA = [
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0],
];

// const hcpLayerB = [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0],
//   [0, 0, 0, 1, 0],
//   [0, 0, 0, 0, 0],
// ];

const hcpLayerB = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0],
];

function triangleHeight(sideLength: number) {
  return sideLength * Math.sqrt(3) / 2;
  // return sideLength * Math.sin(Math.PI / 3);
}

function tetrahedronHeight(edgeLength: number) {
  return edgeLength * Math.sqrt(2 / 3);
}

// const x = Math.sin(Math.PI / 3);
const x = triangleHeight(2 * R) / 2;
// const y = Math.sqrt(3);
// const y = 1.5;
// const y = 1.7;
// const y = 2 * Math.sin(Math.acos(1 / (2 * Math.sin(Math.PI / 3))));
// const y = 2 * Math.sqrt(6) / 3; // according to wiki (https://en.wikipedia.org/wiki/Close-packing_of_equal_spheres)
const y = tetrahedronHeight(2 * R); // According to wiki: https://en.wikipedia.org/wiki/Tetrahedron
const z = R;
const hcpBallMap = [
  hcpLayerA,
  // hcpLayerB,
];

function centerVectorArray(vectors: THREE.Vector3[]) {
  const max = new THREE.Vector3();
  vectors.forEach((v) => {
    if (v.x > max.x) {
      max.x = v.x;
    }
    if (v.y > max.y) {
      max.y = v.y;
    }
    if (v.z > max.z) {
      max.z = v.z;
    }
  });

  const adjustment = new THREE.Vector3();
  adjustment.copy(max).multiplyScalar(-1 / 2);

  vectors.forEach((v) => v.add(adjustment));
}

function getHCP() {
  const HCP: THREE.Vector3[] = [];
  const layerA = {
    rows: 2,
    cols: 2,
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetIncrementX: R,
  };
  const layerB = {
    rows: 1,
    cols: 1,
    startX: R,
    startZ: R * Math.sqrt(3) / 3,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetIncrementX: 0,
  };

  const layers = [layerA, layerB];

  const offsetIncrementY = tetrahedronHeight(2 * R);
  for (let i = 0; i < layers.length; i++) {
    const y = i * offsetIncrementY;
    const layer = layers[i];
    for (let row = 0; row < layer.rows; row++) {
      for (let col = 0; col < layer.cols; col++) {
        HCP.push(
          new THREE.Vector3(
            layer.startX + row * layer.offsetIncrementX +
              col * layer.distanceX,
            y,
            layer.startZ + row * layer.distanceZ,
          ),
        );
      }
    }
  }

  // HCP.push(
  //   new THREE.Vector3(
  //     R,
  //     tetrahedronHeight(2 * R),
  //     R * Math.sqrt(3) / 3,
  //   ),
  // );

  centerVectorArray(HCP);

  return HCP;
}

// const HCP = getHexagonalPositions(hcpBallMap, x, y, z);
const HCP = getHCP();

export const unitCells = {
  PC,
  BCC,
  FCC,
  HCP,
} as const;

export type UnitCell = keyof typeof unitCells;
