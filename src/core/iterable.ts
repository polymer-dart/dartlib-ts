// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.collection;

import {DartExpandIterable, DartIterable, DartIterableElementError, DartIterator, DartList, DartMappedIterable, DartSkipIterable, DartSkipWhileIterable, DartTakeIterable, DartTakeWhileIterable, DartWhereIterable} from "../collections";
import {bool, int} from "../core";
import _dart from "../_common";
import {DartStringBuffer} from "./string_buffer";
import {DartSet} from "./set";
import {ArgumentError, RangeError} from "../errors";
import {identical} from "./itentical";

/**
 * This [Iterable] mixin implements all [Iterable] members except `iterator`.
 *
 * All other methods are implemented in terms of `iterator`.
 */
export class DartIterableMixin<E> implements DartIterable<E> {
    // This class has methods copied verbatim into:
    // - IterableBase
    // - SetMixin
    // If changing a method here, also change the other copies.

    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartMappedIterable<E, T>(this, f);
    }

    where(f: (element: E) => bool): DartIterable<E> {
        return new DartWhereIterable<E>(this, f);
    }

    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return new DartExpandIterable<E, T>(this, f);
    }

    contains(element: any): bool {
        for (let e of this) {
            if (_dart.equals(e, element)) return true;
        }
        return false;
    }

    forEach(f: (element: E) => void): void {
        for (let element of this) f(element);
    }

    reduce(combine: (value: E, element: E) => E): E {
        let iterator: DartIterator<E> = this.iterator;
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
        var value = initialValue;
        for (let element of this) value = combine(value, element);
        return value;
    }

    every(f: (element: E) => bool): bool {
        for (let element of this) {
            if (!f(element)) return false;
        }
        return true;
    }

    join(separator?: string /* = "" */): string {
        let iterator: DartIterator<E> = this.iterator;
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

    any(f: (element: E) => bool): bool {
        for (let element of this) {
            if (f(element)) return true;
        }
        return false;
    }

    toList(_?: { growable: bool /* : true*/ }): DartList<E> {
        return new DartList.from<E>(this, _);
    }

    toSet(): DartSet<E> {
        return new DartSet.from<E>(this);
    }

    get length(): int {
        //assert(this is! EfficientLengthIterable);
        let count: int = 0;
        let it: DartIterator<E> = this.iterator;
        while (it.moveNext()) {
            count++;
        }
        return count;
    }

    get isEmpty(): bool {
        return !this.iterator.moveNext();
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    take(count: int): DartIterable<E> {
        return new DartTakeIterable<E>(this, count);
    }

    takeWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartTakeWhileIterable<E>(this, test);
    }

    skip(count: int): DartIterable<E> {
        return new DartSkipIterable<E>(this, count);
    }

    skipWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartSkipWhileIterable<E>(this, test);
    }

    get first(): E {
        let it: DartIterator<E> = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }

    get last(): E {
        let it: DartIterator<E> = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let result: E;
        do {
            result = it.current;
        } while (it.moveNext());
        return result;
    }

    get single(): E {
        let it: DartIterator<E> = this.iterator;
        if (!it.moveNext()) throw DartIterableElementError.noElement();
        let result: E = it.current;
        if (it.moveNext()) throw DartIterableElementError.tooMany();
        return result;
    }

    firstWhere(test: (value: E) => bool, _?: { orElse: () => E }): E {
        let {orElse} = Object.assign({}, _);
        for (let element of this) {
            if (test(element)) return element;
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (value: E) => bool, _?: { orElse: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let result: E = null;
        let foundMatching: bool = false;
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
        let foundMatching: bool = false;
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
        if (!_dart.is(index, 'int')) throw new ArgumentError.notNull("index");
        RangeError.checkNotNegative(index, "index");
        let elementIndex: int = 0;
        for (let element of this) {
            if (_dart.equals(index, elementIndex)) return element;
            elementIndex++;
        }
        throw new RangeError.index(index, this, "index", null, elementIndex);
    }

    toString(): string {
        return DartIterableBase.iterableToShortString(this, '(', ')');
    }

    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }

    get iterator(): DartIterator<E> {
        throw new Error('abstract');
    }
}

