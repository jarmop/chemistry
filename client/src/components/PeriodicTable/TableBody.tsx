import { useEffect } from "react";
import { Element as ElementType } from "../../library/types.ts";
import allElements from "../../data/elements.ts";

function getElementPosition(
  elements: ElementType[][],
  selectedZ: number | undefined,
) {
  if (!selectedZ) return [-1, -1];

  return elements.reduce((acc, row, r) => {
    const c = row.findIndex((el) => el?.protons === selectedZ);
    if (c !== -1) {
      return [r, c];
    }
    return acc;
  }, [-1, -1]);
}

const specialZs = {
  "ArrowRight": [56, 70, 88, 102],
  "ArrowLeft": [57, 71, 89, 103],
};

export function TableBody(
  { elements, rowTitles, selectedZ, onElementSelected, renderElementCell }: {
    elements: ElementType[][];
    rowTitles: number[];
    selectedZ: number | undefined;
    onElementSelected: (element: ElementType) => void;
    renderElementCell: (
      element: ElementType,
      key: string | number,
    ) => React.ReactNode;
  },
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const [row, col] = getElementPosition(elements, selectedZ);

        if (!selectedZ || row === -1 || col === -1) {
          return;
        }

        e.preventDefault();

        let nextElement: ElementType | undefined;
        if (e.key === "ArrowRight") {
          if (specialZs[e.key].includes(selectedZ)) {
            nextElement = allElements.find((el) =>
              el.protons === selectedZ + 1
            );
          } else {
            nextElement = elements[row].find((el, i) => i > col && el) ||
              elements[row][0];
          }
        } else if (e.key === "ArrowLeft") {
          if (specialZs[e.key].includes(selectedZ)) {
            nextElement = allElements.find((el) =>
              el.protons === selectedZ - 1
            );
          } else {
            nextElement = elements[row].findLast((el, i) => i < col && el) ||
              elements[row][elements[row].length - 1];
          }
        } else if (e.key === "ArrowUp") {
          nextElement = elements[row - 1]?.find((el, i) => i === col && el) ||
            elements[elements.length - 1][col];
        } else if (e.key === "ArrowDown") {
          nextElement = elements[row + 1]?.find((el, i) => i === col && el) ||
            elements.find((row) => row[col])?.[col];
        }

        if (nextElement) onElementSelected(nextElement);
      }
    }
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [selectedZ, onElementSelected, elements]);

  return (
    <tbody>
      {elements.map((row, i) => (
        <tr key={i}>
          <th>{rowTitles[i]}</th>
          {row.map((element, j) => {
            if (!element) {
              return <td key={j}></td>;
            }
            return renderElementCell(element, j);
          })}
        </tr>
      ))}
    </tbody>
  );
}
