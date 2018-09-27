/** Library asset:sample_project/lib/typed_data/dart */
import {is, equals, isNot} from "./_common";
import {
    defaultConstructor,
    namedConstructor,
    namedFactory,
    defaultFactory,
    DartClass,
    Implements,
    op,
    Op,
    OperatorMethods,
    DartClassAnnotation,
    DartMethodAnnotation,
    DartPropertyAnnotation,
    Abstract,
    AbstractProperty,
    double, With, bool, int, AbstractSymbols
} from "./utils";
import * as _common from "./_common";
import * as core from "./core";
import * as async from "./async";
import * as math from "./math";
import {DartMaps} from "./core";
import length = DartMaps.length;

@DartClass
export class ByteBuffer extends ArrayBuffer {


    @namedFactory
    static _withLength(len: number): ByteBuffer {
        return new NativeByteBuffer(len);
    }

    static withLength: new(len: number) => ByteBuffer

    @namedFactory
    static _fromBuffer(buffer: ArrayBuffer): ByteBuffer {
        return new NativeByteBuffer(buffer.byteLength);
    }

    static fromBuffer: new(buffer: ArrayBuffer) => ByteBuffer;


    @AbstractProperty
    get lengthInBytes(): number {
        throw 'abstract'
    }

    @Abstract
    asUint8List(offsetInBytes?: number, length?: number): Uint8List {
        throw 'abstract'
    }

    @Abstract
    asInt8List(offsetInBytes?: number, length?: number): Int8List {
        throw 'abstract'
    }

    @Abstract
    asUint8ClampedList(offsetInBytes?: number, length?: number): Uint8ClampedList {
        throw 'abstract'
    }

    @Abstract
    asUint16List(offsetInBytes?: number, length?: number): Uint16List {
        throw 'abstract'
    }

    @Abstract
    asInt16List(offsetInBytes?: number, length?: number): Int16List {
        throw 'abstract'
    }

    @Abstract
    asUint32List(offsetInBytes?: number, length?: number): Uint32List {
        throw 'abstract'
    }

    @Abstract
    asInt32List(offsetInBytes?: number, length?: number): Int32List {
        throw 'abstract'
    }

    @Abstract
    asUint64List(offsetInBytes?: number, length?: number): Uint64List {
        throw 'abstract'
    }

    @Abstract
    asInt64List(offsetInBytes?: number, length?: number): Int64List {
        throw 'abstract'
    }

    @Abstract
    asInt32x4List(offsetInBytes?: number, length?: number): Int32x4List {
        throw 'abstract'
    }

    @Abstract
    asFloat32List(offsetInBytes?: number, length?: number): Float32List {
        throw 'abstract'
    }

    @Abstract
    asFloat64List(offsetInBytes?: number, length?: number): Float64List {
        throw 'abstract'
    }

    @Abstract
    asFloat32x4List(offsetInBytes?: number, length?: number): Float32x4List {
        throw 'abstract'
    }

    @Abstract
    asFloat64x2List(offsetInBytes?: number, length?: number): Float64x2List {
        throw 'abstract'
    }

    @Abstract
    asByteData(offsetInBytes?: number, length?: number): ByteData {
        throw 'abstract'
    }
}

@DartClass
export class TypedData {
    @AbstractProperty
    get elementSizeInBytes(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get offsetInBytes(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get lengthInBytes(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get buffer(): ByteBuffer {
        throw 'abstract'
    }
}

@DartClass
@Implements(TypedData)
export class ByteData extends TypedData {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _ByteData(length: number): ByteData {
        return new NativeByteData(length);
    }

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): ByteData {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asByteData(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes?: number, length?: number) => ByteData;

    @Abstract
    getInt8(byteOffset: number): number {
        throw 'abstract'
    }

    @Abstract
    setInt8(byteOffset: number, value: number): void {
        throw 'abstract'
    }

    @Abstract
    getUint8(byteOffset: number): number {
        throw 'abstract'
    }

    @Abstract
    setUint8(byteOffset: number, value: number): void {
        throw 'abstract'
    }

    @Abstract
    getInt16(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setInt16(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getUint16(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setUint16(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getInt32(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setInt32(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getUint32(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setUint32(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getInt64(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setInt64(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getUint64(byteOffset: number, endian?: Endianness): number {
        throw 'abstract'
    }

    @Abstract
    setUint64(byteOffset: number, value: number, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getFloat32(byteOffset: number, endian?: Endianness): double {
        throw 'abstract'
    }

    @Abstract
    setFloat32(byteOffset: number, value: double, endian?: Endianness): void {
        throw 'abstract'
    }

    @Abstract
    getFloat64(byteOffset: number, endian?: Endianness): double {
        throw 'abstract'
    }

    @Abstract
    setFloat64(byteOffset: number, value: double, endian?: Endianness): void {
        throw 'abstract'
    }
}


@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Uint16List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Uint16List(length: number): Uint16List {
        return new NativeUint16List.withLength(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Uint16List {
        return new NativeUint16List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Uint16List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Uint16List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint16List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Uint16List;
    static BYTES_PER_ELEMENT: number = 2;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}


@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Int8List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Int8List(length: number): Int8List {
        return new NativeInt8List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Int8List {
        return new NativeInt8List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Int8List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Int8List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt8List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Int8List;
    static BYTES_PER_ELEMENT: number = 1;


    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Uint8List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Uint8List(length: number): Uint8List {
        return new NativeUint8List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Uint8List {
        return new NativeUint8List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Uint8List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Uint8List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Uint8List;
    static BYTES_PER_ELEMENT: number = 1;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Uint8ClampedList extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Uint8ClampedList(length: number): Uint8ClampedList {
        return new NativeUint8ClampedList(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Uint8ClampedList {
        return new NativeUint8ClampedList.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Uint8ClampedList;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Uint8ClampedList {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8ClampedList(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Uint8ClampedList;
    static BYTES_PER_ELEMENT: number = 1;


    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Int16List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Int16List(length: number): Int16List {
        return new NativeInt16List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Int16List {
        return new NativeInt16List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Int16List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Int16List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt16List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Int16List;
    static BYTES_PER_ELEMENT: number = 2;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Int32List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Int32List(length: number): Int32List {
        return new NativeInt32List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Int32List {
        return new NativeInt32List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Int32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Int32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Int32List;
    static BYTES_PER_ELEMENT: number = 4;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Uint32List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Uint32List(length: number): Uint32List {
        return new NativeUint32List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Uint32List {
        return new NativeUint32List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<number>) => Uint32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Uint32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint32List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Uint32List;
    static BYTES_PER_ELEMENT: number = 4;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Int64List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Int64List(length: number): Int64List {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Int64List {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }

    static fromList: new(elements: core.DartList<number>) => Int64List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Int64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt64List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Int64List;
    static BYTES_PER_ELEMENT: number = 8;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Uint64List extends TypedData implements core.DartList<number> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Uint64List(length: number): Uint64List {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): Uint64List {
        throw new core.UnsupportedError("Int64List not supported by dart2ts.");
    }

    static fromList: new(elements: core.DartList<number>) => Uint64List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Uint64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint64List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Uint64List;
    static BYTES_PER_ELEMENT: number = 8;

    [OperatorMethods.INDEX](index: number): number {
        throw 'abstract';
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Float32List extends TypedData implements core.DartList<double> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Float32List(length: number): Float32List {
        return new NativeFloat32List.withLength(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<double>): Float32List {
        return new NativeFloat32List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<double>) => Float32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Float32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Float32List;
    static BYTES_PER_ELEMENT: number = 4;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Float64List extends TypedData implements core.DartList<double> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Float64List(length: number): Float64List {
        return new NativeFloat64List.withLength(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<double>): Float64List {
        return new NativeFloat64List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<double>) => Float64List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Float64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Float64List;
    static BYTES_PER_ELEMENT: number = 8;

    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Float32x4List extends TypedData implements core.DartList<Float32x4> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Float32x4List(length: number): Float32x4List {
        return new NativeFloat32x4List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<Float32x4>): Float32x4List {
        return new NativeFloat32x4List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<Float32x4>) => Float32x4List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Float32x4List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32x4List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Float32x4List;
    static BYTES_PER_ELEMENT: number = 16;

    [OperatorMethods.INDEX](index: number): Float32x4 {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Float32x4) {

    }

    @Abstract
    add(element: Float32x4): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<Float32x4>): void {
    }

    @Abstract
    any(test: (element: Float32x4) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, Float32x4> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): Float32x4 {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: Float32x4) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: Float32x4): void {
    }

    @AbstractProperty
    get first(): Float32x4 {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: Float32x4) => bool, _?: { orElse?: () => Float32x4 }): Float32x4 {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: Float32x4) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: Float32x4): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<Float32x4>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<Float32x4> {
        return undefined;
    }

    @Abstract
    get last(): Float32x4 {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: Float32x4) => bool, _?: { orElse?: () => Float32x4 }): Float32x4 {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: Float32x4, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<Float32x4> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: Float32x4): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): Float32x4 {
        return undefined;
    }

    @Abstract
    removeLast(): Float32x4 {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: Float32x4) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<Float32x4>): void {
    }

    @Abstract
    retainWhere(test: (element: Float32x4) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<Float32x4>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): Float32x4 {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: Float32x4) => bool): Float32x4 {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: Float32x4) => bool): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: Float32x4) => bool): core.DartIterable<Float32x4> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<Float32x4> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<Float32x4> {
        return undefined;
    }

    @Abstract
    where(test: (element: Float32x4) => bool): core.DartIterable<Float32x4> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<Float32x4> {
        return undefined;
    }

    @Abstract
    every(f: (element: Float32x4) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: Float32x4) => any): void {
    }

    @Abstract
    indexOf(element: Float32x4, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: Float32x4, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: Float32x4, element: Float32x4) => Float32x4): Float32x4 {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: Float32x4, b: Float32x4) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<Float32x4> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<Float32x4>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Int32x4List extends TypedData implements core.DartList<Int32x4> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Int32x4List(length: number): Int32x4List {
        return new NativeInt32x4List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<Int32x4>): Int32x4List {
        return new NativeInt32x4List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<Int32x4>) => Int32x4List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Int32x4List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32x4List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Int32x4List;
    static BYTES_PER_ELEMENT: number = 16;

    [OperatorMethods.INDEX](index: number): Int32x4 {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Int32x4) {

    }

    @Abstract
    add(element: Int32x4): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<Int32x4>): void {
    }

    @Abstract
    any(test: (element: Int32x4) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, Int32x4> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): Int32x4 {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: Int32x4) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: Int32x4): void {
    }

    @AbstractProperty
    get first(): Int32x4 {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: Int32x4) => bool, _?: { orElse?: () => Int32x4 }): Int32x4 {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: Int32x4) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: Int32x4): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<Int32x4>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<Int32x4> {
        return undefined;
    }

    @Abstract
    get last(): Int32x4 {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: Int32x4) => bool, _?: { orElse?: () => Int32x4 }): Int32x4 {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: Int32x4, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<Int32x4> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: Int32x4): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): Int32x4 {
        return undefined;
    }

    @Abstract
    removeLast(): Int32x4 {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: Int32x4) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<Int32x4>): void {
    }

    @Abstract
    retainWhere(test: (element: Int32x4) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<Int32x4>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): Int32x4 {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: Int32x4) => bool): Int32x4 {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: Int32x4) => bool): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: Int32x4) => bool): core.DartIterable<Int32x4> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<Int32x4> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<Int32x4> {
        return undefined;
    }

    @Abstract
    where(test: (element: Int32x4) => bool): core.DartIterable<Int32x4> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<Int32x4> {
        return undefined;
    }

    @Abstract
    every(f: (element: Int32x4) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: Int32x4) => any): void {
    }

    @Abstract
    indexOf(element: Int32x4, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: Int32x4, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: Int32x4, element: Int32x4) => Int32x4): Int32x4 {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: Int32x4, b: Int32x4) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<Int32x4> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<Int32x4>, skipCount?: int): void {
    }
}

@DartClass
@Implements(core.DartList, TypedData)
@With(core.DartListMixin)
export class Float64x2List extends TypedData implements core.DartList<Float64x2> {
    constructor(length: number) {
        super();
    }

    @defaultFactory
    static _Float64x2List(length: number): Float64x2List {
        return new NativeFloat64x2List(length);
    }

    @namedFactory
    static _fromList(elements: core.DartList<Float64x2>): Float64x2List {
        return new NativeFloat64x2List.fromList(elements);
    }

    static fromList: new(elements: core.DartList<Float64x2>) => Float64x2List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes?: number, length?: number): Float64x2List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64x2List(offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => Float64x2List;
    static BYTES_PER_ELEMENT: number = 16;

    [OperatorMethods.INDEX](index: number): Float64x2 {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Float64x2) {

    }

    @Abstract
    add(element: Float64x2): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<Float64x2>): void {
    }

    @Abstract
    any(test: (element: Float64x2) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, Float64x2> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): Float64x2 {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: Float64x2) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: Float64x2): void {
    }

    @AbstractProperty
    get first(): Float64x2 {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: Float64x2) => bool, _?: { orElse?: () => Float64x2 }): Float64x2 {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: Float64x2) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: Float64x2): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<Float64x2>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<Float64x2> {
        return undefined;
    }

    @Abstract
    get last(): Float64x2 {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: Float64x2) => bool, _?: { orElse?: () => Float64x2 }): Float64x2 {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: Float64x2, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<Float64x2> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: Float64x2): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): Float64x2 {
        return undefined;
    }

