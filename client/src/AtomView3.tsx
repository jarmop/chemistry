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
      <circle r="5" fill={isValence ? "lightgreen" : "yellow"} />
      <line x1="-3" y1="0" x2="3" y2="0" stroke="black" strokeWidth={2} />
    </g>
  );
}

function Shell({ r = 0, electrons = 2, isOuterShell = false, fill = "" }) {
  const electronViews: React.ReactNode[] = [];
  const rad = 2 * Math.PI / electrons;
  for (let i = 0; i < electrons; i++) {
    const x = (r - 7) * Math.cos(i * rad);
    const y = -(r - 7) * Math.sin(i * rad);
    electronViews.push(
      <Electron key={i} x={x} y={y} isValence={isOuterShell} />,
    );
  }

  return (
    <g>
      <circle r={r} fill={fill} strokeWidth="1" stroke="black" />
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
        fill={i % 2 == 0 ? "white" : "grey"}
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
