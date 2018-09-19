/** Type of custom hash code function. */
/** Type of custom equality function */
import {Abstract, AbstractMethods, bool, DartClass, defaultFactory, Implements, int, namedFactory, num, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN, With} from "./utils";
import _dart from "./_common";
import {
    _Predicate,
    AbstractDartMap,
    ArgumentError,
    ConcurrentModificationError,
    DartComparable,
    DartEfficientLengthIterable,
    DartEfficientLengthMappedIterable,
    DartExpandIterable,
    DartIterable,
    DartIterableElementError,
    DartIterator,
    DartJsLinkedHashMap,
    DartList,
    DartListIterator,
    DartListMapView,
    DartMap,
    DartMappedIterable,
    DartMappedListIterable,
    DartRandom,
    DartReversedListIterable,
    DartSet,
    DartSkipIterable,
    DartSkipWhileIterable,
    DartSort,
    DartStringBuffer,
    DartSubListIterable,
    DartTakeIterable,
    DartTakeWhileIterable,
    DartUnmodifiableListBase,
    DartWhereIterable,
    fillLiteralMap,
    identical,
    identityHashCode,
    LinkedHashMapCell,
    RangeError,
    StateError,
    UnsupportedError
} from "./core";

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
class DartSetMixin<E> implements DartSet<E> {
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
                l.length = this.length;
                return l
            })() : new DartList<E>(this.length);
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
class DartSetBase<E> extends DartSetMixin<E> {
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
 * Mixin that overrides mutating map operations with implementations that throw.
 */
class _UnmodifiableMapMixin<K, V> {
    /** This operation is not supported by an unmodifiable map. */
    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    addAll(other: DartMap<K, V>): void {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    clear(): void {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    remove(key: any): V {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }

    /** This operation is not supported by an unmodifiable map. */
    putIfAbsent(key: K, ifAbsent: () => V): V {
        throw new UnsupportedError("Cannot modify unmodifiable map");
    }
}

/**
 * Wrapper around a class that implements [Map] that only exposes `Map` members.
 *
 * A simple wrapper that delegates all `Map` members to the map provided in the
 * constructor.
 *
 * Base for delegating map implementations like [UnmodifiableMapView].
 */
class DartMapView<K, V> implements DartMap<K, V> {
    protected _map: DartMap<K, V>;

    constructor(map: DartMap<K, V>) {
        this._map = map;
    }

    [OPERATOR_INDEX](key: any): V {
        return this._map[key];
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        this._map[OPERATOR_INDEX_ASSIGN](key, value);
    }

    get(k: K): V {
        return this[OPERATOR_INDEX](k);
    }

    set(k: K, v: V) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }

    addAll(other: DartMap<K, V>): void {
        this._map.addAll(other);
    }

    clear(): void {
        this._map.clear();
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        return this._map.putIfAbsent(key, ifAbsent);
    }

    containsKey(key: any): bool {
        return this._map.containsKey(key);
    }

    containsValue(value: any): bool {
        return this._map.containsValue(value);
    }

    forEach(action: (key: K, value: V) => any): void {
        this._map.forEach(action);
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get isNotEmpty(): bool {
        return this._map.isNotEmpty;
    }

    get length(): int {
        return this._map.length;
    }

    get keys(): DartIterable<K> {
        return this._map.keys;
    }

    remove(key: any): V {
        return this._map.remove(key);
    }

    toString(): string {
        return this._map.toString();
    }

    get values(): DartIterable<V> {
        return this._map.values;
    }
}

/**
 * View of a [Map] that disallow modifying the map.
 *
 * A wrapper around a `Map` that forwards all members to the map provided in
 * the constructor, except for operations that modify the map.
 * Modifying operations throw instead.
 */


@With(_UnmodifiableMapMixin)
class DartUnmodifiableMapView<K, V> extends DartMapView<K, V> {
    constructor(base: DartMap<K, V>) {
        super(base);
    }
}

/** Default function for equality comparison in customized HashMaps */
export function _defaultEquals(a, b): bool {
    return _dart.equals(a, b);
}

/** Default function for hash-code computation in customized HashMaps */
export function _defaultHashCode(a): int {
    return a.hashCode;
}

export type  _Equality<K> = (a: K, b: K) => bool;
export type  _Hasher<K> = (object: K) => int;

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
class DartHashMap<K, V> extends AbstractDartMap<K, V> implements DartMap<K, V> {
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
class DartHashSet<E> implements DartSet<E> {
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
class DartLinkedHashSet<E> implements DartHashSet<E> {
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

/**
 * This [Iterable] mixin implements all [Iterable] members except `iterator`.
 *
 * All other methods are implemented in terms of `iterator`.
 */
class DartIterableMixin<E> implements DartIterable<E> {
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
class DartIterableBase<E> extends DartIterable<E> {
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
@AbstractMethods(OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN)
@Implements(DartHashMap)
class DartLinkedHashMap<K, V> implements DartHashMap<K, V> {
    [OPERATOR_INDEX](key: K): V {
        throw 'abstract';
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        throw 'abstract';
    }

    get(k: K): V {
        return this[OPERATOR_INDEX](k);
    }

    set(k: K, v: V) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }


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
            result[OPERATOR_INDEX_ASSIGN](k/*=K*/, v/*=V*/);
        });
        return result;
    }

    static from: new<K, V>(other: DartMap<K, V>) => DartLinkedHashMap<K, V>;

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
        return fillLiteralMap(keyValuePairs, new DartJsLinkedHashMap<K, V>()) as any;
    }
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
@Implements(DartList)
class DartListMixin<E> implements DartList<E> {
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
        if (this.length == 0) return "";
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
            result.length = this.length;
        } else {
            result = new DartList<E>(this.length);
        }
        for (let i = 0; i < this.length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](i));
        }
        return result;
    }

    toSet(): DartSet<E> {
        let result: DartSet<E> = new DartSet<E>();
        for (let i = 0; i < this.length; i++) {
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
        this.length--;
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
            let tmp = this[OPERATOR_INDEX](length);
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
        RangeError.checkValidRange(start, end, listLength);
        let length = end - start;
        let result: DartList<E> = new DartList<E>();
        result.length = length;
        for (let i = 0; i < length; i++) {
            result[OPERATOR_INDEX_ASSIGN](i, this[OPERATOR_INDEX](start + i));
        }
        return result;
    }

    getRange(start: int, end: int): DartIterable<E> {
        RangeError.checkValidRange(start, end, this.length);
        return new DartSubListIterable<E>(this, start, end);
    }

    removeRange(start: int, end: int): void {
        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        this.setRange(start, this.length - length, this, end);
        this.length -= length;
    }

    fillRange(start: int, end: int, fill?: E): void {
        RangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
            this[OPERATOR_INDEX_ASSIGN](i, fill);
        }
    }

    setRange(start: int, end: int, iterable: DartIterable<E>, skipCount?: int /* = 0*/): void {
        skipCount = skipCount || 0;
        RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length == 0) return;
        RangeError.checkNotNegative(skipCount, "skipCount");

