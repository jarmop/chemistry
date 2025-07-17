import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements, { elementUnits } from "./data/elements.ts";
import {
  getMaximumNumberOfElectronsPerShell,
  maximumNumberOfElectronsPerSubShell,
} from "./library/helpers.ts";
import { Element } from "./library/types.ts";

const subShells = [
  { name: "s", size: 2, color: "pink" },
  { name: "p", size: 6, color: "yellow" },
  { name: "d", size: 10, color: "lightblue" },
  { name: "f", size: 14, color: "lightgreen" },
];

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

  return (
    <div>
      <h1 style={{ margin: " 0" }}>{element.name}</h1>

      <table style={{ margin: "6px 0" }} className="dataTable">
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
            <td>Category:</td>
            <td>{element.category}</td>
          </tr>
          <tr>
            <td>Block:</td>
            <td>{element.block}</td>
          </tr>
          <tr>
            <td>Electronegativity:</td>
            <td>
              {element.electronegativity} {elementUnits.electronegativity}
            </td>
          </tr>
          <tr>
            <td>Origin:</td>
            <td>{element.origin}</td>
          </tr>
          <tr>
            <td>Phase:</td>
            <td>{element.phase}</td>
          </tr>
          <tr>
            <td>Structure:</td>
            <td>{element.structure}</td>
          </tr>
          {element.structureNotes &&
            (
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textWrap: "wrap",
                    paddingBottom: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {element.structureNotes}
                </td>
              </tr>
            )}
          <tr>
            <td>Density:</td>
            <td>{element.density} {elementUnits.density}</td>
          </tr>
          <tr>
            <td>
              Electron configuration:
            </td>
            {element.electronConfigurationConfirmed
              ? <td>{element.electronConfiguration}</td>
              : (
                <td style={{ color: "gray" }} title="unconfirmed">
                  {element.electronConfiguration}
                </td>
              )}
          </tr>
          <tr>
            <td>Electron affinity:</td>
            <td>{element.electronAffinity} {elementUnits.electronAffinity}</td>
          </tr>
          <tr>
            <td>Ionization energy:</td>
            <td>{element.ionizationEnergy} {elementUnits.ionizationEnergy}</td>
          </tr>
          <tr>
            <td>Atomic radius:</td>
            <td>{element.atomicRadius} {elementUnits.atomicRadius}</td>
          </tr>
          <tr>
            <th
              colSpan={2}
              style={{ textAlign: "left", paddingTop: "10px" }}
            >
              Abundance
            </th>
          </tr>
          <tr>
            <td>On earth's crust:</td>
            <td>
              {element.abundanceOnEarthCrust}{" "}
              {elementUnits.abundanceOnEarthCrust}
            </td>
          </tr>
          <tr>
            <td>On earth's crust rank:</td>
            <td>{element.abundanceOnEarthCrustRank}</td>
          </tr>
          <tr>
            <td>Mass in human body:</td>
            <td>{element.massInHumanBody} {elementUnits.massInHumanBody}</td>
          </tr>
          <tr>
            <td>Atoms in human body:</td>
            <td>{element.atomsInHumanBody} {elementUnits.atomsInHumanBody}</td>
          </tr>
          <tr>
            <td>In Milky Way:</td>
            <td>
              {element.abundanceInMilkyWay} {elementUnits.abundanceInMilkyWay}
            </td>
          </tr>
        </tbody>
      </table>

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
}

function Orbitals({ numElPerSubShell }: OrbitalsProps) {
  const orbitals: React.ReactNode[] = [];

  maximumNumberOfElectronsPerSubShell.forEach(
    (maxElOnSubShell, subShell) => {
      const numElOnSubShell = numElPerSubShell?.[subShell];

      if (numElOnSubShell !== undefined) {
        const color = subShells[subShell].color;

        const fullOrbitals = Math.max(
          numElOnSubShell - maxElOnSubShell / 2,
          0,
        );
        for (let o = 0; o < fullOrbitals; o++) {
          orbitals.push(
            <Orbital
              key={`full-${subShell}-${o}`}
              height="100%"
              color={color}
            />,
          );
        }

        const halfOrbitals = numElOnSubShell - fullOrbitals * 2;
        for (let o = 0; o < halfOrbitals; o++) {
          orbitals.push(
            <Orbital
              key={`half-${subShell}-${o}`}
              height="50%"
              color={color}
            />,
          );
        }

        const emptyOrbitals = maxElOnSubShell / 2 - fullOrbitals - halfOrbitals;
        for (let o = 0; o < emptyOrbitals; o++) {
          orbitals.push(
            <Orbital
              key={`empty-${subShell}-${o}`}
              color={color}
            />,
          );
        }
      } else {
        orbitals.push(
          <td
            key={maxElOnSubShell}
            colSpan={maxElOnSubShell / 2}
          >
          </td>,
        );
      }
    },
  );

  return orbitals;
}

interface OrbitalProps {
  height?: string;
  color: string;
}

function Orbital({ height, color }: OrbitalProps) {
  return (
    <td
      style={{
        padding: "0",
        height: "18px",
        verticalAlign: "top",
      }}
    >
      {height && (
        <div
          style={{
            width: "100%",
            height: height,
            background: color,
            borderBottom: "1px solid black",
          }}
        >
        </div>
      )}
    </td>
  );
}
