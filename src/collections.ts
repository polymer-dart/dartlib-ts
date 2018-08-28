import _dart from './_common';
import {DartString} from "./string";
import {DartClass, defaultConstructor, defaultFactory, mixin, namedConstructor, namedFactory, NamedFactory} from "./utils";
import {
    UnsupportedError as DartUnsupportedError,
    ConcurrentModificationError as DartConcurrentModificationError,
    RangeError as DartRangeError,
    StateError as DartStateError,
    ArgumentError as DartArgumentError
} from "./errors";
import {DartObject, int, OPERATOR_INDEX_ASSIGN, OPERATOR_INDEX} from "./core";
import {DartComparator} from "./core/comparable";
import {DartStringBuffer} from "./core/string_buffer";
import {DartRandom} from "./math/random";
import {DartMap} from "./core/map";
import {DartSet} from "./core/set";


/**
 * An unmodifiable [List] view of another List.
 *
 * The source of the elements may be a [List] or any [Iterable] with
 * efficient [Iterable.length] and [Iterable.elementAt].
 */
class UnmodifiableListView<E> extends DartUnmodifiableListBase<E> {

    _source: DartIterable<E>;

    /**
     * Creates an unmodifiable list backed by [source].
     *
     * The [source] of the elements may be a [List] or any [Iterable] with
     * efficient [Iterable.length] and [Iterable.elementAt].
     */
    constructor(source: DartIterable<E>) {
        super();
        this._source = source;
    }


    get length(): int {

        return this._source.length;
    }


    [OPERATOR_INDEX](index: int) {
        return this._source.elementAt(index);
    }
}


/**
 * Mixin that throws on the length changing operations of [List].
 *
 * Intended to mix-in on top of [ListMixin] for fixed-length lists.
 */
class DartFixedLengthListMixin<E> {
    /** This operation is not supported by a fixed length list. */
    set length(newLength: int) {
        throw new DartUnsupportedError("Cannot change the length of a fixed-length list");
    }


    /** This operation is not supported by a fixed length list. */

