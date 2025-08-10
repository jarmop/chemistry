import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growDiamondCubic } from "../grow.ts";
import { getDiamondConnections } from "../connections.ts";

const diamondBondLength = 154;

const ballC: Ball = {
  position: new Vector3(0, 0, 0),
  color: "gray",
  radius: diamondBondLength / 2,
};

export function getDiamond() {
  const foo = {
    connections: getDiamondConnections(),
    unitCell: growDiamond(2),
    "3x3": growDiamond(3),
    "5x5": growDiamond(5),
  };

  return foo;
}

function growDiamond(size: number) {
  return growDiamondCubic(ballC, new Vector3(size, size, size));
}
