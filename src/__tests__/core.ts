import {DartDuration} from "../core";

describe('core', () => {
    describe('duration', () => {
        it('calcs millis ok', () => {

            expect(new DartDuration({seconds: 1}).inMilliseconds).toEqual(1000);
        });
    });
});