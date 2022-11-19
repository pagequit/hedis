#!/usr/bin/node
import Hedis from '#src/Hedis';

const hedis = new Hedis('alice', 'hedis', {
	url: 'redis://localhost:6379',
});

hedis.connect();

hedis.once('ready', main);

hedis.on('message', (message) => {
	console.log(message);
});

hedis.on('post', (post) => {
	console.log(post.content);
});

hedis.on('request', async (request) => {
	console.log(request.body.content);
	await request.ack();
});

async function main() {
	const bob = hedis.channels.oget('bob')
		.unwrapOr(await hedis.createChannel('bob'));

	await bob.pub('post from alice');

	// await bob.syn();
	// const res = await bob.send('message from alice');
	// console.log(res);
}
