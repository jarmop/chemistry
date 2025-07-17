import { useState } from "react";
import { PeriodicTable } from "./PeriodicTable/PeriodicTable.tsx";
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
                  element: element ? element.protons : undefined,
                })}
            />
          </div>
        </div>
        {element && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "10px",
              borderLeft: "1px solid black",
              overflowY: "scroll",
              width: "330px",
              height: "100vh",
              position: "fixed",
              right: 0,
              top: 0,
              background: "white",
            }}
          >
            <div>
              <AtomData />
            </div>
            <div>
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
              {/* <AtomView /> */}
            </div>
          </div>
        )}
      </div>
    </StateContext>
  );
}
