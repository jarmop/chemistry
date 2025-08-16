import { Vector3 } from "three";
import { Ball, Connection, Stick } from "./types.ts";
import {
  centerBalls,
  centerObjects,
  centerSticks,
  getPointOnSphereSurface,
  radiusToDegree,
} from "./latticeHelpers.ts";
import { getBccConnectionAngles } from "./connections.ts";
import { tetrahedronHeight } from "./mathHelpers.ts";
import { createHexagonalBoundChecker } from "./crystal-structure-types/hexagonal.ts";
import { createCubicBoundChecker } from "./crystal-structure-types/cubic.ts";

function getBallKey(position: Vector3) {
  function roundToTen(v: number) {
    return Math.round(v / 10) * 10;
  }
  return position.toArray().map(roundToTen).join("-");
}

// the key for two sticks is identical if the sticks occupy the same space
function getStickKey(stick: Stick) {
  stick.start.manhattanDistanceTo;
  return [stick.start, stick.end].map((v) =>
    v.toArray().map((n) => Math.round(n)).join("-")
  ).toSorted().join(",");
}

function grow(
  center: Ball,
  distance: number,
  isWithinBounds: (position: Vector3) => boolean,
  connectionAnglesDefault: [number, number][],
  connectionAnglesReverse: [number, number][] = [],
  isReverse: (reverse: boolean, polarAngle: number) => boolean = () => false,
  initialReverse: boolean,
  maxLayers?: number,
) {
  const ballMap: Record<string, boolean> = {
    [getBallKey(center.position)]: true,
  };

  const stickMap: Record<string, boolean> = {};

  function addConnections(center: Ball, reverse = false) {
    const connections: Connection[] = [];
    const connectionAngles = reverse
      ? connectionAnglesReverse
      : connectionAnglesDefault;

    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          center.position,
          distance,
          polarAngle,
          azimuthalAngle,
        );

        const key = getBallKey(position);

        if (isWithinBounds(position)) {
          const connection: Connection = {
            reverse: isReverse(reverse, polarAngle),
          };
          if (!ballMap[key]) {
            ballMap[key] = true;
            connection.ball = {
              ...center,
              position,
              color: center.color,
            };
          }
          const stick = { start: center.position, end: position };
          const stickKey = getStickKey(stick);
          if (!stickMap[stickKey]) {
            stickMap[stickKey] = true;
            connection.stick = stick;
          }

          connections.push(connection);
        }
      },
    );

    return connections;
  }

  let layerCount = 0;

  let balls: Ball[] = [center];
  let connections = addConnections(center, initialReverse);
  balls = [
    ...balls,
    ...connections.filter((c) => c.ball).map((c) => c.ball),
  ] as Ball[];

  const sticks: Stick[] = [];
  connections.forEach(({ ball, stick }) => {
    if (ball) {
      balls.push(ball);
    }
    if (stick) {
      sticks.push(stick);
    }
  });

  layerCount++;
  while ((!maxLayers || layerCount < maxLayers) && connections.length > 0) {
    const newConnections: Connection[][] = [];
    connections.forEach(({ ball, reverse }) => {
      if (ball) {
        newConnections.push(addConnections(ball, reverse));
      }
    });
    connections = newConnections.flat();
    connections.forEach(({ ball, stick }) => {
      if (ball) {
        balls.push(ball);
      }
      if (stick) {
        sticks.push(stick);
      }
    });

    layerCount++;
  }

  // Add sticks to the last layer
  connections.map(({ ball: center, reverse }) => {
    if (!center) {
      return;
    }
    const connectionAngles = reverse
      ? connectionAnglesReverse
      : connectionAnglesDefault;
    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          center.position,
          distance,
          polarAngle,
          azimuthalAngle,
        );

        const connectionBall = ballMap[getBallKey(position)];
        if (connectionBall) {
          const stick = { start: center.position, end: position };
          const stickKey = getStickKey(stick);
          if (!stickMap[stickKey]) {
            stickMap[stickKey] = true;
            sticks.push(stick);
          }
        }
      },
    );
  });

  return { balls, sticks };
}

const rockSaltConnections: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [90, 90],
  [90, 180],
  [90, 270],
];

export function growRockSalt(atomA: Ball, atomB: Ball, shape: Vector3) {
  const distance = atomA.radius + atomB.radius;

  const isWithin = createCubicBoundChecker(shape.x, distance);

  function addConnections(center: Ball, connection: Ball) {
    rockSaltConnections.forEach(([polarAngle, azimuthalAngle]) => {
      const position = getPointOnSphereSurface(
        center.position,
        distance,
        polarAngle,
        azimuthalAngle,
      );
      const key = getBallKey(position);
      if (!ballMap[key] && isWithin(position)) {
        const ball = {
          ...connection,
          position,
        };
        ballMap[key] = ball;
        addConnections(ball, center);
      }
    });
  }

  const ballMap: Record<string, Ball> = {
    [getBallKey(atomA.position)]: atomA,
  };

  addConnections(atomA, atomB);

  const balls = centerBalls(Object.values(ballMap));

  return { balls, sticks: [] };
}

export function growBcc(atomA: Ball, atomB: Ball, shape: Vector3) {
  const distance = atomA.radius + atomB.radius;
  const latticeConstant = Math.ceil(2 * distance / Math.sqrt(3));

  let balls: Ball[] = [atomA];
  const ballMap: Record<string, true> = {
    [getBallKey(atomA.position)]: true,
  };

  const isWithin = createCubicBoundChecker(shape.x, latticeConstant);

  function addConnections(center: Ball, connection: Ball) {
    getBccConnectionAngles().forEach(([polarAngle, azimuthalAngle]) => {
      const position = getPointOnSphereSurface(
        center.position,
        distance,
        polarAngle,
        azimuthalAngle,
      );
      const key = getBallKey(position);
      if (!ballMap[key]) {
        const ball = {
          ...connection,
          position,
        };
        ballMap[key] = true;
        if (isWithin(position)) {
          balls = [...balls, ball];
          addConnections(ball, center);
        }
      }
    });
  }

  addConnections(atomA, atomB);

  balls = centerBalls(balls);

  return { balls, sticks: [] };
}

