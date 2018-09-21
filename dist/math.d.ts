import { OperatorMethods, double } from "./utils";
export declare var min: <T extends number>(a: T, b: T) => T;
export declare var max: <T extends number>(a: T, b: T) => T;
export declare var atan2: (a: number, b: number) => double;
export declare var pow: (x: number, exponent: number) => number;
export declare var sin: (radians: number) => double;
export declare var cos: (radians: number) => double;
export declare var tan: (radians: number) => double;
export declare var acos: (x: number) => double;
export declare var asin: (x: number) => double;
export declare var atan: (x: number) => double;
export declare var sqrt: (x: number) => double;
export declare var exp: (x: number) => double;
export declare var log: (x: number) => double;
export declare class _JenkinsSmiHash {
    static combine(hash: number, value: number): number;
    static finish(hash: number): number;
    static hash2(a: any, b: any): number;
    static hash4(a: any, b: any, c: any, d: any): number;
}
export declare class Point<T extends number> {
    x: T;
    y: T;
    constructor(x: T, y: T);
    Point(x: T, y: T): void;
    toString(): string;
    [OperatorMethods.EQUALS](other: any): boolean;
    readonly hashCode: number;
    [OperatorMethods.PLUS](other: Point<T>): Point<T>;
    [OperatorMethods.MINUS](other: Point<T>): Point<T>;
    [OperatorMethods.MULTIPLY](factor: number): Point<T>;
    readonly magnitude: double;
    distanceTo(other: Point<T>): double;
    squaredDistanceTo(other: Point<T>): T;
}
export declare class Random {
    constructor(seed?: number);
    static _Random(seed?: number): Random;
    static _secure(): Random;
    static secure: new () => Random;
    nextInt(max: number): number;
    nextDouble(): double;
    nextBool(): boolean;
}
export declare class _RectangleBase<T extends number> {
    constructor();
    _RectangleBase(): void;
    readonly left: T;
    readonly top: T;
    readonly width: T;
    readonly height: T;
    readonly right: T;
    readonly bottom: T;
    toString(): string;
    [OperatorMethods.EQUALS](other: any): boolean;
    readonly hashCode: number;
    intersection(other: Rectangle<T>): Rectangle<T>;
    intersects(other: Rectangle<number>): boolean;
    boundingBox(other: Rectangle<T>): Rectangle<T>;
    containsRectangle(another: Rectangle<number>): boolean;
    containsPoint(another: Point<number>): boolean;
    readonly topLeft: Point<T>;
    readonly topRight: Point<T>;
    readonly bottomRight: Point<T>;
    readonly bottomLeft: Point<T>;
}
export declare class Rectangle<T extends number> extends _RectangleBase<T> {
    left: T;
    top: T;
    width: T;
    height: T;
    constructor(left: T, top: T, width: T, height: T);
    Rectangle(left: T, top: T, width: T, height: T): void;
    static _fromPoints<T extends number>(a: Point<T>, b: Point<T>): Rectangle<T>;
    static fromPoints: new <T extends number>(a: Point<T>, b: Point<T>) => Rectangle<T>;
}
export declare class MutableRectangle<T extends number> extends _RectangleBase<T> implements Rectangle<T> {
    left: T;
    top: T;
    _width: T;
    _height: T;
    constructor(left: T, top: T, width: T, height: T);
    MutableRectangle(left: T, top: T, width: T, height: T): void;
    static _fromPoints<T extends number>(a: Point<T>, b: Point<T>): MutableRectangle<T>;
    static fromPoints: new <T extends number>(a: Point<T>, b: Point<T>) => MutableRectangle<T>;
    width: T;
    height: T;
    Rectangle(left: T, top: T, width: T, height: T): void;
}
export declare var _clampToZero: <T extends number>(value: T) => T;
export declare class _Properties {
    E: double;
    LN10: double;
    LN2: double;
    LOG2E: double;
    LOG10E: double;
    PI: double;
    SQRT1_2: double;
    SQRT2: double;
}
export declare const properties: _Properties;