    @Abstract
    removeLast(): Float64x2 {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: Float64x2) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<Float64x2>): void {
    }

    @Abstract
    retainWhere(test: (element: Float64x2) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<Float64x2>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): Float64x2 {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: Float64x2) => bool): Float64x2 {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: Float64x2) => bool): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: Float64x2) => bool): core.DartIterable<Float64x2> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<Float64x2> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<Float64x2> {
        return undefined;
    }

    @Abstract
    where(test: (element: Float64x2) => bool): core.DartIterable<Float64x2> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<Float64x2> {
        return undefined;
    }

    @Abstract
    every(f: (element: Float64x2) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: Float64x2) => any): void {
    }

    @Abstract
    indexOf(element: Float64x2, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: Float64x2, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: Float64x2, element: Float64x2) => Float64x2): Float64x2 {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: Float64x2, b: Float64x2) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<Float64x2> {
        return undefined;
    }

    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<Float64x2>, skipCount?: int): void {
    }
}

@DartClass
export class Float32x4 {
    constructor(x: double, y: double, z: double, w: double) {
    }

    @defaultFactory
    static _Float32x4(x: double, y: double, z: double, w: double): Float32x4 {
        return new NativeFloat32x4(x, y, z, w);
    }

    @namedFactory
    static _splat(v: double): Float32x4 {
        return new NativeFloat32x4.splat(v);
    }

    static splat: new(v: double) => Float32x4;

    @namedFactory
    static _zero(): Float32x4 {
        return new NativeFloat32x4.zero();
    }

    static zero: new() => Float32x4;

    @namedFactory
    static _fromInt32x4Bits(x: Int32x4): Float32x4 {
        return new NativeFloat32x4.fromInt32x4Bits(x);
    }

    static fromInt32x4Bits: new(x: Int32x4) => Float32x4;

    @namedFactory
    static _fromFloat64x2(v: Float64x2): Float32x4 {
        return new Float32x4.fromFloat64x2(v);
    }

    static fromFloat64x2: new(v: Float64x2) => Float32x4;

