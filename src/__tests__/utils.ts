import {mixin, DartClass, defaultConstructor, namedConstructor, DartConstructor, Abstract, With, AbstractProperty, AbstractMethods} from "../utils"

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
});