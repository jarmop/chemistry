import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
// import { init } from "./waveFunctionRenderer.ts";
import { init, Params } from "./SimpleWaveFunctionRenderer.ts";
import { WaveFuntionKey } from "./WaveFunctionHelpers.ts";

const height = 500;
const width = 600;

// let pointerDown = false;

let initialized = false;

interface WaveFunctions3DProps {
  sampler: WaveFuntionKey;
}

type RenderingContext = {
  params: Params;
  rebuild: () => void;
};

export function WaveFunctions3D({ sampler }: WaveFunctions3DProps) {
  const rendererRef = useRef<WebGLRenderer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<RenderingContext>(null);
  //   const eventListenerRef = useRef<(e: PointerEvent) => void>(undefined);

  useEffect(() => {
    if (!initialized && containerRef.current) {
      //   contextRef.current = init(containerRef.current, getRenderer());
      contextRef.current = init(containerRef.current, getRenderer());
      initialized = true;
      //   setEventListeners();
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      const { params, rebuild } = contextRef.current;
      params.sampler = sampler;
      rebuild();
    }
  }, [sampler]);

  function getRenderer() {
    if (!rendererRef.current) {
      rendererRef.current = new WebGLRenderer({ antialias: true });
    }

    return rendererRef.current;
  }

  //   function setPointerMoveListener(
  //     group: RenderingContext["group"],
  //   ) {
  //     const renderer = getRenderer();
  //     if (eventListenerRef.current) {
  //       renderer.domElement.removeEventListener(
  //         "pointermove",
  //         eventListenerRef.current,
  //       );
  //     }

  //     function handlePointerMove(e: PointerEvent) {
  //       if (pointerDown) {
  //         const deltaX = e.movementX;
  //         const deltaY = e.movementY;
  //         const rotateSpeed = Math.PI * 0.002;
  //         group.rotateOnWorldAxis(
  //           new Vector3(1, 0, 0),
  //           deltaY * rotateSpeed,
  //         );
  //         group.rotateOnWorldAxis(
  //           new Vector3(0, 1, 0),
  //           deltaX * rotateSpeed,
  //         );
  //       }
  //     }

  //     renderer.domElement.addEventListener(
  //       "pointermove",
  //       handlePointerMove,
  //     );

  //     eventListenerRef.current = handlePointerMove;
  //   }

  //   function setEventListeners() {
  //     if (!contextRef.current) return;
  //     const renderer = getRenderer();
  //     const { group } = contextRef.current;

  //     renderer.domElement.addEventListener("pointerdown", () => {
  //       pointerDown = true;
  //     });

  //     renderer.domElement.addEventListener("pointerup", () => {
  //       pointerDown = false;
  //     });

  //     setPointerMoveListener(group);
  //   }

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ margin: "0 0 20px 0" }}>
        Wave function shapes
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          ref={containerRef}
          style={{ width, height, position: "relative" }}
        >
        </div>
      </div>
    </div>
  );
}
