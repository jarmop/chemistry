import { Vector3 } from "three";
import { Ball } from "./types.ts";

const ballRadius = 1;
const distance = 2 * ballRadius;

export function degreeToRadius(deg: number) {
  return deg / 180 * Math.PI;
}

/**
 * @param polarAngle Goes 180 degrees, counter-clockwise, along the xy plane, starting from the negative y axis
 * @param azimuthalAngle Goes 360 degrees, clockwise, around the y axis, starting from the xy plane point indicated by the polarAngle
 */
export function getPointOnSphereSurface(
  radius: number,
  polarAngle: number,
  azimuthalAngle: number,
) {
  const x = radius * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
  const z = -radius * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
  const y = -radius * Math.cos(polarAngle);

  return new Vector3(x, y, z);
}

function getConnection(
  polarAngle: number,
  azimuthalAngle: number,
  color = "blue",
) {
  const polarAngleRad = degreeToRadius(polarAngle);
  const azimuthalAngleRad = degreeToRadius(azimuthalAngle);
  return {
    position: getPointOnSphereSurface(
      distance,
      polarAngleRad,
      azimuthalAngleRad,
    ),
    color,
    // color: 'blue',
  };
}

export function getPcConnections(): Ball[] {
  const center = {
    position: new Vector3(0, 0, 0),
    color: "red",
  };

  return [
    center,
    getConnection(0, 0),
    getConnection(90, 0),
    getConnection(180, 0),
    getConnection(270, 0),
    getConnection(90, 90),
    getConnection(90, 270),
  ];
}

export function getFccConnections(): Ball[] {
  const center = {
    position: new Vector3(0, 0, 0),
    color: "red",
  };

  return [
    center,
    getConnection(90, 0),
    getConnection(90, 60),
    getConnection(90, 120),
    getConnection(90, 180),
    getConnection(90, 240),
    getConnection(90, 300),
    // getConnection(35, 30, "lightgreen"),
    // getConnection(35, 150, "lightgreen"),
    // getConnection(35, 270, "lightgreen"),
    getConnection(35, 90, "lightgreen"),
    getConnection(35, 210, "lightgreen"),
    getConnection(35, 330, "lightgreen"),
    getConnection(145, 30, "lightgreen"),
    getConnection(145, 150, "lightgreen"),
    getConnection(145, 270, "lightgreen"),
    // getConnection(145, 90, "lightgreen"),
    // getConnection(145, 210, "lightgreen"),
    // getConnection(145, 330, "lightgreen"),
  ];

  // return [
  //   center,
  //   getConnection(30, 0),
  //   getConnection(90, 0),
  //   getConnection(150, 0),
  //   getConnection(210, 0),
  //   getConnection(270, 0),
  //   getConnection(330, 0),
  //   getConnection(55, 90),
  //   getConnection(107, 58.5),
  //   getConnection(107, 121.5),
  // ];
}

export function getHcpConnections(): Ball[] {
  const center = {
    position: new Vector3(0, 0, 0),
    color: "red",
  };

  return [
    center,
    getConnection(90, 0),
    getConnection(90, 60),
    getConnection(90, 120),
    getConnection(90, 180),
    getConnection(90, 240),
    getConnection(90, 300),
    getConnection(35, 30, "lightgreen"),
    getConnection(35, 150, "lightgreen"),
    getConnection(35, 270, "lightgreen"),
    // getConnection(35, 90, "lightgreen"),
    // getConnection(35, 210, "lightgreen"),
    // getConnection(35, 330, "lightgreen"),
    getConnection(145, 30, "lightgreen"),
    getConnection(145, 150, "lightgreen"),
    getConnection(145, 270, "lightgreen"),
    // getConnection(145, 90, "lightgreen"),
    // getConnection(145, 210, "lightgreen"),
    // getConnection(145, 330, "lightgreen"),
  ];
}
