/** Library asset:sample_project/lib/core/uri.dart */
import {is,equals} from "./_common";
import {defaultConstructor,namedConstructor,namedFactory,defaultFactory,DartClass,Implements,op,Op,OperatorMethods,DartClassAnnotation,DartMethodAnnotation,DartPropertyAnnotation,Abstract,AbstractProperty} from "./utils";
import * as _common from "./_common";
import * as core from "./core";
import * as async from "./async";
import * as typed_data from "./typed_data";
import * as convert from "./convert";
import * as _internal from './_internal';

@DartClass
export class Uri {
    static get base() : Uri {
        throw 'external';
    }
    constructor(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) {
    }
    @defaultFactory
    static _Uri(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) : Uri {
        let {scheme,userInfo,host,port,path,pathSegments,query,queryParameters,fragment} = Object.assign({
        }, _namedArguments );
        return new _Uri({
            scheme : scheme,userInfo : userInfo,host : host,port : port,path : path,pathSegments : pathSegments,query : query,queryParameters : queryParameters,fragment : fragment});
    }
    @namedFactory
    static _http(authority : string,unencodedPath : string,queryParameters? : core.DartMap<string,string>) : Uri {
        return new _Uri.http(authority,unencodedPath,queryParameters);
    }
    static http : new(authority : string,unencodedPath : string,queryParameters : core.DartMap<string,string>) => Uri;
    @namedFactory
    static _https(authority : string,unencodedPath : string,queryParameters? : core.DartMap<string,string>) : Uri {
        return new _Uri.https(authority,unencodedPath,queryParameters);
    }
    static https : new(authority : string,unencodedPath : string,queryParameters : core.DartMap<string,string>) => Uri;
    @namedFactory
    static _file(path : string,_namedArguments? : {windows? : boolean}) : Uri {
        let {windows} = Object.assign({
        }, _namedArguments );
        return new _Uri.file(path,{
            windows : windows});
    }
    static file : new(path : string,_namedArguments? : {windows? : boolean}) => Uri;
    @namedFactory
    static _directory(path : string,_namedArguments? : {windows? : boolean}) : Uri {
        let {windows} = Object.assign({
        }, _namedArguments );
        return new _Uri.directory(path,{
            windows : windows});
    }
    static directory : new(path : string,_namedArguments? : {windows? : boolean}) => Uri;
    @namedFactory
    static _dataFromString(content : string,_namedArguments? : {mimeType? : string,encoding? : any,parameters? : core.DartMap<string,string>,base64? : boolean}) : Uri {
        let {mimeType,encoding,parameters,base64} = Object.assign({
            "base64" : false}, _namedArguments );
        let data : UriData = new UriData.fromString(content,{
            mimeType : mimeType,encoding : encoding,parameters : parameters,base64 : base64});
        return data.uri;
    }
    static dataFromString : new(content : string,_namedArguments? : {mimeType? : string,encoding? : any,parameters? : core.DartMap<string,string>,base64? : boolean}) => Uri;
    @namedFactory
    static _dataFromBytes(bytes : core.DartList<number>,_namedArguments? : {mimeType? : any,parameters? : core.DartMap<string,string>,percentEncoded? : any}) : Uri {
        let {mimeType,parameters,percentEncoded} = Object.assign({
            "mimeType" : "application/octet-stream",
            "percentEncoded" : false}, _namedArguments );
        let data : UriData = new UriData.fromBytes(bytes,{
            mimeType : mimeType,parameters : parameters,percentEncoded : percentEncoded});
        return data.uri;
    }
    static dataFromBytes : new(bytes : core.DartList<number>,_namedArguments? : {mimeType? : any,parameters? : core.DartMap<string,string>,percentEncoded? : any}) => Uri;
    @AbstractProperty
    get scheme() : string{ throw 'abstract'}
    @AbstractProperty
    get authority() : string{ throw 'abstract'}
    @AbstractProperty
    get userInfo() : string{ throw 'abstract'}
    @AbstractProperty
    get host() : string{ throw 'abstract'}
    @AbstractProperty
    get port() : number{ throw 'abstract'}
    @AbstractProperty
    get path() : string{ throw 'abstract'}
    @AbstractProperty
    get query() : string{ throw 'abstract'}
    @AbstractProperty
    get fragment() : string{ throw 'abstract'}
    @AbstractProperty
    get pathSegments() : core.DartList<string>{ throw 'abstract'}
    @AbstractProperty
    get queryParameters() : core.DartMap<string,string>{ throw 'abstract'}
    @AbstractProperty
    get queryParametersAll() : core.DartMap<string,core.DartList<string>>{ throw 'abstract'}
    @AbstractProperty
    get isAbsolute() : boolean{ throw 'abstract'}
    get hasScheme() : boolean {
        return new core.DartString(this.scheme).isNotEmpty;
    }
    @AbstractProperty
    get hasAuthority() : boolean{ throw 'abstract'}
    @AbstractProperty
    get hasPort() : boolean{ throw 'abstract'}
    @AbstractProperty
    get hasQuery() : boolean{ throw 'abstract'}
    @AbstractProperty
    get hasFragment() : boolean{ throw 'abstract'}
    @AbstractProperty
    get hasEmptyPath() : boolean{ throw 'abstract'}
    @AbstractProperty
    get hasAbsolutePath() : boolean{ throw 'abstract'}
    @AbstractProperty
    get origin() : string{ throw 'abstract'}
    @Abstract
    isScheme(scheme : string) : boolean{ throw 'abstract'}
    @Abstract
    toFilePath(_namedArguments? : {windows? : boolean}) : string{ throw 'abstract'}
    @AbstractProperty
    get data() : UriData{ throw 'abstract'}
    @AbstractProperty
    get hashCode() : number{ throw 'abstract'}
    //@Abstract
    [OperatorMethods.EQUALS](other : core.DartObject) : boolean{ throw 'abstract'}
    @Abstract
    toString() : string{ throw 'abstract'}
    @Abstract
    replace(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) : Uri{ throw 'abstract'}
    @Abstract
    removeFragment() : Uri{ throw 'abstract'}
    @Abstract
    resolve(reference : string) : Uri{ throw 'abstract'}
    @Abstract
    resolveUri(reference : Uri) : Uri{ throw 'abstract'}
    @Abstract
    normalizePath() : Uri{ throw 'abstract'}
    static parse(uri : string,start? : number,end? : number) : Uri {
        start = start || 0;
        end = uri.length;
        if (end >= start + 5) {
            let dataDelta : number = _startsWithData(uri,start);
            if (dataDelta == 0) {
                if (start > 0 || end < uri.length) uri = uri.substring(start,end);
                return UriData._parse(uri,5,null).uri;
            }else if (dataDelta == 32) {
                return UriData._parse(uri.substring(start + 5,end),0,null).uri;
            }
        }
        let indices = new core.DartList<number>(8);
        ((_) : core.DartList<number> =>  {
            {
                _[0] = 0;
                _[properties._schemeEndIndex] = start - 1;
                _[properties._hostStartIndex] = start - 1;
                _[properties._notSimpleIndex] = start - 1;
                _[properties._portStartIndex] = start;
                _[properties._pathStartIndex] = start;
                _[properties._queryStartIndex] = end;
                _[properties._fragmentStartIndex] = end;
                return _;
            }
        })(indices);
        let state = _scan(uri,start,end,properties._uriStart,indices);
        if (state >= properties._nonSimpleEndStates) {
            indices[properties._notSimpleIndex] = end;
        }
        let schemeEnd : number = indices[properties._schemeEndIndex];
        if (schemeEnd >= start) {
            state = _scan(uri,start,schemeEnd,properties._schemeStart,indices);
            if (state == properties._schemeStart) {
                indices[properties._notSimpleIndex] = schemeEnd;
            }
        }
        let hostStart : number = indices[properties._hostStartIndex] + 1;
        let portStart : number = indices[properties._portStartIndex];
        let pathStart : number = indices[properties._pathStartIndex];
        let queryStart : number = indices[properties._queryStartIndex];
        let fragmentStart : number = indices[properties._fragmentStartIndex];
        let scheme : string;
        if (fragmentStart < queryStart) queryStart = fragmentStart;
        if (pathStart < hostStart || pathStart <= schemeEnd) {
            pathStart = queryStart;
        }
        if (portStart < hostStart) portStart = pathStart;
        /* TODO (AssertStatementImpl) : assert (hostStart == start || schemeEnd <= hostStart); */;
        /* TODO (AssertStatementImpl) : assert (hostStart <= portStart); */;
        /* TODO (AssertStatementImpl) : assert (schemeEnd <= pathStart); */;
        /* TODO (AssertStatementImpl) : assert (portStart <= pathStart); */;
        /* TODO (AssertStatementImpl) : assert (pathStart <= queryStart); */;
        /* TODO (AssertStatementImpl) : assert (queryStart <= fragmentStart); */;
        let isSimple : boolean = indices[properties._notSimpleIndex] < start;
        if (isSimple) {
            if (hostStart > schemeEnd + 3) {
                isSimple = false;
            }else if (portStart > start && portStart + 1 == pathStart) {
                isSimple = false;
            }else if (queryStart < end && (queryStart == pathStart + 2 && uri.startsWith("..",pathStart)) || (queryStart > pathStart + 2 && uri.startsWith("/..",queryStart - 3))) {
                isSimple = false;
            }else {
                if (schemeEnd == start + 4) {
                    if (uri.startsWith("file",start)) {
                        scheme = "file";
                        if (hostStart <= start) {
                            let schemeAuth : string = "file://";
                            let delta : number = 2;
                            if (!uri.startsWith("/",pathStart)) {
                                schemeAuth = "file:///";
                                delta = 3;
                            }
                            uri = schemeAuth + uri.substring(pathStart,end);
                            schemeEnd = start;
                            hostStart = 7;
                            portStart = 7;
                            pathStart = 7;
                            queryStart = delta - start;
                            fragmentStart = delta - start;
                            start = 0;
                            end = uri.length;
                        }else if (pathStart == queryStart) {
                            if (start == 0 && end == uri.length) {
                                uri = new core.DartString(uri).replaceRange(pathStart,queryStart,"/");
                                queryStart = 1;
                                fragmentStart = 1;
                                end = 1;
                            }else {
                                uri = `${uri.substring(start,pathStart)}/` + `${uri.substring(queryStart,end)}`;
                                schemeEnd = start;
                                hostStart = start;
                                portStart = start;
                                pathStart = start;
                                queryStart = 1 - start;
                                fragmentStart = 1 - start;
                                start = 0;
                                end = uri.length;
                            }
                        }
                    }else if (uri.startsWith("http",start)) {
                        scheme = "http";
                        if (portStart > start && portStart + 3 == pathStart && uri.startsWith("80",portStart + 1)) {
                            if (start == 0 && end == uri.length) {
                                uri = new core.DartString(uri).replaceRange(portStart,pathStart,"");
                                pathStart = 3;
                                queryStart = 3;
                                fragmentStart = 3;
                                end = 3;
                            }else {
                                uri = uri.substring(start,portStart) + uri.substring(pathStart,end);
                                schemeEnd = start;
                                hostStart = start;
                                portStart = start;
                                pathStart = 3 + start;
                                queryStart = 3 + start;
                                fragmentStart = 3 + start;
                                start = 0;
                                end = uri.length;
                            }
                        }
                    }
                }else if (schemeEnd == start + 5 && uri.startsWith("https",start)) {
                    scheme = "https";
                    if (portStart > start && portStart + 4 == pathStart && uri.startsWith("443",portStart + 1)) {
                        if (start == 0 && end == uri.length) {
                            uri = new core.DartString(uri).replaceRange(portStart,pathStart,"");
                            pathStart = 4;
                            queryStart = 4;
                            fragmentStart = 4;
                            end = 3;
                        }else {
                            uri = uri.substring(start,portStart) + uri.substring(pathStart,end);
                            schemeEnd = start;
                            hostStart = start;
                            portStart = start;
                            pathStart = 4 + start;
                            queryStart = 4 + start;
                            fragmentStart = 4 + start;
                            start = 0;
                            end = uri.length;
                        }
                    }
                }
            }
        }
        if (isSimple) {
            if (start > 0 || end < uri.length) {
                uri = uri.substring(start,end);
                schemeEnd = start;
                hostStart = start;
                portStart = start;
                pathStart = start;
                queryStart = start;
                fragmentStart = start;
            }
            return new _SimpleUri(uri,schemeEnd,hostStart,portStart,pathStart,queryStart,fragmentStart,scheme);
        }
        return new _Uri.notSimple(uri,start,end,schemeEnd,hostStart,portStart,pathStart,queryStart,fragmentStart,scheme);
    }
    static encodeComponent(component : string) : string {
        return _Uri._uriEncode(_Uri._unreserved2396Table,component,convert.properties.UTF8,false);
    }
    static encodeQueryComponent(component : string,_namedArguments? : {encoding? : any}) : string {
        let {encoding} = Object.assign({
            "encoding" : convert.properties.UTF8}, _namedArguments );
        return _Uri._uriEncode(_Uri._unreservedTable,component,encoding,true);
    }
    static decodeComponent(encodedComponent : string) : string {
        return _Uri._uriDecode(encodedComponent,0,encodedComponent.length,convert.properties.UTF8,false);
    }
    static decodeQueryComponent(encodedComponent : string,_namedArguments? : {encoding? : any}) : string {
        let {encoding} = Object.assign({
            "encoding" : convert.properties.UTF8}, _namedArguments );
        return _Uri._uriDecode(encodedComponent,0,encodedComponent.length,encoding,true);
    }
    static encodeFull(uri : string) : string {
        return _Uri._uriEncode(_Uri._encodeFullTable,uri,convert.properties.UTF8,false);
    }
    static decodeFull(uri : string) : string {
        return _Uri._uriDecode(uri,0,uri.length,convert.properties.UTF8,false);
    }
    static splitQueryString(query : string,_namedArguments? : {encoding? : any}) : core.DartMap<string,string> {
        let {encoding} = Object.assign({
            "encoding" : convert.properties.UTF8}, _namedArguments );
        return query.split("&").fold(new core.DartMap.literal([]),(map : any,element : any) =>  {
            let index : number = element.indexOf("=");
            if (index == -1) {
                if (element != "") {
                    op(Op.INDEX_ASSIGN,map,Uri.decodeQueryComponent(element,{
                        encoding : encoding}),"");
                }
            }else if (index != 0) {
                let key = element.substring(0,index);
                let value = element.substring(index + 1);
                op(Op.INDEX_ASSIGN,map,Uri.decodeQueryComponent(key,{
                    encoding : encoding}),Uri.decodeQueryComponent(value,{
                    encoding : encoding}));
            }
            return map;
        });
    }
    static parseIPv4Address(host : string) : core.DartList<number> {
        return Uri._parseIPv4Address(host,0,host.length);
    }
    static _parseIPv4Address(host : string,start : number,end : number) : core.DartList<number> {
        var error : (msg : string,position : number) => void = (msg : string,position : number) : void =>  {
            throw new core.FormatException(`Illegal IPv4 address, ${msg}`,host,position);
        };
        let result = new typed_data.Uint8List(4);
        let partIndex : number = 0;
        let partStart : number = start;
        for(let i : number = start; i < end; i++){
            let char : number = new core.DartString(host).codeUnitAt(i);
            if (char != properties._DOT) {
                if ((char ^ 48) > 9) {
                    error("invalid character",i);
                }
            }else {
                if (partIndex == 3) {
                    error('IPv4 address should contain exactly 4 parts',i);
                }
                let part : number = core.DartNumber.parse(host.substring(partStart,i));
                if (part > 255) {
                    error("each part must be in the range 0..255",partStart);
                }
                op(Op.INDEX_ASSIGN,result,partIndex++,part);
                partStart = i + 1;
            }
        }
        if (partIndex != 3) {
            error('IPv4 address should contain exactly 4 parts',end);
        }
        let part : number = core.DartNumber.parse(host.substring(partStart,end));
        if (part > 255) {
            error("each part must be in the range 0..255",partStart);
        }
        op(Op.INDEX_ASSIGN,result,partIndex,part);
        return result;
    }
    static parseIPv6Address(host : string,start? : number,end? : number) : core.DartList<number> {
        start = start || 0;
        if (end == null) end = host.length;
        var error : (msg : string,position? : any) => void = (msg : string,position? : any) : void =>  {
            throw new core.FormatException(`Illegal IPv6 address, ${msg}`,host,position);
        };
        var parseHex : (start : number,end : number) => number = (start : number,end : number) : number =>  {
            if (end - start > 4) {
                error('an IPv6 part can only contain a maximum of 4 hex digits',start);
            }
            let value : number = core.DartInt.parse(host.substring(start,end),{
                radix : 16});
            if (value < 0 || value > 65535) {
                error('each part must be in the range of `0x0..0xFFFF`',start);
            }
            return value;
        };
        if (host.length < 2) error('address is too short');
        let parts : core.DartList<number> = new core.DartList.literal();
        let wildcardSeen : boolean = false;
        let seenDot : boolean = false;
        let partStart : number = start;
        for(let i : number = start; i < end; i++){
            let char : number = new core.DartString(host).codeUnitAt(i);
            if (char == properties._COLON) {
                if (i == start) {
                    i++;
                    if (new core.DartString(host).codeUnitAt(i) != properties._COLON) {
                        error('invalid start colon.',i);
                    }
                    partStart = i;
                }
                if (i == partStart) {
                    if (wildcardSeen) {
                        error('only one wildcard `::` is allowed',i);
                    }
                    wildcardSeen = true;
                    parts.add(-1);
                }else {
                    parts.add(parseHex(partStart,i));
                }
                partStart = i + 1;
            }else if (char == properties._DOT) {
                seenDot = true;
            }
        }
        if (parts.length == 0) error('too few parts');
        let atEnd : boolean = (partStart == end);
        let isLastWildcard : boolean = (parts.last == -1);
        if (atEnd && !isLastWildcard) {
            error('expected a part after last `:`',end);
        }
        if (!atEnd) {
            if (!seenDot) {
                parts.add(parseHex(partStart,end));
            }else {
                let last : core.DartList<number> = Uri._parseIPv4Address(host,partStart,end);
                parts.add(last[0] << 8 | last[1]);
                parts.add(last[2] << 8 | last[3]);
            }
        }
        if (wildcardSeen) {
            if (parts.length > 7) {
                error('an address with a wildcard must have less than 7 parts');
            }
        }else if (parts.length != 8) {
            error('an address without a wildcard must contain exactly 8 parts');
        }
        let bytes : core.DartList<number> = new typed_data.Uint8List(16);
        for(let i : number = 0,index : number = 0; i < parts.length; i++){
            let value : number = parts[i];
            if (value == -1) {
                let wildCardLength : number = 9 - parts.length;
                for(let j : number = 0; j < wildCardLength; j++){
                    bytes[index] = 0;
                    bytes[index + 1] = 0;
                    index = 2;
                }
            }else {
                bytes[index] = value >> 8;
                bytes[index + 1] = value & 255;
                index = 2;
            }
        }
        return bytes;
    }
}

