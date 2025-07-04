// scripts/add_atomic_radii.js
// Usage: node scripts/add_atomic_radii.js
// This script updates client/src/data/elements.json with atomicRadius values from scripts/atomic_radii.json
// Contents of the atomic_radii.json file are from https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page)

const fs = require("fs");
const path = require("path");

const elementsPath = path.join(__dirname, "../client/src/data/elements.json");
const radiiPath = path.join(__dirname, "./data/atomic_radii.json");

const elements = JSON.parse(fs.readFileSync(elementsPath, "utf8"));
const radii = JSON.parse(fs.readFileSync(radiiPath, "utf8"));

const radiiByAtomicNumber = {};
radii.forEach((e) => {
  radiiByAtomicNumber[e.atomicNumber] = e.atomicRadius;
});

elements.forEach((el) => {
  const radius = radiiByAtomicNumber[el.protons || el.atomicNumber];
  el.atomicRadius = (typeof radius === "number") ? radius : null;
});

fs.writeFileSync(elementsPath, JSON.stringify(elements));
console.log("atomicRadius values updated in elements.json");
