export declare const OPERATOR_INDEX_ASSIGN: unique symbol;
export declare const OPERATOR_INDEX: unique symbol;
export declare const OPERATOR_PLUS: unique symbol;
export declare const OPERATOR_MINUS: unique symbol;
export declare const OPERATOR_TIMES: unique symbol;
export declare const OPERATOR_DIVIDE: unique symbol;
export declare const OPERATOR_QUOTIENT: unique symbol;
export declare const EQUALS_OPERATOR: unique symbol;
export declare const OPERATOR_LT: unique symbol;
export declare const OPERATOR_GT: unique symbol;
export declare const OPERATOR_LEQ: unique symbol;
export declare const OPERATOR_GEQ: unique symbol;
export declare const OPERATOR_NEG: unique symbol;
export declare const OPERATOR_BITNEG: unique symbol;
export declare const OPERATOR_XOR: unique symbol;
export declare const OPERATOR_BITOR: unique symbol;
export declare const OPERATOR_BITAND: unique symbol;
export declare const OPERATOR_SHIFTRIGHT: unique symbol;
export declare const OPERATOR_SHIFTLEFT: unique symbol;
export declare const OPERATOR_INTDIVIDE: unique symbol;
export declare const OPERATOR_MODULE: unique symbol;
export declare enum Op {
    PLUS = 0,
    MINUS = 1,
    TIMES = 2,
    DIVIDE = 3,
    QUOTIENT = 4,
    EQUALS = 5,
    INDEX = 6,
    INDEX_ASSIGN = 7,
    LT = 8,
    GT = 9,
    LEQ = 10,
    GEQ = 11,
    NEG = 12,
    BITNEG = 13,
    XOR = 14,
    BITOR = 15,
    BITAND = 16,
    SHIFTRIGHT = 17,
    SHIFTLEFT = 18,
    INTDIVIDE = 19,
    MODULE = 20
}
export declare type int = number;
export declare type long = number;
export declare type float = number;
export declare type double = number;
export declare type num = number;
export declare type bool = boolean;
export declare const UNINITIALIZED: unique symbol;
declare type Constructor<X> = {
    new (...args: any[]): X;
    prototype: any;
};
export declare function safeCallOriginal(target: any, name: string | symbol, ...args: any[]): any;
export declare function copyProps(s: any, t: any, excludes?: Set<string | symbol>): void;
export declare function mixin<Mixin, Base>(mixin: Constructor<Mixin>, base: Constructor<Base>): Constructor<Mixin & Base>;
/**
 * Simple decorator to apply a mixin without adding type info
 */
export declare function With(mixin: any): ClassDecorator;
export declare function DartConstructor(_: {
    default?: boolean;
    factory?: boolean;
    name?: string;
}): MethodDecorator;
export declare const defaultConstructor: MethodDecorator;
export declare const defaultFactory: MethodDecorator;
export declare const NamedConstructor: (name?: string) => MethodDecorator;
export declare const namedConstructor: MethodDecorator;
export declare const NamedFactory: (name?: string) => MethodDecorator;
export declare const namedFactory: MethodDecorator;
/**
 * Replace a constructor with a delayed construction logic
 * @constructor
 */
export declare const DartClass: ClassDecorator;
export declare const Abstract: MethodDecorator;
export declare const AbstractProperty: PropertyDecorator;
export declare function AbstractMethods(...props: Array<symbol | string>): ClassDecorator;
export declare function Implements(...intf: any[]): (ctor: any) => void;
export declare function isA(obj: any, cls: any): boolean;
export declare function Operator(op: Op): MethodDecorator;
export declare function $with<T>(t: T, ...expressions: ((t: T) => any)[]): T;
export {};
