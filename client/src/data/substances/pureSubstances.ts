import { Substance } from "../../library/types.ts";

export const pureSubstances: Substance[] = [
  {
    name: "Diamond",
    formula: "C",
    solid: "crystalline",
    tags: ["synthetic", "natural"],
  },
  {
    name: "Graphite",
    formula: "C",
    solid: "polycrystalline",
    tags: ["synthetic", "natural", "interstitial"],
  },
  {
    name: "Iron",
    // formula: "Fe",
    solid: "polycrystalline",
    tags: ["natural"],
  },
];
