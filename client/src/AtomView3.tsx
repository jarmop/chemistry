/**
 * Electrons per subshell is 2 x [allowed values of ml]
 * Allowed values of ml is (2 x l + 1)
 * number of allowed values of l is the same as n
 *
 */

import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./elements.json" with { type: "json" };

function Electron({ x = 0, y = 0, isValence = false }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
    >
      {/* <circle r="5" fill={isValence ? "rgb(0,255,0)" : "yellow"} /> */}
      <circle r="5" fill={isValence ? "lightgreen" : "yellow"} />
      <line x1="-3" y1="0" x2="3" y2="0" stroke="black" strokeWidth={2} />
    </g>
  );
}

function Shell({ r = 0, electrons = 2, isOuterShell = false, fill = "black" }) {
  const electronViews: React.ReactNode[] = [];
  const rad = 2 * Math.PI / electrons;
  for (let i = 0; i < electrons; i++) {
    const x = (r - 7) * Math.cos(i * rad);
    const y = -(r - 7) * Math.sin(i * rad);
    electronViews.push(
      <Electron
        key={i}
        x={x}
        y={y}
        isValence={isOuterShell}
      />,
    );
  }

  return (
    <g>
      <circle
        r={r}
        fill={isOuterShell ? "lightgrey" : fill}
        strokeWidth={isOuterShell ? 0 : 1}
        // strokeWidth={1}
        stroke="black"
      />
      {electronViews}
    </g>
  );
}

export function Atom({ x = 300, y = 300 }) {
  const { valence, element: protons } = useContext(StateContext);

  const element = elements.find((el) => el.protons === protons);
  if (!element) {
    return <div>Not found</div>;
  }

  const electronsPerShell = element.electrons.map((perSubShell) =>
    perSubShell.reduce((acc, curr) => acc + curr, 0)
  );

  const visibleShells = valence
    ? electronsPerShell.slice(-1)
    : electronsPerShell;

  const nucleusRadius = Math.sqrt(element.protons / Math.PI) * 10;

  const shellViews: React.ReactNode[] = [];
  for (let i = visibleShells.length - 1; i >= 0; i--) {
    const numEl = visibleShells[i];
    shellViews.push(
      <Shell
        key={i}
        r={nucleusRadius + (i + 1) * 14}
        electrons={numEl}
        isOuterShell={i === visibleShells.length - 1}
        // fill={i % 2 == 0 ? "white" : "grey"}
      />,
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`} stroke="black" fill="transparent">
      {
        /* {visibleShells.map((numEl, i) => (
        <Shell
          key={i}
          r={nucleusRadius + (i + 1) * 14}
          electrons={numEl}
          isOuterShell={i === visibleShells.length - 1}
        />
      ))} */
      }

      {shellViews}

      <circle r={nucleusRadius} fill="red" />
      <line x1="-4" y1="0" x2="4" y2="0" stroke="black" strokeWidth={2} />
      <line x1="0" y1="-4" x2="0" y2="4" stroke="black" strokeWidth={2} />
    </g>
  );
}

const svgWidth = 340;
const svgHeight = 340;

export function AtomView() {
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ border: "1px solid black" }}
    >
      <Atom x={svgWidth / 2} y={svgHeight / 2} />
    </svg>
  );
}
