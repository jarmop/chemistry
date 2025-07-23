import { addTag } from "../../library/helpers.ts";
import { Mixture } from "../../library/types.ts";

export const minerals: Mixture[] = addTag([
  {
    name: "Feldspar",
    composition: "Major compounds: KAlSi3O8, NaAlSi3O8, CaAl2Si2O8",
    solid: "polycrystalline",
    tags: ["natural"],
    category: "	Tectosilicate",
  },
], "mineral");
