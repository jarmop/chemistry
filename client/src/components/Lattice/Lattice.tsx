import { useEffect, useRef } from "react";
import { init } from "./lattice.ts";

export function Lattice() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      init(ref.current);
    }
  }, []);
  return (
    <div
      ref={ref}
      // style={{ width: globalThis.innerWidth, height: globalThis.innerHeight }}
      style={{ width: "60%", height: .5 * globalThis.innerHeight }}
    >
    </div>
  );
}