        let otherList: DartList<E>;
        let otherStart: int;
        // TODO(floitsch): Make this accept more.
        if (_dart.is(iterable, DartList)) {
            otherList = iterable as DartList<E>;
            otherStart = skipCount;
        } else {
            otherList = (iterable as DartIterable<E>).skip(skipCount).toList({growable: false});
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
        RangeError.checkValidRange(start, end, this.length);
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
        RangeError.checkValueInInterval(index, 0, this.length, "index");
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
        RangeError.checkValueInInterval(index, 0, this.length, "index");
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
class DartListBase<E> extends DartListMixin<E> {
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
@Implements(DartMap)
class DartMapMixin<K, V> implements DartMap<K, V> {
    get keys(): DartIterable<K> {
        throw new Error('abstract');
    }

    [OPERATOR_INDEX](key: any): V {
        throw new Error('abstract');
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        throw new Error('abstract');
    }

    get(k: K): V {
        return this[OPERATOR_INDEX](k);
    }

    set(k: K, v: V) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }

    remove(key: any): V {
        throw new Error('abstract');
    }

    // The `clear` operation should not be based on `remove`.
    // It should clear the map even if some keys are not equal to themselves.
    clear(): void {
        throw new Error('abstract');
    }

    forEach(action: (key: K, value: V) => any) {
        for (let key of this.keys) {
            action(key, this[OPERATOR_INDEX](key));
        }
    }

    addAll(other: DartMap<K, V>): void {
        for (let key of other.keys) {
            this[OPERATOR_INDEX_ASSIGN](key, other[OPERATOR_INDEX](key));
        }
    }

    containsValue(value: any): bool {
        for (let key of this.keys) {
            if (_dart.equals(this[OPERATOR_INDEX](key), value)) return true;
        }
        return false;
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) {
            return this[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }

    containsKey(key: any): bool {
        return this.keys.contains(key);
    }

    get length(): int {
        return this.keys.length;
    }

    get isEmpty(): bool {
        return this.keys.isEmpty;
    }

    get isNotEmpty(): bool {
        return this.keys.isNotEmpty;
    }

    get values(): DartIterable<V> {
        return new _MapBaseValueIterable<K, V>(this);
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
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

class DartMapBase<K, V> extends DartMapMixin<K, V> {

}

/**
 * Implementation of [Map.values] based on the map and its [Map.keys] iterable.
 *
 * Iterable that iterates over the values of a `Map`.
 * It accesses the values by iterating over the keys of the map, and using the
 * map's `operator[]` to lookup the keys.
 */
class _MapBaseValueIterable<K, V> extends DartEfficientLengthIterable<V> {
    protected _map: DartMap<K, V>;

    constructor(_map: DartMap<K, V>) {
        super();
        this._map = _map;
    }

    get length(): int {
        return this._map.length;
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get isNotEmpty(): bool {
        return this._map.isNotEmpty;
    }

    get first(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.first);
    }

    get single(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.single);
    }

    get last(): V {
        return this._map[OPERATOR_INDEX](this._map.keys.last);
    }

    get iterator(): DartIterator<V> {
        return new _MapBaseValueIterator<K, V>(this._map);
    }
}

/**
 * Iterator created by [_MapBaseValueIterable].
 *
 * Iterates over the values of a map by iterating its keys and lookup up the
 * values.
 */
//@Implements(DartIterator)
class _MapBaseValueIterator<K, V> implements DartIterator<V> {
    protected _keys: DartIterator<K>;
    protected _map: DartMap<K, V>;
    protected _current: V = null;

    constructor(map: DartMap<K, V>) {

        this._map = map;
        this._keys = map.keys.iterator;
    }

    moveNext(): bool {
        if (this._keys.moveNext()) {
            this._current = this._map[OPERATOR_INDEX](this._keys.current);
            return true;
        }
        this._current = null;
        return false;
    }

    get current(): V {
        return this._current;
    }

    next(value?: any): IteratorResult<V> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
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
@With(_UnmodifiableMapMixin)
class UnmodifiableMapBase<K, V> extends DartMapBase<K, V> {

}

/**
 * Helper class which implements complex [Map] operations
 * in term of basic ones ([Map.keys], [Map.[]],
 * [Map.[]=] and [Map.remove].)  Not all methods are
 * necessary to implement each particular operation.
 */
export namespace DartMaps {
    export function containsValue(map: DartMap<any, any>, value: any): bool {
        for (let v of map.values) {
            if (_dart.equals(v, value)) {
                return true;
            }
        }
        return false;
    }

    export function containsKey(map: DartMap<any, any>, key: any): bool {
        for (let k of map.keys) {
            if (_dart.equals(k, key)) {
                return true;
            }
        }
        return false;
    }

    export function putIfAbsent(map: DartMap<any, any>, key: any, ifAbsent: () => any): any {
        if (map.containsKey(key)) {
            return map[OPERATOR_INDEX](key);
        }
        let v = ifAbsent();
        map[OPERATOR_INDEX_ASSIGN](key, v);
        return v;
    }

    export function clear(map: DartMap<any, any>) {
        for (let k of map.keys.toList()) {
            map.remove(k);
        }
    }

    export function forEach(map: DartMap<any, any>, f: (key: any, value: any) => any) {
        for (let k of map.keys) {
            f(k, map[OPERATOR_INDEX](k));
        }
    }

    export function getValues(map: DartMap<any, any>): DartIterable<any> {
        return map.keys.map((key) => map[OPERATOR_INDEX](key));
    }

    export function length(map: DartMap<any, any>): int {
        return map.keys.length;
    }

    export function isEmpty(map: DartMap<any, any>): bool {
        return map.keys.isEmpty;
    }

    export function isNotEmpty(map: DartMap<any, any>): bool {
        return map.keys.isNotEmpty;
    }

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
    export function mapToString(m: DartMap<any, any>): string {
        // Reuse the list in IterableBase for detecting toString cycles.
        if (_isToStringVisiting(m)) {
            return '{...}';
        }

        let result = new DartStringBuffer();
        try {
            _toStringVisiting.add(m);
            result.write('{');
            let first: bool = true;
            m.forEach((k, v) => {
                if (!first) {
                    result.write(', ');
                }
                first = false;
                result.write(k);
                result.write(': ');
                result.write(v);
            });
            result.write('}');
        } finally {
            //assert(identical(_toStringVisiting.last, m));
            _toStringVisiting.removeLast();
        }

        return result.toString();
    }

    function _id(x) {
        return x;
    }

    /**
     * Fills a map with key/value pairs computed from [iterable].
     *
     * This method is used by Map classes in the named constructor fromIterable.
     */
    export function _fillMapWithMappedIterable(
        map: DartMap<any, any>, iterable: DartIterable<any>, key: (element: any) => any, value: (element: any) => any): void {
        if (key == null) key = _id;
        if (value == null) value = _id;

        for (let element of iterable) {
            map[OPERATOR_INDEX_ASSIGN](key(element), value(element));
        }
    }

    /**
     * Fills a map by associating the [keys] to [values].
     *
     * This method is used by Map classes in the named constructor fromIterables.
     */
    export function _fillMapWithIterables(map: DartMap<any, any>, keys: DartIterable<any>, values: DartIterable<any>): void {
        let keyIterator: DartIterator<any> = keys.iterator;
        let valueIterator: DartIterator<any> = values.iterator;

        let hasNextKey: bool = keyIterator.moveNext();
        let hasNextValue: bool = valueIterator.moveNext();

        while (hasNextKey && hasNextValue) {
            map[OPERATOR_INDEX_ASSIGN](keyIterator.current, valueIterator.current);
            hasNextKey = keyIterator.moveNext();
            hasNextValue = valueIterator.moveNext();
        }

        if (hasNextKey || hasNextValue) {
            throw new ArgumentError("Iterables do not have same length.");
        }
    }
}

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

/** A set used to identify cyclic lists during toString() calls. */
const _toStringVisiting: DartList<any> = new DartList<any>();

/** Check if we are currently visiting `o` in a toString call. */
function _isToStringVisiting(o: any): bool {
    for (let i = 0; i < _toStringVisiting.length; i++) {
        if (identical(o, _toStringVisiting[i])) return true;
    }
    return false;
}

export {UnmodifiableMapBase};
export {DartMapBase};
export {DartMapMixin};
export {DartListBase};
export {DartListMixin};
export {DartLinkedHashMap};
export {DartIterableBase};
export {DartIterableMixin};
export {DartLinkedHashSet};
export {DartHashSet};
export {DartHashMap};
export {DartUnmodifiableMapView};
export {DartSetBase};
export {DartSetMixin};// TODO(kasperl): Share this code with LinkedHashMapKeyIterator<E>?
// TODO(kasperl): Share this code with _HashMapKeyIterator<E>?
// TODO(floitsch): use ES6 maps when available.
export const _USE_ES6_MAPS: bool = true;

class _HashMap<K, V> implements DartHashMap<K, V> {
    protected _length: int = 0;

    // The hash map contents are divided into three parts: one part for
    // string keys, one for numeric keys, and one for the rest. String
    // and numeric keys map directly to their values, but the rest of
    // the entries are stored in bucket lists of the form:
    //
    //    [key-0, value-0, key-1, value-1, ...]
    //
    // where all keys in the same bucket share the same hash code.
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;

    // When iterating over the hash map, it is very convenient to have a
    // list of all the keys. We cache that on the instance and clear the
    // the cache whenever the key set changes. This is also used to
    // guard against concurrent modifications.
    protected _keys: DartList<any>;

    constructor() {

    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    get keys(): DartIterable<K> {
        return new _HashMapKeyIterable<K>(this);
    }

    get values(): DartIterable<V> {
        return new DartMappedIterable<K, V>(this.keys, (each) => this[OPERATOR_INDEX](each));
    }

    containsKey(key: any): bool {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashMap._hasTableEntry(strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashMap._hasTableEntry(nums, key);
        } else {
            return this._containsKey(key);
        }
    }

    _containsKey(key: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, key);
        return this._findBucketIndex(bucket, key) >= 0;
    }

    containsValue(value: any): bool {
        return this._computeKeys().any((each) => this[OPERATOR_INDEX](each) == value);
    }

    addAll(other: DartMap<K, V>): void {
        other.forEach((key: K, value: V) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }

    [OPERATOR_INDEX](key: any): V {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            return (strings == null) ? null : _HashMap._getTableEntry(strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            return (nums == null) ? null : _HashMap._getTableEntry(nums, key);
        } else {
            return this._get(key);
        }
    }

    protected _get(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        return (index < 0) ? null : bucket[index + 1] /* JS('var', '#[#]', bucket, index + 1)*/;
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        if (_HashMap._isStringKey(key)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _HashMap._newHashTable();
            this._addHashTableEntry(strings, key, value);
        } else if (_HashMap._isNumericKey(key)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _HashMap._newHashTable();
            this._addHashTableEntry(nums, key, value);
        } else {
            this._set(key, value);
        }
    }

    protected _set(key: K, value: V): void {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _HashMap._newHashTable();
        let hash = this._computeHashCode(key);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashMap._setTableEntry(rest, hash, [key, value] /* JS('var', '[#, #]', key, value)*/);
            this._length++;
            this._keys = null;
        } else {
            let index: int = this._findBucketIndex(bucket, key);
            if (index >= 0) {
                bucket[index + 1] = value;
                /* JS('void', '#[#] = #', bucket, index + 1, value); */
            } else {
                bucket.push(key, value);
                /* JS('void', '#.push(#, #)', bucket, key, value); */
                this._length++;
                this._keys = null;
            }
        }
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) return this[OPERATOR_INDEX](key);
        let value: V = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }

    remove(key: any): V {
        if (_HashMap._isStringKey(key)) {
            return this._removeHashTableEntry(this._strings, key);
        } else if (_HashMap._isNumericKey(key)) {
            return this._removeHashTableEntry(this._nums, key);
        } else {
            return this._remove(key);
        }
    }

    protected _remove(key: any): V {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, key);
        let index: int = this._findBucketIndex(bucket, key);
        if (index < 0) return null;
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        this._length--;
        this._keys = null;
        // Use splice to remove the two [key, value] elements at the
        // index and return the value.
        return bucket.splice(index, 2)[1] /* JS('var', '#.splice(#, 2)[1]', bucket, index)*/;
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._keys = null;
            this._length = 0;
        }
    }

    forEach(action: (key: K, value: V) => any): void {
        let keys: DartList<any> = this._computeKeys();
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i] /* JS('var', '#[#]', keys, i)*/;
            action(key, this[OPERATOR_INDEX](key));
            if (keys !== this._keys /* JS('bool', '# !== #', keys, _keys)*/) {
                throw new ConcurrentModificationError(this);
            }
        }
    }

