import * as THREE from "three";
import { Ball } from "./types.ts";
import {
  getFccConnections,
  getHcpConnections,
  getPcConnections,
} from "./connections.ts";
import { centerBalls } from "./latticeHelpers.ts";
import { getNaCl } from "./substances/NaCl.ts";
import { getIron } from "./substances/iron.ts";

const R = 100;

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

type Layer = {
  rows: { offsetX: number; cols: number }[];
  // rows: number[];
  // offsetX: number[];
  offsetZ: number;
  distanceX: number;
  distanceZ: number;
  color: string;
};

function getBalls(layers: Layer[], layerDistance: number = 0) {
  const balls: Ball[] = [];
  for (let i = 0; i < layers.length; i++) {
    const y = i * layerDistance;
    const { rows, distanceX, distanceZ, offsetZ, color } = layers[i];
    for (let rowI = 0; rowI < rows.length; rowI++) {
      const { offsetX, cols } = rows[rowI];
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * distanceX;
        const z = offsetZ + rowI * distanceZ;
        balls.push({
          position: new THREE.Vector3(x, y, z),
          color: color,
          radius: R,
        });
      }
    }
  }

  return centerBalls(balls);
}

function getHexagonalBalls(layers: Layer[]) {
  const layerDistance = tetrahedronHeight(2 * R);
  return getBalls(layers, layerDistance);
}

function getLayerBalls(layer: Layer) {
  const singleLayer = { ...layer, startX: 0, startZ: 0 };
  return getBalls([singleLayer]);
}

const hexagonLayer = getLayer({
  rows: [
    { offsetX: R, cols: 2 },
    { offsetX: 0, cols: 3 },
    { offsetX: R, cols: 2 },
  ],
  distanceX: 2 * R,
  distanceZ: triangleHeight(2 * R),
  color: "red",
});

function getPyramidRows(
  height: number,
  offsetXStart = 0,
) {
  const offsetXIncrement = R;
  const rows: Layer["rows"] = [];
  for (let i = 0; i < height; i++) {
    rows.push(
      { offsetX: offsetXStart + i * offsetXIncrement, cols: height - i },
    );
  }
  return rows;
}

function getHCP() {
  const layerA = hexagonLayer;
  const layerB = {
    ...hexagonLayer,
    rows: getPyramidRows(2, R).toReversed(),
    offsetZ: R * Math.sqrt(3) / 3,
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
    connections: getHcpConnections(),
  };
}

function getCCP() {
  const layerA = hexagonLayer;
  const layerB = {
    ...layerA,
    rows: getPyramidRows(2, R),
    offsetZ: 2 * R * Math.sqrt(3) / 3,
    color: "blue",
  };
  const layerC = {
    ...layerA,
    rows: getPyramidRows(2, R).toReversed(),
    offsetZ: R * Math.sqrt(3) / 3,
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
  const layerA = getLayer({
    rows: [{ offsetX: 2 * R, cols: 1 }],
    offsetZ: 4 * triangleHeight(2 * R) / 3,
    color: "red",
  });
  const layerB = getLayer({
    ...hexagonLayer,
    rows: getPyramidRows(3).toReversed(),
    color: "blue",
  });
  const layerC = {
    ...hexagonLayer,
    rows: getPyramidRows(3),
    offsetZ: 2 * R * Math.sqrt(3) / 3,
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
    offsetZ: 0,
    distanceX: 2 * R,
    distanceZ: 2 * R,
    color: "red",
  };

  return { ...defaultLayer, ...layer };
}

function getRowObjects(rows: number[]): Layer["rows"] {
  return rows.map((cols) => ({ offsetX: 0, cols }));
}

function getPC() {
  const layerA = getLayer({
    rows: getRowObjects([2, 2]),
  });

  return {
    unitCell: getBalls([layerA, layerA], 2 * R),
    layer: getLayerBalls(layerA),
    connections: getPcConnections(),
  };
}

function getBCC() {
  const distance = cubeDiameterToEdge(2 * R);

  const layerA = getLayer({
    rows: getRowObjects([2, 2]),
    distanceX: 2 * distance,
    distanceZ: 2 * distance,
  });

  const layerB = getLayer({
    rows: [{ offsetX: distance, cols: 1 }],
    offsetZ: distance,
    color: "blue",
  });

  return {
    unitCell: getBalls([layerA, layerB, layerA], distance),
    layer: getLayerBalls(layerA),
  };
}

function getFCC() {
  const distance = squareDiameterToSide(2 * R);

  const rowA = { offsetX: 0, cols: 2 };
  const rowB = { offsetX: distance, cols: 1 };

  const layerA = getLayer({
    rows: [
      rowA,
      rowB,
      rowA,
    ],
    distanceX: 2 * distance,
    distanceZ: distance,
  });

  const layerB = getLayer({
    ...layerA,
    rows: [
      rowB,
      rowA,
      rowB,
    ],
    color: "blue",
  });

  return {
    unitCell: getBalls([layerA, layerB, layerA], distance),
    layerA: getLayerBalls(layerA),
    layerB: getLayerBalls(layerB),
    CCP: getCCP().unitCell,
    "CCP=FCC": getCcpIsFcc().unitCell,
    connections: getFccConnections(),
  };
}

const structures = {
  PC: getPC(),
  BCC: getBCC(),
  FCC: getFCC(),
  HCP: getHCP(),
  "NaCl (Rock salt)": getNaCl(),
  Iron: getIron(),
} as const;

export type Structure = keyof typeof structures;

export type Structures = Record<Structure, Record<string, Ball[]>>;

export function getStructures(): Structures {
  return structures;
}

export function getStructureKeys() {
  return Object.keys(structures) as Structure[];
}
