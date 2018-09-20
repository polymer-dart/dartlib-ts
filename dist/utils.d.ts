export declare namespace OperatorMethods {
    const INDEX_EQ: unique symbol;
    const INDEX: unique symbol;
    const PLUS: unique symbol;
    const MINUS: unique symbol;
    const MULTIPLY: unique symbol;
    const DIVIDE: unique symbol;
    const QUOTIENT: unique symbol;
    const EQUALS: unique symbol;
    const LT: unique symbol;
    const GT: unique symbol;
    const LEQ: unique symbol;
    const GEQ: unique symbol;
    const NEGATE: unique symbol;
    const COMPLEMENT: unique symbol;
    const XOR: unique symbol;
    const BINARY_OR: unique symbol;
    const BINARY_AND: unique symbol;
    const SHIFTRIGHT: unique symbol;
    const SHIFTLEFT: unique symbol;
    const MODULE: unique symbol;
}
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
    MODULE = 19
}
export declare type int = number;
export declare type long = number;
export declare type float = number;
export declare type double = number;
export declare type num = number;
export declare type bool = boolean;
export declare const UNINITIALIZED: unique symbol;
declare type Constructor<X extends {}> = {
    new (...args: any[]): X;
    prototype: any;
};
export declare function safeCallOriginal(target: any, name: string | symbol, ...args: any[]): any;
export declare function copyProps(s: any, t: any, excludes?: Set<string | symbol>): void;
export declare function mixin<Mixin extends {}, Base extends {}>(mixin: Constructor<Mixin>, base: Constructor<Base>): Constructor<Mixin & Base>;
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
/**
 * Apply operator o to arguments
 * @param o
 * @param first the first argument should define the operator
 * @param rest
 */
export declare function op(o: Op, first: any, ...rest: any[]): any;
/**
 * a better type checking operator index
 */
export interface IndexRead<K, V> {
    [OperatorMethods.INDEX](k: K): V;
}
export declare function get<K, V>(obj: IndexRead<K, V>, k: K): V;
export interface IndexWrite<K, V> {
    [OperatorMethods.INDEX_EQ](k: K, v: V): any;
}
export declare function set<K, V>(obj: IndexWrite<K, V>, k: K, v: V): void;
export {};
