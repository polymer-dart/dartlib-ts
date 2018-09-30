import { bool, int, double, num, OperatorMethods } from "./utils";
export declare type PropertySetter<K, V> = (key: K, value: V) => void;
export declare type PropertyGetter<K, V> = (key: K) => V;
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
declare class DartIterable<E> implements Iterable<E> {
    /**
     * A Dart Iterable is also a JS iterable and can be used in for loop syntax
     */
    [Symbol.iterator](): Iterator<E>;
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
    protected static _generate<E>(count: int, generator?: (index: int) => E): DartIterable<E>;
    static generate: new <E>(count: int, generator?: (index: int) => E) => DartIterable<E>;
    /**
     * Creates an empty iterable.
     *
     * The empty iterable has no elements, and iterating it always stops
     * immediately.
     */
    protected static _empty<E>(): DartEmptyIterable<E>;
    static empty: new <E>() => DartIterable<E>;
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
    readonly iterator: DartIterator<E>;
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
    map<T>(f: (e: E) => T): DartIterable<T>;
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
    where(test: (element: E) => boolean): DartIterable<E>;
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
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
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
    contains(element: Object): boolean;
    /**
     * Applies the function [f] to each element of this collection in iteration
     * order.
     */
    forEach(f: (element: E) => any): void;
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
    reduce(combine: (value: E, element: E) => E): E;
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
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    /**
     * Checks whether every element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `false` if
     * any of them make [test] return `false`, otherwise returns `true`.
     */
    every(f: (element: E) => boolean): boolean;
    /**
     * Converts each element to a [String] and concatenates the strings.
     *
     * Iterates through elements of this iterable,
     * converts each one to a [String] by calling [Object.toString],
     * and then concatenates the strings, with the
     * [separator] string interleaved between the elements.
     */
    join(separator?: string): string;
    /**
     * Checks whether any element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `true` if
     * any of them make [test] return `true`, otherwise returns false.
     */
    any(f: (element: E) => boolean): boolean;
    /**
     * Creates a [List] containing the elements of this [Iterable].
     *
     * The elements are in iteration order.
     * The list is fixed-length if [growable] is false.
     */
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
    /**
     * Creates a [Set] containing the same elements as this iterable.
     *
     * The set may contain fewer elements than the iterable,
     * if the iterable contains an element more than once,
     * or it contains one or more elements that are equal.
     * The order of the elements in the set is not guaranteed to be the same
     * as for the iterable.
     */
    toSet(): DartSet<E>;
    /**
     * Returns the number of elements in [this].
     *
     * Counting all elements may involve iterating through all elements and can
     * therefore be slow.
     * Some iterables have a more efficient way to find the number of elements.
     */
    readonly length: int;
    /**
     * Returns `true` if there are no elements in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `false`.
     */
    readonly isEmpty: boolean;
    /**
     * Returns true if there is at least one element in this collection.
     *
     * May be computed by checking if `iterator.moveNext()` returns `true`.
     */
    readonly isNotEmpty: boolean;
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
    take(count: int): DartIterable<E>;
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
    takeWhile(test: (value: E) => boolean): DartIterable<E>;
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
    skip(count: int): DartIterable<E>;
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
    skipWhile(test: (value: E) => boolean): DartIterable<E>;
    /**
     * Returns the first element.
     *
     * Throws a [StateError] if `this` is empty.
     * Otherwise returns the first element in the iteration order,
     * equivalent to `this.elementAt(0)`.
     */
    readonly first: E;
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
    readonly last: E;
    /**
     * Checks that this iterable has only one element, and returns that element.
     *
     * Throws a [StateError] if `this` is empty or has more than one element.
     */
    readonly single: E;
    /**
     * Returns the first element that satisfies the given predicate [test].
     *
     * Iterates through elements and returns the first to satisfy [test].
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
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
    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    /**
     * Returns the single element that satisfies [test].
     *
     * Checks all elements to see if `test(element)` returns true.
     * If exactly one element satisfies [test], that element is returned.
     * Otherwise, if there are no matching elements, or if there is more than
     * one matching element, a [StateError] is thrown.
     */
    singleWhere(test: (element: E) => boolean): E;
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
    elementAt(index: int): E;
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
    toString(): string;
}
/**
 * Marker interface for [Iterable] subclasses that have an efficient
 * [length] implementation.
 */
declare class DartEfficientLengthIterable<T> extends DartIterable<T> {
    /**
     * Returns the number of elements in the iterable.
     *
     * This is an efficient operation that doesn't require iterating through
     * the elements.
     */
    readonly length: int;
}
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
export declare class DartIterator<E> implements Iterator<E> {
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
    next(value?: any): IteratorResult<E>;
}
declare class DartJsLinkedHashMap<K, V> implements DartLinkedHashMap<K, V> {
    _length: int;
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;
    _first: LinkedHashMapCell<K, V>;
    protected _last: LinkedHashMapCell<K, V>;
    _modifications: int;
    protected static readonly _supportsEs6Maps: bool;
    constructor();
    protected _init(): void;
    protected static _es6<K, V>(): DartJsLinkedHashMap<K, V>;
    static es6: new <K, V>() => DartJsLinkedHashMap<K, V>;
    readonly length: int;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
    readonly keys: DartIterable<K>;
    readonly values: DartIterable<V>;
    containsKey(key: any): bool;
    internalContainsKey(key: any): bool;
    containsValue(value: any): bool;
    addAll(other: DartMap<K, V>): void;
    [OperatorMethods.INDEX](key: any): V;
    internalGet(key: any): V;
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    internalSet(key: K, value: V): void;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    remove(key: any): V;
    internalRemove(key: any): V;
    clear(): void;
    forEach(action: (key: K, value: V) => any): void;
    protected _addHashTableEntry(table: any, key: K, value: V): void;
    protected _removeHashTableEntry(table: any, key: any): V;
    protected _modified(): void;
    protected _newLinkedCell(key: K, value: V): LinkedHashMapCell<K, V>;
    protected _unlinkCell(cell: LinkedHashMapCell<K, V>): void;
    internalComputeHashCode(key: any): int;
    protected _getBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>>;
    internalFindBucketIndex(bucket: any, key: any): int;
    toString(): string;
    protected _getTableCell(table: any, key: any): LinkedHashMapCell<K, V>;
    protected _getTableBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>>;
    protected _setTableEntry(table: any, key: any, value: any): void;
    protected _deleteTableEntry(table: any, key: any): void;
    protected _containsTableEntry(table: any, key: any): bool;
    protected _newHashTable(): any;
    get(k: K): V;
    set(k: K, v: V): void;
}
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
declare class DartSetMixin<E> implements DartSet<E> {
    add(element: E): bool;
    contains(element: any): bool;
    lookup(element: any): E;
    remove(element: any): bool;
    readonly iterator: DartIterator<E>;
    toSet(): DartSet<E>;
    readonly length: int;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    clear(): void;
    addAll(elements: DartIterable<E>): void;
    removeAll(elements: DartIterable<any>): void;
    retainAll(elements: DartIterable<any>): void;
    removeWhere(test: (element: E) => bool): void;
    retainWhere(test: (element: E) => bool): void;
    containsAll(other: DartIterable<any>): bool;
    union(other: DartSet<E>): DartSet<E>;
    intersection(other: DartSet<any>): DartSet<E>;
    difference(other: DartSet<any>): DartSet<E>;
    toList(_?: {
        growable?: bool;
    }): DartList<E>;
    map<T>(f: (element: E) => T): DartIterable<T>;
    readonly single: E;
    toString(): string;
    where(f: (element: E) => bool): DartIterable<E>;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    forEach(f: (element: E) => void): void;
    reduce(combine: (value: E, element: E) => E): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    every(f: (element: E) => bool): bool;
    join(separator?: string): string;
    any(test: (element: E) => bool): bool;
    take(n: int): DartIterable<E>;
    takeWhile(test: (value: E) => bool): DartIterable<E>;
    skip(n: int): DartIterable<E>;
    skipWhile(test: (value: E) => bool): DartIterable<E>;
    readonly first: E;
    readonly last: E;
    firstWhere(test: (value: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    lastWhere(test: (value: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    singleWhere(test: (value: E) => bool): E;
    elementAt(index: int): E;
    [Symbol.iterator](): Iterator<E>;
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
declare class DartSetBase<E> extends DartSetMixin<E> {
    /**
     * Convert a `Set` to a string as `{each, element, as, string}`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [set] to a string again.
     */
    static setToString(set: DartSet<any>): string;
}
/**
 * Wrapper around a class that implements [Map] that only exposes `Map` members.
 *
 * A simple wrapper that delegates all `Map` members to the map provided in the
 * constructor.
 *
 * Base for delegating map implementations like [UnmodifiableMapView].
 */
declare class DartMapView<K, V> implements DartMap<K, V> {
    protected _map: DartMap<K, V>;
    constructor(map: DartMap<K, V>);
    [OperatorMethods.INDEX](key: any): V;
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    get(k: K): V;
    set(k: K, v: V): void;
    addAll(other: DartMap<K, V>): void;
    clear(): void;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    containsKey(key: any): bool;
    containsValue(value: any): bool;
    forEach(action: (key: K, value: V) => any): void;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    readonly length: int;
    readonly keys: DartIterable<K>;
    remove(key: any): V;
    toString(): string;
    readonly values: DartIterable<V>;
}
/**
 * View of a [Map] that disallow modifying the map.
 *
 * A wrapper around a `Map` that forwards all members to the map provided in
 * the constructor, except for operations that modify the map.
 * Modifying operations throw instead.
 */
declare class DartUnmodifiableMapView<K, V> extends DartMapView<K, V> {
    constructor(base: DartMap<K, V>);
}
declare class DartConstantMapView<K, V> extends DartUnmodifiableMapView<K, V> implements DartConstantMap<K, V> {
    constructor(base: DartMap<K, V>);
}
declare class AbstractDartMap<K, V> {
    [OperatorMethods.INDEX](key: K): V;
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    get(k: K): V;
    set(k: K, v: V): void;
    addAll(other: DartMap<K, V>): void;
    clear(): void;
    containsKey(key: any): bool;
    containsValue(value: any): bool;
    forEach(f: (key: K, value: V) => any): void;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    readonly keys: DartIterable<K>;
    readonly length: int;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    remove(key: any): V;
    readonly values: DartIterable<V>;
}
declare class DartConstantMap<K, V> extends AbstractDartMap<K, V> implements DartMap<K, V> {
    protected static _from<K, V>(other: DartMap<any, any>): DartConstantMap<K, V>;
    static from: new <K, V>(other: DartMap<any, any>) => DartConstantMap<K, V>;
    protected _?(): void;
    static _?: new <K, V>() => DartConstantMap<K, V>;
    readonly isEmpty: boolean;
    readonly isNotEmpty: bool;
    toString(): string;
    protected static _throwUnmodifiable(): void;
    protected static _unsupportedError(): UnsupportedError;
    [OperatorMethods.INDEX_EQ](key: K, val: V): void;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    remove(key: K): V;
    clear(): void;
    addAll(other: DartMap<K, V>): void;
}
/** Default function for equality comparison in customized HashMaps */
export declare function _defaultEquals(a: any, b: any): bool;
/** Default function for hash-code computation in customized HashMaps */
export declare function _defaultHashCode(a: any): int;
/** Type of custom equality function */
export declare type _Equality<K> = (a: K, b: K) => bool;
/** Type of custom hash code function. */
export declare type _Hasher<K> = (object: K) => int;
export declare type _Predicate<T> = (value: T) => bool;
/**
 * An collection of key-value pairs, from which you retrieve a value
 * using its associated key.
 *
 * There is a finite number of keys in the map,
 * and each key has exactly one value associated with it.
 *
 * Maps, and their keys and values, can be iterated.
 * The order of iteration is defined by the individual type of map.
 * Examples:
 *
 * * The plain [HashMap] is unordered (no order is guaranteed),
 * * the [LinkedHashMap] iterates in key insertion order,
 * * and a sorted map like [SplayTreeMap] iterates the keys in sorted order.
 *
 * It is generally not allowed to modify the map (add or remove keys) while
 * an operation is being performed on the map, for example in functions called
 * during a [forEach] or [putIfAbsent] call.
 * Modifying the map while iterating the keys or values
 * may also break the iteration.
 */
declare class DartMap<K, V> {
    /**
     * Creates a Map instance with the default implementation, [LinkedHashMap].
     *
     * This constructor is equivalent to the non-const map literal `<K,V>{}`.
     *
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     */
    constructor();
    /**
     * Creates a [LinkedHashMap] instance that contains all key-value pairs of
     * [other].
     *
     * The keys must all be assignable to [K] and the values to [V].
     * The [other] map itself can have any type.
     *
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows `null` as a key.
     * It iterates in key insertion order.
     */
    protected static _from<K, V>(other: DartMap<K, V>): DartMap<K, V>;
    static from: new <K, V>(other: DartMap<K, V>) => DartMap<K, V>;
    /**
     * Creates an unmodifiable hash based map containing the entries of [other].
     *
     * The keys must all be assignable to [K] and the values to [V].
     * The [other] map itself can have any type.
     *
     * The map requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows `null` as a key.
     * The created map iterates keys in a fixed order,
     * preserving the order provided by [other].
     *
     * The resulting map behaves like the result of [Map.from],
     * except that the map returned by this constructor is not modifiable.
     */
    static unmodifiable: new <K, V>(other: DartMap<K, V>) => DartMap<K, V>;
    /**
     * Creates an identity map with the default implementation, [LinkedHashMap].
     *
     * The returned map allows `null` as a key.
     * It iterates in key insertion order.
     */
    protected static _identity<K, V>(): DartMap<K, V>;
    static identity: new <K, V>() => DartMap<K, V>;
    /**
     * Creates a Map instance in which the keys and values are computed from the
     * [iterable].
     *
     * The created map is a [LinkedHashMap].
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     *
     * For each element of the [iterable] this constructor computes a key-value
     * pair, by applying [key] and [value] respectively.
     *
     * The example below creates a new Map from a List. The keys of `map` are
     * `list` values converted to strings, and the values of the `map` are the
     * squares of the `list` values:
     *
     *     List<int> list = [1, 2, 3];
     *     Map<String, int> map = new Map.fromIterable(list,
     *         key: (item) => item.toString(),
     *         value: (item) => item * item));
     *
     *     map['1'] + map['2']; // 1 + 4
     *     map['3'] - map['2']; // 9 - 4
     *
     * If no values are specified for [key] and [value] the default is the
     * identity function.
     *
     * In the following example, the keys and corresponding values of `map`
     * are `list` values:
     *
     *     map = new Map.fromIterable(list);
     *     map[1] + map[2]; // 1 + 2
     *     map[3] - map[2]; // 3 - 2
     *
     * The keys computed by the source [iterable] do not need to be unique. The
     * last occurrence of a key will simply overwrite any previous value.
     */
    protected static _fromIterable<K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }): DartMap<K, V>;
    static fromIterable: new <K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }) => DartMap<K, V>;
    /**
     * Creates a Map instance associating the given [keys] to [values].
     *
     * The created map is a [LinkedHashMap].
     * A `LinkedHashMap` requires the keys to implement compatible
     * `operator==` and `hashCode`, and it allows null as a key.
     * It iterates in key insertion order.
     *
     * This constructor iterates over [keys] and [values] and maps each element of
     * [keys] to the corresponding element of [values].
     *
     *     List<String> letters = ['b', 'c'];
     *     List<String> words = ['bad', 'cat'];
     *     Map<String, String> map = new Map.fromIterables(letters, words);
     *     map['b'] + map['c'];  // badcat
     *
     * If [keys] contains the same object multiple times, the last occurrence
     * overwrites the previous value.
     *
     * The two [Iterable]s must have the same length.
     */
    protected static _fromIterables<K, V>(keys: DartIterable<K>, values: DartIterable<V>): DartMap<K, V>;
    static fromIterables: new <K, V>(keys: DartIterable<K>, values: DartIterable<V>) => DartMap<K, V>;
    /**
     * Returns true if this map contains the given [value].
     *
     * Returns true if any of the values in the map are equal to `value`
     * according to the `==` operator.
     */
    containsValue(value: any): bool;
    /**
     * Returns true if this map contains the given [key].
     *
     * Returns true if any of the keys in the map are equal to `key`
     * according to the equality used by the map.
     */
    containsKey(key: any): bool;
    /**
     * Returns the value for the given [key] or null if [key] is not in the map.
     *
     * Some maps allows keys to have `null` as a value,
     * For those maps, a lookup using this operator does cannot be used to
     * distinguish between a key not being in the map, and the key having a null
     * value.
     * Methods like [containsKey] or [putIfAbsent] can be use if the distinction
     * is important.
     */
    [OperatorMethods.INDEX](key: K): V;
    /**
     * Associates the [key] with the given [value].
     *
     * If the key was already in the map, its associated value is changed.
     * Otherwise the key-value pair is added to the map.
     */
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    /**
     * Look up the value of [key], or add a new value if it isn't there.
     *
     * Returns the value associated to [key], if there is one.
     * Otherwise calls [ifAbsent] to get a new value, associates [key] to
     * that value, and then returns the new value.
     *
     *     Map<String, int> scores = {'Bob': 36};
     *     for (var key in ['Bob', 'Rohan', 'Sophena']) {
     *       scores.putIfAbsent(key, () => key.length);
     *     }
     *     scores['Bob'];      // 36
     *     scores['Rohan'];    //  5
     *     scores['Sophena'];  //  7
     *
     * Calling [ifAbsent] must not add or remove keys from the map.
     */
    putIfAbsent(key: K, ifAbsent: () => V): V;
    /**
     * Adds all key-value pairs of [other] to this map.
     *
     * If a key of [other] is already in this map, its value is overwritten.
     *
     * The operation is equivalent to doing `this[key] = value` for each key
     * and associated value in other. It iterates over [other], which must
     * therefore not change during the iteration.
     */
    addAll(other: DartMap<K, V>): void;
    /**
     * Removes [key] and its associated value, if present, from the map.
     *
     * Returns the value associated with `key` before it was removed.
     * Returns `null` if `key` was not in the map.
     *
     * Note that values can be `null` and a returned `null` value doesn't
     * always mean that the key was absent.
     */
    remove(key: any): V;
    /**
     * Removes all pairs from the map.
     *
     * After this, the map is empty.
     */
    clear(): void;
    /**
     * Applies [f] to each key-value pair of the map.
     *
     * Calling `f` must not add or remove keys from the map.
     */
    forEach(f: (key: K, value: V) => any): void;
    /**
     * The keys of [this].
     *
     * The returned iterable has efficient `length` and `contains` operations,
     * based on [length] and [containsKey] of the map.
     *
     * The order of iteration is defined by the individual `Map` implementation,
     * but must be consistent between changes to the map.
     *
     * Modifying the map while iterating the keys
     * may break the iteration.
     */
    readonly keys: DartIterable<K>;
    /**
     * The values of [this].
     *
     * The values are iterated in the order of their corresponding keys.
     * This means that iterating [keys] and [values] in parallel will
     * provided matching pairs of keys and values.
     *
     * The returned iterable has an efficient `length` method based on the
     * [length] of the map. Its [Iterable.contains] method is based on
     * `==` comparison.
     *
     * Modifying the map while iterating the
     * values may break the iteration.
     */
    readonly values: DartIterable<V>;
    /**
     * The number of key-value pairs in the map.
     */
    readonly length: int;
    /**
     * Returns true if there is no key-value pair in the map.
     */
    readonly isEmpty: bool;
    /**
     * Returns true if there is at least one key-value pair in the map.
     */
    readonly isNotEmpty: bool;
    protected static _unmodifiable<K, V>(other: DartMap<K, V>): DartConstantMap<K, V>;
    protected static _create<K, V>(): DartMap<K, V>;
    get(k: K): V;
    set(k: K, v: V): void;
    protected static _literal<K, V>(values: Iterable<[K, V]>): DartMap<K, V>;
    static literal: new <K, V>(values: Iterable<[K, V]>) => DartMap<K, V>;
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
declare class DartHashMap<K, V> extends AbstractDartMap<K, V> implements DartMap<K, V> {
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
    /**
     * Creates an unordered identity-based map.
     *
     * Effectively a shorthand for:
     *
     *     new HashMap<K, V>(equals: identical,
     *                       hashCode: identityHashCode)
     */
    /**
     * Creates a [HashMap] that contains all key/value pairs of [other].
     */
    protected static _from<K, V>(other: DartMap<any, any>): DartHashMap<K, V>;
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
    protected static _fromIterable<K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }): DartHashMap<K, V>;
    static fromIterable: new <K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }) => DartHashMap<K, V>;
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
    protected static _fromIterables<K, V>(keys: DartIterable<K>, values: DartIterable<V>): DartHashMap<K, V>;
    static fromIterables: new <K, V>(keys: DartIterable<K>, values: DartIterable<V>) => DartHashMap<K, V>;
    protected static _create?<K, V>(_?: {
        equals?: (key1: K, key2: K) => bool;
        hashCode?: (key: K) => int;
        isValidKey?: (potentialKey: any) => bool;
    }): DartHashMap<K, V>;
    constructor(_?: {
        equals?: (key1: K, key2: K) => bool;
        hashCode?: (key: K) => int;
        isValidKey?: (potentialKey: any) => bool;
    });
    protected static _identity?<K, V>(): DartHashMap<K, V>;
    static identity: new <K, V>() => DartHashMap<K, V>;
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
declare class DartHashSet<E> implements DartSet<E> {
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
    /**
     * Creates an unordered identity-based set.
     *
     * Effectively a shorthand for:
     *
     *     new HashSet<E>(equals: identical,
     *                    hashCode: identityHashCode)
     */
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
    protected static _from<E>(elements: DartIterable<any>): DartHashSet<E>;
    /**
     * Provides an iterator that iterates over the elements of this set.
     *
     * The order of iteration is unspecified,
     * but consistent between changes to the set.
     */
    readonly iterator: DartIterator<E>;
    protected static _create<E>(_?: {
        equals?: (e1: E, e2: E) => bool;
        hashCode?: (e: E) => int;
        isValidKey?: (potentialKey: any) => bool;
    }): DartHashSet<E>;
    constructor(_?: {
        equals?: (e1: E, e2: E) => bool;
        hashCode?: (e: E) => int;
        isValidKey?: (potentialKey: any) => bool;
    });
    protected static _identity<E>(): DartHashSet<E>;
    add(value: E): bool;
    addAll(elements: DartIterable<E>): void;
    clear(): void;
    contains(value: any): bool;
    containsAll(other: DartIterable<any>): bool;
    difference(other: DartSet<any>): DartSet<E>;
    intersection(other: DartSet<any>): DartSet<E>;
    readonly length: int;
    lookup(object: any): E;
    remove(value: any): bool;
    removeAll(elements: DartIterable<any>): void;
    removeWhere(test: (element: E) => bool): void;
    retainAll(elements: DartIterable<any>): void;
    retainWhere(test: (element: E) => bool): void;
    toSet(): DartSet<E>;
    union(other: DartSet<E>): DartSet<E>;
    [Symbol.iterator](): Iterator<E>;
    any(f: (element: E) => boolean): boolean;
    elementAt(index: int): E;
    every(f: (element: E) => boolean): boolean;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    readonly first: E;
    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    forEach(f: (element: E) => any): void;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
    join(separator?: string): string;
    readonly last: E;
    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    map<T>(f: (e: E) => T): DartIterable<T>;
    reduce(combine: (value: E, element: E) => E): E;
    readonly single: E;
    singleWhere(test: (element: E) => boolean): E;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (value: E) => boolean): DartIterable<E>;
    take(count: int): DartIterable<E>;
    takeWhile(test: (value: E) => boolean): DartIterable<E>;
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
    where(test: (element: E) => boolean): DartIterable<E>;
}
declare class DartEs6LinkedHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    protected _getTableCell(table: any, key: any): LinkedHashMapCell<K, V>;
    protected _getTableBucket(table: any, key: any): Array<LinkedHashMapCell<K, V>>;
    protected _setTableEntry(table: any, key: any, value: any): void;
    protected _deleteTableEntry(table: any, key: any): void;
    protected _containsTableEntry(table: any, key: any): bool;
    protected _newHashTable(): Map<any, any>;
}
declare class LinkedHashMapCell<K, V> {
    hashMapCellKey: K;
    hashMapCellValue: V;
    _next: LinkedHashMapCell<K, V>;
    _previous: LinkedHashMapCell<K, V>;
    constructor(hashMapCellKey: K, hashMapCellValue: V);
}
declare class DartLinkedHashMapKeyIterable<E> extends DartEfficientLengthIterable<E> {
    protected _map: DartJsLinkedHashMap<E, any>;
    constructor(_map: DartJsLinkedHashMap<E, any>);
    readonly length: int;
    readonly isEmpty: bool;
    readonly iterator: DartIterator<E>;
    contains(element: any): bool;
    forEach(f: (element: E) => any): void;
}
declare class DartLinkedHashMapKeyIterator<E> implements DartIterator<E> {
    protected _map: DartJsLinkedHashMap<E, any>;
    protected _modifications: int;
    protected _cell: LinkedHashMapCell<E, any>;
    protected _current: E;
    constructor(_map: DartJsLinkedHashMap<E, any>, _modifications: int);
    readonly current: E;
    moveNext(): bool;
    next(value?: any): IteratorResult<E>;
}
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
declare class DartLinkedHashSet<E> implements DartHashSet<E> {
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
    constructor(_?: {
        equals: (e1: E, e2: E) => bool;
        hashCode?: (e: E) => int;
        isValidKey?: (potentialKey: any) => bool;
    });
    /**
     * Creates an insertion-ordered identity-based set.
     *
     * Effectively a shorthand for:
     *
     *     new LinkedHashSet<E>(equals: identical,
     *                          hashCode: identityHashCode)
     */
    static identity: new <E>() => DartLinkedHashSet<E>;
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
    protected static _from<E>(elements: DartIterable<any>): DartHashSet<E>;
    static from: new <E>(elements: DartIterable<any>) => DartHashSet<E>;
    /**
     * Executes a function on each element of the set.
     *
     * The elements are iterated in insertion order.
     */
    forEach(action: (element: E) => any): void;
    /**
     * Provides an iterator that iterates over the elements in insertion order.
     */
    readonly iterator: DartIterator<E>;
    protected static _create<E>(_?: {
        equals: (e1: E, e2: E) => bool;
        hashCode?: (e: E) => int;
        isValidKey?: (potentialKey: any) => bool;
    }): DartLinkedHashSet<E>;
    protected static _identity<E>(): DartLinkedHashSet<E>;
    [Symbol.iterator](): Iterator<E>;
    add(value: E): bool;
    addAll(elements: DartIterable<E>): void;
    any(f: (element: E) => boolean): boolean;
    clear(): void;
    contains(value: any): bool;
    containsAll(other: DartIterable<any>): bool;
    difference(other: DartSet<any>): DartSet<E>;
    elementAt(index: int): E;
    every(f: (element: E) => boolean): boolean;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    readonly first: E;
    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    intersection(other: DartSet<any>): DartSet<E>;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
    join(separator?: string): string;
    readonly last: E;
    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    readonly length: int;
    lookup(object: any): E;
    map<T>(f: (e: E) => T): DartIterable<T>;
    reduce(combine: (value: E, element: E) => E): E;
    remove(value: any): bool;
    removeAll(elements: DartIterable<any>): void;
    removeWhere(test: (element: E) => bool): void;
    retainAll(elements: DartIterable<any>): void;
    retainWhere(test: (element: E) => bool): void;
    readonly single: E;
    singleWhere(test: (element: E) => boolean): E;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (value: E) => boolean): DartIterable<E>;
    take(count: int): DartIterable<E>;
    takeWhile(test: (value: E) => boolean): DartIterable<E>;
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
    toSet(): DartSet<E>;
    union(other: DartSet<E>): DartSet<E>;
    where(test: (element: E) => boolean): DartIterable<E>;
}
/**
 * Base implementations of [Set].
 */
