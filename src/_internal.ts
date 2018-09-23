import {RootProperty} from "./_common";
import {int} from "./utils";

/**
 * This function is set by the first allocation of a Zone.
 *
 * Once the function is set the core `print` function calls this closure instead
 * of [printToConsole].
 *
 * This decouples the core library from the async library.
 */

//@patch
function printToConsole(line: string) {
    printString(`${line}`);
}

/**
 * This is the low-level method that is used to implement [print].  It is
 * possible to override this function from JavaScript by defining a function in
 * JavaScript called "dartPrint".
 *
 * Notice that it is also possible to intercept calls to [print] from within a
 * Dart program using zones. This means that there is no guarantee that a call
 * to print ends in this method.
 */
// @ts-ignore
function printString(string: string): void {

    // Inside browser or nodejs.
    // @ts-ignore
    if ((typeof console == "object") &&
        (typeof console.log != "undefined")) {
        // @ts-ignore
        console.log(string);
        return;
    }

    // Don't throw inside IE, the console is only defined if dev tools is open.
    // @ts-ignore
    if (typeof window == "object") {
        return;
    }

    // Running in d8, the V8 developer shell, or in Firefox' js-shell.
    // @ts-ignore
    if (typeof print == "function") {
        // @ts-ignore
        print(string);
        return;
    }

    // This is somewhat nasty, but we don't want to drag in a bunch of
    // dependencies to handle a situation that cannot happen. So we
    // avoid using Dart [:throw:] and Dart [toString].
    throw "Unable to print message: " + string;
}

const printToZone = new RootProperty<Function>();

// Shared hex-parsing utilities.

/// Parses a single hex-digit as code unit.
///
/// Returns a negative value if the character is not a valid hex-digit.
function hexDigitValue(char:int):int {
    //assert(char >= 0 && char <= 0xFFFF);
    const digit0 = 0x30;
    const a = 0x61;
    const f = 0x66;
    let digit = char ^ digit0;
    if (digit <= 9) return digit;
    let letter = (char | 0x20);
    if (a <= letter && letter <= f) return letter - (a - 10);
    return -1;
}

function parseHexByte(source:string,  index:int):int {
    //assert(index + 2 <= source.length);
    let digit1 = hexDigitValue(source.charCodeAt(index));
    let digit2 = hexDigitValue(source.charCodeAt(index + 1));
    return digit1 * 16 + digit2 - (digit2 & 256);
}

export {
    printToZone,
    printToConsole,
    parseHexByte,
    hexDigitValue
}