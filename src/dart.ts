/**
 * Support library for dart ts
 */

export const INIT: Symbol = Symbol("INIT");

interface BaseConstructor<X> {
    new(): X
}

export const BaseObject = <X extends BaseConstructor<any> | Function>(x: X) => class extends x {
    constructor(...args: any[]) {
        super();
    }
};

export const DartConstructor: ClassDecorator = (constructor) => {
    let _ = (...args: any[]) => {

    };
};

interface Constructor<T> {
    new(...props: any[]): T
}


function mixin<T, B>(t: Constructor<T>, b: Constructor<B>): Constructor<B & T> {
    let mixin = class extends (b as any) {
    };


    Object.getOwnPropertyNames(t).forEach(n => {
        Object.defineProperty(mixin, n, Object.getOwnPropertyDescriptor(t, n) as PropertyDescriptor);
    });

    Object.getOwnPropertySymbols(t).forEach(n => {
        Object.defineProperty(mixin, n, Object.getOwnPropertyDescriptor(t, n) as PropertyDescriptor);
    });

    return mixin as any as Constructor<T & B>;
}

class Living {
    drink() {
        console.log("dring");
    }
}

class Person extends mixin(Living, class {
    name!: string;

    constructor(name: string) {
        this.name = name;
    }

}) {

}

let p = new Person("Jack");

p.drink();

class Animal extends mixin(Living, class {
    owner!: Person;
}) {

}

let a = new Animal();
a.owner = p;

class XXX<T> extends Object {
    str: string;

    constructor(...args: any[]) {
        if (args[0] === INIT) {
            super(INIT);
        }

        // Call actual constructor
        this.str = "a";
        this._dartConstructor(args[0]);
    }

    _dartConstructor(str: string) {
        this.str = str;
    }
}