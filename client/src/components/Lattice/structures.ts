import * as THREE from "three";

const R = 1;

type Ball = { position: THREE.Vector3; color: string };

function getCubicPositions(ballMap: number[][][], size: number) {
  const positions: Ball[] = [];

  function getStartValue(length: number) {
    return -(length - 1) / 2;
    // return 0;
  }
  let y = getStartValue(ballMap.length);
  ballMap.forEach((layer, i) => {
    const color = i % 2 === 0 ? "red" : "blue";
    let z = getStartValue(layer.length);
    layer.forEach((row) => {
      let x = getStartValue(row.length);
      row.forEach((hasBall) => {
        if (hasBall) {
          const position = new THREE.Vector3(x, y, z);
          position.multiplyScalar(size);
          positions.push({ position, color });
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

function triangleHeight(sideLength: number) {
  return sideLength * Math.sqrt(3) / 2;
  // return sideLength * Math.sin(Math.PI / 3);
}

function tetrahedronHeight(edgeLength: number) {
  return edgeLength * Math.sqrt(2 / 3);
}

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
  const HCP: Ball[] = [];
  const layerA = {
    rows: [2, 3, 2],
    cols: 2,
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [R, 0, R],
    color: "red",
  };
  const layerB = {
    rows: [1, 2],
    cols: 1,
    startX: R,
    startZ: R * Math.sqrt(3) / 3,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [R, 0],
    color: "blue",
  };

  const layers = [
    layerA,
    layerB,
    layerA,
  ];

  const offsetIncrementY = tetrahedronHeight(2 * R);
  for (let i = 0; i < layers.length; i++) {
    const y = i * offsetIncrementY;
    const layer = layers[i];
    const color = i % 2 === 0 ? "red" : "blue";
    for (let rowI = 0; rowI < layer.rows.length; rowI++) {
      const cols = layer.rows[rowI];
      for (let col = 0; col < cols; col++) {
        HCP.push({
          position: new THREE.Vector3(
            layer.startX + layer.offsetX[rowI] +
              col * layer.distanceX,
            y,
            layer.startZ + rowI * layer.distanceZ,
          ),
          color,
        });
      }
    }
  }

  // console.log(HCP.map((b) => b.position));

  centerVectorArray(HCP.map((b) => b.position));

  return HCP;
}

const HCP = getHCP();

export const unitCells = {
  PC,
  BCC,
  FCC,
  HCP,
} as const;

export type UnitCell = typeof unitCells;
