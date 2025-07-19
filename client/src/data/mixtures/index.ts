import { Mixture, Tag } from "../../library/types.ts";
import { heterogenous } from "./heterogenous.ts";
import { homogenous } from "./homogenous.ts";

export const mixtures: Mixture[] = [
  ...addTag(homogenous, "homogenous"),
  ...addTag(heterogenous, "heterogenous"),
];

function addTag(objects: Mixture[], tag: Tag) {
  return objects.map((o) => ({
    ...o,
    tags: [...o.tags, tag],
  }));
}
