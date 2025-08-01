import * as THREE from "three";

function getPositions(ballMap: number[][][], size: number) {
  const positions: THREE.Vector3[] = [];

  function getStartValue(length: number) {
    return -(length - 1) / 2;
  }
  let y = getStartValue(ballMap.length);
  ballMap.forEach((layer) => {
    let z = getStartValue(layer.length);
    layer.forEach((row) => {
      let x = getStartValue(row.length);
      row.forEach((hasBall) => {
        if (hasBall) {
          const position = new THREE.Vector3(x, y, z);
          position.multiplyScalar(size);
          positions.push(position);
        }
        x++;
      });
      z++;
    });
    y++;
  });

  return positions;
}

const A = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
];
const B = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0],
];
const fccBallMap = [A, B, A];
const FCC = getPositions(fccBallMap, Math.SQRT2);

const pcBallsA = [
  [1, 1],
  [1, 1],
];
const pcBallMap = [
  pcBallsA,
  pcBallsA,
];
const PC = getPositions(
  pcBallMap,
  2,
);

const bccBallsA = [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1],
];
const bccBallsB = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
const bccBallMap = [bccBallsA, bccBallsB, bccBallsA];
const BCC = getPositions(bccBallMap, 2 / Math.sqrt(3));

export const unitCells = {
  PC,
  BCC,
  FCC,
} as const;

export type UnitCell = keyof typeof unitCells;