    protected _computeKeys(): DartList<any> {
        if (this._keys != null) return this._keys;
        let result: DartList<any> = new DartList(this._length);
        let index = 0;

        // Add all string keys to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /* JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let key: string = names[i] /* JS('String', '#[#]', names, i)*/;
                result[OPERATOR_INDEX_ASSIGN](index, key);
                /* JS('void', '#[#] = #', result, index, key);*/
                index++;
            }
        }

        // Add all numeric keys to the list.
        let nums = this._nums;
        if (nums != null) {
            var names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the keys back to numbers (+).
                let key: int = +names[i] /* JS('num', '+#[#]', names, i)*/;
                result[OPERATOR_INDEX_ASSIGN](index, key);
                /* JS('void', '#[#] = #', result, index, key);*/
                index++;
            }
        }

        // Add all the remaining keys to the list.
        var rest = this._rest;
        if (rest != null) {
            var names = Object.getOwnPropertyNames(rest) /* JS('var', 'Object.getOwnPropertyNames(#)', rest)*/;
            let entries = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let key = names[i] /* JS('String', '#[#]', names, i)*/;
                let bucket = rest[key] /* JS('var', '#[#]', rest, key)*/;
                let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
                for (let i = 0; i < length; i += 2) {
                    let key = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
                    result[OPERATOR_INDEX_ASSIGN](index, key);
                    /* JS('void', '#[#] = #', result, index, key); */
                    index++;
                }
            }
        }
        //assert(index == _length);
        return this._keys = result;
    }

    protected _addHashTableEntry(table: any, key: K, value: V): void {
        if (!_HashMap._hasTableEntry(table, key)) {
            this._length++;
            this._keys = null;
        }
        _HashMap._setTableEntry(table, key, value);
    }

    _removeHashTableEntry(table: any, key: any): V {
        if (table != null && _HashMap._hasTableEntry(table, key)) {
            let value: V = _HashMap._getTableEntry(table, key);
            _HashMap._deleteTableEntry(table, key);
            this._length--;
            this._keys = null;
            return value;
        } else {
            return null;
        }
    }

    protected static _isStringKey(key: any): bool {
        return _dart.is(key, 'string') && key != '__proto__';
    }

    protected static _isNumericKey(key: any): bool {
        // Only treat unsigned 30-bit integers as numeric keys. This way,
        // we avoid converting them to strings when we use them as keys in
        // the JavaScript hash table object.
        return _dart.is(key, 'num') && (key & 0x3ffffff) === key /*JS('bool', '(# & 0x3ffffff) === #', key, key)*/;
    }

    protected _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return key.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', key.hashCode)*/;
    }

    protected static _hasTableEntry(table: any, key: any): bool {
        let entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }

    protected static _getTableEntry(table: any, key: any): any {
        let entry = table[key] /* JS('var', '#[#]', table, key)*/;
        // We store the table itself as the entry to signal that it really
        // is a null value, so we have to map back to null here.
        return entry === table /*JS('bool', '# === #', entry, table)*/ ? null : entry;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        // We only store non-null entries in the table, so we have to
        // change null values to refer to the table itself. Such values
        // will be recognized and mapped back to null on access.
        if (value == null) {
            // Do not update [value] with [table], otherwise our
            // optimizations could be confused by this opaque object being
            // now used for more things than storing and fetching from it.
            table[key] = table;
            /* JS('void', '#[#] = #', table, key, table); */
        } else {
            table[key] = value;
            /* JS('void', '#[#] = #', table, key, value);*/
        }
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        delete table[key];
        /* JS('void', 'delete #[#]', table, key); */
    }

    protected _getBucket(table: any, key: any): Array<any> {
        let hash = this._computeHashCode(key);
        return table[hash] /* JS('var', '#[#]', table, hash) */;
    }

    protected _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (_dart.equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        let table = Object.create(null) /* JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        let temporaryKey = '<non-identifier-key>';
        _HashMap._setTableEntry(table, temporaryKey, table);
        _HashMap._deleteTableEntry(table, temporaryKey);
        return table;
    }

    get(k: K): V {
        return this[OPERATOR_INDEX](k);
    }

    set(k: K, v: V) {
        this[OPERATOR_INDEX_ASSIGN](k, v);
    }
}

class _IdentityHashMap<K, V> extends _HashMap<K, V> {

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (identical(bucket[i]/*JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }
}

class _CustomHashMap<K, V> extends _HashMap<K, V> {
    protected _equals: _Equality<K>;
    protected _hashCode: _Hasher<K>;
    protected _validKey: _Predicate<any>;

    constructor(_equals: _Equality<K>, _hashCode: _Hasher<K>, validKey: (potentialKey: any) => bool) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((_: any) => true /*v is K*/);
    }

    [OPERATOR_INDEX](key: any): V {
        if (!this._validKey(key)) return null;
        return super._get(key);
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        super._set(key, value);
    }

    containsKey(key: any): bool {
        if (!this._validKey(key)) return false;
        return super._containsKey(key);
    }

    remove(key: any): V {
        if (!this._validKey(key)) return null;
        return super._remove(key);
    }

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }

    _findBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i += 2) {
            if (this._equals(bucket[i] /* JS('var', '#[#]', bucket, i)*/, key)) return i;
        }
        return -1;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
}

