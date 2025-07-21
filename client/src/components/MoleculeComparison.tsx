import { inorganicMolecules, organicMolecules } from "../data/molecules.ts";
import elements from "../data/elements.ts";
import { calculateMolarMassFormatted } from "../library/helpers.ts";

type Molecule = (typeof inorganicMolecules)[number];

export function MoleculeComparison() {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h1>Molecules</h1>
      <h2>Inorganic Molecules</h2>
      <MoleculeList molecules={inorganicMolecules} />
      <h2>Organic Molecules</h2>
      <MoleculeList molecules={organicMolecules} />
    </div>
  );
}

function MoleculeList({ molecules }: { molecules: Molecule[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "10px",
      }}
    >
      {molecules.filter((m) => m.image).sort((a, b) =>
        a.molarMass - b.molarMass
      ).map((molecule) => <Molecule key={molecule.name} molecule={molecule} />)}
    </div>
  );
}

function Molecule({ molecule }: { molecule: Molecule }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid black",
        padding: "10px",
      }}
    >
      <table
        style={{ height: "fit-content", margin: "0", fontSize: "14px" }}
      >
        <tbody>
          <tr>
            <td>
              Name:
            </td>
            <td style={{ textWrap: "nowrap" }}>{molecule.name}</td>
          </tr>
          <tr>
            <td>
              Formula:
            </td>
            <td>{molecule.formula}</td>
          </tr>
          <tr>
            <td style={{ textWrap: "nowrap" }}>
              Molar Mass:
            </td>
            <td>
              {molecule.molarMass
                ? molecule.molarMass
                : calculateMolarMassFormatted(molecule.formula, elements)}
            </td>
          </tr>
        </tbody>
      </table>
      <img
        src={molecule.image}
        alt={molecule.name}
        style={{
          maxWidth: "100px",
          height: "fit-content",
          marginLeft: "10px",
        }}
      />
    </div>
  );
}
