import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import { init } from "./moleculeRenderer.ts";
import { Molecule } from "./types.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface Molecule3DProps {
  molecule: Molecule | undefined;
  useRealRadius: boolean;
}

type RenderingContext = {
  rebuild: (molecule: Molecule, useRealRadius: boolean) => void;
};

export function Molecule3D({ molecule, useRealRadius }: Molecule3DProps) {
  console.log("Molecule3D");

  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);

  useEffect(() => {
    console.log("effect 1 Molecule3D");

    if (!initialized && containerRef.current) {
      console.log("init Molecule3D");

      contextRef.current = init(
        containerRef.current,
        getRenderer(),
      );
      initialized = true;
    }
  }, []);

  useEffect(() => {
    console.log("effect 2 Molecule3D");

    if (molecule && contextRef.current) {
      console.log("rebuild");

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

  console.log("render Molecule3D");

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
