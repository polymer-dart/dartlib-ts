// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.core;

import {DartObject, int} from "../core";
import {DartIterable} from '../collections';

export interface DartStringSink {
    /**
     * Converts [obj] to a String by invoking [Object.toString] and
     * adds the result to `this`.
     */
    write(obj: DartObject): void;

    /**
     * Iterates over the given [objects] and [write]s them in sequence.
     */
    writeAll(objects: DartIterable<any>, separator?: string /*  = "" */): void;

    /**
     * Converts [obj] to a String by invoking [Object.toString] and
     * adds the result to `this`, followed by a newline.
     */
    writeln(obj?: DartObject /*= ""*/): void;

    /**
     * Writes the [charCode] to `this`.
     *
     * This method is equivalent to `write(new String.fromCharCode(charCode))`.
     */
    writeCharCode(charCode: int): void;
}
