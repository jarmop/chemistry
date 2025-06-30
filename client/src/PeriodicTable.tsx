import { useContext, useState } from "react";
import elements from "./data/elements.ts";
import { StateContext } from "./StateContext.ts";
import { Element } from "./library/types.ts";

const blockColor: Record<string, string> = {
  "s-block": "pink",
  "f-block": "lightgreen",
  "d-block": "lightblue",
  "p-block": "lightyellow",
};

const phaseColor: Record<string, string> = {
  "solid": "lightgreen",
  "liquid": "lightblue",
  "gas": "lightyellow",
  "unknown phase": "lightgrey",
};

interface PeriodicTableProps {
  onElementSelected: (element: Element) => void;
}

export function PeriodicTable(
  { onElementSelected }: PeriodicTableProps,
) {
  const { element: selectedZ } = useContext(StateContext);

  const [colorMode, setColorMode] = useState<"block" | "phase">("block");
  const elementsByPeriodAndGroup: Record<string, Record<string, Element>> = {};
  const fBlockGroups: Record<string, Record<string, Element>> = {};

  elements.forEach((el) => {
    if (el.block === "f-block") {
      if (!fBlockGroups[el.period]) {
        fBlockGroups[el.period] = {};
      }
      fBlockGroups[el.period][el.protons] = el;
    } else {
      if (!elementsByPeriodAndGroup[el.period]) {
        elementsByPeriodAndGroup[el.period] = {};
      }

      elementsByPeriodAndGroup[el.period][el.group] = el;
    }
  });

  const groups = Object.keys(elementsByPeriodAndGroup[6]);
  const periods = Object.keys(elementsByPeriodAndGroup);

  // const abundanceValues = elements.map((el) => el.abundanceOnEarthCrust);
  // const maxAbundance = Math.max(...abundanceValues);
  // function getColor(abundance: number) {
  //   const relativeAbundance = abundance / maxAbundance;
  //   return `rgba(255,0,0,${relativeAbundance})`;
  // }

  function getCellColor(element: Element) {
    if (colorMode === "block") {
      return blockColor[element.block];
    } else {
      return phaseColor[element.phase];
    }
  }

  return (
    <>
      {/* Color mode selector */}
      <div style={{ marginBottom: "10px" }}>
        <span>Color by:</span>
        <label style={{ marginRight: "10px" }}>
          <input
            type="radio"
            name="colorMode"
            value="block"
            checked={colorMode === "block"}
            onChange={() => setColorMode("block")}
          />
          Block
        </label>
        <label>
          <input
            type="radio"
            name="colorMode"
            value="phase"
            checked={colorMode === "phase"}
            onChange={() => setColorMode("phase")}
          />
          Phase
        </label>
      </div>
      <table className="periodicTable">
        <thead>
          <tr>
            <th></th>
            {groups.map((group) => <th key={group}>{group}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <th>{period}</th>
              {groups.map((group) => {
                const element = elementsByPeriodAndGroup[period][group];
                if (!element) {
                  return <td key={group}></td>;
                }

                return (
                  <td
                    key={group}
                    onClick={() => onElementSelected(element)}
                    style={{
                      cursor: "pointer",
                      background: getCellColor(element),
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    {selectedZ === element.protons && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0,0,0,0.1)",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />
                    )}
                    {element.symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <table className="periodicTable" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th colSpan={Object.keys(fBlockGroups[6]).length}>
              F-block groups
            </th>
          </tr>
        </thead>
        <tbody>
          {[6, 7].map((period) => (
            <tr key={period}>
              <th>{period}</th>
              {fBlockGroups[period] &&
                Object.keys(fBlockGroups[period]).map((protons) => {
                  const element = fBlockGroups[period][protons];
                  if (!element) {
                    return <td key={protons}></td>;
                  }
                  return (
                    <td
                      key={protons}
                      onClick={() => onElementSelected(element)}
                      style={{
                        cursor: "pointer",
                        background: getCellColor(element),
                        position: "relative",
                        textAlign: "center",
                      }}
                    >
                      {selectedZ === element.protons && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.1)",
                            pointerEvents: "none",
                            zIndex: 1,
                          }}
                        />
                      )}
                      {element.symbol}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
