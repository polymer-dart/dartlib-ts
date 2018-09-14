import {
    DartComparable,
    DartIterable,
    DartPattern,
    DartMatch,
    DartList,
    StateError,
    DartBidirectionalIterator,
    RangeError,
    ArgumentError,
    JSArray,
    DartPrimitives,
    UnsupportedError,
    JSIndexable,
    diagnoseIndexError,
    checkString,
    checkInt,
    checkNull,
    argumentErrorValue,
    JSSyntaxRegExp,
    regExpCaptureCount,
    regExpGetNative,
    DartIterator,
    DartIterableElementError,
    DartRegExp,
    DartStringBuffer,
    regExpGetGlobalNative,
    firstMatchAfter,
    DartUnmodifiableListBase
} from "./core";
import {Abstract, AbstractProperty, bool, DartClass, defaultFactory, Implements, int, namedConstructor, namedFactory, Op, Operator} from "./utils";
import {is, isNot, nullOr} from "./_common";

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.core;

/**
 * A sequence of characters.
 *
 * A string can be either single or multiline. Single line strings are
 * written using matching single or double quotes, and multiline strings are
 * written using triple quotes. The following are all valid Dart strings:
 *
 *     'Single quotes';
 *     "Double quotes";
 *     'Double quotes in "single" quotes';
 *     "Single quotes in 'double' quotes";
 *
 *     '''A
 *     multiline
 *     string''';
 *
 *     """
 *     Another
 *     multiline
 *     string""";
 *
 * Strings are immutable. Although you cannot change a string, you can perform
 * an operation on a string and assign the result to a new string:
 *
 *     var string = 'Dart is fun';
 *     var newString = string.substring(0, 5);
 *
 * You can use the plus (`+`) operator to concatenate strings:
 *
 *     'Dart ' + 'is ' + 'fun!'; // 'Dart is fun!'
 *
 * You can also use adjacent string literals for concatenation:
 *
 *     'Dart ' 'is ' 'fun!';    // 'Dart is fun!'
 *
 * You can use `${}` to interpolate the value of Dart expressions
 * within strings. The curly braces can be omitted when evaluating identifiers:
 *
 *     string = 'dartlang';
 *     '$string has ${string.length} letters'; // 'dartlang has 8 letters'
 *
 * A string is represented by a sequence of Unicode UTF-16 code units
 * accessible through the [codeUnitAt] or the [codeUnits] members:
 *
 *     string = 'Dart';
 *     string.codeUnitAt(0); // 68
 *     string.codeUnits;     // [68, 97, 114, 116]
 *
 * The string representation of code units is accessible through the index
 * operator:
 *
 *     string[0];            // 'D'
 *
 * The characters of a string are encoded in UTF-16. Decoding UTF-16, which
 * combines surrogate pairs, yields Unicode code points. Following a similar
 * terminology to Go, we use the name 'rune' for an integer representing a
 * Unicode code point. Use the [runes] property to get the runes of a string:
 *
 *     string.runes.toList(); // [68, 97, 114, 116]
 *
 * For a character outside the Basic Multilingual Plane (plane 0) that is
 * composed of a surrogate pair, [runes] combines the pair and returns a
 * single integer.  For example, the Unicode character for a
 * musical G-clef ('𝄞') with rune value 0x1D11E consists of a UTF-16 surrogate
 * pair: `0xD834` and `0xDD1E`. Using [codeUnits] returns the surrogate pair,
 * and using `runes` returns their combined value:
 *
 *     var clef = '\u{1D11E}';
 *     clef.codeUnits;         // [0xD834, 0xDD1E]
 *     clef.runes.toList();    // [0x1D11E]
 *
 * The String class can not be extended or implemented. Attempting to do so
 * yields a compile-time error.
 *
 * ## Other resources
 *
 * See [StringBuffer] to efficiently build a string incrementally. See
 * [RegExp] to work with regular expressions.
 *
 * Also see:

 * * [Dart Cookbook](https://www.dartlang.org/docs/cookbook/#strings)
 *   for String examples and recipes.
 * * [Dart Up and Running](https://www.dartlang.org/docs/dart-up-and-running/ch03.html#strings-and-regular-expressions)
 */
@DartClass
@Implements(DartPattern)
class DartString implements DartComparable<DartString>, DartPattern {
    @defaultFactory
    protected static fromJs(s: string): DartString {
        return new JSString(s);
    }

    constructor(s: string) {

    }

    @Abstract
    valueOf(): string {
        throw 'abstract';
    }

    /**
     * Allocates a new String for the specified [charCodes].
     *
     * The [charCodes] can be UTF-16 code units or runes. If a char-code value is
     * 16-bit, it is copied verbatim:
     *
     *     new String.fromCharCodes([68]); // 'D'
     *
     * If a char-code value is greater than 16-bits, it is decomposed into a
     * surrogate pair:
     *
     *     var clef = new String.fromCharCodes([0x1D11E]);
     *     clef.codeUnitAt(0); // 0xD834
     *     clef.codeUnitAt(1); // 0xDD1E
     *
     * If [start] and [end] is provided, only the values of [charCodes]
     * at positions from `start` to, but not including, `end`, are used.
     * The `start` and `end` values must satisfy
     * `0 <= start <= end <= charCodes.length`.
     */

    /*external*/
    @namedFactory
    protected static _fromCharCodes(charCodes: DartIterable<int> | Array<int>,
                                    start?: int, end?: int): DartString {
        start = nullOr(start, 0);
        if (is(charCodes, JSArray)) {
            return DartString._stringFromJSArray(charCodes as any, start, end);
        }
        if (is(charCodes, Array)) {
            return DartString._stringFromUint8List(charCodes as any, start, end);
        }
        return DartString._stringFromIterable(charCodes, start, end);
    }

    static fromCharCodes: new(charCodes: DartIterable<int> | Array<int>,
                              start?: int, end?: int) => DartString;

    /**
     * Allocates a new String for the specified [charCode].
     *
     * If the [charCode] can be represented by a single UTF-16 code unit, the new
     * string contains a single code unit. Otherwise, the [length] is 2 and
     * the code units form a surrogate pair. See documentation for
     * [fromCharCodes].
     *
     * Creating a String with half of a surrogate pair is allowed.
     */
    @namedFactory
    protected static _fromCharCode(charCode: int): DartString {
        return new DartString(DartPrimitives.stringFromCharCode(charCode));
    }

    static fromCharCode: new(charCode: int) => DartString;

    /**
     * Returns the string value of the environment declaration [name].
     *
     * Environment declarations are provided by the surrounding system compiling
     * or running the Dart program. Declarations map a string key to a string
     * value.
     *
     * If [name] is not declared in the environment, the result is instead
     * [defaultValue].
     *
     * Example of getting a value:
     *
     *     const String.fromEnvironment("defaultFloo", defaultValue: "no floo")
     *
     * Example of checking whether a declaration is there at all:
     *
     *     var isDeclared = const String.fromEnvironment("maybeDeclared") != null;
     */
    // The .fromEnvironment() constructors are special in that we do not want
    // users to call them using "new". We prohibit that by giving them bodies
    // that throw, even though const constructors are not allowed to have bodies.
    // Disable those static errors.
    //ignore: const_constructor_with_body
    //ignore: const_factory
    @namedFactory
    protected static _fromEnvironment(name: string,
                                      _?: { defaultValue?: string }): DartString {
        throw new UnsupportedError(
            'String.fromEnvironment can only be used as a const constructor');
    }

    static fromEnvironment: new(name: string,
                                _?: { defaultValue?: string }) => DartString;