    //@AbstractProperty
    [OperatorMethods.PLUS](other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.NEGATE](): Float32x4 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.MINUS](other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.MULTIPLY](other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.DIVIDE](other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    lessThan(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    lessThanOrEqual(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    greaterThan(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    greaterThanOrEqual(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    equal(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    notEqual(other: Float32x4): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    scale(s: double): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    abs(): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    clamp(lowerLimit: Float32x4, upperLimit: Float32x4): Float32x4 {
        throw 'abstract'
    }

    @AbstractProperty
    get x(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get y(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get z(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get w(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get signMask(): number {
        throw 'abstract'
    }

    static XXXX: number = 0;
    static XXXY: number = 64;
    static XXXZ: number = 128;
    static XXXW: number = 192;
    static XXYX: number = 16;
    static XXYY: number = 80;
    static XXYZ: number = 144;
    static XXYW: number = 208;
    static XXZX: number = 32;
    static XXZY: number = 96;
    static XXZZ: number = 160;
    static XXZW: number = 224;
    static XXWX: number = 48;
    static XXWY: number = 112;
    static XXWZ: number = 176;
    static XXWW: number = 240;
    static XYXX: number = 4;
    static XYXY: number = 68;
    static XYXZ: number = 132;
    static XYXW: number = 196;
    static XYYX: number = 20;
    static XYYY: number = 84;
    static XYYZ: number = 148;
    static XYYW: number = 212;
    static XYZX: number = 36;
    static XYZY: number = 100;
    static XYZZ: number = 164;
    static XYZW: number = 228;
    static XYWX: number = 52;
    static XYWY: number = 116;
    static XYWZ: number = 180;
    static XYWW: number = 244;
    static XZXX: number = 8;
    static XZXY: number = 72;
    static XZXZ: number = 136;
    static XZXW: number = 200;
    static XZYX: number = 24;
    static XZYY: number = 88;
    static XZYZ: number = 152;
    static XZYW: number = 216;
    static XZZX: number = 40;
    static XZZY: number = 104;
    static XZZZ: number = 168;
    static XZZW: number = 232;
    static XZWX: number = 56;
    static XZWY: number = 120;
    static XZWZ: number = 184;
    static XZWW: number = 248;
    static XWXX: number = 12;
    static XWXY: number = 76;
    static XWXZ: number = 140;
    static XWXW: number = 204;
    static XWYX: number = 28;
    static XWYY: number = 92;
    static XWYZ: number = 156;
    static XWYW: number = 220;
    static XWZX: number = 44;
    static XWZY: number = 108;
    static XWZZ: number = 172;
    static XWZW: number = 236;
    static XWWX: number = 60;
    static XWWY: number = 124;
    static XWWZ: number = 188;
    static XWWW: number = 252;
    static YXXX: number = 1;
    static YXXY: number = 65;
    static YXXZ: number = 129;
    static YXXW: number = 193;
    static YXYX: number = 17;
    static YXYY: number = 81;
    static YXYZ: number = 145;
    static YXYW: number = 209;
    static YXZX: number = 33;
    static YXZY: number = 97;
    static YXZZ: number = 161;
    static YXZW: number = 225;
    static YXWX: number = 49;
    static YXWY: number = 113;
    static YXWZ: number = 177;
    static YXWW: number = 241;
    static YYXX: number = 5;
    static YYXY: number = 69;
    static YYXZ: number = 133;
    static YYXW: number = 197;
    static YYYX: number = 21;
    static YYYY: number = 85;
    static YYYZ: number = 149;
    static YYYW: number = 213;
    static YYZX: number = 37;
    static YYZY: number = 101;
    static YYZZ: number = 165;
    static YYZW: number = 229;
    static YYWX: number = 53;
    static YYWY: number = 117;
    static YYWZ: number = 181;
    static YYWW: number = 245;
    static YZXX: number = 9;
    static YZXY: number = 73;
    static YZXZ: number = 137;
    static YZXW: number = 201;
    static YZYX: number = 25;
    static YZYY: number = 89;
    static YZYZ: number = 153;
    static YZYW: number = 217;
    static YZZX: number = 41;
    static YZZY: number = 105;
    static YZZZ: number = 169;
    static YZZW: number = 233;
    static YZWX: number = 57;
    static YZWY: number = 121;
    static YZWZ: number = 185;
    static YZWW: number = 249;
    static YWXX: number = 13;
    static YWXY: number = 77;
    static YWXZ: number = 141;
    static YWXW: number = 205;
    static YWYX: number = 29;
    static YWYY: number = 93;
    static YWYZ: number = 157;
    static YWYW: number = 221;
    static YWZX: number = 45;
    static YWZY: number = 109;
    static YWZZ: number = 173;
    static YWZW: number = 237;
    static YWWX: number = 61;
    static YWWY: number = 125;
    static YWWZ: number = 189;
    static YWWW: number = 253;
    static ZXXX: number = 2;
    static ZXXY: number = 66;
    static ZXXZ: number = 130;
    static ZXXW: number = 194;
    static ZXYX: number = 18;
    static ZXYY: number = 82;
    static ZXYZ: number = 146;
    static ZXYW: number = 210;
    static ZXZX: number = 34;
    static ZXZY: number = 98;
    static ZXZZ: number = 162;
    static ZXZW: number = 226;
    static ZXWX: number = 50;
    static ZXWY: number = 114;
    static ZXWZ: number = 178;
    static ZXWW: number = 242;
    static ZYXX: number = 6;
    static ZYXY: number = 70;
    static ZYXZ: number = 134;
    static ZYXW: number = 198;
    static ZYYX: number = 22;
    static ZYYY: number = 86;
    static ZYYZ: number = 150;
    static ZYYW: number = 214;
    static ZYZX: number = 38;
    static ZYZY: number = 102;
    static ZYZZ: number = 166;
    static ZYZW: number = 230;
    static ZYWX: number = 54;
    static ZYWY: number = 118;
    static ZYWZ: number = 182;
    static ZYWW: number = 246;
    static ZZXX: number = 10;
    static ZZXY: number = 74;
    static ZZXZ: number = 138;
    static ZZXW: number = 202;
    static ZZYX: number = 26;
    static ZZYY: number = 90;
    static ZZYZ: number = 154;
    static ZZYW: number = 218;
    static ZZZX: number = 42;
    static ZZZY: number = 106;
    static ZZZZ: number = 170;
    static ZZZW: number = 234;
    static ZZWX: number = 58;
    static ZZWY: number = 122;
    static ZZWZ: number = 186;
    static ZZWW: number = 250;
    static ZWXX: number = 14;
    static ZWXY: number = 78;
    static ZWXZ: number = 142;
    static ZWXW: number = 206;
    static ZWYX: number = 30;
    static ZWYY: number = 94;
    static ZWYZ: number = 158;
    static ZWYW: number = 222;
    static ZWZX: number = 46;
    static ZWZY: number = 110;
    static ZWZZ: number = 174;
    static ZWZW: number = 238;
    static ZWWX: number = 62;
    static ZWWY: number = 126;
    static ZWWZ: number = 190;
    static ZWWW: number = 254;
    static WXXX: number = 3;
    static WXXY: number = 67;
    static WXXZ: number = 131;
    static WXXW: number = 195;
    static WXYX: number = 19;
    static WXYY: number = 83;
    static WXYZ: number = 147;
    static WXYW: number = 211;
    static WXZX: number = 35;
    static WXZY: number = 99;
    static WXZZ: number = 163;
    static WXZW: number = 227;
    static WXWX: number = 51;
    static WXWY: number = 115;
    static WXWZ: number = 179;
    static WXWW: number = 243;
    static WYXX: number = 7;
    static WYXY: number = 71;
    static WYXZ: number = 135;
    static WYXW: number = 199;
    static WYYX: number = 23;
    static WYYY: number = 87;
    static WYYZ: number = 151;
    static WYYW: number = 215;
    static WYZX: number = 39;
    static WYZY: number = 103;
    static WYZZ: number = 167;
    static WYZW: number = 231;
    static WYWX: number = 55;
    static WYWY: number = 119;
    static WYWZ: number = 183;
    static WYWW: number = 247;
    static WZXX: number = 11;
    static WZXY: number = 75;
    static WZXZ: number = 139;
    static WZXW: number = 203;
    static WZYX: number = 27;
    static WZYY: number = 91;
    static WZYZ: number = 155;
    static WZYW: number = 219;
    static WZZX: number = 43;
    static WZZY: number = 107;
    static WZZZ: number = 171;
    static WZZW: number = 235;
    static WZWX: number = 59;
    static WZWY: number = 123;
    static WZWZ: number = 187;
    static WZWW: number = 251;
    static WWXX: number = 15;
    static WWXY: number = 79;
    static WWXZ: number = 143;
    static WWXW: number = 207;
    static WWYX: number = 31;
    static WWYY: number = 95;
    static WWYZ: number = 159;
    static WWYW: number = 223;
    static WWZX: number = 47;
    static WWZY: number = 111;
    static WWZZ: number = 175;
    static WWZW: number = 239;
    static WWWX: number = 63;
    static WWWY: number = 127;
    static WWWZ: number = 191;
    static WWWW: number = 255;

    @Abstract
    shuffle(mask: number): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    shuffleMix(other: Float32x4, mask: number): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    withX(x: double): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    withY(y: double): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    withZ(z: double): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    withW(w: double): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    min(other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    max(other: Float32x4): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    sqrt(): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    reciprocal(): Float32x4 {
        throw 'abstract'
    }

    @Abstract
    reciprocalSqrt(): Float32x4 {
        throw 'abstract'
    }
}

@DartClass
@AbstractSymbols(OperatorMethods.BINARY_OR, OperatorMethods.BINARY_AND, OperatorMethods.XOR, OperatorMethods.PLUS, OperatorMethods.MINUS)
export class Int32x4 {
    constructor(x: number, y: number, z: number, w: number) {
    }

    @defaultFactory
    static _Int32x4(x: number, y: number, z: number, w: number): Int32x4 {
        return new NativeInt32x4(x, y, z, w);
    }

    @namedFactory
    static _bool(x: boolean, y: boolean, z: boolean, w: boolean): Int32x4 {
        return new NativeInt32x4.bool(x, y, z, w);
    }

    static bool: new(x: boolean, y: boolean, z: boolean, w: boolean) => Int32x4;

    @namedFactory
    static _fromFloat32x4Bits(x: Float32x4): Int32x4 {
        return new NativeInt32x4.fromFloat32x4Bits(x);
    }

    static fromFloat32x4Bits: new(x: Float32x4) => Int32x4;

    //@Abstract
    [OperatorMethods.BINARY_OR](other: Int32x4): Int32x4 {
        throw 'abstract'
    }

    //@Abstract
    [OperatorMethods.BINARY_AND](other: Int32x4): Int32x4 {
        throw 'abstract'
    }

    //@Abstract
    [OperatorMethods.XOR](other: Int32x4): Int32x4 {
        throw 'abstract'
    }

    //@Abstract
    [OperatorMethods.PLUS](other: Int32x4): Int32x4 {
        throw 'abstract'
    }

    //@Abstract
    [OperatorMethods.MINUS](other: Int32x4): Int32x4 {
        throw 'abstract'
    }

    @AbstractProperty
    get x(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get y(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get z(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get w(): number {
        throw 'abstract'
    }

    @AbstractProperty
    get signMask(): number {
        throw 'abstract'
    }

    static XXXX: number = 0;
    static XXXY: number = 64;
    static XXXZ: number = 128;
    static XXXW: number = 192;
    static XXYX: number = 16;
    static XXYY: number = 80;
    static XXYZ: number = 144;
    static XXYW: number = 208;
    static XXZX: number = 32;
    static XXZY: number = 96;
    static XXZZ: number = 160;
    static XXZW: number = 224;
    static XXWX: number = 48;
    static XXWY: number = 112;
    static XXWZ: number = 176;
    static XXWW: number = 240;
    static XYXX: number = 4;
    static XYXY: number = 68;
    static XYXZ: number = 132;
    static XYXW: number = 196;
    static XYYX: number = 20;
    static XYYY: number = 84;
    static XYYZ: number = 148;
    static XYYW: number = 212;
    static XYZX: number = 36;
    static XYZY: number = 100;
    static XYZZ: number = 164;
    static XYZW: number = 228;
    static XYWX: number = 52;
    static XYWY: number = 116;
    static XYWZ: number = 180;
    static XYWW: number = 244;
    static XZXX: number = 8;
    static XZXY: number = 72;
    static XZXZ: number = 136;
    static XZXW: number = 200;
    static XZYX: number = 24;
    static XZYY: number = 88;
    static XZYZ: number = 152;
    static XZYW: number = 216;
    static XZZX: number = 40;
    static XZZY: number = 104;
    static XZZZ: number = 168;
    static XZZW: number = 232;
    static XZWX: number = 56;
    static XZWY: number = 120;
    static XZWZ: number = 184;
    static XZWW: number = 248;
    static XWXX: number = 12;
    static XWXY: number = 76;
    static XWXZ: number = 140;
    static XWXW: number = 204;
    static XWYX: number = 28;
    static XWYY: number = 92;
    static XWYZ: number = 156;
    static XWYW: number = 220;
    static XWZX: number = 44;
    static XWZY: number = 108;
    static XWZZ: number = 172;
    static XWZW: number = 236;
    static XWWX: number = 60;
    static XWWY: number = 124;
    static XWWZ: number = 188;
    static XWWW: number = 252;
    static YXXX: number = 1;
    static YXXY: number = 65;
    static YXXZ: number = 129;
    static YXXW: number = 193;
    static YXYX: number = 17;
    static YXYY: number = 81;
    static YXYZ: number = 145;
    static YXYW: number = 209;
    static YXZX: number = 33;
    static YXZY: number = 97;
    static YXZZ: number = 161;
    static YXZW: number = 225;
    static YXWX: number = 49;
    static YXWY: number = 113;
    static YXWZ: number = 177;
    static YXWW: number = 241;
    static YYXX: number = 5;
    static YYXY: number = 69;
    static YYXZ: number = 133;
    static YYXW: number = 197;
    static YYYX: number = 21;
    static YYYY: number = 85;
    static YYYZ: number = 149;
    static YYYW: number = 213;
    static YYZX: number = 37;
    static YYZY: number = 101;
    static YYZZ: number = 165;
    static YYZW: number = 229;
    static YYWX: number = 53;
    static YYWY: number = 117;
    static YYWZ: number = 181;
    static YYWW: number = 245;
    static YZXX: number = 9;
    static YZXY: number = 73;
    static YZXZ: number = 137;
    static YZXW: number = 201;
    static YZYX: number = 25;
    static YZYY: number = 89;
    static YZYZ: number = 153;
    static YZYW: number = 217;
    static YZZX: number = 41;
    static YZZY: number = 105;
    static YZZZ: number = 169;
    static YZZW: number = 233;
    static YZWX: number = 57;
    static YZWY: number = 121;
    static YZWZ: number = 185;
    static YZWW: number = 249;
    static YWXX: number = 13;
    static YWXY: number = 77;
    static YWXZ: number = 141;
    static YWXW: number = 205;
    static YWYX: number = 29;
    static YWYY: number = 93;
    static YWYZ: number = 157;
    static YWYW: number = 221;
    static YWZX: number = 45;
    static YWZY: number = 109;
    static YWZZ: number = 173;
    static YWZW: number = 237;
    static YWWX: number = 61;
    static YWWY: number = 125;
    static YWWZ: number = 189;
    static YWWW: number = 253;
    static ZXXX: number = 2;
    static ZXXY: number = 66;
    static ZXXZ: number = 130;
    static ZXXW: number = 194;
    static ZXYX: number = 18;
    static ZXYY: number = 82;
    static ZXYZ: number = 146;
    static ZXYW: number = 210;
    static ZXZX: number = 34;
    static ZXZY: number = 98;
    static ZXZZ: number = 162;
    static ZXZW: number = 226;
    static ZXWX: number = 50;
    static ZXWY: number = 114;
    static ZXWZ: number = 178;
    static ZXWW: number = 242;
    static ZYXX: number = 6;
    static ZYXY: number = 70;
    static ZYXZ: number = 134;
    static ZYXW: number = 198;
    static ZYYX: number = 22;
    static ZYYY: number = 86;
    static ZYYZ: number = 150;
    static ZYYW: number = 214;
    static ZYZX: number = 38;
    static ZYZY: number = 102;
    static ZYZZ: number = 166;
    static ZYZW: number = 230;
    static ZYWX: number = 54;
    static ZYWY: number = 118;
    static ZYWZ: number = 182;
    static ZYWW: number = 246;
    static ZZXX: number = 10;
    static ZZXY: number = 74;
    static ZZXZ: number = 138;
    static ZZXW: number = 202;
    static ZZYX: number = 26;
    static ZZYY: number = 90;
    static ZZYZ: number = 154;
    static ZZYW: number = 218;
    static ZZZX: number = 42;
    static ZZZY: number = 106;
    static ZZZZ: number = 170;
    static ZZZW: number = 234;
    static ZZWX: number = 58;
    static ZZWY: number = 122;
    static ZZWZ: number = 186;
    static ZZWW: number = 250;
    static ZWXX: number = 14;
    static ZWXY: number = 78;
    static ZWXZ: number = 142;
    static ZWXW: number = 206;
    static ZWYX: number = 30;
    static ZWYY: number = 94;
    static ZWYZ: number = 158;
    static ZWYW: number = 222;
    static ZWZX: number = 46;
    static ZWZY: number = 110;
    static ZWZZ: number = 174;
    static ZWZW: number = 238;
    static ZWWX: number = 62;
    static ZWWY: number = 126;
    static ZWWZ: number = 190;
    static ZWWW: number = 254;
    static WXXX: number = 3;
    static WXXY: number = 67;
    static WXXZ: number = 131;
    static WXXW: number = 195;
    static WXYX: number = 19;
    static WXYY: number = 83;
    static WXYZ: number = 147;
    static WXYW: number = 211;
    static WXZX: number = 35;
    static WXZY: number = 99;
    static WXZZ: number = 163;
    static WXZW: number = 227;
    static WXWX: number = 51;
    static WXWY: number = 115;
    static WXWZ: number = 179;
    static WXWW: number = 243;
    static WYXX: number = 7;
    static WYXY: number = 71;
    static WYXZ: number = 135;
    static WYXW: number = 199;
    static WYYX: number = 23;
    static WYYY: number = 87;
    static WYYZ: number = 151;
    static WYYW: number = 215;
    static WYZX: number = 39;
    static WYZY: number = 103;
    static WYZZ: number = 167;
    static WYZW: number = 231;
    static WYWX: number = 55;
    static WYWY: number = 119;
    static WYWZ: number = 183;
    static WYWW: number = 247;
    static WZXX: number = 11;
    static WZXY: number = 75;
    static WZXZ: number = 139;
    static WZXW: number = 203;
    static WZYX: number = 27;
    static WZYY: number = 91;
    static WZYZ: number = 155;
    static WZYW: number = 219;
    static WZZX: number = 43;
    static WZZY: number = 107;
    static WZZZ: number = 171;
    static WZZW: number = 235;
    static WZWX: number = 59;
    static WZWY: number = 123;
    static WZWZ: number = 187;
    static WZWW: number = 251;
    static WWXX: number = 15;
    static WWXY: number = 79;
    static WWXZ: number = 143;
    static WWXW: number = 207;
    static WWYX: number = 31;
    static WWYY: number = 95;
    static WWYZ: number = 159;
    static WWYW: number = 223;
    static WWZX: number = 47;
    static WWZY: number = 111;
    static WWZZ: number = 175;
    static WWZW: number = 239;
    static WWWX: number = 63;
    static WWWY: number = 127;
    static WWWZ: number = 191;
    static WWWW: number = 255;

    @Abstract
    shuffle(mask: number): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    shuffleMix(other: Int32x4, mask: number): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withX(x: number): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withY(y: number): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withZ(z: number): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withW(w: number): Int32x4 {
        throw 'abstract'
    }

    @AbstractProperty
    get flagX(): boolean {
        throw 'abstract'
    }

    @AbstractProperty
    get flagY(): boolean {
        throw 'abstract'
    }

    @AbstractProperty
    get flagZ(): boolean {
        throw 'abstract'
    }

    @AbstractProperty
    get flagW(): boolean {
        throw 'abstract'
    }

    @Abstract
    withFlagX(x: boolean): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withFlagY(y: boolean): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withFlagZ(z: boolean): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    withFlagW(w: boolean): Int32x4 {
        throw 'abstract'
    }

    @Abstract
    select(trueValue: Float32x4, falseValue: Float32x4): Float32x4 {
        throw 'abstract'
    }
}

@DartClass
export class Float64x2 {
    constructor(x: double, y: double) {
    }

    @defaultFactory
    static _Float64x2(x: double, y: double): Float64x2 {
        return new NativeFloat64x2(x, y);
    }

    @namedFactory
    static _splat(v: double): Float64x2 {
        return new NativeFloat64x2.splat(v);
    }

    static splat: new(v: double) => Float64x2;

    @namedFactory
    static _zero(): Float64x2 {
        return new NativeFloat64x2.zero();
    }

    static zero: new() => Float64x2;

    @namedFactory
    static _fromFloat32x4(v: Float32x4): Float64x2 {
        return new NativeFloat64x2.fromFloat32x4(v);
    }

    static fromFloat32x4: new(v: Float32x4) => Float64x2;

    // @Abstract
    [OperatorMethods.PLUS](other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.NEGATE](): Float64x2 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.MINUS](other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.MULTIPLY](other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    // @Abstract
    [OperatorMethods.DIVIDE](other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    scale(s: double): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    abs(): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    clamp(lowerLimit: Float64x2, upperLimit: Float64x2): Float64x2 {
        throw 'abstract'
    }

    @AbstractProperty
    get x(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get y(): double {
        throw 'abstract'
    }

    @AbstractProperty
    get signMask(): number {
        throw 'abstract'
    }

    @Abstract
    withX(x: double): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    withY(y: double): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    min(other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    max(other: Float64x2): Float64x2 {
        throw 'abstract'
    }

    @Abstract
    sqrt(): Float64x2 {
        throw 'abstract'
    }
}


@DartClass
@Implements(ByteBuffer)
@AbstractSymbols(Symbol.toStringTag)
export class NativeByteBufferMixin implements ByteBuffer {

    @Abstract
    get lengthInBytes(): number {
        throw 'native';
    }

    asUint8List(offsetInBytes?: number, length?: number): Uint8List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint8List.view(this, offsetInBytes, length);
    }

    asInt8List(offsetInBytes?: number, length?: number): Int8List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt8List.view(this, offsetInBytes, length);
    }

    asUint8ClampedList(offsetInBytes?: number, length?: number): Uint8ClampedList {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint8ClampedList.view(this, offsetInBytes, length);
    }

    asUint16List(offsetInBytes?: number, length?: number): Uint16List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint16List.view(this, offsetInBytes, length);
    }

    asInt16List(offsetInBytes?: number, length?: number): Int16List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt16List.view(this, offsetInBytes, length);
    }

    asUint32List(offsetInBytes?: number, length?: number): Uint32List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeUint32List.view(this, offsetInBytes, length);
    }

    asInt32List(offsetInBytes?: number, length?: number): Int32List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeInt32List.view(this, offsetInBytes, length);
    }

    asUint64List(offsetInBytes?: number, length?: number): Uint64List {
        offsetInBytes = offsetInBytes || 0;
        throw new core.UnsupportedError("Uint64List not supported by dart2js.");
    }

    asInt64List(offsetInBytes?: number, length?: number): Int64List {
        offsetInBytes = offsetInBytes || 0;
        throw new core.UnsupportedError("Int64List not supported by dart2js.");
    }

    asInt32x4List(offsetInBytes?: number, length?: number): Int32x4List {
        offsetInBytes = offsetInBytes || 0;
        let storage: NativeInt32List = this.asInt32List(offsetInBytes, length != null ? length * 4 : null) as any;
        return new NativeInt32x4List._externalStorage(storage);
    }

    asFloat32List(offsetInBytes?: number, length?: number): Float32List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeFloat32List.view(this, offsetInBytes, length);
    }

    asFloat64List(offsetInBytes?: number, length?: number): Float64List {
        offsetInBytes = offsetInBytes || 0;
        return new NativeFloat64List.view(this, offsetInBytes, length);
    }

    asFloat32x4List(offsetInBytes?: number, length?: number): Float32x4List {
        offsetInBytes = offsetInBytes || 0;
        let storage: NativeFloat32List = this.asFloat32List(offsetInBytes, length != null ? length * 4 : null) as any;
        return new NativeFloat32x4List._externalStorage(storage);
    }

    asFloat64x2List(offsetInBytes?: number, length?: number): Float64x2List {
        offsetInBytes = offsetInBytes || 0;
        let storage: NativeFloat64List = this.asFloat64List(offsetInBytes, length != null ? length * 2 : null) as any;
        return new NativeFloat64x2List._externalStorage(storage);
    }

    asByteData(offsetInBytes?: number, length?: number): ByteData {
        offsetInBytes = offsetInBytes || 0;
        return new NativeByteData.view(this, offsetInBytes, length);
    }

    @AbstractProperty
    get byteLength(): number {
        throw 'abstract';
    }

    @Abstract
    slice(begin: number, end?: number): ArrayBuffer {
        throw 'abstract';
    }

    readonly [Symbol.toStringTag]: "ArrayBuffer";
}

// Add the mixin to the ArrayBuffer directly
With(NativeByteBufferMixin)(ArrayBuffer);

@DartClass
@Implements(ByteBuffer)
export class NativeByteBuffer extends ArrayBuffer implements ByteBuffer, NativeByteBufferMixin {
    constructor(len) {
        super(len);
    }

    @AbstractProperty
    get lengthInBytes(): number {
        throw 'abstract'
    }

    @Abstract
    asUint8List(offsetInBytes?: number, length?: number): Uint8List {
        throw 'abstract'
    }

    @Abstract
    asInt8List(offsetInBytes?: number, length?: number): Int8List {
        throw 'abstract'
    }

    @Abstract
    asUint8ClampedList(offsetInBytes?: number, length?: number): Uint8ClampedList {
        throw 'abstract'
    }

    @Abstract
    asUint16List(offsetInBytes?: number, length?: number): Uint16List {
        throw 'abstract'
    }

    @Abstract
    asInt16List(offsetInBytes?: number, length?: number): Int16List {
        throw 'abstract'
    }

    @Abstract
    asUint32List(offsetInBytes?: number, length?: number): Uint32List {
        throw 'abstract'
    }

    @Abstract
    asInt32List(offsetInBytes?: number, length?: number): Int32List {
        throw 'abstract'
    }

    @Abstract
    asUint64List(offsetInBytes?: number, length?: number): Uint64List {
        throw 'abstract'
    }

    @Abstract
    asInt64List(offsetInBytes?: number, length?: number): Int64List {
        throw 'abstract'
    }

    @Abstract
    asInt32x4List(offsetInBytes?: number, length?: number): Int32x4List {
        throw 'abstract'
    }

    @Abstract
    asFloat32List(offsetInBytes?: number, length?: number): Float32List {
        throw 'abstract'
    }

    @Abstract
    asFloat64List(offsetInBytes?: number, length?: number): Float64List {
        throw 'abstract'
    }

    @Abstract
    asFloat32x4List(offsetInBytes?: number, length?: number): Float32x4List {
        throw 'abstract'
    }

    @Abstract
    asFloat64x2List(offsetInBytes?: number, length?: number): Float64x2List {
        throw 'abstract'
    }

    @Abstract
    asByteData(offsetInBytes?: number, length?: number): ByteData {
        throw 'abstract'
    }
}

@DartClass
@Implements(Float32x4List)
@With(core.DartListMixin, core.DartFixedLengthListMixin)
export class NativeFloat32x4List extends Float32x4List {
    _storage: NativeFloat32List;

    constructor(length: number) {
        super(length);
    }

    @defaultConstructor
    NativeFloat32x4List(length: number) {
        this._storage = new NativeFloat32List.withLength(length * 4);
    }

    @namedConstructor
    _externalStorage(_storage: NativeFloat32List) {
        this._storage = _storage;
    }

    static _externalStorage: new(_storage: NativeFloat32List) => NativeFloat32x4List;

    @namedConstructor
    _slowFromList(list: core.DartList<Float32x4>) {
        this._storage = new NativeFloat32List.withLength(list.length * 4);
        for (let i: number = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 1, e.y);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 2, e.z);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 3, e.w);
        }
    }

    static _slowFromList: new(list: core.DartList<Float32x4>) => NativeFloat32x4List;

    @namedFactory
    static _fromList(list: core.DartList<Float32x4>): NativeFloat32x4List {
        if (is(list, NativeFloat32x4List)) {
            return new NativeFloat32x4List._externalStorage(new NativeFloat32List.fromList((list as any)._storage));
        } else {
            return new NativeFloat32x4List._slowFromList(list);
        }
    }

    static fromList: new(list: core.DartList<Float32x4>) => NativeFloat32x4List;

    get buffer(): ByteBuffer {
        return this._storage.buffer;
    }

    get lengthInBytes(): number {
        return this._storage.lengthInBytes;
    }

    get offsetInBytes(): number {
        return this._storage.offsetInBytes;
    }

    get elementSizeInBytes(): number {
        return Float32x4List.BYTES_PER_ELEMENT;
    }

    get length(): number {
        return op(Op.QUOTIENT, this._storage.length, 4);
    }

    [OperatorMethods.INDEX](index: number): Float32x4 {
        _checkValidIndex(index, this, this.length);
        let _x: double = op(Op.INDEX, this._storage, (index * 4) + 0);
        let _y: double = op(Op.INDEX, this._storage, (index * 4) + 1);
        let _z: double = op(Op.INDEX, this._storage, (index * 4) + 2);
        let _w: double = op(Op.INDEX, this._storage, (index * 4) + 3);
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Float32x4): void {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 1, value.y);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 2, value.z);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 3, value.w);
    }

    sublist(start: number, end?: number): core.DartList<Float32x4> {
        end = _checkValidRange(start, end, this.length);
        return new NativeFloat32x4List._externalStorage(this._storage.sublist(start * 4, end * 4)as any);
    }
}

@DartClass
@Implements(Int32x4List)
@With(core.DartListMixin, core.DartFixedLengthListMixin)
export class NativeInt32x4List extends Int32x4List {
    _storage: Int32List;

    constructor(length: number) {
        super(length);
    }

    @defaultConstructor
    NativeInt32x4List(length: number) {
        this._storage = new NativeInt32List(length * 4);
    }

    @namedConstructor
    _externalStorage(storage: Int32List) {
        this._storage = storage;
    }

    static _externalStorage: new(storage: Int32List) => NativeInt32x4List;

    @namedConstructor
    _slowFromList(list: core.DartList<Int32x4>) {
        this._storage = new NativeInt32List(list.length * 4);
        for (let i: number = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 1, e.y);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 2, e.z);
            op(Op.INDEX_ASSIGN, this._storage, (i * 4) + 3, e.w);
        }
    }

    static _slowFromList: new(list: core.DartList<Int32x4>) => NativeInt32x4List;

    @namedFactory
    static _fromList(list: core.DartList<Int32x4>): NativeInt32x4List {
        if (is(list, NativeInt32x4List)) {
            return new NativeInt32x4List._externalStorage(new NativeInt32List.fromList(list._storage) as any);
        } else {
            return new NativeInt32x4List._slowFromList(list);
        }
    }

    static fromList: new(list: core.DartList<Int32x4>) => NativeInt32x4List;

    get buffer(): ByteBuffer {
        return this._storage.buffer;
    }

    get lengthInBytes(): number {
        return this._storage.lengthInBytes;
    }

    get offsetInBytes(): number {
        return this._storage.offsetInBytes;
    }

    get elementSizeInBytes(): number {
        return Int32x4List.BYTES_PER_ELEMENT;
    }

    get length(): number {
        return op(Op.QUOTIENT, this._storage.length, 4);
    }

    [OperatorMethods.INDEX](index: number): Int32x4 {
        _checkValidIndex(index, this, this.length);
        let _x: number = op(Op.INDEX, this._storage, (index * 4) + 0);
        let _y: number = op(Op.INDEX, this._storage, (index * 4) + 1);
        let _z: number = op(Op.INDEX, this._storage, (index * 4) + 2);
        let _w: number = op(Op.INDEX, this._storage, (index * 4) + 3);
        return new NativeInt32x4._truncated(_x, _y, _z, _w);
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Int32x4): void {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 1, value.y);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 2, value.z);
        op(Op.INDEX_ASSIGN, this._storage, (index * 4) + 3, value.w);
    }

    sublist(start: number, end?: number): core.DartList<Int32x4> {
        end = _checkValidRange(start, end, this.length);
        return new NativeInt32x4List._externalStorage(this._storage.sublist(start * 4, end * 4) as any);
    }
}

