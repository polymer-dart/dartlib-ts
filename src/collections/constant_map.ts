// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

//part of _js_helper;

import {DartMaps, DartUnmodifiableMapView} from "../core/maps";
import {DartMap} from "../core/map";
import {DartClass, defaultConstructor, namedConstructor, namedFactory} from "../utils";
import _dart from '../_common';
import {bool, int, OPERATOR_INDEX, OPERATOR_INDEX_ASSIGN} from "../core";
import {UnsupportedError} from "../errors";
import {DartIterable, DartIterator, DartList, DartMappedIterable} from "../collections";
import {JSArray} from "../native/js_array";
import {DartLinkedHashMap} from "../core/linked_hash_map";
import {DartJsLinkedHashMap} from "./linked_hash_map";
import {fillLiteralMap} from "../native/js_helper";
import {AbstractDartMap} from "./hash_map";

export class DartConstantMapView<K, V> extends DartUnmodifiableMapView<K, V> implements DartConstantMap<K, V> {
    constructor(base: DartMap<K, V>) {
        super(base);
    }

}

@DartClass
export class DartConstantMap<K, V> extends AbstractDartMap<K, V> implements DartMap<K, V> {
    // Used to create unmodifiable maps from other maps.
    @namedFactory
    protected static _from<K, V>(other: DartMap<any, any>): DartConstantMap<K, V> {
        let keys = other.keys.toList();
        let allStrings = true;
        for (let k of keys) {
            if (!_dart.is(k, 'string')) {
                allStrings = false;
                break;
            }
        }
        if (allStrings) {
            let containsProto = false;
            let protoValue = null;
            let object = {} /* JS('=Object', '{}')*/;
            let length = 0;
            for (let k of keys) {
                var v = other[k];
                if (k != "__proto__") {
                    if (!object.hasOwnProperty(k)) length++;
                    //JS("void", "#[#] = #", object, k, v);
                    object[k] = v;
                } else {
                    containsProto = true;
                    protoValue = v;
                }
            }
            if (containsProto) {
                length++;
                return new DartConstantProtoMap._<K, V>(length, object, keys, protoValue);
            }
            return new DartConstantStringMap._(length, object, keys) as any;
        }
        // TODO(lrn): Make a proper unmodifiable map implementation.
        return new DartConstantMapView<K, V>(new DartMap.from(other));
    }

    static from: new<K, V>(other: DartMap<any, any>) => DartConstantMap<K, V>;

    @namedConstructor
    protected _?() {

    }

    static _?: new<K, V> () => DartConstantMap<K, V>;

    get isEmpty() {
        return this.length == 0;
    }

    get isNotEmpty(): bool {
        return !this.isEmpty;
    }

    toString(): string {
        return DartMaps.mapToString(this);
    }

    protected static _throwUnmodifiable() {
        throw this._unsupportedError();
    }

    protected static _unsupportedError(): UnsupportedError {
        return new UnsupportedError("Cannot modify unmodifiable Map");
    }

    [OPERATOR_INDEX_ASSIGN](key: K, val: V) {
        DartConstantMap._throwUnmodifiable();
    }

    putIfAbsent(key: K, ifAbsent: () => V): V {
        throw DartConstantMap._unsupportedError();
    }

    remove(key: K): V {
        throw DartConstantMap._unsupportedError();
    }

    clear(): void {
        DartConstantMap._throwUnmodifiable();
    }

    addAll(other: DartMap<K, V>): void {
        DartConstantMap._throwUnmodifiable();
    }
}

@DartClass
class DartConstantStringMap<K, V> extends DartConstantMap<K, V> {
    // This constructor is not used for actual compile-time constants.
    // The instantiation of constant maps is shortcut by the compiler.

    protected _(...args: any[])
    @namedConstructor
    protected _(_length: int, _jsObject: any, _keys: DartList<K>) {
        super._();
        this._length = _length;
        this._jsObject = _jsObject;
        this._keys = _keys;
    }

    static _: (new<K, V>(_length: int, _jsObject: any, _keys: DartList<K>) => DartConstantStringMap<K, V>) | any;


    // TODO(18131): Ensure type inference knows the precise types of the fields.
    protected _length: int;
    // A constant map is backed by a JavaScript object.
    protected _jsObject: any;
    protected _keys: DartList<K>;

