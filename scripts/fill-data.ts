import oldElements from "../client/src/data/elements.json" with {
  type: "json",
};

function getData<Data>(filename: string): Promise<Data[]> {
  return Deno.readTextFile(filename).then((data) => JSON.parse(data));
}

function getDataMap<
  Data extends Record<string, string | number | (string | number)[]>,
>(
  data: Data[],
  key: string | number,
) {
  const dataBySymbol = Object.fromEntries(
    data.map((el) => [el[key], el]),
  ) as Record<typeof key, Data>;

  return dataBySymbol;
}

type Data = {
  atomic_number: number;
  element: string;
  symbol: string;
  percent_mass: number;
  mass_kg: number;
  atomic_percent: number;
  essential_in_humans: string;
  negative_effects_of_excess: string;
  group: string;
};
const data = await getData<Data>(
  "./data/human_body_element_abundance.json",
);
const dataBySymbol = getDataMap(data, "symbol");

type Data2 = {
  atomic_number: number;
  element: string;
  mass_fraction_ppm: number;
  percentage: number;
};
const data2 = await getData<Data2>("./data/milky_way_top10_elements.json");
const data2ByName = getDataMap(data2, "element");

type Data3 = {
  symbol: string;
  name: string;
  structure: string;
  notes: string;
};
const data3 = await getData<Data3>(
  "./data/element_crystal_structures.json",
);
const data3BySymbol = getDataMap(data3, "symbol");

type Data4 = {
  Material: string;
  "Resistivity, ρ,  at 20 °C (Ω·m)": string | number;
  "Conductivity, σ,  at 20 °C (S/m)": string | number;
  "Temperature  coefficient (K−1)": string;
};
const data4 = await getData<Data4>(
  "./data/conductivity.json",
);
const data4ByName = getDataMap(data4, "Material");

function formatConductivityAndResistivity(rawCond: string | number) {
  const conductivity = typeof rawCond === "string"
    ? parseFloat(rawCond.replace("×10", "e"))
    : rawCond ?? 0;

  return conductivity;
}

const newElements = oldElements.map((oldElement) => {
  return {
    ...oldElement,
    massInHumanBody: dataBySymbol[oldElement.symbol]?.percent_mass ?? 0,
    atomsInHumanBody: dataBySymbol[oldElement.symbol]?.atomic_percent ?? 0,
    abundanceInMilkyWay: data2ByName[oldElement.name]?.percentage ?? 0,
    structure: data3BySymbol[oldElement.symbol]?.structure ?? "unknown",
    structureNotes: data3BySymbol[oldElement.symbol]?.notes ?? undefined,
    conductivity: formatConductivityAndResistivity(
      data4ByName[oldElement.name]?.["Conductivity, σ,  at 20 °C (S/m)"],
    ),
    resistivity: formatConductivityAndResistivity(
      data4ByName[oldElement.name]?.["Resistivity, ρ,  at 20 °C (Ω·m)"],
    ),
  };
});

const elementsJson = JSON.stringify(newElements);

await Deno.writeTextFile("../client/src/data/elements.json", elementsJson);
