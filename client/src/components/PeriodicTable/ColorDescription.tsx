import { ColorMode, colorsByMode } from "./getCellColor.ts";

interface ColorDescriptionProps {
  colorMode: ColorMode;
  selectedValues: string[];
  onClick: (value?: string | string[]) => void;
}

export function ColorDescription(
  {
    colorMode,
    selectedValues,
    onClick,
  }: ColorDescriptionProps,
) {
  const colors = colorsByMode[colorMode];
  if (!colors) return;

  return (
    <div
      style={{ marginTop: "20px", maxWidth: "550px" }}
    >
      {Object.entries(colors).map(([key, color]) => (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            padding: "5px",
            marginRight: "10px",
            marginBottom: "10px",
            background: color,
            border: "1px solid #aaa",
            cursor: "pointer",
          }}
          key={key}
          onClick={() => onClick(key)}
        >
          {key}
          {selectedValues.includes(key) && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                border: "3px solid black",
                boxSizing: "border-box",
              }}
            >
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onClick(Object.keys(colors))}>
        Select all
      </button>
      &nbsp;&nbsp;
      {selectedValues.length > 0 && (
        <button
          type="button"
          onClick={() => onClick()}
        >
          Remove selections
        </button>
      )}
    </div>
  );
}
