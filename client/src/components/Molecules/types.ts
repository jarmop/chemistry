export type Position = [number, number, number];

export type Atom = {
  id: number;
  symbol: string;
  position: Position;
};

export type Bond = {
  start: Atom["id"];
  end: Atom["id"];
  type: number;
};

export type Molecule = {
  atoms: Atom[];
  bonds: Bond[];
};
