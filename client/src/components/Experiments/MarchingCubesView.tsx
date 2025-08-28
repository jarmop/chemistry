import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import { init } from "./marchingCubesRenderer.ts";

const height = 500;
const width = 800;

// let pointerDown = false;

let initialized = false;

export function MarchingCubesView() {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized && containerRef.current) {
      init(containerRef.current, getRenderer());
      initialized = true;
    }
  }, []);

  function getRenderer() {
    if (!rendererRef.current) {
      rendererRef.current = new WebGLRenderer({ antialias: true });
    }

    return rendererRef.current;
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
