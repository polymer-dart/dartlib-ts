import {DartDateTime, DartDuration, DartIterable, DartList} from "../core";
import {dartAsync, DartCompleter, DartStream, Future, stream} from "../async";
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

            let future3 = Future.wait(new DartList.literal(future1, future2));

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

        it('catches async errors',async()=>{
            let error = "not";
            try {
                let c = new DartCompleter();
                await new Future.delayed(new DartDuration({seconds:1})).then(()=>{
                    c.completeError("error");
                });
                await c.future;
            } catch (er) {
                error=er;
            }
            expect(error).toEqual('error');
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

            expect(n).toEqual(10);

        });

        it('works with async gen', async () => {

            let gen: DartStream<number> = stream(async function* () {
                for (let i = 0; i < 3; i++) {
                    await new Future.delayed(new DartDuration({milliseconds: 500}));
                    yield i;
                }
            });


            let start = new DartDateTime.now();
            expect(await gen.join(',')).toEqual('0,1,2');
            let end = new DartDateTime.now();
            let dur = end.difference(start);
            expect(Math.floor(dur.inMilliseconds / 100)).toBeCloseTo(15);
            expect(() => gen.join(',')).toThrow();

        });

    });

    describe('completer', () => {
        it('creates a future', async () => {

            let c = new DartCompleter<string>();

            new Future.delayed(new DartDuration({seconds: 1})).then((_) => c.complete('hi'));


            let res = await c.future;

            expect(res).toEqual('hi');
        });
    });

});