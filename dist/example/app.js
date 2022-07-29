#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("../Hedis");
const node_readline_1 = require("node:readline");
const hedis = new Hedis_1.default('devuser', 'hedis', {
    url: 'redis://localhost:6379',
});
const rl = (0, node_readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout,
});
hedis.connect();
hedis.once('ready', main);
hedis.on('message', async (message) => {
    console.log(message.content);
});
async function main() {
    const hellBot = await hedis.getChannel('hellBot');
    rl.on('line', async (message) => {
        await hellBot.pub(message);
    });
}
//# sourceMappingURL=app.js.map