import { Vector3 } from "three";
import {
  centerBalls,
  centerObjects,
  centerSticks,
  getPointOnSphereSurface,
  radiusToDegree,
} from "../latticeHelpers.ts";
import { Ball } from "../types.ts";
import { createCubicBoundChecker } from "./cubic.ts";
import { grow } from "../grow.ts";
import { tetrahedronPlaneEdgeAngle } from "../mathHelpers.ts";

const defaultRadius = 100;

const defaultAtom: Ball = {
  position: new Vector3(0, 0, 0),
  color: "red",
  radius: defaultRadius,
};

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

const tetrahedronPlaneEdgeAngleInDegrees = radiusToDegree(
  tetrahedronPlaneEdgeAngle,
);

function getFccHexagonalAnglesA() {
  const anglesHexagon = [{
    polarAngle: tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 30, diff: 120 },
  }, {
    polarAngle: 90,
    azimuthalAngle: { offset: 0, diff: 60 },
  }, {
    polarAngle: 180 - tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 90, diff: 120 },
  }];

  const angles: [number, number][] = [];
  anglesHexagon.forEach(({ polarAngle, azimuthalAngle }) => {
    for (
      let angle = azimuthalAngle.offset;
      angle < 360;
      angle += azimuthalAngle.diff
    ) {
      angles.push([polarAngle, angle]);
    }
  });

  return angles;
}

function getFccHexagonalAnglesB() {
  const anglesHexagon = [{
    polarAngle: tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 30, diff: 120 },
  }, {
    polarAngle: 90,
    azimuthalAngle: { offset: 0, diff: 60 },
  }, {
    polarAngle: 180 - tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 90, diff: 120 },
  }];

  const angles: [number, number][] = [];
  anglesHexagon.forEach(({ polarAngle, azimuthalAngle }) => {
    for (
      let angle = azimuthalAngle.offset;
      angle < 360;
      angle += azimuthalAngle.diff
    ) {
      angles.push([polarAngle, angle]);
    }
  });

  return angles;
}

function getFccHexagonalAnglesC() {
  const anglesHexagon = [{
    polarAngle: tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 90, diff: 120 },
  }, {
    polarAngle: 90,
    azimuthalAngle: { offset: 0, diff: 60 },
  }, {
    polarAngle: 180 - tetrahedronPlaneEdgeAngleInDegrees,
    azimuthalAngle: { offset: 90, diff: 120 },
  }];

  const angles: [number, number][] = [];
  anglesHexagon.forEach(({ polarAngle, azimuthalAngle }) => {
    for (
      let angle = azimuthalAngle.offset;
      angle < 360;
      angle += azimuthalAngle.diff
    ) {
      angles.push([polarAngle, angle]);
    }
  });

  return angles;
}

type Connections = (0 | 1 | 2)[];

type ConnectionMap = {
  top: Connections;
  middle: Connections;
  bottom: Connections;
};

const angleMap = {
  A: getFccHexagonalAnglesA(),
  B: getFccHexagonalAnglesB(),
  C: getFccHexagonalAnglesC(),
} as const;

type Layer = keyof typeof angleMap;

const colorMap = {
  A: "red",
  B: "blue",
  C: "yellow",
} as const;

function getStructure(connectionMaps: ConnectionMap[], startLayer: Layer) {
  const startBall = { ...defaultAtom, color: colorMap[startLayer] };
  const balls: Ball[] = [startBall];

  function addConnections(
    connectionMap: ConnectionMap,
    center: Ball,
    layer: Layer,
  ) {
    const angles = angleMap[layer];
    const layerAbove = layer === "A" ? "B" : layer === "B" ? "C" : "A";
    const layerBelow = layer === "A" ? "C" : layer === "B" ? "A" : "C";
    [...connectionMap.bottom, ...connectionMap.middle, ...connectionMap.top]
      .forEach((hasConnection: number, i) => {
        if (!hasConnection) {
          return;
        }

        const [polarAngle, azimuthalAngle] = angles[i];

        const position = getPointOnSphereSurface(
          center.position,
          center.radius * 2,
          polarAngle,
          azimuthalAngle,
        );

        let connectionLayer = layer;
        if (polarAngle < 90) {
          connectionLayer = layerBelow;
        } else if (polarAngle > 90) {
          connectionLayer = layerAbove;
        }

        const newBall = {
          ...center,
          position,
          color: colorMap[connectionLayer],
        };

        balls.push(newBall);

        if (hasConnection === 2) {
          addConnections(
            connectionMaps.pop() as ConnectionMap,
            newBall,
            connectionLayer,
          );
        }
      });
  }

  const connectionMap = connectionMaps.pop();

  if (connectionMap) {
    addConnections(
      connectionMap,
      startBall,
      startLayer,
    );
  }

  return { balls, sticks: [] };
}

function getStructure1() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 0],
      middle: [0, 1, 1, 0, 0, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 2, 0],
      middle: [0, 0, 0, 0, 1, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 1, 2],
      middle: [0, 0, 0, 0, 1, 1],
      bottom: [1, 1, 1],
    },
  ];

  const startLayer: Layer = "B";

  return getStructure(connectionMaps, startLayer);
}

function getStructure2() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 0],
      middle: [0, 0, 0, 0, 1, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 1, 2],
      middle: [0, 0, 0, 0, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 2, 0],
      middle: [0, 0, 0, 0, 1, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 1, 2],
      middle: [0, 0, 0, 0, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 2, 0],
      middle: [0, 0, 0, 0, 1, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 1, 2],
      middle: [0, 0, 0, 0, 1, 1],
      bottom: [1, 1, 1],
    },
  ];

  const startLayer: Layer = "B";

  return getStructure(connectionMaps, startLayer);
}

function getStructure3() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 0],
      middle: [0, 1, 1, 0, 0, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [0, 1, 1, 0, 0, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [0, 1, 1, 0, 0, 0],
      bottom: [1, 1, 1],
    },
  ];

  const startLayer: Layer = "B";

  return getStructure(connectionMaps, startLayer);
}

function getStructure4() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 0],
      middle: [0, 0, 0, 0, 1, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [1, 0, 2],
      middle: [0, 0, 0, 0, 0, 0],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [0, 0, 0, 0, 0, 0],
      bottom: [0, 0, 1],
    },
  ];

  const startLayer: Layer = "B";

  return getStructure(connectionMaps, startLayer);
}

function getStructure5() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 0],
      middle: [1, 1, 1, 1, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [1, 1, 1, 1, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 0, 0],
      middle: [0, 0, 0, 0, 0, 2],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 2, 1],
      middle: [1, 1, 1, 1, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [1, 1, 1, 1, 1, 1],
      bottom: [0, 0, 0],
    },
  ];

  const startLayer: Layer = "A";

  return getStructure(connectionMaps, startLayer);
}

function getStructure6() {
  const connectionMaps: ConnectionMap[] = [
    {
      top: [0, 0, 1],
      middle: [0, 0, 0, 0, 0, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [0, 2, 1],
      middle: [0, 0, 0, 0, 1, 1],
      bottom: [0, 0, 0],
    },
    {
      top: [2, 0, 0],
      middle: [0, 0, 0, 0, 0, 0],
      bottom: [0, 0, 0],
    },
  ];

  const startLayer: Layer = "A";

  return getStructure(connectionMaps, startLayer);
}

export function getFCC() {
  return {
    structure6: getStructure6,
    structure1: getStructure1,
    structure2: getStructure2,
    structure3: getStructure3,
    structure4: getStructure4,
    structure5: getStructure5,
    unitCell: growFcc,
    connections: growFccCentered,
  };
}
