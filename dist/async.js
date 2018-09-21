// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Future_1, _RootZone_1, DartZone_1, _Future_1, DartTimer_1, DartZoneSpecification_1, _PendingEvents_1, _DistinctStream_1, _ControllerStream_1;
//part of dart.async;
/// A type representing values that are either `Future<T>` or `T`.
///
/// This class declaration is a public stand-in for an internal
/// future-or-value generic type. References to this class are resolved to the
/// internal type.
///
/// It is a compile-time error for any class to extend, mix in or implement
/// `FutureOr`.
///
/// Note: the `FutureOr<T>` type is interpreted as `dynamic` in non strong-mode.
///
/// # Examples
/// ``` dart
/// // The `Future<T>.then` function takes a callback [f] that returns either
/// // an `S` or a `Future<S>`.
/// Future<S> then<S>(FutureOr<S> f(T x), ...);
///
/// // `Completer<T>.complete` takes either a `T` or `Future<T>`.
/// void complete(FutureOr<T> value);
/// ```
///
/// # Advanced
/// The `FutureOr<int>` type is actually the "type union" of the types `int` and
/// `Future<int>`. This type union is defined in such a way that
/// `FutureOr<Object>` is both a super- and sub-type of `Object` (sub-type
/// because `Object` is one of the types of the union, super-type because
/// `Object` is a super-type of both of the types of the union). Together it
/// means that `FutureOr<Object>` is equivalent to `Object`.
///
/// As a corollary, `FutureOr<Object>` is equivalent to
/// `FutureOr<FutureOr<Object>>`, `FutureOr<Future<Object>> is equivalent to
/// `Future<Object>`.
import { ArgumentError, DartDuration, DartHashMap, DartIterableElementError, DartList, DartSet, DartStackTrace, DartStringBuffer, identical, NullThrownError, StateError, UnsupportedError, RangeError, DartObject, DartStopwatch } from "./core";
import { $with, Abstract, AbstractProperty, DartClass, defaultConstructor, defaultFactory, Implements, namedConstructor, namedFactory, Op, Operator, OperatorMethods, With } from "./utils";
import { is, equals, isNot } from './_common';
import { printToZone, printToConsole } from "./_internal";
// @ts-ignore
let self = global;
/**
 * An object representing a delayed computation.
 *
 * A [Future] is used to represent a potential value, or error,
 * that will be available at some time in the future.
 * Receivers of a [Future] can register callbacks
 * that handle the value or error once it is available.
 * For example:
 *
 *     Future<int> future = getFuture();
 *     future.then((value) => handleValue(value))
 *           .catchError((error) => handleError(error));
 *
 * A [Future] can complete in two ways:
 * with a value ("the future succeeds")
 * or with an error ("the future fails").
 * Users can install callbacks for each case.
 * The result of registering a pair of callbacks is a new Future (the
 * "successor") which in turn is completed with the result of invoking the
 * corresponding callback.
 * The successor is completed with an error if the invoked callback throws.
 * For example:
 *
 *     Future<int> successor = future.then((int value) {
 *         // Invoked when the future is completed with a value.
 *         return 42;  // The successor is completed with the value 42.
 *       },
 *       onError: (e) {
 *         // Invoked when the future is completed with an error.
 *         if (canHandle(e)) {
 *           return 499;  // The successor is completed with the value 499.
 *         } else {
 *           throw e;  // The successor is completed with the error e.
 *         }
 *       });
 *
 * If a future does not have a successor when it completes with an error,
 * it forwards the error message to the global error-handler.
 * This behavior makes sure that no error is silently dropped.
 * However, it also means that error handlers should be installed early,
 * so that they are present as soon as a future is completed with an error.
 * The following example demonstrates this potential bug:
 *
 *     var future = getFuture();
 *     new Timer(new Duration(milliseconds: 5), () {
 *       // The error-handler is not attached until 5 ms after the future has
 *       // been received. If the future fails before that, the error is
 *       // forwarded to the global error-handler, even though there is code
 *       // (just below) to eventually handle the error.
 *       future.then((value) { useValue(value); },
 *                   onError: (e) { handleError(e); });
 *     });
 *
 * When registering callbacks, it's often more readable to register the two
 * callbacks separately, by first using [then] with one argument
 * (the value handler) and using a second [catchError] for handling errors.
 * Each of these will forward the result that they don't handle
 * to their successors, and together they handle both value and error result.
 * It also has the additional benefit of the [catchError] handling errors in the
 * [then] value callback too.
 * Using sequential handlers instead of parallel ones often leads to code that
 * is easier to reason about.
 * It also makes asynchronous code very similar to synchronous code:
 *
 *     // Synchronous code.
 *     try {
 *       int value = foo();
 *       return bar(value);
 *     } catch (e) {
 *       return 499;
 *     }
 *
 * Equivalent asynchronous code, based on futures:
 *
 *     Future<int> future = new Future(foo);  // Result of foo() as a future.
 *     future.then((int value) => bar(value))
 *           .catchError((e) => 499);
 *
 * Similar to the synchronous code, the error handler (registered with
 * [catchError]) is handling any errors thrown by either `foo` or `bar`.
 * If the error-handler had been registered as the `onError` parameter of
 * the `then` call, it would not catch errors from the `bar` call.
 *
 * Futures can have more than one callback-pair registered. Each successor is
 * treated independently and is handled as if it was the only successor.
 *
 * A future may also fail to ever complete. In that case, no callbacks are
 * called.
 */
let Future = Future_1 = class Future {
    constructor(computation) {
        /*super((resolve, reject) => {

        });*/
    }
    static _fromPromise(p) {
        let f = new _Future();
        p.then((r) => f._complete(r), (e) => f._completeError(e, new DartStackTrace(e)));
        return f;
    }
    /**
     * Creates a future containing the result of calling [computation]
     * asynchronously with [Timer.run].
     *
     * If the result of executing [computation] throws, the returned future is
     * completed with the error.
     *
     * If the returned value is itself a [Future], completion of
     * the created future will wait until the returned future completes,
     * and will then complete with the same result.
     *
     * If a non-future value is returned, the returned future is completed
     * with that value.
     */
    static _create(computation) {
        let result = new _Future();
        DartTimer.run(() => {
            try {
                result._complete(computation());
            }
            catch (e /*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s /*s*/);
            }
        });
        return result;
    }
    /**
     * Creates a future containing the result of calling [computation]
     * asynchronously with [scheduleMicrotask].
     *
     * If executing [computation] throws,
     * the returned future is completed with the thrown error.
     *
     * If calling [computation] returns a [Future], completion of
     * the created future will wait until the returned future completes,
     * and will then complete with the same result.
     *
     * If calling [computation] returns a non-future value,
     * the returned future is completed with that value.
     */
    static _microtask(computation) {
        let result = new _Future();
        scheduleMicrotask(() => {
            try {
                result._complete(computation());
            }
            catch (e /*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s);
            }
        });
        return result;
    }
    /**
     * Returns a future containing the result of immediately calling
     * [computation].
     *
     * If calling [computation] throws, the returned future is completed with the
     * error.
     *
     * If calling [computation] returns a `Future<T>`, that future is returned.
     *
     * If calling [computation] returns a non-future value,
     * a future is returned which has been completed with that value.
     */
    static _sync(computation) {
        try {
            let result = computation();
            if (is(result, Future_1)) {
                return result;
            } /* else if (result is Future) {
            // TODO(lrn): Remove this case for Dart 2.0.
            return new _Future<T>.immediate(result);
        } */
            else {
                return new _Future.value(result);
            }
        }
        catch (error /*, stackTrace*/) {
            let stackTrace = new DartStackTrace(error);
            let future = new _Future();
            let replacement = DartZone.current.errorCallback(error, stackTrace);
            if (replacement != null) {
                future._asyncCompleteError(_nonNullError(replacement.error), replacement.stackTrace);
            }
            else {
                future._asyncCompleteError(error, stackTrace);
            }
            return future;
        }
    }
    /**
     * A future whose value is available in the next event-loop iteration.
     *
     * If [result] is not a [Future], using this constructor is equivalent
     * to `new Future<T>.sync(() => result)`.
     *
     * Use [Completer] to create a future and complete it later.
     */
    static _value(result) {
        return new _Future.immediate(result);
    }
    /**
     * A future that completes with an error in the next event-loop iteration.
     *
     * If [error] is `null`, it is replaced by a [NullThrownError].
     *
     * Use [Completer] to create a future and complete it later.
     */
    static _error(error, stackTrace) {
        error = _nonNullError(error);
        if (!identical(DartZone.current, _ROOT_ZONE)) {
            let replacement = DartZone.current.errorCallback(error, stackTrace);
            if (replacement != null) {
                error = _nonNullError(replacement.error);
                stackTrace = replacement.stackTrace;
            }
        }
        return new _Future.immediateError(error, stackTrace);
    }
    /**
     * Creates a future that runs its computation after a delay.
     *
     * The [computation] will be executed after the given [duration] has passed,
     * and the future is completed with the result.
     * If the duration is 0 or less,
     * it completes no sooner than in the next event-loop iteration.
     *
     * If [computation] is omitted,
     * it will be treated as if [computation] was set to `() => null`,
     * and the future will eventually complete with the `null` value.
     *
     * If calling [computation] throws, the created future will complete with the
     * error.
     *
     * See also [Completer] for a way to create and complete a future at a
     * later time that isn't necessarily after a known fixed duration.
     */
    static _delayed(duration, computation) {
        let result = new _Future();
        new DartTimer(duration, () => {
            try {
                result._complete(computation && computation());
            }
            catch (e /*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s);
            }
        });
        return result;
    }
    /**
     * Wait for all the given futures to complete and collect their values.
     *
     * Returns a future which will complete once all the futures in a list
     * have completed.
     *
     * The value of the returned future will be a list of all the values that
     * were produced.
     *
     * If any of the given futures completes with an error, then the returned
     * future completes with that error. If other futures complete with errors,
     * those errors are discarded.
     *
     * If `eagerError` is true, the returned future completes with an error
     * immediately on the first error from one of the futures. Otherwise all
     * futures must complete before the returned future is completed (still with
     * the first error; the remaining errors are silently dropped).
     *
     * In the case of an error, [cleanUp] (if provided), is invoked on any
     * non-null result of successful futures.
     * This makes it posible to `cleanUp` resources that would otherwise be
     * lost (since the returned future does not provide access to these values).
     * The [cleanup] function is unused if there is no error.
     *
     * The call to `cleanUp` should not throw. If it does, the error will be an
     * uncaught asynchronous error.
     */
    static wait(futures, _) {
        let { eagerError, cleanUp } = Object.assign({ eagerError: false }, _);
        let result = new _Future();
        let values; // Collects the values. Set to null on error.
        let remaining = 0; // How many futures are we waiting for.
        let error; // The first error from a future.
        let stackTrace; // The stackTrace that came with the error.
        // Handle an error from any of the futures.
        // TODO(jmesserly): use `void` return type once it can be inferred for the
        // `then` call below.
        let handleError = (theError, theStackTrace) => {
            remaining--;
            if (values != null) {
                if (cleanUp != null) {
                    for (let value of values) {
                        if (value != null) {
                            // Ensure errors from cleanUp are uncaught.
                            new Future_1.sync(() => {
                                cleanUp(value);
                            });
                        }
                    }
                }
                values = null;
                if (remaining == 0 || eagerError) {
                    result._completeError(theError, theStackTrace);
                }
                else {
                    error = theError;
                    stackTrace = theStackTrace;
                }
            }
            else if (remaining == 0 && !eagerError) {
                result._completeError(error, stackTrace);
            }
        };
        try {
            // As each future completes, put its value into the corresponding
            // position in the list of values.
            for (let future of futures) {
                let pos = remaining;
                future.then((value) => {
                    remaining--;
                    if (values != null) {
                        values[pos] = value;
                        if (remaining == 0) {
                            result._completeWithValue(values);
                        }
                    }
                    else {
                        if (cleanUp != null && value != null) {
                            // Ensure errors from cleanUp are uncaught.
                            new Future_1.sync(() => {
                                cleanUp(value);
                            });
                        }
                        if (remaining == 0 && !eagerError) {
                            result._completeError(error, stackTrace);
                        }
                    }
                }, { onError: handleError });
                // Increment the 'remaining' after the call to 'then'.
                // If that call throws, we don't expect any future callback from
                // the future, and we also don't increment remaining.
                remaining++;
            }
            if (remaining == 0) {
                return new Future_1.value(new DartList());
            }
            values = new DartList(remaining);
        }
        catch (e) {
            let st = new DartStackTrace(e);
            // The error must have been thrown while iterating over the futures
            // list, or while installing a callback handler on the future.
            if (remaining == 0 || eagerError) {
                // Throw a new Future.error.
                // Don't just call `result._completeError` since that would propagate
                // the error too eagerly, not giving the callers time to install
                // error handlers.
                // Also, don't use `_asyncCompleteError` since that one doesn't give
                // zones the chance to intercept the error.
                return new Future_1.error(e, st);
            }
            else {
                // Don't allocate a list for values, thus indicating that there was an
                // error.
                // Set error to the caught exception.
                error = e;
                stackTrace = st;
            }
        }
        return result;
    }
    /**
     * Returns the result of the first future in [futures] to complete.
     *
     * The returned future is completed with the result of the first
     * future in [futures] to report that it is complete.
     * The results of all the other futures are discarded.
     *
     * If [futures] is empty, or if none of its futures complete,
     * the returned future never completes.
     */
    static any(futures) {
        let completer = new DartCompleter.sync();
        let onValue = (value) => {
            if (!completer.isCompleted)
                completer.complete(value);
        };
        let onError = (error, stack) => {
            if (!completer.isCompleted)
                completer.completeError(error, stack);
        };
        for (let future of futures) {
            future.then(onValue, { onError: onError });
        }
        return completer.future;
    }
    /**
     * Perform an operation for each element of the iterable, in turn.
     *
     * The operation, [f], may be either synchronous or asynchronous.
     *
     * Calls [f] with each element in [input] in order.
     * If the call to [f] returns a `Future<T>`, the iteration waits
     * until the future is completed before moving to the next element.
     *
     * Returns a [Future] that completes with `null` when all elements have been
     * processed.
     *
     * Non-[Future] return values, and completion-values of returned [Future]s,
     * are discarded.
     *
     * Any error from [f], synchronous or asynchronous, will stop the iteration
     * and will be reported in the returned [Future].
     */
    static forEach(input, f) {
        let iterator = input.iterator;
        return Future_1.doWhile(() => {
            if (!iterator.moveNext())
                return false;
            let result = f(iterator.current);
            if (is(result, Future_1))
                return result.then(Future_1._kTrue);
            return true;
        });
    }
    // Constant `true` function, used as callback by [forEach].
    static _kTrue(_) {
        return true;
    }
    /**
     * Performs an operation repeatedly until it returns `false`.
     *
     * The operation, [f], may be either synchronous or asynchronous.
     *
     * The operation is called repeatedly as long as it returns either the [bool]
     * value `true` or a `Future<bool>` which completes with the value `true`.
     *
     * If a call to [f] returns `false` or a [Future] that completes to `false`,
     * iteration ends and the future returned by [doWhile] is completed with
     * a `null` value.
     *
     * If a call to [f] throws or a future returned by [f] completes with
     * an error, iteration ends and the future returned by [doWhile]
     * completes with the same error.
     *
     * Calls to [f] may happen at any time, including immediately after calling
     * `doWhile`. The only restriction is a new call to [f] won't happen before
     * the previous call has returned, and if it returned a `Future<bool>`, not
     * until that future has completed.
     */
    static doWhile(f) {
        let doneSignal = new _Future();
        let nextIteration;
        // Bind this callback explicitly so that each iteration isn't bound in the
        // context of all the previous iterations' callbacks.
        // This avoids, e.g., deeply nested stack traces from the stack trace
        // package.
        nextIteration = DartZone.current.bindUnaryCallback((keepGoing) => {
            while (keepGoing) {
                let result;
                try {
                    result = f();
                }
                catch (error) {
                    let stackTrace = new DartStackTrace(error);
                    // Cannot use _completeWithErrorCallback because it completes
                    // the future synchronously.
                    _asyncCompleteWithErrorCallback(doneSignal, error, stackTrace);
                    return;
                }
                if (is(result, Future_1)) {
                    result.then(nextIteration, { onError: doneSignal._completeError });
                    return;
                }
                keepGoing = result;
            }
            doneSignal._complete(null);
        }, { runGuarded: true });
        nextIteration(true);
        return doneSignal;
    }
    then(onfulfilled, onrejected) {
        throw 'abstract';
    }
    /**
     * Handles errors emitted by this [Future].
     *
     * This is the asynchronous equivalent of a "catch" block.
     *
     * Returns a new [Future] that will be completed with either the result of
     * this future or the result of calling the `onError` callback.
     *
     * If this future completes with a value,
     * the returned future completes with the same value.
     *
     * If this future completes with an error,
     * then [test] is first called with the error value.
     *
     * If `test` returns false, the exception is not handled by this `catchError`,
     * and the returned future completes with the same error and stack trace
     * as this future.
     *
     * If `test` returns `true`,
     * [onError] is called with the error and possibly stack trace,
     * and the returned future is completed with the result of this call
     * in exactly the same way as for [then]'s `onError`.
     *
     * If `test` is omitted, it defaults to a function that always returns true.
     * The `test` function should not throw, but if it does, it is handled as
     * if the `onError` function had thrown.
     *
     * Note that futures don't delay reporting of errors until listeners are
     * added. If the first `catchError` (or `then`) call happens after this future
     * has completed with an error then the error is reported as unhandled error.
     * See the description on [Future].
     *
     * Example:
     *
     *     foo
     *       .catchError(..., test: (e) => e is ArgumentError)
     *       .catchError(..., test: (e) => e is NoSuchMethodError)
     *       .then((v) { ... });
     *
     * This method is equivalent to:
     *
     *     Future catchError(onError(error),
     *                       {bool test(error)}) {
     *       this.then((v) => v,  // Forward the value.
     *                 // But handle errors, if the [test] succeeds.
     *                 onError: (e, stackTrace) {
     *                   if (test == null || test(e)) {
     *                     if (onError is ZoneBinaryCallback) {
     *                       return onError(e, stackTrace);
     *                     }
     *                     return onError(e);
     *                   }
     *                   throw e;
     *                 });
     *     }
     *
     */
    // The `Function` below stands for one of two types:
    // - (dynamic) -> FutureOr<T>
    // - (dynamic, StackTrace) -> FutureOr<T>
    // Given that there is a `test` function that is usually used to do an
    // `isCheck` we should also expect functions that take a specific argument.
    // Note: making `catchError` return a `Future<T>` in non-strong mode could be
    // a breaking change.
    catchError(onError, _) {
        throw 'abstract';
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        // @ts-ignore
        return this.catchError(onrejected);
    }
    /**
     * Register a function to be called when this future completes.
     *
     * The [action] function is called when this future completes, whether it
     * does so with a value or with an error.
     *
     * This is the asynchronous equivalent of a "finally" block.
     *
     * The future returned by this call, `f`, will complete the same way
     * as this future unless an error occurs in the [action] call, or in
     * a [Future] returned by the [action] call. If the call to [action]
     * does not return a future, its return value is ignored.
     *
     * If the call to [action] throws, then `f` is completed with the
     * thrown error.
     *
     * If the call to [action] returns a [Future], `f2`, then completion of
     * `f` is delayed until `f2` completes. If `f2` completes with
     * an error, that will be the result of `f` too. The value of `f2` is always
     * ignored.
     *
     * This method is equivalent to:
     *
     *     Future<T> whenComplete(action()) {
     *       return this.then((v) {
     *         var f2 = action();
     *         if (f2 is Future) return f2.then((_) => v);
     *         return v
     *       }, onError: (e) {
     *         var f2 = action();
     *         if (f2 is Future) return f2.then((_) { throw e; });
     *         throw e;
     *       });
     *     }
     */
    whenComplete(action) {
        throw 'abstract';
    }
    /**
     * Creates a [Stream] containing the result of this future.
     *
     * The stream will produce single data or error event containing the
     * completion result of this future, and then it will close with a
     * done event.
     *
     * If the future never completes, the stream will not produce any events.
     */
    asStream() {
        throw 'abstract';
    }
    /**
     * Time-out the future computation after [timeLimit] has passed.
     *
     * Returns a new future that completes with the same value as this future,
     * if this future completes in time.
     *
     * If this future does not complete before `timeLimit` has passed,
     * the [onTimeout] action is executed instead, and its result (whether it
     * returns or throws) is used as the result of the returned future.
     * The [onTimeout] function must return a [T] or a `Future<T>`.
     *
     * If `onTimeout` is omitted, a timeout will cause the returned future to
     * complete with a [TimeoutException].
     */
    timeout(timeLimit, _) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], Future.prototype, "then", null);
__decorate([
    Abstract
], Future.prototype, "catchError", null);
__decorate([
    Abstract
], Future.prototype, "whenComplete", null);
__decorate([
    Abstract
], Future.prototype, "asStream", null);
__decorate([
    Abstract
], Future.prototype, "timeout", null);
__decorate([
    namedFactory
], Future, "_fromPromise", null);
__decorate([
    defaultFactory
], Future, "_create", null);
__decorate([
    namedFactory
], Future, "_microtask", null);
__decorate([
    namedFactory
], Future, "_sync", null);
__decorate([
    namedFactory
], Future, "_value", null);
__decorate([
    namedFactory
], Future, "_error", null);
__decorate([
    namedFactory
], Future, "_delayed", null);
Future = Future_1 = __decorate([
    DartClass
], Future);
function dartAsync(asyncFunc) {
    return (...args) => new Future.fromPromise(asyncFunc.apply(null, args));
}
/**
 * Thrown when a scheduled timeout happens while waiting for an async result.
 */
class DartTimeoutException extends Error {
    constructor(message, duration) {
        super();
        this.message = message;
        this.duration = duration;
    }
    toString() {
        let result = "TimeoutException";
        if (this.duration != null)
            result = "TimeoutException after $duration";
        if (this.message != null)
            result = "$result: $message";
        return result;
    }
}
/**
 * A way to produce Future objects and to complete them later
 * with a value or error.
 *
 * Most of the time, the simplest way to create a future is to just use
 * one of the [Future] constructors to capture the result of a single
 * asynchronous computation:
 *
 *     new Future(() { doSomething(); return result; });
 *
 * or, if the future represents the result of a sequence of asynchronous
 * computations, they can be chained using [Future.then] or similar functions
 * on [Future]:
 *
 *     Future doStuff(){
 *       return someAsyncOperation().then((result) {
 *         return someOtherAsyncOperation(result);
 *       });
 *     }
 *
 * If you do need to create a Future from scratch — for example,
 * when you're converting a callback-based API into a Future-based
 * one — you can use a Completer as follows:
 *
 *     class AsyncOperation {
 *       Completer _completer = new Completer();
 *
 *       Future<T> doOperation() {
 *         _startOperation();
 *         return _completer.future; // Send future object back to client.
 *       }
 *
 *       // Something calls this when the value is ready.
 *       void _finishOperation(T result) {
 *         _completer.complete(result);
 *       }
 *
 *       // If something goes wrong, call this.
 *       void _errorHappened(error) {
 *         _completer.completeError(error);
 *       }
 *     }
 */
class DartCompleter {
    constructor() {
    }
    /**
     * Creates a new completer.
     *
     * The general workflow for creating a new future is to 1) create a
     * new completer, 2) hand out its future, and, at a later point, 3) invoke
     * either [complete] or [completeError].
     *
     * The completer completes the future asynchronously. That means that
     * callbacks registered on the future, are not called immediately when
     * [complete] or [completeError] is called. Instead the callbacks are
     * delayed until a later microtask.
     *
     * Example:
     *
     *     var completer = new Completer();
     *     handOut(completer.future);
     *     later: {
     *       completer.complete('completion value');
     *     }
     */
    static _create() {
        return new _AsyncCompleter();
    }
    /**
     * Completes the future synchronously.
     *
     * This constructor should be avoided unless the completion of the future is
     * known to be the final result of another asynchronous operation. If in doubt
     * use the default [Completer] constructor.
     *
     * Using an normal, asynchronous, completer will never give the wrong
     * behavior, but using a synchronous completer incorrectly can cause
     * otherwise correct programs to break.
     *
     * A synchronous completer is only intended for optimizing event
     * propagation when one asynchronous event immediately triggers another.
     * It should not be used unless the calls to [complete] and [completeError]
     * are guaranteed to occur in places where it won't break `Future` invariants.
     *
     * Completing synchronously means that the completer's future will be
     * completed immediately when calling the [complete] or [completeError]
     * method on a synchronous completer, which also calls any callbacks
     * registered on that future.
     *
     * Completing synchronously must not break the rule that when you add a
     * callback on a future, that callback must not be called until the code
     * that added the callback has completed.
     * For that reason, a synchronous completion must only occur at the very end
     * (in "tail position") of another synchronous event,
     * because at that point, completing the future immediately is be equivalent
     * to returning to the event loop and completing the future in the next
     * microtask.
     *
     * Example:
     *
     *     var completer = new Completer.sync();
     *     // The completion is the result of the asynchronous onDone event.
     *     // No other operation is performed after the completion. It is safe
     *     // to use the Completer.sync constructor.
     *     stream.listen(print, onDone: () { completer.complete("done"); });
     *
     * Bad example. Do not use this code. Only for illustrative purposes:
     *
     *     var completer = new Completer.sync();
     *     completer.future.then((_) { bar(); });
     *     // The completion is the result of the asynchronous onDone event.
     *     // However, there is still code executed after the completion. This
     *     // operation is *not* safe.
     *     stream.listen(print, onDone: () {
     *       completer.complete("done");
     *       foo();  // In this case, foo() runs after bar().
     *     });
     */
    static _sync() {
        return new _SyncCompleter();
    }
    /** The future that will contain the result provided to this completer. */
    get future() {
        throw 'abstract';
    }
    /**
     * Completes [future] with the supplied values.
     *
     * The value must be either a value of type [T]
     * or a future of type `Future<T>`.
     *
     * If the value is itself a future, the completer will wait for that future
     * to complete, and complete with the same result, whether it is a success
     * or an error.
     *
     * Calling `complete` or [completeError] must not be done more than once.
     *
     * All listeners on the future are informed about the value.
     */
    complete(value) {
        throw 'abstract';
    }
    /**
     * Complete [future] with an error.
     *
     * Calling [complete] or `completeError` must not be done more than once.
     *
     * Completing a future with an error indicates that an exception was thrown
     * while trying to produce a value.
     *
     * If [error] is `null`, it is replaced by a [NullThrownError].
     *
     * If `error` is a `Future`, the future itself is used as the error value.
     * If you want to complete with the result of the future, you can use:
     *
     *     thisCompleter.complete(theFuture)
     *
     * or if you only want to handle an error from the future:
     *
     *     theFuture.catchError(thisCompleter.completeError);
     *
     */
    completeError(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * Whether the future has been completed.
     */
    get isCompleted() {
        throw 'abstract';
    }
}
__decorate([
    AbstractProperty
], DartCompleter.prototype, "future", null);
__decorate([
    Abstract
], DartCompleter.prototype, "complete", null);
__decorate([
    Abstract
], DartCompleter.prototype, "completeError", null);
__decorate([
    AbstractProperty
], DartCompleter.prototype, "isCompleted", null);
__decorate([
    defaultFactory
], DartCompleter, "_create", null);
__decorate([
    namedFactory
], DartCompleter, "_sync", null);
// Helper function completing a _Future with error, but checking the zone
// for error replacement first.
function _completeWithErrorCallback(result, error, stackTrace) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    result._completeError(error, stackTrace);
}
// Like [_completeWIthErrorCallback] but completes asynchronously.
function _asyncCompleteWithErrorCallback(result, error, stackTrace) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    result._asyncCompleteError(error, stackTrace);
}
/** Helper function that converts `null` to a [NullThrownError]. */
function _nonNullError(error) {
    return error || new NullThrownError();
}
let _AbstractZone = class _AbstractZone {
    _() {
    }
    /**
     * Handles uncaught asynchronous errors.
     *
     * There are two kind of asynchronous errors that are handled by this
     * function:
     * 1. Uncaught errors that were thrown in asynchronous callbacks, for example,
     *   a `throw` in the function passed to [Timer.run].
     * 2. Asynchronous errors that are pushed through [Future] and [Stream]
     *   chains, but for which no child registered an error handler.
     *   Most asynchronous classes, like [Future] or [Stream] push errors to their
     *   listeners. Errors are propagated this way until either a listener handles
     *   the error (for example with [Future.catchError]), or no listener is
     *   available anymore. In the latter case, futures and streams invoke the
     *   zone's [handleUncaughtError].
     *
     * By default, when handled by the root zone, uncaught asynchronous errors are
     * treated like uncaught synchronous exceptions.
     */
    handleUncaughtError(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * The parent zone of the this zone.
     *
     * Is `null` if `this` is the [ROOT] zone.
     *
     * Zones are created by [fork] on an existing zone, or by [runZoned] which
     * forks the [current] zone. The new zone's parent zone is the zone it was
     * forked from.
     */
    get parent() {
        throw 'abstract';
    }
    /**
     * The error zone is the one that is responsible for dealing with uncaught
     * errors.
     *
     * This is the closest parent zone of this zone that provides a
     * [handleUncaughtError] method.
     *
     * Asynchronous errors never cross zone boundaries between zones with
     * different error handlers.
     *
     * Example:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   var future;
     *   runZoned(() {
     *     // The asynchronous error is caught by the custom zone which prints
     *     // 'asynchronous error'.
     *     future = new Future.error("asynchronous error");
     *   }, onError: (e) { print(e); });  // Creates a zone with an error handler.
     *   // The following `catchError` handler is never invoked, because the
     *   // custom zone created by the call to `runZoned` provides an
     *   // error handler.
     *   future.catchError((e) { throw "is never reached"; });
     * }
     * ```
     *
     * Note that errors cannot enter a child zone with a different error handler
     * either:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   runZoned(() {
     *     // The following asynchronous error is *not* caught by the `catchError`
     *     // in the nested zone, since errors are not to cross zone boundaries
     *     // with different error handlers.
     *     // Instead the error is handled by the current error handler,
     *     // printing "Caught by outer zone: asynchronous error".
     *     var future = new Future.error("asynchronous error");
     *     runZoned(() {
     *       future.catchError((e) { throw "is never reached"; });
     *     }, onError: (e) { throw "is never reached"; });
     *   }, onError: (e) { print("Caught by outer zone: $e"); });
     * }
     * ```
     */
    get errorZone() {
        throw 'abstract';
    }
    /**
     * Returns true if `this` and [otherZone] are in the same error zone.
     *
     * Two zones are in the same error zone if they have the same [errorZone].
     */
    inSameErrorZone(otherZone) {
        throw 'abstract';
    }
    /**
     * Creates a new zone as a child of `this`.
     *
     * The new zone uses the closures in the given [specification] to override
     * the current's zone behavior. All specification entries that are `null`
     * inherit the behavior from the parent zone (`this`).
     *
     * The new zone inherits the stored values (accessed through [[]])
     * of this zone and updates them with values from [zoneValues], which either
     * adds new values or overrides existing ones.
     *
     * Note that the fork operation is interceptible. A zone can thus change
     * the zone specification (or zone values), giving the forking zone full
     * control over the child zone.
     */
    fork(_) {
        throw 'abstract';
    }
    /**
     * Executes [action] in this zone.
     *
     * By default (as implemented in the [ROOT] zone), runs [action]
     * with [current] set to this zone.
     *
     * If [action] throws, the synchronous exception is not caught by the zone's
     * error handler. Use [runGuarded] to achieve that.
     *
     * Since the root zone is the only zone that can modify the value of
     * [current], custom zones intercepting run should always delegate to their
     * parent zone. They may take actions before and after the call.
     */
    run(action) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument] in this zone.
     *
     * As [run] except that [action] is called with one [argument] instead of
     * none.
     */
    runUnary(action, argument) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone.
     *
     * As [run] except that [action] is called with two arguments instead of none.
     */
    runBinary(action, argument1, argument2) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] in this zone and catches synchronous
     * errors.
     *
     * This function is equivalent to:
     * ```
     * try {
     *   return this.run(action);
     * } catch (e, s) {
     *   return this.handleUncaughtError(e, s);
     * }
     * ```
     *
     * See [run].
     */
    runGuarded(action) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument] in this zone and
     * catches synchronous errors.
     *
     * See [runGuarded].
     */
    runUnaryGuarded(action, argument) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone and catches synchronous errors.
     *
     * See [runGuarded].
     */
    runBinaryGuarded(action, argument1, argument2) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * When implementing an asynchronous primitive that uses callbacks, the
     * callback must be registered using [registerCallback] at the point where the
     * user provides the callback. This allows zones to record other information
     * that they need at the same time, perhaps even wrapping the callback, so
     * that the callback is prepared when it is later run in the same zones
     * (using [run]). For example, a zone may decide
     * to store the stack trace (at the time of the registration) with the
     * callback.
     *
     * Returns the callback that should be used in place of the provided
     * [callback]. Frequently zones simply return the original callback.
     *
     * Custom zones may intercept this operation. The default implementation in
     * [Zone.ROOT] returns the original callback unchanged.
     */
    registerCallback(callback) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerUnaryCallback(callback) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerBinaryCallback(callback) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerCallback(action);
     *      if (runGuarded) return () => this.runGuarded(registered);
     *      return () => this.run(registered);
     *
     */
    bindCallback(action, _) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerUnaryCallback(action);
     *      if (runGuarded) return (arg) => this.runUnaryGuarded(registered, arg);
     *      return (arg) => thin.runUnary(registered, arg);
     */
    bindUnaryCallback(action, _) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = registerBinaryCallback(action);
     *      if (runGuarded) {
     *        return (arg1, arg2) => this.runBinaryGuarded(registered, arg);
     *      }
     *      return (arg1, arg2) => thin.runBinary(registered, arg1, arg2);
     */
    bindBinaryCallback(action, _) {
        throw 'abstract';
    }
    /**
     * Intercepts errors when added programatically to a `Future` or `Stream`.
     *
     * When calling [Completer.completeError], [StreamController.addError],
     * or some [Future] constructors, the current zone is allowed to intercept
     * and replace the error.
     *
     * Future constructors invoke this function when the error is received
     * directly, for example with [Future.error], or when the error is caught
     * synchronously, for example with [Future.sync].
     *
     * There is no guarantee that an error is only sent through [errorCallback]
     * once. Libraries that use intermediate controllers or completers might
     * end up invoking [errorCallback] multiple times.
     *
     * Returns `null` if no replacement is desired. Otherwise returns an instance
     * of [AsyncError] holding the new pair of error and stack trace.
     *
     * Although not recommended, the returned instance may have its `error` member
     * ([AsyncError.error]) be equal to `null` in which case the error should be
     * replaced by a [NullThrownError].
     *
     * Custom zones may intercept this operation.
     *
     * Implementations of a new asynchronous primitive that converts synchronous
     * errors to asynchronous errors rarely need to invoke [errorCallback], since
     * errors are usually reported through future completers or stream
     * controllers.
     */
    errorCallback(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * Runs [action] asynchronously in this zone.
     *
     * The global `scheduleMicrotask` delegates to the current zone's
     * [scheduleMicrotask]. The root zone's implementation interacts with the
     * underlying system to schedule the given callback as a microtask.
     *
     * Custom zones may intercept this operation (for example to wrap the given
     * callback [action]).
     */
    scheduleMicrotask(action) {
        throw 'abstract';
    }
    /**
     * Creates a Timer where the callback is executed in this zone.
     */
    createTimer(duration, callback) {
        throw 'abstract';
    }
    /**
     * Creates a periodic Timer where the callback is executed in this zone.
     */
    createPeriodicTimer(period, callback) {
        throw 'abstract';
    }
    /**
     * Prints the given [line].
     *
     * The global `print` function delegates to the current zone's [print]
     * function which makes it possible to intercept printing.
     *
     * Example:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   runZoned(() {
     *     // Ends up printing: "Intercepted: in zone".
     *     print("in zone");
     *   }, zoneSpecification: new ZoneSpecification(
     *       print: (Zone self, ZoneDelegate parent, Zone zone, String line) {
     *     parent.print(zone, "Intercepted: $line");
     *   }));
     * }
     * ```
     */
    print(line) {
        throw 'abstract';
    }
    /**
     * Retrieves the zone-value associated with [key].
     *
     * If this zone does not contain the value looks up the same key in the
     * parent zone. If the [key] is not found returns `null`.
     *
     * Any object can be used as key, as long as it has compatible `operator ==`
     * and `hashCode` implementations.
     * By controlling access to the key, a zone can grant or deny access to the
     * zone value.
     */
    get(key) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], _AbstractZone.prototype, "handleUncaughtError", null);
__decorate([
    AbstractProperty
], _AbstractZone.prototype, "parent", null);
__decorate([
    AbstractProperty
], _AbstractZone.prototype, "errorZone", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "inSameErrorZone", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "fork", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "run", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "runUnary", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "runBinary", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "runGuarded", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "runUnaryGuarded", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "runBinaryGuarded", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "registerCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "registerUnaryCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "registerBinaryCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "bindCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "bindUnaryCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "bindBinaryCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "errorCallback", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "scheduleMicrotask", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "createTimer", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "createPeriodicTimer", null);
__decorate([
    Abstract
], _AbstractZone.prototype, "print", null);
__decorate([
    Operator(Op.INDEX),
    Abstract
], _AbstractZone.prototype, "get", null);
_AbstractZone = __decorate([
    DartClass
], _AbstractZone);
/**
 * Base class for Zone implementations.
 */
let _Zone = class _Zone extends _AbstractZone {
    constructor() {
        super();
    }
    get _run() {
        throw 'abstract';
    }
    get _runUnary() {
        throw 'abstract';
    }
    get _runBinary() {
        throw 'abstract';
    }
    get _registerCallback() {
        throw 'abstract';
    }
    get _registerUnaryCallback() {
        throw 'abstract';
    }
    get _registerBinaryCallback() {
        throw 'abstract';
    }
    get _errorCallback() {
        throw 'abstract';
    }
    get _scheduleMicrotask() {
        throw 'abstract';
    }
    get _createTimer() {
        throw 'abstract';
    }
    get _createPeriodicTimer() {
        throw 'abstract';
    }
    get _print() {
        throw 'abstract';
    }
    get _fork() {
        throw 'abstract';
    }
    get _handleUncaughtError() {
        throw 'abstract';
    }
    get parent() {
        throw 'abstract';
    }
    get _delegate() {
        throw 'abstract';
    }
    get _map() {
        throw 'abstract';
    }
    inSameErrorZone(otherZone) {
        return identical(this, otherZone) ||
            identical(this.errorZone, otherZone.errorZone);
    }
};
__decorate([
    AbstractProperty
], _Zone.prototype, "_run", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_runUnary", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_runBinary", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_registerCallback", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_registerUnaryCallback", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_registerBinaryCallback", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_errorCallback", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_scheduleMicrotask", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_createTimer", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_createPeriodicTimer", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_print", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_fork", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_handleUncaughtError", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "parent", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_delegate", null);
__decorate([
    AbstractProperty
], _Zone.prototype, "_map", null);
_Zone = __decorate([
    DartClass
], _Zone);
let _RootZone = _RootZone_1 = class _RootZone extends _Zone {
    constructor() {
        super();
    }
    get _run() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRun);
    }
    get _runUnary() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRunUnary);
    }
    get _runBinary() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRunBinary);
    }
    get _registerCallback() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRegisterCallback);
    }
    get _registerUnaryCallback() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRegisterUnaryCallback);
    }
    get _registerBinaryCallback() {
        return new _ZoneFunction(_ROOT_ZONE, _rootRegisterBinaryCallback);
    }
    get _errorCallback() {
        return new _ZoneFunction(_ROOT_ZONE, _rootErrorCallback);
    }
    get _scheduleMicrotask() {
        return new _ZoneFunction(_ROOT_ZONE, _rootScheduleMicrotask);
    }
    get _createTimer() {
        return new _ZoneFunction(_ROOT_ZONE, _rootCreateTimer);
    }
    get _createPeriodicTimer() {
        return new _ZoneFunction(_ROOT_ZONE, _rootCreatePeriodicTimer);
    }
    get _print() {
        return new _ZoneFunction(_ROOT_ZONE, _rootPrint);
    }
    get _fork() {
        return new _ZoneFunction(_ROOT_ZONE, _rootFork);
    }
    get _handleUncaughtError() {
        return new _ZoneFunction(_ROOT_ZONE, _rootHandleUncaughtError);
    }
    // The parent zone.
    get parent() {
        return null;
    }
    /// The zone's scoped value declaration map.
    ///
    /// This is always a [HashMap].
    get _map() {
        return _RootZone_1._rootMap;
    }
    get _delegate() {
        if (_RootZone_1._rootDelegate != null)
            return _RootZone_1._rootDelegate;
        return _RootZone_1._rootDelegate = new _ZoneDelegate(this);
    }
    /**
     * The closest error-handling zone.
     *
     * Returns `this` if `this` has an error-handler. Otherwise returns the
     * parent's error-zone.
     */
    get errorZone() {
        return this;
    }
    // Zone interface.
    runGuarded(f) {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f();
            }
            return _rootRun(null, null, this, f);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    runUnaryGuarded(f, arg) {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f(arg);
            }
            return _rootRunUnary(null, null, this, f, arg);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    runBinaryGuarded(f, arg1, arg2) {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f(arg1, arg2);
            }
            return _rootRunBinary(null, null, this, f, arg1, arg2);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    bindCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        if (runGuarded) {
            return () => this.runGuarded(f);
        }
        else {
            return () => this.run(f);
        }
    }
    bindUnaryCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        if (runGuarded) {
            return (arg) => this.runUnaryGuarded(f, arg);
        }
        else {
            return (arg) => this.runUnary(f, arg);
        }
    }
    bindBinaryCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        if (runGuarded) {
            return (arg1, arg2) => this.runBinaryGuarded(f, arg1, arg2);
        }
        else {
            return (arg1, arg2) => this.runBinary(f, arg1, arg2);
        }
    }
    get(key) {
        return null;
    }
    // Methods that can be customized by the zone specification.
    handleUncaughtError(error, stackTrace) {
        return _rootHandleUncaughtError(null, null, this, error, stackTrace);
    }
    fork(_) {
        let { specification, zoneValues } = Object.assign({}, _);
        return _rootFork(null, null, this, specification, zoneValues);
    }
    run(f) {
        if (identical(DartZone._current, _ROOT_ZONE))
            return f();
        return _rootRun(null, null, this, f);
    }
    runUnary(f, arg) {
        if (identical(DartZone._current, _ROOT_ZONE))
            return f(arg);
        return _rootRunUnary(null, null, this, f, arg);
    }
    runBinary(f, arg1, arg2) {
        if (identical(DartZone._current, _ROOT_ZONE))
            return f(arg1, arg2);
        return _rootRunBinary(null, null, this, f, arg1, arg2);
    }
    registerCallback(f) {
        return f;
    }
    registerUnaryCallback(f) {
        return f;
    }
    registerBinaryCallback(f) {
        return f;
    }
    errorCallback(error, stackTrace) {
        return null;
    }
    scheduleMicrotask(f) {
        _rootScheduleMicrotask(null, null, this, f);
    }
    createTimer(duration, f) {
        return DartTimer._createTimer(duration, f);
    }
    createPeriodicTimer(duration, f) {
        return DartTimer._createPeriodicTimer(duration, f);
    }
    print(line) {
        printToConsole(line);
    }
};
_RootZone._rootMap = new DartHashMap();
__decorate([
    Operator(Op.INDEX)
], _RootZone.prototype, "get", null);
_RootZone = _RootZone_1 = __decorate([
    DartClass
], _RootZone);
const _ROOT_ZONE = new _RootZone();
/**
 * A zone represents an environment that remains stable across asynchronous
 * calls.
 *
 * Code is always executed in the context of a zone, available as
 * [Zone.current]. The initial `main` function runs in the context of the
 * default zone ([Zone.ROOT]). Code can be run in a different zone using either
 * [runZoned], to create a new zone, or [Zone.run] to run code in the context of
 * an existing zone likely created using [Zone.fork].
 *
 * Developers can create a new zone that overrides some of the functionality of
 * an existing zone. For example, custom zones can replace of modify the
 * behavior of `print`, timers, microtasks or how uncaught errors are handled.
 *
 * The [Zone] class is not subclassable, but users can provide custom zones by
 * forking an existing zone (usually [Zone.current]) with a [ZoneSpecification].
 * This is similar to creating a new class that extends the base `Zone` class
 * and that overrides some methods, except without actually creating a new
 * class. Instead the overriding methods are provided as functions that
 * explicitly take the equivalent of their own class, the "super" class and the
 * `this` object as parameters.
 *
 * Asynchronous callbacks always run in the context of the zone where they were
 * scheduled. This is implemented using two steps:
 * 1. the callback is first registered using one of [registerCallback],
 *   [registerUnaryCallback], or [registerBinaryCallback]. This allows the zone
 *   to record that a callback exists and potentially modify it (by returning a
 *   different callback). The code doing the registration (e.g., `Future.then`)
 *   also remembers the current zone so that it can later run the callback in
 *   that zone.
 * 2. At a later point the registered callback is run in the remembered zone.
 *
 * This is all handled internally by the platform code and most users don't need
 * to worry about it. However, developers of new asynchronous operations,
 * provided by the underlying system or through native extensions, must follow
 * the protocol to be zone compatible.
 *
 * For convenience, zones provide [bindCallback] (and the corresponding
 * [bindUnaryCallback] or [bindBinaryCallback]) to make it easier to respect the
 * zone contract: these functions first invoke the corresponding `register`
 * functions and then wrap the returned function so that it runs in the current
 * zone when it is later asynchronously invoked.
 */
