import { assertEquals } from "jsr:@std/assert";
import { createCubicBoundChecker } from "./cubic.ts";
import { Vector3 } from "three";

Deno.test("simple test", () => {
  const isWithinBounds = createCubicBoundChecker(200);

  const position = new Vector3(0, 0, 0);

  assertEquals(isWithinBounds(position), true);
});

Deno.test("simple test2", () => {
  const isWithinBounds = createCubicBoundChecker(200);

  const position = new Vector3(0, 200, 0);

  assertEquals(isWithinBounds(position), true);
});
