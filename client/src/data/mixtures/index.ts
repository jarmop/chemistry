import { addTag } from "../../library/helpers.ts";
import { Mixture } from "../../library/types.ts";
import { heterogeneous } from "./heterogeneous.ts";
import { homogeneous } from "./homogeneous.ts";

export const mixtures: Mixture[] = [
  ...addTag(homogeneous, "homogeneous"),
  ...addTag(heterogeneous, "heterogeneous"),
];
