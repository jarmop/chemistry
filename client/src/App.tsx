import "./App.css";
import { Inspect } from "./Inspect.tsx";
import MoleculeComparison from "./MoleculeComparison.tsx";
import { MoleculeView } from "./MoleculeView.tsx";

function App() {
  return (
    <div>
      <MoleculeComparison />
      <MoleculeView />

      <div style={{ marginTop: "20px" }}>
        <Inspect />
      </div>
    </div>
  );
}

export default App;
