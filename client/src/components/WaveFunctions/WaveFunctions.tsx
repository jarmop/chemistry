import { WaveFunctions2D } from "./WaveFunctions2D.tsx";
import { WaveFunctions3D } from "./WaveFunctions3d.tsx";

export function WaveFunctions() {
  return (
    <>
      <h1>Bonding</h1>
      <WaveFunctions3D />
      <WaveFunctions2D />
    </>
  );
}
