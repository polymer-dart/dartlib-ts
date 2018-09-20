export const OPERATOR_INDEX_ASSIGN = Symbol('[]=');
export const OPERATOR_INDEX = Symbol('[]');
export const OPERATOR_PLUS = Symbol('+');
export const OPERATOR_MINUS = Symbol('-');
export const OPERATOR_TIMES = Symbol('*');
export const OPERATOR_DIVIDE = Symbol('/');
export const OPERATOR_QUOTIENT = Symbol('~/');
export const EQUALS_OPERATOR = Symbol('==');
export const OPERATOR_LT = Symbol('<');
export const OPERATOR_GT = Symbol('>');
export const OPERATOR_LEQ = Symbol('<=');
export const OPERATOR_GEQ = Symbol('>=');
export const OPERATOR_NEG = Symbol('-');
export const OPERATOR_BITNEG = Symbol('~');
export const OPERATOR_XOR = Symbol('^');
export const OPERATOR_BITOR = Symbol('|');
export const OPERATOR_BITAND = Symbol('&');
export const OPERATOR_SHIFTRIGHT = Symbol('<<');
export const OPERATOR_SHIFTLEFT = Symbol('>>');
export const OPERATOR_INTDIVIDE = Symbol('~/');
export const OPERATOR_MODULE = Symbol('%');

export enum Op {
    PLUS,
    MINUS,
    TIMES,
    DIVIDE,
    QUOTIENT,
    EQUALS,
    INDEX,
    INDEX_ASSIGN,
    LT,
    GT,
    LEQ,
    GEQ,
    NEG,
    BITNEG,
    XOR,
    BITOR,
    BITAND,
    SHIFTRIGHT,
    SHIFTLEFT,
    INTDIVIDE,
    MODULE,
}

const OpSymbolMap: Map<Op, symbol> = new Map([
    [Op.INDEX, OPERATOR_INDEX],
    [Op.INDEX_ASSIGN, OPERATOR_INDEX_ASSIGN],
    [Op.EQUALS, EQUALS_OPERATOR],
    [Op.PLUS, OPERATOR_PLUS],
    [Op.MINUS, OPERATOR_MINUS],
    [Op.TIMES, OPERATOR_TIMES],
    [Op.DIVIDE, OPERATOR_DIVIDE],
    [Op.QUOTIENT, OPERATOR_QUOTIENT],
    [Op.LT, OPERATOR_LT],
    [Op.GT, OPERATOR_GT],
    [Op.LEQ, OPERATOR_LEQ],
    [Op.GEQ, OPERATOR_GEQ],
    [Op.NEG, OPERATOR_NEG],
    [Op.BITNEG, OPERATOR_BITNEG],
    [Op.XOR, OPERATOR_XOR],
    [Op.BITOR, OPERATOR_BITOR],
    [Op.BITAND, OPERATOR_BITAND],
    [Op.SHIFTRIGHT, OPERATOR_SHIFTRIGHT],
    [Op.SHIFTLEFT, OPERATOR_SHIFTLEFT],
    [Op.INTDIVIDE, OPERATOR_INTDIVIDE],
    [Op.MODULE, OPERATOR_MODULE],
]);

export type int = number;
export type long = number;
export type float = number;
export type double = number;
export type num = number;
export type bool = boolean;


export const UNINITIALIZED = Symbol('_uninitialized_');


type Constructor<X extends {}> = {
    new(...args: any[]): X,
    prototype: any
}

const OLD_DEFS: symbol = Symbol('OLD_DEFS');

function getOldDefs(t: any): any {
    return t[OLD_DEFS] = t[OLD_DEFS] || {};

}

export function safeCallOriginal(target: any, name: string | symbol, ...args: any[]): any {
    let f: Function;
    if (target[OLD_DEFS] && target[OLD_DEFS].hasOwnProperty(name)) {
        f = target[OLD_DEFS][name];
    } else {
        f = target[name];
    }
    f.apply(this, args);
}

export function copyProps(s: any, t: any, excludes?: Set<string | symbol>): void {
    excludes = excludes || new Set(['constructor']);

    Object.getOwnPropertySymbols(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        if (t.hasOwnProperty(n)) {
            Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n) as PropertyDescriptor);
    });

    Object.getOwnPropertyNames(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        // save old def
        if (t.hasOwnProperty(n)) {
            Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n) as PropertyDescriptor);
    });

}

export function mixin<Mixin extends {}, Base extends {}>(mixin: Constructor<Mixin>, base: Constructor<Base>): Constructor<Mixin & Base> {
    class Class extends (base as Constructor<{}>) {
    }

    copyProps(mixin.prototype, Class.prototype);

    return Class as  Constructor<Mixin & Base>;
}

const META_DATA = Symbol('META_DATA');

/**
 * Simple decorator to apply a mixin without adding type info
 */

export function With(mixin: any): ClassDecorator {
    return (ctor) => {
        copyProps(mixin.prototype, ctor.prototype);
        copyProps(mixin, ctor, new Set(['constructor', 'prototype']));
        getMetadata(ctor).implements.push(mixin);
    };
}

interface ConstructorData {
    ctor: Function,
    factory: boolean
}

interface Metadata {
    parent?: Metadata,
    constructors?: Map<string, ConstructorData>,
    abstracts?: Map<string | symbol, PropertyDescriptor | string | symbol>,
    implements?: Array<any>
}

function getMetadata(o: any): Metadata {
    if (!o.hasOwnProperty(META_DATA)) {
        o[META_DATA] = {
            constructors: new Map(),
            abstracts: new Map(),
            implements: []
        }
    }

    return o[META_DATA];
}

