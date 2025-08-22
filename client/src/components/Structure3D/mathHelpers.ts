export function triangleHeight(sideLength: number) {
  return sideLength * Math.sqrt(3) / 2;
  // return sideLength * Math.sin(Math.PI / 3);
}

export function tetrahedronHeight(edgeLength: number) {
  // return edgeLength * Math.sqrt(2 / 3);
  return edgeLength * Math.sqrt(6) / 3;
}

export const tetrahedronPlaneEdgeAngle = Math.acos(tetrahedronHeight(1));

export function squareDiameterToSide(diameter: number) {
  return diameter / Math.SQRT2;
}

export function cubeDiameterToEdge(diameter: number) {
  return diameter / Math.sqrt(3);
}
