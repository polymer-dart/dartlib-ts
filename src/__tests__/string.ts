import {DartList, JSArray, DartString, DartIterable, DartStringMatch} from "../core";
import {is} from "../_common";

describe("DartString", () => {
    it('creates a dart string', () => {
        let x: DartString = new DartString("Ciao");
        expect(x).toBeInstanceOf(String);
        expect(is(x, DartString)).toBe(true);
        expect(x.valueOf()).toEqual('Ciao');
        expect(x).toEqual('Ciao');
    });

    it('works with compare', () => {
        let a1 = new DartString('aaa');
        let a2 = new DartString('bbbb');

        expect(a1.compareTo(a2)).toEqual(-1);
        expect(a2.compareTo(a1)).toEqual(1);
        expect(a1.compareTo(a1)).toEqual(0);

        expect(a1 < a2).toBe(true);
        // @ts-ignore
        expect(a1 == 'aaa').toBe(true);
        // @ts-ignore
        expect(a1 === 'aaa').toBe(false);

        expect(a1.hashCode).toEqual(122684140);
    });

    it('codeunits', () => {
        let s = new DartString('some');
        expect(s.codeUnits.join(',')).toEqual('115,111,109,101');
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
        let x: DartString = new DartString.fromCharCodes(new DartList.literal(65, 66));
        expect(x).toEqual('AB');
    });

    it('has charcode constructor', () => {
        let x: DartString = new DartString.fromCharCode(65);
        expect(x).toEqual('A');
    });

    it('from charcodes constructor is still a string', () => {
        let x: DartString = new DartString.fromCharCodes(new DartList.literal(65, 66));
        let y = x + "CD";
        expect(y).toEqual('ABCD');

        expect(new DartString.fromCharCodes(new DartIterable.generate(10, (i) => 65 + i))).toEqual('ABCDEFGHIJ')
    });

    it('find stuf', () => {
        let s = new DartString('Hello Man!');
        expect(s.indexOf(new DartString('Man'))).toEqual(6);

        let list = new DartString('Man').allMatches('' + s).toList();
        expect(list.length).toEqual(1);
        let m: DartStringMatch = list[0];
        expect(m.group(0)).toEqual('Man');
        expect(m.start).toEqual(6);
    });
});