"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const option_1 = require("./option");
class OMap extends Map {
    /**
   * Don't use `get` on an OMap, use `oget` instead!
   * @param this force a compile time error
   */
    get(key) {
        throw Error("Don't use `get` on an OMap, use `oget` instead!");
    }
    oget(key) {
        const value = super.get(key);
        return value === undefined ? (0, option_1.None)() : (0, option_1.Some)(value);
    }
}
exports.default = OMap;
//# sourceMappingURL=OMap.js.map