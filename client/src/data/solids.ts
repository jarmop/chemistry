export type Solids = typeof solids;
export type Solid = Solids[number];

export const solids = [
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
    name: "Concrete",
    solid: "crystalline",
    tags: ["synthetic"],
  },
  {
    name: "diamond",
    solid: "crystalline",
    tags: ["synthetic", "natural"],
  },
  {
    name: "Sand",
    formula: "SiO2", // mostly
    solid: "amorphous",
    tags: ["natural"],
  },
  {
    name: "Glass",
    formula: "SiO2",
    solid: "amorphous",
    tags: ["natural", "synthetic"],
  },
  {
    name: "Clay",
    formula: "Al2Si2O5(OH)4",
    solid: "amorphous",
    tags: ["natural"],
  },
  {
    name: "Ceramics",
    formula: "SiO2",
    solid: "crystalline",
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
    name: "rubber",
    solid: "amorphous",
    tags: ["organic", "synthetic", "biogenic", "natural"],
    image: "",
    thumbnail: "",
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
];
