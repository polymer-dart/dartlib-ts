var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Uri_1, _Uri_1, UriData_1, _SimpleUri_1;
/** Library asset:sample_project/lib/core/uri.dart */
import { is } from "./_common";
import { defaultConstructor, namedConstructor, namedFactory, defaultFactory, DartClass, Implements, op, Op, OperatorMethods, Abstract, AbstractProperty } from "./utils";
import * as core from "./core";
import * as typed_data from "./typed_data";
import * as convert from "./convert";
import * as _internal from './_internal';
let Uri = Uri_1 = class Uri {
    constructor(_namedArguments) {
    }
    static get base() {
        throw 'external';
    }
    static _Uri(_namedArguments) {
        let { scheme, userInfo, host, port, path, pathSegments, query, queryParameters, fragment } = Object.assign({}, _namedArguments);
        return new _Uri({
            scheme: scheme, userInfo: userInfo, host: host, port: port, path: path, pathSegments: pathSegments, query: query, queryParameters: queryParameters, fragment: fragment
        });
    }
    static _http(authority, unencodedPath, queryParameters) {
        return new _Uri.http(authority, unencodedPath, queryParameters);
    }
    static _https(authority, unencodedPath, queryParameters) {
        return new _Uri.https(authority, unencodedPath, queryParameters);
    }
    static _file(path, _namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        return new _Uri.file(path, {
            windows: windows
        });
    }
    static _directory(path, _namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        return new _Uri.directory(path, {
            windows: windows
        });
    }
    static _dataFromString(content, _namedArguments) {
        let { mimeType, encoding, parameters, base64 } = Object.assign({
            "base64": false
        }, _namedArguments);
        let data = new UriData.fromString(content, {
            mimeType: mimeType, encoding: encoding, parameters: parameters, base64: base64
        });
        return data.uri;
    }
    static _dataFromBytes(bytes, _namedArguments) {
        let { mimeType, parameters, percentEncoded } = Object.assign({
            "mimeType": "application/octet-stream",
            "percentEncoded": false
        }, _namedArguments);
        let data = new UriData.fromBytes(bytes, {
            mimeType: mimeType, parameters: parameters, percentEncoded: percentEncoded
        });
        return data.uri;
    }
    get scheme() {
        throw 'abstract';
    }
    get authority() {
        throw 'abstract';
    }
    get userInfo() {
        throw 'abstract';
    }
    get host() {
        throw 'abstract';
    }
    get port() {
        throw 'abstract';
    }
    get path() {
        throw 'abstract';
    }
    get query() {
        throw 'abstract';
    }
    get fragment() {
        throw 'abstract';
    }
    get pathSegments() {
        throw 'abstract';
    }
    get queryParameters() {
        throw 'abstract';
    }
    get queryParametersAll() {
        throw 'abstract';
    }
    get isAbsolute() {
        throw 'abstract';
    }
    get hasScheme() {
        return new core.DartString(this.scheme).isNotEmpty;
    }
    get hasAuthority() {
        throw 'abstract';
    }
    get hasPort() {
        throw 'abstract';
    }
    get hasQuery() {
        throw 'abstract';
    }
    get hasFragment() {
        throw 'abstract';
    }
    get hasEmptyPath() {
        throw 'abstract';
    }
    get hasAbsolutePath() {
        throw 'abstract';
    }
    get origin() {
        throw 'abstract';
    }
    isScheme(scheme) {
        throw 'abstract';
    }
    toFilePath(_namedArguments) {
        throw 'abstract';
    }
    get data() {
        throw 'abstract';
    }
    get hashCode() {
        throw 'abstract';
    }
    //@Abstract
    [OperatorMethods.EQUALS](other) {
        throw 'abstract';
    }
    toString() {
        throw 'abstract';
    }
    replace(_namedArguments) {
        throw 'abstract';
    }
    removeFragment() {
        throw 'abstract';
    }
    resolve(reference) {
        throw 'abstract';
    }
    resolveUri(reference) {
        throw 'abstract';
    }
    normalizePath() {
        throw 'abstract';
    }
    static parse(uri, start, end) {
        start = start || 0;
        end = end || new core.DartString(uri).length;
        if (end >= start + 5) {
            let dataDelta = _startsWithData(uri, start);
            if (dataDelta == 0) {
                if (start > 0 || end < new core.DartString(uri).length)
                    uri = new core.DartString(uri).substring(start, end);
                return UriData._parse(uri, 5, null).uri;
            }
            else if (dataDelta == 32) {
                return UriData._parse(new core.DartString(uri).substring(start + 5, end), 0, null).uri;
            }
        }
        let indices = new core.DartList(8);
        ((_) => {
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
        let state = _scan(uri, start, end, properties._uriStart, indices);
        if (state >= properties._nonSimpleEndStates) {
            indices[properties._notSimpleIndex] = end;
        }
        let schemeEnd = indices[properties._schemeEndIndex];
        if (schemeEnd >= start) {
            state = _scan(uri, start, schemeEnd, properties._schemeStart, indices);
            if (state == properties._schemeStart) {
                indices[properties._notSimpleIndex] = schemeEnd;
            }
        }
        let hostStart = indices[properties._hostStartIndex] + 1;
        let portStart = indices[properties._portStartIndex];
        let pathStart = indices[properties._pathStartIndex];
        let queryStart = indices[properties._queryStartIndex];
        let fragmentStart = indices[properties._fragmentStartIndex];
        let scheme;
        if (fragmentStart < queryStart)
            queryStart = fragmentStart;
        if (pathStart < hostStart || pathStart <= schemeEnd) {
            pathStart = queryStart;
        }
        if (portStart < hostStart)
            portStart = pathStart;
        /* TODO (AssertStatementImpl) : assert (hostStart == start || schemeEnd <= hostStart); */
        ;
        /* TODO (AssertStatementImpl) : assert (hostStart <= portStart); */
        ;
        /* TODO (AssertStatementImpl) : assert (schemeEnd <= pathStart); */
        ;
        /* TODO (AssertStatementImpl) : assert (portStart <= pathStart); */
        ;
        /* TODO (AssertStatementImpl) : assert (pathStart <= queryStart); */
        ;
        /* TODO (AssertStatementImpl) : assert (queryStart <= fragmentStart); */
        ;
        let isSimple = indices[properties._notSimpleIndex] < start;
        if (isSimple) {
            if (hostStart > schemeEnd + 3) {
                isSimple = false;
            }
            else if (portStart > start && portStart + 1 == pathStart) {
                isSimple = false;
            }
            else if (queryStart < end && (queryStart == pathStart + 2 && new core.DartString(uri).startsWith(new core.DartString(".."), pathStart)) || (queryStart > pathStart + 2 && new core.DartString(uri).startsWith(new core.DartString("/.."), queryStart - 3))) {
                isSimple = false;
            }
            else {
                if (schemeEnd == start + 4) {
                    if (new core.DartString(uri).startsWith(new core.DartString("file"), start)) {
                        scheme = "file";
                        if (hostStart <= start) {
                            let schemeAuth = "file://";
                            let delta = 2;
                            if (!new core.DartString(uri).startsWith(new core.DartString("/"), pathStart)) {
                                schemeAuth = "file:///";
                                delta = 3;
                            }
                            uri = schemeAuth + new core.DartString(uri).substring(pathStart, end);
                            schemeEnd -= start;
                            hostStart = 7;
                            portStart = 7;
                            pathStart = 7;
                            queryStart += delta - start;
                            fragmentStart += delta - start;
                            start = 0;
                            end = new core.DartString(uri).length;
                        }
                        else if (pathStart == queryStart) {
                            if (start == 0 && end == new core.DartString(uri).length) {
                                uri = new core.DartString(uri).replaceRange(pathStart, queryStart, "/");
                                queryStart += 1;
                                fragmentStart += 1;
                                end += 1;
                            }
                            else {
                                uri = `${new core.DartString(uri).substring(start, pathStart)}/` + `${new core.DartString(uri).substring(queryStart, end)}`;
                                schemeEnd -= start;
                                hostStart -= start;
                                portStart -= start;
                                pathStart -= start;
                                queryStart += 1 - start;
                                fragmentStart += 1 - start;
                                start = 0;
                                end = new core.DartString(uri).length;
                            }
                        }
                    }
                    else if (new core.DartString(uri).startsWith(new core.DartString("http"), start)) {
                        scheme = "http";
                        if (portStart > start && portStart + 3 == pathStart && new core.DartString(uri).startsWith(new core.DartString("80"), portStart + 1)) {
                            if (start == 0 && end == new core.DartString(uri).length) {
                                uri = new core.DartString(uri).replaceRange(portStart, pathStart, "");
                                pathStart -= 3;
                                queryStart -= 3;
                                fragmentStart -= 3;
                                end -= 3;
                            }
                            else {
                                uri = new core.DartString(uri).substring(start, portStart) + new core.DartString(uri).substring(pathStart, end);
                                schemeEnd -= start;
                                hostStart -= start;
                                portStart -= start;
                                pathStart -= 3 + start;
                                queryStart -= 3 + start;
                                fragmentStart -= 3 + start;
                                start = 0;
                                end = new core.DartString(uri).length;
                            }
                        }
                    }
                }
                else if (schemeEnd == start + 5 && new core.DartString(uri).startsWith(new core.DartString("https"), start)) {
                    scheme = "https";
                    if (portStart > start && portStart + 4 == pathStart && new core.DartString(uri).startsWith(new core.DartString("443"), portStart + 1)) {
                        if (start == 0 && end == new core.DartString(uri).length) {
                            uri = new core.DartString(uri).replaceRange(portStart, pathStart, "");
                            pathStart -= 4;
                            queryStart -= 4;
                            fragmentStart -= 4;
                            end -= 3;
                        }
                        else {
                            uri = new core.DartString(uri).substring(start, portStart) + new core.DartString(uri).substring(pathStart, end);
                            schemeEnd -= start;
                            hostStart -= start;
                            portStart -= start;
                            pathStart -= 4 + start;
                            queryStart -= 4 + start;
                            fragmentStart -= 4 + start;
                            start = 0;
                            end = new core.DartString(uri).length;
                        }
                    }
                }
            }
        }
        if (isSimple) {
            if (start > 0 || end < new core.DartString(uri).length) {
                uri = new core.DartString(uri).substring(start, end);
                schemeEnd -= start;
                hostStart -= start;
                portStart -= start;
                pathStart -= start;
                queryStart -= start;
                fragmentStart -= start;
            }
            return new _SimpleUri(uri, schemeEnd, hostStart, portStart, pathStart, queryStart, fragmentStart, scheme);
        }
        return new _Uri.notSimple(uri, start, end, schemeEnd, hostStart, portStart, pathStart, queryStart, fragmentStart, scheme);
    }
    static encodeComponent(component) {
        return _Uri._uriEncode(_Uri._unreserved2396Table, component, convert.properties.UTF8, false);
    }
    static encodeQueryComponent(component, _namedArguments) {
        let { encoding } = Object.assign({
            "encoding": convert.properties.UTF8
        }, _namedArguments);
        return _Uri._uriEncode(_Uri._unreservedTable, component, encoding, true);
    }
    static decodeComponent(encodedComponent) {
        return _Uri._uriDecode(encodedComponent, 0, encodedComponent.length, convert.properties.UTF8, false);
    }
    static decodeQueryComponent(encodedComponent, _namedArguments) {
        let { encoding } = Object.assign({
            "encoding": convert.properties.UTF8
        }, _namedArguments);
        return _Uri._uriDecode(encodedComponent, 0, encodedComponent.length, encoding, true);
    }
    static encodeFull(uri) {
        return _Uri._uriEncode(_Uri._encodeFullTable, uri, convert.properties.UTF8, false);
    }
    static decodeFull(uri) {
        return _Uri._uriDecode(uri, 0, uri.length, convert.properties.UTF8, false);
    }
    static splitQueryString(query, _namedArguments) {
        let { encoding } = Object.assign({
            "encoding": convert.properties.UTF8
        }, _namedArguments);
        return query.split("&").fold(new core.DartMap.literal([]), (map, element) => {
            let index = element.indexOf("=");
            if (index == -1) {
                if (element != "") {
                    op(Op.INDEX_ASSIGN, map, Uri_1.decodeQueryComponent(element, {
                        encoding: encoding
                    }), "");
                }
            }
            else if (index != 0) {
                let key = element.substring(0, index);
                let value = element.substring(index + 1);
                op(Op.INDEX_ASSIGN, map, Uri_1.decodeQueryComponent(key, {
                    encoding: encoding
                }), Uri_1.decodeQueryComponent(value, {
                    encoding: encoding
                }));
            }
            return map;
        });
    }
    static parseIPv4Address(host) {
        return Uri_1._parseIPv4Address(host, 0, host.length);
    }
    static _parseIPv4Address(host, start, end) {
        var error = (msg, position) => {
            throw new core.FormatException(`Illegal IPv4 address, ${msg}`, host, position);
        };
        let result = new typed_data.Uint8List(4);
        let partIndex = 0;
        let partStart = start;
        for (let i = start; i < end; i++) {
            let char = new core.DartString(host).codeUnitAt(i);
            if (char != properties._DOT) {
                if ((char ^ 48) > 9) {
                    error("invalid character", i);
                }
            }
            else {
                if (partIndex == 3) {
                    error('IPv4 address should contain exactly 4 parts', i);
                }
                let part = core.DartNumber.parse(host.substring(partStart, i));
                if (part > 255) {
                    error("each part must be in the range 0..255", partStart);
                }
                op(Op.INDEX_ASSIGN, result, partIndex++, part);
                partStart = i + 1;
            }
        }
        if (partIndex != 3) {
            error('IPv4 address should contain exactly 4 parts', end);
        }
        let part = core.DartNumber.parse(host.substring(partStart, end));
        if (part > 255) {
            error("each part must be in the range 0..255", partStart);
        }
        op(Op.INDEX_ASSIGN, result, partIndex, part);
        return result;
    }
    static parseIPv6Address(host, start, end) {
        start = start || 0;
        if (end == null)
            end = host.length;
        var error = (msg, position) => {
            throw new core.FormatException(`Illegal IPv6 address, ${msg}`, host, position);
        };
        var parseHex = (start, end) => {
            if (end - start > 4) {
                error('an IPv6 part can only contain a maximum of 4 hex digits', start);
            }
            let value = core.DartInt.parse(host.substring(start, end), {
                radix: 16
            });
            if (value < 0 || value > 65535) {
                error('each part must be in the range of `0x0..0xFFFF`', start);
            }
            return value;
        };
        if (host.length < 2)
            error('address is too short');
        let parts = new core.DartList.literal();
        let wildcardSeen = false;
        let seenDot = false;
        let partStart = start;
        for (let i = start; i < end; i++) {
            let char = new core.DartString(host).codeUnitAt(i);
            if (char == properties._COLON) {
                if (i == start) {
                    i++;
                    if (new core.DartString(host).codeUnitAt(i) != properties._COLON) {
                        error('invalid start colon.', i);
                    }
                    partStart = i;
                }
                if (i == partStart) {
                    if (wildcardSeen) {
                        error('only one wildcard `::` is allowed', i);
                    }
                    wildcardSeen = true;
                    parts.add(-1);
                }
                else {
                    parts.add(parseHex(partStart, i));
                }
                partStart = i + 1;
            }
            else if (char == properties._DOT) {
                seenDot = true;
            }
        }
        if (parts.length == 0)
            error('too few parts');
        let atEnd = (partStart == end);
        let isLastWildcard = (parts.last == -1);
        if (atEnd && !isLastWildcard) {
            error('expected a part after last `:`', end);
        }
        if (!atEnd) {
            if (!seenDot) {
                parts.add(parseHex(partStart, end));
            }
            else {
                let last = Uri_1._parseIPv4Address(host, partStart, end);
                parts.add(last[0] << 8 | last[1]);
                parts.add(last[2] << 8 | last[3]);
            }
        }
        if (wildcardSeen) {
            if (parts.length > 7) {
                error('an address with a wildcard must have less than 7 parts');
            }
        }
        else if (parts.length != 8) {
            error('an address without a wildcard must contain exactly 8 parts');
        }
        let bytes = new typed_data.Uint8List(16);
        for (let i = 0, index = 0; i < parts.length; i++) {
            let value = parts[i];
            if (value == -1) {
                let wildCardLength = 9 - parts.length;
                for (let j = 0; j < wildCardLength; j++) {
                    bytes[index] = 0;
                    bytes[index + 1] = 0;
                    index += 2;
                }
            }
            else {
                bytes[index] = value >> 8;
                bytes[index + 1] = value & 255;
                index += 2;
            }
        }
        return bytes;
    }
};
__decorate([
    AbstractProperty
], Uri.prototype, "scheme", null);
__decorate([
    AbstractProperty
], Uri.prototype, "authority", null);
__decorate([
    AbstractProperty
], Uri.prototype, "userInfo", null);
__decorate([
    AbstractProperty
], Uri.prototype, "host", null);
__decorate([
    AbstractProperty
], Uri.prototype, "port", null);
__decorate([
    AbstractProperty
], Uri.prototype, "path", null);
__decorate([
    AbstractProperty
], Uri.prototype, "query", null);
__decorate([
    AbstractProperty
], Uri.prototype, "fragment", null);
__decorate([
    AbstractProperty
], Uri.prototype, "pathSegments", null);
__decorate([
    AbstractProperty
], Uri.prototype, "queryParameters", null);
__decorate([
    AbstractProperty
], Uri.prototype, "queryParametersAll", null);
__decorate([
    AbstractProperty
], Uri.prototype, "isAbsolute", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasAuthority", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasPort", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasQuery", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasFragment", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasEmptyPath", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hasAbsolutePath", null);
__decorate([
    AbstractProperty
], Uri.prototype, "origin", null);
__decorate([
    Abstract
], Uri.prototype, "isScheme", null);
__decorate([
    Abstract
], Uri.prototype, "toFilePath", null);
__decorate([
    AbstractProperty
], Uri.prototype, "data", null);
__decorate([
    AbstractProperty
], Uri.prototype, "hashCode", null);
__decorate([
    Abstract
], Uri.prototype, "toString", null);
__decorate([
    Abstract
], Uri.prototype, "replace", null);
__decorate([
    Abstract
], Uri.prototype, "removeFragment", null);
__decorate([
    Abstract
], Uri.prototype, "resolve", null);
__decorate([
    Abstract
], Uri.prototype, "resolveUri", null);
__decorate([
    Abstract
], Uri.prototype, "normalizePath", null);
__decorate([
    defaultFactory
], Uri, "_Uri", null);
__decorate([
    namedFactory
], Uri, "_http", null);
__decorate([
    namedFactory
], Uri, "_https", null);
__decorate([
    namedFactory
], Uri, "_file", null);
__decorate([
    namedFactory
], Uri, "_directory", null);
__decorate([
    namedFactory
], Uri, "_dataFromString", null);
__decorate([
    namedFactory
], Uri, "_dataFromBytes", null);
Uri = Uri_1 = __decorate([
    DartClass
], Uri);
export { Uri };
let _Uri = _Uri_1 = class _Uri extends Uri {
    constructor(_namedArguments) {
        super();
    }
    _internal(scheme, _userInfo, _host, _port, path, _query, _fragment) {
        this.scheme = scheme;
        this._userInfo = _userInfo;
        this._host = _host;
        this._port = _port;
        this.path = path;
        this._query = _query;
        this._fragment = _fragment;
    }
    static _notSimple(uri, start, end, schemeEnd, hostStart, portStart, pathStart, queryStart, fragmentStart, scheme) {
        if (scheme == null) {
            scheme = "";
            if (schemeEnd > start) {
                scheme = _Uri_1._makeScheme(uri, start, schemeEnd);
            }
            else if (schemeEnd == start) {
                _Uri_1._fail(uri, start, "Invalid empty scheme");
            }
        }
        let userInfo = "";
        let host;
        let port;
        if (hostStart > start) {
            let userInfoStart = schemeEnd + 3;
            if (userInfoStart < hostStart) {
                userInfo = _Uri_1._makeUserInfo(uri, userInfoStart, hostStart - 1);
            }
            host = _Uri_1._makeHost(uri, hostStart, portStart, false);
            if (portStart + 1 < pathStart) {
                port = core.DartInt.parse(uri.substring(portStart + 1, pathStart), {
                    onError: (_) => {
                        throw new core.FormatException("Invalid port", uri, portStart + 1);
                    }
                });
                port = _Uri_1._makePort(port, scheme);
            }
        }
        let path = _Uri_1._makePath(uri, pathStart, queryStart, null, scheme, host != null);
        let query;
        if (queryStart < fragmentStart) {
            query = _Uri_1._makeQuery(uri, queryStart + 1, fragmentStart, null);
        }
        let fragment;
        if (fragmentStart < end) {
            fragment = _Uri_1._makeFragment(uri, fragmentStart + 1, end);
        }
        return new _Uri_1._internal(scheme, userInfo, host, port, path, query, fragment);
    }
    static __Uri(_namedArguments) {
        let { scheme, userInfo, host, port, path, pathSegments, query, queryParameters, fragment } = Object.assign({}, _namedArguments);
        scheme = _Uri_1._makeScheme(scheme, 0, _stringOrNullLength(scheme));
        userInfo = _Uri_1._makeUserInfo(userInfo, 0, _stringOrNullLength(userInfo));
        host = _Uri_1._makeHost(host, 0, _stringOrNullLength(host), false);
        if (query == "")
            query = null;
        query = _Uri_1._makeQuery(query, 0, _stringOrNullLength(query), queryParameters);
        fragment = _Uri_1._makeFragment(fragment, 0, _stringOrNullLength(fragment));
        port = _Uri_1._makePort(port, scheme);
        let isFile = (scheme == "file");
        if (host == null && (new core.DartString(userInfo).isNotEmpty || port != null || isFile)) {
            host = "";
        }
        let hasAuthority = (host != null);
        path = _Uri_1._makePath(path, 0, _stringOrNullLength(path), pathSegments, scheme, hasAuthority);
        if (new core.DartString(scheme).isEmpty && host == null && !path.startsWith('/')) {
            let allowScheme = new core.DartString(scheme).isNotEmpty || host != null;
            path = _Uri_1._normalizeRelativePath(path, allowScheme);
        }
        else {
            path = _Uri_1._removeDotSegments(path);
        }
        if (host == null && path.startsWith("//")) {
            host = "";
        }
        return new _Uri_1._internal(scheme, userInfo, host, port, path, query, fragment);
    }
    static _http(authority, unencodedPath, queryParameters) {
        return _Uri_1._makeHttpUri("http", authority, unencodedPath, queryParameters);
    }
    static _https(authority, unencodedPath, queryParameters) {
        return _Uri_1._makeHttpUri("https", authority, unencodedPath, queryParameters);
    }
    get authority() {
        if (!this.hasAuthority)
            return "";
        let sb = new core.DartStringBuffer();
        this._writeAuthority(sb);
        return sb.toString();
    }
    get userInfo() {
        return this._userInfo;
    }
    get host() {
        if (this._host == null)
            return "";
        if (this._host.startsWith('[')) {
            return this._host.substring(1, this._host.length - 1);
        }
        return this._host;
    }
    get port() {
        if (this._port == null)
            return _Uri_1._defaultPort(this.scheme);
        return this._port;
    }
    static _defaultPort(scheme) {
        if (scheme == "http")
            return 80;
        if (scheme == "https")
            return 443;
        return 0;
    }
    get query() {
        return this._query || "";
    }
    get fragment() {
        return this._fragment || "";
    }
    isScheme(scheme) {
        let thisScheme = this.scheme;
        if (scheme == null)
            return new core.DartString(thisScheme).isEmpty;
        if (scheme.length != thisScheme.length)
            return false;
        return _Uri_1._compareScheme(scheme, thisScheme);
    }
    static _compareScheme(scheme, uri) {
        for (let i = 0; i < scheme.length; i++) {
            let schemeChar = new core.DartString(scheme).codeUnitAt(i);
            let uriChar = new core.DartString(uri).codeUnitAt(i);
            let delta = schemeChar ^ uriChar;
            if (delta != 0) {
                if (delta == 32) {
                    let lowerChar = uriChar | delta;
                    if (97 <= lowerChar && lowerChar <= 122) {
                        continue;
                    }
                }
                return false;
            }
        }
        return true;
    }
    static _fail(uri, index, message) {
        throw new core.FormatException(message, uri, index);
    }
    static _makeHttpUri(scheme, authority, unencodedPath, queryParameters) {
        let userInfo = "";
        let host = null;
        let port = null;
        if (authority != null && new core.DartString(authority).isNotEmpty) {
            let hostStart = 0;
            let hasUserInfo = false;
            for (let i = 0; i < authority.length; i++) {
                let atSign = 64;
                if (new core.DartString(authority).codeUnitAt(i) == atSign) {
                    hasUserInfo = true;
                    userInfo = authority.substring(0, i);
                    hostStart = i + 1;
                    break;
                }
            }
            let hostEnd = hostStart;
            if (hostStart < authority.length && new core.DartString(authority).codeUnitAt(hostStart) == properties._LEFT_BRACKET) {
                for (; hostEnd < authority.length; hostEnd++) {
                    if (new core.DartString(authority).codeUnitAt(hostEnd) == properties._RIGHT_BRACKET)
                        break;
                }
                if (hostEnd == authority.length) {
                    throw new core.FormatException("Invalid IPv6 host entry.", authority, hostStart);
                }
                Uri.parseIPv6Address(authority, hostStart + 1, hostEnd);
                hostEnd++;
                if (hostEnd != authority.length && new core.DartString(authority).codeUnitAt(hostEnd) != properties._COLON) {
                    throw new core.FormatException("Invalid end of authority", authority, hostEnd);
                }
            }
            let hasPort = false;
            for (; hostEnd < authority.length; hostEnd++) {
                if (new core.DartString(authority).codeUnitAt(hostEnd) == properties._COLON) {
                    let portString = authority.substring(hostEnd + 1);
                    if (new core.DartString(portString).isNotEmpty)
                        port = core.DartNumber.parse(portString);
                    break;
                }
            }
            host = authority.substring(hostStart, hostEnd);
        }
        return new Uri({
            scheme: scheme, userInfo: userInfo, host: host, port: port, pathSegments: unencodedPath.split("/"), queryParameters: queryParameters
        });
    }
    static _file(path, _namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        windows = (windows == null) ? _Uri_1._isWindows : windows;
        return windows ? _Uri_1._makeWindowsFileUrl(path, false) : _Uri_1._makeFileUri(path, false);
    }
    static _directory(path, _namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        windows = (windows == null) ? _Uri_1._isWindows : windows;
        return windows ? _Uri_1._makeWindowsFileUrl(path, true) : _Uri_1._makeFileUri(path, true);
    }
    static get _isWindows() {
        return false;
    }
    static _checkNonWindowsPathReservedCharacters(segments, argumentError) {
        segments.forEach((segment) => {
            if (segment.contains("/")) {
                if (argumentError) {
                    throw new core.ArgumentError(`Illegal path character ${segment}`);
                }
                else {
                    throw new core.UnsupportedError(`Illegal path character ${segment}`);
                }
            }
        });
    }
    static _checkWindowsPathReservedCharacters(segments, argumentError, firstSegment) {
        firstSegment = firstSegment || 0;
        for (let segment of segments.skip(firstSegment)) {
            if (new core.DartString(segment).contains(new core.DartRegExp('["*/:<>?\\|]'))) {
                if (argumentError) {
                    throw new core.ArgumentError("Illegal character in path");
                }
                else {
                    throw new core.UnsupportedError("Illegal character in path");
                }
            }
        }
    }
    static _checkWindowsDriveLetter(charCode, argumentError) {
        if ((properties._UPPER_CASE_A <= charCode && charCode <= properties._UPPER_CASE_Z) || (properties._LOWER_CASE_A <= charCode && charCode <= properties._LOWER_CASE_Z)) {
            return;
        }
        if (argumentError) {
            throw new core.ArgumentError("Illegal drive letter " + new core.DartString.fromCharCode(charCode).valueOf());
        }
        else {
            throw new core.UnsupportedError("Illegal drive letter " + new core.DartString.fromCharCode(charCode).valueOf());
        }
    }
    static _makeFileUri(path, slashTerminated) {
        let sep = "/";
        let segments = path.split(sep);
        if (slashTerminated && segments.isNotEmpty && new core.DartString(segments.last).isNotEmpty) {
            segments.add("");
        }
        if (path.startsWith(sep)) {
            return new Uri({
                scheme: "file", pathSegments: segments
            });
        }
        else {
            return new Uri({
                pathSegments: segments
            });
        }
    }
    static _makeWindowsFileUrl(path, slashTerminated) {
        if (path.startsWith("\\\\?\\")) {
            if (path.startsWith("UNC\\\\", 4)) {
                path = new core.DartString(path).replaceRange(0, 7, '\\');
            }
            else {
                path = path.substring(4);
                if (path.length < 3 || new core.DartString(path).codeUnitAt(1) != properties._COLON || new core.DartString(path).codeUnitAt(2) != properties._BACKSLASH) {
                    throw new core.ArgumentError("Windows paths with \\?\ prefix must be absolute");
                }
            }
        }
        else {
            path = new core.DartString(path).replaceAll(new core.DartString("/"), '\\');
        }
        let sep = '\\';
        if (path.length > 1 && new core.DartString(path).codeUnitAt(1) == properties._COLON) {
            _Uri_1._checkWindowsDriveLetter(new core.DartString(path).codeUnitAt(0), true);
            if (path.length == 2 || new core.DartString(path).codeUnitAt(2) != properties._BACKSLASH) {
                throw new core.ArgumentError("Windows paths with drive letter must be absolute");
            }
            let pathSegments = path.split(sep);
            if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                pathSegments.add("");
            }
            _Uri_1._checkWindowsPathReservedCharacters(pathSegments, true, 1);
            return new Uri({
                scheme: "file", pathSegments: pathSegments
            });
        }
        if (path.startsWith(sep)) {
            if (path.startsWith(sep, 1)) {
                let pathStart = path.indexOf('\\', 2);
                let hostPart = (pathStart < 0) ? path.substring(2) : path.substring(2, pathStart);
                let pathPart = (pathStart < 0) ? "" : path.substring(pathStart + 1);
                let pathSegments = pathPart.split(sep);
                _Uri_1._checkWindowsPathReservedCharacters(pathSegments, true);
                if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                    pathSegments.add("");
                }
                return new Uri({
                    scheme: "file", host: hostPart, pathSegments: pathSegments
                });
            }
            else {
                let pathSegments = path.split(sep);
                if (slashTerminated && new core.DartString(pathSegments.last).isNotEmpty) {
                    pathSegments.add("");
                }
                _Uri_1._checkWindowsPathReservedCharacters(pathSegments, true);
                return new Uri({
                    scheme: "file", pathSegments: pathSegments
                });
            }
        }
        else {
            let pathSegments = path.split(sep);
            _Uri_1._checkWindowsPathReservedCharacters(pathSegments, true);
            if (slashTerminated && pathSegments.isNotEmpty && new core.DartString(pathSegments.last).isNotEmpty) {
                pathSegments.add("");
            }
            return new Uri({
                pathSegments: pathSegments
            });
        }
    }
    replace(_namedArguments) {
        let { scheme, userInfo, host, port, path, pathSegments, query, queryParameters, fragment } = Object.assign({}, _namedArguments);
        let schemeChanged = false;
        if (scheme != null) {
            scheme = _Uri_1._makeScheme(scheme, 0, scheme.length);
            schemeChanged = (scheme != this.scheme);
        }
        else {
            scheme = this.scheme;
        }
        let isFile = (scheme == "file");
        if (userInfo != null) {
            userInfo = _Uri_1._makeUserInfo(userInfo, 0, userInfo.length);
        }
        else {
            userInfo = this._userInfo;
        }
        if (port != null) {
            port = _Uri_1._makePort(port, scheme);
        }
        else {
            port = this._port;
            if (schemeChanged) {
                port = _Uri_1._makePort(port, scheme);
            }
        }
        if (host != null) {
            host = _Uri_1._makeHost(host, 0, host.length, false);
        }
        else if (this.hasAuthority) {
            host = this._host;
        }
        else if (new core.DartString(userInfo).isNotEmpty || port != null || isFile) {
            host = "";
        }
        let hasAuthority = host != null;
        if (path != null || pathSegments != null) {
            path = _Uri_1._makePath(path, 0, _stringOrNullLength(path), pathSegments, scheme, hasAuthority);
        }
        else {
            path = this.path;
            if ((isFile || (hasAuthority && !new core.DartString(path).isEmpty)) && !path.startsWith('/')) {
                path = "/" + path;
            }
        }
        if (query != null || queryParameters != null) {
            query = _Uri_1._makeQuery(query, 0, _stringOrNullLength(query), queryParameters);
        }
        else {
            query = this._query;
        }
        if (fragment != null) {
            fragment = _Uri_1._makeFragment(fragment, 0, fragment.length);
        }
        else {
            fragment = this._fragment;
        }
        return new _Uri_1._internal(scheme, userInfo, host, port, path, query, fragment);
    }
    removeFragment() {
        if (!this.hasFragment)
            return this;
        return new _Uri_1._internal(this.scheme, this._userInfo, this._host, this._port, this.path, this._query, null);
    }
    get pathSegments() {
        let result = this._pathSegments;
        if (result != null)
            return result;
        let pathToSplit = this.path;
        if (new core.DartString(pathToSplit).isNotEmpty && new core.DartString(pathToSplit).codeUnitAt(0) == properties._SLASH) {
            pathToSplit = pathToSplit.substring(1);
        }
        result = (pathToSplit == "") ? new core.DartList.literal() : new core.DartList.unmodifiable(pathToSplit.split("/").map(Uri.decodeComponent.bind(Uri)));
        this._pathSegments = result;
        return result;
    }
    get queryParameters() {
        if (this._queryParameters == null) {
            this._queryParameters = new core.DartUnmodifiableMapView(Uri.splitQueryString(this.query));
        }
        return this._queryParameters;
    }
    get queryParametersAll() {
        if (this._queryParameterLists == null) {
            let queryParameterLists = _Uri_1._splitQueryStringAll(this.query);
            for (let key of queryParameterLists.keys) {
                queryParameterLists.set(key, new core.DartList.unmodifiable(queryParameterLists.get(key)));
            }
            this._queryParameterLists = new core.DartMap.unmodifiable(queryParameterLists);
        }
        return this._queryParameterLists;
    }
    normalizePath() {
        let path = _Uri_1._normalizePath(this.path, this.scheme, this.hasAuthority);
        if (core.identical(path, this.path))
            return this;
        return this.replace({
            path: path
        });
    }
    static _makePort(port, scheme) {
        if (port != null && port == _Uri_1._defaultPort(scheme))
            return null;
        return port;
    }
    static _makeHost(host, start, end, strictIPv6) {
        if (host == null)
            return null;
        if (start == end)
            return "";
        if (new core.DartString(host).codeUnitAt(start) == properties._LEFT_BRACKET) {
            if (new core.DartString(host).codeUnitAt(end - 1) != properties._RIGHT_BRACKET) {
                _Uri_1._fail(host, start, 'Missing end `]` to match `[` in host');
            }
            Uri.parseIPv6Address(host, start + 1, end - 1);
            return host.substring(start, end).toLowerCase();
        }
        if (!strictIPv6) {
            for (let i = start; i < end; i++) {
                if (new core.DartString(host).codeUnitAt(i) == properties._COLON) {
                    Uri.parseIPv6Address(host, start, end);
                    return `[${host}]`;
                }
            }
        }
        return _Uri_1._normalizeRegName(host, start, end);
    }
    static _isRegNameChar(char) {
        return char < 127 && (op(Op.BITAND, op(Op.INDEX, _Uri_1._regNameTable, char >> 4), (1 << (char & 15)))) != 0;
    }
    static _normalizeRegName(host, start, end) {
        let buffer;
        let sectionStart = start;
        let index = start;
        let isNormalized = true;
        while (index < end) {
            let char = new core.DartString(host).codeUnitAt(index);
            if (char == properties._PERCENT) {
                let replacement = _Uri_1._normalizeEscape(host, index, true);
                if (replacement == null && isNormalized) {
                    index += 3;
                    continue;
                }
                if (op(Op.EQUALS, buffer, null))
                    buffer = new core.DartStringBuffer();
                let slice = host.substring(sectionStart, index);
                if (!isNormalized)
                    slice = slice.toLowerCase();
                buffer.write(slice);
                let sourceLength = 3;
                if (replacement == null) {
                    replacement = host.substring(index, index + 3);
                }
                else if (replacement == "%") {
                    replacement = "%25";
                    sourceLength = 1;
                }
                buffer.write(replacement);
                index += sourceLength;
                sectionStart = index;
                isNormalized = true;
            }
            else if (_Uri_1._isRegNameChar(char)) {
                if (isNormalized && properties._UPPER_CASE_A <= char && properties._UPPER_CASE_Z >= char) {
                    if (op(Op.EQUALS, buffer, null))
                        buffer = new core.DartStringBuffer();
                    if (sectionStart < index) {
                        buffer.write(host.substring(sectionStart, index));
                        sectionStart = index;
                    }
                    isNormalized = false;
                }
                index++;
            }
            else if (_Uri_1._isGeneralDelimiter(char)) {
                _Uri_1._fail(host, index, "Invalid character");
            }
            else {
                let sourceLength = 1;
                if ((char & 64512) == 55296 && (index + 1) < end) {
                    let tail = new core.DartString(host).codeUnitAt(index + 1);
                    if ((tail & 64512) == 56320) {
                        char = 65536 | ((char & 1023) << 10) | (tail & 1023);
                        sourceLength = 2;
                    }
                }
                if (op(Op.EQUALS, buffer, null))
                    buffer = new core.DartStringBuffer();
                let slice = host.substring(sectionStart, index);
                if (!isNormalized)
                    slice = slice.toLowerCase();
                buffer.write(slice);
                buffer.write(_Uri_1._escapeChar(char));
                index += sourceLength;
                sectionStart = index;
            }
        }
        if (op(Op.EQUALS, buffer, null))
            return host.substring(start, end);
        if (sectionStart < end) {
            let slice = host.substring(sectionStart, end);
            if (!isNormalized)
                slice = slice.toLowerCase();
            buffer.write(slice);
        }
        return buffer.toString();
    }
    static _makeScheme(scheme, start, end) {
        if (start == end)
            return "";
        let firstCodeUnit = new core.DartString(scheme).codeUnitAt(start);
        if (!_Uri_1._isAlphabeticCharacter(firstCodeUnit)) {
            _Uri_1._fail(scheme, start, "Scheme not starting with alphabetic character");
        }
        let containsUpperCase = false;
        for (let i = start; i < end; i++) {
            let codeUnit = new core.DartString(scheme).codeUnitAt(i);
            if (!_Uri_1._isSchemeCharacter(codeUnit)) {
                _Uri_1._fail(scheme, i, "Illegal scheme character");
            }
            if (properties._UPPER_CASE_A <= codeUnit && codeUnit <= properties._UPPER_CASE_Z) {
                containsUpperCase = true;
            }
        }
        scheme = scheme.substring(start, end);
        if (containsUpperCase)
            scheme = scheme.toLowerCase();
        return _Uri_1._canonicalizeScheme(scheme);
    }
    static _canonicalizeScheme(scheme) {
        if (scheme == "http")
            return "http";
        if (scheme == "file")
            return "file";
        if (scheme == "https")
            return "https";
        if (scheme == "package")
            return "package";
        return scheme;
    }
    static _makeUserInfo(userInfo, start, end) {
        if (userInfo == null)
            return "";
        return _Uri_1._normalizeOrSubstring(userInfo, start, end, _Uri_1._userinfoTable);
    }
    static _makePath(path, start, end, pathSegments, scheme, hasAuthority) {
        let isFile = (scheme == "file");
        let ensureLeadingSlash = isFile || hasAuthority;
        if (path == null && pathSegments == null)
            return isFile ? "/" : "";
        if (path != null && pathSegments != null) {
            throw new core.ArgumentError('Both path and pathSegments specified');
        }
        let result;
        if (path != null) {
            result = _Uri_1._normalizeOrSubstring(path, start, end, _Uri_1._pathCharOrSlashTable);
        }
        else {
            result = pathSegments.map((s) => {
                return _Uri_1._uriEncode(_Uri_1._pathCharTable, s, convert.properties.UTF8, false);
            }).join("/");
        }
        if (new core.DartString(result).isEmpty) {
            if (isFile)
                return "/";
        }
        else if (ensureLeadingSlash && !result.startsWith('/')) {
            result = "/" + result;
        }
        result = _Uri_1._normalizePath(result, scheme, hasAuthority);
        return result;
    }
    static _normalizePath(path, scheme, hasAuthority) {
        if (new core.DartString(scheme).isEmpty && !hasAuthority && !path.startsWith('/')) {
            return _Uri_1._normalizeRelativePath(path, new core.DartString(scheme).isNotEmpty || hasAuthority);
        }
        return _Uri_1._removeDotSegments(path);
    }
    static _makeQuery(query, start, end, queryParameters) {
        if (query != null) {
            if (queryParameters != null) {
                throw new core.ArgumentError('Both query and queryParameters specified');
            }
            return _Uri_1._normalizeOrSubstring(query, start, end, _Uri_1._queryCharTable);
        }
        if (queryParameters == null)
            return null;
        let result = new core.DartStringBuffer();
        let separator = "";
        var writeParameter = (key, value) => {
            result.write(separator);
            separator = "&";
            result.write(Uri.encodeQueryComponent(key));
            if (value != null && new core.DartString(value).isNotEmpty) {
                result.write("=");
                result.write(Uri.encodeQueryComponent(value));
            }
        };
        queryParameters.forEach((key, value) => {
            if (op(Op.EQUALS, value, null) || is(value, "string")) {
                writeParameter(key, value);
            }
            else {
                let values = value;
                for (let value of values) {
                    writeParameter(key, value);
                }
            }
        });
        return result.toString();
    }
    static _makeFragment(fragment, start, end) {
        if (fragment == null)
            return null;
        return _Uri_1._normalizeOrSubstring(fragment, start, end, _Uri_1._queryCharTable);
    }
    static _normalizeEscape(source, index, lowerCase) {
        /* TODO (AssertStatementImpl) : assert (new core.DartString(source).codeUnitAt(index) == _PERCENT); */
        ;
        if (index + 2 >= source.length) {
            return "%";
        }
        let firstDigit = new core.DartString(source).codeUnitAt(index + 1);
        let secondDigit = new core.DartString(source).codeUnitAt(index + 2);
        let firstDigitValue = _internal.hexDigitValue(firstDigit);
        let secondDigitValue = _internal.hexDigitValue(secondDigit);
        if (firstDigitValue < 0 || secondDigitValue < 0) {
            return "%";
        }
        let value = firstDigitValue * 16 + secondDigitValue;
        if (_Uri_1._isUnreservedChar(value)) {
            if (lowerCase && properties._UPPER_CASE_A <= value && properties._UPPER_CASE_Z >= value) {
                value = 32;
            }
            return new core.DartString.fromCharCode(value).valueOf();
        }
        if (firstDigit >= properties._LOWER_CASE_A || secondDigit >= properties._LOWER_CASE_A) {
            return source.substring(index, index + 3).toUpperCase();
        }
        return null;
    }
    static _escapeChar(char) {
        /* TODO (AssertStatementImpl) : assert (char <= 0x10ffff); */
        ;
        let codeUnits;
        if (char < 128) {
            codeUnits = new core.DartList(3);
            codeUnits[0] = properties._PERCENT;
            codeUnits[1] = new core.DartString(properties._hexDigits).codeUnitAt(char >> 4);
            codeUnits[2] = new core.DartString(properties._hexDigits).codeUnitAt(char & 15);
        }
        else {
            let flag = 192;
            let encodedBytes = 2;
            if (char > 2047) {
                flag = 224;
                encodedBytes = 3;
                if (char > 65535) {
                    encodedBytes = 4;
                    flag = 240;
                }
            }
            codeUnits = new core.DartList(3 * encodedBytes);
            let index = 0;
            while (--encodedBytes >= 0) {
                let byte = ((char >> (6 * encodedBytes)) & 63) | flag;
                codeUnits[index] = properties._PERCENT;
                codeUnits[index + 1] = new core.DartString(properties._hexDigits).codeUnitAt(byte >> 4);
                codeUnits[index + 2] = new core.DartString(properties._hexDigits).codeUnitAt(byte & 15);
                index += 3;
                flag = 128;
            }
        }
        return new core.DartString.fromCharCodes(codeUnits).valueOf();
    }
    static _normalizeOrSubstring(component, start, end, charTable) {
        return _Uri_1._normalize(component, start, end, charTable) || component.substring(start, end);
    }
    static _normalize(component, start, end, charTable, _namedArguments) {
        let { escapeDelimiters } = Object.assign({
            "escapeDelimiters": false
        }, _namedArguments);
        let buffer;
        let sectionStart = start;
        let index = start;
        while (index < end) {
            let char = new core.DartString(component).codeUnitAt(index);
            if (char < 127 && (charTable[char >> 4] & (1 << (char & 15))) != 0) {
                index++;
            }
            else {
                let replacement;
                let sourceLength;
                if (char == properties._PERCENT) {
                    replacement = _Uri_1._normalizeEscape(component, index, false);
                    if (replacement == null) {
                        index += 3;
                        continue;
                    }
                    if ("%" == replacement) {
                        replacement = "%25";
                        sourceLength = 1;
                    }
                    else {
                        sourceLength = 3;
                    }
                }
                else if (!escapeDelimiters && _Uri_1._isGeneralDelimiter(char)) {
                    _Uri_1._fail(component, index, "Invalid character");
                }
                else {
                    sourceLength = 1;
                    if ((char & 64512) == 55296) {
                        if (index + 1 < end) {
                            let tail = new core.DartString(component).codeUnitAt(index + 1);
                            if ((tail & 64512) == 56320) {
                                sourceLength = 2;
                                char = 65536 | ((char & 1023) << 10) | (tail & 1023);
                            }
                        }
                    }
                    replacement = _Uri_1._escapeChar(char);
                }
                if (op(Op.EQUALS, buffer, null))
                    buffer = new core.DartStringBuffer();
                buffer.write(component.substring(sectionStart, index));
                buffer.write(replacement);
                index += sourceLength;
                sectionStart = index;
            }
        }
        if (op(Op.EQUALS, buffer, null)) {
            return null;
        }
        if (sectionStart < end) {
            buffer.write(component.substring(sectionStart, end));
        }
        return buffer.toString();
    }
    static _isSchemeCharacter(ch) {
        return ch < 128 && ((op(Op.BITAND, op(Op.INDEX, _Uri_1._schemeTable, ch >> 4), (1 << (ch & 15)))) != 0);
    }
    static _isGeneralDelimiter(ch) {
        return ch <= properties._RIGHT_BRACKET && ((op(Op.BITAND, op(Op.INDEX, _Uri_1._genDelimitersTable, ch >> 4), (1 << (ch & 15)))) != 0);
    }
    get isAbsolute() {
        return this.scheme != "" && this.fragment == "";
    }
    _mergePaths(base, reference) {
        let backCount = 0;
        let refStart = 0;
        while (reference.startsWith("../", refStart)) {
            refStart += 3;
            backCount++;
        }
        let baseEnd = base.lastIndexOf('/');
        while (baseEnd > 0 && backCount > 0) {
            let newEnd = base.lastIndexOf('/', baseEnd - 1);
            if (newEnd < 0) {
                break;
            }
            let delta = baseEnd - newEnd;
            if ((delta == 2 || delta == 3) && new core.DartString(base).codeUnitAt(newEnd + 1) == properties._DOT && (delta == 2 || new core.DartString(base).codeUnitAt(newEnd + 2) == properties._DOT)) {
                break;
            }
            baseEnd = newEnd;
            backCount--;
        }
        return new core.DartString(base).replaceRange(baseEnd + 1, null, reference.substring(refStart - 3 * backCount));
    }
    static _mayContainDotSegments(path) {
        if (path.startsWith('.'))
            return true;
        let index = path.indexOf("/.");
        return index != -1;
    }
    static _removeDotSegments(path) {
        if (!_Uri_1._mayContainDotSegments(path))
            return path;
        /* TODO (AssertStatementImpl) : assert (new core.DartString(path).isNotEmpty); */
        ;
        let output = new core.DartList.literal();
        let appendSlash = false;
        for (let segment of path.split("/")) {
            appendSlash = false;
            if (segment == "..") {
                if (output.isNotEmpty) {
                    output.removeLast();
                    if (output.isEmpty) {
                        output.add("");
                    }
                }
                appendSlash = true;
            }
            else if ("." == segment) {
                appendSlash = true;
            }
            else {
                output.add(segment);
            }
        }
        if (appendSlash)
            output.add("");
        return output.join("/");
    }
    static _normalizeRelativePath(path, allowScheme) {
        /* TODO (AssertStatementImpl) : assert (!path.startsWith('/')); */
        ;
        if (!_Uri_1._mayContainDotSegments(path)) {
            if (!allowScheme)
                path = _Uri_1._escapeScheme(path);
            return path;
        }
        /* TODO (AssertStatementImpl) : assert (path.isNotEmpty); */
        ;
        let output = new core.DartList.literal();
        let appendSlash = false;
        for (let segment of path.split("/")) {
            appendSlash = false;
            if (".." == segment) {
                if (!output.isEmpty && output.last != "..") {
                    output.removeLast();
                    appendSlash = true;
                }
                else {
                    output.add("..");
                }
            }
            else if ("." == segment) {
                appendSlash = true;
            }
            else {
                output.add(segment);
            }
        }
        if (output.isEmpty || (output.length == 1 && output[0].isEmpty)) {
            return "./";
        }
        if (appendSlash || output.last == '..')
            output.add("");
        if (!allowScheme)
            output[0] = _Uri_1._escapeScheme(output[0]);
        return output.join("/");
    }
    static _escapeScheme(path) {
        if (path.length >= 2 && _Uri_1._isAlphabeticCharacter(new core.DartString(path).codeUnitAt(0))) {
            for (let i = 1; i < path.length; i++) {
                let char = new core.DartString(path).codeUnitAt(i);
                if (char == properties._COLON) {
                    return `${path.substring(0, i)}%3A${path.substring(i + 1)}`;
                }
                if (char > 127 || (op(Op.EQUALS, (op(Op.BITAND, op(Op.INDEX, _Uri_1._schemeTable, char >> 4), (1 << (char & 15)))), 0))) {
                    break;
                }
            }
        }
        return path;
    }
    resolve(reference) {
        return this.resolveUri(Uri.parse(reference));
    }
    resolveUri(reference) {
        let targetScheme;
        let targetUserInfo = "";
        let targetHost;
        let targetPort;
        let targetPath;
        let targetQuery;
        if (new core.DartString(reference.scheme).isNotEmpty) {
            targetScheme = reference.scheme;
            if (reference.hasAuthority) {
                targetUserInfo = reference.userInfo;
                targetHost = reference.host;
                targetPort = reference.hasPort ? reference.port : null;
            }
            targetPath = _Uri_1._removeDotSegments(reference.path);
            if (reference.hasQuery) {
                targetQuery = reference.query;
            }
        }
        else {
            targetScheme = this.scheme;
            if (reference.hasAuthority) {
                targetUserInfo = reference.userInfo;
                targetHost = reference.host;
                targetPort = _Uri_1._makePort(reference.hasPort ? reference.port : null, targetScheme);
                targetPath = _Uri_1._removeDotSegments(reference.path);
                if (reference.hasQuery)
                    targetQuery = reference.query;
            }
            else {
                targetUserInfo = this._userInfo;
                targetHost = this._host;
                targetPort = this._port;
                if (reference.path == "") {
                    targetPath = this.path;
                    if (reference.hasQuery) {
                        targetQuery = reference.query;
                    }
                    else {
                        targetQuery = this._query;
                    }
                }
                else {
                    if (reference.hasAbsolutePath) {
                        targetPath = _Uri_1._removeDotSegments(reference.path);
                    }
                    else {
                        if (this.hasEmptyPath) {
                            if (!this.hasAuthority) {
                                if (!this.hasScheme) {
                                    targetPath = reference.path;
                                }
                                else {
                                    targetPath = _Uri_1._removeDotSegments(reference.path);
                                }
                            }
                            else {
                                targetPath = _Uri_1._removeDotSegments("/" + reference.path);
                            }
                        }
                        else {
                            let mergedPath = this._mergePaths(this.path, reference.path);
                            if (this.hasScheme || this.hasAuthority || this.hasAbsolutePath) {
                                targetPath = _Uri_1._removeDotSegments(mergedPath);
                            }
                            else {
                                targetPath = _Uri_1._normalizeRelativePath(mergedPath, this.hasScheme || this.hasAuthority);
                            }
                        }
                    }
                    if (reference.hasQuery)
                        targetQuery = reference.query;
                }
            }
        }
        let fragment = reference.hasFragment ? reference.fragment : null;
        return new _Uri_1._internal(targetScheme, targetUserInfo, targetHost, targetPort, targetPath, targetQuery, fragment);
    }
    get hasScheme() {
        return new core.DartString(this.scheme).isNotEmpty;
    }
    get hasAuthority() {
        return this._host != null;
    }
    get hasPort() {
        return this._port != null;
    }
    get hasQuery() {
        return this._query != null;
    }
    get hasFragment() {
        return this._fragment != null;
    }
    get hasEmptyPath() {
        return new core.DartString(this.path).isEmpty;
    }
    get hasAbsolutePath() {
        return this.path.startsWith('/');
    }
    get origin() {
        if (this.scheme == "") {
            throw new core.StateError(`Cannot use origin without a scheme: ${this}`);
        }
        if (this.scheme != "http" && this.scheme != "https") {
            throw new core.StateError(`Origin is only applicable schemes http and https: ${this}`);
        }
        if (this._host == null || this._host == "") {
            throw new core.StateError(`A ${this.scheme}: URI should have a non-empty host name: ${this}`);
        }
        if (this._port == null)
            return `${this.scheme}://${this._host}`;
        return `${this.scheme}://${this._host}:${this._port}`;
    }
    toFilePath(_namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        if (this.scheme != "" && this.scheme != "file") {
            throw new core.UnsupportedError(`Cannot extract a file path from a ${this.scheme} URI`);
        }
        if (this.query != "") {
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a query component");
        }
        if (this.fragment != "") {
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a fragment component");
        }
        if (windows == null)
            windows = _Uri_1._isWindows;
        return windows ? _Uri_1._toWindowsFilePath(this) : this._toFilePath();
    }
    _toFilePath() {
        if (this.hasAuthority && this.host != "") {
            throw new core.UnsupportedError("Cannot extract a non-Windows file path from a file URI " + "with an authority");
        }
        let pathSegments = this.pathSegments;
        _Uri_1._checkNonWindowsPathReservedCharacters(pathSegments, false);
        let result = new core.DartStringBuffer();
        if (this.hasAbsolutePath)
            result.write("/");
        result.writeAll(pathSegments, "/");
        return result.toString();
    }
    static _toWindowsFilePath(uri) {
        let hasDriveLetter = false;
        let segments = uri.pathSegments;
        if (segments.length > 0 && segments[0].length == 2 && segments[0].codeUnitAt(1) == properties._COLON) {
            _Uri_1._checkWindowsDriveLetter(segments[0].codeUnitAt(0), false);
            _Uri_1._checkWindowsPathReservedCharacters(segments, false, 1);
            hasDriveLetter = true;
        }
        else {
            _Uri_1._checkWindowsPathReservedCharacters(segments, false, 0);
        }
        let result = new core.DartStringBuffer();
        if (uri.hasAbsolutePath && !hasDriveLetter)
            result.write("\\");
        if (uri.hasAuthority) {
            let host = uri.host;
            if (new core.DartString(host).isNotEmpty) {
                result.write("\\");
                result.write(host);
                result.write("\\");
            }
        }
        result.writeAll(segments, "\\");
        if (hasDriveLetter && segments.length == 1)
            result.write("\\");
        return result.toString();
    }
    get _isPathAbsolute() {
        return this.path != null && this.path.startsWith('/');
    }
    _writeAuthority(ss) {
        if (new core.DartString(this._userInfo).isNotEmpty) {
            ss.write(this._userInfo);
            ss.write("@");
        }
        if (this._host != null)
            ss.write(this._host);
        if (this._port != null) {
            ss.write(":");
            ss.write(this._port);
        }
    }
    get data() {
        return (this.scheme == "data") ? new UriData.fromUri(this) : null;
    }
    toString() {
        return this._text = this._text || this._initializeText();
    }
    _initializeText() {
        /* TODO (AssertStatementImpl) : assert (_text == null); */
        ;
        let sb = new core.DartStringBuffer();
        if (new core.DartString(this.scheme).isNotEmpty)
            ((_) => {
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
        if (this._query != null)
            ((_) => {
                {
                    _.write("?");
                    _.write(this._query);
                    return _;
                }
            })(sb);
        if (this._fragment != null)
            ((_) => {
                {
                    _.write("#");
                    _.write(this._fragment);
                    return _;
                }
            })(sb);
        return sb.toString();
    }
    [OperatorMethods.EQUALS](other) {
        if (core.identical(this, other))
            return true;
        if (is(other, Uri)) {
            let uri = other;
            return this.scheme == uri.scheme && this.hasAuthority == uri.hasAuthority && this.userInfo == uri.userInfo && this.host == uri.host && this.port == uri.port && this.path == uri.path && this.hasQuery == uri.hasQuery && this.query == uri.query && this.hasFragment == uri.hasFragment && this.fragment == uri.fragment;
        }
        return false;
    }
    get hashCode() {
        return this._hashCodeCache = this._hashCodeCache || new core.DartString(this.toString()).hashCode;
    }
    static _createList() {
        return new core.DartList.literal();
    }
    static _splitQueryStringAll(query, _namedArguments) {
        let { encoding } = Object.assign({
            "encoding": convert.properties.UTF8
        }, _namedArguments);
        let result = new core.DartMap.literal([]);
        let i = 0;
        let start = 0;
        let equalsIndex = -1;
        var parsePair = (start, equalsIndex, end) => {
            let key;
            let value;
            if (start == end)
                return;
            if (equalsIndex < 0) {
                key = _Uri_1._uriDecode(query, start, end, encoding, true);
                value = "";
            }
            else {
                key = _Uri_1._uriDecode(query, start, equalsIndex, encoding, true);
                value = _Uri_1._uriDecode(query, equalsIndex + 1, end, encoding, true);
            }
            result.putIfAbsent(key, _Uri_1._createList.bind(this)).add(value);
        };
        while (i < query.length) {
            let char = new core.DartString(query).codeUnitAt(i);
            if (char == properties._EQUALS) {
                if (equalsIndex < 0)
                    equalsIndex = i;
            }
            else if (char == properties._AMPERSAND) {
                parsePair(start, equalsIndex, i);
                start = i + 1;
                equalsIndex = -1;
            }
            i++;
        }
        parsePair(start, equalsIndex, i);
        return result;
    }
    static get _needsNoEncoding() {
        if (this.__$_needsNoEncoding === undefined) {
            this.__$_needsNoEncoding = new core.DartRegExp('^[\-\.0-9A-Z_a-z~]*$');
        }
        return this.__$_needsNoEncoding;
    }
    static set _needsNoEncoding(__$value) {
        this.__$_needsNoEncoding = __$value;
    }
    static _uriEncode(canonicalTable, text, encoding, spaceToPlus) {
        if (core.identical(encoding, convert.properties.UTF8) && _Uri_1._needsNoEncoding.hasMatch(text)) {
            return text;
        }
        let result = new core.DartStringBuffer('');
        let bytes = encoding.encode(text);
        for (let i = 0; i < bytes.length; i++) {
            let byte = op(Op.INDEX, bytes, i);
            if (byte < 128 && ((canonicalTable[byte >> 4] & (1 << (byte & 15))) != 0)) {
                result.writeCharCode(byte);
            }
            else if (spaceToPlus && byte == properties._SPACE) {
                result.write('+');
            }
            else {
                let hexDigits = '0123456789ABCDEF';
                result.write('%');
                result.write(hexDigits[(byte >> 4) & 15]);
                result.write(hexDigits[byte & 15]);
            }
        }
        return result.toString();
    }
    static _hexCharPairToByte(s, pos) {
        let byte = 0;
        for (let i = 0; i < 2; i++) {
            let charCode = new core.DartString(s).codeUnitAt(pos + i);
            if (48 <= charCode && charCode <= 57) {
                byte = byte * 16 + charCode - 48;
            }
            else {
                charCode = 32;
                if (97 <= charCode && charCode <= 102) {
                    byte = byte * 16 + charCode - 87;
                }
                else {
                    throw new core.ArgumentError("Invalid URL encoding");
                }
            }
        }
        return byte;
    }
    static _uriDecode(text, start, end, encoding, plusToSpace) {
        /* TODO (AssertStatementImpl) : assert (0 <= start); */
        ;
        /* TODO (AssertStatementImpl) : assert (start <= end); */
        ;
        /* TODO (AssertStatementImpl) : assert (end <= text.length); */
        ;
        /* TODO (AssertStatementImpl) : assert (encoding != null); */
        ;
        let simple = true;
        for (let i = start; i < end; i++) {
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit > 127 || codeUnit == properties._PERCENT || (plusToSpace && codeUnit == properties._PLUS)) {
                simple = false;
                break;
            }
        }
        let bytes;
        if (simple) {
            if (op(Op.EQUALS, convert.properties.UTF8, encoding) || op(Op.EQUALS, convert.properties.LATIN1, encoding) || op(Op.EQUALS, convert.properties.ASCII, encoding)) {
                return text.substring(start, end);
            }
            else {
                bytes = new core.DartString(text.substring(start, end)).codeUnits;
            }
        }
        else {
            bytes = new core.DartList();
            for (let i = start; i < end; i++) {
                let codeUnit = new core.DartString(text).codeUnitAt(i);
                if (codeUnit > 127) {
                    throw new core.ArgumentError("Illegal percent encoding in URI");
                }
                if (codeUnit == properties._PERCENT) {
                    if (i + 3 > text.length) {
                        throw new core.ArgumentError('Truncated URI');
                    }
                    bytes.add(_Uri_1._hexCharPairToByte(text, i + 1));
                    i += 2;
                }
                else if (plusToSpace && codeUnit == properties._PLUS) {
                    bytes.add(properties._SPACE);
                }
                else {
                    bytes.add(codeUnit);
                }
            }
        }
        return encoding.decode(bytes);
    }
    static _isAlphabeticCharacter(codeUnit) {
        let lowerCase = codeUnit | 32;
        return (properties._LOWER_CASE_A <= lowerCase && lowerCase <= properties._LOWER_CASE_Z);
    }
    static _isUnreservedChar(char) {
        return char < 127 && ((op(Op.BITAND, op(Op.INDEX, _Uri_1._unreservedTable, char >> 4), (1 << (char & 15)))) != 0);
    }
};
_Uri._unreservedTable = new core.DartList.literal(0, 0, 24576, 1023, 65534, 34815, 65534, 18431);
_Uri._unreserved2396Table = new core.DartList.literal(0, 0, 26498, 1023, 65534, 34815, 65534, 18431);
_Uri._encodeFullTable = new core.DartList.literal(0, 0, 65498, 45055, 65535, 34815, 65534, 18431);
_Uri._schemeTable = new core.DartList.literal(0, 0, 26624, 1023, 65534, 2047, 65534, 2047);
_Uri._schemeLowerTable = new core.DartList.literal(0, 0, 26624, 1023, 0, 0, 65534, 2047);
_Uri._subDelimitersTable = new core.DartList.literal(0, 0, 32722, 11263, 65534, 34815, 65534, 18431);
_Uri._genDelimitersTable = new core.DartList.literal(0, 0, 32776, 33792, 1, 10240, 0, 0);
_Uri._userinfoTable = new core.DartList.literal(0, 0, 32722, 12287, 65534, 34815, 65534, 18431);
_Uri._regNameTable = new core.DartList.literal(0, 0, 32754, 11263, 65534, 34815, 65534, 18431);
_Uri._pathCharTable = new core.DartList.literal(0, 0, 32722, 12287, 65535, 34815, 65534, 18431);
_Uri._pathCharOrSlashTable = new core.DartList.literal(0, 0, 65490, 12287, 65535, 34815, 65534, 18431);
_Uri._queryCharTable = new core.DartList.literal(0, 0, 65490, 45055, 65535, 34815, 65534, 18431);
__decorate([
    namedConstructor
], _Uri.prototype, "_internal", null);
__decorate([
    namedFactory
], _Uri, "_notSimple", null);
__decorate([
    defaultFactory
], _Uri, "__Uri", null);
__decorate([
    namedFactory
], _Uri, "_http", null);
__decorate([
    namedFactory
], _Uri, "_https", null);
__decorate([
    namedFactory
], _Uri, "_file", null);
__decorate([
    namedFactory
], _Uri, "_directory", null);
_Uri = _Uri_1 = __decorate([
    DartClass,
    Implements(Uri)
], _Uri);
export { _Uri };
let UriData = UriData_1 = class UriData {
    _(_text, _separatorIndices, _uriCache) {
        this._text = _text;
        this._separatorIndices = _separatorIndices;
        this._uriCache = _uriCache;
    }
    static _fromString(content, _namedArguments) {
        let { mimeType, encoding, parameters, base64 } = Object.assign({
            "base64": false
        }, _namedArguments);
        let buffer = new core.DartStringBuffer();
        let indices = new core.DartList.literal(UriData_1._noScheme);
        let charsetName;
        let encodingName;
        if (parameters != null)
            charsetName = parameters.get("charset");
        if (op(Op.EQUALS, encoding, null)) {
            if (charsetName != null) {
                encoding = convert.Encoding.getByName(charsetName);
            }
        }
        else if (charsetName == null) {
            encodingName = encoding.name;
        }
        encoding = encoding || convert.properties.ASCII;
        UriData_1._writeUri(mimeType, encodingName, parameters, buffer, indices);
        indices.add(buffer.length);
        if (base64) {
            buffer.write(';base64,');
            indices.add(buffer.length - 1);
            buffer.write(encoding.fuse(convert.properties.BASE64).encode(content));
        }
        else {
            buffer.write(',');
            UriData_1._uriEncodeBytes(UriData_1._uricTable, encoding.encode(content), buffer);
        }
        return new UriData_1._(buffer.toString(), indices, null);
    }
    static _fromBytes(bytes, _namedArguments) {
        let { mimeType, parameters, percentEncoded } = Object.assign({
            "mimeType": "application/octet-stream",
            "percentEncoded": false
        }, _namedArguments);
        let buffer = new core.DartStringBuffer();
        let indices = new core.DartList.literal(UriData_1._noScheme);
        UriData_1._writeUri(mimeType, null, parameters, buffer, indices);
        indices.add(buffer.length);
        if (percentEncoded) {
            buffer.write(',');
            UriData_1._uriEncodeBytes(UriData_1._uricTable, bytes, buffer);
        }
        else {
            buffer.write(';base64,');
            indices.add(buffer.length - 1);
            convert.properties.BASE64.encoder.startChunkedConversion(new convert.StringConversionSink.fromStringSink(buffer)).addSlice(bytes, 0, bytes.length, true);
        }
        return new UriData_1._(buffer.toString(), indices, null);
    }
    static _fromUri(uri) {
        if (uri.scheme != "data") {
            throw new core.ArgumentError.value(uri, "uri", "Scheme must be 'data'");
        }
        if (uri.hasAuthority) {
            throw new core.ArgumentError.value(uri, "uri", "Data uri must not have authority");
        }
        if (uri.hasFragment) {
            throw new core.ArgumentError.value(uri, "uri", "Data uri must not have a fragment part");
        }
        if (!uri.hasQuery) {
            return UriData_1._parse(uri.path, 0, uri);
        }
        return UriData_1._parse(`${uri}`, 5, uri);
    }
    static _writeUri(mimeType, charsetName, parameters, buffer, indices) {
        if (mimeType == null || mimeType == "text/plain") {
            mimeType = "";
        }
        if (new core.DartString(mimeType).isEmpty || core.identical(mimeType, "application/octet-stream")) {
            buffer.write(mimeType);
        }
        else {
            let slashIndex = UriData_1._validateMimeType(mimeType);
            if (slashIndex < 0) {
                throw new core.ArgumentError.value(mimeType, "mimeType", "Invalid MIME type");
            }
            buffer.write(_Uri._uriEncode(UriData_1._tokenCharTable, mimeType.substring(0, slashIndex), convert.properties.UTF8, false));
            buffer.write("/");
            buffer.write(_Uri._uriEncode(UriData_1._tokenCharTable, mimeType.substring(slashIndex + 1), convert.properties.UTF8, false));
        }
        if (charsetName != null) {
            if (indices != null) {
                ((_) => {
                    {
                        _.add(buffer.length);
                        _.add(buffer.length + 8);
                        return _;
                    }
                })(indices);
            }
            buffer.write(";charset=");
            buffer.write(_Uri._uriEncode(UriData_1._tokenCharTable, charsetName, convert.properties.UTF8, false));
        }
        parameters.forEach((key, value) => {
            if (new core.DartString(key).isEmpty) {
                throw new core.ArgumentError.value("", "Parameter names must not be empty");
            }
            if (new core.DartString(value).isEmpty) {
                throw new core.ArgumentError.value("", "Parameter values must not be empty", `parameters["${key}"]`);
            }
            if (indices != null)
                indices.add(buffer.length);
            buffer.write(';');
            buffer.write(_Uri._uriEncode(UriData_1._tokenCharTable, key, convert.properties.UTF8, false));
            if (indices != null)
                indices.add(buffer.length);
            buffer.write('=');
            buffer.write(_Uri._uriEncode(UriData_1._tokenCharTable, value, convert.properties.UTF8, false));
        });
    }
    static _validateMimeType(mimeType) {
        let slashIndex = -1;
        for (let i = 0; i < mimeType.length; i++) {
            let char = new core.DartString(mimeType).codeUnitAt(i);
            if (char != properties._SLASH)
                continue;
            if (slashIndex < 0) {
                slashIndex = i;
                continue;
            }
            return -1;
        }
        return slashIndex;
    }
    static parse(uri) {
        if (uri.length >= 5) {
            let dataDelta = _startsWithData(uri, 0);
            if (dataDelta == 0) {
                return UriData_1._parse(uri, 5, null);
            }
            if (dataDelta == 32) {
                return UriData_1._parse(uri.substring(5), 0, null);
            }
        }
        throw new core.FormatException("Does not start with 'data:'", uri, 0);
    }
    get uri() {
        if (this._uriCache != null)
            return this._uriCache;
        let path = this._text;
        let query = null;
        let colonIndex = this._separatorIndices[0];
        let queryIndex = this._text.indexOf('?', colonIndex + 1);
        let end = this._text.length;
        if (queryIndex >= 0) {
            query = _Uri._normalizeOrSubstring(this._text, queryIndex + 1, end, _Uri._queryCharTable);
            end = queryIndex;
        }
        path = _Uri._normalizeOrSubstring(this._text, colonIndex + 1, end, _Uri._pathCharOrSlashTable);
        this._uriCache = new _DataUri(this, path, query);
        return this._uriCache;
    }
    get mimeType() {
        let start = this._separatorIndices[0] + 1;
        let end = this._separatorIndices[1];
        if (start == end)
            return "text/plain";
        return _Uri._uriDecode(this._text, start, end, convert.properties.UTF8, false);
    }
    get charset() {
        let parameterStart = 1;
        let parameterEnd = this._separatorIndices.length - 1;
        if (this.isBase64) {
            parameterEnd -= 1;
        }
        for (let i = parameterStart; i < parameterEnd; i += 2) {
            let keyStart = this._separatorIndices[i] + 1;
            let keyEnd = this._separatorIndices[i + 1];
            if (keyEnd == keyStart + 7 && this._text.startsWith("charset", keyStart)) {
                return _Uri._uriDecode(this._text, keyEnd + 1, this._separatorIndices[i + 2], convert.properties.UTF8, false);
            }
        }
        return "US-ASCII";
    }
    get isBase64() {
        return new core.DartInt(this._separatorIndices.length).isOdd;
    }
    get contentText() {
        return this._text.substring(this._separatorIndices.last + 1);
    }
    contentAsBytes() {
        let text = this._text;
        let start = this._separatorIndices.last + 1;
        if (this.isBase64) {
            return convert.properties.BASE64.decoder.convert(text, start);
        }
        let percent = 37;
        let length = text.length - start;
        for (let i = start; i < text.length; i++) {
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit == percent) {
                i += 2;
                length -= 2;
            }
        }
        let result = new typed_data.Uint8List(length);
        if (length == text.length) {
            result.setRange(0, length, new core.DartString(text).codeUnits, start);
            return result;
        }
        let index = 0;
        for (let i = start; i < text.length; i++) {
            let codeUnit = new core.DartString(text).codeUnitAt(i);
            if (codeUnit != percent) {
                op(Op.INDEX_ASSIGN, result, index++, codeUnit);
            }
            else {
                if (i + 2 < text.length) {
                    let byte = _internal.parseHexByte(text, i + 1);
                    if (byte >= 0) {
                        op(Op.INDEX_ASSIGN, result, index++, byte);
                        i += 2;
                        continue;
                    }
                }
                throw new core.FormatException("Invalid percent escape", text, i);
            }
        }
        /* TODO (AssertStatementImpl) : assert (index == result.length); */
        ;
        return result;
    }
    contentAsString(_namedArguments) {
        let { encoding } = Object.assign({}, _namedArguments);
        if (op(Op.EQUALS, encoding, null)) {
            let charset = this.charset;
            encoding = convert.Encoding.getByName(charset);
            if (op(Op.EQUALS, encoding, null)) {
                throw new core.UnsupportedError(`Unknown charset: ${charset}`);
            }
        }
        let text = this._text;
        let start = this._separatorIndices.last + 1;
        if (this.isBase64) {
            let converter = convert.properties.BASE64.decoder.fuse(encoding.decoder);
            return converter.convert(text.substring(start));
        }
        return _Uri._uriDecode(text, start, text.length, encoding, false);
    }
    get parameters() {
        let result = new core.DartMap();
        for (let i = 3; i < this._separatorIndices.length; i += 2) {
            let start = this._separatorIndices[i - 2] + 1;
            let equals = this._separatorIndices[i - 1];
            let end = this._separatorIndices[i];
            let key = _Uri._uriDecode(this._text, start, equals, convert.properties.UTF8, false);
            let value = _Uri._uriDecode(this._text, equals + 1, end, convert.properties.UTF8, false);
            result.set(key, value);
        }
        return result;
    }
    static _parse(text, start, sourceUri) {
        /* TODO (AssertStatementImpl) : assert (start == 0 || start == 5); */
        ;
        /* TODO (AssertStatementImpl) : assert ((start == 5) == text.startsWith("data:")); */
        ;
        let comma = 44;
        let slash = 47;
        let semicolon = 59;
        let equals = 61;
        let indices = new core.DartList.literal(start - 1);
        let slashIndex = -1;
        let char;
        let i = start;
        for (; i < text.length; i++) {
            char = new core.DartString(text).codeUnitAt(i);
            if (char == comma || char == semicolon)
                break;
            if (char == slash) {
                if (slashIndex < 0) {
                    slashIndex = i;
                    continue;
                }
                throw new core.FormatException("Invalid MIME type", text, i);
            }
        }
        if (slashIndex < 0 && i > start) {
            throw new core.FormatException("Invalid MIME type", text, i);
        }
        while (char != comma) {
            indices.add(i);
            i++;
            let equalsIndex = -1;
            for (; i < text.length; i++) {
                char = new core.DartString(text).codeUnitAt(i);
                if (char == equals) {
                    if (equalsIndex < 0)
                        equalsIndex = i;
                }
                else if (char == semicolon || char == comma) {
                    break;
                }
            }
            if (equalsIndex >= 0) {
                indices.add(equalsIndex);
            }
            else {
                let lastSeparator = indices.last;
                if (char != comma || i != lastSeparator + 7 || !text.startsWith("base64", lastSeparator + 1)) {
                    throw new core.FormatException("Expecting '='", text, i);
                }
                break;
            }
        }
        indices.add(i);
        let isBase64 = new core.DartInt(indices.length).isOdd;
        if (isBase64) {
            text = convert.properties.BASE64.normalize(text, i + 1, text.length);
        }
        else {
            let data = _Uri._normalize(text, i + 1, text.length, UriData_1._uricTable, {
                escapeDelimiters: true
            });
            if (data != null) {
                text = new core.DartString(text).replaceRange(i + 1, text.length, data);
            }
        }
        return new UriData_1._(text, indices, sourceUri);
    }
    static _uriEncodeBytes(canonicalTable, bytes, buffer) {
        let byteOr = 0;
        for (let i = 0; i < bytes.length; i++) {
            let byte = bytes[i];
            byteOr = byte;
            if (byte < 128 && ((canonicalTable[byte >> 4] & (1 << (byte & 15))) != 0)) {
                buffer.writeCharCode(byte);
            }
            else {
                buffer.writeCharCode(properties._PERCENT);
                buffer.writeCharCode(new core.DartString(properties._hexDigits).codeUnitAt(byte >> 4));
                buffer.writeCharCode(new core.DartString(properties._hexDigits).codeUnitAt(byte & 15));
            }
        }
        if ((byteOr & ~255) != 0) {
            for (let i = 0; i < bytes.length; i++) {
                let byte = bytes[i];
                if (byte < 0 || byte > 255) {
                    throw new core.ArgumentError.value(byte, "non-byte value");
                }
            }
        }
    }
    toString() {
        return (this._separatorIndices[0] == UriData_1._noScheme) ? `data:${this._text}` : this._text;
    }
};
UriData._noScheme = -1;
UriData._tokenCharTable = new core.DartList.literal(0, 0, 27858, 1023, 65534, 51199, 65535, 32767);
UriData._uricTable = _Uri._queryCharTable;
UriData._base64Table = new core.DartList.literal(0, 0, 34816, 1023, 65534, 2047, 65534, 2047);
__decorate([
    namedConstructor
], UriData.prototype, "_", null);
__decorate([
    namedFactory
], UriData, "_fromString", null);
__decorate([
    namedFactory
], UriData, "_fromBytes", null);
__decorate([
    namedFactory
], UriData, "_fromUri", null);
UriData = UriData_1 = __decorate([
    DartClass
], UriData);
export { UriData };
export var _createTables = () => {
    let stateCount = 22;
    let schemeOrPath = 1;
    let authOrPath = 2;
    let authOrPathSlash = 3;
    let uinfoOrHost0 = 4;
    let uinfoOrHost = 5;
    let uinfoOrPort0 = 6;
    let uinfoOrPort = 7;
    let ipv6Host = 8;
    let relPathSeg = 9;
    let pathSeg = 10;
    let path = 11;
    let query = 12;
    let fragment = 13;
    let schemeOrPathDot = 14;
    let schemeOrPathDot2 = 15;
    let relPathSegDot = 16;
    let relPathSegDot2 = 17;
    let pathSegDot = 18;
    let pathSegDot2 = 19;
    let scheme0 = properties._schemeStart;
    let scheme = 21;
    let schemeEnd = properties._schemeEndIndex << 5;
    let hostStart = properties._hostStartIndex << 5;
    let portStart = properties._portStartIndex << 5;
    let pathStart = properties._pathStartIndex << 5;
    let queryStart = properties._queryStartIndex << 5;
    let fragmentStart = properties._fragmentStartIndex << 5;
    let notSimple = properties._notSimpleIndex << 5;
    let unreserved = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~";
    let subDelims = "!$&'()*+,;=";
    let pchar = `${unreserved}${subDelims}`;
    let tables = new core.DartList.generate(stateCount, (_) => {
        return new typed_data.Uint8List(96);
    });
    var build = (state, defaultTransition) => {
        return ((_) => {
            {
                _.fillRange(0, 96, defaultTransition);
                return _;
            }
        })(tables[state]);
    };
    var setChars = (target, chars, transition) => {
        for (let i = 0; i < chars.length; i++) {
            let char = new core.DartString(chars).codeUnitAt(i);
            op(Op.INDEX_ASSIGN, target, char ^ 96, transition);
        }
    };
    var setRange = (target, range, transition) => {
        for (let i = new core.DartString(range).codeUnitAt(0), n = new core.DartString(range).codeUnitAt(1); i <= n; i++) {
            op(Op.INDEX_ASSIGN, target, i ^ 96, transition);
        }
    };
    let b;
    b = build(properties._uriStart, schemeOrPath | notSimple);
    setChars(b, pchar, schemeOrPath);
    setChars(b, ".", schemeOrPathDot);
    setChars(b, ":", authOrPath | schemeEnd);
    setChars(b, "/", authOrPathSlash);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(schemeOrPathDot, schemeOrPath | notSimple);
    setChars(b, pchar, schemeOrPath);
    setChars(b, ".", schemeOrPathDot2);
    setChars(b, ':', authOrPath | schemeEnd);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(schemeOrPathDot2, schemeOrPath | notSimple);
    setChars(b, pchar, schemeOrPath);
    setChars(b, "%", schemeOrPath | notSimple);
    setChars(b, ':', authOrPath | schemeEnd);
    setChars(b, "/", relPathSeg);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(schemeOrPath, schemeOrPath | notSimple);
    setChars(b, pchar, schemeOrPath);
    setChars(b, ':', authOrPath | schemeEnd);
    setChars(b, "/", pathSeg);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(authOrPath, path | notSimple);
    setChars(b, pchar, path | pathStart);
    setChars(b, "/", authOrPathSlash | pathStart);
    setChars(b, ".", pathSegDot | pathStart);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(authOrPathSlash, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, "/", uinfoOrHost0 | hostStart);
    setChars(b, ".", pathSegDot);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(uinfoOrHost0, uinfoOrHost | notSimple);
    setChars(b, pchar, uinfoOrHost);
    setRange(b, "AZ", uinfoOrHost | notSimple);
    setChars(b, ":", uinfoOrPort0 | portStart);
    setChars(b, "@", uinfoOrHost0 | hostStart);
    setChars(b, "[", ipv6Host | notSimple);
    setChars(b, "/", pathSeg | pathStart);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(uinfoOrHost, uinfoOrHost | notSimple);
    setChars(b, pchar, uinfoOrHost);
    setRange(b, "AZ", uinfoOrHost | notSimple);
    setChars(b, ":", uinfoOrPort0 | portStart);
    setChars(b, "@", uinfoOrHost0 | hostStart);
    setChars(b, "/", pathSeg | pathStart);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(uinfoOrPort0, uinfoOrPort | notSimple);
    setRange(b, "19", uinfoOrPort);
    setChars(b, "@", uinfoOrHost0 | hostStart);
    setChars(b, "/", pathSeg | pathStart);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(uinfoOrPort, uinfoOrPort | notSimple);
    setRange(b, "09", uinfoOrPort);
    setChars(b, "@", uinfoOrHost0 | hostStart);
    setChars(b, "/", pathSeg | pathStart);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(ipv6Host, ipv6Host);
    setChars(b, "]", uinfoOrHost);
    b = build(relPathSeg, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, ".", relPathSegDot);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(relPathSegDot, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, ".", relPathSegDot2);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(relPathSegDot2, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, "/", relPathSeg);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(pathSeg, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, ".", pathSegDot);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(pathSegDot, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, ".", pathSegDot2);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(pathSegDot2, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, "/", pathSeg | notSimple);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(path, path | notSimple);
    setChars(b, pchar, path);
    setChars(b, "/", pathSeg);
    setChars(b, "?", query | queryStart);
    setChars(b, "#", fragment | fragmentStart);
    b = build(query, query | notSimple);
    setChars(b, pchar, query);
    setChars(b, "?", query);
    setChars(b, "#", fragment | fragmentStart);
    b = build(fragment, fragment | notSimple);
    setChars(b, pchar, fragment);
    setChars(b, "?", fragment);
    b = build(scheme0, scheme | notSimple);
    setRange(b, "az", scheme);
    b = build(scheme, scheme | notSimple);
    setRange(b, "az", scheme);
    setRange(b, "09", scheme);
    setChars(b, "+-.", scheme);
    return tables;
};
export var _scan = (uri, start, end, state, indices) => {
    let tables = properties._scannerTables;
    /* TODO (AssertStatementImpl) : assert (end <= uri.length); */
    ;
    for (let i = start; i < end; i++) {
        let table = tables[state];
        let char = new core.DartString(uri).codeUnitAt(i) ^ 96;
        if (char > 95)
            char = 31;
        let transition = op(Op.INDEX, table, char);
        state = transition & 31;
        indices[transition >> 5] = i;
    }
    return state;
};
let _SimpleUri = _SimpleUri_1 = class _SimpleUri {
    constructor(_uri, _schemeEnd, _hostStart, _portStart, _pathStart, _queryStart, _fragmentStart, _schemeCache) {
    }
    _SimpleUri(_uri, _schemeEnd, _hostStart, _portStart, _pathStart, _queryStart, _fragmentStart, _schemeCache) {
        this._uri = _uri;
        this._schemeEnd = _schemeEnd;
        this._hostStart = _hostStart;
        this._portStart = _portStart;
        this._pathStart = _pathStart;
        this._queryStart = _queryStart;
        this._fragmentStart = _fragmentStart;
        this._schemeCache = _schemeCache;
    }
    get hasScheme() {
        return this._schemeEnd > 0;
    }
    get hasAuthority() {
        return this._hostStart > 0;
    }
    get hasUserInfo() {
        return this._hostStart > this._schemeEnd + 4;
    }
    get hasPort() {
        return this._hostStart > 0 && this._portStart + 1 < this._pathStart;
    }
    get hasQuery() {
        return this._queryStart < this._fragmentStart;
    }
    get hasFragment() {
        return this._fragmentStart < this._uri.length;
    }
    get _isFile() {
        return this._schemeEnd == 4 && this._uri.startsWith("file");
    }
    get _isHttp() {
        return this._schemeEnd == 4 && this._uri.startsWith("http");
    }
    get _isHttps() {
        return this._schemeEnd == 5 && this._uri.startsWith("https");
    }
    get _isPackage() {
        return this._schemeEnd == 7 && this._uri.startsWith("package");
    }
    _isScheme(scheme) {
        return this._schemeEnd == scheme.length && this._uri.startsWith(scheme);
    }
    get hasAbsolutePath() {
        return this._uri.startsWith("/", this._pathStart);
    }
    get hasEmptyPath() {
        return this._pathStart == this._queryStart;
    }
    get isAbsolute() {
        return this.hasScheme && !this.hasFragment;
    }
    isScheme(scheme) {
        if (scheme == null || new core.DartString(scheme).isEmpty)
            return this._schemeEnd < 0;
        if (scheme.length != this._schemeEnd)
            return false;
        return _Uri._compareScheme(scheme, this._uri);
    }
    get scheme() {
        if (this._schemeEnd <= 0)
            return "";
        if (this._schemeCache != null)
            return this._schemeCache;
        if (this._isHttp) {
            this._schemeCache = "http";
        }
        else if (this._isHttps) {
            this._schemeCache = "https";
        }
        else if (this._isFile) {
            this._schemeCache = "file";
        }
        else if (this._isPackage) {
            this._schemeCache = "package";
        }
        else {
            this._schemeCache = this._uri.substring(0, this._schemeEnd);
        }
        return this._schemeCache;
    }
    get authority() {
        return this._hostStart > 0 ? this._uri.substring(this._schemeEnd + 3, this._pathStart) : "";
    }
    get userInfo() {
        return (this._hostStart > this._schemeEnd + 3) ? this._uri.substring(this._schemeEnd + 3, this._hostStart - 1) : "";
    }
    get host() {
        return this._hostStart > 0 ? this._uri.substring(this._hostStart, this._portStart) : "";
    }
    get port() {
        if (this.hasPort)
            return core.DartNumber.parse(this._uri.substring(this._portStart + 1, this._pathStart));
        if (this._isHttp)
            return 80;
        if (this._isHttps)
            return 443;
        return 0;
    }
    get path() {
        return this._uri.substring(this._pathStart, this._queryStart);
    }
    get query() {
        return (this._queryStart < this._fragmentStart) ? this._uri.substring(this._queryStart + 1, this._fragmentStart) : "";
    }
    get fragment() {
        return (this._fragmentStart < this._uri.length) ? this._uri.substring(this._fragmentStart + 1) : "";
    }
    get origin() {
        let isHttp = this._isHttp;
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
            return this._uri.substring(0, this._pathStart);
        }
        return this._uri.substring(0, this._schemeEnd + 3) + this._uri.substring(this._hostStart, this._pathStart);
    }
    get pathSegments() {
        let start = this._pathStart;
        let end = this._queryStart;
        if (this._uri.startsWith("/", start))
            start++;
        if (start == end)
            return new core.DartList.literal();
        let parts = new core.DartList.literal();
        for (let i = start; i < end; i++) {
            let char = new core.DartString(this._uri).codeUnitAt(i);
            if (char == properties._SLASH) {
                parts.add(this._uri.substring(start, i));
                start = i + 1;
            }
        }
        parts.add(this._uri.substring(start, end));
        return new core.DartList.unmodifiable(parts);
    }
    get queryParameters() {
        if (!this.hasQuery)
            return new core.DartMap.literal([]);
        return new core.DartUnmodifiableMapView(Uri.splitQueryString(this.query));
    }
    get queryParametersAll() {
        if (!this.hasQuery)
            return new core.DartMap.literal([]);
        let queryParameterLists = _Uri._splitQueryStringAll(this.query);
        for (let key of queryParameterLists.keys) {
            queryParameterLists.set(key, new core.DartList.unmodifiable(queryParameterLists.get(key)));
        }
        return new core.DartMap.unmodifiable(queryParameterLists);
    }
    _isPort(port) {
        let portDigitStart = this._portStart + 1;
        return portDigitStart + port.length == this._pathStart && this._uri.startsWith(port, portDigitStart);
    }
    normalizePath() {
        return this;
    }
    removeFragment() {
        if (!this.hasFragment)
            return this;
        return new _SimpleUri_1(this._uri.substring(0, this._fragmentStart), this._schemeEnd, this._hostStart, this._portStart, this._pathStart, this._queryStart, this._fragmentStart, this._schemeCache);
    }
    replace(_namedArguments) {
        let { scheme, userInfo, host, port, path, pathSegments, query, queryParameters, fragment } = Object.assign({}, _namedArguments);
        let schemeChanged = false;
        if (scheme != null) {
            scheme = _Uri._makeScheme(scheme, 0, scheme.length);
            schemeChanged = !this._isScheme(scheme);
        }
        else {
            scheme = this.scheme;
        }
        let isFile = (scheme == "file");
        if (userInfo != null) {
            userInfo = _Uri._makeUserInfo(userInfo, 0, userInfo.length);
        }
        else if (this._hostStart > 0) {
            userInfo = this._uri.substring(this._schemeEnd + 3, this._hostStart);
        }
        else {
            userInfo = "";
        }
        if (port != null) {
            port = _Uri._makePort(port, scheme);
        }
        else {
            port = this.hasPort ? this.port : null;
            if (schemeChanged) {
                port = _Uri._makePort(port, scheme);
            }
        }
        if (host != null) {
            host = _Uri._makeHost(host, 0, host.length, false);
        }
        else if (this._hostStart > 0) {
            host = this._uri.substring(this._hostStart, this._portStart);
        }
        else if (new core.DartString(userInfo).isNotEmpty || port != null || isFile) {
            host = "";
        }
        let hasAuthority = host != null;
        if (path != null || pathSegments != null) {
            path = _Uri._makePath(path, 0, _stringOrNullLength(path), pathSegments, scheme, hasAuthority);
        }
        else {
            path = this._uri.substring(this._pathStart, this._queryStart);
            if ((isFile || (hasAuthority && !new core.DartString(path).isEmpty)) && !path.startsWith('/')) {
                path = "/" + path;
            }
        }
        if (query != null || queryParameters != null) {
            query = _Uri._makeQuery(query, 0, _stringOrNullLength(query), queryParameters);
        }
        else if (this._queryStart < this._fragmentStart) {
            query = this._uri.substring(this._queryStart + 1, this._fragmentStart);
        }
        if (fragment != null) {
            fragment = _Uri._makeFragment(fragment, 0, fragment.length);
        }
        else if (this._fragmentStart < this._uri.length) {
            fragment = this._uri.substring(this._fragmentStart + 1);
        }
        return new _Uri._internal(scheme, userInfo, host, port, path, query, fragment);
    }
    resolve(reference) {
        return this.resolveUri(Uri.parse(reference));
    }
    resolveUri(reference) {
        if (is(reference, _SimpleUri_1)) {
            return this._simpleMerge(this, reference);
        }
        return this._toNonSimple().resolveUri(reference);
    }
    _simpleMerge(base, ref) {
        if (ref.hasScheme)
            return ref;
        if (ref.hasAuthority) {
            if (!base.hasScheme)
                return ref;
            let isSimple = true;
            if (base._isFile) {
                isSimple = !ref.hasEmptyPath;
            }
            else if (base._isHttp) {
                isSimple = !ref._isPort("80");
            }
            else if (base._isHttps) {
                isSimple = !ref._isPort("443");
            }
            if (isSimple) {
                let delta = base._schemeEnd + 1;
                let newUri = base._uri.substring(0, base._schemeEnd + 1) + ref._uri.substring(ref._schemeEnd + 1);
                return new _SimpleUri_1(newUri, base._schemeEnd, ref._hostStart + delta, ref._portStart + delta, ref._pathStart + delta, ref._queryStart + delta, ref._fragmentStart + delta, base._schemeCache);
            }
            else {
                return this._toNonSimple().resolveUri(ref);
            }
        }
        if (ref.hasEmptyPath) {
            if (ref.hasQuery) {
                let delta = base._queryStart - ref._queryStart;
                let newUri = base._uri.substring(0, base._queryStart) + ref._uri.substring(ref._queryStart);
                return new _SimpleUri_1(newUri, base._schemeEnd, base._hostStart, base._portStart, base._pathStart, ref._queryStart + delta, ref._fragmentStart + delta, base._schemeCache);
            }
            if (ref.hasFragment) {
                let delta = base._fragmentStart - ref._fragmentStart;
                let newUri = base._uri.substring(0, base._fragmentStart) + ref._uri.substring(ref._fragmentStart);
                return new _SimpleUri_1(newUri, base._schemeEnd, base._hostStart, base._portStart, base._pathStart, base._queryStart, ref._fragmentStart + delta, base._schemeCache);
            }
            return base.removeFragment();
        }
        if (ref.hasAbsolutePath) {
            let delta = base._pathStart - ref._pathStart;
            let newUri = base._uri.substring(0, base._pathStart) + ref._uri.substring(ref._pathStart);
            return new _SimpleUri_1(newUri, base._schemeEnd, base._hostStart, base._portStart, base._pathStart, ref._queryStart + delta, ref._fragmentStart + delta, base._schemeCache);
        }
        if (base.hasEmptyPath && base.hasAuthority) {
            let refStart = ref._pathStart;
            while (ref._uri.startsWith("../", refStart)) {
                refStart += 3;
            }
            let delta = base._pathStart - refStart + 1;
            let newUri = `${base._uri.substring(0, base._pathStart)}/` + `${ref._uri.substring(refStart)}`;
            return new _SimpleUri_1(newUri, base._schemeEnd, base._hostStart, base._portStart, base._pathStart, ref._queryStart + delta, ref._fragmentStart + delta, base._schemeCache);
        }
        let baseUri = base._uri;
        let refUri = ref._uri;
        let baseStart = base._pathStart;
        let baseEnd = base._queryStart;
        while (baseUri.startsWith("../", baseStart))
            baseStart += 3;
        let refStart = ref._pathStart;
        let refEnd = ref._queryStart;
        let backCount = 0;
        while (refStart + 3 <= refEnd && refUri.startsWith("../", refStart)) {
            refStart += 3;
            backCount += 1;
        }
        let insert = "";
        while (baseEnd > baseStart) {
            baseEnd--;
            let char = new core.DartString(baseUri).codeUnitAt(baseEnd);
            if (char == properties._SLASH) {
                insert = "/";
                if (backCount == 0)
                    break;
                backCount--;
            }
        }
        if (baseEnd == baseStart && !base.hasScheme && !base.hasAbsolutePath) {
            insert = "";
            refStart -= backCount * 3;
        }
        let delta = baseEnd - refStart + insert.length;
        let newUri = `${base._uri.substring(0, baseEnd)}${insert}` + `${ref._uri.substring(refStart)}`;
        return new _SimpleUri_1(newUri, base._schemeEnd, base._hostStart, base._portStart, base._pathStart, ref._queryStart + delta, ref._fragmentStart + delta, base._schemeCache);
    }
    toFilePath(_namedArguments) {
        let { windows } = Object.assign({}, _namedArguments);
        if (this._schemeEnd >= 0 && !this._isFile) {
            throw new core.UnsupportedError(`Cannot extract a file path from a ${this.scheme} URI`);
        }
        if (this._queryStart < this._uri.length) {
            if (this._queryStart < this._fragmentStart) {
                throw new core.UnsupportedError("Cannot extract a file path from a URI with a query component");
            }
            throw new core.UnsupportedError("Cannot extract a file path from a URI with a fragment component");
        }
        if (windows == null)
            windows = _Uri._isWindows;
        return windows ? _Uri._toWindowsFilePath(this) : this._toFilePath();
    }
    _toFilePath() {
        if (this._hostStart < this._portStart) {
            throw new core.UnsupportedError("Cannot extract a non-Windows file path from a file URI " + "with an authority");
        }
        return this.path;
    }
    get data() {
        /* TODO (AssertStatementImpl) : assert (scheme != "data"); */
        ;
        return null;
    }
    get hashCode() {
        return this._hashCodeCache = this._hashCodeCache || new core.DartString(this._uri).hashCode;
    }
    [OperatorMethods.EQUALS](other) {
        if (core.identical(this, other))
            return true;
        if (is(other, Uri))
            return this._uri == other.toString();
        return false;
    }
    _toNonSimple() {
        return new _Uri._internal(this.scheme, this.userInfo, this.hasAuthority ? this.host : null, this.hasPort ? this.port : null, this.path, this.hasQuery ? this.query : null, this.hasFragment ? this.fragment : null);
    }
    toString() {
        return this._uri;
    }
};
__decorate([
    defaultConstructor
], _SimpleUri.prototype, "_SimpleUri", null);
_SimpleUri = _SimpleUri_1 = __decorate([
    DartClass,
    Implements(Uri)
], _SimpleUri);
export { _SimpleUri };
let _DataUri = class _DataUri extends _Uri {
    constructor(_data, path, query) {
        // @ts-ignore
        super();
    }
    _DataUri(_data, path, query) {
        super._internal("data", null, null, null, path, query, null);
        this._data = _data;
    }
    get data() {
        return this._data;
    }
};
__decorate([
    defaultConstructor
], _DataUri.prototype, "_DataUri", null);
_DataUri = __decorate([
    DartClass
], _DataUri);
export { _DataUri };
export var _startsWithData = (text, start) => {
    let delta = (new core.DartString(text).codeUnitAt(start + 4) ^ properties._COLON) * 3;
    delta = new core.DartString(text).codeUnitAt(start) ^ 100;
    delta = new core.DartString(text).codeUnitAt(start + 1) ^ 97;
    delta = new core.DartString(text).codeUnitAt(start + 2) ^ 116;
    delta = new core.DartString(text).codeUnitAt(start + 3) ^ 97;
    return delta;
};
export var _stringOrNullLength = (s) => {
    return (s == null) ? 0 : s.length;
};
export class properties {
}
properties._SPACE = 32;
properties._PERCENT = 37;
properties._AMPERSAND = 38;
properties._PLUS = 43;
properties._DOT = 46;
properties._SLASH = 47;
properties._COLON = 58;
properties._EQUALS = 61;
properties._UPPER_CASE_A = 65;
properties._UPPER_CASE_Z = 90;
properties._LEFT_BRACKET = 91;
properties._BACKSLASH = 92;
properties._RIGHT_BRACKET = 93;
properties._LOWER_CASE_A = 97;
properties._LOWER_CASE_F = 102;
properties._LOWER_CASE_Z = 122;
properties._hexDigits = "0123456789ABCDEF";
properties._schemeEndIndex = 1;
properties._hostStartIndex = 2;
properties._portStartIndex = 3;
properties._pathStartIndex = 4;
properties._queryStartIndex = 5;
properties._fragmentStartIndex = 6;
properties._notSimpleIndex = 7;
properties._uriStart = 0;
properties._nonSimpleEndStates = 14;
properties._schemeStart = 20;
properties._scannerTables = _createTables();
//export const properties : properties = new properties();
//# sourceMappingURL=uri.js.map