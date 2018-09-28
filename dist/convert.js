var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Encoding_1, Base64Codec_1, _Base64Encoder_1, _Base64Decoder_1, _ByteCallbackSink_1, JsonUtf8Encoder_1, _JsonMap_1, _JsonStringifier_1, _JsonStringStringifier_1, _JsonUtf8Stringifier_1, _Latin1DecoderSink_1, _StringConversionSinkAsStringSinkAdapter_1, _Utf8Encoder_1, Utf8Decoder_1, _Utf8Decoder_1;
/** Library asset:sample_project/lib/convert/convert.dart */
import { is, isNot } from "./_common";
import { defaultConstructor, namedConstructor, namedFactory, DartClass, Implements, op, Op, OperatorMethods, Abstract, AbstractProperty } from "./utils";
import * as core from "./core";
import * as async from "./async";
import * as typed_data from "./typed_data";
import * as _internal from "./_internal";
import { DartList } from "./core";
const _ONE_BYTE_LIMIT = 127;
const _TWO_BYTE_LIMIT = 2047;
const _THREE_BYTE_LIMIT = 65535;
const _FOUR_BYTE_LIMIT = 1114111;
const _SURROGATE_MASK = 63488;
const _SURROGATE_TAG_MASK = 64512;
const _SURROGATE_VALUE_MASK = 1023;
const _LEAD_SURROGATE_MIN = 55296;
const _TAIL_SURROGATE_MIN = 56320;
let Codec = class Codec {
    constructor() {
    }
    Codec() {
    }
    encode(input) {
        return this.encoder.convert(input);
    }
    decode(encoded) {
        return this.decoder.convert(encoded);
    }
    get encoder() {
        throw 'abstract';
    }
    get decoder() {
        throw 'abstract';
    }
    fuse(other) {
        return new _FusedCodec(this, other);
    }
    get inverted() {
        return new _InvertedCodec(this);
    }
};
__decorate([
    defaultConstructor
], Codec.prototype, "Codec", null);
__decorate([
    AbstractProperty
], Codec.prototype, "encoder", null);
__decorate([
    AbstractProperty
], Codec.prototype, "decoder", null);
Codec = __decorate([
    DartClass
], Codec);
export { Codec };
let Encoding = Encoding_1 = class Encoding extends Codec {
    constructor() {
        // @ts-ignore
        super();
    }
    Encoding() {
    }
    get encoder() {
        throw 'abstract';
    }
    get decoder() {
        throw 'abstract';
    }
    decodeStream(byteStream) {
        return byteStream.transform(this.decoder).fold(new core.DartStringBuffer(), (buffer, string) => {
            return ((_) => {
                {
                    _.write(string);
                    return _;
                }
            })(buffer);
        }).then((buffer) => {
            return buffer.toString();
        });
    }
    get name() {
        throw 'abstract';
    }
    static getByName(name) {
        if (name == null)
            return null;
        name = name.toLowerCase();
        return Encoding_1._nameToEncoding.get(name);
    }
};
__decorate([
    defaultConstructor
], Encoding.prototype, "Encoding", null);
__decorate([
    AbstractProperty
], Encoding.prototype, "encoder", null);
__decorate([
    AbstractProperty
], Encoding.prototype, "decoder", null);
__decorate([
    AbstractProperty
], Encoding.prototype, "name", null);
Encoding = Encoding_1 = __decorate([
    DartClass
], Encoding);
export { Encoding };
let Converter = class Converter {
    constructor() {
    }
    Converter() {
    }
    convert(input) {
        throw 'abstract';
    }
    fuse(other) {
        return new _FusedConverter(this, other);
    }
    startChunkedConversion(sink) {
        throw new core.UnsupportedError(`This converter does not support chunked conversions: ${this}`);
    }
    bind(stream) {
        return new async.DartStream.eventTransformed(stream, (sink) => {
            return new _ConverterStreamEventSink(this, sink);
        });
    }
};
__decorate([
    defaultConstructor
], Converter.prototype, "Converter", null);
__decorate([
    Abstract
], Converter.prototype, "convert", null);
Converter = __decorate([
    DartClass,
    Implements(async.DartStreamTransformer)
], Converter);
export { Converter };
let AsciiCodec = class AsciiCodec extends Encoding {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    AsciiCodec(_namedArguments) {
        let { allowInvalid } = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        this._allowInvalid = allowInvalid;
    }
    get name() {
        return "us-ascii";
    }
    decode(bytes, _namedArguments) {
        let { allowInvalid } = Object.assign({}, _namedArguments);
        if (allowInvalid == null)
            allowInvalid = this._allowInvalid;
        if (allowInvalid) {
            return new AsciiDecoder({
                allowInvalid: true
            }).convert(bytes);
        }
        else {
            return new AsciiDecoder({
                allowInvalid: false
            }).convert(bytes);
        }
    }
    get encoder() {
        return new AsciiEncoder();
    }
    get decoder() {
        return this._allowInvalid ? new AsciiDecoder({
            allowInvalid: true
        }) : new AsciiDecoder({
            allowInvalid: false
        });
    }
};
__decorate([
    defaultConstructor
], AsciiCodec.prototype, "AsciiCodec", null);
AsciiCodec = __decorate([
    DartClass
], AsciiCodec);
export { AsciiCodec };
let _UnicodeSubsetEncoder = class _UnicodeSubsetEncoder extends Converter {
    constructor(_subsetMask) {
        // @ts-ignore
        super();
    }
    _UnicodeSubsetEncoder(_subsetMask) {
        this._subsetMask = _subsetMask;
    }
    convert(string, start, end) {
        start = start || 0;
        let stringLength = string.length;
        core.RangeError.checkValidRange(start, end, stringLength);
        if (end == null)
            end = stringLength;
        let length = end - start;
        let result = new typed_data.Uint8List(length);
        for (let i = 0; i < length; i++) {
            let codeUnit = new core.DartString(string).codeUnitAt(start + i);
            if ((codeUnit & ~this._subsetMask) != 0) {
                throw new core.ArgumentError("String contains invalid characters.");
            }
            op(Op.INDEX_ASSIGN, result, i, codeUnit);
        }
        return result;
    }
    startChunkedConversion(sink) {
        if (isNot(sink, ByteConversionSink)) {
            sink = new ByteConversionSink.from(sink);
        }
        return new _UnicodeSubsetEncoderSink(this._subsetMask, sink);
    }
    bind(stream) {
        return super.bind(stream);
    }
};
__decorate([
    defaultConstructor
], _UnicodeSubsetEncoder.prototype, "_UnicodeSubsetEncoder", null);
_UnicodeSubsetEncoder = __decorate([
    DartClass
], _UnicodeSubsetEncoder);
export { _UnicodeSubsetEncoder };
let AsciiEncoder = class AsciiEncoder extends _UnicodeSubsetEncoder {
    constructor() {
        // @ts-ignore
        super();
    }
    AsciiEncoder() {
        super._UnicodeSubsetEncoder(properties._ASCII_MASK);
    }
};
__decorate([
    defaultConstructor
], AsciiEncoder.prototype, "AsciiEncoder", null);
AsciiEncoder = __decorate([
    DartClass
], AsciiEncoder);
export { AsciiEncoder };
let ChunkedConversionSink = class ChunkedConversionSink {
    constructor() {
    }
    ChunkedConversionSink() {
    }
    static _withCallback(callback) {
        return new _SimpleCallbackSink(callback);
    }
    add(chunk) {
        throw 'abstract';
    }
    close() {
        throw 'abstract';
    }
};
__decorate([
    defaultConstructor
], ChunkedConversionSink.prototype, "ChunkedConversionSink", null);
__decorate([
    Abstract
], ChunkedConversionSink.prototype, "add", null);
__decorate([
    Abstract
], ChunkedConversionSink.prototype, "close", null);
__decorate([
    namedFactory
], ChunkedConversionSink, "_withCallback", null);
ChunkedConversionSink = __decorate([
    DartClass,
    Implements(core.DartSink)
], ChunkedConversionSink);
export { ChunkedConversionSink };
let StringConversionSink = class StringConversionSink extends ChunkedConversionSink {
    constructor() {
        // @ts-ignore
        super();
    }
    StringConversionSink() {
    }
    static _withCallbackString(callback) {
        return new _StringCallbackSink(callback);
    }
    static _from(sink) {
        return new _StringAdapterSink(sink);
    }
    static _fromStringSink(sink) {
        return new _StringSinkConversionSink(sink);
    }
    addSlice(chunk, start, end, isLast) {
        throw 'abstract';
    }
    asUtf8Sink(allowMalformed) {
        throw 'abstract';
    }
    asStringSink() {
        throw 'abstract';
    }
};
__decorate([
    defaultConstructor
], StringConversionSink.prototype, "StringConversionSink", null);
__decorate([
    Abstract
], StringConversionSink.prototype, "addSlice", null);
__decorate([
    Abstract
], StringConversionSink.prototype, "asUtf8Sink", null);
__decorate([
    Abstract
], StringConversionSink.prototype, "asStringSink", null);
__decorate([
    namedFactory
], StringConversionSink, "_withCallbackString", null);
__decorate([
    namedFactory
], StringConversionSink, "_from", null);
__decorate([
    namedFactory
], StringConversionSink, "_fromStringSink", null);
StringConversionSink = __decorate([
    DartClass
], StringConversionSink);
export { StringConversionSink };
let StringConversionSinkMixin = class StringConversionSinkMixin extends StringConversionSink {
    addSlice(str, start, end, isLast) {
        throw 'abstract';
    }
    close() {
        throw 'abstract';
    }
    add(str) {
        this.addSlice(str, 0, str.length, false);
    }
    asUtf8Sink(allowMalformed) {
        return new _Utf8ConversionSink(this, allowMalformed);
    }
    asStringSink() {
        return new _StringConversionSinkAsStringSinkAdapter(this);
    }
};
__decorate([
    Abstract
], StringConversionSinkMixin.prototype, "addSlice", null);
__decorate([
    Abstract
], StringConversionSinkMixin.prototype, "close", null);
StringConversionSinkMixin = __decorate([
    DartClass
], StringConversionSinkMixin);
export { StringConversionSinkMixin };
let StringConversionSinkBase = class StringConversionSinkBase extends StringConversionSinkMixin {
};
StringConversionSinkBase = __decorate([
    DartClass
], StringConversionSinkBase);
export { StringConversionSinkBase };
let _UnicodeSubsetEncoderSink = class _UnicodeSubsetEncoderSink extends StringConversionSinkBase {
    constructor(_subsetMask, _sink) {
        // @ts-ignore
        super();
    }
    _UnicodeSubsetEncoderSink(_subsetMask, _sink) {
        this._subsetMask = _subsetMask;
        this._sink = _sink;
    }
    close() {
        this._sink.close();
    }
    addSlice(source, start, end, isLast) {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i = start; i < end; i++) {
            let codeUnit = new core.DartString(source).codeUnitAt(i);
            if ((codeUnit & ~this._subsetMask) != 0) {
                throw new core.ArgumentError(`Source contains invalid character with code point: ${codeUnit}.`);
            }
        }
        this._sink.add(new core.DartString(source).codeUnits.sublist(start, end));
        if (isLast) {
            this.close();
        }
    }
};
__decorate([
    defaultConstructor
], _UnicodeSubsetEncoderSink.prototype, "_UnicodeSubsetEncoderSink", null);
_UnicodeSubsetEncoderSink = __decorate([
    DartClass
], _UnicodeSubsetEncoderSink);
export { _UnicodeSubsetEncoderSink };
let _UnicodeSubsetDecoder = class _UnicodeSubsetDecoder extends Converter {
    constructor(_allowInvalid, _subsetMask) {
        // @ts-ignore
        super();
    }
    _UnicodeSubsetDecoder(_allowInvalid, _subsetMask) {
        this._allowInvalid = _allowInvalid;
        this._subsetMask = _subsetMask;
    }
    convert(bytes, start, end) {
        start = start || 0;
        let byteCount = bytes.length;
        core.RangeError.checkValidRange(start, end, byteCount);
        if (end == null)
            end = byteCount;
        for (let i = start; i < end; i++) {
            let byte = bytes[i];
            if ((byte & ~this._subsetMask) != 0) {
                if (!this._allowInvalid) {
                    throw new core.FormatException(`Invalid value in input: ${byte}`);
                }
                return this._convertInvalid(bytes, start, end);
            }
        }
        return new core.DartString.fromCharCodes(bytes, start, end).valueOf();
    }
    _convertInvalid(bytes, start, end) {
        let buffer = new core.DartStringBuffer();
        for (let i = start; i < end; i++) {
            let value = bytes[i];
            if ((value & ~this._subsetMask) != 0)
                value = 65533;
            buffer.writeCharCode(value);
        }
        return buffer.toString();
    }
    startChunkedConversion(sink) {
        throw 'abstract';
    }
    bind(stream) {
        return super.bind(stream);
    }
};
__decorate([
    defaultConstructor
], _UnicodeSubsetDecoder.prototype, "_UnicodeSubsetDecoder", null);
__decorate([
    Abstract
], _UnicodeSubsetDecoder.prototype, "startChunkedConversion", null);
_UnicodeSubsetDecoder = __decorate([
    DartClass
], _UnicodeSubsetDecoder);
export { _UnicodeSubsetDecoder };
let AsciiDecoder = class AsciiDecoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    AsciiDecoder(_namedArguments) {
        let { allowInvalid } = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        super._UnicodeSubsetDecoder(allowInvalid, properties._ASCII_MASK);
    }
    startChunkedConversion(sink) {
        let stringSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        }
        else {
            stringSink = new StringConversionSink.from(sink);
        }
        if (this._allowInvalid) {
            return new _ErrorHandlingAsciiDecoderSink(stringSink.asUtf8Sink(false));
        }
        else {
            return new _SimpleAsciiDecoderSink(stringSink);
        }
    }
};
__decorate([
    defaultConstructor
], AsciiDecoder.prototype, "AsciiDecoder", null);
AsciiDecoder = __decorate([
    DartClass
], AsciiDecoder);
export { AsciiDecoder };
let ByteConversionSink = class ByteConversionSink extends ChunkedConversionSink {
    constructor() {
        // @ts-ignore
        super();
    }
    ByteConversionSink() {
    }
    static _withCallbackBinary(callback) {
        return new _ByteCallbackSink(callback);
    }
    static _from(sink) {
        return new _ByteAdapterSink(sink);
    }
    addSlice(chunk, start, end, isLast) {
        throw 'abstract';
    }
};
__decorate([
    defaultConstructor
], ByteConversionSink.prototype, "ByteConversionSink", null);
__decorate([
    Abstract
], ByteConversionSink.prototype, "addSlice", null);
__decorate([
    namedFactory
], ByteConversionSink, "_withCallbackBinary", null);
__decorate([
    namedFactory
], ByteConversionSink, "_from", null);
ByteConversionSink = __decorate([
    DartClass
], ByteConversionSink);
export { ByteConversionSink };
let ByteConversionSinkBase = class ByteConversionSinkBase extends ByteConversionSink {
    add(chunk) {
        throw 'abstract';
    }
    close() {
        throw 'abstract';
    }
    addSlice(chunk, start, end, isLast) {
        this.add(chunk.sublist(start, end));
        if (isLast)
            this.close();
    }
};
__decorate([
    Abstract
], ByteConversionSinkBase.prototype, "add", null);
__decorate([
    Abstract
], ByteConversionSinkBase.prototype, "close", null);
ByteConversionSinkBase = __decorate([
    DartClass
], ByteConversionSinkBase);
export { ByteConversionSinkBase };
let _ErrorHandlingAsciiDecoderSink = class _ErrorHandlingAsciiDecoderSink extends ByteConversionSinkBase {
    constructor(_utf8Sink) {
        // @ts-ignore
        super();
    }
    _ErrorHandlingAsciiDecoderSink(_utf8Sink) {
        this._utf8Sink = _utf8Sink;
    }
    close() {
        this._utf8Sink.close();
    }
    add(source) {
        this.addSlice(source, 0, source.length, false);
    }
    addSlice(source, start, end, isLast) {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i = start; i < end; i++) {
            if ((source[i] & ~properties._ASCII_MASK) != 0) {
                if (i > start)
                    this._utf8Sink.addSlice(source, start, i, false);
                this._utf8Sink.add(new core.DartList.literal(239, 191, 189));
                start = i + 1;
            }
        }
        if (start < end) {
            this._utf8Sink.addSlice(source, start, end, isLast);
        }
        else if (isLast) {
            this.close();
        }
    }
};
__decorate([
    defaultConstructor
], _ErrorHandlingAsciiDecoderSink.prototype, "_ErrorHandlingAsciiDecoderSink", null);
_ErrorHandlingAsciiDecoderSink = __decorate([
    DartClass
], _ErrorHandlingAsciiDecoderSink);
export { _ErrorHandlingAsciiDecoderSink };
let _SimpleAsciiDecoderSink = class _SimpleAsciiDecoderSink extends ByteConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
    }
    _SimpleAsciiDecoderSink(_sink) {
        this._sink = _sink;
    }
    close() {
        this._sink.close();
    }
    add(source) {
        for (let i = 0; i < source.length; i++) {
            if ((source[i] & ~properties._ASCII_MASK) != 0) {
                throw new core.FormatException("Source contains non-ASCII bytes.");
            }
        }
        this._sink.add(new core.DartString.fromCharCodes(source).valueOf());
    }
    addSlice(source, start, end, isLast) {
        let length = source.length;
        core.RangeError.checkValidRange(start, end, length);
        if (start < end) {
            if (start != 0 || end != length) {
                source = source.sublist(start, end);
            }
            this.add(source);
        }
        if (isLast)
            this.close();
    }
};
__decorate([
    defaultConstructor
], _SimpleAsciiDecoderSink.prototype, "_SimpleAsciiDecoderSink", null);
_SimpleAsciiDecoderSink = __decorate([
    DartClass
], _SimpleAsciiDecoderSink);
export { _SimpleAsciiDecoderSink };
let Base64Codec = Base64Codec_1 = class Base64Codec extends Codec {
    constructor() {
        // @ts-ignore
        super();
    }
    Base64Codec() {
        this._encoder = new Base64Encoder();
    }
    urlSafe() {
        this._encoder = new Base64Encoder.urlSafe();
    }
    get encoder() {
        return this._encoder;
    }
    get decoder() {
        return new Base64Decoder();
    }
    normalize(source, start, end) {
        start = start || 0;
        end = core.RangeError.checkValidRange(start, end, source.length);
        let percent = 37;
        let equals = 61;
        let buffer = null;
        let sliceStart = start;
        let alphabet = _Base64Encoder._base64Alphabet;
        let inverseAlphabet = _Base64Decoder._inverseAlphabet;
        let firstPadding = -1;
        let firstPaddingSourceIndex = -1;
        let paddingCount = 0;
        for (let i = start; i < end;) {
            let sliceEnd = i;
            let char = new core.DartString(source).codeUnitAt(i++);
            let originalChar = char;
            if (char == percent) {
                if (i + 2 <= end) {
                    char = _internal.parseHexByte(source, i);
                    i = 2;
                    if (char == percent)
                        char = -1;
                }
                else {
                    char = -1;
                }
            }
            if (0 <= char && char <= 127) {
                let value = inverseAlphabet[char];
                if (value >= 0) {
                    char = new core.DartString(alphabet).codeUnitAt(value);
                    if (char == originalChar)
                        continue;
                }
                else if (value == _Base64Decoder._padding) {
                    if (firstPadding < 0) {
                        firstPadding = (buffer.length || 0) + (sliceEnd - sliceStart);
                        firstPaddingSourceIndex = sliceEnd;
                    }
                    paddingCount++;
                    if (originalChar == equals)
                        continue;
                }
                if (value != _Base64Decoder._invalid) {
                    buffer = new core.DartStringBuffer();
                    buffer.write(source.substring(sliceStart, sliceEnd));
                    buffer.writeCharCode(char);
                    sliceStart = i;
                    continue;
                }
            }
            throw new core.FormatException("Invalid base64 data", source, sliceEnd);
        }
        if (buffer != null) {
            buffer.write(source.substring(sliceStart, end));
            if (firstPadding >= 0) {
                Base64Codec_1._checkPadding(source, firstPaddingSourceIndex, end, firstPadding, paddingCount, buffer.length);
            }
            else {
                let endLength = ((buffer.length - 1) % 4) + 1;
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
        let length = end - start;
        if (firstPadding >= 0) {
            Base64Codec_1._checkPadding(source, firstPaddingSourceIndex, end, firstPadding, paddingCount, length);
        }
        else {
            let endLength = length % 4;
            if (endLength == 1) {
                throw new core.FormatException("Invalid base64 encoding length ", source, end);
            }
            if (endLength > 1) {
                source = new core.DartString(source).replaceRange(end, end, (endLength == 2) ? "==" : "=");
            }
        }
        return source;
    }
    static _checkPadding(source, sourceIndex, sourceEnd, firstPadding, paddingCount, length) {
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
};
__decorate([
    defaultConstructor
], Base64Codec.prototype, "Base64Codec", null);
__decorate([
    namedConstructor
], Base64Codec.prototype, "urlSafe", null);
Base64Codec = Base64Codec_1 = __decorate([
    DartClass
], Base64Codec);
export { Base64Codec };
let Base64Encoder = class Base64Encoder extends Converter {
    constructor() {
        // @ts-ignore
        super();
    }
    Base64Encoder() {
        this._urlSafe = false;
    }
    urlSafe() {
        this._urlSafe = true;
    }
    convert(input) {
        if (input.isEmpty)
            return "";
        let encoder = new _Base64Encoder(this._urlSafe);
        let buffer = encoder.encode(input, 0, input.length, true);
        return new core.DartString.fromCharCodes(buffer).valueOf();
    }
    startChunkedConversion(sink) {
        if (is(sink, StringConversionSink)) {
            return new _Utf8Base64EncoderSink(sink.asUtf8Sink(false), this._urlSafe);
        }
        return new _AsciiBase64EncoderSink(sink, this._urlSafe);
    }
};
__decorate([
    defaultConstructor
], Base64Encoder.prototype, "Base64Encoder", null);
__decorate([
    namedConstructor
], Base64Encoder.prototype, "urlSafe", null);
Base64Encoder = __decorate([
    DartClass
], Base64Encoder);
export { Base64Encoder };
let _Base64Encoder = _Base64Encoder_1 = class _Base64Encoder {
    constructor(urlSafe) {
        this._state = 0;
    }
    _Base64Encoder(urlSafe) {
        this._alphabet = urlSafe ? _Base64Encoder_1._base64urlAlphabet : _Base64Encoder_1._base64Alphabet;
    }
    static _encodeState(count, bits) {
        /* TODO (AssertStatementImpl) : assert (count <= _countMask); */
        ;
        return bits << _Base64Encoder_1._valueShift | count;
    }
    static _stateBits(state) {
        return state >> _Base64Encoder_1._valueShift;
    }
    static _stateCount(state) {
        return state & _Base64Encoder_1._countMask;
    }
    createBuffer(bufferLength) {
        return new typed_data.Uint8List(bufferLength);
    }
    encode(bytes, start, end, isLast) {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */
        ;
        /* TODO (AssertStatementImpl) : assert (start <= end); */
        ;
        /* TODO (AssertStatementImpl) : assert (bytes == null || end <= bytes.length); */
        ;
        let length = end - start;
        let count = _Base64Encoder_1._stateCount(this._state);
        let byteCount = (count + length);
        let fullChunks = op(Op.QUOTIENT, byteCount, 3);
        let partialChunkLength = byteCount - fullChunks * 3;
        let bufferLength = fullChunks * 4;
        if (isLast && partialChunkLength > 0) {
            bufferLength = 4;
        }
        let output = this.createBuffer(bufferLength);
        this._state = _Base64Encoder_1.encodeChunk(this._alphabet, bytes, start, end, isLast, output, 0, this._state);
        if (bufferLength > 0)
            return output;
        return null;
    }
    static encodeChunk(alphabet, bytes, start, end, isLast, output, outputIndex, state) {
        let bits = _Base64Encoder_1._stateBits(state);
        let expectedChars = 3 - _Base64Encoder_1._stateCount(state);
        let byteOr = 0;
        for (let i = start; i < end; i++) {
            let byte = bytes[i];
            byteOr = byte;
            bits = ((bits << 8) | byte) & 16777215;
            expectedChars--;
            if (expectedChars == 0) {
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 18) & _Base64Encoder_1._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 12) & _Base64Encoder_1._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 6) & _Base64Encoder_1._sixBitMask));
                op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt(bits & _Base64Encoder_1._sixBitMask));
                expectedChars = 3;
                bits = 0;
            }
        }
        if (byteOr >= 0 && byteOr <= 255) {
            if (isLast && expectedChars < 3) {
                _Base64Encoder_1.writeFinalChunk(alphabet, output, outputIndex, 3 - expectedChars, bits);
                return 0;
            }
            return _Base64Encoder_1._encodeState(3 - expectedChars, bits);
        }
        let i = start;
        while (i < end) {
            let byte = bytes[i];
            if (byte < 0 || byte > 255)
                break;
            i++;
        }
        throw new core.ArgumentError.value(bytes, `Not a byte value at index ${i}: 0x${bytes[i].toRadixString(16)}`);
    }
    static writeFinalChunk(alphabet, output, outputIndex, count, bits) {
        /* TODO (AssertStatementImpl) : assert (count > 0); */
        ;
        if (count == 1) {
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 2) & _Base64Encoder_1._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits << 4) & _Base64Encoder_1._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
        }
        else {
            /* TODO (AssertStatementImpl) : assert (count == 2); */
            ;
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 10) & _Base64Encoder_1._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits >> 4) & _Base64Encoder_1._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, new core.DartString(alphabet).codeUnitAt((bits << 2) & _Base64Encoder_1._sixBitMask));
            op(Op.INDEX_ASSIGN, output, outputIndex++, properties._paddingChar);
        }
    }
};
_Base64Encoder._base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
_Base64Encoder._base64urlAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
_Base64Encoder._valueShift = 2;
_Base64Encoder._countMask = 3;
_Base64Encoder._sixBitMask = 63;
__decorate([
    defaultConstructor
], _Base64Encoder.prototype, "_Base64Encoder", null);
_Base64Encoder = _Base64Encoder_1 = __decorate([
    DartClass
], _Base64Encoder);
export { _Base64Encoder };
let _BufferCachingBase64Encoder = class _BufferCachingBase64Encoder extends _Base64Encoder {
    constructor(urlSafe) {
        // @ts-ignore
        super();
    }
    _BufferCachingBase64Encoder(urlSafe) {
        super._Base64Encoder(urlSafe);
    }
    createBuffer(bufferLength) {
        if (op(Op.EQUALS, this.bufferCache, null) || this.bufferCache.length < bufferLength) {
            this.bufferCache = new typed_data.Uint8List(bufferLength);
        }
        return new typed_data.Uint8List.view(this.bufferCache.buffer, 0, bufferLength);
    }
};
__decorate([
    defaultConstructor
], _BufferCachingBase64Encoder.prototype, "_BufferCachingBase64Encoder", null);
_BufferCachingBase64Encoder = __decorate([
    DartClass
], _BufferCachingBase64Encoder);
export { _BufferCachingBase64Encoder };
let _Base64EncoderSink = class _Base64EncoderSink extends ByteConversionSinkBase {
    add(source) {
        this._add(source, 0, source.length, false);
    }
    close() {
        this._add(null, 0, 0, true);
    }
    addSlice(source, start, end, isLast) {
        if (end == null)
            throw new core.ArgumentError.notNull("end");
        core.RangeError.checkValidRange(start, end, source.length);
        this._add(source, start, end, isLast);
    }
    _add(source, start, end, isLast) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], _Base64EncoderSink.prototype, "_add", null);
