import { useEffect, useState } from "react";
import { Molecule3D } from "./Molecule3D.tsx";
import { MoleculeName, moleculeNames } from "./mol.ts";
import { OrganicMoleculeSelector } from "./OrganicMoleculeSelector.tsx";
import { fetchMol } from "./pubChemApi.ts";
import { parse } from "./molParser.ts";
import { Molecule } from "./types.ts";

let fetched = false;

export function Molecules() {
  const [name, setName] = useState<MoleculeName>(
    "Formic acid (Carboxylic acid)",
  );
  const [molecule, setMolecule] = useState<Molecule>();
  const [useRealRadius, setUseRealRadius] = useState(false);

  useEffect(() => {
    if (fetched) {
      return;
    }
    fetchMol("methanol").then((mol) => {
      if (mol) {
        const molecule = parse(mol);
        setMolecule(molecule);
        console.log(molecule);
      }
    });
    fetched = true;
  }, []);

  return (
    <>
      <h1>Molecules</h1>
      <div style={{ display: "flex" }}>
        {molecule &&
          (
            <Molecule3D
              name={name}
              molecule={molecule}
              useRealRadius={useRealRadius}
            />
          )}

        <div>
          <div>
            <select
              value={name}
              onChange={(e) => setName(e.target.value as MoleculeName)}
              style={{ cursor: "pointer" }}
            >
              {moleculeNames.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <OrganicMoleculeSelector />
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
      {/* <MolReader /> */}
    </>
  );
}
