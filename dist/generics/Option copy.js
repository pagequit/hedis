"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSome = exports.isNone = void 0;
function isNone(value) {
    return value === null || value === undefined;
}
exports.isNone = isNone;
function isSome(value) {
    return !this.isNone(value);
}
exports.isSome = isSome;
class Option {
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
exports.default = Option;
//# sourceMappingURL=Option%20copy.js.map