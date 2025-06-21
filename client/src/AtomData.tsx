import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./data/elements.json" with { type: "json" };
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

  const electronsPerShell = element.electrons.map((perSubShell) =>
    perSubShell.reduce((acc, curr) => acc + curr, 0)
  );

  const subShells = [
    { name: "s", size: 2, color: "pink" },
    { name: "p", size: 6, color: "yellow" },
    { name: "d", size: 10, color: "lightblue" },
    { name: "f", size: 14, color: "lightgreen" },
  ];

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
          <tr>
            <td>Electronegativity:</td>
            <td>{element.electroNegativity}</td>
          </tr>
          <tr>
            <td>Origin:</td>
            <td>{element.origin}</td>
          </tr>
          {/* <tr>
            <td>Abundance:</td>
            <td>{element.abundanceOnEarthCrust}</td>
          </tr> */}
        </tbody>
      </table>

      {
        /* <div>
        <ElectronConfigNotation
          electrons={element.electrons}
          subShells={subShells}
        />
      </div> */
      }

      <table className="electronShells">
        <thead>
          <tr>
            <th></th>
            {subShells.map(({ name, size, color }) => (
              <th
                key={name}
                colSpan={size / 2}
                style={{ background: color, width: `${size * 6}px` }}
              >
                {name}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {maxNumberOfElectronsPerShell.map((maxEl, i) => {
            const n = i + 1;
            const numEl = electronsPerShell[n - 1] || 0;

            return (
              <tr key={i}>
                <th
                  style={{
                    padding: "2px 4px",
                  }}
                >
                  {n}
                </th>
                <Orbitals
                  numElPerSubShell={element.electrons[n - 1]}
                  subShells={subShells}
                />
                <td
                  style={{
                    padding: "2px 4px",
                    fontSize: "14px",
                    width: "40px",
                  }}
                >
                  {`${numEl} / ${maxEl}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface OrbitalsProps {
  numElPerSubShell: Element["electrons"][number];
  subShells: { name: string; size: number; color: string }[];
}

function Orbitals({ numElPerSubShell, subShells }: OrbitalsProps) {
  const maxNumberOfElectronsPerSubShell =
    getMaximumNumberOfElectronsPerSubShell();
  const orbitals: React.ReactNode[] = [];

  maxNumberOfElectronsPerSubShell.slice(0, 4).forEach(
    (maxElOnSubShell, subShell) => {
      const numElOnSubShell = numElPerSubShell?.[subShell];

      if (numElOnSubShell !== undefined) {
        for (let e = 0; e < maxElOnSubShell; e += 2) {
          const color = subShells[subShell].color;
          // 0 | 1 | 2
          const orbitalFilled = Math.min(
            Math.max(numElOnSubShell - e, 0),
            2,
          );
          const height = orbitalFilled * 50 +
            "%";

          orbitals.push(
            <td
              key={`${subShell}-${e}`}
              style={{
                padding: "0",
                height: "18px",
                verticalAlign: "top",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: height,
                  background: color,
                  borderBottom: orbitalFilled === 1 ? "1px solid black" : "",
                  // boxSizing: "border-box",
                }}
              >
              </div>
            </td>,
          );
        }
      } else {
        orbitals.push(
          <td
            key={maxElOnSubShell}
            colSpan={maxElOnSubShell / 2}
            style={{
              // background: "rgba(0,0,0,0.2)",
            }}
          >
          </td>,
        );
      }
    },
  );

  return orbitals;
}

interface ElectronConfigNotationProps {
  electrons: Element["electrons"];
  subShells: { name: string; size: number; color: string }[];
}

function ElectronConfigNotation(
  { electrons, subShells }: ElectronConfigNotationProps,
) {
  const electronConfigNotation = electrons.map(
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

  return electronConfigNotation;
}
