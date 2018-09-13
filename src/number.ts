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
    new(a: number): DartNumber;

    (a: number): DartNumber;


}

export interface DartIntConstructor extends DartNumberConstructor {
    new(a: number): DartInt;

    (a: number): DartInt;

    parse(s: string): int;

}

// @ts-ignore
export const _DartNumber: DartNumberConstructor = class extends Number implements DartNumber {
    constructor(a) {
        super(a);
    }

    abs() {
        return Math.abs(this.valueOf());
    }

    round() {
        return Math.round(this.valueOf());
    }

    floor() {
        return Math.floor(this.valueOf());
    }

    get hashCode(): number {
        return this.valueOf() & 0x1FFFFFFF;
    }

    get isNaN(): bool {
        return isNaN(this.valueOf());
    }

    compareTo(a: number): number {
        if (this.valueOf() < a) return -1;
        if (this.valueOf() > a) return +1;
        return 0;
    }

};

// @ts-ignore
const _DartInt: DartIntConstructor = class extends DartNumber implements DartInt {
    static parse(s: string): int {
        return new Number(s).valueOf();
    }

    remainder(n: int): int {
        return this.valueOf() % n;
    }
}

// @ts-ignore
export const DartNumber: DartNumberConstructor = function (n: number) {
    return new _DartNumber(n);
};

// @ts-ignore
DartNumber.prototype = _DartNumber.prototype;
// TODO : different number classes for int  / double etc.

// @ts-ignore
export const DartInt: DartIntConstructor = function (n: number) {
    return new _DartInt(n);
};
// @ts-ignore
DartInt.prototype = _DartInt.prototype;
