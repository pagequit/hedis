import * as Events from 'node:events';
import {
	createClient,
	RedisClientOptions,
	RedisModules,
	RedisScripts
} from 'redis';
import Channel from './classes/Channel';
import ADD from './scripts/add';

export default class Hedis extends Events {
	username: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;

	constructor(username: string, prefix: string, clientOptions: RedisClientOptions<RedisModules, RedisScripts>) {
		super();
		this.username = username;
		this.prefix = prefix;

		this.client = createClient({
			scripts: <RedisScripts> {
				ADD,
			},
			...clientOptions
		});
		this.subscriber = createClient(clientOptions);
	}

	async connect(): Promise<Hedis> {
		await this.client.connect();
		await this.subscriber.connect();

		this.emit('ready', this);

		return this;
	}

	async getChannel(name: string): Promise<Channel> {
		await this.client.SADD(`${this.prefix}:channels`, name);

		return new Channel(this, name);
	}
}
