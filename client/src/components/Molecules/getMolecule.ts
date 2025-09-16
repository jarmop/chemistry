import { moleculeByName } from "./mol.ts";
import { Atom, Bond, Molecule, Position } from "./types.ts";

const carbonAtom: Atom = {
  id: 1,
  symbol: "C",
  position: [0, 0, 0],
};

const bond: Bond = {
  start: 1,
  end: 2,
  type: 1,
};

const defaultMolecule: Molecule = {
  atoms: [carbonAtom],
  bonds: [],
};

export function getMolecule(name: string) {
  if (moleculeByName[name]) {
    return moleculeByName[name];
  }

  const molecule = {
    name,
    atoms: [],
    bonds: [],
  };

  return molecule;
}

// function getAtom(id: number, symbol: string, position: Position): Atom {
//   return {
//     id,
//     symbol,
//     position,
//   };
// }

// function getBond(start: number, end: Bond, position: Position): Atom {
//   return {
//     id,
//     symbol,
//     position,
//   };
// }
