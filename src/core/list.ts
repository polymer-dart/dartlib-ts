// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.collection;

import {bool, DartObject, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {mixin} from "../utils";
import {
    DartEfficientLengthIterable,
    DartExpandIterable,
    DartIterable,
    DartIterableElementError,
    DartIterator,
    DartList,
    DartListIterator, DartListMapView,
    DartMappedListIterable, DartReversedListIterable,
    DartSkipWhileIterable,
    DartSubListIterable,
    DartTakeWhileIterable,
    DartWhereIterable
} from "../collections";
import {ArgumentError, ConcurrentModificationError, RangeError as DartRangeError} from "../errors";
import {DartStringBuffer} from "./string_buffer";
import {DartSet} from "./set";
import _dart from "../_common";
import {DartComparable} from "./comparable";
import {DartRandom} from "../math/random";
import {DartMap} from "./map";
import {identical} from "./identical";
import {DartIterableBase} from "./iterable";
import {DartSort} from "./sort";

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
export class DartListMixin<E> implements DartList<E> {
    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }

    get length(): int {
        throw new Error('abstract');
    }

    set length(v: int) {
        throw new Error('abstract');
    }

    [OPERATOR_INDEX](index: number): E {
        throw new Error("Method not implemented.");
    }

    [OPERATOR_INDEX_ASSIGN](index: number, value: E): void {
        throw new Error("Method not implemented.");
    }

    // Iterable interface.
    get iterator(): DartIterator<E> {
        return new DartListIterator<E>(this);
    }

    elementAt(index: int): E {
        return this[OPERATOR_INDEX](index);
    }

    forEach(action: (element: E) => void): void {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            action(this[OPERATOR_INDEX](i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
    }

    get isEmpty(): bool {
        return this.length == 0
    };

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    get first(): E {
        if (this.length == 0) throw DartIterableElementError.noElement();
        return this[OPERATOR_INDEX](0);
    }

    get last(): E {
        if (this.length == 0) throw DartIterableElementError.noElement();
        return this[OPERATOR_INDEX](this.length - 1);
    }

    get single(): E {
        if (this.length == 0) throw DartIterableElementError.noElement();
        if (this.length > 1) throw DartIterableElementError.tooMany();
        return this[OPERATOR_INDEX](0);
    }

    contains(element: any): bool {
        let length = this.length;
        for (let i = 0; i < this.length; i++) {
            if (this[OPERATOR_INDEX](i) == element) return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }

    every(test: (element: E) => bool): bool {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (!test(this[OPERATOR_INDEX](i))) return false;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return true;
    }

    any(test: (element: E) => bool): bool {
        let length = this.length;
        for (let i = 0; i < length; i++) {
            if (test(this[OPERATOR_INDEX](i))) return true;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return false;
    }

    firstWhere(test: (element: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let length = this.length;
        for (let i = 0; i < length; i++) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element)) return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (element: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
            let element = this[OPERATOR_INDEX](i);
            if (test(element)) return element;
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    singleWhere(test: (element: E) => bool): E {
        let length = this.length;
        let match: E = null;
        let matchFound: bool = false;
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
        if (matchFound) return match;
        throw DartIterableElementError.noElement();
    }

    join(separator?: string /* = "" */): string {
        if (length == 0) return "";
        let buffer = new DartStringBuffer();
        buffer.writeAll(this, separator);
        return buffer.toString();
    }

    where(test: (element: E) => bool): DartIterable<E> {
        return new DartWhereIterable<E>(this, test);
    }

    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartMappedListIterable<E, T>(this, f);
    }

    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return new DartExpandIterable<E, T>(this, f);
    }

    reduce(combine: (previousValue: E, element: E) => E): E {
        let length = this.length;
        if (length == 0) throw DartIterableElementError.noElement();
        let value = this[OPERATOR_INDEX](0);
        for (let i = 1; i < length; i++) {
            value = combine(value, this[OPERATOR_INDEX](i));
            if (length != this.length) {
                throw new ConcurrentModificationError(this);
            }
        }
        return value;
    }

    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
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

    skip(count: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, count, null);
    }

    skipWhile(test: (element: E) => bool): DartIterable<E> {
        return new DartSkipWhileIterable<E>(this, test);
    }

    take(count: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, 0, count);
    }

    takeWhile(test: (element: E) => bool): DartIterable<E> {
        return new DartTakeWhileIterable<E>(this, test);
    }

    toList(_?: { growable: bool  /*: true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        let result: DartList<E>;
        if (growable) {
            result = new DartList<E>();
            result.length = length;
        } else {
            result = new DartList<E>(length);
        }
        for (let i = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](i));
        }
        return result;
    }

    toSet(): DartSet<E> {
        let result: DartSet<E> = new DartSet<E>();
        for (let i = 0; i < length; i++) {
            result.add(this[OPERATOR_INDEX](i));
        }
        return result;
    }

    // Collection interface.
    add(element: E): void {
        this[OPERATOR_INDEX_ASSIGN](this.length++, element);
    }

    addAll(iterable: DartIterable<E>): void {
        let i = this.length;
        for (let element of iterable) {
            //assert(this.length == i || (throw new ConcurrentModificationError(this)));
            this.length = i + 1;
            this[OPERATOR_INDEX_ASSIGN](i, element);
            i++;
        }
    }

    remove(element: any): bool {
        for (let i = 0; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                this.setRange(i, this.length - 1, this, i + 1);
                this.length -= 1;
                return true;
            }
        }
        return false;
    }

    removeWhere(test: (element: E) => bool): void {
        this._filter(test, false);
    }

    retainWhere(test: (element: E) => bool): void {
        this._filter(test, true);
    }

    protected _filter(test: (element: any) => bool, retainMatching: bool): void {
        let retained: DartList<E> = new DartList<E>();
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

    clear(): void {
        this.length = 0;
    }

    // List interface.

    removeLast(): E {
        if (this.length == 0) {
            throw DartIterableElementError.noElement();
        }
        let result = this[OPERATOR_INDEX](this.length - 1);
        length--;
        return result;
    }

    sort(compare?: (a: E, b: E) => int): void {
        DartSort.sort(this, compare || DartListMixin._compareAny);
    }

    static _compareAny(a, b): int {
        // In strong mode Comparable.compare requires an implicit cast to ensure
        // `a` and `b` are Comparable.
        return DartComparable.compare(a, b);
    }

    shuffle(random?: DartRandom): void {
        if (random == null) random = new DartRandom();
        let length = this.length;
        while (length > 1) {
            let pos = random.nextInt(length);
            length -= 1;
            var tmp = this[OPERATOR_INDEX](length);
            this[OPERATOR_INDEX_ASSIGN](length, this[OPERATOR_INDEX](pos));
            this[OPERATOR_INDEX_ASSIGN](pos, tmp);
        }
    }

    asMap(): DartMap<int, E> {
        return new DartListMapView<E>(this);
    }

    sublist(start: int, end?: int): DartList<E> {
        let listLength = this.length;
        if (end == null) end = listLength;
        DartRangeError.checkValidRange(start, end, listLength);
        let length = end - start;
        let result: DartList<E> = new DartList<E>();
        result.length = length;
        for (let i = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](start + i));
        }
        return result;
    }

    getRange(start: int, end: int): DartIterable<E> {
        DartRangeError.checkValidRange(start, end, this.length);
        return new DartSubListIterable<E>(this, start, end);
    }

    removeRange(start: int, end: int): void {
        DartRangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        this.setRange(start, this.length - length, this, end);
        this.length -= length;
    }

    fillRange(start: int, end: int, fill?: E): void {
        DartRangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
            this[OPERATOR_INDEX_ASSIGN](i, fill);
        }
    }

    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int /* = 0*/): void {
        skipCount = skipCount || 0;
        DartRangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length == 0) return;
        DartRangeError.checkNotNegative(skipCount, "skipCount");

        let otherList: DartList<E>;
        let otherStart: int;
        // TODO(floitsch): Make this accept more.
        if (_dart.is(iterable, DartList)) {
            otherList = iterable as DartList<E>;
            otherStart = skipCount;
        } else {
            otherList = iterable.skip(skipCount).toList({growable: false});
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
        } else {
            for (let i = 0; i < length; i++) {
                this[OPERATOR_INDEX_ASSIGN](start + i, otherList[OPERATOR_INDEX](otherStart + i));
            }
        }
    }

    replaceRange(start: int, end: int, newContents: DartIterable<E>): void {
        DartRangeError.checkValidRange(start, end, this.length);
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
        } else {
            let delta = insertLength - removeLength;
            let newLength = this.length + delta;
            let insertEnd = start + insertLength; // aka. end + delta.
            this.length = newLength;
            this.setRange(insertEnd, newLength, this, end);
            this.setRange(start, insertEnd, newContents);
        }
    }

    indexOf(element: any, startIndex?: int /* = 0 */): int {
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
    lastIndexOf(element: any, startIndex?: int): int {
        if (startIndex == null) {
            startIndex = this.length - 1;
        } else {
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

    insert(index: int, element: E): void {
        DartRangeError.checkValueInInterval(index, 0, length, "index");
        if (index == this.length) {
            this.add(element);
            return;
        }
        // We are modifying the length just below the is-check. Without the check
        // Array.copy could throw an exception, leaving the list in a bad state
        // (with a length that has been increased, but without a new element).
        if (!_dart.is(index, 'int')) throw new ArgumentError(index);
        this.length++;
        this.setRange(index + 1, this.length, this, index);
        this[OPERATOR_INDEX_ASSIGN](index, element);
    }

    removeAt(index: int): E {
        let result = this[OPERATOR_INDEX](index);
        this.setRange(index, this.length - 1, this, index + 1);
        this.length--;
        return result;
    }

    insertAll(index: int, iterable: DartIterable<E>): void {
        DartRangeError.checkValueInInterval(index, 0, length, "index");
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

    setAll(index: int, iterable: DartIterable<E>): void {
        if (_dart.is(iterable, DartList)) {
            this.setRange(index, index + iterable.length, iterable);
        } else {
            for (let element of iterable) {
                this[OPERATOR_INDEX_ASSIGN](index++, element);
            }
        }
    }

    get reversed(): DartIterable<E> {
        return new DartReversedListIterable<E>(this);
    }

    toString(): string {
        return DartIterableBase.iterableToFullString(this, '[', ']');
    }
}


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
export class DartListBase<E> extends mixin(DartListMixin, DartObject) {
    /**
     * Convert a `List` to a string as `[each, element, as, string]`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [list] to a string again.
     */
    static listToString<E>(list: DartList<E>): string {
        return DartIterableBase.iterableToFullString(list, '[', ']');
    }
}
