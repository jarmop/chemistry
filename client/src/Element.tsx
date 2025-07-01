import { Element as ElementType } from "./library/types.ts";

interface ElementProps {
  element: ElementType;
  isSelected: boolean;
  getCellColor: (element: ElementType) => string;
  onElementSelected: (element: ElementType) => void;
}

export function Element({
  element,
  isSelected,
  getCellColor,
  onElementSelected,
}: ElementProps) {
  return (
    <td
      onClick={() => onElementSelected(element)}
      style={{
        cursor: "pointer",
        background: getCellColor(element),
        position: "relative",
        textAlign: "center",
        padding: "4px 0",
        width: "27px",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
      {element.symbol}
    </td>
  );
}
