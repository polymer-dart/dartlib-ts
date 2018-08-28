import {UNINITIALIZED} from "./core";

type Constructor<X> = {
    new(...args: any[]): X,
    prototype: any
}

function copyProps(s: any, t: any): void {
    Object.getOwnPropertyNames(s).forEach(n => {
        if (n === 'constructor') {
            return;
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n) as PropertyDescriptor);
    });

    Object.getOwnPropertySymbols(s).forEach(n => {
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

interface ConstructorData {
    ctor: Function,
    factory: boolean
}

interface Metadata {
    parent?: Metadata,
    constructors?: Map<string, ConstructorData>
}

function getMetadata(o: any): Metadata {
    if (!o.hasOwnProperty(META_DATA)) {
        o[META_DATA] = {
            constructors: new Map()
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
    let {default: isDefault, factory, name} = Object.assign({default: false, factory: false}, _);
    return (tgt: any, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {
        // save it int the constructor table

        let T = factory ? tgt : tgt.constructor;
        let meta = getMetadata(T);

        if (isDefault) {
            meta.constructors.set('', {ctor: descriptor.value, factory: factory});
        } else {
            let ctor;
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
    let def = getMetadata(target).constructors.get('');
    if (def && def.factory) {
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