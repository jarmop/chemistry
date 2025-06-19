import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./elements.json" with { type: "json" };
import { sum } from "./helpers.ts";

const electronRadius = 5;

function getRadius(n = 0) {
  return Math.sqrt(
    n * Math.pow(electronRadius, 2),
  );
}

function ValenceElectrons({ r = 0, electrons = 2 }) {
  const electronViews: React.ReactNode[] = [];
  const rad = 2 * Math.PI / electrons;
  for (let i = 0; i < electrons; i++) {
    const x = (r - 8) * Math.cos(i * rad);
    const y = -(r - 8) * Math.sin(i * rad);
    electronViews.push(
      <circle key={i} cx={x} cy={y} r={electronRadius} fill="yellow" />,
    );
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
  const nonValenceElectrons = sum(electronsPerShell.slice(0, -1));

  const nucleusRadius = getRadius(element.protons);
  const nonValenceElectronRadius = nucleusRadius +
    getRadius(nonValenceElectrons);

  return (
    <g transform={`translate(${x}, ${y})`} stroke="black" fill="transparent">
      <ValenceElectrons
        r={nonValenceElectronRadius + 14}
        electrons={valenceElectrons}
      />
      <circle r={nonValenceElectronRadius} fill="lightgreen" />
      <circle r={nucleusRadius} fill="red" />
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
