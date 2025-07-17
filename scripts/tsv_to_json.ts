const filename = Deno.args[0] || "./data/chemical-elements.tsv";

const text = await Deno.readTextFile(filename);

const rows = text.split("\n").map((row) => row.split("\t"));

const keys: string[] = [];
const colspans: Record<string, number> = {};
rows[0].forEach((key) => {
  if (key !== "") {
    keys.push(key.replaceAll(" ", "_"));
    colspans[key] = 1;
  } else {
    const lastKey = keys[keys.length - 1];
    colspans[lastKey]++;
  }
});
const valueRows = rows.slice(1);

function fixValueType(value: string) {
  if (isNaN(Number(value))) {
    return value;
  } else if (Number.isInteger(value)) {
    return parseInt(value);
  }
  return parseFloat(value);
}

const data = valueRows.map((values) => {
  const obj: Record<string, unknown> = {};
  let valueIndex = 0;
  keys.forEach((key) => {
    const colspan = colspans[key];
    if (colspan > 1) {
      obj[key] = values.slice(valueIndex, valueIndex + colspan).filter(
        (value) => value !== "",
      ).map(fixValueType);
      valueIndex += colspan;
    } else {
      obj[key] = fixValueType(values[valueIndex]);
      valueIndex++;
    }
  });

  return obj;
});

// console.log(data[0]);

const dataFileName = filename.replace(".tsv", ".json");

await Deno.writeTextFile(dataFileName, JSON.stringify(data));

console.info(`Wrote ${data.length} objects into "${dataFileName}"`);
