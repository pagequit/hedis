#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("#src/Hedis");
!async function main() {
    const hedis = await (new Hedis_1.default('alice', 'hedis', {
        url: 'redis://localhost:6379',
    }).init());
    hedis.on('message', console.log);
    hedis.request('bob', 'request from alice').then((res) => {
        console.log('res: ', res);
        hedis.post('bob', 'hello bob');
    }).catch(console.log);
}();
//# sourceMappingURL=alice.js.map