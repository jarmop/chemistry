import elementsJSON from "./elements.json" with { type: "json" };
import { Element } from "../library/types.ts";

const elements = elementsJSON
  .sort((a, b) => b.abundanceOnEarthCrust - a.abundanceOnEarthCrust)
  .map((el, i) => {
    return {
      ...el,
      abundanceRank: i + 1,
    };
  });

export default elements as unknown as Element[];
