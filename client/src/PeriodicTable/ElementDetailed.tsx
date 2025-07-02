import { Element as ElementType } from "../library/types.ts";

interface ElementDetailedProps {
  element: ElementType;
  isSelected: boolean;
  color: string;
  onElementSelected: (element: ElementType) => void;
}

export function ElementDetailed({
  element,
  isSelected,
  color,
  onElementSelected,
}: ElementDetailedProps) {
  return (
    <td
      onClick={() => onElementSelected(element)}
      style={{
        cursor: "pointer",
        background: color,
        position: "relative",
        textAlign: "center",
        padding: "2px",
        width: "80px",
        height: "80px",
        // fontSize: "10px",
        border: "1px solid rgb(160 160 160)",
        verticalAlign: "top",
        // fontFamily: "",
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

      {/* Atomic number */}
      <div
        style={{
          fontSize: "14px",
          textAlign: "left",
          marginBottom: "2px",
          fontWeight: "bold",
        }}
      >
        {element.protons}
      </div>

      {/* Element symbol */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "2px",
        }}
      >
        {element.symbol}
      </div>

      {/* Element name */}
      <div
        style={{
          fontSize: "12px",
          lineHeight: "1.1",
          marginBottom: "2px",
        }}
      >
        {element.name}
      </div>

      {/* Atomic weight */}
      <div
        style={{
          fontSize: "12px",
          color: "#666",
        }}
      >
        {element.atomicWeight.toFixed(2)}
      </div>
    </td>
  );
}
