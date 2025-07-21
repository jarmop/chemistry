import { useState } from "react";
import { matter } from "../data/matter.ts";
import { Matter, Tag, tags } from "../library/types.ts";

export function MatterComparison() {
  const materialGroups: Partial<Record<Tag, Matter[]>> = ([
    "pure substance",
    "compound",
    "homogenous",
    "heterogeneous",
  ] as Tag[]).reduce((acc, tag) => {
    return { ...acc, [tag]: matter.filter((m) => m.tags?.includes(tag)) };
  }, {});

  return (
    <>
      <h1>Matter</h1>
      {/* <MatterTable matter={matter} /> */}
      <div
        style={{
          display: "grid",
          // gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gridTemplateColumns: "repeat(2, minmax(min-content, 1fr))",
          // gridTemplateColumns: "repeat(4, min-content)",
          gap: "10px",
          padding: "10px",
        }}
      >
        {Object.entries(materialGroups).map(([key, value]) => (
          <div
            key={key}
            style={{
              // border: "1px solid",
              padding: "10px",
            }}
          >
            <h2 style={{ textTransform: "capitalize" }}>{key}</h2>
            {
              /* <ul>
              {value.map((m) => <li key={m.name}>{m.name}</li>)}
            </ul> */
            }
            <MatterTable matter={value} />
          </div>
        ))}
      </div>
    </>
  );
}

interface MatterTableProps {
  matter: Matter[];
}

function MatterTable({ matter }: MatterTableProps) {
  const tagCols: Tag[] = tags.filter((t) =>
    ![
      "pure substance",
      "compound",
      "homogenous",
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

  const keyParts: (keyof Matter)[] = [
    "solid",
  ];

  const tableCols: (keyof Matter)[] = ["name", ...keyParts];

  // const tagCols: Tag[] = [
  //   "synthetic",
  //   "natural",
  //   "biogenic",
  //   "organic",
  //   // "pure substance",
  //   // "compound",
  //   // "homogenous",
  //   // "heterogeneous",
  //   "alloy",
  //   "mineral",
  //   "resin",
  // ];

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
              >
                {m.name}
              </td>
              {keyParts.map((k) => (
                <td
                  key={k}
                  style={{
                    border: "1px solid #ccc",
                    textWrap: "nowrap",
                  }}
                >
                  {(m as Matter)[k]}
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
