var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Float32x4_1, NativeFloat32x4List_1, NativeInt32x4List_1, NativeFloat64x2List_1, NativeByteData_1, NativeTypedArrayOfDouble_1, NativeTypedArrayOfInt_1, NativeFloat32List_1, NativeFloat64List_1, NativeInt16List_1, NativeInt32List_1, NativeInt8List_1, NativeUint16List_1, NativeUint32List_1, NativeUint8ClampedList_1, NativeUint8List_1, NativeFloat32x4_1, NativeInt32x4_1, NativeFloat64x2_1;
/** Library asset:sample_project/lib/typed_data/dart */
import { is, isNot } from "./_common";
import { defaultConstructor, namedConstructor, namedFactory, defaultFactory, DartClass, Implements, op, Op, OperatorMethods, Abstract, AbstractProperty, With, AbstractSymbols } from "./utils";
import * as core from "./core";
import * as math from "./math";
let ByteBuffer = class ByteBuffer extends ArrayBuffer {
    static _withLength(len) {
        return new NativeByteBuffer(len);
    }
    static _fromBuffer(buffer) {
        return new NativeByteBuffer(buffer.byteLength);
    }
    get lengthInBytes() {
        throw 'abstract';
    }
    asUint8List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt8List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint8ClampedList(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint16List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt16List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt32x4List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat32x4List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat64x2List(offsetInBytes, length) {
        throw 'abstract';
    }
    asByteData(offsetInBytes, length) {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], ByteBuffer.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asUint8List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asInt8List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asUint8ClampedList", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asUint16List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asInt16List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asUint32List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asInt32List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asUint64List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asInt64List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asInt32x4List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asFloat32List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asFloat64List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asFloat32x4List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asFloat64x2List", null);
__decorate([
    Abstract
], ByteBuffer.prototype, "asByteData", null);
__decorate([
    namedFactory
], ByteBuffer, "_withLength", null);
__decorate([
    namedFactory
], ByteBuffer, "_fromBuffer", null);
ByteBuffer = __decorate([
    DartClass
], ByteBuffer);
export { ByteBuffer };
let TypedData = class TypedData {
    get elementSizeInBytes() {
        throw 'abstract';
    }
    get offsetInBytes() {
        throw 'abstract';
    }
    get lengthInBytes() {
        throw 'abstract';
    }
    get buffer() {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], TypedData.prototype, "elementSizeInBytes", null);
__decorate([
    AbstractProperty
], TypedData.prototype, "offsetInBytes", null);
__decorate([
    AbstractProperty
], TypedData.prototype, "lengthInBytes", null);
__decorate([
    AbstractProperty
], TypedData.prototype, "buffer", null);
TypedData = __decorate([
    DartClass
], TypedData);
export { TypedData };
let ByteData = class ByteData extends TypedData {
    constructor(length) {
        super();
    }
    static _ByteData(length) {
        return new NativeByteData(length);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asByteData(offsetInBytes, length);
    }
    getInt8(byteOffset) {
        throw 'abstract';
    }
    setInt8(byteOffset, value) {
        throw 'abstract';
    }
    getUint8(byteOffset) {
        throw 'abstract';
    }
    setUint8(byteOffset, value) {
        throw 'abstract';
    }
    getInt16(byteOffset, endian) {
        throw 'abstract';
    }
    setInt16(byteOffset, value, endian) {
        throw 'abstract';
    }
    getUint16(byteOffset, endian) {
        throw 'abstract';
    }
    setUint16(byteOffset, value, endian) {
        throw 'abstract';
    }
    getInt32(byteOffset, endian) {
        throw 'abstract';
    }
    setInt32(byteOffset, value, endian) {
        throw 'abstract';
    }
    getUint32(byteOffset, endian) {
        throw 'abstract';
    }
    setUint32(byteOffset, value, endian) {
        throw 'abstract';
    }
    getInt64(byteOffset, endian) {
        throw 'abstract';
    }
    setInt64(byteOffset, value, endian) {
        throw 'abstract';
    }
    getUint64(byteOffset, endian) {
        throw 'abstract';
    }
    setUint64(byteOffset, value, endian) {
        throw 'abstract';
    }
    getFloat32(byteOffset, endian) {
        throw 'abstract';
    }
    setFloat32(byteOffset, value, endian) {
        throw 'abstract';
    }
    getFloat64(byteOffset, endian) {
        throw 'abstract';
    }
    setFloat64(byteOffset, value, endian) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], ByteData.prototype, "getInt8", null);
