#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("#src/Hedis");
!async function main() {
    const hedis = await (new Hedis_1.default('bob', 'hedis', {
        url: 'redis://localhost:6379',
    }).init());
    hedis.on('message', (message) => {
        console.log('message: ', message);
    });
    hedis.listen((request) => {
        console.log('request: ', request.data);
        setTimeout(() => {
            request.respond('oh, hi alice');
        }, 20);
    });
}();
//# sourceMappingURL=bob.js.map