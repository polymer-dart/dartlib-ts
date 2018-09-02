import * as _ext from '../extensions';
import {installDartExtensions} from "../extensions";

describe('Extensions', () => {
    beforeAll(()=>{

    });

    it.skip('can be used on a normal array', () => {
        installDartExtensions();
        let arr = [1, 2, 3];
        arr.add(10);
        expect(arr.length).toEqual(4);
    });
});