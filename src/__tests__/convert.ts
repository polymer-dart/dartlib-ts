import {properties} from "../convert";
import {is} from "../_common";
import {DartList, DartMap} from "../core";
import {Op, op} from "../utils";

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

    it('Works with fromJsonMap', () => {
        const fromJSONMap: (json: any, translator: (dynamic: any) => any) => DartMap<any, any> = (json: any, translator: (dynamic: any) => any): DartMap<any, any> => {
            if (op(Op.EQUALS, json, null) || !(is(json, DartMap))) {
                return null;
            }
            return new DartMap.fromIterable((json as DartMap<any, any>).keys, {
                key: (k: any) => {
                    return k;
                }, value: (k: any) => {
                    return translator(json.get(k));
                }
            });
        };

        const json = properties.JSON.decode('{ "key1":5,"key2":6}');
        const res = fromJSONMap(json, n => n + 1);

        expect(res.get('key1')).toEqual(6);
        expect(res.get('key2')).toEqual(7);
    });

});