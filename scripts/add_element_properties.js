// scripts/add_element_properties.js
// Usage: node scripts/add_element_properties.js
// This script adds electronAffinity, ionizationEnergy, and atomicRadius to all elements in elements.json
// using data from Bowserinator/Periodic-Table-JSON (https://github.com/Bowserinator/Periodic-Table-JSON)

const fs = require("fs");
const path = require("path");

const elementsPath = path.join(__dirname, "../client/src/data/elements.json");
const periodicTablePath = path.join(
  __dirname,
  "./data/Periodic-Table-JSON.json",
); // Download from https://github.com/Bowserinator/Periodic-Table-JSON

const oldElements = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
const periodicTable =
  JSON.parse(fs.readFileSync(periodicTablePath, "utf8")).elements;

// Build a lookup by symbol
const ptBySymbol = Object.fromEntries(periodicTable.map((e) => [e.symbol, e]));

const newElements = [];
for (const oldElement of oldElements) {
  const elementData = ptBySymbol[oldElement.symbol];
  if (!elementData) {
    console.log(`No data found for ${oldElement.symbol}`);
    continue;
  }

  const electronConfigurationConfirmed =
    elementData.electron_configuration_semantic.substring(0, 1) !== "*";
  const electronConfiguration = electronConfigurationConfirmed
    ? elementData.electron_configuration_semantic
    : elementData.electron_configuration_semantic.substring(1);
  const electrons = elementData.electron_configuration
    .split(" ")
    .reduce((acc, e) => {
      const [nString, subShell, numElString] = e.split(/([spdf])/);
      const n = Number(nString);
      const s = subShell === "s"
        ? 0
        : subShell === "p"
        ? 1
        : subShell === "d"
        ? 2
        : 3;
      const numEl = Number(numElString);

      if (!acc[n - 1]) {
        acc[n - 1] = [];
      }
      if (!acc[n - 1][s]) {
        acc[n - 1][s] = 0;
      }

      acc[n - 1][s] += numEl;

      return acc;
    }, []);

  if (elementData) {
    newElements.push({
      ...oldElement,
      electronAffinity: elementData.electron_affinity ?? null,
      ionizationEnergy: elementData.ionization_energies[0] ?? null,
      electronConfiguration: electronConfiguration ?? null,
      electronConfigurationConfirmed: electronConfigurationConfirmed ?? null,
      electrons: electrons ?? null,
      category: elementData.category.split(",")[0],
    });
  }
}

fs.writeFileSync(elementsPath, JSON.stringify(newElements));
console.log("elements.json updated.");
