/**
 * n = 1, l = 0
 * n = 2, l = 0,1
 * n = 3, l = 0,1
 *
 * after filling first subshell, fill second subshell of the previous shell
 *
 * two dimensional array, n x l
 * n + l
 *
 * 1+0,
 * 2+0,2+1
 * 3+0,3+1,3+2
 * 4+0,4+1,4+2,4+3
 *
 * 1
 * 2,3
 * 3,4,5
 * 4,5,6,7
 * 5,6,7,8,9
 *
 * Start filling two-dimensional array
 *
 * 19 Potassium
 * [2]
 * [2,6]
 * [2,6]
 * [1]
 *
 * 20 Calcium
 * [2]
 * [2,6]
 * [2,6]
 * [2]
 *
 * 21 Scandium
 * [2]
 * [2,6]
 * [2,6,1]
 * [2]
 */

export function getMaximumNumberOfElectronsPerShell(numberOfShells = 7) {
  const numberOfElectronsPerShell = [];
  for (let i = 0; i < numberOfShells; i++) {
    numberOfElectronsPerShell.push(2 * Math.pow(i + 1, 2));
  }

  return numberOfElectronsPerShell;
}

export function getMaximumNumberOfElectronsPerSubShell(numberOfSubShells = 7) {
  const numberOfElectronsPerSubShell = [];
  for (let i = 0; i < numberOfSubShells; i++) {
    numberOfElectronsPerSubShell.push(2 * (2 * i + 1));
  }

  return numberOfElectronsPerSubShell;
}

export function getElectronsPerSubShell(numberOfElectrons: number) {
  const electronsPerSubShell: Record<number, number[]> = {};

  let totalElectrons = 0;
  let E = 1;

  while (totalElectrons < numberOfElectrons && E < 10) {
    let n = Math.ceil((E + 1) / 2);
    let l = E - n;

    while (n + l === E) {
      const electronsOnSubShell = 2 * (2 * l + 1);
      if (!electronsPerSubShell[n]) {
        electronsPerSubShell[n] = [];
      }

      totalElectrons += electronsOnSubShell;
      if (totalElectrons >= numberOfElectrons) {
        const excess = totalElectrons - numberOfElectrons;
        electronsPerSubShell[n][l] = electronsOnSubShell - excess;
        break;
      }

      electronsPerSubShell[n][l] = electronsOnSubShell;

      if (l > 0) {
        n++;
        l--;
      } else {
        E++;
      }
    }
  }

  return electronsPerSubShell;
}

export function getElectronsPerShell(numberOfElectrons: number) {
  const electronsPerSubShell = getElectronsPerSubShell(numberOfElectrons);

  const electronsPerShell: Record<number, number> = {};
  for (const [key, arr] of Object.entries(electronsPerSubShell)) {
    electronsPerShell[parseInt(key)] = arr.reduce((acc, curr) => acc + curr, 0);
  }

  return electronsPerShell;
}

export function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Parses a chemical formula and returns an object with elements and their counts
 * @param formula - Chemical formula string (e.g., "H2O", "CaCO3", "C6H12O6")
 * @returns Object with element symbols as keys and counts as values
 *
 * Examples:
 * parseFormula("H2O") → { H: 2, O: 1 }
 * parseFormula("CaCO3") → { Ca: 1, C: 1, O: 3 }
 * parseFormula("C6H12O6") → { C: 6, H: 12, O: 6 }
 * parseFormula("Fe2O3") → { Fe: 2, O: 3 }
 */
export function parseFormula(formula: string): Record<string, number> {
  const result: Record<string, number> = {};

  // Regex to match element symbols (1-2 letters) followed by optional numbers
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;

  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    const count = match[2] === "" ? 1 : parseInt(match[2], 10);

    result[element] = (result[element] || 0) + count;
  }

  return result;
}

/**
 * Alternative version that handles parentheses and complex formulas
 * @param formula - Chemical formula string (e.g., "Ca(OH)2", "Fe2(SO4)3")
 * @returns Object with element symbols as keys and counts as values
 */
export function parseComplexFormula(formula: string): Record<string, number> {
  // Remove spaces
  const cleanFormula = formula.replace(/\s/g, "");

  // Handle dot/hydrate notation (e.g., Na2CO3·10H2O)
  const parts = cleanFormula.split(/[·.]/);
  const total: Record<string, number> = {};
  for (const part of parts) {
    // Check for leading multiplier (e.g., 10H2O)
    const match = part.match(/^(\d+)([A-Z(].*)$/);
    let parsed: Record<string, number>;
    let multiplier = 1;
    if (match) {
      multiplier = parseInt(match[1], 10);
      parsed = parseFormulaRecursive(match[2]);
    } else {
      parsed = parseFormulaRecursive(part);
    }
    for (const [el, count] of Object.entries(parsed)) {
      total[el] = (total[el] || 0) + count * multiplier;
    }
  }
  return total;
}

// Recursive parser for chemical formulas with parentheses
function parseFormulaRecursive(formula: string): Record<string, number> {
  const result: Record<string, number> = {};
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === "(") {
      // Find the matching closing parenthesis
      let depth = 1;
      let j = i + 1;
      while (j < formula.length && depth > 0) {
        if (formula[j] === "(") depth++;
        else if (formula[j] === ")") depth--;
        j++;
      }
      const inside = formula.slice(i + 1, j - 1);
      // Find multiplier after parenthesis
      let k = j;
      let multiplierStr = "";
      while (k < formula.length && /\d/.test(formula[k])) {
        multiplierStr += formula[k];
        k++;
      }
      const multiplier = multiplierStr ? parseInt(multiplierStr, 10) : 1;
      const innerResult = parseFormulaRecursive(inside);
      for (const [el, count] of Object.entries(innerResult)) {
        result[el] = (result[el] || 0) + count * multiplier;
      }
      i = k;
    } else {
      // Match element and optional number
      const match = formula.slice(i).match(/^([A-Z][a-z]?)(\d*)/);
      if (match) {
        const el = match[1];
        const count = match[2] ? parseInt(match[2], 10) : 1;
        result[el] = (result[el] || 0) + count;
        i += match[0].length;
      } else {
        // Unrecognized character, skip
        i++;
      }
    }
  }
  return result;
}

/**
 * Calculates the molar mass of a chemical compound from its formula
 * @param formula - Chemical formula string (e.g., "H2O", "CaCO3", "C6H12O6")
 * @param elements - Array of element data with atomic weights
 * @returns Molar mass in g/mol
 *
 * Examples:
 * calculateMolarMass("H2O", elements) → 18.02
 * calculateMolarMass("CO2", elements) → 44.01
 * calculateMolarMass("C6H12O6", elements) → 180.16
 */
export function calculateMolarMass(
  formula: string,
  elements: Array<{ symbol: string; atomicWeight: number }>,
): number {
  const moleculeElements = parseComplexFormula(formula);
  const molarMass = Object.entries(moleculeElements).reduce(
    (acc, [element, count]) => {
      const elementData = elements.find((e) => e.symbol === element);
      if (elementData) {
        return acc + elementData.atomicWeight * count;
      }
      return acc;
    },
    0.0,
  );
  return molarMass;
}

/**
 * Calculates the molar mass and returns it as a formatted string
 * @param formula - Chemical formula string
 * @param elements - Array of element data with atomic weights
 * @returns Molar mass formatted to 2 decimal places
 */
export function calculateMolarMassFormatted(
  formula: string,
  elements: Array<{ symbol: string; atomicWeight: number }>,
): string {
  return calculateMolarMass(formula, elements).toFixed(2);
}
