import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growHcp } from "../grow.ts";

// Lattice constants
const latticeConstants = {
  a: 266.46,
  c: 494.55,
};

// const zincRadius = 134;
const zincRadius = latticeConstants.a / 2;

const ballZinc: Ball = {
  position: new Vector3(0, 0, 0),
  color: "silver",
  radius: zincRadius,
};

export function getZinc() {
  return {
    "1 layer": growZinc(1),
    "2 layers": growZinc(2, false),
    "4 layers": growZinc(4, false),
    "2 layers, pillar": growZinc(2),
    "4 layers, pillar": growZinc(4),
  };
}

function growZinc(size: number, useBounds = true) {
  return growHcp(ballZinc, latticeConstants, size, useBounds);
}
