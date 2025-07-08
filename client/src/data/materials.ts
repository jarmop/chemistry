export type Materials = typeof materials;
export type Material = Materials[number];

export const materials = [
  {
    name: "Metal",
    solid: "polycrystalline",
    organic: false,
    synthetic: false,
    natural: true,
    biogenic: false,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/1280px-Stainless_kitchen_container_with_cover.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Stainless_kitchen_container_with_cover.jpg/250px-Stainless_kitchen_container_with_cover.jpg",
  },
  {
    name: "Concrete",
    solid: "crystalline",
    organic: false,
    synthetic: true,
    natural: false,
    biogenic: false,
  },
  {
    name: "diamond",
    solid: "crystalline",
    organic: false,
    synthetic: true,
    natural: true,
    biogenic: false,
  },
  {
    name: "Silicone",
    organic: false,
    synthetic: true,
    natural: false,
    biogenic: false,
    scientificName: "polydiphenylsiloxane",
    // formula: "Ph2SiO (Ph = phenyl, C6H5)",
    formula: "CH3[Si(CH3)2O]nSi(CH3)3",
    backboneChain: "Si-O",
    description:
      "a polymer composed of repeating units of siloxane (-O-R2Si-O-SiR2-, where R = organic group)",
  },
  {
    name: "Sand",
    formula: "SiO2", // mostly
    solid: "amorphous",
    natural: true,
  },
  {
    name: "Glass",
    formula: "SiO2",
    solid: "amorphous",
    natural: true,
    synthetic: true,
  },
  { name: "Clay", formula: "Al2Si2O5(OH)4", solid: "amorphous", natural: true },
  { name: "Ceramics", formula: "SiO2", solid: "crystalline", natural: true },
  {
    name: "Plastic",
    solid: "amorphous",
    organic: true,
    synthetic: true,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Plastic_objects.jpg/1280px-Plastic_objects.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Plastic_objects.jpg/250px-Plastic_objects.jpg",
  },
  {
    name: "Wood",
    solid: "amorphous",
    organic: true,
    synthetic: false,
    natural: true,
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Wooden-pallets_stacked_8.jpg/250px-Wooden-pallets_stacked_8.jpg",
  },
  {
    name: "rubber",
    organic: true,
    synthetic: true,
    biogenic: true,
    natural: true,
    image: "",
    thumbnail: "",
  },
  {
    name: "Latex",
    organic: true,
    synthetic: true,
    biogenic: true,
    description: "an emulsion of polymer microparticles in water",
  },
  {
    name: "bone",
    organic: true,
    synthetic: false,
    biogenic: true,
    natural: true,
  },
  {
    name: "Paper",
    solid: "amorphous",
    organic: true,
    synthetic: true,
    biogenic: false,
    natural: false,
  },
  { name: "Wax", solid: "amorphous", natural: true },
  { name: "Play-Doh", synthetic: true },
];
