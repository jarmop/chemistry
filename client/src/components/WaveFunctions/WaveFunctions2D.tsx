import { createWaveFunctions } from "./WaveFunctionHelpers.ts";

// const BOHR_RADIUS = 5.29177210903e-11; // meters
const BOHR_RADIUS = 53; // pm

export function WaveFunctions2D() {
  const waveFunctions = createWaveFunctions(BOHR_RADIUS);

  const vs: string[] = [];
  for (let i = -20; i <= 2; i++) {
    const v = waveFunctions["1s"](i, 0, 0);
    vs.push(`i --> ${v}`);
  }

  return <div>{vs.map((v) => <div key={v}>{v}</div>)}</div>;
}
