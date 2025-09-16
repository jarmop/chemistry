import { useEffect, useState } from "react";
import iupacPrefixes from "./data/iupacPrefixes.json" with { type: "json" };
import { parseMoleculeName } from "./moleculeNameParser.ts";

const moleculeNameParts = [
  {
    name: "chainLength",
    options: iupacPrefixes.map((o) => o["Prefix as in new system"]),
  },
  { name: "bondType", options: ["-ane", "-ene", "-yne"] },
  { name: "functionalGroup", options: ["-ol", "-al", "-oic acid", "-amine"] },
] as const;

type NamePart = typeof moleculeNameParts[number];

type NameParts = Record<NamePart["name"], NamePart["options"][number]>;

export function OrganicMoleculeSelector() {
  const [nameParts, setNameParts] = useState<NameParts>({
    chainLength: "meth-",
    bondType: "-ane",
    functionalGroup: "-ol",
  });
  const [carbonCount, setCarbonCount] = useState(1);

  useEffect(() => {
  }, [carbonCount]);

  function handleNamePartChange(key: keyof NameParts, value: string) {
    setNameParts({
      ...nameParts,
      [key]: value,
    });
  }

  let [a, b, c] = Object.values(nameParts);

  a = a.slice(0, -1);
  b = b.slice(1, -1);
  c = c.slice(1);
  // if (c === "amine") {
  //   b = b.slice(0, -1);
  // }

  const name = a + b + c;

  parseMoleculeName(name);

  return (
    <>
      <div>
        {moleculeNameParts.map((p) => (
          <select
            key={p.name}
            value={nameParts[p.name]}
            onChange={(e) => handleNamePartChange(p.name, e.target.value)}
            style={{ cursor: "pointer" }}
          >
            {p.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <div>{name}</div>
      </div>
      Carbon count:{" "}
      <input
        type="number"
        min="1"
        max="10"
        value={carbonCount}
        onChange={(e) => setCarbonCount(parseInt(e.target.value))}
      />
    </>
  );
}

function buildOrganicMolecule(carbonCount: number) {
}
