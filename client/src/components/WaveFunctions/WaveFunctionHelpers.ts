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

// x = r sinθ cosφ
// y = r sinθ sinφ
// z = r cosθ
// cos θ = z/r <=> acos(z/r) = θ
function getTheta(r: number, z: number) {
  // return Math.acos(r === 0 ? 1 : z / r);
  return Math.acos(z / r);
}

// // cosφ = x/rsinθ <=> φ = acos(x/rsinθ)
// function getPhiX(r: number, x: number, theta: number) {
//   return Math.acos(x / (r * Math.sin(theta)));
// }

// // sinφ = y/rsinθ <=> φ = asin(y/rsinθ)
// function getPhiY(r: number, y: number, theta: number) {
//   return Math.asin(y / (r * Math.sin(theta)));
// }

function getPhi(y: number, x: number) {
  return Math.atan2(y, x);
}

export function createWaveFunctions(a0 = 2) {
  // const a0 = 2; // The first Bohr radius (53 pm)
  const Z = 1; // The atomic number (1 for hydrogen)

  /**
   * @param r Distance from the center
   * @param n The principal quantum number
   */
  function getSigma(r: number, n: number) {
    return 2 * Z * r / (n * a0);
  }

  // (a/bπ)^(1/2)
  function commonAngular(a = 1, b = 4) {
    return Math.sqrt(a / (b * Math.PI));
  }

  const angulars = {
    s: commonAngular(),
    // (3/4π)^(1/2) * sinθ * cosφ
    p_x: (theta: number, phi: number) =>
      commonAngular(3) * Math.sin(theta) * Math.cos(phi),
    // (3/4π)^(1/2) * sinθ * sinφ
    p_y: (theta: number, phi: number) =>
      commonAngular(3) * Math.sin(theta) * Math.sin(phi),
    // (3/4π)^(1/2) * cosφ
    p_z: (theta: number) => commonAngular(3) * Math.cos(theta),
    // (5/16π)^(1/2) * (3cos²θ - 1)
    d_z2: (theta: number) =>
      commonAngular(5, 16) * (3 * Math.pow(Math.cos(theta), 2) - 1),
    // (15/16π)^(1/2) * sin²θ * cos2φ
    "d_x2-y2": (theta: number, phi: number) =>
      commonAngular(15, 16) *
      Math.pow(Math.sin(theta), 2) * Math.cos(2 * phi),
    // (15/16π)^(1/2) * sin²θ * sin2φ
    "d_xy": (theta: number, phi: number) =>
      commonAngular(15, 16) *
      Math.pow(Math.sin(theta), 2) * Math.sin(2 * phi),
    // (15/4π)^(1/2) * sinθ * cosθ * cosφ
    "d_xz": (theta: number, phi: number) =>
      commonAngular(15, 4) *
      Math.sin(theta) * Math.cos(theta) * Math.cos(phi),
    // (15/4π)^(1/2) * sinθ * cosθ * sinφ
    "d_yz": (theta: number, phi: number) =>
      commonAngular(15, 4) *
      Math.sin(theta) * Math.cos(theta) * Math.sin(phi),
  };

  // (Z/a0)^(3/2) * e^(-σ/2)
  function commonRadial(sigma: number) {
    return Math.pow(Math.sqrt(Z / a0), 3) * Math.exp(-sigma / 2);
  }

  const radials = {
    "1s": (r: number) => {
      return 2 * commonRadial(getSigma(r, 1));
    },
    "2s": (r: number) => {
      const sigma = getSigma(r, 2);
      return ((2 - sigma) / (2 * Math.sqrt(2))) * commonRadial(sigma);
    },
    "3s": (r: number) => {
      const sigma = getSigma(r, 3);
      return ((6 - 6 * sigma + Math.pow(sigma, 2)) / (9 * Math.sqrt(3))) *
        commonRadial(sigma);
    },
    "2p": (r: number) => {
      const sigma = getSigma(r, 2);
      // σ/(2V6) * RAD
      return sigma / (2 * Math.sqrt(6)) * commonRadial(sigma);
    },
    "3p": (r: number) => {
      const sigma = getSigma(r, 3);
      // (4-σ)σ/(9V6) * RAD
      return (4 - sigma) * sigma / (9 * Math.sqrt(6)) * commonRadial(sigma);
    },
    "3d": (r: number) => {
      const sigma = getSigma(r, 3);
      // σ^2 / 9V30 * RAD
      return Math.pow(sigma, 2) / (9 * Math.sqrt(30)) * commonRadial(sigma);
    },
  };

  function simple1s(r: number) {
    const sigma = 2 * Z * r / a0;
    const radial = 2 * Math.pow(Math.sqrt(Z / a0), 3) * Math.exp(-sigma / 2);
    const angular = Math.sqrt(1 / (4 * Math.PI));

    return radial * angular;
  }

  const waveFunctions = {
    "1s": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["1s"](r) * angulars.s;
      // return simple1s(r);
    },
    "2s": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["2s"](r) * angulars.s;
    },
    "3s": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["3s"](r) * angulars.s;
    },
    "2p_x": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiX(r, x, theta);
      const phi = getPhi(y, x);
      return radials["2p"](r) * angulars.p_x(theta, phi);
    },
    "2p_y": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiY(r, y, theta);
      const phi = getPhi(y, x);

      return radials["2p"](r) * angulars.p_y(theta, phi);
    },
    "2p_z": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["2p"](r) * angulars.p_z(getTheta(r, z));
    },
    "3p_x": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiX(r, x, theta);
      const phi = getPhi(y, x);

      return radials["3p"](r) * angulars.p_x(theta, phi);
    },
    "3p_y": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiY(r, y, theta);
      const phi = getPhi(y, x);

      return radials["3p"](r) * angulars.p_y(theta, phi);
    },
    "3p_z": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["3p"](r) * angulars.p_z(getTheta(r, z));
    },
    "3d_z2": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      return radials["3d"](r) * angulars.d_z2(getTheta(r, z));
    },
    "3d_x2-y2": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiX(r, x, theta); // PhiY works too
      const phi = getPhi(y, x);

      return radials["3d"](r) * angulars["d_x2-y2"](theta, phi);
    },
    "3d_xy": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      const phi = getPhi(y, x);
      return radials["3d"](r) * angulars["d_xy"](theta, phi);
    },
    // "3d_xy_cartesian": (x: number, y: number, z: number) => {
    //   return psi3d_xy_cartesian(x, y, z, Z, a0);
    // },
    // "3d_xy_spherical": (x: number, y: number, z: number) => {
    //   const r = Math.hypot(x, y, z);
    //   const theta = r === 0 ? 0 : Math.acos(z / r);
    //   const phi = Math.atan2(y, x);
    //   return psi3d_xy_spherical(r, theta, phi, Z, a0);
    // },
    "3d_xz": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiX(r, x, theta); // PhiY doesn't work here
      const phi = getPhi(y, x);

      return radials["3d"](r) * angulars["d_xz"](theta, phi);
    },
    "3d_yz": (x: number, y: number, z: number) => {
      const r = Math.hypot(x, y, z);
      const theta = getTheta(r, z);
      // const phi = getPhiY(r, y, theta); // PhiX doesn't work here
      const phi = getPhi(y, x);

      return radials["3d"](r) * angulars["d_yz"](theta, phi);
    },
  };

  // function XyAngularWithoutTheta(r: number, x: number, y: number) {
  //   return Math.sqrt(15 / (4 * Math.PI)) * (x * y / Math.pow(r, 2));
  // }

  return waveFunctions;
}

