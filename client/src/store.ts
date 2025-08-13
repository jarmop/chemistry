import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Structure } from "./components/Lattice/structures.ts";

type Molecules3DStore = {
  selectedMolecule3Ds: Structure[];
  toggleMolecule3D: (selectedMolecule3D: Structure) => void;
};

type Store = Molecules3DStore;

type StateSliceCreator<StateSlice> = StateCreator<
  StateSlice,
  [],
  [],
  StateSlice
>;

const getMolecules3dStore: StateSliceCreator<Molecules3DStore> = (set, get) => {
  return {
    selectedMolecule3Ds: ["HCP", "Zinc"],
    toggleMolecule3D: (molecule3D: Structure) => {
      const selectedMolecule3Ds = get().selectedMolecule3Ds;
      const newSelectedMolecule3Ds = selectedMolecule3Ds.includes(molecule3D)
        ? [...selectedMolecule3Ds.filter((m) => m !== molecule3D)]
        : [...selectedMolecule3Ds, molecule3D];

      set({
        selectedMolecule3Ds: newSelectedMolecule3Ds,
      });
    },
  };
};

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...getMolecules3dStore(...a),
    }),
    {
      name: "chemistry",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
