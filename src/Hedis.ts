import * as Events from 'node:events';
import {
	createClient,
	RedisClientOptions,
	RedisModules,
	RedisScripts
} from 'redis';
import Channel from './classes/Channel';
import TIDYUP from './scripts/tidyUp';

export default class Hedis extends Events {
	username: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;

	constructor(username: string, prefix: string, clientOptions?: RedisClientOptions<RedisModules, RedisScripts>) {
		super();
		this.username = username;
		this.prefix = prefix;

		this.client = createClient({
			scripts: <RedisScripts> {
				TIDYUP,
			},
			...clientOptions
		});
		this.subscriber = createClient(clientOptions);
	}

	async connect(): Promise<Channel> {
		await this.client.connect();
		await this.subscriber.connect();

		// yes I'm aware of the potential channel collisions here
		const channel = await this.getChannel(this.username);
		channel.sub(message => {
			this.emit('message', message);
		});

		this.emit('ready', channel);

		return channel;
	}

	async getChannel(name: string): Promise<Channel> {
		await this.client.SADD(`${this.prefix}:channels`, name);

		return new Channel(this, name);
	}
}
