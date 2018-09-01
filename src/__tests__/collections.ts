import {DartHashMap, DartList, DartMap, DartObject, int, num, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {EQUALS_OPERATOR} from "../_common";

describe('DartList', () => {
    it('can create an list ', () => {
        let list = new DartList<number>();
        list.add(10);
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(10);
        expect(list[OPERATOR_INDEX](0)).toEqual(10);
    });

    it('you can iterate on a list ', () => {
        let list = new DartList<number>();
        list.add(10);
        let done = false;
        for (let i of list) {
            expect(i).toEqual(10);
            done = true;
        }
        expect(done);

        done = false;
        let it = list.iterator;
        while (it.moveNext()) {
            done = true;
            expect(it.current).toEqual(10);
        }
        expect(done);
    });

    it('add remove etc.', () => {
        let list1 = new DartList<num>();
        list1.add(10);
        list1.add(20);
        list1.add(30);

        expect(list1.length).toEqual(3);

        let list2 = new DartList<num>();

        list2.addAll(list1);
        expect(list2.length).toEqual(3);

        let it1 = list1.iterator;
        let it2 = list2.iterator;

        while (it1.moveNext() && it2.moveNext()) {
            expect(it1.current).toEqual(it2.current);
        }

        list2.insertAll(1, list1);
        expect(list2.length).toEqual(6);
        let list3 = list2.sublist(1, 4).toList();
        expect(list3.length).toEqual(3);


        it1 = list3.iterator;
        it2 = list1.iterator;

        while (it1.moveNext() && it2.moveNext()) {
            expect(it1.current).toEqual(it2.current);
        }

        expect(list3.indexOf(30)).toEqual(2);
        expect(list3.indexOf(20)).toEqual(1);
        expect(list3.lastIndexOf(10)).toEqual(0);


        let list4 = new DartList.generate<any>(10, (i) => {
            return {
                num: i
            }
        });

        expect(list4.length).toEqual(10);

        for (let i = 0; i < list4.length; i++) {
            expect(list4[i].num).toEqual(i);
            expect(list4.indexOf(list4[i])).toEqual(i);
            expect(list4.lastIndexOf(list4[i])).toEqual(i);
        }

    });

});

describe('DartMap', () => {
    it('works in serveral ways', () => {
        let map1 = new DartMap<string, any>();
        map1[OPERATOR_INDEX_ASSIGN]('one', 'uno');
        map1[OPERATOR_INDEX_ASSIGN]('two', 'due');
        map1[OPERATOR_INDEX_ASSIGN]('three', 'tre');

        expect(map1.length).toEqual(3);

        let gen = new DartList.generate(20, (i) => i);
        let map2 = new DartMap.fromIterable(gen, {
            key: (i) => `string ${i}`,
            value: (i) => {
                return {num: i};
            }
        });

        expect(map2.length).toEqual(20);

        let I = 0;
        for (let k of map2.keys) {
            expect(map2[OPERATOR_INDEX](k).num).toEqual(I++);
        }
        expect(I).toEqual(20);

        I = 0;
        for (let v of map2.values) {
            expect(v.num).toEqual(I++);
        }
        expect(I).toEqual(20);

        for (let n of gen) {
            let k = `string ${n}`;
            expect(map2.containsKey(k));
            expect(map2[OPERATOR_INDEX](k).num).toEqual(n);
        }

        let str = map2.toString();
        expect(str).toEqual("{string 0: [object Object], string 1: [object Object], string 2: [object Object], string 3: [object Object], string 4: [object Object], string 5: [object Object], string 6: [object Object], string 7: [object Object], string 8: [object Object], string 9: [object Object], string 10: [object Object], string 11: [object Object], string 12: [object Object], string 13: [object Object], string 14: [object Object], string 15: [object Object], string 16: [object Object], string 17: [object Object], string 18: [object Object], string 19: [object Object]}");

    });

    it('works with strange keys', () => {

        let map = new DartHashMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => {
                return {
                    key: i
                }
            }
        });

        expect(map.length).toEqual(5);

        for (let k of map.keys) {
            expect(map[OPERATOR_INDEX](k)).toEqual(k.key);
        }
    });

    it('works with dart objects keys', () => {

        class MyObj extends DartObject {
            key: int;

            constructor(key: int) {
                super();
                this.key = key;
            }
        }

        let map = new DartHashMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let k of map.keys) {
            expect(map[OPERATOR_INDEX](k)).toEqual(k.key);
        }
    });

    it('works with dart objects also list', () => {

        class MyObj extends DartObject {
            key: int;

            constructor(key: int) {
                super();
                this.key = key;
            }
        }

        let map = new DartMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let k of map.keys) {
            expect(map[OPERATOR_INDEX](k)).toEqual(k.key);
        }
    });

    it('works with custom dart objects also list', () => {

        class MyObj extends DartObject {
            key: int;

            constructor(key: int) {
                super();
                this.key = key;
            }

            [EQUALS_OPERATOR](other: any) {
                return (other as MyObj).key == this.key;
            }

            get hashCode() {
                return this.key;
            }
        }

        let map = new DartMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObj(i);
            expect(map[OPERATOR_INDEX](k)).toEqual(i);
        }
    });

    it('works with custom dart objects also list (hash)', () => {

        class MyObj extends DartObject {
            key: int;

            constructor(key: int) {
                super();
                this.key = key;
            }

            [EQUALS_OPERATOR](other: any) {
                return (other as MyObj).key == this.key;
            }

            get hashCode() {
                return this.key;
            }
        }

        let map: DartMap<MyObj, int> = new DartHashMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObj(i);
            expect(map[OPERATOR_INDEX](k)).toEqual(i);
        }
    });

});