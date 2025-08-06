import * as THREE from "three";

const R = 1;

export type Ball = { position: THREE.Vector3; color: string };

function triangleHeight(sideLength: number) {
  return sideLength * Math.sqrt(3) / 2;
  // return sideLength * Math.sin(Math.PI / 3);
}

function tetrahedronHeight(edgeLength: number) {
  return edgeLength * Math.sqrt(2 / 3);
}

function squareDiameterToSide(diameter: number) {
  return diameter / Math.SQRT2;
}

function cubeDiameterToEdge(diameter: number) {
  return diameter / Math.sqrt(3);
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

function getBalls(layers: Layer[], layerDistance: number = 0) {
  const balls: Ball[] = [];
  for (let i = 0; i < layers.length; i++) {
    const y = i * layerDistance;
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

function getHexagonalBalls(layers: Layer[]) {
  const layerDistance = tetrahedronHeight(2 * R);
  return getBalls(layers, layerDistance);
}

function getLayerBalls(layer: Layer) {
  const singleLayer = { ...layer, startX: 0, startZ: 0 };
  return getBalls([singleLayer]);
}

const hexagonLayer = {
  rows: [2, 3, 2],
  startX: 0,
  startZ: 0,
  distanceX: 2 * R,
  distanceZ: triangleHeight(2 * R),
  offsetX: [R, 0, R],
  color: "red",
};

function getHCP() {
  const layerA = hexagonLayer;
  const layerB = {
    ...hexagonLayer,
    rows: [1, 2],
    startX: R,
    startZ: R * Math.sqrt(3) / 3,
    offsetX: [R, 0],
    color: "blue",
  };

  const layers = [
    layerA,
    layerB,
    layerA,
  ];

  return {
    unitCell: getHexagonalBalls(layers),
    layer: getLayerBalls(hexagonLayer),
  };
}

function getCCP() {
  const layerA = hexagonLayer;
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

  return {
    unitCell: getHexagonalBalls(layers),
    layer: getLayerBalls(hexagonLayer),
  };
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

  return {
    unitCell: getHexagonalBalls(layers),
    layer: getLayerBalls(hexagonLayer),
  };
}

function getLayer(layer: Partial<Layer>): Layer {
  const defaultLayer = {
    rows: [],
    startX: 0,
    startZ: 0,
    distanceX: 2 * R,
    distanceZ: 2 * R,
    offsetX: layer.rows?.map((_) => 0) || [],
    color: "red",
  };

  return { ...defaultLayer, ...layer };
}

function getPC() {
  const layerA = getLayer({
    rows: [2, 2],
  });

  return {
    unitCell: getBalls([layerA, layerA], 2),
    layer: getLayerBalls(layerA),
  };
}

function getBCC() {
  const distance = cubeDiameterToEdge(2 * R);

  const layerA = getLayer({
    rows: [2, 2],
    distanceX: 2 * distance,
    distanceZ: 2 * distance,
  });

  const layerB = getLayer({
    rows: [1],
    startX: distance,
    startZ: distance,
    color: "blue",
  });

  return {
    unitCell: getBalls([layerA, layerB, layerA], distance),
    layer: getLayerBalls(layerA),
  };
}

function getFCC() {
  const distance = squareDiameterToSide(2 * R);

  const layerA = getLayer({
    rows: [2, 2],
    distanceX: 2 * distance,
    distanceZ: 2 * distance,
  });

  const layerB = getLayer({
    rows: [1, 2, 1],
    distanceX: 2 * distance,
    distanceZ: distance,
    offsetX: [distance, 0, distance],
    color: "blue",
  });

  return {
    unitCell: getBalls([layerA, layerB, layerA], distance),
    layerA: getLayerBalls(layerA),
    layerB: getLayerBalls(layerB),
    CCP: getCCP().unitCell,
    "CCP=FCC": getCcpIsFcc().unitCell,
  };
}

export type Structure =
  | "PC"
  | "BCC"
  | "FCC"
  | "HCP";

export type Structures = Record<Structure, Record<string, Ball[]>>;

export const structures: Structures = {
  PC: getPC(),
  BCC: getBCC(),
  FCC: getFCC(),
  HCP: getHCP(),
};
