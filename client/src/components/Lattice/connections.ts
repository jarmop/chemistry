import { Vector3 } from "three";
import { Ball } from "./types.ts";

const defaultRadius = 100;

const defaultCenter = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

const defaultConnection = {
  position: new Vector3(0, 0, 0),
  color: "blue",
  radius: defaultRadius,
};

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
  const polarAngleRad = degreeToRadius(polarAngle);
  const azimuthalAngleRad = degreeToRadius(azimuthalAngle);

  const x = radius * Math.sin(polarAngleRad) * Math.cos(azimuthalAngleRad);
  const z = -radius * Math.sin(polarAngleRad) * Math.sin(azimuthalAngleRad);
  const y = -radius * Math.cos(polarAngleRad);

  return new Vector3(x, y, z);
}

function getConnection(
  polarAngle: number,
  azimuthalAngle: number,
  color = "blue",
  centerRadius = defaultRadius,
  connectionRadius = defaultRadius,
) {
  const distance = centerRadius + connectionRadius;
  return {
    position: getPointOnSphereSurface(
      distance,
      polarAngle,
      azimuthalAngle,
    ),
    color,
    radius: connectionRadius,
  };
}

export function getPcConnections(
  centerBall: Ball = defaultCenter,
  connectionBall: Ball = defaultConnection,
) {
  const connectionRadius = centerBall.radius + connectionBall.radius;

  function getConnection(polarAngle: number, azimuthalAngle: number): Ball {
    return {
      ...connectionBall,
      position: getPointOnSphereSurface(
        connectionRadius,
        polarAngle,
        azimuthalAngle,
      ),
    };
  }

  return [
    centerBall,
    getConnection(0, 0),
    getConnection(180, 0),
    getConnection(90, 45),
    getConnection(90, 90 + 45),
    getConnection(90, 180 + 45),
    getConnection(90, 270 + 45),
  ];
}

export function getFccConnections(): Ball[] {
  const center = {
    position: new Vector3(0, 0, 0),
    color: "red",
    radius: defaultRadius,
  };

  return [
    center,
    getConnection(90, 0),
    getConnection(90, 60),
    getConnection(90, 120),
    getConnection(90, 180),
    getConnection(90, 240),
    getConnection(90, 300),
    getConnection(35, 90, "lightgreen"),
    getConnection(35, 210, "lightgreen"),
    getConnection(35, 330, "lightgreen"),
    getConnection(145, 30, "lightgreen"),
    getConnection(145, 150, "lightgreen"),
    getConnection(145, 270, "lightgreen"),
  ];
}

export function getHcpConnections(): Ball[] {
  const center = {
    position: new Vector3(0, 0, 0),
    color: "red",
    radius: defaultRadius,
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
    getConnection(145, 30, "lightgreen"),
    getConnection(145, 150, "lightgreen"),
    getConnection(145, 270, "lightgreen"),
  ];
}

const radiusNa = 116;
const radiusCl = 167;
const ballNa = {
  position: new Vector3(0, 0, 0),
  color: "purple",
  radius: radiusNa,
};
const ballCl = {
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