class _HashMapKeyIterable<E> extends DartEfficientLengthIterable<E> {
    protected _map: any;

    constructor(_map: any) {
        super();
        this._map = _map;
    }

    get length(): int {
        return this._map._length;
    }

    get isEmpty(): bool {
        return this._map._length == 0;
    }

    get iterator(): DartIterator<E> {
        return new _HashMapKeyIterator<E>(this._map, this._map._computeKeys());
    }

    contains(element: any): bool {
        return this._map.containsKey(element);
    }

    forEach(f: (element: E) => any): void {
        let keys: DartList<any> = this._map._computeKeys();
        for (let i = 0, length = keys.length /* JS('int', '#.length', keys)*/; i < length; i++) { // TODO: investigate why this was using the js length property
            f(keys[OPERATOR_INDEX](i)/*JS('var', '#[#]', keys, i)*/); // <- TODO :Investigate why this was using the js square operator, it can be because of optimization reasons ? like we are sure here it is the native implementation of list and thus the square operator works ?
            if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}

class _HashMapKeyIterator<E> implements DartIterator<E> {
    protected _map: any;
    protected _keys: DartList<any>;
    protected _offset: int = 0;
    protected _current: E;

    constructor(_map: any, _keys: DartList<any>) {
        this._map = _map;
        this._keys = _keys;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        let keys = this._keys;
        let offset = this._offset;
        if (keys !== this._map._keys /* JS('bool', '# !== #', keys, _map._keys)*/) {
            throw new ConcurrentModificationError(this._map);
        } else if (offset >= keys.length /* JS('int', '#.length', keys)*/) {
            this._current = null;
            return false;
        } else {
            this._current = keys[OPERATOR_INDEX](offset) /* JS('var', '#[#]', keys, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /* JS('int', '#', offset + 1)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

@DartClass
class _LinkedIdentityHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    protected static get _supportsEs6Maps(): bool {
        return typeof Map != 'undefined' /* JS('returns:bool;depends:none;effects:none;throws:never;gvn:true',
            'typeof Map != "undefined"')*/;
    }

    @namedFactory
    protected static _es6<K, V>(): _LinkedIdentityHashMap<K, V> {
        return (_USE_ES6_MAPS && _LinkedIdentityHashMap._supportsEs6Maps)
            ? new _Es6LinkedIdentityHashMap<K, V>()
            : new _LinkedIdentityHashMap<K, V>();
    }

    static es6: new<K, V>() => _LinkedIdentityHashMap<K, V>;

    constructor() {
        super();
    }

    internalComputeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /* JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    internalFindBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell: LinkedHashMapCell<K, V> = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell.hashMapCellKey, key)) return i;
        }
        return -1;
    }
}

class _Es6LinkedIdentityHashMap<K, V> extends _LinkedIdentityHashMap<K, V> {
    _map: Map<K, V>;
    _modifications: int = 0;

    constructor() {
        super();
        this._map = new Map() /* JS('var', 'new Map()')*/;
    }

    get length(): int {
        return this._map.size /* JS('int', '#.size', _map)*/;
    }

    get isEmpty(): bool {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    get keys(): DartIterable<K> {
        return new _Es6MapIterable<K>(this, true);
    }

    get values(): DartIterable<V> {
        return new _Es6MapIterable<V>(this, false);
    }

    containsKey(key: any): bool {
        return this._map.has(key) /* JS('bool', '#.has(#)', _map, key)*/;
    }

    containsValue(value: any): bool {
        return this.values.any((each) => _dart.equals(each, value)); // TODO : here a simple equality could be enough ? (this is an itentify hashmap after all)
    }

    addAll(other: DartMap<K, V>): void {
        other.forEach((key, value) => {
            this[OPERATOR_INDEX_ASSIGN](key, value);
        });
    }

    [OPERATOR_INDEX](key: any): V {
        return this._map.get(key) /*JS('var', '#.get(#)', _map, key)*/;
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V): void {
        /*JS('var', '#.set(#, #)', _map, key, value);*/
        this._map.set(key, value);
        this._modified();
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        if (this.containsKey(key)) return this[OPERATOR_INDEX](key);
        let value = ifAbsent();
        this[OPERATOR_INDEX_ASSIGN](key, value);
        return value;
    }

    remove(key: any): V {
        let value = this[OPERATOR_INDEX](key);
        /* JS('bool', '#.delete(#)', _map, key);*/
        this._map.delete(key);
        this._modified();
        return value;
    }

    clear(): void {
        /* JS('void', '#.clear()', _map);*/
        this._map.clear();
        this._modified();
    }

    forEach(action: (key: K, value: V) => any): void {
        let jsEntries = this._map.entries() /* JS('var', '#.entries()', _map)*/;
        let modifications = this._modifications;
        while (true) {
            let next = jsEntries.next() /*JS('var', '#.next()', jsEntries)*/;
            let done = next.done /*JS('bool', '#.done', next)*/;
            if (done) break;
            let entry = next.value /* JS('var', '#.value', next)*/;
            let key = entry[0] /* JS('var', '#[0]', entry)*/;
            let value = entry[1] /* JS('var', '#[1]', entry)*/;
            action(key, value);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
        }
    }

    protected _modified(): void {
        // Value cycles after 2^30 modifications so that modification counts are
        // always unboxed (Smi) values. Modification detection will be missed if you
        // make exactly some multiple of 2^30 modifications between advances of an
        // iterator.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }
}

class _Es6MapIterable<E> extends DartEfficientLengthIterable<E> {
    protected _map: _Es6LinkedIdentityHashMap<any, any>;
    protected _isKeys: bool;

    constructor(_map: _Es6LinkedIdentityHashMap<any, any>, _isKeys: bool) {
        super();
        this._map = _map;
        this._isKeys = _isKeys;
    }

    get length(): int {
        return this._map.length;
    }

    get isEmpty(): bool {
        return this._map.isEmpty;
    }

    get iterator(): DartIterator<E> {
        return new _Es6MapIterator<E>(this._map, this._map._modifications, this._isKeys);
    }

    contains(element): bool {
        return this._isKeys ? this._map.containsKey(element) : this._map.containsValue(element);
    }

    forEach(f: (element: E) => any): void {
        let jsIterator;
        if (this._isKeys) {
            jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        } else {
            jsIterator = this._map._map.values() /* JS('var', '#.values()', _map._map)*/;
        }
        let modifications = this._map._modifications;
        while (true) {
            let next = jsIterator.next() /* JS('var', '#.next()', jsIterator)*/;
            let done = next.done /* JS('bool', '#.done', next)*/;
            if (done) break;
            let value = next.value /* JS('var', '#.value', next)*/;
            f(value);
            if (modifications != this._map._modifications) {
                throw new ConcurrentModificationError(this._map);
            }
        }
    }
}

class _Es6MapIterator<E> implements DartIterator<E> {
    protected _map: _Es6LinkedIdentityHashMap<any, any>;
    protected _modifications: int;
    protected _isKeys: bool;
    protected _jsIterator: Iterator<any>;
    protected _next: IteratorResult<any>;
    protected _current: E;
    protected _done: bool;

    constructor(_map: _Es6LinkedIdentityHashMap<any, any>,
                _modifications: int,
                _isKeys: bool
    ) {
        this._map = _map;
        this._modifications = _modifications;
        this._isKeys = _isKeys;
        if (_isKeys) {
            this._jsIterator = this._map._map.keys() /* JS('var', '#.keys()', _map._map)*/;
        } else {
            this._jsIterator = this._map._map.values() /*JS('var', '#.values()', _map._map)*/;
        }
        this._done = false;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        if (this._modifications != this._map._modifications) {
            throw new ConcurrentModificationError(this._map);
        }
        if (this._done) return false;
        this._next = this._jsIterator.next() /*JS('var', '#.next()', _jsIterator)*/;
        let done = this._next.done /* JS('bool', '#.done', _next)*/;
        if (done) {
            this._current = null;
            this._done = true;
            return false;
        } else {
            this._current = this._next.value /* JS('var', '#.value', _next)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

class _LinkedCustomHashMap<K, V> extends DartJsLinkedHashMap<K, V> {
    protected _equals: _Equality<K>;
    protected _hashCode: _Hasher<K>;
    protected _validKey: _Predicate<any>;

    constructor(_equals: _Equality<K>,
                _hashCode: _Hasher<K>, validKey: (potentialKey) => bool) {
        super();
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey != null) ? validKey : ((v) => true);
    }

    [OPERATOR_INDEX](key) {
        if (!this._validKey(key)) return null;
        return super.internalGet(key);
    }

    [OPERATOR_INDEX_ASSIGN](key: K, value: V) {
        super.internalSet(key, value);
    }

    containsKey(key): bool {
        if (!this._validKey(key)) return false;
        return super.internalContainsKey(key);
    }

    remove(key: any): V {
        if (!this._validKey(key)) return null;
        return super.internalRemove(key);
    }

    internalComputeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return this._hashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hashCode(key))*/;
    }

    internalFindBucketIndex(bucket: any, key: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < this.length; i++) {
            let cell: LinkedHashMapCell<K, V> = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (this._equals(cell.hashMapCellKey, key)) return i;
        }
        return -1;
    }
}

class _HashSet<E> extends _HashSetBase<E> implements DartHashSet<E> {
    protected _length: int = 0;

    // The hash set contents are divided into three parts: one part for
    // string elements, one for numeric elements, and one for the
    // rest. String and numeric elements map directly to a sentinel
    // value, but the rest of the entries are stored in bucket lists of
    // the form:
    //
    //    [element-0, element-1, element-2, ...]
    //
    // where all elements in the same bucket share the same hash code.
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;

    // When iterating over the hash set, it is very convenient to have a
    // list of all the elements. We cache that on the instance and clear
    // the cache whenever the set changes. This is also used to
    // guard against concurrent modifications.
    _elements: Array<E>;

    constructor() {
        super();
    }

    protected _newSet(): DartSet<E> {
        return new _HashSet<E>();
    }

    // Iterable.
    get iterator(): DartIterator<E> {
        return new _HashSetIterator<E>(this, this._computeElements());
    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    contains(object: any): bool {
        if (_HashSet._isStringElement(object)) {
            let strings = this._strings;
            return (strings == null) ? false : _HashSet._hasTableEntry(strings, object);
        } else if (_HashSet._isNumericElement(object)) {
            let nums = this._nums;
            return (nums == null) ? false : _HashSet._hasTableEntry(nums, object);
        } else {
            return this._contains(object);
        }
    }

    protected _contains(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }

    lookup(object: any): E {
        if (_HashSet._isStringElement(object) || _HashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        }
        return this._lookup(object);
    }

    protected _lookup(object: any): E {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return null;
        return bucket[index];
    }

    // Collection.
    add(element: E): bool {
        if (_HashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _HashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        } else if (_HashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _HashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        } else {
            return this._add(element);
        }
    }

    protected _add(element: E): bool {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _HashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = rest[hash] /* JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {
            _HashSet._setTableEntry(rest, hash, [element] /*JS('var', '[#]', element)*/);
        } else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0) return false;
            /*JS('void', '#.push(#)', bucket, element);*/
            bucket.push(element);
        }
        this._length++;
        this._elements = null;
        return true;
    }

    addAll(objects: DartIterable<E>): void {
        for (let each of objects) {
            this.add(each);
        }
    }

    remove(object: any): bool {
        if (_HashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        } else if (_HashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        } else {
            return this._remove(object);
        }
    }

    protected _remove(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        var bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
        // TODO(kasperl): Consider getting rid of the bucket list when
        // the length reaches zero.
        this._length--;
        this._elements = null;
        // TODO(kasperl): It would probably be faster to move the
        // element to the end and reduce the length of the bucket list.
        /*JS('void', '#.splice(#, 1)', bucket, index);*/
        bucket.splice(index, 1);
        return true;
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._elements = null;
            this._length = 0;
        }
    }

