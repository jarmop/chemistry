import { useEffect, useRef } from "react";
import { init } from "../ElectronProbabilityExample/electronProbabilityExample.ts";

export function ElectronProbabilityDensity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      init(containerRef.current);
    }
  }, []);

  return <div ref={containerRef} style={{ position: "fixed", inset: 0 }}></div>;
}
