import elements from "../data/elements.ts";
import { Element as ElementType } from "../library/types.ts";

export const colorModes = [
  "block",
  "phase",
  "density",
  "abundance",
  "abundance rank",
  "electronegativity",
  "electron affinity",
  "ionization energy",
  "atomic radius",
  "origin",
] as const;
export type ColorMode = (typeof colorModes)[number];

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

function createColorGetter(
  property: keyof ElementType,
  invert: boolean = false,
) {
  const values = elements.map((el) => el[property]) as number[];
  const max = Math.max(...values);
  return (element: ElementType) => {
    return `rgba(0,0,255,${
      invert
        ? 1 - (element[property] as number) / max
        : (element[property] as number) / max
    })`;
  };
}

const colorGetters = {
  abundance: createColorGetter("abundanceOnEarthCrust"),
  "abundance rank": createColorGetter("abundanceRank", true),
  density: createColorGetter("density"),
  electronegativity: createColorGetter("electronegativity"),
  "electron affinity": createColorGetter("electronAffinity"),
  "ionization energy": createColorGetter("ionizationEnergy"),
  "atomic radius": createColorGetter("atomicRadius"),
  origin: createColorGetter("origin"),
};

export function getCellColor(element: ElementType, colorMode: ColorMode) {
  if (colorMode === "block") {
    return blockColor[element.block];
  } else if (colorMode === "phase") {
    return phaseColor[element.phase];
  } else if (colorMode === "origin") {
    return element.origin === "primordial"
      ? "lightgreen"
      : element.origin === "synthetic"
      ? "lightblue"
      : "lightyellow";
  } else if (colorGetters[colorMode]) {
    return colorGetters[colorMode](element);
  }
  return "white";
}
