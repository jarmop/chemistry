import { useEffect, useRef, useState } from "react";
import { init } from "./lattice.ts";
import { WebGLRenderer } from "three";

export function useLattice() {
  console.log("useLattice");
  const [renderer] = useState(new WebGLRenderer({ antialias: true }));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      init(ref.current, renderer);
    }
  }, []);

  return ref;
}
