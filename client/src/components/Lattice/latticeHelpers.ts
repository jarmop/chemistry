import * as THREE from "three";
import { Ball } from "./types.ts";

const radInDeg = 180 / Math.PI;

export function degreeToRadius(deg: number) {
  return deg / radInDeg;
}

export function RadiusToDegree(rad: number) {
  return rad * radInDeg;
}

export function centerBalls(balls: Ball[]) {
  const max = new THREE.Vector3();
  balls.forEach(({ position }) => {
    if (position.x > max.x) {
      max.x = position.x;
    }
    if (position.y > max.y) {
      max.y = position.y;
    }
    if (position.z > max.z) {
      max.z = position.z;
    }
  });

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

  const [cx, cy, cz] = center;

  const dx = radius * Math.sin(polarAngleRad) * Math.cos(azimuthalAngleRad);
  const dz = -radius * Math.sin(polarAngleRad) * Math.sin(azimuthalAngleRad);
  const dy = -radius * Math.cos(polarAngleRad);

  return new THREE.Vector3(
    cx + Math.round(dx),
    cy + Math.round(dy),
    cz + Math.round(dz),
  );
}
