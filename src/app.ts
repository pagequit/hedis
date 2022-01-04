#!/usr/bin/node
//import 'dotenv/config';
import { config } from '../hedis.config';
import Hedis from './Hedis';

const { username, prefix, clientOptions } = config;
const hedis = new Hedis(username, prefix, clientOptions);

hedis.connect();

hedis.once('ready', main);

async function main(hedis: Hedis) {
	const channelName = 'discord';

	const channel = await hedis.getChannel(channelName);

	await channel.sub(message => {
		console.log('MESSAGE: ', message.content);
	});

	await channel.pub(`hello @${channelName}!`);

	await hedis.client.set('key', '1');
	const val = await hedis.client.add('key', 2);
	console.log(val);
}
