import {int, DartIterable} from "./core";

export const VALUEOF: unique symbol = Symbol('valueOf');

export interface DartString extends String {
    readonly isEmpty: boolean;
    [VALUEOF]: string;

}

export interface FromCharCodeConstructor {
    new(charCode: int): DartString;

    (...codes: number[]): string;
}

export interface DartStringConstructor extends StringConstructor {
    new(value?: any): DartString;

    (value?: any): string;

    readonly prototype: DartString;

    fromCharCodes: new(charCodes: DartIterable<int>, start?: int /* = 0*/, end?: int) => DartString;

    fromCharCode: FromCharCodeConstructor;

}


export const DartString: DartStringConstructor = function (this: DartString, arg?: any) {
    if (this instanceof DartString) {
        // Call String
        let res = String.call(this, arg);
        //console.log(`RES: ${res}`);
        this[VALUEOF] = String(arg);
    } else {
        return arg;
    }
} as DartStringConstructor;

(DartString as any).prototype = Object.create(String.prototype);
Object.defineProperty(DartString.prototype, 'isEmpty', {
    get: function (this: DartString) {
        return this.length == 0;
    }
});
Object.defineProperty(DartString.prototype, 'valueOf', {
    get: function (this: DartString) {
        return function (this: DartString) {
            return this[VALUEOF];
        };
    }
});
Object.defineProperty(DartString.prototype, 'toString', {
    get: function (this: DartString) {
        return function (this: DartString) {
            return this[VALUEOF];
        };
    }
});
Object.defineProperty(DartString.prototype, 'length', {
    get: function (this: DartString) {
        return this[VALUEOF].length;
    }
});