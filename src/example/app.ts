#!/usr/bin/node
import Hedis from '../Hedis';
import { createInterface } from 'node:readline';

const hedis = new Hedis('devuser', 'hedis', {
	url: 'redis://localhost:6379',
});

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

hedis.connect();

hedis.once('ready', main);

hedis.on('message', async message => {
	console.log(message.content);
});

async function main() {
	const hellBot = await hedis.getChannel('hellBot');

	rl.on('line', async (message: string) => {
		await hellBot.pub(message);
	});
}
