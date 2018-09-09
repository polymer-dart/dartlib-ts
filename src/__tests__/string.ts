import {DartString} from "../string";
import {DartList, JSArray} from "../core";
import {$with, int} from "../utils";

describe("DartString", () => {
    it('creates a dart string', () => {
        let x: DartString = new DartString("Ciao");

        expect(x).toBeInstanceOf(DartString);
        expect(Object.getPrototypeOf(x)).toBeInstanceOf(String);
        expect(x.valueOf()).toEqual('Ciao');
    });

    it('behaves like a string', () => {
        let x: DartString = new DartString('Ciao');

        let y = x + " pluto";

        expect(y).toEqual('Ciao pluto');
    });

    it('knows when it\'s empty', () => {
        let x: DartString = new DartString('');

        expect(x.isEmpty).toBe(true);
    });

    it('knows when it\'s not empty', () => {
        let x: DartString = new DartString('ciao');

        expect(x.isEmpty).toBe(false);
    });

    it('knows its length', () => {
        let x: DartString = new DartString('ciao');

        expect(x.length).toEqual('ciao'.length);
    });

    it('has charcodes constructor', () => {
        let x: DartString = new DartString.fromCharCodes(
            $with(new DartList<int>(),
            (l) => l.add(65),
            (l) => l.add(66)));
        expect(x).toEqual('AB');
    });

    it('has charcode constructor', () => {
        let x: DartString = new DartString.fromCharCode(65);
        expect(x).toEqual('A');
    });

    it('from charcodes constructor is still a string', () => {
        let x: DartString = new DartString.fromCharCodes(
            $with(new DartList<int>(),
                (l) => l.add(65),
                (l) => l.add(66)));
        let y = x + "CD";
        expect(y).toEqual('ABCD');
    });
});