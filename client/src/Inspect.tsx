import { useState } from "react";
import { PeriodicTable } from "./PeriodicTable.tsx";
import { StateContext } from "./StateContext.ts";
import { AtomView } from "./AtomView.tsx";
// import { AtomView } from "./LewisStructure.tsx";
import { AtomData } from "./AtomData.tsx";
import elements from "./data/elements.ts";

// Mass number, A = protons + neutrons --> Isotopes
// Atomic numer, Z, = protons
// When number of electrons is different from the number of protons, the atom becomes charged --> Ions
// Block = which orbital the valence electrons lie in
// Group = Same amount of valence electrons
// Period = Same amount of electron shells

const defaultState = { valence: false, element: 118 };

export function Inspect() {
  const [state, setState] = useState(defaultState);

  const element = elements.find((el) => el.protons === state.element);

  return (
    <StateContext value={state}>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
          <PeriodicTable
            onElementSelected={(element) =>
              setState({ ...state, element: element.protons })}
          />
        </div>
        <div style={{ marginRight: "20px" }}>
          <AtomData />
        </div>
        <div>
          <AtomView />
          {element?.image && (
            <div>
              <img
                src={element?.image}
                alt=""
                style={{
                  width: "240px",
                  border: "1px solid black",
                  marginTop: "10px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </StateContext>
  );
}
