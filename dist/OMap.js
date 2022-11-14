"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mod_1 = require("@pagequit/unwrap/mod");
class OMap extends Map {
    /**
   * Don't use `get` on an OMap, use `oget` instead!
   * @param this force a compile time error
   * @param key
   */
    get(key) {
        throw Error("Don't use `get` on an OMap, use `oget` instead!");
    }
    oget(key) {
        const value = super.get(key);
        return value === undefined ? (0, mod_1.None)() : (0, mod_1.Some)(value);
    }
}
exports.default = OMap;
//# sourceMappingURL=OMap.js.map