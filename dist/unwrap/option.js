"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Some = exports.None = exports.OptionType = void 0;
const result_1 = require("./result");
class Option {
    constructor(value, type) {
        this.value = value;
        this.discriminant = type;
    }
    *[Symbol.iterator]() {
        if (this.isSome()) {
            yield this;
        }
        return None();
    }
    and(option) {
        return this.isSome() ? option : None();
    }
    andThen(callback) {
        return this.isSome() ? callback(this.value) : None();
    }
    contains(value) {
        return this.isSome() && value === this.value;
    }
    expect(msg) {
        if (this.isNone()) {
            throw new Error(msg);
        }
        return this.value;
    }
    filter(predicate) {
        return (this.isSome() && predicate(this.value)) ? this : None();
    }
    flatten() {
        return this.andThen((value) => value);
    }
    getOrInsert(value) {
        this.value = this.isSome() ? this.value : value;
        this.discriminant = OptionType.Some;
        return this.value;
    }
    getOrInsertWith(callback) {
        this.value = this.isSome() ? this.value : callback();
        this.discriminant = OptionType.Some;
        return this.value;
    }
    insert(value) {
        this.value = value;
        this.discriminant = OptionType.Some;
        return this.value;
    }
    inspect(callback) {
        if (this.isSome()) {
            callback(this.value);
        }
        return this;
    }
    isNone() {
        return this.discriminant === OptionType.None;
    }
    isSome() {
        return this.discriminant === OptionType.Some;
    }
    isSomeAnd(predicate) {
        return this.isSome() && predicate(this.value);
    }
    iter() {
        return this[Symbol.iterator]();
    }
    map(callback) {
        return this.isSome() ? Some(callback(this.value)) : this;
    }
    mapOr(defaultValue, callback) {
        return this.isSome() ? callback(this.value) : defaultValue;
    }
    mapOrElse(defaultCallback, callback) {
        return this.isSome() ? callback(this.value) : defaultCallback();
    }
    okOr(err) {
        return this.isSome() ? (0, result_1.Ok)(this.value) : (0, result_1.Err)(err);
    }
    okOrElse(callback) {
        return this.isSome() ? (0, result_1.Ok)(this.value) : (0, result_1.Err)(callback());
    }
    or(option) {
        return this.isSome() ? this : option;
    }
    orElse(callback) {
        return this.isSome() ? this : callback();
    }
    replace(value) {
        const old = this.isSome() ? Some(this.value) : None();
        this.value = value;
        this.discriminant = OptionType.Some;
        return old;
    }
    take() {
        const old = this.isSome() ? Some(this.value) : None();
        this.value = undefined;
        this.discriminant = OptionType.None;
        return old;
    }
    transpose() {
        return this.isNone()
            ? (0, result_1.Ok)(this)
            : (this.value.isOk()
                ? (0, result_1.Ok)(Some(this.value.unwrap()))
                : (0, result_1.Err)(this.value.unwrapErr()));
    }
    unwrap() {
        return this.expect("called 'unwrap()' on a 'None' value");
    }
    unwrapOr(defaultValue) {
        return this.isSome() ? this.value : defaultValue;
    }
    unwrapOrElse(callback) {
        return this.isSome() ? this.value : callback();
    }
    unwrapUnchecked() {
        return this.value;
    }
    unzip() {
        return this.isSome()
            ? [Some(this.value[0]), Some(this.value[1])]
            : [None(), None()];
    }
    xor(option) {
        return this.isNone() ? option : (option.isNone() ? this : None());
    }
    zip(other) {
        return (this.isSome() && other.isSome())
            ? Some([this.value, other.value])
            : None();
    }
    zipWith(other, callback) {
        return (this.isSome() && other.isSome())
            ? Some(callback(this.value, other.value))
            : None();
    }
}
exports.default = Option;
var OptionType;
(function (OptionType) {
    OptionType[OptionType["Some"] = 0] = "Some";
    OptionType[OptionType["None"] = 1] = "None";
})(OptionType || (exports.OptionType = OptionType = {}));
function None() {
    return new Option(undefined, OptionType.None);
}
exports.None = None;
function Some(value) {
    return new Option(value, OptionType.Some);
}
exports.Some = Some;
//# sourceMappingURL=option.js.map