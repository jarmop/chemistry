import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./elements.json" with { type: "json" };
import {
  getMaximumNumberOfElectronsPerShell,
  getMaximumNumberOfElectronsPerSubShell,
} from "./helpers.ts";
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
  const maxNumberOfElectronsPerSubShell =
    getMaximumNumberOfElectronsPerSubShell();

  const electronsPerShell = element.electrons.map((perSubShell) =>
    perSubShell.reduce((acc, curr) => acc + curr, 0)
  );

  const subShellLetters = ["s", "p", "d", "f"];

  const electronConfigNotation = element.electrons.map(
    (numElPerSubShell, shell) => {
      return numElPerSubShell.map((numEl, subShell) => (
        <span key={`${shell}-${subShell}`}>
          {shell + 1}
          {subShellLetters[subShell]}
          <sup>{numEl}</sup>
        </span>
      ));
    },
  );

  return (
    <div>
      <h1 style={{ margin: " 0" }}>{element.name}</h1>

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
            <td>{electronsPerShell.reduce((acc, curr) => acc + curr, 0)}</td>
          </tr>
        </tbody>
      </table>

      <div>{electronConfigNotation}</div>
      <br />

      <table className="electronShells">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th colSpan={2} style={{ background: "pink" }}>s</th>
            <th colSpan={6} style={{ background: "lightyellow" }}>p</th>
            <th colSpan={10} style={{ background: "lightblue" }}>d</th>
            <th colSpan={14} style={{ background: "lightgreen" }}>f</th>
            {
              /* <th colSpan={18} style={{ background: "violet" }}>g</th>
            <th colSpan={22} style={{ background: "orange" }}>h</th>
            <th colSpan={24} style={{ background: "beige" }}>j</th> */
            }
          </tr>
        </thead>
        <tbody>
          {maxNumberOfElectronsPerShell.map((maxEl, i) => {
            const n = i + 1;
            const numEl = electronsPerShell[n - 1] || 0;
            const arr: React.ReactNode[] = [];

            const numElPerSubShell = element.electrons[n - 1];

            const colorPerSubshell = [
              "pink",
              "lightyellow",
              "lightblue",
              "lightgreen",
            ];

            maxNumberOfElectronsPerSubShell.slice(0, 4).forEach(
              (maxElOnSubShell, subShell) => {
                const color = colorPerSubshell[subShell];
                const numElOnSubShell = numElPerSubShell?.[subShell];

                if (numElOnSubShell !== undefined) {
                  for (let e = 0; e < maxElOnSubShell; e++) {
                    arr.push(
                      <td
                        key={`${subShell}-${e}`}
                        style={{
                          background: e >= numElOnSubShell
                            ? "lightgrey"
                            : color,
                        }}
                      >
                      </td>,
                    );
                  }
                } else {
                  arr.push(
                    <td key={maxElOnSubShell} colSpan={maxElOnSubShell}></td>,
                  );
                }
              },
            );

            return (
              <tr key={i}>
                <th>{n}</th>
                <td
                  style={{
                    padding: "0 4px",
                    background: "lightgrey",
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
