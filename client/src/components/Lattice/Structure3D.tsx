import { useEffect, useRef, useState } from "react";
import { getMolecule, getOutline, init, RenderingContext } from "./lattice.ts";
import { Vector3, WebGLRenderer } from "three";
import {
  getStructureMap,
  StructureMap,
  StructureMapKey,
} from "./structures.ts";

const size = 300;

let pointerDown = false;

interface LatticeProps {
  structureMapKey: StructureMapKey;
}

export function Structure3D({ structureMapKey: unitCellId }: LatticeProps) {
  const [renderer] = useState(new WebGLRenderer({ antialias: true }));
  const [showOutline, setShowOutline] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);
  const eventListenerRef = useRef<(e: PointerEvent) => void>(undefined);

  const structureMap = getStructureMap(unitCellId);

  const [selectedStructureKey, selectStructureKey] = useState(
    Object.keys(structureMap)[0] as keyof StructureMap,
  );

  useEffect(() => {
    if (containerRef.current && !contextRef.current) {
      const balls = structureMap[selectedStructureKey];

      contextRef.current = init(
        containerRef.current,
        renderer,
        balls,
        showOutline,
      );
      setEventListeners();
    }
  }, []);

  function changeStructure(structureKey: keyof StructureMap) {
    selectStructureKey(structureKey);
    if (!contextRef.current) {
      return;
    }
    const { scene, molecule, transformControls } = contextRef.current;

    scene.remove(molecule);
    transformControls.detach();

    const balls = structureMap[structureKey];
    const newMolecule = getMolecule(balls);
    const newOutline = getOutline(balls);

    if (showOutline) {
      newMolecule.add(newOutline);
    }

    scene.add(newMolecule);
    transformControls.attach(newMolecule);
    transformControls.getHelper().visible = false;

    contextRef.current.molecule = newMolecule;
    contextRef.current.outline = newOutline;

    setPointerMoveListener(transformControls, newMolecule);
  }

  function toggleOutline() {
    if (!contextRef.current) {
      return;
    }
    const { molecule, outline } = contextRef.current;
    if (showOutline) {
      molecule.remove(outline);
      setShowOutline(false);
    } else {
      molecule.add(outline);
      setShowOutline(true);
    }
  }

  function setPointerMoveListener(
    transformControls: RenderingContext["transformControls"],
    molecule: RenderingContext["molecule"],
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
        molecule.rotateOnWorldAxis(
          new Vector3(1, 0, 0),
          deltaY * rotateSpeed,
        );
        molecule.rotateOnWorldAxis(
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
    const { transformControls, molecule } = contextRef.current;

    renderer.domElement.addEventListener("pointerdown", () => {
      pointerDown = true;
    });

    renderer.domElement.addEventListener("pointerup", () => {
      pointerDown = false;
    });

    setPointerMoveListener(transformControls, molecule);
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
          <h4 style={{ margin: 0 }}>{unitCellId}</h4>
          <select
            name="viestructurew"
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