let DartZone = DartZone_1 = class DartZone {
    // Private constructor so that it is not possible instantiate a Zone class.
    _() {
    }
    /** The zone that is currently active. */
    static get current() {
        return this._current;
    }
    /**
     * Handles uncaught asynchronous errors.
     *
     * There are two kind of asynchronous errors that are handled by this
     * function:
     * 1. Uncaught errors that were thrown in asynchronous callbacks, for example,
     *   a `throw` in the function passed to [Timer.run].
     * 2. Asynchronous errors that are pushed through [Future] and [Stream]
     *   chains, but for which no child registered an error handler.
     *   Most asynchronous classes, like [Future] or [Stream] push errors to their
     *   listeners. Errors are propagated this way until either a listener handles
     *   the error (for example with [Future.catchError]), or no listener is
     *   available anymore. In the latter case, futures and streams invoke the
     *   zone's [handleUncaughtError].
     *
     * By default, when handled by the root zone, uncaught asynchronous errors are
     * treated like uncaught synchronous exceptions.
     */
    handleUncaughtError(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * The parent zone of the this zone.
     *
     * Is `null` if `this` is the [ROOT] zone.
     *
     * Zones are created by [fork] on an existing zone, or by [runZoned] which
     * forks the [current] zone. The new zone's parent zone is the zone it was
     * forked from.
     */
    get parent() {
        throw 'abstract';
    }
    /**
     * The error zone is the one that is responsible for dealing with uncaught
     * errors.
     *
     * This is the closest parent zone of this zone that provides a
     * [handleUncaughtError] method.
     *
     * Asynchronous errors never cross zone boundaries between zones with
     * different error handlers.
     *
     * Example:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   var future;
     *   runZoned(() {
     *     // The asynchronous error is caught by the custom zone which prints
     *     // 'asynchronous error'.
     *     future = new Future.error("asynchronous error");
     *   }, onError: (e) { print(e); });  // Creates a zone with an error handler.
     *   // The following `catchError` handler is never invoked, because the
     *   // custom zone created by the call to `runZoned` provides an
     *   // error handler.
     *   future.catchError((e) { throw "is never reached"; });
     * }
     * ```
     *
     * Note that errors cannot enter a child zone with a different error handler
     * either:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   runZoned(() {
     *     // The following asynchronous error is *not* caught by the `catchError`
     *     // in the nested zone, since errors are not to cross zone boundaries
     *     // with different error handlers.
     *     // Instead the error is handled by the current error handler,
     *     // printing "Caught by outer zone: asynchronous error".
     *     var future = new Future.error("asynchronous error");
     *     runZoned(() {
     *       future.catchError((e) { throw "is never reached"; });
     *     }, onError: (e) { throw "is never reached"; });
     *   }, onError: (e) { print("Caught by outer zone: $e"); });
     * }
     * ```
     */
    get errorZone() {
        throw 'abstract';
    }
    /**
     * Returns true if `this` and [otherZone] are in the same error zone.
     *
     * Two zones are in the same error zone if they have the same [errorZone].
     */
    inSameErrorZone(otherZone) {
        throw 'abstract';
    }
    /**
     * Creates a new zone as a child of `this`.
     *
     * The new zone uses the closures in the given [specification] to override
     * the current's zone behavior. All specification entries that are `null`
     * inherit the behavior from the parent zone (`this`).
     *
     * The new zone inherits the stored values (accessed through [[]])
     * of this zone and updates them with values from [zoneValues], which either
     * adds new values or overrides existing ones.
     *
     * Note that the fork operation is interceptible. A zone can thus change
     * the zone specification (or zone values), giving the forking zone full
     * control over the child zone.
     */
    fork(_) {
        throw 'abstract';
    }
    /**
     * Executes [action] in this zone.
     *
     * By default (as implemented in the [ROOT] zone), runs [action]
     * with [current] set to this zone.
     *
     * If [action] throws, the synchronous exception is not caught by the zone's
     * error handler. Use [runGuarded] to achieve that.
     *
     * Since the root zone is the only zone that can modify the value of
     * [current], custom zones intercepting run should always delegate to their
     * parent zone. They may take actions before and after the call.
     */
    run(action) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument] in this zone.
     *
     * As [run] except that [action] is called with one [argument] instead of
     * none.
     */
    runUnary(action, argument) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone.
     *
     * As [run] except that [action] is called with two arguments instead of none.
     */
    runBinary(action, argument1, argument2) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] in this zone and catches synchronous
     * errors.
     *
     * This function is equivalent to:
     * ```
     * try {
     *   return this.run(action);
     * } catch (e, s) {
     *   return this.handleUncaughtError(e, s);
     * }
     * ```
     *
     * See [run].
     */
    runGuarded(action) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument] in this zone and
     * catches synchronous errors.
     *
     * See [runGuarded].
     */
    runUnaryGuarded(action, argument) {
        throw 'abstract';
    }
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone and catches synchronous errors.
     *
     * See [runGuarded].
     */
    runBinaryGuarded(action, argument1, argument2) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * When implementing an asynchronous primitive that uses callbacks, the
     * callback must be registered using [registerCallback] at the point where the
     * user provides the callback. This allows zones to record other information
     * that they need at the same time, perhaps even wrapping the callback, so
     * that the callback is prepared when it is later run in the same zones
     * (using [run]). For example, a zone may decide
     * to store the stack trace (at the time of the registration) with the
     * callback.
     *
     * Returns the callback that should be used in place of the provided
     * [callback]. Frequently zones simply return the original callback.
     *
     * Custom zones may intercept this operation. The default implementation in
     * [Zone.ROOT] returns the original callback unchanged.
     */
    registerCallback(callback) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerUnaryCallback(callback) {
        throw 'abstract';
    }
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerBinaryCallback(callback) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerCallback(action);
     *      if (runGuarded) return () => this.runGuarded(registered);
     *      return () => this.run(registered);
     *
     */
    bindCallback(action, _) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerUnaryCallback(action);
     *      if (runGuarded) return (arg) => this.runUnaryGuarded(registered, arg);
     *      return (arg) => thin.runUnary(registered, arg);
     */
    bindUnaryCallback(action, _) {
        throw 'abstract';
    }
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = registerBinaryCallback(action);
     *      if (runGuarded) {
     *        return (arg1, arg2) => this.runBinaryGuarded(registered, arg);
     *      }
     *      return (arg1, arg2) => thin.runBinary(registered, arg1, arg2);
     */
    bindBinaryCallback(action, _) {
        throw 'abstract';
    }
    /**
     * Intercepts errors when added programatically to a `Future` or `Stream`.
     *
     * When calling [Completer.completeError], [StreamController.addError],
     * or some [Future] constructors, the current zone is allowed to intercept
     * and replace the error.
     *
     * Future constructors invoke this function when the error is received
     * directly, for example with [Future.error], or when the error is caught
     * synchronously, for example with [Future.sync].
     *
     * There is no guarantee that an error is only sent through [errorCallback]
     * once. Libraries that use intermediate controllers or completers might
     * end up invoking [errorCallback] multiple times.
     *
     * Returns `null` if no replacement is desired. Otherwise returns an instance
     * of [AsyncError] holding the new pair of error and stack trace.
     *
     * Although not recommended, the returned instance may have its `error` member
     * ([AsyncError.error]) be equal to `null` in which case the error should be
     * replaced by a [NullThrownError].
     *
     * Custom zones may intercept this operation.
     *
     * Implementations of a new asynchronous primitive that converts synchronous
     * errors to asynchronous errors rarely need to invoke [errorCallback], since
     * errors are usually reported through future completers or stream
     * controllers.
     */
    errorCallback(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * Runs [action] asynchronously in this zone.
     *
     * The global `scheduleMicrotask` delegates to the current zone's
     * [scheduleMicrotask]. The root zone's implementation interacts with the
     * underlying system to schedule the given callback as a microtask.
     *
     * Custom zones may intercept this operation (for example to wrap the given
     * callback [action]).
     */
    scheduleMicrotask(action) {
        throw 'abstract';
    }
    /**
     * Creates a Timer where the callback is executed in this zone.
     */
    createTimer(duration, callback) {
        throw 'abstract';
    }
    /**
     * Creates a periodic Timer where the callback is executed in this zone.
     */
    createPeriodicTimer(period, callback) {
        throw 'abstract';
    }
    /**
     * Prints the given [line].
     *
     * The global `print` function delegates to the current zone's [print]
     * function which makes it possible to intercept printing.
     *
     * Example:
     * ```
     * import 'dart:async';
     *
     * main() {
     *   runZoned(() {
     *     // Ends up printing: "Intercepted: in zone".
     *     print("in zone");
     *   }, zoneSpecification: new ZoneSpecification(
     *       print: (Zone self, ZoneDelegate parent, Zone zone, String line) {
     *     parent.print(zone, "Intercepted: $line");
     *   }));
     * }
     * ```
     */
    print(line) {
        throw 'abstract';
    }
    /**
     * Call to enter the Zone.
     *
     * The previous current zone is returned.
     */
    static _enter(zone) {
        //assert(zone != null);
        //assert(!identical(zone, _current));
        let previous = this._current;
        this._current = zone;
        return previous;
    }
    /**
     * Call to leave the Zone.
     *
     * The previous Zone must be provided as `previous`.
     */
    static _leave(previous) {
        //assert(previous != null);
        DartZone_1._current = previous;
    }
    /**
     * Retrieves the zone-value associated with [key].
     *
     * If this zone does not contain the value looks up the same key in the
     * parent zone. If the [key] is not found returns `null`.
     *
     * Any object can be used as key, as long as it has compatible `operator ==`
     * and `hashCode` implementations.
     * By controlling access to the key, a zone can grant or deny access to the
     * zone value.
     */
    get(key) {
        throw 'abstract';
    }
};
/**
 * The root zone.
 *
 * All isolate entry functions (`main` or spawned functions) start running in
 * the root zone (that is, [Zone.current] is identical to [Zone.ROOT] when the
 * entry function is called). If no custom zone is created, the rest of the
 * program always runs in the root zone.
 *
 * The root zone implements the default behavior of all zone operations.
 * Many methods, like [registerCallback] do the bare minimum required of the
 * function, and are only provided as a hook for custom zones. Others, like
 * [scheduleMicrotask], interact with the underlying system to implement the
 * desired behavior.
 */
