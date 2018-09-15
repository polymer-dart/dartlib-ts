import { DartList } from "./core";
declare global {
    interface Array<T> extends DartList<T> {
    }
}
export declare function installDartExtensions(): void;
