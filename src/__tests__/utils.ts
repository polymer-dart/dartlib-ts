import {mixin, DartClass, defaultConstructor, namedConstructor, DartConstructor, Abstract, With, AbstractProperty, AbstractMethods, Implements, isA, Operator, Op, EQUALS_OPERATOR, OPERATOR_PLUS, defaultFactory} from "../utils"
import _dart from '../_common';

describe("Utils", () => {
    it('mixes classes', () => {

        class A {
            s: string;

            constructor(s: string) {
                this.s = s;
            }
        }

        class B {

            get asA(): A {
                return this as any as A;
            }

            methodB(): string {
                return this.asA.s;
            }
        }

        class C extends mixin(B, A) {
            constructor() {
                super('test');
            }
        }

        expect(new C().methodB()).toEqual('test');
    });

    it('Defers dart class init', () => {

        @DartClass
        class MyClass {
            constructor(s: string) {
            }

            s: string;

            @defaultConstructor
            _(s: string) {
                this.s = s;
            }
        }

        let c = new MyClass('test');
        expect(c).toBeInstanceOf(MyClass);
        expect(c.s).toEqual('test');
    });

    it('Preserves statics', () => {

        @DartClass
        class MyClass {
            constructor(s: string) {
            }

            s: string;

            static method(): string {
                return "hi";
            }

            @defaultConstructor
            _(s: string) {
                this.s = s;
            }
        }

        expect(MyClass.method()).toEqual('hi');
    });

    it('Defers dart class init', () => {

        @DartClass
        class MyClass2 {
            a: string;

            constructor(...args: any[]) {
                this.a = "";
            }


            @defaultConstructor
            _create() {
                this.a = 'hi';
            }

            static met1(): string {
                return "stat1";
            }
        }

        @DartClass
        class DerivedClass extends MyClass2 {
            b: string;

            constructor() {
                super();
                this.a = "";
                this.b = "";
            }

            @defaultConstructor
            _create() {
                super._create();
                this.b = 'john';
            }

            static met2(): string {
                return "stat2";
            }
        }

        let c = new DerivedClass();
        expect(c).toBeInstanceOf(DerivedClass);
        expect(c.a).toEqual('hi');
        expect(c.b).toEqual('john');

    });

    it('Preserves statics hierarchy', () => {

        @DartClass
        class MyClass2 {
            a: string;

            constructor(...args: any[]) {
                this.a = "";
            }


            @defaultConstructor
            protected _create() {
                console.log("super");
                this.a = 'hi';
            }

            static met1(): string {
                return "stat1";
            }
        }

        @DartClass
        class DerivedClass extends MyClass2 {
            b: string;

            constructor() {
                super();
                this.b = "";
                this.a = "";
            }

            @defaultConstructor
            protected _create() {
                super._create();
                console.log('child');
                this.b = 'john';
            }

            static met2(): string {
                return "stat2";
            }
        }

        expect(DerivedClass.met1()).toEqual('stat1');
        expect(DerivedClass.met2()).toEqual('stat2');

    });

    it('works with named constructors', () => {
        @DartClass
        class MyClass {
            x: string;

            @namedConstructor
            protected byValue(x: string) {
                this.x = x;
            }

            static byValue: new(x: string) => MyClass;
        }

        let c: MyClass = new MyClass.byValue('hi');
        expect(c).toBeInstanceOf(MyClass);
        expect(c.x).toEqual('hi');
    });

    it('works with derived named constructors', () => {
        @DartClass
        class MyClass {
            x: string;

            @namedConstructor
            protected byValue(x: string) {
                this.x = x;
            }

            static byValue: new(x: string) => MyClass;
        }

        @DartClass
        class MyClassDerived extends MyClass {
            y: string;

            @namedConstructor
            protected byValue(y: string) {
                super.byValue('bye');
                this.y = y;
            }

            static byValue: new(x: string) => MyClassDerived;
        }

        let c: MyClassDerived = new MyClassDerived.byValue('hi');
        expect(c).toBeInstanceOf(MyClassDerived);
        expect(c.x).toEqual('bye');
        expect(c.y).toEqual('hi');
    });

    it('works with mixed constructors', () => {
        @DartClass
        class MyClass {
            x: string;

            @namedConstructor
            protected byValue(x: string) {
                this.x = x;
            }

            static byValue: new(x: string) => MyClass;
        }

        @DartClass
        class MyClassDerived extends MyClass {
            y: string;

            @namedConstructor
            protected byValue(y: string) {
                super.byValue('bye');
                this.y = y;
            }

            static byValue: new(x: string) => MyClassDerived;

            @defaultConstructor
            protected _default(x: string, y: string) {
                super.byValue(x);
                this.y = y;
            }

            constructor(x: string, y: string) {
                super();
            }
        }

        let c: MyClassDerived = new MyClassDerived('hi', 'there');
        expect(c).toBeInstanceOf(MyClassDerived);
        expect(c.x).toEqual('hi');
        expect(c.y).toEqual('there');

        c = new MyClassDerived.byValue('hi');
        expect(c).toBeInstanceOf(MyClassDerived);
        expect(c.x).toEqual('bye');
        expect(c.y).toEqual('hi');
    });

    it('works with factory default constructors', () => {


        @DartClass
        class MyClass {
            x: string;

            @defaultConstructor
            protected _default(v: string) {
                this.x = v;
            }

            constructor(v: string) {
            }

            method(): string {
                return `Hi ${this.x}`;
            }

            static otherStaticMethod(): string {
                return "BYE";
            }
        }

        @DartClass
        class Derived extends MyClass {
            constructor(choose: boolean) {
                super('');
            }

            @DartConstructor({default: true, factory: true})
            protected static _create(choose: boolean) {
                if (choose) {
                    return new Derived.named('Giovanni');
                }
                return new MyClass('John');
            }

            @namedConstructor
            protected named(s: string) {
                this.x = s;
            }

            static named: new(s: string) => Derived;

            method(): string {
                return `Ciao ${this.x}`;
            }

            static staticMethod(): string {
                return "STATIC";
            }

        }

        let x = new Derived(true);
        expect(x.method()).toEqual('Ciao Giovanni');
        let y = new Derived(false);
        expect(y.method()).toEqual('Hi John');
        expect(Derived.staticMethod()).toEqual('STATIC');
        expect(Derived.otherStaticMethod()).toEqual('BYE');
    });

    it('works with named factory constructors', () => {


        @DartClass
        class MyClass {
            x: string;

            @defaultConstructor
            protected _default(v: string) {
                this.x = v;
            }

            constructor(v: string) {
            }

            method(): string {
                return `Hi ${this.x}`;
            }

            static otherStaticMethod(): string {
                return "BYE";
            }
        }

        @DartClass
        class Derived extends MyClass {
            constructor(choose: boolean) {
                super('');
            }

            @DartConstructor({factory: true, name: 'create'})
            protected static _create(choose: boolean) {
                if (choose) {
                    return new Derived.named('Giovanni');
                }
                return new MyClass('John');
            }

            static create: new(choose: boolean) => Derived;

            @namedConstructor
            protected named(s: string) {
                this.x = s;
            }

            static named: new(s: string) => Derived;

            method(): string {
                return `Ciao ${this.x}`;
            }

            static staticMethod(): string {
                return "STATIC";
            }

        }

        let x = new Derived.create(true);
        expect(x.method()).toEqual('Ciao Giovanni');
        let y = new Derived.create(false);
        expect(y.method()).toEqual('Hi John');
        expect(Derived.staticMethod()).toEqual('STATIC');
        expect(Derived.otherStaticMethod()).toEqual('BYE');
    });

    it('deletes abstract methods', () => {
        @DartClass
        class FakeAbstract {
            @Abstract
            doSomething(): string {
                return 'abstract';
            }

            @AbstractProperty
            something: number = 5;

        }

        class Real extends FakeAbstract {
            doSomething(): string {
                return 'ok';
            }

            something: number = 6;
        }

        expect(new Real().doSomething()).toEqual('ok');
        expect(new Real().something).toEqual(6);
        expect(FakeAbstract.prototype).not.toHaveProperty('doSomething');
        expect(FakeAbstract.prototype).not.toHaveProperty('something');
        expect(() => new FakeAbstract().doSomething()).toThrow(TypeError);

    });

    it('deletes abstract methods2', () => {
        @DartClass
        @AbstractMethods('doSomething', 'something')
        class FakeAbstract {

            doSomething(): string {
                return 'abstract';
            }

            something: number = 5;

        }

        class Real extends FakeAbstract {
            doSomething(): string {
                return 'ok';
            }

            something: number = 6;
        }

        expect(new Real().doSomething()).toEqual('ok');
        expect(new Real().something).toEqual(6);
        expect(FakeAbstract.prototype).not.toHaveProperty('doSomething');
        expect(FakeAbstract.prototype).not.toHaveProperty('something');
        expect(() => new FakeAbstract().doSomething()).toThrow(TypeError);

    });

    it('work NOT as abstract methods', () => {
        @DartClass
        class FakeAbstract {
            doSomething: () => string;
        }

        class Real extends FakeAbstract {
            doSomething = (): string => {
                return 'ok';
            }
        }


        class Child extends Real {
            doSomething = (): string => {
                // SUPER Is not working here !
                return `hi + ${super.doSomething()}`;
            }
        }

        expect(new Real().doSomething()).toEqual('ok');
        expect(() => new Child().doSomething()).toThrow();


    });

    it('supports implicit constructors', () => {
        @DartClass
        class FirstClass {
            p: number;
        }

        @DartClass
        class SecondClass extends FirstClass {
            q: number;

            constructor() {
                super();
                this.q = 10;
            }
        }

        let s = new SecondClass();
        expect(s).not.toBeNull();
        expect(s.q).toEqual(10);

    });

    it('with mixin works', () => {
        class Mixin {
            changeme(): string {
                return "changed";
            }
        }


        @DartClass
        @With(Mixin)
        class SomeClass {
            changeme(): string {
                return "original";
            }
        }

        expect(new SomeClass().changeme()).toEqual('changed');
    });

    it('records interfaces', () => {

        class Parent {

        }

        class OtherParent {

        }

        @Implements(Parent)
        class Interface extends OtherParent {

        }

        @Implements(Interface)
        class SomeClass {

        }

        class Derived extends SomeClass {

        }

        @Implements(Interface)
        class OtherClass {

        }

        let obj = new SomeClass();
        expect(isA(obj, SomeClass));
        expect(isA(obj, Interface));
        expect(isA(obj, Parent));
        expect(isA(obj, OtherParent));
        obj = new Derived();
        expect(isA(obj, Derived));
        expect(isA(obj, SomeClass));
        expect(isA(obj, Interface));
        expect(isA(obj, OtherClass)).not;
    })

    it('works with operator', () => {
        class ComplexNumber {
            real: number;
            imaginary: number;

            constructor(_?: { real?: number, imaginary?: number }) {
                let {real, imaginary} = Object.assign({real: 0, imaginary: 0}, _);
                this.real = real;
                this.imaginary = imaginary;
            }

            @Operator(Op.PLUS)
            plus(other: ComplexNumber): ComplexNumber {
                return new ComplexNumber({real: this.real + other.real, imaginary: this.imaginary + other.imaginary});
            }

            @Operator(Op.EQUALS)
            equals(other: ComplexNumber): boolean {
                return this.real === other.real && this.imaginary === other.imaginary;
            }
        }


        let A = new ComplexNumber({real: 10, imaginary: 10});
        let B = new ComplexNumber({real: 5, imaginary: 5});

        expect(A[OPERATOR_PLUS]).not.toBeNull();
        expect(A[EQUALS_OPERATOR]).not.toBeNull();

        let C = A.plus(B);
        let D = A[OPERATOR_PLUS](B);
        expect(_dart.equals(C, D)).toBe(true);
        expect(C.real).toEqual(15);
        expect(C.imaginary).toEqual(15);
        expect(D.imaginary).toEqual(15);
        expect(D.real).toEqual(15);
        expect(A[EQUALS_OPERATOR](B)).toBe(false);
        expect(C[EQUALS_OPERATOR](D)).toBe(true);
    });

    it('dart class can be extended like normal class', () => {
        @DartClass
        class WithDefaultConstructor {
            s: string;

            constructor(s: string) {

            }

            @defaultConstructor
            protected _init(s: string) {
                this.s = s;
            }
        }

        class NormalClass extends WithDefaultConstructor {
            constructor() {
                super('some');
            }
        }

        expect(new NormalClass().s).toEqual('some');
    });

    it('dart class can be extended like normal class with factory', () => {
        @DartClass
        class WithDefaultFactoryConstructor {
            s: string;

            constructor(s: string) {

            }

            @namedConstructor
            protected named() {
            }

            static named: new() => WithDefaultFactoryConstructor;

            @defaultFactory
            protected static _init(s: string): WithDefaultFactoryConstructor {
                let res = new WithDefaultFactoryConstructor.named();
                res.s = s;
                return res;
            }
        }

        class NormalClass extends WithDefaultFactoryConstructor {
            constructor() {
                super('some');
            }
        }

        expect(new NormalClass().s).toEqual('some');
    });

    it('dart class can be extended like normal class even with dartclass', () => {
        @DartClass
        class WithDefaultConstructor {
            s: string;

            constructor(s: string) {

            }

            @defaultConstructor
            protected _init(s: string) {
                this.s = s;
            }
        }

        @DartClass
        class NormalClass extends WithDefaultConstructor {
            constructor() {
                super('some');
            }
        }

        expect(new NormalClass().s).toEqual('some');
    });

    it('dart class can be extended like normal class with factory even with dartclass', () => {
        @DartClass
        class WithDefaultFactoryConstructor {
            s: string;

            constructor(s: string) {

            }

            @namedConstructor
            protected named() {
            }

            static named: new() => WithDefaultFactoryConstructor;

            @defaultFactory
            protected static _init(s: string): WithDefaultFactoryConstructor {
                let res = new WithDefaultFactoryConstructor.named();
                res.s = s;
                return res;
            }
        }

        @DartClass
        class NormalClass extends WithDefaultFactoryConstructor {
            constructor() {
                super('some');
            }
        }

        expect(new NormalClass().s).toEqual('some');
    });

    it('promises can be extended ?', async () => {
        class OneSecPromise implements Promise<string> {
            res: Promise<string>

            constructor() {
                this.res = new Promise<string>((resolve, reject) => {
                    setTimeout(() => {
                       // console.log('fired!');
                        resolve('hi');
                    }, 1000);
                });
            }

            readonly [Symbol.toStringTag]: "Promise";

            catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): Promise<string | TResult> {
                return undefined;
            }

            then<TResult1 = string, TResult2 = never>(onfulfilled?: ((value: string) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): Promise<TResult1 | TResult2> {
                /*if (onfulfilled) {
                    return onfulfilled(this.res);
                }*/
                return this.res.then(onfulfilled);
                //return this.res as any;
            }


        }

        let res = await new OneSecPromise();
     //   console.log(`Return :${res}`);
        expect(res).toEqual('hi');
    })
});