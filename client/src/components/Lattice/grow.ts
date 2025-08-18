import { Vector3 } from "three";
import { Ball, Connection, Stick } from "./types.ts";
import {
  centerObjects,
  centerSticks,
  getPointOnSphereSurface,
  radiusToDegree,
} from "./latticeHelpers.ts";
import { tetrahedronHeight } from "./mathHelpers.ts";
import { createHexagonalBoundChecker } from "./crystal-structure-types/hexagonal.ts";
import { createCubicBoundChecker } from "./crystal-structure-types/cubic.ts";

const defaultRadius = 100;

const defaultAtom: Ball = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

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

interface GrowArgs {
  startAtom: Ball;
  atom2?: Ball;
  distance: number;
  isWithinBounds?: (position: Vector3) => boolean;
  connectionAnglesDefault: [number, number][];
  connectionAnglesReverse?: [number, number][];
  isReverse?: (reverse: boolean, polarAngle: number) => boolean;
  initialReverse?: boolean;
  maxLayers?: number;
}

function grow({
  startAtom,
  atom2,
  distance,
  isWithinBounds = () => true,
  connectionAnglesDefault,
  connectionAnglesReverse = [],
  isReverse = () => false,
  initialReverse = false,
  maxLayers,
}: GrowArgs) {
  const ballMap: Record<string, boolean> = {
    [getBallKey(startAtom.position)]: true,
  };

  const stickMap: Record<string, boolean> = {};

  function addConnections(
    centerAtom: Ball,
    connectionAtom: Ball,
    reverse = false,
  ) {
    const connections: Connection[] = [];
    const connectionAngles = reverse
      ? connectionAnglesReverse
      : connectionAnglesDefault;

    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          centerAtom.position,
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
              ...connectionAtom,
              position,
              color: connectionAtom.color,
            };
          }
          const stick = { start: centerAtom.position, end: position };
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

  const balls: Ball[] = [startAtom];
  // let balls: Ball[] = [{ ...startAtom, color: "blue" }];
  const sticks: Stick[] = [];

  let connections = addConnections(
    startAtom,
    atom2 || startAtom,
    initialReverse,
  );

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
        newConnections.push(
          addConnections(
            ball,
            (atom2 && ball.color === startAtom.color) ? atom2 : startAtom,
            reverse,
          ),
        );
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

const pcConnections: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [90, 90],
  [90, 180],
  [90, 270],
];

export function growPc(
  atomA: Ball = defaultAtom,
  atomB: Ball = defaultAtom,
  size: number = 1,
) {
  const distance = atomA.radius + atomB.radius;

  const isWithinBounds = createCubicBoundChecker(size * distance);

  const { balls, sticks } = grow({
    startAtom: atomA,
    atom2: atomB,
    distance,
    isWithinBounds,
    connectionAnglesDefault: pcConnections,
  });

  return { balls: centerObjects(balls), sticks: centerSticks(sticks) };
}

export function growPcCentered(
  atomA: Ball = defaultAtom,
  atomB: Ball = defaultAtom,
  layers = 1,
) {
  const distance = atomA.radius + atomB.radius;

  return grow({
    startAtom: atomA,
    atom2: atomB,
    distance,
    connectionAnglesDefault: pcConnections,
    maxLayers: layers,
  });
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

export function growBcc(
  atomA: Ball = defaultAtom,
  atomB: Ball = defaultAtom,
  size: number = 1,
) {
  const distance = atomA.radius + atomB.radius;
  const latticeConstant = Math.ceil(2 * distance / Math.sqrt(3));

  const isWithinBounds = createCubicBoundChecker(size * latticeConstant);

  const { balls, sticks } = grow({
    startAtom: atomA,
    distance,
    isWithinBounds,
    connectionAnglesDefault: getBccConnectionAngles(),
  });

  return { balls: centerObjects(balls), sticks: centerSticks(sticks) };
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

export function growDiamondCubic(startAtom: Ball, size: number) {
  const distance = 2 * startAtom.radius;
  const edgeLength = Math.ceil(2 * distance / Math.sqrt(3));

  const isWithinBounds = createCubicBoundChecker(size * edgeLength);

  function isReverse(reverse: boolean) {
    return !reverse;
  }

  const { balls, sticks } = grow({
    startAtom,
    distance,
    isWithinBounds,
    connectionAnglesDefault: getDiamondConnectionAngles(),
    connectionAnglesReverse: getReverseDiamondConnectionAngles(),
    isReverse,
    initialReverse: true,
  });

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

export function growFcc(
  atom: Ball = defaultAtom,
  size = 1,
) {
  const distance = 2 * atom.radius;
  const latticeConstant = 2 * distance / Math.sqrt(2);

  const isWithinBounds = createCubicBoundChecker(size * latticeConstant);

  const { balls, sticks } = grow({
    startAtom: atom,
    distance,
    isWithinBounds,
    connectionAnglesDefault: getFccConnectionAngles(),
  });

  return { balls: centerObjects(balls), sticks: centerSticks(sticks) };
}

export function growFccCentered(
  atom: Ball = defaultAtom,
  layers = 1,
) {
  const distance = 2 * atom.radius;

  return grow({
    startAtom: atom,
    distance,
    connectionAnglesDefault: getFccConnectionAngles(),
    maxLayers: layers,
  });
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
  center: Ball = { ...defaultAtom, radius: 100 },
  size = 1,
  useBounds: boolean = false,
) {
  const maxLayers = useBounds ? Math.ceil(Math.sqrt(2) * size) : size;
  // const { a, c } = latticeConstants;
  const a = 2 * center.radius;
  const c = 2 * tetrahedronHeight(a);
  const distance = a;

  console.log(a, c);

  const isWithinBounds = createHexagonalBoundChecker(size * a, size * c);

  function isReverse(reverse: boolean, polarAngle: number) {
    return polarAngle === 90 ? reverse : !reverse;
  }

  return grow({
    startAtom: center,
    distance,
    isWithinBounds,
    connectionAnglesDefault: getHcpConnectionAngles(),
    connectionAnglesReverse: getReverseHcpConnectionAngles(),
    isReverse,
    initialReverse: false,
    maxLayers,
  });
}
