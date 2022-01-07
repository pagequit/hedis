"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const redis_1 = require("redis");
exports.default = (0, redis_1.defineScript)({
    NUMBER_OF_KEYS: 1,
    SCRIPT: (0, node_fs_1.readFileSync)(__dirname + './../../../lua/TIDYUP.lua', 'utf8'),
    transformArguments(key) {
        return [key];
    },
    transformReply(reply) {
        return reply;
    }
});
//# sourceMappingURL=tidyUp.js.map