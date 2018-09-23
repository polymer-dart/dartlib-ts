/** Library asset:sample_project/lib/math/math.dart */
import {is,equals} from "_common";
import {defaultConstructor,namedConstructor,namedFactory,defaultFactory,DartClass,Implements,op,Op,OperatorMethods,DartClassAnnotation,DartMethodAnnotation,DartPropertyAnnotation,Abstract,AbstractProperty} from "utils";
import * as _common from "_common";
import * as core from "core";
import * as async from "async";

export var min : <T extends number>(a : T,b : T) => T = <T extends number>(a : T,b : T) : T =>  {
};
export var max : <T extends number>(a : T,b : T) => T = <T extends number>(a : T,b : T) : T =>  {
};
export var atan2 : (a : number,b : number) => double = (a : number,b : number) : double =>  {
};
export var pow : (x : number,exponent : number) => number = (x : number,exponent : number) : number =>  {
};
export var sin : (radians : number) => double = (radians : number) : double =>  {
};
export var cos : (radians : number) => double = (radians : number) : double =>  {
};
export var tan : (radians : number) => double = (radians : number) : double =>  {
};
export var acos : (x : number) => double = (x : number) : double =>  {
};
export var asin : (x : number) => double = (x : number) : double =>  {
};
export var atan : (x : number) => double = (x : number) : double =>  {
};
export var sqrt : (x : number) => double = (x : number) : double =>  {
};
export var exp : (x : number) => double = (x : number) : double =>  {
};
export var log : (x : number) => double = (x : number) : double =>  {
};
@DartClass
export class _JenkinsSmiHash {
    static combine(hash : number,value : number) : number {
        hash = 536870911 & (hash + value);
        hash = 536870911 & (hash + ((524287 & hash) << 10));
        return hash ^ (hash >> 6);
    }
    static finish(hash : number) : number {
        hash = 536870911 & (hash + ((67108863 & hash) << 3));
        hash = hash ^ (hash >> 11);
        return 536870911 & (hash + ((16383 & hash) << 15));
    }
    static hash2(a : any,b : any) : number {
        return _JenkinsSmiHash.finish(_JenkinsSmiHash.combine(_JenkinsSmiHash.combine(0,a),b));
    }
    static hash4(a : any,b : any,c : any,d : any) : number {
        return _JenkinsSmiHash.finish(_JenkinsSmiHash.combine(_JenkinsSmiHash.combine(_JenkinsSmiHash.combine(_JenkinsSmiHash.combine(0,a),b),c),d));
    }
}

@DartClass
export class Point<T extends number>  {
    x : T;
    y : T;
    constructor(x : T,y : T) {
    }
    @defaultConstructor
    Point(x : T,y : T) {
        this.x = x;
        this.y = y;
    }
    toString() : string {
        return `Point(${this.x}, ${this.y})`;
    }
    [OperatorMethods.EQUALS](other : any) : boolean {
        if (is(other, Point<any>)) return false;
        return op(Op.EQUALS,this.x,other.x) && op(Op.EQUALS,this.y,other.y);
    }
    get hashCode() : number {
        return _JenkinsSmiHash.hash2(this.x.hashCode,this.y.hashCode);
    }
    [OperatorMethods.PLUS](other : Point<T>) : Point<T> {
        return new Point<T>(op(Op.PLUS,this.x,other.x),op(Op.PLUS,this.y,other.y));
    }
    [OperatorMethods.MINUS](other : Point<T>) : Point<T> {
        return new Point<T>(op(Op.MINUS,this.x,other.x),op(Op.MINUS,this.y,other.y));
    }
    [OperatorMethods.MULTIPLY](factor : number) : Point<T> {
        return new Point<T>((op(Op.TIMES,this.x,factor)) as any,(op(Op.TIMES,this.y,factor)) as any);
    }
    get magnitude() : double {
        return sqrt(op(Op.TIMES,this.x,this.x) + op(Op.TIMES,this.y,this.y));
    }
    distanceTo(other : Point<T>) : double {
        let dx = op(Op.MINUS,this.x,other.x);
        let dy = op(Op.MINUS,this.y,other.y);
        return sqrt(dx * dx + dy * dy);
    }
    squaredDistanceTo(other : Point<T>) : T {
        let dx = op(Op.MINUS,this.x,other.x);
        let dy = op(Op.MINUS,this.y,other.y);
        return dx * dx + dy * dy;
    }
}

