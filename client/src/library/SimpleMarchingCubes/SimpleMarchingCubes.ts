import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Material,
  Mesh,
  // Sphere,
  // Vector3,
} from "three";
import { edgeTable, triTable } from "./lookupTables.ts";

/**
 * A simplified marching cubes implementation based on {@link https://github.com/mrdoob/three.js/blob/master/examples/jsm/objects/MarchingCubes.js}
 *
 * Port of: {@link http://webglsamples.org/blob/blob.html}
 *
 * @three_import import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
 */
class MarchingCubes extends Mesh {
  isMarchingCubes: boolean;
  init: (resolution: number) => void;
  resolution = 32;
  isolation = 80.0;
  size = 0;
  size2 = 0;
  size3 = 0;
  halfsize = 0;
  delta = 0;
  xd = 1;
  yd = 0;
  zd = 0;
  field!: Float32Array;
  normal_cache!: Float32Array<ArrayBuffer>;
  palette!: Float32Array<ArrayBuffer>;
  positionArray!: Float32Array<ArrayBuffer>;
  normalArray!: Float32Array<ArrayBuffer>;
  uvArray!: Float32Array<ArrayBuffer>;
  colorArray!: Float32Array<ArrayBuffer>;
  setCell: (x: number, y: number, z: number, value: number) => void;
  getCell: (x: number, y: number, z: number) => number;
  reset: () => void;
  update: () => void;