/**
 * The signature of a generic comparison function.
 *
 * A comparison function represents an ordering on a type of objects.
 * A total ordering on a type means that for two values, either they
 * are equal or one is greater than the other (and the latter must then be
 * smaller than the former).
 *
 * A [Comparator] function represents such a total ordering by returning
 *
 * * a negative integer if [a] is smaller than [b],
 * * zero if [a] is equal to [b], and
 * * a positive integer if [a] is greater than [b].
 */
export declare type DartComparator<T> = (a: T, b: T) => int;
/**
 * Interface used by types that have an intrinsic ordering.
 *
 * The [compareTo] operation defines a total ordering of objects,
 * which can be used for ordering and sorting.
 *
 * The [Comparable] interface should be used for the natural ordering of a type.
 * If a type can be ordered in more than one way,
 * and none of them is the obvious natural ordering,
 * then it might be better not to use the [Comparable] interface,
 * and to provide separate [Comparator]s instead.
 *
 * It is recommended that the order of a [Comparable] agrees
 * with its operator [==] equality (`a.compareTo(b) == 0` iff `a == b`),
 * but this is not a requirement.
 * For example, [double] and [DateTime] have `compareTo` methods
 * that do not agree with operator [==].
 * For doubles the [compareTo] method is more precise than the equality,
 * and for [DateTime] it is less precise.
 *
 * Examples:
 *
 *      (0.0).compareTo(-0.0);  // => 1
 *      0.0 == -0.0;            // => true
 *      var dt = new DateTime.now();
 *      var dt2 = dt.toUtc();
 *      dt == dt2;              // => false
 *      dt.compareTo(dt2);      // => 0
 *
 * The [Comparable] interface does not imply the existence
 * of the comparison operators `<`, `<=`, `>` and `>=`.
 * These should only be defined
 * if the ordering is a less-than/greater-than ordering,
 * that is, an ordering where you would naturally
 * use the words "less than" about the order of two elements.
 *
 * If the equality operator and [compareTo] disagree,
 * the comparison operators should follow the equality operator,
 * and will likely also disagree with [compareTo].
 * Otherwise they should match the [compareTo] method,
 * so that `a < b` iff `a.compareTo(b) < 0`.
 *
 * The [double] class defines comparison operators
 * that are compatible with equality.
 * The operators differ from `double.compareTo` on -0.0 and NaN.
 *
 * The [DateTime] class has no comparison operators, instead it has the more
 * precisely named [DateTime.isBefore] and [DateTime.isAfter].
 */
export declare abstract class DartComparable<T> {
    /**
     * Compares this object to another [Comparable]
     *
     * Returns a value like a [Comparator] when comparing `this` to [other].
     * That is, it returns a negative integer if `this` is ordered before [other],
     * a positive integer if `this` is ordered after [other],
     * and zero if `this` and [other] are ordered together.
     *
     * The [other] argument must be a value that is comparable to this object.
     */
    abstract compareTo(other: T): int;
    /**
     * A [Comparator] that compares one comparable to another.
     *
     * It returns the result of `a.compareTo(b)`.
     *
     * This utility function is used as the default comparator
     * for ordering collections, for example in the [List] sort function.
     */
    static compare<T>(a: DartComparable<T>, b: DartComparable<T>): int;
}
declare class DartObject {
    equals(other: any): boolean;
    readonly hashCode: int;
    toString(): string;
}
/**
 * Check whether two references are to the same object.
 */
export declare function identical(a: any, b: any): bool;
/**
 * Returns the identity hash code of `object`.
 *
 * Returns the same value as `object.hashCode` if [object] has not overridden
 * [Object.hashCode]. Returns the value that [Object.hashCode] would return
 * on this object, even if `hashCode` has been overridden.
 *
 * This hash code is compatible with [identical].
 */
export declare function identityHashCode(object: any): int;
/**
 * This [Iterable] mixin implements all [Iterable] members except `iterator`.
 *
 * All other methods are implemented in terms of `iterator`.
 */
declare class DartIterableMixin<E> implements DartIterable<E> {
    map<T>(f: (element: E) => T): DartIterable<T>;
    where(f: (element: E) => bool): DartIterable<E>;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    contains(element: any): bool;
    forEach(f: (element: E) => void): void;
    reduce(combine: (value: E, element: E) => E): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    every(f: (element: E) => bool): bool;
    join(separator?: string): string;
    any(f: (element: E) => bool): bool;
    toList(_?: {
        growable: bool;
    }): DartList<E>;
    toSet(): DartSet<E>;
    readonly length: int;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    take(count: int): DartIterable<E>;
    takeWhile(test: (value: E) => bool): DartIterable<E>;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (value: E) => bool): DartIterable<E>;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    firstWhere(test: (value: E) => bool, _?: {
        orElse: () => E;
    }): E;
    lastWhere(test: (value: E) => bool, _?: {
        orElse: () => E;
    }): E;
    singleWhere(test: (value: E) => bool): E;
    elementAt(index: int): E;
    toString(): string;
    [Symbol.iterator](): Iterator<E>;
    readonly iterator: DartIterator<E>;
}
/**
 * Base class for implementing [Iterable].
 *
 * This class implements all methods of [Iterable] except [Iterable.iterator]
 * in terms of `iterator`.
 */
