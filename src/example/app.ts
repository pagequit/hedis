#!/usr/bin/node
import Hedis from '#src/Hedis';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';

const hedis = new Hedis('alice', 'hedis', {
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

	const bob = await hedis.syn('bob')
		.catch(console.log);

	bob.send('')


	// const data = 'data: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data';
	// const data2 = 'data2: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data2';
	// const data3 = '';
	// const hash = createHash('sha1').update(data).digest('base64');
	// const hash2 = createHash('sha1').update(data2).digest('base64');
	// const hash3 = createHash('sha1').update(data3).digest('base64');
	// console.log(hash);
	// console.log(hash2);
	// console.log(hash3);
}
