import * as Events from 'node:events';
import {
	createClient,
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts
} from 'redis';
import Channel from '#src/Channel';
import OMap from '#src/unwrap/OMap';
import { ACK, PST, REQ, SYN } from '#src/message/handler/index';
import { MessageType, MessageHandler } from '#src/Message';
import TIDYUP from '#src/scripts/tidyUp';

export default class Hedis extends Events {
	name: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;
	channel: Channel;
	channels: OMap<string, Channel>;
	handler: OMap<MessageType, MessageHandler>;

	constructor(name: string, prefix: string, clientOptions?: RedisClientOptions<RedisModules, RedisFunctions>) {
		super();
		this.name = name;
		this.prefix = prefix;

		this.client = createClient({
			scripts: <RedisScripts> {
				TIDYUP,
			},
			...clientOptions
		});
		this.subscriber = createClient(clientOptions);

		this.channels = new OMap();
		this.handler = new OMap([
			[MessageType.ACK, ACK],
			[MessageType.PST, PST],
			[MessageType.REQ, REQ],
			[MessageType.SYN, SYN],
		]);
	}

	async connect(): Promise<Channel> {
		await this.client.connect();
		await this.subscriber.connect();

		// yes I'm aware of the potential channel collisions here
		const channel = await this.createChannel(this.name);
		this.channel = channel;

		channel.sub((message) => {
			// TODO: use handler here
			this.emit('message', message);
		});

		this.emit('ready', channel);

		return channel;
	}

	async createChannel(name: string): Promise<Channel> {
		await this.client.SADD(`${this.prefix}:channels`, name);

		return new Channel(this, name);
	}
}
