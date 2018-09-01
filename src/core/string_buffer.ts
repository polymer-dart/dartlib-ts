// Copyright (c) 2011, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.core;

import {DartClass, defaultConstructor} from "../utils";
import {DartStringSink} from "./string_sink";
import {bool, DartObject, int} from "../core";
import {DartIterable} from "../collections";
import {DartPrimitives} from "../native/js_helper";
import {DartString} from '../string';

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

    constructor(content?: any) {

    }

    /**
     * Returns the length of the content that has been accumulated so far.
     * This is a constant-time operation.
     */

    /*external*/

    /*
    get length(): int {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
        return undefined;
    }*/

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
    /*
    write(obj: DartObject): void {
        // TODO : IMPLEMENT EXTERNAL USING PATCH
    }*/

    /// Adds the string representation of [charCode] to the buffer.
    /* external */

    /**
     * Clears the string buffer.
     */


    /// Returns the contents of buffer as a concatenated string.
    /* external */

    _contents: string;

    //@patch
    @defaultConstructor
    create(content: any /*  =""*/) {
        if (content === undefined) {
            content = '';
        }
        this._contents = `${content}`;
    }

    //@patch
    get length(): int {
        return this._contents.length;
    }

    //@patch
    write(obj: any): void {
        this._writeString(`${obj}`);
    }

    //@patch
    writeCharCode(charCode: int): void {
        this._writeString(new DartString.fromCharCode(charCode));
    }

    //@patch
    writeAll(objects: DartIterable<any>, separator?: string /* = ""*/): void {
        this._contents = DartStringBuffer._writeAll(this._contents, objects, separator);
    }

    //@patch
    writeln(obj?: any /* = ""*/): void {
        this._writeString(`${obj}\n`);
    }

    //@patch
    clear(): void {
        this._contents = "";
    }

    //@patch
    toString(): string {
        return DartPrimitives.flattenString(this._contents);
    }

    _writeString(str): void {
        this._contents = DartPrimitives.stringConcatUnchecked(this._contents, str);
    }

    protected static _writeAll(string: string, objects: DartIterable<any>, separator: string): string {
        let iterator = objects.iterator;
        if (!iterator.moveNext()) return string;
        if (new DartString(separator).isEmpty) {
            do {
                string = this._writeOne(string, iterator.current);
            } while (iterator.moveNext());
        } else {
            string = this._writeOne(string, iterator.current);
            while (iterator.moveNext()) {
                string = this._writeOne(string, separator);
                string = this._writeOne(string, iterator.current);
            }
        }
        return string;
    }

    protected static _writeOne(string: string, obj: any): string {
        return DartPrimitives.stringConcatUnchecked(string, `${obj}`);
    }
}
