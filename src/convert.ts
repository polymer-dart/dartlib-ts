/** Library asset:sample_project/lib/convert/convert.dart */
import {is, equals, isNot} from "./_common";
import {defaultConstructor, namedConstructor, namedFactory, defaultFactory, DartClass, Implements, op, Op, OperatorMethods, DartClassAnnotation, DartMethodAnnotation, DartPropertyAnnotation, Abstract, AbstractProperty} from "./utils";
import * as _common from "./_common";
import * as core from "./core";
import * as async from "./async";
import * as typed_data from "./typed_data";
import * as _internal from "./_internal";


const _ONE_BYTE_LIMIT: number = 127;
const _TWO_BYTE_LIMIT: number = 2047;
const _THREE_BYTE_LIMIT: number = 65535;
const _FOUR_BYTE_LIMIT: number = 1114111;
const _SURROGATE_MASK: number = 63488;
const _SURROGATE_TAG_MASK: number = 64512;
const _SURROGATE_VALUE_MASK: number = 1023;
const _LEAD_SURROGATE_MIN: number = 55296;
const _TAIL_SURROGATE_MIN: number = 56320;


@DartClass
export class Codec<S, T> {
    constructor() {
    }

    @defaultConstructor
    Codec() {
    }

    encode(input: S): T {
        return this.encoder.convert(input);
    }

    decode(encoded: T): S {
        return this.decoder.convert(encoded);
    }

    @AbstractProperty
    get encoder(): Converter<S, T> {
        throw 'abstract'
    }

    @AbstractProperty
    get decoder(): Converter<T, S> {
        throw 'abstract'
    }

    fuse<R>(other: Codec<T, R>): Codec<S, R> {
        return new _FusedCodec<S, T, R>(this, other);
    }

    get inverted(): Codec<T, S> {
        return new _InvertedCodec<T, S>(this);
    }
}


@DartClass
export class Encoding extends Codec<string, core.DartList<number>> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Encoding() {
    }

    @AbstractProperty
    get encoder(): Converter<string, core.DartList<number>> {
        throw 'abstract'
    }

    @AbstractProperty
    get decoder(): Converter<core.DartList<number>, string> {
        throw 'abstract'
    }

    decodeStream(byteStream: async.DartStream<core.DartList<number>>): async.Future<string> {
        return byteStream.transform(this.decoder).fold(new core.DartStringBuffer(), (buffer: any, string: any) => {
            return ((_): any => {
                {
                    _.write(string);
                    return _;
                }
            })(buffer);
        }).then((buffer: any) => {
            return buffer.toString();
        });
    }

    @AbstractProperty
    get name(): string {
        throw 'abstract'
    }

    static _nameToEncoding: core.DartMap<string, Encoding>;

    static getByName(name: string): Encoding {
        if (name == null) return null;
        name = name.toLowerCase();
        return Encoding._nameToEncoding.get(name);
    }
}


@DartClass
@Implements(async.DartStreamTransformer)
export class Converter<S, T> implements async.DartStreamTransformer<S, T> {
    constructor() {
    }

    @defaultConstructor
    Converter() {
    }

    @Abstract
    convert(input: S): T {
        throw 'abstract'
    }

    fuse<TT>(other: Converter<T, TT>): Converter<S, TT> {
        return new _FusedConverter<S, T, TT>(this, other);
    }

    startChunkedConversion(sink: core.DartSink<any>): core.DartSink<any> {
        throw new core.UnsupportedError(`This converter does not support chunked conversions: ${this}`);
    }

    bind(stream: async.DartStream<S>): async.DartStream<T> {
        return new async.DartStream.eventTransformed(stream, (sink: async.DartEventSink<any>) => {
            return new _ConverterStreamEventSink<any, any>(this, sink);
        });
    }
}


@DartClass
export class AsciiCodec extends Encoding {
    _allowInvalid: boolean;

    constructor(_namedArguments?: { allowInvalid?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    AsciiCodec(_namedArguments?: { allowInvalid?: boolean }) {
        let {allowInvalid} = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        this._allowInvalid = allowInvalid;
    }

    get name(): string {
        return "us-ascii";
    }

    decode(bytes: core.DartList<number>, _namedArguments?: { allowInvalid?: boolean }): string {
        let {allowInvalid} = Object.assign({}, _namedArguments);
        if (allowInvalid == null) allowInvalid = this._allowInvalid;
        if (allowInvalid) {
            return new AsciiDecoder({
                allowInvalid: true
            }).convert(bytes);
        } else {
            return new AsciiDecoder({
                allowInvalid: false
            }).convert(bytes);
        }
    }

    get encoder(): AsciiEncoder {
        return new AsciiEncoder();
    }

    get decoder(): AsciiDecoder {
        return this._allowInvalid ? new AsciiDecoder({
            allowInvalid: true
        }) : new AsciiDecoder({
            allowInvalid: false
        });
    }
}

@DartClass
export class _UnicodeSubsetEncoder extends Converter<string, core.DartList<number>> {
    _subsetMask: number;

    constructor(_subsetMask: number) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _UnicodeSubsetEncoder(_subsetMask: number) {
        this._subsetMask = _subsetMask;
    }

    convert(string: string, start?: number, end?: number): core.DartList<number> {
        start = start || 0;
        let stringLength: number = string.length;
        core.RangeError.checkValidRange(start, end, stringLength);
        if (end == null) end = stringLength;
        let length: number = end - start;
        let result: core.DartList<number> = new typed_data.Uint8List(length);
        for (let i: number = 0; i < length; i++) {
            let codeUnit = new core.DartString(string).codeUnitAt(start + i);
            if ((codeUnit & ~this._subsetMask) != 0) {
                throw new core.ArgumentError("String contains invalid characters.");
            }
            op(Op.INDEX_ASSIGN, result, i, codeUnit);
        }
        return result;
    }

    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink {
        if (isNot(sink, ByteConversionSink)) {
            sink = new ByteConversionSink.from(sink);
        }
        return new _UnicodeSubsetEncoderSink(this._subsetMask, sink as any);
    }

    bind(stream: async.DartStream<string>): async.DartStream<core.DartList<number>> {
        return super.bind(stream);
    }
}

@DartClass
export class AsciiEncoder extends _UnicodeSubsetEncoder {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    AsciiEncoder() {
        super._UnicodeSubsetEncoder(properties._ASCII_MASK);
    }
}

@DartClass
@Implements(core.DartSink)
export class ChunkedConversionSink<T> implements core.DartSink<T> {
    constructor() {
    }

    @defaultConstructor
    ChunkedConversionSink() {
    }

    @namedFactory
    static _withCallback<T>(callback: <T>(accumulated: core.DartList<T>) => void): ChunkedConversionSink<T> {
        return new _SimpleCallbackSink<T>(callback);
    }

    static withCallback: new<T>(callback: <T>(accumulated: core.DartList<T>) => void) => ChunkedConversionSink<T>;

    @Abstract
    add(chunk: T): void {
        throw 'abstract'
    }

    @Abstract
    close(): void {
        throw 'abstract'
    }
}

@DartClass
export class StringConversionSink extends ChunkedConversionSink<string> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    StringConversionSink() {
    }

    @namedFactory
    static _withCallbackString(callback: (accumulated: string) => void): StringConversionSink {
        return new _StringCallbackSink(callback);
    }

    static withCallbackString: new(callback: (accumulated: string) => void) => StringConversionSink;

    @namedFactory
    static _from(sink: core.DartSink<string>): StringConversionSink {
        return new _StringAdapterSink(sink);
    }

    static from: new(sink: core.DartSink<string>) => StringConversionSink;

    @namedFactory
    static _fromStringSink(sink: core.DartStringSink): StringConversionSink {
        return new _StringSinkConversionSink(sink);
    }

    static fromStringSink: new(sink: core.DartStringSink) => StringConversionSink;

    @Abstract
    addSlice(chunk: string, start: number, end: number, isLast: boolean): void {
        throw 'abstract'
    }

    @Abstract
    asUtf8Sink(allowMalformed: boolean): ByteConversionSink {
        throw 'abstract'
    }

    @Abstract
    asStringSink(): ClosableStringSink {
        throw 'abstract'
    }
}


@DartClass
export class StringConversionSinkMixin extends StringConversionSink {
    @Abstract
    addSlice(str: string, start: number, end: number, isLast: boolean): void {
        throw 'abstract'
    }

    @Abstract
    close(): void {
        throw 'abstract'
    }

    add(str: string): void {
        this.addSlice(str, 0, str.length, false);
    }

    asUtf8Sink(allowMalformed: boolean): ByteConversionSink {
        return new _Utf8ConversionSink(this, allowMalformed);
    }

    asStringSink(): ClosableStringSink {
        return new _StringConversionSinkAsStringSinkAdapter(this);
    }
}

@DartClass
export class StringConversionSinkBase extends StringConversionSinkMixin {
}


@DartClass
export class _UnicodeSubsetEncoderSink extends StringConversionSinkBase {
    _sink: ByteConversionSink;
    _subsetMask: number;

    constructor(_subsetMask: number, _sink: ByteConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _UnicodeSubsetEncoderSink(_subsetMask: number, _sink: ByteConversionSink) {
        this._subsetMask = _subsetMask;
        this._sink = _sink;
    }

    close(): void {
        this._sink.close();
    }

    addSlice(source: string, start: number, end: number, isLast: boolean): void {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i: number = start; i < end; i++) {
            let codeUnit: number = new core.DartString(source).codeUnitAt(i);
            if ((codeUnit & ~this._subsetMask) != 0) {
                throw new core.ArgumentError(`Source contains invalid character with code point: ${codeUnit}.`);
            }
        }
        this._sink.add(new core.DartString(source).codeUnits.sublist(start, end));
        if (isLast) {
            this.close();
        }
    }
}

@DartClass
export class _UnicodeSubsetDecoder extends Converter<core.DartList<number>, string> {
    _allowInvalid: boolean;
    _subsetMask: number;

    constructor(_allowInvalid: boolean, _subsetMask: number) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _UnicodeSubsetDecoder(_allowInvalid: boolean, _subsetMask: number) {
        this._allowInvalid = _allowInvalid;
        this._subsetMask = _subsetMask;
    }

    convert(bytes: core.DartList<number>, start?: number, end?: number): string {
        start = start || 0;
        let byteCount: number = bytes.length;
        core.RangeError.checkValidRange(start, end, byteCount);
        if (end == null) end = byteCount;
        for (let i: number = start; i < end; i++) {
            let byte: number = bytes[i];
            if ((byte & ~this._subsetMask) != 0) {
                if (!this._allowInvalid) {
                    throw new core.FormatException(`Invalid value in input: ${byte}`);
                }
                return this._convertInvalid(bytes, start, end);
            }
        }
        return new core.DartString.fromCharCodes(bytes, start, end).valueOf();
    }

    _convertInvalid(bytes: core.DartList<number>, start: number, end: number): string {
        let buffer: core.DartStringBuffer = new core.DartStringBuffer();
        for (let i: number = start; i < end; i++) {
            let value: number = bytes[i];
            if ((value & ~this._subsetMask) != 0) value = 65533;
            buffer.writeCharCode(value);
        }
        return buffer.toString();
    }

    @Abstract
    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink {
        throw 'abstract'
    }

    bind(stream: async.DartStream<core.DartList<number>>): async.DartStream<string> {
        return super.bind(stream);
    }
}

@DartClass
export class AsciiDecoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments?: { allowInvalid?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    AsciiDecoder(_namedArguments?: { allowInvalid?: boolean }) {
        let {allowInvalid} = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        super._UnicodeSubsetDecoder(allowInvalid, properties._ASCII_MASK);
    }

    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink {
        let stringSink: StringConversionSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        } else {
            stringSink = new StringConversionSink.from(sink);
        }
        if (this._allowInvalid) {
            return new _ErrorHandlingAsciiDecoderSink(stringSink.asUtf8Sink(false));
        } else {
            return new _SimpleAsciiDecoderSink(stringSink);
        }
    }
}

@DartClass
export class ByteConversionSink extends ChunkedConversionSink<core.DartList<number>> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    ByteConversionSink() {
    }

    @namedFactory
    static _withCallbackBinary(callback: (accumulated: core.DartList<number>) => void): ByteConversionSink {
        return new _ByteCallbackSink(callback);
    }

    static withCallbackBinary: new(callback: (accumulated: any) => void) => ByteConversionSink;

    @namedFactory
    static _from(sink: core.DartSink<core.DartList<number>>): ByteConversionSink {
        return new _ByteAdapterSink(sink);
    }

    static from: new(sink: core.DartSink<core.DartList<number>>) => ByteConversionSink;

    @Abstract
    addSlice(chunk: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        throw 'abstract'
    }
}

@DartClass
export class ByteConversionSinkBase extends ByteConversionSink {
    @Abstract
    add(chunk: core.DartList<number>): void {
        throw 'abstract'
    }

    @Abstract
    close(): void {
        throw 'abstract'
    }

    addSlice(chunk: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        this.add(chunk.sublist(start, end));
        if (isLast) this.close();
    }
}

@DartClass
export class _ErrorHandlingAsciiDecoderSink extends ByteConversionSinkBase {
    _utf8Sink: ByteConversionSink;

    constructor(_utf8Sink: ByteConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _ErrorHandlingAsciiDecoderSink(_utf8Sink: ByteConversionSink) {
        this._utf8Sink = _utf8Sink;
    }

    close(): void {
        this._utf8Sink.close();
    }

    add(source: core.DartList<number>): void {
        this.addSlice(source, 0, source.length, false);
    }

    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i: number = start; i < end; i++) {
            if ((source[i] & ~properties._ASCII_MASK) != 0) {
                if (i > start) this._utf8Sink.addSlice(source, start, i, false);
                this._utf8Sink.add(new core.DartList.literal<number>(239, 191, 189));
                start = i + 1;
            }
        }
        if (start < end) {
            this._utf8Sink.addSlice(source, start, end, isLast);
        } else if (isLast) {
            this.close();
        }
    }
}

@DartClass
export class _SimpleAsciiDecoderSink extends ByteConversionSinkBase {
    _sink: core.DartSink<any>;

    constructor(_sink: core.DartSink<any>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _SimpleAsciiDecoderSink(_sink: core.DartSink<any>) {
        this._sink = _sink;
    }

    close(): void {
        this._sink.close();
    }

    add(source: core.DartList<number>): void {
        for (let i: number = 0; i < source.length; i++) {
            if ((source[i] & ~properties._ASCII_MASK) != 0) {
                throw new core.FormatException("Source contains non-ASCII bytes.");
            }
        }
        this._sink.add(new core.DartString.fromCharCodes(source).valueOf());
    }

    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        let length: number = source.length;
        core.RangeError.checkValidRange(start, end, length);
        if (start < end) {
            if (start != 0 || end != length) {
                source = source.sublist(start, end);
            }
            this.add(source);
        }
        if (isLast) this.close();
    }
}

