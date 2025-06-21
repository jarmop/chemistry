import { getElectronsPerSubShell } from "../client/src/helpers.ts";

const text = await Deno.readTextFile("chemical-elements.tsv");

const rows = text.split("\n");

const elements = rows.slice(1).map((row) => {
  const cols = row.split("\t");
  const protons = parseInt(cols[0]);
  const atomicWeight = parseFloat(cols[6]);
  const electroNegativity = parseFloat(cols[9]);
  const abundanceOnEarthCrust = parseFloat(cols[11]);

  const element = {
    name: cols[2],
    symbol: cols[1],
    protons,
    // atomic weight is in Daltons which is very close to the weight of a nucleon
    neutrons: Math.round(atomicWeight) - protons,
    electrons: Object.values(getElectronsPerSubShell(protons)),
    block: cols[3],
    group: cols[4],
    period: cols[5],
    atomicWeight: atomicWeight,
    origin: cols[7],
    electroNegativity: isNaN(electroNegativity) ? 0 : electroNegativity,
    abundanceOnEarthCrust: isNaN(abundanceOnEarthCrust)
      ? 0
      : abundanceOnEarthCrust,
  };

  return element;
});

const elementsJson = JSON.stringify(elements);

await Deno.writeTextFile("../client/src/data/elements.json", elementsJson);

// console.log(elements[0]);
