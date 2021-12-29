#!/usr/bin/node
//import 'dotenv/config';
import { config } from '../hedis.config';
import Hedis from './Hedis';


const hedis = new Hedis(config);

hedis.connect();

hedis.once('ready', main);

async function main(hedis: Hedis) {
	const channelName = 'discord';

	const channel = await hedis.getChannel(channelName);

	await channel.sub(message => {
		console.log('MESSAGE: ', message.content);
	});

	await channel.pub(`hello @${channelName}!`);
}
