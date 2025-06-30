import elements from "./elements.json" with { type: "json" };
import { Element } from "../library/types.ts";

export default elements as unknown as Element[];
