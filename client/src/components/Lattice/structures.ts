import * as THREE from "three";
import { Ball } from "./types.ts";
import { getFccConnections, getHcpConnections } from "./connections.ts";
import { centerBalls } from "./latticeHelpers.ts";
import { getNaCl } from "./substances/NaCl.ts";
import { getIron } from "./substances/iron.ts";
import { getDiamond } from "./substances/carbon.ts";
import { getCopper } from "./substances/copper.ts";
import { getZinc } from "./substances/zinc.ts";
import { tetrahedronHeight, triangleHeight } from "./mathHelpers.ts";
import {
  growBcc,
  growFcc,
  growFccCentered,
  growHcp,
  growPc,
  growPcCentered,
} from "./grow.ts";

const R = 100;

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
  let balls: Ball[] = [];
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

  balls = centerBalls(balls);

  return { balls, sticks: [] };
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
    connections: () => growHcp(),
    unitCell: () => getHexagonalBalls(layers),
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

function getPC() {
  return {
    unitCell: () => growPc(),
    connections: () => growPcCentered(),
  };
}

function getBCC() {
  return {
    unitCell: () => growBcc(),
  };
}

function getFCC() {
  return {
    unitCell: () => growFcc(),
    connections: () => growFccCentered(),
    CCP: () => getCCP().unitCell,
    "CCP=FCC": () => getCcpIsFcc().unitCell,
    connectionsHexagon: () => getFccConnections(),
  };
}

const structures = {
  PC: getPC(),
  BCC: getBCC(),
  FCC: getFCC(),
  HCP: getHCP(),
  "NaCl (Rock salt)": getNaCl(),
  Iron: getIron(),
  Diamond: getDiamond(),
  Copper: getCopper(),
  Zinc: getZinc(),
} as const;

export type StructureMaps = typeof structures;

export type StructureMapKey = keyof StructureMaps;

// export type StructureMaps = Record<StructureMapKey, Record<string, Ball[]>>;

export type StructureMap = StructureMaps[StructureMapKey];

export function getStructureMap<T extends StructureMapKey>(
  key: T,
): StructureMaps[T] {
  return structures[key];
}

export function getStructureMapKeys() {
  return Object.keys(structures) as StructureMapKey[];
}