@DartClass
export class Base64Codec extends Codec<core.DartList<number>, string> {
    _encoder: Base64Encoder;

    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Base64Codec() {
        this._encoder = new Base64Encoder();
    }

    @namedConstructor
    urlSafe() {
        this._encoder = new Base64Encoder.urlSafe();
    }

    static urlSafe: new() => Base64Codec;

    get encoder(): Base64Encoder {
        return this._encoder;
    }

    get decoder(): Base64Decoder {
        return new Base64Decoder();
    }

    normalize(source: string, start?: number, end?: number): string {
        start = start || 0;
        end = core.RangeError.checkValidRange(start, end, source.length);
        let percent: number = 37;
        let equals: number = 61;
        let buffer: core.DartStringBuffer = null;
        let sliceStart: number = start;
        let alphabet = _Base64Encoder._base64Alphabet;
        let inverseAlphabet = _Base64Decoder._inverseAlphabet;
        let firstPadding: number = -1;
        let firstPaddingSourceIndex: number = -1;
        let paddingCount: number = 0;
        for (let i: number = start; i < end;) {
            let sliceEnd: number = i;
            let char: number = new core.DartString(source).codeUnitAt(i++);
            let originalChar: number = char;
            if (char == percent) {
                if (i + 2 <= end) {
                    char = _internal.parseHexByte(source, i);
                    i = 2;
                    if (char == percent) char = -1;
                } else {
                    char = -1;
                }
            }
            if (0 <= char && char <= 127) {
                let value: number = inverseAlphabet[char];
                if (value >= 0) {
                    char = new core.DartString(alphabet).codeUnitAt(value);
                    if (char == originalChar) continue;
                } else if (value == _Base64Decoder._padding) {
                    if (firstPadding < 0) {
                        firstPadding = (buffer.length || 0) + (sliceEnd - sliceStart);
                        firstPaddingSourceIndex = sliceEnd;
                    }
                    paddingCount++;
                    if (originalChar == equals) continue;
                }
                if (value != _Base64Decoder._invalid) {
                    buffer = new core.DartStringBuffer();
                    buffer.write(source.substring(sliceStart, sliceEnd));
                    buffer.writeCharCode(char);
                    sliceStart = i;
                    continue
                        ;
                }
            }
            throw new core.FormatException("Invalid base64 data", source, sliceEnd);
        }
        if (buffer != null) {
            buffer.write(source.substring(sliceStart, end));
            if (firstPadding >= 0) {
                Base64Codec._checkPadding(source, firstPaddingSourceIndex, end, firstPadding, paddingCount, buffer.length);
            } else {
                let endLength: number = ((buffer.length - 1) % 4) + 1;
                if (endLength == 1) {
                    throw new core.FormatException("Invalid base64 encoding length ", source, end);
                }
                while (endLength < 4) {
                    buffer.write("=");
                    endLength++;
                }
            }
            return new core.DartString(source).replaceRange(start, end, buffer.toString());
        }
        let length: number = end - start;
        if (firstPadding >= 0) {
            Base64Codec._checkPadding(source, firstPaddingSourceIndex, end, firstPadding, paddingCount, length);
        } else {
            let endLength: number = length % 4;
            if (endLength == 1) {
                throw new core.FormatException("Invalid base64 encoding length ", source, end);
            }
            if (endLength > 1) {
                source = new core.DartString(source).replaceRange(end, end, (endLength == 2) ? "==" : "=");
            }
        }
        return source;
    }

    static _checkPadding(source: string, sourceIndex: number, sourceEnd: number, firstPadding: number, paddingCount: number, length: number): void {
        if (length % 4 != 0) {
            throw new core.FormatException("Invalid base64 padding, padded length must be multiple of four, " + `is ${length}`, source, sourceEnd);
        }
        if (firstPadding + paddingCount != length) {
            throw new core.FormatException("Invalid base64 padding, '=' not at the end", source, sourceIndex);
        }
        if (paddingCount > 2) {
            throw new core.FormatException("Invalid base64 padding, more than two '=' characters", source, sourceIndex);
        }
    }
}

@DartClass
export class Base64Encoder extends Converter<core.DartList<number>, string> {
    _urlSafe: boolean;

    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Base64Encoder() {
        this._urlSafe = false;
    }

    @namedConstructor
    urlSafe() {
        this._urlSafe = true;
    }

    static urlSafe: new() => Base64Encoder;

    convert(input: core.DartList<number>): string {
        if (input.isEmpty) return "";
        let encoder = new _Base64Encoder(this._urlSafe);
        let buffer: typed_data.Uint8List = encoder.encode(input, 0, input.length, true);
        return new core.DartString.fromCharCodes(buffer).valueOf();
    }

    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink {
        if (is(sink, StringConversionSink)) {
            return new _Utf8Base64EncoderSink(sink.asUtf8Sink(false), this._urlSafe);
        }
        return new _AsciiBase64EncoderSink(sink, this._urlSafe);
    }
}

@DartClass
export class _Base64Encoder {
    static _base64Alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    static _base64urlAlphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    static _valueShift: number = 2;
    static _countMask: number = 3;
    static _sixBitMask: number = 63;
    _state: number = 0;
    _alphabet: string;

    constructor(urlSafe: boolean) {
    }

    @defaultConstructor
    _Base64Encoder(urlSafe: boolean) {
        this._alphabet = urlSafe ? _Base64Encoder._base64urlAlphabet : _Base64Encoder._base64Alphabet;
    }

    static _encodeState(count: number, bits: number): number {
        /* TODO (AssertStatementImpl) : assert (count <= _countMask); */
        ;
        return bits << _Base64Encoder._valueShift | count;
    }

    static _stateBits(state: number): number {
        return state >> _Base64Encoder._valueShift;
    }

    static _stateCount(state: number): number {
        return state & _Base64Encoder._countMask;
    }

    createBuffer(bufferLength: number): typed_data.Uint8List {
        return new typed_data.Uint8List(bufferLength);
    }

    encode(bytes: core.DartList<number>, start: number, end: number, isLast: boolean): typed_data.Uint8List {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */
        ;
        /* TODO (AssertStatementImpl) : assert (start <= end); */
        ;
        /* TODO (AssertStatementImpl) : assert (bytes == null || end <= bytes.length); */
        ;
        let length: number = end - start;
        let count: number = _Base64Encoder._stateCount(this._state);
        let byteCount: number = (count + length);
        let fullChunks: number = op(Op.QUOTIENT, byteCount, 3);
        let partialChunkLength: number = byteCount - fullChunks * 3;
        let bufferLength: number = fullChunks * 4;
        if (isLast && partialChunkLength > 0) {
            bufferLength = 4;
        }
        let output = this.createBuffer(bufferLength);
        this._state = _Base64Encoder.encodeChunk(this._alphabet, bytes, start, end, isLast, output, 0, this._state);
        if (bufferLength > 0) return output;
        return null;
    }

    static encodeChunk(alphabet: string, bytes: core.DartList<number>, start: number, end: number, isLast: boolean, output: typed_data.Uint8List, outputIndex: number, state: number): number {
        let bits: number = _Base64Encoder._stateBits(state);
        let expectedChars: number = 3 - _Base64Encoder._stateCount(state);
        let byteOr: number = 0;
        for (let i: number = start; i < end; i++) {
            let byte: number = bytes[i];
            byteOr = byte;
            bits = ((bits << 8) | byte) & 16777215;
            expectedChars--;
            if (expectedChars == 0) {
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 18) & _Base64Encoder._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 12) & _Base64Encoder._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 6) & _Base64Encoder._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt(bits & _Base64Encoder._sixBitMask));
                expectedChars = 3;
                bits = 0;
            }
        }
        if (byteOr >= 0 && byteOr <= 255) {
            if (isLast && expectedChars < 3) {
                _Base64Encoder.writeFinalChunk(alphabet, output, outputIndex, 3 - expectedChars, bits);
                return 0;
            }
            return _Base64Encoder._encodeState(3 - expectedChars, bits);
        }
        let i: number = start;
        while (i < end) {
            let byte: number = bytes[i];
            if (byte < 0 || byte > 255) break;
            i++;
        }
        throw new core.ArgumentError.value(bytes, `Not a byte value at index ${i}: 0x${bytes[i].toRadixString(16)}`);
    }

    static writeFinalChunk(alphabet: string, output: typed_data.Uint8List, outputIndex: number, count: number, bits: number): void {
        /* TODO (AssertStatementImpl) : assert (count > 0); */
        ;
        if (count == 1) {
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 2) & _Base64Encoder._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits << 4) & _Base64Encoder._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
        } else {
            /* TODO (AssertStatementImpl) : assert (count == 2); */
            ;
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 10) & _Base64Encoder._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 4) & _Base64Encoder._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits << 2) & _Base64Encoder._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
        }
    }
}

@DartClass
export class _BufferCachingBase64Encoder extends _Base64Encoder {
    bufferCache: typed_data.Uint8List;

    constructor(urlSafe: boolean) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _BufferCachingBase64Encoder(urlSafe: boolean) {
        super._Base64Encoder(urlSafe);
    }

    createBuffer(bufferLength: number): typed_data.Uint8List {
        if (op(Op.EQUALS, this.bufferCache, null) || this.bufferCache.length < bufferLength) {
            this.bufferCache = new typed_data.Uint8List(bufferLength);
        }
        return new typed_data.Uint8List.view(this.bufferCache.buffer, 0, bufferLength);
    }
}

@DartClass
export class _Base64EncoderSink extends ByteConversionSinkBase {
    add(source: core.DartList<number>): void {
        this._add(source, 0, source.length, false);
    }

    close(): void {
        this._add(null, 0, 0, true);
    }

    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        if (end == null) throw new core.ArgumentError.notNull("end");
        core.RangeError.checkValidRange(start, end, source.length);
        this._add(source, start, end, isLast);
    }

    @Abstract
    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        throw 'abstract'
    }
}

@DartClass
export class _AsciiBase64EncoderSink extends _Base64EncoderSink {
    _sink: core.DartSink<string>;
    _encoder: _Base64Encoder;

    constructor(_sink: core.DartSink<string>, urlSafe: boolean) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _AsciiBase64EncoderSink(_sink: core.DartSink<string>, urlSafe: boolean) {
        this._encoder = new _BufferCachingBase64Encoder(urlSafe);
        this._sink = _sink;
    }

    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        let buffer: typed_data.Uint8List = this._encoder.encode(source, start, end, isLast);
        if (buffer != null) {
            let string: string = new core.DartString.fromCharCodes(buffer).valueOf();
            this._sink.add(string);
        }
        if (isLast) {
            this._sink.close();
        }
    }
}

@DartClass
export class _Utf8Base64EncoderSink extends _Base64EncoderSink {
    _sink: ByteConversionSink;
    _encoder: _Base64Encoder;

    constructor(_sink: ByteConversionSink, urlSafe: boolean) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Utf8Base64EncoderSink(_sink: ByteConversionSink, urlSafe: boolean) {
        this._encoder = new _Base64Encoder(urlSafe);
        this._sink = _sink;
    }

    _add(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        let buffer: typed_data.Uint8List = this._encoder.encode(source, start, end, isLast);
        if (buffer != null) {
            this._sink.addSlice(buffer, 0, buffer.length, isLast);
        }
    }
}

@DartClass
export class Base64Decoder extends Converter<string, core.DartList<number>> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Base64Decoder() {
    }

    convert(input: string, start?: number, end?: number): core.DartList<number> {
        start = start || 0;
        end = core.RangeError.checkValidRange(start, end, input.length);
        if (start == end) return new typed_data.Uint8List(0);
        let decoder = new _Base64Decoder();
        let buffer: typed_data.Uint8List = decoder.decode(input, start, end);
        decoder.close(input, end);
        return buffer;
    }

    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink {
        return new _Base64DecoderSink(sink);
    }
}

@DartClass
export class _Base64Decoder {
    static _valueShift: number = 2;
    static _countMask: number = 3;
    static _invalid: number = -2;
    static _padding: number = -1;
    static __: number = _Base64Decoder._invalid;
    static _p: number = _Base64Decoder._padding;
    static _inverseAlphabet: core.DartList<number> = new typed_data.Int8List.fromList(new core.DartList.literal(_Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder._p, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, 62, _Base64Decoder.__, 62, _Base64Decoder.__, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder._p, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, 63, _Base64Decoder.__, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__, _Base64Decoder.__));
    static _char_percent: number = 37;
    static _char_3: number = 51;
    static _char_d: number = 100;
    _state: number = 0;

    static _encodeCharacterState(count: number, bits: number): number {
        /* TODO (AssertStatementImpl) : assert (count == (count & _countMask)); */
        ;
        return (bits << _Base64Decoder._valueShift | count);
    }

    static _stateCount(state: number): number {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        return state & _Base64Decoder._countMask;
    }

    static _stateBits(state: number): number {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        return state >> _Base64Decoder._valueShift;
    }

    static _encodePaddingState(expectedPadding: number): number {
        /* TODO (AssertStatementImpl) : assert (expectedPadding >= 0); */
        ;
        /* TODO (AssertStatementImpl) : assert (expectedPadding <= 5); */
        ;
        return -expectedPadding - 1;
    }

    static _statePadding(state: number): number {
        /* TODO (AssertStatementImpl) : assert (state < 0); */
        ;
        return -state - 1;
    }

    static _hasSeenPadding(state: number): boolean {
        return state < 0;
    }

    decode(input: string, start: number, end: number): typed_data.Uint8List {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */
        ;
        /* TODO (AssertStatementImpl) : assert (start <= end); */
        ;
        /* TODO (AssertStatementImpl) : assert (end <= input.length); */
        ;
        if (_Base64Decoder._hasSeenPadding(this._state)) {
            this._state = _Base64Decoder._checkPadding(input, start, end, this._state);
            return null;
        }
        if (start == end) return new typed_data.Uint8List(0);
        let buffer: typed_data.Uint8List = _Base64Decoder._allocateBuffer(input, start, end, this._state);
        this._state = _Base64Decoder.decodeChunk(input, start, end, buffer, 0, this._state);
        return buffer;
    }

    close(input: string, end: number): void {
        if (this._state < _Base64Decoder._encodePaddingState(0)) {
            throw new core.FormatException("Missing padding character", input, end);
        }
        if (this._state > 0) {
            throw new core.FormatException("Invalid length, must be multiple of four", input, end);
        }
        this._state = _Base64Decoder._encodePaddingState(0);
    }

