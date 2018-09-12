import {DartDuration, DartIterable, DartList} from "../core";
import {dartAsync, DartStream, Future} from "../async";
import {$with} from "../utils";

describe("async", () => {
    describe('future', () => {
        it("just creates a simple future?", async () => {
            let future = new Future.delayed(new DartDuration({seconds: 1}), () => "one second");

            let message: string = await future;

            expect(message).toEqual('one second');

        });

        it('creates an immediate future?', async () => {
            let future = new Future.value('hi');
            let message: string = await future;
            expect(message).toEqual('hi');
        });

        it('schedules a microtask ?', async () => {
            let future = new Future.microtask(() => 'hello');
            let message: string = await future;

            expect(message).toEqual('hello');
        });

        it('waits many futures ?', async () => {
            let future1 = new Future.delayed(new DartDuration({seconds: 1}), () => 'first');
            let future2 = new Future.delayed(new DartDuration({seconds: 2}), () => 'second');

            let future3 = Future.wait(new DartList.make(future1, future2));

            let list = await future3;

            expect(list.length).toEqual(2);
            expect(list[0]).toEqual('first');
            expect(list[1]).toEqual('second');
        });

        it('can chain another future', async () => {
            let future1 = new Future.delayed(new DartDuration({seconds: 1}), () => 1).then((l) => l * 100);
            let n = await future1;
            expect(n).toEqual(100);
        });

        it('can be created from promis', async () => {
            let future = new Future.fromPromise((async () => {
                return "hi";
            })());

            expect(await future).toEqual('hi');
        });

        it('async func', async () => {
            let fut: Future<number> = dartAsync(async (x: number) => {
                await new Future.delayed(new DartDuration({seconds: 1}));
                return x;
            })(101);

            expect(await fut).toEqual(101);
        });

        it('4 secs', async () => {
            let str = new Future.delayed(new DartDuration({seconds: 4}), () => '4 secs');
            expect(await str).toEqual('4 secs');
        });
    });

    describe('stream', () => {
        it('length works', async () => {
            let stream = new DartStream.fromFutures(
                new DartIterable.generate(5, (x) => new Future.delayed(new DartDuration({milliseconds: 500}), () => x)));

            let len = await stream.length;
            expect(len).toEqual(5);
        });

        it('join works', async () => {
            let stream = new DartStream.fromFutures(
                new DartIterable.generate(5, (x) => new Future.delayed(new DartDuration({milliseconds: 500}), () => x)));

            let str = await stream.join(',');
            expect(str).toEqual('0,1,2,3,4');
        });

        it('can be used as async iter', async () => {
            let stream = new DartStream.fromFutures(
                new DartIterable.generate(5, (x) => new Future.delayed(new DartDuration({milliseconds: 500}), () => x)));
            let n = 0;
            for await (let x of stream) {
                n += x;
            }

            expect(n).toEqual(12);

        });

    });
});