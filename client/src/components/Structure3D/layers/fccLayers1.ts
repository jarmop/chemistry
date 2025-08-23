import { getFccStructure } from "./fccLayers.ts";

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
    structure: () => getFccStructure(structure),
    layers: () => getFccStructure(layers),
    singleBall: () => getFccStructure(singleBalls),
    triangles: () => getFccStructure(triangles),
    triangles2: () => getFccStructure(triangles2),
    trianglePyramid: () => getFccStructure(trianglePyramid),
    squarePyramid: () => getFccStructure(squarePyramid),
    "FCC=CCP": () => getFccStructure(fccIsCpp),
  };
}
