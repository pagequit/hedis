import * as Events from 'node:events';
import {
	createClient,
	defineScript,
	RedisClientOptions,
	RedisModules,
	RedisScripts
} from 'redis';
import Channel from './classes/Channel';

export default class Hedis extends Events {
	username: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: typeof this.client;

	constructor(username: string, prefix: string, clientOptions: RedisClientOptions<RedisModules, RedisScripts>) {
		super();
		this.username = username;
		this.prefix = prefix;
		this.client = createClient({
			scripts: <RedisScripts> {
				add: defineScript({
					NUMBER_OF_KEYS: 1,
					SCRIPT:
						'local val = redis.pcall("GET", KEYS[1]);' +
						'return val + ARGV[1];',
					transformArguments(key: string, toAdd: number): Array<string> {
						return [key, toAdd.toString()];
					},
					transformReply(reply: number): number {
						return reply;
					}
				})
			},
			...clientOptions
		});
		this.subscriber = this.client.duplicate();
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