    static decodeChunk(input: string, start: number, end: number, output: typed_data.Uint8List, outIndex: number, state: number): number {
        /* TODO (AssertStatementImpl) : assert (!_hasSeenPadding(state)); */
        ;
        let asciiMask: number = 127;
        let asciiMax: number = 127;
        let eightBitMask: number = 255;
        let bitsPerCharacter: number = 6;
        let bits: number = _Base64Decoder._stateBits(state);
        let count: number = _Base64Decoder._stateCount(state);
        let charOr: number = 0;
        for (let i: number = start; i < end; i++) {
            let char = new core.DartString(input).codeUnitAt(i);
            charOr = char;
            let code: number = _Base64Decoder._inverseAlphabet[char & asciiMask];
            if (code >= 0) {
                bits = ((bits << bitsPerCharacter) | code) & 16777215;
                count = (count + 1) & 3;
                if (count == 0) {
                    /* TODO (AssertStatementImpl) : assert (outIndex + 3 <= output.length); */
                    ;
                    op(Op.INDEX_ASSIGN, output, outIndex++, (bits >> 16) & eightBitMask);
                    op(Op.INDEX_ASSIGN, output, outIndex++, (bits >> 8) & eightBitMask);
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits & eightBitMask);
                    bits = 0;
                }
                continue
                    ;
            } else if (code == _Base64Decoder._padding && count > 1) {
                if (charOr < 0 || charOr > asciiMax) break;
                if (count == 3) {
                    if ((bits & 3) != 0) {
                        throw new core.FormatException("Invalid encoding before padding", input, i);
                    }
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 10);
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 2);
                } else {
                    if ((bits & 15) != 0) {
                        throw new core.FormatException("Invalid encoding before padding", input, i);
                    }
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 4);
                }
                let expectedPadding: number = (3 - count) * 3;
                if (char == _Base64Decoder._char_percent) expectedPadding = 2;
                state = _Base64Decoder._encodePaddingState(expectedPadding);
                return _Base64Decoder._checkPadding(input, i + 1, end, state);
            }
            throw new core.FormatException("Invalid character", input, i);
        }
        if (charOr >= 0 && charOr <= asciiMax) {
            return _Base64Decoder._encodeCharacterState(count, bits);
        }
        let i: number;
        for (i = start; i < end; i++) {
            let char: number = new core.DartString(input).codeUnitAt(i);
            if (char < 0 || char > asciiMax) break;
        }
        throw new core.FormatException("Invalid character", input, i);
    }

    static _allocateBuffer(input: string, start: number, end: number, state: number): typed_data.Uint8List {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        let paddingStart: number = _Base64Decoder._trimPaddingChars(input, start, end);
        let length: number = _Base64Decoder._stateCount(state) + (paddingStart - start);
        let bufferLength: number = (length >> 2) * 3;
        let remainderLength: number = length & 3;
        if (remainderLength != 0 && paddingStart < end) {
            bufferLength = remainderLength - 1;
        }
        if (bufferLength > 0) return new typed_data.Uint8List(bufferLength);
        return null;
    }

    static _trimPaddingChars(input: string, start: number, end: number): number {
        let padding: number = 0;
        let index: number = end;
        let newEnd: number = end;
        while (index > start && padding < 2) {
            index--;
            let char: number = new core.DartString(input).codeUnitAt(index);
            if (char == properties._paddingChar) {
                padding++;
                newEnd = index;
                continue
                    ;
            }
            if ((char | 32) == _Base64Decoder._char_d) {
                if (index == start) break;
                index--;
                char = new core.DartString(input).codeUnitAt(index);
            }
            if (char == _Base64Decoder._char_3) {
                if (index == start) break;
                index--;
                char = new core.DartString(input).codeUnitAt(index);
            }
            if (char == _Base64Decoder._char_percent) {
                padding++;
                newEnd = index;
                continue
                    ;
            }
            break;
        }
        return newEnd;
    }

    static _checkPadding(input: string, start: number, end: number, state: number): number {
        /* TODO (AssertStatementImpl) : assert (_hasSeenPadding(state)); */
        ;
        if (start == end) return state;
        let expectedPadding: number = _Base64Decoder._statePadding(state);
        /* TODO (AssertStatementImpl) : assert (expectedPadding >= 0); */
        ;
        /* TODO (AssertStatementImpl) : assert (expectedPadding < 6); */
        ;
        while (expectedPadding > 0) {
            let char: number = new core.DartString(input).codeUnitAt(start);
            if (expectedPadding == 3) {
                if (char == properties._paddingChar) {
                    expectedPadding = 3;
                    start++;
                    break;
                }
                if (char == _Base64Decoder._char_percent) {
                    expectedPadding--;
                    start++;
                    if (start == end) break;
                    char = new core.DartString(input).codeUnitAt(start);
                } else {
                    break;
                }
            }
            let expectedPartialPadding: number = expectedPadding;
            if (expectedPartialPadding > 3) expectedPartialPadding = 3;
            if (expectedPartialPadding == 2) {
                if (char != _Base64Decoder._char_3) break;
                start++;
                expectedPadding--;
                if (start == end) break;
                char = new core.DartString(input).codeUnitAt(start);
            }
            if ((char | 32) != _Base64Decoder._char_d) break;
            start++;
            expectedPadding--;
            if (start == end) break;
        }
        if (start != end) {
            throw new core.FormatException("Invalid padding character", input, start);
        }
        return _Base64Decoder._encodePaddingState(expectedPadding);
    }
}

@DartClass
export class _Base64DecoderSink extends StringConversionSinkBase {
    _sink: core.DartSink<core.DartList<number>>;
    _decoder: _Base64Decoder = new _Base64Decoder();

    constructor(_sink: core.DartSink<core.DartList<number>>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Base64DecoderSink(_sink: core.DartSink<core.DartList<number>>) {
        this._sink = _sink;
    }

    add(string: string): void {
        if (new core.DartString(string).isEmpty) return;
        let buffer: typed_data.Uint8List = this._decoder.decode(string, 0, string.length);
        if (buffer != null) this._sink.add(buffer);
    }

    close(): void {
        this._decoder.close(null, null);
        this._sink.close();
    }

    addSlice(string: string, start: number, end: number, isLast: boolean): void {
        end = core.RangeError.checkValidRange(start, end, string.length);
        if (start == end) return;
        let buffer: typed_data.Uint8List = this._decoder.decode(string, start, end);
        if (buffer != null) this._sink.add(buffer);
        if (isLast) {
            this._decoder.close(string, end);
            this._sink.close();
        }
    }
}

@DartClass
export class _ByteAdapterSink extends ByteConversionSinkBase {
    _sink: core.DartSink<core.DartList<number>>;

    constructor(_sink: core.DartSink<core.DartList<number>>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _ByteAdapterSink(_sink: core.DartSink<core.DartList<number>>) {
        this._sink = _sink;
    }

    add(chunk: core.DartList<number>): void {
        this._sink.add(chunk);
    }

    close(): void {
        this._sink.close();
    }
}

@DartClass
export class _ByteCallbackSink extends ByteConversionSinkBase {
    static _INITIAL_BUFFER_SIZE = 1024;
    _callback: <T>(accumulated: core.DartList<number>) => void;
    _buffer: core.DartList<number> = new typed_data.Uint8List(_ByteCallbackSink._INITIAL_BUFFER_SIZE);
    _bufferIndex: number = 0;

    constructor(callback: (accumulated: core.DartList<number>) => void) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _ByteCallbackSink(callback: (accumulated: core.DartList<number>) => void) {
        this._callback = callback;
    }

    add(chunk: core.DartIterable<number>): void {
        let freeCount: number = this._buffer.length - this._bufferIndex;
        if (chunk.length > freeCount) {
            let oldLength: number = this._buffer.length;
            let newLength: number = _ByteCallbackSink._roundToPowerOf2(chunk.length + oldLength) * 2;
            let grown: core.DartList<number> = new typed_data.Uint8List(newLength);
            grown.setRange(0, this._buffer.length, this._buffer);
            this._buffer = grown;
        }
        this._buffer.setRange(this._bufferIndex, this._bufferIndex + chunk.length, chunk);
        this._bufferIndex = chunk.length;
    }

    static _roundToPowerOf2(v: number): number {
        /* TODO (AssertStatementImpl) : assert (v > 0); */
        ;
        v--;
        v = v >> 1;
        v = v >> 2;
        v = v >> 4;
        v = v >> 8;
        v = v >> 16;
        v++;
        return v;
    }

    close(): void {
        this._callback(this._buffer.sublist(0, this._bufferIndex));
    }
}


@DartClass
export class _SimpleCallbackSink<T> extends ChunkedConversionSink<T> {
    _callback: <T>(accumulated: core.DartList<T>) => void;
    _accumulated: core.DartList<T> = new core.DartList.literal<T>();

    constructor(_callback: <T>(accumulated: core.DartList<T>) => void) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _SimpleCallbackSink(_callback: <T>(accumulated: core.DartList<T>) => void) {
        this._callback = _callback;
    }

    add(chunk: T): void {
        this._accumulated.add(chunk);
    }

    close(): void {
        this._callback(this._accumulated);
    }
}

@DartClass
@Implements(async.DartEventSink)
export class _ConverterStreamEventSink<S, T> implements async.DartEventSink<S> {
    _eventSink: async.DartEventSink<T>;
    _chunkedSink: core.DartSink<S>;

    constructor(converter: Converter<S, T>, sink: async.DartEventSink<T>) {
    }

    @defaultConstructor
    _ConverterStreamEventSink(converter: Converter<S, T>, sink: async.DartEventSink<T>) {
        this._eventSink = sink;
        this._chunkedSink = converter.startChunkedConversion(sink);
    }

    add(o: S): void {
        this._chunkedSink.add(o);
    }

    addError(error: core.DartObject, stackTrace?: core.DartStackTrace): void {
        this._eventSink.addError(error, stackTrace);
    }

    close(): void {
        this._chunkedSink.close();
    }
}

@DartClass
export class _FusedCodec<S, M, T> extends Codec<S, T> {
    _first: Codec<S, M>;
    _second: Codec<M, T>;

    get encoder(): Converter<S, T> {
        return this._first.encoder.fuse(this._second.encoder);
    }

    get decoder(): Converter<T, S> {
        return this._second.decoder.fuse(this._first.decoder);
    }

    constructor(_first: Codec<S, M>, _second: Codec<M, T>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _FusedCodec(_first: Codec<S, M>, _second: Codec<M, T>) {
        this._first = _first;
        this._second = _second;
    }
}

@DartClass
export class _InvertedCodec<T, S> extends Codec<T, S> {
    _codec: Codec<S, T>;

    constructor(codec: Codec<S, T>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _InvertedCodec(codec: Codec<S, T>) {
        this._codec = codec;
    }

    get encoder(): Converter<T, S> {
        return this._codec.decoder;
    }

    get decoder(): Converter<S, T> {
        return this._codec.encoder;
    }

    get inverted(): Codec<S, T> {
        return this._codec;
    }
}

@DartClass
export class _FusedConverter<S, M, T> extends Converter<S, T> {
    _first: Converter<S, M>;
    _second: Converter<M, T>;

    constructor(_first: Converter<S, M>, _second: Converter<M, T>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _FusedConverter(_first: Converter<S, M>, _second: Converter<M, T>) {
        this._first = _first;
        this._second = _second;
    }

    convert(input: S): T {
        return this._second.convert(this._first.convert(input));
    }

    startChunkedConversion(sink: core.DartSink<any>): core.DartSink<any> {
        return this._first.startChunkedConversion(this._second.startChunkedConversion(sink));
    }
}

@DartClass
export class HtmlEscapeMode {
    _name: string;
    escapeLtGt: boolean;
    escapeQuot: boolean;
    escapeApos: boolean;
    escapeSlash: boolean;

    @namedConstructor
    _(_name: string, escapeLtGt: boolean, escapeQuot: boolean, escapeApos: boolean, escapeSlash: boolean) {
        this._name = _name;
        this.escapeLtGt = escapeLtGt;
        this.escapeQuot = escapeQuot;
        this.escapeApos = escapeApos;
        this.escapeSlash = escapeSlash;
    }

    static _: new(_name: string, escapeLtGt: boolean, escapeQuot: boolean, escapeApos: boolean, escapeSlash: boolean) => HtmlEscapeMode;

    static UNKNOWN: HtmlEscapeMode;
    static ATTRIBUTE: HtmlEscapeMode;
    static SQ_ATTRIBUTE: HtmlEscapeMode;
    static ELEMENT: HtmlEscapeMode;


    constructor(_namedArguments?: { name?: string, escapeLtGt?: boolean, escapeQuot?: boolean, escapeApos?: boolean, escapeSlash?: boolean }) {
    }

    @defaultConstructor
    HtmlEscapeMode(_namedArguments?: { name?: string, escapeLtGt?: boolean, escapeQuot?: boolean, escapeApos?: boolean, escapeSlash?: boolean }) {
        let {name, escapeLtGt, escapeQuot, escapeApos, escapeSlash} = Object.assign({
            "name": "custom",
            "escapeLtGt": false,
            "escapeQuot": false,
            "escapeApos": false,
            "escapeSlash": false
        }, _namedArguments);
        this._name = name;
        this.escapeLtGt = escapeLtGt;
        this.escapeQuot = escapeQuot;
        this.escapeApos = escapeApos;
        this.escapeSlash = escapeSlash;
    }

    toString(): string {
        return this._name;
    }
}

// Need to set this later because of decorator precedence
HtmlEscapeMode.UNKNOWN = new HtmlEscapeMode._('unknown', true, true, true, true);
HtmlEscapeMode.ATTRIBUTE = new HtmlEscapeMode._('attribute', true, true, false, false);
HtmlEscapeMode.SQ_ATTRIBUTE = new HtmlEscapeMode._('attribute', true, false, true, false);
HtmlEscapeMode.ELEMENT = new HtmlEscapeMode._('element', true, false, false, false);

@DartClass
export class HtmlEscape extends Converter<string, string> {
    mode: HtmlEscapeMode;

    constructor(mode?: HtmlEscapeMode) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    HtmlEscape(mode?: HtmlEscapeMode) {
        mode = mode || HtmlEscapeMode.UNKNOWN;
        this.mode = mode;
    }

    convert(text: string): string {
        let val = this._convert(text, 0, text.length);
        return val == null ? text : val;
    }

    _convert(text: string, start: number, end: number): string {
        let result: core.DartStringBuffer = null;
        for (let i: number = start; i < end; i++) {
            let ch = text[i];
            let replacement: string = null;
            switch (ch) {
                case '&':
                    replacement = '&amp;';
                    break;
                case '"':
                    if (this.mode.escapeQuot) replacement = '&quot;';
                    break;
                case "'":
                    if (this.mode.escapeApos) replacement = '&#39;';
                    break;
                case '<':
                    if (this.mode.escapeLtGt) replacement = '&lt;';
                    break;
                case '>':
                    if (this.mode.escapeLtGt) replacement = '&gt;';
                    break;
                case '/':
                    if (this.mode.escapeSlash) replacement = '&#47;';
                    break;
            }
            if (replacement != null) {
                if (op(Op.EQUALS, result, null)) result = new core.DartStringBuffer();
                if (i > start) result.write(text.substring(start, i));
                result.write(replacement);
                start = i + 1;
            }
        }
        if (op(Op.EQUALS, result, null)) return null;
        if (end > start) result.write(text.substring(start, end));
        return result.toString();
    }

