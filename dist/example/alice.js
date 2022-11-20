#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("#src/Hedis");
!async function main() {
    const hedis = await (new Hedis_1.default('alice', 'hedis', {
        url: 'redis://localhost:6379',
    }).init());
    hedis.on('message', console.log);
    await hedis.request('bob', 'request from alice', console.log);
    hedis.post('bob', 'hello bob');
}();
//# sourceMappingURL=alice.js.map