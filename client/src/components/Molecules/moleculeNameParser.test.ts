import { assertEquals } from "jsr:@std/assert";
import { parseMoleculeName } from "./moleculeNameParser.ts";

Deno.test("simple test", () => {
  const result = parseMoleculeName("Methanol");

  console.log(result);

  //   assertEquals(isWithinBounds(position), true);
});
