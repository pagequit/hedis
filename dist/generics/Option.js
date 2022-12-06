"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOrElse = exports.resolveOr = exports.resolve = exports.isSome = exports.isNone = void 0;
function isNone(value) {
    return value === null || value === undefined;
}
exports.isNone = isNone;
function isSome(value) {
    return !isNone(value);
}
exports.isSome = isSome;
class Option {
    constructor(value) {
        this.value = value;
    }
    and(optb) {
        return new Option(isNone(this.value)
            ? this.value
            : optb.value);
    }
    andThen(callback) {
        return isSome(this.value)
            ? callback(this.value)
            : new Option(this.value);
    }
    expect(msg) {
        if (isNone(this.value)) {
            throw new Error(msg);
        }
        return this.value;
    }
    filter(predicate) {
        return this.map(predicate).and(new Option(this.value)); // <-- :thinking:
    }
    flatten() {
        // TOOD
    }
    getOrInsert() {
        // TOOD
    }
    getOrInsertWith() {
        // TOOD
    }
    insert() {
        // TOOD
    }
    isNone() {
        return isNone.call(this, this.value);
    }
    isSome() {
        return isSome.call(this, this.value);
    }
    isSomeAnd() {
        // TOOD
    }
    map(callback) {
        return new Option(isNone(this.value)
            ? this.value
            : callback(this.value));
    }
    mapOr() {
        // TOOD
    }
    mapOrElse() {
        // TOOD
    }
    okOr() {
        // TOOD
    }
    okOrElse() {
        // TOOD
    }
    or(optb) {
        return new Option(isSome(this.value)
            ? this.value
            : optb.value);
    }
    orElse() {
        // TOOD
    }
    replace() {
        // TOOD
    }
    take() {
        // TOOD
    }
    transpose() {
        // TOOD
    }
    unwrap() {
        return this.expect('Cannot unwrap a None.');
    }
    unwrapOr(defaultValue) {
        return isSome(this.value)
            ? this.value
            : defaultValue;
    }
    unwrapOrElse(callback) {
        return isSome(this.value)
            ? this.value
            : callback();
    }
    unwrapUnchecked() {
        return this.value;
    }
    unzip() {
        // TOOD
    }
    xor(optb) {
        return new Option(isNone(this.value)
            ? optb.value
            : isNone(optb.value)
                ? this.value
                : null);
    }
    zip() {
        // TOOD
    }
    zipWith() {
        // TOOD
    }
}
exports.default = Option;
function resolve() {
    // TOOD
}
exports.resolve = resolve;
function resolveOr() {
    // TOOD
}
exports.resolveOr = resolveOr;
function resolveOrElse() {
    // TOOD
}
exports.resolveOrElse = resolveOrElse;
//# sourceMappingURL=Option.js.map