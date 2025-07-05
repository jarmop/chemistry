import elementsJSON from "./elements.json" with { type: "json" };
import { Element } from "../library/types.ts";

const elements = elementsJSON
  .sort((a, b) => b.abundanceOnEarthCrust - a.abundanceOnEarthCrust)
  .map((el, i) => {
    return {
      ...el,
      abundanceOnEarthCrustRank: i + 1,
    };
  }).sort((a, b) => a.protons - b.protons) as unknown as Element[];

export default elements;

export const elementUnits: Partial<Record<keyof Element, string>> = {
  abundanceOnEarthCrust: "ppm",
  abundanceOnEarthCrustRank: "rank",
  massInHumanBody: "%",
  atomsInHumanBody: "%",
  abundanceInMilkyWay: "%",
  ionizationEnergy: "kJ/mol",
  electronAffinity: "kJ/mol",
  atomicRadius: "pm",
  density: "g/cm^3",
  electronegativity: "Pauling",
};
