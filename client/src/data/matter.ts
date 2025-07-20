import { Matter, Mixture } from "../library/types.ts";
import { mixtures } from "./mixtures/index.ts";
import { substances } from "./substances/index.ts";

export const matter: Matter[] = [
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
    solid: o.solid ?? "amorphous",
  }));
}
