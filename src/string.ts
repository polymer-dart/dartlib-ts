import {DartIterable} from "./core";
import {DartClass, int, namedFactory} from "./utils";

export interface DartString extends String {
    readonly isEmpty: boolean;

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


// @ts-ignore
export const DartString: DartStringConstructor = function (s: string) {
    return new _DartString(s);
};

@DartClass
class _DartString extends String implements DartString {
    constructor(s: string) {
        super(s);
    }

    get isEmpty(): boolean {
        return this.length === 0;
    }

    @namedFactory
    protected static _fromCharCodes(charCodes: DartIterable<int>, start?: int /* = 0*/, end?: int): _DartString {
        start = start || 0;
        end = end || charCodes.length;
        let l = charCodes.toList().sublist(start, end);
        return new DartString(String.fromCharCode(...l));
    }

    @namedFactory
    protected static _fromCharCode(charCode: int): _DartString {
        return new DartString(String.fromCharCode(charCode));
    }

}

// @ts-ignore
DartString.prototype = _DartString.prototype;
Object.setPrototypeOf(DartString,_DartString);