declare class DartIterableBase<E> extends DartIterable<E> {
    constructor();
    /**
     * Convert an `Iterable` to a string like [IterableBase.toString].
     *
     * Allows using other delimiters than '(' and ')'.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [iterable] to a string again.
     */
    static iterableToShortString(iterable: DartIterable<any>, leftDelimiter?: string, rightDelimiter?: string): string;
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
    static iterableToFullString(iterable: DartIterable<any>, leftDelimiter?: string, rightDelimiter?: string): string;
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
declare class DartList<E> implements DartEfficientLengthIterable<E> {
    readonly iterator: DartIterator<E>;
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
    map<T>(f: (e: E) => T): DartIterable<T>;
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
    where(test: (element: E) => boolean): DartIterable<E>;
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
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
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
    contains(element: Object): boolean;
    /**
     * Applies the function [f] to each element of this collection in iteration
     * order.
     */
    forEach(f: (element: E) => any): void;
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
    reduce(combine: (value: E, element: E) => E): E;
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
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    /**
     * Checks whether every element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `false` if
     * any of them make [test] return `false`, otherwise returns `true`.
     */
    every(f: (element: E) => boolean): boolean;
    /**
     * Converts each element to a [String] and concatenates the strings.
     *
     * Iterates through elements of this iterable,
     * converts each one to a [String] by calling [Object.toString],
     * and then concatenates the strings, with the
     * [separator] string interleaved between the elements.
     */
    join(separator?: string): string;
    /**
     * Checks whether any element of this iterable satisfies [test].
     *
     * Checks every element in iteration order, and returns `true` if
     * any of them make [test] return `true`, otherwise returns false.
     */
    any(f: (element: E) => boolean): boolean;
    /**
     * Creates a [List] containing the elements of this [Iterable].
     *
     * The elements are in iteration order.
     * The list is fixed-length if [growable] is false.
     */
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
    /**
     * Creates a [Set] containing the same elements as this iterable.
     *
     * The set may contain fewer elements than the iterable,
     * if the iterable contains an element more than once,
     * or it contains one or more elements that are equal.
     * The order of the elements in the set is not guaranteed to be the same
     * as for the iterable.
     */
    toSet(): DartSet<E>;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
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
    take(count: number): DartIterable<E>;
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
    takeWhile(test: (value: E) => boolean): DartIterable<E>;
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
    skip(count: number): DartIterable<E>;
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
    skipWhile(test: (value: E) => boolean): DartIterable<E>;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    /**
     * Returns the first element that satisfies the given predicate [test].
     *
     * Iterates through elements and returns the first to satisfy [test].
     *
     * If no element satisfies [test], the result of invoking the [orElse]
     * function is returned.
     * If [orElse] is omitted, it defaults to throwing a [StateError].
     */
    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
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
    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    /**
     * Returns the single element that satisfies [test].
     *
     * Checks all elements to see if `test(element)` returns true.
     * If exactly one element satisfies [test], that element is returned.
     * Otherwise, if there are no matching elements, or if there is more than
     * one matching element, a [StateError] is thrown.
     */
    singleWhere(test: (element: E) => boolean): E;
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
    elementAt(index: number): E;
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
    toString(): string;
    [Symbol.iterator](): Iterator<E>;
    /**
     * cretes a dart list from a js iterable
     */
    protected static _fromArray<T>(it: Iterable<T>): DartList<T>;
    static fromArray: new <T>(it: Iterable<T>) => DartList<T>;
    protected static _literal<T>(...elems: T[]): DartList<T>;
    static literal: new <T>(...elems: T[]) => DartList<T>;
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
    constructor(length?: int);
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
    static filled: new <E>(length: int, fill: E, _?: {
        growable: boolean;
    }) => DartList<E>;
    /**
     * Creates a list containing all [elements].
     *
     * The [Iterator] of [elements] provides the order of the elements.
     *
     * This constructor returns a growable list when [growable] is true;
     * otherwise, it returns a fixed-length list.
     */
    static from: new <E>(elements: DartIterable<E>, _?: {
        growable: boolean;
    }) => DartList<E>;
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
    protected static _generate<E>(length: int, generator: (index: int) => E, _?: {
        growable: boolean;
    }): DartList<E>;
    static generate: new <E>(length: int, generator: (index: int) => E, _?: {
        growable: boolean;
    }) => DartList<E>;
    /**
     * Creates an unmodifiable list containing all [elements].
     *
     * The [Iterator] of [elements] provides the order of the elements.
     *
     * An unmodifiable list cannot have its length or elements changed.
     * If the elements are themselves immutable, then the resulting list
     * is also immutable.
     */
    static unmodifiable: new <E>(elements: DartIterable<E>) => DartList<E>;
    /**
     * Returns the object at the given [index] in the list
     * or throws a [RangeError] if [index] is out of bounds.
     */
    [OperatorMethods.INDEX](index: int): E;
    /**
     * Sets the value at the given [index] in the list to [value]
     * or throws a [RangeError] if [index] is out of bounds.
     */
    [OperatorMethods.INDEX_EQ](index: int, value: E): void;
    /**
     * Returns the number of objects in this list.
     *
     * The valid indices for a list are `0` through `length - 1`.
     */
    /**
    * Changes the length of this list.
    *
    * If [newLength] is greater than
    * the current length, entries are initialized to [:null:].
    *
    * Throws an [UnsupportedError] if the list is fixed-length.
    */
    length: int;
    /**
     * Adds [value] to the end of this list,
     * extending the length by one.
     *
     * Throws an [UnsupportedError] if the list is fixed-length.
     */
    add(value: E): void;
    /**
     * Appends all objects of [iterable] to the end of this list.
     *
     * Extends the length of the list by the number of objects in [iterable].
     * Throws an [UnsupportedError] if this list is fixed-length.
     */
    addAll(iterable: DartIterable<E>): void;
    /**
     * Returns an [Iterable] of the objects in this list in reverse order.
     */
    readonly reversed: DartIterable<E>;
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
    sort(compare?: (a: E, b: E) => int): void;
    /**
     * Shuffles the elements of this list randomly.
     */
    shuffle(random?: DartRandom): void;
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
    indexOf(element: E, start?: int): int;
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
    lastIndexOf(element: E, start?: int): int;
    /**
     * Removes all objects from this list;
     * the length of the list becomes zero.
     *
     * Throws an [UnsupportedError], and retains all objects, if this
     * is a fixed-length list.
     */
    clear(): void;
    /**
     * Inserts the object at position [index] in this list.
     *
     * This increases the length of the list by one and shifts all objects
     * at or after the index towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    insert(index: int, element: E): void;
    /**
     * Inserts all objects of [iterable] at position [index] in this list.
     *
     * This increases the length of the list by the length of [iterable] and
     * shifts all later objects towards the end of the list.
     *
     * An error occurs if the [index] is less than 0 or greater than length.
     * An [UnsupportedError] occurs if the list is fixed-length.
     */
    insertAll(index: int, iterable: DartIterable<E>): void;
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
    setAll(index: int, iterable: DartIterable<E>): void;
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
    remove(value: any): boolean;
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
    removeAt(index: int): E;
    /**
     * Pops and returns the last object in this list.
     *
     * Throws an [UnsupportedError] if this is a fixed-length list.
     */
    removeLast(): E;
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
    removeWhere(test: (element: E) => boolean): void;
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
    retainWhere(test: (element: E) => boolean): void;
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
    sublist(start: int, end?: int): DartList<E>;
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
    getRange(start: int, end: int): DartIterable<E>;
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
    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int): void;
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
    removeRange(start: int, end: int): void;
    /**
     * Sets the objects in the range [start] inclusive to [end] exclusive
     * to the given [fillValue].
     *
     * The provide range, given by [start] and [end], must be valid.
     * A range from [start] to [end] is valid if `0 <= start <= end <= len`, where
     * `len` is this list's `length`. The range starts at `start` and has length
     * `end - start`. An empty range (with `end == start`) is valid.
     */
    fillRange(start: int, end: int, fillValue?: E): void;
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
    replaceRange(start: int, end: int, replacement: DartIterable<E>): void;
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
    asMap(): DartMap<int, E>;
    protected static create<E>(length?: int): DartList<E>;
    protected static _filled<E>(length: int, fill: E, _?: {
        growable?: bool;
    }): DartList<E>;
    protected static _from<E>(elements: DartIterable<E>, _?: {
        growable?: bool;
    }): DartList<E>;
    protected static _unmodifiable<E>(elements: DartIterable<E>): DartList<E>;
}
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
declare class DartLinkedHashMap<K, V> implements DartHashMap<K, V> {
    [OperatorMethods.INDEX](key: K): V;
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    get(k: K): V;
    set(k: K, v: V): void;
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
    constructor(_?: {
        equals?: (key1: K, key2: K) => bool;
        hashCode?: (key: K) => int;
        isValidKey?: (potentialKey: any) => bool;
    });
    /**
     * Creates an insertion-ordered identity-based map.
     *
     * Effectively a shorthand for:
     *
     *     new LinkedHashMap<K, V>(equals: identical,
     *                             hashCode: identityHashCode)
     */
    static identity: new <K, V>() => DartLinkedHashMap<K, V>;
    /**
     * Creates a [LinkedHashMap] that contains all key value pairs of [other].
     */
    protected static _from<K, V>(other: DartMap<K, V>): DartLinkedHashMap<K, V>;
    static from: new <K, V>(other: DartMap<K, V>) => DartLinkedHashMap<K, V>;
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
    protected static _fromIterable<K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }): DartLinkedHashMap<K, V>;
    static fromIterable: new <K, V>(iterable: DartIterable<any>, _?: {
        key?: (element: any) => K;
        value?: (element: any) => V;
    }) => DartLinkedHashMap<K, V>;
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
    protected static _fromIterables<K, V>(keys: DartIterable<K>, values: DartIterable<V>): DartLinkedHashMap<K, V>;
    static fromIterables: new <K, V>(keys: DartIterable<K>, values: DartIterable<V>) => DartLinkedHashMap<K, V>;
    addAll(other: DartMap<K, V>): void;
    clear(): void;
    containsKey(key: any): bool;
    containsValue(value: any): bool;
    forEach(f: (key: K, value: V) => any): void;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    readonly keys: DartIterable<K>;
    readonly length: int;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    remove(key: any): V;
    readonly values: DartIterable<V>;
    protected static _create<K, V>(_?: {
        equals?: (key1: K, key2: K) => bool;
        hashCode?: (key: K) => int;
        isValidKey?: (potentialKey: any) => bool;
    }): DartLinkedHashMap<K, V>;
    protected static _identity<K, V>(): DartLinkedHashMap<K, V>;
    protected static __literal<K, V>(keyValuePairs: DartList<any>): DartLinkedHashMap<K, V>;
    protected static _literal: new <K, V>(keyValuePairs: DartList<any>) => DartLinkedHashMap<K, V>;
    protected static __empty<K, V>(): DartLinkedHashMap<K, V>;
    protected static _empty: new <K, V>() => DartLinkedHashMap<K, V>;
    protected static _makeEmpty<K, V>(): DartJsLinkedHashMap<K, V>;
    protected static _makeLiteral<K, V>(keyValuePairs: any): DartJsLinkedHashMap<K, V>;
}
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
declare class DartListMixin<E> implements DartList<E> {
    [Symbol.iterator](): Iterator<E>;
    protected DartListMixin(): void;
    constructor();
    length: int;
    [OperatorMethods.INDEX](index: number): E;
    [OperatorMethods.INDEX_EQ](index: number, value: E): void;
    readonly iterator: DartIterator<E>;
    elementAt(index: int): E;
    forEach(action: (element: E) => void): void;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    contains(element: any): bool;
    every(test: (element: E) => bool): bool;
    any(test: (element: E) => bool): bool;
    firstWhere(test: (element: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    lastWhere(test: (element: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    singleWhere(test: (element: E) => bool): E;
    join(separator?: string): string;
    where(test: (element: E) => bool): DartIterable<E>;
    map<T>(f: (element: E) => T): DartIterable<T>;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    reduce(combine: (previousValue: E, element: E) => E): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (element: E) => bool): DartIterable<E>;
    take(count: int): DartIterable<E>;
    takeWhile(test: (element: E) => bool): DartIterable<E>;
    toList(_?: {
        growable: bool;
    }): DartList<E>;
    toSet(): DartSet<E>;
    add(element: E): void;
    addAll(iterable: DartIterable<E>): void;
    remove(element: any): bool;
    removeWhere(test: (element: E) => bool): void;
    retainWhere(test: (element: E) => bool): void;
    protected _filter(test: (element: any) => bool, retainMatching: bool): void;
    clear(): void;
    removeLast(): E;
    sort(compare?: (a: E, b: E) => int): void;
    static _compareAny(a: any, b: any): int;
    shuffle(random?: DartRandom): void;
    asMap(): DartMap<int, E>;
    sublist(start: int, end?: int): DartList<E>;
    getRange(start: int, end: int): DartIterable<E>;
    removeRange(start: int, end: int): void;
    fillRange(start: int, end: int, fill?: E): void;
    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int): void;
    replaceRange(start: int, end: int, newContents: DartIterable<E>): void;
    indexOf(element: any, startIndex?: int): int;
    /**
     * Returns the last index in the list [a] of the given [element], starting
     * the search at index [startIndex] to 0.
     * Returns -1 if [element] is not found.
     */
    lastIndexOf(element: any, startIndex?: int): int;
    insert(index: int, element: E): void;
    removeAt(index: int): E;
    insertAll(index: int, iterable: DartIterable<E>): void;
    setAll(index: int, iterable: DartIterable<E>): void;
    readonly reversed: DartIterable<E>;
    toString(): string;
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
declare class DartListBase<E> extends DartListMixin<E> {
    /**
     * Convert a `List` to a string as `[each, element, as, string]`.
     *
     * Handles circular references where converting one of the elements
     * to a string ends up converting [list] to a string again.
     */
    static listToString<E>(list: DartList<E>): string;
}
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
declare class DartMapMixin<K, V> implements DartMap<K, V> {
    readonly keys: DartIterable<K>;
    [OperatorMethods.INDEX](key: any): V;
    [OperatorMethods.INDEX_EQ](key: K, value: V): void;
    get(k: K): V;
    set(k: K, v: V): void;
    remove(key: any): V;
    clear(): void;
    forEach(action: (key: K, value: V) => any): void;
    addAll(other: DartMap<K, V>): void;
    containsValue(value: any): bool;
    putIfAbsent(key: K, ifAbsent: () => V): V;
    containsKey(key: any): bool;
    readonly length: int;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    readonly values: DartIterable<V>;
    toString(): string;
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
declare class DartMapBase<K, V> extends DartMapMixin<K, V> {
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
declare class UnmodifiableMapBase<K, V> extends DartMapBase<K, V> {
}
/**
 * Helper class which implements complex [Map] operations
 * in term of basic ones ([Map.keys], [Map.[]],
 * [Map.[]=] and [Map.remove].)  Not all methods are
 * necessary to implement each particular operation.
 */
export declare namespace DartMaps {
    function containsValue(map: DartMap<any, any>, value: any): bool;
    function containsKey(map: DartMap<any, any>, key: any): bool;
    function putIfAbsent(map: DartMap<any, any>, key: any, ifAbsent: () => any): any;
    function clear(map: DartMap<any, any>): void;
    function forEach(map: DartMap<any, any>, f: (key: any, value: any) => any): void;
    function getValues(map: DartMap<any, any>): DartIterable<any>;
    function length(map: DartMap<any, any>): int;
    function isEmpty(map: DartMap<any, any>): bool;
    function isNotEmpty(map: DartMap<any, any>): bool;
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
    function mapToString(m: DartMap<any, any>): string;
    /**
     * Fills a map with key/value pairs computed from [iterable].
     *
     * This method is used by Map classes in the named constructor fromIterable.
     */
    function _fillMapWithMappedIterable(map: DartMap<any, any>, iterable: DartIterable<any>, key: (element: any) => any, value: (element: any) => any): void;
    /**
     * Fills a map by associating the [keys] to [values].
     *
     * This method is used by Map classes in the named constructor fromIterables.
     */
    function _fillMapWithIterables(map: DartMap<any, any>, keys: DartIterable<any>, values: DartIterable<any>): void;
}
/**
 * A collection of objects in which each object can occur only once.
 *
 * That is, for each object of the element type, the object is either considered
 * to be in the set, or to _not_ be in the set.
 *
 * Set implementations may consider some elements indistinguishable. These
 * elements are treated as being the same for any operation on the set.
 *
 * The default [Set] implementation, [LinkedHashSet], considers objects
 * indistinguishable if they are equal with regard to
 * operator [Object.==].
 *
 * Iterating over elements of a set may be either unordered
 * or ordered in some way. Examples:
 *
 * * A [HashSet] is unordered, which means that its iteration order is
 *   unspecified,
 * * [LinkedHashSet] iterates in the insertion order of its elements, and
 * * a sorted set like [SplayTreeSet] iterates the elements in sorted order.
 *
 * It is generally not allowed to modify the set (add or remove elements) while
 * an operation on the set is being performed, for example during a call to
 * [forEach] or [containsAll]. Nor is it allowed to modify the DartSet while
 * iterating either the set itself or any [Iterable] that is backed by the set,
 * such as the ones returned by methods like [where] and [map].
 */
declare class DartSet<E> extends DartEfficientLengthIterable<E> {
    /**
     * Creates an empty [Set].
     *
     * The created [Set] is a plain [LinkedHashSet].
     * As such, it considers elements that are equal (using [==]) to be
     * indistinguishable, and requires them to have a compatible
     * [Object.hashCode] implementation.
     *
     * The set is equivalent to one created by `new LinkedHashSet<E>()`.
     */
    protected static create<E>(): DartSet<E>;
    constructor();
    /**
     * Creates an empty identity [Set].
     *
     * The created [Set] is a [LinkedHashSet] that uses identity as equality
     * relation.
     *
     * The set is equivalent to one created by `new LinkedHashSet<E>.identity()`.
     */
    protected static _identity<E>(): DartSet<E>;
    static identity: new <E>() => DartSet<E>;
    /**
     * Creates a [Set] that contains all [elements].
     *
     * All the [elements] should be assignable to [E].
     * The `elements` iterable itself can have any type,
     * so this constructor can be used to down-cast a `Set`, for example as:
     *
     *     Set<SuperType> superSet = ...;
     *     Set<SubType> subSet =
     *         new Set<SubType>.from(superSet.where((e) => e is SubType));
     *
     * The created [Set] is a [LinkedHashSet]. As such, it considers elements that
     * are equal (using [==]) to be indistinguishable, and requires them to
     * have a compatible [Object.hashCode] implementation.
     *
     * The set is equivalent to one created by
     * `new LinkedHashSet<E>.from(elements)`.
     */
    protected static _from<E>(elements: DartIterable<E>): DartSet<E>;
    static from: new <E>(elements: DartIterable<E>) => DartSet<E>;
    /**
     * Provides an iterator that iterates over the elements of this set.
     *
     * The order of iteration is defined by the individual `Set` implementation,
     * but must be consistent between changes to the set.
     */
    readonly iterator: DartIterator<E>;
    /**
     * Returns true if [value] is in the set.
     */
    contains(value: any): bool;
    /**
     * Adds [value] to the set.
     *
     * Returns `true` if [value] (or an equal value) was not yet in the set.
     * Otherwise returns `false` and the set is not changed.
     *
     * Example:
     *
     *     var set = new Set();
     *     var time1 = new DateTime.fromMillisecondsSinceEpoch(0);
     *     var time2 = new DateTime.fromMillisecondsSinceEpoch(0);
     *     // time1 and time2 are equal, but not identical.
     *     Expect.isTrue(time1 == time2);
     *     Expect.isFalse(identical(time1, time2));
     *     set.add(time1);  // => true.
     *     // A value equal to time2 exists already in the set, and the call to
     *     // add doesn't change the set.
     *     set.add(time2);  // => false.
     *     Expect.isTrue(set.length == 1);
     *     Expect.isTrue(identical(time1, set.first));
     */
    add(value: E): bool;
    /**
     * Adds all [elements] to this Set.
     *
     * Equivalent to adding each element in [elements] using [add],
     * but some collections may be able to optimize it.
     */
    addAll(elements: DartIterable<E>): void;
    /**
     * Removes [value] from the set. Returns true if [value] was
     * in the set. Returns false otherwise. The method has no effect
     * if [value] value was not in the set.
     */
    remove(value: any): bool;
    /**
     * If an object equal to [object] is in the set, return it.
     *
     * Checks if there is an object in the set that is equal to [object].
     * If so, that object is returned, otherwise returns null.
     */
    lookup(object: any): E;
    /**
     * Removes each element of [elements] from this set.
     */
    removeAll(elements: DartIterable<any>): void;
    /**
     * Removes all elements of this set that are not elements in [elements].
     *
     * Checks for each element of [elements] whether there is an element in this
     * set that is equal to it (according to `this.contains`), and if so, the
     * equal element in this set is retained, and elements that are not equal
     * to any element in `elements` are removed.
     */
    retainAll(elements: DartIterable<any>): void;
    /**
     * Removes all elements of this set that satisfy [test].
     */
    removeWhere(test: (element: E) => bool): void;
    /**
     * Removes all elements of this set that fail to satisfy [test].
     */
    retainWhere(test: (element: E) => bool): void;
    /**
     * Returns whether this Set contains all the elements of [other].
     */
    containsAll(other: DartIterable<any>): bool;
    /**
     * Returns a new set which is the intersection between this set and [other].
     *
     * That is, the returned set contains all the elements of this [Set] that
     * are also elements of [other] according to `other.contains`.
     */
    intersection(other: DartSet<any>): DartSet<E>;
    /**
     * Returns a new set which contains all the elements of this set and [other].
     *
     * That is, the returned set contains all the elements of this [Set] and
     * all the elements of [other].
     */
    union(other: DartSet<E>): DartSet<E>;
    /**
     * Returns a new set with the elements of this that are not in [other].
     *
     * That is, the returned set contains all the elements of this [DartSet] that
     * are not elements of [other] according to `other.contains`.
     */
    difference(other: DartSet<any>): DartSet<E>;
    /**
     * Removes all elements in the set.
     */
    clear(): void;
    toSet(): DartSet<E>;
    readonly length: int;
}
declare class DartSort {
    static sort(arg0: any, arg1: any): any;
}
export declare class DartStringSink {
    /**
     * Converts [obj] to a String by invoking [Object.toString] and
     * adds the result to `this`.
     */
    write(obj: any): void;
    /**
     * Iterates over the given [objects] and [write]s them in sequence.
     */
    writeAll(objects: DartIterable<any>, separator?: string): void;
    /**
     * Converts [obj] to a String by invoking [Object.toString] and
     * adds the result to `this`, followed by a newline.
     */
    writeln(obj?: any): void;
    /**
     * Writes the [charCode] to `this`.
     *
     * This method is equivalent to `write(new String.fromCharCode(charCode))`.
     */
    writeCharCode(charCode: int): void;
}
/**
 * A class for concatenating strings efficiently.
 *
 * Allows for the incremental building of a string using write*() methods.
 * The strings are concatenated to a single string only when [toString] is
 * called.
 */
declare class DartStringBuffer implements DartStringSink {
    /** Creates the string buffer with an initial content. */
    constructor(content?: any);
    /**
     * Returns the length of the content that has been accumulated so far.
     * This is a constant-time operation.
     */
    /** Returns whether the buffer is empty. This is a constant-time operation. */
    readonly isEmpty: boolean;
    /**
     * Returns whether the buffer is not empty. This is a constant-time
     * operation.
     */
    readonly isNotEmpty: bool;
    /**
     * Clears the string buffer.
     */
    _contents: string;
    create(content: any): void;
    readonly length: int;
    write(obj: any): void;
    writeCharCode(charCode: int): void;
    writeAll(objects: DartIterable<any>, separator?: string): void;
    writeln(obj?: any): void;
    clear(): void;
    toString(): string;
    _writeString(str: any): void;
    protected static _writeAll(string: string, objects: DartIterable<any>, separator: string): string;
    protected static _writeOne(string: string, obj: any): string;
}
/**
 * A generic destination for data.
 *
 * Multiple data values can be put into a sink, and when no more data is
 * available, the sink should be closed.
 *
 * This is a generic interface that other data receivers can implement.
 */
declare class DartSink<T> {
    /**
     * Adds [data] to the sink.
     *
     * Must not be called after a call to [close].
     */
    add(data: T): void;
    /**
     * Closes the sink.
     *
     * The [add] method must not be called after this method.
     *
     * Calling this method more than once is allowed, but does nothing.
     */
    close(): void;
}
/**
 * Mixin for an unmodifiable [List] class.
 *
 * This overrides all mutating methods with methods that throw.
 * This mixin is intended to be mixed in on top of [ListMixin] on
 * unmodifiable lists.
 */
declare class DartUnmodifiableListMixin<E> {
    /** This operation is not supported by an unmodifiable list. */
    [OperatorMethods.INDEX_EQ](index: int, value: E): void;
    /** This operation is not supported by an unmodifiable list. */
    length: int;
    /** This operation is not supported by an unmodifiable list. */
    setAll(at: int, iterable: DartIterable<E>): void;
    /** This operation is not supported by an unmodifiable list. */
    add(value: E): void;
    /** This operation is not supported by an unmodifiable list. */
    insert(index: int, element: E): void;
    /** This operation is not supported by an unmodifiable list. */
    insertAll(at: int, iterable: DartIterable<E>): void;
    /** This operation is not supported by an unmodifiable list. */
    addAll(iterable: DartIterable<E>): void;
    /** This operation is not supported by an unmodifiable list. */
    remove(element: DartObject): boolean;
    /** This operation is not supported by an unmodifiable list. */
    removeWhere(test: (element: E) => boolean): void;
    /** This operation is not supported by an unmodifiable list. */
    retainWhere(test: (element: E) => boolean): void;
    /** This operation is not supported by an unmodifiable list. */
    sort(compare?: DartComparator<E>): void;
    /** This operation is not supported by an unmodifiable list. */
    shuffle(random?: DartRandom): void;
    /** This operation is not supported by an unmodifiable list. */
    clear(): void;
    /** This operation is not supported by an unmodifiable list. */
    removeAt(index: int): E;
    /** This operation is not supported by an unmodifiable list. */
    removeLast(): E;
    /** This operation is not supported by an unmodifiable list. */
    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int): void;
    /** This operation is not supported by an unmodifiable list. */
    removeRange(start: int, end: int): void;
    /** This operation is not supported by an unmodifiable list. */
    replaceRange(start: int, end: int, iterable: DartIterable<E>): void;
    /** This operation is not supported by an unmodifiable list. */
    fillRange(start: int, end: int, fillValue?: E): void;
}
/**
 * Abstract implementation of an unmodifiable list.
 *
 * All operations are defined in terms of `length` and `operator[]`,
 * which need to be implemented.
 */
declare class DartUnmodifiableListBase<E> extends DartListBase<E> {
}
/**
 * Mixin that throws on the length changing operations of [List].
 *
 * Intended to mix-in on top of [ListMixin] for fixed-length lists.
 */
declare class DartFixedLengthListMixin<E> {
    /** This operation is not supported by a fixed length list. */
    length: int;
    /** This operation is not supported by a fixed length list. */
    add(value: E): void;
    /** This operation is not supported by a fixed length list. */
    insert(index: int, value: E): void;
    /** This operation is not supported by a fixed length list. */
    insertAll(at: int, iterable: DartIterable<E>): void;
    /** This operation is not supported by a fixed length list. */
    addAll(iterable: DartIterable<E>): void;
    /** This operation is not supported by a fixed length list. */
    remove(element: DartObject): boolean;
    /** This operation is not supported by a fixed length list. */
    removeWhere(test: (element: E) => boolean): void;
    /** This operation is not supported by a fixed length list. */
    retainWhere(test: (element: E) => boolean): void;
    /** This operation is not supported by a fixed length list. */
    clear(): void;
    /** This operation is not supported by a fixed length list. */
    removeAt(index: int): E;
    /** This operation is not supported by a fixed length list. */
    removeLast(): E;
    /** This operation is not supported by a fixed length list. */
    removeRange(start: int, end: int): void;
    /** This operation is not supported by a fixed length list. */
    replaceRange(start: int, end: int, iterable: DartIterable<E>): void;
}
/**
 * Abstract implementation of a fixed-length list.
 *
 * All operations are defined in terms of `length`, `operator[]` and
 * `operator[]=`, which need to be implemented.
 */
declare class FixedLengthListBase<E> extends DartListBase<E> {
}
/**
 * An [Iterable] for classes that have efficient [length] and [elementAt].
 *
 * All other methods are implemented in terms of [length] and [elementAt],
 * including [iterator].
 */
export declare abstract class DartListIterable<E> extends DartEfficientLengthIterable<E> {
    abstract readonly length: int;
    abstract elementAt(i: int): E;
    constructor();
    readonly iterator: DartIterator<E>;
    forEach(action: (element: E) => void): void;
    readonly isEmpty: boolean;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    contains(element: DartObject): boolean;
    every(test: (element: E) => boolean): boolean;
    any(test: (element: E) => boolean): boolean;
    firstWhere(test: (element: E) => boolean, _?: {
        orElse?: () => E;
    }): E;
    lastWhere(test: (element: E) => boolean, _?: {
        orElse?: () => E;
    }): E;
    singleWhere(test: (element: E) => boolean): E;
    join(separator?: string): string;
    where(test: (element: E) => boolean): DartIterable<E>;
    map<T>(f: (element: E) => T): DartIterable<T>;
    reduce(combine: (value: any, element: E) => E): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (element: E) => boolean): DartIterable<E>;
    take(count: int): DartIterable<E>;
    takeWhile(test: (element: E) => boolean): DartIterable<E>;
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
    toSet(): DartSet<E>;
}
declare class DartListMapView<E> implements DartMap<int, E> {
    _values: DartList<E>;
    constructor(_values: DartList<E>);
    [OperatorMethods.INDEX](key: int): E;
    readonly length: int;
    readonly values: DartIterable<E>;
    readonly keys: DartIterable<int>;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
    containsValue(value: DartObject): boolean;
    containsKey(key: int): boolean;
    forEach(f: (key: int, value: E) => any): void;
    /** This operation is not supported by an unmodifiable map. */
    [OperatorMethods.INDEX_EQ](key: int, value: E): void;
    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key: int, ifAbsent: () => E): E;
    /** This operation is not supported by an unmodifiable map. */
    remove(key: int): E;
    /** This operation is not supported by an unmodifiable map. */
    clear(): void;
    /** This operation is not supported by an unmodifiable map. */
    addAll(other: DartMap<int, E>): void;
    toString(): string;
    get(k: int): E;
    set(k: int, v: E): void;
}
declare class DartReversedListIterable<E> extends DartListIterable<E> {
    _source: DartIterable<E>;
    constructor(_source: DartIterable<E>);
    readonly length: int;
    elementAt(index: int): E;
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
export declare function makeListFixedLength<X>(growableList: DartList<X>): DartList<X>;
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
export declare function makeFixedListUnmodifiable<X>(fixedLengthList: DartList<X>): DartList<X>;
declare class DartSubListIterable<E> extends DartListIterable<E> {
    _iterable: DartIterable<E>;
    _start: int;
    /** If null, represents the length of the iterable. */
    _endOrLength: int;
    constructor(_iterable: DartIterable<E>, _start: int, _endOrLength: int);
    readonly _endIndex: int;
    readonly _startIndex: int;
    readonly length: int;
    elementAt(index: int): E;
    skip(count: int): DartIterable<E>;
    take(count: int): DartIterable<E>;
    toList(_?: {
        growable?: boolean;
    }): DartList<E>;
}
declare abstract class _BaseJSIterator<E> implements DartIterator<E> {
    abstract readonly current: E;
    abstract moveNext(): boolean;
    next(value?: any): IteratorResult<E>;
}
/**
 * An [Iterator] that iterates a list-like [Iterable].
 *
 * All iterations is done in terms of [Iterable.length] and
 * [Iterable.elementAt]. These operations are fast for list-like
 * iterables.
 */
declare class DartListIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {
    _iterable: DartIterable<E>;
    _length: int;
    _index: int;
    _current: E;
    constructor(iterable: DartIterable<E>);
    readonly current: E;
    moveNext(): boolean;
}
declare type _Transformation<S, T> = (value: S) => T;
declare class DartMappedIterable<S, T> extends DartIterable<T> {
    protected _iterable: DartIterable<S>;
    protected _f: _Transformation<S, T>;
    protected static create<S, T>(iterable: DartIterable<S>, _function: (value: S) => T): DartMappedIterable<S, T>;
    constructor(iterable: DartIterable<S>, _function: (value: S) => T);
    _(_iterable: DartIterable<S>, _f: _Transformation<S, T>): void;
    protected static _: new <S, T>(_iterable: DartIterable<S>, _f: _Transformation<S, T>) => DartMappedIterable<S, T>;
    readonly iterator: DartIterator<T>;
    readonly length: int;
    readonly isEmpty: boolean;
    readonly first: T;
    readonly last: T;
    readonly single: T;
    elementAt(index: int): T;
}
declare class DartEfficientLengthMappedIterable<S, T> extends DartMappedIterable<S, T> implements DartEfficientLengthIterable<T> {
    protected _init(iterable: DartIterable<S>, _function: (value: S) => T): void;
    constructor(iterable: DartIterable<S>, _function: (value: S) => T);
}
/**
 * Specialized alternative to [MappedIterable] for mapped [List]s.
 *
 * Expects efficient `length` and `elementAt` on the source iterable.
 */
declare class DartMappedListIterable<S, T> extends DartListIterable<T> {
    _source: DartIterable<S>;
    _f: _Transformation<S, T>;
    constructor(_source: DartIterable<S>, _f: _Transformation<S, T>);
    readonly length: int;
    elementAt(index: int): T;
}
declare type _ElementPredicate<E> = (element: E) => boolean;
declare class DartWhereIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;
    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>);
    readonly iterator: DartIterator<E>;
    map<T>(f: (element: E) => T): DartIterable<T>;
}
declare class DartWhereIterator<E> extends _BaseJSIterator<E> implements DartIterator<E> {
    _iterator: DartIterator<E>;
    _f: _ElementPredicate<E>;
    constructor(_iterator: DartIterator<E>, _f: _ElementPredicate<E>);
    moveNext(): boolean;
    readonly current: E;
}
declare type _ExpandFunction<S, T> = (sourceElement: S) => DartIterable<T>;
declare class DartExpandIterable<S, T> extends DartIterable<T> {
    private _iterable;
    private _f;
    constructor(_iterable: DartIterable<S>, _f: _ExpandFunction<S, T>);
    readonly iterator: DartIterator<T>;
}
declare class DartExpandIterator<S, T> extends _BaseJSIterator<T> implements DartIterator<T> {
    protected _iterator: DartIterator<S>;
    protected _f: _ExpandFunction<S, T>;
    protected _currentExpansion: DartIterator<T>;
    protected _current: T;
    constructor(_iterator: DartIterator<S>, _f: _ExpandFunction<S, T>);
    readonly current: T;
    moveNext(): boolean;
}
declare class DartTakeIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _takeCount: int;
    static create<E>(iterable: DartIterable<E>, takeCount: int): DartTakeIterable<E>;
    constructor(_iterable: DartIterable<E>, _takeCount: int);
    readonly iterator: DartIterator<E>;
}
declare class DartTakeWhileIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;
    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>);
    readonly iterator: DartIterator<E>;
}
declare class DartSkipIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _skipCount: int;
    protected static create<E>(iterable: DartIterable<E>, count: int): DartSkipIterable<E>;
    constructor(iterable: DartIterable<E>, count: int);
    protected _(_iterable: DartIterable<E>, _skipCount: int): void;
    protected static _: new <E>(_iterable: DartIterable<E>, _skipCount: int) => DartSkipIterable<E>;
    skip(count: int): DartIterable<E>;
    readonly iterator: DartIterator<E>;
}
declare class DartSkipWhileIterable<E> extends DartIterable<E> {
    _iterable: DartIterable<E>;
    _f: _ElementPredicate<E>;
    constructor(_iterable: DartIterable<E>, _f: _ElementPredicate<E>);
    readonly iterator: DartIterator<E>;
}
/**
 * The always empty [Iterable].
 */
