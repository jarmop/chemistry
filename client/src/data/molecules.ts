// order of elements: C, H, the rest in alphabetical order
export const inorganicMolecules = [{
  name: "Water",
  formula: "H2O",
  molarMass: 18.02,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/H2O_2D_labelled.svg/250px-H2O_2D_labelled.svg.png",
}, {
  name: "Nitrogen",
  formula: "N2",
  molarMass: 28.01,
}, {
  name: "Carbon Dioxide",
  formula: "CO2",
  molarMass: 44.01,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Carbon-dioxide-2D-dimensions.svg/250px-Carbon-dioxide-2D-dimensions.svg.png",
}, {
  name: "Carbon Monoxide",
  formula: "CO",
  molarMass: 28.01,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Carbon_monoxide_2D.svg/250px-Carbon_monoxide_2D.svg.png",
}, {
  name: "Ammonia",
  formula: "NH3",
  molarMass: 17.03,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ammonia-2D.svg/250px-Ammonia-2D.svg.png",
}, {
  name: "Sodium Chloride",
  formula: "NaCl",
  molarMass: 58.44,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NaCl_bonds.svg/250px-NaCl_bonds.svg.png",
}, {
  name: "Sulfuric Acid",
  formula: "H2SO4",
  molarMass: 98.08,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sulfuric_acid.svg/250px-Sulfuric_acid.svg.png",
}, {
  name: "Hydrochlorid Acid",
  formula: "HCl",
  molarMass: 36.46,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hydrochloric_acid_dissociated.svg/250px-Hydrochloric_acid_dissociated.svg.png",
}, {
  name: "Calcium Carbonate",
  formula: "CaCO3",
  molarMass: 100.09,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Calcium_carbonate.png/250px-Calcium_carbonate.png",
}, {
  name: "Sodium Hydroxide",
  formula: "NaOH",
  molarMass: 40.00,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Sodium-hydroxide-crystal-3D-vdW.png/250px-Sodium-hydroxide-crystal-3D-vdW.png",
}, {
  name: "Magnesium Oxide",
  formula: "MgO",
  molarMass: 40.30,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Magnesium-oxide-3D-vdW.png/250px-Magnesium-oxide-3D-vdW.png",
}, {
  name: "Calcium Sulfate",
  formula: "CaSO4",
  molarMass: 136.14,
  uses: ["cement", "gypsum"],
  compositions: ["calcium", "sulfur", "oxygen"],
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/CaSO4simple.svg/220px-CaSO4simple.svg.png",
}, {
  name: "Silicon dioxide",
  formula: "SiO2",
  molarMass: 60.08,
  uses: ["glass", "ceramics", "silicon"],
  compositions: ["quartz"],
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/SiO2repeat.png/250px-SiO2repeat.png",
}];

const monosaccharides = [
  {
    name: "Glucose",
    formula: "C6H12O6",
    molarMass: 180.16,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Alpha-D-Glucopyranose.svg/120px-Alpha-D-Glucopyranose.svg.png",
  },
  {
    name: "Fructose",
    formula: "",
    molarMass: 180.16,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Alpha-D-Glucopyranose.svg/120px-Alpha-D-Glucopyranose.svg.png",
  },
];

const disaccharides = [
  {
    name: "Sucrose",
    formula: "C12H22O11",
    molarMass: 342.30,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Alpha-D-Glucopyranose.svg/120px-Alpha-D-Glucopyranose.svg.png",
  },
  {
    name: "Maltose",
    formula: "C12H22O11",
    molarMass: 342.30,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Alpha-D-Glucopyranose.svg/120px-Alpha-D-Glucopyranose.svg.png",
  },
  {
    name: "Lactose",
    formula: "C12H22O11",
    molarMass: 342.30,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Alpha-D-Glucopyranose.svg/120px-Alpha-D-Glucopyranose.svg.png",
  },
];

const sugars = [
  ...monosaccharides,
  ...disaccharides,
];

const alcohols = [
  {
    name: "Ethanol",
    formula: "C2H5OH",
    molarMass: 46.07,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ethanol-2D-flat.svg/120px-Ethanol-2D-flat.svg.png",
  },
  {
    name: "Methanol",
    formula: "CH3OH",
    molarMass: 32.04,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ethanol-2D-flat.svg/120px-Ethanol-2D-flat.svg.png",
  },
  {
    name: "Propanol",
    formula: "C3H7OH",
    molarMass: 60.10,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ethanol-2D-flat.svg/120px-Ethanol-2D-flat.svg.png",
  },
  {
    name: "Butanol",
    formula: "C4H9OH",
    molarMass: 74.12,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ethanol-2D-flat.svg/120px-Ethanol-2D-flat.svg.png",
  },
];

const acids = [
  {
    name: "Acetic Acid",
    formula: "CH3COOH",
    molarMass: 60.05,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Essigs%C3%A4ure_-_Acetic_acid.svg/120px-Essigs%C3%A4ure_-_Acetic_acid.svg.png",
  },
];

export const organicMolecules = [
  ...sugars,
  ...alcohols,
  ...acids,
  {
    name: "Methane",
    formula: "CH4",
    molarMass: 16.04,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Methane-2D-dimensions.svg/250px-Methane-2D-dimensions.svg.png",
  },
  {
    name: "Acetone",
    formula: "C3H6O",
    molarMass: 58.08,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Acetone-CRC-MW-ED-dimensions-2D-Vector.svg/250px-Acetone-CRC-MW-ED-dimensions-2D-Vector.svg.png",
  },
  {
    name: "PG5",
    formula: "",
    molarMass: 200000000,
    type: "dendrimer",
    diameter: 10e-9,
    length: 5e-9,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/PG5_structure.png/1280px-PG5_structure.png",
  },
  {
    name: "DNA",
    formula: "",
    molarMass: 200000000,
    type: "nucleic acid",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Double_helix_of_DNA.svg/1280px-Double_helix_of_DNA.svg.png",
  },
  
];
