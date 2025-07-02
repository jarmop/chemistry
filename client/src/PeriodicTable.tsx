import { useContext, useState } from "react";
import elements from "./data/elements.ts";
import { StateContext } from "./StateContext.ts";
import { Element as ElementType } from "./library/types.ts";
import { Element } from "./Element.tsx";
import { ElementDetailed } from "./ElementDetailed.tsx";
import { ElementImage } from "./ElementImage.tsx";

const colorModes = [
  "block",
  "phase",
  "density",
  "abundance",
  "abundance rank",
] as const;
type ColorMode = (typeof colorModes)[number];

const viewModes = ["simple", "detailed", "image"] as const;
type ViewMode = (typeof viewModes)[number];

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
  onElementSelected: (element: ElementType) => void;
}

export function PeriodicTable(
  { onElementSelected }: PeriodicTableProps,
) {
  const { element: selectedZ } = useContext(StateContext);

  const [colorMode, setColorMode] = useState<ColorMode>("block");
  const [viewMode, setViewMode] = useState<ViewMode>("simple");
  const elementsByPeriodAndGroup: Record<string, Record<string, ElementType>> =
    {};
  const fBlockGroups: Record<string, Record<string, ElementType>> = {};

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

  const densityValues = elements.map((el) => el.density);
  const maxDensity = Math.max(...densityValues);
  function getDensityColor(density: number) {
    const relativeDensity = density / maxDensity;
    return `rgba(0,0,255,${relativeDensity})`;
  }

  const abundanceValues = elements
    .map((el) => el.abundanceOnEarthCrust)
    .sort((a, b) => a - b);

  const maxAbundance = Math.max(...abundanceValues);
  function getAbundanceColor(abundance: number) {
    const relativeAbundance = abundance / maxAbundance;
    return `rgba(255,0,0,${relativeAbundance})`;
  }

  function getAbundanceRank(abundance: number) {
    const rank = abundanceValues.indexOf(abundance);
    return `rgba(255,0,0,${rank / abundanceValues.length})`;
  }

  function getCellColor(element: ElementType) {
    if (colorMode === "block") {
      return blockColor[element.block];
    } else if (colorMode === "phase") {
      return phaseColor[element.phase];
    } else if (colorMode === "density") {
      return getDensityColor(element.density);
    } else if (colorMode === "abundance") {
      return getAbundanceColor(element.abundanceOnEarthCrust);
    } else {
      return getAbundanceRank(element.abundanceOnEarthCrust);
    }
  }

  function renderElementCell(element: ElementType, key: string | number) {
    if (viewMode === "detailed") {
      return (
        <ElementDetailed
          key={key}
          element={element}
          isSelected={selectedZ === element.protons}
          getCellColor={getCellColor}
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
          getCellColor={getCellColor}
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
        {colorModes.map((mode) => (
          <label key={mode}>
            <input
              type="radio"
              name="colorMode"
              value={mode}
              checked={colorMode === mode}
              onChange={() => setColorMode(mode)}
            />
            {mode}
          </label>
        ))}
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
                return renderElementCell(element, group);
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
                  return renderElementCell(element, protons);
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
