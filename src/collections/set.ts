// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

/**
 * Base implementations of [Set].
 */
//part of dart.collection;

import {DartSet} from "../core/set";
import {bool, int, OPERATOR_INDEX_ASSIGN} from "../core";
import {Abstract, DartClass} from "../utils";
import {DartExpandIterable, DartIterable, DartIterableElementError, DartIterator, DartList, DartSkipIterable, DartSkipWhileIterable, DartTakeIterable, DartTakeWhileIterable, DartWhereIterable} from "../collections";
import {DartEfficientLengthMappedIterable, DartIterableBase} from "../core/iterable";
import {DartStringBuffer} from "../core/string_buffer";
import {ArgumentError, RangeError} from "../errors";
import _dart from '../_common';

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
@DartClass
export class DartSetMixin<E> implements DartSet<E> {
    // This class reimplements all of [IterableMixin].
    // If/when Dart mixins get more powerful, we should just create a single
    // Mixin class from IterableMixin and the new methods of this class.
    @Abstract
    add(element: E): bool {
        throw Error()
    }

    @Abstract
    contains(element: any): bool {
        throw Error();
    }

    @Abstract
    lookup(element: any): E {
        throw Error();
    }

    @Abstract
    remove(element): bool {
        throw Error();
    }

    @Abstract
    get iterator(): DartIterator<E> {
        throw Error();
    }

    @Abstract
    toSet(): DartSet<E> {
        throw Error();
    }

    @Abstract
    get length(): int {
        throw Error();
    }

    get isEmpty(): bool {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return this.length != 0;
    }

    clear(): void {
        this.removeAll(this.toList());
    }

    addAll(elements: DartIterable<E>): void {
        for (let element of elements) this.add(element);
    }

    removeAll(elements: DartIterable<any>): void {
        for (let element in elements) this.remove(element);
    }

    retainAll(elements: DartIterable<any>): void {
        // Create a copy of the set, remove all of elements from the copy,
        // then remove all remaining elements in copy from this.
        let toRemove = this.toSet();
        for (let o in elements) {
            toRemove.remove(o);
        }
        this.removeAll(toRemove);
    }

    removeWhere(test: (element: E) => bool): void {
        let toRemove: DartList<E> = new DartList<E>();
        for (let element of this) {
            if (test(element)) toRemove.add(element);
        }
        this.removeAll(toRemove);
    }

    retainWhere(test: (element: E) => bool): void {
        let toRemove: DartList<any> = new DartList<any>();
        for (let element of this) {
            if (!test(element)) toRemove.add(element);
        }
        this.removeAll(toRemove);
    }

    containsAll(other: DartIterable<any>): bool {
        for (let o of other) {
            if (!this.contains(o)) return false;
        }
        return true;
    }

    union(other: DartSet<E>): DartSet<E> {
        let res = this.toSet();
        res.addAll(other);
        return res;
    }

    intersection(other: DartSet<any>): DartSet<E> {
        let result: DartSet<E> = this.toSet();
        for (let element of this) {
            if (!other.contains(element)) result.remove(element);
        }
        return result;
    }

    difference(other: DartSet<any>): DartSet<E> {
        let result: DartSet<E> = this.toSet();
        for (let element of this) {
            if (other.contains(element)) result.remove(element);
        }
        return result;
    }

    toList(_?: { growable?: bool /* :  true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        let result =
            growable ? (() => {
                let l = new DartList<E>();
                l.length = length;
                return l
            })() : new DartList<E>(length);
        let i = 0;
        for (let element of this) result[OPERATOR_INDEX_ASSIGN](i++, element);
        return result;
    }

    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartEfficientLengthMappedIterable<E, T>(this, f);
    }

    get single(): E {
        if (this.length > 1) throw DartIterableElementError.tooMany();
        let it = this.iterator;
        if (!it.moveNext()) throw DartIterableElementError.noElement();
        let result = it.current;
        return result;
    }

    toString(): string {
        return DartIterableBase.iterableToFullString(this, '{', '}');
    }

    // Copied from IterableMixin.
    // Should be inherited if we had multi-level mixins.

    where(f: (element: E) => bool): DartIterable<E> {
        return new DartWhereIterable<E>(this, f);
    }

    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return new DartExpandIterable<E, T>(this, f);
    }

    forEach(f: (element: E) => void): void {
        for (let element of this) f(element);
    }

    reduce(combine: (value: E, element: E) => E): E {
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

    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        let value = initialValue;
        for (let element of this) value = combine(value, element);
        return value;
    }

    every(f: (element: E) => bool): bool {
        for (let element of this) {
            if (!f(element)) return false;
        }
        return true;
    }

    join(separator?: string /*  = ""*/): string {
        let iterator = this.iterator;
        if (!iterator.moveNext()) return "";
        let buffer = new DartStringBuffer();
        if (separator == null || separator == "") {
            do {
                buffer.write(`${iterator.current}`);
            } while (iterator.moveNext());
        } else {
            buffer.write(`${iterator.current}`);
            while (iterator.moveNext()) {
                buffer.write(separator);
                buffer.write(`${iterator.current}`);
            }
        }
        return buffer.toString();
    }

    any(test: (element: E) => bool): bool {
        for (let element of this) {
            if (test(element)) return true;
        }
        return false;
    }

    take(n: int): DartIterable<E> {
        return new DartTakeIterable<E>(this, n);
    }

    takeWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartTakeWhileIterable<E>(this, test);
    }

    skip(n: int): DartIterable<E> {
        return new DartSkipIterable<E>(this, n);
    }

    skipWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartSkipWhileIterable<E>(this, test);
    }

    get first(): E {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }

    get last(): E {
        let it = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let result: E;
        do {
            result = it.current;
        } while (it.moveNext());
        return result;
    }

    firstWhere(test: (value: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        for (let element of this) {
            if (test(element)) return element;
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (value: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let result: E = null;
        let foundMatching = false;
        for (let element of this) {
            if (test(element)) {
                result = element;
                foundMatching = true;
            }
        }
        if (foundMatching) return result;
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    singleWhere(test: (value: E) => bool): E {
        let result: E = null;
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
        if (foundMatching) return result;
        throw DartIterableElementError.noElement();
    }

    elementAt(index: int): E {
        if (_dart.is(index, 'int')) throw new ArgumentError.notNull("index");
        RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
            if (index == elementIndex) return element;
            elementIndex++;
        }
        throw new RangeError.index(index, this, "index", null, elementIndex);
    }

    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }
}

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
export class DartSetBase<E> extends DartSetMixin<E> {
    /**
     * Convert a `Set` to a string as `{each, element, as, string}`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [set] to a string again.
     */
    static setToString(set: DartSet<any>): string {
        return DartIterableBase.iterableToFullString(set, '{', '}');
    }
}
