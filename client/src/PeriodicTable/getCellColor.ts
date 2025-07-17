import elements from "../data/elements.ts";
import { Element as ElementType } from "../library/types.ts";

export const colorModes: Partial<Record<keyof ElementType, string>> = {
  category: "category",
  block: "block",
  phase: "phase",
  structure: "structure",
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

export const discreteColorModes: ColorMode[] = [
  "block",
  "category",
  "phase",
  "origin",
  "structure",
];

type Colors = Record<string, string>;

const blockColors: Colors = {
  "s-block": "pink",
  "f-block": "lightgreen",
  "d-block": "lightblue",
  "p-block": "lightyellow",
};

const phaseColors: Colors = {
  "solid": "lightgreen",
  "liquid": "lightblue",
  "gas": "lightyellow",
  "unknown phase": "lightgrey",
};

const originColors: Colors = {
  "primordial": "lightgreen",
  "synthetic": "lightblue",
  "from decay": "lightyellow",
};

export const categoryColors: Colors = {
  "alkali metal": "yellow",
  "alkaline earth metal": "pink",
  "transition metal": "lightblue",
  "post-transition metal": "lightgreen",
  "metalloid": "violet",
  "polyatomic nonmetal": "orange",
  "diatomic nonmetal": "darkseagreen",
  "noble gas": "deepskyblue",
  "lanthanide": "rosybrown",
  "actinide": "turquoise",
  "unknown": "lightgrey",
};

export const structureColors: Colors = {
  // cubic
  "fcc": "silver",
  "bcc": "orange",
  "diamond cubic": "turquoise",
  "simple cubic": "brown",
  // hexagonal
  "hcp": "salmon",
  "hexagonal": "pink",
  // other
  "rhombohedral": "lightblue",
  "orthorhombic": "palegreen",
  "monoclinic": "violet",
  "tetragonal": "yellow",
  "complex": "blue",
  "unknown": "white",
};

export const colorsByMode: Partial<Record<ColorMode, Colors>> = {
  block: blockColors,
  phase: phaseColors,
  origin: originColors,
  category: categoryColors,
  structure: structureColors,
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

const colorGetters: Partial<
  Record<ColorMode, (element: ElementType) => string>
> = {
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
  if (discreteColorModes.includes(colorMode)) {
    const colors = colorsByMode[colorMode];
    const value = element[colorMode] as string;
    return colors && colors[value];
  } else if (colorGetters[colorMode]) {
    return colorGetters[colorMode](element);
  }
  return "white";
}
