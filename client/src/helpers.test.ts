import { assertEquals } from "jsr:@std/assert";
import { getElectronsPerShell, getElectronsPerSubShell } from "./helpers.ts";
import elements from "./elements.json" with { type: "json" };

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
  Deno.test(name, () => {
    const electronsPerShell = getElectronsPerShell(input);
    assertEquals(electronsPerShell, expectedResult);
  });
});

const testCases2 = elements.map((element) => {
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

testCases2.forEach(({ name, input, expectedResult }) => {
  Deno.test(name, () => {
    const electronsPerShell = getElectronsPerSubShell(input);
    assertEquals(electronsPerShell, expectedResult);
  });
});
