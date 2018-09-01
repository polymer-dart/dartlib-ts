import {DartEfficientLengthIterable} from "../collections";

describe('DartList', () => {
    it ('can create an evvicient length',()=>{
        let abstract = new DartEfficientLengthIterable();
        expect(abstract).not.toHaveProperty('length');
    });
/*
    it('has working constructor', () => {
        let list = new DartList<string>();
        expect(list).not.toBeNull();
        expect(list.length).toEqual(0);
    })*/
});