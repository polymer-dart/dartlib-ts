// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.collection;

import {bool, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN, PropertyGetter, PropertySetter} from "../core";
import {DartMap} from "../core/map";
import {_CustomHashMap, _HashMap, _IdentityHashMap} from "./collection_patch";
import {Abstract, AbstractMethods, DartClass, defaultFactory, namedFactory} from "../utils";
import _dart from '../_common';
import {DartIterable} from "../collections";
import {DartMaps} from "../core/maps";
import {identical, identityHashCode} from "../core/identical";

/** Default function for equality comparison in customized HashMaps */
export function _defaultEquals(a, b): bool {
    return _dart.equals(a, b);
}

/** Default function for hash-code computation in customized HashMaps */
export function _defaultHashCode(a): int {
    return a.hashCode;
}


/** Type of custom equality function */
export type  _Equality<K> = (a: K, b: K) => bool;
/** Type of custom hash code function. */
export type  _Hasher<K> = (object: K) => int;


export type _Predicate<T> = (value: T) => bool ;


@DartClass
@AbstractMethods(OPERATOR_INDEX,OPERATOR_INDEX_ASSIGN)
export class AbstractDartMap<K, V> {


    [OPERATOR_INDEX](key: K): V {
        throw 'abstract';
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        throw 'abstract';
    }

    @Abstract
    addAll(other: DartMap<K, V>): void {
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    containsKey(key: any): bool {
        return undefined;
    }

    @Abstract
    containsValue(value: any): bool {
        return undefined;
    }

    @Abstract
    forEach(f: (key: K, value: V) => any): void {
    }

    @Abstract
    get isEmpty(): bool {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get keys(): DartIterable<K> {
        return undefined;
    }

    @Abstract
    get length(): int {
        return undefined;
    }

    @Abstract
    putIfAbsent(key: K, ifAbsent: () => V): V {
        return undefined;
    }

    @Abstract
    remove(key: any): V {
        return undefined;
    }

    @Abstract
    get values(): DartIterable<V> {
        return undefined;
    }
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
@DartClass
export class DartHashMap<K, V> extends AbstractDartMap<K, V> implements DartMap<K, V> {
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
    @namedFactory
    protected static _from<K, V>(other: DartMap<any, any>): DartHashMap<K, V> {
        let result: DartHashMap<K, V> = new DartHashMap<K, V>();
        other.forEach((k, v) => {
            result[OPERATOR_INDEX_ASSIGN](k, v);
        });
        return result;
    }

    static from: new <K, V>(other: DartMap<any, any>) => DartHashMap<K, V>;

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
    @namedFactory
    protected static _fromIterable<K, V>(iterable: DartIterable<any>, _?: { key?: (element: any) => K, value?: (element: any) => V }): DartHashMap<K, V> {
        let {key, value} = Object.assign({}, _);
        let map: DartHashMap<K, V> = new DartHashMap<K, V>();
        DartMaps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
    }

    static fromIterable: new<K, V>(iterable: DartIterable<any>, _?: { key?: (element: any) => K, value?: (element: any) => V }) => DartHashMap<K, V>;

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
    @namedFactory
    protected static _fromIterables<K, V>(keys: DartIterable<K>, values: DartIterable<V>): DartHashMap<K, V> {
        let map = new DartHashMap<K, V>();
        DartMaps._fillMapWithIterables(map, keys, values);
        return map;
    }

    static fromIterables: new<K, V>(keys: DartIterable<K>, values: DartIterable<V>) => DartHashMap<K, V>;


    @defaultFactory
    protected static _create?<K, V>(
        _?: {
            equals?: (key1: K, key2: K) => bool,
            hashCode?: (key: K) => int,
            isValidKey?: (potentialKey: any) => bool
        }): DartHashMap<K, V> {
        let {equals, hashCode, isValidKey} = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _HashMap<K, V>();
                }
                hashCode = _defaultHashCode;
            } else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _IdentityHashMap<K, V>();
                }
                if (equals == null) {
                    equals = _defaultEquals;
                }
            }
        } else {
            if (hashCode == null) {
                hashCode = _defaultHashCode;
            }
            if (equals == null) {
                equals = _defaultEquals;
            }
        }
        return new _CustomHashMap<K, V>(equals, hashCode, isValidKey);
    }

    constructor(_?: {
        equals?: (key1: K, key2: K) => bool,
        hashCode?: (key: K) => int,
        isValidKey?: (potentialKey: any) => bool
    }) {
        super();
    }

    @namedFactory
    protected static _identity?<K, V>(): DartHashMap<K, V> {
        return new _IdentityHashMap<K, V>();
    }

    static identity: new<K, V>() => DartHashMap<K, V>;
}