/**
 * Base class for implementing [Iterable].
 *
 * This class implements all methods of [Iterable] except [Iterable.iterator]
 * in terms of `iterator`.
 */
export class DartIterableBase<E> extends DartIterable<E> {
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
    static iterableToShortString(iterable: DartIterable<any>, leftDelimiter?: string /*  = '(' */, rightDelimiter?: string /* = ')'*/): string {
        leftDelimiter = leftDelimiter || '(';
        rightDelimiter = rightDelimiter || ')';
        if (_isToStringVisiting(iterable)) {
            if (leftDelimiter === "(" && rightDelimiter === ")") {
                // Avoid creating a new string in the "common" case.
                return "(...)";
            }
            return `${leftDelimiter}...${rightDelimiter}`;
        }

        let parts: DartList<any> = new DartList();
        _toStringVisiting.add(iterable);
        try {
            _iterablePartsToStrings(iterable, parts);
        } finally {
            //assert(identical(_toStringVisiting.last, iterable));
            _toStringVisiting.removeLast();
        }
        return ((sb: DartStringBuffer) => {
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
    static iterableToFullString(iterable: DartIterable<any>,
                                leftDelimiter?: string /* = '(' */, rightDelimiter?: string  /*= ')' */): string {
        leftDelimiter = leftDelimiter || '(';
        rightDelimiter = rightDelimiter || ')';
        if (_isToStringVisiting(iterable)) {
            return `${leftDelimiter}...${rightDelimiter}`;
        }
        let buffer = new DartStringBuffer(leftDelimiter);
        _toStringVisiting.add(iterable);
        try {
            buffer.writeAll(iterable, ", ");
        } finally {
            //assert(identical(_toStringVisiting.last, iterable));
            _toStringVisiting.removeLast();
        }
        buffer.write(rightDelimiter);
        return buffer.toString();
    }
}

/** A set used to identify cyclic lists during toString() calls. */
export const _toStringVisiting: DartList<any> = new DartList();

/** Check if we are currently visiting `o` in a toString call. */
export function _isToStringVisiting(o: any): bool {
    for (let i = 0; i < _toStringVisiting.length; i++) {
        if (identical(o, _toStringVisiting[i])) return true;
    }
    return false;
}

/**
 * Convert elments of [iterable] to strings and store them in [parts].
 */
function _iterablePartsToStrings(iterable: DartIterable<any>, parts: DartList<any>): void {
    /*
     * This is the complicated part of [iterableToShortString].
     * It is extracted as a separate function to avoid having too much code
     * inside the try/finally.
     */
    /// Try to stay below this many characters.
    const LENGTH_LIMIT: int = 80;

    /// Always at least this many elements at the start.
    const HEAD_COUNT: int = 3;

    /// Always at least this many elements at the end.
    const TAIL_COUNT: int = 2;

    /// Stop iterating after this many elements. Iterables can be infinite.
    const MAX_COUNT: int = 100;
    // Per entry length overhead. It's for ", " for all after the first entry,
    // and for "(" and ")" for the initial entry. By pure luck, that's the same
    // number.
    const OVERHEAD: int = 2;
    const ELLIPSIS_SIZE: int = 3; // "...".length.

    let length = 0;
    let count = 0;
    let it: DartIterator<any> = iterable.iterator;
    // Initial run of elements, at least HEAD_COUNT, and then continue until
    // passing at most LENGTH_LIMIT characters.
    while (length < LENGTH_LIMIT || count < HEAD_COUNT) {
        if (!it.moveNext()) return;
        let next = `${it.current}`;
        parts.add(next);
        length += next.length + OVERHEAD;
        count++;
    }

    let penultimateString: string;
    let ultimateString: string;

    // Find last two elements. One or more of them may already be in the
    // parts array. Include their length in `length`.
    let penultimate = null;
    let ultimate = null;
    if (!it.moveNext()) {
        if (count <= HEAD_COUNT + TAIL_COUNT) return;
        ultimateString = parts.removeLast();
        penultimateString = parts.removeLast();
    } else {
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
        } else {
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
