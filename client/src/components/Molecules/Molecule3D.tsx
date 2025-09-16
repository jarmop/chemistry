import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import { init } from "./moleculeRenderer.ts";
import { Molecule } from "./types.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface Molecule3DProps {
  name: string;
  molecule: Molecule;
  useRealRadius: boolean;
}

type RenderingContext = {
  rebuild: (molecule: Molecule, useRealRadius: boolean) => void;
};

export function Molecule3D({ name, molecule, useRealRadius }: Molecule3DProps) {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);

  useEffect(() => {
    if (!initialized && containerRef.current) {
      contextRef.current = init(
        containerRef.current,
        getRenderer(),
        molecule,
        useRealRadius,
      );
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      const { rebuild } = contextRef.current;
      rebuild(molecule, useRealRadius);
    }
  }, [molecule, useRealRadius]);

  function getRenderer() {
    if (!rendererRef.current) {
      rendererRef.current = new WebGLRenderer({ antialias: true });
    }

    return rendererRef.current;
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{ width, height, border: "1px solid black" }}
      >
      </div>
    </>
  );
}
