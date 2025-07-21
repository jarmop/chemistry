import { useState } from "react";
import { matter } from "../data/matter.ts";
import { Matter, Tag, tags } from "../library/types.ts";

export function MatterComparison() {
  const materialGroups: Partial<Record<Tag, Matter[]>> = ([
    "pure substance",
    "compound",
    "homogeneous",
    "heterogeneous",
  ] as Tag[]).reduce((acc, tag) => {
    const matters = matter.filter((m) => m.tags?.includes(tag));
    return { ...acc, [tag]: matters };
  }, {});

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Matter</h1>
      {/* <MatterTable matter={matter} /> */}
      <div
        style={{
          display: "grid",
          // gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gridTemplateColumns: "repeat(2, minmax(min-content, 1fr))",
          // gridTemplateColumns: "repeat(4, min-content)",
          gap: "30px",
          width: "min-content",
        }}
      >
        {Object.entries(materialGroups).map(([key, value]) => (
          <div
            key={key}
            style={{
              // padding: "10px",
            }}
          >
            <h2 style={{ textTransform: "capitalize", margin: "0 0 10px" }}>
              {key}
            </h2>
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

  const tagCols = [...tagColsSet].filter((t) =>
    ![
      "pure substance",
      "compound",
      "homogeneous",
      "heterogeneous",
    ].includes(t)
  );

  const [sortOrder, setSortOrder] = useState<
    (keyof Matter | Matter["tags"][number])[]
  >([
    "solid",
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

  const colKeys = ([
    "solid",
    "composition",
    "formula",
    "category",
  ] as (keyof Matter)[]).filter((k) => matter.some((m) => m[k]));

  const tableCols: (keyof Matter)[] = ["name", ...colKeys];

  // const tagCols: Tag[] = [
  //   "synthetic",
  //   "natural",
  //   "biogenic",
  //   "organic",
  //   // "pure substance",
  //   // "compound",
  //   // "homogeneous",
  //   // "heterogeneous",
  //   "alloy",
  //   "mineral",
  //   "resin",
  // ];

  function formatComposition(value: Matter["composition"]) {
    let result: string | React.ReactNode = "";
    if (!value) {
      value = "-";
    } else {
      let description = "";
      if (typeof value === "object") {
        Object.entries(value).forEach(([key, value]) => {
          description += `${key}: ${value}\n`;
        });
      } else {
        description = value;
      }
      result = <span title={description}>Show</span>;
    }

    return result;
  }

  return (
    <>
      <table
        style={{
          // border: "1px solid #ccc",
          borderCollapse: "collapse",
          fontSize: 14,
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
              <td
                style={{ border: "1px solid #ccc" }}
                title={m.description}
              >
                {m.name}
              </td>
              {colKeys.map((k) => (
                <td
                  key={k}
                  style={{
                    border: "1px solid #ccc",
                  }}
                >
                  {k === "composition" ? formatComposition(m[k]) : m[k]}
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
