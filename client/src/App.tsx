import "./App.css";
import { CrystalComparison } from "./components/Crystal.tsx";
import { Inspect } from "./components/Inspect.tsx";
import { Materials } from "./components/Materials.tsx";
import { MatterComparison } from "./components/Matter.tsx";
import { MoleculeComparison } from "./components/MoleculeComparison.tsx";
import { Structures3D } from "./components/Structures3D.tsx";
import { MoleculeView } from "./components/MoleculeView.tsx";
import { Bonding } from "./components/Bonding/Bonding.tsx";
import { ElectronProbabilityDensity } from "./ElectronProbabilityExample/ElectronProbabilityExample.tsx";
import { WaveFunctions } from "./components/WaveFunctions/WaveFunctions.tsx";
import { MarchingCubesView } from "./components/Experiments/MarchingCubesView.tsx";

function App() {
  return (
    <div>
      {/* <MarchingCubesView /> */}
      <ElectronProbabilityDensity />
      {/* <Structures3D /> */}
      {/* <WaveFunctions /> */}
      {/* <Bonding /> */}
      {/* <CrystalComparison /> */}
      {/* <hr /> */}
      {/* <MatterComparison /> */}
      <hr />
      {/* <Materials /> */}
      {/* <MoleculeComparison /> */}
      {/* <MoleculeView /> */}
      {/* <Inspect /> */}
    </div>
  );
}

export default App;
