import { int, _equals } from "./utils";
declare type BaseType<X> = X extends 'string' ? string : (X extends 'number' ? number : (X extends 'int' ? number : (X extends 'num' ? number : (X extends 'float' ? number : (X extends 'double' ? number : (X extends 'bool' ? boolean : (X extends 'boolean' ? boolean : (X extends (new (...args: any[]) => infer T) ? T : any))))))));
/**
 * TODO: more complex
 * @param a
 * @param b
 */
declare function _is<X extends ('num' | 'int' | 'float' | 'double' | 'number' | 'bool' | 'boolean' | 'string' | (new (...args: any[]) => {}))>(a: any, b: X): a is (BaseType<X>);
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
export declare class RootProperty<X> {
    _value: X;
    value: X;
    constructor(x?: X);
}
export { _is as is, _equals as equals, _isNot as isNot, _divide as divide, _assert as assert, _nullOr as nullOr, };
