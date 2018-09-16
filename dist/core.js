// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DartJsLinkedHashMap_1, _LinkedIdentityHashMap_1, DartConstantMap_1, DartHashMap_1, DartHashSet_1, DartLinkedHashSet_1, DartList_1, DartLinkedHashMap_1, DartListMixin_1, DartStringBuffer_1, DartMappedIterable_1, DartSkipIterable_1, DartEfficientLengthSkipIterable_1, RangeError_1, JSArray_1, DartStackTrace_1, DartDuration_1, DartDateTime_1, JSSyntaxRegExp_1, DartString_1, JSString_1, DartNumber_1, JSNumber_1, JSInt_1, DartDouble_1;
// Patch file for dart:collection classes.
import { Abstract, AbstractMethods, DartClass, defaultConstructor, defaultFactory, Implements, namedConstructor, namedFactory, Op, Operator, With, AbstractProperty } from "./utils";
import _dart, { divide, isNot, is, nullOr } from './_common';
import { OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN } from "./utils";
import { printToConsole, printToZone } from "./_internal";
const _USE_ES6_MAPS = true;
class _HashMap {
    constructor() {
        this._length = 0;
    }
    get length() {
        return this._length;
    }
    get isEmpty() {
        return this._length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    get keys() {
        return new _HashMapKeyIterable(this);
    }
    get values() {
        return new DartMappedIterable(this.keys, (each) => this[OPERATOR_INDEX](each));
    }
    containsKey(key) {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashMap._hasTableEntry(strings, key);
        }
        else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashMap._hasTableEntry(nums, key);
        }
        else {
            return this._containsKey(key);
        }
    }
    _containsKey(key) {
        let rest = this._rest;
        if (rest == null)
            return false;
        let bucket = this._getBucket(rest, key);
        return this._findBucketIndex(bucket, key) >= 0;
    }
    containsValue(value) {
        return this._computeKeys().any((each) => this[OPERATOR_INDEX](each) == value);
    }
    addAll(other) {
        other.forEach((key, value) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }
    [OPERATOR_INDEX](key) {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? null : _HashMap._getTableEntry(strings, key);
        }
        else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? null : _HashMap._getTableEntry(nums, key);
        }
        else {
            return this._get(key);
        }
    }
    _get(key) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        return (index < 0) ? null : bucket[index + 1] /* JS('var', '#[#]', bucket, index + 1)*/;
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            if (strings == null)
                this._strings = strings = _HashMap._newHashTable();
            this._addHashTableEntry(strings, key, value);
        }
        else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null)
                this._nums = nums = _HashMap._newHashTable();
            this._addHashTableEntry(nums, key, value);
        }
        else {
            this._set(key, value);
        }
    }
    _set(key, value) {
        let rest = this._rest;
        if (rest == null)
            this._rest = rest = _HashMap._newHashTable();
        let hash = this._computeHashCode(key);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashMap._setTableEntry(rest, hash, [key, value] /* JS('var', '[#, #]', key, value)*/);
            this._length++;
            this._keys = null;
        }
        else {
            let index = this._findBucketIndex(bucket, key);
            if (index >= 0) {
                bucket[index + 1] = value;
                /* JS('void', '#[#] = #', bucket, index + 1, value); */
            }
            else {
                bucket.push(key, value);
                /* JS('void', '#.push(#, #)', bucket, key, value); */
                this._length++;
                this._keys = null;
            }
        }
    }
    putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key))
            return this[OPERATOR_INDEX](key);
        let value = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }
    remove(key) {
        if (_HashMap._isStringKey(key)) {
            return this._removeHashTableEntry(this._strings, key);
        }
        else if (_HashMap._isNumericKey(key)) {
            return this._removeHashTableEntry(this._nums, key);
        }
        else {
            return this._remove(key);
        }
    }
    _remove(key) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        if (index < 0)
            return null;
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        this._length--;
        this._keys = null;
        // Use splice to remove the two [key, value] elements at the
        // index and return the value.
        return bucket.splice(index, 2)[1] /* JS('var', '#.splice(#, 2)[1]', bucket, index)*/;
    }
    clear() {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._keys = null;
            this._length = 0;
        }
    }
    forEach(action) {
        let keys = this._computeKeys();
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i] /* JS('var', '#[#]', keys, i)*/;
            action(key, this[OPERATOR_INDEX](key));
            if (keys !== this._keys /* JS('bool', '# !== #', keys, _keys)*/) {
                throw new ConcurrentModificationError(this);
            }
        }
    }
    _computeKeys() {
        if (this._keys != null)
            return this._keys;
        let result = new DartList(this._length);
        let index = 0;
        // Add all string keys to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /* JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let key = names[i] /* JS('String', '#[#]', names, i)*/;
                result[OPERATOR_INDEX_ASSIGN](index, key);
                /* JS('void', '#[#] = #', result, index, key);*/
                index++;
            }
        }
        // Add all numeric keys to the list.
        let nums = this._nums;
        if (nums != null) {
            var names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the keys back to numbers (+).
                let key = +names[i] /* JS('num', '+#[#]', names, i)*/;
                result[OPERATOR_INDEX_ASSIGN](index, key);
                /* JS('void', '#[#] = #', result, index, key);*/
                index++;
            }
        }
        // Add all the remaining keys to the list.
        var rest = this._rest;
        if (rest != null) {
            var names = Object.getOwnPropertyNames(rest) /* JS('var', 'Object.getOwnPropertyNames(#)', rest)*/;
            let entries = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let key = names[i] /* JS('String', '#[#]', names, i)*/;
                let bucket = rest[key] /* JS('var', '#[#]', rest, key)*/;
                let length = bucket.length /* JS('int', '#.length', bucket)*/;
                for (let i = 0; i < length; i += 2) {
                    let key = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
                    result[OPERATOR_INDEX_ASSIGN](index, key);
                    /* JS('void', '#[#] = #', result, index, key); */
                    index++;
                }
            }
        }
        //assert(index == _length);
        return this._keys = result;
    }
    _addHashTableEntry(table, key, value) {
        if (!_HashMap._hasTableEntry(table, key)) {
            this._length++;
            this._keys = null;
        }
        _HashMap._setTableEntry(table, key, value);
    }
    _removeHashTableEntry(table, key) {
        if (table != null && _HashMap._hasTableEntry(table, key)) {
            let value = _HashMap._getTableEntry(table, key);
            _HashMap._deleteTableEntry(table, key);
            this._length--;
            this._keys = null;
            return value;
        }
        else {
            return null;
        }
    }
    static _isStringKey(key) {
        return _dart.is(key, 'string') && key != '__proto__';
    }
    static _isNumericKey(key) {
        // Only treat unsigned 30-bit integers as numeric keys. This way,
        // we avoid converting them to strings when we use them as keys in
        // the JavaScript hash table object.
        return _dart.is(key, 'num') && (key & 0x3ffffff) === key /*JS('bool', '(# & 0x3ffffff) === #', key, key)*/;
    }
    _computeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return key.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', key.hashCode)*/;
    }
    static _hasTableEntry(table, key) {
        let entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }
    static _getTableEntry(table, key) {
        let entry = table[key] /* JS('var', '#[#]', table, key)*/;
        // We store the table itself as the entry to signal that it really
        // is a null value, so we have to map back to null here.
        return entry === table /*JS('bool', '# === #', entry, table)*/ ? null : entry;
    }
    static _setTableEntry(table, key, value) {
        // We only store non-null entries in the table, so we have to
        // change null values to refer to the table itself. Such values
        // will be recognized and mapped back to null on access.
        if (value == null) {
            // Do not update [value] with [table], otherwise our
            // optimizations could be confused by this opaque object being
            // now used for more things than storing and fetching from it.
            table[key] = table;
            /* JS('void', '#[#] = #', table, key, table); */
        }
        else {
            table[key] = value;
            /* JS('void', '#[#] = #', table, key, value);*/
        }
    }
    static _deleteTableEntry(table, key) {
        delete table[key];
        /* JS('void', 'delete #[#]', table, key); */
    }
    _getBucket(table, key) {
        let hash = this._computeHashCode(key);
        return table[hash] /* JS('var', '#[#]', table, hash) */;
    }
    _findBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (_dart.equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key))
                return i;
        }
        return -1;
    }
    static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        let table = Object.create(null) /* JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        let temporaryKey = '<non-identifier-key>';
        _HashMap._setTableEntry(table, temporaryKey, table);
        _HashMap._deleteTableEntry(table, temporaryKey);
        return table;
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
}
class _IdentityHashMap extends _HashMap {
    _computeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }
    _findBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (identical(bucket[i] /*JS('var', '#[#]', bucket, i)*/, key))
                return i;
        }
        return -1;
    }
}
class _CustomHashMap extends _HashMap {
    constructor(_equals, _hashCode, validKey) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((_) => true /*v is K*/);
    }
    [OPERATOR_INDEX](key) {
        if (!this._validKey(key))
            return null;
        return super._get(key);
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        super._set(key, value);
    }
    containsKey(key) {
        if (!this._validKey(key))
            return false;
        return super._containsKey(key);
    }
    remove(key) {
        if (!this._validKey(key))
            return null;
        return super._remove(key);
    }
    _computeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }
    _findBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (this._equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key))
                return i;
        }
        return -1;
    }
    toString() {
        return DartMaps.mapToString(this);
    }
}
/**
 * A collection of values, or "elements", that can be accessed sequentially.
 *
 * The elements of the iterable are accessed by getting an [Iterator]
 * using the [iterator] getter, and using it to step through the values.
 * Stepping with the iterator is done by calling [Iterator.moveNext],
 * and if the call returns `true`,
 * the iterator has now moved to the next element,
 * which is then available as [Iterator.current].
 * If the call returns `false`, there are no more elements,
 * and `iterator.current` returns `null`.
 *
 * You can create more than one iterator from the same `Iterable`.
 * Each time `iterator` is read, it returns a new iterator,
 * and different iterators can be stepped through independently,
 * each giving access to all the elements of the iterable.
 * The iterators of the same iterable *should* provide the same values
 * in the same order (unless the underlying collection is modified between
 * the iterations, which some collections allow).
 *
 * You can also iterate over the elements of an `Iterable`
 * using the for-in loop construct, which uses the `iterator` getter behind the
 * scenes.
 * For example, you can iterate over all of the keys of a [Map],
 * because `Map` keys are iterable.
 *
 *     Map kidsBooks = {'Matilda': 'Roald Dahl',
 *                      'Green Eggs and Ham': 'Dr Seuss',
 *                      'Where the Wild Things Are': 'Maurice Sendak'};
 *     for (var book in kidsBooks.keys) {
 *       print('$book was written by ${kidsBooks[book]}');
 *     }
 *
 * The [List] and [Set] classes are both `Iterable`,
 * as are most classes in the [dart:collection](#dart-collection) library.
 *
 * Some [Iterable] collections can be modified.
 * Adding an element to a `List` or `Set` will change which elements it
 * contains, and adding a new key to a `Map` changes the elements of [Map.keys].
 * Iterators created after the change will provide the new elements, and may
 * or may not preserve the order of existing elements
 * (for example, a [HashSet] may completely change its order when a single
 * element is added).
 *
 * Changing a collection *while* it is being iterated
 * is generally *not* allowed.
 * Doing so will break the iteration, which is typically signalled
 * by throwing a [ConcurrentModificationError]
 * the next time [Iterator.moveNext] is called.
 * The current value of [Iterator.current] getter
 * should not be affected by the change in the collection,
 * the `current` value was set by the previous call to [Iterator.moveNext].
 *
 * Some iterables compute their elements dynamically every time they are
 * iterated, like the one returned by [Iterable.generate] or the iterable
 * returned by a `sync*` generator function. If the computation doesn't depend
 * on other objects that may change, then the generated sequence should be
 * the same one every time it's iterated.
 *
 * The members of `Iterable`, other than `iterator` itself,
 * work by looking at the elements of the iterable.
 * This can be implemented by running through the [iterator], but some classes
 * may have more efficient ways of finding the result
 * (like [last] or [length] on a [List], or [contains] on a [Set]).
 *
 * The methods that return another `Iterable` (like [map] and [where])
 * are all *lazy* - they will iterate the original (as necessary)
 * every time the returned iterable is iterated, and not before.
 *
 * Since an iterable may be iterated more than once, it's not recommended to
 * have detectable side-effects in the iterator.
 * For methods like [map] and [where], the returned iterable will execute the
 * argument function on every iteration, so those functions should also not
 * have side effects.
 */
let DartIterable = class DartIterable {
    /**
     * A Dart Iterable is also a JS iterable and can be used in for loop syntax
     */
    [Symbol.iterator]() {
        return this.iterator;
    }
    /**
     * Creates an `Iterable` which generates its elements dynamically.
     *
     * The generated iterable has [count] elements,
     * and the element at index `n` is computed by calling `generator(n)`.
     * Values are not cached, so each iteration computes the values again.
     *
     * If [generator] is omitted, it defaults to an identity function
     * on integers `(int x) => x`, so it may only be omitted if the type
     * parameter allows integer values. That is, if [E] is one of
     * `int`, `num`, `Object` or `dynamic`.
     *
     * As an `Iterable`, `new Iterable.generate(n, generator))` is equivalent to
     * `const [0, ..., n - 1].map(generator)`.
     */
    static _generate(count, generator) {
        if (count <= 0)
            return new DartEmptyIterable();
        return new _GeneratorIterable(count, generator);
    }
    /**
     * Creates an empty iterable.
     *
     * The empty iterable has no elements, and iterating it always stops
     * immediately.
     */
    static _empty() {
        return new DartEmptyIterable();
    }
    /**
     * Returns a new `Iterator` that allows iterating the elements of this
     * `Iterable`.
     *
     * Iterable classes may specify the iteration order of their elements
     * (for example [List] always iterate in index order),
     * or they may leave it unspecified (for example a hash-based [Set]
     * may iterate in any order).
     *
     * Each time `iterator` is read, it returns a new iterator,
     * which can be used to iterate through all the elements again.
     * The iterators of the same iterable can be stepped through independently,
     * but should return the same elements in the same order,
     * as long as the underlying collection isn't changed.
     *
     * Modifying the collection may cause new iterators to produce
     * different elements, and may change the order of existing elements.
     * A [List] specifies its iteration order precisely,
     * so modifying the list changes the iteration order predictably.
     * A hash-based [Set] may change its iteration order completely
     * when adding a new element to the set.
     *
     * Modifying the underlying collection after creating the new iterator
     * may cause an error the next time [Iterator.moveNext] is called
     * on that iterator.
     * Any *modifiable* iterable class should specify which operations will
     * break iteration.
     */
    get iterator() {
        throw new Error('abstract');
    }
    /**
     * Returns a new lazy [Iterable] with elements that are created by
     * calling `f` on each element of this `Iterable` in iteration order.
     *
     * This method returns a view of the mapped elements. As long as the
     * returned [Iterable] is not iterated over, the supplied function [f] will
     * not be invoked. The transformed elements will not be cached. Iterating
     * multiple times over the returned [Iterable] will invoke the supplied
     * function [f] multiple times on the same element.
     *
     * Methods on the returned iterable are allowed to omit calling `f`
     * on any element where the result isn't needed.
     * For example, [elementAt] may call `f` only once.
     */
    map(f) {
        return new DartMappedIterable(this, f);
    }
    /**
     * Returns a new lazy [Iterable] with all elements that satisfy the
     * predicate [test].
     *
     * The matching elements have the same order in the returned iterable
     * as they have in [iterator].
     *
     * This method returns a view of the mapped elements.
     * As long as the returned [Iterable] is not iterated over,
     * the supplied function [test] will not be invoked.
     * Iterating will not cache results, and thus iterating multiple times over
     * the returned [Iterable] may invoke the supplied
     * function [test] multiple times on the same element.
     */
    where(test) {
        return new DartWhereIterable(this, test);
    }
    /**
     * Expands each element of this [Iterable] into zero or more elements.
     *
     * The resulting Iterable runs through the elements returned
     * by [f] for each element of this, in iteration order.
     *
     * The returned [Iterable] is lazy, and calls [f] for each element
     * of this every time it's iterated.
     *
     * Example:
     *
     *     var pairs = [[1, 2], [3, 4]];
     *     var flattened = pairs.expand((pair) => pair).toList();
     *     print(flattened); // => [1, 2, 3, 4];
     *
     *     var input = [1, 2, 3];
     *     var duplicated = input.expand((i) => [i, i]).toList();
     *     print(duplicated); // => [1, 1, 2, 2, 3, 3]
     *
     */
    expand(f) {
        return new DartExpandIterable(this, f);
    }
    /**
     * Returns true if the collection contains an element equal to [element].
     *
     * This operation will check each element in order for being equal to
     * [element], unless it has a more efficient way to find an element
     * equal to [element].
     *
     * The equality used to determine whether [element] is equal to an element of
     * the iterable defaults to the [Object.==] of the element.
     *
     * Some types of iterable may have a different equality used for its elements.
     * For example, a [Set] may have a custom equality
     * (see [Set.identity]) that its `contains` uses.
     * Likewise the `Iterable` returned by a [Map.keys] call
     * should use the same equality that the `Map` uses for keys.
     */
    contains(element) {
        for (let e of this) {
            if (e == element)
                return true;
        }
        return false;
    }
    /**
     * Applies the function [f] to each element of this collection in iteration
     * order.
     */
    forEach(f) {
        for (let element of this)
            f(element);
    }
    /**
     * Reduces a collection to a single value by iteratively combining elements
     * of the collection using the provided function.
     *
     * The iterable must have at least one element.
     * If it has only one element, that element is returned.
     *
     * Otherwise this method starts with the first element from the iterator,
     * and then combines it with the remaining elements in iteration order,
     * as if by:
     *
     *     E value = iterable.first;
     *     iterable.skip(1).forEach((element) {
     *       value = combine(value, element);
     *     });
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.reduce((value, element) => value + element);
     *
     */
    reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
            value = combine(value, iterator.current);
        }
        return value;
    }
    /**
     * Reduces a collection to a single value by iteratively combining each
     * element of the collection with an existing value
     *
     * Uses [initialValue] as the initial value,
     * then iterates through the elements and updates the value with
     * each element using the [combine] function, as if by:
     *
     *     var value = initialValue;
     *     for (E element in this) {
     *       value = combine(value, element);
     *     }
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.fold(0, (prev, element) => prev + element);
     *
     */
    fold(initialValue, combine) {
        let value = initialValue;
        for (let element of this)
            value = combine(value, element);
        return value;
    }
    /**
     * Checks whether every element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `false` if
     * any of them make [test] return `false`, otherwise returns `true`.
     */
    every(f) {
        for (let element of this) {
            if (!f(element))
                return false;
        }
        return true;
    }
    /**
     * Converts each element to a [String] and concatenates the strings.
     *
     * Iterates through elements of this iterable,
     * converts each one to a [String] by calling [Object.toString],
     * and then concatenates the strings, with the
     * [separator] string interleaved between the elements.
     */
    join(separator /* = ""*/) {
        separator = separator || "";
        let iterator = this.iterator;
        if (!iterator.moveNext())
            return "";
        let buffer = new DartStringBuffer();
        if (separator == null || separator == "") {
            do {
                buffer.write("${iterator.current}");
            } while (iterator.moveNext());
        }
        else {
            buffer.write("${iterator.current}");
            while (iterator.moveNext()) {
                buffer.write(separator);
                buffer.write("${iterator.current}");
            }
        }
        return buffer.toString();
    }
    /**
     * Checks whether any element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `true` if
     * any of them make [test] return `true`, otherwise returns false.
     */
    any(f) {
        for (let element of this) {
            if (f(element))
                return true;
        }
        return false;
    }
    /**
     * Creates a [List] containing the elements of this [Iterable].
     *
     * The elements are in iteration order.
     * The list is fixed-length if [growable] is false.
     */
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        return new DartList.from(this, {
            growable: growable
        });
    }
    /**
     * Creates a [Set] containing the same elements as this iterable.
     *
     * The set may contain fewer elements than the iterable,
     * if the iterable contains an element more than once,
     * or it contains one or more elements that are equal.
     * The order of the elements in the set is not guaranteed to be the same
     * as for the iterable.
     */
    toSet() {
        return new DartSet.from(this);
    }
    /**
     * Returns the number of elements in [this].
     *
     * Counting all elements may involve iterating through all elements and can
     * therefore be slow.
     * Some iterables have a more efficient way to find the number of elements.
     */
    get length() {
        let count = 0;
        let it = this.iterator;
        while (it.moveNext()) {
            count++;
        }
        return count;
    }
    /**
     * Returns `true` if there are no elements in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `false`.
     */
    get isEmpty() {
        return !this.iterator.moveNext();
    }
    /**
     * Returns true if there is at least one element in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `true`.
     */
    get isNotEmpty() {
        return !this.isEmpty;
    }
    /**
     * Returns a lazy iterable of the [count] first elements of this iterable.
     *
     * The returned `Iterable` may contain fewer than `count` elements, if `this`
     * contains fewer than `count` elements.
     *
     * The elements can be computed by stepping through [iterator] until [count]
     * elements have been seen.
     *
     * The `count` must not be negative.
     */
    take(count) {
        return new DartTakeIterable(this, count);
    }
    /**
     * Returns a lazy iterable of the leading elements satisfying [test].
     *
     * The filtering happens lazily. Every new iterator of the returned
     * iterable starts iterating over the elements of `this`.
     *
     * The elements can be computed by stepping through [iterator] until an
     * element is found where `test(element)` is false. At that point,
     * the returned iterable stops (its `moveNext()` returns false).
     */
    takeWhile(test) {
        return new DartTakeWhileIterable(this, test);
    }
    /**
     * Returns an [Iterable] that provides all but the first [count] elements.
     *
     * When the returned iterable is iterated, it starts iterating over `this`,
     * first skipping past the initial [count] elements.
     * If `this` has fewer than `count` elements, then the resulting Iterable is
     * empty.
     * After that, the remaining elements are iterated in the same order as
     * in this iterable.
     *
     * Some iterables may be able to find later elements without first iterating
     * through earlier elements, for example when iterating a [List].
     * Such iterables are allowed to ignore the initial skipped elements.
     *
     * The [count] must not be negative.
     */
    skip(count) {
        return new DartSkipIterable(this, count);
    }
    /**
     * Returns an `Iterable` that skips leading elements while [test] is satisfied.
     *
     * The filtering happens lazily. Every new [Iterator] of the returned
     * iterable iterates over all elements of `this`.
     *
     * The returned iterable provides elements by iterating this iterable,
     * but skipping over all initial elements where `test(element)` returns
     * true. If all elements satisfy `test` the resulting iterable is empty,
     * otherwise it iterates the remaining elements in their original order,
     * starting with the first element for which `test(element)` returns `false`.
     */
    skipWhile(test) {
        return new DartSkipWhileIterable(this, test);
    }
    /**
     * Returns the first element.
     *
     * Throws a [StateError] if `this` is empty.
     * Otherwise returns the first element in the iteration order,
     * equivalent to `this.elementAt(0)`.
     */
    get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }
    /**
     * Returns the last element.
     *
     * Throws a [StateError] if `this` is empty.
     * Otherwise may iterate through the elements and returns the last one
     * seen.
     * Some iterables may have more efficient ways to find the last element
     * (for example a list can directly access the last element,
     * without iterating through the previous ones).
     */
    get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let result;
        do {
            result = it.current;
        } while (it.moveNext());
        return result;
    }
    /**
     * Checks that this iterable has only one element, and returns that element.
     *
     * Throws a [StateError] if `this` is empty or has more than one element.
     */
    get single() {
        let it = this.iterator;
        if (!it.moveNext())
            throw DartIterableElementError.noElement();
        let result = it.current;
        if (it.moveNext())
            throw DartIterableElementError.tooMany();
        return result;
    }
    /**
     * Returns the first element that satisfies the given predicate [test].
     *
     * Iterates through elements and returns the first to satisfy [test].
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        for (let element of this) {
            if (test(element))
                return element;
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    /**
     * Returns the last element that satisfies the given predicate [test].
     *
     * An iterable that can access its elements directly may check its
     * elements in any order (for example a list starts by checking the
     * last element and then moves towards the start of the list).
     * The default implementation iterates elements in iteration order,
     * checks `test(element)` for each,
     * and finally returns that last one that matched.
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    /**
     * Returns the single element that satisfies [test].
     *
     * Checks all elements to see if `test(element)` returns true.
     * If exactly one element satisfies [test], that element is returned.
     * Otherwise, if there are no matching elements, or if there is more than
     * one matching element, a [StateError] is thrown.
     */
    singleWhere(test) {
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                if (foundMatching) {
                    throw DartIterableElementError.tooMany();
                }
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        throw DartIterableElementError.noElement();
    }
    /**
     * Returns the [index]th element.
     *
     * The [index] must be non-negative and less than [length].
     * Index zero represents the first element (so `iterable.elementAt(0)` is
     * equivalent to `iterable.first`).
     *
     * May iterate through the elements in iteration order, skipping the
     * first `index` elements and returning the next.
     * Some iterable may have more efficient ways to find the element.
     */
    elementAt(index) {
        if (index !== null && index !== undefined)
            throw new ArgumentError.notNull("index");
        RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
            if (index == elementIndex)
                return element;
            elementIndex++;
        }
        throw new RangeError.index(index, this, "index", null, elementIndex);
    }
    /**
     * Returns a string representation of (some of) the elements of `this`.
     *
     * Elements are represented by their own `toString` results.
     *
     * The default representation always contains the first three elements.
     * If there are less than a hundred elements in the iterable, it also
     * contains the last two elements.
     *
     * If the resulting string isn't above 80 characters, more elements are
     * included from the start of the iterable.
     *
     * The conversion may omit calling `toString` on some elements if they
     * are known to not occur in the output, and it may stop iterating after
     * a hundred elements.
     */
    toString() {
        return DartIterableBase.iterableToShortString(this, '(', ')');
    }
};
__decorate([
    namedFactory
], DartIterable, "_generate", null);
__decorate([
    namedFactory
], DartIterable, "_empty", null);
DartIterable = __decorate([
    DartClass
], DartIterable);
/**
 * Marker interface for [Iterable] subclasses that have an efficient
 * [length] implementation.
 */
let DartEfficientLengthIterable = class DartEfficientLengthIterable extends DartIterable {
    /**
     * Returns the number of elements in the iterable.
     *
     * This is an efficient operation that doesn't require iterating through
     * the elements.
     */
    get length() {
        throw new Error('abstract');
    }
};
__decorate([
    Abstract
], DartEfficientLengthIterable.prototype, "length", null);
DartEfficientLengthIterable = __decorate([
    DartClass
], DartEfficientLengthIterable);
class _HashMapKeyIterable extends DartEfficientLengthIterable {
    constructor(_map) {
        super();
        this._map = _map;
    }
    get length() {
        return this._map._length;
    }
    get isEmpty() {
        return this._map._length == 0;
    }
    get iterator() {
        return new _HashMapKeyIterator(this._map, this._map._computeKeys());
    }
    contains(element) {
        return this._map.containsKey(element);
    }
    forEach(f) {
        let keys = this._map._computeKeys();
        for (let i = 0, length = keys.length /* JS('int', '#.length', keys)*/; i < length; i++) { // TODO: investigate why this was using the js length property
            f(keys[OPERATOR_INDEX](i) /*JS('var', '#[#]', keys, i)*/); // <- TODO :Investigate why this was using the js square operator, it can be because of optimization reasons ? like we are sure here it is the native implementation of list and thus the square operator works ?
            if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}
class _HashMapKeyIterator {
    constructor(_map, _keys) {
        this._offset = 0;
        this._map = _map;
        this._keys = _keys;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        let keys = this._keys;
        let offset = this._offset;
        if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
            throw new ConcurrentModificationError(this._map);
        }
        else if (offset >= keys.length /* JS('int', '#.length', keys)*/) {
            this._current = null;
            return false;
        }
        else {
            this._current = keys[OPERATOR_INDEX](offset) /* JS('var', '#[#]', keys, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /* JS('int', '#', offset + 1)*/;
            return true;
        }
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
let DartJsLinkedHashMap = DartJsLinkedHashMap_1 = class DartJsLinkedHashMap {
    constructor() {
    }
    static get _supportsEs6Maps() {
        return typeof Map != "undefined" /* JS('returns:bool;depends:none;effects:none;throws:never;gvn:true',
            'typeof Map != "undefined"')*/;
    }
    _init() {
        this._length = 0;
        this._modifications = 0;
    }
    /// If ES6 Maps are available returns a linked hash-map backed by an ES6 Map.
    // @ForceInline()
    static _es6() {
        return (_USE_ES6_MAPS && DartJsLinkedHashMap_1._supportsEs6Maps)
            ? new DartEs6LinkedHashMap()
            : new DartJsLinkedHashMap_1();
    }
    get length() {
        return this._length;
    }
    get isEmpty() {
        return this._length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    get keys() {
        return new DartLinkedHashMapKeyIterable(this);
    }
    get values() {
        return new DartMappedIterable(this.keys, (each) => this[OPERATOR_INDEX](each));
    }
    containsKey(key) {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null)
                return false;
            return this._containsTableEntry(strings, key);
        }
        else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null)
                return false;
            return this._containsTableEntry(nums, key);
        }
        else {
            return this.internalContainsKey(key);
        }
    }
    internalContainsKey(key) {
        let rest = this._rest;
        if (rest == null)
            return false;
        let bucket = this._getBucket(rest, key);
        return this.internalFindBucketIndex(bucket, key) >= 0;
    }
    containsValue(value) {
        return this.keys.any((each) => _dart.equals(this[OPERATOR_INDEX](each), value));
    }
    addAll(other) {
        other.forEach((key, value) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }
    [OPERATOR_INDEX](key) {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null)
                return null;
            let cell = this._getTableCell(strings, key);
            return (cell == null) ? null : cell.hashMapCellValue;
        }
        else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null)
                return null;
            let cell = this._getTableCell(nums, key);
            return (cell == null) ? null : cell.hashMapCellValue;
        }
        else {
            return this.internalGet(key);
        }
    }
    internalGet(key) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, key);
        let index = this.internalFindBucketIndex(bucket, key);
        if (index < 0)
            return null;
        let cell = bucket[index] /*JS('var', '#[#]', bucket, index)*/;
        return cell.hashMapCellValue;
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null)
                this._strings = strings = this._newHashTable();
            this._addHashTableEntry(strings, key, value);
        }
        else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null)
                this._nums = nums = this._newHashTable();
            this._addHashTableEntry(nums, key, value);
        }
        else {
            this.internalSet(key, value);
        }
    }
    internalSet(key, value) {
        let rest = this._rest;
        if (rest == null)
            this._rest = rest = this._newHashTable();
        let hash = this.internalComputeHashCode(key);
        let bucket = this._getTableBucket(rest, hash);
        if (bucket == null) {
            let cell = this._newLinkedCell(key, value);
            this._setTableEntry(rest, hash, [cell] /*JS('var', '[#]', cell)*/);
        }
        else {
            let index = this.internalFindBucketIndex(bucket, key);
            if (index >= 0) {
                let cell = bucket[index] /* JS('var', '#[#]', bucket, index)*/;
                cell.hashMapCellValue = value;
            }
            else {
                let cell = this._newLinkedCell(key, value);
                bucket.push(cell);
                //JS('void', '#.push(#)', bucket, cell);
            }
        }
    }
    putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key))
            return this[OPERATOR_INDEX](key);
        let value = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }
    remove(key) {
        if (_isStringKey(key)) {
            return this._removeHashTableEntry(this._strings, key);
        }
        else if (_isNumericKey(key)) {
            return this._removeHashTableEntry(this._nums, key);
        }
        else {
            return this.internalRemove(key);
        }
    }
    internalRemove(key) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, key);
        let index = this.internalFindBucketIndex(bucket, key);
        if (index < 0)
            return null;
        // Use splice to remove the [cell] element at the index and
        // unlink the cell before returning its value.
        let cell = bucket.splice(index, 1)[0];
        this._unlinkCell(cell);
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        return cell.hashMapCellValue;
    }
    clear() {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._first = this._last = null;
            this._length = 0;
            this._modified();
        }
    }
    forEach(action) {
        let cell = this._first;
        let modifications = this._modifications;
        while (cell != null) {
            action(cell.hashMapCellKey, cell.hashMapCellValue);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            cell = cell._next;
        }
    }
    _addHashTableEntry(table, key, value) {
        let cell = this._getTableCell(table, key);
        if (cell == null) {
            this._setTableEntry(table, key, this._newLinkedCell(key, value));
        }
        else {
            cell.hashMapCellValue = value;
        }
    }
    _removeHashTableEntry(table, key) {
        if (table == null)
            return null;
        let cell = this._getTableCell(table, key);
        if (cell == null)
            return null;
        this._unlinkCell(cell);
        this._deleteTableEntry(table, key);
        return cell.hashMapCellValue;
    }
    _modified() {
        // Value cycles after 2^30 modifications so that modification counts are
        // always unboxed (Smi) values. Modification detection will be missed if you
        // make exactly some multiple of 2^30 modifications between advances of an
        // iterator.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }
    // Create a new cell and link it in as the last one in the list.
    _newLinkedCell(key, value) {
        let cell = new LinkedHashMapCell(key, value);
        if (this._first == null) {
            this._first = this._last = cell;
        }
        else {
            let last = this._last;
            cell._previous = last;
            this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
    }
    // Unlink the given cell from the linked list of cells.
    _unlinkCell(cell) {
        let previous = cell._previous;
        let next = cell._next;
        if (previous == null) {
            //assert(cell == this._first);
            this._first = next;
        }
        else {
            previous._next = next;
        }
        if (next == null) {
            //assert(cell == _last);
            this._last = previous;
        }
        else {
            next._previous = previous;
        }
        this._length--;
        this._modified();
    }
    internalComputeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return key.hashCode & 0x3ffffff /*JS('int', '# & 0x3ffffff', key.hashCode)*/;
    }
    _getBucket(table, key) {
        let hash = this.internalComputeHashCode(key);
        return this._getTableBucket(table, hash);
    }
    internalFindBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (_dart.equals(cell.hashMapCellKey, key))
                return i;
        }
        return -1;
    }
    toString() {
        return DartMaps.mapToString(this);
    }
    _getTableCell(table, key) {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }
    _getTableBucket(table, key) {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }
    _setTableEntry(table, key, value) {
        //assert(value != null);
        table[key] = value;
        //JS('void', '#[#] = #', table, key, value);
    }
    _deleteTableEntry(table, key) {
        //JS('void', 'delete #[#]', table, key);
        delete table[key];
    }
    _containsTableEntry(table, key) {
        let cell = this._getTableCell(table, key);
        return cell != null;
    }
    _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        let table = Object.create(null) /* JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        let temporaryKey = '<non-identifier-key>';
        this._setTableEntry(table, temporaryKey, table);
        this._deleteTableEntry(table, temporaryKey);
        return table;
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
};
__decorate([
    defaultConstructor
], DartJsLinkedHashMap.prototype, "_init", null);
__decorate([
    namedFactory
], DartJsLinkedHashMap, "_es6", null);
DartJsLinkedHashMap = DartJsLinkedHashMap_1 = __decorate([
    DartClass
], DartJsLinkedHashMap);
let _LinkedIdentityHashMap = _LinkedIdentityHashMap_1 = class _LinkedIdentityHashMap extends DartJsLinkedHashMap {
    constructor() {
        super();
    }
    static get _supportsEs6Maps() {
        return typeof Map != 'undefined' /* JS('returns:bool;depends:none;effects:none;throws:never;gvn:true',
            'typeof Map != "undefined"')*/;
    }
    static _es6() {
        return (_USE_ES6_MAPS && _LinkedIdentityHashMap_1._supportsEs6Maps)
            ? new _Es6LinkedIdentityHashMap()
            : new _LinkedIdentityHashMap_1();
    }
    internalComputeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /* JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }
    internalFindBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell.hashMapCellKey, key))
                return i;
        }
        return -1;
    }
};
__decorate([
    namedFactory
], _LinkedIdentityHashMap, "_es6", null);
_LinkedIdentityHashMap = _LinkedIdentityHashMap_1 = __decorate([
    DartClass
], _LinkedIdentityHashMap);
class _Es6LinkedIdentityHashMap extends _LinkedIdentityHashMap {
    constructor() {
        super();
        this._modifications = 0;
        this._map = new Map() /* JS('var', 'new Map()')*/;
    }
    get length() {
        return this._map.size /* JS('int', '#.size', _map)*/;
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    get keys() {
        return new _Es6MapIterable(this, true);
    }
    get values() {
        return new _Es6MapIterable(this, false);
    }
    containsKey(key) {
        return this._map.has(key) /* JS('bool', '#.has(#)', _map, key)*/;
    }
    containsValue(value) {
        return this.values.any((each) => _dart.equals(each, value)); // TODO : here a simple equality could be enough ? (this is an itentify hashmap after all)
    }
    addAll(other) {
        other.forEach((key, value) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }
    [OPERATOR_INDEX](key) {
        return this._map.get(key) /*JS('var', '#.get(#)', _map, key)*/;
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        /*JS('var', '#.set(#, #)', _map, key, value);*/
        this._map.set(key, value);
        this._modified();
    }
    putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key))
            return this[OPERATOR_INDEX](key);
        let value = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }
    remove(key) {
        let value = this[OPERATOR_INDEX](key);
        /* JS('bool', '#.delete(#)', _map, key);*/
        this._map.delete(key);
        this._modified();
        return value;
    }
    clear() {
        /* JS('void', '#.clear()', _map);*/
        this._map.clear();
        this._modified();
    }
    forEach(action) {
        let jsEntries = this._map.entries() /* JS('var', '#.entries()', _map)*/;
        let modifications = this._modifications;
        while (true) {
            let next = jsEntries.next() /*JS('var', '#.next()', jsEntries)*/;
            let done = next.done /*JS('bool', '#.done', next)*/;
            if (done)
                break;
            let entry = next.value /* JS('var', '#.value', next)*/;
            let key = entry[0] /* JS('var', '#[0]', entry)*/;
            let value = entry[1] /* JS('var', '#[1]', entry)*/;
            action(key, value);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
        }
    }
    _modified() {
        // Value cycles after 2^30 modifications so that modification counts are
        // always unboxed (Smi) values. Modification detection will be missed if you
        // make exactly some multiple of 2^30 modifications between advances of an
        // iterator.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }
    toString() {
        return DartMaps.mapToString(this);
    }
}
class _Es6MapIterable extends DartEfficientLengthIterable {
    constructor(_map, _isKeys) {
        super();
        this._map = _map;
        this._isKeys = _isKeys;
    }
    get length() {
        return this._map.length;
    }
    get isEmpty() {
        return this._map.isEmpty;
    }
    get iterator() {
        return new _Es6MapIterator(this._map, this._map._modifications, this._isKeys);
    }
    contains(element) {
        return this._isKeys ? this._map.containsKey(element) : this._map.containsValue(element);
    }
    forEach(f) {
        let jsIterator;
        if (this._isKeys) {
            jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        }
        else {
            jsIterator = this._map._map.values() /* JS('var', '#.values()', _map._map)*/;
        }
        let modifications = this._map._modifications;
        while (true) {
            let next = jsIterator.next() /* JS('var', '#.next()', jsIterator)*/;
            let done = next.done /* JS('bool', '#.done', next)*/;
            if (done)
                break;
            let value = next.value /* JS('var', '#.value', next)*/;
            f(value);
            if (modifications != this._map._modifications) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}
class _Es6MapIterator {
    constructor(_map, _modifications, _isKeys) {
        this._map = _map;
        this._modifications = _modifications;
        this._isKeys = _isKeys;
        if (_isKeys) {
            this._jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        }
        else {
            this._jsIterator = this._map._map.values() /*JS('var', '#.values()', _map._map)*/;
        }
        this._done = false;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        if (this._modifications != this._map._modifications) {
            throw new ConcurrentModificationError(this._map);
        }
        if (this._done)
            return false;
        this._next = this._jsIterator.next() /*JS('var', '#.next()', _jsIterator)*/;
        let done = this._next.done /* JS('bool', '#.done', _next)*/;
        if (done) {
            this._current = null;
            this._done = true;
            return false;
        }
        else {
            this._current = this._next.value /* JS('var', '#.value', _next)*/;
            return true;
        }
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
// TODO(floitsch): use ES6 maps when available.
class _LinkedCustomHashMap extends DartJsLinkedHashMap {
    constructor(_equals, _hashCode, validKey) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((v) => true);
    }
    [OPERATOR_INDEX](key) {
        if (!this._validKey(key))
            return null;
        return super.internalGet(key);
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        super.internalSet(key, value);
    }
    containsKey(key) {
        if (!this._validKey(key))
            return false;
        return super.internalContainsKey(key);
    }
    remove(key) {
        if (!this._validKey(key))
            return null;
        return super.internalRemove(key);
    }
    internalComputeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }
    internalFindBucketIndex(bucket, key) {
        if (bucket == null)
            return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < this.length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (this._equals(cell.hashMapCellKey, key))
                return i;
        }
        return -1;
    }
}
/**
 * Mixin implementation of [Set].
 *
 * This class provides a base implementation of a `Set` that depends only
 * on the abstract members: [add], [contains], [lookup], [remove],
 * [iterator], [length] and [toSet].
 *
 * Some of the methods assume that `toSet` creates a modifiable set.
 * If using this mixin for an unmodifiable set,
 * where `toSet` should return an unmodifiable set,
 * it's necessary to reimplement
 * [retainAll], [union], [intersection] and [difference].
 *
 * Implementations of `Set` using this mixin should consider also implementing
 * `clear` in constant time. The default implementation works by removing every
 * element.
 */
let DartSetMixin = class DartSetMixin {
    // This class reimplements all of [IterableMixin].
    // If/when Dart mixins get more powerful, we should just create a single
    // Mixin class from IterableMixin and the new methods of this class.
    add(element) {
        throw Error();
    }
    contains(element) {
        throw Error();
    }
    lookup(element) {
        throw Error();
    }
    remove(element) {
        throw Error();
    }
    get iterator() {
        throw Error();
    }
    toSet() {
        throw Error();
    }
    get length() {
        throw Error();
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return this.length != 0;
    }
    clear() {
        this.removeAll(this.toList());
    }
    addAll(elements) {
        for (let element of elements)
            this.add(element);
    }
    removeAll(elements) {
        for (let element in elements)
            this.remove(element);
    }
    retainAll(elements) {
        // Create a copy of the set, remove all of elements from the copy,
        // then remove all remaining elements in copy from this.
        let toRemove = this.toSet();
        for (let o in elements) {
            toRemove.remove(o);
        }
        this.removeAll(toRemove);
    }
    removeWhere(test) {
        let toRemove = new DartList();
        for (let element of this) {
            if (test(element))
                toRemove.add(element);
        }
        this.removeAll(toRemove);
    }
    retainWhere(test) {
        let toRemove = new DartList();
        for (let element of this) {
            if (!test(element))
                toRemove.add(element);
        }
        this.removeAll(toRemove);
    }
    containsAll(other) {
        for (let o of other) {
            if (!this.contains(o))
                return false;
        }
        return true;
    }
    union(other) {
        let res = this.toSet();
        res.addAll(other);
        return res;
    }
    intersection(other) {
        let result = this.toSet();
        for (let element of this) {
            if (!other.contains(element))
                result.remove(element);
        }
        return result;
    }
    difference(other) {
        let result = this.toSet();
        for (let element of this) {
            if (other.contains(element))
                result.remove(element);
        }
        return result;
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        let result = growable ? (() => {
            let l = new DartList();
            l.length = this.length;
            return l;
        })() : new DartList(this.length);
        let i = 0;
        for (let element of this)
            result[OPERATOR_INDEX_ASSIGN](i++, element);
        return result;
    }
    map(f) {
        return new DartEfficientLengthMappedIterable(this, f);
    }
    get single() {
        if (this.length > 1)
            throw DartIterableElementError.tooMany();
        let it = this.iterator;
        if (!it.moveNext())
            throw DartIterableElementError.noElement();
        let result = it.current;
        return result;
    }
    toString() {
        return DartIterableBase.iterableToFullString(this, '{', '}');
    }
    // Copied from IterableMixin.
    // Should be inherited if we had multi-level mixins.
    where(f) {
        return new DartWhereIterable(this, f);
    }
    expand(f) {
        return new DartExpandIterable(this, f);
    }
    forEach(f) {
        for (let element of this)
            f(element);
    }
    reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
            value = combine(value, iterator.current);
        }
        return value;
    }
    fold(initialValue, combine) {
        let value = initialValue;
        for (let element of this)
            value = combine(value, element);
        return value;
    }
    every(f) {
        for (let element of this) {
            if (!f(element))
                return false;
        }
        return true;
    }
    join(separator /*  = ""*/) {
        let iterator = this.iterator;
        if (!iterator.moveNext())
            return "";
        let buffer = new DartStringBuffer();
        if (separator == null || separator == "") {
            do {
                buffer.write(`${iterator.current}`);
            } while (iterator.moveNext());
        }
        else {
            buffer.write(`${iterator.current}`);
            while (iterator.moveNext()) {
                buffer.write(separator);
                buffer.write(`${iterator.current}`);
            }
        }
        return buffer.toString();
    }
    any(test) {
        for (let element of this) {
            if (test(element))
                return true;
        }
        return false;
    }
    take(n) {
        return new DartTakeIterable(this, n);
    }
    takeWhile(test) {
        return new DartTakeWhileIterable(this, test);
    }
    skip(n) {
        return new DartSkipIterable(this, n);
    }
    skipWhile(test) {
        return new DartSkipWhileIterable(this, test);
    }
    get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }
    get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let result;
        do {
            result = it.current;
        } while (it.moveNext());
        return result;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        for (let element of this) {
            if (test(element))
                return element;
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test) {
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                if (foundMatching) {
                    throw DartIterableElementError.tooMany();
                }
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        throw DartIterableElementError.noElement();
    }
    elementAt(index) {
        if (_dart.is(index, 'int'))
            throw new ArgumentError.notNull("index");
        RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
            if (index == elementIndex)
                return element;
            elementIndex++;
        }
        throw new RangeError.index(index, this, "index", null, elementIndex);
    }
    [Symbol.iterator]() {
        return this.iterator;
    }
};
__decorate([
    Abstract
], DartSetMixin.prototype, "add", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "contains", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "lookup", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "remove", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "iterator", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "toSet", null);
__decorate([
    Abstract
], DartSetMixin.prototype, "length", null);
DartSetMixin = __decorate([
    DartClass
], DartSetMixin);
/**
 * Base implementation of [Set].
 *
 * This class provides a base implementation of a `Set` that depends only
 * on the abstract members: [add], [contains], [lookup], [remove],
 * [iterator], [length] and [toSet].
 *
 * Some of the methods assume that `toSet` creates a modifiable set.
 * If using this base class for an unmodifiable set,
 * where `toSet` should return an unmodifiable set,
 * it's necessary to reimplement
 * [retainAll], [union], [intersection] and [difference].
 *
 * Implementations of `Set` using this base should consider also implementing
 * `clear` in constant time. The default implementation works by removing every
 * element.
 */
class DartSetBase extends DartSetMixin {
    /**
     * Convert a `Set` to a string as `{each, element, as, string}`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [set] to a string again.
     */
    static setToString(set) {
        return DartIterableBase.iterableToFullString(set, '{', '}');
    }
}
/** Common parts of [HashSet] and [LinkedHashSet] implementations. */
class _HashSetBase extends DartSetBase {
    // The following two methods override the ones in SetBase.
    // It's possible to be more efficient if we have a way to create an empty
    // set of the correct type.
    difference(other) {
        let result = this._newSet();
        for (let element of this) {
            if (!other.contains(element))
                result.add(element);
        }
        return result;
    }
    intersection(other) {
        let result = this._newSet();
        for (let element of this) {
            if (other.contains(element))
                result.add(element);
        }
        return result;
    }
    _newSet() {
        throw new Error('abstract');
    }
    // Subclasses can optimize this further.
    toSet() {
        let res = this._newSet();
        res.addAll(this);
        return res;
    }
}
class _HashSet extends _HashSetBase {
    constructor() {
        super();
        this._length = 0;
    }
    _newSet() {
        return new _HashSet();
    }
    // Iterable.
    get iterator() {
        return new _HashSetIterator(this, this._computeElements());
    }
    get length() {
        return this._length;
    }
    get isEmpty() {
        return this._length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    contains(object) {
        if (_HashSet._isStringElement(object)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashSet._hasTableEntry(strings, object);
        }
        else if (_HashSet._isNumericElement(object)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashSet._hasTableEntry(nums, object);
        }
        else {
            return this._contains(object);
        }
    }
    _contains(object) {
        let rest = this._rest;
        if (rest == null)
            return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }
    lookup(object) {
        if (_HashSet._isStringElement(object) || _HashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        }
        return this._lookup(object);
    }
    _lookup(object) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0)
            return null;
        return bucket[index];
    }
    // Collection.
    add(element) {
        if (_HashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null)
                this._strings = strings = _HashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        }
        else if (_HashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null)
                this._nums = nums = _HashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        }
        else {
            return this._add(element);
        }
    }
    _add(element) {
        let rest = this._rest;
        if (rest == null)
            this._rest = rest = _HashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashSet._setTableEntry(rest, hash, [element] /*JS('var', '[#]', element)*/);
        }
        else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0)
                return false;
            /*JS('void', '#.push(#)', bucket, element);*/
            bucket.push(element);
        }
        this._length++;
        this._elements = null;
        return true;
    }
    addAll(objects) {
        for (let each of objects) {
            this.add(each);
        }
    }
    remove(object) {
        if (_HashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        }
        else if (_HashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        }
        else {
            return this._remove(object);
        }
    }
    _remove(object) {
        let rest = this._rest;
        if (rest == null)
            return false;
        var bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0)
            return false;
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        this._length--;
        this._elements = null;
        // TODO(kasperl): It would probably be faster to move the
        // element to the end and reduce the length of the bucket list.
        /*JS('void', '#.splice(#, 1)', bucket, index);*/
        bucket.splice(index, 1);
        return true;
    }
    clear() {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._elements = null;
            this._length = 0;
        }
    }
    _computeElements() {
        if (this._elements != null)
            return this._elements;
        let result = new Array(this._length);
        let index = 0;
        // Add all string elements to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /*JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let element = names[i] /*JS('String', '#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }
        // Add all numeric elements to the list.
        let nums = this._nums;
        if (nums != null) {
            let names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the elements back to numbers (+).
                let element = +names[i] /* JS('num', '+#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }
        // Add all the remaining elements to the list.
        let rest = this._rest;
        if (rest != null) {
            let names = Object.getOwnPropertyNames(rest) /*JS('var', 'Object.getOwnPropertyNames(#)', rest)*/;
            let entries = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let entry = names[i] /* JS('String', '#[#]', names, i)*/;
                let bucket = rest[entry] /*JS('var', '#[#]', rest, entry)*/;
                let length = bucket.length /*JS('int', '#.length', bucket)*/;
                for (let i = 0; i < length; i++) {
                    /* JS('void', '#[#] = #[#]', result, index, bucket, i);*/
                    result[index] = bucket[i];
                    index++;
                }
            }
        }
        //assert(index == _length);
        return this._elements = result;
    }
    _addHashTableEntry(table, element) {
        if (_HashSet._hasTableEntry(table, element))
            return false;
        _HashSet._setTableEntry(table, element, 0);
        this._length++;
        this._elements = null;
        return true;
    }
    _removeHashTableEntry(table, element) {
        if (table != null && _HashSet._hasTableEntry(table, element)) {
            _HashSet._deleteTableEntry(table, element);
            this._length--;
            this._elements = null;
            return true;
        }
        else {
            return false;
        }
    }
    static _isStringElement(element) {
        return _dart.is(element, 'string') && element != '__proto__';
    }
    static _isNumericElement(element) {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element;
    }
    _computeHashCode(element) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /*JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }
    static _hasTableEntry(table, key) {
        var entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }
    static _setTableEntry(table, key, value) {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }
    static _deleteTableEntry(table, key) {
        /* JS('void', 'delete #[#]', table, key);*/
        delete table[key];
    }
    _getBucket(table, element) {
        let hash = this._computeHashCode(element);
        return table[hash] /* JS('var', '#[#]', table, hash)*/;
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (_dart.equals(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element))
                return i;
        }
        return -1;
    }
    static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        var table = Object.create(null) /*JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        var temporaryKey = '<non-identifier-key>';
        _HashSet._setTableEntry(table, temporaryKey, table);
        _HashSet._deleteTableEntry(table, temporaryKey);
        return table;
    }
}
class _IdentityHashSet extends _HashSet {
    _newSet() {
        return new _IdentityHashSet();
    }
    _computeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (identical(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element))
                return i;
        }
        return -1;
    }
}
class _CustomHashSet extends _HashSet {
    constructor(_equality, _hasher, validKey) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }
    _newSet() {
        return new _CustomHashSet(this._equality, this._hasher, this._validKey);
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (this._equality(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element))
                return i;
        }
        return -1;
    }
    _computeHashCode(element) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }
    add(object) {
        return super._add(object);
    }
    contains(object) {
        if (!this._validKey(object))
            return false;
        return super._contains(object);
    }
    lookup(object) {
        if (!this._validKey(object))
            return null;
        return super._lookup(object);
    }
    remove(object) {
        if (!this._validKey(object))
            return false;
        return super._remove(object);
    }
}
// TODO(kasperl): Share this code with _HashMapKeyIterator<E>?
class _HashSetIterator {
    constructor(_set, _elements) {
        this._offset = 0;
        this._set = _set;
        this._elements = _elements;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        let elements = this._elements;
        let offset = this._offset;
        if (elements !== this._set._elements /*JS('bool', '# !== #', elements, _set._elements)*/) {
            throw new ConcurrentModificationError(this._set);
        }
        else if (offset >= elements.length /*JS('int', '#.length', elements)*/) {
            this._current = null;
            return false;
        }
        else {
            this._current = elements[offset] /* JS('var', '#[#]', elements, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /*JS('int', '#', offset + 1)*/;
            return true;
        }
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
class _LinkedHashSet extends _HashSetBase {
    constructor() {
        super();
        this._length = 0;
        // We track the number of modifications done to the element set to
        // be able to throw when the set is modified while being iterated
        // over.
        this._modifications = 0;
    }
    _newSet() {
        return new _LinkedHashSet();
    }
    _unsupported(operation) {
        throw 'LinkedHashSet: unsupported $operation';
    }
    // Iterable.
    get iterator() {
        return new _LinkedHashSetIterator(this, this._modifications);
    }
    get length() {
        return this._length;
    }
    get isEmpty() {
        return this._length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    contains(object) {
        if (_LinkedHashSet._isStringElement(object)) {
            let strings = this._strings;
            if (strings == null)
                return false;
            let cell = _LinkedHashSet._getTableEntry(strings, object);
            return cell != null;
        }
        else if (_LinkedHashSet._isNumericElement(object)) {
            let nums = this._nums;
            if (nums == null)
                return false;
            let cell = _LinkedHashSet._getTableEntry(nums, object);
            return cell != null;
        }
        else {
            return this._contains(object);
        }
    }
    _contains(object) {
        let rest = this._rest;
        if (rest == null)
            return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }
    lookup(object) {
        if (_LinkedHashSet._isStringElement(object) || _LinkedHashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        }
        else {
            return this._lookup(object);
        }
    }
    _lookup(object) {
        let rest = this._rest;
        if (rest == null)
            return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0)
            return null;
        return bucket[index]._element;
    }
    forEach(action) {
        let cell = this._first;
        let modifications = this._modifications;
        while (cell != null) {
            action(cell._element);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            cell = cell._next;
        }
    }
    get first() {
        if (this._first == null)
            throw new StateError("No elements");
        return this._first._element;
    }
    get last() {
        if (this._last == null)
            throw new StateError("No elements");
        return this._last._element;
    }
    // Collection.
    add(element) {
        if (_LinkedHashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null)
                this._strings = strings = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        }
        else if (_LinkedHashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null)
                this._nums = nums = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        }
        else {
            return this._add(element);
        }
    }
    _add(element) {
        let rest = this._rest;
        if (rest == null)
            this._rest = rest = _LinkedHashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = rest[hash] /*JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            let cell = this._newLinkedCell(element);
            _LinkedHashSet._setTableEntry(rest, hash, [cell] /*JS('var', '[#]', cell)*/);
        }
        else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0)
                return false;
            let cell = this._newLinkedCell(element);
            /*JS('void', '#.push(#)', bucket, cell);*/
            bucket.push(cell);
        }
        return true;
    }
    remove(object) {
        if (_LinkedHashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        }
        else if (_LinkedHashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        }
        else {
            return this._remove(object);
        }
    }
    _remove(object) {
        let rest = this._rest;
        if (rest == null)
            return false;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0)
            return false;
        // Use splice to remove the [cell] element at the index and
        // unlink it.
        let cell = bucket.splice(index, 1)[0] /*JS('var', '#.splice(#, 1)[0]', bucket, index)*/;
        this._unlinkCell(cell);
        return true;
    }
    removeWhere(test) {
        this._filterWhere(test, true);
    }
    retainWhere(test) {
        this._filterWhere(test, false);
    }
    _filterWhere(test, removeMatching) {
        let cell = this._first;
        while (cell != null) {
            let element = cell._element;
            let next = cell._next;
            let modifications = this._modifications;
            let shouldRemove = (removeMatching == test(element));
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            if (shouldRemove)
                this.remove(element);
            cell = next;
        }
    }
    clear() {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._first = this._last = null;
            this._length = 0;
            this._modified();
        }
    }
    _addHashTableEntry(table, element) {
        let cell = _LinkedHashSet._getTableEntry(table, element);
        if (cell != null)
            return false;
        _LinkedHashSet._setTableEntry(table, element, this._newLinkedCell(element));
        return true;
    }
    _removeHashTableEntry(table, element) {
        if (table == null)
            return false;
        let cell = _LinkedHashSet._getTableEntry(table, element);
        if (cell == null)
            return false;
        this._unlinkCell(cell);
        _LinkedHashSet._deleteTableEntry(table, element);
        return true;
    }
    _modified() {
        // Value cycles after 2^30 modifications. If you keep hold of an
        // iterator for that long, you might miss a modification
        // detection, and iteration can go sour. Don't do that.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }
    // Create a new cell and link it in as the last one in the list.
    _newLinkedCell(element) {
        let cell = new _LinkedHashSetCell(element);
        if (this._first == null) {
            this._first = this._last = cell;
        }
        else {
            let last = this._last;
            cell._previous = last;
            this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
    }
    // Unlink the given cell from the linked list of cells.
    _unlinkCell(cell) {
        let previous = cell._previous;
        let next = cell._next;
        if (previous == null) {
            // assert(cell == _first);
            this._first = next;
        }
        else {
            previous._next = next;
        }
        if (next == null) {
            //assert(cell == _last);
            this._last = previous;
        }
        else {
            next._previous = previous;
        }
        this._length--;
        this._modified();
    }
    static _isStringElement(element) {
        return _dart.is(element, 'string') && element != '__proto__';
    }
    static _isNumericElement(element) {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element;
    }
    _computeHashCode(element) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }
    static _getTableEntry(table, key) {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }
    static _setTableEntry(table, key, value) {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }
    static _deleteTableEntry(table, key) {
        //JS('void', 'delete #[#]', table, key);
        delete table[key];
    }
    _getBucket(table, element) {
        let hash = this._computeHashCode(element);
        return table[hash] /*JS('var', '#[#]', table, hash)*/;
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (_dart.equals(cell._element, element))
                return i;
        }
        return -1;
    }
    static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        let table = Object.create(null) /*JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        let temporaryKey = '<non-identifier-key>';
        _LinkedHashSet._setTableEntry(table, temporaryKey, table);
        _LinkedHashSet._deleteTableEntry(table, temporaryKey);
        return table;
    }
}
class _LinkedIdentityHashSet extends _LinkedHashSet {
    _newSet() {
        return new _LinkedIdentityHashSet();
    }
    _computeHashCode(key) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*  JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell._element, element))
                return i;
        }
        return -1;
    }
}
class _LinkedCustomHashSet extends _LinkedHashSet {
    constructor(_equality, _hasher, validKey) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }
    _newSet() {
        return new _LinkedCustomHashSet(this._equality, this._hasher, this._validKey);
    }
    _findBucketIndex(bucket, element) {
        if (bucket == null)
            return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (this._equality(cell._element, element))
                return i;
        }
        return -1;
    }
    _computeHashCode(element) {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }
    add(element) {
        return super._add(element);
    }
    contains(object) {
        if (!this._validKey(object))
            return false;
        return super._contains(object);
    }
    lookup(object) {
        if (!this._validKey(object))
            return null;
        return super._lookup(object);
    }
    remove(object) {
        if (!this._validKey(object))
            return false;
        return super._remove(object);
    }
    containsAll(elements) {
        for (let element in elements) {
            if (!this._validKey(element) || !this.contains(element))
                return false;
        }
        return true;
    }
    removeAll(elements) {
        for (let element of elements) {
            if (this._validKey(element)) {
                super._remove(element);
            }
        }
    }
}
class _LinkedHashSetCell {
    constructor(element) {
        this._element = element;
    }
}
// TODO(kasperl): Share this code with LinkedHashMapKeyIterator<E>?
class _LinkedHashSetIterator {
    constructor(_set, _modifications) {
        this._set = _set;
        this._modifications = _modifications;
        this._cell = _set._first;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        if (this._modifications != this._set._modifications) {
            throw new ConcurrentModificationError(this._set);
        }
        else if (this._cell == null) {
            this._current = null;
            return false;
        }
        else {
            this._current = this._cell._element;
            this._cell = this._cell._next;
            return true;
        }
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of _js_helper;
/**
 * Mixin that overrides mutating map operations with implementations that throw.
 */
class _UnmodifiableMapMixin {
    /** This operation is not supported by an unmodifiable map. */
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    addAll(other) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    clear() {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    remove(key) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key, ifAbsent) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
}
/**
 * Wrapper around a class that implements [Map] that only exposes `Map` members.
 *
 * A simple wrapper that delegates all `Map` members to the map provided in the
 * constructor.
 *
 * Base for delegating map implementations like [UnmodifiableMapView].
 */
class DartMapView {
    constructor(map) {
        this._map = map;
    }
    [OPERATOR_INDEX](key) {
        return this._map[key];
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        this._map[OPERATOR_INDEX_ASSIGN](key, value);
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
    addAll(other) {
        this._map.addAll(other);
    }
    clear() {
        this._map.clear();
    }
    putIfAbsent(key, ifAbsent) {
        return this._map.putIfAbsent(key, ifAbsent);
    }
    containsKey(key) {
        return this._map.containsKey(key);
    }
    containsValue(value) {
        return this._map.containsValue(value);
    }
    forEach(action) {
        this._map.forEach(action);
    }
    get isEmpty() {
        return this._map.isEmpty;
    }
    get isNotEmpty() {
        return this._map.isNotEmpty;
    }
    get length() {
        return this._map.length;
    }
    get keys() {
        return this._map.keys;
    }
    remove(key) {
        return this._map.remove(key);
    }
    toString() {
        return this._map.toString();
    }
    get values() {
        return this._map.values;
    }
}
/**
 * View of a [Map] that disallow modifying the map.
 *
 * A wrapper around a `Map` that forwards all members to the map provided in
 * the constructor, except for operations that modify the map.
 * Modifying operations throw instead.
 */
let DartUnmodifiableMapView = class DartUnmodifiableMapView extends DartMapView {
    constructor(base) {
        super(base);
    }
};
DartUnmodifiableMapView = __decorate([
    With(_UnmodifiableMapMixin)
], DartUnmodifiableMapView);
class DartConstantMapView extends DartUnmodifiableMapView {
    constructor(base) {
        super(base);
    }
}
let AbstractDartMap = class AbstractDartMap {
    [OPERATOR_INDEX](key) {
        throw 'abstract';
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw 'abstract';
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
    addAll(other) {
    }
    clear() {
    }
    containsKey(key) {
        return undefined;
    }
    containsValue(value) {
        return undefined;
    }
    forEach(f) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get keys() {
        return undefined;
    }
    get length() {
        return undefined;
    }
    putIfAbsent(key, ifAbsent) {
        return undefined;
    }
    remove(key) {
        return undefined;
    }
    get values() {
        return undefined;
    }
};
__decorate([
    Abstract
], AbstractDartMap.prototype, "addAll", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "clear", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "containsKey", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "containsValue", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "forEach", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "isEmpty", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "keys", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "length", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "putIfAbsent", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "remove", null);
__decorate([
    Abstract
], AbstractDartMap.prototype, "values", null);
AbstractDartMap = __decorate([
    DartClass,
    AbstractMethods(OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN)
], AbstractDartMap);
let DartConstantMap = DartConstantMap_1 = class DartConstantMap extends AbstractDartMap {
    // Used to create unmodifiable maps from other maps.
    static _from(other) {
        let keys = other.keys.toList();
        let allStrings = true;
        for (let k of keys) {
            if (!_dart.is(k, 'string')) {
                allStrings = false;
                break;
            }
        }
        if (allStrings) {
            let containsProto = false;
            let protoValue = null;
            let object = {} /* JS('=Object', '{}')*/;
            let length = 0;
            for (let k of keys) {
                var v = other[k];
                if (k != "__proto__") {
                    if (!object.hasOwnProperty(k))
                        length++;
                    //JS("void", "#[#] = #", object, k, v);
                    object[k] = v;
                }
                else {
                    containsProto = true;
                    protoValue = v;
                }
            }
            if (containsProto) {
                length++;
                return new DartConstantProtoMap._(length, object, keys, protoValue);
            }
            return new DartConstantStringMap._(length, object, keys);
        }
        // TODO(lrn): Make a proper unmodifiable map implementation.
        return new DartConstantMapView(new DartMap.from(other));
    }
    _() {
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    toString() {
        return DartMaps.mapToString(this);
    }
    static _throwUnmodifiable() {
        throw this._unsupportedError();
    }
    static _unsupportedError() {
        return new UnsupportedError("Cannot modify unmodifiable Map");
    }
    [OPERATOR_INDEX_ASSIGN](key, val) {
        DartConstantMap_1._throwUnmodifiable();
    }
    putIfAbsent(key, ifAbsent) {
        throw DartConstantMap_1._unsupportedError();
    }
    remove(key) {
        throw DartConstantMap_1._unsupportedError();
    }
    clear() {
        DartConstantMap_1._throwUnmodifiable();
    }
    addAll(other) {
        DartConstantMap_1._throwUnmodifiable();
    }
};
__decorate([
    namedConstructor
], DartConstantMap.prototype, "_", null);
__decorate([
    namedFactory
], DartConstantMap, "_from", null);
DartConstantMap = DartConstantMap_1 = __decorate([
    DartClass
], DartConstantMap);
let DartConstantStringMap = class DartConstantStringMap extends DartConstantMap {
    _(_length, _jsObject, _keys) {
        super._();
        this._length = _length;
        this._jsObject = _jsObject;
        this._keys = _keys;
    }
    get length() {
        return this._length /*JS('JSUInt31', '#', _length)*/;
    }
    get _keysArray() {
        return this._keys /* JS('JSUnmodifiableArray', '#', _keys)*/;
    }
    containsValue(needle) {
        return this.values.any((value) => _dart.equals(value, needle));
    }
    containsKey(key) {
        if (!_dart.is(key, 'string'))
            return false;
        if ('__proto__' == key)
            return false;
        return this._jsObject.hasOwnProperty(key);
    }
    [OPERATOR_INDEX](key) {
        if (!this.containsKey(key))
            return null;
        return this._fetch(key);
    }
    // [_fetch] is the indexer for keys for which `containsKey(key)` is true.
    _fetch(key) {
        return this._jsObject[key];
    }
    forEach(f) {
        // Use a JS 'cast' to get efficient loop.  Type inference doesn't get this
        // since constant map representation is chosen after type inference and the
        // instantiation is shortcut by the compiler.
        var keys = this._keysArray;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            f(key, this._fetch(key));
        }
    }
    get keys() {
        return new _ConstantMapKeyIterable(this);
    }
    get values() {
        return new DartMappedIterable(this._keysArray, (key) => this._fetch(key));
    }
};
__decorate([
    namedConstructor
], DartConstantStringMap.prototype, "_", null);
DartConstantStringMap = __decorate([
    DartClass
], DartConstantStringMap);
let DartConstantProtoMap = class DartConstantProtoMap extends DartConstantStringMap {
    // This constructor is not used.  The instantiation is shortcut by the
    // compiler. It is here to make the uninitialized final fields legal.
    _(length, jsObject, keys, _protoValue) {
        super._(length, jsObject, keys);
        this._protoValue = _protoValue;
    }
    containsKey(key) {
        if (!_dart.is(key, 'string'))
            return false;
        if ('__proto__' == key)
            return true;
        return this._jsObject.hasOwnProperty(key);
    }
    _fetch(key) {
        return '__proto__' == key ? this._protoValue : this._jsObject[key];
    }
};
__decorate([
    namedConstructor
], DartConstantProtoMap.prototype, "_", null);
DartConstantProtoMap = __decorate([
    DartClass
], DartConstantProtoMap);
class _ConstantMapKeyIterable extends DartIterable {
    constructor(_map) {
        super();
        this._map = _map;
    }
    get iterator() {
        return this._map._keysArray.iterator;
    }
    get length() {
        return this._map._keysArray.length;
    }
}
let DartGeneralConstantMap = class DartGeneralConstantMap extends DartConstantMap {
    constructor(_jsData) {
        super();
    }
    // This constructor is not used.  The instantiation is shortcut by the
    // compiler. It is here to make the uninitialized final fields legal.
    _create(_jsData) {
        super._();
        this._jsData = _jsData;
    }
    // We cannot create the backing map on creation since hashCode interceptors
    // have not been defined when constants are created.
    _getMap() {
        let backingMap = this.$map /*JS('LinkedHashMap|Null', r'#.$map', this)*/;
        if (backingMap == null) {
            backingMap = new DartJsLinkedHashMap();
            fillLiteralMap(this._jsData, backingMap);
            //JS('', r'#.$map = #', this, backingMap);
            this.$map = backingMap;
        }
        return backingMap;
    }
    containsValue(needle) {
        return this._getMap().containsValue(needle);
    }
    containsKey(key) {
        return this._getMap().containsKey(key);
    }
    [OPERATOR_INDEX](key) {
        return this._getMap()[OPERATOR_INDEX](key);
    }
    forEach(f) {
        this._getMap().forEach(f);
    }
    get keys() {
        return this._getMap().keys;
    }
    get values() {
        return this._getMap().values;
    }
    get length() {
        return this._getMap().length;
    }
};
__decorate([
    defaultConstructor
], DartGeneralConstantMap.prototype, "_create", null);
DartGeneralConstantMap = __decorate([
    DartClass
], DartGeneralConstantMap);
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.collection;
/** Default function for equality comparison in customized HashMaps */
export function _defaultEquals(a, b) {
    return _dart.equals(a, b);
}
/** Default function for hash-code computation in customized HashMaps */
export function _defaultHashCode(a) {
    return a.hashCode;
}
/**
 * A hash-table based implementation of [Map].
 *
 * The keys of a `HashMap` must have consistent [Object.==]
 * and [Object.hashCode] implementations. This means that the `==` operator
 * must define a stable equivalence relation on the keys (reflexive,
 * symmetric, transitive, and consistent over time), and that `hashCode`
 * must be the same for objects that are considered equal by `==`.
 *
 * The map allows `null` as a key.
 *
 * Iterating the map's keys, values or entries (through [forEach])
 * may happen in any order.
 * The iteration order only changes when the map is modified.
 * Values are iterated in the same order as their associated keys,
 * so iterating the [keys] and [values] in parallel
 * will give matching key and value pairs.
 */
let DartHashMap = DartHashMap_1 = class DartHashMap extends AbstractDartMap {
    constructor(_) {
        super();
    }
    /**
     * Creates an unordered hash-table based [Map].
     *
     * The created map is not ordered in any way. When iterating the keys or
     * values, the iteration order is unspecified except that it will stay the
     * same as long as the map isn't changed.
     *
     * If [equals] is provided, it is used to compare the keys in the table with
     * new keys. If [equals] is omitted, the key's own [Object.==] is used
     * instead.
     *
     * Similar, if [hashCode] is provided, it is used to produce a hash value
     * for keys in order to place them in the hash table. If it is omitted, the
     * key's own [Object.hashCode] is used.
     *
     * If using methods like [[]], [remove] and [containsKey] together
     * with a custom equality and hashcode, an extra `isValidKey` function
     * can be supplied. This function is called before calling [equals] or
     * [hashCode] with an argument that may not be a [K] instance, and if the
     * call returns false, the key is assumed to not be in the set.
     * The [isValidKey] function defaults to just testing if the object is a
     * [K] instance.
     *
     * Example:
     *
     *     new HashMap<int,int>(equals: (int a, int b) => (b - a) % 5 == 0,
     *                          hashCode: (int e) => e % 5)
     *
     * This example map does not need an `isValidKey` function to be passed.
     * The default function accepts only `int` values, which can safely be
     * passed to both the `equals` and `hashCode` functions.
     *
     * If neither `equals`, `hashCode`, nor `isValidKey` is provided,
     * the default `isValidKey` instead accepts all keys.
     * The default equality and hashcode operations are assumed to work on all
     * objects.
     *
     * Likewise, if `equals` is [identical], `hashCode` is [identityHashCode]
     * and `isValidKey` is omitted, the resulting map is identity based,
     * and the `isValidKey` defaults to accepting all keys.
     * Such a map can be created directly using [HashMap.identity].
     *
     * The used `equals` and `hashCode` method should always be consistent,
     * so that if `equals(a, b)` then `hashCode(a) == hashCode(b)`. The hash
     * of an object, or what it compares equal to, should not change while the
     * object is a key in the map. If it does change, the result is unpredictable.
     *
     * If you supply one of [equals] and [hashCode],
     * you should generally also to supply the other.
     */
    /*
    external factory HashMap(
        {bool equals(K key1, K key2),
    int hashCode(K key),
    bool isValidKey(potentialKey)});*/
    /**
     * Creates an unordered identity-based map.
     *
     * Effectively a shorthand for:
     *
     *     new HashMap<K, V>(equals: identical,
     *                       hashCode: identityHashCode)
     */
    /* external factory HashMap.identity();*/
    /**
     * Creates a [HashMap] that contains all key/value pairs of [other].
     */
    static _from(other) {
        let result = new DartHashMap_1();
        other.forEach((k, v) => {
            result[OPERATOR_INDEX_ASSIGN](k, v);
        });
        return result;
    }
    /**
     * Creates a [HashMap] where the keys and values are computed from the
     * [iterable].
     *
     * For each element of the [iterable] this constructor computes a key/value
     * pair, by applying [key] and [value] respectively.
     *
     * The keys of the key/value pairs do not need to be unique. The last
     * occurrence of a key will simply overwrite any previous value.
     *
     * If no values are specified for [key] and [value] the default is the
     * identity function.
     */
    static _fromIterable(iterable, _) {
        let { key, value } = Object.assign({}, _);
        let map = new DartHashMap_1();
        DartMaps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
    }
    /**
     * Creates a [HashMap] associating the given [keys] to [values].
     *
     * This constructor iterates over [keys] and [values] and maps each element of
     * [keys] to the corresponding element of [values].
     *
     * If [keys] contains the same object multiple times, the last occurrence
     * overwrites the previous value.
     *
     * It is an error if the two [Iterable]s don't have the same length.
     */
    static _fromIterables(keys, values) {
        let map = new DartHashMap_1();
        DartMaps._fillMapWithIterables(map, keys, values);
        return map;
    }
    static _create(_) {
        let { equals, hashCode, isValidKey } = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _HashMap();
                }
                hashCode = _defaultHashCode;
            }
            else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _IdentityHashMap();
                }
                if (equals == null) {
                    equals = _defaultEquals;
                }
            }
        }
        else {
            if (hashCode == null) {
                hashCode = _defaultHashCode;
            }
            if (equals == null) {
                equals = _defaultEquals;
            }
        }
        return new _CustomHashMap(equals, hashCode, isValidKey);
    }
    static _identity() {
        return new _IdentityHashMap();
    }
};
__decorate([
    namedFactory
], DartHashMap, "_from", null);
__decorate([
    namedFactory
], DartHashMap, "_fromIterable", null);
__decorate([
    namedFactory
], DartHashMap, "_fromIterables", null);
__decorate([
    defaultFactory
], DartHashMap, "_create", null);
__decorate([
    namedFactory
], DartHashMap, "_identity", null);
DartHashMap = DartHashMap_1 = __decorate([
    DartClass
], DartHashMap);
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.collection;
/**
 * An unordered hash-table based [Set] implementation.
 *
 * The elements of a `HashSet` must have consistent equality
 * and hashCode implementations. This means that the equals operation
 * must define a stable equivalence relation on the elements (reflexive,
 * symmetric, transitive, and consistent over time), and that the hashCode
 * must consistent with equality, so that the same for objects that are
 * considered equal.
 *
 * The set allows `null` as an element.
 *
 * Most simple operations on `HashSet` are done in (potentially amortized)
 * constant time: [add], [contains], [remove], and [length], provided the hash
 * codes of objects are well distributed.
 *
 * The iteration order of the set is not specified and depends on
 * the hashcodes of the provided elements. However, the order is stable:
 * multiple iterations over the same set produce the same order, as long as
 * the set is not modified.
 */
let DartHashSet = DartHashSet_1 = class DartHashSet {
    constructor(_) {
    }
    /**
     * Create a hash set using the provided [equals] as equality.
     *
     * The provided [equals] must define a stable equivalence relation, and
     * [hashCode] must be consistent with [equals]. If the [equals] or [hashCode]
     * methods won't work on all objects, but only on some instances of E, the
     * [isValidKey] predicate can be used to restrict the keys that the functions
     * are applied to.
     * Any key for which [isValidKey] returns false is automatically assumed
     * to not be in the set when asking `contains`.
     *
     * If [equals] or [hashCode] are omitted, the set uses
     * the elements' intrinsic [Object.==] and [Object.hashCode].
     *
     * If you supply one of [equals] and [hashCode],
     * you should generally also to supply the other.
     *
     * If the supplied `equals` or `hashCode` functions won't work on all [E]
     * objects, and the map will be used in a setting where a non-`E` object
     * is passed to, e.g., `contains`, then the [isValidKey] function should
     * also be supplied.
     *
     * If [isValidKey] is omitted, it defaults to testing if the object is an
     * [E] instance. That means that:
     *
     *     new HashSet<int>(equals: (int e1, int e2) => (e1 - e2) % 5 == 0,
     *                      hashCode: (int e) => e % 5)
     *
     * does not need an `isValidKey` argument, because it defaults to only
     * accepting `int` values which are accepted by both `equals` and `hashCode`.
     *
     * If neither `equals`, `hashCode`, nor `isValidKey` is provided,
     * the default `isValidKey` instead accepts all values.
     * The default equality and hashcode operations are assumed to work on all
     * objects.
     *
     * Likewise, if `equals` is [identical], `hashCode` is [identityHashCode]
     * and `isValidKey` is omitted, the resulting set is identity based,
     * and the `isValidKey` defaults to accepting all keys.
     * Such a map can be created directly using [HashSet.identity].
     */
    /*
    external factory HashSet(
        {bool equals(E e1, E e2),
    int hashCode(E e),
    bool isValidKey(potentialKey)});*/
    /**
     * Creates an unordered identity-based set.
     *
     * Effectively a shorthand for:
     *
     *     new HashSet<E>(equals: identical,
     *                    hashCode: identityHashCode)
     */
    /*
    external factory HashSet.identity();*/
    /**
     * Create a hash set containing all [elements].
     *
     * Creates a hash set as by `new HashSet<E>()` and adds all given [elements]
     * to the set. The elements are added in order. If [elements] contains
     * two entries that are equal, but not identical, then the first one is
     * the one in the resulting set.
     *
     * All the [elements] should be assignable to [E].
     * The `elements` iterable itself may have any element type, so this
     * constructor can be used to down-cast a `Set`, for example as:
     *
     *     Set<SuperType> superSet = ...;
     *     Set<SubType> subSet =
     *         new HashSet<SubType>.from(superSet.where((e) => e is SubType));
     */
    static _from(elements) {
        let result = new DartHashSet_1();
        for (let e of elements) {
            let element = e /*=E*/;
            result.add(element);
        }
        return result;
    }
    /**
     * Provides an iterator that iterates over the elements of this set.
     *
     * The order of iteration is unspecified,
     * but consistent between changes to the set.
     */
    get iterator() {
        throw new Error('abstract');
    }
    //@patch
    static _create(_) {
        let { equals, hashCode, isValidKey } = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _HashSet();
                }
                hashCode = _defaultHashCode;
            }
            else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _IdentityHashSet();
                }
                if (equals == null) {
                    equals = _defaultEquals;
                }
            }
        }
        else {
            if (hashCode == null) {
                hashCode = _defaultHashCode;
            }
            if (equals == null) {
                equals = _defaultEquals;
            }
        }
        return new _CustomHashSet(equals, hashCode, isValidKey);
    }
    static _identity() {
        return new _IdentityHashSet();
    }
    add(value) {
        return undefined;
    }
    addAll(elements) {
    }
    clear() {
    }
    contains(value) {
        return undefined;
    }
    containsAll(other) {
        return undefined;
    }
    difference(other) {
        return undefined;
    }
    intersection(other) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    lookup(object) {
        return undefined;
    }
    remove(value) {
        return undefined;
    }
    removeAll(elements) {
    }
    removeWhere(test) {
    }
    retainAll(elements) {
    }
    retainWhere(test) {
    }
    toSet() {
        return undefined;
    }
    union(other) {
        return undefined;
    }
    [Symbol.iterator]() {
        return this.iterator;
    }
    any(f) {
        return false;
    }
    elementAt(index) {
        return undefined;
    }
    every(f) {
        return false;
    }
    expand(f) {
        return undefined;
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    forEach(f) {
    }
    get isEmpty() {
        return false;
    }
    get isNotEmpty() {
        return false;
    }
    join(separator) {
        return "";
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    where(test) {
        return undefined;
    }
};
__decorate([
    Abstract
], DartHashSet.prototype, "iterator", null);
__decorate([
    Abstract
], DartHashSet.prototype, "add", null);
__decorate([
    Abstract
], DartHashSet.prototype, "addAll", null);
__decorate([
    Abstract
], DartHashSet.prototype, "clear", null);
__decorate([
    Abstract
], DartHashSet.prototype, "contains", null);
__decorate([
    Abstract
], DartHashSet.prototype, "containsAll", null);
__decorate([
    Abstract
], DartHashSet.prototype, "difference", null);
__decorate([
    Abstract
], DartHashSet.prototype, "intersection", null);
__decorate([
    Abstract
], DartHashSet.prototype, "length", null);
__decorate([
    Abstract
], DartHashSet.prototype, "lookup", null);
__decorate([
    Abstract
], DartHashSet.prototype, "remove", null);
__decorate([
    Abstract
], DartHashSet.prototype, "removeAll", null);
__decorate([
    Abstract
], DartHashSet.prototype, "removeWhere", null);
__decorate([
    Abstract
], DartHashSet.prototype, "retainAll", null);
__decorate([
    Abstract
], DartHashSet.prototype, "retainWhere", null);
__decorate([
    Abstract
], DartHashSet.prototype, "toSet", null);
__decorate([
    Abstract
], DartHashSet.prototype, "union", null);
__decorate([
    Abstract
], DartHashSet.prototype, "any", null);
__decorate([
    Abstract
], DartHashSet.prototype, "elementAt", null);
__decorate([
    Abstract
], DartHashSet.prototype, "every", null);
__decorate([
    Abstract
], DartHashSet.prototype, "expand", null);
__decorate([
    Abstract
], DartHashSet.prototype, "first", null);
__decorate([
    Abstract
], DartHashSet.prototype, "firstWhere", null);
__decorate([
    Abstract
], DartHashSet.prototype, "fold", null);
__decorate([
    Abstract
], DartHashSet.prototype, "forEach", null);
__decorate([
    Abstract
], DartHashSet.prototype, "isEmpty", null);
__decorate([
    Abstract
], DartHashSet.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], DartHashSet.prototype, "join", null);
__decorate([
    Abstract
], DartHashSet.prototype, "last", null);
__decorate([
    Abstract
], DartHashSet.prototype, "lastWhere", null);
__decorate([
    Abstract
], DartHashSet.prototype, "map", null);
__decorate([
    Abstract
], DartHashSet.prototype, "reduce", null);
__decorate([
    Abstract
], DartHashSet.prototype, "single", null);
__decorate([
    Abstract
], DartHashSet.prototype, "singleWhere", null);
__decorate([
    Abstract
], DartHashSet.prototype, "skip", null);
__decorate([
    Abstract
], DartHashSet.prototype, "skipWhile", null);
__decorate([
    Abstract
], DartHashSet.prototype, "take", null);
__decorate([
    Abstract
], DartHashSet.prototype, "takeWhile", null);
__decorate([
    Abstract
], DartHashSet.prototype, "toList", null);
__decorate([
    Abstract
], DartHashSet.prototype, "where", null);
__decorate([
    namedFactory
], DartHashSet, "_from", null);
__decorate([
    defaultFactory
], DartHashSet, "_create", null);
__decorate([
    namedFactory
], DartHashSet, "_identity", null);
DartHashSet = DartHashSet_1 = __decorate([
    DartClass
], DartHashSet);
// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// Efficient JavaScript based implementation of a linked hash map used as a
// backing map for constant maps and the [LinkedHashMap] patch
// part of _js_helper;
/* const bool.fromEnvironment("dart2js.use.es6.maps");*/
function _isStringKey(key) {
    return _dart.is(key, 'string');
}
function _isNumericKey(key) {
    // Only treat unsigned 30-bit integers as numeric keys. This way,
    // we avoid converting them to strings when we use them as keys in
    // the JavaScript hash table object.
    return _dart.is(key, 'num') && (key & 0x3ffffff) === key /* JS('bool', '(# & 0x3ffffff) === #', key, key)*/;
}
class DartEs6LinkedHashMap extends DartJsLinkedHashMap {
    //@override
    _getTableCell(table, key) {
        return table.get(key) /*JS('var', '#.get(#)', table, key)*/;
    }
    //@override
    /*=List<LinkedHashMapCell<K, V>>*/
    _getTableBucket(table, key) {
        return table.get(key) /*JS('var', '#.get(#)', table, key)*/;
    }
    //@override
    _setTableEntry(table, key, value) {
        //JS('void', '#.set(#, #)', table, key, value);
        table.set(key, value);
    }
    //@override
    _deleteTableEntry(table, key) {
        //JS('void', '#.delete(#)', table, key);
        table.delete(key);
    }
    //@override
    _containsTableEntry(table, key) {
        return table.has(key) /* JS('bool', '#.has(#)', table, key)*/;
    }
    //@override
    _newHashTable() {
        return new Map() /*JS('var', 'new Map()')*/;
    }
}
class LinkedHashMapCell {
    constructor(hashMapCellKey, hashMapCellValue) {
        this.hashMapCellKey = hashMapCellKey;
        this.hashMapCellValue = hashMapCellValue;
    }
}
class DartLinkedHashMapKeyIterable extends DartEfficientLengthIterable {
    constructor(_map) {
        super();
        this._map = _map;
    }
    get length() {
        return this._map._length;
    }
    get isEmpty() {
        return this._map._length == 0;
    }
    get iterator() {
        return new DartLinkedHashMapKeyIterator(this._map, this._map._modifications);
    }
    contains(element) {
        return this._map.containsKey(element);
    }
    forEach(f) {
        let cell = this._map._first;
        let modifications = this._map._modifications;
        while (cell != null) {
            f(cell.hashMapCellKey);
            if (modifications != this._map._modifications) {
                throw new ConcurrentModificationError(this._map);
            }
            cell = cell._next;
        }
    }
}
class DartLinkedHashMapKeyIterator {
    constructor(_map, _modifications) {
        this._map = _map;
        this._modifications = _modifications;
        this._cell = this._map._first;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        if (this._modifications != this._map._modifications) {
            throw new ConcurrentModificationError(this._map);
        }
        else if (this._cell == null) {
            this._current = null;
            return false;
        }
        else {
            this._current = this._cell.hashMapCellKey;
            this._cell = this._cell._next;
            return true;
        }
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//@patch
//part of dart.collection;
/**
 * A [LinkedHashSet] is a hash-table based [Set] implementation.
 *
 * The `LinkedHashSet` also keep track of the order that elements were inserted
 * in, and iteration happens in first-to-last insertion order.
 *
 * The elements of a `LinkedHashSet` must have consistent [Object.==]
 * and [Object.hashCode] implementations. This means that the `==` operator
 * must define a stable equivalence relation on the elements (reflexive,
 * symmetric, transitive, and consistent over time), and that `hashCode`
 * must be the same for objects that are considered equal by `==`.
 *
 * The set allows `null` as an element.
 *
 * Iteration of elements is done in element insertion order.
 * An element that was added after another will occur later in the iteration.
 * Adding an element that is already in the set
 * does not change its position in the iteration order,
 * but removing an element and adding it again,
 * will make it the last element of an iteration.
 *
 * Most simple operations on `HashSet` are done in (potentially amortized)
 * constant time: [add], [contains], [remove], and [length], provided the hash
 * codes of objects are well distributed..
 */
let DartLinkedHashSet = DartLinkedHashSet_1 = class DartLinkedHashSet {
    /**
     * Create an insertion-ordered hash set using the provided
     * [equals] and [hashCode].
     *
     * The provided [equals] must define a stable equivalence relation, and
     * [hashCode] must be consistent with [equals]. If the [equals] or [hashCode]
     * methods won't work on all objects, but only on some instances of E, the
     * [isValidKey] predicate can be used to restrict the keys that the functions
     * are applied to.
     * Any key for which [isValidKey] returns false is automatically assumed
     * to not be in the set when asking `contains`.
     *
     * If [equals] or [hashCode] are omitted, the set uses
     * the elements' intrinsic [Object.==] and [Object.hashCode],
     * and [isValidKey] is ignored since these operations are assumed
     * to work on all objects.
     *
     * If you supply one of [equals] and [hashCode],
     * you should generally also to supply the other.
     *
     * If the supplied `equals` or `hashCode` functions won't work on all [E]
     * objects, and the map will be used in a setting where a non-`E` object
     * is passed to, e.g., `contains`, then the [isValidKey] function should
     * also be supplied.
     *
     * If [isValidKey] is omitted, it defaults to testing if the object is an
     * [E] instance. That means that:
     *
     *     new LinkedHashSet<int>(equals: (int e1, int e2) => (e1 - e2) % 5 == 0,
     *                            hashCode: (int e) => e % 5)
     *
     * does not need an `isValidKey` argument, because it defaults to only
     * accepting `int` values which are accepted by both `equals` and `hashCode`.
     *
     * If neither `equals`, `hashCode`, nor `isValidKey` is provided,
     * the default `isValidKey` instead accepts all values.
     * The default equality and hashcode operations are assumed to work on all
     * objects.
     *
     * Likewise, if `equals` is [identical], `hashCode` is [identityHashCode]
     * and `isValidKey` is omitted, the resulting set is identity based,
     * and the `isValidKey` defaults to accepting all keys.
     * Such a map can be created directly using [LinkedHashSet.identity].
     */
    /*
    external factory LinkedHashSet(
        {bool equals(E e1, E e2),
    int hashCode(E e),
    bool isValidKey(potentialKey)});
    */
    constructor(_) {
    }
    /**
     * Create a linked hash set containing all [elements].
     *
     * Creates a linked hash set as by `new LinkedHashSet<E>()` and adds each
     * element of `elements` to this set in the order they are iterated.
     *
     * All the [elements] should be assignable to [E].
     * The `elements` iterable itself may have any element type,
     * so this constructor can be used to down-cast a `Set`, for example as:
     *
     *     Set<SuperType> superSet = ...;
     *     Iterable<SuperType> tmp = superSet.where((e) => e is SubType);
     *     Set<SubType> subSet = new LinkedHashSet<SubType>.from(tmp);
     */
    static _from(elements) {
        let result = new DartLinkedHashSet_1();
        for (let element of elements) {
            let e = element /*=E*/;
            result.add(e);
        }
        return result;
    }
    /**
     * Executes a function on each element of the set.
     *
     * The elements are iterated in insertion order.
     */
    forEach(action) {
        throw 'abstract';
    }
    /**
     * Provides an iterator that iterates over the elements in insertion order.
     */
    get iterator() {
        throw 'absract';
    }
    //@patch
    static _create(_) {
        let { equals, hashCode, isValidKey } = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _LinkedHashSet();
                }
                hashCode = _defaultHashCode;
            }
            else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _LinkedIdentityHashSet();
                }
                if (equals == null) {
                    equals = _defaultEquals;
                }
            }
        }
        else {
            if (hashCode == null) {
                hashCode = _defaultHashCode;
            }
            if (equals == null) {
                equals = _defaultEquals;
            }
        }
        return new _LinkedCustomHashSet(equals, hashCode, isValidKey);
    }
    static _identity() {
        return new _LinkedIdentityHashSet();
    }
    [Symbol.iterator]() {
        return this.iterator;
    }
    add(value) {
        return undefined;
    }
    addAll(elements) {
    }
    any(f) {
        return false;
    }
    clear() {
    }
    contains(value) {
        throw new Error('abstract');
    }
    containsAll(other) {
        return undefined;
    }
    difference(other) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    every(f) {
        return false;
    }
    expand(f) {
        return undefined;
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    intersection(other) {
        return undefined;
    }
    get isEmpty() {
        return false;
    }
    get isNotEmpty() {
        return false;
    }
    join(separator) {
        return "";
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    lookup(object) {
        return undefined;
    }
    map(f) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    remove(value) {
        return undefined;
    }
    removeAll(elements) {
    }
    removeWhere(test) {
    }
    retainAll(elements) {
    }
    retainWhere(test) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    union(other) {
        return undefined;
    }
    where(test) {
        return undefined;
    }
};
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "forEach", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "iterator", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "add", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "addAll", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "any", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "clear", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "contains", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "containsAll", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "difference", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "elementAt", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "every", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "expand", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "first", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "firstWhere", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "fold", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "intersection", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "isEmpty", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "join", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "last", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "lastWhere", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "length", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "lookup", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "map", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "reduce", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "remove", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "removeAll", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "removeWhere", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "retainAll", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "retainWhere", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "single", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "singleWhere", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "skip", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "skipWhile", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "take", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "takeWhile", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "toList", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "toSet", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "union", null);
__decorate([
    Abstract
], DartLinkedHashSet.prototype, "where", null);
__decorate([
    namedFactory
], DartLinkedHashSet, "_from", null);
__decorate([
    defaultFactory
], DartLinkedHashSet, "_create", null);
__decorate([
    namedFactory
], DartLinkedHashSet, "_identity", null);
DartLinkedHashSet = DartLinkedHashSet_1 = __decorate([
    DartClass
], DartLinkedHashSet);
/**
 * Interface used by types that have an intrinsic ordering.
 *
 * The [compareTo] operation defines a total ordering of objects,
 * which can be used for ordering and sorting.
 *
 * The [Comparable] interface should be used for the natural ordering of a type.
 * If a type can be ordered in more than one way,
 * and none of them is the obvious natural ordering,
 * then it might be better not to use the [Comparable] interface,
 * and to provide separate [Comparator]s instead.
 *
 * It is recommended that the order of a [Comparable] agrees
 * with its operator [==] equality (`a.compareTo(b) == 0` iff `a == b`),
 * but this is not a requirement.
 * For example, [double] and [DateTime] have `compareTo` methods
 * that do not agree with operator [==].
 * For doubles the [compareTo] method is more precise than the equality,
 * and for [DateTime] it is less precise.
 *
 * Examples:
 *
 *      (0.0).compareTo(-0.0);  // => 1
 *      0.0 == -0.0;            // => true
 *      var dt = new DateTime.now();
 *      var dt2 = dt.toUtc();
 *      dt == dt2;              // => false
 *      dt.compareTo(dt2);      // => 0
 *
 * The [Comparable] interface does not imply the existence
 * of the comparison operators `<`, `<=`, `>` and `>=`.
 * These should only be defined
 * if the ordering is a less-than/greater-than ordering,
 * that is, an ordering where you would naturally
 * use the words "less than" about the order of two elements.
 *
 * If the equality operator and [compareTo] disagree,
 * the comparison operators should follow the equality operator,
 * and will likely also disagree with [compareTo].
 * Otherwise they should match the [compareTo] method,
 * so that `a < b` iff `a.compareTo(b) < 0`.
 *
 * The [double] class defines comparison operators
 * that are compatible with equality.
 * The operators differ from `double.compareTo` on -0.0 and NaN.
 *
 * The [DateTime] class has no comparison operators, instead it has the more
 * precisely named [DateTime.isBefore] and [DateTime.isAfter].
 */
export class DartComparable {
    /**
     * A [Comparator] that compares one comparable to another.
     *
     * It returns the result of `a.compareTo(b)`.
     *
     * This utility function is used as the default comparator
     * for ordering collections, for example in the [List] sort function.
     */
    static compare(a, b) {
        return a.compareTo(b);
    }
}
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// Patch file for dart:core classes.
//@patch
// Patch for Object implementation.
//@patch
class DartObject {
    //@patch
    equals(other) {
        return identical(this, other);
    }
    //@patch
    get hashCode() {
        return DartPrimitives.objectHashCode(this);
    }
    //@patch
    toString() {
        return DartPrimitives.objectToHumanReadableString(this);
    }
}
__decorate([
    Operator(Op.EQUALS)
], DartObject.prototype, "equals", null);
/*
@patch
Type get runtimeType => getRuntimeType(this);
}

@patch
class Null {
    @patch
    int get hashCode => super.hashCode;
}

// Patch for Function implementation.
@patch
class Function {
    @patch
    static apply(Function function, List positionalArguments,
    [Map<Symbol, dynamic> namedArguments]) {
    // The lazy and startup emitter use a different implementation. To keep the
    // method small and inlinable, just select the method.
    return JS_GET_FLAG("IS_FULL_EMITTER")
? _apply1(function, positionalArguments, namedArguments)
: _apply2(function, positionalArguments, namedArguments);
}

static _apply1(function, positionalArguments, namedArguments) {
    return Primitives.applyFunction(
        function,
        positionalArguments,
        // Use this form so that if namedArguments is always null, we can
        // tree-shake _symbolMapToStringMap.
        namedArguments == null ? null : _symbolMapToStringMap(namedArguments));
}

static _apply2(function, positionalArguments, namedArguments) {
    return Primitives.applyFunction2(
        function,
        positionalArguments,
        // Use this form so that if namedArguments is always null, we can
        // tree-shake _symbolMapToStringMap.
        namedArguments == null ? null : _symbolMapToStringMap(namedArguments));
}
}

// Patch for Expando implementation.
@patch
class Expando<T> {
    static const String _EXPANDO_PROPERTY_NAME = 'expando\$values';

    // Incremented to make unique keys.
    static int _keyCount = 0;

    // Stores either a JS WeakMap or a "unique" string key.
    final Object _jsWeakMapOrKey;

    @patch
    Expando([String name])
        : this.name = name,
    _jsWeakMapOrKey = JS('bool', 'typeof WeakMap == "function"')
        ? JS('=Object|Null', 'new WeakMap()')
        : _createKey();

    @patch
    T operator [](Object object) {
    if (_jsWeakMapOrKey is! String) {
    _checkType(object); // WeakMap doesn't check on reading, only writing.
    return JS('', '#.get(#)', _jsWeakMapOrKey, object);
}
return _getFromObject(_jsWeakMapOrKey, object);
}

@patch
void operator []=(Object object, T value) {
    if (_jsWeakMapOrKey is! String) {
        JS('void', '#.set(#, #)', _jsWeakMapOrKey, object, value);
    } else {
        _setOnObject(_jsWeakMapOrKey, object, value);
    }
}

static Object _getFromObject(String key, Object object) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    return (values == null) ? null : Primitives.getProperty(values, key);
}

static void _setOnObject(String key, Object object, Object value) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    if (values == null) {
        values = new Object();
        Primitives.setProperty(object, _EXPANDO_PROPERTY_NAME, values);
    }
    Primitives.setProperty(values, key, value);
}

static String _createKey() => "expando\$key\$${_keyCount++}";

static _checkType(object) {
    if (object == null || object is bool || object is num || object is String) {
        throw new ArgumentError.value(object,
            "Expandos are not allowed on strings, numbers, booleans or null");
    }
}
}

@patch
class int {
    @patch
    static int parse(String source, {int radix, int onError(String source)}) {
    return Primitives.parseInt(source, radix, onError);
}

@patch
factory int.fromEnvironment(String name, {int defaultValue}) {
    throw new UnsupportedError(
        'int.fromEnvironment can only be used as a const constructor');
}
}

@patch
class double {
    @patch
    static double parse(String source, [double onError(String source)]) {
    return Primitives.parseDouble(source, onError);
}
}

@patch
class Error {
    @patch
    static String _objectToString(Object object) {
    // Closures all have useful and safe toString methods.
    if (object is Closure) return object.toString();
    return Primitives.objectToHumanReadableString(object);
}

@patch
static String _stringToSafeString(String string) {
    return jsonEncodeNative(string);
}

@patch
StackTrace get stackTrace => Primitives.extractStackTrace(this);
}

@patch
class FallThroughError {
    @patch
    String toString() => super.toString();
}

@patch
class AbstractClassInstantiationError {
    @patch
    String toString() => "Cannot instantiate abstract class: '$_className'";
}

// Patch for DateTime implementation.
@patch
class DateTime {
    @patch
    DateTime.fromMillisecondsSinceEpoch(int millisecondsSinceEpoch,
{bool isUtc: false})
// `0 + millisecondsSinceEpoch` forces the inferred result to be non-null.
: this._withValue(0 + millisecondsSinceEpoch, isUtc: isUtc);

@patch
DateTime.fromMicrosecondsSinceEpoch(int microsecondsSinceEpoch,
    {bool isUtc: false})
: this._withValue(
    _microsecondInRoundedMilliseconds(microsecondsSinceEpoch),
    isUtc: isUtc);

@patch
DateTime._internal(int year, int month, int day, int hour, int minute,
    int second, int millisecond, int microsecond, bool isUtc)
// checkBool is manually inlined here because dart2js doesn't inline it
// and [isUtc] is usually a constant.
: this.isUtc = isUtc is bool
    ? isUtc
    : throw new ArgumentError.value(isUtc, 'isUtc'),
    _value = checkInt(Primitives.valueFromDecomposedDate(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond + _microsecondInRoundedMilliseconds(microsecond),
        isUtc));

@patch
DateTime._now()
: isUtc = false,
    _value = Primitives.dateNow();

/// Rounds the given [microsecond] to the nearest milliseconds value.
///
/// For example, invoked with argument `2600` returns `3`.
static int _microsecondInRoundedMilliseconds(int microsecond) {
    return (microsecond / 1000).round();
}

@patch
static int _brokenDownDateToValue(int year, int month, int day, int hour,
    int minute, int second, int millisecond, int microsecond, bool isUtc) {
    return Primitives.valueFromDecomposedDate(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond + _microsecondInRoundedMilliseconds(microsecond),
        isUtc);
}

@patch
String get timeZoneName {
    if (isUtc) return "UTC";
    return Primitives.getTimeZoneName(this);
}

@patch
Duration get timeZoneOffset {
    if (isUtc) return new Duration();
    return new Duration(minutes: Primitives.getTimeZoneOffsetInMinutes(this));
}

@patch
DateTime add(Duration duration) {
    return new DateTime._withValue(_value + duration.inMilliseconds,
        isUtc: isUtc);
}

@patch
DateTime subtract(Duration duration) {
    return new DateTime._withValue(_value - duration.inMilliseconds,
        isUtc: isUtc);
}

@patch
Duration difference(DateTime other) {
    return new Duration(milliseconds: _value - other._value);
}

@patch
int get millisecondsSinceEpoch => _value;

@patch
int get microsecondsSinceEpoch => 1000 * _value;

@patch
int get year => Primitives.getYear(this);

@patch
int get month => Primitives.getMonth(this);

@patch
int get day => Primitives.getDay(this);

@patch
int get hour => Primitives.getHours(this);

@patch
int get minute => Primitives.getMinutes(this);

@patch
int get second => Primitives.getSeconds(this);

@patch
int get millisecond => Primitives.getMilliseconds(this);

@patch
int get microsecond => 0;

@patch
int get weekday => Primitives.getWeekday(this);
}

// Patch for Stopwatch implementation.
@patch
class Stopwatch {
    @patch
    static void _initTicker() {
        Primitives.initTicker();
        _frequency = Primitives.timerFrequency;
    }

    @patch
    static int _now() => Primitives.timerTicks();
}*/
/*
//@patch
@DartClass
class DartString extends String {

    constructor(string: string) {
        super(string);
    }


    //@patch
    @namedFactory
    protected static _fromCharCodes(charCodes: DartIterable<int>,
                                    start?: int , end?: int): DartString {
        start = start || 0;
        if (_dart.is(charCodes, JSArray)) {
            return DartString._stringFromJSArray(charCodes as any, start, end);
        }
        if (_dart.is(charCodes, Array)) {
            return DartString._stringFromUint8List(charCodes as any, start, end);
        }
        return DartString._stringFromIterable(charCodes, start, end);
    }

    static fromCharCodes: new(charCodes: DartIterable<int>,
                              start?: int , end?: int) => DartString;

    @namedFactory
    protected static _fromCharCode(charCode: int): DartString {
        return DartPrimitives.stringFromCharCode(charCode);
    }

    static fromCharCode: new(charCode: int) => DartString;

    @namedFactory
    protected static _fromEnvironment(name: string, _?: { defaultValue?: string }) {
        throw new UnsupportedError(
            'String.fromEnvironment can only be used as a const constructor');
    }

    protected static _stringFromJSArray(list: DartList<any>, start: int, endOrNull: int): DartString {
        let len = list.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        if (start > 0 || end < len) {
            list = list.sublist(start, end);
        }
        return DartPrimitives.stringFromCharCodes(list);
    }

    protected static _stringFromUint8List(
        charCodes: Array<int>, start: int, endOrNull: int): DartString {
        let len = charCodes.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        return DartPrimitives.stringFromNativeUint8List(charCodes, start, end);
    }

    static _stringFromIterable(
        charCodes: DartIterable<int>, start: int, end: int): DartString {
        if (start < 0) throw new RangeError.range(start, 0, charCodes.length);
        if (end != null && end < start) {
            throw new RangeError.range(end, start, charCodes.length);
        }
        let it = charCodes.iterator;
        for (let i = 0; i < start; i++) {
            if (!it.moveNext()) {
                throw new RangeError.range(start, 0, i);
            }
        }
        let list = new DartList<int>();
        if (end == null) {
            while (it.moveNext()) list.add(it.current);
        } else {
            for (let i = start; i < end; i++) {
                if (!it.moveNext()) {
                    throw new RangeError.range(end, start, i);
                }
                list.add(it.current);
            }
        }
        return DartPrimitives.stringFromCharCodes(list);
    }

    get isEmpty(): bool {
        return this.length == 0;
    }
}
*/
/*
@patch
class bool {
    @patch
    factory bool.fromEnvironment(String name, {bool defaultValue: false}) {
    throw new UnsupportedError(
        'bool.fromEnvironment can only be used as a const constructor');
}

@patch
int get hashCode => super.hashCode;
}

@patch
class RegExp {
    @NoInline()
    @patch
    factory RegExp(String source,
{bool multiLine: false, bool caseSensitive: true}) =>
new JSSyntaxRegExp(source,
    multiLine: multiLine, caseSensitive: caseSensitive);
}

// Patch for 'identical' function.
@NoInline() // No inlining since we recognize the call in optimizer.
@patch
bool identical(Object a, Object b) {
    return JS('bool', '(# == null ? # == null : # === #)', a, b, a, b);
}
*/
/*
@patch
class NoSuchMethodError {
    @patch
    NoSuchMethodError(Object receiver, Symbol memberName,
    List positionalArguments, Map<Symbol, dynamic> namedArguments,
    [List existingArgumentNames = null])
: _receiver = receiver,
    _memberName = memberName,
    _arguments = positionalArguments,
    _namedArguments = namedArguments,
    _existingArgumentNames = existingArgumentNames;

    @patch
    String toString() {
        StringBuffer sb = new StringBuffer('');
        String comma = '';
        if (_arguments != null) {
            for (var argument in _arguments) {
                sb.write(comma);
                sb.write(Error.safeToString(argument));
                comma = ', ';
            }
        }
        if (_namedArguments != null) {
            _namedArguments.forEach((Symbol key, var value) {
                sb.write(comma);
                sb.write(_symbolToString(key));
                sb.write(": ");
                sb.write(Error.safeToString(value));
                comma = ', ';
            });
        }
        String memberName = _symbolToString(_memberName);
        String receiverText = Error.safeToString(_receiver);
        String actualParameters = '$sb';
        if (_existingArgumentNames == null) {
            return "NoSuchMethodError: method not found: '$memberName'\n"
            "Receiver: ${receiverText}\n"
            "Arguments: [$actualParameters]";
        } else {
            String formalParameters = _existingArgumentNames.join(', ');
            return "NoSuchMethodError: incorrect number of arguments passed to "
            "method named '$memberName'\n"
            "Receiver: ${receiverText}\n"
            "Tried calling: $memberName($actualParameters)\n"
            "Found: $memberName($formalParameters)";
        }
    }
}

@patch
class Uri {
    @patch
    static Uri get base {
        String uri = Primitives.currentUri();
        if (uri != null) return Uri.parse(uri);
        throw new UnsupportedError("'Uri.base' is not supported");
    }
}

@patch
class _Uri {
    @patch
    static bool get _isWindows => false;

    // Matches a String that _uriEncodes to itself regardless of the kind of
    // component.  This corresponds to [_unreservedTable], i.e. characters that
    // are not encoded by any encoding table.
    static final RegExp _needsNoEncoding = new RegExp(r'^[\-\.0-9A-Z_a-z~]*$');

    /**
     * This is the internal implementation of JavaScript's encodeURI function.
     * It encodes all characters in the string [text] except for those
     * that appear in [canonicalTable], and returns the escaped string.
     * /
    @patch
    static String _uriEncode(List<int> canonicalTable, String text,
    Encoding encoding, bool spaceToPlus) {
    if (identical(encoding, UTF8) && _needsNoEncoding.hasMatch(text)) {
    return text;
}

// Encode the string into bytes then generate an ASCII only string
// by percent encoding selected bytes.
StringBuffer result = new StringBuffer('');
var bytes = encoding.encode(text);
for (int i = 0; i < bytes.length; i++) {
    int byte = bytes[i];
    if (byte < 128 &&
        ((canonicalTable[byte >> 4] & (1 << (byte & 0x0f))) != 0)) {
        result.writeCharCode(byte);
    } else if (spaceToPlus && byte == _SPACE) {
        result.write('+');
    } else {
        const String hexDigits = '0123456789ABCDEF';
        result.write('%');
        result.write(hexDigits[(byte >> 4) & 0x0f]);
        result.write(hexDigits[byte & 0x0f]);
    }
}
return result.toString();
}
}

Uri _resolvePackageUri(Uri packageUri) {
    assert(packageUri.scheme == "package");
    if (packageUri.hasAuthority) {
        throw new ArgumentError("Package-URI must not have a host: $packageUri");
    }
    var resolved = Uri.base.resolve("packages/${packageUri.path}");
    return resolved;
}

bool _hasErrorStackProperty = JS('bool', 'new Error().stack != void 0');

@patch
class StackTrace {
    @patch
    @NoInline()
    static StackTrace get current {
        if (_hasErrorStackProperty) {
            return getTraceFromException(JS('', 'new Error()'));
        }
        // Fallback if new Error().stack does not exist.
        // Currently only required for IE 11.
        try {
            throw '';
        } catch (_, stackTrace) {
            return stackTrace;
        }
    }
}

// Called from kernel generated code.
_malformedTypeError(message) => new RuntimeError(message);

// Called from kernel generated code.
_genericNoSuchMethod(receiver, memberName, positionalArguments, namedArguments,
    existingArguments) {
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedConstructorError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate an error that reads:
    //
    //     No constructor '$memberName' declared in class '$receiver'.

    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticGetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticSetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticMethodError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelGetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelSetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelMethodError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}
*/ // Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.core;
/**
 * Check whether two references are to the same object.
 */
export function identical(a, b) {
    // need to check
    return a == null ? b == null : a === b;
}
/**
 * Returns the identity hash code of `object`.
 *
 * Returns the same value as `object.hashCode` if [object] has not overridden
 * [Object.hashCode]. Returns the value that [Object.hashCode] would return
 * on this object, even if `hashCode` has been overridden.
 *
 * This hash code is compatible with [identical].
 */
/* external*/
export function identityHashCode(object) {
    return DartPrimitives.objectHashCode(object);
} // Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.collection;
/**
 * This [Iterable] mixin implements all [Iterable] members except `iterator`.
 *
 * All other methods are implemented in terms of `iterator`.
 */
class DartIterableMixin {
    // This class has methods copied verbatim into:
    // - IterableBase
    // - SetMixin
    // If changing a method here, also change the other copies.
    map(f) {
        return new DartMappedIterable(this, f);
    }
    where(f) {
        return new DartWhereIterable(this, f);
    }
    expand(f) {
        return new DartExpandIterable(this, f);
    }
    contains(element) {
        for (let e of this) {
            if (_dart.equals(e, element))
                return true;
        }
        return false;
    }
    forEach(f) {
        for (let element of this)
            f(element);
    }
    reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
            value = combine(value, iterator.current);
        }
        return value;
    }
    fold(initialValue, combine) {
        var value = initialValue;
        for (let element of this)
            value = combine(value, element);
        return value;
    }
    every(f) {
        for (let element of this) {
            if (!f(element))
                return false;
        }
        return true;
    }
    join(separator /* = "" */) {
        let iterator = this.iterator;
        if (!iterator.moveNext())
            return "";
        let buffer = new DartStringBuffer();
        if (separator == null || separator == "") {
            do {
                buffer.write(`${iterator.current}`);
            } while (iterator.moveNext());
        }
        else {
            buffer.write(`${iterator.current}`);
            while (iterator.moveNext()) {
                buffer.write(separator);
                buffer.write(`${iterator.current}`);
            }
        }
        return buffer.toString();
    }
    any(f) {
        for (let element of this) {
            if (f(element))
                return true;
        }
        return false;
    }
    toList(_) {
        return new DartList.from(this, _);
    }
    toSet() {
        return new DartSet.from(this);
    }
    get length() {
        //assert(this is! EfficientLengthIterable);
        let count = 0;
        let it = this.iterator;
        while (it.moveNext()) {
            count++;
        }
        return count;
    }
    get isEmpty() {
        return !this.iterator.moveNext();
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    take(count) {
        return new DartTakeIterable(this, count);
    }
    takeWhile(test) {
        return new DartTakeWhileIterable(this, test);
    }
    skip(count) {
        return new DartSkipIterable(this, count);
    }
    skipWhile(test) {
        return new DartSkipWhileIterable(this, test);
    }
    get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }
    get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let result;
        do {
            result = it.current;
        } while (it.moveNext());
        return result;
    }
    get single() {
        let it = this.iterator;
        if (!it.moveNext())
            throw DartIterableElementError.noElement();
        let result = it.current;
        if (it.moveNext())
            throw DartIterableElementError.tooMany();
        return result;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        for (let element of this) {
            if (test(element))
                return element;
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test) {
        let result = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                if (foundMatching) {
                    throw DartIterableElementError.tooMany();
                }
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching)
            return result;
        throw DartIterableElementError.noElement();
    }
    elementAt(index) {
        if (!_dart.is(index, 'int'))
            throw new ArgumentError.notNull("index");
        RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
            if (_dart.equals(index, elementIndex))
                return element;
            elementIndex++;
        }
        throw new RangeError.index(index, this, "index", null, elementIndex);
    }
    toString() {
        return DartIterableBase.iterableToShortString(this, '(', ')');
    }
    [Symbol.iterator]() {
        return this.iterator;
    }
    get iterator() {
        throw new Error('abstract');
    }
}
/**
 * Base class for implementing [Iterable].
 *
 * This class implements all methods of [Iterable] except [Iterable.iterator]
 * in terms of `iterator`.
 */
class DartIterableBase extends DartIterable {
    constructor() {
        super();
    }
    /**
     * Convert an `Iterable` to a string like [IterableBase.toString].
     *
     * Allows using other delimiters than '(' and ')'.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [iterable] to a string again.
     */
    static iterableToShortString(iterable, leftDelimiter /*  = '(' */, rightDelimiter /* = ')'*/) {
        leftDelimiter = leftDelimiter || '(';
        rightDelimiter = rightDelimiter || ')';
        if (_isToStringVisiting(iterable)) {
            if (leftDelimiter === "(" && rightDelimiter === ")") {
                // Avoid creating a new string in the "common" case.
                return "(...)";
            }
            return `${leftDelimiter}...${rightDelimiter}`;
        }
        let parts = new DartList();
        _toStringVisiting.add(iterable);
        try {
            _iterablePartsToStrings(iterable, parts);
        }
        finally {
            //assert(identical(_toStringVisiting.last, iterable));
            _toStringVisiting.removeLast();
        }
        return ((sb) => {
            sb.writeAll(parts, ", ");
            sb.write(rightDelimiter);
            return sb;
        })(new DartStringBuffer(leftDelimiter))
            .toString();
    }
    /**
     * Converts an `Iterable` to a string.
     *
     * Converts each elements to a string, and separates the results by ", ".
     * Then wraps the result in [leftDelimiter] and [rightDelimiter].
     *
     * Unlike [iterableToShortString], this conversion doesn't omit any
     * elements or puts any limit on the size of the result.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [iterable] to a string again.
     */
    static iterableToFullString(iterable, leftDelimiter /* = '(' */, rightDelimiter /*= ')' */) {
        leftDelimiter = leftDelimiter || '(';
        rightDelimiter = rightDelimiter || ')';
        if (_isToStringVisiting(iterable)) {
            return `${leftDelimiter}...${rightDelimiter}`;
        }
        let buffer = new DartStringBuffer(leftDelimiter);
        _toStringVisiting.add(iterable);
        try {
            buffer.writeAll(iterable, ", ");
        }
        finally {
            //assert(identical(_toStringVisiting.last, iterable));
            _toStringVisiting.removeLast();
        }
        buffer.write(rightDelimiter);
        return buffer.toString();
    }
}
/**
 * An indexable collection of objects with a length.
 *
 * Subclasses of this class implement different kinds of lists.
 * The most common kinds of lists are:
 *
 * * Fixed-length list.
 *   An error occurs when attempting to use operations
 *   that can change the length of the list.
 *
 * * Growable list. Full implementation of the API defined in this class.
 *
 * The default growable list, as returned by `new List()` or `[]`, keeps
 * an internal buffer, and grows that buffer when necessary. This guarantees
 * that a sequence of [add] operations will each execute in amortized constant
 * time. Setting the length directly may take time proportional to the new
 * length, and may change the internal capacity so that a following add
 * operation will need to immediately increase the buffer capacity.
 * Other list implementations may have different performance behavior.
 *
 * The following code illustrates that some List implementations support
 * only a subset of the API.
 *
 *     List<int> fixedLengthList = new List(5);
 *     fixedLengthList.length = 0;  // Error
 *     fixedLengthList.add(499);    // Error
 *     fixedLengthList[0] = 87;
 *     List<int> growableList = [1, 2];
 *     growableList.length = 0;
 *     growableList.add(499);
 *     growableList[0] = 87;
 *
 * Lists are [Iterable]. Iteration occurs over values in index order. Changing
 * the values does not affect iteration, but changing the valid
 * indices&mdash;that is, changing the list's length&mdash;between iteration
 * steps causes a [ConcurrentModificationError]. This means that only growable
 * lists can throw ConcurrentModificationError. If the length changes
 * temporarily and is restored before continuing the iteration, the iterator
 * does not detect it.
 *
 * It is generally not allowed to modify the list's length (adding or removing
 * elements) while an operation on the list is being performed,
 * for example during a call to [forEach] or [sort].
 * Changing the list's length while it is being iterated, either by iterating it
 * directly or through iterating an [Iterable] that is backed by the list, will
 * break the iteration.
 */
let DartList = DartList_1 = class DartList {
    /**
     * Creates a list of the given length.
     *
     * The created list is fixed-length if [length] is provided.
     *
     *     List fixedLengthList = new List(3);
     *     fixedLengthList.length;     // 3
     *     fixedLengthList.length = 1; // Error
     *
     * The list has length 0 and is growable if [length] is omitted.
     *
     *     List growableList = new List();
     *     growableList.length; // 0;
     *     growableList.length = 3;
     *
     * To create a growable list with a given length, just assign the length
     * right after creation:
     *
     *     List growableList = new List()..length = 500;
     *
     * The [length] must not be negative or null, if it is provided.
     */
    constructor(length) {
    }
    get iterator() {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns a new lazy [Iterable] with elements that are created by
     * calling `f` on each element of this `Iterable` in iteration order.
     *
     * This method returns a view of the mapped elements. As long as the
     * returned [Iterable] is not iterated over, the supplied function [f] will
     * not be invoked. The transformed elements will not be cached. Iterating
     * multiple times over the returned [Iterable] will invoke the supplied
     * function [f] multiple times on the same element.
     *
     * Methods on the returned iterable are allowed to omit calling `f`
     * on any element where the result isn't needed.
     * For example, [elementAt] may call `f` only once.
     */
    map(f) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns a new lazy [Iterable] with all elements that satisfy the
     * predicate [test].
     *
     * The matching elements have the same order in the returned iterable
     * as they have in [iterator].
     *
     * This method returns a view of the mapped elements.
     * As long as the returned [Iterable] is not iterated over,
     * the supplied function [test] will not be invoked.
     * Iterating will not cache results, and thus iterating multiple times over
     * the returned [Iterable] may invoke the supplied
     * function [test] multiple times on the same element.
     */
    where(test) {
        throw new Error("Method not implemented.");
    }
    /**
     * Expands each element of this [Iterable] into zero or more elements.
     *
     * The resulting Iterable runs through the elements returned
     * by [f] for each element of this, in iteration order.
     *
     * The returned [Iterable] is lazy, and calls [f] for each element
     * of this every time it's iterated.
     *
     * Example:
     *
     *     var pairs = [[1, 2], [3, 4]];
     *     var flattened = pairs.expand((pair) => pair).toList();
     *     print(flattened); // => [1, 2, 3, 4];
     *
     *     var input = [1, 2, 3];
     *     var duplicated = input.expand((i) => [i, i]).toList();
     *     print(duplicated); // => [1, 1, 2, 2, 3, 3]
     *
     */
    expand(f) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns true if the collection contains an element equal to [element].
     *
     * This operation will check each element in order for being equal to
     * [element], unless it has a more efficient way to find an element
     * equal to [element].
     *
     * The equality used to determine whether [element] is equal to an element of
     * the iterable defaults to the [Object.==] of the element.
     *
     * Some types of iterable may have a different equality used for its elements.
     * For example, a [Set] may have a custom equality
     * (see [Set.identity]) that its `contains` uses.
     * Likewise the `Iterable` returned by a [Map.keys] call
     * should use the same equality that the `Map` uses for keys.
     */
    contains(element) {
        throw new Error("Method not implemented.");
    }
    /**
     * Applies the function [f] to each element of this collection in iteration
     * order.
     */
    forEach(f) {
        throw new Error("Method not implemented.");
    }
    /**
     * Reduces a collection to a single value by iteratively combining elements
     * of the collection using the provided function.
     *
     * The iterable must have at least one element.
     * If it has only one element, that element is returned.
     *
     * Otherwise this method starts with the first element from the iterator,
     * and then combines it with the remaining elements in iteration order,
     * as if by:
     *
     *     E value = iterable.first;
     *     iterable.skip(1).forEach((element) {
     *       value = combine(value, element);
     *     });
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.reduce((value, element) => value + element);
     *
     */
    reduce(combine) {
        throw new Error("Method not implemented.");
    }
    /**
     * Reduces a collection to a single value by iteratively combining each
     * element of the collection with an existing value
     *
     * Uses [initialValue] as the initial value,
     * then iterates through the elements and updates the value with
     * each element using the [combine] function, as if by:
     *
     *     var value = initialValue;
     *     for (E element in this) {
     *       value = combine(value, element);
     *     }
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.fold(0, (prev, element) => prev + element);
     *
     */
    fold(initialValue, combine) {
        throw new Error("Method not implemented.");
    }
    /**
     * Checks whether every element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `false` if
     * any of them make [test] return `false`, otherwise returns `true`.
     */
    every(f) {
        throw new Error("Method not implemented.");
    }
    /**
     * Converts each element to a [String] and concatenates the strings.
     *
     * Iterates through elements of this iterable,
     * converts each one to a [String] by calling [Object.toString],
     * and then concatenates the strings, with the
     * [separator] string interleaved between the elements.
     */
    join(separator) {
        throw new Error("Method not implemented.");
    }
    /**
     * Checks whether any element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `true` if
     * any of them make [test] return `true`, otherwise returns false.
     */
    any(f) {
        throw new Error("Method not implemented.");
    }
    /**
     * Creates a [List] containing the elements of this [Iterable].
     *
     * The elements are in iteration order.
     * The list is fixed-length if [growable] is false.
     */
    toList(_) {
        throw new Error("Method not implemented.");
    }
    /**
     * Creates a [Set] containing the same elements as this iterable.
     *
     * The set may contain fewer elements than the iterable,
     * if the iterable contains an element more than once,
     * or it contains one or more elements that are equal.
     * The order of the elements in the set is not guaranteed to be the same
     * as for the iterable.
     */
    toSet() {
        throw new Error("Method not implemented.");
    }
    get isEmpty() {
        throw new Error("Method not implemented.");
    }
    get isNotEmpty() {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns a lazy iterable of the [count] first elements of this iterable.
     *
     * The returned `Iterable` may contain fewer than `count` elements, if `this`
     * contains fewer than `count` elements.
     *
     * The elements can be computed by stepping through [iterator] until [count]
     * elements have been seen.
     *
     * The `count` must not be negative.
     */
    take(count) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns a lazy iterable of the leading elements satisfying [test].
     *
     * The filtering happens lazily. Every new iterator of the returned
     * iterable starts iterating over the elements of `this`.
     *
     * The elements can be computed by stepping through [iterator] until an
     * element is found where `test(element)` is false. At that point,
     * the returned iterable stops (its `moveNext()` returns false).
     */
    takeWhile(test) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns an [Iterable] that provides all but the first [count] elements.
     *
     * When the returned iterable is iterated, it starts iterating over `this`,
     * first skipping past the initial [count] elements.
     * If `this` has fewer than `count` elements, then the resulting Iterable is
     * empty.
     * After that, the remaining elements are iterated in the same order as
     * in this iterable.
     *
     * Some iterables may be able to find later elements without first iterating
     * through earlier elements, for example when iterating a [List].
     * Such iterables are allowed to ignore the initial skipped elements.
     *
     * The [count] must not be negative.
     */
    skip(count) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns an `Iterable` that skips leading elements while [test] is satisfied.
     *
     * The filtering happens lazily. Every new [Iterator] of the returned
     * iterable iterates over all elements of `this`.
     *
     * The returned iterable provides elements by iterating this iterable,
     * but skipping over all initial elements where `test(element)` returns
     * true. If all elements satisfy `test` the resulting iterable is empty,
     * otherwise it iterates the remaining elements in their original order,
     * starting with the first element for which `test(element)` returns `false`.
     */
    skipWhile(test) {
        throw new Error("Method not implemented.");
    }
    get first() {
        throw new Error("Method not implemented.");
    }
    get last() {
        throw new Error("Method not implemented.");
    }
    get single() {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns the first element that satisfies the given predicate [test].
     *
     * Iterates through elements and returns the first to satisfy [test].
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    firstWhere(test, _) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns the last element that satisfies the given predicate [test].
     *
     * An iterable that can access its elements directly may check its
     * elements in any order (for example a list starts by checking the
     * last element and then moves towards the start of the list).
     * The default implementation iterates elements in iteration order,
     * checks `test(element)` for each,
     * and finally returns that last one that matched.
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    lastWhere(test, _) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns the single element that satisfies [test].
     *
     * Checks all elements to see if `test(element)` returns true.
     * If exactly one element satisfies [test], that element is returned.
     * Otherwise, if there are no matching elements, or if there is more than
     * one matching element, a [StateError] is thrown.
     */
    singleWhere(test) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns the [index]th element.
     *
     * The [index] must be non-negative and less than [length].
     * Index zero represents the first element (so `iterable.elementAt(0)` is
     * equivalent to `iterable.first`).
     *
     * May iterate through the elements in iteration order, skipping the
     * first `index` elements and returning the next.
     * Some iterable may have more efficient ways to find the element.
     */
    elementAt(index) {
        throw new Error("Method not implemented.");
    }
    /**
     * Returns a string representation of (some of) the elements of `this`.
     *
     * Elements are represented by their own `toString` results.
     *
     * The default representation always contains the first three elements.
     * If there are less than a hundred elements in the iterable, it also
     * contains the last two elements.
     *
     * If the resulting string isn't above 80 characters, more elements are
     * included from the start of the iterable.
     *
     * The conversion may omit calling `toString` on some elements if they
     * are known to not occur in the output, and it may stop iterating after
     * a hundred elements.
     */
    toString() {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]() {
        return this.iterator;
    }
    /**
     * cretes a dart list from a js iterable
     */
    static _fromArray(it) {
        return new JSArray.list(it);
    }
    static _literal(...elems) {
        return new JSArray.list(elems);
    }
    /**
     * Generates a list of values.
     *
     * Creates a list with [length] positions and fills it with values created by
     * calling [generator] for each index in the range `0` .. `length - 1`
     * in increasing order.
     *
     *     new List<int>.generate(3, (int index) => index * index); // [0, 1, 4]
     *
     * The created list is fixed-length unless [growable] is true.
     */
    static _generate(length, generator, _) {
        let { growable } = Object.assign({ growable: false }, _);
        let result;
        if (growable) {
            result = new DartList_1(length);
            result.length = length;
        }
        else {
            result = new DartList_1(length);
        }
        for (let i = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, generator(i));
        }
        return result;
    }
    /**
     * Returns the object at the given [index] in the list
     * or throws a [RangeError] if [index] is out of bounds.
     */
    //@Abstract
    [OPERATOR_INDEX](index) {
        throw new Error('abstract');
    }
    /**
     * Sets the value at the given [index] in the list to [value]
     * or throws a [RangeError] if [index] is out of bounds.
     */
    //@Abstract
    [OPERATOR_INDEX_ASSIGN](index, value) {
        throw new Error('abstract');
    }
    /**
     * Returns the number of objects in this list.
     *
     * The valid indices for a list are `0` through `length - 1`.
     */
    get length() {
        throw new Error('abstract');
    }
    /**
     * Changes the length of this list.
     *
     * If [newLength] is greater than
     * the current length, entries are initialized to [:null:].
     *
     * Throws an [UnsupportedError] if the list is fixed-length.
     */
    set length(newLength) {
        throw new Error('abstract');
    }
    /**
     * Adds [value] to the end of this list,
     * extending the length by one.
     *
     * Throws an [UnsupportedError] if the list is fixed-length.
     */
    add(value) {
        throw new Error('abstract');
    }
    /**
     * Appends all objects of [iterable] to the end of this list.
     *
     * Extends the length of the list by the number of objects in [iterable].
     * Throws an [UnsupportedError] if this list is fixed-length.
     */
    addAll(iterable) {
        throw new Error('abstract');
    }
    /**
     * Returns an [Iterable] of the objects in this list in reverse order.
     */
    get reversed() {
        throw new Error('abstract');
    }
    /**
     * Sorts this list according to the order specified by the [compare] function.
     *
     * The [compare] function must act as a [Comparator].
     *
     *     List<String> numbers = ['two', 'three', 'four'];
     *     // Sort from shortest to longest.
     *     numbers.sort((a, b) => a.length.compareTo(b.length));
     *     print(numbers);  // [two, four, three]
     *
     * The default List implementations use [Comparable.compare] if
     * [compare] is omitted.
     *
     *     List<int> nums = [13, 2, -11];
     *     nums.sort();
     *     print(nums);  // [-11, 2, 13]
     *
     * A [Comparator] may compare objects as equal (return zero), even if they
     * are distinct objects.
     * The sort function is not guaranteed to be stable, so distinct objects
     * that compare as equal may occur in any order in the result:
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.sort((a, b) => a.length.compareTo(b.length));
     *     print(numbers);  // [one, two, four, three] OR [two, one, four, three]
     */
    sort(compare) {
        throw new Error('abstract');
    }
    /**
     * Shuffles the elements of this list randomly.
     */
    shuffle(random) {
        throw new Error('abstract');
    }
    /**
     * Returns the first index of [element] in this list.
     *
     * Searches the list from index [start] to the end of the list.
     * The first time an object [:o:] is encountered so that [:o == element:],
     * the index of [:o:] is returned.
     *
     *     List<String> notes = ['do', 're', 'mi', 're'];
     *     notes.indexOf('re');    // 1
     *     notes.indexOf('re', 2); // 3
     *
     * Returns -1 if [element] is not found.
     *
     *     notes.indexOf('fa');    // -1
     */
    indexOf(element, start) {
        throw new Error('abstract');
    }
    /**
     * Returns the last index of [element] in this list.
     *
     * Searches the list backwards from index [start] to 0.
     *
     * The first time an object [:o:] is encountered so that [:o == element:],
     * the index of [:o:] is returned.
     *
     *     List<String> notes = ['do', 're', 'mi', 're'];
     *     notes.lastIndexOf('re', 2); // 1
     *
     * If [start] is not provided, this method searches from the end of the
     * list./Returns
     *
     *     notes.lastIndexOf('re');  // 3
     *
     * Returns -1 if [element] is not found.
     *
     *     notes.lastIndexOf('fa');  // -1
     */
    lastIndexOf(element, start) {
        throw new Error('abstract');
    }
    /**
     * Removes all objects from this list;
     * the length of the list becomes zero.
     *
     * Throws an [UnsupportedError], and retains all objects, if this
     * is a fixed-length list.
     */
    clear() {
        throw new Error('abstract');
    }
    /**
     * Inserts the object at position [index] in this list.
     *
     * This increases the length of the list by one and shifts all objects
     * at or after the index towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    insert(index, element) {
        throw new Error('abstract');
    }
    /**
     * Inserts all objects of [iterable] at position [index] in this list.
     *
     * This increases the length of the list by the length of [iterable] and
     * shifts all later objects towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    insertAll(index, iterable) {
        throw new Error('abstract');
    }
    /**
     * Overwrites objects of `this` with the objects of [iterable], starting
     * at position [index] in this list.
     *
     *     List<String> list = ['a', 'b', 'c'];
     *     list.setAll(1, ['bee', 'sea']);
     *     list.join(', '); // 'a, bee, sea'
     *
     * This operation does not increase the length of `this`.
     *
     * The [index] must be non-negative and no greater than [length].
     *
     * The [iterable] must not have more elements than what can fit from [index]
     * to [length].
     *
     * If `iterable` is based on this list, its values may change /during/ the
     * `setAll` operation.
     */
    setAll(index, iterable) {
        throw new Error('abstract');
    }
    /**
     * Removes the first occurrence of [value] from this list.
     *
     * Returns true if [value] was in the list, false otherwise.
     *
     *     List<String> parts = ['head', 'shoulders', 'knees', 'toes'];
     *     parts.remove('head'); // true
     *     parts.join(', ');     // 'shoulders, knees, toes'
     *
     * The method has no effect if [value] was not in the list.
     *
     *     // Note: 'head' has already been removed.
     *     parts.remove('head'); // false
     *     parts.join(', ');     // 'shoulders, knees, toes'
     *
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    remove(value) {
        throw new Error('abstract');
    }
    /**
     * Removes the object at position [index] from this list.
     *
     * This method reduces the length of `this` by one and moves all later objects
     * down by one position.
     *
     * Returns the removed object.
     *
     * The [index] must be in the range `0 ≤ index < length`.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list. In that case
     * the list is not modified.
     */
    removeAt(index) {
        throw new Error('abstract');
    }
    /**
     * Pops and returns the last object in this list.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    removeLast() {
        throw new Error('abstract');
    }
    /**
     * Removes all objects from this list that satisfy [test].
     *
     * An object [:o:] satisfies [test] if [:test(o):] is true.
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.removeWhere((item) => item.length == 3);
     *     numbers.join(', '); // 'three, four'
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    removeWhere(test) {
        throw new Error('abstract');
    }
    /**
     * Removes all objects from this list that fail to satisfy [test].
     *
     * An object [:o:] satisfies [test] if [:test(o):] is true.
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.retainWhere((item) => item.length == 3);
     *     numbers.join(', '); // 'one, two'
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    retainWhere(test) {
        throw new Error('abstract');
    }
    /**
     * Returns a new list containing the objects from [start] inclusive to [end]
     * exclusive.
     *
     *     List<String> colors = ['red', 'green', 'blue', 'orange', 'pink'];
     *     colors.sublist(1, 3); // ['green', 'blue']
     *
     * If [end] is omitted, the [length] of `this` is used.
     *
     *     colors.sublist(1);  // ['green', 'blue', 'orange', 'pink']
     *
     * An error occurs if [start] is outside the range `0` .. `length` or if
     * [end] is outside the range `start` .. `length`.
     */
    sublist(start, end) {
        throw new Error('abstract');
    }
    /**
     * Returns an [Iterable] that iterates over the objects in the range
     * [start] inclusive to [end] exclusive.
     *
     * The provide range, given by [start] and [end], must be valid at the time
     * of the call.
     *
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * The returned [Iterable] behaves like `skip(start).take(end - start)`.
     * That is, it does *not* throw if this list changes size.
     *
     *     List<String> colors = ['red', 'green', 'blue', 'orange', 'pink'];
     *     Iterable<String> range = colors.getRange(1, 4);
     *     range.join(', ');  // 'green, blue, orange'
     *     colors.length = 3;
     *     range.join(', ');  // 'green, blue'
     */
    getRange(start, end) {
        throw new Error('abstract');
    }
    /**
     * Copies the objects of [iterable], skipping [skipCount] objects first,
     * into the range [start], inclusive, to [end], exclusive, of the list.
     *
     *     List<int> list1 = [1, 2, 3, 4];
     *     List<int> list2 = [5, 6, 7, 8, 9];
     *     // Copies the 4th and 5th items in list2 as the 2nd and 3rd items
     *     // of list1.
     *     list1.setRange(1, 3, list2, 3);
     *     list1.join(', '); // '1, 8, 9, 4'
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * The [iterable] must have enough objects to fill the range from `start`
     * to `end` after skipping [skipCount] objects.
     *
     * If `iterable` is this list, the operation copies the elements
     * originally in the range from `skipCount` to `skipCount + (end - start)` to
     * the range `start` to `end`, even if the two ranges overlap.
     *
     * If `iterable` depends on this list in some other way, no guarantees are
     * made.
     */
    setRange(start, end, iterable, skipCount /* = 0 */) {
        throw new Error('abstract');
    }
    /**
     * Removes the objects in the range [start] inclusive to [end] exclusive.
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list. In that case
     * the list is not modified.
     */
    removeRange(start, end) {
        throw new Error('abstract');
    }
    /**
     * Sets the objects in the range [start] inclusive to [end] exclusive
     * to the given [fillValue].
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     */
    fillRange(start, end, fillValue) {
        throw new Error('abstract');
    }
    /**
     * Removes the objects in the range [start] inclusive to [end] exclusive
     * and inserts the contents of [replacement] in its place.
     *
     *     List<int> list = [1, 2, 3, 4, 5];
     *     list.replaceRange(1, 4, [6, 7]);
     *     list.join(', '); // '1, 6, 7, 5'
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * This method does not work on fixed-length lists, even when [replacement]
     * has the same number of elements as the replaced range. In that case use
     * [setRange] instead.
     */
    replaceRange(start, end, replacement) {
        throw new Error('abstract');
    }
    /**
     * Returns an unmodifiable [Map] view of `this`.
     *
     * The map uses the indices of this list as keys and the corresponding objects
     * as values. The `Map.keys` [Iterable] iterates the indices of this list
     * in numerical order.
     *
     *     List<String> words = ['fee', 'fi', 'fo', 'fum'];
     *     Map<int, String> map = words.asMap();
     *     map[0] + map[1];   // 'feefi';
     *     map.keys.toList(); // [0, 1, 2, 3]
     */
    asMap() {
        throw new Error('abstract');
    }
    //@patch
    static create(length) {
        return new JSArray.list(length);
    }
    //@patch
    static _filled(length, fill, _) {
        let { growable } = Object.assign({ growable: false }, _);
        let result = growable
            ? new JSArray.growable(length)
            : new JSArray.fixed(length);
        if (length != 0 && fill != null) {
            for (let i = 0; i < result.length; i++) {
                result[i] = fill;
            }
        }
        return result;
    }
    //@patch
    static _from(elements, _) {
        let { growable } = Object.assign({ growable: true }, _);
        let list = new DartList_1();
        for (let e of elements) {
            list.add(e);
        }
        if (growable)
            return list;
        return makeListFixedLength(list);
    }
    //@patch
    static _unmodifiable(elements) {
        let result = new DartList_1.from(elements, { growable: false });
        return makeFixedListUnmodifiable(result);
    }
};
__decorate([
    Abstract
], DartList.prototype, "iterator", null);
__decorate([
    Abstract
], DartList.prototype, "map", null);
__decorate([
    Abstract
], DartList.prototype, "where", null);
__decorate([
    Abstract
], DartList.prototype, "expand", null);
__decorate([
    Abstract
], DartList.prototype, "contains", null);
__decorate([
    Abstract
], DartList.prototype, "forEach", null);
__decorate([
    Abstract
], DartList.prototype, "reduce", null);
__decorate([
    Abstract
], DartList.prototype, "fold", null);
__decorate([
    Abstract
], DartList.prototype, "every", null);
__decorate([
    Abstract
], DartList.prototype, "join", null);
__decorate([
    Abstract
], DartList.prototype, "any", null);
__decorate([
    Abstract
], DartList.prototype, "toList", null);
__decorate([
    Abstract
], DartList.prototype, "toSet", null);
__decorate([
    Abstract
], DartList.prototype, "isEmpty", null);
__decorate([
    Abstract
], DartList.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], DartList.prototype, "take", null);
__decorate([
    Abstract
], DartList.prototype, "takeWhile", null);
__decorate([
    Abstract
], DartList.prototype, "skip", null);
__decorate([
    Abstract
], DartList.prototype, "skipWhile", null);
__decorate([
    Abstract
], DartList.prototype, "first", null);
__decorate([
    Abstract
], DartList.prototype, "last", null);
__decorate([
    Abstract
], DartList.prototype, "single", null);
__decorate([
    Abstract
], DartList.prototype, "firstWhere", null);
__decorate([
    Abstract
], DartList.prototype, "lastWhere", null);
__decorate([
    Abstract
], DartList.prototype, "singleWhere", null);
__decorate([
    Abstract
], DartList.prototype, "elementAt", null);
__decorate([
    Abstract
], DartList.prototype, "toString", null);
__decorate([
    Abstract
], DartList.prototype, "length", null);
__decorate([
    Abstract
], DartList.prototype, "add", null);
__decorate([
    Abstract
], DartList.prototype, "addAll", null);
__decorate([
    Abstract
], DartList.prototype, "reversed", null);
__decorate([
    Abstract
], DartList.prototype, "sort", null);
__decorate([
    Abstract
], DartList.prototype, "shuffle", null);
__decorate([
    Abstract
], DartList.prototype, "indexOf", null);
__decorate([
    Abstract
], DartList.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], DartList.prototype, "clear", null);
__decorate([
    Abstract
], DartList.prototype, "insert", null);
__decorate([
    Abstract
], DartList.prototype, "insertAll", null);
__decorate([
    Abstract
], DartList.prototype, "setAll", null);
__decorate([
    Abstract
], DartList.prototype, "remove", null);
__decorate([
    Abstract
], DartList.prototype, "removeAt", null);
__decorate([
    Abstract
], DartList.prototype, "removeLast", null);
__decorate([
    Abstract
], DartList.prototype, "removeWhere", null);
__decorate([
    Abstract
], DartList.prototype, "retainWhere", null);
__decorate([
    Abstract
], DartList.prototype, "sublist", null);
__decorate([
    Abstract
], DartList.prototype, "getRange", null);
__decorate([
    Abstract
], DartList.prototype, "setRange", null);
__decorate([
    Abstract
], DartList.prototype, "removeRange", null);
__decorate([
    Abstract
], DartList.prototype, "fillRange", null);
__decorate([
    Abstract
], DartList.prototype, "replaceRange", null);
__decorate([
    Abstract
], DartList.prototype, "asMap", null);
__decorate([
    namedFactory
], DartList, "_fromArray", null);
__decorate([
    namedFactory
], DartList, "_literal", null);
__decorate([
    namedFactory
], DartList, "_generate", null);
__decorate([
    defaultFactory
], DartList, "create", null);
__decorate([
    namedFactory
], DartList, "_filled", null);
__decorate([
    namedFactory
], DartList, "_from", null);
__decorate([
    namedFactory
], DartList, "_unmodifiable", null);
DartList = DartList_1 = __decorate([
    DartClass,
    Implements(DartEfficientLengthIterable)
], DartList);
/**
 * Convert elments of [iterable] to strings and store them in [parts].
 */
function _iterablePartsToStrings(iterable, parts) {
    /*
     * This is the complicated part of [iterableToShortString].
     * It is extracted as a separate function to avoid having too much code
     * inside the try/finally.
     */
    /// Try to stay below this many characters.
    const LENGTH_LIMIT = 80;
    /// Always at least this many elements at the start.
    const HEAD_COUNT = 3;
    /// Always at least this many elements at the end.
    const TAIL_COUNT = 2;
    /// Stop iterating after this many elements. Iterables can be infinite.
    const MAX_COUNT = 100;
    // Per entry length overhead. It's for ", " for all after the first entry,
    // and for "(" and ")" for the initial entry. By pure luck, that's the same
    // number.
    const OVERHEAD = 2;
    const ELLIPSIS_SIZE = 3; // "...".length.
    let length = 0;
    let count = 0;
    let it = iterable.iterator;
    // Initial run of elements, at least HEAD_COUNT, and then continue until
    // passing at most LENGTH_LIMIT characters.
    while (length < LENGTH_LIMIT || count < HEAD_COUNT) {
        if (!it.moveNext())
            return;
        let next = `${it.current}`;
        parts.add(next);
        length += next.length + OVERHEAD;
        count++;
    }
    let penultimateString;
    let ultimateString;
    // Find last two elements. One or more of them may already be in the
    // parts array. Include their length in `length`.
    let penultimate = null;
    let ultimate = null;
    if (!it.moveNext()) {
        if (count <= HEAD_COUNT + TAIL_COUNT)
            return;
        ultimateString = parts.removeLast();
        penultimateString = parts.removeLast();
    }
    else {
        penultimate = it.current;
        count++;
        if (!it.moveNext()) {
            if (count <= HEAD_COUNT + 1) {
                parts.add(`${penultimate}`);
                return;
            }
            ultimateString = `${penultimate}`;
            penultimateString = parts.removeLast();
            length += ultimateString.length + OVERHEAD;
        }
        else {
            ultimate = it.current;
            count++;
            // Then keep looping, keeping the last two elements in variables.
            //assert(count < MAX_COUNT);
            while (it.moveNext()) {
                penultimate = ultimate;
                ultimate = it.current;
                count++;
                if (count > MAX_COUNT) {
                    // If we haven't found the end before MAX_COUNT, give up.
                    // This cannot happen in the code above because each entry
                    // increases length by at least two, so there is no way to
                    // visit more than ~40 elements before this loop.
                    // Remove any surplus elements until length, including ", ...)",
                    // is at most LENGTH_LIMIT.
                    while (length > LENGTH_LIMIT - ELLIPSIS_SIZE - OVERHEAD &&
                        count > HEAD_COUNT) {
                        length -= parts.removeLast().length + OVERHEAD;
                        count--;
                    }
                    parts.add("...");
                    return;
                }
            }
            penultimateString = `${penultimate}`;
            ultimateString = `${ultimate}`;
            length += ultimateString.length + penultimateString.length + 2 * OVERHEAD;
        }
    }
    // If there is a gap between the initial run and the last two,
    // prepare to add an ellipsis.
    let elision = null;
    if (count > parts.length + TAIL_COUNT) {
        elision = "...";
        length += ELLIPSIS_SIZE + OVERHEAD;
    }
    // If the last two elements were very long, and we have more than
    // HEAD_COUNT elements in the initial run, drop some to make room for
    // the last two.
    while (length > LENGTH_LIMIT && parts.length > HEAD_COUNT) {
        length -= parts.removeLast().length + OVERHEAD;
        if (elision == null) {
            elision = "...";
            length += ELLIPSIS_SIZE + OVERHEAD;
        }
    }
    if (elision != null) {
        parts.add(elision);
    }
    parts.add(penultimateString);
    parts.add(ultimateString);
}
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.collection;
/**
 * A hash-table based implementation of [Map].
 *
 * The insertion order of keys is remembered,
 * and keys are iterated in the order they were inserted into the map.
 * Values are iterated in their corresponding key's order.
 * Changing a key's value, when the key is already in the map,
 * does not change the iteration order,
 * but removing the key and adding it again
 * will make it be last in the iteration order.
 *
 * The keys of a `LinkedHashMap` must have consistent [Object.==]
 * and [Object.hashCode] implementations. This means that the `==` operator
 * must define a stable equivalence relation on the keys (reflexive,
 * symmetric, transitive, and consistent over time), and that `hashCode`
 * must be the same for objects that are considered equal by `==`.
 *
 * The map allows `null` as a key.
 */
let DartLinkedHashMap = DartLinkedHashMap_1 = class DartLinkedHashMap {
    /**
     * Creates an insertion-ordered hash-table based [Map].
     *
     * If [equals] is provided, it is used to compare the keys in the table with
     * new keys. If [equals] is omitted, the key's own [Object.==] is used
     * instead.
     *
     * Similar, if [hashCode] is provided, it is used to produce a hash value
     * for keys in order to place them in the hash table. If it is omitted, the
     * key's own [Object.hashCode] is used.
     *
     * If using methods like [[]], [remove] and [containsKey] together
     * with a custom equality and hashcode, an extra `isValidKey` function
     * can be supplied. This function is called before calling [equals] or
     * [hashCode] with an argument that may not be a [K] instance, and if the
     * call returns false, the key is assumed to not be in the set.
     * The [isValidKey] function defaults to just testing if the object is a
     * [K] instance.
     *
     * Example:
     *
     *     new LinkedHashMap<int,int>(equals: (int a, int b) => (b - a) % 5 == 0,
     *                                hashCode: (int e) => e % 5)
     *
     * This example map does not need an `isValidKey` function to be passed.
     * The default function accepts only `int` values, which can safely be
     * passed to both the `equals` and `hashCode` functions.
     *
     * If neither `equals`, `hashCode`, nor `isValidKey` is provided,
     * the default `isValidKey` instead accepts all keys.
     * The default equality and hashcode operations are assumed to work on all
     * objects.
     *
     * Likewise, if `equals` is [identical], `hashCode` is [identityHashCode]
     * and `isValidKey` is omitted, the resulting map is identity based,
     * and the `isValidKey` defaults to accepting all keys.
     * Such a map can be created directly using [LinkedHashMap.identity].
     *
     * The used `equals` and `hashCode` method should always be consistent,
     * so that if `equals(a, b)` then `hashCode(a) == hashCode(b)`. The hash
     * of an object, or what it compares equal to, should not change while the
     * object is in the table. If it does change, the result is unpredictable.
     *
     * If you supply one of [equals] and [hashCode],
     * you should generally also to supply the other.
     */
    /*external factory LinkedHashMap(
        {bool equals(K key1, K key2),
    int hashCode(K key),
    bool isValidKey(potentialKey)});*/
    constructor(_) {
    }
    [OPERATOR_INDEX](key) {
        throw 'abstract';
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw 'abstract';
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
    /**
     * Creates a [LinkedHashMap] that contains all key value pairs of [other].
     */
    static _from(other) {
        let result = new DartLinkedHashMap_1();
        other.forEach((k, v) => {
            result[OPERATOR_INDEX_ASSIGN](k /*=K*/, v /*=V*/);
        });
        return result;
    }
    /**
     * Creates a [LinkedHashMap] where the keys and values are computed from the
     * [iterable].
     *
     * For each element of the [iterable] this constructor computes a key/value
     * pair, by applying [key] and [value] respectively.
     *
     * The keys of the key/value pairs do not need to be unique. The last
     * occurrence of a key will simply overwrite any previous value.
     *
     * If no values are specified for [key] and [value] the default is the
     * identity function.
     */
    static _fromIterable(iterable, _) {
        let { key, value } = Object.assign({}, _);
        let map = new DartLinkedHashMap_1();
        DartMaps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
    }
    /**
     * Creates a [LinkedHashMap] associating the given [keys] to [values].
     *
     * This constructor iterates over [keys] and [values] and maps each element of
     * [keys] to the corresponding element of [values].
     *
     * If [keys] contains the same object multiple times, the last occurrence
     * overwrites the previous value.
     *
     * It is an error if the two [Iterable]s don't have the same length.
     */
    static _fromIterables(keys, values) {
        let map = new DartLinkedHashMap_1();
        DartMaps._fillMapWithIterables(map, keys, values);
        return map;
    }
    addAll(other) {
    }
    clear() {
    }
    containsKey(key) {
        return undefined;
    }
    containsValue(value) {
        return undefined;
    }
    forEach(f) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get keys() {
        return undefined;
    }
    get length() {
        return undefined;
    }
    putIfAbsent(key, ifAbsent) {
        return undefined;
    }
    remove(key) {
        return undefined;
    }
    get values() {
        return undefined;
    }
    // @patch
    static _create(_) {
        let { equals, hashCode, isValidKey } = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new DartJsLinkedHashMap.es6();
                }
                hashCode = _defaultHashCode;
            }
            else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _LinkedIdentityHashMap.es6();
                }
                if (equals == null) {
                    equals = _defaultEquals;
                }
            }
        }
        else {
            if (hashCode == null) {
                hashCode = _defaultHashCode;
            }
            if (equals == null) {
                equals = _defaultEquals;
            }
        }
        return new _LinkedCustomHashMap(equals, hashCode, isValidKey);
    }
    //@patch
    static _identity() {
        return new _LinkedIdentityHashMap.es6();
    }
    // Private factory constructor called by generated code for map literals.
    //@NoInline()
    static __literal(keyValuePairs) {
        return fillLiteralMap(keyValuePairs, new DartJsLinkedHashMap.es6());
    }
    // Private factory constructor called by generated code for map literals.
    // @NoThrows()
    // @NoInline()
    // @NoSideEffects()
    static __empty() {
        return new DartJsLinkedHashMap.es6();
    }
    // Private factory static function called by generated code for map literals.
    // This version is for map literals without type parameters.
    //@NoThrows()
    //@NoInline()
    //@NoSideEffects()
    static _makeEmpty() {
        return new DartJsLinkedHashMap();
    }
    // Private factory static function called by generated code for map literals.
    // This version is for map literals without type parameters.
    //@NoInline()
    static _makeLiteral(keyValuePairs) {
        return fillLiteralMap(keyValuePairs, new DartJsLinkedHashMap());
    }
};
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "addAll", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "clear", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "containsKey", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "containsValue", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "forEach", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "isEmpty", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "keys", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "length", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "putIfAbsent", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "remove", null);
__decorate([
    Abstract
], DartLinkedHashMap.prototype, "values", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "_from", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "_fromIterable", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "_fromIterables", null);
__decorate([
    defaultFactory
], DartLinkedHashMap, "_create", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "_identity", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "__literal", null);
__decorate([
    namedFactory
], DartLinkedHashMap, "__empty", null);
DartLinkedHashMap = DartLinkedHashMap_1 = __decorate([
    DartClass,
    AbstractMethods(OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN),
    Implements(DartHashMap)
], DartLinkedHashMap);
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.collection;
/**
 * Base implementation of a [List] class.
 *
 * `ListMixin` can be used as a mixin to make a class implement
 * the `List` interface.
 *
 * This implements all read operations using only the `length` and
 * `operator[]` members. It implements write operations using those and
 * `length=` and `operator[]=`
 *
 * *NOTICE*: Forwarding just these four operations to a normal growable [List]
 * (as created by `new List()`) will give very bad performance for `add` and
 * `addAll` operations of `ListBase`. These operations are implemented by
 * increasing the length of the list by one for each `add` operation, and
 * repeatedly increasing the length of a growable list is not efficient.
 * To avoid this, either override 'add' and 'addAll' to also forward directly
 * to the growable list, or, if possible, use `DelegatingList` from
 * "package:collection/wrappers.dart" instead.
 */
let DartListMixin = DartListMixin_1 = class DartListMixin {
    [Symbol.iterator]() {
        return this.iterator;
    }
    get length() {
        throw new Error('abstract');
    }
    set length(v) {
        throw new Error('abstract');
    }
    [OPERATOR_INDEX](index) {
        throw new Error("Method not implemented.");
    }
    [OPERATOR_INDEX_ASSIGN](index, value) {
        throw new Error("Method not implemented.");
    }
    // Iterable interface.
    get iterator() {
        return new DartListIterator(this);
    }
    elementAt(index) {
        return this[OPERATOR_INDEX](index);
    }
    forEach(action) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            action(this[OPERATOR_INDEX](i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
    }
    get isEmpty() {
        return this.length == 0;
    }
    ;
    get isNotEmpty() {
        return !this.isEmpty;
    }
    get first() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        return this[OPERATOR_INDEX](0);
    }
    get last() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        return this[OPERATOR_INDEX](this.length - 1);
    }
    get single() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        if (this.length > 1)
            throw DartIterableElementError.tooMany();
        return this[OPERATOR_INDEX](0);
    }
    contains(element) {
        let length = this.length;
        for (let i = 0; i < this.length; i++) {
            if (this[OPERATOR_INDEX](i) == element)
                return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }
    every(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (!test(this[OPERATOR_INDEX](i)))
                return false;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return true;
    }
    any(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (test(this[OPERATOR_INDEX](i)))
                return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let length = this.length;
        for (let i = 0; i < length; i++) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element))
                return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element))
                return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test) {
        let length = this.length;
        let match = null;
        let matchFound = false;
        for (let i = 0; i < length; i++) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element)) {
                if (matchFound) {
                    throw DartIterableElementError.tooMany();
                }
                matchFound = true;
                match = element;
            }
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (matchFound)
            return match;
        throw DartIterableElementError.noElement();
    }
    join(separator /* = "" */) {
        if (this.length == 0)
            return "";
        let buffer = new DartStringBuffer();
        buffer.writeAll(this, separator);
        return buffer.toString();
    }
    where(test) {
        return new DartWhereIterable(this, test);
    }
    map(f) {
        return new DartMappedListIterable(this, f);
    }
    expand(f) {
        return new DartExpandIterable(this, f);
    }
    reduce(combine) {
        let length = this.length;
        if (length == 0)
            throw DartIterableElementError.noElement();
        let value = this[OPERATOR_INDEX](0);
        for (let i = 1; i < length; i++) {
            value = combine(value, this[OPERATOR_INDEX](i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return value;
    }
    fold(initialValue, combine) {
        let value = initialValue;
        let length = this.length;
        for (let i = 0; i < length; i++) {
            value = combine(value, this[OPERATOR_INDEX](i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return value;
    }
    skip(count) {
        return new DartSubListIterable(this, count, null);
    }
    skipWhile(test) {
        return new DartSkipWhileIterable(this, test);
    }
    take(count) {
        return new DartSubListIterable(this, 0, count);
    }
    takeWhile(test) {
        return new DartTakeWhileIterable(this, test);
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        let result;
        if (growable) {
            result = new DartList();
            result.length = this.length;
        }
        else {
            result = new DartList(this.length);
        }
        for (let i = 0; i < this.length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](i));
        }
        return result;
    }
    toSet() {
        let result = new DartSet();
        for (let i = 0; i < this.length; i++) {
            result.add(this[OPERATOR_INDEX](i));
        }
        return result;
    }
    // Collection interface.
    add(element) {
        this[OPERATOR_INDEX_ASSIGN](this.length++, element);
    }
    addAll(iterable) {
        let i = this.length;
        for (let element of iterable) {
            //assert(this.length == i || (throw new ConcurrentModificationError(this)));
            this.length = i + 1;
            this[OPERATOR_INDEX_ASSIGN](i, element);
            i++;
        }
    }
    remove(element) {
        for (let i = 0; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                this.setRange(i, this.length - 1, this, i + 1);
                this.length -= 1;
                return true;
            }
        }
        return false;
    }
    removeWhere(test) {
        this._filter(test, false);
    }
    retainWhere(test) {
        this._filter(test, true);
    }
    _filter(test, retainMatching) {
        let retained = new DartList();
        let length = this.length;
        for (let i = 0; i < length; i++) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element) == retainMatching) {
                retained.add(element);
            }
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (retained.length != this.length) {
            this.setRange(0, retained.length, retained);
            this.length = retained.length;
        }
    }
    clear() {
        this.length = 0;
    }
    // List interface.
    removeLast() {
        if (this.length == 0) {
            throw DartIterableElementError.noElement();
        }
        let result = this[OPERATOR_INDEX](this.length - 1);
        this.length--;
        return result;
    }
    sort(compare) {
        DartSort.sort(this, compare || DartListMixin_1._compareAny);
    }
    static _compareAny(a, b) {
        // In strong mode Comparable.compare requires an implicit cast to ensure
        // `a` and `b` are Comparable.
        return DartComparable.compare(a, b);
    }
    shuffle(random) {
        if (random == null)
            random = new DartRandom();
        let length = this.length;
        while (length > 1) {
            let pos = random.nextInt(length);
            length -= 1;
            let tmp = this[OPERATOR_INDEX](length);
            this[OPERATOR_INDEX_ASSIGN](length, this[OPERATOR_INDEX](pos));
            this[OPERATOR_INDEX_ASSIGN](pos, tmp);
        }
    }
    asMap() {
        return new DartListMapView(this);
    }
    sublist(start, end) {
        let listLength = this.length;
        if (end == null)
            end = listLength;
        RangeError.checkValidRange(start, end, listLength);
        let length = end - start;
        let result = new DartList();
        result.length = length;
        for (let i = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](start + i));
        }
        return result;
    }
    getRange(start, end) {
        RangeError.checkValidRange(start, end, this.length);
        return new DartSubListIterable(this, start, end);
    }
    removeRange(start, end) {
        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        this.setRange(start, this.length - length, this, end);
        this.length -= length;
    }
    fillRange(start, end, fill) {
        RangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
            this[OPERATOR_INDEX_ASSIGN](i, fill);
        }
    }
    setRange(start, end, iterable, skipCount /* = 0*/) {
        skipCount = skipCount || 0;
        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length == 0)
            return;
        RangeError.checkNotNegative(skipCount, "skipCount");
        let otherList;
        let otherStart;
        // TODO(floitsch): Make this accept more.
        if (_dart.is(iterable, DartList)) {
            otherList = iterable;
            otherStart = skipCount;
        }
        else {
            otherList = iterable.skip(skipCount).toList({ growable: false });
            otherStart = 0;
        }
        if (otherStart + length > otherList.length) {
            throw DartIterableElementError.tooFew();
        }
        if (otherStart < start) {
            // Copy backwards to ensure correct copy if [from] is this.
            for (let i = length - 1; i >= 0; i--) {
                this[OPERATOR_INDEX_ASSIGN](start + i, otherList[OPERATOR_INDEX](otherStart + i));
            }
        }
        else {
            for (let i = 0; i < length; i++) {
                this[OPERATOR_INDEX_ASSIGN](start + i, otherList[OPERATOR_INDEX](otherStart + i));
            }
        }
    }
    replaceRange(start, end, newContents) {
        RangeError.checkValidRange(start, end, this.length);
        if (!_dart.is(newContents, DartEfficientLengthIterable)) {
            newContents = newContents.toList();
        }
        let removeLength = end - start;
        let insertLength = newContents.length;
        if (removeLength >= insertLength) {
            let delta = removeLength - insertLength;
            let insertEnd = start + insertLength;
            let newLength = this.length - delta;
            this.setRange(start, insertEnd, newContents);
            if (delta != 0) {
                this.setRange(insertEnd, newLength, this, end);
                this.length = newLength;
            }
        }
        else {
            let delta = insertLength - removeLength;
            let newLength = this.length + delta;
            let insertEnd = start + insertLength; // aka. end + delta.
            this.length = newLength;
            this.setRange(insertEnd, newLength, this, end);
            this.setRange(start, insertEnd, newContents);
        }
    }
    indexOf(element, startIndex /* = 0 */) {
        startIndex = startIndex || 0;
        if (startIndex >= this.length) {
            return -1;
        }
        if (startIndex < 0) {
            startIndex = 0;
        }
        for (let i = startIndex; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Returns the last index in the list [a] of the given [element], starting
     * the search at index [startIndex] to 0.
     * Returns -1 if [element] is not found.
     */
    lastIndexOf(element, startIndex) {
        if (startIndex == null) {
            startIndex = this.length - 1;
        }
        else {
            if (startIndex < 0) {
                return -1;
            }
            if (startIndex >= this.length) {
                startIndex = this.length - 1;
            }
        }
        for (let i = startIndex; i >= 0; i--) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                return i;
            }
        }
        return -1;
    }
    insert(index, element) {
        RangeError.checkValueInInterval(index, 0, this.length, "index");
        if (index == this.length) {
            this.add(element);
            return;
        }
        // We are modifying the length just below the is-check. Without the check
        // Array.copy could throw an exception, leaving the list in a bad state
        // (with a length that has been increased, but without a new element).
        if (!_dart.is(index, 'int'))
            throw new ArgumentError(index);
        this.length++;
        this.setRange(index + 1, this.length, this, index);
        this[OPERATOR_INDEX_ASSIGN](index, element);
    }
    removeAt(index) {
        let result = this[OPERATOR_INDEX](index);
        this.setRange(index, this.length - 1, this, index + 1);
        this.length--;
        return result;
    }
    insertAll(index, iterable) {
        RangeError.checkValueInInterval(index, 0, this.length, "index");
        if (!_dart.is(iterable, DartEfficientLengthIterable) || identical(iterable, this)) {
            iterable = iterable.toList();
        }
        let insertionLength = iterable.length;
        // There might be errors after the length change, in which case the list
        // will end up being modified but the operation not complete. Unless we
        // always go through a "toList" we can't really avoid that.
        this.length += insertionLength;
        if (iterable.length != insertionLength) {
            // If the iterable's length is linked to this list's length somehow,
            // we can't insert one in the other.
            this.length -= insertionLength;
            throw new ConcurrentModificationError(iterable);
        }
        this.setRange(index + insertionLength, this.length, this, index);
        this.setAll(index, iterable);
    }
    setAll(index, iterable) {
        if (_dart.is(iterable, DartList)) {
            this.setRange(index, index + iterable.length, iterable);
        }
        else {
            for (let element of iterable) {
                this[OPERATOR_INDEX_ASSIGN](index++, element);
            }
        }
    }
    get reversed() {
        return new DartReversedListIterable(this);
    }
    toString() {
        return DartIterableBase.iterableToFullString(this, '[', ']');
    }
};
DartListMixin = DartListMixin_1 = __decorate([
    Implements(DartList)
], DartListMixin);
/**
 * Abstract implementation of a list.
 *
 * `ListBase` can be used as a base class for implementing the `List` interface.
 *
 * All operations are defined in terms of `length`, `operator[]`,
 * `operator[]=` and `length=`, which need to be implemented.
 *
 * *NOTICE*: Forwarding just these four operations to a normal growable [List]
 * (as created by `new List()`) will give very bad performance for `add` and
 * `addAll` operations of `ListBase`. These operations are implemented by
 * increasing the length of the list by one for each `add` operation, and
 * repeatedly increasing the length of a growable list is not efficient.
 * To avoid this, either override 'add' and 'addAll' to also forward directly
 * to the growable list, or, preferably, use `DelegatingList` from
 * "package:collection/wrappers.dart" instead.
 */
class DartListBase extends DartListMixin {
    /**
     * Convert a `List` to a string as `[each, element, as, string]`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [list] to a string again.
     */
    static listToString(list) {
        return DartIterableBase.iterableToFullString(list, '[', ']');
    }
}
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.core;
/**
 * An collection of key-value pairs, from which you retrieve a value
 * using its associated key.
 *
 * There is a finite number of keys in the map,
 * and each key has exactly one value associated with it.
 *
 * Maps, and their keys and values, can be iterated.
 * The order of iteration is defined by the individual type of map.
 * Examples:
 *
 * * The plain [HashMap] is unordered (no order is guaranteed),
 * * the [LinkedHashMap] iterates in key insertion order,
 * * and a sorted map like [SplayTreeMap] iterates the keys in sorted order.
 *
 * It is generally not allowed to modify the map (add or remove keys) while
 * an operation is being performed on the map, for example in functions called
 * during a [forEach] or [putIfAbsent] call.
 * Modifying the map while iterating the keys or values
 * may also break the iteration.
 */
let DartMap = class DartMap {
    /**
     * Creates a Map instance with the default implementation, [LinkedHashMap].
     *
     * This constructor is equivalent to the non-const map literal `<K,V>{}`.
     *
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     */
    /* external */
    /* @defaultFactory
     protected static create<K, V>(): DartMap<K, V> {
         // TODO
         return undefined;
     }*/
    constructor() {
    }
    /**
     * Creates a [LinkedHashMap] instance that contains all key-value pairs of
     * [other].
     *
     * The keys must all be assignable to [K] and the values to [V].
     * The [other] map itself can have any type.
     *
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows `null` as a key.
     * It iterates in key insertion order.
     */
    static _from(other) {
        return new DartLinkedHashMap.from(other);
    }
    /**
     * Creates an identity map with the default implementation, [LinkedHashMap].
     *
     * The returned map allows `null` as a key.
     * It iterates in key insertion order.
     */
    static _identity() {
        return new DartLinkedHashMap.identity();
    }
    /**
     * Creates a Map instance in which the keys and values are computed from the
     * [iterable].
     *
     * The created map is a [LinkedHashMap].
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     *
     * For each element of the [iterable] this constructor computes a key-value
     * pair, by applying [key] and [value] respectively.
     *
     * The example below creates a new Map from a List. The keys of `map` are
     * `list` values converted to strings, and the values of the `map` are the
     * squares of the `list` values:
     *
     *     List<int> list = [1, 2, 3];
     *     Map<String, int> map = new Map.fromIterable(list,
     *         key: (item) => item.toString(),
     *         value: (item) => item * item));
     *
     *     map['1'] + map['2']; // 1 + 4
     *     map['3'] - map['2']; // 9 - 4
     *
     * If no values are specified for [key] and [value] the default is the
     * identity function.
     *
     * In the following example, the keys and corresponding values of `map`
     * are `list` values:
     *
     *     map = new Map.fromIterable(list);
     *     map[1] + map[2]; // 1 + 2
     *     map[3] - map[2]; // 3 - 2
     *
     * The keys computed by the source [iterable] do not need to be unique. The
     * last occurrence of a key will simply overwrite any previous value.
     */
    static _fromIterable(iterable, _) {
        return new DartLinkedHashMap.fromIterable(iterable, _);
    }
    /**
     * Creates a Map instance associating the given [keys] to [values].
     *
     * The created map is a [LinkedHashMap].
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     *
     * This constructor iterates over [keys] and [values] and maps each element of
     * [keys] to the corresponding element of [values].
     *
     *     List<String> letters = ['b', 'c'];
     *     List<String> words = ['bad', 'cat'];
     *     Map<String, String> map = new Map.fromIterables(letters, words);
     *     map['b'] + map['c'];  // badcat
     *
     * If [keys] contains the same object multiple times, the last occurrence
     * overwrites the previous value.
     *
     * The two [Iterable]s must have the same length.
     */
    static _fromIterables(keys, values) {
        return new DartLinkedHashMap.fromIterables(keys, values);
    }
    /**
     * Returns true if this map contains the given [value].
     *
     * Returns true if any of the values in the map are equal to `value`
     * according to the `==` operator.
     */
    containsValue(value) {
        throw Error('abstract');
    }
    /**
     * Returns true if this map contains the given [key].
     *
     * Returns true if any of the keys in the map are equal to `key`
     * according to the equality used by the map.
     */
    containsKey(key) {
        throw Error('abstract');
    }
    /**
     * Returns the value for the given [key] or null if [key] is not in the map.
     *
     * Some maps allows keys to have `null` as a value,
     * For those maps, a lookup using this operator does cannot be used to
     * distinguish between a key not being in the map, and the key having a null
     * value.
     * Methods like [containsKey] or [putIfAbsent] can be use if the distinction
     * is important.
     */
    [OPERATOR_INDEX](key) {
        throw 'abstract';
    }
    /**
     * Associates the [key] with the given [value].
     *
     * If the key was already in the map, its associated value is changed.
     * Otherwise the key-value pair is added to the map.
     */
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw 'abstract';
    }
    /**
     * Look up the value of [key], or add a new value if it isn't there.
     *
     * Returns the value associated to [key], if there is one.
     * Otherwise calls [ifAbsent] to get a new value, associates [key] to
     * that value, and then returns the new value.
     *
     *     Map<String, int> scores = {'Bob': 36};
     *     for (var key in ['Bob', 'Rohan', 'Sophena']) {
     *       scores.putIfAbsent(key, () => key.length);
     *     }
     *     scores['Bob'];      // 36
     *     scores['Rohan'];    //  5
     *     scores['Sophena'];  //  7
     *
     * Calling [ifAbsent] must not add or remove keys from the map.
     */
    putIfAbsent(key, ifAbsent) {
        throw Error('abstract');
    }
    /**
     * Adds all key-value pairs of [other] to this map.
     *
     * If a key of [other] is already in this map, its value is overwritten.
     *
     * The operation is equivalent to doing `this[key] = value` for each key
     * and associated value in other. It iterates over [other], which must
     * therefore not change during the iteration.
     */
    addAll(other) {
        throw Error('abstract');
    }
    /**
     * Removes [key] and its associated value, if present, from the map.
     *
     * Returns the value associated with `key` before it was removed.
     * Returns `null` if `key` was not in the map.
     *
     * Note that values can be `null` and a returned `null` value doesn't
     * always mean that the key was absent.
     */
    remove(key) {
        throw Error('abstract');
    }
    /**
     * Removes all pairs from the map.
     *
     * After this, the map is empty.
     */
    clear() {
        throw Error('abstract');
    }
    /**
     * Applies [f] to each key-value pair of the map.
     *
     * Calling `f` must not add or remove keys from the map.
     */
    forEach(f) {
        throw Error('abstract');
    }
    /**
     * The keys of [this].
     *
     * The returned iterable has efficient `length` and `contains` operations,
     * based on [length] and [containsKey] of the map.
     *
     * The order of iteration is defined by the individual `Map` implementation,
     * but must be consistent between changes to the map.
     *
     * Modifying the map while iterating the keys
     * may break the iteration.
     */
    get keys() {
        throw Error('abstract');
    }
    /**
     * The values of [this].
     *
     * The values are iterated in the order of their corresponding keys.
     * This means that iterating [keys] and [values] in parallel will
     * provided matching pairs of keys and values.
     *
     * The returned iterable has an efficient `length` method based on the
     * [length] of the map. Its [Iterable.contains] method is based on
     * `==` comparison.
     *
     * Modifying the map while iterating the
     * values may break the iteration.
     */
    get values() {
        throw Error('abstract');
    }
    /**
     * The number of key-value pairs in the map.
     */
    get length() {
        throw Error('abstract');
    }
    /**
     * Returns true if there is no key-value pair in the map.
     */
    get isEmpty() {
        throw Error('abstract');
    }
    /**
     * Returns true if there is at least one key-value pair in the map.
     */
    get isNotEmpty() {
        throw Error('abstract');
    }
    //@patch
    static _unmodifiable(other) {
        return new DartConstantMap.from(other);
    }
    //@patch
    static _create() {
        return new DartJsLinkedHashMap.es6();
    }
    // Better nameing for maps
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
}; // Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
__decorate([
    Abstract
], DartMap.prototype, "containsValue", null);
__decorate([
    Abstract
], DartMap.prototype, "containsKey", null);
__decorate([
    Abstract
], DartMap.prototype, "putIfAbsent", null);
__decorate([
    Abstract
], DartMap.prototype, "addAll", null);
__decorate([
    Abstract
], DartMap.prototype, "remove", null);
__decorate([
    Abstract
], DartMap.prototype, "clear", null);
__decorate([
    Abstract
], DartMap.prototype, "forEach", null);
__decorate([
    Abstract
], DartMap.prototype, "keys", null);
__decorate([
    Abstract
], DartMap.prototype, "values", null);
__decorate([
    Abstract
], DartMap.prototype, "length", null);
__decorate([
    Abstract
], DartMap.prototype, "isEmpty", null);
__decorate([
    Abstract
], DartMap.prototype, "isNotEmpty", null);
__decorate([
    namedFactory
], DartMap, "_from", null);
__decorate([
    namedFactory
], DartMap, "_identity", null);
__decorate([
    namedFactory
], DartMap, "_fromIterable", null);
__decorate([
    namedFactory
], DartMap, "_fromIterables", null);
__decorate([
    namedFactory
], DartMap, "_unmodifiable", null);
__decorate([
    defaultFactory
], DartMap, "_create", null);
DartMap = __decorate([
    DartClass
], DartMap);
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.collection;
/**
 * Mixin implementing a [Map].
 *
 * This mixin has a basic implementation of all but five of the members of
 * [Map].
 * A basic `Map` class can be implemented by mixin in this class and
 * implementing `keys`, `operator[]`, `operator[]=`, `remove` and `clear`.
 * The remaining operations are implemented in terms of these five.
 *
 * The `keys` iterable should have efficient [length] and [contains]
 * operations, and it should catch concurrent modifications of the keys
 * while iterating.
 *
 * A more efficient implementation is usually possible by overriding
 * some of the other members as well.
 */
let DartMapMixin = class DartMapMixin {
    get keys() {
        throw new Error('abstract');
    }
    [OPERATOR_INDEX](key) {
        throw new Error('abstract');
    }
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw new Error('abstract');
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
    remove(key) {
        throw new Error('abstract');
    }
    // The `clear` operation should not be based on `remove`.
    // It should clear the map even if some keys are not equal to themselves.
    clear() {
        throw new Error('abstract');
    }
    forEach(action) {
        for (let key of this.keys) {
            action(key, this[OPERATOR_INDEX](key));
        }
    }
    addAll(other) {
        for (let key of other.keys) {
            this[OPERATOR_INDEX_ASSIGN](key, other[OPERATOR_INDEX](key));
        }
    }
    containsValue(value) {
        for (let key of this.keys) {
            if (_dart.equals(this[OPERATOR_INDEX](key), value))
                return true;
        }
        return false;
    }
    putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key)) {
            return this[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }
    containsKey(key) {
        return this.keys.contains(key);
    }
    get length() {
        return this.keys.length;
    }
    get isEmpty() {
        return this.keys.isEmpty;
    }
    get isNotEmpty() {
        return this.keys.isNotEmpty;
    }
    get values() {
        return new _MapBaseValueIterable(this);
    }
    toString() {
        return DartMaps.mapToString(this);
    }
};
DartMapMixin = __decorate([
    Implements(DartMap)
], DartMapMixin);
/**
 * Base class for implementing a [Map].
 *
 * This class has a basic implementation of all but five of the members of
 * [Map].
 * A basic `Map` class can be implemented by extending this class and
 * implementing `keys`, `operator[]`, `operator[]=`, `remove` and `clear`.
 * The remaining operations are implemented in terms of these five.
 *
 * The `keys` iterable should have efficient [length] and [contains]
 * operations, and it should catch concurrent modifications of the keys
 * while iterating.
 *
 * A more efficient implementation is usually possible by overriding
 * some of the other members as well.
 */
class DartMapBase extends DartMapMixin {
}
/**
 * Implementation of [Map.values] based on the map and its [Map.keys] iterable.
 *
 * Iterable that iterates over the values of a `Map`.
 * It accesses the values by iterating over the keys of the map, and using the
 * map's `operator[]` to lookup the keys.
 */
class _MapBaseValueIterable extends DartEfficientLengthIterable {
    constructor(_map) {
        super();
        this._map = _map;
    }
    get length() {
        return this._map.length;
    }
    get isEmpty() {
        return this._map.isEmpty;
    }
    get isNotEmpty() {
        return this._map.isNotEmpty;
    }
    get first() {
        return this._map[OPERATOR_INDEX](this._map.keys.first);
    }
    get single() {
        return this._map[OPERATOR_INDEX](this._map.keys.single);
    }
    get last() {
        return this._map[OPERATOR_INDEX](this._map.keys.last);
    }
    get iterator() {
        return new _MapBaseValueIterator(this._map);
    }
}
/**
 * Iterator created by [_MapBaseValueIterable].
 *
 * Iterates over the values of a map by iterating its keys and lookup up the
 * values.
 */
//@Implements(DartIterator)
class _MapBaseValueIterator {
    constructor(map) {
        this._current = null;
        this._map = map;
        this._keys = map.keys.iterator;
    }
    moveNext() {
        if (this._keys.moveNext()) {
            this._current = this._map[OPERATOR_INDEX](this._keys.current);
            return true;
        }
        this._current = null;
        return false;
    }
    get current() {
        return this._current;
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
/**
 * Basic implementation of an unmodifiable [Map].
 *
 * This class has a basic implementation of all but two of the members of
 * an umodifiable [Map].
 * A simple unmodifiable `Map` class can be implemented by extending this
 * class and implementing `keys` and `operator[]`.
 *
 * Modifying operations throw when used.
 * The remaining non-modifying operations are implemented in terms of `keys`
 * and `operator[]`.
 *
 * The `keys` iterable should have efficient [length] and [contains]
 * operations, and it should catch concurrent modifications of the keys
 * while iterating.
 *
 * A more efficient implementation is usually possible by overriding
 * some of the other members as well.
 */
let UnmodifiableMapBase = class UnmodifiableMapBase extends DartMapBase {
};
UnmodifiableMapBase = __decorate([
    With(_UnmodifiableMapMixin)
], UnmodifiableMapBase);
/**
 * Helper class which implements complex [Map] operations
 * in term of basic ones ([Map.keys], [Map.[]],
 * [Map.[]=] and [Map.remove].)  Not all methods are
 * necessary to implement each particular operation.
 */
export var DartMaps;
(function (DartMaps) {
    function containsValue(map, value) {
        for (let v of map.values) {
            if (_dart.equals(v, value)) {
                return true;
            }
        }
        return false;
    }
    DartMaps.containsValue = containsValue;
    function containsKey(map, key) {
        for (let k of map.keys) {
            if (_dart.equals(k, key)) {
                return true;
            }
        }
        return false;
    }
    DartMaps.containsKey = containsKey;
    function putIfAbsent(map, key, ifAbsent) {
        if (map.containsKey(key)) {
            return map[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        map[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }
    DartMaps.putIfAbsent = putIfAbsent;
    function clear(map) {
        for (let k of map.keys.toList()) {
            map.remove(k);
        }
    }
    DartMaps.clear = clear;
    function forEach(map, f) {
        for (let k of map.keys) {
            f(k, map[OPERATOR_INDEX](k));
        }
    }
    DartMaps.forEach = forEach;
    function getValues(map) {
        return map.keys.map((key) => map[OPERATOR_INDEX](key));
    }
    DartMaps.getValues = getValues;
    function length(map) {
        return map.keys.length;
    }
    DartMaps.length = length;
    function isEmpty(map) {
        return map.keys.isEmpty;
    }
    DartMaps.isEmpty = isEmpty;
    function isNotEmpty(map) {
        return map.keys.isNotEmpty;
    }
    DartMaps.isNotEmpty = isNotEmpty;
    /**
     * Returns a string representing the specified map. The returned string
     * looks like this: [:'{key0: value0, key1: value1, ... keyN: valueN}':].
     * The value returned by its [toString] method is used to represent each
     * key or value.
     *
     * If the map collection contains a reference to itself, either
     * directly as a key or value, or indirectly through other collections
     * or maps, the contained reference is rendered as [:'{...}':]. This
     * prevents the infinite regress that would otherwise occur. So, for example,
     * calling this method on a map whose sole entry maps the string key 'me'
     * to a reference to the map would return [:'{me: {...}}':].
     *
     * A typical implementation of a map's [toString] method will
     * simply return the results of this method applied to the collection.
     */
    function mapToString(m) {
        // Reuse the list in IterableBase for detecting toString cycles.
        if (_isToStringVisiting(m)) {
            return '{...}';
        }
        let result = new DartStringBuffer();
        try {
            _toStringVisiting.add(m);
            result.write('{');
            let first = true;
            m.forEach((k, v) => {
                if (!first) {
                    result.write(', ');
                }
                first = false;
                result.write(k);
                result.write(': ');
                result.write(v);
            });
            result.write('}');
        }
        finally {
            //assert(identical(_toStringVisiting.last, m));
            _toStringVisiting.removeLast();
        }
        return result.toString();
    }
    DartMaps.mapToString = mapToString;
    function _id(x) {
        return x;
    }
    /**
     * Fills a map with key/value pairs computed from [iterable].
     *
     * This method is used by Map classes in the named constructor fromIterable.
     */
    function _fillMapWithMappedIterable(map, iterable, key, value) {
        if (key == null)
            key = _id;
        if (value == null)
            value = _id;
        for (let element of iterable) {
            map[OPERATOR_INDEX_ASSIGN](key(element), value(element));
        }
    }
    DartMaps._fillMapWithMappedIterable = _fillMapWithMappedIterable;
    /**
     * Fills a map by associating the [keys] to [values].
     *
     * This method is used by Map classes in the named constructor fromIterables.
     */
    function _fillMapWithIterables(map, keys, values) {
        let keyIterator = keys.iterator;
        let valueIterator = values.iterator;
        let hasNextKey = keyIterator.moveNext();
        let hasNextValue = valueIterator.moveNext();
        while (hasNextKey && hasNextValue) {
            map[OPERATOR_INDEX_ASSIGN](keyIterator.current, valueIterator.current);
            hasNextKey = keyIterator.moveNext();
            hasNextValue = valueIterator.moveNext();
        }
        if (hasNextKey || hasNextValue) {
            throw new ArgumentError("Iterables do not have same length.");
        }
    }
    DartMaps._fillMapWithIterables = _fillMapWithIterables;
})(DartMaps || (DartMaps = {}));
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.core;
/**
 * A collection of objects in which each object can occur only once.
 *
 * That is, for each object of the element type, the object is either considered
 * to be in the set, or to _not_ be in the set.
 *
 * Set implementations may consider some elements indistinguishable. These
 * elements are treated as being the same for any operation on the set.
 *
 * The default [Set] implementation, [LinkedHashSet], considers objects
 * indistinguishable if they are equal with regard to
 * operator [Object.==].
 *
 * Iterating over elements of a set may be either unordered
 * or ordered in some way. Examples:
 *
 * * A [HashSet] is unordered, which means that its iteration order is
 *   unspecified,
 * * [LinkedHashSet] iterates in the insertion order of its elements, and
 * * a sorted set like [SplayTreeSet] iterates the elements in sorted order.
 *
 * It is generally not allowed to modify the set (add or remove elements) while
 * an operation on the set is being performed, for example during a call to
 * [forEach] or [containsAll]. Nor is it allowed to modify the DartSet while
 * iterating either the set itself or any [Iterable] that is backed by the set,
 * such as the ones returned by methods like [where] and [map].
 */
let DartSet = class DartSet extends DartEfficientLengthIterable {
    constructor() {
        super();
    }
    /**
     * Creates an empty [Set].
     *
     * The created [Set] is a plain [LinkedHashSet].
     * As such, it considers elements that are equal (using [==]) to be
     * indistinguishable, and requires them to have a compatible
     * [Object.hashCode] implementation.
     *
     * The set is equivalent to one created by `new LinkedHashSet<E>()`.
     */
    static create() {
        return new DartLinkedHashSet();
    }
    /**
     * Creates an empty identity [Set].
     *
     * The created [Set] is a [LinkedHashSet] that uses identity as equality
     * relation.
     *
     * The set is equivalent to one created by `new LinkedHashSet<E>.identity()`.
     */
    static _identity() {
        return new DartLinkedHashSet.identity();
    }
    /**
     * Creates a [Set] that contains all [elements].
     *
     * All the [elements] should be assignable to [E].
     * The `elements` iterable itself can have any type,
     * so this constructor can be used to down-cast a `Set`, for example as:
     *
     *     Set<SuperType> superSet = ...;
     *     Set<SubType> subSet =
     *         new Set<SubType>.from(superSet.where((e) => e is SubType));
     *
     * The created [Set] is a [LinkedHashSet]. As such, it considers elements that
     * are equal (using [==]) to be indistinguishable, and requires them to
     * have a compatible [Object.hashCode] implementation.
     *
     * The set is equivalent to one created by
     * `new LinkedHashSet<E>.from(elements)`.
     */
    static _from(elements) {
        return new DartLinkedHashSet.from(elements);
    }
    /**
     * Provides an iterator that iterates over the elements of this set.
     *
     * The order of iteration is defined by the individual `Set` implementation,
     * but must be consistent between changes to the set.
     */
    get iterator() {
        throw new Error('abstract');
    }
    /**
     * Returns true if [value] is in the set.
     */
    contains(value) {
        throw new Error('abstract');
    }
    /**
     * Adds [value] to the set.
     *
     * Returns `true` if [value] (or an equal value) was not yet in the set.
     * Otherwise returns `false` and the set is not changed.
     *
     * Example:
     *
     *     var set = new Set();
     *     var time1 = new DateTime.fromMillisecondsSinceEpoch(0);
     *     var time2 = new DateTime.fromMillisecondsSinceEpoch(0);
     *     // time1 and time2 are equal, but not identical.
     *     Expect.isTrue(time1 == time2);
     *     Expect.isFalse(identical(time1, time2));
     *     set.add(time1);  // => true.
     *     // A value equal to time2 exists already in the set, and the call to
     *     // add doesn't change the set.
     *     set.add(time2);  // => false.
     *     Expect.isTrue(set.length == 1);
     *     Expect.isTrue(identical(time1, set.first));
     */
    add(value) {
        throw new Error('abstract');
    }
    /**
     * Adds all [elements] to this Set.
     *
     * Equivalent to adding each element in [elements] using [add],
     * but some collections may be able to optimize it.
     */
    addAll(elements) {
        throw new Error('abstract');
    }
    /**
     * Removes [value] from the set. Returns true if [value] was
     * in the set. Returns false otherwise. The method has no effect
     * if [value] value was not in the set.
     */
    remove(value) {
        throw new Error('abstract');
    }
    /**
     * If an object equal to [object] is in the set, return it.
     *
     * Checks if there is an object in the set that is equal to [object].
     * If so, that object is returned, otherwise returns null.
     */
    lookup(object) {
        throw new Error('abstract');
    }
    /**
     * Removes each element of [elements] from this set.
     */
    removeAll(elements) {
        throw new Error('abstract');
    }
    /**
     * Removes all elements of this set that are not elements in [elements].
     *
     * Checks for each element of [elements] whether there is an element in this
     * set that is equal to it (according to `this.contains`), and if so, the
     * equal element in this set is retained, and elements that are not equal
     * to any element in `elements` are removed.
     */
    retainAll(elements) {
        throw new Error('abstract');
    }
    /**
     * Removes all elements of this set that satisfy [test].
     */
    removeWhere(test) {
        throw new Error('abstract');
    }
    /**
     * Removes all elements of this set that fail to satisfy [test].
     */
    retainWhere(test) {
        throw new Error('abstract');
    }
    /**
     * Returns whether this Set contains all the elements of [other].
     */
    containsAll(other) {
        throw new Error('abstract');
    }
    /**
     * Returns a new set which is the intersection between this set and [other].
     *
     * That is, the returned set contains all the elements of this [Set] that
     * are also elements of [other] according to `other.contains`.
     */
    intersection(other) {
        throw new Error('abstract');
    }
    /**
     * Returns a new set which contains all the elements of this set and [other].
     *
     * That is, the returned set contains all the elements of this [Set] and
     * all the elements of [other].
     */
    union(other) {
        throw new Error('abstract');
    }
    /**
     * Returns a new set with the elements of this that are not in [other].
     *
     * That is, the returned set contains all the elements of this [DartSet] that
     * are not elements of [other] according to `other.contains`.
     */
    difference(other) {
        throw new Error('abstract');
    }
    /**
     * Removes all elements in the set.
     */
    clear() {
        throw new Error('abstract');
    }
    /* Creates a [Set] with the same elements and behavior as this `Set`.
     *
     * The returned set behaves the same as this set
     * with regard to adding and removing elements.
     * It initially contains the same elements.
     * If this set specifies an ordering of the elements,
     * the returned set will have the same order.
     */
    toSet() {
        throw new Error('abstract');
    }
    get length() {
        throw new Error('abstract');
    }
};
__decorate([
    Abstract
], DartSet.prototype, "iterator", null);
__decorate([
    Abstract
], DartSet.prototype, "contains", null);
__decorate([
    Abstract
], DartSet.prototype, "add", null);
__decorate([
    Abstract
], DartSet.prototype, "addAll", null);
__decorate([
    Abstract
], DartSet.prototype, "remove", null);
__decorate([
    Abstract
], DartSet.prototype, "lookup", null);
__decorate([
    Abstract
], DartSet.prototype, "removeAll", null);
__decorate([
    Abstract
], DartSet.prototype, "retainAll", null);
__decorate([
    Abstract
], DartSet.prototype, "removeWhere", null);
__decorate([
    Abstract
], DartSet.prototype, "retainWhere", null);
__decorate([
    Abstract
], DartSet.prototype, "containsAll", null);
__decorate([
    Abstract
], DartSet.prototype, "intersection", null);
__decorate([
    Abstract
], DartSet.prototype, "union", null);
__decorate([
    Abstract
], DartSet.prototype, "difference", null);
__decorate([
    Abstract
], DartSet.prototype, "clear", null);
__decorate([
    Abstract
], DartSet.prototype, "toSet", null);
__decorate([
    Abstract
], DartSet.prototype, "length", null);
__decorate([
    defaultFactory
], DartSet, "create", null);
__decorate([
    namedFactory
], DartSet, "_identity", null);
__decorate([
    namedFactory
], DartSet, "_from", null);
DartSet = __decorate([
    DartClass
], DartSet);
class DartSort {
    static sort(arg0, arg1) {
        throw new Error("Method not implemented.");
    }
} // Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * A class for concatenating strings efficiently.
 *
 * Allows for the incremental building of a string using write*() methods.
 * The strings are concatenated to a single string only when [toString] is
 * called.
 */
let DartStringBuffer = DartStringBuffer_1 = 
//@Implements(DartStringSink)
class DartStringBuffer {
    /** Creates the string buffer with an initial content. */
    constructor(content) {
    }
    /**
     * Returns the length of the content that has been accumulated so far.
     * This is a constant-time operation.
     */
    /*external*/
    /*
    get length(): int {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
        return undefined;
    }*/
    /** Returns whether the buffer is empty. This is a constant-time operation. */
    get isEmpty() {
        return this.length == 0;
    }
    /**
     * Returns whether the buffer is not empty. This is a constant-time
     * operation.
     */
    get isNotEmpty() {
        return !this.isEmpty;
    }
    //@patch
    create(content /*  =""*/) {
        if (content === undefined) {
            content = '';
        }
        this._contents = `${content}`;
    }
    //@patch
    get length() {
        return this._contents.length;
    }
    //@patch
    write(obj) {
        this._writeString(`${obj}`);
    }
    //@patch
    writeCharCode(charCode) {
        this._writeString(new DartString.fromCharCode(charCode));
    }
    //@patch
    writeAll(objects, separator /* = ""*/) {
        this._contents = DartStringBuffer_1._writeAll(this._contents, objects, separator);
    }
    //@patch
    writeln(obj /* = ""*/) {
        this._writeString(`${obj}\n`);
    }
    //@patch
    clear() {
        this._contents = "";
    }
    //@patch
    toString() {
        return DartPrimitives.flattenString(this._contents);
    }
    _writeString(str) {
        this._contents = DartPrimitives.stringConcatUnchecked(this._contents, str);
    }
    static _writeAll(string, objects, separator) {
        let iterator = objects.iterator;
        if (!iterator.moveNext())
            return string;
        if (new DartString(separator).isEmpty) {
            do {
                string = this._writeOne(string, iterator.current);
            } while (iterator.moveNext());
        }
        else {
            string = this._writeOne(string, iterator.current);
            while (iterator.moveNext()) {
                string = this._writeOne(string, separator);
                string = this._writeOne(string, iterator.current);
            }
        }
        return string;
    }
    static _writeOne(string, obj) {
        return DartPrimitives.stringConcatUnchecked(string, `${obj}`);
    }
};
__decorate([
    defaultConstructor
], DartStringBuffer.prototype, "create", null);
DartStringBuffer = DartStringBuffer_1 = __decorate([
    DartClass
    //@Implements(DartStringSink)
], DartStringBuffer);
/**
 * Mixin for an unmodifiable [List] class.
 *
 * This overrides all mutating methods with methods that throw.
 * This mixin is intended to be mixed in on top of [ListMixin] on
 * unmodifiable lists.
 */
class DartUnmodifiableListMixin {
    /** This operation is not supported by an unmodifiable list. */
    [OPERATOR_INDEX_ASSIGN](index, value) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    set length(newLength) {
        throw new UnsupportedError("Cannot change the length of an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    setAll(at, iterable) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    add(value) {
        throw new UnsupportedError("Cannot add to an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    insert(index, element) {
        throw new UnsupportedError("Cannot add to an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    insertAll(at, iterable) {
        throw new UnsupportedError("Cannot add to an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    addAll(iterable) {
        throw new UnsupportedError("Cannot add to an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    remove(element) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    removeWhere(test) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    retainWhere(test) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    sort(compare) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    shuffle(random) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    clear() {
        throw new UnsupportedError("Cannot clear an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    removeAt(index) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    removeLast() {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    setRange(start, end, iterable, skipCount /* = 0*/) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    removeRange(start, end) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    replaceRange(start, end, iterable) {
        throw new UnsupportedError("Cannot remove from an unmodifiable list");
    }
    /** This operation is not supported by an unmodifiable list. */
    fillRange(start, end, fillValue) {
        throw new UnsupportedError("Cannot modify an unmodifiable list");
    }
}
/**
 * Abstract implementation of an unmodifiable list.
 *
 * All operations are defined in terms of `length` and `operator[]`,
 * which need to be implemented.
 */
let DartUnmodifiableListBase = class DartUnmodifiableListBase extends DartListBase {
};
DartUnmodifiableListBase = __decorate([
    With(DartUnmodifiableListMixin)
], DartUnmodifiableListBase);
/**
 * An unmodifiable [List] view of another List.
 *
 * The source of the elements may be a [List] or any [Iterable] with
 * efficient [Iterable.length] and [Iterable.elementAt].
 */
class UnmodifiableListView extends DartUnmodifiableListBase {
    /**
     * Creates an unmodifiable list backed by [source].
     *
     * The [source] of the elements may be a [List] or any [Iterable] with
     * efficient [Iterable.length] and [Iterable.elementAt].
     */
    constructor(source) {
        super();
        this._source = source;
    }
    get length() {
        return this._source.length;
    }
    [OPERATOR_INDEX](index) {
        return this._source.elementAt(index);
    }
}
/**
 * Mixin that throws on the length changing operations of [List].
 *
 * Intended to mix-in on top of [ListMixin] for fixed-length lists.
 */
class DartFixedLengthListMixin {
    /** This operation is not supported by a fixed length list. */
    set length(newLength) {
        throw new UnsupportedError("Cannot change the length of a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    add(value) {
        throw new UnsupportedError("Cannot add to a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    insert(index, value) {
        throw new UnsupportedError("Cannot add to a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    insertAll(at, iterable) {
        throw new UnsupportedError("Cannot add to a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    addAll(iterable) {
        throw new UnsupportedError("Cannot add to a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    remove(element) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    removeWhere(test) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    retainWhere(test) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    clear() {
        throw new UnsupportedError("Cannot clear a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    removeAt(index) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    removeLast() {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    removeRange(start, end) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
    /** This operation is not supported by a fixed length list. */
    replaceRange(start, end, iterable) {
        throw new UnsupportedError("Cannot remove from a fixed-length list");
    }
}
/**
 * Abstract implementation of a fixed-length list.
 *
 * All operations are defined in terms of `length`, `operator[]` and
 * `operator[]=`, which need to be implemented.
 */
let FixedLengthListBase = class FixedLengthListBase extends DartListBase {
};
FixedLengthListBase = __decorate([
    With(DartFixedLengthListMixin)
], FixedLengthListBase);
/**
 * An [Iterable] for classes that have efficient [length] and [elementAt].
 *
 * All other methods are implemented in terms of [length] and [elementAt],
 * including [iterator].
 */
export class DartListIterable extends DartEfficientLengthIterable {
    constructor() {
        super();
    }
    get iterator() {
        return new DartListIterator(this);
    }
    forEach(action) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            action(this.elementAt(i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
    }
    get isEmpty() {
        return this.length == 0;
    }
    get first() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        return this.elementAt(0);
    }
    get last() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        return this.elementAt(this.length - 1);
    }
    get single() {
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        if (this.length > 1)
            throw DartIterableElementError.tooMany();
        return this.elementAt(0);
    }
    contains(element) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (_dart.equals(this.elementAt(i), element))
                return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }
    every(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (!test(this.elementAt(i)))
                return false;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return true;
    }
    any(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (test(this.elementAt(i)))
                return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let length = this.length;
        for (let i = 0; i < length; i++) {
            let element = this.elementAt(i);
            if (test(element))
                return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
            let element = this.elementAt(i);
            if (test(element))
                return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test) {
        let length = this.length;
        let match = null;
        let matchFound = false;
        for (let i = 0; i < length; i++) {
            let element = this.elementAt(i);
            if (test(element)) {
                if (matchFound) {
                    throw DartIterableElementError.tooMany();
                }
                matchFound = true;
                match = element;
            }
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (matchFound)
            return match;
        throw DartIterableElementError.noElement();
    }
    join(separator /* = "" */) {
        separator = separator || "";
        let length = this.length;
        if (!(new DartString(separator)).isEmpty) {
            if (length == 0)
                return "";
            let first = `${this.elementAt(0)}`;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
            let buffer = new DartStringBuffer(first);
            for (let i = 1; i < length; i++) {
                buffer.write(separator);
                buffer.write(this.elementAt(i));
                if (length != this.length) {
                    throw new ConcurrentModificationError(this);
                }
            }
            return buffer.toString();
        }
        else {
            let buffer = new DartStringBuffer();
            for (let i = 0; i < length; i++) {
                buffer.write(this.elementAt(i));
                if (length != this.length) {
                    throw new ConcurrentModificationError(this);
                }
            }
            return buffer.toString();
        }
    }
    where(test) {
        return super.where(test);
    }
    map(f) {
        return new DartMappedListIterable(this, f);
    }
    reduce(combine) {
        let length = this.length;
        if (length == 0)
            throw DartIterableElementError.noElement();
        let value = this.elementAt(0);
        for (let i = 1; i < length; i++) {
            value = combine(value, this.elementAt(i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return value;
    }
    fold(initialValue, combine) {
        let value = initialValue;
        let length = this.length;
        for (let i = 0; i < length; i++) {
            value = combine(value, this.elementAt(i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return value;
    }
    skip(count) {
        return new DartSubListIterable(this, count, null);
    }
    skipWhile(test) {
        return super.skipWhile(test);
    }
    take(count) {
        return new DartSubListIterable(this, 0, count);
    }
    takeWhile(test) {
        return super.takeWhile(test);
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        let result;
        if (growable) {
            result = new DartList();
            result.length = this.length;
        }
        else {
            result = new DartList(this.length);
        }
        for (let i = 0; i < this.length; i++) {
            result[i] = this.elementAt(i);
        }
        return result;
    }
    toSet() {
        let result = new DartSet();
        for (let i = 0; i < this.length; i++) {
            result.add(this.elementAt(i));
        }
        return result;
    }
}
class _ListIndicesIterable extends DartListIterable {
    constructor(_backedList) {
        super();
        this._backedList = _backedList;
    }
    get length() {
        return this._backedList.length;
    }
    elementAt(index) {
        RangeError.checkValidIndex(index, this);
        return index;
    }
}
let DartListMapView = class DartListMapView {
    constructor(_values) {
        this._values = _values;
    }
    [OPERATOR_INDEX](key) {
        return this.containsKey(key) ? this._values.elementAt(key) : null;
    }
    get length() {
        return this._values.length;
    }
    get values() {
        return new DartSubListIterable(this._values, 0, null);
    }
    get keys() {
        return new _ListIndicesIterable(this._values);
    }
    get isEmpty() {
        return this._values.isEmpty;
    }
    get isNotEmpty() {
        return this._values.isNotEmpty;
    }
    containsValue(value) {
        return this._values.contains(value);
    }
    containsKey(key) {
        return _dart.is(key, 'int') && key >= 0 && key < this.length;
    }
    forEach(f) {
        let length = this._values.length;
        for (let i = 0; i < length; i++) {
            f(i, this._values.elementAt(i));
            if (length != this._values.length) {
                throw new ConcurrentModificationError(this._values);
            }
        }
    }
    /** This operation is not supported by an unmodifiable map. */
    [OPERATOR_INDEX_ASSIGN](key, value) {
        throw new UnsupportedError("Cannot modify an unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key, ifAbsent) {
        throw new UnsupportedError("Cannot modify an unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    remove(key) {
        throw new UnsupportedError("Cannot modify an unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    clear() {
        throw new UnsupportedError("Cannot modify an unmodifiable map");
    }
    /** This operation is not supported by an unmodifiable map. */
    addAll(other) {
        throw new UnsupportedError("Cannot modify an unmodifiable map");
    }
    toString() {
        return DartMaps.mapToString(this);
    }
    get(k) {
        return this[OPERATOR_INDEX](k);
    }
    set(k, v) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
};
DartListMapView = __decorate([
    Implements(DartMap)
], DartListMapView);
class DartReversedListIterable extends DartListIterable {
    constructor(_source) {
        super();
        this._source = _source;
    }
    get length() {
        return this._source.length;
    }
    elementAt(index) {
        return this._source.elementAt(this._source.length - 1 - index);
    }
}
/**
 * Creates errors thrown by unmodifiable lists when they are attempted modified.
 *
 * This class creates [UnsupportedError]s with specialized messages.
 */
var UnmodifiableListError;
(function (UnmodifiableListError) {
    /** Error thrown when trying to add elements to an unmodifiable list. */
    function add() {
        return new UnsupportedError("Cannot add to unmodifiable List");
    }
    /** Error thrown when trying to add elements to an unmodifiable list. */
    function change() {
        return new UnsupportedError("Cannot change the content of an unmodifiable List");
    }
    /** Error thrown when trying to change the length of an unmodifiable list. */
    function length() {
        return new UnsupportedError("Cannot change length of unmodifiable List");
    }
    /** Error thrown when trying to remove elements from an unmodifiable list. */
    function remove() {
        return new UnsupportedError("Cannot remove from unmodifiable List");
    }
})(UnmodifiableListError || (UnmodifiableListError = {}));
/**
 * Creates errors thrown by non-growable lists when they are attempted modified.
 *
 * This class creates [UnsupportedError]s with specialized messages.
 */
var DartNonGrowableListError;
(function (DartNonGrowableListError) {
    /** Error thrown when trying to add elements to an non-growable list. */
    function add() {
        return new UnsupportedError("Cannot add to non-growable List");
    }
    /** Error thrown when trying to change the length of an non-growable list. */
    function length() {
        return new UnsupportedError("Cannot change length of non-growable List");
    }
    /** Error thrown when trying to remove elements from an non-growable list. */
    function remove() {
        return new UnsupportedError("Cannot remove from non-growable List");
    }
})(DartNonGrowableListError || (DartNonGrowableListError = {}));
/**
 * Converts a growable list to a fixed length list with the same elements.
 *
 * For internal use only.
 * Only works on growable lists as created by `[]` or `new List()`.
 * May throw on any other list.
 *
 * The operation is efficient. It doesn't copy the elements, but converts
 * the existing list directly to a fixed length list.
 * That means that it is a destructive conversion.
 * The original list should not be used afterwards.
 *
 * The returned list may be the same list as the original,
 * or it may be a different list (according to [identical]).
 * The original list may have changed type to be a fixed list,
 * or become empty or been otherwise modified.
 * It will still be a valid object, so references to it will not, e.g., crash
 * the runtime if accessed, but no promises are made wrt. its contents.
 *
 * This unspecified behavior is the reason the function is not exposed to
 * users. We allow the underlying implementation to make the most efficient
 * conversion, at the cost of leaving the original list in an unspecified
 * state.
 */
export function makeListFixedLength(growableList) {
    return growableList;
}
/**
 * Converts a fixed-length list to an unmodifiable list.
 *
 * For internal use only.
 * Only works for core fixed-length lists as created by `new List(length)`,
 * or as returned by [makeListFixedLength].
 *
 * The operation is efficient. It doesn't copy the elements, but converts
 * the existing list directly to a fixed length list.
 * That means that it is a destructive conversion.
 * The original list should not be used afterwards.
 *
 * The unmodifiable list type is similar to the one used by const lists.
 */
export function makeFixedListUnmodifiable(fixedLengthList) {
    return fixedLengthList;
}
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart._internal;
class DartSubListIterable extends DartListIterable {
    constructor(_iterable, _start, _endOrLength) {
        super();
        this._iterable = _iterable;
        this._start = _start;
        this._endOrLength = _endOrLength;
        RangeError.checkNotNegative(_start, "start");
        if (_endOrLength != null) {
            RangeError.checkNotNegative(_endOrLength, "end");
            if (_start > _endOrLength) {
                throw new RangeError.range(_start, 0, _endOrLength, "start");
            }
        }
    }
    get _endIndex() {
        let length = this._iterable.length;
        if (this._endOrLength == null || this._endOrLength > length)
            return length;
        return this._endOrLength;
    }
    get _startIndex() {
        let length = this._iterable.length;
        if (this._start > length)
            return length;
        return this._start;
    }
    get length() {
        let length = this._iterable.length;
        if (this._start >= length)
            return 0;
        if (this._endOrLength == null || this._endOrLength >= length) {
            return length - this._start;
        }
        return this._endOrLength - this._start;
    }
    elementAt(index) {
        let realIndex = this._startIndex + index;
        if (index < 0 || realIndex >= this._endIndex) {
            throw new RangeError.index(index, this, "index");
        }
        return this._iterable.elementAt(realIndex);
    }
    skip(count) {
        RangeError.checkNotNegative(count, "count");
        let newStart = this._start + count;
        if (this._endOrLength != null && newStart >= this._endOrLength) {
            return new DartEmptyIterable();
        }
        return new DartSubListIterable(this._iterable, newStart, this._endOrLength);
    }
    take(count) {
        RangeError.checkNotNegative(count, "count");
        if (this._endOrLength == null) {
            return new DartSubListIterable(this._iterable, this._start, this._start + count);
        }
        else {
            let newEnd = this._start + count;
            if (this._endOrLength < newEnd)
                return this;
            return new DartSubListIterable(this._iterable, this._start, newEnd);
        }
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        let start = this._start;
        let end = this._iterable.length;
        if (this._endOrLength != null && this._endOrLength < end)
            end = this._endOrLength;
        let length = end - start;
        if (length < 0)
            length = 0;
        let result = growable ? ((_) => {
            _.length = length;
            return _;
        })(new DartList()) : new DartList(length);
        for (let i = 0; i < length; i++) {
            result[i] = this._iterable.elementAt(start + i);
            if (this._iterable.length < end)
                throw new ConcurrentModificationError(this);
        }
        return result;
    }
}
//@Implements(DartIterator)
class _BaseJSIterator {
    next(value) {
        return _JSnext(this);
    }
}
/**
 * An [Iterator] that iterates a list-like [Iterable].
 *
 * All iterations is done in terms of [Iterable.length] and
 * [Iterable.elementAt]. These operations are fast for list-like
 * iterables.
 */
//@Implements(DartIterator)
class DartListIterator extends _BaseJSIterator {
    constructor(iterable) {
        super();
        this._iterable = iterable;
        this._length = iterable.length;
        this._index = 0;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        let length = this._iterable.length;
        if (length != this._length) {
            throw new ConcurrentModificationError(this._iterable);
        }
        if (this._index >= length) {
            this._current = null;
            return false;
        }
        this._current = this._iterable.elementAt(this._index);
        this._index++;
        return true;
    }
}
let DartMappedIterable = DartMappedIterable_1 = class DartMappedIterable extends DartIterable {
    constructor(iterable, _function) {
        super();
    }
    static create(iterable, _function) {
        if (_dart.is(iterable, DartEfficientLengthIterable)) {
            return new DartEfficientLengthMappedIterable(iterable, _function);
        }
        return new DartMappedIterable_1._(iterable, _function);
    }
    _(_iterable, _f) {
        this._iterable = _iterable;
        this._f = _f;
    }
    get iterator() {
        return new DartMappedIterator(this._iterable.iterator, this._f);
    }
    // Length related functions are independent of the mapping.
    get length() {
        return this._iterable.length;
    }
    get isEmpty() {
        return this._iterable.isEmpty;
    }
    // Index based lookup can be done before transforming.
    get first() {
        return this._f(this._iterable.first);
    }
    get last() {
        return this._f(this._iterable.last);
    }
    get single() {
        return this._f(this._iterable.single);
    }
    elementAt(index) {
        return this._f(this._iterable.elementAt(index));
    }
};
__decorate([
    namedConstructor
], DartMappedIterable.prototype, "_", null);
__decorate([
    defaultFactory
], DartMappedIterable, "create", null);
DartMappedIterable = DartMappedIterable_1 = __decorate([
    DartClass
], DartMappedIterable);
let DartEfficientLengthMappedIterable = class DartEfficientLengthMappedIterable extends DartMappedIterable {
    constructor(iterable, _function) {
        super(iterable, _function);
    }
    _init(iterable, _function) {
        super._(iterable, _function);
    }
};
__decorate([
    defaultConstructor
], DartEfficientLengthMappedIterable.prototype, "_init", null);
DartEfficientLengthMappedIterable = __decorate([
    DartClass,
    Implements(DartEfficientLengthIterable)
], DartEfficientLengthMappedIterable);
//@Implements(DartIterator)
class DartMappedIterator extends _BaseJSIterator {
    constructor(_iterator, _f) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }
    moveNext() {
        if (this._iterator.moveNext()) {
            this._current = this._f(this._iterator.current);
            return true;
        }
        this._current = null;
        return false;
    }
    get current() {
        return this._current;
    }
}
/**
 * Specialized alternative to [MappedIterable] for mapped [List]s.
 *
 * Expects efficient `length` and `elementAt` on the source iterable.
 */
class DartMappedListIterable extends DartListIterable {
    constructor(_source, _f) {
        super();
        this._source = _source;
        this._f = _f;
    }
    get length() {
        return this._source.length;
    }
    elementAt(index) {
        return this._f(this._source.elementAt(index));
    }
}
class DartWhereIterable extends DartIterable {
    constructor(_iterable, _f) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }
    get iterator() {
        return new DartWhereIterator(this._iterable.iterator, this._f);
    }
    // Specialization of [Iterable.map] to non-EfficientLengthIterable.
    map(f) {
        return new DartMappedIterable(this, f);
    }
}
//@Implements(DartIterator)
class DartWhereIterator extends _BaseJSIterator {
    constructor(_iterator, _f) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }
    moveNext() {
        while (this._iterator.moveNext()) {
            if (this._f(this._iterator.current)) {
                return true;
            }
        }
        return false;
    }
    get current() {
        return this._iterator.current;
    }
}
class DartExpandIterable extends DartIterable {
    constructor(_iterable, _f) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }
    get iterator() {
        return new DartExpandIterator(this._iterable.iterator, this._f);
    }
}
class DartExpandIterator extends _BaseJSIterator {
    constructor(_iterator, _f) {
        super();
        // Initialize _currentExpansion to an empty iterable. A null value
        // marks the end of iteration, and we don't want to call _f before
        // the first moveNext call.
        this._currentExpansion = new DartEmptyIterator();
        this._iterator = _iterator;
        this._f = _f;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        if (this._currentExpansion == null)
            return false;
        while (!this._currentExpansion.moveNext()) {
            this._current = null;
            if (this._iterator.moveNext()) {
                // If _f throws, this ends iteration. Otherwise _currentExpansion and
                // _current will be set again below.
                this._currentExpansion = null;
                this._currentExpansion = this._f(this._iterator.current).iterator;
            }
            else {
                return false;
            }
        }
        this._current = this._currentExpansion.current;
        return true;
    }
}
class DartTakeIterable extends DartIterable {
    constructor(_iterable, _takeCount) {
        super();
        this._iterable = _iterable;
        this._takeCount = _takeCount;
    }
    static create(iterable, takeCount) {
        if (!_dart.is(takeCount, 'int') || takeCount < 0) {
            throw new ArgumentError(takeCount);
        }
        if (_dart.is(iterable, DartEfficientLengthIterable)) {
            return new DartEfficientLengthTakeIterable(iterable, takeCount);
        }
        return new DartTakeIterable(iterable, takeCount);
    }
    get iterator() {
        return new DartTakeIterator(this._iterable.iterator, this._takeCount);
    }
}
let DartEfficientLengthTakeIterable = class DartEfficientLengthTakeIterable extends DartTakeIterable {
    constructor(iterable, takeCount) {
        super(iterable, takeCount);
    }
    get length() {
        let iterableLength = this._iterable.length;
        if (iterableLength > this._takeCount)
            return this._takeCount;
        return iterableLength;
    }
};
DartEfficientLengthTakeIterable = __decorate([
    Implements(DartEfficientLengthIterable)
], DartEfficientLengthTakeIterable);
class DartTakeIterator extends _BaseJSIterator {
    constructor(_iterator, _remaining) {
        super();
        this._iterator = _iterator;
        this._remaining = _remaining;
    }
    moveNext() {
        this._remaining--;
        if (this._remaining >= 0) {
            return this._iterator.moveNext();
        }
        this._remaining = -1;
        return false;
    }
    get current() {
        if (this._remaining < 0)
            return null;
        return this._iterator.current;
    }
}
class DartTakeWhileIterable extends DartIterable {
    constructor(_iterable, _f) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }
    get iterator() {
        return new DartTakeWhileIterator(this._iterable.iterator, this._f);
    }
}
class DartTakeWhileIterator extends _BaseJSIterator {
    constructor(_iterator, _f) {
        super();
        this._isFinished = false;
        this._iterator = _iterator;
        this._f = _f;
    }
    moveNext() {
        if (this._isFinished)
            return false;
        if (!this._iterator.moveNext() || !this._f(this._iterator.current)) {
            this._isFinished = true;
            return false;
        }
        return true;
    }
    get current() {
        if (this._isFinished)
            return null;
        return this._iterator.current;
    }
}
let DartSkipIterable = DartSkipIterable_1 = class DartSkipIterable extends DartIterable {
    constructor(iterable, count) {
        super();
    }
    static create(iterable, count) {
        if (_dart.is(iterable, DartEfficientLengthIterable)) {
            return new DartEfficientLengthSkipIterable(iterable, count);
        }
        return new DartSkipIterable_1._(iterable, _checkCount(count));
    }
    _(_iterable, _skipCount) {
        this._iterable = _iterable;
        this._skipCount = _skipCount;
    }
    skip(count) {
        return new DartSkipIterable_1(this._iterable, this._skipCount + _checkCount(count));
    }
    get iterator() {
        return new DartSkipIterator(this._iterable.iterator, this._skipCount);
    }
};
__decorate([
    namedConstructor
], DartSkipIterable.prototype, "_", null);
__decorate([
    defaultFactory
], DartSkipIterable, "create", null);
DartSkipIterable = DartSkipIterable_1 = __decorate([
    DartClass
], DartSkipIterable);
let DartEfficientLengthSkipIterable = DartEfficientLengthSkipIterable_1 = class DartEfficientLengthSkipIterable extends DartSkipIterable {
    constructor(iterable, count) {
        super(null, null);
    }
    static create(iterable, count) {
        return new DartEfficientLengthSkipIterable_1._(iterable, _checkCount(count));
    }
    _(iterable, count) {
        super._(iterable, count);
    }
    get length() {
        let length = this._iterable.length - this._skipCount;
        if (length >= 0)
            return length;
        return 0;
    }
    skip(count) {
        return new DartEfficientLengthSkipIterable_1(this._iterable, this._skipCount + _checkCount(count));
    }
};
__decorate([
    namedConstructor
], DartEfficientLengthSkipIterable.prototype, "_", null);
__decorate([
    defaultFactory
], DartEfficientLengthSkipIterable, "create", null);
DartEfficientLengthSkipIterable = DartEfficientLengthSkipIterable_1 = __decorate([
    DartClass,
    Implements(DartEfficientLengthIterable)
], DartEfficientLengthSkipIterable);
function _checkCount(count) {
    if (!_dart.is(count, 'int')) {
        throw new ArgumentError.value(count, "count", "is not an integer");
    }
    RangeError.checkNotNegative(count, "count");
    return count;
}
class DartSkipIterator {
    constructor(_iterator, _skipCount) {
        this._iterator = _iterator;
        this._skipCount = _skipCount;
    }
    moveNext() {
        for (let i = 0; i < this._skipCount; i++)
            this._iterator.moveNext();
        this._skipCount = 0;
        return this._iterator.moveNext();
    }
    get current() {
        return this._iterator.current;
    }
    next(value) {
        return _JSnext(this);
    }
}
class DartSkipWhileIterable extends DartIterable {
    constructor(_iterable, _f) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }
    get iterator() {
        return new DartSkipWhileIterator(this._iterable.iterator, this._f);
    }
}
class DartSkipWhileIterator {
    constructor(_iterator, _f) {
        this._hasSkipped = false;
        this._iterator = _iterator;
        this._f = _f;
    }
    moveNext() {
        if (!this._hasSkipped) {
            this._hasSkipped = true;
            while (this._iterator.moveNext()) {
                if (!this._f(this._iterator.current))
                    return true;
            }
        }
        return this._iterator.moveNext();
    }
    get current() {
        return this._iterator.current;
    }
    next(value) {
        return _JSnext(this);
    }
}
/**
 * The always empty [Iterable].
 */
class DartEmptyIterable extends DartEfficientLengthIterable {
    get iterator() {
        return new DartEmptyIterator();
    }
    forEach(action) {
    }
    get isEmpty() {
        return true;
    }
    get length() {
        return 0;
    }
    get first() {
        throw DartIterableElementError.noElement();
    }
    get last() {
        throw DartIterableElementError.noElement();
    }
    get single() {
        throw DartIterableElementError.noElement();
    }
    elementAt(index) {
        throw new RangeError.range(index, 0, 0, "index");
    }
    contains(element) {
        return false;
    }
    every(test) {
        return true;
    }
    any(test) {
        return false;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    join(separator /*= ""*/) {
        return "";
    }
    where(test) {
        return this;
    }
    map(f) {
        return new DartEmptyIterable();
    }
    reduce(combine) {
        throw DartIterableElementError.noElement();
    }
    fold(initialValue, combine) {
        return initialValue;
    }
    skip(count) {
        RangeError.checkNotNegative(count, "count");
        return this;
    }
    skipWhile(test) {
        return this;
    }
    take(count) {
        RangeError.checkNotNegative(count, "count");
        return this;
    }
    takeWhile(test) {
        return this;
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        return growable ? new DartList() : new DartList(0);
    }
    toSet() {
        return new DartSet();
    }
}
/** The always empty iterator. */
class DartEmptyIterator {
    moveNext() {
        return false;
    }
    get current() {
        return null;
    }
    next() {
        return _JSnext(this);
    }
}
function _JSnext(dartIterator) {
    return {
        done: !dartIterator.moveNext(),
        value: dartIterator.current
    };
}
/**
 * Creates errors throw by [Iterable] when the element count is wrong.
 */
export class DartIterableElementError {
    /** Error thrown thrown by, e.g., [Iterable.first] when there is no result. */
    static noElement() {
        return new StateError("No element");
    }
    /** Error thrown by, e.g., [Iterable.single] if there are too many results. */
    static tooMany() {
        return new StateError("Too many elements");
    }
    /** Error thrown by, e.g., [List.setRange] if there are too few elements. */
    static tooFew() {
        return new StateError("Too few elements");
    }
}
class _GeneratorIterable extends DartListIterable {
    /// Creates the generated iterable.
    ///
    /// If [generator] is `null`, ~~it is checked that `int` is assignable to [E].~~
    constructor(_length, generator) {
        super();
        this.length = _length;
        // The `as` below is used as check to make sure that `int` is assignable
        // to [E].
        this._generator = (generator != null) ? generator : _GeneratorIterable._id;
    }
    get length() {
        return this._length;
    }
    set length(val) {
        this._length = val;
    }
    elementAt(index) {
        RangeError.checkValidIndex(index, this);
        return this._generator(index);
    }
}
/// Helper function used as default _generator function.
_GeneratorIterable._id = (n) => n;
/**
 * The operation was not allowed by the object.
 *
 * This [Error] is thrown when an instance cannot implement one of the methods
 * in its signature.
 */
class DartError extends Error {
    static safeToString(object) {
        if (_dart.is(object, 'num') || _dart.is(object, 'bool') || null == object) {
            return object.toString();
        }
        if (_dart.is(object, 'string')) {
            return DartError._stringToSafeString(object);
        }
        return DartError._objectToString(object);
    }
    static _stringToSafeString(o) {
        return `${o}`;
    }
    static _objectToString(o) {
        return `${o}`;
    }
}
class UnsupportedError extends DartError {
    constructor(message) {
        super();
        this.message = message;
    }
    toString() {
        return `Unsupported operation: ${this.message}`;
    }
}
/**
 * Error occurring when a collection is modified during iteration.
 *
 * Some modifications may be allowed for some collections, so each collection
 * ([Iterable] or similar collection of values) should declare which operations
 * are allowed during an iteration.
 */
class ConcurrentModificationError extends DartError {
    constructor(modifiedObject) {
        super();
        this.modifiedObject = modifiedObject;
    }
    ;
    toString() {
        if (this.modifiedObject == null) {
            return "Concurrent modification during iteration.";
        }
        return `Concurrent modification during iteration:` +
            `${DartError.safeToString(this.modifiedObject)}.`;
    }
}
/**
 * Error thrown when attempting to throw [:null:].
 */
let NullThrownError = class NullThrownError extends DartError {
    toString() {
        return "Throw of null.";
    }
};
NullThrownError = __decorate([
    DartClass
], NullThrownError);
// TODO : needs to be ported if we wont the same error messages here
class FormatException extends DartError {
    constructor(message, formatString) {
        super(message);
    }
}
/**
 * Error thrown when a function is passed an unacceptable argument.
 */
let ArgumentError = class ArgumentError extends DartError {
    constructor(message) {
        super();
    }
    /**
     * The [message] describes the erroneous argument.
     *
     * Existing code may be using `message` to hold the invalid value.
     * If the `message` is not a [String], it is assumed to be a value instead
     * of a message.
     */
    ArgumentError(message) {
        this.message = message;
        this.invalidValue = null;
        this.name = null;
    }
    /**
     * Creates error containing the invalid [value].
     *
     * A message is built by suffixing the [message] argument with
     * the [name] argument (if provided) and the value. Example
     *
     *    "Invalid argument (foo): null"
     *
     * The `name` should match the argument name of the function, but if
     * the function is a method implementing an interface, and its argument
     * names differ from the interface, it might be more useful to use the
     * interface method's argument name (or just rename arguments to match).
     */
    value(value, name, message) {
        this.name = name;
        this.message = message;
        this.invalidValue = value;
        this._hasValue = true;
    }
    /**
     * Create an argument error for a `null` argument that must not be `null`.
     */
    notNull(name) {
        this.name = name;
        this._hasValue = false;
        this.message = "Must not be null";
        this.invalidValue = null;
    }
    // Helper functions for toString overridden in subclasses.
    get _errorName() {
        return `Invalid argument${!this._hasValue ? "(s)" : ""}`;
    }
    get _errorExplanation() {
        return "";
    }
    toString() {
        let nameString = "";
        if (this.name != null) {
            nameString = ` (${this.name})`;
        }
        let message = (this.message == null) ? "" : `: ${this.message}`;
        let prefix = `${this._errorName}${nameString}${this.message}`;
        if (!this._hasValue)
            return prefix;
        // If we know the invalid value, we can try to describe the problem.
        let explanation = this._errorExplanation;
        let errorValue = DartError.safeToString(this.invalidValue);
        return `${prefix}${explanation}: ${errorValue}`;
    }
};
__decorate([
    defaultConstructor
], ArgumentError.prototype, "ArgumentError", null);
__decorate([
    namedConstructor
], ArgumentError.prototype, "value", null);
__decorate([
    namedConstructor
], ArgumentError.prototype, "notNull", null);
ArgumentError = __decorate([
    DartClass
], ArgumentError);
/**
 * Error thrown due to an index being outside a valid range.
 */
let RangeError = RangeError_1 = class RangeError extends ArgumentError {
    constructor(message) {
        super();
    }
    /** The minimum value that [value] is allowed to assume. */
    get start() {
        return this._start;
    }
    set start(v) {
        this._start = v;
    }
    /** The maximum value that [value] is allowed to assume. */
    get end() {
        return this._end;
    }
    set end(v) {
        this._end = v;
    }
    // TODO(lrn): This constructor should be called only with string values.
    // It currently isn't in all cases.
    /**
     * Create a new [RangeError] with the given [message].
     */
    RangeError(message) {
        super.ArgumentError(message);
        this.start = null;
        this.end = null;
    }
    /**
     * Create a new [RangeError] with a message for the given [value].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    value(value, name, message) {
        super.value(value, name, (message != null) ? message : "Value not in range");
        this.start = null;
        this.end = null;
    }
    /**
     * Create a new [RangeError] for a value being outside the valid range.
     *
     * The allowed range is from [minValue] to [maxValue], inclusive.
     * If `minValue` or `maxValue` are `null`, the range is infinite in
     * that direction.
     *
     * For a range from 0 to the length of something, end exclusive, use
     * [RangeError.index].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    range(invalidValue, minValue, maxValue, name, message) {
        super.value(invalidValue, name, (message != null) ? message : "Invalid value");
        this.start = minValue;
        this.end = maxValue;
    }
    /**
     * Creates a new [RangeError] stating that [index] is not a valid index
     * into [indexable].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     *
     * The [length] is the length of [indexable] at the time of the error.
     * If `length` is omitted, it defaults to `indexable.length`.
     */
    static _index(index, indexable, name, message, length) {
        return new IndexError(index, indexable, name, message, length);
    }
    /**
     * Check that a [value] lies in a specific interval.
     *
     * Throws if [value] is not in the interval.
     * The interval is from [minValue] to [maxValue], both inclusive.
     */
    static checkValueInInterval(value, minValue, maxValue, name, message) {
        if (value < minValue || value > maxValue) {
            throw new RangeError_1.range(value, minValue, maxValue, name, message);
        }
    }
    /**
     * Check that a value is a valid index into an indexable object.
     *
     * Throws if [index] is not a valid index into [indexable].
     *
     * An indexable object is one that has a `length` and a and index-operator
     * `[]` that accepts an index if `0 <= index < length`.
     *
     * If [length] is provided, it is used as the length of the indexable object,
     * otherwise the length is found as `indexable.length`.
     */
    static checkValidIndex(index, indexable, name, length, message) {
        if (length == null)
            length = indexable.length;
        // Comparing with `0` as receiver produces better dart2js type inference.
        if (0 > index || index >= length) {
            if (name == null)
                name = "index";
            throw new RangeError_1.index(index, indexable, name, message, length);
        }
    }
    /**
     * Check that a range represents a slice of an indexable object.
     *
     * Throws if the range is not valid for an indexable object with
     * the given [length].
     * A range is valid for an indexable object with a given [length]
     *
     * if `0 <= [start] <= [end] <= [length]`.
     * An `end` of `null` is considered equivalent to `length`.
     *
     * The [startName] and [endName] defaults to `"start"` and `"end"`,
     * respectively.
     *
     * Returns the actual `end` value, which is `length` if `end` is `null`,
     * and `end` otherwise.
     */
    static checkValidRange(start, end, length, startName, endName, message) {
        // Comparing with `0` as receiver produces better dart2js type inference.
        // Ditto `start > end` below.
        if (0 > start || start > length) {
            if (startName == null)
                startName = "start";
            throw new RangeError_1.range(start, 0, length, startName, message);
        }
        if (end != null) {
            if (start > end || end > length) {
                if (endName == null)
                    endName = "end";
                throw new RangeError_1.range(end, start, length, endName, message);
            }
            return end;
        }
        return length;
    }
    /**
     * Check that an integer value isn't negative.
     *
     * Throws if the value is negative.
     */
    static checkNotNegative(value, name, message) {
        if (value < 0)
            throw new RangeError_1.range(value, 0, null, name, message);
    }
    get _errorName() {
        return "RangeError";
    }
    get _errorExplanation() {
        let explanation = "";
        if (this.start == null) {
            if (this.end != null) {
                explanation = ": Not less than or equal to $end";
            }
            // If both are null, we don't add a description of the limits.
        }
        else if (this.end == null) {
            explanation = ": Not greater than or equal to $start";
        }
        else if (this.end > this.start) {
            explanation = ": Not in range $start..$end, inclusive";
        }
        else if (this.end < this.start) {
            explanation = ": Valid value range is empty";
        }
        else {
            // end == start.
            explanation = ": Only valid value is $start";
        }
        return explanation;
    }
};
__decorate([
    defaultConstructor
], RangeError.prototype, "RangeError", null);
__decorate([
    namedConstructor
], RangeError.prototype, "value", null);
__decorate([
    namedConstructor
], RangeError.prototype, "range", null);
__decorate([
    namedFactory
], RangeError, "_index", null);
RangeError = RangeError_1 = __decorate([
    DartClass
], RangeError);
/**
 * A specialized [RangeError] used when an index is not in the range
 * `0..indexable.length-1`.
 *
 * Also contains the indexable object, its length at the time of the error,
 * and the invalid index itself.
 */
let IndexError = class IndexError extends RangeError {
    constructor(invalidValue, indexable, name, message, length) {
        super();
    }
    /**
     * Creates a new [IndexError] stating that [invalidValue] is not a valid index
     * into [indexable].
     *
     * The [length] is the length of [indexable] at the time of the error.
     * If `length` is omitted, it defaults to `indexable.length`.
     *
     * The message is used as part of the string representation of the error.
     */
    IndexError(invalidValue, indexable, name, message, length) {
        this.indexable = indexable;
        this.length = (length != null) ? length : indexable.length;
        super.value(invalidValue, name, (message != null) ? message : "Index out of range");
    }
    // Getters inherited from RangeError.
    get start() {
        return 0;
    }
    set start(v) {
    }
    get end() {
        return this.length - 1;
    }
    set end(v) {
    }
    get _errorName() {
        return "RangeError";
    }
    get _errorExplanation() {
        if (this.invalidValue < 0) {
            return ": index must not be negative";
        }
        if (this.length == 0) {
            return ": no indices are valid";
        }
        return `: index should be less than ${this.length}`;
    }
};
__decorate([
    defaultConstructor
], IndexError.prototype, "IndexError", null);
IndexError = __decorate([
    DartClass
], IndexError);
/**
 * The operation was not allowed by the current state of the object.
 *
 * This is a generic error used for a variety of different erroneous
 * actions. The message should be descriptive.
 */
let StateError = class StateError extends DartError {
    constructor(message) {
        super();
    }
    StateError(message) {
        this.message = message;
    }
    toString() {
        return `Bad state: ${this.message}`;
    }
}; // Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
__decorate([
    defaultConstructor
], StateError.prototype, "StateError", null);
StateError = __decorate([
    DartClass
], StateError);
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
// part of dart.math;
/**
 * A generator of random bool, int, or double values.
 *
 * The default implementation supplies a stream of
 * pseudo-random bits that are not suitable for cryptographic purposes.
 *
 * Use the Random.secure() constructor for cryptographic
 * purposes.
 */
let DartRandom = class DartRandom {
    constructor(seed) {
    }
    /**
     * Creates a random number generator.
     *
     * The optional parameter [seed] is used to initialize the
     * internal state of the generator. The implementation of the
     * random stream can change between releases of the library.
     */
    /* external */
    static Random(seed) {
        return null;
    }
    /**
     * Creates a cryptographically secure random number generator.
     *
     * If the program cannot provide a cryptographically secure
     * source of random numbers, it throws an [UnsupportedError].
     */
    /* external */
    static _secure() {
        return undefined;
    }
    /**
     * Generates a non-negative random integer uniformly distributed in the range
     * from 0, inclusive, to [max], exclusive.
     *
     * Implementation note: The default implementation supports [max] values
     * between 1 and (1<<32) inclusive.
     */
    nextInt(max) {
        throw new Error('abstract');
    }
    /**
     * Generates a non-negative random floating point value uniformly distributed
     * in the range from 0.0, inclusive, to 1.0, exclusive.
     */
    nextDouble() {
        throw new Error('abstract');
    }
    /**
     * Generates a random boolean value.
     */
    nextBool() {
        throw new Error('abstract');
    }
};
__decorate([
    Abstract
], DartRandom.prototype, "nextInt", null);
__decorate([
    Abstract
], DartRandom.prototype, "nextDouble", null);
__decorate([
    Abstract
], DartRandom.prototype, "nextBool", null);
__decorate([
    defaultFactory
], DartRandom, "Random", null);
__decorate([
    namedFactory
], DartRandom, "_secure", null);
DartRandom = __decorate([
    DartClass
], DartRandom);
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of _interceptors;
class _Growable {
    constructor() {
    }
}
// const _ListConstructorSentinel =new _Growable();
class X extends Array {
}
/**
 * The interceptor class for [List]. The compiler recognizes this
 * class as an interceptor, and changes references to [:this:] to
 * actually use the receiver of the method, which is generated as an extra
 * argument added to each member.
 */
let JSArray = JSArray_1 = class JSArray extends Array {
    constructor(len) {
        super(...(_dart.isNot(len, 'int') && len != undefined ? len : []));
        if (_dart.is(len, 'int')) {
            this.length = len;
        }
    }
    // This factory constructor is the redirection target of the List() factory
    // constructor. [length] has no type to permit the sentinel value.
    static _list(length /*= _ListConstructorSentinel]*/) {
        /*if (length === undefined) {
            length = _ListConstructorSentinel;
        }*/
        if (undefined === length || _dart.isNot(length, 'int')) {
            return new JSArray_1.emptyGrowable(length);
        }
        return new JSArray_1.fixed(length);
    }
    /**
     * Returns a fresh JavaScript Array, marked as fixed-length.
     *
     * [length] must be a non-negative integer.
     */
    static _fixed(length) {
        // Explicit type test is necessary to guard against JavaScript conversions
        // in unchecked mode, and against `new Array(null)` which creates a single
        // element Array containing `null`.
        if (!_dart.is(length, 'int')) {
            throw new ArgumentError.value(length, 'length', 'is not an integer');
        }
        // The JavaScript Array constructor with one argument throws if
        // the value is not a UInt32. Give a better error message.
        let maxJSArrayLength = 0xFFFFFFFF;
        if (length < 0 || length > maxJSArrayLength) {
            throw new RangeError.range(length, 0, maxJSArrayLength, 'length');
        }
        return new JSArray_1.markFixed(new JSFixedArray(length) /*JS('', 'new Array(#)', length)*/);
    }
    /**
     * Returns a fresh growable JavaScript Array of zero length length.
     */
    static _emptyGrowable(values) {
        return new JSArray_1.markGrowable(new JSExtendableArray(values) /*JS('', '[]')*/);
    }
    /**
     * Returns a fresh growable JavaScript Array with initial length.
     *
     * [validatedLength] must be a non-negative integer.
     */
    static _growable(length) {
        // Explicit type test is necessary to guard against JavaScript conversions
        // in unchecked mode.
        if ((!_dart.is(length, 'int')) || (length < 0)) {
            throw new ArgumentError('Length must be a non-negative integer: $length');
        }
        return new JSArray_1.markGrowable(new JSExtendableArray(length) /*JS('', 'new Array(#)', length)*/);
    }
    /**
     * Constructor for adding type parameters to an existing JavaScript Array.
     * The compiler specially recognizes this constructor.
     *
     *     var a = new JSArray<int>.typed(JS('JSExtendableArray', '[]'));
     *     a is List<int>    --> true
     *     a is List<String> --> false
     *
     * Usually either the [JSArray.markFixed] or [JSArray.markGrowable]
     * constructors is used instead.
     *
     * The input must be a JavaScript Array.  The JS form is just a re-assertion
     * to help type analysis when the input type is sloppy.
     */
    static _typed(allocation) {
        return allocation /*JS('JSArray', '#', allocation)*/;
    }
    static _markFixed(allocation) {
        // JS('JSFixedArray', '#', markFixedList(new JSArray<E>.typed(allocation)));
        return JSArray_1.markFixedList(new JSArray_1.typed(allocation));
    }
    static _markGrowable(allocation) {
        //JS('JSExtendableArray', '#', new JSArray < E >.typed(allocation));
        return new JSArray_1.typed(allocation);
    }
    static markFixedList(list) {
        // Functions are stored in the hidden class and not as properties in
        // the object. We never actually look at the value, but only want
        // to know if the property exists.
        //JS('void', r'#.fixed$length = Array', list);
        list.fixed$length = Array;
        return list /* JS('JSFixedArray', '#', list)*/;
    }
    static markUnmodifiableList(list) {
        // Functions are stored in the hidden class and not as properties in
        // the object. We never actually look at the value, but only want
        // to know if the property exists.
        // JS('void', r'#.fixed$length = Array', list);
        list.fixed$length = Array;
        // JS('void', r'#.immutable$list = Array', list);
        list.immutable$list = Array;
        return list /* JS('JSUnmodifiableArray', '#', list)*/;
    }
    checkMutable(reason) {
        if (!_dart.is(this, JSMutableArray)) {
            throw new UnsupportedError(reason);
        }
    }
    checkGrowable(reason) {
        if (!_dart.is(this, JSExtendableArray)) {
            throw new UnsupportedError(reason);
        }
    }
    add(value) {
        this.checkGrowable('add');
        //JS('void', r'#.push(#)', this, value);
        this.push(value);
    }
    removeAt(index) {
        this.checkGrowable('removeAt');
        if (!_dart.is(index, 'int'))
            throw argumentErrorValue(index);
        if (index < 0 || index >= this.length) {
            throw new RangeError.value(index);
        }
        return this.splice(index, 1)[0] /* JS('var', r'#.splice(#, 1)[0]', this, index)*/;
    }
    insert(index, value) {
        this.checkGrowable('insert');
        if (!_dart.is(index, 'int'))
            throw argumentErrorValue(index);
        if (index < 0 || index > this.length) {
            throw new RangeError.value(index);
        }
        //JS('void', r'#.splice(#, 0, #)', this, index, value);
        this.splice(index, 0, value);
    }
    insertAll(index, iterable) {
        this.checkGrowable('insertAll');
        RangeError.checkValueInInterval(index, 0, this.length, 'index');
        if (!_dart.is(iterable, DartEfficientLengthIterable)) {
            iterable = iterable.toList();
        }
        let insertionLength = iterable.length;
        this.length += insertionLength;
        let end = index + insertionLength;
        this.setRange(end, this.length, this, index);
        this.setRange(index, end, iterable);
    }
    setAll(index, iterable) {
        this.checkMutable('setAll');
        RangeError.checkValueInInterval(index, 0, this.length, 'index');
        for (let element of iterable) {
            this[index++] = element;
        }
    }
    removeLast() {
        this.checkGrowable('removeLast');
        if (this.length == 0)
            throw diagnoseIndexError(this, -1);
        return this.pop() /* JS('var', r'#.pop()', this)*/;
    }
    remove(element) {
        this.checkGrowable('remove');
        for (let i = 0; i < this.length; i++) {
            if (_dart.equals(this[i], element)) {
                //JS('var', r'#.splice(#, 1)', this, i);
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    /**
     * Removes elements matching [test] from [this] List.
     */
    removeWhere(test) {
        this.checkGrowable('removeWhere');
        this._removeWhere(test, true);
    }
    retainWhere(test) {
        this.checkGrowable('retainWhere');
        this._removeWhere(test, false);
    }
    _removeWhere(test, removeMatching) {
        // Performed in two steps, to avoid exposing an inconsistent state
        // to the [test] function. First the elements to retain are found, and then
        // the original list is updated to contain those elements.
        // TODO(sra): Replace this algorithm with one that retains a list of ranges
        // to be removed.  Most real uses remove 0, 1 or a few clustered elements.
        let retained = new JSArray_1();
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            // !test() ensures bool conversion in checked mode.
            if (!test(element) === removeMatching) {
                retained.add(element);
            }
            if (this.length != end)
                throw new ConcurrentModificationError(this);
        }
        if (retained.length == end)
            return;
        this.length = retained.length;
        for (let i = 0; i < retained.length; i++) {
            // We don't need a bounds check or an element type check.
            //JS('', '#[#] = #', this, i, retained[i]);
            this[i] = retained[i];
        }
    }
    where(f) {
        return new DartWhereIterable(this, f);
    }
    expand(f) {
        return new DartExpandIterable(this, f);
    }
    addAll(collection) {
        let i = this.length;
        this.checkGrowable('addAll');
        for (let e of collection) {
            //assert(
            //    i++ == this.length || (throw new ConcurrentModificationError(this)));
            //JS('void', r'#.push(#)', this, e);
            this.push(e);
        }
    }
    clear() {
        this.length = 0;
    }
    forEach(f) {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            f(element);
            if (this.length != end)
                throw new ConcurrentModificationError(this);
        }
    }
    map(f) {
        return new DartMappedListIterable(this, f);
    }
    join(separator /* = ''*/) {
        let list = new DartList(this.length);
        for (let i = 0; i < this.length; i++) {
            list[i] = `${this[i]}`;
        }
        return list._join(separator) /*JS('String', '#.join(#)', list, separator)*/;
    }
    _join(separator) {
        return super.join(separator);
    }
    take(n) {
        return new DartSubListIterable(this, 0, n);
    }
    takeWhile(test) {
        return new DartTakeWhileIterable(this, test);
    }
    skip(n) {
        return new DartSubListIterable(this, n, null);
    }
    skipWhile(test) {
        return new DartSkipWhileIterable(this, test);
    }
    reduce(combine) {
        let length = this.length;
        if (length == 0)
            throw DartIterableElementError.noElement();
        let value = this[0];
        for (let i = 1; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            value = combine(value, element);
            if (length != this.length)
                throw new ConcurrentModificationError(this);
        }
        return value;
    }
    fold(initialValue, combine) {
        let value = initialValue;
        let length = this.length;
        for (let i = 0; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            value = combine(value, element);
            if (this.length != length)
                throw new ConcurrentModificationError(this);
        }
        return value;
    }
    firstWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let end = this.length;
        for (let i = 0; i < end; ++i) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            if (test(element))
                return element;
            if (this.length != end)
                throw new ConcurrentModificationError(this);
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    lastWhere(test, _) {
        let { orElse } = Object.assign({}, _);
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            if (test(element))
                return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null)
            return orElse();
        throw DartIterableElementError.noElement();
    }
    singleWhere(test) {
        let length = this.length;
        let match = null;
        let matchFound = false;
        for (let i = 0; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            if (test(element)) {
                if (matchFound) {
                    throw DartIterableElementError.tooMany();
                }
                matchFound = true;
                match = element;
            }
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (matchFound)
            return match;
        throw DartIterableElementError.noElement();
    }
    elementAt(index) {
        return this[index];
    }
    sublist(start, end) {
        checkNull(start); // TODO(ahe): This is not specified but co19 tests it.
        if (!_dart.is(start, 'int'))
            throw argumentErrorValue(start);
        if (start < 0 || start > this.length) {
            throw new RangeError.range(start, 0, this.length, 'start');
        }
        if (end == null) {
            end = this.length;
        }
        else {
            if (!_dart.is(end, 'int'))
                throw argumentErrorValue(end);
            if (end < start || end > this.length) {
                throw new RangeError.range(end, start, this.length, 'end');
            }
        }
        if (start == end)
            return new DartList();
        return new JSArray_1.markGrowable(this.slice(start, end) /*JS('', r'#.slice(#, #)', this, start, end)*/);
    }
    getRange(start, end) {
        RangeError.checkValidRange(start, end, this.length);
        return new DartSubListIterable(this, start, end);
    }
    get first() {
        if (this.length > 0)
            return this[OPERATOR_INDEX](0);
        throw DartIterableElementError.noElement();
    }
    get last() {
        if (this.length > 0)
            return this[OPERATOR_INDEX](this.length - 1);
        throw DartIterableElementError.noElement();
    }
    get single() {
        if (this.length == 1)
            return this[OPERATOR_INDEX](0);
        if (this.length == 0)
            throw DartIterableElementError.noElement();
        throw DartIterableElementError.tooMany();
    }
    removeRange(start, end) {
        this.checkGrowable('removeRange');
        RangeError.checkValidRange(start, end, this.length);
        let deleteCount = end - start;
        //JS('', '#.splice(#, #)', this, start, deleteCount);
        this.splice(start, deleteCount);
    }
    setRange(start, end, iterable, skipCount /* = 0*/) {
        skipCount = skipCount || 0;
        this.checkMutable('setRange');
        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length == 0)
            return;
        RangeError.checkNotNegative(skipCount, 'skipCount');
        let otherList;
        let otherStart;
        // TODO(floitsch): Make this accept more.
        if (_dart.is(iterable, DartList)) {
            otherList = iterable;
            otherStart = skipCount;
        }
        else {
            otherList = iterable.skip(skipCount).toList({ growable: false });
            otherStart = 0;
        }
        if (otherStart + length > otherList.length) {
            throw DartIterableElementError.tooFew();
        }
        if (otherStart < start) {
            // Copy backwards to ensure correct copy if [from] is this.
            // TODO(sra): If [from] is the same Array as [this], we can copy without
            // type annotation checks on the stores.
            for (let i = length - 1; i >= 0; i--) {
                // Use JS to avoid bounds check (the bounds check elimination
                // optimzation is too weak). The 'E' type annotation is a store type
                // check - we can't rely on iterable, it could be List<dynamic>.
                let element = otherList[OPERATOR_INDEX](otherStart + i);
                //JS('', '#[#] = #', this, start + i, element);
                this[start + i] = element;
            }
        }
        else {
            for (let i = 0; i < length; i++) {
                let element = otherList[OPERATOR_INDEX](otherStart + i);
                //JS('', '#[#] = #', this, start + i, element);
                this[start + i] = element;
            }
        }
    }
    fillRange(start, end, fillValue) {
        this.checkMutable('fill range');
        RangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
            // Store is safe since [fillValue] type has been checked as parameter.
            //JS('', '#[#] = #', this, i, fillValue);
            this[i] = fillValue;
        }
    }
    replaceRange(start, end, replacement) {
        this.checkGrowable('replaceRange');
        RangeError.checkValidRange(start, end, this.length);
        if (!_dart.is(replacement, DartEfficientLengthIterable)) {
            replacement = replacement.toList();
        }
        let removeLength = end - start;
        let insertLength = replacement.length;
        if (removeLength >= insertLength) {
            let delta = removeLength - insertLength;
            let insertEnd = start + insertLength;
            let newLength = this.length - delta;
            this.setRange(start, insertEnd, replacement);
            if (delta != 0) {
                this.setRange(insertEnd, newLength, this, end);
                this.length = newLength;
            }
        }
        else {
            let delta = insertLength - removeLength;
            let newLength = this.length + delta;
            let insertEnd = start + insertLength; // aka. end + delta.
            this.length = newLength;
            this.setRange(insertEnd, newLength, this, end);
            this.setRange(start, insertEnd, replacement);
        }
    }
    any(test) {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            if (test(element))
                return true;
            if (this.length != end)
                throw new ConcurrentModificationError(this);
        }
        return false;
    }
    every(test) {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            if (!test(element))
                return false;
            if (this.length != end)
                throw new ConcurrentModificationError(this);
        }
        return true;
    }
    get reversed() {
        return new DartReversedListIterable(this);
    }
    sort(compare) {
        this.checkMutable('sort');
        DartSort.sort(this, compare == null ? DartComparable.compare : compare);
    }
    shuffle(random) {
        this.checkMutable('shuffle');
        if (random == null)
            random = new DartRandom();
        let length = this.length;
        while (length > 1) {
            let pos = random.nextInt(length);
            length -= 1;
            let tmp = this[OPERATOR_INDEX](length);
            this[OPERATOR_INDEX_ASSIGN](length, this[OPERATOR_INDEX](pos));
            this[OPERATOR_INDEX_ASSIGN](pos, tmp);
        }
    }
    indexOf(element, start /*= 0*/) {
        start = start || 0;
        if (start >= this.length) {
            return -1;
        }
        if (start < 0) {
            start = 0;
        }
        for (let i = start; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                return i;
            }
        }
        return -1;
    }
    lastIndexOf(element, startIndex /*= 0*/) {
        if (startIndex == null) {
            startIndex = this.length - 1;
        }
        else {
            if (startIndex < 0) {
                return -1;
            }
            if (startIndex >= this.length) {
                startIndex = this.length - 1;
            }
        }
        for (let i = startIndex; i >= 0; i--) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                return i;
            }
        }
        return -1;
    }
    contains(other) {
        for (let i = 0; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), other))
                return true;
        }
        return false;
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    toString() {
        return DartListBase.listToString(this);
    }
    toList(_) {
        let { growable } = Object.assign({ growable: true }, _);
        return growable ? this._toListGrowable() : this._toListFixed();
    }
    _toListGrowable() {
        // slice(0) is slightly faster than slice()
        return new JSArray_1.markGrowable(this.slice(0) /*JS('', '#.slice(0)', this)*/);
    }
    _toListFixed() {
        return new JSArray_1.markFixed(this.slice(0) /*JS('', '#.slice(0)', this)*/);
    }
    toSet() {
        return new DartSet.from(this);
    }
    get iterator() {
        return new DartArrayIterator(this);
    }
    get hashCode() {
        return DartPrimitives.objectHashCode(this);
    }
    get length() {
        return super.length /*JS('JSUInt32', r'#.length', this)*/;
    }
    set length(newLength) {
        this.checkGrowable('set length');
        if (!_dart.is(newLength, 'int')) {
            throw new ArgumentError.value(newLength, 'newLength');
        }
        // TODO(sra): Remove this test and let JavaScript throw an error.
        if (newLength < 0) {
            throw new RangeError.range(newLength, 0, null, 'newLength');
        }
        // JavaScript with throw a RangeError for numbers that are too big. The
        // message does not contain the value.
        //JS('void', r'#.length = #', this, newLength);
        super.length = newLength;
    }
    [OPERATOR_INDEX](index) {
        if (!_dart.is(index, 'int'))
            throw diagnoseIndexError(this, index);
        if (index >= this.length || index < 0)
            throw diagnoseIndexError(this, index);
        return this[index] /* JS('var', '#[#]', this, index)*/;
    }
    [OPERATOR_INDEX_ASSIGN](index, value) {
        this.checkMutable('indexed set');
        if (!_dart.is(index, 'int'))
            throw diagnoseIndexError(this, index);
        if (index >= this.length || index < 0)
            throw diagnoseIndexError(this, index);
        //JS('void', r'#[#] = #', this, index, value);
        this[index] = value;
    }
    asMap() {
        return new DartListMapView(this);
    }
};
__decorate([
    namedFactory
], JSArray, "_list", null);
__decorate([
    namedFactory
], JSArray, "_fixed", null);
__decorate([
    namedFactory
], JSArray, "_emptyGrowable", null);
__decorate([
    namedFactory
], JSArray, "_growable", null);
__decorate([
    namedFactory
], JSArray, "_typed", null);
__decorate([
    namedFactory
], JSArray, "_markFixed", null);
__decorate([
    namedFactory
], JSArray, "_markGrowable", null);
JSArray = JSArray_1 = __decorate([
    DartClass,
    Implements(DartList)
], JSArray);
export { JSArray };
/**
 * Dummy subclasses that allow the backend to track more precise
 * information about arrays through their type. The CPA type inference
 * relies on the fact that these classes do not override [] nor []=.
 *
 * These classes are really a fiction, and can have no methods, since
 * getInterceptor always returns JSArray.  We should consider pushing the
 * 'isGrowable' and 'isMutable' checks into the getInterceptor implementation so
 * these classes can have specialized implementations. Doing so will challenge
 * many assumptions in the JS backend.
 */
class JSMutableArray extends JSArray {
}
class JSFixedArray extends JSMutableArray {
}
class JSExtendableArray extends JSMutableArray {
}
class JSUnmodifiableArray extends JSArray {
} // Already is JSIndexable.
/// An [Iterator] that iterates a JSArray.
///
class DartArrayIterator {
    constructor(iterable) {
        this._iterable = iterable;
        this._length = iterable.length;
        this._index = 0;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        let length = this._iterable.length;
        // We have to do the length check even on fixed length Arrays.  If we can
        // inline moveNext() we might be able to GVN the length and eliminate this
        // check on known fixed length JSArray.
        if (this._length != length) {
            throw throwConcurrentModificationError(this._iterable);
        }
        if (this._index >= length) {
            this._current = null;
            return false;
        }
        this._current = this._iterable[OPERATOR_INDEX](this._index);
        this._index++;
        return true;
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
/// 'factory' for constructing ArgumentError.value to keep the call sites small.
export function argumentErrorValue(object) {
    return new ArgumentError.value(object);
}
export function checkNull(object) {
    if (object == null)
        throw argumentErrorValue(object);
    return object;
}
export function checkNum(value) {
    if (!_dart.is(value, 'num'))
        throw argumentErrorValue(value);
    return value;
}
export function checkInt(value) {
    if (!_dart.is(value, 'int'))
        throw argumentErrorValue(value);
    return value;
}
export function checkBool(value) {
    if (!_dart.is(value, 'bool'))
        throw argumentErrorValue(value);
    return value;
}
export function checkString(value) {
    if (!_dart.is(value, 'string'))
        throw argumentErrorValue(value);
    return value;
}
export function diagnoseIndexError(indexable, index) {
    if (!_dart.is(index, 'int'))
        return new ArgumentError.value(index, 'index');
    let length = indexable.length;
    // The following returns the same error that would be thrown by calling
    // [RangeError.checkValidIndex] with no optional parameters provided.
    if (index < 0 || index >= length) {
        return new RangeError.index(index, indexable, 'index', null, length);
    }
    // The above should always match, but if it does not, use the following.
    return new RangeError.value(index, 'index');
}
export function throwConcurrentModificationError(collection) {
    throw new ConcurrentModificationError(collection);
}
class DartPrimitives {
    /// In minified mode, uses the unminified names if available.
    static objectToHumanReadableString(object) {
        let name = DartPrimitives.objectTypeName(object);
        return `Instance of '${name}'`;
    }
    static objectTypeName(object) {
        return object;
    }
    static objectHashCode(object) {
        let hash = object.$identityHash /*JS('int|Null', r'#.$identityHash', object)*/;
        if (hash == null) {
            hash = (Math.random() * 0x3fffffff) | 0 /*JS('int', '(Math.random() * 0x3fffffff) | 0')*/;
            //JS('void', r'#.$identityHash = #', object, hash);
            object.$identityHash = hash;
        }
        return hash /* JS('int', '#', hash)*/;
    }
    static stringFromCharCode(charCode) {
        return String.fromCharCode(charCode);
    }
    static stringFromCharCodes(list) {
        return String.fromCharCode(...list);
    }
    static stringFromNativeUint8List(charCodes, start, end) {
        return String.fromCharCode(...charCodes.slice(start, end));
    }
    static flattenString(_contents) {
        return _contents;
    }
    static stringConcatUnchecked(_contents, str) {
        return `${_contents}${str}`;
    }
    static dateNow() {
        return Date.now() /* JS('int', r'Date.now()')*/;
    }
    static initTicker() {
        if (this.timerFrequency != null)
            return;
        // Start with low-resolution. We overwrite the fields if we find better.
        this.timerFrequency = 1000;
        this.timerTicks = this.dateNow;
        if (typeof window == "undefined")
            return;
        let $window = window;
        if ($window == null)
            return;
        let performance = $window.performance;
        if (performance == null)
            return;
        if (typeof performance.now != "function")
            return;
        this.timerFrequency = 1000000;
        this.timerTicks = () => new DartNumber((1000 * performance.now())).floor();
    }
    static valueFromDecomposedDate(years, month, day, hours, minutes, seconds, milliseconds, isUtc) {
        const MAX_MILLISECONDS_SINCE_EPOCH = 8640000000000000;
        checkInt(years);
        checkInt(month);
        checkInt(day);
        checkInt(hours);
        checkInt(minutes);
        checkInt(seconds);
        checkInt(milliseconds);
        checkBool(isUtc);
        let jsMonth = month - 1;
        // The JavaScript Date constructor 'corrects' year NN to 19NN. Sidestep that
        // correction by adjusting years out of that range and compensating with an
        // adjustment of months. This hack should not be sensitive to leap years but
        // use 400 just in case.
        if (0 <= years && years < 100) {
            years += 400;
            jsMonth -= 400 * 12;
        }
        let value;
        if (isUtc) {
            value = Date.UTC(years, jsMonth, day, hours, minutes, seconds, milliseconds) /*JS('num', r'Date.UTC(#, #, #, #, #, #, #)', years, jsMonth, day,
            hours, minutes, seconds, milliseconds)*/;
        }
        else {
            value = new Date(years, jsMonth, day, hours, minutes, seconds, milliseconds).valueOf() /* JS('num', r'new Date(#, #, #, #, #, #, #).valueOf()', years,
            jsMonth, day, hours, minutes, seconds, milliseconds)*/;
        }
        if (isNaN(value) ||
            value < -MAX_MILLISECONDS_SINCE_EPOCH ||
            value > MAX_MILLISECONDS_SINCE_EPOCH) {
            return null;
        }
        return value /* JS('int', '#', value)*/;
    }
    // Lazily keep a JS Date stored in the JS object.
    static lazyAsJsDate(receiver) {
        if (receiver.date === (void 0) /*JS('bool', r'#.date === (void 0)', receiver)*/) {
            /*JS('void', r'#.date = new Date(#)', receiver,
                receiver.millisecondsSinceEpoch);*/
            receiver.date = new Date(receiver.millisecondsSinceEpoch);
        }
        return receiver.date /*JS('var', r'#.date', receiver)*/;
    }
    // The getters for date and time parts below add a positive integer to ensure
    // that the result is really an integer, because the JavaScript implementation
    // may return -0.0 instead of 0.
    //
    // They are marked as @NoThrows() because `receiver` comes from a receiver of
    // a method on DateTime (i.e. is not `null`).
    // TODO(sra): These methods are GVN-able. dart2js should implement an
    // annotation for that.
    // TODO(sra): These methods often occur in groups (e.g. day, month and
    // year). Is it possible to factor them so that the `Date` is visible and can
    // be GVN-ed without a lot of code bloat?
    static getYear(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCFullYear() + 0) /*JS('int', r'(#.getUTCFullYear() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getFullYear() + 0) /*JS('int', r'(#.getFullYear() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getMonth(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCMonth() + 1) /* JS('JSUInt31', r'#.getUTCMonth() + 1', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getMonth() + 1) /*JS('JSUInt31', r'#.getMonth() + 1', lazyAsJsDate(receiver))*/;
    }
    static getDay(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCDate() + 0) /*JS('JSUInt31', r'(#.getUTCDate() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getDate() + 0) /*JS('JSUInt31', r'(#.getDate() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getHours(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCHours() + 0) /*S('JSUInt31', r'(#.getUTCHours() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getHours() + 0) /*JS('JSUInt31', r'(#.getHours() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getMinutes(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCMinutes() + 0) /*JS('JSUInt31', r'(#.getUTCMinutes() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getMinutes() + 0) /*JS('JSUInt31', r'(#.getMinutes() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getSeconds(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCSeconds() + 0) /*JS('JSUInt31', r'(#.getUTCSeconds() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getSeconds() + 0) /*JS('JSUInt31', r'(#.getSeconds() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getMilliseconds(receiver) {
        return (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCMilliseconds() + 0) /* JS(
              'JSUInt31', r'(#.getUTCMilliseconds() + 0)', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getMilliseconds() + 0) /*JS('JSUInt31', r'(#.getMilliseconds() + 0)', lazyAsJsDate(receiver))*/;
    }
    static getWeekday(receiver) {
        let weekday = (receiver.isUtc)
            ? (this.lazyAsJsDate(receiver).getUTCDay() + 0) /*JS('int', r'#.getUTCDay() + 0', lazyAsJsDate(receiver))*/
            : (this.lazyAsJsDate(receiver).getDay() + 0) /* JS('int', r'#.getDay() + 0', lazyAsJsDate(receiver))*/;
        // Adjust by one because JS weeks start on Sunday.
        return (weekday + 6) % 7 + 1;
    }
    static valueFromDateString(str) {
        if (isNot(str, 'string'))
            throw argumentErrorValue(str);
        let value = Date.parse(str) /* JS('num', r'Date.parse(#)', str)*/;
        if (new DartNumber(value).isNaN)
            throw argumentErrorValue(str);
        return value;
    }
    static getTimeZoneName(receiver) {
        // Firefox and Chrome emit the timezone in parenthesis.
        // Example: "Wed May 16 2012 21:13:00 GMT+0200 (CEST)".
        // We extract this name using a regexp.
        let d = this.lazyAsJsDate(receiver);
        let match = new DartList.fromArray(/\((.*)\)/.exec(d.toString())) /*JS('JSArray|Null', r'/\((.*)\)/.exec(#.toString())', d)*/;
        if (match != null)
            return match[1];
        // Internet Explorer 10+ emits the zone name without parenthesis:
        // Example: Thu Oct 31 14:07:44 PDT 2013
        match = new RegExp(
        // Thu followed by a space.
        '/^[A-Z,a-z]{3}\\s' +
            // Oct 31 followed by space.
            '[A-Z,a-z]{3}\\s\\d+\\s' +
            // Time followed by a space.
            '\\d{2}:\\d{2}:\\d{2}\\s' +
            // The time zone name followed by a space.
            '([A-Z]{3,5})\\s' +
            // The year.
            '\\d{4}$/')
            .exec(d.toString());
        /*JS(
            'JSArray|Null',
            // Thu followed by a space.
            r'/^[A-Z,a-z]{3}\s'
            // Oct 31 followed by space.
            r'[A-Z,a-z]{3}\s\d+\s'
            // Time followed by a space.
            r'\d{2}:\d{2}:\d{2}\s'
            // The time zone name followed by a space.
            r'([A-Z]{3,5})\s'
            // The year.
            r'\d{4}$/'
            '.exec(#.toString())',
            d);*/
        if (match != null)
            return match[1];
        // IE 9 and Opera don't provide the zone name. We fall back to emitting the
        // UTC/GMT offset.
        // Example (IE9): Wed Nov 20 09:51:00 UTC+0100 2013
        //       (Opera): Wed Nov 20 2013 11:03:38 GMT+0100
        match = /(?:GMT|UTC)[+-]\d{4}/.exec(d.toString()) /* JS('JSArray|Null', r'/(?:GMT|UTC)[+-]\d{4}/.exec(#.toString())', d)*/;
        if (match != null)
            return match[0];
        return "";
    }
    static getTimeZoneOffsetInMinutes(receiver) {
        // Note that JS and Dart disagree on the sign of the offset.
        // Subtract to avoid -0.0
        return 0 - this.lazyAsJsDate(receiver).getTimezoneOffset() /* JS('int', r'#.getTimezoneOffset()', lazyAsJsDate(receiver))*/;
    }
    static _parseIntError(source, handleError) {
        if (handleError == null)
            throw new FormatException(source);
        return handleError(source);
    }
    static parseInt(source, radix, handleError) {
        checkString(source);
        let re = /^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i /*JS('', r'/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i')*/;
        let match = re.exec(source) /*JS('JSExtendableArray|Null', '#.exec(#)', re, source)*/;
        let digitsIndex = 1;
        let hexIndex = 2;
        let decimalIndex = 3;
        let nonDecimalHexIndex = 4;
        if (match == null) {
            // TODO(sra): It might be that the match failed due to unrecognized U+0085
            // spaces.  We could replace them with U+0020 spaces and try matching
            // again.
            return this._parseIntError(source, handleError);
        }
        let decimalMatch = match[decimalIndex];
        if (radix == null) {
            if (decimalMatch != null) {
                // Cannot fail because we know that the digits are all decimal.
                return parseInt(source, 10) /* JS('int', r'parseInt(#, 10)', source)*/;
            }
            if (match[hexIndex] != null) {
                // Cannot fail because we know that the digits are all hex.
                return parseInt(source, 16) /* JS('int', r'parseInt(#, 16)', source)*/;
            }
            return this._parseIntError(source, handleError);
        }
        if (isNot(radix, 'int')) {
            throw new ArgumentError.value(radix, 'radix', 'is not an integer');
        }
        if (radix < 2 || radix > 36) {
            throw new RangeError.range(radix, 2, 36, 'radix');
        }
        if (radix == 10 && decimalMatch != null) {
            // Cannot fail because we know that the digits are all decimal.
            return parseInt(source, 10) /*JS('int', r'parseInt(#, 10)', source)*/;
        }
        // If radix >= 10 and we have only decimal digits the string is safe.
        // Otherwise we need to check the digits.
        if (radix < 10 || decimalMatch == null) {
            // We know that the characters must be ASCII as otherwise the
            // regexp wouldn't have matched. Lowercasing by doing `| 0x20` is thus
            // guaranteed to be a safe operation, since it preserves digits
            // and lower-cases ASCII letters.
            let maxCharCode;
            if (radix <= 10) {
                // Allow all digits less than the radix. For example 0, 1, 2 for
                // radix 3.
                // "0".codeUnitAt(0) + radix - 1;
                maxCharCode = (0x30 - 1) + radix;
            }
            else {
                // Letters are located after the digits in ASCII. Therefore we
                // only check for the character code. The regexp above made already
                // sure that the string does not contain anything but digits or
                // letters.
                // "a".codeUnitAt(0) + (radix - 10) - 1;
                maxCharCode = (0x61 - 10 - 1) + radix;
            }
            //assert(match[digitsIndex] is String);
            let digitsPart = match[digitsIndex] /* JS('String', '#[#]', match, digitsIndex)*/;
            for (let i = 0; i < digitsPart.length; i++) {
                let characterCode = new DartString(digitsPart).codeUnitAt(i) | 0x20;
                if (characterCode > maxCharCode) {
                    return this._parseIntError(source, handleError);
                }
            }
        }
        // The above matching and checks ensures the source has at least one digits
        // and all digits are suitable for the radix, so parseInt cannot return NaN.
        return parseInt(source, radix) /*JS('int', r'parseInt(#, #)', source, radix)*/;
    }
    static _parseDoubleError(source, handleError) {
        if (handleError == null) {
            throw new FormatException('Invalid double', source);
        }
        return handleError(source);
    }
    static parseDouble(source, handleError) {
        checkString(source);
        // Notice that JS parseFloat accepts garbage at the end of the string.
        // Accept only:
        // - [+/-]NaN
        // - [+/-]Infinity
        // - a Dart double literal
        // We do allow leading or trailing whitespace.
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(source) /*JS(
        'bool',
        r'/^\s*[+-]?(?:Infinity|NaN|'
        r'(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(#)',
        source)*/) {
            return this._parseDoubleError(source, handleError);
        }
        var result = parseFloat(source) /* JS('num', r'parseFloat(#)', source)*/;
        if (new DartNumber(result).isNaN) {
            var trimmed = new DartString(source).trim();
            if (trimmed == 'NaN' || trimmed == '+NaN' || trimmed == '-NaN') {
                return result;
            }
            return this._parseDoubleError(source, handleError);
        }
        return result;
    }
}
/** [: r"$".codeUnitAt(0) :] */
DartPrimitives.DOLLAR_CHAR_VALUE = 36;
/**
 * Called by generated code to build a map literal. [keyValuePairs] is
 * a list of key, value, key, value, ..., etc.
 */
export function fillLiteralMap(keyValuePairs, result) {
    // TODO(johnniwinther): Use JSArray to optimize this code instead of calling
    // [getLength] and [getIndex].
    let index = 0;
    let length = getLength(keyValuePairs);
    while (index < length) {
        let key = getIndex(keyValuePairs, index++);
        let value = getIndex(keyValuePairs, index++);
        result[OPERATOR_INDEX_ASSIGN](key, value);
    }
    return result;
}
/// Returns the property [index] of the JavaScript array [array].
export function getIndex(array, index) {
    //assert(isJsArray(array));
    return array[index] /*JS('var', r'#[#]', array, index)*/;
}
/// Returns the length of the JavaScript array [array].
export function getLength(array) {
    //assert(isJsArray(array));
    return array.length /*JS('int', r'#.length', array)*/;
}
/// Returns whether [value] is a JavaScript array.
export function isJsArray(value) {
    return _dart.is(value, Array);
}
/** A set used to identify cyclic lists during toString() calls. */
const _toStringVisiting = new DartList();
/** Check if we are currently visiting `o` in a toString call. */
function _isToStringVisiting(o) {
    for (let i = 0; i < _toStringVisiting.length; i++) {
        if (identical(o, _toStringVisiting[i]))
            return true;
    }
    return false;
}
let DartStackTrace = DartStackTrace_1 = class DartStackTrace {
    constructor(e) {
    }
    _() {
    }
    static _create(e) {
        if (e instanceof Error) {
            return new DartStackTrace_1.fromError(e);
        }
        else {
            return new DartStackTrace_1._();
        }
    }
    static get current() {
        return new DartStackTrace_1(new Error());
    }
    static _fromError(e) {
        return new DartStackTrace_1._();
    }
};
__decorate([
    namedConstructor
], DartStackTrace.prototype, "_", null);
__decorate([
    defaultFactory
], DartStackTrace, "_create", null);
__decorate([
    namedFactory
], DartStackTrace, "_fromError", null);
DartStackTrace = DartStackTrace_1 = __decorate([
    DartClass
], DartStackTrace);
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * A span of time, such as 27 days, 4 hours, 12 minutes, and 3 seconds.
 *
 * A `Duration` represents a difference from one point in time to another. The
 * duration may be "negative" if the difference is from a later time to an
 * earlier.
 *
 * Durations are context independent. For example, a duration of 2 days is
 * always 48 hours, even when it is added to a `DateTime` just when the
 * time zone is about to do a daylight-savings switch. (See [DateTime.add]).
 *
 * Despite the same name, a `Duration` object does not implement "Durations"
 * as specified by ISO 8601. In particular, a duration object does not keep
 * track of the individually provided members (such as "days" or "hours"), but
 * only uses these arguments to compute the length of the corresponding time
 * interval.
 *
 * To create a new Duration object, use this class's single constructor
 * giving the appropriate arguments:
 *
 *     Duration fastestMarathon = new Duration(hours:2, minutes:3, seconds:2);
 *
 * The [Duration] is the sum of all individual parts.
 * This means that individual parts can be larger than the next-bigger unit.
 * For example, [inMinutes] can be greater than 59.
 *
 *     assert(fastestMarathon.inMinutes == 123);
 *
 * All individual parts are allowed to be negative.
 *
 * Use one of the properties, such as [inDays],
 * to retrieve the integer value of the Duration in the specified time unit.
 * Note that the returned value is rounded down.
 * For example,
 *
 *     Duration aLongWeekend = new Duration(hours:88);
 *     assert(aLongWeekend.inDays == 3);
 *
 * This class provides a collection of arithmetic
 * and comparison operators,
 * plus a set of constants useful for converting time units.
 *
 * See [DateTime] to represent a point in time.
 * See [Stopwatch] to measure time-spans.
 *
 */
const MICROSECONDS_PER_MILLISECOND = 1000;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MICROSECONDS_PER_SECOND = MICROSECONDS_PER_MILLISECOND * MILLISECONDS_PER_SECOND;
const MICROSECONDS_PER_MINUTE = MICROSECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const MICROSECONDS_PER_HOUR = MICROSECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const MICROSECONDS_PER_DAY = MICROSECONDS_PER_HOUR * HOURS_PER_DAY;
const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * HOURS_PER_DAY;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;
const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
let DartDuration = DartDuration_1 = class DartDuration {
    constructor(_) {
    }
    /**
     * Creates a new Duration object whose value
     * is the sum of all individual parts.
     *
     * Individual parts can be larger than the next-bigger unit.
     * For example, [hours] can be greater than 23.
     *
     * All individual parts are allowed to be negative.
     * All arguments are 0 by default.
     */
    _init(_) {
        let { days, hours, minutes, seconds, milliseconds, microseconds } = Object.assign({
            days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0
        }, _);
        this._microseconds(MICROSECONDS_PER_DAY * days +
            MICROSECONDS_PER_HOUR * hours +
            MICROSECONDS_PER_MINUTE * minutes +
            MICROSECONDS_PER_SECOND * seconds +
            MICROSECONDS_PER_MILLISECOND * milliseconds +
            microseconds);
    }
    // Fast path internal direct constructor to avoids the optional arguments and
    // [_microseconds] recomputation.
    _microseconds(_duration) {
        this._duration = _duration;
    }
    /**
     * Adds this Duration and [other] and
     * returns the sum as a new Duration object.
     */
    plus(other) {
        return new DartDuration_1._microseconds(this._duration + other._duration);
    }
    /**
     * Subtracts [other] from this Duration and
     * returns the difference as a new Duration object.
     */
    minus(other) {
        return new DartDuration_1._microseconds(this._duration - other._duration);
    }
    /**
     * Multiplies this Duration by the given [factor] and returns the result
     * as a new Duration object.
     *
     * Note that when [factor] is a double, and the duration is greater than
     * 53 bits, precision is lost because of double-precision arithmetic.
     */
    multiply(factor) {
        return new DartDuration_1._microseconds(new DartNumber((this._duration * factor)).round());
    }
    /**
     * Divides this Duration by the given [quotient] and returns the truncated
     * result as a new Duration object.
     *
     * Throws an [IntegerDivisionByZeroException] if [quotient] is `0`.
     */
    divide(quotient) {
        // By doing the check here instead of relying on "~/" below we get the
        // exception even with dart2js.
        if (quotient == 0)
            throw new DartIntegerDivisionByZeroException();
        return new DartDuration_1._microseconds(new DartNumber(this._duration / quotient).floor());
    }
    /**
     * Returns `true` if the value of this Duration
     * is less than the value of [other].
     */
    isLessThan(other) {
        return this._duration < other._duration;
    }
    /**
     * Returns `true` if the value of this Duration
     * is greater than the value of [other].
     */
    isGreaterThan(other) {
        return this._duration > other._duration;
    }
    /**
     * Returns `true` if the value of this Duration
     * is less than or equal to the value of [other].
     */
    isLessOrEqual(other) {
        return this._duration <= other._duration;
    }
    /**
     * Returns `true` if the value of this Duration
     * is greater than or equal to the value of [other].
     */
    isGreaterOrEqual(other) {
        return this._duration >= other._duration;
    }
    /**
     * Returns the number of whole days spanned by this Duration.
     */
    get inDays() {
        return _dart.divide(this._duration, MICROSECONDS_PER_DAY);
    }
    /**
     * Returns the number of whole hours spanned by this Duration.
     *
     * The returned value can be greater than 23.
     */
    get inHours() {
        return _dart.divide(this._duration, MICROSECONDS_PER_HOUR);
    }
    /**
     * Returns the number of whole minutes spanned by this Duration.
     *
     * The returned value can be greater than 59.
     */
    get inMinutes() {
        return _dart.divide(this._duration, MICROSECONDS_PER_MINUTE);
    }
    /**
     * Returns the number of whole seconds spanned by this Duration.
     *
     * The returned value can be greater than 59.
     */
    get inSeconds() {
        return _dart.divide(this._duration, MICROSECONDS_PER_SECOND);
    }
    /**
     * Returns number of whole milliseconds spanned by this Duration.
     *
     * The returned value can be greater than 999.
     */
    get inMilliseconds() {
        return _dart.divide(this._duration, MICROSECONDS_PER_MILLISECOND);
    }
    /**
     * Returns number of whole microseconds spanned by this Duration.
     */
    get inMicroseconds() {
        return this._duration;
    }
    /**
     * Returns `true` if this Duration is the same object as [other].
     */
    equals(other) {
        if (!_dart.is(other, DartDuration_1))
            return false;
        return this._duration === other._duration;
    }
    get hashCode() {
        return new DartNumber(this._duration).hashCode;
    }
    /**
     * Compares this Duration to [other], returning zero if the values are equal.
     *
     * Returns a negative integer if this `Duration` is shorter than
     * [other], or a positive integer if it is longer.
     *
     * A negative `Duration` is always considered shorter than a positive one.
     *
     * It is always the case that `duration1.compareTo(duration2) < 0` iff
     * `(someDate + duration1).compareTo(someDate + duration2) < 0`.
     */
    compareTo(other) {
        return new DartNumber(this._duration).compareTo(other._duration);
    }
    /**
     * Returns a string representation of this `Duration`.
     *
     * Returns a string with hours, minutes, seconds, and microseconds, in the
     * following format: `HH:MM:SS.mmmmmm`. For example,
     *
     *     var d = new Duration(days:1, hours:1, minutes:33, microseconds: 500);
     *     d.toString();  // "25:33:00.000500"
     */
    toString() {
        function sixDigits(n) {
            if (n >= 100000)
                return `${n}`;
            if (n >= 10000)
                return `0${n}`;
            if (n >= 1000)
                return `00${n}`;
            if (n >= 100)
                return `000${n}`;
            if (n >= 10)
                return `0000${n}`;
            return `00000${n}`;
        }
        function twoDigits(n) {
            if (n >= 10)
                return `${n}`;
            return `0${n}`;
        }
        if (this.inMicroseconds < 0) {
            return `-${-this}`;
        }
        let twoDigitMinutes = twoDigits(this.inMinutes % (MINUTES_PER_HOUR));
        let twoDigitSeconds = twoDigits(this.inSeconds % (SECONDS_PER_MINUTE));
        let sixDigitUs = sixDigits(this.inMicroseconds % (MICROSECONDS_PER_SECOND));
        return `${this.inHours}:${twoDigitMinutes}:${twoDigitSeconds}.${sixDigitUs}`;
    }
    /**
     * Returns whether this `Duration` is negative.
     *
     * A negative `Duration` represents the difference from a later time to an
     * earlier time.
     */
    get isNegative() {
        return this._duration < 0;
    }
    /**
     * Returns a new `Duration` representing the absolute value of this
     * `Duration`.
     *
     * The returned `Duration` has the same length as this one, but is always
     * positive.
     */
    abs() {
        return new DartDuration_1._microseconds(new DartNumber(this._duration).abs());
    }
    /**
     * Returns a new `Duration` representing this `Duration` negated.
     *
     * The returned `Duration` has the same length as this one, but will have the
     * opposite sign of this one.
     */
    // Using subtraction helps dart2js avoid negative zeros.
    negate() {
        return new DartDuration_1._microseconds(0 - this._duration);
    }
};
DartDuration.ZERO = new DartDuration_1({ seconds: 0 });
__decorate([
    defaultConstructor
], DartDuration.prototype, "_init", null);
__decorate([
    namedConstructor
], DartDuration.prototype, "_microseconds", null);
__decorate([
    Operator(Op.PLUS)
], DartDuration.prototype, "plus", null);
__decorate([
    Operator(Op.MINUS)
], DartDuration.prototype, "minus", null);
__decorate([
    Operator(Op.TIMES)
], DartDuration.prototype, "multiply", null);
__decorate([
    Operator(Op.QUOTIENT)
], DartDuration.prototype, "divide", null);
__decorate([
    Operator(Op.LT)
], DartDuration.prototype, "isLessThan", null);
__decorate([
    Operator(Op.GT)
], DartDuration.prototype, "isGreaterThan", null);
__decorate([
    Operator(Op.LEQ)
], DartDuration.prototype, "isLessOrEqual", null);
__decorate([
    Operator(Op.GEQ)
], DartDuration.prototype, "isGreaterOrEqual", null);
__decorate([
    Operator(Op.EQUALS)
], DartDuration.prototype, "equals", null);
__decorate([
    Operator(Op.NEG)
], DartDuration.prototype, "negate", null);
DartDuration = DartDuration_1 = __decorate([
    DartClass
], DartDuration);
// Exception thrown when doing integer division with a zero divisor.
class DartIntegerDivisionByZeroException extends DartError {
    constructor() {
        super();
    }
    toString() {
        return "IntegerDivisionByZeroException";
    }
}
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * A simple stopwatch interface to measure elapsed time.
 */
class DartStopwatch {
    /**
     * Creates a [Stopwatch] in stopped state with a zero elapsed count.
     *
     * The following example shows how to start a [Stopwatch]
     * immediately after allocation.
     * ```
     * var stopwatch = new Stopwatch()..start();
     * ```
     */
    constructor() {
        // The _start and _stop fields capture the time when [start] and [stop]
        // are called respectively.
        // If _stop is null, the stopwatch is running.
        this._start = 0;
        this._stop = 0;
        if (DartStopwatch._frequency == null)
            DartStopwatch._initTicker();
    }
    /**
     * Frequency of the elapsed counter in Hz.
     */
    get frequency() {
        return DartStopwatch._frequency;
    }
    /**
     * Starts the [Stopwatch].
     *
     * The [elapsed] count is increasing monotonically. If the [Stopwatch] has
     * been stopped, then calling start again restarts it without resetting the
     * [elapsed] count.
     *
     * If the [Stopwatch] is currently running, then calling start does nothing.
     */
    start() {
        if (this._stop != null) {
            // (Re)start this stopwatch.
            // Don't count the time while the stopwatch has been stopped.
            this._start += DartStopwatch._now() - this._stop;
            this._stop = null;
        }
    }
    /**
     * Stops the [Stopwatch].
     *
     * The [elapsedTicks] count stops increasing after this call. If the
     * [Stopwatch] is currently not running, then calling this method has no
     * effect.
     */
    stop() {
        this._stop = this._stop || DartStopwatch._now();
    }
    /**
     * Resets the [elapsed] count to zero.
     *
     * This method does not stop or start the [Stopwatch].
     */
    reset() {
        this._start = this._stop || DartStopwatch._now();
    }
    /**
     * The elapsed number of clock ticks since calling [start] while the
     * [Stopwatch] is running.
     *
     * This is the elapsed number of clock ticks between calling [start] and
     * calling [stop].
     *
     * Is 0 if the [Stopwatch] has never been started.
     *
     * The elapsed number of clock ticks increases by [frequency] every second.
     */
    get elapsedTicks() {
        return (this._stop || DartStopwatch._now()) - this._start;
    }
    /**
     * The [elapsedTicks] counter converted to a [Duration].
     */
    get elapsed() {
        return new DartDuration({ microseconds: this.elapsedMicroseconds });
    }
    /**
     * The [elapsedTicks] counter converted to microseconds.
     */
    get elapsedMicroseconds() {
        return _dart.divide(this.elapsedTicks * 1000000, this.frequency);
    }
    /**
     * The [elapsedTicks] counter converted to milliseconds.
     */
    get elapsedMilliseconds() {
        return _dart.divide((this.elapsedTicks * 1000), this.frequency);
    }
    /**
     * Whether the [Stopwatch] is currently running.
     */
    get isRunning() {
        return this._stop == null;
    }
    /**
     * Initializes the time-measuring system. *Must* initialize the [_frequency]
     * variable.
     */
    //@patch
    static _initTicker() {
        DartPrimitives.initTicker();
        this._frequency = DartPrimitives.timerFrequency;
    }
    //@patch
    static _now() {
        return DartPrimitives.timerTicks();
    }
}
// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * An instant in time, such as July 20, 1969, 8:18pm GMT.
 *
 * Create a DateTime object by using one of the constructors
 * or by parsing a correctly formatted string,
 * which complies with a subset of ISO 8601.
 * Note that hours are specified between 0 and 23,
 * as in a 24-hour clock.
 * For example:
 *
 *     DateTime now = new DateTime.now();
 *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
 *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");  // 8:18pm
 *
 * A DateTime object is anchored either in the UTC time zone
 * or in the local time zone of the current computer
 * when the object is created.
 *
 * Once created, neither the value nor the time zone
 * of a DateTime object may be changed.
 *
 * You can use properties to get
 * the individual units of a DateTime object.
 *
 *     assert(berlinWallFell.month == 11);
 *     assert(moonLanding.hour == 20);
 *
 * For convenience and readability,
 * the DateTime class provides a constant for each day and month
 * name&mdash;for example, [AUGUST] and [FRIDAY].
 * You can use these constants to improve code readability:
 *
 *     DateTime berlinWallFell = new DateTime(1989, DateTime.NOVEMBER, 9);
 *     assert(berlinWallFell.weekday == DateTime.THURSDAY);
 *
 * Day and month values begin at 1, and the week starts on Monday.
 * That is, the constants [JANUARY] and [MONDAY] are both 1.
 *
 * ## Working with UTC and local time
 *
 * A DateTime object is in the local time zone
 * unless explicitly created in the UTC time zone.
 *
 *     DateTime dDay = new DateTime.utc(1944, 6, 6);
 *
 * Use [isUtc] to determine whether a DateTime object is based in UTC.
 * Use the methods [toLocal] and [toUtc]
 * to get the equivalent date/time value specified in the other time zone.
 * Use [timeZoneName] to get an abbreviated name of the time zone
 * for the DateTime object.
 * To find the difference
 * between UTC and the time zone of a DateTime object
 * call [timeZoneOffset].
 *
 * ## Comparing DateTime objects
 *
 * The DateTime class contains several handy methods,
 * such as [isAfter], [isBefore], and [isAtSameMomentAs],
 * for comparing DateTime objects.
 *
 *     assert(berlinWallFell.isAfter(moonLanding) == true);
 *     assert(berlinWallFell.isBefore(moonLanding) == false);
 *
 * ## Using DateTime with Duration
 *
 * Use the [add] and [subtract] methods with a [Duration] object
 * to create a new DateTime object based on another.
 * For example, to find the date that is sixty days after today, write:
 *
 *     DateTime today = new DateTime.now();
 *     DateTime sixtyDaysFromNow = today.add(new Duration(days: 60));
 *
 * To find out how much time is between two DateTime objects use
 * [difference], which returns a [Duration] object:
 *
 *     Duration difference = berlinWallFell.difference(moonLanding)
 *     assert(difference.inDays == 7416);
 *
 * The difference between two dates in different time zones
 * is just the number of nanoseconds between the two points in time.
 * It doesn't take calendar days into account.
 * That means that the difference between two midnights in local time may be
 * less than 24 hours times the number of days between them,
 * if there is a daylight saving change in between.
 * If the difference above is calculated using Australian local time, the
 * difference is 7415 days and 23 hours, which is only 7415 whole days as
 * reported by `inDays`.
 *
 * ## Other resources
 *
 * See [Duration] to represent a span of time.
 * See [Stopwatch] to measure timespans.
 *
 * The DateTime class does not provide internationalization.
 * To internationalize your code, use
 * the [intl](http://pub.dartlang.org/packages/intl) package.
 *
 */
let DartDateTime = DartDateTime_1 = class DartDateTime extends DartObject {
    constructor(year, month /* = 1*/, day /*= 1*/, hour /*= 0*/, minute /* = 0*/, second /* = 0*/, millisecond /* = 0*/, microsecond /* = 0*/) {
        super();
    }
    /**
     * Constructs a [DateTime] instance specified in the local time zone.
     *
     * For example,
     * to create a new DateTime object representing April 29, 2014, 6:04am:
     *
     *     DateTime annularEclipse = new DateTime(2014, DateTime.APRIL, 29, 6, 4);
     */
    DartDateTime(year, month /* = 1*/, day /*= 1*/, hour /*= 0*/, minute /* = 0*/, second /* = 0*/, millisecond /* = 0*/, microsecond /* = 0*/) {
        this._internal(year, month, day, hour, minute, second, millisecond, microsecond, false);
    }
    /**
     * Constructs a [DateTime] instance specified in the UTC time zone.
     *
     *     DateTime dDay = new DateTime.utc(1944, DateTime.JUNE, 6);
     */
    utc(year, month /* = 1*/, day /*= 1*/, hour /*= 0*/, minute /* = 0*/, second /* = 0*/, millisecond /* = 0*/, microsecond /* = 0*/) {
        this._internal(year, month, day, hour, minute, second, millisecond, microsecond, true);
    }
    /**
     * Constructs a [DateTime] instance with current date and time in the
     * local time zone.
     *
     *     DateTime thisInstant = new DateTime.now();
     *
     */
    now() {
        this._now();
    }
    /**
     * Constructs a new [DateTime] instance based on [formattedString].
     *
     * Throws a [FormatException] if the input cannot be parsed.
     *
     * The function parses a subset of ISO 8601
     * which includes the subset accepted by RFC 3339.
     *
     * The accepted inputs are currently:
     *
     * * A date: A signed four-to-six digit year, two digit month and
     *   two digit day, optionally separated by `-` characters.
     *   Examples: "19700101", "-0004-12-24", "81030-04-01".
     * * An optional time part, separated from the date by either `T` or a space.
     *   The time part is a two digit hour,
     *   then optionally a two digit minutes value,
     *   then optionally a two digit seconds value, and
     *   then optionally a '.' followed by a one-to-six digit second fraction.
     *   The minutes and seconds may be separated from the previous parts by a
     *   ':'.
     *   Examples: "12", "12:30:24.124", "123010.50".
     * * An optional time-zone offset part,
     *   possibly separated from the previous by a space.
     *   The time zone is either 'z' or 'Z', or it is a signed two digit hour
     *   part and an optional two digit minute part. The sign must be either
     *   "+" or "-", and can not be omitted.
     *   The minutes may be separated from the hours by a ':'.
     *   Examples: "Z", "-10", "01:30", "1130".
     *
     * This includes the output of both [toString] and [toIso8601String], which
     * will be parsed back into a `DateTime` object with the same time as the
     * original.
     *
     * The result is always in either local time or UTC.
     * If a time zone offset other than UTC is specified,
     * the time is converted to the equivalent UTC time.
     *
     * Examples of accepted strings:
     *
     * * `"2012-02-27 13:27:00"`
     * * `"2012-02-27 13:27:00.123456z"`
     * * `"20120227 13:27:00"`
     * * `"20120227T132700"`
     * * `"20120227"`
     * * `"+20120227"`
     * * `"2012-02-27T14Z"`
     * * `"2012-02-27T14+00:00"`
     * * `"-123450101 00:00:00 Z"`: in the year -12345.
     * * `"2002-02-27T14:00:00-0500"`: Same as `"2002-02-27T19:00:00Z"`
     */
    // TODO(lrn): restrict incorrect values like  2003-02-29T50:70:80.
    // Or not, that may be a breaking change.
    static parse(formattedString) {
        /*
         * date ::= yeardate time_opt timezone_opt
         * yeardate ::= year colon_opt month colon_opt day
         * year ::= sign_opt digit{4,6}
         * colon_opt :: <empty> | ':'
         * sign ::= '+' | '-'
         * sign_opt ::=  <empty> | sign
         * month ::= digit{2}
         * day ::= digit{2}
         * time_opt ::= <empty> | (' ' | 'T') hour minutes_opt
         * minutes_opt ::= <empty> | colon_opt digit{2} seconds_opt
         * seconds_opt ::= <empty> | colon_opt digit{2} millis_opt
         * micros_opt ::= <empty> | '.' digit{1,6}
         * timezone_opt ::= <empty> | space_opt timezone
         * space_opt :: ' ' | <empty>
         * timezone ::= 'z' | 'Z' | sign digit{2} timezonemins_opt
         * timezonemins_opt ::= <empty> | colon_opt digit{2}
         */
        let re = new DartRegExp('^([+-]?\d{4,6})-?(\d\d)-?(\d\d)' + // Day part.
            '(?:[ T](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d{1,6}))?)?)?' + // Time part.
            '( ?[zZ]| ?([-+])(\d\d)(?::?(\d\d))?)?)?$'); // Timezone part.
        let match = re.firstMatch(formattedString);
        if (match != null) {
            let parseIntOrZero = (matched) => {
                if (matched == null)
                    return 0;
                return DartInt.parse(matched);
            };
            // Parses fractional second digits of '.(\d{1,6})' into the combined
            // microseconds.
            let parseMilliAndMicroseconds = (matched) => {
                if (matched == null)
                    return 0;
                let length = matched.length;
                //assert(length >= 1);
                //assert(length <= 6);
                let result = 0;
                for (let i = 0; i < 6; i++) {
                    result *= 10;
                    if (i < matched.length) {
                        result += new DartString(matched).codeUnitAt(i) ^ 0x30;
                    }
                }
                return result;
            };
            let years = DartInt.parse(match[1]);
            let month = DartInt.parse(match[2]);
            let day = DartInt.parse(match[3]);
            let hour = parseIntOrZero(match[4]);
            let minute = parseIntOrZero(match[5]);
            let second = parseIntOrZero(match[6]);
            let addOneMillisecond = false;
            let milliAndMicroseconds = parseMilliAndMicroseconds(match[7]);
            let millisecond = divide(milliAndMicroseconds, MICROSECONDS_PER_MILLISECOND);
            let microsecond = new DartInt(milliAndMicroseconds).remainder(MICROSECONDS_PER_MILLISECOND);
            let isUtc = false;
            if (match[8] != null) {
                // timezone part
                isUtc = true;
                if (match[9] != null) {
                    // timezone other than 'Z' and 'z'.
                    let sign = (match[9] == '-') ? -1 : 1;
                    let hourDifference = DartInt.parse(match[10]);
                    let minuteDifference = parseIntOrZero(match[11]);
                    minuteDifference += 60 * hourDifference;
                    minute -= sign * minuteDifference;
                }
            }
            let value = DartDateTime_1._brokenDownDateToValue(years, month, day, hour, minute, second, millisecond, microsecond, isUtc);
            if (value == null) {
                throw new FormatException("Time out of range", formattedString);
            }
            return new DartDateTime_1._withValue(value, { isUtc: isUtc });
        }
        else {
            throw new FormatException("Invalid date format", formattedString);
        }
    }
    /**
     * Constructs a new [DateTime] instance
     * with the given [millisecondsSinceEpoch].
     *
     * If [isUtc] is false then the date is in the local time zone.
     *
     * The constructed [DateTime] represents
     * 1970-01-01T00:00:00Z + [millisecondsSinceEpoch] ms in the given
     * time zone (local or UTC).
     */
    /* external */
    fromMillisecondsSinceEpoch(millisecondsSinceEpoch, _) {
        let { isUtc } = Object.assign({ isUtc: false }, _);
        this._withValue(0 + millisecondsSinceEpoch, { isUtc: isUtc });
    }
    /**
     * Constructs a new [DateTime] instance
     * with the given [microsecondsSinceEpoch].
     *
     * If [isUtc] is false then the date is in the local time zone.
     *
     * The constructed [DateTime] represents
     * 1970-01-01T00:00:00Z + [microsecondsSinceEpoch] us in the given
     * time zone (local or UTC).
     */
    /* external */
    fromMicrosecondsSinceEpoch(microsecondsSinceEpoch, _) {
        let { isUtc } = Object.assign({ isUtc: false }, _);
        this._withValue(DartDateTime_1._microsecondInRoundedMilliseconds(microsecondsSinceEpoch), { isUtc: isUtc });
    }
    /**
     * Constructs a new [DateTime] instance with the given value.
     *
     * If [isUtc] is false then the date is in the local time zone.
     */
    _withValue(_value, _) {
        let { isUtc } = Object.assign({}, _);
        this._value = _value;
        this.isUtc = isUtc;
        if (new DartNumber(this.millisecondsSinceEpoch).abs() > DartDateTime_1._MAX_MILLISECONDS_SINCE_EPOCH ||
            (new DartNumber(this.millisecondsSinceEpoch).abs() == DartDateTime_1._MAX_MILLISECONDS_SINCE_EPOCH &&
                this.microsecond != 0)) {
            throw new ArgumentError(this.millisecondsSinceEpoch);
        }
        if (isUtc == null)
            throw new ArgumentError(isUtc);
    }
    /**
     * Returns true if [other] is a [DateTime] at the same moment and in the
     * same time zone (UTC or local).
     *
     *     DateTime dDayUtc   = new DateTime.utc(1944, DateTime.JUNE, 6);
     *     DateTime dDayLocal = new DateTime(1944, DateTime.JUNE, 6);
     *
     *     assert(dDayUtc.isAtSameMomentAs(dDayLocal) == false);
     *
     * See [isAtSameMomentAs] for a comparison that adjusts for time zone.
     */
    equals(other) {
        if (isNot(other, DartDateTime_1))
            return false;
        return (this._value == other._value && this.isUtc == other.isUtc);
    }
    /**
     * Returns true if [this] occurs before [other].
     *
     * The comparison is independent
     * of whether the time is in UTC or in the local time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isBefore(moonLanding) == false);
     *
     */
    isBefore(other) {
        return this._value < other._value;
    }
    /**
     * Returns true if [this] occurs after [other].
     *
     * The comparison is independent
     * of whether the time is in UTC or in the local time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isAfter(moonLanding) == true);
     *
     */
    isAfter(other) {
        return this._value > other._value;
    }
    /**
     * Returns true if [this] occurs at the same moment as [other].
     *
     * The comparison is independent of whether the time is in UTC or in the local
     * time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isAtSameMomentAs(moonLanding) == false);
     */
    isAtSameMomentAs(other) {
        return this._value == other._value;
    }
    /**
     * Compares this DateTime object to [other],
     * returning zero if the values are equal.
     *
     * This function returns a negative integer
     * if this DateTime is smaller (earlier) than [other],
     * or a positive integer if it is greater (later).
     */
    compareTo(other) {
        return new DartInt(this._value).compareTo(other._value);
    }
    get hashCode() {
        return (this._value ^ (this._value >> 30)) & 0x3FFFFFFF;
    }
    /**
     * Returns this DateTime value in the local time zone.
     *
     * Returns [this] if it is already in the local time zone.
     * Otherwise this method is equivalent to:
     *
     *     new DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch,
     *                                             isUtc: false)
     */
    toLocal() {
        if (this.isUtc) {
            return new DartDateTime_1._withValue(this._value, { isUtc: false });
        }
        return this;
    }
    /**
     * Returns this DateTime value in the UTC time zone.
     *
     * Returns [this] if it is already in UTC.
     * Otherwise this method is equivalent to:
     *
     *     new DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch,
     *                                             isUtc: true)
     */
    toUtc() {
        if (this.isUtc)
            return this;
        return new DartDateTime_1._withValue(this._value, { isUtc: true });
    }
    static _fourDigits(n) {
        let absN = new DartNumber(n).abs();
        let sign = n < 0 ? "-" : "";
        if (absN >= 1000)
            return `${n}`;
        if (absN >= 100)
            return `${sign}0${absN}`;
        if (absN >= 10)
            return `${sign}00${absN}`;
        return `${sign}000${absN}`;
    }
    static _sixDigits(n) {
        //assert(n < -9999 || n > 9999);
        let absN = new DartNumber(n).abs();
        let sign = n < 0 ? "-" : "+";
        if (absN >= 100000)
            return `${sign}${absN}`;
        return "${sign}0${absN}";
    }
    static _threeDigits(n) {
        if (n >= 100)
            return `${n}`;
        if (n >= 10)
            return `0${n}`;
        return `00${n}`;
    }
    static _twoDigits(n) {
        if (n >= 10)
            return `${n}`;
        return `0${n}`;
    }
    /**
     * Returns a human-readable string for this instance.
     *
     * The returned string is constructed for the time zone of this instance.
     * The `toString()` method provides a simply formatted string.
     * It does not support internationalized strings.
     * Use the [intl](http://pub.dartlang.org/packages/intl) package
     * at the pub shared packages repo.
     *
     * The resulting string can be parsed back using [parse].
     */
    toString() {
        let y = DartDateTime_1._fourDigits(this.year);
        let m = DartDateTime_1._twoDigits(this.month);
        let d = DartDateTime_1._twoDigits(this.day);
        let h = DartDateTime_1._twoDigits(this.hour);
        let min = DartDateTime_1._twoDigits(this.minute);
        let sec = DartDateTime_1._twoDigits(this.second);
        let ms = DartDateTime_1._threeDigits(this.millisecond);
        let us = this.microsecond == 0 ? "" : DartDateTime_1._threeDigits(this.microsecond);
        if (this.isUtc) {
            return `${y}-${m}-${d} ${h}:${min}:${sec}.${ms}${us}Z`;
        }
        else {
            return `${y}-${m}-${d} ${h}:${min}:${sec}.${ms}${us}`;
        }
    }
    /**
     * Returns an ISO-8601 full-precision extended format representation.
     *
     * The format is `yyyy-MM-ddTHH:mm:ss.mmmuuuZ` for UTC time, and
     * `yyyy-MM-ddTHH:mm:ss.mmmuuu` (no trailing "Z") for local/non-UTC time,
     * where:
     *
     * * `yyyy` is a, possibly negative, four digit representation of the year,
     *   if the year is in the range -9999 to 9999,
     *   otherwise it is a signed six digit representation of the year.
     * * `MM` is the month in the range 01 to 12,
     * * `dd` is the day of the month in the range 01 to 31,
     * * `HH` are hours in the range 00 to 23,
     * * `mm` are minutes in the range 00 to 59,
     * * `ss` are seconds in the range 00 to 59 (no leap seconds),
     * * `mmm` are milliseconds in the range 000 to 999, and
     * * `uuu` are microseconds in the range 001 to 999. If [microsecond] equals
     *   0, then this part is omitted.
     *
     * The resulting string can be parsed back using [parse].
     */
    toIso8601String() {
        let y = (this.year >= -9999 && this.year <= 9999) ? DartDateTime_1._fourDigits(this.year) : DartDateTime_1._sixDigits(this.year);
        let m = DartDateTime_1._twoDigits(this.month);
        let d = DartDateTime_1._twoDigits(this.day);
        let h = DartDateTime_1._twoDigits(this.hour);
        let min = DartDateTime_1._twoDigits(this.minute);
        let sec = DartDateTime_1._twoDigits(this.second);
        let ms = DartDateTime_1._threeDigits(this.millisecond);
        let us = this.microsecond == 0 ? "" : DartDateTime_1._threeDigits(this.microsecond);
        if (this.isUtc) {
            return `${y}-${m}-${d}T${h}:${min}:${sec}.${ms}${us}Z`;
        }
        else {
            return `${y}-${m}-${d}T${h}:${min}:${sec}.${ms}${us}`;
        }
    }
    /**
     * Returns a new [DateTime] instance with [duration] added to [this].
     *
     *     DateTime today = new DateTime.now();
     *     DateTime fiftyDaysFromNow = today.add(new Duration(days: 50));
     *
     * Notice that the duration being added is actually 50 * 24 * 60 * 60
     * seconds. If the resulting `DateTime` has a different daylight saving offset
     * than `this`, then the result won't have the same time-of-day as `this`, and
     * may not even hit the calendar date 50 days later.
     *
     * Be careful when working with dates in local time.
     */
    /*external*/
    add(duration) {
        return new DartDateTime_1._withValue(this._value + duration.inMilliseconds, { isUtc: this.isUtc });
    }
    /**
     * Returns a new [DateTime] instance with [duration] subtracted from [this].
     *
     *     DateTime today = new DateTime.now();
     *     DateTime fiftyDaysAgo = today.subtract(new Duration(days: 50));
     *
     * Notice that the duration being subtracted is actually 50 * 24 * 60 * 60
     * seconds. If the resulting `DateTime` has a different daylight saving offset
     * than `this`, then the result won't have the same time-of-day as `this`, and
     * may not even hit the calendar date 50 days earlier.
     *
     * Be careful when working with dates in local time.
     */
    /*external*/
    subtract(duration) {
        return new DartDateTime_1._withValue(this._value - duration.inMilliseconds, { isUtc: this.isUtc });
    }
    /**
     * Returns a [Duration] with the difference between [this] and [other].
     *
     *     DateTime berlinWallFell = new DateTime.utc(1989, DateTime.NOVEMBER, 9);
     *     DateTime dDay = new DateTime.utc(1944, DateTime.JUNE, 6);
     *
     *     Duration difference = berlinWallFell.difference(dDay);
     *     assert(difference.inDays == 16592);
     *
     * The difference is measured in seconds and fractions of seconds.
     * The difference above counts the number of fractional seconds between
     * midnight at the beginning of those dates.
     * If the dates above had been in local time, not UTC, then the difference
     * between two midnights may not be a multiple of 24 hours due to daylight
     * saving differences.
     *
     * For example, in Australia, similar code using local time instead of UTC:
     *
     *     DateTime berlinWallFell = new DateTime(1989, DateTime.NOVEMBER, 9);
     *     DateTime dDay = new DateTime(1944, DateTime.JUNE, 6);
     *     Duration difference = berlinWallFell.difference(dDay);
     *     assert(difference.inDays == 16592);
     *
     * will fail because the difference is actually 16591 days and 23 hours, and
     * [Duration.inDays] only returns the number of whole days.
     */
    /*external*/
    difference(other) {
        return new DartDuration({ milliseconds: this._value - other._value });
    }
    /* external */
    _internal(year, month, day, hour, minute, second, millisecond, microsecond, isUtc) {
        month = nullOr(month, 1);
        day = nullOr(day, 1);
        hour = nullOr(hour, 0);
        minute = nullOr(minute, 0);
        second = nullOr(second, 0);
        millisecond = nullOr(millisecond, 0);
        microsecond = nullOr(microsecond, 0);
        this.isUtc = is(isUtc, 'bool')
            ? isUtc
            : (() => {
                throw new ArgumentError.value(isUtc, 'isUtc');
            })();
        this._value = checkInt(DartPrimitives.valueFromDecomposedDate(year, month, day, hour, minute, second, millisecond + DartDateTime_1._microsecondInRoundedMilliseconds(microsecond), isUtc));
    }
    /*external*/
    _now() {
        this.isUtc = false;
        this._value = DartPrimitives.dateNow();
    }
    /// Returns the time as value (millisecond or microsecond since epoch), or
    /// null if the values are out of range.
    static _brokenDownDateToValue(year, month, day, hour, minute, second, millisecond, microsecond, isUtc) {
        return DartPrimitives.valueFromDecomposedDate(year, month, day, hour, minute, second, millisecond + DartDateTime_1._microsecondInRoundedMilliseconds(microsecond), isUtc);
    }
    /**
     * The number of milliseconds since
     * the "Unix epoch" 1970-01-01T00:00:00Z (UTC).
     *
     * This value is independent of the time zone.
     *
     * This value is at most
     * 8,640,000,000,000,000ms (100,000,000 days) from the Unix epoch.
     * In other words: `millisecondsSinceEpoch.abs() <= 8640000000000000`.
     */
    /*external*/
    get millisecondsSinceEpoch() {
        return this._value;
    }
    /**
     * The number of microseconds since
     * the "Unix epoch" 1970-01-01T00:00:00Z (UTC).
     *
     * This value is independent of the time zone.
     *
     * This value is at most
     * 8,640,000,000,000,000,000us (100,000,000 days) from the Unix epoch.
     * In other words: `microsecondsSinceEpoch.abs() <= 8640000000000000000`.
     *
     * Note that this value does not fit into 53 bits (the size of a IEEE double).
     * A JavaScript number is not able to hold this value.
     */
    /*external*/
    get microsecondsSinceEpoch() {
        return 1000 * this._value;
    }
    /**
     * The time zone name.
     *
     * This value is provided by the operating system and may be an
     * abbreviation or a full name.
     *
     * In the browser or on Unix-like systems commonly returns abbreviations,
     * such as "CET" or "CEST". On Windows returns the full name, for example
     * "Pacific Standard Time".
     */
    /*external*/
    get timeZoneName() {
        if (this.isUtc)
            return "UTC";
        return DartPrimitives.getTimeZoneName(this);
    }
    /**
     * The time zone offset, which
     * is the difference between local time and UTC.
     *
     * The offset is positive for time zones east of UTC.
     *
     * Note, that JavaScript, Python and C return the difference between UTC and
     * local time. Java, C# and Ruby return the difference between local time and
     * UTC.
     */
    /*external*/
    get timeZoneOffset() {
        if (this.isUtc)
            return new DartDuration();
        return new DartDuration({ minutes: DartPrimitives.getTimeZoneOffsetInMinutes(this) });
    }
    /**
     * The year.
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00"){         throw 'external';     }
     *     assert(moonLanding.year == 1969){         throw 'external';     }
     */
    /*external*/
    get year() {
        return DartPrimitives.getYear(this);
    }
    /**
     * The month [1..12].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.month == 7);
     *     assert(moonLanding.month == DateTime.JULY);
     */
    /*external*/
    get month() {
        return DartPrimitives.getMonth(this);
    }
    /**
     * The day of the month [1..31].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.day == 20);
     */
    /*external*/
    get day() {
        return DartPrimitives.getDay(this);
    }
    /**
     * The hour of the day, expressed as in a 24-hour clock [0..23].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.hour == 20);
     */
    /*external*/
    get hour() {
        return DartPrimitives.getHours(this);
    }
    /**
     * The minute [0...59].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.minute == 18);
     */
    /*external*/
    get minute() {
        return DartPrimitives.getMinutes(this);
    }
    /**
     * The second [0...59].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.second == 0);
     */
    /*external*/
    get second() {
        return DartPrimitives.getSeconds(this);
    }
    /**
     * The millisecond [0...999].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.millisecond == 0);
     */
    /*external*/
    get millisecond() {
        return DartPrimitives.getMilliseconds(this);
    }
    /**
     * The microsecond [0...999].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.microsecond == 0);
     */
    /*external*/
    get microsecond() {
        return 0;
    }
    /**
     * The day of the week [MONDAY]..[SUNDAY].
     *
     * In accordance with ISO 8601
     * a week starts with Monday, which has the value 1.
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.weekday == 7);
     *     assert(moonLanding.weekday == DateTime.SUNDAY);
     *
     */
    /*external*/
    get weekday() {
        return DartPrimitives.getWeekday(this);
    }
    /// Rounds the given [microsecond] to the nearest milliseconds value.
    ///
    /// For example, invoked with argument `2600` returns `3`.
    static _microsecondInRoundedMilliseconds(microsecond) {
        return new DartNumber((microsecond / 1000)).round();
    }
};
// Weekday constants that are returned by [weekday] method:
DartDateTime.MONDAY = 1;
DartDateTime.TUESDAY = 2;
DartDateTime.WEDNESDAY = 3;
DartDateTime.THURSDAY = 4;
DartDateTime.FRIDAY = 5;
DartDateTime.SATURDAY = 6;
DartDateTime.SUNDAY = 7;
DartDateTime.DAYS_PER_WEEK = 7;
// Month constants that are returned by the [month] getter.
DartDateTime.JANUARY = 1;
DartDateTime.FEBRUARY = 2;
DartDateTime.MARCH = 3;
DartDateTime.APRIL = 4;
DartDateTime.MAY = 5;
DartDateTime.JUNE = 6;
DartDateTime.JULY = 7;
DartDateTime.AUGUST = 8;
DartDateTime.SEPTEMBER = 9;
DartDateTime.OCTOBER = 10;
DartDateTime.NOVEMBER = 11;
DartDateTime.DECEMBER = 12;
DartDateTime.MONTHS_PER_YEAR = 12;
DartDateTime._MAX_MILLISECONDS_SINCE_EPOCH = 8640000000000000;
__decorate([
    defaultConstructor
], DartDateTime.prototype, "DartDateTime", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "utc", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "now", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "fromMillisecondsSinceEpoch", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "fromMicrosecondsSinceEpoch", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "_withValue", null);
__decorate([
    Operator(Op.EQUALS)
], DartDateTime.prototype, "equals", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "_internal", null);
__decorate([
    namedConstructor
], DartDateTime.prototype, "_now", null);
DartDateTime = DartDateTime_1 = __decorate([
    DartClass
], DartDateTime);
// abstract impl needed for type check
const DartPattern = class {
    allMatches(string, start) {
        throw 'abstract';
    }
    matchAsPrefix(string, start) {
        throw 'abstract';
    }
};
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * A regular expression pattern.
 *
 * Regular expressions are [Pattern]s, and can as such be used to match strings
 * or parts of strings.
 *
 * Dart regular expressions have the same syntax and semantics as
 * JavaScript regular expressions. See
 * <http://ecma-international.org/ecma-262/5.1/#sec-15.10>
 * for the specification of JavaScript regular expressions.
 *
 * [firstMatch] is the main implementation method that applies a regular
 * expression to a string and returns the first [Match]. All
 * other methods in [RegExp] can build on it.
 *
 * Use [allMatches] to look for all matches of a regular expression in
 * a string.
 *
 * The following example finds all matches of a regular expression in
 * a string.
 *
 *     RegExp exp = new RegExp(r"(\w+)");
 *     String str = "Parse my string";
 *     Iterable<Match> matches = exp.allMatches(str);
 *
 * Note the use of a _raw string_ (a string prefixed with `r`)
 * in the example above. Use a raw string to treat each character in a string
 * as a literal character.
 */
let DartRegExp = class DartRegExp {
    constructor(source, _) {
    }
    matchAsPrefix(string, start) {
        throw new Error("Method not implemented.");
    }
    /**
     * Constructs a regular expression.
     *
     * Throws a [FormatException] if [source] is not valid regular
     * expression syntax.
     */
    /*external*/
    static _create(source, _) {
        return new JSSyntaxRegExp(source, _);
    }
    /**
     * Searches for the first match of the regular expression
     * in the string [input]. Returns `null` if there is no match.
     */
    firstMatch(input) {
        throw 'abstract';
    }
    /**
     * Returns an iterable of the matches of the regular expression on [input].
     *
     * If [start] is provided, only start looking for matches at `start`.
     */
    allMatches(input, start) {
        throw 'abstract';
    }
    /**
     * Returns whether the regular expression has a match in the string [input].
     */
    hasMatch(input) {
        throw 'abstract';
    }
    /**
     * Returns the first substring match of this regular expression in [input].
     */
    stringMatch(input) {
        throw 'abstract';
    }
    /**
     * The source regular expression string used to create this `RegExp`.
     */
    get pattern() {
        throw 'abstract';
    }
    /**
     * Whether this regular expression matches multiple lines.
     *
     * If the regexp does match multiple lines, the "^" and "$" characters
     * match the beginning and end of lines. If not, the character match the
     * beginning and end of the input.
     */
    get isMultiLine() {
        throw 'abstract';
    }
    /**
     * Whether this regular expression is case sensitive.
     *
     * If the regular expression is not case sensitive, it will match an input
     * letter with a pattern letter even if the two letters are different case
     * versions of the same letter.
     */
    get isCaseSensitive() {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], DartRegExp.prototype, "matchAsPrefix", null);
__decorate([
    Abstract
], DartRegExp.prototype, "firstMatch", null);
__decorate([
    Abstract
], DartRegExp.prototype, "allMatches", null);
__decorate([
    Abstract
], DartRegExp.prototype, "hasMatch", null);
__decorate([
    Abstract
], DartRegExp.prototype, "stringMatch", null);
__decorate([
    AbstractProperty
], DartRegExp.prototype, "pattern", null);
__decorate([
    AbstractProperty
], DartRegExp.prototype, "isMultiLine", null);
__decorate([
    AbstractProperty
], DartRegExp.prototype, "isCaseSensitive", null);
__decorate([
    defaultFactory
], DartRegExp, "_create", null);
DartRegExp = __decorate([
    DartClass,
    Implements(DartPattern)
], DartRegExp);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of _js_helper;
// Helper method used by internal libraries.
const regExpGetNative = (regexp) => regexp._nativeRegExp;
/**
 * Returns a native version of the RegExp with the global flag set.
 *
 * The RegExp's `lastIndex` property is zero when it is returned.
 *
 * The returned regexp is shared, and its `lastIndex` property may be
 * modified by other uses, so the returned regexp must be used immediately
 * when it's returned, with no user-provided code run in between.
 */
const regExpGetGlobalNative = (regexp) => {
    let nativeRegexp = regexp._nativeGlobalVersion;
    // JS('void', '#.lastIndex = 0', nativeRegexp);
    nativeRegexp.lastIndex = 0;
    return nativeRegexp;
};
/**
 * Computes the number of captures in a regexp.
 *
 * This currently involves creating a new RegExp object with a different
 * source and running it against the empty string (the last part is usually
 * fast).
 *
 * The JSSyntaxRegExp could cache the result, and set the cache any time
 * it finds a match.
 */
const regExpCaptureCount = (regexp) => {
    let nativeAnchoredRegExp = regexp._nativeAnchoredVersion;
    let match = new DartList.fromArray(nativeAnchoredRegExp.exec("")) /*JS('JSExtendableArray', '#.exec("")', nativeAnchoredRegExp)*/;
    // The native-anchored regexp always have one capture more than the original,
    // and always matches the empty string.
    return match.length - 2;
};
let JSSyntaxRegExp = JSSyntaxRegExp_1 = class JSSyntaxRegExp {
    constructor(source, _) {
        let { multiLine, caseSensitive } = Object.assign({ multiLine: false, caseSensitive: true }, _);
        this.pattern = source;
        this._nativeRegExp =
            JSSyntaxRegExp_1.makeNative(source, multiLine, caseSensitive, false);
    }
    toString() {
        return `RegExp/${this.pattern}/`;
    }
    get _nativeGlobalVersion() {
        if (this._nativeGlobalRegExp != null)
            return this._nativeGlobalRegExp;
        return this._nativeGlobalRegExp =
            JSSyntaxRegExp_1.makeNative(this.pattern, this._isMultiLine, this._isCaseSensitive, true);
    }
    get _nativeAnchoredVersion() {
        if (this._nativeAnchoredRegExp != null)
            return this._nativeAnchoredRegExp;
        // An "anchored version" of a regexp is created by adding "|()" to the
        // source. This means that the regexp always matches at the first position
        // that it tries, and you can see if the original regexp matched, or it
        // was the added zero-width match that matched, by looking at the last
        // capture. If it is a String, the match participated, otherwise it didn't.
        return this._nativeAnchoredRegExp =
            JSSyntaxRegExp_1.makeNative(`${this.pattern}|()`, this._isMultiLine, this._isCaseSensitive, true);
    }
    get _isMultiLine() {
        return this._nativeRegExp.multiline /* JS('bool', '#.multiline', _nativeRegExp)*/;
    }
    get _isCaseSensitive() {
        return this._nativeRegExp.ignoreCase /*JS('bool', '!#.ignoreCase', _nativeRegExp)*/;
    }
    static makeNative(source, multiLine, caseSensitive, global) {
        checkString(source);
        let m = multiLine == true ? 'm' : '';
        let i = caseSensitive == true ? '' : 'i';
        let g = global ? 'g' : '';
        // We're using the JavaScript's try catch instead of the Dart one to avoid
        // dragging in Dart runtime support just because of using RegExp.
        try {
            return new RegExp(source, `${m}${i}${g}`);
            /* JS(
                   '',
                   r'''
                     (function(source, modifiers) {
                       try {
                         return new RegExp(source, modifiers);
                       } catch (e) {
                         return e;
                       }
                     })(#, # + # + #)''',
                   source,
                   m,
                   i,
                   g);*/
        }
        catch (errorMessage) {
            // The returned value is the JavaScript exception. Turn it into a
            // Dart exception.
            //let errorMessage = JS('String', r'String(#)', regexp);
            throw new FormatException(`Illegal RegExp pattern (${errorMessage})`, source);
        }
    }
    firstMatch(string) {
        let m = this._nativeRegExp.exec(checkString(string)) /*JS('JSExtendableArray|Null', r'#.exec(#)', _nativeRegExp,
        checkString(string));*/;
        if (m == null)
            return null;
        return new _MatchImplementation(this, m);
    }
    hasMatch(string) {
        return this._nativeRegExp.test(checkString(string));
        /*JS('bool', r'#.test(#)', _nativeRegExp, checkString(string));*/
    }
    stringMatch(string) {
        let match = this.firstMatch(string);
        if (match != null)
            return match.group(0);
        return null;
    }
    allMatches(string, start) {
        start = nullOr(start, 0);
        checkString(string);
        checkInt(start);
        if (start < 0 || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        return new _AllMatchesIterable(this, string, start);
    }
    _execGlobal(string, start) {
        let regexp = this._nativeGlobalVersion;
        //JS('void', '#.lastIndex = #', regexp, start);
        regexp.lastIndex = start;
        let match = regexp.exec(string) /*JS('JSExtendableArray|Null', '#.exec(#)', regexp, string)*/;
        if (match == null)
            return null;
        return new _MatchImplementation(this, match);
    }
    _execAnchored(string, start) {
        let regexp = this._nativeAnchoredVersion;
        //JS('void', '#.lastIndex = #', regexp, start);
        regexp.lastIndex = start;
        let match = regexp.exec(string) /* JS('JSExtendableArray|Null', '#.exec(#)', regexp, string)*/;
        if (match == null)
            return null;
        // If the last capture group participated, the original regexp did not
        // match at the start position.
        if (match.pop() != null)
            return null;
        return new _MatchImplementation(this, match);
    }
    matchAsPrefix(string, start) {
        start = nullOr(start, 0);
        if (start < 0 || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        return this._execAnchored(string, start);
    }
    get isMultiLine() {
        return this._isMultiLine;
    }
    get isCaseSensitive() {
        return this._isCaseSensitive;
    }
};
JSSyntaxRegExp = JSSyntaxRegExp_1 = __decorate([
    DartClass
], JSSyntaxRegExp);
class _MatchImplementation {
    constructor(pattern, _match) {
        this.pattern = pattern;
        this._match = _match;
        //assert(JS('var', '#.input', _match) is String);
        //assert(JS('var', '#.index', _match) is int);
    }
    get input() {
        return this._match.input /* JS('String', '#.input', _match)*/;
    }
    get start() {
        return this._match.index; //JS('returns:int;depends:none;effects:none;gvn:true', '#.index', _match);
    }
    get end() {
        return this.start + this._match[0].length;
        /*
       start +
       JS('returns:int;depends:none;effects:none;gvn:true', '#[0].length',
           _match);*/
    }
    group(index) {
        return this._match[index];
    }
    //String operator [](int index) => group(index);
    get groupCount() {
        return this._match.length - 1;
    }
    groups(groups) {
        let out = new DartList();
        for (let i of groups) {
            out.add(this.group(i));
        }
        return out;
    }
}
__decorate([
    Operator(Op.INDEX)
], _MatchImplementation.prototype, "group", null);
class _AllMatchesIterable extends DartIterableBase {
    constructor(_re, _string, _start) {
        super();
        this._re = _re;
        this._string = _string;
        this._start = _start;
    }
    get iterator() {
        return new _AllMatchesIterator(this._re, this._string, this._start);
    }
}
class _AllMatchesIterator {
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
    constructor(_regExp, _string, _nextIndex) {
        this._regExp = _regExp;
        this._string = _string;
        this._nextIndex = _nextIndex;
    }
    get current() {
        return this._current;
    }
    moveNext() {
        if (this._string == null)
            return false;
        if (this._nextIndex <= this._string.length) {
            let match = this._regExp._execGlobal(this._string, this._nextIndex);
            if (match != null) {
                this._current = match;
                let nextIndex = match.end;
                if (match.start == nextIndex) {
                    nextIndex++;
                }
                this._nextIndex = nextIndex;
                return true;
            }
        }
        this._current = null;
        this._string = null; // Marks iteration as ended.
        return false;
    }
}
/** Find the first match of [regExp] in [string] at or after [start]. */
const firstMatchAfter = (regExp, string, start) => {
    return regExp._execGlobal(string, start);
};
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * A sequence of characters.
 *
 * A string can be either single or multiline. Single line strings are
 * written using matching single or double quotes, and multiline strings are
 * written using triple quotes. The following are all valid Dart strings:
 *
 *     'Single quotes';
 *     "Double quotes";
 *     'Double quotes in "single" quotes';
 *     "Single quotes in 'double' quotes";
 *
 *     '''A
 *     multiline
 *     string''';
 *
 *     """
 *     Another
 *     multiline
 *     string""";
 *
 * Strings are immutable. Although you cannot change a string, you can perform
 * an operation on a string and assign the result to a new string:
 *
 *     var string = 'Dart is fun';
 *     var newString = string.substring(0, 5);
 *
 * You can use the plus (`+`) operator to concatenate strings:
 *
 *     'Dart ' + 'is ' + 'fun!'; // 'Dart is fun!'
 *
 * You can also use adjacent string literals for concatenation:
 *
 *     'Dart ' 'is ' 'fun!';    // 'Dart is fun!'
 *
 * You can use `${}` to interpolate the value of Dart expressions
 * within strings. The curly braces can be omitted when evaluating identifiers:
 *
 *     string = 'dartlang';
 *     '$string has ${string.length} letters'; // 'dartlang has 8 letters'
 *
 * A string is represented by a sequence of Unicode UTF-16 code units
 * accessible through the [codeUnitAt] or the [codeUnits] members:
 *
 *     string = 'Dart';
 *     string.codeUnitAt(0); // 68
 *     string.codeUnits;     // [68, 97, 114, 116]
 *
 * The string representation of code units is accessible through the index
 * operator:
 *
 *     string[0];            // 'D'
 *
 * The characters of a string are encoded in UTF-16. Decoding UTF-16, which
 * combines surrogate pairs, yields Unicode code points. Following a similar
 * terminology to Go, we use the name 'rune' for an integer representing a
 * Unicode code point. Use the [runes] property to get the runes of a string:
 *
 *     string.runes.toList(); // [68, 97, 114, 116]
 *
 * For a character outside the Basic Multilingual Plane (plane 0) that is
 * composed of a surrogate pair, [runes] combines the pair and returns a
 * single integer.  For example, the Unicode character for a
 * musical G-clef ('𝄞') with rune value 0x1D11E consists of a UTF-16 surrogate
 * pair: `0xD834` and `0xDD1E`. Using [codeUnits] returns the surrogate pair,
 * and using `runes` returns their combined value:
 *
 *     var clef = '\u{1D11E}';
 *     clef.codeUnits;         // [0xD834, 0xDD1E]
 *     clef.runes.toList();    // [0x1D11E]
 *
 * The String class can not be extended or implemented. Attempting to do so
 * yields a compile-time error.
 *
 * ## Other resources
 *
 * See [StringBuffer] to efficiently build a string incrementally. See
 * [RegExp] to work with regular expressions.
 *
 * Also see:

 * * [Dart Cookbook](https://www.dartlang.org/docs/cookbook/#strings)
 *   for String examples and recipes.
 * * [Dart Up and Running](https://www.dartlang.org/docs/dart-up-and-running/ch03.html#strings-and-regular-expressions)
 */
let DartString = DartString_1 = class DartString {
    constructor(s) {
    }
    static fromJs(s) {
        return new JSString(s);
    }
    valueOf() {
        throw 'abstract';
    }
    /**
     * Allocates a new String for the specified [charCodes].
     *
     * The [charCodes] can be UTF-16 code units or runes. If a char-code value is
     * 16-bit, it is copied verbatim:
     *
     *     new String.fromCharCodes([68]); // 'D'
     *
     * If a char-code value is greater than 16-bits, it is decomposed into a
     * surrogate pair:
     *
     *     var clef = new String.fromCharCodes([0x1D11E]);
     *     clef.codeUnitAt(0); // 0xD834
     *     clef.codeUnitAt(1); // 0xDD1E
     *
     * If [start] and [end] is provided, only the values of [charCodes]
     * at positions from `start` to, but not including, `end`, are used.
     * The `start` and `end` values must satisfy
     * `0 <= start <= end <= charCodes.length`.
     */
    /*external*/
    static _fromCharCodes(charCodes, start, end) {
        start = nullOr(start, 0);
        if (is(charCodes, JSArray)) {
            return DartString_1._stringFromJSArray(charCodes, start, end);
        }
        if (is(charCodes, Array)) {
            return DartString_1._stringFromUint8List(charCodes, start, end);
        }
        return DartString_1._stringFromIterable(charCodes, start, end);
    }
    /**
     * Allocates a new String for the specified [charCode].
     *
     * If the [charCode] can be represented by a single UTF-16 code unit, the new
     * string contains a single code unit. Otherwise, the [length] is 2 and
     * the code units form a surrogate pair. See documentation for
     * [fromCharCodes].
     *
     * Creating a String with half of a surrogate pair is allowed.
     */
    static _fromCharCode(charCode) {
        return new DartString_1(DartPrimitives.stringFromCharCode(charCode));
    }
    /**
     * Returns the string value of the environment declaration [name].
     *
     * Environment declarations are provided by the surrounding system compiling
     * or running the Dart program. Declarations map a string key to a string
     * value.
     *
     * If [name] is not declared in the environment, the result is instead
     * [defaultValue].
     *
     * Example of getting a value:
     *
     *     const String.fromEnvironment("defaultFloo", defaultValue: "no floo")
     *
     * Example of checking whether a declaration is there at all:
     *
     *     var isDeclared = const String.fromEnvironment("maybeDeclared") != null;
     */
    // The .fromEnvironment() constructors are special in that we do not want
    // users to call them using "new". We prohibit that by giving them bodies
    // that throw, even though const constructors are not allowed to have bodies.
    // Disable those static errors.
    //ignore: const_constructor_with_body
    //ignore: const_factory
    static _fromEnvironment(name, _) {
        throw new UnsupportedError('String.fromEnvironment can only be used as a const constructor');
    }
    /**
     * Gets the character (as a single-code-unit [String]) at the given [index].
     *
     * The returned string represents exactly one UTF-16 code unit, which may be
     * half of a surrogate pair. A single member of a surrogate pair is an
     * invalid UTF-16 string:
     *
     *     var clef = '\u{1D11E}';
     *     // These represent invalid UTF-16 strings.
     *     clef[0].codeUnits;      // [0xD834]
     *     clef[1].codeUnits;      // [0xDD1E]
     *
     * This method is equivalent to
     * `new String.fromCharCode(this.codeUnitAt(index))`.
     */
    charAt(index) {
        throw 'abstract';
    }
    /**
     * Returns the 16-bit UTF-16 code unit at the given [index].
     */
    codeUnitAt(index) {
        throw 'abstract';
    }
    /**
     * The length of the string.
     *
     * Returns the number of UTF-16 code units in this string. The number
     * of [runes] might be fewer, if the string contains characters outside
     * the Basic Multilingual Plane (plane 0):
     *
     *     'Dart'.length;          // 4
     *     'Dart'.runes.length;    // 4
     *
     *     var clef = '\u{1D11E}';
     *     clef.length;            // 2
     *     clef.runes.length;      // 1
     */
    get length() {
        throw 'abstract';
    }
    /**
     * Returns a hash code derived from the code units of the string.
     *
     * This is compatible with [==]. Strings with the same sequence
     * of code units have the same hash code.
     */
    get hashCode() {
        throw 'abstract';
    }
    /**
     * Returns true if other is a `String` with the same sequence of code units.
     *
     * This method compares each individual code unit of the strings.
     * It does not check for Unicode equivalence.
     * For example, both the following strings represent the string 'Amélie',
     * but due to their different encoding, are not equal:
     *
     *     'Am\xe9lie' == 'Ame\u{301}lie'; // false
     *
     * The first string encodes 'é' as a single unicode code unit (also
     * a single rune), whereas the second string encodes it as 'e' with the
     * combining accent character '◌́'.
     */
    equals(other) {
        throw 'abstract';
    }
    /**
     * Returns true if this string ends with [other]. For example:
     *
     *     'Dart'.endsWith('t'); // true
     */
    endsWith(other) {
        throw 'abstract';
    }
    /**
     * Returns true if this string starts with a match of [pattern].
     *
     *     var string = 'Dart';
     *     string.startsWith('D');                       // true
     *     string.startsWith(new RegExp(r'[A-Z][a-z]')); // true
     *
     * If [index] is provided, this method checks if the substring starting
     * at that index starts with a match of [pattern]:
     *
     *     string.startsWith('art', 1);                  // true
     *     string.startsWith(new RegExp(r'\w{3}'));      // true
     *
     * [index] must not be negative or greater than [length].
     *
     * A [RegExp] containing '^' does not match if the [index] is greater than
     * zero. The pattern works on the string as a whole, and does not extract
     * a substring starting at [index] first:
     *
     *     string.startsWith(new RegExp(r'^art'), 1);    // false
     *     string.startsWith(new RegExp(r'art'), 1);     // true
     */
    startsWith(pattern, index) {
        throw 'abstract';
    }
    /**
     * Returns the position of the first match of [pattern] in this string,
     * starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.indexOf('art');                     // 1
     *     string.indexOf(new RegExp(r'[A-Z][a-z]')); // 0
     *
     * Returns -1 if no match is found:
     *
     *     string.indexOf(new RegExp(r'dart'));       // -1
     *
     * [start] must be non-negative and not greater than [length].
     */
    indexOf(pattern, start) {
        throw 'abstract';
    }
    /**
     * Returns the position of the last match [pattern] in this string, searching
     * backward starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.lastIndexOf('a');                    // 6
     *     string.lastIndexOf(new RegExp(r'a(r|n)'));  // 6
     *
     * Returns -1 if [pattern] could not be found in this string.
     *
     *     string.lastIndexOf(new RegExp(r'DART'));    // -1
     *
     * The [start] must be non-negative and not greater than [length].
     */
    lastIndexOf(pattern, start) {
        throw 'abstract';
    }
    /**
     * Returns true if this string is empty.
     */
    get isEmpty() {
        throw 'abstract';
    }
    /**
     * Returns true if this string is not empty.
     */
    get isNotEmpty() {
        throw 'abstract';
    }
    /**
     * Creates a new string by concatenating this string with [other].
     *
     *     'dart' + 'lang'; // 'dartlang'
     */
    concat(other) {
        throw 'abstract';
    }
    /**
     * Returns the substring of this string that extends from [startIndex],
     * inclusive, to [endIndex], exclusive.
     *
     *     var string = 'dartlang';
     *     string.substring(1);    // 'artlang'
     *     string.substring(1, 4); // 'art'
     */
    substring(startIndex, endIndex) {
        throw 'abstract';
    }
    /**
     * Returns the string without any leading and trailing whitespace.
     *
     * If the string contains leading or trailing whitespace, a new string with no
     * leading and no trailing whitespace is returned:
     *
     *     '\tDart is fun\n'.trim(); // 'Dart is fun'
     *
     * Otherwise, the original string itself is returned:
     *
     *     var str1 = 'Dart';
     *     var str2 = str1.trim();
     *     identical(str1, str2);    // true
     *
     * Whitespace is defined by the Unicode White_Space property (as defined in
     * version 6.2 or later) and the BOM character, 0xFEFF.
     *
     * Here is the list of trimmed characters (following version 6.2):
     *
     *     0009..000D    ; White_Space # Cc   <control-0009>..<control-000D>
     *     0020          ; White_Space # Zs   SPACE
     *     0085          ; White_Space # Cc   <control-0085>
     *     00A0          ; White_Space # Zs   NO-BREAK SPACE
     *     1680          ; White_Space # Zs   OGHAM SPACE MARK
     *     180E          ; White_Space # Zs   MONGOLIAN VOWEL SEPARATOR
     *     2000..200A    ; White_Space # Zs   EN QUAD..HAIR SPACE
     *     2028          ; White_Space # Zl   LINE SEPARATOR
     *     2029          ; White_Space # Zp   PARAGRAPH SEPARATOR
     *     202F          ; White_Space # Zs   NARROW NO-BREAK SPACE
     *     205F          ; White_Space # Zs   MEDIUM MATHEMATICAL SPACE
     *     3000          ; White_Space # Zs   IDEOGRAPHIC SPACE
     *
     *     FEFF          ; BOM                ZERO WIDTH NO_BREAK SPACE
     */
    trim() {
        throw 'abstract';
    }
    /**
     * Returns the string without any leading whitespace.
     *
     * As [trim], but only removes leading whitespace.
     */
    trimLeft() {
        throw 'abstract';
    }
    /**
     * Returns the string without any trailing whitespace.
     *
     * As [trim], but only removes trailing whitespace.
     */
    trimRight() {
        throw 'abstract';
    }
    /**
     * Creates a new string by concatenating this string with itself a number
     * of times.
     *
     * The result of `str * n` is equivalent to
     * `str + str + ...`(n times)`... + str`.
     *
     * Returns an empty string if [times] is zero or negative.
     */
    repeat(times) {
        throw 'abstract';
    }
    /**
     * Pads this string on the left if it is shorter than [width].
     *
     * Return a new string that prepends [padding] onto this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    padLeft(width, padding) {
        throw 'abstract';
    }
    /**
     * Pads this string on the right if it is shorter than [width].
     *
     * Return a new string that appends [padding] after this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    padRight(width, padding) {
        throw 'abstract';
    }
    /**
     * Returns true if this string contains a match of [other]:
     *
     *     var string = 'Dart strings';
     *     string.contains('D');                     // true
     *     string.contains(new RegExp(r'[A-Z]'));    // true
     *
     * If [startIndex] is provided, this method matches only at or after that
     * index:
     *
     *     string.contains('X', 1);                  // false
     *     string.contains(new RegExp(r'[A-Z]'), 1); // false
     *
     * [startIndex] must not be negative or greater than [length].
     */
    contains(other, startIndex) {
        throw 'abstract';
    }
    /**
     * Returns a new string in which the first occurrence of [from] in this string
     * is replaced with [to], starting from [startIndex]:
     *
     *     '0.0001'.replaceFirst(new RegExp(r'0'), ''); // '.0001'
     *     '0.0001'.replaceFirst(new RegExp(r'0'), '7', 1); // '0.7001'
     */
    replaceFirst(from, to, startIndex) {
        throw 'abstract';
    }
    /**
     * Replace the first occurrence of [from] in this string.
     *
     * Returns a new string, which is this string
     * except that the first match of [from], starting from [startIndex],
     * is replaced by the result of calling [replace] with the match object.
     *
     * The optional [startIndex] is by default set to 0. If provided, it must be
     * an integer in the range `[0 .. len]`, where `len` is this string's length.
     *
     * If the value returned by calling `replace` is not a [String], it
     * is converted to a `String` using its `toString` method, which must
     * then return a string.
     */
    replaceFirstMapped(from, replace, startIndex) {
        throw 'abstract';
    }
    /**
     * Replaces all substrings that match [from] with [replace].
     *
     * Returns a new string in which the non-overlapping substrings matching
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the literal string [replace].
     *
     *     'resume'.replaceAll(new RegExp(r'e'), 'é'); // 'résumé'
     *
     * Notice that the [replace] string is not interpreted. If the replacement
     * depends on the match (for example on a [RegExp]'s capture groups), use
     * the [replaceAllMapped] method instead.
     */
    replaceAll(from, replace) {
        throw 'abstract';
    }
    /**
     * Replace all substrings that match [from] by a string computed from the
     * match.
     *
     * Returns a new string in which the non-overlapping substrings that match
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the result of calling [replace] on the corresponding [Match] object.
     *
     * This can be used to replace matches with new content that depends on the
     * match, unlike [replaceAll] where the replacement string is always the same.
     *
     * The [replace] function is called with the [Match] generated
     * by the pattern, and its result is used as replacement.
     *
     * The function defined below converts each word in a string to simplified
     * 'pig latin' using [replaceAllMapped]:
     *
     *     pigLatin(String words) => words.replaceAllMapped(
     *         new RegExp(r'\b(\w*?)([aeiou]\w*)', caseSensitive: false),
     *         (Match m) => "${m[2]}${m[1]}${m[1].isEmpty ? 'way' : 'ay'}");
     *
     *     pigLatin('I have a secret now!'); // 'Iway avehay away ecretsay ownay!'
     */
    replaceAllMapped(from, replace) {
        throw 'abstract';
    }
    /**
     * Replaces the substring from [start] to [end] with [replacement].
     *
     * Returns a new string equivalent to:
     *
     *     this.substring(0, start) + replacement + this.substring(end)
     *
     * The [start] and [end] indices must specify a valid range of this string.
     * That is `0 <= start <= end <= this.length`.
     * If [end] is `null`, it defaults to [length].
     */
    replaceRange(start, end, replacement) {
        throw 'abstract';
    }
    /**
     * Splits the string at matches of [pattern] and returns a list of substrings.
     *
     * Finds all the matches of `pattern` in this string,
     * and returns the list of the substrings between the matches.
     *
     *     var string = "Hello world!";
     *     string.split(" ");                      // ['Hello', 'world!'];
     *
     * Empty matches at the beginning and end of the strings are ignored,
     * and so are empty matches right after another match.
     *
     *     var string = "abba";
     *     string.split(new RegExp(r"b*"));        // ['a', 'a']
     *                                             // not ['', 'a', 'a', '']
     *
     * If this string is empty, the result is an empty list if `pattern` matches
     * the empty string, and it is `[""]` if the pattern doesn't match.
     *
     *     var string = '';
     *     string.split('');                       // []
     *     string.split("a");                      // ['']
     *
     * Splitting with an empty pattern splits the string into single-code unit
     * strings.
     *
     *     var string = 'Pub';
     *     string.split('');                       // ['P', 'u', 'b']
     *
     *     string.codeUnits.map((unit) {
     *       return new String.fromCharCode(unit);
     *     }).toList();                            // ['P', 'u', 'b']
     *
     * Splitting happens at UTF-16 code unit boundaries,
     * and not at rune boundaries:
     *
     *     // String made up of two code units, but one rune.
     *     string = '\u{1D11E}';
     *     string.split('').length;                 // 2 surrogate values
     *
     * To get a list of strings containing the individual runes of a string,
     * you should not use split. You can instead map each rune to a string
     * as follows:
     *
     *     string.runes.map((rune) => new String.fromCharCode(rune)).toList();
     */
    split(pattern) {
        throw 'abstract';
    }
    /**
     * Splits the string, converts its parts, and combines them into a new
     * string.
     *
     * [pattern] is used to split the string into parts and separating matches.
     *
     * Each match is converted to a string by calling [onMatch]. If [onMatch]
     * is omitted, the matched string is used.
     *
     * Each non-matched part is converted by a call to [onNonMatch]. If
     * [onNonMatch] is omitted, the non-matching part is used.
     *
     * Then all the converted parts are combined into the resulting string.
     *
     *     'Eats shoots leaves'.splitMapJoin((new RegExp(r'shoots')),
     *         onMatch:    (m) => '${m.group(0)}',
     *         onNonMatch: (n) => '*'); // *shoots*
     */
    splitMapJoin(pattern, _) {
        throw 'abstract';
    }
    /**
     * Returns an unmodifiable list of the UTF-16 code units of this string.
     */
    get codeUnits() {
        throw 'abstract';
    }
    /**
     * Returns an [Iterable] of Unicode code-points of this string.
     *
     * If the string contains surrogate pairs, they are combined and returned
     * as one integer by this iterator. Unmatched surrogate halves are treated
     * like valid 16-bit code-units.
     */
    get runes() {
        throw 'abstract';
    }
    /**
     * Converts all characters in this string to lower case.
     * If the string is already in all lower case, this method returns [:this:].
     *
     *     'ALPHABET'.toLowerCase(); // 'alphabet'
     *     'abc'.toLowerCase();      // 'abc'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    // TODO(floitsch): document better. (See EcmaScript for description).
    toLowerCase() {
        throw 'abstract';
    }
    /**
     * Converts all characters in this string to upper case.
     * If the string is already in all upper case, this method returns [:this:].
     *
     *     'alphabet'.toUpperCase(); // 'ALPHABET'
     *     'ABC'.toUpperCase();      // 'ABC'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    // TODO(floitsch): document better. (See EcmaScript for description).
    toUpperCase() {
        throw 'abstract';
    }
    allMatches(string, start) {
        return undefined;
    }
    compareTo(other) {
        return undefined;
    }
    matchAsPrefix(string, start) {
        return undefined;
    }
    static _stringFromJSArray(list, start, endOrNull) {
        let len = list.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        if (start > 0 || end < len) {
            list = list.sublist(start, end);
        }
        return new DartString_1(DartPrimitives.stringFromCharCodes(list));
    }
    static _stringFromUint8List(charCodes, start, endOrNull) {
        let len = charCodes.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        return new DartString_1(DartPrimitives.stringFromNativeUint8List(charCodes, start, end));
    }
    static _stringFromIterable(charCodes, start, end) {
        if (start < 0)
            throw new RangeError.range(start, 0, charCodes.length);
        if (end != null && end < start) {
            throw new RangeError.range(end, start, charCodes.length);
        }
        let it = charCodes.iterator;
        for (let i = 0; i < start; i++) {
            if (!it.moveNext()) {
                throw new RangeError.range(start, 0, i);
            }
        }
        let list = new DartList();
        if (end == null) {
            while (it.moveNext())
                list.add(it.current);
        }
        else {
            for (let i = start; i < end; i++) {
                if (!it.moveNext()) {
                    throw new RangeError.range(end, start, i);
                }
                list.add(it.current);
            }
        }
        return new DartString_1(DartPrimitives.stringFromCharCodes(list));
    }
};
__decorate([
    Abstract
], DartString.prototype, "valueOf", null);
__decorate([
    Operator(Op.INDEX),
    Abstract
], DartString.prototype, "charAt", null);
__decorate([
    Abstract
], DartString.prototype, "codeUnitAt", null);
__decorate([
    AbstractProperty
], DartString.prototype, "length", null);
__decorate([
    AbstractProperty
], DartString.prototype, "hashCode", null);
__decorate([
    Operator(Op.EQUALS),
    Abstract
], DartString.prototype, "equals", null);
__decorate([
    Abstract
], DartString.prototype, "endsWith", null);
__decorate([
    Abstract
], DartString.prototype, "startsWith", null);
__decorate([
    Abstract
], DartString.prototype, "indexOf", null);
__decorate([
    Abstract
], DartString.prototype, "lastIndexOf", null);
__decorate([
    AbstractProperty
], DartString.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], DartString.prototype, "isNotEmpty", null);
__decorate([
    Operator(Op.PLUS)
], DartString.prototype, "concat", null);
__decorate([
    Abstract
], DartString.prototype, "substring", null);
__decorate([
    Abstract
], DartString.prototype, "trim", null);
__decorate([
    Abstract
], DartString.prototype, "trimLeft", null);
__decorate([
    Abstract
], DartString.prototype, "trimRight", null);
__decorate([
    Operator(Op.TIMES)
], DartString.prototype, "repeat", null);
__decorate([
    Abstract
], DartString.prototype, "padLeft", null);
__decorate([
    Abstract
], DartString.prototype, "padRight", null);
__decorate([
    Abstract
], DartString.prototype, "contains", null);
__decorate([
    Abstract
], DartString.prototype, "replaceFirst", null);
__decorate([
    Abstract
], DartString.prototype, "replaceFirstMapped", null);
__decorate([
    Abstract
], DartString.prototype, "replaceAll", null);
__decorate([
    Abstract
], DartString.prototype, "replaceAllMapped", null);
__decorate([
    Abstract
], DartString.prototype, "replaceRange", null);
__decorate([
    Abstract
], DartString.prototype, "split", null);
__decorate([
    Abstract
], DartString.prototype, "splitMapJoin", null);
__decorate([
    AbstractProperty
], DartString.prototype, "codeUnits", null);
__decorate([
    AbstractProperty
], DartString.prototype, "runes", null);
__decorate([
    Abstract
], DartString.prototype, "toLowerCase", null);
__decorate([
    Abstract
], DartString.prototype, "toUpperCase", null);
__decorate([
    defaultFactory
], DartString, "fromJs", null);
__decorate([
    namedFactory
], DartString, "_fromCharCodes", null);
__decorate([
    namedFactory
], DartString, "_fromCharCode", null);
__decorate([
    namedFactory
], DartString, "_fromEnvironment", null);
DartString = DartString_1 = __decorate([
    DartClass,
    Implements(DartPattern)
], DartString);
/**
 * The runes (integer Unicode code points) of a [String].
 */
class DartRunes extends DartIterable {
    constructor(_string) {
        super();
    }
    get iterator() {
        return new DartRuneIterator(this._string);
    }
    get last() {
        if (this._string.length == 0) {
            throw new StateError('No elements.');
        }
        let length = this._string.length;
        let code = new DartString(this._string).codeUnitAt(length - 1);
        if (_isTrailSurrogate(code) && this._string.length > 1) {
            let previousCode = new DartString(this._string).codeUnitAt(length - 2);
            if (_isLeadSurrogate(previousCode)) {
                return _combineSurrogatePair(previousCode, code);
            }
        }
        return code;
    }
}
// Is then code (a 16-bit unsigned integer) a UTF-16 lead surrogate.
const _isLeadSurrogate = (code) => (code & 0xFC00) == 0xD800;
// Is then code (a 16-bit unsigned integer) a UTF-16 trail surrogate.
const _isTrailSurrogate = (code) => (code & 0xFC00) == 0xDC00;
// Combine a lead and a trail surrogate value into a single code point.
const _combineSurrogatePair = (start, end) => {
    return 0x10000 + ((start & 0x3FF) << 10) + (end & 0x3FF);
};
/** [Iterator] for reading runes (integer Unicode code points) out of a Dart
 * string.
 */
let DartRuneIterator = class DartRuneIterator {
    /** Create an iterator positioned at the beginning of the string. */
    constructor(_string) {
        this._string = new DartString(_string);
        this._position = 0;
        this._nextPosition = 0;
    }
    /**
     * Create an iterator positioned before the [index]th code unit of the string.
     *
     * When created, there is no [current] value.
     * A [moveNext] will use the rune starting at [index] the current value,
     * and a [movePrevious] will use the rune ending just before [index] as the
     * the current value.
     *
     * The [index] position must not be in the middle of a surrogate pair.
     */
    at(_string, index) {
        this._string = new DartString(_string);
        this._position = index;
        this._nextPosition = index;
        RangeError.checkValueInInterval(index, 0, _string.length);
        this._checkSplitSurrogate(index);
    }
    /** Throw an error if the index is in the middle of a surrogate pair. */
    _checkSplitSurrogate(index) {
        if (index > 0 &&
            index < this._string.length &&
            _isLeadSurrogate(this._string.codeUnitAt(index - 1)) &&
            _isTrailSurrogate(this._string.codeUnitAt(index))) {
            throw new ArgumentError('Index inside surrogate pair: $index');
        }
    }
    /**
     * Returns the starting position of the current rune in the string.
     *
     * Returns null if the [current] rune is null.
     */
    get rawIndex() {
        return ( /*this,*/this._position != this._nextPosition) ? this._position : null;
    }
    /**
     * Resets the iterator to the rune at the specified index of the string.
     *
     * Setting a negative [rawIndex], or one greater than or equal to
     * [:string.length:],
     * is an error. So is setting it in the middle of a surrogate pair.
     *
     * Setting the position to the end of then string will set [current] to null.
     */
    set rawIndex(rawIndex) {
        RangeError.checkValidIndex(rawIndex, this._string, "rawIndex");
        this.reset(rawIndex);
        this.moveNext();
    }
    /**
     * Resets the iterator to the given index into the string.
     *
     * After this the [current] value is unset.
     * You must call [moveNext] make the rune at the position current,
     * or [movePrevious] for the last rune before the position.
     *
     * Setting a negative [rawIndex], or one greater than [:string.length:],
     * is an error. So is setting it in the middle of a surrogate pair.
     */
    reset(rawIndex) {
        rawIndex = nullOr(rawIndex, 0);
        RangeError.checkValueInInterval(rawIndex, 0, this._string.length, "rawIndex");
        this._checkSplitSurrogate(rawIndex);
        this._position = this._nextPosition = rawIndex;
        this._currentCodePoint = null;
    }
    /** The rune (integer Unicode code point) starting at the current position in
     *  the string.
     */
    get current() {
        return this._currentCodePoint;
    }
    /**
     * The number of code units comprising the current rune.
     *
     * Returns zero if there is no current rune ([current] is null).
     */
    get currentSize() {
        return this._nextPosition - this._position;
    }
    /**
     * A string containing the current rune.
     *
     * For runes outside the basic multilingual plane, this will be
     * a String of length 2, containing two code units.
     *
     * Returns null if [current] is null.
     */
    get currentAsString() {
        if (this._position == this._nextPosition)
            return null;
        if (this._position + 1 == this._nextPosition)
            return this._string.charAt(this._position);
        return this._string.substring(this._position, this._nextPosition);
    }
    moveNext() {
        this._position = this._nextPosition;
        if (this._position == this._string.length) {
            this._currentCodePoint = null;
            return false;
        }
        let codeUnit = this._string.codeUnitAt(this._position);
        let nextPosition = this._position + 1;
        if (_isLeadSurrogate(codeUnit) && nextPosition < this._string.length) {
            let nextCodeUnit = this._string.codeUnitAt(nextPosition);
            if (_isTrailSurrogate(nextCodeUnit)) {
                this._nextPosition = nextPosition + 1;
                this._currentCodePoint = _combineSurrogatePair(codeUnit, nextCodeUnit);
                return true;
            }
        }
        this._nextPosition = nextPosition;
        this._currentCodePoint = codeUnit;
        return true;
    }
    movePrevious() {
        this._nextPosition = this._position;
        if (this._position == 0) {
            this._currentCodePoint = null;
            return false;
        }
        let position = this._position - 1;
        let codeUnit = this._string.codeUnitAt(position);
        if (_isTrailSurrogate(codeUnit) && position > 0) {
            let prevCodeUnit = this._string.codeUnitAt(position - 1);
            if (_isLeadSurrogate(prevCodeUnit)) {
                this._position = position - 1;
                this._currentCodePoint = _combineSurrogatePair(prevCodeUnit, codeUnit);
                return true;
            }
        }
        this._position = position;
        this._currentCodePoint = codeUnit;
        return true;
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
};
__decorate([
    namedConstructor
], DartRuneIterator.prototype, "at", null);
DartRuneIterator = __decorate([
    DartClass
], DartRuneIterator);
/**
 * The interceptor class for [String]. The compiler recognizes this
 * class as an interceptor, and changes references to [:this:] to
 * actually use the receiver of the method, which is generated as an extra
 * argument added to each member.
 */
let JSString = JSString_1 = class JSString extends String {
    constructor(s) {
        super(s);
    }
    equals(other) {
        return this == other;
    }
    codeUnitAt(index) {
        if (isNot(index, 'int'))
            throw diagnoseIndexError(this, index);
        if (index < 0)
            throw diagnoseIndexError(this, index);
        return this._codeUnitAt(index);
    }
    _codeUnitAt(index) {
        if (index >= this.length)
            throw diagnoseIndexError(this, index);
        return super.charCodeAt(index) /* JS('JSUInt31', r'#.charCodeAt(#)', this, index)*/;
    }
    allMatches(string, start) {
        start = nullOr(start, 0);
        checkString(string);
        checkInt(start);
        if (0 > start || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        return allMatchesInStringUnchecked(this, string, start);
    }
    matchAsPrefix(string, start) {
        start = nullOr(start, 0);
        if (start < 0 || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        if (start + this.length > string.length)
            return null;
        // TODO(lrn): See if this can be optimized.
        for (let i = 0; i < this.length; i++) {
            if (new DartString(string).codeUnitAt(start + i) != this.codeUnitAt(i)) {
                return null;
            }
        }
        return new DartStringMatch(start, string, this);
    }
    concat(other) {
        if (isNot(other, 'string'))
            throw new ArgumentError.value(other);
        return this + other;
        /* JS('String', r'# + #', this, other)*/
    }
    endsWith(other) {
        checkString(other);
        let otherLength = other.length;
        if (otherLength > this.length)
            return false;
        return other == this.substring(this.length - otherLength);
    }
    replaceAll(from, to) {
        checkString(to);
        return stringReplaceAllUnchecked(this.valueOf(), from, to);
    }
    replaceAllMapped(from, convert) {
        return this.splitMapJoin(from, { onMatch: convert });
    }
    splitMapJoin(from, _) {
        let { onMatch, onNonMatch } = Object.assign({}, _);
        return stringReplaceAllFuncUnchecked(this.valueOf(), from, onMatch, onNonMatch);
    }
    replaceFirst(from, to, startIndex) {
        startIndex = nullOr(startIndex, 0);
        checkString(to);
        checkInt(startIndex);
        RangeError.checkValueInInterval(startIndex, 0, this.length, "startIndex");
        return stringReplaceFirstUnchecked(this.valueOf(), from, to, startIndex);
    }
    replaceFirstMapped(from, replace, startIndex) {
        startIndex = nullOr(startIndex, 0);
        checkNull(replace);
        checkInt(startIndex);
        RangeError.checkValueInInterval(startIndex, 0, this.length, "startIndex");
        return stringReplaceFirstMappedUnchecked(this.valueOf(), from, replace, startIndex);
    }
    split(pattern) {
        // handle default case
        if (pattern[Symbol.split] != null)
            return new DartList.fromArray(super.split(pattern));
        checkNull(pattern);
        if (is(pattern, DartString)) {
            return new DartList.fromArray(super.split(pattern)) /*JS('JSExtendableArray', r'#.split(#)', this, pattern)*/;
        }
        else if (is(pattern, JSSyntaxRegExp) && regExpCaptureCount(pattern) == 0) {
            let re = regExpGetNative(pattern);
            return new DartList.fromArray(super.split(re)) /*JS('JSExtendableArray', r'#.split(#)', this, re)*/;
        }
        else {
            return this._defaultSplit(pattern);
        }
    }
    replaceRange(start, end, replacement) {
        checkString(replacement);
        checkInt(start);
        end = RangeError.checkValidRange(start, end, this.length);
        checkInt(end);
        return stringReplaceRangeUnchecked(this.valueOf(), start, end, replacement);
    }
    _defaultSplit(pattern) {
        let result = new DartList();
        // End of most recent match. That is, start of next part to add to result.
        let start = 0;
        // Length of most recent match.
        // Set >0, so no match on the empty string causes the result to be [""].
        let length = 1;
        for (let match of pattern.allMatches(this.valueOf())) {
            let matchStart = match.start;
            let matchEnd = match.end;
            length = matchEnd - matchStart;
            if (length == 0 && start == matchStart) {
                // An empty match right after another match is ignored.
                // This includes an empty match at the start of the string.
                continue;
            }
            let end = matchStart;
            result.add(this.substring(start, end));
            start = matchEnd;
        }
        if (start < this.length || length > 0) {
            // An empty match at the end of the string does not cause a "" at the end.
            // A non-empty match ending at the end of the string does add a "".
            result.add(this.substring(start));
        }
        return result;
    }
    startsWith(pattern, index) {
        index = nullOr(index, 0);
        checkInt(index);
        if (index < 0 || index > this.length) {
            throw new RangeError.range(index, 0, this.length);
        }
        if (is(pattern, DartString) || is(pattern, 'string')) {
            let other = pattern;
            let otherLength = other.length;
            let endIndex = index + otherLength;
            if (endIndex > this.length)
                return false;
            // this should work because of the way js handles == ... maybe
            return other.valueOf() == super.substring(index, endIndex) /*JS('String', r'#.substring(#, #)', this, index, endIndex)*/;
        }
        return pattern.matchAsPrefix(this.valueOf(), index) != null;
    }
    substring(startIndex, endIndex) {
        checkInt(startIndex);
        if (endIndex == null)
            endIndex = this.length;
        checkInt(endIndex);
        if (startIndex < 0)
            throw new RangeError.value(startIndex);
        if (startIndex > endIndex)
            throw new RangeError.value(startIndex);
        if (endIndex > this.length)
            throw new RangeError.value(endIndex);
        return super.substring(startIndex, endIndex) /*JS('String', r'#.substring(#, #)', this, startIndex, endIndex)*/;
    }
    toLowerCase() {
        return super.toLowerCase() /* JS('returns:String;effects:none;depends:none;throws:null(1)',
        r'#.toLowerCase()', this)*/;
    }
    toUpperCase() {
        return super.toUpperCase();
        /*JS('returns:String;effects:none;depends:none;throws:null(1)',
               r'#.toUpperCase()', this);*/
    }
    // Characters with Whitespace property (Unicode 6.3).
    // 0009..000D    ; White_Space # Cc       <control-0009>..<control-000D>
    // 0020          ; White_Space # Zs       SPACE
    // 0085          ; White_Space # Cc       <control-0085>
    // 00A0          ; White_Space # Zs       NO-BREAK SPACE
    // 1680          ; White_Space # Zs       OGHAM SPACE MARK
    // 2000..200A    ; White_Space # Zs       EN QUAD..HAIR SPACE
    // 2028          ; White_Space # Zl       LINE SEPARATOR
    // 2029          ; White_Space # Zp       PARAGRAPH SEPARATOR
    // 202F          ; White_Space # Zs       NARROW NO-BREAK SPACE
    // 205F          ; White_Space # Zs       MEDIUM MATHEMATICAL SPACE
    // 3000          ; White_Space # Zs       IDEOGRAPHIC SPACE
    //
    // BOM: 0xFEFF
    static _isWhitespace(codeUnit) {
        // Most codeUnits should be less than 256. Special case with a smaller
        // switch.
        if (codeUnit < 256) {
            switch (codeUnit) {
                case 0x09:
                case 0x0A:
                case 0x0B:
                case 0x0C:
                case 0x0D:
                case 0x20:
                case 0x85:
                case 0xA0:
                    return true;
                default:
                    return false;
            }
        }
        switch (codeUnit) {
            case 0x1680:
            case 0x2000:
            case 0x2001:
            case 0x2002:
            case 0x2003:
            case 0x2004:
            case 0x2005:
            case 0x2006:
            case 0x2007:
            case 0x2008:
            case 0x2009:
            case 0x200A:
            case 0x2028:
            case 0x2029:
            case 0x202F:
            case 0x205F:
            case 0x3000:
            case 0xFEFF:
                return true;
            default:
                return false;
        }
    }
    /// Finds the index of the first non-whitespace character, or the
    /// end of the string. Start looking at position [index].
    static _skipLeadingWhitespace(string, index) {
        const SPACE = 0x20;
        const CARRIAGE_RETURN = 0x0D;
        while (index < string.length) {
            let codeUnit = string.codeUnitAt(index);
            if (codeUnit != SPACE &&
                codeUnit != CARRIAGE_RETURN &&
                !JSString_1._isWhitespace(codeUnit)) {
                break;
            }
            index++;
        }
        return index;
    }
    /// Finds the index after the last non-whitespace character, or 0.
    /// Start looking at position [index - 1].
    static _skipTrailingWhitespace(string, index) {
        const SPACE = 0x20;
        const CARRIAGE_RETURN = 0x0D;
        while (index > 0) {
            let codeUnit = string.codeUnitAt(index - 1);
            if (codeUnit != SPACE &&
                codeUnit != CARRIAGE_RETURN &&
                !JSString_1._isWhitespace(codeUnit)) {
                break;
            }
            index--;
        }
        return index;
    }
    // Dart2js can't use JavaScript trim directly,
    // because JavaScript does not trim
    // the NEXT LINE (NEL) character (0x85).
    trim() {
        const NEL = 0x85;
        // Start by doing JS trim. Then check if it leaves a NEL at
        // either end of the string.
        let result = new DartString(super.trim()) /* JS('String', '#.trim()', this)*/;
        if (result.length == 0)
            return result.valueOf();
        let firstCode = result.codeUnitAt(0);
        let startIndex = 0;
        if (firstCode == NEL) {
            startIndex = JSString_1._skipLeadingWhitespace(result, 1);
            if (startIndex == result.length)
                return "";
        }
        let endIndex = result.length;
        // We know that there is at least one character that is non-whitespace.
        // Therefore we don't need to verify that endIndex > startIndex.
        let lastCode = result.codeUnitAt(endIndex - 1);
        if (lastCode == NEL) {
            endIndex = JSString_1._skipTrailingWhitespace(result, endIndex - 1);
        }
        if (startIndex == 0 && endIndex == result.length)
            return result.valueOf();
        return result.valueOf().substring(startIndex, endIndex) /* JS('String', r'#.substring(#, #)', result, startIndex, endIndex)*/;
    }
    // Dart2js can't use JavaScript trimLeft directly,
    // because it is not in ES5, so not every browser implements it,
    // and because those that do will not trim the NEXT LINE character (0x85).
    trimLeft() {
        const NEL = 0x85;
        // Start by doing JS trim. Then check if it leaves a NEL at
        // the beginning of the string.
        let result;
        let startIndex = 0;
        /*if (JS('bool', 'typeof #.trimLeft != "undefined"', this)) {
            result = JS('String', '#.trimLeft()', this);
            if (result.length == 0) return result;
            int firstCode = result.codeUnitAt(0);
            if (firstCode == NEL) {
                startIndex = _skipLeadingWhitespace(result, 1);
            }
        } else {*/
        result = this;
        startIndex = JSString_1._skipLeadingWhitespace(this, 0);
        /*}*/
        if (startIndex == 0)
            return result.valueOf();
        if (startIndex == result.length)
            return "";
        return result.substring(startIndex) /* JS('String', r'#.substring(#)', result, startIndex)*/;
    }
    // Dart2js can't use JavaScript trimRight directly,
    // because it is not in ES5 and because JavaScript does not trim
    // the NEXT LINE character (0x85).
    trimRight() {
        const NEL = 0x85;
        // Start by doing JS trim. Then check if it leaves a NEL or BOM at
        // the end of the string.
        let result;
        let endIndex;
        // trimRight is implemented by Firefox and Chrome/Blink,
        // so use it if it is there.
        /*if (JS('bool', 'typeof #.trimRight != "undefined"', this)) {
            result = JS('String', '#.trimRight()', this);
            endIndex = result.length;
            if (endIndex == 0) return result;
            int lastCode = result.codeUnitAt(endIndex - 1);
            if (lastCode == NEL) {
                endIndex = _skipTrailingWhitespace(result, endIndex - 1);
            }
        } else {*/
        result = this;
        endIndex = JSString_1._skipTrailingWhitespace(this, this.length);
        // }
        if (endIndex == result.length)
            return result.valueOf();
        if (endIndex == 0)
            return "";
        return result.substring(0, endIndex) /*JS('String', r'#.substring(#, #)', result, 0, endIndex)*/;
    }
    repeat(times) {
        return super.repeat(times);
        /*
    if (0 >= times) return ''; // Unnecessary but hoists argument type check.
    if (times == 1 || this.length == 0) return this;
    if (times != JS('JSUInt32', '# >>> 0', times)) {
        // times >= 2^32. We can't create a string that big.
        throw const OutOfMemoryError();
    }
    var result = '';
    var s = this;
    while (true) {
        if (times & 1 == 1) result = s + result;
        times = JS('JSUInt31', '# >>> 1', times);
        if (times == 0) break;
        s += s;
    }
    return result;*/
    }
    padLeft(width, padding /*= ' '*/) {
        padding = nullOr(padding, ' ');
        let delta = width - this.length;
        if (delta <= 0)
            return this.valueOf();
        return padding.repeat(delta) + this;
    }
    padRight(width, padding /*= ' '*/) {
        let delta = width - this.length;
        if (delta <= 0)
            return this.valueOf();
        return this + padding.repeat(delta);
    }
    get codeUnits() {
        return new DartCodeUnits(this);
    }
    get runes() {
        return new DartRunes(this.valueOf());
    }
    indexOf(pattern, start) {
        start = nullOr(start, 0);
        checkNull(pattern);
        if (isNot(start, 'int'))
            throw argumentErrorValue(start);
        if (start < 0 || start > this.length) {
            throw new RangeError.range(start, 0, this.length);
        }
        if (is(pattern, 'string')) {
            return stringIndexOfStringUnchecked(this.valueOf(), pattern, start);
        }
        if (is(pattern, JSSyntaxRegExp)) {
            let re = pattern;
            let match = firstMatchAfter(re, this.valueOf(), start);
            return (match == null) ? -1 : match.start;
        }
        for (let i = start; i <= this.length; i++) {
            if (pattern.matchAsPrefix(this.valueOf(), i) != null)
                return i;
        }
        return -1;
    }
    lastIndexOf(pattern, start) {
        checkNull(pattern);
        if (start == null) {
            start = this.length;
        }
        else if (isNot(start, 'int')) {
            throw argumentErrorValue(start);
        }
        else if (start < 0 || start > this.length) {
            throw new RangeError.range(start, 0, this.length);
        }
        if (is(pattern, 'string')) {
            let other = pattern;
            if (start + other.length > this.length) {
                start = this.length - other.length;
            }
            return stringLastIndexOfUnchecked(this.valueOf(), other, start);
        }
        for (let i = start; i >= 0; i--) {
            if (pattern.matchAsPrefix(this.valueOf(), i) != null)
                return i;
        }
        return -1;
    }
    contains(other, startIndex) {
        startIndex = nullOr(startIndex, 0);
        checkNull(other);
        if (startIndex < 0 || startIndex > this.length) {
            throw new RangeError.range(startIndex, 0, this.length);
        }
        return stringContainsUnchecked(this, other, startIndex);
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return !this.isEmpty;
    }
    compareTo(other) {
        if (isNot(other, 'string') && isNot(other, DartString))
            throw argumentErrorValue(other);
        return this == other ? 0 : this < other /*JS('bool', r'# < #', this, other)*/ ? -1 : 1;
    }
    // Note: if you change this, also change the function [S].
    toString() {
        return this.valueOf();
    }
    /**
     * This is the [Jenkins hash function][1] but using masking to keep
     * values in SMI range.
     *
     * [1]: http://en.wikipedia.org/wiki/Jenkins_hash_function
     */
    get hashCode() {
        // TODO(ahe): This method shouldn't have to use JS. Update when our
        // optimizations are smarter.
        let hash = 0;
        for (let i = 0; i < this.length; i++) {
            hash = 0x1fffffff & (hash + this.charCodeAt(i) /* JS('int', r'#.charCodeAt(#)', this, i)*/);
            hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
            hash = hash ^ hash >> 6 /*JS('int', '# ^ (# >> 6)', hash, hash)*/;
        }
        hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
        hash = hash ^ hash >> 11 /*JS('int', '# ^ (# >> 11)', hash, hash)*/;
        return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
    }
    //get runtimeType:Type => String;
    //int get length => JS('int', r'#.length', this);
    charAt(index) {
        if (isNot(index, 'int'))
            throw diagnoseIndexError(this, index);
        if (index >= this.length || index < 0)
            throw diagnoseIndexError(this, index);
        return super[index] /*JS('String', '#[#]', this, index)*/;
    }
};
__decorate([
    Operator(Op.PLUS)
], JSString.prototype, "concat", null);
JSString = JSString_1 = __decorate([
    DartClass,
    Implements(DartString)
], JSString);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of _js_helper;
function stringIndexOfStringUnchecked(receiver, other, startIndex) {
    return receiver.indexOf(other, startIndex) /* JS('int', '#.indexOf(#, #)', receiver, other, startIndex)*/;
}
function substring1Unchecked(receiver, startIndex) {
    return receiver.substring(startIndex) /* JS('String', '#.substring(#)', receiver, startIndex)*/;
}
function substring2Unchecked(receiver, startIndex, endIndex) {
    return receiver.substring(startIndex, endIndex) /*JS('String', '#.substring(#, #)', receiver, startIndex, endIndex)*/;
}
function stringContainsStringUnchecked(receiver, other, startIndex) {
    return stringIndexOfStringUnchecked(receiver, other, startIndex) >= 0;
}
class DartStringMatch {
    constructor(start, input, pattern) {
        this.start = start;
        this.input = input;
        this.pattern = pattern;
    }
    get end() {
        return this.start + this.pattern.length;
    }
    get groupCount() {
        return 0;
    }
    group(group_) {
        if (group_ != 0) {
            throw new RangeError.value(group_);
        }
        return this.pattern.valueOf();
    }
    groups(groups_) {
        let result = new DartList();
        for (let g of groups_) {
            result.add(this.group(g));
        }
        return result;
    }
}
__decorate([
    Operator(Op.INDEX)
], DartStringMatch.prototype, "group", null);
function allMatchesInStringUnchecked(pattern, string, startIndex) {
    return new _StringAllMatchesIterable(string, pattern, startIndex);
}
class _StringAllMatchesIterable extends DartIterable {
    constructor(_input, _pattern, _index) {
        super();
        this._input = _input;
        this._pattern = _pattern;
        this._index = _index;
    }
    get iterator() {
        return new _StringAllMatchesIterator(this._input, this._pattern, this._index);
    }
    get first() {
        let index = stringIndexOfStringUnchecked(this._input, this._pattern.valueOf(), this._index);
        if (index >= 0) {
            return new DartStringMatch(index, this._input, this._pattern);
        }
        throw DartIterableElementError.noElement();
    }
}
class _StringAllMatchesIterator {
    constructor(_input, _pattern, _index) {
        this._input = _input;
        this._pattern = _pattern;
        this._index = _index;
    }
    moveNext() {
        if (this._index + this._pattern.length > this._input.length) {
            this._current = null;
            return false;
        }
        let index = stringIndexOfStringUnchecked(this._input, this._pattern.valueOf(), this._index);
        if (index < 0) {
            this._index = this._input.length + 1;
            this._current = null;
            return false;
        }
        let end = index + this._pattern.length;
        this._current = new DartStringMatch(index, this._input, this._pattern);
        // Empty match, don't start at same location again.
        if (end == this._index)
            end++;
        this._index = end;
        return true;
    }
    get current() {
        return this._current;
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
function stringContainsUnchecked(receiver, other, startIndex) {
    if (is(other, 'string')) {
        return stringContainsStringUnchecked(receiver, other, startIndex);
    }
    else if (is(other, JSSyntaxRegExp)) {
        return other.hasMatch(receiver.substring(startIndex));
    }
    else {
        let substr = receiver.substring(startIndex);
        return other.allMatches(substr).isNotEmpty;
    }
}
function stringReplaceJS(receiver, replacer, replacement) {
    // The JavaScript String.replace method recognizes replacement
    // patterns in the replacement string. Dart does not have that
    // behavior.
    replacement = replacement.replace(/$/g, "$$$$") /*JS('String', r'#.replace(/\$/g, "$$$$")', replacement)*/;
    return receiver.replace(replacer, replacement) /* JS('String', r'#.replace(#, #)', receiver, replacer, replacement)*/;
}
function stringReplaceFirstRE(receiver, regexp, replacement, startIndex) {
    let match = regexp._execGlobal(receiver, startIndex);
    if (match == null)
        return receiver;
    let start = match.start;
    let end = match.end;
    return stringReplaceRangeUnchecked(receiver, start, end, replacement);
}
/// Returns a string for a RegExp pattern that matches [string]. This is done by
/// escaping all RegExp metacharacters.
function quoteStringForRegExp(string) {
    const pattern = "[[]{}()*+?.\\^$|]";
    return string.replace(new RegExp(pattern, "g"), "\$&") /* JS('String', r'#.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&")', string)*/;
}
function stringReplaceAllUnchecked(receiver, pattern, replacement) {
    checkString(replacement);
    if (is(pattern, 'string')) {
        if (pattern == "") {
            if (receiver == "") {
                return replacement /*JS('String', '#', replacement)*/; // help type inference.
            }
            else {
                let result = new DartStringBuffer('');
                let length = receiver.length;
                result.write(replacement);
                for (let i = 0; i < length; i++) {
                    result.write(receiver[i]);
                    result.write(replacement);
                }
                return result.toString();
            }
        }
        else {
            let quoted = quoteStringForRegExp(pattern);
            let replacer = new RegExp(quoted, 'g') /*JS('', "new RegExp(#, 'g')", quoted)*/;
            return stringReplaceJS(receiver, replacer, replacement);
        }
    }
    else if (is(pattern, JSSyntaxRegExp)) {
        let re = regExpGetGlobalNative(pattern);
        return stringReplaceJS(receiver, re, replacement);
    }
    else {
        checkNull(pattern);
        // TODO(floitsch): implement generic String.replace (with patterns).
        throw "String.replaceAll(Pattern) UNIMPLEMENTED";
    }
}
function _matchString(match) {
    return match.group(0);
}
function _stringIdentity(string) {
    return string;
}
function stringReplaceAllFuncUnchecked(receiver, pattern, onMatch, onNonMatch) {
    if (onMatch == null)
        onMatch = _matchString;
    if (onNonMatch == null)
        onNonMatch = _stringIdentity;
    if (is(pattern, 'string')) {
        return stringReplaceAllStringFuncUnchecked(receiver, new DartString(pattern), onMatch, onNonMatch);
    }
    // Placing the Pattern test here is indistingishable from placing it at the
    // top of the method but it saves an extra check on the `pattern is String`
    // path.
    if (isNot(pattern, DartPattern)) {
        throw new ArgumentError.value(pattern, 'pattern', 'is not a Pattern');
    }
    let buffer = new DartStringBuffer('');
    let startIndex = 0;
    for (let match of pattern.allMatches(receiver)) {
        buffer.write(onNonMatch(receiver.substring(startIndex, match.start)));
        buffer.write(onMatch(match));
        startIndex = match.end;
    }
    buffer.write(onNonMatch(receiver.substring(startIndex)));
    return buffer.toString();
}
function stringReplaceAllEmptyFuncUnchecked(receiver, onMatch, onNonMatch) {
    // Pattern is the empty string.
    let buffer = new DartStringBuffer('');
    let length = receiver.length;
    let i = 0;
    buffer.write(onNonMatch(""));
    while (i < length) {
        buffer.write(onMatch(new DartStringMatch(i, receiver.valueOf(), new DartString(""))));
        // Special case to avoid splitting a surrogate pair.
        let code = receiver.codeUnitAt(i);
        if ((code & ~0x3FF) == 0xD800 && length > i + 1) {
            // Leading surrogate;
            code = receiver.codeUnitAt(i + 1);
            if ((code & ~0x3FF) == 0xDC00) {
                // Matching trailing surrogate.
                buffer.write(onNonMatch(receiver.substring(i, i + 2)));
                i += 2;
                continue;
            }
        }
        buffer.write(onNonMatch(receiver[i]));
        i++;
    }
    buffer.write(onMatch(new DartStringMatch(i, receiver.valueOf(), new DartString(""))));
    buffer.write(onNonMatch(""));
    return buffer.toString();
}
function stringReplaceAllStringFuncUnchecked(receiver, pattern, onMatch, onNonMatch) {
    let patternLength = pattern.length;
    if (patternLength == 0) {
        return stringReplaceAllEmptyFuncUnchecked(new DartString(receiver), onMatch, onNonMatch);
    }
    let length = receiver.length;
    let buffer = new DartStringBuffer('');
    let startIndex = 0;
    while (startIndex < length) {
        let position = stringIndexOfStringUnchecked(receiver, pattern.valueOf(), startIndex);
        if (position == -1) {
            break;
        }
        buffer.write(onNonMatch(receiver.substring(startIndex, position)));
        buffer.write(onMatch(new DartStringMatch(position, receiver, pattern)));
        startIndex = position + patternLength;
    }
    buffer.write(onNonMatch(receiver.substring(startIndex)));
    return buffer.toString();
}
function stringReplaceFirstUnchecked(receiver, pattern, replacement, startIndex) {
    if (is(pattern, 'string')) {
        let index = stringIndexOfStringUnchecked(receiver, pattern, startIndex);
        if (index < 0)
            return receiver;
        let end = index + pattern.length;
        return stringReplaceRangeUnchecked(receiver, index, end, replacement);
    }
    if (is(pattern, JSSyntaxRegExp)) {
        return startIndex == 0
            ? stringReplaceJS(receiver, regExpGetNative(pattern), replacement)
            : stringReplaceFirstRE(receiver, pattern, replacement, startIndex);
    }
    checkNull(pattern);
    let matches = pattern.allMatches(receiver, startIndex).iterator;
    if (!matches.moveNext())
        return receiver;
    let match = matches.current;
    return new DartString(receiver).replaceRange(match.start, match.end, replacement);
}
function stringReplaceFirstMappedUnchecked(receiver, pattern, replace, startIndex) {
    let matches = pattern.allMatches(receiver, startIndex).iterator;
    if (!matches.moveNext())
        return receiver;
    let match = matches.current;
    let replacement = `${replace(match)}`;
    return new DartString(receiver).replaceRange(match.start, match.end, replacement);
}
function stringJoinUnchecked(array, separator) {
    return array.join(separator) /*   JS('String', r'#.join(#)', array, separator)*/;
}
function stringReplaceRangeUnchecked(receiver, start, end, replacement) {
    var prefix = receiver.substring(0, start) /* JS('String', '#.substring(0, #)', receiver, start)*/;
    var suffix = receiver.substring(end) /* JS('String', '#.substring(#)', receiver, end)*/;
    return `${prefix}${replacement}${suffix}`;
}
function stringLastIndexOfUnchecked(receiver, element, start) {
    return receiver.lastIndexOf(element, start) /*JS('int', r'#.lastIndexOf(#, #)', receiver, element, start)*/;
}
/**
 * An [Iterable] of the UTF-16 code units of a [String] in index order.
 */
class DartCodeUnits extends DartUnmodifiableListBase {
    constructor(_string) {
        super();
        this._string = _string;
    }
    get length() {
        return this._string.length;
    }
    elementAt(i) {
        return this._string.codeUnitAt(i);
    }
    static stringOf(u) {
        return u._string;
    }
}
__decorate([
    Operator(Op.INDEX)
], DartCodeUnits.prototype, "elementAt", null);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * An integer or floating-point number.
 *
 * It is a compile-time error for any type other than [int] or [double]
 * to attempt to extend or implement num.
 */
let DartNumber = DartNumber_1 = class DartNumber {
    constructor(n) {
    }
    static _create(n) {
        return new JSNumber(n);
    }
    /**
     * Test whether this value is numerically equal to `other`.
     *
     * If both operands are doubles, they are equal if they have the same
     * representation, except that:
     *
     *   * zero and minus zero (0.0 and -0.0) are considered equal. They
     *     both have the numerical value zero.
     *   * NaN is not equal to anything, including NaN. If either operand is
     *     NaN, the result is always false.
     *
     * If one operand is a double and the other is an int, they are equal if
     * the double has an integer value (finite with no fractional part) and
     * `identical(doubleValue.toInt(), intValue)` is true.
     *
     * If both operands are integers, they are equal if they have the same value.
     *
     * Returns false if `other` is not a [num].
     *
     * Notice that the behavior for NaN is non-reflexive. This means that
     * equality of double values is not a proper equality relation, as is
     * otherwise required of `operator==`. Using NaN in, e.g., a [HashSet]
     * will fail to work. The behavior is the standard IEEE-754 equality of
     * doubles.
     *
     * If you can avoid NaN values, the remaining doubles do have a proper
     * equality relation, and can be used safely.
     *
     * Use [compareTo] for a comparison that distinguishes zero and minus zero,
     * and that considers NaN values as equal.
     */
    equals(other) {
        throw 'abstract';
    }
    /**
     * Returns a hash code for a numerical value.
     *
     * The hash code is compatible with equality. It returns the same value
     * for an [int] and a [double] with the same numerical value, and therefore
     * the same value for the doubles zero and minus zero.
     *
     * No guarantees are made about the hash code of NaN values.
     */
    get hashCode() {
        throw 'abstract';
    }
    /**
     * Compares this to `other`.
     *
     * Returns a negative number if `this` is less than `other`, zero if they are
     * equal, and a positive number if `this` is greater than `other`.
     *
     * The ordering represented by this method is a total ordering of [num]
     * values. All distinct doubles are non-equal, as are all distinct integers,
     * but integers are equal to doubles if they have the same numerical
     * value.
     *
     * For doubles, the `compareTo` operation is different from the partial
     * ordering given by [operator==], [operator<] and [operator>]. For example,
     * IEEE doubles impose that `0.0 == -0.0` and all comparison operations on
     * NaN return false.
     *
     * This function imposes a complete ordering for doubles. When using
     * `compareTo` the following properties hold:
     *
     * - All NaN values are considered equal, and greater than any numeric value.
     * - -0.0 is less than 0.0 (and the integer 0), but greater than any non-zero
     *    negative value.
     * - Negative infinity is less than all other values and positive infinity is
     *   greater than all non-NaN values.
     * - All other values are compared using their numeric value.
     *
     * Examples:
     * ```
     * print(1.compareTo(2)); // => -1
     * print(2.compareTo(1)); // => 1
     * print(1.compareTo(1)); // => 0
     *
     * // The following comparisons yield different results than the
     * // corresponding comparison operators.
     * print((-0.0).compareTo(0.0));  // => -1
     * print(double.NAN.compareTo(double.NAN));  // => 0
     * print(double.INFINITY.compareTo(double.NAN)); // => -1
     *
     * // -0.0, and NaN comparison operators have rules imposed by the IEEE
     * // standard.
     * print(-0.0 == 0.0); // => true
     * print(double.NAN == double.NAN);  // => false
     * print(double.INFINITY < double.NAN);  // => false
     * print(double.NAN < double.INFINITY);  // => false
     * print(double.NAN == double.INFINITY);  // => false
     */
    compareTo(other) {
        throw 'abstract';
    }
    /** Addition operator. */
    plus(other) {
        throw 'abstract';
    }
    /** Subtraction operator. */
    minus(other) {
        throw 'abstract';
    }
    /** Multiplication operator. */
    times(other) {
        throw 'abstract';
    }
    /**
     * Euclidean modulo operator.
     *
     * Returns the remainder of the euclidean division. The euclidean division of
     * two integers `a` and `b` yields two integers `q` and `r` such that
     * `a == b * q + r` and `0 <= r < b.abs()`.
     *
     * The euclidean division is only defined for integers, but can be easily
     * extended to work with doubles. In that case `r` may have a non-integer
     * value, but it still verifies `0 <= r < |b|`.
     *
     * The sign of the returned value `r` is always positive.
     *
     * See [remainder] for the remainder of the truncating division.
     */
    module(other) {
        throw 'abstract';
    }
    /** Division operator. */
    divide(other) {
        throw 'abstract';
    }
    /**
     * Truncating division operator.
     *
     * If either operand is a [double] then the result of the truncating division
     * `a ~/ b` is equivalent to `(a / b).truncate().toInt()`.
     *
     * If both operands are [int]s then `a ~/ b` performs the truncating
     * integer division.
     */
    intDivide(other) {
        throw 'abstract';
    }
    /** Negate operator. */
    neg() {
        throw 'abstract';
    }
    /**
     * Returns the remainder of the truncating division of `this` by [other].
     *
     * The result `r` of this operation satisfies:
     * `this == (this ~/ other) * other + r`.
     * As a consequence the remainder `r` has the same sign as the divider `this`.
     */
    remainder(b) {
        throw 'abstract';
    }
    /** Relational less than operator. */
    lt(other) {
        throw 'abstract';
    }
    /** Relational less than or equal operator. */
    leq(other) {
        throw 'abstract';
    }
    /** Relational greater than operator. */
    get(other) {
        throw 'abstract';
    }
    /** Relational greater than or equal operator. */
    geq(other) {
        throw 'abstract';
    }
    /** True if the number is the double Not-a-Number value; otherwise, false. */
    get isNaN() {
        throw 'abstract';
    }
    /**
     * True if the number is negative; otherwise, false.
     *
     * Negative numbers are those less than zero, and the double `-0.0`.
     */
    get isNegative() {
        throw 'abstract';
    }
    /**
     * True if the number is positive infinity or negative infinity; otherwise,
     * false.
     */
    get isInfinite() {
        throw 'abstract';
    }
    /**
     * True if the number is finite; otherwise, false.
     *
     * The only non-finite numbers are NaN, positive infinity, and
     * negative infinity.
     */
    get isFinite() {
        throw 'abstract';
    }
    /** Returns the absolute value of this [num]. */
    abs() {
        throw 'abstract';
    }
    /**
     * Returns minus one, zero or plus one depending on the sign and
     * numerical value of the number.
     *
     * Returns minus one if the number is less than zero,
     * plus one if the number is greater than zero,
     * and zero if the number is equal to zero.
     *
     * Returns NaN if the number is the double NaN value.
     *
     * Returns a number of the same type as this number.
     * For doubles, `-0.0.sign == -0.0`.

     * The result satisfies:
     *
     *     n == n.sign * n.abs()
     *
     * for all numbers `n` (except NaN, because NaN isn't `==` to itself).
     */
    get sign() {
        throw 'abstract';
    }
    /**
     * Returns the integer closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).round() == 4` and `(-3.5).round() == -4`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    round() {
        throw 'abstract';
    }
    /**
     * Returns the greatest integer no greater than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    floor() {
        throw 'abstract';
    }
    /**
     * Returns the least integer no smaller than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    ceil() {
        throw 'abstract';
    }
    /**
     * Returns the integer obtained by discarding any fractional
     * digits from `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    truncate() {
        throw 'abstract';
    }
    /**
     * Returns the double integer value closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).roundToDouble() == 4` and `(-3.5).roundToDouble() == -4`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`,
     * and `-0.0` is therefore considered closer to negative numbers than `0.0`.
     * This means that for a value, `d` in the range `-0.5 < d < 0.0`,
     * the result is `-0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    roundToDouble() {
        throw 'abstract';
    }
    /**
     * Returns the greatest double integer value no greater than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `0.0 < d < 1.0` will return `0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    floorToDouble() {
        throw 'abstract';
    }
    /**
     * Returns the least double integer value no smaller than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    ceilToDouble() {
        throw 'abstract';
    }
    /**
     * Returns the double integer value obtained by discarding any fractional
     * digits from the double value of `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`, and
     * in the range `0.0 < d < 1.0` it will return 0.0.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    truncateToDouble() {
        throw 'abstract';
    }
    /**
     * Returns this [num] clamped to be in the range [lowerLimit]-[upperLimit].
     *
     * The comparison is done using [compareTo] and therefore takes `-0.0` into
     * account. This also implies that [double.NAN] is treated as the maximal
     * double value.
     *
     * The arguments [lowerLimit] and [upperLimit] must form a valid range where
     * `lowerLimit.compareTo(upperLimit) <= 0`.
     */
    clamp(lowerLimit, upperLimit) {
        throw 'abstract';
    }
    /** Truncates this [num] to an integer and returns the result as an [int]. */
    toInt() {
        throw 'abstract';
    }
    /**
     * Return this [num] as a [double].
     *
     * If the number is not representable as a [double], an
     * approximation is returned. For numerically large integers, the
     * approximation may be infinite.
     */
    toDouble() {
        throw 'abstract';
    }
    /**
     * Returns a decimal-point string-representation of `this`.
     *
     * Converts `this` to a [double] before computing the string representation.
     *
     * If the absolute value of `this` is greater or equal to `10^21` then this
     * methods returns an exponential representation computed by
     * `this.toStringAsExponential()`. Otherwise the result
     * is the closest string representation with exactly [fractionDigits] digits
     * after the decimal point. If [fractionDigits] equals 0 then the decimal
     * point is omitted.
     *
     * The parameter [fractionDigits] must be an integer satisfying:
     * `0 <= fractionDigits <= 20`.
     *
     * Examples:
     *
     *     1.toStringAsFixed(3);  // 1.000
     *     (4321.12345678).toStringAsFixed(3);  // 4321.123
     *     (4321.12345678).toStringAsFixed(5);  // 4321.12346
     *     123456789012345678901.toStringAsFixed(3);  // 123456789012345683968.000
     *     1000000000000000000000.toStringAsFixed(3); // 1e+21
     *     5.25.toStringAsFixed(0); // 5
     */
    toStringAsFixed(fractionDigits) {
        throw 'abstract';
    }
    /**
     * Returns an exponential string-representation of `this`.
     *
     * Converts `this` to a [double] before computing the string representation.
     *
     * If [fractionDigits] is given then it must be an integer satisfying:
     * `0 <= fractionDigits <= 20`. In this case the string contains exactly
     * [fractionDigits] after the decimal point. Otherwise, without the parameter,
     * the returned string uses the shortest number of digits that accurately
     * represent [this].
     *
     * If [fractionDigits] equals 0 then the decimal point is omitted.
     * Examples:
     *
     *     1.toStringAsExponential();       // 1e+0
     *     1.toStringAsExponential(3);      // 1.000e+0
     *     123456.toStringAsExponential();  // 1.23456e+5
     *     123456.toStringAsExponential(3); // 1.235e+5
     *     123.toStringAsExponential(0);    // 1e+2
     */
    toStringAsExponential(fractionDigits) {
        throw 'abstract';
    }
    /**
     * Converts `this` to a double and returns a string representation with
     * exactly [precision] significant digits.
     *
     * The parameter [precision] must be an integer satisfying:
     * `1 <= precision <= 21`.
     *
     * Examples:
     *
     *     1.toStringAsPrecision(2);       // 1.0
     *     1e15.toStringAsPrecision(3);    // 1.00+15
     *     1234567.toStringAsPrecision(3); // 1.23e+6
     *     1234567.toStringAsPrecision(9); // 1234567.00
     *     12345678901234567890.toStringAsPrecision(20); // 12345678901234567168
     *     12345678901234567890.toStringAsPrecision(14); // 1.2345678901235e+19
     *     0.00000012345.toStringAsPrecision(15); // 1.23450000000000e-7
     *     0.0000012345.toStringAsPrecision(15);  // 0.00000123450000000000
     */
    toStringAsPrecision(precision) {
        throw 'abstract';
    }
    /**
     * Returns the shortest string that correctly represent the input number.
     *
     * All [double]s in the range `10^-6` (inclusive) to `10^21` (exclusive)
     * are converted to their decimal representation with at least one digit
     * after the decimal point. For all other doubles,
     * except for special values like `NaN` or `Infinity`, this method returns an
     * exponential representation (see [toStringAsExponential]).
     *
     * Returns `"NaN"` for [double.NAN], `"Infinity"` for [double.INFINITY], and
     * `"-Infinity"` for [double.NEGATIVE_INFINITY].
     *
     * An [int] is converted to a decimal representation with no decimal point.
     *
     * Examples:
     *
     *     (0.000001).toString();  // "0.000001"
     *     (0.0000001).toString(); // "1e-7"
     *     (111111111111111111111.0).toString();  // "111111111111111110000.0"
     *     (100000000000000000000.0).toString();  // "100000000000000000000.0"
     *     (1000000000000000000000.0).toString(); // "1e+21"
     *     (1111111111111111111111.0).toString(); // "1.1111111111111111e+21"
     *     1.toString(); // "1"
     *     111111111111111111111.toString();  // "111111111111111110000"
     *     100000000000000000000.toString();  // "100000000000000000000"
     *     1000000000000000000000.toString(); // "1000000000000000000000"
     *     1111111111111111111111.toString(); // "1111111111111111111111"
     *     1.234e5.toString();   // 123400
     *     1234.5e6.toString();  // 1234500000
     *     12.345e67.toString(); // 1.2345e+68
     *
     * Note: the conversion may round the output if the returned string
     * is accurate enough to uniquely identify the input-number.
     * For example the most precise representation of the [double] `9e59` equals
     * `"899999999999999918767229449717619953810131273674690656206848"`, but
     * this method returns the shorter (but still uniquely identifying) `"9e59"`.
     *
     */
    toString() {
        throw 'abstract';
    }
    /**
     * Parses a string containing a number literal into a number.
     *
     * The method first tries to read the [input] as integer (similar to
     * [int.parse] without a radix).
     * If that fails, it tries to parse the [input] as a double (similar to
     * [double.parse]).
     * If that fails, too, it invokes [onError] with [input], and the result
     * of that invocation becomes the result of calling `parse`.
     *
     * If no [onError] is supplied, it defaults to a function that throws a
     * [FormatException].
     *
     * For any number `n`, this function satisfies
     * `identical(n, num.parse(n.toString()))` (except when `n` is a NaN `double`
     * with a payload).
     */
    static parse(input, onError) {
        let source = new DartString(input).trim();
        // TODO(lrn): Optimize to detect format and result type in one check.
        let result = DartInt.parse(source, { onError: DartNumber_1._returnIntNull });
        if (result != null)
            return result;
        result = DartDouble.parse(source, DartNumber_1._returnDoubleNull);
        if (result != null)
            return result;
        if (onError == null)
            throw new FormatException(input);
        return onError(input);
    }
    /** Helper functions for [parse]. */
    static _returnIntNull(_) {
        return null;
    }
    static _returnDoubleNull(_) {
        return null;
    }
};
__decorate([
    Operator(Op.EQUALS),
    Abstract
], DartNumber.prototype, "equals", null);
__decorate([
    Abstract
], DartNumber.prototype, "hashCode", null);
__decorate([
    Abstract
], DartNumber.prototype, "compareTo", null);
__decorate([
    Operator(Op.PLUS),
    Abstract
], DartNumber.prototype, "plus", null);
__decorate([
    Operator(Op.MINUS)
], DartNumber.prototype, "minus", null);
__decorate([
    Operator(Op.TIMES)
], DartNumber.prototype, "times", null);
__decorate([
    Operator(Op.MODULE)
], DartNumber.prototype, "module", null);
__decorate([
    Operator(Op.DIVIDE)
], DartNumber.prototype, "divide", null);
__decorate([
    Operator(Op.INTDIVIDE)
], DartNumber.prototype, "intDivide", null);
__decorate([
    Operator(Op.NEG)
], DartNumber.prototype, "neg", null);
__decorate([
    Operator(Op.LT)
], DartNumber.prototype, "lt", null);
__decorate([
    Operator(Op.LEQ)
], DartNumber.prototype, "leq", null);
__decorate([
    Operator(Op.GT)
], DartNumber.prototype, "get", null);
__decorate([
    Operator(Op.GEQ)
], DartNumber.prototype, "geq", null);
__decorate([
    defaultFactory
], DartNumber, "_create", null);
DartNumber = DartNumber_1 = __decorate([
    DartClass
], DartNumber);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of _interceptors;
/**
 * The super interceptor class for [JSInt] and [JSDouble]. The compiler
 * recognizes this class as an interceptor, and changes references to
 * [:this:] to actually use the receiver of the method, which is
 * generated as an extra argument added to each member.
 *
 * Note that none of the methods here delegate to a method defined on JSInt or
 * JSDouble.  This is exploited in [tryComputeConstantInterceptor].
 */
let JSNumber = JSNumber_1 = class JSNumber extends Number {
    constructor(n) {
        super(n);
    }
    equals(other) {
        return this.valueOf() == other;
    }
    compareTo(b) {
        if (isNot(b, 'num'))
            throw argumentErrorValue(b);
        if (this.valueOf() < b) {
            return -1;
        }
        else if (this.valueOf() > b) {
            return 1;
        }
        else if (this.valueOf() == b) {
            if (this.valueOf() == 0) {
                let bIsNegative = new DartNumber(b).isNegative;
                if (this.isNegative == bIsNegative)
                    return 0;
                if (this.isNegative)
                    return -1;
                return 1;
            }
            return 0;
        }
        else if (this.isNaN) {
            if (new DartNumber(b).isNaN) {
                return 0;
            }
            return 1;
        }
        else {
            return -1;
        }
    }
    get isNegative() {
        return (this.valueOf() == 0) ? (1 / this.valueOf()) < 0 : this.valueOf() < 0;
    }
    get isNaN() {
        return isNaN(this.valueOf()) /* JS('bool', r'isNaN(#)', this)*/;
    }
    get isInfinite() {
        return this.valueOf() == (1 / 0) /*JS('bool', r'# == (1/0)', this)*/ || this.valueOf() == (-1 / 0) /*JS('bool', r'# == (-1/0)', this)*/;
    }
    get isFinite() {
        return isFinite(this.valueOf()) /*JS('bool', r'isFinite(#)', this)*/;
    }
    remainder(b) {
        if (isNot(b, 'num'))
            throw argumentErrorValue(b);
        return this.valueOf() % b /* JS('num', r'# % #', this, b)*/;
    }
    abs() {
        return Math.abs(this.valueOf()) /*JS('returns:num;effects:none;depends:none;throws:never;gvn:true',
      r'Math.abs(#)', this)*/;
    }
    get sign() {
        return this.valueOf() > 0 ? 1 : this.valueOf() < 0 ? -1 : this.valueOf();
    }
    toInt() {
        if (this.valueOf() >= JSNumber_1._MIN_INT32 && this.valueOf() <= JSNumber_1._MAX_INT32) {
            // 0 and -0.0 handled here.
            return this.valueOf() | 0 /*JS('int', '# | 0', this)*/;
        }
        if (isFinite(this.valueOf()) /*JS('bool', r'isFinite(#)', this)*/) {
            return this.truncateToDouble() + 0 /* JS('int', r'# + 0', truncateToDouble())*/; // Converts -0.0 to +0.0.
        }
        // [this] is either NaN, Infinity or -Infinity.
        throw new UnsupportedError("" + this.valueOf() + ".toInt()" /*JS("String", '"" + # + ".toInt()"', this)*/);
    }
    truncate() {
        return this.toInt();
    }
    ceil() {
        if (this.valueOf() >= 0) {
            if (this.valueOf() <= JSNumber_1._MAX_INT32) {
                let truncated = this.valueOf() | 0 /* JS('int', '# | 0', this)*/; // converts -0.0 to 0.
                return this.valueOf() == truncated ? truncated : truncated + 1;
            }
        }
        else {
            if (this.valueOf() >= JSNumber_1._MIN_INT32) {
                return this.valueOf() | 0 /*JS('int', '# | 0', this)*/;
            }
        }
        let d = Math.ceil(this.valueOf()) /* JS('num', 'Math.ceil(#)', this)*/;
        if (isFinite(d) /*JS('bool', r'isFinite(#)', d)*/) {
            return d /*JS('int', r'#', d)*/;
        }
        // [this] is either NaN, Infinity or -Infinity.
        throw new UnsupportedError("" + this.valueOf() + ".ceil()" /*JS("String", '"" + # + ".ceil()"', this)*/);
    }
    floor() {
        if (this.valueOf() >= 0) {
            if (this.valueOf() <= JSNumber_1._MAX_INT32) {
                return this.valueOf() | 0 /* JS('int', '# | 0', this)*/;
            }
        }
        else {
            if (this.valueOf() >= JSNumber_1._MIN_INT32) {
                let truncated = this.valueOf() | 0 /*JS('int', '# | 0', this)*/;
                return this.valueOf() == truncated ? truncated : truncated - 1;
            }
        }
        let d = Math.floor(this.valueOf()) /*JS('num', 'Math.floor(#)', this)*/;
        if (isFinite(d) /*JS('bool', r'isFinite(#)', d)*/) {
            return d /*JS('int', r'#', d)*/;
        }
        // [this] is either NaN, Infinity or -Infinity.
        throw new UnsupportedError("" + this.valueOf() + ".floor()" /*JS("String", '"" + # + ".floor()"', this)*/);
    }
    round() {
        if (this.valueOf() > 0) {
            // This path excludes the special cases -0.0, NaN and -Infinity, leaving
            // only +Infinity, for which a direct test is faster than [isFinite].
            if (this.valueOf() !== (1 / 0) /*JS('bool', r'# !== (1/0)', this)*/) {
                return Math.round(this.valueOf()) /*JS('int', r'Math.round(#)', this)*/;
            }
        }
        else if (this.valueOf() > (-1 / 0) /*JS('bool', '# > (-1/0)', this)*/) {
            // This test excludes NaN and -Infinity, leaving only -0.0.
            //
            // Subtraction from zero rather than negation forces -0.0 to 0.0 so code
            // inside Math.round and code to handle result never sees -0.0, which on
            // some JavaScript VMs can be a slow path.
            return 0 - Math.round(0 - this.valueOf()) /*JS('int', r'0 - Math.round(0 - #)', this)*/;
        }
        // [this] is either NaN, Infinity or -Infinity.
        throw new UnsupportedError("" + this.valueOf() + ".round()" /*JS("String", '"" + # + ".round()"', this)*/);
    }
    ceilToDouble() {
        return Math.ceil(this.valueOf()) /* JS('num', r'Math.ceil(#)', this)*/;
    }
    floorToDouble() {
        return Math.floor(this.valueOf()) /* JS('num', r'Math.floor(#)', this)*/;
    }
    roundToDouble() {
        if (this.valueOf() < 0) {
            return -Math.round(-this.valueOf()) /* JS('num', r'-Math.round(-#)', this)*/;
        }
        else {
            return Math.round(this.valueOf()) /*JS('num', r'Math.round(#)', this)*/;
        }
    }
    truncateToDouble() {
        return this.valueOf() < 0 ? this.ceilToDouble() : this.floorToDouble();
    }
    clamp(lowerLimit, upperLimit) {
        if (isNot(lowerLimit, 'num'))
            throw argumentErrorValue(lowerLimit);
        if (isNot(upperLimit, 'num'))
            throw argumentErrorValue(upperLimit);
        if (new DartNumber(lowerLimit).compareTo(upperLimit) > 0) {
            throw argumentErrorValue(lowerLimit);
        }
        if (this.compareTo(lowerLimit) < 0)
            return lowerLimit;
        if (this.compareTo(upperLimit) > 0)
            return upperLimit;
        return this.valueOf();
    }
    // The return type is intentionally omitted to avoid type checker warnings
    // from assigning JSNumber to double.
    toDouble() {
        return this.valueOf();
    }
    toStringAsFixed(fractionDigits) {
        checkInt(fractionDigits);
        if (fractionDigits < 0 || fractionDigits > 20) {
            throw new RangeError.range(fractionDigits, 0, 20, "fractionDigits");
        }
        let result = this.toFixed(fractionDigits) /*JS('String', r'#.toFixed(#)', this, fractionDigits)*/;
        if (this.valueOf() == 0 && this.isNegative)
            return `-${result}`;
        return result;
    }
    toStringAsExponential(fractionDigits) {
        let result;
        if (fractionDigits != null) {
            checkInt(fractionDigits);
            if (fractionDigits < 0 || fractionDigits > 20) {
                throw new RangeError.range(fractionDigits, 0, 20, "fractionDigits");
            }
            result = this.toExponential(fractionDigits) /*JS('String', r'#.toExponential(#)', this, fractionDigits)*/;
        }
        else {
            result = this.toExponential() /* JS('String', r'#.toExponential()', this)*/;
        }
        if (this.valueOf() == 0 && this.isNegative)
            return `-${result}`;
        return result;
    }
    toStringAsPrecision(precision) {
        checkInt(precision);
        if (precision < 1 || precision > 21) {
            throw new RangeError.range(precision, 1, 21, "precision");
        }
        let result = this.toPrecision(precision) /*JS('String', r'#.toPrecision(#)', this, precision)*/;
        if (this.valueOf() == 0 && this.isNegative)
            return `-${result}`;
        return result;
    }
    toRadixString(radix) {
        checkInt(radix);
        if (radix < 2 || radix > 36) {
            throw new RangeError.range(radix, 2, 36, "radix");
        }
        let result = super.toString(radix) /* JS('String', r'#.toString(#)', this, radix)*/;
        const rightParenCode = 0x29;
        if (new DartString(result).codeUnitAt(result.length - 1) != rightParenCode) {
            return result;
        }
        return JSNumber_1._handleIEtoString(result);
    }
    static _handleIEtoString(result) {
        // Result is probably IE's untraditional format for large numbers,
        // e.g., "8.0000000000008(e+15)" for 0x8000000000000800.toString(16).
        let match = /^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(result) /* JS('List|Null',
        r'/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(#)', result)*/;
        if (match == null) {
            // Then we don't know how to handle it at all.
            throw new UnsupportedError("Unexpected toString result: $result");
        }
        result = match[1] /*JS('String', '#', match[1])*/;
        let exponent = +match[3] /*JS("int", "+#", match[3])*/;
        if (match[2] != null) {
            result = result + match[2] /*JS('String', '# + #', result, match[2])*/;
            exponent -= match[2].length /*JS('int', '#.length', match[2])*/;
        }
        return result + new DartString("0").repeat(exponent);
    }
    // Note: if you change this, also change the function [S].
    toString() {
        if (this.valueOf() == 0 && (1 / this.valueOf()) < 0 /* JS('bool', '(1 / #) < 0', this)*/) {
            return '-0.0';
        }
        else {
            return "" + (this.valueOf()) /* JS('String', r'"" + (#)', this)*/;
        }
    }
    get hashCode() {
        return this.valueOf() & 0x1FFFFFFF /* JS('int', '# & 0x1FFFFFFF', this)*/;
    }
    neg() {
        return -this.valueOf() /* JS('num', r'-#', this)*/;
    }
    plus(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() + other /*JS('num', '# + #', this, other)*/;
    }
    minus(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() - other /* JS('num', '# - #', this, other)*/;
    }
    divide(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() / other /*JS('num', '# / #', this, other)*/;
    }
    times(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() * other /* JS('num', '# * #', this, other)*/;
    }
    module(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        // Euclidean Modulo.
        let result = this.valueOf() % other /*JS('num', r'# % #', this, other)*/;
        if (result == 0)
            return 0; // Make sure we don't return -0.0.
        if (result > 0)
            return result;
        if (other /*JS('num', '#', other)*/ < 0) {
            return result - other /* JS('num', '#', other)*/;
        }
        else {
            return result + other /* JS('num', '#', other)*/;
        }
    }
    _isInt32(value) {
        return (value | 0) === value /* JS('bool', '(# | 0) === #', value, value)*/;
    }
    intDivide(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        if (false)
            this._tdivFast(other); // Ensure resolution.
        if (this._isInt32(this.valueOf())) {
            if (other >= 1 || other < -1) {
                return (this.valueOf() / other) | 0 /*JS('int', r'(# / #) | 0', this, other)*/;
            }
        }
        return this._tdivSlow(other);
    }
    _tdivFast(other) {
        // [other] is known to be a number outside the range [-1, 1).
        return this._isInt32(this.valueOf())
            ? (this.valueOf() / other) | 0 /*JS('int', r'(# / #) | 0', this, other)*/
            : this._tdivSlow(other);
    }
    _tdivSlow(other) {
        let quotient = this.valueOf() / other /* JS('num', r'# / #', this, other)*/;
        if (quotient >= JSNumber_1._MIN_INT32 && quotient <= JSNumber_1._MAX_INT32) {
            // This path includes -0.0 and +0.0.
            return quotient | 0 /* JS('int', '# | 0', quotient)*/;
        }
        if (quotient > 0) {
            // This path excludes the special cases -0.0, NaN and -Infinity, leaving
            // only +Infinity, for which a direct test is faster than [isFinite].
            if (quotient !== (1 / 0) /*JS('bool', r'# !== (1/0)', quotient)*/) {
                return Math.floor(quotient) /*JS('int', r'Math.floor(#)', quotient)*/;
            }
        }
        else if (quotient > (-1 / 0) /*JS('bool', '# > (-1/0)', quotient)*/) {
            // This test excludes NaN and -Infinity.
            return Math.ceil(quotient) /* JS('int', r'Math.ceil(#)', quotient)*/;
        }
        // [quotient] is either NaN, Infinity or -Infinity.
        throw new UnsupportedError(`Result of truncating division is ${quotient}: ${this} ~/ ${other}`);
    }
    // TODO(ngeoffray): Move the bit operations below to [JSInt] and
    // make them take an int. Because this will make operations slower,
    // we define these methods on number for now but we need to decide
    // the grain at which we do the type checks.
    lshift(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        if (other /*JS('num', '#', other)*/ < 0)
            throw argumentErrorValue(other);
        return this._shlPositive(other);
    }
    _shlPositive(other) {
        // JavaScript only looks at the last 5 bits of the shift-amount. Shifting
        // by 33 is hence equivalent to a shift by 1.
        return other > 31 /*JS('bool', r'# > 31', other)*/
            ? 0
            : (this.valueOf() << other) >>> 0 /*JS('JSUInt32', r'(# << #) >>> 0', this, other)*/;
    }
    rshift(other) {
        if (false)
            this._shrReceiverPositive(other);
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        if (other /*JS('num', '#', other)*/ < 0)
            throw argumentErrorValue(other);
        return this._shrOtherPositive(other);
    }
    _shrOtherPositive(other) {
        return this.valueOf() /*JS('num', '#', this)*/ > 0
            ? this._shrBothPositive(other)
            // For negative numbers we just clamp the shift-by amount.
            // `this` could be negative but not have its 31st bit set.
            // The ">>" would then shift in 0s instead of 1s. Therefore
            // we cannot simply return 0xFFFFFFFF.
            : (this.valueOf() >> (other > 31 ? 31 : other)) >>> 0 /* JS('JSUInt32', r'(# >> #) >>> 0', this, other > 31 ? 31 : other)*/;
    }
    _shrReceiverPositive(other) {
        if (other /*JS('num', '#', other)*/ < 0)
            throw argumentErrorValue(other);
        return this._shrBothPositive(other);
    }
    _shrBothPositive(other) {
        return other > 31 /* JS('bool', r'# > 31', other)*/
            // JavaScript only looks at the last 5 bits of the shift-amount. In JS
            // shifting by 33 is hence equivalent to a shift by 1. Shortcut the
            // computation when that happens.
            ? 0
            // Given that `this` is positive we must not use '>>'. Otherwise a
            // number that has the 31st bit set would be treated as negative and
            // shift in ones.
            : this.valueOf() >>> other /* JS('JSUInt32', r'# >>> #', this, other)*/;
    }
    and(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return (this.valueOf() & other) >>> 0 /*JS('JSUInt32', r'(# & #) >>> 0', this, other)*/;
    }
    or(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return (this.valueOf() | other) >>> 0 /* JS('JSUInt32', r'(# | #) >>> 0', this, other)*/;
    }
    xor(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return (this.valueOf() ^ other) >>> 0 /*JS('JSUInt32', r'(# ^ #) >>> 0', this, other)*/;
    }
    lt(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() < other /* JS('bool', '# < #', this, other)*/;
    }
    get(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() > other /* JS('bool', '# > #', this, other)*/;
    }
    leq(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() <= other /* JS('bool', '# <= #', this, other)*/;
    }
    geq(other) {
        if (isNot(other, 'num'))
            throw argumentErrorValue(other);
        return this.valueOf() >= other /*JS('bool', '# >= #', this, other)*/;
    }
};
JSNumber._MIN_INT32 = -0x80000000;
JSNumber._MAX_INT32 = 0x7FFFFFFF;
__decorate([
    Operator(Op.NEG)
], JSNumber.prototype, "neg", null);
__decorate([
    Operator(Op.PLUS)
], JSNumber.prototype, "plus", null);
__decorate([
    Operator(Op.MINUS)
], JSNumber.prototype, "minus", null);
__decorate([
    Operator(Op.DIVIDE)
], JSNumber.prototype, "divide", null);
__decorate([
    Operator(Op.TIMES)
], JSNumber.prototype, "times", null);
__decorate([
    Operator(Op.MODULE)
], JSNumber.prototype, "module", null);
__decorate([
    Operator(Op.INTDIVIDE)
], JSNumber.prototype, "intDivide", null);
__decorate([
    Operator(Op.SHIFTLEFT)
], JSNumber.prototype, "lshift", null);
__decorate([
    Operator(Op.SHIFTRIGHT)
], JSNumber.prototype, "rshift", null);
__decorate([
    Operator(Op.BITAND)
], JSNumber.prototype, "and", null);
__decorate([
    Operator(Op.BITOR)
], JSNumber.prototype, "or", null);
__decorate([
    Operator(Op.XOR)
], JSNumber.prototype, "xor", null);
__decorate([
    Operator(Op.LT)
], JSNumber.prototype, "lt", null);
__decorate([
    Operator(Op.GT)
], JSNumber.prototype, "get", null);
__decorate([
    Operator(Op.LEQ)
], JSNumber.prototype, "leq", null);
__decorate([
    Operator(Op.GEQ)
], JSNumber.prototype, "geq", null);
JSNumber = JSNumber_1 = __decorate([
    DartClass,
    Implements(DartNumber)
], JSNumber);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
/**
 * An arbitrarily large integer.
 *
 * **Note:** When compiling to JavaScript, integers are
 * implemented as JavaScript numbers. When compiling to JavaScript,
 * integers are therefore restricted to 53 significant bits because
 * all JavaScript numbers are double-precision floating point
 * values. The behavior of the operators and methods in the [int]
 * class therefore sometimes differs between the Dart VM and Dart code
 * compiled to JavaScript.
 *
 * It is a compile-time error for a class to attempt to extend or implement int.
 */
let DartInt = class DartInt extends DartNumber {
    constructor(n) {
        super(n);
    }
    static _create(n) {
        return new JSInt(n);
    }
    /**
     * Returns the integer value of the given environment declaration [name].
     *
     * The result is the same as would be returned by:
     *
     *     int.parse(const String.fromEnvironment(name, defaultValue: ""),
     *               (_) => defaultValue)
     *
     * Example:
     *
     *     const int.fromEnvironment("defaultPort", defaultValue: 80)
     */
    // The .fromEnvironment() constructors are special in that we do not want
    // users to call them using "new". We prohibit that by giving them bodies
    // that throw, even though const constructors are not allowed to have bodies.
    // Disable those static errors.
    //ignore: const_constructor_with_body
    //ignore: const_factory
    static _fromEnvironment(name, _) {
        throw "external";
    }
    /**
     * Bit-wise and operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with only the bits set that are set in
     * both `this` and [other]
     *
     * Of both operands are negative, the result is negative, otherwise
     * the result is non-negative.
     */
    and(other) {
        throw 'abstract';
    }
    /**
     * Bit-wise or operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with the bits set that are set in either
     * of `this` and [other]
     *
     * If both operands are non-negative, the result is non-negative,
     * otherwise the result us negative.
     */
    or(other) {
        throw 'abstract';
    }
    /**
     * Bit-wise exclusive-or operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with the bits set that are set in one,
     * but not both, of `this` and [other]
     *
     * If the operands have the same sign, the result is non-negative,
     * otherwise the result is negative.
     */
    xor(other) {
        throw 'abstract';
    }
    /**
     * The bit-wise negate operator.
     *
     * Treating `this` as a sufficiently large two's component integer,
     * the result is a number with the opposite bits set.
     *
     * This maps any integer `x` to `-x - 1`.
     */
    bitneg() {
        throw 'abstract';
    }
    /**
     * Shift the bits of this integer to the left by [shiftAmount].
     *
     * Shifting to the left makes the number larger, effectively multiplying
     * the number by `pow(2, shiftIndex)`.
     *
     * There is no limit on the size of the result. It may be relevant to
     * limit intermediate values by using the "and" operator with a suitable
     * mask.
     *
     * It is an error if [shiftAmount] is negative.
     */
    lshift(other) {
        throw 'abstract';
    }
    /**
     * Shift the bits of this integer to the right by [shiftAmount].
     *
     * Shifting to the right makes the number smaller and drops the least
     * significant bits, effectively doing an integer division by
     *`pow(2, shiftIndex)`.
     *
     * It is an error if [shiftAmount] is negative.
     */
    rshift(other) {
        throw 'abstract';
    }
    /**
     * Returns this integer to the power of [exponent] modulo [modulus].
     *
     * The [exponent] must be non-negative and [modulus] must be
     * positive.
     */
    modPow(e, m) {
        throw 'abstract';
    }
    /**
     * Returns the modular multiplicative inverse of this integer
     * modulo [modulus].
     *
     * The [modulus] must be positive.
     *
     * It is an error if no modular inverse exists.
     */
    modInverse(m) {
        throw 'abstract';
    }
    /**
     * Returns the greatest common divisor of this integer and [other].
     *
     * If either number is non-zero, the result is the numerically greatest
     * integer dividing both `this` and `other`.
     *
     * The greatest common divisor is independent of the order,
     * so `x.gcd(y)` is  always the same as `y.gcd(x)`.
     *
     * For any integer `x`, `x.gcd(x)` is `x.abs()`.
     *
     * If both `this` and `other` is zero, the result is also zero.
     */
    gcd(other) {
        throw 'abstract';
    }
    /** Returns true if and only if this integer is even. */
    get isEven() {
        throw 'abstract';
    }
    /** Returns true if and only if this integer is odd. */
    get isOdd() {
        throw 'abstract';
    }
    /**
     * Returns the minimum number of bits required to store this integer.
     *
     * The number of bits excludes the sign bit, which gives the natural length
     * for non-negative (unsigned) values.  Negative values are complemented to
     * return the bit position of the first bit that differs from the sign bit.
     *
     * To find the number of bits needed to store the value as a signed value,
     * add one, i.e. use `x.bitLength + 1`.
     *
     *      x.bitLength == (-x-1).bitLength
     *
     *      3.bitLength == 2;     // 00000011
     *      2.bitLength == 2;     // 00000010
     *      1.bitLength == 1;     // 00000001
     *      0.bitLength == 0;     // 00000000
     *      (-1).bitLength == 0;  // 11111111
     *      (-2).bitLength == 1;  // 11111110
     *      (-3).bitLength == 2;  // 11111101
     *      (-4).bitLength == 2;  // 11111100
     */
    get bitLength() {
        throw 'abstract';
    }
    /**
     * Returns the least significant [width] bits of this integer as a
     * non-negative number (i.e. unsigned representation).  The returned value has
     * zeros in all bit positions higher than [width].
     *
     *     (-1).toUnsigned(5) == 31   // 11111111  ->  00011111
     *
     * This operation can be used to simulate arithmetic from low level languages.
     * For example, to increment an 8 bit quantity:
     *
     *     q = (q + 1).toUnsigned(8);
     *
     * `q` will count from `0` up to `255` and then wrap around to `0`.
     *
     * If the input fits in [width] bits without truncation, the result is the
     * same as the input.  The minimum width needed to avoid truncation of `x` is
     * given by `x.bitLength`, i.e.
     *
     *     x == x.toUnsigned(x.bitLength);
     */
    toUnsigned(width) {
        throw 'abstract';
    }
    /**
     * Returns the least significant [width] bits of this integer, extending the
     * highest retained bit to the sign.  This is the same as truncating the value
     * to fit in [width] bits using an signed 2-s complement representation.  The
     * returned value has the same bit value in all positions higher than [width].
     *
     *                                    V--sign bit-V
     *     16.toSigned(5) == -16   //  00010000 -> 11110000
     *     239.toSigned(5) == 15   //  11101111 -> 00001111
     *                                    ^           ^
     *
     * This operation can be used to simulate arithmetic from low level languages.
     * For example, to increment an 8 bit signed quantity:
     *
     *     q = (q + 1).toSigned(8);
     *
     * `q` will count from `0` up to `127`, wrap to `-128` and count back up to
     * `127`.
     *
     * If the input value fits in [width] bits without truncation, the result is
     * the same as the input.  The minimum width needed to avoid truncation of `x`
     * is `x.bitLength + 1`, i.e.
     *
     *     x == x.toSigned(x.bitLength + 1);
     */
    toSigned(width) {
        throw 'abstract';
    }
    /**
     * Return the negative value of this integer.
     *
     * The result of negating an integer always has the opposite sign, except
     * for zero, which is its own negation.
     */
    //int operator -();
    /**
     * Returns the absolute value of this integer.
     *
     * For any integer `x`, the result is the same as `x < 0 ? -x : x`.
     */
    //int abs();
    /**
     * Returns the sign of this integer.
     *
     * Returns 0 for zero, -1 for values less than zero and
     * +1 for values greater than zero.
     */
    //int get sign;
    /** Returns `this`. */
    // int round();
    /** Returns `this`. */
    //int floor();
    /** Returns `this`. */
    // int ceil();
    /** Returns `this`. */
    //int truncate();
    /** Returns `this.toDouble()`. */
    // double roundToDouble();
    /** Returns `this.toDouble()`. */
    // double floorToDouble();
    /** Returns `this.toDouble()`. */
    //  double ceilToDouble();
    /** Returns `this.toDouble()`. */
    // double truncateToDouble();
    /**
     * Returns a String-representation of this integer.
     *
     * The returned string is parsable by [parse].
     * For any `int` [:i:], it is guaranteed that
     * [:i == int.parse(i.toString()):].
     */
    //String toString();
    /**
     * Converts [this] to a string representation in the given [radix].
     *
     * In the string representation, lower-case letters are used for digits above
     * '9', with 'a' being 10 an 'z' being 35.
     *
     * The [radix] argument must be an integer in the range 2 to 36.
     */
    // String toRadixString(int radix);
    /**
     * Parse [source] as a, possibly signed, integer literal and return its value.
     *
     * The [source] must be a non-empty sequence of base-[radix] digits,
     * optionally prefixed with a minus or plus sign ('-' or '+').
     *
     * The [radix] must be in the range 2..36. The digits used are
     * first the decimal digits 0..9, and then the letters 'a'..'z' with
     * values 10 through 35. Also accepts upper-case letters with the same
     * values as the lower-case ones.
     *
     * If no [radix] is given then it defaults to 10. In this case, the [source]
     * digits may also start with `0x`, in which case the number is interpreted
     * as a hexadecimal literal, which effectively means that the `0x` is ignored
     * and the radix is instead set to 16.
     *
     * For any int [:n:] and radix [:r:], it is guaranteed that
     * [:n == int.parse(n.toRadixString(r), radix: r):].
     *
     * If the [source] is not a valid integer literal, optionally prefixed by a
     * sign, the [onError] is called with the [source] as argument, and its return
     * value is used instead. If no [onError] is provided, a [FormatException]
     * is thrown.
     *
     * The [onError] handler can be chosen to return `null`.  This is preferable
     * to to throwing and then immediately catching the [FormatException].
     * Example:
     *
     *     var value = int.parse(text, onError: (source) => null);
     *     if (value == null) ... handle the problem
     *
     * The [onError] function is only invoked if [source] is a [String]. It is
     * not invoked if the [source] is, for example, `null`.
     */
    static parse(source, _) {
        let { radix, onError } = Object.assign({}, _);
        return DartPrimitives.parseInt(source, radix, onError);
    }
};
__decorate([
    Operator(Op.BITAND)
], DartInt.prototype, "and", null);
__decorate([
    Operator(Op.BITOR)
], DartInt.prototype, "or", null);
__decorate([
    Operator(Op.XOR)
], DartInt.prototype, "xor", null);
__decorate([
    Operator(Op.BITNEG)
], DartInt.prototype, "bitneg", null);
__decorate([
    Operator(Op.SHIFTLEFT)
], DartInt.prototype, "lshift", null);
__decorate([
    Operator(Op.SHIFTRIGHT)
], DartInt.prototype, "rshift", null);
__decorate([
    defaultFactory
], DartInt, "_create", null);
__decorate([
    namedFactory
], DartInt, "_fromEnvironment", null);
DartInt = __decorate([
    DartClass
], DartInt);
/**
 * The interceptor class for [int]s.
 *
 * This class implements double since in JavaScript all numbers are doubles, so
 * while we want to treat `2.0` as an integer for some operations, its
 * interceptor should answer `true` to `is double`.
 */
// tslint:disable-next-line:max-classes-per-file
let JSInt = JSInt_1 = class JSInt extends JSNumber {
    constructor(i) {
        super(i);
    }
    get isEven() {
        return (this.valueOf() & 1) == 0;
    }
    get isOdd() {
        return (this.valueOf() & 1) == 1;
    }
    toUnsigned(width) {
        return this.valueOf() & ((1 << width) - 1);
    }
    toSigned(width) {
        let signMask = 1 << (width - 1);
        return (this.valueOf() & (signMask - 1)) - (this.valueOf() & signMask);
    }
    get bitLength() {
        let nonneg = this.valueOf() < 0 ? -this.valueOf() - 1 : this.valueOf();
        if (nonneg >= 0x100000000) {
            nonneg = new DartNumber(nonneg).divide(0x100000000);
            return JSInt_1._bitCount(JSInt_1._spread(nonneg)) + 32;
        }
        return JSInt_1._bitCount(JSInt_1._spread(nonneg));
    }
    // Returns pow(this, e) % m.
    modPow(e, m) {
        if (isNot(e, 'int')) {
            throw new ArgumentError.value(e, "exponent", "not an integer");
        }
        if (isNot(m, 'int')) {
            throw new ArgumentError.value(m, "modulus", "not an integer");
        }
        if (e < 0)
            throw new RangeError.range(e, 0, null, "exponent");
        if (m <= 0)
            throw new RangeError.range(m, 1, null, "modulus");
        if (e == 0)
            return 1;
        let b = this.valueOf();
        if (b < 0 || b > m) {
            b %= m;
        }
        let r = 1;
        while (e > 0) {
            if (new DartInt(e).isOdd) {
                r = (r * b) % m;
            }
            e = new DartNumber(e).intDivide(2);
            b = (b * b) % m;
        }
        return r;
    }
    // If inv is false, returns gcd(x, y).
    // If inv is true and gcd(x, y) = 1, returns d, so that c*x + d*y = 1.
    // If inv is true and gcd(x, y) != 1, throws Exception("Not coprime").
    static _binaryGcd(x, y, inv) {
        let s = 1;
        if (!inv) {
            while (new DartInt(x).isEven && new DartInt(y).isEven) {
                x = new DartNumber(x).intDivide(2);
                y = new DartNumber(y).intDivide(2) /*~/= 2*/;
                s *= 2;
            }
            if (new DartInt(y).isOdd) {
                let t = x;
                x = y;
                y = t;
            }
        }
        const ac = new DartInt(x).isEven;
        let u = x;
        let v = y;
        let a = 1, b = 0, c = 0, d = 1;
        do {
            while (new DartInt(u).isEven) {
                u = new DartNumber(u).intDivide(2);
                if (ac) {
                    if (!new DartInt(a).isEven || !new DartInt(b).isEven) {
                        a += y;
                        b -= x;
                    }
                    a = new DartNumber(a).intDivide(2);
                }
                else if (!new DartInt(b).isEven) {
                    b -= x;
                }
                b = new DartNumber(b).intDivide(2) /* ~/= 2*/;
            }
            while (new DartInt(v).isEven) {
                v = new DartNumber(v).intDivide(2) /* ~/= 2*/;
                if (ac) {
                    if (!new DartInt(c).isEven || !new DartInt(d).isEven) {
                        c += y;
                        d -= x;
                    }
                    c = new DartNumber(c).intDivide(2) /* ~/= 2*/;
                }
                else if (!new DartInt(d).isEven) {
                    d -= x;
                }
                d = new DartNumber(d).intDivide(2);
            }
            if (u >= v) {
                u -= v;
                if (ac)
                    a -= c;
                b -= d;
            }
            else {
                v -= u;
                if (ac)
                    c -= a;
                d -= b;
            }
        } while (u != 0);
        if (!inv)
            return s * v;
        if (v != 1)
            throw new DartError("Not coprime");
        if (d < 0) {
            d += x;
            if (d < 0)
                d += x;
        }
        else if (d > x) {
            d -= x;
            if (d > x)
                d -= x;
        }
        return d;
    }
    // Returns 1/this % m, with m > 0.
    modInverse(m) {
        if (isNot(m, 'int')) {
            throw new ArgumentError.value(m, "modulus", "not an integer");
        }
        if (m <= 0)
            throw new RangeError.range(m, 1, null, "modulus");
        if (m == 1)
            return 0;
        let t = this.valueOf();
        if ((t < 0) || (t >= m))
            t %= m;
        if (t == 1)
            return 1;
        if ((t == 0) || (new DartInt(t).isEven && new DartInt(m).isEven)) {
            throw new DartError("Not coprime");
        }
        return JSInt_1._binaryGcd(m, t, true);
    }
    // Returns gcd of abs(this) and abs(other).
    gcd(other) {
        if (isNot(other, 'int')) {
            throw new ArgumentError.value(other, "other", "not an integer");
        }
        let x = this.abs();
        let y = new DartNumber(other).abs();
        if (x == 0)
            return y;
        if (y == 0)
            return x;
        if ((x == 1) || (y == 1))
            return 1;
        return JSInt_1._binaryGcd(x, y, false);
    }
    // Assumes i is <= 32-bit and unsigned.
    static _bitCount(i) {
        // See "Hacker's Delight", section 5-1, "Counting 1-Bits".
        // The basic strategy is to use "divide and conquer" to
        // add pairs (then quads, etc.) of bits together to obtain
        // sub-counts.
        //
        // A straightforward approach would look like:
        //
        // i = (i & 0x55555555) + ((i >>  1) & 0x55555555);
        // i = (i & 0x33333333) + ((i >>  2) & 0x33333333);
        // i = (i & 0x0F0F0F0F) + ((i >>  4) & 0x0F0F0F0F);
        // i = (i & 0x00FF00FF) + ((i >>  8) & 0x00FF00FF);
        // i = (i & 0x0000FFFF) + ((i >> 16) & 0x0000FFFF);
        //
        // The code below removes unnecessary &'s and uses a
        // trick to remove one instruction in the first line.
        i = JSInt_1._shru(i, 0) - (JSInt_1._shru(i, 1) & 0x55555555);
        i = (i & 0x33333333) + (JSInt_1._shru(i, 2) & 0x33333333);
        i = 0x0F0F0F0F & (i + JSInt_1._shru(i, 4));
        i += JSInt_1._shru(i, 8);
        i += JSInt_1._shru(i, 16);
        return (i & 0x0000003F);
    }
    static _shru(value, shift) {
        return value >>> shift /* JS('int', '# >>> #', value, shift)*/;
    }
    static _shrs(value, shift) {
        return value >> shift /* JS('int', '# >> #', value, shift)*/;
    }
    static _ors(a, b) {
        return a | b /* JS('int', '# | #', a, b)*/;
    }
    // Assumes i is <= 32-bit
    static _spread(i) {
        i = JSInt_1._ors(i, JSInt_1._shrs(i, 1));
        i = JSInt_1._ors(i, JSInt_1._shrs(i, 2));
        i = JSInt_1._ors(i, JSInt_1._shrs(i, 4));
        i = JSInt_1._ors(i, JSInt_1._shrs(i, 8));
        i = JSInt_1._shru(JSInt_1._ors(i, JSInt_1._shrs(i, 16)), 0);
        return i;
    }
    //Type get runtimeType => int;
    bitneg() {
        return (~this.valueOf()) >>> 0 /* JS('JSUInt32', r'(~#) >>> 0', this)*/;
    }
};
__decorate([
    Operator(Op.BITNEG)
], JSInt.prototype, "bitneg", null);
JSInt = JSInt_1 = __decorate([
    DartClass,
    Implements(DartInt)
], JSInt);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.core;
// TODO: Convert this abstract class into a concrete class double
// that uses the patch class functionality to account for the
// different platform implementations.
/**
 * A double-precision floating point number.
 *
 * Representation of Dart doubles containing double specific constants
 * and operations and specializations of operations inherited from
 * [num]. Dart doubles are 64-bit floating-point numbers as specified in the
 * IEEE 754 standard.
 *
 * The [double] type is contagious. Operations on [double]s return
 * [double] results.
 *
 * It is a compile-time error for a class to attempt to extend or implement
 * double.
 */
let DartDouble = DartDouble_1 = class DartDouble extends DartNumber {
    constructor(d) {
        super(d);
    }
    static _create(d) {
        return new JSDouble(d);
    }
    //double remainder(num other);
    /** Addition operator. */
    //double operator +(num other);
    /** Subtraction operator. */
    //double operator -(num other);
    /** Multiplication operator. */
    //double operator *(num other);
    //double operator %(num other);
    /** Division operator. */
    //double operator /(num other);
    /**
     * Truncating division operator.
     *
     * The result of the truncating division `a ~/ b` is equivalent to
     * `(a / b).truncate()`.
     */
    //int operator ~/(num other);
    /** Negate operator. */
    //double operator -();
    /** Returns the absolute value of this [double]. */
    //double abs();
    /**
     * Returns the sign of the double's numerical value.
     *
     * Returns -1.0 if the value is less than zero,
     * +1.0 if the value is greater than zero,
     * and the value itself if it is -0.0, 0.0 or NaN.
     */
    //double get sign;
    /**
     * Returns the integer closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).round() == 4` and `(-3.5).round() == -4`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    //int round();
    /**
     * Returns the greatest integer no greater than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    //int floor();
    /**
     * Returns the least integer no smaller than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    //int ceil();
    /**
     * Returns the integer obtained by discarding any fractional
     * digits from `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    //int truncate();
    /**
     * Returns the integer double value closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).roundToDouble() == 4` and `(-3.5).roundToDouble() == -4`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`,
     * and `-0.0` is therefore considered closer to negative numbers than `0.0`.
     * This means that for a value, `d` in the range `-0.5 < d < 0.0`,
     * the result is `-0.0`.
     */
    //double roundToDouble();
    /**
     * Returns the greatest integer double value no greater than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `0.0 < d < 1.0` will return `0.0`.
     */
    //double floorToDouble();
    /**
     * Returns the least integer double value no smaller than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`.
     */
    //double ceilToDouble();
    /**
     * Returns the integer double value obtained by discarding any fractional
     * digits from `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`, and
     * in the range `0.0 < d < 1.0` it will return 0.0.
     */
    //double truncateToDouble();
    /**
     * Provide a representation of this [double] value.
     *
     * The representation is a number literal such that the closest double value
     * to the representation's mathematical value is this [double].
     *
     * Returns "NaN" for the Not-a-Number value.
     * Returns "Infinity" and "-Infinity" for positive and negative Infinity.
     * Returns "-0.0" for negative zero.
     *
     * For all doubles, `d`, converting to a string and parsing the string back
     * gives the same value again: `d == double.parse(d.toString())` (except when
     * `d` is NaN).
     */
    //String toString();
    /**
     * Parse [source] as an double literal and return its value.
     *
     * Accepts an optional sign (`+` or `-`) followed by either the characters
     * "Infinity", the characters "NaN" or a floating-point representation.
     * A floating-point representation is composed of a mantissa and an optional
     * exponent part. The mantissa is either a decimal point (`.`) followed by a
     * sequence of (decimal) digits, or a sequence of digits
     * optionally followed by a decimal point and optionally more digits. The
     * (optional) exponent part consists of the character "e" or "E", an optional
     * sign, and one or more digits.
     *
     * Leading and trailing whitespace is ignored.
     *
     * If the [source] is not a valid double literal, the [onError]
     * is called with the [source] as argument, and its return value is
     * used instead. If no `onError` is provided, a [FormatException]
     * is thrown instead.
     *
     * The [onError] function is only invoked if [source] is a [String] with an
     * invalid format. It is not invoked if the [source] is invalid for some
     * other reason, for example by being `null`.
     *
     * Examples of accepted strings:
     *
     *     "3.14"
     *     "  3.14 \xA0"
     *     "0."
     *     ".0"
     *     "-1.e3"
     *     "1234E+7"
     *     "+.12e-9"
     *     "-NaN"
     */
    static parse(source, onError) {
        return DartPrimitives.parseDouble(source, onError);
    }
};
DartDouble.NAN = 0.0 / 0.0;
DartDouble.INFINITY = 1.0 / 0.0;
DartDouble.NEGATIVE_INFINITY = -DartDouble_1.INFINITY;
DartDouble.MIN_POSITIVE = 5e-324;
DartDouble.MAX_FINITE = 1.7976931348623157e+308;
__decorate([
    defaultFactory
], DartDouble, "_create", null);
DartDouble = DartDouble_1 = __decorate([
    DartClass
], DartDouble);
let JSDouble = class JSDouble extends JSNumber {
    constructor(n) {
        super(n);
    }
};
JSDouble = __decorate([
    DartClass,
    Implements(DartDouble)
], JSDouble);
class JSPositiveInt extends JSInt {
}
class JSUInt32 extends JSPositiveInt {
}
class JSUInt31 extends JSUInt32 {
}
function iter(generator) {
    return toDartIterable({
        [Symbol.iterator]: generator
    });
}
function toDartIterable(x) {
    return new JSIterable(x);
}
class JSIterable extends DartIterableBase {
    constructor(i) {
        super();
        this.iterable = i;
    }
    get iterator() {
        return new JSIterator(this.iterable[Symbol.iterator]());
    }
    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]();
    }
}
class JSIterator {
    constructor(i) {
        this.iterator = i;
    }
    get current() {
        return this.lastResult.value;
    }
    moveNext() {
        this.lastResult = this.iterator.next();
        return !this.lastResult.done;
    }
    next(value) {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
    return(value) {
        return this.iterator.return(value);
    }
    throw(e) {
        return this.iterator.throw(e);
    }
}
/// Prints a string representation of the object to the console.
function print(object) {
    let line = `${object}`;
    if (printToZone.value == null) {
        printToConsole(line);
    }
    else {
        printToZone.value(line);
    }
}
export { DartIterable, DartEfficientLengthIterable, DartSetMixin, AbstractDartMap, DartConstantMap, DartHashMap, DartHashSet, DartLinkedHashSet, DartList, DartLinkedHashMap, DartMap, DartSet, DartStringBuffer, ArgumentError, ConcurrentModificationError, DartArrayIterator, DartConstantMapView, DartEfficientLengthMappedIterable, DartError, DartEs6LinkedHashMap, DartExpandIterable, DartExpandIterator, DartIterableBase, DartIterableMixin, DartJsLinkedHashMap, DartLinkedHashMapKeyIterable, DartLinkedHashMapKeyIterator, DartListBase, DartListIterator, DartListMapView, DartListMixin, DartMapBase, DartMapMixin, DartMappedIterable, DartMappedListIterable, DartPrimitives, DartRandom, DartReversedListIterable, DartSetBase, DartSkipIterable, DartSkipWhileIterable, DartSort, DartSubListIterable, DartTakeIterable, DartTakeWhileIterable, DartUnmodifiableListBase, DartUnmodifiableListMixin, DartUnmodifiableMapView, DartWhereIterable, DartWhereIterator, FixedLengthListBase, IndexError, JSFixedArray, JSMutableArray, JSUnmodifiableArray, LinkedHashMapCell, RangeError, StateError, UnmodifiableMapBase, UnsupportedError, DartObject, DartStackTrace, DartDuration, DartIntegerDivisionByZeroException, NullThrownError, DartStopwatch, DartDateTime, FormatException, DartPattern, DartRegExp, 
//JSSyntaxRegExp, regExpCaptureCount, regExpGetNative, regExpGetGlobalNative, firstMatchAfter,
DartString, DartStringMatch, DartRunes, DartRuneIterator, DartCodeUnits, JSNumber, JSInt, JSDouble, DartNumber, DartInt, DartDouble, iter, toDartIterable, JSIterable, JSIterator, print };
//# sourceMappingURL=core.js.map