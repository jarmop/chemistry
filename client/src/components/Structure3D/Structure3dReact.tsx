import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { TrackballControls, TransformControls } from "@react-three/drei";
import {
  getStructureMap,
  StructureMap,
  StructureMapKey,
} from "./structures.ts";
import { Ball, Stick } from "./types.ts";
import { useStore } from "../../store.ts";
import { SphereGeometry } from "three";

const near = 1;
const far = 5000;
const fov = 70;
const zoom = 800;

interface Structure3DReactProps {
  structureMapKey: StructureMapKey;
}

export function Structure3DReact(
  { structureMapKey }: Structure3DReactProps,
) {
  const foo = useRef(null)
  console.log("Structure3DReact");
  const showBallAndStick = useStore((state) => state.showBallAndStick);
  const showGizmo = useStore((state) => state.showGizmo);

  const structureMap = getStructureMap(structureMapKey);

  if (!structureMap) {
    return;
  }

  const [selectedStructureKey, selectStructureKey] = useState(
    Object.keys(structureMap)[0] as keyof StructureMap,
  );

  function getBallsAndSticks(structureKey: keyof StructureMap) {
    return (structureMap[structureKey] as () => {
      balls: Ball[];
      sticks: Stick[];
    })();
  }

  const { balls, sticks } = getBallsAndSticks(selectedStructureKey);

  // const ballsAndSticks = useMemo(
  //   () => getBallsAndSticks(selectedStructureKey),
  //   [selectedStructureKey],
  // );

  return (
    <Canvas
      camera={{ fov, near, far, position: [0, 0, zoom] }}
    >
      <TransformControls
        mode="rotate"
        size={2}
        enabled={showGizmo}
        showX={showGizmo}
        showY={showGizmo}
        showZ={showGizmo}
      >
        <group>
          {sticks.map((s, i) => <StickView key={i} s={s} />)}
          {balls.map((b, i) => (
            <mesh key={i} position={b.position}>
              <sphereGeometry
                args={[b.radius * (showBallAndStick ? 1 / 2 : 1)]}
              />
              <meshPhongMaterial args={[{ color: "red" }]} />
            </mesh>
          ))}
        </group>
      </TransformControls>
      <directionalLight position={[1, 1, 1]} color="white" intensity={2.5} />
      <directionalLight position={[-1, -1, 1]} color="white" intensity={1.5} />
      <TrackballControls noPan noRotate />
    </Canvas>
  );
}

interface StrucProps {
  structureMapKey: StructureMapKey;
}

// function Struc({ structureMapKey }: StrucProps) {
//   const [selectedStructureKey, selectStructureKey] = useState(
//     Object.keys(structureMap)[0] as keyof StructureMap,
//   );

//   function getBallsAndSticks(structureKey: keyof StructureMap) {
//     return (structureMap[structureKey] as () => {
//       balls: Ball[];
//       sticks: Stick[];
//     })();
//   }
//   const { balls, sticks } = getBallsAndSticks(selectedStructureKey);
// }

const stickRadius = 10;
const stickRadialSegments = 16;

function StickView({ s }: { s: Stick }) {
  const ref = useRef<Mesh>(null);
  // const ref = useRef<SphereGeometry>(null);

  useLayoutEffect(() => {
    console.log("layouteffect");
    const meshO = ref.current;
    if (!meshO) {
      console.log("not mesh");
      return;
    }

    // meshO.geometry.translate(0, distance * 0.5, 0);

    // console.log("before", meshO.rotation);
    meshO.lookAt(s.end);
    // Rotate the cylinder by 90 degrees around the X-axis to align it with the z-axis.
    meshO.rotateX(Math.PI * 0.5);
    // meshO.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI * 0.5);
    // Translate the cylinder up by half its height to center it on the line between points A and B.
    meshO.translateY(distance * 0.5);

    // console.log("after", meshO.rotation);
  });

  // useLayoutEffect(() => {
  //   console.log("layouteffect");
  //   const geom = ref.current;
  //   if (!geom) {
  //     console.log("not geom");
  //     return;
  //   }

  //   geom.translate(0, distance * 0.5, 0);

  // });

  // useEffect(() => {
  //   console.log("layouteffect");
  //   const meshO = ref.current;
  //   if (!meshO) {
  //     return;
  //   }
  //   // console.log("before", meshO.rotation);
  //   meshO.lookAt(s.end);
  //   // Rotate the cylinder by 90 degrees around the X-axis to align it with the z-axis.
  //   meshO.rotateX(Math.PI * 0.5);
  //   // meshO.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI * 0.5);
  //   // Translate the cylinder up by half its height to center it on the line between points A and B.
  //   meshO.translateY(distance * 0.5);

  //   // console.log("after", meshO.rotation);
  // }, []);

  const distance = s.start.distanceTo(s.end);
  return (
    <mesh
      ref={ref}
      position={s.start}
    >
      <cylinderGeometry
        args={[
          stickRadius,
          stickRadius,
          distance,
          stickRadialSegments,
        ]}
      />
      <meshPhongMaterial args={[{ color: "gray" }]} />
    </mesh>
  );
}
