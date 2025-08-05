import { Lattice } from "./Lattice/Lattice.tsx";

export function Molecules3D() {
  return (
    <div
      style={{
        margin: 10,
        display: "grid",
        gridTemplateColumns: "repeat(3, min-content)",
        gap: 10,
      }}
    >
      <Lattice unitCellId="PC" />
      <Lattice unitCellId="BCC" />
      <Lattice unitCellId="FCC" />
      <Lattice unitCellId="HCP" />
    </div>
  );
}
