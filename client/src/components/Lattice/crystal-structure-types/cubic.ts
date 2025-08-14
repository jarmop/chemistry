import { Vector3 } from "three";

function isWithinCube(vectorRaw: Vector3, min: Vector3, max: Vector3) {
  const vector = new Vector3(
    Math.round(vectorRaw.x),
    Math.round(vectorRaw.y),
    Math.round(vectorRaw.z),
  );
  return vector.x >= min.x && vector.x <= max.x &&
    vector.y >= min.y && vector.y <= max.y &&
    vector.z >= min.z && vector.z <= max.z;
}

export function createCubicBoundChecker(size: number, latticeConstant: number) {
  const maxSize = new Vector3(
    (size - 1) * latticeConstant,
    (size - 1) * latticeConstant,
    (size - 1) * latticeConstant,
  );
  const minSize = new Vector3();

  return (position: Vector3) => isWithinCube(position, minSize, maxSize);
}