const waveFunctions = createWaveFunctions();

export type WaveFuntionKey = keyof typeof waveFunctions;

// // 3d_xy wavefunction (Cartesian form) for a hydrogen-like atom
// // Psi(x,y,z) = C * x * y * exp(-Z * r / (3 * a0))
// // where C = sqrt(2) / (81 * sqrt(pi)) * (Z / a0)^(7/2)
// // Units: same units for x,y,z and a0 (e.g. meters)

// const BOHR_RADIUS = 5.29177210903e-11; // meters

// /**
//  * Radial part R_{32}(r)
//  */
// function R32(r: number, Z = 1, a0 = BOHR_RADIUS) {
//   const coeff = (2 * Math.sqrt(30)) / 1215;
//   const factor = Math.pow(Z / a0, 3.5); // (Z/a0)^(7/2)
//   return coeff * factor * r * r * Math.exp(-Z * r / (3 * a0));
// }

// /**
//  * Angular part Y_{2}^{(xy)}(theta,phi)
//  */
// function Y2_xy(theta: number, phi: number) {
//   return Math.sqrt(15 / (16 * Math.PI)) *
//     Math.pow(Math.sin(theta), 2) *
//     Math.sin(2 * phi);
// }

// /**
//  * Full 3d_xy wavefunction Psi(r,theta,phi)
//  */
// function psi3d_xy_spherical(
//   r: number,
//   theta: number,
//   phi: number,
//   Z = 1,
//   a0 = BOHR_RADIUS,
// ) {
//   return R32(r, Z, a0) * Y2_xy(theta, phi);
// }

// /**
//  * Convert Cartesian (x,y,z) → spherical (r,theta,phi)
//  * r = sqrt(x^2+y^2+z^2)
//  * theta = arccos(z/r)  (polar angle, 0 ≤ θ ≤ π)
//  * phi = atan2(y,x)     (azimuthal angle, -π < φ ≤ π)
//  */
// function cartesianToSpherical(x: number, y: number, z: number) {
//   const r = Math.sqrt(x * x + y * y + z * z);
//   const theta = r === 0 ? 0 : Math.acos(z / r);
//   const phi = Math.atan2(y, x);
//   return { r, theta, phi };
// }

// /**
//  * Wrapper: Psi_{3d_xy}(x,y,z) using spherical form
//  */
// function psi3d_xy_cartesian(
//   x: number,
//   y: number,
//   z: number,
//   Z = 1,
//   a0 = BOHR_RADIUS,
// ) {
//   const { r, theta, phi } = cartesianToSpherical(x, y, z);
//   return psi3d_xy_spherical(r, theta, phi, Z, a0);
// }

