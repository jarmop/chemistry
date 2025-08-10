import { Vector3 } from "three";
import { Ball } from "./types.ts";
import {
  centerBalls,
  degreeToRadius,
  getPointOnSphereSurface,
  radiusToDegree,
} from "./latticeHelpers.ts";
import { getBccConnectionAngles } from "./connections.ts";
import { tetrahedronHeight } from "./mathHelpers.ts";

const rockSaltConnections: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [90, 90],
  [90, 180],
  [90, 270],
];

function isWithin(vectorRaw: Vector3, min: Vector3, max: Vector3) {
  const vector = new Vector3(
    Math.round(vectorRaw.x),
    Math.round(vectorRaw.y),
    Math.round(vectorRaw.z),
  );
  return vector.x >= min.x && vector.x <= max.x &&
    vector.y >= min.y && vector.y <= max.y &&
    vector.z >= min.z && vector.z <= max.z;
}

function getBallKey(position: Vector3) {
  function roundToTen(v: number) {
    return Math.round(v / 10) * 10;
  }
  return position.toArray().map(roundToTen).join("-");
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

  const ballMap: Record<string, Ball> = {
    [getBallKey(atomA.position)]: atomA,
  };

  addConnections(atomA, atomB);

  const balls = Object.values(ballMap);

  return centerBalls(balls);
}

export function growBcc(atomA: Ball, atomB: Ball, shape: Vector3) {
  const distance = atomA.radius + atomB.radius;
  const latticeConstant = Math.ceil(2 * distance / Math.sqrt(3));

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

  const ballMap: Record<string, Ball> = {
    [getBallKey(atom.position)]: atom,
  };

  addConnections(atom, true);

  const balls = Object.values(ballMap);

  return centerBalls(balls);
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
  // console.log("------- growFcc --------");

  const distance = 2 * atom.radius;
  const latticeConstant = 2 * distance / Math.sqrt(2);

  // console.log(latticeConstant);

  const maxSize = new Vector3(
    (shape.x - 1) * latticeConstant,
    (shape.y - 1) * latticeConstant,
    (shape.z - 1) * latticeConstant,
  );
  const minSize = (new Vector3()).copy(atom.position);

  // console.log(maxSize);

  const connectionAngles = getFccConnectionAngles();

  function addConnections(atom: Ball, log = false) {
    // console.log("------- addConnections --------");
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
        // if (!ballMap[key] && (isWithin(position, minSize, maxSize) || log)) {
        if (!ballMap[key] && isWithin(position, minSize, maxSize)) {
          const ball = {
            ...atom,
            position,
            color: log
              ? isWithin(position, minSize, maxSize) ? "lightgreen" : "red"
              : atom.color,
          };
          ballMap[key] = ball;
          // addConnections(ball);
          connections.push(ball);

          // if (log && !isWithin(position, minSize, maxSize)) {
          //   console.log("------ did not fit --------");
          //   console.log(position);
          // }

          // if (log) {
          //   console.log("pushed ball");
          //   console.log(position);
          // }
          // if (position.z > 210) {
          //   console.log("-------- getPointOnSphereSurface ---------");
          //   console.log(key);
          //   console.log(atom.position, polarAngle, azimuthalAngle);
          // }
        } else if (log && !isWithin(position, minSize, maxSize)) {
          console.log("------ did not fit --------");
          console.log(position);
        }
      },
    );

    // console.log(connections.length);
    // console.log(connections.map((c) => c.position));

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

  // const connections2 = addConnections(connections[0]);

  // ballMap[getBallKey(connections[0].position)] = {
  //   ...connections[0],
  //   color: "blue",
  // };

  // addConnections(connections2[0], true);
  // addConnections(connections[1]);

  const balls = Object.values(ballMap);

  // console.log(balls.length);

  return centerBalls(balls);
}

const tetrahedronPlaneEdgeAngle = radiusToDegree(
  Math.acos(tetrahedronHeight(1)),
);

