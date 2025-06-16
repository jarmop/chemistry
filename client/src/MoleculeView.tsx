import { useState } from "react";
import { inorganicMolecules, organicMolecules } from "./molecules.ts";

const svgWidth = 800;
const svgHeight = 600;

export function MoleculeBuilder() {
  const [selectedMolecule, selectMolecule] = useState("");

  return (
    <div style={{ display: "flex" }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ border: "1px solid black" }}
      >
        <g transform="translate(160, 160)" stroke="black" fill="transparent">
          <circle r="10" fill="red"></circle>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="black" stroke-width="2">
          </line>
          <line x1="0" y1="-5" x2="0" y2="5" stroke="black" stroke-width="2">
          </line>
          <g>
            <circle r="30"></circle>
            <g transform="translate(30, 0)">
              <circle r="6" fill="lightgreen"></circle>
              <line
                x1="-3"
                y1="0"
                x2="3"
                y2="0"
                stroke="black"
                stroke-width="2"
              >
              </line>
            </g>
          </g>
        </g>
      </svg>
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
              <div title={name}>
                <Formula formula={formula} />
              </div>
            );
          })}
        </div>
        <div style={{ marginLeft: "40px" }}>
          Organic molecules:
          {organicMolecules.map(({ name, formula }) => {
            return (
              <div title={name}>
                <Formula formula={formula} />
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
  const content = [];
  for (let i = 0; i < parts.length; i += 2) {
    const symbol = parts[i];
    const amount = parts[i + 1];
    content.push(
      <>
        <span>{symbol}</span>
        <sub>{amount}</sub>
      </>,
    );
  }

  return content;
}
