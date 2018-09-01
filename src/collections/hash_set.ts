// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.collection;

import {DartSet} from "../core/set";
import {Abstract, DartClass, defaultFactory, namedFactory} from "../utils";
import {DartIterable, DartIterator, DartList} from "../collections";
import {DartSetBase} from "./set";
import {bool, int} from "../core";
import {_defaultEquals, _defaultHashCode} from "./hash_map";
import {identical, identityHashCode} from "../core/identical";
import {_CustomHashSet, _HashSet, _IdentityHashSet} from "./collection_patch";

/** Common parts of [HashSet] and [LinkedHashSet] implementations. */
export class _HashSetBase<E> extends DartSetBase<E> {
    // The following two methods override the ones in SetBase.
    // It's possible to be more efficient if we have a way to create an empty
    // set of the correct type.

    difference(other: DartSet<any>): DartSet<E> {
        let result = this._newSet();
        for (let element of this) {
            if (!other.contains(element)) result.add(element);
        }
        return result;
    }

    intersection(other: DartSet<any>): DartSet<E> {
        let result = this._newSet();
        for (let element of this) {
            if (other.contains(element)) result.add(element);
        }
        return result;
    }

    protected _newSet(): DartSet<E> {
        throw new Error('abstract');
    }

    // Subclasses can optimize this further.
    toSet(): DartSet<E> {
        let res = this._newSet();
        res.addAll(this);
        return res
    }
}

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
@DartClass
export class DartHashSet<E> implements DartSet<E> {
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
    @namedFactory
    protected static _from<E>(elements: DartIterable<any>): DartHashSet<E> {
        let result = new DartHashSet<E>();
        for (let e of elements) {
            let element = e as any/*=E*/;
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
    @Abstract
    get iterator(): DartIterator<E> {
        throw new Error('abstract');
    }

    //@patch
    @defaultFactory
    protected static _create<E>(
        _?: {
            equals?: (e1: E, e2: E) => bool,
            hashCode?: (e: E) => int,
            isValidKey?: (potentialKey: any) => bool
        }): DartHashSet<E> {
        let {equals, hashCode, isValidKey} = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _HashSet<E>();
                }
                hashCode = _defaultHashCode;
            } else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _IdentityHashSet<E>();
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
        return new _CustomHashSet<E>(equals, hashCode, isValidKey);
    }

    constructor(_?: {
        equals?: (e1: E, e2: E) => bool,
        hashCode?: (e: E) => int,
        isValidKey?: (potentialKey: any) => bool
    }) {
    }

    @namedFactory
    protected static _identity<E>(): DartHashSet<E> {
        return new _IdentityHashSet<E>();
    }

    @Abstract
    add(value: E): bool {
        return undefined;
    }

    @Abstract
    addAll(elements: DartIterable<E>): void {
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(value: any): bool {
        return undefined;
    }

    @Abstract
    containsAll(other: DartIterable<any>): bool {
        return undefined;
    }

    @Abstract
    difference(other: DartSet<any>): DartSet<E> {
        return undefined;
    }

    @Abstract
    intersection(other: DartSet<any>): DartSet<E> {
        return undefined;
    }

    @Abstract
    get length(): int {
        return undefined;
    }

    @Abstract
    lookup(object: any): E {
        return undefined;
    }

    @Abstract
    remove(value: any): bool {
        return undefined;
    }

    @Abstract
    removeAll(elements: DartIterable<any>): void {
    }

    @Abstract
    removeWhere(test: (element: E) => bool): void {
    }

    @Abstract
    retainAll(elements: DartIterable<any>): void {
    }

    @Abstract
    retainWhere(test: (element: E) => bool): void {
    }

    @Abstract
    toSet(): DartSet<E> {
        return undefined;
    }

    @Abstract
    union(other: DartSet<E>): DartSet<E> {
        return undefined;
    }

    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }

    @Abstract
    any(f: (element: E) => boolean): boolean {
        return false;
    }

    @Abstract
    elementAt(index: int): E {
        return undefined;
    }

    @Abstract
    every(f: (element: E) => boolean): boolean {
        return false;
    }

    @Abstract
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return undefined;
    }

    @Abstract
    get first(): E {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        return undefined;
    }

    @Abstract
    forEach(f: (element: E) => any): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return false;
    }

    @Abstract
    get isNotEmpty(): boolean {
        return false;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    get last(): E {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E {
        return undefined;
    }

    @Abstract
    map<T>(f: (e: E) => T): DartIterable<T> {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: E, element: E) => E): E {
        return undefined;
    }

    @Abstract
    get single(): E {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: E) => boolean): E {
        return undefined;
    }

    @Abstract
    skip(count: int): DartIterable<E> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (value: E) => boolean): DartIterable<E> {
        return undefined;
    }

    @Abstract
    take(count: int): DartIterable<E> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (value: E) => boolean): DartIterable<E> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable?: boolean }): DartList<E> {
        return undefined;
    }

    @Abstract
    where(test: (element: E) => boolean): DartIterable<E> {
        return undefined;
    }
}
