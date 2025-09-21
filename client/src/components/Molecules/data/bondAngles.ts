/**
 * Sometimes the type of the molecules forces bond angles to something different like in a cyclic hydrocarbon
 */

export const bondAngle= {
    O: {
         // one lone pair
        '0-1-1': 106.7,
    },
    C: {
        /**
         * If all bond types are equal the angles are perfect, right?
         */
        '1-1-1-1': 109.5
    }
}