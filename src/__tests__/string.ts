import {DartString} from "../string";

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
});