@DartClass
@Implements(Uri)
export class _Uri extends Uri {
    scheme : string;
    _userInfo : string;
    _host : string;
    _port : number;
    path : string;
    _query : string;
    _fragment : string;
    _pathSegments : core.DartList<string>;
    _text : string;
    _hashCodeCache : number;
    _queryParameters : core.DartMap<string,string>;
    _queryParameterLists : core.DartMap<string,core.DartList<string>>;
    @namedConstructor
    _internal(scheme : string,_userInfo : string,_host : string,_port : number,path : string,_query : string,_fragment : string) {
        this.scheme = scheme;
        this._userInfo = _userInfo;
        this._host = _host;
        this._port = _port;
        this.path = path;
        this._query = _query;
        this._fragment = _fragment;
    }
    static _internal : new(scheme : string,_userInfo : string,_host : string,_port : number,path : string,_query : string,_fragment : string) => _Uri;
    @namedFactory
    static _notSimple(uri : string,start : number,end : number,schemeEnd : number,hostStart : number,portStart : number,pathStart : number,queryStart : number,fragmentStart : number,scheme : string) : _Uri {
        if (scheme == null) {
            scheme = "";
            if (schemeEnd > start) {
                scheme = _Uri._makeScheme(uri,start,schemeEnd);
            }else if (schemeEnd == start) {
                _Uri._fail(uri,start,"Invalid empty scheme");
            }
        }
        let userInfo : string = "";
        let host : string;
        let port : number;
        if (hostStart > start) {
            let userInfoStart : number = schemeEnd + 3;
            if (userInfoStart < hostStart) {
                userInfo = _Uri._makeUserInfo(uri,userInfoStart,hostStart - 1);
            }
            host = _Uri._makeHost(uri,hostStart,portStart,false);
            if (portStart + 1 < pathStart) {
                port = core.DartInt.parse(uri.substring(portStart + 1,pathStart),{
                    onError : (_ : any) =>  {
                        throw new core.FormatException("Invalid port",uri,portStart + 1);
                    }});
                port = _Uri._makePort(port,scheme);
            }
        }
        let path : string = _Uri._makePath(uri,pathStart,queryStart,null,scheme,host != null);
        let query : string;
        if (queryStart < fragmentStart) {
            query = _Uri._makeQuery(uri,queryStart + 1,fragmentStart,null);
        }
        let fragment : string;
        if (fragmentStart < end) {
            fragment = _Uri._makeFragment(uri,fragmentStart + 1,end);
        }
        return new _Uri._internal(scheme,userInfo,host,port,path,query,fragment);
    }
    static notSimple : new(uri : string,start : number,end : number,schemeEnd : number,hostStart : number,portStart : number,pathStart : number,queryStart : number,fragmentStart : number,scheme : string) => _Uri;
    constructor(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) {
        super();
    }
    @defaultFactory
    static __Uri(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) : _Uri {
        let {scheme,userInfo,host,port,path,pathSegments,query,queryParameters,fragment} = Object.assign({
        }, _namedArguments );
        scheme = _Uri._makeScheme(scheme,0,_stringOrNullLength(scheme));
        userInfo = _Uri._makeUserInfo(userInfo,0,_stringOrNullLength(userInfo));
        host = _Uri._makeHost(host,0,_stringOrNullLength(host),false);
        if (query == "") query = null;
        query = _Uri._makeQuery(query,0,_stringOrNullLength(query),queryParameters);
        fragment = _Uri._makeFragment(fragment,0,_stringOrNullLength(fragment));
        port = _Uri._makePort(port,scheme);
        let isFile : boolean = (scheme == "file");
        if (host == null && (new core.DartString(userInfo).isNotEmpty || port != null || isFile)) {
            host = "";
        }
        let hasAuthority : boolean = (host != null);
        path = _Uri._makePath(path,0,_stringOrNullLength(path),pathSegments,scheme,hasAuthority);
        if (new core.DartString(scheme).isEmpty && host == null && !path.startsWith('/')) {
            let allowScheme : boolean = new core.DartString(scheme).isNotEmpty || host != null;
            path = _Uri._normalizeRelativePath(path,allowScheme);
        }else {
            path = _Uri._removeDotSegments(path);
        }
        if (host == null && path.startsWith("//")) {
            host = "";
        }
        return new _Uri._internal(scheme,userInfo,host,port,path,query,fragment);
    }
    @namedFactory
    static _http(authority : string,unencodedPath : string,queryParameters? : core.DartMap<string,string>) : _Uri {
        return _Uri._makeHttpUri("http",authority,unencodedPath,queryParameters) as _Uri;
    }
    static http : new(authority : string,unencodedPath : string,queryParameters : core.DartMap<string,string>) => _Uri;
    @namedFactory
    static _https(authority : string,unencodedPath : string,queryParameters? : core.DartMap<string,string>) : _Uri {
        return _Uri._makeHttpUri("https",authority,unencodedPath,queryParameters) as _Uri;
    }
    static https : new(authority : string,unencodedPath : string,queryParameters : core.DartMap<string,string>) => _Uri;
    get authority() : string {
        if (!this.hasAuthority) return "";
        let sb = new core.DartStringBuffer();
        this._writeAuthority(sb);
        return sb.toString();
    }
    get userInfo() : string {
        return this._userInfo;
    }
    get host() : string {
        if (this._host == null) return "";
        if (this._host.startsWith('[')) {
            return this._host.substring(1,this._host.length - 1);
        }
        return this._host;
    }
    get port() : number {
        if (this._port == null) return _Uri._defaultPort(this.scheme);
        return this._port;
    }
    static _defaultPort(scheme : string) : number {
        if (scheme == "http") return 80;
        if (scheme == "https") return 443;
        return 0;
    }
    get query() : string {
        return this._query || "";
    }
    get fragment() : string {
        return this._fragment || "";
    }
    isScheme(scheme : string) : boolean {
        let thisScheme : string = this.scheme;
        if (scheme == null) return new core.DartString(thisScheme).isEmpty;
        if (scheme.length != thisScheme.length) return false;
        return _Uri._compareScheme(scheme,thisScheme);
    }
    static _compareScheme(scheme : string,uri : string) : boolean {
        for(let i : number = 0; i < scheme.length; i++){
            let schemeChar : number = new core.DartString(scheme).codeUnitAt(i);
            let uriChar : number = new core.DartString(uri).codeUnitAt(i);
            let delta : number = schemeChar ^ uriChar;
            if (delta != 0) {
                if (delta == 32) {
                    let lowerChar : number = uriChar | delta;
                    if (97 <= lowerChar && lowerChar <= 122) {
                        continue;
                    }
                }
                return false;
            }
        }
        return true;
    }
    static _fail(uri : string,index : number,message : string) : void {
        throw new core.FormatException(message,uri,index);
    }
    static _makeHttpUri(scheme : string,authority : string,unencodedPath : string,queryParameters : core.DartMap<string,string>) : Uri {
        let userInfo = "";
        let host = null;
        let port = null;
        if (authority != null && new core.DartString(authority).isNotEmpty) {
            let hostStart = 0;
            let hasUserInfo : boolean = false;
            for(let i : number = 0; i < authority.length; i++){
                let atSign : number = 64;
                if (new core.DartString(authority).codeUnitAt(i) == atSign) {
                    hasUserInfo = true;
                    userInfo = authority.substring(0,i);
                    hostStart = i + 1;
                    break;
                }
            }
            let hostEnd = hostStart;
            if (hostStart < authority.length && new core.DartString(authority).codeUnitAt(hostStart) == properties._LEFT_BRACKET) {
                for(; hostEnd < authority.length; hostEnd++){
                    if (new core.DartString(authority).codeUnitAt(hostEnd) == properties._RIGHT_BRACKET) break;
                }
                if (hostEnd == authority.length) {
                    throw new core.FormatException("Invalid IPv6 host entry.",authority,hostStart);
                }
                Uri.parseIPv6Address(authority,hostStart + 1,hostEnd);
                hostEnd++;
                if (hostEnd != authority.length && new core.DartString(authority).codeUnitAt(hostEnd) != properties._COLON) {
                    throw new core.FormatException("Invalid end of authority",authority,hostEnd);
                }
            }
            let hasPort : boolean = false;
            for(; hostEnd < authority.length; hostEnd++){
                if (new core.DartString(authority).codeUnitAt(hostEnd) == properties._COLON) {
                    let portString = authority.substring(hostEnd + 1);
                    if (new core.DartString(portString).isNotEmpty) port = core.DartNumber.parse(portString);
                    break;
                }
            }
            host = authority.substring(hostStart,hostEnd);
        }
        return new Uri({
            scheme : scheme,userInfo : userInfo,host : host,port : port,pathSegments : unencodedPath.split("/"),queryParameters : queryParameters});
    }
    @namedFactory
    static _file(path : string,_namedArguments? : {windows? : boolean}) : _Uri {
        let {windows} = Object.assign({
        }, _namedArguments );
        windows = (windows == null) ? _Uri._isWindows : windows;
        return windows ? _Uri._makeWindowsFileUrl(path,false) as _Uri: _Uri._makeFileUri(path,false)as _Uri;
    }
    static file : new(path : string,_namedArguments? : {windows? : boolean}) => _Uri;
    @namedFactory
    static _directory(path : string,_namedArguments? : {windows? : boolean}) : _Uri {
        let {windows} = Object.assign({
        }, _namedArguments );
        windows = (windows == null) ? _Uri._isWindows : windows;
        return windows ? _Uri._makeWindowsFileUrl(path,true)as _Uri : _Uri._makeFileUri(path,true)as _Uri;
    }
    static directory : new(path : string,_namedArguments? : {windows? : boolean}) => _Uri;
    static get _isWindows() : boolean {
        return false;
    }
    static _checkNonWindowsPathReservedCharacters(segments : core.DartList<string>,argumentError : boolean) {
        segments.forEach((segment : any) =>  {
            if (segment.contains("/")) {
                if (argumentError) {
                    throw new core.ArgumentError(`Illegal path character ${segment}`);
                }else {
                    throw new core.UnsupportedError(`Illegal path character ${segment}`);
                }
            }
        });
    }
    static _checkWindowsPathReservedCharacters(segments : core.DartList<string>,argumentError : boolean,firstSegment? : number) {
        firstSegment = firstSegment || 0;
        for(let segment of segments.skip(firstSegment)) {
            if (new core.DartString(segment).contains(new core.DartRegExp('["*/:<>?\\|]'))) {
                if (argumentError) {
                    throw new core.ArgumentError("Illegal character in path");
                }else {
                    throw new core.UnsupportedError("Illegal character in path");
                }
            }
        }
    }
    static _checkWindowsDriveLetter(charCode : number,argumentError : boolean) {
        if ((properties._UPPER_CASE_A <= charCode && charCode <= properties._UPPER_CASE_Z) || (properties._LOWER_CASE_A <= charCode && charCode <= properties._LOWER_CASE_Z)) {
            return;
        }
        if (argumentError) {
            throw new core.ArgumentError("Illegal drive letter " + new core.DartString.fromCharCode(charCode).valueOf());
        }else {
            throw new core.UnsupportedError("Illegal drive letter " + new core.DartString.fromCharCode(charCode).valueOf());
        }
    }
    static _makeFileUri(path : string,slashTerminated : boolean) {
        let sep : string = "/";
        let segments = path.split(sep);
        if (slashTerminated && segments.isNotEmpty && new core.DartString(segments.last).isNotEmpty) {
            segments.add("");
        }
        if (path.startsWith(sep)) {
            return new Uri({
                scheme : "file",pathSegments : segments});
        }else {
            return new Uri({
                pathSegments : segments});
        }
    }
    static _makeWindowsFileUrl(path : string,slashTerminated : boolean) {
        if (path.startsWith("\\\\?\\")) {
            if (path.startsWith("UNC\\\\",4)) {
                path = new core.DartString(path).replaceRange(0,7,'\\');
            }else {
                path = path.substring(4);
                if (path.length < 3 || new core.DartString(path).codeUnitAt(1) != properties._COLON || new core.DartString(path).codeUnitAt(2) != properties._BACKSLASH) {
                    throw new core.ArgumentError("Windows paths with \\?\ prefix must be absolute");
                }
            }
        }else {
            path = new core.DartString(path).replaceAll(new core.DartString("/"),'\\');
        }
        let sep : string = '\\';
        if (path.length > 1 && new core.DartString(path).codeUnitAt(1) == properties._COLON) {
            _Uri._checkWindowsDriveLetter(new core.DartString(path).codeUnitAt(0),true);
            if (path.length == 2 || new core.DartString(path).codeUnitAt(2) != properties._BACKSLASH) {
                throw new core.ArgumentError("Windows paths with drive letter must be absolute");
            }
            let pathSegments = path.split(sep);
            if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                pathSegments.add("");
            }
            _Uri._checkWindowsPathReservedCharacters(pathSegments,true,1);
            return new Uri({
                scheme : "file",pathSegments : pathSegments});
        }
        if (path.startsWith(sep)) {
            if (path.startsWith(sep,1)) {
                let pathStart : number = path.indexOf('\\',2);
                let hostPart : string = (pathStart < 0) ? path.substring(2) : path.substring(2,pathStart);
                let pathPart : string = (pathStart < 0) ? "" : path.substring(pathStart + 1);
                let pathSegments = pathPart.split(sep);
                _Uri._checkWindowsPathReservedCharacters(pathSegments,true);
                if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                    pathSegments.add("");
                }
                return new Uri({
                    scheme : "file",host : hostPart,pathSegments : pathSegments});
            }else {
                let pathSegments = path.split(sep);
                if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                    pathSegments.add("");
                }
                _Uri._checkWindowsPathReservedCharacters(pathSegments,true);
                return new Uri({
                    scheme : "file",pathSegments : pathSegments});
            }
        }else {
            let pathSegments = path.split(sep);
            _Uri._checkWindowsPathReservedCharacters(pathSegments,true);
            if (slashTerminated && pathSegments.isNotEmpty && new core.DartString(pathSegments.last).isNotEmpty) {
                pathSegments.add("");
            }
            return new Uri({
                pathSegments : pathSegments});
        }
    }
    replace(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) : Uri {
        let {scheme,userInfo,host,port,path,pathSegments,query,queryParameters,fragment} = Object.assign({
        }, _namedArguments );
        let schemeChanged : boolean = false;
        if (scheme != null) {
            scheme = _Uri._makeScheme(scheme,0,scheme.length);
            schemeChanged = (scheme != this.scheme);
        }else {
            scheme = this.scheme;
        }
        let isFile : boolean = (scheme == "file");
        if (userInfo != null) {
            userInfo = _Uri._makeUserInfo(userInfo,0,userInfo.length);
        }else {
            userInfo = this._userInfo;
        }
        if (port != null) {
            port = _Uri._makePort(port,scheme);
        }else {
            port = this._port;
            if (schemeChanged) {
                port = _Uri._makePort(port,scheme);
            }
        }
        if (host != null) {
            host = _Uri._makeHost(host,0,host.length,false);
        }else if (this.hasAuthority) {
            host = this._host;
        }else if (new core.DartString(userInfo).isNotEmpty || port != null || isFile) {
            host = "";
        }
        let hasAuthority : boolean = host != null;
        if (path != null || pathSegments != null) {
            path = _Uri._makePath(path,0,_stringOrNullLength(path),pathSegments,scheme,hasAuthority);
        }else {
            path = this.path;
            if ((isFile || (hasAuthority && !new core.DartString(path).isEmpty)) && !path.startsWith('/')) {
                path = "/" + path;
            }
        }
        if (query != null || queryParameters != null) {
            query = _Uri._makeQuery(query,0,_stringOrNullLength(query),queryParameters);
        }else {
            query = this._query;
        }
        if (fragment != null) {
            fragment = _Uri._makeFragment(fragment,0,fragment.length);
        }else {
            fragment = this._fragment;
        }
        return new _Uri._internal(scheme,userInfo,host,port,path,query,fragment);
    }
    removeFragment() : Uri {
        if (!this.hasFragment) return this;
        return new _Uri._internal(this.scheme,this._userInfo,this._host,this._port,this.path,this._query,null);
    }
    get pathSegments() : core.DartList<string> {
        let result = this._pathSegments;
        if (result != null) return result;
        let pathToSplit = this.path;
        if (new core.DartString(pathToSplit).isNotEmpty && new core.DartString(pathToSplit).codeUnitAt(0) == properties._SLASH) {
            pathToSplit = pathToSplit.substring(1);
        }
        result = (pathToSplit == "") ? new core.DartList.literal<string>() : new core.DartList.unmodifiable<string>(pathToSplit.split("/").map(Uri.decodeComponent.bind(Uri)));
        this._pathSegments = result;
        return result;
    }
    get queryParameters() : core.DartMap<string,string> {
        if (this._queryParameters == null) {
            this._queryParameters = new core.DartUnmodifiableMapView(Uri.splitQueryString(this.query));
        }
        return this._queryParameters;
    }
    get queryParametersAll() : core.DartMap<string,core.DartList<string>> {
        if (this._queryParameterLists == null) {
            let queryParameterLists : core.DartMap<any,any> = _Uri._splitQueryStringAll(this.query);
            for(let key of queryParameterLists.keys) {
                queryParameterLists.set(key,new core.DartList.unmodifiable(queryParameterLists.get(key)));
            }
            this._queryParameterLists = new core.DartMap.unmodifiable(queryParameterLists);
        }
        return this._queryParameterLists;
    }
    normalizePath() : Uri {
        let path : string = _Uri._normalizePath(this.path,this.scheme,this.hasAuthority);
        if (core.identical(path,this.path)) return this;
        return this.replace({
            path : path});
    }
    static _makePort(port : number,scheme : string) : number {
        if (port != null && port == _Uri._defaultPort(scheme)) return null;
        return port;
    }
    static _makeHost(host : string,start : number,end : number,strictIPv6 : boolean) : string {
        if (host == null) return null;
        if (start == end) return "";
        if (new core.DartString(host).codeUnitAt(start) == properties._LEFT_BRACKET) {
            if (new core.DartString(host).codeUnitAt(end - 1) != properties._RIGHT_BRACKET) {
                _Uri._fail(host,start,'Missing end `]` to match `[` in host');
            }
            Uri.parseIPv6Address(host,start + 1,end - 1);
            return host.substring(start,end).toLowerCase();
        }
        if (!strictIPv6) {
            for(let i : number = start; i < end; i++){
                if (new core.DartString(host).codeUnitAt(i) == properties._COLON) {
                    Uri.parseIPv6Address(host,start,end);
                    return `[${host}]`;
                }
            }
        }
        return _Uri._normalizeRegName(host,start,end);
    }
    static _isRegNameChar(char : number) : boolean {
        return char < 127 && (op(Op.BITAND,op(Op.INDEX,_Uri._regNameTable,char >> 4),(1 << (char & 15)))) != 0;
    }
    static _normalizeRegName(host : string,start : number,end : number) : string {
        let buffer : core.DartStringBuffer;
        let sectionStart : number = start;
        let index : number = start;
        let isNormalized : boolean = true;
        while (index < end){
            let char : number = new core.DartString(host).codeUnitAt(index);
            if (char == properties._PERCENT) {
                let replacement : string = _Uri._normalizeEscape(host,index,true);
                if (replacement == null && isNormalized) {
                    index = 3;
                    continue;
                }
                if (op(Op.EQUALS,buffer,null)) buffer = new core.DartStringBuffer();
                let slice : string = host.substring(sectionStart,index);
                if (!isNormalized) slice = slice.toLowerCase();
                buffer.write(slice);
                let sourceLength : number = 3;
                if (replacement == null) {
                    replacement = host.substring(index,index + 3);
                }else if (replacement == "%") {
                    replacement = "%25";
                    sourceLength = 1;
                }
                buffer.write(replacement);
                index = sourceLength;
                sectionStart = index;
                isNormalized = true;
            }else if (_Uri._isRegNameChar(char)) {
                if (isNormalized && properties._UPPER_CASE_A <= char && properties._UPPER_CASE_Z >= char) {
                    if (op(Op.EQUALS,buffer,null)) buffer = new core.DartStringBuffer();
                    if (sectionStart < index) {
                        buffer.write(host.substring(sectionStart,index));
                        sectionStart = index;
                    }
                    isNormalized = false;
                }
                index++;
            }else if (_Uri._isGeneralDelimiter(char)) {
                _Uri._fail(host,index,"Invalid character");
            }else {
                let sourceLength : number = 1;
                if ((char & 64512) == 55296 && (index + 1) < end) {
                    let tail : number = new core.DartString(host).codeUnitAt(index + 1);
                    if ((tail & 64512) == 56320) {
                        char = 65536 | ((char & 1023) << 10) | (tail & 1023);
                        sourceLength = 2;
                    }
                }
                if (op(Op.EQUALS,buffer,null)) buffer = new core.DartStringBuffer();
                let slice : string = host.substring(sectionStart,index);
                if (!isNormalized) slice = slice.toLowerCase();
                buffer.write(slice);
                buffer.write(_Uri._escapeChar(char));
                index = sourceLength;
                sectionStart = index;
            }
        }
        if (op(Op.EQUALS,buffer,null)) return host.substring(start,end);
        if (sectionStart < end) {
            let slice : string = host.substring(sectionStart,end);
            if (!isNormalized) slice = slice.toLowerCase();
            buffer.write(slice);
        }
        return buffer.toString();
    }
    static _makeScheme(scheme : string,start : number,end : number) : string {
        if (start == end) return "";
        let firstCodeUnit : number = new core.DartString(scheme).codeUnitAt(start);
        if (!_Uri._isAlphabeticCharacter(firstCodeUnit)) {
            _Uri._fail(scheme,start,"Scheme not starting with alphabetic character");
        }
        let containsUpperCase : boolean = false;
        for(let i : number = start; i < end; i++){
            let codeUnit : number = new core.DartString(scheme).codeUnitAt(i);
            if (!_Uri._isSchemeCharacter(codeUnit)) {
                _Uri._fail(scheme,i,"Illegal scheme character");
            }
            if (properties._UPPER_CASE_A <= codeUnit && codeUnit <= properties._UPPER_CASE_Z) {
                containsUpperCase = true;
            }
        }
        scheme = scheme.substring(start,end);
        if (containsUpperCase) scheme = scheme.toLowerCase();
        return _Uri._canonicalizeScheme(scheme);
    }
    static _canonicalizeScheme(scheme : string) : string {
        if (scheme == "http") return "http";
        if (scheme == "file") return "file";
        if (scheme == "https") return "https";
        if (scheme == "package") return "package";
        return scheme;
    }
    static _makeUserInfo(userInfo : string,start : number,end : number) : string {
        if (userInfo == null) return "";
        return _Uri._normalizeOrSubstring(userInfo,start,end,_Uri._userinfoTable);
    }
    static _makePath(path : string,start : number,end : number,pathSegments : core.DartIterable<string>,scheme : string,hasAuthority : boolean) : string {
        let isFile : boolean = (scheme == "file");
        let ensureLeadingSlash : boolean = isFile || hasAuthority;
        if (path == null && pathSegments == null) return isFile ? "/" : "";
        if (path != null && pathSegments != null) {
            throw new core.ArgumentError('Both path and pathSegments specified');
        }
        let result;
        if (path != null) {
            result = _Uri._normalizeOrSubstring(path,start,end,_Uri._pathCharOrSlashTable);
        }else {
            result = pathSegments.map((s : any) =>  {
                return _Uri._uriEncode(_Uri._pathCharTable,s,convert.properties.UTF8,false);
            }).join("/");
        }
        if (new core.DartString(result).isEmpty) {
            if (isFile) return "/";
        }else if (ensureLeadingSlash && !result.startsWith('/')) {
            result = "/" + result;
        }
        result = _Uri._normalizePath(result,scheme,hasAuthority);
        return result;
    }
    static _normalizePath(path : string,scheme : string,hasAuthority : boolean) : string {
        if (new core.DartString(scheme).isEmpty && !hasAuthority && !path.startsWith('/')) {
            return _Uri._normalizeRelativePath(path,new core.DartString(scheme).isNotEmpty || hasAuthority);
        }
        return _Uri._removeDotSegments(path);
    }
    static _makeQuery(query : string,start : number,end : number,queryParameters : core.DartMap<string,any>) : string {
        if (query != null) {
            if (queryParameters != null) {
                throw new core.ArgumentError('Both query and queryParameters specified');
            }
            return _Uri._normalizeOrSubstring(query,start,end,_Uri._queryCharTable);
        }
        if (queryParameters == null) return null;
        let result = new core.DartStringBuffer();
        let separator = "";
        var writeParameter : (key : string,value : string) => void = (key : string,value : string) : void =>  {
            result.write(separator);
            separator = "&";
            result.write(Uri.encodeQueryComponent(key));
            if (value != null && new core.DartString(value).isNotEmpty) {
                result.write("=");
                result.write(Uri.encodeQueryComponent(value));
            }
        };
        queryParameters.forEach((key : any,value : any) =>  {
            if (op(Op.EQUALS,value,null) || is(value, "string")) {
                writeParameter(key,value);
            }else {
                let values : core.DartIterable<any> = value;
                for(let value of values) {
                    writeParameter(key,value);
                }
            }
        });
        return result.toString();
    }
    static _makeFragment(fragment : string,start : number,end : number) : string {
        if (fragment == null) return null;
        return _Uri._normalizeOrSubstring(fragment,start,end,_Uri._queryCharTable);
    }
    static _normalizeEscape(source : string,index : number,lowerCase : boolean) : string {
        /* TODO (AssertStatementImpl) : assert (new core.DartString(source).codeUnitAt(index) == _PERCENT); */;
        if (index + 2 >= source.length) {
            return "%";
        }
        let firstDigit : number = new core.DartString(source).codeUnitAt(index + 1);
        let secondDigit : number = new core.DartString(source).codeUnitAt(index + 2);
        let firstDigitValue : number = _internal.hexDigitValue(firstDigit);
        let secondDigitValue : number = _internal.hexDigitValue(secondDigit);
        if (firstDigitValue < 0 || secondDigitValue < 0) {
            return "%";
        }
        let value : number = firstDigitValue * 16 + secondDigitValue;
        if (_Uri._isUnreservedChar(value)) {
            if (lowerCase && properties._UPPER_CASE_A <= value && properties._UPPER_CASE_Z >= value) {
                value = 32;
            }
            return new core.DartString.fromCharCode(value).valueOf();
        }
        if (firstDigit >= properties._LOWER_CASE_A || secondDigit >= properties._LOWER_CASE_A) {
            return source.substring(index,index + 3).toUpperCase();
        }
        return null;
    }
    static _escapeChar(char : number) : string {
        /* TODO (AssertStatementImpl) : assert (char <= 0x10ffff); */;
        let codeUnits : core.DartList<number>;
        if (char < 128) {
            codeUnits = new core.DartList<any>(3);
            codeUnits[0] = properties._PERCENT;
            codeUnits[1] = new core.DartString(properties._hexDigits).codeUnitAt(char >> 4);
            codeUnits[2] = new core.DartString(properties._hexDigits).codeUnitAt(char & 15);
        }else {
            let flag : number = 192;
            let encodedBytes : number = 2;
            if (char > 2047) {
                flag = 224;
                encodedBytes = 3;
                if (char > 65535) {
                    encodedBytes = 4;
                    flag = 240;
                }
            }
            codeUnits = new core.DartList<any>(3 * encodedBytes);
            let index : number = 0;
            while (--encodedBytes >= 0){
                let byte : number = ((char >> (6 * encodedBytes)) & 63) | flag;
                codeUnits[index] = properties._PERCENT;
                codeUnits[index + 1] = new core.DartString(properties._hexDigits).codeUnitAt(byte >> 4);
                codeUnits[index + 2] = new core.DartString(properties._hexDigits).codeUnitAt(byte & 15);
                index = 3;
                flag = 128;
            }
        }
        return new core.DartString.fromCharCodes(codeUnits).valueOf();
    }
    static _normalizeOrSubstring(component : string,start : number,end : number,charTable : core.DartList<number>) : string {
        return _Uri._normalize(component,start,end,charTable) || component.substring(start,end);
    }
    static _normalize(component : string,start : number,end : number,charTable : core.DartList<number>,_namedArguments? : {escapeDelimiters? : boolean}) : string {
        let {escapeDelimiters} = Object.assign({
            "escapeDelimiters" : false}, _namedArguments );
        let buffer : core.DartStringBuffer;
        let sectionStart : number = start;
        let index : number = start;
        while (index < end){
            let char : number = new core.DartString(component).codeUnitAt(index);
            if (char < 127 && (charTable[char >> 4] & (1 << (char & 15))) != 0) {
                index++;
            }else {
                let replacement : string;
                let sourceLength : number;
                if (char == properties._PERCENT) {
                    replacement = _Uri._normalizeEscape(component,index,false);
                    if (replacement == null) {
                        index = 3;
                        continue;
                    }
                    if ("%" == replacement) {
                        replacement = "%25";
                        sourceLength = 1;
                    }else {
                        sourceLength = 3;
                    }
                }else if (!escapeDelimiters && _Uri._isGeneralDelimiter(char)) {
                    _Uri._fail(component,index,"Invalid character");
                }else {
                    sourceLength = 1;
                    if ((char & 64512) == 55296) {
                        if (index + 1 < end) {
                            let tail : number = new core.DartString(component).codeUnitAt(index + 1);
                            if ((tail & 64512) == 56320) {
                                sourceLength = 2;
                                char = 65536 | ((char & 1023) << 10) | (tail & 1023);
                            }
                        }
                    }
                    replacement = _Uri._escapeChar(char);
                }
                if (op(Op.EQUALS,buffer,null)) buffer = new core.DartStringBuffer();
                buffer.write(component.substring(sectionStart,index));
                buffer.write(replacement);
                index = sourceLength;
                sectionStart = index;
            }
        }
        if (op(Op.EQUALS,buffer,null)) {
            return null;
        }
        if (sectionStart < end) {
            buffer.write(component.substring(sectionStart,end));
        }
        return buffer.toString();
    }
    static _isSchemeCharacter(ch : number) : boolean {
        return ch < 128 && ((op(Op.BITAND,op(Op.INDEX,_Uri._schemeTable,ch >> 4),(1 << (ch & 15)))) != 0);
    }
    static _isGeneralDelimiter(ch : number) : boolean {
        return ch <= properties._RIGHT_BRACKET && ((op(Op.BITAND,op(Op.INDEX,_Uri._genDelimitersTable,ch >> 4),(1 << (ch & 15)))) != 0);
    }
    get isAbsolute() : boolean {
        return this.scheme != "" && this.fragment == "";
    }
    _mergePaths(base : string,reference : string) : string {
        let backCount : number = 0;
        let refStart : number = 0;
        while (reference.startsWith("../",refStart)){
            refStart = 3;
            backCount++;
        }
        let baseEnd : number = base.lastIndexOf('/');
        while (baseEnd > 0 && backCount > 0){
            let newEnd : number = base.lastIndexOf('/',baseEnd - 1);
            if (newEnd < 0) {
                break;
            }
            let delta : number = baseEnd - newEnd;
            if ((delta == 2 || delta == 3) && new core.DartString(base).codeUnitAt(newEnd + 1) == properties._DOT && (delta == 2 || new core.DartString(base).codeUnitAt(newEnd + 2) == properties._DOT)) {
                break;
            }
            baseEnd = newEnd;
            backCount--;
        }
        return new core.DartString(base).replaceRange(baseEnd + 1,null,reference.substring(refStart - 3 * backCount));
    }
    static _mayContainDotSegments(path : string) : boolean {
        if (path.startsWith('.')) return true;
        let index : number = path.indexOf("/.");
        return index != -1;
    }
    static _removeDotSegments(path : string) : string {
        if (!_Uri._mayContainDotSegments(path)) return path;
        /* TODO (AssertStatementImpl) : assert (new core.DartString(path).isNotEmpty); */;
        let output : core.DartList<string> = new core.DartList.literal();
        let appendSlash : boolean = false;
        for(let segment of path.split("/")) {
            appendSlash = false;
            if (segment == "..") {
                if (output.isNotEmpty) {
                    output.removeLast();
                    if (output.isEmpty) {
                        output.add("");
                    }
                }
                appendSlash = true;
            }else if ("." == segment) {
                appendSlash = true;
            }else {
                output.add(segment);
            }
        }
        if (appendSlash) output.add("");
        return output.join("/");
    }
    static _normalizeRelativePath(path : string,allowScheme : boolean) : string {
        /* TODO (AssertStatementImpl) : assert (!path.startsWith('/')); */;
        if (!_Uri._mayContainDotSegments(path)) {
            if (!allowScheme) path = _Uri._escapeScheme(path);
            return path;
        }
        /* TODO (AssertStatementImpl) : assert (path.isNotEmpty); */;
        let output : core.DartList<string> = new core.DartList.literal();
        let appendSlash : boolean = false;
        for(let segment of path.split("/")) {
            appendSlash = false;
            if (".." == segment) {
                if (!output.isEmpty && output.last != "..") {
                    output.removeLast();
                    appendSlash = true;
                }else {
                    output.add("..");
                }
            }else if ("." == segment) {
                appendSlash = true;
            }else {
                output.add(segment);
            }
        }
        if (output.isEmpty || (output.length == 1 && output[0].isEmpty)) {
            return "./";
        }
        if (appendSlash || output.last == '..') output.add("");
        if (!allowScheme) output[0] = _Uri._escapeScheme(output[0]);
        return output.join("/");
    }
    static _escapeScheme(path : string) : string {
        if (path.length >= 2 && _Uri._isAlphabeticCharacter(new core.DartString(path).codeUnitAt(0))) {
            for(let i : number = 1; i < path.length; i++){
                let char : number = new core.DartString(path).codeUnitAt(i);
                if (char == properties._COLON) {
                    return `${path.substring(0,i)}%3A${path.substring(i + 1)}`;
                }
                if (char > 127 || (op(Op.EQUALS,(op(Op.BITAND,op(Op.INDEX,_Uri._schemeTable,char >> 4),(1 << (char & 15)))),0))) {
                    break;
                }
            }
        }
        return path;
    }
    resolve(reference : string) : Uri {
        return this.resolveUri(Uri.parse(reference));
    }
    resolveUri(reference : Uri) : Uri {
        let targetScheme : string;
        let targetUserInfo : string = "";
        let targetHost : string;
        let targetPort : number;
        let targetPath : string;
        let targetQuery : string;
        if (new core.DartString(reference.scheme).isNotEmpty) {
            targetScheme = reference.scheme;
            if (reference.hasAuthority) {
                targetUserInfo = reference.userInfo;
                targetHost = reference.host;
                targetPort = reference.hasPort ? reference.port : null;
            }
            targetPath = _Uri._removeDotSegments(reference.path);
            if (reference.hasQuery) {
                targetQuery = reference.query;
            }
        }else {
            targetScheme = this.scheme;
            if (reference.hasAuthority) {
                targetUserInfo = reference.userInfo;
                targetHost = reference.host;
                targetPort = _Uri._makePort(reference.hasPort ? reference.port : null,targetScheme);
                targetPath = _Uri._removeDotSegments(reference.path);
                if (reference.hasQuery) targetQuery = reference.query;
            }else {
                targetUserInfo = this._userInfo;
                targetHost = this._host;
                targetPort = this._port;
                if (reference.path == "") {
                    targetPath = this.path;
                    if (reference.hasQuery) {
                        targetQuery = reference.query;
                    }else {
                        targetQuery = this._query;
                    }
                }else {
                    if (reference.hasAbsolutePath) {
                        targetPath = _Uri._removeDotSegments(reference.path);
                    }else {
                        if (this.hasEmptyPath) {
                            if (!this.hasAuthority) {
                                if (!this.hasScheme) {
                                    targetPath = reference.path;
                                }else {
                                    targetPath = _Uri._removeDotSegments(reference.path);
                                }
                            }else {
                                targetPath = _Uri._removeDotSegments("/" + reference.path);
                            }
                        }else {
                            let mergedPath = this._mergePaths(this.path,reference.path);
                            if (this.hasScheme || this.hasAuthority || this.hasAbsolutePath) {
                                targetPath = _Uri._removeDotSegments(mergedPath);
                            }else {
                                targetPath = _Uri._normalizeRelativePath(mergedPath,this.hasScheme || this.hasAuthority);
                            }
                        }
                    }
                    if (reference.hasQuery) targetQuery = reference.query;
                }
            }
        }
        let fragment : string = reference.hasFragment ? reference.fragment : null;
        return new _Uri._internal(targetScheme,targetUserInfo,targetHost,targetPort,targetPath,targetQuery,fragment);
    }
    get hasScheme() : boolean {
        return new core.DartString(this.scheme).isNotEmpty;
    }
    get hasAuthority() : boolean {
        return this._host != null;
    }
    get hasPort() : boolean {
        return this._port != null;
    }
    get hasQuery() : boolean {
        return this._query != null;
    }
    get hasFragment() : boolean {
        return this._fragment != null;
    }
    get hasEmptyPath() : boolean {
        return new core.DartString(this.path).isEmpty;
    }
    get hasAbsolutePath() : boolean {
        return this.path.startsWith('/');
    }
    get origin() : string {
        if (this.scheme == "") {
            throw new core.StateError(`Cannot use origin without a scheme: ${this}`);
        }
        if (this.scheme != "http" && this.scheme != "https") {
            throw new core.StateError(`Origin is only applicable schemes http and https: ${this}`);
        }
        if (this._host == null || this._host == "") {
            throw new core.StateError(`A ${this.scheme}: URI should have a non-empty host name: ${this}`);
        }
        if (this._port == null) return `${this.scheme}://${this._host}`;
        return `${this.scheme}://${this._host}:${this._port}`;
    }
    toFilePath(_namedArguments? : {windows? : boolean}) : string {
        let {windows} = Object.assign({
        }, _namedArguments );
        if (this.scheme != "" && this.scheme != "file") {
            throw new core.UnsupportedError(`Cannot extract a file path from a ${this.scheme} URI`);
        }
        if (this.query != "") {
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a query component");
        }
        if (this.fragment != "") {
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a fragment component");
        }
        if (windows == null) windows = _Uri._isWindows;
        return windows ? _Uri._toWindowsFilePath(this) : this._toFilePath();
    }
    _toFilePath() : string {
        if (this.hasAuthority && this.host != "") {
            throw new core.UnsupportedError("Cannot extract a non-Windows file path from a file URI " + "with an authority");
        }
        let pathSegments = this.pathSegments;
        _Uri._checkNonWindowsPathReservedCharacters(pathSegments,false);
        let result = new core.DartStringBuffer();
        if (this.hasAbsolutePath) result.write("/");
        result.writeAll(pathSegments,"/");
        return result.toString();
    }
    static _toWindowsFilePath(uri : Uri) : string {
        let hasDriveLetter : boolean = false;
        let segments = uri.pathSegments;
        if (segments.length > 0 && segments[0].length == 2 && segments[0].codeUnitAt(1) == properties._COLON) {
            _Uri._checkWindowsDriveLetter(segments[0].codeUnitAt(0),false);
            _Uri._checkWindowsPathReservedCharacters(segments,false,1);
            hasDriveLetter = true;
        }else {
            _Uri._checkWindowsPathReservedCharacters(segments,false,0);
        }
        let result = new core.DartStringBuffer();
        if (uri.hasAbsolutePath && !hasDriveLetter) result.write("\\");
        if (uri.hasAuthority) {
            let host = uri.host;
            if (new core.DartString(host).isNotEmpty) {
                result.write("\\");
                result.write(host);
                result.write("\\");
            }
        }
        result.writeAll(segments,"\\");
        if (hasDriveLetter && segments.length == 1) result.write("\\");
        return result.toString();
    }
    get _isPathAbsolute() : boolean {
        return this.path != null && this.path.startsWith('/');
    }
    _writeAuthority(ss : core.DartStringSink) : void {
        if (new core.DartString(this._userInfo).isNotEmpty) {
            ss.write(this._userInfo);
            ss.write("@");
        }
        if (this._host != null) ss.write(this._host);
        if (this._port != null) {
            ss.write(":");
            ss.write(this._port);
        }
    }
    get data() : UriData {
        return (this.scheme == "data") ? new UriData.fromUri(this) : null;
    }
    toString() : string {
        return this._text = this._initializeText();
    }
    _initializeText() : string {
        /* TODO (AssertStatementImpl) : assert (_text == null); */;
        let sb : core.DartStringBuffer = new core.DartStringBuffer();
        if (new core.DartString(this.scheme).isNotEmpty) ((_) : core.DartStringBuffer =>  {
            {
                _.write(this.scheme);
                _.write(":");
                return _;
            }
        })(sb);
        if (this.hasAuthority || (this.scheme == "file")) {
            sb.write("//");
            this._writeAuthority(sb);
        }
        sb.write(this.path);
        if (this._query != null) ((_) : core.DartStringBuffer =>  {
            {
                _.write("?");
                _.write(this._query);
                return _;
            }
        })(sb);
        if (this._fragment != null) ((_) : core.DartStringBuffer =>  {
            {
                _.write("#");
                _.write(this._fragment);
                return _;
            }
        })(sb);
        return sb.toString();
    }
    [OperatorMethods.EQUALS](other : any) : boolean {
        if (core.identical(this,other)) return true;
        if (is(other, Uri)) {
            let uri : Uri = other;
            return this.scheme == uri.scheme && this.hasAuthority == uri.hasAuthority && this.userInfo == uri.userInfo && this.host == uri.host && this.port == uri.port && this.path == uri.path && this.hasQuery == uri.hasQuery && this.query == uri.query && this.hasFragment == uri.hasFragment && this.fragment == uri.fragment;
        }
        return false;
    }
    get hashCode() : number {
        return this._hashCodeCache = new core.DartString(this.toString()).hashCode;
    }
    static _createList() : core.DartList<any> {
        return new core.DartList.literal();
    }
    static _splitQueryStringAll(query : string,_namedArguments? : {encoding? : any}) : core.DartMap<any,any> {
        let {encoding} = Object.assign({
            "encoding" : convert.properties.UTF8}, _namedArguments );
        let result : core.DartMap<any,any> = new core.DartMap.literal([]);
        let i : number = 0;
        let start : number = 0;
        let equalsIndex : number = -1;
        var parsePair : (start : number,equalsIndex : number,end : number) => void = (start : number,equalsIndex : number,end : number) : void =>  {
            let key : string;
            let value : string;
            if (start == end) return;
            if (equalsIndex < 0) {
                key = _Uri._uriDecode(query,start,end,encoding,true);
                value = "";
            }else {
                key = _Uri._uriDecode(query,start,equalsIndex,encoding,true);
                value = _Uri._uriDecode(query,equalsIndex + 1,end,encoding,true);
            }
            result.putIfAbsent(key,_Uri._createList.bind(this)).add(value);
        };
        while (i < query.length){
            let char : number = new core.DartString(query).codeUnitAt(i);
            if (char == properties._EQUALS) {
                if (equalsIndex < 0) equalsIndex = i;
            }else if (char == properties._AMPERSAND) {
                parsePair(start,equalsIndex,i);
                start = i + 1;
                equalsIndex = -1;
            }
            i++;
        }
        parsePair(start,equalsIndex,i);
        return result;
    }
    static _uriEncode(canonicalTable : core.DartList<number>,text : string,encoding : any,spaceToPlus : boolean) : string {
        throw "external";
    }
    static _hexCharPairToByte(s : string,pos : number) : number {
        let byte : number = 0;
        for(let i : number = 0; i < 2; i++){
            let charCode = new core.DartString(s).codeUnitAt(pos + i);
            if (48 <= charCode && charCode <= 57) {
                byte = byte * 16 + charCode - 48;
            }else {
                charCode = 32;
                if (97 <= charCode && charCode <= 102) {
                    byte = byte * 16 + charCode - 87;
                }else {
                    throw new core.ArgumentError("Invalid URL encoding");
                }
            }
        }
        return byte;
    }
    static _uriDecode(text : string,start : number,end : number,encoding : any,plusToSpace : boolean) : string {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */;
        /* TODO (AssertStatementImpl) : assert (start <= end); */;
        /* TODO (AssertStatementImpl) : assert (end <= text.length); */;
        /* TODO (AssertStatementImpl) : assert (encoding != null); */;
        let simple : boolean = true;
        for(let i : number = start; i < end; i++){
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit > 127 || codeUnit == properties._PERCENT || (plusToSpace && codeUnit == properties._PLUS)) {
                simple = false;
                break;
            }
        }
        let bytes : core.DartList<number>;
        if (simple) {
            if (op(Op.EQUALS,convert.properties.UTF8,encoding) || op(Op.EQUALS,convert.properties.LATIN1,encoding) || op(Op.EQUALS,convert.properties.ASCII,encoding)) {
                return text.substring(start,end);
            }else {
                bytes = new core.DartString(text.substring(start,end)).codeUnits;
            }
        }else {
            bytes = new core.DartList<any>();
            for(let i : number = start; i < end; i++){
                let codeUnit = new core.DartString(text).codeUnitAt(i);
                if (codeUnit > 127) {
                    throw new core.ArgumentError("Illegal percent encoding in URI");
                }
                if (codeUnit == properties._PERCENT) {
                    if (i + 3 > text.length) {
                        throw new core.ArgumentError('Truncated URI');
                    }
                    bytes.add(_Uri._hexCharPairToByte(text,i + 1));
                    i = 2;
                }else if (plusToSpace && codeUnit == properties._PLUS) {
                    bytes.add(properties._SPACE);
                }else {
                    bytes.add(codeUnit);
                }
            }
        }
        return encoding.decode(bytes);
    }
    static _isAlphabeticCharacter(codeUnit : number) : boolean {
        let lowerCase = codeUnit | 32;
        return (properties._LOWER_CASE_A <= lowerCase && lowerCase <= properties._LOWER_CASE_Z);
    }
    static _isUnreservedChar(char : number) : boolean {
        return char < 127 && ((op(Op.BITAND,op(Op.INDEX,_Uri._unreservedTable,char >> 4),(1 << (char & 15)))) != 0);
    }
    static _unreservedTable = new core.DartList.literal(0,0,24576,1023,65534,34815,65534,18431);
    static _unreserved2396Table = new core.DartList.literal(0,0,26498,1023,65534,34815,65534,18431);
    static _encodeFullTable = new core.DartList.literal(0,0,65498,45055,65535,34815,65534,18431);
    static _schemeTable = new core.DartList.literal(0,0,26624,1023,65534,2047,65534,2047);
    static _schemeLowerTable = new core.DartList.literal(0,0,26624,1023,0,0,65534,2047);
    static _subDelimitersTable = new core.DartList.literal(0,0,32722,11263,65534,34815,65534,18431);
    static _genDelimitersTable = new core.DartList.literal(0,0,32776,33792,1,10240,0,0);
    static _userinfoTable = new core.DartList.literal(0,0,32722,12287,65534,34815,65534,18431);
    static _regNameTable = new core.DartList.literal(0,0,32754,11263,65534,34815,65534,18431);
    static _pathCharTable = new core.DartList.literal(0,0,32722,12287,65535,34815,65534,18431);
    static _pathCharOrSlashTable = new core.DartList.literal(0,0,65490,12287,65535,34815,65534,18431);
    static _queryCharTable = new core.DartList.literal(0,0,65490,45055,65535,34815,65534,18431);
}