@DartClass
@Implements(Float64x2List)
@With(core.DartListMixin, core.DartFixedLengthListMixin)
export class NativeFloat64x2List extends core.DartListBase<Float64x2> implements Float64x2List {
    _storage: NativeFloat64List;

    constructor(length: number) {
        super();
    }

    @defaultConstructor
    NativeFloat64x2List(length: number) {
        this._storage = new NativeFloat64List.withLength(length * 2);
    }

    @namedConstructor
    _externalStorage(_storage: NativeFloat64List) {
        this._storage = _storage;
    }

    static _externalStorage: new(_storage: NativeFloat64List) => NativeFloat64x2List;

    @namedConstructor
    _slowFromList(list: core.DartList<Float64x2>) {
        this._storage = new NativeFloat64List.withLength(list.length * 2);
        for (let i: number = 0; i < list.length; i++) {
            let e = list[i];
            op(Op.INDEX_ASSIGN, this._storage, (i * 2) + 0, e.x);
            op(Op.INDEX_ASSIGN, this._storage, (i * 2) + 1, e.y);
        }
    }

    static _slowFromList: new(list: core.DartList<Float64x2>) => NativeFloat64x2List;

    @namedFactory
    static _fromList(list: core.DartList<Float64x2>): NativeFloat64x2List {
        if (is(list, NativeFloat64x2List)) {
            return new NativeFloat64x2List._externalStorage(new NativeFloat64List.fromList(list._storage));
        } else {
            return new NativeFloat64x2List._slowFromList(list);
        }
    }

    static fromList: new(list: core.DartList<Float64x2>) => NativeFloat64x2List;


    get buffer(): ByteBuffer {
        return this._storage.buffer;
    }

    get lengthInBytes(): number {
        return this._storage.lengthInBytes;
    }

    get offsetInBytes(): number {
        return this._storage.offsetInBytes;
    }

    get elementSizeInBytes(): number {
        return Float64x2List.BYTES_PER_ELEMENT;
    }

    get length(): number {
        return op(Op.QUOTIENT, this._storage.length, 2);
    }

    [OperatorMethods.INDEX](index: number): Float64x2 {
        _checkValidIndex(index, this, this.length);
        let _x: double = op(Op.INDEX, this._storage, (index * 2) + 0);
        let _y: double = op(Op.INDEX, this._storage, (index * 2) + 1);
        return new Float64x2(_x, _y);
    }

    [OperatorMethods.INDEX_EQ](index: number, value: Float64x2): void {
        _checkValidIndex(index, this, this.length);
        op(Op.INDEX_ASSIGN, this._storage, (index * 2) + 0, value.x);
        op(Op.INDEX_ASSIGN, this._storage, (index * 2) + 1, value.y);
    }

    sublist(start: number, end?: number): core.DartList<Float64x2> {
        end = _checkValidRange(start, end, this.length);
        return new NativeFloat64x2List._externalStorage(this._storage.sublist(start * 2, end * 2) as any);
    }
}

@DartClass
@Implements(TypedData)
export class NativeTypedData implements TypedData, ArrayBufferView {
    @AbstractProperty
    get offsetInBytes(): number {
        throw 'abstract';
    }

