import { Vector3 } from "three";
import { getBccConnections } from "../connections.ts";
import { Ball } from "../types.ts";
import { growBcc } from "../grow.ts";

const ballFe: Ball = {
  position: new Vector3(0, 0, 0),
  color: "chocolate",
  radius: 126,
};

export function getIron() {
  const size = 3;
  const foo = {
    "3x3": growBcc(ballFe, ballFe, new Vector3(size, size, size)),
    unitCell: getBccConnections(ballFe, ballFe),
  };

  return foo;
}
