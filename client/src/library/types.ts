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
  electroNegativity: number;
  abundanceOnEarthCrust: number;
  phase: string;
  density: number;
  image?: string;
  thumbnail?: string;
};