    add(value: E): void {
        throw new DartUnsupportedError("Cannot add to a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */


    insert(index: int, value: E): void {
        throw new DartUnsupportedError("Cannot add to a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    insertAll(at: int, iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot add to a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    addAll(iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot add to a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */

    remove(element: DartObject): boolean {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    removeWhere(test: (element: E) => boolean): void {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    retainWhere(test: (element: E) => boolean): void {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    clear(): void {
        throw new DartUnsupportedError("Cannot clear a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */

    removeAt(index: int): E {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */

    removeLast(): E {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    removeRange(start: int, end: int): void {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }

    /** This operation is not supported by a fixed length list. */
    replaceRange(
        start: int,
        end: int, iterable: DartIterable<E>
    ): void {
        throw new DartUnsupportedError("Cannot remove from a fixed-length list");
    }
}

/**
 * Mixin for an unmodifiable [List] class.
 *
 * This overrides all mutating methods with methods that throw.
 * This mixin is intended to be mixed in on top of [ListMixin] on
 * unmodifiable lists.
 */
export class DartUnmodifiableListMixin<E> {

    /** This operation is not supported by an unmodifiable list. */
    [OPERATOR_INDEX_ASSIGN](index: int, value: E) {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    set length(newLength: int) {
        throw new DartUnsupportedError("Cannot change the length of an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    setAll(at: int, iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    add(value: E): void {
        throw new DartUnsupportedError("Cannot add to an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    insert(index: int, element: E): void {
        throw new DartUnsupportedError("Cannot add to an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    insertAll(at: int, iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot add to an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    addAll(iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot add to an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */

    remove(element: DartObject): boolean {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    removeWhere(test: (element: E) => boolean): void {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    retainWhere(test: (element: E) => boolean): void {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    sort(compare?: DartComparator<E>): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    shuffle(random?: DartRandom): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    clear(): void {
        throw new DartUnsupportedError("Cannot clear an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */

    removeAt(index: int): E {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */

    removeLast(): E {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int /* = 0*/): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    removeRange(start: int, end: int): void {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    replaceRange(start: int, end: int, iterable: DartIterable<E>): void {
        throw new DartUnsupportedError("Cannot remove from an unmodifiable list");
    }

    /** This operation is not supported by an unmodifiable list. */
    fillRange(start: int, end: int, fillValue?: E): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable list");
    }
}

/**
 * Abstract implementation of a fixed-length list.
 *
 * All operations are defined in terms of `length`, `operator[]` and
 * `operator[]=`, which need to be implemented.
 */
abstract class FixedLengthListBase<E> extends mixin(DartFixedLengthListMixin, ListBase) {
}


/**
 * A collection of values, or "elements", that can be accessed sequentially.
 *
 * The elements of the iterable are accessed by getting an [Iterator]
 * using the [iterator] getter, and using it to step through the values.
 * Stepping with the iterator is done by calling [Iterator.moveNext],
 * and if the call returns `true`,
 * the iterator has now moved to the next element,
 * which is then available as [Iterator.current].
 * If the call returns `false`, there are no more elements,
 * and `iterator.current` returns `null`.
 *
 * You can create more than one iterator from the same `Iterable`.
 * Each time `iterator` is read, it returns a new iterator,
 * and different iterators can be stepped through independently,
 * each giving access to all the elements of the iterable.
 * The iterators of the same iterable *should* provide the same values
 * in the same order (unless the underlying collection is modified between
 * the iterations, which some collections allow).
 *
 * You can also iterate over the elements of an `Iterable`
 * using the for-in loop construct, which uses the `iterator` getter behind the
 * scenes.
 * For example, you can iterate over all of the keys of a [Map],
 * because `Map` keys are iterable.
 *
 *     Map kidsBooks = {'Matilda': 'Roald Dahl',
 *                      'Green Eggs and Ham': 'Dr Seuss',
 *                      'Where the Wild Things Are': 'Maurice Sendak'};
 *     for (var book in kidsBooks.keys) {
 *       print('$book was written by ${kidsBooks[book]}');
 *     }
 *
 * The [List] and [Set] classes are both `Iterable`,
 * as are most classes in the [dart:collection](#dart-collection) library.
 *
 * Some [Iterable] collections can be modified.
 * Adding an element to a `List` or `Set` will change which elements it
 * contains, and adding a new key to a `Map` changes the elements of [Map.keys].
 * Iterators created after the change will provide the new elements, and may
 * or may not preserve the order of existing elements
 * (for example, a [HashSet] may completely change its order when a single
 * element is added).
 *
 * Changing a collection *while* it is being iterated
 * is generally *not* allowed.
 * Doing so will break the iteration, which is typically signalled
 * by throwing a [ConcurrentModificationError]
 * the next time [Iterator.moveNext] is called.
 * The current value of [Iterator.current] getter
 * should not be affected by the change in the collection,
 * the `current` value was set by the previous call to [Iterator.moveNext].
 *
 * Some iterables compute their elements dynamically every time they are
 * iterated, like the one returned by [Iterable.generate] or the iterable
 * returned by a `sync*` generator function. If the computation doesn't depend
 * on other objects that may change, then the generated sequence should be
 * the same one every time it's iterated.
 *
 * The members of `Iterable`, other than `iterator` itself,
 * work by looking at the elements of the iterable.
 * This can be implemented by running through the [iterator], but some classes
 * may have more efficient ways of finding the result
 * (like [last] or [length] on a [List], or [contains] on a [Set]).
 *
 * The methods that return another `Iterable` (like [map] and [where])
 * are all *lazy* - they will iterate the original (as necessary)
 * every time the returned iterable is iterated, and not before.
 *
 * Since an iterable may be iterated more than once, it's not recommended to
 * have detectable side-effects in the iterator.
 * For methods like [map] and [where], the returned iterable will execute the
 * argument function on every iteration, so those functions should also not
 * have side effects.
 */
@DartClass
export abstract class DartIterable<E> implements Iterable<E> {
    /**
     * A Dart Iterable is also a JS iterable and can be used in for loop syntax
     */
    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }


    /**
     * Creates an `Iterable` which generates its elements dynamically.
     *
     * The generated iterable has [count] elements,
     * and the element at index `n` is computed by calling `generator(n)`.
     * Values are not cached, so each iteration computes the values again.
     *
     * If [generator] is omitted, it defaults to an identity function
     * on integers `(int x) => x`, so it may only be omitted if the type
     * parameter allows integer values. That is, if [E] is one of
     * `int`, `num`, `Object` or `dynamic`.
     *
     * As an `Iterable`, `new Iterable.generate(n, generator))` is equivalent to
     * `const [0, ..., n - 1].map(generator)`.
     */

    @NamedFactory('generate')
    protected static _generate<E>(count: int, generator?: (index: int) => E): DartIterable<E> {
        if (count <= 0)
            return new DartEmptyIterable<E>();

        return new _GeneratorIterable<E>(count, generator);
    }

    static generate: new<E> (count: int, generator?: (index: int) => E) => DartIterable<E>;

    /**
     * Creates an empty iterable.
     *
     * The empty iterable has no elements, and iterating it always stops
     * immediately.
     */

    @NamedFactory('empty')
    protected static _empty<E>() {
        return new DartEmptyIterable<E>();
    }

    static empty: new<E>() => DartIterable<E>;

    /**
     * Returns a new `Iterator` that allows iterating the elements of this
     * `Iterable`.
     *
     * Iterable classes may specify the iteration order of their elements
     * (for example [List] always iterate in index order),
     * or they may leave it unspecified (for example a hash-based [Set]
     * may iterate in any order).
     *
     * Each time `iterator` is read, it returns a new iterator,
     * which can be used to iterate through all the elements again.
     * The iterators of the same iterable can be stepped through independently,
     * but should return the same elements in the same order,
     * as long as the underlying collection isn't changed.
     *
     * Modifying the collection may cause new iterators to produce
     * different elements, and may change the order of existing elements.
     * A [List] specifies its iteration order precisely,
     * so modifying the list changes the iteration order predictably.
     * A hash-based [Set] may change its iteration order completely
     * when adding a new element to the set.
     *
     * Modifying the underlying collection after creating the new iterator
     * may cause an error the next time [Iterator.moveNext] is called
     * on that iterator.
     * Any *modifiable* iterable class should specify which operations will
     * break iteration.
     */
    abstract get iterator(): DartIterator<E>;


    /**
     * Returns a new lazy [Iterable] with elements that are created by
     * calling `f` on each element of this `Iterable` in iteration order.
     *
     * This method returns a view of the mapped elements. As long as the
     * returned [Iterable] is not iterated over, the supplied function [f] will
     * not be invoked. The transformed elements will not be cached. Iterating
     * multiple times over the returned [Iterable] will invoke the supplied
     * function [f] multiple times on the same element.
     *
     * Methods on the returned iterable are allowed to omit calling `f`
     * on any element where the result isn't needed.
     * For example, [elementAt] may call `f` only once.
     */
    map<T>(f: (e: E) => T): DartIterable<T> {
        return new DartMappedIterable<E, T>(this, f);
    }

    /**
     * Returns a new lazy [Iterable] with all elements that satisfy the
     * predicate [test].
     *
     * The matching elements have the same order in the returned iterable
     * as they have in [iterator].
     *
     * This method returns a view of the mapped elements.
     * As long as the returned [Iterable] is not iterated over,
     * the supplied function [test] will not be invoked.
     * Iterating will not cache results, and thus iterating multiple times over
     * the returned [Iterable] may invoke the supplied
     * function [test] multiple times on the same element.
     */
    where(test: (element: E) => boolean): DartIterable<E> {
        return new DartWhereIterable<E>(this, test);
    }

    /**
     * Expands each element of this [Iterable] into zero or more elements.
     *
     * The resulting Iterable runs through the elements returned
     * by [f] for each element of this, in iteration order.
     *
     * The returned [Iterable] is lazy, and calls [f] for each element
     * of this every time it's iterated.
     *
     * Example:
     *
     *     var pairs = [[1, 2], [3, 4]];
     *     var flattened = pairs.expand((pair) => pair).toList();
     *     print(flattened); // => [1, 2, 3, 4];
     *
     *     var input = [1, 2, 3];
     *     var duplicated = input.expand((i) => [i, i]).toList();
     *     print(duplicated); // => [1, 1, 2, 2, 3, 3]
     *
     */
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T> {
        return new DartExpandIterable<E, T>(this, f);

    }

    /**
     * Returns true if the collection contains an element equal to [element].
     *
     * This operation will check each element in order for being equal to
     * [element], unless it has a more efficient way to find an element
     * equal to [element].
     *
     * The equality used to determine whether [element] is equal to an element of
     * the iterable defaults to the [Object.==] of the element.
     *
     * Some types of iterable may have a different equality used for its elements.
     * For example, a [Set] may have a custom equality
     * (see [Set.identity]) that its `contains` uses.
     * Likewise the `Iterable` returned by a [Map.keys] call
     * should use the same equality that the `Map` uses for keys.
     */
    contains(element: Object): boolean {
        for (let e of this) {
            if (e == element) return true;
        }
        return false;
    }

    /**
     * Applies the function [f] to each element of this collection in iteration
     * order.
     */
    forEach(f: (element: E) => any): void {
        for (let element of this)
            f(element);
    }

    /**
     * Reduces a collection to a single value by iteratively combining elements
     * of the collection using the provided function.
     *
     * The iterable must have at least one element.
     * If it has only one element, that element is returned.
     *
     * Otherwise this method starts with the first element from the iterator,
     * and then combines it with the remaining elements in iteration order,
     * as if by:
     *
     *     E value = iterable.first;
     *     iterable.skip(1).forEach((element) {
     *       value = combine(value, element);
     *     });
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.reduce((value, element) => value + element);
     *
     */
    reduce(combine: (value: E, element: E) => E): E {
        let iterator: DartIterator<E> = this.iterator;
        if (!iterator.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        let value: E = iterator.current;
        while (iterator.moveNext()) {
            value = combine(value, iterator.current);
        }
        return value;
    }

    /**
     * Reduces a collection to a single value by iteratively combining each
     * element of the collection with an existing value
     *
     * Uses [initialValue] as the initial value,
     * then iterates through the elements and updates the value with
     * each element using the [combine] function, as if by:
     *
     *     var value = initialValue;
     *     for (E element in this) {
     *       value = combine(value, element);
     *     }
     *     return value;
     *
     * Example of calculating the sum of an iterable:
     *
     *     iterable.fold(0, (prev, element) => prev + element);
     *
     */

    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        let value = initialValue;
        for (let element of this)
            value = combine(value, element);
        return value;
    }

    /**
     * Checks whether every element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `false` if
     * any of them make [test] return `false`, otherwise returns `true`.
     */
    every(f: (element: E) => boolean): boolean {
        for (let element of this) {
            if (!f(element)) return false;
        }
        return true;
    }

    /**
     * Converts each element to a [String] and concatenates the strings.
     *
     * Iterates through elements of this iterable,
     * converts each one to a [String] by calling [Object.toString],
     * and then concatenates the strings, with the
     * [separator] string interleaved between the elements.
     */

    join(separator?: string /* = ""*/): string {
        separator = separator || "";
        let iterator: DartIterator<E> = this.iterator;
        if (!iterator.moveNext()) return "";
        let buffer: DartStringBuffer = new DartStringBuffer();
        if (separator == null || separator == "") {
            do {
                buffer.write("${iterator.current}");
            } while (iterator.moveNext());
        } else {
            buffer.write("${iterator.current}");
            while (iterator.moveNext()) {
                buffer.write(separator);
                buffer.write("${iterator.current}");
            }
        }
        return buffer.toString();
    }

    /**
     * Checks whether any element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `true` if
     * any of them make [test] return `true`, otherwise returns false.
     */

    any(f: (element: E) => boolean): boolean {
        for (let element of this) {
            if (f(element)) return true;
        }
        return false;
    }

    /**
     * Creates a [List] containing the elements of this [Iterable].
     *
     * The elements are in iteration order.
     * The list is fixed-length if [growable] is false.
     */
    toList(_?: { growable?: boolean  /* : true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        return new DartList.from(this, {
            growable: growable
        });
    }

    /**
     * Creates a [Set] containing the same elements as this iterable.
     *
     * The set may contain fewer elements than the iterable,
     * if the iterable contains an element more than once,
     * or it contains one or more elements that are equal.
     * The order of the elements in the set is not guaranteed to be the same
     * as for the iterable.
     */
    toSet(): DartSet<E> {
        return new DartSet.from<E>(this);
    }


    /**
     * Returns the number of elements in [this].
     *
     * Counting all elements may involve iterating through all elements and can
     * therefore be slow.
     * Some iterables have a more efficient way to find the number of elements.
     */
    get length(): int {


        let count: int = 0;

        let it: DartIterator<E> = this.iterator;
        while (it.moveNext()) {
            count++;
        }
        return count;
    }

    /**
     * Returns `true` if there are no elements in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `false`.
     */
    get isEmpty(): boolean {
        return !this.iterator.moveNext();
    }

    /**
     * Returns true if there is at least one element in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `true`.
     */
    get isNotEmpty(): boolean {
        return !this.isEmpty;
    }

    /**
     * Returns a lazy iterable of the [count] first elements of this iterable.
     *
     * The returned `Iterable` may contain fewer than `count` elements, if `this`
     * contains fewer than `count` elements.
     *
     * The elements can be computed by stepping through [iterator] until [count]
     * elements have been seen.
     *
     * The `count` must not be negative.
     */
    take(count: int): DartIterable<E> {
        return new DartTakeIterable<E>(this, count);
    }

    /**
     * Returns a lazy iterable of the leading elements satisfying [test].
     *
     * The filtering happens lazily. Every new iterator of the returned
     * iterable starts iterating over the elements of `this`.
     *
     * The elements can be computed by stepping through [iterator] until an
     * element is found where `test(element)` is false. At that point,
     * the returned iterable stops (its `moveNext()` returns false).
     */
    takeWhile(test: (value: E) => boolean): DartIterable<E> {
        return new DartTakeWhileIterable<E>(this, test);
    }

    /**
     * Returns an [Iterable] that provides all but the first [count] elements.
     *
     * When the returned iterable is iterated, it starts iterating over `this`,
     * first skipping past the initial [count] elements.
     * If `this` has fewer than `count` elements, then the resulting Iterable is
     * empty.
     * After that, the remaining elements are iterated in the same order as
     * in this iterable.
     *
     * Some iterables may be able to find later elements without first iterating
     * through earlier elements, for example when iterating a [List].
     * Such iterables are allowed to ignore the initial skipped elements.
     *
     * The [count] must not be negative.
     */
    skip(count: int): DartIterable<E> {
        return new DartSkipIterable<E>(this, count);
    }

    /**
     * Returns an `Iterable` that skips leading elements while [test] is satisfied.
     *
     * The filtering happens lazily. Every new [Iterator] of the returned
     * iterable iterates over all elements of `this`.
     *
     * The returned iterable provides elements by iterating this iterable,
     * but skipping over all initial elements where `test(element)` returns
     * true. If all elements satisfy `test` the resulting iterable is empty,
     * otherwise it iterates the remaining elements in their original order,
     * starting with the first element for which `test(element)` returns `false`.
     */
    skipWhile(test: (value: E) => boolean): DartIterable<E> {
        return new DartSkipWhileIterable<E>(this, test);
    }

    /**
     * Returns the first element.
     *
     * Throws a [StateError] if `this` is empty.
     * Otherwise returns the first element in the iteration order,
     * equivalent to `this.elementAt(0)`.
     */
    get first(): E {
        let it: DartIterator<E> = this.iterator;
        if (!it.moveNext()) {
            throw DartIterableElementError.noElement();
        }
        return it.current;
    }

    /**
     * Returns the last element.
     *
     * Throws a [StateError] if `this` is empty.
     * Otherwise may iterate through the elements and returns the last one
     * seen.
     * Some iterables may have more efficient ways to find the last element
     * (for example a list can directly access the last element,
     * without iterating through the previous ones).
     */
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

    /**
     * Checks that this iterable has only one element, and returns that element.
     *
     * Throws a [StateError] if `this` is empty or has more than one element.
     */
    get single(): E {
        let it: DartIterator<E> = this.iterator;
        if (!it.moveNext()) throw DartIterableElementError.noElement();
        let result = it.current;
        if (it.moveNext()) throw DartIterableElementError.tooMany();
        return result;
    }

    /**
     * Returns the first element that satisfies the given predicate [test].
     *
     * Iterates through elements and returns the first to satisfy [test].
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */

    firstWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E {
        let {orElse} = Object.assign({}, _);
        for (let element of this) {
            if (test(element)) return element;
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    /**
     * Returns the last element that satisfies the given predicate [test].
     *
     * An iterable that can access its elements directly may check its
     * elements in any order (for example a list starts by checking the
     * last element and then moves towards the start of the list).
     * The default implementation iterates elements in iteration order,
     * checks `test(element)` for each,
     * and finally returns that last one that matched.
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */

    lastWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E {
        let {orElse} = Object.assign({}, _);

        let result = null;
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

    /**
     * Returns the single element that satisfies [test].
     *
     * Checks all elements to see if `test(element)` returns true.
     * If exactly one element satisfies [test], that element is returned.
     * Otherwise, if there are no matching elements, or if there is more than
     * one matching element, a [StateError] is thrown.
     */

    singleWhere(test: (element: E) => boolean): E {

        let result: E = null;
        let foundMatching: boolean = false;
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

    /**
     * Returns the [index]th element.
     *
     * The [index] must be non-negative and less than [length].
     * Index zero represents the first element (so `iterable.elementAt(0)` is
     * equivalent to `iterable.first`).
     *
     * May iterate through the elements in iteration order, skipping the
     * first `index` elements and returning the next.
     * Some iterable may have more efficient ways to find the element.
     */
    elementAt(index: int): E {
        if (index !== null && index !== undefined)
            throw new DartArgumentError.notNull("index");
        DartRangeError.checkNotNegative(index, "index");
        let elementIndex: int = 0;
        for (let element of this) {
            if (index == elementIndex) return element;
            elementIndex++;
        }
        throw new DartRangeError.index(index, this, "index", null, elementIndex);
    }

    /**
     * Returns a string representation of (some of) the elements of `this`.
     *
     * Elements are represented by their own `toString` results.
     *
     * The default representation always contains the first three elements.
     * If there are less than a hundred elements in the iterable, it also
     * contains the last two elements.
     *
     * If the resulting string isn't above 80 characters, more elements are
     * included from the start of the iterable.
     *
     * The conversion may omit calling `toString` on some elements if they
     * are known to not occur in the output, and it may stop iterating after
     * a hundred elements.
     */

    toString(): string {
        return IterableBase.iterableToShortString(this, '(', ')');
    }
}

/**
 * Marker interface for [Iterable] subclasses that have an efficient
 * [length] implementation.
 */
export abstract class DartEfficientLengthIterable<T> extends DartIterable<T> {
    /**
     * Returns the number of elements in the iterable.
     *
     * This is an efficient operation that doesn't require iterating through
     * the elements.
     */
    abstract get length(): int;
}

/**
 * An [Iterable] for classes that have efficient [length] and [elementAt].
 *
 * All other methods are implemented in terms of [length] and [elementAt],
 * including [iterator].
 */
abstract class DartListIterable<E> extends DartEfficientLengthIterable<E> {
    abstract get length(): int;

    abstract elementAt(i: int): E;

    constructor() {
        super();
    }

    get iterator(): DartIterator<E> {
        return new DartListIterator<E>(this);
    }

    forEach(action: (element: E) => void): void {
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            action(this.elementAt(i));
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
    }

    get isEmpty(): boolean {
        return this.length == 0;
    }

    get first(): E {
        if (this.length == 0) throw DartIterableElementError.noElement();
        return this.elementAt(0);
    }

    get last(): E {
        if (this.length == 0) throw DartIterableElementError.noElement();
        return this.elementAt(this.length - 1);
    }

    get single(): E {
        if (length == 0) throw DartIterableElementError.noElement();
        if (length > 1) throw DartIterableElementError.tooMany();
        return this.elementAt(0);
    }

    contains(element: DartObject): boolean {
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            if (_dart.equals(this.elementAt(i), element)) return true;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        return false;
    }

    every(test: (element: E) => boolean): boolean {
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            if (!test(this.elementAt(i))) return false;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        return true;
    }

    any(test: (element: E) => boolean): boolean {
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            if (test(this.elementAt(i))) return true;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        return false;
    }

    firstWhere(test: (element: E) => boolean, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            let element: E = this.elementAt(i);
            if (test(element)) return element;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (element: E) => boolean, _?: { orElse?: () => E }): E {
        let {orElse} = Object.assign({}, _);
        let length: int = this.length;
        for (let i = length - 1; i >= 0; i--) {
            let element: E = this.elementAt(i);
            if (test(element)) return element;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    singleWhere(test: (element: E) => boolean): E {
        let length: int = this.length;
        let match: E = null;
        let matchFound: boolean = false;
        for (let i = 0; i < length; i++) {
            let element: E = this.elementAt(i);
            if (test(element)) {
                if (matchFound) {
                    throw DartIterableElementError.tooMany();
                }
                matchFound = true;
                match = element;
            }
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        if (matchFound) return match;
        throw DartIterableElementError.noElement();
    }

    join(separator?: string /* = "" */): string {
        separator = separator || "";
        let length = this.length;
        if (!(new DartString(separator)).isEmpty) {
            if (length == 0) return "";
            let first: string = `${this.elementAt(0)}`;
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
            let buffer: DartStringBuffer = new DartStringBuffer(first);
            for (let i = 1; i < length; i++) {
                buffer.write(separator);
                buffer.write(this.elementAt(i));
                if (length != this.length) {
                    throw new DartConcurrentModificationError(this);
                }
            }
            return buffer.toString();
        } else {
            let buffer: DartStringBuffer = new DartStringBuffer();
            for (let i = 0; i < length; i++) {
                buffer.write(this.elementAt(i));
                if (length != this.length) {
                    throw new DartConcurrentModificationError(this);
                }
            }
            return buffer.toString();
        }
    }

    where(test: (element: E) => boolean): DartIterable<E> {
        return super.where(test);
    }

    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartMappedListIterable<E, T>(this, f);
    }

    reduce(combine: (value: any, element: E) => E): E {
        let length = this.length;
        if (length == 0) throw DartIterableElementError.noElement();
        let value: E = this.elementAt(0);
        for (let i = 1; i < length; i++) {
            value = combine(value, this.elementAt(i));
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        return value;
    }

    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        let value = initialValue;
        let length: int = this.length;
        for (let i = 0; i < length; i++) {
            value = combine(value, this.elementAt(i));
            if (length != this.length) {
                throw new DartConcurrentModificationError(this);
            }
        }
        return value;
    }

    skip(count: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, count, null);
    }

    skipWhile(test: (element: E) => boolean): DartIterable<E> {
        return super.skipWhile(test);
    }

    take(count: int): DartIterable<E> {
        return new DartSubListIterable<E>(this, 0, count);
    }

    takeWhile(test: (element: E) => boolean): DartIterable<E> {
        return super.takeWhile(test);
    }

    toList(_?: { growable?: boolean /* : true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        let result: DartList<E>;
        if (growable) {
            result = new DartList<E>();
            result.length = length;
        } else {
            result = new DartList<E>(length);
        }
        for (let i = 0; i < length; i++) {
            result[i] = this.elementAt(i);
        }
        return result;
    }

    toSet(): DartSet<E> {
        let result: DartSet<E> = new DartSet<E>();
        for (let i = 0; i < length; i++) {
            result.add(this.elementAt(i));
        }
        return result;
    }
}


/**
 * Abstract implementation of an unmodifiable list.
 *
 * All operations are defined in terms of `length` and `operator[]`,
 * which need to be implemented.
 */

abstract class UnmodifiableListBase<E> extends mixin(DartUnmodifiableListMixin, ListBase) {
}

class _ListIndicesIterable extends DartListIterable<int> {

    _backedList: DartList<any>;

    constructor(_backedList: DartList<any>) {
        super();
        this._backedList = _backedList
    }

    get length() {
        return this._backedList.length;
    }

    elementAt(index: int): int {
        DartRangeError.checkValidIndex(index, this);
        return index;
    }
}

class DartListMapView<E> implements DartMap<int, E> {
    _values: DartList<E>;

    constructor(_values: DartList<E>) {
        this._values = _values;
    }


    [OPERATOR_INDEX](key: int): E {
        return this.containsKey(key) ? this._values.elementAt(key) : null;
    }

    get length(): int {
        return this._values.length;
    }

    get values(): DartIterable<E> {
        return new DartSubListIterable<E>(this._values, 0, null);
    }

    get keys(): DartIterable<int> {
        return new _ListIndicesIterable(this._values);
    }

    get isEmpty(): boolean {
        return this._values.isEmpty;
    }

    get isNotEmpty(): boolean {
        return this._values.isNotEmpty;
    }

    containsValue(value: DartObject): boolean {
        return this._values.contains(value);
    }

    containsKey(key: int): boolean {
        return _dart.is(key, 'int') && key >= 0 && key < this.length;
    }

    forEach(f: (key: int, value: E) => any): void {
        let length = this._values.length;
        for (let i = 0; i < length; i++) {
            f(i, this._values.elementAt(i));

            if (length != this._values.length) {
                throw new DartConcurrentModificationError(this._values);
            }
        }
    }

    /** This operation is not supported by an unmodifiable map. */
    [OPERATOR_INDEX_ASSIGN](key: int, value: E) {
        throw new DartUnsupportedError("Cannot modify an unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key: int, ifAbsent: () => E): E {
        throw new DartUnsupportedError("Cannot modify an unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */

    remove(key: int): E {
        throw new DartUnsupportedError("Cannot modify an unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    clear(): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    addAll(other: DartMap<int, E>): void {
        throw new DartUnsupportedError("Cannot modify an unmodifiable map");
    }


    toString(): string {
        return DartMaps.mapToString(this);
    }
}

class DartReversedListIterable<E> extends DartListIterable<E> {

    _source: DartIterable<E>;

    constructor(_source: DartIterable<E>) {
        super();
        this._source = _source;
    }

    get length(): int {
        return this._source.length;
    }

    elementAt(index: int): E {
        return this._source.elementAt(this._source.length - 1 - index);
    }
}

/**
 * Creates errors thrown by unmodifiable lists when they are attempted modified.
 *
 * This class creates [UnsupportedError]s with specialized messages.
 */
namespace UnmodifiableListError {
    /** Error thrown when trying to add elements to an unmodifiable list. */
    function add(): DartUnsupportedError {

        return new DartUnsupportedError("Cannot add to unmodifiable List");
    }

    /** Error thrown when trying to add elements to an unmodifiable list. */
    function change(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot change the content of an unmodifiable List");
    }

    /** Error thrown when trying to change the length of an unmodifiable list. */
    function length(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot change length of unmodifiable List");
    }

    /** Error thrown when trying to remove elements from an unmodifiable list. */
    function remove(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot remove from unmodifiable List");
    }
}

/**
 * Creates errors thrown by non-growable lists when they are attempted modified.
 *
 * This class creates [UnsupportedError]s with specialized messages.
 */
namespace DartNonGrowableListError {
    /** Error thrown when trying to add elements to an non-growable list. */
    function add(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot add to non-growable List");
    }


    /** Error thrown when trying to change the length of an non-growable list. */
    function length(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot change length of non-growable List");
    }

    /** Error thrown when trying to remove elements from an non-growable list. */
    function remove(): DartUnsupportedError {
        return new DartUnsupportedError("Cannot remove from non-growable List");
    }
}

/**
 * Converts a growable list to a fixed length list with the same elements.
 *
 * For internal use only.
 * Only works on growable lists as created by `[]` or `new List()`.
 * May throw on any other list.
 *
 * The operation is efficient. It doesn't copy the elements, but converts
 * the existing list directly to a fixed length list.
 * That means that it is a destructive conversion.
 * The original list should not be used afterwards.
 *
 * The returned list may be the same list as the original,
 * or it may be a different list (according to [identical]).
 * The original list may have changed type to be a fixed list,
 * or become empty or been otherwise modified.
 * It will still be a valid object, so references to it will not, e.g., crash
 * the runtime if accessed, but no promises are made wrt. its contents.
 *
 * This unspecified behavior is the reason the function is not exposed to
 * users. We allow the underlying implementation to make the most efficient
 * conversion, at the cost of leaving the original list in an unspecified
 * state.
 */
function makeListFixedLength<X>(growableList: DartList<X>): DartList<X> {
    return growableList;
}

/**
 * Converts a fixed-length list to an unmodifiable list.
 *
 * For internal use only.
 * Only works for core fixed-length lists as created by `new List(length)`,
 * or as returned by [makeListFixedLength].
 *
 * The operation is efficient. It doesn't copy the elements, but converts
 * the existing list directly to a fixed length list.
 * That means that it is a destructive conversion.
 * The original list should not be used afterwards.
 *
 * The unmodifiable list type is similar to the one used by const lists.
 */
function makeFixedListUnmodifiable<X>(fixedLengthList: DartList<X>): DartList<X> {
    return fixedLengthList;
}

interface DartListConstructor {
    new<E>(): DartList<E>;

    prototype: any
}

/**
 * An indexable collection of objects with a length.
 *
 * Subclasses of this class implement different kinds of lists.
 * The most common kinds of lists are:
 *
 * * Fixed-length list.
 *   An error occurs when attempting to use operations
 *   that can change the length of the list.
 *
 * * Growable list. Full implementation of the API defined in this class.
 *
 * The default growable list, as returned by `new List()` or `[]`, keeps
 * an internal buffer, and grows that buffer when necessary. This guarantees
 * that a sequence of [add] operations will each execute in amortized constant
 * time. Setting the length directly may take time proportional to the new
 * length, and may change the internal capacity so that a following add
 * operation will need to immediately increase the buffer capacity.
 * Other list implementations may have different performance behavior.
 *
 * The following code illustrates that some List implementations support
 * only a subset of the API.
 *
 *     List<int> fixedLengthList = new List(5);
 *     fixedLengthList.length = 0;  // Error
 *     fixedLengthList.add(499);    // Error
 *     fixedLengthList[0] = 87;
 *     List<int> growableList = [1, 2];
 *     growableList.length = 0;
 *     growableList.add(499);
 *     growableList[0] = 87;
 *
 * Lists are [Iterable]. Iteration occurs over values in index order. Changing
 * the values does not affect iteration, but changing the valid
 * indices&mdash;that is, changing the list's length&mdash;between iteration
 * steps causes a [ConcurrentModificationError]. This means that only growable
 * lists can throw ConcurrentModificationError. If the length changes
 * temporarily and is restored before continuing the iteration, the iterator
 * does not detect it.
 *
 * It is generally not allowed to modify the list's length (adding or removing
 * elements) while an operation on the list is being performed,
 * for example during a call to [forEach] or [sort].
 * Changing the list's length while it is being iterated, either by iterating it
 * directly or through iterating an [Iterable] that is backed by the list, will
 * break the iteration.
 */
@DartClass
export class DartList<E> implements DartEfficientLengthIterable<E> {

    [Symbol.iterator](): Iterator<E> {
        return this.iterator;
    }

    /**
     * Creates a list of the given length.
     *
     * The created list is fixed-length if [length] is provided.
     *
     *     List fixedLengthList = new List(3);
     *     fixedLengthList.length;     // 3
     *     fixedLengthList.length = 1; // Error
     *
     * The list has length 0 and is growable if [length] is omitted.
     *
     *     List growableList = new List();
     *     growableList.length; // 0;
     *     growableList.length = 3;
     *
     * To create a growable list with a given length, just assign the length
     * right after creation:
     *
     *     List growableList = new List()..length = 500;
     *
     * The [length] must not be negative or null, if it is provided.
     */
    @defaultFactory
    protected static _create<E>(length?: int): DartList<E> {
        // TODO : IMPLEMENT
        //return new _DartListJS(length);
        return undefined;
    }

    constructor(length?: int) {

    }

    /**
     * Creates a fixed-length list of the given length, and initializes the
     * value at each position with [fill]:
     *
     *     new List<int>.filled(3, 0); // [0, 0, 0]
     *
     * The [length] must be a non-negative integer.
     *
     * If the list is growable, changing its length will not initialize new
     * entries with [fill]. After being created and filled, the list is
     * no different from any other growable or fixed-length list
     * created using [List].
     *
     * All entries in the returned list point to the same provided [fill] value.
     * That all items in the list are the same object is
     * observable when the given value is a mutable object.
     *
     * ```
     * var shared = new List.filled(3, []);
     * shared[0].add(499);
     * print(shared);  // => [[499], [499], [499]]
     * ```
     *
     * You may use [List.generate] to create a new object for each position in
     * in the list.
     * ```
     * var unique = new List.generate(3, (_) => []);
     * unique[0].add(499);
     * print(unique); // => [[499], [], []]
     * ```
     */
    @namedFactory
    protected static _filled<E>(length: int, fill: E, _?: { growable: boolean }): DartList<E> {
        let {growable} = Object.assign({growable: false}, _);
        // TODO : IMPLEMENT EXTERNAL
        return null;
    }

    static filled: new<E>(length: int, fill: E, _?: { growable: boolean }) => DartList<E>;

    /**
     * Creates a list containing all [elements].
     *
     * The [Iterator] of [elements] provides the order of the elements.
     *
     * This constructor returns a growable list when [growable] is true;
     * otherwise, it returns a fixed-length list.
     */
    @namedFactory
    protected static _from<E>(elements: DartIterable<E>, _?: { growable: boolean }): DartList<E> {
        let {growable} = Object.assign({growable: false}, _);
        // TODO : IMPLEMENT EXTERNAL
        return null;
    }

    static from: new<E>(elements: DartIterable<E>, _?: { growable: boolean }) => DartList<E>;

    /**
     * Generates a list of values.
     *
     * Creates a list with [length] positions and fills it with values created by
     * calling [generator] for each index in the range `0` .. `length - 1`
     * in increasing order.
     *
     *     new List<int>.generate(3, (int index) => index * index); // [0, 1, 4]
     *
     * The created list is fixed-length unless [growable] is true.
     */

    @namedFactory
    protected static _generate<E>(length: int, generator: (index: int) => E,
                                  _?: { growable: boolean }): DartList<E> {
        let {growable} = Object.assign({growable: false}, _);
        let result: DartList<E>;
        if (growable) {
            result = new DartList<E>(length);
            result.length = length;
        } else {
            result = new DartList<E>(length);
        }
        for (let i: int = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, generator(i));
        }
        return result;
    }

    static generate: new<E>(length: int, generator: (index: int) => E,
                            _?: { growable: boolean }) => DartList<E>;

    /**
     * Creates an unmodifiable list containing all [elements].
     *
     * The [Iterator] of [elements] provides the order of the elements.
     *
     * An unmodifiable list cannot have its length or elements changed.
     * If the elements are themselves immutable, then the resulting list
     * is also immutable.
     */
    @namedFactory
    protected static _unmodifiable<E>(elements: DartIterable<E>): DartList<E> {
        // TODO
        return null;
    }

    static unmodifiable: new <E>(elements: DartIterable<E>) => DartList<E>;

    /**
     * Returns the object at the given [index] in the list
     * or throws a [RangeError] if [index] is out of bounds.
     */
    abstract [OPERATOR_INDEX](index: int): E;

    /**
     * Sets the value at the given [index] in the list to [value]
     * or throws a [RangeError] if [index] is out of bounds.
     */
    abstract [OPERATOR_INDEX_ASSIGN](index: int, value: E): void;

    /**
     * Returns the number of objects in this list.
     *
     * The valid indices for a list are `0` through `length - 1`.
     */
    abstract get length(): int;

    /**
     * Changes the length of this list.
     *
     * If [newLength] is greater than
     * the current length, entries are initialized to [:null:].
     *
     * Throws an [UnsupportedError] if the list is fixed-length.
     */
    abstract set length(newLength: int): void;

    /**
     * Adds [value] to the end of this list,
     * extending the length by one.
     *
     * Throws an [UnsupportedError] if the list is fixed-length.
     */
    abstract add(value: E): void;

    /**
     * Appends all objects of [iterable] to the end of this list.
     *
     * Extends the length of the list by the number of objects in [iterable].
     * Throws an [UnsupportedError] if this list is fixed-length.
     */
    abstract addAll(iterable: DartIterable<E>): void;

    /**
     * Returns an [Iterable] of the objects in this list in reverse order.
     */
    abstract get reversed(): DartIterable<E>;

    /**
     * Sorts this list according to the order specified by the [compare] function.
     *
     * The [compare] function must act as a [Comparator].
     *
     *     List<String> numbers = ['two', 'three', 'four'];
     *     // Sort from shortest to longest.
     *     numbers.sort((a, b) => a.length.compareTo(b.length));
     *     print(numbers);  // [two, four, three]
     *
     * The default List implementations use [Comparable.compare] if
     * [compare] is omitted.
     *
     *     List<int> nums = [13, 2, -11];
     *     nums.sort();
     *     print(nums);  // [-11, 2, 13]
     *
     * A [Comparator] may compare objects as equal (return zero), even if they
     * are distinct objects.
     * The sort function is not guaranteed to be stable, so distinct objects
     * that compare as equal may occur in any order in the result:
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.sort((a, b) => a.length.compareTo(b.length));
     *     print(numbers);  // [one, two, four, three] OR [two, one, four, three]
     */
    abstract sort(compare?: (a: E, b: E) => int): void;

    /**
     * Shuffles the elements of this list randomly.
     */
    abstract shuffle(random?: DartRandom): void;

    /**
     * Returns the first index of [element] in this list.
     *
     * Searches the list from index [start] to the end of the list.
     * The first time an object [:o:] is encountered so that [:o == element:],
     * the index of [:o:] is returned.
     *
     *     List<String> notes = ['do', 're', 'mi', 're'];
     *     notes.indexOf('re');    // 1
     *     notes.indexOf('re', 2); // 3
     *
     * Returns -1 if [element] is not found.
     *
     *     notes.indexOf('fa');    // -1
     */
    abstract indexOf(element: E, start?: int): int;

    /**
     * Returns the last index of [element] in this list.
     *
     * Searches the list backwards from index [start] to 0.
     *
     * The first time an object [:o:] is encountered so that [:o == element:],
     * the index of [:o:] is returned.
     *
     *     List<String> notes = ['do', 're', 'mi', 're'];
     *     notes.lastIndexOf('re', 2); // 1
     *
     * If [start] is not provided, this method searches from the end of the
     * list./Returns
     *
     *     notes.lastIndexOf('re');  // 3
     *
     * Returns -1 if [element] is not found.
     *
     *     notes.lastIndexOf('fa');  // -1
     */
    abstract lastIndexOf(element: E, start?: int): int;

    /**
     * Removes all objects from this list;
     * the length of the list becomes zero.
     *
     * Throws an [UnsupportedError], and retains all objects, if this
     * is a fixed-length list.
     */
    abstract clear(): void;

    /**
     * Inserts the object at position [index] in this list.
     *
     * This increases the length of the list by one and shifts all objects
     * at or after the index towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    abstract insert(index: int, element: E): void;

    /**
     * Inserts all objects of [iterable] at position [index] in this list.
     *
     * This increases the length of the list by the length of [iterable] and
     * shifts all later objects towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    abstract insertAll(index: int, iterable: DartIterable<E>): void;

    /**
     * Overwrites objects of `this` with the objects of [iterable], starting
     * at position [index] in this list.
     *
     *     List<String> list = ['a', 'b', 'c'];
     *     list.setAll(1, ['bee', 'sea']);
     *     list.join(', '); // 'a, bee, sea'
     *
     * This operation does not increase the length of `this`.
     *
     * The [index] must be non-negative and no greater than [length].
     *
     * The [iterable] must not have more elements than what can fit from [index]
     * to [length].
     *
     * If `iterable` is based on this list, its values may change /during/ the
     * `setAll` operation.
     */
    abstract setAll(index: int, iterable: DartIterable<E>): void;

    /**
     * Removes the first occurrence of [value] from this list.
     *
     * Returns true if [value] was in the list, false otherwise.
     *
     *     List<String> parts = ['head', 'shoulders', 'knees', 'toes'];
     *     parts.remove('head'); // true
     *     parts.join(', ');     // 'shoulders, knees, toes'
     *
     * The method has no effect if [value] was not in the list.
     *
     *     // Note: 'head' has already been removed.
     *     parts.remove('head'); // false
     *     parts.join(', ');     // 'shoulders, knees, toes'
     *
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    abstract remove(value: DartObject): boolean;

    /**
     * Removes the object at position [index] from this list.
     *
     * This method reduces the length of `this` by one and moves all later objects
     * down by one position.
     *
     * Returns the removed object.
     *
     * The [index] must be in the range `0 ≤ index < length`.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list. In that case
     * the list is not modified.
     */
    abstract removeAt(index: int): E;

    /**
     * Pops and returns the last object in this list.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    abstract removeLast(): E;

    /**
     * Removes all objects from this list that satisfy [test].
     *
     * An object [:o:] satisfies [test] if [:test(o):] is true.
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.removeWhere((item) => item.length == 3);
     *     numbers.join(', '); // 'three, four'
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    abstract removeWhere(test: (element: E) => boolean): void;

    /**
     * Removes all objects from this list that fail to satisfy [test].
     *
     * An object [:o:] satisfies [test] if [:test(o):] is true.
     *
     *     List<String> numbers = ['one', 'two', 'three', 'four'];
     *     numbers.retainWhere((item) => item.length == 3);
     *     numbers.join(', '); // 'one, two'
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    abstract retainWhere(test: (element: E) => boolean): void;

    /**
     * Returns a new list containing the objects from [start] inclusive to [end]
     * exclusive.
     *
     *     List<String> colors = ['red', 'green', 'blue', 'orange', 'pink'];
     *     colors.sublist(1, 3); // ['green', 'blue']
     *
     * If [end] is omitted, the [length] of `this` is used.
     *
     *     colors.sublist(1);  // ['green', 'blue', 'orange', 'pink']
     *
     * An error occurs if [start] is outside the range `0` .. `length` or if
     * [end] is outside the range `start` .. `length`.
     */
    abstract sublist(start: int, end?: int): DartList<E>;

    /**
     * Returns an [Iterable] that iterates over the objects in the range
     * [start] inclusive to [end] exclusive.
     *
     * The provide range, given by [start] and [end], must be valid at the time
     * of the call.
     *
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * The returned [Iterable] behaves like `skip(start).take(end - start)`.
     * That is, it does *not* throw if this list changes size.
     *
     *     List<String> colors = ['red', 'green', 'blue', 'orange', 'pink'];
     *     Iterable<String> range = colors.getRange(1, 4);
     *     range.join(', ');  // 'green, blue, orange'
     *     colors.length = 3;
     *     range.join(', ');  // 'green, blue'
     */
    abstract getRange(start: int, end: int): DartIterable<E>;

    /**
     * Copies the objects of [iterable], skipping [skipCount] objects first,
     * into the range [start], inclusive, to [end], exclusive, of the list.
     *
     *     List<int> list1 = [1, 2, 3, 4];
     *     List<int> list2 = [5, 6, 7, 8, 9];
     *     // Copies the 4th and 5th items in list2 as the 2nd and 3rd items
     *     // of list1.
     *     list1.setRange(1, 3, list2, 3);
     *     list1.join(', '); // '1, 8, 9, 4'
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * The [iterable] must have enough objects to fill the range from `start`
     * to `end` after skipping [skipCount] objects.
     *
     * If `iterable` is this list, the operation copies the elements
     * originally in the range from `skipCount` to `skipCount + (end - start)` to
     * the range `start` to `end`, even if the two ranges overlap.
     *
     * If `iterable` depends on this list in some other way, no guarantees are
     * made.
     */
    abstract setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int /* = 0 */): void;

    /**
     * Removes the objects in the range [start] inclusive to [end] exclusive.
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list. In that case
     * the list is not modified.
     */
    abstract removeRange(start: int, end: int): void;

    /**
     * Sets the objects in the range [start] inclusive to [end] exclusive
     * to the given [fillValue].
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     */
    abstract fillRange(start: int, end: int, fillValue?: E): void;

    /**
     * Removes the objects in the range [start] inclusive to [end] exclusive
     * and inserts the contents of [replacement] in its place.
     *
     *     List<int> list = [1, 2, 3, 4, 5];
     *     list.replaceRange(1, 4, [6, 7]);
     *     list.join(', '); // '1, 6, 7, 5'
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     *
     * This method does not work on fixed-length lists, even when [replacement]
     * has the same number of elements as the replaced range. In that case use
     * [setRange] instead.
     */
    abstract replaceRange(start: int, end: int, replacement: DartIterable<E>): void;

    /**
     * Returns an unmodifiable [Map] view of `this`.
     *
     * The map uses the indices of this list as keys and the corresponding objects
     * as values. The `Map.keys` [Iterable] iterates the indices of this list
     * in numerical order.
     *
     *     List<String> words = ['fee', 'fi', 'fo', 'fum'];
     *     Map<int, String> map = words.asMap();
     *     map[0] + map[1];   // 'feefi';
     *     map.keys.toList(); // [0, 1, 2, 3]
     */
    abstract asMap(): DartMap<int, E>;

    abstract any(f: (element: E) => boolean): boolean;

    abstract contains(element: Object): boolean;

    abstract elementAt(index: int): E;

    abstract every(f: (element: E) => boolean): boolean;

    abstract expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;

    abstract get first(): E;

    abstract firstWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E;

    abstract fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;

    abstract forEach(f: (element: E) => any): void;

    abstract get isEmpty(): boolean;

    abstract get isNotEmpty(): boolean;

    abstract get iterator(): DartIterator<E>;

    abstract join(separator?: string): string;

    abstract get last(): E;

    abstract lastWhere(test: (element: E) => boolean, _?: { orElse: () => E }): E;

    abstract map<T>(f: (e: E) => T): DartIterable<T>;

    abstract reduce(combine: (value: E, element: E) => E): E;

    abstract get single(): E;

    abstract singleWhere(test: (element: E) => boolean): E;

    abstract skip(count: int): DartIterable<E>;

    abstract skipWhile(test: (value: E) => boolean): DartIterable<E>;

    abstract take(count: int): DartIterable<E>;

    abstract takeWhile(test: (value: E) => boolean): DartIterable<E>;

    abstract toList(_?: { growable?: boolean }): DartList<E>;

    abstract toSet(): DartSet<E>;

    abstract where(test: (element: E) => boolean): DartIterable<E>;
}

// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart._internal;


class DartSubListIterable<E> extends DartListIterable<E> {
    _iterable: DartIterable<E>; // Has efficient length and elementAt.
    _start: int;
    /** If null, represents the length of the iterable. */
    _endOrLength: int;

    constructor(_iterable: DartIterable<E>, _start: int, _endOrLength: int) {
        super();
        this._iterable = _iterable;
        this._start = _start;
        this._endOrLength = _endOrLength;
        DartRangeError.checkNotNegative(_start, "start");
        if (_endOrLength != null) {
            DartRangeError.checkNotNegative(_endOrLength, "end");
            if (_start > _endOrLength) {
                throw new DartRangeError.range(_start, 0, _endOrLength, "start");
            }
        }
    }

    get _endIndex(): int {
        let length = this._iterable.length;
        if (this._endOrLength == null || this._endOrLength > length) return length;
        return this._endOrLength;
    }

    get _startIndex(): int {
        let length = this._iterable.length;
        if (this._start > length) return length;
        return this._start;
    }

    get length(): int {
        let length = this._iterable.length;
        if (this._start >= length) return 0;
        if (this._endOrLength == null || this._endOrLength >= length) {
            return length - this._start;
        }
        return this._endOrLength - this._start;
    }

    elementAt(index: int): E {
        let realIndex: int = this._startIndex + index;
        if (index < 0 || realIndex >= this._endIndex) {
            throw new DartRangeError.index(index, this, "index");
        }
        return this._iterable.elementAt(realIndex);
    }

    skip(count: int): DartIterable<E> {
        DartRangeError.checkNotNegative(count, "count");
        let newStart: int = this._start + count;
        if (this._endOrLength != null && newStart >= this._endOrLength) {
            return new DartEmptyIterable<E>();
        }
        return new DartSubListIterable<E>(this._iterable, newStart, this._endOrLength);
    }

    take(count: int): DartIterable<E> {
        DartRangeError.checkNotNegative(count, "count");
        if (this._endOrLength == null) {
            return new DartSubListIterable<E>(this._iterable, this._start, this._start + count);
        } else {
            let newEnd: int = this._start + count;
            if (this._endOrLength < newEnd) return this;
            return new DartSubListIterable<E>(this._iterable, this._start, newEnd);
        }
    }

    toList(_?: { growable?: boolean /* : true*/ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        let start: int = this._start;
        let end: int = this._iterable.length;
        if (this._endOrLength != null && this._endOrLength < end) end = this._endOrLength;
        let length: int = end - start;
        if (length < 0) length = 0;
        let result: DartList<E> =
            growable ? ((_) => {
                _.length = length;
                return _;
            })(new DartList<E>()) : new DartList<E>(length);
        for (let i = 0; i < length; i++) {
            result[i] = this._iterable.elementAt(start + i);
            if (this._iterable.length < end) throw new DartConcurrentModificationError(this);
        }
        return result;
    }
}


abstract class _BaseJSIterator<E> implements DartIterator<E> {
    abstract readonly current: E;

    abstract moveNext(): boolean;

    next(value?: any): IteratorResult<E> {
        return _JSnext(this);
    }
}

/**
 * An [Iterator] that iterates a list-like [Iterable].
 *
 * All iterations is done in terms of [Iterable.length] and
 * [Iterable.elementAt]. These operations are fast for list-like
 * iterables.
 */
class DartListIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {
    _iterable: DartIterable<E>;
    _length: int;
    _index: int;
    _current: E;

    constructor(iterable: DartIterable<E>) {
        super();
        this._iterable = iterable;
        this._length = iterable.length;
        this._index = 0;

    }

    get current(): E {
        return this._current;
    }

    moveNext(): boolean {
        let length = this._iterable.length;
        if (length != this._length) {
            throw new DartConcurrentModificationError(this._iterable);
        }
        if (this._index >= length) {
            this._current = null;
            return false;
        }
        this._current = this._iterable.elementAt(this._index);
        this._index++;
        return true;
    }
}

type  _Transformation<S, T> = (value: S) => T;

@DartClass
class DartMappedIterable<S, T> extends DartIterable<T> {
    protected _iterable: DartIterable<S>;
    protected _f: _Transformation<S, T>;

    @defaultFactory
    protected static create<S, T>(iterable: DartIterable<S>, _function: (value: S) => T): DartMappedIterable<S, T> {
        if (_dart.is(iterable, DartEfficientLengthIterable)) {
            return new DartEfficientLengthMappedIterable<S, T>(iterable, _function);
        }
        return new DartMappedIterable._<S, T>(iterable, _function);
    }

    constructor(iterable: DartIterable<S>, _function: (value: S) => T) {
        super();
    }

    @namedConstructor
    _(_iterable: DartIterable<S>, _f: _Transformation<S, T>) {
        this._iterable = _iterable;
        this._f = _f;
    }

    protected static _: new<S, T>(_iterable: DartIterable<S>, _f: _Transformation<S, T>) => DartMappedIterable<S, T>;

    get iterator(): DartIterator<T> {
        return new DartMappedIterator<S, T>(this._iterable.iterator, this._f);
    }

    // Length related functions are independent of the mapping.
    get length(): int {
        return this._iterable.length;
    }

    get isEmpty(): boolean {
        return this._iterable.isEmpty;
    }

    // Index based lookup can be done before transforming.
    get first(): T {
        return this._f(this._iterable.first);
    }

    get last(): T {
        return this._f(this._iterable.last);
    }

    get single(): T {
        return this._f(this._iterable.single);
    }

    elementAt(index: int): T {
        return this._f(this._iterable.elementAt(index));
    }
}

@DartClass
class DartEfficientLengthMappedIterable<S, T> extends DartMappedIterable<S, T>
    implements DartEfficientLengthIterable<T> {


    @defaultConstructor
    protected create(_iterable: DartIterable<S>, _function: (value: S) => T) {
        super._(_iterable, _function);
    }

    constructor(_iterable: DartIterable<S>, _function: (value: S) => T) {
        super(_iterable, _function);
    }
}

class DartMappedIterator<S, T> extends _BaseJSIterator<T> implements DartIterator<T> {
    _current: T;
    _iterator: DartIterator<S>;
    _f: _Transformation<S, T>;

    constructor(_iterator: DartIterator<S>, _f: _Transformation<S, T>) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }

    moveNext(): boolean {
        if (this._iterator.moveNext()) {
            this._current = this._f(this._iterator.current);
            return true;
        }
        this._current = null;
        return false;
    }

    get current(): T {
        return this._current;
    }
}

/**
 * Specialized alternative to [MappedIterable] for mapped [List]s.
 *
 * Expects efficient `length` and `elementAt` on the source iterable.
 */
class DartMappedListIterable<S, T> extends DartListIterable<T> {
    _source: DartIterable<S>;
    _f: _Transformation<S, T>;

    constructor(_source: DartIterable<S>, _f: _Transformation<S, T>) {
        super();
        this._source = _source;
        this._f = _f;
    }

    get length(): int {
        return this._source.length;
    }

    elementAt(index: int): T {
        return this._f(this._source.elementAt(index));
    }
}

type  _ElementPredicate<E> = (element: E) => boolean;

class DartWhereIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;

    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>) {
        super();
        this._iterable = _iterable;
        this._f = _f;

    }

    get iterator(): DartIterator<E> {
        return new DartWhereIterator<E>(this._iterable.iterator, this._f);
    }

    // Specialization of [Iterable.map] to non-EfficientLengthIterable.
    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartMappedIterable<E, T>(this, f);
    }
}

class DartWhereIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {
    _iterator: DartIterator<E>;
    _f: _ElementPredicate<E>;

    constructor(_iterator: DartIterator<E>,
                _f: _ElementPredicate<E>
    ) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }

    moveNext(): boolean {
        while (this._iterator.moveNext()) {
            if (this._f(this._iterator.current)) {
                return true;
            }
        }
        return false;
    }

    get current(): E {
        return this._iterator.current;
    }
}

type  _ExpandFunction<S, T> = (sourceElement: S) => DartIterable<T>;

class DartExpandIterable<S, T> extends DartIterable<T> {
    private _iterable: DartIterable<S>;
    private _f: _ExpandFunction<S, T>;

    constructor(_iterable: DartIterable<S>,
                _f: _ExpandFunction<S, T>
    ) {
        super();
        this._iterable = _iterable;
        this._f = _f;

    }

    get iterator(): DartIterator<T> {
        return new DartExpandIterator<S, T>(this._iterable.iterator, this._f);
    }
}

class DartExpandIterator<S, T> extends _BaseJSIterator<T> implements DartIterator<T> {
    protected _iterator: DartIterator<S>;
    protected _f: _ExpandFunction<S, T>;
    // Initialize _currentExpansion to an empty iterable. A null value
    // marks the end of iteration, and we don't want to call _f before
    // the first moveNext call.
    protected _currentExpansion: DartIterator<T> = new DartEmptyIterator();
    protected _current: T;

    constructor(_iterator: DartIterator<S>,
                _f: _ExpandFunction<S, T>) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }

    get current(): T {
        return this._current;
    }

    moveNext(): boolean {
        if (this._currentExpansion == null) return false;
        while (!this._currentExpansion.moveNext()) {
            this._current = null;
            if (this._iterator.moveNext()) {
                // If _f throws, this ends iteration. Otherwise _currentExpansion and
                // _current will be set again below.
                this._currentExpansion = null;
                this._currentExpansion = this._f(this._iterator.current).iterator;
            } else {
                return false;
            }
        }
        this._current = this._currentExpansion.current;
        return true;
    }
}

class DartTakeIterable<E> extends DartIterable<E> {

    _iterable: DartIterable<E>;
    _takeCount: int;

    static create<E>(iterable: DartIterable<E>, takeCount: int): DartTakeIterable<E> {
        if (!_dart.is(takeCount, 'int') || takeCount < 0) {
            throw new DartArgumentError(takeCount);
        }
        if (_dart.is(iterable, DartEfficientLengthIterable)){
            return new DartEfficientLengthTakeIterable<E>(iterable, takeCount);
        }
        return new DartTakeIterable<E>(iterable, takeCount);
    }

    constructor(_iterable: DartIterable<E>, _takeCount: int) {
        super();
        this._iterable = _iterable;
        this._takeCount = _takeCount;
    }

    get iterator(): DartIterator<E> {
        return new DartTakeIterator<E>(this._iterable.iterator, this._takeCount);
    }
}

class DartEfficientLengthTakeIterable<E> extends DartTakeIterable<E>
    implements DartEfficientLengthIterable<E> {
    constructor(iterable: DartIterable<E>, takeCount: int) {
        super(iterable, takeCount);
    }

    get length(): int {
        let iterableLength = this._iterable.length;
        if (iterableLength > this._takeCount) return this._takeCount;
        return iterableLength;
    }
}

class DartTakeIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {

    _iterator: DartIterator<E>;
    _remaining: int;

    constructor(_iterator: DartIterator<E>, _remaining: int) {
        super();
        this._iterator = _iterator;
        this._remaining = _remaining;
    }

    moveNext(): boolean {
        this._remaining--;
        if (this._remaining >= 0) {
            return this._iterator.moveNext();
        }
        this._remaining = -1;
        return false;
    }

    get current(): E {
        if (this._remaining < 0) return null;
        return this._iterator.current;
    }
}

class DartTakeWhileIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;

    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }

    get iterator(): DartIterator<E> {
        return new DartTakeWhileIterator<E>(this._iterable.iterator, this._f);
    }
}

class DartTakeWhileIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {
    _iterator: DartIterator<E>;
    _f: _ElementPredicate<E>;
    _isFinished: boolean = false;

    constructor(_iterator: DartIterator<E>, _f: _ElementPredicate<E>) {
        super();
        this._iterator = _iterator;
        this._f = _f;
    }

    moveNext(): boolean {
        if (this._isFinished) return false;
        if (!this._iterator.moveNext() || !this._f(this._iterator.current)) {
            this._isFinished = true;
            return false;
        }
        return true;
    }

    get current(): E {
        if (this._isFinished) return null;
        return this._iterator.current;
    }
}

@DartClass
class DartSkipIterable<E> extends DartIterable<E> {

    _iterable: DartIterable<E>;
    _skipCount: int;


    @defaultFactory
    protected static create<E>(iterable: DartIterable<E>, count: int): DartSkipIterable<E> {
        if (_dart.is(iterable, DartEfficientLengthIterable)) {
            return new DartEfficientLengthSkipIterable<E>(iterable, count);
        }
        return new DartSkipIterable._<E>(iterable, _checkCount(count));
    }

    constructor(iterable: DartIterable<E>, count: int) {
        super();
    }

    @namedConstructor
    protected _(_iterable: DartIterable<E>,
                _skipCount: int) {
        this._iterable = _iterable;
        this._skipCount = _skipCount;
    }

    protected static _: new<E>(_iterable: DartIterable<E>,
                               _skipCount: int) => DartSkipIterable<E>;

    skip(count: int): DartIterable<E> {
        return new DartSkipIterable<E>(this._iterable, this._skipCount + _checkCount(count));
    }

    get iterator(): DartIterator<E> {
        return new DartSkipIterator<E>(this._iterable.iterator, this._skipCount);
    }
}

@DartClass
class DartEfficientLengthSkipIterable<E> extends DartSkipIterable<E>
    implements DartEfficientLengthIterable<E> {


    @defaultFactory
    protected static create<E>(iterable: DartIterable<E>, count: int): DartEfficientLengthSkipIterable<E> {
        return new DartEfficientLengthSkipIterable._<E>(iterable, _checkCount(count));
    }

    constructor(iterable: DartIterable<E>, count: int) {
        super(null, null);
    }

    @namedConstructor
    protected _(iterable: DartIterable<E>, count: int) {
        super._(iterable, count);
    }

    protected static _: new<E>(iterable: DartIterable<E>, count: int) => DartEfficientLengthSkipIterable<E>;

    get length(): int {
        let length = this._iterable.length - this._skipCount;
        if (length >= 0) return length;
        return 0;
    }

    skip(count: int): DartIterable<E> {
        return new DartEfficientLengthSkipIterable<E>(this._iterable, this._skipCount + _checkCount(count));
    }
}

function _checkCount(count: int): int {
    if (!_dart.is(count, 'int')) {
        throw new DartArgumentError.value(count, "count", "is not an integer");
    }
    DartRangeError.checkNotNegative(count, "count");
    return count;
}

class DartSkipIterator<E> implements DartIterator<E> {

    _iterator: DartIterator<E>;

    _skipCount: int;

    constructor(_iterator: DartIterator<E>, _skipCount: int) {
        this._iterator = _iterator;
        this._skipCount = _skipCount;
    }


    moveNext(): boolean {
        for (let i = 0; i < this._skipCount; i++)
            this._iterator.moveNext();
        this._skipCount = 0;
        return this._iterator.moveNext();
    }


    get current(): E {
        return this._iterator.current;
    }

    next(value?: any): IteratorResult<E> {
        return _JSnext(this);
    }
}

class DartSkipWhileIterable<E> extends DartIterable<E> {

    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;

    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>) {
        super();
        this._iterable = _iterable;
        this._f = _f;
    }

    get iterator(): DartIterator<E> {
        return new DartSkipWhileIterator<E>(this._iterable.iterator, this._f);
    }
}

class DartSkipWhileIterator<E> implements DartIterator<E> {

    _iterator: DartIterator<E>;

    _f: _ElementPredicate<E>;

    _hasSkipped: boolean = false;

    constructor(_iterator: DartIterator<E>, _f: _ElementPredicate<E>) {
        this._iterator = _iterator;
        this._f = _f;

    }

    moveNext(): boolean {
        if (!this._hasSkipped) {
            this._hasSkipped = true;
            while (this._iterator.moveNext()) {
                if (!this._f(this._iterator.current)) return true;
            }
        }
        return this._iterator.moveNext();
    }


    get current(): E {
        return this._iterator.current;
    }

    next(value?: any): IteratorResult<E> {
        return _JSnext(this);
    }

}

/**
 * The always empty [Iterable].
 */
class DartEmptyIterable<E> extends DartEfficientLengthIterable<E> {


    get iterator(): DartIterator<E> {
        return new DartEmptyIterator();
    }


    forEach(action: (element: E) => any): void {
    }

    get isEmpty(): boolean {
        return true;
    }

    get length(): int {
        return 0;
    }

    get first(): E {
        throw DartIterableElementError.noElement();
    }

    get last(): E {
        throw DartIterableElementError.noElement();
    }


    get single(): E {
        throw DartIterableElementError.noElement();
    }


    elementAt(index: int): E {
        throw new DartRangeError.range(index, 0, 0, "index");
    }

    contains(element: DartObject): boolean {
        return false;
    }


    every(test: (element: E) => boolean): boolean {
        return true;
    }

    any(test: (element: E) => boolean): boolean {
        return false;
    }

    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E
    }): E {
        let {orElse} = Object.assign({}, _);
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E
    }): E {
        let {orElse} = Object.assign({}, _);
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }

    singleWhere(test: (element: E) => boolean, _?: {
        orElse: () => E
    }): E {
        let {orElse} = Object.assign({}, _);
        if (orElse != null) return orElse();
        throw DartIterableElementError.noElement();
    }


    join(separator?: string /*= ""*/): string {
        return "";
    }

    where(test: (element: E) => boolean): DartIterable<E> {
        return this;
    }


    map<T>(f: (element: E) => T): DartIterable<T> {
        return new DartEmptyIterable<T>();
    }

    reduce(combine: (value: E, element: E) => E): E {
        throw DartIterableElementError.noElement();
    }


    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T {
        return initialValue;
    }

    skip(count: int): DartIterable<E> {
        DartRangeError.checkNotNegative(count, "count");
        return this;
    }

    skipWhile(test: (element: E) => boolean): DartIterable<E> {
        return this;
    }

    take(count: int): DartIterable<E> {
        DartRangeError.checkNotNegative(count, "count");
        return this;
    }

    takeWhile(test: (element: E) => boolean): DartIterable<E> {
        return this;
    }

    toList(_?: { growable: boolean /* : true */ }): DartList<E> {
        let {growable} = Object.assign({growable: true}, _);
        return growable ? new DartList<E>() : new DartList<E>(0);
    }


    toSet(): DartSet<E> {
        return new DartSet<E>();
    }

}

/** The always empty iterator. */

class DartEmptyIterator<E> implements DartIterator<E> {


    moveNext(): boolean {
        return false;
    }


    get current(): E {
        return null;
    }

    next() {
        return _JSnext(this)
    }

}

function _JSnext<X>(dartIterator: DartIterator<X>): IteratorResult<X> {
    return {
        done: !dartIterator.moveNext(),
        value: dartIterator.current
    };
}

/**
 * Creates errors throw by [Iterable] when the element count is wrong.
 */
abstract class DartIterableElementError {
    /** Error thrown thrown by, e.g., [Iterable.first] when there is no result. */
    static noElement(): DartStateError {
        return new DartStateError("No element");
    }

    /** Error thrown by, e.g., [Iterable.single] if there are too many results. */
    static tooMany(): DartStateError {
        return new DartStateError("Too many elements");
    }

    /** Error thrown by, e.g., [List.setRange] if there are too few elements. */
    static tooFew(): DartStateError {
        return new DartStateError("Too few elements");
    }
}

// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.core;

type _Generator<E> = (index: int) => E;

class _GeneratorIterable<E> extends DartListIterable<E> {
    /// The length of the generated iterable.
    length: int;

    /// The function mapping indices to values.
    _generator: _Generator<E>;

    /// Creates the generated iterable.
    ///
    /// If [generator] is `null`, ~~it is checked that `int` is assignable to [E].~~
    constructor(_length: int, generator: (index: int) => E) {
        super();
        this.length = _length;
        // The `as` below is used as check to make sure that `int` is assignable
        // to [E].
        this._generator = (generator != null) ? generator : _GeneratorIterable._id as any as  _Generator<E>
    }

    elementAt(index: int): E {
        DartRangeError.checkValidIndex(index, this);
        return this._generator(index);
    }

    /// Helper function used as default _generator function.
    static _id = (n: int): int => n;
}

/**
 * An Iterator that allows moving backwards as well as forwards.
 */
interface DartBidirectionalIterator<E> extends DartIterator<E> {
    /**
     * Move back to the previous element.
     *
     * Returns true and updates [current] if successful. Returns false
     * and sets [current] to null if there is no previous element.
     */
    movePrevious(): boolean;
}

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.core;

/**
 * An interface for getting items, one at a time, from an object.
 *
 * The for-in construct transparently uses `Iterator` to test for the end
 * of the iteration, and to get each item (or _element_).
 *
 * If the object iterated over is changed during the iteration, the
 * behavior is unspecified.
 *
 * The `Iterator` is initially positioned before the first element.
 * Before accessing the first element the iterator must thus be advanced using
 * [moveNext] to point to the first element.
 * If no element is left, then [moveNext] returns false, [current]
 * returns `null`, and all further calls to [moveNext] will also return false.
 *
 * A typical usage of an Iterator looks as follows:
 *
 *     var it = obj.iterator;
 *     while (it.moveNext()) {
 *       use(it.current);
 *     }
 *
 * **See also:**
 * [Iteration](http://www.dartlang.org/docs/dart-up-and-running/contents/ch03.html#iteration)
 * in the [library tour](http://www.dartlang.org/docs/dart-up-and-running/contents/ch03.html)
 */
export interface DartIterator<E> extends Iterator<E> {
    /**
     * Moves to the next element.
     *
     * Returns true if [current] contains the next element.
     * Returns false if no elements are left.
     *
     * It is safe to invoke [moveNext] even when the iterator is already
     * positioned after the last element.
     * In this case [moveNext] returns false again and has no effect.
     *
     * A call to `moveNext` may throw if iteration has been broken by
     * changing the underlying collection.
     */
    moveNext(): boolean;

    /**
     * Returns the current element.
     *
     * Returns `null` if the iterator has not yet been moved to the first
     * element, or if the iterator has been moved past the last element of the
     * [Iterable].
     *
     * The `current` getter should keep its value until the next call to
     * [moveNext], even if an underlying collection changes.
     * After a successful call to `moveNext`, the user doesn't need to cache
     * the current value, but can keep reading it from the iterator.
     */
    readonly current: E;
}
