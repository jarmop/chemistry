import { Vector3 } from "three";
import { Ball } from "./types.ts";
import {
  centerBalls,
  getPointOnSphereSurface,
  radiusToDegree,
} from "./latticeHelpers.ts";
import { getBccConnectionAngles } from "./connections.ts";

const rockSaltConnections: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [90, 90],
  [90, 180],
  [90, 270],
];

function isWithin(value: Vector3, min: Vector3, max: Vector3) {
  return value.x >= min.x && value.x <= max.x &&
    value.y >= min.y && value.y <= max.y &&
    value.z >= min.z && value.z <= max.z;
}
export function growRockSalt(atomA: Ball, atomB: Ball, shape: Vector3): Ball[] {
  const distance = atomA.radius + atomB.radius;
  const maxSize = new Vector3(
    (shape.x - 1) * distance,
    (shape.y - 1) * distance,
    (shape.z - 1) * distance,
  );
  const minSize = atomA.position;

  function addConnections(center: Ball, connection: Ball) {
    rockSaltConnections.forEach(([polarAngle, azimuthalAngle]) => {
      const position = getPointOnSphereSurface(
        center.position,
        distance,
        polarAngle,
        azimuthalAngle,
      );
      const key = getBallKey(position);
      if (!ballMap[key] && isWithin(position, minSize, maxSize)) {
        const ball = {
          ...connection,
          position,
        };
        ballMap[key] = ball;
        addConnections(ball, center);
      }
    });
  }

  function getBallKey(position: Vector3) {
    return position.toArray().join("-");
  }

  const ballMap: Record<string, Ball> = {
    [getBallKey(atomA.position)]: atomA,
  };

  addConnections(atomA, atomB);

  const balls = Object.values(ballMap);

  return centerBalls(balls);
}

export function growBcc(atomA: Ball, atomB: Ball, shape: Vector3) {
  const distance = atomA.radius + atomB.radius;
  const latticeConstant = 2 * distance / Math.sqrt(3);

  const maxSize = new Vector3(
    (shape.x - 1) * latticeConstant,
    (shape.y - 1) * latticeConstant,
    (shape.z - 1) * latticeConstant,
  );
  const minSize = atomA.position;

  function addConnections(center: Ball, connection: Ball) {
    getBccConnectionAngles().forEach(([polarAngle, azimuthalAngle]) => {
      const position = getPointOnSphereSurface(
        center.position,
        distance,
        polarAngle,
        azimuthalAngle,
      );
      const key = getBallKey(position);
      if (!ballMap[key] && isWithin(position, minSize, maxSize)) {
        const ball = {
          ...connection,
          position,
        };
        ballMap[key] = ball;
        addConnections(ball, center);
      }
    });
  }

  function getBallKey(position: Vector3) {
    return position.toArray().join("-");
  }

  const ballMap: Record<string, Ball> = {
    [getBallKey(atomA.position)]: atomA,
  };

  addConnections(atomA, atomB);

  const balls = Object.values(ballMap);

  return centerBalls(balls);
}

const cubicDiamondAngle = radiusToDegree(Math.acos(-1 / 3));

function getDiamondConnectionAngles(): [number, number][] {
  const polarAngle = cubicDiamondAngle / 2;
  const polarAngle2 = 180 - cubicDiamondAngle / 2;
  return [
    [polarAngle, 45],
    [polarAngle, 45 + 180],
    [polarAngle2, 45 + 90],
    [polarAngle2, 45 + 270],
  ];
}

function getReverseDiamondConnectionAngles(): [number, number][] {
  const polarAngle = cubicDiamondAngle / 2;
  const polarAngle2 = 180 - cubicDiamondAngle / 2;
  return [
    [polarAngle, 45 + 90],
    [polarAngle, 45 + 270],
    [polarAngle2, 45],
    [polarAngle2, 45 + 180],
  ];
}

export function growDiamondCubic(atom: Ball, shape: Vector3) {
  const distance = 2 * atom.radius;
  const edgeLength = distance * Math.sqrt(8 / 3);
  const latticeConstant = Math.ceil(2 * edgeLength / Math.sqrt(2));

  const maxSize = new Vector3(
    (shape.x - 1) * latticeConstant,
    (shape.y - 1) * latticeConstant,
    (shape.z - 1) * latticeConstant,
  );
  const minSize = (new Vector3()).copy(atom.position);

  function addConnections(atom: Ball, reverse: boolean) {
    const connectionAngles = reverse
      ? getReverseDiamondConnectionAngles()
      : getDiamondConnectionAngles();
    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          atom.position,
          distance,
          polarAngle,
          azimuthalAngle,
        );
        const key = getBallKey(position);
        if (!ballMap[key] && isWithin(position, minSize, maxSize)) {
          const ball = {
            ...atom,
            position,
          };
          ballMap[key] = ball;
          addConnections(ball, !reverse);
        }
      },
    );
  }

  function getBallKey(position: Vector3) {
    return position.toArray().join("-");
  }

  const ballMap: Record<string, Ball> = {
    [getBallKey(atom.position)]: atom,
  };

  addConnections(atom, true);

  const balls = Object.values(ballMap);

  return centerBalls(balls);
}
