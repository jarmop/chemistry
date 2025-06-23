import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import {
  calculateMolarMass,
  calculateMolarMassFormatted,
  getElectronsPerShell,
  getElectronsPerSubShell,
  parseComplexFormula,
  parseFormula,
} from "./helpers.ts";
import elements from "../data/elements.json" with { type: "json" };

describe("getElectronsPerShell", () => {
  const testCases = elements.map((element) => {
    const electronsPerShell: Record<number, number> = {};

    const electronsPerShellIndex = element.electrons.map((perSubShell) =>
      perSubShell.reduce((acc, curr) => acc + curr, 0)
    );

    electronsPerShellIndex.forEach((value, index) => {
      const n = index + 1;
      electronsPerShell[n] = value;
    });

    return {
      name: element.name,
      input: element.protons,
      expectedResult: electronsPerShell,
    };
  });

  testCases.forEach(({ name, input, expectedResult }) => {
    it(`should calculate electrons per shell for ${name}`, () => {
      const electronsPerShell = getElectronsPerShell(input);
      assertEquals(electronsPerShell, expectedResult);
    });
  });
});

describe("getElectronsPerSubShell", () => {
  const testCases = elements.map((element) => {
    const electronsPerSubShell: Record<number, number[]> = {};

    element.electrons.forEach((value, index) => {
      const n = index + 1;
      electronsPerSubShell[n] = value;
    });

    return {
      name: element.name,
      input: element.protons,
      expectedResult: electronsPerSubShell,
    };
  });

  testCases.forEach(({ name, input, expectedResult }) => {
    it(`should calculate electrons per subshell for ${name}`, () => {
      const electronsPerSubShell = getElectronsPerSubShell(input);
      assertEquals(electronsPerSubShell, expectedResult);
    });
  });
});

describe("parseFormula", () => {
  it("should parse simple formulas with single elements", () => {
    assertEquals(parseFormula("H"), { H: 1 });
    assertEquals(parseFormula("O"), { O: 1 });
    assertEquals(parseFormula("Fe"), { Fe: 1 });
  });

  it("should parse formulas with numbers", () => {
    assertEquals(parseFormula("H2"), { H: 2 });
    assertEquals(parseFormula("O2"), { O: 2 });
    assertEquals(parseFormula("N2"), { N: 2 });
  });

  it("should parse compound formulas", () => {
    assertEquals(parseFormula("H2O"), { H: 2, O: 1 });
    assertEquals(parseFormula("CO2"), { C: 1, O: 2 });
    assertEquals(parseFormula("CH4"), { C: 1, H: 4 });
  });

  it("should parse complex organic formulas", () => {
    assertEquals(parseFormula("C6H12O6"), { C: 6, H: 12, O: 6 });
    assertEquals(parseFormula("C2H5OH"), { C: 2, H: 6, O: 1 });
    assertEquals(parseFormula("CH3COOH"), { C: 2, H: 4, O: 2 });
  });

  it("should handle formulas with multiple atoms of the same element", () => {
    assertEquals(parseFormula("Fe2O3"), { Fe: 2, O: 3 });
    assertEquals(parseFormula("Al2O3"), { Al: 2, O: 3 });
    assertEquals(parseFormula("CaCO3"), { Ca: 1, C: 1, O: 3 });
  });
});

describe("parseComplexFormula", () => {
  it("should parse simple formulas (same as parseFormula)", () => {
    assertEquals(parseComplexFormula("H2O"), { H: 2, O: 1 });
    assertEquals(parseComplexFormula("CO2"), { C: 1, O: 2 });
  });

  it("should parse formulas with single parentheses", () => {
    assertEquals(parseComplexFormula("Ca(OH)2"), { Ca: 1, O: 2, H: 2 });
    assertEquals(parseComplexFormula("Mg(OH)2"), { Mg: 1, O: 2, H: 2 });
    assertEquals(parseComplexFormula("Al(OH)3"), { Al: 1, O: 3, H: 3 });
  });

  it("should parse formulas with complex parentheses", () => {
    assertEquals(parseComplexFormula("Fe2(SO4)3"), { Fe: 2, S: 3, O: 12 });
    assertEquals(parseComplexFormula("Al2(SO4)3"), { Al: 2, S: 3, O: 12 });
    assertEquals(parseComplexFormula("Ca3(PO4)2"), { Ca: 3, P: 2, O: 8 });
  });

  it("should handle nested parentheses", () => {
    assertEquals(parseComplexFormula("Na2CO3·10H2O"), {
      Na: 2,
      C: 1,
      O: 13,
      H: 20,
    });
    assertEquals(parseComplexFormula("CuSO4·5H2O"), {
      Cu: 1,
      S: 1,
      O: 9,
      H: 10,
    });
  });

  it("should handle formulas with no multiplier after parentheses", () => {
    assertEquals(parseComplexFormula("Na(OH)"), { Na: 1, O: 1, H: 1 });
    assertEquals(parseComplexFormula("K(OH)"), { K: 1, O: 1, H: 1 });
  });

  it("should handle formulas with spaces", () => {
    assertEquals(parseComplexFormula("Ca (OH) 2"), { Ca: 1, O: 2, H: 2 });
    assertEquals(parseComplexFormula("Fe 2 (SO 4) 3"), { Fe: 2, S: 3, O: 12 });
  });
});