const hcpPolar2 = tetrahedronPlaneEdgeAngle;
const hcpPolar3 = 180 - tetrahedronPlaneEdgeAngle;

function getHcpMiddleAngles() {
  const angles: [number, number][] = [];
  const polarAngle = 90;
  for (let azimuthalAngle = 0; azimuthalAngle < 360; azimuthalAngle += 60) {
    angles.push([polarAngle, azimuthalAngle]);
  }

  return angles;
}

const hcpMiddleAngles = getHcpMiddleAngles();

export function getHcpConnectionAngles(reverse = false): [number, number][] {
  const topAngles: [number, number][] = [];
  const bottomAngles: [number, number][] = [];
  for (
    let azimuthalAngle = reverse ? 30 : 90;
    azimuthalAngle < 360;
    azimuthalAngle += 120
  ) {
    topAngles.push([hcpPolar2, azimuthalAngle]);
    bottomAngles.push([hcpPolar3, azimuthalAngle]);
  }

  return [
    ...hcpMiddleAngles,
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
  const maxDy = size * c / 2;

  const xzBoundaryMax = size * a;
  const xzBoundaryMin = xzBoundaryMax * Math.cos(Math.PI / 6);

  function isWithinBounds(position: Vector3) {
    if (!useBounds) {
      return true;
    }
    const { x, y, z } = position;
    const dx = Math.abs(x);
    const dz = Math.abs(z);
    const dxz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));
    const dy = Math.abs(y);

    const xzAngleFromXAxis = radiusToDegree(Math.atan(dz / dx));

    /**
     * Angle between dxz and the line perpendicular to a side of the hexagon
     * Side of a hexagon covers 60 degrees. We translate the angle like this:
     * 0 --> 30
     * 15 --> 15
     * 30 --> 0
     * 45 --> 15
     * 60 --> 30
     *
     * Then we can calculate the max boundary at that angle
     */
    const simplifiedAngle = Math.abs(xzAngleFromXAxis % 60 - 30);

    const maxDxz = Math.ceil(
      xzBoundaryMin / Math.cos(degreeToRadius(simplifiedAngle)),
    );

    return dxz <= maxDxz && dy <= maxDy;
  }

  const ballMap: Record<string, boolean> = {
    [getBallKey(center.position)]: true,
  };
  // const ballMap: Record<string, Ball> = {
  //   [getBallKey(center.position)]: { ...center, color: "blue" },
  // };

  function addConnections(atom: Ball, reverse = false) {
    const connections: { ball: Ball; reverse: boolean }[] = [];
    const connectionAngles = reverse
      ? getReverseHcpConnectionAngles()
      : getHcpConnectionAngles();

    connectionAngles.forEach(
      ([polarAngle, azimuthalAngle]) => {
        const position = getPointOnSphereSurface(
          atom.position,
          distance,
          polarAngle,
          azimuthalAngle,
        );

        const key = getBallKey(position);
        // if (!ballMap[key] && isWithinBounds(position)) {
        if (!ballMap[key]) {
          ballMap[key] = true;

          if (isWithinBounds(position)) {
            const ball = {
              ...atom,
              position,
              // color: !isWithinBounds(position) ? "red" : atom.color,
              color: atom.color,
            };

            connections.push({
              ball,
              reverse: polarAngle === 90 ? reverse : !reverse,
            });
          }
        }
      },
    );

    return connections;
  }

  let layerCount = 0;

  let balls: Ball[] = [{ ...center, color: "blue" }];
  let connections = addConnections(center);
  balls = [...balls, ...connections.map((c) => c.ball)];

  layerCount++;
  while (layerCount < maxLayers && connections.length > 0) {
    const newConnections: { ball: Ball; reverse: boolean }[][] = [];
    connections.forEach(({ ball, reverse }) => {
      newConnections.push(addConnections(ball, reverse));
    });
    connections = newConnections.flat();
    balls = [...balls, ...connections.map((c) => c.ball)];

    layerCount++;
  }

  return balls;
}
