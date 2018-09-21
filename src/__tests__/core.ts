import {DartDuration, DartDateTime, print} from "../core";
import * as math from '../math';

describe('core', () => {
    describe('duration', () => {
        it('calcs millis ok', () => {

            expect(new DartDuration({seconds: 1}).inMilliseconds).toEqual(1000);
        });
    });

    describe('datetime', () => {
        it('creates a datetime', () => {
            let dt = new DartDateTime(1972, 12, 1);
            expect(dt.toIso8601String()).toEqual('1972-12-01T00:00:00.000');
            expect(dt.weekday).toEqual(5);
        });

        it('calc duration', () => {
            let dt = new DartDateTime.utc(1972, 12, 1);
            let xm = new DartDateTime.utc(1972, 12, 25, 0, 0, 0, 0, 0);

            let dif: DartDuration = xm.difference(dt);

            expect(dif.inDays).toEqual(24);
            expect(dif.inMinutes).toEqual(34560);
        })
    });


    describe('print', () => {
        it('works', () => {
            spyOn(console, 'log');
            print('whatever');

            expect(console.log).toBeCalledWith('whatever');
        });
    });

    describe('math', () => {
        it('E', () => {
            expect(math.properties.E).not.toBeNull();
        });
    })
});