// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.collection;

import {_defaultEquals, _defaultHashCode, DartHashMap} from "../collections/hash_map";
import {Abstract, DartClass, defaultFactory, namedFactory} from "../utils";
import {bool, int, OPERATOR_INDEX_ASSIGN} from "../core";
import {DartMap} from "./map";
import {DartIterable, DartList} from "../collections";
import {DartMaps} from "./maps";
import {DartJsLinkedHashMap} from "../collections/linked_hash_map";
import {identical, identityHashCode} from "./identical";
import {_LinkedCustomHashMap, _LinkedIdentityHashMap} from "../collections/collection_patch";
import {fillLiteralMap} from "../native/js_helper";

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
@DartClass
export class DartLinkedHashMap<K, V> implements DartHashMap<K, V> {
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
    constructor(_?: {
        equals?: (key1: K, key2: K) => bool,
        hashCode?: (key: K) => int,
        isValidKey?: (potentialKey) => bool
    }) {

    }

    /**
     * Creates an insertion-ordered identity-based map.
     *
     * Effectively a shorthand for:
     *
     *     new LinkedHashMap<K, V>(equals: identical,
     *                             hashCode: identityHashCode)
     */
    static identity: new<K, V>() => DartLinkedHashMap<K, V>;

    /**
     * Creates a [LinkedHashMap] that contains all key value pairs of [other].
     */
    @namedFactory
    protected static _from<K, V>(other: DartMap<K, V>): DartLinkedHashMap<K, V> {
        let result = new DartLinkedHashMap<K, V>();
        other.forEach((k, v) => {
            result[OPERATOR_INDEX_ASSIGN](k as Object/*=K*/, v as Object/*=V*/);
        });
        return result;
    }

    static from: new<K, V>(other: DartMap<K, V>) => DartLinkedHashMap<K, V>

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
    @namedFactory
    protected static _fromIterable<K, V>(iterable: DartIterable<any>,
                                         _?: { key?: (element: any) => K, value?: (element) => V }): DartLinkedHashMap<K, V> {
        let {key, value} = Object.assign({}, _);
        let map = new DartLinkedHashMap<K, V>();
        DartMaps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
    }

    static fromIterable: new<K, V>(iterable: DartIterable<any>,
                                   _?: { key?: (element: any) => K, value?: (element) => V }) => DartLinkedHashMap<K, V>;

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
    @namedFactory
    protected static _fromIterables<K, V>(keys: DartIterable<K>, values: DartIterable<V>): DartLinkedHashMap<K, V> {
        let map = new DartLinkedHashMap<K, V>();
        DartMaps._fillMapWithIterables(map, keys, values);
        return map;
    }

    static fromIterables: new<K, V>(keys: DartIterable<K>, values: DartIterable<V>) => DartLinkedHashMap<K, V>;

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

    // @patch
    @defaultFactory
    protected static _create<K, V>(
        _?: {
            equals?: (key1: K, key2: K) => bool,
            hashCode?: (key: K) => int,
            isValidKey?: (potentialKey) => bool
        }): DartLinkedHashMap<K, V> {
        let {equals, hashCode, isValidKey} = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new DartJsLinkedHashMap.es6<K, V>();
                }
                hashCode = _defaultHashCode;
            } else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _LinkedIdentityHashMap.es6<K, V>();
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
        return new _LinkedCustomHashMap<K, V>(equals, hashCode, isValidKey);
    }


    //@patch
    @namedFactory
    protected static _identity<K, V>(): DartLinkedHashMap<K, V> {
        return new _LinkedIdentityHashMap.es6<K, V>();
    }

    // Private factory constructor called by generated code for map literals.
    //@NoInline()
    @namedFactory
    protected static __literal<K, V>(keyValuePairs: DartList<any>): DartLinkedHashMap<K, V> {
        return fillLiteralMap(keyValuePairs, new DartJsLinkedHashMap.es6<K, V>());
    }

    protected static _literal: new<K, V>(keyValuePairs: DartList<any>) => DartLinkedHashMap<K, V>;

    // Private factory constructor called by generated code for map literals.
    // @NoThrows()
    // @NoInline()
    // @NoSideEffects()
    @namedFactory
    protected static __empty<K, V>(): DartLinkedHashMap<K, V> {
        return new DartJsLinkedHashMap.es6<K, V>();
    }

    protected static _empty: new<K, V>() => DartLinkedHashMap<K, V>;

    // Private factory static function called by generated code for map literals.
    // This version is for map literals without type parameters.
    //@NoThrows()
    //@NoInline()
    //@NoSideEffects()
    protected static _makeEmpty<K, V>(): DartJsLinkedHashMap<K, V> {
        return new DartJsLinkedHashMap();
    }

    // Private factory static function called by generated code for map literals.
    // This version is for map literals without type parameters.
    //@NoInline()
    protected static _makeLiteral<K, V>(keyValuePairs): DartJsLinkedHashMap<K, V> {
        return fillLiteralMap(keyValuePairs, new DartJsLinkedHashMap<K, V>());
    }
}
