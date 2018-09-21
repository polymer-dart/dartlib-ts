import {DartList} from "./core";

export function callMethod(o,  method:string,  args:DartList<any>):any {
    return o[method].apply(o,args);
    //JS('Object|Null', '#[#].apply(#, #)', o, method, o, args);
}