    /**
     * Gets the character (as a single-code-unit [String]) at the given [index].
     *
     * The returned string represents exactly one UTF-16 code unit, which may be
     * half of a surrogate pair. A single member of a surrogate pair is an
     * invalid UTF-16 string:
     *
     *     var clef = '\u{1D11E}';
     *     // These represent invalid UTF-16 strings.
     *     clef[0].codeUnits;      // [0xD834]
     *     clef[1].codeUnits;      // [0xDD1E]
     *
     * This method is equivalent to
     * `new String.fromCharCode(this.codeUnitAt(index))`.
     */
    @Operator(Op.INDEX)
    @Abstract
    charAt(index: int): string {
        throw 'abstract';
    }

    /**
     * Returns the 16-bit UTF-16 code unit at the given [index].
     */
    @Abstract
    codeUnitAt(index: int): int {
        throw 'abstract';
    }

    /**
     * The length of the string.
     *
     * Returns the number of UTF-16 code units in this string. The number
     * of [runes] might be fewer, if the string contains characters outside
     * the Basic Multilingual Plane (plane 0):
     *
     *     'Dart'.length;          // 4
     *     'Dart'.runes.length;    // 4
     *
     *     var clef = '\u{1D11E}';
     *     clef.length;            // 2
     *     clef.runes.length;      // 1
     */
    @AbstractProperty
    get length(): int {
        throw 'abstract';
    }

    /**
     * Returns a hash code derived from the code units of the string.
     *
     * This is compatible with [==]. Strings with the same sequence
     * of code units have the same hash code.
     */
    @AbstractProperty
    get hashCode(): int {
        throw 'abstract';
    }

    /**
     * Returns true if other is a `String` with the same sequence of code units.
     *
     * This method compares each individual code unit of the strings.
     * It does not check for Unicode equivalence.
     * For example, both the following strings represent the string 'Amélie',
     * but due to their different encoding, are not equal:
     *
     *     'Am\xe9lie' == 'Ame\u{301}lie'; // false
     *
     * The first string encodes 'é' as a single unicode code unit (also
     * a single rune), whereas the second string encodes it as 'e' with the
     * combining accent character '◌́'.
     */
    @Operator(Op.EQUALS)
    @Abstract
    equals(other: any): bool {
        throw 'abstract';
    }

    /**
     * Returns true if this string ends with [other]. For example:
     *
     *     'Dart'.endsWith('t'); // true
     */
    @Abstract
    endsWith(other: string): bool {
        throw 'abstract';
    }

    /**
     * Returns true if this string starts with a match of [pattern].
     *
     *     var string = 'Dart';
     *     string.startsWith('D');                       // true
     *     string.startsWith(new RegExp(r'[A-Z][a-z]')); // true
     *
     * If [index] is provided, this method checks if the substring starting
     * at that index starts with a match of [pattern]:
     *
     *     string.startsWith('art', 1);                  // true
     *     string.startsWith(new RegExp(r'\w{3}'));      // true
     *
     * [index] must not be negative or greater than [length].
     *
     * A [RegExp] containing '^' does not match if the [index] is greater than
     * zero. The pattern works on the string as a whole, and does not extract
     * a substring starting at [index] first:
     *
     *     string.startsWith(new RegExp(r'^art'), 1);    // false
     *     string.startsWith(new RegExp(r'art'), 1);     // true
     */
    @Abstract
    startsWith(pattern: DartPattern, index?: int): bool {
        throw 'abstract';
    }

    /**
     * Returns the position of the first match of [pattern] in this string,
     * starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.indexOf('art');                     // 1
     *     string.indexOf(new RegExp(r'[A-Z][a-z]')); // 0
     *
     * Returns -1 if no match is found:
     *
     *     string.indexOf(new RegExp(r'dart'));       // -1
     *
     * [start] must be non-negative and not greater than [length].
     */
    @Abstract
    indexOf(pattern: DartPattern, start?: int): int {
        throw 'abstract';
    }

    /**
     * Returns the position of the last match [pattern] in this string, searching
     * backward starting at [start], inclusive:
     *
     *     var string = 'Dartisans';
     *     string.lastIndexOf('a');                    // 6
     *     string.lastIndexOf(new RegExp(r'a(r|n)'));  // 6
     *
     * Returns -1 if [pattern] could not be found in this string.
     *
     *     string.lastIndexOf(new RegExp(r'DART'));    // -1
     *
     * The [start] must be non-negative and not greater than [length].
     */
    @Abstract
    lastIndexOf(pattern: DartPattern, start?: int): int {
        throw 'abstract';
    }

    /**
     * Returns true if this string is empty.
     */
    @AbstractProperty
    get isEmpty(): bool {
        throw 'abstract';
    }

    /**
     * Returns true if this string is not empty.
     */
    @AbstractProperty
    get isNotEmpty(): bool {
        throw 'abstract';
    }

    /**
     * Creates a new string by concatenating this string with [other].
     *
     *     'dart' + 'lang'; // 'dartlang'
     */
    @Operator(Op.PLUS)
    concat(other: string): string {
        throw 'abstract';
    }

    /**
     * Returns the substring of this string that extends from [startIndex],
     * inclusive, to [endIndex], exclusive.
     *
     *     var string = 'dartlang';
     *     string.substring(1);    // 'artlang'
     *     string.substring(1, 4); // 'art'
     */
    @Abstract
    substring(startIndex: int, endIndex?: int): string {
        throw 'abstract';
    }

    /**
     * Returns the string without any leading and trailing whitespace.
     *
     * If the string contains leading or trailing whitespace, a new string with no
     * leading and no trailing whitespace is returned:
     *
     *     '\tDart is fun\n'.trim(); // 'Dart is fun'
     *
     * Otherwise, the original string itself is returned:
     *
     *     var str1 = 'Dart';
     *     var str2 = str1.trim();
     *     identical(str1, str2);    // true
     *
     * Whitespace is defined by the Unicode White_Space property (as defined in
     * version 6.2 or later) and the BOM character, 0xFEFF.
     *
     * Here is the list of trimmed characters (following version 6.2):
     *
     *     0009..000D    ; White_Space # Cc   <control-0009>..<control-000D>
     *     0020          ; White_Space # Zs   SPACE
     *     0085          ; White_Space # Cc   <control-0085>
     *     00A0          ; White_Space # Zs   NO-BREAK SPACE
     *     1680          ; White_Space # Zs   OGHAM SPACE MARK
     *     180E          ; White_Space # Zs   MONGOLIAN VOWEL SEPARATOR
     *     2000..200A    ; White_Space # Zs   EN QUAD..HAIR SPACE
     *     2028          ; White_Space # Zl   LINE SEPARATOR
     *     2029          ; White_Space # Zp   PARAGRAPH SEPARATOR
     *     202F          ; White_Space # Zs   NARROW NO-BREAK SPACE
     *     205F          ; White_Space # Zs   MEDIUM MATHEMATICAL SPACE
     *     3000          ; White_Space # Zs   IDEOGRAPHIC SPACE
     *
     *     FEFF          ; BOM                ZERO WIDTH NO_BREAK SPACE
     */
    @Abstract
    trim(): string {
        throw 'abstract';
    }

    /**
     * Returns the string without any leading whitespace.
     *
     * As [trim], but only removes leading whitespace.
     */
    @Abstract
    trimLeft(): string {
        throw 'abstract';
    }

    /**
     * Returns the string without any trailing whitespace.
     *
     * As [trim], but only removes trailing whitespace.
     */
    @Abstract
    trimRight(): string {
        throw 'abstract';
    }

    /**
     * Creates a new string by concatenating this string with itself a number
     * of times.
     *
     * The result of `str * n` is equivalent to
     * `str + str + ...`(n times)`... + str`.
     *
     * Returns an empty string if [times] is zero or negative.
     */
    @Operator(Op.TIMES)
    repeat(times: int): string {
        throw 'abstract';
    }