@DartClass
export class UriData {
    static _noScheme : number = -1;
    _text : string;
    _separatorIndices : core.DartList<number>;
    _uriCache : Uri;
    @namedConstructor
    _(_text : string,_separatorIndices : core.DartList<number>,_uriCache : Uri) {
        this._text = _text;
        this._separatorIndices = _separatorIndices;
        this._uriCache = _uriCache;
    }
    static _ : new(_text : string,_separatorIndices : core.DartList<number>,_uriCache : Uri) => UriData;
    @namedFactory
    static _fromString(content : string,_namedArguments? : {mimeType? : string,encoding? : any,parameters? : core.DartMap<string,string>,base64? : boolean}) : UriData {
        let {mimeType,encoding,parameters,base64} = Object.assign({
            "base64" : false}, _namedArguments );
        let buffer : core.DartStringBuffer = new core.DartStringBuffer();
        let indices : core.DartList<number> = new core.DartList.literal(UriData._noScheme);
        let charsetName : string;
        let encodingName : string;
        if (parameters != null) charsetName = parameters.get("charset");
        if (op(Op.EQUALS,encoding,null)) {
            if (charsetName != null) {
                encoding = convert.Encoding.getByName(charsetName);
            }
        }else if (charsetName == null) {
            encodingName = encoding.name;
        }
        encoding = convert.properties.ASCII;
        UriData._writeUri(mimeType,encodingName,parameters,buffer,indices);
        indices.add(buffer.length);
        if (base64) {
            buffer.write(';base64,');
            indices.add(buffer.length - 1);
            buffer.write(encoding.fuse(convert.properties.BASE64).encode(content));
        }else {
            buffer.write(',');
            UriData._uriEncodeBytes(UriData._uricTable,encoding.encode(content),buffer);
        }
        return new UriData._(buffer.toString(),indices,null);
    }
    static fromString : new(content : string,_namedArguments? : {mimeType? : string,encoding? : any,parameters? : core.DartMap<string,string>,base64? : boolean}) => UriData;
    @namedFactory
    static _fromBytes(bytes : core.DartList<number>,_namedArguments? : {mimeType? : any,parameters? : core.DartMap<string,string>,percentEncoded? : any}) : UriData {
        let {mimeType,parameters,percentEncoded} = Object.assign({
            "mimeType" : "application/octet-stream",
            "percentEncoded" : false}, _namedArguments );
        let buffer : core.DartStringBuffer = new core.DartStringBuffer();
        let indices : core.DartList<number> = new core.DartList.literal(UriData._noScheme);
        UriData._writeUri(mimeType,null,parameters,buffer,indices);
        indices.add(buffer.length);
        if (percentEncoded) {
            buffer.write(',');
            UriData._uriEncodeBytes(UriData._uricTable,bytes,buffer);
        }else {
            buffer.write(';base64,');
            indices.add(buffer.length - 1);
            convert.properties.BASE64.encoder.startChunkedConversion(new convert.StringConversionSink.fromStringSink(buffer)).addSlice(bytes,0,bytes.length,true);
        }
        return new UriData._(buffer.toString(),indices,null);
    }
    static fromBytes : new(bytes : core.DartList<number>,_namedArguments? : {mimeType? : any,parameters? : core.DartMap<string,string>,percentEncoded? : any}) => UriData;
    @namedFactory
    static _fromUri(uri : Uri) : UriData {
        if (uri.scheme != "data") {
            throw new core.ArgumentError.value(uri,"uri","Scheme must be 'data'");
        }
        if (uri.hasAuthority) {
            throw new core.ArgumentError.value(uri,"uri","Data uri must not have authority");
        }
        if (uri.hasFragment) {
            throw new core.ArgumentError.value(uri,"uri","Data uri must not have a fragment part");
        }
        if (!uri.hasQuery) {
            return UriData._parse(uri.path,0,uri);
        }
        return UriData._parse(`${uri}`,5,uri);
    }
    static fromUri : new(uri : Uri) => UriData;
    static _writeUri(mimeType : string,charsetName : string,parameters : core.DartMap<string,string>,buffer : core.DartStringBuffer,indices : core.DartList<any>) : void {
        if (mimeType == null || mimeType == "text/plain") {
            mimeType = "";
        }
        if (new core.DartString(mimeType).isEmpty || core.identical(mimeType,"application/octet-stream")) {
            buffer.write(mimeType);
        }else {
            let slashIndex : number = UriData._validateMimeType(mimeType);
            if (slashIndex < 0) {
                throw new core.ArgumentError.value(mimeType,"mimeType","Invalid MIME type");
            }
            buffer.write(_Uri._uriEncode(UriData._tokenCharTable,mimeType.substring(0,slashIndex),convert.properties.UTF8,false));
            buffer.write("/");
            buffer.write(_Uri._uriEncode(UriData._tokenCharTable,mimeType.substring(slashIndex + 1),convert.properties.UTF8,false));
        }
        if (charsetName != null) {
            if (indices != null) {
                ((_) : core.DartList<any> =>  {
                    {
                        _.add(buffer.length);
                        _.add(buffer.length + 8);
                        return _;
                    }
                })(indices);
            }
            buffer.write(";charset=");
            buffer.write(_Uri._uriEncode(UriData._tokenCharTable,charsetName,convert.properties.UTF8,false));
        }
        parameters.forEach((key : any,value : any) =>  {
            if (new core.DartString(key).isEmpty) {
                throw new core.ArgumentError.value("","Parameter names must not be empty");
            }
            if (new core.DartString(value).isEmpty) {
                throw new core.ArgumentError.value("","Parameter values must not be empty",`parameters["${key}"]`);
            }
            if (indices != null) indices.add(buffer.length);
            buffer.write(';');
            buffer.write(_Uri._uriEncode(UriData._tokenCharTable,key,convert.properties.UTF8,false));
            if (indices != null) indices.add(buffer.length);
            buffer.write('=');
            buffer.write(_Uri._uriEncode(UriData._tokenCharTable,value,convert.properties.UTF8,false));
        });
    }
    static _validateMimeType(mimeType : string) : number {
        let slashIndex : number = -1;
        for(let i : number = 0; i < mimeType.length; i++){
            let char = new core.DartString(mimeType).codeUnitAt(i);
            if (char != properties._SLASH) continue;
            if (slashIndex < 0) {
                slashIndex = i;
                continue;
            }
            return -1;
        }
        return slashIndex;
    }
    static parse(uri : string) : UriData {
        if (uri.length >= 5) {
            let dataDelta : number = _startsWithData(uri,0);
            if (dataDelta == 0) {
                return UriData._parse(uri,5,null);
            }
            if (dataDelta == 32) {
                return UriData._parse(uri.substring(5),0,null);
            }
        }
        throw new core.FormatException("Does not start with 'data:'",uri,0);
    }
    get uri() : Uri {
        if (this._uriCache != null) return this._uriCache;
        let path : string = this._text;
        let query : string = null;
        let colonIndex : number = this._separatorIndices[0];
        let queryIndex : number = this._text.indexOf('?',colonIndex + 1);
        let end : number = this._text.length;
        if (queryIndex >= 0) {
            query = _Uri._normalizeOrSubstring(this._text,queryIndex + 1,end,_Uri._queryCharTable);
            end = queryIndex;
        }
        path = _Uri._normalizeOrSubstring(this._text,colonIndex + 1,end,_Uri._pathCharOrSlashTable);
        this._uriCache = new _DataUri(this,path,query);
        return this._uriCache;
    }
    get mimeType() : string {
        let start : number = this._separatorIndices[0] + 1;
        let end : number = this._separatorIndices[1];
        if (start == end) return "text/plain";
        return _Uri._uriDecode(this._text,start,end,convert.properties.UTF8,false);
    }
    get charset() : string {
        let parameterStart : number = 1;
        let parameterEnd : number = this._separatorIndices.length - 1;
        if (this.isBase64) {
            parameterEnd = 1;
        }
        for(let i : number = parameterStart; i < parameterEnd; i = 2){
            let keyStart = this._separatorIndices[i] + 1;
            let keyEnd = this._separatorIndices[i + 1];
            if (keyEnd == keyStart + 7 && this._text.startsWith("charset",keyStart)) {
                return _Uri._uriDecode(this._text,keyEnd + 1,this._separatorIndices[i + 2],convert.properties.UTF8,false);
            }
        }
        return "US-ASCII";
    }
    get isBase64() : boolean {
        return new core.DartInt(this._separatorIndices.length).isOdd;
    }
    get contentText() : string {
        return this._text.substring(this._separatorIndices.last + 1);
    }
    contentAsBytes() : core.DartList<number> {
        let text : string = this._text;
        let start : number = this._separatorIndices.last + 1;
        if (this.isBase64) {
            return convert.properties.BASE64.decoder.convert(text,start);
        }
        let percent : number = 37;
        let length : number = text.length - start;
        for(let i : number = start; i < text.length; i++){
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit == percent) {
                i = 2;
                length = 2;
            }
        }
        let result : any = new typed_data.Uint8List(length);
        if (length == text.length) {
            result.setRange(0,length,new core.DartString(text).codeUnits,start);
            return result;
        }
        let index : number = 0;
        for(let i : number = start; i < text.length; i++){
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit != percent) {
                op(Op.INDEX_ASSIGN,result,index++,codeUnit);
            }else {
                if (i + 2 < text.length) {
                    let byte : number = _internal.parseHexByte(text,i + 1);
                    if (byte >= 0) {
                        op(Op.INDEX_ASSIGN,result,index++,byte);
                        i = 2;
                        continue;
                    }
                }
                throw new core.FormatException("Invalid percent escape",text,i);
            }
        }
        /* TODO (AssertStatementImpl) : assert (index == result.length); */;
        return result;
    }
    contentAsString(_namedArguments? : {encoding? : any}) : string {
        let {encoding} = Object.assign({
        }, _namedArguments );
        if (op(Op.EQUALS,encoding,null)) {
            let charset = this.charset;
            encoding = convert.Encoding.getByName(charset);
            if (op(Op.EQUALS,encoding,null)) {
                throw new core.UnsupportedError(`Unknown charset: ${charset}`);
            }
        }
        let text : string = this._text;
        let start : number = this._separatorIndices.last + 1;
        if (this.isBase64) {
            let converter = convert.properties.BASE64.decoder.fuse(encoding.decoder);
            return converter.convert(text.substring(start)) as string;
        }
        return _Uri._uriDecode(text,start,text.length,encoding,false);
    }
    get parameters() : core.DartMap<string,string> {
        let result = new core.DartMap<string,string>();
        for(let i : number = 3; i < this._separatorIndices.length; i = 2){
            let start = this._separatorIndices[i - 2] + 1;
            let equals = this._separatorIndices[i - 1];
            let end = this._separatorIndices[i];
            let key : string = _Uri._uriDecode(this._text,start,equals,convert.properties.UTF8,false);
            let value : string = _Uri._uriDecode(this._text,equals + 1,end,convert.properties.UTF8,false);
            result.set(key,value);
        }
        return result;
    }
    static _parse(text : string,start : number,sourceUri : Uri) : UriData {
        /* TODO (AssertStatementImpl) : assert (start == 0 || start == 5); */;
        /* TODO (AssertStatementImpl) : assert ((start == 5) == text.startsWith("data:")); */;
        let comma : number = 44;
        let slash : number = 47;
        let semicolon : number = 59;
        let equals : number = 61;
        let indices : core.DartList<number> = new core.DartList.literal(start - 1);
        let slashIndex : number = -1;
        let char;
        let i : number = start;
        for(; i < text.length; i++){
            char = new core.DartString(text).codeUnitAt(i);
            if (char == comma || char == semicolon) break;
            if (char == slash) {
                if (slashIndex < 0) {
                    slashIndex = i;
                    continue;
                }
                throw new core.FormatException("Invalid MIME type",text,i);
            }
        }
        if (slashIndex < 0 && i > start) {
            throw new core.FormatException("Invalid MIME type",text,i);
        }
        while (char != comma){
            indices.add(i);
            i++;
            let equalsIndex : number = -1;
            for(; i < text.length; i++){
                char = new core.DartString(text).codeUnitAt(i);
                if (char == equals) {
                    if (equalsIndex < 0) equalsIndex = i;
                }else if (char == semicolon || char == comma) {
                    break;
                }
            }
            if (equalsIndex >= 0) {
                indices.add(equalsIndex);
            }else {
                let lastSeparator = indices.last;
                if (char != comma || i != lastSeparator + 7 || !text.startsWith("base64",lastSeparator + 1)) {
                    throw new core.FormatException("Expecting '='",text,i);
                }
                break;
            }
        }
        indices.add(i);
        let isBase64 : boolean = new core.DartInt(indices.length).isOdd;
        if (isBase64) {
            text = convert.properties.BASE64.normalize(text,i + 1,text.length);
        }else {
            let data = _Uri._normalize(text,i + 1,text.length,UriData._uricTable,{
                escapeDelimiters : true});
            if (data != null) {
                text = new core.DartString(text).replaceRange(i + 1,text.length,data);
            }
        }
        return new UriData._(text,indices,sourceUri);
    }
    static _uriEncodeBytes(canonicalTable : core.DartList<number>,bytes : core.DartList<number>,buffer : core.DartStringSink) : void {
        let byteOr : number = 0;
        for(let i : number = 0; i < bytes.length; i++){
            let byte : number = bytes[i];
            byteOr = byte;
            if (byte < 128 && ((canonicalTable[byte >> 4] & (1 << (byte & 15))) != 0)) {
                buffer.writeCharCode(byte);
            }else {
                buffer.writeCharCode(properties._PERCENT);
                buffer.writeCharCode(new core.DartString(properties._hexDigits).codeUnitAt(byte >> 4));
                buffer.writeCharCode(new core.DartString(properties._hexDigits).codeUnitAt(byte & 15));
            }
        }
        if ((byteOr & ~255) != 0) {
            for(let i : number = 0; i < bytes.length; i++){
                let byte = bytes[i];
                if (byte < 0 || byte > 255) {
                    throw new core.ArgumentError.value(byte,"non-byte value");
                }
            }
        }
    }
    toString() : string {
        return (this._separatorIndices[0] == UriData._noScheme) ? `data:${this._text}` : this._text;
    }
    static _tokenCharTable = new core.DartList.literal(0,0,27858,1023,65534,51199,65535,32767);
    static _uricTable = _Uri._queryCharTable;
    static _base64Table = new core.DartList.literal(0,0,34816,1023,65534,2047,65534,2047);
}

