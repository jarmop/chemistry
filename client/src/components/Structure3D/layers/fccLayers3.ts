import {
  cornerToCenter,
  edgeToCenter,
  getStructure,
  Layer,
} from "./fccLayers.ts";

// const middleTriangles = [
//   [
//     "#-#",
//     "-o",
//   ],
//   [
//     "-o-",
//     "o-o",
//   ],
//   [
//     "-#-",
//     "o-o",
//     "-o-",
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
    "#-o-",
    "-o-o",
  ],
  [
    "#-#-",
    "-o-o",
    "#-o-",
  ],
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
];

const structure = [
  [
    "-o-o-",
    "o-o-o",
    "-o-o",
  ],
  [
    "#-o-",
    "-o-o",
  ],
  [
    "#-#-",
    "-o-o",
    "#-o",
  ],
];

const singleBalls = [
  [
    "o",
  ],
  [
    "-o",
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
    "-o-",
    "o-o",
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
    "o-o-o",
    "-o-o",
    "--o",
  ],
  [
    "-o-o",
    "#-o",
  ],
  [
    "-#-#",
    "#-o",
  ],
];

const fccIsCpp = [
  [
    "-#-#",
    "#-o",
  ],
  [
    "o-o-o-#",
    "-o-o-#-",
    "#-o-#-#",
  ],
  [
    "#-o-#-#",
    "-o-o-#-",
    "o-o-o-#",
  ],
  [
    "-#-#",
    "#-o",
  ],
];

function getStructure3(layer: Layer) {
  const layerZOffsets = [
    edgeToCenter,
    cornerToCenter,
    0,
  ];

  return getStructure(layer, layerZOffsets);
}

export function getFCCLayers3() {
  return {
    middleTriangles: () => getStructure3(middleTriangles),
    structure: () => getStructure3(structure),
    singleBall: () => getStructure3(singleBalls),
    triangles: () => getStructure3(triangles),
    trianglePyramid: () => getStructure3(trianglePyramid),
    "FCC=CCP": () => getStructure3(fccIsCpp),
  };
}
