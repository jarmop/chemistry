import iupacPrefixes from "./data/iupacPrefixes.json" with { type: "json" };

const carbonCount = iupacPrefixes.map((o) =>
  o["Prefix as in new system"].slice(0, -1)
);

export function parseMoleculeName(name: string) {
}

/**
 * 
 */
function moleculeToName() {

}

/**
 * 
 */
function NameToMolecule() {
  
}
