import { useEffect, useRef, useState } from "react";
import { getOutline, getStructure, init, RenderingContext } from "./lattice.ts";
import { Vector3, WebGLRenderer } from "three";
import {
  getStructureMap,
  StructureMap,
  StructureMapKey,
} from "./structures.ts";
import { Ball, Stick } from "./types.ts";
import { useStore } from "../../store.ts";

const size = 300;

let pointerDown = false;

interface LatticeProps {
  structureMapKey: StructureMapKey;
}

export function Structure3D(
  { structureMapKey: structureMapKey }: LatticeProps,
) {
  const showBallAndStick = useStore((state) => state.showBallAndStick);
  const showGizmo = useStore((state) => state.showGizmo);
  const [renderer] = useState(() => new WebGLRenderer({ antialias: true }));
  const [showOutline, setShowOutline] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);
  const eventListenerRef = useRef<(e: PointerEvent) => void>(undefined);

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

  useEffect(() => {
    if (containerRef.current && !contextRef.current) {
      const { balls, sticks } = getBallsAndSticks(selectedStructureKey);
      if (!balls) {
        return;
      }

      contextRef.current = init(
        containerRef.current,
        renderer,
        balls,
        sticks,
        showOutline,
        showBallAndStick,
      );
      setEventListeners();
    }
  }, []);

  useEffect(() => {
    if (!contextRef.current) {
      return;
    }
    const { scene, structure, transformControls } = contextRef.current;

    scene.remove(structure);
    transformControls.detach();

    const { balls, sticks } = getBallsAndSticks(selectedStructureKey);
    const newStructure = getStructure(balls, sticks, showBallAndStick);
    const newOutline = getOutline(balls);

    if (showOutline) {
      newStructure.add(newOutline);
    }

    scene.add(newStructure);
    transformControls.attach(newStructure);
    transformControls.getHelper().visible = false;

    contextRef.current.structure = newStructure;
    contextRef.current.outline = newOutline;

    setPointerMoveListener(transformControls, newStructure);
  }, [selectedStructureKey, showBallAndStick]);

  useEffect(() => {
    if (!contextRef.current) {
      return;
    }
    const { transformControls } = contextRef.current;
    transformControls.getHelper().visible = showGizmo;
    transformControls.enabled = showGizmo;
  }, [showGizmo]);

  function changeStructure(structureKey: keyof StructureMap) {
    selectStructureKey(structureKey);
  }

  function toggleOutline() {
    if (!contextRef.current) {
      return;
    }
    const { structure, outline } = contextRef.current;
    if (showOutline) {
      structure.remove(outline);
      setShowOutline(false);
    } else {
      structure.add(outline);
      setShowOutline(true);
    }
  }

  function setPointerMoveListener(
    transformControls: RenderingContext["transformControls"],
    structure: RenderingContext["structure"],
  ) {
    if (eventListenerRef.current) {
      renderer.domElement.removeEventListener(
        "pointermove",
        eventListenerRef.current,
      );
    }

    function handlePointerMove(e: PointerEvent) {
      if (pointerDown && !transformControls.enabled) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        const rotateSpeed = Math.PI * 0.002;
        structure.rotateOnWorldAxis(
          new Vector3(1, 0, 0),
          deltaY * rotateSpeed,
        );
        structure.rotateOnWorldAxis(
          new Vector3(0, 1, 0),
          deltaX * rotateSpeed,
        );
      }
    }

    renderer.domElement.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    eventListenerRef.current = handlePointerMove;
  }

  function setEventListeners() {
    if (!contextRef.current) return;
    const { transformControls, structure } = contextRef.current;

    renderer.domElement.addEventListener("pointerdown", () => {
      pointerDown = true;
    });

    renderer.domElement.addEventListener("pointerup", () => {
      pointerDown = false;
    });

    setPointerMoveListener(transformControls, structure);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
          justifyContent: "space-between",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ margin: 0 }}>{structureMapKey}</h4>
          <select
            name="structure"
            value={selectedStructureKey}
            onChange={(e) =>
              changeStructure(e.target.value as keyof StructureMap)}
            style={{ marginLeft: "8px", width: "80px" }}
          >
            {Object.keys(structureMap).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <label>
          <input
            name="outline"
            type="checkbox"
            onChange={toggleOutline}
            checked={showOutline}
          />Show outline
        </label>
      </div>
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
      >
      </div>
    </div>
  );
}
