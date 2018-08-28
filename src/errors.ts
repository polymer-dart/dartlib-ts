import _dart from './_common';

/**
 * The operation was not allowed by the object.
 *
 * This [Error] is thrown when an instance cannot implement one of the methods
 * in its signature.
 */
import {DartObject, int, num} from "./core";
import {DartClass, DartConstructor, defaultConstructor, namedConstructor} from "./utils";

export class DartError extends Error {
    static safeToString(object: DartObject): string {
        if (_dart.is(object, 'num') || _dart.is(object, 'bool') || null == object) {
            return object.toString();
        }
        if (_dart.is(object, 'string')) {
            return DartError._stringToSafeString(object);
        }
        return DartError._objectToString(object);
    }

    static _stringToSafeString(o: DartObject): string {
        return `${o}`;
    }

    static _objectToString(o: DartObject): string {
        return `${o}`;
    }
}

export class UnsupportedError extends DartError {
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    toString(): string {
        return `Unsupported operation: ${this.message}`;
    }
}


/**
 * Error occurring when a collection is modified during iteration.
 *
 * Some modifications may be allowed for some collections, so each collection
 * ([Iterable] or similar collection of values) should declare which operations
 * are allowed during an iteration.
 */
export class ConcurrentModificationError extends DartError {
    /** The object that was modified in an incompatible way. */
    modifiedObject: DartObject;

    constructor(modifiedObject?: DartObject) {
        super();
        this.modifiedObject = modifiedObject;
    };

    toString(): string {
        if (this.modifiedObject == null) {
            return "Concurrent modification during iteration.";
        }
        return `Concurrent modification during iteration:` +
            `${DartError.safeToString(this.modifiedObject)}.`;
    }
}


/**
 * Error thrown when a function is passed an unacceptable argument.
 */
@DartClass
export class ArgumentError extends DartError {
    /** Whether value was provided. */
    _hasValue: boolean;
    /** The invalid value. */
    invalidValue: any;
    /** Name of the invalid argument, if available. */
    name: string;
    /** Message describing the problem. */
    message: string;

    /**
     * The [message] describes the erroneous argument.
     *
     * Existing code may be using `message` to hold the invalid value.
     * If the `message` is not a [String], it is assumed to be a value instead
     * of a message.
     */
    @defaultConstructor
    protected ArgumentError(message?: string) {
        this.message = message;
        this.invalidValue = null;
        this.name = null;
    }

    constructor(message?: string) {
        super();
    }

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
    @namedConstructor
    protected value(value: any, name?: string, message?: string) {
        this.name = name;
        this.message = message;
        this.invalidValue = value;
        this._hasValue = true;
    }

    static value: new(value: any, name?: string, message?: string) => ArgumentError;

    /**
     * Create an argument error for a `null` argument that must not be `null`.
     */
    @namedConstructor
    protected notNull(name?: string) {
        this.name = name;
        this._hasValue = false;
        this.message = "Must not be null";
        this.invalidValue = null;
    }

    static notNull: new (name?: string) => ArgumentError;

    // Helper functions for toString overridden in subclasses.
    protected get _errorName(): string {
        return `Invalid argument${!this._hasValue ? "(s)" : ""}`;
    }

    protected get _errorExplanation(): string {
        return "";
    }

    toString(): string {
        let nameString = "";
        if (this.name != null) {
            nameString = ` (${name})`;
        }
        let message = (this.message == null) ? "" : `: ${this.message}`;
        let prefix = `${this._errorName}${nameString}${this.message}`;
        if (!this._hasValue) return prefix;
        // If we know the invalid value, we can try to describe the problem.
        let explanation = this._errorExplanation;
        let errorValue = DartError.safeToString(this.invalidValue);
        return `${prefix}${explanation}: ${errorValue}`;
    }
}


/**
 * Error thrown due to an index being outside a valid range.
 */
@DartClass
export class RangeError extends ArgumentError {
    protected _start: num;
    protected _end: num;

    /** The minimum value that [value] is allowed to assume. */
    get start(): num {
        return this._start;
    }

    set start(v: num) {
        this._start = v;
    }

    /** The maximum value that [value] is allowed to assume. */
    get end(): num {
        return this._end;
    }

    set end(v: num) {
        this._end = v;
    }

    // TODO(lrn): This constructor should be called only with string values.
    // It currently isn't in all cases.
    /**
     * Create a new [RangeError] with the given [message].
     */