    /**
     * Pads this string on the left if it is shorter than [width].
     *
     * Return a new string that prepends [padding] onto this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    @Abstract
    padLeft(width: int, padding?: string): string {
        throw 'abstract';
    }

    /**
     * Pads this string on the right if it is shorter than [width].
     *
     * Return a new string that appends [padding] after this string
     * one time for each position the length is less than [width].
     *
     * If [width] is already smaller than or equal to `this.length`,
     * no padding is added. A negative `width` is treated as zero.
     *
     * If [padding] has length different from 1, the result will not
     * have length `width`. This may be useful for cases where the
     * padding is a longer string representing a single character, like
     * `"&nbsp;"` or `"\u{10002}`".
     * In that case, the user should make sure that `this.length` is
     * the correct measure of the strings length.
     */
    @Abstract
    padRight(width: int, padding?: string): string {
        throw 'abstract';
    }


    /**
     * Returns true if this string contains a match of [other]:
     *
     *     var string = 'Dart strings';
     *     string.contains('D');                     // true
     *     string.contains(new RegExp(r'[A-Z]'));    // true
     *
     * If [startIndex] is provided, this method matches only at or after that
     * index:
     *
     *     string.contains('X', 1);                  // false
     *     string.contains(new RegExp(r'[A-Z]'), 1); // false
     *
     * [startIndex] must not be negative or greater than [length].
     */
    @Abstract
    contains(other: DartPattern, startIndex?: int): bool {
        throw 'abstract';
    }


    /**
     * Returns a new string in which the first occurrence of [from] in this string
     * is replaced with [to], starting from [startIndex]:
     *
     *     '0.0001'.replaceFirst(new RegExp(r'0'), ''); // '.0001'
     *     '0.0001'.replaceFirst(new RegExp(r'0'), '7', 1); // '0.7001'
     */
    @Abstract
    replaceFirst(from: DartPattern, to: string, startIndex?: int): string {
        throw 'abstract';
    }


    /**
     * Replace the first occurrence of [from] in this string.
     *
     * Returns a new string, which is this string
     * except that the first match of [from], starting from [startIndex],
     * is replaced by the result of calling [replace] with the match object.
     *
     * The optional [startIndex] is by default set to 0. If provided, it must be
     * an integer in the range `[0 .. len]`, where `len` is this string's length.
     *
     * If the value returned by calling `replace` is not a [String], it
     * is converted to a `String` using its `toString` method, which must
     * then return a string.
     */
    @Abstract
    replaceFirstMapped(from: DartPattern, replace: (match: DartMatch) => string,
                       startIndex?: int): string {
        throw 'abstract';
    }


    /**
     * Replaces all substrings that match [from] with [replace].
     *
     * Returns a new string in which the non-overlapping substrings matching
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the literal string [replace].
     *
     *     'resume'.replaceAll(new RegExp(r'e'), 'é'); // 'résumé'
     *
     * Notice that the [replace] string is not interpreted. If the replacement
     * depends on the match (for example on a [RegExp]'s capture groups), use
     * the [replaceAllMapped] method instead.
     */
    @Abstract
    replaceAll(from: DartPattern, replace: string): string {
        throw 'abstract';
    }


    /**
     * Replace all substrings that match [from] by a string computed from the
     * match.
     *
     * Returns a new string in which the non-overlapping substrings that match
     * [from] (the ones iterated by `from.allMatches(thisString)`) are replaced
     * by the result of calling [replace] on the corresponding [Match] object.
     *
     * This can be used to replace matches with new content that depends on the
     * match, unlike [replaceAll] where the replacement string is always the same.
     *
     * The [replace] function is called with the [Match] generated
     * by the pattern, and its result is used as replacement.
     *
     * The function defined below converts each word in a string to simplified
     * 'pig latin' using [replaceAllMapped]:
     *
     *     pigLatin(String words) => words.replaceAllMapped(
     *         new RegExp(r'\b(\w*?)([aeiou]\w*)', caseSensitive: false),
     *         (Match m) => "${m[2]}${m[1]}${m[1].isEmpty ? 'way' : 'ay'}");
     *
     *     pigLatin('I have a secret now!'); // 'Iway avehay away ecretsay ownay!'
     */
    @Abstract
    replaceAllMapped(from: DartPattern, replace: (match: DartMatch) => string): string {
        throw 'abstract';
    }


    /**
     * Replaces the substring from [start] to [end] with [replacement].
     *
     * Returns a new string equivalent to:
     *
     *     this.substring(0, start) + replacement + this.substring(end)
     *
     * The [start] and [end] indices must specify a valid range of this string.
     * That is `0 <= start <= end <= this.length`.
     * If [end] is `null`, it defaults to [length].
     */
    @Abstract
    replaceRange(start: int, end: int, replacement: string): string {
        throw 'abstract';
    }


    /**
     * Splits the string at matches of [pattern] and returns a list of substrings.
     *
     * Finds all the matches of `pattern` in this string,
     * and returns the list of the substrings between the matches.
     *
     *     var string = "Hello world!";
     *     string.split(" ");                      // ['Hello', 'world!'];
     *
     * Empty matches at the beginning and end of the strings are ignored,
     * and so are empty matches right after another match.
     *
     *     var string = "abba";
     *     string.split(new RegExp(r"b*"));        // ['a', 'a']
     *                                             // not ['', 'a', 'a', '']
     *
     * If this string is empty, the result is an empty list if `pattern` matches
     * the empty string, and it is `[""]` if the pattern doesn't match.
     *
     *     var string = '';
     *     string.split('');                       // []
     *     string.split("a");                      // ['']
     *
     * Splitting with an empty pattern splits the string into single-code unit
     * strings.
     *
     *     var string = 'Pub';
     *     string.split('');                       // ['P', 'u', 'b']
     *
     *     string.codeUnits.map((unit) {
     *       return new String.fromCharCode(unit);
     *     }).toList();                            // ['P', 'u', 'b']
     *
     * Splitting happens at UTF-16 code unit boundaries,
     * and not at rune boundaries:
     *
     *     // String made up of two code units, but one rune.
     *     string = '\u{1D11E}';
     *     string.split('').length;                 // 2 surrogate values
     *
     * To get a list of strings containing the individual runes of a string,
     * you should not use split. You can instead map each rune to a string
     * as follows:
     *
     *     string.runes.map((rune) => new String.fromCharCode(rune)).toList();
     */
    @Abstract
    split(pattern: DartPattern): DartList<String> {
        throw 'abstract';
    }


    /**
     * Splits the string, converts its parts, and combines them into a new
     * string.
     *
     * [pattern] is used to split the string into parts and separating matches.
     *
     * Each match is converted to a string by calling [onMatch]. If [onMatch]
     * is omitted, the matched string is used.
     *
     * Each non-matched part is converted by a call to [onNonMatch]. If
     * [onNonMatch] is omitted, the non-matching part is used.
     *
     * Then all the converted parts are combined into the resulting string.
     *
     *     'Eats shoots leaves'.splitMapJoin((new RegExp(r'shoots')),
     *         onMatch:    (m) => '${m.group(0)}',
     *         onNonMatch: (n) => '*'); // *shoots*
     */
    @Abstract
    splitMapJoin(pattern: DartPattern,
                 _?: { onMatch?: (match: DartMatch) => string, onNonMatch?: (nonMatch: string) => string }): string {
        throw 'abstract';
    }


    /**
     * Returns an unmodifiable list of the UTF-16 code units of this string.
     */
    @AbstractProperty
    get codeUnits(): DartList<int> {
        throw 'abstract';
    }


    /**
     * Returns an [Iterable] of Unicode code-points of this string.
     *
     * If the string contains surrogate pairs, they are combined and returned
     * as one integer by this iterator. Unmatched surrogate halves are treated
     * like valid 16-bit code-units.
     */
    @AbstractProperty
    get runes(): DartRunes {
        throw 'abstract';
    }


