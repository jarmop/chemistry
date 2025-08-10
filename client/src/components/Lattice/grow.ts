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

// export function getBccConnectionAngles() {
//   const cubeDiameterAngle = radiusToDegree(Math.acos(1 / Math.sqrt(3)));
//   const angles: [number, number][] = [];
//   [cubeDiameterAngle, 180 - cubeDiameterAngle].forEach((polarAngle) => {
//     for (let azimuthalAngle = 45; azimuthalAngle < 360; azimuthalAngle += 90) {
//       angles.push([polarAngle, azimuthalAngle]);
//     }
//   });
//   return angles;
// }

export function getFccConnectionAngles() {
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

export function getFccConnectionAngles2() {
  const connectionAngles: [number, number][] = [
    [90, 0],
    [90, 60],
    [90, 120],
    [90, 180],
    [90, 240],
    [90, 300],
    [35, 30],
    [35, 150],
    [35, 270],
    [145, 90],
    [145, 210],
    [145, 330],
  ];

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
