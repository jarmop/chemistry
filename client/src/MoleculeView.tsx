import React, { useState } from "react";
import { inorganicMolecules, organicMolecules } from "./molecules.ts";

export function MoleculeView() {
  const [selectedMolecule, selectMolecule] = useState("");

  return (
    <div style={{ display: "flex" }}>
      <MoleculeSvg />
      <div
        style={{
          marginLeft: "10px",
          display: "flex",
        }}
      >
        <div>
          Inorganic molecules:
          {inorganicMolecules.map(({ name, formula }) => {
            return (
              <div key={name}>
                {name} – <Formula formula={formula} />
              </div>
            );
          })}
        </div>
        <div style={{ marginLeft: "40px" }}>
          Organic molecules:
          {organicMolecules.map(({ name, formula }) => {
            return (
              <div key={name}>
                {name} – <Formula formula={formula} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Formula({ formula = "H20" }) {
  const parts = formula.split(/(\d+|\D+)/).filter(Boolean);
  const content: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const symbol = parts[i];
    const amount = parts[i + 1];
    content.push(
      <React.Fragment key={i}>
        <span>{symbol}</span>
        <sub>{amount}</sub>
      </React.Fragment>,
    );
  }

  return content;
}

// const foo: Record<
//   string,
//   {
//     atoms: {
//       symbol: string;
//       bonds: { type: number; angle: number; atom: number | string }[];
//     }[];
//   }
// > = {
//   water: {
//     atoms: [
//       {
//         symbol: "O",
//         bonds: [
//           { type: 1, angle: 0, atom: "H" },
//           { type: 1, angle: 180, atom: "H" },
//         ],
//       },
//     ],
//   },
//   methane: {
//     atoms: [
//       {
//         symbol: "C",
//         bonds: [
//           { type: 1, angle: 0, atom: "H" },
//           { type: 1, angle: 90, atom: "H" },
//           { type: 1, angle: 180, atom: "H" },
//           { type: 1, angle: 270, atom: "H" },
//         ],
//       },
//     ],
//   },
//   ethanol: {
//     atoms: [
//       {
//         symbol: "C",
//         bonds: [
//           { type: 1, angle: 0, atom: 1 },
//           { type: 1, angle: 90, atom: "H" },
//           { type: 1, angle: 180, atom: "H" },
//           { type: 1, angle: 270, atom: "H" },
//         ],
//       },
//       {
//         symbol: "C",
//         bonds: [
//           { type: 1, angle: 0, atom: 2 },
//           { type: 1, angle: 90, atom: "H" },
//           { type: 1, angle: 270, atom: "H" },
//         ],
//       },
//       {
//         symbol: "O",
//         bonds: [
//           { type: 1, angle: 60, atom: "H" },
//         ],
//       },
//     ],
//   },
// };

const water = [
  "H1O1H",
];

const methane = [
  "..H..",
  "..1..",
  "H1C1H",
  "..1..",
  "..H..",
];

const ethanol = [
  "..H.H.H",
  "..1.1.1",
  "H1C1C1O",
  "..1.1..",
  "..H.H..",
];

const glucose = [
  "..H.H.H",
  "..1.1.1",
  "H,1,C,1,C,1,O",
  "..1.1..",
  "..H.H..",
];

const moleculeStructures: Record<string, string[]> = {
  water,
  methane,
  ethanol,
  glucose,
};

// const foo = { Symbol: "O", bonds: [{ Symbol: "H", angle: 0, atom: 1 }] };

const svgWidth = 300;
const svgHeight = 160;

function MoleculeSvg({ molecule = "ethanol" }) {
  const rows = moleculeStructures[molecule];
  const rowSize = 20;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        border: "1px solid black",
        fontFamily: "sans-serif",
        fontSize: "16px",
      }}
    >
      <g
        transform={`translate(${svgWidth / 2}, ${
          svgHeight / 2 - Math.floor(rows.length / 2) * rowSize
        })`}
      >
        {moleculeStructures[molecule].map((row, i) => {
          const parts = row.replace(/\./g, "0").split("").filter(Boolean);

          console.log(parts);

          const startX = -parts.length * rowSize / 2;
          // console.log("startX", startX);

          return (
            <g
              key={i}
              transform={`translate(0, ${i * rowSize})`}
            >
              {parts.map((part, j) => {
                // console.log("********");
                // console.log("x", j * rowSize - parts.length * rowSize / 2);

                if (isNaN(Number(part))) {
                  return (
                    <text
                      x={startX + j * rowSize}
                      y={0}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {part}
                    </text>
                  );
                }

                // const startX = j * rowSize - parts.length * rowSize / 2 -
                //   rowSize / 2;

                if (part === "0") {
                  return null;
                }

                if (i % 2 === 0) {
                  const foo = startX + j * rowSize - 10;
                  return (
                    <line
                      x1={foo}
                      y1={-2}
                      x2={foo + rowSize}
                      y2={-2}
                      stroke="black"
                    />
                  );
                } else {
                  const foo = startX + j * rowSize;
                  return (
                    <line
                      x1={foo}
                      y1={-7}
                      x2={foo}
                      y2={+7}
                      stroke="black"
                    />
                  );
                }
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
