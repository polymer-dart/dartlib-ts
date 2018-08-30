/**
 * The supertype for JSString and JSArray. Used by the backend as to
 * have a type mask that contains the objects that we can use the
 * native JS [] operator and length on.
 */
import {int} from "../core";

export interface JSIndexable<E> {
    [index: number]: E

    readonly length: int
}

/**
 * The supertype for JSMutableArray and
 * JavaScriptIndexingBehavior. Used by the backend to have a type mask
 * that contains the objects we can use the JS []= operator on.
 */
export interface JSMutableIndexable<E> extends JSIndexable<E> {
}