export var _createTables : () => core.DartList<any> = () : core.DartList<any> =>  {
    let stateCount : number = 22;
    let schemeOrPath : number = 1;
    let authOrPath : number = 2;
    let authOrPathSlash : number = 3;
    let uinfoOrHost0 : number = 4;
    let uinfoOrHost : number = 5;
    let uinfoOrPort0 : number = 6;
    let uinfoOrPort : number = 7;
    let ipv6Host : number = 8;
    let relPathSeg : number = 9;
    let pathSeg : number = 10;
    let path : number = 11;
    let query : number = 12;
    let fragment : number = 13;
    let schemeOrPathDot : number = 14;
    let schemeOrPathDot2 : number = 15;
    let relPathSegDot : number = 16;
    let relPathSegDot2 : number = 17;
    let pathSegDot : number = 18;
    let pathSegDot2 : number = 19;
    let scheme0 : number = properties._schemeStart;
    let scheme : number = 21;
    let schemeEnd : number = properties._schemeEndIndex << 5;
    let hostStart : number = properties._hostStartIndex << 5;
    let portStart : number = properties._portStartIndex << 5;
    let pathStart : number = properties._pathStartIndex << 5;
    let queryStart : number = properties._queryStartIndex << 5;
    let fragmentStart : number = properties._fragmentStartIndex << 5;
    let notSimple : number = properties._notSimpleIndex << 5;
    let unreserved = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~";
    let subDelims = "!$&'()*+,;=";
    let pchar = `${unreserved}${subDelims}`;
    let tables = new core.DartList.generate(stateCount,(_ : any) =>  {
        return new typed_data.Uint8List(96);
    });
    var build : (state : any,defaultTransition : any) => any = (state : any,defaultTransition : any) : any =>  {
        return ((_) : any =>  {
            {
                _.fillRange(0,96,defaultTransition);
                return _;
            }
        })(tables[state]);
    };
    var setChars : (target : any,chars : string,transition : number) => void = (target : any,chars : string,transition : number) : void =>  {
        for(let i : number = 0; i < chars.length; i++){
            let char = new core.DartString(chars).codeUnitAt(i);
            op(Op.INDEX_ASSIGN,target,char ^ 96,transition);
        }
    };
    var setRange : (target : any,range : string,transition : number) => void = (target : any,range : string,transition : number) : void =>  {
        for(let i : number = new core.DartString(range).codeUnitAt(0),n : number = new core.DartString(range).codeUnitAt(1); i <= n; i++){
            op(Op.INDEX_ASSIGN,target,i ^ 96,transition);
        }
    };
    let b;
    b = build(properties._uriStart,schemeOrPath | notSimple);
    setChars(b,pchar,schemeOrPath);
    setChars(b,".",schemeOrPathDot);
    setChars(b,":",authOrPath | schemeEnd);
    setChars(b,"/",authOrPathSlash);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(schemeOrPathDot,schemeOrPath | notSimple);
    setChars(b,pchar,schemeOrPath);
    setChars(b,".",schemeOrPathDot2);
    setChars(b,':',authOrPath | schemeEnd);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(schemeOrPathDot2,schemeOrPath | notSimple);
    setChars(b,pchar,schemeOrPath);
    setChars(b,"%",schemeOrPath | notSimple);
    setChars(b,':',authOrPath | schemeEnd);
    setChars(b,"/",relPathSeg);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(schemeOrPath,schemeOrPath | notSimple);
    setChars(b,pchar,schemeOrPath);
    setChars(b,':',authOrPath | schemeEnd);
    setChars(b,"/",pathSeg);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(authOrPath,path | notSimple);
    setChars(b,pchar,path | pathStart);
    setChars(b,"/",authOrPathSlash | pathStart);
    setChars(b,".",pathSegDot | pathStart);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(authOrPathSlash,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,"/",uinfoOrHost0 | hostStart);
    setChars(b,".",pathSegDot);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(uinfoOrHost0,uinfoOrHost | notSimple);
    setChars(b,pchar,uinfoOrHost);
    setRange(b,"AZ",uinfoOrHost | notSimple);
    setChars(b,":",uinfoOrPort0 | portStart);
    setChars(b,"@",uinfoOrHost0 | hostStart);
    setChars(b,"[",ipv6Host | notSimple);
    setChars(b,"/",pathSeg | pathStart);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(uinfoOrHost,uinfoOrHost | notSimple);
    setChars(b,pchar,uinfoOrHost);
    setRange(b,"AZ",uinfoOrHost | notSimple);
    setChars(b,":",uinfoOrPort0 | portStart);
    setChars(b,"@",uinfoOrHost0 | hostStart);
    setChars(b,"/",pathSeg | pathStart);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(uinfoOrPort0,uinfoOrPort | notSimple);
    setRange(b,"19",uinfoOrPort);
    setChars(b,"@",uinfoOrHost0 | hostStart);
    setChars(b,"/",pathSeg | pathStart);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(uinfoOrPort,uinfoOrPort | notSimple);
    setRange(b,"09",uinfoOrPort);
    setChars(b,"@",uinfoOrHost0 | hostStart);
    setChars(b,"/",pathSeg | pathStart);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(ipv6Host,ipv6Host);
    setChars(b,"]",uinfoOrHost);
    b = build(relPathSeg,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,".",relPathSegDot);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(relPathSegDot,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,".",relPathSegDot2);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(relPathSegDot2,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,"/",relPathSeg);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(pathSeg,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,".",pathSegDot);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(pathSegDot,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,".",pathSegDot2);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(pathSegDot2,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,"/",pathSeg | notSimple);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(path,path | notSimple);
    setChars(b,pchar,path);
    setChars(b,"/",pathSeg);
    setChars(b,"?",query | queryStart);
    setChars(b,"#",fragment | fragmentStart);
    b = build(query,query | notSimple);
    setChars(b,pchar,query);
    setChars(b,"?",query);
    setChars(b,"#",fragment | fragmentStart);
    b = build(fragment,fragment | notSimple);
    setChars(b,pchar,fragment);
    setChars(b,"?",fragment);
    b = build(scheme0,scheme | notSimple);
    setRange(b,"az",scheme);
    b = build(scheme,scheme | notSimple);
    setRange(b,"az",scheme);
    setRange(b,"09",scheme);
    setChars(b,"+-.",scheme);
    return tables;
};
export var _scan : (uri : string,start : number,end : number,state : number,indices : core.DartList<number>) => number = (uri : string,start : number,end : number,state : number,indices : core.DartList<number>) : number =>  {
    let tables = properties._scannerTables;
    /* TODO (AssertStatementImpl) : assert (end <= uri.length); */;
    for(let i : number = start; i < end; i++){
        let table = tables[state];
        let char : number = new core.DartString(uri).codeUnitAt(i) ^ 96;
        if (char > 95) char = 31;
        let transition : number = op(Op.INDEX,table,char);
        state = transition & 31;
        indices[transition >> 5] = i;
    }
    return state;
};
@DartClass
@Implements(Uri)
export class _SimpleUri implements Uri {
    _uri : string;
    _schemeEnd : number;
    _hostStart : number;
    _portStart : number;
    _pathStart : number;
    _queryStart : number;
    _fragmentStart : number;
    _schemeCache : string;
    _hashCodeCache : number;
    constructor(_uri : string,_schemeEnd : number,_hostStart : number,_portStart : number,_pathStart : number,_queryStart : number,_fragmentStart : number,_schemeCache : string) {
    }
    @defaultConstructor
    _SimpleUri(_uri : string,_schemeEnd : number,_hostStart : number,_portStart : number,_pathStart : number,_queryStart : number,_fragmentStart : number,_schemeCache : string) {
        this._uri = _uri;
        this._schemeEnd = _schemeEnd;
        this._hostStart = _hostStart;
        this._portStart = _portStart;
        this._pathStart = _pathStart;
        this._queryStart = _queryStart;
        this._fragmentStart = _fragmentStart;
        this._schemeCache = _schemeCache;
    }
    get hasScheme() : boolean {
        return this._schemeEnd > 0;
    }
    get hasAuthority() : boolean {
        return this._hostStart > 0;
    }
    get hasUserInfo() : boolean {
        return this._hostStart > this._schemeEnd + 4;
    }
    get hasPort() : boolean {
        return this._hostStart > 0 && this._portStart + 1 < this._pathStart;
    }
    get hasQuery() : boolean {
        return this._queryStart < this._fragmentStart;
    }
    get hasFragment() : boolean {
        return this._fragmentStart < this._uri.length;
    }
    get _isFile() : boolean {
        return this._schemeEnd == 4 && this._uri.startsWith("file");
    }
    get _isHttp() : boolean {
        return this._schemeEnd == 4 && this._uri.startsWith("http");
    }
    get _isHttps() : boolean {
        return this._schemeEnd == 5 && this._uri.startsWith("https");
    }
    get _isPackage() : boolean {
        return this._schemeEnd == 7 && this._uri.startsWith("package");
    }
    _isScheme(scheme : string) : boolean {
        return this._schemeEnd == scheme.length && this._uri.startsWith(scheme);
    }
    get hasAbsolutePath() : boolean {
        return this._uri.startsWith("/",this._pathStart);
    }
    get hasEmptyPath() : boolean {
        return this._pathStart == this._queryStart;
    }
    get isAbsolute() : boolean {
        return this.hasScheme && !this.hasFragment;
    }
    isScheme(scheme : string) : boolean {
        if (scheme == null || new core.DartString(scheme).isEmpty) return this._schemeEnd < 0;
        if (scheme.length != this._schemeEnd) return false;
        return _Uri._compareScheme(scheme,this._uri);
    }
    get scheme() : string {
        if (this._schemeEnd <= 0) return "";
        if (this._schemeCache != null) return this._schemeCache;
        if (this._isHttp) {
            this._schemeCache = "http";
        }else if (this._isHttps) {
            this._schemeCache = "https";
        }else if (this._isFile) {
            this._schemeCache = "file";
        }else if (this._isPackage) {
            this._schemeCache = "package";
        }else {
            this._schemeCache = this._uri.substring(0,this._schemeEnd);
        }
        return this._schemeCache;
    }
    get authority() : string {
        return this._hostStart > 0 ? this._uri.substring(this._schemeEnd + 3,this._pathStart) : "";
    }
    get userInfo() : string {
        return (this._hostStart > this._schemeEnd + 3) ? this._uri.substring(this._schemeEnd + 3,this._hostStart - 1) : "";
    }
    get host() : string {
        return this._hostStart > 0 ? this._uri.substring(this._hostStart,this._portStart) : "";
    }
    get port() : number {
        if (this.hasPort) return core.DartNumber.parse(this._uri.substring(this._portStart + 1,this._pathStart));
        if (this._isHttp) return 80;
        if (this._isHttps) return 443;
        return 0;
    }
    get path() : string {
        return this._uri.substring(this._pathStart,this._queryStart);
    }
    get query() : string {
        return (this._queryStart < this._fragmentStart) ? this._uri.substring(this._queryStart + 1,this._fragmentStart) : "";
    }
    get fragment() : string {
        return (this._fragmentStart < this._uri.length) ? this._uri.substring(this._fragmentStart + 1) : "";
    }
    get origin() : string {
        let isHttp : boolean = this._isHttp;
        if (this._schemeEnd < 0) {
            throw new core.StateError(`Cannot use origin without a scheme: ${this}`);
        }
        if (!isHttp && !this._isHttps) {
            throw new core.StateError(`Origin is only applicable to schemes http and https: ${this}`);
        }
        if (this._hostStart == this._portStart) {
            throw new core.StateError(`A ${this.scheme}: URI should have a non-empty host name: ${this}`);
        }
        if (this._hostStart == this._schemeEnd + 3) {
            return this._uri.substring(0,this._pathStart);
        }
        return this._uri.substring(0,this._schemeEnd + 3) + this._uri.substring(this._hostStart,this._pathStart);
    }
    get pathSegments() : core.DartList<string> {
        let start : number = this._pathStart;
        let end : number = this._queryStart;
        if (this._uri.startsWith("/",start)) start++;
        if (start == end) return new core.DartList.literal<string>();
        let parts : core.DartList<string> = new core.DartList.literal();
        for(let i : number = start; i < end; i++){
            let char = new core.DartString(this._uri).codeUnitAt(i);
            if (char == properties._SLASH) {
                parts.add(this._uri.substring(start,i));
                start = i + 1;
            }
        }
        parts.add(this._uri.substring(start,end));
        return new core.DartList.unmodifiable(parts);
    }
    get queryParameters() : core.DartMap<string,string> {
        if (!this.hasQuery) return new core.DartMap.literal([]);
        return new core.DartUnmodifiableMapView<string,string>(Uri.splitQueryString(this.query));
    }
    get queryParametersAll() : core.DartMap<string,core.DartList<string>> {
        if (!this.hasQuery) return new core.DartMap.literal([]);
        let queryParameterLists : core.DartMap<any,any> = _Uri._splitQueryStringAll(this.query);
        for(let key of queryParameterLists.keys) {
            queryParameterLists.set(key,new core.DartList.unmodifiable(queryParameterLists.get(key)));
        }
        return new core.DartMap.unmodifiable(queryParameterLists);
    }
    _isPort(port : string) : boolean {
        let portDigitStart : number = this._portStart + 1;
        return portDigitStart + port.length == this._pathStart && this._uri.startsWith(port,portDigitStart);
    }
    normalizePath() : Uri {
        return this;
    }
    removeFragment() : Uri {
        if (!this.hasFragment) return this;
        return new _SimpleUri(this._uri.substring(0,this._fragmentStart),this._schemeEnd,this._hostStart,this._portStart,this._pathStart,this._queryStart,this._fragmentStart,this._schemeCache);
    }
    replace(_namedArguments? : {scheme? : string,userInfo? : string,host? : string,port? : number,path? : string,pathSegments? : core.DartIterable<string>,query? : string,queryParameters? : core.DartMap<string,any>,fragment? : string}) : Uri {
        let {scheme,userInfo,host,port,path,pathSegments,query,queryParameters,fragment} = Object.assign({
        }, _namedArguments );
        let schemeChanged : boolean = false;
        if (scheme != null) {
            scheme = _Uri._makeScheme(scheme,0,scheme.length);
            schemeChanged = !this._isScheme(scheme);
        }else {
            scheme = this.scheme;
        }
        let isFile : boolean = (scheme == "file");
        if (userInfo != null) {
            userInfo = _Uri._makeUserInfo(userInfo,0,userInfo.length);
        }else if (this._hostStart > 0) {
            userInfo = this._uri.substring(this._schemeEnd + 3,this._hostStart);
        }else {
            userInfo = "";
        }
        if (port != null) {
            port = _Uri._makePort(port,scheme);
        }else {
            port = this.hasPort ? this.port : null;
            if (schemeChanged) {
                port = _Uri._makePort(port,scheme);
            }
        }
        if (host != null) {
            host = _Uri._makeHost(host,0,host.length,false);
        }else if (this._hostStart > 0) {
            host = this._uri.substring(this._hostStart,this._portStart);
        }else if (new core.DartString(userInfo).isNotEmpty || port != null || isFile) {
            host = "";
        }
        let hasAuthority : boolean = host != null;
        if (path != null || pathSegments != null) {
            path = _Uri._makePath(path,0,_stringOrNullLength(path),pathSegments,scheme,hasAuthority);
        }else {
            path = this._uri.substring(this._pathStart,this._queryStart);
            if ((isFile || (hasAuthority && !new core.DartString(path).isEmpty)) && !path.startsWith('/')) {
                path = "/" + path;
            }
        }
        if (query != null || queryParameters != null) {
            query = _Uri._makeQuery(query,0,_stringOrNullLength(query),queryParameters);
        }else if (this._queryStart < this._fragmentStart) {
            query = this._uri.substring(this._queryStart + 1,this._fragmentStart);
        }
        if (fragment != null) {
            fragment = _Uri._makeFragment(fragment,0,fragment.length);
        }else if (this._fragmentStart < this._uri.length) {
            fragment = this._uri.substring(this._fragmentStart + 1);
        }
        return new _Uri._internal(scheme,userInfo,host,port,path,query,fragment);
    }
    resolve(reference : string) : Uri {
        return this.resolveUri(Uri.parse(reference));
    }
    resolveUri(reference : Uri) : Uri {
        if (is(reference, _SimpleUri)) {
            return this._simpleMerge(this,reference);
        }
        return this._toNonSimple().resolveUri(reference);
    }
    _simpleMerge(base : _SimpleUri,ref : _SimpleUri) : Uri {
        if (ref.hasScheme) return ref;
        if (ref.hasAuthority) {
            if (!base.hasScheme) return ref;
            let isSimple : boolean = true;
            if (base._isFile) {
                isSimple = !ref.hasEmptyPath;
            }else if (base._isHttp) {
                isSimple = !ref._isPort("80");
            }else if (base._isHttps) {
                isSimple = !ref._isPort("443");
            }
            if (isSimple) {
                let delta = base._schemeEnd + 1;
                let newUri = base._uri.substring(0,base._schemeEnd + 1) + ref._uri.substring(ref._schemeEnd + 1);
                return new _SimpleUri(newUri,base._schemeEnd,ref._hostStart + delta,ref._portStart + delta,ref._pathStart + delta,ref._queryStart + delta,ref._fragmentStart + delta,base._schemeCache);
            }else {
                return this._toNonSimple().resolveUri(ref);
            }
        }
        if (ref.hasEmptyPath) {
            if (ref.hasQuery) {
                let delta : number = base._queryStart - ref._queryStart;
                let newUri = base._uri.substring(0,base._queryStart) + ref._uri.substring(ref._queryStart);
                return new _SimpleUri(newUri,base._schemeEnd,base._hostStart,base._portStart,base._pathStart,ref._queryStart + delta,ref._fragmentStart + delta,base._schemeCache);
            }
            if (ref.hasFragment) {
                let delta : number = base._fragmentStart - ref._fragmentStart;
                let newUri = base._uri.substring(0,base._fragmentStart) + ref._uri.substring(ref._fragmentStart);
                return new _SimpleUri(newUri,base._schemeEnd,base._hostStart,base._portStart,base._pathStart,base._queryStart,ref._fragmentStart + delta,base._schemeCache);
            }
            return base.removeFragment();
        }
        if (ref.hasAbsolutePath) {
            let delta = base._pathStart - ref._pathStart;
            let newUri = base._uri.substring(0,base._pathStart) + ref._uri.substring(ref._pathStart);
            return new _SimpleUri(newUri,base._schemeEnd,base._hostStart,base._portStart,base._pathStart,ref._queryStart + delta,ref._fragmentStart + delta,base._schemeCache);
        }
        if (base.hasEmptyPath && base.hasAuthority) {
            let refStart : number = ref._pathStart;
            while (ref._uri.startsWith("../",refStart)){
                refStart = 3;
            }
            let delta = base._pathStart - refStart + 1;
            let newUri = `${base._uri.substring(0,base._pathStart)}/` + `${ref._uri.substring(refStart)}`;
            return new _SimpleUri(newUri,base._schemeEnd,base._hostStart,base._portStart,base._pathStart,ref._queryStart + delta,ref._fragmentStart + delta,base._schemeCache);
        }
        let baseUri : string = base._uri;
        let refUri : string = ref._uri;
        let baseStart : number = base._pathStart;
        let baseEnd : number = base._queryStart;
        while (baseUri.startsWith("../",baseStart))baseStart = 3;
        let refStart : number = ref._pathStart;
        let refEnd : number = ref._queryStart;
        let backCount : number = 0;
        while (refStart + 3 <= refEnd && refUri.startsWith("../",refStart)){
            refStart = 3;
            backCount = 1;
        }
        let insert : string = "";
        while (baseEnd > baseStart){
            baseEnd--;
            let char : number = new core.DartString(baseUri).codeUnitAt(baseEnd);
            if (char == properties._SLASH) {
                insert = "/";
                if (backCount == 0) break;
                backCount--;
            }
        }
        if (baseEnd == baseStart && !base.hasScheme && !base.hasAbsolutePath) {
            insert = "";
            refStart = backCount * 3;
        }
        let delta = baseEnd - refStart + insert.length;
        let newUri = `${base._uri.substring(0,baseEnd)}${insert}` + `${ref._uri.substring(refStart)}`;
        return new _SimpleUri(newUri,base._schemeEnd,base._hostStart,base._portStart,base._pathStart,ref._queryStart + delta,ref._fragmentStart + delta,base._schemeCache);
    }
    toFilePath(_namedArguments? : {windows? : boolean}) : string {
        let {windows} = Object.assign({
        }, _namedArguments );
        if (this._schemeEnd >= 0 && !this._isFile) {
            throw new core.UnsupportedError(`Cannot extract a file path from a ${this.scheme} URI`);
        }
        if (this._queryStart < this._uri.length) {
            if (this._queryStart < this._fragmentStart) {
                throw new core.UnsupportedError("Cannot extract a file path from a URI with a query component");
            }
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a fragment component");
        }
        if (windows == null) windows = _Uri._isWindows;
        return windows ? _Uri._toWindowsFilePath(this) : this._toFilePath();
    }
    _toFilePath() : string {
        if (this._hostStart < this._portStart) {
            throw new core.UnsupportedError("Cannot extract a non-Windows file path from a file URI " + "with an authority");
        }
        return this.path;
    }
    get data() : UriData {
        /* TODO (AssertStatementImpl) : assert (scheme != "data"); */;
        return null;
    }
    get hashCode() : number {
        return this._hashCodeCache = new core.DartString(this._uri).hashCode;
    }
    [OperatorMethods.EQUALS](other : core.DartObject) : boolean {
        if (core.identical(this,other)) return true;
        if (is(other, Uri)) return this._uri == other.toString();
        return false;
    }
    _toNonSimple() : Uri {
        return new _Uri._internal(this.scheme,this.userInfo,this.hasAuthority ? this.host : null,this.hasPort ? this.port : null,this.path,this.hasQuery ? this.query : null,this.hasFragment ? this.fragment : null);
    }
    toString() : string {
        return this._uri;
    }
}