_Base64EncoderSink = __decorate([
    DartClass
], _Base64EncoderSink);
export { _Base64EncoderSink };
let _AsciiBase64EncoderSink = class _AsciiBase64EncoderSink extends _Base64EncoderSink {
    constructor(_sink, urlSafe) {
        // @ts-ignore
        super();
    }
    _AsciiBase64EncoderSink(_sink, urlSafe) {
        this._encoder = new _BufferCachingBase64Encoder(urlSafe);
        this._sink = _sink;
    }
    _add(source, start, end, isLast) {
        let buffer = this._encoder.encode(source, start, end, isLast);
        if (buffer != null) {
            let string = new core.DartString.fromCharCodes(buffer).valueOf();
            this._sink.add(string);
        }
        if (isLast) {
            this._sink.close();
        }
    }
};
__decorate([
    defaultConstructor
], _AsciiBase64EncoderSink.prototype, "_AsciiBase64EncoderSink", null);
_AsciiBase64EncoderSink = __decorate([
    DartClass
], _AsciiBase64EncoderSink);
export { _AsciiBase64EncoderSink };
let _Utf8Base64EncoderSink = class _Utf8Base64EncoderSink extends _Base64EncoderSink {
    constructor(_sink, urlSafe) {
        // @ts-ignore
        super();
    }
    _Utf8Base64EncoderSink(_sink, urlSafe) {
        this._encoder = new _Base64Encoder(urlSafe);
        this._sink = _sink;
    }
    _add(source, start, end, isLast) {
        let buffer = this._encoder.encode(source, start, end, isLast);
        if (buffer != null) {
            this._sink.addSlice(buffer, 0, buffer.length, isLast);
        }
    }
};
__decorate([
    defaultConstructor
], _Utf8Base64EncoderSink.prototype, "_Utf8Base64EncoderSink", null);
_Utf8Base64EncoderSink = __decorate([
    DartClass
], _Utf8Base64EncoderSink);
export { _Utf8Base64EncoderSink };
let Base64Decoder = class Base64Decoder extends Converter {
    constructor() {
        // @ts-ignore
        super();
    }
    Base64Decoder() {
    }
    convert(input, start, end) {
        start = start || 0;
        end = core.RangeError.checkValidRange(start, end, input.length);
        if (start == end)
            return new typed_data.Uint8List(0);
        let decoder = new _Base64Decoder();
        let buffer = decoder.decode(input, start, end);
        decoder.close(input, end);
        return buffer;
    }
    startChunkedConversion(sink) {
        return new _Base64DecoderSink(sink);
    }
};
__decorate([
    defaultConstructor
], Base64Decoder.prototype, "Base64Decoder", null);
Base64Decoder = __decorate([
    DartClass
], Base64Decoder);
export { Base64Decoder };
let _Base64Decoder = _Base64Decoder_1 = class _Base64Decoder {
    constructor() {
        this._state = 0;
    }
    static _encodeCharacterState(count, bits) {
        /* TODO (AssertStatementImpl) : assert (count == (count & _countMask)); */
        ;
        return (bits << _Base64Decoder_1._valueShift | count);
    }
    static _stateCount(state) {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        return state & _Base64Decoder_1._countMask;
    }
    static _stateBits(state) {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        return state >> _Base64Decoder_1._valueShift;
    }
    static _encodePaddingState(expectedPadding) {
        /* TODO (AssertStatementImpl) : assert (expectedPadding >= 0); */
        ;
        /* TODO (AssertStatementImpl) : assert (expectedPadding <= 5); */
        ;
        return -expectedPadding - 1;
    }
    static _statePadding(state) {
        /* TODO (AssertStatementImpl) : assert (state < 0); */
        ;
        return -state - 1;
    }
    static _hasSeenPadding(state) {
        return state < 0;
    }
    decode(input, start, end) {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */
        ;
        /* TODO (AssertStatementImpl) : assert (start <= end); */
        ;
        /* TODO (AssertStatementImpl) : assert (end <= input.length); */
        ;
        if (_Base64Decoder_1._hasSeenPadding(this._state)) {
            this._state = _Base64Decoder_1._checkPadding(input, start, end, this._state);
            return null;
        }
        if (start == end)
            return new typed_data.Uint8List(0);
        let buffer = _Base64Decoder_1._allocateBuffer(input, start, end, this._state);
        this._state = _Base64Decoder_1.decodeChunk(input, start, end, buffer, 0, this._state);
        return buffer;
    }
    close(input, end) {
        if (this._state < _Base64Decoder_1._encodePaddingState(0)) {
            throw new core.FormatException("Missing padding character", input, end);
        }
        if (this._state > 0) {
            throw new core.FormatException("Invalid length, must be multiple of four", input, end);
        }
        this._state = _Base64Decoder_1._encodePaddingState(0);
    }
    static decodeChunk(input, start, end, output, outIndex, state) {
        /* TODO (AssertStatementImpl) : assert (!_hasSeenPadding(state)); */
        ;
        let asciiMask = 127;
        let asciiMax = 127;
        let eightBitMask = 255;
        let bitsPerCharacter = 6;
        let bits = _Base64Decoder_1._stateBits(state);
        let count = _Base64Decoder_1._stateCount(state);
        let charOr = 0;
        for (let i = start; i < end; i++) {
            let char = new core.DartString(input).codeUnitAt(i);
            charOr = char;
            let code = _Base64Decoder_1._inverseAlphabet[char & asciiMask];
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
                continue;
            }
            else if (code == _Base64Decoder_1._padding && count > 1) {
                if (charOr < 0 || charOr > asciiMax)
                    break;
                if (count == 3) {
                    if ((bits & 3) != 0) {
                        throw new core.FormatException("Invalid encoding before padding", input, i);
                    }
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 10);
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 2);
                }
                else {
                    if ((bits & 15) != 0) {
                        throw new core.FormatException("Invalid encoding before padding", input, i);
                    }
                    op(Op.INDEX_ASSIGN, output, outIndex++, bits >> 4);
                }
                let expectedPadding = (3 - count) * 3;
                if (char == _Base64Decoder_1._char_percent)
                    expectedPadding = 2;
                state = _Base64Decoder_1._encodePaddingState(expectedPadding);
                return _Base64Decoder_1._checkPadding(input, i + 1, end, state);
            }
            throw new core.FormatException("Invalid character", input, i);
        }
        if (charOr >= 0 && charOr <= asciiMax) {
            return _Base64Decoder_1._encodeCharacterState(count, bits);
        }
        let i;
        for (i = start; i < end; i++) {
            let char = new core.DartString(input).codeUnitAt(i);
            if (char < 0 || char > asciiMax)
                break;
        }
        throw new core.FormatException("Invalid character", input, i);
    }
    static _allocateBuffer(input, start, end, state) {
        /* TODO (AssertStatementImpl) : assert (state >= 0); */
        ;
        let paddingStart = _Base64Decoder_1._trimPaddingChars(input, start, end);
        let length = _Base64Decoder_1._stateCount(state) + (paddingStart - start);
        let bufferLength = (length >> 2) * 3;
        let remainderLength = length & 3;
        if (remainderLength != 0 && paddingStart < end) {
            bufferLength = remainderLength - 1;
        }
        if (bufferLength > 0)
            return new typed_data.Uint8List(bufferLength);
        return null;
    }
    static _trimPaddingChars(input, start, end) {
        let padding = 0;
        let index = end;
        let newEnd = end;
        while (index > start && padding < 2) {
            index--;
            let char = new core.DartString(input).codeUnitAt(index);
            if (char == properties._paddingChar) {
                padding++;
                newEnd = index;
                continue;
            }
            if ((char | 32) == _Base64Decoder_1._char_d) {
                if (index == start)
                    break;
                index--;
                char = new core.DartString(input).codeUnitAt(index);
            }
            if (char == _Base64Decoder_1._char_3) {
                if (index == start)
                    break;
                index--;
                char = new core.DartString(input).codeUnitAt(index);
            }
            if (char == _Base64Decoder_1._char_percent) {
                padding++;
                newEnd = index;
                continue;
            }
            break;
        }
        return newEnd;
    }
    static _checkPadding(input, start, end, state) {
        /* TODO (AssertStatementImpl) : assert (_hasSeenPadding(state)); */
        ;
        if (start == end)
            return state;
        let expectedPadding = _Base64Decoder_1._statePadding(state);
        /* TODO (AssertStatementImpl) : assert (expectedPadding >= 0); */
        ;
        /* TODO (AssertStatementImpl) : assert (expectedPadding < 6); */
        ;
        while (expectedPadding > 0) {
            let char = new core.DartString(input).codeUnitAt(start);
            if (expectedPadding == 3) {
                if (char == properties._paddingChar) {
                    expectedPadding = 3;
                    start++;
                    break;
                }
                if (char == _Base64Decoder_1._char_percent) {
                    expectedPadding--;
                    start++;
                    if (start == end)
                        break;
                    char = new core.DartString(input).codeUnitAt(start);
                }
                else {
                    break;
                }
            }
            let expectedPartialPadding = expectedPadding;
            if (expectedPartialPadding > 3)
                expectedPartialPadding = 3;
            if (expectedPartialPadding == 2) {
                if (char != _Base64Decoder_1._char_3)
                    break;
                start++;
                expectedPadding--;
                if (start == end)
                    break;
                char = new core.DartString(input).codeUnitAt(start);
            }
            if ((char | 32) != _Base64Decoder_1._char_d)
                break;
            start++;
            expectedPadding--;
            if (start == end)
                break;
        }
        if (start != end) {
            throw new core.FormatException("Invalid padding character", input, start);
        }
        return _Base64Decoder_1._encodePaddingState(expectedPadding);
    }
};
_Base64Decoder._valueShift = 2;
_Base64Decoder._countMask = 3;
_Base64Decoder._invalid = -2;
_Base64Decoder._padding = -1;
_Base64Decoder.__ = _Base64Decoder_1._invalid;
_Base64Decoder._p = _Base64Decoder_1._padding;
_Base64Decoder._inverseAlphabet = new typed_data.Int8List.fromList(new core.DartList.literal(_Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1._p, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, 62, _Base64Decoder_1.__, 62, _Base64Decoder_1.__, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1._p, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, 63, _Base64Decoder_1.__, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__, _Base64Decoder_1.__));
_Base64Decoder._char_percent = 37;
_Base64Decoder._char_3 = 51;
_Base64Decoder._char_d = 100;
_Base64Decoder = _Base64Decoder_1 = __decorate([
    DartClass
], _Base64Decoder);
export { _Base64Decoder };
let _Base64DecoderSink = class _Base64DecoderSink extends StringConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
        this._decoder = new _Base64Decoder();
    }
    _Base64DecoderSink(_sink) {
        this._sink = _sink;
    }
    add(string) {
        if (new core.DartString(string).isEmpty)
            return;
        let buffer = this._decoder.decode(string, 0, string.length);
        if (buffer != null)
            this._sink.add(buffer);
    }
    close() {
        this._decoder.close(null, null);
        this._sink.close();
    }
    addSlice(string, start, end, isLast) {
        end = core.RangeError.checkValidRange(start, end, string.length);
        if (start == end)
            return;
        let buffer = this._decoder.decode(string, start, end);
        if (buffer != null)
            this._sink.add(buffer);
        if (isLast) {
            this._decoder.close(string, end);
            this._sink.close();
        }
    }
};
__decorate([
    defaultConstructor
], _Base64DecoderSink.prototype, "_Base64DecoderSink", null);
_Base64DecoderSink = __decorate([
    DartClass
], _Base64DecoderSink);
export { _Base64DecoderSink };
let _ByteAdapterSink = class _ByteAdapterSink extends ByteConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
    }
    _ByteAdapterSink(_sink) {
        this._sink = _sink;
    }
    add(chunk) {
        this._sink.add(chunk);
    }
    close() {
        this._sink.close();
    }
};
__decorate([
    defaultConstructor
], _ByteAdapterSink.prototype, "_ByteAdapterSink", null);
_ByteAdapterSink = __decorate([
    DartClass
], _ByteAdapterSink);
export { _ByteAdapterSink };
let _ByteCallbackSink = _ByteCallbackSink_1 = class _ByteCallbackSink extends ByteConversionSinkBase {
    constructor(callback) {
        // @ts-ignore
        super();
        this._buffer = new typed_data.Uint8List(_ByteCallbackSink_1._INITIAL_BUFFER_SIZE);
        this._bufferIndex = 0;
    }
    _ByteCallbackSink(callback) {
        this._callback = callback;
    }
    add(chunk) {
        let freeCount = this._buffer.length - this._bufferIndex;
        if (chunk.length > freeCount) {
            let oldLength = this._buffer.length;
            let newLength = _ByteCallbackSink_1._roundToPowerOf2(chunk.length + oldLength) * 2;
            let grown = new typed_data.Uint8List(newLength);
            grown.setRange(0, this._buffer.length, this._buffer);
            this._buffer = grown;
        }
        this._buffer.setRange(this._bufferIndex, this._bufferIndex + chunk.length, chunk);
        this._bufferIndex = chunk.length;
    }
    static _roundToPowerOf2(v) {
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
    close() {
        this._callback(this._buffer.sublist(0, this._bufferIndex));
    }
};
_ByteCallbackSink._INITIAL_BUFFER_SIZE = 1024;
__decorate([
    defaultConstructor
], _ByteCallbackSink.prototype, "_ByteCallbackSink", null);
_ByteCallbackSink = _ByteCallbackSink_1 = __decorate([
    DartClass
], _ByteCallbackSink);
export { _ByteCallbackSink };
let _SimpleCallbackSink = class _SimpleCallbackSink extends ChunkedConversionSink {
    constructor(_callback) {
        // @ts-ignore
        super();
        this._accumulated = new core.DartList.literal();
    }
    _SimpleCallbackSink(_callback) {
        this._callback = _callback;
    }
    add(chunk) {
        this._accumulated.add(chunk);
    }
    close() {
        this._callback(this._accumulated);
    }
};
__decorate([
    defaultConstructor
], _SimpleCallbackSink.prototype, "_SimpleCallbackSink", null);
_SimpleCallbackSink = __decorate([
    DartClass
], _SimpleCallbackSink);
export { _SimpleCallbackSink };
let _ConverterStreamEventSink = class _ConverterStreamEventSink {
    constructor(converter, sink) {
    }
    _ConverterStreamEventSink(converter, sink) {
        this._eventSink = sink;
        this._chunkedSink = converter.startChunkedConversion(sink);
    }
    add(o) {
        this._chunkedSink.add(o);
    }
    addError(error, stackTrace) {
        this._eventSink.addError(error, stackTrace);
    }
    close() {
        this._chunkedSink.close();
    }
};
__decorate([
    defaultConstructor
], _ConverterStreamEventSink.prototype, "_ConverterStreamEventSink", null);
_ConverterStreamEventSink = __decorate([
    DartClass,
    Implements(async.DartEventSink)
], _ConverterStreamEventSink);
export { _ConverterStreamEventSink };
let _FusedCodec = class _FusedCodec extends Codec {
    constructor(_first, _second) {
        // @ts-ignore
        super();
    }
    get encoder() {
        return this._first.encoder.fuse(this._second.encoder);
    }
    get decoder() {
        return this._second.decoder.fuse(this._first.decoder);
    }
    _FusedCodec(_first, _second) {
        this._first = _first;
        this._second = _second;
    }
};
__decorate([
    defaultConstructor
], _FusedCodec.prototype, "_FusedCodec", null);
_FusedCodec = __decorate([
    DartClass
], _FusedCodec);
export { _FusedCodec };
let _InvertedCodec = class _InvertedCodec extends Codec {
    constructor(codec) {
        // @ts-ignore
        super();
    }
    _InvertedCodec(codec) {
        this._codec = codec;
    }
    get encoder() {
        return this._codec.decoder;
    }
    get decoder() {
        return this._codec.encoder;
    }
    get inverted() {
        return this._codec;
    }
};
__decorate([
    defaultConstructor
], _InvertedCodec.prototype, "_InvertedCodec", null);
_InvertedCodec = __decorate([
    DartClass
], _InvertedCodec);
export { _InvertedCodec };
let _FusedConverter = class _FusedConverter extends Converter {
    constructor(_first, _second) {
        // @ts-ignore
        super();
    }
    _FusedConverter(_first, _second) {
        this._first = _first;
        this._second = _second;
    }
    convert(input) {
        return this._second.convert(this._first.convert(input));
    }
    startChunkedConversion(sink) {
        return this._first.startChunkedConversion(this._second.startChunkedConversion(sink));
    }
};
__decorate([
    defaultConstructor
], _FusedConverter.prototype, "_FusedConverter", null);
_FusedConverter = __decorate([
    DartClass
], _FusedConverter);
export { _FusedConverter };
let HtmlEscapeMode = class HtmlEscapeMode {
    constructor(_namedArguments) {
    }
    _(_name, escapeLtGt, escapeQuot, escapeApos, escapeSlash) {
        this._name = _name;
        this.escapeLtGt = escapeLtGt;
        this.escapeQuot = escapeQuot;
        this.escapeApos = escapeApos;
        this.escapeSlash = escapeSlash;
    }
    HtmlEscapeMode(_namedArguments) {
        let { name, escapeLtGt, escapeQuot, escapeApos, escapeSlash } = Object.assign({
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
    toString() {
        return this._name;
    }
};
__decorate([
    namedConstructor
], HtmlEscapeMode.prototype, "_", null);
__decorate([
    defaultConstructor
], HtmlEscapeMode.prototype, "HtmlEscapeMode", null);
HtmlEscapeMode = __decorate([
    DartClass
], HtmlEscapeMode);
export { HtmlEscapeMode };
// Need to set this later because of decorator precedence
HtmlEscapeMode.UNKNOWN = new HtmlEscapeMode._('unknown', true, true, true, true);
HtmlEscapeMode.ATTRIBUTE = new HtmlEscapeMode._('attribute', true, true, false, false);
HtmlEscapeMode.SQ_ATTRIBUTE = new HtmlEscapeMode._('attribute', true, false, true, false);
HtmlEscapeMode.ELEMENT = new HtmlEscapeMode._('element', true, false, false, false);
let HtmlEscape = class HtmlEscape extends Converter {
    constructor(mode) {
        // @ts-ignore
        super();
    }
    HtmlEscape(mode) {
        mode = mode || HtmlEscapeMode.UNKNOWN;
        this.mode = mode;
    }
    convert(text) {
        let val = this._convert(text, 0, text.length);
        return val == null ? text : val;
    }
    _convert(text, start, end) {
        let result = null;
        for (let i = start; i < end; i++) {
            let ch = text[i];
            let replacement = null;
            switch (ch) {
                case '&':
                    replacement = '&amp;';
                    break;
                case '"':
                    if (this.mode.escapeQuot)
                        replacement = '&quot;';
                    break;
                case "'":
                    if (this.mode.escapeApos)
                        replacement = '&#39;';
                    break;
                case '<':
                    if (this.mode.escapeLtGt)
                        replacement = '&lt;';
                    break;
                case '>':
                    if (this.mode.escapeLtGt)
                        replacement = '&gt;';
                    break;
                case '/':
                    if (this.mode.escapeSlash)
                        replacement = '&#47;';
                    break;
            }
            if (replacement != null) {
                if (op(Op.EQUALS, result, null))
                    result = new core.DartStringBuffer();
                if (i > start)
                    result.write(text.substring(start, i));
                result.write(replacement);
                start = i + 1;
            }
        }
        if (op(Op.EQUALS, result, null))
            return null;
        if (end > start)
            result.write(text.substring(start, end));
        return result.toString();
    }
    startChunkedConversion(sink) {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        }
        return new _HtmlEscapeSink(this, sink);
    }
};
__decorate([
    defaultConstructor
], HtmlEscape.prototype, "HtmlEscape", null);
HtmlEscape = __decorate([
    DartClass
], HtmlEscape);
export { HtmlEscape };
let _HtmlEscapeSink = class _HtmlEscapeSink extends StringConversionSinkBase {
    constructor(_escape, _sink) {
        // @ts-ignore
        super();
    }
    _HtmlEscapeSink(_escape, _sink) {
        this._escape = _escape;
        this._sink = _sink;
    }
    addSlice(chunk, start, end, isLast) {
        let val = this._escape._convert(chunk, start, end);
        if (val == null) {
            this._sink.addSlice(chunk, start, end, isLast);
        }
        else {
            this._sink.add(val);
            if (isLast)
                this._sink.close();
        }
    }
    close() {
        this._sink.close();
    }
};
__decorate([
    defaultConstructor
], _HtmlEscapeSink.prototype, "_HtmlEscapeSink", null);
_HtmlEscapeSink = __decorate([
    DartClass
], _HtmlEscapeSink);
export { _HtmlEscapeSink };
let JsonUnsupportedObjectError = class JsonUnsupportedObjectError extends core.DartError {
    constructor(unsupportedObject, _namedArguments) {
        // @ts-ignore
        super();
    }
    JsonUnsupportedObjectError(unsupportedObject, _namedArguments) {
        let { cause } = Object.assign({}, _namedArguments);
        this.unsupportedObject = unsupportedObject;
        this.cause = cause;
    }
    toString() {
        if (this.cause != null) {
            return "Converting object to an encodable object failed.";
        }
        else {
            return "Converting object did not return an encodable object.";
        }
    }
};
__decorate([
    defaultConstructor
], JsonUnsupportedObjectError.prototype, "JsonUnsupportedObjectError", null);
JsonUnsupportedObjectError = __decorate([
    DartClass
], JsonUnsupportedObjectError);
export { JsonUnsupportedObjectError };
let JsonCyclicError = class JsonCyclicError extends JsonUnsupportedObjectError {
    constructor(object) {
        // @ts-ignore
        super();
    }
    JsonCyclicError(object) {
        super.JsonUnsupportedObjectError(object);
    }
    toString() {
        return "Cyclic error in JSON stringify";
    }
};
__decorate([
    defaultConstructor
], JsonCyclicError.prototype, "JsonCyclicError", null);
JsonCyclicError = __decorate([
    DartClass
], JsonCyclicError);
export { JsonCyclicError };
let JsonCodec = class JsonCodec extends Codec {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    JsonCodec(_namedArguments) {
        let { reviver, toEncodable } = Object.assign({}, _namedArguments);
        this._reviver = reviver;
        this._toEncodable = toEncodable;
    }
    withReviver(reviver) {
        this.JsonCodec({
            reviver: reviver
        });
    }
    decode(source, _namedArguments) {
        let { reviver } = Object.assign({}, _namedArguments);
        if (op(Op.EQUALS, reviver, null))
            reviver = this._reviver;
        if (op(Op.EQUALS, reviver, null))
            return this.decoder.convert(source);
        return new JsonDecoder(reviver).convert(source);
    }
    encode(value, _namedArguments) {
        let { toEncodable } = Object.assign({}, _namedArguments);
        if (op(Op.EQUALS, toEncodable, null))
            toEncodable = this._toEncodable;
        if (op(Op.EQUALS, toEncodable, null))
            return this.encoder.convert(value);
        return new JsonEncoder(toEncodable).convert(value);
    }
    get encoder() {
        if (op(Op.EQUALS, this._toEncodable, null))
            return new JsonEncoder();
        return new JsonEncoder(this._toEncodable);
    }
    get decoder() {
        if (op(Op.EQUALS, this._reviver, null))
            return new JsonDecoder();
        return new JsonDecoder(this._reviver);
    }
};
__decorate([
    defaultConstructor
], JsonCodec.prototype, "JsonCodec", null);
__decorate([
    namedConstructor
], JsonCodec.prototype, "withReviver", null);
JsonCodec = __decorate([
    DartClass
], JsonCodec);
export { JsonCodec };
let JsonEncoder = class JsonEncoder extends Converter {
    constructor(toEncodable) {
        // @ts-ignore
        super();
    }
    JsonEncoder(toEncodable) {
        this.indent = null;
        this._toEncodable = toEncodable;
    }
    withIndent(indent, toEncodable) {
        this._toEncodable = toEncodable;
        this.indent = indent;
    }
    convert(object) {
        return _JsonStringStringifier.stringify(object, this._toEncodable, this.indent);
    }
    startChunkedConversion(sink) {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        }
        else if (is(sink, _Utf8EncoderSink)) {
            return new _JsonUtf8EncoderSink(sink._sink, this._toEncodable, JsonUtf8Encoder._utf8Encode(this.indent), JsonUtf8Encoder.DEFAULT_BUFFER_SIZE);
        }
        return new _JsonEncoderSink(sink, this._toEncodable, this.indent);
    }
    bind(stream) {
        return super.bind(stream);
    }
    fuse(other) {
        if (is(other, Utf8Encoder)) {
            return new JsonUtf8Encoder(this.indent, this._toEncodable);
        }
        return super.fuse(other);
    }
};
__decorate([
    defaultConstructor
], JsonEncoder.prototype, "JsonEncoder", null);
__decorate([
    namedConstructor
], JsonEncoder.prototype, "withIndent", null);
JsonEncoder = __decorate([
    DartClass
], JsonEncoder);
export { JsonEncoder };
let JsonUtf8Encoder = JsonUtf8Encoder_1 = class JsonUtf8Encoder extends Converter {
    constructor(indent, toEncodable, bufferSize) {
        // @ts-ignore
        super();
    }
    JsonUtf8Encoder(indent, toEncodable, bufferSize) {
        bufferSize = bufferSize || JsonUtf8Encoder_1.DEFAULT_BUFFER_SIZE;
        this._indent = JsonUtf8Encoder_1._utf8Encode(indent);
        this._toEncodable = toEncodable;
        this._bufferSize = bufferSize;
    }
    static _utf8Encode(string) {
        if (string == null)
            return null;
        if (new core.DartString(string).isEmpty)
            return new typed_data.Uint8List(0);
        /* TODO (LabeledStatementImpl) : checkAscii: {for (int i = 0; i < string.length; i++) {if (new core.DartString(string).codeUnitAt(i) >= 0x80) break checkAscii;} return string.codeUnits;} */
        ;
        return properties.UTF8.encode(string);
    }
    convert(object) {
        let bytes = new core.DartList.literal();
        var addChunk = (chunk, start, end) => {
            if (start > 0 || end < chunk.length) {
                let length = end - start;
                chunk = new typed_data.Uint8List.view(chunk.buffer, chunk.offsetInBytes + start, length);
            }
            bytes.add(chunk);
        };
        _JsonUtf8Stringifier.stringify(object, this._indent, this._toEncodable, this._bufferSize, addChunk);
        if (bytes.length == 1)
            return bytes[0];
        let length = 0;
        for (let i = 0; i < bytes.length; i++) {
            length = bytes[i].length;
        }
        let result = new typed_data.Uint8List(length);
        for (let i = 0, offset = 0; i < bytes.length; i++) {
            let byteList = bytes[i];
            let end = offset + byteList.length;
            result.setRange(offset, end, byteList);
            offset = end;
        }
        return result;
    }
    startChunkedConversion(sink) {
        let byteSink;
        if (is(sink, ByteConversionSink)) {
            byteSink = sink;
        }
        else {
            byteSink = new ByteConversionSink.from(sink);
        }
        return new _JsonUtf8EncoderSink(byteSink, this._toEncodable, this._indent, this._bufferSize);
    }
    bind(stream) {
        return super.bind(stream);
    }
};
JsonUtf8Encoder.DEFAULT_BUFFER_SIZE = 256;
__decorate([
    defaultConstructor
], JsonUtf8Encoder.prototype, "JsonUtf8Encoder", null);
JsonUtf8Encoder = JsonUtf8Encoder_1 = __decorate([
    DartClass
], JsonUtf8Encoder);
export { JsonUtf8Encoder };
let _JsonEncoderSink = class _JsonEncoderSink extends ChunkedConversionSink {
    constructor(_sink, _toEncodable, _indent) {
        // @ts-ignore
        super();
        this._isDone = false;
    }
    _JsonEncoderSink(_sink, _toEncodable, _indent) {
        this._sink = _sink;
        this._toEncodable = _toEncodable;
        this._indent = _indent;
    }
    add(o) {
        if (this._isDone) {
            throw new core.StateError("Only one call to add allowed");
        }
        this._isDone = true;
        let stringSink = this._sink.asStringSink();
        _JsonStringStringifier.printOn(o, stringSink, this._toEncodable, this._indent);
        stringSink.close();
    }
    close() {
    }
};
__decorate([
    defaultConstructor
], _JsonEncoderSink.prototype, "_JsonEncoderSink", null);
_JsonEncoderSink = __decorate([
    DartClass
], _JsonEncoderSink);
export { _JsonEncoderSink };
let _JsonUtf8EncoderSink = class _JsonUtf8EncoderSink extends ChunkedConversionSink {
    constructor(_sink, _toEncodable, _indent, _bufferSize) {
        // @ts-ignore
        super();
        this._isDone = false;
    }
    _JsonUtf8EncoderSink(_sink, _toEncodable, _indent, _bufferSize) {
        this._sink = _sink;
        this._toEncodable = _toEncodable;
        this._indent = _indent;
        this._bufferSize = _bufferSize;
    }
    _addChunk(chunk, start, end) {
        this._sink.addSlice(chunk, start, end, false);
    }
    add(object) {
        if (this._isDone) {
            throw new core.StateError("Only one call to add allowed");
        }
        this._isDone = true;
        _JsonUtf8Stringifier.stringify(object, this._indent, this._toEncodable, this._bufferSize, this._addChunk.bind(this));
        this._sink.close();
    }
    close() {
        if (!this._isDone) {
            this._isDone = true;
            this._sink.close();
        }
    }
};
__decorate([
    defaultConstructor
], _JsonUtf8EncoderSink.prototype, "_JsonUtf8EncoderSink", null);
_JsonUtf8EncoderSink = __decorate([
    DartClass
], _JsonUtf8EncoderSink);
export { _JsonUtf8EncoderSink };
let JsonDecoder = class JsonDecoder extends Converter {
    constructor(reviver) {
        // @ts-ignore
        super();
    }
    JsonDecoder(reviver) {
        this._reviver = reviver;
    }
    convert(input) {
        return _parseJson(input, this._reviver);
    }
    startChunkedConversion(sink) {
        return new _JsonDecoderSink(this._reviver, sink);
    }
    bind(stream) {
        return super.bind(stream);
    }
};
__decorate([
    defaultConstructor
], JsonDecoder.prototype, "JsonDecoder", null);
JsonDecoder = __decorate([
    DartClass
], JsonDecoder);
export { JsonDecoder };
export var _parseJson = (source, reviver) => {
    if (isNot(source, 'string'))
        throw core.argumentErrorValue(source);
    let parsed;
    try {
        parsed = JSON.parse(source);
    }
    catch (e) {
        throw new core.FormatException(e.toString());
    }
    if (reviver == null) {
        return _convertJsonToDartLazy(parsed);
    }
    else {
        return _convertJsonToDart(parsed, reviver);
    }
};
export var _convertJsonToDart = (json, reviver) => {
    /* TODO (AssertStatementImpl) : assert (reviver != null); */
    ;
    var walk = (e) => {
        if (e == null /* JS('bool', '# == null', e) */ || typeof e != "object" /* JS('bool', 'typeof # != "object"', e) */) {
            return e;
        }
        if (Object.getPrototypeOf(e) === Array.prototype /* JS('bool', 'Object.getPrototypeOf(#) === Array.prototype', e) */) {
            for (let i = 0; i < e.length /* JS('int', '#.length', e) */; i++) {
                let item = e[i] /* JS('', '#[#]', e, i) */;
                e[i] = reviver(i, walk(item)) /* JS('', '#[#]=#', e, i, reviver(i, walk(item))) */;
            }
            return e;
        }
        let map = new _JsonMap(e);
        let processed = map._processed;
        let keys = map._computeKeys();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let revived = reviver(key, walk(e[key] /* JS('', '#[#]', e, key) */));
            processed[key] = revived /* JS('', '#[#]=#', processed, key, revived) */;
        }
        map._original = processed;
        return map;
    };
    return reviver(null, walk(json));
};
export var _convertJsonToDartLazy = (object) => {
    if (op(Op.EQUALS, object, null))
        return null;
    if (typeof object != "object" /* JS('bool', 'typeof # != "object"', object) */) {
        return object;
    }
    if (Object.getPrototypeOf(object) !== Array.prototype /* JS('bool', 'Object.getPrototypeOf(#) !== Array.prototype', object) */) {
        return new _JsonMap(object);
    }
    let res = new DartList();
    for (let i = 0; i < object.length /* JS('int', '#.length', object) */; i++) {
        let item = object[i] /* JS('', '#[#]', object, i) */;
        res.add(_convertJsonToDartLazy(item)) /* JS('', '#[#]=#', object, i, _convertJsonToDartLazy(item)) */;
    }
    return res;
};
let _JsonMap = _JsonMap_1 = class _JsonMap {
    constructor(_original) {
    }
    _JsonMap(_original) {
        this._original = _original;
        this._processed = _JsonMap_1._newJavaScriptObject();
        this._data = null;
    }
    [OperatorMethods.INDEX](key) {
        return this.get(key);
    }
    get(key) {
        if (this._isUpgraded) {
            return this._upgradedMap.get(key);
        }
        else if (isNot(key, "string")) {
            return null;
        }
        else {
            let result = _JsonMap_1._getProperty(this._processed, key);
            if (_JsonMap_1._isUnprocessed(result))
                result = this._process(key);
            return result;
        }
    }
    get length() {
        return this._isUpgraded ? this._upgradedMap.length : this._computeKeys().length;
    }
    get isEmpty() {
        return this.length == 0;
    }
    get isNotEmpty() {
        return this.length > 0;
    }
    get keys() {
        if (this._isUpgraded)
            return this._upgradedMap.keys;
        return new _JsonMapKeyIterable(this);
    }
    get values() {
        if (this._isUpgraded)
            return this._upgradedMap.values;
        return new core.DartMappedIterable(this._computeKeys(), (each) => {
            return op(Op.INDEX, this, each);
        });
    }
    [OperatorMethods.INDEX_EQ](key, value) {
        this.set(key, value);
    }
    set(key, value) {
        if (this._isUpgraded) {
            this._upgradedMap.set(key, value);
        }
        else if (this.containsKey(key)) {
            let processed = this._processed;
            _JsonMap_1._setProperty(processed, key, value);
            let original = this._original;
            if (!core.identical(original, processed)) {
                _JsonMap_1._setProperty(original, key, null);
            }
        }
        else {
            this._upgrade().set(key, value);
        }
    }
    addAll(other) {
        other.forEach((key, value) => {
            op(Op.INDEX_ASSIGN, this, key, value);
        });
    }
    containsValue(value) {
        if (this._isUpgraded)
            return this._upgradedMap.containsValue(value);
        let keys = this._computeKeys();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (op(Op.EQUALS, op(Op.INDEX, this, key), value))
                return true;
        }
        return false;
    }
    containsKey(key) {
        if (this._isUpgraded)
            return this._upgradedMap.containsKey(key);
        if (isNot(key, "string"))
            return false;
        return _JsonMap_1._hasProperty(this._original, key);
    }
    putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key))
            return op(Op.INDEX, this, key);
        let value = ifAbsent();
        op(Op.INDEX_ASSIGN, this, key, value);
        return value;
    }
    remove(key) {
        if (!this._isUpgraded && !this.containsKey(key))
            return null;
        return this._upgrade().remove(key);
    }
    clear() {
        if (this._isUpgraded) {
            this._upgradedMap.clear();
        }
        else {
            if (this._data != null) {
                this._data.clear();
            }
            this._original = this._processed = null;
            this._data = new core.DartMap.literal([]);
        }
    }
    forEach(f) {
        if (this._isUpgraded)
            return this._upgradedMap.forEach(f);
        let keys = this._computeKeys();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = _JsonMap_1._getProperty(this._processed, key);
            if (_JsonMap_1._isUnprocessed(value)) {
                value = _convertJsonToDartLazy(_JsonMap_1._getProperty(this._original, key));
                _JsonMap_1._setProperty(this._processed, key, value);
            }
            f(key, value);
            if (!core.identical(keys, this._data)) {
                throw new core.ConcurrentModificationError(this);
            }
        }
    }
    toString() {
        return core.DartMaps.mapToString(this);
    }
    get _isUpgraded() {
        return op(Op.EQUALS, this._processed, null);
    }
    get _upgradedMap() {
        /* TODO (AssertStatementImpl) : assert (_isUpgraded); */
        ;
        return this._data /* JS('LinkedHashMap', '#', _data) */;
    }
    _computeKeys() {
        /* TODO (AssertStatementImpl) : assert (!_isUpgraded); */
        ;
        let keys = this._data;
        if (keys == null) {
            keys = this._data = _JsonMap_1._getPropertyNames(this._original);
        }
        return keys /* JS('JSExtendableArray', '#', keys) */;
    }
    _upgrade() {
        if (this._isUpgraded)
            return this._upgradedMap;
        let result = new core.DartMap.literal([]);
        let keys = this._computeKeys();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            result.set(key, op(Op.INDEX, this, key));
        }
        if (keys.isEmpty) {
            keys.add(null);
        }
        else {
            keys.clear();
        }
        this._original = this._processed = null;
        this._data = result;
        /* TODO (AssertStatementImpl) : assert (_isUpgraded); */
        ;
        return result;
    }
    _process(key) {
        if (!_JsonMap_1._hasProperty(this._original, key))
            return null;
        let result = _convertJsonToDartLazy(_JsonMap_1._getProperty(this._original, key));
        return _JsonMap_1._setProperty(this._processed, key, result);
    }
    static _hasProperty(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key) /* JS('bool', 'Object.prototype.hasOwnProperty.call(#,#)', object, key) */;
    }
    static _getProperty(object, key) {
        return object[key] /* JS('', '#[#]', object, key) */;
    }
    static _setProperty(object, key, value) {
        return object[key] = value /* JS('', '#[#]=#', object, key, value) */;
    }
    static _getPropertyNames(object) {
        return Object.keys(object) /* JS('JSExtendableArray', 'Object.keys(#)', object) */;
    }
    static _isUnprocessed(object) {
        return typeof (object) == "undefined" /* JS('bool', 'typeof(#)=="undefined"', object) */;
    }
    static _newJavaScriptObject() {
        return Object.create(null) /* JS('=Object', 'Object.create(null)') */;
    }
};
__decorate([
    defaultConstructor
], _JsonMap.prototype, "_JsonMap", null);
_JsonMap = _JsonMap_1 = __decorate([
    DartClass,
    Implements(core.DartMap)
], _JsonMap);
export { _JsonMap };
let _JsonMapKeyIterable = class _JsonMapKeyIterable extends core.DartListIterable {
    constructor(_parent) {
        super();
    }
    _JsonMapKeyIterable(_parent) {
        this._parent = _parent;
    }
    get length() {
        return this._parent.length;
    }
    elementAt(index) {
        return this._parent._isUpgraded ? this._parent.keys.elementAt(index) : this._parent._computeKeys()[index];
    }
    get iterator() {
        return this._parent._isUpgraded ? this._parent.keys.iterator : this._parent._computeKeys().iterator;
    }
    contains(key) {
        return this._parent.containsKey(key);
    }
};
__decorate([
    defaultConstructor
], _JsonMapKeyIterable.prototype, "_JsonMapKeyIterable", null);
_JsonMapKeyIterable = __decorate([
    DartClass
], _JsonMapKeyIterable);
export { _JsonMapKeyIterable };
export var _defaultToEncodable = (object) => {
    return object.toJson();
};
let _JsonStringifier = _JsonStringifier_1 = class _JsonStringifier {
    constructor(toEncodable) {
        this._seen = new core.DartList();
    }
    _JsonStringifier(toEncodable) {
        this._seen = new core.DartList();
        this._toEncodable = toEncodable || _defaultToEncodable;
    }
    writeString(characters) {
        throw 'abstract';
    }
    writeStringSlice(characters, start, end) {
        throw 'abstract';
    }
    writeCharCode(charCode) {
        throw 'abstract';
    }
    writeNumber(number) {
        throw 'abstract';
    }
    static hexDigit(x) {
        return x < 10 ? 48 + x : 87 + x;
    }
    writeStringContent(s) {
        let offset = 0;
        let length = s.length;
        for (let i = 0; i < length; i++) {
            let charCode = new core.DartString(s).codeUnitAt(i);
            if (charCode > _JsonStringifier_1.BACKSLASH)
                continue;
            if (charCode < 32) {
                if (i > offset)
                    this.writeStringSlice(s, offset, i);
                offset = i + 1;
                this.writeCharCode(_JsonStringifier_1.BACKSLASH);
                switch (charCode) {
                    case _JsonStringifier_1.BACKSPACE:
                        this.writeCharCode(_JsonStringifier_1.CHAR_b);
                        break;
                    case _JsonStringifier_1.TAB:
                        this.writeCharCode(_JsonStringifier_1.CHAR_t);
                        break;
                    case _JsonStringifier_1.NEWLINE:
                        this.writeCharCode(_JsonStringifier_1.CHAR_n);
                        break;
                    case _JsonStringifier_1.FORM_FEED:
                        this.writeCharCode(_JsonStringifier_1.CHAR_f);
                        break;
                    case _JsonStringifier_1.CARRIAGE_RETURN:
                        this.writeCharCode(_JsonStringifier_1.CHAR_r);
                        break;
                    default:
                        this.writeCharCode(_JsonStringifier_1.CHAR_u);
                        this.writeCharCode(_JsonStringifier_1.CHAR_0);
                        this.writeCharCode(_JsonStringifier_1.CHAR_0);
                        this.writeCharCode(_JsonStringifier_1.hexDigit((charCode >> 4) & 15));
                        this.writeCharCode(_JsonStringifier_1.hexDigit(charCode & 15));
                        break;
                }
            }
            else if (charCode == _JsonStringifier_1.QUOTE || charCode == _JsonStringifier_1.BACKSLASH) {
                if (i > offset)
                    this.writeStringSlice(s, offset, i);
                offset = i + 1;
                this.writeCharCode(_JsonStringifier_1.BACKSLASH);
                this.writeCharCode(charCode);
            }
        }
        if (offset == 0) {
            this.writeString(s);
        }
        else if (offset < length) {
            this.writeStringSlice(s, offset, length);
        }
    }
    _checkCycle(object) {
        for (let i = 0; i < this._seen.length; i++) {
            if (core.identical(object, this._seen[i])) {
                throw new JsonCyclicError(object);
            }
        }
        this._seen.add(object);
    }
    _removeSeen(object) {
        /* TODO (AssertStatementImpl) : assert (!_new core.DartString(seen).isEmpty); */
        ;
        /* TODO (AssertStatementImpl) : assert (identical(_seen.last, object)); */
        ;
        this._seen.removeLast();
    }
    writeObject(object) {
        if (this.writeJsonValue(object))
            return;
        this._checkCycle(object);
        try {
            let customJson = this._toEncodable(object);
            if (!this.writeJsonValue(customJson)) {
                throw new JsonUnsupportedObjectError(object);
            }
            this._removeSeen(object);
        }
        catch (e) {
            throw new JsonUnsupportedObjectError(object, {
                cause: e
            });
        }
    }
    writeJsonValue(object) {
        if (is(object, "number")) {
            if (!new core.DartNumber(object).isFinite)
                return false;
            this.writeNumber(object);
            return true;
        }
        else if (core.identical(object, true)) {
            this.writeString('true');
            return true;
        }
        else if (core.identical(object, false)) {
            this.writeString('false');
            return true;
        }
        else if (op(Op.EQUALS, object, null)) {
            this.writeString('null');
            return true;
        }
        else if (is(object, "string")) {
            this.writeString('"');
            this.writeStringContent(object);
            this.writeString('"');
            return true;
        }
        else if (is(object, core.DartList)) {
            this._checkCycle(object);
            this.writeList(object);
            this._removeSeen(object);
            return true;
        }
        else if (is(object, core.DartMap)) {
            this._checkCycle(object);
            let success = this.writeMap(object);
            this._removeSeen(object);
            return success;
        }
        else {
            return false;
        }
    }
    writeList(list) {
        this.writeString('[');
        if (list.length > 0) {
            this.writeObject(list[0]);
            for (let i = 1; i < list.length; i++) {
                this.writeString(',');
                this.writeObject(list[i]);
            }
        }
        this.writeString(']');
    }
    writeMap(map) {
        if (map.isEmpty) {
            this.writeString("{}");
            return true;
        }
        let keyValueList = new core.DartList(map.length * 2);
        let i = 0;
        let allStringKeys = true;
        map.forEach((key, value) => {
            if (isNot(key, "string")) {
                allStringKeys = false;
            }
            keyValueList[i++] = key;
            keyValueList[i++] = value;
        });
        if (!allStringKeys)
            return false;
        this.writeString('{');
        let separator = '"';
        for (let i = 0; i < keyValueList.length; i = 2) {
            this.writeString(separator);
            separator = ',"';
            this.writeStringContent(keyValueList[i]);
            this.writeString('":');
            this.writeObject(keyValueList[i + 1]);
        }
        this.writeString('}');
        return true;
    }
};
_JsonStringifier.BACKSPACE = 8;
_JsonStringifier.TAB = 9;
_JsonStringifier.NEWLINE = 10;
_JsonStringifier.CARRIAGE_RETURN = 13;
_JsonStringifier.FORM_FEED = 12;
_JsonStringifier.QUOTE = 34;
_JsonStringifier.CHAR_0 = 48;
_JsonStringifier.BACKSLASH = 92;
_JsonStringifier.CHAR_b = 98;
_JsonStringifier.CHAR_f = 102;
_JsonStringifier.CHAR_n = 110;
_JsonStringifier.CHAR_r = 114;
_JsonStringifier.CHAR_t = 116;
_JsonStringifier.CHAR_u = 117;
__decorate([
    defaultConstructor
], _JsonStringifier.prototype, "_JsonStringifier", null);
__decorate([
    Abstract
], _JsonStringifier.prototype, "writeString", null);
__decorate([
    Abstract
], _JsonStringifier.prototype, "writeStringSlice", null);
__decorate([
    Abstract
], _JsonStringifier.prototype, "writeCharCode", null);
__decorate([
    Abstract
], _JsonStringifier.prototype, "writeNumber", null);
_JsonStringifier = _JsonStringifier_1 = __decorate([
    DartClass
], _JsonStringifier);
export { _JsonStringifier };
let _JsonPrettyPrintMixin = class _JsonPrettyPrintMixin extends _JsonStringifier {
    constructor() {
        super(...arguments);
        this._indentLevel = 0;
    }
    writeIndentation(indentLevel) {
        throw 'abstract';
    }
    writeList(list) {
        if (list.isEmpty) {
            this.writeString('[]');
        }
        else {
            this.writeString('[\n');
            this._indentLevel++;
            this.writeIndentation(this._indentLevel);
            this.writeObject(list[0]);
            for (let i = 1; i < list.length; i++) {
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
    writeMap(map) {
        if (map.isEmpty) {
            this.writeString("{}");
            return true;
        }
        let keyValueList = new core.DartList(map.length * 2);
        let i = 0;
        let allStringKeys = true;
        map.forEach((key, value) => {
            if (isNot(key, "string")) {
                allStringKeys = false;
            }
            keyValueList[i++] = key;
            keyValueList[i++] = value;
        });
        if (!allStringKeys)
            return false;
        this.writeString('{\n');
        this._indentLevel++;
        let separator = "";
        for (let i = 0; i < keyValueList.length; i = 2) {
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
};
__decorate([
    Abstract
], _JsonPrettyPrintMixin.prototype, "writeIndentation", null);
_JsonPrettyPrintMixin = __decorate([
    DartClass,
    Implements(_JsonStringifier)
], _JsonPrettyPrintMixin);
export { _JsonPrettyPrintMixin };
let _JsonStringStringifier = _JsonStringStringifier_1 = class _JsonStringStringifier extends _JsonStringifier {
    constructor(_sink, _toEncodable) {
        // @ts-ignore
        super();
    }
    _JsonStringStringifier(_sink, _toEncodable) {
        super._JsonStringifier(_toEncodable);
        this._sink = _sink;
    }
    static stringify(object, toEncodable, indent) {
        let output = new core.DartStringBuffer();
        _JsonStringStringifier_1.printOn(object, output, toEncodable, indent);
        return output.toString();
    }
    static printOn(object, output, toEncodable, indent) {
        let stringifier;
        if (indent == null) {
            stringifier = new _JsonStringStringifier_1(output, toEncodable);
        }
        else {
            stringifier = new _JsonStringStringifierPretty(output, toEncodable, indent);
        }
        stringifier.writeObject(object);
    }
    writeNumber(number) {
        this._sink.write(new core.DartNumber(number).toString());
    }
    writeString(string) {
        this._sink.write(string);
    }
    writeStringSlice(string, start, end) {
        this._sink.write(string.substring(start, end));
    }
    writeCharCode(charCode) {
        this._sink.writeCharCode(charCode);
    }
};
__decorate([
    defaultConstructor
], _JsonStringStringifier.prototype, "_JsonStringStringifier", null);
_JsonStringStringifier = _JsonStringStringifier_1 = __decorate([
    DartClass
], _JsonStringStringifier);
export { _JsonStringStringifier };
let _JsonStringStringifierPretty = class _JsonStringStringifierPretty extends _JsonStringStringifier {
    constructor(sink, toEncodable, _indent) {
        // @ts-ignore
        super();
    }
    _JsonStringStringifierPretty(sink, toEncodable, _indent) {
        super._JsonStringStringifier(sink, toEncodable);
        this._indent = _indent;
    }
    writeIndentation(count) {
        for (let i = 0; i < count; i++)
            this.writeString(this._indent);
    }
};
__decorate([
    defaultConstructor
], _JsonStringStringifierPretty.prototype, "_JsonStringStringifierPretty", null);
_JsonStringStringifierPretty = __decorate([
    DartClass
], _JsonStringStringifierPretty);
export { _JsonStringStringifierPretty };
let _JsonUtf8Stringifier = _JsonUtf8Stringifier_1 = class _JsonUtf8Stringifier extends _JsonStringifier {
    constructor(toEncodable, bufferSize, addChunk) {
        // @ts-ignore
        super();
        this.index = 0;
    }
    _JsonUtf8Stringifier(toEncodable, bufferSize, addChunk) {
        this.bufferSize = bufferSize;
        this.buffer = new typed_data.Uint8List(bufferSize);
        super._JsonStringifier(toEncodable);
        this.addChunk = addChunk;
    }
    static stringify(object, indent, toEncodable, bufferSize, addChunk) {
        let stringifier;
        if (indent != null) {
            stringifier = new _JsonUtf8StringifierPretty(toEncodable, indent, bufferSize, addChunk);
        }
        else {
            stringifier = new _JsonUtf8Stringifier_1(toEncodable, bufferSize, addChunk);
        }
        stringifier.writeObject(object);
        stringifier.flush();
    }
    flush() {
        if (this.index > 0) {
            this.addChunk(this.buffer, 0, this.index);
        }
        this.buffer = null;
        this.index = 0;
    }
    writeNumber(number) {
        this.writeAsciiString(number.toString());
    }
    writeAsciiString(string) {
        for (let i = 0; i < string.length; i++) {
            let char = new core.DartString(string).codeUnitAt(i);
            /* TODO (AssertStatementImpl) : assert (char <= 0x7f); */
            ;
            this.writeByte(char);
        }
    }
    writeString(string) {
        this.writeStringSlice(string, 0, string.length);
    }
    writeStringSlice(string, start, end) {
        for (let i = start; i < end; i++) {
            let char = new core.DartString(string).codeUnitAt(i);
            if (char <= 127) {
                this.writeByte(char);
            }
            else {
                if ((char & 64512) == 55296 && i + 1 < end) {
                    let nextChar = new core.DartString(string).codeUnitAt(i + 1);
                    if ((nextChar & 64512) == 56320) {
                        char = 65536 + ((char & 1023) << 10) + (nextChar & 1023);
                        this.writeFourByteCharCode(char);
                        i++;
                        continue;
                    }
                }
                this.writeMultiByteCharCode(char);
            }
        }
    }
    writeCharCode(charCode) {
        if (charCode <= 127) {
            this.writeByte(charCode);
            return;
        }
        this.writeMultiByteCharCode(charCode);
    }
    writeMultiByteCharCode(charCode) {
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
    writeFourByteCharCode(charCode) {
        /* TODO (AssertStatementImpl) : assert (charCode <= 0x10ffff); */
        ;
        this.writeByte(240 | (charCode >> 18));
        this.writeByte(128 | ((charCode >> 12) & 63));
        this.writeByte(128 | ((charCode >> 6) & 63));
        this.writeByte(128 | (charCode & 63));
    }
    writeByte(byte) {
        /* TODO (AssertStatementImpl) : assert (byte <= 0xff); */
        ;
        if (this.index == this.buffer.length) {
            this.addChunk(this.buffer, 0, this.index);
            this.buffer = new typed_data.Uint8List(this.bufferSize);
            this.index = 0;
        }
        op(Op.INDEX_ASSIGN, this.buffer, this.index++, byte);
    }
};
__decorate([
    defaultConstructor
], _JsonUtf8Stringifier.prototype, "_JsonUtf8Stringifier", null);
_JsonUtf8Stringifier = _JsonUtf8Stringifier_1 = __decorate([
    DartClass
], _JsonUtf8Stringifier);
export { _JsonUtf8Stringifier };
let _JsonUtf8StringifierPretty = class _JsonUtf8StringifierPretty extends _JsonUtf8Stringifier {
    constructor(toEncodable, indent, bufferSize, addChunk) {
        // @ts-ignore
        super();
    }
    _JsonUtf8StringifierPretty(toEncodable, indent, bufferSize, addChunk) {
        super._JsonUtf8Stringifier(toEncodable, bufferSize, addChunk);
        this.indent = indent;
    }
    writeIndentation(count) {
        let indent = this.indent;
        let indentLength = indent.length;
        if (indentLength == 1) {
            let char = indent[0];
            while (count > 0) {
                this.writeByte(char);
                count = 1;
            }
            return;
        }
        while (count > 0) {
            count--;
            let end = this.index + indentLength;
            if (end <= this.buffer.length) {
                this.buffer.setRange(this.index, end, indent);
                this.index = end;
            }
            else {
                for (let i = 0; i < indentLength; i++) {
                    this.writeByte(indent[i]);
                }
            }
        }
    }
};
__decorate([
    defaultConstructor
], _JsonUtf8StringifierPretty.prototype, "_JsonUtf8StringifierPretty", null);
_JsonUtf8StringifierPretty = __decorate([
    DartClass
], _JsonUtf8StringifierPretty);
export { _JsonUtf8StringifierPretty };
let Latin1Codec = class Latin1Codec extends Encoding {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    Latin1Codec(_namedArguments) {
        let { allowInvalid } = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        this._allowInvalid = allowInvalid;
    }
    get name() {
        return "iso-8859-1";
    }
    decode(bytes, _namedArguments) {
        let { allowInvalid } = Object.assign({}, _namedArguments);
        if (allowInvalid == null)
            allowInvalid = this._allowInvalid;
        if (allowInvalid) {
            return new Latin1Decoder({
                allowInvalid: true
            }).convert(bytes);
        }
        else {
            return new Latin1Decoder({
                allowInvalid: false
            }).convert(bytes);
        }
    }
    get encoder() {
        return new Latin1Encoder();
    }
    get decoder() {
        return this._allowInvalid ? new Latin1Decoder({
            allowInvalid: true
        }) : new Latin1Decoder({
            allowInvalid: false
        });
    }
};
__decorate([
    defaultConstructor
], Latin1Codec.prototype, "Latin1Codec", null);
Latin1Codec = __decorate([
    DartClass
], Latin1Codec);
export { Latin1Codec };
let Latin1Encoder = class Latin1Encoder extends _UnicodeSubsetEncoder {
    constructor() {
        // @ts-ignore
        super();
    }
    Latin1Encoder() {
        super._UnicodeSubsetEncoder(properties._LATIN1_MASK);
    }
};
__decorate([
    defaultConstructor
], Latin1Encoder.prototype, "Latin1Encoder", null);
Latin1Encoder = __decorate([
    DartClass
], Latin1Encoder);
export { Latin1Encoder };
let Latin1Decoder = class Latin1Decoder extends _UnicodeSubsetDecoder {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    Latin1Decoder(_namedArguments) {
        let { allowInvalid } = Object.assign({
            "allowInvalid": false
        }, _namedArguments);
        super._UnicodeSubsetDecoder(allowInvalid, properties._LATIN1_MASK);
    }
    startChunkedConversion(sink) {
        let stringSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        }
        else {
            stringSink = new StringConversionSink.from(sink);
        }
        if (!this._allowInvalid)
            return new _Latin1DecoderSink(stringSink);
        return new _Latin1AllowInvalidDecoderSink(stringSink);
    }
};
__decorate([
    defaultConstructor
], Latin1Decoder.prototype, "Latin1Decoder", null);
Latin1Decoder = __decorate([
    DartClass
], Latin1Decoder);
export { Latin1Decoder };
let _Latin1DecoderSink = _Latin1DecoderSink_1 = class _Latin1DecoderSink extends ByteConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
    }
    _Latin1DecoderSink(_sink) {
        this._sink = _sink;
    }
    close() {
        this._sink.close();
        this._sink = null;
    }
    add(source) {
        this.addSlice(source, 0, source.length, false);
    }
    _addSliceToSink(source, start, end, isLast) {
        this._sink.add(new core.DartString.fromCharCodes(source, start, end).valueOf());
        if (isLast)
            this.close();
    }
    addSlice(source, start, end, isLast) {
        end = core.RangeError.checkValidRange(start, end, source.length);
        if (start == end)
            return;
        if (isNot(source, typed_data.Uint8List)) {
            _Latin1DecoderSink_1._checkValidLatin1(source, start, end);
        }
        this._addSliceToSink(source, start, end, isLast);
    }
    static _checkValidLatin1(source, start, end) {
        let mask = 0;
        for (let i = start; i < end; i++) {
            mask = source[i];
        }
        if (mask >= 0 && mask <= properties._LATIN1_MASK) {
            return;
        }
        _Latin1DecoderSink_1._reportInvalidLatin1(source, start, end);
    }
    static _reportInvalidLatin1(source, start, end) {
        for (let i = start; i < end; i++) {
            let char = source[i];
            if (char < 0 || char > properties._LATIN1_MASK) {
                throw new core.FormatException("Source contains non-Latin-1 characters.", source, i);
            }
        }
        /* TODO (AssertStatementImpl) : assert (false); */
        ;
    }
};
__decorate([
    defaultConstructor
], _Latin1DecoderSink.prototype, "_Latin1DecoderSink", null);
_Latin1DecoderSink = _Latin1DecoderSink_1 = __decorate([
    DartClass
], _Latin1DecoderSink);
export { _Latin1DecoderSink };
let _Latin1AllowInvalidDecoderSink = class _Latin1AllowInvalidDecoderSink extends _Latin1DecoderSink {
    constructor(sink) {
        // @ts-ignore
        super();
    }
    _Latin1AllowInvalidDecoderSink(sink) {
        super._Latin1DecoderSink(sink);
    }
    addSlice(source, start, end, isLast) {
        core.RangeError.checkValidRange(start, end, source.length);
        for (let i = start; i < end; i++) {
            let char = source[i];
            if (char > properties._LATIN1_MASK || char < 0) {
                if (i > start)
                    this._addSliceToSink(source, start, i, false);
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
};
__decorate([
    defaultConstructor
], _Latin1AllowInvalidDecoderSink.prototype, "_Latin1AllowInvalidDecoderSink", null);
_Latin1AllowInvalidDecoderSink = __decorate([
    DartClass
], _Latin1AllowInvalidDecoderSink);
export { _Latin1AllowInvalidDecoderSink };
let LineSplitter = class LineSplitter extends Converter {
    constructor() {
        // @ts-ignore
        super();
    }
    LineSplitter() {
    }
    static split(lines, start, end) {
        return core.iter(() => (function* () {
            start = start || 0;
            end = core.RangeError.checkValidRange(start, end, lines.length);
            let sliceStart = start;
            let char = 0;
            for (let i = start; i < end; i++) {
                let previousChar = char;
                char = new core.DartString(lines).codeUnitAt(i);
                if (char != properties._CR) {
                    if (char != properties._LF)
                        continue;
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
    convert(data) {
        let lines = new core.DartList.literal();
        let end = data.length;
        let sliceStart = 0;
        let char = 0;
        for (let i = 0; i < end; i++) {
            let previousChar = char;
            char = new core.DartString(data).codeUnitAt(i);
            if (char != properties._CR) {
                if (char != properties._LF)
                    continue;
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
    startChunkedConversion(sink) {
        if (isNot(sink, StringConversionSink)) {
            sink = new StringConversionSink.from(sink);
        }
        return new _LineSplitterSink(sink);
    }
    bind(stream) {
        return new async.DartStream.eventTransformed(stream, (sink) => {
            return new _LineSplitterEventSink(sink);
        });
    }
};
__decorate([
    defaultConstructor
], LineSplitter.prototype, "LineSplitter", null);
LineSplitter = __decorate([
    DartClass,
    Implements(core.DartObject)
], LineSplitter);
export { LineSplitter };
let _LineSplitterSink = class _LineSplitterSink extends StringConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
        this._skipLeadingLF = false;
    }
    _LineSplitterSink(_sink) {
        this._sink = _sink;
    }
    addSlice(chunk, start, end, isLast) {
        end = core.RangeError.checkValidRange(start, end, chunk.length);
        if (start >= end) {
            if (isLast)
                this.close();
            return;
        }
        if (this._carry != null) {
            /* TODO (AssertStatementImpl) : assert (!_skipLeadingLF); */
            ;
            chunk = this._carry + chunk.substring(start, end);
            start = 0;
            end = chunk.length;
            this._carry = null;
        }
        else if (this._skipLeadingLF) {
            if (new core.DartString(chunk).codeUnitAt(start) == properties._LF) {
                start = 1;
            }
            this._skipLeadingLF = false;
        }
        this._addLines(chunk, start, end);
        if (isLast)
            this.close();
    }
    close() {
        if (this._carry != null) {
            this._sink.add(this._carry);
            this._carry = null;
        }
        this._sink.close();
    }
    _addLines(lines, start, end) {
        let sliceStart = start;
        let char = 0;
        for (let i = start; i < end; i++) {
            let previousChar = char;
            char = new core.DartString(lines).codeUnitAt(i);
            if (char != properties._CR) {
                if (char != properties._LF)
                    continue;
                if (previousChar == properties._CR) {
                    sliceStart = i + 1;
                    continue;
                }
            }
            this._sink.add(lines.substring(sliceStart, i));
            sliceStart = i + 1;
        }
        if (sliceStart < end) {
            this._carry = lines.substring(sliceStart, end);
        }
        else {
            this._skipLeadingLF = (char == properties._CR);
        }
    }
};
__decorate([
    defaultConstructor
], _LineSplitterSink.prototype, "_LineSplitterSink", null);
_LineSplitterSink = __decorate([
    DartClass
], _LineSplitterSink);
export { _LineSplitterSink };
let _LineSplitterEventSink = class _LineSplitterEventSink extends _LineSplitterSink {
    constructor(eventSink) {
        // @ts-ignore
        super();
    }
    _LineSplitterEventSink(eventSink) {
        this._eventSink = eventSink;
        super._LineSplitterSink(new StringConversionSink.from(eventSink));
    }
    addError(o, stackTrace) {
        this._eventSink.addError(o, stackTrace);
    }
};
__decorate([
    defaultConstructor
], _LineSplitterEventSink.prototype, "_LineSplitterEventSink", null);
_LineSplitterEventSink = __decorate([
    DartClass,
    Implements(async.DartEventSink)
], _LineSplitterEventSink);
export { _LineSplitterEventSink };
let ClosableStringSink = class ClosableStringSink extends core.DartStringSink {
    static _fromStringSink(sink, onClose) {
        return new _ClosableStringSink(sink, onClose);
    }
    close() {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], ClosableStringSink.prototype, "close", null);
__decorate([
    namedFactory
], ClosableStringSink, "_fromStringSink", null);
ClosableStringSink = __decorate([
    DartClass
], ClosableStringSink);
export { ClosableStringSink };
let _ClosableStringSink = class _ClosableStringSink {
    constructor(_sink, _callback) {
    }
    _ClosableStringSink(_sink, _callback) {
        this._sink = _sink;
        this._callback = _callback;
    }
    close() {
        this._callback();
    }
    writeCharCode(charCode) {
        this._sink.writeCharCode(charCode);
    }
    write(o) {
        this._sink.write(o);
    }
    writeln(o) {
        o = o || "";
        this._sink.writeln(o);
    }
    writeAll(objects, separator) {
        separator = separator || "";
        this._sink.writeAll(objects, separator);
    }
};
__decorate([
    defaultConstructor
], _ClosableStringSink.prototype, "_ClosableStringSink", null);
_ClosableStringSink = __decorate([
    DartClass,
    Implements(ClosableStringSink)
], _ClosableStringSink);
export { _ClosableStringSink };
let _StringConversionSinkAsStringSinkAdapter = _StringConversionSinkAsStringSinkAdapter_1 = class _StringConversionSinkAsStringSinkAdapter {
    constructor(_chunkedSink) {
    }
    _StringConversionSinkAsStringSinkAdapter(_chunkedSink) {
        this._buffer = new core.DartStringBuffer();
        this._chunkedSink = _chunkedSink;
    }
    close() {
        if (this._buffer.isNotEmpty)
            this._flush();
        this._chunkedSink.close();
    }
    writeCharCode(charCode) {
        this._buffer.writeCharCode(charCode);
        if (this._buffer.length > _StringConversionSinkAsStringSinkAdapter_1._MIN_STRING_SIZE)
            this._flush();
    }
    write(o) {
        if (this._buffer.isNotEmpty)
            this._flush();
        this._chunkedSink.add(o.toString());
    }
    writeln(o) {
        o = o || "";
        this._buffer.writeln(o);
        if (this._buffer.length > _StringConversionSinkAsStringSinkAdapter_1._MIN_STRING_SIZE)
            this._flush();
    }
    writeAll(objects, separator) {
        separator = separator || "";
        if (this._buffer.isNotEmpty)
            this._flush();
        let iterator = objects.iterator;
        if (!iterator.moveNext())
            return;
        if (new core.DartString(separator).isEmpty) {
            do {
                this._chunkedSink.add(iterator.current.toString());
            } while (iterator.moveNext());
        }
        else {
            this._chunkedSink.add(iterator.current.toString());
            while (iterator.moveNext()) {
                this.write(separator);
                this._chunkedSink.add(iterator.current.toString());
            }
        }
    }
    _flush() {
        let accumulated = this._buffer.toString();
        this._buffer.clear();
        this._chunkedSink.add(accumulated);
    }
};
_StringConversionSinkAsStringSinkAdapter._MIN_STRING_SIZE = 16;
__decorate([
    defaultConstructor
], _StringConversionSinkAsStringSinkAdapter.prototype, "_StringConversionSinkAsStringSinkAdapter", null);
_StringConversionSinkAsStringSinkAdapter = _StringConversionSinkAsStringSinkAdapter_1 = __decorate([
    DartClass,
    Implements(ClosableStringSink)
], _StringConversionSinkAsStringSinkAdapter);
export { _StringConversionSinkAsStringSinkAdapter };
let _StringSinkConversionSink = class _StringSinkConversionSink extends StringConversionSinkBase {
    constructor(_stringSink) {
        // @ts-ignore
        super();
    }
    _StringSinkConversionSink(_stringSink) {
        this._stringSink = _stringSink;
    }
    close() {
    }
    addSlice(str, start, end, isLast) {
        if (start != 0 || end != str.length) {
            for (let i = start; i < end; i++) {
                this._stringSink.writeCharCode(new core.DartString(str).codeUnitAt(i));
            }
        }
        else {
            this._stringSink.write(str);
        }
        if (isLast)
            this.close();
    }
    add(str) {
        this._stringSink.write(str);
    }
    asUtf8Sink(allowMalformed) {
        return new _Utf8StringSinkAdapter(this, this._stringSink, allowMalformed);
    }
    asStringSink() {
        return new ClosableStringSink.fromStringSink(this._stringSink, this.close.bind(this));
    }
};
__decorate([
    defaultConstructor
], _StringSinkConversionSink.prototype, "_StringSinkConversionSink", null);
_StringSinkConversionSink = __decorate([
    DartClass
], _StringSinkConversionSink);
export { _StringSinkConversionSink };
/**
 * Implements the chunked conversion from a JSON string to its corresponding
 * object.
 *
 * The sink only creates one object, but its input can be chunked.
 */
// TODO(floitsch): don't accumulate everything before starting to decode.
class _JsonDecoderSink extends _StringSinkConversionSink {
    constructor(_reviver, _sink) {
        super(new core.DartStringBuffer(''));
        this._reviver = this._reviver;
        this._sink = _sink;
    }
    close() {
        super.close();
        let buffer = this._stringSink;
        let accumulated = buffer.toString();
        buffer.clear();
        let decoded = _parseJson(accumulated, this._reviver);
        this._sink.add(decoded);
        this._sink.close();
    }
}
let _StringCallbackSink = class _StringCallbackSink extends _StringSinkConversionSink {
    constructor(_callback) {
        // @ts-ignore
        super();
    }
    _StringCallbackSink(_callback) {
        super._StringSinkConversionSink(new core.DartStringBuffer());
        this._callback = _callback;
    }
    close() {
        let buffer = this._stringSink;
        let accumulated = buffer.toString();
        buffer.clear();
        this._callback(accumulated);
    }
    asUtf8Sink(allowMalformed) {
        return new _Utf8StringSinkAdapter(this, this._stringSink, allowMalformed);
    }
};
__decorate([
    defaultConstructor
], _StringCallbackSink.prototype, "_StringCallbackSink", null);
_StringCallbackSink = __decorate([
    DartClass
], _StringCallbackSink);
export { _StringCallbackSink };
let _StringAdapterSink = class _StringAdapterSink extends StringConversionSinkBase {
    constructor(_sink) {
        // @ts-ignore
        super();
    }
    _StringAdapterSink(_sink) {
        this._sink = _sink;
    }
    add(str) {
        this._sink.add(str);
    }
    addSlice(str, start, end, isLast) {
        if (start == 0 && end == str.length) {
            this.add(str);
        }
        else {
            this.add(str.substring(start, end));
        }
        if (isLast)
            this.close();
    }
    close() {
        this._sink.close();
    }
};
__decorate([
    defaultConstructor
], _StringAdapterSink.prototype, "_StringAdapterSink", null);
_StringAdapterSink = __decorate([
    DartClass
], _StringAdapterSink);
export { _StringAdapterSink };
let _Utf8StringSinkAdapter = class _Utf8StringSinkAdapter extends ByteConversionSink {
    constructor(_sink, stringSink, allowMalformed) {
        // @ts-ignore
        super();
    }
    _Utf8StringSinkAdapter(_sink, stringSink, allowMalformed) {
        this._decoder = new _Utf8Decoder(stringSink, allowMalformed);
        this._sink = _sink;
    }
    close() {
        this._decoder.close();
        if (this._sink != null)
            this._sink.close();
    }
    add(chunk) {
        this.addSlice(chunk, 0, chunk.length, false);
    }
    addSlice(codeUnits, startIndex, endIndex, isLast) {
        this._decoder.convert(codeUnits, startIndex, endIndex);
        if (isLast)
            this.close();
    }
};
__decorate([
    defaultConstructor
], _Utf8StringSinkAdapter.prototype, "_Utf8StringSinkAdapter", null);
_Utf8StringSinkAdapter = __decorate([
    DartClass
], _Utf8StringSinkAdapter);
export { _Utf8StringSinkAdapter };
let _Utf8ConversionSink = class _Utf8ConversionSink extends ByteConversionSink {
    constructor(sink, allowMalformed) {
        // @ts-ignore
        super();
    }
    _Utf8ConversionSink(sink, allowMalformed) {
        this._(sink, new core.DartStringBuffer(), allowMalformed);
    }
    _(_chunkedSink, stringBuffer, allowMalformed) {
        this._decoder = new _Utf8Decoder(stringBuffer, allowMalformed);
        this._buffer = stringBuffer;
        this._chunkedSink = _chunkedSink;
    }
    close() {
        this._decoder.close();
        if (this._buffer.isNotEmpty) {
            let accumulated = this._buffer.toString();
            this._buffer.clear();
            this._chunkedSink.addSlice(accumulated, 0, accumulated.length, true);
        }
        else {
            this._chunkedSink.close();
        }
    }
    add(chunk) {
        this.addSlice(chunk, 0, chunk.length, false);
    }
    addSlice(chunk, startIndex, endIndex, isLast) {
        this._decoder.convert(chunk, startIndex, endIndex);
        if (this._buffer.isNotEmpty) {
            let accumulated = this._buffer.toString();
            this._chunkedSink.addSlice(accumulated, 0, accumulated.length, isLast);
            this._buffer.clear();
            return;
        }
        if (isLast)
            this.close();
    }
};
__decorate([
    defaultConstructor
], _Utf8ConversionSink.prototype, "_Utf8ConversionSink", null);
__decorate([
    namedConstructor
], _Utf8ConversionSink.prototype, "_", null);
_Utf8ConversionSink = __decorate([
    DartClass
], _Utf8ConversionSink);
export { _Utf8ConversionSink };
let Utf8Codec = class Utf8Codec extends Encoding {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    Utf8Codec(_namedArguments) {
        let { allowMalformed } = Object.assign({
            "allowMalformed": false
        }, _namedArguments);
        this._allowMalformed = allowMalformed;
    }
    get name() {
        return "utf-8";
    }
    decode(codeUnits, _namedArguments) {
        let { allowMalformed } = Object.assign({}, _namedArguments);
        if (allowMalformed == null)
            allowMalformed = this._allowMalformed;
        return new Utf8Decoder({
            allowMalformed: allowMalformed
        }).convert(codeUnits);
    }
    get encoder() {
        return new Utf8Encoder();
    }
    get decoder() {
        return new Utf8Decoder({
            allowMalformed: this._allowMalformed
        });
    }
};
__decorate([
    defaultConstructor
], Utf8Codec.prototype, "Utf8Codec", null);
Utf8Codec = __decorate([
    DartClass
], Utf8Codec);
export { Utf8Codec };
let Utf8Encoder = class Utf8Encoder extends Converter {
    constructor() {
        // @ts-ignore
        super();
    }
    Utf8Encoder() {
    }
    convert(string, start, end) {
        start = start || 0;
        let stringLength = string.length;
        core.RangeError.checkValidRange(start, end, stringLength);
        if (end == null)
            end = stringLength;
        let length = end - start;
        if (length == 0)
            return new typed_data.Uint8List(0);
        let encoder = new _Utf8Encoder.withBufferSize(length * 3);
        let endPosition = encoder._fillBuffer(string, start, end);
        /* TODO (AssertStatementImpl) : assert (endPosition >= end - 1); */
        ;
        if (endPosition != end) {
            let lastCodeUnit = new core.DartString(string).codeUnitAt(end - 1);
            /* TODO (AssertStatementImpl) : assert (_isLeadSurrogate(lastCodeUnit)); */
            ;
            let wasCombined = encoder._writeSurrogate(lastCodeUnit, 0);
            /* TODO (AssertStatementImpl) : assert (!wasCombined); */
            ;
        }
        return encoder._buffer.sublist(0, encoder._bufferIndex);
    }
    startChunkedConversion(sink) {
        if (isNot(sink, ByteConversionSink)) {
            sink = new ByteConversionSink.from(sink);
        }
        return new _Utf8EncoderSink(sink);
    }
    bind(stream) {
        return super.bind(stream);
    }
};
__decorate([
    defaultConstructor
], Utf8Encoder.prototype, "Utf8Encoder", null);
Utf8Encoder = __decorate([
    DartClass
], Utf8Encoder);
export { Utf8Encoder };
let _Utf8Encoder = _Utf8Encoder_1 = class _Utf8Encoder {
    constructor() {
    }
    _Utf8Encoder() {
        this._carry = 0;
        this._bufferIndex = 0;
        this.withBufferSize(_Utf8Encoder_1._DEFAULT_BYTE_BUFFER_SIZE);
    }
    withBufferSize(bufferSize) {
        this._carry = 0;
        this._bufferIndex = 0;
        this._buffer = _Utf8Encoder_1._createBuffer(bufferSize);
    }
    static _createBuffer(size) {
        return new typed_data.Uint8List(size);
    }
    _writeSurrogate(leadingSurrogate, nextCodeUnit) {
        if (_isTailSurrogate(nextCodeUnit)) {
            let rune = _combineSurrogatePair(leadingSurrogate, nextCodeUnit);
            /* TODO (AssertStatementImpl) : assert (rune > _THREE_BYTE_LIMIT); */
            ;
            /* TODO (AssertStatementImpl) : assert (rune <= _FOUR_BYTE_LIMIT); */
            ;
            this._buffer[this._bufferIndex++] = 240 | (rune >> 18);
            this._buffer[this._bufferIndex++] = 128 | ((rune >> 12) & 63);
            this._buffer[this._bufferIndex++] = 128 | ((rune >> 6) & 63);
            this._buffer[this._bufferIndex++] = 128 | (rune & 63);
            return true;
        }
        else {
            this._buffer[this._bufferIndex++] = 224 | (leadingSurrogate >> 12);
            this._buffer[this._bufferIndex++] = 128 | ((leadingSurrogate >> 6) & 63);
            this._buffer[this._bufferIndex++] = 128 | (leadingSurrogate & 63);
            return false;
        }
    }
    _fillBuffer(str, start, end) {
        if (start != end && _isLeadSurrogate(new core.DartString(str).codeUnitAt(end - 1))) {
            end--;
        }
        let stringIndex;
        for (stringIndex = start; stringIndex < end; stringIndex++) {
            let codeUnit = new core.DartString(str).codeUnitAt(stringIndex);
            if (codeUnit <= properties._ONE_BYTE_LIMIT) {
                if (this._bufferIndex >= this._buffer.length)
                    break;
                this._buffer[this._bufferIndex++] = codeUnit;
            }
            else if (_isLeadSurrogate(codeUnit)) {
                if (this._bufferIndex + 3 >= this._buffer.length)
                    break;
                let nextCodeUnit = new core.DartString(str).codeUnitAt(stringIndex + 1);
                let wasCombined = this._writeSurrogate(codeUnit, nextCodeUnit);
                if (wasCombined)
                    stringIndex++;
            }
            else {
                let rune = codeUnit;
                if (rune <= properties._TWO_BYTE_LIMIT) {
                    if (this._bufferIndex + 1 >= this._buffer.length)
                        break;
                    this._buffer[this._bufferIndex++] = 192 | (rune >> 6);
                    this._buffer[this._bufferIndex++] = 128 | (rune & 63);
                }
                else {
                    /* TODO (AssertStatementImpl) : assert (rune <= _THREE_BYTE_LIMIT); */
                    ;
                    if (this._bufferIndex + 2 >= this._buffer.length)
                        break;
                    this._buffer[this._bufferIndex++] = 224 | (rune >> 12);
                    this._buffer[this._bufferIndex++] = 128 | ((rune >> 6) & 63);
                    this._buffer[this._bufferIndex++] = 128 | (rune & 63);
                }
            }
        }
        return stringIndex;
    }
};
_Utf8Encoder._DEFAULT_BYTE_BUFFER_SIZE = 1024;
__decorate([
    defaultConstructor
], _Utf8Encoder.prototype, "_Utf8Encoder", null);
__decorate([
    namedConstructor
], _Utf8Encoder.prototype, "withBufferSize", null);
_Utf8Encoder = _Utf8Encoder_1 = __decorate([
    DartClass
], _Utf8Encoder);
export { _Utf8Encoder };
let _Utf8EncoderSink = class _Utf8EncoderSink extends _Utf8Encoder {
    constructor(_sink) {
        // @ts-ignore
        super();
    }
    _Utf8EncoderSink(_sink) {
        this._sink = _sink;
    }
    close() {
        if (this._carry != 0) {
            this.addSlice("", 0, 0, true);
            return;
        }
        this._sink.close();
    }
    addSlice(str, start, end, isLast) {
        this._bufferIndex = 0;
        if (start == end && !isLast) {
            return;
        }
        if (this._carry != 0) {
            let nextCodeUnit = 0;
            if (start != end) {
                nextCodeUnit = new core.DartString(str).codeUnitAt(start);
            }
            else {
                /* TODO (AssertStatementImpl) : assert (isLast); */
                ;
            }
            let wasCombined = this._writeSurrogate(this._carry, nextCodeUnit);
            /* TODO (AssertStatementImpl) : assert (!wasCombined || start != end); */
            ;
            if (wasCombined)
                start++;
            this._carry = 0;
        }
        do {
            start = this._fillBuffer(str, start, end);
            let isLastSlice = isLast && (start == end);
            if (start == end - 1 && _isLeadSurrogate(new core.DartString(str).codeUnitAt(start))) {
                if (isLast && this._bufferIndex < this._buffer.length - 3) {
                    let hasBeenCombined = this._writeSurrogate(new core.DartString(str).codeUnitAt(start), 0);
                    /* TODO (AssertStatementImpl) : assert (!hasBeenCombined); */
                    ;
                }
                else {
                    this._carry = new core.DartString(str).codeUnitAt(start);
                }
                start++;
            }
            this._sink.addSlice(this._buffer, 0, this._bufferIndex, isLastSlice);
            this._bufferIndex = 0;
        } while (start < end);
        if (isLast)
            this.close();
    }
};
__decorate([
    defaultConstructor
], _Utf8EncoderSink.prototype, "_Utf8EncoderSink", null);
_Utf8EncoderSink = __decorate([
    DartClass
], _Utf8EncoderSink);
export { _Utf8EncoderSink };
let Utf8Decoder = Utf8Decoder_1 = class Utf8Decoder extends Converter {
    constructor(_namedArguments) {
        // @ts-ignore
        super();
    }
    Utf8Decoder(_namedArguments) {
        let { allowMalformed } = Object.assign({
            "allowMalformed": false
        }, _namedArguments);
        this._allowMalformed = allowMalformed;
    }
    convert(codeUnits, start, end) {
        start = start || 0;
        let result = Utf8Decoder_1._convertIntercepted(this._allowMalformed, codeUnits, start, end);
        if (result != null) {
            return result;
        }
        let length = codeUnits.length;
        core.RangeError.checkValidRange(start, end, length);
        if (end == null)
            end = length;
        let buffer = new core.DartStringBuffer();
        let decoder = new _Utf8Decoder(buffer, this._allowMalformed);
        decoder.convert(codeUnits, start, end);
        decoder.flush(codeUnits, end);
        return buffer.toString();
    }
    startChunkedConversion(sink) {
        let stringSink;
        if (is(sink, StringConversionSink)) {
            stringSink = sink;
        }
        else {
            stringSink = new StringConversionSink.from(sink);
        }
        return stringSink.asUtf8Sink(this._allowMalformed);
    }
    bind(stream) {
        return super.bind(stream);
    }
    fuse(next) {
        return super.fuse(next);
    }
    static _convertIntercepted(allowMalformed, codeUnits, start, end) {
        return null; // This call was not intercepted.
    }
};
__decorate([
    defaultConstructor
], Utf8Decoder.prototype, "Utf8Decoder", null);
Utf8Decoder = Utf8Decoder_1 = __decorate([
    DartClass
], Utf8Decoder);
export { Utf8Decoder };
export var _isLeadSurrogate = (codeUnit) => {
    return (codeUnit & properties._SURROGATE_TAG_MASK) == properties._LEAD_SURROGATE_MIN;
};
export var _isTailSurrogate = (codeUnit) => {
    return (codeUnit & properties._SURROGATE_TAG_MASK) == properties._TAIL_SURROGATE_MIN;
};
export var _combineSurrogatePair = (lead, tail) => {
    return 65536 + ((lead & properties._SURROGATE_VALUE_MASK) << 10) | (tail & properties._SURROGATE_VALUE_MASK);
};
let _Utf8Decoder = _Utf8Decoder_1 = class _Utf8Decoder {
    constructor(_stringSink, _allowMalformed) {
        this._isFirstCharacter = true;
        this._value = 0;
        this._expectedUnits = 0;
        this._extraUnits = 0;
    }
    _Utf8Decoder(_stringSink, _allowMalformed) {
        this._stringSink = _stringSink;
        this._allowMalformed = _allowMalformed;
    }
    get hasPartialInput() {
        return this._expectedUnits > 0;
    }
    close() {
        this.flush();
    }
    flush(source, offset) {
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
    convert(codeUnits, startIndex, endIndex) {
        let value = this._value;
        let expectedUnits = this._expectedUnits;
        let extraUnits = this._extraUnits;
        this._value = 0;
        this._expectedUnits = 0;
        this._extraUnits = 0;
        var scanOneByteCharacters = (units, from) => {
            let to = endIndex;
            let mask = properties._ONE_BYTE_LIMIT;
            for (let i = from; i < to; i++) {
                let unit = op(Op.INDEX, units, i);
                if ((op(Op.BITAND, unit, mask)) != unit)
                    return i - from;
            }
            return to - from;
        };
        var addSingleBytes = (from, to) => {
            /* TODO (AssertStatementImpl) : assert (from >= startIndex && from <= endIndex); */
            ;
            /* TODO (AssertStatementImpl) : assert (to >= startIndex && to <= endIndex); */
            ;
            this._stringSink.write(new core.DartString.fromCharCodes(codeUnits, from, to).valueOf());
        };
        let i = startIndex;
        loop: while (true) {
            multibyte: if (expectedUnits > 0) {
                do {
                    if (i == endIndex) {
                        break;
                    }
                    let unit = codeUnits[i];
                    if ((unit & 192) != 128) {
                        expectedUnits = 0;
                        if (!this._allowMalformed) {
                            throw new core.FormatException(`Bad UTF-8 encoding 0x${new core.JSInt(unit).toRadixString(16)}`, codeUnits, i);
                        }
                        this._isFirstCharacter = false;
                        this._stringSink.writeCharCode(properties.UNICODE_REPLACEMENT_CHARACTER_RUNE);
                        break;
                    }
                    else {
                        value = (value << 6) | (unit & 63);
                        expectedUnits--;
                        i++;
                    }
                } while (expectedUnits > 0);
                if (value <= _Utf8Decoder_1._LIMITS[extraUnits - 1]) {
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
                let oneBytes = scanOneByteCharacters(codeUnits, i);
                if (oneBytes > 0) {
                    this._isFirstCharacter = false;
                    addSingleBytes(i, i + oneBytes);
                    i = oneBytes;
                    if (i == endIndex)
                        break;
                }
                let unit = codeUnits[i++];
                if (unit < 0) {
                    if (!this._allowMalformed) {
                        throw new core.FormatException(`Negative UTF-8 code unit: -0x${new core.JSInt(-unit).toRadixString(16)}`, codeUnits, i - 1);
                    }
                    this._stringSink.writeCharCode(properties.UNICODE_REPLACEMENT_CHARACTER_RUNE);
                }
                else {
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
};
_Utf8Decoder._LIMITS = new core.DartList.literal(_ONE_BYTE_LIMIT, _TWO_BYTE_LIMIT, _THREE_BYTE_LIMIT, _FOUR_BYTE_LIMIT);
__decorate([
    defaultConstructor
], _Utf8Decoder.prototype, "_Utf8Decoder", null);
_Utf8Decoder = _Utf8Decoder_1 = __decorate([
    DartClass
], _Utf8Decoder);
export { _Utf8Decoder };
export class _Properties {
    constructor() {
        this.ASCII = new AsciiCodec();
        this._ASCII_MASK = 127;
        this.BASE64 = new Base64Codec();
        this.BASE64URL = new Base64Codec.urlSafe();
        this._paddingChar = 61;
        this.HTML_ESCAPE = new HtmlEscape();
        this.JSON = new JsonCodec();
        this.LATIN1 = new Latin1Codec();
        this._LATIN1_MASK = 255;
        this._LF = 10;
        this._CR = 13;
        this.UNICODE_REPLACEMENT_CHARACTER_RUNE = 65533;
        this.UNICODE_BOM_CHARACTER_RUNE = 65279;
        this.UTF8 = new Utf8Codec();
        this._ONE_BYTE_LIMIT = _ONE_BYTE_LIMIT;
        this._TWO_BYTE_LIMIT = _TWO_BYTE_LIMIT;
        this._THREE_BYTE_LIMIT = _THREE_BYTE_LIMIT;
        this._FOUR_BYTE_LIMIT = _FOUR_BYTE_LIMIT;
        this._SURROGATE_MASK = _SURROGATE_MASK;
        this._SURROGATE_TAG_MASK = _SURROGATE_TAG_MASK;
        this._SURROGATE_VALUE_MASK = _SURROGATE_VALUE_MASK;
        this._LEAD_SURROGATE_MIN = _LEAD_SURROGATE_MIN;
        this._TAIL_SURROGATE_MIN = _TAIL_SURROGATE_MIN;
    }
}
export const properties = new _Properties();
Encoding._nameToEncoding = new core.DartMap.literal([
    ["iso_8859-1:1987", properties.LATIN1],
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
//# sourceMappingURL=convert.js.map