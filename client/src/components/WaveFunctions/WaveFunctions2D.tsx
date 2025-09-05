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

export function WaveFunctions2D({ sampler }: WaveFunctions2DProps) {
  const func = (x: number, y: number, z: number) => {
    const r = Math.hypot(x, y, z);

    // return 4 * Math.PI * r * s1(
    //   x * coordMultiplier,
    //   y * coordMultiplier,
    //   z * coordMultiplier,
    // );

    const v = waveFunctions[sampler](
      x * coordMultiplier,
      y * coordMultiplier,
      z * coordMultiplier,
    );

    return 4 * Math.PI * Math.pow(r, 2) * Math.pow(
      v,
      2,
    );
  };

  // console.log("func0", 4 * Math.PI * 0 * func(0, 0, 0));

  const size = getSize(sampler);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>
          Radial probability distributions
        </h2>
        <ContourPlot func={func} size={size} />
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>
          Radial probability distributions
        </h2>
        <LinePlot func={func} />
      </div>
    </>
  );
}

function LinePlot(
  { func }: {
    func: (x: number, y: number, z: number) => number;
  },
) {
  const dataX: PlotData = { name: "x", x: [], y: [] };
  const dataY: PlotData = { name: "y", x: [], y: [] };
  const dataZ: PlotData = { name: "z", x: [], y: [] };

  function pushData(i: number, data: PlotData, v: number) {
    data.x.push(i);
    // data.y.push(v);
    data.y.push(Math.abs(v) > 1e-10 ? v : 0);
  }

  const size = 30;
  const step = size / 300;
  const start = 0, end = size;

  for (let i = start; i <= end; i += step) {
    const i2 = i * coordMultiplier;
    pushData(i2, dataX, func(i, 0, 0));
    pushData(i2, dataY, func(0, i, 0));
    pushData(i2, dataZ, func(0, 0, i));
  }
  return (
    <PlotContainer margin={60}>
      <Plot
        data={[dataX, dataY, dataZ]}
        layout={{
          // title: { text: "Adding Names to Line and Scatter Plot" },
          width: 700,
          height: 350,
          border: 1,
        }}
      />
    </PlotContainer>
  );
}

function ContourPlot(
  { func, size }: {
    func: (x: number, y: number, z: number) => number;
    size: number;
  },
) {
  const step = size / 100;
  const start = -size / 2, end = size / 2;

  const xs: number[] = [];
  const ys: number[] = [];
  const z: number[][] = [];
  for (let y = start; y <= end; y += step) {
    const row = [];
    xs.push(y * coordMultiplier);
    ys.push(y * coordMultiplier);
    for (let x = start; x <= end; x += step) {
      const v = func(x, y, 0);
      row.push(v < 1e-3 ? 0 : v);
    }
    z.push(row);
  }

  const contourData = [{
    x: xs,
    y: ys,
    z,
    type: "contour",
  }];

  return (
    <PlotContainer margin={0}>
      <Plot
        data={contourData}
        layout={{
          width: 700,
          height: 700,
          xaxis: {
            title: { text: "x" },
          },
          yaxis: {
            title: { text: "y" },
          },
        }}
      />
    </PlotContainer>
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
