import "./App.css";
import { CrystalComparison } from "./components/Crystal.tsx";
import { Inspect } from "./components/Inspect.tsx";
import { Materials } from "./components/Materials.tsx";
import { MatterComparison } from "./components/Matter.tsx";
import { MoleculeComparison } from "./components/MoleculeComparison.tsx";
import { Structures3D } from "./components/Structures3D.tsx";
import { MoleculeView } from "./components/MoleculeView.tsx";

function App() {
  return (
    <div>
      <Structures3D />
      {/* <CrystalComparison /> */}
      {/* <hr /> */}
      {/* <MatterComparison /> */}
      <hr />
      {/* <Materials /> */}
      {/* <MoleculeComparison /> */}
      {/* <MoleculeView /> */}
      <Inspect />
    </div>
  );
}

export default App;
