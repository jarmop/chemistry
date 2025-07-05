import elements, { elementUnits } from "../data/elements.ts";
import { ColorMode, colorModes } from "./getCellColor.ts";

interface ComparisonTableProps {
  colorMode: ColorMode;
}

export function ComparisonTable(
  { colorMode }: ComparisonTableProps,
) {
  return (
    <table
      style={{ marginTop: "20px" }}
      className="comparisonTable"
    >
      <thead>
        <tr>
          <th></th>
          <th style={{ textAlign: "left" }}>element</th>
          {colorMode !== "abundanceOnEarthCrustRank" && (
            <th>{colorModes[colorMode]} ({elementUnits[colorMode]})</th>
          )}
        </tr>
      </thead>
      <tbody>
        {elements.sort((a, b) => {
          const aValue = a[colorMode] as number ?? 0;
          const bValue = b[colorMode] as number ?? 0;
          if (colorMode === "abundanceOnEarthCrustRank") {
            return aValue - bValue;
          }
          return bValue - aValue;
        }).map((el, i) => (
          <tr key={el.symbol}>
            <td>{i + 1}</td>
            <td>{el.name}</td>
            {colorMode !== "abundanceOnEarthCrustRank" && (
              <td>{el[colorMode] ?? "N/A"}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
