import { ColorMode, colorsByMode } from "./getCellColor.ts";

interface ColorDescriptionProps {
  colorMode: ColorMode;
}

export function ColorDescription(
  { colorMode }: ColorDescriptionProps,
) {
  const colors = colorsByMode[colorMode];
  if (!colors) return;

  return (
    <div style={{ marginTop: "20px" }}>
      {Object.entries(colors).map(([key, color]) => (
        <div
          style={{
            display: "inline-block",
            padding: "5px",
            marginRight: "10px",
            background: color,
            border: "1px solid #aaa",
          }}
          key={key}
        >
          {key}
        </div>
      ))}
    </div>
  );
}
