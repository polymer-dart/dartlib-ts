// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// Patch file for dart:core classes.


import {identical} from "./identical";
import {DartPrimitives} from "../native/js_helper";
import {EQUALS_OPERATOR} from "../_common";
import {defaultFactory, namedFactory} from "../utils";
import {int} from "../core";
import _dart from "../_common";
import {DartJsLinkedHashMap} from "../collections/linked_hash_map";

//@patch


// Patch for Object implementation.
//@patch
class DartObject {
    //@patch
    [EQUALS_OPERATOR](other) {
        identical(this, other);
    }

    //@patch
    get hashCode(): int {
        return DartPrimitives.objectHashCode(this);
    }

    //@patch
    toString(): string {
        return DartPrimitives.objectToHumanReadableString(this);
    }

    //@patch
    /*dynamic noSuchMethod(Invocation invocation) {
    throw new NoSuchMethodError(this, invocation.memberName,
    invocation.positionalArguments, invocation.namedArguments);
    */
}

/*
@patch
Type get runtimeType => getRuntimeType(this);
}

@patch
class Null {
    @patch
    int get hashCode => super.hashCode;
}

// Patch for Function implementation.
@patch
class Function {
    @patch
    static apply(Function function, List positionalArguments,
    [Map<Symbol, dynamic> namedArguments]) {
    // The lazy and startup emitter use a different implementation. To keep the
    // method small and inlinable, just select the method.
    return JS_GET_FLAG("IS_FULL_EMITTER")
? _apply1(function, positionalArguments, namedArguments)
: _apply2(function, positionalArguments, namedArguments);
}

static _apply1(function, positionalArguments, namedArguments) {
    return Primitives.applyFunction(
        function,
        positionalArguments,
        // Use this form so that if namedArguments is always null, we can
        // tree-shake _symbolMapToStringMap.
        namedArguments == null ? null : _symbolMapToStringMap(namedArguments));
}

static _apply2(function, positionalArguments, namedArguments) {
    return Primitives.applyFunction2(
        function,
        positionalArguments,
        // Use this form so that if namedArguments is always null, we can
        // tree-shake _symbolMapToStringMap.
        namedArguments == null ? null : _symbolMapToStringMap(namedArguments));
}
}

// Patch for Expando implementation.
@patch
class Expando<T> {
    static const String _EXPANDO_PROPERTY_NAME = 'expando\$values';

    // Incremented to make unique keys.
    static int _keyCount = 0;

    // Stores either a JS WeakMap or a "unique" string key.
    final Object _jsWeakMapOrKey;

    @patch
    Expando([String name])
        : this.name = name,
    _jsWeakMapOrKey = JS('bool', 'typeof WeakMap == "function"')
        ? JS('=Object|Null', 'new WeakMap()')
        : _createKey();

    @patch
    T operator [](Object object) {
    if (_jsWeakMapOrKey is! String) {
    _checkType(object); // WeakMap doesn't check on reading, only writing.
    return JS('', '#.get(#)', _jsWeakMapOrKey, object);
}
return _getFromObject(_jsWeakMapOrKey, object);
}

@patch
void operator []=(Object object, T value) {
    if (_jsWeakMapOrKey is! String) {
        JS('void', '#.set(#, #)', _jsWeakMapOrKey, object, value);
    } else {
        _setOnObject(_jsWeakMapOrKey, object, value);
    }
}

static Object _getFromObject(String key, Object object) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    return (values == null) ? null : Primitives.getProperty(values, key);
}

static void _setOnObject(String key, Object object, Object value) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    if (values == null) {
        values = new Object();
        Primitives.setProperty(object, _EXPANDO_PROPERTY_NAME, values);
    }
    Primitives.setProperty(values, key, value);
}

static String _createKey() => "expando\$key\$${_keyCount++}";

static _checkType(object) {
    if (object == null || object is bool || object is num || object is String) {
        throw new ArgumentError.value(object,
            "Expandos are not allowed on strings, numbers, booleans or null");
    }
}
}

@patch
class int {
    @patch
    static int parse(String source, {int radix, int onError(String source)}) {
    return Primitives.parseInt(source, radix, onError);
}

@patch
factory int.fromEnvironment(String name, {int defaultValue}) {
    throw new UnsupportedError(
        'int.fromEnvironment can only be used as a const constructor');
}
}

@patch
class double {
    @patch
    static double parse(String source, [double onError(String source)]) {
    return Primitives.parseDouble(source, onError);
}
}

@patch
class Error {
    @patch
    static String _objectToString(Object object) {
    // Closures all have useful and safe toString methods.
    if (object is Closure) return object.toString();
    return Primitives.objectToHumanReadableString(object);
}

@patch
static String _stringToSafeString(String string) {
    return jsonEncodeNative(string);
}

@patch
StackTrace get stackTrace => Primitives.extractStackTrace(this);
}

@patch
class FallThroughError {
    @patch
    String toString() => super.toString();
}

@patch
class AbstractClassInstantiationError {
    @patch
    String toString() => "Cannot instantiate abstract class: '$_className'";
}

// Patch for DateTime implementation.
@patch
class DateTime {
    @patch
    DateTime.fromMillisecondsSinceEpoch(int millisecondsSinceEpoch,
{bool isUtc: false})
// `0 + millisecondsSinceEpoch` forces the inferred result to be non-null.
: this._withValue(0 + millisecondsSinceEpoch, isUtc: isUtc);

@patch
DateTime.fromMicrosecondsSinceEpoch(int microsecondsSinceEpoch,
    {bool isUtc: false})
: this._withValue(
    _microsecondInRoundedMilliseconds(microsecondsSinceEpoch),
    isUtc: isUtc);

@patch
DateTime._internal(int year, int month, int day, int hour, int minute,
    int second, int millisecond, int microsecond, bool isUtc)
// checkBool is manually inlined here because dart2js doesn't inline it
// and [isUtc] is usually a constant.
: this.isUtc = isUtc is bool
    ? isUtc
    : throw new ArgumentError.value(isUtc, 'isUtc'),
    _value = checkInt(Primitives.valueFromDecomposedDate(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond + _microsecondInRoundedMilliseconds(microsecond),
        isUtc));

@patch
DateTime._now()
: isUtc = false,
    _value = Primitives.dateNow();

/// Rounds the given [microsecond] to the nearest milliseconds value.
///
/// For example, invoked with argument `2600` returns `3`.
static int _microsecondInRoundedMilliseconds(int microsecond) {
    return (microsecond / 1000).round();
}

@patch
static int _brokenDownDateToValue(int year, int month, int day, int hour,
    int minute, int second, int millisecond, int microsecond, bool isUtc) {
    return Primitives.valueFromDecomposedDate(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond + _microsecondInRoundedMilliseconds(microsecond),
        isUtc);
}

@patch
String get timeZoneName {
    if (isUtc) return "UTC";
    return Primitives.getTimeZoneName(this);
}

@patch
Duration get timeZoneOffset {
    if (isUtc) return new Duration();
    return new Duration(minutes: Primitives.getTimeZoneOffsetInMinutes(this));
}

@patch
DateTime add(Duration duration) {
    return new DateTime._withValue(_value + duration.inMilliseconds,
        isUtc: isUtc);
}

@patch
DateTime subtract(Duration duration) {
    return new DateTime._withValue(_value - duration.inMilliseconds,
        isUtc: isUtc);
}

@patch
Duration difference(DateTime other) {
    return new Duration(milliseconds: _value - other._value);
}

@patch
int get millisecondsSinceEpoch => _value;

@patch
int get microsecondsSinceEpoch => 1000 * _value;

@patch
int get year => Primitives.getYear(this);

@patch
int get month => Primitives.getMonth(this);

@patch
int get day => Primitives.getDay(this);

@patch
int get hour => Primitives.getHours(this);

@patch
int get minute => Primitives.getMinutes(this);

@patch
int get second => Primitives.getSeconds(this);

@patch
int get millisecond => Primitives.getMilliseconds(this);

@patch
int get microsecond => 0;

@patch
int get weekday => Primitives.getWeekday(this);
}

// Patch for Stopwatch implementation.
@patch
class Stopwatch {
    @patch
    static void _initTicker() {
        Primitives.initTicker();
        _frequency = Primitives.timerFrequency;
    }

    @patch
    static int _now() => Primitives.timerTicks();
}*/