    set offsetInBytes(value: number) {
        throw 'abstract';
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    set elementSizeInBytes(value: number) {
        throw 'abstract';
    }

    @AbstractProperty
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    set buffer(buf: ByteBuffer) {
        throw 'abstract';
    }

    @AbstractProperty
    get lengthInBytes(): number {
        throw 'abstract';
    }


    _invalidPosition(position: number, length: number, name: string): void {
        if (is(position, "number")) {
            throw new core.ArgumentError.value(position, name, 'Invalid list position');
        } else {
            throw new core.RangeError.range(position, 0, length, name);
        }
    }

    _checkPosition(position: number, length: number, name: string): void {
        if ((position >>> 0) !== position/* JS('bool', '(# >>> 0) !== #', position, position) */ || position/* JS('int', '#', position) */ > length) {
            this._invalidPosition(position, length, name);
        }
    }

    @AbstractProperty
    get byteLength(): number {
        throw 'abstract';
    }

    @AbstractProperty
    get byteOffset(): number {
        throw 'abstract';
    }
}

export var _checkLength: (length: any) => number = (length: any): number => {
    if (is(length, "number")) throw new core.ArgumentError(`Invalid length ${length}`);
    return length;
};
export var _checkViewArguments: (buffer: any, offsetInBytes: any, length: any) => void = (buffer: any, offsetInBytes: any, length: any): void => {
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
export var _ensureNativeList: (list: core.DartList<any>) => core.DartList<any> = (list: core.DartList<any>): core.DartList<any> => {
    if (is(list, core.JSArray)) return list;
    let result: core.DartList<any> = new core.DartList<any>(list.length);
    for (let i: number = 0; i < list.length; i++) {
        result[i] = list[i];
    }
    return result;
};

@DartClass
@Implements(ByteData)
@With(NativeTypedData)
export class NativeByteData extends DataView implements ByteData, NativeTypedData {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }
/*
    @namedFactory
    static empty():NativeByteData {
        return NativeByteData._create1()
    }
*/
    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeByteData {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeByteData._create2(buffer, offsetInBytes) : NativeByteData._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeByteData;


    get elementSizeInBytes(): number {
        return 1;
    }

    getFloat32(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getFloat32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getFloat32(byteOffset: number, littleEndian?: boolean): number

    getFloat64(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getFloat64(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getFloat64(byteOffset: number, littleEndian?: boolean): number

    getInt16(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getInt16(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getInt16(byteOffset: number, littleEndian?: boolean): number

    getInt32(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getInt32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getInt32(byteOffset: number, littleEndian?: boolean): number

    getInt64(byteOffset: number, endian?: Endianness): number {
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Int64 accessor not supported by dart2js.');
    }

    //getInt8(byteOffset: number): number {
    //}

    getUint16(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getUint16(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getUint16(byteOffset: number, littleEndian?: boolean): number

    getUint32(byteOffset: number, endian?: Endianness | boolean): number {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.getUint32(byteOffset, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_getUint32(byteOffset: number, littleEndian?: boolean): number

    getUint64(byteOffset: number, endian?: Endianness): number {
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Uint64 accessor not supported by dart2js.');
    }

    //getUint8(byteOffset: number): number

    setFloat32(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setFloat32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void

    setFloat64(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setFloat64(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void

    setInt16(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setInt16(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setInt16(byteOffset: number, value: number, littleEndian?: boolean): void

    setInt32(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setInt32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setInt32(byteOffset: number, value: number, littleEndian?: boolean): void

    setInt64(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Int64 accessor not supported by dart2js.');
    }

    //setInt8(byteOffset: number, value: number): void

    setUint16(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setUint16(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setUint16(byteOffset: number, value: number, littleEndian?: boolean): void

    setUint32(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        return super.setUint32(byteOffset, value, op(Op.EQUALS, Endianness.LITTLE_ENDIAN, endian));
    }

    //_setUint32(byteOffset: number, value: number, littleEndian?: boolean): void

    setUint64(byteOffset: number, value: number, endian?: Endianness | boolean): void {
        if (endian === true) endian = Endianness.LITTLE_ENDIAN;
        endian = endian || Endianness.BIG_ENDIAN;
        throw new core.UnsupportedError('Uint64 accessor not supported by dart2js.');
    }

    //setUint8(byteOffset: number, value: number): void

    static _create1(arg: any): NativeByteData {
        return new NativeByteData(new ByteBuffer(arg))/* JS('NativeByteData', 'new DataView(new ArrayBuffer(#))', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeByteData {
        return new NativeByteData(arg1, arg2)/* JS('NativeByteData', 'new DataView(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeByteData {
        return new NativeByteData(arg1, arg2, arg3)/* JS('NativeByteData', 'new DataView(#, #, #)', arg1, arg2, arg3) */;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }


    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    get lengthInBytes(): number {
        return super.byteLength;
    }

    @Abstract
    get offsetInBytes(): number {
        return super.byteOffset;
    }
}

@DartClass
export class NativeTypedArray extends NativeTypedData {
    get length(): number {
        // @ts-ignore
        return super.length/* JS('JSUInt32', '#.length', this) */;
    }

    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
        let targetLength: number = this.length;
        this._checkPosition(start, targetLength, "start");
        this._checkPosition(end, targetLength, "end");
        if (start > end) throw new core.RangeError.range(start, 0, end);
        let count: number = end - start;
        if (skipCount < 0) throw new core.ArgumentError(skipCount);
        let sourceLength: number = source.length;
        if (sourceLength - skipCount < count) {
            throw new core.StateError('Not enough elements');
        }
        if (skipCount != 0 || sourceLength != count) {
            source = (source as any).subarray(skipCount, skipCount + count)/* JS('', '#.subarray(#, #)', source, skipCount, skipCount + count) */;
        }
        (this as any).set(source, start)/* JS('void', '#.set(#, #)', this, source, start) */;
    }
}

@DartClass
@With(core.DartListMixin)
@AbstractSymbols(Symbol.iterator)
export class NativeTypedArrayOfDouble extends NativeTypedArray implements core.DartList<number> {
    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this as any, this.length);
        return this[index]/* JS('num', '#[#]', this, index) */;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number): void {
        _checkValidIndex(index, this as any, this.length);
        this[index] = value/* JS('void', '#[#] = #', this, index, value) */;
    }

    setRange(start: number, end: number, iterable: core.DartIterable<double>, skipCount?: number): void {
        skipCount = skipCount || 0;
        if (is(iterable, NativeTypedArrayOfDouble)) {
            this._setRangeFast(start, end, iterable, skipCount);
            return;
        }
        // @ts-ignore
        super.setRange(start, end, iterable, skipCount);
    }


    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }


    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }
}

@DartClass
@Implements(core.DartList)
@With(core.DartListMixin)
@AbstractSymbols(Symbol.iterator, OperatorMethods.INDEX)
export class NativeTypedArrayOfInt extends NativeTypedArray implements core.DartList<number> {
    [OperatorMethods.INDEX_EQ](index: number, value: number): void {
        _checkValidIndex(index, this, this.length);
        this[index] = value/* JS('void', '#[#] = #', this, index, value) */;
    }

    setRange(start: number, end: number, iterable: core.DartIterable<number>, skipCount?: number): void {
        skipCount = skipCount || 0;
        if (is(iterable, NativeTypedArrayOfInt)) {
            this._setRangeFast(start, end, iterable as any, skipCount);
            return;
        }
        // @ts-ignore
        super.setRange(start, end, iterable, skipCount);
    }


    [OperatorMethods.INDEX](index: number): number {
        throw 'abstract';
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }


    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    [Symbol.iterator](): Iterator<number> {
        return undefined;
    }

    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    sublist(start: int, end?: int): core.DartList<number> {
        return undefined;
    }
}

@DartClass
@Implements(Float32List)
@With(NativeTypedArrayOfDouble)
export class NativeFloat32List extends Float32Array implements NativeTypedArrayOfDouble, Float32List {
    protected constructor(length: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>);
    protected constructor(buffer: ByteBuffer, byteOffset: number, length?: number);
    protected constructor(buffer: ByteBuffer | number, byteOffset?: number, length?: number) {
        // @ts-ignore
        super(...arguments);
    }

    @namedFactory
    static _withLength(len: number): NativeFloat32List {
        return NativeFloat32List._create1(len);
    }

    static withLength: new(len: number) => NativeFloat32List;

    @namedFactory
    static _fromList(elements: core.DartList<double>): NativeFloat32List {
        return NativeFloat32List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<double>) => NativeFloat32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeFloat32List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeFloat32List._create2(buffer, offsetInBytes) : NativeFloat32List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeFloat32List;


    sublist(start: number, end?: number): core.DartList<double> {
        end = _checkValidRange(start, end, this.length);
        let source: Float32Array = this.subarray(start, end)/* JS('NativeFloat32List', '#.subarray(#, #)', this, start, end) */;
        return NativeFloat32List._create1(source);
    }

    static _create1(lenOrSource: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>): NativeFloat32List {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeFloat32List(buf, 0, lenOrSource);
        } else {
            return new NativeFloat32List(lenOrSource)/* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }

    static _create2(arg1: any, arg2: any): NativeFloat32List {
        return new NativeFloat32List(arg1, arg2)/* JS('NativeFloat32List', 'new Float32Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeFloat32List {
        return new NativeFloat32List(arg1, arg2, arg3)/* JS('NativeFloat32List', 'new Float32Array(#, #, #)', arg1, arg2, arg3) */;
    }

    buffer: any;


    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    every(...args: any[]): any
    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    forEach(...args: any[]): any
    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    reduce(...args: any[]): any
    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    sort(...args: any[]): any
    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }


    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    _checkPosition(position: number, length: number, name: string): void {
    }

    _invalidPosition(position: number, length: number, name: string): void {
    }

    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }

    get elementSizeInBytes(): number {
        return 0;
    }

    get lengthInBytes(): number {
        return 0;
    }

    get offsetInBytes(): number {
        return 0;
    }


}

@DartClass
@Implements(Float64List)
@With(NativeTypedArrayOfDouble)
export class NativeFloat64List extends Float64Array implements NativeTypedArrayOfDouble, Float64List {
    protected constructor(length: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>);
    protected constructor(buffer: ByteBuffer, byteOffset: number, length?: number);
    protected constructor(buffer: ByteBuffer | number, byteOffset?: number, length?: number) {
        // @ts-ignore
        super(...arguments);
    }

    @namedFactory
    static _withLength(len: number): NativeFloat64List {
        return NativeFloat64List._create1(len);
    }

    static withLength: new(len: number) => NativeFloat64List;

    @namedFactory
    static _fromList(elements: core.DartList<double>): NativeFloat64List {
        return NativeFloat64List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<double>) => NativeFloat64List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeFloat64List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeFloat64List._create2(buffer, offsetInBytes) : NativeFloat64List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeFloat64List;

    sublist(start: number, end?: number): core.DartList<double> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeFloat64List', '#.subarray(#, #)', this, start, end) */;
        return NativeFloat64List._create1(source);
    }


    static _create1(lenOrSource: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>): NativeFloat64List {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeFloat64List(buf, 0, lenOrSource);
        } else {
            return new NativeFloat64List(lenOrSource)/* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }

    static _create2(arg1: any, arg2: any): NativeFloat64List {
        return new NativeFloat64List(arg1, arg2)/* JS('NativeFloat64List', 'new Float64Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeFloat64List {
        return new NativeFloat64List(arg1, arg2, arg3)/* JS('NativeFloat64List', 'new Float64Array(#, #, #)', arg1, arg2, arg3) */;
    }


    buffer: any;


    [OperatorMethods.INDEX](index: number): number {
        return undefined;
    }

    [OperatorMethods.INDEX_EQ](index: number, value: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    get isEmpty(): boolean {
        return undefined;
    }

    @Abstract
    get isNotEmpty(): bool {
        return undefined;
    }

    @Abstract
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @Abstract
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }


    every(...args: any[]): any
    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    forEach(...args: any[]): any
    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    reduce(...args: any[]): any
    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    sort(...args: any[]): any
    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }


    @AbstractProperty
    get length(): int {
        return undefined;
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    _checkPosition(position: number, length: number, name: string): void {
    }

    _invalidPosition(position: number, length: number, name: string): void {
    }

    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }

    get elementSizeInBytes(): number {
        return 0;
    }

    get lengthInBytes(): number {
        return 0;
    }

    get offsetInBytes(): number {
        return 0;
    }

}

@DartClass
@Implements(Int16List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeInt16List extends Int16Array implements NativeTypedArrayOfInt, Int16List {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeInt16List {
        return NativeInt16List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeInt16List;

    @namedFactory
    static _view(buffer: NativeByteBuffer, offsetInBytes: number, length: number): NativeInt16List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt16List._create2(buffer, offsetInBytes) : NativeInt16List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: NativeByteBuffer, offsetInBytes: number, length: number) => NativeInt16List;

    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('int', '#[#]', this, index) */;
    }


    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeInt16List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt16List._create1(source);
    }

    static _create1(arg: any): NativeInt16List {
        return new NativeInt16List(arg)/* JS('NativeInt16List', 'new Int16Array(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeInt16List {
        return new NativeInt16List(arg1, arg2)/* JS('NativeInt16List', 'new Int16Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeInt16List {
        return new NativeInt16List(arg1, arg2, arg3)/* JS('NativeInt16List', 'new Int16Array(#, #, #)', arg1, arg2, arg3) */;
    }

    [OperatorMethods.INDEX_EQ](index: number, val: number) {

    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @Abstract
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }


    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }


    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    [Symbol.iterator](): IterableIterator<number> {
        return undefined;
    }

    every(...args: any[])
    @Abstract
    every(f: (element: number) => boolean): boolean {
        return false;
    }

    forEach(...args: any[])
    @Abstract
    forEach(f: (element: number) => any): void {
    }

    @Abstract
    indexOf(element: number, start?: int): int {
        return undefined;
    }

    @Abstract
    join(separator?: string): string {
        return "";
    }

    @Abstract
    lastIndexOf(element: number, start?: int): int {
        return undefined;
    }

    reduce(...args: any[])
    @Abstract
    reduce(combine: (value: number, element: number) => number): number {
        return undefined;
    }

    sort(...args: any[])
    @Abstract
    sort(compare?: (a: number, b: number) => int): void {
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }

    @Abstract
    get buffer(): ByteBuffer {
        return undefined;
    }

    @Abstract
    get lengthInBytes(): number {
        return 0;
    }

    @Abstract
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    setRange(start: number | int, end: number | int, iterable: core.DartIterable<number>, skipCount?: number | int): void {
    }

}

@DartClass
@Implements(Int32List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeInt32List extends Int32Array implements Int32List, NativeTypedArrayOfInt {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }

    /*
    @defaultFactory
    static _NativeInt32List(length: number): NativeInt32List {
        return NativeInt32List._create1(_checkLength(length));
    }*/

    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeInt32List {
        return NativeInt32List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeInt32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeInt32List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt32List._create2(buffer, offsetInBytes) : NativeInt32List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeInt32List;

    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('int', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeInt32List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt32List._create1(source);
    }

    static _create1(arg: any): NativeInt32List {
        return new NativeInt32List(arg)/* JS('NativeInt32List', 'new Int32Array(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeInt32List {
        return new NativeInt32List(arg1, arg2)/* JS('NativeInt32List', 'new Int32Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeInt32List {
        return new NativeInt32List(arg1, arg2, arg3)/* JS('NativeInt32List', 'new Int32Array(#, #, #)', arg1, arg2, arg3) */;
    }


    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Int8List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeInt8List extends Int8Array implements Int8List, NativeTypedArrayOfInt {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }


    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeInt8List {
        return NativeInt8List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeInt8List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeInt8List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeInt8List._create2(buffer, offsetInBytes) : NativeInt8List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeInt8List;


    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('int', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeInt8List', '#.subarray(#, #)', this, start, end) */;
        return NativeInt8List._create1(source);
    }

    static _create1(arg: any): NativeInt8List {
        return new NativeInt8List(arg)/* JS('NativeInt8List', 'new Int8Array(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeInt8List {
        return new NativeInt8List(arg1, arg2)/* JS('NativeInt8List', 'new Int8Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeInt8List {
        return new NativeInt8List(arg1, arg2, arg3)/* JS('NativeInt8List', 'new Int8Array(#, #, #)', arg1, arg2, arg3) */;
    }

    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Uint16List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeUint16List extends Uint16Array implements Uint16List, NativeTypedArrayOfInt {
    protected constructor(length: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>);
    protected constructor(buffer: ByteBuffer, byteOffset: number, length?: number);
    protected constructor(buffer: ByteBuffer | number, byteOffset?: number, length?: number) {
        // @ts-ignore
        super(...arguments);
    }

    @namedFactory
    static _withLength(len: number): NativeUint16List {
        return NativeUint16List._create1(len);
    }

    static withLength: new(len: number) => Uint16List;

    @namedFactory
    static _fromList(list: core.DartList<number>): NativeUint16List {
        return NativeUint16List._create1(_ensureNativeList(list));
    }

    static fromList: new(list: core.DartList<number>) => NativeUint16List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeUint16List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint16List._create2(buffer, offsetInBytes) : NativeUint16List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeUint16List;


    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('JSUInt31', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeUint16List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint16List._create1(source);
    }

    static _create1(lenOrSource: number | ArrayBufferLike | ArrayLike<number> | core.DartList<number>): NativeUint16List {
        // TODO : Accept an array too, but how to create a ByteBuffer from a Float32Array ?
        if (typeof lenOrSource == 'number') {
            let buf = new ByteBuffer.withLength(lenOrSource * this.BYTES_PER_ELEMENT);
            return new NativeUint16List(buf, 0, lenOrSource);
        } else {
            return new NativeUint16List(lenOrSource)/* JS('NativeFloat32List', 'new Float32Array(#)', arg) */;
        }
    }

    static _create2(arg1: any, arg2: any): NativeUint16List {
        return new NativeUint16List(arg1, arg2)/* JS('NativeUint16List', 'new Uint16Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeUint16List {
        return new NativeUint16List(arg1, arg2, arg3)/* JS('NativeUint16List', 'new Uint16Array(#, #, #)', arg1, arg2, arg3) */;
    }


    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Uint32List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeUint32List extends Uint32Array implements Uint32List, NativeTypedArrayOfInt {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeUint32List {
        return NativeUint32List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeUint32List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeUint32List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint32List._create2(buffer, offsetInBytes) : NativeUint32List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeUint32List;

    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('JSUInt32', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeUint32List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint32List._create1(source);
    }

    static _create1(arg: any): NativeUint32List {
        return new NativeUint32List(arg)/* JS('NativeUint32List', 'new Uint32Array(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeUint32List {
        return new NativeUint32List(arg1, arg2)/* JS('NativeUint32List', 'new Uint32Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeUint32List {
        return new NativeUint32List(arg1, arg2, arg3)/* JS('NativeUint32List', 'new Uint32Array(#, #, #)', arg1, arg2, arg3) */;
    }


    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Uint8ClampedList)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeUint8ClampedList extends Uint8ClampedArray implements Uint8ClampedList, NativeTypedArrayOfInt {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);
    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeUint8ClampedList {
        return NativeUint8ClampedList._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeUint8ClampedList;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeUint8ClampedList {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint8ClampedList._create2(buffer, offsetInBytes) : NativeUint8ClampedList._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeUint8ClampedList;


    get length(): number {
        return this.length/* JS('JSUInt32', '#.length', this) */;
    }

    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('JSUInt31', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeUint8ClampedList', '#.subarray(#, #)', this, start, end) */;
        return NativeUint8ClampedList._create1(source);
    }

    static _create1(arg: any): NativeUint8ClampedList {
        return new NativeUint8ClampedList(arg)/* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeUint8ClampedList {
        return new NativeUint8ClampedList(arg1, arg2)/* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeUint8ClampedList {
        return new NativeUint8ClampedList(arg1, arg2, arg3)/* JS('NativeUint8ClampedList', 'new Uint8ClampedArray(#, #, #)', arg1, arg2, arg3) */;
    }


    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Uint8List)
@With(NativeTypedArrayOfInt)
@AbstractSymbols(OperatorMethods.INDEX_EQ, Symbol.iterator)
export class NativeUint8List extends Uint8Array implements Uint8List, NativeTypedArrayOfInt {
    constructor(...args: any[]) {
        // @ts-ignore
        super(...args);

    }

    @namedFactory
    static _fromList(elements: core.DartList<number>): NativeUint8List {
        return NativeUint8List._create1(_ensureNativeList(elements));
    }

    static fromList: new(elements: core.DartList<number>) => NativeUint8List;

    @namedFactory
    static _view(buffer: ByteBuffer, offsetInBytes: number, length: number): NativeUint8List {
        _checkViewArguments(buffer, offsetInBytes, length);
        return length == null ? NativeUint8List._create2(buffer, offsetInBytes) : NativeUint8List._create3(buffer, offsetInBytes, length);
    }

    static view: new(buffer: ByteBuffer, offsetInBytes: number, length: number) => NativeUint8List;

    get length(): number {
        return this.length/* JS('JSUInt32', '#.length', this) */;
    }

    [OperatorMethods.INDEX](index: number): number {
        _checkValidIndex(index, this, this.length);
        return this[index]/* JS('JSUInt31', '#[#]', this, index) */;
    }

    sublist(start: number, end?: number): core.DartList<number> {
        end = _checkValidRange(start, end, this.length);
        let source = this.subarray(start, end)/* JS('NativeUint8List', '#.subarray(#, #)', this, start, end) */;
        return NativeUint8List._create1(source);
    }


    static _create1(arg: any): NativeUint8List {
        return new NativeUint8List(arg)/* JS('NativeUint8List', 'new Uint8Array(#)', arg) */;
    }

    static _create2(arg1: any, arg2: any): NativeUint8List {
        return new NativeUint8List(arg1, arg2)/* JS('NativeUint8List', 'new Uint8Array(#, #)', arg1, arg2) */;
    }

    static _create3(arg1: any, arg2: any, arg3: any): NativeUint8List {
        return new NativeUint8List(arg1, arg2, arg3)/* JS('NativeUint8List', 'new Uint8Array(#, #, #)', arg1, arg2, arg3) */;
    }


    [OperatorMethods.INDEX_EQ](number: int, value: int) {

    }

    @Abstract
    get buffer(): ByteBuffer {
        return super.buffer as ByteBuffer;
    }

    @Abstract
    add(element: number): void {
    }

    @Abstract
    addAll(iterable: core.DartIterable<number>): void {
    }

    @Abstract
    any(test: (element: number) => bool): bool {
        return undefined;
    }

    @Abstract
    asMap(): core.DartMap<int, number> {
        return undefined;
    }

    @Abstract
    clear(): void {
    }

    @Abstract
    contains(element: any): bool {
        return undefined;
    }

    @Abstract
    elementAt(index: int): number {
        return undefined;
    }

    @AbstractProperty
    get elementSizeInBytes(): number {
        return 0;
    }

    @Abstract
    expand<T>(f: (element: number) => core.DartIterable<T>): core.DartIterable<T> {
        return undefined;
    }

    @Abstract
    fillRange(start: int, end: int, fill?: number): void {
    }

    @AbstractProperty
    get first(): number {
        return undefined;
    }

    @Abstract
    firstWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @Abstract
    fold<T>(initialValue: T, combine: (previousValue: T, element: number) => T): T {
        return undefined;
    }

    @Abstract
    getRange(start: int, end: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    insert(index: int, element: number): void {
    }

    @Abstract
    insertAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @AbstractProperty
    get isEmpty(): boolean {
        return undefined;
    }

    @AbstractProperty
    get isNotEmpty(): bool {
        return undefined;
    }

    @AbstractProperty
    get iterator(): core.DartIterator<number> {
        return undefined;
    }

    @AbstractProperty
    get last(): number {
        return undefined;
    }

    @Abstract
    lastWhere(test: (element: number) => bool, _?: { orElse?: () => number }): number {
        return undefined;
    }

    @AbstractProperty
    get lengthInBytes(): number {
        return 0;
    }

    map(...args: any[])
    @Abstract
    map(f: (element: number, index?: number, array?: Uint8Array) => number, thisArg?: any): core.DartIterable<number> | Uint8Array {
        return undefined;
    }

    @AbstractProperty
    get offsetInBytes(): number {
        return 0;
    }

    @Abstract
    remove(element: any): bool {
        return undefined;
    }

    @Abstract
    removeAt(index: int): number {
        return undefined;
    }

    @Abstract
    removeLast(): number {
        return undefined;
    }

    @Abstract
    removeRange(start: int, end: int): void {
    }

    @Abstract
    removeWhere(test: (element: number) => bool): void {
    }

    @Abstract
    replaceRange(start: int, end: int, newContents: core.DartIterable<number>): void {
    }

    @Abstract
    retainWhere(test: (element: number) => bool): void {
    }

    @AbstractProperty
    get reversed(): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    setAll(index: int, iterable: core.DartIterable<number>): void {
    }

    @Abstract
    setRange(start: int, end: int, iterable: core.DartIterable<number>, skipCount?: int): void {
    }

    @Abstract
    shuffle(random?: core.DartRandom): void {
    }

    @AbstractProperty
    get single(): number {
        return undefined;
    }

    @Abstract
    singleWhere(test: (element: number) => bool): number {
        return undefined;
    }

    @Abstract
    skip(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    skipWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    take(count: int): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    takeWhile(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    toList(_?: { growable: bool }): core.DartList<number> {
        return undefined;
    }

    @Abstract
    toSet(): core.DartSet<number> {
        return undefined;
    }

    @Abstract
    where(test: (element: number) => bool): core.DartIterable<number> {
        return undefined;
    }

    @Abstract
    _checkPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _invalidPosition(position: number, length: number, name: string): void {
    }

    @Abstract
    _setRangeFast(start: number, end: number, source: NativeTypedArray, skipCount: number): void {
    }
}

@DartClass
@Implements(Float32x4)
export class NativeFloat32x4 implements Float32x4 {
    x: double;
    y: double;
    z: double;
    w: double;
    static _list: NativeFloat32List = new NativeFloat32List.withLength(4);
    static _uint32view: Uint32List = NativeFloat32x4._list.buffer.asUint32List();

    static _truncate(x: any) {
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 0, x);
        return op(Op.INDEX, NativeFloat32x4._list, 0);
    }

    constructor(x: double, y: double, z: double, w: double) {
    }

    @defaultConstructor
    NativeFloat32x4(x: double, y: double, z: double, w: double) {
        this.x = NativeFloat32x4._truncate(x);
        this.y = NativeFloat32x4._truncate(y);
        this.z = NativeFloat32x4._truncate(z);
        this.w = NativeFloat32x4._truncate(w);
        if (isNot(x, "number")) throw new core.ArgumentError(x);
        if (isNot(y, "number")) throw new core.ArgumentError(y);
        if (isNot(z, "number")) throw new core.ArgumentError(z);
        if (isNot(w, "number")) throw new core.ArgumentError(w);
    }

    @namedConstructor
    splat(v: double) {
        this.NativeFloat32x4(v, v, v, v);
    }

    static splat: new(v: double) => NativeFloat32x4;

    @namedConstructor
    zero() {
        this._truncated(0.0, 0.0, 0.0, 0.0);
    }

    static zero: new() => NativeFloat32x4;

    @namedFactory
    static _fromInt32x4Bits(i: Int32x4): NativeFloat32x4 {
        op(Op.INDEX_ASSIGN, NativeFloat32x4._uint32view, 0, i.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._uint32view, 1, i.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._uint32view, 2, i.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._uint32view, 3, i.w);
        return new NativeFloat32x4._truncated(op(Op.INDEX, NativeFloat32x4._list, 0), op(Op.INDEX, NativeFloat32x4._list, 1), op(Op.INDEX, NativeFloat32x4._list, 2), op(Op.INDEX, NativeFloat32x4._list, 3));
    }

    static fromInt32x4Bits: new(i: Int32x4) => NativeFloat32x4;

    @namedConstructor
    fromFloat64x2(v: Float64x2) {
        this._truncated(NativeFloat32x4._truncate(v.x), NativeFloat32x4._truncate(v.y), 0.0, 0.0);
    }

    static fromFloat64x2: new(v: Float64x2) => NativeFloat32x4;

    @namedConstructor
    _doubles(x: double, y: double, z: double, w: double) {
        this.x = NativeFloat32x4._truncate(x);
        this.y = NativeFloat32x4._truncate(y);
        this.z = NativeFloat32x4._truncate(z);
        this.w = NativeFloat32x4._truncate(w);
    }

    static _doubles: new(x: double, y: double, z: double, w: double) => NativeFloat32x4;

    @namedConstructor
    _truncated(x: double, y: double, z: double, w: double) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static _truncated: new(x: double, y: double, z: double, w: double) => NativeFloat32x4;

    toString(): string {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }

    [OperatorMethods.PLUS](other: Float32x4): Float32x4 {
        let _x: double = this.x + other.x;
        let _y: double = this.y + other.y;
        let _z: double = this.z + other.z;
        let _w: double = this.w + other.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    [OperatorMethods.NEGATE](): Float32x4 {
        return new NativeFloat32x4._truncated(-this.x, -this.y, -this.z, -this.w);
    }

    [OperatorMethods.MINUS](other: Float32x4): Float32x4 {
        let _x: double = this.x - other.x;
        let _y: double = this.y - other.y;
        let _z: double = this.z - other.z;
        let _w: double = this.w - other.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    [OperatorMethods.MULTIPLY](other: Float32x4): Float32x4 {
        let _x: double = this.x * other.x;
        let _y: double = this.y * other.y;
        let _z: double = this.z * other.z;
        let _w: double = this.w * other.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    [OperatorMethods.DIVIDE](other: Float32x4): Float32x4 {
        let _x: double = this.x / other.x;
        let _y: double = this.y / other.y;
        let _z: double = this.z / other.z;
        let _w: double = this.w / other.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    lessThan(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x < other.x;
        let _cy: boolean = this.y < other.y;
        let _cz: boolean = this.z < other.z;
        let _cw: boolean = this.w < other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    lessThanOrEqual(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x <= other.x;
        let _cy: boolean = this.y <= other.y;
        let _cz: boolean = this.z <= other.z;
        let _cw: boolean = this.w <= other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    greaterThan(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x > other.x;
        let _cy: boolean = this.y > other.y;
        let _cz: boolean = this.z > other.z;
        let _cw: boolean = this.w > other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    greaterThanOrEqual(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x >= other.x;
        let _cy: boolean = this.y >= other.y;
        let _cz: boolean = this.z >= other.z;
        let _cw: boolean = this.w >= other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    equal(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x == other.x;
        let _cy: boolean = this.y == other.y;
        let _cz: boolean = this.z == other.z;
        let _cw: boolean = this.w == other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    notEqual(other: Float32x4): Int32x4 {
        let _cx: boolean = this.x != other.x;
        let _cy: boolean = this.y != other.y;
        let _cz: boolean = this.z != other.z;
        let _cw: boolean = this.w != other.w;
        return new NativeInt32x4._truncated(_cx ? -1 : 0, _cy ? -1 : 0, _cz ? -1 : 0, _cw ? -1 : 0);
    }

    scale(s: double): Float32x4 {
        let _x: double = s * this.x;
        let _y: double = s * this.y;
        let _z: double = s * this.z;
        let _w: double = s * this.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    abs(): Float32x4 {
        let _x: double = new core.DartDouble(this.x).abs();
        let _y: double = new core.DartDouble(this.y).abs();
        let _z: double = new core.DartDouble(this.z).abs();
        let _w: double = new core.DartDouble(this.w).abs();
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    clamp(lowerLimit: Float32x4, upperLimit: Float32x4): Float32x4 {
        let _lx: double = lowerLimit.x;
        let _ly: double = lowerLimit.y;
        let _lz: double = lowerLimit.z;
        let _lw: double = lowerLimit.w;
        let _ux: double = upperLimit.x;
        let _uy: double = upperLimit.y;
        let _uz: double = upperLimit.z;
        let _uw: double = upperLimit.w;
        let _x: double = this.x;
        let _y: double = this.y;
        let _z: double = this.z;
        let _w: double = this.w;
        _x = _x > _ux ? _ux : _x;
        _y = _y > _uy ? _uy : _y;
        _z = _z > _uz ? _uz : _z;
        _w = _w > _uw ? _uw : _w;
        _x = _x < _lx ? _lx : _x;
        _y = _y < _ly ? _ly : _y;
        _z = _z < _lz ? _lz : _z;
        _w = _w < _lw ? _lw : _w;
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    get signMask(): number {
        let view = NativeFloat32x4._uint32view;
        let mx, my, mz, mw;
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 3, this.w);
        mx = (op(Op.INDEX, view, 0) & 2147483648) >> 31;
        my = (op(Op.INDEX, view, 1) & 2147483648) >> 30;
        mz = (op(Op.INDEX, view, 2) & 2147483648) >> 29;
        mw = (op(Op.INDEX, view, 3) & 2147483648) >> 28;
        return mx | my | mz | mw;
    }

    shuffle(mask: number): Float32x4 {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 3, this.w);
        let _x: double = op(Op.INDEX, NativeFloat32x4._list, mask & 3);
        let _y: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 2) & 3);
        let _z: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 4) & 3);
        let _w: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 6) & 3);
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    shuffleMix(other: Float32x4, mask: number): Float32x4 {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 3, this.w);
        let _x: double = op(Op.INDEX, NativeFloat32x4._list, mask & 3);
        let _y: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 2) & 3);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 0, other.x);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 1, other.y);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 2, other.z);
        op(Op.INDEX_ASSIGN, NativeFloat32x4._list, 3, other.w);
        let _z: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 4) & 3);
        let _w: double = op(Op.INDEX, NativeFloat32x4._list, (mask >> 6) & 3);
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    withX(newX: double): Float32x4 {
        return new NativeFloat32x4._truncated(NativeFloat32x4._truncate(newX), this.y, this.z, this.w);
    }

    withY(newY: double): Float32x4 {
        return new NativeFloat32x4._truncated(this.x, NativeFloat32x4._truncate(newY), this.z, this.w);
    }

    withZ(newZ: double): Float32x4 {
        return new NativeFloat32x4._truncated(this.x, this.y, NativeFloat32x4._truncate(newZ), this.w);
    }

    withW(newW: double): Float32x4 {
        return new NativeFloat32x4._truncated(this.x, this.y, this.z, NativeFloat32x4._truncate(newW));
    }

    min(other: Float32x4): Float32x4 {
        let _x: double = this.x < other.x ? this.x : other.x;
        let _y: double = this.y < other.y ? this.y : other.y;
        let _z: double = this.z < other.z ? this.z : other.z;
        let _w: double = this.w < other.w ? this.w : other.w;
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    max(other: Float32x4): Float32x4 {
        let _x: double = this.x > other.x ? this.x : other.x;
        let _y: double = this.y > other.y ? this.y : other.y;
        let _z: double = this.z > other.z ? this.z : other.z;
        let _w: double = this.w > other.w ? this.w : other.w;
        return new NativeFloat32x4._truncated(_x, _y, _z, _w);
    }

    sqrt(): Float32x4 {
        let _x: double = math.sqrt(this.x);
        let _y: double = math.sqrt(this.y);
        let _z: double = math.sqrt(this.z);
        let _w: double = math.sqrt(this.w);
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    reciprocal(): Float32x4 {
        let _x: double = 1.0 / this.x;
        let _y: double = 1.0 / this.y;
        let _z: double = 1.0 / this.z;
        let _w: double = 1.0 / this.w;
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }

    reciprocalSqrt(): Float32x4 {
        let _x: double = math.sqrt(1.0 / this.x);
        let _y: double = math.sqrt(1.0 / this.y);
        let _z: double = math.sqrt(1.0 / this.z);
        let _w: double = math.sqrt(1.0 / this.w);
        return new NativeFloat32x4._doubles(_x, _y, _z, _w);
    }
}

@DartClass
@Implements(Int32x4)
export class NativeInt32x4 implements Int32x4 {
    x: number;
    y: number;
    z: number;
    w: number;
    static _list = new NativeInt32List(4);

    static _truncate(x: any) {
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 0, x);
        return op(Op.INDEX, NativeInt32x4._list, 0);
    }

    constructor(x: number, y: number, z: number, w: number) {
    }

    @defaultConstructor
    NativeInt32x4(x: number, y: number, z: number, w: number) {
        this.x = NativeInt32x4._truncate(x);
        this.y = NativeInt32x4._truncate(y);
        this.z = NativeInt32x4._truncate(z);
        this.w = NativeInt32x4._truncate(w);
        if (x != this.x && is(x, "number")) throw new core.ArgumentError(x);
        if (y != this.y && is(y, "number")) throw new core.ArgumentError(y);
        if (z != this.z && is(z, "number")) throw new core.ArgumentError(z);
        if (w != this.w && is(w, "number")) throw new core.ArgumentError(w);
    }

    @namedConstructor
    bool(x: boolean, y: boolean, z: boolean, w: boolean) {
        this.x = x ? -1 : 0;
        this.y = y ? -1 : 0;
        this.z = z ? -1 : 0;
        this.w = w ? -1 : 0;
    }

    static bool: new(x: boolean, y: boolean, z: boolean, w: boolean) => NativeInt32x4;

    @namedFactory
    static _fromFloat32x4Bits(f: Float32x4): NativeInt32x4 {
        let floatList: NativeFloat32List = NativeFloat32x4._list;
        op(Op.INDEX_ASSIGN, floatList, 0, f.x);
        op(Op.INDEX_ASSIGN, floatList, 1, f.y);
        op(Op.INDEX_ASSIGN, floatList, 2, f.z);
        op(Op.INDEX_ASSIGN, floatList, 3, f.w);
        let view: NativeInt32List = floatList.buffer.asInt32List();
        return new NativeInt32x4._truncated(op(Op.INDEX, view, 0), op(Op.INDEX, view, 1), op(Op.INDEX, view, 2), op(Op.INDEX, view, 3));
    }

    static fromFloat32x4Bits: new(f: Float32x4) => NativeInt32x4;

    @namedConstructor
    _truncated(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static _truncated: new(x: number, y: number, z: number, w: number) => NativeInt32x4;

    toString(): string {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }

    [OperatorMethods.BINARY_OR](other: Int32x4): Int32x4 {
        return new NativeInt32x4._truncated(this.x | other.x/* JS("int", "# | #", x, other.x) */, this.y | other.y/* JS("int", "# | #", y, other.y) */, this.z | other.z/* JS("int", "# | #", z, other.z) */, this.w | other.w/* JS("int", "# | #", w, other.w) */);
    }

    [OperatorMethods.BINARY_AND](other: Int32x4): Int32x4 {
        return new NativeInt32x4._truncated(this.x & other.x/* JS("int", "# & #", x, other.x) */, this.y & other.y/* JS("int", "# & #", y, other.y) */, this.z & other.z/* JS("int", "# & #", z, other.z) */, this.w & other.w/* JS("int", "# & #", w, other.w) */);
    }

    [OperatorMethods.XOR](other: Int32x4): Int32x4 {
        return new NativeInt32x4._truncated(this.x ^ other.x/* JS("int", "# ^ #", x, other.x) */, this.y ^ other.y/* JS("int", "# ^ #", y, other.y) */, this.z ^ other.z/* JS("int", "# ^ #", z, other.z) */, this.w ^ other.w/* JS("int", "# ^ #", w, other.w) */);
    }

    [OperatorMethods.PLUS](other: Int32x4): Int32x4 {
        return new NativeInt32x4._truncated((this.x + other.x) | 0/* JS("int", "(# + #) | 0", x, other.x) */, (this.y + other.y) | 0/* JS("int", "(# + #) | 0", y, other.y) */, (this.z + other.z) | 0/* JS("int", "(# + #) | 0", z, other.z) */, (this.w + other.w) | 0/* JS("int", "(# + #) | 0", w, other.w) */);
    }

    [OperatorMethods.MINUS](other: Int32x4): Int32x4 {
        return new NativeInt32x4._truncated((this.x - other.x) | 0/* JS("int", "(# - #) | 0", x, other.x) */, (this.y - other.y) | 0/* JS("int", "(# - #) | 0", y, other.y) */, (this.z - other.z) | 0/* JS("int", "(# - #) | 0", z, other.z) */, (this.w - other.w) | 0/* JS("int", "(# - #) | 0", w, other.w) */);
    }

    [OperatorMethods.NEGATE](): Int32x4 {
        return new NativeInt32x4._truncated((-this.x) | 0/* JS("int", "(-#) | 0", x) */, (-this.y) | 0/* JS("int", "(-#) | 0", y) */, (-this.z) | 0/* JS("int", "(-#) | 0", z) */, (-this.w) | 0/* JS("int", "(-#) | 0", w) */);
    }

    get signMask(): number {
        let mx: number = (this.x & 2147483648) >> 31;
        let my: number = (this.y & 2147483648) >> 31;
        let mz: number = (this.z & 2147483648) >> 31;
        let mw: number = (this.w & 2147483648) >> 31;
        return mx | my << 1 | mz << 2 | mw << 3;
    }

    shuffle(mask: number): Int32x4 {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 3, this.w);
        let _x: number = op(Op.INDEX, NativeInt32x4._list, mask & 3);
        let _y: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 2) & 3);
        let _z: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 4) & 3);
        let _w: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 6) & 3);
        return new NativeInt32x4._truncated(_x, _y, _z, _w);
    }

    shuffleMix(other: Int32x4, mask: number): Int32x4 {
        if ((mask < 0) || (mask > 255)) {
            throw new core.RangeError.range(mask, 0, 255, "mask");
        }
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 1, this.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 2, this.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 3, this.w);
        let _x: number = op(Op.INDEX, NativeInt32x4._list, mask & 3);
        let _y: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 2) & 3);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 0, other.x);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 1, other.y);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 2, other.z);
        op(Op.INDEX_ASSIGN, NativeInt32x4._list, 3, other.w);
        let _z: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 4) & 3);
        let _w: number = op(Op.INDEX, NativeInt32x4._list, (mask >> 6) & 3);
        return new NativeInt32x4._truncated(_x, _y, _z, _w);
    }

    withX(x: number): Int32x4 {
        let _x: number = NativeInt32x4._truncate(x);
        return new NativeInt32x4._truncated(_x, this.y, this.z, this.w);
    }

    withY(y: number): Int32x4 {
        let _y: number = NativeInt32x4._truncate(y);
        return new NativeInt32x4._truncated(this.x, _y, this.z, this.w);
    }

    withZ(z: number): Int32x4 {
        let _z: number = NativeInt32x4._truncate(z);
        return new NativeInt32x4._truncated(this.x, this.y, _z, this.w);
    }

    withW(w: number): Int32x4 {
        let _w: number = NativeInt32x4._truncate(w);
        return new NativeInt32x4._truncated(this.x, this.y, this.z, _w);
    }

    get flagX(): boolean {
        return this.x != 0;
    }

    get flagY(): boolean {
        return this.y != 0;
    }

    get flagZ(): boolean {
        return this.z != 0;
    }

    get flagW(): boolean {
        return this.w != 0;
    }

    withFlagX(flagX: boolean): Int32x4 {
        let _x: number = flagX ? -1 : 0;
        return new NativeInt32x4._truncated(_x, this.y, this.z, this.w);
    }

    withFlagY(flagY: boolean): Int32x4 {
        let _y: number = flagY ? -1 : 0;
        return new NativeInt32x4._truncated(this.x, _y, this.z, this.w);
    }

    withFlagZ(flagZ: boolean): Int32x4 {
        let _z: number = flagZ ? -1 : 0;
        return new NativeInt32x4._truncated(this.x, this.y, _z, this.w);
    }

    withFlagW(flagW: boolean): Int32x4 {
        let _w: number = flagW ? -1 : 0;
        return new NativeInt32x4._truncated(this.x, this.y, this.z, _w);
    }

    select(trueValue: Float32x4, falseValue: Float32x4): Float32x4 {
        let floatList = NativeFloat32x4._list;
        let intView = NativeFloat32x4._uint32view;
        op(Op.INDEX_ASSIGN, floatList, 0, trueValue.x);
        op(Op.INDEX_ASSIGN, floatList, 1, trueValue.y);
        op(Op.INDEX_ASSIGN, floatList, 2, trueValue.z);
        op(Op.INDEX_ASSIGN, floatList, 3, trueValue.w);
        let stx: number = op(Op.INDEX, intView, 0);
        let sty: number = op(Op.INDEX, intView, 1);
        let stz: number = op(Op.INDEX, intView, 2);
        let stw: number = op(Op.INDEX, intView, 3);
        op(Op.INDEX_ASSIGN, floatList, 0, falseValue.x);
        op(Op.INDEX_ASSIGN, floatList, 1, falseValue.y);
        op(Op.INDEX_ASSIGN, floatList, 2, falseValue.z);
        op(Op.INDEX_ASSIGN, floatList, 3, falseValue.w);
        let sfx: number = op(Op.INDEX, intView, 0);
        let sfy: number = op(Op.INDEX, intView, 1);
        let sfz: number = op(Op.INDEX, intView, 2);
        let sfw: number = op(Op.INDEX, intView, 3);
        let _x: number = (this.x & stx) | (~this.x & sfx);
        let _y: number = (this.y & sty) | (~this.y & sfy);
        let _z: number = (this.z & stz) | (~this.z & sfz);
        let _w: number = (this.w & stw) | (~this.w & sfw);
        op(Op.INDEX_ASSIGN, intView, 0, _x);
        op(Op.INDEX_ASSIGN, intView, 1, _y);
        op(Op.INDEX_ASSIGN, intView, 2, _z);
        op(Op.INDEX_ASSIGN, intView, 3, _w);
        return new NativeFloat32x4._truncated(op(Op.INDEX, floatList, 0), op(Op.INDEX, floatList, 1), op(Op.INDEX, floatList, 2), op(Op.INDEX, floatList, 3));
    }
}

@DartClass
@Implements(Float64x2)
export class NativeFloat64x2 implements Float64x2 {
    x: double;
    y: double;
    static _list: NativeFloat64List = new NativeFloat64List.withLength(2);
    static _uint32View: NativeUint32List = NativeFloat64x2._list.buffer.asUint32List();

    constructor(x: double, y: double) {
    }

    @defaultConstructor
    NativeFloat64x2(x: double, y: double) {
        this.x = x;
        this.y = y;
        if (is(this.x, "number")) throw new core.ArgumentError(this.x);
        if (is(this.y, "number")) throw new core.ArgumentError(this.y);
    }

    @namedConstructor
    splat(v: double) {
        this.NativeFloat64x2(v, v);
    }

    static splat: new(v: double) => NativeFloat64x2;

    @namedConstructor
    zero() {
        this.splat(0.0);
    }

    static zero: new() => NativeFloat64x2;

    @namedConstructor
    fromFloat32x4(v: Float32x4) {
        this.NativeFloat64x2(v.x, v.y);
    }

    static fromFloat32x4: new(v: Float32x4) => NativeFloat64x2;

    @namedConstructor
    _doubles(x: double, y: double) {
        this.x = x;
        this.y = y;
    }

    static _doubles: new(x: double, y: double) => NativeFloat64x2;

    toString(): string {
        return `[${this.x}, ${this.y}]`;
    }

    [OperatorMethods.PLUS](other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x + other.x, this.y + other.y);
    }

    [OperatorMethods.NEGATE](): Float64x2 {
        return new NativeFloat64x2._doubles(-this.x, -this.y);
    }

    [OperatorMethods.MINUS](other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x - other.x, this.y - other.y);
    }

