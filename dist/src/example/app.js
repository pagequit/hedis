#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("../Hedis");
const hedis = new Hedis_1.default('devuser', 'hedis', {
    url: 'redis://localhost:6379',
});
hedis.connect();
hedis.once('ready', main);
hedis.on('message', async (message) => {
    await message.reply(`reply from ${hedis.username}!`);
});
async function main() {
    const testChannel = await hedis.getChannel('testchannel');
    await testChannel.sub(async (message) => {
        console.log(`${testChannel.name}: `, message.content);
    });
    await testChannel.pub(`hello from ${testChannel.name}!`);
}
//# sourceMappingURL=app.js.map