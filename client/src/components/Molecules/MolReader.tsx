import { useEffect, useState } from "react";
import { parse } from "./molParser.ts";

const defaultInput = `
Ammonia
  OpenAI  3D

  4  3  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    0.9377    0.0000   -0.3816 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.4689    0.8127   -0.3816 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.4689   -0.8127   -0.3816 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0
  1  3  1  0
  1  4  1  0
M  END
`;

export function MolReader() {
  const [input, setInput] = useState(defaultInput.trim());
  const [output, setOutput] = useState(input);

  useEffect(() => {
    setOutput(JSON.stringify(parse(input)));
  }, [input]);

  return (
    <div style={{ marginTop: "20px" }}>
      <textarea
        id="input"
        name="input"
        style={{ height: 300, width: "1000px" }}
        value={input}
        onChange={(e) => {
          const value = e.target.value;

          console.log(value);

          setInput(value);
        }}
      >
      </textarea>
      <div>{output}</div>
    </div>
  );
}

// function rowToArray(row: string) {
//   return row.trim().split(/\s+/);
// }

// function getAtomsAndBonds(row: string) {
//   return rowToArray(row).slice(0, 2).map(parseInt);
// }

// function getAtom(row: string) {
//   const rowArray = rowToArray(row);
//   const xyz = rowArray.slice(0, 3).map(parseFloat);
//   const atom = rowArray[3];

//   return [xyz, atom];
// }

// function parse(input: string) {
//   let output = "";

//   const rows = input.trim().split("\n");

//   // console.log(rows[3].trim().split("  ").slice(0, 2));
//   const [atomsCount, bondsCount] = getAtomsAndBonds(rows[3]);

//   // console.log(atomsCount, bondsCount);

//   const molecule = {
//     atoms: [],
//     bonds: [],
//   };

//   const atomsStartI = 4;
//   for (let i = atomsStartI; i < atomsStartI + atomsCount; i++) {
//     console.log(getAtom(rows[i]));
//   }

//   // console.log(rows);

//   return output;
// }
