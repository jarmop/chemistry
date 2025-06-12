import { assertEquals } from "jsr:@std/assert";
import { getElectronsPerShell } from "./helpers.ts";
import { elements } from "./elements.ts";

const testCases = elements.map((element) => {
  const electronsPerShell: Record<number, number> = {};
  element.electrons.forEach((value, index) => {
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
