import {DartRegExp} from "../core";

describe('regexp', () => {
    it('works like a charm', () => {
        let re = new DartRegExp('a+b+', {caseSensitive: false});
        let m = re.allMatches('aabbbb');
        expect(m).not.toBeNull;
        let len = 0;
        for (let mm of m) {
            len++;
            expect(mm.group(0)).toEqual('aabbbb');
        }
        expect(len).toEqual(1);
    });
});