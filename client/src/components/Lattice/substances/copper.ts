import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growFcc, growFccCentered } from "../grow.ts";

const copperRadius = 128;

const ballCu: Ball = {
  position: new Vector3(0, 0, 0),
  color: "chocolate",
  radius: copperRadius,
};

export function getCopper() {
  return {
    unitCell: growCopper(1),
    "2x2": growCopper(2),
    "4x4": growCopper(4),
    connections: () => growFccCentered(ballCu, 1),
  };
}

function growCopper(size: number) {
  return () => growFcc(ballCu, size);
}
