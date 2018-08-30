// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.math;

import {Abstract, DartClass, defaultConstructor, defaultFactory, NamedFactory, namedFactory} from "../utils";
import {bool, double, int} from "../core";

/**
 * A generator of random bool, int, or double values.
 *
 * The default implementation supplies a stream of
 * pseudo-random bits that are not suitable for cryptographic purposes.
 *
 * Use the Random.secure() constructor for cryptographic
 * purposes.
 */
@DartClass
export class DartRandom {
    /**
     * Creates a random number generator.
     *
     * The optional parameter [seed] is used to initialize the
     * internal state of the generator. The implementation of the
     * random stream can change between releases of the library.
     */

    /* external */
    @defaultFactory
    protected static Random(seed?: int): DartRandom {
        return null;
    }

    constructor(seed?: int) {
    }

    /**
     * Creates a cryptographically secure random number generator.
     *
     * If the program cannot provide a cryptographically secure
     * source of random numbers, it throws an [UnsupportedError].
     */

    /* external */
    @NamedFactory('secure¶')
    protected static _secure(): DartRandom {
        return undefined;
    }

    static secure: new () => DartRandom;

    /**
     * Generates a non-negative random integer uniformly distributed in the range
     * from 0, inclusive, to [max], exclusive.
     *
     * Implementation note: The default implementation supports [max] values
     * between 1 and (1<<32) inclusive.
     */
    @Abstract
    nextInt(max: int): int {
        throw new Error('abstract');
    }

    /**
     * Generates a non-negative random floating point value uniformly distributed
     * in the range from 0.0, inclusive, to 1.0, exclusive.
     */
    @Abstract
    nextDouble(): double {
        throw new Error('abstract');
    }

    /**
     * Generates a random boolean value.
     */
    @Abstract
    nextBool(): bool {
        throw new Error('abstract');
    }
}