@DartClass
export class Random {
    constructor(seed? : number) {
    }
    @defaultFactory
    static _Random(seed? : number) : Random {
    }
    @namedFactory
    static _secure() : Random {
    }
    static secure : new() => Random;
    @Abstract
    nextInt(max : number) : number{ throw 'abstract'}
    @Abstract
    nextDouble() : double{ throw 'abstract'}
    @Abstract
    nextBool() : boolean{ throw 'abstract'}
}

@DartClass
export class _RectangleBase<T extends number>  {
    constructor() {
    }
    @defaultConstructor
    _RectangleBase() {
    }
    @AbstractProperty
    get left() : T{ throw 'abstract'}
    @AbstractProperty
    get top() : T{ throw 'abstract'}
    @AbstractProperty
    get width() : T{ throw 'abstract'}
    @AbstractProperty
    get height() : T{ throw 'abstract'}
    get right() : T {
        return op(Op.PLUS,this.left,this.width);
    }
    get bottom() : T {
        return op(Op.PLUS,this.top,this.height);
    }
    toString() : string {
        return `Rectangle (${this.left}, ${this.top}) ${this.width} x ${this.height}`;
    }
    [OperatorMethods.EQUALS](other : any) : boolean {
        if (is(other, Rectangle<any>)) return false;
        return op(Op.EQUALS,this.left,other.left) && op(Op.EQUALS,this.top,other.top) && op(Op.EQUALS,this.right,other.right) && op(Op.EQUALS,this.bottom,other.bottom);
    }
    get hashCode() : number {
        return _JenkinsSmiHash.hash4(this.left.hashCode,this.top.hashCode,this.right.hashCode,this.bottom.hashCode);
    }
    intersection(other : Rectangle<T>) : Rectangle<T> {
        let x0 = max(this.left,other.left);
        let x1 = min(op(Op.PLUS,this.left,this.width),op(Op.PLUS,other.left,other.width));
        if (op(Op.LEQ,x0,x1)) {
            let y0 = max(this.top,other.top);
            let y1 = min(op(Op.PLUS,this.top,this.height),op(Op.PLUS,other.top,other.height));
            if (op(Op.LEQ,y0,y1)) {
                return new Rectangle<T>(x0,y0,op(Op.MINUS,x1,x0),op(Op.MINUS,y1,y0));
            }
        }
        return null;
    }
    intersects(other : Rectangle<number>) : boolean {
        return (op(Op.LEQ,this.left,other.left + other.width) && other.left <= op(Op.PLUS,this.left,this.width) && op(Op.LEQ,this.top,other.top + other.height) && other.top <= op(Op.PLUS,this.top,this.height));
    }
    boundingBox(other : Rectangle<T>) : Rectangle<T> {
        let right = max(op(Op.PLUS,this.left,this.width),op(Op.PLUS,other.left,other.width));
        let bottom = max(op(Op.PLUS,this.top,this.height),op(Op.PLUS,other.top,other.height));
        let left = min(this.left,other.left);
        let top = min(this.top,other.top);
        return new Rectangle<T>(left,top,op(Op.MINUS,right,left),op(Op.MINUS,bottom,top));
    }
    containsRectangle(another : Rectangle<number>) : boolean {
        return op(Op.LEQ,this.left,another.left) && op(Op.PLUS,this.left,this.width) >= another.left + another.width && op(Op.LEQ,this.top,another.top) && op(Op.PLUS,this.top,this.height) >= another.top + another.height;
    }
    containsPoint(another : Point<number>) : boolean {
        return another.x >= this.left && another.x <= op(Op.PLUS,this.left,this.width) && another.y >= this.top && another.y <= op(Op.PLUS,this.top,this.height);
    }
    get topLeft() : Point<T> {
        return new Point<T>(this.left,this.top);
    }
    get topRight() : Point<T> {
        return new Point<T>(op(Op.PLUS,this.left,this.width),this.top);
    }
    get bottomRight() : Point<T> {
        return new Point<T>(op(Op.PLUS,this.left,this.width),op(Op.PLUS,this.top,this.height));
    }
    get bottomLeft() : Point<T> {
        return new Point<T>(this.left,op(Op.PLUS,this.top,this.height));
    }
}

