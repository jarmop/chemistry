import { inorganicMolecules, organicMolecules } from "./molecules.ts";

function MoleculeComparison() {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Inorganic Molecules</h2>
      <MoleculeList molecules={inorganicMolecules} />
      <h2>Organic Molecules</h2>
      <MoleculeList molecules={organicMolecules} />
    </div>
  );
}

function MoleculeList({ molecules }: { molecules: typeof inorganicMolecules }) {
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
      ).map((molecule) => (
        <div
          key={molecule.name}
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
                <td>{molecule.molarMass}</td>
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
      ))}
    </div>
  );
}

export default MoleculeComparison;
