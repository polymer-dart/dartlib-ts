import {DartList} from "../collections";

describe('DartList', () => {
    it('has working constructor', () => {
        let list = new DartList<string>();
        expect(list).not.toBeNull();
        expect(list.length).toEqual(0);
    })
});