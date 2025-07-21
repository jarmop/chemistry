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
  structure: Structure;
  structureNotes: string;
};

type Structure =
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

type Solid = "crystalline" | "polycrystalline" | "amorphous";

export const tags = [
  "synthetic",
  "natural",
  "biogenic",
  "organic",
  "pure substance",
  "compound",
  "homogeneous",
  "heterogeneous",
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

export type Matter = {
  name: string;
  composition: Composition;
  solid: Solid;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
  category?: string;
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
};
