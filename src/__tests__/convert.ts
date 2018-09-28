import {properties} from "../convert";
import {is} from "../_common";
import {DartList, DartMap} from "../core";

describe('convert', () => {
    it('decodes some json', () => {
        let result: DartMap<string, any> = properties.JSON.decode('{ "field1" : "value1" }');
        expect(result).not.toBeNull();
        expect(is(result, DartMap)).toBe(true);
        expect(result.containsKey('field1')).toBe(true);
        expect(result.get('field1')).toEqual('value1');

        let encoded = properties.JSON.encode(result);
        expect(encoded).toEqual("{\"field1\":\"value1\"}");

        let anotherMap = new DartMap.literal([
            ['field1', 'value1']
        ]);

        let encoded2 = properties.JSON.encode(anotherMap);
        expect(encoded2).toEqual("{\"field1\":\"value1\"}");

    });

    it('decodes more comples json', () => {

        let result: DartMap<string, any> = properties.JSON.decode('{ "field1" : { "list1" : [ "value",123,null,{ "f1":"vale"}]}}');
        expect(result).not.toBeNull();
        expect(is(result, DartMap)).toBe(true);
        expect(properties.JSON.encode(result)).toEqual('{"field1":{"list1":["value",123,null,{"f1":"vale"}]}}');
    });

    it('works with "toJson()" ?', () => {
        class Thing {
            toJson() {
                return new DartMap.literal([
                    ['field1', 'value1']
                ]);
            }
        }

        let thing = new Thing();

        let encode = properties.JSON.encode(thing);

        expect(encode).toEqual("{\"field1\":\"value1\"}");


    });

    it('encodes utf8', () => {
        let res = properties.UTF8.encode("Hello!");
        expect(res.toString()).toEqual("[72, 101, 108, 108, 111, 33]");
    });

    it('decodes utf8', () => {
        let res = properties.UTF8.decode(new DartList.literal(72, 101, 108, 108, 111, 33));
        expect(res).toEqual("Hello!");
    });

});