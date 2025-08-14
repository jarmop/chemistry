import { Vector3 } from "three";
import { getBccConnections, getPcConnections } from "../connections.ts";
import { Ball } from "../types.ts";
import { growRockSalt } from "../grow.ts";

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

export function getNaClConnectionsNa() {
  return getPcConnections(ballNa, ballCl);
}

export function getNaClConnectionsCl() {
  return getPcConnections(ballCl, ballNa);
}

export function getUnitCell() {
  const size = 2;
  return growRockSalt(ballNa, ballCl, new Vector3(size, size, size));
}

export function getNaCl() {
  const size = 5;

  const NaCl = {
    unitCell: getUnitCell(),
    connectionsNa: getNaClConnectionsNa(),
    connectionsCl: getNaClConnectionsCl(),
    unitCellNaAlone: getBccConnections(ballNa, ballCl),
    [`${size}x${size}`]: growRockSalt(
      ballNa,
      ballCl,
      new Vector3(size, size, size),
    ),
  };
  return NaCl;
}
