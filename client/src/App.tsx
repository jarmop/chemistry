import "./App.css";
import { Inspect } from "./Inspect.tsx";
import { Materials } from "./Materials.tsx";
import { MatterComparison } from "./Matter.tsx";
import { MoleculeComparison } from "./MoleculeComparison.tsx";
import { MoleculeView } from "./MoleculeView.tsx";

function App() {
  return (
    <div>
      <MatterComparison />
      {/* <Materials /> */}
      <MoleculeComparison />
      {/* <MoleculeView /> */}
      <Inspect />
    </div>
  );
}

export default App;
