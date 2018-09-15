import { DartDuration, DartIterable, DartList, DartMap, DartSet, DartStackTrace, DartSink } from "./core";
import { bool, int } from "./utils";
export declare type FutureOr<T> = Future<T> | T;
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
declare class Future<T> implements Promise<T> {
    static _nullFuture: _Future<any>;
    protected static _fromPromise<T>(p: Promise<T>): Future<T>;
    static fromPromise: new <T>(p: Promise<T>) => Future<T>;
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
    protected static _create<T>(computation: () => FutureOr<T>): Future<T>;
    constructor(computation: () => FutureOr<T>);
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
    protected static _microtask<T>(computation: () => FutureOr<T>): Future<T>;
    static microtask: new <T>(computation: () => FutureOr<T>) => Future<T>;
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
    protected static _sync<T>(computation: () => FutureOr<T>): Future<T>;
    static sync: new <T>(computation: () => FutureOr<T>) => Future<T>;
    /**
     * A future whose value is available in the next event-loop iteration.
     *
     * If [result] is not a [Future], using this constructor is equivalent
     * to `new Future<T>.sync(() => result)`.
     *
     * Use [Completer] to create a future and complete it later.
     */
    protected static _value<T>(result?: FutureOr<T>): Future<T>;
    static value: new <T>(result?: FutureOr<T>) => Future<T>;
    /**
     * A future that completes with an error in the next event-loop iteration.
     *
     * If [error] is `null`, it is replaced by a [NullThrownError].
     *
     * Use [Completer] to create a future and complete it later.
     */
    protected static _error<T>(error: any, stackTrace?: DartStackTrace): Future<T>;
    static error: new <T>(error: any, stackTrace?: DartStackTrace) => Future<T>;
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
    protected static _delayed<T>(duration: DartDuration, computation?: () => FutureOr<T>): Future<T>;
    static delayed: new <T>(duration: DartDuration, computation?: () => FutureOr<T>) => Future<T>;
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
    static wait<T>(futures: DartIterable<Future<T>>, _?: {
        eagerError?: bool;
        cleanUp?: (successValue: T) => any;
    }): Future<DartList<T>>;
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
    static any<T>(futures: DartIterable<Future<T>>): Future<T>;
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
    static forEach<T>(input: DartIterable<T>, f: (element: T) => FutureOr<any>): Future<any>;
    static _kTrue(_: any): bool;
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
    static doWhile(f: () => FutureOr<bool>): Future<any>;
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
    then<S>(onValue: (value: T) => FutureOr<S>, _?: {
        onError?: Function;
    }): Future<S>;
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
    catchError(onError: Function, _?: {
        test: (error: any) => bool;
    }): Future<T>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
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
    whenComplete(action: () => FutureOr<any>): Future<T>;
    /**
     * Creates a [Stream] containing the result of this future.
     *
     * The stream will produce single data or error event containing the
     * completion result of this future, and then it will close with a
     * done event.
     *
     * If the future never completes, the stream will not produce any events.
     */
    asStream(): DartStream<T>;
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
    timeout(timeLimit: DartDuration, _?: {
        onTimeout?: () => FutureOr<T>;
    }): Future<T>;
    readonly [Symbol.toStringTag]: "Promise";
}
declare function dartAsync<T>(asyncFunc: (...args: any[]) => Promise<T>): (...args: any[]) => Future<T>;
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
declare class DartCompleter<T> {
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
    protected static _create<T>(): DartCompleter<T>;
    constructor();
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
    protected static _sync<T>(): DartCompleter<T>;
    static sync: new <T>() => DartCompleter<T>;
    /** The future that will contain the result provided to this completer. */
    readonly future: Future<T>;
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
    complete(value?: FutureOr<T>): void;
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
    completeError(error: any, stackTrace?: DartStackTrace): void;
    /**
     * Whether the future has been completed.
     */
    readonly isCompleted: bool;
}
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
declare class DartZone {
    _(): void;
    protected static _: new () => DartZone;
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
    static ROOT: DartZone;
    /** The currently running zone. */
    static _current: DartZone;
    /** The zone that is currently active. */
    static readonly current: DartZone;
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
    handleUncaughtError<R>(error: any, stackTrace: DartStackTrace): R;
    /**
     * The parent zone of the this zone.
     *
     * Is `null` if `this` is the [ROOT] zone.
     *
     * Zones are created by [fork] on an existing zone, or by [runZoned] which
     * forks the [current] zone. The new zone's parent zone is the zone it was
     * forked from.
     */
    readonly parent: DartZone;
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
    readonly errorZone: DartZone;
    /**
     * Returns true if `this` and [otherZone] are in the same error zone.
     *
     * Two zones are in the same error zone if they have the same [errorZone].
     */
    inSameErrorZone(otherZone: DartZone): bool;
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
    fork(_?: {
        specification?: DartZoneSpecification;
        zoneValues?: DartMap<any, any>;
    }): DartZone;
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
    run<R>(action: () => R): R;
    /**
     * Executes the given [action] with [argument] in this zone.
     *
     * As [run] except that [action] is called with one [argument] instead of
     * none.
     */
    runUnary<R, T>(action: (argument: T) => R, argument: T): R;
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone.
     *
     * As [run] except that [action] is called with two arguments instead of none.
     */
    runBinary<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R;
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
    runGuarded<R>(action: () => R): R;
    /**
     * Executes the given [action] with [argument] in this zone and
     * catches synchronous errors.
     *
     * See [runGuarded].
     */
    runUnaryGuarded<R, T>(action: (argument: T) => R, argument: T): R;
    /**
     * Executes the given [action] with [argument1] and [argument2] in this
     * zone and catches synchronous errors.
     *
     * See [runGuarded].
     */
    runBinaryGuarded<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, argument1: T1, argument2: T2): R;
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
    registerCallback<R>(callback: () => R): ZoneCallback<R>;
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerUnaryCallback<R, T>(callback: (arg: T) => R): ZoneUnaryCallback<R, T>;
    /**
     * Registers the given callback in this zone.
     *
     * Similar to [registerCallback] but with a unary callback.
     */
    registerBinaryCallback<R, T1, T2>(callback: (arg1: T1, arg2: T2) => R): ZoneBinaryCallback<R, T1, T2>;
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerCallback(action);
     *      if (runGuarded) return () => this.runGuarded(registered);
     *      return () => this.run(registered);
     *
     */
    bindCallback<R>(action: () => R, _?: {
        runGuarded?: bool;
    }): ZoneCallback<R>;
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = this.registerUnaryCallback(action);
     *      if (runGuarded) return (arg) => this.runUnaryGuarded(registered, arg);
     *      return (arg) => thin.runUnary(registered, arg);
     */
    bindUnaryCallback<R, T>(action: (argument: T) => R, _?: {
        runGuarded?: bool;
    }): ZoneUnaryCallback<R, T>;
    /**
     *  Equivalent to:
     *
     *      ZoneCallback registered = registerBinaryCallback(action);
     *      if (runGuarded) {
     *        return (arg1, arg2) => this.runBinaryGuarded(registered, arg);
     *      }
     *      return (arg1, arg2) => thin.runBinary(registered, arg1, arg2);
     */
    bindBinaryCallback<R, T1, T2>(action: (argument1: T1, argument2: T2) => R, _?: {
        runGuarded?: bool;
    }): ZoneBinaryCallback<R, T1, T2>;
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
    errorCallback(error: any, stackTrace: DartStackTrace): DartAsyncError;
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
    scheduleMicrotask(action: () => any): void;
    /**
     * Creates a Timer where the callback is executed in this zone.
     */
    createTimer(duration: DartDuration, callback: () => any): DartTimer;
    /**
     * Creates a periodic Timer where the callback is executed in this zone.
     */
    createPeriodicTimer(period: DartDuration, callback: (timer: DartTimer) => any): DartTimer;
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
    print(line: string): void;
    /**
     * Call to enter the Zone.
     *
     * The previous current zone is returned.
     */
    static _enter(zone: DartZone): DartZone;
    /**
     * Call to leave the Zone.
     *
     * The previous Zone must be provided as `previous`.
     */
    static _leave(previous: DartZone): void;
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
    get(key: any): any;
}
declare class _Future<T> implements Future<T> {
    /** Whether the future is complete, and as what. */
    _state: int;
    /**
     * Zone that the future was completed from.
     * This is the zone that an error result belongs to.
     *
     * Until the future is completed, the field may hold the zone that
     * listener callbacks used to create this future should be run in.
     */
    _zone: DartZone;
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
    constructor();
    protected _init(): void;
    protected immediate(result: FutureOr<T>): void;
    static immediate: new <T>(result: FutureOr<T>) => _Future<T>;
    protected immediateError(error: any, stackTrace?: DartStackTrace): void;
    static immediateError: new <T>(error: any, stackTrace?: DartStackTrace) => _Future<T>;
    /** Creates a future that is already completed with the value. */
    protected value(value: T): void;
    static value: new <T>(value: T) => _Future<T>;
    readonly _mayComplete: bool;
    readonly _isPendingComplete: bool;
    readonly _mayAddListener: bool;
    readonly _isChained: bool;
    readonly _isComplete: bool;
    readonly _hasError: bool;
    _setChained(source: _Future<any>): void;
    then<E>(f: (value: T) => FutureOr<E>, _?: {
        onError?: Function;
    }): Future<E>;
    _thenNoZoneRegistration<E>(f: (value: T) => FutureOr<E>, onError: Function): Future<E>;
    catchError(onError: Function, _?: {
        test: (error: any) => bool;
    }): Future<T>;
    catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): Promise<T | TResult>;
    whenComplete(action: () => any): Future<T>;
    asStream(): DartStream<T>;
    _setPendingComplete(): void;
    _clearPendingComplete(): void;
    readonly _error: DartAsyncError;
    readonly _chainSource: _Future<any>;
    _setValue(value: T): void;
    _setErrorObject(error: DartAsyncError): void;
    _setError(error: any, stackTrace: DartStackTrace): void;
    _cloneResult(source: _Future<any>): void;
    _addListener(listener: _FutureListener<any, any>): void;
    _prependListeners(listeners: _FutureListener<any, any>): void;
    _removeListeners(): _FutureListener<any, any>;
    _reverseListeners(listeners: _FutureListener<any, any>): _FutureListener<any, any>;
    static _chainForeignFuture(source: Future<any>, target: _Future<any>): void;
    static _chainCoreFuture(source: _Future<any>, target: _Future<any>): void;
    _complete(value: FutureOr<T>): void;
    _completeWithValue(value: T): void;
    _completeError(error: any, stackTrace?: DartStackTrace): void;
    _asyncComplete(value: FutureOr<T>): void;
    _chainFuture(value: Future<T>): void;
    _asyncCompleteError(error: any, stackTrace: DartStackTrace): void;
    /**
     * Propagates the value/error of [source] to its [listeners], executing the
     * listeners' callbacks.
     */
    static _propagateToListeners(source: _Future<any>, listeners: _FutureListener<any, any>): void;
    timeout(timeLimit: DartDuration, _?: {
        onTimeout?: () => FutureOr<T>;
    }): Future<T>;
    readonly [Symbol.toStringTag]: "Promise";
}
/** The onValue and onError handlers return either a value or a future */
declare type _FutureOnValue<S, T> = (value: S) => FutureOr<T>;
/** Test used by [Future.catchError] to handle skip some errors. */
declare type _FutureErrorTest = (error: any) => bool;
/** Used by [WhenFuture]. */
declare type _FutureAction = () => any;
declare class _FutureListener<S, T> {
    _nextListener: _FutureListener<any, any>;
    result: _Future<T>;
    state: int;
    callback: Function;
    errorCallback: Function;
    protected then(result: _Future<T>, onValue: _FutureOnValue<S, T>, errorCallback: Function): void;
    static then: new <S, T>(result: _Future<T>, onValue: _FutureOnValue<S, T>, errorCallback: Function) => _FutureListener<S, T>;
    protected catchError(result: _Future<T>, errorCallback: Function, test: _FutureErrorTest): void;
    static catchError: new <S, T>(result: _Future<T>, errorCallback: Function, test: _FutureErrorTest) => _FutureListener<S, T>;
    protected whenComplete(result: _Future<T>, onComplete: _FutureAction): void;
    static whenComplete: new <S, T>(result: _Future<T>, onComplete: _FutureAction) => _FutureListener<S, T>;
    readonly _zone: DartZone;
    readonly handlesValue: bool;
    readonly handlesError: bool;
    readonly hasErrorTest: bool;
    readonly handlesComplete: bool;
    readonly _onValue: _FutureOnValue<S, T>;
    readonly _onError: Function;
    readonly _errorTest: _FutureErrorTest;
    readonly _whenCompleteAction: _FutureAction;
    readonly hasErrorCallback: bool;
    handleValue(sourceResult: S): FutureOr<T>;
    matchesErrorTest(asyncError: DartAsyncError): bool;
    handleError(asyncError: DartAsyncError): FutureOr<T>;
    handleWhenComplete(): any;
}
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
declare class DartTimer {
    /**
     * Creates a new timer.
     *
     * The [callback] function is invoked after the given [duration].
     *
     */
    protected static _create(duration: DartDuration, callback: () => any): DartTimer;
    constructor(duration: DartDuration, callback: () => any);
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
    protected static _periodic(duration: DartDuration, callback: (timer: DartTimer) => any): DartTimer;
    static periodic: new (duration: DartDuration, callback: (timer: DartTimer) => any) => DartTimer;
    /**
     * Runs the given [callback] asynchronously as soon as possible.
     *
     * This function is equivalent to `new Timer(Duration.ZERO, callback)`.
     */
    static run(callback: () => any): void;
    /**
     * Cancels the timer.
     */
    cancel(): void;
    /**
     * Returns whether the timer is still active.
     *
     * A non-periodic timer is active if the callback has not been executed,
     * and the timer has not been canceled.
     *
     * A periodic timer is active if it has not been canceled.
     */
    readonly isActive: bool;
    static _createTimer(duration: DartDuration, callback: () => any): DartTimer;
    static _createPeriodicTimer(duration: DartDuration, callback: (timer: DartTimer) => any): DartTimer;
}
declare type ZoneCallback<R> = () => R;
declare type ZoneUnaryCallback<R, T> = (arg: T) => R;
declare type ZoneBinaryCallback<R, T1, T2> = (arg1: T1, arg2: T2) => R;
declare type HandleUncaughtErrorHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, error: any, stackTrace: DartStackTrace) => R;
declare type RunHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R) => R;
declare type RunUnaryHandler<R, T> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R, arg: T) => R;
declare type RunBinaryHandler<R, T1, T2> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2) => R;
declare type RegisterCallbackHandler<R> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => R) => ZoneCallback<R>;
declare type RegisterUnaryCallbackHandler<R, T> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg: T) => R) => ZoneUnaryCallback<R, T>;
declare type RegisterBinaryCallbackHandler<R, T1, T2> = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: (arg1: T1, arg2: T2) => R) => ZoneBinaryCallback<R, T1, T2>;
declare type ErrorCallbackHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, error: any, stackTrace: DartStackTrace) => DartAsyncError;
declare type ScheduleMicrotaskHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, f: () => any) => void;
declare type CreateTimerHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, duration: DartDuration, f: () => any) => DartTimer;
declare type CreatePeriodicTimerHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, period: DartDuration, f: (timer: DartTimer) => any) => DartTimer;
declare type PrintHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, line: string) => void;
declare type ForkHandler = (self: DartZone, parent: DartZoneDelegate, zone: DartZone, specification: DartZoneSpecification, zoneValues: DartMap<any, any>) => DartZone;
/** Pair of error and stack trace. Returned by [Zone.errorCallback]. */
declare class DartAsyncError extends Error {
    error: any;
    stackTrace: DartStackTrace;
    constructor(error: any, stackTrace: DartStackTrace);
    toString(): string;
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
declare class DartZoneSpecification {
    /**
     * Creates a specification with the provided handlers.
     */
    protected static _create(_?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>;
        run?: RunHandler<any>;
        runUnary?: RunUnaryHandler<any, any>;
        runBinary?: RunBinaryHandler<any, any, any>;
        registerCallback?: RegisterCallbackHandler<any>;
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>;
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>;
        errorCallback?: ErrorCallbackHandler;
        scheduleMicrotask?: ScheduleMicrotaskHandler;
        createTimer?: CreateTimerHandler;
        createPeriodicTimer?: CreatePeriodicTimerHandler;
        print?: PrintHandler;
        fork?: ForkHandler;
    }): DartZoneSpecification;
    constructor(_?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>;
        run?: RunHandler<any>;
        runUnary?: RunUnaryHandler<any, any>;
        runBinary?: RunBinaryHandler<any, any, any>;
        registerCallback?: RegisterCallbackHandler<any>;
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>;
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>;
        errorCallback?: ErrorCallbackHandler;
        scheduleMicrotask?: ScheduleMicrotaskHandler;
        createTimer?: CreateTimerHandler;
        createPeriodicTimer?: CreatePeriodicTimerHandler;
        print?: PrintHandler;
        fork?: ForkHandler;
    });
    /**
     * Creates a specification from [other] with the provided handlers overriding
     * the ones in [other].
     */
    protected static _from(other: DartZoneSpecification, _?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>;
        run?: RunHandler<any>;
        runUnary?: RunUnaryHandler<any, any>;
        runBinary?: RunBinaryHandler<any, any, any>;
        registerCallback?: RegisterCallbackHandler<any>;
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>;
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>;
        errorCallback?: ErrorCallbackHandler;
        scheduleMicrotask?: ScheduleMicrotaskHandler;
        createTimer?: CreateTimerHandler;
        createPeriodicTimer?: CreatePeriodicTimerHandler;
        print?: PrintHandler;
        fork?: ForkHandler;
    }): DartZoneSpecification;
    static from: new (other: DartZoneSpecification, _?: {
        handleUncaughtError?: HandleUncaughtErrorHandler<any>;
        run?: RunHandler<any>;
        runUnary?: RunUnaryHandler<any, any>;
        runBinary?: RunBinaryHandler<any, any, any>;
        registerCallback?: RegisterCallbackHandler<any>;
        registerUnaryCallback?: RegisterUnaryCallbackHandler<any, any>;
        registerBinaryCallback?: RegisterBinaryCallbackHandler<any, any, any>;
        errorCallback?: ErrorCallbackHandler;
        scheduleMicrotask?: ScheduleMicrotaskHandler;
        createTimer?: CreateTimerHandler;
        createPeriodicTimer?: CreatePeriodicTimerHandler;
        print?: PrintHandler;
        fork?: ForkHandler;
    }) => DartZoneSpecification;
    readonly handleUncaughtError: HandleUncaughtErrorHandler<any>;
    readonly run: RunHandler<any>;
    readonly runUnary: RunUnaryHandler<any, any>;
    readonly runBinary: RunBinaryHandler<any, any, any>;
    readonly registerCallback: RegisterCallbackHandler<any>;
    readonly registerUnaryCallback: RegisterUnaryCallbackHandler<any, any>;
    readonly registerBinaryCallback: RegisterBinaryCallbackHandler<any, any, any>;
    readonly errorCallback: ErrorCallbackHandler;
    readonly scheduleMicrotask: ScheduleMicrotaskHandler;
    readonly createTimer: CreateTimerHandler;
    readonly createPeriodicTimer: CreatePeriodicTimerHandler;
    readonly print: PrintHandler;
    readonly fork: ForkHandler;
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
declare function runZoned<R>(body: () => R, _?: {
    zoneValues?: DartMap<any, any>;
    zoneSpecification?: DartZoneSpecification;
    onError?: Function;
}): R;
declare function printToConsole(line: string): void;
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
declare function scheduleMicrotask(callback: () => void): void;
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
declare class DartStream<T> implements AsyncIterable<T> {
    protected _init(): void;
    constructor();
    /**
     * Internal use only. We do not want to promise that Stream stays const.
     *
     * If mixins become compatible with const constructors, we may use a
     * stream mixin instead of extending Stream from a const class.
     */
    _internal(): void;
    static _internal: new <T>() => DartStream<T>;
    /**
     * Creates an empty broadcast stream.
     *
     * This is a stream which does nothing except sending a done event
     * when it's listened to.
     */
    protected static _empty<T>(): DartStream<T>;
    static empty: new <T>() => DartStream<T>;
    /**
     * Creates a new single-subscription stream from the future.
     *
     * When the future completes, the stream will fire one event, either
     * data or error, and then close with a done-event.
     */
    protected static _fromFuture<T>(future: Future<T>): DartStream<T>;
    static fromFuture: new <T>(future: Future<T>) => DartStream<T>;
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
    protected static _fromFutures<T>(futures: DartIterable<Future<T>>): DartStream<T>;
    static fromFutures: new <T>(futures: DartIterable<Future<T>>) => DartStream<T>;
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
    static _fromIterable<T>(data: DartIterable<T>): DartStream<T>;
    static fromIterable: new <T>(data: DartIterable<T>) => DartStream<T>;
    /**
     * Creates a stream that repeatedly emits events at [period] intervals.
     *
     * The event values are computed by invoking [computation]. The argument to
     * this callback is an integer that starts with 0 and is incremented for
     * every event.
     *
     * If [computation] is omitted the event values will all be `null`.
     */
    static _periodic<T>(period: DartDuration, computation?: (computationCount: int) => T): DartStream<T>;
    static periodic: new <T>(period: DartDuration, computation?: (computationCount: int) => T) => DartStream<T>;
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
    protected static _eventTransformed<T>(source: DartStream<any>, mapSink: (sink: DartEventSink<T>) => DartEventSink<any>): DartStream<T>;
    static eventTransformed: new <T>(source: DartStream<any>, mapSink: (sink: DartEventSink<T>) => DartEventSink<any>) => DartStream<T>;
    /**
     * Whether this stream is a broadcast stream.
     */
    readonly isBroadcast: bool;
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
    asBroadcastStream(_?: {
        onListen?: (subscription: DartStreamSubscription<T>) => any;
        onCancel?: (subscription: DartStreamSubscription<T>) => any;
    }): DartStream<T>;
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
    listen(onData: (event: T) => any, _?: {
        onError?: Function;
        onDone?: () => any;
        cancelOnError?: bool;
    }): DartStreamSubscription<T>;
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
    where(test: (event: T) => bool): DartStream<T>;
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
    map<S>(convert: (event: T) => S): DartStream<S>;
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
    asyncMap<E>(convert: (event: T) => FutureOr<E>): DartStream<E>;
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
    asyncExpand<E>(convert: (event: T) => DartStream<E>): DartStream<E>;
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
    handleError(onError: Function, _?: {
        test: (error: any) => bool;
    }): DartStream<T>;
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
    expand<S>(convert: (value: T) => DartIterable<S>): DartStream<S>;
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
    pipe(streamConsumer: DartStreamConsumer<T>): Future<any>;
    /**
     * Chains this stream as the input of the provided [StreamTransformer].
     *
     * Returns the result of [:streamTransformer.bind:] itself.
     *
     * The `streamTransformer` can decide whether it wants to return a
     * broadcast stream or not.
     */
    transform<S>(streamTransformer: DartStreamTransformer<T, S>): DartStream<S>;
    /**
     * Reduces a sequence of values by repeatedly applying [combine].
     */
    reduce(combine: (previous: T, element: T) => T): Future<T>;
    /** Reduces a sequence of values by repeatedly applying [combine]. */
    fold<S>(initialValue: S, combine: (previous: S, element: T) => S): Future<S>;
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
    join(separator?: string): Future<String>;
    /**
     * Checks whether [needle] occurs in the elements provided by this stream.
     *
     * Completes the [Future] when the answer is known.
     * If this stream reports an error, the [Future] will report that error.
     */
    contains(needle: any): Future<bool>;
    /**
     * Executes [action] on each data event of the stream.
     *
     * Completes the returned [Future] when all events of the stream
     * have been processed. Completes the future with an error if the
     * stream has an error event, or if [action] throws.
     */
    forEach(action: (element: T) => any): Future<any>;
    /**
     * Checks whether [test] accepts all elements provided by this stream.
     *
     * Completes the [Future] when the answer is known.
     * If this stream reports an error, the [Future] will report that error.
     */
    every(test: (element: T) => bool): Future<bool>;
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
    any(test: (element: T) => bool): Future<bool>;
    /** Counts the elements in the stream. */
    readonly length: Future<int>;
    /**
     * Reports whether this stream contains any elements.
     *
     * Stops listening to the stream after the first element has been received.
     *
     * Internally the method cancels its subscription after the first element.
     * This means that single-subscription (non-broadcast) streams are closed and
     * cannot be reused after a call to this getter.
     */
    readonly isEmpty: Future<bool>;
    /** Collects the data of this stream in a [List]. */
    toList(): Future<DartList<T>>;
    /**
     * Collects the data of this stream in a [Set].
     *
     * The returned set is the same type as returned by `new Set<T>()`.
     * If another type of set is needed, either use [forEach] to add each
     * element to the set, or use
     * `toList().then((list) => new SomeOtherSet.from(list))`
     * to create the set.
     */
    toSet(): Future<DartSet<T>>;
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
    drain<E>(futureValue?: E): Future<E>;
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
    take(count: int): DartStream<T>;
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
    takeWhile(test: (element: T) => bool): DartStream<T>;
    /**
     * Skips the first [count] data events from this stream.
     *
     * The returned stream is a broadcast stream if this stream is.
     * For a broadcast stream, the events are only counted from the time
     * the returned stream is listened to.
     */
    skip(count: int): DartStream<T>;
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
    skipWhile(test: (element: T) => bool): DartStream<T>;
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
    distinct(equals?: (previous: T, next: T) => bool): DartStream<T>;
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
    readonly first: Future<T>;
    /**
     * Returns the last element of the stream.
     *
     * If an error event occurs before the first data event, the resulting future
     * is completed with that error.
     *
     * If this stream is empty (a done event occurs before the first data event),
     * the resulting future completes with a [StateError].
     */
    readonly last: Future<T>;
    /**
     * Returns the single element.
     *
     * If an error event occurs before or after the first data event, the
     * resulting future is completed with that error.
     *
     * If [this] is empty or has more than one element throws a [StateError].
     */
    readonly single: Future<T>;
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
    firstWhere(test: (element: T) => bool, _?: {
        defaultValue?: () => T;
    }): Future<T>;
    /**
     * Finds the last element in this stream matching [test].
     *
     * As [firstWhere], except that the last matching element is found.
     * That means that the result cannot be provided before this stream
     * is done.
     */
    lastWhere(test: (element: T) => bool, _?: {
        defaultValue?: () => T;
    }): Future<T>;
    /**
     * Finds the single element in this stream matching [test].
     *
     * Like [lastWhere], except that it is an error if more than one
     * matching element occurs in the stream.
     */
    singleWhere(test: (element: T) => bool): Future<T>;
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
    elementAt(index: int): Future<T>;
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
    timeout(timeLimit: DartDuration, _?: {
        onTimeout: (sink: DartEventSink<T>) => any;
    }): DartStream<T>;
    [Symbol.asyncIterator](): AsyncIterator<T>;
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
declare class DartStreamTransformer<S, T> {
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
    protected static _create<S, T>(onListen: (stream: DartStream<S>, cancelOnError: bool) => DartStreamSubscription<T>): DartStreamTransformer<S, T>;
    constructor(onListen: (stream: DartStream<S>, cancelOnError: bool) => DartStreamSubscription<T>);
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
    protected static _fromHandlers<S, T>(_?: {
        handleData?: (data: S, sink: DartEventSink<T>) => any;
        handleError?: (error: any, stackTrace: DartStackTrace, sink: DartEventSink<T>) => any;
        handleDone?: (sink: DartEventSink<T>) => any;
    }): DartStreamTransformer<S, T>;
    static fromHandlers: new <S, T>(_?: {
        handleData?: (data: S, sink: DartEventSink<T>) => any;
        handleError?: (error: any, stackTrace: DartStackTrace, sink: DartEventSink<T>) => any;
        handleDone?: (sink: DartEventSink<T>) => any;
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
    bind(stream: DartStream<S>): DartStream<T>;
}
/**
 * Type of a stream controller's `onListen`, `onPause` and `onResume` callbacks.
 */
declare type ControllerCallback = () => any;
/**
 * Type of stream controller `onCancel` callbacks.
 *
 * The callback may return either `void` or a future.
 */
declare type ControllerCancelCallback = () => any;
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
declare class DartStreamController<T> implements DartStreamSink<T> {
    /** The stream that this controller is controlling. */
    readonly stream: DartStream<T>;
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
    static _StreamController<T>(_?: {
        onListen?: () => any;
        onPause?: () => any;
        onResume?: () => any;
        onCancel?: () => any;
        sync?: bool;
    }): DartStreamController<T>;
    constructor(_?: {
        onListen?: () => any;
        onPause?: () => any;
        onResume?: () => any;
        onCancel?: () => any;
        sync?: bool;
    });
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
    protected static _broadcast<T>(_?: {
        onListen?: () => any;
        onCancel?: () => any;
        sync: bool;
    }): DartStreamController<T>;
    static broadcast: new <T>(_?: {
        onListen?: () => any;
        onCancel?: () => any;
        sync: bool;
    }) => DartStreamController<T>;
    /**
     * The callback which is called when the stream is listened to.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    onListen: ControllerCallback;
    /**
     * The callback which is called when the stream is paused.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    onPause: ControllerCallback;
    /**
     * The callback which is called when the stream is resumed.
     *
     * May be set to `null`, in which case no callback will happen.
     *
     * Pause related callbacks are not supported on broadcast stream controllers.
     */
    onResume: ControllerCallback;
    /**
     * The callback which is called when the stream is canceled.
     *
     * May be set to `null`, in which case no callback will happen.
     */
    onCancel: ControllerCancelCallback;
    /**
     * Returns a view of this object that only exposes the [StreamSink] interface.
     */
    readonly sink: DartStreamSink<T>;
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
    readonly isClosed: bool;
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
    readonly isPaused: bool;
    /** Whether there is a subscriber on the [Stream]. */
    readonly hasListener: bool;
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
    add(event: T): void;
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
    addError(error: any, stackTrace: DartStackTrace): void;
    /**
     * Closes the stream.
     *
     * Listeners receive the done event at a later microtask. This behavior can be
     * overridden by using `sync` controllers. Note, however, that sync
     * controllers have to satisfy the preconditions mentioned in the
     * documentation of the constructors.
     */
    close(): Future<any>;
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
    addStream(source: DartStream<T>, _?: {
        cancelOnError?: bool;
    }): Future<any>;
    readonly done: Future<any>;
}
export { Future, DartCompleter, DartZoneSpecification, DartZone, DartTimer, runZoned, scheduleMicrotask, printToConsole, DartStream, DartStreamTransformer, DartEventSink, DartStreamSink, DartStreamController, dartAsync };
