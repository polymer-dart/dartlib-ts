// @ts-ignore
export const _DartNumber = class extends Number {
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
    get hashCode() {
        return this.valueOf() & 0x1FFFFFFF;
    }
    get isNaN() {
        return isNaN(this.valueOf());
    }
    compareTo(a) {
        if (this.valueOf() < a)
            return -1;
        if (this.valueOf() > a)
            return +1;
        return 0;
    }
};
// @ts-ignore
const _DartInt = class extends _DartNumber {
    static parse(s) {
        return new Number(s).valueOf();
    }
    remainder(n) {
        return this.valueOf() % n;
    }
};
// @ts-ignore
export const DartNumber = function (n) {
    return new _DartNumber(n);
};
// @ts-ignore
DartNumber.prototype = _DartNumber.prototype;
// TODO : different number classes for int  / double etc.
// @ts-ignore
export const DartInt = function (n) {
    return new _DartInt(n);
};
// @ts-ignore
DartInt.prototype = _DartInt.prototype;
//# sourceMappingURL=number.js.map