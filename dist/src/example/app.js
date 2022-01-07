#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hedis_1 = require("../Hedis");
const hedis = new Hedis_1.default('devtest', 'hedis');
hedis.connect();
hedis.once('ready', main);
hedis.on('message', async (message) => {
    console.log('IN: ', message.content);
    await message.reply(`hello back from ${hedis.username}!`);
});
async function main() {
    const hellBotChannel = await hedis.getChannel('testChannel');
    await hellBotChannel.sub(async (message) => {
        console.log(hellBotChannel.name + ' IN: ', message.content);
    });
    for (let i = 0; i < 9; i++) {
        await hellBotChannel.pub('hello #' + i);
    }
}
//# sourceMappingURL=app.js.map