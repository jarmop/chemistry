import { getStructure } from "./fccLayers.ts";

const structure = [
  [
    "-#-#-#",
    "#-o-o-",
    "-o-o-o",
    "#-o-o",
  ],
  [
    "-#-#-",
    "#-o-o",
    "-#-o",
  ],
  [
    "-#-o-",
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

const fccIsCpp = [
  [
    "---",
    "----",
    "--o--",
  ],
  [
    "--o",
    "-o-o",
    "o-o-o",
  ],
  [
    "o-o-o",
    "-o-o",
    "--o",
  ],
  [
    "--o",
    "----",
    "-----",
  ],
];

const trianglePyramid = [
  [
    "--o",
    "-o-o",
    "o-o-o",
  ],
  [
    "#-o",
    "-o-o",
  ],
  [
    "#-o",
  ],
];

const squarePyramid = [
  [
    "o-o-o",
    "-o-o",
    "--o",
  ],
  [
    "o-o-o",
    "-o-o",
  ],
  [
    "o-o-o",
  ],
];

const trianglesStackedBehind = [[
  "-o",
  "o-o",
], [
  "-o",
  "o-o",
], [
  "-o",
  "o-o",
], [
  "-o",
  "o-o",
]];

const trianglesStackedForward = [[
  "---",
  "---",
  "---",
  "-o-",
  "o-o",
], [
  "---",
  "---",
  "o-o",
  "-o-",
  "---",
], [
  "---",
  "-o-",
  "o-o",
  "---",
  "---",
], [
  "o-o",
  "-o-",
  "---",
  "---",
  "---",
]];

export function getFCCLayers1() {
  return {
    structure: () => getStructure(structure),
    layers: () => getStructure(layers),
    singleBall: () => getStructure(singleBalls),
    triangles: () => getStructure(triangles),
    triangles2: () => getStructure(triangles2),
    trianglePyramid: () => getStructure(trianglePyramid),
    squarePyramid: () => getStructure(squarePyramid),
    "FCC=CCP": () => getStructure(fccIsCpp),
  };
}
