import "./App.css";
import { CrystalComparison } from "./components/Crystal.tsx";
import { Inspect } from "./components/Inspect.tsx";
import { Lattice } from "./components/Lattice/Lattice.tsx";
import { Materials } from "./components/Materials.tsx";
import { MatterComparison } from "./components/Matter.tsx";
import { MoleculeComparison } from "./components/MoleculeComparison.tsx";
import { MoleculeView } from "./components/MoleculeView.tsx";

function App() {
  return (
    <div>
      <Lattice />
      {/* <CrystalComparison /> */}
      {/* <hr /> */}
      {/* <MatterComparison /> */}
      {/* <hr /> */}
      {/* <Materials /> */}
      {/* <MoleculeComparison /> */}
      {/* <MoleculeView /> */}
      <Inspect />
    </div>
  );
}

export default App;
