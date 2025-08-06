import * as THREE from "three";

const R = 1;

export type Ball = { position: THREE.Vector3; color: string };

function getCubicBalls(ballMap: number[][][], size: number) {
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
const PC = getCubicBalls(
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
const BCC = getCubicBalls(bccBallMap, 2 / Math.sqrt(3));

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
const FCC = getCubicBalls(fccBallMap, Math.SQRT2);

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

type Layer = {
  rows: number[];
  startX: number;
  startZ: number;
  distanceX: number;
  distanceZ: number;
  offsetX: number[];
  color: string;
};

function getHexagonalBalls(layers: Layer[]) {
  const balls: Ball[] = [];
  const offsetIncrementY = tetrahedronHeight(2 * R);
  for (let i = 0; i < layers.length; i++) {
    const y = i * offsetIncrementY;
    const layer = layers[i];
    for (let rowI = 0; rowI < layer.rows.length; rowI++) {
      const cols = layer.rows[rowI];
      for (let col = 0; col < cols; col++) {
        balls.push({
          position: new THREE.Vector3(
            layer.startX + layer.offsetX[rowI] +
              col * layer.distanceX,
            y,
            layer.startZ + rowI * layer.distanceZ,
          ),
          color: layer.color,
        });
      }
    }
  }

  centerVectorArray(balls.map((b) => b.position));

  return balls;
}

function getHCP() {
  const layerA = {
    rows: [2, 3, 2],
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [R, 0, R],
    color: "red",
  };
  const layerB = {
    rows: [1, 2],
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

  return getHexagonalBalls(layers);
}

function getCCP() {
  const layerA = {
    rows: [2, 3, 2],
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [R, 0, R],
    color: "red",
  };
  const layerB = {
    rows: [2, 1],
    startX: R,
    startZ: 2 * R * Math.sqrt(3) / 3,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [0, R],
    color: "blue",
  };
  const layerC = {
    rows: [1, 2],
    startX: R,
    startZ: R * Math.sqrt(3) / 3,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [R, 0],
    color: "yellow",
  };

  const layers = [
    layerA,
    layerB,
    layerC,
    layerA,
  ];

  return getHexagonalBalls(layers);
}

function getCcpIsFcc() {
  const layerA = {
    rows: [1],
    startX: 2 * R,
    startZ: 4 * triangleHeight(2 * R) / 3,
    // startZ: 4 * R * Math.sqrt(3) / 3,
    distanceX: 0,
    distanceZ: 0,
    offsetX: [0],
    color: "red",
  };
  const layerB = {
    rows: [1, 2, 3],
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [2 * R, R, 0],
    color: "blue",
  };
  const layerC = {
    rows: [3, 2, 1],
    startX: 0,
    startZ: 2 * R * Math.sqrt(3) / 3,
    distanceX: 2 * R,
    distanceZ: triangleHeight(2 * R),
    offsetX: [0, R, 2 * R],
    color: "yellow",
  };

  const layers = [
    layerA,
    layerB,
    layerC,
    layerA,
  ];

  return getHexagonalBalls(layers);
}

export const structures = {
  PC,
  BCC,
  FCC,
  HCP: getHCP(),
  CCP: getCCP(),
  "CCP=FCC": getCcpIsFcc(),
} as const;

export type UnitCell = typeof structures;

const squareLayer = [[[1, 1], [1, 1]]];

const square = getCubicBalls(squareLayer, 2);

// Show what layers make up the structure
export const layers: Partial<Record<keyof UnitCell, Ball[]>> = { PC: square };

// Show how a single atom is connected to others
export const connections = {};
