import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growBcc } from "../grow.ts";

const ballFe: Ball = {
  position: new Vector3(0, 0, 0),
  color: "orangered",
  radius: 126,
};

export function getIron() {
  return {
    unitCell: () => growBcc(ballFe, ballFe, 1),
    "2x2": () => growBcc(ballFe, ballFe, 2),
  };
}
