/**
 * Dart Object
 */

export class DartObject extends Object {

}


export const OPERATOR_INDEX_ASSIGN = Symbol('[]=');
export const OPERATOR_INDEX = Symbol('[]');


export type PropertySetter<K, V> = (key: K, value: V) => void;
export type PropertyGetter<K, V> = (key: K) => V;


export type int = number;
export type long = number;
export type float = number;
export type double = number;
export type num = number;
export type bool = boolean;

export const UNINITIALIZED = Symbol('_uninitialized_');