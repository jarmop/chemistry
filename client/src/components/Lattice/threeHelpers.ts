import * as THREE from "three";

function sizeOfObject(obj: THREE.Object3D) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(obj);
  const sizeOfObject = new THREE.Vector3();
  boundingBox.getSize(sizeOfObject);

  return sizeOfObject;
}

// Only works if the group position is the same as the position (center) of the first child
export function centerGroup(group: THREE.Group) {
  const firstChild = group.children[0];
  if (!firstChild.position.equals(group.position)) {
    return;
  }

  const newPosition = new THREE.Vector3();

  // First align the group by the bounding box rather than the center of the first child
  newPosition.add(sizeOfObject(firstChild).multiplyScalar(1 / 2));

  // Then subtract half of the group size from the position
  newPosition.add(sizeOfObject(group).multiplyScalar(-1 / 2));

  group.position.set(
    newPosition.x,
    newPosition.y,
    newPosition.z,
  );
}