@DartClass
export class _DataUri extends _Uri {
    _data : UriData;
    constructor(_data : UriData,path : string,query : string) {
        // @ts-ignore
        super();
    }
    @defaultConstructor
    _DataUri(_data : UriData,path : string,query : string) {
        super._internal("data",null,null,null,path,query,null);
        this._data = _data;
    }
    get data() : UriData {
        return this._data;
    }
}

export var _startsWithData : (text : string,start : number) => number = (text : string,start : number) : number =>  {
    let delta : number = (new core.DartString(text).codeUnitAt(start + 4) ^ properties._COLON) * 3;
    delta = new core.DartString(text).codeUnitAt(start) ^ 100;
    delta = new core.DartString(text).codeUnitAt(start + 1) ^ 97;
    delta = new core.DartString(text).codeUnitAt(start + 2) ^ 116;
    delta = new core.DartString(text).codeUnitAt(start + 3) ^ 97;
    return delta;
};
export var _stringOrNullLength : (s : string) => number = (s : string) : number =>  {
    return (s == null) ? 0 : s.length;
};
export class properties {
    static _SPACE : number = 32;
    static _PERCENT : number = 37;
    static _AMPERSAND : number = 38;
    static _PLUS : number = 43;
    static _DOT : number = 46;
    static _SLASH : number = 47;
    static _COLON : number = 58;
    static _EQUALS : number = 61;
    static _UPPER_CASE_A : number = 65;
    static _UPPER_CASE_Z : number = 90;
    static _LEFT_BRACKET : number = 91;
    static _BACKSLASH : number = 92;
    static _RIGHT_BRACKET : number = 93;
    static _LOWER_CASE_A : number = 97;
    static _LOWER_CASE_F : number = 102;
    static _LOWER_CASE_Z : number = 122;
    static _hexDigits : string = "0123456789ABCDEF";
    static _schemeEndIndex : number = 1;
    static _hostStartIndex : number = 2;
    static _portStartIndex : number = 3;
    static _pathStartIndex : number = 4;
    static _queryStartIndex : number = 5;
    static _fragmentStartIndex : number = 6;
    static _notSimpleIndex : number = 7;
    static _uriStart : number = 0;
    static _nonSimpleEndStates : number = 14;
    static _schemeStart : number = 20;
    static _scannerTables : core.DartList<any> = _createTables();
}
//export const properties : properties = new properties();
