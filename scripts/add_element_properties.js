// scripts/add_element_properties.js
// Usage: node scripts/add_element_properties.js
// This script adds electronAffinity, ionizationEnergy, and atomicRadius to all elements in elements.json
// using data from Bowserinator/Periodic-Table-JSON (https://github.com/Bowserinator/Periodic-Table-JSON)

const fs = require("fs");
const path = require("path");

const elementsPath = path.join(__dirname, "../client/src/data/elements.json");
const periodicTablePath = path.join(__dirname, "Periodic-Table-JSON.json"); // Download from https://github.com/Bowserinator/Periodic-Table-JSON

const elements = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
const periodicTable =
  JSON.parse(fs.readFileSync(periodicTablePath, "utf8")).elements;

// Build a lookup by symbol and atomic number
const ptBySymbol = Object.fromEntries(periodicTable.map((e) => [e.symbol, e]));
const ptByNumber = Object.fromEntries(periodicTable.map((e) => [e.number, e]));

let changed = false;
for (const el of elements) {
  const match = ptBySymbol[el.symbol] || ptByNumber[el.protons];
  if (match) {
    // Electron affinity
    if (el.electronAffinity !== match.electron_affinity) {
      el.electronAffinity = match.electron_affinity ?? null;
      changed = true;
    }
    // Ionization energy (first value)
    const ionEn = Array.isArray(match.ionization_energies)
      ? match.ionization_energies[0]
      : null;
    if (el.ionizationEnergy !== ionEn) {
      el.ionizationEnergy = ionEn;
      changed = true;
    }
    // Atomic radius (empirical, covalent, or calculated)
    const radius = match.atomic_radius ?? match.radius_empirical ??
      match.radius_covalent ?? match.radius_calculated ?? null;
    if (el.atomicRadius !== radius) {
      el.atomicRadius = radius;
      changed = true;
    }
  } else {
    // No match found, set to null if not present
    if (el.electronAffinity === undefined) {
      el.electronAffinity = null;
      changed = true;
    }
    if (el.ionizationEnergy === undefined) {
      el.ionizationEnergy = null;
      changed = true;
    }
    if (el.atomicRadius === undefined) {
      el.atomicRadius = null;
      changed = true;
    }
  }
}

if (changed) {
  fs.writeFileSync(elementsPath, JSON.stringify(elements));
  console.log("elements.json updated.");
} else {
  console.log("No changes needed.");
}
