import { addTag } from "../../library/helpers.ts";
import { Substance } from "../../library/types.ts";
import { minerals } from "./minerals.ts";

export const compounds: Substance[] = [
  {
    name: "Water",
    formula: "H2O",
    composition: {
      "hydrogen": "11.19",
      "oxygen": "88.81",
    },
    tags: ["natural"],
    solid: "crystalline",
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
