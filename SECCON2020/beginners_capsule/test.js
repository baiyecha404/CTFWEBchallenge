var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _flag;
var Flag = /** @class */ (function () {
    function Flag(flag) {
        _flag.set(this, void 0);
        __classPrivateFieldSet(this, _flag, flag);
    }
    return Flag;
}());
_flag = new WeakMap();
var flag = new Flag("flag{123}");
console.log(flag);
