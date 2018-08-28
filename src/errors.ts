import _dart from './_common';
import {UNINITIALIZED} from "./core";
/**
 * The operation was not allowed by the object.
 *
 * This [Error] is thrown when an instance cannot implement one of the methods
 * in its signature.
 */
import {DartObject,num} from "./core";

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
        return `Unsupported operation: $message`;
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
 * Error thrown due to an index being outside a valid range.
 */
class RangeError extends ArgumentError {
    /** The minimum value that [value] is allowed to assume. */
    start: num;
    /** The maximum value that [value] is allowed to assume. */
    end: num;

    // TODO(lrn): This constructor should be called only with string values.
    // It currently isn't in all cases.
    /**
     * Create a new [RangeError] with the given [message].
     */
    constructor(_:Symbol)
    constructor(message: any) {
        super(arguments[0]===UNINITIALIZED?UNINITIALIZED:message);
        this.start = null;
        this.end = null;
    }
    /**
     * Create a new [RangeError] with a message for the given [value].
     *
     * An optional [name] can specify the argument name that has the
     * invalid value, and the [message] can override the default error
     * description.
     */
    static value(num value, [String name, String message]) {
        // TODO :
        super()
}
: start = null,
    end = null,
    super.value(
        value, name, (message != null) ? message : "Value not in range");

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
    RangeError.range(num invalidValue, int minValue, int maxValue,
    [String name, String message])
: start = minValue,
    end = maxValue,
    super.value(
        invalidValue, name, (message != null) ? message : "Invalid value");

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
    factory RangeError.index(int index, indexable,
    [String name, String message, int length]) = IndexError;

    /**
     * Check that a [value] lies in a specific interval.
     *
     * Throws if [value] is not in the interval.
     * The interval is from [minValue] to [maxValue], both inclusive.
     */
    static void checkValueInInterval(int value, int minValue, int maxValue,
    [String name, String message]) {
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
static void checkValidIndex(int index, var indexable,
    [String name, int length, String message]) {
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
static int checkValidRange(int start, int end, int length,
    [String startName, String endName, String message]) {
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
static void checkNotNegative(int value, [String name, String message]) {
    if (value < 0) throw new RangeError.range(value, 0, null, name, message);
}

String get _errorName => "RangeError";
String get _errorExplanation {
    assert(_hasValue);
    String explanation = "";
    if (start == null) {
        if (end != null) {
            explanation = ": Not less than or equal to $end";
        }
        // If both are null, we don't add a description of the limits.
    } else if (end == null) {
        explanation = ": Not greater than or equal to $start";
    } else if (end > start) {
        explanation = ": Not in range $start..$end, inclusive";
    } else if (end < start) {
        explanation = ": Valid value range is empty";
    } else {
        // end == start.
        explanation = ": Only valid value is $start";
    }
    return explanation;
}
}
