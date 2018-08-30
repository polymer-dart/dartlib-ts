/// 'factory' for constructing ArgumentError.value to keep the call sites small.
import {ArgumentError, ConcurrentModificationError, DartError, RangeError} from "../errors";
import _dart from '../_common';
import {int} from "../core";

export function argumentErrorValue(object: any): ArgumentError {
    return new ArgumentError.value(object);
}

export function checkNull(object) {
    if (object == null) throw argumentErrorValue(object);
    return object;
}


export function checkNum(value: any) {
    if (!_dart.is(value, 'num')) throw argumentErrorValue(value);
    return value;
}

export function checkInt(value: any) {
    if (!_dart.is(value, 'int')) throw argumentErrorValue(value);
    return value;
}

export function checkBool(value: any) {
    if (!_dart.is(value, 'bool')) throw argumentErrorValue(value);
    return value;
}

export function checkString(value: any) {
    if (!_dart.is(value, 'string')) throw argumentErrorValue(value);
    return value;
}

export function diagnoseIndexError(indexable, index): DartError {
    if (!_dart.is(index, 'int')) return new ArgumentError.value(index, 'index');
    let length = indexable.length;
    // The following returns the same error that would be thrown by calling
    // [RangeError.checkValidIndex] with no optional parameters provided.
    if (index < 0 || index >= length) {
        return new RangeError.index(index, indexable, 'index', null, length);
    }
    // The above should always match, but if it does not, use the following.
    return new RangeError.value(index, 'index');
}

export function throwConcurrentModificationError(collection) {
    throw new ConcurrentModificationError(collection);
}

export class DartPrimitives {

    /// In minified mode, uses the unminified names if available.
    static objectToHumanReadableString(object: any): string {
        let name = DartPrimitives.objectTypeName(object);
        return `Instance of '${name}'`;
    }

    private static objectTypeName(object: any) {
        return object;
    }


    static objectHashCode(object: any): int {
        let hash = object.$identityHash /*JS('int|Null', r'#.$identityHash', object)*/;
        if (hash == null) {
            hash = (Math.random() * 0x3fffffff) | 0 /*JS('int', '(Math.random() * 0x3fffffff) | 0')*/;
            //JS('void', r'#.$identityHash = #', object, hash);
            object.$identityHash = hash
        }
        return hash /* JS('int', '#', hash)*/;
    }
}