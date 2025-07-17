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
