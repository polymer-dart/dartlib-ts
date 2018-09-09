export interface DartNumber extends Number {
    abs(): number;

    round(): number;

    floor(): number;

    readonly hashCode:number;

    compareTo(a:number):number;
}

export interface DartNumberConstructor extends NumberConstructor {
    new(a: number): DartNumber;

    (a: number): DartNumber;

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

    get hashCode():number {
        return this.valueOf()& 0x1FFFFFFF;
    }

    compareTo(a:number):number {
        if (this.valueOf()<a) return -1;
        if (this.valueOf()>a) return +1;
        return 0;
    }

};

// @ts-ignore
export const DartNumber: DartNumberConstructor = function(n:number) {
    return new _DartNumber(n);
};

// @ts-ignore
DartNumber.prototype=_DartNumber.prototype;
// TODO : different number classes for int  / double etc.
