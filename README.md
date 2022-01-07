# hedis

Hedis is a crappy little redis wrapper I wrote (based on [node-redis](https://github.com/redis/node-redis)) to have a consistent and easy to use communication interface between my nodejs projects.

## Example usage

```js
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
```

If you don't like the event-based approach, you can opt for a promise chain:

```js
const hedis = new Hedis('devuser', 'hedis', {
	url: 'redis://localhost:6379',
});

(async () => {
	await hedis.connect().then(devuserChannel => {
		devuserChannel.sub(async message => {
			await message.reply(`reply from ${hedis.username}!`);
		});
	});

	hedis.getChannel('testchannel').then(testChannel => {
		testChannel.sub(async message => {
			console.log(`${testChannel.name}: `, message.content);
		}).then(() => {
			testChannel.pub(`hello from ${testChannel.name}!`);
		});
	});
})();
```

> :warning: Keep in mind that the hedis `username` is always also a channel!
