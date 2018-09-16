import {DartHashMap, DartIterable, DartIterator, DartList, DartMap, DartObject, DartSet, DartStringBuffer, iter} from "../core";
import {DartClass, EQUALS_OPERATOR, int, num, Op, Operator, OPERATOR_INDEX} from "../utils";


@DartClass
class MyObj extends DartObject {
    key: int;

    constructor(key: int) {
        super();
        this.key = key;
    }


    @Operator(Op.EQUALS)
    eq(other: any) {
        return (other as MyObj).key == this.key;
    }

    get hashCode() {
        return this.key;
    }
}


class MyObjBadHash extends DartObject {
    key: int;

    constructor(key: int) {
        super();
        this.key = key;
    }

    [EQUALS_OPERATOR](other: any) {
        return (other as MyObj).key == this.key;
    }

    get hashCode() {
        return this.key % 3;
    }
}

class MyObjId extends DartObject {
    key: int;

    constructor(key: int) {
        super();
        this.key = key;
    }
}

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

        let sum = list2.fold(0, (prev, cur) => prev + cur);

        expect(sum).toEqual(120);

        expect(list2.reduce((a, b) => a + b)).toEqual(120);

    });

    it('join works', () => {
        let list = new DartList.generate(10, (i) => `${i}`);
        let str = list.join(' , ');
        expect(str).toEqual("0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9");

    });

    it('fromArray constructor works', () => {
        let l = new DartList.fromArray(['a', 'b', 'c']);
        expect(l.length).toEqual(3);
        expect(l[0]).toEqual('a');
        expect(l[OPERATOR_INDEX](1)).toEqual('b');
    });

    it('maps works', () => {
        let l = new DartList.fromArray([1, 2, 3]).map((x) => x * 100).toList();

        expect(l.length).toEqual(3);
        expect(l[1]).toEqual(200);
    });

    it('expand works', () => {
        let x = new DartList.literal(1, 2, 3).expand((n) => new DartList.literal(`${n}a`, `${n}b`)).toList();
        expect(x.length).toEqual(6);
        expect(x.join(',')).toEqual('1a,1b,2a,2b,3a,3b');
    });

});

describe('DartMap', () => {
    it('works in serveral ways', () => {
        let map1 = new DartMap<string, any>();
        map1.set('one', 'uno');
        map1.set('two', 'due');
        map1.set('three', 'tre');

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
            expect(map2.get(k).num).toEqual(I++);
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
            expect(map2.get(k).num).toEqual(n);
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
            expect(map.get(k)).toEqual(k.key);
        }
    });

    it('works with dart objects keys', () => {


        let map = new DartHashMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObjId(i)
        });

        expect(map.length).toEqual(5);

        for (let k of map.keys) {
            expect(map.get(k)).toEqual(k.key);
        }
    });

    it('works with dart objects also list', () => {


        let map = new DartMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObjId(i)
        });

        expect(map.length).toEqual(5);

        for (let k of map.keys) {
            expect(map.get(k)).toEqual(k.key);
        }
    });

    it('works with custom dart objects also list', () => {

        let map = new DartMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObj(i);
            expect(map.get(k)).toEqual(i);
        }

        // Replace works
        map.set(new MyObj(2), 100);
        expect(map.get(new MyObj(2))).toEqual(100);
    });

    it('works with custom dart objects also list badhas', () => {

        let map = new DartMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObjBadHash(i)
        });

        expect(map.length).toEqual(5);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObjBadHash(i);
            expect(map.get(k)).toEqual(i);
        }

        // Replace works
        map.set(new MyObjBadHash(2), 100);
        expect(map.get(new MyObjBadHash(2))).toEqual(100);
    });

    it('works with custom dart objects also list (hash)', () => {

        let map: DartMap<MyObj, int> = new DartHashMap.fromIterable(new DartList.generate(5, (i) => i), {
            key: (i) => new MyObj(i)
        });

        expect(map.length).toEqual(5);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObj(i);
            expect(map.get(k)).toEqual(i);
        }

        // Replace works
        map.set(new MyObj(2), 100);
        expect(map.get(new MyObj(2))).toEqual(100);
    });

    it('works with custom dart objects also list (badhash)', () => {

        let map: DartMap<MyObjBadHash, int> = new DartHashMap.fromIterable(new DartList.generate(10, (i) => i), {
            key: (i) => new MyObjBadHash(i)
        });

        expect(map.length).toEqual(10);

        for (let i = 0; i < map.length; i++) {
            let k = new MyObjBadHash(i);
            expect(map.get(k)).toEqual(i);
        }

        // Replace works
        map.set(new MyObjBadHash(2), 100);
        expect(map.get(new MyObjBadHash(2))).toEqual(100);
    });

    it('can be used with a generator',()=>{
        let it :DartIterable<string> = iter(function*(){
            for (let i=0;i<5;i++) {
                yield `String n.${i}`;
            }
        });

        let i :DartIterator<string> = it.iterator;

        let s:DartStringBuffer = new DartStringBuffer();
        while (i.moveNext()) {
            s.write(i.current);
        }

        expect(s.toString()).toEqual("String n.0String n.1String n.2String n.3String n.4");
    });

});

describe('DartSet', () => {
    it('basically works', () => {
        let set1 = new DartSet.from(new DartList.generate(5, (i) => new MyObj(i)));

        for (let i = 0; i < 5; i++) {
            expect(set1.contains(new MyObj(i)));
        }

        expect(set1.contains(new MyObj(set1.length))).not;
    });
});