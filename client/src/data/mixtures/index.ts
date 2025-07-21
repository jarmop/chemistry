import { addTag } from "../../library/helpers.ts";
import { Mixture } from "../../library/types.ts";
import { heterogeneous } from "./heterogeneous.ts";
import { homogenous } from "./homogenous.ts";

export const mixtures: Mixture[] = [
  ...addTag(homogenous, "homogenous"),
  ...addTag(heterogeneous, "heterogeneous"),
];