__decorate([
    Abstract
], ByteData.prototype, "setInt8", null);
__decorate([
    Abstract
], ByteData.prototype, "getUint8", null);
__decorate([
    Abstract
], ByteData.prototype, "setUint8", null);
__decorate([
    Abstract
], ByteData.prototype, "getInt16", null);
__decorate([
    Abstract
], ByteData.prototype, "setInt16", null);
__decorate([
    Abstract
], ByteData.prototype, "getUint16", null);
__decorate([
    Abstract
], ByteData.prototype, "setUint16", null);
__decorate([
    Abstract
], ByteData.prototype, "getInt32", null);
__decorate([
    Abstract
], ByteData.prototype, "setInt32", null);
__decorate([
    Abstract
], ByteData.prototype, "getUint32", null);
__decorate([
    Abstract
], ByteData.prototype, "setUint32", null);
__decorate([
    Abstract
], ByteData.prototype, "getInt64", null);
__decorate([
    Abstract
], ByteData.prototype, "setInt64", null);
__decorate([
    Abstract
], ByteData.prototype, "getUint64", null);
__decorate([
    Abstract
], ByteData.prototype, "setUint64", null);
__decorate([
    Abstract
], ByteData.prototype, "getFloat32", null);
__decorate([
    Abstract
], ByteData.prototype, "setFloat32", null);
__decorate([
    Abstract
], ByteData.prototype, "getFloat64", null);
__decorate([
    Abstract
], ByteData.prototype, "setFloat64", null);
__decorate([
    defaultFactory
], ByteData, "_ByteData", null);
__decorate([
    namedFactory
], ByteData, "_view", null);
ByteData = __decorate([
    DartClass,
    Implements(TypedData)
], ByteData);
export { ByteData };
let Uint16List = class Uint16List extends TypedData {
    constructor(length) {
        super();
    }
    static _Uint16List(length) {
        return new NativeUint16List.withLength(length);
    }
    static _fromList(elements) {
        return new NativeUint16List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint16List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Uint16List.BYTES_PER_ELEMENT = 2;
__decorate([
    Abstract
], Uint16List.prototype, "add", null);
__decorate([
    Abstract
], Uint16List.prototype, "addAll", null);
__decorate([
    Abstract
], Uint16List.prototype, "any", null);
__decorate([
    Abstract
], Uint16List.prototype, "asMap", null);
__decorate([
    Abstract
], Uint16List.prototype, "clear", null);
__decorate([
    Abstract
], Uint16List.prototype, "contains", null);
__decorate([
    Abstract
], Uint16List.prototype, "elementAt", null);
__decorate([
    Abstract
], Uint16List.prototype, "expand", null);
__decorate([
    Abstract
], Uint16List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Uint16List.prototype, "first", null);
__decorate([
    Abstract
], Uint16List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Uint16List.prototype, "fold", null);
__decorate([
    Abstract
], Uint16List.prototype, "getRange", null);
__decorate([
    Abstract
], Uint16List.prototype, "insert", null);
__decorate([
    Abstract
], Uint16List.prototype, "insertAll", null);
__decorate([
    Abstract
], Uint16List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Uint16List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Uint16List.prototype, "iterator", null);
__decorate([
    Abstract
], Uint16List.prototype, "last", null);
__decorate([
    Abstract
], Uint16List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Uint16List.prototype, "map", null);
__decorate([
    Abstract
], Uint16List.prototype, "remove", null);
__decorate([
    Abstract
], Uint16List.prototype, "removeAt", null);
__decorate([
    Abstract
], Uint16List.prototype, "removeLast", null);
__decorate([
    Abstract
], Uint16List.prototype, "removeRange", null);
__decorate([
    Abstract
], Uint16List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Uint16List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Uint16List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Uint16List.prototype, "reversed", null);
__decorate([
    Abstract
], Uint16List.prototype, "setAll", null);
__decorate([
    Abstract
], Uint16List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Uint16List.prototype, "single", null);
__decorate([
    Abstract
], Uint16List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Uint16List.prototype, "skip", null);
__decorate([
    Abstract
], Uint16List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Uint16List.prototype, "take", null);
__decorate([
    Abstract
], Uint16List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Uint16List.prototype, "toList", null);
__decorate([
    Abstract
], Uint16List.prototype, "toSet", null);
__decorate([
    Abstract
], Uint16List.prototype, "where", null);
__decorate([
    Abstract
], Uint16List.prototype, "every", null);
__decorate([
    Abstract
], Uint16List.prototype, "forEach", null);
__decorate([
    Abstract
], Uint16List.prototype, "indexOf", null);
__decorate([
    Abstract
], Uint16List.prototype, "join", null);
__decorate([
    Abstract
], Uint16List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Uint16List.prototype, "reduce", null);
__decorate([
    Abstract
], Uint16List.prototype, "sort", null);
__decorate([
    Abstract
], Uint16List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Uint16List.prototype, "length", null);
__decorate([
    Abstract
], Uint16List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Uint16List, "_Uint16List", null);
__decorate([
    namedFactory
], Uint16List, "_fromList", null);
__decorate([
    namedFactory
], Uint16List, "_view", null);
Uint16List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Uint16List);
export { Uint16List };
let Int8List = class Int8List extends TypedData {
    constructor(length) {
        super();
    }
    static _Int8List(length) {
        return new NativeInt8List(length);
    }
    static _fromList(elements) {
        return new NativeInt8List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt8List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Int8List.BYTES_PER_ELEMENT = 1;
__decorate([
    Abstract
], Int8List.prototype, "add", null);
__decorate([
    Abstract
], Int8List.prototype, "addAll", null);
__decorate([
    Abstract
], Int8List.prototype, "any", null);
__decorate([
    Abstract
], Int8List.prototype, "asMap", null);
__decorate([
    Abstract
], Int8List.prototype, "clear", null);
__decorate([
    Abstract
], Int8List.prototype, "contains", null);
__decorate([
    Abstract
], Int8List.prototype, "elementAt", null);
__decorate([
    Abstract
], Int8List.prototype, "expand", null);
__decorate([
    Abstract
], Int8List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Int8List.prototype, "first", null);
__decorate([
    Abstract
], Int8List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Int8List.prototype, "fold", null);
__decorate([
    Abstract
], Int8List.prototype, "getRange", null);
__decorate([
    Abstract
], Int8List.prototype, "insert", null);
__decorate([
    Abstract
], Int8List.prototype, "insertAll", null);
__decorate([
    Abstract
], Int8List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Int8List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Int8List.prototype, "iterator", null);
__decorate([
    Abstract
], Int8List.prototype, "last", null);
__decorate([
    Abstract
], Int8List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Int8List.prototype, "map", null);
__decorate([
    Abstract
], Int8List.prototype, "remove", null);
__decorate([
    Abstract
], Int8List.prototype, "removeAt", null);
__decorate([
    Abstract
], Int8List.prototype, "removeLast", null);
__decorate([
    Abstract
], Int8List.prototype, "removeRange", null);
__decorate([
    Abstract
], Int8List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Int8List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Int8List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Int8List.prototype, "reversed", null);
__decorate([
    Abstract
], Int8List.prototype, "setAll", null);
__decorate([
    Abstract
], Int8List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Int8List.prototype, "single", null);
__decorate([
    Abstract
], Int8List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Int8List.prototype, "skip", null);
__decorate([
    Abstract
], Int8List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Int8List.prototype, "take", null);
__decorate([
    Abstract
], Int8List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Int8List.prototype, "toList", null);
__decorate([
    Abstract
], Int8List.prototype, "toSet", null);
__decorate([
    Abstract
], Int8List.prototype, "where", null);
__decorate([
    Abstract
], Int8List.prototype, "every", null);
__decorate([
    Abstract
], Int8List.prototype, "forEach", null);
__decorate([
    Abstract
], Int8List.prototype, "indexOf", null);
__decorate([
    Abstract
], Int8List.prototype, "join", null);
__decorate([
    Abstract
], Int8List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Int8List.prototype, "reduce", null);
__decorate([
    Abstract
], Int8List.prototype, "sort", null);
__decorate([
    Abstract
], Int8List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Int8List.prototype, "length", null);
__decorate([
    Abstract
], Int8List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Int8List, "_Int8List", null);
__decorate([
    namedFactory
], Int8List, "_fromList", null);
__decorate([
    namedFactory
], Int8List, "_view", null);
Int8List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Int8List);
export { Int8List };
let Uint8List = class Uint8List extends TypedData {
    constructor(length) {
        super();
    }
    static _Uint8List(length) {
        return new NativeUint8List(length);
    }
    static _fromList(elements) {
        return new NativeUint8List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Uint8List.BYTES_PER_ELEMENT = 1;
__decorate([
    Abstract
], Uint8List.prototype, "add", null);
__decorate([
    Abstract
], Uint8List.prototype, "addAll", null);
__decorate([
    Abstract
], Uint8List.prototype, "any", null);
__decorate([
    Abstract
], Uint8List.prototype, "asMap", null);
__decorate([
    Abstract
], Uint8List.prototype, "clear", null);
__decorate([
    Abstract
], Uint8List.prototype, "contains", null);
__decorate([
    Abstract
], Uint8List.prototype, "elementAt", null);
__decorate([
    Abstract
], Uint8List.prototype, "expand", null);
__decorate([
    Abstract
], Uint8List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Uint8List.prototype, "first", null);
__decorate([
    Abstract
], Uint8List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Uint8List.prototype, "fold", null);
__decorate([
    Abstract
], Uint8List.prototype, "getRange", null);
__decorate([
    Abstract
], Uint8List.prototype, "insert", null);
__decorate([
    Abstract
], Uint8List.prototype, "insertAll", null);
__decorate([
    Abstract
], Uint8List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Uint8List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Uint8List.prototype, "iterator", null);
__decorate([
    Abstract
], Uint8List.prototype, "last", null);
__decorate([
    Abstract
], Uint8List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Uint8List.prototype, "map", null);
__decorate([
    Abstract
], Uint8List.prototype, "remove", null);
__decorate([
    Abstract
], Uint8List.prototype, "removeAt", null);
__decorate([
    Abstract
], Uint8List.prototype, "removeLast", null);
__decorate([
    Abstract
], Uint8List.prototype, "removeRange", null);
__decorate([
    Abstract
], Uint8List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Uint8List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Uint8List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Uint8List.prototype, "reversed", null);
__decorate([
    Abstract
], Uint8List.prototype, "setAll", null);
__decorate([
    Abstract
], Uint8List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Uint8List.prototype, "single", null);
__decorate([
    Abstract
], Uint8List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Uint8List.prototype, "skip", null);
__decorate([
    Abstract
], Uint8List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Uint8List.prototype, "take", null);
__decorate([
    Abstract
], Uint8List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Uint8List.prototype, "toList", null);
__decorate([
    Abstract
], Uint8List.prototype, "toSet", null);
__decorate([
    Abstract
], Uint8List.prototype, "where", null);
__decorate([
    Abstract
], Uint8List.prototype, "every", null);
__decorate([
    Abstract
], Uint8List.prototype, "forEach", null);
__decorate([
    Abstract
], Uint8List.prototype, "indexOf", null);
__decorate([
    Abstract
], Uint8List.prototype, "join", null);
__decorate([
    Abstract
], Uint8List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Uint8List.prototype, "reduce", null);
__decorate([
    Abstract
], Uint8List.prototype, "sort", null);
__decorate([
    Abstract
], Uint8List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Uint8List.prototype, "length", null);
__decorate([
    Abstract
], Uint8List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Uint8List, "_Uint8List", null);
__decorate([
    namedFactory
], Uint8List, "_fromList", null);
__decorate([
    namedFactory
], Uint8List, "_view", null);
Uint8List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Uint8List);
export { Uint8List };
let Uint8ClampedList = class Uint8ClampedList extends TypedData {
    constructor(length) {
        super();
    }
    static _Uint8ClampedList(length) {
        return new NativeUint8ClampedList(length);
    }
    static _fromList(elements) {
        return new NativeUint8ClampedList.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8ClampedList(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Uint8ClampedList.BYTES_PER_ELEMENT = 1;
__decorate([
    Abstract
], Uint8ClampedList.prototype, "add", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "addAll", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "any", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "asMap", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "clear", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "contains", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "elementAt", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "expand", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Uint8ClampedList.prototype, "first", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "firstWhere", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "fold", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "getRange", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "insert", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "insertAll", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "isEmpty", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "iterator", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "last", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "lastWhere", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "map", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "remove", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "removeAt", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "removeLast", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "removeRange", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "removeWhere", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "replaceRange", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Uint8ClampedList.prototype, "reversed", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "setAll", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Uint8ClampedList.prototype, "single", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "singleWhere", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "skip", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "skipWhile", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "take", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "takeWhile", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "toList", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "toSet", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "where", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "every", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "forEach", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "indexOf", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "join", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "reduce", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "sort", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Uint8ClampedList.prototype, "length", null);
__decorate([
    Abstract
], Uint8ClampedList.prototype, "setRange", null);
__decorate([
    defaultFactory
], Uint8ClampedList, "_Uint8ClampedList", null);
__decorate([
    namedFactory
], Uint8ClampedList, "_fromList", null);
__decorate([
    namedFactory
], Uint8ClampedList, "_view", null);
Uint8ClampedList = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Uint8ClampedList);
export { Uint8ClampedList };
let Int16List = class Int16List extends TypedData {
    constructor(length) {
        super();
    }
    static _Int16List(length) {
        return new NativeInt16List(length);
    }
    static _fromList(elements) {
        return new NativeInt16List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt16List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Int16List.BYTES_PER_ELEMENT = 2;
__decorate([
    Abstract
], Int16List.prototype, "add", null);
__decorate([
    Abstract
], Int16List.prototype, "addAll", null);
__decorate([
    Abstract
], Int16List.prototype, "any", null);
__decorate([
    Abstract
], Int16List.prototype, "asMap", null);
__decorate([
    Abstract
], Int16List.prototype, "clear", null);
__decorate([
    Abstract
], Int16List.prototype, "contains", null);
__decorate([
    Abstract
], Int16List.prototype, "elementAt", null);
__decorate([
    Abstract
], Int16List.prototype, "expand", null);
__decorate([
    Abstract
], Int16List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Int16List.prototype, "first", null);
__decorate([
    Abstract
], Int16List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Int16List.prototype, "fold", null);
__decorate([
    Abstract
], Int16List.prototype, "getRange", null);
__decorate([
    Abstract
], Int16List.prototype, "insert", null);
__decorate([
    Abstract
], Int16List.prototype, "insertAll", null);
__decorate([
    Abstract
], Int16List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Int16List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Int16List.prototype, "iterator", null);
__decorate([
    Abstract
], Int16List.prototype, "last", null);
__decorate([
    Abstract
], Int16List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Int16List.prototype, "map", null);
__decorate([
    Abstract
], Int16List.prototype, "remove", null);
__decorate([
    Abstract
], Int16List.prototype, "removeAt", null);
__decorate([
    Abstract
], Int16List.prototype, "removeLast", null);
__decorate([
    Abstract
], Int16List.prototype, "removeRange", null);
__decorate([
    Abstract
], Int16List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Int16List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Int16List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Int16List.prototype, "reversed", null);
__decorate([
    Abstract
], Int16List.prototype, "setAll", null);
__decorate([
    Abstract
], Int16List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Int16List.prototype, "single", null);
__decorate([
    Abstract
], Int16List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Int16List.prototype, "skip", null);
__decorate([
    Abstract
], Int16List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Int16List.prototype, "take", null);
__decorate([
    Abstract
], Int16List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Int16List.prototype, "toList", null);
__decorate([
    Abstract
], Int16List.prototype, "toSet", null);
__decorate([
    Abstract
], Int16List.prototype, "where", null);
__decorate([
    Abstract
], Int16List.prototype, "every", null);
__decorate([
    Abstract
], Int16List.prototype, "forEach", null);
__decorate([
    Abstract
], Int16List.prototype, "indexOf", null);
__decorate([
    Abstract
], Int16List.prototype, "join", null);
__decorate([
    Abstract
], Int16List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Int16List.prototype, "reduce", null);
__decorate([
    Abstract
], Int16List.prototype, "sort", null);
__decorate([
    Abstract
], Int16List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Int16List.prototype, "length", null);
__decorate([
    Abstract
], Int16List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Int16List, "_Int16List", null);
__decorate([
    namedFactory
], Int16List, "_fromList", null);
__decorate([
    namedFactory
], Int16List, "_view", null);
Int16List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Int16List);
export { Int16List };
let Int32List = class Int32List extends TypedData {
    constructor(length) {
        super();
    }
    static _Int32List(length) {
        return new NativeInt32List(length);
    }
    static _fromList(elements) {
        return new NativeInt32List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Int32List.BYTES_PER_ELEMENT = 4;
__decorate([
    Abstract
], Int32List.prototype, "add", null);
__decorate([
    Abstract
], Int32List.prototype, "addAll", null);
__decorate([
    Abstract
], Int32List.prototype, "any", null);
__decorate([
    Abstract
], Int32List.prototype, "asMap", null);
__decorate([
    Abstract
], Int32List.prototype, "clear", null);
__decorate([
    Abstract
], Int32List.prototype, "contains", null);
__decorate([
    Abstract
], Int32List.prototype, "elementAt", null);
__decorate([
    Abstract
], Int32List.prototype, "expand", null);
__decorate([
    Abstract
], Int32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Int32List.prototype, "first", null);
__decorate([
    Abstract
], Int32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Int32List.prototype, "fold", null);
__decorate([
    Abstract
], Int32List.prototype, "getRange", null);
__decorate([
    Abstract
], Int32List.prototype, "insert", null);
__decorate([
    Abstract
], Int32List.prototype, "insertAll", null);
__decorate([
    Abstract
], Int32List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Int32List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Int32List.prototype, "iterator", null);
__decorate([
    Abstract
], Int32List.prototype, "last", null);
__decorate([
    Abstract
], Int32List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Int32List.prototype, "map", null);
__decorate([
    Abstract
], Int32List.prototype, "remove", null);
__decorate([
    Abstract
], Int32List.prototype, "removeAt", null);
__decorate([
    Abstract
], Int32List.prototype, "removeLast", null);
__decorate([
    Abstract
], Int32List.prototype, "removeRange", null);
__decorate([
    Abstract
], Int32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Int32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Int32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Int32List.prototype, "reversed", null);
__decorate([
    Abstract
], Int32List.prototype, "setAll", null);
__decorate([
    Abstract
], Int32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Int32List.prototype, "single", null);
__decorate([
    Abstract
], Int32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Int32List.prototype, "skip", null);
__decorate([
    Abstract
], Int32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Int32List.prototype, "take", null);
__decorate([
    Abstract
], Int32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Int32List.prototype, "toList", null);
__decorate([
    Abstract
], Int32List.prototype, "toSet", null);
__decorate([
    Abstract
], Int32List.prototype, "where", null);
__decorate([
    Abstract
], Int32List.prototype, "every", null);
__decorate([
    Abstract
], Int32List.prototype, "forEach", null);
__decorate([
    Abstract
], Int32List.prototype, "indexOf", null);
__decorate([
    Abstract
], Int32List.prototype, "join", null);
__decorate([
    Abstract
], Int32List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Int32List.prototype, "reduce", null);
__decorate([
    Abstract
], Int32List.prototype, "sort", null);
__decorate([
    Abstract
], Int32List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Int32List.prototype, "length", null);
__decorate([
    Abstract
], Int32List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Int32List, "_Int32List", null);
__decorate([
    namedFactory
], Int32List, "_fromList", null);
__decorate([
    namedFactory
], Int32List, "_view", null);
Int32List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Int32List);
export { Int32List };
let Uint32List = class Uint32List extends TypedData {
    constructor(length) {
        super();
    }
    static _Uint32List(length) {
        return new NativeUint32List(length);
    }
    static _fromList(elements) {
        return new NativeUint32List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint32List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Uint32List.BYTES_PER_ELEMENT = 4;
__decorate([
    Abstract
], Uint32List.prototype, "add", null);
__decorate([
    Abstract
], Uint32List.prototype, "addAll", null);
__decorate([
    Abstract
], Uint32List.prototype, "any", null);
__decorate([
    Abstract
], Uint32List.prototype, "asMap", null);
__decorate([
    Abstract
], Uint32List.prototype, "clear", null);
__decorate([
    Abstract
], Uint32List.prototype, "contains", null);
__decorate([
    Abstract
], Uint32List.prototype, "elementAt", null);
__decorate([
    Abstract
], Uint32List.prototype, "expand", null);
__decorate([
    Abstract
], Uint32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Uint32List.prototype, "first", null);
__decorate([
    Abstract
], Uint32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Uint32List.prototype, "fold", null);
__decorate([
    Abstract
], Uint32List.prototype, "getRange", null);
__decorate([
    Abstract
], Uint32List.prototype, "insert", null);
__decorate([
    Abstract
], Uint32List.prototype, "insertAll", null);
__decorate([
    Abstract
], Uint32List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Uint32List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Uint32List.prototype, "iterator", null);
__decorate([
    Abstract
], Uint32List.prototype, "last", null);
__decorate([
    Abstract
], Uint32List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Uint32List.prototype, "map", null);
__decorate([
    Abstract
], Uint32List.prototype, "remove", null);
__decorate([
    Abstract
], Uint32List.prototype, "removeAt", null);
__decorate([
    Abstract
], Uint32List.prototype, "removeLast", null);
__decorate([
    Abstract
], Uint32List.prototype, "removeRange", null);
__decorate([
    Abstract
], Uint32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Uint32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Uint32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Uint32List.prototype, "reversed", null);
__decorate([
    Abstract
], Uint32List.prototype, "setAll", null);
__decorate([
    Abstract
], Uint32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Uint32List.prototype, "single", null);
__decorate([
    Abstract
], Uint32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Uint32List.prototype, "skip", null);
__decorate([
    Abstract
], Uint32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Uint32List.prototype, "take", null);
__decorate([
    Abstract
], Uint32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Uint32List.prototype, "toList", null);
__decorate([
    Abstract
], Uint32List.prototype, "toSet", null);
__decorate([
    Abstract
], Uint32List.prototype, "where", null);
__decorate([
    Abstract
], Uint32List.prototype, "every", null);
__decorate([
    Abstract
], Uint32List.prototype, "forEach", null);
__decorate([
    Abstract
], Uint32List.prototype, "indexOf", null);
__decorate([
    Abstract
], Uint32List.prototype, "join", null);
__decorate([
    Abstract
], Uint32List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Uint32List.prototype, "reduce", null);
__decorate([
    Abstract
], Uint32List.prototype, "sort", null);
__decorate([
    Abstract
], Uint32List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Uint32List.prototype, "length", null);
__decorate([
    Abstract
], Uint32List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Uint32List, "_Uint32List", null);
__decorate([
    namedFactory
], Uint32List, "_fromList", null);
__decorate([
    namedFactory
], Uint32List, "_view", null);
Uint32List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Uint32List);
export { Uint32List };
let Int64List = class Int64List extends TypedData {
    constructor(length) {
        super();
    }
    static _Int64List(length) {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }
    static _fromList(elements) {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt64List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Int64List.BYTES_PER_ELEMENT = 8;
__decorate([
    Abstract
], Int64List.prototype, "add", null);
__decorate([
    Abstract
], Int64List.prototype, "addAll", null);
__decorate([
    Abstract
], Int64List.prototype, "any", null);
__decorate([
    Abstract
], Int64List.prototype, "asMap", null);
__decorate([
    Abstract
], Int64List.prototype, "clear", null);
__decorate([
    Abstract
], Int64List.prototype, "contains", null);
__decorate([
    Abstract
], Int64List.prototype, "elementAt", null);
__decorate([
    Abstract
], Int64List.prototype, "expand", null);
__decorate([
    Abstract
], Int64List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Int64List.prototype, "first", null);
__decorate([
    Abstract
], Int64List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Int64List.prototype, "fold", null);
__decorate([
    Abstract
], Int64List.prototype, "getRange", null);
__decorate([
    Abstract
], Int64List.prototype, "insert", null);
__decorate([
    Abstract
], Int64List.prototype, "insertAll", null);
__decorate([
    Abstract
], Int64List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Int64List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Int64List.prototype, "iterator", null);
__decorate([
    Abstract
], Int64List.prototype, "last", null);
__decorate([
    Abstract
], Int64List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Int64List.prototype, "map", null);
__decorate([
    Abstract
], Int64List.prototype, "remove", null);
__decorate([
    Abstract
], Int64List.prototype, "removeAt", null);
__decorate([
    Abstract
], Int64List.prototype, "removeLast", null);
__decorate([
    Abstract
], Int64List.prototype, "removeRange", null);
__decorate([
    Abstract
], Int64List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Int64List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Int64List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Int64List.prototype, "reversed", null);
__decorate([
    Abstract
], Int64List.prototype, "setAll", null);
__decorate([
    Abstract
], Int64List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Int64List.prototype, "single", null);
__decorate([
    Abstract
], Int64List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Int64List.prototype, "skip", null);
__decorate([
    Abstract
], Int64List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Int64List.prototype, "take", null);
__decorate([
    Abstract
], Int64List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Int64List.prototype, "toList", null);
__decorate([
    Abstract
], Int64List.prototype, "toSet", null);
__decorate([
    Abstract
], Int64List.prototype, "where", null);
__decorate([
    Abstract
], Int64List.prototype, "every", null);
__decorate([
    Abstract
], Int64List.prototype, "forEach", null);
__decorate([
    Abstract
], Int64List.prototype, "indexOf", null);
__decorate([
    Abstract
], Int64List.prototype, "join", null);
__decorate([
    Abstract
], Int64List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Int64List.prototype, "reduce", null);
__decorate([
    Abstract
], Int64List.prototype, "sort", null);
__decorate([
    Abstract
], Int64List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Int64List.prototype, "length", null);
__decorate([
    Abstract
], Int64List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Int64List, "_Int64List", null);
__decorate([
    namedFactory
], Int64List, "_fromList", null);
__decorate([
    namedFactory
], Int64List, "_view", null);
Int64List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Int64List);
export { Int64List };
let Uint64List = class Uint64List extends TypedData {
    constructor(length) {
        super();
    }
    static _Uint64List(length) {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }
    static _fromList(elements) {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint64List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        throw 'abstract';
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Uint64List.BYTES_PER_ELEMENT = 8;
__decorate([
    Abstract
], Uint64List.prototype, "add", null);
__decorate([
    Abstract
], Uint64List.prototype, "addAll", null);
__decorate([
    Abstract
], Uint64List.prototype, "any", null);
__decorate([
    Abstract
], Uint64List.prototype, "asMap", null);
__decorate([
    Abstract
], Uint64List.prototype, "clear", null);
__decorate([
    Abstract
], Uint64List.prototype, "contains", null);
__decorate([
    Abstract
], Uint64List.prototype, "elementAt", null);
__decorate([
    Abstract
], Uint64List.prototype, "expand", null);
__decorate([
    Abstract
], Uint64List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Uint64List.prototype, "first", null);
__decorate([
    Abstract
], Uint64List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Uint64List.prototype, "fold", null);
__decorate([
    Abstract
], Uint64List.prototype, "getRange", null);
__decorate([
    Abstract
], Uint64List.prototype, "insert", null);
__decorate([
    Abstract
], Uint64List.prototype, "insertAll", null);
__decorate([
    Abstract
], Uint64List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Uint64List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Uint64List.prototype, "iterator", null);
__decorate([
    Abstract
], Uint64List.prototype, "last", null);
__decorate([
    Abstract
], Uint64List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Uint64List.prototype, "map", null);
__decorate([
    Abstract
], Uint64List.prototype, "remove", null);
__decorate([
    Abstract
], Uint64List.prototype, "removeAt", null);
__decorate([
    Abstract
], Uint64List.prototype, "removeLast", null);
__decorate([
    Abstract
], Uint64List.prototype, "removeRange", null);
__decorate([
    Abstract
], Uint64List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Uint64List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Uint64List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Uint64List.prototype, "reversed", null);
__decorate([
    Abstract
], Uint64List.prototype, "setAll", null);
__decorate([
    Abstract
], Uint64List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Uint64List.prototype, "single", null);
__decorate([
    Abstract
], Uint64List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Uint64List.prototype, "skip", null);
__decorate([
    Abstract
], Uint64List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Uint64List.prototype, "take", null);
__decorate([
    Abstract
], Uint64List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Uint64List.prototype, "toList", null);
__decorate([
    Abstract
], Uint64List.prototype, "toSet", null);
__decorate([
    Abstract
], Uint64List.prototype, "where", null);
__decorate([
    Abstract
], Uint64List.prototype, "every", null);
__decorate([
    Abstract
], Uint64List.prototype, "forEach", null);
__decorate([
    Abstract
], Uint64List.prototype, "indexOf", null);
__decorate([
    Abstract
], Uint64List.prototype, "join", null);
__decorate([
    Abstract
], Uint64List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Uint64List.prototype, "reduce", null);
__decorate([
    Abstract
], Uint64List.prototype, "sort", null);
__decorate([
    Abstract
], Uint64List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Uint64List.prototype, "length", null);
__decorate([
    Abstract
], Uint64List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Uint64List, "_Uint64List", null);
__decorate([
    namedFactory
], Uint64List, "_fromList", null);
__decorate([
    namedFactory
], Uint64List, "_view", null);
Uint64List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Uint64List);
export { Uint64List };
let Float32List = class Float32List extends TypedData {
    constructor(length) {
        super();
    }
    static _Float32List(length) {
        return new NativeFloat32List.withLength(length);
    }
    static _fromList(elements) {
        return new NativeFloat32List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Float32List.BYTES_PER_ELEMENT = 4;
__decorate([
    Abstract
], Float32List.prototype, "add", null);
__decorate([
    Abstract
], Float32List.prototype, "addAll", null);
__decorate([
    Abstract
], Float32List.prototype, "any", null);
__decorate([
    Abstract
], Float32List.prototype, "asMap", null);
__decorate([
    Abstract
], Float32List.prototype, "clear", null);
__decorate([
    Abstract
], Float32List.prototype, "contains", null);
__decorate([
    Abstract
], Float32List.prototype, "elementAt", null);
__decorate([
    Abstract
], Float32List.prototype, "expand", null);
__decorate([
    Abstract
], Float32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Float32List.prototype, "first", null);
__decorate([
    Abstract
], Float32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Float32List.prototype, "fold", null);
__decorate([
    Abstract
], Float32List.prototype, "getRange", null);
__decorate([
    Abstract
], Float32List.prototype, "insert", null);
__decorate([
    Abstract
], Float32List.prototype, "insertAll", null);
__decorate([
    Abstract
], Float32List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Float32List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Float32List.prototype, "iterator", null);
__decorate([
    Abstract
], Float32List.prototype, "last", null);
__decorate([
    Abstract
], Float32List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Float32List.prototype, "map", null);
__decorate([
    Abstract
], Float32List.prototype, "remove", null);
__decorate([
    Abstract
], Float32List.prototype, "removeAt", null);
__decorate([
    Abstract
], Float32List.prototype, "removeLast", null);
__decorate([
    Abstract
], Float32List.prototype, "removeRange", null);
__decorate([
    Abstract
], Float32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Float32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Float32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Float32List.prototype, "reversed", null);
__decorate([
    Abstract
], Float32List.prototype, "setAll", null);
__decorate([
    Abstract
], Float32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Float32List.prototype, "single", null);
__decorate([
    Abstract
], Float32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Float32List.prototype, "skip", null);
__decorate([
    Abstract
], Float32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Float32List.prototype, "take", null);
__decorate([
    Abstract
], Float32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Float32List.prototype, "toList", null);
__decorate([
    Abstract
], Float32List.prototype, "toSet", null);
__decorate([
    Abstract
], Float32List.prototype, "where", null);
__decorate([
    Abstract
], Float32List.prototype, "every", null);
__decorate([
    Abstract
], Float32List.prototype, "forEach", null);
__decorate([
    Abstract
], Float32List.prototype, "indexOf", null);
__decorate([
    Abstract
], Float32List.prototype, "join", null);
__decorate([
    Abstract
], Float32List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Float32List.prototype, "reduce", null);
__decorate([
    Abstract
], Float32List.prototype, "sort", null);
__decorate([
    Abstract
], Float32List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Float32List.prototype, "length", null);
__decorate([
    Abstract
], Float32List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Float32List, "_Float32List", null);
__decorate([
    namedFactory
], Float32List, "_fromList", null);
__decorate([
    namedFactory
], Float32List, "_view", null);
Float32List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Float32List);
export { Float32List };
let Float64List = class Float64List extends TypedData {
    constructor(length) {
        super();
    }
    static _Float64List(length) {
        return new NativeFloat64List.withLength(length);
    }
    static _fromList(elements) {
        return new NativeFloat64List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Float64List.BYTES_PER_ELEMENT = 8;
__decorate([
    Abstract
], Float64List.prototype, "add", null);
__decorate([
    Abstract
], Float64List.prototype, "addAll", null);
__decorate([
    Abstract
], Float64List.prototype, "any", null);
__decorate([
    Abstract
], Float64List.prototype, "asMap", null);
__decorate([
    Abstract
], Float64List.prototype, "clear", null);
__decorate([
    Abstract
], Float64List.prototype, "contains", null);
__decorate([
    Abstract
], Float64List.prototype, "elementAt", null);
__decorate([
    Abstract
], Float64List.prototype, "expand", null);
__decorate([
    Abstract
], Float64List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Float64List.prototype, "first", null);
__decorate([
    Abstract
], Float64List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Float64List.prototype, "fold", null);
__decorate([
    Abstract
], Float64List.prototype, "getRange", null);
__decorate([
    Abstract
], Float64List.prototype, "insert", null);
__decorate([
    Abstract
], Float64List.prototype, "insertAll", null);
__decorate([
    Abstract
], Float64List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Float64List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Float64List.prototype, "iterator", null);
__decorate([
    Abstract
], Float64List.prototype, "last", null);
__decorate([
    Abstract
], Float64List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Float64List.prototype, "map", null);
__decorate([
    Abstract
], Float64List.prototype, "remove", null);
__decorate([
    Abstract
], Float64List.prototype, "removeAt", null);
__decorate([
    Abstract
], Float64List.prototype, "removeLast", null);
__decorate([
    Abstract
], Float64List.prototype, "removeRange", null);
__decorate([
    Abstract
], Float64List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Float64List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Float64List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Float64List.prototype, "reversed", null);
__decorate([
    Abstract
], Float64List.prototype, "setAll", null);
__decorate([
    Abstract
], Float64List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Float64List.prototype, "single", null);
__decorate([
    Abstract
], Float64List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Float64List.prototype, "skip", null);
__decorate([
    Abstract
], Float64List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Float64List.prototype, "take", null);
__decorate([
    Abstract
], Float64List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Float64List.prototype, "toList", null);
__decorate([
    Abstract
], Float64List.prototype, "toSet", null);
__decorate([
    Abstract
], Float64List.prototype, "where", null);
__decorate([
    Abstract
], Float64List.prototype, "every", null);
__decorate([
    Abstract
], Float64List.prototype, "forEach", null);
__decorate([
    Abstract
], Float64List.prototype, "indexOf", null);
__decorate([
    Abstract
], Float64List.prototype, "join", null);
__decorate([
    Abstract
], Float64List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Float64List.prototype, "reduce", null);
__decorate([
    Abstract
], Float64List.prototype, "sort", null);
__decorate([
    Abstract
], Float64List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Float64List.prototype, "length", null);
__decorate([
    Abstract
], Float64List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Float64List, "_Float64List", null);
__decorate([
    namedFactory
], Float64List, "_fromList", null);
__decorate([
    namedFactory
], Float64List, "_view", null);
Float64List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Float64List);
export { Float64List };
let Float32x4List = class Float32x4List extends TypedData {
    constructor(length) {
        super();
    }
    static _Float32x4List(length) {
        return new NativeFloat32x4List(length);
    }
    static _fromList(elements) {
        return new NativeFloat32x4List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32x4List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Float32x4List.BYTES_PER_ELEMENT = 16;
__decorate([
    Abstract
], Float32x4List.prototype, "add", null);
__decorate([
    Abstract
], Float32x4List.prototype, "addAll", null);
__decorate([
    Abstract
], Float32x4List.prototype, "any", null);
__decorate([
    Abstract
], Float32x4List.prototype, "asMap", null);
__decorate([
    Abstract
], Float32x4List.prototype, "clear", null);
__decorate([
    Abstract
], Float32x4List.prototype, "contains", null);
__decorate([
    Abstract
], Float32x4List.prototype, "elementAt", null);
__decorate([
    Abstract
], Float32x4List.prototype, "expand", null);
__decorate([
    Abstract
], Float32x4List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Float32x4List.prototype, "first", null);
__decorate([
    Abstract
], Float32x4List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Float32x4List.prototype, "fold", null);
__decorate([
    Abstract
], Float32x4List.prototype, "getRange", null);
__decorate([
    Abstract
], Float32x4List.prototype, "insert", null);
__decorate([
    Abstract
], Float32x4List.prototype, "insertAll", null);
__decorate([
    Abstract
], Float32x4List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Float32x4List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Float32x4List.prototype, "iterator", null);
__decorate([
    Abstract
], Float32x4List.prototype, "last", null);
__decorate([
    Abstract
], Float32x4List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Float32x4List.prototype, "map", null);
__decorate([
    Abstract
], Float32x4List.prototype, "remove", null);
__decorate([
    Abstract
], Float32x4List.prototype, "removeAt", null);
__decorate([
    Abstract
], Float32x4List.prototype, "removeLast", null);
__decorate([
    Abstract
], Float32x4List.prototype, "removeRange", null);
__decorate([
    Abstract
], Float32x4List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Float32x4List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Float32x4List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Float32x4List.prototype, "reversed", null);
__decorate([
    Abstract
], Float32x4List.prototype, "setAll", null);
__decorate([
    Abstract
], Float32x4List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Float32x4List.prototype, "single", null);
__decorate([
    Abstract
], Float32x4List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Float32x4List.prototype, "skip", null);
__decorate([
    Abstract
], Float32x4List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Float32x4List.prototype, "take", null);
__decorate([
    Abstract
], Float32x4List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Float32x4List.prototype, "toList", null);
__decorate([
    Abstract
], Float32x4List.prototype, "toSet", null);
__decorate([
    Abstract
], Float32x4List.prototype, "where", null);
__decorate([
    Abstract
], Float32x4List.prototype, "every", null);
__decorate([
    Abstract
], Float32x4List.prototype, "forEach", null);
__decorate([
    Abstract
], Float32x4List.prototype, "indexOf", null);
__decorate([
    Abstract
], Float32x4List.prototype, "join", null);
__decorate([
    Abstract
], Float32x4List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Float32x4List.prototype, "reduce", null);
__decorate([
    Abstract
], Float32x4List.prototype, "sort", null);
__decorate([
    Abstract
], Float32x4List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Float32x4List.prototype, "length", null);
__decorate([
    Abstract
], Float32x4List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Float32x4List, "_Float32x4List", null);
__decorate([
    namedFactory
], Float32x4List, "_fromList", null);
__decorate([
    namedFactory
], Float32x4List, "_view", null);
Float32x4List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Float32x4List);
export { Float32x4List };
let Int32x4List = class Int32x4List extends TypedData {
    constructor(length) {
        super();
    }
    static _Int32x4List(length) {
        return new NativeInt32x4List(length);
    }
    static _fromList(elements) {
        return new NativeInt32x4List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32x4List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Int32x4List.BYTES_PER_ELEMENT = 16;
__decorate([
    Abstract
], Int32x4List.prototype, "add", null);
__decorate([
    Abstract
], Int32x4List.prototype, "addAll", null);
__decorate([
    Abstract
], Int32x4List.prototype, "any", null);
__decorate([
    Abstract
], Int32x4List.prototype, "asMap", null);
__decorate([
    Abstract
], Int32x4List.prototype, "clear", null);
__decorate([
    Abstract
], Int32x4List.prototype, "contains", null);
__decorate([
    Abstract
], Int32x4List.prototype, "elementAt", null);
__decorate([
    Abstract
], Int32x4List.prototype, "expand", null);
__decorate([
    Abstract
], Int32x4List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Int32x4List.prototype, "first", null);
__decorate([
    Abstract
], Int32x4List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Int32x4List.prototype, "fold", null);
__decorate([
    Abstract
], Int32x4List.prototype, "getRange", null);
__decorate([
    Abstract
], Int32x4List.prototype, "insert", null);
__decorate([
    Abstract
], Int32x4List.prototype, "insertAll", null);
__decorate([
    Abstract
], Int32x4List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Int32x4List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Int32x4List.prototype, "iterator", null);
__decorate([
    Abstract
], Int32x4List.prototype, "last", null);
__decorate([
    Abstract
], Int32x4List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Int32x4List.prototype, "map", null);
__decorate([
    Abstract
], Int32x4List.prototype, "remove", null);
__decorate([
    Abstract
], Int32x4List.prototype, "removeAt", null);
__decorate([
    Abstract
], Int32x4List.prototype, "removeLast", null);
__decorate([
    Abstract
], Int32x4List.prototype, "removeRange", null);
__decorate([
    Abstract
], Int32x4List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Int32x4List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Int32x4List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Int32x4List.prototype, "reversed", null);
__decorate([
    Abstract
], Int32x4List.prototype, "setAll", null);
__decorate([
    Abstract
], Int32x4List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Int32x4List.prototype, "single", null);
__decorate([
    Abstract
], Int32x4List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Int32x4List.prototype, "skip", null);
__decorate([
    Abstract
], Int32x4List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Int32x4List.prototype, "take", null);
__decorate([
    Abstract
], Int32x4List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Int32x4List.prototype, "toList", null);
__decorate([
    Abstract
], Int32x4List.prototype, "toSet", null);
__decorate([
    Abstract
], Int32x4List.prototype, "where", null);
__decorate([
    Abstract
], Int32x4List.prototype, "every", null);
__decorate([
    Abstract
], Int32x4List.prototype, "forEach", null);
__decorate([
    Abstract
], Int32x4List.prototype, "indexOf", null);
__decorate([
    Abstract
], Int32x4List.prototype, "join", null);
__decorate([
    Abstract
], Int32x4List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Int32x4List.prototype, "reduce", null);
__decorate([
    Abstract
], Int32x4List.prototype, "sort", null);
__decorate([
    Abstract
], Int32x4List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Int32x4List.prototype, "length", null);
__decorate([
    Abstract
], Int32x4List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Int32x4List, "_Int32x4List", null);
__decorate([
    namedFactory
], Int32x4List, "_fromList", null);
__decorate([
    namedFactory
], Int32x4List, "_view", null);
Int32x4List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Int32x4List);
export { Int32x4List };
let Float64x2List = class Float64x2List extends TypedData {
    constructor(length) {
        super();
    }
    static _Float64x2List(length) {
        return new NativeFloat64x2List(length);
    }
    static _fromList(elements) {
        return new NativeFloat64x2List.fromList(elements);
    }
    static _view(buffer, offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64x2List(offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
Float64x2List.BYTES_PER_ELEMENT = 16;
__decorate([
    Abstract
], Float64x2List.prototype, "add", null);
__decorate([
    Abstract
], Float64x2List.prototype, "addAll", null);
__decorate([
    Abstract
], Float64x2List.prototype, "any", null);
__decorate([
    Abstract
], Float64x2List.prototype, "asMap", null);
__decorate([
    Abstract
], Float64x2List.prototype, "clear", null);
__decorate([
    Abstract
], Float64x2List.prototype, "contains", null);
__decorate([
    Abstract
], Float64x2List.prototype, "elementAt", null);
__decorate([
    Abstract
], Float64x2List.prototype, "expand", null);
__decorate([
    Abstract
], Float64x2List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], Float64x2List.prototype, "first", null);
__decorate([
    Abstract
], Float64x2List.prototype, "firstWhere", null);
__decorate([
    Abstract
], Float64x2List.prototype, "fold", null);
__decorate([
    Abstract
], Float64x2List.prototype, "getRange", null);
__decorate([
    Abstract
], Float64x2List.prototype, "insert", null);
__decorate([
    Abstract
], Float64x2List.prototype, "insertAll", null);
__decorate([
    Abstract
], Float64x2List.prototype, "isEmpty", null);
__decorate([
    Abstract
], Float64x2List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], Float64x2List.prototype, "iterator", null);
__decorate([
    Abstract
], Float64x2List.prototype, "last", null);
__decorate([
    Abstract
], Float64x2List.prototype, "lastWhere", null);
__decorate([
    Abstract
], Float64x2List.prototype, "map", null);
__decorate([
    Abstract
], Float64x2List.prototype, "remove", null);
__decorate([
    Abstract
], Float64x2List.prototype, "removeAt", null);
__decorate([
    Abstract
], Float64x2List.prototype, "removeLast", null);
__decorate([
    Abstract
], Float64x2List.prototype, "removeRange", null);
__decorate([
    Abstract
], Float64x2List.prototype, "removeWhere", null);
__decorate([
    Abstract
], Float64x2List.prototype, "replaceRange", null);
__decorate([
    Abstract
], Float64x2List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], Float64x2List.prototype, "reversed", null);
__decorate([
    Abstract
], Float64x2List.prototype, "setAll", null);
__decorate([
    Abstract
], Float64x2List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], Float64x2List.prototype, "single", null);
__decorate([
    Abstract
], Float64x2List.prototype, "singleWhere", null);
__decorate([
    Abstract
], Float64x2List.prototype, "skip", null);
__decorate([
    Abstract
], Float64x2List.prototype, "skipWhile", null);
__decorate([
    Abstract
], Float64x2List.prototype, "take", null);
__decorate([
    Abstract
], Float64x2List.prototype, "takeWhile", null);
__decorate([
    Abstract
], Float64x2List.prototype, "toList", null);
__decorate([
    Abstract
], Float64x2List.prototype, "toSet", null);
__decorate([
    Abstract
], Float64x2List.prototype, "where", null);
__decorate([
    Abstract
], Float64x2List.prototype, "every", null);
__decorate([
    Abstract
], Float64x2List.prototype, "forEach", null);
__decorate([
    Abstract
], Float64x2List.prototype, "indexOf", null);
__decorate([
    Abstract
], Float64x2List.prototype, "join", null);
__decorate([
    Abstract
], Float64x2List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], Float64x2List.prototype, "reduce", null);
__decorate([
    Abstract
], Float64x2List.prototype, "sort", null);
__decorate([
    Abstract
], Float64x2List.prototype, "sublist", null);
__decorate([
    AbstractProperty
], Float64x2List.prototype, "length", null);
__decorate([
    Abstract
], Float64x2List.prototype, "setRange", null);
__decorate([
    defaultFactory
], Float64x2List, "_Float64x2List", null);
__decorate([
    namedFactory
], Float64x2List, "_fromList", null);
__decorate([
    namedFactory
], Float64x2List, "_view", null);
Float64x2List = __decorate([
    DartClass,
    Implements(core.DartList, TypedData),
    With(core.DartListMixin)
], Float64x2List);
export { Float64x2List };
let Float32x4 = Float32x4_1 = class Float32x4 {
    constructor(x, y, z, w) {
    }
    static _Float32x4(x, y, z, w) {
        return new NativeFloat32x4(x, y, z, w);
    }
    static _splat(v) {
        return new NativeFloat32x4.splat(v);
    }
    static _zero() {
        return new NativeFloat32x4.zero();
    }
    static _fromInt32x4Bits(x) {
        return new NativeFloat32x4.fromInt32x4Bits(x);
    }
    static _fromFloat64x2(v) {
        return new Float32x4_1.fromFloat64x2(v);
    }
    //@AbstractProperty
    [OperatorMethods.PLUS](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.NEGATE]() {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.MINUS](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.MULTIPLY](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.DIVIDE](other) {
        throw 'abstract';
    }
    lessThan(other) {
        throw 'abstract';
    }
    lessThanOrEqual(other) {
        throw 'abstract';
    }
    greaterThan(other) {
        throw 'abstract';
    }
    greaterThanOrEqual(other) {
        throw 'abstract';
    }
    equal(other) {
        throw 'abstract';
    }
    notEqual(other) {
        throw 'abstract';
    }
    scale(s) {
        throw 'abstract';
    }
    abs() {
        throw 'abstract';
    }
    clamp(lowerLimit, upperLimit) {
        throw 'abstract';
    }
    get x() {
        throw 'abstract';
    }
    get y() {
        throw 'abstract';
    }
    get z() {
        throw 'abstract';
    }
    get w() {
        throw 'abstract';
    }
    get signMask() {
        throw 'abstract';
    }
    shuffle(mask) {
        throw 'abstract';
    }
    shuffleMix(other, mask) {
        throw 'abstract';
    }
    withX(x) {
        throw 'abstract';
    }
    withY(y) {
        throw 'abstract';
    }
    withZ(z) {
        throw 'abstract';
    }
    withW(w) {
        throw 'abstract';
    }
    min(other) {
        throw 'abstract';
    }
    max(other) {
        throw 'abstract';
    }
    sqrt() {
        throw 'abstract';
    }
    reciprocal() {
        throw 'abstract';
    }
    reciprocalSqrt() {
        throw 'abstract';
    }
};
Float32x4.XXXX = 0;
Float32x4.XXXY = 64;
Float32x4.XXXZ = 128;
Float32x4.XXXW = 192;
Float32x4.XXYX = 16;
Float32x4.XXYY = 80;
Float32x4.XXYZ = 144;
Float32x4.XXYW = 208;
Float32x4.XXZX = 32;
Float32x4.XXZY = 96;
Float32x4.XXZZ = 160;
Float32x4.XXZW = 224;
Float32x4.XXWX = 48;
Float32x4.XXWY = 112;
Float32x4.XXWZ = 176;
Float32x4.XXWW = 240;
Float32x4.XYXX = 4;
Float32x4.XYXY = 68;
Float32x4.XYXZ = 132;
Float32x4.XYXW = 196;
Float32x4.XYYX = 20;
Float32x4.XYYY = 84;
Float32x4.XYYZ = 148;
Float32x4.XYYW = 212;
Float32x4.XYZX = 36;
Float32x4.XYZY = 100;
Float32x4.XYZZ = 164;
Float32x4.XYZW = 228;
Float32x4.XYWX = 52;
Float32x4.XYWY = 116;
Float32x4.XYWZ = 180;
Float32x4.XYWW = 244;
Float32x4.XZXX = 8;
Float32x4.XZXY = 72;
Float32x4.XZXZ = 136;
Float32x4.XZXW = 200;
Float32x4.XZYX = 24;
Float32x4.XZYY = 88;
Float32x4.XZYZ = 152;
Float32x4.XZYW = 216;
Float32x4.XZZX = 40;
Float32x4.XZZY = 104;
Float32x4.XZZZ = 168;
Float32x4.XZZW = 232;
Float32x4.XZWX = 56;
Float32x4.XZWY = 120;
Float32x4.XZWZ = 184;
Float32x4.XZWW = 248;
Float32x4.XWXX = 12;
Float32x4.XWXY = 76;
Float32x4.XWXZ = 140;
Float32x4.XWXW = 204;
Float32x4.XWYX = 28;
Float32x4.XWYY = 92;
Float32x4.XWYZ = 156;
Float32x4.XWYW = 220;
Float32x4.XWZX = 44;
Float32x4.XWZY = 108;
Float32x4.XWZZ = 172;
Float32x4.XWZW = 236;
Float32x4.XWWX = 60;
Float32x4.XWWY = 124;
Float32x4.XWWZ = 188;
Float32x4.XWWW = 252;
Float32x4.YXXX = 1;
Float32x4.YXXY = 65;
Float32x4.YXXZ = 129;
Float32x4.YXXW = 193;
Float32x4.YXYX = 17;
Float32x4.YXYY = 81;
Float32x4.YXYZ = 145;
Float32x4.YXYW = 209;
Float32x4.YXZX = 33;
Float32x4.YXZY = 97;
Float32x4.YXZZ = 161;
Float32x4.YXZW = 225;
Float32x4.YXWX = 49;
Float32x4.YXWY = 113;
Float32x4.YXWZ = 177;
Float32x4.YXWW = 241;
Float32x4.YYXX = 5;
Float32x4.YYXY = 69;
Float32x4.YYXZ = 133;
Float32x4.YYXW = 197;
Float32x4.YYYX = 21;
Float32x4.YYYY = 85;
Float32x4.YYYZ = 149;
Float32x4.YYYW = 213;
Float32x4.YYZX = 37;
Float32x4.YYZY = 101;
Float32x4.YYZZ = 165;
Float32x4.YYZW = 229;
Float32x4.YYWX = 53;
Float32x4.YYWY = 117;
Float32x4.YYWZ = 181;
Float32x4.YYWW = 245;
Float32x4.YZXX = 9;
Float32x4.YZXY = 73;
Float32x4.YZXZ = 137;
Float32x4.YZXW = 201;
Float32x4.YZYX = 25;
Float32x4.YZYY = 89;
Float32x4.YZYZ = 153;
Float32x4.YZYW = 217;
Float32x4.YZZX = 41;
Float32x4.YZZY = 105;
Float32x4.YZZZ = 169;
Float32x4.YZZW = 233;
Float32x4.YZWX = 57;
Float32x4.YZWY = 121;
Float32x4.YZWZ = 185;
Float32x4.YZWW = 249;
Float32x4.YWXX = 13;
Float32x4.YWXY = 77;
Float32x4.YWXZ = 141;
Float32x4.YWXW = 205;
Float32x4.YWYX = 29;
Float32x4.YWYY = 93;
Float32x4.YWYZ = 157;
Float32x4.YWYW = 221;
Float32x4.YWZX = 45;
Float32x4.YWZY = 109;
Float32x4.YWZZ = 173;
Float32x4.YWZW = 237;
Float32x4.YWWX = 61;
Float32x4.YWWY = 125;
Float32x4.YWWZ = 189;
Float32x4.YWWW = 253;
Float32x4.ZXXX = 2;
Float32x4.ZXXY = 66;
Float32x4.ZXXZ = 130;
Float32x4.ZXXW = 194;
Float32x4.ZXYX = 18;
Float32x4.ZXYY = 82;
Float32x4.ZXYZ = 146;
Float32x4.ZXYW = 210;
Float32x4.ZXZX = 34;
Float32x4.ZXZY = 98;
Float32x4.ZXZZ = 162;
Float32x4.ZXZW = 226;
Float32x4.ZXWX = 50;
Float32x4.ZXWY = 114;
Float32x4.ZXWZ = 178;
Float32x4.ZXWW = 242;
Float32x4.ZYXX = 6;
Float32x4.ZYXY = 70;
Float32x4.ZYXZ = 134;
Float32x4.ZYXW = 198;
Float32x4.ZYYX = 22;
Float32x4.ZYYY = 86;
Float32x4.ZYYZ = 150;
Float32x4.ZYYW = 214;
Float32x4.ZYZX = 38;
Float32x4.ZYZY = 102;
Float32x4.ZYZZ = 166;
Float32x4.ZYZW = 230;
Float32x4.ZYWX = 54;
Float32x4.ZYWY = 118;
Float32x4.ZYWZ = 182;
Float32x4.ZYWW = 246;
Float32x4.ZZXX = 10;
Float32x4.ZZXY = 74;
Float32x4.ZZXZ = 138;
Float32x4.ZZXW = 202;
Float32x4.ZZYX = 26;
Float32x4.ZZYY = 90;
Float32x4.ZZYZ = 154;
Float32x4.ZZYW = 218;
Float32x4.ZZZX = 42;
Float32x4.ZZZY = 106;
Float32x4.ZZZZ = 170;
Float32x4.ZZZW = 234;
Float32x4.ZZWX = 58;
Float32x4.ZZWY = 122;
Float32x4.ZZWZ = 186;
Float32x4.ZZWW = 250;
Float32x4.ZWXX = 14;
Float32x4.ZWXY = 78;
Float32x4.ZWXZ = 142;
Float32x4.ZWXW = 206;
Float32x4.ZWYX = 30;
Float32x4.ZWYY = 94;
Float32x4.ZWYZ = 158;
Float32x4.ZWYW = 222;
Float32x4.ZWZX = 46;
Float32x4.ZWZY = 110;
Float32x4.ZWZZ = 174;
Float32x4.ZWZW = 238;
Float32x4.ZWWX = 62;
Float32x4.ZWWY = 126;
Float32x4.ZWWZ = 190;
Float32x4.ZWWW = 254;
Float32x4.WXXX = 3;
Float32x4.WXXY = 67;
Float32x4.WXXZ = 131;
Float32x4.WXXW = 195;
Float32x4.WXYX = 19;
Float32x4.WXYY = 83;
Float32x4.WXYZ = 147;
Float32x4.WXYW = 211;
Float32x4.WXZX = 35;
Float32x4.WXZY = 99;
Float32x4.WXZZ = 163;
Float32x4.WXZW = 227;
Float32x4.WXWX = 51;
Float32x4.WXWY = 115;
Float32x4.WXWZ = 179;
Float32x4.WXWW = 243;
Float32x4.WYXX = 7;
Float32x4.WYXY = 71;
Float32x4.WYXZ = 135;
Float32x4.WYXW = 199;
Float32x4.WYYX = 23;
Float32x4.WYYY = 87;
Float32x4.WYYZ = 151;
Float32x4.WYYW = 215;
Float32x4.WYZX = 39;
Float32x4.WYZY = 103;
Float32x4.WYZZ = 167;
Float32x4.WYZW = 231;
Float32x4.WYWX = 55;
Float32x4.WYWY = 119;
Float32x4.WYWZ = 183;
Float32x4.WYWW = 247;
Float32x4.WZXX = 11;
Float32x4.WZXY = 75;
Float32x4.WZXZ = 139;
Float32x4.WZXW = 203;
Float32x4.WZYX = 27;
Float32x4.WZYY = 91;
Float32x4.WZYZ = 155;
Float32x4.WZYW = 219;
Float32x4.WZZX = 43;
Float32x4.WZZY = 107;
Float32x4.WZZZ = 171;
Float32x4.WZZW = 235;
Float32x4.WZWX = 59;
Float32x4.WZWY = 123;
Float32x4.WZWZ = 187;
Float32x4.WZWW = 251;
Float32x4.WWXX = 15;
Float32x4.WWXY = 79;
Float32x4.WWXZ = 143;
Float32x4.WWXW = 207;
Float32x4.WWYX = 31;
Float32x4.WWYY = 95;
Float32x4.WWYZ = 159;
Float32x4.WWYW = 223;
Float32x4.WWZX = 47;
Float32x4.WWZY = 111;
Float32x4.WWZZ = 175;
Float32x4.WWZW = 239;
Float32x4.WWWX = 63;
Float32x4.WWWY = 127;
Float32x4.WWWZ = 191;
Float32x4.WWWW = 255;
__decorate([
    Abstract
], Float32x4.prototype, "lessThan", null);
__decorate([
    Abstract
], Float32x4.prototype, "lessThanOrEqual", null);
__decorate([
    Abstract
], Float32x4.prototype, "greaterThan", null);
__decorate([
    Abstract
], Float32x4.prototype, "greaterThanOrEqual", null);
__decorate([
    Abstract
], Float32x4.prototype, "equal", null);
__decorate([
    Abstract
], Float32x4.prototype, "notEqual", null);
__decorate([
    Abstract
], Float32x4.prototype, "scale", null);
__decorate([
    Abstract
], Float32x4.prototype, "abs", null);
__decorate([
    Abstract
], Float32x4.prototype, "clamp", null);
__decorate([
    AbstractProperty
], Float32x4.prototype, "x", null);
__decorate([
    AbstractProperty
], Float32x4.prototype, "y", null);
__decorate([
    AbstractProperty
], Float32x4.prototype, "z", null);
__decorate([
    AbstractProperty
], Float32x4.prototype, "w", null);
__decorate([
    AbstractProperty
], Float32x4.prototype, "signMask", null);
__decorate([
    Abstract
], Float32x4.prototype, "shuffle", null);
__decorate([
    Abstract
], Float32x4.prototype, "shuffleMix", null);
__decorate([
    Abstract
], Float32x4.prototype, "withX", null);
__decorate([
    Abstract
], Float32x4.prototype, "withY", null);
__decorate([
    Abstract
], Float32x4.prototype, "withZ", null);
__decorate([
    Abstract
], Float32x4.prototype, "withW", null);
__decorate([
    Abstract
], Float32x4.prototype, "min", null);
__decorate([
    Abstract
], Float32x4.prototype, "max", null);
__decorate([
    Abstract
], Float32x4.prototype, "sqrt", null);
__decorate([
    Abstract
], Float32x4.prototype, "reciprocal", null);
__decorate([
    Abstract
], Float32x4.prototype, "reciprocalSqrt", null);
__decorate([
    defaultFactory
], Float32x4, "_Float32x4", null);
__decorate([
    namedFactory
], Float32x4, "_splat", null);
__decorate([
    namedFactory
], Float32x4, "_zero", null);
__decorate([
    namedFactory
], Float32x4, "_fromInt32x4Bits", null);
__decorate([
    namedFactory
], Float32x4, "_fromFloat64x2", null);
Float32x4 = Float32x4_1 = __decorate([
    DartClass
], Float32x4);
export { Float32x4 };
let Int32x4 = class Int32x4 {
    constructor(x, y, z, w) {
    }
    static _Int32x4(x, y, z, w) {
        return new NativeInt32x4(x, y, z, w);
    }
    static _bool(x, y, z, w) {
        return new NativeInt32x4.bool(x, y, z, w);
    }
    static _fromFloat32x4Bits(x) {
        return new NativeInt32x4.fromFloat32x4Bits(x);
    }
    //@Abstract
    [OperatorMethods.BINARY_OR](other) {
        throw 'abstract';
    }
    //@Abstract
    [OperatorMethods.BINARY_AND](other) {
        throw 'abstract';
    }
    //@Abstract
    [OperatorMethods.XOR](other) {
        throw 'abstract';
    }
    //@Abstract
    [OperatorMethods.PLUS](other) {
        throw 'abstract';
    }
    //@Abstract
    [OperatorMethods.MINUS](other) {
        throw 'abstract';
    }
    get x() {
        throw 'abstract';
    }
    get y() {
        throw 'abstract';
    }
    get z() {
        throw 'abstract';
    }
    get w() {
        throw 'abstract';
    }
    get signMask() {
        throw 'abstract';
    }
    shuffle(mask) {
        throw 'abstract';
    }
    shuffleMix(other, mask) {
        throw 'abstract';
    }
    withX(x) {
        throw 'abstract';
    }
    withY(y) {
        throw 'abstract';
    }
    withZ(z) {
        throw 'abstract';
    }
    withW(w) {
        throw 'abstract';
    }
    get flagX() {
        throw 'abstract';
    }
    get flagY() {
        throw 'abstract';
    }
    get flagZ() {
        throw 'abstract';
    }
    get flagW() {
        throw 'abstract';
    }
    withFlagX(x) {
        throw 'abstract';
    }
    withFlagY(y) {
        throw 'abstract';
    }
    withFlagZ(z) {
        throw 'abstract';
    }
    withFlagW(w) {
        throw 'abstract';
    }
    select(trueValue, falseValue) {
        throw 'abstract';
    }
};
Int32x4.XXXX = 0;
Int32x4.XXXY = 64;
Int32x4.XXXZ = 128;
Int32x4.XXXW = 192;
Int32x4.XXYX = 16;
Int32x4.XXYY = 80;
Int32x4.XXYZ = 144;
Int32x4.XXYW = 208;
Int32x4.XXZX = 32;
Int32x4.XXZY = 96;
Int32x4.XXZZ = 160;
Int32x4.XXZW = 224;
Int32x4.XXWX = 48;
Int32x4.XXWY = 112;
Int32x4.XXWZ = 176;
Int32x4.XXWW = 240;
Int32x4.XYXX = 4;
Int32x4.XYXY = 68;
Int32x4.XYXZ = 132;
Int32x4.XYXW = 196;
Int32x4.XYYX = 20;
Int32x4.XYYY = 84;
Int32x4.XYYZ = 148;
Int32x4.XYYW = 212;
Int32x4.XYZX = 36;
Int32x4.XYZY = 100;
Int32x4.XYZZ = 164;
Int32x4.XYZW = 228;
Int32x4.XYWX = 52;
Int32x4.XYWY = 116;
Int32x4.XYWZ = 180;
Int32x4.XYWW = 244;
Int32x4.XZXX = 8;
Int32x4.XZXY = 72;
Int32x4.XZXZ = 136;
Int32x4.XZXW = 200;
Int32x4.XZYX = 24;
Int32x4.XZYY = 88;
Int32x4.XZYZ = 152;
Int32x4.XZYW = 216;
Int32x4.XZZX = 40;
Int32x4.XZZY = 104;
Int32x4.XZZZ = 168;
Int32x4.XZZW = 232;
Int32x4.XZWX = 56;
Int32x4.XZWY = 120;
Int32x4.XZWZ = 184;
Int32x4.XZWW = 248;
Int32x4.XWXX = 12;
Int32x4.XWXY = 76;
Int32x4.XWXZ = 140;
Int32x4.XWXW = 204;
Int32x4.XWYX = 28;
Int32x4.XWYY = 92;
Int32x4.XWYZ = 156;
Int32x4.XWYW = 220;
Int32x4.XWZX = 44;
Int32x4.XWZY = 108;
Int32x4.XWZZ = 172;
Int32x4.XWZW = 236;
Int32x4.XWWX = 60;
Int32x4.XWWY = 124;
Int32x4.XWWZ = 188;
Int32x4.XWWW = 252;
Int32x4.YXXX = 1;
Int32x4.YXXY = 65;
Int32x4.YXXZ = 129;
Int32x4.YXXW = 193;
Int32x4.YXYX = 17;
Int32x4.YXYY = 81;
Int32x4.YXYZ = 145;
Int32x4.YXYW = 209;
Int32x4.YXZX = 33;
Int32x4.YXZY = 97;
Int32x4.YXZZ = 161;
Int32x4.YXZW = 225;
Int32x4.YXWX = 49;
Int32x4.YXWY = 113;
Int32x4.YXWZ = 177;
Int32x4.YXWW = 241;
Int32x4.YYXX = 5;
Int32x4.YYXY = 69;
Int32x4.YYXZ = 133;
Int32x4.YYXW = 197;
Int32x4.YYYX = 21;
Int32x4.YYYY = 85;
Int32x4.YYYZ = 149;
Int32x4.YYYW = 213;
Int32x4.YYZX = 37;
Int32x4.YYZY = 101;
Int32x4.YYZZ = 165;
Int32x4.YYZW = 229;
Int32x4.YYWX = 53;
Int32x4.YYWY = 117;
Int32x4.YYWZ = 181;
Int32x4.YYWW = 245;
Int32x4.YZXX = 9;
Int32x4.YZXY = 73;
Int32x4.YZXZ = 137;
Int32x4.YZXW = 201;
Int32x4.YZYX = 25;
Int32x4.YZYY = 89;
Int32x4.YZYZ = 153;
Int32x4.YZYW = 217;
Int32x4.YZZX = 41;
Int32x4.YZZY = 105;
Int32x4.YZZZ = 169;
Int32x4.YZZW = 233;
Int32x4.YZWX = 57;
Int32x4.YZWY = 121;
Int32x4.YZWZ = 185;
Int32x4.YZWW = 249;
Int32x4.YWXX = 13;
Int32x4.YWXY = 77;
Int32x4.YWXZ = 141;
Int32x4.YWXW = 205;
Int32x4.YWYX = 29;
Int32x4.YWYY = 93;
Int32x4.YWYZ = 157;
Int32x4.YWYW = 221;
Int32x4.YWZX = 45;
Int32x4.YWZY = 109;
Int32x4.YWZZ = 173;
Int32x4.YWZW = 237;
Int32x4.YWWX = 61;
Int32x4.YWWY = 125;
Int32x4.YWWZ = 189;
Int32x4.YWWW = 253;
Int32x4.ZXXX = 2;
Int32x4.ZXXY = 66;
Int32x4.ZXXZ = 130;
Int32x4.ZXXW = 194;
Int32x4.ZXYX = 18;
Int32x4.ZXYY = 82;
Int32x4.ZXYZ = 146;
Int32x4.ZXYW = 210;
Int32x4.ZXZX = 34;
Int32x4.ZXZY = 98;
Int32x4.ZXZZ = 162;
Int32x4.ZXZW = 226;
Int32x4.ZXWX = 50;
Int32x4.ZXWY = 114;
Int32x4.ZXWZ = 178;
Int32x4.ZXWW = 242;
Int32x4.ZYXX = 6;
Int32x4.ZYXY = 70;
Int32x4.ZYXZ = 134;
Int32x4.ZYXW = 198;
Int32x4.ZYYX = 22;
Int32x4.ZYYY = 86;
Int32x4.ZYYZ = 150;
Int32x4.ZYYW = 214;
Int32x4.ZYZX = 38;
Int32x4.ZYZY = 102;
Int32x4.ZYZZ = 166;
Int32x4.ZYZW = 230;
Int32x4.ZYWX = 54;
Int32x4.ZYWY = 118;
Int32x4.ZYWZ = 182;
Int32x4.ZYWW = 246;
Int32x4.ZZXX = 10;
Int32x4.ZZXY = 74;
Int32x4.ZZXZ = 138;
Int32x4.ZZXW = 202;
Int32x4.ZZYX = 26;
Int32x4.ZZYY = 90;
Int32x4.ZZYZ = 154;
Int32x4.ZZYW = 218;
Int32x4.ZZZX = 42;
Int32x4.ZZZY = 106;
Int32x4.ZZZZ = 170;
Int32x4.ZZZW = 234;
Int32x4.ZZWX = 58;
Int32x4.ZZWY = 122;
Int32x4.ZZWZ = 186;
Int32x4.ZZWW = 250;
Int32x4.ZWXX = 14;
Int32x4.ZWXY = 78;
Int32x4.ZWXZ = 142;
Int32x4.ZWXW = 206;
Int32x4.ZWYX = 30;
Int32x4.ZWYY = 94;
Int32x4.ZWYZ = 158;
Int32x4.ZWYW = 222;
Int32x4.ZWZX = 46;
Int32x4.ZWZY = 110;
Int32x4.ZWZZ = 174;
Int32x4.ZWZW = 238;
Int32x4.ZWWX = 62;
Int32x4.ZWWY = 126;
Int32x4.ZWWZ = 190;
Int32x4.ZWWW = 254;
Int32x4.WXXX = 3;
Int32x4.WXXY = 67;
Int32x4.WXXZ = 131;
Int32x4.WXXW = 195;
Int32x4.WXYX = 19;
Int32x4.WXYY = 83;
Int32x4.WXYZ = 147;
Int32x4.WXYW = 211;
Int32x4.WXZX = 35;
Int32x4.WXZY = 99;
Int32x4.WXZZ = 163;
Int32x4.WXZW = 227;
Int32x4.WXWX = 51;
Int32x4.WXWY = 115;
Int32x4.WXWZ = 179;
Int32x4.WXWW = 243;
Int32x4.WYXX = 7;
Int32x4.WYXY = 71;
Int32x4.WYXZ = 135;
Int32x4.WYXW = 199;
Int32x4.WYYX = 23;
Int32x4.WYYY = 87;
Int32x4.WYYZ = 151;
Int32x4.WYYW = 215;
Int32x4.WYZX = 39;
Int32x4.WYZY = 103;
Int32x4.WYZZ = 167;
Int32x4.WYZW = 231;
Int32x4.WYWX = 55;
Int32x4.WYWY = 119;
Int32x4.WYWZ = 183;
Int32x4.WYWW = 247;
Int32x4.WZXX = 11;
Int32x4.WZXY = 75;
Int32x4.WZXZ = 139;
Int32x4.WZXW = 203;
Int32x4.WZYX = 27;
Int32x4.WZYY = 91;
Int32x4.WZYZ = 155;
Int32x4.WZYW = 219;
Int32x4.WZZX = 43;
Int32x4.WZZY = 107;
Int32x4.WZZZ = 171;
Int32x4.WZZW = 235;
Int32x4.WZWX = 59;
Int32x4.WZWY = 123;
Int32x4.WZWZ = 187;
Int32x4.WZWW = 251;
Int32x4.WWXX = 15;
Int32x4.WWXY = 79;
Int32x4.WWXZ = 143;
Int32x4.WWXW = 207;
Int32x4.WWYX = 31;
Int32x4.WWYY = 95;
Int32x4.WWYZ = 159;
Int32x4.WWYW = 223;
Int32x4.WWZX = 47;
Int32x4.WWZY = 111;
Int32x4.WWZZ = 175;
Int32x4.WWZW = 239;
Int32x4.WWWX = 63;
Int32x4.WWWY = 127;
Int32x4.WWWZ = 191;
Int32x4.WWWW = 255;
__decorate([
    AbstractProperty
], Int32x4.prototype, "x", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "y", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "z", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "w", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "signMask", null);
__decorate([
    Abstract
], Int32x4.prototype, "shuffle", null);
__decorate([
    Abstract
], Int32x4.prototype, "shuffleMix", null);
__decorate([
    Abstract
], Int32x4.prototype, "withX", null);
__decorate([
    Abstract
], Int32x4.prototype, "withY", null);
__decorate([
    Abstract
], Int32x4.prototype, "withZ", null);
__decorate([
    Abstract
], Int32x4.prototype, "withW", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "flagX", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "flagY", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "flagZ", null);
__decorate([
    AbstractProperty
], Int32x4.prototype, "flagW", null);
__decorate([
    Abstract
], Int32x4.prototype, "withFlagX", null);
__decorate([
    Abstract
], Int32x4.prototype, "withFlagY", null);
__decorate([
    Abstract
], Int32x4.prototype, "withFlagZ", null);
__decorate([
    Abstract
], Int32x4.prototype, "withFlagW", null);
__decorate([
    Abstract
], Int32x4.prototype, "select", null);
__decorate([
    defaultFactory
], Int32x4, "_Int32x4", null);
__decorate([
    namedFactory
], Int32x4, "_bool", null);
__decorate([
    namedFactory
], Int32x4, "_fromFloat32x4Bits", null);
Int32x4 = __decorate([
    DartClass,
    AbstractSymbols(OperatorMethods.BINARY_OR, OperatorMethods.BINARY_AND, OperatorMethods.XOR, OperatorMethods.PLUS, OperatorMethods.MINUS)
], Int32x4);
export { Int32x4 };
let Float64x2 = class Float64x2 {
    constructor(x, y) {
    }
    static _Float64x2(x, y) {
        return new NativeFloat64x2(x, y);
    }
    static _splat(v) {
        return new NativeFloat64x2.splat(v);
    }
    static _zero() {
        return new NativeFloat64x2.zero();
    }
    static _fromFloat32x4(v) {
        return new NativeFloat64x2.fromFloat32x4(v);
    }
    // @Abstract
    [OperatorMethods.PLUS](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.NEGATE]() {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.MINUS](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.MULTIPLY](other) {
        throw 'abstract';
    }
    // @Abstract
    [OperatorMethods.DIVIDE](other) {
        throw 'abstract';
    }
    scale(s) {
        throw 'abstract';
    }
    abs() {
        throw 'abstract';
    }
    clamp(lowerLimit, upperLimit) {
        throw 'abstract';
    }
    get x() {
        throw 'abstract';
    }
    get y() {
        throw 'abstract';
    }
    get signMask() {
        throw 'abstract';
    }
    withX(x) {
        throw 'abstract';
    }
    withY(y) {
        throw 'abstract';
    }
    min(other) {
        throw 'abstract';
    }
    max(other) {
        throw 'abstract';
    }
    sqrt() {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], Float64x2.prototype, "scale", null);
__decorate([
    Abstract
], Float64x2.prototype, "abs", null);
__decorate([
    Abstract
], Float64x2.prototype, "clamp", null);
__decorate([
    AbstractProperty
], Float64x2.prototype, "x", null);
__decorate([
    AbstractProperty
], Float64x2.prototype, "y", null);
__decorate([
    AbstractProperty
], Float64x2.prototype, "signMask", null);
__decorate([
    Abstract
], Float64x2.prototype, "withX", null);
__decorate([
    Abstract
], Float64x2.prototype, "withY", null);
__decorate([
    Abstract
], Float64x2.prototype, "min", null);
__decorate([
    Abstract
], Float64x2.prototype, "max", null);
__decorate([
    Abstract
], Float64x2.prototype, "sqrt", null);
__decorate([
    defaultFactory
], Float64x2, "_Float64x2", null);
__decorate([
    namedFactory
], Float64x2, "_splat", null);
__decorate([
    namedFactory
], Float64x2, "_zero", null);
__decorate([
    namedFactory
], Float64x2, "_fromFloat32x4", null);
Float64x2 = __decorate([
    DartClass
], Float64x2);
export { Float64x2 };
let NativeByteBufferMixin = class NativeByteBufferMixin {
    get lengthInBytes() {
        throw 'native';
    }
    asUint8List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint8List.view(this, offsetInBytes, length);
    }
    asInt8List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt8List.view(this, offsetInBytes, length);
    }
    asUint8ClampedList(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint8ClampedList.view(this, offsetInBytes, length);
    }
    asUint16List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint16List.view(this, offsetInBytes, length);
    }
    asInt16List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt16List.view(this, offsetInBytes, length);
    }
    asUint32List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint32List.view(this, offsetInBytes, length);
    }
    asInt32List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt32List.view(this, offsetInBytes, length);
    }
    asUint64List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        throw new core.UnsupportedError("Uint64List not supported by dart2js.");
    }
    asInt64List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        throw new core.UnsupportedError("Int64List not supported by dart2js.");
    }
    asInt32x4List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        let storage = this.asInt32List(offsetInBytes, length != null ? length * 4 : null);
        return new NativeInt32x4List._externalStorage(storage);
    }
    asFloat32List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeFloat32List.view(this, offsetInBytes, length);
    }
    asFloat64List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeFloat64List.view(this, offsetInBytes, length);
    }
    asFloat32x4List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        let storage = this.asFloat32List(offsetInBytes, length != null ? length * 4 : null);
        return new NativeFloat32x4List._externalStorage(storage);
    }
    asFloat64x2List(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        let storage = this.asFloat64List(offsetInBytes, length != null ? length * 2 : null);
        return new NativeFloat64x2List._externalStorage(storage);
    }
    asByteData(offsetInBytes, length) {
        offsetInBytes = offsetInBytes || 0;
        return new NativeByteData.view(this, offsetInBytes, length);
    }
    get byteLength() {
        throw 'abstract';
    }
    slice(begin, end) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], NativeByteBufferMixin.prototype, "lengthInBytes", null);
