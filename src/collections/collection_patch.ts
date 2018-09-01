// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// Patch file for dart:collection classes.


import {bool, int, num, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {DartClass, defaultFactory, namedConstructor, namedFactory} from "../utils";
import {identical, identityHashCode} from "../core/identical";
import {DartEfficientLengthIterable, DartIterable, DartIterator, DartList, DartMappedIterable} from "../collections";
import {DartMap} from "../core/map";
import {ConcurrentModificationError, StateError} from "../errors";
import _dart from '../_common';
import {_defaultEquals, _defaultHashCode, _Equality, _Hasher, _Predicate, DartHashMap} from "./hash_map";
import {DartMaps} from "../core/maps";
import {DartSet} from "../core/set";
import {_HashSetBase, DartHashSet} from "./hash_set";
import {DartJsLinkedHashMap, LinkedHashMapCell} from "./linked_hash_map";
import {DartLinkedHashSet} from "./linked_hash_set";

const _USE_ES6_MAPS:bool =true;



export class _HashMap<K, V> implements DartHashMap<K, V> {
    protected _length:int = 0;

    // The hash map contents are divided into three parts: one part for
    // string keys, one for numeric keys, and one for the rest. String
    // and numeric keys map directly to their values, but the rest of
    // the entries are stored in bucket lists of the form:
    //
    //    [key-0, value-0, key-1, value-1, ...]
    //
    // where all keys in the same bucket share the same hash code.
    protected _strings:any;
    protected _nums:any;
    protected _rest:any;

    // When iterating over the hash map, it is very convenient to have a
    // list of all the keys. We cache that on the instance and clear the
    // the cache whenever the key set changes. This is also used to
    // guard against concurrent modifications.
    protected _keys:DartList<any>;

    constructor() {

    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    get keys(): DartIterable<K> {
        return new _HashMapKeyIterable<K>(this);
    }

    get values(): DartIterable<V> {
        return new DartMappedIterable<K, V>(this.keys, (each) => this[OPERATOR_INDEX](each));
    }

    containsKey(key: any): bool {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashMap._hasTableEntry(strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashMap._hasTableEntry(nums, key);
        } else {
            return this._containsKey(key);
        }
    }

    _containsKey(key: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, key);
        return this._findBucketIndex(bucket, key) >= 0;
    }

    containsValue(value: any): bool {
        return this._computeKeys().any((each) => this[OPERATOR_INDEX](each) == value);
    }

    addAll(other: DartMap<K, V>): void {
        other.forEach((key: K, value: V) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }

    [OPERATOR_INDEX](key: any): V {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? null : _HashMap._getTableEntry(strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? null : _HashMap._getTableEntry(nums, key);
        } else {
            return this._get(key);
        }
    }

    protected _get(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        return (index < 0) ? null : bucket[index + 1] /* JS('var', '#[#]', bucket, index + 1)*/;
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _HashMap._newHashTable();
            this._addHashTableEntry(strings, key, value);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _HashMap._newHashTable();
            this._addHashTableEntry(nums, key, value);
        } else {
            this._set(key, value);
        }
    }

    protected _set(key: K, value: V): void {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _HashMap._newHashTable();
        let hash = this._computeHashCode(key);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashMap._setTableEntry(rest, hash, [key, value] /* JS('var', '[#, #]', key, value)*/);
            this._length++;
            this._keys = null;
        } else {
            let index: int = this._findBucketIndex(bucket, key);
            if (index >= 0) {
                bucket[index + 1] = value;
                /* JS('void', '#[#] = #', bucket, index + 1, value); */
            } else {
                bucket.push(key, value);
                /* JS('void', '#.push(#, #)', bucket, key, value); */
                this._length++;
                this._keys = null;
            }
        }
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) return this[OPERATOR_INDEX](key);
        let value: V = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }

    remove(key: any): V {
        if (_HashMap._isStringKey(key)) {
            return this._removeHashTableEntry(this._strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            return this._removeHashTableEntry(this._nums, key);
        } else {
            return this._remove(key);
        }
    }

    protected _remove(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index: int = this._findBucketIndex(bucket, key);
        if (index < 0) return null;
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        this._length--;
        this._keys = null;
        // Use splice to remove the two [key, value] elements at the
        // index and return the value.
        return bucket.splice(index, 2)[1] /* JS('var', '#.splice(#, 2)[1]', bucket, index)*/;
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._keys = null;
            this._length = 0;
        }
    }

    forEach(action: (key: K, value: V) => any): void {
        let keys: DartList<any> = this._computeKeys();
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i] /* JS('var', '#[#]', keys, i)*/;
            action(key, this[OPERATOR_INDEX](key));
            if (keys !== this._keys /* JS('bool', '# !== #', keys, _keys)*/) {
                throw new ConcurrentModificationError(this);
            }
        }
    }

    protected _computeKeys(): DartList<any> {
        if (this._keys != null) return this._keys;
        let result: DartList<any> = new DartList(this._length);
        let index = 0;

        // Add all string keys to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /* JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let key: string = names[i] /* JS('String', '#[#]', names, i)*/;
                result[OPERATOR_INDEX_ASSIGN](index, key);
                /* JS('void', '#[#] = #', result, index, key);*/
                index++;
            }
        }

        // Add all numeric keys to the list.
        let nums = this._nums;
        if (nums != null) {
            var names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the keys back to numbers (+).
                let key: int = +names[i] /* JS('num', '+#[#]', names, i)*/;
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
                let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
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

    protected _addHashTableEntry(table: any, key: K, value: V): void {
        if (!_HashMap._hasTableEntry(table, key)) {
            this._length++;
            this._keys = null;
        }
        _HashMap._setTableEntry(table, key, value);
    }

    _removeHashTableEntry(table: any, key: any): V {
        if (table != null && _HashMap._hasTableEntry(table, key)) {
            let value: V = _HashMap._getTableEntry(table, key);
            _HashMap._deleteTableEntry(table, key);
            this._length--;
            this._keys = null;
            return value;
        } else {
            return null;
        }
    }

    protected static _isStringKey(key: any): bool {
        return _dart.is(key, 'string') && key != '__proto__';
    }

    protected static _isNumericKey(key: any): bool {
        // Only treat unsigned 30-bit integers as numeric keys. This way,
        // we avoid converting them to strings when we use them as keys in
        // the JavaScript hash table object.
        return _dart.is(key, 'num') && (key & 0x3ffffff) === key /*JS('bool', '(# & 0x3ffffff) === #', key, key)*/;
    }

    protected _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return key.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', key.hashCode)*/;
    }

    protected static _hasTableEntry(table: any, key: any): bool {
        let entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }

    protected static _getTableEntry(table: any, key: any): any {
        let entry = table[key] /* JS('var', '#[#]', table, key)*/;
        // We store the table itself as the entry to signal that it really
        // is a null value, so we have to map back to null here.
        return entry === table /*JS('bool', '# === #', entry, table)*/ ? null : entry;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        // We only store non-null entries in the table, so we have to
        // change null values to refer to the table itself. Such values
        // will be recognized and mapped back to null on access.
        if (value == null) {
            // Do not update [value] with [table], otherwise our
            // optimizations could be confused by this opaque object being
            // now used for more things than storing and fetching from it.
            table[key] = table;
            /* JS('void', '#[#] = #', table, key, table); */
        } else {
            table[key] = value;
            /* JS('void', '#[#] = #', table, key, value);*/
        }
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        delete table[key];
        /* JS('void', 'delete #[#]', table, key); */
    }

    protected _getBucket(table: any, key: any): Array<any> {
        let hash = this._computeHashCode(key);
        return table[hash] /* JS('var', '#[#]', table, hash) */;
    }

    protected _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (_dart.equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
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
}