    @defaultConstructor
    protected RangeError(message?: string) {
        super.ArgumentError(message);
        this.start = null;
        this.end = null;
    }

    constructor(message?: any) {
        super();
    }

    /**
     * Create a new [RangeError] with a message for the given [value].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    @namedConstructor
    protected value(value: num, name?: string, message?: string) {
        super.value(value, name, (message != null) ? message : "Value not in range");
        this.start = null;
        this.end = null;
    }

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
    @namedConstructor
    protected range(invalidValue: num, minValue: int, maxValue: int,
                    name?: string, message?: string) {
        super.value(invalidValue, name, (message != null) ? message : "Invalid value");
        this.start = minValue;
        this.end = maxValue;

    }

    static range: new(invalidValue: num, minValue: int, maxValue: int,
                      name?: string, message?: string) => RangeError;

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
    @DartConstructor({factory: true, name: 'index'})
    protected static _index(index: int, indexable: any,
                            name?: string, message?: string, length?: int) {
        return new IndexError(index, indexable, name, message, length);
    }

    static index: new (index: int, indexable: any,
                       name?: string, message?: string, length?: int) => IndexError;

    /**
     * Check that a [value] lies in a specific interval.
     *
     * Throws if [value] is not in the interval.
     * The interval is from [minValue] to [maxValue], both inclusive.
     */
    static checkValueInInterval(value: int, minValue: int, maxValue: int,
                                name?: string, message?: string): void {
        if (value < minValue || value > maxValue) {
            throw new RangeError.range(value, minValue, maxValue, name, message);
        }
    }

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
    static checkValidIndex(index: int, indexable: any,
                           name?: string, length?: int, message?: string): void {
        if (length == null) length = indexable.length;
        // Comparing with `0` as receiver produces better dart2js type inference.
        if (0 > index || index >= length) {
            if (name == null) name = "index";
            throw new RangeError.index(index, indexable, name, message, length);
        }
    }

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
    static checkValidRange(start: int, end: int, length: int,
                           startName?: string, endName?: string, message?: string): int {
        // Comparing with `0` as receiver produces better dart2js type inference.
        // Ditto `start > end` below.
        if (0 > start || start > length) {
            if (startName == null) startName = "start";
            throw new RangeError.range(start, 0, length, startName, message);
        }
        if (end != null) {
            if (start > end || end > length) {
                if (endName == null) endName = "end";
                throw new RangeError.range(end, start, length, endName, message);
            }
            return end;
        }
        return length;
    }

    /**
     * Check that an integer value isn't negative.
     *
     * Throws if the value is negative.
     */
    static checkNotNegative(value: int, name?: string, message?: string): void {
        if (value < 0) throw new RangeError.range(value, 0, null, name, message);
    }

    protected get _errorName(): string {
        return "RangeError";
    }

    protected get _errorExplanation(): string {

        let explanation = "";
        if (this.start == null) {
            if (this.end != null) {
                explanation = ": Not less than or equal to $end";
            }
            // If both are null, we don't add a description of the limits.
        } else if (this.end == null) {
            explanation = ": Not greater than or equal to $start";
        } else if (this.end > this.start) {
            explanation = ": Not in range $start..$end, inclusive";
        } else if (this.end < this.start) {
            explanation = ": Valid value range is empty";
        } else {
            // end == start.
            explanation = ": Only valid value is $start";
        }
        return explanation;
    }
}


/**
 * A specialized [RangeError] used when an index is not in the range
 * `0..indexable.length-1`.
 *
 * Also contains the indexable object, its length at the time of the error,
 * and the invalid index itself.
 */
@DartClass
export class IndexError extends RangeError {
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
    @defaultConstructor
    protected IndexError(invalidValue: int, indexable: any, name?: string, message?: string, length?: int) {
        this.indexable = indexable;
        this.length = (length != null) ? length : indexable.length;
        super.value(invalidValue, name, (message != null) ? message : "Index out of range");
    }

    constructor(invalidValue: int, indexable: any, name?: string, message?: string, length?: int) {
        super();
    }

    // Getters inherited from RangeError.
    get start(): int {
        return 0;
    }

    set start(v: int) {
    }

    get end(): int {
        return this.length - 1;
    }

    set end(v: int) {
    }

    protected get _errorName(): string {
        return "RangeError";
    }

    protected get _errorExplanation(): string {
        if (this.invalidValue < 0) {
            return ": index must not be negative";
        }
        if (this.length == 0) {
            return ": no indices are valid";
        }
        return `: index should be less than ${length}`;
    }
}