    /**
     * Converts all characters in this string to lower case.
     * If the string is already in all lower case, this method returns [:this:].
     *
     *     'ALPHABET'.toLowerCase(); // 'alphabet'
     *     'abc'.toLowerCase();      // 'abc'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    // TODO(floitsch): document better. (See EcmaScript for description).
    @Abstract
    toLowerCase(): string {
        throw 'abstract';
    }


    /**
     * Converts all characters in this string to upper case.
     * If the string is already in all upper case, this method returns [:this:].
     *
     *     'alphabet'.toUpperCase(); // 'ALPHABET'
     *     'ABC'.toUpperCase();      // 'ABC'
     *
     * This function uses the language independent Unicode mapping and thus only
     * works in some languages.
     */
    // TODO(floitsch): document better. (See EcmaScript for description).
    @Abstract
    toUpperCase(): string {
        throw 'abstract';
    }

    allMatches(string: string, start?: int): DartIterable<DartMatch> {
        return undefined;
    }

    compareTo(other: DartComparable<DartString>): int {
        return undefined;
    }

    matchAsPrefix(string: string, start?: int): DartMatch {
        return undefined;
    }


    static _stringFromJSArray(list: DartList<int>, start: int, endOrNull: int): DartString {
        let len = list.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        if (start > 0 || end < len) {
            list = list.sublist(start, end);
        }
        return new DartString(DartPrimitives.stringFromCharCodes(list));
    }

    static _stringFromUint8List(
        charCodes: Array<int>, start: int, endOrNull: int): DartString {
        let len = charCodes.length;
        let end = RangeError.checkValidRange(start, endOrNull, len);
        return new DartString(DartPrimitives.stringFromNativeUint8List(charCodes, start, end));
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
        return new DartString(DartPrimitives.stringFromCharCodes(list));
    }

}

/**
 * The runes (integer Unicode code points) of a [String].
 */
class DartRunes extends DartIterable<int> {
    _string: string;

    constructor(_string: string) {
        super();
    }

    get iterator(): DartRuneIterator {
        return new DartRuneIterator(this._string);
    }

    get last(): int {
        if (this._string.length == 0) {
            throw new StateError('No elements.');
        }
        let length = this._string.length;
        let code = new DartString(this._string).codeUnitAt(length - 1);
        if (_isTrailSurrogate(code) && this._string.length > 1) {
            let previousCode = new DartString(this._string).codeUnitAt(length - 2);
            if (_isLeadSurrogate(previousCode)) {
                return _combineSurrogatePair(previousCode, code);
            }
        }
        return code;
    }
}

// Is then code (a 16-bit unsigned integer) a UTF-16 lead surrogate.
const _isLeadSurrogate = (code: int): bool => (code & 0xFC00) == 0xD800;

// Is then code (a 16-bit unsigned integer) a UTF-16 trail surrogate.
const _isTrailSurrogate = (code: int): bool => (code & 0xFC00) == 0xDC00;

// Combine a lead and a trail surrogate value into a single code point.
const _combineSurrogatePair = (start: int, end: int): int => {
    return 0x10000 + ((start & 0x3FF) << 10) + (end & 0x3FF);
};

/** [Iterator] for reading runes (integer Unicode code points) out of a Dart
 * string.
 */
@DartClass
class DartRuneIterator implements DartBidirectionalIterator<int> {
    /** String being iterated. */
    _string: DartString;
    /** Position before the current code point. */
    _position: int;
    /** Position after the current code point. */
    _nextPosition: int;
    /**
     * Current code point.
     *
     * If the iterator has hit either end, the [_currentCodePoint] is null
     * and [: _position == _nextPosition :].
     */
    _currentCodePoint: int;

    /** Create an iterator positioned at the beginning of the string. */
    constructor(_string: string) {
        this._string = new DartString(_string);
        this._position = 0;
        this._nextPosition = 0;
    }

    /**
     * Create an iterator positioned before the [index]th code unit of the string.
     *
     * When created, there is no [current] value.
     * A [moveNext] will use the rune starting at [index] the current value,
     * and a [movePrevious] will use the rune ending just before [index] as the
     * the current value.
     *
     * The [index] position must not be in the middle of a surrogate pair.
     */
    @namedConstructor
    protected at(_string: string, index: int) {
        this._string = new DartString(_string);
        this._position = index;
        this._nextPosition = index;
        RangeError.checkValueInInterval(index, 0, _string.length);
        this._checkSplitSurrogate(index);
    }

    static at: new(_string: string, index: int) => DartRuneIterator;

    /** Throw an error if the index is in the middle of a surrogate pair. */
    _checkSplitSurrogate(index: int): void {
        if (index > 0 &&
            index < this._string.length &&
            _isLeadSurrogate(this._string.codeUnitAt(index - 1)) &&
            _isTrailSurrogate(this._string.codeUnitAt(index))) {
            throw new ArgumentError('Index inside surrogate pair: $index');
        }
    }

    /**
     * Returns the starting position of the current rune in the string.
     *
     * Returns null if the [current] rune is null.
     */
    get rawIndex(): int {
        return (/*this,*/ this._position != this._nextPosition) ? this._position : null;
    }

    /**
     * Resets the iterator to the rune at the specified index of the string.
     *
     * Setting a negative [rawIndex], or one greater than or equal to
     * [:string.length:],
     * is an error. So is setting it in the middle of a surrogate pair.
     *
     * Setting the position to the end of then string will set [current] to null.
     */
    set rawIndex(rawIndex: int) {
        RangeError.checkValidIndex(rawIndex, this._string, "rawIndex");
        this.reset(rawIndex);
        this.moveNext();
    }

    /**
     * Resets the iterator to the given index into the string.
     *
     * After this the [current] value is unset.
     * You must call [moveNext] make the rune at the position current,
     * or [movePrevious] for the last rune before the position.
     *
     * Setting a negative [rawIndex], or one greater than [:string.length:],
     * is an error. So is setting it in the middle of a surrogate pair.
     */
    reset(rawIndex?: int): void {
        rawIndex = nullOr(rawIndex, 0);
        RangeError.checkValueInInterval(rawIndex, 0, this._string.length, "rawIndex");
        this._checkSplitSurrogate(rawIndex);
        this._position = this._nextPosition = rawIndex;
        this._currentCodePoint = null;
    }

    /** The rune (integer Unicode code point) starting at the current position in
     *  the string.
     */
    get current(): int {
        return this._currentCodePoint;
    }

    /**
     * The number of code units comprising the current rune.
     *
     * Returns zero if there is no current rune ([current] is null).
     */
    get currentSize(): int {
        return this._nextPosition - this._position;
    }

    /**
     * A string containing the current rune.
     *
     * For runes outside the basic multilingual plane, this will be
     * a String of length 2, containing two code units.
     *
     * Returns null if [current] is null.
     */
    get currentAsString(): string {
        if (this._position == this._nextPosition) return null;
        if (this._position + 1 == this._nextPosition) return this._string.charAt(this._position);
        return this._string.substring(this._position, this._nextPosition);
    }

    moveNext(): bool {
        this._position = this._nextPosition;
        if (this._position == this._string.length) {
            this._currentCodePoint = null;
            return false;
        }
        let codeUnit = this._string.codeUnitAt(this._position);
        let nextPosition = this._position + 1;
        if (_isLeadSurrogate(codeUnit) && nextPosition < this._string.length) {
            let nextCodeUnit = this._string.codeUnitAt(nextPosition);
            if (_isTrailSurrogate(nextCodeUnit)) {
                this._nextPosition = nextPosition + 1;
                this._currentCodePoint = _combineSurrogatePair(codeUnit, nextCodeUnit);
                return true;
            }
        }
        this._nextPosition = nextPosition;
        this._currentCodePoint = codeUnit;
        return true;
    }

