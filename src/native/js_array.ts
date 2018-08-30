// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of _interceptors;

import {JSIndexable, JSMutableIndexable} from "./interceptors";
import {
    DartEfficientLengthIterable,
    DartExpandIterable,
    DartIterable,
    DartIterableElementError, DartIterator,
    DartList, DartListMapView,
    DartMappedListIterable,
    DartReversedListIterable,
    DartSkipWhileIterable,
    DartSubListIterable,
    DartTakeWhileIterable,
    DartWhereIterable
} from "../collections";
import {DartClass, namedConstructor, namedFactory} from "../utils";
import {bool, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {ArgumentError, ConcurrentModificationError, RangeError, UnsupportedError} from "../errors";
import _dart from '../_common';
import {DartComparable} from "../core/comparable";
import {DartRandom} from "../math/random";
import {DartListBase} from "../core/list";
import {DartSet} from "../core/set";
import {DartMap} from "../core/map";
import {argumentErrorValue, checkNull, DartPrimitives, diagnoseIndexError, throwConcurrentModificationError} from "./js_helper";
import {DartSort} from "../core/sort";

class _Growable {
    constructor() {
    }
}

// const _ListConstructorSentinel =new _Growable();


class X extends Array {

}

/**
 * The interceptor class for [List]. The compiler recognizes this
 * class as an interceptor, and changes references to [:this:] to
 * actually use the receiver of the method, which is generated as an extra
 * argument added to each member.
 */
@DartClass
export class JSArray<E> extends Array implements DartList<E>, JSIndexable<E> {
    constructor() {
        super();
    }

    // This factory constructor is the redirection target of the List() factory
    // constructor. [length] has no type to permit the sentinel value.
    @namedFactory
    protected static _list<E>(length?: any /*= _ListConstructorSentinel]*/): JSArray<E> {
        /*if (length === undefined) {
            length = _ListConstructorSentinel;
        }*/
        if (undefined === length) {
            return new JSArray.emptyGrowable<E>();
        }
        return new JSArray.fixed<E>(length);
    }

    static list: new<E>(length?: any /*= _ListConstructorSentinel]*/) => JSArray<E>;

    /**
     * Returns a fresh JavaScript Array, marked as fixed-length.
     *
     * [length] must be a non-negative integer.
     */
    @namedFactory
    protected static _fixed<E>(length: int): JSArray<E> {
        // Explicit type test is necessary to guard against JavaScript conversions
        // in unchecked mode, and against `new Array(null)` which creates a single
        // element Array containing `null`.
        if (!_dart.is(length, 'int')) {
            throw new ArgumentError.value(length, 'length', 'is not an integer');
        }
        // The JavaScript Array constructor with one argument throws if
        // the value is not a UInt32. Give a better error message.
        let maxJSArrayLength: int = 0xFFFFFFFF;
        if (length < 0 || length > maxJSArrayLength) {
            throw new RangeError.range(length, 0, maxJSArrayLength, 'length');
        }
        return new JSArray.markFixed<E>(new Array(length) /*JS('', 'new Array(#)', length)*/);
    }

    static fixed: new<E>(length: int) => JSArray<E>;

    /**
     * Returns a fresh growable JavaScript Array of zero length length.
     */
    @namedFactory
    protected static _emptyGrowable<E>(): JSArray<E> {
        return new JSArray.markGrowable<E>([] /*JS('', '[]')*/);
    }

    static emptyGrowable: new<E>() => JSArray<E>;

    /**
     * Returns a fresh growable JavaScript Array with initial length.
     *
     * [validatedLength] must be a non-negative integer.
     */
    @namedFactory
    protected static _growable<E>(length: int): JSArray<E> {
        // Explicit type test is necessary to guard against JavaScript conversions
        // in unchecked mode.
        if ((!_dart.is(length, 'int')) || (length < 0)) {
            throw new ArgumentError('Length must be a non-negative integer: $length');
        }
        return new JSArray.markGrowable<E>(new Array(length) /*JS('', 'new Array(#)', length)*/);
    }

    static growable: new<E>(length: int) => JSArray<E>;

    /**
     * Constructor for adding type parameters to an existing JavaScript Array.
     * The compiler specially recognizes this constructor.
     *
     *     var a = new JSArray<int>.typed(JS('JSExtendableArray', '[]'));
     *     a is List<int>    --> true
     *     a is List<String> --> false
     *
     * Usually either the [JSArray.markFixed] or [JSArray.markGrowable]
     * constructors is used instead.
     *
     * The input must be a JavaScript Array.  The JS form is just a re-assertion
     * to help type analysis when the input type is sloppy.
     */
    @namedFactory
    protected static _typed<E>(allocation: any): JSArray<E> {
        return allocation /*JS('JSArray', '#', allocation)*/;
    }

    static typed: new<E>(allocation: any) => JSArray<E>;

    @namedFactory
    protected static _markFixed<E>(allocation: any): JSArray<E> {
        // JS('JSFixedArray', '#', markFixedList(new JSArray<E>.typed(allocation)));
        return JSArray.markFixedList(new JSArray.typed<E>(allocation)) as JSArray<E>;
    }

    static markFixed: new<E>(allocation: any) => JSArray<E>;


    @namedFactory
    protected static _markGrowable<E>(allocation: any): JSArray<E> {
        //JS('JSExtendableArray', '#', new JSArray < E >.typed(allocation));
        return new JSArray.typed<E>(allocation);
    }

    static markGrowable: new<E>(allocation: any) => JSArray<E>;

    static markFixedList(list: DartList<any>): DartList<any> {
        // Functions are stored in the hidden class and not as properties in
        // the object. We never actually look at the value, but only want
        // to know if the property exists.
        //JS('void', r'#.fixed$length = Array', list);
        (list as any).fixed$length = Array;
        return list /* JS('JSFixedArray', '#', list)*/;
    }

    static markUnmodifiableList(list: DartList<any>): DartList<any> {
        // Functions are stored in the hidden class and not as properties in
        // the object. We never actually look at the value, but only want
        // to know if the property exists.
        // JS('void', r'#.fixed$length = Array', list);
        (list as any).fixed$length = Array;
        // JS('void', r'#.immutable$list = Array', list);
        (list as any).immutable$list = Array;
        return list /* JS('JSUnmodifiableArray', '#', list)*/;
    }

    checkMutable(reason) {
        if (!_dart.is(this, JSMutableArray)) {
            throw new UnsupportedError(reason);
        }
    }

    checkGrowable(reason) {
        if (!_dart.is(this, JSExtendableArray)) {
            throw new UnsupportedError(reason);
        }
    }

    add(value: E): void {
        this.checkGrowable('add');
        //JS('void', r'#.push(#)', this, value);
        this.push(value);
    }

    removeAt(index: int): E {
        this.checkGrowable('removeAt');
        if (!_dart.is(index, 'int')) throw argumentErrorValue(index);
        if (index < 0 || index >= this.length) {
            throw new RangeError.value(index);
        }
        return this.splice(index, 1)[0] /* JS('var', r'#.splice(#, 1)[0]', this, index)*/;
    }

    insert(index: int, value: E): void {
        this.checkGrowable('insert');
        if (!_dart.is(index, 'int')) throw argumentErrorValue(index);
        if (index < 0 || index > length) {
            throw new RangeError.value(index);
        }
        //JS('void', r'#.splice(#, 0, #)', this, index, value);
        this.splice(index, 0, value);
    }

    insertAll(index: int, iterable: DartIterable<E>): void {
        this.checkGrowable('insertAll');
        RangeError.checkValueInInterval(index, 0, this.length, 'index');
        if (!_dart.is(iterable, DartEfficientLengthIterable)) {
            iterable = iterable.toList();
        }
        let insertionLength = iterable.length;
        this.length += insertionLength;
        let end = index + insertionLength;
        this.setRange(end, this.length, this, index);
        this.setRange(index, end, iterable);
    }

    setAll(index: int, iterable: DartIterable<E>): void {
        this.checkMutable('setAll');
        RangeError.checkValueInInterval(index, 0, this.length, 'index');
        for (let element of iterable) {
            this[index++] = element;
        }
    }

    removeLast(): E {
        this.checkGrowable('removeLast');
        if (length == 0) throw diagnoseIndexError(this, -1);
        return this.pop() /* JS('var', r'#.pop()', this)*/;
    }

    remove(element: any): bool {
        this.checkGrowable('remove');
        for (let i = 0; i < this.length; i++) {
            if (_dart.equals(this[i], element)) {
                //JS('var', r'#.splice(#, 1)', this, i);
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * Removes elements matching [test] from [this] List.
     */
    removeWhere(test: (element: E) => bool): void {
        this.checkGrowable('removeWhere');
        this._removeWhere(test, true);
    }

    retainWhere(test: (element: E) => bool): void {
        this.checkGrowable('retainWhere');
        this._removeWhere(test, false);
    }

    protected _removeWhere(test: (element: E) => bool, removeMatching: bool): void {
        // Performed in two steps, to avoid exposing an inconsistent state
        // to the [test] function. First the elements to retain are found, and then
        // the original list is updated to contain those elements.

        // TODO(sra): Replace this algorithm with one that retains a list of ranges
        // to be removed.  Most real uses remove 0, 1 or a few clustered elements.

        let retained = new JSArray();
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            // !test() ensures bool conversion in checked mode.
            if (!test(element) === removeMatching) {
                retained.add(element);
            }
            if (this.length != end) throw new ConcurrentModificationError(this);
        }
        if (retained.length == end) return;
        this.length = retained.length;
        for (let i = 0; i < retained.length; i++) {
            // We don't need a bounds check or an element type check.
            //JS('', '#[#] = #', this, i, retained[i]);
            this[i] = retained[i];
        }
    }

    where(f: (element: E) => bool): DartIterable<E> {
        return new DartWhereIterable<E>(this, f);
    }

    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return new DartExpandIterable<E, T>(this, f);
    }

    addAll(collection: DartIterable<E>): void {
        let i = this.length;
        this.checkGrowable('addAll');
        for (let e of collection) {
            //assert(
            //    i++ == this.length || (throw new ConcurrentModificationError(this)));
            //JS('void', r'#.push(#)', this, e);
            this.push(e);
        }
    }

    clear(): void {
        this.length = 0;
    }

    forEach(...args: any[])
    forEach(f: (element: E) => void): void {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            f(element);
            if (this.length != end) throw new ConcurrentModificationError(this);
        }
    }

    map(...args: any[])
    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartMappedListIterable<E, T>(this, f) as any;
    }

    join(separator?: string /* = ''*/): string {
        let list = new DartList(this.length);
        for (let i = 0; i < this.length; i++) {
            list[i] = `${this[i]}`;
        }
        return list.join(separator) /*JS('String', '#.join(#)', list, separator)*/;
    }

    take(n: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, 0, n);
    }

    takeWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartTakeWhileIterable<E>(this, test);
    }

    skip(n: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, n, null);
    }

    skipWhile(test: (value: E) => bool): DartIterable<E> {
        return new DartSkipWhileIterable<E>(this, test);
    }

    reduce(...args: any[])
    reduce(combine: (previousValue: E, element: E) => E): E {
        let length = this.length;
        if (length == 0) throw DartIterableElementError.noElement();
        let value = this[0];
        for (let i = 1; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            value = combine(value, element);
            if (length != this.length) throw new ConcurrentModificationError(this);
        }
        return value;
    }

    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        let value = initialValue;
        let length = this.length;
        for (let i = 0; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
            value = combine(value, element);
            if (this.length != length) throw new ConcurrentModificationError(this);
        }
        return value;
    }

    firstWhere(test: (value: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let end = this.length;
        for (let i = 0; i < end; ++i) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            var element = this[i] /*JS('', '#[#]', this, i)*/;
            if (test(element)) return element;
            if (this.length != end) throw new ConcurrentModificationError(this);
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (value: E) => bool, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /* JS('', '#[#]', this, i)*/;
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
        let matchFound = false;
        for (let i = 0; i < length; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            var element = this[i] /* JS('', '#[#]', this, i)*/;
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

    elementAt(index: int): E {
        return this[index];
    }

    sublist(start: int, end?: int): DartList<E> {
        checkNull(start); // TODO(ahe): This is not specified but co19 tests it.
        if (!_dart.is(start, 'int')) throw argumentErrorValue(start);
        if (start < 0 || start > length) {
            throw new RangeError.range(start, 0, length, 'start');
        }
        if (end == null) {
            end = length;
        } else {
            if (!_dart.is(end, 'int')) throw argumentErrorValue(end);
            if (end < start || end > length) {
                throw new RangeError.range(end, start, length, 'end');
            }
        }
        if (start == end) return new DartList<E>();
        return new JSArray.markGrowable<E>(
            this.slice(start, end) /*JS('', r'#.slice(#, #)', this, start, end)*/);
    }

    getRange(start: int, end: int): DartIterable<E> {
        RangeError.checkValidRange(start, end, this.length);
        return new DartSubListIterable<E>(this, start, end);
    }

    get first(): E {
        if (this.length > 0) return this[OPERATOR_INDEX](0);
        throw DartIterableElementError.noElement();
    }

    get last(): E {
        if (length > 0) return this[OPERATOR_INDEX](length - 1);
        throw DartIterableElementError.noElement();
    }

    get single(): E {
        if (this.length == 1) return this[OPERATOR_INDEX](0);
        if (this.length == 0) throw DartIterableElementError.noElement();
        throw DartIterableElementError.tooMany();
    }

    removeRange(start: int, end: int): void {
        this.checkGrowable('removeRange');
        RangeError.checkValidRange(start, end, this.length);
        let deleteCount = end - start;
        //JS('', '#.splice(#, #)', this, start, deleteCount);
        this.splice(start, deleteCount);
    }

    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int /* = 0*/): void {
        skipCount = skipCount || 0;
        this.checkMutable('setRange');

        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length == 0) return;
        RangeError.checkNotNegative(skipCount, 'skipCount');

        let otherList: DartList<E>;
        let otherStart;
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
            // TODO(sra): If [from] is the same Array as [this], we can copy without
            // type annotation checks on the stores.
            for (let i = length - 1; i >= 0; i--) {
                // Use JS to avoid bounds check (the bounds check elimination
                // optimzation is too weak). The 'E' type annotation is a store type
                // check - we can't rely on iterable, it could be List<dynamic>.
                let element = otherList[OPERATOR_INDEX](otherStart + i);
                //JS('', '#[#] = #', this, start + i, element);
                this[start + i] = element;
            }
        } else {
            for (let i = 0; i < length; i++) {
                let element = otherList[OPERATOR_INDEX](otherStart + i);
                //JS('', '#[#] = #', this, start + i, element);
                this[start + i] = element;
            }
        }
    }

    fillRange(start: int, end: int, fillValue?: E) {
        this.checkMutable('fill range');
        RangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
            // Store is safe since [fillValue] type has been checked as parameter.
            //JS('', '#[#] = #', this, i, fillValue);
            this[i] = fillValue;
        }
    }

    replaceRange(start: int, end: int, replacement: DartIterable<E>): void {
        this.checkGrowable('replaceRange');
        RangeError.checkValidRange(start, end, this.length);
        if (!_dart.is(replacement, DartEfficientLengthIterable)) {
            replacement = replacement.toList();
        }
        let removeLength = end - start;
        let insertLength = replacement.length;
        if (removeLength >= insertLength) {
            let delta = removeLength - insertLength;
            let insertEnd = start + insertLength;
            let newLength = this.length - delta;
            this.setRange(start, insertEnd, replacement);
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
            this.setRange(start, insertEnd, replacement);
        }
    }

    any(test: (element: E) => bool): bool {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            if (test(element)) return true;
            if (this.length != end) throw new ConcurrentModificationError(this);
        }
        return false;
    }

    every(...args: any[])
    every(test: (element: E) => bool): bool {
        let end = this.length;
        for (let i = 0; i < end; i++) {
            // TODO(22407): Improve bounds check elimination to allow this JS code to
            // be replaced by indexing.
            let element = this[i] /*JS('', '#[#]', this, i)*/;
            if (!test(element)) return false;
            if (this.length != end) throw new ConcurrentModificationError(this);
        }
        return true;
    }

    get reversed(): DartIterable<E> {
        return new DartReversedListIterable<E>(this);
    }

    sort(...args: any[])
    sort(compare?: (a: E, b: E) => int): void {
        this.checkMutable('sort');
        DartSort.sort(this, compare == null ? DartComparable.compare : compare);
    }

    shuffle(random?: DartRandom): void {
        this.checkMutable('shuffle');
        if (random == null) random = new DartRandom();
        let length = this.length;
        while (length > 1) {
            let pos = random.nextInt(length);
            length -= 1;
            let tmp = this[OPERATOR_INDEX](length);
            this[OPERATOR_INDEX_ASSIGN](length, this[OPERATOR_INDEX](pos));
            this[OPERATOR_INDEX_ASSIGN](pos, tmp);
        }
    }

    indexOf(element: any, start?: int /*= 0*/): int {
        start = start || 0;
        if (start >= this.length) {
            return -1;
        }
        if (start < 0) {
            start = 0;
        }
        for (let i = start; i < this.length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), element)) {
                return i;
            }
        }
        return -1;
    }

    lastIndexOf(element: any, startIndex?: int /*= 0*/): int {
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

    contains(other: any): bool {
        for (let i = 0; i < length; i++) {
            if (_dart.equals(this[OPERATOR_INDEX](i), other)) return true;
        }
        return false;
    }

    get isEmpty(): bool {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    toString(): string {
        return DartListBase.listToString(this);
    }

    toList(_?: { growable?: bool /*  true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        return growable ? this._toListGrowable() : this._toListFixed();
    }

    _toListGrowable(): DartList<E> {
        // slice(0) is slightly faster than slice()
        return new JSArray.markGrowable<E>(this.slice(0)/*JS('', '#.slice(0)', this)*/);
    }

    _toListFixed(): DartList<E> {
        return new JSArray.markFixed<E>(this.slice(0) /*JS('', '#.slice(0)', this)*/);
    }

    toSet(): DartSet<E> {
        return new DartSet.from<E>(this);
    }

    get iterator(): DartIterator<E> {
        return new DartArrayIterator<E>(this);
    }

    get hashCode(): int {
        return DartPrimitives.objectHashCode(this);
    }

    get length(): int {
        return super.length /*JS('JSUInt32', r'#.length', this)*/;
    }

    set length(newLength: int) {
        this.checkGrowable('set length');
        if (!_dart.is(newLength, 'int')) {
            throw new ArgumentError.value(newLength, 'newLength');
        }
        // TODO(sra): Remove this test and let JavaScript throw an error.
        if (newLength < 0) {
            throw new RangeError.range(newLength, 0, null, 'newLength');
        }
        // JavaScript with throw a RangeError for numbers that are too big. The
        // message does not contain the value.
        //JS('void', r'#.length = #', this, newLength);
        super.length = newLength
    }

    [OPERATOR_INDEX](index: int): E {
        if (!_dart.is(index, 'int')) throw diagnoseIndexError(this, index);
        if (index >= length || index < 0) throw diagnoseIndexError(this, index);
        return this[index] /* JS('var', '#[#]', this, index)*/;
    }

    [OPERATOR_INDEX_ASSIGN](index: int, value: E) {
        this.checkMutable('indexed set');
        if (!_dart.is(index, 'int')) throw diagnoseIndexError(this, index);
        if (index >= length || index < 0) throw diagnoseIndexError(this, index);
        //JS('void', r'#[#] = #', this, index, value);
        this[index] = value;
    }

    asMap(): DartMap<int, E> {
        return new DartListMapView<E>(this);
    }
}

/**
 * Dummy subclasses that allow the backend to track more precise
 * information about arrays through their type. The CPA type inference
 * relies on the fact that these classes do not override [] nor []=.
 *
 * These classes are really a fiction, and can have no methods, since
 * getInterceptor always returns JSArray.  We should consider pushing the
 * 'isGrowable' and 'isMutable' checks into the getInterceptor implementation so
 * these classes can have specialized implementations. Doing so will challenge
 * many assumptions in the JS backend.
 */
export class JSMutableArray<E> extends JSArray<E> implements JSMutableIndexable<E> {
}

export class JSFixedArray<E> extends JSMutableArray<E> {
}

class JSExtendableArray<E> extends JSMutableArray<E> {
}

export class JSUnmodifiableArray<E> extends JSArray<E> {
} // Already is JSIndexable.

/// An [Iterator] that iterates a JSArray.
///
export class DartArrayIterator<E> implements DartIterator<E> {
    protected _iterable: JSArray<E>;
    protected _length: int;
    protected _index: int;
    protected _current: E;

    constructor(iterable: JSArray<E>) {

        this._iterable = iterable;
        this._length = iterable.length;
        this._index = 0;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        let length = this._iterable.length;

        // We have to do the length check even on fixed length Arrays.  If we can
        // inline moveNext() we might be able to GVN the length and eliminate this
        // check on known fixed length JSArray.
        if (this._length != length) {
            throw throwConcurrentModificationError(this._iterable);
        }

        if (this._index >= length) {
            this._current = null;
            return false;
        }
        this._current = this._iterable[OPERATOR_INDEX](this._index);
        this._index++;
        return true;
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}
