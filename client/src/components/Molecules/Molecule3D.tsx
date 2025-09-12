import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WebGLRenderer } from "three";
// import { init } from "./waveFunctionRenderer.ts";
import { formulas, init, Molecule } from "./moleculeRenderer.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface Molecule3DProps {
  formula: Molecule["formula"];
  useRealRadius: boolean;
}

type RenderingContext = {
  rebuild: (formula: Molecule["formula"], useRealRadius: boolean) => void;
};

export function Molecule3D({ formula, useRealRadius }: Molecule3DProps) {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);

  useEffect(() => {
    if (!initialized && containerRef.current) {
      contextRef.current = init(
        containerRef.current,
        getRenderer(),
        formula,
        useRealRadius,
      );
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      const { rebuild } = contextRef.current;
      rebuild(formula, useRealRadius);
    }
  }, [formula, useRealRadius]);

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
