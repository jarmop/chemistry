import { useState } from "react";
import { PeriodicTable } from "./PeriodicTable.tsx";
import { defaultState, StateContext } from "./StateContext.ts";
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

export function Inspect() {
  const [state, setState] = useState(defaultState);

  const element = elements.find((el) => el.protons === state.element);

  return (
    <StateContext value={state}>
      <div
        style={{ display: "flex", flexDirection: "row", maxHeight: "100vh" }}
      >
        <div
          style={{
            overflow: "auto",
            padding: "10px",
            borderRight: "1px solid black",
          }}
        >
          <div>
            <PeriodicTable
              onElementSelected={(element) =>
                setState({
                  ...state,
                  element: state.element === element.protons
                    ? undefined
                    : element.protons,
                })}
            />
          </div>
        </div>
        {element && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "20px",
            }}
          >
            <div>
              <AtomData />
            </div>
            <div style={{ marginTop: "14px" }}>
              <AtomView />
              {element?.thumbnail && (
                <div>
                  <a
                    href={element?.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={element?.thumbnail}
                      alt=""
                      style={{
                        width: "240px",
                        border: "1px solid black",
                        marginTop: "10px",
                      }}
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StateContext>
  );
}
