import { useEffect, useRef, useState } from "react";
import { getMolecule, init, RenderingContext } from "./lattice.ts";
import { Vector3, WebGLRenderer } from "three";
import { Structure, structures } from "./structures.ts";

const size = 300;

let pointerDown = false;

interface LatticeProps {
  unitCellId: Structure;
}

export function Lattice({ unitCellId }: LatticeProps) {
  const [renderer] = useState(new WebGLRenderer({ antialias: true }));
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);
  const eventListenerRef = useRef<(e: PointerEvent) => void>(undefined);

  const views = structures[unitCellId];

  const [view, setView] = useState("unitCell");

  useEffect(() => {
    if (containerRef.current && !contextRef.current) {
      contextRef.current = init(
        containerRef.current,
        renderer,
        views[view],
      );
      setEventListeners();
    }
  }, []);

  function changeView(newView: typeof view) {
    setView(newView);
    if (!contextRef.current) {
      return;
    }
    const { scene, molecule, transformControls } = contextRef.current;

    scene.remove(molecule);
    transformControls.detach();

    const newMolecule = getMolecule(views[newView]);
    scene.add(newMolecule);
    transformControls.attach(newMolecule);
    transformControls.getHelper().visible = false;

    contextRef.current.molecule = newMolecule;

    setPointerMoveListener(transformControls, newMolecule);
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
        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
      >
        <h3 style={{ margin: 0 }}>{unitCellId}</h3>
        <select
          value={view}
          onChange={(e) => changeView(e.target.value as typeof view)}
          style={{ marginLeft: "8px" }}
        >
          {Object.keys(views).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <div
        ref={containerRef}
        // style={{ width: globalThis.innerWidth, height: globalThis.innerHeight }}
        // style={{ width: "60%", height: .5 * globalThis.innerHeight }}
        style={{ width: size, height: size }}
      >
      </div>
    </div>
  );
}
