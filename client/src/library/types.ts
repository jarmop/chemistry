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

export const tags = [
  "synthetic",
  "natural",
  "biogenic",
  "organic",
  "pure substance",
  "compound",
  "homogenous",
  "heterogenous",
] as const;

export type Tag = typeof tags[number];

export type Matter = {
  name: string;
  solid: string;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
};

export type Mixture = {
  name: string;
  composition: object | string;
  solid?: string;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
};

export type Substance = {
  name: string;
  composition?: object | string;
  solid: string;
  formula?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  tags: Tag[];
};