    get length(): int {
        return this._length/*JS('JSUInt31', '#', _length)*/;
    }

    get _keysArray(): JSArray<K> {
        return this._keys /* JS('JSUnmodifiableArray', '#', _keys)*/ as JSArray<K>;
    }

    containsValue(needle: any): bool {
        return this.values.any((value: V) => _dart.equals(value, needle));
    }

    containsKey(key: any): bool {
        if (!_dart.is(key, 'string')) return false;
        if ('__proto__' == key) return false;
        return this._jsObject.hasOwnProperty(key);
    }

    [OPERATOR_INDEX](key: any): V {
        if (!this.containsKey(key)) return null;
        return this._fetch(key);
    }

    // [_fetch] is the indexer for keys for which `containsKey(key)` is true.
    protected _fetch(key): V {
        return this._jsObject[key];
    }

    forEach(f: (key: K, value: V) => any): void {
        // Use a JS 'cast' to get efficient loop.  Type inference doesn't get this
        // since constant map representation is chosen after type inference and the
        // instantiation is shortcut by the compiler.
        var keys = this._keysArray;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            f(key, this._fetch(key));
        }
    }

    get keys(): DartIterable<K> {
        return new _ConstantMapKeyIterable<K>(this);
    }

    get values(): DartIterable<V> {
        return new DartMappedIterable<K, V>(this._keysArray, (key) => this._fetch(key));
    }
}

@DartClass
class DartConstantProtoMap<K, V> extends DartConstantStringMap<K, V> {
    // This constructor is not used.  The instantiation is shortcut by the
    // compiler. It is here to make the uninitialized final fields legal.

    @namedConstructor
    protected _(length: int, jsObject: any, keys: DartList<K>, _protoValue) {
        super._(length, jsObject, keys);
        this._protoValue = _protoValue;
    }


    static _: new<K, V>(length: int, jsObject: any, keys: DartList<K>, _protoValue) => DartConstantProtoMap<K, V> | any;

    protected _protoValue: V;

    containsKey(key: any): bool {
        if (!_dart.is(key, 'string')) return false;
        if ('__proto__' == key) return true;
        return this._jsObject.hasOwnProperty(key);
    }

    protected _fetch(key: any) {
        return '__proto__' == key ? this._protoValue : this._jsObject[key];
    }

}


class _ConstantMapKeyIterable<K> extends DartIterable<K> {


    protected _map: DartConstantStringMap<K, any>;

    constructor(_map: DartConstantStringMap<K, any>) {
        super();
        this._map = _map;
    }


    get iterator(): DartIterator<K> {
        return this._map._keysArray.iterator;
    }


    get length(): int {
        return this._map._keysArray.length;
    }
}

@DartClass
class DartGeneralConstantMap<K, V> extends DartConstantMap<K, V> {
    // This constructor is not used.  The instantiation is shortcut by the
    // compiler. It is here to make the uninitialized final fields legal.
    @defaultConstructor
    protected _create(_jsData: any) {
        super._();
        this._jsData = _jsData;
    }

    constructor(_jsData: any) {
        super();
    }

    // [_jsData] holds a key-value pair list.
    protected _jsData: any;

    // We cannot create the backing map on creation since hashCode interceptors
    // have not been defined when constants are created.


    protected _getMap(): DartMap<K, V> {
        let backingMap: DartLinkedHashMap<K, V> = (this as any).$map /*JS('LinkedHashMap|Null', r'#.$map', this)*/;
        if (backingMap == null) {
            backingMap = new DartJsLinkedHashMap<K, V>();
            fillLiteralMap(this._jsData, backingMap);
            //JS('', r'#.$map = #', this, backingMap);
            (this as any).$map = backingMap;
        }
        return backingMap;
    }

    containsValue(needle: any) {
        return this._getMap().containsValue(needle);
    }


    containsKey(key: any): bool {
        return this._getMap().containsKey(key);
    }


    [OPERATOR_INDEX](key: any): V {
        return this._getMap()[OPERATOR_INDEX](key);
    }

    forEach(f: (key: K, value: V) => any) {
        this._getMap().forEach(f);
    }

    get keys(): DartIterable<K> {
        return this._getMap().keys;
    }

    get values(): DartIterable<V> {
        return this._getMap().values;
    }

    get length(): int {
        return this._getMap().length;
    }
}
