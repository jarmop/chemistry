import {
  cornerToCenter,
  edgeToCenter,
  getFccStructure,
  Layer,
} from "./fccLayers.ts";

// const middleTriangles = [
//   [
//     "#-#",
//     "-o",
//   ],
//   [
//     "o-o",
//     "-o-",
//   ],
//   [
//     "-o-",
//     "o-o",
//   ],
//   [
//     "#-#",
//     "-o",
//   ],
// ];

const middleTriangles = [
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
  [
    "-o-o",
    "#-o-",
  ],
  [
    "#-o-",
    "-o-o",
  ],
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
];

const structure = [
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
  [
    "-o-o",
    "#-o",
  ],
  [
    "#-o",
    "-o-o",
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
    "-o",
  ],
  [
    "o",
  ],
];

const triangles = [
  [
    "o-o",
    "-o",
  ],
  [
    "o-o",
    "-o-",
  ],
  [
    "-o-",
    "o-o",
  ],
  [
    "o-o",
    "-o",
  ],
];

const trianglePyramid = [
  [
    "--o",
    "-o-o",
    "o-o-o",
  ],
  [
    "--o",
    "-o-o",
  ],
  [
    "-#",
    "#-o",
  ],
];

const connections = [
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
  [
    "-o-o",
    "#-o-#",
    "-#-#",
  ],
  [
    "#-o-#",
    "-o-o",
    "#-#-#",
  ],
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
];

const fccIsCpp = [
  [
    "#-#-#",
    "-#-#",
    "#-o-#",
  ],
  [
    "#-o-#",
    "-o-o-",
    "o-o-o",
  ],
  [
    "-#-#-",
    "o-o-o",
    "-o-o-",
    "#-o-#",
  ],
  [
    "#-#-#",
    "-#-#",
    "#-o-#",
  ],
];

function getStructure2(layer: Layer) {
  const layerZOffsets = [
    0,
    cornerToCenter,
    edgeToCenter,
  ];

  return getFccStructure(layer, layerZOffsets);
}

export function getFCCLayers2() {
  return {
    middleTriangles: () => getStructure2(middleTriangles),
    structure: () => getStructure2(structure),
    singleBall: () => getStructure2(singleBalls),
    triangles: () => getStructure2(triangles),
    trianglePyramid: () => getStructure2(trianglePyramid),
    connections: () => getStructure2(connections),
    "FCC=CCP": () => getStructure2(fccIsCpp),
  };
}
