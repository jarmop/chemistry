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

  const subShells = [
    { name: "s", size: 2, color: "pink" },
    { name: "p", size: 6, color: "lightyellow" },
    { name: "d", size: 10, color: "lightblue" },
    { name: "f", size: 14, color: "lightgreen" },
  ];

  const electronConfigNotation = element.electrons.map(
    (numElPerSubShell, shell) => {
      return numElPerSubShell.map((numEl, subShell) => (
        <span key={`${shell}-${subShell}`}>
          {shell + 1}
          {subShells[subShell].name}
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
          <tr>
            <td>Block:</td>
            <td>{element.block}</td>
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
            {subShells.map(({ name, size, color }) => (
              <th
                colSpan={size}
                style={{ background: color, width: `${size * 12}px` }}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {maxNumberOfElectronsPerShell.map((maxEl, i) => {
            const n = i + 1;
            const numEl = electronsPerShell[n - 1] || 0;
            const arr: React.ReactNode[] = [];
            const numElPerSubShell = element.electrons[n - 1];

            maxNumberOfElectronsPerSubShell.slice(0, 4).forEach(
              (maxElOnSubShell, subShell) => {
                const numElOnSubShell = numElPerSubShell?.[subShell];

                if (numElOnSubShell !== undefined) {
                  for (let e = 0; e < maxElOnSubShell; e++) {
                    const color = numElOnSubShell === undefined
                      ? ""
                      : e >= numElOnSubShell
                      ? "lightgrey"
                      : subShells[subShell].color;

                    arr.push(
                      <td
                        key={`${subShell}-${e}`}
                        style={{
                          background: color,
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
