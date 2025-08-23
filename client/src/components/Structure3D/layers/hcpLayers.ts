import { Vector3 } from "three";
import { Ball } from "../common/types.ts";
import { triangleCornerToCenterDistance } from "../common/mathHelpers.ts";
import { getStructure } from "./getStructure.ts";

const defaultRadius = 100;

const defaultAtom: Ball = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

const R = defaultAtom.radius;

export const cornerToCenter = triangleCornerToCenterDistance(2 * R);

export type Layer = string[][];

const layerColors = ["red", "blue"];
const layerZOffsets = [
  0,
  cornerToCenter,
];

export function getHcpStructure(
  layers: string[][],
) {
  return getStructure(layers, layerColors, layerZOffsets);
}
