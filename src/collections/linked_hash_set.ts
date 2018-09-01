// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//@patch
import {Abstract, DartClass, defaultFactory, namedFactory} from "../utils";
import {bool, int} from "../core";
import {_defaultEquals, _defaultHashCode} from "./hash_map";
import {identical, identityHashCode} from "../core/identical";
import {DartHashSet} from "./hash_set";
import {DartIterable, DartIterator, DartList} from "../collections";
import {_LinkedCustomHashSet, _LinkedHashSet, _LinkedIdentityHashSet} from "./collection_patch";
import {DartSet} from "../core/set";


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
@DartClass
export class DartLinkedHashSet<E> implements DartHashSet<E> {
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
    constructor(_?:
                    {
                        equals: (e1: E, e2: E) => bool,
                        hashCode?: (e: E) => int,
                        isValidKey?: (potentialKey: any) => bool
                    }) {
    }

    /**
     * Creates an insertion-ordered identity-based set.
     *
     * Effectively a shorthand for:
     *
     *     new LinkedHashSet<E>(equals: identical,
     *                          hashCode: identityHashCode)
     */
        //external factory LinkedHashSet.identity();
    static identity: new<E>() => DartLinkedHashSet<E>;

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
    @namedFactory
    protected static _from<E>(elements: DartIterable<any>): DartHashSet<E> {
        let result: DartLinkedHashSet<E> = new DartLinkedHashSet<E>();
        for (let element of elements) {
            let e: E = element as E/*=E*/;
            result.add(e);
        }
        return result;
    }

    static from: new<E>(elements: DartIterable<any>) => DartHashSet<E>;

    /**
     * Executes a function on each element of the set.
     *
     * The elements are iterated in insertion order.
     */
    @Abstract
    forEach(action: (element: E) => any): void {
        throw  'abstract';
    }

    /**
     * Provides an iterator that iterates over the elements in insertion order.
     */
    @Abstract
    get iterator(): DartIterator<E> {
        throw 'absract';
    }

    //@patch
    @defaultFactory
    protected static _create<E>(_?:
                                    {
                                        equals: (e1: E, e2: E) => bool,
                                        hashCode?: (e: E) => int,
                                        isValidKey?: (potentialKey: any) => bool
                                    }): DartLinkedHashSet<E> {
        let {equals, hashCode, isValidKey} = Object.assign({}, _);
        if (isValidKey == null) {
            if (hashCode == null) {
                if (equals == null) {
                    return new _LinkedHashSet<E>();
                }
                hashCode = _defaultHashCode;
            } else {
                if (identical(identityHashCode, hashCode) &&
                    identical(identical, equals)) {
                    return new _LinkedIdentityHashSet<E>();
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
        return new _LinkedCustomHashSet<E>(equals, hashCode, isValidKey);
    }


    @namedFactory
    protected static _identity<E>(): DartLinkedHashSet<E> {
        return new _LinkedIdentityHashSet<E>();
    }

    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }

    @Abstract
    add(value: E): bool {
        return undefined;
    }

    @Abstract
    addAll(elements: DartIterable<E>): void {
    }

    @Abstract
    any(f: (element: E) => boolean): boolean {
        return false;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(value: any): bool {
        throw new Error('abstract');
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
    intersection(other: DartSet<any>): DartSet<E> {
        return undefined;
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
    get length(): int {
        return undefined;
    }

    @Abstract
    lookup(object: any): E {
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
    toSet(): DartSet<E> {
        return undefined;
    }

    @Abstract
    union(other: DartSet<E>): DartSet<E> {
        return undefined;
    }

    @Abstract
    where(test: (element: E) => boolean): DartIterable<E> {
        return undefined;
    }


}
