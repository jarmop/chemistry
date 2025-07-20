import { addTag } from "../../library/helpers.ts";
import { Mixture } from "../../library/types.ts";
import { heterogenous } from "./heterogenous.ts";
import { homogenous } from "./homogenous.ts";

export const mixtures: Mixture[] = [
  ...addTag(homogenous, "homogenous"),
  ...addTag(heterogenous, "heterogenous"),
];
