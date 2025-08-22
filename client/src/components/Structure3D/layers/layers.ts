const hexagon = [
  "..H..",
  "..1..",
  "H1C1H",
];

const hexagon1 = [
  [0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0],
];

function getStructure1() {
}

export function getLayerStructures() {
  return {
    structure1: getStructure1,
  };
}
