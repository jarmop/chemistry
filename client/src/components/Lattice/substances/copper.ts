import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growFcc } from "../grow.ts";
import { getFccConnections } from "../connections.ts";

const copperRadius = 128;

const ballCu: Ball = {
  position: new Vector3(0, 0, 0),
  color: "chocolate",
  radius: copperRadius,
};

export function getCopper() {
  return {
    unitCell: growCopper(2),
    connections: () => getFccConnections(),
    "3x3": growCopper(3),
    "5x5": growCopper(5),
  };
}

function growCopper(size: number) {
  return () => growFcc(ballCu, new Vector3(size, size, size));
}
