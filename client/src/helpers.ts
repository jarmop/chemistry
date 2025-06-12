/**
 * n = 1, l = 0
 * n = 2, l = 0,1
 * n = 3, l = 0,1
 *
 * after filling first subshell, fill second subshell of the previous shell
 *
 * two dimensional array, n x l
 * n + l
 *
 * 1+0,
 * 2+0,2+1
 * 3+0,3+1,3+2
 * 4+0,4+1,4+2,4+3
 *
 * 1
 * 2,3
 * 3,4,5
 * 4,5,6,7
 * 5,6,7,8,9
 *
 * Start filling two-dimensional array
 *
 * 19 Potassium
 * [2]
 * [2,6]
 * [2,6]
 * [1]
 *
 * 20 Calcium
 * [2]
 * [2,6]
 * [2,6]
 * [2]
 *
 * 21 Scandium
 * [2]
 * [2,6]
 * [2,6,1]
 * [2]
 */

export function getMaximumNumberOfElectronsPerShell(numberOfShells = 7) {
  const numberOfElectronsPerShell = [];
  for (let e = 0; e < numberOfShells; e++) {
    numberOfElectronsPerShell.push(2 * Math.pow(e + 1, 2));
  }

  return numberOfElectronsPerShell;
}

export function getElectronsPerShell(numberOfElectrons: number) {
  const electronsPerSubShell: Record<number, number[]> = [];
  // const electronsPerSubShell: number[][] = [[]];
  // console.log(electronsPerSubShell);

  let totalElectrons = 0;
  let E = 1;

  while (totalElectrons < numberOfElectrons && E < 10) {
    let n = Math.ceil((E + 1) / 2);
    let l = E - n;

    while (n + l === E) {
      const electronsOnSubShell = 2 * (2 * l + 1);
      if (!electronsPerSubShell[n]) {
        electronsPerSubShell[n] = [];
      }

      totalElectrons += electronsOnSubShell;
      if (totalElectrons >= numberOfElectrons) {
        const excess = totalElectrons - numberOfElectrons;
        electronsPerSubShell[n][l] = electronsOnSubShell - excess;
        break;
      }

      electronsPerSubShell[n][l] = electronsOnSubShell;

      if (l > 0) {
        n++;
        l--;
      } else {
        E++;
      }
    }
  }

  // const electronsPerShell = electronsPerSubShell.map((arr) =>
  //   arr.reduce((acc, curr) => acc + curr, 0)
  // );

  const electronsPerShell: Record<number, number> = {};
  for (const [key, arr] of Object.entries(electronsPerSubShell)) {
    electronsPerShell[parseInt(key)] = arr.reduce((acc, curr) => acc + curr, 0);
  }

  return electronsPerShell;
  // return electronsPerSubShell;
}
