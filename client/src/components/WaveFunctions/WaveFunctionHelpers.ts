// --- Orbitals (unnormalized, atomic units a0=1, Z=1) ---
const len = (x: number, y: number, z: number) => Math.hypot(x, y, z);

export function psi_1s(x: number, y: number, z: number) {
  const r = len(x, y, z);
  return Math.exp(-r);
}

export function psi_2s(x: number, y: number, z: number) {
  const r = len(x, y, z);
  return (2 - r) * Math.exp(-r / 2);
}

export function psi_2p_z(x: number, y: number, z: number) {
  const r = len(x, y, z);
  const theta = Math.acos(r === 0 ? 1 : z / r);
  // return r * Math.exp(-r / 2) * Math.cos(theta);
  const radial = r * Math.exp(-r / 2);
  const angular = Math.cos(theta); // ∝ Y_10
  return radial * angular; // signed
}

export function psi_3d_z2(x: number, y: number, z: number) {
  const r = len(x, y, z);
  const theta = Math.acos(r === 0 ? 1 : z / r);
  return (r * r) * Math.exp(-r / 3) *
    (3 * Math.cos(theta) * Math.cos(theta) - 1);
}

function getTheta(r: number, z: number) {
  return Math.acos(r === 0 ? 1 : z / r);
}

export function createWaveFunctionGetter(n: 1 | 2 = 2, a0 = 1, Z = 1) {
  function getSigma(r: number) {
    return 2 * Z * r / n * a0;
  }

  const angulars = {
    s: Math.sqrt(1 / 4 * Math.PI),
    p_z: (theta: number) => Math.sqrt(3 / 4 * Math.PI) * Math.cos(theta),
  };

  function getCommonRadial(sigma: number) {
    return Math.pow(Math.sqrt(Z / a0), 3) * Math.exp(-sigma / 2);
  }

  const radials = {
    "1s": (r: number) => {
      return 2 * getCommonRadial(getSigma(r));
    },
    "2p": (r: number) => {
      const sigma = getSigma(r);
      // 2-sigma makes it negative, which flips the phase
      //   return ((2 - sigma) / (2 * Math.sqrt(2))) * getCommonRadial(sigma);
      return getCommonRadial(sigma);
    },
  };

  const waveFunctions = {
    "1s": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["1s"](r) * angulars.s;
    },
    "2p_z": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["2p"](r) * angulars.p_z(getTheta(r, z));
    },
  };

  return waveFunctions;

  //   const waveFuntions = {
  //     1: {
  //       angular: {
  //         s: angulars_s,
  //       },
  //       radial: {
  //         s: (r: number) =>
  //           2 * Math.pow(Math.sqrt(Z / a0), 3) * Math.exp(-sigma(r) / 2),
  //       },
  //     },
  //     2: {
  //       angular: {
  //         s: angulars_s,
  //         p_z: angulars.p_z,
  //       },
  //       radial: {
  //         s: (r: number) =>
  //           2 * Math.pow(Math.sqrt(Z / a0), 3) * Math.exp(-sigma(r) / 2),
  //       },
  //     },
  //   };

  //   const angular = waveFuntions[n].angular;
  //   const radial = waveFuntions[n].radial;

  //   const foo = Object.entries(radial).flatMap(([radialKey, radialFunc]) => {
  //     return Object.entries(angular).map(([angularKey, angularFunc]) => {
  //       //   const key = `${n}${radialKey}_${angularKey}`;
  //       const key = `${n}${angularKey}`;
  //       return [key, (r: number) => radialFunc(r) * angularFunc(r)];
  //     });
  //   });

  //   return foo;
}
