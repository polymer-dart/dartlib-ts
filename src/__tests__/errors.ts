import * as errors from '../core';

describe('errors', () => {
    it('creates index range error', () => {
        let err = new errors.RangeError.index(11, [], 'test', 'message', 10);
        expect(err).toBeInstanceOf(errors.RangeError);
        expect(err).toBeInstanceOf(errors.IndexError);
        expect(err.toString()).toEqual("RangeError (test)message: index should be less than 10: 11");
    });
});