import { getStructure } from "./fccLayers.ts";

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

const trianglePyramid = [[
  "----o",
  "---o-o",
  "--o-o-o",
  "-o-o-o-o",
  "o-o-o-o-o",
], [
  "----o",
  "---o-o",
  "--o-o-o",
  "-o-o-o-o",
], [
  "----o",
  "---o-o",
  "--o-o-o",
], [
  "----o",
  "---o-o",
], [
  "----o",
]];

const squarePyramid = [
  [
    "o-o-o-o-o",
    "-o-o-o-o",
    "--o-o-o",
    "---o-o",
    "----o",
  ],
  [
    "o-o-o-o-o",
    "-o-o-o-o",
    "--o-o-o",
    "---o-o",
  ],
  [
    "o-o-o-o-o",
    "-o-o-o-o",
    "--o-o-o",
  ],
  [
    "o-o-o-o-o",
    "-o-o-o-o",
  ],
  [
    "o-o-o-o-o",
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
    singleBall: () => getStructure(singleBalls),
    triangles: () => getStructure(triangles),
    triangles2: () => getStructure(triangles2),
    trianglePyramid: () => getStructure(trianglePyramid),
    "FCC=CCP": () => getStructure(fccIsCpp),
  };
}
