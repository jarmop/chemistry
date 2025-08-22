import { Vector3 } from "three";
import { degreeToRadius, radiusToDegree } from "../common/latticeHelpers.ts";

function isWithinBounds(
  position: Vector3,
  xzBoundaryMin: number,
  maxDy: number,
) {
  const { x, y, z } = position;
  const dx = Math.abs(x);
  const dz = Math.abs(z);
  const dxz = Math.floor(Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2)));
  const dy = Math.abs(y);

  const xzAngleFromXAxis = radiusToDegree(Math.atan(dz / dx));

  /**
   * Angle between dxz and the line perpendicular to a side of the hexagon.
   * Side of a hexagon covers 60 degrees. We translate the angle like this:
   * 0 --> 30
   * 15 --> 15
   * 30 --> 0
   * 45 --> 15
   * 60 --> 30
   *
   * Then we can calculate the max boundary at that angle
   */
  const simplifiedAngle = Math.abs(xzAngleFromXAxis % 60 - 30);

  const maxDxz = Math.ceil(
    xzBoundaryMin / Math.cos(degreeToRadius(simplifiedAngle)),
  );

  return dxz <= maxDxz && dy <= maxDy;
}

export function createHexagonalBoundChecker(sizeA: number, sizeC: number) {
  const xzBoundaryMin = sizeA * Math.cos(Math.PI / 6);
  const maxDy = sizeC / 2;

  return (position: Vector3) => isWithinBounds(position, xzBoundaryMin, maxDy);
}
