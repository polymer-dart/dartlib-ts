import {properties} from "../convert";
import {is} from "../_common";
import {DartMap} from "../core";

describe('convert',()=>{
    it('decodes some json',()=>{
        let result:DartMap<string,any> = properties.JSON.decode('{ "field1" : "value1" }');
        expect(result).not.toBeNull();
        expect(is(result,DartMap)).toBe(true);
        expect(result.containsKey('field1')).toBe(true);
        expect(result.get('field1')).toEqual('value1');

        let encoded = properties.JSON.encode(result);
        expect(encoded).toEqual("{\"field1\":\"value1\"}");

        let anotherMap = new DartMap.literal([
            ['field1','value1']
        ]);

        let encoded2 = properties.JSON.encode(anotherMap);
        expect(encoded2).toEqual("{\"field1\":\"value1\"}");

    });


});