export var OperatorMethods;
(function (OperatorMethods) {
    OperatorMethods.INDEX_EQ = Symbol('[]=');
    OperatorMethods.INDEX = Symbol('[]');
    OperatorMethods.PLUS = Symbol('+');
    OperatorMethods.MINUS = Symbol('-');
    OperatorMethods.MULTIPLY = Symbol('*');
    OperatorMethods.DIVIDE = Symbol('/');
    OperatorMethods.QUOTIENT = Symbol('~/');
    OperatorMethods.EQUALS = Symbol('==');
    OperatorMethods.LT = Symbol('<');
    OperatorMethods.GT = Symbol('>');
    OperatorMethods.LEQ = Symbol('<=');
    OperatorMethods.GEQ = Symbol('>=');
    OperatorMethods.NEGATE = Symbol('-');
    OperatorMethods.COMPLEMENT = Symbol('~');
    OperatorMethods.XOR = Symbol('^');
    OperatorMethods.BINARY_OR = Symbol('|');
    OperatorMethods.BINARY_AND = Symbol('&');
    OperatorMethods.SHIFTRIGHT = Symbol('<<');
    OperatorMethods.SHIFTLEFT = Symbol('>>');
    OperatorMethods.MODULE = Symbol('%');
})(OperatorMethods || (OperatorMethods = {}));
export var Op;
(function (Op) {
    Op[Op["PLUS"] = 0] = "PLUS";
    Op[Op["MINUS"] = 1] = "MINUS";
    Op[Op["TIMES"] = 2] = "TIMES";
    Op[Op["DIVIDE"] = 3] = "DIVIDE";
    Op[Op["QUOTIENT"] = 4] = "QUOTIENT";
    Op[Op["EQUALS"] = 5] = "EQUALS";
    Op[Op["INDEX"] = 6] = "INDEX";
    Op[Op["INDEX_ASSIGN"] = 7] = "INDEX_ASSIGN";
    Op[Op["LT"] = 8] = "LT";
    Op[Op["GT"] = 9] = "GT";
    Op[Op["LEQ"] = 10] = "LEQ";
    Op[Op["GEQ"] = 11] = "GEQ";
    Op[Op["NEG"] = 12] = "NEG";
    Op[Op["BITNEG"] = 13] = "BITNEG";
    Op[Op["XOR"] = 14] = "XOR";
    Op[Op["BITOR"] = 15] = "BITOR";
    Op[Op["BITAND"] = 16] = "BITAND";
    Op[Op["SHIFTRIGHT"] = 17] = "SHIFTRIGHT";
    Op[Op["SHIFTLEFT"] = 18] = "SHIFTLEFT";
    Op[Op["MODULE"] = 19] = "MODULE";
})(Op || (Op = {}));
const OpSymbolMap = new Map([
    [Op.INDEX, OperatorMethods.INDEX],
    [Op.INDEX_ASSIGN, OperatorMethods.INDEX_EQ],
    [Op.EQUALS, OperatorMethods.EQUALS],
    [Op.PLUS, OperatorMethods.PLUS],
    [Op.MINUS, OperatorMethods.MINUS],
    [Op.TIMES, OperatorMethods.MULTIPLY],
    [Op.DIVIDE, OperatorMethods.DIVIDE],
    [Op.QUOTIENT, OperatorMethods.QUOTIENT],
    [Op.LT, OperatorMethods.LT],
    [Op.GT, OperatorMethods.GT],
    [Op.LEQ, OperatorMethods.LEQ],
    [Op.GEQ, OperatorMethods.GEQ],
    [Op.NEG, OperatorMethods.NEGATE],
    [Op.BITNEG, OperatorMethods.COMPLEMENT],
    [Op.XOR, OperatorMethods.XOR],
    [Op.BITOR, OperatorMethods.BINARY_OR],
    [Op.BITAND, OperatorMethods.BINARY_AND],
    [Op.SHIFTRIGHT, OperatorMethods.SHIFTRIGHT],
    [Op.SHIFTLEFT, OperatorMethods.SHIFTLEFT],
    [Op.MODULE, OperatorMethods.MODULE],
]);
export const UNINITIALIZED = Symbol('_uninitialized_');
const OLD_DEFS = Symbol('OLD_DEFS');
function getOldDefs(t) {
    return t[OLD_DEFS] = t[OLD_DEFS] || {};
}
export function safeCallOriginal(target, name, ...args) {
    let f;
    if (target[OLD_DEFS] && target[OLD_DEFS].hasOwnProperty(name)) {
        f = target[OLD_DEFS][name];
    }
    else {
        f = target[name];
    }
    f.apply(this, args);
}
export function copyProps(s, t, excludes) {
    excludes = excludes || new Set(['constructor']);
    Object.getOwnPropertySymbols(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        if (t.hasOwnProperty(n)) {
            Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n));
    });
    Object.getOwnPropertyNames(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        // save old def
        if (t.hasOwnProperty(n)) {
            Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n));
    });
}
export function mixin(mixin, base) {
    class Class extends base {
    }
    copyProps(mixin.prototype, Class.prototype);
    return Class;
}
const META_DATA = Symbol('META_DATA');
/**
 * Simple decorator to apply a mixin without adding type info
 */