    movePrevious(): bool {
        this._nextPosition = this._position;
        if (this._position == 0) {
            this._currentCodePoint = null;
            return false;
        }
        let position = this._position - 1;
        let codeUnit = this._string.codeUnitAt(position);
        if (_isTrailSurrogate(codeUnit) && position > 0) {
            let prevCodeUnit = this._string.codeUnitAt(position - 1);
            if (_isLeadSurrogate(prevCodeUnit)) {
                this._position = position - 1;
                this._currentCodePoint = _combineSurrogatePair(prevCodeUnit, codeUnit);
                return true;
            }
        }
        this._position = position;
        this._currentCodePoint = codeUnit;
        return true;
    }

    next(value?: any): IteratorResult<int> {
        return {
            done: !this.moveNext(),
            value: this.current
        }
    }
}

/**
 * The interceptor class for [String]. The compiler recognizes this
 * class as an interceptor, and changes references to [:this:] to
 * actually use the receiver of the method, which is generated as an extra
 * argument added to each member.
 */
@DartClass
@Implements(DartString)
class JSString extends String implements DartString, JSIndexable<string> {
    constructor(s: string) {
        super(s);
    }

    equals(other) {
        return this == other;
    }


    codeUnitAt(index: int): int {
        if (isNot(index, 'int')) throw diagnoseIndexError(this, index);
        if (index < 0) throw diagnoseIndexError(this, index);
        return this._codeUnitAt(index);
    }

    _codeUnitAt(index: int): int {
        if (index >= length) throw diagnoseIndexError(this, index);
        return super.charCodeAt(index) /* JS('JSUInt31', r'#.charCodeAt(#)', this, index)*/;
    }

