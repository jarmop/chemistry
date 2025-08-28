import { useEffect, useRef } from "react";
import { init } from "./marchingCubesScalar.ts";
// import { init } from "./simpleMarchingCubes.ts";
// import { init } from "./isoSurfaceExample.ts";
// import { init } from "./isoSurfaceExample2.js";
// import { init } from "./isoSurfaceExample2.ts";
// import { init } from "./electronProbabilityExample.ts";

let initialized = false;

export function ElectronProbabilityDensity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !initialized) {
      init(containerRef.current);
      initialized = true;
    }
  }, []);

  return <div ref={containerRef} style={{ position: "fixed", inset: 0 }}></div>;
}