export class _IdentityHashMap<K, V> extends _HashMap<K, V> {

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (identical(bucket[i]/*JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }
}

export class _CustomHashMap<K, V> extends _HashMap<K, V> {
    protected  _equals: _Equality<K>;
    protected _hashCode: _Hasher<K>;
    protected _validKey: _Predicate<any>;

    constructor(_equals: _Equality<K>, _hashCode: _Hasher<K>, validKey: (potentialKey: any) => bool) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((_: any) => true /*v is K*/);
    }

    [OPERATOR_INDEX](key: any): V {
        if (!this._validKey(key)) return null;
        return super._get(key);
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        super._set(key, value);
    }

    containsKey(key: any): bool {
        if (!this._validKey(key)) return false;
        return super._containsKey(key);
    }

    remove(key: any): V {
        if (!this._validKey(key)) return null;
        return super._remove(key);
    }

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }

    _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (this._equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
}

class _HashMapKeyIterable<E> extends DartEfficientLengthIterable<E> {
     protected _map:any;
    constructor(_map:any) {
        super();
        this._map = _map;
    }

    get length(): int {
        return this._map._length;
    }

    get isEmpty(): bool {
        return this._map._length == 0;
    }

    get iterator(): DartIterator<E> {
        return new _HashMapKeyIterator<E>(this._map, this._map._computeKeys());
    }

