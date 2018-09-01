/// 'factory' for constructing ArgumentError.value to keep the call sites small.
import {ArgumentError, ConcurrentModificationError, DartError, RangeError} from "../errors";
import _dart from '../_common';
import {bool, int, OPERATOR_INDEX_ASSIGN} from "../core";
import {DartIterable, DartList} from "../collections";
import {JSArray} from "./js_array";
import {DartMap} from "../core/map";

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

    static stringFromCharCode(charCode: int) {
        return String.fromCharCode(charCode);
    }

    static stringFromCharCodes(list: DartList<any>) {
        return String.fromCharCode(...(list as DartIterable<int>));
    }

    static stringFromNativeUint8List(charCodes: Array<int>, start: int, end: int) {
        return String.fromCharCode(...charCodes.slice(start, end));
    }

    static flattenString(_contents: string) {
        return _contents;
    }

    static stringConcatUnchecked(_contents: any, str: any) {
        return `${_contents}${str}`;
    }
}

/**
 * Called by generated code to build a map literal. [keyValuePairs] is
 * a list of key, value, key, value, ..., etc.
 */
export function fillLiteralMap(keyValuePairs, result: DartMap<any, any>) {
    // TODO(johnniwinther): Use JSArray to optimize this code instead of calling
    // [getLength] and [getIndex].
    let index = 0;
    let length = getLength(keyValuePairs);
    while (index < length) {
        let key = getIndex(keyValuePairs, index++);
        let value = getIndex(keyValuePairs, index++);
        result[OPERATOR_INDEX_ASSIGN](key, value);
    }
    return result;
}

/// Returns the property [index] of the JavaScript array [array].
export function getIndex(array, index: int) {
    //assert(isJsArray(array));
    return array[index] /*JS('var', r'#[#]', array, index)*/;
}

/// Returns the length of the JavaScript array [array].
export function getLength(array) {
    //assert(isJsArray(array));
    return array.length /*JS('int', r'#.length', array)*/;
}

/// Returns whether [value] is a JavaScript array.
export function isJsArray(value): bool {
    return _dart.is(value, Array);
}
