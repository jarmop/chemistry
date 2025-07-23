import { useState } from "react";
import { matter } from "../data/matter.ts";
import { Matter, Solid, Tag, tags } from "../library/types.ts";

export function CrystalComparison() {
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Crystal</h1>
      {/* <MatterTable matter={matter} /> */}

      <CrystalComparisonSection
        title="Crystalline"
        crystals={matter.filter((m) => m.solid === "crystalline")}
      />
      <br />
      <CrystalComparisonSection
        title="PolyCrystalline"
        crystals={matter.filter((m) => m.solid === "polycrystalline")}
      />
    </div>
  );
}

interface CrystalComparisonSectionProps {
  title: string;
  crystals: Matter[];
}

export function CrystalComparisonSection(
  { title, crystals }: CrystalComparisonSectionProps,
) {
  // const materialGroups: Partial<Record<Solid, Matter[]>> = ([
  //   "crystalline",
  //   "polycrystalline",
  // ] as Solid[]).reduce((acc, solid) => {
  //   const crystalGroup = matter.filter((m) => m.solid === solid);
  //   return { ...acc, [solid]: crystalGroup };
  // }, {});

  const materialGroups: Partial<Record<Tag, Matter[]>> = ([
    "pure substance",
    "compound",
    "homogeneous",
    "heterogeneous",
  ] as Tag[]).reduce((acc, tag) => {
    const crystalGroup = crystals.filter((m) => m.tags?.includes(tag));
    if (crystalGroup.length === 0) {
      return acc;
    }
    return { ...acc, [tag]: crystalGroup };
  }, {});

  return (
    <div
      style={{}}
    >
      <h2 style={{ marginBottom: "5px" }}>{title}</h2>
      <div
        style={{
          display: "grid",
          // gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gridTemplateColumns: "repeat(2, minmax(min-content, 1fr))",
          // gridTemplateColumns: "repeat(4, min-content)",
          gap: "40px",
          width: "min-content",
          border: "1px solid #ddd",
          padding: "20px",
          background: "#f6f6f6",
        }}
      >
        {Object.entries(materialGroups).map(([key, value]) => (
          <div
            key={key}
            style={{
              // padding: "10px",
            }}
          >
            <h3 style={{ textTransform: "capitalize", margin: "0 0 10px" }}>
              {key}
            </h3>
            <MatterTable
              matter={value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface MatterTableProps {
  matter: Matter[];
}

function MatterTable({ matter }: MatterTableProps) {
  const tagColsSet = new Set<Tag>();

  matter.flatMap((m) => m.tags).forEach((t) => tagColsSet.add(t));

  const tableCols = ([
    "name",
    "composition",
    "lattice",
    "crystal system",
    "category",
  ] as (keyof Matter)[]).filter((k) =>
    k === "composition"
      ? matter.some((m) => m[k] || m.formula)
      : matter.some((m) => m[k])
  );

  const tagCols = ([
    "alloy",
    "interstitial",
    "substitutional",
    "mineral",
    "polymer",
  ] as Tag[]).filter((t) => [...tagColsSet].includes(t));

  const [sortOrder, setSortOrder] = useState<
    (keyof Matter | Matter["tags"][number])[]
  >([
    ...tableCols,
    ...tagCols,
  ]);

  matter.sort((a, b) => {
    let foo = 0;
    for (let i = 0; i < sortOrder.length; i++) {
      const key = sortOrder[i];
      if (key === "solid") {
        foo = a[key].localeCompare(b[key]);
      } else if ((tags as readonly string[]).includes(key)) {
        foo = Number(b.tags.includes(key as typeof tags[number]) || 0) -
          Number(a.tags.includes(key as typeof tags[number]) || 0);
      }
      if (foo !== 0) {
        break;
      }
    }

    return foo;
  });

  function formatComposition(matter: Matter) {
    if (!matter.composition) {
      return matter.formula;
    }
    if (typeof matter.composition !== "object") {
      return matter.composition;
    }

    let result = "";
    Object.entries(matter.composition).forEach(([key, value]) => {
      result += `${key}: ${value}\n`;
    });

    return (
      <pre
        style={{ margin: 0, fontFamily: "inherit" }}
      >
        {result}
      </pre>
    );
  }

  return (
    <>
      <table
        style={{
          // border: "1px solid #ccc",
          borderCollapse: "collapse",
          fontSize: 14,
          background: "white",
        }}
      >
        <thead>
          <tr>
            {tableCols.map((k) => (
              <th
                key={k}
                style={{
                  border: "1px solid #ccc",
                  textTransform: "capitalize",
                  padding: "5px",
                }}
                onClick={() => {
                  const newOrder = [k, ...sortOrder.filter((v) => v !== k)];
                  setSortOrder(newOrder);
                }}
              >
                {k}
              </th>
            ))}
            {tagCols.map((t) => (
              <th
                key={t}
                style={{
                  border: "1px solid #ccc",
                  textTransform: "capitalize",
                }}
                onClick={() => {
                  const newOrder = [t, ...sortOrder.filter((v) => v !== t)];
                  setSortOrder(newOrder);
                }}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matter.map((m) => (
            <tr key={m.name}>
              {tableCols.map((k) => (
                <td
                  key={k}
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    textWrap: "nowrap",
                  }}
                  title={k === "name" ? m.description : ""}
                >
                  {k === "composition" ? formatComposition(m) : m[k]}
                </td>
              ))}
              {tagCols.map((t) => (
                <td
                  key={t}
                  style={{
                    border: "1px solid #ccc",
                    background: m.tags.includes(t) ? "black" : "",
                  }}
                >
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
