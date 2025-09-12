import { useState } from "react";
import { Molecule3D } from "./Molecule3D.tsx";
import { formulas, Molecule } from "./moleculeRenderer.ts";

export function Molecules() {
  const [formula, setFormula] = useState<Molecule["formula"]>("H2O");
  const [useRealRadius, setUseRealRadius] = useState(false);

  return (
    <>
      <h1>Molecules</h1>
      <div style={{ display: "flex" }}>
        <Molecule3D formula={formula} useRealRadius={useRealRadius} />
        <div>
          <div>
            <select
              value={formula}
              onChange={(e) =>
                setFormula(e.target.value as Molecule["formula"])}
              style={{ cursor: "pointer" }}
            >
              {formulas.map((f) => <option key={f} value={f}>{f}</option>)}
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
