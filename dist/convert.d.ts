import { OperatorMethods } from "./utils";
import * as core from "./core";
import * as async from "./async";
import * as typed_data from "./typed_data";
export declare class Codec<S, T> {
    constructor();
    Codec(): void;
    encode(input: S): T;
    decode(encoded: T): S;
    readonly encoder: Converter<S, T>;
    readonly decoder: Converter<T, S>;
    fuse<R>(other: Codec<T, R>): Codec<S, R>;
    readonly inverted: Codec<T, S>;
}
export declare class Encoding extends Codec<string, core.DartList<number>> {
    constructor();
    Encoding(): void;
    readonly encoder: Converter<string, core.DartList<number>>;
    readonly decoder: Converter<core.DartList<number>, string>;
    decodeStream(byteStream: async.DartStream<core.DartList<number>>): async.Future<string>;
    readonly name: string;
    static _nameToEncoding: core.DartMap<string, Encoding>;
    static getByName(name: string): Encoding;
}
export declare class Converter<S, T> implements async.DartStreamTransformer<S, T> {
    constructor();
    Converter(): void;
    convert(input: S): T;
    fuse<TT>(other: Converter<T, TT>): Converter<S, TT>;
    startChunkedConversion(sink: core.DartSink<any>): core.DartSink<any>;
    bind(stream: async.DartStream<S>): async.DartStream<T>;
}
export declare class AsciiCodec extends Encoding {
    _allowInvalid: boolean;
    constructor(_namedArguments?: {
        allowInvalid?: boolean;
    });
    AsciiCodec(_namedArguments?: {
        allowInvalid?: boolean;
    }): void;
    readonly name: string;
    decode(bytes: core.DartList<number>, _namedArguments?: {
        allowInvalid?: boolean;
    }): string;
    readonly encoder: AsciiEncoder;
    readonly decoder: AsciiDecoder;
}
export declare class _UnicodeSubsetEncoder extends Converter<string, core.DartList<number>> {
    _subsetMask: number;
    constructor(_subsetMask: number);
    _UnicodeSubsetEncoder(_subsetMask: number): void;
    convert(string: string, start?: number, end?: number): core.DartList<number>;
    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink;
    bind(stream: async.DartStream<string>): async.DartStream<core.DartList<number>>;
}
export declare class AsciiEncoder extends _UnicodeSubsetEncoder {
    constructor();
    AsciiEncoder(): void;
}
export declare class ChunkedConversionSink<T> implements core.DartSink<T> {
    constructor();
    ChunkedConversionSink(): void;
    static _withCallback<T>(callback: <T>(accumulated: core.DartList<T>) => void): ChunkedConversionSink<T>;
    static withCallback: new <T>(callback: <T>(accumulated: core.DartList<T>) => void) => ChunkedConversionSink<T>;
    add(chunk: T): void;
    close(): void;
}
export declare class StringConversionSink extends ChunkedConversionSink<string> {
    constructor();
    StringConversionSink(): void;
    static _withCallbackString(callback: (accumulated: string) => void): StringConversionSink;
    static withCallbackString: new (callback: (accumulated: string) => void) => StringConversionSink;
    static _from(sink: core.DartSink<string>): StringConversionSink;
    static from: new (sink: core.DartSink<string>) => StringConversionSink;
    static _fromStringSink(sink: core.DartStringSink): StringConversionSink;
    static fromStringSink: new (sink: core.DartStringSink) => StringConversionSink;
    addSlice(chunk: string, start: number, end: number, isLast: boolean): void;
    asUtf8Sink(allowMalformed: boolean): ByteConversionSink;
    asStringSink(): ClosableStringSink;
}
export declare class StringConversionSinkMixin extends StringConversionSink {
    addSlice(str: string, start: number, end: number, isLast: boolean): void;
    close(): void;
    add(str: string): void;
    asUtf8Sink(allowMalformed: boolean): ByteConversionSink;
    asStringSink(): ClosableStringSink;
}
export declare class StringConversionSinkBase extends StringConversionSinkMixin {
}
export declare class _UnicodeSubsetEncoderSink extends StringConversionSinkBase {
    _sink: ByteConversionSink;
    _subsetMask: number;
    constructor(_subsetMask: number, _sink: ByteConversionSink);
    _UnicodeSubsetEncoderSink(_subsetMask: number, _sink: ByteConversionSink): void;
    close(): void;
    addSlice(source: string, start: number, end: number, isLast: boolean): void;
}
export declare class _UnicodeSubsetDecoder extends Converter<core.DartList<number>, string> {
    _allowInvalid: boolean;
    _subsetMask: number;
    constructor(_allowInvalid: boolean, _subsetMask: number);
    _UnicodeSubsetDecoder(_allowInvalid: boolean, _subsetMask: number): void;
    convert(bytes: core.DartList<number>, start?: number, end?: number): string;
    _convertInvalid(bytes: core.DartList<number>, start: number, end: number): string;
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink;
    bind(stream: async.DartStream<core.DartList<number>>): async.DartStream<string>;
}
export declare class AsciiDecoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments?: {
        allowInvalid?: boolean;
    });
    AsciiDecoder(_namedArguments?: {
        allowInvalid?: boolean;
    }): void;
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink;
}
export declare class ByteConversionSink extends ChunkedConversionSink<core.DartList<number>> {
    constructor();
    ByteConversionSink(): void;
    static _withCallbackBinary(callback: (accumulated: core.DartList<number>) => void): ByteConversionSink;
    static withCallbackBinary: new (callback: (accumulated: any) => void) => ByteConversionSink;
    static _from(sink: core.DartSink<core.DartList<number>>): ByteConversionSink;
    static from: new (sink: core.DartSink<core.DartList<number>>) => ByteConversionSink;
    addSlice(chunk: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class ByteConversionSinkBase extends ByteConversionSink {
    add(chunk: core.DartList<number>): void;
    close(): void;
    addSlice(chunk: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class _ErrorHandlingAsciiDecoderSink extends ByteConversionSinkBase {
    _utf8Sink: ByteConversionSink;
    constructor(_utf8Sink: ByteConversionSink);
    _ErrorHandlingAsciiDecoderSink(_utf8Sink: ByteConversionSink): void;
    close(): void;
    add(source: core.DartList<number>): void;
    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class _SimpleAsciiDecoderSink extends ByteConversionSinkBase {
    _sink: core.DartSink<any>;
    constructor(_sink: core.DartSink<any>);
    _SimpleAsciiDecoderSink(_sink: core.DartSink<any>): void;
    close(): void;
    add(source: core.DartList<number>): void;
    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class Base64Codec extends Codec<core.DartList<number>, string> {
    _encoder: Base64Encoder;
    constructor();
    Base64Codec(): void;
    urlSafe(): void;
    static urlSafe: new () => Base64Codec;
    readonly encoder: Base64Encoder;
    readonly decoder: Base64Decoder;
    normalize(source: string, start?: number, end?: number): string;
    static _checkPadding(source: string, sourceIndex: number, sourceEnd: number, firstPadding: number, paddingCount: number, length: number): void;
}
export declare class Base64Encoder extends Converter<core.DartList<number>, string> {
    _urlSafe: boolean;
    constructor();
    Base64Encoder(): void;
    urlSafe(): void;
    static urlSafe: new () => Base64Encoder;
    convert(input: core.DartList<number>): string;
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink;
}
export declare class _Base64Encoder {
    static _base64Alphabet: string;
    static _base64urlAlphabet: string;
    static _valueShift: number;
    static _countMask: number;
    static _sixBitMask: number;
    _state: number;
    _alphabet: string;
    constructor(urlSafe: boolean);
    _Base64Encoder(urlSafe: boolean): void;
    static _encodeState(count: number, bits: number): number;
    static _stateBits(state: number): number;
    static _stateCount(state: number): number;
    createBuffer(bufferLength: number): typed_data.Uint8List;
    encode(bytes: core.DartList<number>, start: number, end: number, isLast: boolean): typed_data.Uint8List;
    static encodeChunk(alphabet: string, bytes: core.DartList<number>, start: number, end: number, isLast: boolean, output: typed_data.Uint8List, outputIndex: number, state: number): number;
    static writeFinalChunk(alphabet: string, output: typed_data.Uint8List, outputIndex: number, count: number, bits: number): void;
}
export declare class _BufferCachingBase64Encoder extends _Base64Encoder {
    bufferCache: typed_data.Uint8List;
    constructor(urlSafe: boolean);
    _BufferCachingBase64Encoder(urlSafe: boolean): void;
    createBuffer(bufferLength: number): typed_data.Uint8List;
}
export declare class _Base64EncoderSink extends ByteConversionSinkBase {
    add(source: core.DartList<number>): void;
    close(): void;
    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class _AsciiBase64EncoderSink extends _Base64EncoderSink {
    _sink: core.DartSink<string>;
    _encoder: _Base64Encoder;
    constructor(_sink: core.DartSink<string>, urlSafe: boolean);
    _AsciiBase64EncoderSink(_sink: core.DartSink<string>, urlSafe: boolean): void;
    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class _Utf8Base64EncoderSink extends _Base64EncoderSink {
    _sink: ByteConversionSink;
    _encoder: _Base64Encoder;
    constructor(_sink: ByteConversionSink, urlSafe: boolean);
    _Utf8Base64EncoderSink(_sink: ByteConversionSink, urlSafe: boolean): void;
    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class Base64Decoder extends Converter<string, core.DartList<number>> {
    constructor();
    Base64Decoder(): void;
    convert(input: string, start?: number, end?: number): core.DartList<number>;
    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink;
}
export declare class _Base64Decoder {
    static _valueShift: number;
    static _countMask: number;
    static _invalid: number;
    static _padding: number;
    static __: number;
    static _p: number;
    static _inverseAlphabet: core.DartList<number>;
    static _char_percent: number;
    static _char_3: number;
    static _char_d: number;
    _state: number;
    static _encodeCharacterState(count: number, bits: number): number;
    static _stateCount(state: number): number;
    static _stateBits(state: number): number;
    static _encodePaddingState(expectedPadding: number): number;
    static _statePadding(state: number): number;
    static _hasSeenPadding(state: number): boolean;
    decode(input: string, start: number, end: number): typed_data.Uint8List;
    close(input: string, end: number): void;
    static decodeChunk(input: string, start: number, end: number, output: typed_data.Uint8List, outIndex: number, state: number): number;
    static _allocateBuffer(input: string, start: number, end: number, state: number): typed_data.Uint8List;
    static _trimPaddingChars(input: string, start: number, end: number): number;
    static _checkPadding(input: string, start: number, end: number, state: number): number;
}
export declare class _Base64DecoderSink extends StringConversionSinkBase {
    _sink: core.DartSink<core.DartList<number>>;
    _decoder: _Base64Decoder;
    constructor(_sink: core.DartSink<core.DartList<number>>);
    _Base64DecoderSink(_sink: core.DartSink<core.DartList<number>>): void;
    add(string: string): void;
    close(): void;
    addSlice(string: string, start: number, end: number, isLast: boolean): void;
}
export declare class _ByteAdapterSink extends ByteConversionSinkBase {
    _sink: core.DartSink<core.DartList<number>>;
    constructor(_sink: core.DartSink<core.DartList<number>>);
    _ByteAdapterSink(_sink: core.DartSink<core.DartList<number>>): void;
    add(chunk: core.DartList<number>): void;
    close(): void;
}
export declare class _ByteCallbackSink extends ByteConversionSinkBase {
    static _INITIAL_BUFFER_SIZE: number;
    _callback: <T>(accumulated: core.DartList<number>) => void;
    _buffer: core.DartList<number>;
    _bufferIndex: number;
    constructor(callback: (accumulated: core.DartList<number>) => void);
    _ByteCallbackSink(callback: (accumulated: core.DartList<number>) => void): void;
    add(chunk: core.DartIterable<number>): void;
    static _roundToPowerOf2(v: number): number;
    close(): void;
}
export declare class _SimpleCallbackSink<T> extends ChunkedConversionSink<T> {
    _callback: <T>(accumulated: core.DartList<T>) => void;
    _accumulated: core.DartList<T>;
    constructor(_callback: <T>(accumulated: core.DartList<T>) => void);
    _SimpleCallbackSink(_callback: <T>(accumulated: core.DartList<T>) => void): void;
    add(chunk: T): void;
    close(): void;
}
export declare class _ConverterStreamEventSink<S, T> implements async.DartEventSink<S> {
    _eventSink: async.DartEventSink<T>;
    _chunkedSink: core.DartSink<S>;
    constructor(converter: Converter<S, T>, sink: async.DartEventSink<T>);
    _ConverterStreamEventSink(converter: Converter<S, T>, sink: async.DartEventSink<T>): void;
    add(o: S): void;
    addError(error: core.DartObject, stackTrace?: core.DartStackTrace): void;
    close(): void;
}
export declare class _FusedCodec<S, M, T> extends Codec<S, T> {
    _first: Codec<S, M>;
    _second: Codec<M, T>;
    readonly encoder: Converter<S, T>;
    readonly decoder: Converter<T, S>;
    constructor(_first: Codec<S, M>, _second: Codec<M, T>);
    _FusedCodec(_first: Codec<S, M>, _second: Codec<M, T>): void;
}
export declare class _InvertedCodec<T, S> extends Codec<T, S> {
    _codec: Codec<S, T>;
    constructor(codec: Codec<S, T>);
    _InvertedCodec(codec: Codec<S, T>): void;
    readonly encoder: Converter<T, S>;
    readonly decoder: Converter<S, T>;
    readonly inverted: Codec<S, T>;
}
export declare class _FusedConverter<S, M, T> extends Converter<S, T> {
    _first: Converter<S, M>;
    _second: Converter<M, T>;
    constructor(_first: Converter<S, M>, _second: Converter<M, T>);
    _FusedConverter(_first: Converter<S, M>, _second: Converter<M, T>): void;
    convert(input: S): T;
    startChunkedConversion(sink: core.DartSink<any>): core.DartSink<any>;
}
export declare class HtmlEscapeMode {
    _name: string;
    escapeLtGt: boolean;
    escapeQuot: boolean;
    escapeApos: boolean;
    escapeSlash: boolean;
    _(_name: string, escapeLtGt: boolean, escapeQuot: boolean, escapeApos: boolean, escapeSlash: boolean): void;
    static _: new (_name: string, escapeLtGt: boolean, escapeQuot: boolean, escapeApos: boolean, escapeSlash: boolean) => HtmlEscapeMode;
    static UNKNOWN: HtmlEscapeMode;
    static ATTRIBUTE: HtmlEscapeMode;
    static SQ_ATTRIBUTE: HtmlEscapeMode;
    static ELEMENT: HtmlEscapeMode;
    constructor(_namedArguments?: {
        name?: string;
        escapeLtGt?: boolean;
        escapeQuot?: boolean;
        escapeApos?: boolean;
        escapeSlash?: boolean;
    });
    HtmlEscapeMode(_namedArguments?: {
        name?: string;
        escapeLtGt?: boolean;
        escapeQuot?: boolean;
        escapeApos?: boolean;
        escapeSlash?: boolean;
    }): void;
    toString(): string;
}
export declare class HtmlEscape extends Converter<string, string> {
    mode: HtmlEscapeMode;
    constructor(mode?: HtmlEscapeMode);
    HtmlEscape(mode?: HtmlEscapeMode): void;
    convert(text: string): string;
    _convert(text: string, start: number, end: number): string;
    startChunkedConversion(sink: core.DartSink<string>): StringConversionSink;
}
export declare class _HtmlEscapeSink extends StringConversionSinkBase {
    _escape: HtmlEscape;
    _sink: StringConversionSink;
    constructor(_escape: HtmlEscape, _sink: StringConversionSink);
    _HtmlEscapeSink(_escape: HtmlEscape, _sink: StringConversionSink): void;
    addSlice(chunk: string, start: number, end: number, isLast: boolean): void;
    close(): void;
}
export declare class JsonUnsupportedObjectError extends core.DartError {
    unsupportedObject: any;
    cause: any;
    constructor(unsupportedObject: any, _namedArguments?: {
        cause?: any;
    });
    JsonUnsupportedObjectError(unsupportedObject: any, _namedArguments?: {
        cause?: any;
    }): void;
    toString(): string;
}
export declare class JsonCyclicError extends JsonUnsupportedObjectError {
    constructor(object: core.DartObject);
    JsonCyclicError(object: core.DartObject): void;
    toString(): string;
}
export declare class JsonCodec extends Codec<core.DartObject, string> {
    _reviver: (key: any, value: any) => any;
    _toEncodable: (o: any) => any;
    constructor(_namedArguments?: {
        reviver?: (key: any, value: any) => any;
        toEncodable?: (object: any) => any;
    });
    JsonCodec(_namedArguments?: {
        reviver?: (key: any, value: any) => any;
        toEncodable?: (object: any) => any;
    }): void;
    withReviver(reviver: (key: any, value: any) => any): void;
    static withReviver: new (reviver: (key: any, value: any) => any) => JsonCodec;
    decode(source: string, _namedArguments?: {
        reviver?: (key: any, value: any) => any;
    }): any;
    encode(value: any, _namedArguments?: {
        toEncodable?: (object: any) => any;
    }): string;
    readonly encoder: JsonEncoder;
    readonly decoder: JsonDecoder;
}
export declare class JsonEncoder extends Converter<core.DartObject, string> {
    indent: string;
    _toEncodable: (o: any) => any;
    constructor(toEncodable?: (object: any) => any);
    JsonEncoder(toEncodable?: (object: any) => any): void;
    withIndent(indent: string, toEncodable?: (object: any) => any): void;
    static withIndent: new (indent: string, toEncodable: (object: any) => any) => JsonEncoder;
    convert(object: core.DartObject): string;
    startChunkedConversion(sink: core.DartSink<string>): ChunkedConversionSink<core.DartObject>;
    bind(stream: async.DartStream<core.DartObject>): async.DartStream<string>;
    fuse<T>(other: Converter<string, T>): Converter<core.DartObject, T>;
}
export declare class JsonUtf8Encoder extends Converter<core.DartObject, core.DartList<number>> {
    static DEFAULT_BUFFER_SIZE: number;
    _indent: core.DartList<number>;
    _toEncodable: (o: any) => any;
    _bufferSize: number;
    constructor(indent?: string, toEncodable?: (object: any) => any, bufferSize?: number);
    JsonUtf8Encoder(indent?: string, toEncodable?: (object: any) => any, bufferSize?: number): void;
    static _utf8Encode(string: string): core.DartList<number>;
    convert(object: core.DartObject): core.DartList<number>;
    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): ChunkedConversionSink<core.DartObject>;
    bind(stream: async.DartStream<core.DartObject>): async.DartStream<core.DartList<number>>;
}
export declare class _JsonEncoderSink extends ChunkedConversionSink<core.DartObject> {
    _indent: string;
    _toEncodable: (o: any) => any;
    _sink: StringConversionSink;
    _isDone: boolean;
    constructor(_sink: StringConversionSink, _toEncodable: (o: any) => any, _indent: string);
    _JsonEncoderSink(_sink: StringConversionSink, _toEncodable: (o: any) => any, _indent: string): void;
    add(o: core.DartObject): void;
    close(): void;
}
export declare class _JsonUtf8EncoderSink extends ChunkedConversionSink<core.DartObject> {
    _sink: ByteConversionSink;
    _indent: core.DartList<number>;
    _toEncodable: (o: any) => any;
    _bufferSize: number;
    _isDone: boolean;
    constructor(_sink: ByteConversionSink, _toEncodable: (o: any) => any, _indent: core.DartList<number>, _bufferSize: number);
    _JsonUtf8EncoderSink(_sink: ByteConversionSink, _toEncodable: (o: any) => any, _indent: core.DartList<number>, _bufferSize: number): void;
    _addChunk(chunk: typed_data.Uint8List, start: number, end: number): void;
    add(object: core.DartObject): void;
    close(): void;
}
export declare class JsonDecoder extends Converter<string, core.DartObject> {
    _reviver: (key: any, value: any) => any;
    constructor(reviver?: (key: any, value: any) => any);
    JsonDecoder(reviver?: (key: any, value: any) => any): void;
    convert(input: string): any;
    startChunkedConversion(sink: core.DartSink<core.DartObject>): StringConversionSink;
    bind(stream: async.DartStream<string>): async.DartStream<core.DartObject>;
}
export declare var _parseJson: (source: string, reviver: (key: any, value: any) => any) => any;
export declare var _convertJsonToDart: (json: any, reviver: (key: any, value: any) => any) => any;
export declare var _convertJsonToDartLazy: (object: any) => any;
export declare class _JsonMap implements core.DartMap<string, any> {
    _original: any;
    _processed: any;
    _data: any;
    constructor(_original: any);
    _JsonMap(_original: any): void;
    [OperatorMethods.INDEX](key: any): any;
    get(key: any): any;
    readonly length: number;
    readonly isEmpty: boolean;
    readonly isNotEmpty: boolean;
    readonly keys: core.DartIterable<string>;
    readonly values: core.DartIterable<any>;
    [OperatorMethods.INDEX_EQ](key: any, value: any): void;
    set(key: any, value: any): void;
    addAll(other: core.DartMap<any, any>): void;
    containsValue(value: any): boolean;
    containsKey(key: any): boolean;
    putIfAbsent(key: any, ifAbsent: () => any): any;
    remove(key: core.DartObject): any;
    clear(): void;
    forEach(f: (key: any, value: any) => void): void;
    toString(): string;
    readonly _isUpgraded: boolean;
    readonly _upgradedMap: core.DartMap<any, any>;
    _computeKeys(): core.DartList<string>;
    _upgrade(): core.DartMap<string, any>;
    _process(key: string): any;
    static _hasProperty(object: any, key: string): boolean;
    static _getProperty(object: any, key: string): any;
    static _setProperty(object: any, key: string, value: any): any;
    static _getPropertyNames(object: any): core.DartList<any>;
    static _isUnprocessed(object: any): boolean;
    static _newJavaScriptObject(): any;
}
export declare class _JsonMapKeyIterable extends core.DartListIterable<string> {
    _parent: _JsonMap;
    constructor(_parent: _JsonMap);
    _JsonMapKeyIterable(_parent: _JsonMap): void;
    readonly length: number;
    elementAt(index: number): string;
    readonly iterator: core.DartIterator<string>;
    contains(key: core.DartObject): boolean;
}
export declare var _defaultToEncodable: (object: any) => any;
export declare class _JsonStringifier {
    static BACKSPACE: number;
    static TAB: number;
    static NEWLINE: number;
    static CARRIAGE_RETURN: number;
    static FORM_FEED: number;
    static QUOTE: number;
    static CHAR_0: number;
    static BACKSLASH: number;
    static CHAR_b: number;
    static CHAR_f: number;
    static CHAR_n: number;
    static CHAR_r: number;
    static CHAR_t: number;
    static CHAR_u: number;
    _seen: core.DartList<any>;
    _toEncodable: (o: any) => any;
    constructor(toEncodable: (o: any) => any);
    _JsonStringifier(toEncodable: (o: any) => any): void;
    writeString(characters: string): void;
    writeStringSlice(characters: string, start: number, end: number): void;
    writeCharCode(charCode: number): void;
    writeNumber(number: number): void;
    static hexDigit(x: number): number;
    writeStringContent(s: string): void;
    _checkCycle(object: any): void;
    _removeSeen(object: any): void;
    writeObject(object: any): void;
    writeJsonValue(object: any): boolean;
    writeList(list: core.DartList<any>): void;
    writeMap(map: core.DartMap<any, any>): boolean;
}
export declare class _JsonPrettyPrintMixin extends _JsonStringifier {
    _indentLevel: number;
    writeIndentation(indentLevel: number): void;
    writeList(list: core.DartList<any>): void;
    writeMap(map: core.DartMap<any, any>): boolean;
}
export declare class _JsonStringStringifier extends _JsonStringifier {
    _sink: core.DartStringSink;
    constructor(_sink: core.DartStringSink, _toEncodable: any);
    _JsonStringStringifier(_sink: core.DartStringSink, _toEncodable: any): void;
    static stringify(object: any, toEncodable: (o: any) => any, indent: string): string;
    static printOn(object: any, output: core.DartStringSink, toEncodable: (o: any) => any, indent: string): void;
    writeNumber(number: number): void;
    writeString(string: string): void;
    writeStringSlice(string: string, start: number, end: number): void;
    writeCharCode(charCode: number): void;
}
export declare class _JsonStringStringifierPretty extends _JsonStringStringifier {
    _indent: string;
    constructor(sink: core.DartStringSink, toEncodable: (o: any) => any, _indent: string);
    _JsonStringStringifierPretty(sink: core.DartStringSink, toEncodable: (o: any) => any, _indent: string): void;
    writeIndentation(count: number): void;
}
export declare class _JsonUtf8Stringifier extends _JsonStringifier {
    bufferSize: number;
    addChunk: (list: typed_data.Uint8List, start: number, end: number) => void;
    buffer: typed_data.Uint8List;
    index: number;
    constructor(toEncodable: (o: any) => any, bufferSize: number, addChunk: (list: typed_data.Uint8List, start: number, end: number) => void);
    _JsonUtf8Stringifier(toEncodable: (o: any) => any, bufferSize: number, addChunk: (list: typed_data.Uint8List, start: number, end: number) => void): void;
    static stringify(object: core.DartObject, indent: core.DartList<number>, toEncodable: (o: any) => any, bufferSize: number, addChunk: (chunk: typed_data.Uint8List, start: number, end: number) => void): void;
    flush(): void;
    writeNumber(number: number): void;
    writeAsciiString(string: string): void;
    writeString(string: string): void;
    writeStringSlice(string: string, start: number, end: number): void;
    writeCharCode(charCode: number): void;
    writeMultiByteCharCode(charCode: number): void;
    writeFourByteCharCode(charCode: number): void;
    writeByte(byte: number): void;
}
export declare class _JsonUtf8StringifierPretty extends _JsonUtf8Stringifier {
    indent: core.DartList<number>;
    constructor(toEncodable: (o: any) => any, indent: core.DartList<number>, bufferSize: any, addChunk: (buffer: typed_data.Uint8List, start: number, end: number) => void);
    _JsonUtf8StringifierPretty(toEncodable: (o: any) => any, indent: core.DartList<number>, bufferSize: any, addChunk: (buffer: typed_data.Uint8List, start: number, end: number) => void): void;
    writeIndentation(count: number): void;
}
export declare class Latin1Codec extends Encoding {
    _allowInvalid: boolean;
    constructor(_namedArguments?: {
        allowInvalid?: boolean;
    });
    Latin1Codec(_namedArguments?: {
        allowInvalid?: boolean;
    }): void;
    readonly name: string;
    decode(bytes: core.DartList<number>, _namedArguments?: {
        allowInvalid?: boolean;
    }): string;
    readonly encoder: Latin1Encoder;
    readonly decoder: Latin1Decoder;
}
export declare class Latin1Encoder extends _UnicodeSubsetEncoder {
    constructor();
    Latin1Encoder(): void;
}
export declare class Latin1Decoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments?: {
        allowInvalid?: boolean;
    });
    Latin1Decoder(_namedArguments?: {
        allowInvalid?: boolean;
    }): void;
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink;
}
export declare class _Latin1DecoderSink extends ByteConversionSinkBase {
    _sink: StringConversionSink;
    constructor(_sink: StringConversionSink);
    _Latin1DecoderSink(_sink: StringConversionSink): void;
    close(): void;
    add(source: core.DartList<number>): void;
    _addSliceToSink(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
    static _checkValidLatin1(source: core.DartList<number>, start: number, end: number): void;
    static _reportInvalidLatin1(source: core.DartList<number>, start: number, end: number): void;
}
export declare class _Latin1AllowInvalidDecoderSink extends _Latin1DecoderSink {
    constructor(sink: StringConversionSink);
    _Latin1AllowInvalidDecoderSink(sink: StringConversionSink): void;
    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void;
}
export declare class LineSplitter extends Converter<string, core.DartList<string>> {
    constructor();
    LineSplitter(): void;
    static split(lines: string, start?: number, end?: number): core.DartIterable<string>;
    convert(data: string): core.DartList<string>;
    startChunkedConversion(sink: core.DartSink<string>): StringConversionSink;
    bind(stream: async.DartStream<string>): async.DartStream<any>;
}
export declare class _LineSplitterSink extends StringConversionSinkBase {
    _sink: StringConversionSink;
    _carry: string;
    _skipLeadingLF: boolean;
    constructor(_sink: StringConversionSink);
    _LineSplitterSink(_sink: StringConversionSink): void;
    addSlice(chunk: string, start: number, end: number, isLast: boolean): void;
    close(): void;
    _addLines(lines: string, start: number, end: number): void;
}
export declare class _LineSplitterEventSink extends _LineSplitterSink implements async.DartEventSink<string> {
    _eventSink: async.DartEventSink<string>;
    constructor(eventSink: async.DartEventSink<string>);
    _LineSplitterEventSink(eventSink: async.DartEventSink<string>): void;
    addError(o: core.DartObject, stackTrace?: core.DartStackTrace): void;
}
export declare class ClosableStringSink extends core.DartStringSink {
    static _fromStringSink(sink: core.DartStringSink, onClose: () => void): ClosableStringSink;
    static fromStringSink: new (sink: core.DartStringSink, onClose: () => void) => ClosableStringSink;
    close(): void;
}
export declare class _ClosableStringSink implements ClosableStringSink {
    _callback: () => void;
    _sink: core.DartStringSink;
    constructor(_sink: core.DartStringSink, _callback: () => void);
    _ClosableStringSink(_sink: core.DartStringSink, _callback: () => void): void;
    close(): void;
    writeCharCode(charCode: number): void;
    write(o: any): void;
    writeln(o?: any): void;
    writeAll(objects: core.DartIterable<any>, separator?: string): void;
}
export declare class _StringConversionSinkAsStringSinkAdapter implements ClosableStringSink {
    static _MIN_STRING_SIZE: number;
    _buffer: core.DartStringBuffer;
    _chunkedSink: StringConversionSink;
    constructor(_chunkedSink: StringConversionSink);
    _StringConversionSinkAsStringSinkAdapter(_chunkedSink: StringConversionSink): void;
    close(): void;
    writeCharCode(charCode: number): void;
    write(o: any): void;
    writeln(o?: any): void;
    writeAll(objects: core.DartIterable<any>, separator?: string): void;
    _flush(): void;
}
export declare class _StringSinkConversionSink extends StringConversionSinkBase {
    _stringSink: core.DartStringSink;
    constructor(_stringSink: core.DartStringSink);
    _StringSinkConversionSink(_stringSink: core.DartStringSink): void;
    close(): void;
    addSlice(str: string, start: number, end: number, isLast: boolean): void;
    add(str: string): void;
    asUtf8Sink(allowMalformed: boolean): ByteConversionSink;
    asStringSink(): ClosableStringSink;
}
export declare type _Reviver = (key: any, value: any) => any;
export declare class _StringCallbackSink extends _StringSinkConversionSink {
    _callback: <T>(accumulated: string) => void;
    constructor(_callback: <T>(accumulated: string) => void);
    _StringCallbackSink(_callback: <T>(accumulated: string) => void): void;
    close(): void;
    asUtf8Sink(allowMalformed: boolean): ByteConversionSink;
}
export declare class _StringAdapterSink extends StringConversionSinkBase {
    _sink: core.DartSink<string>;
    constructor(_sink: core.DartSink<string>);
    _StringAdapterSink(_sink: core.DartSink<string>): void;
    add(str: string): void;
    addSlice(str: string, start: number, end: number, isLast: boolean): void;
    close(): void;
}
export declare class _Utf8StringSinkAdapter extends ByteConversionSink {
    _decoder: _Utf8Decoder;
    _sink: core.DartSink<any>;
    constructor(_sink: core.DartSink<any>, stringSink: core.DartStringSink, allowMalformed: boolean);
    _Utf8StringSinkAdapter(_sink: core.DartSink<any>, stringSink: core.DartStringSink, allowMalformed: boolean): void;
    close(): void;
    add(chunk: core.DartList<number>): void;
    addSlice(codeUnits: core.DartList<number>, startIndex: number, endIndex: number, isLast: boolean): void;
}
export declare class _Utf8ConversionSink extends ByteConversionSink {
    _decoder: _Utf8Decoder;
    _chunkedSink: StringConversionSink;
    _buffer: core.DartStringBuffer;
    constructor(sink: StringConversionSink, allowMalformed: boolean);
    _Utf8ConversionSink(sink: StringConversionSink, allowMalformed: boolean): void;
    _(_chunkedSink: StringConversionSink, stringBuffer: core.DartStringBuffer, allowMalformed: boolean): void;
    static _: new (_chunkedSink: StringConversionSink, stringBuffer: core.DartStringBuffer, allowMalformed: boolean) => _Utf8ConversionSink;
    close(): void;
    add(chunk: core.DartList<number>): void;
    addSlice(chunk: core.DartList<number>, startIndex: number, endIndex: number, isLast: boolean): void;
}
export declare class Utf8Codec extends Encoding {
    _allowMalformed: boolean;
    constructor(_namedArguments?: {
        allowMalformed?: boolean;
    });
    Utf8Codec(_namedArguments?: {
        allowMalformed?: boolean;
    }): void;
    readonly name: string;
    decode(codeUnits: core.DartList<number>, _namedArguments?: {
        allowMalformed?: boolean;
    }): string;
    readonly encoder: Utf8Encoder;
    readonly decoder: Utf8Decoder;
}
export declare class Utf8Encoder extends Converter<string, core.DartList<number>> {
    constructor();
    Utf8Encoder(): void;
    convert(string: string, start?: number, end?: number): core.DartList<number>;
    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink;
    bind(stream: async.DartStream<string>): async.DartStream<core.DartList<number>>;
}
export declare class _Utf8Encoder {
    _carry: number;
    _bufferIndex: number;
    _buffer: core.DartList<number>;
    static _DEFAULT_BYTE_BUFFER_SIZE: number;
    constructor();
    _Utf8Encoder(): void;
    withBufferSize(bufferSize: number): void;
    static withBufferSize: new (bufferSize: number) => _Utf8Encoder;
    static _createBuffer(size: number): core.DartList<number>;
    _writeSurrogate(leadingSurrogate: number, nextCodeUnit: number): boolean;
    _fillBuffer(str: string, start: number, end: number): number;
}
export declare class _Utf8EncoderSink extends _Utf8Encoder {
    _sink: ByteConversionSink;
    constructor(_sink: ByteConversionSink);
    _Utf8EncoderSink(_sink: ByteConversionSink): void;
    close(): void;
    addSlice(str: string, start: number, end: number, isLast: boolean): void;
}
export declare class Utf8Decoder extends Converter<core.DartList<number>, string> {
    _allowMalformed: boolean;
    constructor(_namedArguments?: {
        allowMalformed?: boolean;
    });
    Utf8Decoder(_namedArguments?: {
        allowMalformed?: boolean;
    }): void;
    convert(codeUnits: core.DartList<number>, start?: number, end?: number): string;
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink;
    bind(stream: async.DartStream<core.DartList<number>>): async.DartStream<string>;
    fuse<T>(next: Converter<string, T>): Converter<core.DartList<number>, T>;
    static _convertIntercepted(allowMalformed: boolean, codeUnits: core.DartList<number>, start: number, end: number): string;
}
export declare var _isLeadSurrogate: (codeUnit: number) => boolean;
export declare var _isTailSurrogate: (codeUnit: number) => boolean;
export declare var _combineSurrogatePair: (lead: number, tail: number) => number;
export declare class _Utf8Decoder {
    _allowMalformed: boolean;
    _stringSink: core.DartStringSink;
    _isFirstCharacter: boolean;
    _value: number;
    _expectedUnits: number;
    _extraUnits: number;
    constructor(_stringSink: core.DartStringSink, _allowMalformed: boolean);
    _Utf8Decoder(_stringSink: core.DartStringSink, _allowMalformed: boolean): void;
    readonly hasPartialInput: boolean;
    static _LIMITS: core.DartList<number>;
    close(): void;
    flush(source?: core.DartList<number>, offset?: number): void;
    convert(codeUnits: core.DartList<number>, startIndex: number, endIndex: number): void;
}
export declare class _Properties {
    ASCII: AsciiCodec;
    _ASCII_MASK: number;
    BASE64: Base64Codec;
    BASE64URL: Base64Codec;
    _paddingChar: number;
    HTML_ESCAPE: HtmlEscape;
    JSON: JsonCodec;
    LATIN1: Latin1Codec;
    _LATIN1_MASK: number;
    _LF: number;
    _CR: number;
    UNICODE_REPLACEMENT_CHARACTER_RUNE: number;
    UNICODE_BOM_CHARACTER_RUNE: number;
    UTF8: Utf8Codec;
    _ONE_BYTE_LIMIT: number;
    _TWO_BYTE_LIMIT: number;
    _THREE_BYTE_LIMIT: number;
    _FOUR_BYTE_LIMIT: number;
    _SURROGATE_MASK: number;
    _SURROGATE_TAG_MASK: number;
    _SURROGATE_VALUE_MASK: number;
    _LEAD_SURROGATE_MIN: number;
    _TAIL_SURROGATE_MIN: number;
}
export declare const properties: _Properties;
