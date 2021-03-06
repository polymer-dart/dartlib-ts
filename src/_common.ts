import { OperatorMethods, int, isA, _equals } from "./utils";
import any = jasmine.any;

type BaseType<X> = X extends 'string' ? string :
    (X extends 'number' ? number :
        (X extends 'int' ? number :
            (X extends 'num' ? number :
                (X extends 'float' ? number :
                    (X extends 'double' ? number :
                        (X extends 'bool' ? boolean :
                            (X extends 'boolean' ? boolean :
                                (X extends (new (...args: any[]) => infer T) ? T :
                                    any))))))));

/**
 * TODO: more complex
 * @param a
 * @param b
 */
function _is<X extends ('num' | 'int' | 'float' | 'double' | 'number' | 'bool' | 'boolean' | 'string' | (new (...args: any[]) => {}))>(a: any, b: X): a is (BaseType<X>) {
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
}



function _divide(a: int, b: int): int {
    return Math.floor(a / b);
}

const _assert = (expr) => {
    if (!expr) throw expr;
};

const _isNot = (a: any, b: any) => !_is(a, b);

const _nullOr = <X>(a: X, def: X): X => a === null || a === undefined ? def : a;

export default {

    equals: _equals,

    is: _is,

    isNot: _isNot,

    divide: _divide,

    assert: _assert,

    nullOr: _nullOr
}

export class RootProperty<X> {
    _value: X;
    get value(): X {
        return this._value;
    }

    set value(x: X) {
        this._value = x;
    }

    constructor(x?: X) {
        this._value = x;
    }
}

export {
    _is as is,
    _equals as equals,
    _isNot as isNot,
    _divide as divide,
    _assert as assert,
    _nullOr as nullOr,
}