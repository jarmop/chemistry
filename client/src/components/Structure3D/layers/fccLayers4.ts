import { cornerToCenter, edgeToCenter, getStructure } from "./fccLayers.ts";

const structure = [
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
  [
    "-o-o",
    "--o",
  ],
  // [
  //   "-o-",
  //   "o-o",
  // ],
];

const layerZOffsets2 = [
  edgeToCenter,
  cornerToCenter,
  0,
];

const structure2 = [
  [
    "-o-o",
    "o-o-o",
    "-o-o",
  ],
  // [
  //   "-o-o",
  //   "--o",
  // ],
  [
    "#-o-",
    "-o-o",
  ],
];

export function getFCCLayers4() {
  return {
    structure: () => getStructure(structure),
    structure2: () => getStructure(structure2, layerZOffsets2),
  };
}
