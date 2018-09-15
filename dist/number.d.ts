import { int, bool } from "./utils";
export interface DartNumber extends Number {
    abs(): number;
    round(): number;
    floor(): number;
    readonly hashCode: number;
    compareTo(a: number): number;
    readonly isNaN: bool;
}
export interface DartInt extends DartNumber {
    remainder(n: int): int;
}
export interface DartNumberConstructor extends NumberConstructor {
    new (a: number): DartNumber;
    (a: number): DartNumber;
}
export interface DartIntConstructor extends DartNumberConstructor {
    new (a: number): DartInt;
    (a: number): DartInt;
    parse(s: string): int;
}
export declare const _DartNumber: DartNumberConstructor;
export declare const DartNumber: DartNumberConstructor;
export declare const DartInt: DartIntConstructor;
