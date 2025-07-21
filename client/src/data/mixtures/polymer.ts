import { addTag } from "../../library/helpers.ts";
import { Mixture } from "../../library/types.ts";

export const polymer: Mixture[] = addTag([
  {
    name: "Natural rubber",
    tags: ["organic", "biogenic", "natural", "colloid"],
    description: "Elastic substance processed from latex",
    composition:
      "Mostly cis-1,4-polyisoprene. A small percentage (up to 5% of dry mass) of other materials, such as proteins, fatty acids, resins, and inorganic materials (salts).",
  },
  {
    name: "Natural latex",
    tags: ["organic", "biogenic", "natural", "colloid"],
    description: `- Milky fluid that is processed into natural rubber. 
      - IUPAC definition: colloidal dispersion of polymer particles in a liquid`,
    composition:
      "Mostly cis-1,4-polyisoprene. A small percentage (up to 5% of dry mass) of other materials, such as proteins, fatty acids, resins, and inorganic materials (salts).",
  },
  {
    name: "Amber",
    composition: "Mixture of organic compounds, predominantly terpenes",
    description:
      "A solid or highly viscous liquid that can be converted into a polymer.",
    tags: ["biogenic", "synthetic", "resin", "colloid"],
  },
], "polymer");
