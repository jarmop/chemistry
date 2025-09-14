export type Position = [number, number, number];

export type Atom = {
  id: number;
  symbol: string;
  position: Position;
};

export type Bond = {
  start: number;
  end: number;
  type: number;
};

export type Molecule = {
  name: string;
  atoms: Atom[];
  bonds: Bond[];
};
