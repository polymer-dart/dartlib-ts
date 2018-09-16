import { EQUALS_OPERATOR, isA } from "./utils";
/**
 * TODO: more complex
 * @param a
 * @param b
 */
function _is(a, b) {
    if (typeof b === 'string') {
        if (b === 'num' || b === 'int' || b === 'float' || b === 'double') {
            b = 'number';
            // TODO : refine with int  checking in case of int
        }
        else if (b === 'bool') {
            b = 'boolean';
        }
        return typeof a === b;
    }
    return isA(a, b);
}
function _equals(a, b) {
    if (a && a[EQUALS_OPERATOR]) {
        return a[EQUALS_OPERATOR](b);
    }
    else if (b && b[EQUALS_OPERATOR]) {
        return b[EQUALS_OPERATOR](a);
    }
    return a === b;
}
function _divide(a, b) {
    return Math.floor(a / b);
}
const _assert = (expr) => {
    if (!expr)
        throw expr;
};
const _isNot = (a, b) => !_is(a, b);
const _nullOr = (a, def) => a === null || a === undefined ? def : a;
export default {
    equals: _equals,
    is: _is,
    isNot: _isNot,
    divide: _divide,
    assert: _assert,
    nullOr: _nullOr
};
export class RootProperty {
    constructor(x) {
        this._value = x;
    }
    get value() {
        return this._value;
    }
    set value(x) {
        this._value = x;
    }
}
export { _is as is, _equals as equals, _isNot as isNot, _divide as divide, _assert as assert, _nullOr as nullOr, };
//# sourceMappingURL=_common.js.map