  /**
   * Constructs a new marching cubes instance.
   *
   * @param resolution - The effect's resolution.
   * @param material - The cube's material.
   * @param maxPolyCount - The maximum size of the geometry buffers.
   */
  constructor(
    resolution: number,
    material: Material,
    maxPolyCount = 10000,
  ) {
    const geometry = new BufferGeometry();

    super(geometry, material);

    /**
     * This flag can be used for type testing.
     *
     * @type {boolean}
     * @readonly
     * @default true
     */
    this.isMarchingCubes = true;

    const scope = this;

    // temp buffers used in polygonize

    const vlist = new Float32Array(12 * 3);
    const nlist = new Float32Array(12 * 3);
    const clist = new Float32Array(12 * 3);

    // functions have to be object properties
    // prototype functions kill performance
    // (tested and it was 4x slower !!!)

    this.init = function (resolution) {
      this.resolution = resolution;

      // parameters

      this.isolation = 80.0;

      // size of field, 32 is pushing it in Javascript :)

      this.size = resolution;
      this.size2 = this.size * this.size;
      this.size3 = this.size2 * this.size;
      this.halfsize = this.size / 2.0;

      // deltas

      this.delta = 2.0 / this.size;
      this.yd = this.size;
      this.zd = this.size2;

      this.field = new Float32Array(this.size3);
      this.normal_cache = new Float32Array(this.size3 * 3);
      this.palette = new Float32Array(this.size3 * 3);

      //

      this.count = 0;

      const maxVertexCount = maxPolyCount * 3;

      this.positionArray = new Float32Array(maxVertexCount * 3);
      const positionAttribute = new BufferAttribute(this.positionArray, 3);

      // DynamicDraw usage - is this responsible for the actual rendering?
      positionAttribute.setUsage(DynamicDrawUsage);
      geometry.setAttribute("position", positionAttribute);

      this.normalArray = new Float32Array(maxVertexCount * 3);
      const normalAttribute = new BufferAttribute(this.normalArray, 3);
      normalAttribute.setUsage(DynamicDrawUsage);
      geometry.setAttribute("normal", normalAttribute);

      // ?
      // geometry.boundingSphere = new Sphere(new Vector3(), 1);
    };

    ///////////////////////
    // Polygonization
    ///////////////////////

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    // Vertex interpolation along the X axis?
    function VIntX(
      q: number,
      offset: number,
      isol: number,
      x: number,
      y: number,
      z: number,
      valp1: number,
      valp2: number,
      c_offset1: number,
      c_offset2: number,
    ) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x + mu * scope.delta;
      vlist[offset + 1] = y;
      vlist[offset + 2] = z;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q + 3], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q + 4], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q + 5], mu);

      clist[offset + 0] = lerp(
        scope.palette[c_offset1 * 3 + 0],
        scope.palette[c_offset2 * 3 + 0],
        mu,
      );
      clist[offset + 1] = lerp(
        scope.palette[c_offset1 * 3 + 1],
        scope.palette[c_offset2 * 3 + 1],
        mu,
      );
      clist[offset + 2] = lerp(
        scope.palette[c_offset1 * 3 + 2],
        scope.palette[c_offset2 * 3 + 2],
        mu,
      );
    }

    function VIntY(
      q: number,
      offset: number,
      isol: number,
      x: number,
      y: number,
      z: number,
      valp1: number,
      valp2: number,
      c_offset1: number,
      c_offset2: number,
    ) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x;
      vlist[offset + 1] = y + mu * scope.delta;
      vlist[offset + 2] = z;

      const q2 = q + scope.yd * 3;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q2 + 0], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q2 + 1], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q2 + 2], mu);

      clist[offset + 0] = lerp(
        scope.palette[c_offset1 * 3 + 0],
        scope.palette[c_offset2 * 3 + 0],
        mu,
      );
      clist[offset + 1] = lerp(
        scope.palette[c_offset1 * 3 + 1],
        scope.palette[c_offset2 * 3 + 1],
        mu,
      );
      clist[offset + 2] = lerp(
        scope.palette[c_offset1 * 3 + 2],
        scope.palette[c_offset2 * 3 + 2],
        mu,
      );
    }

    function VIntZ(
      q: number,
      offset: number,
      isol: number,
      x: number,
      y: number,
      z: number,
      valp1: number,
      valp2: number,
      c_offset1: number,
      c_offset2: number,
    ) {
      const mu = (isol - valp1) / (valp2 - valp1),
        nc = scope.normal_cache;

      vlist[offset + 0] = x;
      vlist[offset + 1] = y;
      vlist[offset + 2] = z + mu * scope.delta;

      const q2 = q + scope.zd * 3;

      nlist[offset + 0] = lerp(nc[q + 0], nc[q2 + 0], mu);
      nlist[offset + 1] = lerp(nc[q + 1], nc[q2 + 1], mu);
      nlist[offset + 2] = lerp(nc[q + 2], nc[q2 + 2], mu);

      clist[offset + 0] = lerp(
        scope.palette[c_offset1 * 3 + 0],
        scope.palette[c_offset2 * 3 + 0],
        mu,
      );
      clist[offset + 1] = lerp(
        scope.palette[c_offset1 * 3 + 1],
        scope.palette[c_offset2 * 3 + 1],
        mu,
      );
      clist[offset + 2] = lerp(
        scope.palette[c_offset1 * 3 + 2],
        scope.palette[c_offset2 * 3 + 2],
        mu,
      );
    }

    // Caches normals to be used in the VInt[XYZ] functions
    function compNorm(c: number) {
      const c3 = c * 3;
      const { normal_cache, field, xd, yd, zd } = scope;

      if (normal_cache[c3] === 0.0) {
        normal_cache[c3 + 0] = field[c - xd] - field[c + xd];
        normal_cache[c3 + 1] = field[c - yd] - field[c + yd];
        normal_cache[c3 + 2] = field[c - zd] - field[c + zd];
      }
    }

    /**
     * Returns the total number of triangles. Fills triangles.
     * (this is where most of time is spent - it's inner work of O(n3) loop )
     * It (figuratively speaking) marches a cube through the scalar field (3D grid).
     */
    function polygonize(
      fx: number,
      fy: number,
      fz: number,
      c000: number,
      isol: number,
    ) {
      console.log("polygonize");

      /**
       * cache indices (2x2x2 Cube vertices)
       *
       * zyx
       * 000 --> c000
       * 001 --> c001
       * 010 --> c010
       * 011 --> c011
       * 100 --> c100
       * 101 --> c101
       * 110 --> c110
       * 111 --> c111
       */
      const c001 = c000 + scope.xd,
        c010 = c000 + scope.yd,
        c011 = c001 + scope.yd,
        c100 = c000 + scope.zd,
        c101 = c001 + scope.zd,
        c110 = c010 + scope.zd,
        c111 = c011 + scope.zd;

      let cubeindex = 0;
      const f000 = scope.field[c000],
        f001 = scope.field[c001],
        f010 = scope.field[c010],
        f011 = scope.field[c011],
        f100 = scope.field[c100],
        f101 = scope.field[c101],
        f110 = scope.field[c110],
        f111 = scope.field[c111];

      if (f000 < isol) cubeindex |= 1;
      if (f001 < isol) cubeindex |= 2;
      if (f011 < isol) cubeindex |= 4;
      if (f010 < isol) cubeindex |= 8;
      if (f100 < isol) cubeindex |= 16;
      if (f101 < isol) cubeindex |= 32;
      if (f111 < isol) cubeindex |= 64;
      if (f110 < isol) cubeindex |= 128;

      // if cube is entirely in/out of the surface - bail, nothing to draw

      const bits = edgeTable[cubeindex];
      if (bits === 0) return 0;

      const d = scope.delta,
        fx2 = fx + d,
        fy2 = fy + d,
        fz2 = fz + d;

      // top of the cube

      if (bits & 1) {
        compNorm(c000);
        compNorm(c001);
        VIntX(c000 * 3, 0, isol, fx, fy, fz, f000, f001, c000, c001);
      }

      if (bits & 2) {
        compNorm(c001);
        compNorm(c011);
        VIntY(c001 * 3, 3, isol, fx2, fy, fz, f001, f011, c001, c011);
      }

      if (bits & 4) {
        compNorm(c010);
        compNorm(c011);
        VIntX(c010 * 3, 6, isol, fx, fy2, fz, f010, f011, c010, c011);
      }

      if (bits & 8) {
        compNorm(c000);
        compNorm(c010);
        VIntY(c000 * 3, 9, isol, fx, fy, fz, f000, f010, c000, c010);
      }

      // bottom of the cube

      if (bits & 16) {
        compNorm(c100);
        compNorm(c101);
        VIntX(c100 * 3, 12, isol, fx, fy, fz2, f100, f101, c100, c101);
      }

      if (bits & 32) {
        compNorm(c101);
        compNorm(c111);
        VIntY(
          c101 * 3,
          15,
          isol,
          fx2,
          fy,
          fz2,
          f101,
          f111,
          c101,
          c111,
        );
      }

      if (bits & 64) {
        compNorm(c110);
        compNorm(c111);
        VIntX(
          c110 * 3,
          18,
          isol,
          fx,
          fy2,
          fz2,
          f110,
          f111,
          c110,
          c111,
        );
      }

      if (bits & 128) {
        compNorm(c100);
        compNorm(c110);
        VIntY(c100 * 3, 21, isol, fx, fy, fz2, f100, f110, c100, c110);
      }

      // vertical lines of the cube
      if (bits & 256) {
        compNorm(c000);
        compNorm(c100);
        VIntZ(c000 * 3, 24, isol, fx, fy, fz, f000, f100, c000, c100);
      }

      if (bits & 512) {
        compNorm(c001);
        compNorm(c101);
        VIntZ(c001 * 3, 27, isol, fx2, fy, fz, f001, f101, c001, c101);
      }

      if (bits & 1024) {
        compNorm(c011);
        compNorm(c111);
        VIntZ(
          c011 * 3,
          30,
          isol,
          fx2,
          fy2,
          fz,
          f011,
          f111,
          c011,
          c111,
        );
      }

      if (bits & 2048) {
        compNorm(c010);
        compNorm(c110);
        VIntZ(c010 * 3, 33, isol, fx, fy2, fz, f010, f110, c010, c110);
      }

      cubeindex <<= 4; // re-purpose cubeindex into an offset into triTable

      let o1,
        o2,
        o3,
        numtris = 0,
        i = 0;

      // here is where triangles are created

      while (triTable[cubeindex + i] != -1) {
        o1 = cubeindex + i;
        o2 = o1 + 1;
        o3 = o1 + 2;

        posnormtriv(
          vlist,
          nlist,
          3 * triTable[o1],
          3 * triTable[o2],
          3 * triTable[o3],
        );

        i += 3;
        numtris++;
      }

      return numtris;
    }

    // debug helpers
    let posnormtrivCount = 0;
    const posnormtrivSet = new Set();

    function posnormtriv(
      pos: Float32Array,
      norm: Float32Array,
      o1: number,
      o2: number,
      o3: number,
    ) {
      posnormtrivCount++; // debug

      const c = scope.count * 3;

      // debug
      for (let i = 0; i < 9; i++) {
        posnormtrivSet.add(c + i);
      }

      // positions

      scope.positionArray[c + 0] = pos[o1];
      scope.positionArray[c + 1] = pos[o1 + 1];
      scope.positionArray[c + 2] = pos[o1 + 2];

      scope.positionArray[c + 3] = pos[o2];
      scope.positionArray[c + 4] = pos[o2 + 1];
      scope.positionArray[c + 5] = pos[o2 + 2];

      scope.positionArray[c + 6] = pos[o3];
      scope.positionArray[c + 7] = pos[o3 + 1];
      scope.positionArray[c + 8] = pos[o3 + 2];

      // normals

      scope.normalArray[c + 0] = norm[o1 + 0];
      scope.normalArray[c + 1] = norm[o1 + 1];
      scope.normalArray[c + 2] = norm[o1 + 2];

      scope.normalArray[c + 3] = norm[o2 + 0];
      scope.normalArray[c + 4] = norm[o2 + 1];
      scope.normalArray[c + 5] = norm[o2 + 2];

      scope.normalArray[c + 6] = norm[o3 + 0];
      scope.normalArray[c + 7] = norm[o3 + 1];
      scope.normalArray[c + 8] = norm[o3 + 2];

      scope.count += 3;
    }

    /////////////////////////////////////
    // Updates
    /////////////////////////////////////

    /**
     * Sets the cell value for the given coordinates.
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} z - The z value.
     * @param {number} value - The value to set.
     */
    this.setCell = function (x, y, z, value) {
      const index = this.size2 * z + this.size * y + x;
      this.field[index] = value;
    };

    /**
     * Returns the cell value for the given coordinates.
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} z - The z value.
     * @return {number} The value.
     */
    this.getCell = function (x, y, z) {
      const index = this.size2 * z + this.size * y + x;
      return this.field[index];
    };

    /**
     * Resets the effect.
     */
    this.reset = function () {
      // wipe the normal cache

      for (let i = 0; i < this.size3; i++) {
        this.normal_cache[i * 3] = 0.0;
        this.field[i] = 0.0;
        this.palette[i * 3] =
          this.palette[i * 3 + 1] =
          this.palette[
            i * 3 + 2
          ] =
            0.0;
      }
    };

    /**
     * Updates the effect.
     */
    this.update = function () {
      console.log("--- update ----");

      posnormtrivCount = 0; // debug

      this.count = 0;

      // Triangulate. Yeah, this is slow.

      /** For some reason the polygons don't get rendered
       * correctly if trying to map the whole grid so need to
       * use a subset grid that goes "1 --> res-2"
       * (instead of the full "0 --> res" grid ). Though the most
       * relevant part is to make sure the sample values are within
       * that subset grid, otherwise the isosurface gets clipped.
       * Marching through the whole grid here doesn't cause issues, it's
       * just unnecessary work.
       */
      const smin2 = this.size - 2;
      const startI = 1;

      console.log(
        "foo.length",
        scope.positionArray.filter((v) => v !== 0).length,
      );

      const res = this.size;
      const res2 = this.size2;
      const halfRes = this.halfsize;

      /**
       * Translates positive values to values between -1 and 1
       * If resolution is 10:
       * 0 --> -1
       * 2 --> -0.6
       * 5 --> 0
       * 7 --> 0.4
       * 10 --> 1
       */
      function fu(c: number) {
        return (c - halfRes) / halfRes;
      }

      for (let z = startI; z < smin2; z++) {
        const z_offset = res2 * z;
        const fz = fu(z); //+ 1

        // debug
        const previousFoo = scope.positionArray.filter((v) => v !== 0).length;

        for (let y = startI; y < smin2; y++) {
          const y_offset = z_offset + res * y;
          const fy = fu(y); //+ 1

          for (let x = startI; x < smin2; x++) {
            const fx = fu(x); //+ 1

            const q = y_offset + x;
            polygonize(fx, fy, fz, q, this.isolation);
          }
        }

        // debug
        const foo = scope.positionArray.filter((v) => v !== 0).length;
        console.log(
          "foo addition",
          foo - previousFoo,
        );
      }
      console.log(
        "foo.length",
        scope.positionArray.filter((v) => v !== 0).length,
      );
      console.log("posnormtrivCount", posnormtrivCount);
      console.log("posnormtrivSet.size", posnormtrivSet.size);

      // set the draw range to only the processed triangles

      this.geometry.setDrawRange(0, this.count);

      // update geometry data

      geometry.getAttribute("position").needsUpdate = true;
      geometry.getAttribute("normal").needsUpdate = true;

      // safety check

      if (this.count / 3 > maxPolyCount) {
        console.warn(
          "THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.",
        );
      }

      console.log("--- end update ----");
    };

    this.init(resolution);
  }
}

export { MarchingCubes };