    allMatches(string: string, start?: int): DartIterable<DartMatch> {
        start = nullOr(start, 0);
        checkString(string);
        checkInt(start);
        if (0 > start || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        return allMatchesInStringUnchecked(this, string, start);
    }

    matchAsPrefix(string: string, start?: int): DartMatch {
        start = nullOr(start, 0);
        if (start < 0 || start > string.length) {
            throw new RangeError.range(start, 0, string.length);
        }
        if (start + this.length > string.length) return null;
        // TODO(lrn): See if this can be optimized.
        for (let i = 0; i < this.length; i++) {
            if (new DartString(string).codeUnitAt(start + i) != this.codeUnitAt(i)) {
                return null;
            }
        }
        return new DartStringMatch(start, string, this);
    }

    @Operator(Op.PLUS)
    concat(other: string): string {
        if (isNot(other, 'string')) throw new ArgumentError.value(other);
        return this + other;
        /* JS('String', r'# + #', this, other)*/

    }

    endsWith(other: string): bool {
        checkString(other);
        let otherLength = other.length;
        if (otherLength > length) return false;
        return other == this.substring(length - otherLength);
    }

    replaceAll(from: DartPattern, to: string): string {
        checkString(to);
        return stringReplaceAllUnchecked(this.valueOf(), from, to);
    }

    replaceAllMapped(from: DartPattern, convert: (match: DartMatch) => string): string {
        return this.splitMapJoin(from, {onMatch: convert});
    }

    splitMapJoin(from: DartPattern,
                 _?: { onMatch?: (match: DartMatch) => string, onNonMatch?: (nonMatch: string) => string }): string {

        let {onMatch, onNonMatch} = Object.assign({}, _);
        return stringReplaceAllFuncUnchecked(this.valueOf(), from, onMatch, onNonMatch);
    }

    replaceFirst(from: DartPattern, to: string, startIndex?: int): string {
        startIndex = nullOr(startIndex, 0);
        checkString(to);
        checkInt(startIndex);
        RangeError.checkValueInInterval(startIndex, 0, this.length, "startIndex");
        return stringReplaceFirstUnchecked(this.valueOf(), from, to, startIndex);
    }

    replaceFirstMapped(from: DartPattern, replace: (match: DartMatch) => string,
                       startIndex?: int): string {
        startIndex = nullOr(startIndex, 0);
        checkNull(replace);
        checkInt(startIndex);
        RangeError.checkValueInInterval(startIndex, 0, this.length, "startIndex");
        return stringReplaceFirstMappedUnchecked(this.valueOf(), from, replace, startIndex);
    }

    // TODO : add Symbol.split to DartPattern as well as the other (search,replace, ecc.)
    split(...args: any[]): any
    split(pattern: DartPattern): DartList<string> {
        // handle default case
        if (pattern[Symbol.split] != null) return new DartList.fromArray<string>(super.split(pattern as any));
        checkNull(pattern);
        if (is(pattern, DartString)) {
            return new DartList.fromArray(super.split(pattern as any)) /*JS('JSExtendableArray', r'#.split(#)', this, pattern)*/;
        } else if (is(pattern, JSSyntaxRegExp) && regExpCaptureCount(pattern as any) == 0) {
            let re = regExpGetNative(pattern as any);
            return new DartList.fromArray(super.split(re)) /*JS('JSExtendableArray', r'#.split(#)', this, re)*/;
        } else {
            return this._defaultSplit(pattern);
        }
    }

    replaceRange(start: int, end: int, replacement: string): string {
        checkString(replacement);
        checkInt(start);
        end = RangeError.checkValidRange(start, end, this.length);
        checkInt(end);
        return stringReplaceRangeUnchecked(this.valueOf(), start, end, replacement);
    }

    _defaultSplit(pattern: DartPattern): DartList<string> {
        let result = new DartList<string>();
        // End of most recent match. That is, start of next part to add to result.
        let start = 0;
        // Length of most recent match.
        // Set >0, so no match on the empty string causes the result to be [""].
        let length = 1;
        for (let match of pattern.allMatches(this.valueOf())) {
            let matchStart = match.start;
            let matchEnd = match.end;
            length = matchEnd - matchStart;
            if (length == 0 && start == matchStart) {
                // An empty match right after another match is ignored.
                // This includes an empty match at the start of the string.
                continue;
            }
            let end = matchStart;
            result.add(this.substring(start, end));
            start = matchEnd;
        }
        if (start < this.length || length > 0) {
            // An empty match at the end of the string does not cause a "" at the end.
            // A non-empty match ending at the end of the string does add a "".
            result.add(this.substring(start));
        }
        return result;
    }

    startsWith(pattern: DartPattern | string, index?: int): bool {
        index = nullOr(index, 0);
        checkInt(index);
        if (index < 0 || index > this.length) {
            throw new RangeError.range(index, 0, this.length);
        }
        if (is(pattern, DartString) || is(pattern, 'string')) {
            let other: DartString = pattern as DartString;
            let otherLength = other.length;
            let endIndex = index + otherLength;
            if (endIndex > length) return false;
            // this should work because of the way js handles == ... maybe
            return other.valueOf() == super.substring(index, endIndex) /*JS('String', r'#.substring(#, #)', this, index, endIndex)*/;
        }
        return (pattern as DartPattern).matchAsPrefix(this.valueOf(), index) != null;
    }

    substring(startIndex: int, endIndex?: int): string {
        checkInt(startIndex);
        if (endIndex == null) endIndex = length;
        checkInt(endIndex);
        if (startIndex < 0) throw new RangeError.value(startIndex);
        if (startIndex > endIndex) throw new RangeError.value(startIndex);
        if (endIndex > length) throw new RangeError.value(endIndex);
        return super.substring(startIndex, endIndex) /*JS('String', r'#.substring(#, #)', this, startIndex, endIndex)*/;
    }

    toLowerCase(): string {
        return super.toLowerCase() /* JS('returns:String;effects:none;depends:none;throws:null(1)',
        r'#.toLowerCase()', this)*/;
    }

    toUpperCase(): string {
        return super.toUpperCase()
        /*JS('returns:String;effects:none;depends:none;throws:null(1)',
               r'#.toUpperCase()', this);*/
    }

    // Characters with Whitespace property (Unicode 6.3).
    // 0009..000D    ; White_Space # Cc       <control-0009>..<control-000D>
    // 0020          ; White_Space # Zs       SPACE
    // 0085          ; White_Space # Cc       <control-0085>
    // 00A0          ; White_Space # Zs       NO-BREAK SPACE
    // 1680          ; White_Space # Zs       OGHAM SPACE MARK
    // 2000..200A    ; White_Space # Zs       EN QUAD..HAIR SPACE
    // 2028          ; White_Space # Zl       LINE SEPARATOR
    // 2029          ; White_Space # Zp       PARAGRAPH SEPARATOR
    // 202F          ; White_Space # Zs       NARROW NO-BREAK SPACE
    // 205F          ; White_Space # Zs       MEDIUM MATHEMATICAL SPACE
    // 3000          ; White_Space # Zs       IDEOGRAPHIC SPACE
    //
    // BOM: 0xFEFF
    static _isWhitespace(codeUnit: int): bool {
        // Most codeUnits should be less than 256. Special case with a smaller
        // switch.
        if (codeUnit < 256) {
            switch (codeUnit) {
                case 0x09:
                case 0x0A:
                case 0x0B:
                case 0x0C:
                case 0x0D:
                case 0x20:
                case 0x85:
                case 0xA0:
                    return true;
                default:
                    return false;
            }
        }
        switch (codeUnit) {
            case 0x1680:
            case 0x2000:
            case 0x2001:
            case 0x2002:
            case 0x2003:
            case 0x2004:
            case 0x2005:
            case 0x2006:
            case 0x2007:
            case 0x2008:
            case 0x2009:
            case 0x200A:
            case 0x2028:
            case 0x2029:
            case 0x202F:
            case 0x205F:
            case 0x3000:
            case 0xFEFF:
                return true;
            default:
                return false;
        }
    }

    /// Finds the index of the first non-whitespace character, or the
    /// end of the string. Start looking at position [index].
    static _skipLeadingWhitespace(string: DartString, index: int): int {
        const SPACE = 0x20;
        const CARRIAGE_RETURN = 0x0D;
        while (index < string.length) {
            let codeUnit = string.codeUnitAt(index);
            if (codeUnit != SPACE &&
                codeUnit != CARRIAGE_RETURN &&
                !JSString._isWhitespace(codeUnit)) {
                break;
            }
            index++;
        }
        return index;
    }

    /// Finds the index after the last non-whitespace character, or 0.
    /// Start looking at position [index - 1].
    static _skipTrailingWhitespace(string: DartString, index: int): int {
        const SPACE = 0x20;
        const CARRIAGE_RETURN = 0x0D;
        while (index > 0) {
            let codeUnit = string.codeUnitAt(index - 1);
            if (codeUnit != SPACE &&
                codeUnit != CARRIAGE_RETURN &&
                !JSString._isWhitespace(codeUnit)) {
                break;
            }
            index--;
        }
        return index;
    }

    // Dart2js can't use JavaScript trim directly,
    // because JavaScript does not trim
    // the NEXT LINE (NEL) character (0x85).
    trim(): string {
        const NEL = 0x85;

        // Start by doing JS trim. Then check if it leaves a NEL at
        // either end of the string.
        let result: DartString = new DartString(super.trim()) /* JS('String', '#.trim()', this)*/;
        if (result.length == 0) return result.valueOf();
        let firstCode = result.codeUnitAt(0);
        let startIndex = 0;
        if (firstCode == NEL) {
            startIndex = JSString._skipLeadingWhitespace(result, 1);
            if (startIndex == result.length) return "";
        }

        let endIndex = result.length;
        // We know that there is at least one character that is non-whitespace.
        // Therefore we don't need to verify that endIndex > startIndex.
        let lastCode = result.codeUnitAt(endIndex - 1);
        if (lastCode == NEL) {
            endIndex = JSString._skipTrailingWhitespace(result, endIndex - 1);
        }
        if (startIndex == 0 && endIndex == result.length) return result.valueOf();
        return result.valueOf().substring(startIndex, endIndex) /* JS('String', r'#.substring(#, #)', result, startIndex, endIndex)*/;
    }

    // Dart2js can't use JavaScript trimLeft directly,
    // because it is not in ES5, so not every browser implements it,
    // and because those that do will not trim the NEXT LINE character (0x85).
    trimLeft(): string {
        const NEL = 0x85;

        // Start by doing JS trim. Then check if it leaves a NEL at
        // the beginning of the string.
        let result: DartString;
        let startIndex = 0;
        /*if (JS('bool', 'typeof #.trimLeft != "undefined"', this)) {
            result = JS('String', '#.trimLeft()', this);
            if (result.length == 0) return result;
            int firstCode = result.codeUnitAt(0);
            if (firstCode == NEL) {
                startIndex = _skipLeadingWhitespace(result, 1);
            }
        } else {*/
        result = this;
        startIndex = JSString._skipLeadingWhitespace(this, 0);
        /*}*/
        if (startIndex == 0) return result.valueOf();
        if (startIndex == result.length) return "";
        return result.substring(startIndex) /* JS('String', r'#.substring(#)', result, startIndex)*/;
    }

    // Dart2js can't use JavaScript trimRight directly,
    // because it is not in ES5 and because JavaScript does not trim
    // the NEXT LINE character (0x85).
    trimRight(): string {
        const NEL = 0x85;

        // Start by doing JS trim. Then check if it leaves a NEL or BOM at
        // the end of the string.
        let result: DartString;
        let endIndex: int;
        // trimRight is implemented by Firefox and Chrome/Blink,
        // so use it if it is there.
        /*if (JS('bool', 'typeof #.trimRight != "undefined"', this)) {
            result = JS('String', '#.trimRight()', this);
            endIndex = result.length;
            if (endIndex == 0) return result;
            int lastCode = result.codeUnitAt(endIndex - 1);
            if (lastCode == NEL) {
                endIndex = _skipTrailingWhitespace(result, endIndex - 1);
            }
        } else {*/
        result = this;
        endIndex = JSString._skipTrailingWhitespace(this, this.length);
        // }

        if (endIndex == result.length) return result.valueOf();
        if (endIndex == 0) return "";
        return result.substring(0, endIndex)/*JS('String', r'#.substring(#, #)', result, 0, endIndex)*/;
    }

    repeat(times: int): string {
        return super.repeat(times);
        /*
    if (0 >= times) return ''; // Unnecessary but hoists argument type check.
    if (times == 1 || this.length == 0) return this;
    if (times != JS('JSUInt32', '# >>> 0', times)) {
        // times >= 2^32. We can't create a string that big.
        throw const OutOfMemoryError();
    }
    var result = '';
    var s = this;
    while (true) {
        if (times & 1 == 1) result = s + result;
        times = JS('JSUInt31', '# >>> 1', times);
        if (times == 0) break;
        s += s;
    }
    return result;*/
    }

    padLeft(width: int, padding?: string /*= ' '*/): string {
        padding = nullOr(padding, ' ');
        let delta = width - this.length;
        if (delta <= 0) return this.valueOf();
        return padding.repeat(delta) + this;
    }

    padRight(width: int, padding?: string /*= ' '*/): string {
        let delta = width - this.length;
        if (delta <= 0) return this.valueOf();
        return this + padding.repeat(delta);
    }

    get codeUnits(): DartList<int> {
        return new DartCodeUnits(this);
    }

    get runes(): DartRunes {
        return new DartRunes(this.valueOf());
    }

    indexOf(...args: any[]): any;
    indexOf(pattern: DartPattern | string, start?: int): int {
        start = nullOr(start, 0);
        checkNull(pattern);
        if (isNot(start, 'int')) throw argumentErrorValue(start);
        if (start < 0 || start > this.length) {
            throw new RangeError.range(start, 0, this.length);
        }
        if (is(pattern, 'string')) {
            return stringIndexOfStringUnchecked(this.valueOf(), pattern as string, start);
        }
        if (is(pattern, JSSyntaxRegExp)) {
            let re: JSSyntaxRegExp = pattern as any;
            let match: DartMatch = firstMatchAfter(re, this.valueOf(), start);
            return (match == null) ? -1 : match.start;
        }
        for (let i = start; i <= this.length; i++) {
            if ((pattern as DartPattern).matchAsPrefix(this.valueOf(), i) != null) return i;
        }
        return -1;
    }

    lastIndexOf(...args: any[]): any;
    lastIndexOf(pattern: DartPattern | string, start?: int): int {
        checkNull(pattern);
        if (start == null) {
            start = length;
        } else if (isNot(start, 'int')) {
            throw argumentErrorValue(start);
        } else if (start < 0 || start > this.length) {
            throw new RangeError.range(start, 0, this.length);
        }
        if (is(pattern, 'string')) {
            let other: string = pattern as string;
            if (start + other.length > this.length) {
                start = this.length - other.length;
            }
            return stringLastIndexOfUnchecked(this.valueOf(), other, start);
        }
        for (let i = start; i >= 0; i--) {
            if ((pattern as DartPattern).matchAsPrefix(this.valueOf(), i) != null) return i;
        }
        return -1;
    }

    contains(other: DartPattern, startIndex?: int): bool {
        startIndex = nullOr(startIndex, 0);
        checkNull(other);
        if (startIndex < 0 || startIndex > this.length) {
            throw new RangeError.range(startIndex, 0, this.length);
        }
        return stringContainsUnchecked(this, other, startIndex);
    }

    get isEmpty(): bool {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    compareTo(other: DartComparable<DartString>): int {
        if (isNot(other, 'string')) throw argumentErrorValue(other);
        return this == other ? 0 : this < other /*JS('bool', r'# < #', this, other)*/ ? -1 : 1;
    }

    // Note: if you change this, also change the function [S].
    toString(): string {
        return this.valueOf();
    }

    /**
     * This is the [Jenkins hash function][1] but using masking to keep
     * values in SMI range.
     *
     * [1]: http://en.wikipedia.org/wiki/Jenkins_hash_function
     */
    get hashCode(): int {
        // TODO(ahe): This method shouldn't have to use JS. Update when our
        // optimizations are smarter.
        let hash = 0;
        for (let i = 0; i < length; i++) {
            hash = 0x1fffffff & (hash + this.charCodeAt(i) /* JS('int', r'#.charCodeAt(#)', this, i)*/);
            hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
            hash = hash ^ hash >> 6 /*JS('int', '# ^ (# >> 6)', hash, hash)*/;
        }
        hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
        hash = hash ^ hash >> 11 /*JS('int', '# ^ (# >> 11)', hash, hash)*/;
        return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
    }

    //get runtimeType:Type => String;

    //int get length => JS('int', r'#.length', this);

    charAt(index: int): string {
        if (isNot(index, 'int')) throw diagnoseIndexError(this, index);
        if (index >= length || index < 0) throw diagnoseIndexError(this, index);
        return super[index] /*JS('String', '#[#]', this, index)*/;
    }
}

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of _js_helper;

function stringIndexOfStringUnchecked(receiver: string, other: string, startIndex: int): int {
    return receiver.indexOf(other, startIndex) /* JS('int', '#.indexOf(#, #)', receiver, other, startIndex)*/;
}

function substring1Unchecked(receiver: string, startIndex: int): string {
    return receiver.substring(startIndex) /* JS('String', '#.substring(#)', receiver, startIndex)*/;
}

function substring2Unchecked(receiver: string, startIndex: int, endIndex: int): string {
    return receiver.substring(startIndex, endIndex) /*JS('String', '#.substring(#, #)', receiver, startIndex, endIndex)*/;
}

function stringContainsStringUnchecked(receiver: string, other: string, startIndex: int) {
    return stringIndexOfStringUnchecked(receiver, other, startIndex) >= 0;
}

class DartStringMatch implements DartMatch {
    constructor(start: int, input: string, pattern: DartString) {
        this.start = start;
        this.input = input;
        this.pattern = pattern;
    }

    get end(): int {
        return this.start + this.pattern.length;
    }

    get groupCount(): int {
        return 0;
    }

    @Operator(Op.INDEX)
    group(group_: int): string {
        if (group_ != 0) {
            throw new RangeError.value(group_);
        }
        return this.pattern.valueOf();
    }

    groups(groups_: DartList<int>): DartList<string> {
        let result = new DartList<string>();
        for (let g of groups_) {
            result.add(this.group(g));
        }
        return result;
    }

    start: int;
    input: string;
    pattern: DartString;
}

function allMatchesInStringUnchecked(
    pattern: DartString, string: string, startIndex: int): DartIterable<DartMatch> {
    return new _StringAllMatchesIterable(string, pattern, startIndex);
}

class _StringAllMatchesIterable extends DartIterable<DartMatch> {
    _input: string;
    _pattern: DartString;
    _index: int;

    constructor(_input: string, _pattern: DartString, _index: int) {
        super();
        this._input = _input;
        this._pattern = _pattern;
        this._index = _index;
    }

    get iterator(): DartIterator<DartMatch> {
        return new _StringAllMatchesIterator(this._input, this._pattern, this._index);
    }

    get first(): DartMatch {
        let index = stringIndexOfStringUnchecked(this._input, this._pattern.valueOf(), this._index);
        if (index >= 0) {
            return new DartStringMatch(index, this._input, this._pattern);
        }
        throw DartIterableElementError.noElement();
    }
}

class _StringAllMatchesIterator implements DartIterator<DartMatch> {
    _input: string;
    _pattern: DartString;
    _index: int;
    _current: DartMatch;

    constructor(_input: string, _pattern: DartString, _index: int) {
        this._input = _input;
        this._pattern = _pattern;
        this._index = _index;
    }

    moveNext(): bool {
        if (this._index + this._pattern.length > this._input.length) {
            this._current = null;
            return false;
        }
        let index = stringIndexOfStringUnchecked(this._input, this._pattern.valueOf(), this._index);
        if (index < 0) {
            this._index = this._input.length + 1;
            this._current = null;
            return false;
        }
        let end = index + this._pattern.length;
        this._current = new DartStringMatch(index, this._input, this._pattern);
        // Empty match, don't start at same location again.
        if (end == this._index) end++;
        this._index = end;
        return true;
    }

    get current(): DartMatch {
        return this._current;
    }

    next(value?: any): IteratorResult<DartMatch> {
        return {
            done: !this.moveNext(),
            value: this.current
        };
    }
}

function stringContainsUnchecked(receiver, other, startIndex) {
    if (is(other, 'string')) {
        return stringContainsStringUnchecked(receiver, other, startIndex);
    } else if (is(other, JSSyntaxRegExp)) {
        return other.hasMatch(receiver.substring(startIndex));
    } else {
        let substr = receiver.substring(startIndex);
        return other.allMatches(substr).isNotEmpty;
    }
}

function stringReplaceJS(receiver: string, replacer: RegExp, replacement: string): string {
    // The JavaScript String.replace method recognizes replacement
    // patterns in the replacement string. Dart does not have that
    // behavior.
    replacement = replacement.replace(/$/g, "$$$$")/*JS('String', r'#.replace(/\$/g, "$$$$")', replacement)*/;
    return receiver.replace(replacer, replacement)/* JS('String', r'#.replace(#, #)', receiver, replacer, replacement)*/;
}

function stringReplaceFirstRE(receiver: string, regexp: JSSyntaxRegExp, replacement: string, startIndex: int): string {
    let match = regexp._execGlobal(receiver, startIndex);
    if (match == null) return receiver;
    let start = match.start;
    let end = match.end;
    return stringReplaceRangeUnchecked(receiver, start, end, replacement);
}

/// Returns a string for a RegExp pattern that matches [string]. This is done by
/// escaping all RegExp metacharacters.
function quoteStringForRegExp(string: string) {
    const pattern: string = "[[]{}()*+?.\\^$|]";
    return string.replace(new RegExp(pattern, "g"), "\$&")/* JS('String', r'#.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&")', string)*/;
}

function stringReplaceAllUnchecked(receiver: string, pattern: string | JSSyntaxRegExp | DartPattern, replacement): string {
    checkString(replacement);
    if (is(pattern, 'string')) {
        if (pattern == "") {
            if (receiver == "") {
                return replacement /*JS('String', '#', replacement)*/; // help type inference.
            } else {
                let result = new DartStringBuffer('');
                let length = receiver.length;
                result.write(replacement);
                for (let i = 0; i < length; i++) {
                    result.write(receiver[i]);
                    result.write(replacement);
                }
                return result.toString();
            }
        } else {
            let quoted = quoteStringForRegExp(pattern as string);
            let replacer = new RegExp(quoted, 'g') /*JS('', "new RegExp(#, 'g')", quoted)*/;
            return stringReplaceJS(receiver, replacer, replacement);
        }
    } else if (is(pattern, JSSyntaxRegExp)) {
        let re = regExpGetGlobalNative(pattern as JSSyntaxRegExp);
        return stringReplaceJS(receiver, re, replacement);
    } else {
        checkNull(pattern);
        // TODO(floitsch): implement generic String.replace (with patterns).
        throw "String.replaceAll(Pattern) UNIMPLEMENTED";
    }
}

function _matchString(match: DartMatch): string {
    return match.group(0);
}

function _stringIdentity(string: string): string {
    return string;
}

function stringReplaceAllFuncUnchecked(receiver: string, pattern: string | DartPattern, onMatch, onNonMatch) {
    if (onMatch == null) onMatch = _matchString;
    if (onNonMatch == null) onNonMatch = _stringIdentity;
    if (is(pattern, 'string')) {
        return stringReplaceAllStringFuncUnchecked(
            receiver, new DartString(pattern as string), onMatch, onNonMatch);
    }
    // Placing the Pattern test here is indistingishable from placing it at the
    // top of the method but it saves an extra check on the `pattern is String`
    // path.
    if (isNot(pattern, DartPattern)) {
        throw new ArgumentError.value(pattern, 'pattern', 'is not a Pattern');
    }
    let buffer = new DartStringBuffer('');
    let startIndex = 0;
    for (let match of (pattern as DartPattern).allMatches(receiver)) {
        buffer.write(onNonMatch(receiver.substring(startIndex, match.start)));
        buffer.write(onMatch(match));
        startIndex = match.end;
    }
    buffer.write(onNonMatch(receiver.substring(startIndex)));
    return buffer.toString();
}

function stringReplaceAllEmptyFuncUnchecked(receiver: DartString, onMatch, onNonMatch) {
    // Pattern is the empty string.
    let buffer = new DartStringBuffer('');
    let length = receiver.length;
    let i = 0;
    buffer.write(onNonMatch(""));
    while (i < length) {
        buffer.write(onMatch(new DartStringMatch(i, receiver.valueOf(), new DartString(""))));
        // Special case to avoid splitting a surrogate pair.
        let code = receiver.codeUnitAt(i);
        if ((code & ~0x3FF) == 0xD800 && length > i + 1) {
            // Leading surrogate;
            code = receiver.codeUnitAt(i + 1);
            if ((code & ~0x3FF) == 0xDC00) {
                // Matching trailing surrogate.
                buffer.write(onNonMatch(receiver.substring(i, i + 2)));
                i += 2;
                continue;
            }
        }
        buffer.write(onNonMatch(receiver[i]));
        i++;
    }
    buffer.write(onMatch(new DartStringMatch(i, receiver.valueOf(), new DartString(""))));
    buffer.write(onNonMatch(""));
    return buffer.toString();
}

function stringReplaceAllStringFuncUnchecked(receiver: string, pattern: DartString, onMatch, onNonMatch) {
    let patternLength = pattern.length;
    if (patternLength == 0) {
        return stringReplaceAllEmptyFuncUnchecked(new DartString(receiver), onMatch, onNonMatch);
    }
    let length = receiver.length;
    let buffer = new DartStringBuffer('');
    let startIndex = 0;
    while (startIndex < length) {
        let position = stringIndexOfStringUnchecked(receiver, pattern.valueOf(), startIndex);
        if (position == -1) {
            break;
        }
        buffer.write(onNonMatch(receiver.substring(startIndex, position)));
        buffer.write(onMatch(new DartStringMatch(position, receiver, pattern)));
        startIndex = position + patternLength;
    }
    buffer.write(onNonMatch(receiver.substring(startIndex)));
    return buffer.toString();
}

function stringReplaceFirstUnchecked(receiver: string, pattern: string | JSSyntaxRegExp | DartPattern, replacement: string, startIndex: int): string {
    if (is(pattern, 'string')) {
        let index = stringIndexOfStringUnchecked(receiver, pattern as  string, startIndex);
        if (index < 0) return receiver;
        let end = index + (pattern as string).length;
        return stringReplaceRangeUnchecked(receiver, index, end, replacement);
    }
    if (is(pattern, JSSyntaxRegExp)) {
        return startIndex == 0
            ? stringReplaceJS(receiver, regExpGetNative(pattern as any as JSSyntaxRegExp), replacement)
            : stringReplaceFirstRE(receiver, pattern as any  as JSSyntaxRegExp, replacement, startIndex);
    }
    checkNull(pattern);
    let matches = (pattern as DartPattern).allMatches(receiver, startIndex).iterator;
    if (!matches.moveNext()) return receiver;
    let match = matches.current;
    return new DartString(receiver).replaceRange(match.start, match.end, replacement);
}

function stringReplaceFirstMappedUnchecked(receiver: string, pattern: DartPattern, replace, startIndex: int): string {
    let matches: DartIterator<DartMatch> = pattern.allMatches(receiver, startIndex).iterator;
    if (!matches.moveNext()) return receiver;
    let match = matches.current;
    let replacement = `${replace(match)}`;
    return new DartString(receiver).replaceRange(match.start, match.end, replacement);
}

function stringJoinUnchecked(array: Array<any>, separator: string): string {
    return array.join(separator)/*   JS('String', r'#.join(#)', array, separator)*/;
}

function stringReplaceRangeUnchecked(
    receiver: string, start: int, end: int, replacement: string): string {
    var prefix = receiver.substring(0, start) /* JS('String', '#.substring(0, #)', receiver, start)*/;
    var suffix = receiver.substring(end) /* JS('String', '#.substring(#)', receiver, end)*/;
    return `${prefix}${replacement}${suffix}`;
}

function stringLastIndexOfUnchecked(receiver: string, element: string, start: int): int {
    return receiver.lastIndexOf(element, start) /*JS('int', r'#.lastIndexOf(#, #)', receiver, element, start)*/;
}


/**
 * An [Iterable] of the UTF-16 code units of a [String] in index order.
 */
class DartCodeUnits extends DartUnmodifiableListBase<int> {
    /** The string that this is the code units of. */
    _string: DartString;

    constructor(_string: DartString) {
        super();
        this._string = _string;
    }


    get length(): int {
        return this._string.length;
    }

    @Operator(Op.INDEX)
    elementAt(i: int) {
        return this._string.codeUnitAt(i);
    }

    static stringOf(u: DartCodeUnits): DartString {
        return u._string;
    }
}

export {
    DartString,
    JSString,
    DartStringMatch
}