    startChunkedConversion(sink: core.DartSink<string>): StringConversionSink {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        }
        return new _HtmlEscapeSink(this, sink as any);
    }
}

@DartClass
export class _HtmlEscapeSink extends StringConversionSinkBase {
    _escape: HtmlEscape;
    _sink: StringConversionSink;

    constructor(_escape: HtmlEscape, _sink: StringConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _HtmlEscapeSink(_escape: HtmlEscape, _sink: StringConversionSink) {
        this._escape = _escape;
        this._sink = _sink;
    }

    addSlice(chunk: string, start: number, end: number, isLast: boolean): void {
        let val = this._escape._convert(chunk, start, end);
        if (val == null) {
            this._sink.addSlice(chunk, start, end, isLast);
        } else {
            this._sink.add(val);
            if (isLast) this._sink.close();
        }
    }

    close(): void {
        this._sink.close();
    }
}

@DartClass
export class JsonUnsupportedObjectError extends core.DartError {
    unsupportedObject;
    cause;

    constructor(unsupportedObject: any, _namedArguments?: { cause?: any }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonUnsupportedObjectError(unsupportedObject: any, _namedArguments?: { cause?: any }) {
        let {cause} = Object.assign({}, _namedArguments);
        this.unsupportedObject = unsupportedObject;
        this.cause = cause;
    }

    toString(): string {
        if (this.cause != null) {
            return "Converting object to an encodable object failed.";
        } else {
            return "Converting object did not return an encodable object.";
        }
    }
}

@DartClass
export class JsonCyclicError extends JsonUnsupportedObjectError {
    constructor(object: core.DartObject) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonCyclicError(object: core.DartObject) {
        super.JsonUnsupportedObjectError(object);
    }

    toString(): string {
        return "Cyclic error in JSON stringify";
    }
}

@DartClass
export class JsonCodec extends Codec<core.DartObject, string> {
    _reviver: (key: any, value: any) => any;
    _toEncodable: (o: any) => any;

    constructor(_namedArguments?: { reviver?: (key: any, value: any) => any, toEncodable?: (object: any) => any }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonCodec(_namedArguments?: { reviver?: (key: any, value: any) => any, toEncodable?: (object: any) => any }) {
        let {reviver, toEncodable} = Object.assign({}, _namedArguments);
        this._reviver = reviver;
        this._toEncodable = toEncodable;
    }

    @namedConstructor
    withReviver(reviver: (key: any, value: any) => any) {
        this.JsonCodec({
            reviver: reviver
        });
    }

    static withReviver: new(reviver: (key: any, value: any) => any) => JsonCodec;

    decode(source: string, _namedArguments?: { reviver?: (key: any, value: any) => any }): any {
        let {reviver} = Object.assign({}, _namedArguments);
        if (op(Op.EQUALS, reviver, null)) reviver = this._reviver;
        if (op(Op.EQUALS, reviver, null)) return this.decoder.convert(source);
        return new JsonDecoder(reviver).convert(source);
    }

    encode(value: any, _namedArguments?: { toEncodable?: (object: any) => any }): string {
        let {toEncodable} = Object.assign({}, _namedArguments);
        if (op(Op.EQUALS, toEncodable, null)) toEncodable = this._toEncodable;
        if (op(Op.EQUALS, toEncodable, null)) return this.encoder.convert(value);
        return new JsonEncoder(toEncodable).convert(value);
    }

    get encoder(): JsonEncoder {
        if (op(Op.EQUALS, this._toEncodable, null)) return new JsonEncoder();
        return new JsonEncoder(this._toEncodable);
    }

    get decoder(): JsonDecoder {
        if (op(Op.EQUALS, this._reviver, null)) return new JsonDecoder();
        return new JsonDecoder(this._reviver);
    }
}

@DartClass
export class JsonEncoder extends Converter<core.DartObject, string> {
    indent: string;
    _toEncodable: (o: any) => any;

    constructor(toEncodable?: (object: any) => any) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonEncoder(toEncodable?: (object: any) => any) {
        this.indent = null;
        this._toEncodable = toEncodable;
    }

    @namedConstructor
    withIndent(indent: string, toEncodable?: (object: any) => any) {
        this._toEncodable = toEncodable;
        this.indent = indent;
    }

    static withIndent: new(indent: string, toEncodable: (object: any) => any) => JsonEncoder;

    convert(object: core.DartObject): string {
        return _JsonStringStringifier.stringify(object, this._toEncodable, this.indent);
    }

    startChunkedConversion(sink: core.DartSink<string>): ChunkedConversionSink<core.DartObject> {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        } else if (is(sink, _Utf8EncoderSink)) {
            return new _JsonUtf8EncoderSink(sink._sink, this._toEncodable, JsonUtf8Encoder._utf8Encode(this.indent), JsonUtf8Encoder.DEFAULT_BUFFER_SIZE);
        }
        return new _JsonEncoderSink(sink as any, this._toEncodable, this.indent);
    }

    bind(stream: async.DartStream<core.DartObject>): async.DartStream<string> {
        return super.bind(stream);
    }

    fuse<T>(other: Converter<string, T>): Converter<core.DartObject, T> {
        if (is(other, Utf8Encoder)) {
            return new JsonUtf8Encoder(this.indent, this._toEncodable) as any;
        }
        return super.fuse(other);
    }
}

@DartClass
export class JsonUtf8Encoder extends Converter<core.DartObject, core.DartList<number>> {
    static DEFAULT_BUFFER_SIZE: number = 256;
    _indent: core.DartList<number>;
    _toEncodable: (o: any) => any;
    _bufferSize: number;

    constructor(indent?: string, toEncodable?: (object: any) => any, bufferSize?: number) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonUtf8Encoder(indent?: string, toEncodable?: (object: any) => any, bufferSize?: number) {
        bufferSize = bufferSize || JsonUtf8Encoder.DEFAULT_BUFFER_SIZE;
        this._indent = JsonUtf8Encoder._utf8Encode(indent);
        this._toEncodable = toEncodable;
        this._bufferSize = bufferSize;
    }

    static _utf8Encode(string: string): core.DartList<number> {
        if (string == null) return null;
        if (new core.DartString(string).isEmpty) return new typed_data.Uint8List(0);
        /* TODO (LabeledStatementImpl) : checkAscii: {for (int i = 0; i < string.length; i++) {if (new core.DartString(string).codeUnitAt(i) >= 0x80) break checkAscii;} return string.codeUnits;} */
        ;
        return properties.UTF8.encode(string);
    }

    convert(object: core.DartObject): core.DartList<number> {
        let bytes: core.DartList<core.DartList<number>> = new core.DartList.literal();
        var addChunk: (chunk: typed_data.Uint8List, start: number, end: number) => void = (chunk: typed_data.Uint8List, start: number, end: number): void => {
            if (start > 0 || end < chunk.length) {
                let length: number = end - start;
                chunk = new typed_data.Uint8List.view(chunk.buffer, chunk.offsetInBytes + start, length);
            }
            bytes.add(chunk);
        };
        _JsonUtf8Stringifier.stringify(object, this._indent, this._toEncodable, this._bufferSize, addChunk);
        if (bytes.length == 1) return bytes[0];
        let length: number = 0;
        for (let i: number = 0; i < bytes.length; i++) {
            length = bytes[i].length;
        }
        let result: typed_data.Uint8List = new typed_data.Uint8List(length);
        for (let i: number = 0, offset: number = 0; i < bytes.length; i++) {
            let byteList = bytes[i];
            let end: number = offset + byteList.length;
            result.setRange(offset, end, byteList);
            offset = end;
        }
        return result;
    }

    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): ChunkedConversionSink<core.DartObject> {
        let byteSink: ByteConversionSink;
        if (is(sink, ByteConversionSink)) {
            byteSink = sink;
        } else {
            byteSink = new ByteConversionSink.from(sink);
        }
        return new _JsonUtf8EncoderSink(byteSink, this._toEncodable, this._indent, this._bufferSize);
    }

    bind(stream: async.DartStream<core.DartObject>): async.DartStream<core.DartList<number>> {
        return super.bind(stream);
    }
}

@DartClass
export class _JsonEncoderSink extends ChunkedConversionSink<core.DartObject> {
    _indent: string;
    _toEncodable: (o: any) => any;
    _sink: StringConversionSink;
    _isDone: boolean = false;

    constructor(_sink: StringConversionSink, _toEncodable: (o: any) => any, _indent: string) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonEncoderSink(_sink: StringConversionSink, _toEncodable: (o: any) => any, _indent: string) {
        this._sink = _sink;
        this._toEncodable = _toEncodable;
        this._indent = _indent;
    }

    add(o: core.DartObject): void {
        if (this._isDone) {
            throw new core.StateError("Only one call to add allowed");
        }
        this._isDone = true;
        let stringSink: ClosableStringSink = this._sink.asStringSink();
        _JsonStringStringifier.printOn(o, stringSink, this._toEncodable, this._indent);
        stringSink.close();
    }

    close(): void {
    }
}

@DartClass
export class _JsonUtf8EncoderSink extends ChunkedConversionSink<core.DartObject> {
    _sink: ByteConversionSink;
    _indent: core.DartList<number>;
    _toEncodable: (o: any) => any;
    _bufferSize: number;
    _isDone: boolean = false;

    constructor(_sink: ByteConversionSink, _toEncodable: (o: any) => any, _indent: core.DartList<number>, _bufferSize: number) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonUtf8EncoderSink(_sink: ByteConversionSink, _toEncodable: (o: any) => any, _indent: core.DartList<number>, _bufferSize: number) {
        this._sink = _sink;
        this._toEncodable = _toEncodable;
        this._indent = _indent;
        this._bufferSize = _bufferSize;
    }

    _addChunk(chunk: typed_data.Uint8List, start: number, end: number): void {
        this._sink.addSlice(chunk, start, end, false);
    }

    add(object: core.DartObject): void {
        if (this._isDone) {
            throw new core.StateError("Only one call to add allowed");
        }
        this._isDone = true;
        _JsonUtf8Stringifier.stringify(object, this._indent, this._toEncodable, this._bufferSize, this._addChunk.bind(this));
        this._sink.close();
    }

    close(): void {
        if (!this._isDone) {
            this._isDone = true;
            this._sink.close();
        }
    }
}

@DartClass
export class JsonDecoder extends Converter<string, core.DartObject> {
    _reviver: (key: any, value: any) => any;

    constructor(reviver?: (key: any, value: any) => any) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    JsonDecoder(reviver?: (key: any, value: any) => any) {
        this._reviver = reviver;
    }

    convert(input: string): any {
        return _parseJson(input, this._reviver);
    }

    startChunkedConversion(sink: core.DartSink<core.DartObject>): StringConversionSink {
        return new _JsonDecoderSink(this._reviver, sink);
    }

    bind(stream: async.DartStream<string>): async.DartStream<core.DartObject> {
        return super.bind(stream);
    }
}

export var _parseJson: (source: string, reviver: (key: any, value: any) => any) => any = (source: string, reviver: (key: any, value: any) => any) => {
    if (isNot(source, 'string')) throw core.argumentErrorValue(source);

    let parsed;
    try {
        parsed = JSON.parse(source);
    } catch (e) {
        throw new core.FormatException(e.toString());
    }

    if (reviver == null) {
        return _convertJsonToDartLazy(parsed);
    } else {
        return _convertJsonToDart(parsed, reviver);
    }
};


export var _convertJsonToDart: (json: any, reviver: (key: any, value: any) => any) => any = (json: any, reviver: (key: any, value: any) => any) => {
    /* TODO (AssertStatementImpl) : assert (reviver != null); */
    ;
    var walk: (e: any) => any = (e: any) => {
        if (e == null/* JS('bool', '# == null', e) */ || typeof e != "object"/* JS('bool', 'typeof # != "object"', e) */) {
            return e;
        }
        if (Object.getPrototypeOf(e) === Array.prototype/* JS('bool', 'Object.getPrototypeOf(#) === Array.prototype', e) */) {
            for (let i: number = 0; i < e.length/* JS('int', '#.length', e) */; i++) {
                let item = e[i]/* JS('', '#[#]', e, i) */;
                e[i] = reviver(i, walk(item))/* JS('', '#[#]=#', e, i, reviver(i, walk(item))) */;
            }
            return e;
        }
        let map: _JsonMap = new _JsonMap(e);
        let processed = map._processed;
        let keys: core.DartList<string> = map._computeKeys();
        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];
            let revived = reviver(key, walk(e[key]/* JS('', '#[#]', e, key) */));
            processed[key] = revived/* JS('', '#[#]=#', processed, key, revived) */;
        }
        map._original = processed;
        return map;
    };
    return reviver(null, walk(json));
};
export var _convertJsonToDartLazy: (object: any) => any = (object: any) => {
    if (op(Op.EQUALS, object, null)) return null;
    if (typeof object != "object"/* JS('bool', 'typeof # != "object"', object) */) {
        return object;
    }
    if (Object.getPrototypeOf(object) !== Array.prototype/* JS('bool', 'Object.getPrototypeOf(#) !== Array.prototype', object) */) {
        return new _JsonMap(object);
    }
    for (let i: number = 0; i < object.length/* JS('int', '#.length', object) */; i++) {
        let item = object[i]/* JS('', '#[#]', object, i) */;
        object[i] = _convertJsonToDartLazy(item)/* JS('', '#[#]=#', object, i, _convertJsonToDartLazy(item)) */;
    }
    return object;
};

@DartClass
@Implements(core.DartMap)
export class _JsonMap implements core.DartMap<string, any> {
    _original;
    _processed;
    _data;

    constructor(_original: any) {
    }

    @defaultConstructor
    _JsonMap(_original: any) {
        this._original = _original;
        this._processed = _JsonMap._newJavaScriptObject();
        this._data = null;
    }

    [OperatorMethods.INDEX](key: any) {
        return this.get(key);
    }

    get(key: any) {
        if (this._isUpgraded) {
            return this._upgradedMap.get(key);
        } else if (isNot(key, "string")) {
            return null;
        } else {
            let result = _JsonMap._getProperty(this._processed, key);
            if (_JsonMap._isUnprocessed(result)) result = this._process(key);
            return result;
        }
    }

    get length(): number {
        return this._isUpgraded ? this._upgradedMap.length : this._computeKeys().length;
    }

    get isEmpty(): boolean {
        return this.length == 0;
    }

