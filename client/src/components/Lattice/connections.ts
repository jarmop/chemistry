import { Vector3 } from "three";
import { Ball } from "./types.ts";
import { getPointOnSphereSurface, radiusToDegree } from "./latticeHelpers.ts";

const defaultRadius = 100;

const defaultCenter: Ball = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

const defaultConnection: Ball = {
  position: new Vector3(0, 0, 0),
  color: "blue",
  radius: defaultRadius,
};

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
      defaultCenter.position,
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
        centerBall.position,
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

export function getBccConnectionAngles() {
  const cubeDiameterAngle = radiusToDegree(Math.acos(1 / Math.sqrt(3)));
  const angles: [number, number][] = [];
  [cubeDiameterAngle, 180 - cubeDiameterAngle].forEach((polarAngle) => {
    for (let azimuthalAngle = 45; azimuthalAngle < 360; azimuthalAngle += 90) {
      angles.push([polarAngle, azimuthalAngle]);
    }
  });
  return angles;
}

export function getBccConnections(
  centerBall: Ball = defaultCenter,
  connectionBall: Ball = defaultConnection,
) {
  const connectionRadius = centerBall.radius + connectionBall.radius;

  function getConnection(polarAngle: number, azimuthalAngle: number): Ball {
    return {
      ...connectionBall,
      position: getPointOnSphereSurface(
        centerBall.position,
        connectionRadius,
        polarAngle,
        azimuthalAngle,
      ),
    };
  }

  const balls = [centerBall];

  getBccConnectionAngles().forEach(([polarAngle, azimuthalAngle]) => {
    balls.push(getConnection(polarAngle, azimuthalAngle));
  });

  return balls;
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
    getConnection(35, 30, "lightgreen"),
    getConnection(35, 150, "lightgreen"),
    getConnection(35, 270, "lightgreen"),
    getConnection(145, 90, "lightgreen"),
    getConnection(145, 210, "lightgreen"),
    getConnection(145, 330, "lightgreen"),
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
    getConnection(35, 90, "lightgreen"),
    getConnection(35, 210, "lightgreen"),
    getConnection(35, 330, "lightgreen"),
    getConnection(145, 90, "lightgreen"),
    getConnection(145, 210, "lightgreen"),
    getConnection(145, 330, "lightgreen"),
  ];
}

const cubicDiamondAngle = radiusToDegree(Math.acos(-1 / 3));

function getDiamondConnectionAngles(): [number, number][] {
  const polarAngle = cubicDiamondAngle / 2;
  const polarAngle2 = 180 - cubicDiamondAngle / 2;
  const azimuthalOffset = 45;

  return [
    [polarAngle, azimuthalOffset],
    [polarAngle, azimuthalOffset + 180],
    [polarAngle2, azimuthalOffset + 90],
    [polarAngle2, azimuthalOffset + 270],
  ];
}

export function getDiamondConnections() {
  const centerBall = defaultCenter;
  const connectionBall = defaultConnection;
  const connectionRadius = centerBall.radius + connectionBall.radius;

  function getConnection(polarAngle: number, azimuthalAngle: number): Ball {
    return {
      ...connectionBall,
      position: getPointOnSphereSurface(
        centerBall.position,
        connectionRadius,
        polarAngle,
        azimuthalAngle,
      ),
    };
  }

  const balls = [{ ...centerBall, color: "red" }];

  getDiamondConnectionAngles().forEach(([polarAngle, azimuthalAngle]) => {
    balls.push(getConnection(polarAngle, azimuthalAngle));
  });

  return balls;
}
