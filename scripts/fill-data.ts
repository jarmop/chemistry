import oldElements from "../client/src/data/elements.json" with {
  type: "json",
};

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
const dataJSON = await Deno.readTextFile(
  "./data/human_body_element_abundance.json",
);
const data = JSON.parse(dataJSON) as Data[];
const dataBySymbol = Object.fromEntries(data.map((el) => [el.symbol, el]));

type Data2 = {
  atomic_number: number;
  element: string;
  mass_fraction_ppm: number;
  percentage: number;
};
const data2JSON = await Deno.readTextFile(
  "./data/milky_way_top10_elements.json",
);
const data2 = JSON.parse(data2JSON) as Data2[];
const data2ByName = Object.fromEntries(data2.map((el) => [el.element, el]));

const newElements = oldElements.map((oldElement) => {
  return {
    ...oldElement,
    massInHumanBody: dataBySymbol[oldElement.symbol]?.percent_mass ?? 0,
    atomsInHumanBody: dataBySymbol[oldElement.symbol]?.atomic_percent ?? 0,
    abundanceInMilkyWay: data2ByName[oldElement.name]?.percentage ?? 0,
  };
});

const elementsJson = JSON.stringify(newElements);

await Deno.writeTextFile("../client/src/data/elements.json", elementsJson);
