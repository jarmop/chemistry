import { Substance } from "../../library/types.ts";
import elements from "../elements.ts";

export const pureSubstances: Substance[] = [
  {
    name: "Diamond",
    formula: "C",
    solid: "crystalline",
    lattice: "diamond cubic",
    tags: ["synthetic", "natural"],
  },
  {
    name: "Graphite",
    formula: "C",
    solid: "polycrystalline",
    lattice: "hexagonal",
    tags: ["synthetic", "natural"],
  },
  {
    name: "Iron",
    formula: "Fe",
    solid: "polycrystalline",
    lattice: "bcc",
    tags: ["natural"],
  },
  {
    name: "Crystalline silicon",
    formula: "Si",
    tags: ["natural", "synthetic"],
    solid: "crystalline",
    lattice: "diamond cubic",
  },
  { ...getElement("Copper"), lattice: "fcc" },
  { ...getElement("Zinc"), lattice: "hcp" },
  { ...getElement("Silver"), lattice: "fcc" },
];

function getElement(name: string): Substance {
  const el = elements.find((el) => el.name === name);

  return {
    name,
    formula: el?.symbol,
    solid: "polycrystalline",
    tags: ["natural"],
  };
}
