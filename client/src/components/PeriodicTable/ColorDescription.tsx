import { ColorMode, colorsByMode } from "./getCellColor.ts";

interface ColorDescriptionProps {
  colorMode: ColorMode;
  onSelectValue: (value: string | undefined) => void;
}

export function ColorDescription(
  { colorMode, onSelectValue }: ColorDescriptionProps,
) {
  const colors = colorsByMode[colorMode];
  if (!colors) return;

  return (
    <div
      style={{ marginTop: "20px", maxWidth: "550px" }}
      onMouseLeave={() => onSelectValue(undefined)}
    >
      {Object.entries(colors).map(([key, color]) => (
        <div
          style={{
            display: "inline-block",
            padding: "5px",
            marginRight: "10px",
            marginBottom: "10px",
            background: color,
            border: "1px solid #aaa",
            cursor: "pointer",
          }}
          key={key}
          onMouseOver={() => onSelectValue(key)}
        >
          {key}
        </div>
      ))}
    </div>
  );
}