describe("calculateMolarMass", () => {
  it("should calculate molar mass for simple molecules", () => {
    assertAlmostEquals(calculateMolarMass("H2O", elements), 18.02, 0.01);
    assertAlmostEquals(calculateMolarMass("CO2", elements), 44.01, 0.01);
    assertAlmostEquals(calculateMolarMass("N2", elements), 28.01, 0.01);
    assertAlmostEquals(calculateMolarMass("O2", elements), 32.00, 0.01);
  });

  it("should calculate molar mass for complex organic molecules", () => {
    assertAlmostEquals(calculateMolarMass("C6H12O6", elements), 180.16, 0.01);
    assertAlmostEquals(calculateMolarMass("C2H5OH", elements), 46.07, 0.01);
    assertAlmostEquals(calculateMolarMass("CH3COOH", elements), 60.05, 0.01);
    assertAlmostEquals(calculateMolarMass("CH4", elements), 16.04, 0.01);
  });

  it("should calculate molar mass for inorganic compounds", () => {
    assertAlmostEquals(calculateMolarMass("NaCl", elements), 58.44, 0.01);
    assertAlmostEquals(calculateMolarMass("H2SO4", elements), 98.08, 0.01);
    assertAlmostEquals(calculateMolarMass("CaCO3", elements), 100.09, 0.01);
    assertAlmostEquals(calculateMolarMass("NaOH", elements), 40.00, 0.01);
  });

  it("should calculate molar mass for compounds with parentheses", () => {
    assertAlmostEquals(calculateMolarMass("Ca(OH)2", elements), 74.09, 0.01);
    assertAlmostEquals(calculateMolarMass("Fe2(SO4)3", elements), 399.89, 0.01);
    assertAlmostEquals(calculateMolarMass("Al2(SO4)3", elements), 342.16, 0.01);
  });

  it("should calculate molar mass for hydrates", () => {
    assertAlmostEquals(
      calculateMolarMass("Na2CO3·10H2O", elements),
      286.14,
      0.01,
    );
    assertAlmostEquals(
      calculateMolarMass("CuSO4·5H2O", elements),
      249.68,
      0.01,
    );
  });

  it("should handle single elements", () => {
    assertAlmostEquals(calculateMolarMass("H", elements), 1.01, 0.01);
    assertAlmostEquals(calculateMolarMass("O", elements), 16.00, 0.01);
    assertAlmostEquals(calculateMolarMass("Fe", elements), 55.85, 0.01);
    assertAlmostEquals(calculateMolarMass("Na", elements), 22.99, 0.01);
  });

  it("should handle elements with numbers", () => {
    assertAlmostEquals(calculateMolarMass("H2", elements), 2.02, 0.01);
    assertAlmostEquals(calculateMolarMass("O3", elements), 48.00, 0.01);
    assertAlmostEquals(calculateMolarMass("P4", elements), 123.89, 0.01);
  });
});

describe("calculateMolarMassFormatted", () => {
  it("should return formatted molar mass as string", () => {
    assertEquals(calculateMolarMassFormatted("H2O", elements), "18.02");
    assertEquals(calculateMolarMassFormatted("CO2", elements), "44.01");
    assertEquals(calculateMolarMassFormatted("C6H12O6", elements), "180.16");
  });

  it("should handle complex formulas with proper formatting", () => {
    assertEquals(calculateMolarMassFormatted("Ca(OH)2", elements), "74.09");
    assertEquals(calculateMolarMassFormatted("Fe2(SO4)3", elements), "399.89");
    assertEquals(
      calculateMolarMassFormatted("Na2CO3·10H2O", elements),
      "286.14",
    );
  });

  it("should format single elements correctly", () => {
    assertEquals(calculateMolarMassFormatted("H", elements), "1.01");
    assertEquals(calculateMolarMassFormatted("Fe", elements), "55.84");
  });
});
