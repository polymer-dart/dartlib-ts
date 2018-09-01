// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// Efficient JavaScript based implementation of a linked hash map used as a
// backing map for constant maps and the [LinkedHashMap] patch

// part of _js_helper;


import {bool, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {DartClass, defaultConstructor, namedFactory} from "../utils";
import {DartEfficientLengthIterable, DartIterable, DartIterator, DartMappedIterable} from "../collections";
import _dart from '../_common';
import {DartMap} from "../core/map";
import {ConcurrentModificationError} from "../errors";
import {DartMaps} from "../core/maps";
import {DartLinkedHashMap} from "../core/linked_hash_map";

const _USE_ES6_MAPS = true;

/* const bool.fromEnvironment("dart2js.use.es6.maps");*/

@DartClass
export class DartJsLinkedHashMap<K, V> implements DartLinkedHashMap<K, V> {
    _length: int = 0;

    // The hash map contents are divided into three parts: one part for
    // string keys, one for numeric keys, and one for the rest. String
    // and numeric keys map directly to their linked cells, but the rest
    // of the entries are stored in bucket lists of the form:
    //
    //    [cell-0, cell-1, ...]
    //
    // where all keys in the same bucket share the same hash code.
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;

    // The keys and values are stored in cells that are linked together
    // to form a double linked list.
    _first: LinkedHashMapCell<K, V>;
    protected _last: LinkedHashMapCell<K, V>;

    // We track the number of modifications done to the key set of the
    // hash map to be able to throw when the map is modified while being
    // iterated over.
    _modifications: int = 0;

    protected static get _supportsEs6Maps(): bool {
        return typeof Map != "undefined" /* JS('returns:bool;depends:none;effects:none;throws:never;gvn:true',
            'typeof Map != "undefined"')*/;
    }

    constructor() {
    }

    @defaultConstructor
    protected _init() {
    }

    /// If ES6 Maps are available returns a linked hash-map backed by an ES6 Map.
    //@ForceInline()
    @namedFactory
    protected static _es6<K, V>(): DartJsLinkedHashMap<K, V> {
        return (_USE_ES6_MAPS && DartJsLinkedHashMap._supportsEs6Maps)
            ? new DartEs6LinkedHashMap<K, V>()
            : new DartJsLinkedHashMap<K, V>();
    }

    static es6: new<K, V>() => DartJsLinkedHashMap<K, V>;

    get length(): int {
        return this._length;
    }

    get isEmpty() {
        return this._length == 0;
    }

    get isNotEmpty() {
        return !this.isEmpty;
    }

    get keys(): DartIterable<K> {
        return new DartLinkedHashMapKeyIterable<K>(this);
    }

    get values(): DartIterable<V> {
        return new DartMappedIterable<K, V>(this.keys, (each) => this[OPERATOR_INDEX](each));
    }

    containsKey(key: any): bool {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null) return false;
            return this._containsTableEntry(strings, key);
        } else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null) return false;
            return this._containsTableEntry(nums, key);
        } else {
            return this.internalContainsKey(key);
        }
    }

    internalContainsKey(key: any): bool {
        var rest = this._rest;
        if (rest == null) return false;
        var bucket = this._getBucket(rest, key);
        return this.internalFindBucketIndex(bucket, key) >= 0;
    }

    containsValue(value: any): bool {
        return this.keys.any((each) => _dart.equals(this[OPERATOR_INDEX](each), value));
    }

    addAll(other: DartMap<K, V>): void {
        other.forEach((key: K, value: V) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }

    [OPERATOR_INDEX](key: any): V {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null) return null;
            let cell: LinkedHashMapCell<K, V> = this._getTableCell(strings, key);
            return (cell == null) ? null : cell.hashMapCellValue;
        } else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null) return null;
            let cell: LinkedHashMapCell<K, V> = this._getTableCell(nums, key);
            return (cell == null) ? null : cell.hashMapCellValue;
        } else {
            return this.internalGet(key);
        }
    }

    internalGet(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index = this.internalFindBucketIndex(bucket, key);
        if (index < 0) return null;
        let cell: LinkedHashMapCell<K, V> = bucket[index] /*JS('var', '#[#]', bucket, index)*/;
        return cell.hashMapCellValue;
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        if (_isStringKey(key)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = this._newHashTable();
            this._addHashTableEntry(strings, key, value);
        } else if (_isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = this._newHashTable();
            this._addHashTableEntry(nums, key, value);
        } else {
            this.internalSet(key, value);
        }
    }

    internalSet(key: K, value: V): void {
        let rest = this._rest;
        if (rest == null) this._rest = rest = this._newHashTable();
        let hash = this.internalComputeHashCode(key);
        let bucket = this._getTableBucket(rest, hash);
        if (bucket == null) {
            let cell: LinkedHashMapCell<K, V> = this._newLinkedCell(key, value);
            this._setTableEntry(rest, hash, [cell] /*JS('var', '[#]', cell)*/);
        } else {
            let index: int = this.internalFindBucketIndex(bucket, key);
            if (index >= 0) {
                let cell: LinkedHashMapCell<K, V> = bucket[index] /* JS('var', '#[#]', bucket, index)*/;
                cell.hashMapCellValue = value;
            } else {
                let cell: LinkedHashMapCell<K, V> = this._newLinkedCell(key, value);
                bucket.push(cell);
                //JS('void', '#.push(#)', bucket, cell);
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
        if (_isStringKey(key)) {
            return this._removeHashTableEntry(this._strings, key);
        } else if (_isNumericKey(key)) {
            return this._removeHashTableEntry(this._nums, key);
        } else {
            return this.internalRemove(key);
        }
    }

    internalRemove(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index = this.internalFindBucketIndex(bucket, key);
        if (index < 0) return null;
        // Use splice to remove the [cell] element at the index and
        // unlink the cell before returning its value.
        let cell: LinkedHashMapCell<K, V> = bucket.splice(index, 1)[0]
            /*JS('var', '#.splice(#, 1)[0]', bucket, index)*/;
        this._unlinkCell(cell);
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        return cell.hashMapCellValue;
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._first = this._last = null;
            this._length = 0;
            this._modified();
        }
    }

    forEach(action: (key: K, value: V) => any): void {
        let cell: LinkedHashMapCell<K, V> = this._first;
        let modifications = this._modifications;
        while (cell != null) {
            action(cell.hashMapCellKey, cell.hashMapCellValue);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            cell = cell._next;
        }
    }

    protected _addHashTableEntry(table: any, key: K, value: V): void {
        let cell: LinkedHashMapCell<K, V> = this._getTableCell(table, key);
        if (cell == null) {
            this._setTableEntry(table, key, this._newLinkedCell(key, value));
        } else {
            cell.hashMapCellValue = value;
        }
    }

    protected _removeHashTableEntry(table: any, key: any): V {
        if (table == null) return null;
        let cell: LinkedHashMapCell<K, V> = this._getTableCell(table, key);
        if (cell == null) return null;
        this._unlinkCell(cell);
        this._deleteTableEntry(table, key);
        return cell.hashMapCellValue;
    }

    protected _modified(): void {
        // Value cycles after 2^30 modifications so that modification counts are
        // always unboxed (Smi) values. Modification detection will be missed if you
        // make exactly some multiple of 2^30 modifications between advances of an
        // iterator.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }

    // Create a new cell and link it in as the last one in the list.
    protected _newLinkedCell(key: K, value: V): LinkedHashMapCell<K, V> {
        let cell: LinkedHashMapCell<K, V> =
            new LinkedHashMapCell<K, V>(key, value);
        if (this._first == null) {
            this._first = this._last = cell;
        } else {
            let last = this._last;
            cell._previous = last;
            this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
    }

// Unlink the given cell from the linked list of cells.
    protected _unlinkCell(cell: LinkedHashMapCell<K, V>): void {
        let previous = cell._previous;
        let next = cell._next;
        if (previous == null) {
            //assert(cell == this._first);
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


    internalComputeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return key.hashCode & 0x3ffffff /*JS('int', '# & 0x3ffffff', key.hashCode)*/;
    }

    protected _getBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>> {
        let hash = this.internalComputeHashCode(key);
        return this._getTableBucket(table, hash);
    }

    internalFindBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (cell.hashMapCellKey == key) return i;
        }
        return -1;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }

    protected _getTableCell(table: any, key: any): LinkedHashMapCell<K, V> {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }

    protected _getTableBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>> {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }

    protected _setTableEntry(table: any, key: any, value: any): void {
        //assert(value != null);
        table[key] = value;
        //JS('void', '#[#] = #', table, key, value);
    }

    protected _deleteTableEntry(table: any, key: any): void {
        //JS('void', 'delete #[#]', table, key);
        delete table[key];
    }

    protected _containsTableEntry(table: any, key: any): bool {
        let cell: LinkedHashMapCell<K, V> = this._getTableCell(table, key);
        return cell != null;
    }

    protected _newHashTable() {
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
}

function _isStringKey(key: any): bool {
    return _dart.is(key, 'string');
}

function _isNumericKey(key: any): bool {
    // Only treat unsigned 30-bit integers as numeric keys. This way,
    // we avoid converting them to strings when we use them as keys in
    // the JavaScript hash table object.
    return _dart.is(key, 'num') && (key & 0x3ffffff) === key /* JS('bool', '(# & 0x3ffffff) === #', key, key)*/;
}

export class DartEs6LinkedHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    //@override
    protected /*=LinkedHashMapCell<K, V>*/ _getTableCell(table: any, key: any): LinkedHashMapCell<K, V> {
        return table.get(key) /*JS('var', '#.get(#)', table, key)*/;
    }

    //@override
    /*=List<LinkedHashMapCell<K, V>>*/
    protected _getTableBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>> {
        return table.get(key) /*JS('var', '#.get(#)', table, key)*/;
    }

    //@override
    protected _setTableEntry(table: any, key: any, value: any): void {
        //JS('void', '#.set(#, #)', table, key, value);
        table.set(key, value);
    }

    //@override
    protected _deleteTableEntry(table: any, key: any): void {
        //JS('void', '#.delete(#)', table, key);
        table.delete(key);
    }

    //@override
    protected _containsTableEntry(table: any, key: any): bool {
        return table.has(key) /* JS('bool', '#.has(#)', table, key)*/;
    }

    //@override
    protected _newHashTable() {
        return new Map() /*JS('var', 'new Map()')*/;
    }
}

export class LinkedHashMapCell<K, V> {
    hashMapCellKey: K;
    hashMapCellValue: V;

    _next: LinkedHashMapCell<K, V>;
    _previous: LinkedHashMapCell<K, V>;

    constructor(hashMapCellKey: K, hashMapCellValue: V) {
        this.hashMapCellKey = hashMapCellKey;
        this.hashMapCellValue = hashMapCellValue;
    }
}

export class DartLinkedHashMapKeyIterable<E> extends DartEfficientLengthIterable<E> {
    protected _map: DartJsLinkedHashMap<E, any>;

    constructor(_map: DartJsLinkedHashMap<E, any>) {
        super()
        this._map = _map;
    }

    get length(): int {
        return this._map._length;
    }

    get isEmpty(): bool {
        return this._map._length == 0;
    }

    get iterator(): DartIterator<E> {
        return new DartLinkedHashMapKeyIterator<E>(this._map, this._map._modifications);
    }

    contains(element: any): bool {
        return this._map.containsKey(element);
    }

    forEach(f: (element: E) => any): void {
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

export class DartLinkedHashMapKeyIterator<E> implements DartIterator<E> {
    protected _map: DartJsLinkedHashMap<E, any>;
    protected _modifications: int;
    protected _cell: LinkedHashMapCell<E, any>;
    protected _current: E;

    constructor(_map: DartJsLinkedHashMap<E, any>, _modifications: int) {
        this._map = _map;
        this._modifications = _modifications;
        this._cell = this._map._first;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        if (this._modifications != this._map._modifications) {
            throw new ConcurrentModificationError(this._map);
        } else if (this._cell == null) {
            this._current = null;
            return false;
        } else {
            this._current = this._cell.hashMapCellKey;
            this._cell = this._cell._next;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current()
        };
    }
}
