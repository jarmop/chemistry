import { useEffect, useRef, useState } from "react";
import { init } from "./lattice.ts";
import { WebGLRenderer } from "three";
import { UnitCell } from "./structures.ts";

const size = 300;

interface LatticeProps {
  unitCellId: keyof UnitCell;
}

export function Lattice({ unitCellId }: LatticeProps) {
  const [renderer] = useState(new WebGLRenderer({ antialias: true }));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      init(ref.current, renderer, unitCellId);
    }
  }, []);

  return (
    <div>
      <h3 style={{ margin: 0 }}>{unitCellId}</h3>
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
