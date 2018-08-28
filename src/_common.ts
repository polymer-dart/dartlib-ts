export const EQUALS_OPERATOR = Symbol('==');

export default {
    /**
     * @param a
     * @param b
     */
    equals: (a: any, b: any) => {
        if (a && a[EQUALS_OPERATOR]) {
            return a[EQUALS_OPERATOR](b);
        } else if (b && b[EQUALS_OPERATOR]) {
            return b[EQUALS_OPERATOR](a);
        }
        return a === b;
    },

    /**
     * TODO: more complex
     * @param a
     * @param b
     */
    is: (a: any, b: any) => {
        if (typeof b === 'string') {
            if (b === 'num' || b === 'int' || b === 'float' || b === 'double') {
                b = 'number';
                // TODO : refine with int  checking in case of int
            } else if (b === 'bool') {
                b = 'boolean';
            }

            return typeof a === b;
        }

        return a instanceof b;
    }
}