import { useState } from "react";
import { Molecule3D } from "./Molecule3D.tsx";
import { Molecule, moleculeNames } from "./moleculeRenderer.ts";

export function Molecules() {
  const [name, setName] = useState<Molecule["name"]>("Water");
  const [useRealRadius, setUseRealRadius] = useState(false);

  return (
    <>
      <h1>Molecules</h1>
      <div style={{ display: "flex" }}>
        <Molecule3D name={name} useRealRadius={useRealRadius} />
        <div>
          <div>
            <select
              value={name}
              onChange={(e) => setName(e.target.value as Molecule["name"])}
              style={{ cursor: "pointer" }}
            >
              {moleculeNames.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <input
              id="useRealRadius"
              type="checkbox"
              checked={useRealRadius}
              onChange={() => setUseRealRadius(!useRealRadius)}
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="useRealRadius" style={{ cursor: "pointer" }}>
              Use real radius
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
