import { Element as ElementType } from "../../library/types.ts";

interface ElementProps {
  element: ElementType;
  isSelected: boolean;
  color: string | undefined;
  onElementSelected: (
    element: ElementType | undefined,
    click?: boolean,
  ) => void;
}

export function Element({
  element,
  isSelected,
  color,
  onElementSelected,
}: ElementProps) {
  return (
    <td
      onClick={() => onElementSelected(element, true)}
      onMouseOver={() => onElementSelected(element)}
      onMouseLeave={() => onElementSelected(undefined)}
      style={{
        cursor: "pointer",
        background: color,
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
