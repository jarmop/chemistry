import { useEffect, useRef, useState } from "react";
import { init } from "./lattice.ts";
import { WebGLRenderer } from "three";
import { UnitCell } from "./structures.ts";

const size = 200;

interface LatticeProps {
  unitCell: UnitCell;
}

export function Lattice({ unitCell }: LatticeProps) {
  const [renderer] = useState(new WebGLRenderer({ antialias: true }));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      init(ref.current, renderer, unitCell);
    }
  }, []);

  return (
    <div>
      <h3 style={{ margin: 0 }}>{unitCell}</h3>
      <div
        ref={ref}
        // style={{ width: globalThis.innerWidth, height: globalThis.innerHeight }}
        // style={{ width: "60%", height: .5 * globalThis.innerHeight }}
        style={{ width: size, height: size }}
      >
      </div>
    </div>
  );
}
