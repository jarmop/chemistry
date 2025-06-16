/**
 * Electrons per subshell is 2 x [allowed values of ml]
 * Allowed values of ml is (2 x l + 1)
 * number of allowed values of l is the same as n
 *
 * n = 1
 * l = 0
 * ml = 0
 * electrons per subshell = [2]
 *
 * n = 2
 * l = 0, 1,
 * ml = -1, 0, 1
 * electrons per subshell = [2, 2+6=8]
 *
 * n = 3
 * l = 0, 1, 2
 * ml = -2, -1, 0, 1, 2
 * electrons per subshell = [2, 2+6=8, 2+6+10=18]
 *
 * n = 4
 * l = 0, 1, 2, 3
 * ml = -3, -2, -1, 0, 1, 2, 3
 * electrons per subshell = [2, 2+6=8, 2+6+10=18, 2+6+10+14=32]
 */

import { useContext } from "react";
import { StateContext } from "./StateContext.ts";
import elements from "./elements.json" with { type: "json" };

function Electron({ x = 0, y = 0, isValence = false }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
    >
      <circle r="6" fill={isValence ? "lightgreen" : "yellow"} />
      <line x1="-3" y1="0" x2="3" y2="0" stroke="black" strokeWidth={2} />
    </g>
  );
}

function Shell({ r = 0, electrons = 2, isOuterShell = false }) {
  const electronViews: React.ReactNode[] = [];
  const rad = 2 * Math.PI / electrons;
  for (let i = 0; i < electrons; i++) {
    const x = r * Math.cos(i * rad);
    const y = -r * Math.sin(i * rad);
    electronViews.push(
      <Electron key={i} x={x} y={y} isValence={isOuterShell} />,
    );
  }

  return (
    <g>
      <circle r={r} />
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

  const visibleShells = valence
    ? element.electrons.slice(-1)
    : element.electrons;

  return (
    <g transform={`translate(${x}, ${y})`} stroke="black" fill="transparent">
      <circle r="10" fill="red" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="black" strokeWidth={2} />
      <line x1="0" y1="-5" x2="0" y2="5" stroke="black" strokeWidth={2} />

      {visibleShells.map((numEl, i) => (
        <Shell
          key={i}
          r={10 + (i + 1) * 20}
          electrons={numEl}
          isOuterShell={i === visibleShells.length - 1}
        />
      ))}
    </g>
  );
}

const svgWidth = 320;
const svgHeight = 320;

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
