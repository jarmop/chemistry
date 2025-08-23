import { getHcpStructure } from "./hcpLayers.ts";

const structure = [
  [
    "#-o-o-",
    "-o-o-o",
    "#-o-o",
  ],
  [
    "#-o-o",
    "-#-o",
  ],
  [
    "#-o-o-",
    "-o-o-o",
    "#-o-o",
  ],
];

const layers = [
  [
    "-o-o-o",
    "o-o-o",
    "-o-o-o",
    "o-o-o",
  ],
  [
    "-o-o-o",
    "o-o-o",
    "-o-o-o",
    "o-o-o",
  ],
  [
    "-o-o-o",
    "o-o-o",
    "-o-o-o",
    "o-o-o",
  ],
];

const singleBalls = [
  [
    "o",
  ],
  [
    "o",
  ],
  [
    "o",
  ],
  [
    "o",
  ],
];

const triangles = [
  [
    "-o-",
    "o-o",
  ],
  [
    "-o-",
    "o-o",
  ],
  [
    "-o-",
    "o-o",
  ],
  [
    "-o-",
    "o-o",
  ],
];

const triangles2 = [
  [
    "o-o",
    "-o",
  ],
  [
    "o-o",
    "-o-",
  ],
  [
    "o-o",
    "-o-",
  ],
  [
    "o-o",
    "-o",
  ],
];

export function getHCPLayers1() {
  return {
    structure: () => getHcpStructure(structure),
    layers: () => getHcpStructure(layers),
    singleBall: () => getHcpStructure(singleBalls),
    triangles: () => getHcpStructure(triangles),
    triangles2: () => getHcpStructure(triangles2),
  };
}
