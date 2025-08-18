import { Vector3 } from "three";
import { Ball } from "../types.ts";
import { growFcc, growPc, growPcCentered } from "../grow.ts";

const radiusNa = 116;
const radiusCl = 167;
const ballNa: Ball = {
  position: new Vector3(0, 0, 0),
  color: "purple",
  radius: radiusNa,
};
const ballCl: Ball = {
  position: new Vector3(0, 0, 0),
  color: "lightgreen",
  radius: radiusCl,
};

export function getNaCl() {
  const size = 5;

  const NaCl = {
    unitCell: () => growPc(ballNa, ballCl, 2),
    connectionsNa: () => growPcCentered(ballNa, ballCl, 1),
    connectionsCl: () => growPcCentered(ballCl, ballNa, 1),
    unitCellNaAlone: () => growFcc(ballNa, 1),
    unitCellClAlone: () => growFcc(ballNa, 1),
    [`${size}x${size}`]: () =>
      growPc(
        ballNa,
        ballCl,
        size,
      ),
  };
  return NaCl;
}