    get isNotEmpty(): boolean {
        return this.length > 0;
    }

    get keys(): core.DartIterable<string> {
        if (this._isUpgraded) return this._upgradedMap.keys;
        return new _JsonMapKeyIterable(this);
    }

    get values(): core.DartIterable<any> {
        if (this._isUpgraded) return this._upgradedMap.values;
        return new core.DartMappedIterable(this._computeKeys(), (each: any) => {
            return op(Op.INDEX, this, each);
        });
    }

    [OperatorMethods.INDEX_EQ](key: any, value: any) {
        this.set(key, value);
    }

    set(key: any, value: any) {
        if (this._isUpgraded) {
            this._upgradedMap.set(key, value);
        } else if (this.containsKey(key)) {
            let processed = this._processed;
            _JsonMap._setProperty(processed, key, value);
            let original = this._original;
            if (!core.identical(original, processed)) {
                _JsonMap._setProperty(original, key, null);
            }
        } else {
            this._upgrade().set(key, value);
        }
    }

    addAll(other: core.DartMap<any, any>): void {
        other.forEach((key: any, value: any) => {
            op(Op.INDEX_ASSIGN, this, key, value);
        });
    }

    containsValue(value: any): boolean {
        if (this._isUpgraded) return this._upgradedMap.containsValue(value);
        let keys: core.DartList<string> = this._computeKeys();
        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];
            if (op(Op.EQUALS, op(Op.INDEX, this, key), value)) return true;
        }
        return false;
    }

    containsKey(key: any): boolean {
        if (this._isUpgraded) return this._upgradedMap.containsKey(key);
        if (isNot(key, "string")) return false;
        return _JsonMap._hasProperty(this._original, key);
    }

    putIfAbsent(key: any, ifAbsent: () => any) {
        if (this.containsKey(key)) return op(Op.INDEX, this, key);
        let value = ifAbsent();
        op(Op.INDEX_ASSIGN, this, key, value);
        return value;
    }

    remove(key: core.DartObject) {
        if (!this._isUpgraded && !this.containsKey(key)) return null;
        return this._upgrade().remove(key);
    }

    clear(): void {
        if (this._isUpgraded) {
            this._upgradedMap.clear();
        } else {
            if (this._data != null) {
                this._data.clear();
            }
            this._original = this._processed = null;
            this._data = new core.DartMap.literal([]);
        }
    }

    forEach(f: (key: any, value: any) => void): void {
        if (this._isUpgraded) return this._upgradedMap.forEach(f);
        let keys: core.DartList<string> = this._computeKeys();
        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];
            let value = _JsonMap._getProperty(this._processed, key);
            if (_JsonMap._isUnprocessed(value)) {
                value = _convertJsonToDartLazy(_JsonMap._getProperty(this._original, key));
                _JsonMap._setProperty(this._processed, key, value);
            }
            f(key, value);
            if (!core.identical(keys, this._data)) {
                throw new core.ConcurrentModificationError(this);
            }
        }
    }

    toString(): string {
        return core.DartMaps.mapToString(this);
    }

    get _isUpgraded(): boolean {
        return op(Op.EQUALS, this._processed, null);
    }

    get _upgradedMap(): core.DartMap<any, any> {
        /* TODO (AssertStatementImpl) : assert (_isUpgraded); */
        ;
        return this._data/* JS('LinkedHashMap', '#', _data) */;
    }

    _computeKeys(): core.DartList<string> {
        /* TODO (AssertStatementImpl) : assert (!_isUpgraded); */
        ;
        let keys: core.DartList<any> = this._data;
        if (keys == null) {
            keys = this._data = _JsonMap._getPropertyNames(this._original);
        }
        return keys/* JS('JSExtendableArray', '#', keys) */;
    }

    _upgrade(): core.DartMap<string, any> {
        if (this._isUpgraded) return this._upgradedMap;
        let result: core.DartMap<any, any> = new core.DartMap.literal([]);
        let keys: core.DartList<string> = this._computeKeys();
        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];
            result.set(key, op(Op.INDEX, this, key));
        }
        if (keys.isEmpty) {
            keys.add(null);
        } else {
            keys.clear();
        }
        this._original = this._processed = null;
        this._data = result;
        /* TODO (AssertStatementImpl) : assert (_isUpgraded); */
        ;
        return result;
    }

    _process(key: string) {
        if (!_JsonMap._hasProperty(this._original, key)) return null;
        let result = _convertJsonToDartLazy(_JsonMap._getProperty(this._original, key));
        return _JsonMap._setProperty(this._processed, key, result);
    }

    static _hasProperty(object: any, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(object, key)/* JS('bool', 'Object.prototype.hasOwnProperty.call(#,#)', object, key) */;
    }

    static _getProperty(object: any, key: string) {
        return object[key]/* JS('', '#[#]', object, key) */;
    }

    static _setProperty(object: any, key: string, value: any) {
        return object[key] = value/* JS('', '#[#]=#', object, key, value) */;
    }

    static _getPropertyNames(object: any): core.DartList<any> {
        return Object.keys(object)/* JS('JSExtendableArray', 'Object.keys(#)', object) */;
    }

    static _isUnprocessed(object: any): boolean {
        return typeof(object) == "undefined"/* JS('bool', 'typeof(#)=="undefined"', object) */;
    }

    static _newJavaScriptObject() {
        return Object.create(null)/* JS('=Object', 'Object.create(null)') */;
    }
}

@DartClass
export class _JsonMapKeyIterable extends core.DartListIterable<string> {
    _parent: _JsonMap;

    constructor(_parent: _JsonMap) {
        super();
    }

    @defaultConstructor
    _JsonMapKeyIterable(_parent: _JsonMap) {
        this._parent = _parent;
    }

    get length(): number {
        return this._parent.length;
    }

    elementAt(index: number): string {
        return this._parent._isUpgraded ? this._parent.keys.elementAt(index) : this._parent._computeKeys()[index];
    }

    get iterator(): core.DartIterator<string> {
        return this._parent._isUpgraded ? this._parent.keys.iterator : this._parent._computeKeys().iterator;
    }

    contains(key: core.DartObject): boolean {
        return this._parent.containsKey(key);
    }
}


export var _defaultToEncodable: (object: any) => any = (object: any): any => {
    return object.toJson();
};

@DartClass
export class _JsonStringifier {
    static BACKSPACE: number = 8;
    static TAB: number = 9;
    static NEWLINE: number = 10;
    static CARRIAGE_RETURN: number = 13;
    static FORM_FEED: number = 12;
    static QUOTE: number = 34;
    static CHAR_0: number = 48;
    static BACKSLASH: number = 92;
    static CHAR_b: number = 98;
    static CHAR_f: number = 102;
    static CHAR_n: number = 110;
    static CHAR_r: number = 114;
    static CHAR_t: number = 116;
    static CHAR_u: number = 117;
    _seen: core.DartList<any> = new core.DartList<any>();
    _toEncodable: (o: any) => any;

    constructor(toEncodable: (o: any) => any) {
    }

    @defaultConstructor
    _JsonStringifier(toEncodable: (o: any) => any) {
        this._seen = new core.DartList();
        this._toEncodable = toEncodable || _defaultToEncodable;
    }

    @Abstract
    writeString(characters: string): void {
        throw 'abstract'
    }

    @Abstract
    writeStringSlice(characters: string, start: number, end: number): void {
        throw 'abstract'
    }

    @Abstract
    writeCharCode(charCode: number): void {
        throw 'abstract'
    }

    @Abstract
    writeNumber(number: number): void {
        throw 'abstract'
    }

    static hexDigit(x: number): number {
        return x < 10 ? 48 + x : 87 + x;
    }

    writeStringContent(s: string): void {
        let offset: number = 0;
        let length: number = s.length;
        for (let i: number = 0; i < length; i++) {
            let charCode: number = new core.DartString(s).codeUnitAt(i);
            if (charCode > _JsonStringifier.BACKSLASH) continue;
            if (charCode < 32) {
                if (i > offset) this.writeStringSlice(s, offset, i);
                offset = i + 1;
                this.writeCharCode(_JsonStringifier.BACKSLASH);
                switch (charCode) {
                    case _JsonStringifier.BACKSPACE:
                        this.writeCharCode(_JsonStringifier.CHAR_b);
                        break;
                    case _JsonStringifier.TAB:
                        this.writeCharCode(_JsonStringifier.CHAR_t);
                        break;
                    case _JsonStringifier.NEWLINE:
                        this.writeCharCode(_JsonStringifier.CHAR_n);
                        break;
                    case _JsonStringifier.FORM_FEED:
                        this.writeCharCode(_JsonStringifier.CHAR_f);
                        break;
                    case _JsonStringifier.CARRIAGE_RETURN:
                        this.writeCharCode(_JsonStringifier.CHAR_r);
                        break;
                    default:
                        this.writeCharCode(_JsonStringifier.CHAR_u);
                        this.writeCharCode(_JsonStringifier.CHAR_0);
                        this.writeCharCode(_JsonStringifier.CHAR_0);
                        this.writeCharCode(_JsonStringifier.hexDigit((charCode >> 4) & 15));
                        this.writeCharCode(_JsonStringifier.hexDigit(charCode & 15));
                        break;
                }
            } else if (charCode == _JsonStringifier.QUOTE || charCode == _JsonStringifier.BACKSLASH) {
                if (i > offset) this.writeStringSlice(s, offset, i);
                offset = i + 1;
                this.writeCharCode(_JsonStringifier.BACKSLASH);
                this.writeCharCode(charCode);
            }
        }
        if (offset == 0) {
            this.writeString(s);
        } else if (offset < length) {
            this.writeStringSlice(s, offset, length);
        }
    }

    _checkCycle(object: any): void {
        for (let i: number = 0; i < this._seen.length; i++) {
            if (core.identical(object, this._seen[i])) {
                throw new JsonCyclicError(object);
            }
        }
        this._seen.add(object);
    }

    _removeSeen(object: any): void {
        /* TODO (AssertStatementImpl) : assert (!_new core.DartString(seen).isEmpty); */
        ;
        /* TODO (AssertStatementImpl) : assert (identical(_seen.last, object)); */
        ;
        this._seen.removeLast();
    }

    writeObject(object: any): void {
        if (this.writeJsonValue(object)) return;
        this._checkCycle(object);
        try {
            let customJson = this._toEncodable(object);
            if (!this.writeJsonValue(customJson)) {
                throw new JsonUnsupportedObjectError(object);
            }
            this._removeSeen(object);
        } catch (e) {
            throw new JsonUnsupportedObjectError(object, {
                cause: e
            });
        }
    }

    writeJsonValue(object: any): boolean {
        if (is(object, "number")) {
            if (!new core.DartNumber(object).isFinite) return false;
            this.writeNumber(object);
            return true;
        } else if (core.identical(object, true)) {
            this.writeString('true');
            return true;
        } else if (core.identical(object, false)) {
            this.writeString('false');
            return true;
        } else if (op(Op.EQUALS, object, null)) {
            this.writeString('null');
            return true;
        } else if (is(object, "string")) {
            this.writeString('"');
            this.writeStringContent(object);
            this.writeString('"');
            return true;
        } else if (is(object, core.DartList)) {
            this._checkCycle(object);
            this.writeList(object);
            this._removeSeen(object);
            return true;
        } else if (is(object, core.DartMap)) {
            this._checkCycle(object);
            let success = this.writeMap(object);
            this._removeSeen(object);
            return success;
        } else {
            return false;
        }
    }

    writeList(list: core.DartList<any>): void {
        this.writeString('[');
        if (list.length > 0) {
            this.writeObject(list[0]);
            for (let i: number = 1; i < list.length; i++) {
                this.writeString(',');
                this.writeObject(list[i]);
            }
        }
        this.writeString(']');
    }

    writeMap(map: core.DartMap<any, any>): boolean {
        if (map.isEmpty) {
            this.writeString("{}");
            return true;
        }
        let keyValueList: core.DartList<any> = new core.DartList<any>(map.length * 2);
        let i: number = 0;
        let allStringKeys: boolean = true;
        map.forEach((key: any, value: any) => {
            if (isNot(key, "string")) {
                allStringKeys = false;
            }
            keyValueList[i++] = key;
            keyValueList[i++] = value;
        });
        if (!allStringKeys) return false;
        this.writeString('{');
        let separator: string = '"';
        for (let i: number = 0; i < keyValueList.length; i = 2) {
            this.writeString(separator);
            separator = ',"';
            this.writeStringContent(keyValueList[i]);
            this.writeString('":');
            this.writeObject(keyValueList[i + 1]);
        }
        this.writeString('}');
        return true;
    }
}

@DartClass
@Implements(_JsonStringifier)
export class _JsonPrettyPrintMixin extends _JsonStringifier {
    _indentLevel: number = 0;

    @Abstract
    writeIndentation(indentLevel: number): void {
        throw 'abstract'
    }

    writeList(list: core.DartList<any>): void {
        if (list.isEmpty) {
            this.writeString('[]');
        } else {
            this.writeString('[\n');
            this._indentLevel++;
            this.writeIndentation(this._indentLevel);
            this.writeObject(list[0]);
            for (let i: number = 1; i < list.length; i++) {
                this.writeString(',\n');
                this.writeIndentation(this._indentLevel);
                this.writeObject(list[i]);
            }
            this.writeString('\n');
            this._indentLevel--;
            this.writeIndentation(this._indentLevel);
            this.writeString(']');
        }
    }

    writeMap(map: core.DartMap<any, any>): boolean {
        if (map.isEmpty) {
            this.writeString("{}");
            return true;
        }
        let keyValueList: core.DartList<any> = new core.DartList<any>(map.length * 2);
        let i: number = 0;
        let allStringKeys: boolean = true;
        map.forEach((key: any, value: any) => {
            if (isNot(key, "string")) {
                allStringKeys = false;
            }
            keyValueList[i++] = key;
            keyValueList[i++] = value;
        });
        if (!allStringKeys) return false;
        this.writeString('{\n');
        this._indentLevel++;
        let separator: string = "";
        for (let i: number = 0; i < keyValueList.length; i = 2) {
            this.writeString(separator);
            separator = ",\n";
            this.writeIndentation(this._indentLevel);
            this.writeString('"');
            this.writeStringContent(keyValueList[i]);
            this.writeString('": ');
            this.writeObject(keyValueList[i + 1]);
        }
        this.writeString('\n');
        this._indentLevel--;
        this.writeIndentation(this._indentLevel);
        this.writeString('}');
        return true;
    }
}

@DartClass
export class _JsonStringStringifier extends _JsonStringifier {
    _sink: core.DartStringSink;

    constructor(_sink: core.DartStringSink, _toEncodable: any) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonStringStringifier(_sink: core.DartStringSink, _toEncodable: any) {
        super._JsonStringifier(_toEncodable);
        this._sink = _sink;
    }

