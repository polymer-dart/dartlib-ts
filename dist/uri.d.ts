import { OperatorMethods } from "./utils";
import * as core from "./core";
export declare class Uri {
    static readonly base: Uri;
    constructor(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    });
    static _Uri(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    }): Uri;
    static _http(authority: string, unencodedPath: string, queryParameters?: core.DartMap<string, string>): Uri;
    static http: new (authority: string, unencodedPath: string, queryParameters: core.DartMap<string, string>) => Uri;
    static _https(authority: string, unencodedPath: string, queryParameters?: core.DartMap<string, string>): Uri;
    static https: new (authority: string, unencodedPath: string, queryParameters: core.DartMap<string, string>) => Uri;
    static _file(path: string, _namedArguments?: {
        windows?: boolean;
    }): Uri;
    static file: new (path: string, _namedArguments?: {
        windows?: boolean;
    }) => Uri;
    static _directory(path: string, _namedArguments?: {
        windows?: boolean;
    }): Uri;
    static directory: new (path: string, _namedArguments?: {
        windows?: boolean;
    }) => Uri;
    static _dataFromString(content: string, _namedArguments?: {
        mimeType?: string;
        encoding?: any;
        parameters?: core.DartMap<string, string>;
        base64?: boolean;
    }): Uri;
    static dataFromString: new (content: string, _namedArguments?: {
        mimeType?: string;
        encoding?: any;
        parameters?: core.DartMap<string, string>;
        base64?: boolean;
    }) => Uri;
    static _dataFromBytes(bytes: core.DartList<number>, _namedArguments?: {
        mimeType?: any;
        parameters?: core.DartMap<string, string>;
        percentEncoded?: any;
    }): Uri;
    static dataFromBytes: new (bytes: core.DartList<number>, _namedArguments?: {
        mimeType?: any;
        parameters?: core.DartMap<string, string>;
        percentEncoded?: any;
    }) => Uri;
    readonly scheme: string;
    readonly authority: string;
    readonly userInfo: string;
    readonly host: string;
    readonly port: number;
    readonly path: string;
    readonly query: string;
    readonly fragment: string;
    readonly pathSegments: core.DartList<string>;
    readonly queryParameters: core.DartMap<string, string>;
    readonly queryParametersAll: core.DartMap<string, core.DartList<string>>;
    readonly isAbsolute: boolean;
    readonly hasScheme: boolean;
    readonly hasAuthority: boolean;
    readonly hasPort: boolean;
    readonly hasQuery: boolean;
    readonly hasFragment: boolean;
    readonly hasEmptyPath: boolean;
    readonly hasAbsolutePath: boolean;
    readonly origin: string;
    isScheme(scheme: string): boolean;
    toFilePath(_namedArguments?: {
        windows?: boolean;
    }): string;
    readonly data: UriData;
    readonly hashCode: number;
    [OperatorMethods.EQUALS](other: core.DartObject): boolean;
    toString(): string;
    replace(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    }): Uri;
    removeFragment(): Uri;
    resolve(reference: string): Uri;
    resolveUri(reference: Uri): Uri;
    normalizePath(): Uri;
    static parse(uri: string, start?: number, end?: number): Uri;
    static encodeComponent(component: string): string;
    static encodeQueryComponent(component: string, _namedArguments?: {
        encoding?: any;
    }): string;
    static decodeComponent(encodedComponent: string): string;
    static decodeQueryComponent(encodedComponent: string, _namedArguments?: {
        encoding?: any;
    }): string;
    static encodeFull(uri: string): string;
    static decodeFull(uri: string): string;
    static splitQueryString(query: string, _namedArguments?: {
        encoding?: any;
    }): core.DartMap<string, string>;
    static parseIPv4Address(host: string): core.DartList<number>;
    static _parseIPv4Address(host: string, start: number, end: number): core.DartList<number>;
    static parseIPv6Address(host: string, start?: number, end?: number): core.DartList<number>;
}
export declare class _Uri extends Uri {
    scheme: string;
    _userInfo: string;
    _host: string;
    _port: number;
    path: string;
    _query: string;
    _fragment: string;
    _pathSegments: core.DartList<string>;
    _text: string;
    _hashCodeCache: number;
    _queryParameters: core.DartMap<string, string>;
    _queryParameterLists: core.DartMap<string, core.DartList<string>>;
    _internal(scheme: string, _userInfo: string, _host: string, _port: number, path: string, _query: string, _fragment: string): void;
    static _internal: new (scheme: string, _userInfo: string, _host: string, _port: number, path: string, _query: string, _fragment: string) => _Uri;
    static _notSimple(uri: string, start: number, end: number, schemeEnd: number, hostStart: number, portStart: number, pathStart: number, queryStart: number, fragmentStart: number, scheme: string): _Uri;
    static notSimple: new (uri: string, start: number, end: number, schemeEnd: number, hostStart: number, portStart: number, pathStart: number, queryStart: number, fragmentStart: number, scheme: string) => _Uri;
    constructor(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    });
    static __Uri(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    }): _Uri;
    static _http(authority: string, unencodedPath: string, queryParameters?: core.DartMap<string, string>): _Uri;
    static http: new (authority: string, unencodedPath: string, queryParameters: core.DartMap<string, string>) => _Uri;
    static _https(authority: string, unencodedPath: string, queryParameters?: core.DartMap<string, string>): _Uri;
    static https: new (authority: string, unencodedPath: string, queryParameters: core.DartMap<string, string>) => _Uri;
    readonly authority: string;
    readonly userInfo: string;
    readonly host: string;
    readonly port: number;
    static _defaultPort(scheme: string): number;
    readonly query: string;
    readonly fragment: string;
    isScheme(scheme: string): boolean;
    static _compareScheme(scheme: string, uri: string): boolean;
    static _fail(uri: string, index: number, message: string): void;
    static _makeHttpUri(scheme: string, authority: string, unencodedPath: string, queryParameters: core.DartMap<string, string>): Uri;
    static _file(path: string, _namedArguments?: {
        windows?: boolean;
    }): _Uri;
    static file: new (path: string, _namedArguments?: {
        windows?: boolean;
    }) => _Uri;
    static _directory(path: string, _namedArguments?: {
        windows?: boolean;
    }): _Uri;
    static directory: new (path: string, _namedArguments?: {
        windows?: boolean;
    }) => _Uri;
    static readonly _isWindows: boolean;
    static _checkNonWindowsPathReservedCharacters(segments: core.DartList<string>, argumentError: boolean): void;
    static _checkWindowsPathReservedCharacters(segments: core.DartList<string>, argumentError: boolean, firstSegment?: number): void;
    static _checkWindowsDriveLetter(charCode: number, argumentError: boolean): void;
    static _makeFileUri(path: string, slashTerminated: boolean): Uri;
    static _makeWindowsFileUrl(path: string, slashTerminated: boolean): Uri;
    replace(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    }): Uri;
    removeFragment(): Uri;
    readonly pathSegments: core.DartList<string>;
    readonly queryParameters: core.DartMap<string, string>;
    readonly queryParametersAll: core.DartMap<string, core.DartList<string>>;
    normalizePath(): Uri;
    static _makePort(port: number, scheme: string): number;
    static _makeHost(host: string, start: number, end: number, strictIPv6: boolean): string;
    static _isRegNameChar(char: number): boolean;
    static _normalizeRegName(host: string, start: number, end: number): string;
    static _makeScheme(scheme: string, start: number, end: number): string;
    static _canonicalizeScheme(scheme: string): string;
    static _makeUserInfo(userInfo: string, start: number, end: number): string;
    static _makePath(path: string, start: number, end: number, pathSegments: core.DartIterable<string>, scheme: string, hasAuthority: boolean): string;
    static _normalizePath(path: string, scheme: string, hasAuthority: boolean): string;
    static _makeQuery(query: string, start: number, end: number, queryParameters: core.DartMap<string, any>): string;
    static _makeFragment(fragment: string, start: number, end: number): string;
    static _normalizeEscape(source: string, index: number, lowerCase: boolean): string;
    static _escapeChar(char: number): string;
    static _normalizeOrSubstring(component: string, start: number, end: number, charTable: core.DartList<number>): string;
    static _normalize(component: string, start: number, end: number, charTable: core.DartList<number>, _namedArguments?: {
        escapeDelimiters?: boolean;
    }): string;
    static _isSchemeCharacter(ch: number): boolean;
    static _isGeneralDelimiter(ch: number): boolean;
    readonly isAbsolute: boolean;
    _mergePaths(base: string, reference: string): string;
    static _mayContainDotSegments(path: string): boolean;
    static _removeDotSegments(path: string): string;
    static _normalizeRelativePath(path: string, allowScheme: boolean): string;
    static _escapeScheme(path: string): string;
    resolve(reference: string): Uri;
    resolveUri(reference: Uri): Uri;
    readonly hasScheme: boolean;
    readonly hasAuthority: boolean;
    readonly hasPort: boolean;
    readonly hasQuery: boolean;
    readonly hasFragment: boolean;
    readonly hasEmptyPath: boolean;
    readonly hasAbsolutePath: boolean;
    readonly origin: string;
    toFilePath(_namedArguments?: {
        windows?: boolean;
    }): string;
    _toFilePath(): string;
    static _toWindowsFilePath(uri: Uri): string;
    readonly _isPathAbsolute: boolean;
    _writeAuthority(ss: core.DartStringSink): void;
    readonly data: UriData;
    toString(): string;
    _initializeText(): string;
    [OperatorMethods.EQUALS](other: any): boolean;
    readonly hashCode: number;
    static _createList(): core.DartList<any>;
    static _splitQueryStringAll(query: string, _namedArguments?: {
        encoding?: any;
    }): core.DartMap<any, any>;
    static _uriEncode(canonicalTable: core.DartList<number>, text: string, encoding: any, spaceToPlus: boolean): string;
    static _hexCharPairToByte(s: string, pos: number): number;
    static _uriDecode(text: string, start: number, end: number, encoding: any, plusToSpace: boolean): string;
    static _isAlphabeticCharacter(codeUnit: number): boolean;
    static _isUnreservedChar(char: number): boolean;
    static _unreservedTable: core.DartList<number>;
    static _unreserved2396Table: core.DartList<number>;
    static _encodeFullTable: core.DartList<number>;
    static _schemeTable: core.DartList<number>;
    static _schemeLowerTable: core.DartList<number>;
    static _subDelimitersTable: core.DartList<number>;
    static _genDelimitersTable: core.DartList<number>;
    static _userinfoTable: core.DartList<number>;
    static _regNameTable: core.DartList<number>;
    static _pathCharTable: core.DartList<number>;
    static _pathCharOrSlashTable: core.DartList<number>;
    static _queryCharTable: core.DartList<number>;
}
export declare class UriData {
    static _noScheme: number;
    _text: string;
    _separatorIndices: core.DartList<number>;
    _uriCache: Uri;
    _(_text: string, _separatorIndices: core.DartList<number>, _uriCache: Uri): void;
    static _: new (_text: string, _separatorIndices: core.DartList<number>, _uriCache: Uri) => UriData;
    static _fromString(content: string, _namedArguments?: {
        mimeType?: string;
        encoding?: any;
        parameters?: core.DartMap<string, string>;
        base64?: boolean;
    }): UriData;
    static fromString: new (content: string, _namedArguments?: {
        mimeType?: string;
        encoding?: any;
        parameters?: core.DartMap<string, string>;
        base64?: boolean;
    }) => UriData;
    static _fromBytes(bytes: core.DartList<number>, _namedArguments?: {
        mimeType?: any;
        parameters?: core.DartMap<string, string>;
        percentEncoded?: any;
    }): UriData;
    static fromBytes: new (bytes: core.DartList<number>, _namedArguments?: {
        mimeType?: any;
        parameters?: core.DartMap<string, string>;
        percentEncoded?: any;
    }) => UriData;
    static _fromUri(uri: Uri): UriData;
    static fromUri: new (uri: Uri) => UriData;
    static _writeUri(mimeType: string, charsetName: string, parameters: core.DartMap<string, string>, buffer: core.DartStringBuffer, indices: core.DartList<any>): void;
    static _validateMimeType(mimeType: string): number;
    static parse(uri: string): UriData;
    readonly uri: Uri;
    readonly mimeType: string;
    readonly charset: string;
    readonly isBase64: boolean;
    readonly contentText: string;
    contentAsBytes(): core.DartList<number>;
    contentAsString(_namedArguments?: {
        encoding?: any;
    }): string;
    readonly parameters: core.DartMap<string, string>;
    static _parse(text: string, start: number, sourceUri: Uri): UriData;
    static _uriEncodeBytes(canonicalTable: core.DartList<number>, bytes: core.DartList<number>, buffer: core.DartStringSink): void;
    toString(): string;
    static _tokenCharTable: core.DartList<number>;
    static _uricTable: core.DartList<number>;
    static _base64Table: core.DartList<number>;
}
export declare var _createTables: () => core.DartList<any>;
export declare var _scan: (uri: string, start: number, end: number, state: number, indices: core.DartList<number>) => number;
export declare class _SimpleUri implements Uri {
    _uri: string;
    _schemeEnd: number;
    _hostStart: number;
    _portStart: number;
    _pathStart: number;
    _queryStart: number;
    _fragmentStart: number;
    _schemeCache: string;
    _hashCodeCache: number;
    constructor(_uri: string, _schemeEnd: number, _hostStart: number, _portStart: number, _pathStart: number, _queryStart: number, _fragmentStart: number, _schemeCache: string);
    _SimpleUri(_uri: string, _schemeEnd: number, _hostStart: number, _portStart: number, _pathStart: number, _queryStart: number, _fragmentStart: number, _schemeCache: string): void;
    readonly hasScheme: boolean;
    readonly hasAuthority: boolean;
    readonly hasUserInfo: boolean;
    readonly hasPort: boolean;
    readonly hasQuery: boolean;
    readonly hasFragment: boolean;
    readonly _isFile: boolean;
    readonly _isHttp: boolean;
    readonly _isHttps: boolean;
    readonly _isPackage: boolean;
    _isScheme(scheme: string): boolean;
    readonly hasAbsolutePath: boolean;
    readonly hasEmptyPath: boolean;
    readonly isAbsolute: boolean;
    isScheme(scheme: string): boolean;
    readonly scheme: string;
    readonly authority: string;
    readonly userInfo: string;
    readonly host: string;
    readonly port: number;
    readonly path: string;
    readonly query: string;
    readonly fragment: string;
    readonly origin: string;
    readonly pathSegments: core.DartList<string>;
    readonly queryParameters: core.DartMap<string, string>;
    readonly queryParametersAll: core.DartMap<string, core.DartList<string>>;
    _isPort(port: string): boolean;
    normalizePath(): Uri;
    removeFragment(): Uri;
    replace(_namedArguments?: {
        scheme?: string;
        userInfo?: string;
        host?: string;
        port?: number;
        path?: string;
        pathSegments?: core.DartIterable<string>;
        query?: string;
        queryParameters?: core.DartMap<string, any>;
        fragment?: string;
    }): Uri;
    resolve(reference: string): Uri;
    resolveUri(reference: Uri): Uri;
    _simpleMerge(base: _SimpleUri, ref: _SimpleUri): Uri;
    toFilePath(_namedArguments?: {
        windows?: boolean;
    }): string;
    _toFilePath(): string;
    readonly data: UriData;
    readonly hashCode: number;
    [OperatorMethods.EQUALS](other: core.DartObject): boolean;
    _toNonSimple(): Uri;
    toString(): string;
}
export declare class _DataUri extends _Uri {
    _data: UriData;
    constructor(_data: UriData, path: string, query: string);
    _DataUri(_data: UriData, path: string, query: string): void;
    readonly data: UriData;
}
export declare var _startsWithData: (text: string, start: number) => number;
export declare var _stringOrNullLength: (s: string) => number;
export declare class properties {
    static _SPACE: number;
    static _PERCENT: number;
    static _AMPERSAND: number;
    static _PLUS: number;
    static _DOT: number;
    static _SLASH: number;
    static _COLON: number;
    static _EQUALS: number;
    static _UPPER_CASE_A: number;
    static _UPPER_CASE_Z: number;
    static _LEFT_BRACKET: number;
    static _BACKSLASH: number;
    static _RIGHT_BRACKET: number;
    static _LOWER_CASE_A: number;
    static _LOWER_CASE_F: number;
    static _LOWER_CASE_Z: number;
    static _hexDigits: string;
    static _schemeEndIndex: number;
    static _hostStartIndex: number;
    static _portStartIndex: number;
    static _pathStartIndex: number;
    static _queryStartIndex: number;
    static _fragmentStartIndex: number;
    static _notSimpleIndex: number;
    static _uriStart: number;
    static _nonSimpleEndStates: number;
    static _schemeStart: number;
    static _scannerTables: core.DartList<any>;
}
