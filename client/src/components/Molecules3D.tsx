import { useStore } from "../store.ts";
import { Lattice } from "./Lattice/Lattice.tsx";
import { getStructureKeys } from "./Lattice/structures.ts";

export function Molecules3D() {
  const unitCellIds = useStore((state) => state.selectedMolecule3Ds);
  const toggleMolecule3D = useStore((state) => {
    return state.toggleMolecule3D;
  });

  return (
    <>
      {getStructureKeys().map((key) => (
        <button
          type="button"
          key={key}
          style={{
            background: unitCellIds.includes(key) ? "lightblue" : "lightgrey",
            cursor: "pointer",
            marginRight: 2,
            // border: "none",
            // borderRight: "1px solid black",
          }}
          onClick={() => toggleMolecule3D(key)}
        >
          {key}
        </button>
      ))}
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
    </>
  );
}
