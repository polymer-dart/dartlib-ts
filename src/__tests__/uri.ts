import { Uri } from "../uri";

describe('uri', () => {
    it('can parse some uri', () => {
        let uri: Uri = Uri.parse("http://www.dart-polymer.com/path?arg=val#/an-hash");

        expect(uri.scheme).toEqual('http');
    })
});