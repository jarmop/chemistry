/* Deprecated */

import { getElectronsPerSubShell } from "../client/src/library/helpers.ts";
import oldElements from "../client/src/data/elements.json" with {
  type: "json",
};

const text = await Deno.readTextFile("./data/chemical-elements.tsv");

const rows = text.split("\n");

const elements = rows.slice(1).map((row) => {
  const cols = row.split("\t");
  const protons = parseInt(cols[0]);
  const atomicWeight = parseFloat(cols[6]);
  const electronegativity = parseFloat(cols[9]);
  const abundanceOnEarthCrust = parseFloat(cols[11]);
  const phase = cols[15];

  const element = {
    name: cols[2],
    symbol: cols[1],
    protons,
    // atomic weight is in Daltons which is very close to the weight of a nucleon
    neutrons: Math.round(atomicWeight) - protons,
    // electrons: Object.values(getElectronsPerSubShell(protons)),
    block: cols[3],
    group: cols[4],
    period: cols[5],
    atomicWeight: atomicWeight,
    origin: cols[7],
    electronegativity: isNaN(electronegativity) ? 0 : electronegativity,
    abundanceOnEarthCrust: isNaN(abundanceOnEarthCrust)
      ? 0
      : abundanceOnEarthCrust,
    phase,
    density: phase === "unknown phase" ? 0 : parseFloat(cols[14]),
    meltingPoint: parseFloat(cols[12]),
    boilingPoint: parseFloat(cols[13]),
  };

  return {
    ...oldElements.find((el) => el.protons === protons),
    ...element,
  };
});

const elementsJson = JSON.stringify(elements);

await Deno.writeTextFile("../client/src/data/elements.json", elementsJson);

// console.log(elements[0]);