__decorate([
    AbstractProperty
], NativeByteBufferMixin.prototype, "byteLength", null);
__decorate([
    Abstract
], NativeByteBufferMixin.prototype, "slice", null);
NativeByteBufferMixin = __decorate([
    DartClass,
    Implements(ByteBuffer),
    AbstractSymbols(Symbol.toStringTag)
], NativeByteBufferMixin);
export { NativeByteBufferMixin };
// Add the mixin to the ArrayBuffer directly
With(NativeByteBufferMixin)(ArrayBuffer);
let NativeByteBuffer = class NativeByteBuffer extends ArrayBuffer {
    constructor(len) {
        super(len);
    }
    get lengthInBytes() {
        throw 'abstract';
    }
    asUint8List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt8List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint8ClampedList(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint16List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt16List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asUint64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asInt32x4List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat32List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat64List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat32x4List(offsetInBytes, length) {
        throw 'abstract';
    }
    asFloat64x2List(offsetInBytes, length) {
        throw 'abstract';
    }
    asByteData(offsetInBytes, length) {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], NativeByteBuffer.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asUint8List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asInt8List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asUint8ClampedList", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asUint16List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asInt16List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asUint32List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asInt32List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asUint64List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asInt64List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asInt32x4List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asFloat32List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asFloat64List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asFloat32x4List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asFloat64x2List", null);
__decorate([
    Abstract
], NativeByteBuffer.prototype, "asByteData", null);
NativeByteBuffer = __decorate([
    DartClass,
    Implements(ByteBuffer)
], NativeByteBuffer);
export { NativeByteBuffer };
let NativeFloat32x4List = NativeFloat32x4List_1 = class NativeFloat32x4List extends Float32x4List {
    constructor(length) {
        super(length);
    }
    NativeFloat32x4List(length) {
        this._storage = new NativeFloat32List.withLength(length * 4);
    }
    _externalStorage(_storage) {
        this._storage = _storage;
    }
    _slowFromList(list) {
        this._storage = new NativeFloat32List.withLength(list.length * 4);
        for (let i = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 1, e.y);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 2, e.z);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 3, e.w);
        }
    }
    static _fromList(list) {
        if (is(list, NativeFloat32x4List_1)) {
            return new NativeFloat32x4List_1._externalStorage(new NativeFloat32List.fromList(list._storage));
        }
        else {
            return new NativeFloat32x4List_1._slowFromList(list);
        }
    }
    get buffer() {
        return this._storage.buffer;
    }
    get lengthInBytes() {
        return this._storage.lengthInBytes;
    }
    get offsetInBytes() {
        return this._storage.offsetInBytes;
    }
    get elementSizeInBytes() {
        return Float32x4List.BYTES_PER_ELEMENT;
    }
    get length() {
        return op(Op.QUOTIENT, this._storage.length, 4);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        let _x = op(Op.INDEX, this._storage, (index * 4) + 0);
        let _y = op(Op.INDEX, this._storage, (index * 4) + 1);
        let _z = op(Op.INDEX, this._storage, (index * 4) + 2);
        let _w = op(Op.INDEX, this._storage, (index * 4) + 3);
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }
    [OperatorMethods.INDEX_EQ](index, value) {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 1, value.y);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 2, value.z);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 3, value.w);
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        return new NativeFloat32x4List_1._externalStorage(this._storage.sublist(start * 4, end * 4));
    }
};
__decorate([
    defaultConstructor
], NativeFloat32x4List.prototype, "NativeFloat32x4List", null);
__decorate([
    namedConstructor
], NativeFloat32x4List.prototype, "_externalStorage", null);
__decorate([
    namedConstructor
], NativeFloat32x4List.prototype, "_slowFromList", null);
__decorate([
    namedFactory
], NativeFloat32x4List, "_fromList", null);
NativeFloat32x4List = NativeFloat32x4List_1 = __decorate([
    DartClass,
    Implements(Float32x4List),
    With(core.DartListMixin, core.DartFixedLengthListMixin)
], NativeFloat32x4List);
export { NativeFloat32x4List };
let NativeInt32x4List = NativeInt32x4List_1 = class NativeInt32x4List extends Int32x4List {
    constructor(length) {
        super(length);
    }
    NativeInt32x4List(length) {
        this._storage = new NativeInt32List(length * 4);
    }
    _externalStorage(storage) {
        this._storage = storage;
    }
    _slowFromList(list) {
        this._storage = new NativeInt32List(list.length * 4);
        for (let i = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 1, e.y);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 2, e.z);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 3, e.w);
        }
    }
    static _fromList(list) {
        if (is(list, NativeInt32x4List_1)) {
            return new NativeInt32x4List_1._externalStorage(new NativeInt32List.fromList(list._storage));
        }
        else {
            return new NativeInt32x4List_1._slowFromList(list);
        }
    }
    get buffer() {
        return this._storage.buffer;
    }
    get lengthInBytes() {
        return this._storage.lengthInBytes;
    }
    get offsetInBytes() {
        return this._storage.offsetInBytes;
    }
    get elementSizeInBytes() {
        return Int32x4List.BYTES_PER_ELEMENT;
    }
    get length() {
        return op(Op.QUOTIENT, this._storage.length, 4);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        let _x = op(Op.INDEX, this._storage, (index * 4) + 0);
        let _y = op(Op.INDEX, this._storage, (index * 4) + 1);
        let _z = op(Op.INDEX, this._storage, (index * 4) + 2);
        let _w = op(Op.INDEX, this._storage, (index * 4) + 3);
        return new NativeInt32x4._truncated(_x, _y, _z, _w);
    }
    [OperatorMethods.INDEX_EQ](index, value) {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 1, value.y);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 2, value.z);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 3, value.w);
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        return new NativeInt32x4List_1._externalStorage(this._storage.sublist(start * 4, end * 4));
    }
};
__decorate([
    defaultConstructor
], NativeInt32x4List.prototype, "NativeInt32x4List", null);
__decorate([
    namedConstructor
], NativeInt32x4List.prototype, "_externalStorage", null);
__decorate([
    namedConstructor
], NativeInt32x4List.prototype, "_slowFromList", null);
__decorate([
    namedFactory
], NativeInt32x4List, "_fromList", null);
NativeInt32x4List = NativeInt32x4List_1 = __decorate([
    DartClass,
    Implements(Int32x4List),
    With(core.DartListMixin, core.DartFixedLengthListMixin)
], NativeInt32x4List);
export { NativeInt32x4List };
let NativeFloat64x2List = NativeFloat64x2List_1 = class NativeFloat64x2List extends core.DartListBase {
    constructor(length) {
        super();
    }
    NativeFloat64x2List(length) {
        this._storage = new NativeFloat64List.withLength(length * 2);
    }
    _externalStorage(_storage) {
        this._storage = _storage;
    }
    _slowFromList(list) {
        this._storage = new NativeFloat64List.withLength(list.length * 2);
        for (let i = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 2) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 2) + 1, e.y);
        }
    }
    static _fromList(list) {
        if (is(list, NativeFloat64x2List_1)) {
            return new NativeFloat64x2List_1._externalStorage(new NativeFloat64List.fromList(list._storage));
        }
        else {
            return new NativeFloat64x2List_1._slowFromList(list);
        }
    }
    get buffer() {
        return this._storage.buffer;
    }
    get lengthInBytes() {
        return this._storage.lengthInBytes;
    }
    get offsetInBytes() {
        return this._storage.offsetInBytes;
    }
    get elementSizeInBytes() {
        return Float64x2List.BYTES_PER_ELEMENT;
    }
    get length() {
        return op(Op.QUOTIENT, this._storage.length, 2);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        let _x = op(Op.INDEX, this._storage, (index * 2) + 0);
        let _y = op(Op.INDEX, this._storage, (index * 2) + 1);
        return new Float64x2(_x, _y);
    }
    [OperatorMethods.INDEX_EQ](index, value) {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 2) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 2) + 1, value.y);
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        return new NativeFloat64x2List_1._externalStorage(this._storage.sublist(start * 2, end * 2));
    }
};
__decorate([
    defaultConstructor
], NativeFloat64x2List.prototype, "NativeFloat64x2List", null);
__decorate([
    namedConstructor
], NativeFloat64x2List.prototype, "_externalStorage", null);
__decorate([
    namedConstructor
], NativeFloat64x2List.prototype, "_slowFromList", null);
__decorate([
    namedFactory
], NativeFloat64x2List, "_fromList", null);
NativeFloat64x2List = NativeFloat64x2List_1 = __decorate([
    DartClass,
    Implements(Float64x2List),
    With(core.DartListMixin, core.DartFixedLengthListMixin)
], NativeFloat64x2List);
export { NativeFloat64x2List };
let NativeTypedData = class NativeTypedData {
    get offsetInBytes() {
        throw 'abstract';
    }
    set offsetInBytes(value) {
        throw 'abstract';
    }
    get elementSizeInBytes() {
        throw 'abstract';
    }
    set elementSizeInBytes(value) {
        throw 'abstract';
    }
    get buffer() {
        throw 'abstract';
    }
    set buffer(buf) {
        throw 'abstract';
    }
    get lengthInBytes() {
        throw 'abstract';
    }
    _invalidPosition(position, length, name) {
        if (is(position, "number")) {
            throw new core.ArgumentError.value(position, name, 'Invalid list position');
        }
        else {
            throw new core.RangeError.range(position, 0, length, name);
        }
    }
    _checkPosition(position, length, name) {
        if ((position >>> 0) !== position /* JS('bool', '(# >>> 0) !== #', position, position) */ || position /* JS('int', '#', position) */ > length) {
            this._invalidPosition(position, length, name);
        }
    }
    get byteLength() {
        throw 'abstract';
    }
    get byteOffset() {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "offsetInBytes", null);
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "elementSizeInBytes", null);
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "buffer", null);
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "lengthInBytes", null);
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "byteLength", null);
__decorate([
    AbstractProperty
], NativeTypedData.prototype, "byteOffset", null);
NativeTypedData = __decorate([
    DartClass,
    Implements(TypedData)
], NativeTypedData);
export { NativeTypedData };
export var _checkLength = (length) => {
    if (is(length, "number"))
        throw new core.ArgumentError(`Invalid length ${length}`);
    return length;
};
export var _checkViewArguments = (buffer, offsetInBytes, length) => {
    if (isNot(buffer, NativeByteBuffer) && isNot(buffer, ArrayBuffer)) {
        throw new core.ArgumentError('Invalid view buffer');
    }
    if (isNot(offsetInBytes, "number")) {
        throw new core.ArgumentError(`Invalid view offsetInBytes ${offsetInBytes}`);
    }
    if (length != null && isNot(length, "number")) {
        throw new core.ArgumentError(`Invalid view length ${length}`);
    }
};
export var _ensureNativeList = (list) => {
    if (is(list, core.JSArray))
        return list;
    let result = new core.DartList(list.length);
    for (let i = 0; i < list.length; i++) {
        result[i] = list[i];
    }
    return result;
};
let NativeByteData = NativeByteData_1 = class NativeByteData extends DataView {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    /*
        @namedFactory
        static empty():NativeByteData {
            return NativeByteData._create1()
        }
    */
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeByteData_1._create2(buffer, offsetInBytes) : NativeByteData_1._create3(buffer, offsetInBytes, length);
    }
    get elementSizeInBytes() {
        return 1;
    }
    getFloat32(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getFloat32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getFloat32(byteOffset: number, littleEndian?: boolean): number
    getFloat64(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getFloat64(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getFloat64(byteOffset: number, littleEndian?: boolean): number
    getInt16(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getInt16(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getInt16(byteOffset: number, littleEndian?: boolean): number
    getInt32(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getInt32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getInt32(byteOffset: number, littleEndian?: boolean): number
    getInt64(byteOffset, endian) {
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Int64 accessor not supported by dart2js.');
    }
    //getInt8(byteOffset: number): number {
    //}
    getUint16(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getUint16(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getUint16(byteOffset: number, littleEndian?: boolean): number
    getUint32(byteOffset, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getUint32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_getUint32(byteOffset: number, littleEndian?: boolean): number
    getUint64(byteOffset, endian) {
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Uint64 accessor not supported by dart2js.');
    }
    //getUint8(byteOffset: number): number
    setFloat32(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setFloat32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void
    setFloat64(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setFloat64(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void
    setInt16(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setInt16(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setInt16(byteOffset: number, value: number, littleEndian?: boolean): void
    setInt32(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setInt32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setInt32(byteOffset: number, value: number, littleEndian?: boolean): void
    setInt64(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Int64 accessor not supported by dart2js.');
    }
    //setInt8(byteOffset: number, value: number): void
    setUint16(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setUint16(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setUint16(byteOffset: number, value: number, littleEndian?: boolean): void
    setUint32(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setUint32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }
    //_setUint32(byteOffset: number, value: number, littleEndian?: boolean): void
    setUint64(byteOffset, value, endian) {
        if (endian === true)
            endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Uint64 accessor not supported by dart2js.');
    }
    //setUint8(byteOffset: number, value: number): void
    static _create1(arg) {
        return new NativeByteData_1(new ByteBuffer(arg)) /* JS('NativeByteData', 'new DataView(new ArrayBuffer(#))', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeByteData_1(arg1, arg2) /* JS('NativeByteData', 'new DataView(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeByteData_1(arg1, arg2, arg3) /* JS('NativeByteData', 'new DataView(#, #, #)', arg1, arg2, arg3) */;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    get buffer() {
        return super.buffer;
    }
    get lengthInBytes() {
        return super.byteLength;
    }
    get offsetInBytes() {
        return super.byteOffset;
    }
};
__decorate([
    Abstract
], NativeByteData.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeByteData.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeByteData.prototype, "offsetInBytes", null);
__decorate([
    namedFactory
], NativeByteData, "_view", null);
NativeByteData = NativeByteData_1 = __decorate([
    DartClass,
    Implements(ByteData),
    With(NativeTypedData)
], NativeByteData);
export { NativeByteData };
let NativeTypedArray = class NativeTypedArray extends NativeTypedData {
    get length() {
        // @ts-ignore
        return super.length /* JS('JSUInt32', '#.length', this) */;
    }
    _setRangeFast(start, end, source, skipCount) {
        let targetLength = this.length;
        this._checkPosition(start, targetLength, "start");
        this._checkPosition(end, targetLength, "end");
        if (start > end)
            throw new core.RangeError.range(start, 0, end);
        let count = end - start;
        if (skipCount < 0)
            throw new core.ArgumentError(skipCount);
        let sourceLength = source.length;
        if (sourceLength - skipCount < count) {
            throw new core.StateError('Not enough elements');
        }
        if (skipCount != 0 || sourceLength != count) {
            source = source.subarray(skipCount, skipCount + count) /* JS('', '#.subarray(#, #)', source, skipCount, skipCount + count) */;
        }
        this.set(source, start) /* JS('void', '#.set(#, #)', this, source, start) */;
    }
};
NativeTypedArray = __decorate([
    DartClass
], NativeTypedArray);
export { NativeTypedArray };
let NativeTypedArrayOfDouble = NativeTypedArrayOfDouble_1 = class NativeTypedArrayOfDouble extends NativeTypedArray {
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('num', '#[#]', this, index) */;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
        _checkValidIndex(index, this, this.length);
        this[index] = value /* JS('void', '#[#] = #', this, index, value) */;
    }
    setRange(start, end, iterable, skipCount) {
        skipCount = skipCount || 0;
        if (is(iterable, NativeTypedArrayOfDouble_1)) {
            this._setRangeFast(start, end, iterable, skipCount);
            return;
        }
        // @ts-ignore
        super.setRange(start, end, iterable, skipCount);
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
};
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "add", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "addAll", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "any", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "asMap", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "clear", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "contains", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "elementAt", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "expand", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "first", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "fold", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "getRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "insert", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "last", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "lastWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "map", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "remove", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "reversed", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "setAll", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfDouble.prototype, "single", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "skip", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "take", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "toList", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "toSet", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "where", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "every", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "forEach", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "indexOf", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "join", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "reduce", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "sort", null);
__decorate([
    Abstract
], NativeTypedArrayOfDouble.prototype, "sublist", null);
NativeTypedArrayOfDouble = NativeTypedArrayOfDouble_1 = __decorate([
    DartClass,
    With(core.DartListMixin),
    AbstractSymbols(Symbol.iterator)
], NativeTypedArrayOfDouble);
export { NativeTypedArrayOfDouble };
let NativeTypedArrayOfInt = NativeTypedArrayOfInt_1 = class NativeTypedArrayOfInt extends NativeTypedArray {
    [OperatorMethods.INDEX_EQ](index, value) {
        _checkValidIndex(index, this, this.length);
        this[index] = value /* JS('void', '#[#] = #', this, index, value) */;
    }
    setRange(start, end, iterable, skipCount) {
        skipCount = skipCount || 0;
        if (is(iterable, NativeTypedArrayOfInt_1)) {
            this._setRangeFast(start, end, iterable, skipCount);
            return;
        }
        // @ts-ignore
        super.setRange(start, end, iterable, skipCount);
    }
    [OperatorMethods.INDEX](index) {
        throw 'abstract';
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    sublist(start, end) {
        return undefined;
    }
};
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "add", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "addAll", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "any", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "asMap", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "clear", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "contains", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "elementAt", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "expand", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "first", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "fold", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "getRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "insert", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "last", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "lastWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "map", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "remove", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "reversed", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "setAll", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeTypedArrayOfInt.prototype, "single", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "skip", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "take", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "toList", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "toSet", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "where", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "every", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "forEach", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "indexOf", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "join", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "reduce", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "sort", null);
__decorate([
    Abstract
], NativeTypedArrayOfInt.prototype, "sublist", null);
NativeTypedArrayOfInt = NativeTypedArrayOfInt_1 = __decorate([
    DartClass,
    Implements(core.DartList),
    With(core.DartListMixin),
    AbstractSymbols(Symbol.iterator, OperatorMethods.INDEX)
], NativeTypedArrayOfInt);
export { NativeTypedArrayOfInt };
let NativeFloat32List = NativeFloat32List_1 = class NativeFloat32List extends Float32Array {
    constructor(buffer, byteOffset, length) {
        // @ts-ignore
        super(...arguments);
    }
    static _withLength(len) {
        return NativeFloat32List_1._create1(len);
    }
    static _fromList(elements) {
        return NativeFloat32List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeFloat32List_1._create2(buffer, offsetInBytes) : NativeFloat32List_1._create3(buffer, offsetInBytes, length);
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeFloat32List', '#.subarray(#, #)', this, start, end) */;
        return NativeFloat32List_1._create1(source);
    }
    static _create1(lenOrSource) {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeFloat32List_1(buf, 0, lenOrSource);
        }
        else {
            return new NativeFloat32List_1(lenOrSource) /* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }
    static _create2(arg1, arg2) {
        return new NativeFloat32List_1(arg1, arg2) /* JS('NativeFloat32List', 'new Float32Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeFloat32List_1(arg1, arg2, arg3) /* JS('NativeFloat32List', 'new Float32Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
    get elementSizeInBytes() {
        return 0;
    }
    get lengthInBytes() {
        return 0;
    }
    get offsetInBytes() {
        return 0;
    }
};
__decorate([
    Abstract
], NativeFloat32List.prototype, "add", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "any", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "clear", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "contains", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "elementAt", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "expand", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeFloat32List.prototype, "first", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "fold", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "insert", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "insertAll", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "isEmpty", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "iterator", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "last", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "lastWhere", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "map", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "remove", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeFloat32List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeFloat32List.prototype, "single", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "skip", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "take", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "toList", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "where", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "every", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "forEach", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "indexOf", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "join", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "reduce", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "sort", null);
__decorate([
    AbstractProperty
], NativeFloat32List.prototype, "length", null);
__decorate([
    Abstract
], NativeFloat32List.prototype, "setRange", null);
__decorate([
    namedFactory
], NativeFloat32List, "_withLength", null);
__decorate([
    namedFactory
], NativeFloat32List, "_fromList", null);
__decorate([
    namedFactory
], NativeFloat32List, "_view", null);
NativeFloat32List = NativeFloat32List_1 = __decorate([
    DartClass,
    Implements(Float32List),
    With(NativeTypedArrayOfDouble)
], NativeFloat32List);
export { NativeFloat32List };
let NativeFloat64List = NativeFloat64List_1 = class NativeFloat64List extends Float64Array {
    constructor(buffer, byteOffset, length) {
        // @ts-ignore
        super(...arguments);
    }
    static _withLength(len) {
        return NativeFloat64List_1._create1(len);
    }
    static _fromList(elements) {
        return NativeFloat64List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeFloat64List_1._create2(buffer, offsetInBytes) : NativeFloat64List_1._create3(buffer, offsetInBytes, length);
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeFloat64List', '#.subarray(#, #)', this, start, end) */;
        return NativeFloat64List_1._create1(source);
    }
    static _create1(lenOrSource) {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeFloat64List_1(buf, 0, lenOrSource);
        }
        else {
            return new NativeFloat64List_1(lenOrSource) /* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }
    static _create2(arg1, arg2) {
        return new NativeFloat64List_1(arg1, arg2) /* JS('NativeFloat64List', 'new Float64Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeFloat64List_1(arg1, arg2, arg3) /* JS('NativeFloat64List', 'new Float64Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX](index) {
        return undefined;
    }
    [OperatorMethods.INDEX_EQ](index, value) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    get length() {
        return undefined;
    }
    setRange(start, end, iterable, skipCount) {
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
    get elementSizeInBytes() {
        return 0;
    }
    get lengthInBytes() {
        return 0;
    }
    get offsetInBytes() {
        return 0;
    }
};
__decorate([
    Abstract
], NativeFloat64List.prototype, "add", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "any", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "clear", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "contains", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "elementAt", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "expand", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeFloat64List.prototype, "first", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "fold", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "insert", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "insertAll", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "isEmpty", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "isNotEmpty", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "iterator", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "last", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "lastWhere", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "map", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "remove", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeFloat64List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeFloat64List.prototype, "single", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "skip", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "take", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "toList", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "where", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "every", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "forEach", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "indexOf", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "join", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "reduce", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "sort", null);
__decorate([
    AbstractProperty
], NativeFloat64List.prototype, "length", null);
__decorate([
    Abstract
], NativeFloat64List.prototype, "setRange", null);
__decorate([
    namedFactory
], NativeFloat64List, "_withLength", null);
__decorate([
    namedFactory
], NativeFloat64List, "_fromList", null);
__decorate([
    namedFactory
], NativeFloat64List, "_view", null);
NativeFloat64List = NativeFloat64List_1 = __decorate([
    DartClass,
    Implements(Float64List),
    With(NativeTypedArrayOfDouble)
], NativeFloat64List);
export { NativeFloat64List };
let NativeInt16List = NativeInt16List_1 = class NativeInt16List extends Int16Array {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    static _fromList(elements) {
        return NativeInt16List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt16List_1._create2(buffer, offsetInBytes) : NativeInt16List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('int', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeInt16List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt16List_1._create1(source);
    }
    static _create1(arg) {
        return new NativeInt16List_1(arg) /* JS('NativeInt16List', 'new Int16Array(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeInt16List_1(arg1, arg2) /* JS('NativeInt16List', 'new Int16Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeInt16List_1(arg1, arg2, arg3) /* JS('NativeInt16List', 'new Int16Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](index, val) {
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    map(f, thisArg) {
        return undefined;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    [Symbol.iterator]() {
        return undefined;
    }
    every(f) {
        return false;
    }
    forEach(f) {
    }
    indexOf(element, start) {
        return undefined;
    }
    join(separator) {
        return "";
    }
    lastIndexOf(element, start) {
        return undefined;
    }
    reduce(combine) {
        return undefined;
    }
    sort(compare) {
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
    get buffer() {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    get offsetInBytes() {
        return 0;
    }
    setRange(start, end, iterable, skipCount) {
    }
};
__decorate([
    Abstract
], NativeInt16List.prototype, "add", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "any", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "clear", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "contains", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "elementAt", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "expand", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "first", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "fold", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "insert", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "last", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "lastWhere", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "map", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "remove", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeInt16List.prototype, "single", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "skip", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "take", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "toList", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "where", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "every", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "forEach", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "indexOf", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "join", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "lastIndexOf", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "reduce", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "sort", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "_setRangeFast", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeInt16List.prototype, "setRange", null);
__decorate([
    namedFactory
], NativeInt16List, "_fromList", null);
__decorate([
    namedFactory
], NativeInt16List, "_view", null);
NativeInt16List = NativeInt16List_1 = __decorate([
    DartClass,
    Implements(Int16List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeInt16List);
export { NativeInt16List };
let NativeInt32List = NativeInt32List_1 = class NativeInt32List extends Int32Array {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    /*
    @defaultFactory
    static _NativeInt32List(length: number): NativeInt32List {
        return NativeInt32List._create1(_checkLength(length));
    }*/
    static _fromList(elements) {
        return NativeInt32List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt32List_1._create2(buffer, offsetInBytes) : NativeInt32List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('int', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeInt32List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt32List_1._create1(source);
    }
    static _create1(arg) {
        return new NativeInt32List_1(arg) /* JS('NativeInt32List', 'new Int32Array(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeInt32List_1(arg1, arg2) /* JS('NativeInt32List', 'new Int32Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeInt32List_1(arg1, arg2, arg3) /* JS('NativeInt32List', 'new Int32Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeInt32List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "add", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "any", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "clear", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "contains", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "expand", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "first", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "fold", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "insert", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "last", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "remove", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "setRange", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeInt32List.prototype, "single", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "skip", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "take", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "toList", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "where", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeInt32List.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeInt32List, "_fromList", null);
__decorate([
    namedFactory
], NativeInt32List, "_view", null);
NativeInt32List = NativeInt32List_1 = __decorate([
    DartClass,
    Implements(Int32List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeInt32List);
export { NativeInt32List };
let NativeInt8List = NativeInt8List_1 = class NativeInt8List extends Int8Array {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    static _fromList(elements) {
        return NativeInt8List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt8List_1._create2(buffer, offsetInBytes) : NativeInt8List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('int', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeInt8List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt8List_1._create1(source);
    }
    static _create1(arg) {
        return new NativeInt8List_1(arg) /* JS('NativeInt8List', 'new Int8Array(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeInt8List_1(arg1, arg2) /* JS('NativeInt8List', 'new Int8Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeInt8List_1(arg1, arg2, arg3) /* JS('NativeInt8List', 'new Int8Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeInt8List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "add", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "any", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "clear", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "contains", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "expand", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "first", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "fold", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "insert", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "last", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "remove", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "setRange", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeInt8List.prototype, "single", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "skip", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "take", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "toList", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "where", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeInt8List.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeInt8List, "_fromList", null);
__decorate([
    namedFactory
], NativeInt8List, "_view", null);
NativeInt8List = NativeInt8List_1 = __decorate([
    DartClass,
    Implements(Int8List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeInt8List);
export { NativeInt8List };
let NativeUint16List = NativeUint16List_1 = class NativeUint16List extends Uint16Array {
    constructor(buffer, byteOffset, length) {
        // @ts-ignore
        super(...arguments);
    }
    static _withLength(len) {
        return NativeUint16List_1._create1(len);
    }
    static _fromList(list) {
        return NativeUint16List_1._create1(_ensureNativeList(list));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint16List_1._create2(buffer, offsetInBytes) : NativeUint16List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('JSUInt31', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeUint16List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint16List_1._create1(source);
    }
    static _create1(lenOrSource) {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeUint16List_1(buf, 0, lenOrSource);
        }
        else {
            return new NativeUint16List_1(lenOrSource) /* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }
    static _create2(arg1, arg2) {
        return new NativeUint16List_1(arg1, arg2) /* JS('NativeUint16List', 'new Uint16Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeUint16List_1(arg1, arg2, arg3) /* JS('NativeUint16List', 'new Uint16Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeUint16List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "add", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "any", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "clear", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "contains", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "expand", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "first", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "fold", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "insert", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "last", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "remove", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "setRange", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeUint16List.prototype, "single", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "skip", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "take", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "toList", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "where", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeUint16List.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeUint16List, "_withLength", null);
__decorate([
    namedFactory
], NativeUint16List, "_fromList", null);
__decorate([
    namedFactory
], NativeUint16List, "_view", null);
NativeUint16List = NativeUint16List_1 = __decorate([
    DartClass,
    Implements(Uint16List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeUint16List);
export { NativeUint16List };
let NativeUint32List = NativeUint32List_1 = class NativeUint32List extends Uint32Array {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    static _fromList(elements) {
        return NativeUint32List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint32List_1._create2(buffer, offsetInBytes) : NativeUint32List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('JSUInt32', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeUint32List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint32List_1._create1(source);
    }
    static _create1(arg) {
        return new NativeUint32List_1(arg) /* JS('NativeUint32List', 'new Uint32Array(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeUint32List_1(arg1, arg2) /* JS('NativeUint32List', 'new Uint32Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeUint32List_1(arg1, arg2, arg3) /* JS('NativeUint32List', 'new Uint32Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeUint32List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "add", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "any", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "clear", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "contains", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "expand", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "first", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "fold", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "insert", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "last", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "remove", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "setRange", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeUint32List.prototype, "single", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "skip", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "take", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "toList", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "where", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeUint32List.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeUint32List, "_fromList", null);
__decorate([
    namedFactory
], NativeUint32List, "_view", null);
NativeUint32List = NativeUint32List_1 = __decorate([
    DartClass,
    Implements(Uint32List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeUint32List);
export { NativeUint32List };
let NativeUint8ClampedList = NativeUint8ClampedList_1 = class NativeUint8ClampedList extends Uint8ClampedArray {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    static _fromList(elements) {
        return NativeUint8ClampedList_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint8ClampedList_1._create2(buffer, offsetInBytes) : NativeUint8ClampedList_1._create3(buffer, offsetInBytes, length);
    }
    get length() {
        return this.length /* JS('JSUInt32', '#.length', this) */;
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('JSUInt31', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeUint8ClampedList', '#.subarray(#, #)', this, start, end) */;
        return NativeUint8ClampedList_1._create1(source);
    }
    static _create1(arg) {
        return new NativeUint8ClampedList_1(arg) /* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeUint8ClampedList_1(arg1, arg2) /* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeUint8ClampedList_1(arg1, arg2, arg3) /* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "buffer", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "add", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "addAll", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "any", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "asMap", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "clear", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "contains", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "expand", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "first", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "fold", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "getRange", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "insert", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "last", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "remove", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "reversed", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "setAll", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "setRange", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeUint8ClampedList.prototype, "single", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "skip", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "take", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "toList", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "toSet", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "where", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeUint8ClampedList.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeUint8ClampedList, "_fromList", null);
__decorate([
    namedFactory
], NativeUint8ClampedList, "_view", null);
NativeUint8ClampedList = NativeUint8ClampedList_1 = __decorate([
    DartClass,
    Implements(Uint8ClampedList),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeUint8ClampedList);
export { NativeUint8ClampedList };
let NativeUint8List = NativeUint8List_1 = class NativeUint8List extends Uint8Array {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    static _fromList(elements) {
        return NativeUint8List_1._create1(_ensureNativeList(elements));
    }
    static _view(buffer, offsetInBytes, length) {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint8List_1._create2(buffer, offsetInBytes) : NativeUint8List_1._create3(buffer, offsetInBytes, length);
    }
    [OperatorMethods.INDEX](index) {
        _checkValidIndex(index, this, this.length);
        return this[index] /* JS('JSUInt31', '#[#]', this, index) */;
    }
    sublist(start, end) {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end) /* JS('NativeUint8List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint8List_1._create1(source);
    }
    static _create1(arg) {
        return new NativeUint8List_1(arg) /* JS('NativeUint8List', 'new Uint8Array(#)', arg) */;
    }
    static _create2(arg1, arg2) {
        return new NativeUint8List_1(arg1, arg2) /* JS('NativeUint8List', 'new Uint8Array(#, #)', arg1, arg2) */;
    }
    static _create3(arg1, arg2, arg3) {
        return new NativeUint8List_1(arg1, arg2, arg3) /* JS('NativeUint8List', 'new Uint8Array(#, #, #)', arg1, arg2, arg3) */;
    }
    [OperatorMethods.INDEX_EQ](number, value) {
    }
    get buffer() {
        return super.buffer;
    }
    add(element) {
    }
    addAll(iterable) {
    }
    any(test) {
        return undefined;
    }
    asMap() {
        return undefined;
    }
    clear() {
    }
    contains(element) {
        return undefined;
    }
    elementAt(index) {
        return undefined;
    }
    get elementSizeInBytes() {
        return 0;
    }
    expand(f) {
        return undefined;
    }
    fillRange(start, end, fill) {
    }
    get first() {
        return undefined;
    }
    firstWhere(test, _) {
        return undefined;
    }
    fold(initialValue, combine) {
        return undefined;
    }
    getRange(start, end) {
        return undefined;
    }
    insert(index, element) {
    }
    insertAll(index, iterable) {
    }
    get isEmpty() {
        return undefined;
    }
    get isNotEmpty() {
        return undefined;
    }
    get iterator() {
        return undefined;
    }
    get last() {
        return undefined;
    }
    lastWhere(test, _) {
        return undefined;
    }
    get lengthInBytes() {
        return 0;
    }
    map(f, thisArg) {
        return undefined;
    }
    get offsetInBytes() {
        return 0;
    }
    remove(element) {
        return undefined;
    }
    removeAt(index) {
        return undefined;
    }
    removeLast() {
        return undefined;
    }
    removeRange(start, end) {
    }
    removeWhere(test) {
    }
    replaceRange(start, end, newContents) {
    }
    retainWhere(test) {
    }
    get reversed() {
        return undefined;
    }
    setAll(index, iterable) {
    }
    setRange(start, end, iterable, skipCount) {
    }
    shuffle(random) {
    }
    get single() {
        return undefined;
    }
    singleWhere(test) {
        return undefined;
    }
    skip(count) {
        return undefined;
    }
    skipWhile(test) {
        return undefined;
    }
    take(count) {
        return undefined;
    }
    takeWhile(test) {
        return undefined;
    }
    toList(_) {
        return undefined;
    }
    toSet() {
        return undefined;
    }
    where(test) {
        return undefined;
    }
    _checkPosition(position, length, name) {
    }
    _invalidPosition(position, length, name) {
    }
    _setRangeFast(start, end, source, skipCount) {
    }
};
__decorate([
    Abstract
], NativeUint8List.prototype, "buffer", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "add", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "addAll", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "any", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "asMap", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "clear", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "contains", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "elementAt", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "elementSizeInBytes", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "expand", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "fillRange", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "first", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "firstWhere", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "fold", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "getRange", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "insert", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "insertAll", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "isEmpty", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "isNotEmpty", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "iterator", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "last", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "lastWhere", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "lengthInBytes", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "map", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "offsetInBytes", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "remove", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "removeAt", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "removeLast", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "removeRange", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "removeWhere", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "replaceRange", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "retainWhere", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "reversed", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "setAll", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "setRange", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "shuffle", null);
__decorate([
    AbstractProperty
], NativeUint8List.prototype, "single", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "singleWhere", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "skip", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "skipWhile", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "take", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "takeWhile", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "toList", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "toSet", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "where", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "_checkPosition", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "_invalidPosition", null);
__decorate([
    Abstract
], NativeUint8List.prototype, "_setRangeFast", null);
__decorate([
    namedFactory
], NativeUint8List, "_fromList", null);
__decorate([
    namedFactory
], NativeUint8List, "_view", null);
NativeUint8List = NativeUint8List_1 = __decorate([
    DartClass,
    Implements(Uint8List),
    With(NativeTypedArrayOfInt),
    AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
], NativeUint8List);
export { NativeUint8List };
let NativeFloat32x4 = NativeFloat32x4_1 = class NativeFloat32x4 {
    constructor(x, y, z, w) {
    }
    static _truncate(x) {
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 0, x);
        return op(Op.INDEX, NativeFloat32x4_1._list, 0);
    }
    NativeFloat32x4(x, y, z, w) {
        this.x = NativeFloat32x4_1._truncate(x);
        this.y = NativeFloat32x4_1._truncate(y);
        this.z = NativeFloat32x4_1._truncate(z);
        this.w = NativeFloat32x4_1._truncate(w);
        if (isNot(x, "number"))
            throw new core.ArgumentError(x);
        if (isNot(y, "number"))
            throw new core.ArgumentError(y);
        if (isNot(z, "number"))
            throw new core.ArgumentError(z);
        if (isNot(w, "number"))
            throw new core.ArgumentError(w);
    }
    splat(v) {
        this.NativeFloat32x4(v, v, v, v);
    }
    zero() {
        this._truncated(0.0, 0.0, 0.0, 0.0);
    }
    static _fromInt32x4Bits(i) {
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._uint32view, 0, i.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._uint32view, 1, i.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._uint32view, 2, i.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._uint32view, 3, i.w);
        return new NativeFloat32x4_1._truncated(op(Op.INDEX, NativeFloat32x4_1._list, 0), op(Op.INDEX, NativeFloat32x4_1._list, 1), op(Op.INDEX, NativeFloat32x4_1._list, 2), op(Op.INDEX, NativeFloat32x4_1._list, 3));
    }
    fromFloat64x2(v) {
        this._truncated(NativeFloat32x4_1._truncate(v.x), NativeFloat32x4_1._truncate(v.y), 0.0, 0.0);
    }
    _doubles(x, y, z, w) {
        this.x = NativeFloat32x4_1._truncate(x);
        this.y = NativeFloat32x4_1._truncate(y);
        this.z = NativeFloat32x4_1._truncate(z);
        this.w = NativeFloat32x4_1._truncate(w);
    }
    _truncated(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
    [OperatorMethods.PLUS](other) {
        let _x = this.x + other.x;
        let _y = this.y + other.y;
        let _z = this.z + other.z;
        let _w = this.w + other.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    [OperatorMethods.NEGATE]() {
        return new NativeFloat32x4_1._truncated(-this.x, -this.y, -this.z, -this.w);
    }
    [OperatorMethods.MINUS](other) {
        let _x = this.x - other.x;
        let _y = this.y - other.y;
        let _z = this.z - other.z;
        let _w = this.w - other.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    [OperatorMethods.MULTIPLY](other) {
        let _x = this.x * other.x;
        let _y = this.y * other.y;
        let _z = this.z * other.z;
        let _w = this.w * other.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    [OperatorMethods.DIVIDE](other) {
        let _x = this.x / other.x;
        let _y = this.y / other.y;
        let _z = this.z / other.z;
        let _w = this.w / other.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    lessThan(other) {
        let _cx = this.x < other.x;
        let _cy = this.y < other.y;
        let _cz = this.z < other.z;
        let _cw = this.w < other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    lessThanOrEqual(other) {
        let _cx = this.x <= other.x;
        let _cy = this.y <= other.y;
        let _cz = this.z <= other.z;
        let _cw = this.w <= other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    greaterThan(other) {
        let _cx = this.x > other.x;
        let _cy = this.y > other.y;
        let _cz = this.z > other.z;
        let _cw = this.w > other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    greaterThanOrEqual(other) {
        let _cx = this.x >= other.x;
        let _cy = this.y >= other.y;
        let _cz = this.z >= other.z;
        let _cw = this.w >= other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    equal(other) {
        let _cx = this.x == other.x;
        let _cy = this.y == other.y;
        let _cz = this.z == other.z;
        let _cw = this.w == other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    notEqual(other) {
        let _cx = this.x != other.x;
        let _cy = this.y != other.y;
        let _cz = this.z != other.z;
        let _cw = this.w != other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }
    scale(s) {
        let _x = s * this.x;
        let _y = s * this.y;
        let _z = s * this.z;
        let _w = s * this.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    abs() {
        let _x = new core.DartDouble(this.x).abs();
        let _y = new core.DartDouble(this.y).abs();
        let _z = new core.DartDouble(this.z).abs();
        let _w = new core.DartDouble(this.w).abs();
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    clamp(lowerLimit, upperLimit) {
        let _lx = lowerLimit.x;
        let _ly = lowerLimit.y;
        let _lz = lowerLimit.z;
        let _lw = lowerLimit.w;
        let _ux = upperLimit.x;
        let _uy = upperLimit.y;
        let _uz = upperLimit.z;
        let _uw = upperLimit.w;
        let _x = this.x;
        let _y = this.y;
        let _z = this.z;
        let _w = this.w;
        _x = _x > _ux ? _ux : _x;
        _y = _y > _uy ? _uy : _y;
        _z = _z > _uz ? _uz : _z;
        _w = _w > _uw ? _uw : _w;
        _x = _x < _lx ? _lx : _x;
        _y = _y < _ly ? _ly : _y;
        _z = _z < _lz ? _lz : _z;
        _w = _w < _lw ? _lw : _w;
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    get signMask() {
        let view = NativeFloat32x4_1._uint32view;
        let mx, my, mz, mw;
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 3, this.w);
        mx = (op(Op.INDEX, view, 0) & 2147483648) >> 31;
        my = (op(Op.INDEX, view, 1) & 2147483648) >> 30;
        mz = (op(Op.INDEX, view, 2) & 2147483648) >> 29;
        mw = (op(Op.INDEX, view, 3) & 2147483648) >> 28;
        return mx | my | mz | mw;
    }
    shuffle(mask) {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 3, this.w);
        let _x = op(Op.INDEX, NativeFloat32x4_1._list, mask & 3);
        let _y = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 2) & 3);
        let _z = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 4) & 3);
        let _w = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 6) & 3);
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    shuffleMix(other, mask) {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 3, this.w);
        let _x = op(Op.INDEX, NativeFloat32x4_1._list, mask & 3);
        let _y = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 2) & 3);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 0, other.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 1, other.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 2, other.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4_1._list, 3, other.w);
        let _z = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 4) & 3);
        let _w = op(Op.INDEX, NativeFloat32x4_1._list, (mask >> 6) & 3);
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    withX(newX) {
        return new NativeFloat32x4_1._truncated(NativeFloat32x4_1._truncate(newX), this.y, this.z, this.w);
    }
    withY(newY) {
        return new NativeFloat32x4_1._truncated(this.x, NativeFloat32x4_1._truncate(newY), this.z, this.w);
    }
    withZ(newZ) {
        return new NativeFloat32x4_1._truncated(this.x, this.y, NativeFloat32x4_1._truncate(newZ), this.w);
    }
    withW(newW) {
        return new NativeFloat32x4_1._truncated(this.x, this.y, this.z, NativeFloat32x4_1._truncate(newW));
    }
    min(other) {
        let _x = this.x < other.x ? this.x : other.x;
        let _y = this.y < other.y ? this.y : other.y;
        let _z = this.z < other.z ? this.z : other.z;
        let _w = this.w < other.w ? this.w : other.w;
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    max(other) {
        let _x = this.x > other.x ? this.x : other.x;
        let _y = this.y > other.y ? this.y : other.y;
        let _z = this.z > other.z ? this.z : other.z;
        let _w = this.w > other.w ? this.w : other.w;
        return new NativeFloat32x4_1._truncated(_x, _y, _z, _w);
    }
    sqrt() {
        let _x = math.sqrt(this.x);
        let _y = math.sqrt(this.y);
        let _z = math.sqrt(this.z);
        let _w = math.sqrt(this.w);
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    reciprocal() {
        let _x = 1.0 / this.x;
        let _y = 1.0 / this.y;
        let _z = 1.0 / this.z;
        let _w = 1.0 / this.w;
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
    reciprocalSqrt() {
        let _x = math.sqrt(1.0 / this.x);
        let _y = math.sqrt(1.0 / this.y);
        let _z = math.sqrt(1.0 / this.z);
        let _w = math.sqrt(1.0 / this.w);
        return new NativeFloat32x4_1._doubles(_x, _y, _z, _w);
    }
};
NativeFloat32x4._list = new NativeFloat32List.withLength(4);
NativeFloat32x4._uint32view = NativeFloat32x4_1._list.buffer.asUint32List();
__decorate([
    defaultConstructor
], NativeFloat32x4.prototype, "NativeFloat32x4", null);
__decorate([
    namedConstructor
], NativeFloat32x4.prototype, "splat", null);
__decorate([
    namedConstructor
], NativeFloat32x4.prototype, "zero", null);
__decorate([
    namedConstructor
], NativeFloat32x4.prototype, "fromFloat64x2", null);
__decorate([
    namedConstructor
], NativeFloat32x4.prototype, "_doubles", null);
__decorate([
    namedConstructor
], NativeFloat32x4.prototype, "_truncated", null);
__decorate([
    namedFactory
], NativeFloat32x4, "_fromInt32x4Bits", null);
NativeFloat32x4 = NativeFloat32x4_1 = __decorate([
    DartClass,
    Implements(Float32x4)
], NativeFloat32x4);
export { NativeFloat32x4 };
let NativeInt32x4 = NativeInt32x4_1 = class NativeInt32x4 {
    constructor(x, y, z, w) {
    }
    static _truncate(x) {
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 0, x);
        return op(Op.INDEX, NativeInt32x4_1._list, 0);
    }
    NativeInt32x4(x, y, z, w) {
        this.x = NativeInt32x4_1._truncate(x);
        this.y = NativeInt32x4_1._truncate(y);
        this.z = NativeInt32x4_1._truncate(z);
        this.w = NativeInt32x4_1._truncate(w);
        if (x != this.x && is(x, "number"))
            throw new core.ArgumentError(x);
        if (y != this.y && is(y, "number"))
            throw new core.ArgumentError(y);
        if (z != this.z && is(z, "number"))
            throw new core.ArgumentError(z);
        if (w != this.w && is(w, "number"))
            throw new core.ArgumentError(w);
    }
    bool(x, y, z, w) {
        this.x = x ? -1 : 0;
        this.y = y ? -1 : 0;
        this.z = z ? -1 : 0;
        this.w = w ? -1 : 0;
    }
    static _fromFloat32x4Bits(f) {
        let floatList = NativeFloat32x4._list;
        op(Op.INDEX_ASSIGN, floatList, 0, f.x);
        op(Op.INDEX_ASSIGN, floatList, 1, f.y);
        op(Op.INDEX_ASSIGN, floatList, 2, f.z);
        op(Op.INDEX_ASSIGN, floatList, 3, f.w);
        let view = floatList.buffer.asInt32List();
        return new NativeInt32x4_1._truncated(op(Op.INDEX, view, 0), op(Op.INDEX, view, 1), op(Op.INDEX, view, 2), op(Op.INDEX, view, 3));
    }
    _truncated(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
    [OperatorMethods.BINARY_OR](other) {
        return new NativeInt32x4_1._truncated(this.x | other.x /* JS("int", "# | #", x, other.x) */, this.y | other.y /* JS("int", "# | #", y, other.y) */, this.z | other.z /* JS("int", "# | #", z, other.z) */, this.w | other.w /* JS("int", "# | #", w, other.w) */);
    }
    [OperatorMethods.BINARY_AND](other) {
        return new NativeInt32x4_1._truncated(this.x & other.x /* JS("int", "# & #", x, other.x) */, this.y & other.y /* JS("int", "# & #", y, other.y) */, this.z & other.z /* JS("int", "# & #", z, other.z) */, this.w & other.w /* JS("int", "# & #", w, other.w) */);
    }
    [OperatorMethods.XOR](other) {
        return new NativeInt32x4_1._truncated(this.x ^ other.x /* JS("int", "# ^ #", x, other.x) */, this.y ^ other.y /* JS("int", "# ^ #", y, other.y) */, this.z ^ other.z /* JS("int", "# ^ #", z, other.z) */, this.w ^ other.w /* JS("int", "# ^ #", w, other.w) */);
    }
    [OperatorMethods.PLUS](other) {
        return new NativeInt32x4_1._truncated((this.x + other.x) | 0 /* JS("int", "(# + #) | 0", x, other.x) */, (this.y + other.y) | 0 /* JS("int", "(# + #) | 0", y, other.y) */, (this.z + other.z) | 0 /* JS("int", "(# + #) | 0", z, other.z) */, (this.w + other.w) | 0 /* JS("int", "(# + #) | 0", w, other.w) */);
    }
    [OperatorMethods.MINUS](other) {
        return new NativeInt32x4_1._truncated((this.x - other.x) | 0 /* JS("int", "(# - #) | 0", x, other.x) */, (this.y - other.y) | 0 /* JS("int", "(# - #) | 0", y, other.y) */, (this.z - other.z) | 0 /* JS("int", "(# - #) | 0", z, other.z) */, (this.w - other.w) | 0 /* JS("int", "(# - #) | 0", w, other.w) */);
    }
    [OperatorMethods.NEGATE]() {
        return new NativeInt32x4_1._truncated((-this.x) | 0 /* JS("int", "(-#) | 0", x) */, (-this.y) | 0 /* JS("int", "(-#) | 0", y) */, (-this.z) | 0 /* JS("int", "(-#) | 0", z) */, (-this.w) | 0 /* JS("int", "(-#) | 0", w) */);
    }
    get signMask() {
        let mx = (this.x & 2147483648) >> 31;
        let my = (this.y & 2147483648) >> 31;
        let mz = (this.z & 2147483648) >> 31;
        let mw = (this.w & 2147483648) >> 31;
        return mx | my << 1 | mz << 2 | mw << 3;
    }
    shuffle(mask) {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 3, this.w);
        let _x = op(Op.INDEX, NativeInt32x4_1._list, mask & 3);
        let _y = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 2) & 3);
        let _z = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 4) & 3);
        let _w = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 6) & 3);
        return new NativeInt32x4_1._truncated(_x, _y, _z, _w);
    }
    shuffleMix(other, mask) {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 3, this.w);
        let _x = op(Op.INDEX, NativeInt32x4_1._list, mask & 3);
        let _y = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 2) & 3);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 0, other.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 1, other.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 2, other.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4_1._list, 3, other.w);
        let _z = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 4) & 3);
        let _w = op(Op.INDEX, NativeInt32x4_1._list, (mask >> 6) & 3);
        return new NativeInt32x4_1._truncated(_x, _y, _z, _w);
    }
    withX(x) {
        let _x = NativeInt32x4_1._truncate(x);
        return new NativeInt32x4_1._truncated(_x, this.y, this.z, this.w);
    }
    withY(y) {
        let _y = NativeInt32x4_1._truncate(y);
        return new NativeInt32x4_1._truncated(this.x, _y, this.z, this.w);
    }
    withZ(z) {
        let _z = NativeInt32x4_1._truncate(z);
        return new NativeInt32x4_1._truncated(this.x, this.y, _z, this.w);
    }
    withW(w) {
        let _w = NativeInt32x4_1._truncate(w);
        return new NativeInt32x4_1._truncated(this.x, this.y, this.z, _w);
    }
    get flagX() {
        return this.x != 0;
    }
    get flagY() {
        return this.y != 0;
    }
    get flagZ() {
        return this.z != 0;
    }
    get flagW() {
        return this.w != 0;
    }
    withFlagX(flagX) {
        let _x = flagX ? -1 : 0;
        return new NativeInt32x4_1._truncated(_x, this.y, this.z, this.w);
    }
    withFlagY(flagY) {
        let _y = flagY ? -1 : 0;
        return new NativeInt32x4_1._truncated(this.x, _y, this.z, this.w);
    }
    withFlagZ(flagZ) {
        let _z = flagZ ? -1 : 0;
        return new NativeInt32x4_1._truncated(this.x, this.y, _z, this.w);
    }
    withFlagW(flagW) {
        let _w = flagW ? -1 : 0;
        return new NativeInt32x4_1._truncated(this.x, this.y, this.z, _w);
    }
    select(trueValue, falseValue) {
        let floatList = NativeFloat32x4._list;
        let intView = NativeFloat32x4._uint32view;
        op(Op.INDEX_ASSIGN, floatList, 0, trueValue.x);
        op(Op.INDEX_ASSIGN, floatList, 1, trueValue.y);
        op(Op.INDEX_ASSIGN, floatList, 2, trueValue.z);
        op(Op.INDEX_ASSIGN, floatList, 3, trueValue.w);
        let stx = op(Op.INDEX, intView, 0);
        let sty = op(Op.INDEX, intView, 1);
        let stz = op(Op.INDEX, intView, 2);
        let stw = op(Op.INDEX, intView, 3);
        op(Op.INDEX_ASSIGN, floatList, 0, falseValue.x);
        op(Op.INDEX_ASSIGN, floatList, 1, falseValue.y);
        op(Op.INDEX_ASSIGN, floatList, 2, falseValue.z);
        op(Op.INDEX_ASSIGN, floatList, 3, falseValue.w);
        let sfx = op(Op.INDEX, intView, 0);
        let sfy = op(Op.INDEX, intView, 1);
        let sfz = op(Op.INDEX, intView, 2);
        let sfw = op(Op.INDEX, intView, 3);
        let _x = (this.x & stx) | (~this.x & sfx);
        let _y = (this.y & sty) | (~this.y & sfy);
        let _z = (this.z & stz) | (~this.z & sfz);
        let _w = (this.w & stw) | (~this.w & sfw);
        op(Op.INDEX_ASSIGN, intView, 0, _x);
        op(Op.INDEX_ASSIGN, intView, 1, _y);
        op(Op.INDEX_ASSIGN, intView, 2, _z);
        op(Op.INDEX_ASSIGN, intView, 3, _w);
        return new NativeFloat32x4._truncated(op(Op.INDEX, floatList, 0), op(Op.INDEX, floatList, 1), op(Op.INDEX, floatList, 2), op(Op.INDEX, floatList, 3));
    }
};
NativeInt32x4._list = new NativeInt32List(4);
__decorate([
    defaultConstructor
], NativeInt32x4.prototype, "NativeInt32x4", null);
__decorate([
    namedConstructor
], NativeInt32x4.prototype, "bool", null);
__decorate([
    namedConstructor
], NativeInt32x4.prototype, "_truncated", null);
__decorate([
    namedFactory
], NativeInt32x4, "_fromFloat32x4Bits", null);
NativeInt32x4 = NativeInt32x4_1 = __decorate([
    DartClass,
    Implements(Int32x4)
], NativeInt32x4);
export { NativeInt32x4 };
let NativeFloat64x2 = NativeFloat64x2_1 = class NativeFloat64x2 {
    constructor(x, y) {
    }
    NativeFloat64x2(x, y) {
        this.x = x;
        this.y = y;
        if (is(this.x, "number"))
            throw new core.ArgumentError(this.x);
        if (is(this.y, "number"))
            throw new core.ArgumentError(this.y);
    }
    splat(v) {
        this.NativeFloat64x2(v, v);
    }
    zero() {
        this.splat(0.0);
    }
    fromFloat32x4(v) {
        this.NativeFloat64x2(v.x, v.y);
    }
    _doubles(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
    [OperatorMethods.PLUS](other) {
        return new NativeFloat64x2_1._doubles(this.x + other.x, this.y + other.y);
    }
    [OperatorMethods.NEGATE]() {
        return new NativeFloat64x2_1._doubles(-this.x, -this.y);
    }
    [OperatorMethods.MINUS](other) {
        return new NativeFloat64x2_1._doubles(this.x - other.x, this.y - other.y);
    }
    [OperatorMethods.MULTIPLY](other) {
        return new NativeFloat64x2_1._doubles(this.x * other.x, this.y * other.y);
    }
    [OperatorMethods.DIVIDE](other) {
        return new NativeFloat64x2_1._doubles(this.x / other.x, this.y / other.y);
    }
    scale(s) {
        return new NativeFloat64x2_1._doubles(this.x * s, this.y * s);
    }
    abs() {
        return new NativeFloat64x2_1._doubles(new core.DartDouble(this.x).abs(), new core.DartDouble(this.y).abs());
    }
    clamp(lowerLimit, upperLimit) {
        let _lx = lowerLimit.x;
        let _ly = lowerLimit.y;
        let _ux = upperLimit.x;
        let _uy = upperLimit.y;
        let _x = this.x;
        let _y = this.y;
        _x = _x > _ux ? _ux : _x;
        _y = _y > _uy ? _uy : _y;
        _x = _x < _lx ? _lx : _x;
        _y = _y < _ly ? _ly : _y;
        return new NativeFloat64x2_1._doubles(_x, _y);
    }
    get signMask() {
        let view = NativeFloat64x2_1._uint32View;
        op(Op.INDEX_ASSIGN, NativeFloat64x2_1._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat64x2_1._list, 1, this.y);
        let mx = (op(Op.INDEX, view, 1) & 2147483648) >> 31;
        let my = (op(Op.INDEX, view, 3) & 2147483648) >> 31;
        return mx | my << 1;
    }
    withX(x) {
        if (is(x, "number"))
            throw new core.ArgumentError(x);
        return new NativeFloat64x2_1._doubles(x, this.y);
    }
    withY(y) {
        if (is(y, "number"))
            throw new core.ArgumentError(y);
        return new NativeFloat64x2_1._doubles(this.x, y);
    }
    min(other) {
        return new NativeFloat64x2_1._doubles(this.x < other.x ? this.x : other.x, this.y < other.y ? this.y : other.y);
    }
    max(other) {
        return new NativeFloat64x2_1._doubles(this.x > other.x ? this.x : other.x, this.y > other.y ? this.y : other.y);
    }
    sqrt() {
        return new NativeFloat64x2_1._doubles(math.sqrt(this.x), math.sqrt(this.y));
    }
};
NativeFloat64x2._list = new NativeFloat64List.withLength(2);
NativeFloat64x2._uint32View = NativeFloat64x2_1._list.buffer.asUint32List();
__decorate([
    defaultConstructor
], NativeFloat64x2.prototype, "NativeFloat64x2", null);
__decorate([
    namedConstructor
], NativeFloat64x2.prototype, "splat", null);
__decorate([
    namedConstructor
], NativeFloat64x2.prototype, "zero", null);
__decorate([
    namedConstructor
], NativeFloat64x2.prototype, "fromFloat32x4", null);
__decorate([
    namedConstructor
], NativeFloat64x2.prototype, "_doubles", null);
NativeFloat64x2 = NativeFloat64x2_1 = __decorate([
    DartClass,
    Implements(Float64x2)
], NativeFloat64x2);
export { NativeFloat64x2 };
export var _isInvalidArrayIndex = (index) => {
    return ((index >>> 0 !== index) /* JS('bool', '(# >>> 0 !== #)', index, index) */);
};
export var _checkValidIndex = (index, list, length) => {
    if (_isInvalidArrayIndex(index) || index /* JS('int', '#', index) */ >= length) {
        throw core.diagnoseIndexError(list, index);
    }
};
export var _checkValidRange = (start, end, length) => {
    if (_isInvalidArrayIndex(start) || ((end == null) ? start > length : (_isInvalidArrayIndex(end) || start > end || end > length))) {
        throw core.diagnoseRangeError(start, end, length);
    }
    if (end == null)
        return length;
    return end;
};
let Endianness = class Endianness {
    _(_littleEndian) {
        this._littleEndian = _littleEndian;
    }
};
__decorate([
    namedConstructor
], Endianness.prototype, "_", null);
Endianness = __decorate([
    DartClass
], Endianness);
export { Endianness };
// Init later because of decorators needs to apply first.
Endianness.BIG_ENDIAN = new Endianness._(false);
Endianness.LITTLE_ENDIAN = new Endianness._(true);
Endianness.HOST_ENDIAN = (new ByteData.view(new Uint16List.fromList(new core.DartList.literal(1)).buffer)).getInt8(0) == 1 ? Endianness.LITTLE_ENDIAN : Endianness.BIG_ENDIAN;
export class _Properties {
}
export const properties = new _Properties();
//# sourceMappingURL=typed_data.js.map