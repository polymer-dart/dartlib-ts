import { Uri } from "../uri";
import { DartMap } from "../core";

describe('uri', () => {
    it('can parse some uri', () => {
        let uri: Uri = Uri.parse("http://www.dart-polymer.com/path?arg=val#/an-hash");

        expect(uri.scheme).toEqual('http');
    })

    it('can parse https uri',()=>{
        let uri :Uri = Uri.parse("https://elys.drafintech.it:443/alfresco/cmis/");
        expect(uri.scheme).toEqual('https');
        expect(uri.host).toEqual('elys.drafintech.it');
        expect(uri.port).toEqual(443);
    });

    it('allows for array params',()=>{
        let uri:Uri = new Uri.http("somewhere","/somePath",new DartMap.literal<string,any>([
            ["arg",["value1","value2"]]
        ]));
        expect(uri.toString()).toEqual("http://somewhere/somePath?arg=value1&arg=value2");
    });
});