import { useState } from "react";
import { PeriodicTable } from "./PeriodicTable.tsx";
import { StateContext } from "./StateContext.ts";
// import { AtomView } from "./AtomView.tsx";
// import { AtomView } from "./AtomView2.tsx";
// import { AtomView } from "./AtomView3.tsx";
// import { AtomView } from "./AtomView4.tsx";
import { AtomView } from "./AtomView5.tsx";
import { AtomData } from "./AtomData.tsx";

// Mass number, A = protons + neutrons --> Isotopes
// Atomic numer, Z, = protons
// When number of electrons is different from the number of protons, the atom becomes charged --> Ions
// Block = which orbital the valence electrons lie in
// Group = Same amount of valence electrons
// Period = Same amount of electron shells

const defaultState = { valence: false, element: 118 };

export function Inspect() {
  const [state, setState] = useState(defaultState);

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
          {
            /* <div style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              id="valence"
              checked={state.valence}
              onChange={(el) =>
                setState({ ...state, valence: el.target.checked })}
            />
            <label htmlFor="valence">Show only the outermost shell</label>
          </div> */
          }
        </div>
      </div>
    </StateContext>
  );
}
