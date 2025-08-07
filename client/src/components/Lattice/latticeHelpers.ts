import * as THREE from "three";

export function centerVectorArray(vectors: THREE.Vector3[]) {
  const max = new THREE.Vector3();
  vectors.forEach((v) => {
    if (v.x > max.x) {
      max.x = v.x;
    }
    if (v.y > max.y) {
      max.y = v.y;
    }
    if (v.z > max.z) {
      max.z = v.z;
    }
  });

  const adjustment = new THREE.Vector3();
  adjustment.copy(max).multiplyScalar(-1 / 2);

  vectors.forEach((v) => v.add(adjustment));
}
