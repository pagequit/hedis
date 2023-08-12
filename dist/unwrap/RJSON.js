"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("./result");
class RJSON {
    static stringify(value, replacer, space) {
        try {
            return (0, result_1.Ok)(JSON.stringify(value, replacer, space));
        }
        catch (error) {
            return (0, result_1.Err)(error);
        }
    }
    static parse(text, reviver) {
        try {
            return (0, result_1.Ok)(JSON.parse(text, reviver));
        }
        catch (error) {
            return (0, result_1.Err)(error);
        }
    }
}
exports.default = RJSON;
//# sourceMappingURL=RJSON.js.map