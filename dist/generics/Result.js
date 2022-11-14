"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOk = exports.isErr = void 0;
function isErr(value) {
    return value instanceof Error;
}
exports.isErr = isErr;
function isOk(value) {
    return !isErr(value);
}
exports.isOk = isOk;
class Result {
    constructor(value) {
        this.value = value;
    }
    isNone() {
        return isNone.call(this, this.value);
    }
    isSome() {
        return isSome.call(this, this.value);
    }
    unwrap() {
        if (isNone(this.value)) {
            throw new Error('Cannot unwrap a None.');
        }
        return this.value;
    }
    unwrapOr(defaultValue) {
        if (isNone(this.value)) {
            return defaultValue;
        }
        return this.value;
    }
    unwrapOrElse(callback) {
        if (isNone(this.value)) {
            return callback();
        }
        return this.value;
    }
}
exports.default = Result;
//# sourceMappingURL=Result.js.map