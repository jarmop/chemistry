import { useContext } from "react";
import elements from "./elements.json" with { type: "json" };
import { StateContext } from "./StateContext.ts";

const color: Record<string, string> = {
  "s-block": "pink",
  "f-block": "lightgreen",
  "d-block": "lightblue",
  "p-block": "lightyellow",
};

type Element = typeof elements[number];

interface PeriodicTableProps {
  onElementSelected: (element: Element) => void;
}

export function PeriodicTable(
  { onElementSelected }: PeriodicTableProps,
) {
  const { element: selectedZ } = useContext(StateContext);

  const elementsByPeriodAndGroup: Record<string, Record<string, Element>> = {};
  const fBlockGroups: Record<string, Record<string, Element>> = {};

  elements.forEach((el) => {
    if (el.block === "f-block") {
      if (!fBlockGroups[el.period]) {
        fBlockGroups[el.period] = {};
      }
      fBlockGroups[el.period][el.protons] = el;
    } else {
      if (!elementsByPeriodAndGroup[el.period]) {
        elementsByPeriodAndGroup[el.period] = {};
      }

      elementsByPeriodAndGroup[el.period][el.group] = el;
    }
  });

  const groups = Object.keys(elementsByPeriodAndGroup[6]);
  const periods = Object.keys(elementsByPeriodAndGroup);

  return (
    <>
      <table className="periodicTable">
        <thead>
          <tr>
            <th></th>
            {groups.map((group) => <th key={group}>{group}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <th>{period}</th>
              {groups.map((group) => {
                const element = elementsByPeriodAndGroup[period][group];
                if (!element) {
                  return <td key={group}></td>;
                }

                if (selectedZ === element.protons) {
                  console.log(element);
                }

                return (
                  <td
                    key={group}
                    onClick={() => onElementSelected(element)}
                    style={{
                      cursor: "pointer",
                      background: selectedZ === element.protons
                        ? "lightgrey"
                        : color[element.block],
                    }}
                  >
                    {element.symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <table className="periodicTable" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th colSpan={Object.keys(fBlockGroups[6]).length}>
              F-block groups
            </th>
          </tr>
        </thead>
        <tbody>
          {[6, 7].map((period) => (
            <tr key={period}>
              <th>{period}</th>
              {fBlockGroups[period] &&
                Object.keys(fBlockGroups[period]).map((protons) => {
                  const element = fBlockGroups[period][protons];
                  if (!element) {
                    return <td key={protons}></td>;
                  }
                  return (
                    <td
                      key={protons}
                      onClick={() => onElementSelected(element)}
                      style={{
                        cursor: "pointer",
                        background: selectedZ === element.protons
                          ? "lightgrey"
                          : color[element.block],
                      }}
                    >
                      {element.symbol}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
