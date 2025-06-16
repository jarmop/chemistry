import "./App.css";
import { Inspect } from "./Inspect.tsx";
import { MoleculeBuilder } from "./MoleculeView.tsx";

function App() {
  return (
    <>
      <MoleculeBuilder />
      <Inspect />
    </>
  );
}

export default App;