const cubicDiamondAngle = radiusToDegree(Math.acos(-1 / 3));

function getDiamondConnectionAngles(reverse = false): [number, number][] {
  const polarAngleBottom = cubicDiamondAngle / 2;
  const polarAngleTop = 180 - cubicDiamondAngle / 2;

  const azimuthalAngles = [[45, 45 + 180], [45 + 90, 45 + 270]];

  if (reverse) {
    azimuthalAngles.reverse();
  }

  const anglesBottom: [number, number][] = azimuthalAngles[0].map((
    az,
  ) => [polarAngleBottom, az]);
  const anglesTop: [number, number][] = azimuthalAngles[1].map((
    az,
  ) => [polarAngleTop, az]);

  return [...anglesBottom, ...anglesTop];
}

function getReverseDiamondConnectionAngles(): [number, number][] {
  return getDiamondConnectionAngles(true);
}

export function growDiamondCubic(atom: Ball, size: number) {
  const distance = 2 * atom.radius;
  const edgeLength = distance * Math.sqrt(8 / 3);
  const latticeConstant = Math.ceil(2 * edgeLength / Math.sqrt(2));

  const isWithinBounds = createCubicBoundChecker(size, latticeConstant);

  function isReverse(reverse: boolean) {
    return !reverse;
  }

  const { balls, sticks } = grow(
    atom,
    distance,
    isWithinBounds,
    getDiamondConnectionAngles(),
    getReverseDiamondConnectionAngles(),
    isReverse,
    true,
  );

  return { balls: centerObjects(balls), sticks: centerSticks(sticks) };
}

function getFccConnectionAngles() {
  const connectionAngles: [number, number][] = [];

  const polarAngle = 90;
  for (let azimuthalAngle = 45; azimuthalAngle < 360; azimuthalAngle += 90) {
    connectionAngles.push([polarAngle, azimuthalAngle]);
  }

  for (let polarAngle = 45; polarAngle < 180; polarAngle += 90) {
    for (let azimuthalAngle = 0; azimuthalAngle < 360; azimuthalAngle += 90) {
      connectionAngles.push([polarAngle, azimuthalAngle]);
    }
  }

  return connectionAngles;
}

export function growFcc(atom: Ball, shape: Vector3) {
  const distance = 2 * atom.radius;
  const latticeConstant = 2 * distance / Math.sqrt(2);

  const connectionAngles = getFccConnectionAngles();

  const isWithin = createCubicBoundChecker(shape.x, latticeConstant);

  function addConnections(atom: Ball) {
    const connections: Ball[] = [];
    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          atom.position,
          distance,
          polarAngle,
          azimuthalAngle,
        );

        const key = getBallKey(position);
        if (!ballMap[key] && isWithin(position)) {
          const ball = {
            ...atom,
            position,
            color: atom.color,
          };
          ballMap[key] = ball;
          connections.push(ball);
        }
      },
    );

    return connections;
  }

  const ballMap: Record<string, Ball> = {
    [getBallKey(atom.position)]: atom,
  };

  let connections = addConnections(atom);
  while (connections.length > 0) {
    const newConnections: Ball[][] = [];
    connections.forEach((atom) => {
      newConnections.push(addConnections(atom));
    });
    connections = newConnections.flat();
  }

  const balls = centerBalls(Object.values(ballMap));

  return { balls, sticks: [] };
}

const tetrahedronPlaneEdgeAngle = radiusToDegree(
  Math.acos(tetrahedronHeight(1)),
);

export function getHcpConnectionAngles(reverse = false): [number, number][] {
  const hcpPolarMiddle = 90;
  const hcpPolarTop = tetrahedronPlaneEdgeAngle;
  const hcpPolarBottom = 180 - tetrahedronPlaneEdgeAngle;

  const middleAngles: [number, number][] = [];
  for (let azimuthalAngle = 0; azimuthalAngle < 360; azimuthalAngle += 60) {
    middleAngles.push([hcpPolarMiddle, azimuthalAngle]);
  }

  const topAngles: [number, number][] = [];
  const bottomAngles: [number, number][] = [];
  for (
    let azimuthalAngle = reverse ? 30 : 90;
    azimuthalAngle < 360;
    azimuthalAngle += 120
  ) {
    topAngles.push([hcpPolarTop, azimuthalAngle]);
    bottomAngles.push([hcpPolarBottom, azimuthalAngle]);
  }

  return [
    ...middleAngles,
    ...topAngles,
    ...bottomAngles,
  ];
}

function getReverseHcpConnectionAngles(): [number, number][] {
  return getHcpConnectionAngles(true);
}

export function growHcp(
  center: Ball,
  latticeConstants: { a: number; c: number },
  size: number,
  useBounds: boolean = true,
) {
  const maxLayers = useBounds ? Math.ceil(Math.sqrt(2) * size) : size;
  const { a, c } = latticeConstants;
  const distance = a;

  const isWithinBounds = createHexagonalBoundChecker(size * a, size * c);

  function isReverse(reverse: boolean, polarAngle: number) {
    return polarAngle === 90 ? reverse : !reverse;
  }

  return grow(
    center,
    distance,
    isWithinBounds,
    getHcpConnectionAngles(),
    getReverseHcpConnectionAngles(),
    isReverse,
    false,
    maxLayers,
  );
}
