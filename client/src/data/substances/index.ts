import { Substance, Tag } from "../../library/types.ts";
import { compounds } from "./compounds.ts";
import { pureSubstances } from "./pureSubstances.ts";

export const substances: Substance[] = [
  ...addTag(pureSubstances, "pure substance"),
  ...addTag(compounds, "compound"),
];

function addTag(
  objects: Substance[],
  tag: Tag,
) {
  return objects.map((o) => ({
    ...o,
    tags: [...o.tags, tag],
  }));
}
