export function callMethod(o, method, args) {
    return o[method].apply(o, args);
    //JS('Object|Null', '#[#].apply(#, #)', o, method, o, args);
}
//# sourceMappingURL=js_util.js.map