// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.collection;

import {mixin} from "../utils";
import {bool, DartObject, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {DartMap} from "./map";
import {DartEfficientLengthIterable, DartIterable, DartIterator} from "../collections";
import _dart from "../_common";
import {ArgumentError, UnsupportedError} from "../errors";
import {DartStringBuffer} from "./string_buffer";
import {_isToStringVisiting, _toStringVisiting} from "./iterable";

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
export class DartMapMixin<K, V> implements DartMap<K, V> {
    get keys(): DartIterable<K> {
        throw new Error('abstract');
    }

    [OPERATOR_INDEX](key: any): V {
        throw new Error('abstract');
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        throw new Error('abstract');
    }

    remove(key: any): V {
        throw new Error('abstract');
    }

    // The `clear` operation should not be based on `remove`.
    // It should clear the map even if some keys are not equal to themselves.
    clear(): void {
        throw new Error('abstract');
    }

    forEach(action: (key: K, value: V) => any) {
        for (let key of this.keys) {
            action(key, this[OPERATOR_INDEX](key));
        }
    }

    addAll(other: DartMap<K, V>): void {
        for (let key of other.keys) {
            this[OPERATOR_INDEX_ASSIGN](key, other[OPERATOR_INDEX](key));
        }
    }

    containsValue(value: any): bool {
        for (let key of this.keys) {
            if (_dart.equals(this[OPERATOR_INDEX](key), value)) return true;
        }
        return false;
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) {
            return this[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }

    containsKey(key: any): bool {
        return this.keys.contains(key);
    }

    get length(): int {
        return this.keys.length;
    }

    get isEmpty(): bool {
        return this.keys.isEmpty;
    }

    get isNotEmpty(): bool {
        return this.keys.isNotEmpty;
    }

    get values(): DartIterable<V> {
        return new _MapBaseValueIterable<K, V>(this);
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
}

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
export class DartMapBase<K, V> extends mixin(DartMapMixin, DartObject) {

}

/**
 * Implementation of [Map.values] based on the map and its [Map.keys] iterable.
 *
 * Iterable that iterates over the values of a `Map`.
 * It accesses the values by iterating over the keys of the map, and using the
 * map's `operator[]` to lookup the keys.
 */
class _MapBaseValueIterable<K, V> extends DartEfficientLengthIterable<V> {
    protected _map: DartMap<K, V>;

    constructor(_map: DartMap<K, V>) {
        super();
        this._map = _map;
    }

    get length(): int {
        return this._map.length;
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get isNotEmpty(): bool {
        return this._map.isNotEmpty;
    }

    get first(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.first);
    }

    get single(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.single);
    }

    get last(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.last);
    }

    get iterator(): DartIterator<V> {
        return new _MapBaseValueIterator<K, V>(this._map);
    }
}

/**
 * Iterator created by [_MapBaseValueIterable].
 *
 * Iterates over the values of a map by iterating its keys and lookup up the
 * values.
 */
class _MapBaseValueIterator<K, V> implements DartIterator<V> {
    protected _keys: DartIterator<K>;
    protected _map: DartMap<K, V>;
    protected _current: V = null;

    constructor(map: DartMap<K, V>) {

        this._map = map;
        this._keys = map.keys.iterator;
    }

    moveNext(): bool {
        if (this._keys.moveNext()) {
            this._current = this._map[OPERATOR_INDEX](this._keys.current);
            return true;
        }
        this._current = null;
        return false;
    }

    get current(): V {
        return this._current;
    }

    next(value?: any): IteratorResult<V> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

/**
 * Mixin that overrides mutating map operations with implementations that throw.
 */
class _UnmodifiableMapMixin<K, V> {
    /** This operation is not supported by an unmodifiable map. */
    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    addAll(other: DartMap<K, V>): void {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    clear(): void {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    remove(key: any): V {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key: K, ifAbsent: () => V): V {
        throw new UnsupportedError("Cannot modify unmodifiable map");
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
export class UnmodifiableMapBase<K, V> extends mixin(_UnmodifiableMapMixin, DartMapBase) {

}


/**
 * Wrapper around a class that implements [Map] that only exposes `Map` members.
 *
 * A simple wrapper that delegates all `Map` members to the map provided in the
 * constructor.
 *
 * Base for delegating map implementations like [UnmodifiableMapView].
 */
class DartMapView<K, V> implements DartMap<K, V> {
    protected _map: DartMap<K, V>;

    constructor(map: DartMap<K, V>) {
        this._map = map;
    }

    [OPERATOR_INDEX](key: any): V {
        return this._map[key];
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        this._map[OPERATOR_INDEX_ASSIGN](key, value);
    }

    addAll(other: DartMap<K, V>): void {
        this._map.addAll(other);
    }

    clear(): void {
        this._map.clear();
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        return this._map.putIfAbsent(key, ifAbsent);
    }

    containsKey(key: any): bool {
        return this._map.containsKey(key);
    }

    containsValue(value: any): bool {
        return this._map.containsValue(value);
    }

    forEach(action: (key: K, value: V) => any): void {
        this._map.forEach(action);
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get isNotEmpty(): bool {
        return this._map.isNotEmpty;
    }

    get length(): int {
        return this._map.length;
    }

    get keys(): DartIterable<K> {
        return this._map.keys;
    }

    remove(key: any): V {
        return this._map.remove(key);
    }

    toString(): string {
        return this._map.toString();
    }

    get values(): DartIterable<V> {
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
export class DartUnmodifiableMapView<K, V> extends mixin(_UnmodifiableMapMixin, DartMapView) {

}

/**
 * Helper class which implements complex [Map] operations
 * in term of basic ones ([Map.keys], [Map.[]],
 * [Map.[]=] and [Map.remove].)  Not all methods are
 * necessary to implement each particular operation.
 */
export namespace DartMaps {
    export function containsValue(map: DartMap<any, any>, value: any): bool {
        for (let v of map.values) {
            if (_dart.equals(v, value)) {
                return true;
            }
        }
        return false;
    }

    export function containsKey(map: DartMap<any, any>, key: any): bool {
        for (let k of map.keys) {
            if (_dart.equals(k, key)) {
                return true;
            }
        }
        return false;
    }

    export function putIfAbsent(map: DartMap<any, any>, key: any, ifAbsent: () => any): any {
        if (map.containsKey(key)) {
            return map[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        map[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }

    export function clear(map: DartMap<any, any>) {
        for (let k of map.keys.toList()) {
            map.remove(k);
        }
    }

    export function forEach(map: DartMap<any, any>, f: (key: any, value: any) => any) {
        for (let k of map.keys) {
            f(k, map[OPERATOR_INDEX](k));
        }
    }

    export function getValues(map: DartMap<any, any>): DartIterable<any> {
        return map.keys.map((key) => map[OPERATOR_INDEX](key));
    }

    export function length(map: DartMap<any, any>): int {
        return map.keys.length;
    }

    export function isEmpty(map: DartMap<any, any>): bool {
        return map.keys.isEmpty;
    }

    export function isNotEmpty(map: DartMap<any, any>): bool {
        return map.keys.isNotEmpty;
    }

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
    export function mapToString(m: DartMap<any, any>): string {
        // Reuse the list in IterableBase for detecting toString cycles.
        if (_isToStringVisiting(m)) {
            return '{...}';
        }

        let result = new DartStringBuffer();
        try {
            _toStringVisiting.add(m);
            result.write('{');
            let first: bool = true;
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
        } finally {
            //assert(identical(_toStringVisiting.last, m));
            _toStringVisiting.removeLast();
        }

        return result.toString();
    }

    function _id(x) {
        return x;
    }

    /**
     * Fills a map with key/value pairs computed from [iterable].
     *
     * This method is used by Map classes in the named constructor fromIterable.
     */
    export function _fillMapWithMappedIterable(
        map: DartMap<any, any>, iterable: DartIterable<any>, key: (element: any) => any, value: (element: any) => any): void {
        if (key == null) key = _id;
        if (value == null) value = _id;

        for (let element of iterable) {
            map[OPERATOR_INDEX_ASSIGN](key(element), value(element));
        }
    }

    /**
     * Fills a map by associating the [keys] to [values].
     *
     * This method is used by Map classes in the named constructor fromIterables.
     */
    export function _fillMapWithIterables(map: DartMap<any, any>, keys: DartIterable<any>, values: DartIterable<any>): void {
        let keyIterator: DartIterator<any> = keys.iterator;
        let valueIterator: DartIterator<any> = values.iterator;

        let hasNextKey: bool = keyIterator.moveNext();
        let hasNextValue: bool = valueIterator.moveNext();

        while (hasNextKey && hasNextValue) {
            map[OPERATOR_INDEX_ASSIGN](keyIterator.current, valueIterator.current);
            hasNextKey = keyIterator.moveNext();
            hasNextValue = valueIterator.moveNext();
        }

        if (hasNextKey || hasNextValue) {
            throw new ArgumentError("Iterables do not have same length.");
        }
    }
}
