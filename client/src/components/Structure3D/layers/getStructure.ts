import { Vector3 } from "three";
import { Ball } from "../common/types.ts";
import {
  tetrahedronHeight,
  triangleCornerToCenterDistance,
  triangleEdgeToCenterDistance,
  triangleHeight,
} from "../common/mathHelpers.ts";
import { centerBalls } from "../common/latticeHelpers.ts";

const defaultRadius = 100;

const defaultAtom: Ball = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

const R = defaultAtom.radius;

const distanceX = R;
const distanceZ = triangleHeight(2 * R);
const distanceY = tetrahedronHeight(2 * R);

export const cornerToCenter = triangleCornerToCenterDistance(2 * R);
export const edgeToCenter = triangleEdgeToCenterDistance(2 * R);

export type Layer = string[][];

export function getStructure(
  layers: string[][],
  layerColors: string[],
  layerZOffsets?: number[],
) {
  const balls: Ball[] = [];

  let y = 0;
  layers.forEach((layer, i) => {
    const color = layerColors[i % layerColors.length];
    let z = layerZOffsets
      ? layerZOffsets[i % layerZOffsets.length]
      : i * cornerToCenter;
    layer.forEach((row) => {
      let x = 0;
      row.split("").forEach((square) => {
        if (square === "o") {
          balls.push({
            ...defaultAtom,
            position: new Vector3(x, y, z),
            color,
          });
        }
        x += distanceX;
      });
      z += distanceZ;
    });
    y += distanceY;
  });

  return { balls: centerBalls(balls), sticks: [] };
}