    static stringify(object: any, toEncodable: (o: any) => any, indent: string): string {
        let output: core.DartStringBuffer = new core.DartStringBuffer();
        _JsonStringStringifier.printOn(object, output, toEncodable, indent);
        return output.toString();
    }

    static printOn(object: any, output: core.DartStringSink, toEncodable: (o: any) => any, indent: string): void {
        let stringifier;
        if (indent == null) {
            stringifier = new _JsonStringStringifier(output, toEncodable);
        } else {
            stringifier = new _JsonStringStringifierPretty(output, toEncodable, indent);
        }
        stringifier.writeObject(object);
    }

    writeNumber(number: number): void {
        this._sink.write(new core.DartNumber(number).toString());
    }

    writeString(string: string): void {
        this._sink.write(string);
    }

    writeStringSlice(string: string, start: number, end: number): void {
        this._sink.write(string.substring(start, end));
    }

    writeCharCode(charCode: number): void {
        this._sink.writeCharCode(charCode);
    }
}

@DartClass
export class _JsonStringStringifierPretty extends _JsonStringStringifier {
    _indent: string;

    constructor(sink: core.DartStringSink, toEncodable: (o: any) => any, _indent: string) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonStringStringifierPretty(sink: core.DartStringSink, toEncodable: (o: any) => any, _indent: string) {
        super._JsonStringStringifier(sink, toEncodable);
        this._indent = _indent;
    }

    writeIndentation(count: number): void {
        for (let i: number = 0; i < count; i++) this.writeString(this._indent);
    }
}

@DartClass
export class _JsonUtf8Stringifier extends _JsonStringifier {
    bufferSize: number;
    addChunk: (list: typed_data.Uint8List, start: number, end: number) => void;
    buffer: typed_data.Uint8List;
    index: number = 0;

    constructor(toEncodable: (o: any) => any, bufferSize: number, addChunk: (list: typed_data.Uint8List, start: number, end: number) => void) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonUtf8Stringifier(toEncodable: (o: any) => any, bufferSize: number, addChunk: (list: typed_data.Uint8List, start: number, end: number) => void) {
        this.bufferSize = bufferSize;
        this.buffer = new typed_data.Uint8List(bufferSize);
        super._JsonStringifier(toEncodable);
        this.addChunk = addChunk;
    }

    static stringify(object: core.DartObject, indent: core.DartList<number>, toEncodable: (o: any) => any, bufferSize: number, addChunk: (chunk: typed_data.Uint8List, start: number, end: number) => void): void {
        let stringifier: _JsonUtf8Stringifier;
        if (indent != null) {
            stringifier = new _JsonUtf8StringifierPretty(toEncodable, indent, bufferSize, addChunk);
        } else {
            stringifier = new _JsonUtf8Stringifier(toEncodable, bufferSize, addChunk);
        }
        stringifier.writeObject(object);
        stringifier.flush();
    }

    flush(): void {
        if (this.index > 0) {
            this.addChunk(this.buffer, 0, this.index);
        }
        this.buffer = null;
        this.index = 0;
    }

    writeNumber(number: number): void {
        this.writeAsciiString(number.toString());
    }

    writeAsciiString(string: string): void {
        for (let i: number = 0; i < string.length; i++) {
            let char: number = new core.DartString(string).codeUnitAt(i);
            /* TODO (AssertStatementImpl) : assert (char <= 0x7f); */
            ;
            this.writeByte(char);
        }
    }

    writeString(string: string): void {
        this.writeStringSlice(string, 0, string.length);
    }

    writeStringSlice(string: string, start: number, end: number): void {
        for (let i: number = start; i < end; i++) {
            let char: number = new core.DartString(string).codeUnitAt(i);
            if (char <= 127) {
                this.writeByte(char);
            } else {
                if ((char & 64512) == 55296 && i + 1 < end) {
                    let nextChar: number = new core.DartString(string).codeUnitAt(i + 1);
                    if ((nextChar & 64512) == 56320) {
                        char = 65536 + ((char & 1023) << 10) + (nextChar & 1023);
                        this.writeFourByteCharCode(char);
                        i++;
                        continue
                            ;
                    }
                }
                this.writeMultiByteCharCode(char);
            }
        }
    }

    writeCharCode(charCode: number): void {
        if (charCode <= 127) {
            this.writeByte(charCode);
            return;
        }
        this.writeMultiByteCharCode(charCode);
    }

    writeMultiByteCharCode(charCode: number): void {
        if (charCode <= 2047) {
            this.writeByte(192 | (charCode >> 6));
            this.writeByte(128 | (charCode & 63));
            return;
        }
        if (charCode <= 65535) {
            this.writeByte(224 | (charCode >> 12));
            this.writeByte(128 | ((charCode >> 6) & 63));
            this.writeByte(128 | (charCode & 63));
            return;
        }
        this.writeFourByteCharCode(charCode);
    }

    writeFourByteCharCode(charCode: number): void {
        /* TODO (AssertStatementImpl) : assert (charCode <= 0x10ffff); */
        ;
        this.writeByte(240 | (charCode >> 18));
        this.writeByte(128 | ((charCode >> 12) & 63));
        this.writeByte(128 | ((charCode >> 6) & 63));
        this.writeByte(128 | (charCode & 63));
    }

    writeByte(byte: number): void {
        /* TODO (AssertStatementImpl) : assert (byte <= 0xff); */
        ;
        if (this.index == this.buffer.length) {
            this.addChunk(this.buffer, 0, this.index);
            this.buffer = new typed_data.Uint8List(this.bufferSize);
            this.index = 0;
        }
        op(Op.INDEX_ASSIGN, this.buffer, this.index++, byte);
    }
}

@DartClass
export class _JsonUtf8StringifierPretty extends _JsonUtf8Stringifier {
    indent: core.DartList<number>;

    constructor(toEncodable: (o: any) => any, indent: core.DartList<number>, bufferSize: any, addChunk: (buffer: typed_data.Uint8List, start: number, end: number) => void) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _JsonUtf8StringifierPretty(toEncodable: (o: any) => any, indent: core.DartList<number>, bufferSize: any, addChunk: (buffer: typed_data.Uint8List, start: number, end: number) => void) {
        super._JsonUtf8Stringifier(toEncodable, bufferSize, addChunk);
        this.indent = indent;
    }

    writeIndentation(count: number): void {
        let indent: core.DartList<number> = this.indent;
        let indentLength: number = indent.length;
        if (indentLength == 1) {
            let char: number = indent[0];
            while (count > 0) {
                this.writeByte(char);
                count = 1;
            }
            return;
        }
        while (count > 0) {
            count--;
            let end: number = this.index + indentLength;
            if (end <= this.buffer.length) {
                this.buffer.setRange(this.index, end, indent);
                this.index = end;
            } else {
                for (let i: number = 0; i < indentLength; i++) {
                    this.writeByte(indent[i]);
                }
            }
        }
    }
}

@DartClass
export class Latin1Codec extends Encoding {
    _allowInvalid: boolean;

    constructor(_namedArguments?: { allowInvalid?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Latin1Codec(_namedArguments?: { allowInvalid?: boolean }) {
        let {allowInvalid} = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        this._allowInvalid = allowInvalid;
    }

    get name(): string {
        return "iso-8859-1";
    }

    decode(bytes: core.DartList<number>, _namedArguments?: { allowInvalid?: boolean }): string {
        let {allowInvalid} = Object.assign({}, _namedArguments);
        if (allowInvalid == null) allowInvalid = this._allowInvalid;
        if (allowInvalid) {
            return new Latin1Decoder({
                allowInvalid: true
            }).convert(bytes);
        } else {
            return new Latin1Decoder({
                allowInvalid: false
            }).convert(bytes);
        }
    }

    get encoder(): Latin1Encoder {
        return new Latin1Encoder();
    }

    get decoder(): Latin1Decoder {
        return this._allowInvalid ? new Latin1Decoder({
            allowInvalid: true
        }) : new Latin1Decoder({
            allowInvalid: false
        });
    }
}

@DartClass
export class Latin1Encoder extends _UnicodeSubsetEncoder {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Latin1Encoder() {
        super._UnicodeSubsetEncoder(properties._LATIN1_MASK);
    }
}

@DartClass
export class Latin1Decoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments?: { allowInvalid?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Latin1Decoder(_namedArguments?: { allowInvalid?: boolean }) {
        let {allowInvalid} = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        super._UnicodeSubsetDecoder(allowInvalid, properties._LATIN1_MASK);
    }

    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink {
        let stringSink: StringConversionSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        } else {
            stringSink = new StringConversionSink.from(sink);
        }
        if (!this._allowInvalid) return new _Latin1DecoderSink(stringSink);
        return new _Latin1AllowInvalidDecoderSink(stringSink);
    }
}

@DartClass
export class _Latin1DecoderSink extends ByteConversionSinkBase {
    _sink: StringConversionSink;

    constructor(_sink: StringConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Latin1DecoderSink(_sink: StringConversionSink) {
        this._sink = _sink;
    }

    close(): void {
        this._sink.close();
        this._sink = null;
    }

    add(source: core.DartList<number>): void {
        this.addSlice(source, 0, source.length, false);
    }

    _addSliceToSink(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        this._sink.add(new core.DartString.fromCharCodes(source, start, end).valueOf());
        if (isLast) this.close();
    }

    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        end = core.RangeError.checkValidRange(start, end, source.length);
        if (start == end) return;
        if (isNot(source, typed_data.Uint8List)) {
            _Latin1DecoderSink._checkValidLatin1(source, start, end);
        }
        this._addSliceToSink(source, start, end, isLast);
    }

    static _checkValidLatin1(source: core.DartList<number>, start: number, end: number): void {
        let mask: number = 0;
        for (let i: number = start; i < end; i++) {
            mask = source[i];
        }
        if (mask >= 0 && mask <= properties._LATIN1_MASK) {
            return;
        }
        _Latin1DecoderSink._reportInvalidLatin1(source, start, end);
    }

    static _reportInvalidLatin1(source: core.DartList<number>, start: number, end: number): void {
        for (let i: number = start; i < end; i++) {
            let char: number = source[i];
            if (char < 0 || char > properties._LATIN1_MASK) {
                throw new core.FormatException("Source contains non-Latin-1 characters.", source, i);
            }
        }
        /* TODO (AssertStatementImpl) : assert (false); */
        ;
    }
}

@DartClass
export class _Latin1AllowInvalidDecoderSink extends _Latin1DecoderSink {
    constructor(sink: StringConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Latin1AllowInvalidDecoderSink(sink: StringConversionSink) {
        super._Latin1DecoderSink(sink);
    }

    addSlice(source: core.DartList<number>, start: number, end: number, isLast: boolean): void {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i: number = start; i < end; i++) {
            let char: number = source[i];
            if (char > properties._LATIN1_MASK || char < 0) {
                if (i > start) this._addSliceToSink(source, start, i, false);
                this._addSliceToSink(new core.DartList.literal(65533), 0, 1, false);
                start = i + 1;
            }
        }
        if (start < end) {
            this._addSliceToSink(source, start, end, isLast);
        }
        if (isLast) {
            this.close();
        }
    }
}

@DartClass
@Implements(core.DartObject)
export class LineSplitter extends Converter<string, core.DartList<string>> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    LineSplitter() {
    }

    static split(lines: string, start?: number, end?: number): core.DartIterable<string> {
        return core.iter<string>(() => (function* () {
            start = start || 0;
            end = core.RangeError.checkValidRange(start, end, lines.length);
            let sliceStart: number = start;
            let char: number = 0;
            for (let i: number = start; i < end; i++) {
                let previousChar: number = char;
                char = new core.DartString(lines).codeUnitAt(i);
                if (char != properties._CR) {
                    if (char != properties._LF) continue;
                    if (previousChar == properties._CR) {
                        sliceStart = i + 1;
                        continue;
                    }
                }
                yield lines.substring(sliceStart, i);
                sliceStart = i + 1;
            }
            if (sliceStart < end) {
                yield lines.substring(sliceStart, end);
            }
        }).call(this));
    }

    convert(data: string): core.DartList<string> {
        let lines: core.DartList<string> = new core.DartList.literal<string>();
        let end: number = data.length;
        let sliceStart: number = 0;
        let char: number = 0;
        for (let i: number = 0; i < end; i++) {
            let previousChar: number = char;
            char = new core.DartString(data).codeUnitAt(i);
            if (char != properties._CR) {
                if (char != properties._LF) continue;
                if (previousChar == properties._CR) {
                    sliceStart = i + 1;
                    continue;
                }
            }
            lines.add(data.substring(sliceStart, i));
            sliceStart = i + 1;
        }
        if (sliceStart < end) {
            lines.add(data.substring(sliceStart, end));
        }
        return lines;
    }

    startChunkedConversion(sink: core.DartSink<string>): StringConversionSink {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        }
        return new _LineSplitterSink(sink as any);
    }

    bind(stream: async.DartStream<string>): async.DartStream<any> {
        return new async.DartStream.eventTransformed(stream, (sink: async.DartEventSink<string>) => {
            return new _LineSplitterEventSink(sink);
        });
    }
}

@DartClass
export class _LineSplitterSink extends StringConversionSinkBase {
    _sink: StringConversionSink;
    _carry: string;
    _skipLeadingLF: boolean = false;

    constructor(_sink: StringConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _LineSplitterSink(_sink: StringConversionSink) {
        this._sink = _sink;
    }

    addSlice(chunk: string, start: number, end: number, isLast: boolean): void {
        end = core.RangeError.checkValidRange(start, end, chunk.length);
        if (start >= end) {
            if (isLast) this.close();
            return;
        }
        if (this._carry != null) {
            /* TODO (AssertStatementImpl) : assert (!_skipLeadingLF); */
            ;
            chunk = this._carry + chunk.substring(start, end);
            start = 0;
            end = chunk.length;
            this._carry = null;
        } else if (this._skipLeadingLF) {
            if (new core.DartString(chunk).codeUnitAt(start) == properties._LF) {
                start = 1;
            }
            this._skipLeadingLF = false;
        }
        this._addLines(chunk, start, end);
        if (isLast) this.close();
    }

    close(): void {
        if (this._carry != null) {
            this._sink.add(this._carry);
            this._carry = null;
        }
        this._sink.close();
    }

    _addLines(lines: string, start: number, end: number): void {
        let sliceStart: number = start;
        let char: number = 0;
        for (let i: number = start; i < end; i++) {
            let previousChar: number = char;
            char = new core.DartString(lines).codeUnitAt(i);
            if (char != properties._CR) {
                if (char != properties._LF) continue;
                if (previousChar == properties._CR) {
                    sliceStart = i + 1;
                    continue
                        ;
                }
            }
            this._sink.add(lines.substring(sliceStart, i));
            sliceStart = i + 1;
        }
        if (sliceStart < end) {
            this._carry = lines.substring(sliceStart, end);
        } else {
            this._skipLeadingLF = (char == properties._CR);
        }
    }
}

@DartClass
@Implements(async.DartEventSink)
export class _LineSplitterEventSink extends _LineSplitterSink implements async.DartEventSink<string> {
    _eventSink: async.DartEventSink<string>;

