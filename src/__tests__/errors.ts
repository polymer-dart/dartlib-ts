import * as errors from '../errors';

describe('errors', () => {
    it('creates index range error', () => {
        let err = new errors.RangeError.index(5, [], 'test', 'message', 10);
        expect(err).toBeInstanceOf(errors.RangeError);
        expect(err).toBeInstanceOf(errors.IndexError);
        expect(err.toString()).toEqual("RangeError (nodejs)message: index should be less than 0: 5");
    });
});