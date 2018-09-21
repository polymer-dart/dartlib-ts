var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _JenkinsSmiHash_1, Point_1, Rectangle_1, MutableRectangle_1;
/** Library asset:sample_project/lib/math/math.dart */
import { is } from "./_common";
import { defaultConstructor, namedFactory, defaultFactory, DartClass, Implements, op, Op, OperatorMethods, Abstract, AbstractProperty } from "./utils";
import * as core from "./core";
export var min = (a, b) => {
    return Math.min(a, b);
};
export var max = (a, b) => {
    return Math.max(a, b);
};
export var atan2 = (a, b) => {
    return Math.atan2(a, b);
};
export var pow = (x, exponent) => {
    return Math.pow(x, exponent);
};
export var sin = (radians) => {
    return Math.sin(radians);
};
export var cos = (radians) => {
    return Math.cos(radians);
};
export var tan = (radians) => {
    return Math.tan(radians);
};
export var acos = (x) => {
    return Math.acos(x);
};
export var asin = (x) => {
    return Math.asin(x);
};
export var atan = (x) => {
    return Math.atan(x);
};
export var sqrt = (x) => {
    return Math.sqrt(x);
};
export var exp = (x) => {
    return Math.exp(x);
};
export var log = (x) => {
    return Math.log(x);
};
let _JenkinsSmiHash = _JenkinsSmiHash_1 = class _JenkinsSmiHash {
    static combine(hash, value) {
        hash = 536870911 & (hash + value);
        hash = 536870911 & (hash + ((524287 & hash) << 10));
        return hash ^ (hash >> 6);
    }
    static finish(hash) {
        hash = 536870911 & (hash + ((67108863 & hash) << 3));
        hash = hash ^ (hash >> 11);
        return 536870911 & (hash + ((16383 & hash) << 15));
    }
    static hash2(a, b) {
        return _JenkinsSmiHash_1.finish(_JenkinsSmiHash_1.combine(_JenkinsSmiHash_1.combine(0, a), b));
    }
    static hash4(a, b, c, d) {
        return _JenkinsSmiHash_1.finish(_JenkinsSmiHash_1.combine(_JenkinsSmiHash_1.combine(_JenkinsSmiHash_1.combine(_JenkinsSmiHash_1.combine(0, a), b), c), d));
    }
};
_JenkinsSmiHash = _JenkinsSmiHash_1 = __decorate([
    DartClass
], _JenkinsSmiHash);
export { _JenkinsSmiHash };
let Point = Point_1 = class Point {
    constructor(x, y) {
    }
    Point(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `Point(${this.x}, ${this.y})`;
    }
    [OperatorMethods.EQUALS](other) {
        if (is(other, Point_1))
            return false;
        return op(Op.EQUALS, this.x, other.x) && op(Op.EQUALS, this.y, other.y);
    }
    get hashCode() {
        return _JenkinsSmiHash.hash2(new core.DartNumber(this.x).hashCode, new core.DartNumber(this.y).hashCode);
    }
    [OperatorMethods.PLUS](other) {
        return new Point_1(op(Op.PLUS, this.x, other.x), op(Op.PLUS, this.y, other.y));
    }
    [OperatorMethods.MINUS](other) {
        return new Point_1(op(Op.MINUS, this.x, other.x), op(Op.MINUS, this.y, other.y));
    }
    [OperatorMethods.MULTIPLY](factor) {
        return new Point_1((op(Op.TIMES, this.x, factor)), (op(Op.TIMES, this.y, factor)));
    }
    get magnitude() {
        return sqrt(op(Op.TIMES, this.x, this.x) + op(Op.TIMES, this.y, this.y));
    }
    distanceTo(other) {
        let dx = op(Op.MINUS, this.x, other.x);
        let dy = op(Op.MINUS, this.y, other.y);
        return sqrt(dx * dx + dy * dy);
    }
    squaredDistanceTo(other) {
        let dx = op(Op.MINUS, this.x, other.x);
        let dy = op(Op.MINUS, this.y, other.y);
        return dx * dx + dy * dy;
    }
};
__decorate([
    defaultConstructor
], Point.prototype, "Point", null);
Point = Point_1 = __decorate([
    DartClass
], Point);
export { Point };
let Random = class Random {
    constructor(seed) {
    }
    static _Random(seed) {
        return new JSRandom();
    }
    static _secure() {
        return new JSRandom();
    }
    nextInt(max) {
        throw 'abstract';
    }
    nextDouble() {
        throw 'abstract';
    }
    nextBool() {
        throw 'abstract';
    }
};
__decorate([
    Abstract
], Random.prototype, "nextInt", null);
__decorate([
    Abstract
], Random.prototype, "nextDouble", null);
__decorate([
    Abstract
], Random.prototype, "nextBool", null);
__decorate([
    defaultFactory
], Random, "_Random", null);
__decorate([
    namedFactory
], Random, "_secure", null);
Random = __decorate([
    DartClass
], Random);
export { Random };
class JSRandom {
    nextBool() {
        return Math.random() < 0.5;
    }
    nextDouble() {
        return Math.random();
    }
    nextInt(max) {
        return Math.round(Math.random() * max);
    }
}
let _RectangleBase = class _RectangleBase {
    constructor() {
    }
    _RectangleBase() {
    }
    get left() {
        throw 'abstract';
    }
    get top() {
        throw 'abstract';
    }
    get width() {
        throw 'abstract';
    }
    get height() {
        throw 'abstract';
    }
    get right() {
        return op(Op.PLUS, this.left, this.width);
    }
    get bottom() {
        return op(Op.PLUS, this.top, this.height);
    }
    toString() {
        return `Rectangle (${this.left}, ${this.top}) ${this.width} x ${this.height}`;
    }
    [OperatorMethods.EQUALS](other) {
        if (is(other, Rectangle))
            return false;
        return op(Op.EQUALS, this.left, other.left) && op(Op.EQUALS, this.top, other.top) && op(Op.EQUALS, this.right, other.right) && op(Op.EQUALS, this.bottom, other.bottom);
    }
    get hashCode() {
        return _JenkinsSmiHash.hash4(new core.DartNumber(this.left).hashCode, new core.DartNumber(this.top).hashCode, new core.DartNumber(this.right).hashCode, new core.DartNumber(this.bottom).hashCode);
    }
    intersection(other) {
        let x0 = max(this.left, other.left);
        let x1 = min(op(Op.PLUS, this.left, this.width), op(Op.PLUS, other.left, other.width));
        if (op(Op.LEQ, x0, x1)) {
            let y0 = max(this.top, other.top);
            let y1 = min(op(Op.PLUS, this.top, this.height), op(Op.PLUS, other.top, other.height));
            if (op(Op.LEQ, y0, y1)) {
                return new Rectangle(x0, y0, op(Op.MINUS, x1, x0), op(Op.MINUS, y1, y0));
            }
        }
        return null;
    }
    intersects(other) {
        return (op(Op.LEQ, this.left, other.left + other.width) && other.left <= op(Op.PLUS, this.left, this.width) && op(Op.LEQ, this.top, other.top + other.height) && other.top <= op(Op.PLUS, this.top, this.height));
    }
    boundingBox(other) {
        let right = max(op(Op.PLUS, this.left, this.width), op(Op.PLUS, other.left, other.width));
        let bottom = max(op(Op.PLUS, this.top, this.height), op(Op.PLUS, other.top, other.height));
        let left = min(this.left, other.left);
        let top = min(this.top, other.top);
        return new Rectangle(left, top, op(Op.MINUS, right, left), op(Op.MINUS, bottom, top));
    }
    containsRectangle(another) {
        return op(Op.LEQ, this.left, another.left) && op(Op.PLUS, this.left, this.width) >= another.left + another.width && op(Op.LEQ, this.top, another.top) && op(Op.PLUS, this.top, this.height) >= another.top + another.height;
    }
    containsPoint(another) {
        return another.x >= this.left && another.x <= op(Op.PLUS, this.left, this.width) && another.y >= this.top && another.y <= op(Op.PLUS, this.top, this.height);
    }
    get topLeft() {
        return new Point(this.left, this.top);
    }
    get topRight() {
        return new Point(op(Op.PLUS, this.left, this.width), this.top);
    }
    get bottomRight() {
        return new Point(op(Op.PLUS, this.left, this.width), op(Op.PLUS, this.top, this.height));
    }
    get bottomLeft() {
        return new Point(this.left, op(Op.PLUS, this.top, this.height));
    }
};
__decorate([
    defaultConstructor
], _RectangleBase.prototype, "_RectangleBase", null);
__decorate([
    AbstractProperty
], _RectangleBase.prototype, "left", null);
__decorate([
    AbstractProperty
], _RectangleBase.prototype, "top", null);
__decorate([
    AbstractProperty
], _RectangleBase.prototype, "width", null);
__decorate([
    AbstractProperty
], _RectangleBase.prototype, "height", null);
_RectangleBase = __decorate([
    DartClass
], _RectangleBase);
export { _RectangleBase };
let Rectangle = Rectangle_1 = class Rectangle extends _RectangleBase {
    constructor(left, top, width, height) {
        // @ts-ignore
        super();
    }
    Rectangle(left, top, width, height) {
        this.width = ((op(Op.LT, width, 0)) ? op(Op.NEG, width) * 0 : width);
        this.height = ((op(Op.LT, height, 0)) ? op(Op.NEG, height) * 0 : height);
        this.left = left;
        this.top = top;
    }
    static _fromPoints(a, b) {
        let left = min(a.x, b.x);
        let width = op(Op.MINUS, max(a.x, b.x), left);
        let top = min(a.y, b.y);
        let height = op(Op.MINUS, max(a.y, b.y), top);
        return new Rectangle_1(left, top, width, height);
    }
};
__decorate([
    defaultConstructor
], Rectangle.prototype, "Rectangle", null);
__decorate([
    namedFactory
], Rectangle, "_fromPoints", null);
Rectangle = Rectangle_1 = __decorate([
    DartClass
], Rectangle);
export { Rectangle };
let MutableRectangle = MutableRectangle_1 = class MutableRectangle extends _RectangleBase {
    constructor(left, top, width, height) {
        // @ts-ignore
        super();
    }
    MutableRectangle(left, top, width, height) {
        this._width = (op(Op.LT, width, 0)) ? _clampToZero(width) : width;
        this._height = (op(Op.LT, height, 0)) ? _clampToZero(height) : height;
        this.left = left;
        this.top = top;
    }
    static _fromPoints(a, b) {
        let left = min(a.x, b.x);
        let width = op(Op.MINUS, max(a.x, b.x), left);
        let top = min(a.y, b.y);
        let height = op(Op.MINUS, max(a.y, b.y), top);
        return new MutableRectangle_1(left, top, width, height);
    }
    get width() {
        return this._width;
    }
    set width(width) {
        if (op(Op.LT, width, 0))
            width = _clampToZero(width);
        this._width = width;
    }
    get height() {
        return this._height;
    }
    set height(height) {
        if (op(Op.LT, height, 0))
            height = _clampToZero(height);
        this._height = height;
    }
    Rectangle(left, top, width, height) {
    }
};
__decorate([
    defaultConstructor
], MutableRectangle.prototype, "MutableRectangle", null);
__decorate([
    namedFactory
], MutableRectangle, "_fromPoints", null);
MutableRectangle = MutableRectangle_1 = __decorate([
    DartClass,
    Implements(Rectangle)
], MutableRectangle);
export { MutableRectangle };
export var _clampToZero = (value) => {
    /* TODO (AssertStatementImpl) : assert (value < 0); */
    ;
    return op(Op.NEG, value) * 0;
};
export class _Properties {
    constructor() {
        this.E = 2.718281828459045;
        this.LN10 = 2.302585092994046;
        this.LN2 = 0.6931471805599453;
        this.LOG2E = 1.4426950408889634;
        this.LOG10E = 0.4342944819032518;
        this.PI = 3.141592653589793;
        this.SQRT1_2 = 0.7071067811865476;
        this.SQRT2 = 1.4142135623730951;
    }
}
export const properties = new _Properties();
//# sourceMappingURL=math.js.map