    _computeElements(): Array<E> {
        if (this._elements != null) return this._elements;
        let result = new Array(this._length);
        let index = 0;

        // Add all string elements to the list.
        let strings = this._strings;
        if (strings != null) {
            let names = Object.getOwnPropertyNames(strings) /*JS('var', 'Object.getOwnPropertyNames(#)', strings)*/;
            let entries = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let element: string = names[i] /*JS('String', '#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }

        // Add all numeric elements to the list.
        let nums = this._nums;
        if (nums != null) {
            let names = Object.getOwnPropertyNames(nums) /* JS('var', 'Object.getOwnPropertyNames(#)', nums)*/;
            let entries: int = names.length /* JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                // Object.getOwnPropertyNames returns a list of strings, so we
                // have to convert the elements back to numbers (+).
                let element: num = +names[i] /* JS('num', '+#[#]', names, i)*/;
                /* JS('void', '#[#] = #', result, index, element);*/
                result[index] = element;
                index++;
            }
        }

        // Add all the remaining elements to the list.
        let rest = this._rest;
        if (rest != null) {
            let names = Object.getOwnPropertyNames(rest) /*JS('var', 'Object.getOwnPropertyNames(#)', rest)*/;
            let entries: int = names.length /*JS('int', '#.length', names)*/;
            for (let i = 0; i < entries; i++) {
                let entry = names[i] /* JS('String', '#[#]', names, i)*/;
                let bucket = rest[entry] /*JS('var', '#[#]', rest, entry)*/;
                let length: int = bucket.length /*JS('int', '#.length', bucket)*/;
                for (let i = 0; i < length; i++) {
                    /* JS('void', '#[#] = #[#]', result, index, bucket, i);*/
                    result[index] = bucket[i];
                    index++;
                }
            }
        }
        //assert(index == _length);
        return this._elements = result;
    }

    protected _addHashTableEntry(table: any, element: E): bool {
        if (_HashSet._hasTableEntry(table, element)) return false;
        _HashSet._setTableEntry(table, element, 0);
        this._length++;
        this._elements = null;
        return true;
    }

    protected _removeHashTableEntry(table: any, element: any): bool {
        if (table != null && _HashSet._hasTableEntry(table, element)) {
            _HashSet._deleteTableEntry(table, element);
            this._length--;
            this._elements = null;
            return true;
        } else {
            return false;
        }
    }

    protected static _isStringElement(element: any): bool {
        return _dart.is(element, 'string') && element != '__proto__';
    }

    protected static _isNumericElement(element: any): bool {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element
            /*JS('bool', '(# & 0x3ffffff) === #', element, element)*/;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /*JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }

    protected static _hasTableEntry(table: any, key: any): bool {
        var entry = table[key] /*JS('var', '#[#]', table, key)*/;
        // We take care to only store non-null entries in the table, so we
        // can check if the table has an entry for the given key with a
        // simple null check.
        return entry != null;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        /* JS('void', 'delete #[#]', table, key);*/
        delete table[key];
    }

    protected _getBucket(table: any, element: any): Array<any> {
        let hash = this._computeHashCode(element);
        return table[hash] /* JS('var', '#[#]', table, hash)*/;
    }

    protected _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (_dart.equals(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        var table = Object.create(null) /*JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        var temporaryKey = '<non-identifier-key>';
        _HashSet._setTableEntry(table, temporaryKey, table);
        _HashSet._deleteTableEntry(table, temporaryKey);
        return table;
    }
}

class _IdentityHashSet<E> extends _HashSet<E> {
    protected _newSet(): DartSet<E> {
        return new _IdentityHashSet<E>();
    }

    _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    protected _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (identical(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }
}

class _CustomHashSet<E> extends _HashSet<E> {
    protected _equality: _Equality<E>;
    protected _hasher: _Hasher<E>;
    protected _validKey: _Predicate<any>;

    constructor(_equality, _hasher, validKey: (potentialKey: any) => bool) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }

    protected _newSet(): DartSet<E> {
        return new _CustomHashSet<E>(this._equality, this._hasher, this._validKey);
    }

    _findBucketIndex(bucket: any, element: any): int {
        if (bucket == null) return -1;
        let length = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            if (this._equality(bucket[i] /*JS('var', '#[#]', bucket, i)*/, element)) return i;
        }
        return -1;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }

    add(object: E): bool {
        return super._add(object);
    }

    contains(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._contains(object);
    }

    lookup(object: any): E {
        if (!this._validKey(object)) return null;
        return super._lookup(object);
    }

    remove(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._remove(object);
    }
}

