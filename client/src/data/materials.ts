import { Matter, Mixture } from "../library/types.ts";
import { mixtures } from "./mixtures/index.ts";
import { substances } from "./substances/index.ts";

export const materials: Matter[] = [
  {
    name: "Metal",
    solid: "polycrystalline",
    tags: ["natural"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/1280px-Stainless_kitchen_container_with_cover.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/250px-Stainless_kitchen_container_with_cover.jpg",
  },
  {
    name: "Sand",
    formula: "SiO2", // mostly
    solid: "amorphous",
    tags: ["natural"],
  },
  {
    name: "Plastic",
    solid: "amorphous",
    tags: ["organic", "synthetic"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Plastic_objects.jpg/1280px-Plastic_objects.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Plastic_objects.jpg/250px-Plastic_objects.jpg",
  },
  {
    name: "Wood",
    solid: "amorphous",
    tags: ["organic", "natural"],
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Wooden-pallets_stacked_8.jpg/250px-Wooden-pallets_stacked_8.jpg",
  },
  {
    name: "Latex",
    solid: "amorphous",
    tags: ["organic", "synthetic", "biogenic"],
    description: "an emulsion of polymer microparticles in water",
  },
  {
    name: "bone",
    solid: "amorphous",
    tags: ["organic", "biogenic", "natural"],
  },
  {
    name: "Paper",
    solid: "amorphous",
    tags: ["organic", "synthetic"],
  },
  { name: "Wax", solid: "amorphous", tags: ["natural"] },
  { name: "Play-Doh", solid: "amorphous", tags: ["synthetic"] },
  ...substances,
  ...prepare(mixtures),
];

function prepare(objects: Mixture[]) {
  return objects.map((o) => ({
    ...o,
    solid: o.solid ?? "mixture",
  }));
}
