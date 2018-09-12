import {DartDuration, DartList} from "../core";
import {Future} from "../async";
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

            let future3 = Future.wait($with(new DartList<Future<string>>(), (l) => l.add(future1), (l) => l.add(future2)));

            let list = await future3;

            expect(list.length).toEqual(2);
            expect(list[0]).toEqual('first');
            expect(list[1]).toEqual('second');
        });
    });

});