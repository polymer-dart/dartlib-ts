/** Library asset:sample_project/lib/typed_data/typed_data.dart */
import {is,equals} from "./_common";
import {
    defaultConstructor,
    namedConstructor,
    namedFactory,
    defaultFactory,
    DartClass,
    Implements,
    op,
    Op,
    OperatorMethods,
    DartClassAnnotation,
    DartMethodAnnotation,
    DartPropertyAnnotation,
    Abstract,
    AbstractProperty,
    double
} from "./utils";
import * as _common from "./_common";
import * as core from "./core";
import * as async from "./async";

@DartClass
export class ByteBuffer {
    @AbstractProperty
    get lengthInBytes() : number{ throw 'abstract'}
    @Abstract
    asUint8List(offsetInBytes? : number,length? : number) : Uint8List{ throw 'abstract'}
    @Abstract
    asInt8List(offsetInBytes? : number,length? : number) : Int8List{ throw 'abstract'}
    @Abstract
    asUint8ClampedList(offsetInBytes? : number,length? : number) : Uint8ClampedList{ throw 'abstract'}
    @Abstract
    asUint16List(offsetInBytes? : number,length? : number) : Uint16List{ throw 'abstract'}
    @Abstract
    asInt16List(offsetInBytes? : number,length? : number) : Int16List{ throw 'abstract'}
    @Abstract
    asUint32List(offsetInBytes? : number,length? : number) : Uint32List{ throw 'abstract'}
    @Abstract
    asInt32List(offsetInBytes? : number,length? : number) : Int32List{ throw 'abstract'}
    @Abstract
    asUint64List(offsetInBytes? : number,length? : number) : Uint64List{ throw 'abstract'}
    @Abstract
    asInt64List(offsetInBytes? : number,length? : number) : Int64List{ throw 'abstract'}
    @Abstract
    asInt32x4List(offsetInBytes? : number,length? : number) : Int32x4List{ throw 'abstract'}
    @Abstract
    asFloat32List(offsetInBytes? : number,length? : number) : Float32List{ throw 'abstract'}
    @Abstract
    asFloat64List(offsetInBytes? : number,length? : number) : Float64List{ throw 'abstract'}
    @Abstract
    asFloat32x4List(offsetInBytes? : number,length? : number) : Float32x4List{ throw 'abstract'}
    @Abstract
    asFloat64x2List(offsetInBytes? : number,length? : number) : Float64x2List{ throw 'abstract'}
    @Abstract
    asByteData(offsetInBytes? : number,length? : number) : ByteData{ throw 'abstract'}
}

@DartClass
export class TypedData {
    @AbstractProperty
    get elementSizeInBytes() : number{ throw 'abstract'}
    @AbstractProperty
    get offsetInBytes() : number{ throw 'abstract'}
    @AbstractProperty
    get lengthInBytes() : number{ throw 'abstract'}
    @AbstractProperty
    get buffer() : ByteBuffer{ throw 'abstract'}
}

