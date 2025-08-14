import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growDiamondCubic } from "../grow.ts";
import { getDiamondConnections } from "../connections.ts";

const diamondBondLength = 154;

const ballC: Ball = {
  position: new Vector3(0, 0, 0),
  color: "gray",
  // this affects the distance of atoms as well
  radius: diamondBondLength / 2,
};

export function getDiamond() {
  return {
    connections: getDiamondConnections(),
    unitCell: growDiamond(2),
    "3x3": growDiamond(3),
    "5x5": growDiamond(5),
  };
}

function growDiamond(size: number) {
  return growDiamondCubic(ballC, size);
}