declare class DartEmptyIterable<E> extends DartEfficientLengthIterable<E> {
    readonly iterator: DartIterator<E>;
    forEach(action: (element: E) => any): void;
    readonly isEmpty: boolean;
    readonly length: int;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    elementAt(index: int): E;
    contains(element: DartObject): boolean;
    every(test: (element: E) => boolean): boolean;
    any(test: (element: E) => boolean): boolean;
    firstWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    lastWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    singleWhere(test: (element: E) => boolean, _?: {
        orElse: () => E;
    }): E;
    join(separator?: string): string;
    where(test: (element: E) => boolean): DartIterable<E>;
    map<T>(f: (element: E) => T): DartIterable<T>;
    reduce(combine: (value: E, element: E) => E): E;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    skip(count: int): DartIterable<E>;
    skipWhile(test: (element: E) => boolean): DartIterable<E>;
    take(count: int): DartIterable<E>;
    takeWhile(test: (element: E) => boolean): DartIterable<E>;
    toList(_?: {
        growable: boolean;
    }): DartList<E>;
    toSet(): DartSet<E>;
}
/**
 * Creates errors throw by [Iterable] when the element count is wrong.
 */
export declare abstract class DartIterableElementError {
    /** Error thrown thrown by, e.g., [Iterable.first] when there is no result. */
    static noElement(): StateError;
    /** Error thrown by, e.g., [Iterable.single] if there are too many results. */
    static tooMany(): StateError;
    /** Error thrown by, e.g., [List.setRange] if there are too few elements. */
    static tooFew(): StateError;
}
/**
 * An Iterator that allows moving backwards as well as forwards.
 */
declare class DartBidirectionalIterator<E> extends DartIterator<E> {
    /**
     * Move back to the previous element.
     *
     * Returns true and updates [current] if successful. Returns false
     * and sets [current] to null if there is no previous element.
     */
    movePrevious(): bool;
}
/**
 * The operation was not allowed by the object.
 *
 * This [Error] is thrown when an instance cannot implement one of the methods
 * in its signature.
 */
declare class DartError extends Error {
    static safeToString(object: DartObject): string;
    static _stringToSafeString(o: DartObject): string;
    static _objectToString(o: DartObject): string;
}
declare class UnsupportedError extends DartError {
    message: string;
    constructor(message: string);
    toString(): string;
}
/**
 * Error occurring when a collection is modified during iteration.
 *
 * Some modifications may be allowed for some collections, so each collection
 * ([Iterable] or similar collection of values) should declare which operations
 * are allowed during an iteration.
 */
declare class ConcurrentModificationError extends DartError {
    /** The object that was modified in an incompatible way. */
    modifiedObject: any;
    constructor(modifiedObject?: any);
    toString(): string;
}
/**
 * Error thrown when attempting to throw [:null:].
 */
declare class NullThrownError extends DartError {
    toString(): string;
}
declare class FormatException extends DartError {
    constructor(message: string, formatString?: any, end?: any);
}
/**
 * Error thrown when a function is passed an unacceptable argument.
 */
declare class ArgumentError extends DartError {
    /** Whether value was provided. */
    _hasValue: boolean;
    /** The invalid value. */
    invalidValue: any;
    /** Name of the invalid argument, if available. */
    name: string;
    /** Message describing the problem. */
    message: any;
    /**
     * The [message] describes the erroneous argument.
     *
     * Existing code may be using `message` to hold the invalid value.
     * If the `message` is not a [String], it is assumed to be a value instead
     * of a message.
     */
    protected ArgumentError(message?: any): void;
    constructor(message?: any);
    /**
     * Creates error containing the invalid [value].
     *
     * A message is built by suffixing the [message] argument with
     * the [name] argument (if provided) and the value. Example
     *
     *    "Invalid argument (foo): null"
     *
     * The `name` should match the argument name of the function, but if
     * the function is a method implementing an interface, and its argument
     * names differ from the interface, it might be more useful to use the
     * interface method's argument name (or just rename arguments to match).
     */
    protected value(value: any, name?: string, message?: string): void;
    static value: new (value: any, name?: string, message?: string) => ArgumentError;
    /**
     * Create an argument error for a `null` argument that must not be `null`.
     */
    protected notNull(name?: string): void;
    static notNull: new (name?: string) => ArgumentError;
    protected readonly _errorName: string;
    protected readonly _errorExplanation: string;
    toString(): string;
}
/**
 * Error thrown due to an index being outside a valid range.
 */
declare class RangeError extends ArgumentError {
    protected _start: num;
    protected _end: num;
    /** The minimum value that [value] is allowed to assume. */
    start: num;
    /** The maximum value that [value] is allowed to assume. */
    end: num;
    /**
     * Create a new [RangeError] with the given [message].
     */
    protected RangeError(message?: string): void;
    constructor(message?: any);
    /**
     * Create a new [RangeError] with a message for the given [value].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    protected value(value: num, name?: string, message?: string): void;
    static value: new (value: num, name?: string, message?: string) => RangeError;
    /**
     * Create a new [RangeError] for a value being outside the valid range.
     *
     * The allowed range is from [minValue] to [maxValue], inclusive.
     * If `minValue` or `maxValue` are `null`, the range is infinite in
     * that direction.
     *
     * For a range from 0 to the length of something, end exclusive, use
     * [RangeError.index].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    protected range(invalidValue: num, minValue: int, maxValue: int, name?: string, message?: string): void;
    static range: new (invalidValue: num, minValue: int, maxValue: int, name?: string, message?: string) => RangeError;
    /**
     * Creates a new [RangeError] stating that [index] is not a valid index
     * into [indexable].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     *
     * The [length] is the length of [indexable] at the time of the error.
     * If `length` is omitted, it defaults to `indexable.length`.
     */
    protected static _index(index: int, indexable: any, name?: string, message?: string, length?: int): IndexError;
    static index: new (index: int, indexable: any, name?: string, message?: string, length?: int) => IndexError;
    /**
     * Check that a [value] lies in a specific interval.
     *
     * Throws if [value] is not in the interval.
     * The interval is from [minValue] to [maxValue], both inclusive.
     */
    static checkValueInInterval(value: int, minValue: int, maxValue: int, name?: string, message?: string): void;
    /**
     * Check that a value is a valid index into an indexable object.
     *
     * Throws if [index] is not a valid index into [indexable].
     *
     * An indexable object is one that has a `length` and a and index-operator
     * `[]` that accepts an index if `0 <= index < length`.
     *
     * If [length] is provided, it is used as the length of the indexable object,
     * otherwise the length is found as `indexable.length`.
     */
    static checkValidIndex(index: int, indexable: any, name?: string, length?: int, message?: string): void;
    /**
     * Check that a range represents a slice of an indexable object.
     *
     * Throws if the range is not valid for an indexable object with
     * the given [length].
     * A range is valid for an indexable object with a given [length]
     *
     * if `0 <= [start] <= [end] <= [length]`.
     * An `end` of `null` is considered equivalent to `length`.
     *
     * The [startName] and [endName] defaults to `"start"` and `"end"`,
     * respectively.
     *
     * Returns the actual `end` value, which is `length` if `end` is `null`,
     * and `end` otherwise.
     */
    static checkValidRange(start: int, end: int, length: int, startName?: string, endName?: string, message?: string): int;
    /**
     * Check that an integer value isn't negative.
     *
     * Throws if the value is negative.
     */
    static checkNotNegative(value: int, name?: string, message?: string): void;
    protected readonly _errorName: string;
    protected readonly _errorExplanation: string;
}
/**
 * A specialized [RangeError] used when an index is not in the range
 * `0..indexable.length-1`.
 *
 * Also contains the indexable object, its length at the time of the error,
 * and the invalid index itself.
 */
declare class IndexError extends RangeError {
    /** The indexable object that [invalidValue] was not a valid index into. */
    indexable: any;
    /** The length of [indexable] at the time of the error. */
    length: int;
    /**
     * Creates a new [IndexError] stating that [invalidValue] is not a valid index
     * into [indexable].
     *
     * The [length] is the length of [indexable] at the time of the error.
     * If `length` is omitted, it defaults to `indexable.length`.
     *
     * The message is used as part of the string representation of the error.
     */
    protected IndexError(invalidValue: int, indexable: any, name?: string, message?: string, length?: int): void;
    constructor(invalidValue: int, indexable: any, name?: string, message?: string, length?: int);
    start: int;
    end: int;
    protected readonly _errorName: string;
    protected readonly _errorExplanation: string;
}
/**
 * The operation was not allowed by the current state of the object.
 *
 * This is a generic error used for a variety of different erroneous
 * actions. The message should be descriptive.
 */
declare class StateError extends DartError {
    message: string;
    protected StateError(message: string): void;
    constructor(message: string);
    toString(): string;
}
/**
 * A generator of random bool, int, or double values.
 *
 * The default implementation supplies a stream of
 * pseudo-random bits that are not suitable for cryptographic purposes.
 *
 * Use the Random.secure() constructor for cryptographic
 * purposes.
 */
declare class DartRandom {
    /**
     * Creates a random number generator.
     *
     * The optional parameter [seed] is used to initialize the
     * internal state of the generator. The implementation of the
     * random stream can change between releases of the library.
     */
    protected static Random(seed?: int): DartRandom;
    constructor(seed?: int);
    /**
     * Creates a cryptographically secure random number generator.
     *
     * If the program cannot provide a cryptographically secure
     * source of random numbers, it throws an [UnsupportedError].
     */
    protected static _secure(): DartRandom;
    static secure: new () => DartRandom;
    /**
     * Generates a non-negative random integer uniformly distributed in the range
     * from 0, inclusive, to [max], exclusive.
     *
     * Implementation note: The default implementation supports [max] values
     * between 1 and (1<<32) inclusive.
     */
    nextInt(max: int): int;
    /**
     * Generates a non-negative random floating point value uniformly distributed
     * in the range from 0.0, inclusive, to 1.0, exclusive.
     */
    nextDouble(): double;
    /**
     * Generates a random boolean value.
     */
    nextBool(): bool;
}
/**
 * The supertype for JSString and JSArray. Used by the backend as to
 * have a type mask that contains the objects that we can use the
 * native JS [] operator and length on.
 */
export interface JSIndexable<E> {
    [index: number]: E;
    readonly length: int;
}
/**
 * The supertype for JSMutableArray and
 * JavaScriptIndexingBehavior. Used by the backend to have a type mask
 * that contains the objects we can use the JS []= operator on.
 */
export interface JSMutableIndexable<E> extends JSIndexable<E> {
}
/**
 * The interceptor class for [List]. The compiler recognizes this
 * class as an interceptor, and changes references to [:this:] to
 * actually use the receiver of the method, which is generated as an extra
 * argument added to each member.
 */