    [OperatorMethods.MULTIPLY](other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x * other.x, this.y * other.y);
    }

    [OperatorMethods.DIVIDE](other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x / other.x, this.y / other.y);
    }

    scale(s: double): Float64x2 {
        return new NativeFloat64x2._doubles(this.x * s, this.y * s);
    }

    abs(): Float64x2 {
        return new NativeFloat64x2._doubles(new core.DartDouble(this.x).abs(), new core.DartDouble(this.y).abs());
    }

    clamp(lowerLimit: Float64x2, upperLimit: Float64x2): Float64x2 {
        let _lx: double = lowerLimit.x;
        let _ly: double = lowerLimit.y;
        let _ux: double = upperLimit.x;
        let _uy: double = upperLimit.y;
        let _x: double = this.x;
        let _y: double = this.y;
        _x = _x > _ux ? _ux : _x;
        _y = _y > _uy ? _uy : _y;
        _x = _x < _lx ? _lx : _x;
        _y = _y < _ly ? _ly : _y;
        return new NativeFloat64x2._doubles(_x, _y);
    }

    get signMask(): number {
        let view = NativeFloat64x2._uint32View;
        op(Op.INDEX_ASSIGN, NativeFloat64x2._list, 0, this.x);
        op(Op.INDEX_ASSIGN, NativeFloat64x2._list, 1, this.y);
        let mx = (op(Op.INDEX, view, 1) & 2147483648) >> 31;
        let my = (op(Op.INDEX, view, 3) & 2147483648) >> 31;
        return mx | my << 1;
    }

    withX(x: double): Float64x2 {
        if (is(x, "number")) throw new core.ArgumentError(x);
        return new NativeFloat64x2._doubles(x, this.y);
    }

    withY(y: double): Float64x2 {
        if (is(y, "number")) throw new core.ArgumentError(y);
        return new NativeFloat64x2._doubles(this.x, y);
    }

    min(other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x < other.x ? this.x : other.x, this.y < other.y ? this.y : other.y);
    }

    max(other: Float64x2): Float64x2 {
        return new NativeFloat64x2._doubles(this.x > other.x ? this.x : other.x, this.y > other.y ? this.y : other.y);
    }

    sqrt(): Float64x2 {
        return new NativeFloat64x2._doubles(math.sqrt(this.x), math.sqrt(this.y));
    }
}

