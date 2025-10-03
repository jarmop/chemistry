export type Element = {
  name: string;
  symbol: string;
  protons: number;
  neutrons: number;
  electrons: number[][];
  block: string;
  group: string;
  period: string;
  atomicWeight: number;
  origin: string;
  electronegativity: number;
  abundanceOnEarthCrust: number;
  abundanceOnEarthCrustRank: number;
  phase: string;
  density: number;
  image?: string;
  thumbnail?: string;
  electronAffinity: number;
  ionizationEnergy: number;
  atomicRadius: number;
  electronConfiguration: string;
  electronConfigurationConfirmed: boolean;
  massInHumanBody: number;
  atomsInHumanBody: number;
  abundanceInMilkyWay: number;
  category: string;
  structure: Lattice;
  structureNotes: string;
  conductivity?: number;
  resistivity?: number;
  meltingPoint?: number;
  boilingPoint?: number;
};

type Lattice =
  | "hcp"
  | "bcc"
  | "complex"
  | "diamond cubic"
  | "fcc"
  | "orthorhombic"
  | "monoclinic"
  | "rhombohedral"
  | "hexagonal"
  | "tetragonal"
  | "simple cubic"
  | "unknown";

type CrystalSystem = "hexagonal" | "trigonal";

export type Solid = "crystalline" | "polycrystalline" | "amorphous";

export const tags = [
  //type of matter
  "pure substance",
  "compound",
  "homogeneous",
  "heterogeneous",
  // origin
  "synthetic",
  "natural",
  "biogenic",
  "organic",
  //-----
  "alloy",
  // alloy type
  "substitutional",
  "interstitial",
  //-----
  "mineral",
  "pitch",
  "resin",
  "polymer",
  "colloid",
] as const;

export type Tag = typeof tags[number];

type Composition = Record<string, string | number> | string;

type Bond = "covalent" | "ionic" | "metallic" | "hydrogen";

export type Matter = {
  name: string;
  tags: Tag[];
  solid: Solid;
  bonds?: Bond[];
  composition?: Composition;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  category?: string;
  lattice?: Lattice;
  "crystal system"?: CrystalSystem;
};

export type Mixture = {
  name: string;
  composition: Composition;
  solid?: Solid;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
  category?: string;
  lattice?: Lattice;
  "crystal system"?: CrystalSystem;
};

export type Substance = {
  name: string;
  composition?: Composition;
  solid: Solid;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
  category?: string;
  lattice?: Lattice;
  "crystal system"?: CrystalSystem;
};