    contains(element: any): bool {
        return this._map.containsKey(element);
    }

    forEach(f: (element: E) => any): void {
        let keys: DartList<any> = this._map._computeKeys();
        for (let i = 0, length = keys.length /* JS('int', '#.length', keys)*/; i < length; i++) { // TODO: investigate why this was using the js length property
            f(keys[OPERATOR_INDEX](i)/*JS('var', '#[#]', keys, i)*/); // <- TODO :Investigate why this was using the js square operator, it can be because of optimization reasons ? like we are sure here it is the native implementation of list and thus the square operator works ?
            if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}

class _HashMapKeyIterator<E> implements DartIterator<E> {
    protected  _map:any;
    protected  _keys:DartList<any>;
    protected _offset:int = 0;
    protected _current:E;

    constructor(_map:any, _keys:DartList<any>) {
        this._map = _map;
        this._keys = _keys;
    }

    get current():E { return this._current;}

    moveNext(): bool {
        let keys = this._keys;
        let offset = this._offset;
        if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
            throw new ConcurrentModificationError(this._map);
        } else if (offset >= keys.length /* JS('int', '#.length', keys)*/) {
            this._current = null;
            return false;
        } else {
            this._current = keys[OPERATOR_INDEX](offset) /* JS('var', '#[#]', keys, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /* JS('int', '#', offset + 1)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return undefined;
    }
}

@DartClass
export class _LinkedIdentityHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    protected static get _supportsEs6Maps(): bool {
        return typeof Map != 'undefined' /* JS('returns:bool;depends:none;effects:none;throws:never;gvn:true',
            'typeof Map != "undefined"')*/;
    }

    @namedFactory
    protected static _es6<K, V>(): _LinkedIdentityHashMap<K, V> {
        return (_USE_ES6_MAPS && _LinkedIdentityHashMap._supportsEs6Maps)
            ? new _Es6LinkedIdentityHashMap<K, V>()
            : new _LinkedIdentityHashMap<K, V>();
    }

    static es6: new<K, V>() => _LinkedIdentityHashMap<K, V>;

    constructor() {
        super();
    }

    internalComputeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /* JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    internalFindBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell: LinkedHashMapCell<K,V> = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell.hashMapCellKey, key)) return i;
        }
        return -1;
    }
}

class _Es6LinkedIdentityHashMap<K, V> extends _LinkedIdentityHashMap<K, V> {
    _map: Map<K,V>;
    _modifications: int = 0;

    constructor() {
        super();
        this._map = new Map() /* JS('var', 'new Map()')*/;
    }

    get length(): int {
        return this._map.size /* JS('int', '#.size', _map)*/;
    }

    get isEmpty(): bool {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    get keys(): DartIterable<K> {
        return new _Es6MapIterable<K>(this, true);
    }

    get values(): DartIterable<V> {
        return new _Es6MapIterable<V>(this, false);
    }

    containsKey(key: any): bool {
        return this._map.has(key) /* JS('bool', '#.has(#)', _map, key)*/;
    }

    containsValue(value: any): bool {
        return this.values.any((each) => _dart.equals(each, value)); // TODO : here a simple equality could be enough ? (this is an itentify hashmap after all)
    }

    addAll(other: DartMap<K, V>): void {
        other.forEach((key, value) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }

    [OPERATOR_INDEX](key: any): V {
        return this._map.get(key) /*JS('var', '#.get(#)', _map, key)*/;
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        /*JS('var', '#.set(#, #)', _map, key, value);*/
        this._map.set(key, value);
        this._modified();
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) return this[OPERATOR_INDEX](key);
        let value = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }

    remove(key: any): V {
        let value = this[OPERATOR_INDEX](key);
        /* JS('bool', '#.delete(#)', _map, key);*/
        this._map.delete(key);
        this._modified();
        return value;
    }

    clear(): void {
        /* JS('void', '#.clear()', _map);*/
        this._map.clear();
        this._modified();
    }

    forEach(action: (key: K, value: V) => any): void {
        let jsEntries = this._map.entries() /* JS('var', '#.entries()', _map)*/;
        let modifications = this._modifications;
        while (true) {
            let next = jsEntries.next() /*JS('var', '#.next()', jsEntries)*/;
            let done = next.done /*JS('bool', '#.done', next)*/;
            if (done) break;
            let entry = next.value /* JS('var', '#.value', next)*/;
            let key = entry[0] /* JS('var', '#[0]', entry)*/;
            let value = entry[1] /* JS('var', '#[1]', entry)*/;
            action(key, value);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
        }
    }

    protected _modified(): void {
        // Value cycles after 2^30 modifications so that modification counts are
        // always unboxed (Smi) values. Modification detection will be missed if you
        // make exactly some multiple of 2^30 modifications between advances of an
        // iterator.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
}

class _Es6MapIterable<E> extends DartEfficientLengthIterable<E> {
    protected _map: _Es6LinkedIdentityHashMap<any, any>;
    protected _isKeys: bool;

    constructor(_map: _Es6LinkedIdentityHashMap<any, any>, _isKeys: bool) {
        super();
        this._map = _map;
        this._isKeys = _isKeys;
    }

    get length(): int {
        return this._map.length;
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get iterator(): DartIterator<E> {
        return new _Es6MapIterator<E>(this._map, this._map._modifications, this._isKeys);
    }

    contains(element): bool {
        return this._isKeys ? this._map.containsKey(element) : this._map.containsValue(element);
    }

    forEach(f: (element: E) => any): void {
        let jsIterator;
        if (this._isKeys) {
            jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        } else {
            jsIterator = this._map._map.values() /* JS('var', '#.values()', _map._map)*/;
        }
        let modifications = this._map._modifications;
        while (true) {
            let next = jsIterator.next() /* JS('var', '#.next()', jsIterator)*/;
            let done = next.done /* JS('bool', '#.done', next)*/;
            if (done) break;
            let value = next.value /* JS('var', '#.value', next)*/;
            f(value);
            if (modifications != this._map._modifications) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}

class _Es6MapIterator<E> implements DartIterator<E> {
    protected _map: _Es6LinkedIdentityHashMap<any, any>;
    protected _modifications: int;
    protected _isKeys: bool;
    protected _jsIterator: Iterator<any>;
    protected _next: IteratorResult<any>;
    protected _current: E;
    protected _done: bool;

    constructor(_map: _Es6LinkedIdentityHashMap<any, any>,
                _modifications: int,
                _isKeys: bool
    ) {
        this._map = _map;
        this._modifications = _modifications;
        this._isKeys = _isKeys;
        if (_isKeys) {
            this._jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        } else {
            this._jsIterator = this._map._map.values() /*JS('var', '#.values()', _map._map)*/;
        }
        this._done = false;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        if (this._modifications != this._map._modifications) {
            throw new ConcurrentModificationError(this._map);
        }
        if (this._done) return false;
        this._next = this._jsIterator.next() /*JS('var', '#.next()', _jsIterator)*/;
        let done = this._next.done /* JS('bool', '#.done', _next)*/;
        if (done) {
            this._current = null;
            this._done = true;
            return false;
        } else {
            this._current = this._next.value /* JS('var', '#.value', _next)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

// TODO(floitsch): use ES6 maps when available.
export class _LinkedCustomHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    protected _equals: _Equality<K>;
    protected _hashCode: _Hasher<K>;
    protected _validKey: _Predicate<any>;

    constructor(_equals: _Equality<K>,
                _hashCode: _Hasher<K>, validKey: (potentialKey) => bool) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((v) => true);
    }

    [OPERATOR_INDEX](key) {
        if (!this._validKey(key)) return null;
        return super.internalGet(key);
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        super.internalSet(key, value);
    }

    containsKey(key): bool {
        if (!this._validKey(key)) return false;
        return super.internalContainsKey(key);
    }

    remove(key: any): V {
        if (!this._validKey(key)) return null;
        return super.internalRemove(key);
    }

    internalComputeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }

    internalFindBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell: LinkedHashMapCell<K,V> = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (this._equals(cell.hashMapCellKey, key)) return i;
        }
        return -1;
    }
}

export class _HashSet<E> extends _HashSetBase<E> implements DartHashSet<E> {
    protected _length:int = 0;

    // The hash set contents are divided into three parts: one part for
    // string elements, one for numeric elements, and one for the
    // rest. String and numeric elements map directly to a sentinel
    // value, but the rest of the entries are stored in bucket lists of
    // the form:
    //
    //    [element-0, element-1, element-2, ...]
    //
    // where all elements in the same bucket share the same hash code.
    protected _strings:any;
    protected _nums:any;
    protected _rest:any;

    // When iterating over the hash set, it is very convenient to have a
    // list of all the elements. We cache that on the instance and clear
    // the cache whenever the set changes. This is also used to
    // guard against concurrent modifications.
    _elements:Array<E>;

    constructor() {
        super();
    }

    protected _newSet(): DartSet<E> {
        return new _HashSet<E>();
    }

    // Iterable.
    get iterator(): DartIterator<E> {
        return new _HashSetIterator<E>(this, this._computeElements());
    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    contains(object: any): bool {
        if (_HashSet._isStringElement(object)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashSet._hasTableEntry(strings, object);
        } else if (_HashSet._isNumericElement(object)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashSet._hasTableEntry(nums, object);
        } else {
            return this._contains(object);
        }
    }

    protected _contains(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }

    lookup(object: any): E {
        if (_HashSet._isStringElement(object) || _HashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        }
        return this._lookup(object);
    }

    protected _lookup(object: any): E {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return null;
        return bucket[index];
    }

    // Collection.
    add(element: E): bool {
        if (_HashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _HashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        } else if (_HashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _HashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        } else {
            return this._add(element);
        }
    }

    protected _add(element: E): bool {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _HashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashSet._setTableEntry(rest, hash, [element] /*JS('var', '[#]', element)*/);
        } else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0) return false;
            /*JS('void', '#.push(#)', bucket, element);*/
            bucket.push(element);
        }
        this._length++;
        this._elements = null;
        return true;
    }

    addAll(objects: DartIterable<E>): void {
        for (let each of objects) {
            this.add(each);
        }
    }

    remove(object: any): bool {
        if (_HashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        } else if (_HashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        } else {
            return this._remove(object);
        }
    }

    protected _remove(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        var bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
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

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._elements = null;
            this._length = 0;
        }
    }

    _computeElements(): Array<E> {
        if (this._elements != null) return this._elements;
        let result = new Array(this._length);
        let index = 0;

        // Add all string elements to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /*JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let element: string = names[i] /*JS('String', '#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }

        // Add all numeric elements to the list.
        let nums = this._nums;
        if (nums != null) {
            let names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the elements back to numbers (+).
                let element: num = +names[i] /* JS('num', '+#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }

        // Add all the remaining elements to the list.
        let rest = this._rest;
        if (rest != null) {
            let names = Object.getOwnPropertyNames(rest) /*JS('var', 'Object.getOwnPropertyNames(#)', rest)*/;
            let entries: int = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let entry = names[i] /* JS('String', '#[#]', names, i)*/;
                let bucket = rest[entry] /*JS('var', '#[#]', rest, entry)*/;
                let length: int = bucket.length /*JS('int', '#.length', bucket)*/;
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

    protected _addHashTableEntry(table: any, element: E): bool {
        if (_HashSet._hasTableEntry(table, element)) return false;
        _HashSet._setTableEntry(table, element, 0);
        this._length++;
        this._elements = null;
        return true;
    }

    protected _removeHashTableEntry(table: any, element: any): bool {
        if (table != null && _HashSet._hasTableEntry(table, element)) {
            _HashSet._deleteTableEntry(table, element);
            this._length--;
            this._elements = null;
            return true;
        } else {
            return false;
        }
    }

    protected static _isStringElement(element: any): bool {
        return _dart.is(element, 'string') && element != '__proto__';
    }

    protected static _isNumericElement(element: any): bool {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element
            /*JS('bool', '(# & 0x3ffffff) === #', element, element)*/;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /*JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }

    protected static _hasTableEntry(table: any, key: any): bool {
        var entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        /* JS('void', 'delete #[#]', table, key);*/
        delete table[key];
    }

    protected _getBucket(table: any, element: any): Array<any> {
        let hash = this._computeHashCode(element);
        return table[hash] /* JS('var', '#[#]', table, hash)*/;
    }

    protected _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (_dart.equals(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
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

export class _IdentityHashSet<E> extends _HashSet<E> {
    protected _newSet(): DartSet<E> {
        return new _IdentityHashSet<E>();
    }

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    protected _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (identical(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }
}

export class _CustomHashSet<E> extends _HashSet<E> {
    protected _equality:_Equality<E>;
    protected _hasher:_Hasher<E>;
    protected _validKey:_Predicate<any>;
    constructor(_equality, _hasher,  validKey:(potentialKey:any)=>bool) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }

    protected _newSet(): DartSet<E> {
        return new _CustomHashSet<E>(this._equality, this._hasher, this._validKey);
    }

    _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (this._equality(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }

    add(object: E): bool {
        return super._add(object);
    }

    contains(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._contains(object);
    }

    lookup(object: any): E {
        if (!this._validKey(object)) return null;
        return super._lookup(object);
    }

    remove(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._remove(object);
    }
}

// TODO(kasperl): Share this code with _HashMapKeyIterator<E>?
class _HashSetIterator<E> implements DartIterator<E> {
    protected _set:_HashSet<E>;
    protected _elements:Array<E>;
    protected _offset:int = 0;
    protected _current:E;

    constructor(_set: _HashSet<E>, _elements: Array<E>) {
        this._set = _set;
        this._elements = _elements;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        let elements = this._elements;
        let offset: int = this._offset;
        if (elements !== this._set._elements /*JS('bool', '# !== #', elements, _set._elements)*/) {
            throw new ConcurrentModificationError(this._set);
        } else if (offset >= elements.length /*JS('int', '#.length', elements)*/) {
            this._current = null;
            return false;
        } else {
            this._current = elements[offset] /* JS('var', '#[#]', elements, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /*JS('int', '#', offset + 1)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

export class _LinkedHashSet<E> extends _HashSetBase<E> implements DartLinkedHashSet<E> {
    protected _length: int = 0;

    // The hash set contents are divided into three parts: one part for
    // string elements, one for numeric elements, and one for the
    // rest. String and numeric elements map directly to their linked
    // cells, but the rest of the entries are stored in bucket lists of
    // the form:
    //
    //    [cell-0, cell-1, ...]
    //
    // where all elements in the same bucket share the same hash code.
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;

    // The elements are stored in cells that are linked together
    // to form a double linked list.
    _first: _LinkedHashSetCell<E>;
    protected _last: _LinkedHashSetCell<E>;

    // We track the number of modifications done to the element set to
    // be able to throw when the set is modified while being iterated
    // over.
    _modifications: int = 0;

    constructor() {
        super();
    }

    protected _newSet(): DartSet<E> {
        return new _LinkedHashSet<E>();
    }

    protected _unsupported(operation: string): void {
        throw 'LinkedHashSet: unsupported $operation';
    }

    // Iterable.
    get iterator(): DartIterator<E> {
        return new _LinkedHashSetIterator(this, this._modifications);
    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty() {
        return !this.isEmpty;
    }

    contains(object: any): bool {
        if (_LinkedHashSet._isStringElement(object)) {
            let strings = this._strings;
            if (strings == null) return false;
            let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(strings, object);
            return cell != null;
        } else if (_LinkedHashSet._isNumericElement(object)) {
            let nums = this._nums;
            if (nums == null) return false;
            let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(nums, object);
            return cell != null;
        } else {
            return this._contains(object);
        }
    }

    protected _contains(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }

    lookup(object: any): E {
        if (_LinkedHashSet._isStringElement(object) || _LinkedHashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        } else {
            return this._lookup(object);
        }
    }

    _lookup(object: any): E {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return null;
        return bucket[index]._element;
    }

    forEach(action: (element: E) => void): void {
        let cell: _LinkedHashSetCell<E> = this._first;
        let modifications = this._modifications;
        while (cell != null) {
            action(cell._element);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            cell = cell._next;
        }
    }

    get first(): E {
        if (this._first == null) throw new StateError("No elements");
        return this._first._element;
    }

    get last(): E {
        if (this._last == null) throw new StateError("No elements");
        return this._last._element;
    }

    // Collection.
    add(element: E): bool {
        if (_LinkedHashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        } else if (_LinkedHashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        } else {
            return this._add(element);
        }
    }

    protected _add(element: E): bool {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _LinkedHashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket: Array<_LinkedHashSetCell<E>> = rest[hash] /*JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {

            let cell: _LinkedHashSetCell<E> = this._newLinkedCell(element);
            _LinkedHashSet._setTableEntry(rest, hash, [cell] /*JS('var', '[#]', cell)*/);
        } else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0) return false;
            let cell: _LinkedHashSetCell<E> = this._newLinkedCell(element);
            /*JS('void', '#.push(#)', bucket, cell);*/
            bucket.push(cell);
        }
        return true;
    }

    remove(object: any): bool {
        if (_LinkedHashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        } else if (_LinkedHashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        } else {
            return this._remove(object);
        }
    }

    protected _remove(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket: Array<_LinkedHashSetCell<E>> = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
        // Use splice to remove the [cell] element at the index and
        // unlink it.
        let cell = bucket.splice(index, 1)[0] /*JS('var', '#.splice(#, 1)[0]', bucket, index)*/;
        this._unlinkCell(cell);
        return true;
    }

    removeWhere(test: (element: E) => bool): void {
        this._filterWhere(test, true);
    }

    retainWhere(test: (element: E) => bool): void {
        this._filterWhere(test, false);
    }

    protected _filterWhere(test: (element: E) => bool, removeMatching: bool): void {
        let cell: _LinkedHashSetCell<E> = this._first;
        while (cell != null) {
            let element: E = cell._element;
            let next = cell._next;
            let modifications = this._modifications;
            let shouldRemove = (removeMatching == test(element));
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            if (shouldRemove) this.remove(element);
            cell = next;
        }
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._first = this._last = null;
            this._length = 0;
            this._modified();
        }
    }

    protected _addHashTableEntry(table: any, element: E): bool {
        let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(table, element);
        if (cell != null) return false;
        _LinkedHashSet._setTableEntry(table, element, this._newLinkedCell(element));
        return true;
    }

    protected _removeHashTableEntry(table: any, element: any): bool {
        if (table == null) return false;
        let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(table, element);
        if (cell == null) return false;
        this._unlinkCell(cell);
        _LinkedHashSet._deleteTableEntry(table, element);
        return true;
    }

    protected _modified(): void {
        // Value cycles after 2^30 modifications. If you keep hold of an
        // iterator for that long, you might miss a modification
        // detection, and iteration can go sour. Don't do that.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }

// Create a new cell and link it in as the last one in the list.

    _newLinkedCell(element: E): _LinkedHashSetCell<E> {
        let cell: _LinkedHashSetCell<E> = new _LinkedHashSetCell<E>(element);
        if (this._first == null) {
            this._first = this._last = cell;
        } else {
            let last: _LinkedHashSetCell<E> = this._last;
            cell._previous = last;
            this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
    }

    // Unlink the given cell from the linked list of cells.
    protected _unlinkCell(cell: _LinkedHashSetCell<E>): void {
        let previous: _LinkedHashSetCell<E> = cell._previous;
        let next: _LinkedHashSetCell<E> = cell._next;
        if (previous == null) {
            // assert(cell == _first);
            this._first = next;
        } else {
            previous._next = next;
        }
        if (next == null) {
            //assert(cell == _last);
            this._last = previous;
        } else {
            next._previous = previous;
        }
        this._length--;
        this._modified();
    }

    protected static _isStringElement(element: any): bool {
        return _dart.is(element, 'string') && element != '__proto__';
    }

    protected static _isNumericElement(element: any): bool {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element
            /*JS('bool', '(# & 0x3ffffff) === #', element, element)*/;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }

    protected static _getTableEntry(table: any, key: any) {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        //JS('void', 'delete #[#]', table, key);
        delete table[key];
    }

    protected _getBucket(table: any, element: E): Array<_LinkedHashSetCell<E>> {
        let hash = this._computeHashCode(element);
        return table[hash] /*JS('var', '#[#]', table, hash)*/;
    }

    protected _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (_dart.equals(cell._element, element)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
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

export class _LinkedIdentityHashSet<E> extends _LinkedHashSet<E> {
    protected _newSet(): DartSet<E> {
        return new _LinkedIdentityHashSet<E>();
    }

    protected _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*  JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell: _LinkedHashSetCell<E> = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell._element, element)) return i;
        }
        return -1;
    }
}

export class _LinkedCustomHashSet<E> extends _LinkedHashSet<E> {
    protected _equality: _Equality<E>;
    protected _hasher: _Hasher<E>;
    protected _validKey: _Predicate<any>;

    constructor(
        _equality: _Equality<E>, _hasher: _Hasher<E>, validKey: (potentialKey) => bool) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }

    protected _newSet(): DartSet<E> {
        return new _LinkedCustomHashSet<E>(this._equality, this._hasher, this._validKey);
    }

    protected _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (this._equality(cell._element, element)) return i;
        }
        return -1;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }

    add(element: E): bool {
        return super._add(element);
    }

    contains(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._contains(object);
    }

    lookup(object: any): E {
        if (!this._validKey(object)) return null;
        return super._lookup(object);
    }

    remove(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._remove(object);
    }

    containsAll(elements: DartIterable<any>): bool {
        for (let element in elements) {
            if (!this._validKey(element) || !this.contains(element)) return false;
        }
        return true;
    }

    removeAll(elements: DartIterable<any>): void {
        for (let element of elements) {
            if (this._validKey(element)) {
                super._remove(element);
            }
        }
    }
}

class _LinkedHashSetCell<E> {
     _element:E;

     _next:_LinkedHashSetCell<E>;
     _previous:_LinkedHashSetCell<E>;

    constructor(element:E) {
        this._element =element;
    }
}

// TODO(kasperl): Share this code with LinkedHashMapKeyIterator<E>?
class _LinkedHashSetIterator<E> implements DartIterator<E> {
    protected _set: _LinkedHashSet<E>;
    protected _modifications: int;
    protected _cell: _LinkedHashSetCell<E>;
    protected _current: E;

    constructor(_set: _LinkedHashSet<E>, _modifications: int) {
        this._set = _set;
        this._modifications = _modifications;
        this._cell = _set._first;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        if (this._modifications != this._set._modifications) {
            throw new ConcurrentModificationError(this._set);
        } else if (this._cell == null) {
            this._current = null;
            return false;
        } else {
            this._current = this._cell._element;
            this._cell = this._cell._next;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
