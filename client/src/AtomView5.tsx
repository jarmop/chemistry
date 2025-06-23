import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./data/elements.json" with { type: "json" };
import { sum } from "./library/helpers.ts";

/**
 * Lewis structure
 */

const electronRadius = 2;

function ValenceElectrons({ r = 0, electrons = 2, isHelium = false }) {
  const electronViews: React.ReactNode[] = [];
  const electronPairs = isHelium ? 1 : Math.max(0, electrons - 4);
  const lonelyElectrons = electrons - electronPairs * 2;
  const pairRadOffset = 1 / r * 6;

  function addElectron(rad: number) {
    const x = r * Math.cos(rad);
    const y = -r * Math.sin(rad);
    electronViews.push(
      <circle key={rad} cx={x} cy={y} r={electronRadius} fill="black" />,
    );
  }

  const radStep = electrons === 2 ? Math.PI : Math.PI / 2;
  let rad = electronPairs === 0 || isHelium ? 0 : radStep;

  for (let i = 0; i < electronPairs; i++) {
    addElectron(rad - pairRadOffset);
    addElectron(rad + pairRadOffset);
    rad += radStep;
  }
  for (let i = 0; i < lonelyElectrons; i++) {
    addElectron(rad);
    rad += radStep;
  }

  return electronViews;
}

export function Atom({ x = 300, y = 300 }) {
  const { element: protons } = useContext(StateContext);

  const element = elements.find((el) => el.protons === protons);
  if (!element) {
    return <div>Not found</div>;
  }

  const electronsPerShell = element.electrons.map((perSubShell) =>
    perSubShell.reduce((acc, curr) => acc + curr, 0)
  );

  const valenceElectrons = sum(electronsPerShell.slice(-1));
  const atomRadius = 22;

  return (
    <g transform={`translate(${x}, ${y})`} stroke="black" fill="transparent">
      <ValenceElectrons
        r={atomRadius}
        electrons={valenceElectrons}
        isHelium={element.name === "Helium"}
      />
      <text
        y={9}
        fill="black"
        fontSize="28px"
        textAnchor="middle"
        fontFamily="Roboto Condensed"
      >
        {element.symbol}
      </text>
    </g>
  );
}

const svgSize = 240;

export function AtomView() {
  return (
    <svg
      width={svgSize}
      height={svgSize}
      style={{ border: "1px solid black" }}
    >
      <Atom x={svgSize / 2} y={svgSize / 2} />
    </svg>
  );
}
