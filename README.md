# hedis

Hedis is a crappy little redis wrapper I wrote (based on [node-redis](https://github.com/redis/node-redis)) to have a consistent and easy to use communication interface between my nodejs projects.

## Example usage

[bob.ts](src/example/bob.ts)
```ts
import Hedis from 'hedis';

!async function main() {
	const hedis = await (new Hedis('bob', 'hedis', {
		url: 'redis://localhost:6379',
	}).init());

	hedis.on('message', (message) => {
		console.log('message: ', message);
	});

	hedis.listen((request) => {
		console.log('request: ', request.data);

		setTimeout(() => {
			request.respond('oh, hi alice');
		}, 20);

	});
}();
```

[alice.ts](src/example/alice.ts)
```ts
import Hedis from 'hedis';

!async function main() {
	const hedis = await (new Hedis('alice', 'hedis', {
		url: 'redis://localhost:6379',
	}).init());

	hedis.on('message', (message) => {
		console.log('message: ', message);
	});

	hedis.request('bob', 'request from alice')
		.then((response) => {
			console.log('response: ', response);

			hedis.post('bob', 'hello bob');
		})
		.catch((error) => {
			console.error('error: ', error);
		});
}();
```

> :warning: Keep in mind that the hedis `username` is always also a channel!