class _HashSetIterator<E> implements DartIterator<E> {
    protected _set: _HashSet<E>;
    protected _elements: Array<E>;
    protected _offset: int = 0;
    protected _current: E;

    constructor(_set: _HashSet<E>, _elements: Array<E>) {
        this._set = _set;
        this._elements = _elements;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        let elements = this._elements;
        let offset: int = this._offset;
        if (elements !== this._set._elements /*JS('bool', '# !== #', elements, _set._elements)*/) {
            throw new ConcurrentModificationError(this._set);
        } else if (offset >= elements.length /*JS('int', '#.length', elements)*/) {
            this._current = null;
            return false;
        } else {
            this._current = elements[offset] /* JS('var', '#[#]', elements, offset)*/;
            // TODO(kasperl): For now, we have to tell the type inferrer to
            // treat the result of doing offset + 1 as an int. Otherwise, we
            // get unnecessary bailout code.
            this._offset = offset + 1 /*JS('int', '#', offset + 1)*/;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

class _LinkedHashSet<E> extends _HashSetBase<E> implements DartLinkedHashSet<E> {
    protected _length: int = 0;

    // The hash set contents are divided into three parts: one part for
    // string elements, one for numeric elements, and one for the
    // rest. String and numeric elements map directly to their linked
    // cells, but the rest of the entries are stored in bucket lists of
    // the form:
    //
    //    [cell-0, cell-1, ...]
    //
    // where all elements in the same bucket share the same hash code.
    protected _strings: any;
    protected _nums: any;
    protected _rest: any;

    // The elements are stored in cells that are linked together
    // to form a double linked list.
    _first: _LinkedHashSetCell<E>;
    protected _last: _LinkedHashSetCell<E>;

    // We track the number of modifications done to the element set to
    // be able to throw when the set is modified while being iterated
    // over.
    _modifications: int = 0;

    constructor() {
        super();
    }

    protected _newSet(): DartSet<E> {
        return new _LinkedHashSet<E>();
    }

    protected _unsupported(operation: string): void {
        throw 'LinkedHashSet: unsupported $operation';
    }

    // Iterable.
    get iterator(): DartIterator<E> {
        return new _LinkedHashSetIterator(this, this._modifications);
    }

    get length(): int {
        return this._length;
    }

    get isEmpty(): bool {
        return this._length == 0;
    }

    get isNotEmpty() {
        return !this.isEmpty;
    }

    contains(object: any): bool {
        if (_LinkedHashSet._isStringElement(object)) {
            let strings = this._strings;
            if (strings == null) return false;
            let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(strings, object);
            return cell != null;
        } else if (_LinkedHashSet._isNumericElement(object)) {
            let nums = this._nums;
            if (nums == null) return false;
            let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(nums, object);
            return cell != null;
        } else {
            return this._contains(object);
        }
    }

    protected _contains(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
    }

    lookup(object: any): E {
        if (_LinkedHashSet._isStringElement(object) || _LinkedHashSet._isNumericElement(object)) {
            return this.contains(object) ? object : null;
        } else {
            return this._lookup(object);
        }
    }

    _lookup(object: any): E {
        let rest = this._rest;
        if (rest == null) return null;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return null;
        return bucket[index]._element;
    }

    forEach(action: (element: E) => void): void {
        let cell: _LinkedHashSetCell<E> = this._first;
        let modifications = this._modifications;
        while (cell != null) {
            action(cell._element);
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            cell = cell._next;
        }
    }

    get first(): E {
        if (this._first == null) throw new StateError("No elements");
        return this._first._element;
    }

    get last(): E {
        if (this._last == null) throw new StateError("No elements");
        return this._last._element;
    }

    // Collection.
    add(element: E): bool {
        if (_LinkedHashSet._isStringElement(element)) {
            let strings = this._strings;
            if (strings == null) this._strings = strings = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(strings, element);
        } else if (_LinkedHashSet._isNumericElement(element)) {
            let nums = this._nums;
            if (nums == null) this._nums = nums = _LinkedHashSet._newHashTable();
            return this._addHashTableEntry(nums, element);
        } else {
            return this._add(element);
        }
    }

    protected _add(element: E): bool {
        let rest = this._rest;
        if (rest == null) this._rest = rest = _LinkedHashSet._newHashTable();
        let hash = this._computeHashCode(element);
        let bucket: Array<_LinkedHashSetCell<E>> = rest[hash] /*JS('var', '#[#]', rest, hash)*/;
        if (bucket == null) {

            let cell: _LinkedHashSetCell<E> = this._newLinkedCell(element);
            _LinkedHashSet._setTableEntry(rest, hash, [cell] /*JS('var', '[#]', cell)*/);
        } else {
            let index = this._findBucketIndex(bucket, element);
            if (index >= 0) return false;
            let cell: _LinkedHashSetCell<E> = this._newLinkedCell(element);
            /*JS('void', '#.push(#)', bucket, cell);*/
            bucket.push(cell);
        }
        return true;
    }

    remove(object: any): bool {
        if (_LinkedHashSet._isStringElement(object)) {
            return this._removeHashTableEntry(this._strings, object);
        } else if (_LinkedHashSet._isNumericElement(object)) {
            return this._removeHashTableEntry(this._nums, object);
        } else {
            return this._remove(object);
        }
    }

    protected _remove(object: any): bool {
        let rest = this._rest;
        if (rest == null) return false;
        let bucket: Array<_LinkedHashSetCell<E>> = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
        // Use splice to remove the [cell] element at the index and
        // unlink it.
        let cell = bucket.splice(index, 1)[0] /*JS('var', '#.splice(#, 1)[0]', bucket, index)*/;
        this._unlinkCell(cell);
        return true;
    }

    removeWhere(test: (element: E) => bool): void {
        this._filterWhere(test, true);
    }

    retainWhere(test: (element: E) => bool): void {
        this._filterWhere(test, false);
    }

    protected _filterWhere(test: (element: E) => bool, removeMatching: bool): void {
        let cell: _LinkedHashSetCell<E> = this._first;
        while (cell != null) {
            let element: E = cell._element;
            let next = cell._next;
            let modifications = this._modifications;
            let shouldRemove = (removeMatching == test(element));
            if (modifications != this._modifications) {
                throw new ConcurrentModificationError(this);
            }
            if (shouldRemove) this.remove(element);
            cell = next;
        }
    }

    clear(): void {
        if (this._length > 0) {
            this._strings = this._nums = this._rest = this._first = this._last = null;
            this._length = 0;
            this._modified();
        }
    }

    protected _addHashTableEntry(table: any, element: E): bool {
        let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(table, element);
        if (cell != null) return false;
        _LinkedHashSet._setTableEntry(table, element, this._newLinkedCell(element));
        return true;
    }

    protected _removeHashTableEntry(table: any, element: any): bool {
        if (table == null) return false;
        let cell: _LinkedHashSetCell<E> = _LinkedHashSet._getTableEntry(table, element);
        if (cell == null) return false;
        this._unlinkCell(cell);
        _LinkedHashSet._deleteTableEntry(table, element);
        return true;
    }

    protected _modified(): void {
        // Value cycles after 2^30 modifications. If you keep hold of an
        // iterator for that long, you might miss a modification
        // detection, and iteration can go sour. Don't do that.
        this._modifications = (this._modifications + 1) & 0x3ffffff;
    }

// Create a new cell and link it in as the last one in the list.

    _newLinkedCell(element: E): _LinkedHashSetCell<E> {
        let cell: _LinkedHashSetCell<E> = new _LinkedHashSetCell<E>(element);
        if (this._first == null) {
            this._first = this._last = cell;
        } else {
            let last: _LinkedHashSetCell<E> = this._last;
            cell._previous = last;
            this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
    }

    // Unlink the given cell from the linked list of cells.
    protected _unlinkCell(cell: _LinkedHashSetCell<E>): void {
        let previous: _LinkedHashSetCell<E> = cell._previous;
        let next: _LinkedHashSetCell<E> = cell._next;
        if (previous == null) {
            // assert(cell == _first);
            this._first = next;
        } else {
            previous._next = next;
        }
        if (next == null) {
            //assert(cell == _last);
            this._last = previous;
        } else {
            next._previous = previous;
        }
        this._length--;
        this._modified();
    }

    protected static _isStringElement(element: any): bool {
        return _dart.is(element, 'string') && element != '__proto__';
    }

    protected static _isNumericElement(element: any): bool {
        // Only treat unsigned 30-bit integers as numeric elements. This
        // way, we avoid converting them to strings when we use them as
        // keys in the JavaScript hash table object.
        return _dart.is(element, 'num') && (element & 0x3ffffff) === element
            /*JS('bool', '(# & 0x3ffffff) === #', element, element)*/;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return element.hashCode & 0x3ffffff /* JS('int', '# & 0x3ffffff', element.hashCode)*/;
    }

    protected static _getTableEntry(table: any, key: any) {
        return table[key] /*JS('var', '#[#]', table, key)*/;
    }

    protected static _setTableEntry(table: any, key: any, value: any): void {
        //assert(value != null);
        /* JS('void', '#[#] = #', table, key, value);*/
        table[key] = value;
    }

    protected static _deleteTableEntry(table: any, key: any): void {
        //JS('void', 'delete #[#]', table, key);
        delete table[key];
    }

    protected _getBucket(table: any, element: E): Array<_LinkedHashSetCell<E>> {
        let hash = this._computeHashCode(element);
        return table[hash] /*JS('var', '#[#]', table, hash)*/;
    }

    protected _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length: int = bucket.length /*JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /*JS('var', '#[#]', bucket, i)*/;
            if (_dart.equals(cell._element, element)) return i;
        }
        return -1;
    }

    protected static _newHashTable() {
        // Create a new JavaScript object to be used as a hash table. Use
        // Object.create to avoid the properties on Object.prototype
        // showing up as entries.
        let table = Object.create(null) /*JS('var', 'Object.create(null)')*/;
        // Attempt to force the hash table into 'dictionary' mode by
        // adding a property to it and deleting it again.
        let temporaryKey = '<non-identifier-key>';
        _LinkedHashSet._setTableEntry(table, temporaryKey, table);
        _LinkedHashSet._deleteTableEntry(table, temporaryKey);
        return table;
    }
}

class _LinkedIdentityHashSet<E> extends _LinkedHashSet<E> {
    protected _newSet(): DartSet<E> {
        return new _LinkedIdentityHashSet<E>();
    }

    protected _computeHashCode(key: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic keys like '__proto__'. Another option
        // would be to throw an exception if the hash code isn't a number.
        return identityHashCode(key) & 0x3ffffff /*  JS('int', '# & 0x3ffffff', identityHashCode(key))*/;
    }

    _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell: _LinkedHashSetCell<E> = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (identical(cell._element, element)) return i;
        }
        return -1;
    }
}

