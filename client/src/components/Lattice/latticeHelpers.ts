import * as THREE from "three";
import { Ball } from "./types.ts";

const radInDeg = 180 / Math.PI;

export function degreeToRadius(deg: number) {
  return deg / radInDeg;
}

export function radiusToDegree(rad: number) {
  return rad * radInDeg;
}

export function getMinMaxDimensions(vectors: THREE.Vector3[]) {
  const min = new THREE.Vector3();
  const max = new THREE.Vector3();
  vectors.forEach((vector) => {
    if (vector.x > max.x) {
      max.x = vector.x;
    } else if (vector.x < min.x) {
      min.x = vector.x;
    }
    if (vector.y > max.y) {
      max.y = vector.y;
    } else if (vector.y < min.y) {
      min.y = vector.y;
    }
    if (vector.z > max.z) {
      max.z = vector.z;
    } else if (vector.z < min.z) {
      min.z = vector.z;
    }
  });

  return { min, max };
}

export function centerBalls(balls: Ball[]) {
  const { max } = getMinMaxDimensions(balls.map((b) => b.position));

  const adjustment = new THREE.Vector3();
  adjustment.copy(max).multiplyScalar(-1 / 2);

  return balls.map((ball) => ({
    ...ball,
    position: new THREE.Vector3().copy(ball.position).add(adjustment),
  }));
}

/**
 * @param polarAngle Goes 180 degrees, counter-clockwise, along the xy plane, starting from the negative y axis
 * @param azimuthalAngle Goes 360 degrees, clockwise, around the y axis, starting from the xy plane point indicated by the polarAngle
 */
export function getPointOnSphereSurface(
  center: THREE.Vector3,
  radius: number,
  polarAngle: number,
  azimuthalAngle: number,
) {
  const polarAngleRad = degreeToRadius(polarAngle);
  const azimuthalAngleRad = degreeToRadius(azimuthalAngle);

  // console.log(center);

  const [cx, cy, cz] = center;

  const dx = radius * Math.sin(polarAngleRad) * Math.cos(azimuthalAngleRad);
  const dz = radius * Math.sin(polarAngleRad) * Math.sin(azimuthalAngleRad);
  const dy = -radius * Math.cos(polarAngleRad);

  return new THREE.Vector3(
    cx + Math.round(dx),
    cy + Math.round(dy),
    cz + Math.round(dz),
  );
}
