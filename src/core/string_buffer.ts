// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.core;

import {DartClass, defaultConstructor} from "../utils";
import {DartStringSink} from "./string_sink";
import {bool, DartObject, int} from "../core";
import {DartIterable} from "../collections";

/**
 * A class for concatenating strings efficiently.
 *
 * Allows for the incremental building of a string using write*() methods.
 * The strings are concatenated to a single string only when [toString] is
 * called.
 */
@DartClass
export class DartStringBuffer implements DartStringSink {
    /** Creates the string buffer with an initial content. */
    @defaultConstructor
    /*external*/
    protected StringBuffer(content?: any) {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    constructor(content?: any) {

    }

    /**
     * Returns the length of the content that has been accumulated so far.
     * This is a constant-time operation.
     */

    /*external*/
    get length(): int {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
        return undefined;
    }

    /** Returns whether the buffer is empty. This is a constant-time operation. */
    get isEmpty(): boolean {
        return this.length == 0;
    }

    /**
     * Returns whether the buffer is not empty. This is a constant-time
     * operation.
     */
    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    /// Adds the contents of [obj], converted to a string, to the buffer.
    /* external */
    write(obj: DartObject): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    /// Adds the string representation of [charCode] to the buffer.
    /* external */
    writeCharCode(charCode: int): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    /* external */
    writeAll(objects: DartIterable<any>, separator?: string /* = "" */): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    /* external */
    writeln(obj?: DartObject /* = ""*/): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    /**
     * Clears the string buffer.
     */

    /* external */
    clear(): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }

    /// Returns the contents of buffer as a concatenated string.
    /* external */
    toString(): string {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
        return undefined;
    }
}