    constructor(eventSink: async.DartEventSink<string>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _LineSplitterEventSink(eventSink: async.DartEventSink<string>) {
        this._eventSink = eventSink;
        super._LineSplitterSink(new StringConversionSink.from(eventSink));
    }

    addError(o: core.DartObject, stackTrace?: core.DartStackTrace): void {
        this._eventSink.addError(o, stackTrace);
    }
}

@DartClass
export class ClosableStringSink extends core.DartStringSink {
    @namedFactory
    static _fromStringSink(sink: core.DartStringSink, onClose: () => void): ClosableStringSink {
        return new _ClosableStringSink(sink, onClose);
    }

    static fromStringSink: new(sink: core.DartStringSink, onClose: () => void) => ClosableStringSink;

    @Abstract
    close(): void {
        throw 'abstract'
    }
}

@DartClass
@Implements(ClosableStringSink)
export class _ClosableStringSink implements ClosableStringSink {
    _callback: () => void;
    _sink: core.DartStringSink;

    constructor(_sink: core.DartStringSink, _callback: () => void) {
    }

    @defaultConstructor
    _ClosableStringSink(_sink: core.DartStringSink, _callback: () => void) {
        this._sink = _sink;
        this._callback = _callback;
    }

    close(): void {
        this._callback();
    }

    writeCharCode(charCode: number): void {
        this._sink.writeCharCode(charCode);
    }

    write(o: any): void {
        this._sink.write(o);
    }

    writeln(o?: any): void {
        o = o || "";
        this._sink.writeln(o);
    }

    writeAll(objects: core.DartIterable<any>, separator?: string): void {
        separator = separator || "";
        this._sink.writeAll(objects, separator);
    }
}

@DartClass
@Implements(ClosableStringSink)
export class _StringConversionSinkAsStringSinkAdapter implements ClosableStringSink {
    static _MIN_STRING_SIZE = 16;
    _buffer: core.DartStringBuffer;
    _chunkedSink: StringConversionSink;

    constructor(_chunkedSink: StringConversionSink) {
    }

    @defaultConstructor
    _StringConversionSinkAsStringSinkAdapter(_chunkedSink: StringConversionSink) {
        this._buffer = new core.DartStringBuffer();
        this._chunkedSink = _chunkedSink;
    }

    close(): void {
        if (this._buffer.isNotEmpty) this._flush();
        this._chunkedSink.close();
    }

    writeCharCode(charCode: number): void {
        this._buffer.writeCharCode(charCode);
        if (this._buffer.length > _StringConversionSinkAsStringSinkAdapter._MIN_STRING_SIZE) this._flush();
    }

    write(o: any): void {
        if (this._buffer.isNotEmpty) this._flush();
        this._chunkedSink.add(o.toString());
    }

    writeln(o?: any): void {
        o = o || "";
        this._buffer.writeln(o);
        if (this._buffer.length > _StringConversionSinkAsStringSinkAdapter._MIN_STRING_SIZE) this._flush();
    }

    writeAll(objects: core.DartIterable<any>, separator?: string): void {
        separator = separator || "";
        if (this._buffer.isNotEmpty) this._flush();
        let iterator: core.DartIterator<any> = objects.iterator;
        if (!iterator.moveNext()) return;
        if (new core.DartString(separator).isEmpty) {
            do {
                this._chunkedSink.add(iterator.current.toString());
            } while (iterator.moveNext());
        } else {
            this._chunkedSink.add(iterator.current.toString());
            while (iterator.moveNext()) {
                this.write(separator);
                this._chunkedSink.add(iterator.current.toString());
            }
        }
    }

    _flush(): void {
        let accumulated: string = this._buffer.toString();
        this._buffer.clear();
        this._chunkedSink.add(accumulated);
    }
}


@DartClass
export class _StringSinkConversionSink extends StringConversionSinkBase {
    _stringSink: core.DartStringSink;

    constructor(_stringSink: core.DartStringSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _StringSinkConversionSink(_stringSink: core.DartStringSink) {
        this._stringSink = _stringSink;
    }

    close(): void {
    }

    addSlice(str: string, start: number, end: number, isLast: boolean): void {
        if (start != 0 || end != str.length) {
            for (let i: number = start; i < end; i++) {
                this._stringSink.writeCharCode(new core.DartString(str).codeUnitAt(i));
            }
        } else {
            this._stringSink.write(str);
        }
        if (isLast) this.close();
    }

    add(str: string): void {
        this._stringSink.write(str);
    }

    asUtf8Sink(allowMalformed: boolean): ByteConversionSink {
        return new _Utf8StringSinkAdapter(this, this._stringSink, allowMalformed);
    }

    asStringSink(): ClosableStringSink {
        return new ClosableStringSink.fromStringSink(this._stringSink, this.close.bind(this));
    }
}


export type _Reviver = (key: any, value: any) => any;

/**
 * Implements the chunked conversion from a JSON string to its corresponding
 * object.
 *
 * The sink only creates one object, but its input can be chunked.
 */
// TODO(floitsch): don't accumulate everything before starting to decode.
class _JsonDecoderSink extends _StringSinkConversionSink {
    _reviver: _Reviver;
    _sink: core.DartSink<any>;

    constructor(_reviver: _Reviver, _sink: core.DartSink<any>) {
        super(new core.DartStringBuffer(''));
        this._reviver = this._reviver;
        this._sink = _sink;
    }

    close(): void {
        super.close();
        let buffer = this._stringSink;
        let accumulated = buffer.toString();
        (buffer as core.DartStringBuffer).clear();
        let decoded = _parseJson(accumulated, this._reviver);
        this._sink.add(decoded);
        this._sink.close();
    }
}


@DartClass
export class _StringCallbackSink extends _StringSinkConversionSink {
    _callback: <T>(accumulated: string) => void;

    constructor(_callback: <T>(accumulated: string) => void) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _StringCallbackSink(_callback: <T>(accumulated: string) => void) {
        super._StringSinkConversionSink(new core.DartStringBuffer());
        this._callback = _callback;
    }

    close(): void {
        let buffer: core.DartStringBuffer = this._stringSink as core.DartStringBuffer;
        let accumulated: string = buffer.toString();
        buffer.clear();
        this._callback(accumulated);
    }

    asUtf8Sink(allowMalformed: boolean): ByteConversionSink {
        return new _Utf8StringSinkAdapter(this, this._stringSink, allowMalformed);
    }
}

@DartClass
export class _StringAdapterSink extends StringConversionSinkBase {
    _sink: core.DartSink<string>;

    constructor(_sink: core.DartSink<string>) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _StringAdapterSink(_sink: core.DartSink<string>) {
        this._sink = _sink;
    }

    add(str: string): void {
        this._sink.add(str);
    }

    addSlice(str: string, start: number, end: number, isLast: boolean): void {
        if (start == 0 && end == str.length) {
            this.add(str);
        } else {
            this.add(str.substring(start, end));
        }
        if (isLast) this.close();
    }

    close(): void {
        this._sink.close();
    }
}

@DartClass
export class _Utf8StringSinkAdapter extends ByteConversionSink {
    _decoder: _Utf8Decoder;
    _sink: core.DartSink<any>;

    constructor(_sink: core.DartSink<any>, stringSink: core.DartStringSink, allowMalformed: boolean) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Utf8StringSinkAdapter(_sink: core.DartSink<any>, stringSink: core.DartStringSink, allowMalformed: boolean) {
        this._decoder = new _Utf8Decoder(stringSink, allowMalformed);
        this._sink = _sink;
    }

    close(): void {
        this._decoder.close();
        if (this._sink != null) this._sink.close();
    }

    add(chunk: core.DartList<number>): void {
        this.addSlice(chunk, 0, chunk.length, false);
    }

    addSlice(codeUnits: core.DartList<number>, startIndex: number, endIndex: number, isLast: boolean): void {
        this._decoder.convert(codeUnits, startIndex, endIndex);
        if (isLast) this.close();
    }
}

@DartClass
export class _Utf8ConversionSink extends ByteConversionSink {
    _decoder: _Utf8Decoder;
    _chunkedSink: StringConversionSink;
    _buffer: core.DartStringBuffer;

    constructor(sink: StringConversionSink, allowMalformed: boolean) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Utf8ConversionSink(sink: StringConversionSink, allowMalformed: boolean) {
        this._(sink, new core.DartStringBuffer(), allowMalformed);
    }

    @namedConstructor
    _(_chunkedSink: StringConversionSink, stringBuffer: core.DartStringBuffer, allowMalformed: boolean) {
        this._decoder = new _Utf8Decoder(stringBuffer, allowMalformed);
        this._buffer = stringBuffer;
        this._chunkedSink = _chunkedSink;
    }

    static _: new(_chunkedSink: StringConversionSink, stringBuffer: core.DartStringBuffer, allowMalformed: boolean) => _Utf8ConversionSink;

    close(): void {
        this._decoder.close();
        if (this._buffer.isNotEmpty) {
            let accumulated: string = this._buffer.toString();
            this._buffer.clear();
            this._chunkedSink.addSlice(accumulated, 0, accumulated.length, true);
        } else {
            this._chunkedSink.close();
        }
    }

    add(chunk: core.DartList<number>): void {
        this.addSlice(chunk, 0, chunk.length, false);
    }

    addSlice(chunk: core.DartList<number>, startIndex: number, endIndex: number, isLast: boolean): void {
        this._decoder.convert(chunk, startIndex, endIndex);
        if (this._buffer.isNotEmpty) {
            let accumulated: string = this._buffer.toString();
            this._chunkedSink.addSlice(accumulated, 0, accumulated.length, isLast);
            this._buffer.clear();
            return;
        }
        if (isLast) this.close();
    }
}

@DartClass
export class Utf8Codec extends Encoding {
    _allowMalformed: boolean;

