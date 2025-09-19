import { useState } from "react";
import { Molecule3D } from "./Molecule3D.tsx";
import { MoleculeName, moleculeNames } from "./mol.ts";
import { OrganicMoleculeSelector } from "./OrganicMoleculeSelector.tsx";
import { useMolecule } from "./useMolecule.ts";

const moleculeNameOptions = [
  ...moleculeNames,
  "Sucrose",
  "Maltose",
  "Lactose",
];

const hydroCarbonNames = [
  "Methane", "Ethane", "Propane", "Hexane",
  "Propene", 
  "Propyne", 
  "hexatriene",
  "hexatriyne",
  "cyclohexatriene",
  "benzene",
];

export function Molecules() {
  const [name, setName] = useState(
    "Formic acid",
  );
  // const [molecule, setMolecule] = useState<Molecule>();
  const [useRealRadius, setUseRealRadius] = useState(false);

  const { molecule } = useMolecule(name);

  return (
    <>
      <h1>Molecules</h1>
      <div style={{ display: "flex" }}>
        <Molecule3D
          molecule={molecule}
          useRealRadius={useRealRadius}
        />
        <div>
          <div>
            <input type="text" onBlur={(e) => setName(e.target.value)} />
          </div>
          <div>
            Hydrocarbons:
            <select
              value={name}
              onChange={(e) => setName(e.target.value as MoleculeName)}
              style={{ cursor: "pointer" }}
            >
              {hydroCarbonNames.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            Other:
            <select
              value={name}
              onChange={(e) => setName(e.target.value as MoleculeName)}
              style={{ cursor: "pointer" }}
            >
              {moleculeNameOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
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
