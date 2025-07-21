import { Mixture } from "../../library/types.ts";

export const homogeneous: Mixture[] = [
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
    tags: ["synthetic", "alloy", "interstitial"],
    description:
      "Euronorm number 1.4301. A very common austenitic stainless steel grade.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/1280px-Stainless_kitchen_container_with_cover.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/250px-Stainless_kitchen_container_with_cover.jpg",
  },
  {
    name: "Brass",
    composition: "Copper + Zinc",
    solid: "polycrystalline",
    tags: ["synthetic", "alloy", "substitutional"],
  },
  {
    name: "Bronze",
    composition: "Copper + Tin",
    solid: "polycrystalline",
    tags: ["synthetic", "alloy", "substitutional"],
  },
  {
    name: "Sterling silver",
    composition: "Silver + copper",
    solid: "polycrystalline",
    tags: ["synthetic", "alloy", "substitutional"],
  },
];
