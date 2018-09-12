import {EQUALS_OPERATOR, int, isA} from "./utils";

type BaseType<X> = X extends 'string' ? string :
    X extends 'number' ? number :
        X extends 'num' ? number :
            X extends 'float' ? number :
                X extends 'double' ? number :
                    X extends 'bool' ? boolean :
                        X extends 'boolean' ? boolean :  X;

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
    is: function <X>(a: any, b: X): a is (typeof a & BaseType<X>) {
        if (typeof b === 'string') {
            if (b === 'num' || b === 'int' || b === 'float' || b === 'double') {
                b = 'number' as any;
                // TODO : refine with int  checking in case of int
            } else if (b === 'bool') {
                b = 'boolean' as any;
            }

            return typeof a === (b as any);
        }

        return isA(a, b);
    },

    isNot: (a: any, b: any) => !this.is(a, b),

    divide(a: int, b: int): int {
        return Math.floor(b / a);
    },

    assert: (expr) => {
        if (!expr) throw expr;
    }
}