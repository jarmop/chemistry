import { Vector3 } from "three";
import { getBccConnections } from "../connections.ts";
import { Ball } from "../types.ts";
import { growBcc } from "../grow.ts";

const ballFe: Ball = {
  position: new Vector3(0, 0, 0),
  color: "orangered",
  radius: 126,
};

export function getIron() {
  const size = 3;
  return {
    unitCell: getBccConnections(ballFe, ballFe),
    "3x3": growBcc(ballFe, ballFe, new Vector3(size, size, size)),
  };
}
