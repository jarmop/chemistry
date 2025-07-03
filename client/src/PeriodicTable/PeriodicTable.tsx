import { useContext, useState } from "react";
import elements from "../data/elements.ts";
import { StateContext } from "../StateContext.ts";
import { Element as ElementType } from "../library/types.ts";
import { Element } from "./Element.tsx";
import { ElementDetailed } from "./ElementDetailed.tsx";
import { ElementImage } from "./ElementImage.tsx";
import { type ColorMode, colorModes, getCellColor } from "./getCellColor.ts";
import { TableBody } from "./TableBody.tsx";

const viewModes = ["simple", "detailed", "image"] as const;
type ViewMode = (typeof viewModes)[number];

interface PeriodicTableProps {
  onElementSelected: (element: ElementType) => void;
}

export function PeriodicTable(
  { onElementSelected }: PeriodicTableProps,
) {
  const { element: selectedZ } = useContext(StateContext);

  const [colorMode, setColorMode] = useState<ColorMode>("block");
  const [viewMode, setViewMode] = useState<ViewMode>("simple");

  const mainElements: ElementType[][] = [];
  for (let i = 0; i < 7; i++) {
    mainElements[i] = Array(18).fill(null);
  }
  elements.filter((el) => el.block !== "f-block").forEach((el) => {
    mainElements[parseInt(el.period) - 1][parseInt(el.group) - 1] = el;
  });

  const fBlockElementsArray = elements.filter((el) => el.block === "f-block");
  const fBlockElements = [
    fBlockElementsArray.slice(0, fBlockElementsArray.length / 2),
    fBlockElementsArray.slice(fBlockElementsArray.length / 2),
  ];

  function renderElementCell(element: ElementType, key: string | number) {
    if (viewMode === "detailed") {
      return (
        <ElementDetailed
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          color={getCellColor(element, colorMode)}
          onElementSelected={onElementSelected}
        />
      );
    } else if (viewMode === "image") {
      return (
        <ElementImage
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          onElementSelected={onElementSelected}
        />
      );
    } else {
      return (
        <Element
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          color={getCellColor(element, colorMode)}
          onElementSelected={onElementSelected}
        />
      );
    }
  }

  return (
    <>
      {/* Element view selector */}
      <div style={{ marginBottom: "10px" }}>
        <span>Element view:</span>
        {viewModes.map((mode) => (
          <label key={mode}>
            <input
              type="radio"
              name="viewMode"
              value={mode}
              checked={viewMode === mode}
              onChange={() => setViewMode(mode)}
            />
            {mode}
          </label>
        ))}
      </div>
      {/* Color mode selector */}
      <div style={{ marginBottom: "10px" }}>
        <span>Color by:</span>
        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value as ColorMode)}
          style={{ marginLeft: "8px" }}
        >
          {colorModes.map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </div>
      <table className="periodicTable">
        <thead>
          <tr>
            <th></th>
            {mainElements[0].map((_, i) => <th key={i}>{i + 1}</th>)}
          </tr>
        </thead>
        <TableBody
          elements={mainElements}
          rowTitles={mainElements.map((_, i) => i + 1)}
          selectedZ={selectedZ}
          onElementSelected={onElementSelected}
          renderElementCell={renderElementCell}
        />
      </table>
      <table className="periodicTable" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th colSpan={fBlockElements[0].length}>F-block groups</th>
          </tr>
        </thead>
        <TableBody
          elements={fBlockElements}
          rowTitles={[6, 7]}
          selectedZ={selectedZ}
          onElementSelected={onElementSelected}
          renderElementCell={renderElementCell}
        />
      </table>
    </>
  );
}
