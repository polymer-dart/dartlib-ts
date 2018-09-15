import { int } from "./utils";
/**
 * TODO: more complex
 * @param a
 * @param b
 */
declare function _is<X extends ('num' | 'int' | 'float' | 'double' | 'number' | 'bool' | 'boolean' | 'string' | Function)>(a: any, b: X): boolean;
declare function _equals(a: any, b: any): any;
declare function _divide(a: int, b: int): int;
declare const _assert: (expr: any) => void;
declare const _isNot: (a: any, b: any) => boolean;
declare const _nullOr: <X>(a: X, def: X) => X;
declare const _default: {
    equals: typeof _equals;
    is: typeof _is;
    isNot: (a: any, b: any) => boolean;
    divide: typeof _divide;
    assert: (expr: any) => void;
    nullOr: <X>(a: X, def: X) => X;
};
export default _default;
export { _is as is, _equals as equals, _isNot as isNot, _divide as divide, _assert as assert, _nullOr as nullOr, };
