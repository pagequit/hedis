#!/usr/bin/node
import Hedis from '../Hedis';

const hedis = new Hedis('devuser', 'hedis', {
	url: 'redis://localhost:6379',
});

hedis.connect();

hedis.once('ready', main);

hedis.on('message', async message => {
	await message.reply(`reply from ${hedis.username}!`);
});

async function main() {
	const testChannel = await hedis.getChannel('testchannel');

	await testChannel.sub(async message => {
		console.log(`${testChannel.name}: `, message.content);
	});

	await testChannel.pub(`hello from ${testChannel.name}!`);
}