@DartClass
export class Rectangle<T extends number>  extends _RectangleBase<T> {
    left : T;
    top : T;
    width : T;
    height : T;
    constructor(left : T,top : T,width : T,height : T) {
        // @ts-ignore
        super();
    }
    @defaultConstructor
    Rectangle(left : T,top : T,width : T,height : T) {
        this.width = (op(Op.LT,width,0)) ? op(Op.NEG,width) * 0 : width;
        this.height = (op(Op.LT,height,0)) ? op(Op.NEG,height) * 0 : height;
        this.left = left;
        this.top = top;
    }
    @namedFactory
    static _fromPoints<T extends number>(a : Point<T>,b : Point<T>) : Rectangle<T> {
        let left : T = min(a.x,b.x);
        let width : T = op(Op.MINUS,max(a.x,b.x),left);
        let top : T = min(a.y,b.y);
        let height : T = op(Op.MINUS,max(a.y,b.y),top);
        return new Rectangle<T>(left,top,width,height);
    }
    static fromPoints : new<T extends number>(a : Point<T>,b : Point<T>) => Rectangle<T>;
}

@DartClass
@Implements(Rectangle)
export class MutableRectangle<T extends number>  extends _RectangleBase<T> implements Rectangle<T> {
    left : T;
    top : T;
    _width : T;
    _height : T;
    constructor(left : T,top : T,width : T,height : T) {
        // @ts-ignore
        super();
    }
    @defaultConstructor
    MutableRectangle(left : T,top : T,width : T,height : T) {
        this._width = (op(Op.LT,width,0)) ? _clampToZero(width) : width;
        this._height = (op(Op.LT,height,0)) ? _clampToZero(height) : height;
        this.left = left;
        this.top = top;
    }
    @namedFactory
    static _fromPoints<T extends number>(a : Point<T>,b : Point<T>) : MutableRectangle<T> {
        let left : T = min(a.x,b.x);
        let width : T = op(Op.MINUS,max(a.x,b.x),left);
        let top : T = min(a.y,b.y);
        let height : T = op(Op.MINUS,max(a.y,b.y),top);
        return new MutableRectangle<T>(left,top,width,height);
    }
    static fromPoints : new<T extends number>(a : Point<T>,b : Point<T>) => MutableRectangle<T>;
    get width() : T {
        return this._width;
    }
    set width(width : T) {
        if (op(Op.LT,width,0)) width = _clampToZero(width);
        this._width = width;
    }
    get height() : T {
        return this._height;
    }
    set height(height : T) {
        if (op(Op.LT,height,0)) height = _clampToZero(height);
        this._height = height;
    }
}

export var _clampToZero : <T extends number>(value : T) => T = <T extends number>(value : T) : T =>  {
    /* TODO (AssertStatementImpl) : assert (value < 0); */;
    return op(Op.NEG,value) * 0;
};
export class _Properties {
    E : double = 2.718281828459045;
    LN10 : double = 2.302585092994046;
    LN2 : double = 0.6931471805599453;
    LOG2E : double = 1.4426950408889634;
    LOG10E : double = 0.4342944819032518;
    PI : double = 3.141592653589793;
    SQRT1_2 : double = 0.7071067811865476;
    SQRT2 : double = 1.4142135623730951;
}
export const properties : _Properties = new _Properties();
