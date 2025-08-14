import { useStore } from "../store.ts";
import { Structure3D } from "./Lattice/Structure3D.tsx";
import { getStructureMapKeys } from "./Lattice/structures.ts";

export function Structures3D() {
  const structureMapKeys = useStore((state) => state.selectedStructureMapKeys);
  const toggleStructureMapKey = useStore((state) => {
    return state.toggleStructureMapKey;
  });

  return (
    <>
      <h1>Atomic structures</h1>
      {getStructureMapKeys().map((key) => (
        <button
          type="button"
          key={key}
          style={{
            background: structureMapKeys.includes(key)
              ? "lightblue"
              : "lightgrey",
            cursor: "pointer",
            marginRight: 2,
            // border: "none",
            // borderRight: "1px solid black",
          }}
          onClick={() => toggleStructureMapKey(key)}
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
        {structureMapKeys.map((id) => (
          <Structure3D
            key={id}
            structureMapKey={id}
          />
        ))}
      </div>
    </>
  );
}