@DartClass
@Implements(TypedData)
export class ByteData extends TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _ByteData(length : number) : ByteData {
        throw 'external';
    }
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : ByteData {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asByteData(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes? : number,length? : number) => ByteData;
    @Abstract
    getInt8(byteOffset : number) : number{ throw 'abstract'}
    @Abstract
    setInt8(byteOffset : number,value : number) : void{ throw 'abstract'}
    @Abstract
    getUint8(byteOffset : number) : number{ throw 'abstract'}
    @Abstract
    setUint8(byteOffset : number,value : number) : void{ throw 'abstract'}
    @Abstract
    getInt16(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setInt16(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getUint16(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setUint16(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getInt32(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setInt32(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getUint32(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setUint32(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getInt64(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setInt64(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getUint64(byteOffset : number,endian? : Endianness) : number{ throw 'abstract'}
    @Abstract
    setUint64(byteOffset : number,value : number,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getFloat32(byteOffset : number,endian? : Endianness) : double{ throw 'abstract'}
    @Abstract
    setFloat32(byteOffset : number,value : double,endian? : Endianness) : void{ throw 'abstract'}
    @Abstract
    getFloat64(byteOffset : number,endian? : Endianness) : double{ throw 'abstract'}
    @Abstract
    setFloat64(byteOffset : number,value : double,endian? : Endianness) : void{ throw 'abstract'}
}


@DartClass
@Implements(core.DartList,TypedData)
export class Uint16List  extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Uint16List(length : number) : Uint16List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Uint16List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Uint16List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Uint16List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint16List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Uint16List;
    static BYTES_PER_ELEMENT : number = 2;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}


@DartClass
export class Endianness {
    @namedConstructor
    _(_littleEndian : boolean) {
        this._littleEndian = _littleEndian;
    }
    static _ : new(_littleEndian : boolean) => Endianness;
    static BIG_ENDIAN : Endianness = new Endianness._(false);
    static LITTLE_ENDIAN : Endianness = new Endianness._(true);
    static HOST_ENDIAN : Endianness = (new ByteData.view(new Uint16List.fromList(new core.DartList.literal(1)).buffer)).getInt8(0) == 1 ? Endianness.LITTLE_ENDIAN : Endianness.BIG_ENDIAN;
    _littleEndian : boolean;
}

@DartClass
@Implements(core.DartList,TypedData)
export class Int8List extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Int8List(length : number) : Int8List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Int8List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Int8List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Int8List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt8List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Int8List;
    static BYTES_PER_ELEMENT : number = 1;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Uint8List extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Uint8List(length : number) : Uint8List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Uint8List {
        throw 'exernal';
    }
    static fromList : new(elements : core.DartList<number>) => Uint8List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Uint8List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Uint8List;
    static BYTES_PER_ELEMENT : number = 1;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Uint8ClampedList extends core.DartListBase<number>  implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Uint8ClampedList(length : number) : Uint8ClampedList {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Uint8ClampedList {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Uint8ClampedList;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Uint8ClampedList {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint8ClampedList(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Uint8ClampedList;
    static BYTES_PER_ELEMENT : number = 1;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Int16List extends core.DartListBase<number>  implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Int16List(length : number) : Int16List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Int16List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Int16List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Int16List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt16List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Int16List;
    static BYTES_PER_ELEMENT : number = 2;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Int32List  extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Int32List(length : number) : Int32List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Int32List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Int32List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Int32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Int32List;
    static BYTES_PER_ELEMENT : number = 4;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Uint32List  extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Uint32List(length : number) : Uint32List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Uint32List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Uint32List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Uint32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint32List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Uint32List;
    static BYTES_PER_ELEMENT : number = 4;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Int64List  extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Int64List(length : number) : Int64List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Int64List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Int64List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Int64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt64List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Int64List;
    static BYTES_PER_ELEMENT : number = 8;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Uint64List  extends core.DartListBase<number> implements core.DartList<number>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Uint64List(length : number) : Uint64List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<number>) : Uint64List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<number>) => Uint64List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Uint64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asUint64List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Uint64List;
    static BYTES_PER_ELEMENT : number = 8;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Float32List  extends core.DartListBase<number> implements core.DartList<double>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Float32List(length : number) : Float32List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<double>) : Float32List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<double>) => Float32List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Float32List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Float32List;
    static BYTES_PER_ELEMENT : number = 4;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Float64List   extends core.DartListBase<number> implements core.DartList<double>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Float64List(length : number) : Float64List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<double>) : Float64List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<double>) => Float64List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Float64List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Float64List;
    static BYTES_PER_ELEMENT : number = 8;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Float32x4List  extends core.DartListBase<Float32x4> implements core.DartList<Float32x4>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Float32x4List(length : number) : Float32x4List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<Float32x4>) : Float32x4List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<Float32x4>) => Float32x4List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Float32x4List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat32x4List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Float32x4List;
    static BYTES_PER_ELEMENT : number = 16;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Int32x4List   extends core.DartListBase<Int32x4> implements core.DartList<Int32x4>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Int32x4List(length : number) : Int32x4List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<Int32x4>) : Int32x4List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<Int32x4>) => Int32x4List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Int32x4List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asInt32x4List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Int32x4List;
    static BYTES_PER_ELEMENT : number = 16;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
@Implements(core.DartList,TypedData)
export class Float64x2List  extends core.DartListBase<Float64x2> implements core.DartList<Float64x2>,TypedData {
    constructor(length : number) {
        super();
    }
    @defaultFactory
    static _Float64x2List(length : number) : Float64x2List {
        throw 'external';
    }
    @namedFactory
    static _fromList(elements : core.DartList<Float64x2>) : Float64x2List {
        throw 'external';
    }
    static fromList : new(elements : core.DartList<Float64x2>) => Float64x2List;
    @namedFactory
    static _view(buffer : ByteBuffer,offsetInBytes? : number,length? : number) : Float64x2List {
        offsetInBytes = offsetInBytes || 0;
        return buffer.asFloat64x2List(offsetInBytes,length);
    }
    static view : new(buffer : ByteBuffer,offsetInBytes : number,length : number) => Float64x2List;
    static BYTES_PER_ELEMENT : number = 16;

    @Abstract
    get buffer(): ByteBuffer {
        throw 'abstract';
    }

    @Abstract
    get elementSizeInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get lengthInBytes(): number {
        throw 'abstract';
    }

    @Abstract
    get offsetInBytes(): number {
        throw 'abstract';
    }
}

@DartClass
export class Float32x4 {
    constructor(x : double,y : double,z : double,w : double) {
        throw 'external';
    }
    @defaultFactory
    static _Float32x4(x : double,y : double,z : double,w : double) : Float32x4 {
        throw 'external';
    }
    @namedFactory
    static _splat(v : double) : Float32x4 {
        throw 'external';
    }
    static splat : new(v : double) => Float32x4;
    @namedFactory
    static _zero() : Float32x4 {
        throw 'external';
    }
    static zero : new() => Float32x4;
    @namedFactory
    static _fromInt32x4Bits(x : Int32x4) : Float32x4 {
        throw 'external';
    }
    static fromInt32x4Bits : new(x : Int32x4) => Float32x4;
    @namedFactory
    static _fromFloat64x2(v : Float64x2) : Float32x4 {
        throw 'external';
    }
    static fromFloat64x2 : new(v : Float64x2) => Float32x4;
    //@AbstractProperty
    [OperatorMethods.PLUS](other : Float32x4) : Float32x4{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.NEGATE]() : Float32x4{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.MINUS](other : Float32x4) : Float32x4{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.MULTIPLY](other : Float32x4) : Float32x4{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.DIVIDE](other : Float32x4) : Float32x4{ throw 'abstract'}
    @Abstract
    lessThan(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    lessThanOrEqual(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    greaterThan(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    greaterThanOrEqual(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    equal(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    notEqual(other : Float32x4) : Int32x4{ throw 'abstract'}
    @Abstract
    scale(s : double) : Float32x4{ throw 'abstract'}
    @Abstract
    abs() : Float32x4{ throw 'abstract'}
    @Abstract
    clamp(lowerLimit : Float32x4,upperLimit : Float32x4) : Float32x4{ throw 'abstract'}
    @AbstractProperty
    get x() : double{ throw 'abstract'}
    @AbstractProperty
    get y() : double{ throw 'abstract'}
    @AbstractProperty
    get z() : double{ throw 'abstract'}
    @AbstractProperty
    get w() : double{ throw 'abstract'}
    @AbstractProperty
    get signMask() : number{ throw 'abstract'}
    static XXXX : number = 0;
    static XXXY : number = 64;
    static XXXZ : number = 128;
    static XXXW : number = 192;
    static XXYX : number = 16;
    static XXYY : number = 80;
    static XXYZ : number = 144;
    static XXYW : number = 208;
    static XXZX : number = 32;
    static XXZY : number = 96;
    static XXZZ : number = 160;
    static XXZW : number = 224;
    static XXWX : number = 48;
    static XXWY : number = 112;
    static XXWZ : number = 176;
    static XXWW : number = 240;
    static XYXX : number = 4;
    static XYXY : number = 68;
    static XYXZ : number = 132;
    static XYXW : number = 196;
    static XYYX : number = 20;
    static XYYY : number = 84;
    static XYYZ : number = 148;
    static XYYW : number = 212;
    static XYZX : number = 36;
    static XYZY : number = 100;
    static XYZZ : number = 164;
    static XYZW : number = 228;
    static XYWX : number = 52;
    static XYWY : number = 116;
    static XYWZ : number = 180;
    static XYWW : number = 244;
    static XZXX : number = 8;
    static XZXY : number = 72;
    static XZXZ : number = 136;
    static XZXW : number = 200;
    static XZYX : number = 24;
    static XZYY : number = 88;
    static XZYZ : number = 152;
    static XZYW : number = 216;
    static XZZX : number = 40;
    static XZZY : number = 104;
    static XZZZ : number = 168;
    static XZZW : number = 232;
    static XZWX : number = 56;
    static XZWY : number = 120;
    static XZWZ : number = 184;
    static XZWW : number = 248;
    static XWXX : number = 12;
    static XWXY : number = 76;
    static XWXZ : number = 140;
    static XWXW : number = 204;
    static XWYX : number = 28;
    static XWYY : number = 92;
    static XWYZ : number = 156;
    static XWYW : number = 220;
    static XWZX : number = 44;
    static XWZY : number = 108;
    static XWZZ : number = 172;
    static XWZW : number = 236;
    static XWWX : number = 60;
    static XWWY : number = 124;
    static XWWZ : number = 188;
    static XWWW : number = 252;
    static YXXX : number = 1;
    static YXXY : number = 65;
    static YXXZ : number = 129;
    static YXXW : number = 193;
    static YXYX : number = 17;
    static YXYY : number = 81;
    static YXYZ : number = 145;
    static YXYW : number = 209;
    static YXZX : number = 33;
    static YXZY : number = 97;
    static YXZZ : number = 161;
    static YXZW : number = 225;
    static YXWX : number = 49;
    static YXWY : number = 113;
    static YXWZ : number = 177;
    static YXWW : number = 241;
    static YYXX : number = 5;
    static YYXY : number = 69;
    static YYXZ : number = 133;
    static YYXW : number = 197;
    static YYYX : number = 21;
    static YYYY : number = 85;
    static YYYZ : number = 149;
    static YYYW : number = 213;
    static YYZX : number = 37;
    static YYZY : number = 101;
    static YYZZ : number = 165;
    static YYZW : number = 229;
    static YYWX : number = 53;
    static YYWY : number = 117;
    static YYWZ : number = 181;
    static YYWW : number = 245;
    static YZXX : number = 9;
    static YZXY : number = 73;
    static YZXZ : number = 137;
    static YZXW : number = 201;
    static YZYX : number = 25;
    static YZYY : number = 89;
    static YZYZ : number = 153;
    static YZYW : number = 217;
    static YZZX : number = 41;
    static YZZY : number = 105;
    static YZZZ : number = 169;
    static YZZW : number = 233;
    static YZWX : number = 57;
    static YZWY : number = 121;
    static YZWZ : number = 185;
    static YZWW : number = 249;
    static YWXX : number = 13;
    static YWXY : number = 77;
    static YWXZ : number = 141;
    static YWXW : number = 205;
    static YWYX : number = 29;
    static YWYY : number = 93;
    static YWYZ : number = 157;
    static YWYW : number = 221;
    static YWZX : number = 45;
    static YWZY : number = 109;
    static YWZZ : number = 173;
    static YWZW : number = 237;
    static YWWX : number = 61;
    static YWWY : number = 125;
    static YWWZ : number = 189;
    static YWWW : number = 253;
    static ZXXX : number = 2;
    static ZXXY : number = 66;
    static ZXXZ : number = 130;
    static ZXXW : number = 194;
    static ZXYX : number = 18;
    static ZXYY : number = 82;
    static ZXYZ : number = 146;
    static ZXYW : number = 210;
    static ZXZX : number = 34;
    static ZXZY : number = 98;
    static ZXZZ : number = 162;
    static ZXZW : number = 226;
    static ZXWX : number = 50;
    static ZXWY : number = 114;
    static ZXWZ : number = 178;
    static ZXWW : number = 242;
    static ZYXX : number = 6;
    static ZYXY : number = 70;
    static ZYXZ : number = 134;
    static ZYXW : number = 198;
    static ZYYX : number = 22;
    static ZYYY : number = 86;
    static ZYYZ : number = 150;
    static ZYYW : number = 214;
    static ZYZX : number = 38;
    static ZYZY : number = 102;
    static ZYZZ : number = 166;
    static ZYZW : number = 230;
    static ZYWX : number = 54;
    static ZYWY : number = 118;
    static ZYWZ : number = 182;
    static ZYWW : number = 246;
    static ZZXX : number = 10;
    static ZZXY : number = 74;
    static ZZXZ : number = 138;
    static ZZXW : number = 202;
    static ZZYX : number = 26;
    static ZZYY : number = 90;
    static ZZYZ : number = 154;
    static ZZYW : number = 218;
    static ZZZX : number = 42;
    static ZZZY : number = 106;
    static ZZZZ : number = 170;
    static ZZZW : number = 234;
    static ZZWX : number = 58;
    static ZZWY : number = 122;
    static ZZWZ : number = 186;
    static ZZWW : number = 250;
    static ZWXX : number = 14;
    static ZWXY : number = 78;
    static ZWXZ : number = 142;
    static ZWXW : number = 206;
    static ZWYX : number = 30;
    static ZWYY : number = 94;
    static ZWYZ : number = 158;
    static ZWYW : number = 222;
    static ZWZX : number = 46;
    static ZWZY : number = 110;
    static ZWZZ : number = 174;
    static ZWZW : number = 238;
    static ZWWX : number = 62;
    static ZWWY : number = 126;
    static ZWWZ : number = 190;
    static ZWWW : number = 254;
    static WXXX : number = 3;
    static WXXY : number = 67;
    static WXXZ : number = 131;
    static WXXW : number = 195;
    static WXYX : number = 19;
    static WXYY : number = 83;
    static WXYZ : number = 147;
    static WXYW : number = 211;
    static WXZX : number = 35;
    static WXZY : number = 99;
    static WXZZ : number = 163;
    static WXZW : number = 227;
    static WXWX : number = 51;
    static WXWY : number = 115;
    static WXWZ : number = 179;
    static WXWW : number = 243;
    static WYXX : number = 7;
    static WYXY : number = 71;
    static WYXZ : number = 135;
    static WYXW : number = 199;
    static WYYX : number = 23;
    static WYYY : number = 87;
    static WYYZ : number = 151;
    static WYYW : number = 215;
    static WYZX : number = 39;
    static WYZY : number = 103;
    static WYZZ : number = 167;
    static WYZW : number = 231;
    static WYWX : number = 55;
    static WYWY : number = 119;
    static WYWZ : number = 183;
    static WYWW : number = 247;
    static WZXX : number = 11;
    static WZXY : number = 75;
    static WZXZ : number = 139;
    static WZXW : number = 203;
    static WZYX : number = 27;
    static WZYY : number = 91;
    static WZYZ : number = 155;
    static WZYW : number = 219;
    static WZZX : number = 43;
    static WZZY : number = 107;
    static WZZZ : number = 171;
    static WZZW : number = 235;
    static WZWX : number = 59;
    static WZWY : number = 123;
    static WZWZ : number = 187;
    static WZWW : number = 251;
    static WWXX : number = 15;
    static WWXY : number = 79;
    static WWXZ : number = 143;
    static WWXW : number = 207;
    static WWYX : number = 31;
    static WWYY : number = 95;
    static WWYZ : number = 159;
    static WWYW : number = 223;
    static WWZX : number = 47;
    static WWZY : number = 111;
    static WWZZ : number = 175;
    static WWZW : number = 239;
    static WWWX : number = 63;
    static WWWY : number = 127;
    static WWWZ : number = 191;
    static WWWW : number = 255;
    @Abstract
    shuffle(mask : number) : Float32x4{ throw 'abstract'}
    @Abstract
    shuffleMix(other : Float32x4,mask : number) : Float32x4{ throw 'abstract'}
    @Abstract
    withX(x : double) : Float32x4{ throw 'abstract'}
    @Abstract
    withY(y : double) : Float32x4{ throw 'abstract'}
    @Abstract
    withZ(z : double) : Float32x4{ throw 'abstract'}
    @Abstract
    withW(w : double) : Float32x4{ throw 'abstract'}
    @Abstract
    min(other : Float32x4) : Float32x4{ throw 'abstract'}
    @Abstract
    max(other : Float32x4) : Float32x4{ throw 'abstract'}
    @Abstract
    sqrt() : Float32x4{ throw 'abstract'}
    @Abstract
    reciprocal() : Float32x4{ throw 'abstract'}
    @Abstract
    reciprocalSqrt() : Float32x4{ throw 'abstract'}
}

@DartClass
export class Int32x4 {
    constructor(x : number,y : number,z : number,w : number) {
        throw 'external';
    }
    @defaultFactory
    static _Int32x4(x : number,y : number,z : number,w : number) : Int32x4 {
        throw 'external';
    }
    @namedFactory
    static _bool(x : boolean,y : boolean,z : boolean,w : boolean) : Int32x4 {
        throw 'external';
    }
    static bool : new(x : boolean,y : boolean,z : boolean,w : boolean) => Int32x4;
    @namedFactory
    static _fromFloat32x4Bits(x : Float32x4) : Int32x4 {
        throw 'external';
    }
    static fromFloat32x4Bits : new(x : Float32x4) => Int32x4;
    //@Abstract
    [OperatorMethods.BINARY_OR](other : Int32x4) : Int32x4{ throw 'abstract'}
    //@Abstract
    [OperatorMethods.BINARY_AND](other : Int32x4) : Int32x4{ throw 'abstract'}
    //@Abstract
    [OperatorMethods.XOR](other : Int32x4) : Int32x4{ throw 'abstract'}
    //@Abstract
    [OperatorMethods.PLUS](other : Int32x4) : Int32x4{ throw 'abstract'}
    //@Abstract
    [OperatorMethods.MINUS](other : Int32x4) : Int32x4{ throw 'abstract'}
    @AbstractProperty
    get x() : number{ throw 'abstract'}
    @AbstractProperty
    get y() : number{ throw 'abstract'}
    @AbstractProperty
    get z() : number{ throw 'abstract'}
    @AbstractProperty
    get w() : number{ throw 'abstract'}
    @AbstractProperty
    get signMask() : number{ throw 'abstract'}
    static XXXX : number = 0;
    static XXXY : number = 64;
    static XXXZ : number = 128;
    static XXXW : number = 192;
    static XXYX : number = 16;
    static XXYY : number = 80;
    static XXYZ : number = 144;
    static XXYW : number = 208;
    static XXZX : number = 32;
    static XXZY : number = 96;
    static XXZZ : number = 160;
    static XXZW : number = 224;
    static XXWX : number = 48;
    static XXWY : number = 112;
    static XXWZ : number = 176;
    static XXWW : number = 240;
    static XYXX : number = 4;
    static XYXY : number = 68;
    static XYXZ : number = 132;
    static XYXW : number = 196;
    static XYYX : number = 20;
    static XYYY : number = 84;
    static XYYZ : number = 148;
    static XYYW : number = 212;
    static XYZX : number = 36;
    static XYZY : number = 100;
    static XYZZ : number = 164;
    static XYZW : number = 228;
    static XYWX : number = 52;
    static XYWY : number = 116;
    static XYWZ : number = 180;
    static XYWW : number = 244;
    static XZXX : number = 8;
    static XZXY : number = 72;
    static XZXZ : number = 136;
    static XZXW : number = 200;
    static XZYX : number = 24;
    static XZYY : number = 88;
    static XZYZ : number = 152;
    static XZYW : number = 216;
    static XZZX : number = 40;
    static XZZY : number = 104;
    static XZZZ : number = 168;
    static XZZW : number = 232;
    static XZWX : number = 56;
    static XZWY : number = 120;
    static XZWZ : number = 184;
    static XZWW : number = 248;
    static XWXX : number = 12;
    static XWXY : number = 76;
    static XWXZ : number = 140;
    static XWXW : number = 204;
    static XWYX : number = 28;
    static XWYY : number = 92;
    static XWYZ : number = 156;
    static XWYW : number = 220;
    static XWZX : number = 44;
    static XWZY : number = 108;
    static XWZZ : number = 172;
    static XWZW : number = 236;
    static XWWX : number = 60;
    static XWWY : number = 124;
    static XWWZ : number = 188;
    static XWWW : number = 252;
    static YXXX : number = 1;
    static YXXY : number = 65;
    static YXXZ : number = 129;
    static YXXW : number = 193;
    static YXYX : number = 17;
    static YXYY : number = 81;
    static YXYZ : number = 145;
    static YXYW : number = 209;
    static YXZX : number = 33;
    static YXZY : number = 97;
    static YXZZ : number = 161;
    static YXZW : number = 225;
    static YXWX : number = 49;
    static YXWY : number = 113;
    static YXWZ : number = 177;
    static YXWW : number = 241;
    static YYXX : number = 5;
    static YYXY : number = 69;
    static YYXZ : number = 133;
    static YYXW : number = 197;
    static YYYX : number = 21;
    static YYYY : number = 85;
    static YYYZ : number = 149;
    static YYYW : number = 213;
    static YYZX : number = 37;
    static YYZY : number = 101;
    static YYZZ : number = 165;
    static YYZW : number = 229;
    static YYWX : number = 53;
    static YYWY : number = 117;
    static YYWZ : number = 181;
    static YYWW : number = 245;
    static YZXX : number = 9;
    static YZXY : number = 73;
    static YZXZ : number = 137;
    static YZXW : number = 201;
    static YZYX : number = 25;
    static YZYY : number = 89;
    static YZYZ : number = 153;
    static YZYW : number = 217;
    static YZZX : number = 41;
    static YZZY : number = 105;
    static YZZZ : number = 169;
    static YZZW : number = 233;
    static YZWX : number = 57;
    static YZWY : number = 121;
    static YZWZ : number = 185;
    static YZWW : number = 249;
    static YWXX : number = 13;
    static YWXY : number = 77;
    static YWXZ : number = 141;
    static YWXW : number = 205;
    static YWYX : number = 29;
    static YWYY : number = 93;
    static YWYZ : number = 157;
    static YWYW : number = 221;
    static YWZX : number = 45;
    static YWZY : number = 109;
    static YWZZ : number = 173;
    static YWZW : number = 237;
    static YWWX : number = 61;
    static YWWY : number = 125;
    static YWWZ : number = 189;
    static YWWW : number = 253;
    static ZXXX : number = 2;
    static ZXXY : number = 66;
    static ZXXZ : number = 130;
    static ZXXW : number = 194;
    static ZXYX : number = 18;
    static ZXYY : number = 82;
    static ZXYZ : number = 146;
    static ZXYW : number = 210;
    static ZXZX : number = 34;
    static ZXZY : number = 98;
    static ZXZZ : number = 162;
    static ZXZW : number = 226;
    static ZXWX : number = 50;
    static ZXWY : number = 114;
    static ZXWZ : number = 178;
    static ZXWW : number = 242;
    static ZYXX : number = 6;
    static ZYXY : number = 70;
    static ZYXZ : number = 134;
    static ZYXW : number = 198;
    static ZYYX : number = 22;
    static ZYYY : number = 86;
    static ZYYZ : number = 150;
    static ZYYW : number = 214;
    static ZYZX : number = 38;
    static ZYZY : number = 102;
    static ZYZZ : number = 166;
    static ZYZW : number = 230;
    static ZYWX : number = 54;
    static ZYWY : number = 118;
    static ZYWZ : number = 182;
    static ZYWW : number = 246;
    static ZZXX : number = 10;
    static ZZXY : number = 74;
    static ZZXZ : number = 138;
    static ZZXW : number = 202;
    static ZZYX : number = 26;
    static ZZYY : number = 90;
    static ZZYZ : number = 154;
    static ZZYW : number = 218;
    static ZZZX : number = 42;
    static ZZZY : number = 106;
    static ZZZZ : number = 170;
    static ZZZW : number = 234;
    static ZZWX : number = 58;
    static ZZWY : number = 122;
    static ZZWZ : number = 186;
    static ZZWW : number = 250;
    static ZWXX : number = 14;
    static ZWXY : number = 78;
    static ZWXZ : number = 142;
    static ZWXW : number = 206;
    static ZWYX : number = 30;
    static ZWYY : number = 94;
    static ZWYZ : number = 158;
    static ZWYW : number = 222;
    static ZWZX : number = 46;
    static ZWZY : number = 110;
    static ZWZZ : number = 174;
    static ZWZW : number = 238;
    static ZWWX : number = 62;
    static ZWWY : number = 126;
    static ZWWZ : number = 190;
    static ZWWW : number = 254;
    static WXXX : number = 3;
    static WXXY : number = 67;
    static WXXZ : number = 131;
    static WXXW : number = 195;
    static WXYX : number = 19;
    static WXYY : number = 83;
    static WXYZ : number = 147;
    static WXYW : number = 211;
    static WXZX : number = 35;
    static WXZY : number = 99;
    static WXZZ : number = 163;
    static WXZW : number = 227;
    static WXWX : number = 51;
    static WXWY : number = 115;
    static WXWZ : number = 179;
    static WXWW : number = 243;
    static WYXX : number = 7;
    static WYXY : number = 71;
    static WYXZ : number = 135;
    static WYXW : number = 199;
    static WYYX : number = 23;
    static WYYY : number = 87;
    static WYYZ : number = 151;
    static WYYW : number = 215;
    static WYZX : number = 39;
    static WYZY : number = 103;
    static WYZZ : number = 167;
    static WYZW : number = 231;
    static WYWX : number = 55;
    static WYWY : number = 119;
    static WYWZ : number = 183;
    static WYWW : number = 247;
    static WZXX : number = 11;
    static WZXY : number = 75;
    static WZXZ : number = 139;
    static WZXW : number = 203;
    static WZYX : number = 27;
    static WZYY : number = 91;
    static WZYZ : number = 155;
    static WZYW : number = 219;
    static WZZX : number = 43;
    static WZZY : number = 107;
    static WZZZ : number = 171;
    static WZZW : number = 235;
    static WZWX : number = 59;
    static WZWY : number = 123;
    static WZWZ : number = 187;
    static WZWW : number = 251;
    static WWXX : number = 15;
    static WWXY : number = 79;
    static WWXZ : number = 143;
    static WWXW : number = 207;
    static WWYX : number = 31;
    static WWYY : number = 95;
    static WWYZ : number = 159;
    static WWYW : number = 223;
    static WWZX : number = 47;
    static WWZY : number = 111;
    static WWZZ : number = 175;
    static WWZW : number = 239;
    static WWWX : number = 63;
    static WWWY : number = 127;
    static WWWZ : number = 191;
    static WWWW : number = 255;
    @Abstract
    shuffle(mask : number) : Int32x4{ throw 'abstract'}
    @Abstract
    shuffleMix(other : Int32x4,mask : number) : Int32x4{ throw 'abstract'}
    @Abstract
    withX(x : number) : Int32x4{ throw 'abstract'}
    @Abstract
    withY(y : number) : Int32x4{ throw 'abstract'}
    @Abstract
    withZ(z : number) : Int32x4{ throw 'abstract'}
    @Abstract
    withW(w : number) : Int32x4{ throw 'abstract'}
    @AbstractProperty
    get flagX() : boolean{ throw 'abstract'}
    @AbstractProperty
    get flagY() : boolean{ throw 'abstract'}
    @AbstractProperty
    get flagZ() : boolean{ throw 'abstract'}
    @AbstractProperty
    get flagW() : boolean{ throw 'abstract'}
    @Abstract
    withFlagX(x : boolean) : Int32x4{ throw 'abstract'}
    @Abstract
    withFlagY(y : boolean) : Int32x4{ throw 'abstract'}
    @Abstract
    withFlagZ(z : boolean) : Int32x4{ throw 'abstract'}
    @Abstract
    withFlagW(w : boolean) : Int32x4{ throw 'abstract'}
    @Abstract
    select(trueValue : Float32x4,falseValue : Float32x4) : Float32x4{ throw 'abstract'}
}

@DartClass
export class Float64x2 {
    constructor(x : double,y : double) {
        throw 'external';
    }
    @defaultFactory
    static _Float64x2(x : double,y : double) : Float64x2 {
        throw 'external';
    }
    @namedFactory
    static _splat(v : double) : Float64x2 {
        throw 'external';
    }
    static splat : new(v : double) => Float64x2;
    @namedFactory
    static _zero() : Float64x2 {
        throw 'external';
    }
    static zero : new() => Float64x2;
    @namedFactory
    static _fromFloat32x4(v : Float32x4) : Float64x2 {
        throw 'external';
    }
    static fromFloat32x4 : new(v : Float32x4) => Float64x2;
   // @Abstract
    [OperatorMethods.PLUS](other : Float64x2) : Float64x2{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.NEGATE]() : Float64x2{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.MINUS](other : Float64x2) : Float64x2{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.MULTIPLY](other : Float64x2) : Float64x2{ throw 'abstract'}
   // @Abstract
    [OperatorMethods.DIVIDE](other : Float64x2) : Float64x2{ throw 'abstract'}
    @Abstract
    scale(s : double) : Float64x2{ throw 'abstract'}
    @Abstract
    abs() : Float64x2{ throw 'abstract'}
    @Abstract
    clamp(lowerLimit : Float64x2,upperLimit : Float64x2) : Float64x2{ throw 'abstract'}
    @AbstractProperty
    get x() : double{ throw 'abstract'}
    @AbstractProperty
    get y() : double{ throw 'abstract'}
    @AbstractProperty
    get signMask() : number{ throw 'abstract'}
    @Abstract
    withX(x : double) : Float64x2{ throw 'abstract'}
    @Abstract
    withY(y : double) : Float64x2{ throw 'abstract'}
    @Abstract
    min(other : Float64x2) : Float64x2{ throw 'abstract'}
    @Abstract
    max(other : Float64x2) : Float64x2{ throw 'abstract'}
    @Abstract
    sqrt() : Float64x2{ throw 'abstract'}
}

export class _Properties {
}
export const properties : _Properties = new _Properties();
