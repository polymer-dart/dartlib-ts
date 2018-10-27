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
    OperatorMethods.NOT_EQUALS = Symbol('!=');
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
    OperatorMethods.NOT = Symbol('!');
    OperatorMethods.INCR = Symbol('++');
})(OperatorMethods || (OperatorMethods = {}));
export var Op;
(function (Op) {
    Op[Op["PLUS"] = 0] = "PLUS";
    Op[Op["MINUS"] = 1] = "MINUS";
    Op[Op["TIMES"] = 2] = "TIMES";
    Op[Op["DIVIDE"] = 3] = "DIVIDE";
    Op[Op["QUOTIENT"] = 4] = "QUOTIENT";
    Op[Op["EQUALS"] = 5] = "EQUALS";
    Op[Op["NOT_EQUALS"] = 6] = "NOT_EQUALS";
    Op[Op["INDEX"] = 7] = "INDEX";
    Op[Op["INDEX_ASSIGN"] = 8] = "INDEX_ASSIGN";
    Op[Op["LT"] = 9] = "LT";
    Op[Op["GT"] = 10] = "GT";
    Op[Op["LEQ"] = 11] = "LEQ";
    Op[Op["GEQ"] = 12] = "GEQ";
    Op[Op["NEG"] = 13] = "NEG";
    Op[Op["BITNEG"] = 14] = "BITNEG";
    Op[Op["XOR"] = 15] = "XOR";
    Op[Op["BITOR"] = 16] = "BITOR";
    Op[Op["BITAND"] = 17] = "BITAND";
    Op[Op["SHIFTRIGHT"] = 18] = "SHIFTRIGHT";
    Op[Op["SHIFTLEFT"] = 19] = "SHIFTLEFT";
    Op[Op["MODULE"] = 20] = "MODULE";
    Op[Op["NOT"] = 21] = "NOT";
    Op[Op["INCR"] = 22] = "INCR";
})(Op || (Op = {}));
const OpSymbolMap = new Map([
    [Op.INDEX, OperatorMethods.INDEX],
    [Op.INDEX_ASSIGN, OperatorMethods.INDEX_EQ],
    [Op.EQUALS, OperatorMethods.EQUALS],
    [Op.NOT_EQUALS, OperatorMethods.NOT_EQUALS],
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
    [Op.NOT, OperatorMethods.NOT],
    [Op.INCR, OperatorMethods.INCR]
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
export function copyProps(s, t, _) {
    let { excludes, dstMeta, overwrite } = Object.assign({ excludes: new Set(['constructor']), overwrite: true }, _);
    //excludes = excludes || new Set(['constructor']);
    Object.getOwnPropertySymbols(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        if (t.hasOwnProperty(n) && dstMeta && !dstMeta.abstracts.has(n)) {
            if (overwrite) {
                Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
            }
            else {
                return;
            }
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n));
        // if meta => remove abstract
        if (dstMeta) {
            dstMeta.abstracts.delete(n);
        }
    });
    Object.getOwnPropertyNames(s).forEach(n => {
        if (excludes.has(n)) {
            return;
        }
        // save old def
        if (t.hasOwnProperty(n) && dstMeta && !dstMeta.abstracts.has(n)) {
            if (overwrite) {
                Object.defineProperty(getOldDefs(t), n, Object.getOwnPropertyDescriptor(t, n));
            }
            else {
                return;
            }
        }
        Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n));
        // if meta => remove abstract
        if (dstMeta) {
            dstMeta.abstracts.delete(n);
        }
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
export function With(...mixins) {
    return (ctor) => {
        mixins.forEach(mixin => {
            let srcMeta = getMetadata(mixin);
            let dstMeta = getMetadata(ctor);
            let excludesFromPrototype = new Set(srcMeta.abstracts.keys());
            excludesFromPrototype.add('constructor');
            copyProps(mixin.prototype, ctor.prototype, { excludes: excludesFromPrototype, dstMeta, overwrite: false });
            copyProps(mixin, ctor, { excludes: new Set(['constructor', 'prototype', META_DATA]), overwrite: false });
            getMetadata(ctor).implements.push(mixin);
        });
    };
}
export function applyMixin(t, m) {
    let srcMeta = getMetadata(mixin);
    let dstMeta = getMetadata(t.constructor);
    let excludesFromPrototype = new Set(srcMeta.abstracts.keys());
    excludesFromPrototype.add('constructor');
    copyProps(mixin.prototype, t, { excludes: excludesFromPrototype, dstMeta, overwrite: false });
    return t;
}
export function AbstractSymbols(...symbols) {
    return (ctor) => {
        let meta = getMetadata(ctor);
        symbols.forEach((sym) => meta.abstracts.set(sym, sym));
    };
}
export function getMetadata(o) {
    if (!o.hasOwnProperty(META_DATA)) {
        o[META_DATA] = {
            constructors: new Map(),
            abstracts: new Map(),
            implements: [],
            annotations: [],
            propertyAnnotations: new Map(),
            mixins: new Set()
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
                if (typeof methodName == 'string' && (name === undefined || name === null) && methodName.match(/^[_$]/)) {
                    name = methodName.substring(1); // remove prefix '_/$' from method name
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
function _isA(ctor, cls, visited) {
    if (ctor == null || (visited && visited.has(ctor))) {
        return false;
    }
    if (ctor === cls) {
        return true;
    }
    visited = visited || new Set();
    visited.add(ctor);
    // Check interfaces
    let meta = getMetadata(ctor);
    if (meta.implements.some(((intf) => _isA(intf, cls, visited)))) {
        return true;
    }
    if (ctor !== Object) {
        return _isA(Object.getPrototypeOf(ctor), cls, visited);
    }
    return false;
}
export function isA(obj, cls) {
    if (obj == null) {
        return false;
    }
    let ctor = Object.getPrototypeOf(obj).constructor;
    return _isA(ctor, cls, new Set());
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
export function _equals(a, b) {
    if (a && a[OperatorMethods.EQUALS]) {
        return a[OperatorMethods.EQUALS](b);
    }
    else if (b && b[OperatorMethods.EQUALS]) {
        return b[OperatorMethods.EQUALS](a);
    }
    return a === b;
}
const defaultOps = new Map([
    [Op.INDEX, (t, i) => t[i]],
    [Op.INDEX_ASSIGN, (t, i, v) => t[i] = v],
    [Op.EQUALS, (l, r) => l == null && r == null || l === r],
    [Op.NOT_EQUALS, (l, r) => !(l == null && r == null || l === r)],
    [Op.PLUS, (l, r) => l + r],
    [Op.MINUS, (l, r) => l - r],
    [Op.TIMES, (l, r) => l * r],
    [Op.DIVIDE, (l, r) => l / r],
    [Op.QUOTIENT, (l, r) => Math.floor(l / r)],
    [Op.LT, (l, r) => l < r],
    [Op.GT, (l, r) => l > r],
    [Op.LEQ, (l, r) => l <= r],
    [Op.GEQ, (l, r) => l >= r],
    [Op.NEG, (l) => -l],
    [Op.NOT, (v) => !v],
    [Op.BITNEG, (l) => ~l],
    [Op.XOR, (l, r) => l ^ r],
    [Op.BITOR, (l, r) => l | r],
    [Op.BITAND, (l, r) => l & r],
    [Op.SHIFTRIGHT, (l, r) => l >> r],
    [Op.SHIFTLEFT, (l, r) => l << r],
    [Op.MODULE, (l, r) => l % r],
    [Op.INCR, (l) => ++l]
]);
/**
 * Apply operator o to arguments
 * @param o
 * @param first the first argument should define the operator
 * @param rest
 */
export function op(o, first, ...rest) {
    let sym = OpSymbolMap.get(o);
    if (typeof first !== 'object' || first == null || !first[sym]) {
        let _args = [first];
        _args.push(...rest);
        return defaultOps.get(o)(..._args);
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
        getMetadata(target).annotations.push(anno);
    };
}
export function DartMethodAnnotation(anno) {
    return (target, name, descriptor) => {
        registerPropAnno(anno, target, name);
    };
}
let registerPropAnno = (anno, target, name) => {
    let md = getMetadata(target.constructor);
    let propAnnos = md.propertyAnnotations.get(name);
    if (propAnnos == null) {
        propAnnos = new Map();
        md.propertyAnnotations.set(name, propAnnos);
    }
    let key = `{${anno.library}}#{${anno.type}}`;
    let values = propAnnos.get(key);
    if (values == null) {
        values = [];
        propAnnos.set(key, values);
    }
    values.push(anno.value);
};
export function DartPropertyAnnotation(anno) {
    return (target, name) => {
        registerPropAnno(anno, target, name);
    };
}
//# sourceMappingURL=utils.js.map