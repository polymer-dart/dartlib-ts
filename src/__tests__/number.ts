import {DartNumber} from "../core";

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

});