DartZone.ROOT = _ROOT_ZONE;
/** The currently running zone. */
DartZone._current = _ROOT_ZONE;
__decorate([
    namedConstructor
], DartZone.prototype, "_", null);
__decorate([
    Abstract
], DartZone.prototype, "handleUncaughtError", null);
__decorate([
    AbstractProperty
], DartZone.prototype, "parent", null);
__decorate([
    AbstractProperty
], DartZone.prototype, "errorZone", null);
__decorate([
    Abstract
], DartZone.prototype, "inSameErrorZone", null);
__decorate([
    Abstract
], DartZone.prototype, "fork", null);
__decorate([
    Abstract
], DartZone.prototype, "run", null);
__decorate([
    Abstract
], DartZone.prototype, "runUnary", null);
__decorate([
    Abstract
], DartZone.prototype, "runBinary", null);
__decorate([
    Abstract
], DartZone.prototype, "runGuarded", null);
__decorate([
    Abstract
], DartZone.prototype, "runUnaryGuarded", null);
__decorate([
    Abstract
], DartZone.prototype, "runBinaryGuarded", null);
__decorate([
    Abstract
], DartZone.prototype, "registerCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "registerUnaryCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "registerBinaryCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "bindCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "bindUnaryCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "bindBinaryCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "errorCallback", null);
__decorate([
    Abstract
], DartZone.prototype, "scheduleMicrotask", null);
__decorate([
    Abstract
], DartZone.prototype, "createTimer", null);
__decorate([
    Abstract
], DartZone.prototype, "createPeriodicTimer", null);
__decorate([
    Abstract
], DartZone.prototype, "print", null);
__decorate([
    Operator(Op.INDEX),
    Abstract
], DartZone.prototype, "get", null);
DartZone = DartZone_1 = __decorate([
    DartClass
], DartZone);
/// Initial state, waiting for a result. In this state, the
/// [resultOrListeners] field holds a single-linked list of
/// [_FutureListener] listeners.
const _INCOMPLETE = 0;
/// Pending completion. Set when completed using [_asyncComplete] or
/// [_asyncCompleteError]. It is an error to try to complete it again.
/// [resultOrListeners] holds listeners.
const _PENDING_COMPLETE = 1;
/// The future has been chained to another future. The result of that
/// other future becomes the result of this future as well.
/// [resultOrListeners] contains the source future.
const _CHAINED = 2;
/// The future has been completed with a value result.
const _VALUE = 4;
/// The future has been completed with an error result.
const _ERROR = 8;
let _Future = _Future_1 = class _Future {
    // This constructor is used by async/await.
    constructor() {
        /** Whether the future is complete, and as what. */
        this._state = _INCOMPLETE;
    }
    _init() {
        this._zone = DartZone.current;
        this._state = _INCOMPLETE;
    }
    immediate(result) {
        this._init();
        this._asyncComplete(result);
    }
    immediateError(error, stackTrace) {
        this._init();
        this._asyncCompleteError(error, stackTrace);
    }
    /** Creates a future that is already completed with the value. */
    value(value) {
        this._init();
        this._setValue(value);
    }
    get _mayComplete() {
        return this._state == _INCOMPLETE;
    }
    get _isPendingComplete() {
        return this._state == _PENDING_COMPLETE;
    }
    get _mayAddListener() {
        return this._state <= _PENDING_COMPLETE;
    }
    get _isChained() {
        return this._state == _CHAINED;
    }
    get _isComplete() {
        return this._state >= _VALUE;
    }
    get _hasError() {
        return this._state == _ERROR;
    }
    _setChained(source) {
        //assert(_mayAddListener);
        this._state = _CHAINED;
        this._resultOrListeners = source;
    }
    then(f, _) {
        let { onError } = Object.assign({}, _);
        let currentZone = DartZone.current;
        if (!identical(currentZone, _ROOT_ZONE)) {
            f = currentZone.registerUnaryCallback(f);
            if (onError != null) {
                onError = _registerErrorHandler(onError, currentZone);
            }
        }
        return this._thenNoZoneRegistration(f, onError);
    }
    // This method is used by async/await.
    _thenNoZoneRegistration(f, onError) {
        let result = new _Future_1();
        this._addListener(new _FutureListener.then(result, f, onError));
        return result;
    }
    catchError(onError, _) {
        let { test } = Object.assign({}, _);
        let result = new _Future_1();
        if (!identical(result._zone, _ROOT_ZONE)) {
            onError = _registerErrorHandler(onError, result._zone);
            if (test != null)
                test = result._zone.registerUnaryCallback(test);
        }
        this._addListener(new _FutureListener.catchError(result, onError, test));
        return result;
    }
    catch(onrejected) {
        this.catchError(onrejected);
        return undefined;
    }
    whenComplete(action) {
        let result = new _Future_1();
        if (!identical(result._zone, _ROOT_ZONE)) {
            action = result._zone.registerCallback(action);
        }
        this._addListener(new _FutureListener.whenComplete(result, action));
        return result;
    }
    asStream() {
        return new DartStream.fromFuture(this);
    }
    _setPendingComplete() {
        //assert(_mayComplete);
        this._state = _PENDING_COMPLETE;
    }
    _clearPendingComplete() {
        //assert(_isPendingComplete);
        this._state = _INCOMPLETE;
    }
    get _error() {
        //assert(_hasError);
        return this._resultOrListeners;
    }
    get _chainSource() {
        //assert(_isChained);
        return this._resultOrListeners;
    }
    // This method is used by async/await.
    _setValue(value) {
        //assert(!_isComplete); // But may have a completion pending.
        this._state = _VALUE;
        this._resultOrListeners = value;
    }
    _setErrorObject(error) {
        //assert(!_isComplete); // But may have a completion pending.
        this._state = _ERROR;
        this._resultOrListeners = error;
    }
    _setError(error, stackTrace) {
        this._setErrorObject(new DartAsyncError(error, stackTrace));
    }
    /// Copy the completion result of [source] into this future.
    ///
    /// Used when a chained future notices that its source is completed.
    _cloneResult(source) {
        //assert(!_isComplete);
        //assert(source._isComplete);
        this._state = source._state;
        this._resultOrListeners = source._resultOrListeners;
    }
    _addListener(listener) {
        //assert(listener._nextListener == null);
        if (this._mayAddListener) {
            listener._nextListener = this._resultOrListeners;
            this._resultOrListeners = listener;
        }
        else {
            if (this._isChained) {
                // Delegate listeners to chained source future.
                // If the source is complete, instead copy its values and
                // drop the chaining.
                let source = this._chainSource;
                if (!source._isComplete) {
                    source._addListener(listener);
                    return;
                }
                this._cloneResult(source);
            }
            //assert(_isComplete);
            // Handle late listeners asynchronously.
            this._zone.scheduleMicrotask(() => {
                _Future_1._propagateToListeners(this, listener);
            });
        }
    }
    _prependListeners(listeners) {
        if (listeners == null)
            return;
        if (this._mayAddListener) {
            let existingListeners = this._resultOrListeners;
            this._resultOrListeners = listeners;
            if (existingListeners != null) {
                let cursor = listeners;
                while (cursor._nextListener != null) {
                    cursor = cursor._nextListener;
                }
                cursor._nextListener = existingListeners;
            }
        }
        else {
            if (this._isChained) {
                // Delegate listeners to chained source future.
                // If the source is complete, instead copy its values and
                // drop the chaining.
                let source = this._chainSource;
                if (!source._isComplete) {
                    source._prependListeners(listeners);
                    return;
                }
                this._cloneResult(source);
            }
            //assert(_isComplete);
            listeners = this._reverseListeners(listeners);
            this._zone.scheduleMicrotask(() => {
                _Future_1._propagateToListeners(this, listeners);
            });
        }
    }
    _removeListeners() {
        // Reverse listeners before returning them, so the resulting list is in
        // subscription order.
        //assert(!_isComplete);
        let current = this._resultOrListeners;
        this._resultOrListeners = null;
        return this._reverseListeners(current);
    }
    _reverseListeners(listeners) {
        let prev = null;
        let current = listeners;
        while (current != null) {
            let next = current._nextListener;
            current._nextListener = prev;
            prev = current;
            current = next;
        }
        return prev;
    }
    // Take the value (when completed) of source and complete target with that
    // value (or error). This function could chain all Futures, but is slower
    // for _Future than _chainCoreFuture, so you must use _chainCoreFuture
    // in that case.
    static _chainForeignFuture(source, target) {
        //assert(!target._isComplete);
        //assert(source is! _Future);
        // Mark the target as chained (and as such half-completed).
        target._setPendingComplete();
        try {
            source.then((value) => {
                //assert(target._isPendingComplete);
                // The "value" may be another future if the foreign future
                // implementation is mis-behaving,
                // so use _complete instead of _completeWithValue.
                target._clearPendingComplete(); // Clear this first, it's set again.
                target._complete(value);
            }, 
            // TODO(floitsch): eventually we would like to make this non-optional
            // and dependent on the listeners of the target future. If none of
            // the target future's listeners want to have the stack trace we don't
            // need a trace.
            {
                onError: (error, stackTrace) => {
                    //assert(target._isPendingComplete);
                    target._completeError(error, stackTrace);
                }
            });
        }
        catch (e) {
            let s = new DartStackTrace(e);
            // This only happens if the `then` call threw synchronously when given
            // valid arguments.
            // That requires a non-conforming implementation of the Future interface,
            // which should, hopefully, never happen.
            scheduleMicrotask(() => {
                target._completeError(e, s);
            });
        }
    }
    // Take the value (when completed) of source and complete target with that
    // value (or error). This function expects that source is a _Future.
    static _chainCoreFuture(source, target) {
        //assert(target._mayAddListener); // Not completed, not already chained.
        while (source._isChained) {
            source = source._chainSource;
        }
        if (source._isComplete) {
            let listeners = target._removeListeners();
            target._cloneResult(source);
            this._propagateToListeners(target, listeners);
        }
        else {
            let listeners = target._resultOrListeners;
            target._setChained(source);
            source._prependListeners(listeners);
        }
    }
    _complete(value) {
        //assert(!_isComplete);
        if (is(value, Future)) {
            if (is(value, _Future_1)) {
                _Future_1._chainCoreFuture(value, this);
            }
            else {
                _Future_1._chainForeignFuture(value, this);
            }
        }
        else {
            let listeners = this._removeListeners();
            this._setValue(value /*=T*/);
            _Future_1._propagateToListeners(this, listeners);
        }
    }
    _completeWithValue(value) {
        //assert(!_isComplete);
        //assert(value is! Future);
        let listeners = this._removeListeners();
        this._setValue(value);
        _Future_1._propagateToListeners(this, listeners);
    }
    _completeError(error, stackTrace) {
        //assert(!_isComplete);
        let listeners = this._removeListeners();
        this._setError(error, stackTrace);
        _Future_1._propagateToListeners(this, listeners);
    }
    _asyncComplete(value) {
        //assert(!_isComplete);
        // Two corner cases if the value is a future:
        //   1. the future is already completed and an error.
        //   2. the future is not yet completed but might become an error.
        // The first case means that we must not immediately complete the Future,
        // as our code would immediately start propagating the error without
        // giving the time to install error-handlers.
        // However the second case requires us to deal with the value immediately.
        // Otherwise the value could complete with an error and report an
        // unhandled error, even though we know we are already going to listen to
        // it.
        if (is(value, Future)) {
            this._chainFuture(value);
            return;
        }
        let typedValue = value /*=T*/;
        this._setPendingComplete();
        this._zone.scheduleMicrotask(() => {
            this._completeWithValue(typedValue);
        });
    }
    _chainFuture(value) {
        if (is(value, _Future_1)) {
            if (value._hasError) {
                // Delay completion to allow the user to register callbacks.
                this._setPendingComplete();
                this._zone.scheduleMicrotask(() => {
                    _Future_1._chainCoreFuture(value, this);
                });
            }
            else {
                _Future_1._chainCoreFuture(value, this);
            }
            return;
        }
        // Just listen on the foreign future. This guarantees an async delay.
        _Future_1._chainForeignFuture(value, this);
    }
    _asyncCompleteError(error, stackTrace) {
        //assert(!_isComplete);
        this._setPendingComplete();
        this._zone.scheduleMicrotask(() => {
            this._completeError(error, stackTrace);
        });
    }
    /**
     * Propagates the value/error of [source] to its [listeners], executing the
     * listeners' callbacks.
     */
    static _propagateToListeners(source, listeners) {
        while (true) {
            //assert(source._isComplete);
            let hasError = source._hasError;
            if (listeners == null) {
                if (hasError) {
                    let asyncError = source._error;
                    source._zone.handleUncaughtError(asyncError.error, asyncError.stackTrace);
                }
                return;
            }
            // Usually futures only have one listener. If they have several, we
            // call handle them separately in recursive calls, continuing
            // here only when there is only one listener left.
            while (listeners._nextListener != null) {
                let listener = listeners;
                listeners = listener._nextListener;
                listener._nextListener = null;
                _Future_1._propagateToListeners(source, listener);
            }
            let listener = listeners;
            const sourceResult = source._resultOrListeners;
            // Do the actual propagation.
            // Set initial state of listenerHasError and listenerValueOrError. These
            // variables are updated with the outcome of potential callbacks.
            // Non-error results, including futures, are stored in
            // listenerValueOrError and listenerHasError is set to false. Errors
            // are stored in listenerValueOrError as an [AsyncError] and
            // listenerHasError is set to true.
            let listenerHasError = hasError;
            let listenerValueOrError = sourceResult;
            // Only if we either have an error or callbacks, go into this, somewhat
            // expensive, branch. Here we'll enter/leave the zone. Many futures
            // don't have callbacks, so this is a significant optimization.
            if (hasError || listener.handlesValue || listener.handlesComplete) {
                let zone = listener._zone;
                if (hasError && !source._zone.inSameErrorZone(zone)) {
                    // Don't cross zone boundaries with errors.
                    let asyncError = source._error;
                    source._zone
                        .handleUncaughtError(asyncError.error, asyncError.stackTrace);
                    return;
                }
                let oldZone;
                if (!identical(DartZone.current, zone)) {
                    // Change zone if it's not current.
                    oldZone = DartZone._enter(zone);
                }
                // These callbacks are abstracted to isolate the try/catch blocks
                // from the rest of the code to work around a V8 glass jaw.
                let handleWhenCompleteCallback = () => {
                    // The whenComplete-handler is not combined with normal value/error
                    // handling. This means at most one handleX method is called per
                    // listener.
                    //assert(!listener.handlesValue);
                    //assert(!listener.handlesError);
                    let completeResult;
                    try {
                        completeResult = listener.handleWhenComplete();
                    }
                    catch (e) {
                        let s = new DartStackTrace(e);
                        if (hasError && identical(source._error.error, e)) {
                            listenerValueOrError = source._error;
                        }
                        else {
                            listenerValueOrError = new DartAsyncError(e, s);
                        }
                        listenerHasError = true;
                        return;
                    }
                    if (is(completeResult, Future)) {
                        if (is(completeResult, _Future_1) && completeResult._isComplete) {
                            if (completeResult._hasError) {
                                listenerValueOrError = completeResult._error;
                                listenerHasError = true;
                            }
                            // Otherwise use the existing result of source.
                            return;
                        }
                        // We have to wait for the completeResult future to complete
                        // before knowing if it's an error or we should use the result
                        // of source.
                        let originalSource = source;
                        listenerValueOrError = completeResult.then((_) => originalSource);
                        listenerHasError = false;
                    }
                };
                let handleValueCallback = () => {
                    try {
                        listenerValueOrError = listener.handleValue(sourceResult);
                    }
                    catch (e) {
                        let s = new DartStackTrace(e);
                        listenerValueOrError = new DartAsyncError(e, s);
                        listenerHasError = true;
                    }
                };
                let handleError = () => {
                    try {
                        let asyncError = source._error;
                        if (listener.matchesErrorTest(asyncError) &&
                            listener.hasErrorCallback) {
                            listenerValueOrError = listener.handleError(asyncError);
                            listenerHasError = false;
                        }
                    }
                    catch (e) {
                        let s = new DartStackTrace(e);
                        if (identical(source._error.error, e)) {
                            listenerValueOrError = source._error;
                        }
                        else {
                            listenerValueOrError = new DartAsyncError(e, s);
                        }
                        listenerHasError = true;
                    }
                };
                if (listener.handlesComplete) {
                    handleWhenCompleteCallback();
                }
                else if (!hasError) {
                    if (listener.handlesValue) {
                        handleValueCallback();
                    }
                }
                else {
                    if (listener.handlesError) {
                        handleError();
                    }
                }
                // If we changed zone, oldZone will not be null.
                if (oldZone != null)
                    DartZone._leave(oldZone);
                // If the listener's value is a future we need to chain it. Note that
                // this can only happen if there is a callback.
                if (is(listenerValueOrError, Future)) {
                    let chainSource = listenerValueOrError;
                    // Shortcut if the chain-source is already completed. Just continue
                    // the loop.
                    let result = listener.result;
                    if (is(chainSource, _Future_1)) {
                        if (chainSource._isComplete) {
                            listeners = result._removeListeners();
                            result._cloneResult(chainSource);
                            source = chainSource;
                            continue;
                        }
                        else {
                            this._chainCoreFuture(chainSource, result);
                        }
                    }
                    else {
                        this._chainForeignFuture(chainSource, result);
                    }
                    return;
                }
            }
            let result = listener.result;
            listeners = result._removeListeners();
            if (!listenerHasError) {
                result._setValue(listenerValueOrError);
            }
            else {
                let asyncError = listenerValueOrError;
                result._setErrorObject(asyncError);
            }
            // Prepare for next round.
            source = result;
        }
    }
    timeout(timeLimit, _) {
        let { onTimeout } = Object.assign({}, _);
        if (this._isComplete)
            return new _Future_1.immediate(this);
        let result = new _Future_1();
        let timer;
        if (onTimeout == null) {
            timer = new DartTimer(timeLimit, () => {
                result._completeError(new DartTimeoutException("Future not completed", timeLimit));
            });
        }
        else {
            let zone = DartZone.current;
            onTimeout = zone.registerCallback(onTimeout);
            timer = new DartTimer(timeLimit, () => {
                try {
                    result._complete(zone.run(onTimeout));
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    result._completeError(e, s);
                }
            });
        }
        this.then((v) => {
            if (timer.isActive) {
                timer.cancel();
                result._completeWithValue(v);
            }
        }, {
            onError: (e, s) => {
                if (timer.isActive) {
                    timer.cancel();
                    result._completeError(e, s);
                }
            }
        });
        return result;
    }
};
__decorate([
    defaultConstructor
], _Future.prototype, "_init", null);
__decorate([
    namedConstructor
], _Future.prototype, "immediate", null);
__decorate([
    namedConstructor
], _Future.prototype, "immediateError", null);
__decorate([
    namedConstructor
], _Future.prototype, "value", null);
_Future = _Future_1 = __decorate([
    DartClass,
    Implements(Future)
], _Future);
Future._nullFuture = new _Future.value(null);
let _Completer = class _Completer {
    constructor() {
        this.future = new _Future();
    }
    complete(value) {
        throw 'abstract';
    }
    completeError(error, stackTrace) {
        error = _nonNullError(error);
        if (!this.future._mayComplete)
            throw new StateError("Future already completed");
        let replacement = DartZone.current.errorCallback(error, stackTrace);
        if (replacement != null) {
            error = _nonNullError(replacement.error);
            stackTrace = replacement.stackTrace;
        }
        this._completeError(error, stackTrace);
    }
    _completeError(error, stackTrace) {
        throw 'absttact';
    }
    // The future's _isComplete doesn't take into account pending completions.
    // We therefore use _mayComplete.
    get isCompleted() {
        return !this.future._mayComplete;
    }
};
__decorate([
    Abstract
], _Completer.prototype, "complete", null);
__decorate([
    Abstract
], _Completer.prototype, "_completeError", null);
_Completer = __decorate([
    DartClass
], _Completer);
class _AsyncCompleter extends _Completer {
    complete(value) {
        if (!this.future._mayComplete)
            throw new StateError("Future already completed");
        this.future._asyncComplete(value);
    }
    _completeError(error, stackTrace) {
        this.future._asyncCompleteError(error, stackTrace);
    }
}
class _SyncCompleter extends _Completer {
    complete(value) {
        if (!this.future._mayComplete)
            throw new StateError("Future already completed");
        this.future._complete(value);
    }
    _completeError(error, stackTrace) {
        this.future._completeError(error, stackTrace);
    }
}
const MASK_VALUE = 1;
const MASK_ERROR = 2;
const MASK_TEST_ERROR = 4;
const MASK_WHENCOMPLETE = 8;
const STATE_CHAIN = 0;
const STATE_THEN = MASK_VALUE;
const STATE_THEN_ONERROR = MASK_VALUE | MASK_ERROR;
const STATE_CATCHERROR = MASK_ERROR;
const STATE_CATCHERROR_TEST = MASK_ERROR | MASK_TEST_ERROR;
const STATE_WHENCOMPLETE = MASK_WHENCOMPLETE;
let _FutureListener = class _FutureListener {
    constructor() {
        // Listeners on the same future are linked through this link.
        this._nextListener = null;
    }
    then(result, onValue, errorCallback) {
        this.result = result;
        this.callback = onValue;
        this.errorCallback = errorCallback;
        this.state = (errorCallback == null) ? STATE_THEN : STATE_THEN_ONERROR;
    }
    catchError(result, errorCallback, test) {
        this.result = result;
        this.errorCallback = errorCallback;
        this.callback = test;
        this.state = (test == null) ? STATE_CATCHERROR : STATE_CATCHERROR_TEST;
    }
    whenComplete(result, onComplete) {
        this.result = result;
        this.callback = onComplete;
        this.errorCallback = null;
        this.state = STATE_WHENCOMPLETE;
    }
    get _zone() {
        return this.result._zone;
    }
    get handlesValue() {
        return (this.state & MASK_VALUE) != 0;
    }
    get handlesError() {
        return (this.state & MASK_ERROR) != 0;
    }
    get hasErrorTest() {
        return (this.state == STATE_CATCHERROR_TEST);
    }
    get handlesComplete() {
        return (this.state == STATE_WHENCOMPLETE);
    }
    get _onValue() {
        //assert(handlesValue);
        return this.callback /*=_FutureOnValue<S, T>*/;
    }
    get _onError() {
        return this.errorCallback;
    }
    get _errorTest() {
        //assert(hasErrorTest);
        return this.callback /*=_FutureErrorTest*/;
    }
    get _whenCompleteAction() {
        //assert(handlesComplete);
        return this.callback /*=_FutureAction*/;
    }
    /// Whether this listener has an error callback.
    ///
    /// This function must only be called if the listener [handlesError].
    get hasErrorCallback() {
        //assert(handlesError);
        return this._onError != null;
    }
    handleValue(sourceResult) {
        return this._zone.runUnary(this._onValue, sourceResult);
    }
    matchesErrorTest(asyncError) {
        if (!this.hasErrorTest)
            return true;
        return this._zone.runUnary(this._errorTest, asyncError.error);
    }
    handleError(asyncError) {
        //assert(handlesError && hasErrorCallback);
        // NOTE(dart2ts): we cannot distinguish, use always binary
        //if (is(this.errorCallback, ZoneBinaryCallback)) {
        let typedErrorCallback = this.errorCallback;
        return this._zone.runBinary(typedErrorCallback, asyncError.error, asyncError.stackTrace);
        //} else {
        //    return this._zone.runUnary<FutureOr<T>, any>(
        //        this.errorCallback, asyncError.error);
        //}
    }
    handleWhenComplete() {
        //assert(!handlesError);
        return this._zone.run(this._whenCompleteAction);
    }
};
__decorate([
    namedConstructor
], _FutureListener.prototype, "then", null);
__decorate([
    namedConstructor
], _FutureListener.prototype, "catchError", null);
__decorate([
    namedConstructor
], _FutureListener.prototype, "whenComplete", null);
_FutureListener = __decorate([
    DartClass
], _FutureListener);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.async;
/**
 * A count-down timer that can be configured to fire once or repeatedly.
 *
 * The timer counts down from the specified duration to 0.
 * When the timer reaches 0, the timer invokes the specified callback function.
 * Use a periodic timer to repeatedly count down the same interval.
 *
 * A negative duration is treated the same as a duration of 0.
 * If the duration is statically known to be 0, consider using [run].
 *
 * Frequently the duration is either a constant or computed as in the
 * following example (taking advantage of the multiplication operator of
 * the [Duration] class):
 *
 *     const TIMEOUT = const Duration(seconds: 3);
 *     const ms = const Duration(milliseconds: 1);
 *
 *     startTimeout([int milliseconds]) {
 *       var duration = milliseconds == null ? TIMEOUT : ms * milliseconds;
 *       return new Timer(duration, handleTimeout);
 *     }
 *     ...
 *     void handleTimeout() {  // callback function
 *       ...
 *     }
 *
 * Note: If Dart code using Timer is compiled to JavaScript, the finest
 * granularity available in the browser is 4 milliseconds.
 *
 * See [Stopwatch] for measuring elapsed time.
 */
let DartTimer = DartTimer_1 = class DartTimer {
    constructor(duration, callback) {
    }
    /**
     * Creates a new timer.
     *
     * The [callback] function is invoked after the given [duration].
     *
     */
    static _create(duration, callback) {
        if (DartZone.current == DartZone.ROOT) {
            // No need to bind the callback. We know that the root's timer will
            // be invoked in the root zone.
            return DartZone.current.createTimer(duration, callback);
        }
        return DartZone.current.createTimer(duration, DartZone.current.bindCallback(callback, { runGuarded: true }));
    }
    /**
     * Creates a new repeating timer.
     *
     * The [callback] is invoked repeatedly with [duration] intervals until
     * canceled with the [cancel] function.
     *
     * The exact timing depends on the underlying timer implementation.
     * No more than `n` callbacks will be made in `duration * n` time,
     * but the time between two consecutive callbacks
     * can be shorter and longer than `duration`.
     *
     * In particular, an implementation may schedule the next callback, e.g.,
     * a `duration` after either when the previous callback ended,
     * when the previous callback started, or when the previous callback was
     * scheduled for - even if the actual callback was delayed.
     */
    static _periodic(duration, callback) {
        if (DartZone.current == DartZone.ROOT) {
            // No need to bind the callback. We know that the root's timer will
            // be invoked in the root zone.
            return DartZone.current.createPeriodicTimer(duration, callback);
        }
        // TODO(floitsch): the return type should be 'void', and the type
        // should be inferred.
        let boundCallback = DartZone.current
            .bindUnaryCallback(callback, { runGuarded: true });
        return DartZone.current.createPeriodicTimer(duration, boundCallback);
    }
    /**
     * Runs the given [callback] asynchronously as soon as possible.
     *
     * This function is equivalent to `new Timer(Duration.ZERO, callback)`.
     */
    static run(callback) {
        new DartTimer_1(DartDuration.ZERO, callback);
    }
    /**
     * Cancels the timer.
     */
    cancel() {
    }
    /**
     * Returns whether the timer is still active.
     *
     * A non-periodic timer is active if the callback has not been executed,
     * and the timer has not been canceled.
     *
     * A periodic timer is active if it has not been canceled.
     */
    get isActive() {
        throw 'abstract';
    }
    //@patch
    static _createTimer(duration, callback) {
        let milliseconds = duration.inMilliseconds;
        if (milliseconds < 0)
            milliseconds = 0;
        return new TimerImpl(milliseconds, callback);
    }
    //@patch
    static _createPeriodicTimer(duration, callback) {
        let milliseconds = duration.inMilliseconds;
        if (milliseconds < 0)
            milliseconds = 0;
        return new TimerImpl.periodic(milliseconds, callback);
    }
};
__decorate([
    Abstract
], DartTimer.prototype, "cancel", null);
__decorate([
    AbstractProperty
], DartTimer.prototype, "isActive", null);
__decorate([
    defaultFactory
], DartTimer, "_create", null);
__decorate([
    namedFactory
], DartTimer, "_periodic", null);
DartTimer = DartTimer_1 = __decorate([
    DartClass
], DartTimer);
/** Pair of error and stack trace. Returned by [Zone.errorCallback]. */
class DartAsyncError extends Error {
    constructor(error, stackTrace) {
        super();
        this.error = error;
        this.stackTrace = stackTrace;
    }
    toString() {
        return `${this.error}`;
    }
}
class _ZoneFunction {
    constructor(zone, f) {
        this.zone = zone;
        this.function = f;
    }
}
/**
 * This class provides the specification for a forked zone.
 *
 * When forking a new zone (see [Zone.fork]) one can override the default
 * behavior of the zone by providing callbacks. These callbacks must be
 * given in an instance of this class.
 *
 * Handlers have the same signature as the same-named methods on [Zone] but
 * receive three additional arguments:
 *
 *   1. the zone the handlers are attached to (the "self" zone).
 *   2. a [ZoneDelegate] to the parent zone.
 *   3. the zone that first received the request (before the request was
 *     bubbled up).
 *
 * Handlers can either stop propagation the request (by simply not calling the
 * parent handler), or forward to the parent zone, potentially modifying the
 * arguments on the way.
 */
let DartZoneSpecification = DartZoneSpecification_1 = class DartZoneSpecification {
    constructor(_) {
    }
    /**
     * Creates a specification with the provided handlers.
     */
    static _create(_) {
        return new _ZoneSpecification(_);
    }
    /**
     * Creates a specification from [other] with the provided handlers overriding
     * the ones in [other].
     */
    static _from(other, _) {
        return new DartZoneSpecification_1(Object.assign({
            handleUncaughtError: other.handleUncaughtError,
            run: other.run,
            runUnary: other.runUnary,
            runBinary: other.runBinary,
            registerCallback: other.registerCallback,
            registerUnaryCallback: other.registerUnaryCallback,
            registerBinaryCallback: other.registerBinaryCallback,
            errorCallback: other.errorCallback,
            scheduleMicrotask: other.scheduleMicrotask,
            createTimer: other.createTimer,
            createPeriodicTimer: other.createPeriodicTimer,
            print: other.print,
            fork: other.fork
        }, _));
    }
    get handleUncaughtError() {
        throw 'abstract';
    }
    get run() {
        throw 'abstract';
    }
    get runUnary() {
        throw 'abstract';
    }
    get runBinary() {
        throw 'abstract';
    }
    get registerCallback() {
        throw 'abstract';
    }
    get registerUnaryCallback() {
        throw 'abstract';
    }
    get registerBinaryCallback() {
        throw 'abstract';
    }
    get errorCallback() {
        throw 'abstract';
    }
    get scheduleMicrotask() {
        throw 'abstract';
    }
    get createTimer() {
        throw 'abstract';
    }
    get createPeriodicTimer() {
        throw 'abstract';
    }
    get print() {
        throw 'abstract';
    }
    get fork() {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "handleUncaughtError", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "run", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "runUnary", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "runBinary", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "registerCallback", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "registerUnaryCallback", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "registerBinaryCallback", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "errorCallback", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "scheduleMicrotask", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "createTimer", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "createPeriodicTimer", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "print", null);
__decorate([
    AbstractProperty
], DartZoneSpecification.prototype, "fork", null);
__decorate([
    defaultFactory
], DartZoneSpecification, "_create", null);
__decorate([
    namedFactory
], DartZoneSpecification, "_from", null);
DartZoneSpecification = DartZoneSpecification_1 = __decorate([
    DartClass
], DartZoneSpecification);
/**
 * Internal [ZoneSpecification] class.
 *
 * The implementation wants to rely on the fact that the getters cannot change
 * dynamically. We thus require users to go through the redirecting
 * [ZoneSpecification] constructor which instantiates this class.
 */
class _ZoneSpecification {
    constructor(_) {
        this.handleUncaughtError = _.handleUncaughtError;
        this.run = _.run;
        this.runUnary = _.runUnary;
        this.runBinary = _.runBinary;
        this.registerCallback = _.registerCallback;
        this.registerUnaryCallback = _.registerUnaryCallback;
        this.registerBinaryCallback = _.registerBinaryCallback;
        this.errorCallback = _.errorCallback;
        this.scheduleMicrotask = _.scheduleMicrotask;
        this.createTimer = _.createTimer;
        this.createPeriodicTimer = _.createPeriodicTimer;
        this.print = _.print;
        this.fork = _.fork;
    }
}
function _parentDelegate(zone) {
    if (zone.parent == null)
        return null;
    return zone.parent._delegate;
}
class _ZoneDelegate {
    constructor(_delegationTarget) {
        this._delegationTarget = _delegationTarget;
    }
    handleUncaughtError(zone, error, stackTrace) {
        let implementation = this._delegationTarget._handleUncaughtError;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, error, stackTrace) /*=R*/;
    }
    run(zone, f) {
        let implementation = this._delegationTarget._run;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f) /*=R*/;
    }
    runUnary(zone, f, arg) {
        let implementation = this._delegationTarget._runUnary;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f, arg) /*=R*/;
    }
    runBinary(zone, f, arg1, arg2) {
        let implementation = this._delegationTarget._runBinary;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f, arg1, arg2) /*=R*/;
    }
    registerCallback(zone, f) {
        let implementation = this._delegationTarget._registerCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f) /*=ZoneCallback<R>*/;
    }
    registerUnaryCallback(zone, f) {
        let implementation = this._delegationTarget._registerUnaryCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f) /*=ZoneUnaryCallback<R, T>*/;
    }
    registerBinaryCallback(zone, f) {
        let implementation = this._delegationTarget._registerBinaryCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f) /*=ZoneBinaryCallback<R, T1, T2>*/;
    }
    errorCallback(zone, error, stackTrace) {
        let implementation = this._delegationTarget._errorCallback;
        let implZone = implementation.zone;
        if (identical(implZone, _ROOT_ZONE))
            return null;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, error, stackTrace);
    }
    scheduleMicrotask(zone, f) {
        let implementation = this._delegationTarget._scheduleMicrotask;
        let implZone = implementation.zone;
        let handler = implementation.function;
        handler(implZone, _parentDelegate(implZone), zone, f);
    }
    createTimer(zone, duration, f) {
        let implementation = this._delegationTarget._createTimer;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, duration, f);
    }
    createPeriodicTimer(zone, period, f) {
        let implementation = this._delegationTarget._createPeriodicTimer;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, period, f);
    }
    print(zone, line) {
        let implementation = this._delegationTarget._print;
        let implZone = implementation.zone;
        let handler = implementation.function;
        handler(implZone, _parentDelegate(implZone), zone, line);
    }
    fork(zone, specification, zoneValues) {
        let implementation = this._delegationTarget._fork;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, specification, zoneValues);
    }
}
class _CustomZone extends _Zone {
    constructor(parent, specification, _map) {
        super();
        this.parent = parent;
        this._map = _map;
        // The root zone will have implementations of all parts of the
        // specification, so it will never try to access the (null) parent.
        // All other zones have a non-null parent.
        this._run = (specification.run != null)
            ? new _ZoneFunction(this, specification.run)
            : parent._run;
        this._runUnary = (specification.runUnary != null)
            ? new _ZoneFunction(this, specification.runUnary)
            : parent._runUnary;
        this._runBinary = (specification.runBinary != null)
            ? new _ZoneFunction(this, specification.runBinary)
            : parent._runBinary;
        this._registerCallback = (specification.registerCallback != null)
            ? new _ZoneFunction(this, specification.registerCallback)
            : parent._registerCallback;
        this._registerUnaryCallback = (specification.registerUnaryCallback != null)
            ? new _ZoneFunction(this, specification.registerUnaryCallback)
            : parent._registerUnaryCallback;
        this._registerBinaryCallback = (specification.registerBinaryCallback != null)
            ? new _ZoneFunction(this, specification.registerBinaryCallback)
            : parent._registerBinaryCallback;
        this._errorCallback = (specification.errorCallback != null)
            ? new _ZoneFunction(this, specification.errorCallback)
            : parent._errorCallback;
        this._scheduleMicrotask = (specification.scheduleMicrotask != null)
            ? new _ZoneFunction(this, specification.scheduleMicrotask)
            : parent._scheduleMicrotask;
        this._createTimer = (specification.createTimer != null)
            ? new _ZoneFunction(this, specification.createTimer)
            : parent._createTimer;
        this._createPeriodicTimer = (specification.createPeriodicTimer != null)
            ? new _ZoneFunction(this, specification.createPeriodicTimer)
            : parent._createPeriodicTimer;
        this._print = (specification.print != null)
            ? new _ZoneFunction(this, specification.print)
            : parent._print;
        this._fork = (specification.fork != null)
            ? new _ZoneFunction(this, specification.fork)
            : parent._fork;
        this._handleUncaughtError = (specification.handleUncaughtError != null)
            ? new _ZoneFunction(this, specification.handleUncaughtError)
            : parent._handleUncaughtError;
    }
    get _delegate() {
        if (this._delegateCache != null)
            return this._delegateCache;
        this._delegateCache = new _ZoneDelegate(this);
        return this._delegateCache;
    }
    /**
     * The closest error-handling zone.
     *
     * Returns `this` if `this` has an error-handler. Otherwise returns the
     * parent's error-zone.
     */
    get errorZone() {
        return this._handleUncaughtError.zone;
    }
    runGuarded(f) {
        try {
            return this.run(f);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    runUnaryGuarded(f, arg) {
        try {
            return this.runUnary(f, arg);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    runBinaryGuarded(f, arg1, arg2) {
        try {
            return this.runBinary(f, arg1, arg2);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }
    bindCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        let registered = this.registerCallback(f);
        if (runGuarded) {
            return () => this.runGuarded(registered);
        }
        else {
            return () => this.run(registered);
        }
    }
    bindUnaryCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        let registered = this.registerUnaryCallback(f);
        if (runGuarded) {
            return (arg) => this.runUnaryGuarded(registered, arg);
        }
        else {
            return (arg) => this.runUnary(registered, arg);
        }
    }
    bindBinaryCallback(f, _) {
        let { runGuarded } = Object.assign({ runGuarded: true }, _);
        let registered = this.registerBinaryCallback(f);
        if (runGuarded) {
            return (arg1, arg2) => this.runBinaryGuarded(registered, arg1, arg2);
        }
        else {
            return (arg1, arg2) => this.runBinary(registered, arg1, arg2);
        }
    }
    get(key) {
        let result = this._map.get(key);
        if (result != null || this._map.containsKey(key))
            return result;
        // If we are not the root zone, look up in the parent zone.
        if (this.parent != null) {
            // We do not optimize for repeatedly looking up a key which isn't
            // there. That would require storing the key and keeping it alive.
            // Copying the key/value from the parent does not keep any new values
            // alive.
            let value = this.parent.get(key);
            if (value != null) {
                this._map[OperatorMethods.INDEX_EQ](key, value);
            }
            return value;
        }
        //assert(this == _ROOT_ZONE);
        return null;
    }
    // Methods that can be customized by the zone specification.
    handleUncaughtError(error, stackTrace) {
        let implementation = this._handleUncaughtError;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, error, stackTrace) /*=R*/;
    }
    fork(_) {
        let { specification, zoneValues } = Object.assign({}, _);
        let implementation = this._fork;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, specification, zoneValues);
    }
    run(f) {
        let implementation = this._run;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f) /*=R*/;
    }
    runUnary(f, arg) {
        let implementation = this._runUnary;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f, arg) /*=R*/;
    }
    runBinary(f, arg1, arg2) {
        let implementation = this._runBinary;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f, arg1, arg2) /*=R*/;
    }
    registerCallback(callback) {
        let implementation = this._registerCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback) /*=ZoneCallback<R>*/;
    }
    registerUnaryCallback(callback) {
        let implementation = this._registerUnaryCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback) /*=ZoneUnaryCallback<R, T>*/;
    }
    registerBinaryCallback(callback) {
        let implementation = this._registerBinaryCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback) /*=ZoneBinaryCallback<R, T1, T2>*/;
    }
    errorCallback(error, stackTrace) {
        let implementation = this._errorCallback;
        //assert(implementation != null);
        let implementationZone = implementation.zone;
        if (identical(implementationZone, _ROOT_ZONE))
            return null;
        let parentDelegate = _parentDelegate(implementationZone);
        let handler = implementation.function;
        return handler(implementationZone, parentDelegate, this, error, stackTrace);
    }
    scheduleMicrotask(f) {
        let implementation = this._scheduleMicrotask;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, f);
    }
    createTimer(duration, f) {
        let implementation = this._createTimer;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, duration, f);
    }
    createPeriodicTimer(duration, f) {
        let implementation = this._createPeriodicTimer;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, duration, f);
    }
    print(line) {
        let implementation = this._print;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, line);
    }
}
__decorate([
    Operator(Op.INDEX)
], _CustomZone.prototype, "get", null);
function _rootHandleUncaughtError(self, parent, zone, error, stackTrace) {
    _schedulePriorityAsyncCallback(() => {
        if (error == null)
            error = new NullThrownError();
        if (stackTrace == null)
            throw error;
        _rethrow(error, stackTrace);
    });
    return null;
}
// @patch
function _rethrow(error, stackTrace) {
    // TODO:
    // error = wrapException(error);
    error.stack = stackTrace.toString();
    //JS("void", "#.stack = #", error, stackTrace.toString());
    //JS("void", "throw #", error);
    throw error;
}
function _rootRun(self, parent, zone, f) {
    if (DartZone._current === zone)
        return f();
    let old = DartZone._enter(zone);
    try {
        return f();
    }
    finally {
        DartZone._leave(old);
    }
}
function _rootRunUnary(self, parent, zone, f, arg) {
    if (DartZone._current === zone)
        return f(arg);
    let old = DartZone._enter(zone);
    try {
        return f(arg);
    }
    finally {
        DartZone._leave(old);
    }
}
function _rootRunBinary(self, parent, zone, f, arg1, arg2) {
    if (DartZone._current === zone)
        return f(arg1, arg2);
    let old = DartZone._enter(zone);
    try {
        return f(arg1, arg2);
    }
    finally {
        DartZone._leave(old);
    }
}
function _rootRegisterCallback(self, parent, zone, f) {
    return f;
}
function _rootRegisterUnaryCallback(self, parent, zone, f) {
    return f;
}
function _rootRegisterBinaryCallback(self, parent, zone, f) {
    return f;
}
function _rootErrorCallback(self, parent, zone, error, stackTrace) {
    return null;
}
function _rootScheduleMicrotask(self, parent, zone, f) {
    if (!identical(_ROOT_ZONE, zone)) {
        let hasErrorHandler = !_ROOT_ZONE.inSameErrorZone(zone);
        f = zone.bindCallback(f, { runGuarded: hasErrorHandler });
        // Use root zone as event zone if the function is already bound.
        zone = _ROOT_ZONE;
    }
    _scheduleAsyncCallback(f);
}
function _rootCreateTimer(self, parent, zone, duration, callback) {
    if (!identical(_ROOT_ZONE, zone)) {
        callback = zone.bindCallback(callback);
    }
    return DartTimer._createTimer(duration, callback);
}
function _rootCreatePeriodicTimer(self, parent, zone, duration, callback) {
    if (!identical(_ROOT_ZONE, zone)) {
        // TODO(floitsch): the return type should be 'void'.
        callback = zone.bindUnaryCallback(callback);
    }
    return DartTimer._createPeriodicTimer(duration, callback);
}
function _rootPrint(self, parent, zone, line) {
    printToConsole(line);
}
function _printToZone(line) {
    DartZone.current.print(line);
}
function _rootFork(self, parent, zone, specification, zoneValues) {
    // TODO(floitsch): it would be nice if we could get rid of this hack.
    // Change the static zoneOrDirectPrint function to go through zones
    // from now on.
    printToZone.value = _printToZone;
    if (specification == null) {
        specification = new DartZoneSpecification();
    }
    else if (isNot(specification, _ZoneSpecification)) {
        throw new ArgumentError("ZoneSpecifications must be instantiated" +
            " with the provided constructor.");
    }
    let valueMap;
    if (zoneValues == null) {
        if (is(zone, _Zone)) {
            valueMap = zone._map;
        }
        else {
            valueMap = new DartHashMap();
        }
    }
    else {
        valueMap = new DartHashMap.from(zoneValues);
    }
    return new _CustomZone(zone, specification, valueMap);
}
/**
 * Runs [body] in its own zone.
 *
 * If [onError] is non-null the zone is considered an error zone. All uncaught
 * errors, synchronous or asynchronous, in the zone are caught and handled
 * by the callback.
 *
 * Errors may never cross error-zone boundaries. This is intuitive for leaving
 * a zone, but it also applies for errors that would enter an error-zone.
 * Errors that try to cross error-zone boundaries are considered uncaught.
 *
 *     var future = new Future.value(499);
 *     runZoned(() {
 *       future = future.then((_) { throw "error in first error-zone"; });
 *       runZoned(() {
 *         future = future.catchError((e) { print("Never reached!"); });
 *       }, onError: (e) { print("unused error handler"); });
 *     }, onError: (e) { print("catches error of first error-zone."); });
 *
 * Example:
 *
 *     runZoned(() {
 *       new Future(() { throw "asynchronous error"; });
 *     }, onError: print);  // Will print "asynchronous error".
 */
