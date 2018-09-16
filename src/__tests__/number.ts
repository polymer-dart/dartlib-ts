import {DartNumber, DartInt, DartDouble} from "../core";
import {op, Op} from "../utils";

describe('numbers', () => {
    it('creates dart numbers', () => {
        let x = new DartNumber(10);
        expect(x).not.toBeNull();
    });

    it('has added method', () => {
        let x = new DartNumber(-10);
        expect(x.abs()).toEqual(10);
    });

    it('behaves like a number', () => {
        let x: any = new DartNumber(10);
        let y = 5 + x;
        expect(y).toEqual(15);
    });

    it('parses an int', () => {
        expect(DartInt.parse('12345')).toEqual(12345);
    });

    it('parses a double', () => {
        expect(DartDouble.parse('123.456')).toEqual(123.456);
    });

    it('parses a num', () => {
        expect(DartNumber.parse('1234.56')).toEqual(1234.56);
    });

    it('works with operator', () => {
        expect(op(Op.PLUS, new DartNumber(10), 20)).toEqual(30);
    });

});