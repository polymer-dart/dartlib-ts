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
    is: (a:any,b:any) => {
        // TODO : should check if b is a string or if it is 'int'
      return a instanceof b;
    }
}