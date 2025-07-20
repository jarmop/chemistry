import { addTag } from "../../library/helpers.ts";
import { Substance } from "../../library/types.ts";
import { compounds } from "./compounds.ts";
import { pureSubstances } from "./pureSubstances.ts";

export const substances: Substance[] = [
  ...addTag(pureSubstances, "pure substance"),
  ...addTag(compounds, "compound"),
];