// // /**
// //  * Compute the 3d_xy wavefunction value.
// //  *
// //  * @param {number} x - x coordinate (same units as a0)
// //  * @param {number} y - y coordinate
// //  * @param {number} z - z coordinate
// //  * @param {number} [Z=1] - nuclear charge (Z=1 for hydrogen)
// //  * @param {number} [a0=BOHR_RADIUS] - reduced-mass Bohr radius (default: a0)
// //  * @returns {number} Psi_{3d_xy}(x,y,z) (real)
// //  */
// // function psi3d_xy_cartesian(
// //   x: number,
// //   y: number,
// //   z: number,
// //   Z = 1,
// //   a0 = BOHR_RADIUS,
// // ) {
// //   const r = Math.sqrt(x * x + y * y + z * z);
// //   // normalization constant C = sqrt(2)/(81*sqrt(pi)) * (Z/a0)^(7/2)
// //   const C = Math.sqrt(2) / (81 * Math.sqrt(Math.PI)) * Math.pow(Z / a0, 3.5);
// //   const expo = Math.exp(-(Z * r) / (3 * a0));
// //   return C * x * y * expo;
// // }

// // 3d_xy wavefunction (spherical form) for hydrogen-like atom
// // Psi(r,theta,phi) = R_{32}(r) * Y_{2}^{(xy)}(theta,phi)
// //
// // r: radial distance
// // theta: polar angle [0..pi] (angle from z-axis)
// // phi: azimuthal angle [0..2pi] (angle from x-axis in xy-plane)

// /**
//  * Probability density |Psi|^2 in Cartesian coordinates
//  */
// function psi3d_xy_density_cartesian(
//   x: number,
//   y: number,
//   z: number,
//   Z = 1,
//   a0 = BOHR_RADIUS,
// ) {
//   const psi = psi3d_xy_cartesian(x, y, z, Z, a0);
//   return psi * psi;
// }

// // Example usage (hydrogen atom):
// // const x = 1e-10, y = 2e-10, z = 0;
// // console.log("Psi (Cartesian input):", psi3d_xy_cartesian(x, y, z));
// // console.log("Density:", psi3d_xy_density_cartesian(x, y, z));

// // Approximate probability in a small cube centered at (x,y,z) with side d
// function probInCube(
//   x: number,
//   y: number,
//   z: number,
//   Z = 1,
//   a0 = BOHR_RADIUS,
// ) {
//   const rho = psi3d_xy_density_cartesian(x, y, z, Z, a0); // m^-3
//   return rho * d * d * d; // dimensionless probability
// }

// // Slightly better: average density over a 3x3x3 grid in the cube
// function probInCubeAveraged(
//   x: number,
//   y: number,
//   z: number,
//   d: number,
//   Z = 1,
//   a0 = BOHR_RADIUS,
// ) {
//   const offsets = [-0.5, 0, 0.5];
//   let sum = 0, count = 0;
//   for (const i of offsets) {
//     for (const j of offsets) {
//       for (const k of offsets) {
//         const xi = x + i * d, yj = y + j * d, zk = z + k * d;
//         sum += psi3d_xy_density_cartesian(xi, yj, zk, Z, a0);
//         count++;
//       }
//     }
//   }
//   const avg = sum / count;
//   return avg * d * d * d;
// }

// // Small sphere approximation (centered at point, radius dr)
// // function probInSphere(
// //   x: number,
// //   y: number,
// //   z: number,
// //   dr: number,
// //   Z = 1,
// //   a0 = BOHR_RADIUS,
// // ) {
// //   const rho = psi3d_xy_density_cartesian(x, y, z, Z, a0);
// //   const volume = (4 / 3) * Math.PI * dr * dr * dr;
// //   return rho * volume;
// // }

// // Example near your point, using a 0.1 Å cube:
// const x = 1e-10, y = 2e-10, z = 0;
// const d = 1e-11; // 0.1 Å
// console.log("P(cube, center sample):", probInCube(x, y, z, d));
// console.log("P(cube, averaged):    ", probInCubeAveraged(x, y, z, d));

function R_1s(fraction: number) {
  let x = 3.0; // initial guess (R/a0)
  for (let i = 0; i < 20; i++) {
    const e2x = Math.exp(-2 * x);
    const h = e2x * (1 + 2 * x + 2 * x * x);
    const F = 1 - h;
    const G = F - fraction;
    if (Math.abs(G) < 1e-12) break;
    const Gp = 4 * x * x * e2x;
    x = x - G / Gp;
  }
  return x; // meters
}

const R_90 = R_1s(0.9);
// console.log("R_90 (bohrs):", R_90);
// console.log("R_90 (pm):", R_90 * 53);

const R_95 = R_1s(0.95);
// console.log("R_95 (bohrs):", R_95);
// console.log("R_95 (pm):", R_95 * 53);
