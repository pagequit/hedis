#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("../Hedis");
!async function main() {
    const hedis = await (new Hedis_1.default('alice', 'hedis', {
        url: 'redis://localhost:6379',
    }).init());
    hedis.on('message', (message) => {
        console.log('message: ', message);
    });
    hedis.request('bob', 'request from alice')
        .then((response) => {
        console.log('response: ', response);
        hedis.post('bob', 'hello bob');
    })
        .catch((error) => {
        console.error('error: ', error);
    });
}();
//# sourceMappingURL=alice.js.map