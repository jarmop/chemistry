import { useState } from "react";
import { WaveFunctions3D } from "./WaveFunctions3d.tsx";
import { WaveFunctions2D } from "./WaveFunctions2D.tsx";
import { WaveFunctions1D } from "./WaveFunctions1D.tsx";
import {
  createWaveFunctions,
  WaveFuntionKey,
  // psi_1s,
  // psi_2p_z,
  // psi_2s,
} from "./WaveFunctionHelpers.ts";

const defaultSampler = "1s";

const samplers = createWaveFunctions();
const waveFunctionKeys = Object.keys(samplers) as WaveFuntionKey[];

export function WaveFunctions() {
  const [sampler, setSampler] = useState<WaveFuntionKey>(defaultSampler);

  return (
    <>
      <h1>Bonding</h1>
      <select
        onChange={(e) => setSampler(e.target.value as WaveFuntionKey)}
        value={sampler}
      >
        {waveFunctionKeys.map((samplerOption) => (
          <option
            key={samplerOption}
            value={samplerOption}
          >
            {samplerOption}
          </option>
        ))}
      </select>
      <br />
      <br />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <WaveFunctions3D sampler={sampler} />
        <WaveFunctions2D sampler={sampler} />
      </div>
      <WaveFunctions1D sampler={sampler} />
    </>
  );
}