/*
//@patch
@DartClass
class DartString extends String {

    constructor(string: string) {
        super(string);
    }


    //@patch
    @namedFactory
    protected static _fromCharCodes(charCodes: DartIterable<int>,
                                    start?: int , end?: int): DartString {
        start = start || 0;
        if (_dart.is(charCodes, JSArray)) {
            return DartString._stringFromJSArray(charCodes as any, start, end);
        }
        if (_dart.is(charCodes, Array)) {
            return DartString._stringFromUint8List(charCodes as any, start, end);
        }
        return DartString._stringFromIterable(charCodes, start, end);
    }

    static fromCharCodes: new(charCodes: DartIterable<int>,
                              start?: int , end?: int) => DartString;

    @namedFactory
    protected static _fromCharCode(charCode: int): DartString {
        return DartPrimitives.stringFromCharCode(charCode);
    }

    static fromCharCode: new(charCode: int) => DartString;

    @namedFactory
    protected static _fromEnvironment(name: string, _?: { defaultValue?: string }) {
        throw new UnsupportedError(
            'String.fromEnvironment can only be used as a const constructor');
    }

    protected static _stringFromJSArray(list: DartList<any>, start: int, endOrNull: int): DartString {
        let len = list.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        if (start > 0 || end < len) {
            list = list.sublist(start, end);
        }
        return DartPrimitives.stringFromCharCodes(list);
    }

    protected static _stringFromUint8List(
        charCodes: Array<int>, start: int, endOrNull: int): DartString {
        let len = charCodes.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        return DartPrimitives.stringFromNativeUint8List(charCodes, start, end);
    }

    static _stringFromIterable(
        charCodes: DartIterable<int>, start: int, end: int): DartString {
        if (start < 0) throw new RangeError.range(start, 0, charCodes.length);
        if (end != null && end < start) {
            throw new RangeError.range(end, start, charCodes.length);
        }
        let it = charCodes.iterator;
        for (let i = 0; i < start; i++) {
            if (!it.moveNext()) {
                throw new RangeError.range(start, 0, i);
            }
        }
        let list = new DartList<int>();
        if (end == null) {
            while (it.moveNext()) list.add(it.current);
        } else {
            for (let i = start; i < end; i++) {
                if (!it.moveNext()) {
                    throw new RangeError.range(end, start, i);
                }
                list.add(it.current);
            }
        }
        return DartPrimitives.stringFromCharCodes(list);
    }

    get isEmpty(): bool {
        return this.length == 0;
    }
}
*/
/*
@patch
class bool {
    @patch
    factory bool.fromEnvironment(String name, {bool defaultValue: false}) {
    throw new UnsupportedError(
        'bool.fromEnvironment can only be used as a const constructor');
}

@patch
int get hashCode => super.hashCode;
}

@patch
class RegExp {
    @NoInline()
    @patch
    factory RegExp(String source,
{bool multiLine: false, bool caseSensitive: true}) =>
new JSSyntaxRegExp(source,
    multiLine: multiLine, caseSensitive: caseSensitive);
}

// Patch for 'identical' function.
@NoInline() // No inlining since we recognize the call in optimizer.
@patch
bool identical(Object a, Object b) {
    return JS('bool', '(# == null ? # == null : # === #)', a, b, a, b);
}
*/

