import { useState } from "react";
import { Material, materials } from "./data/materials.ts";

export function Materials() {
  const [sortOrder, setSortOrder] = useState<(keyof Material)[]>([
    "synthetic",
    "natural",
    "biogenic",
    "organic",
  ]);
  materials.sort((a, b) => {
    let foo = 0;
    for (let i = 0; i < sortOrder.length; i++) {
      const key = sortOrder[i];
      foo = Number(b[key] || 0) - Number(a[key] || 0);
      if (foo !== 0) {
        break;
      }
    }

    return foo;
  });

  const synthetic = materials.filter((m) => m.synthetic);
  const natural = materials.filter((m) => m.natural);
  const biogenic = materials.filter((m) => m.biogenic);
  const organic = materials.filter((m) => m.organic);
  const materialGroups = { synthetic, natural, biogenic, organic };

  const keyParts: (keyof Material)[] = [
    "synthetic",
    "natural",
    "biogenic",
    "organic",
  ];

  const mixedGroups = materials.reduce<Record<string, Material[]>>(
    (acc, curr) => {
      const key = keyParts.filter((k) => curr[k]).join(", ");
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);

      return acc;
    },
    {},
  );

  console.log(mixedGroups);

  const tableCols: (keyof Material)[] = ["name", ...keyParts];

  return (
    <>
      <h1>Materials</h1>
      <table
        style={{
          // border: "1px solid #ccc",
          borderCollapse: "collapse",
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
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
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
                    background: m[k] ? "black" : "",
                  }}
                >
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
            <ul>
              {value.map((m) => <li key={m.name}>{m.name}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
