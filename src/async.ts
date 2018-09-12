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
import {
    ArgumentError,
    DartDuration,
    DartHashMap,
    DartIterable,
    DartIterableElementError,
    DartList,
    DartMap,
    DartSet,
    DartStackTrace,
    DartStringBuffer,
    identical,
    NullThrownError,
    StateError,
    UnsupportedError,
    RangeError,
    DartSink, DartIterator, DartError, DartObject
} from "./core";
import {$with, Abstract, AbstractProperty, bool, DartClass, defaultConstructor, defaultFactory, Implements, int, namedConstructor, namedFactory, Op, Operator, OPERATOR_INDEX_ASSIGN, OPERATOR_MINUS, With} from "./utils";
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
class Future<T> implements Promise<T> {
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
        /*super((resolve, reject) => {

        });*/
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

    // @ts-ignore
    then<S>(onValue: (value: T) => FutureOr<S>, _?: { onError?: Function }): Future<S>
    @Abstract
    // @ts-ignore
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): Promise<TResult1 | TResult2> {
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

    readonly [Symbol.toStringTag]: "Promise";
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
class _Future<T> implements Future<T> {


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

    // This constructor is used by async/await.
    constructor() {
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

    readonly [Symbol.toStringTag]: "Promise";
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

// Copyright (c) 2013, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

// -------------------------------------------------------------------
// Core Stream types
// -------------------------------------------------------------------

type  _TimerCallback = () => void;

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

@DartClass
class DartStream<T> implements AsyncIterable<T> {
    @defaultConstructor
    protected _init() {

    }

    constructor() {

    }

    /**
     * Internal use only. We do not want to promise that Stream stays const.
     *
     * If mixins become compatible with const constructors, we may use a
     * stream mixin instead of extending Stream from a const class.
     */
    @namedConstructor
    _internal() {

    }

    static _internal: new<T>() => DartStream<T>;

    /**
     * Creates an empty broadcast stream.
     *
     * This is a stream which does nothing except sending a done event
     * when it's listened to.
     */
    @namedFactory
    protected static _empty<T>(): DartStream<T> {
        return new _EmptyStream<T>();
    }

    static empty: new<T>() => DartStream<T>;

    /**
     * Creates a new single-subscription stream from the future.
     *
     * When the future completes, the stream will fire one event, either
     * data or error, and then close with a done-event.
     */
    @namedFactory
    protected static _fromFuture<T>(future: Future<T>): DartStream<T> {
        // Use the controller's buffering to fill in the value even before
        // the stream has a listener. For a single value, it's not worth it
        // to wait for a listener before doing the `then` on the future.
        let controller = new DartStreamController<T>({sync: true});
        future.then((value) => {
            (controller as _StreamController<T>)._add(value);
            (controller as _StreamController<T>)._closeUnchecked();
        }, {
            onError: (error, stackTrace) => {
                (controller as _StreamController<T>)._addError(error, stackTrace);
                (controller as _StreamController<T>)._closeUnchecked();
            }
        });
        return controller.stream;
    }

    static fromFuture: new<T>(future: Future<T>) => DartStream<T>;

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
    @namedFactory
    protected static _fromFutures<T>(futures: DartIterable<Future<T>>): DartStream<T> {
        let controller = new DartStreamController<T>({sync: true});
        let count = 0;
        let onValue = (value: T) => {
            if (!controller.isClosed) {
                (controller as _StreamController<T>)._add(value);
                if (--count == 0) (controller as _StreamController<T>)._closeUnchecked();
            }
        };
        let onError = (error, stack) => {
            if (!controller.isClosed) {
                (controller as _StreamController<T>)._addError(error, stack);
                if (--count == 0) (controller as _StreamController<T>)._closeUnchecked();
            }
        };
        // The futures are already running, so start listening to them immediately
        // (instead of waiting for the stream to be listened on).
        // If we wait, we might not catch errors in the futures in time.
        for (let future of futures) {
            count++;
            future.then(onValue, {onError: onError});
        }
        // Use schedule microtask since controller is sync.
        if (count == 0) scheduleMicrotask(controller.close.bind(controller));
        return controller.stream;
    }

    static fromFutures: new<T>(futures: DartIterable<Future<T>>) => DartStream<T>;

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
    @namedFactory
    static _fromIterable<T>(data: DartIterable<T>): DartStream<T> {
        return new _GeneratedStreamImpl<T>(
            () => new _IterablePendingEvents<T>(data));
    }

    static fromIterable: new<T>(data: DartIterable<T>) => DartStream<T>;

    /**
     * Creates a stream that repeatedly emits events at [period] intervals.
     *
     * The event values are computed by invoking [computation]. The argument to
     * this callback is an integer that starts with 0 and is incremented for
     * every event.
     *
     * If [computation] is omitted the event values will all be `null`.
     */
    @namedFactory
    static _periodic<T>(period: DartDuration, computation?: (computationCount: int) => T): DartStream<T> {
        let timer: DartTimer;
        let computationCount: int = 0;
        let controller: DartStreamController<T>;
        // Counts the time that the Stream was running (and not paused).
        let watch = new DartStopwatch();

        let sendEvent: () => void = () => {
            watch.reset();
            let data: T;
            if (computation != null) {
                try {
                    data = computation(computationCount++);
                } catch (e) {
                    let s = new DartStackTrace(e);
                    controller.addError(e, s);
                    return;
                }
            }
            controller.add(data);
        };

        let startPeriodicTimer = () => {
            //_dart.assert(timer == null);
            timer = new DartTimer.periodic(period, (timer: DartTimer) => {
                sendEvent();
            });
        };

        controller = new DartStreamController<T>({
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
                if (timer != null) timer.cancel();
                timer = null;
                return Future._nullFuture;
            }
        });
        return controller.stream;
    }

    static periodic: new<T>(period: DartDuration, computation?: (computationCount: int) => T) => DartStream<T>;

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
    @namedFactory
    protected static _eventTransformed<T>(
        source: DartStream<any>, mapSink: (sink: DartEventSink<T>) => DartEventSink<any>): DartStream<T> {
        return new _BoundSinkStream(source, mapSink);
    }

    static eventTransformed: new<T>(
        source: DartStream<any>, mapSink: (sink: DartEventSink<T>) => DartEventSink<any>) => DartStream<T>;

    /**
     * Whether this stream is a broadcast stream.
     */
    get isBroadcast(): bool {
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
    asBroadcastStream(
        _?: {
            onListen?: (subscription: DartStreamSubscription<T>) => any,
            onCancel?: (subscription: DartStreamSubscription<T>) => any
        }): DartStream<T> {
        let {onListen, onCancel} = Object.assign({}, _);
        return new _AsBroadcastStream<T>(this, onListen, onCancel);
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
    @Abstract
    listen(onData: (event: T) => any,
           _?: { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
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
    where(test: (event: T) => bool): DartStream<T> {
        return new _WhereStream<T>(this, test);
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
    map<S>(convert: (event: T) => S): DartStream<S> {
        return new _MapStream<T, S>(this, convert);
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
    asyncMap<E>(convert: (event: T) => FutureOr<E>): DartStream<E> {
        let controller: DartStreamController<E>;
        let subscription: DartStreamSubscription<T>;

        let onListen = () => {
            let add = controller.add;
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink: _EventSink<E> = controller as any/*=_EventSink<E>*/;
            let addError = eventSink._addError;
            subscription = this.listen((event: T) => {
                let newValue: FutureOr<E>;
                try {
                    newValue = convert(event);
                } catch (e) {
                    let s = new DartStackTrace(e);
                    controller.addError(e, s);
                    return;
                }
                if (_dart.is(newValue, Future)) {
                    subscription.pause();
                    (newValue as Future<E>)
                        .then(add, {onError: addError})
                        .whenComplete(subscription.resume);
                } else {
                    controller.add(newValue as any/*=E*/);
                }
            }, {onError: addError, onDone: controller.close});
        };

        if (this.isBroadcast) {
            controller = new DartStreamController.broadcast<E>({
                onListen: onListen,
                onCancel: () => {
                    subscription.cancel();
                },
                sync: true
            });
        } else {
            controller = new DartStreamController<E>({
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
    asyncExpand<E>(convert: (event: T) => DartStream<E>): DartStream<E> {
        let controller: DartStreamController<E>;
        let subscription: DartStreamSubscription<T>;
        let onListen = () => {
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink: _EventSink<E> = controller as any/*=_EventSink<E>*/;
            subscription = this.listen((event: T) => {
                    let newStream: DartStream<E>;
                    try {
                        newStream = convert(event);
                    } catch (e) {
                        let s = new DartStackTrace(e);
                        controller.addError(e, s);
                        return;
                    }
                    if (newStream != null) {
                        subscription.pause();
                        controller.addStream(newStream).whenComplete(subscription.resume);
                    }
                },
                {
                    onError: eventSink._addError, // Avoid Zone error replacement.
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
        } else {
            controller = new DartStreamController<E>({
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
    handleError(onError: Function, _?: { test: (error: any) => bool }): DartStream<T> {
        let {test} = Object.assign({}, _);
        return new _HandleErrorStream<T>(this, onError, test);
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
    expand<S>(convert: (value: T) => DartIterable<S>): DartStream<S> {
        return new _ExpandStream<T, S>(this, convert);
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
    pipe(streamConsumer: DartStreamConsumer<T>): Future<any> {
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
    transform<S>(streamTransformer: DartStreamTransformer<T, S>): DartStream<S> {
        return streamTransformer.bind(this);
    }

    /**
     * Reduces a sequence of values by repeatedly applying [combine].
     */
    reduce(combine: (previous: T, element: T) => T): Future<T> {
        let result = new _Future<T>();
        let seenFirst = false;
        let value: T;
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (element: T) => {
                if (seenFirst) {
                    _runUserCode(() => combine(value, element), (newValue: T) => {
                        value = newValue;
                    }, _cancelAndErrorClosure(subscription, result));
                } else {
                    value = element;
                    seenFirst = true;
                }
            }, {
                onError: result._completeError,
                onDone: () => {
                    if (!seenFirst) {
                        try {
                            throw DartIterableElementError.noElement();
                        } catch (e) {
                            let s = new DartStackTrace(e);
                            _completeWithErrorCallback(result, e, s);
                        }
                    } else {
                        result._complete(value);
                    }
                },
                cancelOnError: true
            });
        return result;
    }

    /** Reduces a sequence of values by repeatedly applying [combine]. */
    fold<S>(initialValue: S, combine: (previous: S, element: T) => S): Future<S> {
        let result = new _Future<S>();
        let value = initialValue;
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen((element: T) => {
            _runUserCode(() => combine(value, element), (newValue: S) => {
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
    join(separator?: string): Future<String> {
        separator = separator || "";
        let result = new _Future<String>();
        let buffer = new DartStringBuffer();
        let subscription: DartStreamSubscription<any>;
        let first = true;
        subscription = this.listen((element: T) => {
            if (!first) {
                buffer.write(separator);
            }
            first = false;
            try {
                buffer.write(element);
            } catch (e) {
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
    contains(needle: any): Future<bool> {
        let future = new _Future<bool>();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (element: T) => {
                _runUserCode(() => (_dart.equals(element, needle)), (isMatch: bool) => {
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
    forEach(action: (element: T) => any): Future<any> {
        let future = new _Future();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (element: T) => {
                // TODO(floitsch): the type should be 'void' and inferred.
                _runUserCode<any>(() => action(element), (_) => {
                    },
                    _cancelAndErrorClosure(subscription, future));
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
    every(test: (element: T) => bool): Future<bool> {
        let future = new _Future<bool>();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (element: T) => {
                _runUserCode(() => test(element), (isMatch: bool) => {
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
    any(test: (element: T) => bool): Future<bool> {
        let future = new _Future<bool>();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (element: T) => {
                _runUserCode(() => test(element), (isMatch: bool) => {
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
    get length(): Future<int> {
        let future = new _Future<int>();
        let count = 0;
        this.listen(
            (_) => {
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
    get isEmpty(): Future<bool> {
        let future = new _Future<bool>();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (_) => {
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
    toList(): Future<DartList<T>> {
        let result = new DartList<T>();
        let future = new _Future<DartList<T>>();
        this.listen(
            (data: T) => {
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
    toSet(): Future<DartSet<T>> {
        let result = new DartSet<T>();
        let future = new _Future<DartSet<T>>();
        this.listen(
            (data: T) => {
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
    drain<E>(futureValue?: E): Future<E> {
        return this.listen(null, {cancelOnError: true}).asFuture<E>(futureValue);
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
    take(count: int): DartStream<T> {
        return new _TakeStream<T>(this, count);
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
    takeWhile(test: (element: T) => bool): DartStream<T> {
        return new _TakeWhileStream<T>(this, test);
    }

    /**
     * Skips the first [count] data events from this stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * For a broadcast stream, the events are only counted from the time
     * the returned stream is listened to.
     */
    skip(count: int): DartStream<T> {
        return new _SkipStream<T>(this, count);
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
    skipWhile(test: (element: T) => bool): DartStream<T> {
        return new _SkipWhileStream<T>(this, test);
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
    distinct(equals?: (previous: T, next: T) => bool): DartStream<T> {
        return new _DistinctStream<T>(this, equals);
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
    get first(): Future<T> {
        let future = new _Future<T>();
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (value: T) => {
                _cancelAndValue(subscription, future, value);
            }, {
                onError: future._completeError,
                onDone: () => {
                    try {
                        throw DartIterableElementError.noElement();
                    } catch (e) {
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
    get last(): Future<T> {
        let future = new _Future<T>();
        let result: T = null;
        let foundResult = false;
        this.listen(
            (value: T) => {
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
                    } catch (e) {
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
    get single(): Future<T> {
        let future = new _Future<T>();
        let result: T = null;
        let foundResult = false;
        let subscription: DartStreamSubscription<any>;
        subscription = this.listen(
            (value: T) => {
                if (foundResult) {
                    // This is the second element we get.
                    try {
                        throw DartIterableElementError.tooMany();
                    } catch (e) {
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
                    } catch (e) {
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
    firstWhere(test: (element: T) => bool, _?: { defaultValue?: () => T }): Future<T> {
        let {defaultValue} = Object.assign({}, _);
        let future = new _Future<T>();
        let subscription: DartStreamSubscription<T>;
        subscription = this.listen(
            (value: T) => {
                _runUserCode(() => test(value), (isMatch: bool) => {
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
                    } catch (e) {
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
    lastWhere(test: (element: T) => bool, _?: { defaultValue?: () => T }): Future<T> {
        let {defaultValue} = Object.assign({}, _);
        let future = new _Future<T>();
        let result: T = null;
        let foundResult = false;
        let subscription: DartStreamSubscription<T>;
        subscription = this.listen(
            (value: T) => {
                _runUserCode(() => true == test(value), (isMatch: bool) => {
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
                    } catch (e) {
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
    singleWhere(test: (element: T) => bool): Future<T> {
        let future = new _Future<T>();
        let result: T = null;
        let foundResult = false;
        let subscription: DartStreamSubscription<T>;
        subscription = this.listen(
            (value: T) => {
                _runUserCode(() => true == test(value), (isMatch: bool) => {
                    if (isMatch) {
                        if (foundResult) {
                            try {
                                throw DartIterableElementError.tooMany();
                            } catch (e) {
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
                    } catch (e) {

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
    elementAt(index: int): Future<T> {
        if (_dart.is(index, 'int') || index < 0) throw new ArgumentError(index);
        let future = new _Future<T>();
        let subscription: DartStreamSubscription<T>;
        let elementIndex = 0;
        subscription = this.listen(
            (value: T) => {
                if (index == elementIndex) {
                    _cancelAndValue(subscription, future, value);
                    return;
                }
                elementIndex += 1;
            }, {
                onError: future._completeError,
                onDone: () => {
                    future._completeError(
                        new RangeError.index(index, this, "index", null, elementIndex));
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
    timeout(timeLimit: DartDuration, _?: { onTimeout: (sink: DartEventSink<T>) => any }): DartStream<T> {
        let {onTimeout} = Object.assign({}, _);
        let controller: DartStreamController<T>;
        // The following variables are set on listen.
        let subscription: DartStreamSubscription<T>;
        let timer: DartTimer;
        let zone: DartZone;
        let timeout: _TimerCallback;

        let onData = (event: T): void => {
            timer.cancel();
            controller.add(event);
            timer = zone.createTimer(timeLimit, timeout);
        };

        let onError = (error, stackTrace: DartStackTrace) => {
            timer.cancel();
            //assert(controller is _StreamController ||
            //controller is _BroadcastStreamController);
            let eventSink = controller;
            (eventSink as _StreamController<any>)._addError(error, stackTrace); // Avoid Zone error replacement.
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
                    controller.addError(
                        new DartTimeoutException("No stream event", timeLimit), null);
                };
            } else {
                // TODO(floitsch): the return type should be 'void', and the type
                // should be inferred.
                let registeredOnTimeout =
                    zone.registerUnaryCallback<any, DartEventSink<T>>(onTimeout);
                let wrapper = new _ControllerEventSinkWrapper<T>(null);
                timeout = () => {
                    wrapper._sink = controller; // Only valid during call.
                    zone.runUnaryGuarded(registeredOnTimeout, wrapper);
                    wrapper._sink = null;
                };
            }

            subscription = this.listen(onData, {onError: onError, onDone: onDone});
            timer = zone.createTimer(timeLimit, timeout);
        };

        let onCancel = () => {
            timer.cancel();
            let result = subscription.cancel();
            subscription = null;
            return result;
        };

        controller = this.isBroadcast
            ? new _SyncBroadcastStreamController<T>(onListen, onCancel)
            : new _SyncStreamController<T>(onListen, () => {
                // Don't null the timer, onCancel may call cancel again.
                timer.cancel();
                subscription.pause();
            }, () => {
                subscription.resume();
                timer = zone.createTimer(timeLimit, timeout);
            }, onCancel);
        return controller.stream;
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return new DartStreamIterator(this);
    }
}

/**
 * A subscription on events from a [Stream].
 *
 * When you listen on a [Stream] using [Stream.listen],
 * a [StreamSubscription] object is returned.
 *
 * The subscription provides events to the listener,
 * and holds the callbacks used to handle the events.
 * The subscription can also be used to unsubscribe from the events,
 * or to temporarily pause the events from the stream.
 */
interface DartStreamSubscription<T> {
    /**
     * Cancels this subscription.
     *
     * After this call, the subscription no longer receives events.
     *
     * The stream may need to shut down the source of events and clean up after
     * the subscription is canceled.
     *
     * Returns a future that is completed once the stream has finished
     * its cleanup.
     *
     * For historical reasons, may also return `null` if no cleanup was necessary.
     * Returning `null` is deprecated and should be avoided.
     *
     * Typically, futures are returned when the stream needs to release resources.
     * For example, a stream might need to close an open file (as an asynchronous
     * operation). If the listener wants to delete the file after having
     * canceled the subscription, it must wait for the cleanup future to complete.
     *
     * A returned future completes with a `null` value.
     * If the cleanup throws, which it really shouldn't, the returned future
     * completes with that error.
     */
    cancel(): Future<any>;

    /**
     * Set or override the data event handler of this subscription.
     *
     * This method overrides the handler that has been set at the invocation of
     * [Stream.listen].
     */
    onData(handleData: (data: T) => any): void;

    /**
     * Set or override the error event handler of this subscription.
     *
     * This method overrides the handler that has been set at the invocation of
     * [Stream.listen] or by calling [asFuture].
     */
    onError(handleError: Function): void;

    /**
     * Set or override the done event handler of this subscription.
     *
     * This method overrides the handler that has been set at the invocation of
     * [Stream.listen] or by calling [asFuture].
     */
    onDone(handleDone: () => any): void;

    /**
     * Request that the stream pauses events until further notice.
     *
     * While paused, the subscription will not fire any events.
     * If it receives events from its source, they will be buffered until
     * the subscription is resumed.
     * The underlying source is usually informed about the pause,
     * so it can stop generating events until the subscription is resumed.
     *
     * To avoid buffering events on a broadcast stream, it is better to
     * cancel this subscription, and start to listen again when events
     * are needed.
     *
     * If [resumeSignal] is provided, the stream will undo the pause
     * when the future completes. If the future completes with an error,
     * the stream will resume, but the error will not be handled!
     *
     * A call to [resume] will also undo a pause.
     *
     * If the subscription is paused more than once, an equal number
     * of resumes must be performed to resume the stream.
     *
     * Currently DOM streams silently drop events when the stream is paused. This
     * is a bug and will be fixed.
     */
    pause(resumeSignal?: Future<any>): void;

    /**
     * Resume after a pause.
     */
    resume(): void;

    /**
     * Returns true if the [StreamSubscription] is paused.
     */
    readonly isPaused: bool;

    /**
     * Returns a future that handles the [onDone] and [onError] callbacks.
     *
     * This method *overwrites* the existing [onDone] and [onError] callbacks
     * with new ones that complete the returned future.
     *
     * In case of an error the subscription will automatically cancel (even
     * when it was listening with `cancelOnError` set to `false`).
     *
     * In case of a `done` event the future completes with the given
     * [futureValue].
     */
    asFuture<E>(futureValue?: E): Future<E>;
}

/**
 * A [Sink] that supports adding errors.
 *
 * This makes it suitable for capturing the results of asynchronous
 * computations, which can complete with a value or an error.
 *
 * The [EventSink] has been designed to handle asynchronous events from
 * [Stream]s. See, for example, [Stream.eventTransformed] which uses
 * `EventSink`s to transform events.
 */
interface DartEventSink<T> extends DartSink<T> {
    /**
     * Adds a data [event] to the sink.
     *
     * Must not be called on a closed sink.
     */
    add(event: T): void;

    /**
     * Adds an [error] to the sink.
     *
     * Must not be called on a closed sink.
     */
    addError(error: any, stackTrace?: DartStackTrace): void;

    /**
     * Closes the sink.
     *
     * Calling this method more than once is allowed, but does nothing.
     *
     * Neither [add] nor [addError] must be called after this method.
     */
    close(): void;
}

/** [Stream] wrapper that only exposes the [Stream] interface. */
@DartClass
class DartStreamView<T> extends DartStream<T> {
    _stream: DartStream<T>;

    constructor(stream: DartStream<T>) {
        super();
    }

    @defaultConstructor
    protected _DartStreamView(stream: DartStream<T>) {
        this._stream = stream;
        super._internal();
    }

    get isBroadcast(): bool {
        return this._stream.isBroadcast;
    }

    asBroadcastStream(
        _?: {
            onListen?: (subscription: DartStreamSubscription<T>) => any,
            onCancel?: (subscription: DartStreamSubscription<T>) => any
        }): DartStream<T> {
        return this._stream.asBroadcastStream(_);
    }

    listen(onData: (value: T) => any, _?:
        { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
        return this._stream.listen(onData, _);
    }
}

/**
 * Abstract interface for a "sink" accepting multiple entire streams.
 *
 * A consumer can accept a number of consecutive streams using [addStream],
 * and when no further data need to be added, the [close] method tells the
 * consumer to complete its work and shut down.
 *
 * The [Stream.pipe] accepts a `StreamConsumer` and will pass the stream
 * to the consumer's [addStream] method. When that completes, it will
 * call [close] and then complete its own returned future.
 */
interface DartStreamConsumer<S> {
    /**
     * Consumes the elements of [stream].
     *
     * Listens on [stream] and does something for each event.
     *
     * Returns a future which is completed when the stream is done being added,
     * and the consumer is ready to accept a new stream.
     * No further calls to [addStream] or [close] should happen before the
     * returned future has completed.
     *
     * The consumer may stop listening to the stream after an error,
     * it may consume all the errors and only stop at a done event,
     * or it may be canceled early if the receiver don't want any further events.
     *
     * If the consumer stops listening because of some error preventing it
     * from continuing, it may report this error in the returned future,
     * otherwise it will just complete the future with `null`.
     */
    addStream(stream: DartStream<S>): Future<any>;

    /**
     * Tells the consumer that no further streams will be added.
     *
     * This allows the consumer to complete any remaining work and release
     * resources that are no longer needed
     *
     * Returns a future which is completed when the consumer has shut down.
     * If cleaning up can fail, the error may be reported in the returned future,
     * otherwise it completes with `null`.
     */
    close(): Future<any>;
}

/**
 * A object that accepts stream events both synchronously and asynchronously.
 *
 * A [StreamSink] combines the methods from [StreamConsumer] and [EventSink].
 *
 * The [EventSink] methods can't be used while the [addStream] is called.
 * As soon as the [addStream]'s [Future] completes with a value, the
 * [EventSink] methods can be used again.
 *
 * If [addStream] is called after any of the [EventSink] methods, it'll
 * be delayed until the underlying system has consumed the data added by the
 * [EventSink] methods.
 *
 * When [EventSink] methods are used, the [done] [Future] can be used to
 * catch any errors.
 *
 * When [close] is called, it will return the [done] [Future].
 */
interface DartStreamSink<S> extends DartEventSink<S>, DartStreamConsumer<S> {
    /**
     * Tells the stream sink that no further streams will be added.
     *
     * This allows the stream sink to complete any remaining work and release
     * resources that are no longer needed
     *
     * Returns a future which is completed when the stream sink has shut down.
     * If cleaning up can fail, the error may be reported in the returned future,
     * otherwise it completes with `null`.
     *
     * Returns the same future as [done].
     *
     * The stream sink may close before the [close] method is called, either due
     * to an error or because it is itself providing events to someone who has
     * stopped listening. In that case, the [done] future is completed first,
     * and the `close` method will return the `done` future when called.
     *
     * Unifies [StreamConsumer.close] and [EventSink.close] which both mark their
     * object as not expecting any further events.
     */
    close(): Future<any>;

    /**
     * Return a future which is completed when the [StreamSink] is finished.
     *
     * If the `StreamSink` fails with an error,
     * perhaps in response to adding events using [add], [addError] or [close],
     * the [done] future will complete with that error.
     *
     * Otherwise, the returned future will complete when either:
     *
     * * all events have been processed and the sink has been closed, or
     * * the sink has otherwise been stopped from handling more events
     *   (for example by cancelling a stream subscription).
     */
    readonly done: Future<any>;
}

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
@DartClass
class DartStreamTransformer<S, T> {
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
    @defaultFactory
    protected static _create<S, T>(onListen: (stream: DartStream<S>, cancelOnError: bool) => DartStreamSubscription<T>): DartStreamTransformer<S, T> {
        return new _StreamSubscriptionTransformer<S, T>();
    }

    constructor(onListen: (stream: DartStream<S>, cancelOnError: bool) => DartStreamSubscription<T>) {
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
    @namedFactory
    protected static _fromHandlers<S, T>(
        _?: {
            handleData?: (data: S, sink: DartEventSink<T>) => any,
            handleError?: (error: any, stackTrace: DartStackTrace, sink: DartEventSink<T>) => any,
            handleDone?: (sink: DartEventSink<T>) => any
        }): DartStreamTransformer<S, T> {
        return new _StreamHandlerTransformer<S, T>(_);
    }

    static fromHandlers: new<S, T>(
        _?: {
            handleData?: (data: S, sink: DartEventSink<T>) => any,
            handleError?: (error: any, stackTrace: DartStackTrace, sink: DartEventSink<T>) => any,
            handleDone?: (sink: DartEventSink<T>) => any
        }) => DartStreamTransformer<S, T>;

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
    @Abstract
    bind(stream: DartStream<S>): DartStream<T> {
        throw 'abstract';
    }
}

/**
 * An [Iterator] like interface for the values of a [Stream].
 *
 * This wraps a [Stream] and a subscription on the stream. It listens
 * on the stream, and completes the future returned by [moveNext] when the
 * next value becomes available.
 *
 * The stream may be paused between calls to [moveNext].
 */
@DartClass
class DartStreamIterator<T> implements AsyncIterator<T> {
    /** Create a [StreamIterator] on [stream]. */
    @defaultFactory
    protected static _create<T>(stream: DartStream<T>): DartStreamIterator<T> {
        // TODO(lrn): use redirecting factory constructor when type
        // arguments are supported.
        return new _StreamIterator<T>(stream);
    }

    constructor(stream: DartStream<T>) {
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
    @Abstract
    moveNext(): Future<bool> {
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
    @AbstractProperty
    get current(): T {
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
    @Abstract
    cancel(): Future<any> {
        throw 'abstract';
    }

    async next(value?: any): Promise<IteratorResult<T>> {
        let hasNext = await this.moveNext();
        return {
            done: !hasNext,
            value: this.current
        };
    }
}

/**
 * Wraps an [_EventSink] so it exposes only the [EventSink] interface.
 */
class _ControllerEventSinkWrapper<T> implements DartEventSink<T> {
    _sink: DartEventSink<T>;

    constructor(_sink: DartEventSink<T>) {
        this._sink = _sink;
    }

    add(data: T) {
        this._sink.add(data);
    }

    addError(error, stackTrace?: DartStackTrace) {
        this._sink.addError(error, stackTrace);
    }

    close() {
        this._sink.close();
    }
}


// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

/** Abstract and private interface for a place to put events. */
interface _EventSink<T> {
    _add(data: T): void;

    _addError(error: any, stackTrace: DartStackTrace): void;

    _close(): void;
}

/**
 * Abstract and private interface for a place to send events.
 *
 * Used by event buffering to finally dispatch the pending event, where
 * [_EventSink] is where the event first enters the stream subscription,
 * and may yet be buffered.
 */
interface _EventDispatch<T> {
    _sendData(data: T): void;

    _sendError(error: any, stackTrace: DartStackTrace): void;

    _sendDone(): void;
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
class _BufferingStreamSubscription<T>
    implements DartStreamSubscription<T>, _EventSink<T>, _EventDispatch<T> {
    /** The `cancelOnError` flag from the `listen` call. */
    static _STATE_CANCEL_ON_ERROR: int = 1;
    /**
     * Whether the "done" event has been received.
     * No further events are accepted after this.
     */
    static _STATE_CLOSED: int = 2;
    /**
     * Set if the input has been asked not to send events.
     *
     * This is not the same as being paused, since the input will remain paused
     * after a call to [resume] if there are pending events.
     */
    static _STATE_INPUT_PAUSED: int = 4;
    /**
     * Whether the subscription has been canceled.
     *
     * Set by calling [cancel], or by handling a "done" event, or an "error" event
     * when `cancelOnError` is true.
     */
    static _STATE_CANCELED: int = 8;
    /**
     * Set when either:
     *
     *   * an error is sent, and [cancelOnError] is true, or
     *   * a done event is sent.
     *
     * If the subscription is canceled while _STATE_WAIT_FOR_CANCEL is set, the
     * state is unset, and no furher events must be delivered.
     */
    static _STATE_WAIT_FOR_CANCEL: int = 16;
    static _STATE_IN_CALLBACK: int = 32;
    static _STATE_HAS_PENDING: int = 64;
    static _STATE_PAUSE_COUNT: int = 128;

    /* Event handlers provided in constructor. */
    _onData: _DataHandler<T>;
    _onError: Function;
    _onDone: _DoneHandler;
    _zone: DartZone = DartZone.current;

    /** Bit vector based on state-constants above. */
    _state: int;

    // TODO(floitsch): reuse another field
    /** The future [_onCancel] may return. */
    _cancelFuture: Future<any>;

    /**
     * Queue of pending events.
     *
     * Is created when necessary, or set in constructor for preconfigured events.
     */
    _pending: _PendingEvents<T>;

    constructor(
        onData: (data: T) => any, onError: Function, onDone: () => any, cancelOnError: bool) {
        this._state = (cancelOnError ? _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR : 0)
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
    _setPendingEvents(pendingEvents: _PendingEvents<T>): void {
        //assert(_pending == null);
        if (pendingEvents == null) return;
        this._pending = pendingEvents;
        if (!pendingEvents.isEmpty) {
            this._state |= _BufferingStreamSubscription._STATE_HAS_PENDING;
            this._pending.schedule(this);
        }
    }

    // StreamSubscription interface.

    onData(handleData: (event: T) => any): void {
        if (handleData == null) handleData = _nullDataHandler;
        // TODO(floitsch): the return type should be 'void', and the type
        // should be inferred.
        this._onData = this._zone.registerUnaryCallback<any, T>(handleData);
    }

    onError(handleError: Function): void {
        if (handleError == null) handleError = _nullErrorHandler;
        // We are not allowed to use 'void' as type argument for the generic type,
        // so we use 'dynamic' instead.
        this._onError = _registerErrorHandler<any>(handleError, this._zone);
    }

    onDone(handleDone: () => any): void {
        if (handleDone == null) handleDone = _nullDoneHandler;
        this._onDone = this._zone.registerCallback(handleDone);
    }

    pause(resumeSignal: Future<any>): void {
        if (this._isCanceled) return;
        let wasPaused = this._isPaused;
        let wasInputPaused = this._isInputPaused;
        // Increment pause count and mark input paused (if it isn't already).
        this._state = (this._state + _BufferingStreamSubscription._STATE_PAUSE_COUNT) | _BufferingStreamSubscription._STATE_INPUT_PAUSED;
        if (resumeSignal != null) resumeSignal.whenComplete(() => this.resume());
        if (!wasPaused && this._pending != null) this._pending.cancelSchedule();
        if (!wasInputPaused && !this._inCallback) this._guardCallback(this._onPause.bind(this));
    }

    resume(): void {
        if (this._isCanceled) return;
        if (this._isPaused) {
            this._decrementPauseCount();
            if (!this._isPaused) {
                if (this._hasPending && !this._pending.isEmpty) {
                    // Input is still paused.
                    this._pending.schedule(this);
                } else {
                    //assert(_mayResumeInput);
                    this._state &= ~_BufferingStreamSubscription._STATE_INPUT_PAUSED;
                    if (!this._inCallback) this._guardCallback(this._onResume.bind(this));
                }
            }
        }
    }

    cancel(): Future<any> {
        // The user doesn't want to receive any further events. If there is an
        // error or done event pending (waiting for the cancel to be done) discard
        // that event.
        this._state &= ~_BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
        if (!this._isCanceled) {
            this._cancel();
        }
        return this._cancelFuture || Future._nullFuture;
    }

    asFuture<E>(futureValue?: E): Future<E> {
        let result = new _Future<E>();

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
            } else {
                result._completeError(error, stackTrace);
            }
        };

        return result;
    }

// State management.

    get _isInputPaused(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_INPUT_PAUSED) != 0;
    }

    get _isClosed(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_CLOSED) != 0;
    }

    get _isCanceled(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_CANCELED) != 0;
    }

    get _waitsForCancel(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL) != 0;
    }

    get _inCallback(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_IN_CALLBACK) != 0;
    }

    get _hasPending(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_HAS_PENDING) != 0;
    }

    get _isPaused(): bool {
        return this._state >= _BufferingStreamSubscription._STATE_PAUSE_COUNT;
    }

    get _canFire(): bool {
        return this._state < _BufferingStreamSubscription._STATE_IN_CALLBACK;
    }

    get _mayResumeInput(): bool {
        return !this._isPaused && (this._pending == null || this._pending.isEmpty);
    }

    get _cancelOnError(): bool {
        return (this._state & _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR) != 0;
    }

    get isPaused(): bool {
        return this._isPaused;
    }

    _cancel(): void {
        this._state |= _BufferingStreamSubscription._STATE_CANCELED;
        if (this._hasPending) {
            this._pending.cancelSchedule();
        }
        if (!this._inCallback) this._pending = null;
        this._cancelFuture = this._onCancel();
    }

    /**
     * Decrements the pause count.
     *
     * Does not automatically unpause the input (call [_onResume]) when
     * the pause count reaches zero. This is handled elsewhere, and only
     * if there are no pending events buffered.
     */
    _decrementPauseCount(): void {
        //assert(_isPaused);
        this._state -= _BufferingStreamSubscription._STATE_PAUSE_COUNT;
    }

    // _EventSink interface.

    _add(data: T): void {
        //assert(!_isClosed);
        if (this._isCanceled) return;
        if (this._canFire) {
            this._sendData(data);
        } else {
            this._addPending(new _DelayedData<T>(data));
        }
    }

    _addError(error: any, stackTrace: DartStackTrace): void {
        if (this._isCanceled) return;
        if (this._canFire) {
            this._sendError(error, stackTrace); // Reports cancel after sending.
        } else {
            this._addPending(new _DelayedError(error, stackTrace));
        }
    }

    _close(): void {
        //assert(!_isClosed);
        if (this._isCanceled) return;
        this._state |= _BufferingStreamSubscription._STATE_CLOSED;
        if (this._canFire) {
            this._sendDone();
        } else {
            this._addPending(new _DelayedDone());
        }
    }

    // Hooks called when the input is paused, unpaused or canceled.
    // These must not throw. If overwritten to call user code, include suitable
    // try/catch wrapping and send any errors to
    // [_Zone.current.handleUncaughtError].
    _onPause(): void {
        //assert(_isInputPaused);
    }

    _onResume(): void {
        //assert(!_isInputPaused);
    }

    _onCancel(): Future<any> {
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
    _addPending(event: _DelayedEvent<any>): void {
        let pending = this._pending;
        if (this._pending == null) {
            pending = this._pending = new _StreamImplEvents<T>();
        }
        (pending as _StreamImplEvents<T>).add(event);
        if (!this._hasPending) {
            this._state |= _BufferingStreamSubscription._STATE_HAS_PENDING;
            if (!this._isPaused) {
                this._pending.schedule(this);
            }
        }
    }

    /* _EventDispatch interface. */

    _sendData(data: T): void {
        //assert(!_isCanceled);
        //assert(!_isPaused);
        //assert(!_inCallback);
        let wasInputPaused = this._isInputPaused;
        this._state |= _BufferingStreamSubscription._STATE_IN_CALLBACK;
        this._zone.runUnaryGuarded(this._onData, data);
        this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        this._checkState(wasInputPaused);
    }

    _sendError(error: any, stackTrace: DartStackTrace): void {
        // assert(!_isCanceled);
        // assert(!_isPaused);
        // assert(!_inCallback);
        let wasInputPaused = this._isInputPaused;

        let sendError = () => {
            // If the subscription has been canceled while waiting for the cancel
            // future to finish we must not report the error.
            if (this._isCanceled && !this._waitsForCancel) return;
            this._state |= _BufferingStreamSubscription._STATE_IN_CALLBACK;
            // TODO(floitsch): this dynamic should be 'void'.
            //if (_dart.is(this._onError is ZoneBinaryCallback<dynamic, Object, StackTrace>) {
            let errorCallback: ZoneBinaryCallback<any, any, DartStackTrace> = this._onError as any/*=ZoneBinaryCallback<dynamic, Object, StackTrace>*/;
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
            if (_dart.is(this._cancelFuture, Future) &&
                !identical(this._cancelFuture, Future._nullFuture)) {
                this._cancelFuture.whenComplete(sendError);
            } else {
                sendError();
            }
        } else {
            sendError();
            // Only check state if not cancelOnError.
            this._checkState(wasInputPaused);
        }
    }

    _sendDone(): void {
        //assert(!_isCanceled);
        // assert(!_isPaused);
        // assert(!_inCallback);

        let sendDone = () => {
            // If the subscription has been canceled while waiting for the cancel
            // future to finish we must not report the done event.
            if (!this._waitsForCancel) return;
            this._state |= (_BufferingStreamSubscription._STATE_CANCELED | _BufferingStreamSubscription._STATE_CLOSED | _BufferingStreamSubscription._STATE_IN_CALLBACK);
            this._zone.runGuarded(this._onDone);
            this._state &= ~_BufferingStreamSubscription._STATE_IN_CALLBACK;
        };

        this._cancel();
        this._state |= _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
        if (_dart.is(this._cancelFuture, Future) &&
            !identical(this._cancelFuture, Future._nullFuture)) {
            this._cancelFuture.whenComplete(sendDone);
        } else {
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
    _guardCallback(callback: () => any): void {
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
    _checkState(wasInputPaused: bool): void {
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
            if (wasInputPaused == isInputPaused) break;
            this._state ^= _BufferingStreamSubscription._STATE_IN_CALLBACK;
            if (isInputPaused) {
                this._onPause();
            } else {
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

// -------------------------------------------------------------------
// Common base class for single and multi-subscription streams.
// -------------------------------------------------------------------
@DartClass
class _StreamImpl<T> extends DartStream<T> {
    @defaultConstructor
    protected _init() {
        super._init();
    }

    constructor() {
        super();
    }

    // ------------------------------------------------------------------
    // Stream interface.

    listen(onData: (data: T) => any,
           _?: { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
        let {onError, onDone, cancelOnError} = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        let subscription =
            this._createSubscription(onData, onError, onDone, cancelOnError);
        this._onListen(subscription);
        return subscription;
    }

// -------------------------------------------------------------------
    /** Create a subscription object. Called by [subcribe]. */
    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return new _BufferingStreamSubscription<T>(onData, onError, onDone, cancelOnError);
    }

    /** Hook called when the subscription has been created. */
    _onListen(subscription: DartStreamSubscription<any>): void {
    }
}

/** Superclass for provider of pending events. */
@DartClass
class _PendingEvents<T> {
    // No async event has been scheduled.
    static _STATE_UNSCHEDULED = 0;
    // An async event has been scheduled to run a function.
    static _STATE_SCHEDULED = 1;
    // An async event has been scheduled, but it will do nothing when it runs.
    // Async events can't be preempted.
    static _STATE_CANCELED = 3;

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
    _state = _PendingEvents._STATE_UNSCHEDULED;

    @AbstractProperty
    get isEmpty(): bool {
        throw 'abstract';
    }

    get isScheduled(): bool {
        return this._state == _PendingEvents._STATE_SCHEDULED;
    }

    get _eventScheduled(): bool {
        return this._state >= _PendingEvents._STATE_SCHEDULED;
    }

    /**
     * Schedule an event to run later.
     *
     * If called more than once, it should be called with the same dispatch as
     * argument each time. It may reuse an earlier argument in some cases.
     */
    schedule(dispatch: _EventDispatch<T>): void {
        if (this.isScheduled) return;
        // assert(!isEmpty);
        if (this._eventScheduled) {
            //assert(_state == _PendingEvents._STATE_CANCELED);
            this._state = _PendingEvents._STATE_SCHEDULED;
            return;
        }
        scheduleMicrotask(() => {
            let oldState = this._state;
            this._state = _PendingEvents._STATE_UNSCHEDULED;
            if (oldState == _PendingEvents._STATE_CANCELED) return;
            this.handleNext(dispatch);
        });
        this._state = _PendingEvents._STATE_SCHEDULED;
    }

    cancelSchedule(): void {
        if (this.isScheduled) this._state = _PendingEvents._STATE_CANCELED;
    }

    @Abstract
    handleNext(dispatch: _EventDispatch<T>): void {
        throw 'abstract';
    }

    /** Throw away any pending events and cancel scheduled events. */
    @Abstract
    clear(): void {
        throw 'abstract'
    }
}


type  _EventGenerator<T> = () => _PendingEvents<T>;

/** Stream that generates its own events. */
@DartClass
class _GeneratedStreamImpl<T> extends _StreamImpl<T> {
    _pending: _EventGenerator<T>;
    _isUsed: bool = false;

    /**
     * Initializes the stream to have only the events provided by a
     * [_PendingEvents].
     *
     * A new [_PendingEvents] must be generated for each listen.
     */
    constructor(_peding: _EventGenerator<T>) {
        super();
    }

    @defaultConstructor
    protected _GeneratedStreamImpl(_pending: _EventGenerator<T>) {
        super._init();
        this._pending = _pending;
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        if (this._isUsed) throw new StateError("Stream has already been listened to.");
        this._isUsed = true;
        return $with(new _BufferingStreamSubscription<T>(onData, onError, onDone, cancelOnError),
            (_) => _._setPendingEvents(this._pending()));
    }
}

/** Pending events object that gets its events from an [Iterable]. */
class _IterablePendingEvents<T> extends _PendingEvents<T> {
    // The iterator providing data for data events.
    // Set to null when iteration has completed.
    _iterator: DartIterator<T>;

    constructor(data: DartIterable<T>) {
        super();
        this._iterator = data.iterator;
    }

    get isEmpty(): bool {
        return this._iterator == null;
    }

    handleNext(dispatch: _EventDispatch<T>): void {
        if (this._iterator == null) {
            throw new StateError("No events pending.");
        }
        // Send one event per call to moveNext.
        // If moveNext returns true, send the current element as data.
        // If moveNext returns false, send a done event and clear the _iterator.
        // If moveNext throws an error, send an error and clear the _iterator.
        // After an error, no further events will be sent.
        let isDone: bool;
        try {
            isDone = !this._iterator.moveNext();
        } catch (e) {
            let s = new DartStackTrace(e);
            this._iterator = null;
            dispatch._sendError(e, s);
            return;
        }
        if (!isDone) {
            dispatch._sendData(this._iterator.current);
        } else {
            this._iterator = null;
            dispatch._sendDone();
        }
    }

    clear(): void {
        if (this.isScheduled) this.cancelSchedule();
        this._iterator = null;
    }
}

// Internal helpers.

// Types of the different handlers on a stream. Types used to type fields.
type  _DataHandler<T> = (value: T) => any;
type  _DoneHandler = () => any;

/** Default data handler, does nothing. */
function _nullDataHandler(value: any) {

}

/** Default error handler, reports the error to the current zone's handler. */
function _nullErrorHandler(error: any, stackTrace?: DartStackTrace) {
    DartZone.current.handleUncaughtError(error, stackTrace);
}

/** Default done handler, does nothing. */
function _nullDoneHandler() {
}

/** A delayed event on a buffering stream subscription. */
@DartClass
class _DelayedEvent<T> {
    /** Added as a linked list on the [StreamController]. */
    next: _DelayedEvent<any>;

    /** Execute the delayed event on the [StreamController]. */
    @Abstract
    perform(dispatch: _EventDispatch<T>): void {
        throw 'abstract';
    }
}

/** A delayed data event. */
class _DelayedData<T> extends _DelayedEvent<T> {
    value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }

    perform(dispatch: _EventDispatch<T>): void {
        dispatch._sendData(this.value);
    }
}

/** A delayed error event. */
class _DelayedError extends _DelayedEvent<any> {
    error: any;
    stackTrace: DartStackTrace;

    constructor(error: any, stackTrace: DartStackTrace) {
        super();
        this.error = error;
        this.stackTrace = stackTrace;
    }

    perform(dispatch: _EventDispatch<any>): void {
        dispatch._sendError(this.error, this.stackTrace);
    }
}

/** A delayed done event. */
class _DelayedDone extends _DelayedEvent<any> {
    constructor() {
        super();
    }

    perform(dispatch: _EventDispatch<any>): void {
        dispatch._sendDone();
    }

    get next(): _DelayedEvent<any> {
        return null;
    }

    set next(_: _DelayedEvent<any>) {
        throw new StateError("No events after a done.");
    }
}


/** Class holding pending events for a [_StreamImpl]. */
class _StreamImplEvents<T> extends _PendingEvents<T> {
    /// Single linked list of [_DelayedEvent] objects.
    firstPendingEvent: _DelayedEvent<any> = null;

    /// Last element in the list of pending events. New events are added after it.
    lastPendingEvent: _DelayedEvent<any> = null;

    get isEmpty(): bool {
        return this.lastPendingEvent == null;
    }

    add(event: _DelayedEvent<any>): void {
        if (this.lastPendingEvent == null) {
            this.firstPendingEvent = this.lastPendingEvent = event;
        } else {
            this.lastPendingEvent = this.lastPendingEvent.next = event;
        }
    }

    handleNext(dispatch: _EventDispatch<T>): void {
        //assert(!isScheduled);
        let event = this.firstPendingEvent;
        this.firstPendingEvent = event.next;
        if (this.firstPendingEvent == null) {
            this.lastPendingEvent = null;
        }
        event.perform(dispatch);
    }

    clear(): void {
        if (this.isScheduled) this.cancelSchedule();
        this.firstPendingEvent = this.lastPendingEvent = null;
    }
}

type  _BroadcastCallback<T> = (subscription: DartStreamSubscription<T>) => any;

/**
 * Done subscription that will send one done event as soon as possible.
 */
class _DoneStreamSubscription<T> implements DartStreamSubscription<T> {
    static _DONE_SENT = 1;
    static _SCHEDULED = 2;
    static _PAUSED = 4;

    _zone: DartZone;
    _state = 0;
    _onDone: _DoneHandler;

    constructor(_onDone: _DoneHandler) {
        this._zone = DartZone.current;
        this._onDone = _onDone;
        this._schedule();
    }

    get _isSent(): bool {
        return (this._state & _DoneStreamSubscription._DONE_SENT) != 0;
    }

    get _isScheduled(): bool {
        return (this._state & _DoneStreamSubscription._SCHEDULED) != 0;
    }

    get isPaused() {
        return this._state >= _DoneStreamSubscription._PAUSED;
    }

    _schedule(): void {
        if (this._isScheduled) return;
        this._zone.scheduleMicrotask(() => this._sendDone());
        this._state |= _DoneStreamSubscription._SCHEDULED;
    }

    onData(handleData: (data: T) => any): void {
    }

    onError(handleError: Function): void {
    }

    onDone(handleDone: () => any): void {
        this._onDone = handleDone;
    }

    pause(resumeSignal?: Future<any>): void {
        this._state += _DoneStreamSubscription._PAUSED;
        if (resumeSignal != null) resumeSignal.whenComplete(() => this.resume());
    }

    resume(): void {
        if (this.isPaused) {
            this._state -= _DoneStreamSubscription._PAUSED;
            if (!this.isPaused && !this._isSent) {
                this._schedule();
            }
        }
    }

    cancel(): Future<any> {
        return Future._nullFuture;
    }

    asFuture<E>(futureValue?: E): Future<E> {
        let result = new _Future<E>();
        this._onDone = () => {
            result._completeWithValue(null);
        };
        return result;
    }

    _sendDone(): void {
        this._state &= ~_DoneStreamSubscription._SCHEDULED;
        if (this.isPaused) return;
        this._state |= _DoneStreamSubscription._DONE_SENT;
        if (this._onDone != null) this._zone.runGuarded(() => this._onDone());
    }
}

@DartClass
class _AsBroadcastStream<T> extends DartStream<T> {
    _source: DartStream<T>;
    _onListenHandler: _BroadcastCallback<T>;
    _onCancelHandler: _BroadcastCallback<T>;
    _zone: DartZone;

    _controller: _AsBroadcastStreamController<T>;
    _subscription: DartStreamSubscription<T>;

    @defaultConstructor
    _AsBroadcastStream(
        _source: DartStream<T>,
        onListenHandler: (subscription: DartStreamSubscription<T>) => any,
        onCancelHandler: (subscription: DartStreamSubscription<T>) => any) {
        super._init();
        // TODO(floitsch): the return type should be void and should be
        // inferred.
        this._onListenHandler = DartZone.current
            .registerUnaryCallback<any, DartStreamSubscription<T>>(
                onListenHandler);
        this._onCancelHandler = DartZone.current
            .registerUnaryCallback<any, DartStreamSubscription<T>>(
                onCancelHandler);
        this._zone = DartZone.current;
        this._source = _source;
        this._controller = new _AsBroadcastStreamController<T>(this._onListen.bind(this), this._onCancel.bind(this));
    }

    constructor(
        _source: DartStream<T>,
        onListenHandler: (subscription: DartStreamSubscription<T>) => any,
        onCancelHandler: (subscription: DartStreamSubscription<T>) => any) {
        super();
    }

    get isBroadcast(): bool {
        return true;
    }

    listen(onData: (data: T) => any, _?: { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
        let {onError, onDone, cancelOnError} = Object.assign({}, _);
        if (this._controller == null || this._controller.isClosed) {
            // Return a dummy subscription backed by nothing, since
            // it will only ever send one done event.
            return new _DoneStreamSubscription<T>(onDone);
        }
        if (this._subscription == null) {
            this._subscription = this._source.listen(this._controller.add.bind(this._controller),
                {onError: this._controller.addError.bind(this._controller), onDone: this._controller.close.bind(this._controller)});
        }
        cancelOnError = identical(true, cancelOnError);
        return this._controller._subscribe(onData, onError, onDone, cancelOnError);
    }

    _onCancel(): void {
        let shutdown = (this._controller == null) || this._controller.isClosed;
        if (this._onCancelHandler != null) {
            this._zone.runUnary(
                this._onCancelHandler, new _BroadcastSubscriptionWrapper<T>(this));
        }
        if (shutdown) {
            if (this._subscription != null) {
                this._subscription.cancel();
                this._subscription = null;
            }
        }
    }

    _onListen(): void {
        if (this._onListenHandler != null) {
            this._zone.runUnary(
                this._onListenHandler, new _BroadcastSubscriptionWrapper<T>(this));
        }
    }

    // Methods called from _BroadcastSubscriptionWrapper.
    _cancelSubscription(): void {
        if (this._subscription == null) return;
        // Called by [_controller] when it has no subscribers left.
        let subscription = this._subscription;
        this._subscription = null;
        this._controller = null; // Marks the stream as no longer listenable.
        subscription.cancel();
    }

    _pauseSubscription(resumeSignal: Future<any>): void {
        if (this._subscription == null) return;
        this._subscription.pause(resumeSignal);
    }

    _resumeSubscription(): void {
        if (this._subscription == null) return;
        this._subscription.resume();
    }

    get _isSubscriptionPaused(): bool {
        if (this._subscription == null) return false;
        return this._subscription.isPaused;
    }
}

/**
 * Wrapper for subscription that disallows changing handlers.
 */
class _BroadcastSubscriptionWrapper<T> implements DartStreamSubscription<T> {
    _stream: _AsBroadcastStream<any>;

    constructor(_stream: _AsBroadcastStream<any>) {
        this._stream = _stream;
    }

    onData(handleData: (data: T) => any): void {
        throw new UnsupportedError(
            "Cannot change handlers of asBroadcastStream source subscription.");
    }

    onError(handleError: Function): void {
        throw new UnsupportedError(
            "Cannot change handlers of asBroadcastStream source subscription.");
    }

    onDone(handleDone: () => any): void {
        throw new UnsupportedError(
            "Cannot change handlers of asBroadcastStream source subscription.");
    }

    pause(resumeSignal?: Future<any>): void {
        this._stream._pauseSubscription(resumeSignal);
    }

    resume(): void {
        this._stream._resumeSubscription();
    }

    cancel(): Future<any> {
        this._stream._cancelSubscription();
        return Future._nullFuture;
    }

    get isPaused(): bool {
        return this._stream._isSubscriptionPaused;
    }

    asFuture<E>(futureValue?: E): Future<E> {
        throw new UnsupportedError(
            "Cannot change handlers of asBroadcastStream source subscription.");
    }
}

/**
 * Simple implementation of [StreamIterator].
 *
 * Pauses the stream between calls to [moveNext].
 */
class _StreamIterator<T> implements DartStreamIterator<T> {
    // The stream iterator is always in one of four states.
    // The value of the [_stateData] field depends on the state.
    //
    // When `_subscription == null` and `_stateData != null`:
    // The stream iterator has been created, but [moveNext] has not been called
    // yet. The [_stateData] field contains the stream to listen to on the first
    // call to [moveNext] and [current] returns `null`.
    //
    // When `_subscription != null` and `!_isPaused`:
    // The user has called [moveNext] and the iterator is waiting for the next
    // event. The [_stateData] field contains the [_Future] returned by the
    // [_moveNext] call and [current] returns `null.`
    //
    // When `_subscription != null` and `_isPaused`:
    // The most recent call to [moveNext] has completed with a `true` value
    // and [current] provides the value of the data event.
    // The [_stateData] field contains the [current] value.
    //
    // When `_subscription == null` and `_stateData == null`:
    // The stream has completed or been canceled using [cancel].
    // The stream completes on either a done event or an error event.
    // The last call to [moveNext] has completed with `false` and [current]
    // returns `null`.

    /// Subscription being listened to.
    ///
    /// Set to `null` when the stream subscription is done or canceled.
    _subscription: DartStreamSubscription<T>;

    /// Data value depending on the current state.
    ///
    /// Before first call to [moveNext]: The stream to listen to.
    ///
    /// After calling [moveNext] but before the returned future completes:
    /// The returned future.
    ///
    /// After calling [moveNext] and the returned future has completed
    /// with `true`: The value of [current].
    ///
    /// After calling [moveNext] and the returned future has completed
    /// with `false`, or after calling [cancel]: `null`.
    _stateData: any;

    /// Whether the iterator is between calls to `moveNext`.
    /// This will usually cause the [_subscription] to be paused, but as an
    /// optimization, we only pause after the [moveNext] future has been
    /// completed.
    _isPaused: bool = false;

    constructor(stream: DartStream<T>) {
        this._stateData = stream;
    }

    get current(): T {
        if (this._subscription != null && this._isPaused) {
            return this._stateData/*=T*/;
        }
        return null;
    }

    moveNext(): Future<bool> {
        if (this._subscription != null) {
            if (this._isPaused) {
                let future = new _Future<bool>();
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
    _initializeOrDone(): Future<bool> {
        //assert(_subscription == null);
        let stateData = this._stateData;
        if (stateData != null) {
            let stream: DartStream<T> = stateData /*=Stream<T>*/;
            this._subscription = stream.listen(this._onData.bind(this), {
                onError: this._onError.bind(this), onDone: this._onDone.bind(this), cancelOnError: true
            });
            let future = new _Future<bool>();
            this._stateData = future;
            return future;
        }
        return new _Future.immediate<bool>(false);
    }

    cancel(): Future<any> {
        let subscription = this._subscription;
        let stateData = this._stateData;
        this._stateData = null;
        if (subscription != null) {
            this._subscription = null;
            if (!this._isPaused) {
                let future: _Future<bool> = stateData /*=_Future<bool>*/;
                future._asyncComplete(false);
            }
            return subscription.cancel();
        }
        return Future._nullFuture;
    }

    _onData(data: T): void {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture: _Future<bool> = this._stateData /*=_Future<bool>*/;
        this._stateData = data;
        this._isPaused = true;
        moveNextFuture._complete(true);
        if (this._subscription != null && this._isPaused) this._subscription.pause();
    }

    _onError(error: any, stackTrace?: DartStackTrace): void {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture: _Future<bool> = this._stateData /*=_Future<bool>*/;
        this._subscription = null;
        this._stateData = null;
        moveNextFuture._completeError(error, stackTrace);
    }

    _onDone(): void {
        //assert(_subscription != null && !_isPaused);
        let moveNextFuture: _Future<bool> = this._stateData /*=_Future<bool>*/;
        this._subscription = null;
        this._stateData = null;
        moveNextFuture._complete(false);
    }

    async next(value?: any): Promise<IteratorResult<T>> {
        let hasNext = await this.moveNext();
        return {
            done: !hasNext,
            value: this.current
        };
    }
}

/** An empty broadcast stream, sending a done event as soon as possible. */
@DartClass
class _EmptyStream<T> extends DartStream<T> {
    @defaultConstructor
    _EmptyStream() {
        super._internal();
    }

    constructor() {
        super();
    }

    get isBroadcast(): bool {
        return true;
    }

    listen(onData: (data: T) => any, _?:
        { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
        return new _DoneStreamSubscription<T>(_.onDone);
    }
}

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of dart.async;

/** Runs user code and takes actions depending on success or failure. */
function _runUserCode<T>(
    userCode: () => T, onSuccess: (value: T) => any, onError: (error, stackTrace: DartStackTrace) => any) {
    try {
        onSuccess(userCode());
    } catch (e) {
        let s = new DartStackTrace(e);
        let replacement: DartAsyncError = DartZone.current.errorCallback(e, s);
        if (replacement == null) {
            onError(e, s);
        } else {
            let error = _nonNullError(replacement.error);
            let stackTrace = replacement.stackTrace;
            onError(error, stackTrace);
        }
    }
}

/** Helper function to cancel a subscription and wait for the potential future,
 before completing with an error. */
function _cancelAndError(subscription: DartStreamSubscription<any>, future: _Future<any>, error: any,
                         stackTrace: DartStackTrace): void {
    let cancelFuture = subscription.cancel();
    if (_dart.is(cancelFuture, Future) && !identical(cancelFuture, Future._nullFuture)) {
        cancelFuture.whenComplete(() => future._completeError(error, stackTrace));
    } else {
        future._completeError(error, stackTrace);
    }
}

function _cancelAndErrorWithReplacement(subscription: DartStreamSubscription<any>,
                                        future: _Future<any>, error: any, stackTrace: DartStackTrace): void {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    _cancelAndError(subscription, future, error, stackTrace);
}

type  _ErrorCallback = (error: any, stackTrace: DartStackTrace) => any;

/** Helper function to make an onError argument to [_runUserCode]. */
function _cancelAndErrorClosure(
    subscription: DartStreamSubscription<any>, future: _Future<any>): _ErrorCallback {
    return (error, stackTrace: DartStackTrace) => {
        _cancelAndError(subscription, future, error, stackTrace);
    };
}

/** Helper function to cancel a subscription and wait for the potential future,
 before completing with a value. */
function _cancelAndValue(subscription: DartStreamSubscription<any>, future: _Future<any>, value: any): void {
    let cancelFuture = subscription.cancel();
    if (_dart.is(cancelFuture, Future) && !identical(cancelFuture, Future._nullFuture)) {
        cancelFuture.whenComplete(() => future._complete(value));
    } else {
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
@DartClass
class _ForwardingStream<S, T> extends DartStream<T> {
    _source: DartStream<S>;

    constructor(_source: DartStream<S>) {
        super();
        this._source = _source;
    }

    get isBroadcast(): bool {
        return this._source.isBroadcast;
    }

    listen(onData: (value: T) => any,
           _?: { onError?: Function, onDone?: () => any, cancelOnError?: bool }): DartStreamSubscription<T> {
        let {onError, onDone, cancelOnError} = Object.assign({}, _);
        cancelOnError = identical(true, cancelOnError);
        return this._createSubscription(onData, onError, onDone, cancelOnError);
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return new _ForwardingStreamSubscription<S, T>(this, onData, onError, onDone, cancelOnError);
    }

// Override the following methods in subclasses to change the behavior.

    _handleData(data: S, sink: _EventSink<T>): void {
        sink._add(data as any /*=T*/);
    }

    _handleError(error: any, stackTrace: DartStackTrace, sink: _EventSink<T>): void {
        sink._addError(error, stackTrace);
    }

    _handleDone(sink: _EventSink<T>): void {
        sink._close();
    }
}

/**
 * Abstract superclass for subscriptions that forward to other subscriptions.
 */
@DartClass
class _ForwardingStreamSubscription<S, T>
    extends _BufferingStreamSubscription<T> {
    _stream: _ForwardingStream<S, T>;

    _subscription: DartStreamSubscription<S>;

    constructor(_stream: _ForwardingStream<S, T>, onData: (data: T) => any,
                onError: Function, onDone: () => any, cancelOnError: bool) {
        super(onData, onError, onDone, cancelOnError);
        this._stream = _stream;
        this._subscription = _stream._source
            .listen(this._handleData.bind(this), {onError: this._handleError.bind(this), onDone: this._handleDone.bind(this)});
    }

    // _StreamSink interface.
    // Transformers sending more than one event have no way to know if the stream
    // is canceled or closed after the first, so we just ignore remaining events.

    _add(data: T): void {
        if (this._isClosed) return;
        super._add(data);
    }

    _addError(error: any, stackTrace: DartStackTrace): void {
        if (this._isClosed) return;
        super._addError(error, stackTrace);
    }

    // StreamSubscription callbacks.

    _onPause(): void {
        if (this._subscription == null) return;
        this._subscription.pause();
    }

    _onResume(): void {
        if (this._subscription == null) return;
        this._subscription.resume();
    }

    _onCancel(): Future<any> {
        if (this._subscription != null) {
            let subscription = this._subscription;
            this._subscription = null;
            return subscription.cancel();
        }
        return null;
    }

    // Methods used as listener on source subscription.

    _handleData(data: S): void {
        this._stream._handleData(data, this);
    }

    _handleError(error: any, stackTrace: DartStackTrace): void {
        this._stream._handleError(error, stackTrace, this);
    }

    _handleDone(): void {
        this._stream._handleDone(this);
    }
}

// -------------------------------------------------------------------
// Stream transformers used by the default Stream implementation.
// -------------------------------------------------------------------

type _Predicate<T> = (value: T) => bool;

function _addErrorWithReplacement(sink: _EventSink<any>, error: any, stackTrace: DartStackTrace): void {
    let replacement = DartZone.current.errorCallback(error, stackTrace);
    if (replacement != null) {
        error = _nonNullError(replacement.error);
        stackTrace = replacement.stackTrace;
    }
    sink._addError(error, stackTrace);
}

@DartClass
class _WhereStream<T> extends _ForwardingStream<T, T> {
    _test: _Predicate<T>;

    constructor(source: DartStream<T>, test: (value: T) => bool) {
        super(source);
        this._test = test;
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let satisfies: bool;
        try {
            satisfies = this._test(inputEvent);
        } catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return;
        }
        if (satisfies) {
            sink._add(inputEvent);
        }
    }
}

type  _Transformation<S, T> = (value: S) => T;

/**
 * A stream pipe that converts data events before passing them on.
 */
@DartClass
class _MapStream<S, T> extends _ForwardingStream<S, T> {
    _transform: _Transformation<S, T>;

    constructor(source: DartStream<S>, transform: (event: S) => T) {
        super(source);
        this._transform = transform;
    }

    _handleData(inputEvent: S, sink: _EventSink<T>): void {
        let outputEvent: T;
        try {
            outputEvent = this._transform(inputEvent);
        } catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return;
        }
        sink._add(outputEvent);
    }
}

/**
 * A stream pipe that converts data events before passing them on.
 */
@DartClass
class _ExpandStream<S, T> extends _ForwardingStream<S, T> {
    _expand: _Transformation<S, DartIterable<T>>;

    constructor(source: DartStream<S>, expand: (event: S) => DartIterable<T>) {
        super(source);
        this._expand = expand;
    }

    _handleData(inputEvent: S, sink: _EventSink<T>): void {
        try {
            for (let value of this._expand(inputEvent)) {
                sink._add(value);
            }
        } catch (e) {
            let s = new DartStackTrace(e);
            // If either _expand or iterating the generated iterator throws,
            // we abort the iteration.
            _addErrorWithReplacement(sink, e, s);
        }
    }
}

type  _ErrorTest = (error: any) => bool;

/**
 * A stream pipe that converts or disposes error events
 * before passing them on.
 */
@DartClass
class _HandleErrorStream<T> extends _ForwardingStream<T, T> {
    _transform: Function;
    _test: _ErrorTest;

    constructor(source: DartStream<T>, onError: Function, test: (error: any) => bool) {
        super(source);
        this._transform = onError;
        this._test = test;
    }

    _handleError(error: any, stackTrace: DartStackTrace, sink: _EventSink<T>): void {
        let matches = true;
        if (this._test != null) {
            try {
                matches = this._test(error);
            } catch (e) {
                let s = new DartStackTrace(e);
                _addErrorWithReplacement(sink, e, s);
                return;
            }
        }
        if (matches) {
            try {
                _invokeErrorHandler(this._transform, error, stackTrace);
            } catch (e) {
                let s = new DartStackTrace(e);
                if (identical(e, error)) {
                    sink._addError(error, stackTrace);
                } else {
                    _addErrorWithReplacement(sink, e, s);
                }
                return;
            }
        } else {
            sink._addError(error, stackTrace);
        }
    }
}

class _TakeStream<T> extends _ForwardingStream<T, T> {
    _count: int;

    constructor(source: DartStream<T>, count: int) {
        super(source);
        this._count = count;
        // This test is done early to avoid handling an async error
        // in the _handleData method.
        if (_dart.isNot(count, 'int')) throw new ArgumentError(count);
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        if (this._count == 0) {
            this._source.listen(null).cancel();
            return new _DoneStreamSubscription<T>(onDone);
        }
        return new _StateStreamSubscription<T>(this, onData, onError, onDone, cancelOnError, this._count);
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let subscription: _StateStreamSubscription<T> = sink as any;
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
@DartClass
class _StateStreamSubscription<T> extends _ForwardingStreamSubscription<T, T> {
    // Raw state field. Typed access provided by getters and setters below.
    _sharedState: any;

    constructor(stream: _ForwardingStream<T, T>, onData: (data: T) => any,
                onError: Function, onDone: () => any, cancelOnError: bool, _sharedState: any) {
        super(stream, onData, onError, onDone, cancelOnError);
        this._sharedState = _sharedState;
    }

    get _flag(): bool {
        return this._sharedState;
    }

    set _flag(flag: bool) {
        this._sharedState = flag;
    }


    get _count(): int {
        return this._sharedState;
    }

    set _count(count: int) {
        this._sharedState = count;
    }

    get _value(): any {
        return this._sharedState;
    }

    set _value(value: any) {
        this._sharedState = value;
    }
}

@DartClass
class _TakeWhileStream<T> extends _ForwardingStream<T, T> {
    _test: _Predicate<T>;

    constructor(source: DartStream<T>, test: (value: T) => bool) {
        super(source);
        this._test = test;
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let satisfies: bool;
        try {
            satisfies = this._test(inputEvent);
        } catch (e) {
            let s = new DartStackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            // The test didn't say true. Didn't say false either, but we stop anyway.
            sink._close();
            return;
        }
        if (satisfies) {
            sink._add(inputEvent);
        } else {
            sink._close();
        }
    }
}

@DartClass
class _SkipStream<T> extends _ForwardingStream<T, T> {
    _count: int;

    constructor(source: DartStream<T>, count: int) {
        super(source);
        this._count = count;
        // This test is done early to avoid handling an async error
        // in the _handleData method.
        if (_dart.isNot(count, 'int') || count < 0) throw new ArgumentError(count);
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return new _StateStreamSubscription<T>(this, onData, onError, onDone, cancelOnError, this._count);
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let subscription: _StateStreamSubscription<T> = sink as any;
        let count = subscription._count;
        if (count > 0) {
            subscription._count = count - 1;
            return;
        }
        sink._add(inputEvent);
    }
}

@DartClass
class _SkipWhileStream<T> extends _ForwardingStream<T, T> {
    _test: _Predicate<T>;

    constructor(source: DartStream<T>, test: (value: T) => bool) {
        super(source);
        this._test = test;
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return new _StateStreamSubscription<T>(
            this, onData, onError, onDone, cancelOnError, false);
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let subscription: _StateStreamSubscription<T> = sink as any;
        let hasFailed = subscription._flag;
        if (hasFailed) {
            sink._add(inputEvent);
            return;
        }
        let satisfies: bool;
        try {
            satisfies = this._test(inputEvent);
        } catch (e) {
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
}

type  _Equality<T> = (a: T, b: T) => bool;

@DartClass
class _DistinctStream<T> extends _ForwardingStream<T, T> {
    static _SENTINEL: any = {};

    _equals: _Equality<T>;

    constructor(source: DartStream<T>, equals: (a: T, b: T) => bool) {
        super(source);
        this._equals = equals;
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return new _StateStreamSubscription<T>(
            this, onData, onError, onDone, cancelOnError, _DistinctStream._SENTINEL);
    }

    _handleData(inputEvent: T, sink: _EventSink<T>): void {
        let subscription: _StateStreamSubscription<T> = sink as any;
        var previous = subscription._value;
        if (identical(previous, _DistinctStream._SENTINEL)) {
            // First event.
            subscription._value = inputEvent;
            sink._add(inputEvent);
        } else {
            let previousEvent: T = previous;
            let isEqual: bool;
            try {
                if (this._equals == null) {
                    isEqual = (_dart.equals(previousEvent, inputEvent));
                } else {
                    isEqual = this._equals(previousEvent, inputEvent);
                }
            } catch (e) {
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
}

// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// part of dart.async;

// -------------------------------------------------------------------
// Controller for creating and adding events to a stream.
// -------------------------------------------------------------------

/**
 * Type of a stream controller's `onListen`, `onPause` and `onResume` callbacks.
 */
type  ControllerCallback = () => any;

/**
 * Type of stream controller `onCancel` callbacks.
 *
 * The callback may return either `void` or a future.
 */
type ControllerCancelCallback = () => any;

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
@DartClass
class DartStreamController<T> implements DartStreamSink<T> {
    /** The stream that this controller is controlling. */
    @AbstractProperty
    get stream(): DartStream<T> {
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
    @defaultFactory
    public static _StreamController<T>(
        _?: {
            onListen?: () => any,
            onPause?: () => any,
            onResume?: () => any,
            onCancel?: () => any,
            sync?: bool
        }): DartStreamController<T> {
        let {onListen, onPause, onResume, onCancel, sync} = Object.assign({sync: false}, _);
        return sync
            ? new _SyncStreamController<T>(onListen, onPause, onResume, onCancel)
            : new _AsyncStreamController<T>(onListen, onPause, onResume, onCancel);
    }

    constructor(
        _?: {
            onListen?: () => any,
            onPause?: () => any,
            onResume?: () => any,
            onCancel?: () => any,
            sync?: bool
        }) {

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
    @namedFactory
    protected static _broadcast<T>(
        _?: { onListen?: () => any, onCancel?: () => any, sync: bool }): DartStreamController<T> {
        let {onListen, onCancel, sync} = Object.assign({sync: false}, _);
        return sync
            ? new _SyncBroadcastStreamController<T>(onListen, onCancel)
            : new _AsyncBroadcastStreamController<T>(onListen, onCancel);
    }

    static broadcast: new<T>(_?: { onListen?: () => any, onCancel?: () => any, sync: bool }) => DartStreamController<T>;

    /**
     * The callback which is called when the stream is listened to.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    @AbstractProperty
    get onListen(): ControllerCallback {
        throw 'abstract';
    }

    set onListen(onListenHandler: ControllerCallback) {
        throw 'abstract';
    }

    /**
     * The callback which is called when the stream is paused.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    @AbstractProperty
    get onPause(): ControllerCallback {
        throw 'abstract';
    }

    set onPause(onPauseHandler: ControllerCallback) {
        throw 'abstract';
    }

    /**
     * The callback which is called when the stream is resumed.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    @AbstractProperty
    get onResume(): ControllerCallback {
        throw 'abstract';
    }

    set onResume(onResumeHandler: ControllerCallback) {
        throw 'abstract';
    }

    /**
     * The callback which is called when the stream is canceled.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    @AbstractProperty
    get onCancel(): ControllerCancelCallback {
        throw 'abstract';
    }

    set onCancel(onCancelHandler: ControllerCancelCallback) {
        throw 'abstract';
    }

    /**
     * Returns a view of this object that only exposes the [StreamSink] interface.
     */
    @AbstractProperty
    get sink(): DartStreamSink<T> {
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
    @AbstractProperty
    get isClosed(): bool {
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
    @AbstractProperty
    get isPaused(): bool {
        throw 'abstract';
    }

    /** Whether there is a subscriber on the [Stream]. */
    @AbstractProperty
    get hasListener(): bool {
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
    @Abstract
    add(event: T): void {
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
    @Abstract
    addError(error: any, stackTrace: DartStackTrace): void {
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
    @Abstract
    close(): Future<any> {
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
    @Abstract
    addStream(source: DartStream<T>, _?: { cancelOnError?: bool  /*true*/ }): Future<any> {
        throw 'abstract';
    }

    readonly done: Future<any>;
}

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
@DartClass
class SynchronousStreamController<T> extends DartStreamController<T> {
    /**
     * Adds event to the controller's stream.
     *
     * As [StreamController.add], but must not be called while an event is
     * being added by [add], [addError] or [close].
     */
    //void add(T data);

    /**
     * Adds error to the controller's stream.
     *
     * As [StreamController.addError], but must not be called while an event is
     * being added by [add], [addError] or [close].
     */
    //void addError(Object error, [StackTrace stackTrace]);

    /**
     * Closes the controller's stream.
     *
     * As [StreamController.close], but must not be called while an event is
     * being added by [add], [addError] or [close].
     */
    //Future close();
}

abstract class _StreamControllerLifecycle<T> extends DartObject {
    abstract _subscribe(
        onData: (data: T) => any, onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T>;

    _recordPause(subscription: DartStreamSubscription<T>): void {
    }

    _recordResume(subscription: DartStreamSubscription<T>): void {
    }

    _recordCancel(subscription: DartStreamSubscription<T>): Future<any> {
        return null;
    }
}

/**
 * Default implementation of [StreamController].
 *
 * Controls a stream that only supports a single controller.
 */
class _StreamController<T> extends DartObject
    implements DartStreamController<T>,
        _StreamControllerLifecycle<T>,
        _EventSink<T>,
        _EventDispatch<T> {
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
    static _STATE_INITIAL = 0;
    /** The controller has a subscription, but hasn't been closed or canceled. */
    static _STATE_SUBSCRIBED = 1;
    /** The subscription is canceled. */
    static _STATE_CANCELED = 2;
    /** Mask for the subscription state. */
    static _STATE_SUBSCRIPTION_MASK = 3;

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
    static _STATE_CLOSED = 4;
    /**
     * The controller is in the middle of an [addStream] operation.
     *
     * While adding events from a stream, no new events can be added directly
     * on the controller.
     */
    static _STATE_ADDSTREAM = 8;

    /**
     * Field containing different data depending on the current subscription
     * state.
     *
     * If [_state] is [_StreamController._STATE_INITIAL], the field may contain a [_PendingEvents]
     * for events added to the controller before a subscription.
     *
     * While [_state] is [_StreamController._STATE_SUBSCRIBED], the field contains the subscription.
     *
     * When [_state] is [_StreamController._STATE_CANCELED] the field is currently not used.
     */
    _varData: any;

    /** Current state of the controller. */
    _state = _StreamController._STATE_INITIAL;

    /**
     * Future completed when the stream sends its last event.
     *
     * This is also the future returned by [close].
     */
        // TODO(lrn): Could this be stored in the varData field too, if it's not
        // accessed until the call to "close"? Then we need to special case if it's
        // accessed earlier, or if close is called before subscribing.
    _doneFuture: _Future<any>;

    onListen: ControllerCallback;
    onPause: ControllerCallback;
    onResume: ControllerCallback;
    onCancel: ControllerCancelCallback;

    constructor(onListen: ControllerCallback, onPause: ControllerCallback, onResume: ControllerCallback, onCancel: ControllerCancelCallback) {
        super();
        this.onListen = onListen;
        this.onPause = onPause;
        this.onResume = onResume;
        this.onCancel = onCancel;
    }

    // Return a new stream every time. The streams are equal, but not identical.
    get stream(): DartStream<T> {
        return new _ControllerStream<T>(this);
    }

    /**
     * Returns a view of this object that only exposes the [StreamSink] interface.
     */
    get sink(): DartStreamSink<T> {
        return new _StreamSinkWrapper<T>(this);
    }

    /**
     * Whether a listener has existed and been canceled.
     *
     * After this, adding more events will be ignored.
     */
    get _isCanceled(): bool {
        return (this._state & _StreamController._STATE_CANCELED) != 0;
    }

    /** Whether there is an active listener. */
    get hasListener(): bool {
        return (this._state & _StreamController._STATE_SUBSCRIBED) != 0;
    }

    /** Whether there has not been a listener yet. */
    get _isInitialState(): bool {
        return (this._state & _StreamController._STATE_SUBSCRIPTION_MASK) == _StreamController._STATE_INITIAL;
    }

    get isClosed(): bool {
        return (this._state & _StreamController._STATE_CLOSED) != 0;
    }

    get isPaused(): bool {
        return this.hasListener ? this._subscription._isInputPaused : !this._isCanceled;
    }

    get _isAddingStream(): bool {
        return (this._state & _StreamController._STATE_ADDSTREAM) != 0;
    }

    /** New events may not be added after close, or during addStream. */
    get _mayAddEvent(): bool {
        return (this._state < _StreamController._STATE_CLOSED);
    }

    // Returns the pending events.
    // Pending events are events added before a subscription exists.
    // They are added to the subscription when it is created.
    // Pending events, if any, are kept in the _varData field until the
    // stream is listened to.
    // While adding a stream, pending events are moved into the
    // state object to allow the state object to use the _varData field.
    get _pendingEvents(): _PendingEvents<T> {
        //assert(_isInitialState);
        if (!this._isAddingStream) {
            return this._varData as any/*=_PendingEvents<T>*/;
        }
        let state: _StreamControllerAddStreamState<T> =
            this._varData as any/*=_StreamControllerAddStreamState<T>*/;
        return state.varData as any/*=_PendingEvents<T>*/;
    }

    // Returns the pending events, and creates the object if necessary.
    _ensurePendingEvents(): _StreamImplEvents<T> {
        //assert(_isInitialState);
        if (!this._isAddingStream) {
            if (this._varData == null) this._varData = new _StreamImplEvents<T>();
            return this._varData as any/*=_StreamImplEvents<T>*/;
        }
        let state: _StreamControllerAddStreamState<T> =
            this._varData as any/*=_StreamControllerAddStreamState<T>*/;
        if (state.varData == null) state.varData = new _StreamImplEvents<T>();
        return state.varData as any/*=_StreamImplEvents<T>*/;
    }

    // Get the current subscription.
    // If we are adding a stream, the subscription is moved into the state
    // object to allow the state object to use the _varData field.
    get _subscription(): _ControllerSubscription<T> {
        //assert(hasListener);
        if (this._isAddingStream) {
            let addState: _StreamControllerAddStreamState<T> =
                this._varData as any/*=_StreamControllerAddStreamState<T>*/;
            return addState.varData as any/*=_ControllerSubscription<T>*/;
        }
        return this._varData as any/*=_ControllerSubscription<T>*/;
    }

    /**
     * Creates an error describing why an event cannot be added.
     *
     * The reason, and therefore the error message, depends on the current state.
     */
    _badEventState(): DartError {
        if (this.isClosed) {
            return new StateError("Cannot add event after closing");
        }
        //assert(_isAddingStream);
        return new StateError("Cannot add event while adding a stream");
    }

    // StreamSink interface.
    addStream(source: DartStream<T>, _?: { cancelOnError: bool  /*true*/ }): Future<any> {
        let {cancelOnError} = Object.assign({cancelOnError: true}, _);
        if (!this._mayAddEvent) throw this._badEventState();
        if (this._isCanceled) return new _Future.immediate(null);
        let addState: _StreamControllerAddStreamState<T> = new _StreamControllerAddStreamState<T>(this, this._varData, source, cancelOnError);
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
    get done(): Future<any> {
        return this._ensureDoneFuture();
    }

    _ensureDoneFuture(): Future<any> {
        if (this._doneFuture == null) {
            this._doneFuture = this._isCanceled ? Future._nullFuture : new _Future<any>();
        }
        return this._doneFuture;
    }

    /**
     * Send or enqueue a data event.
     */
    add(value: T): void {
        if (!this._mayAddEvent) throw this._badEventState();
        this._add(value);
    }

    /**
     * Send or enqueue an error event.
     */
    addError(error: any, stackTrace?: DartStackTrace): void {
        if (!this._mayAddEvent) throw this._badEventState();
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
    close(): Future<any> {
        if (this.isClosed) {
            return this._ensureDoneFuture();
        }
        if (!this._mayAddEvent) throw this._badEventState();
        this._closeUnchecked();
        return this._ensureDoneFuture();
    }

    _closeUnchecked(): void {
        this._state |= _StreamController._STATE_CLOSED;
        if (this.hasListener) {
            this._sendDone();
        } else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedDone());
        }
    }

    // EventSink interface. Used by the [addStream] events.

    // Add data event, used both by the [addStream] events and by [add].
    _add(value: T): void {
        if (this.hasListener) {
            this._sendData(value);
        } else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedData<T>(value));
        }
    }

    _addError(error: any, stackTrace: DartStackTrace): void {
        if (this.hasListener) {
            this._sendError(error, stackTrace);
        } else if (this._isInitialState) {
            this._ensurePendingEvents().add(new _DelayedError(error, stackTrace));
        }
    }

    _close(): void {
        // End of addStream stream.
        //assert(_isAddingStream);
        let addState: _StreamControllerAddStreamState<T> =
            this._varData /*=_StreamControllerAddStreamState<T>*/;
        this._varData = addState.varData;
        this._state &= ~_StreamController._STATE_ADDSTREAM;
        addState.complete();
    }

    // _StreamControllerLifeCycle interface

    _subscribe(onData: (data: T) => any, onError: Function,
               onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        if (!this._isInitialState) {
            throw new StateError("Stream has already been listened to.");
        }
        let subscription = new _ControllerSubscription<T>(this, onData, onError, onDone, cancelOnError);

        let pendingEvents = this._pendingEvents;
        this._state |= _StreamController._STATE_SUBSCRIBED;
        if (this._isAddingStream) {
            let addState: _StreamControllerAddStreamState<T> =
                this._varData /*=_StreamControllerAddStreamState<T>*/;
            addState.varData = subscription;
            addState.resume();
        } else {
            this._varData = subscription;
        }
        subscription._setPendingEvents(pendingEvents);
        subscription._guardCallback(() => {
            _runGuarded(this.onListen);
        });

        return subscription;
    }

    _recordCancel(subscription: DartStreamSubscription<T>): Future<any> {
        // When we cancel, we first cancel any stream being added,
        // Then we call `onCancel`, and finally the _doneFuture is completed.
        // If either of addStream's cancel or `onCancel` returns a future,
        // we wait for it before continuing.
        // Any error during this process ends up in the returned future.
        // If more errors happen, we act as if it happens inside nested try/finallys
        // or whenComplete calls, and only the last error ends up in the
        // returned future.
        let result: Future<any>;
        if (this._isAddingStream) {
            let addState: _StreamControllerAddStreamState<T> =
                this._varData /*=_StreamControllerAddStreamState<T>*/;
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
                } catch (e) {
                    let s = new DartStackTrace(e);
                    // Return the error in the returned future.
                    // Complete it asynchronously, so there is time for a listener
                    // to handle the error.
                    result = $with(new _Future(), (f) => f._asyncCompleteError(e, s));
                }
            } else {
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
        } else {
            complete();
        }

        return result;
    }

    _recordPause(subscription: DartStreamSubscription<T>): void {
        if (this._isAddingStream) {
            let addState: _StreamControllerAddStreamState<T> =
                this._varData/*=_StreamControllerAddStreamState<T>*/;
            addState.pause();
        }
        _runGuarded(this.onPause);
    }

    _recordResume(subscription: DartStreamSubscription<T>): void {
        if (this._isAddingStream) {
            let addState: _StreamControllerAddStreamState<T> =
                this._varData /*=_StreamControllerAddStreamState<T>*/;
            addState.resume();
        }
        _runGuarded(this.onResume);
    }

    @Abstract
    _sendData(data: T): void {
        throw 'abstract';
    }

    @Abstract
    _sendDone(): void {
        throw 'abstract';
    }

    @Abstract
    _sendError(error: any, stackTrace: DartStackTrace): void {
        throw 'abstract';
    }
}

@DartClass
@Implements(SynchronousStreamController)
class _SyncStreamControllerDispatch<T>
    extends _StreamController<T> {
    @AbstractProperty
    get _state(): int {
        throw 'abstract';
    }

    set _state(state: int) {
        throw 'abstract';
    }

    _sendData(data: T): void {
        this._subscription._add(data);
    }

    _sendError(error: any, stackTrace: DartStackTrace): void {
        this._subscription._addError(error, stackTrace);
    }

    _sendDone(): void {
        this._subscription._close();
    }
}

@DartClass
class _AsyncStreamControllerDispatch<T>
    extends _StreamController<T> {
    _sendData(data: T): void {
        this._subscription._addPending(new _DelayedData<T>(data));
    }

    _sendError(error: any, stackTrace: DartStackTrace): void {
        this._subscription._addPending(new _DelayedError(error, stackTrace));
    }

    _sendDone(): void {
        this._subscription._addPending(new _DelayedDone());
    }
}

// TODO(lrn): Use common superclass for callback-controllers when VM supports
// constructors in mixin superclasses.

@DartClass
@With(_AsyncStreamControllerDispatch)
class _AsyncStreamController<T> extends _StreamController<T> {
}


@DartClass
@With(_SyncStreamControllerDispatch)
class _SyncStreamController<T> extends _StreamController<T> {
}

type  _NotificationHandler = () => any;

function _runGuarded(notificationHandler: _NotificationHandler): void {
    if (notificationHandler == null) return;
    try {
        notificationHandler();
    } catch (e) {
        let s = new DartStackTrace(e);
        DartZone.current.handleUncaughtError(e, s);
    }
}

@DartClass
class _ControllerStream<T> extends _StreamImpl<T> {
    _controller: _StreamControllerLifecycle<T>;

    constructor(_controller) {
        super();
        this._controller = _controller;
    }

    _createSubscription(onData: (data: T) => any,
                        onError: Function, onDone: () => any, cancelOnError: bool): DartStreamSubscription<T> {
        return this._controller._subscribe(onData, onError, onDone, cancelOnError);
    }

    // Override == and hashCode so that new streams returned by the same
    // controller are considered equal. The controller returns a new stream
    // each time it's queried, but doesn't have to cache the result.

    get hashCode(): int {
        return this._controller.hashCode ^ 0x35323532
    };

    @Operator(Op.EQUALS)
    equals(other: any): bool {
        if (identical(this, other)) return true;
        if (_dart.isNot(other, _ControllerStream)) return false;
        let otherStream: _ControllerStream<T> = other;
        return identical(otherStream._controller, this._controller);
    }
}

class _ControllerSubscription<T> extends _BufferingStreamSubscription<T> {
    _controller: _StreamControllerLifecycle<T>;

    constructor(_controller: _StreamControllerLifecycle<T>, onData: (data: T) => any,
                onError: Function, onDone: () => any, cancelOnError: bool) {
        super(onData, onError, onDone, cancelOnError);
        this._controller = _controller;
    }

    _onCancel(): Future<any> {
        return this._controller._recordCancel(this);
    }

    _onPause(): void {
        this._controller._recordPause(this);
    }

    _onResume(): void {
        this._controller._recordResume(this);
    }
}

/** A class that exposes only the [StreamSink] interface of an object. */
class _StreamSinkWrapper<T> implements DartStreamSink<T> {
    _target: DartStreamController<any>;

    constructor(_target: DartStreamController<any>) {
        this._target = _target;
    }

    add(data: T): void {
        this._target.add(data);
    }

    addError(error: any, stackTrace?: DartStackTrace): void {
        this._target.addError(error, stackTrace);
    }

    close(): Future<any> {
        return this._target.close();
    }

    addStream(source: DartStream<T>, _?: { cancelOnError?: bool }): Future<any> {
        return this._target.addStream(source, _);
    }

    get done(): Future<any> {
        return (this._target as any).done;
    }
}

/**
 * Object containing the state used to handle [StreamController.addStream].
 */
class _AddStreamState<T> {
    // [_Future] returned by call to addStream.
    addStreamFuture: _Future<any>;

    // Subscription on stream argument to addStream.
    addSubscription: DartStreamSubscription<any>;

    constructor(controller: _EventSink<T>, source: DartStream<any>, cancelOnError: bool) {
        this.addStreamFuture = new _Future();
        this.addSubscription = source.listen(controller._add.bind(controller), {
            onError: cancelOnError
                ? _AddStreamState.makeErrorHandler(controller)
                : controller._addError.bind(controller),
            onDone: controller._close.bind(controller),
            cancelOnError: cancelOnError
        });
    }

    static makeErrorHandler(controller: _EventSink<any>) {
        return (e, s: DartStackTrace) => {
            controller._addError(e, s);
            controller._close();
        };
    }

    pause(): void {
        this.addSubscription.pause();
    }

    resume(): void {
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
    cancel(): Future<any> {
        let cancel = this.addSubscription.cancel();
        if (cancel == null) {
            this.addStreamFuture._asyncComplete(null);
            return null;
        }
        return cancel.whenComplete(() => {
            this.addStreamFuture._asyncComplete(null);
        });
    }

    complete(): void {
        this.addStreamFuture._asyncComplete(null);
    }
}

class _StreamControllerAddStreamState<T> extends _AddStreamState<T> {
    // The subscription or pending data of a _StreamController.
    // Stored here because we reuse the `_varData` field  in the _StreamController
    // to store this state object.
    varData: any;

    constructor(controller: _StreamController<T>, varData: any,
                source: DartStream<any>, cancelOnError: bool) {
        super(controller, source, cancelOnError);
        this.varData = varData;
        if (controller.isPaused) {
            this.addSubscription.pause();
        }
    }
}


export {
    Future,
    DartCompleter,
    DartZoneSpecification,
    DartZone,
    DartTimer,
    runZoned,
    scheduleMicrotask,
    printToConsole,
    DartStream,
    DartStreamTransformer,
    DartEventSink,
    DartStreamSink,
    DartStreamController
}