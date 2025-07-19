import { Mixture } from "../../library/types.ts";

export const homogenous: Mixture[] = [
  {
    name: "Petroleum",
    composition: {
      "carbon": "83-85",
      "hydrogen": "10-14",
      "nitrogen": "0.1-2",
      "oxygen": "0.5-1.5",
      "sulfur": "0.05-6",
    },
    description:
      "A naturally occurring liquid composed primarily of hydrocarbons, which are uniformly distributed throughout.",
    tags: ["biogenic"],
  },
  {
    name: "Glass",
    composition: "",
    formula: "SiO2",
    solid: "amorphous",
    tags: ["synthetic"],
    description:
      "Although the atomic-scale structure of glass shares characteristics of the structure of a supercooled liquid, glass exhibits all the mechanical properties of a solid",
  },
];
