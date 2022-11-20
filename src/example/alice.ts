#!/usr/bin/node
import Hedis from '#src/Hedis';

!async function main() {
	const hedis = await (new Hedis('alice', 'hedis', {
		url: 'redis://localhost:6379',
	}).init());

	hedis.on('message', console.log);

	await hedis.request('bob', 'request from alice', console.log);

	hedis.post('bob', 'hello bob');
}();