declare class JSArray<E> extends Array implements DartList<E>, JSIndexable<E> {
    constructor(len?: number | Iterable<E>);
    protected static _list<E>(length?: any): JSArray<E>;
    static list: new <E>(length?: any) => JSArray<E>;
    /**
     * Returns a fresh JavaScript Array, marked as fixed-length.
     *
     * [length] must be a non-negative integer.
     */
    protected static _fixed<E>(length: int): JSArray<E>;
    static fixed: new <E>(length: int) => JSArray<E>;
    /**
     * Returns a fresh growable JavaScript Array of zero length length.
     */
    protected static _emptyGrowable<E>(values?: Iterable<E>): JSArray<E>;
    static emptyGrowable: new <E>(values?: Iterable<E>) => JSArray<E>;
    /**
     * Returns a fresh growable JavaScript Array with initial length.
     *
     * [validatedLength] must be a non-negative integer.
     */
    protected static _growable<E>(length: int): JSArray<E>;
    static growable: new <E>(length: int) => JSArray<E>;
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
    protected static _typed<E>(allocation: any): JSArray<E>;
    static typed: new <E>(allocation: any) => JSArray<E>;
    protected static _markFixed<E>(allocation: any): JSArray<E>;
    static markFixed: new <E>(allocation: any) => JSArray<E>;
    protected static _markGrowable<E>(allocation: any): JSArray<E>;
    static markGrowable: new <E>(allocation: any) => JSArray<E>;
    static markFixedList(list: DartList<any>): DartList<any>;
    static markUnmodifiableList(list: DartList<any>): DartList<any>;
    checkMutable(reason: any): void;
    checkGrowable(reason: any): void;
    add(value: E): void;
    removeAt(index: int): E;
    insert(index: int, value: E): void;
    insertAll(index: int, iterable: DartIterable<E>): void;
    setAll(index: int, iterable: DartIterable<E>): void;
    removeLast(): E;
    remove(element: any): bool;
    /**
     * Removes elements matching [test] from [this] List.
     */
    removeWhere(test: (element: E) => bool): void;
    retainWhere(test: (element: E) => bool): void;
    protected _removeWhere(test: (element: E) => bool, removeMatching: bool): void;
    where(f: (element: E) => bool): DartIterable<E>;
    expand<T>(f: (element: E) => DartIterable<T>): DartIterable<T>;
    addAll(collection: DartIterable<E>): void;
    clear(): void;
    forEach(...args: any[]): any;
    map(...args: any[]): any;
    join(separator?: string): string;
    protected _join(separator: string): string;
    take(n: int): DartIterable<E>;
    takeWhile(test: (value: E) => bool): DartIterable<E>;
    skip(n: int): DartIterable<E>;
    skipWhile(test: (value: E) => bool): DartIterable<E>;
    reduce(...args: any[]): any;
    fold<T>(initialValue: T, combine: (previousValue: T, element: E) => T): T;
    firstWhere(test: (value: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    lastWhere(test: (value: E) => bool, _?: {
        orElse?: () => E;
    }): E;
    singleWhere(test: (element: E) => bool): E;
    elementAt(index: int): E;
    sublist(start: int, end?: int): DartList<E>;
    getRange(start: int, end: int): DartIterable<E>;
    readonly first: E;
    readonly last: E;
    readonly single: E;
    removeRange(start: int, end: int): void;
    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int): void;
    fillRange(start: int, end: int, fillValue?: E): void;
    replaceRange(start: int, end: int, replacement: DartIterable<E>): void;
    any(test: (element: E) => bool): bool;
    every(...args: any[]): any;
    readonly reversed: DartIterable<E>;
    sort(...args: any[]): any;
    shuffle(random?: DartRandom): void;
    indexOf(element: any, start?: int): int;
    lastIndexOf(element: any, startIndex?: int): int;
    contains(other: any): bool;
    readonly isEmpty: bool;
    readonly isNotEmpty: bool;
    toString(): string;
    toList(_?: {
        growable?: bool;
    }): DartList<E>;
    _toListGrowable(): DartList<E>;
    _toListFixed(): DartList<E>;
    toSet(): DartSet<E>;
    readonly iterator: DartIterator<E>;
    readonly hashCode: int;
    length: int;
    [OperatorMethods.INDEX](index: int): E;
    [OperatorMethods.INDEX_EQ](index: int, value: E): void;
    asMap(): DartMap<int, E>;
}
export { JSArray };
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
declare class JSMutableArray<E> extends JSArray<E> implements JSMutableIndexable<E> {
}
declare class JSFixedArray<E> extends JSMutableArray<E> {
}
declare class JSUnmodifiableArray<E> extends JSArray<E> {
}
declare class DartArrayIterator<E> implements DartIterator<E> {
    protected _iterable: JSArray<E>;
    protected _length: int;
    protected _index: int;
    protected _current: E;
    constructor(iterable: JSArray<E>);
    readonly current: E;
    moveNext(): bool;
    next(value?: any): IteratorResult<E>;
}
export declare function argumentErrorValue(object: any): ArgumentError;
export declare function checkNull(object: any): any;
export declare function checkNum(value: any): number;
export declare function checkInt(value: any): number;
export declare function checkBool(value: any): boolean;
export declare function checkString(value: any): string;
export declare function diagnoseIndexError(indexable: any, index: any): DartError;
export declare function diagnoseRangeError(start: any, end: any, length: any): Error;
export declare function throwConcurrentModificationError(collection: any): void;
declare class DartPrimitives {
    static objectToHumanReadableString(object: any): string;
    private static objectTypeName;
    static objectHashCode(object: any): int;
    static stringFromCharCode(charCode: int): string;
    static stringFromCharCodes(list: DartList<any>): string;
    static stringFromNativeUint8List(charCodes: Array<int>, start: int, end: int): string;
    static flattenString(_contents: string): string;
    static stringConcatUnchecked(_contents: any, str: any): string;
    static dateNow(): num;
    static initTicker(): void;
    static timerFrequency: int;
    static timerTicks: Function;
    static valueFromDecomposedDate(years: any, month: any, day: any, hours: any, minutes: any, seconds: any, milliseconds: any, isUtc: any): int;
    static lazyAsJsDate(receiver: DartDateTime): any;
    static getYear(receiver: DartDateTime): any;
    static getMonth(receiver: DartDateTime): any;
    static getDay(receiver: DartDateTime): any;
    static getHours(receiver: DartDateTime): any;
    static getMinutes(receiver: DartDateTime): any;
    static getSeconds(receiver: DartDateTime): any;
    static getMilliseconds(receiver: DartDateTime): any;
    static getWeekday(receiver: DartDateTime): number;
    static valueFromDateString(str: any): number;
    static getTimeZoneName(receiver: DartDateTime): string;
    static getTimeZoneOffsetInMinutes(receiver: DartDateTime): int;
    static _parseIntError(source: string, handleError: (source: string) => int): int;
    static parseInt(source: string, radix: int, handleError: (source: string) => int): int;
    static _parseDoubleError(source: string, handleError: (source: string) => double): double;
    static parseDouble(source: string, handleError: (source: string) => double): double;
    /** [: r"$".codeUnitAt(0) :] */
    static DOLLAR_CHAR_VALUE: int;
    static extractStackTrace(error: DartError): DartStackTrace;
}
/**
 * Called by generated code to build a map literal. [keyValuePairs] is
 * a list of key, value, key, value, ..., etc.
 */
export declare function fillLiteralMap(keyValuePairs: any, result: DartMap<any, any>): DartMap<any, any>;
export declare function getIndex(array: any, index: int): any;
export declare function getLength(array: any): any;
export declare function isJsArray(value: any): bool;
declare class DartStackTrace {
    constructor();
    DartStackTrace(): void;
    static $fromString(stackTraceString: string): DartStackTrace;
    static fromString: new (stackTraceString: string) => DartStackTrace;
    static readonly current: DartStackTrace;
    toString(): string;
    protected static _fromError(e: Error): DartStackTrace;
    static fromError: new (e: Error) => DartStackTrace;
}
export declare class DartExceptionAndStackTrace {
    dartException: any;
    stackTrace: DartStackTrace;
    constructor(dartException: any, stackTrace: DartStackTrace);
}
export declare class _StringStackTrace extends DartStackTrace {
    _stackTrace: string;
    constructor(_stackTrace: string);
    _StringStackTrace(_stackTrace: string): void;
    toString(): string;
}
export declare class _StackTrace extends DartStackTrace {
    _exception: any;
    _trace: string;
    constructor(_exception: any);
    _StackTrace(_exception: any): void;
    toString(): string;
}
export declare var getTraceFromException: (exception: any) => DartStackTrace;
declare class DartDuration implements DartComparable<DartDuration> {
    static ZERO: DartDuration;
    protected _duration: int;
    /**
     * Creates a new Duration object whose value
     * is the sum of all individual parts.
     *
     * Individual parts can be larger than the next-bigger unit.
     * For example, [hours] can be greater than 23.
     *
     * All individual parts are allowed to be negative.
     * All arguments are 0 by default.
     */
    protected _init(_?: {
        days?: int;
        hours?: int;
        minutes?: int;
        seconds?: int;
        milliseconds?: int;
        microseconds?: int;
    }): void;
    constructor(_?: {
        days?: int;
        hours?: int;
        minutes?: int;
        seconds?: int;
        milliseconds?: int;
        microseconds?: int;
    });
    protected _microseconds(_duration: int): void;
    protected static _microseconds: new (_duration: int) => DartDuration;
    /**
     * Adds this Duration and [other] and
     * returns the sum as a new Duration object.
     */
    plus(other: DartDuration): DartDuration;
    /**
     * Subtracts [other] from this Duration and
     * returns the difference as a new Duration object.
     */
    minus(other: DartDuration): DartDuration;
    /**
     * Multiplies this Duration by the given [factor] and returns the result
     * as a new Duration object.
     *
     * Note that when [factor] is a double, and the duration is greater than
     * 53 bits, precision is lost because of double-precision arithmetic.
     */
    multiply(factor: num): DartDuration;
    /**
     * Divides this Duration by the given [quotient] and returns the truncated
     * result as a new Duration object.
     *
     * Throws an [IntegerDivisionByZeroException] if [quotient] is `0`.
     */
    divide(quotient: int): DartDuration;
    /**
     * Returns `true` if the value of this Duration
     * is less than the value of [other].
     */
    isLessThan(other: DartDuration): bool;
    /**
     * Returns `true` if the value of this Duration
     * is greater than the value of [other].
     */
    isGreaterThan(other: DartDuration): bool;
    /**
     * Returns `true` if the value of this Duration
     * is less than or equal to the value of [other].
     */
    isLessOrEqual(other: DartDuration): bool;
    /**
     * Returns `true` if the value of this Duration
     * is greater than or equal to the value of [other].
     */
    isGreaterOrEqual(other: DartDuration): bool;
    /**
     * Returns the number of whole days spanned by this Duration.
     */
    readonly inDays: int;
    /**
     * Returns the number of whole hours spanned by this Duration.
     *
     * The returned value can be greater than 23.
     */
    readonly inHours: int;
    /**
     * Returns the number of whole minutes spanned by this Duration.
     *
     * The returned value can be greater than 59.
     */
    readonly inMinutes: int;
    /**
     * Returns the number of whole seconds spanned by this Duration.
     *
     * The returned value can be greater than 59.
     */
    readonly inSeconds: int;
    /**
     * Returns number of whole milliseconds spanned by this Duration.
     *
     * The returned value can be greater than 999.
     */
    readonly inMilliseconds: int;
    /**
     * Returns number of whole microseconds spanned by this Duration.
     */
    readonly inMicroseconds: int;
    /**
     * Returns `true` if this Duration is the same object as [other].
     */
    equals(other: any): bool;
    readonly hashCode: int;
    /**
     * Compares this Duration to [other], returning zero if the values are equal.
     *
     * Returns a negative integer if this `Duration` is shorter than
     * [other], or a positive integer if it is longer.
     *
     * A negative `Duration` is always considered shorter than a positive one.
     *
     * It is always the case that `duration1.compareTo(duration2) < 0` iff
     * `(someDate + duration1).compareTo(someDate + duration2) < 0`.
     */
    compareTo(other: DartDuration): int;
    /**
     * Returns a string representation of this `Duration`.
     *
     * Returns a string with hours, minutes, seconds, and microseconds, in the
     * following format: `HH:MM:SS.mmmmmm`. For example,
     *
     *     var d = new Duration(days:1, hours:1, minutes:33, microseconds: 500);
     *     d.toString();  // "25:33:00.000500"
     */
    toString(): string;
    /**
     * Returns whether this `Duration` is negative.
     *
     * A negative `Duration` represents the difference from a later time to an
     * earlier time.
     */
    readonly isNegative: bool;
    /**
     * Returns a new `Duration` representing the absolute value of this
     * `Duration`.
     *
     * The returned `Duration` has the same length as this one, but is always
     * positive.
     */
    abs(): DartDuration;
    /**
     * Returns a new `Duration` representing this `Duration` negated.
     *
     * The returned `Duration` has the same length as this one, but will have the
     * opposite sign of this one.
     */
    negate(): DartDuration;
}
declare class DartIntegerDivisionByZeroException extends DartError {
    constructor();
    toString(): string;
}
/**
 * A simple stopwatch interface to measure elapsed time.
 */
declare class DartStopwatch {
    /**
     * Cached frequency of the system. Must be initialized in [_initTicker];
     */
    static _frequency: int;
    _start: int;
    _stop: int;
    /**
     * Creates a [Stopwatch] in stopped state with a zero elapsed count.
     *
     * The following example shows how to start a [Stopwatch]
     * immediately after allocation.
     * ```
     * var stopwatch = new Stopwatch()..start();
     * ```
     */
    constructor();
    /**
     * Frequency of the elapsed counter in Hz.
     */
    readonly frequency: int;
    /**
     * Starts the [Stopwatch].
     *
     * The [elapsed] count is increasing monotonically. If the [Stopwatch] has
     * been stopped, then calling start again restarts it without resetting the
     * [elapsed] count.
     *
     * If the [Stopwatch] is currently running, then calling start does nothing.
     */
    start(): void;
    /**
     * Stops the [Stopwatch].
     *
     * The [elapsedTicks] count stops increasing after this call. If the
     * [Stopwatch] is currently not running, then calling this method has no
     * effect.
     */
    stop(): void;
    /**
     * Resets the [elapsed] count to zero.
     *
     * This method does not stop or start the [Stopwatch].
     */
    reset(): void;
    /**
     * The elapsed number of clock ticks since calling [start] while the
     * [Stopwatch] is running.
     *
     * This is the elapsed number of clock ticks between calling [start] and
     * calling [stop].
     *
     * Is 0 if the [Stopwatch] has never been started.
     *
     * The elapsed number of clock ticks increases by [frequency] every second.
     */
    readonly elapsedTicks: int;
    /**
     * The [elapsedTicks] counter converted to a [Duration].
     */
    readonly elapsed: DartDuration;
    /**
     * The [elapsedTicks] counter converted to microseconds.
     */
    readonly elapsedMicroseconds: int;
    /**
     * The [elapsedTicks] counter converted to milliseconds.
     */
    readonly elapsedMilliseconds: int;
    /**
     * Whether the [Stopwatch] is currently running.
     */
    readonly isRunning: bool;
    /**
     * Initializes the time-measuring system. *Must* initialize the [_frequency]
     * variable.
     */
    static _initTicker(): void;
    static _now(): int;
}
/**
 * An instant in time, such as July 20, 1969, 8:18pm GMT.
 *
 * Create a DateTime object by using one of the constructors
 * or by parsing a correctly formatted string,
 * which complies with a subset of ISO 8601.
 * Note that hours are specified between 0 and 23,
 * as in a 24-hour clock.
 * For example:
 *
 *     DateTime now = new DateTime.now();
 *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
 *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");  // 8:18pm
 *
 * A DateTime object is anchored either in the UTC time zone
 * or in the local time zone of the current computer
 * when the object is created.
 *
 * Once created, neither the value nor the time zone
 * of a DateTime object may be changed.
 *
 * You can use properties to get
 * the individual units of a DateTime object.
 *
 *     assert(berlinWallFell.month == 11);
 *     assert(moonLanding.hour == 20);
 *
 * For convenience and readability,
 * the DateTime class provides a constant for each day and month
 * name&mdash;for example, [AUGUST] and [FRIDAY].
 * You can use these constants to improve code readability:
 *
 *     DateTime berlinWallFell = new DateTime(1989, DateTime.NOVEMBER, 9);
 *     assert(berlinWallFell.weekday == DateTime.THURSDAY);
 *
 * Day and month values begin at 1, and the week starts on Monday.
 * That is, the constants [JANUARY] and [MONDAY] are both 1.
 *
 * ## Working with UTC and local time
 *
 * A DateTime object is in the local time zone
 * unless explicitly created in the UTC time zone.
 *
 *     DateTime dDay = new DateTime.utc(1944, 6, 6);
 *
 * Use [isUtc] to determine whether a DateTime object is based in UTC.
 * Use the methods [toLocal] and [toUtc]
 * to get the equivalent date/time value specified in the other time zone.
 * Use [timeZoneName] to get an abbreviated name of the time zone
 * for the DateTime object.
 * To find the difference
 * between UTC and the time zone of a DateTime object
 * call [timeZoneOffset].
 *
 * ## Comparing DateTime objects
 *
 * The DateTime class contains several handy methods,
 * such as [isAfter], [isBefore], and [isAtSameMomentAs],
 * for comparing DateTime objects.
 *
 *     assert(berlinWallFell.isAfter(moonLanding) == true);
 *     assert(berlinWallFell.isBefore(moonLanding) == false);
 *
 * ## Using DateTime with Duration
 *
 * Use the [add] and [subtract] methods with a [Duration] object
 * to create a new DateTime object based on another.
 * For example, to find the date that is sixty days after today, write:
 *
 *     DateTime today = new DateTime.now();
 *     DateTime sixtyDaysFromNow = today.add(new Duration(days: 60));
 *
 * To find out how much time is between two DateTime objects use
 * [difference], which returns a [Duration] object:
 *
 *     Duration difference = berlinWallFell.difference(moonLanding)
 *     assert(difference.inDays == 7416);
 *
 * The difference between two dates in different time zones
 * is just the number of nanoseconds between the two points in time.
 * It doesn't take calendar days into account.
 * That means that the difference between two midnights in local time may be
 * less than 24 hours times the number of days between them,
 * if there is a daylight saving change in between.
 * If the difference above is calculated using Australian local time, the
 * difference is 7415 days and 23 hours, which is only 7415 whole days as
 * reported by `inDays`.
 *
 * ## Other resources
 *
 * See [Duration] to represent a span of time.
 * See [Stopwatch] to measure timespans.
 *
 * The DateTime class does not provide internationalization.
 * To internationalize your code, use
 * the [intl](http://pub.dartlang.org/packages/intl) package.
 *
 */
declare class DartDateTime extends DartObject implements DartComparable<DartDateTime> {
    static MONDAY: number;
    static TUESDAY: number;
    static WEDNESDAY: number;
    static THURSDAY: number;
    static FRIDAY: number;
    static SATURDAY: number;
    static SUNDAY: number;
    static DAYS_PER_WEEK: number;
    static JANUARY: number;
    static FEBRUARY: number;
    static MARCH: number;
    static APRIL: number;
    static MAY: number;
    static JUNE: number;
    static JULY: number;
    static AUGUST: number;
    static SEPTEMBER: number;
    static OCTOBER: number;
    static NOVEMBER: number;
    static DECEMBER: number;
    static MONTHS_PER_YEAR: number;
    /**
     * The value of this DateTime.
     *
     * The content of this field is implementation dependent. On JavaScript it is
     * equal to [millisecondsSinceEpoch]. On the VM it is equal to
     * [microsecondsSinceEpoch].
     */
    _value: int;
    /**
     * True if this [DateTime] is set to UTC time.
     *
     *     DateTime dDay = new DateTime.utc(1944, 6, 6);
     *     assert(dDay.isUtc);
     *
     */
    isUtc: bool;
    /**
     * Constructs a [DateTime] instance specified in the local time zone.
     *
     * For example,
     * to create a new DateTime object representing April 29, 2014, 6:04am:
     *
     *     DateTime annularEclipse = new DateTime(2014, DateTime.APRIL, 29, 6, 4);
     */
    protected DartDateTime(year: int, month?: int, day?: int, hour?: int, minute?: int, second?: int, millisecond?: int, microsecond?: int): void;
    constructor(year: int, month?: int, day?: int, hour?: int, minute?: int, second?: int, millisecond?: int, microsecond?: int);
    /**
     * Constructs a [DateTime] instance specified in the UTC time zone.
     *
     *     DateTime dDay = new DateTime.utc(1944, DateTime.JUNE, 6);
     */
    protected utc(year: int, month?: int, day?: int, hour?: int, minute?: int, second?: int, millisecond?: int, microsecond?: int): void;
    static utc: new (year: int, month?: int, day?: int, hour?: int, minute?: int, second?: int, millisecond?: int, microsecond?: int) => DartDateTime;
    /**
     * Constructs a [DateTime] instance with current date and time in the
     * local time zone.
     *
     *     DateTime thisInstant = new DateTime.now();
     *
     */
    protected now(): void;
    static now: new () => DartDateTime;
    /**
     * Constructs a new [DateTime] instance based on [formattedString].
     *
     * Throws a [FormatException] if the input cannot be parsed.
     *
     * The function parses a subset of ISO 8601
     * which includes the subset accepted by RFC 3339.
     *
     * The accepted inputs are currently:
     *
     * * A date: A signed four-to-six digit year, two digit month and
     *   two digit day, optionally separated by `-` characters.
     *   Examples: "19700101", "-0004-12-24", "81030-04-01".
     * * An optional time part, separated from the date by either `T` or a space.
     *   The time part is a two digit hour,
     *   then optionally a two digit minutes value,
     *   then optionally a two digit seconds value, and
     *   then optionally a '.' followed by a one-to-six digit second fraction.
     *   The minutes and seconds may be separated from the previous parts by a
     *   ':'.
     *   Examples: "12", "12:30:24.124", "123010.50".
     * * An optional time-zone offset part,
     *   possibly separated from the previous by a space.
     *   The time zone is either 'z' or 'Z', or it is a signed two digit hour
     *   part and an optional two digit minute part. The sign must be either
     *   "+" or "-", and can not be omitted.
     *   The minutes may be separated from the hours by a ':'.
     *   Examples: "Z", "-10", "01:30", "1130".
     *
     * This includes the output of both [toString] and [toIso8601String], which
     * will be parsed back into a `DateTime` object with the same time as the
     * original.
     *
     * The result is always in either local time or UTC.
     * If a time zone offset other than UTC is specified,
     * the time is converted to the equivalent UTC time.
     *
     * Examples of accepted strings:
     *
     * * `"2012-02-27 13:27:00"`
     * * `"2012-02-27 13:27:00.123456z"`
     * * `"20120227 13:27:00"`
     * * `"20120227T132700"`
     * * `"20120227"`
     * * `"+20120227"`
     * * `"2012-02-27T14Z"`
     * * `"2012-02-27T14+00:00"`
     * * `"-123450101 00:00:00 Z"`: in the year -12345.
     * * `"2002-02-27T14:00:00-0500"`: Same as `"2002-02-27T19:00:00Z"`
     */
    static parse(formattedString: string): DartDateTime;
    static _MAX_MILLISECONDS_SINCE_EPOCH: number;
    /**
     * Constructs a new [DateTime] instance
     * with the given [millisecondsSinceEpoch].
     *
     * If [isUtc] is false then the date is in the local time zone.
     *
     * The constructed [DateTime] represents
     * 1970-01-01T00:00:00Z + [millisecondsSinceEpoch] ms in the given
     * time zone (local or UTC).
     */
    protected fromMillisecondsSinceEpoch(millisecondsSinceEpoch: int, _?: {
        isUtc?: bool;
    }): void;
    static fromMillisecondsSinceEpoch: new (millisecondsSinceEpoch: int, _?: {
        isUtc?: bool;
    }) => DartDateTime;
    /**
     * Constructs a new [DateTime] instance
     * with the given [microsecondsSinceEpoch].
     *
     * If [isUtc] is false then the date is in the local time zone.
     *
     * The constructed [DateTime] represents
     * 1970-01-01T00:00:00Z + [microsecondsSinceEpoch] us in the given
     * time zone (local or UTC).
     */
    protected fromMicrosecondsSinceEpoch(microsecondsSinceEpoch: int, _?: {
        isUtc?: bool;
    }): void;
    static fromMicrosecondsSinceEpoch: new (microsecondsSinceEpoch: int, _?: {
        isUtc?: bool;
    }) => DartDateTime;
    /**
     * Constructs a new [DateTime] instance with the given value.
     *
     * If [isUtc] is false then the date is in the local time zone.
     */
    protected _withValue(_value: int, _?: {
        isUtc: bool;
    }): void;
    static _withValue: new (_value: int, _?: {
        isUtc: bool;
    }) => DartDateTime;
    /**
     * Returns true if [other] is a [DateTime] at the same moment and in the
     * same time zone (UTC or local).
     *
     *     DateTime dDayUtc   = new DateTime.utc(1944, DateTime.JUNE, 6);
     *     DateTime dDayLocal = new DateTime(1944, DateTime.JUNE, 6);
     *
     *     assert(dDayUtc.isAtSameMomentAs(dDayLocal) == false);
     *
     * See [isAtSameMomentAs] for a comparison that adjusts for time zone.
     */
    equals(other: any): bool;
    /**
     * Returns true if [this] occurs before [other].
     *
     * The comparison is independent
     * of whether the time is in UTC or in the local time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isBefore(moonLanding) == false);
     *
     */
    isBefore(other: DartDateTime): bool;
    /**
     * Returns true if [this] occurs after [other].
     *
     * The comparison is independent
     * of whether the time is in UTC or in the local time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isAfter(moonLanding) == true);
     *
     */
    isAfter(other: DartDateTime): bool;
    /**
     * Returns true if [this] occurs at the same moment as [other].
     *
     * The comparison is independent of whether the time is in UTC or in the local
     * time zone.
     *
     *     DateTime berlinWallFell = new DateTime(1989, 11, 9);
     *     DateTime moonLanding    = DateTime.parse("1969-07-20 20:18:00");
     *
     *     assert(berlinWallFell.isAtSameMomentAs(moonLanding) == false);
     */
    isAtSameMomentAs(other: DartDateTime): bool;
    /**
     * Compares this DateTime object to [other],
     * returning zero if the values are equal.
     *
     * This function returns a negative integer
     * if this DateTime is smaller (earlier) than [other],
     * or a positive integer if it is greater (later).
     */
    compareTo(other: DartDateTime): int;
    readonly hashCode: int;
    /**
     * Returns this DateTime value in the local time zone.
     *
     * Returns [this] if it is already in the local time zone.
     * Otherwise this method is equivalent to:
     *
     *     new DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch,
     *                                             isUtc: false)
     */
    toLocal(): DartDateTime;
    /**
     * Returns this DateTime value in the UTC time zone.
     *
     * Returns [this] if it is already in UTC.
     * Otherwise this method is equivalent to:
     *
     *     new DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch,
     *                                             isUtc: true)
     */
    toUtc(): DartDateTime;
    static _fourDigits(n: int): string;
    static _sixDigits(n: int): string;
    static _threeDigits(n: int): string;
    static _twoDigits(n: int): string;
    /**
     * Returns a human-readable string for this instance.
     *
     * The returned string is constructed for the time zone of this instance.
     * The `toString()` method provides a simply formatted string.
     * It does not support internationalized strings.
     * Use the [intl](http://pub.dartlang.org/packages/intl) package
     * at the pub shared packages repo.
     *
     * The resulting string can be parsed back using [parse].
     */
    toString(): string;
    /**
     * Returns an ISO-8601 full-precision extended format representation.
     *
     * The format is `yyyy-MM-ddTHH:mm:ss.mmmuuuZ` for UTC time, and
     * `yyyy-MM-ddTHH:mm:ss.mmmuuu` (no trailing "Z") for local/non-UTC time,
     * where:
     *
     * * `yyyy` is a, possibly negative, four digit representation of the year,
     *   if the year is in the range -9999 to 9999,
     *   otherwise it is a signed six digit representation of the year.
     * * `MM` is the month in the range 01 to 12,
     * * `dd` is the day of the month in the range 01 to 31,
     * * `HH` are hours in the range 00 to 23,
     * * `mm` are minutes in the range 00 to 59,
     * * `ss` are seconds in the range 00 to 59 (no leap seconds),
     * * `mmm` are milliseconds in the range 000 to 999, and
     * * `uuu` are microseconds in the range 001 to 999. If [microsecond] equals
     *   0, then this part is omitted.
     *
     * The resulting string can be parsed back using [parse].
     */
    toIso8601String(): string;
    /**
     * Returns a new [DateTime] instance with [duration] added to [this].
     *
     *     DateTime today = new DateTime.now();
     *     DateTime fiftyDaysFromNow = today.add(new Duration(days: 50));
     *
     * Notice that the duration being added is actually 50 * 24 * 60 * 60
     * seconds. If the resulting `DateTime` has a different daylight saving offset
     * than `this`, then the result won't have the same time-of-day as `this`, and
     * may not even hit the calendar date 50 days later.
     *
     * Be careful when working with dates in local time.
     */
    add(duration: DartDuration): DartDateTime;
    /**
     * Returns a new [DateTime] instance with [duration] subtracted from [this].
     *
     *     DateTime today = new DateTime.now();
     *     DateTime fiftyDaysAgo = today.subtract(new Duration(days: 50));
     *
     * Notice that the duration being subtracted is actually 50 * 24 * 60 * 60
     * seconds. If the resulting `DateTime` has a different daylight saving offset
     * than `this`, then the result won't have the same time-of-day as `this`, and
     * may not even hit the calendar date 50 days earlier.
     *
     * Be careful when working with dates in local time.
     */
    subtract(duration: DartDuration): DartDateTime;
    /**
     * Returns a [Duration] with the difference between [this] and [other].
     *
     *     DateTime berlinWallFell = new DateTime.utc(1989, DateTime.NOVEMBER, 9);
     *     DateTime dDay = new DateTime.utc(1944, DateTime.JUNE, 6);
     *
     *     Duration difference = berlinWallFell.difference(dDay);
     *     assert(difference.inDays == 16592);
     *
     * The difference is measured in seconds and fractions of seconds.
     * The difference above counts the number of fractional seconds between
     * midnight at the beginning of those dates.
     * If the dates above had been in local time, not UTC, then the difference
     * between two midnights may not be a multiple of 24 hours due to daylight
     * saving differences.
     *
     * For example, in Australia, similar code using local time instead of UTC:
     *
     *     DateTime berlinWallFell = new DateTime(1989, DateTime.NOVEMBER, 9);
     *     DateTime dDay = new DateTime(1944, DateTime.JUNE, 6);
     *     Duration difference = berlinWallFell.difference(dDay);
     *     assert(difference.inDays == 16592);
     *
     * will fail because the difference is actually 16591 days and 23 hours, and
     * [Duration.inDays] only returns the number of whole days.
     */
    difference(other: DartDateTime): DartDuration;
    protected _internal(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, microsecond: int, isUtc: bool): void;
    static _internal: new (year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, microsecond: int, isUtc: bool) => DartDateTime;
    protected _now(): void;
    static _now: new () => DartDateTime;
    static _brokenDownDateToValue(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, microsecond: int, isUtc: bool): int;
    /**
     * The number of milliseconds since
     * the "Unix epoch" 1970-01-01T00:00:00Z (UTC).
     *
     * This value is independent of the time zone.
     *
     * This value is at most
     * 8,640,000,000,000,000ms (100,000,000 days) from the Unix epoch.
     * In other words: `millisecondsSinceEpoch.abs() <= 8640000000000000`.
     */
    readonly millisecondsSinceEpoch: int;
    /**
     * The number of microseconds since
     * the "Unix epoch" 1970-01-01T00:00:00Z (UTC).
     *
     * This value is independent of the time zone.
     *
     * This value is at most
     * 8,640,000,000,000,000,000us (100,000,000 days) from the Unix epoch.
     * In other words: `microsecondsSinceEpoch.abs() <= 8640000000000000000`.
     *
     * Note that this value does not fit into 53 bits (the size of a IEEE double).
     * A JavaScript number is not able to hold this value.
     */
    readonly microsecondsSinceEpoch: int;
    /**
     * The time zone name.
     *
     * This value is provided by the operating system and may be an
     * abbreviation or a full name.
     *
     * In the browser or on Unix-like systems commonly returns abbreviations,
     * such as "CET" or "CEST". On Windows returns the full name, for example
     * "Pacific Standard Time".
     */
    readonly timeZoneName: string;
    /**
     * The time zone offset, which
     * is the difference between local time and UTC.
     *
     * The offset is positive for time zones east of UTC.
     *
     * Note, that JavaScript, Python and C return the difference between UTC and
     * local time. Java, C# and Ruby return the difference between local time and
     * UTC.
     */
    readonly timeZoneOffset: DartDuration;
    /**
     * The year.
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00"){         throw 'external';     }
     *     assert(moonLanding.year == 1969){         throw 'external';     }
     */
    readonly year: int;
    /**
     * The month [1..12].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.month == 7);
     *     assert(moonLanding.month == DateTime.JULY);
     */
    readonly month: int;
    /**
     * The day of the month [1..31].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.day == 20);
     */
    readonly day: int;
    /**
     * The hour of the day, expressed as in a 24-hour clock [0..23].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.hour == 20);
     */
    readonly hour: int;
    /**
     * The minute [0...59].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.minute == 18);
     */
    readonly minute: int;
    /**
     * The second [0...59].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.second == 0);
     */
    readonly second: int;
    /**
     * The millisecond [0...999].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.millisecond == 0);
     */
    readonly millisecond: int;
    /**
     * The microsecond [0...999].
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.microsecond == 0);
     */
    readonly microsecond: int;
    /**
     * The day of the week [MONDAY]..[SUNDAY].
     *
     * In accordance with ISO 8601
     * a week starts with Monday, which has the value 1.
     *
     *     DateTime moonLanding = DateTime.parse("1969-07-20 20:18:00");
     *     assert(moonLanding.weekday == 7);
     *     assert(moonLanding.weekday == DateTime.SUNDAY);
     *
     */
    readonly weekday: int;
    static _microsecondInRoundedMilliseconds(microsecond: int): int;
}
/**
 * An interface for basic searches within strings.
 */
declare class DartPattern {
    /**
     * Match this pattern against the string repeatedly.
     *
     * If [start] is provided, matching will start at that index.
     *
     * The returned iterable lazily computes all the non-overlapping matches
     * of the pattern on the string, ordered by start index.
     * If a user only requests the first
     * match, this function should not compute all possible matches.
     *
     * The matches are found by repeatedly finding the first match
     * of the pattern on the string, starting from the end of the previous
     * match, and initially starting from index zero.
     *
     * If the pattern matches the empty string at some point, the next
     * match is found by starting at the previous match's end plus one.
     */
    allMatches(string: string, start?: int): DartIterable<DartMatch>;
    /**
     * Match this pattern against the start of `string`.
     *
     * If [start] is provided, it must be an integer in the range `0` ..
     * `string.length`. In that case, this patten is tested against the
     * string at the [start] position. That is, a [Match] is returned if the
     * pattern can match a part of the string starting from position [start].
     * Returns `null` if the pattern doesn't match.
     */
    matchAsPrefix(string: string, start?: int): DartMatch;
}
/**
 * A result from searching within a string.
 *
 * A Match or an [Iterable] of Match objects is returned from [Pattern]
 * matching methods.
 *
 * The following example finds all matches of a [RegExp] in a [String]
 * and iterates through the returned iterable of Match objects.
 *
 *     RegExp exp = new RegExp(r"(\w+)");
 *     String str = "Parse my string";
 *     Iterable<Match> matches = exp.allMatches(str);
 *     for (Match m in matches) {
 *       String match = m.group(0);
 *       print(match);
 *     }
 *
 * The output of the example is:
 *
 *     Parse
 *     my
 *     string
 *
 * Some patterns, regular expressions in particular, may record substrings
 * that were part of the matching. These are called _groups_ in the Match
 * object. Some patterns may never have any groups, and their matches always
 * have zero [groupCount].
 */
declare class DartMatch {
    /**
     * Returns the index in the string where the match starts.
     */
    readonly start: int;
    /**
     * Returns the index in the string after the last character of the
     * match.
     */
    readonly end: int;
    /**
     * Returns the string matched by the given [group].
     *
     * If [group] is 0, returns the match of the pattern.
     *
     * The result may be `null` if the pattern didn't assign a value to it
     * as part of this match.
     */
    group(group: int): string;
    /**
     * Returns the string matched by the given [group].
     *
     * If [group] is 0, returns the match of the pattern.
     *
     * Short alias for [Match.group].
     */
    /**
     * Returns a list of the groups with the given indices.
     *
     * The list contains the strings returned by [group] for each index in
     * [groupIndices].
     */
    groups(groupIndices: DartList<int>): DartList<string>;
    /**
     * Returns the number of captured groups in the match.
     *
     * Some patterns may capture parts of the input that was used to
     * compute the full match. This is the number of captured groups,
     * which is also the maximal allowed argument to the [group] method.
     */
    readonly groupCount: int;
    /**
     * The string on which this match was computed.
     */
    readonly input: string;
    /**
     * The pattern used to search in [input].
     */
    readonly pattern: DartPattern;
}
/**
 * A regular expression pattern.
 *
 * Regular expressions are [Pattern]s, and can as such be used to match strings
 * or parts of strings.
 *
 * Dart regular expressions have the same syntax and semantics as
 * JavaScript regular expressions. See
 * <http://ecma-international.org/ecma-262/5.1/#sec-15.10>
 * for the specification of JavaScript regular expressions.
 *
 * [firstMatch] is the main implementation method that applies a regular
 * expression to a string and returns the first [Match]. All
 * other methods in [RegExp] can build on it.
 *
 * Use [allMatches] to look for all matches of a regular expression in
 * a string.
 *
 * The following example finds all matches of a regular expression in
 * a string.
 *
 *     RegExp exp = new RegExp(r"(\w+)");
 *     String str = "Parse my string";
 *     Iterable<Match> matches = exp.allMatches(str);
 *
 * Note the use of a _raw string_ (a string prefixed with `r`)
 * in the example above. Use a raw string to treat each character in a string
 * as a literal character.
 */
declare class DartRegExp implements DartPattern {
    matchAsPrefix(string: string, start?: number): DartMatch;
    /**
     * Constructs a regular expression.
     *
     * Throws a [FormatException] if [source] is not valid regular
     * expression syntax.
     */
    protected static _create(source: string, _?: {
        multiLine?: bool;
        caseSensitive?: bool;
    }): DartRegExp;
    constructor(source: string, _?: {
        multiLine?: bool;
        caseSensitive?: bool;
    });
    /**
     * Searches for the first match of the regular expression
     * in the string [input]. Returns `null` if there is no match.
     */
    firstMatch(input: string): DartMatch;
    /**
     * Returns an iterable of the matches of the regular expression on [input].
     *
     * If [start] is provided, only start looking for matches at `start`.
     */
    allMatches(input: string, start?: int): DartIterable<DartMatch>;
    /**
     * Returns whether the regular expression has a match in the string [input].
     */
    hasMatch(input: string): bool;
    /**
     * Returns the first substring match of this regular expression in [input].
     */
    stringMatch(input: string): string;
    /**
     * The source regular expression string used to create this `RegExp`.
     */
    readonly pattern: string;
    /**
     * Whether this regular expression matches multiple lines.
     *
     * If the regexp does match multiple lines, the "^" and "$" characters
     * match the beginning and end of lines. If not, the character match the
     * beginning and end of the input.
     */
    readonly isMultiLine: bool;
    /**
     * Whether this regular expression is case sensitive.
     *
     * If the regular expression is not case sensitive, it will match an input
     * letter with a pattern letter even if the two letters are different case
     * versions of the same letter.
     */
    readonly isCaseSensitive: bool;
}
/**
 * A sequence of characters.
 *
 * A string can be either single or multiline. Single line strings are
 * written using matching single or double quotes, and multiline strings are
 * written using triple quotes. The following are all valid Dart strings:
 *
 *     'Single quotes';
 *     "Double quotes";
 *     'Double quotes in "single" quotes';
 *     "Single quotes in 'double' quotes";
 *
 *     '''A
 *     multiline
 *     string''';
 *
 *     """
 *     Another
 *     multiline
 *     string""";
 *
 * Strings are immutable. Although you cannot change a string, you can perform
 * an operation on a string and assign the result to a new string:
 *
 *     var string = 'Dart is fun';
 *     var newString = string.substring(0, 5);
 *
 * You can use the plus (`+`) operator to concatenate strings:
 *
 *     'Dart ' + 'is ' + 'fun!'; // 'Dart is fun!'
 *
 * You can also use adjacent string literals for concatenation:
 *
 *     'Dart ' 'is ' 'fun!';    // 'Dart is fun!'
 *
 * You can use `${}` to interpolate the value of Dart expressions
 * within strings. The curly braces can be omitted when evaluating identifiers:
 *
 *     string = 'dartlang';
 *     '$string has ${string.length} letters'; // 'dartlang has 8 letters'
 *
 * A string is represented by a sequence of Unicode UTF-16 code units
 * accessible through the [codeUnitAt] or the [codeUnits] members:
 *
 *     string = 'Dart';
 *     string.codeUnitAt(0); // 68
 *     string.codeUnits;     // [68, 97, 114, 116]
 *
 * The string representation of code units is accessible through the index
 * operator:
 *
 *     string[0];            // 'D'
 *
 * The characters of a string are encoded in UTF-16. Decoding UTF-16, which
 * combines surrogate pairs, yields Unicode code points. Following a similar
 * terminology to Go, we use the name 'rune' for an integer representing a
 * Unicode code point. Use the [runes] property to get the runes of a string:
 *
 *     string.runes.toList(); // [68, 97, 114, 116]
 *
 * For a character outside the Basic Multilingual Plane (plane 0) that is
 * composed of a surrogate pair, [runes] combines the pair and returns a
 * single integer.  For example, the Unicode character for a
 * musical G-clef ('𝄞') with rune value 0x1D11E consists of a UTF-16 surrogate
 * pair: `0xD834` and `0xDD1E`. Using [codeUnits] returns the surrogate pair,
 * and using `runes` returns their combined value:
 *
 *     var clef = '\u{1D11E}';
 *     clef.codeUnits;         // [0xD834, 0xDD1E]
 *     clef.runes.toList();    // [0x1D11E]
 *
 * The String class can not be extended or implemented. Attempting to do so
 * yields a compile-time error.
 *
 * ## Other resources
 *
 * See [StringBuffer] to efficiently build a string incrementally. See
 * [RegExp] to work with regular expressions.
 *
 * Also see:

 * * [Dart Cookbook](https://www.dartlang.org/docs/cookbook/#strings)
 *   for String examples and recipes.
 * * [Dart Up and Running](https://www.dartlang.org/docs/dart-up-and-running/ch03.html#strings-and-regular-expressions)
 */
declare class DartString implements DartComparable<DartString>, DartPattern {
    protected static fromJs(s: string): DartString;
    constructor(s: string);
    valueOf(): string;
    /**
     * Allocates a new String for the specified [charCodes].
     *
     * The [charCodes] can be UTF-16 code units or runes. If a char-code value is
     * 16-bit, it is copied verbatim:
     *
     *     new String.fromCharCodes([68]); // 'D'
     *
     * If a char-code value is greater than 16-bits, it is decomposed into a
     * surrogate pair:
     *
     *     var clef = new String.fromCharCodes([0x1D11E]);
     *     clef.codeUnitAt(0); // 0xD834
     *     clef.codeUnitAt(1); // 0xDD1E
     *
     * If [start] and [end] is provided, only the values of [charCodes]
     * at positions from `start` to, but not including, `end`, are used.
     * The `start` and `end` values must satisfy
     * `0 <= start <= end <= charCodes.length`.
     */
    protected static _fromCharCodes(charCodes: DartIterable<int> | Array<int>, start?: int, end?: int): DartString;
    static fromCharCodes: new (charCodes: DartIterable<int> | Array<int>, start?: int, end?: int) => DartString;
    /**
     * Allocates a new String for the specified [charCode].
     *
     * If the [charCode] can be represented by a single UTF-16 code unit, the new
     * string contains a single code unit. Otherwise, the [length] is 2 and
     * the code units form a surrogate pair. See documentation for
     * [fromCharCodes].
     *
     * Creating a String with half of a surrogate pair is allowed.
     */
    protected static _fromCharCode(charCode: int): DartString;
    static fromCharCode: new (charCode: int) => DartString;
    /**
     * Returns the string value of the environment declaration [name].
     *
     * Environment declarations are provided by the surrounding system compiling
     * or running the Dart program. Declarations map a string key to a string
     * value.
     *
     * If [name] is not declared in the environment, the result is instead
     * [defaultValue].
     *
     * Example of getting a value:
     *
     *     const String.fromEnvironment("defaultFloo", defaultValue: "no floo")
     *
     * Example of checking whether a declaration is there at all:
     *
     *     var isDeclared = const String.fromEnvironment("maybeDeclared") != null;
     */
    protected static _fromEnvironment(name: string, _?: {
        defaultValue?: string;
    }): DartString;
    static fromEnvironment: new (name: string, _?: {
        defaultValue?: string;
    }) => DartString;
    /**
     * Gets the character (as a single-code-unit [String]) at the given [index].
     *
     * The returned string represents exactly one UTF-16 code unit, which may be
     * half of a surrogate pair. A single member of a surrogate pair is an
     * invalid UTF-16 string:
     *
     *     var clef = '\u{1D11E}';
     *     // These represent invalid UTF-16 strings.
     *     clef[0].codeUnits;      // [0xD834]
     *     clef[1].codeUnits;      // [0xDD1E]
     *
     * This method is equivalent to
     * `new String.fromCharCode(this.codeUnitAt(index))`.
     */
    charAt(index: int): string;
    /**
     * Returns the 16-bit UTF-16 code unit at the given [index].
     */
    codeUnitAt(index: int): int;
    /**
     * The length of the string.
     *
     * Returns the number of UTF-16 code units in this string. The number
     * of [runes] might be fewer, if the string contains characters outside
     * the Basic Multilingual Plane (plane 0):
     *
     *     'Dart'.length;          // 4
     *     'Dart'.runes.length;    // 4
     *
     *     var clef = '\u{1D11E}';
     *     clef.length;            // 2
     *     clef.runes.length;      // 1
     */
    readonly length: int;
    /**
     * Returns a hash code derived from the code units of the string.
     *
     * This is compatible with [==]. Strings with the same sequence
     * of code units have the same hash code.
     */
    readonly hashCode: int;
    /**
     * Returns true if other is a `String` with the same sequence of code units.
     *
     * This method compares each individual code unit of the strings.
     * It does not check for Unicode equivalence.
     * For example, both the following strings represent the string 'Amélie',
     * but due to their different encoding, are not equal:
     *
     *     'Am\xe9lie' == 'Ame\u{301}lie'; // false
     *
     * The first string encodes 'é' as a single unicode code unit (also
     * a single rune), whereas the second string encodes it as 'e' with the
     * combining accent character '◌́'.
     */
    equals(other: any): bool;
    /**
     * Returns true if this string ends with [other]. For example:
     *
     *     'Dart'.endsWith('t'); // true
     */
    endsWith(other: string): bool;
    /**
     * Returns true if this string starts with a match of [pattern].
     *
     *     var string = 'Dart';
     *     string.startsWith('D');                       // true
     *     string.startsWith(new RegExp(r'[A-Z][a-z]')); // true
     *
     * If [index] is provided, this method checks if the substring starting
     * at that index starts with a match of [pattern]:
     *
     *     string.startsWith('art', 1);                  // true
     *     string.startsWith(new RegExp(r'\w{3}'));      // true
     *
     * [index] must not be negative or greater than [length].
     *
     * A [RegExp] containing '^' does not match if the [index] is greater than
     * zero. The pattern works on the string as a whole, and does not extract
     * a substring starting at [index] first:
     *
     *     string.startsWith(new RegExp(r'^art'), 1);    // false
     *     string.startsWith(new RegExp(r'art'), 1);     // true
     */
    startsWith(pattern: DartPattern, index?: int): bool;
    /**
     * Returns the position of the first match of [pattern] in this string,
     * starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.indexOf('art');                     // 1
     *     string.indexOf(new RegExp(r'[A-Z][a-z]')); // 0
     *
     * Returns -1 if no match is found:
     *
     *     string.indexOf(new RegExp(r'dart'));       // -1
     *
     * [start] must be non-negative and not greater than [length].
     */
    indexOf(pattern: DartPattern, start?: int): int;
    /**
     * Returns the position of the last match [pattern] in this string, searching
     * backward starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.lastIndexOf('a');                    // 6
     *     string.lastIndexOf(new RegExp(r'a(r|n)'));  // 6
     *
     * Returns -1 if [pattern] could not be found in this string.
     *
     *     string.lastIndexOf(new RegExp(r'DART'));    // -1
     *
     * The [start] must be non-negative and not greater than [length].
     */
    lastIndexOf(pattern: DartPattern, start?: int): int;
    /**
     * Returns true if this string is empty.
     */
    readonly isEmpty: bool;
    /**
     * Returns true if this string is not empty.
     */
    readonly isNotEmpty: bool;
    /**
     * Creates a new string by concatenating this string with [other].
     *
     *     'dart' + 'lang'; // 'dartlang'
     */
    concat(other: string): string;
    /**
     * Returns the substring of this string that extends from [startIndex],
     * inclusive, to [endIndex], exclusive.
     *
     *     var string = 'dartlang';
     *     string.substring(1);    // 'artlang'
     *     string.substring(1, 4); // 'art'
     */
    substring(startIndex: int, endIndex?: int): string;
    /**
     * Returns the string without any leading and trailing whitespace.
     *
     * If the string contains leading or trailing whitespace, a new string with no
     * leading and no trailing whitespace is returned:
     *
     *     '\tDart is fun\n'.trim(); // 'Dart is fun'
     *
     * Otherwise, the original string itself is returned:
     *
     *     var str1 = 'Dart';
     *     var str2 = str1.trim();
     *     identical(str1, str2);    // true
     *
     * Whitespace is defined by the Unicode White_Space property (as defined in
     * version 6.2 or later) and the BOM character, 0xFEFF.
     *
     * Here is the list of trimmed characters (following version 6.2):
     *
     *     0009..000D    ; White_Space # Cc   <control-0009>..<control-000D>
     *     0020          ; White_Space # Zs   SPACE
     *     0085          ; White_Space # Cc   <control-0085>
     *     00A0          ; White_Space # Zs   NO-BREAK SPACE
     *     1680          ; White_Space # Zs   OGHAM SPACE MARK
     *     180E          ; White_Space # Zs   MONGOLIAN VOWEL SEPARATOR
     *     2000..200A    ; White_Space # Zs   EN QUAD..HAIR SPACE
     *     2028          ; White_Space # Zl   LINE SEPARATOR
     *     2029          ; White_Space # Zp   PARAGRAPH SEPARATOR
     *     202F          ; White_Space # Zs   NARROW NO-BREAK SPACE
     *     205F          ; White_Space # Zs   MEDIUM MATHEMATICAL SPACE
     *     3000          ; White_Space # Zs   IDEOGRAPHIC SPACE
     *
     *     FEFF          ; BOM                ZERO WIDTH NO_BREAK SPACE
     */
    trim(): string;
    /**
     * Returns the string without any leading whitespace.
     *
     * As [trim], but only removes leading whitespace.
     */
    trimLeft(): string;
    /**
     * Returns the string without any trailing whitespace.
     *
     * As [trim], but only removes trailing whitespace.
     */
    trimRight(): string;
    /**
     * Creates a new string by concatenating this string with itself a number
     * of times.
     *
     * The result of `str * n` is equivalent to
     * `str + str + ...`(n times)`... + str`.
     *
     * Returns an empty string if [times] is zero or negative.
     */
    repeat(times: int): string;
    /**
     * Pads this string on the left if it is shorter than [width].
     *
     * Return a new string that prepends [padding] onto this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    padLeft(width: int, padding?: string): string;
    /**
     * Pads this string on the right if it is shorter than [width].
     *
     * Return a new string that appends [padding] after this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    padRight(width: int, padding?: string): string;
    /**
     * Returns true if this string contains a match of [other]:
     *
     *     var string = 'Dart strings';
     *     string.contains('D');                     // true
     *     string.contains(new RegExp(r'[A-Z]'));    // true
     *
     * If [startIndex] is provided, this method matches only at or after that
     * index:
     *
     *     string.contains('X', 1);                  // false
     *     string.contains(new RegExp(r'[A-Z]'), 1); // false
     *
     * [startIndex] must not be negative or greater than [length].
     */
    contains(other: DartPattern, startIndex?: int): bool;
    /**
     * Returns a new string in which the first occurrence of [from] in this string
     * is replaced with [to], starting from [startIndex]:
     *
     *     '0.0001'.replaceFirst(new RegExp(r'0'), ''); // '.0001'
     *     '0.0001'.replaceFirst(new RegExp(r'0'), '7', 1); // '0.7001'
     */
    replaceFirst(from: DartPattern, to: string, startIndex?: int): string;
    /**
     * Replace the first occurrence of [from] in this string.
     *
     * Returns a new string, which is this string
     * except that the first match of [from], starting from [startIndex],
     * is replaced by the result of calling [replace] with the match object.
     *
     * The optional [startIndex] is by default set to 0. If provided, it must be
     * an integer in the range `[0 .. len]`, where `len` is this string's length.
     *
     * If the value returned by calling `replace` is not a [String], it
     * is converted to a `String` using its `toString` method, which must
     * then return a string.
     */
    replaceFirstMapped(from: DartPattern, replace: (match: DartMatch) => string, startIndex?: int): string;
    /**
     * Replaces all substrings that match [from] with [replace].
     *
     * Returns a new string in which the non-overlapping substrings matching
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the literal string [replace].
     *
     *     'resume'.replaceAll(new RegExp(r'e'), 'é'); // 'résumé'
     *
     * Notice that the [replace] string is not interpreted. If the replacement
     * depends on the match (for example on a [RegExp]'s capture groups), use
     * the [replaceAllMapped] method instead.
     */
    replaceAll(from: DartPattern, replace: string): string;
    /**
     * Replace all substrings that match [from] by a string computed from the
     * match.
     *
     * Returns a new string in which the non-overlapping substrings that match
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the result of calling [replace] on the corresponding [Match] object.
     *
     * This can be used to replace matches with new content that depends on the
     * match, unlike [replaceAll] where the replacement string is always the same.
     *
     * The [replace] function is called with the [Match] generated
     * by the pattern, and its result is used as replacement.
     *
     * The function defined below converts each word in a string to simplified
     * 'pig latin' using [replaceAllMapped]:
     *
     *     pigLatin(String words) => words.replaceAllMapped(
     *         new RegExp(r'\b(\w*?)([aeiou]\w*)', caseSensitive: false),
     *         (Match m) => "${m[2]}${m[1]}${m[1].isEmpty ? 'way' : 'ay'}");
     *
     *     pigLatin('I have a secret now!'); // 'Iway avehay away ecretsay ownay!'
     */
    replaceAllMapped(from: DartPattern, replace: (match: DartMatch) => string): string;
    /**
     * Replaces the substring from [start] to [end] with [replacement].
     *
     * Returns a new string equivalent to:
     *
     *     this.substring(0, start) + replacement + this.substring(end)
     *
     * The [start] and [end] indices must specify a valid range of this string.
     * That is `0 <= start <= end <= this.length`.
     * If [end] is `null`, it defaults to [length].
     */
    replaceRange(start: int, end: int, replacement: string): string;
    /**
     * Splits the string at matches of [pattern] and returns a list of substrings.
     *
     * Finds all the matches of `pattern` in this string,
     * and returns the list of the substrings between the matches.
     *
     *     var string = "Hello world!";
     *     string.split(" ");                      // ['Hello', 'world!'];
     *
     * Empty matches at the beginning and end of the strings are ignored,
     * and so are empty matches right after another match.
     *
     *     var string = "abba";
     *     string.split(new RegExp(r"b*"));        // ['a', 'a']
     *                                             // not ['', 'a', 'a', '']
     *
     * If this string is empty, the result is an empty list if `pattern` matches
     * the empty string, and it is `[""]` if the pattern doesn't match.
     *
     *     var string = '';
     *     string.split('');                       // []
     *     string.split("a");                      // ['']
     *
     * Splitting with an empty pattern splits the string into single-code unit
     * strings.
     *
     *     var string = 'Pub';
     *     string.split('');                       // ['P', 'u', 'b']
     *
     *     string.codeUnits.map((unit) {
     *       return new String.fromCharCode(unit);
     *     }).toList();                            // ['P', 'u', 'b']
     *
     * Splitting happens at UTF-16 code unit boundaries,
     * and not at rune boundaries:
     *
     *     // String made up of two code units, but one rune.
     *     string = '\u{1D11E}';
     *     string.split('').length;                 // 2 surrogate values
     *
     * To get a list of strings containing the individual runes of a string,
     * you should not use split. You can instead map each rune to a string
     * as follows:
     *
     *     string.runes.map((rune) => new String.fromCharCode(rune)).toList();
     */
    split(pattern: DartPattern): DartList<String>;
    /**
     * Splits the string, converts its parts, and combines them into a new
     * string.
     *
     * [pattern] is used to split the string into parts and separating matches.
     *
     * Each match is converted to a string by calling [onMatch]. If [onMatch]
     * is omitted, the matched string is used.
     *
     * Each non-matched part is converted by a call to [onNonMatch]. If
     * [onNonMatch] is omitted, the non-matching part is used.
     *
     * Then all the converted parts are combined into the resulting string.
     *
     *     'Eats shoots leaves'.splitMapJoin((new RegExp(r'shoots')),
     *         onMatch:    (m) => '${m.group(0)}',
     *         onNonMatch: (n) => '*'); // *shoots*
     */
    splitMapJoin(pattern: DartPattern, _?: {
        onMatch?: (match: DartMatch) => string;
        onNonMatch?: (nonMatch: string) => string;
    }): string;
    /**
     * Returns an unmodifiable list of the UTF-16 code units of this string.
     */
    readonly codeUnits: DartList<int>;
    /**
     * Returns an [Iterable] of Unicode code-points of this string.
     *
     * If the string contains surrogate pairs, they are combined and returned
     * as one integer by this iterator. Unmatched surrogate halves are treated
     * like valid 16-bit code-units.
     */
    readonly runes: DartRunes;
    /**
     * Converts all characters in this string to lower case.
     * If the string is already in all lower case, this method returns [:this:].
     *
     *     'ALPHABET'.toLowerCase(); // 'alphabet'
     *     'abc'.toLowerCase();      // 'abc'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    toLowerCase(): string;
    /**
     * Converts all characters in this string to upper case.
     * If the string is already in all upper case, this method returns [:this:].
     *
     *     'alphabet'.toUpperCase(); // 'ALPHABET'
     *     'ABC'.toUpperCase();      // 'ABC'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    toUpperCase(): string;
    allMatches(string: string, start?: int): DartIterable<DartMatch>;
    compareTo(other: DartString): int;
    matchAsPrefix(string: string, start?: int): DartMatch;
    static _stringFromJSArray(list: DartList<int>, start: int, endOrNull: int): DartString;
    static _stringFromUint8List(charCodes: Array<int>, start: int, endOrNull: int): DartString;
    static _stringFromIterable(charCodes: DartIterable<int>, start: int, end: int): DartString;
}
/**
 * The runes (integer Unicode code points) of a [String].
 */
declare class DartRunes extends DartIterable<int> {
    _string: string;
    constructor(_string: string);
    readonly iterator: DartRuneIterator;
    readonly last: int;
}
/** [Iterator] for reading runes (integer Unicode code points) out of a Dart
 * string.
 */
declare class DartRuneIterator implements DartBidirectionalIterator<int> {
    /** String being iterated. */
    _string: DartString;
    /** Position before the current code point. */
    _position: int;
    /** Position after the current code point. */
    _nextPosition: int;
    /**
     * Current code point.
     *
     * If the iterator has hit either end, the [_currentCodePoint] is null
     * and [: _position == _nextPosition :].
     */
    _currentCodePoint: int;
    /** Create an iterator positioned at the beginning of the string. */
    constructor(_string: string);
    /**
     * Create an iterator positioned before the [index]th code unit of the string.
     *
     * When created, there is no [current] value.
     * A [moveNext] will use the rune starting at [index] the current value,
     * and a [movePrevious] will use the rune ending just before [index] as the
     * the current value.
     *
     * The [index] position must not be in the middle of a surrogate pair.
     */
    protected at(_string: string, index: int): void;
    static at: new (_string: string, index: int) => DartRuneIterator;
    /** Throw an error if the index is in the middle of a surrogate pair. */
    _checkSplitSurrogate(index: int): void;
    /**
     * Returns the starting position of the current rune in the string.
     *
     * Returns null if the [current] rune is null.
     */
    /**
    * Resets the iterator to the rune at the specified index of the string.
    *
    * Setting a negative [rawIndex], or one greater than or equal to
    * [:string.length:],
    * is an error. So is setting it in the middle of a surrogate pair.
    *
    * Setting the position to the end of then string will set [current] to null.
    */
    rawIndex: int;
    /**
     * Resets the iterator to the given index into the string.
     *
     * After this the [current] value is unset.
     * You must call [moveNext] make the rune at the position current,
     * or [movePrevious] for the last rune before the position.
     *
     * Setting a negative [rawIndex], or one greater than [:string.length:],
     * is an error. So is setting it in the middle of a surrogate pair.
     */
    reset(rawIndex?: int): void;
    /** The rune (integer Unicode code point) starting at the current position in
     *  the string.
     */
    readonly current: int;
    /**
     * The number of code units comprising the current rune.
     *
     * Returns zero if there is no current rune ([current] is null).
     */
    readonly currentSize: int;
    /**
     * A string containing the current rune.
     *
     * For runes outside the basic multilingual plane, this will be
     * a String of length 2, containing two code units.
     *
     * Returns null if [current] is null.
     */
    readonly currentAsString: string;
    moveNext(): bool;
    movePrevious(): bool;
    next(value?: any): IteratorResult<int>;
}
declare class DartStringMatch implements DartMatch {
    constructor(start: int, input: string, pattern: DartString);
    readonly end: int;
    readonly groupCount: int;
    group(group_: int): string;
    groups(groups_: DartList<int>): DartList<string>;
    start: int;
    input: string;
    pattern: DartString;
}
/**
 * An [Iterable] of the UTF-16 code units of a [String] in index order.
 */
declare class DartCodeUnits extends DartUnmodifiableListBase<int> {
    /** The string that this is the code units of. */
    _string: DartString;
    constructor(_string: DartString);
    readonly length: int;
    elementAt(i: int): number;
    static stringOf(u: DartCodeUnits): DartString;
}
/**
 * An integer or floating-point number.
 *
 * It is a compile-time error for any type other than [int] or [double]
 * to attempt to extend or implement num.
 */
declare class DartNumber implements DartComparable<num> {
    static _create(n: num): DartNumber;
    constructor(n: num);
    /**
     * Test whether this value is numerically equal to `other`.
     *
     * If both operands are doubles, they are equal if they have the same
     * representation, except that:
     *
     *   * zero and minus zero (0.0 and -0.0) are considered equal. They
     *     both have the numerical value zero.
     *   * NaN is not equal to anything, including NaN. If either operand is
     *     NaN, the result is always false.
     *
     * If one operand is a double and the other is an int, they are equal if
     * the double has an integer value (finite with no fractional part) and
     * `identical(doubleValue.toInt(), intValue)` is true.
     *
     * If both operands are integers, they are equal if they have the same value.
     *
     * Returns false if `other` is not a [num].
     *
     * Notice that the behavior for NaN is non-reflexive. This means that
     * equality of double values is not a proper equality relation, as is
     * otherwise required of `operator==`. Using NaN in, e.g., a [HashSet]
     * will fail to work. The behavior is the standard IEEE-754 equality of
     * doubles.
     *
     * If you can avoid NaN values, the remaining doubles do have a proper
     * equality relation, and can be used safely.
     *
     * Use [compareTo] for a comparison that distinguishes zero and minus zero,
     * and that considers NaN values as equal.
     */
    equals(other: any): bool;
    /**
     * Returns a hash code for a numerical value.
     *
     * The hash code is compatible with equality. It returns the same value
     * for an [int] and a [double] with the same numerical value, and therefore
     * the same value for the doubles zero and minus zero.
     *
     * No guarantees are made about the hash code of NaN values.
     */
    readonly hashCode: int;
    /**
     * Compares this to `other`.
     *
     * Returns a negative number if `this` is less than `other`, zero if they are
     * equal, and a positive number if `this` is greater than `other`.
     *
     * The ordering represented by this method is a total ordering of [num]
     * values. All distinct doubles are non-equal, as are all distinct integers,
     * but integers are equal to doubles if they have the same numerical
     * value.
     *
     * For doubles, the `compareTo` operation is different from the partial
     * ordering given by [operator==], [operator<] and [operator>]. For example,
     * IEEE doubles impose that `0.0 == -0.0` and all comparison operations on
     * NaN return false.
     *
     * This function imposes a complete ordering for doubles. When using
     * `compareTo` the following properties hold:
     *
     * - All NaN values are considered equal, and greater than any numeric value.
     * - -0.0 is less than 0.0 (and the integer 0), but greater than any non-zero
     *    negative value.
     * - Negative infinity is less than all other values and positive infinity is
     *   greater than all non-NaN values.
     * - All other values are compared using their numeric value.
     *
     * Examples:
     * ```
     * print(1.compareTo(2)); // => -1
     * print(2.compareTo(1)); // => 1
     * print(1.compareTo(1)); // => 0
     *
     * // The following comparisons yield different results than the
     * // corresponding comparison operators.
     * print((-0.0).compareTo(0.0));  // => -1
     * print(double.NAN.compareTo(double.NAN));  // => 0
     * print(double.INFINITY.compareTo(double.NAN)); // => -1
     *
     * // -0.0, and NaN comparison operators have rules imposed by the IEEE
     * // standard.
     * print(-0.0 == 0.0); // => true
     * print(double.NAN == double.NAN);  // => false
     * print(double.INFINITY < double.NAN);  // => false
     * print(double.NAN < double.INFINITY);  // => false
     * print(double.NAN == double.INFINITY);  // => false
     */
    compareTo(other: num): int;
    /** Addition operator. */
    plus(other: num): num;
    /** Subtraction operator. */
    minus(other: num): num;
    /** Multiplication operator. */
    times(other: num): num;
    /**
     * Euclidean modulo operator.
     *
     * Returns the remainder of the euclidean division. The euclidean division of
     * two integers `a` and `b` yields two integers `q` and `r` such that
     * `a == b * q + r` and `0 <= r < b.abs()`.
     *
     * The euclidean division is only defined for integers, but can be easily
     * extended to work with doubles. In that case `r` may have a non-integer
     * value, but it still verifies `0 <= r < |b|`.
     *
     * The sign of the returned value `r` is always positive.
     *
     * See [remainder] for the remainder of the truncating division.
     */
    module(other: num): num;
    /** Division operator. */
    divide(other: num): num;
    /**
     * Truncating division operator.
     *
     * If either operand is a [double] then the result of the truncating division
     * `a ~/ b` is equivalent to `(a / b).truncate().toInt()`.
     *
     * If both operands are [int]s then `a ~/ b` performs the truncating
     * integer division.
     */
    intDivide(other: num): int;
    /** Negate operator. */
    neg(): num;
    /**
     * Returns the remainder of the truncating division of `this` by [other].
     *
     * The result `r` of this operation satisfies:
     * `this == (this ~/ other) * other + r`.
     * As a consequence the remainder `r` has the same sign as the divider `this`.
     */
    remainder(b: num): num;
    /** Relational less than operator. */
    lt(other: num): bool;
    /** Relational less than or equal operator. */
    leq(other: num): bool;
    /** Relational greater than operator. */
    get(other: num): bool;
    /** Relational greater than or equal operator. */
    geq(other: num): bool;
    /** True if the number is the double Not-a-Number value; otherwise, false. */
    readonly isNaN: bool;
    /**
     * True if the number is negative; otherwise, false.
     *
     * Negative numbers are those less than zero, and the double `-0.0`.
     */
    readonly isNegative: bool;
    /**
     * True if the number is positive infinity or negative infinity; otherwise,
     * false.
     */
    readonly isInfinite: bool;
    /**
     * True if the number is finite; otherwise, false.
     *
     * The only non-finite numbers are NaN, positive infinity, and
     * negative infinity.
     */
    readonly isFinite: bool;
    /** Returns the absolute value of this [num]. */
    abs(): num;
    /**
     * Returns minus one, zero or plus one depending on the sign and
     * numerical value of the number.
     *
     * Returns minus one if the number is less than zero,
     * plus one if the number is greater than zero,
     * and zero if the number is equal to zero.
     *
     * Returns NaN if the number is the double NaN value.
     *
     * Returns a number of the same type as this number.
     * For doubles, `-0.0.sign == -0.0`.

     * The result satisfies:
     *
     *     n == n.sign * n.abs()
     *
     * for all numbers `n` (except NaN, because NaN isn't `==` to itself).
     */
    readonly sign: num;
    /**
     * Returns the integer closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).round() == 4` and `(-3.5).round() == -4`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    round(): int;
    /**
     * Returns the greatest integer no greater than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    floor(): int;
    /**
     * Returns the least integer no smaller than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    ceil(): int;
    /**
     * Returns the integer obtained by discarding any fractional
     * digits from `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    truncate(): int;
    /**
     * Returns the double integer value closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).roundToDouble() == 4` and `(-3.5).roundToDouble() == -4`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`,
     * and `-0.0` is therefore considered closer to negative numbers than `0.0`.
     * This means that for a value, `d` in the range `-0.5 < d < 0.0`,
     * the result is `-0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    roundToDouble(): double;
    /**
     * Returns the greatest double integer value no greater than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `0.0 < d < 1.0` will return `0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    floorToDouble(): double;
    /**
     * Returns the least double integer value no smaller than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    ceilToDouble(): double;
    /**
     * Returns the double integer value obtained by discarding any fractional
     * digits from the double value of `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is a
     * non-finite double value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`, and
     * in the range `0.0 < d < 1.0` it will return 0.0.
     *
     * The result is always a double.
     * If this is a numerically large integer, the result may be an infinite
     * double.
     */
    truncateToDouble(): double;
    /**
     * Returns this [num] clamped to be in the range [lowerLimit]-[upperLimit].
     *
     * The comparison is done using [compareTo] and therefore takes `-0.0` into
     * account. This also implies that [double.NAN] is treated as the maximal
     * double value.
     *
     * The arguments [lowerLimit] and [upperLimit] must form a valid range where
     * `lowerLimit.compareTo(upperLimit) <= 0`.
     */
    clamp(lowerLimit: num, upperLimit: num): num;
    /** Truncates this [num] to an integer and returns the result as an [int]. */
    toInt(): int;
    /**
     * Return this [num] as a [double].
     *
     * If the number is not representable as a [double], an
     * approximation is returned. For numerically large integers, the
     * approximation may be infinite.
     */
    toDouble(): double;
    /**
     * Returns a decimal-point string-representation of `this`.
     *
     * Converts `this` to a [double] before computing the string representation.
     *
     * If the absolute value of `this` is greater or equal to `10^21` then this
     * methods returns an exponential representation computed by
     * `this.toStringAsExponential()`. Otherwise the result
     * is the closest string representation with exactly [fractionDigits] digits
     * after the decimal point. If [fractionDigits] equals 0 then the decimal
     * point is omitted.
     *
     * The parameter [fractionDigits] must be an integer satisfying:
     * `0 <= fractionDigits <= 20`.
     *
     * Examples:
     *
     *     1.toStringAsFixed(3);  // 1.000
     *     (4321.12345678).toStringAsFixed(3);  // 4321.123
     *     (4321.12345678).toStringAsFixed(5);  // 4321.12346
     *     123456789012345678901.toStringAsFixed(3);  // 123456789012345683968.000
     *     1000000000000000000000.toStringAsFixed(3); // 1e+21
     *     5.25.toStringAsFixed(0); // 5
     */
    toStringAsFixed(fractionDigits: int): string;
    /**
     * Returns an exponential string-representation of `this`.
     *
     * Converts `this` to a [double] before computing the string representation.
     *
     * If [fractionDigits] is given then it must be an integer satisfying:
     * `0 <= fractionDigits <= 20`. In this case the string contains exactly
     * [fractionDigits] after the decimal point. Otherwise, without the parameter,
     * the returned string uses the shortest number of digits that accurately
     * represent [this].
     *
     * If [fractionDigits] equals 0 then the decimal point is omitted.
     * Examples:
     *
     *     1.toStringAsExponential();       // 1e+0
     *     1.toStringAsExponential(3);      // 1.000e+0
     *     123456.toStringAsExponential();  // 1.23456e+5
     *     123456.toStringAsExponential(3); // 1.235e+5
     *     123.toStringAsExponential(0);    // 1e+2
     */
    toStringAsExponential(fractionDigits?: int): string;
    /**
     * Converts `this` to a double and returns a string representation with
     * exactly [precision] significant digits.
     *
     * The parameter [precision] must be an integer satisfying:
     * `1 <= precision <= 21`.
     *
     * Examples:
     *
     *     1.toStringAsPrecision(2);       // 1.0
     *     1e15.toStringAsPrecision(3);    // 1.00+15
     *     1234567.toStringAsPrecision(3); // 1.23e+6
     *     1234567.toStringAsPrecision(9); // 1234567.00
     *     12345678901234567890.toStringAsPrecision(20); // 12345678901234567168
     *     12345678901234567890.toStringAsPrecision(14); // 1.2345678901235e+19
     *     0.00000012345.toStringAsPrecision(15); // 1.23450000000000e-7
     *     0.0000012345.toStringAsPrecision(15);  // 0.00000123450000000000
     */
    toStringAsPrecision(precision: int): string;
    /**
     * Returns the shortest string that correctly represent the input number.
     *
     * All [double]s in the range `10^-6` (inclusive) to `10^21` (exclusive)
     * are converted to their decimal representation with at least one digit
     * after the decimal point. For all other doubles,
     * except for special values like `NaN` or `Infinity`, this method returns an
     * exponential representation (see [toStringAsExponential]).
     *
     * Returns `"NaN"` for [double.NAN], `"Infinity"` for [double.INFINITY], and
     * `"-Infinity"` for [double.NEGATIVE_INFINITY].
     *
     * An [int] is converted to a decimal representation with no decimal point.
     *
     * Examples:
     *
     *     (0.000001).toString();  // "0.000001"
     *     (0.0000001).toString(); // "1e-7"
     *     (111111111111111111111.0).toString();  // "111111111111111110000.0"
     *     (100000000000000000000.0).toString();  // "100000000000000000000.0"
     *     (1000000000000000000000.0).toString(); // "1e+21"
     *     (1111111111111111111111.0).toString(); // "1.1111111111111111e+21"
     *     1.toString(); // "1"
     *     111111111111111111111.toString();  // "111111111111111110000"
     *     100000000000000000000.toString();  // "100000000000000000000"
     *     1000000000000000000000.toString(); // "1000000000000000000000"
     *     1111111111111111111111.toString(); // "1111111111111111111111"
     *     1.234e5.toString();   // 123400
     *     1234.5e6.toString();  // 1234500000
     *     12.345e67.toString(); // 1.2345e+68
     *
     * Note: the conversion may round the output if the returned string
     * is accurate enough to uniquely identify the input-number.
     * For example the most precise representation of the [double] `9e59` equals
     * `"899999999999999918767229449717619953810131273674690656206848"`, but
     * this method returns the shorter (but still uniquely identifying) `"9e59"`.
     *
     */
    toString(): string;
    /**
     * Parses a string containing a number literal into a number.
     *
     * The method first tries to read the [input] as integer (similar to
     * [int.parse] without a radix).
     * If that fails, it tries to parse the [input] as a double (similar to
     * [double.parse]).
     * If that fails, too, it invokes [onError] with [input], and the result
     * of that invocation becomes the result of calling `parse`.
     *
     * If no [onError] is supplied, it defaults to a function that throws a
     * [FormatException].
     *
     * For any number `n`, this function satisfies
     * `identical(n, num.parse(n.toString()))` (except when `n` is a NaN `double`
     * with a payload).
     */
    static parse(input: string, onError?: (input: string) => num): num;
    /** Helper functions for [parse]. */
    static _returnIntNull(_: string): int;
    static _returnDoubleNull(_: string): double;
}
/**
 * The super interceptor class for [JSInt] and [JSDouble]. The compiler
 * recognizes this class as an interceptor, and changes references to
 * [:this:] to actually use the receiver of the method, which is
 * generated as an extra argument added to each member.
 *
 * Note that none of the methods here delegate to a method defined on JSInt or
 * JSDouble.  This is exploited in [tryComputeConstantInterceptor].
 */
declare class JSNumber extends Number implements DartNumber, DartComparable<num> {
    equals(other: any): boolean;
    constructor(n: number);
    compareTo(b: num): int;
    readonly isNegative: bool;
    readonly isNaN: bool;
    readonly isInfinite: bool;
    readonly isFinite: bool;
    remainder(b: num): num;
    abs(): num;
    readonly sign: num;
    static _MIN_INT32: number;
    static _MAX_INT32: number;
    toInt(): int;
    truncate(): int;
    ceil(): int;
    floor(): int;
    round(): int;
    ceilToDouble(): double;
    floorToDouble(): double;
    roundToDouble(): double;
    truncateToDouble(): double;
    clamp(lowerLimit: num, upperLimit: num): num;
    toDouble(): double;
    toStringAsFixed(fractionDigits: int): string;
    toStringAsExponential(fractionDigits?: int): string;
    toStringAsPrecision(precision: int): string;
    toRadixString(radix: int): string;
    static _handleIEtoString(result: string): string;
    toString(): string;
    readonly hashCode: int;
    neg(): num;
    plus(other: num): num;
    minus(other: num): num;
    divide(other: num): num;
    times(other: num): num;
    module(other: num): num;
    _isInt32(value: num): bool;
    intDivide(other: num): int;
    _tdivFast(other: num): int;
    _tdivSlow(other: num): int;
    lshift(other: num): num;
    _shlPositive(other: num): num;
    rshift(other: num): num;
    _shrOtherPositive(other: num): num;
    _shrReceiverPositive(other: num): num;
    _shrBothPositive(other: num): num;
    and(other: num): num;
    or(other: num): num;
    xor(other: num): num;
    lt(other: num): bool;
    get(other: num): bool;
    leq(other: num): bool;
    geq(other: num): bool;
}
/**
 * An arbitrarily large integer.
 *
 * **Note:** When compiling to JavaScript, integers are
 * implemented as JavaScript numbers. When compiling to JavaScript,
 * integers are therefore restricted to 53 significant bits because
 * all JavaScript numbers are double-precision floating point
 * values. The behavior of the operators and methods in the [int]
 * class therefore sometimes differs between the Dart VM and Dart code
 * compiled to JavaScript.
 *
 * It is a compile-time error for a class to attempt to extend or implement int.
 */
declare class DartInt extends DartNumber {
    static _create(n: int): DartInt;
    constructor(n: int);
    /**
     * Returns the integer value of the given environment declaration [name].
     *
     * The result is the same as would be returned by:
     *
     *     int.parse(const String.fromEnvironment(name, defaultValue: ""),
     *               (_) => defaultValue)
     *
     * Example:
     *
     *     const int.fromEnvironment("defaultPort", defaultValue: 80)
     */
    protected static _fromEnvironment(name: string, _?: {
        defaultValue: int;
    }): DartInt;
    static fromEnvironment: new (name: string, _?: {
        defaultValue: int;
    }) => DartInt;
    /**
     * Bit-wise and operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with only the bits set that are set in
     * both `this` and [other]
     *
     * Of both operands are negative, the result is negative, otherwise
     * the result is non-negative.
     */
    and(other: num): int;
    /**
     * Bit-wise or operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with the bits set that are set in either
     * of `this` and [other]
     *
     * If both operands are non-negative, the result is non-negative,
     * otherwise the result us negative.
     */
    or(other: num): num;
    /**
     * Bit-wise exclusive-or operator.
     *
     * Treating both `this` and [other] as sufficiently large two's component
     * integers, the result is a number with the bits set that are set in one,
     * but not both, of `this` and [other]
     *
     * If the operands have the same sign, the result is non-negative,
     * otherwise the result is negative.
     */
    xor(other: num): num;
    /**
     * The bit-wise negate operator.
     *
     * Treating `this` as a sufficiently large two's component integer,
     * the result is a number with the opposite bits set.
     *
     * This maps any integer `x` to `-x - 1`.
     */
    bitneg(): int;
    /**
     * Shift the bits of this integer to the left by [shiftAmount].
     *
     * Shifting to the left makes the number larger, effectively multiplying
     * the number by `pow(2, shiftIndex)`.
     *
     * There is no limit on the size of the result. It may be relevant to
     * limit intermediate values by using the "and" operator with a suitable
     * mask.
     *
     * It is an error if [shiftAmount] is negative.
     */
    lshift(other: num): num;
    /**
     * Shift the bits of this integer to the right by [shiftAmount].
     *
     * Shifting to the right makes the number smaller and drops the least
     * significant bits, effectively doing an integer division by
     *`pow(2, shiftIndex)`.
     *
     * It is an error if [shiftAmount] is negative.
     */
    rshift(other: num): num;
    /**
     * Returns this integer to the power of [exponent] modulo [modulus].
     *
     * The [exponent] must be non-negative and [modulus] must be
     * positive.
     */
    modPow(e: int, m: int): int;
    /**
     * Returns the modular multiplicative inverse of this integer
     * modulo [modulus].
     *
     * The [modulus] must be positive.
     *
     * It is an error if no modular inverse exists.
     */
    modInverse(m: int): int;
    /**
     * Returns the greatest common divisor of this integer and [other].
     *
     * If either number is non-zero, the result is the numerically greatest
     * integer dividing both `this` and `other`.
     *
     * The greatest common divisor is independent of the order,
     * so `x.gcd(y)` is  always the same as `y.gcd(x)`.
     *
     * For any integer `x`, `x.gcd(x)` is `x.abs()`.
     *
     * If both `this` and `other` is zero, the result is also zero.
     */
    gcd(other: int): int;
    /** Returns true if and only if this integer is even. */
    readonly isEven: bool;
    /** Returns true if and only if this integer is odd. */
    readonly isOdd: bool;
    /**
     * Returns the minimum number of bits required to store this integer.
     *
     * The number of bits excludes the sign bit, which gives the natural length
     * for non-negative (unsigned) values.  Negative values are complemented to
     * return the bit position of the first bit that differs from the sign bit.
     *
     * To find the number of bits needed to store the value as a signed value,
     * add one, i.e. use `x.bitLength + 1`.
     *
     *      x.bitLength == (-x-1).bitLength
     *
     *      3.bitLength == 2;     // 00000011
     *      2.bitLength == 2;     // 00000010
     *      1.bitLength == 1;     // 00000001
     *      0.bitLength == 0;     // 00000000
     *      (-1).bitLength == 0;  // 11111111
     *      (-2).bitLength == 1;  // 11111110
     *      (-3).bitLength == 2;  // 11111101
     *      (-4).bitLength == 2;  // 11111100
     */
    readonly bitLength: int;
    /**
     * Returns the least significant [width] bits of this integer as a
     * non-negative number (i.e. unsigned representation).  The returned value has
     * zeros in all bit positions higher than [width].
     *
     *     (-1).toUnsigned(5) == 31   // 11111111  ->  00011111
     *
     * This operation can be used to simulate arithmetic from low level languages.
     * For example, to increment an 8 bit quantity:
     *
     *     q = (q + 1).toUnsigned(8);
     *
     * `q` will count from `0` up to `255` and then wrap around to `0`.
     *
     * If the input fits in [width] bits without truncation, the result is the
     * same as the input.  The minimum width needed to avoid truncation of `x` is
     * given by `x.bitLength`, i.e.
     *
     *     x == x.toUnsigned(x.bitLength);
     */
    toUnsigned(width: int): int;
    /**
     * Returns the least significant [width] bits of this integer, extending the
     * highest retained bit to the sign.  This is the same as truncating the value
     * to fit in [width] bits using an signed 2-s complement representation.  The
     * returned value has the same bit value in all positions higher than [width].
     *
     *                                    V--sign bit-V
     *     16.toSigned(5) == -16   //  00010000 -> 11110000
     *     239.toSigned(5) == 15   //  11101111 -> 00001111
     *                                    ^           ^
     *
     * This operation can be used to simulate arithmetic from low level languages.
     * For example, to increment an 8 bit signed quantity:
     *
     *     q = (q + 1).toSigned(8);
     *
     * `q` will count from `0` up to `127`, wrap to `-128` and count back up to
     * `127`.
     *
     * If the input value fits in [width] bits without truncation, the result is
     * the same as the input.  The minimum width needed to avoid truncation of `x`
     * is `x.bitLength + 1`, i.e.
     *
     *     x == x.toSigned(x.bitLength + 1);
     */
    toSigned(width: int): int;
    /**
     * Return the negative value of this integer.
     *
     * The result of negating an integer always has the opposite sign, except
     * for zero, which is its own negation.
     */
    /**
     * Returns the absolute value of this integer.
     *
     * For any integer `x`, the result is the same as `x < 0 ? -x : x`.
     */
    /**
     * Returns the sign of this integer.
     *
     * Returns 0 for zero, -1 for values less than zero and
     * +1 for values greater than zero.
     */
    /** Returns `this`. */
    /** Returns `this`. */
    /** Returns `this`. */
    /** Returns `this`. */
    /** Returns `this.toDouble()`. */
    /** Returns `this.toDouble()`. */
    /** Returns `this.toDouble()`. */
    /** Returns `this.toDouble()`. */
    /**
     * Returns a String-representation of this integer.
     *
     * The returned string is parsable by [parse].
     * For any `int` [:i:], it is guaranteed that
     * [:i == int.parse(i.toString()):].
     */
    /**
     * Converts [this] to a string representation in the given [radix].
     *
     * In the string representation, lower-case letters are used for digits above
     * '9', with 'a' being 10 an 'z' being 35.
     *
     * The [radix] argument must be an integer in the range 2 to 36.
     */
    /**
     * Parse [source] as a, possibly signed, integer literal and return its value.
     *
     * The [source] must be a non-empty sequence of base-[radix] digits,
     * optionally prefixed with a minus or plus sign ('-' or '+').
     *
     * The [radix] must be in the range 2..36. The digits used are
     * first the decimal digits 0..9, and then the letters 'a'..'z' with
     * values 10 through 35. Also accepts upper-case letters with the same
     * values as the lower-case ones.
     *
     * If no [radix] is given then it defaults to 10. In this case, the [source]
     * digits may also start with `0x`, in which case the number is interpreted
     * as a hexadecimal literal, which effectively means that the `0x` is ignored
     * and the radix is instead set to 16.
     *
     * For any int [:n:] and radix [:r:], it is guaranteed that
     * [:n == int.parse(n.toRadixString(r), radix: r):].
     *
     * If the [source] is not a valid integer literal, optionally prefixed by a
     * sign, the [onError] is called with the [source] as argument, and its return
     * value is used instead. If no [onError] is provided, a [FormatException]
     * is thrown.
     *
     * The [onError] handler can be chosen to return `null`.  This is preferable
     * to to throwing and then immediately catching the [FormatException].
     * Example:
     *
     *     var value = int.parse(text, onError: (source) => null);
     *     if (value == null) ... handle the problem
     *
     * The [onError] function is only invoked if [source] is a [String]. It is
     * not invoked if the [source] is, for example, `null`.
     */
    static parse(source: string, _?: {
        radix?: int;
        onError?: (source: string) => int;
    } | ((input: string) => num)): int;
}
/**
 * The interceptor class for [int]s.
 *
 * This class implements double since in JavaScript all numbers are doubles, so
 * while we want to treat `2.0` as an integer for some operations, its
 * interceptor should answer `true` to `is double`.
 */
declare class JSInt extends JSNumber implements DartInt {
    constructor(i: int);
    readonly isEven: bool;
    readonly isOdd: bool;
    toUnsigned(width: int): int;
    toSigned(width: int): int;
    readonly bitLength: int;
    modPow(e: int, m: int): int;
    static _binaryGcd(x: int, y: int, inv: bool): int;
    modInverse(m: int): int;
    gcd(other: int): int;
    static _bitCount(i: int): int;
    static _shru(value: int, shift: int): number;
    static _shrs(value: int, shift: int): number;
    static _ors(a: int, b: int): number;
    static _spread(i: int): int;
    bitneg(): int;
}
/**
 * A double-precision floating point number.
 *
 * Representation of Dart doubles containing double specific constants
 * and operations and specializations of operations inherited from
 * [num]. Dart doubles are 64-bit floating-point numbers as specified in the
 * IEEE 754 standard.
 *
 * The [double] type is contagious. Operations on [double]s return
 * [double] results.
 *
 * It is a compile-time error for a class to attempt to extend or implement
 * double.
 */
declare class DartDouble extends DartNumber {
    static _create(d: double): DartDouble;
    constructor(d: double);
    static NAN: double;
    static INFINITY: double;
    static NEGATIVE_INFINITY: double;
    static MIN_POSITIVE: double;
    static MAX_FINITE: double;
    /** Addition operator. */
    /** Subtraction operator. */
    /** Multiplication operator. */
    /** Division operator. */
    /**
     * Truncating division operator.
     *
     * The result of the truncating division `a ~/ b` is equivalent to
     * `(a / b).truncate()`.
     */
    /** Negate operator. */
    /** Returns the absolute value of this [double]. */
    /**
     * Returns the sign of the double's numerical value.
     *
     * Returns -1.0 if the value is less than zero,
     * +1.0 if the value is greater than zero,
     * and the value itself if it is -0.0, 0.0 or NaN.
     */
    /**
     * Returns the integer closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).round() == 4` and `(-3.5).round() == -4`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    /**
     * Returns the greatest integer no greater than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    /**
     * Returns the least integer no smaller than `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    /**
     * Returns the integer obtained by discarding any fractional
     * digits from `this`.
     *
     * If `this` is not finite (`NaN` or infinity), throws an [UnsupportedError].
     */
    /**
     * Returns the integer double value closest to `this`.
     *
     * Rounds away from zero when there is no closest integer:
     *  `(3.5).roundToDouble() == 4` and `(-3.5).roundToDouble() == -4`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`,
     * and `-0.0` is therefore considered closer to negative numbers than `0.0`.
     * This means that for a value, `d` in the range `-0.5 < d < 0.0`,
     * the result is `-0.0`.
     */
    /**
     * Returns the greatest integer double value no greater than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `0.0 < d < 1.0` will return `0.0`.
     */
    /**
     * Returns the least integer double value no smaller than `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`.
     */
    /**
     * Returns the integer double value obtained by discarding any fractional
     * digits from `this`.
     *
     * If this is already an integer valued double, including `-0.0`, or it is not
     * a finite value, the value is returned unmodified.
     *
     * For the purpose of rounding, `-0.0` is considered to be below `0.0`.
     * A number `d` in the range `-1.0 < d < 0.0` will return `-0.0`, and
     * in the range `0.0 < d < 1.0` it will return 0.0.
     */
    /**
     * Provide a representation of this [double] value.
     *
     * The representation is a number literal such that the closest double value
     * to the representation's mathematical value is this [double].
     *
     * Returns "NaN" for the Not-a-Number value.
     * Returns "Infinity" and "-Infinity" for positive and negative Infinity.
     * Returns "-0.0" for negative zero.
     *
     * For all doubles, `d`, converting to a string and parsing the string back
     * gives the same value again: `d == double.parse(d.toString())` (except when
     * `d` is NaN).
     */
    /**
     * Parse [source] as an double literal and return its value.
     *
     * Accepts an optional sign (`+` or `-`) followed by either the characters
     * "Infinity", the characters "NaN" or a floating-point representation.
     * A floating-point representation is composed of a mantissa and an optional
     * exponent part. The mantissa is either a decimal point (`.`) followed by a
     * sequence of (decimal) digits, or a sequence of digits
     * optionally followed by a decimal point and optionally more digits. The
     * (optional) exponent part consists of the character "e" or "E", an optional
     * sign, and one or more digits.
     *
     * Leading and trailing whitespace is ignored.
     *
     * If the [source] is not a valid double literal, the [onError]
     * is called with the [source] as argument, and its return value is
     * used instead. If no `onError` is provided, a [FormatException]
     * is thrown instead.
     *
     * The [onError] function is only invoked if [source] is a [String] with an
     * invalid format. It is not invoked if the [source] is invalid for some
     * other reason, for example by being `null`.
     *
     * Examples of accepted strings:
     *
     *     "3.14"
     *     "  3.14 \xA0"
     *     "0."
     *     ".0"
     *     "-1.e3"
     *     "1234E+7"
     *     "+.12e-9"
     *     "-NaN"
     */
    static parse(source: string, onError?: (source: string) => double): double;
}
declare class JSDouble extends JSNumber implements DartDouble {
    constructor(n: number);
}
declare function iter<X>(generator: () => Iterator<X>): DartIterable<X>;
declare function toDartIterable<X>(x: Iterable<X>): DartIterable<X>;
declare class JSIterable<X> extends DartIterableBase<X> {
    iterable: Iterable<X>;
    constructor(i: Iterable<X>);
    readonly iterator: DartIterator<X>;
    [Symbol.iterator](): Iterator<X>;
}
declare class JSIterator<X> implements DartIterator<X> {
    iterator: Iterator<X>;
    lastResult: IteratorResult<X>;
    constructor(i: Iterator<X>);
    readonly current: X;
    moveNext(): boolean;
    next(value?: any): IteratorResult<X>;
    return(value?: any): IteratorResult<X>;
    throw(e?: any): IteratorResult<X>;
}
declare function print(object: any): void;
/**
 * An [Expando] allows adding new properties to objects.
 *
 * Does not work on numbers, strings, booleans or null.
 *
 * An `Expando` does not hold on to the added property value after an object
 * becomes inaccessible.
 *
 * Since you can always create a new number that is identical to an existing
 * number, it means that an expando property on a number could never be
 * released. To avoid this, expando properties cannot be added to numbers.
 * The same argument applies to strings, booleans and null, which also have
 * literals that evaluate to identical values when they occur more than once.
 *
 * There is no restriction on other classes, even for compile time constant
 * objects. Be careful if adding expando properties to compile time constants,
 * since they will stay alive forever.
 */
declare class DartExpando<T> {
    /**
     * The name of the this [Expando] as passed to the constructor. If
     * no name was passed to the constructor, the name is [:null:].
     */
    name: string;
    /**
     * Creates a new [Expando]. The optional name is only used for
     * debugging purposes and creating two different [Expando]s with the
     * same name yields two [Expando]s that work on different properties
     * of the objects they are used on.
     */
    constructor(name?: string);
    /**
     * Expando toString method override.
     */
    toString(): string;
    /**
     * Gets the value of this [Expando]'s property on the given
     * object. If the object hasn't been expanded, the method returns
     * [:null:].
     *
     * The object must not be a number, a string, a boolean or null.
     */
    get(object: any): T;
    /**
     * Sets the value of this [Expando]'s property on the given
     * object. Properties can effectively be removed again by setting
     * their value to null.
     *
     * The object must not be a number, a string, a boolean or null.
     */
    set(object: any, value: T): void;
    static _keyCount: int;
    _jsWeakMapOrKey: WeakMap<any, T> | string;
    static _getFromObject<T>(key: string, object: any): T;
    static _setOnObject<T>(key: string, object: any, value: T): void;
    static _createKey(): string;
    static _checkType(object: any): void;
}
export { DartIterable, DartEfficientLengthIterable, DartSetMixin, AbstractDartMap, DartConstantMap, DartHashMap, DartHashSet, DartLinkedHashSet, DartList, DartLinkedHashMap, DartMap, DartSet, DartStringBuffer, ArgumentError, ConcurrentModificationError, DartArrayIterator, DartConstantMapView, DartEfficientLengthMappedIterable, DartError, DartEs6LinkedHashMap, DartExpandIterable, DartExpandIterator, DartIterableBase, DartIterableMixin, DartJsLinkedHashMap, DartLinkedHashMapKeyIterable, DartLinkedHashMapKeyIterator, DartListBase, DartListIterator, DartListMapView, DartListMixin, DartMapBase, DartMapMixin, DartMappedIterable, DartMappedListIterable, DartPrimitives, DartRandom, DartReversedListIterable, DartFixedLengthListMixin, DartSetBase, DartSkipIterable, DartSkipWhileIterable, DartSort, DartSubListIterable, DartTakeIterable, DartTakeWhileIterable, DartUnmodifiableListBase, DartUnmodifiableListMixin, DartUnmodifiableMapView, DartWhereIterable, DartWhereIterator, FixedLengthListBase, IndexError, JSFixedArray, JSMutableArray, JSUnmodifiableArray, LinkedHashMapCell, RangeError, StateError, UnmodifiableMapBase, UnsupportedError, DartObject, DartStackTrace, DartDuration, DartIntegerDivisionByZeroException, NullThrownError, DartSink, DartStopwatch, DartDateTime, FormatException, DartPattern, DartRegExp, DartMatch, DartBidirectionalIterator, DartString, DartStringMatch, DartRunes, DartRuneIterator, DartCodeUnits, JSNumber, JSInt, JSDouble, DartNumber, DartInt, DartDouble, iter, toDartIterable, JSIterable, JSIterator, print, DartExpando, DartMapView };
