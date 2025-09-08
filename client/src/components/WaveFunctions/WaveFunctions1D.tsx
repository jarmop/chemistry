import { useState } from "react";
import { createWaveFunctions, WaveFuntionKey } from "./WaveFunctionHelpers.ts";
import Plot from "react-plotly.js";

// const coordMultiplier = 1e-3;
// const bohrMultiplier = 1e-3;

const coordMultiplier = 1;
const bohrMultiplier = 1 / 53;
const BOHR_RADIUS = 53 * bohrMultiplier; // pm

interface WaveFunctions2DProps {
  sampler: WaveFuntionKey;
}

const waveFunctions = createWaveFunctions(BOHR_RADIUS);

type PlotData = { name: string; x: number[]; y: number[] };

function getSize(sampler: WaveFuntionKey) {
  const size: Record<string, number> = {
    "1s": 10,
    "2s": 30,
    "2p_x": 30,
    "2p_y": 30,
    "2p_z": 30,
  };

  return size[sampler as string] || 60;
}

export function WaveFunctions1D({ sampler }: WaveFunctions2DProps) {
  function pushData(i: number, data: PlotData, v: number) {
    data.x.push(i);
    // data.y.push(v);
    data.y.push(Math.abs(v) > 1e-10 ? v : 0);
  }

  const func = (sampler: WaveFuntionKey, x: number, y: number, z: number) => {
    const r = Math.hypot(x, y, z);

    const v = waveFunctions[sampler](
      x,
      y,
      z,
    );

    return 4 * Math.PI * Math.pow(r, 2) * Math.pow(
      v,
      2,
    );
  };

  // console.log("func0", 4 * Math.PI * 0 * func(0, 0, 0));

  const size = 30;
  const step = size / 500;
  const start = 0, end = size;

  const averageSamplerMap: Record<string, WaveFuntionKey[]> = {
    "1s": ["1s"],
    "2s": ["2s"],
    "3s": ["3s"],
    "2p": ["2p_x", "2p_y", "2p_z"],
    "3p": ["3p_x", "3p_y", "3p_z"],
    "3d": ["3d_z2", "3d_x2-y2", "3d_xy", "3d_xz", "3d_yz"],
  };

  function foo(v: number) {
    // return Math.abs(v) > 1e-10 ? v : 0;
    return v;
  }

  const subShellData: PlotData[] = [];
  const dataByOrbital = Object.fromEntries(
    Object.keys(waveFunctions).map((orbital) => {
      return [orbital, { name: orbital, x: [], y: [] }] as [
        WaveFuntionKey,
        PlotData,
      ];
    }),
  );

  Object.entries(averageSamplerMap).forEach(([name, samplers]) => {
    const data: PlotData = { name, x: [], y: [] };

    for (let i = start; i <= end; i += step) {
      let v = 0;
      samplers.forEach((sampler) => {
        const vx = func(sampler, i, 0, 0);
        const vy = func(sampler, 0, i, 0);
        const vz = func(sampler, 0, 0, i);
        // v += (foo(vx) + foo(vy) + foo(vz)) / 3;
        const sample = (vx + vy + vz) / 3;
        dataByOrbital[sampler].x.push(i);
        dataByOrbital[sampler].y.push(sample);

        v += sample;
      });

      //   v = Math.abs(v) > 1e-10 ? v : 0;

      v = v / samplers.length;

      data.x.push(i);
      data.y.push(v);
      //   data.y.push(Math.abs(v) > 1e-10 ? v : 0);

      // pushData(i, dataX, func(i, 0, 0));
      // pushData(i, dataY, func(0, i, 0));
      // pushData(i, dataZ, func(0, 0, i));
    }
    subShellData.push(data);
  });

  //   (["1s", "2s", "3s", "2p_x"] as WaveFuntionKey[]).forEach((sampler) => {
  //     const data: PlotData = { name: sampler, x: [], y: [] };
  //     for (let i = start; i <= end; i += step) {
  //       pushData(i, data, func(sampler, i, 0, 0));
  //       // pushData(i, dataX, func(i, 0, 0));
  //       // pushData(i, dataY, func(0, i, 0));
  //       // pushData(i, dataZ, func(0, 0, i));
  //     }
  //     dataX.push(data);
  //   });

  //   console.log(dataX[0].y);

  const [selectedOrbitals, setSelectedOrbitals] = useState<WaveFuntionKey[]>(
    [],
  );

  const waveFunctionKeys = Object.keys(waveFunctions) as WaveFuntionKey[];

  //   console.log(selectedOrbitals);

  const orbitalData = selectedOrbitals.map((orbital) => dataByOrbital[orbital]);

  const finalData = orbitalData.length > 0 ? orbitalData : subShellData;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>
          Radial probability distributions 1D
        </h2>
        {waveFunctionKeys.map((orbital) => {
          const checked = selectedOrbitals.includes(orbital);
          return (
            <div
              key={orbital}
              style={{ display: "inline-block" }}
            >
              <label htmlFor={orbital}>{orbital}</label>
              <input
                id={orbital}
                type="checkbox"
                checked={checked}
                onChange={() => {
                  let newSelectedOrbitals = [];
                  if (!checked) {
                    newSelectedOrbitals = [...selectedOrbitals, orbital];
                  } else {
                    const i = selectedOrbitals.indexOf(orbital);
                    newSelectedOrbitals = [
                      ...selectedOrbitals.slice(0, i),
                      ...selectedOrbitals.slice(i + 1),
                    ];
                  }
                  setSelectedOrbitals(newSelectedOrbitals);
                }}
              />
            </div>
          );
        })}
        <PlotContainer margin={60}>
          <Plot
            data={finalData}
            layout={{
              // title: { text: "Adding Names to Line and Scatter Plot" },
              width: 1400,
              height: 700,
              border: 1,
            }}
          />
        </PlotContainer>
      </div>
    </>
  );
}

function PlotContainer(
  { children, margin }: { children: React.ReactElement; margin: number },
) {
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          margin: `-80px -${margin}px -${margin}px -${margin}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
