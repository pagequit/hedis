#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_readline_1 = require("node:readline");
const node_crypto_1 = require("node:crypto");
const rl = (0, node_readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout,
});
!async function main() {
    const data = 'data: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data';
    const data2 = 'data2: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data2';
    const data3 = '';
    const hash = (0, node_crypto_1.createHash)('sha1').update(data).digest('base64');
    const hash2 = (0, node_crypto_1.createHash)('sha1').update(data2).digest('base64');
    const hash3 = (0, node_crypto_1.createHash)('sha1').update(data3).digest('base64');
    console.log(hash);
    console.log(hash2);
    console.log(hash3);
    console.log(Buffer.from(hash, 'base64').toString());
}();
//# sourceMappingURL=app.js.map