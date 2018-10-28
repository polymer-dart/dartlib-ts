/** Library asset:sample_project/lib/class_constructors.dart */
import {is, isNot, equals} from "../_common";
import {
    defaultConstructor,
    namedConstructor,
    namedFactory,
    defaultFactory,
    DartClass,
    Implements,
    With,
    op,
    Op,
    OperatorMethods,
    DartClassAnnotation,
    DartMethodAnnotation,
    DartPropertyAnnotation,
    Abstract,
    AbstractProperty,
    int,
    bool,
    double, Omit
} from "../utils";
import * as _common from "../_common";
import * as core from "../core";
import * as async from "../async";

export var useEm: () => void = (): void => {
    let x: SomeClass = new SomeClass('hi', {
        ord: 5
    });
    let y: SomeClass = new SomeClass.withName('bye');
    let z: SomeClass = new SomeClass.withOrg(5);
    let w: SomeClass = new SomeClass.noRemorse();
    let d1: Derived1 = new Derived1();
    let d2: Derived2 = new Derived2();
    let g1: Generic1<boolean> = new Generic1<any>(true);
    let g2: Generic1<string> = new Generic1.named3('hello');
    let abcd: core.DartList<SomeClass> = new core.DartList.literal<SomeClass>(x, y, z, w, d1, d2);
};

export namespace SomeClass {
    export type Constructors = "SomeClass" | "withName" | "withOrg";
    export type Interface = Omit<SomeClass, Constructors> ;
}

@DartClass
export class SomeClass implements SomeClass.Interface {
    name: string;

    ord: number;

    message: string;

    doSomething() {
        return `name:${this.name}, ord:${this.ord}, message:${this.message}`;
    }

    constructor(name: string, _namedArguments?: { ord?: number }) {
    }

    @defaultConstructor
    SomeClass(name: string, _namedArguments?: { ord?: number }) {
        let {ord} = Object.assign({}, _namedArguments);
        this.ord = 4;
        this.message = "no msg";
        this.name = name;
        this.ord = ord;
        this.message = `Ciao ${this.name} [${this.ord}]`;
    }

    @namedConstructor
    withName(name: string, _namedArguments?: { ord1?: number }) {
        let {ord1} = Object.assign({}, _namedArguments);
        this.ord = 4;
        this.message = "no msg";
        this.SomeClass(name, {
            ord: 5 + ord1
        });
    }

    static withName: new(name: string, _namedArguments?: { ord1?: number }) => SomeClass;

    @namedConstructor
    withOrg(ord: number) {
        this.ord = 4;
        this.message = "no msg";
        SomeClass.prototype.withName.call(this, 'org');
    }

    static withOrg: new(ord: number) => SomeClass;

    @namedFactory
    static $noRemorse(): SomeClass {
        return new SomeClass.withName("No repent");
    }

    static noRemorse: new() => SomeClass;

}

class SomeClassAlternative implements SomeClass.Interface {
    message: string;
    name: string;
    ord: number;

    doSomething(): string {
        return "Hello!";
    }

}

type DerivedClassConstructors = SomeClass.Constructors | "DerivedClass" | "withName";

interface IDerivedClass extends Omit<DerivedClass, DerivedClassConstructors> {

}

@DartClass
export class DerivedClass extends SomeClass {
    constructor() {
        // @ts-ignore
        super();
    }

    doSomething2(): string {
        return `2:${this.doSomething()}`;
    }

    @defaultConstructor
    DerivedClass() {
        super.withName('pippo', {
            ord1: 100
        });
    }

    @namedConstructor
    withName() {
        super.withOrg(1000);
        this.message = "Overridden";
    }

    static withName: new() => DerivedClass;

}

class DerivedClassAlternative implements IDerivedClass {
    doSomething(): string {
        return 'a';
    }

    message: string;
    name: string;
    ord: number;

    doSomething2(): string {
        return 'b';
    }
}


@DartClass
export class Derived1 extends SomeClass {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultFactory
    static $Derived1(): Derived1 {
        return new Derived1._();
    }

    @namedConstructor
    _() {
        super.SomeClass('der1');
    }

    static _: new() => Derived1;

}

type Generic1Contructors = SomeClass.Constructors | 'named';

interface IGeneric1<X> extends Omit<Generic1<X>, Generic1Contructors> {

}

@DartClass
export class Generic1<X> extends SomeClass {
    x1: X;

    constructor(x1: X) {
        // @ts-ignore
        super();
    }

    @defaultFactory
    static $Generic1<X>(x1: X): Generic1<X> {
        return new Generic1.named(x1);
    }

    @namedConstructor
    named(x1: X) {
        super.withOrg(10);
        this.x1 = x1;
    }

    static named: new<X>(x1: X) => Generic1<X>;

    @namedFactory
    static $named2<X>(x2: X): Generic1<X> {
        return new Generic1.named(x2);
    }

    static named2: new<X>(x2: X) => Generic1<X>;

    @namedFactory
    static $named3<X>(x3: X): Generic1<X> {
        return new Generic1<X>(x3);
    }

    static named3: new<X>(x3: X) => Generic1<X>;

}

class Generic1Alternative implements IGeneric1<string> {
    doSomething: () => string;
    message: string;
    name: string;
    ord: number;
    x1: string;

}

@DartClass
export class Derived2 extends Derived1 {
    constructor() {
        // @ts-ignore
        super();
    }

    @defaultFactory
    static $Derived2(): Derived2 {
        return new Derived2._();
    }

    @namedConstructor
    _() {
        super._();
    }

    static _: new() => Derived2;

}

describe("can create something", () => {
    it('creates a derived', () => {
        let x1: IDerivedClass;

        x1 = new DerivedClassAlternative();

        x1 = new DerivedClass.withName();
    });
});


