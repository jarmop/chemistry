import { addTag } from "../../library/helpers.ts";
import { Substance } from "../../library/types.ts";
import { minerals } from "./minerals.ts";

export const compounds: Substance[] = [
  {
    name: "Water",
    formula: "H2O",
    composition: {
      "H": "11.19",
      "O": "88.81",
    },
    tags: ["natural"],
    solid: "polycrystalline",
    lattice: "hexagonal",
  },
  {
    name: "Sodium Chloride",
    formula: "NaCl",
    tags: ["natural"],
    solid: "polycrystalline",
    lattice: "fcc",
  },
  {
    name: "Alpha Silicon Carbide",
    formula: "SiC",
    tags: ["synthetic", "natural"],
    solid: "crystalline",
    lattice: "hexagonal",
  },
  {
    name: "Beta Silicon Carbide",
    formula: "SiC",
    tags: ["synthetic", "natural"],
    solid: "crystalline",
    lattice: "simple cubic",
  },
  {
    name: "Silicon Carbide Ceramics",
    description: "Crystallites bonded together by sintering",
    formula: "SiC",
    tags: ["synthetic", "natural"],
    solid: "polycrystalline",
    lattice: "hexagonal",
  },
  {
    name: "sapphire",
    formula: "Al2O3",
    tags: ["natural", "synthetic"],
    solid: "crystalline",
    lattice: "hexagonal",
    "crystal system": "trigonal",
  },
  ...addTag(minerals, "mineral"),
  // {
  //   name: "Natural gas",
  //   formula: "CnH2n+2",
  // },
  // {
  //   name: "Sucrose",
  //   formula: "C12H22O11",
  // },
  // {
  //   name: "Glucose",
  //   formula: "C6H12O6",
  // },
];
