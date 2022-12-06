"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("#core/generics/Option");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class OptionMap extends Map {
    get(key) {
        return new Option_1.default(super.get(key));
    }
}
exports.default = OptionMap;
//# sourceMappingURL=OptionMap.js.map