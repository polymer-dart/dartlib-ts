import {DartList, JSArray} from "./core";
import {copyProps, With} from "./utils";

declare global {
    interface Array<T> extends DartList<T> {

    }

}



export function installDartExtensions() {
    //Array = JSArray;
    //copyProps(JSArray.prototype, Array.prototype,new Set(['prototype','length','forEach','constructor','join']));
    //copyProps(mixin, ctor, new Set(['constructor', 'prototype']));
   // With(JSArray)(Array.prototype.constructor);
}