export function With(mixin) {
    return (ctor) => {
        copyProps(mixin.prototype, ctor.prototype);
        copyProps(mixin, ctor, new Set(['constructor', 'prototype']));
        getMetadata(ctor).implements.push(mixin);
    };
}
function getMetadata(o) {
    if (!o.hasOwnProperty(META_DATA)) {
        o[META_DATA] = {
            constructors: new Map(),
            abstracts: new Map(),
            implements: []
        };
    }
    return o[META_DATA];
}
function callConstructor(ctor, name, target, ...args) {
    if (args.length > 0 && args[0] === UNINITIALIZED) {
        return;
    }
    let m = getMetadata(ctor);
    if (m.constructors.has(name)) {
        m.constructors.get(name).ctor.apply(target, args);
    }
}
export function DartConstructor(_) {
    let { default: isDefault, factory, name: _name } = Object.assign({ default: false, factory: false, name: undefined }, _);
    return (tgt, methodName, descriptor) => {
        // save it int the constructor table
        let T = factory ? tgt : tgt.constructor;
        let meta = getMetadata(T);
        if (isDefault) {
            meta.constructors.set('', { ctor: descriptor.value, factory: factory });
        }
        else {
            let ctor;
            let name = _name;
            if (factory) {
                if (typeof methodName == 'string' && (name === undefined || name === null) && methodName.startsWith('_')) {
                    name = methodName.substring(1); // remove prefix '_' from method name
                }
                // use that as constructor
                ctor = function (...args) {
                    return descriptor.value.call(null, ...args);
                };
            }
            else {
                ctor = function (...args) {
                    descriptor.value.call(this, ...args);
                };
            }
            Object.setPrototypeOf(ctor, Object.getPrototypeOf(tgt.constructor));
            copyProps(tgt.constructor, ctor);
            meta.constructors.set(methodName, { ctor: ctor, factory: factory });
            T[name || methodName] = ctor;
        }
    };
}
export const defaultConstructor = DartConstructor({ default: true });
export const defaultFactory = DartConstructor({ default: true, factory: true });
export const NamedConstructor = (name) => DartConstructor({ default: false, name: name });
export const namedConstructor = NamedConstructor();
export const NamedFactory = (name) => DartConstructor({ default: false, factory: true, name: name });
export const namedFactory = NamedFactory();
/**
 * Replace a constructor with a delayed construction logic
 * @constructor
 */
export const DartClass = (target) => {
    let ctor;
    const metadata = getMetadata(target);
    let def = metadata.constructors.get('');
    if (def == null) {
        ctor = target;
    }
    else {
        if (def.factory) {
            // use that as constructor
            ctor = function () {
                return def.ctor.call(null, ...arguments);
            };
        }
        else {
            ctor = function (...args) {
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
    return ctor;
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
export const Abstract = (target, name, descr) => {
    getMetadata(target.constructor).abstracts.set(name, descr);
};
export const AbstractProperty = (target, name) => {
    getMetadata(target.constructor).abstracts.set(name, name);
};
export function AbstractMethods(...props) {
    return (ctor) => {
        props.forEach((p) => {
            getMetadata(ctor).abstracts.set(p, Object.getOwnPropertyDescriptor(ctor.prototype, p));
        });
    };
}
export function Implements(...intf) {
    return (ctor) => {
        let meta = getMetadata(ctor);
        meta.implements.push(...intf);
    };
}
function _isA(ctor, cls) {
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
export function isA(obj, cls) {
    if (obj == null) {
        return false;
    }
    let ctor = Object.getPrototypeOf(obj).constructor;
    return _isA(ctor, cls);
}
export function Operator(op) {
    return (target, name, descriptor) => {
        // Add another method that's an alias to this
        Object.defineProperty(target, OpSymbolMap.get(op), {
            value: function () {
                return this[name].call(this, ...arguments);
            }
        });
    };
}
export function $with(t, ...expressions) {
    expressions.forEach((e) => e(t));
    return t;
}
/**
 * Apply operator o to arguments
 * @param o
 * @param first the first argument should define the operator
 * @param rest
 */
export function op(o, first, ...rest) {
    let sym = OpSymbolMap.get(o);
    if (!first[sym]) {
        throw `No operator ${o} in ${first}`;
    }
    return first[OpSymbolMap.get(o)](...rest);
}
export function get(obj, k) {
    return obj[OperatorMethods.INDEX](k);
}
export function set(obj, k, v) {
    obj[OperatorMethods.INDEX_EQ](k, v);
}
export function DartClassAnnotation(anno) {
    return (target) => {
        //getDartMetadata(target).annotations.push(anno);
    };
}
export function DartMethodAnnotation(anno) {
    return (target, name, descriptor) => {
        //registerPropAnno(anno, target, name);
    };
}
/*
let registerPropAnno: (anno: IAnnotation, target: Object, name: string | symbol) => void = (anno: IAnnotation, target: Object, name: string | symbol) => {
    let md: IDartMetadata = getDartMetadata(target.constructor);

    let propAnnos: Map<string, Array<any>> = md.propertyAnnotations.get(name);
    if (propAnnos == null) {
        propAnnos = new Map<string, Array<any>>();
        md.propertyAnnotations.set(name, propAnnos);
    }

    let key: string = `{${anno.library}}#{${anno.type}}`;
    let values: Array<any> = propAnnos.get(key);
    if (values == null) {
        values = [];
        propAnnos.set(key, values);
    }

    values.push(anno.value);
};
*/
export function DartPropertyAnnotation(anno) {
    return (target, name) => {
        //registerPropAnno(anno, target, name);
    };
}
//# sourceMappingURL=utils.js.map