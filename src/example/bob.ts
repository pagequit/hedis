#!/usr/bin/node
import Hedis from '#src/Hedis';

!async function main() {
	const hedis = await (new Hedis('bob', 'hedis', {
		url: 'redis://localhost:6379',
	}).init());

	hedis.on('message', console.log);

	hedis.listen((req, res) => {
		console.log('req: ', req);
		setTimeout(() => {
			res.end('oh, hi alice');
		}, 1);

	});
}();
