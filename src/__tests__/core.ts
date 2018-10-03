import {DartDuration, DartDateTime, print, DartList, DartStackTrace, DartError} from "../core";
import * as math from '../math';
import {callMethod} from "../js_util";

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
            expect(math.properties.E).toEqual(Math.E);
        });
    })

    describe('js_util',()=>{
        it('callMethod',()=>{
            spyOn(console,'log');
            callMethod(console,'log',new DartList.literal('hi'));
            expect(console.log).toBeCalledWith('hi');
        })
    });

    describe('stacktrace',()=>{
        it('works with non object exception',()=>{
            let st:DartStackTrace;
            try {
                throw 'error'
            } catch (error) {
                st = new DartStackTrace.fromError(error);
            }

            expect(st).not.toBeNull();
           // console.log(st.toString());

        });

        it('works with non error exception',()=>{
            let st:DartStackTrace;
            try {
                throw new DartError('error');
            } catch (error) {
                st = new DartStackTrace.fromError(error);
            }

            expect(st).not.toBeNull();
          //  console.log(st.toString());

        });
    });
});