class _LinkedCustomHashSet<E> extends _LinkedHashSet<E> {
    protected _equality: _Equality<E>;
    protected _hasher: _Hasher<E>;
    protected _validKey: _Predicate<any>;

    constructor(
        _equality: _Equality<E>, _hasher: _Hasher<E>, validKey: (potentialKey) => bool) {
        super();
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey != null) ? validKey : ((x) => true);
    }

    protected _newSet(): DartSet<E> {
        return new _LinkedCustomHashSet<E>(this._equality, this._hasher, this._validKey);
    }

    protected _findBucketIndex(bucket: Array<_LinkedHashSetCell<E>>, element: E): int {
        if (bucket == null) return -1;
        let length = bucket.length /* JS('int', '#.length', bucket)*/;
        for (let i = 0; i < length; i++) {
            let cell = bucket[i] /* JS('var', '#[#]', bucket, i)*/;
            if (this._equality(cell._element, element)) return i;
        }
        return -1;
    }

    protected _computeHashCode(element: any): int {
        // We force the hash codes to be unsigned 30-bit integers to avoid
        // issues with problematic elements like '__proto__'. Another
        // option would be to throw an exception if the hash code isn't a
        // number.
        return this._hasher(element) & 0x3ffffff /*JS('int', '# & 0x3ffffff', _hasher(element))*/;
    }

    add(element: E): bool {
        return super._add(element);
    }

    contains(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._contains(object);
    }

    lookup(object: any): E {
        if (!this._validKey(object)) return null;
        return super._lookup(object);
    }

    remove(object: any): bool {
        if (!this._validKey(object)) return false;
        return super._remove(object);
    }

    containsAll(elements: DartIterable<any>): bool {
        for (let element in elements) {
            if (!this._validKey(element) || !this.contains(element)) return false;
        }
        return true;
    }

    removeAll(elements: DartIterable<any>): void {
        for (let element of elements) {
            if (this._validKey(element)) {
                super._remove(element);
            }
        }
    }
}

class _LinkedHashSetCell<E> {
    _element: E;

    _next: _LinkedHashSetCell<E>;
    _previous: _LinkedHashSetCell<E>;

    constructor(element: E) {
        this._element = element;
    }
}

class _LinkedHashSetIterator<E> implements DartIterator<E> {
    protected _set: _LinkedHashSet<E>;
    protected _modifications: int;
    protected _cell: _LinkedHashSetCell<E>;
    protected _current: E;

    constructor(_set: _LinkedHashSet<E>, _modifications: int) {
        this._set = _set;
        this._modifications = _modifications;
        this._cell = _set._first;
    }

    get current(): E {
        return this._current;
    }

    moveNext(): bool {
        if (this._modifications != this._set._modifications) {
            throw new ConcurrentModificationError(this._set);
        } else if (this._cell == null) {
            this._current = null;
            return false;
        } else {
            this._current = this._cell._element;
            this._cell = this._cell._next;
            return true;
        }
    }

    next(value?: any): IteratorResult<E> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}