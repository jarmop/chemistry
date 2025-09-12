import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
// import { init } from "./waveFunctionRenderer.ts";
import { init } from "./moleculeRenderer.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface Molecule3DProps {
}

export function Molecule3D({}: Molecule3DProps) {
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
    <div
      ref={containerRef}
      style={{ width, height, border: "1px solid black" }}
    >
    </div>
  );
}
