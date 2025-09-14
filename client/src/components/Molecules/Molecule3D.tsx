import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import { init } from "./moleculeRenderer.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface Molecule3DProps {
  name: string;
  useRealRadius: boolean;
}

type RenderingContext = {
  rebuild: (name: string, useRealRadius: boolean) => void;
};

export function Molecule3D({ name, useRealRadius }: Molecule3DProps) {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);

  useEffect(() => {
    if (!initialized && containerRef.current) {
      contextRef.current = init(
        containerRef.current,
        getRenderer(),
        name,
        useRealRadius,
      );
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      const { rebuild } = contextRef.current;
      rebuild(name, useRealRadius);
    }
  }, [name, useRealRadius]);

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