/*
@patch
class NoSuchMethodError {
    @patch
    NoSuchMethodError(Object receiver, Symbol memberName,
    List positionalArguments, Map<Symbol, dynamic> namedArguments,
    [List existingArgumentNames = null])
: _receiver = receiver,
    _memberName = memberName,
    _arguments = positionalArguments,
    _namedArguments = namedArguments,
    _existingArgumentNames = existingArgumentNames;

    @patch
    String toString() {
        StringBuffer sb = new StringBuffer('');
        String comma = '';
        if (_arguments != null) {
            for (var argument in _arguments) {
                sb.write(comma);
                sb.write(Error.safeToString(argument));
                comma = ', ';
            }
        }
        if (_namedArguments != null) {
            _namedArguments.forEach((Symbol key, var value) {
                sb.write(comma);
                sb.write(_symbolToString(key));
                sb.write(": ");
                sb.write(Error.safeToString(value));
                comma = ', ';
            });
        }
        String memberName = _symbolToString(_memberName);
        String receiverText = Error.safeToString(_receiver);
        String actualParameters = '$sb';
        if (_existingArgumentNames == null) {
            return "NoSuchMethodError: method not found: '$memberName'\n"
            "Receiver: ${receiverText}\n"
            "Arguments: [$actualParameters]";
        } else {
            String formalParameters = _existingArgumentNames.join(', ');
            return "NoSuchMethodError: incorrect number of arguments passed to "
            "method named '$memberName'\n"
            "Receiver: ${receiverText}\n"
            "Tried calling: $memberName($actualParameters)\n"
            "Found: $memberName($formalParameters)";
        }
    }
}

@patch
class Uri {
    @patch
    static Uri get base {
        String uri = Primitives.currentUri();
        if (uri != null) return Uri.parse(uri);
        throw new UnsupportedError("'Uri.base' is not supported");
    }
}

@patch
class _Uri {
    @patch
    static bool get _isWindows => false;

    // Matches a String that _uriEncodes to itself regardless of the kind of
    // component.  This corresponds to [_unreservedTable], i.e. characters that
    // are not encoded by any encoding table.
    static final RegExp _needsNoEncoding = new RegExp(r'^[\-\.0-9A-Z_a-z~]*$');

    /**
     * This is the internal implementation of JavaScript's encodeURI function.
     * It encodes all characters in the string [text] except for those
     * that appear in [canonicalTable], and returns the escaped string.
     * /
    @patch
    static String _uriEncode(List<int> canonicalTable, String text,
    Encoding encoding, bool spaceToPlus) {
    if (identical(encoding, UTF8) && _needsNoEncoding.hasMatch(text)) {
    return text;
}

// Encode the string into bytes then generate an ASCII only string
// by percent encoding selected bytes.
StringBuffer result = new StringBuffer('');
var bytes = encoding.encode(text);
for (int i = 0; i < bytes.length; i++) {
    int byte = bytes[i];
    if (byte < 128 &&
        ((canonicalTable[byte >> 4] & (1 << (byte & 0x0f))) != 0)) {
        result.writeCharCode(byte);
    } else if (spaceToPlus && byte == _SPACE) {
        result.write('+');
    } else {
        const String hexDigits = '0123456789ABCDEF';
        result.write('%');
        result.write(hexDigits[(byte >> 4) & 0x0f]);
        result.write(hexDigits[byte & 0x0f]);
    }
}
return result.toString();
}
}

Uri _resolvePackageUri(Uri packageUri) {
    assert(packageUri.scheme == "package");
    if (packageUri.hasAuthority) {
        throw new ArgumentError("Package-URI must not have a host: $packageUri");
    }
    var resolved = Uri.base.resolve("packages/${packageUri.path}");
    return resolved;
}

bool _hasErrorStackProperty = JS('bool', 'new Error().stack != void 0');

@patch
class StackTrace {
    @patch
    @NoInline()
    static StackTrace get current {
        if (_hasErrorStackProperty) {
            return getTraceFromException(JS('', 'new Error()'));
        }
        // Fallback if new Error().stack does not exist.
        // Currently only required for IE 11.
        try {
            throw '';
        } catch (_, stackTrace) {
            return stackTrace;
        }
    }
}

// Called from kernel generated code.
_malformedTypeError(message) => new RuntimeError(message);

// Called from kernel generated code.
_genericNoSuchMethod(receiver, memberName, positionalArguments, namedArguments,
    existingArguments) {
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedConstructorError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate an error that reads:
    //
    //     No constructor '$memberName' declared in class '$receiver'.

    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticGetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticSetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedStaticMethodError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelGetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelSetterError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}

// Called from kernel generated code.
_unresolvedTopLevelMethodError(receiver, memberName, positionalArguments,
    namedArguments, existingArguments) {
    // TODO(sra): Generate customized message.
    return new NoSuchMethodError(
        receiver, memberName, positionalArguments, namedArguments);
}
*/