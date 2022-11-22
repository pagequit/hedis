#!/usr/bin/node
import Hedis from '#src/Hedis';

!async function main() {
	const hedis = await (new Hedis('alice', 'hedis', {
		url: 'redis://localhost:6379',
	}).init());

	hedis.on('message', console.log);

	hedis.request('bob', 'request from alice').then((res) => {
		console.log('res: ', res);

		hedis.post('bob', 'hello bob');
	});
}();
