import { Mixture } from "../../library/types.ts";

export const homogeneous: Mixture[] = [
  {
    name: "Petroleum",
    composition: {
      C: "83-85",
      H: "10-14",
      N: "0.1-2",
      O: "0.5-1.5",
      S: "0.05-6",
    },
    description:
      "A naturally occurring liquid composed primarily of hydrocarbons, which are uniformly distributed throughout.",
    tags: ["biogenic"],
  },
  {
    name: "Bitumen",
    composition:
      "Naphthene aromatics (naphthalene), Polar aromatics, Saturated hydrocarbons,Asphaltenes",
    description: "An immensely viscous constituent of petroleum.",
    tags: ["biogenic", "synthetic", "pitch"],
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
  {
    name: "Austenitic stainless steel",
    composition: {
      "C": "< 0.07",
      "Cr": 18.5,
      "Ni": 9,
    },
    solid: "polycrystalline",
    lattice: "fcc",
    tags: ["synthetic", "alloy", "interstitial"],
    description:
      "Euronorm number 1.4301. A very common austenitic stainless steel grade.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/1280px-Stainless_kitchen_container_with_cover.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/250px-Stainless_kitchen_container_with_cover.jpg",
  },
  {
    name: "Alpha Brass",
    description: "Can be worked cold",
    composition: { Cu: "2/3", Zn: "1/3" },
    solid: "polycrystalline",
    lattice: "fcc",
    tags: ["synthetic", "alloy", "substitutional"],
  },
  {
    name: "Beta Brass",
    description:
      "Harder and stronger than alpha brass. Can only be worked hot.",
    composition: { Cu: "50-55", Zn: "45-50" },
    solid: "polycrystalline",
    lattice: "bcc",
    tags: ["synthetic", "alloy", "substitutional"],
  },
  {
    name: "Bronze",
    composition: { Cu: 88, Sb: 12 },
    solid: "polycrystalline",
    lattice: "fcc",
    tags: ["synthetic", "alloy", "substitutional"],
  },
  {
    name: "Sterling silver",
    description:
      "Other elements can be used in place of copper, such as germanium, zinc, platinum, silicon, and boron",
    composition: { Ag: 92.5, Cu: 7.5 },
    solid: "polycrystalline",
    lattice: "fcc",
    tags: ["synthetic", "alloy", "substitutional"],
  },
];
