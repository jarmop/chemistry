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
  for (let i = 0; i < numberOfShells; i++) {
    numberOfElectronsPerShell.push(2 * Math.pow(i + 1, 2));
  }

  return numberOfElectronsPerShell;
}

export function getMaximumNumberOfElectronsPerSubShell(numberOfSubShells = 7) {
  const numberOfElectronsPerSubShell = [];
  for (let i = 0; i < numberOfSubShells; i++) {
    numberOfElectronsPerSubShell.push(2 * (2 * i + 1));
  }

  return numberOfElectronsPerSubShell;
}

export function getElectronsPerSubShell(numberOfElectrons: number) {
  const electronsPerSubShell: Record<number, number[]> = {};

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

  return electronsPerSubShell;
}

export function getElectronsPerShell(numberOfElectrons: number) {
  const electronsPerSubShell = getElectronsPerSubShell(numberOfElectrons);

  const electronsPerShell: Record<number, number> = {};
  for (const [key, arr] of Object.entries(electronsPerSubShell)) {
    electronsPerShell[parseInt(key)] = arr.reduce((acc, curr) => acc + curr, 0);
  }

  return electronsPerShell;
}