function runZoned(body, _) {
    let { zoneValues, zoneSpecification, onError } = Object.assign({}, _);
    let errorHandler;
    if (onError != null) {
        errorHandler = (self, parent, zone, error, stackTrace) => {
            try {
                // NOTE(dart2ts): we have no way to distinguish, use binary always
                // TODO(floitsch): the return type should be 'void'.
                //if (is(onError ,ZoneBinaryCallback)) {
                return self.parent.runBinary(onError, error, stackTrace);
                //}
                //return self.parent.runUnary(onError, error);
            }
            catch (e) {
                let s = new DartStackTrace(e);
                if (identical(e, error)) {
                    return parent.handleUncaughtError(zone, error, stackTrace);
                }
                else {
                    return parent.handleUncaughtError(zone, e, s);
                }
            }
        };
    }
    if (zoneSpecification == null) {
        zoneSpecification =
            new DartZoneSpecification({ handleUncaughtError: errorHandler });
    }
    else if (errorHandler != null) {
        zoneSpecification = new DartZoneSpecification.from(zoneSpecification, { handleUncaughtError: errorHandler });
    }
    let zone = DartZone.current
        .fork({ specification: zoneSpecification, zoneValues: zoneValues });
    if (onError != null) {
        return zone.runGuarded(body);
    }
    else {
        return zone.run(body);
    }
}
class _AsyncCallbackEntry {
    constructor(callback) {
        this.callback = callback;
    }
}
/** Head of single linked list of pending callbacks. */
let _nextCallback;
/** Tail of single linked list of pending callbacks. */
let _lastCallback;
/**
 * Tail of priority callbacks added by the currently executing callback.
 *
 * Priority callbacks are put at the beginning of the
 * callback queue, so that if one callback schedules more than one
 * priority callback, they are still enqueued in scheduling order.
 */
let _lastPriorityCallback;
/**
 * Whether we are currently inside the callback loop.
 *
 * If we are inside the loop, we never need to schedule the loop,
 * even if adding a first element.
 */
let _isInCallbackLoop = false;
function _microtaskLoop() {
    while (_nextCallback != null) {
        _lastPriorityCallback = null;
        let entry = _nextCallback;
        _nextCallback = entry.next;
        if (_nextCallback == null)
            _lastCallback = null;
        (entry.callback)();
    }
}
function _startMicrotaskLoop() {
    _isInCallbackLoop = true;
    try {
        // Moved to separate function because try-finally prevents
        // good optimization.
        _microtaskLoop();
    }
    finally {
        _lastPriorityCallback = null;
        _isInCallbackLoop = false;
        if (_nextCallback != null) {
            _AsyncRun._scheduleImmediate(_startMicrotaskLoop);
        }
    }
}
/**
 * Schedules a callback to be called as a microtask.
 *
 * The microtask is called after all other currently scheduled
 * microtasks, but as part of the current system event.
 */
function _scheduleAsyncCallback(callback) {
    let newEntry = new _AsyncCallbackEntry(callback);
    if (_nextCallback == null) {
        _nextCallback = _lastCallback = newEntry;
        if (!_isInCallbackLoop) {
            _AsyncRun._scheduleImmediate(_startMicrotaskLoop);
        }
    }
    else {
        _lastCallback.next = newEntry;
        _lastCallback = newEntry;
    }
}
/**
 * Schedules a callback to be called before all other currently scheduled ones.
 *
 * This callback takes priority over existing scheduled callbacks.
 * It is only used internally to give higher priority to error reporting.
 *
 * Is always run in the root zone.
 */
function _schedulePriorityAsyncCallback(callback) {
    if (_nextCallback == null) {
        _scheduleAsyncCallback(callback);
        _lastPriorityCallback = _lastCallback;
        return;
    }
    let entry = new _AsyncCallbackEntry(callback);
    if (_lastPriorityCallback == null) {
        entry.next = _nextCallback;
        _nextCallback = _lastPriorityCallback = entry;
    }
    else {
        entry.next = _lastPriorityCallback.next;
        _lastPriorityCallback.next = entry;
        _lastPriorityCallback = entry;
        if (entry.next == null) {
            _lastCallback = entry;
        }
    }
}
/**
 * Runs a function asynchronously.
 *
 * Callbacks registered through this function are always executed in order and
 * are guaranteed to run before other asynchronous events (like [Timer] events,
 * or DOM events).
 *
 * **Warning:** it is possible to starve the DOM by registering asynchronous
 * callbacks through this method. For example the following program runs
 * the callbacks without ever giving the Timer callback a chance to execute:
 *
 *     main() {
 *       Timer.run(() { print("executed"); });  // Will never be executed.
 *       foo() {
 *         scheduleMicrotask(foo);  // Schedules [foo] in front of other events.
 *       }
 *       foo();
 *     }
 *
 * ## Other resources
 *
 * * [The Event Loop and Dart](https://www.dartlang.org/articles/event-loop/):
 * Learn how Dart handles the event queue and microtask queue, so you can write
 * better asynchronous code with fewer surprises.
 */
function scheduleMicrotask(callback) {
    let currentZone = DartZone.current;
    if (identical(_ROOT_ZONE, currentZone)) {
        // No need to bind the callback. We know that the root's scheduleMicrotask
        // will be invoked in the root zone.
        _rootScheduleMicrotask(null, null, _ROOT_ZONE, callback);
        return;
    }
    let implementation = currentZone._scheduleMicrotask;
    if (identical(_ROOT_ZONE, implementation.zone) &&
        _ROOT_ZONE.inSameErrorZone(currentZone)) {
        _rootScheduleMicrotask(null, null, currentZone, currentZone.registerCallback(callback));
        return;
    }
    DartZone.current
        .scheduleMicrotask(DartZone.current.bindCallback(callback, { runGuarded: true }));
}
class _AsyncRun {
    /** Schedule the given callback before any other event in the event-loop. */
    static _scheduleImmediate(callback) {
        this._scheduleImmediateClosure(callback);
    }
    static _initializeScheduleImmediate() {
        requiresPreamble();
        //  let self = global || window;
        // @ts-ignore
        if (self.scheduleImmediate /*JS('', 'self.scheduleImmediate')*/ != null) {
            return _AsyncRun._scheduleImmediateJsOverride;
        }
        // @ts-ignore
        if (self.MutationObserver /*JS('', 'self.MutationObserver') */ != null &&
            self.document /*JS('', 'self.document')*/ != null) {
            // Use mutationObservers.
            let div = self.document.createElement('div') /*JS('', 'self.document.createElement("div")')*/;
            let span = self.document.createElement('span') /*JS('', 'self.document.createElement("span")')*/;
            let storedCallback;
            let internalCallback = (_) => {
                leaveJsAsync();
                let f = storedCallback;
                storedCallback = null;
                f();
            };
            // @ts-ignore
            let observer = new self.MutationObserver(convertDartClosureToJS(internalCallback, 1)) /* JS('', 'new self.MutationObserver(#)',
            convertDartClosureToJS(internalCallback, 1))*/;
            //JS('', '#.observe(#, { childList: true })', observer, div);
            observer.observe(div, { childList: true });
            return (callback) => {
                //assert(storedCallback == null);
                enterJsAsync();
                storedCallback = callback;
                // Because of a broken shadow-dom polyfill we have to change the
                // children instead a cheap property.
                // See https://github.com/Polymer/ShadowDOM/issues/468
                //JS('', '#.firstChild ? #.removeChild(#): #.appendChild(#)', div, div,
                //    span, div, span);
                div.firstChild ? div.removeChild(span) : div.appendChild(span);
            };
        }
        else if (self.setImmediate /*JS('', 'self.setImmediate')*/ != null) {
            return _AsyncRun._scheduleImmediateWithSetImmediate;
        }
        // TODO(20055): We should use DOM promises when available.
        return _AsyncRun._scheduleImmediateWithTimer;
    }
    static _scheduleImmediateJsOverride(callback) {
        let internalCallback = () => {
            leaveJsAsync();
            callback();
        };
        enterJsAsync();
        //JS('void', 'self.scheduleImmediate(#)',
        //    convertDartClosureToJS(internalCallback, 0));
        // @ts-ignore
        self.scheduleImmediate(convertDartClosureToJS(internalCallback, 0));
    }
    static _scheduleImmediateWithSetImmediate(callback) {
        let internalCallback = () => {
            leaveJsAsync();
            callback();
        };
        enterJsAsync();
        //JS('void', 'self.setImmediate(#)',
        //    convertDartClosureToJS(internalCallback, 0));
        self.setImmediate(convertDartClosureToJS(internalCallback, 0));
    }
    static _scheduleImmediateWithTimer(callback) {
        DartTimer._createTimer(DartDuration.ZERO, callback);
    }
}
// Lazily initialized.
_AsyncRun._scheduleImmediateClosure = _AsyncRun._initializeScheduleImmediate();
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.async;
function _invokeErrorHandler(errorHandler, error, stackTrace) {
    // can't distinguish ... use the first form always
    //if (errorHandler is ZoneBinaryCallback<dynamic, Null, Null>) {
    return errorHandler(error, stackTrace);
    //} else {
    //    ZoneUnaryCallback unaryErrorHandler = errorHandler;
    //    return unaryErrorHandler(error);
    // }
}
function _registerErrorHandler(errorHandler, zone) {
    //if (errorHandler is ZoneBinaryCallback<dynamic, Null, Null>) {
    return zone.registerBinaryCallback(errorHandler /*=ZoneBinaryCallback<R, Object, StackTrace>*/);
    //} else {
    //    return zone.registerUnaryCallback<R, Object>(
    //        errorHandler as dynamic/*=ZoneUnaryCallback<R, Object>*/);
    //}
}
/**
 * A source of asynchronous data events.
 *
 * A Stream provides a way to receive a sequence of events.
 * Each event is either a data event or an error event,
 * representing the result of a single computation.
 * When the events provided by a Stream have all been sent,
 * a single "done" event will mark the end.
 *
 * You can [listen] on a stream to make it start generating events,
 * and to set up listeners that receive the events.
 * When you listen, you receive a [StreamSubscription] object
 * which is the active object providing the events,
 * and which can be used to stop listening again,
 * or to temporarily pause events from the subscription.
 *
 * There are two kinds of streams: "Single-subscription" streams and
 * "broadcast" streams.
 *
 * *A single-subscription stream* allows only a single listener during the whole
 * lifetime of the stream.
 * It doesn't start generating events until it has a listener,
 * and it stops sending events when the listener is unsubscribed,
 * even if the source of events could still provide more.
 *
 * Listening twice on a single-subscription stream is not allowed, even after
 * the first subscription has been canceled.
 *
 * Single-subscription streams are generally used for streaming chunks of
 * larger contiguous data like file I/O.
 *
 * *A broadcast stream* allows any number of listeners, and it fires
 * its events when they are ready, whether there are listeners or not.
 *
 * Broadcast streams are used for independent events/observers.
 *
 * If several listeners want to listen to a single subscription stream,
 * use [asBroadcastStream] to create a broadcast stream on top of the
 * non-broadcast stream.
 *
 * On either kind of stream, stream transformations, such as [where] and
 * [skip], return the same type of stream as the one the method was called on,
 * unless otherwise noted.
 *
 * When an event is fired, the listener(s) at that time will receive the event.
 * If a listener is added to a broadcast stream while an event is being fired,
 * that listener will not receive the event currently being fired.
 * If a listener is canceled, it immediately stops receiving events.
 *
 * When the "done" event is fired, subscribers are unsubscribed before
 * receiving the event. After the event has been sent, the stream has no
 * subscribers. Adding new subscribers to a broadcast stream after this point
 * is allowed, but they will just receive a new "done" event as soon
 * as possible.
 *
 * Stream subscriptions always respect "pause" requests. If necessary they need
 * to buffer their input, but often, and preferably, they can simply request
 * their input to pause too.
 *
 * The default implementation of [isBroadcast] returns false.
 * A broadcast stream inheriting from [Stream] must override [isBroadcast]
 * to return `true`.
 */
