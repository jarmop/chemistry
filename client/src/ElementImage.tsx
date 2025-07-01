import { Element as ElementType } from "./library/types.ts";

interface ElementImageProps {
  element: ElementType;
  isSelected: boolean;
  onElementSelected: (element: ElementType) => void;
}

export function ElementImage({
  element,
  isSelected,
  onElementSelected,
}: ElementImageProps) {
  const imgUrl = element.thumbnail && element.thumbnail.length > 0
    ? element.thumbnail
    : undefined;
  return (
    <td
      onClick={() => onElementSelected(element)}
      style={{
        cursor: "pointer",
        position: "relative",
        textAlign: "center",
        padding: "2px",
        width: "80px",
        height: "80px",
        border: "1px solid #ccc",
        verticalAlign: "top",
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
      {imgUrl
        ? (
          <img
            src={imgUrl}
            alt={element.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        )
        : (
          <div style={{ fontSize: "10px", color: "#888", marginTop: "20px" }}>
            No image
          </div>
        )}
    </td>
  );
}
