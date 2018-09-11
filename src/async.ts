// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

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
import {ArgumentError, DartDuration, DartHashMap, DartIterable, DartList, DartMap, DartStackTrace, identical, NullThrownError, StateError, UnsupportedError} from "./core";
import {Abstract, AbstractProperty, bool, DartClass, defaultConstructor, defaultFactory, Implements, int, namedConstructor, namedFactory, Op, Operator, OPERATOR_INDEX_ASSIGN} from "./utils";
import _dart from './_common';
/*
abstract class FutureOr<T> {
    // Private generative constructor, so that it is not subclassable, mixable, or
    // instantiable.
    protected static _: new<T>()=>FutureOr<T>;
}*/

export type FutureOr<T> = Future<T> | T;

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
@DartClass
class Future<T> extends Promise<T> {
    // The `_nullFuture` is a completed Future with the value `null`.
    static _nullFuture: _Future<any>;//= new _Future.value<any>(null);

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
    @defaultFactory
    protected static _create<T>(computation: () => FutureOr<T>): Future<T> {
        let result: _Future<T> = new _Future<T>();
        DartTimer.run(() => {
            try {
                result._complete(computation());
            } catch (e /*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s /*s*/);
            }
        });
        return result;
    }

    constructor(computation: () => FutureOr<T>) {
        super((resolve, reject) => {

        });
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
    @namedFactory
    protected static _microtask<T>(computation: () => FutureOr<T>): Future<T> {
        let result = new _Future<T>();
        scheduleMicrotask(() => {
            try {
                result._complete(computation());
            } catch (e/*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s);
            }
        });
        return result;
    }

    static microtask: new<T>(computation: () => FutureOr<T>) => Future<T>;

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
    @namedFactory
    protected static _sync<T>(computation: () => FutureOr<T>): Future<T> {
        try {
            var result = computation();
            if (_dart.is(result, Future)) {
                return result as Future<T>;
            }/* else if (result is Future) {
            // TODO(lrn): Remove this case for Dart 2.0.
            return new _Future<T>.immediate(result);
        } */ else {
                return new _Future.value<T>(result as T);
            }
        } catch (error/*, stackTrace*/) {
            let stackTrace = new DartStackTrace(error);

            let future = new _Future<T>();
            let replacement: DartAsyncError = DartZone.current.errorCallback(error, stackTrace);
            if (replacement != null) {
                future._asyncCompleteError(
                    _nonNullError(replacement.error), replacement.stackTrace);
            } else {
                future._asyncCompleteError(error, stackTrace);
            }
            return future;
        }
    }

    static sync: new<T>(computation: () => FutureOr<T>) => Future<T>;

    /**
     * A future whose value is available in the next event-loop iteration.
     *
     * If [result] is not a [Future], using this constructor is equivalent
     * to `new Future<T>.sync(() => result)`.
     *
     * Use [Completer] to create a future and complete it later.
     */
    @namedFactory
    protected static _value<T>(result?: FutureOr<T>): Future<T> {
        return new _Future.immediate<T>(result);
    }

    static value: new<T>(result?: FutureOr<T>) => Future<T>;

    /**
     * A future that completes with an error in the next event-loop iteration.
     *
     * If [error] is `null`, it is replaced by a [NullThrownError].
     *
     * Use [Completer] to create a future and complete it later.
     */
    @namedFactory
    protected static _error<T>(error: any, stackTrace?: DartStackTrace): Future<T> {
        error = _nonNullError(error);
        if (!identical(DartZone.current, _ROOT_ZONE)) {
            let replacement: DartAsyncError = DartZone.current.errorCallback(error, stackTrace);
            if (replacement != null) {
                error = _nonNullError(replacement.error);
                stackTrace = replacement.stackTrace;
            }
        }
        return new _Future.immediateError<T>(error, stackTrace);
    }

    static error: new<T>(error: any, stackTrace?: DartStackTrace) => Future<T>;

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
    @namedFactory
    protected static _delayed<T>(duration: DartDuration, computation?: () => FutureOr<T>): Future<T> {
        let result = new _Future<T>();
        new DartTimer(duration, () => {
            try {
                result._complete(computation && computation());
            } catch (e/*, s*/) {
                let s = new DartStackTrace(e);
                _completeWithErrorCallback(result, e, s);
            }
        });
        return result;
    }

    static delayed: new<T>(duration: DartDuration, computation?: () => FutureOr<T>) => Future<T>;

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
    static wait<T>(futures: DartIterable<Future<T>>,
                   _?: { eagerError?: bool /* false*/, cleanUp?: (successValue: T) => any }): Future<DartList<T>> {
        let {eagerError, cleanUp} = Object.assign({eagerError: false}, _);
        let result: _Future<DartList<T>> = new _Future<DartList<T>>();
        let values: DartList<T>; // Collects the values. Set to null on error.
        let remaining = 0; // How many futures are we waiting for.
        let error; // The first error from a future.
        let stackTrace: DartStackTrace; // The stackTrace that came with the error.

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
                            new Future.sync(() => {
                                cleanUp(value);
                            });
                        }
                    }
                }
                values = null;
                if (remaining == 0 || eagerError) {
                    result._completeError(theError, theStackTrace);
                } else {
                    error = theError;
                    stackTrace = theStackTrace;
                }
            } else if (remaining == 0 && !eagerError) {
                result._completeError(error, stackTrace);
            }
        };

        try {
            // As each future completes, put its value into the corresponding
            // position in the list of values.
            for (let future of futures) {
                let pos = remaining;
                future.then((value: T) => {
                    remaining--;
                    if (values != null) {
                        values[pos] = value;
                        if (remaining == 0) {
                            result._completeWithValue(values);
                        }
                    } else {
                        if (cleanUp != null && value != null) {
                            // Ensure errors from cleanUp are uncaught.
                            new Future.sync(() => {
                                cleanUp(value);
                            });
                        }
                        if (remaining == 0 && !eagerError) {
                            result._completeError(error, stackTrace);
                        }
                    }
                }, {onError: handleError});
                // Increment the 'remaining' after the call to 'then'.
                // If that call throws, we don't expect any future callback from
                // the future, and we also don't increment remaining.
                remaining++;
            }
            if (remaining == 0) {
                return new Future.value(new DartList<T>());
            }
            values = new DartList<T>(remaining);
        } catch (e) {
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
                return new Future.error(e, st);
            } else {
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
    static any<T>(futures: DartIterable<Future<T>>): Future<T> {
        let completer = new DartCompleter.sync<T>();
        let onValue = (value: T) => {
            if (!completer.isCompleted) completer.complete(value);
        };
        var onError = (error, stack) => {
            if (!completer.isCompleted) completer.completeError(error, stack);
        };
        for (let future of futures) {
            future.then(onValue, {onError: onError});
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
    static forEach<T>(input: DartIterable<T>, f: (element: T) => FutureOr<any>): Future<any> {
        let iterator = input.iterator;
        return Future.doWhile(() => {
            if (!iterator.moveNext()) return false;
            var result = f(iterator.current);
            if (_dart.is(result, Future)) return result.then(Future._kTrue);
            return true;
        });
    }

    // Constant `true` function, used as callback by [forEach].
    static _kTrue(_): bool {
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
    static doWhile(f: () => FutureOr<bool>): Future<any> {
        let doneSignal = new _Future();
        let nextIteration;
        // Bind this callback explicitly so that each iteration isn't bound in the
        // context of all the previous iterations' callbacks.
        // This avoids, e.g., deeply nested stack traces from the stack trace
        // package.
        nextIteration = DartZone.current.bindUnaryCallback((keepGoing: bool) => {
            while (keepGoing) {
                let result: FutureOr<bool>;
                try {
                    result = f();
                } catch (error) {
                    let stackTrace = new DartStackTrace(error);
                    // Cannot use _completeWithErrorCallback because it completes
                    // the future synchronously.
                    _asyncCompleteWithErrorCallback(doneSignal, error, stackTrace);
                    return;
                }
                if (_dart.is(result, Future)) {
                    (result as Future<any>).then(nextIteration, {onError: doneSignal._completeError});
                    return;
                }
                keepGoing = result as bool;
            }
            doneSignal._complete(null);
        }, {runGuarded: true});
        nextIteration(true);
        return doneSignal;
    }

    /**
     * Register callbacks to be called when this future completes.
     *
     * When this future completes with a value,
     * the [onValue] callback will be called with that value.
     * If this future is already completed, the callback will not be called
     * immediately, but will be scheduled in a later microtask.
     *
     * If [onError] is provided, and this future completes with an error,
     * the `onError` callback is called with that error and its stack trace.
     * The `onError` callback must accept either one argument or two arguments.
     * If `onError` accepts two arguments,
     * it is called with both the error and the stack trace,
     * otherwise it is called with just the error object.
     *
     * Returns a new [Future]
     * which is completed with the result of the call to `onValue`
     * (if this future completes with a value)
     * or to `onError` (if this future completes with an error).
     *
     * If the invoked callback throws,
     * the returned future is completed with the thrown error
     * and a stack trace for the error.
     * In the case of `onError`,
     * if the exception thrown is `identical` to the error argument to `onError`,
     * the throw is considered a rethrow,
     * and the original stack trace is used instead.
     *
     * If the callback returns a [Future],
     * the future returned by `then` will be completed with
     * the same result as the future returned by the callback.
     *
     * If [onError] is not given, and this future completes with an error,
     * the error is forwarded directly to the returned future.
     *
     * In most cases, it is more readable to use [catchError] separately, possibly
     * with a `test` parameter, instead of handling both value and error in a
     * single [then] call.
     *
     * Note that futures don't delay reporting of errors until listeners are
     * added. If the first `then` or `catchError` call happens after this future
     * has completed with an error then the error is reported as unhandled error.
     * See the description on [Future].
     */

    then(...args: any[]): any
    @Abstract
    then<S>(onValue: (value: T) => FutureOr<S>, _?: { onError?: Function }): Future<S> {
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
    @Abstract
    catchError(onError: Function, _?: { test: (error: any) => bool }): Future<T> {
        throw 'abstract';
    }


    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
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
    @Abstract
    whenComplete(action: () => FutureOr<any>): Future<T> {
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
    @Abstract
    asStream(): DartStream<T> {
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
    @Abstract
    timeout(timeLimit: DartDuration, _?: { onTimeout?: () => FutureOr<T> }): Future<T> {
        throw 'abstract';
    }
}

/**
 * Thrown when a scheduled timeout happens while waiting for an async result.
 */
class DartTimeoutException extends Error {
    /** Description of the cause of the timeout. */
    message: string;
    /** The duration that was exceeded. */
    duration: DartDuration;

    constructor(message: string, duration?: DartDuration) {
        super();
        this.message = message;
        this.duration = duration;
    }

    toString(): string {
        let result = "TimeoutException";
        if (this.duration != null) result = "TimeoutException after $duration";
        if (this.message != null) result = "$result: $message";
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
class DartCompleter<T> {
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
    @defaultFactory
    protected static _create<T>(): DartCompleter<T> {
        return new _AsyncCompleter<T>();
    }

    constructor() {

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
    @namedFactory
    protected static _sync<T>(): DartCompleter<T> {
        return new _SyncCompleter<T>();
    }

    static sync: new<T>() => DartCompleter<T>;

    /** The future that will contain the result provided to this completer. */
    @AbstractProperty
    get future(): Future<T> {
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
    @Abstract
    complete(value?: FutureOr<T>): void {
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
    @Abstract
    completeError(error: any, stackTrace?: DartStackTrace): void {
        throw 'abstract';
    }

    /**
     * Whether the future has been completed.
     */
    @AbstractProperty
    get isCompleted(): bool {
        throw 'abstract';
    }
}

// Helper function completing a _Future with error, but checking the zone
// for error replacement first.
function _completeWithErrorCallback(result: _Future<any>, error: any, stackTrace: any) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    result._completeError(error, stackTrace);
}

// Like [_completeWIthErrorCallback] but completes asynchronously.
function _asyncCompleteWithErrorCallback(result: _Future<any>, error: any, stackTrace: any) {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    result._asyncCompleteError(error, stackTrace);
}

/** Helper function that converts `null` to a [NullThrownError]. */
function _nonNullError(error: any): any {
    return error || new NullThrownError();
}


/// Initial state, waiting for a result. In this state, the
/// [resultOrListeners] field holds a single-linked list of
/// [_FutureListener] listeners.
const _INCOMPLETE: int = 0;

/// Pending completion. Set when completed using [_asyncComplete] or
/// [_asyncCompleteError]. It is an error to try to complete it again.
/// [resultOrListeners] holds listeners.
const _PENDING_COMPLETE: int = 1;

/// The future has been chained to another future. The result of that
/// other future becomes the result of this future as well.
/// [resultOrListeners] contains the source future.
const _CHAINED: int = 2;

/// The future has been completed with a value result.
const _VALUE: int = 4;

/// The future has been completed with an error result.
const _ERROR: int = 8;

@DartClass
@Implements(Future)
class _Future<T> extends Promise<T> implements Future<T> {


    /** Whether the future is complete, and as what. */
    _state: int = _INCOMPLETE;

    /**
     * Zone that the future was completed from.
     * This is the zone that an error result belongs to.
     *
     * Until the future is completed, the field may hold the zone that
     * listener callbacks used to create this future should be run in.
     */
    _zone: DartZone = DartZone.current;

    /**
     * Either the result, a list of listeners or another future.
     *
     * The result of the future is either a value or an error.
     * A result is only stored when the future has completed.
     *
     * The listeners is an internally linked list of [_FutureListener]s.
     * Listeners are only remembered while the future is not yet complete,
     * and it is not chained to another future.
     *
     * The future is another future that his future is chained to. This future
     * is waiting for the other future to complete, and when it does, this future
     * will complete with the same result.
     * All listeners are forwarded to the other future.
     */
    _resultOrListeners: any;

    // TODO : this has to be called when completed: have to find when this is going to occur.
    _resolve: (t: T) => any;
    _reject: (e: any) => any;

    // This constructor is used by async/await.
    constructor() {
        super((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    @defaultConstructor
    protected _init() {
        this._state = _INCOMPLETE;
    }

    @namedConstructor
    protected immediate(result: FutureOr<T>) {
        this._init();
        this._asyncComplete(result);
    }

    static immediate: new<T>(result: FutureOr<T>) => _Future<T>;

    @namedConstructor
    protected immediateError(error: any, stackTrace?: DartStackTrace) {
        this._init();
        this._asyncCompleteError(error, stackTrace);
    }

    static immediateError: new <T>(error: any, stackTrace?: DartStackTrace) => _Future<T>;

    /** Creates a future that is already completed with the value. */
    @namedConstructor
    protected value(value: T) {
        this._init();
        this._setValue(value);
    }

    static value: new<T>(value: T) => _Future<T>;

    get _mayComplete(): bool {
        return this._state == _INCOMPLETE;
    }

    get _isPendingComplete(): bool {
        return this._state == _PENDING_COMPLETE;
    }

    get _mayAddListener(): bool {
        return this._state <= _PENDING_COMPLETE;
    }

    get _isChained(): bool {
        return this._state == _CHAINED;
    }

    get _isComplete(): bool {
        return this._state >= _VALUE;
    }

    get _hasError(): bool {
        return this._state == _ERROR;
    }

    _setChained(source: _Future<any>): void {
        //assert(_mayAddListener);
        this._state = _CHAINED;
        this._resultOrListeners = source;
    }

    then(...args: any[]): any
    then<E>(f: (value: T) => FutureOr<E>, _?: { onError?: Function }): Future<E> {
        let {onError} = Object.assign({}, _);
        let currentZone: DartZone = DartZone.current;
        if (!identical(currentZone, _ROOT_ZONE)) {
            f = currentZone.registerUnaryCallback<FutureOr<E>, T>(f);
            if (onError != null) {
                onError = _registerErrorHandler<E>(onError, currentZone);
            }
        }
        return this._thenNoZoneRegistration<E>(f, onError);
    }


    // This method is used by async/await.
    _thenNoZoneRegistration<E>(
        f: (value: T) => FutureOr<E>, onError: Function): Future<E> {
        let result = new _Future<E>();
        this._addListener(new _FutureListener.then(result, f, onError));
        return result;
    }

    catchError(onError: Function, _?: { test: (error: any) => bool }): Future<T> {
        let {test} = Object.assign({}, _);
        let result = new _Future<T>();
        if (!identical(result._zone, _ROOT_ZONE)) {
            onError = _registerErrorHandler<T>(onError, result._zone);
            if (test != null) test = result._zone.registerUnaryCallback(test);
        }
        this._addListener(new _FutureListener.catchError<T, T>(result, onError, test));
        return result;
    }

    catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): Promise<T | TResult> {
        this.catchError(onrejected);
        return undefined;
    }


    whenComplete(action: () => any): Future<T> {
        let result = new _Future<T>();
        if (!identical(result._zone, _ROOT_ZONE)) {
            action = result._zone.registerCallback<any>(action);
        }
        this._addListener(new _FutureListener.whenComplete<T, T>(result, action));
        return result;
    }

    asStream(): DartStream<T> {
        return new DartStream.fromFuture<T>(this);
    }

    _setPendingComplete(): void {
        //assert(_mayComplete);
        this._state = _PENDING_COMPLETE;
    }

    _clearPendingComplete(): void {
        //assert(_isPendingComplete);
        this._state = _INCOMPLETE;
    }

    get _error(): DartAsyncError {
        //assert(_hasError);
        return this._resultOrListeners;
    }

    get _chainSource(): _Future<any> {
        //assert(_isChained);
        return this._resultOrListeners;
    }

    // This method is used by async/await.
    _setValue(value: T): void {
        //assert(!_isComplete); // But may have a completion pending.
        this._state = _VALUE;
        this._resultOrListeners = value;
    }

    _setErrorObject(error: DartAsyncError): void {
        //assert(!_isComplete); // But may have a completion pending.
        this._state = _ERROR;
        this._resultOrListeners = error;
    }

    _setError(error: any, stackTrace: DartStackTrace): void {
        this._setErrorObject(new DartAsyncError(error, stackTrace));
    }

    /// Copy the completion result of [source] into this future.
    ///
    /// Used when a chained future notices that its source is completed.
    _cloneResult(source: _Future<any>): void {
        //assert(!_isComplete);
        //assert(source._isComplete);
        this._state = source._state;
        this._resultOrListeners = source._resultOrListeners;
    }

    _addListener(listener: _FutureListener<any, any>): void {
        //assert(listener._nextListener == null);
        if (this._mayAddListener) {
            listener._nextListener = this._resultOrListeners;
            this._resultOrListeners = listener;
        } else {
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
                _Future._propagateToListeners(this, listener);
            });
        }
    }

    _prependListeners(listeners: _FutureListener<any, any>): void {
        if (listeners == null) return;
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
        } else {
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
                _Future._propagateToListeners(this, listeners);
            });
        }
    }

    _removeListeners(): _FutureListener<any, any> {
        // Reverse listeners before returning them, so the resulting list is in
        // subscription order.
        //assert(!_isComplete);
        let current = this._resultOrListeners;
        this._resultOrListeners = null;
        return this._reverseListeners(current);
    }

    _reverseListeners(listeners: _FutureListener<any, any>): _FutureListener<any, any> {
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
    static _chainForeignFuture(source: Future<any>, target: _Future<any>): void {
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
        } catch (e) {
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
    static _chainCoreFuture(source: _Future<any>, target: _Future<any>): void {
        //assert(target._mayAddListener); // Not completed, not already chained.
        while (source._isChained) {
            source = source._chainSource;
        }
        if (source._isComplete) {
            let listeners = target._removeListeners();
            target._cloneResult(source);
            this._propagateToListeners(target, listeners);
        } else {
            let listeners = target._resultOrListeners;
            target._setChained(source);
            source._prependListeners(listeners);
        }
    }

    _complete(value: FutureOr<T>): void {
        //assert(!_isComplete);
        if (_dart.is(value, Future)) {
            if (_dart.is(value, _Future)) {
                _Future._chainCoreFuture(value as _Future<T>, this);
            } else {
                _Future._chainForeignFuture(value as Future<any>, this);
            }
        } else {
            let listeners = this._removeListeners();
            this._setValue(value as any/*=T*/);
            _Future._propagateToListeners(this, listeners);
        }
    }

    _completeWithValue(value: T): void {
        //assert(!_isComplete);
        //assert(value is! Future);

        let listeners = this._removeListeners();
        this._setValue(value);
        _Future._propagateToListeners(this, listeners);
    }

    _completeError(error: any, stackTrace?: DartStackTrace): void {
        //assert(!_isComplete);

        let listeners = this._removeListeners();
        this._setError(error, stackTrace);
        _Future._propagateToListeners(this, listeners);
    }

    _asyncComplete(value: FutureOr<T>): void {
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

        if (_dart.is(value, Future)) {
            this._chainFuture(value as Future<T>);
            return;
        }
        let typedValue: T = value as any/*=T*/;

        this._setPendingComplete();
        this._zone.scheduleMicrotask(() => {
            this._completeWithValue(typedValue);
        });
    }

    _chainFuture(value: Future<T>): void {
        if (_dart.is(value, _Future)) {
            if ((value as _Future<T>)._hasError) {
                // Delay completion to allow the user to register callbacks.
                this._setPendingComplete();
                this._zone.scheduleMicrotask(() => {
                    _Future._chainCoreFuture(value as _Future<any>, this);
                });
            } else {
                _Future._chainCoreFuture(value as _Future<any>, this);
            }
            return;
        }
        // Just listen on the foreign future. This guarantees an async delay.
        _Future._chainForeignFuture(value, this);
    }

    _asyncCompleteError(error: any, stackTrace: DartStackTrace): void {
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
    static _propagateToListeners(source: _Future<any>, listeners: _FutureListener<any, any>): void {
        while (true) {
            //assert(source._isComplete);
            let hasError: bool = source._hasError;
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
                _Future._propagateToListeners(source, listener);
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
                let zone: DartZone = listener._zone;
                if (hasError && !source._zone.inSameErrorZone(zone)) {
                    // Don't cross zone boundaries with errors.
                    let asyncError = source._error;
                    source._zone
                        .handleUncaughtError(asyncError.error, asyncError.stackTrace);
                    return;
                }

                let oldZone: DartZone;
                if (!identical(DartZone.current, zone)) {
                    // Change zone if it's not current.
                    oldZone = DartZone._enter(zone);
                }

                // These callbacks are abstracted to isolate the try/catch blocks
                // from the rest of the code to work around a V8 glass jaw.
                let handleWhenCompleteCallback = (): void => {
                    // The whenComplete-handler is not combined with normal value/error
                    // handling. This means at most one handleX method is called per
                    // listener.
                    //assert(!listener.handlesValue);
                    //assert(!listener.handlesError);
                    let completeResult;
                    try {
                        completeResult = listener.handleWhenComplete();
                    } catch (e) {
                        let s = new DartStackTrace(e);
                        if (hasError && identical(source._error.error, e)) {
                            listenerValueOrError = source._error;
                        } else {
                            listenerValueOrError = new DartAsyncError(e, s);
                        }
                        listenerHasError = true;
                        return;
                    }
                    if (_dart.is(completeResult, Future)) {
                        if (_dart.is(completeResult, _Future) && completeResult._isComplete) {
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

                let handleValueCallback = (): void => {
                    try {
                        listenerValueOrError = listener.handleValue(sourceResult);
                    } catch (e) {
                        let s = new DartStackTrace(e);
                        listenerValueOrError = new DartAsyncError(e, s);
                        listenerHasError = true;
                    }
                };

                let handleError = (): void => {
                    try {
                        let asyncError = source._error;
                        if (listener.matchesErrorTest(asyncError) &&
                            listener.hasErrorCallback) {
                            listenerValueOrError = listener.handleError(asyncError);
                            listenerHasError = false;
                        }
                    } catch (e) {
                        let s = new DartStackTrace(e);
                        if (identical(source._error.error, e)) {
                            listenerValueOrError = source._error;
                        } else {
                            listenerValueOrError = new DartAsyncError(e, s);
                        }
                        listenerHasError = true;
                    }
                };

                if (listener.handlesComplete) {
                    handleWhenCompleteCallback();
                } else if (!hasError) {
                    if (listener.handlesValue) {
                        handleValueCallback();
                    }
                } else {
                    if (listener.handlesError) {
                        handleError();
                    }
                }

                // If we changed zone, oldZone will not be null.
                if (oldZone != null) DartZone._leave(oldZone);

                // If the listener's value is a future we need to chain it. Note that
                // this can only happen if there is a callback.
                if (_dart.is(listenerValueOrError, Future)) {
                    let chainSource = listenerValueOrError;
                    // Shortcut if the chain-source is already completed. Just continue
                    // the loop.
                    let result = listener.result;
                    if (_dart.is(chainSource, _Future)) {
                        if (chainSource._isComplete) {
                            listeners = result._removeListeners();
                            result._cloneResult(chainSource);
                            source = chainSource;
                            continue;
                        } else {
                            this._chainCoreFuture(chainSource, result);
                        }
                    } else {
                        this._chainForeignFuture(chainSource, result);
                    }
                    return;
                }
            }
            let result = listener.result;
            listeners = result._removeListeners();
            if (!listenerHasError) {
                result._setValue(listenerValueOrError);
            } else {
                let asyncError = listenerValueOrError;
                result._setErrorObject(asyncError);
            }
            // Prepare for next round.
            source = result;
        }
    }

    timeout(timeLimit: DartDuration, _?: { onTimeout?: () => FutureOr<T> }): Future<T> {
        let {onTimeout} = Object.assign({}, _);
        if (this._isComplete) return new _Future.immediate(this);
        let result = new _Future<T>();
        let timer: DartTimer;
        if (onTimeout == null) {
            timer = new DartTimer(timeLimit, () => {
                result._completeError(
                    new DartTimeoutException("Future not completed", timeLimit));
            });
        } else {
            let zone = DartZone.current;
            onTimeout = zone.registerCallback(onTimeout);
            timer = new DartTimer(timeLimit, () => {
                try {
                    result._complete(zone.run(onTimeout));
                } catch (e) {
                    let s = new DartStackTrace(e);
                    result._completeError(e, s);
                }
            });
        }
        this.then((v: T) => {
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
}

Future._nullFuture = new _Future.value<any>(null);

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

/** The onValue and onError handlers return either a value or a future */
type  _FutureOnValue<S, T> = (value: S) => FutureOr<T>;
/** Test used by [Future.catchError] to handle skip some errors. */
type  _FutureErrorTest = (error: any) => bool;
/** Used by [WhenFuture]. */
type _FutureAction = () => any;

@DartClass
class _Completer<T> implements DartCompleter<T> {
    future: _Future<T> = new _Future<T>();

    @Abstract
    complete(value?: FutureOr<T>): void {
        throw 'abstract';
    }

    completeError(error: any, stackTrace?: DartStackTrace): void {
        error = _nonNullError(error);
        if (!this.future._mayComplete) throw new StateError("Future already completed");
        let replacement = DartZone.current.errorCallback(error, stackTrace);
        if (replacement != null) {
            error = _nonNullError(replacement.error);
            stackTrace = replacement.stackTrace;
        }
        this._completeError(error, stackTrace);
    }

    @Abstract
    protected _completeError(error: any, stackTrace: DartStackTrace): void {
        throw 'absttact';
    }

    // The future's _isComplete doesn't take into account pending completions.
    // We therefore use _mayComplete.
    get isCompleted() {
        return !this.future._mayComplete;
    }
}

class _AsyncCompleter<T> extends _Completer<T> {
    complete(value?: FutureOr<T>): void {
        if (!this.future._mayComplete) throw new StateError("Future already completed");
        this.future._asyncComplete(value);
    }

    _completeError(error: any, stackTrace: DartStackTrace): void {
        this.future._asyncCompleteError(error, stackTrace);
    }
}

class _SyncCompleter<T> extends _Completer<T> {
    complete(value?: FutureOr<T>): void {
        if (!this.future._mayComplete) throw new StateError("Future already completed");
        this.future._complete(value);
    }

    _completeError(error: any, stackTrace: DartStackTrace): void {
        this.future._completeError(error, stackTrace);
    }
}

const MASK_VALUE: int = 1;
const MASK_ERROR: int = 2;
const MASK_TEST_ERROR: int = 4;
const MASK_WHENCOMPLETE: int = 8;
const STATE_CHAIN: int = 0;
const STATE_THEN: int = MASK_VALUE;
const STATE_THEN_ONERROR: int = MASK_VALUE | MASK_ERROR;
const STATE_CATCHERROR: int = MASK_ERROR;
const STATE_CATCHERROR_TEST: int = MASK_ERROR | MASK_TEST_ERROR;
const STATE_WHENCOMPLETE: int = MASK_WHENCOMPLETE;

@DartClass
class _FutureListener<S, T> {

    // Listeners on the same future are linked through this link.
    _nextListener: _FutureListener<any, any> = null;
    // The future to complete when this listener is activated.
    result: _Future<T>;
    // Which fields means what.
    state: int;
    // Used for then/whenDone callback and error test
    callback: Function;
    // Used for error callbacks.
    errorCallback: Function;

    @namedConstructor
    protected then(result: _Future<T>, onValue: _FutureOnValue<S, T>, errorCallback: Function) {
        this.result = result;
        this.callback = onValue;
        this.errorCallback = errorCallback;
        this.state = (errorCallback == null) ? STATE_THEN : STATE_THEN_ONERROR;
    }

    static then: new<S, T>(result: _Future<T>, onValue: _FutureOnValue<S, T>, errorCallback: Function) => _FutureListener<S, T>;

    @namedConstructor
    protected catchError(result: _Future<T>, errorCallback: Function, test: _FutureErrorTest) {
        this.result = result;
        this.errorCallback = errorCallback;
        this.callback = test;
        this.state = (test == null) ? STATE_CATCHERROR : STATE_CATCHERROR_TEST;
    }

    static catchError: new<S, T>(result: _Future<T>, errorCallback: Function, test: _FutureErrorTest) => _FutureListener<S, T>;

    @namedConstructor
    protected whenComplete(result: _Future<T>, onComplete: _FutureAction) {
        this.result = result;
        this.callback = onComplete;
        this.errorCallback = null;
        this.state = STATE_WHENCOMPLETE;
    }

    static whenComplete: new<S, T>(result: _Future<T>, onComplete: _FutureAction) => _FutureListener<S, T>;

    get _zone(): DartZone {
        return this.result._zone;
    }

    get handlesValue(): bool {
        return (this.state & MASK_VALUE) != 0;
    }

    get handlesError(): bool {
        return (this.state & MASK_ERROR) != 0;
    }

    get hasErrorTest(): bool {
        return (this.state == STATE_CATCHERROR_TEST);
    }

    get handlesComplete(): bool {
        return (this.state == STATE_WHENCOMPLETE);
    }

    get _onValue(): _FutureOnValue<S, T> {
        //assert(handlesValue);
        return this.callback as any/*=_FutureOnValue<S, T>*/;
    }

    get _onError(): Function {
        return this.errorCallback;
    }

    get _errorTest(): _FutureErrorTest {
        //assert(hasErrorTest);
        return this.callback as any/*=_FutureErrorTest*/;
    }

    get _whenCompleteAction(): _FutureAction {
        //assert(handlesComplete);
        return this.callback as any/*=_FutureAction*/;
    }

    /// Whether this listener has an error callback.
    ///
    /// This function must only be called if the listener [handlesError].
    get hasErrorCallback(): bool {
        //assert(handlesError);
        return this._onError != null;
    }

    handleValue(sourceResult: S): FutureOr<T> {
        return this._zone.runUnary<FutureOr<T>, S>(this._onValue, sourceResult);
    }

    matchesErrorTest(asyncError: DartAsyncError): bool {
        if (!this.hasErrorTest) return true;
        return this._zone.runUnary<bool, any>(this._errorTest, asyncError.error);
    }

    handleError(asyncError: DartAsyncError): FutureOr<T> {
        //assert(handlesError && hasErrorCallback);
        // NOTE(dart2ts): we cannot distinguish, use always binary
        //if (_dart.is(this.errorCallback, ZoneBinaryCallback)) {
        let typedErrorCallback = this.errorCallback as any
            /*=ZoneBinaryCallback<FutureOr<T>, Object, StackTrace>*/;
        return this._zone.runBinary(
            typedErrorCallback, asyncError.error, asyncError.stackTrace);
        //} else {
        //    return this._zone.runUnary<FutureOr<T>, any>(
        //        this.errorCallback, asyncError.error);
        //}
    }

    handleWhenComplete(): any {
        //assert(!handlesError);
        return this._zone.run(this._whenCompleteAction);
    }
}


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
@DartClass
class DartTimer {
    /**
     * Creates a new timer.
     *
     * The [callback] function is invoked after the given [duration].
     *
     */
    @defaultFactory
    protected static _create(duration: DartDuration, callback: () => any): DartTimer {
        if (DartZone.current == DartZone.ROOT) {
            // No need to bind the callback. We know that the root's timer will
            // be invoked in the root zone.
            return DartZone.current.createTimer(duration, callback);
        }
        return DartZone.current.createTimer(
            duration, DartZone.current.bindCallback(callback, {runGuarded: true}));
    }

    constructor(duration: DartDuration, callback: () => any) {

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
    @namedFactory
    protected static _periodic(duration: DartDuration, callback: (timer: DartTimer) => any): DartTimer {
        if (DartZone.current == DartZone.ROOT) {
            // No need to bind the callback. We know that the root's timer will
            // be invoked in the root zone.
            return DartZone.current.createPeriodicTimer(duration, callback);
        }
        // TODO(floitsch): the return type should be 'void', and the type
        // should be inferred.
        var boundCallback = DartZone.current
            .bindUnaryCallback<any, DartTimer>(callback, {runGuarded: true});
        return DartZone.current.createPeriodicTimer(duration, boundCallback);
    }

    static periodic: new(duration: DartDuration, callback: (timer: DartTimer) => any) => DartTimer;

    /**
     * Runs the given [callback] asynchronously as soon as possible.
     *
     * This function is equivalent to `new Timer(Duration.ZERO, callback)`.
     */
    static run(callback: () => any): void {
        new DartTimer(DartDuration.ZERO, callback);
    }

    /**
     * Cancels the timer.
     */
    @Abstract
    cancel(): void {
    }

    /**
     * Returns whether the timer is still active.
     *
     * A non-periodic timer is active if the callback has not been executed,
     * and the timer has not been canceled.
     *
     * A periodic timer is active if it has not been canceled.
     */
    @AbstractProperty
    get isActive(): bool {
        throw 'abstract';
    }

    /*external*/
    static _createTimer(duration: DartDuration, callback: () => any): DartTimer {
        throw "external";
    }

    /*external*/
    static _createPeriodicTimer(duration: DartDuration, callback: (timer: DartTimer) => any): DartTimer {
        throw "external";

    }
}


// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

type ZoneCallback<R> = () => R;
type ZoneUnaryCallback<R, T> = (arg: T) => R;
type ZoneBinaryCallback<R, T1, T2> = (arg1: T1, arg2: T2) => R;

// TODO(floitsch): we are abusing generic typedefs as typedefs for generic
// functions.
/*ABUSE*/
type  HandleUncaughtErrorHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, error: any, stackTrace: DartStackTrace) => R;
/*ABUSE*/
type  RunHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R) => R;
/*ABUSE*/
type  RunUnaryHandler<R, T> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R, arg: T) => R;
/*ABUSE*/
type RunBinaryHandler<R, T1, T2> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2) => R;
/*ABUSE*/
type  RegisterCallbackHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R) => ZoneCallback<R>;
/*ABUSE*/
type  RegisterUnaryCallbackHandler<R, T> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R) => ZoneUnaryCallback<R, T>;
/*ABUSE*/
type  RegisterBinaryCallbackHandler<R, T1, T2> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg1: T1, arg2: T2) => R) => ZoneBinaryCallback<R, T1, T2>;
type  ErrorCallbackHandler = (self: DartZone, parent: DartZoneDelegate,
                              zone: DartZone, error: any, stackTrace: DartStackTrace) => DartAsyncError;
type  ScheduleMicrotaskHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => any) => void;
type  CreateTimerHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, duration: DartDuration, f: () => any) => DartTimer;
type  CreatePeriodicTimerHandler = (self: DartZone, parent: DartZoneDelegate,
                                    zone: DartZone, period: DartDuration, f: (timer: DartTimer) => any) => DartTimer;
type  PrintHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, line: string) => void;
type  ForkHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                     specification: DartZoneSpecification, zoneValues: DartMap<any, any>) => DartZone;

/** Pair of error and stack trace. Returned by [Zone.errorCallback]. */
class DartAsyncError extends Error {
    error: any;
    stackTrace: DartStackTrace;

    constructor(error: any, stackTrace: DartStackTrace) {
        super();
        this.error = error;
        this.stackTrace = stackTrace;
    }

    toString(): string {
        return `${this.error}`;
    }
}

class _ZoneFunction<T extends Function> {
    zone: _Zone;
    function: T;

    constructor(zone: _Zone, f: T) {
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
@DartClass
class DartZoneSpecification {
    /**
     * Creates a specification with the provided handlers.
     */
    @defaultFactory
    protected static _create(
        _?: {
            handleUncaughtError?: HandleUncaughtErrorHandler<any>,
            run?: RunHandler<any>,
            runUnary?: RunUnaryHandler<any, any>,
            runBinary?: RunBinaryHandler<any, any, any>,
            registerCallback?: RegisterCallbackHandler<any>,
            registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>,
            registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>
            errorCallback?: ErrorCallbackHandler,
            scheduleMicrotask?: ScheduleMicrotaskHandler,
            createTimer?: CreateTimerHandler,
            createPeriodicTimer?: CreatePeriodicTimerHandler,
            print?: PrintHandler,
            fork?: ForkHandler
        }): DartZoneSpecification {
        return new _ZoneSpecification(_);
    }

    constructor(_?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>,
        run?: RunHandler<any>,
        runUnary?: RunUnaryHandler<any, any>,
        runBinary?: RunBinaryHandler<any, any, any>,
        registerCallback?: RegisterCallbackHandler<any>,
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>,
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>
        errorCallback?: ErrorCallbackHandler,
        scheduleMicrotask?: ScheduleMicrotaskHandler,
        createTimer?: CreateTimerHandler,
        createPeriodicTimer?: CreatePeriodicTimerHandler,
        print?: PrintHandler,
        fork?: ForkHandler
    }) {

    }

    /**
     * Creates a specification from [other] with the provided handlers overriding
     * the ones in [other].
     */
    @namedFactory
    protected static _from(other: DartZoneSpecification,
                           _?: {
                               handleUncaughtError?: HandleUncaughtErrorHandler<any>,
                               run?: RunHandler<any>,
                               runUnary?: RunUnaryHandler<any, any>,
                               runBinary?: RunBinaryHandler<any, any, any>,
                               registerCallback?: RegisterCallbackHandler<any>,
                               registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>,
                               registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>
                               errorCallback?: ErrorCallbackHandler,
                               scheduleMicrotask?: ScheduleMicrotaskHandler,
                               createTimer?: CreateTimerHandler,
                               createPeriodicTimer?: CreatePeriodicTimerHandler,
                               print?: PrintHandler,
                               fork?: ForkHandler
                           }) {

        return new DartZoneSpecification(Object.assign({
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

    static from: new(other: DartZoneSpecification,
                     _?: {
                         handleUncaughtError?: HandleUncaughtErrorHandler<any>,
                         run?: RunHandler<any>,
                         runUnary?: RunUnaryHandler<any, any>,
                         runBinary?: RunBinaryHandler<any, any, any>,
                         registerCallback?: RegisterCallbackHandler<any>,
                         registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>,
                         registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>
                         errorCallback?: ErrorCallbackHandler,
                         scheduleMicrotask?: ScheduleMicrotaskHandler,
                         createTimer?: CreateTimerHandler,
                         createPeriodicTimer?: CreatePeriodicTimerHandler,
                         print?: PrintHandler,
                         fork?: ForkHandler
                     }) => DartZoneSpecification;

    @AbstractProperty
    get handleUncaughtError(): HandleUncaughtErrorHandler<any> {
        throw 'abstract';
    }

    @AbstractProperty
    get run(): RunHandler<any> {
        throw 'abstract';
    }

    @AbstractProperty
    get runUnary(): RunUnaryHandler<any, any> {
        throw 'abstract';
    }

    @AbstractProperty
    get runBinary(): RunBinaryHandler<any, any, any> {
        throw 'abstract';
    }

    @AbstractProperty
    get registerCallback(): RegisterCallbackHandler<any> {
        throw 'abstract';
    }

    @AbstractProperty
    get registerUnaryCallback(): RegisterUnaryCallbackHandler<any, any> {
        throw 'abstract';
    }

    @AbstractProperty
    get registerBinaryCallback(): RegisterBinaryCallbackHandler<any, any, any> {
        throw 'abstract';
    }

    @AbstractProperty
    get errorCallback(): ErrorCallbackHandler {
        throw 'abstract';
    }

    @AbstractProperty
    get scheduleMicrotask(): ScheduleMicrotaskHandler {
        throw 'abstract';
    }

    @AbstractProperty
    get createTimer(): CreateTimerHandler {
        throw 'abstract';
    }

    @AbstractProperty
    get createPeriodicTimer(): CreatePeriodicTimerHandler {
        throw 'abstract';
    }

    @AbstractProperty
    get print(): PrintHandler {
        throw 'abstract';
    }

    @AbstractProperty
    get fork(): ForkHandler {
        throw 'abstract';
    }
}

/**
 * Internal [ZoneSpecification] class.
 *
 * The implementation wants to rely on the fact that the getters cannot change
 * dynamically. We thus require users to go through the redirecting
 * [ZoneSpecification] constructor which instantiates this class.
 */
class _ZoneSpecification implements DartZoneSpecification {
    constructor(_?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>,
        run?: RunHandler<any>,
        runUnary?: RunUnaryHandler<any, any>,
        runBinary?: RunBinaryHandler<any, any, any>,
        registerCallback?: RegisterCallbackHandler<any>,
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>,
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>
        errorCallback?: ErrorCallbackHandler,
        scheduleMicrotask?: ScheduleMicrotaskHandler,
        createTimer?: CreateTimerHandler,
        createPeriodicTimer?: CreatePeriodicTimerHandler,
        print?: PrintHandler,
        fork?: ForkHandler
    }) {
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

    handleUncaughtError: HandleUncaughtErrorHandler<any>;
    run: RunHandler<any>;
    runUnary: RunUnaryHandler<any, any>;
    runBinary: RunBinaryHandler<any, any, any>;
    registerCallback: RegisterCallbackHandler<any>;
    registerUnaryCallback: RegisterUnaryCallbackHandler<any, any>;
    registerBinaryCallback: RegisterBinaryCallbackHandler<any, any, any>;
    errorCallback: ErrorCallbackHandler;
    scheduleMicrotask: ScheduleMicrotaskHandler;
    createTimer: CreateTimerHandler;
    createPeriodicTimer: CreatePeriodicTimerHandler;
    print: PrintHandler;
    fork: ForkHandler;
}

/**
 * An adapted view of the parent zone.
 *
 * This class allows the implementation of a zone method to invoke methods on
 * the parent zone while retaining knowledge of the originating zone.
 *
 * Custom zones (created through [Zone.fork] or [runZoned]) can provide
 * implementations of most methods of zones. This is similar to overriding
 * methods on [Zone], except that this mechanism doesn't require subclassing.
 *
 * A custom zone function (provided through a [ZoneSpecification]) typically
 * records or wraps its parameters and then delegates the operation to its
 * parent zone using the provided [ZoneDelegate].
 *
 * While zones have access to their parent zone (through [Zone.parent]) it is
 * recommended to call the methods on the provided parent delegate for two
 * reasons:
 * 1. the delegate methods take an additional `zone` argument which is the
 *   zone the action has been initiated in.
 * 2. delegate calls are more efficient, since the implementation knows how
 *   to skip zones that would just delegate to their parents.
 */

interface DartZoneDelegate {
    handleUncaughtError<R>(zone: DartZone, error: any, stackTrace: DartStackTrace): R;

    run<R>(zone: DartZone, f: () => R): R;

    runUnary<R, T>(zone: DartZone, f: (arg: T) => R, arg: T): R;

    runBinary<R, T1, T2>(zone: DartZone, f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R;

    registerCallback<R>(zone: DartZone, f: () => R): ZoneCallback<R>;

    registerUnaryCallback<R, T>(zone: DartZone, f: (arg: T) => R): ZoneUnaryCallback<R, T>;

    registerBinaryCallback<R, T1, T2>(zone: DartZone, f: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2>;

    errorCallback(zone: DartZone, error: any, stackTrace: DartStackTrace): DartAsyncError;

    scheduleMicrotask(zone: DartZone, f: () => any): void;

    createTimer(zone: DartZone, duration: DartDuration, f: () => any): DartTimer;

    createPeriodicTimer(zone: DartZone, period: DartDuration, f: (timer: DartTimer) => any): DartTimer;

    print(zone: DartZone, line: string): void;

    fork(zone: DartZone, specification: DartZoneSpecification, zoneValues: DartMap<any, any>): DartZone;
}

@DartClass
class _AbstractZone {
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
    @Abstract
    handleUncaughtError<R>(error: any, stackTrace: DartStackTrace): R {
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
    @AbstractProperty
    get parent(): DartZone {
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
    @AbstractProperty
    get errorZone(): DartZone {
        throw 'abstract';
    }

    /**
     * Returns true if `this` and [otherZone] are in the same error zone.
     *
     * Two zones are in the same error zone if they have the same [errorZone].
     */
    @Abstract
    inSameErrorZone(otherZone: DartZone): bool {
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
    @Abstract
    fork(_?: { specification?: DartZoneSpecification, zoneValues?: DartMap<any, any> }): DartZone {
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
    @Abstract
    run<R>(action: () => R): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument] in this zone.
     *
     * As [run] except that [action] is called with one [argument] instead of
     * none.
     */
    @Abstract
    runUnary<R, T>(action: (argument: T) => R, argument: T): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone.
     *
     * As [run] except that [action] is called with two arguments instead of none.
     */
    @Abstract
    runBinary<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R {
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
    @Abstract
    runGuarded<R>(action: () => R): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument] in this zone and
     * catches synchronous errors.
     *
     * See [runGuarded].
     */
    @Abstract
    runUnaryGuarded<R, T>(action: (argument: T) => R, argument: T): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone and catches synchronous errors.
     *
     * See [runGuarded].
     */
    @Abstract
    runBinaryGuarded<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R {
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
    @Abstract
    registerCallback<R>(callback: () => R): ZoneCallback<R> {
        throw 'abstract';
    }


    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    @Abstract
    registerUnaryCallback<R, T>(callback: (arg: T) => R): ZoneUnaryCallback<R, T> {
        throw 'abstract';
    }


    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    @Abstract
    registerBinaryCallback<R, T1, T2>(
        callback: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
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
    @Abstract
    bindCallback<R>(action: () => R, _?: { runGuarded?: bool }): ZoneCallback<R> {
        throw 'abstract';
    }


    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerUnaryCallback(action);
     *      if (runGuarded) return (arg) => this.runUnaryGuarded(registered, arg);
     *      return (arg) => thin.runUnary(registered, arg);
     */
    @Abstract
    bindUnaryCallback<R, T>(action: (argument: T) => R,
                            _?: { runGuarded?: bool }): ZoneUnaryCallback<R, T> {
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
    @Abstract
    bindBinaryCallback<R, T1, T2>(
        action: (argument1: T1, argument2: T2) => R,
        _?: { runGuarded?: bool }): ZoneBinaryCallback<R, T1, T2> {
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
    @Abstract
    errorCallback(error: any, stackTrace: DartStackTrace): DartAsyncError {
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
    @Abstract
    scheduleMicrotask(action: () => any): void {
        throw 'abstract';
    }


    /**
     * Creates a Timer where the callback is executed in this zone.
     */
    @Abstract
    createTimer(duration: DartDuration, callback: () => any): DartTimer {
        throw 'abstract';
    }

    /**
     * Creates a periodic Timer where the callback is executed in this zone.
     */
    @Abstract
    createPeriodicTimer(period: DartDuration, callback: (timer: DartTimer) => any): DartTimer {
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
    @Abstract
    print(line: string): void {
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
    @Operator(Op.INDEX)
    @Abstract
    get(key: any): any {
        throw'abstract';
    }
}

/**
 * Base class for Zone implementations.
 */
@DartClass
class _Zone extends _AbstractZone implements DartZone {

    constructor() {
        super();
    }

    @AbstractProperty
    get _run(): _ZoneFunction<RunHandler<any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get _runUnary(): _ZoneFunction<RunUnaryHandler<any, any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get _runBinary(): _ZoneFunction<RunBinaryHandler<any, any, any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get _registerCallback(): _ZoneFunction<RegisterCallbackHandler<any>> {
        throw 'abstract';
    }

    @AbstractProperty

    get _registerUnaryCallback(): _ZoneFunction<RegisterUnaryCallbackHandler<any, any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get _registerBinaryCallback(): _ZoneFunction<RegisterBinaryCallbackHandler<any, any, any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get _errorCallback(): _ZoneFunction<ErrorCallbackHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _scheduleMicrotask(): _ZoneFunction<ScheduleMicrotaskHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _createTimer(): _ZoneFunction<CreateTimerHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _createPeriodicTimer(): _ZoneFunction<CreatePeriodicTimerHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _print(): _ZoneFunction<PrintHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _fork(): _ZoneFunction<ForkHandler> {
        throw 'abstract';
    }

    @AbstractProperty
    get _handleUncaughtError(): _ZoneFunction<HandleUncaughtErrorHandler<any>> {
        throw 'abstract';
    }

    @AbstractProperty
    get parent(): DartZone {
        throw 'abstract';
    }

    @AbstractProperty
    get _delegate(): DartZoneDelegate {
        throw 'abstract';
    }

    @AbstractProperty
    get _map(): DartMap<any, any> {
        throw 'abstract';
    }

    inSameErrorZone(otherZone: DartZone): bool {
        return identical(this, otherZone) ||
            identical(this.errorZone, otherZone.errorZone);
    }


}

@DartClass
class _RootZone extends _Zone {
    constructor() {
        super();
    }

    get _run(): _ZoneFunction<RunHandler<any>> {
        return new _ZoneFunction<RunHandler<any>>(_ROOT_ZONE, _rootRun);
    }

    get _runUnary(): _ZoneFunction<RunUnaryHandler<any, any>> {
        return new _ZoneFunction<RunUnaryHandler<any, any>>(_ROOT_ZONE, _rootRunUnary);
    }

    get _runBinary(): _ZoneFunction<RunBinaryHandler<any, any, any>> {
        return new _ZoneFunction<RunBinaryHandler<any, any, any>>(_ROOT_ZONE, _rootRunBinary);
    }

    get _registerCallback(): _ZoneFunction<RegisterCallbackHandler<any>> {
        return new _ZoneFunction<RegisterCallbackHandler<any>>(
            _ROOT_ZONE, _rootRegisterCallback);
    }

    get _registerUnaryCallback(): _ZoneFunction<RegisterUnaryCallbackHandler<any, any>> {
        return new _ZoneFunction<RegisterUnaryCallbackHandler<any, any>>(_ROOT_ZONE, _rootRegisterUnaryCallback);
    }

    get _registerBinaryCallback(): _ZoneFunction<RegisterBinaryCallbackHandler<any, any, any>> {
        return new _ZoneFunction<RegisterBinaryCallbackHandler<any, any, any>>(_ROOT_ZONE, _rootRegisterBinaryCallback);
    }

    get _errorCallback(): _ZoneFunction<ErrorCallbackHandler> {
        return new _ZoneFunction<ErrorCallbackHandler>(_ROOT_ZONE, _rootErrorCallback);
    }

    get _scheduleMicrotask(): _ZoneFunction<ScheduleMicrotaskHandler> {
        return new _ZoneFunction<ScheduleMicrotaskHandler>(_ROOT_ZONE, _rootScheduleMicrotask);
    }

    get _createTimer(): _ZoneFunction<CreateTimerHandler> {
        return new _ZoneFunction<CreateTimerHandler>(_ROOT_ZONE, _rootCreateTimer);
    }

    get _createPeriodicTimer(): _ZoneFunction<CreatePeriodicTimerHandler> {
        return new _ZoneFunction<CreatePeriodicTimerHandler>(_ROOT_ZONE, _rootCreatePeriodicTimer);
    }

    get _print(): _ZoneFunction<PrintHandler> {
        return new _ZoneFunction<PrintHandler>(_ROOT_ZONE, _rootPrint);
    }

    get _fork(): _ZoneFunction<ForkHandler> {
        return new _ZoneFunction<ForkHandler>(_ROOT_ZONE, _rootFork);
    }

    get _handleUncaughtError(): _ZoneFunction<HandleUncaughtErrorHandler<any>> {
        return new _ZoneFunction<HandleUncaughtErrorHandler<any>>(
            _ROOT_ZONE, _rootHandleUncaughtError);
    }

    // The parent zone.
    get parent(): _Zone {
        return null;
    }

    /// The zone's scoped value declaration map.
    ///
    /// This is always a [HashMap].
    get _map(): DartMap<any, any> {
        return _RootZone._rootMap;
    }

    static _rootMap: DartMap<any, any> = new DartHashMap<any, any>();

    static _rootDelegate: DartZoneDelegate;

    get _delegate(): DartZoneDelegate {
        if (_RootZone._rootDelegate != null) return _RootZone._rootDelegate;
        return _RootZone._rootDelegate = new _ZoneDelegate(this);
    }

    /**
     * The closest error-handling zone.
     *
     * Returns `this` if `this` has an error-handler. Otherwise returns the
     * parent's error-zone.
     */
    get errorZone(): DartZone {
        return this;
    }

    // Zone interface.

    runGuarded<R>(f: () => R): R {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f();
            }
            return _rootRun<R>(null, null, this, f);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError<R>(e, s);
        }
    }

    runUnaryGuarded<R, T>(f: (arg: T) => R, arg: T): R {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f(arg);
            }
            return _rootRunUnary<R, T>(null, null, this, f, arg);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError<R>(e, s);
        }
    }

    runBinaryGuarded<R, T1, T2>(f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
        try {
            if (identical(_ROOT_ZONE, DartZone._current)) {
                return f(arg1, arg2);
            }
            return _rootRunBinary<R, T1, T2>(null, null, this, f, arg1, arg2);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError<R>(e, s);
        }
    }

    bindCallback<R>(f: () => R, _?: { runGuarded: bool }): ZoneCallback<R> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        if (runGuarded) {
            return () => this.runGuarded<R>(f);
        } else {
            return () => this.run<R>(f);
        }
    }

    bindUnaryCallback<R, T>(f: (arg: T) => R,
                            _?: { runGuarded?: bool }): ZoneUnaryCallback<R, T> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        if (runGuarded) {
            return (arg) => this.runUnaryGuarded<R, T>(f, arg);
        } else {
            return (arg) => this.runUnary<R, T>(f, arg);
        }
    }

    bindBinaryCallback<R, T1, T2>(
        f: (arg1: T1, arg2: T2) => R,
        _?: { runGuarded?: bool }): ZoneBinaryCallback<R, T1, T2> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        if (runGuarded) {
            return (arg1, arg2) => this.runBinaryGuarded<R, T1, T2>(f, arg1, arg2);
        } else {
            return (arg1, arg2) => this.runBinary<R, T1, T2>(f, arg1, arg2);
        }
    }

    @Operator(Op.INDEX)
    get(key: any) {
        return null;
    }

// Methods that can be customized by the zone specification.

    handleUncaughtError<R>(error: any, stackTrace: DartStackTrace): R {
        return _rootHandleUncaughtError(null, null, this, error, stackTrace);
    }

    fork(_?: { specification?: DartZoneSpecification, zoneValues?: DartMap<any, any> }): DartZone {
        let {specification, zoneValues} = Object.assign({}, _);
        return _rootFork(null, null, this, specification, zoneValues);
    }

    run<R>(f: () => R): R {
        if (identical(DartZone._current, _ROOT_ZONE)) return f();
        return _rootRun(null, null, this, f);
    }

    runUnary<R, T>(f: (arg: T) => R, arg: T): R {
        if (identical(DartZone._current, _ROOT_ZONE)) return f(arg);
        return _rootRunUnary(null, null, this, f, arg);
    }

    runBinary<R, T1, T2>(f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
        if (identical(DartZone._current, _ROOT_ZONE)) return f(arg1, arg2);
        return _rootRunBinary(null, null, this, f, arg1, arg2);
    }

    registerCallback<R>(f: () => R): ZoneCallback<R> {
        return f;
    }

    registerUnaryCallback<R, T>(f: (arg: T) => R): ZoneUnaryCallback<R, T> {
        return f;
    }

    registerBinaryCallback<R, T1, T2>(
        f: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
        return f;
    }


    errorCallback(error: any, stackTrace: DartStackTrace): DartAsyncError {
        return null;
    }

    scheduleMicrotask(f: () => any): void {
        _rootScheduleMicrotask(null, null, this, f);
    }

    createTimer(duration: DartDuration, f: () => any): DartTimer {
        return DartTimer._createTimer(duration, f);
    }

    createPeriodicTimer(duration: DartDuration, f: (timer: DartTimer) => any): DartTimer {
        return DartTimer._createPeriodicTimer(duration, f);
    }

    print(line: string): void {
        printToConsole(line);
    }
}

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
@DartClass
class DartZone {
    // Private constructor so that it is not possible instantiate a Zone class.
    @namedConstructor
    _() {

    }

    protected static _: new() => DartZone;

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
    static ROOT: DartZone = _ROOT_ZONE;

    /** The currently running zone. */
    static _current: DartZone = _ROOT_ZONE;

    /** The zone that is currently active. */
    static get current(): DartZone {
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
    @Abstract
    handleUncaughtError<R>(error: any, stackTrace: DartStackTrace): R {
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
    @AbstractProperty
    get parent(): DartZone {
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
    @AbstractProperty
    get errorZone(): DartZone {
        throw 'abstract';
    }

    /**
     * Returns true if `this` and [otherZone] are in the same error zone.
     *
     * Two zones are in the same error zone if they have the same [errorZone].
     */
    @Abstract
    inSameErrorZone(otherZone: DartZone): bool {
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
    @Abstract
    fork(_?: { specification?: DartZoneSpecification, zoneValues?: DartMap<any, any> }): DartZone {
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
    @Abstract
    run<R>(action: () => R): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument] in this zone.
     *
     * As [run] except that [action] is called with one [argument] instead of
     * none.
     */
    @Abstract
    runUnary<R, T>(action: (argument: T) => R, argument: T): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone.
     *
     * As [run] except that [action] is called with two arguments instead of none.
     */
    @Abstract
    runBinary<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R {
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
    @Abstract
    runGuarded<R>(action: () => R): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument] in this zone and
     * catches synchronous errors.
     *
     * See [runGuarded].
     */
    @Abstract
    runUnaryGuarded<R, T>(action: (argument: T) => R, argument: T): R {
        throw 'abstract';
    }

    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone and catches synchronous errors.
     *
     * See [runGuarded].
     */
    @Abstract
    runBinaryGuarded<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R {
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
    @Abstract
    registerCallback<R>(callback: () => R): ZoneCallback<R> {
        throw 'abstract';
    }


    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    @Abstract
    registerUnaryCallback<R, T>(callback: (arg: T) => R): ZoneUnaryCallback<R, T> {
        throw 'abstract';
    }


    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    @Abstract
    registerBinaryCallback<R, T1, T2>(
        callback: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
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
    @Abstract
    bindCallback<R>(action: () => R, _?: { runGuarded?: bool }): ZoneCallback<R> {
        throw 'abstract';
    }


    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerUnaryCallback(action);
     *      if (runGuarded) return (arg) => this.runUnaryGuarded(registered, arg);
     *      return (arg) => thin.runUnary(registered, arg);
     */
    @Abstract
    bindUnaryCallback<R, T>(action: (argument: T) => R,
                            _?: { runGuarded?: bool }): ZoneUnaryCallback<R, T> {
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
    @Abstract
    bindBinaryCallback<R, T1, T2>(
        action: (argument1: T1, argument2: T2) => R,
        _?: { runGuarded?: bool }): ZoneBinaryCallback<R, T1, T2> {
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
    @Abstract
    errorCallback(error: any, stackTrace: DartStackTrace): DartAsyncError {
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
    @Abstract
    scheduleMicrotask(action: () => any): void {
        throw 'abstract';
    }


    /**
     * Creates a Timer where the callback is executed in this zone.
     */
    @Abstract
    createTimer(duration: DartDuration, callback: () => any): DartTimer {
        throw 'abstract';
    }

    /**
     * Creates a periodic Timer where the callback is executed in this zone.
     */
    @Abstract
    createPeriodicTimer(period: DartDuration, callback: (timer: DartTimer) => any): DartTimer {
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
    @Abstract
    print(line: string): void {
        throw 'abstract';
    }

    /**
     * Call to enter the Zone.
     *
     * The previous current zone is returned.
     */
    static _enter(zone: DartZone): DartZone {
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
    static _leave(previous: DartZone): void {
        //assert(previous != null);
        DartZone._current = previous;
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
    @Operator(Op.INDEX)
    @Abstract
    get(key: any): any {
        throw'abstract';
    }
}

function _parentDelegate(zone: _Zone): DartZoneDelegate {
    if (zone.parent == null) return null;
    return (zone.parent as _Zone)._delegate;
}

class _ZoneDelegate implements DartZoneDelegate {
    protected _delegationTarget: _Zone;

    constructor(_delegationTarget: _Zone) {
        this._delegationTarget = _delegationTarget;
    }

    handleUncaughtError<R>(zone: DartZone, error: any, stackTrace: DartStackTrace): R {
        let implementation = this._delegationTarget._handleUncaughtError;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, error, stackTrace)/*=R*/;
    }

    run<R>(zone: DartZone, f: () => R): R {
        let implementation = this._delegationTarget._run;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f)/*=R*/;
    }

    runUnary<R, T>(zone: DartZone, f: (arg: T) => R, arg: T): R {
        let implementation = this._delegationTarget._runUnary;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f, arg)/*=R*/;
    }

    runBinary<R, T1, T2>(zone: DartZone, f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
        let implementation = this._delegationTarget._runBinary;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f, arg1, arg2)/*=R*/;
    }

    registerCallback<R>(zone: DartZone, f: () => R): ZoneCallback<R> {
        let implementation = this._delegationTarget._registerCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f)/*=ZoneCallback<R>*/;
    }

    registerUnaryCallback<R, T>(zone: DartZone, f: (arg: T) => R): ZoneUnaryCallback<R, T> {
        let implementation = this._delegationTarget._registerUnaryCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f)/*=ZoneUnaryCallback<R, T>*/;
    }

    registerBinaryCallback<R, T1, T2>(
        zone: DartZone, f: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
        let implementation = this._delegationTarget._registerBinaryCallback;
        let implZone = implementation.zone;
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implZone, _parentDelegate(implZone), zone, f)/*=ZoneBinaryCallback<R, T1, T2>*/;
    }

    errorCallback(zone: DartZone, error: any, stackTrace: DartStackTrace): DartAsyncError {
        let implementation = this._delegationTarget._errorCallback;
        let implZone = implementation.zone;
        if (identical(implZone, _ROOT_ZONE)) return null;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, error, stackTrace);
    }

    scheduleMicrotask(zone: DartZone, f: () => any): void {
        let implementation = this._delegationTarget._scheduleMicrotask;
        let implZone = implementation.zone;
        let handler = implementation.function;
        handler(implZone, _parentDelegate(implZone), zone, f);
    }

    createTimer(zone: DartZone, duration: DartDuration, f: () => any): DartTimer {
        let implementation = this._delegationTarget._createTimer;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, duration, f);
    }

    createPeriodicTimer(zone: DartZone, period: DartDuration, f: (timer: DartTimer) => any): DartTimer {
        let implementation = this._delegationTarget._createPeriodicTimer;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, period, f);
    }

    print(zone: DartZone, line: string): void {
        let implementation = this._delegationTarget._print;
        let implZone = implementation.zone;
        let handler = implementation.function;
        handler(implZone, _parentDelegate(implZone), zone, line);
    }

    fork(zone: DartZone, specification: DartZoneSpecification, zoneValues: DartMap<any, any>): DartZone {
        let implementation = this._delegationTarget._fork;
        let implZone = implementation.zone;
        let handler = implementation.function;
        return handler(implZone, _parentDelegate(implZone), zone, specification, zoneValues);
    }
}

class _CustomZone extends _Zone {
    // The actual zone and implementation of each of these
    // inheritable zone functions.
    _run: _ZoneFunction<RunHandler<any>>;
    _runUnary: _ZoneFunction<RunUnaryHandler<any, any>>;
    _runBinary: _ZoneFunction<RunBinaryHandler<any, any, any>>;
    _registerCallback: _ZoneFunction<RegisterCallbackHandler<any>>;
    _registerUnaryCallback: _ZoneFunction<RegisterUnaryCallbackHandler<any, any>>;
    _registerBinaryCallback: _ZoneFunction<RegisterBinaryCallbackHandler<any, any, any>>;
    _errorCallback: _ZoneFunction<ErrorCallbackHandler>;
    _scheduleMicrotask: _ZoneFunction<ScheduleMicrotaskHandler>;
    _createTimer: _ZoneFunction<CreateTimerHandler>;
    _createPeriodicTimer: _ZoneFunction<CreatePeriodicTimerHandler>;
    _print: _ZoneFunction<PrintHandler>;
    _fork: _ZoneFunction<ForkHandler>;
    _handleUncaughtError: _ZoneFunction<HandleUncaughtErrorHandler<any>>;

    // A cached delegate to this zone.
    _delegateCache: DartZoneDelegate;

    /// The parent zone.
    parent: _Zone;

    /// The zone's scoped value declaration map.
    ///
    /// This is always a [HashMap].
    _map: DartMap<any, any>;

    get _delegate(): DartZoneDelegate {
        if (this._delegateCache != null) return this._delegateCache;
        this._delegateCache = new _ZoneDelegate(this);
        return this._delegateCache;
    }

    constructor(parent: _Zone, specification: DartZoneSpecification, _map: DartMap<any, any>) {
        super();
        this.parent = parent;
        this._map = _map;
        // The root zone will have implementations of all parts of the
        // specification, so it will never try to access the (null) parent.
        // All other zones have a non-null parent.
        this._run = (specification.run != null)
            ? new _ZoneFunction<RunHandler<any>>(this, specification.run)
            : parent._run;
        this._runUnary = (specification.runUnary != null)
            ? new _ZoneFunction<RunUnaryHandler<any, any>>(this, specification.runUnary)
            : parent._runUnary;
        this._runBinary = (specification.runBinary != null)
            ? new _ZoneFunction<RunBinaryHandler<any, any, any>>(this, specification.runBinary)
            : parent._runBinary;
        this._registerCallback = (specification.registerCallback != null)
            ? new _ZoneFunction<RegisterCallbackHandler<any>>(
                this, specification.registerCallback)
            : parent._registerCallback;
        this._registerUnaryCallback = (specification.registerUnaryCallback != null)
            ? new _ZoneFunction<RegisterUnaryCallbackHandler<any, any>>(
                this, specification.registerUnaryCallback)
            : parent._registerUnaryCallback;
        this._registerBinaryCallback = (specification.registerBinaryCallback != null)
            ? new _ZoneFunction<RegisterBinaryCallbackHandler<any, any, any>>(
                this, specification.registerBinaryCallback)
            : parent._registerBinaryCallback;
        this._errorCallback = (specification.errorCallback != null)
            ? new _ZoneFunction<ErrorCallbackHandler>(
                this, specification.errorCallback)
            : parent._errorCallback;
        this._scheduleMicrotask = (specification.scheduleMicrotask != null)
            ? new _ZoneFunction<ScheduleMicrotaskHandler>(
                this, specification.scheduleMicrotask)
            : parent._scheduleMicrotask;
        this._createTimer = (specification.createTimer != null)
            ? new _ZoneFunction<CreateTimerHandler>(this, specification.createTimer)
            : parent._createTimer;
        this._createPeriodicTimer = (specification.createPeriodicTimer != null)
            ? new _ZoneFunction<CreatePeriodicTimerHandler>(
                this, specification.createPeriodicTimer)
            : parent._createPeriodicTimer;
        this._print = (specification.print != null)
            ? new _ZoneFunction<PrintHandler>(this, specification.print)
            : parent._print;
        this._fork = (specification.fork != null)
            ? new _ZoneFunction<ForkHandler>(this, specification.fork)
            : parent._fork;
        this._handleUncaughtError = (specification.handleUncaughtError != null)
            ? new _ZoneFunction<HandleUncaughtErrorHandler<any>>(
                this, specification.handleUncaughtError)
            : parent._handleUncaughtError;
    }

    /**
     * The closest error-handling zone.
     *
     * Returns `this` if `this` has an error-handler. Otherwise returns the
     * parent's error-zone.
     */
    get errorZone(): DartZone {
        return this._handleUncaughtError.zone;
    }

    runGuarded<R>(f: () => R): R {
        try {
            return this.run(f);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }

    runUnaryGuarded<R, T>(f: (arg: T) => R, arg: T): R {
        try {
            return this.runUnary(f, arg);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }

    runBinaryGuarded<R, T1, T2>(f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
        try {
            return this.runBinary(f, arg1, arg2);
        } catch (e) {
            let s = new DartStackTrace(e);
            return this.handleUncaughtError(e, s);
        }
    }

    bindCallback<R>(f: () => R, _?: { runGuarded?: bool }): ZoneCallback<R> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        let registered = this.registerCallback(f);
        if (runGuarded) {
            return () => this.runGuarded(registered);
        } else {
            return () => this.run(registered);
        }
    }

    bindUnaryCallback<R, T>(f: (arg: T) => R, _?: { runGuarded?: bool }): ZoneUnaryCallback<R, T> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        let registered = this.registerUnaryCallback(f);
        if (runGuarded) {
            return (arg) => this.runUnaryGuarded(registered, arg);
        } else {
            return (arg) => this.runUnary(registered, arg);
        }
    }

    bindBinaryCallback<R, T1, T2>(
        f: (arg1: T1, arg2: T2) => R,
        _?: { runGuarded?: bool }): ZoneBinaryCallback<R, T1, T2> {
        let {runGuarded} = Object.assign({runGuarded: true}, _);
        let registered = this.registerBinaryCallback(f);
        if (runGuarded) {
            return (arg1, arg2) => this.runBinaryGuarded(registered, arg1, arg2);
        } else {
            return (arg1, arg2) => this.runBinary(registered, arg1, arg2);
        }
    }

    @Operator(Op.INDEX)
    get(key: any): any {
        let result = this._map.get(key);
        if (result != null || this._map.containsKey(key)) return result;
        // If we are not the root zone, look up in the parent zone.
        if (this.parent != null) {
            // We do not optimize for repeatedly looking up a key which isn't
            // there. That would require storing the key and keeping it alive.
            // Copying the key/value from the parent does not keep any new values
            // alive.
            let value = this.parent.get(key);
            if (value != null) {
                this._map[OPERATOR_INDEX_ASSIGN](key, value);
            }
            return value;
        }
        //assert(this == _ROOT_ZONE);
        return null;
    }

    // Methods that can be customized by the zone specification.
    handleUncaughtError<R>(error: any, stackTrace: DartStackTrace): R {
        let implementation = this._handleUncaughtError;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, error, stackTrace)/*=R*/;
    }

    fork(_?: { specification?: DartZoneSpecification, zoneValues?: DartMap<any, any> }): DartZone {
        let {specification, zoneValues} = Object.assign({}, _);
        let implementation = this._fork;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(
            implementation.zone, parentDelegate, this, specification, zoneValues);
    }

    run<R>(f: () => R): R {
        let implementation = this._run;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f)/*=R*/;
    }

    runUnary<R, T>(f: (arg: T) => R, arg: T): R {
        let implementation = this._runUnary;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f, arg)/*=R*/;
    }

    runBinary<R, T1, T2>(f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
        let implementation = this._runBinary;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, f, arg1, arg2)/*=R*/;
    }

    registerCallback<R>(callback: () => R): ZoneCallback<R> {
        let implementation = this._registerCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback)/*=ZoneCallback<R>*/;
    }

    registerUnaryCallback<R, T>(callback: (arg: T) => R): ZoneUnaryCallback<R, T> {
        let implementation = this._registerUnaryCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T>' once it's
        // supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback)/*=ZoneUnaryCallback<R, T>*/;
    }

    registerBinaryCallback<R, T1, T2>(
        callback: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
        let implementation = this._registerBinaryCallback;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        // TODO(floitsch): make this a generic method call on '<R, T1, T2>' once
        // it's supported. Remove the unnecessary cast.
        return handler(implementation.zone, parentDelegate, this, callback)/*=ZoneBinaryCallback<R, T1, T2>*/;
    }

    errorCallback(error: any, stackTrace: DartStackTrace): DartAsyncError {
        let implementation = this._errorCallback;
        //assert(implementation != null);
        let implementationZone = implementation.zone;
        if (identical(implementationZone, _ROOT_ZONE)) return null;
        let parentDelegate = _parentDelegate(implementationZone);
        let handler = implementation.function;
        return handler(implementationZone, parentDelegate, this, error, stackTrace);
    }

    scheduleMicrotask(f: () => any): void {
        let implementation = this._scheduleMicrotask;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, f);
    }

    createTimer(duration: DartDuration, f: () => any): DartTimer {
        let implementation = this._createTimer;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, duration, f);
    }

    createPeriodicTimer(duration: DartDuration, f: (timer: DartTimer) => any): DartTimer {
        let implementation = this._createPeriodicTimer;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, duration, f);
    }

    print(line: string): void {
        let implementation = this._print;
        //assert(implementation != null);
        let parentDelegate = _parentDelegate(implementation.zone);
        let handler = implementation.function;
        return handler(implementation.zone, parentDelegate, this, line);
    }
}

function _rootHandleUncaughtError<R>(self: DartZone, parent: DartZoneDelegate, zone: DartZone, error: any, stackTrace: DartStackTrace): R {
    _schedulePriorityAsyncCallback(() => {
        if (error == null) error = new NullThrownError();
        if (stackTrace == null) throw error;
        _rethrow(error, stackTrace);
    });
    return null;
}

/*external*/
function _rethrow(error: any, stackTrace: DartStackTrace): void {

}

function _rootRun<R>(self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R): R {
    if (DartZone._current === zone) return f();

    let old = DartZone._enter(zone);
    try {
        return f();
    } finally {
        DartZone._leave(old);
    }
}

function _rootRunUnary<R, T>(
    self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R, arg: T): R {
    if (DartZone._current === zone) return f(arg);

    let old = DartZone._enter(zone);
    try {
        return f(arg);
    } finally {
        DartZone._leave(old);
    }
}

function _rootRunBinary<R, T1, T2>(self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                                   f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): R {
    if (DartZone._current === zone) return f(arg1, arg2);

    let old = DartZone._enter(zone);
    try {
        return f(arg1, arg2);
    } finally {
        DartZone._leave(old);
    }
}

function _rootRegisterCallback<R>(
    self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R): ZoneCallback<R> {
    return f;
}

function _rootRegisterUnaryCallback<R, T>(
    self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R): ZoneUnaryCallback<R, T> {
    return f;
}

function _rootRegisterBinaryCallback<R, T1, T2>(
    self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2> {
    return f;
}

function _rootErrorCallback(self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                            error: any, stackTrace: DartStackTrace): DartAsyncError {
    return null;
}


function _rootScheduleMicrotask(self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => any): void {
    if (!identical(_ROOT_ZONE, zone)) {
        let hasErrorHandler = !_ROOT_ZONE.inSameErrorZone(zone);
        f = zone.bindCallback(f, {runGuarded: hasErrorHandler});
        // Use root zone as event zone if the function is already bound.
        zone = _ROOT_ZONE;
    }
    _scheduleAsyncCallback(f);
}

function _rootCreateTimer(self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                          duration: DartDuration, callback: () => any): DartTimer {
    if (!identical(_ROOT_ZONE, zone)) {
        callback = zone.bindCallback(callback);
    }
    return DartTimer._createTimer(duration, callback);
}

function _rootCreatePeriodicTimer(self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                                  duration: DartDuration, callback: (timer: DartTimer) => any): DartTimer {
    if (!identical(_ROOT_ZONE, zone)) {
        // TODO(floitsch): the return type should be 'void'.
        callback = zone.bindUnaryCallback<any, DartTimer>(callback);
    }
    return DartTimer._createPeriodicTimer(duration, callback);
}

function _rootPrint(self: DartZone, parent: DartZoneDelegate, zone: DartZone, line: string): void {
    printToConsole(line);
}

function _printToZone(line: string): void {
    DartZone.current.print(line);
}

function _rootFork(self: DartZone, parent: DartZoneDelegate, zone: DartZone,
                   specification: DartZoneSpecification, zoneValues: DartMap<any, any>): DartZone {
    // TODO(floitsch): it would be nice if we could get rid of this hack.
    // Change the static zoneOrDirectPrint function to go through zones
    // from now on.
    printToZone = _printToZone;

    if (specification == null) {
        specification = new DartZoneSpecification();
    } else if (_dart.isNot(specification, _ZoneSpecification)) {
        throw new ArgumentError("ZoneSpecifications must be instantiated" +
            " with the provided constructor.");
    }
    let valueMap: DartMap<any, any>;
    if (zoneValues == null) {
        if (_dart.is(zone, _Zone)) {
            valueMap = (zone as any as _Zone)._map;
        } else {
            valueMap = new DartHashMap<any, any>();
        }
    } else {
        valueMap = new DartHashMap.from(zoneValues);
    }
    return new _CustomZone(zone as _Zone, specification, valueMap);
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
function runZoned<R>(body: () => R,
                     _?: { zoneValues?: DartMap<any, any>, zoneSpecification?: DartZoneSpecification, onError?: Function }): R {
    let {zoneValues, zoneSpecification, onError} = Object.assign({}, _);
    let errorHandler: HandleUncaughtErrorHandler<any>;
    if (onError != null) {
        errorHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, error: any,
                        stackTrace: DartStackTrace) => {
            try {
                // NOTE(dart2ts): we have no way to distinguish, use binary always
                // TODO(floitsch): the return type should be 'void'.
                //if (_dart.is(onError ,ZoneBinaryCallback)) {
                return self.parent.runBinary(onError as ZoneBinaryCallback<any, any, any>, error, stackTrace);
                //}
                //return self.parent.runUnary(onError, error);
            } catch (e) {
                let s = new DartStackTrace(e);
                if (identical(e, error)) {
                    return parent.handleUncaughtError(zone, error, stackTrace);
                } else {
                    return parent.handleUncaughtError(zone, e, s);
                }
            }
        };
    }
    if (zoneSpecification == null) {
        zoneSpecification =
            new DartZoneSpecification({handleUncaughtError: errorHandler});
    } else if (errorHandler != null) {
        zoneSpecification = new DartZoneSpecification.from(zoneSpecification,
            {handleUncaughtError: errorHandler});
    }
    let zone = DartZone.current
        .fork({specification: zoneSpecification, zoneValues: zoneValues});
    if (onError != null) {
        return zone.runGuarded(body);
    } else {
        return zone.run(body);
    }
}


/**
 * This function is set by the first allocation of a Zone.
 *
 * Once the function is set the core `print` function calls this closure instead
 * of [printToConsole].
 *
 * This decouples the core library from the async library.
 */
let printToZone: Function = null;

/*external*/
//function printToConsole(line: string): void


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

// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

type  _AsyncCallback = () => void;

class _AsyncCallbackEntry {
    callback: _AsyncCallback;
    next: _AsyncCallbackEntry;

    constructor(callback: _AsyncCallback) {
        this.callback = callback;
    }
}

/** Head of single linked list of pending callbacks. */
let _nextCallback: _AsyncCallbackEntry;
/** Tail of single linked list of pending callbacks. */
let _lastCallback: _AsyncCallbackEntry;
/**
 * Tail of priority callbacks added by the currently executing callback.
 *
 * Priority callbacks are put at the beginning of the
 * callback queue, so that if one callback schedules more than one
 * priority callback, they are still enqueued in scheduling order.
 */
let _lastPriorityCallback: _AsyncCallbackEntry;
/**
 * Whether we are currently inside the callback loop.
 *
 * If we are inside the loop, we never need to schedule the loop,
 * even if adding a first element.
 */
let _isInCallbackLoop: bool = false;

function _microtaskLoop(): void {
    while (_nextCallback != null) {
        _lastPriorityCallback = null;
        let entry = _nextCallback;
        _nextCallback = entry.next;
        if (_nextCallback == null) _lastCallback = null;
        (entry.callback)();
    }
}

function _startMicrotaskLoop() {
    _isInCallbackLoop = true;
    try {
        // Moved to separate function because try-finally prevents
        // good optimization.
        _microtaskLoop();
    } finally {
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
function _scheduleAsyncCallback(callback: _AsyncCallback): void {
    let newEntry = new _AsyncCallbackEntry(callback);
    if (_nextCallback == null) {
        _nextCallback = _lastCallback = newEntry;
        if (!_isInCallbackLoop) {
            _AsyncRun._scheduleImmediate(_startMicrotaskLoop);
        }
    } else {
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
function _schedulePriorityAsyncCallback(callback: _AsyncCallback): void {
    if (_nextCallback == null) {
        _scheduleAsyncCallback(callback);
        _lastPriorityCallback = _lastCallback;
        return;
    }
    let entry = new _AsyncCallbackEntry(callback);
    if (_lastPriorityCallback == null) {
        entry.next = _nextCallback;
        _nextCallback = _lastPriorityCallback = entry;
    } else {
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
function scheduleMicrotask(callback: () => void): void {
    let currentZone: _Zone = DartZone.current as _Zone;
    if (identical(_ROOT_ZONE, currentZone)) {
        // No need to bind the callback. We know that the root's scheduleMicrotask
        // will be invoked in the root zone.
        _rootScheduleMicrotask(null, null, _ROOT_ZONE, callback);
        return;
    }
    let implementation = currentZone._scheduleMicrotask;
    if (identical(_ROOT_ZONE, implementation.zone) &&
        _ROOT_ZONE.inSameErrorZone(currentZone)) {
        _rootScheduleMicrotask(
            null, null, currentZone, currentZone.registerCallback(callback));
        return;
    }
    DartZone.current
        .scheduleMicrotask(DartZone.current.bindCallback(callback, {runGuarded: true}));
}

class _AsyncRun {
    /** Schedule the given callback before any other event in the event-loop. */

    /*external*/
    static _scheduleImmediate(callback: () => void): void {

    }
}

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

function _invokeErrorHandler(
    errorHandler: Function, error: any, stackTrace: DartStackTrace) {
    // can't distinguish ... use the first form always
    //if (errorHandler is ZoneBinaryCallback<dynamic, Null, Null>) {
    return errorHandler(error, stackTrace);
    //} else {
    //    ZoneUnaryCallback unaryErrorHandler = errorHandler;
    //    return unaryErrorHandler(error);
    // }
}

function _registerErrorHandler<R>(errorHandler: Function, zone: DartZone): Function {
    //if (errorHandler is ZoneBinaryCallback<dynamic, Null, Null>) {
    return zone.registerBinaryCallback<R, Object, DartStackTrace>(
        errorHandler as any /*=ZoneBinaryCallback<R, Object, StackTrace>*/);
    //} else {
    //    return zone.registerUnaryCallback<R, Object>(
    //        errorHandler as dynamic/*=ZoneUnaryCallback<R, Object>*/);
    //}
}

export {
    Future,
    DartCompleter,
    DartZoneSpecification,
    DartZone,
    DartTimer,
    runZoned,
    scheduleMicrotask,
    printToConsole
}