let DartStream = class DartStream {
    constructor() {
    }
    _init() {
    }
    /**
     * Internal use only. We do not want to promise that Stream stays const.
     *
     * If mixins become compatible with const constructors, we may use a
     * stream mixin instead of extending Stream from a const class.
     */
    _internal() {
    }
    /**
     * Creates an empty broadcast stream.
     *
     * This is a stream which does nothing except sending a done event
     * when it's listened to.
     */
    static _empty() {
        return new _EmptyStream();
    }
    /**
     * Creates a new single-subscription stream from the future.
     *
     * When the future completes, the stream will fire one event, either
     * data or error, and then close with a done-event.
     */
    static _fromFuture(future) {
        // Use the controller's buffering to fill in the value even before
        // the stream has a listener. For a single value, it's not worth it
        // to wait for a listener before doing the `then` on the future.
        let controller = new DartStreamController({ sync: true });
        future.then((value) => {
            controller._add(value);
            controller._closeUnchecked();
        }, {
            onError: (error, stackTrace) => {
                controller._addError(error, stackTrace);
                controller._closeUnchecked();
            }
        });
        return controller.stream;
    }
    /**
     * Create a stream from a group of futures.
     *
     * The stream reports the results of the futures on the stream in the order
     * in which the futures complete.
     *
     * If some futures have completed before calling `Stream.fromFutures`,
     * their result will be output on the created stream in some unspecified
     * order.
     *
     * When all futures have completed, the stream is closed.
     *
     * If no future is passed, the stream closes as soon as possible.
     */
    static _fromFutures(futures) {
        let controller = new DartStreamController({ sync: true });
        let count = 0;
        let onValue = (value) => {
            if (!controller.isClosed) {
                controller._add(value);
                if (--count == 0)
                    controller._closeUnchecked();
            }
        };
        let onError = (error, stack) => {
            if (!controller.isClosed) {
                controller._addError(error, stack);
                if (--count == 0)
                    controller._closeUnchecked();
            }
        };
        // The futures are already running, so start listening to them immediately
        // (instead of waiting for the stream to be listened on).
        // If we wait, we might not catch errors in the futures in time.
        for (let future of futures) {
            count++;
            future.then(onValue, { onError: onError });
        }
        // Use schedule microtask since controller is sync.
        if (count == 0)
            scheduleMicrotask(controller.close.bind(controller));
        return controller.stream;
    }
    /**
     * Creates a single-subscription stream that gets its data from [data].
     *
     * The iterable is iterated when the stream receives a listener, and stops
     * iterating if the listener cancels the subscription.
     *
     * If iterating [data] throws an error, the stream ends immediately with
     * that error. No done event will be sent (iteration is not complete), but no
     * further data events will be generated either, since iteration cannot
     * continue.
     */
    static _fromIterable(data) {
        return new _GeneratedStreamImpl(() => new _IterablePendingEvents(data));
    }
    /**
     * Creates a stream that repeatedly emits events at [period] intervals.
     *
     * The event values are computed by invoking [computation]. The argument to
     * this callback is an integer that starts with 0 and is incremented for
     * every event.
     *
     * If [computation] is omitted the event values will all be `null`.
     */
    static _periodic(period, computation) {
        let timer;
        let computationCount = 0;
        let controller;
        // Counts the time that the Stream was running (and not paused).
        let watch = new DartStopwatch();
        let sendEvent = () => {
            watch.reset();
            let data;
            if (computation != null) {
                try {
                    data = computation(computationCount++);
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    controller.addError(e, s);
                    return;
                }
            }
            controller.add(data);
        };
        let startPeriodicTimer = () => {
            //_dart.assert(timer == null);
            timer = new DartTimer.periodic(period, (timer) => {
                sendEvent();
            });
        };
        controller = new DartStreamController({
            sync: true,
            onListen: () => {
                watch.start();
                startPeriodicTimer();
            },
            onPause: () => {
                timer.cancel();
                timer = null;
                watch.stop();
            },
            onResume: () => {
                //assert(timer == null);
                let elapsed = watch.elapsed;
                watch.start();
                timer = new DartTimer(period.minus(elapsed), () => {
                    timer = null;
                    startPeriodicTimer();
                    sendEvent();
                });
            },
            onCancel: () => {
                if (timer != null)
                    timer.cancel();
                timer = null;
                return Future._nullFuture;
            }
        });
        return controller.stream;
    }
    /**
     * Creates a stream where all events of an existing stream are piped through
     * a sink-transformation.
     *
     * The given [mapSink] closure is invoked when the returned stream is
     * listened to. All events from the [source] are added into the event sink
     * that is returned from the invocation. The transformation puts all
     * transformed events into the sink the [mapSink] closure received during
     * its invocation. Conceptually the [mapSink] creates a transformation pipe
     * with the input sink being the returned [EventSink] and the output sink
     * being the sink it received.
     *
     * This constructor is frequently used to build transformers.
     *
     * Example use for a duplicating transformer:
     *
     *     class DuplicationSink implements EventSink<String> {
     *       final EventSink<String> _outputSink;
     *       DuplicationSink(this._outputSink);
     *
     *       void add(String data) {
     *         _outputSink.add(data);
     *         _outputSink.add(data);
     *       }
     *
     *       void addError(e, [st]) { _outputSink.addError(e, st); }
     *       void close() { _outputSink.close(); }
     *     }
     *
     *     class DuplicationTransformer implements StreamTransformer<String, String> {
     *       // Some generic types ommitted for brevety.
     *       Stream bind(Stream stream) => new Stream<String>.eventTransformed(
     *           stream,
     *           (EventSink sink) => new DuplicationSink(sink));
     *     }
     *
     *     stringStream.transform(new DuplicationTransformer());
     *
     * The resulting stream is a broadcast stream if [source] is.
     */
    static _eventTransformed(source, mapSink) {
        return new _BoundSinkStream(source, mapSink);
    }
    /**
     * Whether this stream is a broadcast stream.
     */
    get isBroadcast() {
        return false;
    }
    /**
     * Returns a multi-subscription stream that produces the same events as this.
     *
     * The returned stream will subscribe to this stream when its first
     * subscriber is added, and will stay subscribed until this stream ends,
     * or a callback cancels the subscription.
     *
     * If [onListen] is provided, it is called with a subscription-like object
     * that represents the underlying subscription to this stream. It is
     * possible to pause, resume or cancel the subscription during the call
     * to [onListen]. It is not possible to change the event handlers, including
     * using [StreamSubscription.asFuture].
     *
     * If [onCancel] is provided, it is called in a similar way to [onListen]
     * when the returned stream stops having listener. If it later gets
     * a new listener, the [onListen] function is called again.
     *
     * Use the callbacks, for example, for pausing the underlying subscription
     * while having no subscribers to prevent losing events, or canceling the
     * subscription when there are no listeners.
     */
    asBroadcastStream(_) {
        let { onListen, onCancel } = Object.assign({}, _);
        return new _AsBroadcastStream(this, onListen, onCancel);
    }
    /**
     * Adds a subscription to this stream.
     *
     * Returns a [StreamSubscription] which handles events from the stream using
     * the provided [onData], [onError] and [onDone] handlers.
     * The handlers can be changed on the subscription, but they start out
     * as the provided functions.
     *
     * On each data event from this stream, the subscriber's [onData] handler
     * is called. If [onData] is `null`, nothing happens.
     *
     * On errors from this stream, the [onError] handler is called with the
     * error object and possibly a stack trace.
     *
     * The [onError] callback must be of type `void onError(error)` or
     * `void onError(error, StackTrace stackTrace)`. If [onError] accepts
     * two arguments it is called with the error object and the stack trace
     * (which could be `null` if the stream itself received an error without
     * stack trace).
     * Otherwise it is called with just the error object.
     * If [onError] is omitted, any errors on the stream are considered unhandled,
     * and will be passed to the current [Zone]'s error handler.
     * By default unhandled async errors are treated
     * as if they were uncaught top-level errors.
     *
     * If this stream closes and sends a done event, the [onDone] handler is
     * called. If [onDone] is `null`, nothing happens.
     *
     * If [cancelOnError] is true, the subscription is automatically cancelled
     * when the first error event is delivered. The default is `false`.
     *
     * While a subscription is paused, or when it has been cancelled,
     * the subscription doesn't receive events and none of the
     * event handler functions are called.
     */
    listen(onData, _) {
        throw 'abstract';
    }
    /**
     * Creates a new stream from this stream that discards some data events.
     *
     * The new stream sends the same error and done events as this stream,
     * but it only sends the data events that satisfy the [test].
     *
     * The returned stream is a broadcast stream if this stream is.
     * If a broadcast stream is listened to more than once, each subscription
     * will individually perform the `test`.
     */
    where(test) {
        return new _WhereStream(this, test);
    }
    /**
     * Creates a new stream that converts each element of this stream
     * to a new value using the [convert] function.
     *
     * For each data event, `o`, in this stream, the returned stream
     * provides a data event with the value `convert(o)`.
     * If [convert] throws, the returned stream reports the exception as an error
     * event instead.
     *
     * Error and done events are passed through unchanged to the returned stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * The [convert] function is called once per data event per listener.
     * If a broadcast stream is listened to more than once, each subscription
     * will individually call [convert] on each data event.
     */
    map(convert) {
        return new _MapStream(this, convert);
    }
    /**
     * Creates a new stream with each data event of this stream asynchronously
     * mapped to a new event.
     *
     * This acts like [map], except that [convert] may return a [Future],
     * and in that case, the stream waits for that future to complete before
     * continuing with its result.
     *
     * The returned stream is a broadcast stream if this stream is.
     */
    asyncMap(convert) {
        let controller;
        let subscription;
        let onListen = () => {
            let add = controller.add;
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink = controller /*=_EventSink<E>*/;
            let addError = eventSink._addError;
            subscription = this.listen((event) => {
                let newValue;
                try {
                    newValue = convert(event);
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    controller.addError(e, s);
                    return;
                }
                if (is(newValue, Future)) {
                    subscription.pause();
                    newValue
                        .then(add, { onError: addError })
                        .whenComplete(subscription.resume);
                }
                else {
                    controller.add(newValue /*=E*/);
                }
            }, { onError: addError, onDone: controller.close });
        };
        if (this.isBroadcast) {
            controller = new DartStreamController.broadcast({
                onListen: onListen,
                onCancel: () => {
                    subscription.cancel();
                },
                sync: true
            });
        }
        else {
            controller = new DartStreamController({
                onListen: onListen,
                onPause: () => {
                    subscription.pause();
                },
                onResume: () => {
                    subscription.resume();
                },
                onCancel: () => subscription.cancel(),
                sync: true
            });
        }
        return controller.stream;
    }
    /**
     * Creates a new stream with the events of a stream per original event.
     *
     * This acts like [expand], except that [convert] returns a [Stream]
     * instead of an [Iterable].
     * The events of the returned stream becomes the events of the returned
     * stream, in the order they are produced.
     *
     * If [convert] returns `null`, no value is put on the output stream,
     * just as if it returned an empty stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     */
    asyncExpand(convert) {
        let controller;
        let subscription;
        let onListen = () => {
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink = controller /*=_EventSink<E>*/;
            subscription = this.listen((event) => {
                let newStream;
                try {
                    newStream = convert(event);
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    controller.addError(e, s);
                    return;
                }
                if (newStream != null) {
                    subscription.pause();
                    controller.addStream(newStream).whenComplete(subscription.resume);
                }
            }, {
                onError: eventSink._addError,
                onDone: controller.close
            });
        };
        if (this.isBroadcast) {
            controller = new DartStreamController.broadcast({
                onListen: onListen,
                onCancel: () => {
                    subscription.cancel();
                },
                sync: true
            });
        }
        else {
            controller = new DartStreamController({
                onListen: onListen,
                onPause: () => {
                    subscription.pause();
                },
                onResume: () => {
                    subscription.resume();
                },
                onCancel: () => subscription.cancel(),
                sync: true
            });
        }
        return controller.stream;
    }
    /**
     * Creates a wrapper Stream that intercepts some errors from this stream.
     *
     * If this stream sends an error that matches [test], then it is intercepted
     * by the [onError] function.
     *
     * The [onError] callback must be of type `void onError(error)` or
     * `void onError(error, StackTrace stackTrace)`. Depending on the function
     * type the stream either invokes [onError] with or without a stack
     * trace. The stack trace argument might be `null` if the stream itself
     * received an error without stack trace.
     *
     * An asynchronous error `error` is matched by a test function if
     *`test(error)` returns true. If [test] is omitted, every error is considered
     * matching.
     *
     * If the error is intercepted, the [onError] function can decide what to do
     * with it. It can throw if it wants to raise a new (or the same) error,
     * or simply return to make the stream forget the error.
     *
     * If you need to transform an error into a data event, use the more generic
     * [Stream.transform] to handle the event by writing a data event to
     * the output sink.
     *
     * The returned stream is a broadcast stream if this stream is.
     * If a broadcast stream is listened to more than once, each subscription
     * will individually perform the `test` and handle the error.
     */
    handleError(onError, _) {
        let { test } = Object.assign({}, _);
        return new _HandleErrorStream(this, onError, test);
    }
    /**
     * Creates a new stream from this stream that converts each element
     * into zero or more events.
     *
     * Each incoming event is converted to an [Iterable] of new events,
     * and each of these new events are then sent by the returned stream
     * in order.
     *
     * The returned stream is a broadcast stream if this stream is.
     * If a broadcast stream is listened to more than once, each subscription
     * will individually call `convert` and expand the events.
     */
    expand(convert) {
        return new _ExpandStream(this, convert);
    }
    /**
     * Pipe the events of this stream into [streamConsumer].
     *
     * The events of this stream are added to `streamConsumer` using
     * [StreamConsumer.addStream].
     * The `streamConsumer` is closed when this stream has been successfully added
     * to it - when the future returned by `addStream` completes without an error.
     *
     * Returns a future which completes when the stream has been consumed
     * and the consumer has been closed.
     *
     * The returned future completes with the same result as the future returned
     * by [StreamConsumer.close].
     * If the adding of the stream itself fails in some way,
     * then the consumer is expected to be closed, and won't be closed again.
     * In that case the returned future completes with the error from calling
     * `addStream`.
     */
    pipe(streamConsumer) {
        return streamConsumer.addStream(this).then((_) => streamConsumer.close());
    }
    /**
     * Chains this stream as the input of the provided [StreamTransformer].
     *
     * Returns the result of [:streamTransformer.bind:] itself.
     *
     * The `streamTransformer` can decide whether it wants to return a
     * broadcast stream or not.
     */
    transform(streamTransformer) {
        return streamTransformer.bind(this);
    }
    /**
     * Reduces a sequence of values by repeatedly applying [combine].
     */
    reduce(combine) {
        let result = new _Future();
        let seenFirst = false;
        let value;
        let subscription;
        subscription = this.listen((element) => {
            if (seenFirst) {
                _runUserCode(() => combine(value, element), (newValue) => {
                    value = newValue;
                }, _cancelAndErrorClosure(subscription, result));
            }
            else {
                value = element;
                seenFirst = true;
            }
        }, {
            onError: result._completeError,
            onDone: () => {
                if (!seenFirst) {
                    try {
                        throw DartIterableElementError.noElement();
                    }
                    catch (e) {
                        let s = new DartStackTrace(e);
                        _completeWithErrorCallback(result, e, s);
                    }
                }
                else {
                    result._complete(value);
                }
            },
            cancelOnError: true
        });
        return result;
    }
    /** Reduces a sequence of values by repeatedly applying [combine]. */
    fold(initialValue, combine) {
        let result = new _Future();
        let value = initialValue;
        let subscription;
        subscription = this.listen((element) => {
            _runUserCode(() => combine(value, element), (newValue) => {
                value = newValue;
            }, _cancelAndErrorClosure(subscription, result));
        }, {
            onError: (e, st) => {
                result._completeError(e, st);
            }, onDone: () => {
                result._complete(value);
            }, cancelOnError: true
        });
        return result;
    }
    /**
     * Collects string of data events' string representations.
     *
     * If [separator] is provided, it is inserted between any two
     * elements.
     *
     * Any error in the stream causes the future to complete with that
     * error. Otherwise it completes with the collected string when
     * the "done" event arrives.
     */
    join(separator) {
        separator = separator || "";
        let result = new _Future();
        let buffer = new DartStringBuffer();
        let subscription;
        let first = true;
        subscription = this.listen((element) => {
            if (!first) {
                buffer.write(separator);
            }
            first = false;
            try {
                buffer.write(element);
            }
            catch (e) {
                let s = new DartStackTrace(e);
                _cancelAndErrorWithReplacement(subscription, result, e, s);
            }
        }, {
            onError: (e) => {
                result._completeError(e);
            }, onDone: () => {
                result._complete(buffer.toString());
            }, cancelOnError: true
        });
        return result;
    }
    /**
     * Checks whether [needle] occurs in the elements provided by this stream.
     *
     * Completes the [Future] when the answer is known.
     * If this stream reports an error, the [Future] will report that error.
     */
    contains(needle) {
        let future = new _Future();
        let subscription;
        subscription = this.listen((element) => {
            _runUserCode(() => (equals(element, needle)), (isMatch) => {
                if (isMatch) {
                    _cancelAndValue(subscription, future, true);
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(false);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Executes [action] on each data event of the stream.
     *
     * Completes the returned [Future] when all events of the stream
     * have been processed. Completes the future with an error if the
     * stream has an error event, or if [action] throws.
     */
    forEach(action) {
        let future = new _Future();
        let subscription;
        subscription = this.listen((element) => {
            // TODO(floitsch): the type should be 'void' and inferred.
            _runUserCode(() => action(element), (_) => {
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(null);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Checks whether [test] accepts all elements provided by this stream.
     *
     * Completes the [Future] when the answer is known.
     * If this stream reports an error, the [Future] will report that error.
     */
    every(test) {
        let future = new _Future();
        let subscription;
        subscription = this.listen((element) => {
            _runUserCode(() => test(element), (isMatch) => {
                if (!isMatch) {
                    _cancelAndValue(subscription, future, false);
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(true);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Checks whether [test] accepts any element provided by this stream.
     *
     * Completes the [Future] when the answer is known.
     *
     * If this stream reports an error, the [Future] reports that error.
     *
     * Stops listening to the stream after the first matching element has been
     * found.
     *
     * Internally the method cancels its subscription after this element. This
     * means that single-subscription (non-broadcast) streams are closed and
     * cannot be reused after a call to this method.
     */
    any(test) {
        let future = new _Future();
        let subscription;
        subscription = this.listen((element) => {
            _runUserCode(() => test(element), (isMatch) => {
                if (isMatch) {
                    _cancelAndValue(subscription, future, true);
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(false);
            },
            cancelOnError: true
        });
        return future;
    }
    /** Counts the elements in the stream. */
    get length() {
        let future = new _Future();
        let count = 0;
        this.listen((_) => {
            count++;
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(count);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Reports whether this stream contains any elements.
     *
     * Stops listening to the stream after the first element has been received.
     *
     * Internally the method cancels its subscription after the first element.
     * This means that single-subscription (non-broadcast) streams are closed and
     * cannot be reused after a call to this getter.
     */
    get isEmpty() {
        let future = new _Future();
        let subscription;
        subscription = this.listen((_) => {
            _cancelAndValue(subscription, future, false);
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(true);
            },
            cancelOnError: true
        });
        return future;
    }
    /** Collects the data of this stream in a [List]. */
    toList() {
        let result = new DartList();
        let future = new _Future();
        this.listen((data) => {
            result.add(data);
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(result);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Collects the data of this stream in a [Set].
     *
     * The returned set is the same type as returned by `new Set<T>()`.
     * If another type of set is needed, either use [forEach] to add each
     * element to the set, or use
     * `toList().then((list) => new SomeOtherSet.from(list))`
     * to create the set.
     */
    toSet() {
        let result = new DartSet();
        let future = new _Future();
        this.listen((data) => {
            result.add(data);
        }, {
            onError: future._completeError,
            onDone: () => {
                future._complete(result);
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Discards all data on the stream, but signals when it's done or an error
     * occurred.
     *
     * When subscribing using [drain], cancelOnError will be true. This means
     * that the future will complete with the first error on the stream and then
     * cancel the subscription.
     *
     * In case of a `done` event the future completes with the given
     * [futureValue].
     */
    drain(futureValue) {
        return this.listen(null, { cancelOnError: true }).asFuture(futureValue);
    }
    /**
     * Provides at most the first [count] data events of this stream.
     *
     * Forwards all events of this stream to the returned stream
     * until [count] data events have been forwarded or this stream ends,
     * then ends the returned stream with a done event.
     *
     * If this stream produces fewer than [count] data events before it's done,
     * so will the returned stream.
     *
     * Starts listening to this stream when the returned stream is listened to
     * and stops listening when the first [count] data events have been received.
     *
     * This means that if this is a single-subscription (non-broadcast) streams
     * it cannot be reused after the returned stream has been listened to.
     *
     * If this is a broadcast stream, the returned stream is a broadcast stream.
     * In that case, the events are only counted from the time
     * the returned stream is listened to.
     */
    take(count) {
        return new _TakeStream(this, count);
    }
    /**
     * Forwards data events while [test] is successful.
     *
     * The returned stream provides the same events as this stream as long
     * as [test] returns `true` for the event data. The stream is done
     * when either this stream is done, or when this stream first provides
     * a value that [test] doesn't accept.
     *
     * Stops listening to the stream after the accepted elements.
     *
     * Internally the method cancels its subscription after these elements. This
     * means that single-subscription (non-broadcast) streams are closed and
     * cannot be reused after a call to this method.
     *
     * The returned stream is a broadcast stream if this stream is.
     * For a broadcast stream, the events are only tested from the time
     * the returned stream is listened to.
     */
    takeWhile(test) {
        return new _TakeWhileStream(this, test);
    }
    /**
     * Skips the first [count] data events from this stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * For a broadcast stream, the events are only counted from the time
     * the returned stream is listened to.
     */
    skip(count) {
        return new _SkipStream(this, count);
    }
    /**
     * Skip data events from this stream while they are matched by [test].
     *
     * Error and done events are provided by the returned stream unmodified.
     *
     * Starting with the first data event where [test] returns false for the
     * event data, the returned stream will have the same events as this stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * For a broadcast stream, the events are only tested from the time
     * the returned stream is listened to.
     */
    skipWhile(test) {
        return new _SkipWhileStream(this, test);
    }
    /**
     * Skips data events if they are equal to the previous data event.
     *
     * The returned stream provides the same events as this stream, except
     * that it never provides two consecutive data events that are equal.
     * That is, errors are passed through to the returned stream, and
     * data events are passed through if they are distinct from the most
     * recently emitted data event.
     *
     * Equality is determined by the provided [equals] method. If that is
     * omitted, the '==' operator on the last provided data element is used.
     *
     * If [equals] throws, the data event is replaced by an error event
     * containing the thrown error. The behavior is equivalent to the
     * original stream emitting the error event.
     *
     * The returned stream is a broadcast stream if this stream is.
     * If a broadcast stream is listened to more than once, each subscription
     * will individually perform the `equals` test.
     */
    distinct(equals) {
        return new _DistinctStream(this, equals);
    }
    /**
     * Returns the first element of the stream.
     *
     * Stops listening to the stream after the first element has been received.
     *
     * Internally the method cancels its subscription after the first element.
     * This means that single-subscription (non-broadcast) streams are closed
     * and cannot be reused after a call to this getter.
     *
     * If an error event occurs before the first data event, the resulting future
     * is completed with that error.
     *
     * If this stream is empty (a done event occurs before the first data event),
     * the resulting future completes with a [StateError].
     *
     * Except for the type of the error, this method is equivalent to
     * [:this.elementAt(0):].
     */
    get first() {
        let future = new _Future();
        let subscription;
        subscription = this.listen((value) => {
            _cancelAndValue(subscription, future, value);
        }, {
            onError: future._completeError,
            onDone: () => {
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Returns the last element of the stream.
     *
     * If an error event occurs before the first data event, the resulting future
     * is completed with that error.
     *
     * If this stream is empty (a done event occurs before the first data event),
     * the resulting future completes with a [StateError].
     */
    get last() {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        this.listen((value) => {
            foundResult = true;
            result = value;
        }, {
            onError: future._completeError,
            onDone: () => {
                if (foundResult) {
                    future._complete(result);
                    return;
                }
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Returns the single element.
     *
     * If an error event occurs before or after the first data event, the
     * resulting future is completed with that error.
     *
     * If [this] is empty or has more than one element throws a [StateError].
     */
    get single() {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription;
        subscription = this.listen((value) => {
            if (foundResult) {
                // This is the second element we get.
                try {
                    throw DartIterableElementError.tooMany();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _cancelAndErrorWithReplacement(subscription, future, e, s);
                }
                return;
            }
            foundResult = true;
            result = value;
        }, {
            onError: future._completeError,
            onDone: () => {
                if (foundResult) {
                    future._complete(result);
                    return;
                }
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Finds the first element of this stream matching [test].
     *
     * Returns a future that is filled with the first element of this stream
     * that [test] returns true for.
     *
     * If no such element is found before this stream is done, and a
     * [defaultValue] function is provided, the result of calling [defaultValue]
     * becomes the value of the future.
     *
     * Stops listening to the stream after the first matching element has been
     * received.
     *
     * Internally the method cancels its subscription after the first element that
     * matches the predicate. This means that single-subscription (non-broadcast)
     * streams are closed and cannot be reused after a call to this method.
     *
     * If an error occurs, or if this stream ends without finding a match and
     * with no [defaultValue] function provided, the future will receive an
     * error.
     */
    firstWhere(test, _) {
        let { defaultValue } = Object.assign({}, _);
        let future = new _Future();
        let subscription;
        subscription = this.listen((value) => {
            _runUserCode(() => test(value), (isMatch) => {
                if (isMatch) {
                    _cancelAndValue(subscription, future, value);
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                if (defaultValue != null) {
                    _runUserCode(defaultValue, future._complete, future._completeError);
                    return;
                }
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Finds the last element in this stream matching [test].
     *
     * As [firstWhere], except that the last matching element is found.
     * That means that the result cannot be provided before this stream
     * is done.
     */
    lastWhere(test, _) {
        let { defaultValue } = Object.assign({}, _);
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription;
        subscription = this.listen((value) => {
            _runUserCode(() => true == test(value), (isMatch) => {
                if (isMatch) {
                    foundResult = true;
                    result = value;
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                if (foundResult) {
                    future._complete(result);
                    return;
                }
                if (defaultValue != null) {
                    _runUserCode(defaultValue, future._complete, future._completeError);
                    return;
                }
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Finds the single element in this stream matching [test].
     *
     * Like [lastWhere], except that it is an error if more than one
     * matching element occurs in the stream.
     */
    singleWhere(test) {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription;
        subscription = this.listen((value) => {
            _runUserCode(() => true == test(value), (isMatch) => {
                if (isMatch) {
                    if (foundResult) {
                        try {
                            throw DartIterableElementError.tooMany();
                        }
                        catch (e) {
                            let s = new DartStackTrace(e);
                            _cancelAndErrorWithReplacement(subscription, future, e, s);
                        }
                        return;
                    }
                    foundResult = true;
                    result = value;
                }
            }, _cancelAndErrorClosure(subscription, future));
        }, {
            onError: future._completeError,
            onDone: () => {
                if (foundResult) {
                    future._complete(result);
                    return;
                }
                try {
                    throw DartIterableElementError.noElement();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    _completeWithErrorCallback(future, e, s);
                }
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Returns the value of the [index]th data event of this stream.
     *
     * Stops listening to the stream after the [index]th data event has been
     * received.
     *
     * Internally the method cancels its subscription after these elements. This
     * means that single-subscription (non-broadcast) streams are closed and
     * cannot be reused after a call to this method.
     *
     * If an error event occurs before the value is found, the future completes
     * with this error.
     *
     * If a done event occurs before the value is found, the future completes
     * with a [RangeError].
     */
    elementAt(index) {
        if (is(index, 'int') || index < 0)
            throw new ArgumentError(index);
        let future = new _Future();
        let subscription;
        let elementIndex = 0;
        subscription = this.listen((value) => {
            if (index == elementIndex) {
                _cancelAndValue(subscription, future, value);
                return;
            }
            elementIndex += 1;
        }, {
            onError: future._completeError,
            onDone: () => {
                future._completeError(new RangeError.index(index, this, "index", null, elementIndex));
            },
            cancelOnError: true
        });
        return future;
    }
    /**
     * Creates a new stream with the same events as this stream.
     *
     * Whenever more than [timeLimit] passes between two events from this stream,
     * the [onTimeout] function is called.
     *
     * The countdown doesn't start until the returned stream is listened to.
     * The countdown is reset every time an event is forwarded from this stream,
     * or when the stream is paused and resumed.
     *
     * The [onTimeout] function is called with one argument: an
     * [EventSink] that allows putting events into the returned stream.
     * This `EventSink` is only valid during the call to `onTimeout`.
     *
     * If `onTimeout` is omitted, a timeout will just put a [TimeoutException]
     * into the error channel of the returned stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * If a broadcast stream is listened to more than once, each subscription
     * will have its individually timer that starts counting on listen,
     * and the subscriptions' timers can be paused individually.
     */
    timeout(timeLimit, _) {
        let { onTimeout } = Object.assign({}, _);
        let controller;
        // The following variables are set on listen.
        let subscription;
        let timer;
        let zone;
        let timeout;
        let onData = (event) => {
            timer.cancel();
            controller.add(event);
            timer = zone.createTimer(timeLimit, timeout);
        };
        let onError = (error, stackTrace) => {
            timer.cancel();
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink = controller;
            eventSink._addError(error, stackTrace); // Avoid Zone error replacement.
            timer = zone.createTimer(timeLimit, timeout);
        };
        let onDone = () => {
            timer.cancel();
            controller.close();
        };
        let onListen = () => {
            // This is the onListen callback for of controller.
            // It runs in the same zone that the subscription was created in.
            // Use that zone for creating timers and running the onTimeout
            // callback.
            zone = DartZone.current;
            if (onTimeout == null) {
                timeout = () => {
                    controller.addError(new DartTimeoutException("No stream event", timeLimit), null);
                };
            }
            else {
                // TODO(floitsch): the return type should be 'void', and the type
                // should be inferred.
                let registeredOnTimeout = zone.registerUnaryCallback(onTimeout);
                let wrapper = new _ControllerEventSinkWrapper(null);
                timeout = () => {
                    wrapper._sink = controller; // Only valid during call.
                    zone.runUnaryGuarded(registeredOnTimeout, wrapper);
                    wrapper._sink = null;
                };
            }
            subscription = this.listen(onData, { onError: onError, onDone: onDone });
            timer = zone.createTimer(timeLimit, timeout);
        };
        let onCancel = () => {
            timer.cancel();
            let result = subscription.cancel();
            subscription = null;
            return result;
        };
        controller = this.isBroadcast
            ? new _SyncBroadcastStreamController(onListen, onCancel)
            : new _SyncStreamController(onListen, () => {
                // Don't null the timer, onCancel may call cancel again.
                timer.cancel();
                subscription.pause();
            }, () => {
                subscription.resume();
                timer = zone.createTimer(timeLimit, timeout);
            }, onCancel);
        return controller.stream;
    }
    [Symbol.asyncIterator]() {
        return new DartStreamIterator(this);
    }
};
__decorate([
    defaultConstructor
], DartStream.prototype, "_init", null);
__decorate([
    namedConstructor
], DartStream.prototype, "_internal", null);
__decorate([
    Abstract
], DartStream.prototype, "listen", null);
__decorate([
    namedFactory
], DartStream, "_empty", null);
__decorate([
    namedFactory
], DartStream, "_fromFuture", null);
__decorate([
    namedFactory
], DartStream, "_fromFutures", null);
__decorate([
    namedFactory
], DartStream, "_fromIterable", null);
__decorate([
    namedFactory
], DartStream, "_periodic", null);
__decorate([
    namedFactory
], DartStream, "_eventTransformed", null);
DartStream = __decorate([
    DartClass
], DartStream);
/** [Stream] wrapper that only exposes the [Stream] interface. */
let DartStreamView = class DartStreamView extends DartStream {
    constructor(stream) {
        super();
    }
    _DartStreamView(stream) {
        this._stream = stream;
        super._internal();
    }
    get isBroadcast() {
        return this._stream.isBroadcast;
    }
    asBroadcastStream(_) {
        return this._stream.asBroadcastStream(_);
    }
    listen(onData, _) {
        return this._stream.listen(onData, _);
    }
};
__decorate([
    defaultConstructor
], DartStreamView.prototype, "_DartStreamView", null);
DartStreamView = __decorate([
    DartClass
], DartStreamView);
/**
 * Transforms a Stream.
 *
 * When a stream's [Stream.transform] method is invoked with a
 * [StreamTransformer], the stream calls the [bind] method on the provided
 * transformer. The resulting stream is then returned from the
 * [Stream.transform] method.
 *
 * Conceptually, a transformer is simply a function from [Stream] to [Stream]
 * that is encapsulated into a class.
 *
 * It is good practice to write transformers that can be used multiple times.
 *
 * All other transforming methods on [Stream], such as [Stream.map],
 * [Stream.where] or [Stream.expand] can be implemented using
 * [Stream.transform]. A [StreamTransformer] is thus very powerful but often
 * also a bit more complicated to use.
 */
let DartStreamTransformer = class DartStreamTransformer {
    constructor(onListen) {
    }
    /**
     * Creates a [StreamTransformer] based on the given [onListen] callback.
     *
     * The returned stream transformer uses the provided [onListen] callback
     * when a transformed stream is listened to. At that time, the callback
     * receives the input stream (the one passed to [bind]) and a
     * boolean flag `cancelOnError` to create a [StreamSubscription].
     *
     * The [onListen] callback does *not* receive the handlers that were passed
     * to [Stream.listen]. These are automatically set after the call to the
     * [onListen] callback (using [StreamSubscription.onData],
     * [StreamSubscription.onError] and [StreamSubscription.onDone]).
     *
     * Most commonly, an [onListen] callback will first call [Stream.listen] on
     * the provided stream (with the corresponding `cancelOnError` flag), and then
     * return a new [StreamSubscription].
     *
     * There are two common ways to create a StreamSubscription:
     *
     * 1. by allocating a [StreamController] and to return the result of
     *    listening to its stream. It's important to forward pause, resume and
     *    cancel events (unless the transformer intentionally wants to change
     *    this behavior).
     * 2. by creating a new class that implements [StreamSubscription].
     *    Note that the subscription should run callbacks in the [Zone] the
     *    stream was listened to (see [Zone] and [Zone.bindCallback]).
     *
     * Example:
     *
     * ```
     * /// Starts listening to [input] and duplicates all non-error events.
     * StreamSubscription<int> _onListen(Stream<int> input, bool cancelOnError) {
     *   StreamSubscription<String> subscription;
     *   // Create controller that forwards pause, resume and cancel events.
     *   var controller = new StreamController<String>(
     *       onPause: () {
     *         subscription.pause();
     *       },
     *       onResume: () {
     *         subscription.resume();
     *       },
     *       onCancel: () => subscription.cancel(),
     *       sync: true); // "sync" is correct here, since events are forwarded.
     *
     *   // Listen to the provided stream using `cancelOnError`.
     *   subscription = input.listen((data) {
     *     // Duplicate the data.
     *     controller.add(data);
     *     controller.add(data);
     *   },
     *       onError: controller.addError,
     *       onDone: controller.close,
     *       cancelOnError: cancelOnError);
     *
     *   // Return a new [StreamSubscription] by listening to the controller's
     *   // stream.
     *   return controller.stream.listen(null);
     * }
     *
     * // Instantiate a transformer:
     * var duplicator = const StreamTransformer<int, int>(_onListen);
     *
     * // Use as follows:
     * intStream.transform(duplicator);
     * ```
     */
    static _create(onListen) {
        return new _StreamSubscriptionTransformer(onListen);
    }
    /**
     * Creates a [StreamTransformer] that delegates events to the given functions.
     *
     * Example use of a duplicating transformer:
     *
     *     stringStream.transform(new StreamTransformer<String, String>.fromHandlers(
     *         handleData: (String value, EventSink<String> sink) {
     *           sink.add(value);
     *           sink.add(value);  // Duplicate the incoming events.
     *         }));
     */
    static _fromHandlers(_) {
        return new _StreamHandlerTransformer(_);
    }
    /**
     * Transforms the provided [stream].
     *
     * Returns a new stream with events that are computed from events of the
     * provided [stream].
     *
     * Implementors of the [StreamTransformer] interface should document
     * differences from the following expected behavior:
     *
     * * When the returned stream is listened to, it starts listening to the
     *   input [stream].
     * * Subscriptions of the returned stream forward (in a reasonable time)
     *   a [StreamSubscription.pause] call to the subscription of the input
     *   [stream].
     * * Similarly, canceling a subscription of the returned stream eventually
     *   (in reasonable time) cancels the subscription of the input [stream].
     *
     * "Reasonable time" depends on the transformer and stream. Some transformers,
     * like a "timeout" transformer, might make these operations depend on a
     * duration. Others might not delay them at all, or just by a microtask.
     */
    bind(stream) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], DartStreamTransformer.prototype, "bind", null);
__decorate([
    defaultFactory
], DartStreamTransformer, "_create", null);
__decorate([
    namedFactory
], DartStreamTransformer, "_fromHandlers", null);
DartStreamTransformer = __decorate([
    DartClass
], DartStreamTransformer);
/**
 * An [Iterator] like interface for the values of a [Stream].
 *
 * This wraps a [Stream] and a subscription on the stream. It listens
 * on the stream, and completes the future returned by [moveNext] when the
 * next value becomes available.
 *
 * The stream may be paused between calls to [moveNext].
 */
let DartStreamIterator = class DartStreamIterator {
    constructor(stream) {
    }
    /** Create a [StreamIterator] on [stream]. */
    static _create(stream) {
        // TODO(lrn): use redirecting factory constructor when type
        // arguments are supported.
        return new _StreamIterator(stream);
    }
    /**
     * Wait for the next stream value to be available.
     *
     * Returns a future which will complete with either `true` or `false`.
     * Completing with `true` means that another event has been received and
     * can be read as [current].
     * Completing with `false` means that the stream iteration is done and
     * no further events will ever be available.
     * The future may complete with an error, if the stream produces an error,
     * which also ends iteration.
     *
     * The function must not be called again until the future returned by a
     * previous call is completed.
     */
    moveNext() {
        throw 'abstract';
    }
    /**
     * The current value of the stream.
     *
     * Is `null` before the first call to [moveNext] and after a call to
     * `moveNext` completes with a `false` result or an error.
     *
     * When a `moveNext` call completes with `true`, the `current` field holds
     * the most recent event of the stream, and it stays like that until the next
     * call to `moveNext`.
     * Between a call to `moveNext` and when its returned future completes,
     * the value is unspecified.
     */
    get current() {
        throw 'abstract';
    }
    /**
     * Cancels the stream iterator (and the underlying stream subscription) early.
     *
     * The stream iterator is automatically canceled if the [moveNext] future
     * completes with either `false` or an error.
     *
     * If you need to stop listening for values before the stream iterator is
     * automatically closed, you must call [cancel] to ensure that the stream
     * is properly closed.
     *
     * If [moveNext] has been called when the iterator is canceled,
     * its returned future will complete with `false` as value,
     * as will all further calls to [moveNext].
     *
     * Returns a future if the cancel-operation is not completed synchronously.
     * Otherwise returns `null`.
     */
    cancel() {
        throw 'abstract';
    }
    next(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let hasNext = yield this.moveNext();
            return {
                done: !hasNext,
                value: this.current
            };
        });
    }
    return(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancel();
            return {
                done: true,
                value: this.current
            };
        });
    }
    throw(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancel();
            return {
                done: true,
                value: this.current
            };
        });
    }
};
__decorate([
    Abstract
], DartStreamIterator.prototype, "moveNext", null);
__decorate([
    AbstractProperty
], DartStreamIterator.prototype, "current", null);
__decorate([
    Abstract
], DartStreamIterator.prototype, "cancel", null);
__decorate([
    defaultFactory
], DartStreamIterator, "_create", null);
DartStreamIterator = __decorate([
    DartClass
], DartStreamIterator);
/**
 * Wraps an [_EventSink] so it exposes only the [EventSink] interface.
 */
class _ControllerEventSinkWrapper {
    constructor(_sink) {
        this._sink = _sink;
    }
    add(data) {
        this._sink.add(data);
    }
    addError(error, stackTrace) {
        this._sink.addError(error, stackTrace);
    }
    close() {
        this._sink.close();
    }
}
/**
 * Default implementation of stream subscription of buffering events.
 *
 * The only public methods are those of [StreamSubscription], so instances of
 * [_BufferingStreamSubscription] can be returned directly as a
 * [StreamSubscription] without exposing internal functionality.
 *
 * The [StreamController] is a public facing version of [Stream] and this class,
 * with some methods made public.
 *
 * The user interface of [_BufferingStreamSubscription] are the following
 * methods:
 *
 * * [_add]: Add a data event to the stream.
 * * [_addError]: Add an error event to the stream.
 * * [_close]: Request to close the stream.
 * * [_onCancel]: Called when the subscription will provide no more events,
 *     either due to being actively canceled, or after sending a done event.
 * * [_onPause]: Called when the subscription wants the event source to pause.
 * * [_onResume]: Called when allowing new events after a pause.
 *
 * The user should not add new events when the subscription requests a paused,
 * but if it happens anyway, the subscription will enqueue the events just as
 * when new events arrive while still firing an old event.
 */
class _BufferingStreamSubscription {
    constructor(onData, onError, onDone, cancelOnError) {
        this._zone = DartZone.current;
        this._state = (cancelOnError ? _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR : 0);
        this.onData(onData);
        this.onError(onError);
        this.onDone(onDone);
    }
    /**
     * Sets the subscription's pending events object.
     *
     * This can only be done once. The pending events object is used for the
     * rest of the subscription's life cycle.
     */
    _setPendingEvents(pendingEvents) {
        //assert(_pending == null);
        if (pendingEvents == null)
            return;
        this._pending = pendingEvents;
        if (!pendingEvents.isEmpty) {
            this._state |= _BufferingStreamSubscription._STATE_HAS_PENDING;
            this._pending.schedule(this);
        }
    }
    // StreamSubscription interface.
    onData(handleData) {
        if (handleData == null)
            handleData = _nullDataHandler;
        // TODO(floitsch): the return type should be 'void', and the type
        // should be inferred.
        this._onData = this._zone.registerUnaryCallback(handleData);
    }
    onError(handleError) {
        if (handleError == null)
            handleError = _nullErrorHandler;
        // We are not allowed to use 'void' as type argument for the generic type,
        // so we use 'dynamic' instead.
        this._onError = _registerErrorHandler(handleError, this._zone);
    }
    onDone(handleDone) {
        if (handleDone == null)
            handleDone = _nullDoneHandler;
        this._onDone = this._zone.registerCallback(handleDone);
    }
    pause(resumeSignal) {
        if (this._isCanceled)
            return;
        let wasPaused = this._isPaused;
        let wasInputPaused = this._isInputPaused;
        // Increment pause count and mark input paused (if it isn't already).
        this._state = (this._state + _BufferingStreamSubscription._STATE_PAUSE_COUNT) | _BufferingStreamSubscription._STATE_INPUT_PAUSED;
        if (resumeSignal != null)
            resumeSignal.whenComplete(() => this.resume());
        if (!wasPaused && this._pending != null)
            this._pending.cancelSchedule();
        if (!wasInputPaused && !this._inCallback)
            this._guardCallback(this._onPause.bind(this));
    }
    resume() {
        if (this._isCanceled)
            return;
        if (this._isPaused) {
            this._decrementPauseCount();
            if (!this._isPaused) {
                if (this._hasPending && !this._pending.isEmpty) {
                    // Input is still paused.
                    this._pending.schedule(this);
                }
                else {
                    //assert(_mayResumeInput);
                    this._state &= ~_BufferingStreamSubscription._STATE_INPUT_PAUSED;
                    if (!this._inCallback)
                        this._guardCallback(this._onResume.bind(this));
                }
            }
        }
    }
    cancel() {
        // The user doesn't want to receive any further events. If there is an
        // error or done event pending (waiting for the cancel to be done) discard
        // that event.
        this._state &= ~_BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
        if (!this._isCanceled) {
            this._cancel();
        }
        return this._cancelFuture || Future._nullFuture;
    }
    asFuture(futureValue) {
        let result = new _Future();
        // Overwrite the onDone and onError handlers.
        this._onDone = () => {
            result._complete(futureValue);
        };
        this._onError = (error, stackTrace) => {
            let cancelFuture = this.cancel();
            if (!identical(cancelFuture, Future._nullFuture)) {
                cancelFuture.whenComplete(() => {
                    result._completeError(error, stackTrace);
                });
            }
            else {
                result._completeError(error, stackTrace);
            }
        };
        return result;
    }
    // State management.
    get _isInputPaused() {
        return (this._state & _BufferingStreamSubscription._STATE_INPUT_PAUSED) != 0;
    }
    get _isClosed() {
        return (this._state & _BufferingStreamSubscription._STATE_CLOSED) != 0;
    }
    get _isCanceled() {
        return (this._state & _BufferingStreamSubscription._STATE_CANCELED) != 0;
    }
    get _waitsForCancel() {
        return (this._state & _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL) != 0;
    }
    get _inCallback() {
        return (this._state & _BufferingStreamSubscription._STATE_IN_CALLBACK) != 0;
    }
    get _hasPending() {
        return (this._state & _BufferingStreamSubscription._STATE_HAS_PENDING) != 0;
    }
    get _isPaused() {
        return this._state >= _BufferingStreamSubscription._STATE_PAUSE_COUNT;
    }
    get _canFire() {
        return this._state < _BufferingStreamSubscription._STATE_IN_CALLBACK;
    }
    get _mayResumeInput() {
        return !this._isPaused && (this._pending == null || this._pending.isEmpty);
    }
    get _cancelOnError() {
        return (this._state & _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR) != 0;
    }
    get isPaused() {
        return this._isPaused;
    }
    _cancel() {
        this._state |= _BufferingStreamSubscription._STATE_CANCELED;
        if (this._hasPending) {
            this._pending.cancelSchedule();
        }
        if (!this._inCallback)
            this._pending = null;
        this._cancelFuture = this._onCancel();
    }
    /**
     * Decrements the pause count.
     *
     * Does not automatically unpause the input (call [_onResume]) when
     * the pause count reaches zero. This is handled elsewhere, and only
     * if there are no pending events buffered.
     */
    _decrementPauseCount() {
        //assert(_isPaused);
        this._state -= _BufferingStreamSubscription._STATE_PAUSE_COUNT;
    }
    // _EventSink interface.
    _add(data) {
        //assert(!_isClosed);
        if (this._isCanceled)
            return;
        if (this._canFire) {
            this._sendData(data);
        }
        else {
            this._addPending(new _DelayedData(data));
        }
    }
    _addError(error, stackTrace) {
        if (this._isCanceled)
            return;
        if (this._canFire) {
            this._sendError(error, stackTrace); // Reports cancel after sending.
        }
        else {
            this._addPending(new _DelayedError(error, stackTrace));
        }
    }
    _close() {
        //assert(!_isClosed);
        if (this._isCanceled)
            return;
        this._state |= _BufferingStreamSubscription._STATE_CLOSED;
        if (this._canFire) {
            this._sendDone();
        }
        else {
            this._addPending(new _DelayedDone());
        }
    }
    // Hooks called when the input is paused, unpaused or canceled.
    // These must not throw. If overwritten to call user code, include suitable
    // try/catch wrapping and send any errors to
    // [_Zone.current.handleUncaughtError].
    _onPause() {
        //assert(_isInputPaused);
    }
    _onResume() {
        //assert(!_isInputPaused);
    }
    _onCancel() {
        //assert(_isCanceled);
        return null;
    }
    // Handle pending events.
    /**
     * Add a pending event.
     *
     * If the subscription is not paused, this also schedules a firing
     * of pending events later (if necessary).
     */
    _addPending(event) {
        let pending = this._pending;
        if (this._pending == null) {
            pending = this._pending = new _StreamImplEvents();
        }
        pending.add(event);
        if (!this._hasPending) {
            this._state |= _BufferingStreamSubscription._STATE_HAS_PENDING;
            if (!this._isPaused) {
                this._pending.schedule(this);
            }
        }
    }
    /* _EventDispatch interface. */
    _sendData(data) {
        //assert(!_isCanceled);
        //assert(!_isPaused);
        //assert(!_inCallback);
        let wasInputPaused = this._isInputPaused;
        this._state |= _BufferingStreamSubscription._STATE_IN_CALLBACK;
        this._zone.runUnaryGuarded(this._onData, data);
        this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        this._checkState(wasInputPaused);
    }
    _sendError(error, stackTrace) {
        // assert(!_isCanceled);
        // assert(!_isPaused);
        // assert(!_inCallback);
        let wasInputPaused = this._isInputPaused;
        let sendError = () => {
            // If the subscription has been canceled while waiting for the cancel
            // future to finish we must not report the error.
            if (this._isCanceled && !this._waitsForCancel)
                return;
            this._state |= _BufferingStreamSubscription._STATE_IN_CALLBACK;
            // TODO(floitsch): this dynamic should be 'void'.
            //if (is(this._onError is ZoneBinaryCallback<dynamic, Object, StackTrace>) {
            let errorCallback = this._onError /*=ZoneBinaryCallback<dynamic, Object, StackTrace>*/;
            this._zone.runBinaryGuarded(errorCallback, error, stackTrace);
            //} else {
            //   _zone.runUnaryGuarded<dynamic, Object>(
            //       _onError as Object/*=ZoneUnaryCallback<dynamic, Object>*/, error);
            // }
            this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        };
        if (this._cancelOnError) {
            this._state |= _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
            this._cancel();
            if (is(this._cancelFuture, Future) &&
                !identical(this._cancelFuture, Future._nullFuture)) {
                this._cancelFuture.whenComplete(sendError);
            }
            else {
                sendError();
            }
        }
        else {
            sendError();
            // Only check state if not cancelOnError.
            this._checkState(wasInputPaused);
        }
    }
    _sendDone() {
        //assert(!_isCanceled);
        // assert(!_isPaused);
        // assert(!_inCallback);
        let sendDone = () => {
            // If the subscription has been canceled while waiting for the cancel
            // future to finish we must not report the done event.
            if (!this._waitsForCancel)
                return;
            this._state |= (_BufferingStreamSubscription._STATE_CANCELED | _BufferingStreamSubscription._STATE_CLOSED | _BufferingStreamSubscription._STATE_IN_CALLBACK);
            this._zone.runGuarded(this._onDone);
            this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        };
        this._cancel();
        this._state |= _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
        if (is(this._cancelFuture, Future) &&
            !identical(this._cancelFuture, Future._nullFuture)) {
            this._cancelFuture.whenComplete(sendDone);
        }
        else {
            sendDone();
        }
    }
    /**
     * Call a hook function.
     *
     * The call is properly wrapped in code to avoid other callbacks
     * during the call, and it checks for state changes after the call
     * that should cause further callbacks.
     */
    _guardCallback(callback) {
        //assert(!_inCallback);
        let wasInputPaused = this._isInputPaused;
        this._state |= _BufferingStreamSubscription._STATE_IN_CALLBACK;
        callback();
        this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        this._checkState(wasInputPaused);
    }
    /**
     * Check if the input needs to be informed of state changes.
     *
     * State changes are pausing, resuming and canceling.
     *
     * After canceling, no further callbacks will happen.
     *
     * The cancel callback is called after a user cancel, or after
     * the final done event is sent.
     */
    _checkState(wasInputPaused) {
        //assert(!_inCallback);
        if (this._hasPending && this._pending.isEmpty) {
            this._state &= ~_BufferingStreamSubscription._STATE_HAS_PENDING;
            if (this._isInputPaused && this._mayResumeInput) {
                this._state &= ~_BufferingStreamSubscription._STATE_INPUT_PAUSED;
            }
        }
        // If the state changes during a callback, we immediately
        // make a new state-change callback. Loop until the state didn't change.
        while (true) {
            if (this._isCanceled) {
                this._pending = null;
                return;
            }
            let isInputPaused = this._isInputPaused;
            if (wasInputPaused == isInputPaused)
                break;
            this._state ^= _BufferingStreamSubscription._STATE_IN_CALLBACK;
            if (isInputPaused) {
                this._onPause();
            }
            else {
                this._onResume();
            }
            this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
            wasInputPaused = isInputPaused;
        }
        if (this._hasPending && !this._isPaused) {
            this._pending.schedule(this);
        }
    }
}
/** The `cancelOnError` flag from the `listen` call. */
_BufferingStreamSubscription._STATE_CANCEL_ON_ERROR = 1;
/**
 * Whether the "done" event has been received.
 * No further events are accepted after this.
 */
_BufferingStreamSubscription._STATE_CLOSED = 2;
/**
 * Set if the input has been asked not to send events.
 *
 * This is not the same as being paused, since the input will remain paused
 * after a call to [resume] if there are pending events.
 */
_BufferingStreamSubscription._STATE_INPUT_PAUSED = 4;
/**
 * Whether the subscription has been canceled.
 *
 * Set by calling [cancel], or by handling a "done" event, or an "error" event
 * when `cancelOnError` is true.
 */
_BufferingStreamSubscription._STATE_CANCELED = 8;
/**
 * Set when either:
 *
 *   * an error is sent, and [cancelOnError] is true, or
 *   * a done event is sent.
 *
 * If the subscription is canceled while _STATE_WAIT_FOR_CANCEL is set, the
 * state is unset, and no furher events must be delivered.
 */
_BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL = 16;
_BufferingStreamSubscription._STATE_IN_CALLBACK = 32;
_BufferingStreamSubscription._STATE_HAS_PENDING = 64;
_BufferingStreamSubscription._STATE_PAUSE_COUNT = 128;
// -------------------------------------------------------------------
// Common base class for single and multi-subscription streams.
// -------------------------------------------------------------------
let _StreamImpl = class _StreamImpl extends DartStream {
    constructor() {
        super();
    }
    _init() {
        super._init();
    }
    // ------------------------------------------------------------------
    // Stream interface.
    listen(onData, _) {
        let { onError, onDone, cancelOnError } = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        let subscription = this._createSubscription(onData, onError, onDone, cancelOnError);
        this._onListen(subscription);
        return subscription;
    }
    // -------------------------------------------------------------------
    /** Create a subscription object. Called by [subcribe]. */
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return new _BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
    }
    /** Hook called when the subscription has been created. */
    _onListen(subscription) {
    }
};
__decorate([
    defaultConstructor
], _StreamImpl.prototype, "_init", null);
_StreamImpl = __decorate([
    DartClass
], _StreamImpl);
/** Superclass for provider of pending events. */
let _PendingEvents = _PendingEvents_1 = class _PendingEvents {
    /** Superclass for provider of pending events. */
    constructor() {
        /**
         * State of being scheduled.
         *
         * Set to [_STATE_SCHEDULED] when pending events are scheduled for
         * async dispatch. Since we can't cancel a [scheduleMicrotask] call, if
         * scheduling is "canceled", the _state is simply set to [_STATE_CANCELED]
         * which will make the async code do nothing except resetting [_state].
         *
         * If events are scheduled while the state is [_PendingEvents._STATE_CANCELED], it is
         * merely switched back to [_PendingEvents._STATE_SCHEDULED], but no new call to
         * [scheduleMicrotask] is performed.
         */
        this._state = _PendingEvents_1._STATE_UNSCHEDULED;
    }
    get isEmpty() {
        throw 'abstract';
    }
    get isScheduled() {
        return this._state == _PendingEvents_1._STATE_SCHEDULED;
    }
    get _eventScheduled() {
        return this._state >= _PendingEvents_1._STATE_SCHEDULED;
    }
    /**
     * Schedule an event to run later.
     *
     * If called more than once, it should be called with the same dispatch as
     * argument each time. It may reuse an earlier argument in some cases.
     */
    schedule(dispatch) {
        if (this.isScheduled)
            return;
        // assert(!isEmpty);
        if (this._eventScheduled) {
            //assert(_state == _PendingEvents._STATE_CANCELED);
            this._state = _PendingEvents_1._STATE_SCHEDULED;
            return;
        }
        scheduleMicrotask(() => {
            let oldState = this._state;
            this._state = _PendingEvents_1._STATE_UNSCHEDULED;
            if (oldState == _PendingEvents_1._STATE_CANCELED)
                return;
            this.handleNext(dispatch);
        });
        this._state = _PendingEvents_1._STATE_SCHEDULED;
    }
    cancelSchedule() {
        if (this.isScheduled)
            this._state = _PendingEvents_1._STATE_CANCELED;
    }
    handleNext(dispatch) {
        throw 'abstract';
    }
    /** Throw away any pending events and cancel scheduled events. */
    clear() {
        throw 'abstract';
    }
};
// No async event has been scheduled.
_PendingEvents._STATE_UNSCHEDULED = 0;
// An async event has been scheduled to run a function.
_PendingEvents._STATE_SCHEDULED = 1;
// An async event has been scheduled, but it will do nothing when it runs.
// Async events can't be preempted.
_PendingEvents._STATE_CANCELED = 3;
__decorate([
    AbstractProperty
], _PendingEvents.prototype, "isEmpty", null);
__decorate([
    Abstract
], _PendingEvents.prototype, "handleNext", null);
__decorate([
    Abstract
], _PendingEvents.prototype, "clear", null);
_PendingEvents = _PendingEvents_1 = __decorate([
    DartClass
], _PendingEvents);
/** Stream that generates its own events. */
let _GeneratedStreamImpl = class _GeneratedStreamImpl extends _StreamImpl {
    /**
     * Initializes the stream to have only the events provided by a
     * [_PendingEvents].
     *
     * A new [_PendingEvents] must be generated for each listen.
     */
    constructor(_peding) {
        super();
        this._isUsed = false;
    }
    _GeneratedStreamImpl(_pending) {
        super._init();
        this._pending = _pending;
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        if (this._isUsed)
            throw new StateError("Stream has already been listened to.");
        this._isUsed = true;
        return $with(new _BufferingStreamSubscription(onData, onError, onDone, cancelOnError), (_) => _._setPendingEvents(this._pending()));
    }
};
__decorate([
    defaultConstructor
], _GeneratedStreamImpl.prototype, "_GeneratedStreamImpl", null);
_GeneratedStreamImpl = __decorate([
    DartClass
], _GeneratedStreamImpl);
/** Pending events object that gets its events from an [Iterable]. */
class _IterablePendingEvents extends _PendingEvents {
    constructor(data) {
        super();
        this._iterator = data.iterator;
    }
    get isEmpty() {
        return this._iterator == null;
    }
    handleNext(dispatch) {
        if (this._iterator == null) {
            throw new StateError("No events pending.");
        }
        // Send one event per call to moveNext.
        // If moveNext returns true, send the current element as data.
        // If moveNext returns false, send a done event and clear the _iterator.
        // If moveNext throws an error, send an error and clear the _iterator.
        // After an error, no further events will be sent.
        let isDone;
        try {
            isDone = !this._iterator.moveNext();
        }
        catch (e) {
            let s = new DartStackTrace(e);
            this._iterator = null;
            dispatch._sendError(e, s);
            return;
        }
        if (!isDone) {
            dispatch._sendData(this._iterator.current);
        }
        else {
            this._iterator = null;
            dispatch._sendDone();
        }
    }
    clear() {
        if (this.isScheduled)
            this.cancelSchedule();
        this._iterator = null;
    }
}
/** Default data handler, does nothing. */
function _nullDataHandler(value) {
}
/** Default error handler, reports the error to the current zone's handler. */
function _nullErrorHandler(error, stackTrace) {
    DartZone.current.handleUncaughtError(error, stackTrace);
}
/** Default done handler, does nothing. */
function _nullDoneHandler() {
}
/** A delayed event on a buffering stream subscription. */
let _DelayedEvent = class _DelayedEvent {
    /** Execute the delayed event on the [StreamController]. */
    perform(dispatch) {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], _DelayedEvent.prototype, "perform", null);
_DelayedEvent = __decorate([
    DartClass
], _DelayedEvent);
/** A delayed data event. */
class _DelayedData extends _DelayedEvent {
    constructor(value) {
        super();
        this.value = value;
    }
    perform(dispatch) {
        dispatch._sendData(this.value);
    }
}
/** A delayed error event. */
class _DelayedError extends _DelayedEvent {
    constructor(error, stackTrace) {
        super();
        this.error = error;
        this.stackTrace = stackTrace;
    }
    perform(dispatch) {
        dispatch._sendError(this.error, this.stackTrace);
    }
}
/** A delayed done event. */
class _DelayedDone extends _DelayedEvent {
    constructor() {
        super();
    }
    perform(dispatch) {
        dispatch._sendDone();
    }
    get next() {
        return null;
    }
    set next(_) {
        throw new StateError("No events after a done.");
    }
}
/** Class holding pending events for a [_StreamImpl]. */
class _StreamImplEvents extends _PendingEvents {
    constructor() {
        super(...arguments);
        /// Single linked list of [_DelayedEvent] objects.
        this.firstPendingEvent = null;
        /// Last element in the list of pending events. New events are added after it.
        this.lastPendingEvent = null;
    }
    get isEmpty() {
        return this.lastPendingEvent == null;
    }
    add(event) {
        if (this.lastPendingEvent == null) {
            this.firstPendingEvent = this.lastPendingEvent = event;
        }
        else {
            this.lastPendingEvent = this.lastPendingEvent.next = event;
        }
    }
    handleNext(dispatch) {
        //assert(!isScheduled);
        let event = this.firstPendingEvent;
        this.firstPendingEvent = event.next;
        if (this.firstPendingEvent == null) {
            this.lastPendingEvent = null;
        }
        event.perform(dispatch);
    }
    clear() {
        if (this.isScheduled)
            this.cancelSchedule();
        this.firstPendingEvent = this.lastPendingEvent = null;
    }
}
/**
 * Done subscription that will send one done event as soon as possible.
 */
class _DoneStreamSubscription {
    constructor(_onDone) {
        this._state = 0;
        this._zone = DartZone.current;
        this._onDone = _onDone;
        this._schedule();
    }
    get _isSent() {
        return (this._state & _DoneStreamSubscription._DONE_SENT) != 0;
    }
    get _isScheduled() {
        return (this._state & _DoneStreamSubscription._SCHEDULED) != 0;
    }
    get isPaused() {
        return this._state >= _DoneStreamSubscription._PAUSED;
    }
    _schedule() {
        if (this._isScheduled)
            return;
        this._zone.scheduleMicrotask(() => this._sendDone());
        this._state |= _DoneStreamSubscription._SCHEDULED;
    }
    onData(handleData) {
    }
    onError(handleError) {
    }
    onDone(handleDone) {
        this._onDone = handleDone;
    }
    pause(resumeSignal) {
        this._state += _DoneStreamSubscription._PAUSED;
        if (resumeSignal != null)
            resumeSignal.whenComplete(() => this.resume());
    }
    resume() {
        if (this.isPaused) {
            this._state -= _DoneStreamSubscription._PAUSED;
            if (!this.isPaused && !this._isSent) {
                this._schedule();
            }
        }
    }
    cancel() {
        return Future._nullFuture;
    }
    asFuture(futureValue) {
        let result = new _Future();
        this._onDone = () => {
            result._completeWithValue(null);
        };
        return result;
    }
    _sendDone() {
        this._state &= ~_DoneStreamSubscription._SCHEDULED;
        if (this.isPaused)
            return;
        this._state |= _DoneStreamSubscription._DONE_SENT;
        if (this._onDone != null)
            this._zone.runGuarded(() => this._onDone());
    }
}
_DoneStreamSubscription._DONE_SENT = 1;
_DoneStreamSubscription._SCHEDULED = 2;
_DoneStreamSubscription._PAUSED = 4;
let _AsBroadcastStream = class _AsBroadcastStream extends DartStream {
    constructor(_source, onListenHandler, onCancelHandler) {
        super();
    }
    _AsBroadcastStream(_source, onListenHandler, onCancelHandler) {
        super._init();
        // TODO(floitsch): the return type should be void and should be
        // inferred.
        this._onListenHandler = DartZone.current
            .registerUnaryCallback(onListenHandler);
        this._onCancelHandler = DartZone.current
            .registerUnaryCallback(onCancelHandler);
        this._zone = DartZone.current;
        this._source = _source;
        this._controller = new _AsBroadcastStreamController(this._onListen.bind(this), this._onCancel.bind(this));
    }
    get isBroadcast() {
        return true;
    }
    listen(onData, _) {
        let { onError, onDone, cancelOnError } = Object.assign({}, _);
        if (this._controller == null || this._controller.isClosed) {
            // Return a dummy subscription backed by nothing, since
            // it will only ever send one done event.
            return new _DoneStreamSubscription(onDone);
        }
        if (this._subscription == null) {
            this._subscription = this._source.listen(this._controller.add.bind(this._controller), { onError: this._controller.addError.bind(this._controller), onDone: this._controller.close.bind(this._controller) });
        }
        cancelOnError = identical(true, cancelOnError);
        return this._controller._subscribe(onData, onError, onDone, cancelOnError);
    }
    _onCancel() {
        let shutdown = (this._controller == null) || this._controller.isClosed;
        if (this._onCancelHandler != null) {
            this._zone.runUnary(this._onCancelHandler, new _BroadcastSubscriptionWrapper(this));
        }
        if (shutdown) {
            if (this._subscription != null) {
                this._subscription.cancel();
                this._subscription = null;
            }
        }
    }
    _onListen() {
        if (this._onListenHandler != null) {
            this._zone.runUnary(this._onListenHandler, new _BroadcastSubscriptionWrapper(this));
        }
    }
    // Methods called from _BroadcastSubscriptionWrapper.
    _cancelSubscription() {
        if (this._subscription == null)
            return;
        // Called by [_controller] when it has no subscribers left.
        let subscription = this._subscription;
        this._subscription = null;
        this._controller = null; // Marks the stream as no longer listenable.
        subscription.cancel();
    }
    _pauseSubscription(resumeSignal) {
        if (this._subscription == null)
            return;
        this._subscription.pause(resumeSignal);
    }
    _resumeSubscription() {
        if (this._subscription == null)
            return;
        this._subscription.resume();
    }
    get _isSubscriptionPaused() {
        if (this._subscription == null)
            return false;
        return this._subscription.isPaused;
    }
};
__decorate([
    defaultConstructor
], _AsBroadcastStream.prototype, "_AsBroadcastStream", null);
_AsBroadcastStream = __decorate([
    DartClass
], _AsBroadcastStream);
/**
 * Wrapper for subscription that disallows changing handlers.
 */
class _BroadcastSubscriptionWrapper {
    constructor(_stream) {
        this._stream = _stream;
    }
    onData(handleData) {
        throw new UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    onError(handleError) {
        throw new UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    onDone(handleDone) {
        throw new UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
    pause(resumeSignal) {
        this._stream._pauseSubscription(resumeSignal);
    }
    resume() {
        this._stream._resumeSubscription();
    }
    cancel() {
        this._stream._cancelSubscription();
        return Future._nullFuture;
    }
    get isPaused() {
        return this._stream._isSubscriptionPaused;
    }
    asFuture(futureValue) {
        throw new UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
    }
}
/**
 * Simple implementation of [StreamIterator].
 *
 * Pauses the stream between calls to [moveNext].
 */
class _StreamIterator {
    constructor(stream) {
        /// Whether the iterator is between calls to `moveNext`.
        /// This will usually cause the [_subscription] to be paused, but as an
        /// optimization, we only pause after the [moveNext] future has been
        /// completed.
        this._isPaused = false;
        this._stateData = stream;
    }
    get current() {
        if (this._subscription != null && this._isPaused) {
            return this._stateData /*=T*/;
        }
        return null;
    }
    moveNext() {
        if (this._subscription != null) {
            if (this._isPaused) {
                let future = new _Future();
                this._stateData = future;
                this._isPaused = false;
                this._subscription.resume();
                return future;
            }
            throw new StateError("Already waiting for next.");
        }
        return this._initializeOrDone();
    }
    /// Called if there is no active subscription when [moveNext] is called.
    ///
    /// Either starts listening on the stream if this is the first call to
    /// [moveNext], or returns a `false` future because the stream has already
    /// ended.
    _initializeOrDone() {
        //assert(_subscription == null);
        let stateData = this._stateData;
        if (stateData != null) {
            let stream = stateData /*=Stream<T>*/;
            this._subscription = stream.listen(this._onData.bind(this), {
                onError: this._onError.bind(this), onDone: this._onDone.bind(this), cancelOnError: true
            });
            let future = new _Future();
            this._stateData = future;
            return future;
        }
        return new _Future.immediate(false);
    }
    cancel() {
        let subscription = this._subscription;
        let stateData = this._stateData;
        this._stateData = null;
        if (subscription != null) {
            this._subscription = null;
            if (!this._isPaused) {
                let future = stateData /*=_Future<bool>*/;
                future._asyncComplete(false);
            }
            return subscription.cancel();
        }
        return Future._nullFuture;
    }
    _onData(data) {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture = this._stateData /*=_Future<bool>*/;
        this._stateData = data;
        this._isPaused = true;
        moveNextFuture._complete(true);
        if (this._subscription != null && this._isPaused)
            this._subscription.pause();
    }
    _onError(error, stackTrace) {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture = this._stateData /*=_Future<bool>*/;
        this._subscription = null;
        this._stateData = null;
        moveNextFuture._completeError(error, stackTrace);
    }
    _onDone() {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture = this._stateData /*=_Future<bool>*/;
        this._subscription = null;
        this._stateData = null;
        moveNextFuture._complete(false);
    }
    next(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let hasNext = yield this.moveNext();
            return {
                done: !hasNext,
                value: this.current
            };
        });
    }
    return(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancel();
            return {
                done: true,
                value: this.current
            };
        });
    }
    throw(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cancel();
            return {
                done: true,
                value: this.current
            };
        });
    }
}
/** An empty broadcast stream, sending a done event as soon as possible. */
let _EmptyStream = class _EmptyStream extends DartStream {
    constructor() {
        super();
    }
    _EmptyStream() {
        super._internal();
    }
    get isBroadcast() {
        return true;
    }
    listen(onData, _) {
        return new _DoneStreamSubscription(_.onDone);
    }
};
__decorate([
    defaultConstructor
], _EmptyStream.prototype, "_EmptyStream", null);
_EmptyStream = __decorate([
    DartClass
], _EmptyStream);
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.async;
/** Runs user code and takes actions depending on success or failure. */
function _runUserCode(userCode, onSuccess, onError) {
    try {
        onSuccess(userCode());
    }
    catch (e) {
        let s = new DartStackTrace(e);
        let replacement = DartZone.current.errorCallback(e, s);
        if (replacement == null) {
            onError(e, s);
        }
        else {
            let error = _nonNullError(replacement.error);
            let stackTrace = replacement.stackTrace;
            onError(error, stackTrace);
        }
    }
}
/** Helper function to cancel a subscription and wait for the potential future,
 before completing with an error. */
function _cancelAndError(subscription, future, error, stackTrace) {
    let cancelFuture = subscription.cancel();
    if (is(cancelFuture, Future) && !identical(cancelFuture, Future._nullFuture)) {
        cancelFuture.whenComplete(() => future._completeError(error, stackTrace));
    }
    else {
        future._completeError(error, stackTrace);
    }
}
function _cancelAndErrorWithReplacement(subscription, future, error, stackTrace) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    _cancelAndError(subscription, future, error, stackTrace);
}
/** Helper function to make an onError argument to [_runUserCode]. */
function _cancelAndErrorClosure(subscription, future) {
    return (error, stackTrace) => {
        _cancelAndError(subscription, future, error, stackTrace);
    };
}
/** Helper function to cancel a subscription and wait for the potential future,
 before completing with a value. */
function _cancelAndValue(subscription, future, value) {
    let cancelFuture = subscription.cancel();
    if (is(cancelFuture, Future) && !identical(cancelFuture, Future._nullFuture)) {
        cancelFuture.whenComplete(() => future._complete(value));
    }
    else {
        future._complete(value);
    }
}
/**
 * A [Stream] that forwards subscriptions to another stream.
 *
 * This stream implements [Stream], but forwards all subscriptions
 * to an underlying stream, and wraps the returned subscription to
 * modify the events on the way.
 *
 * This class is intended for internal use only.
 */
let _ForwardingStream = class _ForwardingStream extends DartStream {
    constructor(_source) {
        super();
        this._source = _source;
    }
    get isBroadcast() {
        return this._source.isBroadcast;
    }
    listen(onData, _) {
        let { onError, onDone, cancelOnError } = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        return this._createSubscription(onData, onError, onDone, cancelOnError);
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return new _ForwardingStreamSubscription(this, onData, onError, onDone, cancelOnError);
    }
    // Override the following methods in subclasses to change the behavior.
    _handleData(data, sink) {
        sink._add(data /*=T*/);
    }
    _handleError(error, stackTrace, sink) {
        sink._addError(error, stackTrace);
    }
    _handleDone(sink) {
        sink._close();
    }
};
_ForwardingStream = __decorate([
    DartClass
], _ForwardingStream);
/**
 * Abstract superclass for subscriptions that forward to other subscriptions.
 */
let _ForwardingStreamSubscription = class _ForwardingStreamSubscription extends _BufferingStreamSubscription {
    constructor(_stream, onData, onError, onDone, cancelOnError) {
        super(onData, onError, onDone, cancelOnError);
        this._stream = _stream;
        this._subscription = _stream._source
            .listen(this._handleData.bind(this), { onError: this._handleError.bind(this), onDone: this._handleDone.bind(this) });
    }
    // _StreamSink interface.
    // Transformers sending more than one event have no way to know if the stream
    // is canceled or closed after the first, so we just ignore remaining events.
    _add(data) {
        if (this._isClosed)
            return;
        super._add(data);
    }
    _addError(error, stackTrace) {
        if (this._isClosed)
            return;
        super._addError(error, stackTrace);
    }
    // StreamSubscription callbacks.
    _onPause() {
        if (this._subscription == null)
            return;
        this._subscription.pause();
    }
    _onResume() {
        if (this._subscription == null)
            return;
        this._subscription.resume();
    }
    _onCancel() {
        if (this._subscription != null) {
            let subscription = this._subscription;
            this._subscription = null;
            return subscription.cancel();
        }
        return null;
    }
    // Methods used as listener on source subscription.
    _handleData(data) {
        this._stream._handleData(data, this);
    }
    _handleError(error, stackTrace) {
        this._stream._handleError(error, stackTrace, this);
    }
    _handleDone() {
        this._stream._handleDone(this);
    }
};
_ForwardingStreamSubscription = __decorate([
    DartClass
], _ForwardingStreamSubscription);
function _addErrorWithReplacement(sink, error, stackTrace) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    sink._addError(error, stackTrace);
}
let _WhereStream = class _WhereStream extends _ForwardingStream {
    constructor(source, test) {
        super(source);
        this._test = test;
    }
    _handleData(inputEvent, sink) {
        let satisfies;
        try {
            satisfies = this._test(inputEvent);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return;
        }
        if (satisfies) {
            sink._add(inputEvent);
        }
    }
};
_WhereStream = __decorate([
    DartClass
], _WhereStream);
/**
 * A stream pipe that converts data events before passing them on.
 */
let _MapStream = class _MapStream extends _ForwardingStream {
    constructor(source, transform) {
        super(source);
        this._transform = transform;
    }
    _handleData(inputEvent, sink) {
        let outputEvent;
        try {
            outputEvent = this._transform(inputEvent);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return;
        }
        sink._add(outputEvent);
    }
};
_MapStream = __decorate([
    DartClass
], _MapStream);
/**
 * A stream pipe that converts data events before passing them on.
 */
let _ExpandStream = class _ExpandStream extends _ForwardingStream {
    constructor(source, expand) {
        super(source);
        this._expand = expand;
    }
    _handleData(inputEvent, sink) {
        try {
            for (let value of this._expand(inputEvent)) {
                sink._add(value);
            }
        }
        catch (e) {
            let s = new DartStackTrace(e);
            // If either _expand or iterating the generated iterator throws,
            // we abort the iteration.
            _addErrorWithReplacement(sink, e, s);
        }
    }
};
_ExpandStream = __decorate([
    DartClass
], _ExpandStream);
/**
 * A stream pipe that converts or disposes error events
 * before passing them on.
 */
let _HandleErrorStream = class _HandleErrorStream extends _ForwardingStream {
    constructor(source, onError, test) {
        super(source);
        this._transform = onError;
        this._test = test;
    }
    _handleError(error, stackTrace, sink) {
        let matches = true;
        if (this._test != null) {
            try {
                matches = this._test(error);
            }
            catch (e) {
                let s = new DartStackTrace(e);
                _addErrorWithReplacement(sink, e, s);
                return;
            }
        }
        if (matches) {
            try {
                _invokeErrorHandler(this._transform, error, stackTrace);
            }
            catch (e) {
                let s = new DartStackTrace(e);
                if (identical(e, error)) {
                    sink._addError(error, stackTrace);
                }
                else {
                    _addErrorWithReplacement(sink, e, s);
                }
                return;
            }
        }
        else {
            sink._addError(error, stackTrace);
        }
    }
};
_HandleErrorStream = __decorate([
    DartClass
], _HandleErrorStream);
class _TakeStream extends _ForwardingStream {
    constructor(source, count) {
        super(source);
        this._count = count;
        // This test is done early to avoid handling an async error
        // in the _handleData method.
        if (isNot(count, 'int'))
            throw new ArgumentError(count);
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        if (this._count == 0) {
            this._source.listen(null).cancel();
            return new _DoneStreamSubscription(onDone);
        }
        return new _StateStreamSubscription(this, onData, onError, onDone, cancelOnError, this._count);
    }
    _handleData(inputEvent, sink) {
        let subscription = sink;
        let count = subscription._count;
        if (count > 0) {
            sink._add(inputEvent);
            count -= 1;
            subscription._count = count;
            if (count == 0) {
                // Closing also unsubscribes all subscribers, which unsubscribes
                // this from source.
                sink._close();
            }
        }
    }
}
/**
 * A [_ForwardingStreamSubscription] with one extra state field.
 *
 * Use by several different classes, storing an integer, bool or general.
 */
let _StateStreamSubscription = class _StateStreamSubscription extends _ForwardingStreamSubscription {
    constructor(stream, onData, onError, onDone, cancelOnError, _sharedState) {
        super(stream, onData, onError, onDone, cancelOnError);
        this._sharedState = _sharedState;
    }
    get _flag() {
        return this._sharedState;
    }
    set _flag(flag) {
        this._sharedState = flag;
    }
    get _count() {
        return this._sharedState;
    }
    set _count(count) {
        this._sharedState = count;
    }
    get _value() {
        return this._sharedState;
    }
    set _value(value) {
        this._sharedState = value;
    }
};
_StateStreamSubscription = __decorate([
    DartClass
], _StateStreamSubscription);
let _TakeWhileStream = class _TakeWhileStream extends _ForwardingStream {
    constructor(source, test) {
        super(source);
        this._test = test;
    }
    _handleData(inputEvent, sink) {
        let satisfies;
        try {
            satisfies = this._test(inputEvent);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            // The test didn't say true. Didn't say false either, but we stop anyway.
            sink._close();
            return;
        }
        if (satisfies) {
            sink._add(inputEvent);
        }
        else {
            sink._close();
        }
    }
};
_TakeWhileStream = __decorate([
    DartClass
], _TakeWhileStream);
let _SkipStream = class _SkipStream extends _ForwardingStream {
    constructor(source, count) {
        super(source);
        this._count = count;
        // This test is done early to avoid handling an async error
        // in the _handleData method.
        if (isNot(count, 'int') || count < 0)
            throw new ArgumentError(count);
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return new _StateStreamSubscription(this, onData, onError, onDone, cancelOnError, this._count);
    }
    _handleData(inputEvent, sink) {
        let subscription = sink;
        let count = subscription._count;
        if (count > 0) {
            subscription._count = count - 1;
            return;
        }
        sink._add(inputEvent);
    }
};
_SkipStream = __decorate([
    DartClass
], _SkipStream);
let _SkipWhileStream = class _SkipWhileStream extends _ForwardingStream {
    constructor(source, test) {
        super(source);
        this._test = test;
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return new _StateStreamSubscription(this, onData, onError, onDone, cancelOnError, false);
    }
    _handleData(inputEvent, sink) {
        let subscription = sink;
        let hasFailed = subscription._flag;
        if (hasFailed) {
            sink._add(inputEvent);
            return;
        }
        let satisfies;
        try {
            satisfies = this._test(inputEvent);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            // A failure to return a boolean is considered "not matching".
            subscription._flag = true;
            return;
        }
        if (!satisfies) {
            subscription._flag = true;
            sink._add(inputEvent);
        }
    }
};
_SkipWhileStream = __decorate([
    DartClass
], _SkipWhileStream);
let _DistinctStream = _DistinctStream_1 = class _DistinctStream extends _ForwardingStream {
    constructor(source, equals) {
        super(source);
        this._equals = equals;
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return new _StateStreamSubscription(this, onData, onError, onDone, cancelOnError, _DistinctStream_1._SENTINEL);
    }
    _handleData(inputEvent, sink) {
        let subscription = sink;
        let previous = subscription._value;
        if (identical(previous, _DistinctStream_1._SENTINEL)) {
            // First event.
            subscription._value = inputEvent;
            sink._add(inputEvent);
        }
        else {
            let previousEvent = previous;
            let isEqual;
            try {
                if (this._equals == null) {
                    isEqual = (equals(previousEvent, inputEvent));
                }
                else {
                    isEqual = this._equals(previousEvent, inputEvent);
                }
            }
            catch (e) {
                let s = new DartStackTrace(e);
                _addErrorWithReplacement(sink, e, s);
                return;
            }
            if (!isEqual) {
                sink._add(inputEvent);
                subscription._value = inputEvent;
            }
        }
    }
};
_DistinctStream._SENTINEL = {};
_DistinctStream = _DistinctStream_1 = __decorate([
    DartClass
], _DistinctStream);
/**
 * A controller with the stream it controls.
 *
 * This controller allows sending data, error and done events on
 * its [stream].
 * This class can be used to create a simple stream that others
 * can listen on, and to push events to that stream.
 *
 * It's possible to check whether the stream is paused or not, and whether
 * it has subscribers or not, as well as getting a callback when either of
 * these change.
 *
 * If the stream starts or stops having listeners (first listener subscribing,
 * last listener unsubscribing), the `onSubscriptionStateChange` callback
 * is notified as soon as possible. If the subscription stat changes during
 * an event firing or a callback being executed, the change will not be reported
 * until the current event or callback has finished.
 * If the pause state has also changed during an event or callback, only the
 * subscription state callback is notified.
 *
 * If the subscriber state has not changed, but the pause state has, the
 * `onPauseStateChange` callback is notified as soon as possible, after firing
 * a current event or completing another callback. This happens if the stream
 * is not paused, and a listener pauses it, or if the stream has been resumed
 * from pause and has no pending events. If the listeners resume a paused stream
 * while it still has queued events, the controller will still consider the
 * stream paused until all queued events have been dispatched.
 *
 * Whether to invoke a callback depends only on the state before and after
 * a stream action, for example firing an event. If the state changes multiple
 * times during the action, and then ends up in the same state as before, no
 * callback is performed.
 *
 * If listeners are added after the stream has completed (sent a "done" event),
 * the listeners will be sent a "done" event eventually, but they won't affect
 * the stream at all, and won't trigger callbacks. From the controller's point
 * of view, the stream is completely inert when has completed.
 */
let DartStreamController = class DartStreamController {
    constructor(_) {
    }
    /** The stream that this controller is controlling. */
    get stream() {
        throw 'abstract';
    }
    /**
     * A controller with a [stream] that supports only one single subscriber.
     *
     * If [sync] is true, the returned stream controller is a
     * [SynchronousStreamController], and must be used with the care
     * and attention necessary to not break the [Stream] contract. If in doubt,
     * use the non-sync version.
     *
     * Using an asynchronous controller will never give the wrong
     * behavior, but using a synchronous controller incorrectly can cause
     * otherwise correct programs to break.
     *
     * A synchronous controller is only intended for optimizing event
     * propagation when one asynchronous event immediately triggers another.
     * It should not be used unless the calls to [add] or [addError]
     * are guaranteed to occur in places where it won't break `Stream` invariants.
     *
     * Use synchronous controllers only to forward (potentially transformed)
     * events from another stream or a future.
     *
     * A Stream should be inert until a subscriber starts listening on it (using
     * the [onListen] callback to start producing events). Streams should not
     * leak resources (like websockets) when no user ever listens on the stream.
     *
     * The controller buffers all incoming events until a subscriber is
     * registered, but this feature should only be used in rare circumstances.
     *
     * The [onPause] function is called when the stream becomes
     * paused. [onResume] is called when the stream resumed.
     *
     * The [onListen] callback is called when the stream
     * receives its listener and [onCancel] when the listener ends
     * its subscription. If [onCancel] needs to perform an asynchronous operation,
     * [onCancel] should return a future that completes when the cancel operation
     * is done.
     *
     * If the stream is canceled before the controller needs new data the
     * [onResume] call might not be executed.
     */
    static _StreamController(_) {
        let { onListen, onPause, onResume, onCancel, sync } = Object.assign({ sync: false }, _);
        return sync
            ? new _SyncStreamController(onListen, onPause, onResume, onCancel)
            : new _AsyncStreamController(onListen, onPause, onResume, onCancel);
    }
    /**
     * A controller where [stream] can be listened to more than once.
     *
     * The [Stream] returned by [stream] is a broadcast stream.
     * It can be listened to more than once.
     *
     * A Stream should be inert until a subscriber starts listening on it (using
     * the [onListen] callback to start producing events). Streams should not
     * leak resources (like websockets) when no user ever listens on the stream.
     *
     * Broadcast streams do not buffer events when there is no listener.
     *
     * The controller distributes any events to all currently subscribed
     * listeners at the time when [add], [addError] or [close] is called.
     * It is not allowed to call `add`, `addError`, or `close` before a previous
     * call has returned. The controller does not have any internal queue of
     * events, and if there are no listeners at the time the event is added,
     * it will just be dropped, or, if it is an error, be reported as uncaught.
     *
     * Each listener subscription is handled independently,
     * and if one pauses, only the pausing listener is affected.
     * A paused listener will buffer events internally until unpaused or canceled.
     *
     * If [sync] is true, events may be fired directly by the stream's
     * subscriptions during an [add], [addError] or [close] call.
     * The returned stream controller is a [SynchronousStreamController],
     * and must be used with the care and attention necessary to not break
     * the [Stream] contract.
     * See [Completer.sync] for some explanations on when a synchronous
     * dispatching can be used.
     * If in doubt, keep the controller non-sync.
     *
     * If [sync] is false, the event will always be fired at a later time,
     * after the code adding the event has completed.
     * In that case, no guarantees are given with regard to when
     * multiple listeners get the events, except that each listener will get
     * all events in the correct order. Each subscription handles the events
     * individually.
     * If two events are sent on an async controller with two listeners,
     * one of the listeners may get both events
     * before the other listener gets any.
     * A listener must be subscribed both when the event is initiated
     * (that is, when [add] is called)
     * and when the event is later delivered,
     * in order to receive the event.
     *
     * The [onListen] callback is called when the first listener is subscribed,
     * and the [onCancel] is called when there are no longer any active listeners.
     * If a listener is added again later, after the [onCancel] was called,
     * the [onListen] will be called again.
     */
    static _broadcast(_) {
        let { onListen, onCancel, sync } = Object.assign({ sync: false }, _);
        return sync
            ? new _SyncBroadcastStreamController(onListen, onCancel)
            : new _AsyncBroadcastStreamController(onListen, onCancel);
    }
    /**
     * The callback which is called when the stream is listened to.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    get onListen() {
        throw 'abstract';
    }
    set onListen(onListenHandler) {
        throw 'abstract';
    }
    /**
     * The callback which is called when the stream is paused.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    get onPause() {
        throw 'abstract';
    }
    set onPause(onPauseHandler) {
        throw 'abstract';
    }
    /**
     * The callback which is called when the stream is resumed.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    get onResume() {
        throw 'abstract';
    }
    set onResume(onResumeHandler) {
        throw 'abstract';
    }
    /**
     * The callback which is called when the stream is canceled.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    get onCancel() {
        throw 'abstract';
    }
    set onCancel(onCancelHandler) {
        throw 'abstract';
    }
    /**
     * Returns a view of this object that only exposes the [StreamSink] interface.
     */
    get sink() {
        throw 'abstract';
    }
    /**
     * Whether the stream controller is closed for adding more events.
     *
     * The controller becomes closed by calling the [close] method.
     * New events cannot be added, by calling [add] or [addError],
     * to a closed controller.
     *
     * If the controller is closed,
     * the "done" event might not have been delivered yet,
     * but it has been scheduled, and it is too late to add more events.
     */
    get isClosed() {
        throw 'abstract';
    }
    /**
     * Whether the subscription would need to buffer events.
     *
     * This is the case if the controller's stream has a listener and it is
     * paused, or if it has not received a listener yet. In that case, the
     * controller is considered paused as well.
     *
     * A broadcast stream controller is never considered paused. It always
     * forwards its events to all uncanceled subscriptions, if any,
     * and let the subscriptions handle their own pausing and buffering.
     */
    get isPaused() {
        throw 'abstract';
    }
    /** Whether there is a subscriber on the [Stream]. */
    get hasListener() {
        throw 'abstract';
    }
    /**
     * Sends a data [event].
     *
     * Listeners receive this event in a later microtask.
     *
     * Note that a synchronous controller (created by passing true to the `sync`
     * parameter of the `StreamController` constructor) delivers events
     * immediately. Since this behavior violates the contract mentioned here,
     * synchronous controllers should only be used as described in the
     * documentation to ensure that the delivered events always *appear* as if
     * they were delivered in a separate microtask.
     */
    add(event) {
        throw 'abstract';
    }
    /**
     * Sends or enqueues an error event.
     *
     * If [error] is `null`, it is replaced by a [NullThrownError].
     *
     * Listeners receive this event at a later microtask. This behavior can be
     * overridden by using `sync` controllers. Note, however, that sync
     * controllers have to satisfy the preconditions mentioned in the
     * documentation of the constructors.
     */
    addError(error, stackTrace) {
        throw 'abstract';
    }
    /**
     * Closes the stream.
     *
     * Listeners receive the done event at a later microtask. This behavior can be
     * overridden by using `sync` controllers. Note, however, that sync
     * controllers have to satisfy the preconditions mentioned in the
     * documentation of the constructors.
     */
    close() {
        throw 'abstract';
    }
    /**
     * Receives events from [source] and puts them into this controller's stream.
     *
     * Returns a future which completes when the source stream is done.
     *
     * Events must not be added directly to this controller using [add],
     * [addError], [close] or [addStream], until the returned future
     * is complete.
     *
     * Data and error events are forwarded to this controller's stream. A done
     * event on the source will end the `addStream` operation and complete the
     * returned future.
     *
     * If [cancelOnError] is true, only the first error on [source] is
     * forwarded to the controller's stream, and the `addStream` ends
     * after this. If [cancelOnError] is false, all errors are forwarded
     * and only a done event will end the `addStream`.
     */
    addStream(source, _) {
        throw 'abstract';
    }
};
__decorate([
    AbstractProperty
], DartStreamController.prototype, "stream", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "onListen", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "onPause", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "onResume", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "onCancel", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "sink", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "isClosed", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "isPaused", null);
__decorate([
    AbstractProperty
], DartStreamController.prototype, "hasListener", null);
__decorate([
    Abstract
], DartStreamController.prototype, "add", null);
__decorate([
    Abstract
], DartStreamController.prototype, "addError", null);
__decorate([
    Abstract
], DartStreamController.prototype, "close", null);
__decorate([
    Abstract
], DartStreamController.prototype, "addStream", null);
__decorate([
    defaultFactory
], DartStreamController, "_StreamController", null);
__decorate([
    namedFactory
], DartStreamController, "_broadcast", null);
DartStreamController = __decorate([
    DartClass
], DartStreamController);
/**
 * A stream controller that delivers its events synchronously.
 *
 * A synchronous stream controller is intended for cases where
 * an already asynchronous event triggers an event on a stream.
 *
 * Instead of adding the event to the stream in a later microtask,
 * causing extra latency, the event is instead fired immediately by the
 * synchronous stream controller, as if the stream event was
 * the current event or microtask.
 *
 * The synchronous stream controller can be used to break the contract
 * on [Stream], and it must be used carefully to avoid doing so.
 *
 * The only advantage to using a [SynchronousStreamController] over a
 * normal [StreamController] is the improved latency.
 * Only use the synchronous version if the improvement is significant,
 * and if its use is safe. Otherwise just use a normal stream controller,
 * which will always have the correct behavior for a [Stream], and won't
 * accidentally break other code.
 *
 * Adding events to a synchronous controller should only happen as the
 * very last part of the handling of the original event.
 * At that point, adding an event to the stream is equivalent to
 * returning to the event loop and adding the event in the next microtask.
 *
 * Each listener callback will be run as if it was a top-level event
 * or microtask. This means that if it throws, the error will be reported as
 * uncaught as soon as possible.
 * This is one reason to add the event as the last thing in the original event
 * handler - any action done after adding the event will delay the report of
 * errors in the event listener callbacks.
 *
 * If an event is added in a setting that isn't known to be another event,
 * it may cause the stream's listener to get that event before the listener
 * is ready to handle it. We promise that after calling [Stream.listen],
 * you won't get any events until the code doing the listen has completed.
 * Calling [add] in response to a function call of unknown origin may break
 * that promise.
 *
 * An [onListen] callback from the controller is *not* an asynchronous event,
 * and adding events to the controller in the `onListen` callback is always
 * wrong. The events will be delivered before the listener has even received
 * the subscription yet.
 *
 * The synchronous broadcast stream controller also has a restrictions that a
 * normal stream controller does not:
 * The [add], [addError], [close] and [addStream] methods *must not* be
 * called while an event is being delivered.
 * That is, if a callback on a subscription on the controller's stream causes
 * a call to any of the functions above, the call will fail.
 * A broadcast stream may have more than one listener, and if an
 * event is added synchronously while another is being also in the process
 * of being added, the latter event might reach some listeners before
 * the former. To prevent that, an event cannot be added while a previous
 * event is being fired.
 * This guarantees that an event is fully delivered when the
 * first [add], [addError] or [close] returns,
 * and further events will be delivered in the correct order.
 *
 * This still only guarantees that the event is delivered to the subscription.
 * If the subscription is paused, the actual callback may still happen later,
 * and the event will instead be buffered by the subscription.
 * Barring pausing, and the following buffered events that haven't been
 * delivered yet, callbacks will be called synchronously when an event is added.
 *
 * Adding an event to a synchronous non-broadcast stream controller while
 * another event is in progress may cause the second event to be delayed
 * and not be delivered synchronously, and until that event is delivered,
 * the controller will not act synchronously.
 */
let SynchronousStreamController = class SynchronousStreamController extends DartStreamController {
};
SynchronousStreamController = __decorate([
    DartClass
], SynchronousStreamController);
class _StreamControllerLifecycle extends DartObject {
    _recordPause(subscription) {
    }
    _recordResume(subscription) {
    }
    _recordCancel(subscription) {
        return null;
    }
}
/**
 * Default implementation of [StreamController].
 *
 * Controls a stream that only supports a single controller.
 */
class _StreamController extends DartObject {
    constructor(onListen, onPause, onResume, onCancel) {
        super();
        /** Current state of the controller. */
        this._state = _StreamController._STATE_INITIAL;
        this.onListen = onListen;
        this.onPause = onPause;
        this.onResume = onResume;
        this.onCancel = onCancel;
    }
    // Return a new stream every time. The streams are equal, but not identical.
    get stream() {
        return new _ControllerStream(this);
    }
    /**
     * Returns a view of this object that only exposes the [StreamSink] interface.
     */
    get sink() {
        return new _StreamSinkWrapper(this);
    }
    /**
     * Whether a listener has existed and been canceled.
     *
     * After this, adding more events will be ignored.
     */
    get _isCanceled() {
        return (this._state & _StreamController._STATE_CANCELED) != 0;
    }
    /** Whether there is an active listener. */
    get hasListener() {
        return (this._state & _StreamController._STATE_SUBSCRIBED) != 0;
    }
    /** Whether there has not been a listener yet. */
    get _isInitialState() {
        return (this._state & _StreamController._STATE_SUBSCRIPTION_MASK) == _StreamController._STATE_INITIAL;
    }
    get isClosed() {
        return (this._state & _StreamController._STATE_CLOSED) != 0;
    }
    get isPaused() {
        return this.hasListener ? this._subscription._isInputPaused : !this._isCanceled;
    }
    get _isAddingStream() {
        return (this._state & _StreamController._STATE_ADDSTREAM) != 0;
    }
    /** New events may not be added after close, or during addStream. */
    get _mayAddEvent() {
        return (this._state < _StreamController._STATE_CLOSED);
    }
    // Returns the pending events.
    // Pending events are events added before a subscription exists.
    // They are added to the subscription when it is created.
    // Pending events, if any, are kept in the _varData field until the
    // stream is listened to.
    // While adding a stream, pending events are moved into the
    // state object to allow the state object to use the _varData field.
    get _pendingEvents() {
        //assert(_isInitialState);
        if (!this._isAddingStream) {
            return this._varData /*=_PendingEvents<T>*/;
        }
        let state = this._varData /*=_StreamControllerAddStreamState<T>*/;
        return state.varData /*=_PendingEvents<T>*/;
    }
    // Returns the pending events, and creates the object if necessary.
    _ensurePendingEvents() {
        //assert(_isInitialState);
        if (!this._isAddingStream) {
            if (this._varData == null)
                this._varData = new _StreamImplEvents();
            return this._varData /*=_StreamImplEvents<T>*/;
        }
        let state = this._varData /*=_StreamControllerAddStreamState<T>*/;
        if (state.varData == null)
            state.varData = new _StreamImplEvents();
        return state.varData /*=_StreamImplEvents<T>*/;
    }
    // Get the current subscription.
    // If we are adding a stream, the subscription is moved into the state
    // object to allow the state object to use the _varData field.
    get _subscription() {
        //assert(hasListener);
        if (this._isAddingStream) {
            let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
            return addState.varData /*=_ControllerSubscription<T>*/;
        }
        return this._varData /*=_ControllerSubscription<T>*/;
    }
    /**
     * Creates an error describing why an event cannot be added.
     *
     * The reason, and therefore the error message, depends on the current state.
     */
    _badEventState() {
        if (this.isClosed) {
            return new StateError("Cannot add event after closing");
        }
        //assert(_isAddingStream);
        return new StateError("Cannot add event while adding a stream");
    }
    // StreamSink interface.
    addStream(source, _) {
        let { cancelOnError } = Object.assign({ cancelOnError: true }, _);
        if (!this._mayAddEvent)
            throw this._badEventState();
        if (this._isCanceled)
            return new _Future.immediate(null);
        let addState = new _StreamControllerAddStreamState(this, this._varData, source, cancelOnError);
        this._varData = addState;
        this._state |= _StreamController._STATE_ADDSTREAM;
        return addState.addStreamFuture;
    }
    /**
     * Returns a future that is completed when the stream is done
     * processing events.
     *
     * This happens either when the done event has been sent, or if the
     * subscriber of a single-subscription stream is cancelled.
     */
    get done() {
        return this._ensureDoneFuture();
    }
    _ensureDoneFuture() {
        if (this._doneFuture == null) {
            this._doneFuture = this._isCanceled ? Future._nullFuture : new _Future();
        }
        return this._doneFuture;
    }
    /**
     * Send or enqueue a data event.
     */
    add(value) {
        if (!this._mayAddEvent)
            throw this._badEventState();
        this._add(value);
    }
    /**
     * Send or enqueue an error event.
     */
    addError(error, stackTrace) {
        if (!this._mayAddEvent)
            throw this._badEventState();
        error = _nonNullError(error);
        let replacement = DartZone.current.errorCallback(error, stackTrace);
        if (replacement != null) {
            error = _nonNullError(replacement.error);
            stackTrace = replacement.stackTrace;
        }
        this._addError(error, stackTrace);
    }
    /**
     * Closes this controller and sends a done event on the stream.
     *
     * The first time a controller is closed, a "done" event is added to its
     * stream.
     *
     * You are allowed to close the controller more than once, but only the first
     * call has any effect.
     *
     * After closing, no further events may be added using [add], [addError]
     * or [addStream].
     *
     * The returned future is completed when the done event has been delivered.
     */
    close() {
        if (this.isClosed) {
            return this._ensureDoneFuture();
        }
        if (!this._mayAddEvent)
            throw this._badEventState();
        this._closeUnchecked();
        return this._ensureDoneFuture();
    }
    _closeUnchecked() {
        this._state |= _StreamController._STATE_CLOSED;
        if (this.hasListener) {
            this._sendDone();
        }
        else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedDone());
        }
    }
    // EventSink interface. Used by the [addStream] events.
    // Add data event, used both by the [addStream] events and by [add].
    _add(value) {
        if (this.hasListener) {
            this._sendData(value);
        }
        else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedData(value));
        }
    }
    _addError(error, stackTrace) {
        if (this.hasListener) {
            this._sendError(error, stackTrace);
        }
        else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedError(error, stackTrace));
        }
    }
    _close() {
        // End of addStream stream.
        //assert(_isAddingStream);
        let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
        this._varData = addState.varData;
        this._state &= ~_StreamController._STATE_ADDSTREAM;
        addState.complete();
    }
    // _StreamControllerLifeCycle interface
    _subscribe(onData, onError, onDone, cancelOnError) {
        if (!this._isInitialState) {
            throw new StateError("Stream has already been listened to.");
        }
        let subscription = new _ControllerSubscription(this, onData, onError, onDone, cancelOnError);
        let pendingEvents = this._pendingEvents;
        this._state |= _StreamController._STATE_SUBSCRIBED;
        if (this._isAddingStream) {
            let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
            addState.varData = subscription;
            addState.resume();
        }
        else {
            this._varData = subscription;
        }
        subscription._setPendingEvents(pendingEvents);
        subscription._guardCallback(() => {
            _runGuarded(this.onListen);
        });
        return subscription;
    }
    _recordCancel(subscription) {
        // When we cancel, we first cancel any stream being added,
        // Then we call `onCancel`, and finally the _doneFuture is completed.
        // If either of addStream's cancel or `onCancel` returns a future,
        // we wait for it before continuing.
        // Any error during this process ends up in the returned future.
        // If more errors happen, we act as if it happens inside nested try/finallys
        // or whenComplete calls, and only the last error ends up in the
        // returned future.
        let result;
        if (this._isAddingStream) {
            let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
            result = addState.cancel();
        }
        this._varData = null;
        this._state =
            (this._state & ~(_StreamController._STATE_SUBSCRIBED | _StreamController._STATE_ADDSTREAM)) | _StreamController._STATE_CANCELED;
        if (this.onCancel != null) {
            if (result == null) {
                // Only introduce a future if one is needed.
                // If _onCancel returns null, no future is needed.
                try {
                    result = this.onCancel();
                }
                catch (e) {
                    let s = new DartStackTrace(e);
                    // Return the error in the returned future.
                    // Complete it asynchronously, so there is time for a listener
                    // to handle the error.
                    result = $with(new _Future(), (f) => f._asyncCompleteError(e, s));
                }
            }
            else {
                // Simpler case when we already know that we will return a future.
                result = result.whenComplete(this.onCancel);
            }
        }
        let complete = () => {
            if (this._doneFuture != null && this._doneFuture._mayComplete) {
                this._doneFuture._asyncComplete(null);
            }
        };
        if (result != null) {
            result = result.whenComplete(complete);
        }
        else {
            complete();
        }
        return result;
    }
    _recordPause(subscription) {
        if (this._isAddingStream) {
            let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
            addState.pause();
        }
        _runGuarded(this.onPause);
    }
    _recordResume(subscription) {
        if (this._isAddingStream) {
            let addState = this._varData /*=_StreamControllerAddStreamState<T>*/;
            addState.resume();
        }
        _runGuarded(this.onResume);
    }
    _sendData(data) {
        throw 'abstract';
    }
    _sendDone() {
        throw 'abstract';
    }
    _sendError(error, stackTrace) {
        throw 'abstract';
    }
}
// The states are bit-flags. More than one can be set at a time.
//
// The "subscription state" goes through the states:
//   initial -> subscribed -> canceled.
// These are mutually exclusive.
// The "closed" state records whether the [close] method has been called
// on the controller. This can be done at any time. If done before
// subscription, the done event is queued. If done after cancel, the done
// event is ignored (just as any other event after a cancel).
/** The controller is in its initial state with no subscription. */
_StreamController._STATE_INITIAL = 0;
/** The controller has a subscription, but hasn't been closed or canceled. */
_StreamController._STATE_SUBSCRIBED = 1;
/** The subscription is canceled. */
_StreamController._STATE_CANCELED = 2;
/** Mask for the subscription state. */
_StreamController._STATE_SUBSCRIPTION_MASK = 3;
// The following state relate to the controller, not the subscription.
// If closed, adding more events is not allowed.
// If executing an [addStream], new events are not allowed either, but will
// be added by the stream.
/**
 * The controller is closed due to calling [close].
 *
 * When the stream is closed, you can neither add new events nor add new
 * listeners.
 */
_StreamController._STATE_CLOSED = 4;
/**
 * The controller is in the middle of an [addStream] operation.
 *
 * While adding events from a stream, no new events can be added directly
 * on the controller.
 */
_StreamController._STATE_ADDSTREAM = 8;
__decorate([
    Abstract
], _StreamController.prototype, "_sendData", null);
__decorate([
    Abstract
], _StreamController.prototype, "_sendDone", null);
__decorate([
    Abstract
], _StreamController.prototype, "_sendError", null);
let _SyncStreamControllerDispatch = class _SyncStreamControllerDispatch extends _StreamController {
    get _state() {
        throw 'abstract';
    }
    set _state(state) {
        throw 'abstract';
    }
    _sendData(data) {
        this._subscription._add(data);
    }
    _sendError(error, stackTrace) {
        this._subscription._addError(error, stackTrace);
    }
    _sendDone() {
        this._subscription._close();
    }
};
__decorate([
    AbstractProperty
], _SyncStreamControllerDispatch.prototype, "_state", null);
_SyncStreamControllerDispatch = __decorate([
    DartClass,
    Implements(SynchronousStreamController)
], _SyncStreamControllerDispatch);
let _AsyncStreamControllerDispatch = class _AsyncStreamControllerDispatch extends _StreamController {
    _sendData(data) {
        this._subscription._addPending(new _DelayedData(data));
    }
    _sendError(error, stackTrace) {
        this._subscription._addPending(new _DelayedError(error, stackTrace));
    }
    _sendDone() {
        this._subscription._addPending(new _DelayedDone());
    }
};
_AsyncStreamControllerDispatch = __decorate([
    DartClass
], _AsyncStreamControllerDispatch);
// TODO(lrn): Use common superclass for callback-controllers when VM supports
// constructors in mixin superclasses.
let _AsyncStreamController = class _AsyncStreamController extends _StreamController {
};
_AsyncStreamController = __decorate([
    DartClass,
    With(_AsyncStreamControllerDispatch)
], _AsyncStreamController);
let _SyncStreamController = class _SyncStreamController extends _StreamController {
};
_SyncStreamController = __decorate([
    DartClass,
    With(_SyncStreamControllerDispatch)
], _SyncStreamController);
function _runGuarded(notificationHandler) {
    if (notificationHandler == null)
        return;
    try {
        notificationHandler();
    }
    catch (e) {
        let s = new DartStackTrace(e);
        DartZone.current.handleUncaughtError(e, s);
    }
}
let _ControllerStream = _ControllerStream_1 = class _ControllerStream extends _StreamImpl {
    constructor(_controller) {
        super();
        this._controller = _controller;
    }
    _createSubscription(onData, onError, onDone, cancelOnError) {
        return this._controller._subscribe(onData, onError, onDone, cancelOnError);
    }
    // Override == and hashCode so that new streams returned by the same
    // controller are considered equal. The controller returns a new stream
    // each time it's queried, but doesn't have to cache the result.
    get hashCode() {
        return this._controller.hashCode ^ 0x35323532;
    }
    ;
    equals(other) {
        if (identical(this, other))
            return true;
        if (isNot(other, _ControllerStream_1))
            return false;
        let otherStream = other;
        return identical(otherStream._controller, this._controller);
    }
};
__decorate([
    Operator(Op.EQUALS)
], _ControllerStream.prototype, "equals", null);
_ControllerStream = _ControllerStream_1 = __decorate([
    DartClass
], _ControllerStream);
class _ControllerSubscription extends _BufferingStreamSubscription {
    constructor(_controller, onData, onError, onDone, cancelOnError) {
        super(onData, onError, onDone, cancelOnError);
        this._controller = _controller;
    }
    _onCancel() {
        return this._controller._recordCancel(this);
    }
    _onPause() {
        this._controller._recordPause(this);
    }
    _onResume() {
        this._controller._recordResume(this);
    }
}
/** A class that exposes only the [StreamSink] interface of an object. */
class _StreamSinkWrapper {
    constructor(_target) {
        this._target = _target;
    }
    add(data) {
        this._target.add(data);
    }
    addError(error, stackTrace) {
        this._target.addError(error, stackTrace);
    }
    close() {
        return this._target.close();
    }
    addStream(source, _) {
        return this._target.addStream(source, _);
    }
    get done() {
        return this._target.done;
    }
}
/**
 * Object containing the state used to handle [StreamController.addStream].
 */
class _AddStreamState {
    constructor(controller, source, cancelOnError) {
        this.addStreamFuture = new _Future();
        this.addSubscription = source.listen(controller._add.bind(controller), {
            onError: cancelOnError
                ? _AddStreamState.makeErrorHandler(controller)
                : controller._addError.bind(controller),
            onDone: controller._close.bind(controller),
            cancelOnError: cancelOnError
        });
    }
    static makeErrorHandler(controller) {
        return (e, s) => {
            controller._addError(e, s);
            controller._close();
        };
    }
    pause() {
        this.addSubscription.pause();
    }
    resume() {
        this.addSubscription.resume();
    }
    /**
     * Stop adding the stream.
     *
     * Complete the future returned by `StreamController.addStream` when
     * the cancel is complete.
     *
     * Return a future if the cancel takes time, otherwise return `null`.
     */
    cancel() {
        let cancel = this.addSubscription.cancel();
        if (cancel == null) {
            this.addStreamFuture._asyncComplete(null);
            return null;
        }
        return cancel.whenComplete(() => {
            this.addStreamFuture._asyncComplete(null);
        });
    }
    complete() {
        this.addStreamFuture._asyncComplete(null);
    }
}
class _StreamControllerAddStreamState extends _AddStreamState {
    constructor(controller, varData, source, cancelOnError) {
        super(controller, source, cancelOnError);
        this.varData = varData;
        if (controller.isPaused) {
            this.addSubscription.pause();
        }
    }
}
// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.async;
class _BroadcastStream extends _ControllerStream {
    constructor(controller) {
        super(controller);
    }
    get isBroadcast() {
        return true;
    }
}
class _BroadcastSubscription extends _ControllerSubscription {
    constructor(controller, onData, onError, onDone, cancelOnError) {
        super(controller, onData, onError, onDone, cancelOnError);
        // TODO(lrn): Use the _state field on _ControllerSubscription to
        // also store this state. Requires that the subscription implementation
        // does not assume that it's use of the state integer is the only use.
        this._eventState = 0; // Initialized to help dart2js type inference.
        this._next = this._previous = this;
    }
    _expectsEvent(eventId) {
        return (this._eventState & _BroadcastSubscription._STATE_EVENT_ID) == eventId;
    }
    _toggleEventId() {
        this._eventState ^= _BroadcastSubscription._STATE_EVENT_ID;
    }
    get _isFiring() {
        return (this._eventState & _BroadcastSubscription._STATE_FIRING) != 0;
    }
    _setRemoveAfterFiring() {
        //assert(_isFiring);
        this._eventState |= _BroadcastSubscription._STATE_REMOVE_AFTER_FIRING;
    }
    get _removeAfterFiring() {
        return (this._eventState & _BroadcastSubscription._STATE_REMOVE_AFTER_FIRING) != 0;
    }
    // The controller._recordPause doesn't do anything for a broadcast controller,
    // so we don't bother calling it.
    _onPause() {
    }
    // The controller._recordResume doesn't do anything for a broadcast
    // controller, so we don't bother calling it.
    _onResume() {
    }
}
_BroadcastSubscription._STATE_EVENT_ID = 1;
_BroadcastSubscription._STATE_FIRING = 2;
_BroadcastSubscription._STATE_REMOVE_AFTER_FIRING = 4;
class _BroadcastStreamController extends DartStreamController {
    constructor(onListen, onCancel) {
        super();
        this.onListen = onListen;
        this.onCancel = onCancel;
        this._state = _BroadcastStreamController._STATE_INITIAL;
    }
    get onPause() {
        throw new UnsupportedError("Broadcast stream controllers do not support pause callbacks");
    }
    set onPause(onPauseHandler) {
        throw new UnsupportedError("Broadcast stream controllers do not support pause callbacks");
    }
    get onResume() {
        throw new UnsupportedError("Broadcast stream controllers do not support pause callbacks");
    }
    set onResume(onResumeHandler) {
        throw new UnsupportedError("Broadcast stream controllers do not support pause callbacks");
    }
    // StreamController interface.
    get stream() {
        return new _BroadcastStream(this);
    }
    get sink() {
        return new _StreamSinkWrapper(this);
    }
    get isClosed() {
        return (this._state & _BroadcastStreamController._STATE_CLOSED) != 0;
    }
    /**
     * A broadcast controller is never paused.
     *
     * Each receiving stream may be paused individually, and they handle their
     * own buffering.
     */
    get isPaused() {
        return false;
    }
    /** Whether there are currently one or more subscribers. */
    get hasListener() {
        return !this._isEmpty;
    }
    /**
     * Test whether the stream has exactly one listener.
     *
     * Assumes that the stream has a listener (not [_isEmpty]).
     */
    get _hasOneListener() {
        //assert(!_isEmpty);
        return identical(this._firstSubscription, this._lastSubscription);
    }
    /** Whether an event is being fired (sent to some, but not all, listeners). */
    get _isFiring() {
        return (this._state & _BroadcastStreamController._STATE_FIRING) != 0;
    }
    get _isAddingStream() {
        return (this._state & _BroadcastStreamController._STATE_ADDSTREAM) != 0;
    }
    get _mayAddEvent() {
        return (this._state < _BroadcastStreamController._STATE_CLOSED);
    }
    _ensureDoneFuture() {
        if (this._doneFuture != null)
            return this._doneFuture;
        return this._doneFuture = new _Future();
    }
    // Linked list helpers
    get _isEmpty() {
        return this._firstSubscription == null;
    }
    /** Adds subscription to linked list of active listeners. */
    _addListener(subscription) {
        //assert(identical(subscription._next, subscription));
        subscription._eventState = (this._state & _BroadcastStreamController._STATE_EVENT_ID);
        // Insert in linked list as last subscription.
        let oldLast = this._lastSubscription;
        this._lastSubscription = subscription;
        subscription._next = null;
        subscription._previous = oldLast;
        if (oldLast == null) {
            this._firstSubscription = subscription;
        }
        else {
            oldLast._next = subscription;
        }
    }
    _removeListener(subscription) {
        //assert(identical(subscription._controller, this));
        //assert(!identical(subscription._next, subscription));
        let previous = subscription._previous;
        let next = subscription._next;
        if (previous == null) {
            // This was the first subscription.
            this._firstSubscription = next;
        }
        else {
            previous._next = next;
        }
        if (next == null) {
            // This was the last subscription.
            this._lastSubscription = previous;
        }
        else {
            next._previous = previous;
        }
        subscription._next = subscription._previous = subscription;
    }
    // _StreamControllerLifecycle interface.
    _subscribe(onData, onError, onDone, cancelOnError) {
        if (this.isClosed) {
            if (onDone == null)
                onDone = _nullDoneHandler;
            return new _DoneStreamSubscription(onDone);
        }
        let subscription = new _BroadcastSubscription(this, onData, onError, onDone, cancelOnError);
        this._addListener(subscription);
        if (identical(this._firstSubscription, this._lastSubscription)) {
            // Only one listener, so it must be the first listener.
            _runGuarded(this.onListen);
        }
        return subscription;
    }
    _recordCancel(sub) {
        let subscription = sub;
        // If already removed by the stream, don't remove it again.
        if (identical(subscription._next, subscription))
            return null;
        if (subscription._isFiring) {
            subscription._setRemoveAfterFiring();
        }
        else {
            this._removeListener(subscription);
            // If we are currently firing an event, the empty-check is performed at
            // the end of the listener loop instead of here.
            if (!this._isFiring && this._isEmpty) {
                this._callOnCancel();
            }
        }
        return null;
    }
    _recordPause(subscription) {
    }
    _recordResume(subscription) {
    }
    // EventSink interface.
    _addEventError() {
        if (this.isClosed) {
            return new StateError("Cannot add new events after calling close");
        }
        //assert(_isAddingStream);
        return new StateError("Cannot add new events while doing an addStream");
    }
    add(data) {
        if (!this._mayAddEvent)
            throw this._addEventError();
        this._sendData(data);
    }
    addError(error, stackTrace) {
        error = _nonNullError(error);
        if (!this._mayAddEvent)
            throw this._addEventError();
        let replacement = DartZone.current.errorCallback(error, stackTrace);
        if (replacement != null) {
            error = _nonNullError(replacement.error);
            stackTrace = replacement.stackTrace;
        }
        this._sendError(error, stackTrace);
    }
    close() {
        if (this.isClosed) {
            //assert(_doneFuture != null);
            return this._doneFuture;
        }
        if (!this._mayAddEvent)
            throw this._addEventError();
        this._state |= _BroadcastStreamController._STATE_CLOSED;
        let doneFuture = this._ensureDoneFuture();
        this._sendDone();
        return doneFuture;
    }
    get done() {
        return this._ensureDoneFuture();
    }
    addStream(stream, _) {
        let { cancelOnError } = Object.assign({ cancelOnError: true }, _);
        if (!this._mayAddEvent)
            throw this._addEventError();
        this._state |= _BroadcastStreamController._STATE_ADDSTREAM;
        this._addStreamState = new _AddStreamState(this, stream, cancelOnError);
        return this._addStreamState.addStreamFuture;
    }
    // _EventSink interface, called from AddStreamState.
    _add(data) {
        this._sendData(data);
    }
    _addError(error, stackTrace) {
        this._sendError(error, stackTrace);
    }
    _close() {
        //assert(_isAddingStream);
        let addState = this._addStreamState;
        this._addStreamState = null;
        this._state &= ~_BroadcastStreamController._STATE_ADDSTREAM;
        addState.complete();
    }
    // Event handling.
    _forEachListener(action) {
        if (this._isFiring) {
            throw new StateError("Cannot fire new event. Controller is already firing an event");
        }
        if (this._isEmpty)
            return;
        // Get event id of this event.
        let id = (this._state & _BroadcastStreamController._STATE_EVENT_ID);
        // Start firing (set the _BroadcastStreamController._STATE_FIRING bit). We don't do [onCancel]
        // callbacks while firing, and we prevent reentrancy of this function.
        //
        // Set [_state]'s event id to the next event's id.
        // Any listeners added while firing this event will expect the next event,
        // not this one, and won't get notified.
        this._state ^= _BroadcastStreamController._STATE_EVENT_ID | _BroadcastStreamController._STATE_FIRING;
        let subscription = this._firstSubscription;
        while (subscription != null) {
            if (subscription._expectsEvent(id)) {
                subscription._eventState |= _BroadcastSubscription._STATE_FIRING;
                action(subscription);
                subscription._toggleEventId();
                let next = subscription._next;
                if (subscription._removeAfterFiring) {
                    this._removeListener(subscription);
                }
                subscription._eventState &= ~_BroadcastSubscription._STATE_FIRING;
                subscription = next;
            }
            else {
                subscription = subscription._next;
            }
        }
        this._state &= ~_BroadcastStreamController._STATE_FIRING;
        if (this._isEmpty) {
            this._callOnCancel();
        }
    }
    _callOnCancel() {
        //assert(_isEmpty);
        if (this.isClosed && this._doneFuture._mayComplete) {
            // When closed, _doneFuture is not null.
            this._doneFuture._asyncComplete(null);
        }
        _runGuarded(this.onCancel);
    }
    _sendData(data) {
        throw 'abstract';
    }
    _sendDone() {
        throw 'abstract';
    }
    _sendError(error, stackTrace) {
        throw 'abstract';
    }
    equals(other) {
        throw 'abstract';
    }
    get hashCode() {
        throw 'abstract';
    }
}
_BroadcastStreamController._STATE_INITIAL = 0;
_BroadcastStreamController._STATE_EVENT_ID = 1;
_BroadcastStreamController._STATE_FIRING = 2;
_BroadcastStreamController._STATE_CLOSED = 4;
_BroadcastStreamController._STATE_ADDSTREAM = 8;
__decorate([
    Abstract
], _BroadcastStreamController.prototype, "_sendData", null);
__decorate([
    Abstract
], _BroadcastStreamController.prototype, "_sendDone", null);
__decorate([
    Abstract
], _BroadcastStreamController.prototype, "_sendError", null);
__decorate([
    Abstract
], _BroadcastStreamController.prototype, "equals", null);
__decorate([
    Abstract
], _BroadcastStreamController.prototype, "hashCode", null);
class _SyncBroadcastStreamController extends _BroadcastStreamController {
    constructor(onListen, onCancel) {
        super(onListen, onCancel);
    }
    // EventDispatch interface.
    get _mayAddEvent() {
        return super._mayAddEvent && !this._isFiring;
    }
    _addEventError() {
        if (this._isFiring) {
            return new StateError("Cannot fire new event. Controller is already firing an event");
        }
        return super._addEventError();
    }
    _sendData(data) {
        if (this._isEmpty)
            return;
        if (this._hasOneListener) {
            this._state |= _BroadcastStreamController._STATE_FIRING;
            let subscription = this._firstSubscription;
            subscription._add(data);
            this._state &= ~_BroadcastStreamController._STATE_FIRING;
            if (this._isEmpty) {
                this._callOnCancel();
            }
            return;
        }
        this._forEachListener((subscription) => {
            subscription._add(data);
        });
    }
    _sendError(error, stackTrace) {
        if (this._isEmpty)
            return;
        this._forEachListener((subscription) => {
            subscription._addError(error, stackTrace);
        });
    }
    _sendDone() {
        if (!this._isEmpty) {
            this._forEachListener((subscription) => {
                subscription._close();
            });
        }
        else {
            //assert(_doneFuture != null);
            // assert(_doneFuture._mayComplete);
            this._doneFuture._asyncComplete(null);
        }
    }
}
class _AsyncBroadcastStreamController extends _BroadcastStreamController {
    constructor(onListen, onCancel) {
        super(onListen, onCancel);
    }
    // EventDispatch interface.
    _sendData(data) {
        for (let subscription = this._firstSubscription; subscription != null; subscription = subscription._next) {
            subscription._addPending(new _DelayedData(data));
        }
    }
    _sendError(error, stackTrace) {
        for (let subscription = this._firstSubscription; subscription != null; subscription = subscription._next) {
            subscription._addPending(new _DelayedError(error, stackTrace));
        }
    }
    _sendDone() {
        if (!this._isEmpty) {
            for (let subscription = this._firstSubscription; subscription != null; subscription = subscription._next) {
                subscription._addPending(new _DelayedDone());
            }
        }
        else {
            //assert(_doneFuture != null);
            //assert(_doneFuture._mayComplete);
            this._doneFuture._asyncComplete(null);
        }
    }
}
/**
 * Stream controller that is used by [Stream.asBroadcastStream].
 *
 * This stream controller allows incoming events while it is firing
 * other events. This is handled by delaying the events until the
 * current event is done firing, and then fire the pending events.
 *
 * This class extends [_SyncBroadcastStreamController]. Events of
 * an "asBroadcastStream" stream are always initiated by events
 * on another stream, and it is fine to forward them synchronously.
 */
class _AsBroadcastStreamController extends _SyncBroadcastStreamController {
    constructor(onListen, onCancel) {
        super(onListen, onCancel);
    }
    get _hasPending() {
        return this._pending != null && !this._pending.isEmpty;
    }
    _addPendingEvent(event) {
        if (this._pending == null) {
            this._pending = new _StreamImplEvents();
        }
        this._pending.add(event);
    }
    add(data) {
        if (!this.isClosed && this._isFiring) {
            this._addPendingEvent(new _DelayedData(data));
            return;
        }
        super.add(data);
        while (this._hasPending) {
            this._pending.handleNext(this);
        }
    }
    addError(error, stackTrace) {
        if (!this.isClosed && this._isFiring) {
            this._addPendingEvent(new _DelayedError(error, stackTrace));
            return;
        }
        if (!this._mayAddEvent)
            throw this._addEventError();
        this._sendError(error, stackTrace);
        while (this._hasPending) {
            this._pending.handleNext(this);
        }
    }
    close() {
        if (!this.isClosed && this._isFiring) {
            this._addPendingEvent(new _DelayedDone());
            this._state |= _BroadcastStreamController._STATE_CLOSED;
            return super.done;
        }
        let result = super.close();
        //assert(!_hasPending);
        return result;
    }
    _callOnCancel() {
        if (this._hasPending) {
            this._pending.clear();
            this._pending = null;
        }
        super._callOnCancel();
    }
}
// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.
//part of dart.async;
/**
 * Wraps an [_EventSink] so it exposes only the [EventSink] interface.
 */
class _EventSinkWrapper {
    constructor(_sink) {
        this._sink = _sink;
    }
    add(data) {
        this._sink._add(data);
    }
    addError(error, stackTrace) {
        this._sink._addError(error, stackTrace);
    }
    close() {
        this._sink._close();
    }
}
/**
 * A StreamSubscription that pipes data through a sink.
 *
 * The constructor of this class takes a [_SinkMapper] which maps from
 * [EventSink] to [EventSink]. The input to the mapper is the output of
 * the transformation. The returned sink is the transformation's input.
 */
class _SinkTransformerStreamSubscription extends _BufferingStreamSubscription {
    constructor(source, mapper, onData, onError, onDone, cancelOnError) {
        // We set the adapter's target only when the user is allowed to send data.
        super(onData, onError, onDone, cancelOnError);
        let eventSink = new _EventSinkWrapper(this);
        this._transformerSink = mapper(eventSink);
        this._subscription =
            source.listen(this._handleData.bind(this), { onError: this._handleError.bind(this), onDone: this._handleDone.bind(this) });
    }
    /** Whether this subscription is still subscribed to its source. */
    get _isSubscribed() {
        return this._subscription != null;
    }
    // _EventSink interface.
    /**
     * Adds an event to this subscriptions.
     *
     * Contrary to normal [_BufferingStreamSubscription]s we may receive
     * events when the stream is already closed. Report them as state
     * error.
     */
    _add(data) {
        if (this._isClosed) {
            throw new StateError("Stream is already closed");
        }
        super._add(data);
    }
    /**
     * Adds an error event to this subscriptions.
     *
     * Contrary to normal [_BufferingStreamSubscription]s we may receive
     * events when the stream is already closed. Report them as state
     * error.
     */
    _addError(error, stackTrace) {
        if (this._isClosed) {
            throw new StateError("Stream is already closed");
        }
        super._addError(error, stackTrace);
    }
    /**
     * Adds a close event to this subscriptions.
     *
     * Contrary to normal [_BufferingStreamSubscription]s we may receive
     * events when the stream is already closed. Report them as state
     * error.
     */
    _close() {
        if (this._isClosed) {
            throw new StateError("Stream is already closed");
        }
        super._close();
    }
    // _BufferingStreamSubscription hooks.
    _onPause() {
        if (this._isSubscribed)
            this._subscription.pause();
    }
    _onResume() {
        if (this._isSubscribed)
            this._subscription.resume();
    }
    _onCancel() {
        if (this._isSubscribed) {
            let subscription = this._subscription;
            this._subscription = null;
            return subscription.cancel();
        }
        return null;
    }
    _handleData(data) {
        try {
            this._transformerSink.add(data);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            this._addError(e, s);
        }
    }
    _handleError(error, stackTrace) {
        try {
            this._transformerSink.addError(error, stackTrace);
        }
        catch (e) {
            let s = new DartStackTrace(e);
            if (identical(e, error)) {
                this._addError(error, stackTrace);
            }
            else {
                this._addError(e, s);
            }
        }
    }
    _handleDone() {
        try {
            this._subscription = null;
            this._transformerSink.close();
        }
        catch (e) {
            let s = new DartStackTrace(e);
            this._addError(e, s);
        }
    }
}
/**
 * A StreamTransformer for Sink-mappers.
 *
 * A Sink-mapper takes an [EventSink] (its output) and returns another
 * EventSink (its input).
 *
 * Note that this class can be `const`.
 */
let _StreamSinkTransformer = class _StreamSinkTransformer {
    constructor(_sinkMapper) {
    }
    _StreamSinkTransformer(_sinkMapper) {
        this._sinkMapper = _sinkMapper;
    }
    bind(stream) {
        return new _BoundSinkStream(stream, this._sinkMapper);
    }
};
__decorate([
    defaultConstructor
], _StreamSinkTransformer.prototype, "_StreamSinkTransformer", null);
_StreamSinkTransformer = __decorate([
    DartClass
], _StreamSinkTransformer);
/**
 * The result of binding a StreamTransformer for Sink-mappers.
 *
 * It contains the bound Stream and the sink-mapper. Only when the user starts
 * listening to this stream is the sink-mapper invoked. The result is used
 * to create a StreamSubscription that transforms events.
 */
class _BoundSinkStream extends DartStream {
    constructor(_stream, _sinkMapper) {
        super();
        this._stream = _stream;
        this._sinkMapper = _sinkMapper;
    }
    get isBroadcast() {
        return this._stream.isBroadcast;
    }
    listen(onData, _) {
        let { onError, onDone, cancelOnError } = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        let subscription = new _SinkTransformerStreamSubscription(this._stream, this._sinkMapper, onData, onError, onDone, cancelOnError);
        return subscription;
    }
}
/**
 * Wraps handlers (from [StreamTransformer.fromHandlers]) into an `EventSink`.
 *
 * This way we can reuse the code from [_StreamSinkTransformer].
 */
class _HandlerEventSink {
    constructor(_handleData, _handleError, _handleDone, _sink) {
        this._handleData = _handleData;
        this._handleError = _handleError;
        this._handleDone = _handleDone;
        this._sink = _sink;
        if (_sink == null) {
            throw new ArgumentError("The provided sink must not be null.");
        }
    }
    get _isClosed() {
        return this._sink == null;
    }
    _reportClosedSink() {
        // TODO(29554): throw a StateError, and don't just report the problem.
        $with(DartZone.ROOT, (z) => z.print("Sink is closed and adding to it is an error."), (z) => z.print("  See http://dartbug.com/29554."), (z) => z.print(DartStackTrace.current.toString()));
    }
    add(data) {
        if (this._isClosed) {
            this._reportClosedSink();
        }
        if (this._handleData != null) {
            this._handleData(data, this._sink);
        }
        else {
            this._sink.add(data);
        }
    }
    addError(error, stackTrace) {
        if (this._isClosed) {
            this._reportClosedSink();
        }
        if (this._handleError != null) {
            this._handleError(error, stackTrace, this._sink);
        }
        else {
            this._sink.addError(error, stackTrace);
        }
    }
    close() {
        if (this._isClosed)
            return;
        let sink = this._sink;
        this._sink = null;
        if (this._handleDone != null) {
            this._handleDone(sink);
        }
        else {
            sink.close();
        }
    }
}
/**
 * A StreamTransformer that transformers events with the given handlers.
 *
 * Note that this transformer can only be used once.
 */
let _StreamHandlerTransformer = class _StreamHandlerTransformer extends _StreamSinkTransformer {
    constructor(_) {
        super(null);
    }
    _StreamHandlerTransformer(_) {
        let { handleData, handleError, handleDone } = Object.assign({}, _);
        super._StreamSinkTransformer((outputSink) => {
            return new _HandlerEventSink(handleData, handleError, handleDone, outputSink);
        });
    }
    bind(stream) {
        return super.bind(stream);
    }
};
__decorate([
    defaultConstructor
], _StreamHandlerTransformer.prototype, "_StreamHandlerTransformer", null);
_StreamHandlerTransformer = __decorate([
    DartClass
], _StreamHandlerTransformer);
/**
 * A [StreamTransformer] that minimizes the number of additional classes.
 *
 * Instead of implementing three classes: a [StreamTransformer], a [Stream]
 * (as the result of a `bind` call) and a [StreamSubscription] (which does the
 * actual work), this class only requires a function that is invoked when the
 * last bit (the subscription) of the transformer-workflow is needed.
 *
 * The given transformer function maps from Stream and cancelOnError to a
 * `StreamSubscription`. As such it can also act on `cancel` events, making it
 * fully general.
 */
class _StreamSubscriptionTransformer {
    constructor(_onListen) {
        this._onListen = _onListen;
    }
    bind(stream) {
        return new _BoundSubscriptionStream(stream, this._onListen);
    }
}
/**
 * A stream transformed by a [_StreamSubscriptionTransformer].
 *
 * When this stream is listened to it invokes the [_onListen] function with
 * the stored [_stream]. Usually the transformer starts listening at this
 * moment.
 */
class _BoundSubscriptionStream extends DartStream {
    constructor(_stream, _onListen) {
        super();
        this._stream = _stream;
        this._onListen = _onListen;
    }
    listen(onData, _) {
        let { onError, onDone, cancelOnError } = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        let result = this._onListen(this._stream, cancelOnError);
        result.onData(onData);
        result.onError(onError);
        result.onDone(onDone);
        return result;
    }
}
let TimerImpl = class TimerImpl {
    constructor(milliseconds, callback) {
    }
    _TimerImpl(milliseconds, callback) {
        this._once = true;
        this._inEventLoop = false;
        if (milliseconds == 0 && (!hasTimer() || _globalState.isWorker)) {
            let internalCallback = () => {
                this._handle = null;
                callback();
            };
            // Setting _handle to something different from null indicates that the
            // callback has not been run. Hence, the choice of 1 is arbitrary.
            this._handle = 1;
            // This makes a dependency between the async library and the
            // event loop of the isolate library. The compiler makes sure
            // that the event loop is compiled if [Timer] is used.
            // TODO(7907): In case of web workers, we need to use the event
            // loop instead of setTimeout, to make sure the futures get executed in
            // order.
            _globalState.topEventLoop
                .enqueue(_globalState.currentContext, internalCallback, 'timer');
            this._inEventLoop = true;
        }
        else if (hasTimer()) {
            let internalCallback = () => {
                this._handle = null;
                leaveJsAsync();
                callback();
            };
            enterJsAsync();
            this._handle = self.setTimeout(convertDartClosureToJS(internalCallback, 0), milliseconds) /*JS('int', 'self.setTimeout(#, #)',
        convertDartClosureToJS(internalCallback, 0), milliseconds)*/;
        }
        else {
            //assert(milliseconds > 0);
            throw new UnsupportedError("Timer greater than 0.");
        }
    }
    periodic(milliseconds, callback) {
        this._inEventLoop = false;
        this._once = false;
        if (hasTimer()) {
            enterJsAsync();
            this._handle = self.setInterval(convertDartClosureToJS(() => {
                callback(this);
            }), milliseconds) /*JS(
            'int',
            'self.setInterval(#, #)',
            convertDartClosureToJS(() {
            callback(this);
        }, 0),
        milliseconds)*/;
        }
        else {
            throw new UnsupportedError("Periodic timer.");
        }
    }
    cancel() {
        if (hasTimer()) {
            if (this._inEventLoop) {
                throw new UnsupportedError("Timer in event loop cannot be canceled.");
            }
            if (this._handle == null)
                return;
            leaveJsAsync();
            if (this._once) {
                //JS('void', 'self.clearTimeout(#)', _handle);
                self.clearTimeout(this._handle);
            }
            else {
                //JS('void', 'self.clearInterval(#)', _handle);
                self.clearInterval(this._handle);
            }
            this._handle = null;
        }
        else {
            throw new UnsupportedError("Canceling a timer.");
        }
    }
    get isActive() {
        return this._handle != null;
    }
};
__decorate([
    defaultConstructor
], TimerImpl.prototype, "_TimerImpl", null);
__decorate([
    namedConstructor
], TimerImpl.prototype, "periodic", null);
TimerImpl = __decorate([
    DartClass
], TimerImpl);
// TODO : Is this actually needed (probably yes because we need to attach the zone info ... lets see)
function convertDartClosureToJS(closure, ...args) {
    return closure.bind(null, ...args);
}
/// No-op method that is called to inform the compiler that preambles might
/// be needed when executing the resulting JS file in a command-line
/// JS engine.
function requiresPreamble() {
}
function hasTimer() {
    requiresPreamble();
    // let self = global || window;
    return self.setTimeout != null /* JS('', 'self.setTimeout') != null*/;
}
/// Marks entering a JavaScript async operation to keep the worker alive.
///
/// To be called by library code before starting an async operation controlled
/// by the JavaScript event handler.
///
/// Also call [leaveJsAsync] in all callback handlers marking the end of that
/// async operation (also error handlers) so the worker can be released.
///
/// These functions only has to be called for code that can be run from a
/// worker-isolate (so not for general dom operations).
function enterJsAsync() {
    _globalState.topEventLoop._activeJsAsyncCount++;
}
/// Marks leaving a javascript async operation.
///
/// See [enterJsAsync].
function leaveJsAsync() {
    _globalState.topEventLoop._activeJsAsyncCount--;
    //assert(_globalState.topEventLoop._activeJsAsyncCount >= 0);
}
/**
 * Big stuff but don't know if we need it
 */
class _Manager {
    constructor() {
        this.isWorker = false;
        this.topEventLoop = new _EventLoop();
    }
}
class _EventLoop {
    constructor() {
        this._activeJsAsyncCount = 0;
    }
    enqueue(context, callback, ...args) {
        setTimeout(() => {
            callback.apply(null, args);
        }, 0);
    }
}
const _globalState = new _Manager();
function stream(generator) {
    return toDartStream({
        [Symbol.asyncIterator]: generator
    });
}
function toDartStream(x) {
    return new JSStream(x);
}
class JSStreamPendingEvents extends _PendingEvents {
    constructor(iterator) {
        super();
        this.iterator = iterator;
    }
    get isEmpty() {
        return this.iterator == null;
    }
    handleNext(dispatch) {
        this.iterator.next().then((res) => {
            if (res.done) {
                dispatch._sendDone();
            }
            else {
                dispatch._sendData(res.value);
            }
        }, (error) => {
            dispatch._sendError(error, new DartStackTrace(error));
        });
    }
    clear() {
        if (this.isScheduled)
            this.cancelSchedule();
        if (this.iterator != null) {
            this.iterator.return();
            this.iterator = null;
        }
    }
}
class JSStream extends _GeneratedStreamImpl {
    constructor(i) {
        super(() => new JSStreamPendingEvents(this[Symbol.asyncIterator]()));
        this.iterable = i;
    }
    get iterator() {
        return new JSStreamIterator(this.iterable[Symbol.asyncIterator]());
    }
    [Symbol.asyncIterator]() {
        return this.iterable[Symbol.asyncIterator]();
    }
}
class JSStreamIterator {
    constructor(i) {
        this.iterator = i;
    }
    get current() {
        return this.lastResult.value;
    }
    moveNext() {
        return new Future.fromPromise((() => __awaiter(this, void 0, void 0, function* () {
            this.lastResult = yield this.iterator.next();
            return !this.lastResult.done;
        }))());
    }
    next(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                done: !(yield this.moveNext()),
                value: this.current
            };
        });
    }
    return(value) {
        return this.iterator.return(value);
    }
    throw(e) {
        return this.iterator.throw(e);
    }
    cancel() {
        return new Future.fromPromise(this.return());
    }
}
export { Future, DartCompleter, DartZoneSpecification, DartZone, DartTimer, runZoned, scheduleMicrotask, DartStream, DartStreamTransformer, DartStreamController, dartAsync, stream, toDartStream };
//# sourceMappingURL=async.js.map