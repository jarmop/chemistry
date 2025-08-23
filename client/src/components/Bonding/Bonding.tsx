import { useEffect, useRef } from "react";
import { Vector3, WebGLRenderer } from "three";
import { init, RenderingContext } from "./bondRenderer.ts";

const height = 500;
const width = 800;

let pointerDown = false;

export function Bonding() {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);
  const eventListenerRef = useRef<(e: PointerEvent) => void>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      contextRef.current = init(containerRef.current, getRenderer());
      setEventListeners();
    }
  }, []);

  function getRenderer() {
    if (!rendererRef.current) {
      rendererRef.current = new WebGLRenderer({ antialias: true });
    }

    return rendererRef.current;
  }

  function setPointerMoveListener(
    group: RenderingContext["group"],
  ) {
    const renderer = getRenderer();
    if (eventListenerRef.current) {
      renderer.domElement.removeEventListener(
        "pointermove",
        eventListenerRef.current,
      );
    }

    function handlePointerMove(e: PointerEvent) {
      if (pointerDown) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        const rotateSpeed = Math.PI * 0.002;
        group.rotateOnWorldAxis(
          new Vector3(1, 0, 0),
          deltaY * rotateSpeed,
        );
        group.rotateOnWorldAxis(
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
    const renderer = getRenderer();
    const { group } = contextRef.current;

    renderer.domElement.addEventListener("pointerdown", () => {
      pointerDown = true;
    });

    renderer.domElement.addEventListener("pointerup", () => {
      pointerDown = false;
    });

    setPointerMoveListener(group);
  }

  return (
    <>
      <h1>Bonding</h1>
      <div
        ref={containerRef}
        style={{ width, height }}
      >
      </div>
    </>
  );
}
