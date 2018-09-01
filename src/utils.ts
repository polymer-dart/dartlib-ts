export const UNINITIALIZED = Symbol('_uninitialized_');


type Constructor<X> = {
    new(...args: any[]): X,
    prototype: any
}

function copyProps(s: any, t: any, excludes?: Set<string | symbol>): void {
    excludes = excludes || new Set(['constructor']);
    Object.getOwnPropertyNames(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n) as PropertyDescriptor);
    });

    Object.getOwnPropertySymbols(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n) as PropertyDescriptor);
    });

}

export function mixin<Mixin, Base>(mixin: Constructor<Mixin>, base: Constructor<Base>): Constructor<Mixin & Base> {
    class Class extends (base as Constructor<any>) {
        constructor(...args: any[]) {
            super(...args);
        }
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
    };
}

interface ConstructorData {
    ctor: Function,
    factory: boolean
}

interface Metadata {
    parent?: Metadata,
    constructors?: Map<string, ConstructorData>,
    abstracts?: Map<string | symbol, PropertyDescriptor | string | symbol>
}

function getMetadata(o: any): Metadata {
    if (!o.hasOwnProperty(META_DATA)) {
        o[META_DATA] = {
            constructors: new Map(),
            abstracts: new Map()
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
    return (tgt: any, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {
        // save it int the constructor table

        let T = factory ? tgt : tgt.constructor;
        let meta = getMetadata(T);

        if (isDefault) {
            meta.constructors.set('', {ctor: descriptor.value, factory: factory});
        } else {
            let ctor;
            let name: string | symbol = _name;
            if (factory) {
                if ((name === undefined || name === null) && methodName.startsWith('_')) {
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

            meta.constructors.set(methodName, {ctor: ctor, factory: factory});
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