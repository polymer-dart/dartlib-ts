import {DartList} from "../core";
import {Endianness, Int8List} from "../typed_data";
import {Op, op} from "../utils";

describe('typed_data',()=>{
    it('at least can create something',()=>{
        let int8List = new Int8List.fromList(new DartList.generate(16,(i)=>i));

        expect(int8List).not.toBeNull();
        expect(op(Op.INDEX,int8List,0)).toEqual(0);
        expect(op(Op.INDEX,int8List,1)).toEqual(1);
        expect(op(Op.INDEX,int8List,9)).toEqual(9);
        expect(int8List[9]).toEqual(9);
        expect(int8List.buffer).not.toBeNull();
        expect(int8List.length).toEqual(16);

        let int32List = int8List.buffer.asInt32List();

        expect(int32List.length).toEqual(4);
        expect(int32List[0]).toEqual(0x03020100);
        expect(int32List[1]).toEqual(0x07060504);
        expect(int32List[2]).toEqual(0x0b0a0908);
        expect(int32List[3]).toEqual(0x0f0e0d0c);

        let int16List = int32List.buffer.asInt16List();

        expect(int16List.length).toEqual(8);
        expect(int16List[1]).toEqual(0x0302);

        let byteData = int8List.buffer.asByteData();
        expect(byteData.getInt16(1)).toEqual(0x0102);
        expect(byteData.getInt16(1,Endianness.LITTLE_ENDIAN)).toEqual(0x0201);

    });
});