    constructor(_namedArguments?: { allowMalformed?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Utf8Codec(_namedArguments?: { allowMalformed?: boolean }) {
        let {allowMalformed} = Object.assign({
            "allowMalformed": false
        }, _namedArguments);
        this._allowMalformed = allowMalformed;
    }

    get name(): string {
        return "utf-8";
    }

    decode(codeUnits: core.DartList<number>, _namedArguments?: { allowMalformed?: boolean }): string {
        let {allowMalformed} = Object.assign({}, _namedArguments);
        if (allowMalformed == null) allowMalformed = this._allowMalformed;
        return new Utf8Decoder({
            allowMalformed: allowMalformed
        }).convert(codeUnits);
    }

    get encoder(): Utf8Encoder {
        return new Utf8Encoder();
    }

    get decoder(): Utf8Decoder {
        return new Utf8Decoder({
            allowMalformed: this._allowMalformed
        });
    }
}

@DartClass
export class Utf8Encoder extends Converter<string, core.DartList<number>> {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Utf8Encoder() {
    }

    convert(string: string, start?: number, end?: number): core.DartList<number> {
        start = start || 0;
        let stringLength: number = string.length;
        core.RangeError.checkValidRange(start, end, stringLength);
        if (end == null) end = stringLength;
        let length: number = end - start;
        if (length == 0) return new typed_data.Uint8List(0);
        let encoder: _Utf8Encoder = new _Utf8Encoder.withBufferSize(length * 3);
        let endPosition: number = encoder._fillBuffer(string, start, end);
        /* TODO (AssertStatementImpl) : assert (endPosition >= end - 1); */
        ;
        if (endPosition != end) {
            let lastCodeUnit: number = new core.DartString(string).codeUnitAt(end - 1);
            /* TODO (AssertStatementImpl) : assert (_isLeadSurrogate(lastCodeUnit)); */
            ;
            let wasCombined: boolean = encoder._writeSurrogate(lastCodeUnit, 0);
            /* TODO (AssertStatementImpl) : assert (!wasCombined); */
            ;
        }
        return encoder._buffer.sublist(0, encoder._bufferIndex);
    }

    startChunkedConversion(sink: core.DartSink<core.DartList<number>>): StringConversionSink {
        if (isNot(sink, ByteConversionSink)) {
            sink = new ByteConversionSink.from(sink);
        }
        return new _Utf8EncoderSink(sink as any) as any;
    }

    bind(stream: async.DartStream<string>): async.DartStream<core.DartList<number>> {
        return super.bind(stream);
    }
}

@DartClass
export class _Utf8Encoder {
    _carry: number = 0;
    _bufferIndex: number = 0;
    _buffer: core.DartList<number>;
    static _DEFAULT_BYTE_BUFFER_SIZE = 1024;

    constructor() {
    }

    @defaultConstructor
    _Utf8Encoder() {
        this.withBufferSize(_Utf8Encoder._DEFAULT_BYTE_BUFFER_SIZE);
    }

    @namedConstructor
    withBufferSize(bufferSize: number) {
        this._buffer = _Utf8Encoder._createBuffer(bufferSize);
    }

    static withBufferSize: new(bufferSize: number) => _Utf8Encoder;

    static _createBuffer(size: number): core.DartList<number> {
        return new typed_data.Uint8List(size);
    }

    _writeSurrogate(leadingSurrogate: number, nextCodeUnit: number): boolean {
        if (_isTailSurrogate(nextCodeUnit)) {
            let rune: number = _combineSurrogatePair(leadingSurrogate, nextCodeUnit);
            /* TODO (AssertStatementImpl) : assert (rune > _THREE_BYTE_LIMIT); */
            ;
            /* TODO (AssertStatementImpl) : assert (rune <= _FOUR_BYTE_LIMIT); */
            ;
            this._buffer[this._bufferIndex++] = 240 | (rune >> 18);
            this._buffer[this._bufferIndex++] = 128 | ((rune >> 12) & 63);
            this._buffer[this._bufferIndex++] = 128 | ((rune >> 6) & 63);
            this._buffer[this._bufferIndex++] = 128 | (rune & 63);
            return true;
        } else {
            this._buffer[this._bufferIndex++] = 224 | (leadingSurrogate >> 12);
            this._buffer[this._bufferIndex++] = 128 | ((leadingSurrogate >> 6) & 63);
            this._buffer[this._bufferIndex++] = 128 | (leadingSurrogate & 63);
            return false;
        }
    }

    _fillBuffer(str: string, start: number, end: number): number {
        if (start != end && _isLeadSurrogate(new core.DartString(str).codeUnitAt(end - 1))) {
            end--;
        }
        let stringIndex: number;
        for (stringIndex = start; stringIndex < end; stringIndex++) {
            let codeUnit: number = new core.DartString(str).codeUnitAt(stringIndex);
            if (codeUnit <= properties._ONE_BYTE_LIMIT) {
                if (this._bufferIndex >= this._buffer.length) break;
                this._buffer[this._bufferIndex++] = codeUnit;
            } else if (_isLeadSurrogate(codeUnit)) {
                if (this._bufferIndex + 3 >= this._buffer.length) break;
                let nextCodeUnit: number = new core.DartString(str).codeUnitAt(stringIndex + 1);
                let wasCombined: boolean = this._writeSurrogate(codeUnit, nextCodeUnit);
                if (wasCombined) stringIndex++;
            } else {
                let rune: number = codeUnit;
                if (rune <= properties._TWO_BYTE_LIMIT) {
                    if (this._bufferIndex + 1 >= this._buffer.length) break;
                    this._buffer[this._bufferIndex++] = 192 | (rune >> 6);
                    this._buffer[this._bufferIndex++] = 128 | (rune & 63);
                } else {
                    /* TODO (AssertStatementImpl) : assert (rune <= _THREE_BYTE_LIMIT); */
                    ;
                    if (this._bufferIndex + 2 >= this._buffer.length) break;
                    this._buffer[this._bufferIndex++] = 224 | (rune >> 12);
                    this._buffer[this._bufferIndex++] = 128 | ((rune >> 6) & 63);
                    this._buffer[this._bufferIndex++] = 128 | (rune & 63);
                }
            }
        }
        return stringIndex;
    }
}

@DartClass
export class _Utf8EncoderSink extends _Utf8Encoder {
    _sink: ByteConversionSink;

    constructor(_sink: ByteConversionSink) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    _Utf8EncoderSink(_sink: ByteConversionSink) {
        this._sink = _sink;
    }

    close(): void {
        if (this._carry != 0) {
            this.addSlice("", 0, 0, true);
            return;
        }
        this._sink.close();
    }

    addSlice(str: string, start: number, end: number, isLast: boolean): void {
        this._bufferIndex = 0;
        if (start == end && !isLast) {
            return;
        }
        if (this._carry != 0) {
            let nextCodeUnit: number = 0;
            if (start != end) {
                nextCodeUnit = new core.DartString(str).codeUnitAt(start);
            } else {
                /* TODO (AssertStatementImpl) : assert (isLast); */
                ;
            }
            let wasCombined: boolean = this._writeSurrogate(this._carry, nextCodeUnit);
            /* TODO (AssertStatementImpl) : assert (!wasCombined || start != end); */
            ;
            if (wasCombined) start++;
            this._carry = 0;
        }
        do {
            start = this._fillBuffer(str, start, end);
            let isLastSlice: boolean = isLast && (start == end);
            if (start == end - 1 && _isLeadSurrogate(new core.DartString(str).codeUnitAt(start))) {
                if (isLast && this._bufferIndex < this._buffer.length - 3) {
                    let hasBeenCombined: boolean = this._writeSurrogate(new core.DartString(str).codeUnitAt(start), 0);
                    /* TODO (AssertStatementImpl) : assert (!hasBeenCombined); */
                    ;
                } else {
                    this._carry = new core.DartString(str).codeUnitAt(start);
                }
                start++;
            }
            this._sink.addSlice(this._buffer, 0, this._bufferIndex, isLastSlice);
            this._bufferIndex = 0;
        } while (start < end);
        if (isLast) this.close();
    }
}

@DartClass
export class Utf8Decoder extends Converter<core.DartList<number>, string> {
    _allowMalformed: boolean;

    constructor(_namedArguments?: { allowMalformed?: boolean }) {
        // @ts-ignore
        super();
    }

    @defaultConstructor
    Utf8Decoder(_namedArguments?: { allowMalformed?: boolean }) {
        let {allowMalformed} = Object.assign({
            "allowMalformed": false
        }, _namedArguments);
        this._allowMalformed = allowMalformed;
    }

    convert(codeUnits: core.DartList<number>, start?: number, end?: number): string {
        start = start || 0;
        let result: string = Utf8Decoder._convertIntercepted(this._allowMalformed, codeUnits, start, end);
        if (result != null) {
            return result;
        }
        let length: number = codeUnits.length;
        core.RangeError.checkValidRange(start, end, length);
        if (end == null) end = length;
        let buffer: core.DartStringBuffer = new core.DartStringBuffer();
        let decoder: _Utf8Decoder = new _Utf8Decoder(buffer, this._allowMalformed);
        decoder.convert(codeUnits, start, end);
        decoder.flush(codeUnits, end);
        return buffer.toString();
    }

    startChunkedConversion(sink: core.DartSink<string>): ByteConversionSink {
        let stringSink: StringConversionSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        } else {
            stringSink = new StringConversionSink.from(sink);
        }
        return stringSink.asUtf8Sink(this._allowMalformed);
    }

    bind(stream: async.DartStream<core.DartList<number>>): async.DartStream<string> {
        return super.bind(stream);
    }

    fuse<T>(next: Converter<string, T>): Converter<core.DartList<number>, T> {
        return super.fuse(next);
    }

    static _convertIntercepted(allowMalformed: boolean, codeUnits: core.DartList<number>, start: number, end: number): string {
        return null; // This call was not intercepted.
    }
}

export var _isLeadSurrogate: (codeUnit: number) => boolean = (codeUnit: number): boolean => {
    return (codeUnit & properties._SURROGATE_TAG_MASK) == properties._LEAD_SURROGATE_MIN;
};
export var _isTailSurrogate: (codeUnit: number) => boolean = (codeUnit: number): boolean => {
    return (codeUnit & properties._SURROGATE_TAG_MASK) == properties._TAIL_SURROGATE_MIN;
};
export var _combineSurrogatePair: (lead: number, tail: number) => number = (lead: number, tail: number): number => {
    return 65536 + ((lead & properties._SURROGATE_VALUE_MASK) << 10) | (tail & properties._SURROGATE_VALUE_MASK);
};

@DartClass
export class _Utf8Decoder {
    _allowMalformed: boolean;
    _stringSink: core.DartStringSink;
    _isFirstCharacter: boolean = true;
    _value: number = 0;
    _expectedUnits: number = 0;
    _extraUnits: number = 0;

    constructor(_stringSink: core.DartStringSink, _allowMalformed: boolean) {
    }

    @defaultConstructor
    _Utf8Decoder(_stringSink: core.DartStringSink, _allowMalformed: boolean) {
        this._stringSink = _stringSink;
        this._allowMalformed = _allowMalformed;
    }

    get hasPartialInput(): boolean {
        return this._expectedUnits > 0;
    }

    static _LIMITS: core.DartList<number> = new core.DartList.literal<number>(_ONE_BYTE_LIMIT, _TWO_BYTE_LIMIT, _THREE_BYTE_LIMIT, _FOUR_BYTE_LIMIT);

    close(): void {
        this.flush();
    }

    flush(source?: core.DartList<number>, offset?: number): void {
        if (this.hasPartialInput) {
            if (!this._allowMalformed) {
                throw new core.FormatException("Unfinished UTF-8 octet sequence", source, offset);
            }
            this._stringSink.writeCharCode(properties.UNICODE_REPLACEMENT_CHARACTER_RUNE);
            this._value = 0;
            this._expectedUnits = 0;
            this._extraUnits = 0;
        }
    }

    convert(codeUnits: core.DartList<number>, startIndex: number, endIndex: number): void {
        let value: number = this._value;
        let expectedUnits: number = this._expectedUnits;
        let extraUnits: number = this._extraUnits;
        this._value = 0;
        this._expectedUnits = 0;
        this._extraUnits = 0;
        var scanOneByteCharacters: (units: any, from: number) => number = (units: any, from: number): number => {
            let to = endIndex;
            let mask = properties._ONE_BYTE_LIMIT;
            for (let i = from; i < to; i++) {
                let unit = op(Op.INDEX, units, i);
                if ((op(Op.BITAND, unit, mask)) != unit) return i - from;
            }
            return to - from;
        };
        var addSingleBytes: (from: number, to: number) => void = (from: number, to: number): void => {
            /* TODO (AssertStatementImpl) : assert (from >= startIndex && from <= endIndex); */
            ;
            /* TODO (AssertStatementImpl) : assert (to >= startIndex && to <= endIndex); */
            ;
            this._stringSink.write(new core.DartString.fromCharCodes(codeUnits, from, to).valueOf());
        };
        let i: number = startIndex;
        loop:
            while (true) {
                multibyte:
                    if (expectedUnits > 0) {
                        do {
                            if (i == endIndex) {
                                break;
                            }
                            let unit: number = codeUnits[i];
                            if ((unit & 192) != 128) {
                                expectedUnits = 0;
                                if (!this._allowMalformed) {
                                    throw new core.FormatException(`Bad UTF-8 encoding 0x${new core.JSInt(unit).toRadixString(16)}`, codeUnits, i);
                                }
                                this._isFirstCharacter = false;
                                this._stringSink.writeCharCode(properties.UNICODE_REPLACEMENT_CHARACTER_RUNE);
                                break;
                            } else {
                                value = (value << 6) | (unit & 63);
                                expectedUnits--;
                                i++;
                            }
                        } while (expectedUnits > 0);
                        if (value <= _Utf8Decoder._LIMITS[extraUnits - 1]) {
                            if (!this._allowMalformed) {
                                throw new core.FormatException(`Overlong encoding of 0x${new core.JSInt(value).toRadixString(16)}`, codeUnits, i - extraUnits - 1);
                            }
                            expectedUnits = extraUnits = 0;
                            value = properties.UNICODE_REPLACEMENT_CHARACTER_RUNE;
                        }
                        if (value > properties._FOUR_BYTE_LIMIT) {
                            if (!this._allowMalformed) {
                                throw new core.FormatException("Character outside valid Unicode range: " + `0x${new core.JSInt(value).toRadixString(16)}`, codeUnits, i - extraUnits - 1);
                            }
                            value = properties.UNICODE_REPLACEMENT_CHARACTER_RUNE;
                        }
                        if (!this._isFirstCharacter || value != properties.UNICODE_BOM_CHARACTER_RUNE) {
                            this._stringSink.writeCharCode(value);
                        }
                        this._isFirstCharacter = false;
                    }
                ;
                while (i < endIndex) {
                    let oneBytes: number = scanOneByteCharacters(codeUnits, i);
                    if (oneBytes > 0) {
                        this._isFirstCharacter = false;
                        addSingleBytes(i, i + oneBytes);
                        i = oneBytes;
                        if (i == endIndex) break;
                    }
                    let unit: number = codeUnits[i++];
                    if (unit < 0) {
                        if (!this._allowMalformed) {
                            throw new core.FormatException(`Negative UTF-8 code unit: -0x${new core.JSInt(-unit).toRadixString(16)}`, codeUnits, i - 1);
                        }
                        this._stringSink.writeCharCode(properties.UNICODE_REPLACEMENT_CHARACTER_RUNE);
                    } else {
                        /* TODO (AssertStatementImpl) : assert (unit > _ONE_BYTE_LIMIT); */
                        ;
                        if ((unit & 224) == 192) {
                            value = unit & 31;
                            expectedUnits = extraUnits = 1;
                            continue;
                        }
                        if ((unit & 240) == 224) {
                            value = unit & 15;
                            expectedUnits = extraUnits = 2;
                            continue;
                        }
                        if ((unit & 248) == 240 && unit < 245) {
                            value = unit & 7;
                            expectedUnits = extraUnits = 3;
                            continue;
                        }
                        if (!this._allowMalformed) {
                            throw new core.FormatException(`Bad UTF-8 encoding 0x${new core.JSInt(unit).toRadixString(16)}`, codeUnits, i - 1);
                        }
                        value = properties.UNICODE_REPLACEMENT_CHARACTER_RUNE;
                        expectedUnits = extraUnits = 0;
                        this._isFirstCharacter = false;
                        this._stringSink.writeCharCode(value);
                    }
                }
                break;
            }
        ;
        if (expectedUnits > 0) {
            this._value = value;
            this._expectedUnits = expectedUnits;
            this._extraUnits = extraUnits;
        }
    }
}

export class _Properties {
    ASCII: AsciiCodec = new AsciiCodec();
    _ASCII_MASK: number = 127;
    BASE64: Base64Codec = new Base64Codec();
    BASE64URL: Base64Codec = new Base64Codec.urlSafe();
    _paddingChar: number = 61;
    HTML_ESCAPE: HtmlEscape = new HtmlEscape();
    JSON: JsonCodec = new JsonCodec();
    LATIN1: Latin1Codec = new Latin1Codec();
    _LATIN1_MASK: number = 255;
    _LF: number = 10;
    _CR: number = 13;
    UNICODE_REPLACEMENT_CHARACTER_RUNE: number = 65533;
    UNICODE_BOM_CHARACTER_RUNE: number = 65279;
    UTF8: Utf8Codec = new Utf8Codec();
    _ONE_BYTE_LIMIT: number = _ONE_BYTE_LIMIT;
    _TWO_BYTE_LIMIT: number = _TWO_BYTE_LIMIT;
    _THREE_BYTE_LIMIT: number = _THREE_BYTE_LIMIT;
    _FOUR_BYTE_LIMIT: number = _FOUR_BYTE_LIMIT;
    _SURROGATE_MASK: number = _SURROGATE_MASK;
    _SURROGATE_TAG_MASK: number = _SURROGATE_TAG_MASK;
    _SURROGATE_VALUE_MASK: number = _SURROGATE_VALUE_MASK;
    _LEAD_SURROGATE_MIN: number = _LEAD_SURROGATE_MIN;
    _TAIL_SURROGATE_MIN: number = _TAIL_SURROGATE_MIN;
}

export const properties: _Properties = new _Properties();

Encoding._nameToEncoding = new core.DartMap.literal([
    ["iso_8859-1:1987", properties.LATIN1 as Encoding],
    ["iso-ir-100", properties.LATIN1],
    ["iso_8859-1", properties.LATIN1],
    ["iso-8859-1", properties.LATIN1],
    ["latin1", properties.LATIN1],
    ["l1", properties.LATIN1],
    ["ibm819", properties.LATIN1],
    ["cp819", properties.LATIN1],
    ["csisolatin1", properties.LATIN1],
    ["iso-ir-6", properties.ASCII],
    ["ansi_x3.4-1968", properties.ASCII],
    ["ansi_x3.4-1986", properties.ASCII],
    ["iso_646.irv:1991", properties.ASCII],
    ["iso646-us", properties.ASCII],
    ["us-ascii", properties.ASCII],
    ["us", properties.ASCII],
    ["ibm367", properties.ASCII],
    ["cp367", properties.ASCII],
    ["csascii", properties.ASCII],
    ["ascii", properties.ASCII],
    ["csutf8", properties.UTF8],
    ["utf-8", properties.UTF8],
]);