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
// .then((data) => {
//   return data.filter((d) => {
//     const el = oldElements.find((el) => el.symbol === d.symbol);
//     return el?.phase === "solid";
//   });
// });
const data3BySymbol = getDataMap(data3, "symbol");

// type Data4 = {
//   no: number;
//   element: string;
//   allotrop: string;
//   measuring_temperature: string;
//   lattice: string;
//   parameters: string[];
//   crystal_class: string;
//   Schönflies: string;
//   "Hermann-Mauguin": string;
//   orbifold: string;
//   space_group: string;
//   density: number;
//   note: string;
//   reference: string;
// };
// const data4 = await getData("./data/crystal_structures.json") as Data4[];
// const data4ByElement = getDataMap(data3, "symbol");

const newElements = oldElements.map((oldElement) => {
  return {
    ...oldElement,
    massInHumanBody: dataBySymbol[oldElement.symbol]?.percent_mass ?? 0,
    atomsInHumanBody: dataBySymbol[oldElement.symbol]?.atomic_percent ?? 0,
    abundanceInMilkyWay: data2ByName[oldElement.name]?.percentage ?? 0,
    structure: data3BySymbol[oldElement.symbol]?.structure ?? "unknown",
    structureNotes: data3BySymbol[oldElement.symbol]?.notes ?? undefined,
  };
});

const elementsJson = JSON.stringify(newElements);

await Deno.writeTextFile("../client/src/data/elements.json", elementsJson);