export var _isInvalidArrayIndex: (index: number) => boolean = (index: number): boolean => {
    return ((index >>> 0 !== index)/* JS('bool', '(# >>> 0 !== #)', index, index) */);
};
export var _checkValidIndex: (index: number, list: core.DartList<any>, length: number) => void = (index: number, list: core.DartList<any>, length: number): void => {
    if (_isInvalidArrayIndex(index) || index/* JS('int', '#', index) */ >= length) {
        throw core.diagnoseIndexError(list, index);
    }
};
export var _checkValidRange: (start: number, end: number, length: number) => number = (start: number, end: number, length: number): number => {
    if (_isInvalidArrayIndex(start) || ((end == null) ? start > length : (_isInvalidArrayIndex(end) || start > end || end > length))) {
        throw core.diagnoseRangeError(start, end, length);
    }
    if (end == null) return length;
    return end;
};

@DartClass
export class Endianness {
    @namedConstructor
    _(_littleEndian: boolean) {
        this._littleEndian = _littleEndian;
    }

    static _: new(_littleEndian: boolean) => Endianness;
    static BIG_ENDIAN: Endianness;
    static LITTLE_ENDIAN: Endianness;
    static HOST_ENDIAN: Endianness;
    _littleEndian: boolean;
}

// Init later because of decorators needs to apply first.
Endianness.BIG_ENDIAN = new Endianness._(false);
Endianness.LITTLE_ENDIAN = new Endianness._(true);
Endianness.HOST_ENDIAN = (new ByteData.view(new Uint16List.fromList(new core.DartList.literal(1)).buffer)).getInt8(0) == 1 ? Endianness.LITTLE_ENDIAN : Endianness.BIG_ENDIAN;

export class _Properties {
}

export const properties: _Properties = new _Properties();
