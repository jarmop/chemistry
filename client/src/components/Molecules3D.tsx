import { Lattice } from "./Lattice/Lattice.tsx";
import { Structure } from "./Lattice/structures.ts";

const unitCellIds: (Structure)[] = [
  "PC",
  "BCC",
  "FCC",
  "HCP",
];

export function Molecules3D() {
  return (
    <div
      style={{
        margin: 10,
        display: "grid",
        gridTemplateColumns: "repeat(4, min-content)",
        gap: 10,
      }}
    >
      {unitCellIds.map((id) => <Lattice key={id} unitCellId={id} />)}
    </div>
  );
}