function callConstructor(ctor: any, name: string, target: any, ...args: any[]) {
    if (args.length > 0 && args[0] === UNINITIALIZED) {
        return;
    }
    let m = getMetadata(ctor);
    if (m.constructors.has(name)) {
        m.constructors.get(name).ctor.apply(target, args);
    }
}


export function DartConstructor(_: { default?: boolean, factory?: boolean, name?: string }): MethodDecorator {
    let {default: isDefault, factory, name: _name} = Object.assign({default: false, factory: false, name: undefined}, _);
    return (tgt: any, methodName: PropertyKey, descriptor: TypedPropertyDescriptor<any>) => {
        // save it int the constructor table

        let T = factory ? tgt : tgt.constructor;
        let meta = getMetadata(T);

        if (isDefault) {
            meta.constructors.set('', {ctor: descriptor.value, factory: factory});
        } else {
            let ctor;
            let name: string | symbol = _name;
            if (factory) {
                if (typeof methodName == 'string' && (name === undefined || name === null) && methodName.startsWith('_')) {
                    name = methodName.substring(1);   // remove prefix '_' from method name
                }


                // use that as constructor
                ctor = function (...args: any[]) {
                    return descriptor.value.call(null, ...args);
                }
            } else {
                ctor = function (...args: any[]) {
                    descriptor.value.call(this, ...args);
                }
            }

            Object.setPrototypeOf(ctor, Object.getPrototypeOf(tgt.constructor));
            copyProps(tgt.constructor, ctor);

            meta.constructors.set(methodName as string, {ctor: ctor, factory: factory});
            T[name || methodName] = ctor;
        }
    };
}

export const defaultConstructor = DartConstructor({default: true});
export const defaultFactory = DartConstructor({default: true, factory: true});
export const NamedConstructor = (name?: string) => DartConstructor({default: false, name: name});
export const namedConstructor = NamedConstructor();
export const NamedFactory = (name?: string) => DartConstructor({default: false, factory: true, name: name});
export const namedFactory = NamedFactory();


/**
 * Replace a constructor with a delayed construction logic
 * @constructor
 */
export const DartClass: ClassDecorator = (target) => {
    let ctor;
    const metadata = getMetadata(target);
    let def = metadata.constructors.get('');
    if (def == null) {
        ctor = target;
    } else {
        if (def.factory) {
            // use that as constructor
            ctor = function () {
                return def.ctor.call(null, ...arguments);
            }
        } else {
            ctor = function (...args: any[]) {
                callConstructor(ctor, '', this, ...args);
            };
        }


        Object.setPrototypeOf(ctor, Object.getPrototypeOf(target));
        copyProps(target, ctor);
    }
    // Remove abstract from prototype
    if (metadata.abstracts) {
        for (let k of metadata.abstracts.keys()) {

            delete ctor.prototype[k];
        }
    }


    return ctor as any;
    /*
    return class X extends (target as any as Constructor<any>) {
        constructor(...args) {
            super(UNINITIALIZED);
            if (args.length == 0 || args[0] !== UNINITIALIZED && this[UNINITIALIZED])
                this[UNINITIALIZED].apply(this, args);
        }
    } as any;*/
};

/* Mark a method abstract to be removed by the DartClass */
export const Abstract: MethodDecorator = (target, name, descr) => {
    getMetadata(target.constructor).abstracts.set(name, descr);
};

export const AbstractProperty: PropertyDecorator = (target, name) => {
    getMetadata(target.constructor).abstracts.set(name, name);
};


export function AbstractMethods(...props: Array<symbol | string>): ClassDecorator {
    return (ctor) => {
        props.forEach((p) => {
            getMetadata(ctor).abstracts.set(p, Object.getOwnPropertyDescriptor(ctor.prototype, p));
        });

    }
}

export function Implements(...intf: any[]) {
    return (ctor) => {
        let meta = getMetadata(ctor);
        meta.implements.push(...intf);
    }
}

function _isA(ctor, cls): boolean {
    if (ctor == null) {
        return false;
    }
    if (ctor === cls) {
        return true;
    }
    // Check interfaces
    let meta = getMetadata(ctor);
    if (meta.implements.some(((intf) => _isA(intf, cls)))) {
        return true;
    }

    if (ctor !== Object) {
        return _isA(Object.getPrototypeOf(ctor), cls);
    }
    return false;
}

export function isA(obj, cls): boolean {
    if (obj == null) {
        return false;
    }
    let ctor = Object.getPrototypeOf(obj).constructor;
    return _isA(ctor, cls);
}


export function Operator(op: Op): MethodDecorator {
    return (target, name, descriptor) => {
        // Add another method that's an alias to this
        Object.defineProperty(target, OpSymbolMap.get(op), {
            value: function () {
                return this[name].call(this, ...arguments);
            }
        });
    };
}

export function $with<T>(t: T, ...expressions: ((t: T) => any)[]): T {
    expressions.forEach((e) => e(t));
    return t;
}

/**
 * Apply operator o to arguments
 * @param o
 * @param first the first argument should define the operator
 * @param rest
 */
export function op(o: Op, first: any, ...rest: any[]): any {
    let sym = OpSymbolMap.get(o);
    if (!first[sym]) {
        throw `No operator ${o} in ${first}`;
    }
    return first[OpSymbolMap.get(o)](...rest);
}

/**
 * a better type checking operator index
 */

export interface IndexRead<K, V> {
    [OPERATOR_INDEX](k: K): V;
}

export function get<K, V>(obj: IndexRead<K, V>, k: K): V {
    return obj[OPERATOR_INDEX](k);
}

export interface IndexWrite<K, V> {
    [OPERATOR_INDEX_ASSIGN](k: K, v: V);
}

export function set<K, V>(obj: IndexWrite<K, V>, k: K, v: V) {
    obj[OPERATOR_INDEX_ASSIGN](k, v);
}