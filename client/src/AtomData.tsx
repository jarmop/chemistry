import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./elements.json" with { type: "json" };
import { getMaximumNumberOfElectronsPerShell } from "./helpers.ts";
import { Element } from "./types.ts";

export function AtomData() {
  const { element: selectedZ } = useContext(StateContext);
  const element = elements.find((el) => el.protons === selectedZ) as
    | Element
    | undefined;
  if (!element) {
    return;
  }

  const maxNumberOfElectronsPerShell = getMaximumNumberOfElectronsPerShell();

  return (
    <div>
      <h1 style={{ margin: "6px 0" }}>{element.name}</h1>
      <table style={{ margin: "6px 0" }}>
        <tbody>
          <tr>
            <td>Protons:</td>
            <td>{element.protons}</td>
          </tr>
          <tr>
            <td>Neutrons:</td>
            <td>{element.neutrons}</td>
          </tr>
          <tr>
            <td>Electrons:</td>
            <td>{element.electrons.reduce((acc, curr) => acc + curr, 0)}</td>
            {/* <td>{Math.sumPrecise(element.electrons)}</td> */}
          </tr>
        </tbody>
      </table>
      <table className="electronShells">
        <tbody>
          {maxNumberOfElectronsPerShell.map((maxEl, i) => {
            const n = i + 1;
            const numEl = element.electrons[n - 1] || 0;
            const arr = [];
            for (let e = 0; e < maxEl; e++) {
              arr.push(
                <td
                  key={e}
                  style={{ background: e < numEl ? "lightgreen" : "" }}
                >
                </td>,
              );
            }

            return (
              <tr key={i}>
                <th>{n}</th>
                <td
                  style={{
                    padding: "0 4px",
                    background: "rgba(0,0,255,0.2)",
                    fontSize: "14px",
                    width: "40px",
                  }}
                >
                  {`${numEl} / ${maxEl}`}
                </td>
                {arr}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
