import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { StructureMapKey } from "./components/Lattice/structures.ts";

type Structures3DStore = {
  selectedStructureMapKeys: StructureMapKey[];
  toggleStructureMapKey: (structureMapKey: StructureMapKey) => void;
};

type Store = Structures3DStore;

type StateSliceCreator<StateSlice> = StateCreator<
  StateSlice,
  [],
  [],
  StateSlice
>;

const getStructures3DStore: StateSliceCreator<Structures3DStore> = (
  set,
  get,
) => {
  return {
    selectedStructureMapKeys: ["HCP", "Zinc"],
    toggleStructureMapKey: (structureMapKey: StructureMapKey) => {
      const selectedStructureMapKeys = get().selectedStructureMapKeys;
      const newSelectedStructureMapKeys =
        selectedStructureMapKeys.includes(structureMapKey)
          ? [...selectedStructureMapKeys.filter((m) => m !== structureMapKey)]
          : [...selectedStructureMapKeys, structureMapKey];

      set({
        selectedStructureMapKeys: newSelectedStructureMapKeys,
      });
    },
  };
};

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...getStructures3DStore(...a),
    }),
    {
      name: "chemistry",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
