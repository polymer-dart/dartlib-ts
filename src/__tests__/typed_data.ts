import {DartList} from "../core";
import {Int8List} from "../typed_data";

describe('typed_data',()=>{
    it('at least can create something',()=>{
        let int8List = new Int8List.fromList(new DartList.generate(10,(i)=>i));
        expect(int8List).not.toBeNull();
    });
});