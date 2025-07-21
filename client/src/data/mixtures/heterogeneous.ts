import { Mixture } from "../../library/types.ts";
import { minerals } from "./minerals.ts";
import { polymer } from "./polymer.ts";

export const heterogeneous: Mixture[] = [
  {
    name: "Pine tar",
    composition: {
      "Methyl dehydroabietate": "22.44%",
      "Dehydroabietic acid": "14.59%",
      "Retene (7-isopropyl-1-methylphenanthrene)": "10.08%",
      "Isopimaral": "6.18%",
      "Pimaral": "4.71%",
      "Abietic acid": "4.23%",
      "Pimaric acid": "3.59%",
      "18-Norabieta-8,11,13-triene": "3.50%",
      "2,3,5-Trimethylphenanthrene": "1.72%",
      "Levoglucosan": "1.44%",
    },
    tags: ["biogenic"],
  },
  {
    name: "Concrete",
    composition: "",
    tags: ["synthetic"],
  },
  {
    name: "Earthenware",
    composition: "25% kaolin, 25% ball clay, 35% quartz and 15% feldspar.",
    tags: ["natural"],
  },
  {
    name: "Clay",
    composition:
      "Fine-grained natural soil material containing clay minerals (hydrous aluminium phyllosilicates, e.g. kaolinite, Al2Si2O5(OH)4).",
    tags: ["natural"],
  },
  ...minerals,
  ...polymer,
];
