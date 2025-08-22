import {
  cornerToCenter,
  edgeToCenter,
  getStructure,
  Layer,
} from "./fccLayers.ts";

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
    "o-o-o-o",
    "-o-o-o",
    "--o-o",
    "---o",
  ],
  [
    "-o-o-o",
    "--o-o",
    "---o",
  ],
  [
    "------",
    "--o-o",
    "---o",
  ],
  [
    "-------",
    "---o--",
    "-----",
    "----",
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
    singleBall: () => getStructure3(singleBalls),
    triangles: () => getStructure3(triangles),
    trianglePyramid: () => getStructure3(trianglePyramid),
  };
}
