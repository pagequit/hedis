#!/usr/bin/node
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

!async function main() {
	const data = 'data: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data';
	const data2 = 'data2: TCP uses a three-way handshake to set up a TCP/IP connection over an IP based network. :data2';
	const data3 = '';

	const hash = createHash('sha1').update(data).digest('base64');
	const hash2 = createHash('sha1').update(data2).digest('hex');
	const hash3 = createHash('sha1').update(data3).digest('base64');

	console.log(hash);
	console.log(hash2);
	console.log(hash3);

	console.log(Buffer.from(hash, 'base64').toString());
}();
