import { Bond, Molecule, Position } from "./types.ts";

function rowToArray(row: string) {
  return row.trim().split(/\s+/);
}

function getAtomsAndBonds(row: string) {
  return rowToArray(row).slice(0, 2).map((c) => parseInt(c));
}

function getAtom(row: string) {
  const rowArray = rowToArray(row);
  const position = rowArray.slice(0, 3).map(
    (f) => parseFloat(f) * 100,
  ) as Position;
  const symbol = rowArray[3];
  return { symbol, position };
}

function getBond(row: string): Bond {
  const [start, end, type] = rowToArray(row).slice(0, 3).map((c) =>
    parseInt(c)
  );
  return { start, end, type };
}

export function parse(input: string) {
  const rows = input.trim().split("\n");

  const molecule: Molecule = {
    name: rows[0],
    atoms: [],
    bonds: [],
  };

  const [atomsCount, bondsCount] = getAtomsAndBonds(rows[3]);

  const atomsStartI = 4;
  for (
    let i = atomsStartI, atomId = 1;
    i < atomsStartI + atomsCount;
    i++, atomId++
  ) {
    molecule.atoms.push({ ...getAtom(rows[i]), id: atomId });
  }

  const bondsStartI = atomsStartI + atomsCount;

  for (let i = bondsStartI; i < bondsStartI + bondsCount; i++) {
    molecule.bonds.push(getBond(rows[i]));
  }

  return molecule;
}
