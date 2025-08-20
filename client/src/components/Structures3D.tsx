import { useStore } from "../store.ts";
import { Structure3D } from "./Structure3D/Structure3D.tsx";
import { getStructureMapKeys } from "./Structure3D/structures.ts";

export function Structures3D() {
  const structureMapKeys = useStore((state) => state.selectedStructureMapKeys);
  const toggleStructureMapKey = useStore((state) => {
    return state.toggleStructureMapKey;
  });
  const showBallAndStick = useStore((state) => state.showBallAndStick);
  const toggleShowBallAndStick = useStore((state) =>
    state.toggleShowBallAndStick
  );

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
      &nbsp; &nbsp; &nbsp;
      <span>
        <label style={{ cursor: "pointer" }}>
          <input
            name="show-ball-and-stick"
            type="checkbox"
            style={{ cursor: "pointer" }}
            checked={showBallAndStick}
            onChange={toggleShowBallAndStick}
          />
          Show ball & stick
        </label>
      </span>
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
