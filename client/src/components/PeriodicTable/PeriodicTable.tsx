import { useContext, useState } from "react";
import elements from "../../data/elements.ts";
import { StateContext } from "../../components/StateContext.ts";
import { Element as ElementType } from "../../library/types.ts";
import { Element } from "../../components/PeriodicTable/Element.tsx";
import { ElementDetailed } from "../../components/PeriodicTable/ElementDetailed.tsx";
import { ElementImage } from "../../components/PeriodicTable/ElementImage.tsx";
import {
  type ColorMode,
  colorModes,
  discreteColorModes,
  getCellColor,
} from "./getCellColor.ts";
import { TableBody } from "./TableBody.tsx";
import { ComparisonTable } from "../../components/PeriodicTable/ComparisonTable.tsx";
import { ColorDescription } from "../../components/PeriodicTable/ColorDescription.tsx";
import { removeValueFromArray } from "../../library/helpers.ts";

const viewModes = ["simple", "detailed", "image"] as const;
type ViewMode = (typeof viewModes)[number];

interface PeriodicTableProps {
  onElementSelected: (element: ElementType | undefined) => void;
}

export function PeriodicTable(
  { onElementSelected }: PeriodicTableProps,
) {
  const { element: selectedZ } = useContext(StateContext);

  const [colorMode, setColorMode] = useState<ColorMode>("structure");
  const [viewMode, setViewMode] = useState<ViewMode>("simple");
  const [highlightValues, setHighlightValues] = useState<string[]>([]);
  const [hoverEnabled, setHoverEnabled] = useState(true);

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

  function maybeCellColor(element: ElementType) {
    return (highlightValues.length > 0 &&
        !highlightValues.includes(element[colorMode] as string))
      ? undefined
      : getCellColor(element, colorMode);
  }

  function selectElement(
    element: ElementType | undefined,
    hover?: boolean | undefined,
  ) {
    const elementSelected = element?.protons === selectedZ;
    if (hover === undefined) {
      onElementSelected(elementSelected ? undefined : element);
    } else if (hover === true) {
      hoverEnabled && onElementSelected(element);
    } else {
      if (elementSelected) {
        onElementSelected(hoverEnabled ? element : undefined);
        setHoverEnabled(!hoverEnabled);
      } else {
        onElementSelected(element);
      }
    }
  }

  function selectHighlightValue(value?: string | string[]) {
    if (!value) {
      setHighlightValues([]);
      return;
    }

    if (Array.isArray(value)) {
      setHighlightValues(value);
      return;
    }

    const newHighlightValue = highlightValues.includes(value)
      ? removeValueFromArray(highlightValues, value)
      : [...highlightValues, value];

    setHighlightValues(newHighlightValue);
  }

  function renderElementCell(element: ElementType, key: string | number) {
    if (viewMode === "detailed") {
      return (
        <ElementDetailed
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          color={maybeCellColor(element)}
          onElementSelected={selectElement}
        />
      );
    } else if (viewMode === "image") {
      return (
        <ElementImage
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          onElementSelected={selectElement}
        />
      );
    } else {
      return (
        <Element
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          color={maybeCellColor(element)}
          onElementSelected={(element, click = false) => {
            selectElement(element, !click);
          }}
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
          onChange={(e) => {
            setColorMode(e.target.value as ColorMode);
            setHighlightValues([]);
          }}
          style={{ marginLeft: "8px" }}
        >
          {Object.entries(colorModes).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
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
      {discreteColorModes.includes(colorMode)
        ? (
          <ColorDescription
            colorMode={colorMode}
            selectedValues={highlightValues}
            onClick={selectHighlightValue}
            // onMouseLeaveContainer={() => {}}
          />
        )
        : (
          <ComparisonTable
            colorMode={colorMode === "abundanceOnEarthCrustRank"
              ? "abundanceOnEarthCrust"
              : colorMode}
          />
        )}
    </>
  );
}
