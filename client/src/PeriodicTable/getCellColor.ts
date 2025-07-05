import elements from "../data/elements.ts";
import { Element as ElementType } from "../library/types.ts";

export const colorModes: Partial<Record<keyof ElementType, string>> = {
  block: "block",
  phase: "phase",
  origin: "origin",
  density: "density",
  electronegativity: "electronegativity",
  electronAffinity: "electron affinity",
  ionizationEnergy: "ionization energy",
  atomicRadius: "atomic radius",
  abundanceOnEarthCrust: "abundance on earth's crust",
  abundanceOnEarthCrustRank: "abundance on earth's crust rank",
  massInHumanBody: "mass in human body",
  atomsInHumanBody: "atoms in human body",
  abundanceInMilkyWay: "abundance in milky way",
};
export type ColorMode = keyof typeof colorModes;

export const discreteColorModes: ColorMode[] = ["block", "phase", "origin"];

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

const colorGetters: Partial<Record<ColorMode, (element: ElementType) => string>> = {
  abundanceOnEarthCrust: createColorGetter("abundanceOnEarthCrust"),
  abundanceOnEarthCrustRank: createColorGetter(
    "abundanceOnEarthCrustRank",
    true,
  ),
  density: createColorGetter("density"),
  electronegativity: createColorGetter("electronegativity"),
  electronAffinity: createColorGetter("electronAffinity"),
  ionizationEnergy: createColorGetter("ionizationEnergy"),
  atomicRadius: createColorGetter("atomicRadius"),
  origin: createColorGetter("origin"),
  massInHumanBody: createColorGetter("massInHumanBody"),
  atomsInHumanBody: createColorGetter("atomsInHumanBody"),
  abundanceInMilkyWay: createColorGetter("abundanceInMilkyWay"),
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
