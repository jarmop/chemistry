import elements from "../data/elements.ts";
import { Element as ElementType } from "../library/types.ts";

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

const electronegativityValues = elements.map((el) => el.electronegativity);
const maxElectronegativity = Math.max(...electronegativityValues);
function getElectronegativityColor(electronegativity: number) {
  const relativeElectronegativity = electronegativity / maxElectronegativity;
  return `rgba(0,0,255,${relativeElectronegativity})`;
}

export function getCellColor(element: ElementType, colorMode: string) {
  if (colorMode === "block") {
    return blockColor[element.block];
  } else if (colorMode === "phase") {
    return phaseColor[element.phase];
  } else if (colorMode === "density") {
    return getDensityColor(element.density);
  } else if (colorMode === "abundance") {
    return getAbundanceColor(element.abundanceOnEarthCrust);
  } else if (colorMode === "abundance rank") {
    return getAbundanceRank(element.abundanceOnEarthCrust);
  } else if (colorMode === "electronegativity") {
    return getElectronegativityColor(element.electronegativity);
  }
  return "white";
}
