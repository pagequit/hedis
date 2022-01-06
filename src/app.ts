#!/usr/bin/node
import { config } from '../hedis.config';
import Hedis from './Hedis';

const { username, prefix, clientOptions } = config;
const hedis = new Hedis(username, prefix, clientOptions);

hedis.connect();

hedis.once('ready', main);

hedis.on('message', async message => {
	console.log('IN: ', message.content);
	await message.reply(`hello back from ${hedis.username}!`);
});

async function main() {
	const hellBotChannel = await hedis.getChannel('hellBot');

	await hellBotChannel.sub(async message => {
		console.log(hellBotChannel.name + ' IN: ', message.content);
	});

	for (let i = 0; i < 9; i++) {
		await hellBotChannel.pub('hello #' + i);
	}
}
